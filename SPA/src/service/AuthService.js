import apiService from "./APIService";
import formService from "./FormService";
import uiService from "./UIService";


class AuthService {
    constructor() { }

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
            `${Globals.API_URL}/api/auth/login`,
            headers,
            jsonFormData
        );
        if (response.success) 
            return response.result.user;
        else 
            throw new Error(`${(response.result) ? response.result.message : 'An error occured.'}`);
    }

    logout() {
        localStorage.clear();
        document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "login" } }));
    }

    isLoggedIn() {
        const user = localStorage.getItem("user");
        return user == undefined || user == null;
    }

    async sendResetPasswordEmail(forgotPasswordForm) {
        // build request
        const jsonFormData = formService.buildJsonFormData(forgotPasswordForm);
        const headers = formService.buildHeaders();
        // Execute request
        const response = await apiService.POST(
            `${Globals.API_URL}/api/auth/forgotPassword`,
            headers,
            jsonFormData
        );
        if (response.success) return response.result;
        else throw new Error(`${response.result.message}`);
    }

    async resetPassword(resetPasswordForm) {
        // build request
        const jsonFormData = formService.buildJsonFormData(resetPasswordForm);
        const headers = formService.buildHeaders();
        // Execute request
        const response = await apiService.PUT(
          `${Globals.API_URL}/api/auth/resetPassword`,
          headers,
          jsonFormData
        );
        if (response.success) return response.result;
        else throw new Error(`${response.result.message}`);
      }    
}

const authService = AuthService.getInstance();
export default authService;