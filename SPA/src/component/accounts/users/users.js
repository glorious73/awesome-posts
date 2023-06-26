import styles from './users.css?raw';

import crudService from '../../../service/CRUDservice';
import uiService from '../../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <h1 class="title">Users</h1>
            <app-filter data-search-id="username" data-search-placeholder="Username" data-is-dropdown="true" data-is-add="true" data-add-path="/users/new" data-is-dates="true" data-begin-id="createdStart" data-end-id="createdEnd">
            </app-filter>
            <app-table class="m-table" data-theme="secondary" data-item-name="account" data-actions="edit,delete" data-actions-path="users" data-delete-event="deleteItemEvent"></app-table>
            <app-pagination data-theme="secondary" data-search-event="searchEvent">
            </app-pagination>
        </div>
    `;
  return template;
}

export class Users extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const template = renderTemplate();
    shadow.appendChild(template.content.cloneNode(true));
    
    const stylesheet = new CSSStyleSheet();
    stylesheet.replace(styles);
    shadow.adoptedStyleSheets = [stylesheet];
  }

  async connectedCallback() {
    this.hiddenFields = "id,firstName,lastName";
    // dropdown
    this.roles = await this.loadDropdown();
    // component
    this.filter = await this.loadFilter();
    await this.displayItems();
    // events
    this.handleFilter       = (e) => this.filterItems(e);
    this.handleSelectedItem = (e) => this.filterDropdown(e);
    this.handleExport       = (e) => this.exportItems();
    this.handleDeleteEvent  = async (e) => await this.deleteItem(e);
    document.addEventListener("searchEvent", this.handleFilter);
    document.addEventListener("selectedItemEvent", this.handleSelectedItem);
    document.addEventListener("exportEvent", this.handleExport);
    document.addEventListener("deleteItemEvent", this.handleDeleteEvent);
  }

  disconnectedCallback() {
    // events
    document.removeEventListener("searchEvent", this.handleFilter);
    document.removeEventListener("selectedItemEvent", this.handleSelectedItem);
    document.removeEventListener("exportEvent", this.handleExport);
    document.removeEventListener("deleteItemEvent", this.handleDeleteEvent);
    // cache
    localStorage.setItem("filter.users", JSON.stringify(this.filter));
    localStorage.setItem("list.roles", JSON.stringify(this.roles));
  }

  async loadFilter() {
    let filter = await JSON.parse(localStorage.getItem("filter.users") || "{}");
    if(!filter.pageNumber) {
      const now          = new Date();
      const nowDate      = now.toISOString().split("T")[0];
      const lastWeek     = new Date();
      lastWeek.setDate(now.getDate()-7);
      const lastWeekDate = lastWeek.toISOString().split("T")[0];
      filter = { 
        pageNumber: 1, 
        pageSize: 20,
        createdStart: `${lastWeekDate} ${now.getHours()}:${now.getMinutes()}`, 
        createdEnd: `${nowDate} ${now.getHours()}:${now.getMinutes()}` 
      };
    } 
    this.loadFilterUI(filter);
    return filter;
  }

  loadFilterUI(filter) {
    const UIFilter = {
      search: filter.username || '',
      select: filter.roleId || 0,
      dateBegin: filter.createdStart,
      dateEnd: filter.createdEnd
    };
    this.shadowRoot.querySelector("app-filter").setAttribute("data-attributes", JSON.stringify(UIFilter));
  }

  async loadDropdown() {
    try {
      let dropdownItems = JSON.parse(localStorage.getItem("list.roles"));
      if(dropdownItems && dropdownItems[0] && dropdownItems[0].name)
        await new Promise(resolve => setTimeout(resolve, 500)); // stall to load select
      else {
        dropdownItems = [{code: 0, name: "Role"}];
        const { roles } = await crudService.getItems("/api/role", null);
        for(const role of roles)
          dropdownItems.push({code: role.code, name: role.name});
      }
      document.dispatchEvent(
        new CustomEvent("filterDropdownEvent", {
          detail: { items: dropdownItems }
        })
      );
      return dropdownItems;
    }
    catch(err) {
      uiService.showAlert("Error", err.message);
    }
  }

  async filterItems(e) {
    const { id, value } = e.detail;
    if(value === '' || value === undefined)
      delete this.filter[id];
    else
      this.filter[id] = value;
    await this.displayItems();
  }

  async filterDropdown(e) {
    if(e.detail.code == 0)
      delete this.filter.roleId;
    else
      this.filter.roleId = e.detail.code;
    await this.displayItems();
  }

  async displayItems() {
    try {
      const table      = this.shadowRoot.querySelector("app-table");
      const pagination = this.shadowRoot.querySelector("app-pagination");
      table.setAttribute("data-is-loading", true);
      const result = await crudService.getItems("/api/account", this.filter);
      table.setAttribute("data-is-loading", false);
      table.setAttribute("data-items", JSON.stringify({items: result.users, hiddenFields: this.hiddenFields}));
      pagination.setAttribute("data-pagination", JSON.stringify(result));
    } 
    catch (err) {
      uiService.showAlert("Error", err.message);
    }
  }

  async exportItems() {
    try {
      // setup
      const now = new Date();
      // call
      const result = await crudService.exportItems(
        '/api/account',
        50,
        'users',
        `users ${now.toISOString().split("T")[0]} ${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`,
        this.filter,
        this.hiddenFields
      );
      if (result < 0)
        uiService.showAlert("Information", "No items to export.");
    } 
    catch (err) {
      uiService.showAlert("Error", err.message);
    }
    finally {
      this.shadowRoot.querySelector("app-filter").setAttribute("data-export-done", "");
    }
  }

  async deleteItem(e) {
    let isDeleted = false;
    try {
      const result = await crudService.deleteItem("/api/account", e.detail.itemId);
      isDeleted = true;
      uiService.showAlert("Success", "User record deleted successfully.");
    }
    catch(err) {
      uiService.showAlert("Error", err.message);
      isDeleted = false;
    }
    finally {
      document.dispatchEvent(new CustomEvent(`postdeleteItemEvent`, { detail: { isDeleted: isDeleted }}));
      if(isDeleted)
        await this.displayItems();
    }
  }
}