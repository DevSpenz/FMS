'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Department } from '../types';

interface DepartmentsProps {
    departments: Department[];
    onUpdate: () => void;
}

export default function Departments({ departments, onUpdate }: DepartmentsProps) {
    const [showAddModal, setShowAddModal] = useState(false);

    const sampleDepartments: Department[] = [
        {
            _id: '1',
            name: 'Health',
            head: 'Dr. Jane Mwangi',
            budget: 1200000,
            description: 'Healthcare services and medical support programs',
            memberCount: 8,
            status: 'active'
        },
        {
            _id: '2',
            name: 'Education',
            head: 'Mr. Peter Omondi',
            budget: 900000,
            description: 'Educational programs and school support initiatives',
            memberCount: 6,
            status: 'active'
        },
        {
            _id: '3',
            name: 'Social Services',
            head: 'Ms. Grace Wanjiku',
            budget: 800000,
            description: 'Community outreach and social support services',
            memberCount: 5,
            status: 'active'
        },
        {
            _id: '4',
            name: 'Livelihoods',
            head: 'Mr. Joseph Kamau',
            budget: 700000,
            description: 'Agricultural and income-generating projects',
            memberCount: 7,
            status: 'active'
        },
        {
            _id: '5',
            name: 'Administration',
            head: 'Ms. Susan Akinyi',
            budget: 400000,
            description: 'Administrative and operational support',
            memberCount: 4,
            status: 'active'
        }
    ];

    const displayDepartments = departments.length > 0 ? departments : sampleDepartments;

    const getStatusBadge = (status: string) => {
        return status === 'active' ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        Active
      </span>
        ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
        Inactive
      </span>
        );
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this department?')) {
            alert(`Department ${id} would be deleted`);
            onUpdate();
        }
    };

    const handleEdit = (department: Department) => {
        alert(`Edit department: ${department.name}`);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium text-gray-600">Department Name</th>
                            <th className="text-left py-3 font-medium text-gray-600">Head of Department</th>
                            <th className="text-left py-3 font-medium text-gray-600">Budget Allocated</th>
                            <th className="text-left py-3 font-medium text-gray-600">Members</th>
                            <th className="text-left py-3 font-medium text-gray-600">Status</th>
                            <th className="text-left py-3 font-medium text-gray-600">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayDepartments.map((dept) => (
                            <tr key={dept._id} className="border-b hover:bg-gray-50">
                                <td className="py-3">
                                    <div>
                                        <div className="font-medium text-gray-900">{dept.name}</div>
                                        <div className="text-sm text-gray-500">{dept.description}</div>
                                    </div>
                                </td>
                                <td className="py-3">{dept.head}</td>
                                <td className="py-3 font-mono font-medium">KSh {dept.budget.toLocaleString()}</td>
                                <td className="py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {dept.memberCount} members
                    </span>
                                </td>
                                <td className="py-3">{getStatusBadge(dept.status)}</td>
                                <td className="py-3">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(dept)}
                                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                            title="Edit Department"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dept._id)}
                                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                            title="Delete Department"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{displayDepartments.length}</div>
                        <div className="text-sm text-blue-800">Total Departments</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {displayDepartments.filter(d => d.status === 'active').length}
                        </div>
                        <div className="text-sm text-green-800">Active Departments</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {displayDepartments.reduce((sum, dept) => sum + dept.memberCount, 0)}
                        </div>
                        <div className="text-sm text-purple-800">Total Members</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                            KSh {displayDepartments.reduce((sum, dept) => sum + dept.budget, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-orange-800">Total Budget</div>
                    </div>
                </div>
            </div>

            {/* Add Department Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Add Department</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6">
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter department name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Head of Department
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter head of department"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Initial Budget (KSh)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter budget amount"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter department description"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="flex justify-end space-x-3 p-6 border-t">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert('Department would be added');
                                    setShowAddModal(false);
                                    onUpdate();
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Add Department
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}