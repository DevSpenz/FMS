'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { User } from '../types';

interface UsersProps {
    users: User[];
    onUpdate: () => void;
}

export default function Users({ users, onUpdate }: UsersProps) {
    const [showAddModal, setShowAddModal] = useState(false);

    const sampleUsers: User[] = [
        {
            _id: '1',
            name: 'John Maina',
            email: 'john.maina@ngo.org',
            department: 'Administration',
            role: 'admin',
            lastLogin: '2023-03-15T09:45:00Z',
            status: 'active'
        },
        {
            _id: '2',
            name: 'Dr. Jane Mwangi',
            email: 'jane.mwangi@ngo.org',
            department: 'Health',
            role: 'department_head',
            lastLogin: '2023-03-14T14:20:00Z',
            status: 'active'
        },
        {
            _id: '3',
            name: 'Mr. Peter Omondi',
            email: 'peter.omondi@ngo.org',
            department: 'Education',
            role: 'department_head',
            lastLogin: '2023-03-14T11:05:00Z',
            status: 'active'
        },
        {
            _id: '4',
            name: 'Ms. Grace Wanjiku',
            email: 'grace.wanjiku@ngo.org',
            department: 'Social Services',
            role: 'department_head',
            lastLogin: '2023-03-13T16:40:00Z',
            status: 'active'
        },
        {
            _id: '5',
            name: 'Mr. Joseph Kamau',
            email: 'joseph.kamau@ngo.org',
            department: 'Livelihoods',
            role: 'department_head',
            lastLogin: '2023-03-12T10:15:00Z',
            status: 'active'
        },
        {
            _id: '6',
            name: 'Ms. Susan Akinyi',
            email: 'susan.akinyi@ngo.org',
            department: 'Administration',
            role: 'user',
            lastLogin: '2023-03-10T08:30:00Z',
            status: 'inactive'
        }
    ];

    const displayUsers = users.length > 0 ? users : sampleUsers;

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

    const getRoleBadge = (role: string) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-800',
            department_head: 'bg-blue-100 text-blue-800',
            user: 'bg-gray-100 text-gray-800'
        };

        const roleLabels = {
            admin: 'Admin',
            department_head: 'Dept Head',
            user: 'User'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role as keyof typeof styles]}`}>
        {roleLabels[role as keyof typeof roleLabels]}
      </span>
        );
    };

    const formatLastLogin = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            alert(`User ${id} would be deleted`);
            onUpdate();
        }
    };

    const handleEdit = (user: User) => {
        alert(`Edit user: ${user.name}`);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Users</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 font-medium text-gray-600">Name</th>
                            <th className="text-left py-3 font-medium text-gray-600">Email</th>
                            <th className="text-left py-3 font-medium text-gray-600">Department</th>
                            <th className="text-left py-3 font-medium text-gray-600">Role</th>
                            <th className="text-left py-3 font-medium text-gray-600">Last Login</th>
                            <th className="text-left py-3 font-medium text-gray-600">Status</th>
                            <th className="text-left py-3 font-medium text-gray-600">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayUsers.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 font-medium text-gray-900">{user.name}</td>
                                <td className="py-3 text-gray-600">{user.email}</td>
                                <td className="py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {user.department}
                    </span>
                                </td>
                                <td className="py-3">{getRoleBadge(user.role)}</td>
                                <td className="py-3 text-sm text-gray-500">{formatLastLogin(user.lastLogin)}</td>
                                <td className="py-3">{getStatusBadge(user.status)}</td>
                                <td className="py-3">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                            title="Edit User"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                            title="Delete User"
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
                        <div className="text-2xl font-bold text-blue-600">{displayUsers.length}</div>
                        <div className="text-sm text-blue-800">Total Users</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {displayUsers.filter(u => u.status === 'active').length}
                        </div>
                        <div className="text-sm text-green-800">Active Users</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {displayUsers.filter(u => u.role === 'admin').length}
                        </div>
                        <div className="text-sm text-purple-800">Administrators</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                            {displayUsers.filter(u => u.role === 'department_head').length}
                        </div>
                        <div className="text-sm text-orange-800">Department Heads</div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Add User</h3>
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
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter email address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Select Department</option>
                                        <option value="Administration">Administration</option>
                                        <option value="Health">Health</option>
                                        <option value="Education">Education</option>
                                        <option value="Social Services">Social Services</option>
                                        <option value="Livelihoods">Livelihoods</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="user">User</option>
                                        <option value="department_head">Department Head</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter temporary password"
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
                                    alert('User would be added');
                                    setShowAddModal(false);
                                    onUpdate();
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Add User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}