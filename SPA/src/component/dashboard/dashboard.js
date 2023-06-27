import styles from './dashboard.css?raw';
import plots from '../../css/plotly.css?raw';

import Plotly from 'plotly.js-basic-dist-min';

import crudService from '../../service/CRUDservice';
import uiService from '../../service/UIService';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
        <div class="container">
            <h1 class="title">Dashboard</h1>
            <div class="dashboard-cards">
              <div class="card dashboard-card"><h1 id="posts">--</h1><label>Posts</label></div>
              <div class="card dashboard-card"><h1 id="locations">--</h1><label>Locations</label></div>
              <div class="card dashboard-card"><h1 id="users">--</h1><label>Users</label></div>
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
              <div class="card dashboard-chart dashboard-chart-pie" id="postsperlocation">
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
    // numbers
    await this.loadNumbers();
    // charts
    this.loadPostsPerHour();
    await this.loadLocations();
  }

  disconnectedCallback() {

  }

  async loadNumbers() {
    try {
      const sroot = this.shadowRoot;
      const { statsNumbers } = await crudService.getItems("/api/post/stats/numbers");
      for(const [key, value] of Object.entries(statsNumbers))
        sroot.querySelector(`#${key}`).innerHTML = value;
      // users
      const { users } = await crudService.getItems("/api/account/count");
      sroot.querySelector("#users").innerHTML = users;
    }
    catch(err) {
      uiService.showAlert("Error", err.message);
    }
  }

  async loadPostsPerHour() {
    // To remain a static chart in this POC
    await new Promise(resolve => setTimeout(resolve, 600)); // stall
    const postsPerHour = this.shadowRoot.querySelector("#postsperhour");
    postsPerHour.innerHTML = '';
    const trace1 = {
      x:['2020-10-04', '2021-11-04', '2023-12-04'],
      y: [60, 80, 90],
      type: 'line'
    };
    const data = [trace1];
    const layout = { title: 'Plotly Line Chart', font: { size: 16 }, showlegend: false };
    const config = { responsive: false };
    Plotly.newPlot(postsPerHour, data, layout, config);
  }

  async loadLocations() {
    try {
      const locations = this.shadowRoot.querySelector("#postsperlocation");
      const { postsPerLocation } = await crudService.getItems("/api/post/stats/locations");
      locations.innerHTML = '';
      const data = [{
        values: Object.values(postsPerLocation),
        labels: Object.keys(postsPerLocation),
        hole: 0.4,
        type: 'pie',
        textinfo: "label+percent",
        hoverinfo: "label+value"
      }];
      const layout = { title: 'Posts Per Location', font: { size: 16 }, showlegend: false };
      const config = { responsive: false };
      Plotly.newPlot(locations, data, layout, config);
    }
    catch(err) {
      uiService.showAlert("Error", err.message);
    }
  }
}