import styles from './sidebar.css?raw';

function renderTemplate() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/`
        <div class="sidebar-scroll">
            <section class="sidebar-header">
                <img src="img/vite.svg" class="sidebar-img"/>
                <a class="sidebar-header-icon">
                    <svg>to be</svg>
                </a>
            </section>
            <section class="sidebar-menu">
                <a href="/" class="sidebar-item active" data-navigo>
                    <svg class="icon icon-sidebar" viewBox="0 0 22 22">
                        ${GlobalVariables.icons.querySelector(`#accessible`).innerHTML}
                    </svg>
                    meow
                </a>
                <a class="sidebar-item">
                    haw
                </a>
                <a class="sidebar-item">
                    ne nee
                </a>
            </section>
        </div>
    `;
    return template;
}

export class Sidebar extends HTMLElement {
    constructor() {
        super();

        const shadow   = this.attachShadow({ mode: "open" });
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