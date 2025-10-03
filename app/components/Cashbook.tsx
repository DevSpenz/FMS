'use client';
import { useState } from 'react';
import { Plus, FileText, Download, Filter, X } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import type { Transaction } from '../types';

export default function Cashbook() {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        department: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        voucherNumber: '',
        description: '',
        department: '',
        type: 'expense' as 'income' | 'expense' | 'transfer',
        amount: '',
        status: 'pending' as 'pending' | 'approved' | 'rejected'
    });

    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            _id: '1',
            date: '2023-03-15',
            voucherNumber: 'V-00123',
            description: 'Medical Supplies',
            department: 'Health',
            type: 'expense',
            amount: 450000,
            status: 'approved',
            createdBy: '1'
        },
        {
            _id: '2',
            date: '2023-03-14',
            voucherNumber: 'V-00122',
            description: 'School Materials',
            department: 'Education',
            type: 'expense',
            amount: 320000,
            status: 'approved',
            createdBy: '1'
        },
        {
            _id: '3',
            date: '2023-03-10',
            voucherNumber: 'V-00121',
            description: 'Donation Received',
            department: 'Main Account',
            type: 'income',
            amount: 1500000,
            status: 'approved',
            createdBy: '1'
        }
    ]);

    const handleAddTransaction = () => {
        if (!formData.date || !formData.voucherNumber || !formData.description || !formData.department || !formData.amount) {
            alert('Please fill in all required fields');
            return;
        }

        const newTransaction: Transaction = {
            _id: String(transactions.length + 1),
            date: formData.date,
            voucherNumber: formData.voucherNumber,
            description: formData.description,
            department: formData.department,
            type: formData.type,
            amount: Number(formData.amount),
            status: formData.status,
            createdBy: '1'
        };

        setTransactions([...transactions, newTransaction]);
        setShowModal(false);
        setFormData({
            date: '',
            voucherNumber: '',
            description: '',
            department: '',
            type: 'expense',
            amount: '',
            status: 'pending'
        });
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        const filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            return (
                (!startDate || transactionDate >= startDate) &&
                (!endDate || transactionDate <= endDate) &&
                (!filters.department || transaction.department === filters.department)
            );
        });

        if (format === 'pdf') {
            // Transform transactions for PDF export (amount must be string)
            const pdfData = filteredTransactions.map(t => ({
                date: t.date,
                description: t.description,
                department: t.department,
                amount: t.amount.toString(),
                status: t.status
            }));
            exportToPDF(pdfData as any, 'Cashbook_Report');
        } else if (format === 'excel') {
            const exportData = filteredTransactions.map(({ date, voucherNumber, description, department, type, amount }) => ({
                Date: new Date(date).toLocaleDateString(),
                'Voucher No.': voucherNumber,
                Description: description,
                Department: department,
                Debit: type === 'expense' ? `KSh ${amount.toLocaleString()}` : '-',
                Credit: type === 'income' ? `KSh ${amount.toLocaleString()}` : '-',
            }));
            exportToExcel(exportData, 'Cashbook_Report', 'Cashbook Report');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cashbook</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Transaction
                    </button>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Departments</option>
                            <option value="Health">Health</option>
                            <option value="Education">Education</option>
                            <option value="Social Services">Social Services</option>
                            <option value="Main Account">Main Account</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium text-gray-600">Date</th>
                            <th className="text-left py-3 font-medium text-gray-600">Voucher No.</th>
                            <th className="text-left py-3 font-medium text-gray-600">Description</th>
                            <th className="text-left py-3 font-medium text-gray-600">Department</th>
                            <th className="text-left py-3 font-medium text-gray-600">Debit</th>
                            <th className="text-left py-3 font-medium text-gray-600">Credit</th>
                            <th className="text-left py-3 font-medium text-gray-600">Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.filter((transaction) => {
                            const transactionDate = new Date(transaction.date);
                            const startDate = filters.startDate ? new Date(filters.startDate) : null;
                            const endDate = filters.endDate ? new Date(filters.endDate) : null;

                            return (
                                (!startDate || transactionDate >= startDate) &&
                                (!endDate || transactionDate <= endDate) &&
                                (!filters.department || transaction.department === filters.department)
                            );
                        }).map((transaction, index, filteredArray) => {
                            // Calculate running balance based on filtered transactions
                            const previousTransactions = filteredArray.slice(0, index);
                            const balance = previousTransactions.reduce((sum, t) => {
                                if (t.type === 'income') return sum + t.amount;
                                if (t.type === 'expense') return sum - t.amount;
                                return sum;
                            }, 0) + (transaction.type === 'income' ? transaction.amount : -transaction.amount);

                            return (
                                <tr key={transaction._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td className="py-3 font-mono">{transaction.voucherNumber}</td>
                                    <td className="py-3">{transaction.description}</td>
                                    <td className="py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {transaction.department}
                      </span>
                                    </td>
                                    <td className="py-3">
                                        {transaction.type === 'expense' ? `KSh ${transaction.amount.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="py-3">
                                        {transaction.type === 'income' ? `KSh ${transaction.amount.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="py-3 font-mono font-medium">KSh {balance.toLocaleString()}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add New Transaction</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Number *</label>
                                <input
                                    type="text"
                                    value={formData.voucherNumber}
                                    onChange={(e) => setFormData(prev => ({ ...prev, voucherNumber: e.target.value }))}
                                    placeholder="V-00124"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter transaction description"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Department</option>
                                    <option value="Health">Health</option>
                                    <option value="Education">Education</option>
                                    <option value="Social Services">Social Services</option>
                                    <option value="Main Account">Main Account</option>
                                    <option value="Livelihoods">Livelihoods</option>
                                    <option value="Administration">Administration</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' | 'transfer' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                    <option value="transfer">Transfer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KSh) *</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'pending' | 'approved' | 'rejected' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTransaction}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Add Transaction
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}