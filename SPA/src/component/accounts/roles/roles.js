import styles from './roles.css?raw';

import crudService from '../../../service/CRUDservice';
import uiService from '../../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <h1 class="title">Roles</h1>
            <app-filter data-search-id="name" data-search-placeholder="Name" data-is-add="true" data-add-path="/roles/new" data-is-dates="true" data-begin-id="createdStart" data-end-id="createdEnd">
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
    this.handleFilter       = (e) => this.filterItems(e);
    this.handleSelectedItem = (e) => this.filterDropdown(e);
    this.handleDeleteEvent  = async (e) => await this.displayItems();
    document.addEventListener("searchEvent", this.handleFilter);
    document.addEventListener("selectedItemEvent", this.handleSelectedItem);
    document.addEventListener("deletedEvent", this.handleDeleteEvent);
  }

  disconnectedCallback() {
    // events
    document.removeEventListener("searchEvent", this.handleFilter);
    document.removeEventListener("selectedItemEvent", this.handleSelectedItem);
    document.removeEventListener("deletedEvent", this.handleDeleteEvent);
    // cache
    localStorage.setItem("filter_roles", JSON.stringify(this.filter));
  }

  async loadFilter() {
    let filter = await JSON.parse(localStorage.getItem("filter_roles") || "{}");
    if(!filter.page) {
      const now     = new Date();
      const nowDate = now.toISOString().split("T")[0];
      filter = { 
        page: 1, 
        perPage: 20,
        sort: "-created",
        createdStart: `${nowDate} ${now.getHours()-1}:${now.getMinutes()}`, 
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
    if(value === '' || value === undefined)
      delete this.filter[id];
    else
      this.filter[id] = value;
    await this.displayItems();
  }

  async displayItems() {
    try {
      const table      = this.shadowRoot.querySelector("app-table");
      const pagination = this.shadowRoot.querySelector("app-pagination");
      table.setAttribute("data-is-loading", true);
      const result = await crudService.getItems("/api/collections/roles/records", this.filter);
      table.setAttribute("data-is-loading", false);
      table.setAttribute("data-items", JSON.stringify({items: result.items, hiddenFields: this.hiddenFields}));
      pagination.setAttribute("data-pagination", JSON.stringify(result));
    } 
    catch (err) {
      uiService.showAlert("Error", err.message);
    }
  }
}