'use client';
import { useState } from 'react';
import { Plus, Eye, Printer, FileText, Download, Filter, X } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

// Define types
type VoucherStatus = 'pending' | 'approved' | 'rejected';

interface Voucher {
    id: string;
    date: string;
    department: string;
    description: string;
    amount: number;
    status: VoucherStatus;
}

interface VoucherFormData {
    date: string;
    department: string;
    description: string;
    amount: string;
    status: VoucherStatus;
}

interface Filters {
    status: string;
    department: string;
    startDate: string;
    endDate: string;
}

export default function Vouchers() {
    const [filters, setFilters] = useState<Filters>({
        status: '',
        department: '',
        startDate: '',
        endDate: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<VoucherFormData>({
        date: '',
        department: '',
        description: '',
        amount: '',
        status: 'pending'
    });

    const [vouchers, setVouchers] = useState<Voucher[]>([
        {
            id: 'V-00123',
            date: '2023-03-15',
            department: 'Health',
            description: 'Medical Supplies',
            amount: 450000,
            status: 'approved'
        },
        {
            id: 'V-00122',
            date: '2023-03-14',
            department: 'Education',
            description: 'School Materials',
            amount: 320000,
            status: 'approved'
        },
        {
            id: 'V-00121',
            date: '2023-03-13',
            department: 'Social Services',
            description: 'Community Outreach',
            amount: 280000,
            status: 'pending'
        },
        {
            id: 'V-00120',
            date: '2023-03-12',
            department: 'Livelihoods',
            description: 'Agricultural Tools',
            amount: 190000,
            status: 'approved'
        }
    ]);

    const handleCreateVoucher = () => {
        if (!formData.date || !formData.department || !formData.description || !formData.amount) {
            alert('Please fill in all required fields');
            return;
        }

        // Generate next voucher number
        const voucherNumbers = vouchers.map(v => parseInt(v.id.split('-')[1]));
        const nextNumber = Math.max(...voucherNumbers) + 1;
        const newVoucherId = `V-${String(nextNumber).padStart(5, '0')}`;

        const newVoucher: Voucher = {
            id: newVoucherId,
            date: formData.date,
            department: formData.department,
            description: formData.description,
            amount: Number(formData.amount),
            status: formData.status
        };

        setVouchers([newVoucher, ...vouchers]);
        setShowModal(false);
        setFormData({
            date: '',
            department: '',
            description: '',
            amount: '',
            status: 'pending'
        });
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        if (format === 'pdf') {
            // Transform data for PDF export (amount must be string)
            const pdfData = vouchers.map(voucher => ({
                date: voucher.date,
                description: voucher.description,
                department: voucher.department,
                amount: voucher.amount.toString(),
                status: voucher.status
            }));
            exportToPDF(pdfData as any, 'Vouchers_Report');
        } else if (format === 'excel') {
            const exportData = vouchers.map(({ id, date, department, description, amount, status }) => ({
                'Voucher No.': id,
                Date: date,
                Department: department,
                Description: description,
                Amount: `KSh ${amount.toLocaleString()}`,
                Status: status.charAt(0).toUpperCase() + status.slice(1)
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

    const handleViewVoucher = (voucherId: string) => {
        alert(`View voucher ${voucherId} details`);
    };

    const handlePrintVoucher = (voucherId: string) => {
        alert(`Print voucher ${voucherId}`);
    };

    const filteredVouchers = vouchers.filter((voucher) => {
        const voucherDate = new Date(voucher.date);
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;

        return (
            (!filters.status || voucher.status === filters.status) &&
            (!filters.department || voucher.department === filters.department) &&
            (!startDate || voucherDate >= startDate) &&
            (!endDate || voucherDate <= endDate)
        );
    });

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
                            <option value="Health">Health</option>
                            <option value="Education">Education</option>
                            <option value="Social Services">Social Services</option>
                            <option value="Livelihoods">Livelihoods</option>
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
                        {filteredVouchers.map((voucher) => (
                            <tr key={voucher.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 font-mono font-medium">{voucher.id}</td>
                                <td className="py-3">{voucher.date}</td>
                                <td className="py-3">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                        {voucher.department}
                                    </span>
                                </td>
                                <td className="py-3">{voucher.description}</td>
                                <td className="py-3 font-mono font-medium">KSh {voucher.amount.toLocaleString()}</td>
                                <td className="py-3">{getStatusBadge(voucher.status)}</td>
                                <td className="py-3">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleViewVoucher(voucher.id)}
                                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                            title="View Voucher"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handlePrintVoucher(voucher.id)}
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

            {/* Create Voucher Modal */}
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
                                    <option value="Health">Health</option>
                                    <option value="Education">Education</option>
                                    <option value="Social Services">Social Services</option>
                                    <option value="Livelihoods">Livelihoods</option>
                                    <option value="Administration">Administration</option>
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
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as VoucherStatus }))}
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
                                onClick={handleCreateVoucher}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Create Voucher
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}