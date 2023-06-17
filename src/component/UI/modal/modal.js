import styles from './modal.css?raw';

function renderTemplate() {
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
        <div id="uiModal" class="modal">
            <div class="modal-content card card-primary">
                <div class="modal-title-wrapper">
                    <h1 class="modal-title"></h1>
                    <span class="modal-close">
                        <svg class="icon-modal" viewBox="-0.5 -0.5 16.9 16.9">
                            ${Globals.icons.querySelector(`#x-lg`).innerHTML}
                        </svg>
                    </span>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-caption">

                </div>
            </div>
        </div>
    `;
    return template;
}

export class Modal extends HTMLElement {
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
        this.handleShowModal = (e) => this.showModal(e);
        this.handleHideModal = (e) => this.hideModal();
        document.addEventListener("showModalEvent", this.handleShowModal);
        document.addEventListener("hideModalEvent", this.handleHideModal);
        this.shadowRoot
        .querySelector(".modal-close")
        .addEventListener("click", () => this.hideModal());
    }

    disconnectedCallback() {
        document.removeEventListener("showModalEvent", this.handleShowModal);
        document.removeEventListener("hideModalEvent", this.handleHideModal);
    }

    showModal(e) {
        const sroot = this.shadowRoot;
        // modal
        sroot.getRootNode().host.classList.toggle("d-none");
        this.shadowRoot.querySelector(".modal").className = "modal";
        setTimeout(() => sroot.querySelector(".modal-content").classList.add("show"), 50);
        // title
        sroot.querySelector(".modal-title").innerHTML = e.detail.title;
        // body
        sroot.querySelector(".modal-body").innerHTML = e.detail.body;
        // caption
        sroot.querySelector(".modal-caption").innerHTML = e.detail.caption
        ? e.detail.caption
        : "";
    }

    hideModal() {
        this.shadowRoot.querySelector(".modal-content").classList.remove("show");
        this.shadowRoot.querySelector(".modal").className = "modal";
        setTimeout(() => this.shadowRoot.getRootNode().host.classList.toggle("d-none"), 300);
    }
}
  