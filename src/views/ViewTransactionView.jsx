import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function ViewTransactionView({
  transaction,
  navigate
}) {
  const tx = transaction || {
    id: 'a2f68debe1a7',
    officeName: 'Takashimaya Bank (TKB) - HO',
    transactionDate: '12 October 2026',
    createdBy: 'mifos',
    submittedOn: '12 October 2026 00:00:00',
    entries: [
      {
        id: '57',
        type: 'LIABILITY',
        accountCode: '220301',
        accountName: 'Accrued Operating Expenses Payable',
        debit: '',
        credit: 'VND 5,000,000.00'
      },
      {
        id: '58',
        type: 'EXPENSE',
        accountCode: '530101',
        accountName: 'Operating Expense',
        debit: 'VND 5,000,000.00',
        credit: ''
      }
    ]
  };

  const transactionId = tx.id || 'a2f68debe1a7';

  return (
    <div id="tour-view-transaction-screen" className="max-w-6xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* 1. Header & Breadcrumbs matching media_1792412162752_c0706601.png exactly */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Left: Title & Breadcrumbs */}
        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            {transactionId}
          </h1>
          <span className="text-gray-300 font-light text-base">|</span>
          <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5 flex-wrap">
            <span
              onClick={() => navigate && navigate('home')}
              className="text-gray-600 hover:underline cursor-pointer"
            >
              Home
            </span>
            <span className="text-gray-400">/</span>
            <span
              onClick={() => navigate && navigate('accounting')}
              className="text-[#1072ba] hover:underline cursor-pointer"
            >
              Accounting
            </span>
            <span className="text-gray-400">/</span>
            <span
              onClick={() => navigate && navigate('accounting-journal')}
              className="text-[#1072ba] hover:underline cursor-pointer"
            >
              Journal Entries
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Transactions</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">{transactionId}</span>
          </div>
        </div>

        {/* Right: Revert Transaction Button */}
        <button
          type="button"
          onClick={() => {
            if (navigate) navigate('accounting-journal');
          }}
          className="bg-[#1072ba] hover:bg-[#0e63a3] text-white text-xs font-medium px-4 py-2 rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] flex items-center space-x-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Revert Transaction</span>
        </button>
      </div>

      {/* 2. Top Card: Transaction Metadata */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <span className="text-gray-600">Office</span>
            <span className="font-normal text-gray-900">{tx.officeName || 'Takashimaya Bank (TKB) - HO'}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="text-gray-600">Transaction Date</span>
            <span className="font-normal text-gray-900">{tx.transactionDate || '12 October 2026'}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="text-gray-600">Created By</span>
            <span className="font-normal text-gray-900">{tx.createdBy || 'mifos'}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="text-gray-600">Submitted on</span>
            <span className="font-normal text-gray-900">{tx.submittedOn || '12 October 2026 00:00:00'}</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Card: Journal Entries Table */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 font-medium">
              <th className="py-3.5 px-6 font-medium">Entry ID</th>
              <th className="py-3.5 px-6 font-medium">Type</th>
              <th className="py-3.5 px-6 font-medium">Account Code</th>
              <th className="py-3.5 px-6 font-medium">Account Name</th>
              <th className="py-3.5 px-6 text-right font-medium">Debit</th>
              <th className="py-3.5 px-6 text-right font-medium">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/60 transition-colors">
              <td className="py-3.5 px-6 font-normal text-gray-800">57</td>
              <td className="py-3.5 px-6 font-normal text-gray-800">LIABILITY</td>
              <td className="py-3.5 px-6 font-normal text-gray-800">220301</td>
              <td className="py-3.5 px-6 font-normal text-gray-800">Accrued Operating Expenses Payable</td>
              <td className="py-3.5 px-6 text-right font-normal text-gray-800"></td>
              <td className="py-3.5 px-6 text-right font-normal text-gray-800">VND 5,000,000.00</td>
            </tr>
            <tr className="bg-gray-50/50 hover:bg-gray-100/60 transition-colors">
              <td className="py-3.5 px-6 font-normal text-gray-800">58</td>
              <td className="py-3.5 px-6 font-normal text-gray-800">EXPENSE</td>
              <td className="py-3.5 px-6 font-normal text-gray-800">530101</td>
              <td className="py-3.5 px-6 font-normal text-gray-800">Operating Expense</td>
              <td className="py-3.5 px-6 text-right font-normal text-gray-800">VND 5,000,000.00</td>
              <td className="py-3.5 px-6 text-right font-normal text-gray-800"></td>
            </tr>
          </tbody>
        </table>

        {/* Centered Back Button (Disabled non-interactive as requested) */}
        <div className="flex justify-center p-6 bg-white border-t border-gray-100 cursor-not-allowed">
          <button
            type="button"
            disabled
            className="bg-[#1072ba] text-white text-xs font-medium px-8 py-2 rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] cursor-not-allowed pointer-events-none opacity-80"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
