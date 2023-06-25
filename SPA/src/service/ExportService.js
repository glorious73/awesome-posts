class ExportService {
    constructor() { }

    static getInstance() {
        if (!this.instance) {
            this.instance = new ExportService();
        }
        return this.instance;
    }

    exportToCSV(list, fileName) {
        const csvList = this._convertToCSV(list);
        this._downloadCSV(csvList, fileName);
    }

    _convertToCSV(list) {
        const array = [Object.keys(list[0])].concat(list);
        return array.map((item) => Object.values(item).toString()).join("\n");
    }

    _downloadCSV(csv, fileName) {
        const csvFile = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const downloadLink = document.createElement("a");
        downloadLink.download = fileName;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
}

const exportService = ExportService.getInstance();
export default exportService;
