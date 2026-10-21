import React, { useState, useEffect } from 'react';
import { Menu, ArrowLeft, ArrowUp, ArrowDown, CheckCircle2, ChevronRight, Calculator, Calendar, DollarSign, Check, Edit3, Play, Undo2 } from 'lucide-react';

/**
 * Format currency with '₫' symbol prefix matching Image 1, 3: "₫500,000.00", "₫6,000,000.00"
 */
function formatVndCurrency(amount) {
  if (amount === undefined || amount === null || amount === '') return '₫0.00';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/,/g, ''));
  if (isNaN(num)) return '₫0.00';
  return `₫${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function RecurringDepositDetailView({
  recurringDeposit,
  client,
  onBack,
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail,
  onNavigateApprove,
  onActivateRecurringDeposit,
  onNavigateDeposit
}) {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'chart' | 'transactions' | 'charges' | 'standing'
  const [menuOpen, setMenuOpen] = useState(false);

  const rd = recurringDeposit || {
    accountNo: '000000004',
    productName: 'TKB Goal Savings',
    clientName: client?.displayName || 'Lan Ngoc Pham',
    externalId: 'TKB-RD-TDU-002',
    status: 'Submitted and pending approval',
    activatedOn: '',
    fieldOfficer: 'Unassigned',
    maturityDate: '13 October 2027',
    depositPeriod: '12 Months',
    depositFrequency: '1 Months',
    mandatoryDeposit: true,
    depositAmount: 500000,
    principal: 6000000,
    maturityAmount: 6131646,
    interestRate: 4.0,
    compoundingPeriod: 'Monthly',
    postingPeriod: 'Monthly',
    interestCalculatedUsing: 'Daily Balance',
    daysInYear: '365 Days',
    balance: 0,
    hasDeposited: false
  };

  const isApproved = rd.status === 'Approved';
  const isActive = rd.status === 'Active' || rd.status === 'Activated';
  const isPending = !isApproved && !isActive;

  const clientDisplayName = rd.clientName || client?.displayName || 'Lan Ngoc Pham';
  const accountNo = rd.accountNo || '000000004';
  const productName = rd.productName || 'TKB Goal Savings';

  // Listen to practice events
  useEffect(() => {
    const handleOpenMenu = () => setMenuOpen(true);
    const handleApproveEvent = () => {
      setMenuOpen(false);
      if (onNavigateApprove) onNavigateApprove();
    };
    const handleActivateEvent = () => {
      setMenuOpen(false);
      if (onActivateRecurringDeposit) onActivateRecurringDeposit(rd);
    };
    const handleDepositEvent = () => {
      setMenuOpen(false);
      if (onNavigateDeposit) onNavigateDeposit();
    };

    window.addEventListener('practice-open-rd-menu', handleOpenMenu);
    window.addEventListener('practice-click-rd-approve', handleApproveEvent);
    window.addEventListener('practice-click-rd-activate', handleActivateEvent);
    window.addEventListener('practice-click-rd-deposit', handleDepositEvent);

    return () => {
      window.removeEventListener('practice-open-rd-menu', handleOpenMenu);
      window.removeEventListener('practice-click-rd-approve', handleApproveEvent);
      window.removeEventListener('practice-click-rd-activate', handleActivateEvent);
      window.removeEventListener('practice-click-rd-deposit', handleDepositEvent);
    };
  }, [rd, onNavigateApprove, onActivateRecurringDeposit, onNavigateDeposit]);

  const handleActivate = () => {
    setMenuOpen(false);
    if (onActivateRecurringDeposit) {
      onActivateRecurringDeposit(rd);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumb matching Image 1 & 3 */}
      <div className="flex items-center space-x-2.5 mb-4">
        <h1 className="text-xl font-normal text-[#212529]">
          General
        </h1>
        <span className="text-gray-300 font-light text-base">|</span>
        <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5 flex-wrap">
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
            id="tour-rd-breadcrumb-client"
            onClick={onNavigateClientDetail} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {clientDisplayName}
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={onNavigateClientDetail} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Recurring Deposits
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-[#1072ba] hover:underline cursor-pointer">
            4
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">General</span>
        </div>
      </div>

      {/* 2. Main Account Card matching Image 1 & 3 */}
      <div id="tour-rd-account-detail-card" className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
        
        {/* Blue Header Banner matching Image 1 & 3 */}
        <div className="bg-[#1072ba] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            {/* Clock & Coins Icon matching Image 1 & 3 */}
            <div className="w-14 h-14 bg-black/20 rounded-[2px] flex items-center justify-center p-2">
              <svg className="w-10 h-10 text-white fill-current opacity-90" viewBox="0 0 24 24">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
            </div>

            {/* Title & Status */}
            <div>
              <div className="flex items-center space-x-2">
                {/* Square Status Indicator:
                    - Pending: Orange (Image 1)
                    - Approved: Purple / Indigo (Image 3)
                    - Active: Green (Image 4)
                */}
                <span className={`w-2.5 h-2.5 inline-block rounded-[1px] ${
                  isActive 
                    ? 'bg-[#28a745]' 
                    : isApproved 
                    ? 'bg-[#6366f1]' 
                    : 'bg-[#f59e0b]'
                }`} />
                <h2 className="text-base font-semibold tracking-wide text-white">
                  Recurring Deposit : {productName} {accountNo}
                </h2>
              </div>

              {/* Subtitle matching Image 1 & 3 */}
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-xs text-white/90">
                  Client Name: {clientDisplayName}
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Area: Account Overview & Hamburger Menu */}
          <div className="flex items-center space-x-6">
            {/* Account Overview (Shown in Approved & Active states matching Image 1 & 3) */}
            {(isApproved || isActive) && (
              <div className="text-right text-xs">
                <span className="text-[11px] text-white/80 block font-normal mb-1">
                  Account Overview
                </span>
                <div className="flex items-center space-x-6 text-xs">
                  <div 
                    id="tour-rd-account-overview-balance"
                    className={`inline-flex items-center ${
                      (rd.hasDeposited || Number(rd.balance) > 0)
                        ? 'border-2 border-red-500 px-1.5 py-0.5 rounded-[1px] bg-red-500/10'
                        : ''
                    }`}
                  >
                    <span className="text-white/70 mr-2">Current Balance</span>
                    <span className="font-semibold text-white">
                      {formatVndCurrency(rd.balance || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/70 mr-2">Deposit Amount</span>
                    <span className="font-semibold text-white">
                      ₫6,000,000.00
                    </span>
                  </div>
                  <div>
                    <span className="text-white/70 mr-2">Deposit Period</span>
                    <span className="font-semibold text-white">
                      12
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Hamburger Menu (≡) */}
            <div className="relative">
              <button
                type="button"
                id="tour-rd-actions-menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                title="Account Actions"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 w-44 bg-white text-gray-800 rounded-[2px] shadow-xl border border-gray-100 py-1 z-50 text-xs animate-in fade-in duration-100">
                  {/* Pending Approval Menu Items matching Image 1 */}
                  {isPending && (
                    <>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                        <span>Modify Application</span>
                      </div>
                      <div 
                        id="tour-rd-action-approve"
                        onClick={() => {
                          setMenuOpen(false);
                          if (onNavigateApprove) onNavigateApprove();
                        }}
                        className="px-4 py-2 hover:bg-sky-50 hover:text-[#1072ba] cursor-pointer flex items-center space-x-2 text-gray-800 font-medium border-2 border-red-500 m-1 rounded-[1px]"
                      >
                        <Check className="w-3.5 h-3.5 text-gray-700" />
                        <span>Approve</span>
                      </div>
                      <div className="border-t border-gray-100 my-1" />
                      <div className="px-4 py-1.5 text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                        <span>More</span>
                        <span>&rsaquo;</span>
                      </div>
                    </>
                  )}

                  {/* Approved Menu Items matching Image 3 */}
                  {isApproved && (
                    <>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <Undo2 className="w-3.5 h-3.5 text-gray-500" />
                        <span>Undo Approval</span>
                      </div>
                      <div 
                        id="tour-rd-action-activate"
                        onClick={handleActivate}
                        className="px-4 py-2 hover:bg-sky-50 hover:text-[#1072ba] cursor-pointer flex items-center space-x-2 text-gray-800 font-semibold border-2 border-red-500 m-1 rounded-[1px]"
                      >
                        <Check className="w-3.5 h-3.5 text-gray-700" />
                        <span>Activate</span>
                      </div>
                    </>
                  )}

                  {/* Active Menu Items matching Image 1 */}
                  {isActive && (
                    <>
                      <div 
                        id="tour-rd-action-deposit"
                        onClick={() => {
                          setMenuOpen(false);
                          if (onNavigateDeposit) onNavigateDeposit();
                        }}
                        className="px-3.5 py-2 hover:bg-sky-50 hover:text-[#1072ba] cursor-pointer flex items-center space-x-2.5 text-gray-800 font-medium border-2 border-red-500 m-1 rounded-[1px]"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-gray-700" />
                        <span>Deposit</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-3.5 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2.5 text-gray-700"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-gray-500" />
                        <span>Withdrawal</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-3.5 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2.5 text-gray-700"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
                        <span>Premature Close</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-3.5 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2.5 text-gray-700"
                      >
                        <Calculator className="w-3.5 h-3.5 text-gray-500" />
                        <span>Calculate Interest</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-3.5 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2.5 text-gray-700"
                      >
                        <Undo2 className="w-3.5 h-3.5 text-gray-500" />
                        <span>Undo Activation</span>
                      </div>
                      <div className="border-t border-gray-100 my-1" />
                      <div className="px-3.5 py-1.5 text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                        <span>More</span>
                        <span>&rsaquo;</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation matching Image 1 & 3 */}
        <div className="bg-[#f8f9fa] border-b border-gray-200 px-6 flex items-center space-x-8 text-xs font-normal">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
                : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
            }`}
          >
            General
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('chart')}
            className={`py-3 transition-colors cursor-pointer ${
              activeTab === 'chart'
                ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
                : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
            }`}
          >
            Interest Rate Chart
          </button>

          {(isApproved || isActive) && (
            <button
              type="button"
              id="tour-rd-tab-transactions"
              onClick={() => setActiveTab('transactions')}
              className={`py-3 transition-colors cursor-pointer ${
                activeTab === 'transactions'
                  ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
                  : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
              }`}
            >
              Transactions
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('charges')}
            className={`py-3 transition-colors cursor-pointer ${
              activeTab === 'charges'
                ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
                : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
            }`}
          >
            Charges
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standing')}
            className={`py-3 transition-colors cursor-pointer ${
              activeTab === 'standing'
                ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
                : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
            }`}
          >
            Standing Instructions
          </button>
        </div>

        {/* Tab Content: GENERAL */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            
            {/* Top Grid:
                - Image 1 (Pending): Simple two-column table without big headers
                - Image 3 (Approved / Active): Account Details (Left) & Performance History (Right)
            */}
            {isPending ? (
              /* LAYOUT MATCHING IMAGE 1 (Pending Approval) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Column 1 matching Image 1 */}
                <div className="border border-gray-100 rounded-[2px] divide-y divide-gray-100 text-xs">
                  <div className="flex py-2 px-3 bg-gray-50/50">
                    <span className="w-1/2 text-gray-500">External Id</span>
                    <span className="w-1/2 text-gray-900 font-medium">TKB-RD-TDU-002</span>
                  </div>
                  <div className="flex py-2 px-3">
                    <span className="w-1/2 text-gray-500">Date of Deposit</span>
                    <span className="w-1/2 text-gray-800">13 October 2026</span>
                  </div>
                  <div className="flex py-2 px-3 bg-gray-50/50">
                    <span className="w-1/2 text-gray-500">Period</span>
                    <span className="w-1/2 text-gray-800">12 Months</span>
                  </div>
                  <div className="flex py-2 px-3">
                    <span className="w-1/2 text-gray-500">Maturity Date</span>
                    <span className="w-1/2 text-gray-800">13 October 2027</span>
                  </div>
                  <div className="flex py-2 px-3 bg-gray-50/50">
                    <span className="w-1/2 text-gray-500">Total Deposits</span>
                    <span className="w-1/2 text-gray-800 font-medium">₫0.00</span>
                  </div>
                  <div className="flex py-2 px-3">
                    <span className="w-1/2 text-gray-500">Actual Available Balance</span>
                    <span className="w-1/2 text-gray-800 font-medium">₫0.00</span>
                  </div>
                  <div className="flex py-2 px-3 bg-gray-50/50">
                    <span className="w-1/2 text-gray-500">Recurring Deposit Amount</span>
                    <span className="w-1/2 text-gray-900 font-semibold">₫500,000.00</span>
                  </div>
                </div>

                {/* Column 2 matching Image 1 */}
                <div className="border border-gray-100 rounded-[2px] divide-y divide-gray-100 text-xs">
                  <div className="flex justify-between py-2 px-3 bg-gray-50/50">
                    <span className="text-gray-500">Principal Amount</span>
                    <span className="text-gray-900 font-semibold">₫6,000,000.00</span>
                  </div>
                  <div className="flex justify-between py-2 px-3">
                    <span className="text-gray-500">Rate of Interest</span>
                    <span className="text-gray-900 font-semibold">4.00 %</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-gray-50/50">
                    <span className="text-gray-500">Maturity Amount</span>
                    <span className="text-gray-900 font-semibold">₫6,131,646.00</span>
                  </div>
                  <div className="flex justify-between py-2 px-3">
                    <span className="text-gray-500">Total Withdrawals</span>
                    <span className="text-gray-800 font-medium">₫0.00</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-gray-50/50">
                    <span className="text-gray-500">Deposits Frequency</span>
                    <span className="text-gray-800 font-medium">1 Months</span>
                  </div>
                </div>
              </div>
            ) : (
              /* LAYOUT MATCHING IMAGE 3 (Approved / Active) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Column 1: Account Details */}
                <div>
                  <h3 className="text-xs font-bold text-gray-800 mb-2">
                    Account Details
                  </h3>
                  <div className="border border-gray-100 rounded-[2px] divide-y divide-gray-100 text-xs">
                    <div className="flex py-2 px-3 bg-gray-50/50">
                      <span className="w-1/2 text-gray-500">External Id</span>
                      <span className="w-1/2 text-gray-900 font-medium">TKB-RD-TDU-002</span>
                    </div>
                    <div className="flex py-2 px-3">
                      <span className="w-1/2 text-gray-500">Field Officer</span>
                      <span className="w-1/2 text-gray-800">Unassigned</span>
                    </div>
                    <div className="flex py-2 px-3 bg-gray-50/50">
                      <span className="w-1/2 text-gray-500">Activation date</span>
                      <span className="w-1/2 text-gray-800">
                        {isActive ? '13 October 2026' : ''}
                      </span>
                    </div>
                    <div className="flex py-2 px-3">
                      <span className="w-1/2 text-gray-500">Maturity Date</span>
                      <span className="w-1/2 text-gray-800">13 October 2027</span>
                    </div>
                    <div className="flex py-2 px-3 bg-gray-50/50">
                      <span className="w-1/2 text-gray-500">Deposit Frequency</span>
                      <span className="w-1/2 text-gray-800">1 Months</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Performance History matching Image 3 */}
                <div>
                  <h3 className="text-xs font-bold text-gray-800 mb-2">
                    Performance History
                  </h3>
                  <div className="border border-gray-100 rounded-[2px] divide-y divide-gray-100 text-xs">
                    <div className="flex justify-between py-2 px-3 bg-gray-50/50">
                      <span className="text-gray-500">Principal Amount</span>
                      <span className="text-gray-900 font-semibold">₫6,000,000.00</span>
                    </div>
                    <div className="flex justify-between py-2 px-3">
                      <span className="text-gray-500">Maturity Amount</span>
                      <span className="text-gray-900 font-semibold">₫6,131,646.00</span>
                    </div>
                    <div className="flex justify-between py-2 px-3 bg-gray-50/50">
                      <span className="text-gray-500">Recurring Deposit Amount</span>
                      <span className="text-gray-900 font-semibold">₫500,000.00</span>
                    </div>
                    <div className="flex justify-between py-2 px-3">
                      <span className="text-gray-500">Deposits till Date</span>
                      <span className="text-gray-900 font-semibold">
                        {formatVndCurrency(rd.depositsTillDate ?? (rd.hasDeposited || Number(rd.balance) > 0 ? 500000 : 0))}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 px-3 bg-gray-50/50">
                      <span className="text-gray-500">Interest Earned</span>
                      <span className="text-gray-900 font-semibold">
                        {formatVndCurrency(rd.interestEarned ?? (rd.hasDeposited || Number(rd.balance) > 0 ? 55 : 0))}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 px-3">
                      <span className="text-gray-500">Withdrawals till Date</span>
                      <span className="text-gray-900 font-medium">₫0.00</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Full-width Section: Interest Details matching Image 1 & 3 */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-gray-800 mb-2">
                Interest Details
              </h3>
              <div className="max-w-md border border-gray-100 rounded-[2px] divide-y divide-gray-100 text-xs">
                {(!isPending) && (
                  <div className="flex py-2 px-3 bg-gray-50/50">
                    <span className="w-3/5 text-gray-500">Interest Rate</span>
                    <span className="w-2/5 text-gray-900 font-semibold">4.00 %</span>
                  </div>
                )}
                <div className="flex py-2 px-3">
                  <span className="w-3/5 text-gray-500">Interest Compounding Period</span>
                  <span className="w-2/5 text-gray-800">Monthly</span>
                </div>
                <div className="flex py-2 px-3 bg-gray-50/50">
                  <span className="w-3/5 text-gray-500">Interest Posting Period</span>
                  <span className="w-2/5 text-gray-800">Monthly</span>
                </div>
                <div className="flex py-2 px-3">
                  <span className="w-3/5 text-gray-500">Interest calculated using</span>
                  <span className="w-2/5 text-gray-800">Daily Balance</span>
                </div>
                <div className="flex py-2 px-3 bg-gray-50/50">
                  <span className="w-3/5 text-gray-500">Days in Year</span>
                  <span className="w-2/5 text-gray-800">365 Days</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab Content: INTEREST RATE CHART */}
        {activeTab === 'chart' && (
          <div className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-800">
              Interest Rate Chart: TKB Goal Savings Interest 2026 (From: 10/13/2026)
            </h3>
            <div className="border border-gray-200 rounded-[2px] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Period</th>
                    <th className="py-2.5 px-4 font-semibold">Amount Range</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Interest (% p.a.)</th>
                    <th className="py-2.5 px-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-sky-50 font-medium">
                    <td className="py-2 px-4 text-[#1072ba] font-bold">1 - 12 Months [Applied]</td>
                    <td className="py-2 px-4 text-gray-500">-</td>
                    <td className="py-2 px-4 text-center text-[#1072ba] font-bold">4.00%</td>
                    <td className="py-2 px-4 text-gray-700">Goal Savings 12M - 4.0% p.a.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: TRANSACTIONS matching Image 1 & 3 */}
        {activeTab === 'transactions' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800">
                Transactions
              </h3>
            </div>
            <div className="border border-gray-200 rounded-[2px] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">ID</th>
                    <th className="py-2.5 px-4 font-semibold">Transaction Date</th>
                    <th className="py-2.5 px-4 font-semibold">Transaction Type</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Debit</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Credit</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(rd.hasDeposited || Number(rd.balance) > 0) ? (
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-700">1</td>
                      <td className="py-2 px-4 text-gray-700">13 October 2026</td>
                      <td className="py-2 px-4 font-medium text-gray-900">Deposit</td>
                      <td className="py-2 px-4 text-right text-gray-500">-</td>
                      <td className="py-2 px-4 text-right font-medium text-emerald-700">₫500,000.00</td>
                      <td className="py-2 px-4 text-right font-semibold text-gray-900">₫500,000.00</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-400">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: CHARGES */}
        {activeTab === 'charges' && (
          <div className="p-8 text-center text-xs text-gray-500">
            No charges are associated with this recurring deposit account.
          </div>
        )}

        {/* Tab Content: STANDING INSTRUCTIONS */}
        {activeTab === 'standing' && (
          <div className="p-8 text-center text-xs text-gray-500">
            No standing instructions configured for this account.
          </div>
        )}

      </div>

    </div>
  );
}
