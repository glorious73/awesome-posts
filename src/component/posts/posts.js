import styles from './posts.css?raw';

import crudService from '../../service/CRUDservice';
import uiService from '../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <h1>Posts</h1>
            <!-- Filter -->
            <app-filter data-search-id="title" data-search-placeholder="Title" data-is-add="true" data-add-path="/post" data-is-dates="false" data-begin-id="createdStart" data-end-id="createdEnd">
            </app-filter>
            <!-- Table -->
            <app-table class="m-table" data-theme="secondary"></app-table>
            <!-- Pagination -->
            <app-pagination data-theme="secondary" data-search-event="searchEvent">
            </app-pagination>
        </div>
    `;
  return template;
}

export class Posts extends HTMLElement {
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
    this.filter = { page: 1, perPage: 20, sort: "-created" }; // todo: add PocketBase filter
    await this.displayItems();
    // dropdown
    this.loadDropdown();
    // events
    this.handleFilter       = (e) => this.filterPosts(e);
    this.handleSelectedItem = (e) => this.filterDropdown(e);
    this.handleDeleteEvent  = async (e) => await this.displayItems();
    document.addEventListener("searchEvent", this.handleFilter);
    document.addEventListener("selectedItemEvent", this.handleSelectedItem);
    document.addEventListener("deletedEvent", this.handleDeleteEvent);
  }

  disconnectedCallback() {
    document.removeEventListener("searchEvent", this.handleFilter);
    document.removeEventListener("selectedItemEvent", this.handleSelectedItem);
    document.removeEventListener("deletedEvent", this.handleDeleteEvent);
  }

  async loadDropdown() {
    try {
      const dropdownItems = [{code: 0, name: "Type"}, {code: 0, name: "Admin"}, {code: 0, name: "User"}];
      document.dispatchEvent(
        new CustomEvent("filterDropdownEvent", {
          detail: { items: dropdownItems }
        })
      );
    }
    catch(err) {
      uiService.showAlert("Error", err.message);
    }
  }

  async filterPosts(e) {
    this.filter.filter = `(title=${e.detail.data.value})`;
    await this.displayItems();
  }

  async filterDropdown(e) {
    this.filter.filter = `(type=${e.detail.data.value})`;
    await this.displayItems();
  }

  async displayItems() {
    try {
      const table      = this.shadowRoot.querySelector("app-table");
      const pagination = this.shadowRoot.querySelector("app-pagination");
      table.setAttribute("data-is-loading", true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = await crudService.getItems("/api/collections/posts/records", this.filter);
      table.setAttribute("data-is-loading", false);
      table.setAttribute("data-items", JSON.stringify({items: result.items, hiddenFields: this.hiddenFields}));
      pagination.setAttribute("data-pagination", JSON.stringify(result));
    } 
    catch (err) {
      uiService.showAlert("Error", err.message);
    }
  }
}