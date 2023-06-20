import styles from './notfound.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <div class="section">
                <div class="entry">
                    <h1>404</h1>
                    <h2>Page not found</h2>
                    <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                    <app-button data-classes="btn btn-primary btn-settings" id="btnHome">
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