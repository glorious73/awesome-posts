import styles from './switch.css?raw';

import "element-internals-polyfill";

function renderTemplate() {
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
        <label class="switch">
            <input type="checkbox" id="checkbox">
            <span></span>
        </label>
    `;
    return template;
}

export class Switch extends HTMLElement {
    constructor() {
        super();

        this.internals_ = this.attachInternals();
        this.value_ = "";

        const shadow = this.attachShadow({ mode: "open" });
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
        return ["data-is-checked"];
    }

    connectedCallback() {
        // props
        this.switchEvent = this.getAttribute("data-switch-event");
        const isChecked = this.getAttribute("data-is-checked");
        this.setCheckboxValue(isChecked);
        this.setValue(isChecked);
        // events
        this.shadowRoot.querySelector("#checkbox").addEventListener("click", e => this.toggleCheckbox(e));
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-is-checked") {
            const isChecked = newValue;
            this.setCheckboxValue(isChecked);
            this.setValue(isChecked);
        }
    }

    setCheckboxValue(isChecked) {
        const checkbox = this.shadowRoot.querySelector("#checkbox");
        checkbox.value = isChecked;
        if (isChecked == true || isChecked == "true")
            checkbox.setAttribute("checked", isChecked);
        else
            checkbox.removeAttribute("checked");
    }

    setValue(value) {
        this.value_ = value;
        this.internals_.setFormValue(this.value_);
    }

    dispatchSwitchEvent(isChecked) {
        if (this.switchEvent)
            document.dispatchEvent(new CustomEvent(this.switchEvent, { detail: isChecked }));
    }

    toggleCheckbox(e) {
        e.target.value = e.target.checked;
        this.setValue(e.target.value);
        this.dispatchSwitchEvent(e.target.value);
    }
}