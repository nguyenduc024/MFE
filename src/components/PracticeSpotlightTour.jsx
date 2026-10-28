import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { ROOT_GL_HEADERS_SAMPLES, SAMPLE_GL_LEVEL_2, FULL_GL_LEVEL_2_ACCOUNTS, SAMPLE_GL_DETAILS } from '../views/ChartOfAccountsView';
import { SAMPLE_FINANCIAL_ACTIVITY_MAPPINGS } from '../views/FinancialActivityMappingsView';
import { ALL_REMAINING_ROLES, BANK_DEPARTMENTS_CONFIG, ALL_DEMO_ROLES } from '../data/mifosPermissions';

/**
 * PracticeSpotlightTour - Guided interactive walkthrough for:
 * 1. Foundation: Roles & Users
 * 2. Foundation: 4-Tier Organization (HO, Region, Branch, TO)
 * 3. GL Part 1: Currency Configuration (VND & 5 Database Currencies)
 * 4. GL Part 2: 5 Root GL Headers (100000 TOTAL ASSETS -> 500000 TOTAL EXPENSES)
 * 5. GL Part 3: GL Level 2 Headers across 5 categories
 * 6. GL Part 4: GL Detail Accounts across 5 categories
 * 7. GL Part 5: Financial Activity Mappings (6 mappings)
 * 8. Role Permissions Setup: Setting role permissions across 8 departments
 */
export default function PracticeSpotlightTour({
  isActive,
  onClose,
  currentPath,
  module = 'part-1',
  roles = [],
  users = [],
  offices = [],
  currencies = [],
  glAccounts = [],
  loanProducts = [],
  loans = [],
  selectedLoan = null,
  onSelectLoan,
  onApproveLoan,
  onDisburseLoan,
  tellers = [],
  onAllocateCash,
  savingsProducts = [],
  fixedDepositProducts = [],
  recurringDepositProducts = [],
  clients = [],
  savingsAccounts = [],
  onSelectClient,
  onSelectSavings,
  onAddSavingsProduct,
  financialActivities = [],
  accountingRules = [],
  contraAccountConfigEnabled = false,
  onToggleContraAccount,
  hasOpeningBalanceSubmitted = false,
  onSubmitOpeningBalances,
  customJournalEntries = [],
  hasCheckedRdJournal = false,
  navigate,
  onLoadAllRoles,
  onLoadAllUsers,
  onLoadAllOffices,
  onLoadRegionalOffices,
  onLoadAllCurrencies,
  onLoadAllGlLevel2,
  onLoadAllGlDetails,
  onLoadAllFinancialActivities,
  onLoadAllRolePermissions
}) {
  const [targetRect, setTargetRect] = useState(null);
  const [roleCreated, setRoleCreated] = useState(false);
  const [rolesImported, setRolesImported] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [usersImported, setUsersImported] = useState(false);
  const [tourPhase, setTourPhase] = useState('role'); // 'role', 'role-popup', 'user', 'user-popup', 'completed'

  // Role Permissions Setup state
  const [rolePermissionsPopup, setRolePermissionsPopup] = useState(false);
  const [rolePermissionsImported, setRolePermissionsImported] = useState(false);
  const [lastSubmittedRole, setLastSubmittedRole] = useState(null);

  // Part 2 state
  const [officePopup, setOfficePopup] = useState(null); // null, 'ho-created', 'ro-created', 'br-created', 'to-created'
  const [officesImported, setOfficesImported] = useState(false);
  const startOfficeCountRef = useRef(offices.length);

  // GL Part 1 state (Currency)
  const [currencyPopup, setCurrencyPopup] = useState(false);
  const [currenciesImported, setCurrenciesImported] = useState(false);
  const startCurrencyCountRef = useRef(currencies.length);

  // GL Part 2 state (5 Root GL Headers)
  const [glPopup, setGlPopup] = useState(null); // null, 'header-created', 'completed'
  const [lastHeaderCreated, setLastHeaderCreated] = useState(null);
  const prevGlAccountsRef = useRef(glAccounts);

  // GL Part 3 state (GL Level 2 Headers)
  const [glLevel2Popup, setGlLevel2Popup] = useState(null); // null, 'sample-created', 'samples-completed', 'all-imported'
  const [glLevel2Imported, setGlLevel2Imported] = useState(false);
  const [lastLevel2Created, setLastLevel2Created] = useState(null);
  const prevGlLevel2Ref = useRef(glAccounts);

  // GL Part 4 state (GL Detail Accounts)
  const [glDetailPopup, setGlDetailPopup] = useState(null); // null, 'sample-created', 'samples-completed', 'all-imported'
  const [glDetailImported, setGlDetailImported] = useState(false);
  const [lastDetailCreated, setLastDetailCreated] = useState(null);
  const prevGlDetailRef = useRef(glAccounts);

  // GL Part 5 state (Financial Activity Mappings)
  const [finActivityPopup, setFinActivityPopup] = useState(null); // null, 'mapping-created', 'mappings-completed', 'all-imported'
  const [finActivityImported, setFinActivityImported] = useState(false);
  const [lastMappingCreated, setLastMappingCreated] = useState(null);
  const prevFinActivitiesRef = useRef(financialActivities);

  // GL Part 6 state (Opening Balance Migration & Journal Entries)
  const [glPart6Popup, setGlPart6Popup] = useState(null);
  const [openingBalanceSubStep, setOpeningBalanceSubStep] = useState('vault'); // 'vault' | 'bank' | 'capital' | 'submit'

  // GL Part 7 state (Manual Journal Entries)
  const [manualJournalSubStep, setManualJournalSubStep] = useState('office'); // 'office' | 'currency' | 'debit-gl' | 'debit-amount' | 'credit-gl' | 'credit-amount' | 'ref-date' | 'submit'

  // GL Part 8 state (Accounting Rules)
  const [ruleSubStep, setRuleSubStep] = useState('name'); // 'name' | 'office' | 'debit' | 'credit' | 'desc' | 'submit'

  // GL Part 9 state (Frequent Postings)
  const [frequentSubStep, setFrequentSubStep] = useState('office'); // 'office' | 'rule' | 'currency' | 'debit' | 'credit' | 'ref-date' | 'comments' | 'submit'

  // Phân hệ 02 - Phần 1 state (CASA Product Creation)
  const [casaProductPopup, setCasaProductPopup] = useState(false);
  const [casaFilledSteps, setCasaFilledSteps] = useState({
    details: false,
    currency: false,
    terms: false,
    settings: false,
    accounting: false
  });

  // Phân hệ 02 - Phần 2 state (CIF Creation: Minh Quang Tran & Lan Ngoc Pham)
  const [casaCifPopup, setCasaCifPopup] = useState(false);
  const [cifGeneralFilled, setCifGeneralFilled] = useState(false);
  const [cifLanFilled, setCifLanFilled] = useState(false);

  // Phân hệ 02 - Phần 3 state (CASA Deposit: Minh Quang Tran)
  const [casaDepositPopup, setCasaDepositPopup] = useState(false);
  const [depositFilled, setDepositFilled] = useState(false);

  // Phân hệ 02 - Phần 4 state (CASA Withdrawal: Minh Quang Tran)
  const [casaWithdrawPopup, setCasaWithdrawPopup] = useState(false);
  const [withdrawFilled, setWithdrawFilled] = useState(false);
  // CASA Part 5 state (Account Transfer: Minh Quang Tran -> Lan Ngoc Pham)
  const [transferFilled, setTransferFilled] = useState(false);
  // Phân hệ 03 - Phần 1 state (Fixed Deposit Product)
  const [fdFilledSteps, setFdFilledSteps] = useState({
    details: false,
    currency: false,
    terms: false,
    settings: false,
    chart: false
  });
  // Phân hệ 03 - Phần 2 state (Fixed Deposit Account Creation)
  const [fdaFilledSteps, setFdaFilledSteps] = useState({
    details: false,
    terms: false,
    settings: false
  });
  // Phân hệ 03 - Phần 3 state (Recurring Deposit Product Creation)
  const [rdFilledSteps, setRdFilledSteps] = useState({
    details: false,
    currency: false,
    terms: false,
    settings: false,
    chart: false,
    charges: false,
    accounting: false
  });
  // Phân hệ 03 - Phần 4 state (Recurring Deposit Account Creation: Lan Ngoc Pham)
  const [rdaFilledSteps, setRdaFilledSteps] = useState({
    details: false,
    settings: false
  });

  // Phân hệ 04 - Phần 1 state (Loan Product Creation: TKB Personal Loan)
  const [loanFilledSteps, setLoanFilledSteps] = useState({
    details: false,
    currency: false,
    settingsPart1: false,
    settingsPart2: false,
    terms: false,
    charges: true,
    accounting: false
  });
  const [loanSettingsSubStep, setLoanSettingsSubStep] = useState('part1');

  // Phân hệ 04 - Phần 2 state (Loan Account Application: TKB Personal Loan)
  const [loanAccFilledSteps, setLoanAccFilledSteps] = useState({
    details: false,
    terms: false,
    charges: true,
    tkbFix: false,
    scheduleGenerated: false
  });
  const [loanConsoleModalOpen, setLoanConsoleModalOpen] = useState(false);


  const startRoleCountRef = useRef(roles.length);
  const startUserCountRef = useRef(users.length);

  // Reset session reference whenever practice becomes active
  useEffect(() => {
    if (isActive) {
      if (module === 'casa-part-1') {
        setCasaProductPopup(false);
        setCasaFilledSteps({
          details: false,
          currency: false,
          terms: false,
          settings: false,
          accounting: false
        });
      } else if (module === 'casa-part-2') {
        setCasaCifPopup(false);
        setCifGeneralFilled(false);
        setCifLanFilled(false);
      } else if (module === 'casa-part-3') {
        setCasaDepositPopup(false);
        setDepositFilled(false);
      } else if (module === 'casa-part-4') {
        setCasaWithdrawPopup(false);
        setWithdrawFilled(false);
      } else if (module === 'casa-part-5') {
        setTransferFilled(false);
      } else if (module === 'saving-part-1') {
        setFdFilledSteps({
          details: false,
          currency: false,
          terms: false,
          settings: false,
          chart: false,
          accounting: false
        });
      } else if (module === 'saving-part-2') {
        setFdaFilledSteps({
          details: false,
          terms: false,
          settings: false
        });
      } else if (module === 'saving-part-3') {
        setRdFilledSteps({
          details: false,
          currency: false,
          terms: false,
          settings: false,
          chartInfo: false,
          chart: false,
          charges: false,
          accounting: false
        });
      } else if (module === 'saving-part-4') {
        setRdaFilledSteps({
          details: false,
          settings: false
        });
      } else if (module === 'loan-part-1') {
        setLoanFilledSteps({
          details: false,
          currency: false,
          settingsPart1: false,
          settingsPart2: false,
          terms: false,
          charges: true,
          accounting: false
        });
        setLoanSettingsSubStep('part1');
      } else if (module === 'loan-part-2') {
        setLoanAccFilledSteps({
          details: false,
          terms: false,
          charges: true,
          tkbFix: false,
          scheduleGenerated: false
        });
      } else if (module === 'role-permissions') {
        setRolePermissionsPopup(false);
        setRolePermissionsImported(false);
        setLastSubmittedRole(null);
      } else if (module === 'gl-part-9') {
        setFrequentSubStep('office');
      } else if (module === 'gl-part-8') {
        setRuleSubStep('name');
      } else if (module === 'gl-part-7') {
        setManualJournalSubStep('office');
      } else if (module === 'gl-part-6') {
        setGlPart6Popup(null);
        setOpeningBalanceSubStep('vault');
      } else if (module === 'gl-part-5') {
        setFinActivityPopup(null);
        setFinActivityImported(false);
        prevFinActivitiesRef.current = financialActivities;
      } else if (module === 'gl-part-4') {
        setGlDetailPopup(null);
        setGlDetailImported(false);
        prevGlDetailRef.current = glAccounts;
      } else if (module === 'gl-part-3') {
        setGlLevel2Popup(null);
        setGlLevel2Imported(false);
        prevGlLevel2Ref.current = glAccounts;
      } else if (module === 'gl-part-2') {
        setGlPopup(null);
        prevGlAccountsRef.current = glAccounts;
      } else if (module === 'gl-part-1') {
        startCurrencyCountRef.current = currencies.length;
        setCurrencyPopup(false);
        setCurrenciesImported(false);
      } else if (module === 'part-2') {
        startOfficeCountRef.current = offices.length;
        setOfficePopup(null);
        setOfficesImported(false);
      } else {
        startRoleCountRef.current = roles.length;
        startUserCountRef.current = users.length;
        setRoleCreated(false);
        setRolesImported(roles.length >= 16);
        setUserCreated(false);
        setUsersImported(users.length >= 26);
        setRolePermissionsPopup(false);
        setLastSubmittedRole(null);
        if (roles.length >= 16 && !rolePermissionsImported) {
          setTourPhase('permissions');
        } else {
          setTourPhase('role');
        }
      }
    }
  }, [isActive, module]);

  // Track if CASA Product was created (Phân hệ 02 - Phần 1)
  useEffect(() => {
    if (isActive && module === 'casa-part-1') {
      const hasTkca = savingsProducts.some(p => p.shortName === 'TKCA' || p.name?.toLowerCase().includes('tkb current'));
      if (hasTkca && !casaProductPopup) {
        setCasaProductPopup(true);
      }
    }
  }, [savingsProducts, isActive, module, casaProductPopup]);

  // Track if both CIFs were created (Phân hệ 02 - Phần 2)
  useEffect(() => {
    if (isActive && module === 'casa-part-2') {
      const hasMinhTran = clients.some(c => 
        (c.accountNo === '000000011' || c.externalId === 'TKB-CIF-TDU-001' || c.displayName?.toLowerCase().includes('minh quang tran')) &&
        c.status === 'Active'
      );
      const hasLanPham = clients.some(c => 
        (c.accountNo === '000000012' || c.externalId === 'TKB-CIF-TDU-002' || c.displayName?.toLowerCase().includes('lan ngoc pham')) &&
        c.status === 'Active'
      );
      if (hasMinhTran && hasLanPham && currentPath === 'client-detail' && !casaCifPopup) {
        setCasaCifPopup(true);
      }
    }
  }, [clients, isActive, module, currentPath, casaCifPopup]);

  // Track if CASA Deposit was completed (Phân hệ 02 - Phần 3)
  useEffect(() => {
    if (isActive && module === 'casa-part-3') {
      const account = savingsAccounts.find(s => s.accountNo === '000000001');
      const hasDeposited = account && (Number(account.balance) >= 5000000 || Number(account.accountBalance) >= 5000000);
      if (hasDeposited && currentPath === 'savings-detail' && !casaDepositPopup) {
        setCasaDepositPopup(true);
      }
    }
  }, [savingsAccounts, isActive, module, currentPath, casaDepositPopup]);


  // Listen for loan product form changes (Phân hệ 04 - Phần 1)
  useEffect(() => {
    const handleLoanFormChanged = (e) => {
      const fd = e?.detail?.formData;
      if (!fd) return;
      setLoanFilledSteps({
        details: Boolean(fd.name && fd.shortName),
        currency: Boolean(fd.currency && fd.decimalPlaces !== ''),
        settingsPart1: Boolean(fd.amortization && fd.interestMethod && fd.daysInYear),
        settingsPart2: Boolean(fd.overdueDaysForNPA && fd.allowOverridingSelectTerms),
        terms: Boolean(fd.defaultPrincipal && fd.defaultRepayments && fd.defaultInterestRate),
        charges: true,
        accounting: Boolean(fd.accountingRule)
      });
    };
    window.addEventListener('loan-form-changed', handleLoanFormChanged);
    return () => window.removeEventListener('loan-form-changed', handleLoanFormChanged);
  }, []);

  // Listen for loan account form changes (Phân hệ 04 - Phần 2)
  useEffect(() => {
    const handleLoanAccFormChanged = (e) => {
      const { formData, isTkbFixInstalled, isScheduleGenerated, consoleModalOpen } = e?.detail || {};
      if (consoleModalOpen !== undefined) {
        setLoanConsoleModalOpen(Boolean(consoleModalOpen));
      }
      if (!formData) return;
      setLoanAccFilledSteps({
        details: Boolean(formData.productName && formData.externalId && formData.loanOfficer),
        terms: Boolean(formData.principal && formData.loanTerm && formData.nominalInterestRate),
        charges: true,
        tkbFix: Boolean(isTkbFixInstalled),
        scheduleGenerated: Boolean(isScheduleGenerated)
      });
    };
    const handleTkbFixInstalled = () => {
      setLoanAccFilledSteps(prev => ({ ...prev, tkbFix: true }));
    };
    window.addEventListener('loan-acc-form-changed', handleLoanAccFormChanged);
    window.addEventListener('tkb-fix-installed', handleTkbFixInstalled);
    return () => {
      window.removeEventListener('loan-acc-form-changed', handleLoanAccFormChanged);
      window.removeEventListener('tkb-fix-installed', handleTkbFixInstalled);
    };
  }, []);

  // Auto-filter transfer journal entries when navigating to journal in casa-part-5
  useEffect(() => {
    if (isActive && module === 'casa-part-5' && (currentPath === 'accounting-journal-entries' || currentPath === 'accounting-journal')) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('practice-filter-transfer-journal'));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive, module, currentPath]);

  // Auto-filter recurring deposit journal entries when navigating to journal in saving-part-4
  useEffect(() => {
    if (isActive && module === 'saving-part-4' && (currentPath === 'accounting-journal-entries' || currentPath === 'accounting-journal')) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('practice-filter-rd-deposit-journal'));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive, module, currentPath]);

  // Auto-filter treasury journal entries when navigating to journal in treasury-part-1
  useEffect(() => {
    if (isActive && module === 'treasury-part-1' && (currentPath === 'accounting-journal-entries' || currentPath === 'accounting-journal')) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('practice-filter-treasury-journal'));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive, module, currentPath]);

  // Track if CASA Withdrawal was completed (Phân hệ 02 - Phần 4)
  useEffect(() => {
    if (isActive && module === 'casa-part-4') {
      const account = savingsAccounts.find(s => s.accountNo === '000000001');
      const hasWithdrawn = account && (
        account.transactions?.some(t => t.type === 'WITHDRAWAL' || t.transactionType === 'Withdrawal') ||
        (account.balance !== null && Number(account.balance) <= 3000000 && Number(account.balance) > 0)
      );
      if (hasWithdrawn && currentPath === 'savings-detail' && !casaWithdrawPopup) {
        setCasaWithdrawPopup(true);
      }
    }
  }, [savingsAccounts, isActive, module, currentPath, casaWithdrawPopup]);

  // Track if Financial Activity Mapping was submitted / created (GL Part 5)
  useEffect(() => {
    if (isActive && module === 'gl-part-5') {
      if (financialActivities.length > prevFinActivitiesRef.current.length) {
        const requiredCodes = ['300', '101', '102', '103', '100', '200'];
        const newlyAdded = financialActivities[0];
        prevFinActivitiesRef.current = financialActivities;

        if (newlyAdded && requiredCodes.includes(newlyAdded.activityCode) && !finActivityPopup) {
          setLastMappingCreated(newlyAdded);
          const completedCount = requiredCodes.filter(c => 
            financialActivities.some(a => String(a.activityCode) === String(c))
          ).length;

          if (completedCount >= 6) {
            setFinActivityPopup('mappings-completed');
          } else {
            setFinActivityPopup('mapping-created');
          }
        }
      } else {
        prevFinActivitiesRef.current = financialActivities;
      }
    }
  }, [financialActivities, isActive, module, finActivityPopup]);

  // Track if GL Headers were submitted / created (GL Part 2)
  useEffect(() => {
    if (isActive && module === 'gl-part-2') {
      if (glAccounts.length > prevGlAccountsRef.current.length) {
        const rootCodes = ['100000', '200000', '300000', '400000', '500000'];
        const newlyAdded = glAccounts[0];
        prevGlAccountsRef.current = glAccounts;

        if (newlyAdded && rootCodes.includes(newlyAdded.glCode) && !glPopup) {
          setLastHeaderCreated(newlyAdded);
          const completedCount = rootCodes.filter(c => 
            glAccounts.some(a => a.glCode === c && (a.usage || '').toLowerCase() === 'header')
          ).length;

          if (completedCount >= 5) {
            setGlPopup('completed');
          } else {
            setGlPopup('header-created');
          }
        }
      } else {
        prevGlAccountsRef.current = glAccounts;
      }
    }
  }, [glAccounts, isActive, module, glPopup]);

  // Track if GL Level 2 Headers were submitted / created (GL Part 3)
  useEffect(() => {
    if (isActive && module === 'gl-part-3') {
      if (glAccounts.length > prevGlLevel2Ref.current.length) {
        const level2SampleCodes = ['110000', '210000', '310000', '410000', '510000'];
        const newlyAdded = glAccounts[0];
        prevGlLevel2Ref.current = glAccounts;

        if (newlyAdded && level2SampleCodes.includes(newlyAdded.glCode) && !glLevel2Popup) {
          setLastLevel2Created(newlyAdded);
          const completedCount = level2SampleCodes.filter(c => 
            glAccounts.some(a => a.glCode === c && (a.usage || '').toLowerCase() === 'header')
          ).length;

          if (completedCount >= 5) {
            setGlLevel2Popup('samples-completed');
          } else {
            setGlLevel2Popup('sample-created');
          }
        }
      } else {
        prevGlLevel2Ref.current = glAccounts;
      }
    }
  }, [glAccounts, isActive, module, glLevel2Popup]);

  // Track if GL Detail Accounts were submitted / created (GL Part 4)
  useEffect(() => {
    if (isActive && module === 'gl-part-4') {
      if (glAccounts.length > prevGlDetailRef.current.length) {
        const detailSampleCodes = ['110101', '210101', '310101', '410101', '510101'];
        const newlyAdded = glAccounts[0];
        prevGlDetailRef.current = glAccounts;

        if (newlyAdded && detailSampleCodes.includes(newlyAdded.glCode) && !glDetailPopup) {
          setLastDetailCreated(newlyAdded);
          const completedCount = detailSampleCodes.filter(c => 
            glAccounts.some(a => a.glCode === c && (a.usage || '').toLowerCase() === 'detail')
          ).length;

          if (completedCount >= 5) {
            setGlDetailPopup('samples-completed');
          } else {
            setGlDetailPopup('sample-created');
          }
        }
      } else {
        prevGlDetailRef.current = glAccounts;
      }
    }
  }, [glAccounts, isActive, module, glDetailPopup]);

  // Track if currencies were submitted / added (GL Part 1)
  useEffect(() => {
    if (isActive && module === 'gl-part-1') {
      if (currencies.length === 0) {
        startCurrencyCountRef.current = 0;
        setCurrencyPopup(false);
        setCurrenciesImported(false);
      } else if (currencies.length > startCurrencyCountRef.current && !currencyPopup && !currenciesImported) {
        startCurrencyCountRef.current = currencies.length;
        if (currencies.some(c => c.code === 'VND') && currencies.length < 5) {
          setCurrencyPopup(true);
        }
      }
    }
  }, [currencies.length, isActive, module, currencyPopup, currenciesImported, currencies]);

  // Track if a role was created during this active session
  useEffect(() => {
    if (isActive && module === 'part-1' && roles.length > startRoleCountRef.current && !roleCreated) {
      setRoleCreated(true);
      setTourPhase('role-popup');
    }
  }, [roles.length, isActive, module, roleCreated]);

  // Track if a user was created during this active session
  useEffect(() => {
    if (isActive && module === 'part-1' && users.length > startUserCountRef.current && !userCreated) {
      setUserCreated(true);
      setTourPhase('user-popup');
    }
  }, [users.length, isActive, module, userCreated]);

  // Track if role permissions were submitted during this session
  useEffect(() => {
    const handleRolePermsSubmitted = (e) => {
      setLastSubmittedRole(e?.detail || null);
      setRolePermissionsPopup(true);
    };
    window.addEventListener('practice-role-permissions-submitted', handleRolePermsSubmitted);
    return () => window.removeEventListener('practice-role-permissions-submitted', handleRolePermsSubmitted);
  }, []);

  // Track if an office was created during this active session (Part 2)
  useEffect(() => {
    if (isActive && module === 'part-2' && offices.length > startOfficeCountRef.current && !officePopup) {
      const newlyAdded = offices[0];
      startOfficeCountRef.current = offices.length;
      if (!newlyAdded.parentId || newlyAdded.parentId === 'none' || newlyAdded.parentId === 'root') {
        setOfficePopup('ho-created');
      } else {
        const parent = offices.find(p => String(p.id) === String(newlyAdded.parentId));
        const isParentHO = parent && (!parent.parentId || parent.parentId === 'none' || parent.parentId === 'root');
        if (isParentHO || newlyAdded.name.toLowerCase().includes('region') || newlyAdded.name.toLowerCase().includes('khu vực')) {
          setOfficePopup('ro-created');
        } else if (newlyAdded.name.toLowerCase().includes('branch') || newlyAdded.name.toLowerCase().includes('chi nhánh')) {
          setOfficePopup('br-created');
        } else {
          setOfficePopup('to-created');
        }
      }
    }
  }, [offices.length, isActive, module, officePopup, offices]);

  // Check form fill status for Role form
  const submitRoleBtn = typeof document !== 'undefined' ? document.getElementById('tour-submit-role-btn') : null;
  const isRoleFormFilled = Boolean(submitRoleBtn && !submitRoleBtn.disabled);

  // Check form fill status for User form
  const submitUserBtn = typeof document !== 'undefined' ? document.getElementById('tour-submit-user-btn') : null;
  const isUserFormFilled = Boolean(submitUserBtn && !submitUserBtn.disabled);

  // Check form fill status for Office form (Part 2)
  const submitOfficeBtn = typeof document !== 'undefined' ? document.getElementById('tour-submit-office-btn') : null;
  const isOfficeFormFilled = Boolean(submitOfficeBtn && !submitOfficeBtn.disabled);

  // Check draft & add button status for Currency form (GL Part 1)
  const draftCurrencyContainer = typeof document !== 'undefined' ? document.getElementById('tour-draft-currencies-list') : null;
  const hasVndDraft = Boolean(draftCurrencyContainer && draftCurrencyContainer.querySelector('[data-currency-code="VND"]'));
  const addCurrencyBtn = typeof document !== 'undefined' ? document.getElementById('tour-btn-add-currency') : null;
  const isAddCurrencyBtnEnabled = Boolean(addCurrencyBtn && !addCurrencyBtn.disabled);

  // Check form status for GL Account form (GL Part 2)
  const rootGlCodes = ['100000', '200000', '300000', '400000', '500000'];
  const glCompletedCodes = rootGlCodes.filter(c => glAccounts.some(a => a.glCode === c && (a.usage || '').toLowerCase() === 'header'));
  const glNextSample = ROOT_GL_HEADERS_SAMPLES.find(s => !glCompletedCodes.includes(s.glCode)) || ROOT_GL_HEADERS_SAMPLES[0];
  const submitGlBtn = typeof document !== 'undefined' ? document.getElementById('tour-submit-gl-btn') : null;
  const isGlFormOpen = Boolean(submitGlBtn);
  const isGlFormFilled = Boolean(submitGlBtn && !submitGlBtn.disabled);

  // Check form status for GL Level 2 Accounts (GL Part 3)
  const level2SampleCodes = ['110000', '210000', '310000', '410000', '510000'];
  const allLevel2Codes = ['110000', '120000', '130000', '210000', '220000', '310000', '410000', '420000', '510000', '520000', '530000'];
  const level2CompletedSampleCodes = level2SampleCodes.filter(c => glAccounts.some(a => a.glCode === c && (a.usage || '').toLowerCase() === 'header'));
  const nextLevel2Sample = SAMPLE_GL_LEVEL_2.find(s => !level2CompletedSampleCodes.includes(s.glCode)) || SAMPLE_GL_LEVEL_2[0];
  const totalLevel2Created = allLevel2Codes.filter(c => glAccounts.some(a => a.glCode === c && (a.usage || '').toLowerCase() === 'header')).length;

  // Check form status for GL Detail Accounts (GL Part 4)
  const detailSampleCodes = ['110101', '210101', '310101', '410101', '510101'];
  const detailCompletedSampleCodes = detailSampleCodes.filter(c => 
    glAccounts.some(a => a.glCode === c && (a.usage || '').toLowerCase() === 'detail')
  );
  const nextDetailSample = SAMPLE_GL_DETAILS.find(s => !detailCompletedSampleCodes.includes(s.glCode)) || SAMPLE_GL_DETAILS[0];
  const totalDetailsCreated = glAccounts.filter(a => (a.usage || '').toLowerCase() === 'detail').length;

  // Check form status for Financial Activity Mappings (GL Part 5)
  const requiredActivityCodes = ['300', '101', '102', '103', '100', '200'];
  const completedActivityCodes = requiredActivityCodes.filter(c => 
    financialActivities.some(a => String(a.activityCode) === String(c))
  );
  const nextMappingSample = SAMPLE_FINANCIAL_ACTIVITY_MAPPINGS.find(s => !completedActivityCodes.includes(s.activityCode)) || SAMPLE_FINANCIAL_ACTIVITY_MAPPINGS[0];
  const submitMappingBtn = typeof document !== 'undefined' ? document.getElementById('tour-submit-mapping-btn') : null;
  const isMappingFormOpen = Boolean(typeof document !== 'undefined' && document.getElementById('tour-mapping-create-card'));
  const isMappingFormFilled = Boolean(submitMappingBtn && !submitMappingBtn.disabled);

  // Determine active step & target element
  let currentStep = 1;
  let totalSteps = 6;
  let targetSelector = '#tour-nav-admin';
  let stepTitle = 'Bước 1 / 4: Mở menu Quản trị';
  let stepSubtitle = '';
  let stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở các phân hệ quản trị.';

  if (module === 'casa-part-1') {
    const hasTkcaCreated = savingsProducts.some(p => p.shortName === 'TKCA' || p.name?.toLowerCase().includes('tkb current'));
    if (currentPath === 'admin-create-savings-product') {
      if (typeof document !== 'undefined' && document.getElementById('tour-casa-preview-card')) {
        currentStep = 8;
        targetSelector = '#tour-casa-preview-card';
        stepTitle = 'Bước 8 / 8: Kiểm tra thông số & Bấm Submit';
        stepSubtitle = 'Rà soát toàn bộ các tham số kỹ thuật của sản phẩm CASA trước khi đưa vào vận hành trên hệ thống core banking.';
        stepInstruction = 'Kiểm tra lại toàn bộ: Details (TKB Current Account - TKCA), Currency (VND, 0 decimals), Terms (0% lãi suất, 365 ngày), Settings, Accounting (Cash Based). Bấm nút "Submit" màu xanh nước biển để hoàn tất khởi tạo sản phẩm!';
      } else if (typeof document !== 'undefined' && document.getElementById('tour-casa-form-accounting')) {
        currentStep = 7;
        targetSelector = '#tour-casa-form-accounting';
        stepTitle = 'Bước 7 / 8: Cấu hình Liên kết kế toán (ACCOUNTING)';
        stepSubtitle = 'Hạch toán theo phương pháp Cash: Ghi nhận đối ứng tài sản thanh toán và nghĩa vụ nợ đối với tiền gửi của khách hàng.';
        stepInstruction = 'Chọn Cash, sau đó liên kết 9 tài khoản Sổ cái (GL Accounts): Nợ TK 110201 Settlement Bank Account và Có TK 210102 Current Account Deposits. Bấm "Điền mẫu Accounting (Cash)" bên dưới để tự động điền đầy đủ theo chuẩn thiết kế!';
      } else if (typeof document !== 'undefined' && document.getElementById('tour-casa-form-charges')) {
        currentStep = 6;
        targetSelector = '#tour-casa-form-charges';
        stepTitle = 'Bước 6 / 8: Cấu hình Biểu phí dịch vụ (CHARGES)';
        stepSubtitle = 'Tùy chọn gán các khoản phí dịch vụ, duy trì định kỳ. Sản phẩm CASA cơ bản này mở miễn phí.';
        stepInstruction = 'Sản phẩm CASA cơ bản chưa áp dụng phí định kỳ bắt buộc. Bấm nút "Next" ở bên dưới để chuyển tiếp sang Tab ACCOUNTING.';
      } else if (typeof document !== 'undefined' && document.getElementById('tour-casa-form-settings')) {
        currentStep = 5;
        targetSelector = '#tour-casa-form-settings';
        stepTitle = 'Bước 5 / 8: Cấu hình Quy tắc hoạt động (SETTINGS)';
        stepSubtitle = 'Tài khoản CASA mở tự do không yêu cầu số dư tối thiểu ban đầu (0 VND) và không kích hoạt hạn mức thấu chi.';
        stepInstruction = 'Cấu hình Minimum Opening Balance: 0 VND, để trống Lock-in Period và không kích hoạt Overdraft. Bấm "Điền mẫu Settings" bên dưới để hoàn thành nhanh.';
      } else if (typeof document !== 'undefined' && document.getElementById('tour-casa-form-terms')) {
        currentStep = 4;
        targetSelector = '#tour-casa-form-terms';
        stepTitle = 'Bước 4 / 8: Thiết lập Điều khoản tính lãi (TERMS)';
        stepSubtitle = 'Tài khoản thanh toán lãi suất 0%, chu kỳ tính dồn theo số dư cuối ngày (Daily Balance) trên chuẩn 365 ngày/năm.';
        stepInstruction = 'Cấu hình Nominal Annual Interest: 0%, Compounding Period: Daily, Posting Period: Monthly, Calculated using: Daily Balance, Days in Year: 365 Days. Bấm "Điền mẫu Terms" bên dưới để hoàn thành và mở khóa Tab PREVIEW!';
      } else if (typeof document !== 'undefined' && document.getElementById('tour-casa-form-currency')) {
        currentStep = 3;
        targetSelector = '#tour-casa-form-currency';
        stepTitle = 'Bước 3 / 8: Thiết lập Loại tiền tệ (CURRENCY)';
        stepSubtitle = 'Đồng Việt Nam (VND) không dùng số thập phân hào/xu lẻ (Decimal = 0) và làm tròn theo bội số 1 VND.';
        stepInstruction = 'Chọn Currency: Vietnamese Dong (VND), Decimal Places: 0, Currency in multiples of: 1. Bấm "Điền mẫu Currency" bên dưới để tiếp tục sang Tab TERMS.';
      } else {
        currentStep = 2;
        targetSelector = '#tour-casa-form-details';
        stepTitle = 'Bước 2 / 8: Nhập Thông tin chung sản phẩm (DETAILS)';
        stepSubtitle = 'Tiền gửi không kỳ hạn phục vụ thanh toán (CASA), nhận diện bằng tên "TKB Current Account" và mã định danh "TKCA".';
        stepInstruction = 'Nhập Product Name: "TKB Current Account", Short Name: "TKCA", Description: "Basic VND CASA Product · Demo". Bấm "Điền mẫu Details" bên dưới để điền nhanh và chuyển sang Tab CURRENCY.';
      }
    } else if (currentPath === 'admin-savings-products') {
      if (hasTkcaCreated) {
        currentStep = 8;
        targetSelector = '#tour-casa-created-row';
        stepTitle = 'Đã tạo thành công Sản phẩm CASA: TKB Current Account (TKCA)';
        stepSubtitle = 'Sản phẩm đã sẵn sàng trên hệ thống core banking để mở tài khoản cho khách hàng cá nhân và doanh nghiệp.';
        stepInstruction = 'Sản phẩm TKB Current Account đã được lưu thành công vào danh mục Saving Products của Takashimaya Bank! Bạn có thể tiếp tục sang phần 2: Tạo hồ sơ CIF khách hàng.';
      } else {
        currentStep = 1;
        targetSelector = '#tour-create-savings-product-btn';
        stepTitle = 'Bước 1 / 8: Nhấn nút Create Savings Product';
        stepSubtitle = 'Khởi tạo danh mục sản phẩm tiền gửi thanh toán (CASA) trên phân hệ Products của Core Banking.';
        stepInstruction = 'Tại trang quản lý Saving Products, bấm nút "+ Create Savings Product" màu xanh ở góc trên bên phải để bắt đầu thiết lập sản phẩm.';
      }
    } else if (currentPath === 'admin-products') {
      currentStep = 1;
      targetSelector = '#tour-savings-products-tile';
      stepTitle = 'Bước 1 / 8: Chọn danh mục Savings Products';
      stepSubtitle = 'Truy cập danh mục quản lý toàn bộ các sản phẩm tiền gửi thanh toán và tiết kiệm.';
      stepInstruction = 'Bấm vào ô "Savings Products" trong danh mục Products để vào danh sách sản phẩm tiền gửi.';
    } else {
      currentStep = 1;
      targetSelector = '#tour-admin-products';
      stepTitle = 'Bước 1 / 8: Vào menu Admin > Products';
      stepSubtitle = 'Truy cập trung tâm quản trị cấu hình sản phẩm nghiệp vụ ngân hàng.';
      stepInstruction = 'Di chuột hoặc bấm vào menu Admin trên thanh điều hướng, sau đó chọn mục "Products".';
    }
  } else if (module === 'casa-part-2') {
    const hasMinhTranCreated = clients.some(c => 
      c.accountNo === '000000011' || c.externalId === 'TKB-CIF-TDU-001' || c.displayName?.toLowerCase().includes('minh quang tran')
    );
    const hasLanPhamCreated = clients.some(c => 
      c.accountNo === '000000012' || c.externalId === 'TKB-CIF-TDU-002' || c.displayName?.toLowerCase().includes('lan ngoc pham')
    );

    if (hasMinhTranCreated && hasLanPhamCreated) {
      currentStep = 8;
      targetSelector = '#tour-client-detail-saving-table';
      stepTitle = 'Hoàn thành: Đã tạo 2 hồ sơ CIF & Tài khoản CASA';
      stepSubtitle = 'Minh Quang Tran (000000011) và Lan Ngoc Pham (000000012) đã được kích hoạt thành công.';
      stepInstruction = 'Kiểm tra thông tin tài khoản CASA của cả 2 khách hàng: 000000001 (Minh Quang Tran) và 000000002 (Lan Ngoc Pham). Bấm nút "Hoàn thành bài thực hành CIF" bên dưới để hoàn tất.';
    } else if (hasMinhTranCreated && !hasLanPhamCreated) {
      // Flow for Client 2: Lan Ngoc Pham
      if (currentPath === 'client-detail') {
        currentStep = 4;
        targetSelector = '#tour-client-detail-saving-table';
        stepTitle = 'Bước 4 / 8: CIF 1 đã tạo thành công - Tiếp tục tạo CIF 2';
        stepSubtitle = 'Hồ sơ Minh Quang Tran (000000011) và tài khoản CASA 000000001 đã sẵn sàng.';
        stepInstruction = 'Khách hàng Minh Quang Tran đã được cấp mã định danh 000000011 và tài khoản CASA 000000001. Tiếp theo, hãy tạo hồ sơ cho khách hàng thứ 2: Lan Ngoc Pham (TKB-CIF-TDU-002) theo kịch bản thực hành.';
      } else if (currentPath === 'create-client') {
        if (typeof document !== 'undefined' && document.getElementById('tour-create-client-preview-card')) {
          currentStep = 8;
          targetSelector = '#tour-create-client-preview-card';
          stepTitle = 'Bước 8 / 8: Rà soát & Submit CIF 2 (Lan Ngoc Pham)';
          stepSubtitle = 'Kiểm tra toàn bộ thông số định danh CIF của Lan Ngoc Pham trước khi bấm Submit.';
          stepInstruction = 'Rà soát các trường: Name (Lan Ngoc Pham), Office (Thu Duc Transaction Office), Legal Form (Person), Staff (Unassigned), DOB (05 August 2004), External Id (TKB-CIF-TDU-002), Mobile (094462817), Email (ngoclan0805@gmail.com), Savings Product (TKB Current Account), Submitted On Date (13 October 2026), Active? (Yes), Activation Date (13 October 2026). Sau đó bấm "Submit" để tạo hồ sơ!';
        } else if (typeof document !== 'undefined' && document.getElementById('tour-create-client-family-container')) {
          currentStep = 7;
          targetSelector = '#tour-client-next-btn-step2';
          stepTitle = 'Bước 7 / 8: Tab FAMILY MEMBERS (Người thân)';
          stepSubtitle = 'Khách hàng Lan Ngoc Pham chưa đăng ký người phụ thuộc.';
          stepInstruction = 'Khách hàng Lan Ngoc Pham hiện chưa có thông tin người thân. Bấm nút "Next" bên dưới để chuyển sang Tab PREVIEW.';
        } else {
          currentStep = 6;
          targetSelector = cifLanFilled ? '#tour-client-next-btn-step1' : '#tour-create-client-form-general';
          stepTitle = cifLanFilled ? 'Bước 6 / 8: Rà soát dữ liệu Lan Ngoc Pham' : 'Bước 6 / 8: Khai báo thông tin CIF 2 (Lan Ngoc Pham)';
          stepSubtitle = cifLanFilled ? 'Dữ liệu CIF 2 đã được điền vào biểu mẫu. Hãy rà soát lại trước khi bấm Next.' : 'Khai báo các trường thông tin CIF của khách hàng Lan Ngoc Pham tại PGD Thủ Đức.';
          stepInstruction = cifLanFilled 
            ? 'Kiểm tra các trường đã điền: Văn phòng Thủ Đức, Lan Ngoc Pham, TKB-CIF-TDU-002, DOB 8/5/2004, Staff Unassigned, Mobile 094462817, Active, Open Savings Account. Bấm nút "Next" bên dưới để tiếp tục.' 
            : 'Nhập thông tin theo mẫu: Office (Thu Duc Transaction Office), Legal Form (Person), External Id (TKB-CIF-TDU-002), First Name (Lan), Middle Name (Ngoc), Last Name (Pham), DOB (8/5/2004), Staff (để trống - Unassigned), Mobile (094462817), Email (ngoclan0805@gmail.com), Active (Yes), Open Savings Account (Yes). Bấm nút "Điền dữ liệu mẫu CIF 2" bên dưới để điền nhanh.';
        }
      } else if (currentPath === 'clients') {
        currentStep = 5;
        targetSelector = '#tour-create-client-btn';
        stepTitle = 'Bước 5 / 8: Bấm Create Client để tạo CIF 2';
        stepSubtitle = 'Khởi tạo hồ sơ khách hàng thứ 2: Lan Ngoc Pham.';
        stepInstruction = 'Bấm nút "+ Create Client" màu xanh ở góc trên bên phải để bắt đầu biểu mẫu tạo CIF thứ 2.';
      } else {
        currentStep = 5;
        targetSelector = '#tour-nav-institution';
        stepTitle = 'Bước 5 / 8: Truy cập phân hệ Clients';
        stepSubtitle = 'Mở danh mục quản lý khách hàng từ thanh điều hướng.';
        stepInstruction = 'Bấm vào menu "Institution > Clients" để tiếp tục tạo khách hàng thứ 2.';
      }
    } else {
      // Flow for Client 1: Minh Quang Tran
      if (currentPath === 'client-detail') {
        currentStep = 4;
        targetSelector = '#tour-client-detail-saving-table';
        stepTitle = 'Bước 4 / 8: Hồ sơ CIF 1 & Tài khoản CASA đã liên kết';
        stepSubtitle = 'Khách hàng Minh Quang Tran đã được cấp mã định danh 000000011 và liên kết tài khoản CASA 000000001.';
        stepInstruction = 'Kiểm tra thông tin khách hàng trên màn hình: CIF 000000011, Văn phòng PGD Thủ Đức, Trạng thái Active. Tại bảng Saving Accounts, tài khoản TKB Current Account đã hiển thị sẵn sàng.';
      } else if (currentPath === 'create-client') {
        if (typeof document !== 'undefined' && document.getElementById('tour-create-client-preview-card')) {
          currentStep = 3;
          targetSelector = '#tour-create-client-preview-card';
          stepTitle = 'Bước 3 / 8: Rà soát thông tin tại Tab PREVIEW';
          stepSubtitle = 'Kiểm tra toàn bộ thông số định danh CIF của khách hàng trước khi bấm Submit.';
          stepInstruction = 'Rà soát các trường: Name (Minh Quang Tran), Office (Thu Duc Transaction Office), Legal Form (Person), Staff (Dang, Quan), DOB (06 April 2000), External Id (TKB-CIF-TDU-001), Mobile (0955738216), Email (quang2004@gmail.com), Savings Product (TKB Current Account), Submitted On Date (13 October 2026), Active? (Yes), Activation Date (13 October 2026). Sau khi xem xong, bấm nút "Submit" màu xanh để tạo hồ sơ!';
        } else if (typeof document !== 'undefined' && document.getElementById('tour-create-client-family-container')) {
          currentStep = 2;
          targetSelector = '#tour-client-next-btn-step2';
          stepTitle = 'Bước 2 / 8: Tab FAMILY MEMBERS (Người thân)';
          stepSubtitle = 'Khách hàng chưa đăng ký người phụ thuộc hay thông tin gia đình.';
          stepInstruction = 'Khách hàng Minh Quang Tran hiện chưa cần khai báo thành viên gia đình. Bạn xem qua giao diện rồi bấm nút "Next" bên dưới để chuyển sang Tab PREVIEW.';
        } else {
          currentStep = 1;
          targetSelector = cifGeneralFilled ? '#tour-client-next-btn-step1' : '#tour-create-client-form-general';
          stepTitle = cifGeneralFilled ? 'Bước 1 / 8: Rà soát & Chuyển sang Tab Tiếp theo' : 'Bước 1 / 8: Khai báo thông tin định danh (Tab GENERAL)';
          stepSubtitle = cifGeneralFilled ? 'Dữ liệu CIF 1 đã được điền vào biểu mẫu. Hãy rà soát lại trước khi bấm Next.' : 'Khai báo đầy đủ các trường thông tin CIF của khách hàng tại Phòng giao dịch Thủ Đức.';
          stepInstruction = cifGeneralFilled
            ? 'Kiểm tra thông tin đã điền trên màn hình. Bấm nút "Next" bên dưới hoặc nút "Tiếp theo" trong hộp thoại để chuyển sang bước Family Members.'
            : 'Nhập thông tin: Office (Thu Duc Transaction Office), Legal Form (Person), First Name (Minh), Middle Name (Quang), Last Name (Tran), DOB (4/6/2000), Staff (Dang, Quan), Mobile (0955738216), Email (quang2004@gmail.com), Active (Yes), Open Savings Account (Yes). Bấm nút "Điền dữ liệu mẫu CIF 1" bên dưới để điền nhanh và kiểm tra.';
        }
      } else if (currentPath === 'clients') {
        currentStep = 1;
        targetSelector = '#tour-create-client-btn';
        stepTitle = 'Bước 1 / 8: Bấm nút Create Client';
        stepSubtitle = 'Khởi tạo hồ sơ khách hàng mới (CIF) trong phân hệ Quản lý khách hàng.';
        stepInstruction = 'Tại trang danh sách Clients, bấm nút "+ Create Client" màu xanh ở góc trên bên phải để bắt đầu biểu mẫu tạo CIF.';
      } else {
        currentStep = 1;
        targetSelector = '#tour-nav-institution';
        stepTitle = 'Bước 1 / 8: Truy cập phân hệ Clients';
        stepSubtitle = 'Mở danh mục quản lý khách hàng từ thanh điều hướng.';
        stepInstruction = 'Bấm vào menu "Institution > Clients" trên thanh menu trên cùng để truy cập danh sách khách hàng.';
      }
    }
  } else if (module === 'casa-part-3') {
    const account001 = savingsAccounts.find(s => s.accountNo === '000000001');
    const isDeposited = account001 && (Number(account001.balance) >= 5000000 || Number(account001.accountBalance) >= 5000000);

    if (currentPath === 'clients') {
      currentStep = 1;
      targetSelector = '#tour-client-row-minh';
      stepTitle = 'Bước 1 / 5: Chọn khách hàng Minh Quang Tran';
      stepSubtitle = 'Mở hồ sơ khách hàng để truy cập danh sách tài khoản tiền gửi CASA.';
      stepInstruction = 'Tìm khách hàng Minh Quang Tran (Mã định danh 000000011 / TKB-CIF-TDU-001) trong danh sách và nhấp vào dòng của khách hàng để mở trang chi tiết.';
    } else if (currentPath === 'client-detail') {
      currentStep = 2;
      targetSelector = '#tour-saving-row-000000001';
      stepTitle = 'Bước 2 / 5: Chọn tài khoản CASA (000000001)';
      stepSubtitle = 'Truy cập thông tin chi tiết tài khoản tiền gửi TKB Current Account.';
      stepInstruction = 'Tại bảng Saving Accounts, nhấp vào liên kết tài khoản 000000001 (TKB Current Account) để mở màn hình quản lý nghiệp vụ tài khoản.';
    } else if (currentPath === 'savings-detail') {
      if (isDeposited) {
        currentStep = 5;
        targetSelector = '#tour-savings-account-overview';
        stepTitle = 'Bước 5 / 5: Hoàn tất nạp tiền vào tài khoản CASA';
        stepSubtitle = 'Số dư khả dụng của tài khoản 000000001 đã được cập nhật thành công lên 5,000,000.00 VND.';
        stepInstruction = 'Kiểm tra số dư tại Account Overview: Current Balance đ5,000,000.00 và Available Balance đ5,000,000.00. Tab Transactions cũng đã ghi nhận giao dịch nộp tiền. Bấm nút "Hoàn tất bài thực hành CASA" bên dưới để kết thúc.';
      } else {
        currentStep = 3;
        targetSelector = '#tour-savings-action-menu';
        stepTitle = 'Bước 3 / 5: Mở danh mục tác vụ & chọn Deposit';
        stepSubtitle = 'Thực hiện nộp tiền mặt hoặc chuyển khoản vào tài khoản tiền gửi thanh toán.';
        stepInstruction = 'Nhấp vào nút menu tác vụ (biểu tượng 3 dấu gạch ngang) ở góc trên bên phải khung màu xanh, sau đó chọn "Deposit" để mở biểu mẫu nộp tiền vào tài khoản.';
      }
    } else if (currentPath === 'savings-deposit') {
      currentStep = 4;
      targetSelector = '#tour-deposit-savings-form';
      if (!depositFilled) {
        stepTitle = 'Bước 4 / 5: Khai báo giao dịch nạp tiền CASA';
        stepSubtitle = 'Nhập thông tin giao dịch nộp 5,000,000 VND vào tài khoản 000000001.';
        stepInstruction = 'Khai báo các thông tin: Ngày giao dịch (10/13/2026), Số tiền gửi (5,000,000.00 VND), Phương thức thanh toán (Money Transfer), và Ghi chú (Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001). Bấm nút "Điền dữ liệu mẫu Nạp tiền" bên dưới để điền tự động.';
      } else {
        stepTitle = 'Bước 4 / 5: Rà soát dữ liệu giao dịch';
        stepSubtitle = 'Dữ liệu nộp tiền đã được điền. Vui lòng kiểm tra lại trước khi bấm Submit.';
        stepInstruction = 'Kiểm tra kỹ các trường đã điền: Transaction Date (10/13/2026), Transaction Amount (VND 5,000,000.00), Payment Type (Money Transfer), và Notes. Sau khi xem lại xong, bạn có thể bấm nút "Submit" màu xanh trên form hoặc bấm nút "Bấm Submit nạp tiền" bên dưới để hoàn tất giao dịch.';
      }
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-institution';
      stepTitle = 'Bước 1 / 5: Truy cập danh sách khách hàng (Clients)';
      stepSubtitle = 'Mở danh mục quản lý khách hàng từ thanh điều hướng.';
      stepInstruction = 'Bấm vào menu Institution > Clients trên thanh điều hướng để mở danh sách khách hàng.';
    }
  } else if (module === 'casa-part-4') {
    const account001 = savingsAccounts.find(s => s.accountNo === '000000001');
    const isWithdrawn = account001 && (
      account001.transactions?.some(t => t.type === 'WITHDRAWAL' || t.transactionType === 'Withdrawal') ||
      (account001.balance !== null && Number(account001.balance) <= 3000000 && Number(account001.balance) > 0)
    );

    if (currentPath === 'clients') {
      currentStep = 1;
      targetSelector = '#tour-client-row-minh';
      stepTitle = 'Bước 1 / 5: Chọn khách hàng Minh Quang Tran';
      stepSubtitle = 'Mở hồ sơ khách hàng để truy cập danh sách tài khoản tiền gửi CASA.';
      stepInstruction = 'Tìm khách hàng Minh Quang Tran (Mã định danh 000000011 / TKB-CIF-TDU-001) trong danh sách và nhấp vào dòng của khách hàng để mở trang chi tiết.';
    } else if (currentPath === 'client-detail') {
      currentStep = 2;
      targetSelector = '#tour-saving-row-000000001';
      stepTitle = 'Bước 2 / 5: Chọn tài khoản CASA (000000001)';
      stepSubtitle = 'Truy cập thông tin chi tiết tài khoản tiền gửi TKB Current Account.';
      stepInstruction = 'Tại bảng Saving Accounts, nhấp vào liên kết tài khoản 000000001 (TKB Current Account) để mở màn hình quản lý nghiệp vụ tài khoản.';
    } else if (currentPath === 'savings-detail') {
      if (isWithdrawn) {
        currentStep = 5;
        targetSelector = '#tour-savings-account-overview';
        stepTitle = 'Bước 5 / 5: Hoàn tất rút tiền khỏi tài khoản CASA';
        stepSubtitle = 'Số dư khả dụng của tài khoản 000000001 đã giảm còn 3,000,000.00 VND sau giao dịch rút tiền.';
        stepInstruction = 'Kiểm tra số dư tại Account Overview: Current Balance đ3,000,000.00 và Available Balance đ3,000,000.00. Tab Transactions cũng đã ghi nhận giao dịch rút tiền (Debit: 2,000,000.00). Bấm nút "Hoàn tất bài thực hành Rút tiền CASA" bên dưới để kết thúc.';
      } else {
        currentStep = 3;
        targetSelector = '#tour-savings-action-menu';
        stepTitle = 'Bước 3 / 5: Mở danh mục tác vụ & chọn Withdrawal';
        stepSubtitle = 'Thực hiện nghiệp vụ rút tiền từ tài khoản tiền gửi thanh toán.';
        stepInstruction = 'Nhấp vào nút menu tác vụ (biểu tượng 3 dấu gạch ngang) ở góc trên bên phải khung màu xanh, sau đó chọn "Withdrawal" để mở biểu mẫu rút tiền từ tài khoản.';
      }
    } else if (currentPath === 'savings-withdraw') {
      currentStep = 4;
      targetSelector = '#tour-withdraw-savings-form';
      if (!withdrawFilled) {
        stepTitle = 'Bước 4 / 5: Khai báo giao dịch rút tiền CASA';
        stepSubtitle = 'Nhập thông tin giao dịch rút 2,000,000 VND từ tài khoản 000000001.';
        stepInstruction = 'Khai báo các thông tin: Ngày giao dịch (10/13/2026), Số tiền rút (2,000,000.00 VND), Phương thức thanh toán (Money Transfer), và Ghi chú (CASA withdrawal via bank transfer. TKB-CASA-WD-001). Bấm nút "Điền dữ liệu mẫu Rút tiền" bên dưới để điền tự động.';
      } else {
        stepTitle = 'Bước 4 / 5: Rà soát dữ liệu giao dịch rút tiền';
        stepSubtitle = 'Dữ liệu rút tiền đã được điền. Vui lòng kiểm tra lại trước khi bấm Submit.';
        stepInstruction = 'Kiểm tra kỹ các trường đã điền: Transaction Date (10/13/2026), Transaction Amount (VND 2,000,000.00), Payment Type (Money Transfer), và Notes. Sau khi xem lại xong, bạn có thể bấm nút "Submit" màu xanh trên form hoặc bấm nút "Bấm Submit rút tiền" bên dưới để hoàn tất giao dịch.';
      }
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-institution';
      stepTitle = 'Bước 1 / 5: Truy cập danh sách khách hàng (Clients)';
      stepSubtitle = 'Mở danh mục quản lý khách hàng từ thanh điều hướng.';
      stepInstruction = 'Bấm vào menu Institution > Clients trên thanh điều hướng để mở danh sách khách hàng.';
    }
  } else if (module === 'casa-part-5') {
    const account001 = savingsAccounts.find(s => s.accountNo === '000000001');
    const account002 = savingsAccounts.find(s => s.accountNo === '000000002');
    const isTransferred = (
      (account001 && (
        account001.transactions?.some(t => t.type === 'TRANSFER_FROM' || t.transactionType?.toLowerCase().includes('transfer from')) ||
        (account001.balance !== null && Number(account001.balance) <= 2000000 && Number(account001.balance) > 0)
      )) ||
      (account002 && (
        account002.transactions?.some(t => t.type === 'TRANSFER_TO' || t.transactionType?.toLowerCase().includes('transfer to')) ||
        (account002.balance !== null && Number(account002.balance) >= 1000000)
      ))
    );

    if (currentPath === 'clients') {
      currentStep = 1;
      targetSelector = '#tour-client-row-minh';
      stepTitle = 'Bước 1 / 7: Chọn khách hàng nguồn Minh Quang Tran';
      stepSubtitle = 'Mở hồ sơ khách hàng để truy cập tài khoản tiền gửi CASA gửi tiền.';
      stepInstruction = 'Tìm khách hàng Minh Quang Tran (Mã định danh 000000011 / TKB-CIF-TDU-001) trong danh sách và nhấp vào dòng của khách hàng để mở trang chi tiết.';
    } else if (currentPath === 'client-detail') {
      if (!isTransferred) {
        currentStep = 2;
        targetSelector = '#tour-saving-row-000000001';
        stepTitle = 'Bước 2 / 7: Chọn tài khoản CASA nguồn (000000001)';
        stepSubtitle = 'Truy cập thông tin chi tiết tài khoản TKB Current Account của người chuyển.';
        stepInstruction = 'Tại bảng Saving Accounts, nhấp vào liên kết tài khoản 000000001 (TKB Current Account - số dư 3.000.000 VND) để mở màn hình quản lý tài khoản.';
      } else {
        currentStep = 6;
        targetSelector = '#tour-saving-row-000000002';
        stepTitle = 'Bước 6 / 7: Đối soát tài khoản người nhận Lan Ngoc Pham';
        stepSubtitle = 'Tài khoản 000000002 của Lan Ngoc Pham đã nhận đủ 1,000,000.00 VND.';
        stepInstruction = 'Kiểm tra tài khoản 000000002 (TKB Current Account) tại bảng Saving Accounts: Current Balance đạt đ1,000,000.00. Sau khi đối soát xong, bấm nút "Kiểm tra Sổ Nhật ký chung" bên dưới để kiểm tra 4 bút toán tự động.';
      }
    } else if (currentPath === 'savings-detail') {
      if (!isTransferred) {
        currentStep = 3;
        targetSelector = '#tour-savings-action-menu';
        stepTitle = 'Bước 3 / 7: Mở menu tác vụ & chọn Transfer Funds';
        stepSubtitle = 'Thực hiện nghiệp vụ chuyển khoản nội bộ giữa hai khách hàng.';
        stepInstruction = 'Nhấp vào nút menu tác vụ (biểu tượng 3 dấu gạch ngang) ở góc trên bên phải khung màu xanh, di chuột vào mục "More" và chọn "Transfer Funds" để mở biểu mẫu chuyển khoản.';
      } else {
        currentStep = 5;
        targetSelector = '#tour-savings-account-overview';
        stepTitle = 'Bước 5 / 7: Đối soát tài khoản người chuyển Minh Quang Tran';
        stepSubtitle = 'Số dư khả dụng của tài khoản 000000001 đã giảm còn 2,000,000.00 VND sau khi chuyển khoản.';
        stepInstruction = 'Kiểm tra số dư tại Account Overview: Current Balance đ2,000,000.00 và Available Balance đ2,000,000.00. Tab Transactions cũng đã ghi nhận giao dịch chuyển tiền (Debit: 1,000,000.00 VND). Bấm nút "Kiểm tra tài khoản Lan Ngoc Pham" bên dưới để tiếp tục đối soát.';
      }
    } else if (currentPath === 'account-transfer') {
      currentStep = 4;
      targetSelector = '#tour-account-transfer-form';
      if (!transferFilled) {
        stepTitle = 'Bước 4 / 7: Khai báo lệnh chuyển khoản nội bộ';
        stepSubtitle = 'Nhập thông tin chuyển 1,000,000 VND sang tài khoản 000000002 (Lan Ngoc Pham).';
        stepInstruction = 'Khai báo các thông tin: Office (Thu Duc Transaction Office), Client (Lan Ngoc Pham), Account Type (Savings Account), Account (TKB Current Account - 000000002), Transaction Date (10/13/2026), Amount (1,000,000.00 VND), và Description (Internal CASA transfer to Lan Pham. TKB-TRF-001.). Bấm nút "Điền dữ liệu mẫu Chuyển khoản" bên dưới để điền tự động.';
      } else {
        stepTitle = 'Bước 4 / 7: Rà soát dữ liệu chuyển khoản trước khi gửi';
        stepSubtitle = 'Dữ liệu chuyển khoản đã được điền. Vui lòng kiểm tra lại trước khi bấm Submit.';
        stepInstruction = 'Kiểm tra kỹ các trường: Recipient (Lan Ngoc Pham), Account (000000002), Transaction Date (10/13/2026), Amount (1,000,000.00 VND), và Description. Sau khi xem lại xong, bấm nút "Submit" màu xanh trên form hoặc bấm nút "Bấm Submit chuyển khoản" bên dưới.';
      }
    } else if (currentPath === 'accounting-journal-entries' || currentPath === 'accounting-journal') {
      currentStep = 7;
      targetSelector = '#tour-journal-transfer-entries';
      stepTitle = 'Bước 7 / 7: Hoàn tất thực hành - Đối soát 4 bút toán Sổ Nhật ký chung';
      stepSubtitle = 'Hệ thống Core Banking đã tự động hạch toán 4 bút toán chuyển khoản nội bộ (Tx S3 & S4).';
      stepInstruction = 'Bốn bút toán định khoản kế toán tự động (mã dòng 65, 66, 67, 68) đang được chiếu sáng nổi bật bên cạnh: Nợ TK 210102 (Current Account Deposits: 1,000,000.00 VND), Có TK 220201 (Clearing Payable: 1,000,000.00 VND), Nợ TK 220201 (Clearing Payable: 1,000,000.00 VND), và Có TK 210102 (Current Account Deposits: 1,000,000.00 VND). Toàn bộ luồng chuyển tiền nội bộ đã hoàn thành trọn vẹn và cân đối!';
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-institution';
      stepTitle = 'Bước 1 / 7: Truy cập danh sách khách hàng (Clients)';
      stepSubtitle = 'Mở danh mục quản lý khách hàng từ thanh điều hướng.';
      stepInstruction = 'Bấm vào menu Institution > Clients trên thanh điều hướng để mở danh sách khách hàng.';
    }
  } else if (module === 'saving-part-1') {
    const hasTkfdCreated = fixedDepositProducts.some(p => p.shortName === 'TKFD' || p.name?.toLowerCase().includes('fixed deposit'));

    if (currentPath === 'admin-products') {
      currentStep = 1;
      targetSelector = '#tour-products-fixed-deposit';
      stepTitle = 'Bước 1: Chọn Fixed Deposit Products';
      stepSubtitle = 'Mở danh mục quản lý sản phẩm tiền gửi tiết kiệm có kỳ hạn.';
      stepInstruction = 'Tại trang Products, nhấp vào mục "Fixed Deposit Products" để truy cập danh sách các sản phẩm tiền gửi có kỳ hạn của ngân hàng.';
    } else if (currentPath === 'admin-fixed-deposit-products') {
      if (!hasTkfdCreated) {
        currentStep = 2;
        targetSelector = '#tour-create-fd-product-btn';
        stepTitle = 'Bước 2: Tạo sản phẩm Fixed Deposit mới';
        stepSubtitle = 'Mở biểu mẫu khai báo sản phẩm tiền gửi có kỳ hạn mới.';
        stepInstruction = 'Nhấp vào nút "+ Create Fixed Deposit Product" màu xanh ở góc trên bên phải để bắt đầu thiết lập sản phẩm TKB Fixed Deposit (TKFD).';
      } else {
        currentStep = 11;
        targetSelector = '#tour-fd-product-row-tkfd';
        stepTitle = 'Hoàn tất: Sản phẩm TKB Fixed Deposit (TKFD) đã kích hoạt';
        stepSubtitle = 'Sản phẩm Tiết kiệm có kỳ hạn đã được tạo và kích hoạt thành công trên Core Banking!';
        stepInstruction = 'Sản phẩm TKB Fixed Deposit (TKFD) với biểu lãi suất 4 bậc (3.5% - 5.5% p.a.) và hạch toán Cash Based đã được hiển thị trên danh mục. Nhấn nút "Hoàn thành phần thực hành" bên dưới để hoàn tất.';
      }
    } else if (currentPath === 'admin-create-fixed-deposit-product') {
      const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-details-form'));
      const hasCurrency = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-currency-form'));
      const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-terms-form'));
      const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-settings-form'));
      const hasChart = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-chart-form'));
      const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-charges-form'));
      const hasAccounting = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-accounting-form'));
      const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-preview-card'));

      if (hasDetails) {
        currentStep = 3;
        targetSelector = '#tour-fd-details-form';
        if (!fdFilledSteps.details) {
          stepTitle = 'Bước 3: Khai báo tab DETAILS (Thông tin sản phẩm)';
          stepSubtitle = 'Nhập tên sản phẩm, mã viết tắt và mô tả theo đúng hình ảnh tài liệu.';
          stepInstruction = 'Khai báo: Product Name (TKB Fixed Deposit), Short Name (TKFD), và Description (A VND fixed term deposit product offered by Takashimaya Bank, supporting 3, 6, and 12-month deposit terms with tiered annual interest rates. Designed for secure savings interest revenue, with maturity-based withdrawal.). Bấm nút "Điền dữ liệu mẫu Details" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 3: Rà soát dữ liệu tab DETAILS';
          stepSubtitle = 'Dữ liệu đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại Product Name (TKB Fixed Deposit), Short Name (TKFD) và Description. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Currency" bên dưới.';
        }
      } else if (hasCurrency) {
        currentStep = 4;
        targetSelector = '#tour-fd-currency-form';
        if (!fdFilledSteps.currency) {
          stepTitle = 'Bước 4: Khai báo tab CURRENCY (Đơn vị tiền tệ)';
          stepSubtitle = 'Cấu hình loại tiền tệ VND và số thập phân hiển thị.';
          stepInstruction = 'Khai báo các trường: Currency (Vietnamese Dong), Decimal Places (0), và Currency in multiples of (1). Bấm nút "Điền dữ liệu mẫu Currency" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 4: Rà soát dữ liệu tab CURRENCY';
          stepSubtitle = 'Dữ liệu tiền tệ đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại Currency (Vietnamese Dong), Decimal Places (0), Currency in multiples of (1). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Terms" bên dưới.';
        }
      } else if (hasTerms) {
        currentStep = 5;
        targetSelector = '#tour-fd-terms-form';
        if (!fdFilledSteps.terms) {
          stepTitle = 'Bước 5: Khai báo tab TERMS (Hạn mức & Chu kỳ tính lãi)';
          stepSubtitle = 'Thiết lập hạn mức tiền gửi và chu kỳ ghi nhận lãi suất hàng tháng.';
          stepInstruction = 'Khai báo Deposit Amount: Minimum (1000000), Default (10000000), Maximum (1000000000). Cấu hình chu kỳ: Compounding Period (Monthly), Posting Period (Monthly), Calculated using (Daily Balance), Days in Year (365 Days). Bấm nút "Điền dữ liệu mẫu Terms" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 5: Rà soát dữ liệu tab TERMS';
          stepSubtitle = 'Dữ liệu hạn mức và chu kỳ đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại hạn mức tiền gửi 1.000.000 - 1.000.000.000 VND và chu kỳ tính lãi hàng tháng (Monthly). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Settings" bên dưới.';
        }
      } else if (hasSettings) {
        currentStep = 6;
        targetSelector = '#tour-fd-settings-form';
        if (!fdFilledSteps.settings) {
          stepTitle = 'Bước 6: Khai báo tab SETTINGS (Kỳ hạn gửi tiền)';
          stepSubtitle = 'Thiết lập kỳ hạn gửi tối thiểu 3 tháng, bội số 3 tháng và tối đa 12 tháng.';
          stepInstruction = 'Khai báo: Minimum Deposit Term (Frequency 3, Months), And thereafter in Multiples of (Frequency 3, Months), Maximum Deposit Term (Frequency 12, Months). Các mục Lock-in Period và Pre-mature closure để trống. Bấm nút "Điền dữ liệu mẫu Settings" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 6: Rà soát dữ liệu tab SETTINGS';
          stepSubtitle = 'Dữ liệu kỳ hạn đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại các kỳ hạn 3 tháng, 6 tháng, 9 tháng, 12 tháng. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Interest Rate Chart" bên dưới.';
        }
      } else if (hasChart) {
        currentStep = 7;
        targetSelector = '#tour-fd-chart-form';
        if (!fdFilledSteps.chart) {
          stepTitle = 'Bước 7: Khai báo tab INTEREST RATE CHART & 4 Bậc Slabs';
          stepSubtitle = 'Thiết lập Biểu lãi suất và 4 bậc kỳ hạn 3M (3.5%), 6M (4.5%), 9M (5.0%), 12M (5.5%).';
          stepInstruction = 'Khai báo thông tin Biểu lãi suất (TKB FD VND Interest Rates 2026, From Date: 9/1/2026) và 4 bậc lãi suất Slabs tương ứng. Bấm nút "Điền dữ liệu mẫu Chart & 4 Slabs" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 7: Rà soát Biểu lãi suất & 4 Bậc Slabs';
          stepSubtitle = 'Biểu lãi suất và 4 bậc kỳ hạn đã được thiết lập đầy đủ trên bảng.';
          stepInstruction = 'Rà soát 4 bậc lãi suất trên bảng: 1-3M (3.5%), 4-6M (4.5%), 7-9M (5.0%), 10-12M (5.5%). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Charges" bên dưới.';
        }
      } else if (hasCharges) {
        currentStep = 8;
        targetSelector = '#tour-fd-charges-form';
        stepTitle = 'Bước 8: Kiểm tra tab CHARGES (Biểu phí)';
        stepSubtitle = 'Sản phẩm tiết kiệm có kỳ hạn này không áp dụng phí dịch vụ.';
        stepInstruction = 'Theo thiết kế sản phẩm, tab Biểu phí không yêu cầu khai báo vì miễn phí hoàn toàn cho khách hàng. Nhấp vào nút "Next" trên form hoặc nút "Tiếp tục sang tab Accounting" bên dưới để sang bước tiếp theo.';
      } else if (hasAccounting) {
        currentStep = 9;
        targetSelector = '#tour-fd-accounting-form';
        if (!fdFilledSteps.accounting) {
          stepTitle = 'Bước 9: Khai báo tab ACCOUNTING (Hạch toán kế toán Cash Based)';
          stepSubtitle = 'Chọn phương pháp Cash và liên kết các tài khoản sổ cái GL tương ứng.';
          stepInstruction = 'Chọn Cash và gán các tài khoản GL: Saving reference (110201 Settlement Bank Account), Saving control (210103 Fixed Deposits), Transfers in suspense (220201 Clearing Payable), Interest on savings (510102 Fixed Deposit Interest Expense), Income from fees (420102) & penalties (420107). Bấm nút "Điền dữ liệu mẫu Accounting (Cash Based)" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 9: Rà soát tab ACCOUNTING';
          stepSubtitle = 'Đã liên kết đầy đủ các tài khoản sổ cái kế toán Cash Based.';
          stepInstruction = 'Kiểm tra lại các tài khoản GL đã gán (TK 110201, TK 210103, TK 220201, TK 510102, TK 420102, TK 420107). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Preview" bên dưới.';
        }
      } else if (hasPreview) {
        currentStep = 10;
        targetSelector = '#tour-fd-preview-card';
        stepTitle = 'Bước 10: Rà soát tổng thể & Bấm Submit tạo sản phẩm';
        stepSubtitle = 'Kiểm tra toàn bộ các phần cấu hình sản phẩm trước khi chính thức kích hoạt.';
        stepInstruction = 'Rà soát kỹ các thẻ: Details, Currency, Terms, Settings, Interest Rate Charts (4 Slabs) và Accounting. Sau đó bấm nút "Submit" màu xanh bên dưới để tạo sản phẩm TKB Fixed Deposit.';
      } else {
        currentStep = 3;
        targetSelector = '#tour-fd-stepper';
        stepTitle = 'Khai báo sản phẩm Fixed Deposit';
        stepSubtitle = 'Khai báo các tab cấu hình sản phẩm.';
        stepInstruction = 'Thực hiện khai báo theo các bước trên thanh tiến trình.';
      }
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-admin';
      stepTitle = 'Bước 1: Truy cập Admin -> Products';
      stepSubtitle = 'Mở danh mục quản trị sản phẩm từ thanh điều hướng.';
      stepInstruction = 'Bấm vào menu Admin > Products trên thanh điều hướng để mở danh sách sản phẩm.';
    }
  } else if (module === 'saving-part-2') {
    const fd = savingsAccounts.find(s => 
      s.accountNo === '000000003' || 
      (s.externalId === 'TKB-FD-TDU-001' && (s.productName?.toLowerCase().includes('fixed') || s.accountType === 'Fixed Deposit'))
    );
    const isApproved = fd?.status === 'Approved';
    const isActive = fd?.status === 'Active' || fd?.status === 'Activated';
    const isPending = fd && !isApproved && !isActive;

    if (currentPath === 'clients') {
      currentStep = 1;
      targetSelector = '#tour-client-row-minh';
      stepTitle = 'Bước 1: Chọn khách hàng Minh Quang Tran';
      stepSubtitle = 'Mở hồ sơ khách hàng để mở tài khoản tiền gửi tiết kiệm có kỳ hạn.';
      stepInstruction = 'Tại danh sách Clients, nhấp vào dòng khách hàng "Minh Quang Tran" (Client ID: 000000011, Mã CIF: TKB-CIF-TDU-001) để mở trang quản lý tài khoản của khách hàng.';
    } else if (currentPath === 'client-detail') {
      if (isActive) {
        currentStep = 13;
        targetSelector = '#tour-client-fixed-deposits-section';
        stepTitle = 'Hoàn tất: Tài khoản Fixed Deposit 000000003 đã kích hoạt (Active)';
        stepSubtitle = 'Sản phẩm TKB Fixed Deposit đã được kích hoạt thành công trên hồ sơ khách hàng!';
        stepInstruction = 'Tài khoản Fixed Deposit 000000003 với số tiền 1.000.000 VND và kỳ hạn 6 tháng đã ở trạng thái Active trong bảng Fixed Deposit Accounts. Bấm nút "Hoàn thành phần thực hành" bên dưới để hoàn tất bài học.';
      } else {
        const hasAppsSubmenu = typeof document !== 'undefined' && Boolean(document.getElementById('tour-client-new-fixed-deposit-btn'));
        if (!hasAppsSubmenu) {
          currentStep = 2;
          targetSelector = '#tour-client-actions-menu-btn';
          stepTitle = 'Bước 2: Mở menu thao tác khách hàng (Client Actions)';
          stepSubtitle = 'Mở danh mục ứng dụng nghiệp vụ tài khoản trên thanh banner.';
          stepInstruction = 'Nhấp vào nút menu 3 dấu gạch ngang (≡) ở góc trên bên phải khung banner màu xanh của khách hàng để mở danh sách chức năng.';
        } else {
          currentStep = 3;
          targetSelector = '#tour-client-new-fixed-deposit-btn';
          stepTitle = 'Bước 3: Chọn New Fixed Deposits Account';
          stepSubtitle = 'Mở biểu mẫu khai báo cấp tài khoản tiền gửi có kỳ hạn mới.';
          stepInstruction = 'Trong menu Applications, nhấp vào mục "New Fixed Deposits Account" (ô viền đỏ) để mở form tạo tài khoản tiền gửi tiết kiệm có kỳ hạn.';
        }
      }
    } else if (currentPath === 'create-fixed-deposit-account') {
      const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-details-form'));
      const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-terms-form'));
      const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-settings-form'));
      const hasChart = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-chart-form'));
      const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-charges-form'));
      const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-preview-card'));

      if (hasDetails) {
        currentStep = 4;
        targetSelector = '#tour-fda-details-form';
        if (!fdaFilledSteps.details) {
          stepTitle = 'Bước 4: Khai báo tab DETAILS (Thông tin tài khoản)';
          stepSubtitle = 'Khai báo sản phẩm TKB Fixed Deposit, ngày lập và mã hồ sơ.';
          stepInstruction = 'Khai báo các trường: Product Name (TKB Fixed Deposit), Submitted On (10/13/2026), Field Officer (Unassigned), External id (TKB-FD-TDU-001). Bấm nút "Điền dữ liệu mẫu Details" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 4: Rà soát dữ liệu tab DETAILS';
          stepSubtitle = 'Dữ liệu đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại Product Name (TKB Fixed Deposit) và External id (TKB-FD-TDU-001). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Terms" bên dưới.';
        }
      } else if (hasTerms) {
        currentStep = 5;
        targetSelector = '#tour-fda-terms-form';
        if (!fdaFilledSteps.terms) {
          stepTitle = 'Bước 5: Khai báo tab TERMS (Hạn mức & Kỳ hạn gửi tiền)';
          stepSubtitle = 'Nhập số tiền gửi 1.000.000 VND và kỳ hạn 6 tháng.';
          stepInstruction = 'Khai báo: Deposit Amount (1,000,000.00 VND), Deposit Period (6 Months), chu kỳ tính lãi hàng tháng (Monthly), ngày trong năm (365 Days). Bấm nút "Điền dữ liệu mẫu Terms" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 5: Rà soát dữ liệu tab TERMS';
          stepSubtitle = 'Dữ liệu hạn mức và kỳ hạn đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại số tiền gửi 1.000.000 VND và kỳ hạn 6 Tháng. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Settings" bên dưới.';
        }
      } else if (hasSettings) {
        currentStep = 6;
        targetSelector = '#tour-fda-settings-form';
        if (!fdaFilledSteps.settings) {
          stepTitle = 'Bước 6: Khai báo tab SETTINGS (Kỳ hạn gửi tiền)';
          stepSubtitle = 'Thiết lập kỳ hạn tối thiểu 3 tháng, bội số 3 tháng, tối đa 3 tháng.';
          stepInstruction = 'Khai báo: Minimum Deposit Term (3 Months), Multiples of (3 Months), Maximum Deposit Term (3 Months). Các mục Lock-in Period và Pre-mature closure để trống. Bấm nút "Điền dữ liệu mẫu Settings" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 6: Rà soát dữ liệu tab SETTINGS';
          stepSubtitle = 'Dữ liệu kỳ hạn đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Rà soát lại các thông số kỳ hạn gửi tiền. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Interest Rate Chart" bên dưới.';
        }
      } else if (hasChart) {
        currentStep = 7;
        targetSelector = '#tour-fda-chart-form';
        stepTitle = 'Bước 7: Kiểm tra INTEREST RATE CHART (Lãi suất áp dụng)';
        stepSubtitle = 'Hệ thống tự động áp dụng bậc lãi suất 4.5% p.a. cho kỳ hạn 6 tháng.';
        stepInstruction = 'Đối chiếu biểu lãi suất TKB FD VND Interest Rates 2026: Với kỳ hạn gửi 6 tháng, bậc lãi suất tương ứng là 4-6 Months với tỷ lệ 4.5% / năm. Nhấp nút "Next" trên form hoặc nút "Tiếp tục sang tab Charges" bên dưới.';
      } else if (hasCharges) {
        currentStep = 8;
        targetSelector = '#tour-fda-charges-form';
        stepTitle = 'Bước 8: Kiểm tra tab CHARGES (Biểu phí)';
        stepSubtitle = 'Sản phẩm tiết kiệm có kỳ hạn được miễn phí hoàn toàn.';
        stepInstruction = 'Tab Charges không phát sinh phí dịch vụ. Nhấp nút "Next" trên form hoặc nút "Tiếp tục sang tab Preview" bên dưới.';
      } else if (hasPreview) {
        currentStep = 9;
        targetSelector = '#tour-fda-preview-card';
        stepTitle = 'Bước 9: Rà soát và Gửi phê duyệt hồ sơ (Submit)';
        stepSubtitle = 'Kiểm tra toàn bộ hồ sơ tiền gửi có kỳ hạn trước khi gửi phê duyệt.';
        stepInstruction = 'Rà soát số tiền gốc 1.000.000 VND, kỳ hạn 6 Tháng, ngày đáo hạn 13/04/2027 và số tiền đáo hạn dự tính 1.022.653 VND. Nhấp vào nút "Submit" màu xanh để gửi phê duyệt hồ sơ mở tài khoản!';
      } else {
        currentStep = 4;
        targetSelector = '#tour-fda-stepper';
        stepTitle = 'Tạo tài khoản Fixed Deposit';
        stepSubtitle = 'Khai báo các thông tin mở sổ tiết kiệm có kỳ hạn.';
        stepInstruction = 'Thực hiện khai báo theo các bước trên thanh tiến trình.';
      }
    } else if (currentPath === 'approve-fixed-deposit-account') {
      currentStep = 11;
      targetSelector = '#tour-fd-approve-form';
      stepTitle = 'Bước 11: Phê duyệt hồ sơ tài khoản (Approved On Date)';
      stepSubtitle = 'Nhập ngày phê duyệt 10/13/2026 và nhấn Confirm.';
      stepInstruction = 'Nhập ngày phê duyệt Approved On Date là 10/13/2026. Bấm nút "Điền dữ liệu mẫu (10/13/2026)" bên dưới để điền nhanh, sau đó nhấn "Confirm" để phê duyệt hồ sơ.';
    } else if (currentPath === 'fixed-deposit-detail') {
      if (isActive) {
        currentStep = 13;
        targetSelector = '#tour-fd-account-detail-card';
        stepTitle = 'Hoàn tất: Kích hoạt thành công tài khoản TKB Fixed Deposit (000000003)!';
        stepSubtitle = 'Tài khoản đã Active, ghi nhận số dư 1.000.000 VND và lịch sử hiệu lực!';
        stepInstruction = 'Tài khoản Fixed Deposit Product: TKB Fixed Deposit 000000003 của khách hàng Minh Quang Tran đã chuyển sang trạng thái Active (ô vuông xanh lá) với số dư Current Balance 1.000.000 VND, ngày kích hoạt 13 October 2026 và xuất hiện tab Transactions. Nhấn nút "Hoàn thành phần thực hành" bên dưới để kết thúc bài học.';
      } else if (isApproved) {
        currentStep = 12;
        targetSelector = '#tour-fd-actions-menu';
        stepTitle = 'Bước 12: Mở menu thao tác để Kích hoạt (Activate)';
        stepSubtitle = 'Hồ sơ đã được Approve. Tiếp tục kích hoạt tài khoản để ghi nhận tiền gửi.';
        stepInstruction = 'Hồ sơ đã chuyển sang trạng thái "Approved" với số dư Current Balance 0.00 VND. Nhấp vào menu 3 dấu gạch ngang (≡) và chọn mục "Activate" để kích hoạt tài khoản chính thức.';
      } else {
        currentStep = 10;
        targetSelector = '#tour-fd-actions-menu';
        stepTitle = 'Bước 10: Mở menu thao tác để Phê duyệt (Approve)';
        stepSubtitle = 'Hồ sơ đang ở trạng thái Pending Approval. Tiến hành phê duyệt hồ sơ.';
        stepInstruction = 'Nhấp vào nút menu 3 dấu gạch ngang (≡) ở góc trên bên phải khung banner tài khoản, sau đó chọn mục "Approve" để mở biểu mẫu phê duyệt.';
      }
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-institution';
      stepTitle = 'Bước 1: Mở danh sách khách hàng (Clients)';
      stepSubtitle = 'Truy cập danh mục quản lý khách hàng từ thanh điều hướng.';
      stepInstruction = 'Bấm vào menu Institution > Clients trên thanh điều hướng để mở danh sách khách hàng.';
    }
  } else if (module === 'saving-part-3') {
    const hasTkgsCreated = recurringDepositProducts.some(p => p.shortName === 'TKGS' || p.name?.toLowerCase().includes('goal savings'));

    if (currentPath === 'admin-products') {
      currentStep = 1;
      targetSelector = '#tour-products-recurring-deposit';
      stepTitle = 'Bước 1: Chọn Recurring Deposit Products';
      stepSubtitle = 'Mở danh mục quản lý sản phẩm tiền gửi tiết kiệm gửi góp.';
      stepInstruction = 'Tại trang Products, nhấp vào mục "Recurring Deposit Products" để truy cập danh sách các sản phẩm tiền gửi gửi góp của ngân hàng.';
    } else if (currentPath === 'admin-recurring-deposit-products') {
      if (!hasTkgsCreated) {
        currentStep = 2;
        targetSelector = '#tour-create-rd-product-btn';
        stepTitle = 'Bước 2: Tạo sản phẩm Recurring Deposit mới';
        stepSubtitle = 'Mở biểu mẫu khai báo sản phẩm tiền gửi gửi góp mới.';
        stepInstruction = 'Nhấp vào nút "+ Create Recurring Deposit Product" màu xanh ở góc trên bên phải để bắt đầu thiết lập sản phẩm TKB Goal Savings (TKGS).';
      } else {
        currentStep = 8;
        targetSelector = '#tour-rd-product-row-tkgs';
        stepTitle = 'Hoàn tất: Sản phẩm TKB Goal Savings (TKGS) đã được cấu hình';
        stepSubtitle = 'Sản phẩm Tiền gửi gửi góp đã được khởi tạo thành công trên Core Banking!';
        stepInstruction = 'Sản phẩm TKB Goal Savings (TKGS) với định kỳ gửi góp hàng tháng và kỳ hạn 12 tháng đã được lưu vào hệ thống. Nhấn nút "Hoàn thành phần thực hành" bên dưới để hoàn tất.';
      }
    } else if (currentPath === 'admin-create-recurring-deposit-product') {
      const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-details-form'));
      const hasCurrency = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-currency-form'));
      const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-terms-form'));
      const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-settings-form'));
      const hasSlabModal = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-slab-modal'));
      const hasChart = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-chart-form'));
      const hasSlabsTable = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-slabs-table'));
      const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-charges-form'));
      const hasAccounting = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-accounting-form'));
      const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-preview-card'));

      if (hasDetails) {
        currentStep = 3;
        targetSelector = '#tour-rd-details-form';
        if (!rdFilledSteps.details) {
          stepTitle = 'Bước 3: Khai báo tab DETAILS (Thông tin sản phẩm)';
          stepSubtitle = 'Nhập tên sản phẩm, mã viết tắt và mô tả theo đúng hình ảnh tài liệu.';
          stepInstruction = 'Khai báo: Product Name (TKB Goal Savings), Short Name (TKGS), và Description (A recurring deposit product designed to help customers achieve savings goals through regular monthly contributions.). Bấm nút "Điền dữ liệu mẫu Details" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 3: Rà soát dữ liệu tab DETAILS';
          stepSubtitle = 'Dữ liệu đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại Product Name (TKB Goal Savings), Short Name (TKGS) và Description. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Currency" bên dưới.';
        }
      } else if (hasCurrency) {
        currentStep = 4;
        targetSelector = '#tour-rd-currency-form';
        if (!rdFilledSteps.currency) {
          stepTitle = 'Bước 4: Khai báo tab CURRENCY (Đơn vị tiền tệ)';
          stepSubtitle = 'Cấu hình loại tiền tệ VND và số thập phân hiển thị.';
          stepInstruction = 'Khai báo các trường: Currency (Vietnamese Dong), Decimal Places (0), và Currency in multiples of (1). Bấm nút "Điền dữ liệu mẫu Currency" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 4: Rà soát dữ liệu tab CURRENCY';
          stepSubtitle = 'Dữ liệu tiền tệ đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại Currency (Vietnamese Dong), Decimal Places (0), Currency in multiples of (1). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Terms" bên dưới.';
        }
      } else if (hasTerms) {
        currentStep = 5;
        targetSelector = '#tour-rd-terms-form';
        if (!rdFilledSteps.terms) {
          stepTitle = 'Bước 5: Khai báo tab TERMS (Hạn mức & Chu kỳ tính lãi)';
          stepSubtitle = 'Thiết lập hạn mức tiền gửi gửi góp và chu kỳ ghi nhận lãi suất hàng tháng.';
          stepInstruction = 'Khai báo Deposit Amount: Minimum (100000), Default (500000), Maximum (10000000). Cấu hình chu kỳ: Compounding Period (Monthly), Posting Period (Monthly), Calculated using (Daily Balance), Days in Year (365 Days). Bấm nút "Điền dữ liệu mẫu Terms" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 5: Rà soát dữ liệu tab TERMS';
          stepSubtitle = 'Dữ liệu hạn mức và chu kỳ đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại hạn mức tiền gửi gửi góp 100.000 - 10.000.000 VND và chu kỳ tính lãi hàng tháng (Monthly). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Settings" bên dưới.';
        }
      } else if (hasSettings) {
        currentStep = 6;
        targetSelector = '#tour-rd-settings-form';
        if (!rdFilledSteps.settings) {
          stepTitle = 'Bước 6: Khai báo tab SETTINGS (Gửi góp bắt buộc & Kỳ hạn)';
          stepSubtitle = 'Thiết lập gửi góp bắt buộc và kỳ hạn gửi 12 tháng.';
          stepInstruction = 'Tích chọn Is Mandatory Deposit. Khai báo Minimum Deposit Term (Frequency 12, Months), Maximum Deposit Term (Frequency 12, Months). Các mục khác để trống. Bấm nút "Điền dữ liệu mẫu Settings" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 6: Rà soát dữ liệu tab SETTINGS';
          stepSubtitle = 'Dữ liệu kỳ hạn đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại Is Mandatory Deposit đã tích chọn và kỳ hạn 12 Tháng. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Interest Rate Chart" bên dưới.';
        }
      } else if (hasSlabModal) {
        currentStep = 7;
        targetSelector = '#tour-rd-slab-modal';
        stepTitle = 'Bước 7c: Cấu hình bậc lãi suất Slab (1 - 12 Months)';
        stepSubtitle = 'Thiết lập kỳ hạn 1 - 12 tháng với lãi suất 4.0%/năm theo Hình 1.';
        stepInstruction = 'Tại hộp thoại Slab, khai báo: Period Type (Months), Period From (1), Period To (12), Annual Interest % (4.0), Description (Goal Savings 12M - 4.0% p.a.). Bấm nút "Điền dữ liệu mẫu Slab" bên dưới để điền tự động, sau đó nhấn "Add" để thêm vào bảng.';
      } else if (hasChart) {
        currentStep = 7;
        if (hasSlabsTable) {
          targetSelector = '#tour-rd-slabs-table';
          stepTitle = 'Bước 7d: Rà soát Biểu lãi suất & Bậc Slab trong bảng';
          stepSubtitle = 'Bậc lãi suất 1 - 12 Months (4.0% p.a.) đã xuất hiện trên bảng theo Hình 2.';
          stepInstruction = 'Kiểm tra thông tin biểu lãi suất và dòng bậc lãi suất trên bảng: 1 - 12 Months | null - null | 4 | Goal Savings 12M - 4.0% p.a. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Charges" bên dưới.';
        } else if (rdFilledSteps.chartInfo) {
          targetSelector = '#tour-rd-add-slab-btn';
          stepTitle = 'Bước 7b: Nhấn nút + Add Slab';
          stepSubtitle = 'Mở hộp thoại cấu hình bậc lãi suất gửi góp 1 - 12 tháng.';
          stepInstruction = 'Thông tin biểu lãi suất đã được điền đầy đủ. Bây giờ hãy nhấp vào nút "+ Add Slab" màu xanh ở góc phải bảng biểu lãi suất để mở giao diện thêm bậc lãi suất theo Hình 1.';
        } else {
          targetSelector = '#tour-rd-chart-form';
          stepTitle = 'Bước 7a: Khai báo thông tin Biểu lãi suất (Interest Rate Chart)';
          stepSubtitle = 'Nhập tên biểu lãi suất, ngày hiệu lực và mô tả theo tài liệu.';
          stepInstruction = 'Khai báo các trường: Name (TKB Goal Savings Interest 2026), Start Date (10/13/2026), Description (Annual interest rate of 4.0% for TKB Goal Savings with a 12-month deposit term.). Bấm nút "Điền thông tin Biểu lãi suất" bên dưới để điền tự động.';
        }
      } else if (hasCharges) {
        currentStep = 8;
        targetSelector = '#tour-rd-charges-form';
        stepTitle = 'Bước 8: Kiểm tra tab CHARGES (Biểu phí)';
        stepSubtitle = 'Sản phẩm tiết kiệm gửi góp này không áp dụng phí dịch vụ.';
        stepInstruction = 'Theo thiết kế sản phẩm, tab Biểu phí không yêu cầu khai báo vì miễn phí hoàn toàn cho khách hàng. Nhấp vào nút "Next" trên form hoặc nút "Bỏ qua phí và sang Accounting" bên dưới để tiếp tục.';
      } else if (hasAccounting) {
        currentStep = 9;
        targetSelector = '#tour-rd-accounting-form';
        if (!rdFilledSteps.accounting) {
          stepTitle = 'Bước 9: Khai báo tab ACCOUNTING (Hạch toán kế toán Cash Based)';
          stepSubtitle = 'Chọn phương pháp Cash và liên kết các tài khoản sổ cái GL tương ứng.';
          stepInstruction = 'Chọn Cash và gán các tài khoản GL: Saving reference (110201 Settlement Bank Account), Saving control (210104 Recurring Deposits), Transfers in suspense (220201 Clearing Payable), Interest on savings (510101 Savings Interest Expense), Income from fees (420102) & penalties (420108). Bấm nút "Điền dữ liệu mẫu Accounting" bên dưới để điền tự động.';
        } else {
          stepTitle = 'Bước 9: Rà soát tab ACCOUNTING';
          stepSubtitle = 'Đã liên kết đầy đủ các tài khoản sổ cái kế toán Cash Based.';
          stepInstruction = 'Kiểm tra lại các tài khoản GL đã gán (TK 110201, TK 210104, TK 220201, TK 510101, TK 420102, TK 420108). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Preview" bên dưới.';
        }
      } else if (hasPreview) {
        currentStep = 10;
        targetSelector = '#tour-rd-preview-card';
        stepTitle = 'Bước 10: Rà soát tổng thể & Bấm Submit tạo sản phẩm';
        stepSubtitle = 'Kiểm tra toàn bộ các phần cấu hình sản phẩm trước khi chính thức kích hoạt.';
        stepInstruction = 'Rà soát kỹ các thông số sản phẩm: Details, Currency, Terms, Settings, Interest Rate Charts (1 Slab 1-12M 4.0%), Charges và Accounting. Sau đó bấm nút "Submit" màu xanh bên dưới để hoàn tất tạo sản phẩm TKB Goal Savings.';
      } else {
        currentStep = 3;
        targetSelector = '#tour-rd-stepper';
        stepTitle = 'Khai báo sản phẩm Recurring Deposit';
        stepSubtitle = 'Khai báo các tab cấu hình sản phẩm.';
        stepInstruction = 'Thực hiện khai báo theo các bước trên thanh tiến trình.';
      }
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-admin';
      stepTitle = 'Bước 1: Truy cập Admin -> Products';
      stepSubtitle = 'Mở danh mục quản trị sản phẩm từ thanh điều hướng.';
      stepInstruction = 'Bấm vào menu Admin > Products trên thanh điều hướng để mở danh sách sản phẩm.';
    }
  } else if (module === 'saving-part-4') {
    const rd = savingsAccounts.find(s => 
      s.accountNo === '000000004' || 
      (s.externalId === 'TKB-RD-TDU-002' && (s.depositType === 'Recurring Deposit' || s.accountType === 'Recurring Deposit' || s.productName?.toLowerCase().includes('goal')))
    );
    const isApproved = rd?.status === 'Approved';
    const isActive = rd?.status === 'Active' || rd?.status === 'Activated';

    if (currentPath === 'clients') {
      currentStep = 2;
      targetSelector = '#tour-client-row-lan';
      stepTitle = 'Bước 2 / 17: Chọn khách hàng Lan Ngoc Pham';
      stepSubtitle = 'Mở hồ sơ khách hàng Lan Ngoc Pham (Client ID: 000000012, CIF: TKB-CIF-TDU-002).';
      stepInstruction = 'Nhấp vào dòng thông tin khách hàng Lan Ngoc Pham trong danh sách hoặc nút biểu tượng ở cột bên phải để mở chi tiết hồ sơ khách hàng.';
    } else if (currentPath === 'client-detail') {
      const hasDeposited = Boolean(rd?.hasDeposited || (rd?.balance && Number(rd.balance) > 0));
      if (isActive && hasDeposited) {
        currentStep = 16;
        targetSelector = '#tour-client-recurring-deposits-section';
        stepTitle = 'Bước 16 / 17: Đối chiếu số dư trên hồ sơ khách hàng Lan Ngoc Pham';
        stepSubtitle = 'Mục Recurring Deposit Accounts hiển thị tài khoản 000000004 với số dư 500,000.00 VND!';
        stepInstruction = 'Tại hồ sơ khách hàng Lan Ngoc Pham, mục Recurring Deposit Accounts đã ghi nhận tài khoản 000000004 (TKB Goal Savings) ở trạng thái Active (ô vuông xanh lá) và số dư Balance là 500,000.00 VND. Nhấp vào menu Accounting trên thanh điều hướng hoặc bấm nút "Đến Journal Entries kiểm tra sổ cái" bên dưới để kiểm tra hạch toán tự động.';
      } else if (isActive && !hasDeposited) {
        currentStep = 13;
        targetSelector = '#tour-client-recurring-deposits-section';
        stepTitle = 'Bước 13 / 17: Mở chi tiết tài khoản Recurring Deposit để nộp tiền';
        stepSubtitle = 'Tài khoản 000000004 đang ở trạng thái Active. Nhấp vào tài khoản để thực hiện giao dịch.';
        stepInstruction = 'Nhấp vào dòng tài khoản 000000004 trong bảng Recurring Deposit Accounts để mở chi tiết tài khoản và thực hiện nộp tiền.';
      } else {
        const hasSubmenu = typeof document !== 'undefined' && Boolean(document.getElementById('tour-client-new-recurring-deposit-btn'));
        if (!hasSubmenu) {
          currentStep = 3;
          targetSelector = '#tour-client-actions-menu-btn';
          stepTitle = 'Bước 3 / 17: Mở menu thao tác khách hàng';
          stepSubtitle = 'Nhấp menu 3 gạch (≡) trên banner khách hàng Lan Ngoc Pham.';
          stepInstruction = 'Tại banner hồ sơ khách hàng Lan Ngoc Pham, nhấp vào menu Actions (≡) ở góc trên bên phải để mở danh mục thao tác.';
        } else {
          currentStep = 3;
          targetSelector = '#tour-client-new-recurring-deposit-btn';
          stepTitle = 'Bước 3 / 17: Mở đơn đăng ký New Recurring Deposit Account';
          stepSubtitle = 'Chọn Applications > New Recurring Deposit Account.';
          stepInstruction = 'Di chuột đến mục "Applications" và bấm chọn "New Recurring Deposit Account" (có viền đỏ nổi bật theo tài liệu) để mở màn hình tạo tài khoản.';
        }
      }
    } else if (currentPath === 'create-recurring-deposit-account') {
      const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-details-form'));
      const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-terms-form'));
      const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-settings-form'));
      const hasChart = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-chart-form'));
      const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-charges-form'));
      const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-preview-card'));

      if (hasDetails) {
        currentStep = 4;
        targetSelector = '#tour-rda-details-form';
        if (!rdaFilledSteps.details) {
          stepTitle = 'Bước 4 / 17: Khai báo tab DETAILS (Thông tin tài khoản)';
          stepSubtitle = 'Chọn sản phẩm TKB Goal Savings, ngày nộp hồ sơ 10/13/2026 và External ID.';
          stepInstruction = 'Khai báo các trường: Product Name (TKB Goal Savings), Submitted On (10/13/2026), Field Officer (Unassigned), External id (TKB-RD-TDU-002). Bạn có thể tự chọn/nhập hoặc bấm nút "Điền dữ liệu mẫu Details" bên dưới.';
        } else {
          stepTitle = 'Bước 4 / 17: Rà soát dữ liệu tab DETAILS';
          stepSubtitle = 'Dữ liệu đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Kiểm tra lại Product Name (TKB Goal Savings) và External id (TKB-RD-TDU-002). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Terms" bên dưới.';
        }
      } else if (hasTerms) {
        currentStep = 5;
        targetSelector = '#tour-rda-terms-form';
        stepTitle = 'Bước 5 / 17: Kiểm tra tab TERMS (Điều khoản tiền gửi)';
        stepSubtitle = 'Hệ thống tự động đồng bộ kỳ hạn và phương thức tính lãi từ sản phẩm.';
        stepInstruction = 'Rà soát các thông số: Interest Compounding Period (Monthly), Interest Posting Period (Monthly), Interest Calculated Using (Daily Balance), Days in Year (365 Days). Bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Settings" bên dưới.';
      } else if (hasSettings) {
        currentStep = 6;
        targetSelector = '#tour-rda-settings-form';
        if (!rdaFilledSteps.settings) {
          stepTitle = 'Bước 6 / 17: Khai báo tab SETTINGS (Số tiền & Tần suất gửi góp)';
          stepSubtitle = 'Thiết lập số tiền gửi định kỳ 500.000 VND và kỳ hạn 12 tháng theo Hình 3.';
          stepInstruction = 'Tích chọn "Is Mandatory Deposit?", nhập Recurring Deposit Amount (500,000), Deposit Period (12 Months), Deposit Start Date (10/13/2026), Deposit Frequency (1 Months), Min/Max Term (12 Months). Bạn có thể tự nhập hoặc bấm nút "Điền dữ liệu mẫu Settings" bên dưới.';
        } else {
          stepTitle = 'Bước 6 / 17: Rà soát dữ liệu tab SETTINGS';
          stepSubtitle = 'Dữ liệu thiết lập gửi góp đã được điền. Vui lòng kiểm tra lại trước khi sang bước tiếp theo.';
          stepInstruction = 'Rà soát lại số tiền gửi góp 500.000 VND/tháng và kỳ hạn 12 tháng. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Interest Rate Chart" bên dưới.';
        }
      } else if (hasChart) {
        currentStep = 7;
        targetSelector = '#tour-rda-chart-form';
        stepTitle = 'Bước 7 / 17: Kiểm tra INTEREST RATE CHART (Lãi suất tiền gửi góp)';
        stepSubtitle = 'Biểu lãi suất tự động áp dụng 4.00% / năm cho kỳ hạn 12 tháng.';
        stepInstruction = 'Đối chiếu biểu lãi suất TKB Goal Savings: Bậc 1 - 12 Months được áp dụng tỷ lệ 4.00% p.a. Bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Charges" bên dưới.';
      } else if (hasCharges) {
        currentStep = 8;
        targetSelector = '#tour-rda-charges-form';
        stepTitle = 'Bước 8 / 17: Kiểm tra tab CHARGES (Biểu phí)';
        stepSubtitle = 'Sản phẩm tiết kiệm gửi góp không thu phí đăng ký ban đầu.';
        stepInstruction = 'Tab Charges không có khoản phí bắt buộc. Bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Preview" bên dưới.';
      } else if (hasPreview) {
        currentStep = 9;
        targetSelector = '#tour-rda-preview-card';
        stepTitle = 'Bước 9 / 17: Rà soát và Gửi duyệt hồ sơ (Submit)';
        stepSubtitle = 'Kiểm tra lại toàn bộ thông tin đăng ký tài khoản tiết kiệm gửi góp.';
        stepInstruction = 'Rà soát: Khách hàng Lan Ngoc Pham, Sản phẩm TKB Goal Savings, Tiền gửi định kỳ ₫500,000.00/tháng, Kỳ hạn 12 Tháng, Lãi suất 4.00%, Tiền đáo hạn dự kiến ₫6,131,646.00. Bấm nút "Submit" màu xanh để gửi duyệt!';
      } else {
        currentStep = 4;
        targetSelector = '#tour-rda-stepper';
        stepTitle = 'Bước 4 / 17: Tạo tài khoản Recurring Deposit';
        stepSubtitle = 'Khai báo các thông tin mở sổ tiết kiệm gửi góp.';
        stepInstruction = 'Thực hiện khai báo theo các bước trên thanh tiến trình.';
      }
    } else if (currentPath === 'approve-recurring-deposit-account') {
      currentStep = 11;
      targetSelector = '#tour-rd-approve-form';
      stepTitle = 'Bước 11 / 17: Phê duyệt hồ sơ tài khoản (Approved On Date)';
      stepSubtitle = 'Nhập ngày phê duyệt 10/13/2026 và nhấn Confirm.';
      stepInstruction = 'Nhập ngày phê duyệt Approved On Date là 10/13/2026 theo Hình 2. Bạn có thể tự nhập hoặc bấm nút "Điền dữ liệu mẫu (10/13/2026)" bên dưới, sau đó bấm nút "Confirm" màu xanh để phê duyệt hồ sơ.';
    } else if (currentPath === 'deposit-recurring-deposit-account') {
      currentStep = 14;
      targetSelector = '#tour-rd-deposit-form';
      stepTitle = 'Bước 14 / 17: Thực hiện giao dịch nộp tiền (Deposit) vào quỹ tiết kiệm';
      stepSubtitle = 'Khai báo ngày 10/13/2026, số tiền ₫500,000.00 và phương thức Money Transfer.';
      stepInstruction = 'Kiểm tra và điền các trường theo đúng Hình 2: Transaction Date (10/13/2026), Transaction Amount (₫500,000.00), Payment Type Id (Money Transfer). Bạn có thể bấm "Điền dữ liệu mẫu Deposit" bên dưới, sau đó bấm nút "Submit" màu xanh để hoàn tất.';
    } else if (currentPath === 'recurring-deposit-detail') {
      const hasDeposited = Boolean(rd?.hasDeposited || (rd?.balance && Number(rd.balance) > 0));
      if (isActive) {
        if (hasDeposited) {
          currentStep = 15;
          targetSelector = '#tour-rd-account-overview-balance';
          stepTitle = 'Bước 15 / 17: Kiểm tra số dư và lịch sử giao dịch sau nộp tiền';
          stepSubtitle = 'Current Balance hiển thị ₫500,000.00 và Deposits till Date đạt ₫500,000.00 theo Hình 3.';
          stepInstruction = 'Số dư Current Balance đã được cập nhật thành ₫500,000.00 (có viền đỏ theo Hình 3), đồng thời mục Deposits till Date ghi nhận ₫500,000.00 và Interest Earned ghi nhận ₫55.00. Nhấp vào breadcrumb Lan Ngoc Pham hoặc nút "Xem trên hồ sơ khách hàng" để đối chiếu kết quả.';
        } else {
          const hasDepositBtn = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-action-deposit'));
          if (hasDepositBtn) {
            currentStep = 13;
            targetSelector = '#tour-rd-action-deposit';
            stepTitle = 'Bước 13 / 17: Chọn Deposit để nộp tiền vào quỹ tiết kiệm';
            stepSubtitle = 'Chọn Deposit (có biểu tượng mũi tên lên và viền đỏ) theo Hình 1.';
            stepInstruction = 'Nhấp vào mục "Deposit" (có biểu tượng mũi tên lên và viền đỏ theo Hình 1) để mở màn hình nộp tiền vào sổ tiết kiệm.';
          } else {
            currentStep = 13;
            targetSelector = '#tour-rd-actions-menu-btn';
            stepTitle = 'Bước 13 / 17: Mở menu thao tác để nộp tiền (Deposit)';
            stepSubtitle = 'Tài khoản đã Active (ô vuông xanh lá, số dư hiện tại ₫0.00). Tiến hành nộp tiền.';
            stepInstruction = 'Nhấp vào nút menu 3 dấu gạch ngang (≡) ở góc trên bên phải khung banner tài khoản, sau đó chọn mục "Deposit" theo Hình 1 để mở biểu mẫu nộp tiền.';
          }
        }
      } else if (isApproved) {
        const hasActivateBtn = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-action-activate'));
        if (hasActivateBtn) {
          currentStep = 12;
          targetSelector = '#tour-rd-action-activate';
          stepTitle = 'Bước 12 / 17: Chọn Activate để kích hoạt tài khoản';
          stepSubtitle = 'Chọn mục Activate (có viền đỏ) theo Hình 3.';
          stepInstruction = 'Nhấp vào mục "Activate" (có viền đỏ nổi bật theo Hình 3) để kích hoạt tài khoản chính thức.';
        } else {
          currentStep = 12;
          targetSelector = '#tour-rd-actions-menu-btn';
          stepTitle = 'Bước 12 / 17: Mở menu thao tác để Kích hoạt (Activate)';
          stepSubtitle = 'Hồ sơ đã được Approve (ô vuông màu tím). Tiếp tục kích hoạt tài khoản.';
          stepInstruction = 'Hồ sơ đã chuyển sang trạng thái "Approved" (ô vuông màu tím theo Hình 3). Nhấp vào menu 3 dấu gạch ngang (≡) và chọn mục "Activate" (có viền đỏ) theo Hình 3 để kích hoạt tài khoản chính thức.';
        }
      } else {
        const hasApproveBtn = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-action-approve'));
        if (hasApproveBtn) {
          currentStep = 10;
          targetSelector = '#tour-rd-action-approve';
          stepTitle = 'Bước 10 / 17: Chọn Approve để phê duyệt hồ sơ';
          stepSubtitle = 'Chọn mục Approve (có viền đỏ) theo Hình 1.';
          stepInstruction = 'Nhấp vào mục "Approve" (có viền đỏ nổi bật theo Hình 1) để mở màn hình phê duyệt tài khoản.';
        } else {
          currentStep = 10;
          targetSelector = '#tour-rd-actions-menu-btn';
          stepTitle = 'Bước 10 / 17: Mở menu thao tác để Phê duyệt (Approve)';
          stepSubtitle = 'Hồ sơ đang ở trạng thái Pending Approval (ô vuông màu cam). Tiến hành phê duyệt.';
          stepInstruction = 'Nhấp vào nút menu 3 dấu gạch ngang (≡) ở góc trên bên phải khung banner tài khoản, sau đó chọn mục "Approve" (có dấu tích, viền đỏ) theo Hình 1 để mở biểu mẫu phê duyệt.';
        }
      }
    } else if (currentPath === 'accounting') {
      currentStep = 17;
      targetSelector = '#tour-search-journal-tile';
      stepTitle = 'Bước 17 / 17: Mở Search journal entries';
      stepSubtitle = 'Truy cập nhật ký sổ cái kế toán để xem các bút toán tự động.';
      stepInstruction = 'Nhấp vào mục "Search journal entries" để mở màn hình tra cứu nhật ký hạch toán sổ cái của hệ thống.';
    } else if (currentPath === 'accounting-journal' || currentPath === 'accounting-journal-entries') {
      currentStep = 17;
      targetSelector = '#tour-journal-entry-rd-deposit';
      stepTitle = 'Bước 17 / 17: Kiểm tra lịch sử hạch toán tự động (Journal Entries) & Hoàn tất Phân hệ 03!';
      stepSubtitle = 'Hệ thống tự động ghi nhận 2 bút toán Nợ TK 110201 và Có TK 210104 cho số tiền 500.000 VND.';
      stepInstruction = 'Tại bảng Journal Entries, hệ thống đã tự động ghi nhận 2 bút toán cho giao dịch gửi tiền của sổ 000000004: Nợ TK 110201 (Settlement Bank Account) ₫500,000.00 và Có TK 210104 (Recurring Deposits) ₫500,000.00. Toàn bộ vòng đời sản phẩm tiết kiệm gửi góp và hạch toán kế toán đã hoàn tất. Bấm nút "Hoàn thành phần thực hành" bên dưới để kết thúc Phân hệ 03!';
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-institution';
      stepTitle = 'Bước 1 / 17: Mở danh sách khách hàng (Clients)';
      stepSubtitle = 'Truy cập danh mục quản lý khách hàng từ thanh điều hướng.';
      stepInstruction = 'Bấm vào menu Institution > Clients trên thanh điều hướng để mở danh sách khách hàng.';
    }
  } else if (module === 'loan-part-1') {
    const hasLoanProductCreated = loanProducts.some(p => 
      p.shortName === 'Loan' || p.shortName === 'TKPL' || p.externalId === 'TKB-PRD-PL-001' || p.name === 'TKB Personal Loan'
    );

    if (currentPath === 'admin-products') {
      currentStep = 3;
      targetSelector = '#tour-loan-products-tile';
      stepTitle = 'Bước 3 / 13: Chọn mục Loan Products';
      stepSubtitle = 'Mở danh sách các sản phẩm tín dụng và gói vay.';
      stepInstruction = 'Tại bảng Products, nhấp vào dòng "Loan Products" ở cột bên trái để chuyển tới danh sách sản phẩm gói vay.';
    } else if (currentPath === 'admin-loan-products') {
      if (hasLoanProductCreated) {
        currentStep = 13;
        targetSelector = '#tour-loan-product-row-loan';
        stepTitle = 'Bước 13 / 13: Hoàn tất tạo gói vay TKB Personal Loan (Hình 2)!';
        stepSubtitle = 'Sản phẩm TKB Personal Loan (mã: TKPL) đã được tạo và kích hoạt thành công trên Core Banking!';
        stepInstruction = 'Sản phẩm cho vay cá nhân trả góp TKB Personal Loan (TKPL) đã xuất hiện trên danh mục sản phẩm tín dụng với trạng thái hoạt động (chấm tròn xanh). Nhấn nút "Hoàn thành phần thực hành (Phân hệ 04 - Phần 1)" bên dưới để hoàn tất bài học.';
      } else {
        currentStep = 4;
        targetSelector = '#tour-create-loan-product-btn';
        stepTitle = 'Bước 4 / 13: Nhấp nút Create Loan Product';
        stepSubtitle = 'Mở biểu mẫu khai báo gói vay tín dụng mới.';
        stepInstruction = 'Nhấp vào nút "+ Create Loan Product" màu xanh ở góc trên bên phải để bắt đầu thiết lập sản phẩm TKB Personal Loan.';
      }
    } else if (currentPath === 'admin-create-loan-product') {
      const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-details-form'));
      const hasCurrency = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-currency-form'));
      const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-settings-form'));
      const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-terms-form'));
      const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-charges-form'));
      const hasAccounting = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-accounting-form'));
      const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-preview-card'));

      if (hasDetails) {
        currentStep = 5;
        targetSelector = '#tour-loan-details-form';
        if (!loanFilledSteps.details) {
          stepTitle = 'Bước 5 / 13: Khai báo tab DETAILS (Thông tin sản phẩm - Hình 1)';
          stepSubtitle = 'Nhập tên gói vay, mã viết tắt, mã External ID, ngày bắt đầu và mô tả.';
          stepInstruction = 'Khai báo các trường: Product Name (TKB Personal Loan), Short Name (Loan), External Id (TKB-PRD-PL-001), Start Date (10/13/2026), Description (Personal installment loan with monthly repayments and declining balance interest calculation.). Bấm nút "Điền dữ liệu mẫu Details" bên dưới để điền nhanh.';
        } else {
          stepTitle = 'Bước 5 / 13: Rà soát dữ liệu tab DETAILS';
          stepSubtitle = 'Thông tin chi tiết gói vay đã được điền đầy đủ.';
          stepInstruction = 'Kiểm tra lại Product Name (TKB Personal Loan), Short Name (Loan) và Description. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Currency" bên dưới.';
        }
      } else if (hasCurrency) {
        currentStep = 6;
        targetSelector = '#tour-loan-currency-form';
        if (!loanFilledSteps.currency) {
          stepTitle = 'Bước 6 / 13: Thiết lập tab CURRENCY (Đơn vị tiền tệ - Hình 2)';
          stepSubtitle = 'Cấu hình loại tiền tệ VND và quy cách làm tròn số thập phân.';
          stepInstruction = 'Khai báo các trường: Currency (Vietnamese Dong), Decimal Places (0), Currency in multiples of (1), Installment in multiples of (1). Bấm nút "Điền dữ liệu mẫu Currency" bên dưới để điền nhanh.';
        } else {
          stepTitle = 'Bước 6 / 13: Rà soát dữ liệu tab CURRENCY';
          stepSubtitle = 'Thông số đơn vị tiền tệ đã được điền đầy đủ.';
          stepInstruction = 'Kiểm tra lại Currency (Vietnamese Dong), Decimal Places (0), Currency in multiples of (1). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Settings" bên dưới.';
        }
      } else if (hasSettings) {
        if (loanSettingsSubStep === 'part1' && !loanFilledSteps.settingsPart1) {
          currentStep = 7;
          targetSelector = '#tour-loan-settings-part1';
          stepTitle = 'Bước 7 / 13: Cấu hình tab SETTINGS (Phần 1: Tính lãi & Lịch trả nợ - Hình 3)';
          stepSubtitle = 'Cấu hình Amortization, Declining Balance, và Repayment Strategy.';
          stepInstruction = 'Khai báo: Amortization (Equal installments), Interest Method (Declining Balance), Interest calculation period (Daily), Loan Schedule Type (Cumulative), Repayment strategy (Interest, Principal, Penalties, Fees Order), Arrears tolerance (0), Days in year (365 Days), Days in month (Actual). Bấm nút "Điền dữ liệu mẫu Settings (Phần 1)" bên dưới.';
        } else {
          currentStep = 8;
          targetSelector = '#tour-loan-settings-part2';
          if (!loanFilledSteps.settingsPart2) {
            stepTitle = 'Bước 8 / 13: Cấu hình tab SETTINGS (Phần 2: Nợ quá hạn NPA & Ghi đè - Hình 4)';
            stepSubtitle = 'Thiết lập 90 ngày NPA và tích chọn 8 mục cho phép ghi đè.';
            stepInstruction = 'Khai báo: Overdue days for NPA (90), Tích chọn "Account moves out of NPA only after all arrears have been cleared", Tích chọn "Allow overriding select terms and settings in loan accounts" và bật cả 8 mục con. Sau đó bấm Next để chuyển sang tab Terms.';
          } else {
            stepTitle = 'Bước 8 / 13: Rà soát tab SETTINGS';
            stepSubtitle = 'Đã hoàn tất cấu hình toàn bộ cài đặt gói vay.';
            stepInstruction = 'Rà soát lại phương thức Declining Balance, 90 ngày NPA và 8 mục cho phép ghi đè. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Terms" bên dưới.';
          }
        }
      } else if (hasTerms) {
        currentStep = 9;
        targetSelector = '#tour-loan-terms-form';
        if (!loanFilledSteps.terms) {
          stepTitle = 'Bước 9 / 13: Thiết lập tab TERMS (Hạn mức, Kỳ hạn & Lãi suất - Hình 5)';
          stepSubtitle = 'Cấu hình hạn mức 5M - 10M - 50M, 12 kỳ trả nợ, lãi suất danh nghĩa 12%/năm.';
          stepInstruction = 'Khai báo: Principal (Min: 5000000, Default: 10000000, Max: 50000000), Installment day calculation from (Disbursement Date), Number of repayments (Min: 6, Default: 12, Max: 24), Nominal interest rate (Min: 10, Default: 12, Max: 16, Frequency: Per year), Repaid every (1 Months). Bấm nút "Điền dữ liệu mẫu Terms" bên dưới.';
        } else {
          stepTitle = 'Bước 9 / 13: Rà soát tab TERMS';
          stepSubtitle = 'Thông số hạn mức và lãi suất vay đã được thiết lập.';
          stepInstruction = 'Kiểm tra lại hạn mức 10.000.000 VND, 12 kỳ trả nợ và lãi suất 12.0%/năm. Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab Charges" bên dưới.';
        }
      } else if (hasCharges) {
        currentStep = 10;
        targetSelector = '#tour-loan-charges-form';
        stepTitle = 'Bước 10 / 13: Kiểm tra tab CHARGES (Biểu phí)';
        stepSubtitle = 'Gói vay tiêu dùng tín chấp TKB Personal Loan không thu phí ban đầu.';
        stepInstruction = 'Theo thiết kế, tab Biểu phí để trống. Nhấp vào nút "Next" trên form hoặc nút "Tiếp tục sang tab Accounting" bên dưới.';
      } else if (hasAccounting) {
        currentStep = 11;
        targetSelector = '#tour-loan-accounting-form';
        stepTitle = 'Bước 11 / 13: Thiết lập tab ACCOUNTING (Hạch toán kế toán - Hình 1)';
        stepSubtitle = 'Chọn phương thức Cash và ánh xạ đầy đủ 17 tài khoản sổ cái GL.';
        stepInstruction = 'Chọn quy tắc kế toán Cash và liên kết 17 tài khoản sổ cái GL tương ứng: Nguồn vốn (110201), Dư nợ (120101), Trung gian (130101), Doanh thu lãi (410101), Phí (420109), Phạt (420103), Thu hồi (420110), Tổn thất xóa nợ (520101), Thu quá (220202)... Bấm nút "Điền mẫu Accounting (Cash) & Sang Preview" bên dưới để hoàn tất nhanh.';
      } else if (hasPreview) {
        currentStep = 12;
        targetSelector = '#tour-loan-preview-card';
        stepTitle = 'Bước 12 / 13: Rà soát tab PREVIEW & Submit tạo gói vay (Hình 3 & 4)';
        stepSubtitle = 'Kiểm tra toàn bộ 5 phân mục: Details, Currency, Terms, Settings, Accounting.';
        stepInstruction = 'Rà soát kỹ các thông số gói vay cá nhân TKB Personal Loan (mã: TKPL). Sau đó bấm nút "Submit" màu xanh ở cuối biểu mẫu để chính thức tạo sản phẩm trên Core Banking.';
      } else {
        currentStep = 5;
        targetSelector = '#tour-loan-stepper';
        stepTitle = 'Khai báo gói vay TKB Personal Loan';
        stepSubtitle = 'Thực hiện khai báo theo các bước trên thanh tiến trình.';
        stepInstruction = 'Thực hiện khai báo theo các tab từ Details đến Preview.';
      }
    } else {
      const hasAdminDropdown = typeof document !== 'undefined' && Boolean(document.getElementById('tour-admin-products'));
      if (hasAdminDropdown) {
        currentStep = 2;
        targetSelector = '#tour-admin-products';
        stepTitle = 'Bước 2 / 13: Chọn mục Products trong menu Admin';
        stepSubtitle = 'Mở danh mục quản lý sản phẩm.';
        stepInstruction = 'Trong menu Admin xổ xuống, nhấp vào mục Products để chuyển tới danh mục sản phẩm của ngân hàng.';
      } else {
        currentStep = 1;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 1 / 13: Mở menu Admin trên thanh điều hướng';
        stepSubtitle = 'Nhấp menu Admin để mở danh mục chức năng quản trị hệ thống.';
        stepInstruction = 'Tại thanh menu ngang trên cùng, nhấp vào menu Admin để mở danh mục các chức năng quản trị.';
      }
    }
  } else if (module === 'loan-part-2') {
    const targetLoan = (loans || []).find(
      l => l.externalId === 'TKB-PL-TDU-001' || l.accountNo === '000000001'
    ) || (selectedLoan?.externalId === 'TKB-PL-TDU-001' || selectedLoan?.accountNo === '000000001' ? selectedLoan : null);
    const hasLoanAccountCreated = Boolean(targetLoan);
    const targetLoanStatus = typeof targetLoan?.status === 'string' ? targetLoan.status : (targetLoan?.status?.value || '');
    const isLoanPending = hasLoanAccountCreated && (
      targetLoanStatus.toLowerCase().includes('pending') || targetLoanStatus.toLowerCase().includes('submitted')
    );
    const isLoanApproved = hasLoanAccountCreated && (
      targetLoanStatus.toLowerCase().includes('approved') && !isLoanPending
    );
    const isLoanActive = hasLoanAccountCreated && (
      targetLoanStatus.toLowerCase().includes('active')
    );

    if (currentPath === 'client-detail') {
      if (hasLoanAccountCreated) {
        currentStep = 10;
        targetSelector = '#tour-client-loan-link-000000001';
        stepTitle = 'Bước 10 / 15: Mở chi tiết hồ sơ vay vốn 000000001';
        stepSubtitle = 'Hồ sơ vay 000000001 (TKB-PL-TDU-001) đã được tạo thành công ở trạng thái Pending Approval (ô màu cam).';
        stepInstruction = 'Tại bảng Loan Accounts, nhấp vào số tài khoản khoản vay "000000001" (TKB Personal Loan) để mở trang chi tiết hồ sơ vay vốn và tiến hành quy trình phê duyệt.';
      } else {
        const hasSubmenu = typeof document !== 'undefined' && Boolean(document.getElementById('tour-client-new-loan-account-btn'));
        if (hasSubmenu) {
          currentStep = 2;
          targetSelector = '#tour-client-new-loan-account-btn';
          stepTitle = 'Bước 2 / 15: Chọn New Loan Account (Hình 1)';
          stepSubtitle = 'Mở biểu mẫu tiếp nhận hồ sơ vay vốn mới cho khách hàng.';
          stepInstruction = 'Trong menu con Applications xổ xuống, nhấp vào dòng "New Loan Account" (viền đỏ nổi bật) để chuyển sang màn hình Create Loans Account.';
        } else {
          currentStep = 1;
          targetSelector = '#tour-client-actions-menu-btn';
          stepTitle = 'Bước 1 / 15: Mở Menu tác vụ khách hàng (Hình 1)';
          stepSubtitle = 'Nhấp vào nút menu hamburger ở góc trên bên phải thanh tiêu đề xanh.';
          stepInstruction = 'Tại trang chi tiết khách hàng Minh Quang Tran (CIF: TKB-CIF-TDU-001), nhấp vào biểu tượng menu hamburger (ba dấu gạch ngang) để mở danh sách thao tác hồ sơ.';
        }
      }
    } else if (currentPath === 'create-loan-account') {
      const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-details-form'));
      const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-terms-form'));
      const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-charges-form'));
      const hasSchedule = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-schedule-card'));
      const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-preview-card'));

      if (hasDetails) {
        currentStep = 3;
        targetSelector = '#tour-loan-acc-details-form';
        if (!loanAccFilledSteps.details) {
          stepTitle = 'Bước 3 / 15: Khai báo Tab 1: DETAILS (Hình 2)';
          stepSubtitle = 'Chọn sản phẩm TKB Personal Loan, nhập External id, cán bộ quản lý và ngày nộp hồ sơ.';
          stepInstruction = 'Khai báo các trường: Product Name (TKB Personal Loan), External id (TKB-PL-TDU-001), Loan officer (Mai, Son), Submitted on (10/14/2026), Disbursement on (10/14/2026). Bấm nút "Điền dữ liệu mẫu Details" bên dưới để điền nhanh.';
        } else {
          stepTitle = 'Bước 3 / 15: Rà soát dữ liệu Tab 1: DETAILS';
          stepSubtitle = 'Thông tin chi tiết hồ sơ vay đã được điền đầy đủ.';
          stepInstruction = 'Kiểm tra lại Product Name (TKB Personal Loan), External id (TKB-PL-TDU-001). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab TERMS" bên dưới.';
        }
      } else if (hasTerms) {
        currentStep = 4;
        targetSelector = '#tour-loan-acc-terms-form';
        if (!loanAccFilledSteps.terms) {
          stepTitle = 'Bước 4 / 15: Thiết lập Tab 2: TERMS (Hình 3)';
          stepSubtitle = 'Nhập số tiền vay 10.000.000 VND, kỳ hạn 12 tháng, lãi suất 12%/năm dư nợ giảm dần.';
          stepInstruction = 'Khai báo: Principal (10,000,000.00), Loan Term (12 Months), Number of repayments (12), First repayment on (11/14/2026), Nominal interest rate (12% Per year), Amortization (Equal installments), Interest Method (Declining Balance). Giữ nguyên tích chọn "Calculate interest for exact days in partial period". Bấm nút "Điền dữ liệu mẫu Terms" bên dưới để điền nhanh.';
        } else {
          stepTitle = 'Bước 4 / 15: Rà soát dữ liệu Tab 2: TERMS';
          stepSubtitle = 'Điều khoản vay và tính lãi đã được thiết lập đầy đủ.';
          stepInstruction = 'Kiểm tra lại Principal (10,000,000.00), Loan Term (12), Rate (12%). Sau đó bấm nút "Next" trên form hoặc nút "Tiếp tục sang tab CHARGES" bên dưới.';
        }
      } else if (hasCharges) {
        currentStep = 5;
        targetSelector = '#tour-loan-acc-charges-form';
        stepTitle = 'Bước 5 / 15: Kiểm tra Tab 3: CHARGES';
        stepSubtitle = 'Gói vay không áp dụng chi phí phụ thu ban đầu.';
        stepInstruction = 'Tab Charges để trống theo chính sách sản phẩm. Nhấn nút "Next" trên form hoặc nút "Tiếp tục sang tab REPAYMENT SCHEDULE" bên dưới.';
      } else if (hasSchedule) {
        const isConsoleModalInDOM = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-console-modal'));
        const isFixInstalled = loanAccFilledSteps.tkbFix || (typeof window !== 'undefined' && Boolean(window.__tkbLoanFixInstalled));
        const isGenerated = loanAccFilledSteps.scheduleGenerated;

        if (isConsoleModalInDOM) {
          if (!isFixInstalled) {
            currentStep = 6;
            targetSelector = '#tour-loan-acc-console-run-btn';
            stepTitle = 'Bước 6 / 15: Chạy Script TKB FIX trong F12 Console';
            stepSubtitle = 'Thực thi script hook để loại bỏ tham số không hỗ trợ allowPartialPeriodInterestCalculation.';
            stepInstruction = 'Cửa sổ giả lập Chrome DevTools Console (F12) đang mở. Nhấp vào nút "Chạy lệnh (Run Script)" màu xanh để thực thi đoạn mã loại bỏ tham số lỗi.';
          } else {
            currentStep = 6;
            targetSelector = '#tour-loan-acc-console-close-btn';
            stepTitle = 'Bước 6 / 15: Đóng cửa sổ F12 DevTools Console';
            stepSubtitle = 'Script TKB FIX đã cài đặt thành công (TKB FIX: Installed).';
            stepInstruction = 'Đoạn mã khắc phục lỗi đã được kích hoạt thành công. Nhấp vào nút "Đóng" (hoặc dấu X) để quay lại màn hình và tiến hành tạo lịch trả nợ.';
          }
        } else if (!isGenerated) {
          if (!isFixInstalled) {
            currentStep = 6;
            targetSelector = '#tour-loan-acc-open-console-btn';
            stepTitle = 'Bước 6 / 15: Tab 4: REPAYMENT SCHEDULE & Mở F12 DevTools Console (Hình 4)';
            stepSubtitle = 'Cần chạy script F12 Console để loại bỏ tham số không hỗ trợ allowPartialPeriodInterestCalculation.';
            stepInstruction = 'Nếu bấm "Generate Repayment Schedule" lúc này, hệ thống sẽ báo lỗi 400. Nhấn nút "Mở Chrome DevTools Console (F12)" màu xám đen để mở cửa sổ Console, sau đó thực thi đoạn mã TKB FIX.';
          } else {
            currentStep = 7;
            targetSelector = '#tour-loan-acc-generate-schedule-btn';
            stepTitle = 'Bước 7 / 15: Nhấp Generate Repayment Schedule (Hình 4)';
            stepSubtitle = 'Script workaround đã được cài đặt thành công! Hệ thống đã sẵn sàng sinh lịch trả nợ.';
            stepInstruction = 'Nhấn nút "Generate Repayment Schedule" màu xanh để gửi yêu cầu tính toán và kết xuất bảng tính 12 kỳ trả nợ.';
          }
        } else {
          currentStep = 8;
          targetSelector = '#tour-loan-acc-schedule-table';
          stepTitle = 'Bước 8 / 15: Rà soát bảng tính lịch trả nợ 12 kỳ (Hình 5)';
          stepSubtitle = 'Bảng tính 12 kỳ trả nợ đã được kết xuất chuẩn xác!';
          stepInstruction = 'Kiểm tra kỳ 1 (14/11/2026, dòng màu xanh): Gốc 788.487,89 VND, Lãi 100.000,00 VND, Phải trả 888.487,89 VND. Dòng tổng cộng: Gốc 10.000.000,00 VND, Lãi 661.854,64 VND, Tổng 10.661.854,64 VND. Nhấn nút "Next" trên form hoặc nút "Tiếp tục sang tab PREVIEW" bên dưới.';
        }
      } else if (hasPreview) {
        currentStep = 9;
        targetSelector = '#tour-loan-acc-submit-btn';
        stepTitle = 'Bước 9 / 15: Rà soát Tab 5: PREVIEW & Nhấn Submit hồ sơ';
        stepSubtitle = 'Kiểm tra toàn bộ thông tin hồ sơ vay và chính thức nộp lên hệ thống.';
        stepInstruction = 'Rà soát thông tin chi tiết gói vay TKB Personal Loan của khách hàng Minh Quang Tran. Nhấn nút "Submit" màu xanh ở góc dưới để nộp hồ sơ vay vốn lên hệ thống Core Banking.';
      } else {
        currentStep = 3;
        targetSelector = '#tour-loan-acc-stepper';
        stepTitle = 'Khai báo hồ sơ vay vốn TKB Personal Loan';
        stepSubtitle = 'Thực hiện khai báo theo các bước trên thanh tiến trình.';
        stepInstruction = 'Thực hiện khai báo theo các tab từ Details đến Preview.';
      }
    } else if (currentPath === 'loan-detail') {
      if (isLoanPending) {
        const hasApproveOption = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-action-approve-btn'));
        if (hasApproveOption) {
          currentStep = 11;
          targetSelector = '#tour-loan-action-approve-btn';
          stepTitle = 'Bước 11 / 15: Chọn tác vụ Approve (Hình 2)';
          stepSubtitle = 'Thực hiện phê duyệt hồ sơ vay vốn theo quy trình thẩm định.';
          stepInstruction = 'Trong danh sách menu tác vụ xổ xuống, nhấp vào dòng "Approve" (có dấu tích) để mở biểu mẫu phê duyệt hồ sơ vay.';
        } else {
          currentStep = 11;
          targetSelector = '#tour-loan-actions-menu-btn';
          stepTitle = 'Bước 11 / 15: Mở Menu tác vụ hồ sơ vay (Hình 1 & Hình 2)';
          stepSubtitle = 'Hồ sơ đang ở trạng thái Submitted and pending approval (ô vuông màu cam).';
          stepInstruction = 'Nhấp vào nút menu hamburger ở góc trên bên phải thanh tiêu đề xanh của hồ sơ vay để mở danh sách thao tác.';
        }
      } else if (isLoanApproved) {
        const hasDisburseOption = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-action-disburse-btn'));
        if (hasDisburseOption) {
          currentStep = 13;
          targetSelector = '#tour-loan-action-disburse-btn';
          stepTitle = 'Bước 13 / 15: Chọn tác vụ Disburse';
          stepSubtitle = 'Tiến hành giải ngân khoản vay cho khách hàng Minh Quang Tran.';
          stepInstruction = 'Trong danh sách menu tác vụ xổ xuống, nhấp vào dòng "Disburse" (có dấu tích xanh) để chuyển sang màn hình giải ngân.';
        } else {
          currentStep = 13;
          targetSelector = '#tour-loan-actions-menu-btn';
          stepTitle = 'Bước 13 / 15: Mở Menu tác vụ giải ngân (Hình 2)';
          stepSubtitle = 'Hồ sơ đã được phê duyệt thành công (Approved, ô vuông xanh dương).';
          stepInstruction = 'Nhấp vào nút menu hamburger ở góc trên bên phải thanh tiêu đề xanh để mở danh sách thao tác tiếp theo.';
        }
      } else if (isLoanActive) {
        currentStep = 15;
        targetSelector = '#tour-loan-summary-card';
        stepTitle = 'Bước 15 / 15: Rà soát Hồ sơ khoản vay Active & Hoàn tất thực hành (Hình 5)';
        stepSubtitle = 'Khoản vay đã được giải ngân thành công và chuyển sang trạng thái Active (ô vuông xanh lá)!';
        stepInstruction = 'Đối soát các chỉ số: Account Overview (Current Balance: ₫10.661.854,64, Arrears By: ₫0.00), Performance History (Repayments: 12.00, Maturity Date: 14 October 2027), Loan Summary (Gốc: ₫10.000.000,00, Lãi: ₫661.854,64, Tổng: ₫10.661.854,64). Bút toán giải ngân Nợ TK 130101 / Có TK 110101 đã tự động hạch toán vào Sổ cái. Nhấn nút "Hoàn thành phần thực hành (Phân hệ 04 - Phần 2)" bên dưới để kết thúc bài học.';
      } else {
        currentStep = 10;
        targetSelector = '#tour-loan-detail-banner';
        stepTitle = 'Chi tiết hồ sơ vay vốn';
        stepSubtitle = 'Hồ sơ vay vốn của khách hàng Minh Quang Tran.';
        stepInstruction = 'Thực hiện các thao tác theo hướng dẫn.';
      }
    } else if (currentPath === 'approve-loan') {
      currentStep = 12;
      targetSelector = '#tour-loan-approve-submit-btn';
      stepTitle = 'Bước 12 / 15: Rà soát & Phê duyệt khoản vay (Hình 3)';
      stepSubtitle = 'Kiểm tra thông tin Approved On, Expected disbursement on, Approved Amount 10,000,000.00 VND.';
      stepInstruction = 'Kiểm tra thông tin ngày phê duyệt (10/14/2026), ngày dự kiến giải ngân (10/14/2026), số tiền phê duyệt (10,000,000.00 VND). Nhấn nút "Submit" màu xanh để hoàn tất phê duyệt hồ sơ vay vốn.';
    } else if (currentPath === 'disburse-loan') {
      currentStep = 14;
      targetSelector = '#tour-loan-disburse-submit-btn';
      stepTitle = 'Bước 14 / 15: Thực hiện giải ngân khoản vay (Hình 4)';
      stepSubtitle = 'Khai báo Disbursed On, Transaction Amount 10,000,000.00 VND, Payment Type Money Transfer.';
      stepInstruction = 'Kiểm tra các thông tin giải ngân: Disbursed On (10/14/2026), Transaction Amount (10,000,000.00 VND), External Id (TKB-PL-TDU-001), Payment Type (Money Transfer), Note (TKB Personal Loan - Full Disbursement). Nhấn nút "Submit" màu xanh để thực hiện giải ngân và tự động hạch toán bút toán Sổ cái GL.';
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-clients';
      stepTitle = 'Bước 1 / 15: Chuyển đến hồ sơ khách hàng Minh Quang Tran';
      stepSubtitle = 'Mở thông tin chi tiết khách hàng Minh Quang Tran để tiếp nhận hồ sơ vay vốn.';
      stepInstruction = 'Bấm vào nút "Chuyển đến hồ sơ khách hàng Minh Quang Tran" bên dưới để bắt đầu luồng thực hành.';
    }
  } else if (module === 'treasury-part-1') {
    if (currentPath === 'accounting-view-transaction') {
      currentStep = 6;
      totalSteps = 6;
      targetSelector = '#tour-view-transaction-screen';
      stepTitle = 'Bước 6 / 6: Hạch toán Vay liên ngân hàng thành công (Mã: a2fbdc3d0f2f - Hình 2)';
      stepSubtitle = 'Giao dịch hạch toán Vay vốn liên ngân hàng 20.000.000 VND đã được ghi nhận vào Sổ cái.';
      stepInstruction = 'Đối soát 2 dòng hạch toán kép: Entry ID 78 (Nợ TK 110201 Settlement Bank Account: VND 20,000,000.00) và Entry ID 79 (Có TK 220401 Interbank Borrowings: VND 20,000,000.00) khớp 100% với Hình 2. Khối Treasury đã tái lập thanh khoản an toàn cho Takashimaya Bank! Nhấn nút "Hoàn thành phần thực hành (Phân hệ 05: Treasury)" bên dưới để kết thúc bài học.';
    } else if (currentPath === 'accounting-create-journal') {
      currentStep = 5;
      totalSteps = 6;
      const submitBtn = typeof document !== 'undefined' && document.getElementById('tour-manual-journal-submit-btn');
      targetSelector = submitBtn ? '#tour-manual-journal-submit-btn' : '#tour-manual-journal-form';
      stepTitle = 'Bước 5 / 6: Nhập thông tin Vay vốn liên ngân hàng 20M VND (Hình 1)';
      stepSubtitle = 'Lập bút toán Vay vốn thị trường liên ngân hàng 30 ngày, lãi suất 6%/năm.';
      stepInstruction = 'Nhập thông tin theo Hình 1: Office "Takashimaya Bank (TKB) - HO", Currency "VND", Nợ TK (110201) Settlement Bank Account 20.000.000 VND, Có TK (220401) Interbank Borrowings 20.000.000 VND, Ref "TKB-TRE-IB-001", Date "10/14/2026", Payment "Money Transfer", Comments "Interbank borrowing - VND 20M - 30 days - 6% p.a.". Bạn có thể bấm nút "Tự động điền dữ liệu Vay liên ngân hàng (Hình 1)" ở popup bên cạnh để điền nhanh, sau đó bấm nút "Submit" màu xanh để gửi bút toán.';
    } else if (currentPath === 'accounting-journal' || currentPath === 'accounting-journal-entries') {
      const isInterbankPresent = typeof window !== 'undefined' && (localStorage.getItem('tkb_treasury_interbank_done') === 'true' || Boolean(window.__tkbTreasuryInterbankDone));
      if (isInterbankPresent) {
        currentStep = 6;
        totalSteps = 6;
        targetSelector = '#tour-journal-entry-interbank';
        stepTitle = 'Bước 6 / 6: Đối soát bút toán Vay vốn liên ngân hàng trên Sổ Nhật ký';
        stepSubtitle = 'Cặp bút toán Entry 78 & 79 đã xuất hiện trên Sổ Nhật ký chung.';
        stepInstruction = 'Quan sát 2 dòng bút toán màu xanh lục nổi bật: Entry 78 Nợ TK 110201 (20.000.000 VND) và Entry 79 Có TK 220401 (20.000.000 VND) với Transaction ID a2fbdc3d0f2f. Nhấp vào mã giao dịch a2fbdc3d0f2f để xem chi tiết giao dịch theo Hình 2, hoặc nhấn "Hoàn thành phần thực hành" bên dưới.';
      } else {
        currentStep = 3;
        totalSteps = 6;
        targetSelector = '#tour-journal-add-btn';
        stepTitle = 'Bước 3 / 6: Phân tích Dòng tiền & Chuyển sang Vay vốn liên ngân hàng';
        stepSubtitle = 'Rà soát biến động dòng tiền vào / ra và giải quyết thâm hụt thanh khoản ròng.';
        stepInstruction = 'Xem bảng phân tích dòng tiền trong popup bên cạnh: Dòng tiền thuần hoạt động trong kỳ đang bị âm (-12.6M VND), cần thực hiện nghiệp vụ Vay vốn trên thị trường liên ngân hàng 20.000.000 VND để bù đắp thanh khoản. Nhấn nút "+ Add Journal Entry" (hoặc bấm nút "Chuyển sang form Vay vốn liên ngân hàng" bên dưới) để tiếp tục.';
      }
    } else if (currentPath === 'accounting') {
      currentStep = 2;
      totalSteps = 6;
      targetSelector = '#tour-search-journal-tile';
      stepTitle = 'Bước 2 / 6: Tra cứu Sổ Nhật ký chung (Search Journal Entries)';
      stepSubtitle = 'Mở sổ cái để xem các giao dịch phát sinh từ các phân hệ trước.';
      stepInstruction = 'Nhấp chọn ô "Search Journal Entries" để truy cập bảng tra cứu toàn bộ các bút toán hạch toán của Ngân hàng TKB và thực hiện phân tích dòng tiền.';
    } else {
      currentStep = 1;
      totalSteps = 6;
      targetSelector = '#tour-nav-accounting';
      stepTitle = 'Bước 1 / 6: Truy cập phân hệ Kế toán (Accounting)';
      stepSubtitle = 'Bắt đầu luồng thực hành Phân hệ 05: Treasury & Quản trị thanh khoản.';
      stepInstruction = 'Nhấp chọn menu "Accounting" trên thanh điều hướng trên cùng (hoặc bấm nút "Đến trang Accounting" bên dưới) để bắt đầu quy trình phân tích dòng tiền và vay vốn liên ngân hàng.';
    }
  } else if (module === 'gl-part-9') {
    if (currentPath === 'accounting-view-transaction') {
      currentStep = 6;
      targetSelector = '#tour-view-transaction-screen';
      stepTitle = 'Bước 6 / 6: Đối soát chi tiết giao dịch Frequent Posting (a2f68debe1a7)';
      stepInstruction = 'Bút toán định khoản thường xuyên đã được tự động sinh và hạch toán thành công vào Sổ cái! Kiểm tra 2 dòng định khoản đối ứng: Có TK 220301 (Accrued Operating Expenses Payable: VND 5,000,000.00) và Nợ TK 530101 (Operating Expense: VND 5,000,000.00). Bấm nút "Hoàn thành phần thực hành" bên dưới để kết thúc bài học!';
    } else if (currentPath === 'accounting-frequent-postings') {
      if (frequentSubStep === 'office') {
        currentStep = 3;
        targetSelector = '#tour-frequent-office-select';
        stepTitle = 'Bước 3 / 6: Chọn Office (Takashimaya Bank HO)';
        stepInstruction = 'Chọn văn phòng phát sinh chi phí: "Takashimaya Bank (TKB) - HO". Bấm "Chọn Hội sở TKB - HO" bên dưới để điền nhanh.';
      } else if (frequentSubStep === 'rule') {
        currentStep = 3;
        targetSelector = '#tour-frequent-rule-select';
        stepTitle = 'Bước 3 / 6: Chọn Accounting Rule (Operating Expense Accrual)';
        stepInstruction = 'Chọn quy tắc định khoản tự động: "Operating Expense Accrual". Hệ thống sẽ tự động gán cặp tài khoản Nợ 530101 và Có 220301.';
      } else if (frequentSubStep === 'currency') {
        currentStep = 3;
        targetSelector = '#tour-frequent-currency-select';
        stepTitle = 'Bước 3 / 6: Chọn Currency (Vietnamese Dong [VND])';
        stepInstruction = 'Chọn loại tiền tệ giao dịch: "Vietnamese Dong [VND]". Bấm "Chọn VND" bên dưới để tiếp tục.';
      } else if (frequentSubStep === 'debit') {
        currentStep = 4;
        targetSelector = '#tour-frequent-debit-amount';
        stepTitle = 'Bước 4 / 6: Nhập Debit Amount (5.000.000 VND)';
        stepInstruction = 'Nhập số tiền Nợ phát sinh cho chi phí hoạt động TK 530101: 5000000 VND (5 triệu đồng).';
      } else if (frequentSubStep === 'credit') {
        currentStep = 4;
        targetSelector = '#tour-frequent-credit-amount';
        stepTitle = 'Bước 4 / 6: Nhập Credit Amount (5.000.000 VND)';
        stepInstruction = 'Nhập số tiền Có phát sinh cho nghĩa vụ phải trả dồn tích TK 220301: 5000000 VND (5 triệu đồng) để cân bằng Nợ = Có.';
      } else if (frequentSubStep === 'ref-date') {
        currentStep = 5;
        targetSelector = '#tour-frequent-ref-number';
        stepTitle = 'Bước 5 / 6: Nhập Reference Number & Ngày giao dịch';
        stepInstruction = 'Nhập Reference Number: "TKB-OPEX-202610-002" và Transaction Date: "10/12/2026".';
      } else if (frequentSubStep === 'comments') {
        currentStep = 5;
        targetSelector = '#tour-frequent-comments';
        stepTitle = 'Bước 5 / 6: Nhập Comments diễn giải';
        stepInstruction = 'Nhập nội dung diễn giải: "Accrual of VND 5,000,000 for IT system maintenance services, pending supplier payment."';
      } else {
        currentStep = 5;
        targetSelector = '#tour-frequent-submit-btn';
        stepTitle = 'Bước 5 / 6: Bấm Submit để ghi nhận bút toán';
        stepInstruction = 'Kiểm tra thông tin đã đầy đủ và bấm nút "Submit" màu xanh để ghi nhận giao dịch vào sổ cái và mở màn hình View Transaction!';
      }
    } else if (currentPath === 'accounting') {
      currentStep = 2;
      targetSelector = '#tour-frequent-postings-tile';
      stepTitle = 'Bước 2 / 6: Chọn Frequent Postings';
      stepInstruction = 'Trong danh mục Accounting, bấm vào ô "Frequent Postings" để mở biểu mẫu hạch toán bút toán định kỳ theo quy tắc kế toán đã thiết lập.';
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-accounting';
      stepTitle = 'Bước 1 / 6: Vào phân hệ Accounting';
      stepInstruction = 'Bấm vào menu Accounting trên thanh điều hướng đầu trang để truy cập chức năng hạch toán kế toán.';
    }
  } else if (module === 'gl-part-8') {
    if (currentPath === 'accounting-view-rule') {
      currentStep = 7;
      targetSelector = '#tour-view-rule-screen';
      stepTitle = 'Bước 7 / 7: Xem chi tiết Quy tắc định khoản (View Accounting Rule)';
      stepInstruction = 'Quy tắc định khoản mẫu Operating Expense Accrual đã được khởi tạo thành công với cặp định khoản: Nợ TK 530101 (Ghi tăng chi phí hoạt động khi ngân hàng phát sinh chi phí) và Có TK 220301 (Ghi tăng nghĩa vụ phải trả do ngân hàng chưa thực hiện thanh toán). Bấm "Hoàn thành phần thực hành" bên dưới để kết thúc bài học!';
    } else if (currentPath === 'accounting-create-rule') {
      if (ruleSubStep === 'name') {
        currentStep = 4;
        targetSelector = '#tour-rule-name-input';
        stepTitle = 'Bước 4 / 7: Nhập Accounting Rule Name';
        stepInstruction = 'Nhập tên quy tắc: "Operating Expense Accrual". Bấm "Điền tên quy tắc" bên dưới để điền nhanh.';
      } else if (ruleSubStep === 'office') {
        currentStep = 4;
        targetSelector = '#tour-rule-office-select';
        stepTitle = 'Bước 4 / 7: Chọn Office áp dụng (TKB - HO)';
        stepInstruction = 'Chọn văn phòng/hội sở áp dụng quy tắc: "Takashimaya Bank (TKB) - HO". Bấm "Chọn Hội sở" bên dưới.';
      } else if (ruleSubStep === 'debit') {
        currentStep = 5;
        targetSelector = '#tour-rule-debit-account-select';
        stepTitle = 'Bước 5 / 7: Chọn Account to Debit (530101)';
        stepInstruction = 'Account to Debit (530101): Ghi tăng chi phí hoạt động khi ngân hàng phát sinh chi phí. Chọn tài khoản "Operating Expense (530101)".';
      } else if (ruleSubStep === 'credit') {
        currentStep = 6;
        targetSelector = '#tour-rule-credit-account-select';
        stepTitle = 'Bước 6 / 7: Chọn Account to Credit (220301)';
        stepInstruction = 'Account to Credit (220301): Ghi tăng nghĩa vụ phải trả do ngân hàng chưa thực hiện thanh toán. Chọn tài khoản "Accrued Operating Expenses Payable (220301)".';
      } else if (ruleSubStep === 'desc') {
        currentStep = 6;
        targetSelector = '#tour-rule-description-input';
        stepTitle = 'Bước 6 / 7: Nhập Description';
        stepInstruction = 'Nhập mô tả diễn giải: "Records operating expenses incurred but not yet paid, ensuring consistent accrual accounting entries."';
      } else {
        currentStep = 7;
        targetSelector = '#tour-rule-submit-btn';
        stepTitle = 'Bước 7 / 7: Bấm Submit để lưu quy tắc';
        stepInstruction = 'Kiểm tra thông tin đã đầy đủ và bấm nút "Submit" màu xanh để tạo quy tắc kế toán mẫu và chuyển sang màn hình View Accounting Rule.';
      }
    } else if (currentPath === 'accounting-rules') {
      currentStep = 3;
      targetSelector = '#tour-add-rule-btn';
      stepTitle = 'Bước 3 / 7: Bấm nút + Add Rule';
      stepInstruction = 'Trong màn hình Accounting Rules, bấm vào nút "+ Add Rule" ở góc phải trên để mở form tạo mới quy tắc định khoản.';
    } else if (currentPath === 'accounting') {
      currentStep = 2;
      targetSelector = '#tour-accounting-rules-tile';
      stepTitle = 'Bước 2 / 7: Chọn Accounting Rules';
      stepInstruction = 'Trong danh mục Accounting, bấm vào ô "Accounting Rules" để mở danh sách cấu hình quy tắc định khoản.';
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-accounting';
      stepTitle = 'Bước 1 / 7: Vào phân hệ Accounting';
      stepInstruction = 'Bấm vào menu Accounting trên thanh điều hướng đầu trang để truy cập các chức năng kế toán ngân hàng.';
    }
  } else if (module === 'gl-part-7') {
    const hasManualEntrySubmitted = (customJournalEntries && customJournalEntries.length > 0) || Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-manual-opex'));

    if (!hasManualEntrySubmitted) {
      if (currentPath === 'accounting-create-journal') {
        if (manualJournalSubStep === 'office') {
          currentStep = 3;
          targetSelector = '#tour-manual-office-select';
          stepTitle = 'Bước 3 / 8: Chọn Office (Hội sở chính HO)';
          stepInstruction = 'Chọn văn phòng phát sinh chi phí: Takashimaya Bank (TKB) - HO (Hội sở chính). Bấm "Chọn Hội sở (TKB - HO)" bên dưới để điền nhanh.';
        } else if (manualJournalSubStep === 'currency') {
          currentStep = 4;
          targetSelector = '#tour-manual-currency-select';
          stepTitle = 'Bước 4 / 8: Chọn Currency (Vietnamese Dong [VND])';
          stepInstruction = 'Chọn loại tiền tệ giao dịch: Vietnamese Dong [VND]. Bấm "Chọn VND" bên dưới để tiếp tục.';
        } else if (manualJournalSubStep === 'debit-gl') {
          currentStep = 5;
          targetSelector = '#tour-manual-debit-gl';
          stepTitle = 'Bước 5 / 8: Chọn TK Nợ (530101 - Operating Expense)';
          stepInstruction = 'Tại ô Affected GL Entry (Debit), chọn tài khoản chi phí hoạt động: (530101) Operating Expense.';
        } else if (manualJournalSubStep === 'debit-amount') {
          currentStep = 6;
          targetSelector = '#tour-manual-debit-amount';
          stepTitle = 'Bước 6 / 8: Nhập Debit Amount (2.000.000 VND)';
          stepInstruction = 'Nhập số tiền Nợ phát sinh: 2000000 VND (2 triệu đồng).';
        } else if (manualJournalSubStep === 'credit-gl') {
          currentStep = 7;
          targetSelector = '#tour-manual-credit-gl';
          stepTitle = 'Bước 7 / 8: Chọn TK Có (220301 - Accrued Operating Expenses Payable)';
          stepInstruction = 'Tại ô Affected GL Entry (Credit), chọn tài khoản chi phí phải trả dồn tích: (220301) Accrued Operating Expenses Payable.';
        } else if (manualJournalSubStep === 'credit-amount') {
          currentStep = 8;
          targetSelector = '#tour-manual-credit-amount';
          stepTitle = 'Bước 8 / 8: Nhập Credit Amount (2.000.000 VND)';
          stepInstruction = 'Nhập số tiền Có: 2000000 VND (2 triệu đồng) để cân bằng Tổng Nợ = Tổng Có.';
        } else if (manualJournalSubStep === 'ref-date') {
          currentStep = 9;
          targetSelector = '#tour-manual-ref-number';
          stepTitle = 'Bước 9 / 8: Nhập Reference Number & Ngày giao dịch';
          stepInstruction = 'Nhập mã tham chiếu: TKB-OPEX-202610-001 và Transaction Date: 9/1/2026.';
        } else {
          currentStep = 10;
          targetSelector = '#tour-manual-submit-btn';
          stepTitle = 'Bước 10 / 8: Bấm Submit để ghi nhận vào sổ cái';
          stepInstruction = 'Bút toán chi phí vận hành trích trước đã cân đối hoàn hảo (Tổng Nợ 2 triệu = Tổng Có 2 triệu VND). Bấm nút Submit màu xanh để ghi nhận giao dịch!';
        }
      } else if (currentPath === 'accounting') {
        currentStep = 2;
        targetSelector = '#tour-create-journal-tile';
        stepTitle = 'Bước 2 / 8: Chọn Create Journal Entries';
        stepInstruction = 'Trong danh mục Accounting, bấm vào mục Create Journal Entries để mở biểu mẫu ghi nhận bút toán sổ cái thủ công.';
      } else {
        currentStep = 1;
        targetSelector = '#tour-nav-accounting';
        stepTitle = 'Bước 1 / 8: Vào phân hệ Accounting';
        stepInstruction = 'Bấm vào menu Accounting trên thanh điều hướng đầu trang để truy cập các chức năng kế toán ngân hàng.';
      }
    } else {
      if (currentPath === 'accounting-journal') {
        const hasManualTarget = Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-manual-opex'));
        if (hasManualTarget) {
          currentStep = 13;
          targetSelector = '#tour-journal-entry-manual-opex';
          stepTitle = 'Bước 13: Đối soát bút toán Manual Journal Entry';
          stepInstruction = 'Ý nghĩa tài chính: Bút toán trích trước chi phí hoạt động trực tiếp vào sổ cái tại Hội sở chính Takashimaya Bank (TKB) - HO. Định khoản: Nợ TK 530101 (Operating Expense: 2.000.000 VND) / Có TK 220301 (Accrued Operating Expenses Payable: 2.000.000 VND). Ref: TKB-OPEX-202610-001. Tổng Nợ = Tổng Có = 2.000.000 VND hoàn toàn cân bằng!';
        } else {
          currentStep = 12;
          targetSelector = '#tour-journal-filters-area';
          stepTitle = 'Bước 12: Lọc ngày giao dịch phát sinh (9/1/2026)';
          stepInstruction = 'Chỉnh "Transaction Date From.." và "Transaction Date To" bao gồm ngày phát sinh bút toán (01/01/2026 - 31/10/2026) để hiển thị giao dịch. Bấm nút "Lọc ngày giao dịch (01/01/2026 - 31/10/2026)" bên dưới để lọc ngay.';
        }
      } else if (currentPath === 'accounting') {
        currentStep = 11;
        targetSelector = '#tour-search-journal-tile';
        stepTitle = 'Bước 11: Chọn Search Journal Entries';
        stepInstruction = 'Giao dịch chi phí hoạt động trích trước đã được ghi nhận thành công vào sổ cái! Bấm vào Search Journal Entries để tra cứu và đối soát.';
      } else {
        currentStep = 11;
        targetSelector = '#tour-nav-accounting';
        stepTitle = 'Bước 11: Đến phân hệ Accounting để tra cứu Sổ cái';
        stepInstruction = 'Bấm vào menu Accounting trên thanh điều hướng để mở chức năng tra cứu Sổ nhật ký chung.';
      }
    }
  } else if (module === 'gl-part-6') {
    if (!contraAccountConfigEnabled) {
      if (currentPath === 'admin-configurations') {
        currentStep = 4;
        targetSelector = '#tour-enable-contra-account-btn';
        stepTitle = 'Bước 4: Bật office-opening-balances-contra-account';
        stepInstruction = 'Mifos bắt buộc tham số cấu hình office-opening-balances-contra-account phải ở trạng thái Enabled trước khi hạch toán số dư đầu kỳ. Hãy gạt công tắc chuyển sang Enabled.';
      } else if (currentPath === 'admin-system') {
        currentStep = 3;
        targetSelector = '#tour-configurations-tile';
        stepTitle = 'Bước 3: Chọn Configurations';
        stepInstruction = 'Bấm vào thẻ Configurations để xem danh sách tham số cấu hình toàn cục của hệ thống Mifos.';
      } else if (currentPath === 'admin' || currentPath === 'admin-hub') {
        currentStep = 2;
        targetSelector = '#tour-admin-system';
        stepTitle = 'Bước 2: Chọn mục System';
        stepInstruction = 'Trong trung tâm quản trị Admin, chọn thẻ System để mở các thiết lập kỹ thuật và thông số hệ thống.';
      } else {
        const adminSystemInDom = Boolean(typeof document !== 'undefined' && document.getElementById('tour-admin-system'));
        if (adminSystemInDom) {
          currentStep = 2;
          targetSelector = '#tour-admin-system';
          stepTitle = 'Bước 2: Chọn mục System';
          stepInstruction = 'Trong menu Admin vừa mở, bấm chọn System để truy cập cài đặt hệ thống.';
        } else {
          currentStep = 1;
          targetSelector = '#tour-nav-admin';
          stepTitle = 'Bước 1: Vào phân hệ Admin';
          stepInstruction = 'Bấm vào menu Admin trên thanh điều hướng đầu trang để bắt đầu quy trình kích hoạt cấu hình Contra Account.';
        }
      }
    } else if (!hasOpeningBalanceSubmitted) {
      if (currentPath === 'accounting-opening-balances') {
        const isFormRetrieved = Boolean(typeof document !== 'undefined' && document.getElementById('tour-migration-form-card'));
        const submitBtn = typeof document !== 'undefined' ? document.getElementById('tour-submit-opening-balances-btn') : null;

        if (isFormRetrieved) {
          const vaultInput = typeof document !== 'undefined' ? document.getElementById('tour-input-debit-110101') : null;
          const bankInput = typeof document !== 'undefined' ? document.getElementById('tour-input-debit-110201') : null;
          const capitalInput = typeof document !== 'undefined' ? document.getElementById('tour-input-credit-310101') : null;

          const vaultVal = vaultInput?.value ? Number(vaultInput.value) : 0;
          const bankVal = bankInput?.value ? Number(bankInput.value) : 0;
          const capitalVal = capitalInput?.value ? Number(capitalInput.value) : 0;

          if (openingBalanceSubStep === 'vault') {
            currentStep = 9;
            targetSelector = '#tour-cell-debit-110101';
            stepTitle = 'Bước 9.1: Nhập Nợ cho Cash at Vault (TK 110101)';
            stepInstruction = 'Tại dòng Cash at Vault (TK 110101), nhập số tiền Debit: 200.000.000 VND. Nhấn nút "Tiếp tục" bên dưới để chuyển sang ô Settlement Bank.';
          } else if (openingBalanceSubStep === 'bank') {
            currentStep = 9;
            targetSelector = '#tour-cell-debit-110201';
            stepTitle = 'Bước 9.2: Nhập Nợ cho Settlement Bank Account (TK 110201)';
            stepInstruction = 'Tại dòng Settlement Bank Account (TK 110201), nhập số tiền Debit: 800.000.000 VND. Nhấn nút "Tiếp tục" bên dưới để chuyển sang ô Contributed Capital.';
          } else if (openingBalanceSubStep === 'capital') {
            currentStep = 9;
            targetSelector = '#tour-cell-credit-310101';
            stepTitle = 'Bước 9.3: Nhập Có cho Contributed Capital (TK 310101)';
            stepInstruction = 'Tại dòng Contributed Capital (TK 310101), nhập số tiền Credit: 1.000.000.000 VND (1 tỷ) để cân đối Tổng Nợ = Tổng Có. Nhấn nút "Tiếp tục" bên dưới để chuyển tới nút Submit.';
          } else {
            currentStep = 10;
            targetSelector = '#tour-submit-opening-balances-btn';
            stepTitle = 'Bước 10: Bấm Submit để ghi nhận số dư đầu kỳ';
            stepInstruction = 'Số liệu đầu kỳ đã cân đối hoàn hảo (Tổng Nợ 1 tỷ = Tổng Có 1 tỷ VND). Bấm nút Submit màu xanh để ghi nhận giao dịch vào sổ cái!';
          }
        } else {
          const officeSelectText = typeof document !== 'undefined' ? (document.getElementById('tour-office-select-field')?.textContent || '').trim() : '';
          const hasSelectedOffice = Boolean(officeSelectText && (officeSelectText.includes('Takashimaya') || officeSelectText.includes('HO') || officeSelectText.includes('TKB')));
          if (hasSelectedOffice) {
            currentStep = 8;
            targetSelector = '#tour-btn-retrieve';
            stepTitle = 'Bước 8: Bấm nút Retrieve';
            stepInstruction = 'Bấm nút Retrieve màu xanh để tải bảng danh mục tài khoản kế toán của Hội sở Takashimaya Bank (TKB) - HO.';
          } else {
            currentStep = 7;
            targetSelector = '#tour-office-select-field';
            stepTitle = 'Bước 7: Chọn Office Hội sở TKB - HO';
            stepInstruction = 'Chọn văn phòng cấp cao nhất: Takashimaya Bank (TKB) - HO (Hội sở) để khởi tạo số dư tài khoản ban đầu.';
          }
        }
      } else if (currentPath === 'accounting') {
        currentStep = 6;
        targetSelector = '#tour-opening-balances-tile';
        stepTitle = 'Bước 6: Chọn Migrate Opening Balances (Office-wise)';
        stepInstruction = 'Trong danh mục Accounting, bấm vào mục Migrate Opening Balances (Office-wise) để bắt đầu khởi tạo số dư đầu kỳ cho chi nhánh.';
      } else {
        currentStep = 5;
        targetSelector = '#tour-nav-accounting';
        stepTitle = 'Bước 5: Chuyển sang phân hệ Accounting';
        stepInstruction = 'Tham số Contra Account đã được kích hoạt thành công! Bấm vào menu Accounting trên thanh điều hướng để mở chức năng nhập số dư đầu kỳ.';
      }
    } else {
      if (currentPath === 'accounting-journal') {
        const hasTargetEntry = Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-target'));
        if (hasTargetEntry) {
          currentStep = 14;
          targetSelector = '#tour-journal-entry-target';
          stepTitle = 'Bước 14: Đối soát bút toán Số dư đầu kỳ';
          stepInstruction = 'Ý nghĩa tài chính: Bút toán khởi tạo nguồn vốn chủ sở hữu ban đầu (Vốn góp 1.000.000.000 VND) và phân bổ thành tài sản khả dụng gồm Tiền mặt tại quỹ (200.000.000 VND) và Tiền gửi ngân hàng (800.000.000 VND). Định khoản: Nợ TK 110101 (200 tr) + Nợ TK 110201 (800 tr) = Có TK 310101 (1 tỷ). Tổng Nợ = Tổng Có = 1.000.000.000 VND!';
        } else {
          currentStep = 13;
          targetSelector = '#tour-journal-filters-area';
          stepTitle = 'Bước 13: Lọc ngày giao dịch phát sinh (12/10/2026)';
          stepInstruction = 'Chỉnh "Transaction Date From.." và "Transaction Date To" sao cho bao gồm ngày phát sinh số dư đầu kỳ (12/10/2026) để hệ thống hiển thị danh sách giao dịch. Bấm nút "Lọc ngày giao dịch (12/10/2026)" bên dưới để lọc ngay.';
        }
      } else if (currentPath === 'accounting') {
        currentStep = 12;
        targetSelector = '#tour-search-journal-tile';
        stepTitle = 'Bước 12: Chọn Search Journal Entries';
        stepInstruction = 'Giao dịch hạch toán số dư đầu kỳ đã ghi nhận thành công vào sổ cái! Bấm vào Search Journal Entries để tra cứu và kiểm tra bút toán sổ nhật ký chung.';
      } else {
        currentStep = 11;
        targetSelector = '#tour-nav-accounting';
        stepTitle = 'Bước 11: Đến phân hệ Accounting để tra cứu Sổ cái';
        stepInstruction = 'Bấm vào menu Accounting trên thanh điều hướng đầu trang để vào tra cứu Sổ nhật ký chung.';
      }
    }
  } else if (module === 'gl-part-5') {
    if (finActivityPopup) {
      targetSelector = null;
    } else if (currentPath === 'accounting-activities') {
      if (isMappingFormOpen) {
        if (isMappingFormFilled) {
          currentStep = 5;
          targetSelector = '#tour-submit-mapping-btn';
          stepTitle = `Bước 5: Nhấn Submit để lưu liên kết (${nextMappingSample.activityName})`;
          stepInstruction = `Thông tin liên kết Financial Activity (${nextMappingSample.activityCode}) ${nextMappingSample.activityName} nối tới tài khoản ${nextMappingSample.accountCode} - ${nextMappingSample.accountName} (${nextMappingSample.accountType}) đã hợp lệ. Nhấn nút Submit để lưu vào hệ thống!`;
        } else {
          currentStep = 4;
          targetSelector = '#tour-mapping-create-card';
          stepTitle = `Bước 4: Chọn Financial Activity và Account (${completedActivityCodes.length + 1}/6)`;
          stepInstruction = `Biểu mẫu Define New Mapping đã mở. Xem thông tin liên kết ${completedActivityCodes.length + 1}/6: ${nextMappingSample.activityName} (Mã: ${nextMappingSample.activityCode}) nối tới tài khoản ${nextMappingSample.accountCode} - ${nextMappingSample.accountName} và bấm "Nhập dữ liệu mẫu" bên trái để điền tự động.`;
        }
      } else {
        if (completedActivityCodes.length >= 6 || financialActivities.length >= 6) {
          currentStep = 6;
          targetSelector = null;
          stepTitle = 'Đã hoàn thành 6 Financial Activity Mappings!';
          stepInstruction = 'Bạn đã thiết lập toàn bộ 6 liên kết hoạt động tài chính tự động trong hệ thống. Nhấn nút "Hoàn thành phần thực hành" bên dưới để kết thúc.';
        } else {
          currentStep = 3;
          targetSelector = '#tour-btn-define-mapping';
          stepTitle = `Bước 3: Nhấn + Define New Mapping (${completedActivityCodes.length + 1}/6)`;
          stepInstruction = `Nhấn nút + Define New Mapping ở góc phải trên để tạo liên kết hoạt động tài chính tiếp theo: ${nextMappingSample.activityName} (${nextMappingSample.activityCode}) nối tới tài khoản ${nextMappingSample.accountCode} - ${nextMappingSample.accountName}.`;
        }
      }
    } else if (currentPath === 'accounting') {
      currentStep = 2;
      targetSelector = '#tour-financial-activities-tile';
      stepTitle = 'Bước 2 / 5: Chọn Accounts Linked to Financial Activities';
      stepInstruction = 'Trong danh mục Accounting, bấm vào mục Accounts Linked to Financial Activities để mở bảng quản lý liên kết tài khoản kế toán với hoạt động tài chính.';
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-accounting';
      stepTitle = 'Bước 1 / 5: Vào phân hệ Accounting';
      stepInstruction = 'Bấm vào menu Accounting trên thanh điều hướng ở đầu trang.';
    }
  } else if (module === 'gl-part-4') {
    if (glDetailPopup) {
      targetSelector = null;
    } else if (currentPath === 'accounting-coa') {
      if (isGlFormOpen) {
        if (isGlFormFilled) {
          currentStep = 5;
          targetSelector = '#tour-submit-gl-btn';
          stepTitle = `Bước 5: Nhấn Submit để lưu GL Detail (${nextDetailSample.glCode})`;
          stepInstruction = `Thông tin tài khoản GL Detail ${nextDetailSample.name} (${nextDetailSample.glCode}) thuộc ${nextDetailSample.type} (Parent: ${nextDetailSample.parentName}, Usage: DETAIL) đã hợp lệ. Nhấn nút Submit để lưu vào cây tài khoản!`;
        } else {
          currentStep = 4;
          targetSelector = '#tour-gl-create-card';
          stepTitle = `Bước 4: Nhập tài khoản GL Detail (${detailCompletedSampleCodes.length + 1}/5)`;
          stepInstruction = `Biểu mẫu Create GL Account đã mở. Xem thông tin GL Detail ${detailCompletedSampleCodes.length + 1}/5: ${nextDetailSample.name} (${nextDetailSample.glCode}) với Account Usage = DETAIL và bấm "Nhập dữ liệu mẫu" bên trái để điền tự động.`;
        }
      } else {
        if (detailCompletedSampleCodes.length >= 5 || totalDetailsCreated >= 54) {
          currentStep = 6;
          targetSelector = null;
          stepTitle = totalDetailsCreated >= 54 
            ? 'Hoàn thành 100% GL Detail!' 
            : 'Đã hoàn thành 5 GL Detail mẫu!';
          stepInstruction = totalDetailsCreated >= 54
            ? 'Bạn đã thiết lập toàn bộ 54 tài khoản GL Detail trong hệ thống. Nhấn nút "Hoàn thành phần thực hành" bên dưới để kết thúc.'
            : 'Bạn đã tạo xong 5 tài khoản GL Detail thuộc 5 nhóm tài khoản. Bạn có thể nạp toàn bộ 54 tài khoản chi tiết hoặc nhấn "Hoàn thành phần thực hành" bên dưới.';
        } else {
          currentStep = 3;
          targetSelector = '#tour-btn-add-account';
          stepTitle = `Bước 3: Nhấn + Add Account (${detailCompletedSampleCodes.length + 1}/5)`;
          stepInstruction = `Nhấn nút + Add Account ở góc phải trên để tạo tài khoản GL Detail tiếp theo: ${nextDetailSample.name} (${nextDetailSample.glCode}) thuộc nhóm ${nextDetailSample.type}.`;
        }
      }
    } else if (currentPath === 'accounting') {
      currentStep = 2;
      targetSelector = '#tour-coa-tile';
      stepTitle = 'Bước 2 / 5: Chọn Chart of Accounts';
      stepInstruction = 'Bấm vào mục Chart of Accounts để mở danh mục cây tài khoản kế toán của ngân hàng.';
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-accounting';
      stepTitle = 'Bước 1 / 5: Vào phân hệ Accounting';
      stepInstruction = 'Bấm vào menu Accounting trên thanh điều hướng ở đầu trang.';
    }
  } else if (module === 'gl-part-3') {
    if (glLevel2Popup) {
      targetSelector = null;
    } else if (currentPath === 'accounting-coa') {
      if (isGlFormOpen) {
        if (isGlFormFilled) {
          currentStep = 5;
          targetSelector = '#tour-submit-gl-btn';
          stepTitle = `Bước 5: Nhấn Submit để lưu GL Cấp 2 (${nextLevel2Sample.glCode})`;
          stepInstruction = `Thông tin tài khoản GL Cấp 2 ${nextLevel2Sample.name} (${nextLevel2Sample.glCode}) thuộc ${nextLevel2Sample.type} (Parent: ${nextLevel2Sample.parentName}) đã hợp lệ. Nhấn nút Submit để lưu vào cây tài khoản!`;
        } else {
          currentStep = 4;
          targetSelector = '#tour-gl-create-card';
          stepTitle = `Bước 4: Nhập tài khoản GL Cấp 2 (${level2CompletedSampleCodes.length + 1}/5)`;
          stepInstruction = `Biểu mẫu Create GL Account đã mở. Xem thông tin GL Cấp 2 ${level2CompletedSampleCodes.length + 1}/5: ${nextLevel2Sample.name} (${nextLevel2Sample.glCode}) và bấm "Nhập dữ liệu mẫu" bên trái để điền tự động.`;
        }
      } else {
        if (level2CompletedSampleCodes.length >= 5 || totalLevel2Created >= 11) {
          currentStep = 6;
          targetSelector = null;
          stepTitle = totalLevel2Created >= 11 
            ? 'Hoàn thành 100% GL Cấp 2!' 
            : 'Đã hoàn thành 5 GL Cấp 2 mẫu!';
          stepInstruction = totalLevel2Created >= 11
            ? 'Bạn đã thiết lập toàn bộ 11 tài khoản GL Cấp 2 trong hệ thống. Nhấn nút "Hoàn thành phần thực hành" bên dưới để kết thúc.'
            : 'Bạn đã tạo xong 5 tài khoản GL Cấp 2 thuộc 5 nhóm tài khoản. Bạn có thể nạp toàn bộ 11 tài khoản hoặc nhấn "Hoàn thành phần thực hành" bên dưới.';
        } else {
          currentStep = 3;
          targetSelector = '#tour-btn-add-account';
          stepTitle = `Bước 3: Nhấn + Add Account (${level2CompletedSampleCodes.length + 1}/5)`;
          stepInstruction = `Nhấn nút + Add Account ở góc phải trên để tạo tài khoản GL Cấp 2 tiếp theo: ${nextLevel2Sample.name} (${nextLevel2Sample.glCode}) thuộc nhóm ${nextLevel2Sample.type}.`;
        }
      }
    } else if (currentPath === 'accounting') {
      currentStep = 2;
      targetSelector = '#tour-coa-tile';
      stepTitle = 'Bước 2 / 5: Chọn Chart of Accounts';
      stepInstruction = 'Bấm vào mục Chart of Accounts để mở danh mục cây tài khoản kế toán của ngân hàng.';
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-accounting';
      stepTitle = 'Bước 1 / 5: Vào phân hệ Accounting';
      stepInstruction = 'Bấm vào menu Accounting trên thanh điều hướng ở đầu trang.';
    }
  } else if (module === 'gl-part-2') {
    if (glPopup) {
      targetSelector = null;
    } else if (currentPath === 'accounting-coa') {
      if (isGlFormOpen) {
        if (isGlFormFilled) {
          currentStep = 5;
          targetSelector = '#tour-submit-gl-btn';
          stepTitle = `Bước 5: Nhấn Submit để lưu Header (${glNextSample.glCode})`;
          stepInstruction = `Thông tin tài khoản Header ${glNextSample.name} (${glNextSample.glCode}) đã hợp lệ. Nhấn nút Submit để lưu vào cây tài khoản!`;
        } else {
          currentStep = 4;
          targetSelector = '#tour-gl-create-card';
          stepTitle = `Bước 4: Nhập tài khoản Header (${glCompletedCodes.length + 1}/5)`;
          stepInstruction = `Biểu mẫu Create GL Account đã mở. Xem thông tin Header ${glCompletedCodes.length + 1}/5: ${glNextSample.name} (${glNextSample.glCode}) và bấm "Nhập dữ liệu mẫu" bên dưới để điền tự động.`;
        }
      } else {
        if (glCompletedCodes.length >= 5) {
          currentStep = 6;
          targetSelector = null;
          stepTitle = 'Đã hoàn thành 5 Header cấp 1 cao nhất!';
          stepInstruction = 'Tất cả 5 tài khoản GL Header gốc (Asset, Liability, Equity, Income, Expense) đã được thiết lập thành công.';
        } else {
          currentStep = 3;
          targetSelector = '#tour-btn-add-account';
          stepTitle = `Bước 3: Nhấn + Add Account (${glCompletedCodes.length + 1}/5)`;
          stepInstruction = `Nhấn nút + Add Account ở góc phải trên để tạo tài khoản Header tiếp theo: ${glNextSample.name} (${glNextSample.glCode}).`;
        }
      }
    } else if (currentPath === 'accounting') {
      currentStep = 2;
      targetSelector = '#tour-coa-tile';
      stepTitle = 'Bước 2 / 5: Chọn Chart of Accounts';
      stepInstruction = 'Bấm vào mục Chart of Accounts để mở danh mục cây tài khoản kế toán của ngân hàng.';
    } else {
      currentStep = 1;
      targetSelector = '#tour-nav-accounting';
      stepTitle = 'Bước 1 / 5: Vào phân hệ Accounting';
      stepInstruction = 'Bấm vào menu Accounting trên thanh điều hướng ở đầu trang.';
    }
  } else if (module === 'gl-part-1') {
    const isEditViewActive = currentPath === 'admin-manage-currencies' || Boolean(typeof document !== 'undefined' && (document.getElementById('tour-search-currency-area') || document.getElementById('tour-input-currency')));

    if (currencyPopup) {
      targetSelector = null;
    } else if (isEditViewActive) {
      if (hasVndDraft) {
        currentStep = 6;
        targetSelector = '#tour-submit-currencies-btn';
        stepTitle = 'Bước 6: Nhấn Submit để lưu mẫu (VND)';
        stepInstruction = 'Đồng tiền VND đã nằm trong danh sách cấu hình. Nhấn nút Submit để hoàn tất lưu vào hệ thống.';
      } else if (isAddCurrencyBtnEnabled) {
        currentStep = 5;
        targetSelector = '#tour-btn-add-currency';
        stepTitle = 'Bước 5: Nhấn nút dấu cộng (+) màu xanh nước biển';
        stepInstruction = 'Dấu cộng bên phải đã hiện màu xanh nước biển! Nhấn vào nút dấu cộng để thêm đơn vị tiền tệ vào danh sách.';
      } else {
        currentStep = 4;
        targetSelector = '#tour-search-currency-area';
        stepTitle = 'Bước 4: Nhập và chọn đơn vị tiền tệ mẫu (VND)';
        stepInstruction = 'Vùng tìm kiếm đã được tô sáng! Gõ "VND" vào ô tìm kiếm hoặc bấm nút "Nhập dữ liệu mẫu" ở popup bên cạnh để điền tự động.';
      }
    } else if (currentPath === 'admin-currency-config') {
      if (currencies.length >= 5) {
        currentStep = 7;
        targetSelector = null;
        stepTitle = 'Hoàn thành xuất sắc bài học!';
        stepInstruction = 'Bạn đã cấu hình thành công đủ 5 đơn vị tiền tệ chuẩn trong Database của ngân hàng Takashimaya Bank.';
      } else {
        currentStep = 3;
        targetSelector = '#tour-btn-add-edit-currency';
        stepTitle = 'Bước 3: Nhấn nút + Add/Edit';
        stepInstruction = 'Nhấn nút + Add/Edit ở góc trên bên phải để vào giao diện thêm/sửa đơn vị tiền tệ.';
      }
    } else if (currentPath === 'admin-organization') {
      currentStep = 2;
      targetSelector = '#tour-currency-config';
      stepTitle = 'Bước 2: Chọn Currency Configuration';
      stepInstruction = 'Bấm vào mục Currency Configuration trong danh sách để mở quản lý tiền tệ.';
    } else {
      const adminOrgEl = typeof document !== 'undefined' ? document.getElementById('tour-admin-organization') : null;
      if (adminOrgEl) {
        currentStep = 1;
        targetSelector = '#tour-admin-organization';
        stepTitle = 'Bước 1.2: Chọn Organization';
        stepInstruction = 'Bấm vào mục Organization trong danh sách thả xuống.';
      } else {
        currentStep = 1;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 1.1: Mở menu Quản trị';
        stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở các phân hệ quản trị.';
      }
    }
  } else if (module === 'part-2') {
    if (officePopup) {
      targetSelector = null;
    } else if (currentPath === 'admin-create-office') {
      currentStep = 5;
      if (!isOfficeFormFilled) {
        targetSelector = '#tour-office-input-card';
        stepTitle = 'Bước 5: Nhập thông tin Office theo phân cấp';
        stepInstruction = 'Nhập tên văn phòng, chọn Parent Office (hoặc Root cho Hội sở) hoặc chọn các nút gợi ý "Điền nhanh mẫu thực hành" phía trên.';
      } else {
        targetSelector = '#tour-submit-office-btn';
        stepTitle = 'Bước 5: Nhấn Submit để lưu đơn vị';
        stepInstruction = 'Thông tin văn phòng đã hợp lệ. Nhấn nút Submit để lưu vào cây cơ cấu tổ chức.';
      }
    } else if (currentPath === 'admin-offices') {
      currentStep = 4;
      targetSelector = '#tour-create-office-btn';
      stepTitle = 'Bước 4: Nhấn nút Create Office';
      stepInstruction = 'Bấm vào nút Create Office ở góc trên bên phải để mở biểu mẫu khởi tạo văn phòng mới.';
    } else if (currentPath === 'admin-organization') {
      currentStep = 3;
      targetSelector = '#tour-manage-offices';
      stepTitle = 'Bước 3: Chọn Manage Offices';
      stepInstruction = 'Bấm vào mục Manage Offices để mở trang Quản lý danh sách văn phòng và cây phân cấp.';
    } else {
      const adminOrgEl = typeof document !== 'undefined' ? document.getElementById('tour-admin-organization') : null;
      if (adminOrgEl) {
        currentStep = 2;
        targetSelector = '#tour-admin-organization';
        stepTitle = 'Bước 2: Chọn Cơ cấu tổ chức (Organization)';
        stepInstruction = 'Bấm vào mục Organization trong danh sách thả xuống.';
      } else {
        currentStep = 1;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 1: Mở menu Quản trị';
        stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở các phân hệ quản trị.';
      }
    }
  } else if (tourPhase === 'role-popup') {
    targetSelector = null; // Displaying confirmation popup
  } else if (tourPhase === 'permissions' || module === 'role-permissions') {
    if (currentPath === 'admin-role-detail') {
      const isRoleEditMode = typeof document !== 'undefined' && Boolean(document.getElementById('tour-submit-permissions-btn'));
      if (!isRoleEditMode) {
        currentStep = 6;
        targetSelector = '#tour-edit-role-btn';
        stepTitle = 'Bước 6: Nhấn nút Edit Role';
        stepInstruction = 'Nhấn nút "Edit Role" ở góc trên bên phải để kích hoạt chế độ chỉnh sửa. Khi đó các ô tickbox quyền sẽ đậm màu và cho phép bạn click chọn.';
      } else {
        const activeTabAccounting = typeof document !== 'undefined' ? document.getElementById('tour-category-tab-accounting') : null;
        const isAccountingActive = activeTabAccounting && activeTabAccounting.classList.contains('bg-[#f0f0f0]');
        if (!isAccountingActive) {
          currentStep = 7;
          targetSelector = '#tour-category-tab-accounting';
          stepTitle = 'Bước 7: Vào Tab phân hệ Accounting';
          stepInstruction = 'Nhấn vào danh mục "Accounting" ở cột bên trái để mở danh sách quyền của phân hệ Kế toán.';
        } else {
          currentStep = 8;
          targetSelector = '#tour-submit-permissions-btn';
          stepTitle = 'Bước 8: Nhấn Submit để xác nhận';
          stepInstruction = 'Kiểm tra các quyền đã chọn hoặc bấm nút "Điền nhanh quyền chuẩn mẫu" bên dưới, sau đó bấm nút "Submit" để lưu xác nhận.';
        }
      }
    } else if (currentPath === 'admin-roles') {
      currentStep = 5;
      targetSelector = '#tour-role-row-maker';
      stepTitle = 'Bước 5: Chọn Role biểu diễn (TKB_ACCOUNTING_MAKER)';
      stepInstruction = 'Chọn vai trò "TKB_ACCOUNTING_MAKER" (Role đại diện biểu diễn của phòng Kế toán & Tài chính) từ danh sách để thiết lập quyền.';
    } else if (currentPath === 'admin-system') {
      currentStep = 4;
      targetSelector = '#tour-manage-roles';
      stepTitle = 'Bước 4: Chọn Manage Roles and Permissions';
      stepInstruction = 'Bấm vào Manage Roles and Permissions để mở danh sách vai trò.';
    } else {
      const adminSystemEl = typeof document !== 'undefined' ? document.getElementById('tour-admin-system') : null;
      if (adminSystemEl) {
        currentStep = 4;
        targetSelector = '#tour-admin-system';
        stepTitle = 'Bước 4: Chọn System';
        stepInstruction = 'Bấm vào mục System trong danh sách thả xuống.';
      } else {
        currentStep = 4;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 4: Mở menu Quản trị';
        stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở các phân hệ quản trị.';
      }
    }
  } else if (tourPhase === 'user') {
    if (userCreated && currentPath === 'admin-user-detail') {
      currentStep = 12;
      targetSelector = null;
      stepTitle = 'Hoàn thành xuất sắc bài học!';
      stepInstruction = 'Bạn đã thiết lập thành công các vai trò nghiệp vụ và tạo tài khoản nhân viên.';
    } else if (currentPath === 'admin-create-user') {
      currentStep = 11;
      if (!isUserFormFilled) {
        targetSelector = '#tour-user-input-card';
        stepTitle = 'Bước 11: Nhập thông tin người dùng';
        stepInstruction = 'Nhập thông tin nhân viên (Username, Email, Họ tên, Chi nhánh, Vai trò) hoặc bấm "Điền nhanh mẫu user".';
      } else {
        targetSelector = '#tour-submit-user-btn';
        stepTitle = 'Bước 11: Nhấn Submit để tạo người dùng';
        stepInstruction = 'Thông tin tài khoản đã hợp lệ. Nhấn nút Submit để lưu người dùng vào hệ thống.';
      }
    } else if (currentPath === 'admin-users') {
      currentStep = 10;
      targetSelector = '#tour-create-user-btn';
      stepTitle = 'Bước 10: Nhấn nút Create User';
      stepInstruction = 'Bấm vào nút Create User ở góc trên bên phải để bắt đầu biểu mẫu cấp tài khoản mới.';
    } else {
      // Guide user to open Admin -> Users from wherever they currently are
      const adminUsersEl = typeof document !== 'undefined' ? document.getElementById('tour-admin-users') : null;
      if (adminUsersEl) {
        currentStep = 9;
        targetSelector = '#tour-admin-users';
        stepTitle = 'Bước 9.2: Chọn mục Users';
        stepInstruction = 'Bấm vào mục Users trong menu thả xuống để mở trang Quản lý danh sách người dùng.';
      } else {
        currentStep = 9;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 9.1: Mở menu Quản trị';
        stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở danh sách phân hệ quản trị.';
      }
    }
  } else {
    // Phase 1: Role Creation
    if (currentPath === 'admin-add-role') {
      currentStep = 5;
      if (!isRoleFormFilled) {
        targetSelector = '#tour-role-input-card';
        stepTitle = 'Bước 5: Nhập thông tin Role';
        stepInstruction = 'Nhập thông tin Name * và Description * vào ô bên dưới, hoặc bấm nút gợi ý "Điền nhanh mẫu".';
      } else {
        targetSelector = '#tour-submit-role-btn';
        stepTitle = 'Bước 5: Nhấn Submit để lưu';
        stepInstruction = 'Thông tin vai trò đã được điền đầy đủ. Nhấn nút Submit để lưu vai trò vào hệ thống.';
      }
    } else if (currentPath === 'admin-roles') {
      currentStep = 4;
      targetSelector = '#tour-add-role-btn';
      stepTitle = 'Bước 4 / 4: Nhấn nút Add Role';
      stepInstruction = 'Bấm vào nút Add Role ở góc trên bên phải để mở biểu mẫu tạo vai trò mới.';
    } else if (currentPath === 'admin-system') {
      currentStep = 3;
      targetSelector = '#tour-manage-roles';
      stepTitle = 'Bước 3 / 4: Chọn Manage Roles and Permissions';
      stepInstruction = 'Bấm vào dòng Manage Roles and Permissions để mở trang quản lý vai trò và phân quyền.';
    } else {
      const adminSystemEl = typeof document !== 'undefined' ? document.getElementById('tour-admin-system') : null;
      if (adminSystemEl) {
        currentStep = 2;
        targetSelector = '#tour-admin-system';
        stepTitle = 'Bước 2 / 4: Chọn Quản trị hệ thống (System)';
        stepInstruction = 'Bấm vào mục System trong danh sách thả xuống.';
      } else {
        currentStep = 1;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 1 / 4: Mở menu Quản trị';
        stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở các phân hệ quản trị.';
      }
    }
  }

  // Update target bounding rectangle continuously
  const updateRect = useCallback(() => {
    if (!isActive || !targetSelector) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        let left = Math.round(rect.left);
        let top = Math.round(rect.top);
        let width = Math.round(rect.width);
        let height = Math.round(rect.height);
        let right = Math.round(rect.right);
        let bottom = Math.round(rect.bottom);

        // If highlighting currency search area, expand bounding box if autocomplete dropdown is open
        if (targetSelector === '#tour-search-currency-area') {
          const dropdown = document.getElementById('tour-currency-dropdown');
          if (dropdown && dropdown.offsetParent !== null) {
            const dropRect = dropdown.getBoundingClientRect();
            left = Math.min(left, Math.round(dropRect.left));
            top = Math.min(top, Math.round(dropRect.top));
            right = Math.max(right, Math.round(dropRect.right));
            bottom = Math.max(bottom, Math.round(dropRect.bottom));
            width = right - left;
            height = bottom - top;
          }
        }

        // If highlighting office select field, expand bounding box if office dropdown is open
        if (targetSelector === '#tour-office-select-field') {
          const dropdown = document.getElementById('tour-office-dropdown');
          if (dropdown && dropdown.offsetParent !== null) {
            const dropRect = dropdown.getBoundingClientRect();
            left = Math.min(left, Math.round(dropRect.left));
            top = Math.min(top, Math.round(dropRect.top));
            right = Math.max(right, Math.round(dropRect.right));
            bottom = Math.max(bottom, Math.round(dropRect.bottom));
            width = right - left;
            height = bottom - top;
          }
        }

        // Expand bounding box for manual journal dropdowns when open
        if (targetSelector === '#tour-manual-office-select') {
          const dropdown = document.getElementById('tour-manual-office-dropdown');
          if (dropdown && dropdown.offsetParent !== null) {
            const dropRect = dropdown.getBoundingClientRect();
            left = Math.min(left, Math.round(dropRect.left));
            top = Math.min(top, Math.round(dropRect.top));
            right = Math.max(right, Math.round(dropRect.right));
            bottom = Math.max(bottom, Math.round(dropRect.bottom));
            width = right - left;
            height = bottom - top;
          }
        }
        if (targetSelector === '#tour-manual-currency-select') {
          const dropdown = document.getElementById('tour-manual-currency-dropdown');
          if (dropdown && dropdown.offsetParent !== null) {
            const dropRect = dropdown.getBoundingClientRect();
            left = Math.min(left, Math.round(dropRect.left));
            top = Math.min(top, Math.round(dropRect.top));
            right = Math.max(right, Math.round(dropRect.right));
            bottom = Math.max(bottom, Math.round(dropRect.bottom));
            width = right - left;
            height = bottom - top;
          }
        }
        if (targetSelector === '#tour-manual-debit-gl') {
          const dropdown = document.getElementById('tour-manual-debit-gl-dropdown');
          if (dropdown && dropdown.offsetParent !== null) {
            const dropRect = dropdown.getBoundingClientRect();
            left = Math.min(left, Math.round(dropRect.left));
            top = Math.min(top, Math.round(dropRect.top));
            right = Math.max(right, Math.round(dropRect.right));
            bottom = Math.max(bottom, Math.round(dropRect.bottom));
            width = right - left;
            height = bottom - top;
          }
        }
        if (targetSelector === '#tour-manual-credit-gl') {
          const dropdown = document.getElementById('tour-manual-credit-gl-dropdown');
          if (dropdown && dropdown.offsetParent !== null) {
            const dropRect = dropdown.getBoundingClientRect();
            left = Math.min(left, Math.round(dropRect.left));
            top = Math.min(top, Math.round(dropRect.top));
            right = Math.max(right, Math.round(dropRect.right));
            bottom = Math.max(bottom, Math.round(dropRect.bottom));
            width = right - left;
            height = bottom - top;
          }
        }

        // Auto-scroll target into view if outside visible viewport
        if (targetSelector.startsWith('#tour-casa-') || targetSelector === '#tour-create-savings-product-btn' || targetSelector.startsWith('#tour-cell-') || targetSelector === '#tour-submit-opening-balances-btn' || targetSelector === '#tour-journal-entry-target' || targetSelector === '#tour-journal-entry-manual-opex' || targetSelector === '#tour-manual-submit-btn' || targetSelector.startsWith('#tour-rda-') || targetSelector.startsWith('#tour-rd-') || targetSelector.startsWith('#tour-client-')) {
          const inView = rect.top >= 60 && rect.bottom <= (window.innerHeight || 800) - 60;
          if (!inView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }

        // Expand spotlight for debit and credit cells so user sees Account Code & Name on the left
        if (targetSelector.startsWith('#tour-cell-debit-') || targetSelector.startsWith('#tour-cell-credit-')) {
          const row = el.closest('.grid');
          if (row) {
            const rowRect = row.getBoundingClientRect();
            left = Math.round(rowRect.left + 8);
            top = Math.round(rowRect.top + 2);
            bottom = Math.round(rowRect.bottom - 2);
            width = right - left;
            height = bottom - top;
          }
        }

        setTargetRect({ left, top, width, height, right, bottom });
        return;
      }
    }
    setTargetRect(null);
  }, [isActive, targetSelector]);

  useEffect(() => {
    if (!isActive) return;

    updateRect();
    const timer = setInterval(updateRect, 100);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isActive, updateRect]);

  if (!isActive) return null;

  const handleAutofillRole = () => {
    window.dispatchEvent(new CustomEvent('practice-autofill-role', {
      detail: {
        name: 'TKB_TELLER_CASHIER',
        description: 'Responsible for authorized cash transactions and teller operations.'
      }
    }));
  };

  const handleAutofillUser = () => {
    window.dispatchEvent(new CustomEvent('practice-autofill-user', {
      detail: {
        username: 'tkb.teller01',
        email: 'tkb.teller01@tkb.org',
        firstname: 'Huong',
        lastname: 'Doan'
      }
    }));
  };

  const handleConfirmImportRoles = () => {
    if (onLoadAllRoles) {
      onLoadAllRoles();
    }
    setRolesImported(true);
  };

  const handleContinueToPermissions = () => {
    setTourPhase('permissions');
    if (navigate) navigate('admin-roles');
  };

  const handleContinueToUsers = () => {
    setRolePermissionsPopup(false);
    setTourPhase('user');
    if (navigate) navigate('admin-users');
  };

  const handleConfirmImportUsers = () => {
    if (onLoadAllUsers) {
      onLoadAllUsers();
    }
    setUsersImported(true);
  };

  // Pop-up modal for Role Permissions Setup Flow (8 Departments & Remaining Roles List)
  if ((module === 'role-permissions' || module === 'part-1') && rolePermissionsPopup) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 select-none">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-4xl w-full p-6 text-gray-800 space-y-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
                Hoàn thành luồng thiết lập quyền hạn vai trò
              </div>
              <h3 className="text-base font-bold text-gray-900 mt-0.5">
                Đã Lưu Thành Công Quyền Cho: {lastSubmittedRole?.roleName || 'TKB_ACCOUNTING_MAKER'}
              </h3>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              Thực hành thành công
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Bạn đã hoàn thành xuất sắc luồng thiết lập phân quyền thực tế: <strong className="text-gray-900">Vào Roles & Permissions &gt; Chọn Role &gt; Nhấn Edit Role &gt; Vào các tab tick chọn permissions &gt; Nhấn Submit</strong>.
          </p>

          {/* Section: Danh sách quyền của các Role còn lại theo 8 phòng ban */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                Danh Sách Quyền Các Role Còn Lại Của 8 Phòng Ban
              </h4>
              <span className="text-[11px] text-gray-500">
                Gồm 6 vai trò nghiệp vụ & kiểm soát liên quan
              </span>
            </div>

            <div className="border border-gray-200 rounded-[2px] overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f5f6f8] border-b border-gray-200">
                    <th className="py-2.5 px-3 font-semibold text-gray-700 w-1/4">Phòng ban</th>
                    <th className="py-2.5 px-3 font-semibold text-gray-700 w-1/4">Vai trò (Role)</th>
                    <th className="py-2.5 px-3 font-semibold text-gray-700 w-1/6">Tab phân hệ</th>
                    <th className="py-2.5 px-3 font-semibold text-gray-700">Permissions cần tick</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ALL_REMAINING_ROLES.map((r, idx) => (
                    <tr key={r.id || idx} className={idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="py-2 px-3 text-gray-700 font-medium align-top">
                        {r.departmentName}
                      </td>
                      <td className="py-2 px-3 text-[#1072ba] font-mono font-medium align-top">
                        {r.name}
                      </td>
                      <td className="py-2 px-3 text-gray-600 align-top">
                        {r.tabs.map(t => (
                          <div key={t.tabId} className="font-medium text-gray-800">
                            {t.tabName}
                          </div>
                        ))}
                      </td>
                      <td className="py-2 px-3 text-gray-700 align-top font-mono text-[11px]">
                        {r.tabs.map(t => (
                          <div key={t.tabId} className="mb-1 leading-relaxed">
                            <span className="font-semibold text-[#1072ba] font-sans">[{t.tabName}]: </span>
                            {t.permissions.map(p => p.replace(/_/g, ' ')).join(', ')}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Box: Tự động nhập vào database */}
          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-sky-900 leading-relaxed">
              <div className="font-bold text-[#1072ba]">
                Tự động nạp toàn bộ quyền cho các Role còn lại vào hệ thống:
              </div>
              <div>
                Hệ thống sẽ cập nhật tự động toàn bộ ma trận quyền của tất cả các Role vào cơ sở dữ liệu mô phỏng.
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {!rolePermissionsImported ? (
                <button
                  type="button"
                  onClick={() => {
                    if (onLoadAllRolePermissions) {
                      onLoadAllRolePermissions();
                    }
                    setRolePermissionsImported(true);
                  }}
                  className="px-4 py-2 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Tự động nạp vào Database
                </button>
              ) : (
                <div className="flex items-center text-emerald-700 font-bold text-xs bg-emerald-100 px-3 py-1.5 rounded-[2px]">
                  <span>Đã nạp toàn bộ quyền vào Database</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setRolePermissionsPopup(false);
                onClose();
                if (navigate) navigate('admin-roles');
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-[2px] cursor-pointer transition-colors"
            >
              Đóng hướng dẫn
            </button>
            <button
              type="button"
              onClick={handleContinueToUsers}
              className="px-5 py-2 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
            >
              Tiếp tục: Tạo tài khoản Người dùng (Users)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pop-up modals for GL Part 2: 5 Root GL Headers Flow
  if (module === 'gl-part-2' && glPopup) {
    const rootCodes = ['100000', '200000', '300000', '400000', '500000'];
    const completedList = rootCodes.filter(c => glAccounts.some(a => a.glCode === c && (a.usage || '').toLowerCase() === 'header'));
    const nextSample = ROOT_GL_HEADERS_SAMPLES.find(s => !completedList.includes(s.glCode));

    if (glPopup === 'header-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Tiến độ: {completedList.length}/5 Header cấp 1
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Tạo thành công Header: {lastHeaderCreated?.name || 'Tài khoản'} ({lastHeaderCreated?.glCode})!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tài khoản tổng hợp <strong className="text-gray-900">{lastHeaderCreated?.name}</strong> đã được lưu thành công vào hệ thống.
            </p>
            {nextSample && (
              <div className="py-2.5 px-3 bg-sky-50 border-l-2 border-[#1072ba] text-xs text-sky-900">
                <strong>Thao tác tiếp theo ({completedList.length + 1}/5):</strong> Nhấn nút <strong>+ Add Account</strong> để tạo tiếp tài khoản <strong>{nextSample.name} ({nextSample.glCode})</strong> theo hình kế tiếp.
              </div>
            )}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setGlPopup(null);
                  if (navigate) navigate('accounting-coa');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục tạo Header tiếp theo
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (glPopup === 'completed') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              Hoàn thành xuất sắc Phân hệ 01 - Phần 2
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Đã thiết lập đầy đủ 5 GL Header cấp 1 cao nhất!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn đã hoàn tất việc khai báo 5 tài khoản tổng hợp gốc làm khung xương sống cho toàn bộ cây tài khoản kế toán của ngân hàng Takashimaya Bank:
            </p>
            <div className="space-y-1.5 text-xs text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
              <div className="flex items-center justify-between font-mono">
                <span>[1] 100000 TOTAL ASSETS (ASSET - HEADER)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">Hình 1 - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[2] 200000 TOTAL LIABILITIES (LIABILITY - HEADER)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">Hình 2 - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[3] 300000 TOTAL EQUITY (EQUITY - HEADER)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">Hình 3 - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[4] 400000 TOTAL INCOME (INCOME - HEADER)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">Hình 4 - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[5] 500000 TOTAL EXPENSES (EXPENSE - HEADER)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">Hình 5 - Đạt</span>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setGlPopup(null);
                  onClose();
                  if (navigate) navigate('accounting-coa');
                }}
                className="py-2.5 px-5 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Hoàn thành phần thực hành
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Pop-up modals for GL Part 5: Financial Activity Mapping Flow
  if (module === 'gl-part-5' && finActivityPopup) {
    if (finActivityPopup === 'mapping-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Tiến độ: {completedActivityCodes.length}/6 liên kết Financial Activities
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Liên kết thành công: {lastMappingCreated?.activityName || 'Hoạt động'} ({lastMappingCreated?.activityCode}) sang {lastMappingCreated?.accountCode} - {lastMappingCreated?.accountName}!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Hoạt động tài chính <strong className="text-gray-900">{lastMappingCreated?.activityName}</strong> đã được liên kết chính xác tới tài khoản kế toán chi tiết <strong className="text-[#1072ba]">{lastMappingCreated?.accountCode} - {lastMappingCreated?.accountName}</strong> ({lastMappingCreated?.accountType}).
            </p>
            {nextMappingSample && (
              <div className="py-2.5 px-3 bg-sky-50 border-l-2 border-[#1072ba] text-xs text-sky-900">
                <strong>Thao tác tiếp theo ({completedActivityCodes.length + 1}/6):</strong> Nhấn nút <strong>+ Define New Mapping</strong> để liên kết tiếp hoạt động <strong>({nextMappingSample.activityCode}) {nextMappingSample.activityName}</strong> tới tài khoản <strong>{nextMappingSample.accountCode} - {nextMappingSample.accountName}</strong>.
              </div>
            )}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setFinActivityPopup(null);
                  if (navigate) navigate('accounting-activities');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục liên kết hoạt động tiếp theo
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (finActivityPopup === 'mappings-completed') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              Hoàn thành xuất sắc Phân hệ 01 - Phần 5
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Đã hoàn thành liên kết đủ 6 Financial Activities!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn đã liên kết thành công đầy đủ 6 hoạt động tài chính tự động trong hệ thống ngân hàng Takashimaya Bank theo đúng chuẩn Mifos X:
            </p>
            <div className="space-y-1.5 text-xs text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 font-mono">
              <div className="flex items-center justify-between">
                <span>[1] (300) Opening Balances Transfer Contra: TK 310199</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">EQUITY - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[2] (101) Cash At Main Vault: TK 110101</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[3] (102) Cash At Teller: TK 110102</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[4] (103) Fund Source: TK 110201</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[5] (100) Asset Transfer: TK 130101</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[6] (200) Liability Transfer: TK 220201</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">LIABILITY - Đạt</span>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setFinActivityPopup(null);
                  onClose();
                  if (navigate) navigate('accounting-activities');
                }}
                className="py-2.5 px-5 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Hoàn thành phần thực hành
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Pop-up modals for GL Part 4: GL Detail Flow
  if (module === 'gl-part-4' && glDetailPopup) {
    if (glDetailPopup === 'sample-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Tiến độ: {detailCompletedSampleCodes.length}/5 GL Detail mẫu
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Tạo thành công GL Detail: {lastDetailCreated?.name || 'Tài khoản'} ({lastDetailCreated?.glCode})!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tài khoản GL Detail <strong className="text-gray-900">{lastDetailCreated?.name}</strong> (Usage: DETAIL) đã được lưu thành công vào cây tài khoản dưới tài khoản GL Cấp 2 cha tương ứng.
            </p>
            {nextDetailSample && (
              <div className="py-2.5 px-3 bg-sky-50 border-l-2 border-[#1072ba] text-xs text-sky-900">
                <strong>Thao tác tiếp theo ({detailCompletedSampleCodes.length + 1}/5):</strong> Nhấn nút <strong>+ Add Account</strong> để tạo tiếp tài khoản <strong>{nextDetailSample.name} ({nextDetailSample.glCode})</strong> thuộc nhóm <strong>{nextDetailSample.type}</strong> (Parent: <strong>{nextDetailSample.parentName}</strong>, Usage: <strong>DETAIL</strong>).
              </div>
            )}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setGlDetailPopup(null);
                  if (navigate) navigate('accounting-coa');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục tạo GL Detail tiếp theo
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (glDetailPopup === 'samples-completed') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Hoàn thành 5/5 GL Detail đại diện
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Đã tạo thành công 5 GL Detail ở 5 nhóm khác nhau!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn đã thành thạo quy trình khai báo tài khoản chi tiết (Account Usage: DETAIL) và liên kết chính xác Parent Header Cấp 2 theo từng nhóm tài khoản:
            </p>
            <div className="space-y-1.5 text-xs text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
              <div className="flex items-center justify-between font-mono">
                <span>[1] 110101 Cash at Vault (thuộc 110000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - DETAIL</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[2] 210101 Savings Deposits (thuộc 210000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">LIABILITY - DETAIL</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[3] 310101 Contributed Capital (thuộc 310000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">EQUITY - DETAIL</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[4] 410101 Loan Interest Income (thuộc 410000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">INCOME - DETAIL</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[5] 510101 Savings Interest Expense (thuộc 510000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">EXPENSE - DETAIL</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bây giờ, bạn có thể nạp toàn bộ danh mục 54 tài khoản GL Detail chuẩn vào cơ sở dữ liệu để hoàn thành cây tài khoản.
            </p>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setGlDetailPopup(null);
                  onClose();
                  if (navigate) navigate('accounting-coa');
                }}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                Hoàn thành phần thực hành
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onLoadAllGlDetails) {
                    onLoadAllGlDetails();
                  }
                  setGlDetailImported(true);
                  setGlDetailPopup('all-imported');
                }}
                className="py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Nhập toàn bộ danh sách GL Detail vào database
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (glDetailPopup === 'all-imported') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              Hoàn thành xuất sắc Phân hệ 01 - Phần 4
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Đã nhập toàn bộ 54 tài khoản GL Detail vào database!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cây tài khoản kế toán của ngân hàng Takashimaya Bank đã được thiết lập hoàn chỉnh 100% với đầy đủ 70 tài khoản (5 Header Cấp 1, 11 Header Cấp 2, và 54 Tài khoản Chi tiết - Detail Accounts).
            </p>
            <div className="space-y-1 text-[11px] text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 max-h-52 overflow-y-auto font-mono">
              <div>ASSET (15 details): Cash at Vault, Cash at Tellers, Petty Cash, Current Account at Central Bank, Standard Commercial Loans, Microfinance Group Loans, SME Term Loans, Mortgages...</div>
              <div>LIABILITY (15 details): Regular Savings Accounts, Demand Deposits, Fixed Term Deposits 3M/6M/12M, Interbank Borrowings...</div>
              <div>EQUITY (4 details): Contributed Capital, Statutory Capital Reserve, General Banking Reserve, Retained Earnings...</div>
              <div>INCOME (10 details): Interest Income Commercial Loans, Fee Income Loan Processing, Transaction Fees, Account Maintenance Fees...</div>
              <div>EXPENSE (10 details): Interest Expense Savings Deposits, Interest Expense Term Deposits, Salaries and Wages, Office Rent, IT Support...</div>
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setGlDetailPopup(null);
                  onClose();
                  if (navigate) navigate('accounting-coa');
                }}
                className="py-2.5 px-5 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Hoàn thành phần thực hành
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Pop-up modals for GL Part 3: GL Level 2 Flow
  if (module === 'gl-part-3' && glLevel2Popup) {
    if (glLevel2Popup === 'sample-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Tiến độ: {level2CompletedSampleCodes.length}/5 GL Cấp 2 mẫu
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Tạo thành công GL Cấp 2: {lastLevel2Created?.name || 'Tài khoản'} ({lastLevel2Created?.glCode})!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tài khoản GL Cấp 2 <strong className="text-gray-900">{lastLevel2Created?.name}</strong> đã được lưu thành công vào cây tài khoản dưới tài khoản Header cha tương ứng.
            </p>
            {nextLevel2Sample && (
              <div className="py-2.5 px-3 bg-sky-50 border-l-2 border-[#1072ba] text-xs text-sky-900">
                <strong>Thao tác tiếp theo ({level2CompletedSampleCodes.length + 1}/5):</strong> Nhấn nút <strong>+ Add Account</strong> để tạo tiếp tài khoản <strong>{nextLevel2Sample.name} ({nextLevel2Sample.glCode})</strong> thuộc nhóm <strong>{nextLevel2Sample.type}</strong> (Parent: <strong>{nextLevel2Sample.parentName}</strong>).
              </div>
            )}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setGlLevel2Popup(null);
                  if (navigate) navigate('accounting-coa');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục tạo GL Cấp 2 tiếp theo
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (glLevel2Popup === 'samples-completed') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Hoàn thành 5/5 GL Cấp 2 đại diện
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Đã tạo thành công 5 GL Cấp 2 ở 5 nhóm khác nhau!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn đã thành thạo quy trình khai báo tài khoản GL Cấp 2 và liên kết chính xác Parent Header theo từng nhóm tài khoản:
            </p>
            <div className="space-y-1.5 text-xs text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
              <div className="flex items-center justify-between font-mono">
                <span>[1] 110000 CASH AND BANK BALANCES (thuộc 100000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[2] 210000 CUSTOMER DEPOSITS (thuộc 200000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">LIABILITY - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[3] 310000 CAPITAL AND RESERVES (thuộc 300000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">EQUITY - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[4] 410000 INTEREST INCOME (thuộc 400000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">INCOME - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[5] 510000 INTEREST EXPENSES (thuộc 500000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">EXPENSE - Đạt</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bây giờ, bạn có thể nạp toàn bộ danh mục 11 tài khoản GL Cấp 2 chuẩn vào cơ sở dữ liệu để hoàn thành phân hệ.
            </p>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setGlLevel2Popup(null);
                  onClose();
                  if (navigate) navigate('accounting-coa');
                }}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                Hoàn thành phần thực hành
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onLoadAllGlLevel2) {
                    onLoadAllGlLevel2();
                  }
                  setGlLevel2Imported(true);
                  setGlLevel2Popup('all-imported');
                }}
                className="py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Nhập toàn bộ danh sách GL Cấp 2 vào database
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (glLevel2Popup === 'all-imported') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              Hoàn thành xuất sắc Phân hệ 01 - Phần 3
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Đã nhập toàn bộ 11 tài khoản GL Cấp 2 vào database!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cây tài khoản kế toán của ngân hàng Takashimaya Bank đã được thiết lập đầy đủ 11 tài khoản GL Cấp 2 thuộc cả 5 nhóm tài khoản:
            </p>
            <div className="space-y-1 text-[11px] text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 max-h-52 overflow-y-auto font-mono">
              <div>ASSET: 110000 CASH AND BANK BALANCES, 120000 LOAN ASSETS, 130000 OTHER ASSETS</div>
              <div>LIABILITY: 210000 CUSTOMER DEPOSITS, 220000 FUNDING AND CLEARING</div>
              <div>EQUITY: 310000 CAPITAL AND RESERVES</div>
              <div>INCOME: 410000 INTEREST INCOME, 420000 FEE AND OTHER INCOME</div>
              <div>EXPENSE: 510000 INTEREST EXPENSES, 520000 CREDIT LOSS EXPENSES, 530000 OPERATING EXPENSES</div>
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setGlLevel2Popup(null);
                  onClose();
                  if (navigate) navigate('accounting-coa');
                }}
                className="py-2.5 px-5 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Hoàn thành phần thực hành
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Pop-up modals for Part 2: 4-Tier Organization Flow
  if (module === 'part-2' && officePopup) {
    if (officePopup === 'ho-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Bước 1 hoàn tất: Hội sở chính
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Tạo thành công Hội sở chính (Head Office)!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn đã tạo thành công đơn vị đầu não: <strong className="text-gray-900">{offices[0]?.name || 'Takashimaya Bank (TKB) - HO'}</strong> (Root Head Office).
            </p>
            <div className="py-2.5 px-3 bg-sky-50 border-l-2 border-[#1072ba] text-xs text-sky-900">
              <strong>Bước 2 tiếp theo:</strong> Tạo 3 Văn phòng khu vực (Miền Bắc, Miền Trung, Miền Nam) và chọn <strong>Parent Office</strong> là Hội sở vừa tạo.
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  if (onLoadRegionalOffices) onLoadRegionalOffices();
                  setOfficePopup('ro-created');
                }}
                className="py-1.5 px-3 border border-sky-300 hover:bg-sky-50 text-[#1072ba] text-xs rounded-[2px] cursor-pointer transition-colors"
              >
                Nạp nhanh 3 VP Khu vực
              </button>
              <button
                onClick={() => {
                  setOfficePopup(null);
                  if (navigate) navigate('admin-create-office');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục tạo VP Khu vực
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (officePopup === 'ro-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Bước 2 hoàn tất: Văn phòng khu vực
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Thiết lập thành công Văn phòng khu vực!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Văn phòng khu vực đã được liên kết đúng với Hội sở chính theo mô hình cha - con (Parent Office).
            </p>
            <div className="py-2.5 px-3 bg-sky-50 border-l-2 border-[#1072ba] text-xs text-sky-900">
              <strong>Bước 3 tiếp theo:</strong> Tạo Chi nhánh (Branch) và chọn <strong>Parent Office</strong> là Văn phòng khu vực quản lý tương ứng (VD: Hanoi Branch thuộc Miền Bắc).
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setOfficePopup(null);
                  if (navigate) navigate('admin-create-office');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục tạo Chi nhánh
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (officePopup === 'br-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Bước 3 hoàn tất: Chi nhánh
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Thiết lập thành công Chi nhánh ngân hàng!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Chi nhánh đã được gắn đúng về Văn phòng khu vực điều phối.
            </p>
            <div className="py-2.5 px-3 bg-emerald-50 border-l-2 border-[#28a745] text-xs text-emerald-900">
              <strong>Bước 4 tiếp theo:</strong> Tạo Phòng giao dịch (Transaction Office - TO) và chọn <strong>Parent Office</strong> là Chi nhánh trực tiếp quản lý (VD: Cau Giay TO thuộc Hanoi Branch).
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setOfficePopup(null);
                  if (navigate) navigate('admin-create-office');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục tạo Phòng giao dịch (TO)
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (officePopup === 'to-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              {officesImported ? 'Đã nạp toàn bộ mạng lưới' : 'Hoàn tất xuất sắc 4 cấp cơ cấu tổ chức!'}
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              {officesImported 
                ? 'Đã nạp đầy đủ 32 đơn vị mạng lưới vào hệ thống!' 
                : 'Chúc mừng bạn đã thiết lập trọn vẹn mô hình 4 cấp mạng lưới ngân hàng!'}
            </h3>
            {!officesImported ? (
              <>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bạn đã thực hành chính xác trọn vẹn luồng phân cấp:
                </p>
                <div className="py-2.5 px-3 bg-gray-50 border-l-2 border-[#28a745] text-xs text-gray-700 space-y-1">
                  <div>Cấp 1: Hội sở chính (Head Office)</div>
                  <div>Cấp 2: Văn phòng khu vực (Bắc, Trung, Nam có parent là Hội sở)</div>
                  <div>Cấp 3: Chi nhánh (có parent là Văn phòng khu vực)</div>
                  <div>Cấp 4: Phòng giao dịch (có parent là Chi nhánh)</div>
                </div>
                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      if (onLoadAllOffices) onLoadAllOffices();
                      setOfficesImported(true);
                    }}
                    className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Nạp toàn bộ 32 đơn vị từ database
                  </button>
                  <button
                    onClick={() => {
                      setOfficePopup(null);
                      onClose();
                      if (navigate) navigate('admin-offices');
                    }}
                    className="py-1.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs rounded-[2px] cursor-pointer transition-colors"
                  >
                    Xem Cây phân cấp
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Toàn bộ 32 đơn vị chi nhánh và phòng giao dịch từ cơ sở dữ liệu đã được nạp đầy đủ và sẵn sàng vận hành.
                </p>
                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setOfficePopup(null);
                      onClose();
                      if (navigate) navigate('admin-offices');
                    }}
                    className="py-2 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Xem Cây phân cấp cơ cấu tổ chức
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
  }

  // Pop-up prompt after creating 1 role
  if (tourPhase === 'role-popup') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
            {rolesImported ? 'Đã nạp toàn bộ vai trò' : 'Tiếp tục thiết lập vai trò nghiệp vụ'}
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {rolesImported 
              ? 'Đã nạp đầy đủ 16 vai trò chuẩn vào hệ thống!' 
              : 'Tiếp tục nhập 13 vai trò còn lại cho ngân hàng?'}
          </h3>

          {!rolesImported ? (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bạn đã thực hành tạo thành công 1 vai trò: <strong className="text-gray-900">TKB_TELLER_CASHIER</strong>.
              </p>

              <p className="text-xs text-gray-600 leading-relaxed">
                Theo thiết kế hệ thống ngân hàng Takashimaya Bank (TKB), cần thiết lập thêm <strong className="text-gray-900">13 vai trò nghiệp vụ khác</strong> (Kế toán Maker/Checker, Tín dụng Maker/Approver, Giám sát tiền mặt, Quản lý chi nhánh...).
              </p>

              <div className="py-2.5 px-3 bg-gray-50 border-l-2 border-[#1072ba] text-[11px] text-gray-600 space-y-1">
                <div>Nhấn <strong>Xác nhận</strong> để hệ thống tự động nạp toàn bộ dữ liệu 13 vai trò còn lại từ cơ sở dữ liệu đã chuẩn bị trước.</div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="py-1.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs rounded-[2px] cursor-pointer transition-colors"
                >
                  Để tôi tự tạo thủ công
                </button>
                <button
                  onClick={handleConfirmImportRoles}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Xác nhận nạp tự động 13 vai trò
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hệ thống đã tự động nạp đủ 16 vai trò (gồm 2 vai trò mặc định và 14 vai trò nghiệp vụ ngân hàng) vào danh sách.
              </p>

              <div className="py-2.5 px-3 bg-emerald-50 border-l-2 border-[#28a745] text-xs text-emerald-900">
                Bước tiếp theo của phân hệ: Thiết lập ma trận phân quyền chi tiết cho vai trò tác nghiệp theo 8 phòng ban.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="py-1.5 px-3 text-gray-500 hover:text-gray-700 text-xs cursor-pointer"
                >
                  Đóng hướng dẫn
                </button>
                <button
                  onClick={handleContinueToPermissions}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Tiếp tục: Thiết lập ma trận phân quyền (Role Permissions)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Pop-up prompt after creating VND sample currency (GL Part 1)
  if (module === 'gl-part-1' && currencyPopup) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 select-none">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
            {currenciesImported ? 'Đã hoàn thành cấu hình tiền tệ' : 'Hoàn thành lưu mẫu đơn vị tiền tệ VND'}
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {currenciesImported 
              ? 'Đã nạp đủ 5 loại tiền tệ chuẩn trong Database!' 
              : 'Tiếp tục nạp đủ 5 đơn vị tiền tệ chuẩn trong Database?'}
          </h3>

          {!currenciesImported ? (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bạn đã thực hành lưu thành công đồng tiền hạch toán cơ sở <strong className="text-gray-900 font-semibold">Vietnamese Dong (VND)</strong>.
              </p>

              <div className="py-2.5 px-3 bg-sky-50 border-l-2 border-[#1072ba] text-xs text-sky-900 leading-relaxed">
                Trong <strong>Phân hệ 01: Accounting / GL</strong>, ngân hàng cần thiết lập đủ <strong>5 đơn vị tiền tệ chuẩn</strong> (VND, USD, JPY, CNY, IDR) để phục vụ hạch toán kế toán đa tiền tệ và các sản phẩm tín dụng, tiền gửi.
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (onLoadAllCurrencies) onLoadAllCurrencies();
                    setCurrenciesImported(true);
                  }}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Xác nhận nạp đủ 5 đơn vị tiền tệ
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hệ thống đã tự động cấu hình đủ 5 đơn vị tiền tệ chuẩn: <strong>VND, USD, JPY, CNY, IDR</strong> vào hệ thống.
              </p>

              <div className="py-2.5 px-3 bg-emerald-50 border-l-2 border-[#28a745] text-xs text-emerald-900">
                Chúc mừng! Tiến độ Phân hệ 01 - Phần 1 đã đạt <strong>100%</strong>. Bạn có thể chuyển sang phần tiếp theo trong Sổ tay bài học.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrencyPopup(false);
                    onClose();
                  }}
                  className="py-2 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Hoàn tất bài học (100%)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Pop-up prompt after creating 1 user
  if (tourPhase === 'user-popup') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
            {usersImported ? 'Đã nạp toàn bộ tài khoản nhân sự' : 'Tiếp tục thiết lập tài khoản nhân viên'}
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {usersImported 
              ? 'Đã nạp đầy đủ 26 tài khoản nhân viên vào hệ thống!' 
              : 'Tiếp tục nạp 24 tài khoản nhân viên còn lại cho ngân hàng?'}
          </h3>

          {!usersImported ? (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bạn đã thực hành tạo thành công 1 tài khoản nhân viên: <strong className="text-gray-900 font-semibold">tkb.teller01</strong> (Huong Doan - Takashimaya Bank HO).
              </p>

              <p className="text-xs text-gray-600 leading-relaxed">
                Theo thiết kế hệ thống ngân hàng Takashimaya Bank (TKB), cần thiết lập đầy đủ danh sách nhân sự cho các bộ phận (Tín dụng, Kế toán, Kiểm toán, Quản trị hệ thống, Thu ngân...).
              </p>

              <div className="py-2.5 px-3 bg-gray-50 border-l-2 border-[#1072ba] text-[11px] text-gray-600 space-y-1">
                <div>Nhấn <strong>Xác nhận</strong> để hệ thống tự động nạp toàn bộ 24 tài khoản nhân viên còn lại từ cơ sở dữ liệu đã chuẩn bị trước.</div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="py-1.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs rounded-[2px] cursor-pointer transition-colors"
                >
                  Để tôi tự tạo thủ công
                </button>
                <button
                  onClick={handleConfirmImportUsers}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Xác nhận nạp tự động 24 nhân viên
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hệ thống đã tự động nạp đủ 26 tài khoản nhân sự (gồm 2 tài khoản quản trị hệ thống mặc định và 24 tài khoản nhân sự các phòng ban) từ cơ sở dữ liệu.
              </p>

              <div className="py-2.5 px-3 bg-amber-50 border-l-2 border-amber-500 text-[11px] text-amber-900">
                <strong>Lưu ý bảo mật:</strong> 2 tài khoản hệ thống mặc định (<code>bank Administrator</code> và <code>system</code>) luôn được bảo vệ, khi bấm vào sẽ có thông báo khóa không cho phép sửa đổi hoặc xóa.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    if (navigate) navigate('admin-users');
                    setTourPhase('completed');
                  }}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Xem danh sách Users (26 tài khoản)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Final completion modal
  if (tourPhase === 'completed') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
            Phân hệ hoàn tất thành công
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            Hoàn tất Phân hệ 01: User & Access Management!
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Chúc mừng bạn đã hoàn thành trọn vẹn luồng thực hành Phân hệ 01:
          </p>

          <div className="py-2.5 px-3 bg-gray-50 border-l-2 border-[#1072ba] text-xs text-gray-700 space-y-1.5">
            <div>Thiết lập hệ thống vai trò tác nghiệp (Roles) chuẩn ngân hàng.</div>
            <div>Tạo tài khoản người dùng nhân viên (Users) và phân quyền nghiệp vụ.</div>
            <div>Nạp toàn bộ dữ liệu 26 nhân sự ngân hàng từ cơ sở dữ liệu.</div>
            <div>Bảo vệ nghiêm ngặt 2 tài khoản và 2 vai trò hệ thống mặc định.</div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="py-2 px-5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
            >
              Hoàn tất thực hành
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASA Part 1 completion modal
  if (module === 'casa-part-1' && casaProductPopup) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              Khởi tạo sản phẩm thành công
            </span>
            <button
              onClick={() => setCasaProductPopup(false)}
              className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            Sản phẩm CASA: TKB Current Account (TKCA) đã kích hoạt!
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Chúc mừng bạn đã hoàn thành thiết lập sản phẩm Tiền gửi thanh toán (CASA) chuẩn hóa theo đúng yêu cầu nghiệp vụ ngân hàng:
          </p>

          <div className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-[2px] text-xs text-gray-700 space-y-1.5 font-sans">
            <div className="flex justify-between">
              <span className="text-gray-500">Tên sản phẩm:</span>
              <strong className="text-gray-900">TKB Current Account (TKCA)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Đơn vị tiền tệ:</span>
              <strong className="text-gray-900">VND (0 Decimals, Bội số 1)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Điều khoản lãi:</span>
              <strong className="text-gray-900">0.00% / năm (Daily Balance, 365 Days)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Số dư tối thiểu:</span>
              <strong className="text-gray-900">0 VND (Không hạn chế số dư)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Hạch toán kế toán:</span>
              <strong className="text-[#1072ba]">Cash Based (TK 110201 đối ứng Có 210102)</strong>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between space-x-3">
            <button
              type="button"
              onClick={() => {
                setCasaProductPopup(false);
                if (navigate) navigate('admin-savings-products');
              }}
              className="py-2 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-[2px] cursor-pointer transition-colors"
            >
              Xem danh sách SP Saving
            </button>

            <button
              type="button"
              onClick={() => {
                setCasaProductPopup(false);
                if (onClose) onClose();
                if (navigate) navigate('clients');
              }}
              className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
            >
              Tiếp tục: Tạo CIF Khách Hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASA Part 2 completion modal
  if (module === 'casa-part-2' && casaCifPopup) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              Tạo hồ sơ CIF thành công
            </span>
            <button
              onClick={() => setCasaCifPopup(false)}
              className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            Đã hoàn thành tạo 2 hồ sơ CIF (Minh Quang Tran & Lan Ngoc Pham)!
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Hồ sơ cả hai khách hàng cá nhân đã được tạo thành công tại Phòng giao dịch Thủ Đức và tự động liên kết tài khoản tiền gửi thanh toán CASA:
          </p>

          <div className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-[2px] text-xs text-gray-700 space-y-2.5 font-sans">
            {/* CIF 1 */}
            <div className="border-b border-gray-200 pb-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">CIF 1:</span>
                <strong className="text-gray-900">Minh Quang Tran (Mã CIF: 000000011)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">External ID:</span>
                <span className="font-mono text-gray-800">TKB-CIF-TDU-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cán bộ quản lý:</span>
                <span className="text-gray-800">Dang, Quan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tài khoản CASA cấp tự động:</span>
                <strong className="text-[#1072ba]">000000001 (TKB Current Account)</strong>
              </div>
            </div>

            {/* CIF 2 */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">CIF 2:</span>
                <strong className="text-gray-900">Lan Ngoc Pham (Mã CIF: 000000012)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">External ID:</span>
                <span className="font-mono text-gray-800">TKB-CIF-TDU-002</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cán bộ quản lý:</span>
                <span className="text-gray-800">Unassigned</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tài khoản CASA cấp tự động:</span>
                <strong className="text-[#1072ba]">000000002 (TKB Current Account)</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between space-x-3">
            <button
              type="button"
              onClick={() => {
                setCasaCifPopup(false);
              }}
              className="py-2 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-[2px] cursor-pointer transition-colors"
            >
              Xem chi tiết hồ sơ
            </button>

            <button
              type="button"
              onClick={() => {
                setCasaCifPopup(false);
                if (onClose) onClose();
                if (navigate) navigate('clients');
              }}
              className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
            >
              Hoàn thành bài thực hành CIF
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASA Part 3 completion modal (Deposit Money To Saving Account)
  if (module === 'casa-part-3' && casaDepositPopup) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              Nạp tiền CASA thành công
            </span>
            <button
              onClick={() => setCasaDepositPopup(false)}
              className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            Giao dịch nộp 5,000,000 VND vào tài khoản CASA thành công!
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Hệ thống Core Banking đã hoàn tất hạch toán giao dịch nạp tiền ban đầu cho tài khoản tiền gửi thanh toán của khách hàng Minh Quang Tran:
          </p>

          <div className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-[2px] text-xs text-gray-700 space-y-2 font-sans">
            <div className="flex justify-between">
              <span className="text-gray-500">Khách hàng:</span>
              <strong className="text-gray-900">Minh Quang Tran (000000011)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tài khoản CASA:</span>
              <strong className="text-[#1072ba]">000000001 (TKB Current Account)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày giao dịch:</span>
              <span className="text-gray-800 font-mono">10/13/2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phương thức thanh toán:</span>
              <span className="text-gray-800">Money Transfer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Số tiền nạp:</span>
              <strong className="text-emerald-700 font-mono">5,000,000.00 VND</strong>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-1.5">
              <span className="text-gray-500">Số dư khả dụng mới:</span>
              <strong className="text-emerald-700 font-mono text-sm">đ5,000,000.00</strong>
            </div>
            <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-100">
              Ghi chú: Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001.
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between space-x-3">
            <button
              type="button"
              onClick={() => {
                setCasaDepositPopup(false);
              }}
              className="py-2 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-[2px] cursor-pointer transition-colors"
            >
              Xem chi tiết tài khoản
            </button>

            <button
              type="button"
              onClick={() => {
                setCasaDepositPopup(false);
                if (onClose) onClose();
                if (navigate) navigate('clients');
              }}
              className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
            >
              Hoàn thành bài thực hành CASA
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASA Part 4 completion modal (Withdraw Money From Saving Account)
  if (module === 'casa-part-4' && casaWithdrawPopup) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-lg w-full p-6 text-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              Rút tiền CASA thành công
            </span>
            <button
              onClick={() => setCasaWithdrawPopup(false)}
              className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            Giao dịch rút 2,000,000 VND khỏi tài khoản CASA thành công!
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Hệ thống Core Banking đã hoàn tất hạch toán giao dịch rút tiền và đối soát số dư cho tài khoản tiền gửi thanh toán của khách hàng Minh Quang Tran:
          </p>

          <div className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-[2px] text-xs text-gray-700 space-y-2 font-sans">
            <div className="flex justify-between">
              <span className="text-gray-500">Khách hàng:</span>
              <strong className="text-gray-900">Minh Quang Tran (000000011)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tài khoản CASA:</span>
              <strong className="text-[#1072ba]">000000001 (TKB Current Account)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày giao dịch:</span>
              <span className="text-gray-800 font-mono">10/13/2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phương thức thanh toán:</span>
              <span className="text-gray-800">Money Transfer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Số tiền rút (Debit):</span>
              <strong className="text-red-700 font-mono">2,000,000.00 VND</strong>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-1.5">
              <span className="text-gray-500">Số dư khả dụng còn lại:</span>
              <strong className="text-emerald-700 font-mono text-sm">đ3,000,000.00</strong>
            </div>
            <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-100">
              Ghi chú: CASA withdrawal via bank transfer. TKB-CASA-WD-001.
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between space-x-3">
            <button
              type="button"
              onClick={() => {
                setCasaWithdrawPopup(false);
              }}
              className="py-2 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-[2px] cursor-pointer transition-colors"
            >
              Xem chi tiết tài khoản
            </button>

            <button
              type="button"
              onClick={() => {
                setCasaWithdrawPopup(false);
                if (onClose) onClose();
                if (navigate) navigate('clients');
              }}
              className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
            >
              Hoàn thành bài thực hành Rút tiền CASA
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tooltip position calculation
  const padding = 6;
  const box = targetRect ? {
    left: Math.max(0, targetRect.left - padding),
    top: Math.max(0, targetRect.top - padding),
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2,
    right: targetRect.left - padding + targetRect.width + padding * 2,
    bottom: targetRect.top - padding + targetRect.height + padding * 2
  } : null;

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  let tooltipStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };

  // GL Part 9: Step 6 popup placed on the LEFT by default
  if (module === 'gl-part-9' && (currentPath === 'accounting-view-transaction' || currentStep === 6)) {
    tooltipStyle = {
      position: 'fixed',
      top: '100px',
      left: '24px',
      width: '350px'
    };
  }

  if (box) {
    // Treasury placement rules: always place on side to never cover inputs or journal
    if (module === 'treasury-part-1') {
      if (currentPath === 'accounting-create-journal') {
        tooltipStyle = {
          position: 'fixed',
          top: '70px',
          right: '24px',
          width: '380px',
          maxHeight: 'calc(100vh - 90px)',
          overflowY: 'auto'
        };
      } else if (currentPath === 'accounting-journal' || currentPath === 'accounting-journal-entries') {
        tooltipStyle = {
          position: 'fixed',
          top: '80px',
          right: '24px',
          width: '420px',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto'
        };
      } else if (currentPath === 'accounting-view-transaction') {
        tooltipStyle = {
          position: 'fixed',
          top: '90px',
          left: '24px',
          width: '380px'
        };
      } else if (box) {
        tooltipStyle = {
          position: 'fixed',
          top: `${box.bottom + 16}px`,
          left: `${Math.max(16, Math.min(box.left, windowWidth - 360 - 20))}px`,
          width: '360px'
        };
      }
    }

    if (module === 'casa-part-1' || module === 'casa-part-2' || module === 'casa-part-3' || module === 'casa-part-4' || module === 'casa-part-5' || module === 'saving-part-1' || module === 'saving-part-2' || module === 'saving-part-3' || module === 'saving-part-4' || module === 'loan-part-1' || module === 'loan-part-2') {
      const tooltipWidth = 340;
      if (targetSelector === '#tour-create-savings-product-btn' || targetSelector === '#tour-create-client-btn' || targetSelector === '#tour-create-fd-product-btn' || targetSelector === '#tour-create-rd-product-btn' || targetSelector === '#tour-create-loan-product-btn' || targetSelector === '#tour-rd-add-slab-btn') {
        tooltipStyle = {
          position: 'fixed',
          top: `${Math.max(20, box.top + 36)}px`,
          left: `${Math.max(16, box.left - tooltipWidth - 20)}px`,
          width: `${tooltipWidth}px`
        };
      } else if (targetSelector === '#tour-savings-action-menu' || targetSelector === '#tour-savings-account-overview' || targetSelector === '#tour-client-actions-menu-btn' || targetSelector === '#tour-client-actions-dropdown' || targetSelector === '#tour-client-new-fixed-deposit-btn' || targetSelector === '#tour-client-new-recurring-deposit-btn' || targetSelector === '#tour-fd-actions-menu' || targetSelector === '#tour-fd-action-approve' || targetSelector === '#tour-fd-action-activate' || targetSelector === '#tour-rd-actions-menu-btn' || targetSelector === '#tour-rd-action-approve' || targetSelector === '#tour-rd-action-activate' || targetSelector === '#tour-rd-action-deposit' || targetSelector === '#tour-rd-account-overview-balance' || targetSelector === '#tour-search-journal-tile' || targetSelector === '#tour-loan-products-tile' || targetSelector === '#tour-admin-products' || targetSelector === '#tour-client-new-loan-account-btn' || targetSelector === '#tour-loan-acc-open-console-btn' || targetSelector === '#tour-loan-acc-generate-schedule-btn' || targetSelector === '#tour-loan-actions-menu-btn' || targetSelector === '#tour-loan-action-approve-btn' || targetSelector === '#tour-loan-action-disburse-btn' || targetSelector === '#tour-loan-acc-console-run-btn' || targetSelector === '#tour-loan-acc-console-close-btn') {
        tooltipStyle = {
          position: 'fixed',
          top: `${Math.max(60, box.top)}px`,
          left: `${Math.max(16, box.left - tooltipWidth - 24)}px`,
          width: `${tooltipWidth}px`
        };
      } else if (targetSelector === '#tour-client-row-minh' || targetSelector === '#tour-saving-row-000000001' || targetSelector === '#tour-saving-link-000000001' || targetSelector === '#tour-saving-row-000000002' || targetSelector === '#tour-saving-link-000000002' || targetSelector === '#tour-client-row-lan' || targetSelector === '#tour-rd-breadcrumb-client') {
        tooltipStyle = {
          position: 'fixed',
          top: `${box.bottom + 16}px`,
          left: `${Math.max(16, Math.min(box.left, windowWidth - tooltipWidth - 20))}px`,
          width: `${tooltipWidth}px`
        };
      } else if (targetSelector === '#tour-deposit-savings-form' || targetSelector === '#tour-withdraw-savings-form' || targetSelector === '#tour-account-transfer-form' || targetSelector === '#tour-journal-transfer-entries' || targetSelector === '#tour-fd-details-form' || targetSelector === '#tour-fd-currency-form' || targetSelector === '#tour-fd-terms-form' || targetSelector === '#tour-fd-settings-form' || targetSelector === '#tour-fd-chart-form' || targetSelector === '#tour-fd-charges-form' || targetSelector === '#tour-fd-accounting-form' || targetSelector === '#tour-fd-preview-card' || targetSelector === '#tour-fd-slab-modal' || targetSelector === '#tour-fd-product-row-tkfd' || targetSelector === '#tour-fda-details-form' || targetSelector === '#tour-fda-terms-form' || targetSelector === '#tour-fda-settings-form' || targetSelector === '#tour-fda-chart-form' || targetSelector === '#tour-fda-charges-form' || targetSelector === '#tour-fda-preview-card' || targetSelector === '#tour-fd-account-detail-card' || targetSelector === '#tour-client-fixed-deposits-section' || targetSelector === '#tour-fd-approve-form' || targetSelector === '#tour-rd-details-form' || targetSelector === '#tour-rd-currency-form' || targetSelector === '#tour-rd-terms-form' || targetSelector === '#tour-rd-settings-form' || targetSelector === '#tour-rd-chart-form' || targetSelector === '#tour-rd-slabs-table' || targetSelector === '#tour-rd-slab-modal' || targetSelector === '#tour-rd-charges-form' || targetSelector === '#tour-rd-accounting-form' || targetSelector === '#tour-rd-preview-card' || targetSelector === '#tour-rd-product-row-tkgs' || targetSelector === '#tour-rda-details-form' || targetSelector === '#tour-rda-terms-form' || targetSelector === '#tour-rda-settings-form' || targetSelector === '#tour-rda-chart-form' || targetSelector === '#tour-rda-charges-form' || targetSelector === '#tour-rda-preview-card' || targetSelector === '#tour-rd-account-detail-card' || targetSelector === '#tour-client-recurring-deposits-section' || targetSelector === '#tour-rd-approve-form' || targetSelector === '#tour-rd-deposit-form' || targetSelector === '#tour-journal-entry-rd-deposit' || targetSelector === '#tour-loan-details-form' || targetSelector === '#tour-loan-currency-form' || targetSelector === '#tour-loan-settings-form' || targetSelector === '#tour-loan-settings-part1' || targetSelector === '#tour-loan-settings-part2' || targetSelector === '#tour-loan-terms-form' || targetSelector === '#tour-loan-charges-form' || targetSelector === '#tour-loan-accounting-form' || targetSelector === '#tour-loan-preview-card' || targetSelector === '#tour-loan-product-row-loan' || targetSelector === '#tour-loan-acc-details-form' || targetSelector === '#tour-loan-acc-terms-form' || targetSelector === '#tour-loan-acc-charges-form' || targetSelector === '#tour-loan-acc-schedule-card' || targetSelector === '#tour-loan-acc-schedule-table' || targetSelector === '#tour-loan-acc-preview-card' || targetSelector === '#tour-client-loan-row-000000001' || targetSelector === '#tour-client-loan-link-000000001' || targetSelector === '#tour-client-detail-loan-table' || targetSelector === '#tour-loan-summary-card' || targetSelector === '#tour-loan-detail-banner' || targetSelector === '#tour-loan-approve-card' || targetSelector === '#tour-loan-disburse-card') {
        if (box.right + tooltipWidth + 24 <= windowWidth) {
          tooltipStyle = {
            position: 'fixed',
            top: `${Math.max(60, Math.min(box.top, windowHeight - 480))}px`,
            left: `${box.right + 24}px`,
            width: `${tooltipWidth}px`
          };
        } else if (box.left >= tooltipWidth + 24) {
          tooltipStyle = {
            position: 'fixed',
            top: `${Math.max(60, Math.min(box.top, windowHeight - 480))}px`,
            left: `${box.left - tooltipWidth - 24}px`,
            width: `${tooltipWidth}px`
          };
        } else if (box.bottom + 260 <= windowHeight) {
          tooltipStyle = {
            position: 'fixed',
            top: `${box.bottom + 16}px`,
            left: `${Math.max(16, Math.min(box.left, windowWidth - tooltipWidth - 20))}px`,
            width: `${tooltipWidth}px`
          };
        } else if (box.top >= 280) {
          tooltipStyle = {
            position: 'fixed',
            bottom: `${Math.max(16, windowHeight - box.top + 16)}px`,
            left: `${Math.max(16, Math.min(box.left, windowWidth - tooltipWidth - 20))}px`,
            width: `${tooltipWidth}px`
          };
        } else {
          tooltipStyle = {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: `${tooltipWidth}px`
          };
        }
      } else if (targetSelector === '#tour-client-next-btn-step1' || targetSelector === '#tour-client-next-btn-step2' || targetSelector === '#tour-client-submit-btn' || targetSelector === '#tour-deposit-submit-btn' || targetSelector === '#tour-withdraw-submit-btn' || targetSelector === '#tour-account-transfer-submit' || targetSelector === '#tour-loan-acc-submit-btn' || targetSelector === '#tour-loan-approve-submit-btn' || targetSelector === '#tour-loan-disburse-submit-btn') {
        if (box.right + tooltipWidth + 24 <= windowWidth) {
          tooltipStyle = {
            position: 'fixed',
            top: `${Math.max(60, box.top - 40)}px`,
            left: `${box.right + 24}px`,
            width: `${tooltipWidth}px`
          };
        } else if (box.left >= tooltipWidth + 24) {
          tooltipStyle = {
            position: 'fixed',
            top: `${Math.max(60, box.top - 40)}px`,
            left: `${box.left - tooltipWidth - 24}px`,
            width: `${tooltipWidth}px`
          };
        } else {
          tooltipStyle = {
            position: 'fixed',
            top: `${Math.max(20, box.bottom + 16)}px`,
            left: `${Math.max(16, Math.min(box.left, windowWidth - tooltipWidth - 20))}px`,
            width: `${tooltipWidth}px`
          };
        }
      } else if (box.right + tooltipWidth + 24 <= windowWidth) {
        tooltipStyle = {
          position: 'fixed',
          top: `${Math.max(60, Math.min(box.top, windowHeight - 480))}px`,
          left: `${box.right + 20}px`,
          width: `${tooltipWidth}px`
        };
      } else if (box.left >= tooltipWidth + 24) {
        tooltipStyle = {
          position: 'fixed',
          top: `${Math.max(60, Math.min(box.top, windowHeight - 480))}px`,
          left: `${box.left - tooltipWidth - 20}px`,
          width: `${tooltipWidth}px`
        };
      } else {
        const spaceBelow = windowHeight - box.bottom;
        if (spaceBelow >= 180) {
          tooltipStyle = {
            position: 'fixed',
            top: `${box.bottom + 16}px`,
            left: `${Math.max(16, Math.min(box.left, windowWidth - tooltipWidth - 20))}px`,
            width: `${tooltipWidth}px`
          };
        } else {
          tooltipStyle = {
            position: 'fixed',
            top: '80px',
            left: `${Math.max(16, windowWidth - tooltipWidth - 24)}px`,
            width: `${tooltipWidth}px`
          };
        }
      }
    } else if (module === 'gl-part-9' && (currentPath === 'accounting-view-transaction' || targetSelector === '#tour-view-transaction-screen' || currentStep === 6)) {
      // Step 6: popup strictly on the LEFT side of the screen
      const tooltipWidth = 350;
      tooltipStyle = {
        position: 'fixed',
        top: '100px',
        left: '24px',
        width: `${tooltipWidth}px`
      };
    } else if (module === 'gl-part-9' && (targetSelector === '#tour-frequent-submit-btn' || (currentPath === 'accounting-frequent-postings' && currentStep === 5))) {
      // Step 5: popup strictly on the RIGHT side so Submit button is never blocked
      const tooltipWidth = 350;
      let tooltipLeft = Math.max(24, box.right + 24);
      if (tooltipLeft + tooltipWidth > windowWidth - 16) {
        tooltipLeft = Math.max(16, windowWidth - tooltipWidth - 24);
      }
      const tooltipTop = Math.max(20, Math.min(box.top - 120, windowHeight - 480));
      tooltipStyle = {
        position: 'fixed',
        top: `${tooltipTop}px`,
        left: `${tooltipLeft}px`,
        width: `${tooltipWidth}px`
      };
    } else if (targetSelector === '#tour-submit-permissions-btn' || ((module === 'role-permissions' || module === 'part-1') && currentStep === 8)) {
      // Step 8: popup strictly on the RIGHT side of the spotlight area so Submit button is never blocked
      const tooltipWidth = 360;
      let tooltipLeft = Math.max(24, box.right + 24);
      if (tooltipLeft + tooltipWidth > windowWidth - 16) {
        tooltipLeft = Math.max(16, windowWidth - tooltipWidth - 24);
      }
      const tooltipTop = Math.max(20, Math.min(box.top - 120, Math.max(20, windowHeight - 460)));
      tooltipStyle = {
        position: 'fixed',
        top: `${tooltipTop}px`,
        left: `${tooltipLeft}px`,
        width: `${tooltipWidth}px`
      };
    } else if (targetSelector === '#tour-gl-create-card' || targetSelector === '#tour-mapping-create-card') {
      const tooltipWidth = 330;
      const tooltipLeft = Math.max(16, box.left - tooltipWidth - 20);
      const tooltipTop = Math.max(16, Math.min(box.top, windowHeight - 460));
      tooltipStyle = {
        position: 'fixed',
        top: `${tooltipTop}px`,
        left: `${tooltipLeft}px`,
        width: `${tooltipWidth}px`
      };
    } else if (targetSelector === '#tour-search-currency-area' && box.right + 370 <= windowWidth) {
      const tooltipTop = Math.max(16, box.top - 8);
      tooltipStyle = {
        position: 'fixed',
        top: `${tooltipTop}px`,
        left: `${box.right + 24}px`,
        width: '350px'
      };
    } else {
      const spaceBelow = windowHeight - box.bottom;
      const spaceAbove = box.top;
      let tooltipTop = box.bottom + 12;

      if (box.height > 200) {
        if (spaceBelow >= 160) {
          tooltipTop = box.bottom + 12;
        } else if (spaceAbove >= 160) {
          tooltipTop = Math.max(16, box.top - 165);
        } else {
          tooltipTop = 16;
        }
      } else {
        const placeAbove = spaceBelow < 190 && spaceAbove > 190;
        tooltipTop = placeAbove ? Math.max(10, box.top - 180) : Math.min(windowHeight - 200, box.bottom + 12);
      }

      const tooltipLeft = Math.min(Math.max(16, box.left), windowWidth - 360);

      tooltipStyle = {
        position: 'fixed',
        top: `${tooltipTop}px`,
        left: `${tooltipLeft}px`,
        width: '340px'
      };
    }
  }

  return (
    <>
      {/* 1. Dark overlay with spotlight cutout using SVG mask */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[9985]">
        <defs>
          <mask id="practice-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {box && (
              <rect
                x={box.left}
                y={box.top}
                width={box.width}
                height={box.height}
                rx={4}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.72)"
          mask="url(#practice-spotlight-mask)"
        />
      </svg>

      {/* 2. Transparent click-blockers around target cutout */}
      {box && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: `${Math.max(0, box.top)}px`,
              zIndex: 9988,
              cursor: 'not-allowed'
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: `${box.bottom}px`,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9988,
              cursor: 'not-allowed'
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: `${box.top}px`,
              left: 0,
              width: `${Math.max(0, box.left)}px`,
              height: `${box.height}px`,
              zIndex: 9988,
              cursor: 'not-allowed'
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: `${box.top}px`,
              left: `${box.right}px`,
              right: 0,
              height: `${box.height}px`,
              zIndex: 9988,
              cursor: 'not-allowed'
            }}
          />
        </>
      )}

      {/* 3. Glowing animated highlight ring */}
      {box && (
        <div
          style={{
            position: 'fixed',
            left: `${box.left}px`,
            top: `${box.top}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
            zIndex: 9992,
            pointerEvents: 'none'
          }}
          className="border-2 border-[#1072ba] rounded-[3px] ring-4 ring-[#1072ba]/40 animate-pulse"
        />
      )}

      {/* 4. Instruction Tooltip Card */}
      <div
        style={tooltipStyle}
        className="fixed z-[9999] bg-white rounded-[2px] shadow-2xl border border-gray-200 p-4 text-xs text-gray-800 space-y-3 animate-in fade-in zoom-in-95 duration-150 select-none max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
            Chế độ thực hành có hướng dẫn
          </span>
          <button
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-gray-700 font-medium cursor-pointer"
          >
            Thoát thực hành
          </button>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 text-xs">
            {stepTitle}
          </h4>
          {stepSubtitle && (
            <div className="text-[11px] font-semibold text-[#1072ba] mt-1 leading-snug">
              {stepSubtitle}
            </div>
          )}
          <p className="text-gray-600 text-[11px] mt-1.5 leading-relaxed">
            {stepInstruction}
          </p>
        </div>

        {/* Quick autofill & interactive actions for CASA Part 1 */}
        {module === 'casa-part-1' && (
          <div className="space-y-2 mt-2">
            {currentPath === 'admin-create-savings-product' && (
              <>
                {targetSelector === '#tour-casa-form-details' && (
                  <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-[#1072ba]">
                      Thông tin mẫu Tab DETAILS:
                    </div>
                    <div className="text-[10px] text-gray-700 font-mono bg-white p-2 rounded border border-sky-100 space-y-0.5">
                      <div>Product Name: <strong>TKB Current Account</strong></div>
                      <div>Short Name: <strong>TKCA</strong></div>
                      <div>Description: <strong>Basic VND CASA Product · Demo</strong></div>
                    </div>
                    {!casaFilledSteps.details ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-casa-details'));
                          setCasaFilledSteps(prev => ({ ...prev, details: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Details
                      </button>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Details đã được điền. Hãy rà soát các trường trên màn hình rồi bấm Tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-casa-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp theo (Sang Tab CURRENCY)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {targetSelector === '#tour-casa-form-currency' && (
                  <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-[#1072ba]">
                      Thông tin mẫu Tab CURRENCY:
                    </div>
                    <div className="text-[10px] text-gray-700 font-mono bg-white p-2 rounded border border-sky-100 space-y-0.5">
                      <div>Currency: <strong>Vietnamese Dong (VND)</strong></div>
                      <div>Decimal Places: <strong>0</strong></div>
                      <div>In multiples of: <strong>1</strong></div>
                    </div>
                    {!casaFilledSteps.currency ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-casa-currency'));
                          setCasaFilledSteps(prev => ({ ...prev, currency: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Currency
                      </button>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Currency đã được điền. Hãy rà soát các trường trên màn hình rồi bấm Tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-casa-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp theo (Sang Tab TERMS)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {targetSelector === '#tour-casa-form-terms' && (
                  <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-[#1072ba]">
                      Thông tin mẫu Tab TERMS:
                    </div>
                    <div className="text-[10px] text-gray-700 font-mono bg-white p-2 rounded border border-sky-100 space-y-0.5">
                      <div>Nominal Interest: <strong>0%</strong></div>
                      <div>Compounding: <strong>Daily</strong> | Posting: <strong>Monthly</strong></div>
                      <div>Calculated using: <strong>Daily Balance</strong></div>
                      <div>Days in Year: <strong>365 Days</strong></div>
                    </div>
                    {!casaFilledSteps.terms ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-casa-terms'));
                          setCasaFilledSteps(prev => ({ ...prev, terms: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Terms
                      </button>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Terms đã được điền và mở khóa Tab Preview. Bấm Tiếp theo để sang Tab Settings.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-casa-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp theo (Sang Tab SETTINGS)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {targetSelector === '#tour-casa-form-settings' && (
                  <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-[#1072ba]">
                      Thông tin mẫu Tab SETTINGS:
                    </div>
                    <div className="text-[10px] text-gray-700 font-mono bg-white p-2 rounded border border-sky-100 space-y-0.5">
                      <div>Min Opening Balance: <strong>0 VND</strong></div>
                      <div>Lock-in Period: <strong>Để trống</strong></div>
                      <div>Overdraft / Rút chuyển khoản: <strong>Không chọn</strong></div>
                    </div>
                    {!casaFilledSteps.settings ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-casa-settings'));
                          setCasaFilledSteps(prev => ({ ...prev, settings: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Settings
                      </button>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Settings đã được điền. Bấm Tiếp theo để sang Tab Charges.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-casa-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp theo (Sang Tab CHARGES)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {targetSelector === '#tour-casa-form-charges' && (
                  <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-[#1072ba]">
                      Tab CHARGES (Biểu phí):
                    </div>
                    <p className="text-[10px] text-gray-600">
                      Sản phẩm CASA cơ bản này mở miễn phí, không gán phí dịch vụ bắt buộc.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-next-casa-step'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang Tab ACCOUNTING
                    </button>
                  </div>
                )}

                {targetSelector === '#tour-casa-form-accounting' && (
                  <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-[#1072ba]">
                      Thông tin mẫu Tab ACCOUNTING (Cash Based):
                    </div>
                    <div className="text-[10px] text-gray-700 font-mono bg-white p-2 rounded border border-sky-100 space-y-0.5">
                      <div>Phương pháp: <strong>Cash Based</strong></div>
                      <div>Saving reference: <strong>110201 Settlement Bank</strong></div>
                      <div>Saving control: <strong>210102 Current Account Deposits</strong></div>
                      <div>Interest on savings: <strong>510101 Savings Interest Exp</strong></div>
                      <div>Fees & Penalty: <strong>420102 & 420103</strong></div>
                    </div>
                    {!casaFilledSteps.accounting ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-casa-accounting'));
                          setCasaFilledSteps(prev => ({ ...prev, accounting: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền mẫu Accounting (Cash Based)
                      </button>
                    ) : (
                      <div className="space-y-1.5 pt-1">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Đã liên kết 9 tài khoản kế toán đối ứng. Hãy rà soát trên màn hình rồi bấm Tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-casa-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp theo (Sang Tab PREVIEW)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {targetSelector === '#tour-casa-preview-card' && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-emerald-900">
                      Rà soát & Kích hoạt sản phẩm CASA:
                    </div>
                    <p className="text-[10px] text-emerald-800">
                      Mọi tham số đã hoàn thiện. Bấm nút Submit màu xanh để chính thức kích hoạt sản phẩm trên hệ thống!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-submit-casa'));
                      }}
                      className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Bấm Submit tạo sản phẩm CASA
                    </button>
                  </div>
                )}

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('practice-fill-casa-all'));
                    }}
                    className="text-[10px] text-gray-500 hover:text-[#1072ba] underline cursor-pointer"
                  >
                    Điền nhanh toàn bộ và đến Preview
                  </button>
                </div>
              </>
            )}

            {currentPath === 'admin-savings-products' && (
              <>
                {savingsProducts.some(p => p.shortName === 'TKCA') ? (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
                      <div className="font-bold text-emerald-900 mb-0.5">
                        Đã tạo thành công sản phẩm TKB Current Account (TKCA)!
                      </div>
                      <div>Sản phẩm CASA đã sẵn sàng trên hệ thống core banking.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onClose) onClose();
                        if (navigate) navigate('clients');
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục: Tạo CIF Khách Hàng (Phần 2)
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) navigate('admin-create-savings-product');
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Mở biểu mẫu Create Savings Product
                  </button>
                )}
              </>
            )}

            {currentPath === 'admin-products' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('admin-savings-products');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Chọn Savings Products
              </button>
            )}

            {currentPath !== 'admin-create-savings-product' && currentPath !== 'admin-savings-products' && currentPath !== 'admin-products' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('admin-products');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Đến trang Quản lý Products
              </button>
            )}
          </div>
        )}

        {/* Quick autofill & interactive actions for CASA Part 2 */}
        {module === 'casa-part-2' && (
          <div className="space-y-2 mt-2">
            {currentPath === 'create-client' && (() => {
              const hasMinhTran = clients.some(c => 
                c.accountNo === '000000011' || c.externalId === 'TKB-CIF-TDU-001' || c.displayName?.toLowerCase().includes('minh quang tran')
              );
              const isTargetLan = hasMinhTran;

              return (
                <>
                  {/* Step 1: GENERAL */}
                  {(targetSelector === '#tour-create-client-form-general' || targetSelector === '#tour-client-next-btn-step1') && (
                    <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                      <div className="text-[11px] font-bold text-[#1072ba]">
                        {isTargetLan 
                          ? 'Thông tin hồ sơ CIF mẫu (Lan Ngoc Pham):' 
                          : 'Thông tin hồ sơ CIF mẫu (Minh Quang Tran):'}
                      </div>
                      <div className="text-[10px] text-gray-700 font-mono bg-white p-2 rounded border border-sky-100 space-y-0.5">
                        <div>Office: <strong>Thu Duc Transaction Office</strong></div>
                        <div>Legal Form: <strong>Person</strong> | Staff: <strong>{isTargetLan ? 'Unassigned' : 'Dang, Quan'}</strong></div>
                        <div>Họ và tên: <strong>{isTargetLan ? 'Lan Ngoc Pham' : 'Minh Quang Tran'}</strong></div>
                        <div>External ID: <strong>{isTargetLan ? 'TKB-CIF-TDU-002' : 'TKB-CIF-TDU-001'}</strong></div>
                        <div>DOB: <strong>{isTargetLan ? '8/5/2004' : '4/6/2000'}</strong> ({isTargetLan ? '05 August 2004' : '06 April 2000'})</div>
                        <div>Mobile: <strong>{isTargetLan ? '094462817' : '0955738216'}</strong> | Email: <strong>{isTargetLan ? 'ngoclan0805@gmail.com' : 'quang2004@gmail.com'}</strong></div>
                        <div>Submitted On: <strong>10/13/2026</strong> | Active: <strong>Yes</strong></div>
                        <div>Savings Product: <strong>TKB Current Account</strong></div>
                      </div>

                      {!(isTargetLan ? cifLanFilled : cifGeneralFilled) ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (isTargetLan) {
                              window.dispatchEvent(new CustomEvent('practice-autofill-cif-lan'));
                              setCifLanFilled(true);
                            } else {
                              window.dispatchEvent(new CustomEvent('practice-autofill-cif-minh'));
                              setCifGeneralFilled(true);
                            }
                          }}
                          className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          {isTargetLan 
                            ? 'Điền dữ liệu mẫu CIF 2 (Lan Ngoc Pham)' 
                            : 'Điền dữ liệu mẫu CIF 1 (Minh Quang Tran)'}
                        </button>
                      ) : (
                        <div className="space-y-1.5 pt-1">
                          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                            {isTargetLan
                              ? 'Dữ liệu CIF 2 (Lan Ngoc Pham) đã được điền. Hãy rà soát lại thông tin trước khi tiếp tục.'
                              : 'Dữ liệu CIF 1 (Minh Quang Tran) đã được điền. Hãy rà soát lại thông tin trước khi tiếp tục.'}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('practice-next-cif-step'));
                            }}
                            className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                          >
                            Tiếp theo (Sang Family Members)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: FAMILY MEMBERS */}
                  {targetSelector === '#tour-client-next-btn-step2' && (
                    <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                      <div className="text-[11px] font-bold text-[#1072ba]">
                        Tab FAMILY MEMBERS:
                      </div>
                      <p className="text-[10px] text-gray-600">
                        {isTargetLan 
                          ? 'Khách hàng Lan Ngoc Pham chưa đăng ký người phụ thuộc hay thông tin gia đình.' 
                          : 'Khách hàng Minh Quang Tran chưa đăng ký người phụ thuộc hay thông tin gia đình.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-next-cif-step'));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Chuyển sang Tab PREVIEW
                      </button>
                    </div>
                  )}

                  {/* Step 3: PREVIEW */}
                  {(targetSelector === '#tour-create-client-preview-card' || targetSelector === '#tour-client-submit-btn') && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                      <div className="text-[11px] font-bold text-emerald-900">
                        {isTargetLan ? 'Rà soát & Hoàn tất tạo CIF 2 (Lan Ngoc Pham):' : 'Rà soát & Hoàn tất tạo CIF 1 (Minh Quang Tran):'}
                      </div>
                      <p className="text-[10px] text-emerald-800">
                        {isTargetLan
                          ? 'Kiểm tra lại toàn bộ thông tin tại bảng tóm tắt bên trái. Bấm nút Submit màu xanh để tạo hồ sơ và kích hoạt tài khoản CASA 000000002!'
                          : 'Kiểm tra lại toàn bộ thông tin tại bảng tóm tắt bên trái. Bấm nút Submit màu xanh để tạo hồ sơ khách hàng và kích hoạt tài khoản CASA!'}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-submit-cif'));
                        }}
                        className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        {isTargetLan ? 'Bấm Submit tạo CIF 2' : 'Bấm Submit tạo CIF 1'}
                      </button>
                    </div>
                  )}
                </>
              );
            })()}

            {currentPath === 'clients' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('create-client');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Mở biểu mẫu Create Client
              </button>
            )}

            {currentPath === 'client-detail' && (() => {
              const hasMinhTran = clients.some(c => 
                c.accountNo === '000000011' || c.externalId === 'TKB-CIF-TDU-001' || c.displayName?.toLowerCase().includes('minh quang tran')
              );
              const hasLanPham = clients.some(c => 
                c.accountNo === '000000012' || c.externalId === 'TKB-CIF-TDU-002' || c.displayName?.toLowerCase().includes('lan ngoc pham')
              );

              if (hasMinhTran && !hasLanPham) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed">
                      <div className="font-bold text-sky-950 mb-0.5">
                        Đã tạo CIF 1: Minh Quang Tran (000000011)!
                      </div>
                      <div>Tài khoản CASA 000000001 đã được cấp. Bây giờ hãy tiếp tục tạo hồ sơ cho khách hàng thứ 2: Lan Ngoc Pham.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCifLanFilled(false);
                        if (navigate) navigate('create-client');
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục tạo Khách hàng 2 (Lan Ngoc Pham)
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
                    <div className="font-bold text-emerald-900 mb-0.5">
                      Đã hoàn thành tạo 2 hồ sơ CIF (Minh Quang Tran & Lan Ngoc Pham)!
                    </div>
                    <div>Cả 2 tài khoản CASA (000000001 & 000000002) đã được cấp và hiển thị trong danh mục Saving Accounts.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onClose) onClose();
                      if (navigate) navigate('clients');
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Hoàn tất bài thực hành CIF
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Quick autofill & interactive actions for CASA Part 3 (Deposit Money to Saving Account) */}
        {module === 'casa-part-3' && (
          <div className="space-y-2 mt-2">
            {/* Step 1: clients view */}
            {currentPath === 'clients' && (
              <button
                type="button"
                onClick={() => {
                  const targetClient = clients.find(c => 
                    c.accountNo === '000000011' || 
                    c.externalId === 'TKB-CIF-TDU-001' || 
                    c.displayName?.toLowerCase().includes('minh quang tran')
                  ) || clients[0];
                  if (navigate) navigate('client-detail');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Mở hồ sơ Minh Quang Tran
              </button>
            )}

            {/* Step 2: client-detail view */}
            {currentPath === 'client-detail' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('savings-detail');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Mở chi tiết tài khoản CASA (000000001)
              </button>
            )}

            {/* Step 3: savings-detail view */}
            {currentPath === 'savings-detail' && (() => {
              const account001 = savingsAccounts.find(s => s.accountNo === '000000001');
              const isDeposited = account001 && (Number(account001.balance) >= 5000000 || Number(account001.accountBalance) >= 5000000);
              
              if (!isDeposited) {
                return (
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) navigate('savings-deposit');
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Mở biểu mẫu Deposit (Nộp tiền)
                  </button>
                );
              }

              return (
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
                    <div className="font-bold text-emerald-900 mb-0.5">
                      Giao dịch nạp tiền thành công!
                    </div>
                    <div>Tài khoản 000000001 đã có số dư khả dụng đ5,000,000.00. Tab Transactions đã ghi nhận giao dịch nộp tiền.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCasaDepositPopup(true);
                    }}
                    className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Hoàn tất bài thực hành CASA
                  </button>
                </div>
              );
            })()}

            {/* Step 4: savings-deposit view */}
            {currentPath === 'savings-deposit' && (
              <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                <div className="text-[11px] font-bold text-[#1072ba]">
                  Thông tin giao dịch nộp tiền mẫu:
                </div>
                <div className="text-[10px] text-gray-700 font-mono bg-white p-2 rounded border border-sky-100 space-y-0.5">
                  <div>Transaction Date: <strong>10/13/2026</strong></div>
                  <div>Transaction Amount: <strong>VND 5,000,000.00</strong></div>
                  <div>Payment Type: <strong>Money Transfer</strong></div>
                  <div>Notes: <strong>Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001.</strong></div>
                </div>

                {!depositFilled ? (
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('practice-autofill-deposit'));
                      setDepositFilled(true);
                    }}
                    className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Điền dữ liệu mẫu Nạp tiền
                  </button>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                      Dữ liệu nạp tiền đã được điền vào biểu mẫu. Hãy rà soát lại thông tin trước khi gửi.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-submit-deposit'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Bấm Submit nạp tiền
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick autofill & interactive actions for CASA Part 4 (Withdraw Money From Saving Account) */}
        {module === 'casa-part-4' && (
          <div className="space-y-2 mt-2">
            {/* Step 1: clients view */}
            {currentPath === 'clients' && (
              <button
                type="button"
                onClick={() => {
                  const targetClient = clients.find(c => 
                    c.accountNo === '000000011' || 
                    c.externalId === 'TKB-CIF-TDU-001' || 
                    c.displayName?.toLowerCase().includes('minh quang tran')
                  ) || clients[0];
                  if (navigate) navigate('client-detail');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Mở hồ sơ Minh Quang Tran
              </button>
            )}

            {/* Step 2: client-detail view */}
            {currentPath === 'client-detail' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('savings-detail');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Mở chi tiết tài khoản CASA (000000001)
              </button>
            )}

            {/* Step 3: savings-detail view */}
            {currentPath === 'savings-detail' && (() => {
              const account001 = savingsAccounts.find(s => s.accountNo === '000000001');
              const isWithdrawn = account001 && (
                account001.transactions?.some(t => t.type === 'WITHDRAWAL' || t.transactionType === 'Withdrawal') ||
                (account001.balance !== null && Number(account001.balance) <= 3000000 && Number(account001.balance) > 0)
              );
              
              if (!isWithdrawn) {
                return (
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) navigate('savings-withdraw');
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Mở biểu mẫu Withdrawal (Rút tiền)
                  </button>
                );
              }

              return (
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
                    <div className="font-bold text-emerald-900 mb-0.5">
                      Giao dịch rút tiền thành công!
                    </div>
                    <div>Tài khoản 000000001 đã giảm còn số dư khả dụng đ3,000,000.00. Tab Transactions đã ghi nhận giao dịch rút tiền.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCasaWithdrawPopup(true);
                    }}
                    className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Hoàn tất bài thực hành Rút tiền CASA
                  </button>
                </div>
              );
            })()}

            {/* Step 4: savings-withdraw view */}
            {currentPath === 'savings-withdraw' && (
              <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                <div className="text-[11px] font-bold text-[#1072ba]">
                  Thông tin giao dịch rút tiền mẫu:
                </div>
                <div className="text-[10px] text-gray-700 font-mono bg-white p-2 rounded border border-sky-100 space-y-0.5">
                  <div>Transaction Date: <strong>10/13/2026</strong></div>
                  <div>Transaction Amount: <strong>VND 2,000,000.00</strong></div>
                  <div>Payment Type: <strong>Money Transfer</strong></div>
                  <div>Notes: <strong>CASA withdrawal via bank transfer. TKB-CASA-WD-001.</strong></div>
                </div>

                {!withdrawFilled ? (
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('practice-autofill-withdraw'));
                      setWithdrawFilled(true);
                    }}
                    className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Điền dữ liệu mẫu Rút tiền
                  </button>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                      Dữ liệu rút tiền đã được điền vào biểu mẫu. Hãy rà soát lại thông tin trước khi gửi.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-submit-withdraw'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Bấm Submit rút tiền
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {/* Quick autofill & interactive actions for CASA Part 5 (Account Transfer) */}
        {module === 'casa-part-5' && (() => {
          const account001 = savingsAccounts.find(s => s.accountNo === '000000001');
          const account002 = savingsAccounts.find(s => s.accountNo === '000000002');
          const isTransferred = (
            (account001 && (
              account001.transactions?.some(t => t.type === 'TRANSFER_FROM' || t.transactionType?.toLowerCase().includes('transfer from')) ||
              (account001.balance !== null && Number(account001.balance) <= 2000000 && Number(account001.balance) > 0)
            )) ||
            (account002 && (
              account002.transactions?.some(t => t.type === 'TRANSFER_TO' || t.transactionType?.toLowerCase().includes('transfer to')) ||
              (account002.balance !== null && Number(account002.balance) >= 1000000)
            ))
          );

          return (
            <div className="space-y-2 mt-2">
              {/* Step 1: clients view */}
              {currentPath === 'clients' && (
                <button
                  type="button"
                  onClick={() => {
                    const targetClient = clients.find(c => 
                      c.accountNo === '000000011' || 
                      c.externalId === 'TKB-CIF-TDU-001' || 
                      c.displayName?.toLowerCase().includes('minh quang tran')
                    ) || clients[0];
                    if (onSelectClient) onSelectClient(targetClient);
                    if (navigate) navigate('client-detail');
                  }}
                  className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Mở hồ sơ Minh Quang Tran
                </button>
              )}

              {/* Step 2: client-detail view before transfer */}
              {currentPath === 'client-detail' && !isTransferred && (
                <button
                  type="button"
                  onClick={() => {
                    const targetSavings = savingsAccounts.find(s => s.accountNo === '000000001');
                    if (targetSavings && onSelectSavings) onSelectSavings(targetSavings);
                    if (navigate) navigate('savings-detail');
                  }}
                  className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Mở chi tiết tài khoản CASA (000000001)
                </button>
              )}

              {/* Step 3: savings-detail view before transfer */}
              {currentPath === 'savings-detail' && !isTransferred && (
                <button
                  type="button"
                  onClick={() => {
                    if (navigate) navigate('account-transfer');
                  }}
                  className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Mở biểu mẫu Transfer Funds (Chuyển khoản)
                </button>
              )}

              {/* Step 4: account-transfer view */}
              {currentPath === 'account-transfer' && (
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] space-y-1.5 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold text-[#1072ba]">
                    Thông tin chuyển khoản mẫu:
                  </div>
                  <div className="text-[10px] text-gray-700 font-mono bg-white p-2 rounded border border-sky-100 space-y-0.5">
                    <div>Office: <strong>Thu Duc Transaction Office</strong></div>
                    <div>Client: <strong>Lan Ngoc Pham</strong></div>
                    <div>Account Type: <strong>Savings Account</strong></div>
                    <div>Account: <strong>TKB Current Account - 000000002</strong></div>
                    <div>Date: <strong>10/13/2026</strong></div>
                    <div>Amount: <strong>1,000,000 VND</strong></div>
                    <div>Desc: <strong>Internal CASA transfer to Lan Pham. TKB-TRF-001.</strong></div>
                  </div>

                  {!transferFilled ? (
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-autofill-transfer'));
                        setTransferFilled(true);
                      }}
                      className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Điền dữ liệu mẫu Chuyển khoản
                    </button>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                        Dữ liệu chuyển khoản đã được điền vào biểu mẫu. Hãy rà soát lại thông tin trước khi gửi.
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-submit-transfer'));
                        }}
                        className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Bấm Submit chuyển khoản
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: savings-detail view after transfer */}
              {currentPath === 'savings-detail' && isTransferred && (
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
                    <div className="font-bold text-emerald-900 mb-0.5">
                      Lệnh chuyển khoản thành công!
                    </div>
                    <div>Tài khoản 000000001 đã giảm còn số dư khả dụng đ2,000,000.00. Tab Transactions đã ghi nhận giao dịch trích nợ 1.000.000 VND.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const clientLan = clients.find(c => c.displayName?.includes('Lan Ngoc') || c.accountNo === '000000012') || clients[1] || clients[0];
                      if (onSelectClient) onSelectClient(clientLan);
                      if (navigate) navigate('client-detail');
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Kiểm tra tài khoản Lan Ngoc Pham
                  </button>
                </div>
              )}

              {/* Step 6: client-detail view of Lan Ngoc Pham after transfer */}
              {currentPath === 'client-detail' && isTransferred && (
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
                    <div className="font-bold text-emerald-900 mb-0.5">
                      Tài khoản người nhận đã nhận đủ tiền!
                    </div>
                    <div>Tài khoản CASA 000000002 của Lan Ngoc Pham đã được ghi có 1.000.000 VND, nâng số dư lên đ1,000,000.00.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) navigate('accounting-journal');
                      window.dispatchEvent(new CustomEvent('practice-filter-transfer-journal'));
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Kiểm tra Sổ Nhật ký chung (Journal Entries)
                  </button>
                </div>
              )}

              {/* Step 7: journal-entries view (FINAL STEP WITH PERSISTENT SPOTLIGHT) */}
              {(currentPath === 'accounting-journal-entries' || currentPath === 'accounting-journal') && (
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed font-sans">
                    <div className="font-bold text-emerald-900 mb-1">
                      Hoàn tất đối soát 4 bút toán tự động (Tx S3 &amp; S4):
                    </div>
                    <div className="space-y-0.5 text-[10px] font-mono text-emerald-950 bg-white p-2 rounded border border-emerald-200">
                      <div>Dòng 65 (S3): Nợ 210102 - 1,000,000.00 VND</div>
                      <div>Dòng 66 (S3): Có 220201 - 1,000,000.00 VND</div>
                      <div>Dòng 67 (S4): Nợ 220201 - 1,000,000.00 VND</div>
                      <div>Dòng 68 (S4): Có 210102 - 1,000,000.00 VND</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                  >
                    Hoàn tất bài thực hành Chuyển khoản nội bộ
                  </button>
                </div>
              )}
            </div>
          );
        })()}


        {/* Quick autofill & interactive actions for Saving Part 1 (Fixed Deposit Product) */}
        {module === 'saving-part-1' && (
          <div className="space-y-2 mt-2">
            {/* Step 1: admin-products view */}
            {currentPath === 'admin-products' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('admin-fixed-deposit-products');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Mở Fixed Deposit Products
              </button>
            )}

            {/* Step 2: admin-fixed-deposit-products view */}
            {currentPath === 'admin-fixed-deposit-products' && (
              <>
                {fixedDepositProducts.some(p => p.shortName === 'TKFD') ? (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-emerald-900 text-xs">
                        Đã tạo thành công sản phẩm TKB Fixed Deposit (TKFD)!
                      </div>
                      <div>Sản phẩm Tiết kiệm có kỳ hạn đã được tạo và kích hoạt thành công trên hệ thống core banking với đầy đủ 4 bậc lãi suất (3.5% - 5.5% p.a.) và hạch toán kế toán Cash Based.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                    >
                      Hoàn thành phần thực hành
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) navigate('admin-create-fixed-deposit-product');
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Tạo sản phẩm Fixed Deposit
                  </button>
                )}
              </>
            )}

            {/* Step 3+: inside admin-create-fixed-deposit-product */}
            {currentPath === 'admin-create-fixed-deposit-product' && (() => {
              const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-details-form'));
              const hasCurrency = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-currency-form'));
              const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-terms-form'));
              const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-settings-form'));
              const hasChart = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-chart-form'));
              const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-charges-form'));
              const hasAccounting = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-accounting-form'));
              const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fd-preview-card'));

              if (hasDetails) {
                return (
                  <div className="space-y-1.5">
                    {!fdFilledSteps.details ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-fd-details'));
                          setFdFilledSteps(prev => ({ ...prev, details: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Details
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Details đã được điền. Hãy rà soát lại thông tin trước khi chuyển sang tab tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-fd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Currency
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasCurrency) {
                return (
                  <div className="space-y-1.5">
                    {!fdFilledSteps.currency ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-fd-currency'));
                          setFdFilledSteps(prev => ({ ...prev, currency: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Currency
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Currency đã được điền. Hãy rà soát lại thông tin trước khi chuyển sang tab tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-fd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Terms
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasTerms) {
                return (
                  <div className="space-y-1.5">
                    {!fdFilledSteps.terms ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-fd-terms'));
                          setFdFilledSteps(prev => ({ ...prev, terms: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Terms
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Terms đã được điền. Hãy rà soát lại thông tin trước khi chuyển sang tab tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-fd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Settings
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasSettings) {
                return (
                  <div className="space-y-1.5">
                    {!fdFilledSteps.settings ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-fd-settings'));
                          setFdFilledSteps(prev => ({ ...prev, settings: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Settings
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Settings đã được điền. Hãy rà soát lại thông tin trước khi chuyển sang tab tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-fd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Interest Rate Chart
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasChart) {
                return (
                  <div className="space-y-1.5">
                    {!fdFilledSteps.chart ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-fd-chart'));
                          setFdFilledSteps(prev => ({ ...prev, chart: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Chart & 4 Slabs
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Đã điền Biểu lãi suất và 4 bậc Slabs (1-3M: 3.5%, 4-6M: 4.5%, 7-9M: 5.0%, 10-12M: 5.5%). Hãy rà soát trên bảng trước khi chuyển sang tab tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-fd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Charges
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasCharges) {
                return (
                  <div className="space-y-1.5">
                    <div className="p-2 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-tight">
                      Tab Charges: Sản phẩm này không áp dụng phí dịch vụ. Hãy bấm Tiếp tục để chuyển sang tab Accounting.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-next-fd-step'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang tab Accounting
                    </button>
                  </div>
                );
              }

              if (hasAccounting) {
                return (
                  <div className="space-y-1.5">
                    {!fdFilledSteps.accounting ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-fd-accounting'));
                          setFdFilledSteps(prev => ({ ...prev, accounting: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền mẫu Accounting (Cash Based)
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Đã liên kết các tài khoản kế toán Cash Based (TK 110201, 210103, 220201, 510102, 420102, 420107). Hãy rà soát lại thông tin trước khi chuyển sang tab Preview.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-fd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Preview
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasPreview) {
                return (
                  <div className="space-y-1.5">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight font-sans">
                      <div className="font-bold text-emerald-900 mb-0.5">
                        Rà soát toàn bộ cấu hình sản phẩm
                      </div>
                      <div>Mọi tham số đã hoàn thiện. Bấm nút Submit màu xanh để chính thức kích hoạt sản phẩm trên hệ thống!</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-submit-fd'));
                      }}
                      className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Bấm Submit tạo sản phẩm Fixed Deposit
                    </button>
                  </div>
                );
              }

              return null;
            })()}

            {/* Quick autofill all */}
            {currentPath === 'admin-create-fixed-deposit-product' && (
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('practice-autofill-fd-all'));
                    setFdFilledSteps({
                      details: true,
                      currency: true,
                      terms: true,
                      settings: true,
                      chart: true,
                      accounting: true
                    });
                  }}
                  className="text-[10px] text-gray-500 hover:text-[#1072ba] underline cursor-pointer"
                >
                  Điền nhanh toàn bộ và đến Preview
                </button>
              </div>
            )}
          </div>
        )}

        {/* Module 03 - Part 2 Tour Actions: New Fixed Deposits Account */}
        {module === 'saving-part-2' && (
          <div className="space-y-2 mt-2">
            {/* Step 1: Clients list */}
            {currentPath === 'clients' && (
              <button
                type="button"
                onClick={() => {
                  const clientMinh = clients.find(c => c.id === '11' || c.accountNo === '000000011' || c.displayName?.includes('Minh Quang Tran'));
                  if (onSelectClient && clientMinh) onSelectClient(clientMinh);
                  if (navigate) navigate('client-detail');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Chọn khách hàng Minh Quang Tran
              </button>
            )}

            {/* Step 2 & 3: Client Detail view */}
            {currentPath === 'client-detail' && (
              <>
                {savingsAccounts.some(s => s.accountNo === '000000003' || (s.externalId === 'TKB-FD-TDU-001' && (s.productName?.toLowerCase().includes('fixed') || s.accountType === 'Fixed Deposit'))) ? (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-emerald-900 text-xs">
                        Đã mở thành công tài khoản TKB Fixed Deposit (000000003)!
                      </div>
                      <div>Tài khoản tiết kiệm có kỳ hạn của khách hàng Minh Quang Tran đã được cập nhật hiển thị trong danh mục Fixed Deposit Accounts với số tiền 1.000.000 VND và kỳ hạn 6 tháng.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                    >
                      Hoàn thành phần thực hành
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-[11px] text-gray-600 bg-sky-50 p-2 border border-sky-100 rounded-[2px]">
                      Nhấp vào menu <strong>(≡)</strong> ở góc trên bên phải khung xanh của khách hàng, sau đó chọn <strong>Applications &gt; New Fixed Deposits Account</strong> (ô viền đỏ).
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigate) navigate('create-fixed-deposit-account');
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Mở biểu mẫu New Fixed Deposits Account
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Step 4-9: inside create-fixed-deposit-account */}
            {currentPath === 'create-fixed-deposit-account' && (() => {
              const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-details-form'));
              const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-terms-form'));
              const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-settings-form'));
              const hasChart = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-chart-form'));
              const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-charges-form'));
              const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-fda-preview-card'));

              if (hasDetails) {
                return (
                  <div className="space-y-1.5">
                    {!fdaFilledSteps.details ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-fda-step1'));
                          setFdaFilledSteps(prev => ({ ...prev, details: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Details
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Details đã được điền. Hãy rà soát lại thông tin trước khi chuyển sang tab Terms.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-fda-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Terms
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasTerms) {
                return (
                  <div className="space-y-1.5">
                    {!fdaFilledSteps.terms ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-fda-step2'));
                          setFdaFilledSteps(prev => ({ ...prev, terms: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Terms (1M VND - 6 Tháng)
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Terms đã được điền: Số tiền gửi 1.000.000 VND, kỳ hạn 6 Tháng. Hãy rà soát trước khi sang tab Settings.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-fda-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Settings
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasSettings) {
                return (
                  <div className="space-y-1.5">
                    {!fdaFilledSteps.settings ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-fda-step3'));
                          setFdaFilledSteps(prev => ({ ...prev, settings: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Settings
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Settings đã được điền. Hãy rà soát các thông số kỳ hạn trước khi chuyển sang tab Biểu lãi suất.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-fda-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Interest Rate Chart
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasChart) {
                return (
                  <div className="space-y-1.5">
                    <div className="p-2 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-tight">
                      Biểu lãi suất áp dụng: Với kỳ hạn 6 Tháng, hệ thống áp dụng bậc lãi suất 4.5% / năm.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-next-fda-step'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang tab Charges
                    </button>
                  </div>
                );
              }

              if (hasCharges) {
                return (
                  <div className="space-y-1.5">
                    <div className="p-2 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-tight">
                      Tab Charges: Không áp dụng phí dịch vụ. Hãy bấm Tiếp tục để chuyển sang tab Preview.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-next-fda-step'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang tab Preview
                    </button>
                  </div>
                );
              }

              if (hasPreview) {
                return (
                  <div className="space-y-1.5">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-emerald-900 text-xs">
                        Rà soát hồ sơ mở tài khoản Fixed Deposit
                      </div>
                      <div>Khách hàng: Minh Quang Tran &bull; Gốc gửi: 1.000.000 VND &bull; Kỳ hạn: 6 Tháng &bull; Lãi suất: 4.5% &bull; Tiền đáo hạn: 1.022.653 VND.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-submit-fda'));
                      }}
                      className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Submit - Mở tài khoản Fixed Deposit
                    </button>
                  </div>
                );
              }

              return null;
            })()}

            {/* Step 11: Approve Fixed Deposit Account View (Image 2) */}
            {currentPath === 'approve-fixed-deposit-account' && (
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed font-sans space-y-1">
                  <div className="font-bold text-sky-950 text-xs">
                    Phê duyệt hồ sơ Fixed Deposit
                  </div>
                  <div>Nhập ngày phê duyệt Approved On Date là 10/13/2026. Nhấn nút "Confirm" bên dưới để hoàn tất phê duyệt hồ sơ.</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('practice-autofill-fda-approve'));
                  }}
                  className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Điền dữ liệu mẫu (10/13/2026)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('practice-confirm-fda-approve'));
                  }}
                  className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Xác nhận Phê duyệt (Confirm)
                </button>
              </div>
            )}

            {/* Step 10, 12, 13: Fixed Deposit Account Details View */}
            {currentPath === 'fixed-deposit-detail' && (() => {
              const fd = savingsAccounts.find(s => 
                s.accountNo === '000000003' || 
                (s.externalId === 'TKB-FD-TDU-001' && (s.productName?.toLowerCase().includes('fixed') || s.accountType === 'Fixed Deposit'))
              );
              const isApproved = fd?.status === 'Approved';
              const isActive = fd?.status === 'Active' || fd?.status === 'Activated';
              const isPending = !isApproved && !isActive;

              if (isPending) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-[2px] text-[11px] text-amber-900 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-amber-950 text-xs">
                        Hồ sơ đang ở trạng thái Pending Approval (ô vuông vàng)
                      </div>
                      <div>Hồ sơ tiền gửi có kỳ hạn 000000003 đã được tạo. Hãy nhấp vào menu <strong>(≡)</strong> ở góc trên bên phải khung xanh và chọn <strong>Approve</strong>.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigate) navigate('approve-fixed-deposit-account');
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Mở biểu mẫu Approve hồ sơ
                    </button>
                  </div>
                );
              }

              if (isApproved) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-[2px] text-[11px] text-indigo-900 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-indigo-950 text-xs">
                        Hồ sơ đã được Approve (badge Approved xanh tím)
                      </div>
                      <div>Tài khoản đã sẵn sàng kích hoạt với số dư khả dụng ban đầu là 0.00 VND. Nhấp vào menu <strong>(≡)</strong> và chọn <strong>Activate</strong> để kích hoạt.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-click-fd-activate'));
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Kích hoạt tài khoản (Activate)
                    </button>
                  </div>
                );
              }

              if (isActive) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-emerald-900 text-xs">
                        Hoàn tất: Tài khoản TKB Fixed Deposit (000000003) đã kích hoạt thành công!
                      </div>
                      <div>Tài khoản đã chuyển sang trạng thái <strong>Active</strong> (ô vuông xanh lá) với số dư Current Balance <strong>1.000.000 VND</strong>, ngày kích hoạt <strong>13 October 2026</strong> và xuất hiện tab <strong>Transactions</strong>.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigate) navigate('client-detail');
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Xem tài khoản trên hồ sơ khách hàng
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                    >
                      Hoàn thành phần thực hành
                    </button>
                  </div>
                );
              }

              return null;
            })()}
          </div>
        )}

        {/* Module 03 - Part 3 Tour Actions: Recurring Deposit Product (TKB Goal Savings - TKGS) */}
        {module === 'saving-part-3' && (
          <div className="space-y-2 mt-2">
            {/* Step 1: admin-products view */}
            {currentPath === 'admin-products' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('admin-recurring-deposit-products');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Mở Recurring Deposit Products
              </button>
            )}

            {/* Step 2: admin-recurring-deposit-products view */}
            {currentPath === 'admin-recurring-deposit-products' && (
              <>
                {recurringDepositProducts.some(p => p.shortName === 'TKGS' || p.name?.toLowerCase().includes('goal savings')) ? (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-emerald-900 text-xs">
                        Đã tạo thành công sản phẩm TKB Goal Savings (TKGS)!
                      </div>
                      <div>Sản phẩm Tiết kiệm gửi góp đã được lưu vào hệ thống core banking với hạn mức 100.000 - 10.000.000 VND và kỳ hạn 12 tháng.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                    >
                      Hoàn thành phần thực hành
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) navigate('admin-create-recurring-deposit-product');
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Tạo sản phẩm Recurring Deposit
                  </button>
                )}
              </>
            )}

            {/* Step 3+: inside admin-create-recurring-deposit-product */}
            {currentPath === 'admin-create-recurring-deposit-product' && (() => {
              const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-details-form'));
              const hasCurrency = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-currency-form'));
              const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-terms-form'));
              const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-settings-form'));
              const hasSlabModal = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-slab-modal'));
              const hasChart = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-chart-form'));
              const hasSlabsTable = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-slabs-table'));
              const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-charges-form'));
              const hasAccounting = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-accounting-form'));
              const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rd-preview-card'));

              if (hasDetails) {
                return (
                  <div className="space-y-1.5">
                    {!rdFilledSteps.details ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-rd-details'));
                          setRdFilledSteps(prev => ({ ...prev, details: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Details
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Details đã được điền. Hãy rà soát lại thông tin trước khi chuyển sang tab tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-rd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Currency
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasCurrency) {
                return (
                  <div className="space-y-1.5">
                    {!rdFilledSteps.currency ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-rd-currency'));
                          setRdFilledSteps(prev => ({ ...prev, currency: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Currency
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Currency đã được điền. Hãy rà soát lại thông tin trước khi chuyển sang tab tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-rd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Terms
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasTerms) {
                return (
                  <div className="space-y-1.5">
                    {!rdFilledSteps.terms ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-rd-terms'));
                          setRdFilledSteps(prev => ({ ...prev, terms: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Terms
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Terms đã được điền. Hãy rà soát lại thông tin trước khi chuyển sang tab tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-rd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Settings
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasSettings) {
                return (
                  <div className="space-y-1.5">
                    {!rdFilledSteps.settings ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-rd-settings'));
                          setRdFilledSteps(prev => ({ ...prev, settings: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Settings
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Settings đã được điền. Hãy rà soát lại thông tin trước khi chuyển sang tab tiếp theo.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-rd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Interest Rate Chart
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasSlabModal) {
                return (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-autofill-rd-slab-form'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Điền dữ liệu mẫu Slab (1 - 12 Months)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-confirm-add-rd-slab'));
                        setRdFilledSteps(prev => ({ ...prev, chart: true }));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Xác nhận thêm Slab (Add)
                    </button>
                  </div>
                );
              }

              if (hasChart) {
                if (hasSlabsTable) {
                  return (
                    <div className="space-y-1.5">
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                        Đã cấu hình Biểu lãi suất 2026 và bậc lãi suất 1 - 12 Months (4.0% p.a.).
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-next-rd-step'));
                        }}
                        className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Tiếp tục sang tab Charges &rarr;
                      </button>
                    </div>
                  );
                }

                if (rdFilledSteps.chartInfo) {
                  return (
                    <div className="space-y-1.5">
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded-[2px] text-[11px] text-blue-800 leading-tight">
                        Thông tin biểu lãi suất đã được điền. Hãy nhấp vào nút "+ Add Slab" trên bảng để thêm bậc kỳ hạn theo Hình 1.
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-open-rd-slab-modal'));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Mở modal + Add Slab
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-autofill-rd-chart-info'));
                        setRdFilledSteps(prev => ({ ...prev, chartInfo: true }));
                      }}
                      className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Điền thông tin Biểu lãi suất
                    </button>
                  </div>
                );
              }

              if (hasCharges) {
                return (
                  <div className="space-y-1.5">
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-[2px] text-[11px] text-blue-800 leading-tight">
                      Sản phẩm miễn phí dịch vụ. Nhấn tiếp tục để sang tab Accounting.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-next-rd-step'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Bỏ qua phí và sang Accounting &rarr;
                    </button>
                  </div>
                );
              }

              if (hasAccounting) {
                return (
                  <div className="space-y-1.5">
                    {!rdFilledSteps.accounting ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-rd-accounting'));
                          setRdFilledSteps(prev => ({ ...prev, accounting: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Accounting (Cash Based)
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu Accounting đã được điền đầy đủ các tài khoản GL.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-next-rd-step'));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Preview &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasPreview) {
                return (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-submit-rd'));
                      }}
                      className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Submit - Lưu sản phẩm Goal Savings
                    </button>
                  </div>
                );
              }

              return null;
            })()}

            {/* Quick autofill all */}
            {currentPath === 'admin-create-recurring-deposit-product' && (
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('practice-autofill-rd-all'));
                    setRdFilledSteps({
                      details: true,
                      currency: true,
                      terms: true,
                      settings: true,
                      chart: true,
                      charges: true,
                      accounting: true
                    });
                  }}
                  className="text-[10px] text-gray-500 hover:text-[#1072ba] underline cursor-pointer"
                >
                  Điền nhanh toàn bộ và đến Preview
                </button>
              </div>
            )}
          </div>
        )}

        {/* Module 03 - Part 4 Tour Actions: Recurring Deposit Account (Lan Ngoc Pham) */}
        {module === 'saving-part-4' && (
          <div className="space-y-2 mt-2">
            {/* Step 1: Navigating to Clients */}
            {currentPath !== 'clients' && currentPath !== 'client-detail' && currentPath !== 'create-recurring-deposit-account' && currentPath !== 'approve-recurring-deposit-account' && currentPath !== 'recurring-deposit-detail' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('clients');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Mở danh sách khách hàng (Clients)
              </button>
            )}

            {/* Step 2: Clients list -> select Lan Ngoc Pham */}
            {currentPath === 'clients' && (
              <button
                type="button"
                onClick={() => {
                  let target = clients.find(c => c.id === '12' || c.accountNo === '000000012' || c.displayName?.includes('Lan Ngoc Pham'));
                  if (!target) {
                    target = {
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
                  if (onSelectClient) onSelectClient(target);
                  if (navigate) navigate('client-detail');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Chọn hồ sơ Lan Ngoc Pham
              </button>
            )}

            {/* Step 3: client-detail view */}
            {currentPath === 'client-detail' && (() => {
              const rd = savingsAccounts.find(s => 
                s.accountNo === '000000004' || 
                (s.externalId === 'TKB-RD-TDU-002' && (s.depositType === 'Recurring Deposit' || s.accountType === 'Recurring Deposit' || s.productName?.toLowerCase().includes('goal')))
              );
              const isActive = rd?.status === 'Active' || rd?.status === 'Activated';

              if (isActive) {
                const hasDeposited = Boolean(rd?.hasDeposited || (rd?.balance && Number(rd.balance) > 0));
                if (hasDeposited) {
                  return (
                    <div className="space-y-2 pt-1 border-t border-gray-100">
                      <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed font-sans space-y-1">
                        <div className="font-bold text-sky-950 text-xs">
                          Tài khoản 000000004 đã ghi nhận số dư 500,000.00 VND!
                        </div>
                        <div>Mục Recurring Deposit Accounts trên hồ sơ Lan Ngoc Pham đã cập nhật thành công. Tiếp theo, hãy vào <strong>Journal Entries</strong> để kiểm tra lịch sử ghi nhận sổ cái của hệ thống.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigate) navigate('accounting-journal');
                        }}
                        className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                      >
                        Đến Journal Entries kiểm tra lịch sử ghi nhận &rarr;
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-sky-950 text-xs">
                        Tài khoản đã Active - Cần thực hiện nộp tiền (Deposit)
                      </div>
                      <div>Tài khoản Recurring Deposit 000000004 đã được kích hoạt. Nhấp vào tài khoản trong bảng hoặc nút bên dưới để mở chi tiết tài khoản và nộp tiền vào quỹ.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigate) navigate('recurring-deposit-detail');
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Mở chi tiết tài khoản 000000004 &rarr;
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed font-sans space-y-1">
                    <div className="font-bold text-sky-950 text-xs">
                      Mở tài khoản Recurring Deposit cho Lan Ngoc Pham
                    </div>
                    <div>Nhấp vào menu Actions (≡), di chuột qua Applications và chọn mục New Recurring Deposit Account (có viền đỏ nổi bật theo tài liệu).</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) navigate('create-recurring-deposit-account');
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Mở form New Recurring Deposit Account
                  </button>
                </div>
              );
            })()}

            {/* Steps 4-9: create-recurring-deposit-account view */}
            {currentPath === 'create-recurring-deposit-account' && (() => {
              const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-details-form'));
              const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-terms-form'));
              const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-settings-form'));
              const hasChart = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-chart-form'));
              const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-charges-form'));
              const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-rda-preview-card'));

              if (hasDetails) {
                return (
                  <div className="space-y-1.5">
                    {!rdaFilledSteps.details ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-rda-details'));
                          setRdaFilledSteps(prev => ({ ...prev, details: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Details
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-next-rda-step'));
                        }}
                        className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Tiếp tục sang tab Terms &rarr;
                      </button>
                    )}
                  </div>
                );
              }

              if (hasTerms) {
                return (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-next-rda-step'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang tab Settings &rarr;
                    </button>
                  </div>
                );
              }

              if (hasSettings) {
                return (
                  <div className="space-y-1.5">
                    {!rdaFilledSteps.settings ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-autofill-rda-settings'));
                          setRdaFilledSteps(prev => ({ ...prev, settings: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Settings (500k VND - 12 Tháng)
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-next-rda-step'));
                        }}
                        className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Tiếp tục sang tab Interest Rate Chart &rarr;
                      </button>
                    )}
                  </div>
                );
              }

              if (hasChart) {
                return (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-next-rda-step'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang tab Charges &rarr;
                    </button>
                  </div>
                );
              }

              if (hasCharges) {
                return (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-next-rda-step'));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang tab Preview &rarr;
                    </button>
                  </div>
                );
              }

              if (hasPreview) {
                return (
                  <div className="space-y-1.5">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-emerald-900 text-xs">
                        Rà soát hồ sơ mở tài khoản Recurring Deposit
                      </div>
                      <div>Khách hàng: Lan Ngoc Pham &bull; Gửi góp: 500.000 VND/tháng &bull; Kỳ hạn: 12 Tháng &bull; Lãi suất: 4.00% &bull; Tiền đáo hạn: 6.131.646 VND.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const submitBtn = document.getElementById('tour-rda-submit-btn');
                        if (submitBtn) {
                          submitBtn.click();
                        } else {
                          window.dispatchEvent(new CustomEvent('practice-submit-rda'));
                        }
                      }}
                      className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Submit - Mở tài khoản Recurring Deposit
                    </button>
                  </div>
                );
              }

              return null;
            })()}

            {/* Step 11: Approve Recurring Deposit Account View */}
            {currentPath === 'approve-recurring-deposit-account' && (
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed font-sans space-y-1">
                  <div className="font-bold text-sky-950 text-xs">
                    Phê duyệt hồ sơ Recurring Deposit
                  </div>
                  <div>Nhập ngày phê duyệt Approved On Date là 10/13/2026 theo Hình 2. Nhấn nút "Confirm" bên dưới để hoàn tất phê duyệt hồ sơ.</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('practice-autofill-rda-approve'));
                  }}
                  className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Điền dữ liệu mẫu (10/13/2026)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const confirmBtn = document.getElementById('tour-rd-approve-submit-btn');
                    if (confirmBtn) {
                      confirmBtn.click();
                    } else {
                      window.dispatchEvent(new CustomEvent('practice-confirm-rda-approve'));
                    }
                  }}
                  className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Xác nhận Phê duyệt (Confirm)
                </button>
              </div>
            )}

            {/* Step 14: Deposit Recurring Deposit Account View */}
            {currentPath === 'deposit-recurring-deposit-account' && (
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed font-sans space-y-1">
                  <div className="font-bold text-sky-950 text-xs">
                    Nộp tiền vào quỹ tiết kiệm gửi góp (Deposit)
                  </div>
                  <div>Nhập ngày <strong>10/13/2026</strong>, số tiền <strong>500,000.00 VND</strong>, phương thức <strong>Money Transfer</strong> theo Hình 2. Bấm nút "Submit" bên dưới để hoàn tất giao dịch.</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('practice-autofill-rd-deposit'));
                  }}
                  className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Điền dữ liệu mẫu (500k VND - 10/13/2026)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const submitBtn = document.getElementById('tour-rd-deposit-submit-btn');
                    if (submitBtn) {
                      submitBtn.click();
                    } else {
                      window.dispatchEvent(new CustomEvent('practice-submit-rd-deposit'));
                    }
                  }}
                  className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Submit - Hoàn tất nộp tiền
                </button>
              </div>
            )}

            {/* Steps 10, 12, 13, 15: Recurring Deposit Detail View */}
            {currentPath === 'recurring-deposit-detail' && (() => {
              const rd = savingsAccounts.find(s => 
                s.accountNo === '000000004' || 
                (s.externalId === 'TKB-RD-TDU-002' && (s.depositType === 'Recurring Deposit' || s.accountType === 'Recurring Deposit' || s.productName?.toLowerCase().includes('goal')))
              );
              const isApproved = rd?.status === 'Approved';
              const isActive = rd?.status === 'Active' || rd?.status === 'Activated';
              const isPending = !isApproved && !isActive;

              if (isPending) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-[2px] text-[11px] text-amber-900 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-amber-950 text-xs">
                        Hồ sơ đang ở trạng thái Pending Approval (ô vuông cam)
                      </div>
                      <div>Hồ sơ tiền gửi gửi góp 000000004 đã được tạo. Hãy nhấp vào menu <strong>(≡)</strong> ở góc trên bên phải khung xanh và chọn <strong>Approve</strong> (có dấu tích) theo Hình 1.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigate) navigate('approve-recurring-deposit-account');
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Mở biểu mẫu Approve hồ sơ
                    </button>
                  </div>
                );
              }

              if (isApproved) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-[2px] text-[11px] text-indigo-900 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-indigo-950 text-xs">
                        Hồ sơ đã được Approve (ô vuông màu tím)
                      </div>
                      <div>Tài khoản đã sẵn sàng kích hoạt theo Hình 3. Nhấp vào menu <strong>(≡)</strong> và chọn <strong>Activate</strong> để kích hoạt.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-click-rd-activate'));
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Kích hoạt tài khoản (Activate)
                    </button>
                  </div>
                );
              }

              if (isActive) {
                const hasDeposited = Boolean(rd?.hasDeposited || (rd?.balance && Number(rd.balance) > 0));
                if (hasDeposited) {
                  return (
                    <div className="space-y-2 pt-1 border-t border-gray-100">
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed font-sans space-y-1">
                        <div className="font-bold text-emerald-900 text-xs">
                          Đã nộp tiền thành công vào sổ tiết kiệm!
                        </div>
                        <div>Số dư Current Balance: <strong>₫500,000.00</strong> (viền đỏ theo Hình 3) và Deposits till Date: <strong>₫500,000.00</strong>, Interest Earned: <strong>₫55.00</strong>. Bấm nút bên dưới để đối chiếu trên hồ sơ khách hàng.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigate) navigate('client-detail');
                        }}
                        className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Xem tài khoản trên hồ sơ khách hàng &rarr;
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigate) navigate('accounting-journal');
                        }}
                        className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Đến Journal Entries kiểm tra lịch sử ghi nhận &rarr;
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed font-sans space-y-1">
                      <div className="font-bold text-sky-950 text-xs">
                        Tài khoản đã Active (ô vuông xanh lá) - Tiến hành nộp tiền (Deposit)
                      </div>
                      <div>Tài khoản 000000004 đang có số dư ₫0.00. Hãy mở menu <strong>(≡)</strong> ở góc trên bên phải khung banner xanh và chọn mục <strong>Deposit</strong> (có viền đỏ) theo đúng Hình 1.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-open-rd-menu'));
                      }}
                      className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Mở menu thao tác (≡)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigate) navigate('deposit-recurring-deposit-account');
                      }}
                      className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Mở form Nộp tiền (Deposit)
                    </button>
                  </div>
                );
              }

              return null;
            })()}

            {/* Step 17: Accounting Navigation View (if accessed) */}
            {currentPath === 'accounting' && (
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed font-sans space-y-1">
                  <div className="font-bold text-sky-950 text-xs">
                    Mở Search journal entries
                  </div>
                  <div>Nhấp vào ô Search journal entries (hoặc nút bên dưới) để kiểm tra các bút toán kế toán tự động phát sinh từ giao dịch tiết kiệm gửi góp.</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (navigate) navigate('accounting-journal');
                  }}
                  className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Mở Search journal entries &rarr;
                </button>
              </div>
            )}

            {/* Step 17: Journal Entries View - Final conclusion */}
            {(currentPath === 'accounting-journal' || currentPath === 'accounting-journal-entries') && (
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed font-sans space-y-1">
                  <div className="font-bold text-emerald-900 text-xs">
                    Kiểm tra thành công lịch sử hạch toán tự động!
                  </div>
                  <div>Hệ thống đã tự động định khoản giao dịch nộp tiền vào sổ tiết kiệm gửi góp 000000004 (TKB Goal Savings):</div>
                  <div className="pl-2 pt-1 font-mono text-[10px] space-y-0.5 text-emerald-950">
                    <div>&bull; Nợ TK 110201 (Settlement Bank Account): ₫500,000.00</div>
                    <div>&bull; Có TK 210104 (Recurring Deposits): ₫500,000.00</div>
                  </div>
                  <div className="pt-1 text-[11px]">Toàn bộ quy trình Phân hệ 03 đã hoàn tất trọn vẹn. Bấm nút bên dưới để kết thúc bài học!</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Hoàn thành phần thực hành (Phân hệ 03)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Module 04: Loans - Part 1 (Tạo Sản Phẩm Cho Vay TKB Personal Loan) */}
        {module === 'loan-part-1' && (
          <div className="space-y-2 mt-2">
            {/* Step 1 & 2: Navigation to Products */}
            {currentPath !== 'admin-products' && currentPath !== 'admin-loan-products' && currentPath !== 'admin-create-loan-product' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('admin-products');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Mở trang Products &rarr;
              </button>
            )}

            {/* Step 3: In admin-products */}
            {currentPath === 'admin-products' && (
              <button
                type="button"
                onClick={() => {
                  if (navigate) navigate('admin-loan-products');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Mở danh mục Loan Products &rarr;
              </button>
            )}

            {/* Step 4 & 13: In admin-loan-products */}
            {currentPath === 'admin-loan-products' && (
              <div>
                {loanProducts.some(p => p.shortName === 'Loan' || p.externalId === 'TKB-PRD-PL-001' || p.name === 'TKB Personal Loan') ? (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                      Gói vay tín dụng <strong>TKB Personal Loan (Loan)</strong> đã được khởi tạo và hiển thị thành công trên hệ thống Core Banking!
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                    >
                      Hoàn thành phần thực hành (Phân hệ 04 - Phần 1)
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) navigate('admin-create-loan-product');
                    }}
                    className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                  >
                    Bắt đầu tạo gói vay &rarr;
                  </button>
                )}
              </div>
            )}

            {/* Step 5 to 12: In admin-create-loan-product */}
            {currentPath === 'admin-create-loan-product' && (() => {
              const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-details-form'));
              const hasCurrency = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-currency-form'));
              const hasSettings = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-settings-form'));
              const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-terms-form'));
              const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-charges-form'));
              const hasAccounting = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-accounting-form'));
              const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-preview-card'));

              if (hasDetails) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    {!loanFilledSteps.details ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-loan-details'));
                          setLoanFilledSteps(prev => ({ ...prev, details: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Details
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu tab DETAILS đã được điền đầy đủ.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-set-loan-step', { detail: { step: 2 } }));
                          }}
                          className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 text-xs font-semibold rounded-[2px] cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Currency &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasCurrency) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    {!loanFilledSteps.currency ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-loan-currency'));
                          setLoanFilledSteps(prev => ({ ...prev, currency: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Currency
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu tab CURRENCY đã được điền đầy đủ.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-set-loan-step', { detail: { step: 3 } }));
                          }}
                          className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 text-xs font-semibold rounded-[2px] cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Settings &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasSettings) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    {loanSettingsSubStep === 'part1' && !loanFilledSteps.settingsPart1 ? (
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-fill-loan-settings-part1'));
                            setLoanFilledSteps(prev => ({ ...prev, settingsPart1: true }));
                            setLoanSettingsSubStep('part2');
                          }}
                          className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Điền dữ liệu mẫu Settings (Phần 1: Tính lãi)
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoanSettingsSubStep('part2')}
                          className="w-full py-1 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-[11px] rounded-[2px] cursor-pointer transition-colors"
                        >
                          Chuyển xuống Phần 2 (NPA &amp; Cho phép ghi đè) &rarr;
                        </button>
                      </div>
                    ) : !loanFilledSteps.settingsPart2 ? (
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-fill-loan-settings-part2'));
                            setLoanFilledSteps(prev => ({ ...prev, settingsPart2: true }));
                          }}
                          className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Điền dữ liệu mẫu Settings (Phần 2: NPA &amp; Ghi đè)
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoanSettingsSubStep('part1')}
                          className="w-full py-1 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-[11px] rounded-[2px] cursor-pointer transition-colors"
                        >
                          &larr; Xem lại Phần 1 (Tính lãi)
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Đã cấu hình xong toàn bộ tab SETTINGS.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-set-loan-step', { detail: { step: 4 } }));
                          }}
                          className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 text-xs font-semibold rounded-[2px] cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Terms &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasTerms) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    {!loanFilledSteps.terms ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-loan-terms'));
                          setLoanFilledSteps(prev => ({ ...prev, terms: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Terms (Hạn mức &amp; Lãi suất)
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                          Dữ liệu tab TERMS đã được điền đầy đủ.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-set-loan-step', { detail: { step: 5 } }));
                          }}
                          className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 text-xs font-semibold rounded-[2px] cursor-pointer transition-colors"
                        >
                          Tiếp tục sang tab Charges &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              if (hasCharges) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-set-loan-step', { detail: { step: 6 } }));
                      }}
                      className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang tab Accounting &rarr;
                    </button>
                  </div>
                );
              }

              if (hasAccounting) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-fill-loan-accounting'));
                        setLoanFilledSteps(prev => ({ ...prev, accounting: true }));
                        window.dispatchEvent(new CustomEvent('practice-set-loan-step', { detail: { step: 7 } }));
                      }}
                      className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Điền mẫu Accounting (Cash) &amp; Sang Preview &rarr;
                    </button>
                  </div>
                );
              }

              if (hasPreview) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        const submitBtn = document.getElementById('tour-loan-preview-submit-btn');
                        if (submitBtn) submitBtn.click();
                      }}
                      className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                    >
                      Submit tạo gói vay (TKB Personal Loan - TKPL)
                    </button>
                  </div>
                );
              }

              return null;
            })()}

            {/* Quick Auto-fill All Tabs button for convenience */}
            {currentPath === 'admin-create-loan-product' && (
              <div className="pt-2 text-center border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('practice-fill-loan-all'));
                    setLoanFilledSteps({
                      details: true,
                      currency: true,
                      settingsPart1: true,
                      settingsPart2: true,
                      terms: true,
                      charges: true,
                      accounting: true
                    });
                    setLoanSettingsSubStep('part2');
                  }}
                  className="text-[10px] text-gray-500 hover:text-[#1072ba] underline cursor-pointer"
                >
                  Điền nhanh toàn bộ các tab biểu mẫu gói vay
                </button>
              </div>
            )}
          </div>
        )}

        {/* Module 04: Loans - Part 2 (Tiếp Nhận Hồ Sơ Vay Vốn, F12 Workaround, Phê Duyệt & Giải Ngân) */}
        {module === 'loan-part-2' && (
          <div className="space-y-2 mt-2">
            {/* Step navigation if outside the workflow */}
            {currentPath !== 'client-detail' && currentPath !== 'create-loan-account' && currentPath !== 'loan-detail' && currentPath !== 'approve-loan' && currentPath !== 'disburse-loan' && (
              <button
                type="button"
                onClick={() => {
                  const client11 = clients.find(c => String(c.id) === '11' || c.externalId === 'TKB-CIF-TDU-001') || clients[0];
                  if (onSelectClient) onSelectClient(client11);
                  if (navigate) navigate('client-detail');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Chuyển đến hồ sơ khách hàng Minh Quang Tran &rarr;
              </button>
            )}

            {/* In client-detail */}
            {currentPath === 'client-detail' && (
              <div>
                {(loans || []).some(l => l.externalId === 'TKB-PL-TDU-001' || l.accountNo === '000000001') ? (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-[2px] text-[11px] text-amber-800 leading-tight">
                      Hồ sơ vay vốn <strong>000000001 (TKB-PL-TDU-001)</strong> đã được tạo thành công ở trạng thái Chờ duyệt (Pending Approval)!
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const target = (loans || []).find(l => l.externalId === 'TKB-PL-TDU-001' || l.accountNo === '000000001') || loans[0];
                        if (onSelectLoan) onSelectLoan(target);
                        if (navigate) navigate('loan-detail');
                      }}
                      className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                    >
                      Mở chi tiết hồ sơ vay 000000001 &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {!(typeof document !== 'undefined' && Boolean(document.getElementById('tour-client-new-loan-account-btn'))) ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-open-client-actions-menu'));
                        }}
                        className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                      >
                        Mở Menu tác vụ khách hàng &rarr;
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (navigate) navigate('create-loan-account');
                        }}
                        className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                      >
                        Mở biểu mẫu New Loan Account &rarr;
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* In create-loan-account */}
            {currentPath === 'create-loan-account' && (() => {
              const hasDetails = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-details-form'));
              const hasTerms = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-terms-form'));
              const hasCharges = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-charges-form'));
              const hasSchedule = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-schedule-card'));
              const hasPreview = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-preview-card'));
              const isConsoleModalInDOM = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-acc-console-modal'));
              const isFixInstalled = loanAccFilledSteps.tkbFix || (typeof window !== 'undefined' && Boolean(window.__tkbLoanFixInstalled));
              const isGenerated = loanAccFilledSteps.scheduleGenerated;

              if (hasDetails) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    {!loanAccFilledSteps.details ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-loan-acc-details'));
                          setLoanAccFilledSteps(prev => ({ ...prev, details: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Details &rarr;
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-set-loan-acc-step', { detail: { step: 2 } }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Tiếp tục sang tab TERMS &rarr;
                      </button>
                    )}
                  </div>
                );
              }

              if (hasTerms) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    {!loanAccFilledSteps.terms ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-fill-loan-acc-terms'));
                          setLoanAccFilledSteps(prev => ({ ...prev, terms: true }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Điền dữ liệu mẫu Terms &rarr;
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-set-loan-acc-step', { detail: { step: 3 } }));
                        }}
                        className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                      >
                        Tiếp tục sang tab CHARGES &rarr;
                      </button>
                    )}
                  </div>
                );
              }

              if (hasCharges) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-set-loan-acc-step', { detail: { step: 4 } }));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang tab REPAYMENT SCHEDULE &rarr;
                    </button>
                  </div>
                );
              }

              if (hasSchedule) {
                if (isConsoleModalInDOM) {
                  return (
                    <div className="space-y-2 pt-1 border-t border-gray-100">
                      {!isFixInstalled ? (
                        <button
                          type="button"
                          onClick={() => {
                            const runBtn = document.getElementById('tour-loan-acc-console-run-btn');
                            if (runBtn) {
                              runBtn.click();
                            } else {
                              window.dispatchEvent(new CustomEvent('practice-apply-tkb-fix'));
                            }
                            setLoanAccFilledSteps(prev => ({ ...prev, tkbFix: true }));
                          }}
                          className="w-full py-1.5 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Chạy lệnh F12 Workaround (Run Script) &rarr;
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const closeBtn = document.getElementById('tour-loan-acc-console-close-btn');
                            if (closeBtn) closeBtn.click();
                          }}
                          className="w-full py-1.5 px-3 bg-gray-700 hover:bg-gray-800 text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Đóng cửa sổ F12 Console &rarr;
                        </button>
                      )}
                    </div>
                  );
                }

                if (!isGenerated) {
                  return (
                    <div className="space-y-2 pt-1 border-t border-gray-100">
                      {!isFixInstalled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('practice-apply-tkb-fix'));
                              setLoanAccFilledSteps(prev => ({ ...prev, tkbFix: true }));
                            }}
                            className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                          >
                            Chạy script F12 Workaround (TKB FIX) &rarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const openBtn = document.getElementById('tour-loan-acc-open-console-btn');
                              if (openBtn) openBtn.click();
                            }}
                            className="w-full py-1.5 px-3 bg-gray-800 hover:bg-gray-900 text-gray-200 text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                          >
                            Mở Chrome DevTools Console (F12) &rarr;
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('practice-generate-loan-schedule'));
                            setLoanAccFilledSteps(prev => ({ ...prev, scheduleGenerated: true, tkbFix: true }));
                          }}
                          className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                        >
                          Sinh bảng lịch trả nợ (Generate Schedule) &rarr;
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('practice-set-loan-acc-step', { detail: { step: 5 } }));
                      }}
                      className="w-full py-1.5 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                    >
                      Tiếp tục sang tab PREVIEW &rarr;
                    </button>
                  </div>
                );
              }

              if (hasPreview) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        const submitBtn = document.getElementById('tour-loan-acc-submit-btn');
                        if (submitBtn) submitBtn.click();
                      }}
                      className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                    >
                      Nộp hồ sơ vay vốn (Submit)
                    </button>
                  </div>
                );
              }

              return null;
            })()}

            {/* Quick Auto-fill All Tabs button for convenience */}
            {currentPath === 'create-loan-account' && (
              <div className="pt-2 text-center border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('practice-fill-loan-acc-all'));
                    setLoanAccFilledSteps({
                      details: true,
                      terms: true,
                      charges: true,
                      tkbFix: true,
                      scheduleGenerated: true
                    });
                  }}
                  className="text-[10px] text-gray-500 hover:text-[#1072ba] underline cursor-pointer"
                >
                  Điền nhanh toàn bộ &amp; sinh lịch trả nợ 12 kỳ
                </button>
              </div>
            )}

            {/* In loan-detail */}
            {currentPath === 'loan-detail' && (() => {
              const targetLoan = (loans || []).find(
                l => l.externalId === 'TKB-PL-TDU-001' || l.accountNo === '000000001'
              ) || selectedLoan;
              const targetLoanStatus = typeof targetLoan?.status === 'string' ? targetLoan.status : (targetLoan?.status?.value || '');
              const isLoanPending = Boolean(targetLoan) && (
                targetLoanStatus.toLowerCase().includes('pending') || targetLoanStatus.toLowerCase().includes('submitted')
              );
              const isLoanApproved = Boolean(targetLoan) && (
                targetLoanStatus.toLowerCase().includes('approved') && !isLoanPending
              );
              const isLoanActive = Boolean(targetLoan) && (
                targetLoanStatus.toLowerCase().includes('active')
              );

              if (isLoanPending) {
                const hasApproveOption = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-action-approve-btn'));
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    {!hasApproveOption ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-open-loan-actions-menu'));
                        }}
                        className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                      >
                        Mở Menu tác vụ hồ sơ vay &rarr;
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (navigate) navigate('approve-loan');
                        }}
                        className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                      >
                        Phê duyệt hồ sơ vay (Approve) &rarr;
                      </button>
                    )}
                  </div>
                );
              }

              if (isLoanApproved) {
                const hasDisburseOption = typeof document !== 'undefined' && Boolean(document.getElementById('tour-loan-action-disburse-btn'));
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    {!hasDisburseOption ? (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('practice-open-loan-actions-menu'));
                        }}
                        className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                      >
                        Mở Menu tác vụ hồ sơ vay &rarr;
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (navigate) navigate('disburse-loan');
                        }}
                        className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                      >
                        Giải ngân khoản vay (Disburse) &rarr;
                      </button>
                    )}
                  </div>
                );
              }

              if (isLoanActive) {
                return (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-tight">
                      Khoản vay <strong>000000001 (TKB-PL-TDU-001)</strong> đã giải ngân thành công và chuyển sang trạng thái Active!
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                    >
                      Hoàn thành phần thực hành (Phân hệ 04 - Phần 2)
                    </button>
                  </div>
                );
              }

              return null;
            })()}

            {/* In approve-loan */}
            {currentPath === 'approve-loan' && (
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    const submitBtn = document.getElementById('tour-loan-approve-submit-btn');
                    if (submitBtn) submitBtn.click();
                  }}
                  className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Xác nhận phê duyệt hồ sơ vay (Submit) &rarr;
                </button>
              </div>
            )}

            {/* In disburse-loan */}
            {currentPath === 'disburse-loan' && (
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    const submitBtn = document.getElementById('tour-loan-disburse-submit-btn');
                    if (submitBtn) submitBtn.click();
                  }}
                  className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Xác nhận giải ngân khoản vay (Submit) &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* Module 05: Treasury (Phân tích dòng tiền & Vay vốn liên ngân hàng 20M VND) */}
        {module === 'treasury-part-1' && (
          <div className="space-y-3 mt-2 text-xs">
            {/* Step 1: Nav Accounting */}
            {currentPath !== 'accounting' && currentPath !== 'accounting-journal' && currentPath !== 'accounting-journal-entries' && currentPath !== 'accounting-create-journal' && currentPath !== 'accounting-view-transaction' && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (navigate) navigate('accounting');
                  }}
                  className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Đến trang Kế toán (Accounting) &rarr;
                </button>
              </div>
            )}

            {/* Step 2: In Accounting view */}
            {currentPath === 'accounting' && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (navigate) navigate('accounting-journal');
                  }}
                  className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Mở Search Journal Entries &rarr;
                </button>
              </div>
            )}

            {/* Step 3: In Journal Entries (accounting-journal) -> Show Cashflow & Liquidity Analysis or Completion */}
            {(currentPath === 'accounting-journal' || currentPath === 'accounting-journal-entries') && (
              (typeof window !== 'undefined' && (localStorage.getItem('tkb_treasury_interbank_done') === 'true' || Boolean(window.__tkbTreasuryInterbankDone))) ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[2px] text-xs text-emerald-900 space-y-2">
                    <div className="font-bold text-emerald-800 flex items-center justify-between">
                      <span>Bút toán Vay liên ngân hàng (Entry 78 &amp; 79)</span>
                      <span className="font-mono text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">Đã vào sổ</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-snug">
                      Đã ghi nhận <strong>Nợ TK 110201 Settlement Bank Account</strong> (+20.000.000 VND) và <strong>Có TK 220401 Interbank Borrowings</strong> (+20.000.000 VND) qua mã giao dịch <strong>a2fbdc3d0f2f</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) {
                        navigate('accounting-view-transaction', {
                          transaction: {
                            id: 'a2fbdc3d0f2f',
                            officeName: 'Takashimaya Bank (TKB) - HO',
                            transactionDate: '14 October 2026',
                            createdBy: 'mifos',
                            submittedOn: '15 October 2026 00:00:00',
                            entries: [
                              { id: '78', type: 'ASSET', accountCode: '110201', accountName: 'Settlement Bank Account', debit: 'VND 20,000,000.00', credit: '' },
                              { id: '79', type: 'LIABILITY', accountCode: '220401', accountName: 'Interbank Borrowings', debit: '', credit: 'VND 20,000,000.00' }
                            ]
                          }
                        });
                      }
                    }}
                    className="w-full py-2 px-3 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                  >
                    Xem chi tiết giao dịch a2fbdc3d0f2f (Hình 2)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('tkb_treasury_interbank_done', 'true');
                      }
                      if (onClose) onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                  >
                    Hoàn thành phần thực hành (Phân hệ 05: Treasury)
                  </button>
                </div>
              ) : (
              <div className="space-y-3">
                <div className="p-3 bg-white border border-gray-200 rounded-[2px] shadow-xs space-y-2.5">
                  <div className="font-bold text-gray-900 border-b border-gray-100 pb-1.5 flex items-center justify-between text-xs">
                    <span className="text-[#1072ba] uppercase tracking-wide">Báo Cáo Phân Tích Dòng Tiền &amp; Thanh Khoản TKB</span>
                    <span className="text-[10px] font-mono font-medium text-gray-500">Tháng 10/2026</span>
                  </div>

                  {/* Cash Inflows summary */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center justify-between">
                      <span>1. Dòng tiền vào (Inflows)</span>
                      <span className="font-mono text-emerald-700">+1,007,388,487.89</span>
                    </div>
                    <div className="text-[11px] text-gray-600 pl-2 space-y-0.5 border-l-2 border-emerald-300">
                      <div className="flex justify-between"><span>&bull; Vốn điều lệ ban đầu:</span><span className="font-mono text-gray-800">+1,000,000,000</span></div>
                      <div className="flex justify-between"><span>&bull; Nộp tiền gửi CASA (Minh Tran):</span><span className="font-mono text-gray-800">+5,000,000</span></div>
                      <div className="flex justify-between"><span>&bull; Tiết kiệm có kỳ hạn FD:</span><span className="font-mono text-gray-800">+1,000,000</span></div>
                      <div className="flex justify-between"><span>&bull; Tiết kiệm gửi góp RD (Lan Pham):</span><span className="font-mono text-gray-800">+500,000</span></div>
                      <div className="flex justify-between"><span>&bull; Thu hồi nợ vay cá nhân kỳ 1:</span><span className="font-mono text-gray-800">+888,487.89</span></div>
                    </div>
                  </div>

                  {/* Cash Outflows summary */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wide flex items-center justify-between">
                      <span>2. Dòng tiền ra (Outflows)</span>
                      <span className="font-mono text-rose-700">-19,000,000.00</span>
                    </div>
                    <div className="text-[11px] text-gray-600 pl-2 space-y-0.5 border-l-2 border-rose-300">
                      <div className="flex justify-between"><span>&bull; Chi phí hoạt động OPEX (2M + 5M):</span><span className="font-mono text-gray-800">-7,000,000</span></div>
                      <div className="flex justify-between"><span>&bull; Rút tiền mặt CASA (Minh Tran):</span><span className="font-mono text-gray-800">-2,000,000</span></div>
                      <div className="flex justify-between"><span>&bull; Giải ngân khoản vay cá nhân:</span><span className="font-mono text-gray-800">-10,000,000</span></div>
                    </div>
                  </div>

                  {/* Net Deficit & Treasury Conclusion */}
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-[2px] text-[11px] text-amber-900 leading-snug space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>Biến động thuần hoạt động:</span>
                      <span className="font-mono text-rose-700">-12,611,512.11 VND</span>
                    </div>
                    <p className="text-[10px] text-amber-800">
                      <strong>Rút ra phân tích:</strong> Dòng tiền hoạt động kinh doanh phát sinh biến động âm lớn, tạo áp lực thiếu hụt thanh khoản nghiêm trọng tại <strong>TK 110201 Settlement Bank Account</strong>. Khối Treasury quyết định thực hiện nghiệp vụ <strong>Vay vốn trên thị trường Liên ngân hàng (Interbank Borrowing) 20.000.000 VND</strong>.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (navigate) navigate('accounting-create-journal');
                  }}
                  className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Lập Bút Toán Vay Vốn Liên Ngân Hàng 20M VND (Hình 1) &rarr;
                </button>
              </div>
              )
            )}

            {/* Step 5: In Create Journal Entry (accounting-create-journal) -> Autofill helper matching Hình 1 */}
            {currentPath === 'accounting-create-journal' && (
              <div className="space-y-3">
                <div className="p-3 bg-white border border-gray-200 rounded-[2px] shadow-xs space-y-2 text-xs">
                  <div className="font-bold text-gray-900 border-b border-gray-100 pb-1 text-[#1072ba]">
                    Thông Số Nghiệp Vụ Vay Liên Ngân Hàng (Hình 1)
                  </div>
                  <div className="text-[11px] space-y-1 text-gray-700">
                    <div className="flex justify-between"><span>Office:</span><strong className="text-gray-900">Takashimaya Bank (TKB) - HO</strong></div>
                    <div className="flex justify-between"><span>Currency:</span><strong className="text-gray-900">Vietnamese Dong [VND]</strong></div>
                    <div className="flex justify-between"><span>Nợ (Debit):</span><strong className="text-purple-900">(110201) Settlement Bank Account</strong></div>
                    <div className="flex justify-between"><span>Số tiền Nợ:</span><strong className="font-mono text-emerald-700">20,000,000 VND</strong></div>
                    <div className="flex justify-between"><span>Có (Credit):</span><strong className="text-purple-900">(220401) Interbank Borrowings</strong></div>
                    <div className="flex justify-between"><span>Số tiền Có:</span><strong className="font-mono text-emerald-700">20,000,000 VND</strong></div>
                    <div className="flex justify-between"><span>Reference:</span><strong className="font-mono text-gray-800">TKB-TRE-IB-001</strong></div>
                    <div className="flex justify-between"><span>Date:</span><strong className="font-mono text-gray-800">10/14/2026</strong></div>
                    <div className="flex justify-between"><span>Payment Type:</span><strong className="text-gray-800">Money Transfer</strong></div>
                    <div className="text-[10px] text-gray-500 italic mt-0.5">Comments: Interbank borrowing - VND 20M - 30 days - 6% p.a.</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('practice-autofill-interbank-borrowing'));
                  }}
                  className="w-full py-2 px-3 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Tự động điền dữ liệu Vay liên ngân hàng (Hình 1)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const submitBtn = document.getElementById('tour-manual-journal-submit-btn');
                    if (submitBtn) {
                      submitBtn.click();
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Xác nhận gửi bút toán (Submit) &rarr;
                </button>
              </div>
            )}

            {/* Step 6: In View Transaction (accounting-view-transaction) -> Celebration & Match Hình 2 */}
            {currentPath === 'accounting-view-transaction' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[2px] text-xs text-emerald-900 space-y-1.5 leading-snug">
                  <div className="font-bold text-emerald-800 flex items-center justify-between">
                    <span>Hạch toán thành công a2fbdc3d0f2f (Hình 2)</span>
                    <span className="font-mono text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">100% Hoàn thành</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Khoản vay liên ngân hàng <strong>20.000.000 VND</strong> đã được ghi tăng vào TK thanh toán 110201 và ghi nhận nợ phải trả TK 220401. Thanh khoản của Takashimaya Bank đã được bù đắp và cân đối an toàn!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('tkb_treasury_interbank_done', 'true');
                    }
                    if (onClose) onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
                >
                  Hoàn thành phần thực hành (Phân hệ 05: Treasury)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (navigate) navigate('accounting-journal');
                  }}
                  className="w-full py-2 px-3 bg-sky-50 border border-sky-200 text-[#1072ba] hover:bg-sky-100 text-xs font-medium rounded-[2px] cursor-pointer transition-colors text-center"
                >
                  Quay lại Sổ Nhật ký chung (Journal Entries)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick autofill suggestion popup card for Currency creation (GL Part 1) */}
        

        {/* Quick autofill suggestion popup card for Currency creation (GL Part 1) */}
        {module === 'gl-part-1' && currentStep === 4 && !hasVndDraft && (
          <div className="p-3 bg-gradient-to-br from-sky-50 to-blue-50/80 border border-sky-200 rounded-[3px] space-y-2 mt-2 shadow-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[#1072ba] font-bold text-xs">
              <span>Nhập Dữ Liệu Mẫu (VND)</span>
            </div>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              Bạn có thể tự tìm kiếm ở vùng sáng bên cạnh, hoặc bấm nút dưới đây để hệ thống tự động điền đơn vị tiền tệ <strong className="text-[#1072ba]">VND (Vietnamese Dong)</strong> và bật sáng nút dấu cộng <strong className="text-gray-900">(+)</strong>:
            </p>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-autofill-currency', {
                  detail: { code: 'VND', name: 'Vietnamese Dong' }
                }));
              }}
              className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center active:scale-[0.98]"
            >
              <span>Nhập dữ liệu mẫu (VND - Vietnamese Dong)</span>
            </button>
          </div>
        )}

        {/* Quick autofill suggestion popup card for Financial Activity Mapping (GL Part 5) */}
        {module === 'gl-part-5' && isMappingFormOpen && !isMappingFormFilled && (
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-[2px] space-y-2 mt-2 shadow-xs animate-in fade-in duration-150">
            <div className="text-gray-900 font-bold text-xs border-b border-gray-200 pb-1">
              Nhập dữ liệu mẫu Mapping ({completedActivityCodes.length + 1}/6): {nextMappingSample.activityName}
            </div>
            <div className="text-[11px] text-gray-700 space-y-1 bg-white p-2.5 rounded border border-gray-200 font-mono">
              <div>Financial Activity: <strong className="text-gray-900">{nextMappingSample.activityName}</strong></div>
              <div>Mã Activity: <strong className="text-gray-900">{nextMappingSample.activityCode}</strong></div>
              <div>Account Type: <strong className="text-gray-900">{nextMappingSample.accountType}</strong></div>
              <div>Account GL: <strong className="text-gray-900">{nextMappingSample.accountCode} - {nextMappingSample.accountName}</strong></div>
              <div className="text-gray-500 font-sans text-[10px] pt-0.5">{nextMappingSample.description}</div>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Nhấn nút bên dưới để tự động chọn đúng Financial Activity và Tài khoản GL tương ứng:
            </p>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-autofill-activity-mapping', {
                  detail: {
                    activityCode: nextMappingSample.activityCode,
                    accountCode: nextMappingSample.accountCode
                  }
                }));
              }}
              className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center active:scale-[0.98]"
            >
              <span>Nhập dữ liệu mẫu ({nextMappingSample.activityCode} sang {nextMappingSample.accountCode})</span>
            </button>
          </div>
        )}

        {/* Quick autofill suggestion popup card for GL Header creation (GL Part 2) */}
        {module === 'gl-part-2' && isGlFormOpen && !isGlFormFilled && (
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-[2px] space-y-2 mt-2 shadow-xs animate-in fade-in duration-150">
            <div className="text-gray-900 font-bold text-xs border-b border-gray-200 pb-1">
              Nhập dữ liệu mẫu Header ({glCompletedCodes.length + 1}/5): {glNextSample.name}
            </div>
            <div className="text-[11px] text-gray-700 space-y-1 bg-white p-2.5 rounded border border-gray-200 font-mono">
              <div>Account Type: <strong className="text-gray-900">{glNextSample.type}</strong></div>
              <div>GL Code: <strong className="text-gray-900">{glNextSample.glCode}</strong></div>
              <div>Account Name: <strong className="text-gray-900">{glNextSample.name}</strong></div>
              <div>Account Usage: <strong className="text-gray-900">{glNextSample.usage}</strong></div>
              <div>Manual Entries Allowed: <strong className="text-gray-900">Không chọn (Unchecked)</strong></div>
              <div className="text-gray-500 font-sans text-[10px] pt-0.5">{glNextSample.description}</div>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Nhấn nút bên dưới để tự động điền toàn bộ thông tin chuẩn cho Header {glNextSample.name} ({glNextSample.glCode}):
            </p>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-autofill-gl', {
                  detail: glNextSample
                }));
              }}
              className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center active:scale-[0.98]"
            >
              <span>Nhập dữ liệu mẫu ({glNextSample.name} - {glNextSample.glCode})</span>
            </button>
          </div>
        )}

        {/* Quick autofill suggestion popup card for GL Detail creation (GL Part 4) */}
        {module === 'gl-part-4' && isGlFormOpen && !isGlFormFilled && (
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-[2px] space-y-2 mt-2 shadow-xs animate-in fade-in duration-150">
            <div className="text-gray-900 font-bold text-xs border-b border-gray-200 pb-1">
              Nhập dữ liệu mẫu GL Detail ({detailCompletedSampleCodes.length + 1}/5): {nextDetailSample.name}
            </div>
            <div className="text-[11px] text-gray-700 space-y-1 bg-white p-2.5 rounded border border-gray-200 font-mono">
              <div>Account Type: <strong className="text-gray-900">{nextDetailSample.type}</strong></div>
              <div>GL Code: <strong className="text-gray-900">{nextDetailSample.glCode}</strong></div>
              <div>Account Name: <strong className="text-gray-900">{nextDetailSample.name}</strong></div>
              <div>Parent: <strong className="text-gray-900">{nextDetailSample.parentGlCode} - {nextDetailSample.parentName}</strong></div>
              <div>Account Usage: <strong className="text-[#1072ba]">{nextDetailSample.usage}</strong></div>
              <div>Manual Entries Allowed: <strong className="text-gray-900">{nextDetailSample.manualEntriesAllowed ? 'Có chọn (Checked)' : 'Không chọn (Unchecked)'}</strong></div>
              <div className="text-gray-500 font-sans text-[10px] pt-0.5">{nextDetailSample.description}</div>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Nhấn nút bên dưới để tự động điền toàn bộ thông tin chuẩn cho GL Detail {nextDetailSample.name} ({nextDetailSample.glCode}):
            </p>
            <button
              type="button"
              onClick={() => {
                const parentAcc = glAccounts.find(a => a.glCode === nextDetailSample.parentGlCode);
                window.dispatchEvent(new CustomEvent('practice-autofill-gl', {
                  detail: {
                    ...nextDetailSample,
                    parentId: parentAcc ? parentAcc.id : ''
                  }
                }));
              }}
              className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center active:scale-[0.98]"
            >
              <span>Nhập dữ liệu mẫu ({nextDetailSample.name} - {nextDetailSample.glCode})</span>
            </button>
          </div>
        )}

        {/* Quick autofill suggestion popup card for GL Level 2 creation (GL Part 3) */}
        {module === 'gl-part-3' && isGlFormOpen && !isGlFormFilled && (
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-[2px] space-y-2 mt-2 shadow-xs animate-in fade-in duration-150">
            <div className="text-gray-900 font-bold text-xs border-b border-gray-200 pb-1">
              Nhập dữ liệu mẫu GL Cấp 2 ({level2CompletedSampleCodes.length + 1}/5): {nextLevel2Sample.name}
            </div>
            <div className="text-[11px] text-gray-700 space-y-1 bg-white p-2.5 rounded border border-gray-200 font-mono">
              <div>Account Type: <strong className="text-gray-900">{nextLevel2Sample.type}</strong></div>
              <div>GL Code: <strong className="text-gray-900">{nextLevel2Sample.glCode}</strong></div>
              <div>Account Name: <strong className="text-gray-900">{nextLevel2Sample.name}</strong></div>
              <div>Parent: <strong className="text-gray-900">{nextLevel2Sample.parentGlCode} - {nextLevel2Sample.parentName}</strong></div>
              <div>Account Usage: <strong className="text-gray-900">{nextLevel2Sample.usage}</strong></div>
              <div>Manual Entries Allowed: <strong className="text-gray-900">Không chọn (Unchecked)</strong></div>
              <div className="text-gray-500 font-sans text-[10px] pt-0.5">{nextLevel2Sample.description}</div>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Nhấn nút bên dưới để tự động điền toàn bộ thông tin chuẩn cho GL Cấp 2 {nextLevel2Sample.name} ({nextLevel2Sample.glCode}):
            </p>
            <button
              type="button"
              onClick={() => {
                const parentAcc = glAccounts.find(a => a.glCode === nextLevel2Sample.parentGlCode);
                window.dispatchEvent(new CustomEvent('practice-autofill-gl', {
                  detail: {
                    ...nextLevel2Sample,
                    parentId: parentAcc ? parentAcc.id : ''
                  }
                }));
              }}
              className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center active:scale-[0.98]"
            >
              <span>Nhập dữ liệu mẫu ({nextLevel2Sample.name} - {nextLevel2Sample.glCode})</span>
            </button>
          </div>
        )}

        {/* Completion action button in tooltip card for GL Part 9 (Frequent Postings) */}
        {module === 'gl-part-9' && currentPath === 'accounting-view-transaction' && (
          <div className="pt-2 space-y-2 border-t border-gray-100">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
              <div className="font-bold text-emerald-900 mb-1">
                Ghi nhận bút toán Frequent Posting thành công (5.000.000 VND):
              </div>
              <div>Mã giao dịch: a2f68debe1a7 | Quy tắc: Operating Expense Accrual</div>
              <div>Có TK 220301 (Accrued Operating Expenses Payable): VND 5,000,000.00</div>
              <div>Nợ TK 530101 (Operating Expense): VND 5,000,000.00</div>
              <div>Mã tham chiếu: TKB-OPEX-202610-002 | Ngày: 12 October 2026</div>
              <div className="mt-1 font-semibold text-emerald-900">
                Tổng Nợ (5 triệu) = Tổng Có (5 triệu). Bút toán hạch toán định kỳ hoàn tất!
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (navigate) navigate('accounting');
              }}
              className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Hoàn thành phần thực hành
            </button>
          </div>
        )}

        {/* Completion action button in tooltip card for GL Part 8 (Accounting Rules) */}
        {module === 'gl-part-8' && currentPath === 'accounting-view-rule' && (
          <div className="pt-2 space-y-2 border-t border-gray-100">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
              <div className="font-bold text-emerald-900 mb-1">
                Thiết lập Accounting Rule thành công:
              </div>
              <div>Tên quy tắc: Operating Expense Accrual</div>
              <div>Office: Takashimaya Bank (TKB) - HO</div>
              <div>Nợ TK 530101 (Operating Expense): Ghi tăng chi phí hoạt động</div>
              <div>Có TK 220301 (Accrued Operating Expenses Payable): Ghi tăng nghĩa vụ phải trả</div>
              <div className="mt-1 font-semibold text-emerald-900">
                Hoàn thành quy tắc định khoản mẫu cho các giao dịch trích trước chi phí.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (navigate) navigate('accounting-rules');
              }}
              className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Hoàn thành phần thực hành
            </button>
          </div>
        )}

        {/* Completion action button in tooltip card for GL Part 7 (Manual Journal Entries) */}
        {module === 'gl-part-7' && currentPath === 'accounting-journal' && Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-manual-opex')) && (
          <div className="pt-2 space-y-2 border-t border-gray-100">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
              <div className="font-bold text-emerald-900 mb-1">
                Ghi nhận bút toán sổ cái thủ công thành công (2.000.000 VND):
              </div>
              <div>Nợ TK 530101 (Operating Expense): 2.000.000 VND</div>
              <div>Có TK 220301 (Accrued Operating Expenses Payable): 2.000.000 VND</div>
              <div>Mã tham chiếu: TKB-OPEX-202610-001 | Ngày: 9/1/2026</div>
              <div className="mt-1 font-semibold text-emerald-900">
                Tổng Nợ (2 triệu) = Tổng Có (2 triệu). Bút toán thủ công cân đối và hoàn tất!
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (navigate) navigate('accounting-journal');
              }}
              className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Hoàn thành phần thực hành
            </button>
          </div>
        )}

        {/* Completion action button in tooltip card for GL Part 6 (Opening Balance Migration & Journal Entries) */}
        {module === 'gl-part-6' && currentPath === 'accounting-journal' && Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-target')) && (
          <div className="pt-2 space-y-2 border-t border-gray-100">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
              <div className="font-bold text-emerald-900 mb-1">
                Đối soát cân đối kế toán thành công (1 tỷ VND):
              </div>
              <div>Nợ TK 110101 (Cash at Vault): 200.000.000 VND</div>
              <div>Nợ TK 110201 (Settlement Bank Account): 800.000.000 VND</div>
              <div>Có TK 310101 (Contributed Capital): 1.000.000.000 VND</div>
              <div className="mt-1 font-semibold text-emerald-900">
                Tổng Nợ (1 tỷ) = Tổng Có (1 tỷ). Sổ cái Mifos hoàn toàn cân bằng!
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (navigate) navigate('accounting-journal');
              }}
              className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Hoàn thành phần thực hành
            </button>
          </div>
        )}

        {/* Completion action buttons in tooltip card for GL Part 5 (Financial Activity Mappings) */}
        {module === 'gl-part-5' && (completedActivityCodes.length >= 6 || financialActivities.length >= 6) && !isMappingFormOpen && (
          <div className="pt-2 space-y-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setFinActivityPopup(null);
                onClose();
                if (navigate) navigate('accounting-activities');
              }}
              className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Hoàn thành phần thực hành
            </button>
          </div>
        )}

        {/* Completion action buttons in tooltip card for GL Part 4 (GL Detail) */}
        {module === 'gl-part-4' && (detailCompletedSampleCodes.length >= 5 || totalDetailsCreated >= 54) && !isGlFormOpen && (
          <div className="pt-2 space-y-2 border-t border-gray-100">
            {totalDetailsCreated < 54 && (
              <button
                type="button"
                onClick={() => {
                  if (onLoadAllGlDetails) {
                    onLoadAllGlDetails();
                  }
                  setGlDetailImported(true);
                  setGlDetailPopup('all-imported');
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Nhập toàn bộ danh sách GL Detail vào database (54 tài khoản)
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setGlDetailPopup(null);
                onClose();
                if (navigate) navigate('accounting-coa');
              }}
              className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Hoàn thành phần thực hành
            </button>
          </div>
        )}

        {/* Completion action buttons in tooltip card for GL Part 3 (GL Level 2) */}
        {module === 'gl-part-3' && (level2CompletedSampleCodes.length >= 5 || totalLevel2Created >= 11) && !isGlFormOpen && (
          <div className="pt-2 space-y-2 border-t border-gray-100">
            {totalLevel2Created < 11 && (
              <button
                type="button"
                onClick={() => {
                  if (onLoadAllGlLevel2) {
                    onLoadAllGlLevel2();
                  }
                  setGlLevel2Imported(true);
                  setGlLevel2Popup('all-imported');
                }}
                className="w-full py-2.5 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
              >
                Nhập toàn bộ danh sách GL Cấp 2 vào database (11 tài khoản)
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setGlLevel2Popup(null);
                onClose();
                if (navigate) navigate('accounting-coa');
              }}
              className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Hoàn thành phần thực hành
            </button>
          </div>
        )}

        {/* Completion action button in tooltip card for GL Part 2 (5 Headers) */}
        {module === 'gl-part-2' && glCompletedCodes.length >= 5 && !isGlFormOpen && (
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setGlPopup(null);
                onClose();
                if (navigate) navigate('accounting-coa');
              }}
              className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Hoàn thành phần thực hành
            </button>
          </div>
        )}

        {/* Completion action button in tooltip card for GL Part 1 (Currencies) */}
        {module === 'gl-part-1' && currencies.length >= 5 && (
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setCurrencyPopup(false);
                onClose();
                if (navigate) navigate('admin-currency-config');
              }}
              className="w-full py-2.5 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold rounded-[2px] shadow-xs cursor-pointer transition-colors text-center"
            >
              Hoàn thành phần thực hành
            </button>
          </div>
        )}

        {/* Quick autofill suggestion button for Role Permissions Setup */}
        {(module === 'role-permissions' || module === 'part-1') && currentStep === 8 && currentPath === 'admin-role-detail' && (
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-[2px] text-[11px] text-sky-900 leading-relaxed font-sans">
              <div className="font-bold text-[#1072ba] mb-1">
                Gợi ý mẫu quyền Role biểu diễn: TKB_ACCOUNTING_MAKER
              </div>
              <div>Tab <strong>Accounting</strong>: READ GLACCOUNT, READ JOURNALENTRY, CREATE JOURNALENTRY, READ ACCOUNTINGRULE</div>
              <div>Tab <strong>Organisation</strong>: READ OFFICE</div>
            </div>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-autofill-role-permissions', {
                  detail: {
                    activeCategory: 'accounting',
                    permissions: [
                      'READ_GLACCOUNT',
                      'READ_JOURNALENTRY',
                      'CREATE_JOURNALENTRY',
                      'READ_ACCOUNTINGRULE',
                      'READ_OFFICE'
                    ]
                  }
                }));
              }}
              className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0e619e] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-colors text-center"
            >
              Điền nhanh quyền chuẩn mẫu
            </button>
          </div>
        )}

        {/* Quick autofill suggestion button for Role creation (Part 1 - Step 5) */}
        {module === 'part-1' && (currentPath === 'admin-add-role' || (tourPhase === 'role' && currentStep === 5)) && (
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAutofillRole}
              className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Điền nhanh mẫu (TKB_TELLER_CASHIER)
            </button>
          </div>
        )}

        {/* Quick autofill suggestion button for Office creation (Part 2) */}
        {module === 'part-2' && currentStep === 5 && (
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const hasHO = offices.some(o => !o.parentId || o.parentId === 'none' || o.parentId === 'root');
                const headOffice = offices.find(o => !o.parentId || o.parentId === 'none' || o.parentId === 'root');
                const regionalOffice = offices.find(o => o.name.toLowerCase().includes('region') || o.name.toLowerCase().includes('khu vực'));
                const branchOffice = offices.find(o => o.name.toLowerCase().includes('branch') || o.name.toLowerCase().includes('chi nhánh'));

                if (!hasHO) {
                  window.dispatchEvent(new CustomEvent('practice-autofill-office', {
                    detail: {
                      name: 'Takashimaya Bank (TKB) - HO',
                      parentId: 'none',
                      openingDate: '2026-08-01',
                      externalId: 'TKB - HO - 001'
                    }
                  }));
                } else if (!regionalOffice) {
                  window.dispatchEvent(new CustomEvent('practice-autofill-office', {
                    detail: {
                      name: 'TKB - Northern Region Office',
                      parentId: headOffice?.id || '1',
                      openingDate: '2026-08-02',
                      externalId: 'TKB - RO - NORTH'
                    }
                  }));
                } else if (!branchOffice) {
                  window.dispatchEvent(new CustomEvent('practice-autofill-office', {
                    detail: {
                      name: 'Hanoi Branch',
                      parentId: regionalOffice?.id || '2',
                      openingDate: '2026-08-03',
                      externalId: 'TKB - BR - HAN'
                    }
                  }));
                } else {
                  window.dispatchEvent(new CustomEvent('practice-autofill-office', {
                    detail: {
                      name: 'Cau Giay Transaction Office',
                      parentId: branchOffice?.id || '5',
                      openingDate: '2026-08-04',
                      externalId: 'TKB-TO-HAN-02'
                    }
                  }));
                }
              }}
              className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Điền nhanh mẫu đơn vị tiếp theo
            </button>
          </div>
        )}

        {/* Quick autofill suggestion button for User creation */}
        {module === 'part-1' && (currentStep === 11 || currentStep === 8 || currentPath === 'admin-create-user') && (
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAutofillUser}
              className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Điền nhanh mẫu user (tkb.teller01)
            </button>
          </div>
        )}

        {/* Quick helper for GL Part 6: Enable Contra Account */}
        {module === 'gl-part-6' && currentPath === 'admin-configurations' && !contraAccountConfigEnabled && (
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (onToggleContraAccount) onToggleContraAccount(true);
                window.dispatchEvent(new CustomEvent('practice-enable-contra-account'));
              }}
              className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Bật cấu hình Contra Account
            </button>
          </div>
        )}

        {/* Helper for GL Part 6: Step 7 - Select Office */}
        {module === 'gl-part-6' && currentPath === 'accounting-opening-balances' && targetSelector === '#tour-office-select-field' && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-select-office-ho'));
              }}
              className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
            >
              <span>Chọn Hội sở (TKB - HO) và Tiếp tục</span>
            </button>
          </div>
        )}

        {/* Helper for GL Part 6: Step 8 - Retrieve */}
        {module === 'gl-part-6' && currentPath === 'accounting-opening-balances' && targetSelector === '#tour-btn-retrieve' && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-trigger-retrieve'));
              }}
              className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
            >
              <span>Tải danh mục (Retrieve) và Tiếp tục</span>
            </button>
          </div>
        )}

        {/* Sequential 'Tiếp tục' helper for GL Part 6: Step 9 & 10 (Opening Balances inputs & Submit) */}
        {module === 'gl-part-6' && currentPath === 'accounting-opening-balances' && Boolean(typeof document !== 'undefined' && document.getElementById('tour-migration-form-card')) && (
          <div className="pt-1">
            {openingBalanceSubStep === 'vault' && (
              <button
                type="button"
                onClick={() => {
                  const vaultInput = document.getElementById('tour-input-debit-110101');
                  const val = vaultInput?.value ? Number(vaultInput.value) : 0;
                  if (val < 200000000) {
                    window.dispatchEvent(new CustomEvent('practice-autofill-single-balance', {
                      detail: { glCode: '110101', debit: '200000000' }
                    }));
                  }
                  setOpeningBalanceSubStep('bank');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền 200.000.000đ và Tiếp tục (Settlement Bank)</span>
              </button>
            )}

            {openingBalanceSubStep === 'bank' && (
              <button
                type="button"
                onClick={() => {
                  const bankInput = document.getElementById('tour-input-debit-110201');
                  const val = bankInput?.value ? Number(bankInput.value) : 0;
                  if (val < 800000000) {
                    window.dispatchEvent(new CustomEvent('practice-autofill-single-balance', {
                      detail: { glCode: '110201', debit: '800000000' }
                    }));
                  }
                  setOpeningBalanceSubStep('capital');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền 800.000.000đ và Tiếp tục (Contributed Capital)</span>
              </button>
            )}

            {openingBalanceSubStep === 'capital' && (
              <button
                type="button"
                onClick={() => {
                  const capitalInput = document.getElementById('tour-input-credit-310101');
                  const val = capitalInput?.value ? Number(capitalInput.value) : 0;
                  if (val < 1000000000) {
                    window.dispatchEvent(new CustomEvent('practice-autofill-single-balance', {
                      detail: { glCode: '310101', credit: '1000000000' }
                    }));
                  }
                  setOpeningBalanceSubStep('submit');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền 1.000.000.000đ và Tiếp tục đến Submit</span>
              </button>
            )}

            {openingBalanceSubStep === 'submit' && (
              <button
                type="button"
                onClick={() => {
                  const submitBtn = document.getElementById('tour-submit-opening-balances-btn');
                  if (submitBtn) {
                    submitBtn.click();
                  }
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Bấm Submit ghi sổ cái và Tiếp tục</span>
              </button>
            )}
          </div>
        )}

        {/* Sequential 'Tiếp tục' helper for GL Part 7: Create Journal Entries */}
        {module === 'gl-part-7' && currentPath === 'accounting-create-journal' && (
          <div className="pt-1 space-y-2">
            {manualJournalSubStep === 'office' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-select-manual-office-ho'));
                  setManualJournalSubStep('currency');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn Hội sở (TKB - HO) và Tiếp tục</span>
              </button>
            )}

            {manualJournalSubStep === 'currency' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-select-manual-currency-vnd'));
                  setManualJournalSubStep('debit-gl');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn VND và Tiếp tục</span>
              </button>
            )}

            {manualJournalSubStep === 'debit-gl' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-select-manual-debit-opex'));
                  setManualJournalSubStep('debit-amount');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn TK 530101 (Operating Expense) và Tiếp tục</span>
              </button>
            )}

            {manualJournalSubStep === 'debit-amount' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-manual-debit-amount'));
                  setManualJournalSubStep('credit-gl');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền 2.000.000đ và Tiếp tục</span>
              </button>
            )}

            {manualJournalSubStep === 'credit-gl' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-select-manual-credit-accrued'));
                  setManualJournalSubStep('credit-amount');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn TK 220301 (Accrued Operating Exp) và Tiếp tục</span>
              </button>
            )}

            {manualJournalSubStep === 'credit-amount' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-manual-credit-amount'));
                  setManualJournalSubStep('ref-date');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền 2.000.000đ và Tiếp tục</span>
              </button>
            )}

            {manualJournalSubStep === 'ref-date' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-manual-ref-date'));
                  setManualJournalSubStep('submit');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền mã tham chiếu và ngày rồi Tiếp tục</span>
              </button>
            )}

            {manualJournalSubStep === 'submit' && (
              <button
                type="button"
                onClick={() => {
                  const submitBtn = document.getElementById('tour-manual-submit-btn');
                  if (submitBtn) {
                    submitBtn.click();
                  }
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Bấm Submit ghi sổ cái và Tiếp tục</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-autofill-manual-journal'));
                setManualJournalSubStep('submit');
              }}
              className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Điền nhanh toàn bộ mẫu (2 triệu OPEX)
            </button>
          </div>
        )}

        {/* Quick helper for GL Part 9: Step-by-step Frequent Postings inputs */}
        {module === 'gl-part-9' && currentPath === 'accounting-frequent-postings' && (
          <div className="pt-2 space-y-1.5 border-t border-gray-100">
            {frequentSubStep === 'office' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-frequent-office'));
                  setFrequentSubStep('rule');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn Hội sở: Takashimaya Bank (TKB) - HO</span>
              </button>
            )}

            {frequentSubStep === 'rule' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-frequent-rule'));
                  setFrequentSubStep('currency');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn Quy tắc: Operating Expense Accrual</span>
              </button>
            )}

            {frequentSubStep === 'currency' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-frequent-currency'));
                  setFrequentSubStep('debit');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn Tiền tệ: Vietnamese Dong [VND]</span>
              </button>
            )}

            {frequentSubStep === 'debit' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-frequent-debit'));
                  setFrequentSubStep('credit');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền Nợ: 5.000.000 VND</span>
              </button>
            )}

            {frequentSubStep === 'credit' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-frequent-credit'));
                  setFrequentSubStep('ref-date');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền Có: 5.000.000 VND</span>
              </button>
            )}

            {frequentSubStep === 'ref-date' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-frequent-ref-date'));
                  setFrequentSubStep('comments');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền Ref (TKB-OPEX-202610-002) & Ngày (10/12/2026)</span>
              </button>
            )}

            {frequentSubStep === 'comments' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-frequent-comments'));
                  setFrequentSubStep('submit');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền Diễn giải Comments</span>
              </button>
            )}

            {frequentSubStep === 'submit' && (
              <button
                type="button"
                onClick={() => {
                  const submitBtn = document.getElementById('tour-frequent-submit-btn');
                  if (submitBtn) {
                    submitBtn.click();
                  }
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Bấm Submit ghi nhận giao dịch và Xem kết quả</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-fill-frequent-all'));
                setFrequentSubStep('submit');
              }}
              className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Điền nhanh toàn bộ mẫu (5 triệu IT maintenance)
            </button>
          </div>
        )}

        {/* Quick helper for GL Part 8: Step-by-step Accounting Rule inputs */}
        {module === 'gl-part-8' && currentPath === 'accounting-create-rule' && (
          <div className="pt-2 space-y-1.5 border-t border-gray-100">
            {ruleSubStep === 'name' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-accounting-rule-name'));
                  setRuleSubStep('office');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền tên: Operating Expense Accrual</span>
              </button>
            )}

            {ruleSubStep === 'office' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-accounting-rule-office'));
                  setRuleSubStep('debit');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn Hội sở: Takashimaya Bank (TKB) - HO</span>
              </button>
            )}

            {ruleSubStep === 'debit' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-accounting-rule-debit'));
                  setRuleSubStep('credit');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn Nợ TK 530101 (Operating Expense)</span>
              </button>
            )}

            {ruleSubStep === 'credit' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-accounting-rule-credit'));
                  setRuleSubStep('desc');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Chọn Có TK 220301 (Accrued Operating Expenses Payable)</span>
              </button>
            )}

            {ruleSubStep === 'desc' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-fill-accounting-rule-desc'));
                  setRuleSubStep('submit');
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Điền mô tả Description</span>
              </button>
            )}

            {ruleSubStep === 'submit' && (
              <button
                type="button"
                onClick={() => {
                  const submitBtn = document.getElementById('tour-rule-submit-btn');
                  if (submitBtn) {
                    submitBtn.click();
                  }
                }}
                className="w-full py-2 px-3 bg-[#1072ba] hover:bg-[#0d5d99] text-white rounded-[2px] font-bold text-xs shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                <span>Bấm Submit lưu quy tắc và Xem kết quả</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-fill-accounting-rule-all'));
                setRuleSubStep('submit');
              }}
              className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Điền nhanh toàn bộ form mẫu
            </button>
          </div>
        )}

        {/* Quick helper for GL Part 7: Filter Journal Entries Date */}
        {module === 'gl-part-7' && currentPath === 'accounting-journal' && !Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-manual-opex')) && (
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-filter-manual-journal-dates'));
              }}
              className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Lọc ngày giao dịch (01/01/2026 - 31/10/2026)
            </button>
          </div>
        )}

        {/* Quick helper for GL Part 6: Filter Journal Entries Date */}
        {module === 'gl-part-6' && currentPath === 'accounting-journal' && !Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-target')) && (
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-filter-journal-dates'));
              }}
              className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Lọc ngày giao dịch 12/10/2026
            </button>
          </div>
        )}

        <div className="pt-1 text-[10px] text-gray-400 flex items-center justify-between">
          <span>
            {(module === 'loan-part-1' && loanProducts.some(p => p.shortName === 'Loan' || p.shortName === 'TKPL' || p.externalId === 'TKB-PRD-PL-001' || p.name === 'TKB Personal Loan'))
              ? 'Nhấn nút "Hoàn thành phần thực hành" phía trên để kết thúc'
              : (module === 'saving-part-4' && (hasCheckedRdJournal || currentPath === 'accounting-journal' || currentPath === 'accounting-journal-entries') && savingsAccounts.some(s => s.accountNo === '000000004' && (s.status === 'Active' || s.status === 'Activated') && (s.hasDeposited || Number(s.balance) >= 500000)))
              ? 'Nhấn nút "Hoàn thành phần thực hành" phía trên để kết thúc'
              : (module === 'saving-part-3' && recurringDepositProducts.some(p => p.shortName === 'TKGS'))
              ? 'Nhấn nút "Hoàn thành phần thực hành" phía trên để kết thúc'
              : (module === 'saving-part-2' && savingsAccounts.some(s => s.accountNo === '000000003' && (s.status === 'Active' || s.status === 'Activated')))
              ? 'Nhấn nút "Hoàn thành phần thực hành" phía trên để kết thúc'
              : (module === 'saving-part-1' && fixedDepositProducts.some(p => p.shortName === 'TKFD'))
              ? 'Nhấn nút "Hoàn thành phần thực hành" phía trên để kết thúc'
              : (module === 'treasury-part-1' && (currentPath === 'accounting-journal' || currentPath === 'accounting-journal-entries'))
              ? 'Nhấn nút "Hoàn thành phần thực hành (Phân hệ 05: Treasury)" phía trên để kết thúc'
              : (module === 'casa-part-5' && currentStep === 7)
              ? 'Nhấn nút "Hoàn tất bài thực hành Chuyển khoản nội bộ" phía trên để kết thúc'
              : (module === 'casa-part-4' && currentStep === 5)
              ? 'Nhấn nút "Hoàn tất bài thực hành Rút tiền CASA" phía trên để kết thúc'
              : (module === 'casa-part-3' && currentStep === 5)
              ? 'Nhấn nút "Hoàn tất bài thực hành CASA" phía trên để kết thúc'
              : (module === 'casa-part-2' && currentStep === 8)
              ? 'Nhấn nút "Hoàn tất bài thực hành CIF" phía trên để kết thúc'
              : (module === 'casa-part-1' && savingsProducts.some(p => p.shortName === 'TKCA'))
              ? 'Nhấn nút "Tiếp tục: Tạo CIF Khách Hàng" phía trên để sang Phần 2'
              : (module === 'gl-part-9' && currentPath === 'accounting-view-transaction') ||
             (module === 'gl-part-8' && currentPath === 'accounting-view-rule') ||
             (module === 'gl-part-7' && currentPath === 'accounting-journal' && Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-manual-opex'))) ||
             (module === 'gl-part-6' && currentPath === 'accounting-journal' && Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-target'))) ||
             (module === 'gl-part-5' && (completedActivityCodes.length >= 6 || financialActivities.length >= 6)) ||
             (module === 'gl-part-4' && (detailCompletedSampleCodes.length >= 5 || totalDetailsCreated >= 54)) ||
             (module === 'gl-part-3' && (level2CompletedSampleCodes.length >= 5 || totalLevel2Created >= 11)) ||
             (module === 'gl-part-2' && glCompletedCodes.length >= 5) ||
             (module === 'gl-part-1' && currencies.length >= 5)
              ? 'Nhấn nút "Hoàn thành phần thực hành" phía trên để kết thúc'
              : (module === 'part-1' && (currentPath === 'admin-add-role' || (tourPhase === 'role' && currentStep === 5)) && !isRoleFormFilled) || (module === 'part-1' && (currentStep === 11 || currentStep === 8 || currentPath === 'admin-create-user') && !isUserFormFilled)
              ? 'Nhập vào ô phía trên hoặc chọn điền nhanh' 
              : 'Nhấn trực tiếp vào vùng phát sáng để tiếp tục'}
          </span>
        </div>
      </div>
    </>
  );
}
