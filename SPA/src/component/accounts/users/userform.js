import styles from './users.css?raw';
import input from '../../../css/input.css?raw';
import form from '../../../css/form.css?raw';

import crudService from '../../../service/CRUDservice';
import uiService from '../../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="form-container fade-in">
            <div class="form-flex">
              <div class="form-title-wrapper">
                  <a class="form-title-back-btn" id="btnBack">
                    <svg class="icon-form-back" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#arrow-left-circle`).innerHTML}
                    </svg>
                  </a>
                  <h1 class="form-title">ADD USER</h1>
              </div>
              <form action="" id="userForm"></form>
              <div class="mt-1">
                  <h2 class="form-flex-row-title form-flex-row-title-first">
                  Information
                  </h2>
                  <div class="form-flex-row">
                      <label for="firstName">First name</label>
                      <input type="text" class="input-text-form-flex" id="firstName" name="firstName" form="userForm" required>
                  </div>
                  <div class="form-flex-row">
                      <label for="lastName">Last Name</label>
                      <input type="text" class="input-text-form-flex" id="lastName" name="lastName" form="userForm" required>
                  </div>
                  <div class="form-flex-row" id="roleSelect">
                      <label for="roleCode">Role</label>
                      <app-select name="roleCode" data-theme="accent" data-option="name" data-value="code" data-items-event="rolesDropdownEvent" form="userForm">
                      </app-select>
                  </div>
                  <h2 class="form-flex-row-title">Contact</h2>
                  <div class="form-flex-row">
                      <label for="emailAddress">Email Address</label>
                      <input type="email" class="input-text-form-flex" id="emailAddress" name="emailAddress" form="userForm" required>
                  </div>
                  <h2 class="form-flex-row-title">Credentials</h2>
                  <div class="form-flex-row">
                      <label for="username">Username</label>
                      <input type="text" class="input-text-form-flex" id="username" name="username" form="userForm" required>
                  </div>
                  <div class="form-flex-row">
                      <label for="password">Password</label>
                      <div class="input-password-hide-show">
                        <input type="password" class="input-text-form-flex input-flex-password" id="password" name="password" form="userForm" required>
                          <svg class="icon-password" id="passwordToggle" viewBox="-0.5 -0.5 16.9 16.9">
                                ${Globals.icons.querySelector(`#eye`).innerHTML}
                          </svg>
                      </div>
                  </div>
                  <div class="form-flex-row">
                      <label></label>
                      <button type="submit" form="userForm" style="display:none;">submit</button>
                      <app-button data-classes="btn btn-secondary btn-form-flex" id="btnSubmit">
                        <span slot="text">Add</span>
                      </app-button>
                  </div>
              </div>
            </div> 
        </div> 
    `;
  return template;
}

export class UserForm extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const template = renderTemplate();
    shadow.appendChild(template.content.cloneNode(true));
    
    const stylesheet = new CSSStyleSheet();
    const inputsheet = new CSSStyleSheet();
    const formsheet  = new CSSStyleSheet();
    stylesheet.replace(styles);
    inputsheet.replace(input);
    formsheet.replace(form);
    shadow.adoptedStyleSheets = [stylesheet, inputsheet, formsheet];
  }

  async connectedCallback() {
    const sroot = this.shadowRoot;
    sroot.querySelector("#btnBack").addEventListener("click", (e) => document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "accounts"}})));
    sroot.querySelector("#passwordToggle").addEventListener("click", (e) => this.togglePassword(e));
    await this.loadRoles();
    const form = sroot.querySelector("#userForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.submitForm(e.target);
    });
    sroot.querySelector("#btnSubmit").addEventListener("click", async (e) => { 
      if(form.reportValidity())
        await this.submitForm(form);
    });
  }

  disconnectedCallback() {
    
  }

  async submitForm(form) {
    const btnSubmit = this.shadowRoot.querySelector("#btnSubmit");
    try {
        btnSubmit.setAttribute("data-is-loading", true);
        const { user } = await crudService.addItem("/api/account", form);
        uiService.showAlert("Success", `${user.name}'s account was created successfully.`);
        document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "accounts" } }));
    } 
    catch (err) {
        uiService.showAlert("Error", err.message);
    }
    finally {
        btnSubmit.setAttribute("data-is-loading", false);
    }
  }

  async loadRoles() {
    try {
      const { roles } = await crudService.getItems("/api/role", null);
      document.dispatchEvent(
        new CustomEvent("rolesDropdownEvent", {
          detail: { items: roles },
        })
      );
    } catch (err) {
        uiService.showAlert("Error", err.message);
    }
  }

  togglePassword(e) {
    const password = this.shadowRoot.querySelector("#password");
    password.setAttribute("type", (password.type == "password") ? "text" : "password");
    e.target.setAttribute("data-icon", (e.target.getAttribute("data-icon") == "eye") ? "eye-slash" : "eye"); 
  }
}