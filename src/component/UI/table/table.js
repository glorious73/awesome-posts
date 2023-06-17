import styles from './table.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <table class="table">
        <thead id="tableHead">
        </thead>
        <tbody id="tableBody">
        </tbody>
    </table>
    <div class="table-no-data show" id="loadingData">
        <span class="spinner table-spinner">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </span>
    </div>
    <div class="table-no-data" id="noData">
        <h1>No Data</h1>
    </div>
    `;
  return template;
}

export class Table extends HTMLElement {
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
    // Theme
    const tableElement = this.shadowRoot.querySelector(".table");
    const tableTheme = this.getAttribute("data-theme");
    tableElement.classList.add(`table-${tableTheme || "primary"}`);
    // Actions
    const actions     = this.getAttribute("data-actions");
    this.isActionable = actions != null && actions != undefined;
    if (this.isActionable) {
      this.isViewAction   = actions.includes("view");
      this.isEditAction   = actions.includes("edit");
      this.isDeleteAction = actions.includes("delete");
    }
    // Events
    this.tableEvent       = this.getAttribute("data-event");
    this.updateEvent      = this.getAttribute("data-update-event");
    this.loadingEvent     = this.getAttribute("data-loading-event");
    this.handleTableEvent = (e) => {
      const data = e.detail.data;
      if (data && data.length > 0) {
        this.shadowRoot.querySelector(".table").classList.remove("d-none");
        this.toggleElement('#noData', false);
        this.populateTable(e);
      }
      else {
        this.shadowRoot.querySelector(".table").classList.add("d-none");
        this.toggleElement('#noData', true);
      }
      this.toggleElement('#loadingData', false);
    };
    this.handleUpdateEvent = (e) => {
      const data = e.detail.data;
      if (data) this.populateTable(e);
    };
    this.handleLoadingEvent = (e) => {
      const tbody     = this.shadowRoot.querySelector("#tableBody");
      tbody.innerHTML = "";
      this.toggleElement('#loadingData', e.detail); // is loading
    };
    document.addEventListener(this.tableEvent, this.handleTableEvent);
    document.addEventListener(this.updateEvent, this.handleUpdateEvent);
    document.addEventListener(this.loadingEvent, this.handleLoadingEvent);
  }

  disconnectedCallback() {
    document.removeEventListener(this.tableEvent, this.handleTableEvent);
    document.removeEventListener(this.updateEvent, this.handleUpdateEvent);
    document.removeEventListener(this.loadingEvent, this.handleLoadingEvent);
  }

  populateTable(e) {
    if (!this.hiddenFields)
      this.hiddenFields = e.detail.hiddenFields
        ? e.detail.hiddenFields.split(",")
        : "";
    this.toggleElement("#noData", false);
    this.populateHeader(e);
    this.populateBody(e);
    this.addActionEvents();
  }

  populateHeader(e) {
    const data    = e.detail.data;
    const headers = Object.keys(data[0]);
    const thead   = this.shadowRoot.querySelector("#tableHead");
    let tableHead = "<tr>";
    for (const header of headers)
      tableHead += !this.hiddenFields.includes(header)
        ? `<th scope="col" class="wrap-table-text">${header}</th>`
        : ``;
    tableHead += this.isActionable ? `<th scope="col">Actions</th>` : ``;
    tableHead += `</tr>`;
    thead.innerHTML = tableHead;
  }

  populateBody(e) {
    const tbody = this.shadowRoot.querySelector("#tableBody");
    const data = e.detail.data;
    let tableBody = "";
    for (const item of data) {
      tableBody += '<tr class="table-tr">';
      for (const [key, value] of Object.entries(item))
        tableBody += !this.hiddenFields.includes(key)
          ? `<td scope="row" data-label="${key.toUpperCase()}" class="wrap-table-text">${
              value
            }</td>`
          : ``;
      if (this.isActionable) tableBody += this.populateActionsInRow(item.id);
      tableBody += "</tr>";
    }
    tbody.innerHTML = tableBody;
  }

  populateActionsInRow(dataId) {
    let actions = '<div class="table-actions">';
    if (this.isViewAction)
      actions += `<svg class="icon-action table-view-action" id="view-${dataId}" viewBox="-0.5 -0.5 16.9 16.9">
                    ${Globals.icons.querySelector(`#eye`).innerHTML}
                  </svg>`;
    if (this.isEditAction)
      actions += `<svg class="icon-action table-edit-action" id="edit-${dataId}" viewBox="-0.5 -0.5 16.9 16.9">
                    ${Globals.icons.querySelector(`#pencil-square`).innerHTML}
                  </svg>`;
    if (this.isDeleteAction)
      actions += `<svg class="icon-action table-delete-action" id="delete-${dataId}" viewBox="-0.5 -0.5 16.9 16.9">
                    ${Globals.icons.querySelector(`#x-square`).innerHTML}
                  </svg>`;
    actions += "</div>";
    return `<td scope="row" data-label="Actions" class="wrap-table-text">${actions}</td>`;
  }

  addActionEvents() {
    if (this.isViewAction)
      this.shadowRoot
        .querySelectorAll(".table-view-action")
        .forEach((element) => {
          element.addEventListener("click", (e) => this.viewItem(e));
        });
    if (this.isEditAction)
      this.shadowRoot
        .querySelectorAll(".table-edit-action")
        .forEach((element) => {
          element.addEventListener("click", (e) => this.editItem(e));
        });
    if (this.isDeleteAction)
      this.shadowRoot
        .querySelectorAll(".table-delete-action")
        .forEach((element) => {
          element.addEventListener("click", (e) => this.deleteItem(e));
        });
  }

  viewItem(e) {
    const viewLink = this.getAttribute("data-view-path");
    const id = e.target.id.split("-")[1] || e.target.parentElement.id.split("-")[1];
    document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "route", route: `/${viewLink}/${id}` }}));
  }

  editItem(e) {
    const editLink = this.getAttribute("data-edit-path");
    const id = e.target.id.split("-")[1] || e.target.parentElement.id.split("-")[1];
    document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "route", route: `/${editLink}/${id}` }}));
  }

  deleteItem(e) {
    // TODO: reconsider design
    const item = this.getAttribute("data-item-name");
    const id =
      e.target.id.split("-")[1] || e.target.parentElement.id.split("-")[1];
    const deleteEndpoint = this.getAttribute("data-api-endpoint");
    const responseMessage = this.getAttribute("data-response-message");
    const dataDeleteEvent = this.getAttribute("data-delete-event");
    document.dispatchEvent(
      new CustomEvent("showModalEvent", {
        detail: {
          title: `Delete ${item}`,
          body: `<app-delete-form data-item-name="${item}" data-item-id="${id}" data-api-endpoint="${deleteEndpoint}" data-response-result="${responseMessage}" data-is-modal-close="true" data-delete-event="${dataDeleteEvent}">
                </app-delete-form>`,
          caption: "",
        },
      })
    );
  }

  toggleElement(selector, isForce=null) {
    const element = this.shadowRoot.querySelector(`${selector}`);
    if(isForce != null)
      element.classList.toggle("show", isForce);
    else
      element.classList.toggle("show");
  }
}