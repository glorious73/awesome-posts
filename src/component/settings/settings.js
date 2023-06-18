import styles from './settings.css?raw';

import authService from '../../service/AuthService';

function renderTemplate() {
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
        <div style="padding: 2rem;">
            <h1>Settings</h1>
            <app-button data-classes="btn btn-secondary">
                <span slot="text">Logout</span>
            </app-button>
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

    connectedCallback() {
        this.shadowRoot.querySelector("app-button").addEventListener("click", (e) => this.logout());
    }

    disconnectedCallback() {

    }

    logout() {
        authService.logout();
    }
}