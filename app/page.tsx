'use client';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Cashbook from './components/Cashbook';
import Ledger from './components/Ledger';
import Vouchers from './components/Vouchers';
import TrialBalance from './components/TrialBalance';
import BalanceSheet from './components/BalanceSheet';
import Reports from './components/Reports';
import Departments from './components/Departments';
import Users from './components/Users';
import Settings from './components/Settings';
import { Transaction, Department } from './types';

export default function Home() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    const handleUpdate = () => {
        // This would refresh data from API in a real app
        console.log('Data update triggered');
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard transactions={transactions} departments={departments} />;
            case 'cashbook':
                return <Cashbook />;
            case 'ledger':
                return <Ledger />;
            case 'vouchers':
                return <Vouchers />;
            case 'trial-balance':
                return <TrialBalance />;
            case 'balance-sheet':
                return <BalanceSheet />;
            case 'reports':
                return <Reports />;
            case 'departments':
                return <Departments departments={departments} onUpdate={handleUpdate} />;
            case 'users':
                return <Users users={[]} onUpdate={handleUpdate} />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard transactions={transactions} departments={departments} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 overflow-auto">
                {renderActiveTab()}
            </main>
        </div>
    );
}