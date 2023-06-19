import styles from './pagination.css?raw';

import uiService from '../../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <ul class="page-list">
        <!-- Previous -->
        <li class="d-none" id="previous">
            <
        </li>
        <!-- Pages (to render) -->
        
        <!-- Next -->
        <li class="d-none" id="next">
            >
        </li>
    </ul>
  `;
  return template;
}

export class Pagination extends HTMLElement {
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
    return ["data-pagination"];
  }

  connectedCallback() {
    // theme
    const pageElement = this.shadowRoot.querySelector(".page-list");
    const pageTheme   = this.getAttribute("data-theme");
    pageElement.classList.add(`page-list-${pageTheme || "primary"}`);
    // update
    this.isUpdating  = false;
    // pages
    this.pageNumber = 1;
    this.pageSize   = this.getAttribute("data-page-size") || 20;
    this.pagesView  = 7;
    // event
    this.searchEvent = this.getAttribute("data-search-event") || "searchEvent";
  }

  disconnectedCallback() {
    
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-pagination") {
      const data = JSON.parse(newValue);
      if(data) {
        this.assignAttributes(data);
        this.render();
        this.addPagesEvents();
        this.addPreviousNext();
      }
    }
  }

  assignAttributes(data) {
    this.pageNumber = data.page;
    this.pageSize   = data.perPage;
    this.totalPages = data.totalPages;
    this.totalItems = data.totalItems;
  }

  async render() {
    try {
        this.removePagesBetweenPreviousNext();
        // Render list items
        let pagesList = ``;
        if (this.totalPages <= this.pagesView)
            for (let i = 0; i < this.totalPages; i++) {
                pagesList += `<li class="${i + 1 == this.pageNumber ? "active" : ""}" id="page-${i + 1}">
                                ${i + 1}
                              </li>`;
            }
        else 
            pagesList = this.renderManyPages();
        // insert
        this.shadowRoot
            .querySelector("#previous")
            .insertAdjacentHTML("afterend", pagesList);
    } catch (err) {
        uiService.showAlert("Error", err);
        this.shadowRoot.querySelector(".page-list").classList.add("d-none");
    }
  }

  renderManyPages() {
    let pagesList = ``;
    pagesList += `
            <li class="${this.pageNumber == 1 ? "active" : ""}" id="page-1">
              1
            </li>
            <li>...</li>`;
    // 5 pages around current page
    let pageThreshold = 3;
    for (let i = -2; i < pageThreshold; i++) {
      const currentPage = this.pageNumber + i;
      if (currentPage > 1 && currentPage < this.totalPages)
        pagesList += `
                <li class="${i + 1 == this.pageNumber ? "active" : ""}" 
                  id="page-${this.pageNumber + i}">
                    ${this.pageNumber + i}
                </li>`;
      else if (currentPage < this.totalPages) pageThreshold++;
    }
    pagesList += `<li>...</li>
            <li class="${this.pageNumber == this.totalPages ? "active" : ""}" 
              id="page-${this.totalPages}">
                ${this.totalPages}
            </li>`;
    return pagesList;
  }

  async triggerPage(pageNumber) {
    try {
      if (!isNaN(pageNumber) && !isNaN(parseFloat(pageNumber)))
        if (pageNumber != this.pageNumber)
          if (!this.isUpdating) {
            this.isUpdating = true;
            document.dispatchEvent(
              new CustomEvent(this.searchEvent, {
                detail: { id: "pageNumber", value: pageNumber }
              })
            );
            this.pageNumber = pageNumber;
            if (this.totalPages > this.pagesView) {
              this.updatePageNumbers();
              this.addPagesEvents();
            }
            this.updateActivePage();
          }
    } 
    finally {
      this.isUpdating = false;
    }
  }

  updateActivePage() {
    this.shadowRoot
      .querySelectorAll("li")
      .forEach((page) => (page.className = ""));
    this.shadowRoot
      .querySelector(`#page-${this.pageNumber}`)
      .classList.add("active");
  }

  updatePageNumbers() {
    const pagesList = this.renderManyPages();
    this.removePagesBetweenPreviousNext();
    this.shadowRoot
      .querySelector("#previous")
      .insertAdjacentHTML("afterend", pagesList);
  }

  removePagesBetweenPreviousNext() {
    const previousPage = this.shadowRoot.querySelector("#previous");
    const nextPage = this.shadowRoot.querySelector("#next");
    while (
      previousPage.nextElementSibling &&
      previousPage.nextElementSibling !== nextPage
    )
      previousPage.nextElementSibling.remove();
  }

  addPagesEvents() {
    // pages
    this.shadowRoot.querySelectorAll("li").forEach((element) => {
      element.addEventListener("click", async (e) =>
        this.triggerPage(e.target.innerText)
      );
    });
  }

  addPreviousNext() {
    const previous = this.shadowRoot.querySelector("#previous");
    const next     = this.shadowRoot.querySelector("#next");
    // display
    previous.className = "";
    next.className     = "";
    // events
    previous.addEventListener("click", async (e) => {
      if (this.pageNumber > 1) this.triggerPage(parseInt(this.pageNumber) - 1);
    });
    next.addEventListener("click", async (e) => {
      if (this.pageNumber < this.totalPages)
        this.triggerPage(parseInt(this.pageNumber) + 1);
    });
  }
}