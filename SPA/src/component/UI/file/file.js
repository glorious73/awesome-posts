import styles from './file.css?raw';

import "element-internals-polyfill";
import fileService from '../../../service/FileService';

function renderTemplate() {
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
        <label class="file-upload fileLabel" tabindex="0">
            Choose File...
            <input type="file" class="input-text fileInput">
        </label>
        <label class="file-upload-name text-wrap fileNameLabel"></label>
    `;
    return template;
}

export class File extends HTMLElement {
    constructor() {
        super();

        this.internals_ = this.attachInternals();
        this.value_ = "";

        const shadow = this.attachShadow({ mode: "open" });
        const template = renderTemplate();
        shadow.appendChild(template.content.cloneNode(true));

        const stylesheet = new CSSStyleSheet();
        stylesheet.replace(styles);
        shadow.adoptedStyleSheets = [stylesheet];
    }

    static get formAssociated() {
        return true;
    }
    get value() {
        return this.value_;
    }
    set value(v) {
        this.value_ = v;
    }

    connectedCallback() {
        this.errorMessage = "";
        // Label
        const fileLabel   = this.shadowRoot.querySelector(".fileLabel");
        fileLabel.htmlFor = this.getAttribute("data-file-name");
        this.fileTheme    = this.getAttribute("data-theme");
        fileLabel.classList.add(`file-upload-${this.fileTheme || "primary"}`);
        // File
        const fileInput = this.shadowRoot.querySelector(".fileInput");
        fileInput.id = this.getAttribute("data-file-name");
        fileInput.setAttribute("name", this.getAttribute("data-file-name"));
        // Max File Size    
        const maxFileSize = this.getAttribute("data-max-file-size");
        this.maxFileSize  = (maxFileSize) ? parseFloat(maxFileSize) : 100;
        // Extension
        const acceptExtension = this.getAttribute("data-accept");
        if (acceptExtension)
            fileInput.setAttribute("accept", acceptExtension);
        // Events
        fileLabel.addEventListener("keypress", (e) => {
            if (e.keyCode == 13) fileInput.click();
        });
        this.shadowRoot
            .querySelector(".fileInput")
            .addEventListener("change", async (e) => {
                this.changeFileName();
                await this.updateFileBase64();
            });
    }

    disconnectedCallback() {

    }

    async updateFileBase64() {
        const fileInput = this.shadowRoot.querySelector(".fileInput");
        const base64    = await fileService.getBase64(fileInput.files[0]);
        this.value_     = base64;
        this.internals_.setFormValue(this.value_);
    }

    changeFileName() {
        // Selectors
        const fileNameLabel = this.shadowRoot.querySelector(".fileNameLabel");
        const fileInput     = this.shadowRoot.querySelector(".fileInput");
        // Validation
        const isValidFile = this._validateFile(fileInput);
        // Credit: https://stackoverflow.com/a/857662/6336270
        const fullPath = fileInput.value;
        if (isValidFile) {
            // Get the file name
            const startIndex = fullPath.indexOf("\\") >= 0 ? fullPath.lastIndexOf("\\") : fullPath.lastIndexOf("/");
            let fileName = fullPath.substring(startIndex);
            if (fileName.indexOf("\\") === 0 || fileName.indexOf("/") === 0)
                fileName = fileName.substring(1);
            // Show file name on label
            fileNameLabel.style.color = getComputedStyle(document.documentElement).getPropertyValue("--text-color");
            fileNameLabel.innerHTML   = fileName;
        } 
        else {
            // show error
            fileNameLabel.style.color = getComputedStyle(document.documentElement).getPropertyValue("--error-color");
            fileNameLabel.innerHTML   = this.errorMessage;
        }
    }

    _validateFile(uploadedFile) {
        let isValidFile = true;
        if (window.FileReader) {
            if (!uploadedFile) {
                isValidFile = false;
                this.errorMessage = "Could not find file.";
            }
            else if (!uploadedFile.files) {
                isValidFile = false;
                this.errorMessage = "Could not find files.";
            }
            else if (!uploadedFile.files[0]) {
                isValidFile = false;
                this.errorMessage = "Please choose a file.";
            }
            else {
                if (uploadedFile.files[0].size > this.maxFileSize * 1024 * 1024) {
                    isValidFile = false;
                    this.errorMessage = `File is too large. Max File Size = ${this.maxFileSize}MB.`;
                }
            }
        }
        else
            isValidFile = false;
        return isValidFile;
    }
}