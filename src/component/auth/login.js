import styles from './auth.css?raw';
import form from '../../css/form.css?raw';
import input from '../../css/input.css?raw';
import button from '../../css/button.css?raw';

import authService from '../../service/AuthService';
import uiService from '../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <h1 class="auth-title">Welcome</h1>
        <h4 class="auth-subtitle">Login to proceed to the Awesome Posts Dashboard.</h4>
        <form action="" id="loginForm">
            <div class="form-row">
                <label for="identity">Username/Email address</label>
                <input type="text" class="input-text" id="identity" name="identity" required>
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
            <div class="form-row form-row-two-fields form-row-login">
                <a class="form-row-field auth-link" id="btnGuest">Forgot Password?</a>
                <button type="submit" class="form-row-field btn-form btn-form-border btn-submit" id="btnSubmit">
                    LOGIN  
                </button>
            </div>
        </form>
        <div class="mt-2 d-flex flex-row justify-content-center">
            
        </div>
    `;
  return template;
}

export class Login extends HTMLElement {
  constructor() {
      super();

      const shadow = this.attachShadow({ mode: "open" });
      const template = renderTemplate();
      shadow.appendChild(template.content.cloneNode(true));

      const stylesheet  = new CSSStyleSheet();
      const formsheet   = new CSSStyleSheet();
      const inputsheet  = new CSSStyleSheet();
      const buttonsheet = new CSSStyleSheet();
      stylesheet.replace(styles);
      formsheet.replace(form);
      inputsheet.replace(input);
      buttonsheet.replace(button);
      shadow.adoptedStyleSheets = [stylesheet, formsheet, inputsheet, buttonsheet];
  }

  connectedCallback() {
    const sroot = this.shadowRoot;
    sroot.querySelector("#passwordToggle").addEventListener("click", (e) => this.togglePassword(e));
    sroot.querySelector("#loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const btnSubmit = this.shadowRoot.querySelector("#btnSubmit");
        const btnText = btnSubmit.innerHTML;
        try {
          uiService.toggleButton(btnSubmit, btnText, false);
          await this.login(e);
        } 
        finally {
          uiService.toggleButton(btnSubmit, btnText, true);
        }
    });
  }

  disconnectedCallback() {

  }

  async login(e) {
    try {
      const user = await authService.login(e.target);
      this.postLogin(user);
    } 
    catch (err) {
      uiService.showAlert("Error", err.message);
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