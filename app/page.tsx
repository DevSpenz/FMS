'use client';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CashbookIntegrated from './components/CashbookIntegrated';
import LedgerIntegrated from './components/LedgerIntegrated';
import VouchersIntegrated from './components/VouchersIntegrated';
import TrialBalanceIntegrated from './components/TrialBalanceIntegrated';
import BalanceSheetIntegrated from './components/BalanceSheetIntegrated';
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
                return <Dashboard />;
            case 'cashbook':
                return <CashbookIntegrated />;
            case 'ledger':
                return <LedgerIntegrated />;
            case 'vouchers':
                return <VouchersIntegrated />;
            case 'trial-balance':
                return <TrialBalanceIntegrated />;
            case 'balance-sheet':
                return <BalanceSheetIntegrated />;
            case 'reports':
                return <Reports />;
            case 'departments':
                return <Departments departments={departments} onUpdate={handleUpdate} />;
            case 'users':
                return <Users users={[]} onUpdate={handleUpdate} />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
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