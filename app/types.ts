export interface Transaction {
    _id: string;
    date: string;
    voucherNumber: string;
    description: string;
    department: string;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdBy: string;
}

export interface Department {
    _id: string;
    name: string;
    head: string;
    budget: number;
    description: string;
    memberCount: number;
    status: 'active' | 'inactive';
}

export interface User {
    _id: string;
    name: string;
    email: string;
    department: string;
    role: 'admin' | 'department_head' | 'user';
    lastLogin: string;
    status: 'active' | 'inactive';
}