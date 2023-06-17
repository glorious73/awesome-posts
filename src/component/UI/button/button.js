import styles from './button.css?raw';

import "element-internals-polyfill";

function renderTemplate() {
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
    <button class="btn"></button>
  `;
    return template;
}

export class Button extends HTMLElement {
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
        return ["data-text", "data-class", "data-is-loading"];
    }

    connectedCallback() {
        this.button           = this.shadowRoot.querySelector("button");
        this.text             = this.getAttribute("data-text") || "click";
        this.button.innerHTML = this.text;
        for(const c of this.getAttribute("data-classes").split(" "))
            this.button.classList.add(c);
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.button && name === "data-text") {
            this.text             = newValue;
            this.button.innerHTML = newValue;
        }
        if (this.button && name === "data-class")
            this.button.classList.add(newValue);
        if(this.button && name === "data-is-loading")
            this.setLoading(newValue);
    }

    setLoading(isLoading) {
        if (isLoading && isLoading === "true") {
            this.button.setAttribute("disabled", "");
            this.button.innerHTML =
            '<span class="spinner button-spinner"><span></span><span></span><span></span></span>';
        } 
        else {
            this.button.removeAttribute("disabled");
            this.button.innerHTML = this.text;
        }
    }
}