import styles from './settings.css?raw';

function renderTemplate() {
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
        <div style="padding: 2rem;">
            <h1>Settings</h1>
            <button style="background-color: var(--secondary-color); color: #fff; padding: 0.5rem 1rem;">
                Logout
            </button>
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
        this.shadowRoot.querySelector("button").addEventListener("click", (e) => this.logout());
    }

    disconnectedCallback() {

    }

    logout() {
        localStorage.clear();
        document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "login"} }));
    }
}