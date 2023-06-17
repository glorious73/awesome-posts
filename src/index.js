import { Components } from './components';
import { app } from './app';
import './styles';

async function loadApp(isLoggedIn) {
  window.Globals = { icons: ''};
  new Components().loadComponents();
  await loadIcons();
  loadContent();
  loadEvents();
  app.loadRoutes();
  app.router.resolve();
}

async function loadIcons() {
  const iconsSvg = await (await fetch("icons/bootstrap-icons.svg")).text();
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
  document.addEventListener('NavigateEvent', (e) => {
    if(e.detail.type === "name")
      app.router.navigateByName(e.detail.name);
    else
      app.router.navigate(e.detail.route);
  });
  document.addEventListener("ResponsiveSidebarEvent", () => document.querySelector(".sidebar").classList.toggle("show"));
}

loadApp(false);
