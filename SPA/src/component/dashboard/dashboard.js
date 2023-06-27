import styles from './dashboard.css?raw';
import plots from '../../css/plotly.css?raw';

import Plotly from 'plotly.js-basic-dist-min';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <h1 class="title">Dashboard</h1>
            <div class="dashboard-cards">
              <div class="card dashboard-card"><h1>32</h1><label>Posts</label></div>
              <div class="card dashboard-card"><h1>5</h1><label>Locations</label></div>
              <div class="card dashboard-card"><h1>10</h1><label>Users</label></div>
            </div>
            <div class="dashboard-charts">
              <div class="card dashboard-chart dashboard-chart-line" id="postsperhour">
                <span class="spinner chart-spinner">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
              </div>
              <div class="card dashboard-chart dashboard-chart-pie" id="locations">
                <span class="spinner chart-spinner">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
              </div>
            </div>
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

  async connectedCallback() {
    await new Promise(resolve => setTimeout(resolve, 600));
    this.loadPostsPerHour();
    this.loadLocations();
  }

  disconnectedCallback() {

  }

  loadPostsPerHour() {
    const postsPerHour = this.shadowRoot.querySelector("#postsperhour");
    postsPerHour.innerHTML = '';
    const trace1 = {
      x:['2020-10-04', '2021-11-04', '2023-12-04'],
      y: [90, 80, 60],
      type: 'line'
    };
    const data = [trace1];
    const layout = {
        title: 'Plotly Line Chart',
        font: { size: 18 },
        showlegend: false
    };
    const config = { responsive: false };
    Plotly.newPlot(postsPerHour, data, layout, config);
  }

  loadLocations() {
    const locations = this.shadowRoot.querySelector("#locations");
    locations.innerHTML = '';
    const data = [{
      values: [19, 26, 55],
      labels: ['Residential', 'Non-Residential', 'Utility'],
      hole: 0.4,
      type: 'pie'
    }];
    const layout = { title: 'Plotly Donut Chart', font: { size: 18 }, legend: { x: 1, y: 1 } };
    const config = { responsive: false };
    Plotly.newPlot(locations, data, layout, config);
  }
}