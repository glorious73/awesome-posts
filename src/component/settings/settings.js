import styles from './settings.css?raw';

import crudService from '../../service/CRUDservice';
import authService from '../../service/AuthService';
import uiService from '../../service/UIService';

function renderTemplate() {
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
        <div class="container">
            <h1 class="title">Settings</h1>
            <div class="card section">
                <div class="entry">
                    <h2 class="key">Application</h2>
                    <h2>Awesome Posts</h2>
                </div>
                <div class="entry">
                    <h2 class="key">Version</h2>
                    <h2>0.1.0</h2>
                </div>
                <div class="entry">
                    <h2 class="key">Data Source</h2>
                    <h2 id="dataSource"></h2>
                </div>
            </div>
            <h1 class="title">Cache</h1>
            <div class="card section">
                <div class="entry">
                    <h2 class="key">Filters</h2>
                    <app-button data-classes="btn btn-secondary btn-settings" id="btnFilter">
                        <span slot="text">
                            <svg class="icon-entry" viewBox="-0.5 -0.5 16.9 16.9">
                                ${Globals.icons.querySelector(`#lightning`).innerHTML}
                            </svg>
                            Clear
                        </span>
                    </app-button>
                </div>
                <div class="entry">
                    <h2 class="key">Lists</h2>
                    <app-button data-classes="btn btn-secondary btn-settings" id="btnList">
                        <span slot="text">
                            <svg class="icon-entry" viewBox="-0.5 -0.5 16.9 16.9">
                                ${Globals.icons.querySelector(`#lightning`).innerHTML}
                            </svg>
                            Clear
                        </span>
                    </app-button>
                </div>
            </div>
            <h1 class="title">Profile</h1>
            <div class="card section">
                <div class="entry">
                    <h2 class="key">Name</h2>
                    <h2 class="profileItem" id="name"></h2>
                </div>
                <div class="entry">
                    <h2 class="key">Username</h2>
                    <h2 class="profileItem" id="username"></h2>
                </div>
                <div class="entry">
                    <h2 class="key">Email Address</h2>
                    <h2 class="profileItem" id="email"></h2>
                </div>
                <div class="entry">
                    <h2 class="key">Logout</h2>
                    <app-button data-classes="btn btn-secondary btn-settings" id="btnLogout">
                        <span slot="text">
                            <svg class="icon-entry" viewBox="-0.5 -0.5 16.9 16.9">
                                ${Globals.icons.querySelector(`#arrow-bar-right`).innerHTML}
                            </svg>
                            Logout
                        </span>
                    </app-button>
                </div>
            </div>
        </div>
    `;
    return template;
}

export class Settings extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        const template = renderTemplate();
        shadow.appendChild(template.content.cloneNode(true));

        const stylesheet = new CSSStyleSheet();
        stylesheet.replace(styles);
        shadow.adoptedStyleSheets = [stylesheet];
    }

    async connectedCallback() {
        const sroot = this.shadowRoot;
        // Cache
        sroot.querySelector("#btnFilter").addEventListener("click", () => this.invalidateCache("filter"));
        sroot.querySelector("#btnList").addEventListener("click", () => this.invalidateCache("list"));
        // Profile
        const user = JSON.parse(localStorage.getItem("user"));
        sroot.querySelectorAll(".profileItem").forEach(item => item.innerHTML = user[item.id]);
        sroot.querySelector("#btnLogout").addEventListener("click", (e) => authService.logout());
        // Data source
        this.dataSource = await this.getDataSource();
        sroot.querySelector("#dataSource").innerHTML = this.dataSource;
    }

    disconnectedCallback() {
        localStorage.setItem("dataSource", this.dataSource);
    }

    async getDataSource() {
        let dataSource = localStorage.getItem("dataSource");
        try {
            if(dataSource == undefined || dataSource == null) {
                const result = await crudService.getItems("/api/metadata/"); // TODO: Endpoint
                dataSource   = "N/A";
            } 
        }
        catch(err) {
            console.error("Error", `Could not get Data Source. ${err}`);
            dataSource = "N/A";
        }
        return dataSource;
    }

    invalidateCache(type) {
        let numKeys = 0;
        for(var key in localStorage) {
            if(key.startsWith(type)) {
                localStorage.removeItem(key);
                numKeys++;
            }
        }
        uiService.showAlert("Information", `${type}s cache cleared successfully (${numKeys}).`);
    }
}