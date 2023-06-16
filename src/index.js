import { Components } from './components';
import { router } from './Router/Router';
import './styles';
import 'construct-style-sheets-polyfill'; // may need to be in components.js

document.querySelector('#app').innerHTML = `
  <h1>Welcome to awesome dashboard!</h1>
  <div class="card">
    <a href="/" data-navigo>Home</a>
    <a href="/about" data-navigo>About</a>
  </div>
`;

async function loadApp(isLoggedIn) {
  window.GlobalVariables = { icons: ''};
  new Components().loadComponents();
  await loadIcons();
  document.querySelector('.content').insertAdjacentHTML('afterbegin', '<app-sidebar class="sidebar sidebar-slide"></app-sidebar>');
  router.resolve();
}

async function loadIcons() {
  const iconsSvg = await (await fetch("icons/tabler-icons.svg")).text();
  const icons = new DOMParser().parseFromString(iconsSvg, "image/svg+xml");
  icons.documentElement.style.display = "none";
  window.GlobalVariables.icons = icons.documentElement;
}

loadApp(false);
