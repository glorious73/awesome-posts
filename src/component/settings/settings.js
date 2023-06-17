import styles from './settings.css?raw';

function renderTemplate() {
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
        <div style="padding: 2rem;">
            <h1>Settings</h1>
            <app-button data-text="Logout" data-classes="btn btn-secondary">
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
        localStorage.clear();
        document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "login"} }));
    }
}