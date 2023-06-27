import styles from './about.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <div class="container">
        <h1 class="title">About</h1>
        <div class="card section">
            <p>This is the "Awesome Posts" application. It is intended to be a template to create other applications.</p>
            <p>The Web Components in the "UI" directory in it are to be reused for future projects. Also available for public use.</p>
        </div>
    </div>
    `;
  return template;
}

export class About extends HTMLElement {
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
    
  }

  disconnectedCallback() {
    
  }
}