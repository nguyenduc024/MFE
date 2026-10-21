import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

/**
 * WithdrawSavingsAccountView - Screen for executing CASA withdrawal transactions.
 * Faithfully matches screenshot Image 2:
 * - Breadcrumb: Withdrawal | Home / Clients / Minh Quang Tran / Savings / Withdrawal
 * - Card: Withdraw Money From Saving Account
 * - Fields:
 *   - Transaction Date *: 10/13/2026
 *   - Transaction Amount *: VND 2,000,000.00
 *   - Payment Type *: Money Transfer
 *   - Show Payment Details: toggle switch
 *   - Notes: CASA withdrawal via bank transfer. TKB-CASA-WD-001.
 *   - Buttons: Cancel, Submit
 */
export default function WithdrawSavingsAccountView({
  savings,
  client,
  onSubmitWithdraw,
  onCancel,
  onNavigateHome,
  onNavigateClients,
  onNavigateClientDetail,
  onNavigateSavingsDetail
}) {
  const clientName = client?.displayName || savings?.clientName || 'Minh Quang Tran';
  const accountNo = savings?.accountNo || '000000001';

  // Form State matching screenshot Image 2
  const [formData, setFormData] = useState({
    transactionDate: '10/13/2026',
    transactionAmount: '',
    paymentType: 'Money Transfer',
    showPaymentDetails: false,
    notes: '',
    accountNumber: '',
    chequeNumber: '',
    routingCode: '',
    receiptNumber: '',
    bankNumber: ''
  });

  const handleQuickAutofillSample = () => {
    setFormData({
      transactionDate: '10/13/2026',
      transactionAmount: '2,000,000.00',
      paymentType: 'Money Transfer',
      showPaymentDetails: false,
      notes: 'CASA withdrawal via bank transfer. TKB-CASA-WD-001.',
      accountNumber: '',
      chequeNumber: '',
      routingCode: '',
      receiptNumber: '',
      bankNumber: ''
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanAmount = parseFloat(String(formData.transactionAmount).replace(/,/g, '')) || 2000000;
    if (onSubmitWithdraw) {
      onSubmitWithdraw({
        savingsId: savings?.id || '1',
        amount: cleanAmount,
        transactionDate: formData.transactionDate,
        paymentType: formData.paymentType,
        notes: formData.notes
      });
    }
  };

  // Listen to practice events
  useEffect(() => {
    const handleAutofillEvent = () => {
      handleQuickAutofillSample();
    };

    const handleSubmitEvent = () => {
      handleSubmit();
    };

    window.addEventListener('practice-autofill-withdraw', handleAutofillEvent);
    window.addEventListener('practice-submit-withdraw', handleSubmitEvent);

    return () => {
      window.removeEventListener('practice-autofill-withdraw', handleAutofillEvent);
      window.removeEventListener('practice-submit-withdraw', handleSubmitEvent);
    };
  }, [formData, savings]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Top Header & Breadcrumb matching Image 2: Withdrawal | Home / Clients / Minh Quang Tran / Savings / Withdrawal */}
      <div className="flex items-center space-x-2 text-xs mb-6 text-gray-500 font-normal">
        <span className="text-gray-800 font-semibold text-sm mr-2 border-r border-gray-300 pr-3">
          Withdrawal
        </span>
        <button 
          type="button"
          onClick={onNavigateHome}
          className="hover:text-[#1072ba] cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <button 
          type="button"
          onClick={onNavigateClients}
          className="hover:text-[#1072ba] cursor-pointer"
        >
          Clients
        </button>
        <span>/</span>
        <button 
          type="button"
          onClick={onNavigateClientDetail}
          className="hover:text-[#1072ba] cursor-pointer text-[#1072ba]"
        >
          {clientName}
        </button>
        <span>/</span>
        <button 
          type="button"
          onClick={onNavigateSavingsDetail}
          className="hover:text-[#1072ba] cursor-pointer text-[#1072ba]"
        >
          Savings
        </button>
        <span>/</span>
        <span className="text-gray-400">Withdrawal</span>
      </div>

      {/* 2. Main Form Card matching Image 2 */}
      <div className="max-w-xl mx-auto bg-white rounded-[2px] shadow-sm border border-gray-200 p-8 space-y-6">
        
        {/* Card Header Title */}
        <h2 className="text-sm font-bold text-gray-800 tracking-tight">
          Withdraw Money From Saving Account
        </h2>

        {/* Form Body */}
        <form id="tour-withdraw-savings-form" onSubmit={handleSubmit} className="space-y-6">
          
          {/* Field 1: Transaction Date * */}
          <div className="space-y-1">
            <label className="block text-[11px] text-gray-500 font-normal">
              Transaction Date <span className="text-red-500">*</span>
            </label>
            <div className="relative border-b border-gray-300 focus-within:border-[#1072ba] pb-1 transition-colors">
              <input
                type="text"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                className="w-full text-xs text-gray-800 bg-transparent outline-hidden pr-6"
                placeholder="MM/DD/YYYY"
              />
              <Calendar className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-0.5 pointer-events-none" />
            </div>
          </div>

          {/* Field 2: Transaction Amount * with VND prefix and right-aligned number */}
          <div className="space-y-1">
            <label className="block text-[11px] text-gray-500 font-normal">
              Transaction Amount <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-between border-b border-gray-300 focus-within:border-[#1072ba] pb-1 transition-colors">
              <span className="text-xs text-gray-700 font-normal select-none">VND</span>
              <input
                type="text"
                value={formData.transactionAmount}
                onChange={(e) => setFormData({ ...formData, transactionAmount: e.target.value })}
                className="w-full text-xs text-right text-gray-900 bg-transparent outline-hidden font-mono font-medium pl-2"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Field 3: Payment Type * */}
          <div className="space-y-1">
            <label className="block text-[11px] text-gray-500 font-normal">
              Payment Type <span className="text-red-500">*</span>
            </label>
            <div className="relative border-b border-gray-300 focus-within:border-[#1072ba] pb-1 transition-colors">
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                className="w-full text-xs text-gray-800 bg-transparent outline-hidden appearance-none pr-6 cursor-pointer"
              >
                <option value="Money Transfer">Money Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-0.5 pointer-events-none" />
            </div>
          </div>

          {/* Field 4: Show Payment Details Toggle Switch */}
          <div className="flex items-center space-x-3 pt-1">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, showPaymentDetails: !formData.showPaymentDetails })}
              className={`w-9 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                formData.showPaymentDetails ? 'bg-[#1072ba]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                  formData.showPaymentDetails ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs text-gray-700 font-normal select-none">
              Show Payment Details
            </span>
          </div>

          {/* Conditional Payment Details */}
          {formData.showPaymentDetails && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-[2px] space-y-3 text-xs animate-in fade-in duration-150">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500">Account #</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="e.g. 0382910291"
                  className="w-full border-b border-gray-300 pb-1 text-xs outline-hidden bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500">Cheque #</label>
                  <input
                    type="text"
                    value={formData.chequeNumber}
                    onChange={(e) => setFormData({ ...formData, chequeNumber: e.target.value })}
                    className="w-full border-b border-gray-300 pb-1 text-xs outline-hidden bg-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500">Routing Code</label>
                  <input
                    type="text"
                    value={formData.routingCode}
                    onChange={(e) => setFormData({ ...formData, routingCode: e.target.value })}
                    className="w-full border-b border-gray-300 pb-1 text-xs outline-hidden bg-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500">Receipt #</label>
                  <input
                    type="text"
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                    className="w-full border-b border-gray-300 pb-1 text-xs outline-hidden bg-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500">Bank #</label>
                  <input
                    type="text"
                    value={formData.bankNumber}
                    onChange={(e) => setFormData({ ...formData, bankNumber: e.target.value })}
                    className="w-full border-b border-gray-300 pb-1 text-xs outline-hidden bg-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Field 5: Notes */}
          <div className="space-y-1">
            <label className="block text-[11px] text-gray-500 font-normal">
              Notes
            </label>
            <div className="border-b border-gray-300 focus-within:border-[#1072ba] pb-1 transition-colors">
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full text-xs text-gray-800 bg-transparent outline-hidden"
                placeholder="Enter notes..."
              />
            </div>
          </div>

          {/* Action Buttons: Cancel & Submit matching Image 2 */}
          <div className="pt-4 flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white hover:bg-gray-50 text-gray-700 text-xs font-normal px-5 py-2 rounded-[3px] border border-gray-300 transition-colors shadow-2xs cursor-pointer select-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="tour-withdraw-submit-btn"
              className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-normal px-6 py-2 rounded-[3px] transition-colors shadow-2xs cursor-pointer select-none"
            >
              Submit
            </button>
          </div>

        </form>

      </div>

      {/* 3. Authentic Mifos System Footer matching Image 2 */}
      <div className="pt-16 pb-6 text-center text-[11px] text-gray-400 space-y-1 select-none font-sans">
        <div className="flex items-center justify-center space-x-6">
          <span>Mifos 250331-</span>
          <span>Fineract 1.16.0 - SNAPSHOT</span>
        </div>
        <div>http://192.168.56.101:8080</div>
      </div>

    </div>
  );
}
