class UIService {
    constructor() { }

    static getInstance() {
        if (!this.instance) {
            this.instance = new UIService();
        }
        return this.instance;
    }

    showAlert(status, message) {
        document.dispatchEvent(
            new CustomEvent("AlertEvent", {
                detail: {
                    status: status,
                    message: message,
                },
            })
        );
    }

    toggleUserUI(isDisplayed) {
        document.dispatchEvent(new CustomEvent("UserUIEvent", {
            detail: { isDisplayed: isDisplayed }
        }));
    }

    dataBindElements(component, elements) {
        for (const element of elements.split(",")) {
            const elementSplit = element.split("&");
            component.shadowRoot.querySelectorAll(elementSplit[0]).forEach(el => {
                component[el.id] = new DataBoundElement(el, elementSplit[1], elementSplit[2]);
            });
        }
    }

    loadTable(eventName, data, hiddenFields) {
        document.dispatchEvent(
            new CustomEvent(eventName, {
                detail: {
                    data: data,
                    hiddenFields: hiddenFields,
                },
            })
        );
    }

    loadPagination(eventName, result) {
        document.dispatchEvent(
            new CustomEvent(eventName, {
                detail: {
                    data: result,
                }
            })
        );
    }
}

const uiService = UIService.getInstance();
export default uiService;