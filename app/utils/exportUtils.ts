import * as XLSX from 'xlsx';
import { exportToPDFReact } from './pdfExporter';

// Define interface for export data
interface ExportData {
    [key: string]: string | number;
}

export const exportToPDF = exportToPDFReact;

export const exportToExcel = (data: ExportData[], filename: string = 'report', title: string = 'Report'): void => {
    try {
        // Create workbook with professional styling
        const header = Object.keys(data[0] || {});
        const worksheetData = [
            ['KENYA COMMUNITY NGO'], // Company name
            [title.toUpperCase()],   // Report title
            [`Generated: ${new Date().toLocaleDateString()}`], // Date
            [''], // Empty row for spacing
            header, // Column headers
            ...data.map(row => header.map(key => row[key])) // Data rows
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();

        // Add merge cells for title and headers
        if (!worksheet['!merges']) worksheet['!merges'] = [];
        worksheet['!merges'].push(
            { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } }, // Company name
            { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } }, // Report title
            { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } }  // Date
        );

        // Auto-size columns
        const colWidths = header.map((key, index) => {
            if (index === 0) {
                return { wch: Math.max(15, key.length) }; // First column wider
            }
            return {
                wch: Math.max(
                    12,
                    key.length,
                    ...data.map(row => String(row[key] || '').length)
                )
            };
        });
        worksheet['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
        console.error('Error generating Excel:', error);
        alert('Error generating Excel file. Please try again.');
    }
};

export const exportToCSV = (data: ExportData[], filename: string = 'report', title: string = 'Report'): void => {
    try {
        if (data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);

        // Add professional headers to CSV
        const csvContent = [
            `KENYA COMMUNITY NGO`,
            title.toUpperCase(),
            `Generated: ${new Date().toLocaleDateString()}`,
            '',
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    // Handle values that might contain commas or quotes
                    if (typeof value === 'string') {
                        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                            return `"${value.replace(/"/g, '""')}"`;
                        }
                    }
                    return value;
                }).join(',')
            ),
            '',
            'Confidential - For Internal Use Only'
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating CSV:', error);
        alert('Error generating CSV file. Please try again.');
    }
};