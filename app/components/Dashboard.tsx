'use client';
import { useState } from 'react';
import { DollarSign, TrendingUp, Clock, AlertTriangle, FileText, Download } from 'lucide-react';
import { Transaction, Department } from '../types';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';
import PdfTransactionTable from './PdfTransactionTable';

interface DashboardProps {
    transactions: Transaction[];
    departments: Department[];
}

export default function Dashboard({ transactions, departments }: DashboardProps) {
    const totalFunds = 12450000;
    const utilizedFunds = 8760000;
    const pendingDisbursements = 1240000;

    const metrics = [
        {
            title: 'Total Funds',
            value: `KSh ${totalFunds.toLocaleString()}`,
            change: '+2.5% from last month',
            icon: DollarSign,
            color: 'blue'
        },
        {
            title: 'Utilized Funds',
            value: `KSh ${utilizedFunds.toLocaleString()}`,
            change: '70.3% utilization rate',
            icon: TrendingUp,
            color: 'green'
        },
        {
            title: 'Pending Disbursements',
            value: `KSh ${pendingDisbursements.toLocaleString()}`,
            change: '12 pending requests',
            icon: Clock,
            color: 'yellow'
        },
        {
            title: 'Overdue Reports',
            value: '3',
            change: 'Require immediate attention',
            icon: AlertTriangle,
            color: 'red'
        }
    ];

    const recentTransactions = [
        {
            date: '15/03/2023',
            description: 'Medical Supplies - Health Dept',
            department: 'Health',
            amount: 'KSh 450,000',
            status: 'Completed'
        },
        {
            date: '14/03/2023',
            description: 'School Materials - Education Dept',
            department: 'Education',
            amount: 'KSh 320,000',
            status: 'Completed'
        },
        {
            date: '13/03/2023',
            description: 'Community Outreach - Social Services',
            department: 'Social Services',
            amount: 'KSh 280,000',
            status: 'Pending'
        },
        {
            date: '12/03/2023',
            description: 'Agricultural Tools - Livelihoods',
            department: 'Livelihoods',
            amount: 'KSh 190,000',
            status: 'Completed'
        },
        {
            date: '10/03/2023',
            description: 'Office Supplies - Administration',
            department: 'Administration',
            amount: 'KSh 75,000',
            status: 'Completed'
        }
    ];

    // Chart data
    const departmentSpending = [
        { department: 'Health', spent: 950000, budget: 1200000 },
        { department: 'Education', spent: 720000, budget: 900000 },
        { department: 'Social Services', spent: 650000, budget: 800000 },
        { department: 'Livelihoods', spent: 520000, budget: 700000 },
        { department: 'Administration', spent: 320000, budget: 400000 }
    ];

    const fundSources = [
        { source: 'Government Grants', amount: 5600000, percentage: 45 },
        { source: 'International Donors', amount: 3740000, percentage: 30 },
        { source: 'Corporate Sponsors', amount: 1870000, percentage: 15 },
        { source: 'Individual Donations', amount: 998000, percentage: 8 },
        { source: 'Other', amount: 250000, percentage: 2 }
    ];

    // Handle PDF Export for transactions only
    const handleExportPDF = () => {
        const pdfData = recentTransactions.map(tx => ({
            date: new Date(tx.date).toLocaleDateString(),
            description: tx.description,
            department: tx.department,
            amount: `KSh ${tx.amount.toLocaleString()}`,
            status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
        }));

        exportToPDF(pdfData, 'ngo_recent_transactions', 'Recent Transactions Report');
    };

    // Handle Excel Export for transactions only
    const handleExportExcel = () => {
        const excelData = recentTransactions.map(tx => ({
            'Date': tx.date,
            'Description': tx.description,
            'Department': tx.department,
            'Amount': tx.amount.replace('KSh ', ''),
            'Status': tx.status
        }));

        exportToExcel(excelData, 'ngo_recent_transactions', 'Recent Transactions');
    };

    // Handle CSV Export for transactions only
    const handleExportCSV = () => {
        const csvData = recentTransactions.map(tx => ({
            'Date': tx.date,
            'Description': tx.description,
            'Department': tx.department,
            'Amount': tx.amount.replace('KSh ', ''),
            'Status': tx.status
        }));

        exportToCSV(csvData, 'ngo_recent_transactions', 'Recent Transactions');
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        className={`bg-white rounded-xl shadow-sm border-l-4 ${
                            metric.color === 'blue' ? 'border-blue-500' :
                                metric.color === 'green' ? 'border-green-500' :
                                    metric.color === 'yellow' ? 'border-yellow-500' : 'border-red-500'
                        } p-6 transition-transform hover:scale-105`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
                            </div>
                            <div className={`p-2 rounded-lg ${
                                metric.color === 'blue' ? 'bg-blue-50' :
                                    metric.color === 'green' ? 'bg-green-50' :
                                        metric.color === 'yellow' ? 'bg-yellow-50' : 'bg-red-50'
                            }`}>
                                <metric.icon className={`h-5 w-5 ${
                                    metric.color === 'blue' ? 'text-blue-500' :
                                        metric.color === 'green' ? 'text-green-500' :
                                            metric.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                                }`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Department Spending Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Department Spending vs Budget</h5>
                    <div className="space-y-4">
                        {departmentSpending.map((dept, index) => {
                            const utilization = (dept.spent / dept.budget) * 100;
                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">{dept.department}</span>
                                        <span className="text-gray-600">
                      KSh {dept.spent.toLocaleString()} / KSh {dept.budget.toLocaleString()}
                    </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${
                                                utilization >= 90 ? 'bg-red-500' :
                                                    utilization >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${Math.min(utilization, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Utilization: {utilization.toFixed(1)}%</span>
                                        <span>Balance: KSh {(dept.budget - dept.spent).toLocaleString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Funding Sources Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Funding Sources</h5>
                    <div className="space-y-3">
                        {fundSources.map((source, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                index === 0 ? '#3B82F6' :
                                                    index === 1 ? '#10B981' :
                                                        index === 2 ? '#8B5CF6' :
                                                            index === 3 ? '#F59E0B' : '#6B7280'
                                        }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-700 flex-1">
                    {source.source}
                  </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-gray-900">
                                        KSh {source.amount.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500">{source.percentage}%</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total Funding</span>
                            <span className="text-lg font-bold text-gray-900">
                KSh {fundSources.reduce((sum, source) => sum + source.amount, 0).toLocaleString()}
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Card with Export Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-900">Recent Transactions</h5>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleExportPDF}
                            className="px-3 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center text-sm"
                        >
                            <FileText className="h-4 w-4 mr-1" />
                            PDF
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="px-3 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors flex items-center text-sm"
                        >
                            <Download className="h-4 w-4 mr-1" />
                            Excel
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="px-3 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors flex items-center text-sm"
                        >
                            <Download className="h-4 w-4 mr-1" />
                            CSV
                        </button>
                    </div>
                </div>

                {/* Regular table for screen display */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium text-gray-600">Date</th>
                            <th className="text-left py-3 font-medium text-gray-600">Description</th>
                            <th className="text-left py-3 font-medium text-gray-600">Department</th>
                            <th className="text-left py-3 font-medium text-gray-600">Amount</th>
                            <th className="text-left py-3 font-medium text-gray-600">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentTransactions.map((transaction, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="py-3">{transaction.date}</td>
                                <td className="py-3">{transaction.description}</td>
                                <td className="py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {transaction.department}
                    </span>
                                </td>
                                <td className="py-3 font-mono">{transaction.amount}</td>
                                <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}