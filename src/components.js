// App
import { About } from "./component/about/about";
// UI
import { Navbar } from "./component/UI/navbar/navbar";
import { Sidebar } from "./component/UI/sidebar/sidebar";
import { Modal } from "./component/UI/modal/modal";
import { Alerts } from "./component/UI/alert/alerts";
import { Alert } from "./component/UI/alert/alert";

export class Components {
    constructor() { }

    loadComponents() {
        // App
        customElements.define('app-about', About);
        // UI
        customElements.define('app-alerts', Alerts);
        customElements.define('app-alert', Alert);
        customElements.define('app-modal', Modal);
        customElements.define('app-navbar', Navbar);
        customElements.define('app-sidebar', Sidebar);
    }
}