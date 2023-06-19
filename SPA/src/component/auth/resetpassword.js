import styles from './auth.css?raw';
import form from '../../css/form.css?raw';
import input from '../../css/input.css?raw';

import authService from '../../service/AuthService';
import uiService from '../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <h1 class="auth-title">Reset Password</h1>
        <h4 class="auth-subtitle">Please reset your password below.</h4>
        <form action="" id="resetForm">
            <input type="hidden" id="token" name="passwordResetToken">
            <div class="form-row">
                <label for="password">New Password</label>
                <div class="input-password-hide-show">
                  <input type="password" class="input-text input-text-border" id="newPassword" name="newPassword" required>
                  <svg class="icon-password" id="newPasswordToggle" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#eye`).innerHTML}
                  </svg>
                </div>
            </div>
            <div class="form-row">
                <label for="password">Confirm Password</label>
                <div class="input-password-hide-show">
                  <input type="password" class="input-text input-text-border" id="confirmNewPassword" name="confirmNewPassword" required>
                  <svg class="icon-password" id="confirmNewPasswordToggle" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#eye`).innerHTML}
                  </svg>
                </div>
            </div>
            <div class="form-row" style="padding-top: 1rem;">
                <button type="submit" style="display: none;"></button>
                <app-button class="w-100" data-classes="btn btn-secondary w-100" id="btnSubmit">
                  <span slot="text">RESET PASSWORD</span>
                </app-button>
            </div>
            <div class="form-row" style="text-align:center;">
              <a class="auth-link" id="btnLogin">Login</a>
            </div>
        </form>
    `;
  return template;
}

export class ResetPassword extends HTMLElement {
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
    this.setToken();
    const sroot = this.shadowRoot;
    sroot.querySelectorAll("#icon-password").forEach(icon => icon.addEventListener("click", (e) => this.togglePassword(e)));
    const form = sroot.querySelector("#resetForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.resetPassword(e);
    });
    sroot.querySelector("#btnSubmit").addEventListener("click", async (e) => await this.resetPassword(new FormData(form)));
    sroot.querySelector("#btnLogin").addEventListener("click", (e) => this.navigateToLogin());
  }

  disconnectedCallback() {

  }

  setToken() {
    const query = window.location.toString().split("?")[1];
    const token = query ? query.split("=")[1] : null;
    if (!token) {
      uiService.showAlert("Error", "Please click on the reset password link again.");
      setTimeout(() => this.navigateToLogin(), 1111);
    }
    else
      this.shadowRoot.querySelector("#token").value = token;
  }

  async resetPassword(e) {
    const button = this.shadowRoot.querySelector("#btnSubmit");
    try {
      button.setAttribute("data-is-loading", true);
      const user = await authService.resetPassword(e.target);
      uiService.showAlert("Success", "Password has been reset.");
      this.navigateToLogin();
    } 
    catch (err) {
      uiService.showAlert("Error", err.message);
    }
    finally {
      button.setAttribute("data-is-loading", false);
    }
  }

  togglePassword(e) {
    const password = this.shadowRoot.querySelector(`#${e.target.id.split("Toggle")[0]}`);
    password.setAttribute("type", (password.type == "password") ? "text" : "password");
    e.target.setAttribute("data-icon", (e.target.getAttribute("data-icon") == "eye") ? "eye-slash" : "eye"); 
  }

  navigateToLogin() {
    this.shadowRoot.getRootNode().innerHTML = "<app-login></app-login>";
    history.pushState({ component: "app-login" }, null,`/login`);
  }
}