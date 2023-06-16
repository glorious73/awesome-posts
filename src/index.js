import { Components } from './components';
import { router } from './Router/Router';
import './styles';
import 'construct-style-sheets-polyfill'; // may need to be in components.js

async function loadApp(isLoggedIn) {
  window.GlobalVariables = { icons: ''};
  new Components().loadComponents();
  await loadIcons();
  loadContent();
  loadEvents();
  router.resolve();
}

async function loadIcons() {
  const iconsSvg = await (await fetch("icons/tabler-icons.svg")).text();
  const icons = new DOMParser().parseFromString(iconsSvg, "image/svg+xml");
  icons.documentElement.style.display = "none";
  window.GlobalVariables.icons = icons.documentElement;
}

function loadContent() {
  const content = `
    <app-alerts></app-alerts>
    <app-modal class="d-none"></app-modal>
    <app-sidebar class="sidebar sidebar-slide"></app-sidebar>
  `;
  document.querySelector('.content').insertAdjacentHTML('afterbegin', content);
  document.querySelector('#app').insertAdjacentHTML('afterbegin', `
    <app-navbar class="navbar navbar-slide"></app-navbar>
  `);
}

function loadEvents() {
  document.addEventListener(
    "ResponsiveSidebarEvent", () => document.querySelector(".sidebar").classList.toggle("show")
  );
}

loadApp(false);
