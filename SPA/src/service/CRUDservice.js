import formService from "./FormService";
import apiService from "./APIService";

class CRUDService {
    constructor() { }

    static getInstance() {
        if (!this.instance) {
            this.instance = new CRUDService();
        }
        return this.instance;
    }

    async addItem(apiEndpoint, addForm) {
        // build form
        const jsonFormData = formService.buildJsonFormData(addForm);
        // headers
        const headers = this._buildFormHeaders();
        // Execute request
        const response = await apiService.POST(
            `${Globals.API_URL}${apiEndpoint}`,
            headers,
            jsonFormData
        );
        return this._returnResult(response);
    }

    async editItem(apiEndpoint, itemId, editForm) {
        // build form
        const jsonFormData = formService.buildJsonFormData(editForm);
        // headers
        const headers = this._buildFormHeaders();
        // Execute request
        const response = await apiService.PUT(
            `${Globals.API_URL}${apiEndpoint}/${itemId}`,
            headers,
            jsonFormData
        );
        return this._returnResult(response);
    }

    async getItemById(apiEndpoint, id) {
        // build request
        const headers = this._buildFormHeaders();
        // Execute request
        const response = await apiService.GET(
            `${Globals.API_URL}${apiEndpoint}/${id}`,
            headers
        );
        return this._returnResult(response);
    }

    async getItems(apiEndpoint, query) {
        // build request;
        const headers = this._buildFormHeaders();
        // Execute request
        const response = await apiService.GET(
            `${Globals.API_URL}${apiEndpoint}`,
            headers,
            query
        );
        return this._returnResult(response);
    }

    async getItemsForm(apiEndpoint, queryForm) {
        // build query
        const query = queryForm
            ? formService.buildJsonFormData(queryForm)
            : null;
        // build request
        const headers = this._buildFormHeaders();
        // Execute request
        const response = await apiService.GET(
            `${Globals.API_URL}${apiEndpoint}`,
            headers,
            query
        );
        return this._returnResult(response);
    }

    async deleteItem(apiEndpoint, itemId) {
        // headers
        const headers = this._buildFormHeaders();
        // Execute request
        const response = await apiService.DELETE(
            `${Globals.API_URL}${apiEndpoint}/${itemId}`,
            headers
        );
        return this._returnResult(response);
    }

    _buildFormHeaders() {
        const currentUser = JSON.parse(localStorage.getItem("user") || `{"token":"TOKEN_MISSING"}`);
        return formService.buildHeaders(currentUser.token);
    }

    _returnResult(response) {
        if (response.success) return response.result;
           else throw new Error(`${response.result.message}`);
    }
}

const crudService = CRUDService.getInstance();
export default crudService;