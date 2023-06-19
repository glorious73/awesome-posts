class FileService {
    constructor() { }

    static getInstance() {
        if (!this.instance) {
            this.instance = new FileService();
        }
        return this.instance;
    }

    validateFiles(fileInputs) {
        let isFilesUploaded = true;
        fileInputs.forEach((fileInput) => {
            if (!fileInput.value) isFilesUploaded = false;
        });
        return isFilesUploaded;
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }
}

const fileService = FileService.getInstance();
export default fileService;