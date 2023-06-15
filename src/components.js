import { Sidebar } from "./component/UI/sidebar/sidebar";

export class Components {
    constructor() { }

    loadComponents() {
        customElements.define('app-sidebar', Sidebar);
    }
}