import styles from './sidebar.css?raw';
import scrollbar from '../../../css/scrollbar.css?raw';

function renderTemplate() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/`
        <div class="sidebar-scroll">
            <section class="sidebar-header">
                <img src="/img/vite.svg" class="sidebar-img" alt="logo"/>
                <a class="sidebar-header-icon">
                    <svg class="icon-sidebar-header" viewBox="-0.5 -0.5 16.9 16.9">
                    ${Globals.icons.querySelector(`#caret-left`).innerHTML}
                    </svg>
                </a>
            </section>
            <section class="sidebar-menu">
                <a class="sidebar-item active" title="Dashboard" data-route-name="dashboard" data-roles="admin,user">
                    <svg class="icon-sidebar" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#bar-chart-line-fill`).innerHTML}
                    </svg>
                    <span>Dashboard</span>
                </a>
                <a class="sidebar-item" title="Posts" data-route-name="posts" data-roles="admin,user">
                    <svg class="icon-sidebar" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#chat-left-text`).innerHTML}
                    </svg>
                    <span>Posts</span>
                </a>
                <a class="sidebar-item" title="About" data-route-name="about" data-roles="admin,user">
                    <svg class="icon-sidebar" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#info-square-fill`).innerHTML}
                    </svg>
                    <span>About</span>
                </a>
                <div class="sidebar-separator"></div>
                <a class="sidebar-item" title="Account" data-route-name="accounts" data-roles="admin">
                    <svg class="icon-sidebar" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#person-lines-fill`).innerHTML}
                    </svg>
                    <span>Accounts</span>
                </a>
                <a class="sidebar-item" title="Settings" data-route-name="settings" data-roles="admin,user">
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
        const result = this.filterItemsForRole();
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
        const { route } = e.detail;
        this.shadowRoot.querySelectorAll(".sidebar-item").forEach((item) => {
            item.className = (route.name.split(".")[0] == item.getAttribute("data-route-name")) ? "sidebar-item active" : "sidebar-item";
        });
    }

    filterItemsForRole() {
        const user = JSON.parse(localStorage.getItem("user"));
        const items = this.shadowRoot.querySelectorAll(".sidebar-item");
        items.forEach(item => {
            item.style.display = this.isDisplayed(user, item.getAttribute("data-roles")) ? "" : "none";
        });
        return true;
    }

    isDisplayed(user, roles) {
        let filterItemsForRole = false;
        if (user)
            for (const role of roles.split(","))
                if (user.role.toLowerCase() == role.toLowerCase())
                    filterItemsForRole = true;
        return filterItemsForRole;
    }
}