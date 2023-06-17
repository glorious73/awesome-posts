import styles from './select.css?raw';

import "element-internals-polyfill";

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <input type="text" class="input-select" id="selectedItem" placeholder="loading..." readonly/>
    <div class="dropdown select-dropdown" tabindex="0">  
        <div class="dropdown-content" id="selectItems">
        </div>
    </div>
  `;
  return template;
}

export class Select extends HTMLElement {
  constructor() {
    super();
    
    this.internals_ = this.attachInternals();
    this.value_     = "";

    const shadow   = this.attachShadow({ mode: "open" });
    const template = renderTemplate();
    shadow.appendChild(template.content.cloneNode(true));

    const stylesheet = new CSSStyleSheet();
    stylesheet.replace(styles);
    shadow.adoptedStyleSheets = [stylesheet];
  }

  static get formAssociated() {
    return true;
  }
  get value() {
    return this.value_;
  }
  set value(v) {
    this.value_ = v;
  }

  static get observedAttributes() {
    return ["data-begin-id", "data-end-id", "data-begin-value", "data-end-value"];
  }

  connectedCallback() {
    const sroot = this.shadowRoot;
    // input
    const selectDropdown = sroot.querySelector(".select-dropdown");
    selectDropdown.addEventListener("keypress", (e) => {
      if (e.keyCode == 13) this.toggleSelect(e);
    });
    const input = sroot.querySelector(".input-select");
    input.addEventListener("click", (e) => this.toggleSelect(e));
    input.addEventListener("keypress", (e) => {
      if (e.keyCode == 13) this.toggleSelect(e);
    });
    // Theme
    const theme = this.getAttribute("data-theme");
    if(theme)
      input.classList.add(`input-select-${theme}`);
    // Border
    const isSelectBorder = this.getAttribute("data-is-border");
    if (isSelectBorder == "true")
      input.classList.add(`input-text-border`);
    // Event for select
    this.isToggled = false;
    // Load items
    const items     = JSON.parse(this.getAttribute("data-items"));
    this.itemOption = this.getAttribute("data-option");
    this.itemValue  = this.getAttribute("data-value");
    this.items      = {}; // option-value pairs
    this.loadItems(items);
    // Selected item
    const selecteditemOption = this.getAttribute("data-selected-item-option");
    this.setSelectedItem(items, selecteditemOption);
    // Update items event
    this.itemsEvent = this.getAttribute("data-items-event");
    this.handleUpdateEvent = (e) => this.updateItems(e);
    if (this.itemsEvent)
      document.addEventListener(this.itemsEvent, this.handleUpdateEvent);
    // Item Selected event
    this.itemSelectedEvent = this.getAttribute("data-item-selected-event");
    // Add event for items
    sroot.querySelectorAll(".btn-select").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.itemSelected(e.target.innerText)
      );
    });
  }

  disconnectedCallback() {
    if (this.itemsEvent)
      document.removeEventListener(this.itemsEvent, this.handleUpdateEvent);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-option" && this.items)
      this.setSelectedItem(this.items, newValue);
    if (name === "data-value" && this.items) {
      const option = Object.keys(this.items).find(key => this.items[key] == newValue);
      this.shadowRoot.querySelector("#selectedItem").value = option;
      this.setValue(option);
    }
  }

  loadItems(items) {
    const selectItems = this.shadowRoot.querySelector("#selectItems");
    if (items && items.length) {
      let itemsHTML = "";
      for (const item of items) {
        this.items[item[this.itemOption]] = item[this.itemValue];
        itemsHTML += `<button class="btn-select" title="${item[this.itemValue]}">${item[this.itemOption]}</button>`;
      }
      selectItems.innerHTML = itemsHTML;
    }
    else
      selectItems.innerHTML = "";
  }

  setSelectedItem(items, selecteditemOption = null) {
    const selectedItem = this.shadowRoot.querySelector("#selectedItem");
    if (items && items.length) {
      const itemSelected = selecteditemOption || items[0][this.itemOption];
      selectedItem.value = itemSelected;
      this.setValue(itemSelected);
    } 
    else {
      selectedItem.setAttribute("placeholder", "--");
      selectedItem.value = "";
      this.setValue("");
    }
  }

  updateItems(e) {
    // Update data
    const { items, selectedItem } = e.detail;
    this.items = {}; // reset items
    // Update UI
    this.loadItems(items);
    this.setSelectedItem(items, selectedItem);
    // Update events
    this.shadowRoot.querySelectorAll(".btn-select").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.itemSelected(e.target.innerText)
      );
    });
  }

  setValue(option) {
    this.value_ = this.items[option];
    this.internals_.setFormValue(this.value_);
  }

  itemSelected(option) {
    this.setValue(option);
    this.shadowRoot.querySelector("#selectedItem").value = option;
    this.toggleSelect();
    this.dispatchItemSelectedEvent(option);
  }

  dispatchItemSelectedEvent(option) {
    if (this.itemSelectedEvent) {
      const item = {};
      item[this.itemOption] = option;
      item[this.itemValue]  = this.items[option];
      document.dispatchEvent(
        new CustomEvent(this.itemSelectedEvent, {
          detail: { data: item }
        })
      );
    }
  }

  toggleSelect(e) {
    this.toggleIcon();
    this.shadowRoot.querySelector("#selectItems").classList.toggle("show");
  }

  toggleIcon() {
    this.isToggled = !this.isToggled;
    // icon path
    const chevronUp = `M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z`;
    const chevronDown = `M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z`;
    // icon
    const input = this.shadowRoot.querySelector(".input-select");
    input.style.backgroundImage = `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-0.5 -0.5 16.8 16.8'%3E%3Cpath fill='black' stroke='black' d='${(this.isToggled) ? chevronUp : chevronDown}'/%3E%3C/svg%3E")`;
  }
}