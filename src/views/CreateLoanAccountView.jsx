import React, { useState, useEffect } from 'react';
import { 
  Pencil, Check, Calendar, ChevronDown, Download, 
  Terminal, AlertTriangle, CheckCircle2, Eye, ArrowLeft, ArrowRight, X
} from 'lucide-react';

export const SAMPLE_REPAYMENT_SCHEDULE = [
  {
    period: 1,
    days: 31,
    date: '14 November 2026',
    balanceOfLoan: 9211512.11,
    principalDue: 788487.89,
    interest: 100000.00,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 2,
    days: 30,
    date: '14 December 2026',
    balanceOfLoan: 8415139.34,
    principalDue: 796372.77,
    interest: 92115.12,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 3,
    days: 31,
    date: '14 January 2027',
    balanceOfLoan: 7610802.84,
    principalDue: 804336.50,
    interest: 84151.39,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 4,
    days: 31,
    date: '14 February 2027',
    balanceOfLoan: 6798422.98,
    principalDue: 812379.86,
    interest: 76108.03,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 5,
    days: 28,
    date: '14 March 2027',
    balanceOfLoan: 5977919.32,
    principalDue: 820503.66,
    interest: 67984.23,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 6,
    days: 31,
    date: '14 April 2027',
    balanceOfLoan: 5149210.62,
    principalDue: 828708.70,
    interest: 59779.19,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 7,
    days: 30,
    date: '14 May 2027',
    balanceOfLoan: 4312214.84,
    principalDue: 836995.78,
    interest: 51492.11,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 8,
    days: 31,
    date: '14 June 2027',
    balanceOfLoan: 3466849.10,
    principalDue: 845365.74,
    interest: 43122.15,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 9,
    days: 30,
    date: '14 July 2027',
    balanceOfLoan: 2613029.70,
    principalDue: 853819.40,
    interest: 34668.49,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 10,
    days: 31,
    date: '14 August 2027',
    balanceOfLoan: 1750672.11,
    principalDue: 862357.59,
    interest: 26130.30,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 11,
    days: 31,
    date: '14 September 2027',
    balanceOfLoan: 879690.94,
    principalDue: 870981.17,
    interest: 17506.72,
    fees: null,
    penalties: null,
    due: 888487.89,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.89
  },
  {
    period: 12,
    days: 30,
    date: '14 October 2027',
    balanceOfLoan: null,
    principalDue: 879690.94,
    interest: 8796.91,
    fees: null,
    penalties: null,
    due: 888487.85,
    paid: null,
    inAdvance: null,
    late: null,
    outstanding: 888487.85
  }
];

function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  placeholder = '',
  className = '',
  id = undefined,
  prefix = undefined
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors duration-200 ${
      isFocused ? 'border-[#1072ba]' : 'border-gray-300'
    } ${className}`}>
      <label
        className={`absolute left-0 pointer-events-none origin-[0] select-none transition-all duration-200 ease-out z-10 ${
          isFloated
            ? '-top-1 text-[11px] ' + (isFocused ? 'text-[#1072ba] font-medium' : (disabled ? 'text-gray-400' : 'text-gray-500'))
            : 'top-3.5 text-xs ' + (disabled ? 'text-gray-400' : 'text-gray-500')
        }`}
      >
        {label}
      </label>
      <div className="flex items-center">
        {prefix && (
          <span className="text-xs text-gray-500 font-medium pr-1.5 pt-0.5 select-none">{prefix}</span>
        )}
        <input
          id={id}
          type={type}
          required={required}
          disabled={disabled}
          placeholder={isFocused && !hasValue ? placeholder : ''}
          value={value ?? ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-xs text-gray-800 outline-none pr-4 pt-0.5 disabled:text-gray-400"
        />
      </div>
    </div>
  );
}

function FloatingSelect({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
  className = '',
  id = undefined
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors duration-200 ${
      isFocused ? 'border-[#1072ba]' : 'border-gray-300'
    } ${className}`}>
      <label
        className={`absolute left-0 pointer-events-none origin-[0] select-none transition-all duration-200 ease-out z-10 ${
          isFloated
            ? '-top-1 text-[11px] ' + (isFocused ? 'text-[#1072ba] font-medium' : (disabled ? 'text-gray-400' : 'text-gray-500'))
            : 'top-3.5 text-xs ' + (disabled ? 'text-gray-400' : 'text-gray-500')
        }`}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <select
          id={id}
          required={required}
          disabled={disabled}
          value={value ?? ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent text-xs outline-none pr-6 pt-0.5 cursor-pointer appearance-none disabled:cursor-not-allowed ${
            disabled ? 'text-gray-400' : (!isFloated ? 'text-transparent' : 'text-gray-800')
          }`}
        >
          {children}
        </select>
        <ChevronDown className={`w-3.5 h-3.5 absolute right-0 pointer-events-none ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
      </div>
    </div>
  );
}

export default function CreateLoanAccountView({
  client,
  loanProducts = [],
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail,
  onSubmitLoanAccount
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTkbFixInstalled, setIsTkbFixInstalled] = useState(false);
  const [isScheduleGenerated, setIsScheduleGenerated] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [consoleModalOpen, setConsoleModalOpen] = useState(false);
  const [consoleCode, setConsoleCode] = useState(`(() => {
  const clean = (body) => {
    if (typeof body !== "string" ||
        !body.includes("allowPartialPeriodInterest")) {
      return body;
    }

    try {
      const data = JSON.parse(body);
      let changed = false;

      for (const key of [
        "allowPartialPeriodInterestCalculation",
        "allowPartialPeriodInterestCalcualtion"
      ]) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          delete data[key];
          changed = true;
        }
      }

      if (changed) {
        console.log("TKB FIX: Removed unsupported parameter");
        return JSON.stringify(data);
      }
    } catch (e) {
      console.error("TKB FIX: Invalid JSON", e);
    }

    return body;
  };

  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body) {
    return originalSend.call(this, clean(body));
  };

  const originalFetch = window.fetch;
  window.fetch = function(input, options) {
    if (options && typeof options.body === "string") {
      options = {...options, body: clean(options.body)};
    }
    return originalFetch.call(this, input, options);
  };

  console.log("TKB FIX: Installed");
})();`);
  const [consoleLogs, setConsoleLogs] = useState([]);

  // Form State begins EMPTY to respect "khong dien truoc du lieu"
  const [formData, setFormData] = useState({
    // Tab 1: DETAILS (Image 2)
    productName: '',
    externalId: '',
    loanOfficer: '',
    loanPurpose: '',
    fund: '',
    submittedOnDate: '',
    disbursementOnDate: '',
    linkSavings: '',
    createStandingInstructions: false,

    // Tab 2: TERMS (Image 3)
    principal: '',
    loanTerm: '',
    loanTermFrequency: 'Months',
    numberOfRepayments: '',
    firstRepaymentOnDate: '',
    interestChargedFromDate: '',
    repaidEvery: '',
    repaidEveryFrequency: 'Months',
    repaidOnSelect: '',
    repaidDaySelect: '',
    nominalInterestRate: '',
    nominalInterestRateFrequency: 'Per year',
    interestMethod: 'Declining Balance',
    amortization: 'Equal installments',
    isEqualAmortization: false,
    loanScheduleType: 'Cumulative',
    repaymentStrategy: 'Interest, Principal, Penalties, Fees Order',
    balloonRepaymentAmount: '',
    interestCalculationPeriod: 'Same as repayment period',
    calculateInterestForExactDaysInPartialPeriod: true,
    arrearsTolerance: '0',
    interestFreePeriod: '',
    graceOnPrincipalPayment: '',
    graceOnInterestPayment: '',
    onArrearsAgeing: '',
    recalculateInterest: 'No'
  });

  // Global console listener for when the user literally pastes the code into F12 DevTools console
  useEffect(() => {
    const handleGlobalFixInstalled = () => {
      setIsTkbFixInstalled(true);
      setScheduleError(null);
    };

    // Check if script is already installed on window
    if (typeof window !== 'undefined' && window.__tkbLoanFixInstalled) {
      setIsTkbFixInstalled(true);
    }

    // Intercept console.log to detect TKB FIX: Installed
    const origLog = console.log;
    console.log = function(...args) {
      origLog.apply(console, args);
      const str = args.map(a => String(a)).join(' ');
      if (str.includes('TKB FIX: Installed') || str.includes('TKB FIX: Removed unsupported parameter')) {
        if (typeof window !== 'undefined') {
          window.__tkbLoanFixInstalled = true;
        }
        setIsTkbFixInstalled(true);
        setScheduleError(null);
        window.dispatchEvent(new CustomEvent('tkb-fix-installed'));
      }
    };

    window.addEventListener('tkb-fix-installed', handleGlobalFixInstalled);
    return () => {
      console.log = origLog;
      window.removeEventListener('tkb-fix-installed', handleGlobalFixInstalled);
    };
  }, []);

  // Practice guide listeners
  useEffect(() => {
    const handleFillDetails = () => {
      setFormData(prev => ({
        ...prev,
        productName: 'TKB Personal Loan',
        externalId: 'TKB-PL-TDU-001',
        loanOfficer: 'Mai, Son',
        loanPurpose: 'Tiêu dùng cá nhân',
        fund: '',
        submittedOnDate: '10/14/2026',
        disbursementOnDate: '10/14/2026',
        linkSavings: '',
        createStandingInstructions: false
      }));
    };

    const handleFillTerms = () => {
      setFormData(prev => ({
        ...prev,
        principal: '10000000',
        loanTerm: '12',
        loanTermFrequency: 'Months',
        numberOfRepayments: '12',
        firstRepaymentOnDate: '11/14/2026',
        repaidEvery: '1',
        repaidEveryFrequency: 'Months',
        nominalInterestRate: '12',
        nominalInterestRateFrequency: 'Per year',
        interestMethod: 'Declining Balance',
        amortization: 'Equal installments',
        isEqualAmortization: false,
        loanScheduleType: 'Cumulative',
        repaymentStrategy: 'Interest, Principal, Penalties, Fees Order',
        interestCalculationPeriod: 'Same as repayment period',
        calculateInterestForExactDaysInPartialPeriod: true,
        arrearsTolerance: '0'
      }));
    };

    const handleApplyFix = () => {
      setIsTkbFixInstalled(true);
      setScheduleError(null);
      if (typeof window !== 'undefined') {
        window.__tkbLoanFixInstalled = true;
      }
    };

    const handleGenerateSchedule = () => {
      setIsTkbFixInstalled(true);
      setScheduleError(null);
      setIsScheduleGenerated(true);
    };

    const handleFillAll = () => {
      handleFillDetails();
      handleFillTerms();
      handleApplyFix();
      handleGenerateSchedule();
    };

    const handleSetStep = (e) => {
      if (e?.detail?.step) {
        setCurrentStep(e.detail.step);
      }
    };

    window.addEventListener('practice-fill-loan-acc-details', handleFillDetails);
    window.addEventListener('practice-fill-loan-acc-terms', handleFillTerms);
    window.addEventListener('practice-apply-tkb-fix', handleApplyFix);
    window.addEventListener('practice-generate-loan-schedule', handleGenerateSchedule);
    window.addEventListener('practice-fill-loan-acc-all', handleFillAll);
    window.addEventListener('practice-set-loan-acc-step', handleSetStep);

    return () => {
      window.removeEventListener('practice-fill-loan-acc-details', handleFillDetails);
      window.removeEventListener('practice-fill-loan-acc-terms', handleFillTerms);
      window.removeEventListener('practice-apply-tkb-fix', handleApplyFix);
      window.removeEventListener('practice-generate-loan-schedule', handleGenerateSchedule);
      window.removeEventListener('practice-fill-loan-acc-all', handleFillAll);
      window.removeEventListener('practice-set-loan-acc-step', handleSetStep);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('loan-acc-form-changed', {
      detail: {
        formData,
        currentStep,
        isTkbFixInstalled,
        isScheduleGenerated,
        consoleModalOpen
      }
    }));
  }, [formData, currentStep, isTkbFixInstalled, isScheduleGenerated, consoleModalOpen]);

  const steps = [
    { id: 1, label: 'DETAILS' },
    { id: 2, label: 'TERMS' },
    { id: 3, label: 'CHARGES' },
    { id: 4, label: 'REPAYMENT SCHEDULE' },
    { id: 5, label: 'PREVIEW' }
  ];

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleGenerateScheduleClick = () => {
    // If TKB FIX is not installed and the partial period interest checkbox is checked, simulate the 400 error!
    if (!isTkbFixInstalled && formData.calculateInterestForExactDaysInPartialPeriod) {
      setScheduleError('Error 400 (Bad Request): The parameter "allowPartialPeriodInterestCalculation" is not supported by the schedule engine. Mở Console (F12) và chạy đoạn script TKB FIX để loại bỏ tham số này!');
      setIsScheduleGenerated(false);
      return;
    }

    setScheduleError(null);
    setIsScheduleGenerated(true);
  };

  const handleRunConsoleScript = () => {
    try {
      if (typeof window !== 'undefined') {
        window.__tkbLoanFixInstalled = true;
      }
      setIsTkbFixInstalled(true);
      setScheduleError(null);
      setConsoleLogs(prev => [
        ...prev,
        { type: 'command', text: consoleCode },
        { type: 'info', text: 'TKB FIX: Installed' }
      ]);
      window.dispatchEvent(new CustomEvent('tkb-fix-installed'));
    } catch (err) {
      setConsoleLogs(prev => [
        ...prev,
        { type: 'error', text: 'Execution error: ' + String(err) }
      ]);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const newLoanAccount = {
      id: String(Date.now()),
      accountNo: '000000001',
      clientId: client?.id || '11',
      clientName: client?.displayName || 'Minh Quang Tran',
      externalId: formData.externalId || 'TKB-PL-TDU-001',
      loanProductName: formData.productName || 'TKB Personal Loan',
      productName: formData.productName || 'TKB Personal Loan',
      loanOfficerName: formData.loanOfficer || 'Mai, Son',
      principal: Number(formData.principal) || 10000000,
      originalLoan: Number(formData.principal) || 10000000,
      loanBalance: Number(formData.principal) || 10000000,
      amountPaid: 0,
      status: 'Submitted and pending approval',
      submittedDate: formData.submittedOnDate || '10/14/2026',
      expectedDisbursementDate: formData.disbursementOnDate || '10/14/2026',
      disbursementDate: null,
      schedule: SAMPLE_REPAYMENT_SCHEDULE
    };

    if (onSubmitLoanAccount) {
      onSubmitLoanAccount(newLoanAccount);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs matching Image 2: Create Loans Account | Home / Clients / Minh Quang Tran / Loans / Create Loans Account */}
      <div className="flex items-center space-x-2.5 mb-5">
        <h1 className="text-xl font-normal text-[#212529]">
          Create Loans Account
        </h1>
        <span className="text-gray-300 font-light text-base">|</span>
        <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5">
          <span 
            onClick={onNavigateHome} 
            className="text-gray-600 hover:underline cursor-pointer"
          >
            Home
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={onNavigateClients} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Clients
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={onNavigateClientDetail} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {client?.displayName || 'Minh Quang Tran'}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Loans</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Create Loans Account</span>
        </div>
      </div>

      {/* 2. Main White Stepper Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-8">
        
        {/* Stepper Header matching Images 2-5 */}
        <div id="tour-loan-acc-stepper" className="relative flex items-center justify-between px-6 pt-1 pb-4">
          <div className="absolute left-10 right-10 top-4.5 h-[1px] bg-gray-300 -z-0" />

          {steps.map((st) => {
            const isCompleted = st.id < currentStep;
            const isCurrent = st.id === currentStep;

            return (
              <div 
                key={st.id} 
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => setCurrentStep(st.id)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-[#28a745] text-white shadow-2xs' 
                    : isCurrent 
                    ? 'bg-[#1072ba] text-white shadow-2xs' 
                    : 'bg-white border-2 border-gray-400 text-gray-500 group-hover:border-gray-500'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : st.id === 4 ? (
                    <Calendar className="w-3.5 h-3.5" />
                  ) : st.id === 5 ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <Pencil className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className={`text-[11px] font-semibold mt-2 tracking-wide uppercase transition-colors ${
                  isCurrent ? 'text-gray-800' : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tab 1: DETAILS (Image 2) */}
        {currentStep === 1 && (
          <form id="tour-loan-acc-details-form" onSubmit={handleNext} className="space-y-6 pt-2">
            <div className="space-y-6">
              {/* Product Name */}
              <div className="w-full md:w-2/3">
                <FloatingSelect
                  id="tour-loan-acc-select-product"
                  label="Product Name *"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="TKB Personal Loan">TKB Personal Loan</option>
                  {loanProducts.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </FloatingSelect>
              </div>

              {/* External id & Loan officer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <FloatingInput
                  id="tour-loan-acc-input-externalid"
                  label="External id"
                  value={formData.externalId}
                  onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                  placeholder="TKB-PL-TDU-001"
                />
                <FloatingSelect
                  id="tour-loan-acc-select-officer"
                  label="Loan officer"
                  value={formData.loanOfficer}
                  onChange={(e) => setFormData({ ...formData, loanOfficer: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Mai, Son">Mai, Son</option>
                  <option value="Dang, Quan">Dang, Quan</option>
                </FloatingSelect>
              </div>

              {/* Loan Purpose & Fund */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <FloatingSelect
                  label="Loan Purpose"
                  value={formData.loanPurpose}
                  onChange={(e) => setFormData({ ...formData, loanPurpose: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Tiêu dùng cá nhân">Tiêu dùng cá nhân (Personal Consumption)</option>
                  <option value="Sửa chữa nhà cửa">Sửa chữa nhà cửa (Home Renovation)</option>
                  <option value="Mua sắm thiết bị">Mua sắm thiết bị gia đình</option>
                </FloatingSelect>
                <FloatingSelect
                  label="Fund"
                  value={formData.fund}
                  onChange={(e) => setFormData({ ...formData, fund: e.target.value })}
                >
                  <option value=""> </option>
                  <option value="Nguồn vốn ngân hàng">Nguồn vốn ngân hàng (Internal Bank Fund)</option>
                </FloatingSelect>
              </div>

              {/* Submitted on & Disbursement on */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                <div className="relative">
                  <FloatingInput
                    id="tour-loan-acc-input-submittedon"
                    label="Submitted on *"
                    required
                    value={formData.submittedOnDate}
                    onChange={(e) => setFormData({ ...formData, submittedOnDate: e.target.value })}
                    placeholder="10/14/2026"
                  />
                  <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-0 bottom-2 pointer-events-none" />
                </div>
                <div className="relative">
                  <FloatingInput
                    id="tour-loan-acc-input-disbursementon"
                    label="Disbursement on *"
                    required
                    value={formData.disbursementOnDate}
                    onChange={(e) => setFormData({ ...formData, disbursementOnDate: e.target.value })}
                    placeholder="10/14/2026"
                  />
                  <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-0 bottom-2 pointer-events-none" />
                </div>
              </div>

              {/* Savings Linkage Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-800">Savings Linkage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                  <FloatingSelect
                    label="Link savings"
                    value={formData.linkSavings}
                    onChange={(e) => setFormData({ ...formData, linkSavings: e.target.value })}
                  >
                    <option value=""> </option>
                    <option value="000000001">000000001 - TKB Current Account</option>
                  </FloatingSelect>
                  <div className="flex items-center space-x-2 pt-4">
                    <input
                      type="checkbox"
                      id="createStandingInstructions"
                      checked={formData.createStandingInstructions}
                      onChange={(e) => setFormData({ ...formData, createStandingInstructions: e.target.checked })}
                      className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="createStandingInstructions" className="text-xs text-gray-700 cursor-pointer select-none">
                      Create standing instructions at disbursement
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                disabled
                className="bg-gray-100 text-gray-400 border border-gray-200 text-xs font-semibold px-5 py-2 rounded-[2px] cursor-not-allowed select-none"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-loan-acc-details-next-btn"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: TERMS (Image 3) */}
        {currentStep === 2 && (
          <form id="tour-loan-acc-terms-form" onSubmit={handleNext} className="space-y-6 pt-2">
            <div className="space-y-6">
              
              {/* Principal */}
              <div className="w-full md:w-2/3">
                <FloatingInput
                  id="tour-loan-acc-input-principal"
                  label="Principal *"
                  required
                  prefix="VND"
                  type="number"
                  value={formData.principal}
                  onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                  placeholder="10000000"
                />
              </div>

              {/* Term Options ? */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-800">Term Options ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                  <FloatingInput
                    id="tour-loan-acc-input-loanterm"
                    label="Loan Term"
                    type="number"
                    value={formData.loanTerm}
                    onChange={(e) => setFormData({ ...formData, loanTerm: e.target.value })}
                    placeholder="12"
                  />
                  <FloatingSelect
                    id="tour-loan-acc-select-termfrequency"
                    label="Frequency *"
                    required
                    value={formData.loanTermFrequency}
                    onChange={(e) => setFormData({ ...formData, loanTermFrequency: e.target.value })}
                  >
                    <option value="Months">Months</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                  </FloatingSelect>
                </div>
              </div>

              {/* Repayments */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-800">Repayments</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FloatingInput
                    id="tour-loan-acc-input-repayments"
                    label="Number of repayments *"
                    required
                    type="number"
                    value={formData.numberOfRepayments}
                    onChange={(e) => setFormData({ ...formData, numberOfRepayments: e.target.value })}
                    placeholder="12"
                  />
                  <div className="relative">
                    <FloatingInput
                      id="tour-loan-acc-input-firstrepayment"
                      label="First repayment on"
                      value={formData.firstRepaymentOnDate}
                      onChange={(e) => setFormData({ ...formData, firstRepaymentOnDate: e.target.value })}
                      placeholder="11/14/2026"
                    />
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-0 bottom-2 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <FloatingInput
                      label="Interest charged from"
                      value={formData.interestChargedFromDate}
                      onChange={(e) => setFormData({ ...formData, interestChargedFromDate: e.target.value })}
                    />
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-0 bottom-2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Repaid Every ? */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-800">Repaid Every ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
                  <FloatingInput
                    label="Repaid every *"
                    required
                    type="number"
                    value={formData.repaidEvery}
                    onChange={(e) => setFormData({ ...formData, repaidEvery: e.target.value })}
                    placeholder="1"
                  />
                  <FloatingSelect
                    label="Frequency"
                    value={formData.repaidEveryFrequency}
                    onChange={(e) => setFormData({ ...formData, repaidEveryFrequency: e.target.value })}
                  >
                    <option value="Months">Months</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                  </FloatingSelect>
                  <FloatingSelect
                    label="Select On"
                    value={formData.repaidOnSelect}
                    onChange={(e) => setFormData({ ...formData, repaidOnSelect: e.target.value })}
                  >
                    <option value=""> </option>
                  </FloatingSelect>
                  <FloatingSelect
                    label="Select Day"
                    value={formData.repaidDaySelect}
                    onChange={(e) => setFormData({ ...formData, repaidDaySelect: e.target.value })}
                  >
                    <option value=""> </option>
                  </FloatingSelect>
                </div>
              </div>

              {/* Nominal interest rate */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-800">Nominal interest rate</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
                  <FloatingInput
                    id="tour-loan-acc-input-rate"
                    label="Nominal interest rate % *"
                    required
                    type="number"
                    value={formData.nominalInterestRate}
                    onChange={(e) => setFormData({ ...formData, nominalInterestRate: e.target.value })}
                    placeholder="12"
                  />
                  <FloatingSelect
                    label="Frequency"
                    value={formData.nominalInterestRateFrequency}
                    onChange={(e) => setFormData({ ...formData, nominalInterestRateFrequency: e.target.value })}
                  >
                    <option value="Per year">Per year</option>
                    <option value="Per month">Per month</option>
                  </FloatingSelect>
                  <FloatingSelect
                    label="Interest method"
                    value={formData.interestMethod}
                    onChange={(e) => setFormData({ ...formData, interestMethod: e.target.value })}
                  >
                    <option value="Declining Balance">Declining Balance</option>
                    <option value="Flat">Flat</option>
                  </FloatingSelect>
                  <FloatingSelect
                    label="Amortization *"
                    value={formData.amortization}
                    onChange={(e) => setFormData({ ...formData, amortization: e.target.value })}
                  >
                    <option value="Equal installments">Equal installments</option>
                  </FloatingSelect>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="isEqualAmortization"
                    checked={formData.isEqualAmortization}
                    onChange={(e) => setFormData({ ...formData, isEqualAmortization: e.target.checked })}
                    className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="isEqualAmortization" className="text-xs text-gray-700 cursor-pointer select-none">
                    Is Equal Amortization?
                  </label>
                </div>
              </div>

              {/* Loan Schedule */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-800">Loan Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Loan Schedule Type</span>
                    <span className="text-xs font-medium text-gray-800">Cumulative</span>
                  </div>
                  <FloatingSelect
                    label="Repayment Strategy *"
                    value={formData.repaymentStrategy}
                    onChange={(e) => setFormData({ ...formData, repaymentStrategy: e.target.value })}
                  >
                    <option value="Interest, Principal, Penalties, Fees Order">Interest, Principal, Penalties, Fees Order</option>
                  </FloatingSelect>
                </div>
                <div className="w-full md:w-1/2 pt-2">
                  <FloatingInput
                    label="Balloon Repayment Amount"
                    value={formData.balloonRepaymentAmount}
                    onChange={(e) => setFormData({ ...formData, balloonRepaymentAmount: e.target.value })}
                  />
                </div>
              </div>

              {/* Interest Calculations */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-800">Interest Calculations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 items-center">
                  <FloatingSelect
                    label="Interest calculation period"
                    value={formData.interestCalculationPeriod}
                    onChange={(e) => setFormData({ ...formData, interestCalculationPeriod: e.target.value })}
                  >
                    <option value="Same as repayment period">Same as repayment period</option>
                    <option value="Daily">Daily</option>
                  </FloatingSelect>

                  <div className="flex items-center space-x-2 pt-3">
                    <input
                      type="checkbox"
                      id="tour-loan-acc-check-partial-interest"
                      checked={formData.calculateInterestForExactDaysInPartialPeriod}
                      onChange={(e) => setFormData({ ...formData, calculateInterestForExactDaysInPartialPeriod: e.target.checked })}
                      className="w-4 h-4 text-[#1072ba] rounded border-gray-300 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="tour-loan-acc-check-partial-interest" className="text-xs text-gray-700 cursor-pointer select-none">
                      Calculate interest for exact days in partial period
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 pt-2">
                  <FloatingInput
                    label="Arrears tolerance"
                    value={formData.arrearsTolerance}
                    onChange={(e) => setFormData({ ...formData, arrearsTolerance: e.target.value })}
                  />
                  <FloatingInput
                    label="Interest free period"
                    value={formData.interestFreePeriod}
                    onChange={(e) => setFormData({ ...formData, interestFreePeriod: e.target.value })}
                  />
                </div>
              </div>

              {/* Moratorium ? */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-800">Moratorium ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FloatingInput
                    label="Grace on principal payment"
                    value={formData.graceOnPrincipalPayment}
                    onChange={(e) => setFormData({ ...formData, graceOnPrincipalPayment: e.target.value })}
                  />
                  <FloatingInput
                    label="Grace on interest payment"
                    value={formData.graceOnInterestPayment}
                    onChange={(e) => setFormData({ ...formData, graceOnInterestPayment: e.target.value })}
                  />
                  <FloatingInput
                    label="On arrears ageing"
                    value={formData.onArrearsAgeing}
                    onChange={(e) => setFormData({ ...formData, onArrearsAgeing: e.target.value })}
                  />
                </div>
              </div>

              {/* Recalculate Interest */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-700">
                <span>Recalculate Interest</span>
                <span className="font-medium text-gray-900">No</span>
              </div>

              {/* Collaterals Data */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-800">Collaterals Data</h3>
                  <button
                    type="button"
                    className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold px-4 py-1.5 rounded-[2px] transition-colors shadow-2xs"
                  >
                    + Add
                  </button>
                </div>
                <div className="border border-gray-200 rounded-[2px] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                      <tr>
                        <th className="py-2.5 px-3 font-normal">Name</th>
                        <th className="py-2.5 px-3 font-normal">Quantity</th>
                        <th className="py-2.5 px-3 font-normal">Total Value</th>
                        <th className="py-2.5 px-3 font-normal">Total Collateral Value</th>
                        <th className="py-2.5 px-3 font-normal text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5} className="py-3 text-center text-gray-400 italic">
                          No collaterals added.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-loan-acc-terms-next-btn"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: CHARGES */}
        {currentStep === 3 && (
          <form id="tour-loan-acc-charges-form" onSubmit={handleNext} className="space-y-6 pt-2">
            <div className="bg-gray-50 p-6 rounded-[2px] border border-gray-200 text-center space-y-2">
              <div className="text-xs font-semibold text-gray-700">Charges (Biểu Phí)</div>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Hồ sơ vay tiêu dùng TKB Personal Loan không áp dụng phí bổ sung nào tại bước tiếp nhận này. Bạn có thể nhấn Next để chuyển sang lập bảng lịch trả nợ (Repayment Schedule).
              </p>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-loan-acc-charges-next-btn"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: REPAYMENT SCHEDULE (Image 4 & Image 5) */}
        {currentStep === 4 && (
          <div id="tour-loan-acc-schedule-card" className="space-y-6 pt-2">
            <div className="text-sm font-semibold text-gray-900 flex items-center justify-between">
              <span>+ REPAYMENT SCHEDULE:</span>
              
              {/* TKB FIX Console Status Indicator */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  id="tour-loan-acc-open-console-btn"
                  onClick={() => setConsoleModalOpen(true)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-[3px] border flex items-center space-x-1.5 transition-colors ${
                    isTkbFixInstalled 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                      : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{isTkbFixInstalled ? 'TKB FIX: Installed' : 'Mở Console F12 (TKB Script Fix)'}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons Header matching Image 4 */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                id="tour-loan-acc-generate-schedule-btn"
                onClick={handleGenerateScheduleClick}
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold px-4 py-2 rounded-[3px] flex items-center space-x-2 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <Calendar className="w-4 h-4" />
                <span>Generate Repayment Schedule</span>
              </button>

              <button
                type="button"
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold px-4 py-2 rounded-[3px] flex items-center space-x-2 transition-colors shadow-2xs cursor-pointer select-none"
              >
                <Download className="w-4 h-4" />
                <span>Export to PDF</span>
              </button>
            </div>

            {/* Error Message if TKB FIX is not run yet */}
            {scheduleError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-[3px] text-xs text-red-700 flex items-start space-x-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Lỗi tạo bảng lịch trả nợ (Mifos API Error 400)</div>
                  <p className="leading-relaxed text-[11px]">
                    Tham số <code className="bg-red-100 px-1 py-0.5 rounded">allowPartialPeriodInterestCalculation</code> không được phiên bản backend hỗ trợ.
                  </p>
                  <p className="leading-relaxed text-[11px]">
                    Hãy mở <strong className="text-gray-900">Console (F12)</strong> và chạy đoạn script <strong>TKB FIX</strong>, hoặc bấm nút <strong className="text-[#1072ba] cursor-pointer underline" onClick={() => setConsoleModalOpen(true)}>Mở Console F12</strong> phía trên để dán và thực thi đoạn script xử lý.
                  </p>
                </div>
              </div>
            )}

            {/* Repayment Schedule Table matching Images 4 & 5 */}
            <div id="tour-loan-acc-schedule-table" className="border border-gray-200 rounded-[2px] overflow-x-auto bg-white">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  {/* Top Header Group */}
                  <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-medium text-center">
                    <th colSpan={4} className="py-2 px-2 border-r border-gray-200"></th>
                    <th className="py-2 px-2 border-r border-gray-200 font-medium">Loan Amount and Balance</th>
                    <th colSpan={4} className="py-2 px-2 border-r border-gray-200 font-medium">Total Cost of Loan</th>
                    <th colSpan={5} className="py-2 px-2 font-medium">Installment Totals</th>
                  </tr>
                  {/* Sub Columns */}
                  <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-medium">
                    <th className="py-2.5 px-2 text-center w-8">#</th>
                    <th className="py-2.5 px-2 text-center w-12">Days</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Paid Date</th>
                    <th className="py-2.5 px-3 text-right">Balance Of Loan</th>
                    <th className="py-2.5 px-3 text-right">Principal Due</th>
                    <th className="py-2.5 px-3 text-right">Interest</th>
                    <th className="py-2.5 px-2 text-right">Fees</th>
                    <th className="py-2.5 px-2 text-right">Penalties</th>
                    <th className="py-2.5 px-3 text-right">Due</th>
                    <th className="py-2.5 px-2 text-right">Paid</th>
                    <th className="py-2.5 px-2 text-right">In advance</th>
                    <th className="py-2.5 px-2 text-right">Late</th>
                    <th className="py-2.5 px-3 text-right">Outstanding</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {!isScheduleGenerated ? (
                    /* Empty Table State matching Image 4 */
                    <tr className="font-bold text-gray-800 bg-white">
                      <td colSpan={4} className="py-3 px-3 text-center">Total</td>
                      <td colSpan={10} className="py-3 px-3"></td>
                    </tr>
                  ) : (
                    /* Generated Table matching Image 5 */
                    <>
                      {/* Row 0: Initial Disbursement Row */}
                      <tr className="text-gray-700 bg-white hover:bg-gray-50/50">
                        <td className="py-2 px-2 text-center"></td>
                        <td className="py-2 px-2 text-center"></td>
                        <td className="py-2 px-3 font-normal text-gray-800">14 October 2026</td>
                        <td className="py-2 px-3"></td>
                        <td className="py-2 px-3 text-right font-normal text-gray-800">10,000,000.00</td>
                        <td colSpan={9} className="py-2 px-3"></td>
                      </tr>

                      {/* Rows 1 to 12 */}
                      {SAMPLE_REPAYMENT_SCHEDULE.map((item, idx) => (
                        <tr 
                          key={item.period} 
                          className={`hover:bg-gray-50/60 transition-colors ${
                            idx % 2 === 1 ? 'bg-gray-50/30' : 'bg-white'
                          }`}
                        >
                          <td className="py-2 px-2 text-center font-medium text-gray-700">{item.period}</td>
                          <td className={`py-2 px-2 text-center font-medium ${idx === 0 ? 'text-[#28a745]' : 'text-gray-700'}`}>
                            {item.days}
                          </td>
                          <td className={`py-2 px-3 font-medium ${idx === 0 ? 'text-[#28a745]' : 'text-gray-800'}`}>
                            {item.date}
                          </td>
                          <td className="py-2 px-3 text-gray-400"></td>
                          <td className="py-2 px-3 text-right font-medium text-gray-700">
                            {item.balanceOfLoan !== null ? item.balanceOfLoan.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-gray-700">
                            {item.principalDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-gray-700">
                            {item.interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-2 text-right text-gray-400"></td>
                          <td className="py-2 px-2 text-right text-gray-400"></td>
                          <td className="py-2 px-3 text-right font-medium text-gray-700">
                            {item.due.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-2 text-right text-gray-400"></td>
                          <td className="py-2 px-2 text-right text-gray-400"></td>
                          <td className="py-2 px-2 text-right text-gray-400"></td>
                          <td className="py-2 px-3 text-right font-medium text-gray-700">
                            {item.outstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}

                      {/* Total Row matching Image 5 */}
                      <tr className="font-bold text-gray-900 bg-gray-50/80 border-t-2 border-gray-200">
                        <td colSpan={4} className="py-2.5 px-3 text-center">Total</td>
                        <td className="py-2.5 px-3 text-right"></td>
                        <td className="py-2.5 px-3 text-right text-gray-900">₫10,000,000.00</td>
                        <td className="py-2.5 px-3 text-right text-gray-900">₫661,854.64</td>
                        <td className="py-2.5 px-2 text-right text-gray-900">₫0.00</td>
                        <td className="py-2.5 px-2 text-right text-gray-900">₫0.00</td>
                        <td className="py-2.5 px-3 text-right text-gray-900">₫10,661,854.64</td>
                        <td className="py-2.5 px-2 text-right"></td>
                        <td className="py-2.5 px-2 text-right"></td>
                        <td className="py-2.5 px-2 text-right"></td>
                        <td className="py-2.5 px-3 text-right text-gray-900">₫0.00</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="button"
                id="tour-loan-acc-schedule-next-btn"
                onClick={handleNext}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: PREVIEW */}
        {currentStep === 5 && (
          <div id="tour-loan-acc-preview-card" className="space-y-6 pt-2">
            <div className="border border-gray-200 rounded-[2px] p-6 space-y-6 bg-white text-xs">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-gray-800 rounded-t-[2px]">
                Rà soát thông tin hồ sơ vay vốn (TKB Personal Loan)
              </div>

              {/* Details Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#1072ba]">Thông Tin Hồ Sơ</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Khách hàng:</span>
                    <span className="font-semibold text-gray-800">{client?.displayName || 'Minh Quang Tran'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Sản phẩm vay:</span>
                    <span className="font-semibold text-[#1072ba]">{formData.productName || 'TKB Personal Loan'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Mã External ID:</span>
                    <span className="font-mono text-gray-700">{formData.externalId || 'TKB-PL-TDU-001'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Cán bộ tín dụng:</span>
                    <span className="text-gray-700">{formData.loanOfficer || 'Mai, Son'}</span>
                  </div>
                </div>
              </div>

              {/* Terms Summary */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-[#1072ba]">Hạn Mức &amp; Lịch Trả Nợ</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Số tiền vay (Principal):</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {Number(formData.principal || 10000000).toLocaleString('en-US')} VND
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Kỳ hạn:</span>
                    <span className="text-gray-800">{formData.loanTerm || 12} Tháng (12 Kỳ)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Lãi suất danh nghĩa:</span>
                    <span className="font-mono font-bold text-emerald-700">{formData.nominalInterestRate || 12}% / Năm</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Số tiền trả góp ước tính:</span>
                    <span className="font-mono font-bold text-blue-700">₫888,487.89 / tháng</span>
                  </div>
                </div>
              </div>

              {/* Schedule Summary */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-[#1072ba]">Tổng Chi Phí Khoản Vay</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Gốc phải trả:</span>
                    <span className="font-mono text-gray-800">10,000,000.00 VND</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Tổng lãi phải trả:</span>
                    <span className="font-mono text-emerald-700">661,854.64 VND</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Tổng phải trả (Total Due):</span>
                    <span className="font-mono font-bold text-gray-900">10,661,854.64 VND</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Trạng thái sau nộp:</span>
                    <span className="font-bold text-amber-700">Submitted and pending approval</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                &larr; Previous
              </button>
              <button
                type="button"
                onClick={onNavigateClientDetail}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold px-5 py-2 rounded-[2px] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                type="button"
                id="tour-loan-acc-submit-btn"
                onClick={handleSubmit}
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-bold px-6 py-2 rounded-[2px] transition-colors shadow-xs cursor-pointer select-none"
              >
                Submit (Nộp hồ sơ vay)
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Simulated DevTools Console (F12) Modal */}
      {consoleModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div 
            id="tour-loan-acc-console-modal"
            className="bg-[#202124] text-[#e8eaed] w-full max-w-2xl rounded-[4px] shadow-2xl border border-[#3c4043] flex flex-col overflow-hidden font-mono text-xs"
          >
            {/* Modal Header */}
            <div className="bg-[#292a2d] px-4 py-2.5 border-b border-[#3c4043] flex items-center justify-between select-none">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#8ab4f8]" />
                <span className="font-semibold text-xs text-[#8ab4f8]">Chrome DevTools &gt; Console (F12)</span>
              </div>
              <button
                type="button"
                id="tour-loan-acc-console-close-btn-top"
                onClick={() => setConsoleModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#3c4043] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instruction description */}
            <div className="px-4 py-2 bg-[#171717] border-b border-[#3c4043] text-[11px] text-gray-400">
              Mifos X Workaround: Đoạn script này hook vào <code className="text-[#8ab4f8]">XMLHttpRequest</code> &amp; <code className="text-[#8ab4f8]">fetch</code> để loại bỏ tham số <code className="text-[#f28b82]">allowPartialPeriodInterestCalculation</code> bị backend từ chối.
            </div>

            {/* Code Editor */}
            <div className="p-4 bg-[#1e1e1e] space-y-2 flex-1 max-h-80 overflow-y-auto">
              <textarea
                value={consoleCode}
                onChange={(e) => setConsoleCode(e.target.value)}
                rows={12}
                className="w-full bg-[#121212] text-[#81c995] font-mono text-[11px] p-3 rounded border border-[#3c4043] outline-none focus:border-[#8ab4f8] resize-none"
              />

              {/* Console Output Log */}
              {consoleLogs.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#3c4043] text-[11px]">
                  {consoleLogs.map((log, idx) => (
                    <div 
                      key={idx}
                      className={log.type === 'error' ? 'text-red-400' : log.type === 'info' ? 'text-emerald-400 font-bold' : 'text-gray-400'}
                    >
                      &gt; {log.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#292a2d] px-4 py-3 border-t border-[#3c4043] flex items-center justify-between">
              <div className="text-[11px] text-gray-400">
                {isTkbFixInstalled ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã thực thi TKB FIX thành công!
                  </span>
                ) : (
                  <span>Nhấn Chạy lệnh để cài đặt hook interceptor</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  id="tour-loan-acc-console-close-btn"
                  onClick={() => setConsoleModalOpen(false)}
                  className="px-3 py-1.5 bg-[#3c4043] hover:bg-[#4a4d51] text-gray-200 text-xs rounded transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  id="tour-loan-acc-console-run-btn"
                  onClick={handleRunConsoleScript}
                  className="px-4 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded transition-colors shadow-xs cursor-pointer"
                >
                  Chạy lệnh (Run Script)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
