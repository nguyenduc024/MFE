import React, { useState, useEffect } from 'react';
import { Menu, ArrowLeft, CheckCircle2, ChevronRight, Calculator, Calendar, DollarSign, Check, Edit3, Play } from 'lucide-react';

/**
 * Format currency with '₫' symbol prefix matching Image 1, 3, 4: "₫1,000,000.00"
 */
function formatVndCurrency(amount) {
  if (amount === undefined || amount === null || amount === '') return '₫0.00';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/,/g, ''));
  if (isNaN(num)) return '₫0.00';
  return `₫${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function FixedDepositDetailView({
  fixedDeposit,
  client,
  onBack,
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail,
  onNavigateApprove,
  onActivateFixedDeposit
}) {
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'chart' | 'transactions' | 'charges' | 'standing'
  const [menuOpen, setMenuOpen] = useState(false);

  const fd = fixedDeposit || {
    accountNo: '000000003',
    productName: 'TKB Fixed Deposit',
    clientName: client?.displayName || 'Minh Quang Tran',
    externalId: 'TKB-FD-TDU-001',
    status: 'Submitted and pending approval',
    activatedOn: 'Not Activated',
    fieldOfficer: 'Unassigned',
    maturityDate: '13 April 2027',
    depositPeriod: '6 Months',
    principal: 1000000,
    maturityAmount: 1022653,
    interestRate: 4.5,
    compoundingPeriod: 'Monthly',
    postingPeriod: 'Monthly',
    interestCalculatedUsing: 'Daily Balance',
    daysInYear: '365 Days',
    balance: 0
  };

  const isApproved = fd.status === 'Approved';
  const isActive = fd.status === 'Active' || fd.status === 'Activated';
  const isPending = !isApproved && !isActive;

  const clientDisplayName = fd.clientName || client?.displayName || 'Minh Quang Tran';
  const accountNo = fd.accountNo || '000000003';
  const productName = fd.productName || 'TKB Fixed Deposit';

  // Listen to practice events
  useEffect(() => {
    const handleOpenMenu = () => setMenuOpen(true);
    const handleApproveEvent = () => {
      setMenuOpen(false);
      if (onNavigateApprove) onNavigateApprove();
    };
    const handleActivateEvent = () => {
      setMenuOpen(false);
      if (onActivateFixedDeposit) onActivateFixedDeposit(fd);
    };

    window.addEventListener('practice-open-fd-menu', handleOpenMenu);
    window.addEventListener('practice-click-fd-approve', handleApproveEvent);
    window.addEventListener('practice-click-fd-activate', handleActivateEvent);

    return () => {
      window.removeEventListener('practice-open-fd-menu', handleOpenMenu);
      window.removeEventListener('practice-click-fd-approve', handleApproveEvent);
      window.removeEventListener('practice-click-fd-activate', handleActivateEvent);
    };
  }, [fd, onNavigateApprove, onActivateFixedDeposit]);

  const handleActivate = () => {
    setMenuOpen(false);
    if (onActivateFixedDeposit) {
      onActivateFixedDeposit(fd);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumb matching Image 1, 3, 4 */}
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
            Fixed Deposits
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">
            {productName} ({accountNo})
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">General</span>
        </div>
      </div>

      {/* 2. Main Account Card */}
      <div id="tour-fd-account-detail-card" className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
        
        {/* Blue Header Banner matching Image 1, 3, 4 */}
        <div className="bg-[#1072ba] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            {/* Piggy Bank Icon with Coin */}
            <div className="w-14 h-14 bg-black/20 rounded-[2px] flex items-center justify-center p-2">
              <svg className="w-10 h-10 text-black fill-current" viewBox="0 0 24 24">
                <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z" />
              </svg>
            </div>

            {/* Title & Status */}
            <div>
              <div className="flex items-center space-x-2">
                {/* Square Status Indicator */}
                <span className={`w-2.5 h-2.5 inline-block rounded-[1px] ${
                  isActive 
                    ? 'bg-[#22c55e]' 
                    : isApproved 
                    ? 'bg-[#3b82f6]' 
                    : 'bg-[#f59e0b]'
                }`} />
                <h2 className="text-base font-semibold tracking-wide text-white">
                  Fixed Deposit Product : {productName} {accountNo}
                </h2>
              </div>

              {/* Subtitle / Approved Badge */}
              <div className="flex items-center space-x-2 mt-1">
                {isApproved && (
                  <span className="bg-[#4f46e5] text-white text-[10px] font-semibold px-2 py-0.5 rounded-[2px] shadow-2xs">
                    Approved
                  </span>
                )}
                <p className="text-xs text-white/90">
                  Client : {clientDisplayName}
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Area: Account Overview & Hamburger Menu */}
          <div className="flex items-center space-x-6">
            {/* Account Overview (Shown in Approved & Active states) */}
            {(isApproved || isActive) && (
              <div className="text-right text-xs">
                <span className="text-[11px] text-white/80 block font-normal mb-1">
                  Account Overview
                </span>
                <div className="flex items-center space-x-4 text-xs">
                  <div>
                    <span className="text-white/70 mr-1.5">Current Balance</span>
                    <span className="font-semibold text-white">
                      {isActive ? formatVndCurrency(fd.balance || 1000000) : '₫0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/70 mr-1.5">Deposit Amount</span>
                    <span className="font-semibold text-white">
                      {formatVndCurrency(fd.principal || 1000000)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Hamburger Menu (≡) */}
            <div className="relative">
              <button
                type="button"
                id="tour-fd-actions-menu"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                title="Account Actions"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 w-44 bg-white text-gray-800 rounded-[2px] shadow-xl border border-gray-100 py-1 z-50 text-xs animate-in fade-in duration-100">
                  {/* Pending Approval Menu Items (Image 1) */}
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
                        id="tour-fd-action-approve"
                        onClick={() => {
                          setMenuOpen(false);
                          if (onNavigateApprove) onNavigateApprove();
                        }}
                        className="px-4 py-2 hover:bg-sky-50 hover:text-[#1072ba] cursor-pointer flex items-center space-x-2 text-gray-700 font-medium"
                      >
                        <Check className="w-3.5 h-3.5 text-gray-600" />
                        <span>Approve</span>
                      </div>
                      <div className="border-t border-gray-100 my-1" />
                      <div className="px-4 py-1.5 text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                        <span>More</span>
                        <span>&rsaquo;</span>
                      </div>
                    </>
                  )}

                  {/* Approved Menu Items (Image 3) */}
                  {isApproved && (
                    <>
                      <div 
                        id="tour-fd-action-activate"
                        onClick={handleActivate}
                        className="px-4 py-2 hover:bg-sky-50 hover:text-[#1072ba] cursor-pointer flex items-center space-x-2 text-gray-700 font-semibold"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Activate</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                      >
                        Undo Approval
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                      >
                        Modify Application
                      </div>
                      <div className="border-t border-gray-100 my-1" />
                      <div className="px-4 py-1.5 text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                        <span>More</span>
                        <span>&rsaquo;</span>
                      </div>
                    </>
                  )}

                  {/* Active Menu Items (Image 4) */}
                  {isActive && (
                    <>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                      >
                        Deposit
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                      >
                        Withdrawal
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                      >
                        Calculate Interest
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                      >
                        Post Interest
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                      >
                        Premature Close
                      </div>
                      <div className="border-t border-gray-100 my-1" />
                      <div className="px-4 py-1.5 text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
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

        {/* Tab Navigation matching Image 1, 3, 4 */}
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

          {/* Transactions Tab (Visible once Active as in Image 4) */}
          {isActive && (
            <button
              type="button"
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
            
            {/* Top Grid: Fixed Deposit Details (Left) & Other Details / Performance History (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Column 1: Fixed Deposit Details Table */}
              <div>
                <h3 className="text-xs font-bold text-gray-800 mb-2">
                  Fixed Deposit Details
                </h3>
                <div className="border border-gray-100 rounded-[2px] divide-y divide-gray-100 text-xs">
                  <div className="flex py-2 px-3 bg-gray-50/50">
                    <span className="w-1/2 text-gray-500">External Id</span>
                    <span className="w-1/2 text-gray-900 font-medium">{fd.externalId || 'TKB-FD-TDU-001'}</span>
                  </div>
                  <div className="flex py-2 px-3">
                    <span className="w-1/2 text-gray-500">Activated On</span>
                    <span className="w-1/2 text-gray-800">
                      {isActive ? '13 October 2026' : (fd.activatedOn || 'Not Activated')}
                    </span>
                  </div>
                  <div className="flex py-2 px-3 bg-gray-50/50">
                    <span className="w-1/2 text-gray-500">Field Officer</span>
                    <span className="w-1/2 text-gray-800">{fd.fieldOfficer || 'Unassigned'}</span>
                  </div>
                  <div className="flex py-2 px-3">
                    <span className="w-1/2 text-gray-500">Maturity Date</span>
                    <span className="w-1/2 text-gray-800">{fd.maturityDate || '13 April 2027'}</span>
                  </div>
                  <div className="flex py-2 px-3 bg-gray-50/50">
                    <span className="w-1/2 text-gray-500">Deposit Period</span>
                    <span className="w-1/2 text-gray-800">{fd.depositPeriod || '6 Months'}</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Other Details (Image 1) OR Performance History (Image 3, 4) */}
              <div>
                <h3 className="text-xs font-bold text-gray-800 mb-2">
                  {isPending ? 'Other Details' : 'Performance History'}
                </h3>
                <div className="border border-gray-100 rounded-[2px] divide-y divide-gray-100 text-xs">
                  <div className="flex justify-between py-2 px-3 bg-gray-50/50">
                    <span className="text-gray-500">Principal Amount</span>
                    <span className="text-gray-900 font-semibold">{formatVndCurrency(fd.principal || 1000000)}</span>
                  </div>
                  <div className="flex justify-between py-2 px-3">
                    <span className="text-gray-500">Maturity Amount</span>
                    <span className="text-gray-900 font-semibold">{formatVndCurrency(fd.maturityAmount || 1022653)}</span>
                  </div>
                  {/* Additional fields present in Image 4 when Active */}
                  {isActive && (
                    <>
                      <div className="flex justify-between py-2 px-3 bg-gray-50/50">
                        <span className="text-gray-500">Total Deposits</span>
                        <span className="text-gray-900 font-semibold">{formatVndCurrency(fd.principal || 1000000)}</span>
                      </div>
                      <div className="flex justify-between py-2 px-3">
                        <span className="text-gray-500">Total Interest Earned</span>
                        <span className="text-gray-900 font-semibold">₫123.00</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Full-width Section: Interest Details */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-gray-800 mb-2">
                Interest Details
              </h3>
              <div className="max-w-md border border-gray-100 rounded-[2px] divide-y divide-gray-100 text-xs">
                <div className="flex py-2 px-3 bg-gray-50/50">
                  <span className="w-3/5 text-gray-500">Interest Rate</span>
                  <span className="w-2/5 text-gray-900 font-semibold">{fd.interestRate ? `${fd.interestRate} %` : '4.5 %'}</span>
                </div>
                <div className="flex py-2 px-3">
                  <span className="w-3/5 text-gray-500">Interest Compounding Period</span>
                  <span className="w-2/5 text-gray-800">{fd.compoundingPeriod || 'Monthly'}</span>
                </div>
                <div className="flex py-2 px-3 bg-gray-50/50">
                  <span className="w-3/5 text-gray-500">Interest Posting Period</span>
                  <span className="w-2/5 text-gray-800">{fd.postingPeriod || 'Monthly'}</span>
                </div>
                <div className="flex py-2 px-3">
                  <span className="w-3/5 text-gray-500">Interest Calculated Using</span>
                  <span className="w-2/5 text-gray-800">{fd.interestCalculatedUsing || 'Daily Balance'}</span>
                </div>
                <div className="flex py-2 px-3 bg-gray-50/50">
                  <span className="w-3/5 text-gray-500">No. of Days in Year</span>
                  <span className="w-2/5 text-gray-800">{fd.daysInYear || '365 Days'}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab Content: INTEREST RATE CHART */}
        {activeTab === 'chart' && (
          <div className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-800">
              Interest Rate Chart: TKB FD VND Interest Rates 2026 (From: 9/1/2026)
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
                  <tr>
                    <td className="py-2 px-4">1 - 3 Months</td>
                    <td className="py-2 px-4 text-gray-500">-</td>
                    <td className="py-2 px-4 text-center font-medium">3.5%</td>
                    <td className="py-2 px-4 text-gray-600">FD 3M - 3.5% p.a.</td>
                  </tr>
                  <tr className="bg-sky-50 font-medium">
                    <td className="py-2 px-4 text-[#1072ba] font-bold">4 - 6 Months [Applied]</td>
                    <td className="py-2 px-4 text-gray-500">-</td>
                    <td className="py-2 px-4 text-center text-[#1072ba] font-bold">4.5%</td>
                    <td className="py-2 px-4 text-gray-700">FD 6M - 4.5% p.a.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">7 - 9 Months</td>
                    <td className="py-2 px-4 text-gray-500">-</td>
                    <td className="py-2 px-4 text-center font-medium">5.0%</td>
                    <td className="py-2 px-4 text-gray-600">FD 9M - 5.0% p.a.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">10 - 12 Months</td>
                    <td className="py-2 px-4 text-gray-500">-</td>
                    <td className="py-2 px-4 text-center font-medium">5.5%</td>
                    <td className="py-2 px-4 text-gray-600">FD 12M - 5.5% p.a.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: TRANSACTIONS (Image 4) */}
        {activeTab === 'transactions' && (
          <div className="p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-800">
              Account Transactions
            </h3>
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
                  <tr>
                    <td className="py-2.5 px-4 font-mono">1</td>
                    <td className="py-2.5 px-4">13 October 2026</td>
                    <td className="py-2.5 px-4 font-medium text-emerald-700">Deposit (Account Activation)</td>
                    <td className="py-2.5 px-4 text-right text-gray-400">-</td>
                    <td className="py-2.5 px-4 text-right font-semibold text-emerald-600">₫1,000,000.00</td>
                    <td className="py-2.5 px-4 text-right font-semibold text-gray-900">₫1,000,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: CHARGES */}
        {activeTab === 'charges' && (
          <div className="p-8 text-center text-xs text-gray-500">
            No charges are associated with this fixed deposit account.
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
