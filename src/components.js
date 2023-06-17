// App
import { Auth } from "./component/auth/auth";
import { Login } from "./component/auth/login";
import { Dashboard } from "./component/dashboard/dashboard";
import { About } from "./component/about/about";
// UI
import { Navbar } from "./component/UI/navbar/navbar";
import { Sidebar } from "./component/UI/sidebar/sidebar";
import { Modal } from "./component/UI/modal/modal";
import { Alerts } from "./component/UI/alert/alerts";
import { Alert } from "./component/UI/alert/alert";
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
        customElements.define('app-about', About);
        // UI
        customElements.define('app-alerts', Alerts);
        customElements.define('app-alert', Alert);
        customElements.define('app-modal', Modal);
        customElements.define('app-navbar', Navbar);
        customElements.define('app-sidebar', Sidebar);
        customElements.define('app-select', Select);
        customElements.define('app-date-picker', DatePicker);
        customElements.define('app-filter', Filter);
        customElements.define('app-table', Table);
        customElements.define('app-pagination', Pagination);
    }
}