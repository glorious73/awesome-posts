import styles from './delete.css?raw';
import form from '../../../css/form.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <div class="form-delete">
        <h1>Are you sure you want to delete the <span id="item"></span> record?</h1>
        <div class="form-row form-row-two-fields">
            <app-button class="form-row-field" data-classes="btn btn-cancel w-100" id="btnCancel">
                <span slot="text">No</span>
            </app-button>
            <app-button class="form-row-field" data-classes="btn btn-secondary w-100" id="btnSubmit">
                <span slot="text">Yes</span>
            </app-button>
        </div>
    </div>
    `;
  return template;
}

export class Delete extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const template = renderTemplate();
    shadow.appendChild(template.content.cloneNode(true));
    
    const stylesheet = new CSSStyleSheet();
    const formsheet  = new CSSStyleSheet();
    stylesheet.replace(styles);
    formsheet.replace(form);
    shadow.adoptedStyleSheets = [stylesheet, formsheet];
  }

  connectedCallback() {
    const sroot = this.shadowRoot;
    // Attributes
    this.itemName    = this.getAttribute("data-item-name") || "_";
    this.itemId      = this.getAttribute("data-item-id");
    this.deleteEvent = this.getAttribute("data-delete-event");
    // UI
    sroot.querySelector("#item").innerHTML = this.itemName;
    // Events
    sroot.querySelector("#btnSubmit").addEventListener("click", async (e) => { 
        this.deleteItem();
    });
    sroot.querySelector("#btnCancel").addEventListener("click", (e) => {
      document.dispatchEvent(new CustomEvent("hideModalEvent"));
    });
    this.handlePostDelete = (e) => this.postDeleteItem(e.detail.isDeleted);
    document.addEventListener(`post${this.deleteEvent}`, (e) => this.handlePostDelete(e));
  }

  disconnectedCallback() {
    document.removeEventListener(`post${this.deleteEvent}`, (e) => this.handlePostDelete(e));
  }

  deleteItem() {
    const btnSubmit = this.shadowRoot.querySelector("#btnSubmit");
    btnSubmit.setAttribute("data-is-loading", true);
    document.dispatchEvent(new CustomEvent(this.deleteEvent, { 
        detail: { itemId: this.itemId }
    }));
  }

  postDeleteItem(isDeleted) {
    this.shadowRoot.querySelector("#btnSubmit").setAttribute("data-is-loading", false);
    if(isDeleted)
        document.dispatchEvent(new CustomEvent("hideModalEvent"));
  }
}