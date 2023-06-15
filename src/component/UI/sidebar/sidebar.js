import styles from './sidebar.css?raw';
import scrollbar from '../../../css/scrollbar.css?raw';

function renderTemplate() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/`
        <div class="sidebar-scroll">
            <section class="sidebar-header">
                <img src="img/vite.svg" class="sidebar-img"/>
                <a class="sidebar-header-icon">
                    <svg>to be</svg>
                </a>
            </section>
            <section class="sidebar-menu">
                <a class="sidebar-item active" title="dashboard" data-route-name="dashboard">
                    <svg class="icon icon-sidebar" viewBox="0 0 23 23">
                        ${GlobalVariables.icons.querySelector(`#chart-dots`).innerHTML}
                    </svg>
                </a>
                <a class="sidebar-item" title="about" data-route-name="about">
                    <svg class="icon icon-sidebar" viewBox="0 0 23 23">
                        ${GlobalVariables.icons.querySelector(`#info-octagon`).innerHTML}
                    </svg>
                </a>
                <a class="sidebar-item" title="not found" data-route-name="qwerty">
                    <svg class="icon icon-sidebar" viewBox="0 0 23 23">
                        ${GlobalVariables.icons.querySelector(`#question-mark`).innerHTML}
                    </svg>
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
        const sidebarHeaderIcon = this.shadowRoot.querySelector(".sidebar-header-icon");
        sidebarHeaderIcon.addEventListener("click", (e) => {
            e.preventDefault();
            this.toggleResponsiveSidebar(e);
        });
        this.shadowRoot.querySelectorAll(".sidebar-item").forEach(item => {
            item.addEventListener('click', (e) => this.navigate(e));
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
        document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: routeName}));
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