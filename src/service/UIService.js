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

    UIForUserEvent(isDisplayed) {
        document.dispatchEvent(new CustomEvent("UIForUserEvent", {
            detail: isDisplayed,
            })
        );
    }

    toggleButton(btn, btnText, isEnabled) {
        if (isEnabled) {
            btn.removeAttribute("disabled");
            btn.innerHTML = btnText;
        } 
        else {
            btn.setAttribute("disabled", "");
            btn.innerHTML =
            '<span class="spinner button-spinner"><span></span><span></span><span></span></span>';
        }
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
            },
            })
        );
    }

    loadAnimation(eventName, isLoading) {
        document.dispatchEvent(
            new CustomEvent(eventName, {
            detail: isLoading,
            })
        );
    }
}

const uiService = UIService.getInstance();
export default uiService;