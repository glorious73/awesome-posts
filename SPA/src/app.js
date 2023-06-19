import Navigo from "navigo";
import { Routes } from "./routes";

class App {
    constructor() { 
        this.router = new Navigo('/');
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }
        return this.instance;
    }

    loadRoutes() {
        this.router.hooks({
            after(match) {
                document.dispatchEvent(new CustomEvent('LocationChangedEvent', {detail: match}));
            }
        });
        this.router.notFound(() => {
            const notFound = `<app-not-found></app-not-found>`;
            this.loadComponent({}, notFound);
        });
        Routes.forEach(route => { 
            const navigoRoute = {};
            navigoRoute[route.path] = {
                as: route.name,
                uses: (match) => this.loadComponent(match, route.component)
            };
            this.router.on(navigoRoute);
        });
    }

    loadComponent(match, componentHTML) {
        const app = document.querySelector('#app');
        app.innerHTML = componentHTML;
    }
}

export const app = App.getInstance();