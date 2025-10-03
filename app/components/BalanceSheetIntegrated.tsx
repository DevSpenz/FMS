'use client';
import { FileText, Download } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { useBalanceSheet } from '../hooks/useSupabaseData';

export default function BalanceSheetIntegrated() {
    const { data, loading } = useBalanceSheet();

    const assets = data.filter(item => item.category === 'Asset');
    const liabilities = data.filter(item => item.category === 'Liability');
    const equity = data.filter(item => item.category === 'Equity');

    const totalAssets = assets.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalEquity = equity.reduce((sum, item) => sum + Number(item.amount), 0);

    const handleExportPDF = () => {
        const pdfData = data.map(item => ({
            category: item.category,
            account_code: item.account_code,
            account_name: item.account_name,
            amount: Number(item.amount).toFixed(2)
        }));
        exportToPDF(pdfData as any, 'balance_sheet', 'Balance Sheet Report');
    };

    const handleExportExcel = () => {
        const excelData = data.map(item => ({
            'Category': item.category,
            'Account Code': item.account_code,
            'Account Name': item.account_name,
            'Amount (KSh)': Number(item.amount).toLocaleString()
        }));
        exportToExcel(excelData, 'balance_sheet', 'Balance Sheet');
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading balance sheet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Balance Sheet</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={handleExportPDF}
                        className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Export PDF
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors flex items-center"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Assets</h3>
                    <div className="space-y-2">
                        {assets.map((item) => (
                            <div key={item.account_code} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <span className="text-sm font-mono text-gray-600 mr-2">{item.account_code}</span>
                                    <span className="text-gray-800">{item.account_name}</span>
                                </div>
                                <span className="font-mono font-semibold text-gray-900">
                                    KSh {Number(item.amount).toLocaleString()}
                                </span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 mt-4">
                            <span className="font-bold text-gray-900">Total Assets</span>
                            <span className="font-mono font-bold text-blue-600 text-lg">
                                KSh {totalAssets.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Liabilities</h3>
                        <div className="space-y-2">
                            {liabilities.length > 0 ? (
                                <>
                                    {liabilities.map((item) => (
                                        <div key={item.account_code} className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <div>
                                                <span className="text-sm font-mono text-gray-600 mr-2">{item.account_code}</span>
                                                <span className="text-gray-800">{item.account_name}</span>
                                            </div>
                                            <span className="font-mono font-semibold text-gray-900">
                                                KSh {Number(item.amount).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 mt-4">
                                        <span className="font-bold text-gray-900">Total Liabilities</span>
                                        <span className="font-mono font-bold text-red-600 text-lg">
                                            KSh {totalLiabilities.toLocaleString()}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No liabilities recorded</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Equity</h3>
                        <div className="space-y-2">
                            {equity.length > 0 ? (
                                <>
                                    {equity.map((item) => (
                                        <div key={item.account_code} className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <div>
                                                <span className="text-sm font-mono text-gray-600 mr-2">{item.account_code}</span>
                                                <span className="text-gray-800">{item.account_name}</span>
                                            </div>
                                            <span className="font-mono font-semibold text-gray-900">
                                                KSh {Number(item.amount).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 mt-4">
                                        <span className="font-bold text-gray-900">Total Equity</span>
                                        <span className="font-mono font-bold text-green-600 text-lg">
                                            KSh {totalEquity.toLocaleString()}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No equity recorded</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-xl shadow-sm p-6 border-2 border-gray-300">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Accounting Equation Check</p>
                        <p className="text-xs text-gray-500">Assets = Liabilities + Equity</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">
                            KSh {totalAssets.toLocaleString()} = KSh {(totalLiabilities + totalEquity).toLocaleString()}
                        </p>
                        {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01 ? (
                            <p className="text-xs text-green-600 font-semibold">Balanced</p>
                        ) : (
                            <p className="text-xs text-red-600 font-semibold">
                                Out of balance by KSh {Math.abs(totalAssets - (totalLiabilities + totalEquity)).toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
