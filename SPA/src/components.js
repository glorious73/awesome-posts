// App
import { Auth } from "./component/auth/auth";
import { Login } from "./component/auth/login";
import { ForgotPassword } from "./component/auth/forgotpassword";
import { ResetPassword } from "./component/auth/resetpassword";
import { Dashboard } from "./component/dashboard/dashboard";
import { Posts } from "./component/posts/posts";
import { About } from "./component/about/about";
import { Accounts } from "./component/accounts/accounts";
import { Users } from "./component/accounts/users/users";
import { UserForm } from "./component/accounts/users/userform";
import { UserEdit } from "./component/accounts/users/useredit";
import { Roles } from "./component/accounts/roles/roles";
import { Settings } from "./component/settings/settings";
// UI
import { NotFound } from "./component/notfound/notfound";
import { Navbar } from "./component/UI/navbar/navbar";
import { Sidebar } from "./component/UI/sidebar/sidebar";
import { Modal } from "./component/UI/modal/modal";
import { Alerts } from "./component/UI/alert/alerts";
import { Alert } from "./component/UI/alert/alert";
import { Button } from "./component/UI/button/button";
import { Select } from "./component/UI/select/select";
import { Switch } from "./component/UI/switch/switch";
import { File } from "./component/UI/file/file";
import { DatePicker } from "./component/UI/datepicker/datepicker";
import { Filter } from "./component/UI/filter/filter";
import { Table } from "./component/UI/table/table";
import { Pagination } from "./component/UI/pagination/pagination";

export class Components {
    constructor() { }

    loadComponents() {
        // App
        customElements.define('app-auth', Auth);
        customElements.define('app-login', Login);
        customElements.define('app-forgot-password', ForgotPassword);
        customElements.define('app-reset-password', ResetPassword);
        customElements.define('app-dashboard', Dashboard);
        customElements.define('app-posts', Posts);
        customElements.define('app-about', About);
        customElements.define('app-accounts', Accounts);
        customElements.define('app-users', Users);
        customElements.define('app-user-form', UserForm);
        customElements.define('app-user-edit', UserEdit);
        customElements.define('app-roles', Roles);
        customElements.define('app-settings', Settings);
        // UI
        customElements.define('app-not-found', NotFound);
        customElements.define('app-alerts', Alerts);
        customElements.define('app-alert', Alert);
        customElements.define('app-modal', Modal);
        customElements.define('app-navbar', Navbar);
        customElements.define('app-sidebar', Sidebar);
        customElements.define('app-button', Button);
        customElements.define('app-select', Select);
        customElements.define('app-file', File);
        customElements.define('app-switch', Switch);
        customElements.define('app-date-picker', DatePicker);
        customElements.define('app-filter', Filter);
        customElements.define('app-table', Table);
        customElements.define('app-pagination', Pagination);
    }
}