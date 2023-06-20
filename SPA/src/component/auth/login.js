import styles from './auth.css?raw';
import form from '../../css/form.css?raw';
import input from '../../css/input.css?raw';

import authService from '../../service/AuthService';
import uiService from '../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <h1 class="auth-title">Welcome</h1>
        <h4 class="auth-subtitle">Login to proceed to the Awesome Posts Dashboard.</h4>
        <form action="" id="loginForm">
            <div class="form-row">
                <label for="username">Username/Email address</label>
                <input type="text" class="input-text" id="username" name="username" required>
            </div>
            <div class="form-row">
                <label for="password">Password</label>
                <div class="input-password-hide-show">
                  <input type="password" class="input-text input-text-border" id="password" name="password" required>
                  <svg class="icon-password" id="passwordToggle" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#eye`).innerHTML}
                  </svg>
                </div>
            </div>
            <div class="form-row" style="padding-top: 1rem;">
                <button type="submit" style="display: none;"></button>
                <app-button class="w-100" data-classes="btn btn-secondary w-100" id="btnSubmit">
                  <span slot="text">LOGIN</span>
                </app-button>
            </div>
            <div class="form-row" style="text-align:center;">
              <a class="auth-link" id="btnForgot">Forgot Password?</a>
            </div>
        </form>
    `;
  return template;
}

export class Login extends HTMLElement {
  constructor() {
      super();

      const shadow = this.attachShadow({ mode: "open" });
      const template = renderTemplate();
      shadow.appendChild(template.content.cloneNode(true));

      const stylesheet = new CSSStyleSheet();
      const formsheet  = new CSSStyleSheet();
      const inputsheet = new CSSStyleSheet();
      stylesheet.replace(styles);
      formsheet.replace(form);
      inputsheet.replace(input);
      shadow.adoptedStyleSheets = [stylesheet, formsheet, inputsheet];
  }

  connectedCallback() {
    const sroot = this.shadowRoot;
    sroot.querySelector("#passwordToggle").addEventListener("click", (e) => this.togglePassword(e));
    const form = sroot.querySelector("#loginForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.login(e.target);
    });
    sroot.querySelector("#btnSubmit").addEventListener("click", async (e) => await this.login(form));
    sroot.querySelector("#btnForgot").addEventListener("click", (e) => { 
      this.shadowRoot.getRootNode().innerHTML = "<app-forgot-password></app-forgot-password>";
      history.pushState({ component: "app-forgot-password" }, null,`/password/forgot`);
    });
  }

  disconnectedCallback() {

  }

  async login(form) {
    const button = this.shadowRoot.querySelector("#btnSubmit");
    try {
      button.setAttribute("data-is-loading", true);
      const user = await authService.login(form);
      this.postLogin(user);
    } 
    catch (err) {
      uiService.showAlert("Error", err.message);
    }
    finally {
      button.setAttribute("data-is-loading", false);
    }
  }

  postLogin(user) {
    localStorage.setItem("user", JSON.stringify(user));
    uiService.toggleUserUI(true);
    document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "dashboard" } }));
  }

  togglePassword(e) {
    const password = this.shadowRoot.querySelector("#password");
    password.setAttribute("type", (password.type == "password") ? "text" : "password");
    e.target.setAttribute("data-icon", (e.target.getAttribute("data-icon") == "eye") ? "eye-slash" : "eye"); 
  }
}