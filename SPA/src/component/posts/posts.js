import styles from './posts.css?raw';

import crudService from '../../service/CRUDservice';
import uiService from '../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <h1 class="title">Posts</h1>
            <app-filter data-search-id="title" data-search-placeholder="Title" data-is-dropdown="true" data-is-add="true" data-add-path="/posts/new" data-is-dates="true" data-begin-id="createdStart" data-end-id="createdEnd">
            </app-filter>
            <app-table class="m-table" data-theme="secondary"></app-table>
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
    // dropdown
    this.postTypes = await this.loadDropdown();
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
    localStorage.setItem("filter.posts", JSON.stringify(this.filter));
    localStorage.setItem("list.post_types", JSON.stringify(this.postTypes));
  }

  async loadFilter() {
    let filter = await JSON.parse(localStorage.getItem("filter.posts") || "{}");
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
      search: filter.title || '',
      select: filter.type || 'type',
      dateBegin: filter.createdStart,
      dateEnd: filter.createdEnd
    };
    this.shadowRoot.querySelector("app-filter").setAttribute("data-attributes", JSON.stringify(UIFilter));
  }

  async loadDropdown() {
    try {
      let dropdownItems = JSON.parse(localStorage.getItem("list.post_types"));
      if(dropdownItems && dropdownItems[0] && dropdownItems[0].name)
        await new Promise(resolve => setTimeout(resolve, 500)); // stall to load select
      else {
        dropdownItems = [{code: "type", name: "Type"}, {code: "admin", name: "Admin"}, {code: "user", name: "User"}];
        // then call API to fetch list
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
      delete this.filter.type;
    else
      this.filter.type = e.detail.code;
    await this.displayItems();
  }

  async displayItems() {
    try {
      const table      = this.shadowRoot.querySelector("app-table");
      const pagination = this.shadowRoot.querySelector("app-pagination");
      table.setAttribute("data-is-loading", true);
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