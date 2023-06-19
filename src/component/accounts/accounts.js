import styles from './accounts.css?raw';
import tabs from '../../css/tabs.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <h1 class="tab-header">
          Accounts
        </h1>
        <div class="tab-links">
            <a class="tab-link active" id="users">Users</a>
            <a class="tab-link" id="roles">Roles</a>
        </div>
        <div id="tab">
        
        </div>
    `;
  return template;
}

export class Accounts extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const template = renderTemplate();
    shadow.appendChild(template.content.cloneNode(true));

    const stylesheet = new CSSStyleSheet();
    const tabssheet = new CSSStyleSheet();
    stylesheet.replace(styles);
    tabssheet.replace(tabs);
    shadow.adoptedStyleSheets = [stylesheet, tabssheet];
  }

  connectedCallback() {
    // component
    this.loadComponent();
    this.shadowRoot.querySelectorAll(".tab-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.changeComponent(e.target.id);
      });
    });
  }

  disconnectedCallback() {

  }

  loadComponent() {
    const path      = location.toString();
    const component = path.substring(path.lastIndexOf("/") + 1);
    this.changeComponent(component);
  }

  changeComponent(component) {
    const tab = this.shadowRoot.querySelector("#tab");
    switch (component) {
      case "users":
        tab.innerHTML = "<app-users></app-users>";
        break;
      case "roles":
        tab.innerHTML = "<app-roles></app-roles>";
        break;
      default:
        component = "users";
        tab.innerHTML = "<app-users></app-users>";
    }
    this.changeActiveTab(component);
    
  }

  changeActiveTab(activeTab) {
    this.shadowRoot.querySelectorAll(".tab-link").forEach((tab) => {
      tab.className = (tab.id == activeTab) ? "tab-link active" : "tab-link";
    });
    history.pushState({ component: activeTab }, null,`/accounts/${activeTab}`);
  }
}