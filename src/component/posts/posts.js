import styles from './posts.css?raw';

import crudService from '../../service/CRUDservice';
import uiService from '../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div style="padding: 2rem;">
            <h1>Posts</h1>
        </div>
    `;
  return template;
}

export class Posts extends HTMLElement {
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