import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function DisburseLoanView({
  loan,
  client,
  onDisburse,
  onCancel,
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail
}) {
  const [disbursedOn, setDisbursedOn] = useState('10/14/2026');
  const [transactionAmount, setTransactionAmount] = useState('10,000,000.00');
  const [externalId, setExternalId] = useState(loan?.externalId || 'TKB-PL-TDU-001');
  const [paymentType, setPaymentType] = useState('Money Transfer');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [note, setNote] = useState('TKB Personal Loan - Full Disbursement');

  const clientDisplayName = client?.displayName || client?.name || loan?.clientName || 'Minh Quang Tran';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onDisburse) {
      onDisburse({
        disbursedOn,
        transactionAmount,
        externalId,
        paymentType,
        note
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 font-sans text-gray-800 select-none">
      {/* 1. Header & Breadcrumbs matching Image 4 */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-gray-800">Disburse</h1>
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
            onClick={onNavigateClientDetail} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {clientDisplayName}
          </button>
          <span>/</span>
          <span className="text-[#1072ba]">Loans</span>
          <span>/</span>
          <span className="text-gray-700">Disburse</span>
        </div>
      </div>

      {/* 2. White Card with Form Fields matching Image 4 */}
      <div 
        id="tour-loan-disburse-card"
        className="bg-white rounded-[2px] shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Disbursed On */}
          <div className="relative pt-3.5 pb-1 border-b border-gray-300 focus-within:border-[#1072ba] transition-colors">
            <label className="absolute -top-1 left-0 text-[11px] text-gray-500 font-medium">
              Disbursed On *
            </label>
            <div className="flex items-center justify-between">
              <input
                id="tour-loan-disburse-date-input"
                type="text"
                required
                value={disbursedOn}
                onChange={(e) => setDisbursedOn(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-800 outline-none pt-0.5"
              />
              <Calendar className="w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Transaction Amount */}
          <div className="relative pt-3.5 pb-1 border-b border-gray-300 bg-gray-50/70 px-2 rounded-t-[2px]">
            <label className="absolute -top-1 left-2 text-[11px] text-gray-500 font-medium">
              Transaction Amount *
            </label>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700 font-semibold">VND</span>
              <input
                type="text"
                disabled
                value={transactionAmount}
                className="text-right bg-transparent text-xs text-gray-800 outline-none font-medium"
              />
            </div>
          </div>

          {/* External Id */}
          <div className="relative pt-3.5 pb-1 border-b border-gray-300 focus-within:border-[#1072ba] transition-colors">
            <label className="absolute -top-1 left-0 text-[11px] text-gray-500 font-medium">
              External Id
            </label>
            <input
              type="text"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-800 outline-none pt-0.5 font-medium"
            />
          </div>

          {/* Payment Type */}
          <div className="relative pt-3.5 pb-1 border-b border-gray-300 focus-within:border-[#1072ba] transition-colors">
            <label className="absolute -top-1 left-0 text-[11px] text-gray-500 font-medium">
              Payment Type
            </label>
            <div className="relative flex items-center">
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-800 outline-none pt-0.5 cursor-pointer appearance-none"
              >
                <option value="Money Transfer">Money Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
            </div>
          </div>

          {/* Show Payment Details toggle */}
          <div className="flex items-center space-x-3 pt-1">
            <button
              type="button"
              onClick={() => setShowPaymentDetails(!showPaymentDetails)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                showPaymentDetails ? 'bg-[#1072ba]' : 'bg-gray-300'
              }`}
            >
              <span 
                className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform ${
                  showPaymentDetails ? 'left-4.5' : 'left-0.75'
                }`} 
              />
            </button>
            <span className="text-xs text-gray-600">Show Payment Details</span>
          </div>

          {/* Note */}
          <div className="relative pt-3.5 pb-1 border-b border-gray-300 focus-within:border-[#1072ba] transition-colors">
            <label className="absolute -top-1 left-0 text-[11px] text-gray-500 font-medium">
              Note
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-800 outline-none pt-0.5 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold rounded-[2px] transition-colors shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="tour-loan-disburse-submit-btn"
              type="submit"
              className="px-6 py-2 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] transition-colors shadow-xs cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
