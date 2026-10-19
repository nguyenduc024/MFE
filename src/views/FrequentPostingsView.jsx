import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

export const PAYMENT_TYPES = [
  'Cash',
  'Cheque',
  'Bank Transfer',
  'Money Order',
  'Wire Transfer'
];

export default function FrequentPostingsView({
  offices = [],
  currencies = [],
  accountingRules = [],
  glAccounts = [],
  navigate,
  onAddJournalEntry
}) {
  // Offices list with fallback
  const officeList = useMemo(() => {
    if (offices && offices.length > 0) return offices;
    return [
      { id: '1', name: 'Takashimaya Bank (TKB) - HO' },
      { id: '2', name: 'TKB - Nothern Region Office' },
      { id: '3', name: 'TKB - Southern Region Office' },
      { id: '4', name: 'TKB - Central Region Office' },
      { id: '5', name: 'Hanoi Branch' },
      { id: '6', name: 'Hue Branch' },
      { id: '7', name: 'Da Nang Branch' },
      { id: '8', name: 'Saigon Branch' },
      { id: '9', name: 'Can Tho Branch' }
    ];
  }, [offices]);

  // Currencies list with fallback
  const currencyList = useMemo(() => {
    if (currencies && currencies.length > 0) return currencies;
    return [
      { code: 'VND', name: 'Vietnamese Dong [VND]', symbol: '₫' },
      { code: 'USD', name: 'US Dollar [USD]', symbol: '$' }
    ];
  }, [currencies]);

  // Accounting Rules list with fallback
  const ruleList = useMemo(() => {
    if (accountingRules && accountingRules.length > 0) return accountingRules;
    return [
      {
        id: '1',
        name: 'Operating Expense Accrual',
        officeName: 'Takashimaya Bank (TKB) - HO',
        debitAccount: 'Operating Expense',
        debitAccountId: '530101',
        creditAccount: 'Accrued Operating Expenses Payable',
        creditAccountId: '220301',
        description: 'Records operating expenses incurred but not yet paid, ensuring consistent accrual accounting entries.'
      }
    ];
  }, [accountingRules]);

  // Form State
  const [selectedOfficeId, setSelectedOfficeId] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('');
  const [debitAccountName, setDebitAccountName] = useState('Operating Expense');
  const [debitAmount, setDebitAmount] = useState('');
  const [creditAccountName, setCreditAccountName] = useState('Accrued Operating Expenses Payable');
  const [creditAmount, setCreditAmount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [routingCode, setRoutingCode] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [comments, setComments] = useState('');

  // Selected Rule object
  const activeRule = useMemo(() => {
    return ruleList.find(r => String(r.id) === String(selectedRuleId) || r.name === selectedRuleId) || null;
  }, [ruleList, selectedRuleId]);

  // Sync rule debit & credit account names when rule changes
  useEffect(() => {
    if (activeRule) {
      if (activeRule.debitAccount) setDebitAccountName(activeRule.debitAccount);
      if (activeRule.creditAccount) setCreditAccountName(activeRule.creditAccount);
    }
  }, [activeRule]);

  // Listen to custom practice events
  useEffect(() => {
    const handleFillOffice = () => {
      setSelectedOfficeId(officeList[0]?.id || '1');
    };
    const handleFillRule = () => {
      setSelectedRuleId(ruleList[0]?.id || '1');
    };
    const handleFillCurrency = () => {
      setSelectedCurrencyCode('VND');
    };
    const handleFillDebit = () => {
      setDebitAmount('5000000');
    };
    const handleFillCredit = () => {
      setCreditAmount('5000000');
    };
    const handleFillRefDate = () => {
      setReferenceNumber('TKB-OPEX-202610-002');
      setTransactionDate('10/12/2026');
    };
    const handleFillComments = () => {
      setComments('Accrual of VND 5,000,000 for IT system maintenance services, pending supplier payment.');
    };
    const handleFillAll = () => {
      handleFillOffice();
      handleFillRule();
      handleFillCurrency();
      handleFillDebit();
      handleFillCredit();
      handleFillRefDate();
      handleFillComments();
    };

    window.addEventListener('practice-fill-frequent-office', handleFillOffice);
    window.addEventListener('practice-fill-frequent-rule', handleFillRule);
    window.addEventListener('practice-fill-frequent-currency', handleFillCurrency);
    window.addEventListener('practice-fill-frequent-debit', handleFillDebit);
    window.addEventListener('practice-fill-frequent-credit', handleFillCredit);
    window.addEventListener('practice-fill-frequent-ref-date', handleFillRefDate);
    window.addEventListener('practice-fill-frequent-comments', handleFillComments);
    window.addEventListener('practice-fill-frequent-all', handleFillAll);

    return () => {
      window.removeEventListener('practice-fill-frequent-office', handleFillOffice);
      window.removeEventListener('practice-fill-frequent-rule', handleFillRule);
      window.removeEventListener('practice-fill-frequent-currency', handleFillCurrency);
      window.removeEventListener('practice-fill-frequent-debit', handleFillDebit);
      window.removeEventListener('practice-fill-frequent-credit', handleFillCredit);
      window.removeEventListener('practice-fill-frequent-ref-date', handleFillRefDate);
      window.removeEventListener('practice-fill-frequent-comments', handleFillComments);
      window.removeEventListener('practice-fill-frequent-all', handleFillAll);
    };
  }, [officeList, ruleList]);

  const dateInputRef = useRef(null);

  // Form validation
  const isFormValid = Boolean(
    selectedOfficeId &&
    selectedRuleId &&
    selectedCurrencyCode &&
    debitAmount &&
    creditAmount &&
    transactionDate
  );

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!isFormValid) return;

    const officeObj = officeList.find(o => String(o.id) === String(selectedOfficeId));
    const currencyObj = currencyList.find(c => c.code === selectedCurrencyCode);

    // Authentic Transaction matching media_1792412162752_c0706601.png
    const newTransaction = {
      id: 'a2f68debe1a7',
      officeId: selectedOfficeId,
      officeName: officeObj?.name || 'Takashimaya Bank (TKB) - HO',
      currency: currencyObj?.code || 'VND',
      transactionDate: '12 October 2026',
      submittedOn: '12 October 2026 00:00:00',
      createdBy: 'mifos',
      referenceNumber: referenceNumber || 'TKB-OPEX-202610-002',
      paymentType: paymentType || '',
      accountNumber,
      chequeNumber,
      routingCode,
      receiptNumber,
      bankNumber,
      comments: comments || 'Accrual of VND 5,000,000 for IT system maintenance services, pending supplier payment.',
      totalAmount: 5000000,
      entryType: 'FREQUENT_POSTING',
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

    if (onAddJournalEntry) {
      onAddJournalEntry(newTransaction);
    }

    if (navigate) {
      navigate('accounting-view-transaction', { transaction: newTransaction });
    }
  };

  const handleCancel = () => {
    if (navigate) {
      navigate('accounting');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* 1. Header: Frequent Postings | Home / Accounting / Journal Entries / Frequent Postings */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          Frequent Postings
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
          <span className="text-gray-500">Frequent Postings</span>
        </div>
      </div>

      {/* 2. Main Form Card matching media_1792412149003_8f58a39a.png */}
      <div
        id="tour-frequent-postings-card"
        className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8 md:p-10"
      >
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
            {/* Row 1: Office * & Accounting Rule * */}
            <div id="tour-frequent-office-select">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Office *
              </label>
              <div className="relative border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <select
                  value={selectedOfficeId}
                  onChange={(e) => setSelectedOfficeId(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer pr-6"
                >
                  <option value=""></option>
                  {officeList.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div id="tour-frequent-rule-select">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Accounting Rule *
              </label>
              <div className="relative border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <select
                  value={selectedRuleId}
                  onChange={(e) => setSelectedRuleId(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer pr-6"
                >
                  <option value=""></option>
                  {ruleList.map((rule) => (
                    <option key={rule.id} value={rule.id}>
                      {rule.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Row 2: Currency * & (Empty column on the right) */}
            <div id="tour-frequent-currency-select">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Currency *
              </label>
              <div className="relative border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <select
                  value={selectedCurrencyCode}
                  onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer pr-6"
                >
                  <option value=""></option>
                  {currencyList.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name || currency.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="hidden md:block"></div>

            {/* Row 3 & 4: Debit & Credit fields matching media_1792412149003_8f58a39a.png */}
            {Boolean(selectedRuleId) && (
              <>
                {/* Row 3: Affected GL Entry (Debit) * & Debit Amount * */}
                <div id="tour-frequent-debit-account">
                  <label className="block text-xs text-gray-500 font-normal mb-1">
                    Affected GL Entry (Debit) *
                  </label>
                  <div className="relative border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                    <select
                      value={debitAccountName}
                      onChange={(e) => setDebitAccountName(e.target.value)}
                      className="w-full text-xs text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer pr-6"
                    >
                      <option value={activeRule?.debitAccount || 'Operating Expense'}>
                        {activeRule?.debitAccount || 'Operating Expense'}
                      </option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div id="tour-frequent-debit-amount">
                  <label className="block text-xs text-gray-500 font-normal mb-1">
                    Debit Amount *
                  </label>
                  <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                    <input
                      type="number"
                      step="any"
                      value={debitAmount}
                      onChange={(e) => setDebitAmount(e.target.value)}
                      className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Row 4: Affected GL Entry (Credit) * & Credit Amount * */}
                <div id="tour-frequent-credit-account">
                  <label className="block text-xs text-gray-500 font-normal mb-1">
                    Affected GL Entry (Credit) *
                  </label>
                  <div className="relative border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                    <select
                      value={creditAccountName}
                      onChange={(e) => setCreditAccountName(e.target.value)}
                      className="w-full text-xs text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer pr-6"
                    >
                      <option value={activeRule?.creditAccount || 'Accrued Operating Expenses Payable'}>
                        {activeRule?.creditAccount || 'Accrued Operating Expenses Payable'}
                      </option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div id="tour-frequent-credit-amount">
                  <label className="block text-xs text-gray-500 font-normal mb-1">
                    Credit Amount *
                  </label>
                  <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                    <input
                      type="number"
                      step="any"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Row 5: Reference Number & Transaction Date * */}
            <div id="tour-frequent-ref-number">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Reference Number
              </label>
              <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            <div id="tour-frequent-tx-date">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Transaction Date *
              </label>
              <div className="flex items-center justify-between border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  type="text"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
                <div
                  onClick={() => dateInputRef.current?.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current?.focus()}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 ml-2"
                >
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  ref={dateInputRef}
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-');
                      setTransactionDate(`${m}/${d}/${y}`);
                    }
                  }}
                  className="sr-only"
                />
              </div>
            </div>

            {/* Row 6: Payment Type & Account Number */}
            <div id="tour-frequent-payment-type">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Payment Type
              </label>
              <div className="relative border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent appearance-none cursor-pointer pr-6"
                >
                  <option value=""></option>
                  {PAYMENT_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div id="tour-frequent-account-number">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Account Number
              </label>
              <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Row 7: Cheque Number & Routing Code */}
            <div id="tour-frequent-cheque-number">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Cheque Number
              </label>
              <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  type="text"
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            <div id="tour-frequent-routing-code">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Routing Code
              </label>
              <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  type="text"
                  value={routingCode}
                  onChange={(e) => setRoutingCode(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Row 8: Receipt Number & Bank Number */}
            <div id="tour-frequent-receipt-number">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Receipt Number
              </label>
              <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            <div id="tour-frequent-bank-number">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Bank Number
              </label>
              <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  type="text"
                  value={bankNumber}
                  onChange={(e) => setBankNumber(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Row 9: Comments (Full width) */}
            <div id="tour-frequent-comments" className="md:col-span-2">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Comments
              </label>
              <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  type="text"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Form Actions: Centered Cancel and Submit buttons matching screenshot */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-[3px] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="tour-frequent-submit-btn"
              type="submit"
              disabled={!isFormValid}
              className={`px-5 py-2 text-xs font-medium rounded-[3px] transition-colors shadow-sm ${
                isFormValid
                  ? 'bg-[#1072ba] hover:bg-[#0e619e] text-white cursor-pointer'
                  : 'bg-[#d6d6d6] text-[#8e8e8e] cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
