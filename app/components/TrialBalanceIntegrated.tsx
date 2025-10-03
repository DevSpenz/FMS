'use client';
import { FileText, Download } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { useTrialBalance } from '../hooks/useSupabaseData';

export default function TrialBalanceIntegrated() {
    const { accounts, loading } = useTrialBalance();

    const totalDebits = accounts.reduce((sum, acc) => sum + Number(acc.total_debit), 0);
    const totalCredits = accounts.reduce((sum, acc) => sum + Number(acc.total_credit), 0);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    const handleExportPDF = () => {
        const data = accounts.map(acc => ({
            account_code: acc.account_code,
            account_name: acc.account_name,
            account_type: acc.account_type,
            debit: Number(acc.total_debit).toFixed(2),
            credit: Number(acc.total_credit).toFixed(2)
        }));
        exportToPDF(data as any, 'trial_balance', 'Trial Balance Report');
    };

    const handleExportExcel = () => {
        const data = accounts.map(acc => ({
            'Account Code': acc.account_code,
            'Account Name': acc.account_name,
            'Account Type': acc.account_type,
            'Debit': Number(acc.total_debit).toLocaleString(),
            'Credit': Number(acc.total_credit).toLocaleString()
        }));
        exportToExcel(data, 'trial_balance', 'Trial Balance');
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading trial balance...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Trial Balance</h2>
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

            {!isBalanced && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">
                        Warning: Trial Balance does not balance! Difference: KSh {Math.abs(totalDebits - totalCredits).toLocaleString()}
                    </p>
                </div>
            )}

            {isBalanced && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">
                        Trial Balance is in balance. Total Debits = Total Credits = KSh {totalDebits.toLocaleString()}
                    </p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 font-semibold text-gray-700">Account Code</th>
                            <th className="text-left py-3 font-semibold text-gray-700">Account Name</th>
                            <th className="text-left py-3 font-semibold text-gray-700">Type</th>
                            <th className="text-right py-3 font-semibold text-gray-700">Debit (KSh)</th>
                            <th className="text-right py-3 font-semibold text-gray-700">Credit (KSh)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map(type => {
                            const typeAccounts = accounts.filter(acc => acc.account_type === type);
                            if (typeAccounts.length === 0) return null;

                            return (
                                <React.Fragment key={type}>
                                    <tr className="bg-gray-50">
                                        <td colSpan={5} className="py-2 px-3 font-semibold text-gray-800">
                                            {type}
                                        </td>
                                    </tr>
                                    {typeAccounts.map((acc) => (
                                        <tr key={acc.account_id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 font-mono text-sm">{acc.account_code}</td>
                                            <td className="py-3">{acc.account_name}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    acc.account_type === 'Asset' ? 'bg-blue-100 text-blue-800' :
                                                    acc.account_type === 'Liability' ? 'bg-red-100 text-red-800' :
                                                    acc.account_type === 'Equity' ? 'bg-green-100 text-green-800' :
                                                    acc.account_type === 'Revenue' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {acc.account_type}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right font-mono">
                                                {Number(acc.total_debit) > 0 ? Number(acc.total_debit).toLocaleString() : '-'}
                                            </td>
                                            <td className="py-3 text-right font-mono">
                                                {Number(acc.total_credit) > 0 ? Number(acc.total_credit).toLocaleString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                        </tbody>
                        <tfoot className="border-t-2 border-gray-300">
                        <tr className="font-bold bg-gray-100">
                            <td colSpan={3} className="py-3 text-right">Total:</td>
                            <td className="py-3 text-right font-mono">{totalDebits.toLocaleString()}</td>
                            <td className="py-3 text-right font-mono">{totalCredits.toLocaleString()}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
