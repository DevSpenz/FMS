import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useDepartments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();

    const channel = supabase
      .channel('departments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'departments' }, () => {
        fetchDepartments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDepartments]);

  return { departments, loading, error, refresh: fetchDepartments };
}

export function useVouchers(filters?: { status?: string; department?: string; startDate?: string; endDate?: string }) {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('voucher_summary_view')
        .select('*')
        .order('date', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.department) {
        query = query.eq('department', filters.department);
      }
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVouchers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVouchers();

    const channel = supabase
      .channel('vouchers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vouchers' }, () => {
        fetchVouchers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchVouchers]);

  return { vouchers, loading, error, refresh: fetchVouchers };
}

export function useCashbook(filters?: { startDate?: string; endDate?: string }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('cashbook_view')
        .select('*')
        .order('date', { ascending: false });

      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();

    const channel = supabase
      .channel('journal-entries-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries' }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTransactions]);

  return { transactions, loading, error, refresh: fetchTransactions };
}

export function useLedger(accountCode?: string) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('ledger_view')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (accountCode) {
        query = query.eq('account_code', accountCode);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accountCode]);

  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel('ledger-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries' }, () => {
        fetchEntries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  return { entries, loading, error, refresh: fetchEntries };
}

export function useTrialBalance() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trial_balance_view')
        .select('*')
        .order('account_code');

      if (error) throw error;
      setAccounts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();

    const channel = supabase
      .channel('trial-balance-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries' }, () => {
        fetchAccounts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAccounts]);

  return { accounts, loading, error, refresh: fetchAccounts };
}

export function useBalanceSheet() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('balance_sheet_view')
        .select('*')
        .order('account_code');

      if (error) throw error;
      setData(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('balance-sheet-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

export function useIncomeStatement() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('income_statement_view')
        .select('*')
        .order('account_code');

      if (error) throw error;
      setData(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('income-statement-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

export function useFinancialSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_summary_view')
        .select('*')
        .single();

      if (error) throw error;
      setSummary(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();

    const channel = supabase
      .channel('financial-summary-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries' }, () => {
        fetchSummary();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vouchers' }, () => {
        fetchSummary();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSummary]);

  return { summary, loading, error, refresh: fetchSummary };
}

export function useDepartmentSpending() {
  const [spending, setSpending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpending = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('department_spending_view')
        .select('*')
        .order('department_name');

      if (error) throw error;
      setSpending(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpending();

    const channel = supabase
      .channel('department-spending-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vouchers' }, () => {
        fetchSpending();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSpending]);

  return { spending, loading, error, refresh: fetchSpending };
}

export function useChartOfAccounts(accountType?: string) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('chart_of_accounts')
        .select('*')
        .eq('is_active', true)
        .order('account_code');

      if (accountType) {
        query = query.eq('account_type', accountType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAccounts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accountType]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return { accounts, loading, error, refresh: fetchAccounts };
}

export async function createVoucher(
  departmentName: string,
  description: string,
  amount: number,
  type: 'income' | 'expense' | 'transfer',
  expenseAccountCode?: string,
  createdBy?: string
) {
  const { data, error } = await supabase.rpc('create_voucher_with_journal_entries', {
    p_department_name: departmentName,
    p_description: description,
    p_amount: amount,
    p_type: type,
    p_expense_account_code: expenseAccountCode,
    p_created_by: createdBy,
  });

  if (error) throw error;
  return data;
}

export async function approveVoucher(voucherId: string, approvedBy: string) {
  const { data, error } = await supabase.rpc('approve_voucher', {
    p_voucher_id: voucherId,
    p_approved_by: approvedBy,
  });

  if (error) throw error;
  return data;
}

export async function rejectVoucher(voucherId: string, rejectedBy: string) {
  const { data, error } = await supabase.rpc('reject_voucher', {
    p_voucher_id: voucherId,
    p_rejected_by: rejectedBy,
  });

  if (error) throw error;
  return data;
}
