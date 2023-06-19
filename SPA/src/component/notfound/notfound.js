import styles from './notfound.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <div class="card section">
                <div class="entry">
                    <h1>Page not found</h1>
                    <app-button data-classes="btn btn-secondary btn-settings" id="btnHome">
                        <span slot="text">
                            <svg class="icon-entry" viewBox="-0.5 -0.5 16.9 16.9">
                                ${Globals.icons.querySelector(`#house`).innerHTML}
                            </svg>
                            Home
                        </span>
                    </app-button>
                </div>
            </div>
        </div>
    `;
  return template;
}

export class NotFound extends HTMLElement {
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
    const btnHome = this.shadowRoot.querySelector("#btnHome");
    btnHome.addEventListener("click", () => { 
        window.location = '/';
    });
  }

  disconnectedCallback() {
    
  }
}