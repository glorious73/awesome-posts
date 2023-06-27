import styles from './dashboard.css?raw';
import plots from '../../css/plotly.css?raw';

import Plotly from 'plotly.js-basic-dist-min';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <h1 class="title">Dashboard</h1>
            <div class="graph" id="graph"></div>
        </div> 
    `;
  return template;
}

export class Dashboard extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    const template = renderTemplate();
    shadow.appendChild(template.content.cloneNode(true));

    const stylesheet = new CSSStyleSheet();
    const plotssheet = new CSSStyleSheet();
    stylesheet.replace(styles);
    plotssheet.replace(plots);
    shadow.adoptedStyleSheets = [stylesheet, plotssheet];
  }

  connectedCallback() {
    const data = [{
      values: [19, 26, 55],
      labels: ['Residential', 'Non-Residential', 'Utility'],
      type: 'pie'
    }];
    const layout = { font: { size: 18 }, legend: { x: 1, y: 1 } };
    const config = { responsive: true };
    Plotly.newPlot(this.shadowRoot.querySelector("#graph"), data, layout, config);
  }

  disconnectedCallback() {

  }
}