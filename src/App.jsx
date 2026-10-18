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
import ChartOfAccountsView from './views/ChartOfAccountsView';
import AccountingRulesView from './views/AccountingRulesView';
import JournalEntriesView from './views/JournalEntriesView';
import LoanProductsView from './views/LoanProductsView';
import SavingsProductsView from './views/SavingsProductsView';
import ClientsView from './views/ClientsView';
import CreateClientView from './views/CreateClientView';
import CreateUserView from './views/CreateUserView';
import UserDetailView from './views/UserDetailView';
import ClientDetailView from './views/ClientDetailView';
import LoanDetailView from './views/LoanDetailView';
import SavingsDetailView from './views/SavingsDetailView';

// Authentic Dataset
import {
  INITIAL_BANK_INFO,
  INITIAL_OFFICES,
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
  INITIAL_SAVINGS_ACCOUNTS
} from './data/mifosData';

export default function App() {
  // Application State
  const [bankInfo] = useState(INITIAL_BANK_INFO);
  const [offices, setOffices] = useState(INITIAL_OFFICES);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [glAccounts, setGlAccounts] = useState(INITIAL_GL_ACCOUNTS);
  const [loanProducts, setLoanProducts] = useState(INITIAL_LOAN_PRODUCTS);
  const [savingsProducts, setSavingsProducts] = useState(INITIAL_SAVINGS_PRODUCTS);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [tellers, setTellers] = useState(INITIAL_TELLERS);
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [savingsAccounts, setSavingsAccounts] = useState(INITIAL_SAVINGS_ACCOUNTS);

  // Navigation & UI state
  const [currentPath, setCurrentPath] = useState('home');
  const [selectedClient, setSelectedClient] = useState(INITIAL_CLIENTS[10] || INITIAL_CLIENTS[0]); // Minh Quang Tran
  const [selectedLoan, setSelectedLoan] = useState(INITIAL_LOANS[0] || null);
  const [selectedSavings, setSelectedSavings] = useState(INITIAL_SAVINGS_ACCOUNTS[0] || null);
  const [selectedUser, setSelectedUser] = useState(null);

  // User & Edu guide modal
  const [currentUser, setCurrentUser] = useState(SYSTEM_ADMIN);
  const [userSwitcherOpen, setUserSwitcherOpen] = useState(false);
  const [eduGuideOpen, setEduGuideOpen] = useState(false);
  const [practiceActive, setPracticeActive] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Router navigation helper
  const navigate = (path, params = {}) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State mutators
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

  const handleAddAccount = (newAccount) => {
    setGlAccounts(prev => [newAccount, ...prev]);
  };

  const handleAddLoanProduct = (newProduct) => {
    setLoanProducts(prev => [newProduct, ...prev]);
  };

  const handleAddClient = (newClient) => {
    const nextAccountNo = String(clients.length + 1).padStart(9, '0');
    const clientWithAccount = {
      ...newClient,
      accountNo: newClient.accountNo || nextAccountNo
    };
    setClients(prev => [clientWithAccount, ...prev]);
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

  const handleDeposit = (savingsId, amount) => {
    setSavingsAccounts(prev => prev.map(s => {
      if (s.id === savingsId) {
        return {
          ...s,
          balance: s.balance + amount
        };
      }
      return s;
    }));
  };

  const handleWithdraw = (savingsId, amount) => {
    setSavingsAccounts(prev => prev.map(s => {
      if (s.id === savingsId) {
        return {
          ...s,
          balance: Math.max(0, s.balance - amount)
        };
      }
      return s;
    }));
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
      case 'admin-add-role':
        return [{ label: 'Admin', path: 'admin' }, { label: 'System', path: 'admin-system' }, { label: 'Roles and Permissions', path: 'admin-roles' }, { label: 'Add' }];
      case 'admin-loan-products':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Products', path: 'admin' }, { label: 'Loan Products' }];
      case 'admin-savings-products':
        return [{ label: 'Admin', path: 'admin' }, { label: 'Products', path: 'admin' }, { label: 'Savings Products' }];
      case 'accounting-coa':
        return [{ label: 'Accounting', path: 'accounting-coa' }, { label: 'Chart of Accounts' }];
      case 'accounting-activities':
        return [{ label: 'Accounting', path: 'accounting-coa' }, { label: 'Financial Activity Mappings' }];
      case 'accounting-rules':
        return [{ label: 'Accounting', path: 'accounting-coa' }, { label: 'Accounting Rules' }];
      case 'accounting-closure':
        return [{ label: 'Accounting', path: 'accounting-coa' }, { label: 'Closing Entries' }];
      case 'accounting-journal':
        return [{ label: 'Accounting', path: 'accounting-coa' }, { label: 'Search Journal Entries' }];
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
          {currentPath !== 'home' && currentPath !== 'clients' && currentPath !== 'create-client' && currentPath !== 'admin-users' && currentPath !== 'admin-create-user' && currentPath !== 'admin-user-detail' && currentPath !== 'admin-organization' && currentPath !== 'admin-system' && currentPath !== 'admin-roles' && currentPath !== 'admin-add-role' && (
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

        {currentPath === 'admin-add-role' && (
          <AddRoleView
            onAddRole={handleAddRole}
            navigate={navigate}
          />
        )}

        {currentPath === 'admin-loan-products' && (
          <LoanProductsView
            loanProducts={loanProducts}
            onAddLoanProduct={handleAddLoanProduct}
          />
        )}

        {currentPath === 'admin-savings-products' && (
          <SavingsProductsView savingsProducts={savingsProducts} />
        )}

        {currentPath === 'accounting-coa' && (
          <ChartOfAccountsView
            glAccounts={glAccounts}
            onAddAccount={handleAddAccount}
          />
        )}

        {(currentPath === 'accounting-activities' || currentPath === 'accounting-rules' || currentPath === 'accounting-closure') && (
          <AccountingRulesView
            activities={INITIAL_FINANCIAL_ACTIVITIES}
            rules={INITIAL_ACCOUNTING_RULES}
            closures={INITIAL_GL_CLOSURES}
            defaultTab={
              currentPath === 'accounting-rules' ? 'rules' :
              currentPath === 'accounting-closure' ? 'closure' : 'activities'
            }
          />
        )}

        {currentPath === 'accounting-journal' && (
          <JournalEntriesView />
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
              handleAddClient(newClient);
              navigate('clients');
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
              setSelectedSavings(s);
              navigate('savings-detail');
            }}
            onOpenNewLoanModal={() => navigate('admin-loan-products')}
            onOpenNewSavingsModal={() => navigate('admin-savings-products')}
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
            onBack={() => navigate('client-detail')}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
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
        onStartPractice={() => {
          setEduGuideOpen(false);
          setPracticeActive(true);
        }}
      />

      {/* Interactive Guided Practice Spotlight Tour */}
      <PracticeSpotlightTour
        isActive={practiceActive}
        onClose={() => setPracticeActive(false)}
        currentPath={currentPath}
        roles={roles}
        users={users}
        navigate={navigate}
        onLoadAllRoles={() => {
          setRoles([...FULL_BACKUP_ROLES]);
        }}
        onLoadAllUsers={() => {
          setUsers([...FULL_BACKUP_USERS]);
        }}
      />
    </div>
  );
}
