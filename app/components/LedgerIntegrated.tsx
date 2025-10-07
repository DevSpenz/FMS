'use client';
import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { exportToExcel } from '../utils/exportUtils';
import { exportLedgerToPDF } from '../utils/pdfExporters';
import { useLedger, useChartOfAccounts } from '../hooks/useSupabaseData';

export default function LedgerIntegrated() {
    const [selectedAccount, setSelectedAccount] = useState('');
    const { entries, loading: entriesLoading } = useLedger(selectedAccount || undefined);
    const { accounts, loading: accountsLoading } = useChartOfAccounts();

    const handleExportPDF = () => {
        const data = entries.map(entry => ({
            date: new Date(entry.transaction_date).toLocaleDateString(),
            voucher: entry.voucher_number,
            description: entry.description,
            debit: Number(entry.debit).toFixed(2),
            credit: Number(entry.credit).toFixed(2)
        }));
        exportLedgerToPDF(data, 'general_ledger');
    };

    const handleExportExcel = () => {
        const data = entries.map(entry => ({
            'Date': entry.transaction_date,
            'Voucher': entry.voucher_number,
            'Account Code': entry.account_code,
            'Account Name': entry.account_name,
            'Description': entry.description,
            'Department': entry.department || 'N/A',
            'Debit (KSh)': Number(entry.debit).toLocaleString(),
            'Credit (KSh)': Number(entry.credit).toLocaleString()
        }));
        exportToExcel(data, 'general_ledger', 'General Ledger');
    };

    if (accountsLoading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading ledger...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">General Ledger</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Account</label>
                <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">All Accounts</option>
                    {accounts.map((acc: any) => (
                        <option key={acc.id} value={acc.account_code}>
                            {acc.account_code} - {acc.account_name}
                        </option>
                    ))}
                </select>
            </div>

            {entriesLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading entries...</p>
                    </div>
                </div>
            ) : entries.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">No journal entries found</p>
                    <p className="text-gray-400 text-sm mt-2">Create vouchers to see ledger entries</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-3 font-semibold text-gray-700">Date</th>
                                <th className="text-left py-3 font-semibold text-gray-700">Voucher</th>
                                <th className="text-left py-3 font-semibold text-gray-700">Account</th>
                                <th className="text-left py-3 font-semibold text-gray-700">Description</th>
                                <th className="text-left py-3 font-semibold text-gray-700">Department</th>
                                <th className="text-right py-3 font-semibold text-gray-700">Debit (KSh)</th>
                                <th className="text-right py-3 font-semibold text-gray-700">Credit (KSh)</th>
                                <th className="text-center py-3 font-semibold text-gray-700">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {entries.map((entry: any, index: number) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-3">{new Date(entry.transaction_date).toLocaleDateString()}</td>
                                    <td className="py-3 font-mono text-sm">{entry.voucher_number}</td>
                                    <td className="py-3">
                                        <div>
                                            <span className="font-mono text-xs text-gray-600">{entry.account_code}</span>
                                            <br />
                                            <span className="text-sm">{entry.account_name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-sm">{entry.description}</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {entry.department || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right font-mono text-green-600 font-semibold">
                                        {Number(entry.debit) > 0 ? Number(entry.debit).toLocaleString() : '-'}
                                    </td>
                                    <td className="py-3 text-right font-mono text-red-600 font-semibold">
                                        {Number(entry.credit) > 0 ? Number(entry.credit).toLocaleString() : '-'}
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            entry.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
