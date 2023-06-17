import styles from './filter.css?raw';

import uiService from '../../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="filter">
            <div class="filter-item filter-actions">
                <input type="text" class="input-search" id="search">
                <app-select id="dropdown" data-theme="secondary" data-is-border="true" data-option="name" data-value="code" data-items-event="filterDropdownEvent" data-item-selected-event="selectedItemEvent">
                </app-select>
                <app-date-picker class="d-none"></app-date-picker>
            </div>
            <div class="filter-item filter-actions">
                <a class="btn-action btn-action-primary" id="export">
                    <svg class="icon-action icon-action-fill" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#file-spreadsheet-fill`).innerHTML}
                    </svg>
                    Export
                </a>
                <a class="btn-action btn-action-secondary" id="add">
                    <svg class="icon-action" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#plus-circle`).innerHTML}
                    </svg>
                    <span id="addText">Add</span>
                </a>
            </div>
        </div>
  `;
  return template;
}

export class Filter extends HTMLElement {
  constructor() {
      super();

      const shadow = this.attachShadow({ mode: "open" });
      const template = renderTemplate();
      shadow.appendChild(template.content.cloneNode(true));

      const stylesheet = new CSSStyleSheet();
      stylesheet.replace(styles);
      shadow.adoptedStyleSheets = [stylesheet];
  }

  connectedCallback() {
    const sroot = this.shadowRoot;
    // search
    this.search = "";
    const inputSearch = sroot.querySelector("#search");
    inputSearch.id    = this.getAttribute("data-search-id") || "search";
    inputSearch.setAttribute("placeholder", this.getAttribute("data-search-placeholder"));
    inputSearch.addEventListener("focusout", (e) =>  {
      if(this.search != e.target.value) {
        this.filter(e);
        this.search = e.target.value;
      }
    });
    inputSearch.addEventListener("keypress", (e) => {
      if (e.keyCode == 13) this.filter(e);
    });
    // dropdown
    const dropdown = sroot.querySelector("#dropdown");
    // add
    const btnAdd = sroot.querySelector("#add");
    const isAdd  = this.getAttribute("data-is-add") == "true";
    btnAdd.classList.add(isAdd ? "" : "d-none");
    btnAdd.setAttribute("href", isAdd ? this.getAttribute("data-add-href") : "");
    // export
    const btnExport = sroot.querySelector("#export");
    btnExport.addEventListener("click", async (e) => {
      e.preventDefault();
      btnExport.classList.add("disabled");
      await this.export();
      btnExport.classList.remove("disabled");
    });
    // date
    const isDates = this.getAttribute("data-is-dates");
    if(isDates && isDates == "true") {
      const inputDates = sroot.querySelector("app-date-picker");
      inputDates.classList.remove("d-none");
      inputDates.setAttribute("data-begin-id", this.getAttribute("data-begin-id") || "dateBegin");
      inputDates.setAttribute("data-end-id", this.getAttribute("data-end-id") || "dateEnd");
    }
  }

  disconnectedCallback() {

  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name === "data-attributes")
      this.updateAttributes(newValue);
    if(name === "data-display-dropdown")
      this.shadowRoot.querySelector("#dropdown").className = newValue;
  }

  filter(e) {
    document.dispatchEvent(
      new CustomEvent("searchEvent", {
        detail: e.target
      })
    );
  }

  updateAttributes(attributes) {
    const sroot  = this.shadowRoot;
    const filter = JSON.parse(attributes);
    sroot.querySelector(".input-text-search").value = filter.search || "";
    this.search = filter.search || "";
    sroot.querySelector("app-select").setAttribute("data-value", filter.select);
    sroot.querySelector("app-date-picker").setAttribute("data-begin-value", filter.dateBegin);
    sroot.querySelector("app-date-picker").setAttribute("data-end-value", filter.dateEnd);
  }

  async export() {
    uiService.showAlert("Information", "Not yet implemented.");
  }
}