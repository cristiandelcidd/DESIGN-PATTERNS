// Producto abstracto
interface ReportExporter {
    export(data: string): void;
}

// Productos concretos
class PdfReporter implements ReportExporter {
    export(data: string): void {
        console.log("Exporting PDF report...");
    }
}

class ExcelReporter implements ReportExporter {
    export(data: string): void {
        console.log("Exporting Excel report...");
    }
}

class JsonReporter implements ReportExporter {
    export(data: string): void {
        console.log("Exporting JSON report...");
    }
}

// Creador abstracto
abstract class ReportGenerator {
    // Factory Method
    abstract createExporter(): ReportExporter;

    // Método principal
    generateReport(data: string): void {
        this.validate(data);

        const exporter = this.createExporter();

        exporter.export(data);

        this.logSuccess();
    }

    protected validate(data: string): void {
        if (!data) {
            throw new Error("Invalid report data");
        }
    }

    protected logSuccess(): void {
        console.log("Report generated successfully.");
    }
}

// Creators concretos
class PdfReportGenerator extends ReportGenerator {
    createExporter(): ReportExporter {
        return new PdfReporter();
    }
}

class ExcelReportGenerator extends ReportGenerator {
    createExporter(): ReportExporter {
        return new ExcelReporter();
    }
}

class JsonReportGenerator extends ReportGenerator {
    createExporter(): ReportExporter {
        return new JsonReporter();
    }
}

// Cliente
const pdfReporter = new PdfReportGenerator();
pdfReporter.generateReport("Sales report");

const excelReporter = new ExcelReportGenerator();
excelReporter.generateReport("Users report");

const jsonReporter = new JsonReportGenerator();
jsonReporter.generateReport("Customers report");