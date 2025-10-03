'use client';
import { useState } from 'react';
import { FileText, Download, ListFilter as Filter } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { useCashbook } from '../hooks/useSupabaseData';

export default function CashbookIntegrated() {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: ''
    });

    const { transactions, loading, refresh } = useCashbook(filters);

    let runningBalance = 0;
    const transactionsWithBalance = transactions.map(tx => {
        runningBalance += Number(tx.cash_in) - Number(tx.cash_out);
        return {
            ...tx,
            balance: runningBalance
        };
    });

    const totalCashIn = transactions.reduce((sum, tx) => sum + Number(tx.cash_in), 0);
    const totalCashOut = transactions.reduce((sum, tx) => sum + Number(tx.cash_out), 0);

    const handleExportPDF = () => {
        const data = transactionsWithBalance.map(tx => ({
            date: tx.date,
            voucher_number: tx.voucher_number,
            description: tx.description,
            cash_in: Number(tx.cash_in).toFixed(2),
            cash_out: Number(tx.cash_out).toFixed(2),
            balance: tx.balance.toFixed(2)
        }));
        exportToPDF(data as any, 'cashbook', 'Cashbook Report');
    };

    const handleExportExcel = () => {
        const data = transactionsWithBalance.map(tx => ({
            'Date': tx.date,
            'Voucher': tx.voucher_number,
            'Description': tx.description,
            'Department': tx.department || 'N/A',
            'Cash In (KSh)': Number(tx.cash_in).toLocaleString(),
            'Cash Out (KSh)': Number(tx.cash_out).toLocaleString(),
            'Balance (KSh)': tx.balance.toLocaleString()
        }));
        exportToExcel(data, 'cashbook', 'Cashbook');
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading cashbook...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cashbook</h2>
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

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <div className="md:col-span-2 flex items-end">
                        <button
                            onClick={refresh}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Cash In</h3>
                    <p className="text-2xl font-bold text-green-600">KSh {totalCashIn.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Cash Out</h3>
                    <p className="text-2xl font-bold text-red-600">KSh {totalCashOut.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Net Cash Flow</h3>
                    <p className="text-2xl font-bold text-blue-600">KSh {(totalCashIn - totalCashOut).toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 font-semibold text-gray-700">Date</th>
                            <th className="text-left py-3 font-semibold text-gray-700">Voucher</th>
                            <th className="text-left py-3 font-semibold text-gray-700">Description</th>
                            <th className="text-left py-3 font-semibold text-gray-700">Department</th>
                            <th className="text-right py-3 font-semibold text-gray-700">Cash In (KSh)</th>
                            <th className="text-right py-3 font-semibold text-gray-700">Cash Out (KSh)</th>
                            <th className="text-right py-3 font-semibold text-gray-700">Balance (KSh)</th>
                            <th className="text-center py-3 font-semibold text-gray-700">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactionsWithBalance.map((tx, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="py-3">{new Date(tx.date).toLocaleDateString()}</td>
                                <td className="py-3 font-mono text-sm">{tx.voucher_number}</td>
                                <td className="py-3">{tx.description}</td>
                                <td className="py-3">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                        {tx.department || 'N/A'}
                                    </span>
                                </td>
                                <td className="py-3 text-right font-mono text-green-600 font-semibold">
                                    {Number(tx.cash_in) > 0 ? Number(tx.cash_in).toLocaleString() : '-'}
                                </td>
                                <td className="py-3 text-right font-mono text-red-600 font-semibold">
                                    {Number(tx.cash_out) > 0 ? Number(tx.cash_out).toLocaleString() : '-'}
                                </td>
                                <td className="py-3 text-right font-mono font-bold">
                                    {tx.balance.toLocaleString()}
                                </td>
                                <td className="py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        tx.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot className="border-t-2 border-gray-300">
                        <tr className="font-bold bg-gray-100">
                            <td colSpan={4} className="py-3 text-right">Total:</td>
                            <td className="py-3 text-right font-mono text-green-600">{totalCashIn.toLocaleString()}</td>
                            <td className="py-3 text-right font-mono text-red-600">{totalCashOut.toLocaleString()}</td>
                            <td className="py-3 text-right font-mono">{(totalCashIn - totalCashOut).toLocaleString()}</td>
                            <td></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
