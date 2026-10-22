import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Breadcrumb from './components/Breadcrumb';
import UserSwitcherModal from './components/UserSwitcherModal';
import EduGuideDrawer from './components/EduGuideDrawer';
import PracticeSpotlightTour from './components/PracticeSpotlightTour';

// Views
import HomeView from './views/HomeView';
import AdminHubView from './views/AdminHubView';
import OfficesView from './views/OfficesView';
import CreateOfficeView from './views/CreateOfficeView';
import OrganizationView from './views/OrganizationView';
import SystemView from './views/SystemView';
import TellersView from './views/TellersView';
import UsersView from './views/UsersView';
import RolesView from './views/RolesView';
import AddRoleView from './views/AddRoleView';
import ChartOfAccountsView, { 
  ROOT_GL_HEADERS_SAMPLES, 
  SAMPLE_GL_LEVEL_2, 
  FULL_GL_LEVEL_2_ACCOUNTS,
  SAMPLE_GL_DETAILS 
} from './views/ChartOfAccountsView';
import AccountingView from './views/AccountingView';
import CurrencyConfigView from './views/CurrencyConfigView';
import FinancialActivityMappingsView from './views/FinancialActivityMappingsView';
import AccountingRulesView from './views/AccountingRulesView';
import JournalEntriesView from './views/JournalEntriesView';
import LoanProductsView from './views/LoanProductsView';
import CreateLoanProductView from './views/CreateLoanProductView';
import SavingsProductsView from './views/SavingsProductsView';
import ProductsView from './views/ProductsView';
import CreateSavingsProductView from './views/CreateSavingsProductView';
import FixedDepositProductsView from './views/FixedDepositProductsView';
import CreateFixedDepositProductView from './views/CreateFixedDepositProductView';
import RecurringDepositProductsView from './views/RecurringDepositProductsView';
import CreateRecurringDepositProductView from './views/CreateRecurringDepositProductView';
import ClientsView from './views/ClientsView';
import CreateClientView from './views/CreateClientView';
import CreateUserView from './views/CreateUserView';
import UserDetailView from './views/UserDetailView';
import ClientDetailView from './views/ClientDetailView';
import LoanDetailView from './views/LoanDetailView';
import CreateLoanAccountView from './views/CreateLoanAccountView';
import SavingsDetailView from './views/SavingsDetailView';
import DepositSavingsAccountView from './views/DepositSavingsAccountView';
import WithdrawSavingsAccountView from './views/WithdrawSavingsAccountView';
import AccountTransferView from './views/AccountTransferView';
import CreateSavingsAccountView from './views/CreateSavingsAccountView';
import CreateFixedDepositAccountView from './views/CreateFixedDepositAccountView';
import FixedDepositDetailView from './views/FixedDepositDetailView';
import ApproveFixedDepositAccountView from './views/ApproveFixedDepositAccountView';
import CreateRecurringDepositAccountView from './views/CreateRecurringDepositAccountView';
import RecurringDepositDetailView from './views/RecurringDepositDetailView';
import ApproveRecurringDepositAccountView from './views/ApproveRecurringDepositAccountView';
import DepositRecurringDepositAccountView from './views/DepositRecurringDepositAccountView';
import ConfigurationsView from './views/ConfigurationsView';
import MigrateOpeningBalancesView from './views/MigrateOpeningBalancesView';
import CreateJournalEntryView from './views/CreateJournalEntryView';
import CreateAccountingRuleView from './views/CreateAccountingRuleView';
import ViewAccountingRuleView from './views/ViewAccountingRuleView';
import FrequentPostingsView from './views/FrequentPostingsView';
import ViewTransactionView from './views/ViewTransactionView';
import RoleDetailView from './views/RoleDetailView';
import { INITIAL_ROLE_PERMISSIONS, FULL_CONFIGURED_ROLE_PERMISSIONS } from './data/mifosPermissions';

// Authentic Dataset
import {
  INITIAL_BANK_INFO,
  INITIAL_OFFICES,
  FULL_BACKUP_OFFICES,
  REGIONAL_OFFICES_SAMPLE,
  INITIAL_ROLES,
  DEFAULT_SYSTEM_ROLES,
  FULL_BACKUP_ROLES,
  INITIAL_USERS,
  DEFAULT_SYSTEM_USERS,
  FULL_BACKUP_USERS,
  SYSTEM_ADMIN,
  INITIAL_GL_ACCOUNTS,
  INITIAL_LOAN_PRODUCTS,
  INITIAL_SAVINGS_PRODUCTS,
  INITIAL_CLIENTS,
  INITIAL_TELLERS,
  INITIAL_FINANCIAL_ACTIVITIES,
  INITIAL_ACCOUNTING_RULES,
  INITIAL_GL_CLOSURES,
  INITIAL_LOANS,
  INITIAL_SAVINGS_ACCOUNTS,
  INITIAL_CONFIGURED_CURRENCIES
} from './data/mifosData';

export default function App() {
  // Application State
  const [bankInfo] = useState(INITIAL_BANK_INFO);
  const [currencies, setCurrencies] = useState(INITIAL_CONFIGURED_CURRENCIES);
  const [offices, setOffices] = useState(INITIAL_OFFICES);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [glAccounts, setGlAccounts] = useState(INITIAL_GL_ACCOUNTS);
  const [loanProducts, setLoanProducts] = useState([]);
  const [savingsProducts, setSavingsProducts] = useState(INITIAL_SAVINGS_PRODUCTS);
  const [fixedDepositProducts, setFixedDepositProducts] = useState([]);
  const [recurringDepositProducts, setRecurringDepositProducts] = useState([]);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [tellers, setTellers] = useState(INITIAL_TELLERS);
  const [loans, setLoans] = useState(() =>
    INITIAL_LOANS.map(l => l.clientId === '11' ? { ...l, clientId: '12', clientName: 'Lan Ngoc Pham' } : l)
  );
  const [savingsAccounts, setSavingsAccounts] = useState(() =>
    INITIAL_SAVINGS_ACCOUNTS.map(s => {
      if (s.id === '1') {
        return {
          ...s,
          clientId: '11',
          clientName: 'Minh Quang Tran',
          balance: null,
          lastActive: '2026-10-13',
          openedDate: '2026-10-13'
        };
      }
      if (s.id === '2') {
        return {
          ...s,
          clientId: '12',
          clientName: 'Lan Ngoc Pham',
          balance: null,
          lastActive: '2026-10-13',
          openedDate: '2026-10-13'
        };
      }
      return s;
    })
  );
  const [financialActivities, setFinancialActivities] = useState(INITIAL_FINANCIAL_ACTIVITIES);
  const [accountingRules, setAccountingRules] = useState([
    {
      id: '1',
      name: 'Operating Expense Accrual',
      officeId: '1',
      officeName: 'Takashimaya Bank (TKB) - HO',
      debitTags: '',
      debitAccount: 'Operating Expense',
      creditTags: '',
      creditAccount: 'Accrued Operating Expenses Payable',
      description: 'Records operating expenses incurred but not yet paid, ensuring consistent accrual accounting entries.'
    }
  ]);

  // Navigation & UI state
  const [currentPath, setCurrentPath] = useState('home');
  const [selectedClient, setSelectedClient] = useState(INITIAL_CLIENTS[10] || INITIAL_CLIENTS[0]); // Minh Quang Tran
  const [selectedLoan, setSelectedLoan] = useState(INITIAL_LOANS[0] || null);
  const [selectedSavings, setSelectedSavings] = useState(INITIAL_SAVINGS_ACCOUNTS[0] || null);
  const [selectedFixedDeposit, setSelectedFixedDeposit] = useState(null);
  const [selectedRecurringDeposit, setSelectedRecurringDeposit] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAccountingRule, setSelectedAccountingRule] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState(INITIAL_ROLE_PERMISSIONS);
  const [roleInitialEditMode, setRoleInitialEditMode] = useState(false);

  // User & Edu guide modal
  const [currentUser, setCurrentUser] = useState(SYSTEM_ADMIN);
  const [userSwitcherOpen, setUserSwitcherOpen] = useState(false);
  const [eduGuideOpen, setEduGuideOpen] = useState(false);
  const [practiceActive, setPracticeActive] = useState(false);
  const [practiceModule, setPracticeModule] = useState('part-1');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Opening Balance Migration states
  const [contraAccountConfigEnabled, setContraAccountConfigEnabled] = useState(false);
  const [hasOpeningBalanceSubmitted, setHasOpeningBalanceSubmitted] = useState(false);
  const [customJournalEntries, setCustomJournalEntries] = useState([]);
  const [hasCheckedRdJournal, setHasCheckedRdJournal] = useState(false);

  // Router navigation helper
  const navigate = (path, params = {}) => {
    if (params.rule) {
      setSelectedAccountingRule(params.rule);
    }
    if (params.transaction) {
      setSelectedTransaction(params.transaction);
    }
    if (params.role) {
      setSelectedRole(params.role);
    }
    if (params.editMode !== undefined) {
      setRoleInitialEditMode(Boolean(params.editMode));
    }
    if (path === 'accounting-journal') {
      const rd = selectedRecurringDeposit || savingsAccounts.find(s => s.accountNo === '000000004');
      if (rd?.hasDeposited || Number(rd?.balance) >= 500000) {
        setHasCheckedRdJournal(true);
      }
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State mutators
  const handleSaveJournalEntry = (newEntry) => {
    setCustomJournalEntries(prev => [newEntry, ...prev]);
  };

  const handleAddAccountingRule = (newRule) => {
    setAccountingRules(prev => [newRule, ...prev]);
  };

  const handleAddOffice = (newOffice) => {
    setOffices(prev => [newOffice, ...prev]);
  };

  const handleAddUser = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleAddRole = (newRole) => {
    setRoles(prev => [...prev, newRole]);
  };

  const handleSaveRolePermissions = (roleId, updatedPermissions) => {
    setRolePermissions(prev => ({
      ...prev,
      [String(roleId)]: updatedPermissions
    }));
  };

  const handleToggleRoleDisabled = (roleId) => {
    setRoles(prev => prev.map(r => {
      if (String(r.id) === String(roleId)) {
        return { ...r, disabled: !r.disabled };
      }
      return r;
    }));
  };

  const handleDeleteRole = (roleId) => {
    setRoles(prev => prev.filter(r => String(r.id) !== String(roleId)));
  };

  const handleLoadAllRolePermissions = () => {
    setRolePermissions({ ...FULL_CONFIGURED_ROLE_PERMISSIONS });
  };

  const handleAddAccount = (newAccount) => {
    setGlAccounts(prev => [newAccount, ...prev]);
  };

  const handleAddLoanProduct = (newProduct) => {
    setLoanProducts(prev => [newProduct, ...prev]);
  };

  const handleAddSavingsProduct = (newProduct) => {
    const nextId = String(savingsProducts.length + 1);
    const productWithId = {
      ...newProduct,
      id: nextId
    };
    setSavingsProducts(prev => [productWithId, ...prev]);
  };

  const handleAddClient = (newClient) => {
    const isClient2 = newClient.externalId === 'TKB-CIF-TDU-002' || 
                      (newClient.firstname && newClient.firstname.toLowerCase().includes('lan')) ||
                      (newClient.displayName && newClient.displayName.toLowerCase().includes('lan ngoc pham'));
    const isClient1 = newClient.externalId === 'TKB-CIF-TDU-001' || 
                      (newClient.firstname && newClient.firstname.toLowerCase().includes('minh')) ||
                      (newClient.displayName && newClient.displayName.toLowerCase().includes('minh quang tran'));

    const nextAccountNo = newClient.accountNo || (isClient2 ? '000000012' : isClient1 ? '000000011' : String(clients.length + 1).padStart(9, '0'));
    const clientId = newClient.id || (isClient2 ? '12' : isClient1 ? '11' : String(Date.now()));

    const clientWithAccount = {
      ...newClient,
      id: clientId,
      accountNo: nextAccountNo
    };

    setClients(prev => {
      const idx = prev.findIndex(c => c.id === clientWithAccount.id || c.accountNo === clientWithAccount.accountNo);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = clientWithAccount;
        return updated;
      }
      return [clientWithAccount, ...prev];
    });

    // If client requested to open savings account, create linked CASA account
    if (newClient.openSavingsAccount) {
      const savingsAccountNo = isClient2 ? '000000002' : isClient1 ? '000000001' : String(savingsAccounts.length + 1).padStart(9, '0');
      const savingsId = isClient2 ? '2' : isClient1 ? '1' : String(Date.now() + 1);

      const newSavingsAcc = {
        id: savingsId,
        clientId: clientWithAccount.id,
        clientName: clientWithAccount.displayName,
        accountNo: savingsAccountNo,
        productName: newClient.savingsProduct || 'TKB Current Account',
        accountType: 'Savings (Thanh toán)',
        balance: null, // empty initial balance as per screenshot Image 2
        lastActive: '2026-10-13',
        status: 'Active',
        openedDate: '2026-10-13'
      };
      setSavingsAccounts(prev => {
        const filtered = prev.filter(s => s.accountNo !== savingsAccountNo || s.clientId !== clientWithAccount.id);
        return [newSavingsAcc, ...filtered];
      });
    }

    return clientWithAccount;
  };

  const handleAddSavingsAccountForClient = (newAccount) => {
    setSavingsAccounts(prev => [newAccount, ...prev]);
    navigate('client-detail');
  };

  const handleAllocateCash = (tellerId, amount) => {
    setTellers(prev => prev.map(t => {
      if (t.id === tellerId) {
        return {
          ...t,
          currentCashBalance: (t.currentCashBalance || 50000000) + amount
        };
      }
      return t;
    }));
  };

  const handleMakeRepayment = (loanId, amount) => {
    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          totalRepaid: l.totalRepaid + amount,
          outstandingBalance: Math.max(0, l.outstandingBalance - amount)
        };
      }
      return l;
    }));
  };

  const handleDeposit = (savingsIdOrData, amountParam) => {
    let savingsId = '1';
    let amount = 5000000;
    let txDate = '2026-10-13';
    let paymentType = 'Money Transfer';
    let notes = 'Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001.';

    if (typeof savingsIdOrData === 'object' && savingsIdOrData !== null) {
      savingsId = savingsIdOrData.savingsId || (selectedSavings ? selectedSavings.id : '1');
      amount = Number(savingsIdOrData.amount) || 5000000;
      txDate = savingsIdOrData.transactionDate || '2026-10-13';
      paymentType = savingsIdOrData.paymentType || 'Money Transfer';
      notes = savingsIdOrData.notes || notes;
    } else {
      savingsId = savingsIdOrData;
      amount = Number(amountParam) || 5000000;
    }

    let updatedTarget = null;

    setSavingsAccounts(prev => prev.map(s => {
      if (s.id === savingsId || s.accountNo === '000000001' || (selectedSavings && s.id === selectedSavings.id)) {
        const currentBal = Number(s.balance) || 0;
        const newBalance = currentBal + amount;
        const newTx = {
          id: String((s.transactions?.length || 0) + 1),
          date: txDate,
          type: 'DEPOSIT',
          transactionType: 'Deposit',
          amount: amount,
          balanceAfter: newBalance,
          paymentType: paymentType,
          desc: notes
        };
        const existingTxs = s.transactions || [];
        const updated = {
          ...s,
          balance: newBalance,
          lastActive: txDate,
          transactions: [newTx, ...existingTxs]
        };
        updatedTarget = updated;
        return updated;
      }
      return s;
    }));

    if (updatedTarget) {
      setSelectedSavings(updatedTarget);
    }
    navigate('savings-detail');
  };


  const handleAccountTransfer = (transferData) => {
    const amount = Number(transferData?.amount) || 1000000;
    const txDate = transferData?.transactionDate || '2026-10-13';
    const desc = transferData?.description || 'Internal CASA transfer to Lan Pham. TKB-TRF-001.';
    let updatedSource = null;

    setSavingsAccounts(prev => {
      const updated = prev.map(s => {
        if (s.accountNo === '000000001') {
          const currentBal = Number(s.balance) || 3000000;
          const newBalance = Math.max(0, currentBal - amount);
          const newTx = {
            id: String((s.transactions?.length || 0) + 1),
            date: txDate,
            transactionDate: txDate,
            type: 'TRANSFER_FROM',
            transactionType: 'Transfer Transfer From',
            amount: amount,
            debit: amount,
            credit: null,
            balanceAfter: newBalance,
            paymentType: 'Money Transfer',
            desc: desc
          };
          const existingTxs = s.transactions || [];
          const sourceObj = {
            ...s,
            balance: newBalance,
            lastActive: txDate,
            transactions: [newTx, ...existingTxs]
          };
          updatedSource = sourceObj;
          return sourceObj;
        }

        if (s.accountNo === '000000002') {
          const currentBal = Number(s.balance) || 0;
          const newBalance = currentBal + amount;
          const newTx = {
            id: String((s.transactions?.length || 0) + 1),
            date: txDate,
            transactionDate: txDate,
            type: 'TRANSFER_TO',
            transactionType: 'Transfer Transfer To',
            amount: amount,
            debit: null,
            credit: amount,
            balanceAfter: newBalance,
            paymentType: 'Money Transfer',
            desc: 'Internal CASA transfer from Minh Tran. TKB-TRF-001.'
          };
          const existingTxs = s.transactions || [];
          return {
            ...s,
            balance: newBalance,
            lastActive: txDate,
            transactions: [newTx, ...existingTxs]
          };
        }

        return s;
      });

      return updated;
    });

    if (updatedSource) {
      setSelectedSavings(updatedSource);
    }
    navigate('savings-detail');
  };

  const handleResetSavingsForTransfer = () => {
    const seededSavingsMinh = {
      id: '1',
      clientId: '11',
      clientName: 'Minh Quang Tran',
      accountNo: '000000001',
      productName: 'TKB Current Account',
      shortName: 'TKCA',
      status: 'Active',
      balance: 3000000,
      lastActive: '2026-10-13',
      openedDate: '2026-10-13',
      transactions: [
        {
          id: '2',
          date: '2026-10-13',
          transactionDate: '2026-10-13',
          type: 'WITHDRAWAL',
          transactionType: 'Withdrawal',
          amount: 2000000,
          debit: 2000000,
          credit: null,
          balanceAfter: 3000000,
          paymentType: 'Money Transfer',
          desc: 'CASA withdrawal via bank transfer. TKB-CASA-WD-001.'
        },
        {
          id: '1',
          date: '2026-10-13',
          transactionDate: '2026-10-13',
          type: 'DEPOSIT',
          transactionType: 'Deposit',
          amount: 5000000,
          credit: 5000000,
          debit: null,
          balanceAfter: 5000000,
          paymentType: 'Money Transfer',
          desc: 'Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001.'
        }
      ]
    };

    const seededSavingsLan = {
      id: '2',
      clientId: '12',
      clientName: 'Lan Ngoc Pham',
      accountNo: '000000002',
      productName: 'TKB Current Account',
      shortName: 'TKCA',
      status: 'Active',
      balance: 0,
      lastActive: '2026-10-13',
      openedDate: '2026-10-13',
      transactions: []
    };

    setSavingsAccounts(prev => {
      const filtered = prev.filter(s => s.accountNo !== '000000001' && s.accountNo !== '000000002');
      return [seededSavingsMinh, seededSavingsLan, ...filtered];
    });
    setSelectedSavings(seededSavingsMinh);
  };

  const handleWithdraw = (savingsIdOrData, amountParam) => {
    let savingsId = '1';
    let amount = 2000000;
    let txDate = '2026-10-13';
    let paymentType = 'Money Transfer';
    let notes = 'CASA withdrawal via bank transfer. TKB-CASA-WD-001.';

    if (typeof savingsIdOrData === 'object' && savingsIdOrData !== null) {
      savingsId = savingsIdOrData.savingsId || (selectedSavings ? selectedSavings.id : '1');
      amount = Number(savingsIdOrData.amount) || 2000000;
      txDate = savingsIdOrData.transactionDate || '2026-10-13';
      paymentType = savingsIdOrData.paymentType || 'Money Transfer';
      notes = savingsIdOrData.notes || notes;
    } else {
      savingsId = savingsIdOrData;
      amount = Number(amountParam) || 2000000;
    }

    let updatedTarget = null;

    setSavingsAccounts(prev => prev.map(s => {
      if (s.id === savingsId || s.accountNo === '000000001' || (selectedSavings && s.id === selectedSavings.id)) {
        const currentBal = Number(s.balance) || 5000000;
        const newBalance = Math.max(0, currentBal - amount);
        const newTx = {
          id: String((s.transactions?.length || 0) + 1),
          date: txDate,
          transactionDate: txDate,
          type: 'WITHDRAWAL',
          transactionType: 'Withdrawal',
          amount: amount,
          debit: amount,
          credit: null,
          balanceAfter: newBalance,
          paymentType: paymentType,
          desc: notes
        };
        const existingTxs = s.transactions || [];
        const updated = {
          ...s,
          balance: newBalance,
          lastActive: txDate,
          transactions: [newTx, ...existingTxs]
        };
        updatedTarget = updated;
        return updated;
      }
      return s;
    }));

    if (updatedTarget) {
      setSelectedSavings(updatedTarget);
    }
    navigate('savings-detail');
  };

  const handleSaveFinancialActivity = (newMapping) => {
    setFinancialActivities(prev => {
      const existingIndex = prev.findIndex(a => a.activityCode === newMapping.activityCode);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newMapping };
        return updated;
      }
      return [newMapping, ...prev];
    });
  };

  // Breadcrumbs computation
  const getBreadcrumbs = () => {
    switch (currentPath) {
      case 'admin':
        return [{ label: 'Admin', path: 'admin' }];
      case 'admin-organization':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Organization' }];
      case 'admin-system':
        return [{ label: 'Admin', path: 'admin' }, { label: 'System' }];
      case 'admin-offices':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Organization', path: 'admin' }, { label: 'Manage Offices' }];
      case 'admin-create-office':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Organization', path: 'admin' }, { label: 'Manage Offices', path: 'admin-offices' }, { label: 'Create Office' }];
      case 'admin-tellers':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Organization', path: 'admin' }, { label: 'Cash Management' }];
      case 'admin-users':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Users', path: 'admin' }, { label: 'Manage Users' }];
      case 'admin-create-user':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Users', path: 'admin-users' }, { label: 'Create User' }];
      case 'admin-user-detail':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Users', path: 'admin-users' }, { label: selectedUser?.id || '28' }];
      case 'admin-roles':
        return [{ label: 'Admin', path: 'admin' }, { label: 'System', path: 'admin-system' }, { label: 'Roles and Permissions' }];
      case 'admin-role-detail':
        return [
          { label: 'Admin', path: 'admin' },
          { label: 'System', path: 'admin-system' },
          { label: 'Roles and Permissions', path: 'admin-roles' },
          { label: selectedRole ? (selectedRole.name || String(selectedRole.id)) : '4' }
        ];
      case 'admin-add-role':
        return [{ label: 'Admin', path: 'admin' }, { label: 'System', path: 'admin-system' }, { label: 'Roles and Permissions', path: 'admin-roles' }, { label: 'Add' }];
      case 'admin-configurations':
        return [{ label: 'Admin', path: 'admin' }, { label: 'System', path: 'admin-system' }, { label: 'Configurations' }];
      case 'admin-products':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Products' }];
      case 'admin-loan-products':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Products', path: 'admin-products' }, { label: 'Loan Products' }];
      case 'admin-create-loan-product':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Products', path: 'admin-products' }, { label: 'Loan Products', path: 'admin-loan-products' }, { label: 'Create' }];
      case 'admin-savings-products':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Products', path: 'admin-products' }, { label: 'Saving Products' }];
      case 'admin-create-savings-product':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Products', path: 'admin-products' }, { label: 'Saving Products', path: 'admin-savings-products' }, { label: 'Create' }];
      case 'accounting-coa':
        return [{ label: 'Accounting', path: 'accounting' }, { label: 'Chart of Accounts' }];
      case 'accounting-activities':
        return [{ label: 'Accounting', path: 'accounting' }, { label: 'Financial Activity Mappings' }];
      case 'accounting-rules':
        return [{ label: 'Accounting', path: 'accounting' }, { label: 'Accounting Rules' }];
      case 'accounting-create-rule':
        return [{ label: 'Accounting', path: 'accounting' }, { label: 'Accounting Rules', path: 'accounting-rules' }, { label: 'Create' }];
      case 'accounting-view-rule':
        return [
          { label: 'Accounting', path: 'accounting' },
          { label: 'Accounting Rules', path: 'accounting-rules' },
          { label: selectedAccountingRule?.name || 'Operating Expense Accrual' }
        ];
      case 'accounting-closure':
        return [{ label: 'Accounting', path: 'accounting' }, { label: 'Closing Entries' }];
      case 'accounting-journal':
        return [{ label: 'Accounting', path: 'accounting' }, { label: 'Search Journal Entries' }];
      case 'accounting-create-journal':
        return [{ label: 'Accounting', path: 'accounting' }, { label: 'Journal Entries', path: 'accounting-journal' }, { label: 'Create' }];
      case 'accounting-opening-balances':
        return [{ label: 'Accounting', path: 'accounting' }, { label: 'Migrate Opening Balances' }];
      case 'clients':
        return [{ label: 'Clients', path: 'clients' }];
      case 'client-detail':
        return [{ label: 'Clients', path: 'clients' }, { label: selectedClient ? `${selectedClient.displayName} (#${selectedClient.accountNo})` : 'Client Profile' }];
      case 'loan-detail':
        return [{ label: 'Clients', path: 'clients' }, { label: selectedClient?.displayName || 'Client', path: 'client-detail' }, { label: `Loan #${selectedLoan?.accountNo}` }];
      case 'savings-detail':
        return [{ label: 'Clients', path: 'clients' }, { label: selectedClient?.displayName || 'Client', path: 'client-detail' }, { label: `Savings #${selectedSavings?.accountNo}` }];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#333333]">
      {/* Mifos Top Navbar */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        currentUser={currentUser}
        openUserSwitcher={() => setUserSwitcherOpen(true)}
        toggleEduGuide={() => setEduGuideOpen(!eduGuideOpen)}
        eduGuideOpen={eduGuideOpen}
        bankInfo={bankInfo}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Icon Dock */}
        <Sidebar
          collapsed={sidebarCollapsed}
          currentPath={currentPath}
          navigate={navigate}
          openUserSwitcher={() => setUserSwitcherOpen(true)}
          toggleEduGuide={() => setEduGuideOpen(!eduGuideOpen)}
          currentUser={currentUser}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          {/* Breadcrumb Bar */}
          {currentPath !== 'home' && currentPath !== 'accounting' && currentPath !== 'accounting-coa' && currentPath !== 'accounting-activities' && currentPath !== 'accounting-opening-balances' && currentPath !== 'accounting-journal' && currentPath !== 'accounting-create-journal' && currentPath !== 'accounting-rules' && currentPath !== 'accounting-create-rule' && currentPath !== 'accounting-view-rule' && currentPath !== 'accounting-frequent-postings' && currentPath !== 'accounting-view-transaction' && currentPath !== 'admin-currency-config' && currentPath !== 'admin-manage-currencies' && currentPath !== 'clients' && currentPath !== 'create-client' && currentPath !== 'admin-users' && currentPath !== 'admin-create-user' && currentPath !== 'admin-user-detail' && currentPath !== 'admin-organization' && currentPath !== 'admin-system' && currentPath !== 'admin-roles' && currentPath !== 'admin-add-role' && currentPath !== 'admin-role-detail' && currentPath !== 'admin-configurations' && currentPath !== 'admin-products' && currentPath !== 'admin-savings-products' && currentPath !== 'admin-create-savings-product' && currentPath !== 'admin-fixed-deposit-products' && currentPath !== 'admin-create-fixed-deposit-product' && currentPath !== 'admin-recurring-deposit-products' && currentPath !== 'admin-create-recurring-deposit-product' && currentPath !== 'admin-loan-products' && currentPath !== 'admin-create-loan-product' && currentPath !== 'client-detail' && currentPath !== 'create-savings-account' && currentPath !== 'create-fixed-deposit-account' && currentPath !== 'fixed-deposit-detail' && currentPath !== 'approve-fixed-deposit-account' && currentPath !== 'create-recurring-deposit-account' && currentPath !== 'recurring-deposit-detail' && currentPath !== 'approve-recurring-deposit-account' && currentPath !== 'deposit-recurring-deposit-account' && currentPath !== 'create-loan-account' && (
            <Breadcrumb
              items={getBreadcrumbs()}
              onBack={() => {
                if (currentPath === 'loan-detail' || currentPath === 'savings-detail') {
                  navigate('client-detail');
                } else if (currentPath === 'client-detail') {
                  navigate('clients');
                } else if (currentPath.startsWith('admin-')) {
                  navigate('admin');
                } else {
                  navigate('home');
                }
              }}
              navigate={navigate}
            />
          )}

          <main className="flex-1 pb-16">
        {currentPath === 'home' && (
          <HomeView
            navigate={navigate}
            data={{
              offices,
              roles,
              users,
              glAccounts,
              loanProducts,
              savingsProducts,
              clients,
              loans,
              savingsAccounts
            }}
            toggleEduGuide={() => setEduGuideOpen(true)}
            currentUser={currentUser}
            openUserSwitcher={() => setUserSwitcherOpen(true)}
          />
        )}

        {currentPath === 'admin' && (
          <AdminHubView navigate={navigate} />
        )}

        {currentPath === 'admin-organization' && (
          <OrganizationView navigate={navigate} />
        )}

        {currentPath === 'admin-system' && (
          <SystemView navigate={navigate} />
        )}

        {currentPath === 'admin-configurations' && (
          <ConfigurationsView
            navigate={navigate}
            contraAccountEnabled={contraAccountConfigEnabled}
            onToggleContraAccount={(val) => setContraAccountConfigEnabled(val)}
          />
        )}

        {currentPath === 'admin-offices' && (
          <OfficesView
            offices={offices}
            onAddOffice={handleAddOffice}
            navigate={navigate}
          />
        )}

        {currentPath === 'admin-create-office' && (
          <CreateOfficeView
            offices={offices}
            onAddOffice={handleAddOffice}
            navigate={navigate}
          />
        )}

        {currentPath === 'admin-currency-config' && (
          <CurrencyConfigView
            navigate={navigate}
            initialMode="list"
            currencies={currencies}
            onSaveCurrencies={setCurrencies}
          />
        )}

        {currentPath === 'admin-manage-currencies' && (
          <CurrencyConfigView
            navigate={navigate}
            initialMode="edit"
            currencies={currencies}
            onSaveCurrencies={setCurrencies}
          />
        )}

        {currentPath === 'admin-tellers' && (
          <TellersView tellers={tellers} onAllocateCash={handleAllocateCash} />
        )}

        {currentPath === 'admin-users' && (
          <UsersView
            users={users}
            offices={offices}
            roles={roles}
            onAddUser={handleAddUser}
            currentUser={currentUser}
            onSwitchUser={(u) => setCurrentUser(u)}
            onSelectUser={(u) => setSelectedUser(u)}
            navigate={navigate}
          />
        )}

        {currentPath === 'admin-create-user' && (
          <CreateUserView
            offices={offices}
            roles={roles}
            users={users}
            onAddUser={handleAddUser}
            onSelectUser={(u) => setSelectedUser(u)}
            navigate={navigate}
          />
        )}

        {currentPath === 'admin-user-detail' && (
          <UserDetailView
            user={selectedUser}
            onDeleteUser={handleDeleteUser}
            navigate={navigate}
          />
        )}

        {currentPath === 'admin-roles' && (
          <RolesView 
            roles={roles} 
            onAddRole={handleAddRole}
            navigate={navigate}
          />
        )}

        {currentPath === 'admin-role-detail' && (
          <RoleDetailView
            role={selectedRole}
            roles={roles}
            rolePermissions={selectedRole ? rolePermissions[String(selectedRole.id)] : rolePermissions['4']}
            onSavePermissions={handleSaveRolePermissions}
            onToggleRoleDisabled={handleToggleRoleDisabled}
            onDeleteRole={handleDeleteRole}
            navigate={navigate}
            initialEditMode={roleInitialEditMode}
          />
        )}

        {currentPath === 'admin-add-role' && (
          <AddRoleView
            onAddRole={handleAddRole}
            navigate={navigate}
          />
        )}

        {currentPath === 'admin-products' && (
          <ProductsView
            onNavigateHome={() => navigate('home')}
            onNavigateSavingsProducts={() => navigate('admin-savings-products')}
            onNavigateLoanProducts={() => navigate('admin-loan-products')}
            onNavigateFixedDepositProducts={() => navigate('admin-fixed-deposit-products')}
            onNavigateRecurringDepositProducts={() => navigate('admin-recurring-deposit-products')}
          />
        )}

        {currentPath === 'admin-loan-products' && (
          <LoanProductsView
            loanProducts={loanProducts}
            onNavigateHome={() => navigate('home')}
            onNavigateProducts={() => navigate('admin-products')}
            onNavigateCreateLoanProduct={() => navigate('admin-create-loan-product')}
            onStartPractice={() => {
              setPracticeModule('loan-part-1');
              setPracticeActive(true);
            }}
            isPracticeActive={practiceActive}
          />
        )}

        {currentPath === 'admin-create-loan-product' && (
          <CreateLoanProductView
            onNavigateHome={() => navigate('home')}
            onNavigateProducts={() => navigate('admin-products')}
            onNavigateLoanProducts={() => navigate('admin-loan-products')}
            onSaveProduct={(newProd) => {
              setLoanProducts(prev => [newProd, ...prev.filter(p => p.shortName !== newProd.shortName && p.id !== newProd.id)]);
            }}
          />
        )}

        {currentPath === 'admin-savings-products' && (
          <SavingsProductsView
            savingsProducts={savingsProducts}
            onNavigateHome={() => navigate('home')}
            onNavigateProducts={() => navigate('admin-products')}
            onNavigateCreateSavingsProduct={() => navigate('admin-create-savings-product')}
            onStartPractice={() => {
              setPracticeModule('casa-part-1');
              setPracticeActive(true);
            }}
            isPracticeActive={practiceActive}
          />
        )}

        {currentPath === 'admin-create-savings-product' && (
          <CreateSavingsProductView
            glAccounts={glAccounts}
            onSaveProduct={(newProduct) => {
              handleAddSavingsProduct(newProduct);
              navigate('admin-savings-products');
            }}
            onCancel={() => navigate('admin-savings-products')}
            onNavigateHome={() => navigate('home')}
            onNavigateProducts={() => navigate('admin-products')}
            onNavigateSavingsProducts={() => navigate('admin-savings-products')}
            onStartPractice={() => {
              setPracticeModule('casa-part-1');
              setPracticeActive(true);
            }}
            isPracticeActive={practiceActive}
          />
        )}

        {currentPath === 'admin-fixed-deposit-products' && (
          <FixedDepositProductsView
            fixedDepositProducts={fixedDepositProducts}
            onNavigateHome={() => navigate('home')}
            onNavigateProducts={() => navigate('admin-products')}
            onNavigateCreateFixedDepositProduct={() => navigate('admin-create-fixed-deposit-product')}
            onStartPractice={() => {
              setPracticeModule('saving-part-1');
              setPracticeActive(true);
            }}
            isPracticeActive={practiceActive}
          />
        )}

        {currentPath === 'admin-create-fixed-deposit-product' && (
          <CreateFixedDepositProductView
            onNavigateHome={() => navigate('home')}
            onNavigateProducts={() => navigate('admin-products')}
            onNavigateFixedDepositProducts={() => navigate('admin-fixed-deposit-products')}
            onSaveProduct={(newProd) => {
              setFixedDepositProducts(prev => [newProd, ...prev]);
              navigate('admin-fixed-deposit-products');
            }}
          />
        )}

        {currentPath === 'admin-recurring-deposit-products' && (
          <RecurringDepositProductsView
            recurringDepositProducts={recurringDepositProducts}
            onNavigateHome={() => navigate('home')}
            onNavigateProducts={() => navigate('admin-products')}
            onNavigateCreateRecurringDepositProduct={() => navigate('admin-create-recurring-deposit-product')}
            onStartPractice={() => {
              setPracticeModule('saving-part-3');
              setPracticeActive(true);
            }}
            isPracticeActive={practiceActive}
          />
        )}

        {currentPath === 'admin-create-recurring-deposit-product' && (
          <CreateRecurringDepositProductView
            onNavigateHome={() => navigate('home')}
            onNavigateProducts={() => navigate('admin-products')}
            onNavigateRecurringDepositProducts={() => navigate('admin-recurring-deposit-products')}
            onSaveProduct={(newProd) => {
              setRecurringDepositProducts(prev => [newProd, ...prev]);
              navigate('admin-recurring-deposit-products');
            }}
          />
        )}

        {currentPath === 'accounting' && (
          <AccountingView navigate={navigate} />
        )}

        {currentPath === 'accounting-coa' && (
          <ChartOfAccountsView
            glAccounts={glAccounts}
            onAddAccount={handleAddAccount}
            navigate={navigate}
          />
        )}

        {currentPath === 'accounting-activities' && (
          <FinancialActivityMappingsView
            activities={financialActivities}
            onSaveActivity={handleSaveFinancialActivity}
            glAccounts={glAccounts}
            navigate={navigate}
          />
        )}

        {currentPath === 'accounting-rules' && (
          <AccountingRulesView
            rules={accountingRules}
            navigate={navigate}
            onNavigateCreateRule={() => navigate('accounting-create-rule')}
          />
        )}

        {currentPath === 'accounting-create-rule' && (
          <CreateAccountingRuleView
            offices={offices}
            glAccounts={glAccounts}
            navigate={navigate}
            onAddRule={handleAddAccountingRule}
          />
        )}

        {currentPath === 'accounting-view-rule' && (
          <ViewAccountingRuleView
            rule={selectedAccountingRule || accountingRules[0]}
            navigate={navigate}
            onDeleteRule={(ruleId) => {
              setAccountingRules(prev => prev.filter(r => r.id !== ruleId));
            }}
          />
        )}

        {currentPath === 'accounting-closure' && (
          <AccountingRulesView
            rules={accountingRules}
            navigate={navigate}
          />
        )}

        {currentPath === 'accounting-journal' && (
          <JournalEntriesView
            offices={offices}
            glAccounts={glAccounts}
            hasOpeningBalanceSubmitted={hasOpeningBalanceSubmitted}
            customJournalEntries={customJournalEntries}
            navigate={navigate}
          />
        )}

        {currentPath === 'accounting-create-journal' && (
          <CreateJournalEntryView
            offices={offices}
            currencies={currencies}
            glAccounts={glAccounts}
            navigate={navigate}
            onAddJournalEntry={handleSaveJournalEntry}
          />
        )}

        {currentPath === 'accounting-frequent-postings' && (
          <FrequentPostingsView
            offices={offices}
            currencies={currencies}
            accountingRules={accountingRules}
            glAccounts={glAccounts}
            navigate={navigate}
            onAddJournalEntry={handleSaveJournalEntry}
          />
        )}

        {currentPath === 'accounting-view-transaction' && (
          <ViewTransactionView
            transaction={selectedTransaction}
            navigate={navigate}
          />
        )}

        {currentPath === 'accounting-opening-balances' && (
          <MigrateOpeningBalancesView
            offices={offices}
            currencies={currencies}
            glAccounts={glAccounts}
            financialActivities={financialActivities}
            navigate={navigate}
            onSubmitOpeningBalances={() => {
              setHasOpeningBalanceSubmitted(true);
              navigate('accounting');
            }}
          />
        )}

        {currentPath === 'clients' && (
          <ClientsView
            clients={clients}
            offices={offices}
            onAddClient={handleAddClient}
            onNavigateHome={() => navigate('home')}
            onNavigateCreateClient={() => navigate('create-client')}
            onSelectClient={(c) => {
              setSelectedClient(c);
              navigate('client-detail');
            }}
          />
        )}

        {currentPath === 'create-client' && (
          <CreateClientView
            offices={offices}
            users={users}
            onSaveClient={(newClient) => {
              const saved = handleAddClient(newClient);
              setSelectedClient(saved);
              navigate('client-detail');
            }}
            onCancel={() => navigate('clients')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
          />
        )}

        {currentPath === 'client-detail' && (
          <ClientDetailView
            client={selectedClient}
            loans={loans}
            savingsAccounts={savingsAccounts}
            onBack={() => navigate('clients')}
            onSelectLoan={(l) => {
              setSelectedLoan(l);
              navigate('loan-detail');
            }}
            onSelectSavings={(s) => {
              if (s.depositType === 'Recurring Deposit' || s.accountType === 'Recurring Deposit' || s.productName?.toLowerCase().includes('recurring') || s.productName?.toLowerCase().includes('goal')) {
                setSelectedRecurringDeposit(s);
                navigate('recurring-deposit-detail');
              } else if (s.accountType === 'Fixed Deposit' || s.productName?.toLowerCase().includes('fixed')) {
                setSelectedFixedDeposit(s);
                navigate('fixed-deposit-detail');
              } else {
                setSelectedSavings(s);
                navigate('savings-detail');
              }
            }}
            onOpenNewLoanModal={() => navigate('create-loan-account')}
            onOpenNewSavingsModal={() => navigate('create-savings-account')}
            onOpenNewFixedDeposit={() => navigate('create-fixed-deposit-account')}
            onOpenNewRecurringDeposit={() => navigate('create-recurring-deposit-account')}
            onSelectRecurringDeposit={(rd) => {
              setSelectedRecurringDeposit(rd);
              navigate('recurring-deposit-detail');
            }}
          />
        )}

        {currentPath === 'create-fixed-deposit-account' && (
          <CreateFixedDepositAccountView
            client={selectedClient}
            fixedDepositProducts={fixedDepositProducts}
            users={users}
            onSaveFixedDepositAccount={(newAcc) => {
              setSavingsAccounts(prev => [newAcc, ...prev.filter(s => s.accountNo !== newAcc.accountNo)]);
              setSelectedFixedDeposit(newAcc);
              navigate('fixed-deposit-detail');
            }}
            onCancel={() => navigate('client-detail')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
          />
        )}

        {currentPath === 'approve-fixed-deposit-account' && (
          <ApproveFixedDepositAccountView
            fixedDeposit={selectedFixedDeposit}
            client={selectedClient}
            onApprove={({ approvedOn, note }) => {
              const updated = {
                ...(selectedFixedDeposit || {}),
                status: 'Approved',
                approvedDate: approvedOn || '10/13/2026',
                note: note || '',
                balance: 0
              };
              setSelectedFixedDeposit(updated);
              setSavingsAccounts(prev => [updated, ...prev.filter(s => s.accountNo !== updated.accountNo)]);
              navigate('fixed-deposit-detail');
            }}
            onCancel={() => navigate('fixed-deposit-detail')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
          />
        )}

        {currentPath === 'fixed-deposit-detail' && (
          <FixedDepositDetailView
            fixedDeposit={selectedFixedDeposit}
            client={selectedClient}
            onBack={() => navigate('client-detail')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
            onNavigateApprove={() => navigate('approve-fixed-deposit-account')}
            onActivateFixedDeposit={(fdAcc) => {
              const target = fdAcc || selectedFixedDeposit || {};
              const updated = {
                ...target,
                status: 'Active',
                activatedOn: '13 October 2026',
                balance: target.principal || 1000000,
                totalDeposits: target.principal || 1000000,
                totalInterestEarned: 123
              };
              setSelectedFixedDeposit(updated);
              setSavingsAccounts(prev => [updated, ...prev.filter(s => s.accountNo !== updated.accountNo)]);
            }}
          />
        )}

        {currentPath === 'create-recurring-deposit-account' && (
          <CreateRecurringDepositAccountView
            client={selectedClient}
            recurringDepositProducts={recurringDepositProducts}
            users={users}
            onSave={(newAcc) => {
              setSavingsAccounts(prev => [newAcc, ...prev.filter(s => s.accountNo !== newAcc.accountNo)]);
              setSelectedRecurringDeposit(newAcc);
              navigate('recurring-deposit-detail');
            }}
            onSaveRecurringDepositAccount={(newAcc) => {
              setSavingsAccounts(prev => [newAcc, ...prev.filter(s => s.accountNo !== newAcc.accountNo)]);
              setSelectedRecurringDeposit(newAcc);
              navigate('recurring-deposit-detail');
            }}
            onCancel={() => navigate('client-detail')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
          />
        )}

        {currentPath === 'approve-recurring-deposit-account' && (
          <ApproveRecurringDepositAccountView
            recurringDeposit={selectedRecurringDeposit}
            client={selectedClient}
            onApprove={({ approvedOn, note }) => {
              const updated = {
                ...(selectedRecurringDeposit || {}),
                status: 'Approved',
                approvedDate: approvedOn || '10/13/2026',
                note: note || '',
                balance: 0
              };
              setSelectedRecurringDeposit(updated);
              setSavingsAccounts(prev => [updated, ...prev.filter(s => s.accountNo !== updated.accountNo)]);
              navigate('recurring-deposit-detail');
            }}
            onCancel={() => navigate('recurring-deposit-detail')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
          />
        )}

        {currentPath === 'recurring-deposit-detail' && (
          <RecurringDepositDetailView
            recurringDeposit={selectedRecurringDeposit}
            client={selectedClient}
            onBack={() => navigate('client-detail')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
            onNavigateApprove={() => navigate('approve-recurring-deposit-account')}
            onNavigateDeposit={() => navigate('deposit-recurring-deposit-account')}
            onActivateRecurringDeposit={(rdAcc) => {
              const target = rdAcc || selectedRecurringDeposit || {};
              const updated = {
                ...target,
                status: 'Active',
                activatedOn: '13 October 2026',
                balance: 0,
                hasDeposited: false,
                depositsTillDate: 0,
                interestEarned: 0,
                totalDeposits: 0
              };
              setSelectedRecurringDeposit(updated);
              setSavingsAccounts(prev => [updated, ...prev.filter(s => s.accountNo !== updated.accountNo)]);
            }}
          />
        )}

        {currentPath === 'deposit-recurring-deposit-account' && (
          <DepositRecurringDepositAccountView
            recurringDeposit={selectedRecurringDeposit}
            client={selectedClient}
            onSubmitDeposit={({ transactionDate, transactionAmount, paymentType, note }) => {
              const numAmount = typeof transactionAmount === 'string'
                ? parseFloat(transactionAmount.replace(/,/g, ''))
                : (Number(transactionAmount) || 500000);
              const updated = {
                ...(selectedRecurringDeposit || {}),
                balance: numAmount,
                totalDeposits: numAmount,
                depositsTillDate: numAmount,
                interestEarned: 55,
                hasDeposited: true,
                transactions: [
                  {
                    id: 1,
                    date: transactionDate || '13 October 2026',
                    transactionType: 'Deposit',
                    amount: numAmount,
                    balance: numAmount
                  }
                ]
              };
              setSelectedRecurringDeposit(updated);
              setSavingsAccounts(prev => [updated, ...prev.filter(s => s.accountNo !== updated.accountNo)]);

              // Automatically record accounting Journal Entry for Recurring Deposit (110201 Settlement Bank Account / 210104 Recurring Deposits)
              const journalEntry = {
                id: 'RD-DEP-001',
                referenceNumber: 'RD4',
                txDate: '13 October 2026',
                submittedDate: '13 October 2026 00:00:00',
                office: 'Thu Duc Transaction Office',
                currency: 'VND',
                comments: 'Deposit transaction for Recurring Deposit 000000004 (Lan Ngoc Pham)',
                entryType: 'RECURRING_DEPOSIT',
                debits: [
                  {
                    glCode: '110201',
                    name: 'Settlement Bank Account',
                    type: 'ASSET',
                    amount: numAmount
                  }
                ],
                credits: [
                  {
                    glCode: '210104',
                    name: 'Recurring Deposits',
                    type: 'LIABILITY',
                    amount: numAmount
                  }
                ]
              };
              setCustomJournalEntries(prev => [journalEntry, ...prev.filter(e => e.id !== 'RD-DEP-001')]);

              navigate('recurring-deposit-detail');
            }}
            onCancel={() => navigate('recurring-deposit-detail')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
          />
        )}

        {currentPath === 'create-savings-account' && (
          <CreateSavingsAccountView
            client={selectedClient}
            savingsProducts={savingsProducts}
            users={users}
            onSaveSavingsAccount={handleAddSavingsAccountForClient}
            onCancel={() => navigate('client-detail')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
          />
        )}

        {currentPath === 'create-loan-account' && (
          <CreateLoanAccountView
            client={selectedClient}
            loanProducts={loanProducts}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
            onSubmitLoanAccount={(newAccount) => {
              setLoans(prev => [newAccount, ...prev.filter(l => l.accountNo !== newAccount.accountNo)]);
              setSelectedLoan(newAccount);
              navigate('client-detail');
            }}
          />
        )}

        {currentPath === 'loan-detail' && (
          <LoanDetailView
            loan={selectedLoan}
            onBack={() => navigate('client-detail')}
            onMakeRepayment={handleMakeRepayment}
          />
        )}

        {currentPath === 'savings-detail' && (
          <SavingsDetailView
            savings={selectedSavings}
            initialTab={(selectedSavings?.transactions?.some(t => t.type === 'TRANSFER_FROM' || t.transactionType?.toLowerCase().includes('transfer from') || t.type === 'WITHDRAWAL' || t.transactionType === 'Withdrawal')) ? 'transactions' : 'general'}
            onBack={() => navigate('client-detail')}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateDeposit={() => navigate('savings-deposit')}
            onNavigateWithdraw={() => navigate('savings-withdraw')}
            onNavigateTransfer={() => navigate('account-transfer')}
          />
        )}

        {currentPath === 'savings-deposit' && (
          <DepositSavingsAccountView
            savings={selectedSavings}
            onCancel={() => navigate('savings-detail')}
            onSubmitDeposit={handleDeposit}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
          />
        )}

        {currentPath === 'savings-withdraw' && (
          <WithdrawSavingsAccountView
            savings={selectedSavings}
            client={selectedClient}
            onCancel={() => navigate('savings-detail')}
            onSubmitWithdraw={handleWithdraw}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
            onNavigateSavingsDetail={() => navigate('savings-detail')}
          />
        )}

        {currentPath === 'account-transfer' && (
          <AccountTransferView
            fromSavings={selectedSavings}
            fromClient={selectedClient}
            toClient={clients.find(c => c.displayName?.includes('Lan Ngoc') || c.accountNo === '000000012')}
            toSavings={savingsAccounts.find(s => s.accountNo === '000000002')}
            onCancel={() => navigate('savings-detail')}
            onSubmitTransfer={handleAccountTransfer}
            onNavigateHome={() => navigate('home')}
            onNavigateClients={() => navigate('clients')}
            onNavigateClientDetail={() => navigate('client-detail')}
            onNavigateSavingsDetail={() => navigate('savings-detail')}
          />
        )}
          </main>
        </div>
      </div>

      {/* User Switcher Modal (Maker - Checker Simulator) */}
      <UserSwitcherModal
        isOpen={userSwitcherOpen}
        onClose={() => setUserSwitcherOpen(false)}
        users={users}
        currentUser={currentUser}
        onSelectUser={(u) => setCurrentUser(u)}
      />

      {/* Edu Guide Drawer (Sổ tay hướng dẫn) */}
      <EduGuideDrawer
        isOpen={eduGuideOpen}
        onClose={() => setEduGuideOpen(false)}
        navigate={(path) => {
          navigate(path);
        }}
        roles={roles}
        users={users}
        offices={offices}
        currencies={currencies}
        glAccounts={glAccounts}
        onResetCurrencies={() => {
          setCurrencies([]);
        }}
        onResetGlHeaders={() => {
          const rootCodes = ['100000', '200000', '300000', '400000', '500000'];
          setGlAccounts(prev => prev.filter(a => !rootCodes.includes(a.glCode)));
        }}
        onResetGlLevel2={() => {
          const level2Codes = ['110000', '120000', '130000', '210000', '220000', '310000', '410000', '420000', '510000', '520000', '530000'];
          setGlAccounts(prev => prev.filter(a => !level2Codes.includes(a.glCode)));
        }}
        onResetGlDetails={() => {
          setGlAccounts(prev => prev.filter(a => (a.usage || '').toLowerCase() !== 'detail'));
        }}
        financialActivities={financialActivities}
        onResetFinancialActivities={() => {
          setFinancialActivities([]);
        }}
        onStartPractice={(mod) => {
          setEduGuideOpen(false);
          const targetModule = mod || 'gl-part-2';
          setPracticeModule(targetModule);
          if (targetModule === 'gl-part-1') {
            setCurrencies([]);
            setCurrentPath('home');
          }
          if (targetModule === 'gl-part-2') {
            const rootCodes = ['100000', '200000', '300000', '400000', '500000'];
            setGlAccounts(prev => prev.filter(a => !rootCodes.includes(a.glCode)));
            setCurrentPath('home');
          }
          if (targetModule === 'gl-part-3') {
            // Ensure 5 root headers exist
            const missingRoots = ROOT_GL_HEADERS_SAMPLES.filter(r => !glAccounts.some(a => a.glCode === r.glCode)).map(r => ({
              id: r.step === 1 ? "1" : r.step === 2 ? "2" : r.step === 3 ? "3" : r.step === 4 ? "4" : "5",
              glCode: r.glCode,
              name: r.name,
              typeId: String(r.step),
              typeName: r.type === 'ASSET' ? 'Asset' : r.type === 'LIABILITY' ? 'Liability' : r.type === 'EQUITY' ? 'Equity' : r.type === 'INCOME' ? 'Income' : 'Expense',
              usage: 'Header',
              manualEntriesAllowed: false,
              parentId: null,
              description: r.description
            }));

            const level2Codes = ['110000', '120000', '130000', '210000', '220000', '310000', '410000', '420000', '510000', '520000', '530000'];
            setGlAccounts(prev => [...missingRoots, ...prev.filter(a => !level2Codes.includes(a.glCode))]);
            setCurrentPath('home');
          }
          if (targetModule === 'gl-part-4') {
            // Ensure 5 root headers exist
            const missingRoots = ROOT_GL_HEADERS_SAMPLES.filter(r => !glAccounts.some(a => a.glCode === r.glCode)).map(r => ({
              id: r.step === 1 ? "1" : r.step === 2 ? "2" : r.step === 3 ? "3" : r.step === 4 ? "4" : "5",
              glCode: r.glCode,
              name: r.name,
              typeId: String(r.step),
              typeName: r.type === 'ASSET' ? 'Asset' : r.type === 'LIABILITY' ? 'Liability' : r.type === 'EQUITY' ? 'Equity' : r.type === 'INCOME' ? 'Income' : 'Expense',
              usage: 'Header',
              manualEntriesAllowed: false,
              parentId: null,
              description: r.description
            }));

            // Ensure 11 level 2 headers exist
            const existingLevel2Codes = new Set(glAccounts.map(a => a.glCode));
            const missingLevel2 = FULL_GL_LEVEL_2_ACCOUNTS.filter(a => !existingLevel2Codes.has(a.glCode));

            // Reset detail accounts
            setGlAccounts(prev => [
              ...missingRoots,
              ...missingLevel2,
              ...prev.filter(a => (a.usage || '').toLowerCase() !== 'detail')
            ]);
            setCurrentPath('home');
          }
          if (targetModule === 'gl-part-5') {
            setFinancialActivities([]);
            const requiredCodes = ['310199', '110101', '110102', '110201', '130101', '220201'];
            const existingCodes = new Set(glAccounts.map(a => a.glCode));
            const missingAccounts = INITIAL_GL_ACCOUNTS.filter(a => requiredCodes.includes(a.glCode) && !existingCodes.has(a.glCode));
            if (missingAccounts.length > 0) {
              setGlAccounts(prev => [...missingAccounts, ...prev]);
            }
            setCurrentPath('home');
          }
          if (targetModule === 'gl-part-6') {
            setContraAccountConfigEnabled(false);
            setHasOpeningBalanceSubmitted(false);
            setCurrentPath('home');
          }
          if (targetModule === 'gl-part-7') {
            setCustomJournalEntries([]);
            setCurrentPath('home');
          }
          if (targetModule === 'gl-part-8') {
            setAccountingRules([]);
            setCurrentPath('home');
          }
          if (targetModule === 'part-1') {
            if (roles.length >= 16) {
              setCurrentPath('admin-roles');
            } else {
              setCurrentPath('home');
            }
          }
          if (targetModule === 'role-permissions') {
            setCurrentPath('admin-roles');
          }
          if (targetModule === 'gl-part-9') {
            setCustomJournalEntries(prev => prev.filter(e => e.entryType !== 'FREQUENT_POSTING' && e.id !== 'a2f68debe1a7'));
            setCurrentPath('home');
          }
          if (targetModule === 'saving-part-1') {
            setCurrentPath('admin-products');
          }
          if (targetModule === 'saving-part-3') {
            setCurrentPath('admin-products');
          }
          if (targetModule === 'saving-part-2') {
            if (!fixedDepositProducts.some(p => p.shortName === 'TKFD')) {
              setFixedDepositProducts(prev => [
                {
                  id: '1',
                  name: 'TKB Fixed Deposit',
                  shortName: 'TKFD',
                  description: 'A VND fixed term deposit product offered by Takashimaya Bank, supporting 3, 6, and 12-month deposit terms with tiered annual interest rates.',
                  currency: 'Vietnamese Dong',
                  digitsAfterDecimal: 0,
                  inMultiplesOf: 1,
                  minDepositAmount: 1000000,
                  defaultDepositAmount: 10000000,
                  maxDepositAmount: 1000000000,
                  compoundingPeriod: 'Monthly',
                  postingPeriod: 'Monthly',
                  interestCalculationType: 'Daily Balance',
                  daysInYear: '365 Days',
                  minDepositTermFrequency: 3,
                  minDepositTermType: 'Months',
                  maxDepositTermFrequency: 12,
                  maxDepositTermType: 'Months'
                },
                ...prev
              ]);
            }
            let targetClientMinh = clients.find(c => c.id === '11' || c.accountNo === '000000011' || c.displayName?.includes('Minh Quang Tran'));
            if (!targetClientMinh) {
              targetClientMinh = {
                id: '11',
                accountNo: '000000011',
                displayName: 'Minh Quang Tran',
                officeName: 'Thu Duc Transaction Office',
                staffName: 'Dang, Quan',
                status: 'Active',
                activationDate: '2026-10-13',
                externalId: 'TKB-CIF-TDU-001',
                mobileNo: '0955738216',
                emailAddress: 'quang2004@gmail.com'
              };
              setClients(prev => [targetClientMinh, ...prev.filter(c => c.id !== '11')]);
            }
            setSelectedClient(targetClientMinh);
            setSavingsAccounts(prev => prev.filter(s => s.accountNo !== '000000003'));
            setCurrentPath('clients');
          }
          if (targetModule === 'saving-part-4') {
            if (!recurringDepositProducts.some(p => p.shortName === 'TKGS')) {
              setRecurringDepositProducts(prev => [
                {
                  id: '1',
                  name: 'TKB Goal Savings',
                  shortName: 'TKGS',
                  description: 'A recurring deposit product designed for target-based savings in VND with tiered interest rates.',
                  currency: 'Vietnamese Dong',
                  digitsAfterDecimal: 0,
                  inMultiplesOf: 1,
                  minDepositAmount: 500000,
                  defaultDepositAmount: 500000,
                  compoundingPeriod: 'Monthly',
                  postingPeriod: 'Monthly',
                  interestCalculationType: 'Daily Balance',
                  daysInYear: '365 Days',
                  minDepositTermFrequency: 1,
                  minDepositTermType: 'Months',
                  maxDepositTermFrequency: 60,
                  maxDepositTermType: 'Months'
                },
                ...prev
              ]);
            }
            let targetClientLan = clients.find(c => c.id === '12' || c.accountNo === '000000012' || c.displayName?.includes('Lan Ngoc Pham'));
            if (!targetClientLan) {
              targetClientLan = {
                id: '12',
                accountNo: '000000012',
                displayName: 'Lan Ngoc Pham',
                officeName: 'Thu Duc Transaction Office',
                staffName: 'Dang, Quan',
                status: 'Active',
                activationDate: '2026-10-13',
                externalId: 'TKB-CIF-TDU-002',
                mobileNo: '0912345678',
                emailAddress: 'lan.pham@gmail.com',
                dateOfBirth: '1998-08-15'
              };
              setClients(prev => [targetClientLan, ...prev.filter(c => c.id !== '12')]);
            }
            setSelectedClient(targetClientLan);
            setSavingsAccounts(prev => prev.filter(s => s.accountNo !== '000000004'));
            setCurrentPath('clients');
          }
          if (targetModule === 'casa-part-1') {
            if (currentPath !== 'admin-create-savings-product') {
              setCurrentPath('admin-savings-products');
            }
          }
          if (targetModule === 'casa-part-2') {
            setCurrentPath('clients');
          }
          if (targetModule === 'casa-part-3') {
            const targetClient = clients.find(c => c.id === '11' || c.displayName?.includes('Minh Quang Tran')) || clients[0];
            if (targetClient) setSelectedClient(targetClient);
            const targetSavings = savingsAccounts.find(s => s.accountNo === '000000001' || s.clientId === '11');
            if (targetSavings) setSelectedSavings(targetSavings);
            setCurrentPath('clients');
          }
          if (targetModule === 'casa-part-5') {
            let targetClientMinh = clients.find(c => c.id === '11' || c.accountNo === '000000011' || c.displayName?.includes('Minh Quang Tran'));
            if (!targetClientMinh) {
              targetClientMinh = {
                id: '11',
                accountNo: '000000011',
                displayName: 'Minh Quang Tran',
                officeName: 'Thu Duc Transaction Office',
                staffName: 'Dang, Quan',
                status: 'Active',
                activationDate: '2026-10-13',
                externalId: 'TKB-CIF-TDU-001',
                mobileNo: '0955738216',
                emailAddress: 'quang2004@gmail.com',
                dateOfBirth: '2000-04-06'
              };
            }

            let targetClientLan = clients.find(c => c.id === '12' || c.accountNo === '000000012' || c.displayName?.includes('Lan Ngoc Pham'));
            if (!targetClientLan) {
              targetClientLan = {
                id: '12',
                accountNo: '000000012',
                displayName: 'Lan Ngoc Pham',
                officeName: 'Thu Duc Transaction Office',
                staffName: 'Dang, Quan',
                status: 'Active',
                activationDate: '2026-10-13',
                externalId: 'TKB-CIF-TDU-002',
                mobileNo: '0912345678',
                emailAddress: 'lan.pham@gmail.com',
                dateOfBirth: '1998-08-15'
              };
            }

            setClients(prev => {
              const withoutBoth = prev.filter(c => c.id !== '11' && c.id !== '12' && c.accountNo !== '000000011' && c.accountNo !== '000000012');
              return [targetClientMinh, targetClientLan, ...withoutBoth];
            });

            const seededSavingsMinh = {
              id: '1',
              clientId: '11',
              clientName: 'Minh Quang Tran',
              accountNo: '000000001',
              productName: 'TKB Current Account',
              shortName: 'TKCA',
              status: 'Active',
              balance: 3000000,
              lastActive: '2026-10-13',
              openedDate: '2026-10-13',
              transactions: [
                {
                  id: '2',
                  date: '2026-10-13',
                  transactionDate: '2026-10-13',
                  type: 'WITHDRAWAL',
                  transactionType: 'Withdrawal',
                  amount: 2000000,
                  debit: 2000000,
                  credit: null,
                  balanceAfter: 3000000,
                  paymentType: 'Money Transfer',
                  desc: 'CASA withdrawal via bank transfer. TKB-CASA-WD-001.'
                },
                {
                  id: '1',
                  date: '2026-10-13',
                  transactionDate: '2026-10-13',
                  type: 'DEPOSIT',
                  transactionType: 'Deposit',
                  amount: 5000000,
                  credit: 5000000,
                  debit: null,
                  balanceAfter: 5000000,
                  paymentType: 'Money Transfer',
                  desc: 'Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001.'
                }
              ]
            };

            const seededSavingsLan = {
              id: '2',
              clientId: '12',
              clientName: 'Lan Ngoc Pham',
              accountNo: '000000002',
              productName: 'TKB Current Account',
              shortName: 'TKCA',
              status: 'Active',
              balance: 0,
              lastActive: '2026-10-13',
              openedDate: '2026-10-13',
              transactions: []
            };

            setSavingsAccounts(prev => {
              const filtered = prev.filter(s => s.accountNo !== '000000001' && s.accountNo !== '000000002');
              return [seededSavingsMinh, seededSavingsLan, ...filtered];
            });

            setSelectedClient(targetClientMinh);
            setSelectedSavings(seededSavingsMinh);
            setCurrentPath('clients');
          }
          if (targetModule === 'casa-part-4') {
            let targetClient = clients.find(c => c.id === '11' || c.accountNo === '000000011' || c.displayName?.includes('Minh Quang Tran'));
            if (!targetClient) {
              targetClient = {
                id: '11',
                accountNo: '000000011',
                displayName: 'Minh Quang Tran',
                officeName: 'Thu Duc Transaction Office',
                staffName: 'Dang, Quan',
                status: 'Active',
                activationDate: '2026-10-13',
                externalId: 'TKB-CIF-TDU-001',
                mobileNo: '0955738216',
                emailAddress: 'quang2004@gmail.com',
                dateOfBirth: '2000-04-06'
              };
              setClients(prev => [targetClient, ...prev]);
            }
            setSelectedClient(targetClient);

            let targetSavings = savingsAccounts.find(s => s.accountNo === '000000001');
            const seededSavings = {
              id: targetSavings ? targetSavings.id : '1',
              clientId: '11',
              clientName: 'Minh Quang Tran',
              accountNo: '000000001',
              productName: 'TKB Current Account',
              shortName: 'TKCA',
              status: 'Active',
              balance: 5000000,
              lastActive: '2026-10-13',
              openedDate: '2026-10-13',
              transactions: [
                {
                  id: '1',
                  date: '2026-10-13',
                  transactionDate: '2026-10-13',
                  type: 'DEPOSIT',
                  transactionType: 'Deposit',
                  amount: 5000000,
                  credit: 5000000,
                  debit: null,
                  balanceAfter: 5000000,
                  paymentType: 'Money Transfer',
                  desc: 'Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001.'
                }
              ]
            };
            setSavingsAccounts(prev => {
              const filtered = prev.filter(s => s.accountNo !== '000000001');
              return [seededSavings, ...filtered];
            });
            setSelectedSavings(seededSavings);
            setCurrentPath('clients');
          }
          if (targetModule === 'loan-part-1') {
            setCurrentPath('home');
          }
          if (targetModule === 'loan-part-2') {
            const client11 = clients.find(c => String(c.id) === '11' || c.externalId === 'TKB-CIF-TDU-001') || INITIAL_CLIENTS[10] || INITIAL_CLIENTS[0];
            setSelectedClient(client11);
            setLoans(prev => prev.filter(l => String(l.clientId) !== '11' && l.externalId !== 'TKB-PL-TDU-001'));
            if (typeof window !== 'undefined') {
              delete window.__tkbLoanFixInstalled;
            }
            setCurrentPath('client-detail');
          }
          setPracticeActive(true);
        }}
        loanProducts={loanProducts}
        loans={loans}
        savingsProducts={savingsProducts}
        fixedDepositProducts={fixedDepositProducts}
        recurringDepositProducts={recurringDepositProducts}
        clients={clients}
        savingsAccounts={savingsAccounts}
        hasCheckedRdJournal={hasCheckedRdJournal}
        onResetLoanProducts={() => {
          setLoanProducts(prev => prev.filter(p => p.shortName !== 'Loan' && p.shortName !== 'TKPL' && p.externalId !== 'TKB-PRD-PL-001' && p.name !== 'TKB Personal Loan'));
        }}
        onResetLoanAccounts={() => {
          setLoans(prev => prev.filter(l => String(l.clientId) !== '11' && l.externalId !== 'TKB-PL-TDU-001'));
          if (typeof window !== 'undefined') {
            delete window.__tkbLoanFixInstalled;
          }
        }}
        onResetSavingsProducts={() => {
          setSavingsProducts(prev => prev.filter(p => p.shortName !== 'TKCA'));
        }}
        onResetFixedDepositProducts={() => {
          setFixedDepositProducts(prev => prev.filter(p => p.shortName !== 'TKFD'));
        }}
        onResetRecurringDepositProducts={() => {
          setRecurringDepositProducts(prev => prev.filter(p => p.shortName !== 'TKGS'));
        }}
        onResetFixedDepositAccounts={() => {
          setSavingsAccounts(prev => prev.filter(s => s.accountNo !== '000000003'));
        }}
        onResetRecurringDepositAccounts={() => {
          setSavingsAccounts(prev => prev.filter(s => s.accountNo !== '000000004'));
          setSelectedRecurringDeposit(null);
          setHasCheckedRdJournal(false);
          setCustomJournalEntries(prev => prev.filter(e => e.id !== 'RD-DEP-001'));
        }}
        onResetClients={() => {
          setClients(prev => prev.filter(c => c.id !== '11' && c.id !== '12' && c.externalId !== 'TKB-CIF-TDU-001' && c.externalId !== 'TKB-CIF-TDU-002' && !c.displayName?.toLowerCase().includes('minh quang tran') && !c.displayName?.toLowerCase().includes('lan ngoc pham')));
          setSavingsAccounts(prev => prev.filter(s => s.clientId !== '11' && s.clientId !== '12' && s.accountNo !== '000000001' && s.accountNo !== '000000002'));
        }}
        onResetSavingsAccounts={() => {
          setSavingsAccounts(prev => prev.map(s => {
            if (s.accountNo === '000000001') {
              return {
                ...s,
                balance: null,
                lastActive: '2026-10-13',
                transactions: []
              };
            }
            return s;
          }));
        }}
        onResetSavingsForTransfer={handleResetSavingsForTransfer}
        onResetSavingsForWithdraw={() => {
          setSavingsAccounts(prev => prev.map(s => {
            if (s.accountNo === '000000001') {
              return {
                ...s,
                balance: 5000000,
                lastActive: '2026-10-13',
                transactions: [
                  {
                    id: '1',
                    date: '2026-10-13',
                    transactionDate: '2026-10-13',
                    type: 'DEPOSIT',
                    transactionType: 'Deposit',
                    amount: 5000000,
                    credit: 5000000,
                    debit: null,
                    balanceAfter: 5000000,
                    paymentType: 'Money Transfer',
                    desc: 'Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001.'
                  }
                ]
              };
            }
            return s;
          }));
        }}
        contraAccountConfigEnabled={contraAccountConfigEnabled}
        hasOpeningBalanceSubmitted={hasOpeningBalanceSubmitted}
        onResetOpeningBalances={() => {
          setContraAccountConfigEnabled(false);
          setHasOpeningBalanceSubmitted(false);
        }}
        customJournalEntries={customJournalEntries}
        onResetManualJournal={() => {
          setCustomJournalEntries([]);
        }}
        accountingRules={accountingRules}
        onResetAccountingRules={() => {
          setAccountingRules([]);
        }}
        onResetFrequentPostings={() => {
          setCustomJournalEntries(prev => prev.filter(e => e.entryType !== 'FREQUENT_POSTING' && e.id !== 'a2f68debe1a7'));
        }}
        onResetRolePermissions={() => {
          setRolePermissions({ ...INITIAL_ROLE_PERMISSIONS });
        }}
      />

      {/* Interactive Guided Practice Spotlight Tour */}
      <PracticeSpotlightTour
        isActive={practiceActive}
        onClose={() => setPracticeActive(false)}
        currentPath={currentPath}
        module={practiceModule}
        roles={roles}
        users={users}
        offices={offices}
        currencies={currencies}
        glAccounts={glAccounts}
        loanProducts={loanProducts}
        loans={loans}
        savingsProducts={savingsProducts}
        fixedDepositProducts={fixedDepositProducts}
        recurringDepositProducts={recurringDepositProducts}
        clients={clients}
        savingsAccounts={savingsAccounts}
        onSelectClient={(client) => setSelectedClient(client)}
        onSelectSavings={(savings) => setSelectedSavings(savings)}
        onAddSavingsProduct={handleAddSavingsProduct}
        financialActivities={financialActivities}
        accountingRules={accountingRules}
        contraAccountConfigEnabled={contraAccountConfigEnabled}
        onToggleContraAccount={(val) => setContraAccountConfigEnabled(val)}
        hasOpeningBalanceSubmitted={hasOpeningBalanceSubmitted}
        onSubmitOpeningBalances={() => setHasOpeningBalanceSubmitted(true)}
        customJournalEntries={customJournalEntries}
        hasCheckedRdJournal={hasCheckedRdJournal}
        navigate={navigate}
        onLoadAllRoles={() => {
          setRoles([...FULL_BACKUP_ROLES]);
        }}
        onLoadAllUsers={() => {
          setUsers([...FULL_BACKUP_USERS]);
        }}
        onLoadAllOffices={() => {
          setOffices([...FULL_BACKUP_OFFICES]);
        }}
        onLoadRegionalOffices={() => {
          setOffices(prev => {
            const existingIds = new Set(prev.map(o => o.id));
            const newToAdd = REGIONAL_OFFICES_SAMPLE.filter(r => !existingIds.has(r.id));
            return [...prev, ...newToAdd];
          });
        }}
        onLoadAllCurrencies={() => {
          setCurrencies([...INITIAL_CONFIGURED_CURRENCIES]);
        }}
        onLoadAllGlLevel2={() => {
          setGlAccounts(prev => {
            const rootAsset = prev.find(a => a.glCode === '100000');
            const rootLiability = prev.find(a => a.glCode === '200000');
            const rootEquity = prev.find(a => a.glCode === '300000');
            const rootIncome = prev.find(a => a.glCode === '400000');
            const rootExpense = prev.find(a => a.glCode === '500000');

            const existingCodes = new Set(prev.map(a => a.glCode));
            const newItems = FULL_GL_LEVEL_2_ACCOUNTS.filter(a => !existingCodes.has(a.glCode)).map(item => {
              let parentId = item.parentId;
              if (item.typeName === 'Asset' && rootAsset) parentId = rootAsset.id;
              if (item.typeName === 'Liability' && rootLiability) parentId = rootLiability.id;
              if (item.typeName === 'Equity' && rootEquity) parentId = rootEquity.id;
              if (item.typeName === 'Income' && rootIncome) parentId = rootIncome.id;
              if (item.typeName === 'Expense' && rootExpense) parentId = rootExpense.id;
              return { ...item, parentId };
            });
            return [...newItems, ...prev];
          });
        }}
        onLoadAllGlDetails={() => {
          setGlAccounts(prev => {
            const detailAccounts = INITIAL_GL_ACCOUNTS.filter(a => (a.usage || '').toLowerCase() === 'detail');
            const existingCodes = new Set(prev.map(a => a.glCode));
            const newDetails = detailAccounts.filter(a => !existingCodes.has(a.glCode)).map(d => {
              const initialParent = INITIAL_GL_ACCOUNTS.find(p => p.id === d.parentId);
              if (initialParent) {
                const actualParent = prev.find(a => a.glCode === initialParent.glCode);
                if (actualParent) {
                  return { ...d, parentId: actualParent.id };
                }
              }
              return d;
            });
            return [...newDetails, ...prev];
          });
        }}
        onLoadAllFinancialActivities={() => {
          setFinancialActivities([...INITIAL_FINANCIAL_ACTIVITIES]);
        }}
        onLoadAllRolePermissions={handleLoadAllRolePermissions}
      />
    </div>
  );
}
