import styles from './roles.css?raw';

import crudService from '../../../service/CRUDservice';
import uiService from '../../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <h1 class="title">Roles</h1>
            <app-filter data-search-id="name" data-search-placeholder="Name" data-is-add="false" data-is-dates="true" data-begin-id="createdStart" data-end-id="createdEnd">
            </app-filter>
            <app-table class="m-table" data-theme="secondary"></app-table>
            <app-pagination data-theme="secondary" data-search-event="searchEvent">
            </app-pagination>
        </div>
    `;
  return template;
}

export class Roles extends HTMLElement {
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
    this.hiddenFields = "id";
    // component
    this.filter = await this.loadFilter();
    await this.displayItems();
    // events
    this.handleFilter = (e) => this.filterItems(e);
    this.handleSelectedItem = (e) => this.filterDropdown(e);
    this.handleExport = (e) => this.exportItems();
    document.addEventListener("searchEvent", this.handleFilter);
    document.addEventListener("exportEvent", this.handleExport);
    document.addEventListener("selectedItemEvent", this.handleSelectedItem);
  }

  disconnectedCallback() {
    // events
    document.removeEventListener("searchEvent", this.handleFilter);
    document.removeEventListener("selectedItemEvent", this.handleSelectedItem);
    document.removeEventListener("exportEvent", this.handleExport);
    // cache
    localStorage.setItem("filter.roles", JSON.stringify(this.filter));
  }

  async loadFilter() {
    let filter = await JSON.parse(localStorage.getItem("filter.roles") || "{}");
    if (!filter.pageNumber) {
      const now = new Date();
      const nowDate = now.toISOString().split("T")[0];
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
    else
      this.loadFilterUI(filter);
    return filter;
  }

  loadFilterUI(filter) {
    const UIFilter = {
      search: filter.name || '',
      select: filter.type || 'type',
      dateBegin: filter.createdStart,
      dateEnd: filter.createdEnd
    };
    this.shadowRoot.querySelector("app-filter").setAttribute("data-attributes", JSON.stringify(UIFilter));
  }

  async filterItems(e) {
    const { id, value } = e.detail;
    if (value === '' || value === undefined)
      delete this.filter[id];
    else
      this.filter[id] = value;
    await this.displayItems();
  }

  async displayItems() {
    try {
      const table = this.shadowRoot.querySelector("app-table");
      const pagination = this.shadowRoot.querySelector("app-pagination");
      table.setAttribute("data-is-loading", true);
      const result = await crudService.getItems("/api/role", this.filter);
      table.setAttribute("data-is-loading", false);
      table.setAttribute("data-items", JSON.stringify({ items: result.roles, hiddenFields: this.hiddenFields }));
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
        '/api/role',
        50,
        'roles',
        `roles ${now.toISOString().split("T")[0]} ${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`,
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
}