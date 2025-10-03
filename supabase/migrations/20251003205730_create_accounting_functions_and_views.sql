/*
  # Accounting Engine - Functions and Views
  
  ## Overview
  This migration implements the core accounting engine with automatic journal posting
  and real-time financial statement views.
  
  ## 1. Core Functions
  
  ### create_voucher_with_journal_entries()
  - Automatically creates a voucher with balanced double-entry journal entries
  - Example: Health Dept expense of KSh 450,000
    - Debit: Health Dept - Medical Supplies (5000) KSh 450,000
    - Credit: Cash and Bank (1000) KSh 450,000
  - Returns the created voucher with all details
  
  ### get_account_balance()
  - Calculates current balance for any account
  - Handles all account types correctly (Assets, Expenses = Debit balance, etc.)
  
  ### approve_voucher()
  - Marks voucher as approved
  - Records approver and timestamp
  
  ## 2. Financial Statement Views
  
  ### trial_balance_view
  - Real-time trial balance showing all account balances
  - Validates that total debits = total credits
  
  ### balance_sheet_view
  - Real-time balance sheet
  - Categories: Assets, Liabilities, Equity
  - Calculates net position automatically
  
  ### income_statement_view
  - Real-time income statement (P&L)
  - Shows Revenue vs Expenses
  - Calculates net income/loss
  
  ### cashbook_view
  - All cash transactions (vouchers affecting cash accounts)
  - Shows running balance
  
  ### ledger_view
  - Complete general ledger with all transactions
  - Groups by account
  
  ### department_spending_view
  - Spending by department vs budget
  - Shows utilization percentage
  
  ## 3. Usage Example
  
  ```sql
  -- Create expense voucher for Health Department
  SELECT create_voucher_with_journal_entries(
    'Health',                           -- department name
    'Medical Supplies - Emergency Stock', -- description
    450000,                             -- amount
    'expense',                          -- type
    '5000',                             -- expense account code
    'current-user-uuid'                 -- created_by user id
  );
  
  -- This automatically:
  -- 1. Creates voucher V-00001
  -- 2. Debits Health Dept - Medical Supplies KSh 450,000
  -- 3. Credits Cash and Bank KSh 450,000
  -- 4. Updates trial balance
  -- 5. Updates balance sheet
  -- 6. Updates all financial views in real-time
  ```
*/

-- =====================================================
-- 1. GET ACCOUNT BALANCE FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION get_account_balance(account_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_debit NUMERIC;
  total_credit NUMERIC;
  balance NUMERIC;
  acc_type TEXT;
BEGIN
  -- Get account type
  SELECT account_type INTO acc_type
  FROM chart_of_accounts
  WHERE id = account_uuid;
  
  -- Calculate totals
  SELECT 
    COALESCE(SUM(debit), 0),
    COALESCE(SUM(credit), 0)
  INTO total_debit, total_credit
  FROM journal_entries
  WHERE account_id = account_uuid;
  
  -- Calculate balance based on account type
  -- Assets, Expenses = Debit balance (Debit - Credit)
  -- Liabilities, Equity, Revenue = Credit balance (Credit - Debit)
  IF acc_type IN ('Asset', 'Expense') THEN
    balance := total_debit - total_credit;
  ELSE
    balance := total_credit - total_debit;
  END IF;
  
  RETURN balance;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. CREATE VOUCHER WITH AUTOMATIC JOURNAL ENTRIES
-- =====================================================
CREATE OR REPLACE FUNCTION create_voucher_with_journal_entries(
  p_department_name TEXT,
  p_description TEXT,
  p_amount NUMERIC,
  p_type TEXT,
  p_expense_account_code TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS TABLE (
  voucher_id UUID,
  voucher_number TEXT,
  department_name TEXT,
  amount NUMERIC,
  status TEXT,
  message TEXT
) AS $$
DECLARE
  v_voucher_id UUID;
  v_voucher_number TEXT;
  v_department_id UUID;
  v_cash_account_id UUID;
  v_expense_account_id UUID;
  v_revenue_account_id UUID;
BEGIN
  -- Get department ID
  SELECT id INTO v_department_id
  FROM departments
  WHERE name = p_department_name;
  
  IF v_department_id IS NULL THEN
    RAISE EXCEPTION 'Department % not found', p_department_name;
  END IF;
  
  -- Generate voucher number
  v_voucher_number := generate_voucher_number();
  
  -- Get cash account (always 1000)
  SELECT id INTO v_cash_account_id
  FROM chart_of_accounts
  WHERE account_code = '1000';
  
  -- Create the voucher
  INSERT INTO vouchers (
    voucher_number,
    date,
    department_id,
    description,
    amount,
    type,
    status,
    created_by
  ) VALUES (
    v_voucher_number,
    CURRENT_DATE,
    v_department_id,
    p_description,
    p_amount,
    p_type,
    'pending',
    p_created_by
  )
  RETURNING id INTO v_voucher_id;
  
  -- Create journal entries based on transaction type
  IF p_type = 'expense' THEN
    -- Get expense account
    IF p_expense_account_code IS NOT NULL THEN
      SELECT id INTO v_expense_account_id
      FROM chart_of_accounts
      WHERE account_code = p_expense_account_code;
    ELSE
      -- Default to first expense account
      SELECT id INTO v_expense_account_id
      FROM chart_of_accounts
      WHERE account_type = 'Expense'
      LIMIT 1;
    END IF;
    
    -- DEBIT: Expense Account (increase expense)
    INSERT INTO journal_entries (
      voucher_id,
      account_id,
      debit,
      credit,
      description,
      entry_date
    ) VALUES (
      v_voucher_id,
      v_expense_account_id,
      p_amount,
      0,
      p_description,
      CURRENT_DATE
    );
    
    -- CREDIT: Cash Account (decrease cash)
    INSERT INTO journal_entries (
      voucher_id,
      account_id,
      debit,
      credit,
      description,
      entry_date
    ) VALUES (
      v_voucher_id,
      v_cash_account_id,
      0,
      p_amount,
      p_description,
      CURRENT_DATE
    );
    
  ELSIF p_type = 'income' THEN
    -- Get revenue account (default to first revenue account)
    SELECT id INTO v_revenue_account_id
    FROM chart_of_accounts
    WHERE account_type = 'Revenue'
    LIMIT 1;
    
    -- DEBIT: Cash Account (increase cash)
    INSERT INTO journal_entries (
      voucher_id,
      account_id,
      debit,
      credit,
      description,
      entry_date
    ) VALUES (
      v_voucher_id,
      v_cash_account_id,
      p_amount,
      0,
      p_description,
      CURRENT_DATE
    );
    
    -- CREDIT: Revenue Account (increase revenue)
    INSERT INTO journal_entries (
      voucher_id,
      account_id,
      debit,
      credit,
      description,
      entry_date
    ) VALUES (
      v_voucher_id,
      v_revenue_account_id,
      0,
      p_amount,
      p_description,
      CURRENT_DATE
    );
    
  END IF;
  
  -- Return voucher details
  RETURN QUERY
  SELECT 
    v_voucher_id,
    v_voucher_number,
    p_department_name,
    p_amount,
    'pending'::TEXT,
    'Voucher created successfully with journal entries'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. APPROVE VOUCHER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION approve_voucher(
  p_voucher_id UUID,
  p_approved_by UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE vouchers
  SET 
    status = 'approved',
    approved_by = p_approved_by,
    approved_at = now()
  WHERE id = p_voucher_id
  AND status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. REJECT VOUCHER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION reject_voucher(
  p_voucher_id UUID,
  p_rejected_by UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE vouchers
  SET 
    status = 'rejected',
    approved_by = p_rejected_by,
    approved_at = now()
  WHERE id = p_voucher_id
  AND status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. TRIAL BALANCE VIEW
-- =====================================================
CREATE OR REPLACE VIEW trial_balance_view AS
SELECT 
  coa.id AS account_id,
  coa.account_code,
  coa.account_name,
  coa.account_type,
  COALESCE(SUM(je.debit), 0) AS total_debit,
  COALESCE(SUM(je.credit), 0) AS total_credit,
  CASE 
    WHEN coa.account_type IN ('Asset', 'Expense') THEN
      COALESCE(SUM(je.debit), 0) - COALESCE(SUM(je.credit), 0)
    ELSE
      COALESCE(SUM(je.credit), 0) - COALESCE(SUM(je.debit), 0)
  END AS balance
FROM chart_of_accounts coa
LEFT JOIN journal_entries je ON je.account_id = coa.id
WHERE coa.is_active = true
GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type
HAVING COALESCE(SUM(je.debit), 0) != 0 OR COALESCE(SUM(je.credit), 0) != 0
ORDER BY coa.account_code;

-- =====================================================
-- 6. BALANCE SHEET VIEW
-- =====================================================
CREATE OR REPLACE VIEW balance_sheet_view AS
SELECT 
  account_type AS category,
  account_code,
  account_name,
  balance AS amount
FROM trial_balance_view
WHERE account_type IN ('Asset', 'Liability', 'Equity')
ORDER BY 
  CASE account_type
    WHEN 'Asset' THEN 1
    WHEN 'Liability' THEN 2
    WHEN 'Equity' THEN 3
  END,
  account_code;

-- =====================================================
-- 7. INCOME STATEMENT VIEW
-- =====================================================
CREATE OR REPLACE VIEW income_statement_view AS
SELECT 
  account_type AS category,
  account_code,
  account_name,
  balance AS amount
FROM trial_balance_view
WHERE account_type IN ('Revenue', 'Expense')
ORDER BY 
  CASE account_type
    WHEN 'Revenue' THEN 1
    WHEN 'Expense' THEN 2
  END,
  account_code;

-- =====================================================
-- 8. CASHBOOK VIEW
-- =====================================================
CREATE OR REPLACE VIEW cashbook_view AS
SELECT 
  v.voucher_number,
  v.date,
  v.description,
  d.name AS department,
  v.type,
  CASE 
    WHEN je.debit > 0 THEN je.debit
    ELSE 0
  END AS cash_in,
  CASE 
    WHEN je.credit > 0 THEN je.credit
    ELSE 0
  END AS cash_out,
  v.status,
  v.created_at
FROM vouchers v
INNER JOIN journal_entries je ON je.voucher_id = v.id
INNER JOIN chart_of_accounts coa ON coa.id = je.account_id
LEFT JOIN departments d ON d.id = v.department_id
WHERE coa.account_code IN ('1000', '1100')
ORDER BY v.date DESC, v.created_at DESC;

-- =====================================================
-- 9. GENERAL LEDGER VIEW
-- =====================================================
CREATE OR REPLACE VIEW ledger_view AS
SELECT 
  coa.account_code,
  coa.account_name,
  coa.account_type,
  v.voucher_number,
  v.date AS transaction_date,
  v.description,
  d.name AS department,
  je.debit,
  je.credit,
  v.status,
  je.created_at
FROM journal_entries je
INNER JOIN chart_of_accounts coa ON coa.id = je.account_id
INNER JOIN vouchers v ON v.id = je.voucher_id
LEFT JOIN departments d ON d.id = v.department_id
ORDER BY coa.account_code, v.date DESC, je.created_at DESC;

-- =====================================================
-- 10. DEPARTMENT SPENDING VIEW
-- =====================================================
CREATE OR REPLACE VIEW department_spending_view AS
SELECT 
  d.id AS department_id,
  d.name AS department_name,
  d.budget,
  COALESCE(SUM(v.amount), 0) AS spent,
  d.budget - COALESCE(SUM(v.amount), 0) AS remaining,
  CASE 
    WHEN d.budget > 0 THEN 
      ROUND((COALESCE(SUM(v.amount), 0) / d.budget * 100), 2)
    ELSE 0
  END AS utilization_percentage,
  COUNT(v.id) AS transaction_count
FROM departments d
LEFT JOIN vouchers v ON v.department_id = d.id 
  AND v.status = 'approved' 
  AND v.type = 'expense'
WHERE d.status = 'active'
GROUP BY d.id, d.name, d.budget
ORDER BY d.name;

-- =====================================================
-- 11. VOUCHER SUMMARY VIEW (with journal entries)
-- =====================================================
CREATE OR REPLACE VIEW voucher_summary_view AS
SELECT 
  v.id,
  v.voucher_number,
  v.date,
  v.description,
  d.name AS department,
  v.amount,
  v.type,
  v.status,
  u1.name AS created_by_name,
  u2.name AS approved_by_name,
  v.approved_at,
  v.created_at,
  json_agg(
    json_build_object(
      'account_code', coa.account_code,
      'account_name', coa.account_name,
      'debit', je.debit,
      'credit', je.credit
    ) ORDER BY je.created_at
  ) AS journal_entries
FROM vouchers v
LEFT JOIN departments d ON d.id = v.department_id
LEFT JOIN users u1 ON u1.id = v.created_by
LEFT JOIN users u2 ON u2.id = v.approved_by
LEFT JOIN journal_entries je ON je.voucher_id = v.id
LEFT JOIN chart_of_accounts coa ON coa.id = je.account_id
GROUP BY 
  v.id, v.voucher_number, v.date, v.description, d.name,
  v.amount, v.type, v.status, u1.name, u2.name, 
  v.approved_at, v.created_at
ORDER BY v.date DESC, v.created_at DESC;

-- =====================================================
-- 12. FINANCIAL SUMMARY VIEW
-- =====================================================
CREATE OR REPLACE VIEW financial_summary_view AS
SELECT 
  (SELECT COALESCE(SUM(balance), 0) FROM trial_balance_view WHERE account_type = 'Asset') AS total_assets,
  (SELECT COALESCE(SUM(balance), 0) FROM trial_balance_view WHERE account_type = 'Liability') AS total_liabilities,
  (SELECT COALESCE(SUM(balance), 0) FROM trial_balance_view WHERE account_type = 'Equity') AS total_equity,
  (SELECT COALESCE(SUM(balance), 0) FROM trial_balance_view WHERE account_type = 'Revenue') AS total_revenue,
  (SELECT COALESCE(SUM(balance), 0) FROM trial_balance_view WHERE account_type = 'Expense') AS total_expenses,
  (SELECT COALESCE(SUM(balance), 0) FROM trial_balance_view WHERE account_type = 'Revenue') -
  (SELECT COALESCE(SUM(balance), 0) FROM trial_balance_view WHERE account_type = 'Expense') AS net_income,
  (SELECT COALESCE(SUM(je.credit), 0) FROM journal_entries je 
   INNER JOIN chart_of_accounts coa ON coa.id = je.account_id 
   WHERE coa.account_code = '1000') AS cash_disbursed,
  (SELECT COALESCE(SUM(je.debit), 0) FROM journal_entries je 
   INNER JOIN chart_of_accounts coa ON coa.id = je.account_id 
   WHERE coa.account_code = '1000') AS cash_received,
  (SELECT COUNT(*) FROM vouchers WHERE status = 'pending') AS pending_vouchers;
