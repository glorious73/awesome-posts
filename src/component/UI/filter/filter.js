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
                <app-date-picker style="display:none;"></app-date-picker>
            </div>
            <div class="filter-item filter-actions">
                <app-button data-classes="btn btn-primary btn-filter" id="export">
                  <span slot="text">
                    <svg class="icon-filter icon-filter-fill" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#file-spreadsheet-fill`).innerHTML}
                    </svg>
                    Export
                  </span>
                </app-button>
                <app-button data-classes="btn btn-secondary btn-filter" id="add">
                  <span slot="text">
                    <svg class="icon-filter" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#plus-circle`).innerHTML}
                    </svg>
                    <span id="addText">Add</span>
                  </span>
                </app-button>
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

  static get observedAttributes() {
    return ["data-attributes", "data-is-dropdown"];
  }

  connectedCallback() {
    const sroot = this.shadowRoot;
    this.loadSearch(sroot.querySelector("#search"));
    this.loadDropdown(sroot.querySelector("#dropdown"));
    this.loadAdd(sroot.querySelector("#add"));
    this.loadExport(sroot.querySelector("#export"));
    this.loadDates(sroot.querySelector("app-date-picker"));
  }

  disconnectedCallback() {

  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name === "data-attributes")
      this.loadAttributes(newValue);
    if(name === "data-is-dropdown")
      this.shadowRoot.querySelector("#dropdown").style.display = (newValue == "true") ? "" : "none";
  }

  loadSearch(search) {
    this.search = "";
    search.id   = this.getAttribute("data-search-id") || "search";
    search.setAttribute("placeholder", this.getAttribute("data-search-placeholder"));
    search.addEventListener("focusout", (e) =>  {
      if(this.search != e.target.value) {
        this.filter(e);
        this.search = e.target.value;
      }
    });
    search.addEventListener("keypress", (e) => {
      if (e.keyCode == 13 && (this.search != e.target.value)) {
        this.filter(e);
        this.search = e.target.value;
      } 
    });
  }

  loadDropdown(dropdown) {
    const isDropdown = this.getAttribute("data-is-dropdown");
    this.shadowRoot.querySelector("#dropdown").style.display = (isDropdown == "true") ? "" : "none";
  }

  loadDates(dates) {
    const isDates = this.getAttribute("data-is-dates");
    if(isDates && isDates == "true") {
      dates.style.display = "";
      dates.setAttribute("data-begin-id", this.getAttribute("data-begin-id") || "dateBegin");
      dates.setAttribute("data-end-id", this.getAttribute("data-end-id") || "dateEnd");
    }
  }

  loadAdd(button) {
    const isAdd  = this.getAttribute("data-is-add") == "true";
    button.classList.add(isAdd ? "NA" : "d-none");
    if(isAdd)
      button.addEventListener("click", (e) => 
        document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: 'route', route: this.getAttribute("data-add-path")}})));
  }

  loadExport(button) {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      button.setAttribute("data-is-loading", true);
      await this.export(); // TODO: export event
      button.setAttribute("data-is-loading", true);
    });
  }

  loadAttributes(attributes) {
    const sroot  = this.shadowRoot;
    const filter = JSON.parse(attributes);
    this.search = filter.search || "";
    sroot.querySelector(".input-search").value = filter.search || "";
    sroot.querySelector("app-select").setAttribute("data-selected-value", filter.select);
    sroot.querySelector("app-date-picker").setAttribute("data-begin-value", filter.dateBegin);
    sroot.querySelector("app-date-picker").setAttribute("data-end-value", filter.dateEnd);
  }

  filter(e) {
    document.dispatchEvent(
      new CustomEvent("searchEvent", {
        detail: e.target
      })
    );
  }

  async export() {
    uiService.showAlert("Information", "Not yet implemented.");
  }
}