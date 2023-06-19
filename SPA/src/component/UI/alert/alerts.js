import styles from './alert.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div id="toasters">
        
        </div> 
    `;
  return template;
}

export class Alerts extends HTMLElement {
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
    this.handleAlert = (e) => this.addAlert(e);
    document.addEventListener("AlertEvent", this.handleAlert);
  }

  disconnectedCallback() {
    document.removeEventListener("AlertEvent", this.handleAlert);
  }

  addAlert(e) {
    const toasters = this.shadowRoot.querySelector("#toasters");
    toasters.innerHTML += `
            <app-alert data-status="${e.detail.status}" data-message="${e.detail.message}"></app-alert>
        `;
    setTimeout(() => this.clearAlerts(toasters), 5000);
  }

  clearAlerts(toasters) {
    if (toasters.innerHTML != "") toasters.innerHTML = "";
  }
}
