/*
  # Seed Sample Data for NGO Fund Management
  
  ## Overview
  Seeds the database with realistic sample data matching the frontend examples:
  
  1. Departments (Health, Education, Social Services, Livelihoods, Administration)
  2. Sample users for testing
  3. Initial funding vouchers (income)
  4. Department expense vouchers matching the frontend examples
  
  ## Sample Transactions
  - Medical Supplies - Health Dept: KSh 450,000
  - School Materials - Education Dept: KSh 320,000
  - Community Outreach - Social Services: KSh 280,000
  - Agricultural Tools - Livelihoods: KSh 190,000
  - Office Supplies - Administration: KSh 75,000
*/

-- =====================================================
-- 1. SEED DEPARTMENTS
-- =====================================================
INSERT INTO departments (name, head, budget, description, member_count, status) VALUES
  ('Health', 'Dr. Sarah Kimani', 1200000, 'Health services and medical support programs', 15, 'active'),
  ('Education', 'Prof. James Omondi', 900000, 'Educational programs and school support', 12, 'active'),
  ('Social Services', 'Ms. Grace Wanjiru', 800000, 'Community welfare and social support programs', 10, 'active'),
  ('Livelihoods', 'Mr. Peter Kamau', 700000, 'Agricultural and livelihood development programs', 8, 'active'),
  ('Administration', 'Mrs. Jane Achieng', 400000, 'Administrative and operational support', 5, 'active')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 2. SEED SAMPLE USERS
-- =====================================================
-- Note: In production, users would be created via Supabase Auth
-- These are placeholder records for demonstration
INSERT INTO users (email, name, department_id, role, status) VALUES
  (
    'admin@ngo.org',
    'System Administrator',
    (SELECT id FROM departments WHERE name = 'Administration' LIMIT 1),
    'admin',
    'active'
  ),
  (
    'health.head@ngo.org',
    'Dr. Sarah Kimani',
    (SELECT id FROM departments WHERE name = 'Health' LIMIT 1),
    'department_head',
    'active'
  ),
  (
    'education.head@ngo.org',
    'Prof. James Omondi',
    (SELECT id FROM departments WHERE name = 'Education' LIMIT 1),
    'department_head',
    'active'
  ),
  (
    'social.head@ngo.org',
    'Ms. Grace Wanjiru',
    (SELECT id FROM departments WHERE name = 'Social Services' LIMIT 1),
    'department_head',
    'active'
  ),
  (
    'livelihoods.head@ngo.org',
    'Mr. Peter Kamau',
    (SELECT id FROM departments WHERE name = 'Livelihoods' LIMIT 1),
    'department_head',
    'active'
  )
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 3. CREATE INITIAL FUNDING (INCOME VOUCHERS)
-- =====================================================
-- Government Grant
DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM users WHERE email = 'admin@ngo.org';
  
  -- Government Grant: KSh 5,600,000
  PERFORM create_voucher_with_journal_entries(
    'Administration',
    'Government Grant Q1 2024',
    5600000,
    'income',
    NULL,
    v_admin_id
  );
  
  -- Approve it
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description = 'Government Grant Q1 2024'),
    v_admin_id
  );
  
  -- International Donors: KSh 3,740,000
  PERFORM create_voucher_with_journal_entries(
    'Administration',
    'International Donor Contribution',
    3740000,
    'income',
    NULL,
    v_admin_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description = 'International Donor Contribution'),
    v_admin_id
  );
  
  -- Corporate Sponsors: KSh 1,870,000
  PERFORM create_voucher_with_journal_entries(
    'Administration',
    'Corporate Sponsorship Package',
    1870000,
    'income',
    NULL,
    v_admin_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description = 'Corporate Sponsorship Package'),
    v_admin_id
  );
  
  -- Individual Donations: KSh 998,000
  PERFORM create_voucher_with_journal_entries(
    'Administration',
    'Individual Donor Contributions',
    998000,
    'income',
    NULL,
    v_admin_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description = 'Individual Donor Contributions'),
    v_admin_id
  );
END $$;

-- =====================================================
-- 4. CREATE DEPARTMENT EXPENSES (Matching Frontend)
-- =====================================================
DO $$
DECLARE
  v_health_head_id UUID;
  v_education_head_id UUID;
  v_social_head_id UUID;
  v_livelihoods_head_id UUID;
  v_admin_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO v_health_head_id FROM users WHERE email = 'health.head@ngo.org';
  SELECT id INTO v_education_head_id FROM users WHERE email = 'education.head@ngo.org';
  SELECT id INTO v_social_head_id FROM users WHERE email = 'social.head@ngo.org';
  SELECT id INTO v_livelihoods_head_id FROM users WHERE email = 'livelihoods.head@ngo.org';
  SELECT id INTO v_admin_id FROM users WHERE email = 'admin@ngo.org';
  
  -- Health Department: Medical Supplies - KSh 450,000
  PERFORM create_voucher_with_journal_entries(
    'Health',
    'Medical Supplies - Emergency Stock Replenishment',
    450000,
    'expense',
    '5000',
    v_health_head_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description LIKE 'Medical Supplies%' ORDER BY created_at DESC LIMIT 1),
    v_admin_id
  );
  
  -- Education Department: School Materials - KSh 320,000
  PERFORM create_voucher_with_journal_entries(
    'Education',
    'School Materials - Books and Supplies for 5 Schools',
    320000,
    'expense',
    '5100',
    v_education_head_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description LIKE 'School Materials%' ORDER BY created_at DESC LIMIT 1),
    v_admin_id
  );
  
  -- Social Services: Community Outreach - KSh 280,000 (PENDING)
  PERFORM create_voucher_with_journal_entries(
    'Social Services',
    'Community Outreach - Youth Empowerment Program',
    280000,
    'expense',
    '5200',
    v_social_head_id
  );
  
  -- Livelihoods: Agricultural Tools - KSh 190,000
  PERFORM create_voucher_with_journal_entries(
    'Livelihoods',
    'Agricultural Tools - Farming Equipment for Cooperatives',
    190000,
    'expense',
    '5300',
    v_livelihoods_head_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description LIKE 'Agricultural Tools%' ORDER BY created_at DESC LIMIT 1),
    v_admin_id
  );
  
  -- Administration: Office Supplies - KSh 75,000
  PERFORM create_voucher_with_journal_entries(
    'Administration',
    'Office Supplies - Stationery and Equipment',
    75000,
    'expense',
    '5400',
    v_admin_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description LIKE 'Office Supplies%' ORDER BY created_at DESC LIMIT 1),
    v_admin_id
  );
  
  -- Additional Health expenses to match budget
  PERFORM create_voucher_with_journal_entries(
    'Health',
    'Health Worker Salaries - March 2024',
    500000,
    'expense',
    '5010',
    v_health_head_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description LIKE 'Health Worker Salaries%' ORDER BY created_at DESC LIMIT 1),
    v_admin_id
  );
  
  -- Additional Education expenses
  PERFORM create_voucher_with_journal_entries(
    'Education',
    'Teacher Training Workshop',
    400000,
    'expense',
    '5110',
    v_education_head_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description LIKE 'Teacher Training%' ORDER BY created_at DESC LIMIT 1),
    v_admin_id
  );
  
  -- Additional Social Services expenses
  PERFORM create_voucher_with_journal_entries(
    'Social Services',
    'Food Distribution Program',
    370000,
    'expense',
    '5220',
    v_social_head_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description LIKE 'Food Distribution%' ORDER BY created_at DESC LIMIT 1),
    v_admin_id
  );
  
  -- Additional Livelihoods expenses
  PERFORM create_voucher_with_journal_entries(
    'Livelihoods',
    'Seeds and Fertilizer Distribution',
    330000,
    'expense',
    '5320',
    v_livelihoods_head_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description LIKE 'Seeds and Fertilizer%' ORDER BY created_at DESC LIMIT 1),
    v_admin_id
  );
  
  -- Additional Administration expenses
  PERFORM create_voucher_with_journal_entries(
    'Administration',
    'Office Rent and Utilities - Q1 2024',
    245000,
    'expense',
    '5420',
    v_admin_id
  );
  
  PERFORM approve_voucher(
    (SELECT id FROM vouchers WHERE description LIKE 'Office Rent%' ORDER BY created_at DESC LIMIT 1),
    v_admin_id
  );
END $$;
