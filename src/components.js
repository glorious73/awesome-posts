import { Sidebar } from "./component/sidebar/sidebar";

export class Components {
    constructor() { }

    loadComponents() {
        customElements.define('app-sidebar', Sidebar);
    }
}