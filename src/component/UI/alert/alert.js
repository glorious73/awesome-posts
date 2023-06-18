import styles from './alert.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div id="toaster" class="toaster-border">
            <div class="toaster-wrapper">
                <svg viewBox="-0.5 -0.5 16.9 16.9"></svg>
                <div>
                    <div class="toaster-status w-100">
                        <label class="" id="status"></label>
                        <label class="">
                            <button class="toaster-btn-close">&times;</button>
                        </label>
                    </div>
                    <label id="message"></label>
                </div>
            </div>
        </div>
    `;
  return template;
}

export class Alert extends HTMLElement {
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
      this.showAlert();
      this.shadowRoot
        .querySelector(".toaster-btn-close")
        .addEventListener("click", (e) => this.hideAlert(e));
  }

  disconnectedCallback() {}

  showAlert() {
      // Status and Message
      const sroot = this.shadowRoot;
      const status = this.getAttribute("data-status");
      sroot.querySelector("#status").innerHTML = status;
      sroot.querySelector("#message").innerHTML =
        this.getAttribute("data-message");
      this.setIcon(status);
      // Show
      const toaster = sroot.querySelector("#toaster");
      toaster.classList.toggle("show");
      setTimeout(() => {
        if (toaster.classList.contains("show")) toaster.classList.toggle("show");
      }, 5000);
  }

  hideAlert(e) {
      this.shadowRoot.querySelector("#toaster").classList.toggle("show");
  }

  setIcon(status) {
      const svgIcon = this.shadowRoot.querySelector("svg");
      let icon = "";
      let fill = "";
      switch (status) {
        case "Success":
          icon = "check2-circle-fill";
          fill = "fill-success";
          break;
        case "Error":
          icon = "x-circle-fill";
          fill = "fill-error";
          break;
        default:
          icon = "exclamation-circle-fill";
          fill = "fill-info";
      }
      svgIcon.innerHTML = `${Globals.icons.querySelector(`#${icon}`).innerHTML}`;
      svgIcon.classList.add(`icon-alert`);
      svgIcon.classList.add(fill);
  }
}
