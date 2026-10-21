import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

/**
 * AccountTransferView - Screen for executing internal CASA transfer between 2 clients.
 * Faithfully matches user screenshot Image 2:
 * - Breadcrumb: Account Transfer | Home / Clients / Minh Quang Tran / 000000001 - TKB Current Account / Transfer Funds
 * - Card 1: Transferring From Details (read-only)
 *   - Applicant: Minh Quang Tran
 *   - Office: Thu Duc Transaction Office
 *   - From Account: TKB Current Account - #000000001
 *   - From Account Type: Savings Account
 *   - Currency: Vietnamese Dong
 * - Form Fields:
 *   - Office *: Thu Duc Transaction Office
 *   - Client *: Lan Ngoc Pham
 *   - Account Type *: Savings Account
 *   - Account *: TKB Current Account - 000000002
 *   - Transaction Date *: 10/13/2026
 *   - Amount *: 1000000
 *   - Description *: Internal CASA transfer to Lan Pham. TKB-TRF-001.
 * - Action buttons: Cancel, Submit
 */
export default function AccountTransferView({
  fromSavings,
  fromClient,
  toClient,
  toSavings,
  onSubmitTransfer,
  onCancel,
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail,
  onNavigateSavingsDetail
}) {
  const applicantName = fromClient?.displayName || fromSavings?.clientName || 'Minh Quang Tran';
  const fromOffice = fromClient?.officeName || 'Thu Duc Transaction Office';
  const fromAccountLabel = `${fromSavings?.productName || 'TKB Current Account'} - #${fromSavings?.accountNo || '000000001'}`;

  // Form State
  const [formData, setFormData] = useState({
    office: 'Thu Duc Transaction Office',
    client: 'Lan Ngoc Pham',
    accountType: 'Savings Account',
    account: 'TKB Current Account - 000000002',
    transactionDate: '10/13/2026',
    amount: '',
    description: ''
  });

  const handleQuickAutofill = () => {
    setFormData({
      office: 'Thu Duc Transaction Office',
      client: 'Lan Ngoc Pham',
      accountType: 'Savings Account',
      account: 'TKB Current Account - 000000002',
      transactionDate: '10/13/2026',
      amount: '1000000',
      description: 'Internal CASA transfer to Lan Pham. TKB-TRF-001.'
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanAmount = parseFloat(String(formData.amount).replace(/,/g, '')) || 1000000;
    if (onSubmitTransfer) {
      onSubmitTransfer({
        fromSavingsId: fromSavings?.id || '1',
        fromAccountNo: fromSavings?.accountNo || '000000001',
        fromClientName: applicantName,
        toClientName: formData.client || 'Lan Ngoc Pham',
        toAccountNo: '000000002',
        amount: cleanAmount,
        transactionDate: formData.transactionDate,
        description: formData.description || 'Internal CASA transfer to Lan Pham. TKB-TRF-001.',
        office: formData.office
      });
    }
  };

  // Practice event listeners
  useEffect(() => {
    const handleAutofillEvent = () => {
      handleQuickAutofill();
    };

    const handleSubmitEvent = () => {
      handleSubmit();
    };

    window.addEventListener('practice-autofill-transfer', handleAutofillEvent);
    window.addEventListener('practice-submit-transfer', handleSubmitEvent);

    return () => {
      window.removeEventListener('practice-autofill-transfer', handleAutofillEvent);
      window.removeEventListener('practice-submit-transfer', handleSubmitEvent);
    };
  }, [formData, fromSavings]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumb matching Image 2 */}
      <div className="flex items-center space-x-2 text-xs mb-6 text-gray-500 font-normal">
        <span className="text-gray-800 font-semibold text-sm mr-2 border-r border-gray-300 pr-3">
          Account Transfer
        </span>
        <button 
          type="button" 
          onClick={onNavigateHome}
          className="text-gray-600 hover:text-[#1072ba] cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <button 
          type="button" 
          onClick={onNavigateClients}
          className="text-gray-600 hover:text-[#1072ba] cursor-pointer"
        >
          Clients
        </button>
        <span>/</span>
        <button 
          type="button" 
          onClick={onNavigateClientDetail}
          className="text-gray-600 hover:text-[#1072ba] cursor-pointer"
        >
          {applicantName}
        </button>
        <span>/</span>
        <button 
          type="button" 
          onClick={onNavigateSavingsDetail}
          className="text-gray-600 hover:text-[#1072ba] cursor-pointer"
        >
          {fromSavings?.accountNo || '000000001'} - {fromSavings?.productName || 'TKB Current Account'}
        </button>
        <span>/</span>
        <span className="text-gray-500 font-medium">
          Transfer Funds
        </span>
      </div>

      {/* 2. Main Transfer Container */}
      <div className="bg-white border border-gray-200 rounded-[2px] shadow-xs overflow-hidden">
        
        {/* Blue Header Bar */}
        <div className="bg-[#1072ba] text-white px-5 py-3 font-semibold text-sm flex items-center justify-between">
          <span>Account Transfer</span>
          <span className="text-xs text-white/80 font-normal">Minh Quang Tran (#000000011)</span>
        </div>

        <div className="p-6 space-y-6">

          {/* 3. Transferring From Details (Read-only Card) matching Image 2 */}
          <div className="border border-gray-200 rounded-[2px] p-4 bg-gray-50/70">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-200 pb-1.5">
              Transferring From Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-xs">
              <div>
                <span className="text-gray-500 block text-[11px]">Applicant</span>
                <span className="font-semibold text-gray-800">{applicantName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Office</span>
                <span className="font-medium text-gray-800">{fromOffice}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">From Account</span>
                <span className="font-mono font-medium text-[#1072ba]">{fromAccountLabel}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">From Account Type</span>
                <span className="text-gray-800">Savings Account</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Currency</span>
                <span className="text-gray-800">Vietnamese Dong (VND)</span>
              </div>
            </div>
          </div>

          {/* 4. Form Fields matching Image 2 */}
          <form 
            id="tour-account-transfer-form" 
            onSubmit={handleSubmit} 
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* Office * */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Office <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.office}
                    onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                    className="w-full text-xs border-b border-gray-300 py-1.5 pr-8 focus:outline-none focus:border-[#1072ba] bg-transparent appearance-none text-gray-800 cursor-pointer"
                  >
                    <option value="Thu Duc Transaction Office">Thu Duc Transaction Office</option>
                    <option value="Takashimaya Bank (TKB) - HO">Takashimaya Bank (TKB) - HO</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-1 top-2 pointer-events-none" />
                </div>
              </div>

              {/* Client * */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Client <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full text-xs border-b border-gray-300 py-1.5 pr-8 focus:outline-none focus:border-[#1072ba] bg-transparent appearance-none text-gray-800 cursor-pointer"
                  >
                    <option value="Lan Ngoc Pham">Lan Ngoc Pham</option>
                    <option value="Minh Quang Tran">Minh Quang Tran</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-1 top-2 pointer-events-none" />
                </div>
              </div>

              {/* Account Type * */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Account Type <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full text-xs border-b border-gray-300 py-1.5 pr-8 focus:outline-none focus:border-[#1072ba] bg-transparent appearance-none text-gray-800 cursor-pointer"
                  >
                    <option value="Savings Account">Savings Account</option>
                    <option value="Loan Account">Loan Account</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-1 top-2 pointer-events-none" />
                </div>
              </div>

              {/* Account * */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Account <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                    className="w-full text-xs border-b border-gray-300 py-1.5 pr-8 focus:outline-none focus:border-[#1072ba] bg-transparent appearance-none text-gray-800 cursor-pointer"
                  >
                    <option value="TKB Current Account - 000000002">TKB Current Account - 000000002</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-1 top-2 pointer-events-none" />
                </div>
              </div>

              {/* Transaction Date * */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Transaction Date <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    placeholder="MM/DD/YYYY"
                    className="w-full text-xs border-b border-gray-300 py-1.5 pr-8 focus:outline-none focus:border-[#1072ba] text-gray-800"
                  />
                  <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-1 top-2 pointer-events-none" />
                </div>
              </div>

              {/* Amount * */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Amount <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 1000000"
                  className="w-full text-xs border-b border-gray-300 py-1.5 focus:outline-none focus:border-[#1072ba] text-gray-800 font-mono"
                />
              </div>

            </div>

            {/* Description * */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Internal CASA transfer description..."
                className="w-full text-xs border border-gray-300 rounded-[2px] p-2 focus:outline-none focus:border-[#1072ba] text-gray-800"
              />
            </div>

            {/* Actions Bar matching Image 2 */}
            <div className="pt-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-[2px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="tour-account-transfer-submit"
                className="px-5 py-1.5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs transition-colors cursor-pointer"
              >
                Submit
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}
