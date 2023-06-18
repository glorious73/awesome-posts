class FormService {
    constructor() { }

    static getInstance() {
        if (!this.instance) {
            this.instance = new FormService();
        }
        return this.instance;
    }

    buildHeaders(token) {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `${token}`
        };
        return headers;
    }

    buildJsonFormData(form) {
        const jsonFormData = {};
        for (const pair of new FormData(form)) {
            jsonFormData[pair[0]] = pair[1];
        }
        return jsonFormData;
    }
}

const formService = FormService.getInstance();
export default formService;
