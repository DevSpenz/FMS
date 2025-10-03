import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          name: string;
          head: string;
          budget: number;
          description: string | null;
          member_count: number;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['departments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['departments']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          department_id: string | null;
          role: 'admin' | 'department_head' | 'user';
          last_login: string | null;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      vouchers: {
        Row: {
          id: string;
          voucher_number: string;
          date: string;
          department_id: string | null;
          description: string;
          amount: number;
          type: 'income' | 'expense' | 'transfer';
          status: 'pending' | 'approved' | 'rejected';
          created_by: string | null;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vouchers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['vouchers']['Insert']>;
      };
      chart_of_accounts: {
        Row: {
          id: string;
          account_code: string;
          account_name: string;
          account_type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
          parent_account_id: string | null;
          is_active: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          voucher_id: string;
          account_id: string;
          debit: number;
          credit: number;
          description: string | null;
          entry_date: string;
          created_at: string;
        };
      };
    };
    Views: {
      trial_balance_view: {
        Row: {
          account_id: string;
          account_code: string;
          account_name: string;
          account_type: string;
          total_debit: number;
          total_credit: number;
          balance: number;
        };
      };
      balance_sheet_view: {
        Row: {
          category: string;
          account_code: string;
          account_name: string;
          amount: number;
        };
      };
      income_statement_view: {
        Row: {
          category: string;
          account_code: string;
          account_name: string;
          amount: number;
        };
      };
      cashbook_view: {
        Row: {
          voucher_number: string;
          date: string;
          description: string;
          department: string | null;
          type: string;
          cash_in: number;
          cash_out: number;
          status: string;
          created_at: string;
        };
      };
      ledger_view: {
        Row: {
          account_code: string;
          account_name: string;
          account_type: string;
          voucher_number: string;
          transaction_date: string;
          description: string;
          department: string | null;
          debit: number;
          credit: number;
          status: string;
          created_at: string;
        };
      };
      department_spending_view: {
        Row: {
          department_id: string;
          department_name: string;
          budget: number;
          spent: number;
          remaining: number;
          utilization_percentage: number;
          transaction_count: number;
        };
      };
      voucher_summary_view: {
        Row: {
          id: string;
          voucher_number: string;
          date: string;
          description: string;
          department: string | null;
          amount: number;
          type: string;
          status: string;
          created_by_name: string | null;
          approved_by_name: string | null;
          approved_at: string | null;
          created_at: string;
          journal_entries: Array<{
            account_code: string;
            account_name: string;
            debit: number;
            credit: number;
          }>;
        };
      };
      financial_summary_view: {
        Row: {
          total_assets: number;
          total_liabilities: number;
          total_equity: number;
          total_revenue: number;
          total_expenses: number;
          net_income: number;
          cash_disbursed: number;
          cash_received: number;
          pending_vouchers: number;
        };
      };
    };
    Functions: {
      create_voucher_with_journal_entries: {
        Args: {
          p_department_name: string;
          p_description: string;
          p_amount: number;
          p_type: 'income' | 'expense' | 'transfer';
          p_expense_account_code?: string;
          p_created_by?: string;
        };
        Returns: Array<{
          voucher_id: string;
          voucher_number: string;
          department_name: string;
          amount: number;
          status: string;
          message: string;
        }>;
      };
      approve_voucher: {
        Args: {
          p_voucher_id: string;
          p_approved_by: string;
        };
        Returns: boolean;
      };
      reject_voucher: {
        Args: {
          p_voucher_id: string;
          p_rejected_by: string;
        };
        Returns: boolean;
      };
    };
  };
};
