'use client';
import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

export default function Ledger() {
    const [filters, setFilters] = useState({
        account: '',
        startDate: '',
        endDate: ''
    });

    const ledgerData = [
        {
            date: '2023-03-15',
            account: 'Health Dept',
            description: 'Medical Supplies',
            debit: 450000,
            credit: 0,
            balance: 450000
        },
        {
            date: '2023-03-15',
            account: 'Main Account',
            description: 'To Health Dept',
            debit: 0,
            credit: 450000,
            balance: 1050000
        },
        {
            date: '2023-03-14',
            account: 'Education Dept',
            description: 'School Materials',
            debit: 320000,
            credit: 0,
            balance: 320000
        },
        {
            date: '2023-03-14',
            account: 'Main Account',
            description: 'To Education Dept',
            debit: 0,
            credit: 320000,
            balance: 1370000
        }
    ];

    const handleExport = (format: 'pdf' | 'excel') => {
        const filteredData = ledgerData.filter((entry) => {
            const entryDate = new Date(entry.date);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            return (
                (!startDate || entryDate >= startDate) &&
                (!endDate || entryDate <= endDate) &&
                (!filters.account || entry.account === filters.account)
            );
        });

        if (format === 'pdf') {
            // Transform data for PDF export (amount must be string)
            const pdfData = filteredData.map(entry => ({
                date: entry.date,
                description: `${entry.account} - ${entry.description}`,
                department: entry.account,
                amount: entry.balance.toString(),
                status: 'approved'
            }));
            exportToPDF(pdfData as any, 'Ledger_Report');
        } else if (format === 'excel') {
            const exportData = filteredData.map(({ date, account, description, debit, credit, balance }) => ({
                Date: new Date(date).toLocaleDateString(),
                Account: account,
                Description: description,
                Debit: debit > 0 ? `KSh ${debit.toLocaleString()}` : '-',
                Credit: credit > 0 ? `KSh ${credit.toLocaleString()}` : '-',
                Balance: `KSh ${balance.toLocaleString()}`
            }));
            exportToExcel(exportData, 'Ledger_Report', 'General Ledger');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">General Ledger</h2>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                        <select
                            value={filters.account}
                            onChange={(e) => setFilters(prev => ({ ...prev, account: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Accounts</option>
                            <option value="Main Account">Main Account</option>
                            <option value="Health Dept">Health Dept</option>
                            <option value="Education Dept">Education Dept</option>
                            <option value="Social Services Dept">Social Services Dept</option>
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
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium text-gray-600">Date</th>
                            <th className="text-left py-3 font-medium text-gray-600">Account</th>
                            <th className="text-left py-3 font-medium text-gray-600">Description</th>
                            <th className="text-left py-3 font-medium text-gray-600">Debit</th>
                            <th className="text-left py-3 font-medium text-gray-600">Credit</th>
                            <th className="text-left py-3 font-medium text-gray-600">Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ledgerData.filter((entry) => {
                            const entryDate = new Date(entry.date);
                            const startDate = filters.startDate ? new Date(filters.startDate) : null;
                            const endDate = filters.endDate ? new Date(filters.endDate) : null;

                            return (
                                (!startDate || entryDate >= startDate) &&
                                (!endDate || entryDate <= endDate) &&
                                (!filters.account || entry.account === filters.account)
                            );
                        }).map((entry, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="py-3">{new Date(entry.date).toLocaleDateString()}</td>
                                <td className="py-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      {entry.account}
                    </span>
                                </td>
                                <td className="py-3">{entry.description}</td>
                                <td className="py-3 font-mono">
                                    {entry.debit > 0 ? `KSh ${entry.debit.toLocaleString()}` : '-'}
                                </td>
                                <td className="py-3 font-mono">
                                    {entry.credit > 0 ? `KSh ${entry.credit.toLocaleString()}` : '-'}
                                </td>
                                <td className="py-3 font-mono font-medium">KSh {entry.balance.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}