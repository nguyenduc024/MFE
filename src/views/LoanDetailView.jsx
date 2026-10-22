import React, { useState, useEffect } from 'react';
import { 
  Menu, ChevronRight, Check, X, Plus, Pencil, 
  ArrowLeft, Calendar, DollarSign, ChevronLeft
} from 'lucide-react';
import { SAMPLE_REPAYMENT_SCHEDULE } from './CreateLoanAccountView';

function formatCurrency(amount) {
  if (amount === undefined || amount === null || amount === '') return '₫0.00';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/,/g, ''));
  if (isNaN(num)) return String(amount);
  return '₫' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function LoanDetailView({
  loan,
  client,
  onBack,
  onNavigateApprove,
  onNavigateDisburse,
  onNavigateHome,
  onNavigateClients
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpenMenu = () => {
      setMenuOpen(true);
    };
    window.addEventListener('practice-open-loan-actions-menu', handleOpenMenu);
    return () => window.removeEventListener('practice-open-loan-actions-menu', handleOpenMenu);
  }, []);

  if (!loan) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 text-center text-gray-500 font-sans">
        No loan account selected.
      </div>
    );
  }

  const clientDisplayName = client?.displayName || client?.name || loan.clientName || 'Minh Quang Tran';
  const clientAccountNo = client?.accountNo || client?.id || '000000011';
  const isPending = loan.status?.toLowerCase().includes('pending') || loan.status?.toLowerCase().includes('submitted');
  const isApproved = loan.status?.toLowerCase().includes('approved') && !loan.status?.toLowerCase().includes('pending');
  const isActive = loan.status?.toLowerCase().includes('active') || Boolean(loan.disbursementDate && loan.disbursementDate !== 'Not Available');

  const subTabs = [
    { id: 'general', label: 'General' },
    { id: 'account-details', label: 'Account Details' },
    { id: 'repayment-schedule', label: 'Repayment Schedule' },
    { id: 'transactions', label: 'Transactions' },
    ...(isActive ? [{ id: 'delinquency-tags', label: 'Delinquency Tags' }] : []),
    { id: 'loan-collateral', label: 'Loan Collateral Details' },
    { id: 'term-variations', label: 'Term Variations' },
    { id: 'loan-documents', label: 'Loan Documents' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 font-sans text-gray-800 select-none">
      {/* 1. Header & Breadcrumbs matching Image 1 / Image 5 */}
      <div className="flex items-center space-x-2.5 mb-5">
        <h1 className="text-xl font-normal text-gray-800 capitalize">{activeTab}</h1>
        <div className="h-4 w-px bg-gray-300" />
        <div className="text-xs text-gray-500 flex items-center space-x-1.5 font-normal">
          <button 
            type="button" 
            onClick={onNavigateHome} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button 
            type="button" 
            onClick={onNavigateClients} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Clients
          </button>
          <span>/</span>
          <button 
            type="button" 
            onClick={onBack} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {clientDisplayName}
          </button>
          <span>/</span>
          <span className="text-[#1072ba]">Loans</span>
          <span>/</span>
          <span className="text-[#1072ba]">
            {loan.productName || 'TKB Personal Loan'} ({loan.accountNo})
          </span>
          <span>/</span>
          <span className="text-gray-700 capitalize">{activeTab}</span>
        </div>
      </div>

      {/* 2. Blue Loan Header Banner matching Image 1 & Image 5 */}
      <div 
        id="tour-loan-detail-banner"
        className="bg-[#1072ba] text-white rounded-[2px] shadow-sm relative overflow-visible"
      >
        <div className="px-6 py-5 flex items-start justify-between">
          {/* Left: Hand holding coin icon + titles */}
          <div className="flex items-center space-x-5">
            {/* Hand with coin icon matching image */}
            <div className="w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 text-white fill-current" viewBox="0 0 64 64">
                <circle cx="32" cy="18" r="14" fill="#0b548b" />
                <text x="32" y="24" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">$</text>
                <path d="M10 44 L26 38 C29 37 33 39 36 41 L44 46 C46 47 48 45 46 43 L36 34 C33 31 29 31 26 33 L10 40 Z" fill="white" />
                <path d="M10 46 L30 54 C34 56 40 54 44 50 L58 36 C60 34 58 30 54 31 L44 34 L32 26 C28 23 23 24 20 27 L10 36 Z" fill="#094470" />
              </svg>
            </div>

            <div className="space-y-1">
              {/* Product Name with status indicator square */}
              <div className="flex items-center space-x-2 text-sm font-semibold">
                <span 
                  className={`w-2.5 h-2.5 inline-block rounded-[1px] ${
                    isPending ? 'bg-[#f59e0b]' : isApproved ? 'bg-[#38bdf8]' : 'bg-[#28a745]'
                  }`} 
                />
                <span>Loan Product : {loan.productName || 'TKB Personal Loan'} {loan.accountNo}</span>
              </div>

              {/* Client Name */}
              <div className="text-xs text-sky-100 font-normal">
                Client Name : {clientDisplayName} ({clientAccountNo})
              </div>
            </div>
          </div>

          {/* Right: Account Overview if Active + Actions Hamburger Menu */}
          <div className="flex items-start space-x-6">
            {isActive && (
              <div id="tour-loan-active-overview" className="text-right text-xs space-y-1 pr-2">
                <div className="text-[11px] font-semibold text-sky-100 uppercase tracking-wide">
                  Account Overview
                </div>
                <div className="flex items-center justify-end space-x-3 text-xs">
                  <span className="text-sky-200">Current Balance</span>
                  <span className="font-semibold text-white">{formatCurrency(loan.currentBalance || 10661854.64)}</span>
                </div>
                <div className="flex items-center justify-end space-x-3 text-xs">
                  <span className="text-sky-200">Arrears By</span>
                  <span className="font-semibold text-white">{formatCurrency(0)}</span>
                </div>
              </div>
            )}

            {/* Hamburger Action Menu matching Image 1 & Image 2 */}
            <div className="relative">
              <button
                id="tour-loan-actions-menu-btn"
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                title="Loan Actions"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>

              {/* Dropdown Menu matching Image 2 */}
              {menuOpen && (
                <div 
                  id="tour-loan-actions-dropdown"
                  className="absolute right-0 top-8 bg-white text-gray-800 rounded-[2px] shadow-xl border border-gray-200 py-1 z-50 text-xs w-48 animate-in fade-in duration-100"
                >
                  {isPending && (
                    <>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-500" />
                        <span>Add Loan Charge</span>
                      </div>
                      <div 
                        id="tour-loan-action-approve-btn"
                        onClick={() => {
                          setMenuOpen(false);
                          if (onNavigateApprove) onNavigateApprove();
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-800 font-semibold bg-sky-50/60"
                      >
                        <Check className="w-3.5 h-3.5 text-gray-700 font-bold" />
                        <span>Approve</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <Pencil className="w-3.5 h-3.5 text-gray-500" />
                        <span>Modify Application</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <X className="w-3.5 h-3.5 text-gray-500" />
                        <span>Reject</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-700 border-t border-gray-100"
                      >
                        <span>More</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    </>
                  )}

                  {isApproved && (
                    <>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-500" />
                        <span>Add Loan Charge</span>
                      </div>
                      <div 
                        id="tour-loan-action-disburse-btn"
                        onClick={() => {
                          setMenuOpen(false);
                          if (onNavigateDisburse) onNavigateDisburse();
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-800 font-semibold bg-sky-50/60"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                        <span>Disburse</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <Pencil className="w-3.5 h-3.5 text-gray-500" />
                        <span>Modify Application</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <X className="w-3.5 h-3.5 text-gray-500" />
                        <span>Withdrawn by Client</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-700 border-t border-gray-100"
                      >
                        <span>More</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    </>
                  )}

                  {isActive && (
                    <>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                        <span>Make Repayment</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-500" />
                        <span>Add Loan Charge</span>
                      </div>
                      <div 
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-700 border-t border-gray-100"
                      >
                        <span>More</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-tabs bar matching Image 1 / Image 5 */}
      <div className="bg-white border-b border-gray-200 mt-2 flex items-center text-xs overflow-x-auto shadow-2xs">
        <button 
          type="button" 
          className="p-3 text-gray-400 hover:text-gray-600 border-r border-gray-100 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        {subTabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 font-normal text-xs whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                isSelected 
                  ? 'border-[#1072ba] text-gray-900 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        <button 
          type="button" 
          className="p-3 text-gray-400 hover:text-gray-600 border-l border-gray-100 cursor-pointer ml-auto"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Tab Content Area */}
      <div className="bg-white border border-t-0 border-gray-200 p-6 space-y-6 rounded-b-[2px]">
        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* If Active: Performance History card matching Image 5 */}
            {isActive && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-800">
                  Performance History
                </h3>
                <div className="border border-gray-200 rounded-[2px] p-4 bg-white flex items-center justify-between text-xs text-gray-700">
                  <div>
                    <span className="text-gray-600">Number of Repayments : </span>
                    <span className="font-semibold text-gray-900">12.00</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Maturity Date : </span>
                    <span className="font-semibold text-gray-900">14 October 2027</span>
                  </div>
                </div>
              </div>
            )}

            {/* If Active: Loan Summary Table matching Image 5 */}
            {isActive && (
              <div id="tour-loan-summary-card" className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-800">
                  Loan Summary
                </h3>
                <div className="border border-gray-200 rounded-[2px] overflow-x-auto bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                      <tr>
                        <th className="py-2 px-3 font-normal"></th>
                        <th className="py-2 px-3 font-normal text-right">Original</th>
                        <th className="py-2 px-3 font-normal text-right">Paid</th>
                        <th className="py-2 px-3 font-normal text-right">Waived</th>
                        <th className="py-2 px-3 font-normal text-right">Written Off</th>
                        <th className="py-2 px-3 font-normal text-right">Outstanding</th>
                        <th className="py-2 px-3 font-normal text-right">Over Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">Principal</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(10000000)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right font-medium">{formatCurrency(10000000)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">Interest</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(661854.64)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right font-medium">{formatCurrency(661854.64)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">Fees</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right font-medium">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium text-gray-800">Penalties</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right font-medium">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                      </tr>
                      <tr className="bg-gray-50/70 font-semibold text-gray-900 border-t border-gray-200">
                        <td className="py-2 px-3 font-semibold">Total</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(10661854.64)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(10661854.64)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section: Loan Details Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-800">
                Loan Details
              </h3>
              <div className="border border-gray-200 rounded-[2px] overflow-hidden bg-white">
                <table className="w-full text-left text-xs divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600 w-1/3">Disbursement Date</td>
                      <td className="py-2.5 px-4 text-gray-800 font-medium">
                        {isActive ? '14 October 2026' : (loan.disbursementDate || 'Not Available')}
                      </td>
                    </tr>
                    {isActive && (
                      <tr>
                        <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Loan Purpose</td>
                        <td className="py-2.5 px-4 text-gray-800">Not Available</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Currency</td>
                      <td className="py-2.5 px-4 text-gray-800">Vietnamese Dong VND</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Loan Officer</td>
                      <td className="py-2.5 px-4 text-gray-800 font-medium">{loan.loanOfficerName || 'Mai, Son'}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">External Id</td>
                      <td className="py-2.5 px-4 text-gray-800 font-mono">{loan.externalId || 'TKB-PL-TDU-001'}</td>
                    </tr>
                    {isActive && (
                      <>
                        <tr>
                          <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Proposed Amount</td>
                          <td className="py-2.5 px-4 text-gray-800 font-medium">10000000</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Approved Amount</td>
                          <td className="py-2.5 px-4 text-gray-800 font-medium">10000000</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Disburse Amount</td>
                          <td className="py-2.5 px-4 text-gray-800 font-medium">10000000</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section: Loan Purpose Table (Image 1 - if pending) */}
            {!isActive && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-800">
                  Loan Purpose
                </h3>
                <div className="border border-gray-200 rounded-[2px] overflow-hidden bg-white">
                  <table className="w-full text-left text-xs divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600 w-1/3">Loan Purpose:</td>
                        <td className="py-2.5 px-4 text-gray-800">Not Provided</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Proposed Amount:</td>
                        <td className="py-2.5 px-4 text-gray-800 font-semibold">{formatCurrency(loan.principal || 10000000)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Approved Amount:</td>
                        <td className="py-2.5 px-4 text-gray-800 font-semibold">{formatCurrency(loan.principal || 10000000)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Disburse Amount:</td>
                        <td className="py-2.5 px-4 text-gray-800 font-semibold">{formatCurrency(loan.principal || 10000000)}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 bg-gray-50/60 text-gray-600">Arrears By:</td>
                        <td className="py-2.5 px-4 text-gray-800">Not Provided</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Repayment Schedule */}
        {activeTab === 'repayment-schedule' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-800">
              Repayment Schedule (12 Kỳ Trả Nợ)
            </h3>
            <div className="border border-gray-200 rounded-[2px] overflow-x-auto bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                  <tr>
                    <th className="py-2.5 px-3 font-normal">#</th>
                    <th className="py-2.5 px-3 font-normal">Days</th>
                    <th className="py-2.5 px-3 font-normal">Date</th>
                    <th className="py-2.5 px-3 font-normal text-right">Balance of loan</th>
                    <th className="py-2.5 px-3 font-normal text-right">Principal Due</th>
                    <th className="py-2.5 px-3 font-normal text-right">Interest</th>
                    <th className="py-2.5 px-3 font-normal text-right">Total Due</th>
                    <th className="py-2.5 px-3 font-normal text-right">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SAMPLE_REPAYMENT_SCHEDULE.map((row) => (
                    <tr 
                      key={row.period} 
                      className={row.period === 1 ? 'bg-emerald-50/50 text-emerald-800 font-semibold' : 'hover:bg-gray-50'}
                    >
                      <td className="py-2 px-3">{row.period}</td>
                      <td className="py-2 px-3">{row.days}</td>
                      <td className="py-2 px-3">{row.date}</td>
                      <td className="py-2 px-3 text-right">{row.balanceOfLoan ? row.balanceOfLoan.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}</td>
                      <td className="py-2 px-3 text-right">{row.principalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{row.interest.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{row.due.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right">{row.outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50/80 font-bold border-t border-gray-200 text-gray-900">
                    <td colSpan={4} className="py-2.5 px-3 text-left">Total</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(10000000)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(661854.64)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(10661854.64)}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Transactions */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-800">
              Transactions
            </h3>
            {isActive ? (
              <div className="border border-gray-200 rounded-[2px] overflow-hidden bg-white">
                <table className="w-full text-left text-xs divide-y divide-gray-200">
                  <thead className="bg-[#f8f9fa] text-gray-500 font-normal">
                    <tr>
                      <th className="py-2.5 px-4 font-normal">ID</th>
                      <th className="py-2.5 px-4 font-normal">Office</th>
                      <th className="py-2.5 px-4 font-normal">Transaction Date</th>
                      <th className="py-2.5 px-4 font-normal">Transaction Type</th>
                      <th className="py-2.5 px-4 font-normal text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 px-4 font-mono">1</td>
                      <td className="py-2.5 px-4">Thu Duc Transaction Office</td>
                      <td className="py-2.5 px-4">14 October 2026</td>
                      <td className="py-2.5 px-4 font-medium text-emerald-700">Disbursement</td>
                      <td className="py-2.5 px-4 text-right font-semibold">{formatCurrency(10000000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No transactions recorded yet.</p>
            )}
          </div>
        )}

        {/* Other Tabs */}
        {activeTab !== 'general' && activeTab !== 'repayment-schedule' && activeTab !== 'transactions' && (
          <div className="py-8 text-center text-xs text-gray-500">
            Tab content for {activeTab} is currently not populated.
          </div>
        )}
      </div>
    </div>
  );
}
