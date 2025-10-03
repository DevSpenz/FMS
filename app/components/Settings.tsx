'use client';
import { useState } from 'react';
import { Save, Database, Download, Trash2, Bell, Shield, Globe } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        organizationName: 'Kenya Community NGO',
        currency: 'KES',
        fiscalYearStart: '2024-01-01',
        approvalLimit: 50000,
        country: 'Kenya',
        timezone: 'Africa/Nairobi',
        dateFormat: 'DD/MM/YYYY'
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        lowBalanceAlert: true,
        pendingApprovalAlert: true,
        reportDueAlert: false,
        monthlySummary: true,
        transactionAlerts: true
    });

    const [security, setSecurity] = useState({
        sessionTimeout: 30,
        passwordExpiry: 90,
        twoFactorAuth: false,
        loginAttempts: 5
    });

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Settings saved successfully!');
    };

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSecurityChange = (key: keyof typeof security, value: any) => {
        setSecurity(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleDataAction = (action: string) => {
        if (confirm(`Are you sure you want to ${action}?`)) {
            alert(`${action} functionality would be implemented`);
        }
    };

    const currencies = [
        { code: 'KES', name: 'Kenyan Shilling (KSh)', symbol: 'KSh' },
        { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
        { code: 'EUR', name: 'Euro (€)', symbol: '€' },
        { code: 'GBP', name: 'British Pound (£)', symbol: '£' }
    ];

    const countries = [
        'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'South Africa', 'Nigeria'
    ];

    const timezones = [
        'Africa/Nairobi', 'Africa/Dar_es_Salaam', 'Africa/Kampala', 'Africa/Kigali',
        'Africa/Addis_Ababa', 'Africa/Johannesburg', 'Africa/Lagos'
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            </div>

            <div className="space-y-6">
                {/* Organization Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <Globe className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Organization Settings</h3>
                    </div>
                    <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Organization Name
                            </label>
                            <input
                                type="text"
                                value={settings.organizationName}
                                onChange={(e) => setSettings(prev => ({ ...prev, organizationName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Currency
                            </label>
                            <select
                                value={settings.currency}
                                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {currencies.map(currency => (
                                    <option key={currency.code} value={currency.code}>
                                        {currency.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fiscal Year Start
                            </label>
                            <input
                                type="date"
                                value={settings.fiscalYearStart}
                                onChange={(e) => setSettings(prev => ({ ...prev, fiscalYearStart: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Approval Limit ({currencies.find(c => c.code === settings.currency)?.symbol})
                            </label>
                            <input
                                type="number"
                                value={settings.approvalLimit}
                                onChange={(e) => setSettings(prev => ({ ...prev, approvalLimit: Number(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <select
                                value={settings.country}
                                onChange={(e) => setSettings(prev => ({ ...prev, country: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Timezone
                            </label>
                            <select
                                value={settings.timezone}
                                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {timezones.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Organization Settings
                            </button>
                        </div>
                    </form>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <Bell className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        {key.split(/(?=[A-Z])/).map(word =>
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {key.includes('email') ? 'Receive email notifications' :
                                            key.includes('balance') ? 'Alert when funds are low' :
                                                key.includes('approval') ? 'Notify of pending approvals' :
                                                    key.includes('report') ? 'Remind before report deadlines' :
                                                        key.includes('monthly') ? 'Send monthly summary reports' :
                                                            'Alert for new transactions'}
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handleNotificationChange(key as keyof typeof notifications)}
                                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <Shield className="h-5 w-5 text-red-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Session Timeout (minutes)
                            </label>
                            <select
                                value={security.sessionTimeout}
                                onChange={(e) => handleSecurityChange('sessionTimeout', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={60}>60 minutes</option>
                                <option value={120}>2 hours</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password Expiry (days)
                            </label>
                            <select
                                value={security.passwordExpiry}
                                onChange={(e) => handleSecurityChange('passwordExpiry', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={30}>30 days</option>
                                <option value={60}>60 days</option>
                                <option value={90}>90 days</option>
                                <option value={180}>180 days</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Login Attempts
                            </label>
                            <select
                                value={security.loginAttempts}
                                onChange={(e) => handleSecurityChange('loginAttempts', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={3}>3 attempts</option>
                                <option value={5}>5 attempts</option>
                                <option value={10}>10 attempts</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Two-Factor Authentication
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    Extra security for user logins
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={security.twoFactorAuth}
                                onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <Database className="h-5 w-5 text-purple-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => handleDataAction('Backup Database')}
                            className="p-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex flex-col items-center justify-center"
                        >
                            <Download className="h-8 w-8 mb-2" />
                            <span className="font-medium">Backup Database</span>
                            <span className="text-xs text-gray-500 mt-1">Download all data</span>
                        </button>

                        <button
                            onClick={() => handleDataAction('Restore Database')}
                            className="p-4 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-50 transition-colors flex flex-col items-center justify-center"
                        >
                            <Database className="h-8 w-8 mb-2" />
                            <span className="font-medium">Restore Database</span>
                            <span className="text-xs text-gray-500 mt-1">Upload backup file</span>
                        </button>

                        <button
                            onClick={() => handleDataAction('Clear Test Data')}
                            className="p-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex flex-col items-center justify-center"
                        >
                            <Trash2 className="h-8 w-8 mb-2" />
                            <span className="font-medium">Clear Test Data</span>
                            <span className="text-xs text-gray-500 mt-1">Remove sample data</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}