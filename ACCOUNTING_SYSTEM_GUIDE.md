# NGO Fund Management - Complete Double-Entry Accounting System

## Overview

This is a production-ready NGO Fund Management System with a complete double-entry accounting engine powered by Supabase PostgreSQL. Every transaction automatically updates all financial statements in real-time.

## Architecture

### Backend (Supabase PostgreSQL)

#### 1. Core Tables

- **departments**: Organizational departments with budget tracking
- **users**: User accounts with role-based access
- **chart_of_accounts**: Standard chart of accounts (Assets, Liabilities, Equity, Revenue, Expenses)
- **vouchers**: Financial vouchers for all transactions
- **journal_entries**: Core double-entry ledger entries

#### 2. Automated Double-Entry Bookkeeping

When you create a voucher, the system automatically:
- Generates a unique voucher number (V-00001, V-00002, etc.)
- Creates balanced journal entries (Debit = Credit)
- Updates all financial statements in real-time
- Maintains data integrity

**Example: Health Department Expense of KSh 450,000**

```sql
SELECT create_voucher_with_journal_entries(
  'Health',                                    -- department
  'Medical Supplies - Emergency Stock',        -- description
  450000,                                      -- amount
  'expense',                                   -- type
  '5000',                                      -- expense account code
  'user-id'                                    -- created by
);
```

This automatically creates:
1. **Voucher V-00XXX** - Records the transaction
2. **Journal Entry 1**: Debit Health Dept - Medical Supplies KSh 450,000
3. **Journal Entry 2**: Credit Cash and Bank KSh 450,000
4. **Updates**:
   - Trial Balance
   - Balance Sheet
   - Income Statement
   - Cashbook
   - General Ledger
   - Department Spending View

### 3. Real-Time Financial Views

#### Trial Balance View
Shows current balances for all accounts with debit/credit totals. Automatically validates that debits = credits.

#### Balance Sheet View
Real-time statement of financial position:
- **Assets**: What the organization owns
- **Liabilities**: What the organization owes
- **Equity**: Net worth of the organization

#### Income Statement View
Shows revenue and expenses for the period, calculating net income/loss.

#### Cashbook View
All cash transactions with running balance.

#### Ledger View
Complete general ledger with all journal entries.

#### Department Spending View
Track spending vs budget for each department with utilization percentage.

#### Financial Summary View
High-level financial metrics including:
- Total Assets
- Total Revenue & Expenses
- Net Income
- Cash Flow
- Pending Vouchers

### 4. Security (Row Level Security)

**Admin Users**
- Full access to all data and operations
- Can create, approve, and reject vouchers
- Can manage all departments and users

**Department Head Users**
- View all data
- Create and approve vouchers for their department
- Manage their department's budget

**Regular Users**
- View data for their department only
- Create vouchers (requires approval)
- Cannot approve vouchers

### Frontend (Next.js + React)

#### Real-Time Integration

All components use React hooks that subscribe to database changes:

```typescript
// Automatic real-time updates
const { vouchers, loading } = useVouchers();
const { summary } = useFinancialSummary();
const { spending } = useDepartmentSpending();
```

#### Key Features

1. **Dashboard**
   - Real-time financial metrics
   - Department spending vs budget
   - Recent transactions
   - Export to PDF/Excel/CSV

2. **Vouchers**
   - Create new vouchers with automatic journal posting
   - Filter by status, department, date range
   - View journal entries for each voucher
   - Export capabilities

3. **Cashbook**
   - All cash transactions
   - Running balance
   - Cash in/out tracking
   - Date range filtering

4. **General Ledger**
   - All journal entries
   - Filter by account
   - View complete transaction history

5. **Trial Balance**
   - Current account balances
   - Validates accounting equation
   - Export capabilities

6. **Balance Sheet**
   - Assets, Liabilities, Equity
   - Real-time calculation
   - Validates accounting equation (Assets = Liabilities + Equity)

## Usage Example: Complete Transaction Flow

### Scenario: Medical Supplies Purchase

**Step 1: Create Voucher (Frontend)**
```typescript
await createVoucher(
  'Health',
  'Medical Supplies - Emergency Stock',
  450000,
  'expense',
  '5000' // Account code for Health Dept - Medical Supplies
);
```

**Step 2: Automatic Backend Processing**

The system automatically:

1. **Creates Voucher V-00123**
   - Date: Today
   - Department: Health
   - Amount: KSh 450,000
   - Status: Pending
   - Type: Expense

2. **Posts Journal Entries**
   ```
   Debit:  Health Dept - Medical Supplies (5000)  KSh 450,000
   Credit: Cash and Bank (1000)                   KSh 450,000
   ```

3. **Updates All Views in Real-Time**
   - Trial Balance: Health Dept account +450,000 (debit), Cash -450,000 (credit)
   - Balance Sheet: Cash reduced by 450,000
   - Income Statement: Expenses increased by 450,000
   - Cashbook: New entry showing cash out of 450,000
   - Ledger: Two new journal entries
   - Department Spending: Health dept spending +450,000

**Step 3: Real-Time Frontend Updates**

All components automatically refresh showing:
- Dashboard metrics update
- Department spending chart shows new utilization
- Recent transactions list includes new voucher
- Cashbook shows new cash out
- Trial balance updates
- Balance sheet reflects new cash balance

### Approving a Voucher

```typescript
await approveVoucher(voucherId, approverUserId);
```

This changes voucher status to "approved" and records who approved it and when.

## Database Schema Details

### Chart of Accounts Structure

#### Assets (1000-1999)
- 1000: Cash and Bank
- 1100: Petty Cash
- 1200: Accounts Receivable
- 1300: Prepaid Expenses

#### Liabilities (2000-2999)
- 2000: Accounts Payable
- 2100: Accrued Expenses
- 2200: Deferred Revenue

#### Equity (3000-3999)
- 3000: Fund Balance
- 3100: Retained Earnings
- 3200: Restricted Funds

#### Revenue (4000-4999)
- 4000: Government Grants
- 4100: International Donors
- 4200: Corporate Sponsors
- 4300: Individual Donations
- 4400: Other Income

#### Expenses (5000-5999)
- 5000-5020: Health Department
- 5100-5120: Education Department
- 5200-5220: Social Services
- 5300-5320: Livelihoods
- 5400-5430: Administration

## API Reference

### React Hooks

```typescript
// Dashboard & Summary
useFinancialSummary() // Overall financial metrics
useDepartmentSpending() // Department budget tracking

// Transactions
useVouchers(filters?) // All vouchers with optional filters
useCashbook(filters?) // Cash transactions
useLedger(accountCode?) // Journal entries

// Financial Statements
useTrialBalance() // Account balances
useBalanceSheet() // Assets, Liabilities, Equity
useIncomeStatement() // Revenue and Expenses

// Master Data
useDepartments() // All departments
useChartOfAccounts(type?) // Accounts (optionally filtered by type)

// Actions
createVoucher(...) // Create new voucher with auto journal posting
approveVoucher(...) // Approve pending voucher
rejectVoucher(...) // Reject pending voucher
```

### Database Functions

```sql
-- Create voucher with automatic journal entries
create_voucher_with_journal_entries(
  department_name TEXT,
  description TEXT,
  amount NUMERIC,
  type TEXT, -- 'income', 'expense', or 'transfer'
  expense_account_code TEXT,
  created_by UUID
)

-- Approve voucher
approve_voucher(voucher_id UUID, approved_by UUID)

-- Reject voucher
reject_voucher(voucher_id UUID, rejected_by UUID)

-- Get account balance
get_account_balance(account_id UUID)
```

## Sample Data

The system is pre-populated with:
- 5 Departments (Health, Education, Social Services, Livelihoods, Administration)
- Sample users with different roles
- Initial funding vouchers (income)
- Department expenses matching the frontend examples
- Complete chart of accounts

## Key Benefits

1. **Automatic Double-Entry**: Never worry about unbalanced books
2. **Real-Time Updates**: All views update instantly
3. **Data Integrity**: PostgreSQL ensures consistency
4. **Audit Trail**: Complete history of all transactions
5. **Role-Based Security**: Proper access control
6. **Production Ready**: Built with best practices

## Export Capabilities

All financial reports can be exported to:
- **PDF**: Professional formatted reports
- **Excel**: For further analysis
- **CSV**: For data processing

## Next Steps

1. **Authentication**: Integrate Supabase Auth for user login
2. **Multi-Currency**: Add support for multiple currencies
3. **Budget Management**: Enhanced budget vs actual tracking
4. **Reporting**: Advanced financial reports and analytics
5. **Mobile App**: React Native version for mobile access

## Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL 15)
- **Real-Time**: Supabase Realtime subscriptions
- **Auth**: Supabase Auth (ready to integrate)
- **Export**: jsPDF, xlsx, @react-pdf/renderer

## Support

For questions or issues:
1. Check database logs: `SELECT * FROM journal_entries ORDER BY created_at DESC`
2. Verify trial balance: `SELECT * FROM trial_balance_view`
3. Check voucher status: `SELECT * FROM voucher_summary_view`
