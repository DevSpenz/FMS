'use client';
import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

export default function BalanceSheet() {
    const [selectedDate, setSelectedDate] = useState('2023-03-15');
    const [isGenerating, setIsGenerating] = useState(false);

    const assetsData = [
        { item: 'Cash and Bank Balances', amount: 2740000 },
        { item: 'Accounts Receivable', amount: 450000 },
        { item: 'Prepaid Expenses', amount: 120000 },
        { item: 'Office Equipment', amount: 350000 },
        { item: 'Vehicles', amount: 1200000 }
    ];

    const liabilitiesData = [
        { item: 'Accounts Payable', amount: 280000 },
        { item: 'Accrued Expenses', amount: 150000 },
        { item: 'Loans Payable', amount: 500000 }
    ];

    const equityData = [
        { item: 'Net Assets', amount: 4230000 }
    ];

    const totalAssets = assetsData.reduce((sum, asset) => sum + asset.amount, 0);
    const totalLiabilities = liabilitiesData.reduce((sum, liability) => sum + liability.amount, 0);
    const totalEquity = equityData.reduce((sum, equity) => sum + equity.amount, 0);
    const totalLiabilitiesEquity = totalLiabilities + totalEquity;

    const handleExport = (format: 'pdf' | 'excel') => {
        if (format === 'pdf') {
            // Combine all data for PDF export
            const allData = [
                ...assetsData.map(asset => ({
                    date: selectedDate,
                    description: `Asset: ${asset.item}`,
                    department: 'Assets',
                    amount: asset.amount.toString(),
                    status: 'approved'
                })),
                ...liabilitiesData.map(liability => ({
                    date: selectedDate,
                    description: `Liability: ${liability.item}`,
                    department: 'Liabilities',
                    amount: liability.amount.toString(),
                    status: 'approved'
                })),
                ...equityData.map(equity => ({
                    date: selectedDate,
                    description: `Equity: ${equity.item}`,
                    department: 'Equity',
                    amount: equity.amount.toString(),
                    status: 'approved'
                }))
            ];
            exportToPDF(allData as any, 'Balance_Sheet_Report');
        } else if (format === 'excel') {
            const exportData = [
                { Category: 'ASSETS', Item: '', Amount: '' },
                ...assetsData.map(({ item, amount }) => ({
                    Category: '',
                    Item: item,
                    Amount: `KSh ${amount.toLocaleString()}`
                })),
                { Category: '', Item: 'Total Assets', Amount: `KSh ${totalAssets.toLocaleString()}` },
                { Category: '', Item: '', Amount: '' },
                { Category: 'LIABILITIES', Item: '', Amount: '' },
                ...liabilitiesData.map(({ item, amount }) => ({
                    Category: '',
                    Item: item,
                    Amount: `KSh ${amount.toLocaleString()}`
                })),
                { Category: '', Item: 'Total Liabilities', Amount: `KSh ${totalLiabilities.toLocaleString()}` },
                { Category: '', Item: '', Amount: '' },
                { Category: 'EQUITY', Item: '', Amount: '' },
                ...equityData.map(({ item, amount }) => ({
                    Category: '',
                    Item: item,
                    Amount: `KSh ${amount.toLocaleString()}`
                })),
                { Category: '', Item: 'Total Equity', Amount: `KSh ${totalEquity.toLocaleString()}` },
                { Category: '', Item: '', Amount: '' },
                { Category: '', Item: 'Total Liabilities & Equity', Amount: `KSh ${totalLiabilitiesEquity.toLocaleString()}` }
            ];
            exportToExcel(exportData, 'Balance_Sheet_Report', `Balance Sheet - ${selectedDate}`);
        }
    };

    const handleGenerate = () => {
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }

        setIsGenerating(true);

        // Simulate report generation
        setTimeout(() => {
            setIsGenerating(false);
            const isBalanced = totalAssets === totalLiabilitiesEquity;
            alert(`Balance Sheet generated successfully for ${new Date(selectedDate).toLocaleDateString()}\n\nTotal Assets: KSh ${totalAssets.toLocaleString()}\nTotal Liabilities & Equity: KSh ${totalLiabilitiesEquity.toLocaleString()}\nStatus: ${isBalanced ? 'Balanced ✓' : 'Unbalanced ⚠'}`);
        }, 1000);
    };

    const isBalanced = totalAssets === totalLiabilitiesEquity;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Balance Sheet</h2>
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
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">As of Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900">KENYA COMMUNITY NGO</h3>
                    <p className="text-gray-600">Balance Sheet</p>
                    <p className="text-gray-500 text-sm">As of {new Date(selectedDate).toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Assets Section */}
                    <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Assets</h5>
                        <div className="space-y-3">
                            {assetsData.map((asset, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b">
                                    <span className="text-gray-700">{asset.item}</span>
                                    <span className="font-mono font-medium">KSh {asset.amount.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-semibold bg-blue-50 px-3 rounded">
                                <span className="text-gray-900">Total Assets</span>
                                <span className="font-mono text-lg">KSh {totalAssets.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Liabilities & Equity Section */}
                    <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Liabilities & Equity</h5>

                        {/* Liabilities */}
                        <div className="mb-6">
                            <h6 className="font-medium text-gray-700 mb-3">Liabilities</h6>
                            <div className="space-y-3">
                                {liabilitiesData.map((liability, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b">
                                        <span className="text-gray-700">{liability.item}</span>
                                        <span className="font-mono font-medium">KSh {liability.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-2 border-b font-medium bg-gray-50 px-3 rounded">
                                    <span className="text-gray-900">Total Liabilities</span>
                                    <span className="font-mono">KSh {totalLiabilities.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Equity */}
                        <div>
                            <h6 className="font-medium text-gray-700 mb-3">Equity</h6>
                            <div className="space-y-3">
                                {equityData.map((equity, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b">
                                        <span className="text-gray-700">{equity.item}</span>
                                        <span className="font-mono font-medium">KSh {equity.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-2 border-b font-medium bg-gray-50 px-3 rounded">
                                    <span className="text-gray-900">Total Equity</span>
                                    <span className="font-mono">KSh {totalEquity.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Liabilities & Equity */}
                        <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-semibold bg-green-50 px-3 rounded mt-4">
                            <span className="text-gray-900">Total Liabilities & Equity</span>
                            <span className="font-mono text-lg">KSh {totalLiabilitiesEquity.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Balance Validation */}
                <div className={`mt-6 p-4 ${isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className={`w-8 h-8 ${isBalanced ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                <span className={`text-sm font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                  {isBalanced ? '✓' : '!'}
                </span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${isBalanced ? 'text-green-800' : 'text-red-800'}`}>
                                Balance Sheet is {isBalanced ? 'Balanced' : 'Unbalanced'}
                            </h3>
                            <p className={`text-sm ${isBalanced ? 'text-green-700' : 'text-red-700'} mt-1`}>
                                {isBalanced
                                    ? `Assets (KSh ${totalAssets.toLocaleString()}) = Liabilities & Equity (KSh ${totalLiabilitiesEquity.toLocaleString()})`
                                    : `Assets (KSh ${totalAssets.toLocaleString()}) ≠ Liabilities & Equity (KSh ${totalLiabilitiesEquity.toLocaleString()})`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}