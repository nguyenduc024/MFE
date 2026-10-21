import React, { useState } from 'react';
import { 
  Menu, ArrowUp, ArrowDown, Lock, Calculator, ArrowRight, ChevronRight, X
} from 'lucide-react';

/**
 * Format date string to Mifos display format: DD MMMM YYYY (e.g. "13 October 2026")
 */
function formatDisplayDate(dateVal, fallback = '13 October 2026') {
  if (!dateVal) return fallback;

  // Handle YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
    const [year, month, day] = dateVal.split('-');
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (!isNaN(d.getTime())) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  // Handle MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateVal)) {
    const [month, day, year] = dateVal.split('/');
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (!isNaN(d.getTime())) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  return dateVal;
}

/**
 * Format currency with 'đ' symbol prefix matching Mifos screenshot: "đ0.00" or "đ5,000,000.00"
 */
function formatMifosCurrency(amount) {
  if (amount === undefined || amount === null || amount === '' || Number(amount) === 0) {
    return 'đ0.00';
  }
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/,/g, ''));
  if (isNaN(num)) return 'đ0.00';
  return `đ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SavingsDetailView({ 
  savings, 
  initialTab = 'general',
  onBack, 
  onNavigateHome, 
  onNavigateClients, 
  onNavigateDeposit,
  onNavigateWithdraw 
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'general', 'transactions', 'charges', 'documents', 'notes', 'standing'
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!savings) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center text-gray-500 font-sans">
        No savings account selected.
      </div>
    );
  }

  const clientName = savings.clientName || 'Minh Quang Tran';
  const productName = savings.productName || 'TKB Current Account';
  const accountNo = savings.accountNo || '000000001';
  const balance = savings.balance !== null && savings.balance !== undefined ? savings.balance : 0;
  const transactions = savings.transactions || (balance > 0 ? [
    {
      id: '1',
      date: savings.lastActive || '2026-10-13',
      transactionType: 'Deposit',
      amount: balance,
      credit: balance,
      debit: null,
      balanceAfter: balance,
      paymentType: 'Money Transfer',
      desc: 'Initial CASA deposit via external bank transfer. TKB-CASA-DEP-001.'
    }
  ] : []);

  // Compute total deposits and withdrawals
  const totalDeposits = transactions
    .filter(t => t.transactionType === 'Deposit' || t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + (Number(t.amount) || Number(t.credit) || 0), 0) || (balance > 0 ? balance : 0);

  const totalWithdrawals = transactions
    .filter(t => t.transactionType === 'Withdrawal' || t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + (Number(t.amount) || Number(t.debit) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumb matching Image 1 & Image 3 */}
      <div className="flex items-center space-x-2.5 mb-4">
        <h1 className="text-xl font-normal text-[#212529]">
          {activeTab === 'transactions' ? 'Transactions' : 'General'}
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
            onClick={onBack} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {clientName}
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={onBack} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Savings
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={() => setActiveTab('general')} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {productName} ({accountNo})
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">
            {activeTab === 'transactions' ? 'Transactions' : 'General'}
          </span>
        </div>
      </div>

      {/* 2. Main Blue Banner Card matching Image 1 & Image 2 */}
      <div className="bg-[#1072ba] text-white rounded-t-[3px] p-6 shadow-sm relative">
        <div className="flex items-start justify-between">
          
          {/* Left: Money Hand Silhouette badge & Product info */}
          <div className="flex items-start space-x-5">
            <div className="w-14 h-14 bg-white/10 rounded-[2px] flex items-center justify-center border border-white/20 p-2">
              <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-3.74-1.47-3.74-3.18 0-1.61 1.25-2.85 2.67-3.21V5h2.67v1.51c1.54.34 2.76 1.39 2.91 3.09h-1.99c-.16-.86-.74-1.45-2.25-1.45-1.39 0-2.31.6-2.31 1.48 0 .82.59 1.34 2.61 1.83 2.64.64 3.8 1.49 3.8 3.26 0 1.54-1.12 2.87-2.74 3.37z" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#28a745] inline-block rounded-[1px]" />
                <h2 className="text-sm font-bold text-white tracking-normal">
                  Savings Product : {productName} {accountNo}
                </h2>
              </div>
              <div className="text-xs text-white/90">
                Client Name: {clientName}
              </div>
            </div>
          </div>

          {/* Right: Account Overview & Hamburger Action Menu matching Image 1 & 2 */}
          <div className="flex items-start space-x-6">
            <div id="tour-savings-account-overview" className="text-right text-xs text-white space-y-1">
              <div className="font-semibold text-white/90 tracking-wide text-[11px]">
                Account Overview
              </div>
              <div className="space-x-1.5">
                <span className="text-white/80">Current Balance</span>
                <span className="font-bold text-white text-xs">{formatMifosCurrency(balance)}</span>
              </div>
              <div className="space-x-1.5">
                <span className="text-white/80">Available Balance</span>
                <span className="font-bold text-white text-xs">{formatMifosCurrency(balance)}</span>
              </div>
            </div>

            {/* Hamburger button matching Image 1 & 2 */}
            <div className="relative">
              <button
                type="button"
                id="tour-savings-action-menu"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
                title="Savings Actions"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>

              {/* Dropdown Menu matching Image 2 */}
              {menuOpen && (
                <div className="absolute right-0 top-8 w-52 bg-white text-gray-800 rounded-[2px] shadow-xl border border-gray-100 py-1 z-50 text-xs animate-in fade-in duration-100 font-sans">
                  {/* Deposit */}
                  <div 
                    id="tour-savings-menu-deposit"
                    onClick={() => {
                      setMenuOpen(false);
                      if (onNavigateDeposit) onNavigateDeposit();
                    }}
                    className="px-4 py-2 hover:bg-sky-50 hover:text-[#1072ba] cursor-pointer flex items-center space-x-2.5 font-normal border-b border-gray-100"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
                    <span>Deposit</span>
                  </div>

                  {/* Block Deposit */}
                  <div className="px-4 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center space-x-2.5 font-normal">
                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Block Deposit</span>
                  </div>

                  {/* Withdrawal */}
                  <div 
                    id="tour-savings-menu-withdraw"
                    onClick={() => {
                      setMenuOpen(false);
                      if (onNavigateWithdraw) onNavigateWithdraw();
                    }}
                    className="px-4 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center space-x-2.5 font-normal"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-gray-500" />
                    <span>Withdrawal</span>
                  </div>

                  {/* Block Withdrawal */}
                  <div className="px-4 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center space-x-2.5 font-normal">
                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Block Withdrawal</span>
                  </div>

                  {/* Block Account */}
                  <div className="px-4 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center space-x-2.5 font-normal">
                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Block Account</span>
                  </div>

                  {/* Hold Amount */}
                  <div className="px-4 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center space-x-2.5 font-normal">
                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Hold Amount</span>
                  </div>

                  {/* Calculate Interest */}
                  <div className="px-4 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center space-x-2.5 font-normal border-t border-gray-100">
                    <Calculator className="w-3.5 h-3.5 text-gray-500" />
                    <span>Calculate Interest</span>
                  </div>

                  {/* Post Interest As On */}
                  <div className="px-4 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center space-x-2.5 font-normal">
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                    <span>Post Interest As On</span>
                  </div>

                  {/* More */}
                  <div className="px-4 py-1.5 hover:bg-gray-50 text-gray-700 cursor-pointer flex items-center justify-between font-normal border-t border-gray-100">
                    <span>More</span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 3. Navigation Tabs matching Image 1: General | Transactions | Charges | Documents | Notes | Standing Instructions */}
      <div className="bg-[#f8f9fa] border-x border-b border-gray-200 px-6 flex items-center space-x-8 text-xs select-none">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`py-3 transition-colors ${
            activeTab === 'general'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-semibold'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          General
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`py-3 transition-colors ${
            activeTab === 'transactions'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-semibold'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Transactions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('charges')}
          className={`py-3 transition-colors ${
            activeTab === 'charges'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-semibold'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Charges
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`py-3 transition-colors ${
            activeTab === 'documents'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-semibold'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Documents
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`py-3 transition-colors ${
            activeTab === 'notes'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-semibold'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Notes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('standing')}
          className={`py-3 transition-colors ${
            activeTab === 'standing'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-semibold'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Standing Instructions
        </button>
      </div>

      {/* 4. Tab Content: General matching Image 1 */}
      {activeTab === 'general' && (
        <div className="bg-white border-x border-b border-gray-200 p-6 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            
            {/* Left Column: Savings Details matching Image 1 */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-800">
                Savings Details
              </h3>
              
              <div className="border border-gray-200 rounded-[2px] divide-y divide-gray-100 text-xs">
                <div className="grid grid-cols-12 py-2 px-3 bg-white">
                  <span className="col-span-5 text-gray-600">External Id</span>
                  <span className="col-span-7 font-normal text-gray-900">{savings.externalId || 'Not Provided'}</span>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 bg-[#fafafa]">
                  <span className="col-span-5 text-gray-600">Activated On</span>
                  <span className="col-span-7 font-normal text-gray-900">{formatDisplayDate(savings.openedDate || savings.lastActive, '13 October 2026')}</span>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 bg-white">
                  <span className="col-span-5 text-gray-600">Field Officer</span>
                  <span className="col-span-7 font-normal text-gray-900">{savings.staffName || 'Unassigned'}</span>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 bg-[#fafafa]">
                  <span className="col-span-5 text-gray-600">Currency</span>
                  <span className="col-span-7 font-normal text-gray-900">Vietnamese Dong [VND]</span>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 bg-white">
                  <span className="col-span-5 text-gray-600">Nominal Interest Rate</span>
                  <span className="col-span-7 font-normal text-gray-900">{savings.interestRate || '0%'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Account Summary matching Image 1 */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-800">
                Account Summary
              </h3>

              <div className="border border-gray-200 rounded-[2px] divide-y divide-gray-100 text-xs">
                <div className="grid grid-cols-12 py-2 px-3 bg-white">
                  <span className="col-span-7 text-gray-600">Interest Earned Not Posted</span>
                  <span className="col-span-5 font-normal text-gray-900 text-right">đ0.00</span>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 bg-[#fafafa]">
                  <span className="col-span-7 text-gray-600">Interest Compounding Period</span>
                  <span className="col-span-5 font-normal text-gray-900">Daily</span>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 bg-white">
                  <span className="col-span-7 text-gray-600">Interest Posting Period</span>
                  <span className="col-span-5 font-normal text-gray-900">Monthly</span>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 bg-[#fafafa]">
                  <span className="col-span-7 text-gray-600">Interest Calculated Using</span>
                  <span className="col-span-5 font-normal text-gray-900">Daily Balance</span>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 bg-white">
                  <span className="col-span-7 text-gray-600">Days in Year</span>
                  <span className="col-span-5 font-normal text-gray-900">365 Days</span>
                </div>
                <div className="grid grid-cols-12 py-2 px-3 bg-[#fafafa]">
                  <span className="col-span-7 text-gray-600">Last Active Transaction Date</span>
                  <span className="col-span-5 font-normal text-gray-900">{formatDisplayDate(savings.lastActive, '13 October 2026')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Section: Performance History matching Image 1 */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold text-gray-800">
              Performance History
            </h3>
            <div className="w-full h-[1px] bg-gray-200" />
            <div className="border border-gray-200 rounded-[2px] divide-y divide-gray-100 text-xs">
              <div className="grid grid-cols-12 py-2 px-3 bg-white">
                <span className="col-span-6 text-gray-600">Total Deposits</span>
                <span className="col-span-6 font-normal text-gray-900 text-right">
                  {formatMifosCurrency(totalDeposits)}
                </span>
              </div>
              {totalWithdrawals > 0 && (
                <div className="grid grid-cols-12 py-2 px-3 bg-[#fafafa]">
                  <span className="col-span-6 text-gray-600">Total Withdrawals</span>
                  <span className="col-span-6 font-normal text-gray-900 text-right">
                    {formatMifosCurrency(totalWithdrawals)}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 5. Tab Content: Transactions matching Image 3 */}
      {activeTab === 'transactions' && (
        <div id="tour-savings-transactions-tab-content" className="bg-white border-x border-b border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-800">
              All Transactions
            </h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-1.5 text-xs text-gray-600 cursor-pointer select-none">
                <input type="checkbox" className="rounded-[2px] border-gray-300 text-[#1072ba]" />
                <span>Hide Reversed</span>
              </label>
              <label className="flex items-center space-x-1.5 text-xs text-gray-600 cursor-pointer select-none">
                <input type="checkbox" className="rounded-[2px] border-gray-300 text-[#1072ba]" />
                <span>Hide Accruals</span>
              </label>
              <button
                type="button"
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-4 py-1.5 rounded-[3px] shadow-2xs transition-colors cursor-pointer select-none"
              >
                Export
              </button>
            </div>
          </div>

          <div id="tour-savings-transactions-table" className="overflow-x-auto border border-gray-200 rounded-[2px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                <tr>
                  <th className="py-2.5 px-3 font-normal">#</th>
                  <th className="py-2.5 px-3 font-normal">Id</th>
                  <th className="py-2.5 px-3 font-normal">Transaction Date</th>
                  <th className="py-2.5 px-3 font-normal">External Id</th>
                  <th className="py-2.5 px-3 font-normal">Transaction Type</th>
                  <th className="py-2.5 px-3 font-normal text-right">Debit</th>
                  <th className="py-2.5 px-3 font-normal text-right">Credit</th>
                  <th className="py-2.5 px-3 font-normal text-right">Balance</th>
                  <th className="py-2.5 px-3 font-normal text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length > 0 ? (
                  transactions.map((t, idx) => {
                    const isWithdrawal = t.type === 'WITHDRAWAL' || t.transactionType === 'Withdrawal';
                    const debitVal = isWithdrawal ? (t.debit || t.amount) : null;
                    const creditVal = !isWithdrawal ? (t.credit || t.amount) : null;
                    const balanceVal = t.balanceAfter !== undefined ? t.balanceAfter : balance;

                    return (
                      <tr key={t.id || idx} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 text-gray-600">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono text-gray-700">{t.id}</td>
                        <td className="py-2.5 px-3 text-gray-800">{formatDisplayDate(t.date || t.transactionDate, '13 October 2026')}</td>
                        <td className="py-2.5 px-3 text-gray-400">{t.externalId || ''}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800">{t.transactionType || t.type}</td>
                        <td className="py-2.5 px-3 font-mono text-right text-gray-800">
                          {debitVal ? Number(debitVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right text-gray-800">
                          {creditVal ? Number(creditVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right text-gray-900 font-medium">
                          {Number(balanceVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-center text-gray-500 cursor-pointer hover:text-gray-800">
                          ⋮
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-400">
                      No transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar matching Image 3 */}
          <div className="flex items-center justify-end space-x-6 text-xs text-gray-500 pt-2 select-none">
            <div className="flex items-center space-x-2">
              <span>Items per page:</span>
              <span className="font-medium text-gray-700">50</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div>
              1-{transactions.length || 0} of {transactions.length || 0}
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="cursor-pointer hover:text-gray-600">&lt;&lt;</span>
              <span className="cursor-pointer hover:text-gray-600">&lt;</span>
              <span className="cursor-pointer hover:text-gray-600">&gt;</span>
              <span className="cursor-pointer hover:text-gray-600">&gt;&gt;</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Authentic Mifos System Footer matching screenshot */}
      <div className="pt-16 pb-6 text-center text-[11px] text-gray-400 space-y-1 select-none font-sans">
        <div className="flex items-center justify-center space-x-6">
          <span>Mifos 250331-</span>
          <span>Fineract 1.16.0-SNAPSHOT</span>
        </div>
        <div>http://192.168.56.101:8080</div>
        <div className="text-gray-500 font-medium">Mifos X by Mifos</div>
      </div>

    </div>
  );
}
