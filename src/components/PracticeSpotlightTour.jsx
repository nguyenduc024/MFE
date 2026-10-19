import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ROOT_GL_HEADERS_SAMPLES, SAMPLE_GL_LEVEL_2, FULL_GL_LEVEL_2_ACCOUNTS, SAMPLE_GL_DETAILS } from '../views/ChartOfAccountsView';
import { SAMPLE_FINANCIAL_ACTIVITY_MAPPINGS } from '../views/FinancialActivityMappingsView';

/**
 * PracticeSpotlightTour - Guided interactive walkthrough for:
 * 1. Foundation: Roles & Users
 * 2. Foundation: 4-Tier Organization (HO, Region, Branch, TO)
 * 3. GL Part 1: Currency Configuration (VND & 5 Database Currencies)
 * 4. GL Part 2: 5 Root GL Headers (100000 TOTAL ASSETS -> 500000 TOTAL EXPENSES)
 * 5. GL Part 3: GL Level 2 Headers across 5 categories
 * 6. GL Part 4: GL Detail Accounts across 5 categories
 * 7. GL Part 5: Financial Activity Mappings (6 mappings)
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
  financialActivities = [],
  contraAccountConfigEnabled = false,
  onToggleContraAccount,
  hasOpeningBalanceSubmitted = false,
  onSubmitOpeningBalances,
  navigate,
  onLoadAllRoles,
  onLoadAllUsers,
  onLoadAllOffices,
  onLoadRegionalOffices,
  onLoadAllCurrencies,
  onLoadAllGlLevel2,
  onLoadAllGlDetails,
  onLoadAllFinancialActivities
}) {
  const [targetRect, setTargetRect] = useState(null);
  const [roleCreated, setRoleCreated] = useState(false);
  const [rolesImported, setRolesImported] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [usersImported, setUsersImported] = useState(false);
  const [tourPhase, setTourPhase] = useState('role'); // 'role', 'role-popup', 'user', 'user-popup', 'completed'

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

  const startRoleCountRef = useRef(roles.length);
  const startUserCountRef = useRef(users.length);

  // Reset session reference whenever practice becomes active
  useEffect(() => {
    if (isActive) {
      if (module === 'gl-part-6') {
        setGlPart6Popup(null);
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
        setRolesImported(false);
        setUserCreated(false);
        setUsersImported(false);
        setTourPhase('role');
      }
    }
  }, [isActive, module]);

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
  let targetSelector = '#tour-nav-admin';
  let stepTitle = 'Bước 1 / 4: Mở menu Quản trị';
  let stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở các phân hệ quản trị.';

  if (module === 'gl-part-6') {
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

          const isVaultDone = vaultVal >= 200000000;
          const isBankDone = bankVal >= 800000000;
          const isCapitalDone = capitalVal >= 1000000000;

          if (!isVaultDone) {
            currentStep = 9;
            targetSelector = '#tour-cell-debit-110101';
            stepTitle = 'Bước 9.1: Nhập Nợ (Debit) Cash at Vault (TK 110101)';
            stepInstruction = 'Tại dòng Cash at Vault (TK 110101), nhập số tiền Debit: 200000000 (200.000.000 VND). Vùng sáng đang chỉ định trực tiếp vào ô Debit.';
          } else if (!isBankDone) {
            currentStep = 9;
            targetSelector = '#tour-cell-debit-110201';
            stepTitle = 'Bước 9.2: Nhập Nợ (Debit) Settlement Bank Account (TK 110201)';
            stepInstruction = 'Tại dòng Settlement Bank Account (TK 110201), nhập số tiền Debit: 800000000 (800.000.000 VND). Vùng sáng đang chỉ định trực tiếp vào ô Debit.';
          } else if (!isCapitalDone) {
            currentStep = 9;
            targetSelector = '#tour-cell-credit-310101';
            stepTitle = 'Bước 9.3: Nhập Có (Credit) Contributed Capital (TK 310101)';
            stepInstruction = 'Tại dòng Contributed Capital (TK 310101), nhập số tiền Credit: 1000000000 (1 tỷ VND để cân bằng Tổng Nợ = Tổng Có). Vùng sáng đang chỉ định trực tiếp vào ô Credit.';
          } else {
            currentStep = 10;
            targetSelector = '#tour-submit-opening-balances-btn';
            stepTitle = 'Bước 10: Bấm Submit để ghi nhận số dư đầu kỳ';
            stepInstruction = 'Số liệu đầu kỳ đã cân đối hoàn hảo (Tổng Nợ 1 tỷ = Tổng Có 1 tỷ VND). Bấm nút Submit màu xanh để ghi nhận giao dịch vào sổ cái!';
          }
        } else {
          const officeSelectText = typeof document !== 'undefined' ? document.getElementById('tour-office-select-field')?.textContent : '';
          const hasSelectedOffice = officeSelectText && officeSelectText.includes('Takashimaya');
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
  } else if (tourPhase === 'user') {
    if (userCreated && currentPath === 'admin-user-detail') {
      currentStep = 9;
      targetSelector = null;
      stepTitle = 'Hoàn thành xuất sắc bài học!';
      stepInstruction = 'Bạn đã thiết lập thành công các vai trò nghiệp vụ và tạo tài khoản nhân viên.';
    } else if (currentPath === 'admin-create-user') {
      currentStep = 8;
      if (!isUserFormFilled) {
        targetSelector = '#tour-user-input-card';
        stepTitle = 'Bước 8: Nhập thông tin người dùng';
        stepInstruction = 'Nhập thông tin nhân viên (Username, Email, Họ tên, Chi nhánh, Vai trò) hoặc bấm "Điền nhanh mẫu user".';
      } else {
        targetSelector = '#tour-submit-user-btn';
        stepTitle = 'Bước 8: Nhấn Submit để tạo người dùng';
        stepInstruction = 'Thông tin tài khoản đã hợp lệ. Nhấn nút Submit để lưu người dùng vào hệ thống.';
      }
    } else if (currentPath === 'admin-users') {
      currentStep = 7;
      targetSelector = '#tour-create-user-btn';
      stepTitle = 'Bước 7: Nhấn nút Create User';
      stepInstruction = 'Bấm vào nút Create User ở góc trên bên phải để bắt đầu biểu mẫu cấp tài khoản mới.';
    } else {
      // Guide user to open Admin -> Users from wherever they currently are
      const adminUsersEl = typeof document !== 'undefined' ? document.getElementById('tour-admin-users') : null;
      if (adminUsersEl) {
        currentStep = 6;
        targetSelector = '#tour-admin-users';
        stepTitle = 'Bước 6.2: Chọn mục Users';
        stepInstruction = 'Bấm vào mục Users trong menu thả xuống để mở trang Quản lý danh sách người dùng.';
      } else {
        currentStep = 6;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 6.1: Mở menu Quản trị';
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

        // Auto-scroll target into view if outside visible viewport
        if (targetSelector.startsWith('#tour-cell-') || targetSelector === '#tour-submit-opening-balances-btn' || targetSelector === '#tour-journal-entry-target') {
          const inView = rect.top >= 60 && rect.bottom <= (window.innerHeight || 800) - 60;
          if (!inView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  const handleContinueToUsers = () => {
    setTourPhase('user');
  };

  const handleConfirmImportUsers = () => {
    if (onLoadAllUsers) {
      onLoadAllUsers();
    }
    setUsersImported(true);
  };

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
              Liên kết thành công: {lastMappingCreated?.activityName || 'Hoạt động'} ({lastMappingCreated?.activityCode}) ➔ {lastMappingCreated?.accountCode} - {lastMappingCreated?.accountName}!
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
                <span>[1] (300) Opening Balances Transfer Contra ➔ 310199</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">EQUITY - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[2] (101) Cash At Main Vault ➔ 110101</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[3] (102) Cash At Teller ➔ 110102</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[4] (103) Fund Source ➔ 110201</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[5] (100) Asset Transfer ➔ 130101</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between">
                <span>[6] (200) Liability Transfer ➔ 220201</span>
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
                <span>[1] 110101 Cash at Vault (➔ 110000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - DETAIL</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[2] 210101 Savings Deposits (➔ 210000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">LIABILITY - DETAIL</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[3] 310101 Contributed Capital (➔ 310000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">EQUITY - DETAIL</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[4] 410101 Loan Interest Income (➔ 410000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">INCOME - DETAIL</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[5] 510101 Savings Interest Expense (➔ 510000)</span>
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
                <span>[1] 110000 CASH AND BANK BALANCES (➔ 100000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">ASSET - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[2] 210000 CUSTOMER DEPOSITS (➔ 200000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">LIABILITY - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[3] 310000 CAPITAL AND RESERVES (➔ 300000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">EQUITY - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[4] 410000 INTEREST INCOME (➔ 400000)</span>
                <span className="text-[11px] text-emerald-700 font-semibold font-sans">INCOME - Đạt</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>[5] 510000 INTEREST EXPENSES (➔ 500000)</span>
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
                Tiếp tục tạo VP Khu vực →
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
                Tiếp tục tạo Chi nhánh →
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
                Tiếp tục tạo Phòng giao dịch (TO) →
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
                  <div>✓ Cấp 1: Hội sở chính (Head Office)</div>
                  <div>✓ Cấp 2: Văn phòng khu vực (Bắc, Trung, Nam có parent là Hội sở)</div>
                  <div>✓ Cấp 3: Chi nhánh (có parent là Văn phòng khu vực)</div>
                  <div>✓ Cấp 4: Phòng giao dịch (có parent là Chi nhánh)</div>
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
                Bước tiếp theo của phân hệ: Khởi tạo tài khoản nhân viên (Users) và liên kết với vai trò vừa nạp.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="py-1.5 px-3 text-gray-500 hover:text-gray-700 text-xs cursor-pointer"
                >
                  Đóng hướng dẫn
                </button>
                <button
                  onClick={handleContinueToUsers}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Tiếp tục: Tạo tài khoản Người dùng (Users)
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
            <div>✓ Thiết lập hệ thống vai trò tác nghiệp (Roles) chuẩn ngân hàng.</div>
            <div>✓ Tạo tài khoản người dùng nhân viên (Users) và phân quyền nghiệp vụ.</div>
            <div>✓ Nạp toàn bộ dữ liệu 26 nhân sự ngân hàng từ cơ sở dữ liệu.</div>
            <div>✓ Bảo vệ nghiêm ngặt 2 tài khoản và 2 vai trò hệ thống mặc định.</div>
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

  if (box) {
    if (targetSelector === '#tour-gl-create-card' || targetSelector === '#tour-mapping-create-card') {
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
        className="fixed z-[9999] bg-white rounded-[2px] shadow-2xl border border-gray-200 p-4 text-xs text-gray-800 space-y-3 animate-in fade-in zoom-in-95 duration-150 select-none"
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
          <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
            {stepInstruction}
          </p>
        </div>

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
              <span>Nhập dữ liệu mẫu ({nextMappingSample.activityCode} ➔ {nextMappingSample.accountCode})</span>
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

        {/* Completion action button in tooltip card for GL Part 6 (Opening Balance Migration & Journal Entries) */}
        {module === 'gl-part-6' && currentPath === 'accounting-journal' && Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-target')) && (
          <div className="pt-2 space-y-2 border-t border-gray-100">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-800 leading-relaxed">
              <div className="font-bold text-emerald-900 mb-1">
                Đối soát cân đối kế toán thành công (1 tỷ VND):
              </div>
              <div>• Nợ TK 110101 (Cash at Vault): 200.000.000 VND</div>
              <div>• Nợ TK 110201 (Settlement Bank Account): 800.000.000 VND</div>
              <div>• Có TK 310101 (Contributed Capital): 1.000.000.000 VND</div>
              <div className="mt-1 font-semibold text-emerald-900">
                ➔ Tổng Nợ (1 tỷ) = Tổng Có (1 tỷ). Sổ cái Mifos hoàn toàn cân bằng!
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

        {/* Quick autofill suggestion button for Role creation (Part 1) */}
        {module === 'part-1' && currentStep === 5 && (
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
        {currentStep === 8 && (
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

        {/* Quick helper for GL Part 6: Autofill Opening Balances */}
        {module === 'gl-part-6' && currentPath === 'accounting-opening-balances' && (
          <div className="pt-1 space-y-1.5">
            {targetSelector === '#tour-cell-debit-110101' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-autofill-single-balance', {
                    detail: { glCode: '110101', debit: '200000000' }
                  }));
                }}
                className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors text-center"
              >
                Điền 200.000.000 VND (Nợ TK 110101)
              </button>
            )}

            {targetSelector === '#tour-cell-debit-110201' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-autofill-single-balance', {
                    detail: { glCode: '110201', debit: '800000000' }
                  }));
                }}
                className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors text-center"
              >
                Điền 800.000.000 VND (Nợ TK 110201)
              </button>
            )}

            {targetSelector === '#tour-cell-credit-310101' && (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('practice-autofill-single-balance', {
                    detail: { glCode: '310101', credit: '1000000000' }
                  }));
                }}
                className="w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors text-center"
              >
                Điền 1.000.000.000 VND (Có TK 310101)
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('practice-autofill-opening-balances'));
              }}
              className="w-full py-1 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-[2px] text-[10px] font-normal cursor-pointer transition-colors text-center"
            >
              Điền nhanh toàn bộ số liệu (1 tỷ VND)
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
            {(module === 'gl-part-6' && currentPath === 'accounting-journal' && Boolean(typeof document !== 'undefined' && document.getElementById('tour-journal-entry-target'))) ||
             (module === 'gl-part-5' && (completedActivityCodes.length >= 6 || financialActivities.length >= 6)) ||
             (module === 'gl-part-4' && (detailCompletedSampleCodes.length >= 5 || totalDetailsCreated >= 54)) ||
             (module === 'gl-part-3' && (level2CompletedSampleCodes.length >= 5 || totalLevel2Created >= 11)) ||
             (module === 'gl-part-2' && glCompletedCodes.length >= 5) ||
             (module === 'gl-part-1' && currencies.length >= 5)
              ? 'Nhấn nút "Hoàn thành phần thực hành" phía trên để kết thúc'
              : (currentStep === 5 && !isRoleFormFilled) || (currentStep === 8 && !isUserFormFilled)
              ? 'Nhập vào ô phía trên hoặc chọn điền nhanh' 
              : 'Nhấn trực tiếp vào vùng phát sáng để tiếp tục'}
          </span>
        </div>
      </div>
    </>
  );
}
