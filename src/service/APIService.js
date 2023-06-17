class APIService {
    constructor() {
        this.errors = {
            401: "Unauthorized",
            403: "Forbidden",
        };
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new APIService();
        }
        return this.instance;
    }

    async GET(fetchLink, headers, query = null) {
        if (!fetchLink || !headers) {
            throw new Error("One or more GET request parameters was not passed.");
        }
        try {
            const url = new URL(fetchLink);
            if (query) url.search = new URLSearchParams(query).toString();
            const rawResponse = await fetch(url, {
                method: "GET",
                headers: headers,
            });
            return await this._returnResponse(rawResponse);
        } catch (err) {
            console.error(`Error at fetch GET: ${err}`);
            throw err;
        }
    }

    async POST(fetchLink, headers, body) {
        if (!fetchLink || !headers || !body) {
            throw new Error("One or more POST request parameters was not passed.");
        }
        try {
            const rawResponse = await fetch(fetchLink, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });
            return await this._returnResponse(rawResponse);
        } catch (err) {
            console.error(`Error at fetch POST: ${err}`);
            throw err;
        }
    }

    async PUT(fetchLink, headers, body) {
        if (!fetchLink || !headers || !body) {
            throw new Error("One or more PUT request parameters was not passed.");
        }
        try {
            const rawResponse = await fetch(fetchLink, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(body),
            });
            return await this._returnResponse(rawResponse);
        } catch (err) {
            console.error(`Error at fetch PUT: ${err}`);
            throw err;
        }
    }

    async DELETE(fetchLink, headers) {
        if (!fetchLink || !headers) {
            throw new Error("One or more DELETE request parameters was not passed.");
        }
        try {
            const rawResponse = await fetch(fetchLink, {
                method: "DELETE",
                headers: headers,
            });
            return await this._returnResponse(rawResponse);
        } catch (err) {
            console.error(`Error at fetch DELETE: ${err}`);
            throw err;
        }
    }

    _CheckResponseStatus(response) {
        const { status } = response;
        return status == "401" || status == "403" ? false : true;
    }

    async _returnResponse(rawResponse) {
        const responseStatusResult = this._CheckResponseStatus(rawResponse);
        if (responseStatusResult)
            return await rawResponse.json();
        else {
            document.dispatchEvent(new CustomEvent(`${this.errors[rawResponse.status]}Event`));
            return { success: false, result: { message: "An error occurred." } };
        }
    }
}

const apiService = APIService.getInstance();
export default apiService;
