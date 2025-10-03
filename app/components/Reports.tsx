'use client';
import { useState } from 'react';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';

export default function Reports() {
    const [filters, setFilters] = useState({
        reportType: 'department',
        startDate: '2024-01-01',
        endDate: '2024-03-31'
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const departmentReport = [
        {
            department: 'Health',
            budget: 1200000,
            utilized: 950000,
            utilization: 79.2,
            balance: 250000
        },
        {
            department: 'Education',
            budget: 900000,
            utilized: 720000,
            utilization: 80.0,
            balance: 180000
        },
        {
            department: 'Social Services',
            budget: 800000,
            utilized: 650000,
            utilization: 81.3,
            balance: 150000
        },
        {
            department: 'Livelihoods',
            budget: 700000,
            utilized: 520000,
            utilization: 74.3,
            balance: 180000
        },
        {
            department: 'Administration',
            budget: 400000,
            utilized: 320000,
            utilization: 80.0,
            balance: 80000
        }
    ];

    const donorReport = [
        {
            donor: 'Global Health Foundation',
            amount: 3000000,
            utilized: 2450000,
            balance: 550000,
            projects: ['Health Program', 'Community Outreach']
        },
        {
            donor: 'Education for All',
            amount: 2000000,
            utilized: 1800000,
            balance: 200000,
            projects: ['School Support', 'Teacher Training']
        },
        {
            donor: 'Community Development Fund',
            amount: 1500000,
            utilized: 1200000,
            balance: 300000,
            projects: ['Livelihoods', 'Social Services']
        }
    ];

    const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
        // Determine which data to export based on report type
        let exportData: any[];
        let reportTitle = '';

        if (filters.reportType === 'department') {
            reportTitle = 'Department Utilization Report';
            if (format === 'pdf') {
                const pdfData = departmentReport.map(dept => ({
                    date: filters.endDate,
                    description: `${dept.department} - Budget: ${dept.budget}, Utilized: ${dept.utilized}`,
                    department: dept.department,
                    amount: dept.balance.toString(),
                    status: 'approved'
                }));
                exportToPDF(pdfData as any, 'Department_Report');
                return;
            } else {
                exportData = departmentReport.map(({ department, budget, utilized, utilization, balance }) => ({
                    Department: department,
                    'Budget Allocated': `KSh ${budget.toLocaleString()}`,
                    'Amount Utilized': `KSh ${utilized.toLocaleString()}`,
                    'Utilization %': `${utilization}%`,
                    Balance: `KSh ${balance.toLocaleString()}`
                }));
            }
        } else if (filters.reportType === 'donor') {
            reportTitle = 'Donor Report';
            if (format === 'pdf') {
                const pdfData = donorReport.map(donor => ({
                    date: filters.endDate,
                    description: `${donor.donor} - Amount: ${donor.amount}, Utilized: ${donor.utilized}`,
                    department: donor.donor,
                    amount: donor.balance.toString(),
                    status: 'approved'
                }));
                exportToPDF(pdfData as any, 'Donor_Report');
                return;
            } else {
                exportData = donorReport.map(({ donor, amount, utilized, balance, projects }) => ({
                    Donor: donor,
                    'Amount Committed': `KSh ${amount.toLocaleString()}`,
                    'Amount Utilized': `KSh ${utilized.toLocaleString()}`,
                    Balance: `KSh ${balance.toLocaleString()}`,
                    Projects: projects.join(', ')
                }));
            }
        } else {
            alert('No data available for this report type');
            return;
        }

        if (format === 'excel') {
            exportToExcel(exportData, `${filters.reportType}_Report`, reportTitle);
        } else if (format === 'csv') {
            exportToCSV(exportData, `${filters.reportType}_Report`, reportTitle);
        }
    };

    const handleGenerate = () => {
        if (!filters.startDate || !filters.endDate) {
            alert('Please select both start and end dates');
            return;
        }

        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);

        if (startDate > endDate) {
            alert('Start date must be before end date');
            return;
        }

        setIsGenerating(true);

        // Simulate report generation
        setTimeout(() => {
            setIsGenerating(false);

            let reportSummary = '';
            if (filters.reportType === 'department') {
                const totalBudget = departmentReport.reduce((sum, dept) => sum + dept.budget, 0);
                const totalUtilized = departmentReport.reduce((sum, dept) => sum + dept.utilized, 0);
                const avgUtilization = ((totalUtilized / totalBudget) * 100).toFixed(1);
                reportSummary = `Department Utilization Report\n\nPeriod: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}\n\nTotal Budget: KSh ${totalBudget.toLocaleString()}\nTotal Utilized: KSh ${totalUtilized.toLocaleString()}\nAverage Utilization: ${avgUtilization}%\n\nDepartments Analyzed: ${departmentReport.length}`;
            } else if (filters.reportType === 'donor') {
                const totalCommitted = donorReport.reduce((sum, donor) => sum + donor.amount, 0);
                const totalUtilized = donorReport.reduce((sum, donor) => sum + donor.utilized, 0);
                reportSummary = `Donor Report\n\nPeriod: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}\n\nTotal Committed: KSh ${totalCommitted.toLocaleString()}\nTotal Utilized: KSh ${totalUtilized.toLocaleString()}\nRemaining Balance: KSh ${(totalCommitted - totalUtilized).toLocaleString()}\n\nActive Donors: ${donorReport.length}`;
            } else {
                reportSummary = `${filters.reportType.charAt(0).toUpperCase() + filters.reportType.slice(1)} Report\n\nThis report type is currently under development.`;
            }

            alert(`Report Generated Successfully!\n\n${reportSummary}`);
        }, 1500);
    };

    const getUtilizationColor = (utilization: number) => {
        if (utilization >= 90) return 'bg-red-100 text-red-800';
        if (utilization >= 75) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const renderReportContent = () => {
        switch (filters.reportType) {
            case 'department':
                return (
                    <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            Department Utilization Report
                        </h5>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 font-medium text-gray-600">Department</th>
                                    <th className="text-left py-3 font-medium text-gray-600">Budget Allocated</th>
                                    <th className="text-left py-3 font-medium text-gray-600">Amount Utilized</th>
                                    <th className="text-left py-3 font-medium text-gray-600">Utilization %</th>
                                    <th className="text-left py-3 font-medium text-gray-600">Balance</th>
                                </tr>
                                </thead>
                                <tbody>
                                {departmentReport.map((dept, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {dept.department}
                        </span>
                                        </td>
                                        <td className="py-3 font-mono">KSh {dept.budget.toLocaleString()}</td>
                                        <td className="py-3 font-mono">KSh {dept.utilized.toLocaleString()}</td>
                                        <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUtilizationColor(dept.utilization)}`}>
                          {dept.utilization}%
                        </span>
                                        </td>
                                        <td className="py-3 font-mono font-medium">KSh {dept.balance.toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr className="bg-gray-50 font-semibold">
                                    <td className="py-3">Total</td>
                                    <td className="py-3 font-mono">KSh {departmentReport.reduce((sum, dept) => sum + dept.budget, 0).toLocaleString()}</td>
                                    <td className="py-3 font-mono">KSh {departmentReport.reduce((sum, dept) => sum + dept.utilized, 0).toLocaleString()}</td>
                                    <td className="py-3 font-mono">
                                        {((departmentReport.reduce((sum, dept) => sum + dept.utilized, 0) / departmentReport.reduce((sum, dept) => sum + dept.budget, 0)) * 100).toFixed(1)}%
                                    </td>
                                    <td className="py-3 font-mono">KSh {departmentReport.reduce((sum, dept) => sum + dept.balance, 0).toLocaleString()}</td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                );

            case 'donor':
                return (
                    <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-4">Donor Reporting</h5>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 font-medium text-gray-600">Donor</th>
                                    <th className="text-left py-3 font-medium text-gray-600">Amount Committed</th>
                                    <th className="text-left py-3 font-medium text-gray-600">Amount Utilized</th>
                                    <th className="text-left py-3 font-medium text-gray-600">Balance</th>
                                    <th className="text-left py-3 font-medium text-gray-600">Projects</th>
                                </tr>
                                </thead>
                                <tbody>
                                {donorReport.map((donor, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="py-3 font-medium">{donor.donor}</td>
                                        <td className="py-3 font-mono">KSh {donor.amount.toLocaleString()}</td>
                                        <td className="py-3 font-mono">KSh {donor.utilized.toLocaleString()}</td>
                                        <td className="py-3 font-mono font-medium">KSh {donor.balance.toLocaleString()}</td>
                                        <td className="py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {donor.projects.map((project, pIndex) => (
                                                    <span key={pIndex} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {project}
                            </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'timeframe':
                return (
                    <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-4">Timeframe Analysis</h5>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <p className="text-blue-700">
                                Timeframe analysis report would show expenditure patterns over different periods.
                                This feature will be available in the next update.
                            </p>
                        </div>
                    </div>
                );

            case 'project':
                return (
                    <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-4">Project Performance</h5>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <p className="text-green-700">
                                Project performance tracking and reporting will be implemented in the accounting engine upgrade.
                            </p>
                        </div>
                    </div>
                );

            default:
                return <div>Select a report type to generate</div>;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Fund Reports</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Export PDF
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
                        className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors flex items-center"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                    </button>
                    <button
                        onClick={() => handleExport('csv')}
                        className="px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors flex items-center"
                    >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                        <select
                            value={filters.reportType}
                            onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="department">Department Utilization</option>
                            <option value="donor">Donor Reporting</option>
                            <option value="timeframe">Timeframe Analysis</option>
                            <option value="project">Project Performance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                {renderReportContent()}
            </div>
        </div>
    );
}