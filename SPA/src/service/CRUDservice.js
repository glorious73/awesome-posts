import formService from "./FormService";
import apiService from "./APIService";
import exportService from "./ExportService";

class CRUDService {
    constructor() {
        this.user = {};
    }

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
        const response = await apiService.GET(`${Globals.API_URL}${apiEndpoint}/${id}`, headers);
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

    /**
   * Export items to CSV.
   * Gets items from api in batches, concatenates them, and exports the final list
   * Returns 0 when done, or -1 if there are no items
   */
    async exportItems(apiEndpoint, batchSize, responseEntity, fileName, query = null, hiddenFields = null) {
        // setup
        const { totalItems } = await this.getItems(apiEndpoint, query);
        const numIterations = Math.ceil(totalItems / batchSize);
        // get list
        let items = [];
        for (let i = 0; i < numIterations; i++) {
            const pagination = { pageNumber: i + 1, pageSize: batchSize };
            const filter     = query ? Object.assign(query, pagination) : pagination;
            const result     = await this.getItems(apiEndpoint, filter);
            if (result[responseEntity].length > 0)
                items = items.concat(result[responseEntity]);
        }
        // export
        if (items.length > 0) {
            if (hiddenFields)
                for(let i=0; i<items.length; i++) {
                    for (const hiddenField of hiddenFields.split(","))
                        delete items[i][hiddenField];
                }
            // export list
            exportService.exportToCSV(items, `${fileName}.csv`);
            return 0;
        } 
        else 
            return -1;
    }


    _buildFormHeaders() {
        if (!this.user.token)
            this.user = JSON.parse(localStorage.getItem("user") || "{}");
        return formService.buildHeaders(this.user.token);
    }

    _returnResult(response) {
        if (response.success) return response.result;
        else throw new Error(`${response.result.message}`);
    }
}

const crudService = CRUDService.getInstance();
export default crudService;