import apiService from "./APIService";
import formService from "./FormService";
import uiService from "./UIService";


class AuthService {
    constructor() {
        this.isLoggedOutAlert = false;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthService();
        }
        return this.instance;
    }

    async login(loginForm) {
        // build request
        const jsonFormData = formService.buildJsonFormData(loginForm);
        jsonFormData.email = jsonFormData.username; // backend accepts username and email
        const headers = formService.buildHeaders();
        // Execute request
        const response = await apiService.POST(
            `${Globals.API_URL}/api/collections/users/auth-with-password`,
            headers,
            jsonFormData
        );
        if(response.record)
            return (response.record);
        throw new Error("Username or Password is incorrect.");
    }

    logout() {
        localStorage.clear();
        document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "login" } }));
    }

    isLoggedIn() {
        const user = localStorage.getItem("user");
        return user == undefined || user == null;
    }

    logoutUnauthorizedUser(e) {
        if (!this.isLoggedOutAlert) {
            this.isLoggedOutAlert = true;
            uiService.showAlert("Information", "You have been signed out. Please sign back in.");
        }
        setTimeout(() => {
            this.logout();
            this.isLoggedOutAlert = false;
        }, 1111);
    }

    notifyForbiddenUser(e) {
        uiService.showAlert("Information", "403 Forbidden.");
    }
}

const authService = AuthService.getInstance();
export default authService;