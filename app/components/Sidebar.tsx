'use client';
import { LayoutDashboard, BookOpen, FileText, Receipt, Scale, Building, Users, Settings, HandHelping } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Main Navigation' },
        { id: 'cashbook', label: 'Cashbook', icon: BookOpen, section: 'Main Navigation' },
        { id: 'ledger', label: 'Ledger', icon: FileText, section: 'Main Navigation' },
        { id: 'vouchers', label: 'Vouchers', icon: Receipt, section: 'Main Navigation' },
        { id: 'trial-balance', label: 'Trial Balance', icon: Scale, section: 'Reports' },
        { id: 'balance-sheet', label: 'Balance Sheet', icon: FileText, section: 'Reports' },
        { id: 'reports', label: 'Fund Reports', icon: BookOpen, section: 'Reports' },
        { id: 'departments', label: 'Departments', icon: Building, section: 'Administration' },
        { id: 'users', label: 'Users', icon: Users, section: 'Administration' },
        { id: 'settings', label: 'Settings', icon: Settings, section: 'Administration' },
    ];

    const sections = navItems.reduce((acc, item) => {
        const section = item.section || 'Main Navigation';
        if (!acc[section]) acc[section] = [];
        acc[section].push(item);
        return acc;
    }, {} as Record<string, typeof navItems>);

    return (
        <div className="w-64 bg-slate-900 text-white h-full flex flex-col">
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                    <HandHelping className="h-8 w-8 text-blue-400" />
                    <h1 className="text-xl font-bold">NGO Funds</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {Object.entries(sections).map(([sectionName, items]) => (
                    <div key={sectionName}>
                        <div className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {sectionName}
                        </div>
                        <nav className="space-y-1">
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center px-6 py-3 text-sm transition-colors ${
                                        activeTab === item.id
                                            ? 'bg-slate-800 text-white border-l-2 border-blue-500'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="h-4 w-4 mr-3" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                ))}
            </div>
        </div>
    );
}