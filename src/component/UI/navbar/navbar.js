import styles from './navbar.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <nav class="nav">
            <a class="nav-btn">
                <svg class="icon-navbar" viewBox="-0.5 -0.5 16.9 16.9">
                    ${Globals.icons.querySelector(`#list`).innerHTML}
                </svg>
            </a>
            <div class="nav-header">
                <div class="nav-title">
                    <img class="navbar-brand-img" src="img/vite.svg" alt="Logo" />
                </div>  
            </div>
            <div class="nav-links">
                <!--Empty-->
            </div>
        </nav>
    `;
  return template;
}

export class Navbar extends HTMLElement {
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
    this.shadowRoot
    .querySelector(".nav-btn")
    .addEventListener("click", (e) => document.dispatchEvent(new CustomEvent("ResponsiveSidebarEvent")));
  }

  disconnectedCallback() {

  }
}
