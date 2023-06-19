import styles from './auth.css?raw';

import uiService from '../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <div class="auth">
        <div class="auth-logos">
            <img src="/img/undraw_posts.svg" class="img-auth-image" alt="dashboard illustration" />
            <img src="/img/vite.svg" class="img-auth-logo" alt="Vite logo"/>
        </div>
        <div class="auth-form">
        </div>  
    </div>
    `;
  return template;
}

export class Auth extends HTMLElement {
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
    uiService.toggleUserUI(false);
    this.addAuthComponent();
  }

  disconnectedCallback() {

  }

  addAuthComponent() {
    const { pathname } = window.location;
    const authForm = this.shadowRoot.querySelector(".auth-form");
    if(pathname == "/login")
      authForm.innerHTML = `<app-login></app-login>`;
    else if(pathname == "/password/forgot")
      authForm.innerHTML = '<app-forgot-password></app-forgot-password>';
    else if(pathname == "/password/reset")
      authForm.innerHTML = '<app-reset-password></app-reset-password>';
    else
      authForm.innerHTML = `<app-login></app-login>`; // default
  }
}