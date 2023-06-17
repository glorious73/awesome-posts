// App
import { Auth } from "./component/auth/auth";
import { Login } from "./component/auth/login";
import { Dashboard } from "./component/dashboard/dashboard";
import { Posts } from "./component/posts/posts";
import { About } from "./component/about/about";
import { Settings } from "./component/settings/settings";
// UI
import { Navbar } from "./component/UI/navbar/navbar";
import { Sidebar } from "./component/UI/sidebar/sidebar";
import { Modal } from "./component/UI/modal/modal";
import { Alerts } from "./component/UI/alert/alerts";
import { Alert } from "./component/UI/alert/alert";
import { Button } from "./component/UI/button/button";
import { Select } from "./component/UI/select/select";
import { DatePicker } from "./component/UI/datepicker/datepicker";
import { Filter } from "./component/UI/filter/filter";
import { Pagination } from "./component/UI/pagination/pagination";
import { Table } from "./component/UI/table/table";

export class Components {
    constructor() { }

    loadComponents() {
        // App
        customElements.define('app-auth', Auth);
        customElements.define('app-login', Login);
        customElements.define('app-dashboard', Dashboard);
        customElements.define('app-posts', Posts);
        customElements.define('app-about', About);
        customElements.define('app-settings', Settings);
        // UI
        customElements.define('app-alerts', Alerts);
        customElements.define('app-alert', Alert);
        customElements.define('app-modal', Modal);
        customElements.define('app-navbar', Navbar);
        customElements.define('app-sidebar', Sidebar);
        customElements.define('app-button', Button);
        customElements.define('app-select', Select);
        customElements.define('app-date-picker', DatePicker);
        customElements.define('app-filter', Filter);
        customElements.define('app-table', Table);
        customElements.define('app-pagination', Pagination);
    }
}