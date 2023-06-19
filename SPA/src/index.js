import { Components } from './components';
import { app } from './app';
import './styles';
import '@fontsource/oxygen';

async function loadApp(isLoggedIn) {
  window.Globals = { API_URL: 'http://localhost:8090', icons: ''};
  new Components().loadComponents();
  await loadIcons();
  loadContent();
  loadEvents();
  app.loadRoutes();
  if(isLoggedIn)
    app.router.resolve();
  else
    app.router.navigateByName("login");
}

async function loadIcons() {
  const iconsSvg = await (await fetch("/icons/bootstrap-icons.svg")).text();
  const icons = new DOMParser().parseFromString(iconsSvg, "image/svg+xml");
  icons.documentElement.style.display = "none";
  window.Globals.icons = icons.documentElement;
}

function loadContent() {
  const main = `
    <app-alerts></app-alerts>
    <app-modal class="d-none"></app-modal>
    <app-sidebar class="sidebar sidebar-slide"></app-sidebar>
  `;
  const content = `<app-navbar class="navbar-slide"></app-navbar>`;
  document.querySelector('#main').insertAdjacentHTML('afterbegin', main);
  document.querySelector('#content').insertAdjacentHTML('afterbegin', content);
}

function loadEvents() {
  document.addEventListener('UserUIEvent', (e) => {
    const navbar      = document.querySelector("app-navbar");
    const sidebar     = document.querySelector("app-sidebar");
    navbar.className  = (e.detail.isDisplayed) ? "navbar-slide" : "d-none";
    sidebar.className = (e.detail.isDisplayed) ? "sidebar sidebar-slide" : "sidebar d-none";
    const result      = sidebar.filterItemsForRole();
  });
  document.addEventListener("UnauthorizedEvent", () => showALert("401 Unauthorized."));
  document.addEventListener("ForbiddenEvent", () => showAlert("403 Forbidden."));
  document.addEventListener('NavigateEvent', (e) => {
    if(e.detail.type === "name")
      app.router.navigateByName(e.detail.name);
    else
      app.router.navigate(e.detail.route);
  });
  document.addEventListener("ResponsiveSidebarEvent", () => document.querySelector(".sidebar").classList.toggle("show"));
}

function showAlert(message) {
  document.dispatchEvent(new CustomEvent("AlertEvent", {
        detail: { status: "Information", message: message }
  }));
}

loadApp(localStorage.getItem("user"));
