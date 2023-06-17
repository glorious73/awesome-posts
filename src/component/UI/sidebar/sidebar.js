import styles from './sidebar.css?raw';
import scrollbar from '../../../css/scrollbar.css?raw';

function renderTemplate() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/`
        <div class="sidebar-scroll">
            <section class="sidebar-header">
                <img src="img/vite.svg" class="sidebar-img"/>
                <a class="sidebar-header-icon">
                    <svg class="icon-sidebar-header" viewBox="-0.5 -0.5 16.9 16.9">
                    ${Globals.icons.querySelector(`#caret-left`).innerHTML}
                    </svg>
                </a>
            </section>
            <section class="sidebar-menu">
                <a class="sidebar-item active" title="Dashboard" data-route-name="dashboard">
                    <svg class="icon-sidebar" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#bar-chart-line-fill`).innerHTML}
                    </svg>
                    <span>Dashboard</span>
                </a>
                <a class="sidebar-item" title="About" data-route-name="about">
                    <svg class="icon-sidebar" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#info-square-fill`).innerHTML}
                    </svg>
                    <span>About</span>
                </a>
                <a class="sidebar-item" title="Not found" data-route-name="qwerty">
                    <svg class="icon-sidebar" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#question-square-fill`).innerHTML}
                    </svg>
                    <span>Qwerty</span>
                </a>
                <div class="sidebar-separator"></div>
                <a class="sidebar-item" title="Settings" data-route-name="settings">
                    <svg class="icon-sidebar" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#gear`).innerHTML}
                    </svg>
                    <span>Settings</span>
                </a>
            </section>
        </div>
    `;
    return template;
}

export class Sidebar extends HTMLElement {
    constructor() {
        super();

        const shadow   = this.attachShadow({ mode: "open" });
        const template = renderTemplate();
        shadow.appendChild(template.content.cloneNode(true));
        
        const sidebarsheet   = new CSSStyleSheet();
        const scrollbarsheet = new CSSStyleSheet();
        sidebarsheet.replace(styles);
        scrollbarsheet.replace(scrollbar);
        shadow.adoptedStyleSheets = [sidebarsheet, scrollbarsheet];
    }

    connectedCallback() {
        this.handleLocationChange = (e) => this.updateActiveItem(e);
        document.addEventListener("LocationChangedEvent", this.handleLocationChange);
        this.shadowRoot.querySelectorAll(".sidebar-item").forEach(item => {
            item.addEventListener('click', (e) => { 
                this.navigate(e);
                document.dispatchEvent(new CustomEvent("ResponsiveSidebarEvent"));
            });
        });
        const sidebarHeaderIcon = this.shadowRoot.querySelector(".sidebar-header-icon");
        sidebarHeaderIcon.addEventListener("click", (e) => {
            e.preventDefault();
            document.dispatchEvent(new CustomEvent("ResponsiveSidebarEvent"));
        });
    }

    disconnectedCallback() {
        document.removeEventListener("LocationChangedEvent", this.handleLocationChange);
    }

    navigate(e) {
        e.preventDefault();
        const routeName = (e.target.getAttribute('data-route-name') 
                        || e.target.parentNode.getAttribute('data-route-name'))
                        || e.target.parentNode.parentNode.getAttribute('data-route-name');
        document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: routeName }}));
    }

    updateActiveItem(e) {
        const route = e.detail;
        this.shadowRoot.querySelectorAll(".sidebar-item").forEach((item) => {
            item.className = (route.url == item.getAttribute("data-route-name")) ? "sidebar-item active" : "sidebar-item";
        });
        if(route.url == '')
            this.shadowRoot.querySelector('.sidebar-item').className = 'sidebar-item active';
    }
}