import styles from './auth.css?raw';
import form from '../../css/form.css?raw';
import input from '../../css/input.css?raw';

import authService from '../../service/AuthService';
import uiService from '../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <h1 class="auth-title">Forgot Password?</h1>
        <h4 class="auth-subtitle">Please enter your email below for reset instructions.</h4>
        <form action="" id="forgotForm">
            <div class="form-row">
                <label for="identity">Email address</label>
                <input type="text" class="input-text" id="emailAddress" name="emailAddress" required>
            </div>
            <div class="form-row" style="padding-top: 1rem;">
                <button type="submit" style="display: none;"></button>
                <app-button class="w-100" data-classes="btn btn-secondary w-100" id="btnSubmit">
                  <span slot="text">SEND EMAIL</span>
                </app-button>
            </div>
            <div class="form-row" style="text-align:center;">
              <a class="auth-link" id="btnLogin">Login</a>
            </div>
        </form>
    `;
  return template;
}

export class ForgotPassword extends HTMLElement {
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
    const form = sroot.querySelector("#forgotForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.sendResetEmail(e);
    });
    sroot.querySelector("#btnSubmit").addEventListener("click", async (e) => await this.sendResetEmail(new FormData(form)));
    sroot.querySelector("#btnLogin").addEventListener("click", (e) => { 
      this.shadowRoot.getRootNode().innerHTML = "<app-login></app-login>";
      history.pushState({ component: "app-login" }, null,`/login`);
    });
  }

  disconnectedCallback() {

  }

  async sendResetEmail(e) {
    const button = this.shadowRoot.querySelector("#btnSubmit");
    try {
      button.setAttribute("data-is-loading", true);
      const result = await authService.sendResetPasswordEmail(e.target);
    } 
    catch (err) {
      uiService.showAlert("Error", err.message);
    }
    finally {
      button.setAttribute("data-is-loading", false);
    }
  }
}