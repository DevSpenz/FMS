'use client';
import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

export default function TrialBalance() {
    const [selectedDate, setSelectedDate] = useState('2023-03-15');
    const [isGenerating, setIsGenerating] = useState(false);

    const trialBalanceData = [
        { account: 'Main Account', debit: 1500000, credit: 1240000 },
        { account: 'Health Dept', debit: 450000, credit: 0 },
        { account: 'Education Dept', debit: 320000, credit: 0 },
        { account: 'Social Services Dept', debit: 280000, credit: 0 },
        { account: 'Livelihoods Dept', debit: 190000, credit: 0 },
        { account: 'Administration Dept', debit: 75000, credit: 0 }
    ];

    const totals = {
        debit: trialBalanceData.reduce((sum, row) => sum + row.debit, 0),
        credit: trialBalanceData.reduce((sum, row) => sum + row.credit, 0)
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        if (format === 'pdf') {
            // Transform data for PDF export (amount must be string)
            const pdfData = trialBalanceData.map(row => ({
                date: selectedDate,
                description: `${row.account} - Debit: ${row.debit}, Credit: ${row.credit}`,
                department: row.account,
                amount: (row.debit - row.credit).toString(),
                status: 'approved'
            }));
            exportToPDF(pdfData as any, 'Trial_Balance_Report');
        } else if (format === 'excel') {
            const exportData = trialBalanceData.map(({ account, debit, credit }) => ({
                Account: account,
                'Debit (KSh)': debit > 0 ? debit.toLocaleString() : '-',
                'Credit (KSh)': credit > 0 ? credit.toLocaleString() : '-'
            }));
            // Add totals row
            exportData.push({
                Account: 'TOTAL',
                'Debit (KSh)': totals.debit.toLocaleString(),
                'Credit (KSh)': totals.credit.toLocaleString()
            });
            exportToExcel(exportData, 'Trial_Balance_Report', `Trial Balance - ${selectedDate}`);
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
            alert(`Trial Balance generated successfully for ${new Date(selectedDate).toLocaleDateString()}\n\nTotal Debits: KSh ${totals.debit.toLocaleString()}\nTotal Credits: KSh ${totals.credit.toLocaleString()}\nStatus: ${totals.debit === totals.credit ? 'Balanced ✓' : 'Unbalanced'}`);
        }, 1000);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Trial Balance</h2>
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
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium text-gray-600">Account</th>
                            <th className="text-right py-3 font-medium text-gray-600">Debit (KSh)</th>
                            <th className="text-right py-3 font-medium text-gray-600">Credit (KSh)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {trialBalanceData.map((row, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mr-2">
                      {row.account.split(' ')[0]}
                    </span>
                                    {row.account}
                                </td>
                                <td className="py-3 text-right font-mono">
                                    {row.debit > 0 ? row.debit.toLocaleString() : '-'}
                                </td>
                                <td className="py-3 text-right font-mono">
                                    {row.credit > 0 ? row.credit.toLocaleString() : '-'}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
                            <td className="py-3">Total</td>
                            <td className="py-3 text-right font-mono text-lg">{totals.debit.toLocaleString()}</td>
                            <td className="py-3 text-right font-mono text-lg">{totals.credit.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-blue-50">
                            <td className="py-3 font-medium">Difference</td>
                            <td
                                colSpan={2}
                                className="py-3 text-right font-mono font-medium text-lg"
                            >
                                {totals.debit === totals.credit ? (
                                    <span className="text-green-600">✓ Balanced</span>
                                ) : (
                                    <span className="text-red-600">
                      Unbalanced: KSh {Math.abs(totals.debit - totals.credit).toLocaleString()}
                    </span>
                                )}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 text-sm font-bold">✓</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">
                                Trial Balance is {totals.debit === totals.credit ? 'Balanced' : 'Unbalanced'}
                            </h3>
                            <p className="text-sm text-green-700 mt-1">
                                {totals.debit === totals.credit
                                    ? 'Total debits equal total credits. Accounts are balanced.'
                                    : 'Total debits and credits do not match. Please review transactions.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}