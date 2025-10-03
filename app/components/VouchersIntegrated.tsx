'use client';
import { useState } from 'react';
import { Plus, Eye, Printer, FileText, Download, ListFilter as Filter, X } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { useVouchers, useDepartments, useChartOfAccounts, createVoucher } from '../hooks/useSupabaseData';

type VoucherStatus = 'pending' | 'approved' | 'rejected';

interface VoucherFormData {
    date: string;
    department: string;
    description: string;
    amount: string;
    type: 'income' | 'expense' | 'transfer';
    expenseAccountCode: string;
}

interface Filters {
    status: string;
    department: string;
    startDate: string;
    endDate: string;
}

export default function VouchersIntegrated() {
    const [filters, setFilters] = useState<Filters>({
        status: '',
        department: '',
        startDate: '',
        endDate: ''
    });

    const { vouchers, loading, refresh } = useVouchers(filters);
    const { departments } = useDepartments();
    const { accounts } = useChartOfAccounts('Expense');

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<VoucherFormData>({
        date: new Date().toISOString().split('T')[0],
        department: '',
        description: '',
        amount: '',
        type: 'expense',
        expenseAccountCode: ''
    });

    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateVoucher = async () => {
        if (!formData.date || !formData.department || !formData.description || !formData.amount) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setCreating(true);
            setError(null);

            await createVoucher(
                formData.department,
                formData.description,
                Number(formData.amount),
                formData.type,
                formData.expenseAccountCode || undefined,
                undefined
            );

            setShowModal(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                department: '',
                description: '',
                amount: '',
                type: 'expense',
                expenseAccountCode: ''
            });
            refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to create voucher');
        } finally {
            setCreating(false);
        }
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        if (format === 'pdf') {
            const pdfData = vouchers.map(voucher => ({
                date: voucher.date,
                description: voucher.description,
                department: voucher.department || 'N/A',
                amount: Number(voucher.amount).toString(),
                status: voucher.status
            }));
            exportToPDF(pdfData as any, 'Vouchers_Report');
        } else if (format === 'excel') {
            const exportData = vouchers.map((v: any) => ({
                'Voucher No.': v.voucher_number,
                Date: v.date,
                Department: v.department || 'N/A',
                Description: v.description,
                Amount: `KSh ${Number(v.amount).toLocaleString()}`,
                Status: v.status.charAt(0).toUpperCase() + v.status.slice(1)
            }));
            exportToExcel(exportData, 'Vouchers_Report', 'Vouchers Report');
        }
    };

    const getStatusBadge = (status: VoucherStatus) => {
        const styles = {
            approved: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const handleViewVoucher = (voucher: any) => {
        alert(`View voucher ${voucher.voucher_number} details:\n\n${JSON.stringify(voucher.journal_entries, null, 2)}`);
    };

    const handlePrintVoucher = (voucherId: string) => {
        alert(`Print voucher ${voucherId}`);
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading vouchers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Vouchers</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Voucher
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept: any) => (
                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                            ))}
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
                            onClick={refresh}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium text-gray-600">Voucher No.</th>
                            <th className="text-left py-3 font-medium text-gray-600">Date</th>
                            <th className="text-left py-3 font-medium text-gray-600">Department</th>
                            <th className="text-left py-3 font-medium text-gray-600">Description</th>
                            <th className="text-left py-3 font-medium text-gray-600">Amount</th>
                            <th className="text-left py-3 font-medium text-gray-600">Status</th>
                            <th className="text-left py-3 font-medium text-gray-600">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {vouchers.map((voucher: any) => (
                            <tr key={voucher.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 font-mono font-medium">{voucher.voucher_number}</td>
                                <td className="py-3">{new Date(voucher.date).toLocaleDateString()}</td>
                                <td className="py-3">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                        {voucher.department || 'N/A'}
                                    </span>
                                </td>
                                <td className="py-3">{voucher.description}</td>
                                <td className="py-3 font-mono font-medium">KSh {Number(voucher.amount).toLocaleString()}</td>
                                <td className="py-3">{getStatusBadge(voucher.status)}</td>
                                <td className="py-3">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleViewVoucher(voucher)}
                                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                            title="View Voucher"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handlePrintVoucher(voucher.voucher_number)}
                                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                            title="Print Voucher"
                                        >
                                            <Printer className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Create New Voucher</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept: any) => (
                                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                    <option value="transfer">Transfer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Expense Account</label>
                                <select
                                    value={formData.expenseAccountCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, expenseAccountCode: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={formData.type !== 'expense'}
                                >
                                    <option value="">Select Account</option>
                                    {accounts.map((acc: any) => (
                                        <option key={acc.id} value={acc.account_code}>
                                            {acc.account_code} - {acc.account_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter voucher description"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KSh) *</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={creating}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateVoucher}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                disabled={creating}
                            >
                                {creating ? 'Creating...' : 'Create Voucher'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
