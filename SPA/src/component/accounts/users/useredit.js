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
                  <h1 class="form-title">EDIT USER</h1>
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
                  <h2 class="form-flex-row-title">Status</h2>
                  <div class="form-flex-row">
                      <label for="isEnabled">Is Enabled</label>
                      <app-switch id="isEnabled" name="isEnabled" data-is-checked="false" form="userForm">
                      </app-switch>
                  </div>
                  <div class="form-flex-row">
                      <label></label>
                      <button type="submit" form="userForm" style="display:none;">submit</button>
                      <app-button data-classes="btn btn-secondary btn-form-flex" id="btnSubmit">
                        <span slot="text">Edit</span>
                      </app-button>
                  </div>
              </div>
            </div> 
        </div> 
    `;
  return template;
}

export class UserEdit extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const template = renderTemplate();
    shadow.appendChild(template.content.cloneNode(true));
    
    const stylesheet = new CSSStyleSheet();
    const inputsheet = new CSSStyleSheet();
    const formsheet = new CSSStyleSheet();
    stylesheet.replace(styles);
    inputsheet.replace(input);
    formsheet.replace(form);
    shadow.adoptedStyleSheets = [stylesheet, inputsheet, formsheet];
  }

  async connectedCallback() {
    const sroot = this.shadowRoot;
    const match = JSON.parse(this.getAttribute("data-match"));
    // back button
    sroot.querySelector("#btnBack").addEventListener("click", (e) => document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "accounts"}})));
    // UI
    uiService.dataBindElements(this, "input&--&value");
    // User
    this.id = match.data.id;
    const user = await this.loadUser();
    await this.loadRoles(user.role);
    const form = sroot.querySelector("#userForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.submitForm(e.target);
    });
    sroot.querySelector("#btnSubmit").addEventListener("click", async (e) => { 
      await this.submitForm(form);
    });
  }

  disconnectedCallback() {
    
  }

  async loadUser() {
    try {
        let user = JSON.parse(localStorage.getItem("userItem"));
        if(!user || (user.id != this.id))
            user = (await crudService.getItemById("/api/account",this.id)).user;
        for (const [key, value] of Object.entries(user))
            if (this[key] && this[key].change) this[key].change(value);
        this.shadowRoot.querySelector('#isEnabled').setAttribute("data-is-checked", user.isEnabled);
        return user;
    } 
    catch (err) {
        uiService.showAlert("Error", err.message);
    }
  }

  async submitForm(form) {
    const btnSubmit = this.shadowRoot.querySelector("#btnSubmit");
    try {
        btnSubmit.setAttribute("data-is-loading", true);
        const { user } = await crudService.editItem("/api/account", this.id, form);
        uiService.showAlert("Success", `${user.name}'s account was edited successfully.`);
        document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "accounts" } }));
    } 
    catch (err) {
        uiService.showAlert("Error", err.message);
    }
    finally {
        btnSubmit.setAttribute("data-is-loading", false);
    }
  }

  async loadRoles(role) {
    try {
      const { roles } = await crudService.getItems("/api/role", null);
      document.dispatchEvent(
        new CustomEvent("rolesDropdownEvent", {
          detail: { items: roles, selectedItem: role },
        })
      );
    } catch (err) {
        uiService.showAlert("Error", err.message);
    }
  }
}