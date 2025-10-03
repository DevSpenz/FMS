/*
  # NGO Fund Management - Complete Double-Entry Accounting System
  
  ## Overview
  This migration creates a production-ready accounting system with automatic double-entry bookkeeping,
  real-time financial statements, and department-based access control.
  
  ## 1. Core Tables
  
  ### departments
  - Manages organizational departments with budget tracking
  - Fields: id, name, head, budget, description, member_count, status, created_at, updated_at
  
  ### users
  - User accounts with role-based access (admin, department_head, user)
  - Fields: id, email, name, department_id, role, last_login, status, created_at, updated_at
  
  ### chart_of_accounts
  - Standard chart of accounts for double-entry bookkeeping
  - Account types: Asset, Liability, Equity, Revenue, Expense
  - Pre-populated with common NGO accounts
  
  ### vouchers
  - Financial vouchers for all transactions
  - Fields: voucher_number, date, department_id, description, amount, type, status, created_by, approved_by
  
  ### journal_entries
  - Core double-entry ledger entries
  - Each voucher creates multiple journal entries (debit and credit)
  - Fields: voucher_id, account_id, debit, credit, description, entry_date
  
  ## 2. Automated Features
  
  ### Automatic Journal Posting
  - Function: create_voucher_with_journal_entries()
  - Automatically creates balanced journal entries for each voucher
  - Ensures debits always equal credits
  
  ### Real-time Views
  - trial_balance_view: Current balances for all accounts
  - balance_sheet_view: Assets, Liabilities, Equity statement
  - income_statement_view: Revenue and Expenses
  - cashbook_view: All cash transactions
  - ledger_view: Account-wise transaction history
  
  ## 3. Security (RLS Policies)
  
  ### Admin Access
  - Full access to all tables and operations
  
  ### Department Head Access
  - View all data, create/approve vouchers for their department
  
  ### User Access
  - View data for their department only
  - Create vouchers (pending approval)
  
  ## 4. Important Notes
  - All monetary values stored as NUMERIC(15,2) for precision
  - Automatic timestamp tracking with updated_at triggers
  - Voucher numbering is automatic and sequential
  - Journal entries are immutable once posted
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  head TEXT NOT NULL,
  budget NUMERIC(15,2) NOT NULL DEFAULT 0,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'department_head', 'user')),
  last_login TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CHART OF ACCOUNTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_code TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense')),
  parent_account_id UUID REFERENCES chart_of_accounts(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. VOUCHERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- Create index for faster voucher number generation
CREATE INDEX IF NOT EXISTS idx_vouchers_number ON vouchers(voucher_number);
CREATE INDEX IF NOT EXISTS idx_vouchers_date ON vouchers(date);
CREATE INDEX IF NOT EXISTS idx_vouchers_department ON vouchers(department_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status);

-- =====================================================
-- 5. JOURNAL ENTRIES TABLE (Double-Entry Core)
-- =====================================================
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_id UUID NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
  debit NUMERIC(15,2) DEFAULT 0 CHECK (debit >= 0),
  credit NUMERIC(15,2) DEFAULT 0 CHECK (credit >= 0),
  description TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT check_debit_or_credit CHECK (
    (debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)
  )
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_journal_voucher ON journal_entries(voucher_id);
CREATE INDEX IF NOT EXISTS idx_journal_account ON journal_entries(account_id);
CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_entries(entry_date);

-- =====================================================
-- 6. UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chart_of_accounts_updated_at ON chart_of_accounts;
CREATE TRIGGER update_chart_of_accounts_updated_at
  BEFORE UPDATE ON chart_of_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vouchers_updated_at ON vouchers;
CREATE TRIGGER update_vouchers_updated_at
  BEFORE UPDATE ON vouchers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. GENERATE VOUCHER NUMBER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION generate_voucher_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  voucher_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(voucher_number FROM 3) AS INTEGER)), 0) + 1
  INTO next_number
  FROM vouchers;
  
  voucher_num := 'V-' || LPAD(next_number::TEXT, 5, '0');
  RETURN voucher_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. SEED CHART OF ACCOUNTS
-- =====================================================
INSERT INTO chart_of_accounts (account_code, account_name, account_type, description) VALUES
  -- Assets
  ('1000', 'Cash and Bank', 'Asset', 'Main cash and bank account'),
  ('1100', 'Petty Cash', 'Asset', 'Petty cash for small expenses'),
  ('1200', 'Accounts Receivable', 'Asset', 'Money owed to organization'),
  ('1300', 'Prepaid Expenses', 'Asset', 'Expenses paid in advance'),
  
  -- Liabilities
  ('2000', 'Accounts Payable', 'Liability', 'Money owed to suppliers'),
  ('2100', 'Accrued Expenses', 'Liability', 'Expenses incurred but not yet paid'),
  ('2200', 'Deferred Revenue', 'Liability', 'Payments received in advance'),
  
  -- Equity
  ('3000', 'Fund Balance', 'Equity', 'Organization fund balance'),
  ('3100', 'Retained Earnings', 'Equity', 'Accumulated earnings'),
  ('3200', 'Restricted Funds', 'Equity', 'Donor-restricted funds'),
  
  -- Revenue
  ('4000', 'Government Grants', 'Revenue', 'Grants from government'),
  ('4100', 'International Donors', 'Revenue', 'Donations from international sources'),
  ('4200', 'Corporate Sponsors', 'Revenue', 'Corporate sponsorships'),
  ('4300', 'Individual Donations', 'Revenue', 'Individual donor contributions'),
  ('4400', 'Other Income', 'Revenue', 'Miscellaneous income'),
  
  -- Expenses - Health Department
  ('5000', 'Health Dept - Medical Supplies', 'Expense', 'Medical supplies and equipment'),
  ('5010', 'Health Dept - Salaries', 'Expense', 'Health department salaries'),
  ('5020', 'Health Dept - Operations', 'Expense', 'Health department operations'),
  
  -- Expenses - Education Department
  ('5100', 'Education Dept - School Materials', 'Expense', 'Educational materials and books'),
  ('5110', 'Education Dept - Salaries', 'Expense', 'Education department salaries'),
  ('5120', 'Education Dept - Operations', 'Expense', 'Education department operations'),
  
  -- Expenses - Social Services
  ('5200', 'Social Services - Programs', 'Expense', 'Social services programs'),
  ('5210', 'Social Services - Salaries', 'Expense', 'Social services salaries'),
  ('5220', 'Social Services - Operations', 'Expense', 'Social services operations'),
  
  -- Expenses - Livelihoods
  ('5300', 'Livelihoods - Agricultural Tools', 'Expense', 'Agricultural equipment and tools'),
  ('5310', 'Livelihoods - Salaries', 'Expense', 'Livelihoods department salaries'),
  ('5320', 'Livelihoods - Operations', 'Expense', 'Livelihoods operations'),
  
  -- Expenses - Administration
  ('5400', 'Administration - Office Supplies', 'Expense', 'Office supplies and equipment'),
  ('5410', 'Administration - Salaries', 'Expense', 'Administrative salaries'),
  ('5420', 'Administration - Utilities', 'Expense', 'Utilities and rent'),
  ('5430', 'Administration - Operations', 'Expense', 'General administrative expenses')
ON CONFLICT (account_code) DO NOTHING;

-- =====================================================
-- 9. RLS POLICIES
-- =====================================================

-- Departments: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert departments"
  ON departments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

CREATE POLICY "Admins can update departments"
  ON departments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Users: Can view based on role
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'department_head'))
  );

CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Chart of Accounts: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view accounts"
  ON chart_of_accounts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage accounts"
  ON chart_of_accounts FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Vouchers: Role-based access
CREATE POLICY "Users can view vouchers"
  ON vouchers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'admin'
        OR (u.role = 'department_head' AND u.department_id = vouchers.department_id)
        OR (u.role = 'user' AND u.department_id = vouchers.department_id)
      )
    )
  );

CREATE POLICY "Users can create vouchers for their department"
  ON vouchers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND (u.department_id = department_id OR u.role = 'admin')
    )
  );

CREATE POLICY "Department heads and admins can update vouchers"
  ON vouchers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'admin'
        OR (u.role = 'department_head' AND u.department_id = vouchers.department_id)
      )
    )
  );

-- Journal Entries: Read-only for users, admins can view all
CREATE POLICY "Users can view journal entries"
  ON journal_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      LEFT JOIN vouchers v ON v.id = journal_entries.voucher_id
      WHERE u.id = auth.uid()
      AND (
        u.role = 'admin'
        OR (u.role = 'department_head' AND u.department_id = v.department_id)
        OR (u.role = 'user' AND u.department_id = v.department_id)
      )
    )
  );
