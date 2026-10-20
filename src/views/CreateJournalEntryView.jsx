import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Calendar, Plus, Minus } from 'lucide-react';

/**
 * CreateJournalEntryView
 * Pixel-perfect implementation of Mifos X Create Journal Entry (Add Journal Entry)
 * Matches screenshot media_1792404684936_407e0074.png
 */

export const FALLBACK_GL_ACCOUNTS = [
  // ASSET Detail Accounts
  { glCode: '110101', name: 'Cash at Vault', type: 'ASSET' },
  { glCode: '110102', name: 'Cash at Teller', type: 'ASSET' },
  { glCode: '110201', name: 'Settlement Bank Account', type: 'ASSET' },
  { glCode: '110202', name: 'Central Bank Balance', type: 'ASSET' },
  { glCode: '110301', name: 'Interbank Placements', type: 'ASSET' },
  { glCode: '120101', name: 'Retail Loan Principal', type: 'ASSET' },
  { glCode: '120201', name: 'Loan Interest Receivable', type: 'ASSET' },
  { glCode: '120202', name: 'Loan Fee Receivable', type: 'ASSET' },
  { glCode: '120203', name: 'Loan Penalty Receivable', type: 'ASSET' },
  { glCode: '130101', name: 'Clearing Receivable', type: 'ASSET' },
  { glCode: '130102', name: 'Interbranch Receivable', type: 'ASSET' },

  // LIABILITY Detail Accounts
  { glCode: '210101', name: 'Savings Deposits', type: 'LIABILITY' },
  { glCode: '210102', name: 'Current Account Deposits', type: 'LIABILITY' },
  { glCode: '210103', name: 'Fixed Deposits', type: 'LIABILITY' },
  { glCode: '210104', name: 'Recurring Deposits', type: 'LIABILITY' },
  { glCode: '210201', name: 'Savings Interest Payable', type: 'LIABILITY' },
  { glCode: '210202', name: 'Fixed Deposit Interest Payable', type: 'LIABILITY' },
  { glCode: '220101', name: 'Interbank Borrowings', type: 'LIABILITY' },
  { glCode: '220201', name: 'Clearing Payable', type: 'LIABILITY' },
  { glCode: '220301', name: 'Accrued Operating Expenses Payable', type: 'LIABILITY' },

  // EQUITY Detail Accounts
  { glCode: '310101', name: 'Contributed Capital', type: 'EQUITY' },
  { glCode: '310199', name: 'Opening Balance Contra', type: 'EQUITY' },

  // INCOME Detail Accounts
  { glCode: '410101', name: 'Loan Interest Income', type: 'INCOME' },
  { glCode: '410102', name: 'Interbank Interest Income', type: 'INCOME' },
  { glCode: '420101', name: 'Loan Processing Fee Income', type: 'INCOME' },
  { glCode: '420102', name: 'Savings Service Fee Income', type: 'INCOME' },
  { glCode: '420104', name: 'Payment Service Fee Income', type: 'INCOME' },

  // EXPENSE Detail Accounts
  { glCode: '510101', name: 'Savings Interest Expense', type: 'EXPENSE' },
  { glCode: '510102', name: 'Fixed Deposit Interest Expense', type: 'EXPENSE' },
  { glCode: '520101', name: 'Loan Write-off Expense', type: 'EXPENSE' },
  { glCode: '530101', name: 'Operating Expense', type: 'EXPENSE' },
  { glCode: '530102', name: 'Salary Expense', type: 'EXPENSE' },
  { glCode: '530103', name: 'Bank Charges Expense', type: 'EXPENSE' }
];

export const PAYMENT_TYPES = [
  'Cash',
  'Cheque',
  'Bank Transfer',
  'Money Order',
  'Wire Transfer'
];

export default function CreateJournalEntryView({
  offices = [],
  currencies = [],
  glAccounts = [],
  navigate,
  onAddJournalEntry
}) {
  // Available Offices list with fallback
  const officeList = useMemo(() => {
    if (offices && offices.length > 0) return offices;
    return [
      { id: '1', name: 'Takashimaya Bank (TKB) - HO' },
      { id: '2', name: 'TKB - Nothern Region Office' },
      { id: '3', name: 'TKB - Southern Region Office' },
      { id: '4', name: 'TKB - Central Region Office' },
      { id: '5', name: 'Hanoi Branch' },
      { id: '6', name: 'Hue Branch' }
    ];
  }, [offices]);

  // Available Currencies list with fallback
  const currencyList = useMemo(() => {
    if (currencies && currencies.length > 0) return currencies;
    return [
      { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
      { code: 'USD', name: 'US Dollar', symbol: '$' }
    ];
  }, [currencies]);

  // Available Detail GL Accounts
  const availableGlAccounts = useMemo(() => {
    if (glAccounts && glAccounts.length > 0) {
      const details = glAccounts.filter(a => !a.usage || a.usage.toLowerCase() === 'detail');
      if (details.length > 0) return details;
    }
    return FALLBACK_GL_ACCOUNTS;
  }, [glAccounts]);

  // Form States
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [officeDropdownOpen, setOfficeDropdownOpen] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  // Debit entries list (supports multiple rows with (+) button)
  const [debitEntries, setDebitEntries] = useState([
    { id: 1, glAccount: null, amount: '' }
  ]);
  const [openDebitDropdownId, setOpenDebitDropdownId] = useState(null);
  const [debitSearchTerm, setDebitSearchTerm] = useState({});

  // Credit entries list (supports multiple rows with (+) button)
  const [creditEntries, setCreditEntries] = useState([
    { id: 1, glAccount: null, amount: '' }
  ]);
  const [openCreditDropdownId, setOpenCreditDropdownId] = useState(null);
  const [creditSearchTerm, setCreditSearchTerm] = useState({});

  const [referenceNumber, setReferenceNumber] = useState('');
  const [transactionDate, setTransactionDate] = useState(() => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}/${m}/${y}`;
  });

  const [paymentType, setPaymentType] = useState('');
  const [paymentTypeDropdownOpen, setPaymentTypeDropdownOpen] = useState(false);

  const [accountNumber, setAccountNumber] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [routingCode, setRoutingCode] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [comments, setComments] = useState('');

  // Refs for closing dropdowns when clicking outside
  const officeRef = useRef(null);
  const currencyRef = useRef(null);
  const paymentTypeRef = useRef(null);
  const dateInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (officeRef.current && !officeRef.current.contains(e.target)) {
        setOfficeDropdownOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setCurrencyDropdownOpen(false);
      }
      if (paymentTypeRef.current && !paymentTypeRef.current.contains(e.target)) {
        setPaymentTypeDropdownOpen(false);
      }
      // If clicking outside any open debit/credit dropdown container
      if (!e.target.closest('.debit-dropdown-container')) {
        setOpenDebitDropdownId(null);
      }
      if (!e.target.closest('.credit-dropdown-container')) {
        setOpenCreditDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Practice Tour Custom Event Listeners
  useEffect(() => {
    const handleAutofillAll = () => {
      const ho = officeList.find(o => o.id === '1' || o.name.includes('HO')) || officeList[0];
      const vnd = currencyList.find(c => c.code === 'VND') || currencyList[0];
      const opexAcc = availableGlAccounts.find(a => a.glCode === '530101') || { glCode: '530101', name: 'Operating Expense', type: 'EXPENSE' };
      const accruedAcc = availableGlAccounts.find(a => a.glCode === '220301') || { glCode: '220301', name: 'Accrued Operating Expenses Payable', type: 'LIABILITY' };

      setSelectedOffice(ho);
      setSelectedCurrency(vnd);
      setDebitEntries([{ id: 1, glAccount: opexAcc, amount: '2000000' }]);
      setCreditEntries([{ id: 1, glAccount: accruedAcc, amount: '2000000' }]);
      setReferenceNumber('TKB-OPEX-202610-001');
      setTransactionDate('9/1/2026');
    };

    const handleSelectHO = () => {
      const ho = officeList.find(o => o.id === '1' || o.name.includes('HO')) || officeList[0];
      setSelectedOffice(ho);
      setOfficeDropdownOpen(false);
    };

    const handleSelectVND = () => {
      const vnd = currencyList.find(c => c.code === 'VND') || currencyList[0];
      setSelectedCurrency(vnd);
      setCurrencyDropdownOpen(false);
    };

    const handleSelectDebitOpex = () => {
      const opexAcc = availableGlAccounts.find(a => a.glCode === '530101') || { glCode: '530101', name: 'Operating Expense', type: 'EXPENSE' };
      setDebitEntries(prev => prev.map((e, idx) => idx === 0 ? { ...e, glAccount: opexAcc } : e));
      setOpenDebitDropdownId(null);
    };

    const handleFillDebitAmount = () => {
      setDebitEntries(prev => prev.map((e, idx) => idx === 0 ? { ...e, amount: '2000000' } : e));
    };

    const handleSelectCreditAccrued = () => {
      const accruedAcc = availableGlAccounts.find(a => a.glCode === '220301') || { glCode: '220301', name: 'Accrued Operating Expenses Payable', type: 'LIABILITY' };
      setCreditEntries(prev => prev.map((e, idx) => idx === 0 ? { ...e, glAccount: accruedAcc } : e));
      setOpenCreditDropdownId(null);
    };

    const handleFillCreditAmount = () => {
      setCreditEntries(prev => prev.map((e, idx) => idx === 0 ? { ...e, amount: '2000000' } : e));
    };

    const handleFillRefDate = () => {
      setReferenceNumber('TKB-OPEX-202610-001');
      setTransactionDate('9/1/2026');
    };

    window.addEventListener('practice-autofill-manual-journal', handleAutofillAll);
    window.addEventListener('practice-select-manual-office-ho', handleSelectHO);
    window.addEventListener('practice-select-manual-currency-vnd', handleSelectVND);
    window.addEventListener('practice-select-manual-debit-opex', handleSelectDebitOpex);
    window.addEventListener('practice-fill-manual-debit-amount', handleFillDebitAmount);
    window.addEventListener('practice-select-manual-credit-accrued', handleSelectCreditAccrued);
    window.addEventListener('practice-fill-manual-credit-amount', handleFillCreditAmount);
    window.addEventListener('practice-fill-manual-ref-date', handleFillRefDate);

    return () => {
      window.removeEventListener('practice-autofill-manual-journal', handleAutofillAll);
      window.removeEventListener('practice-select-manual-office-ho', handleSelectHO);
      window.removeEventListener('practice-select-manual-currency-vnd', handleSelectVND);
      window.removeEventListener('practice-select-manual-debit-opex', handleSelectDebitOpex);
      window.removeEventListener('practice-fill-manual-debit-amount', handleFillDebitAmount);
      window.removeEventListener('practice-select-manual-credit-accrued', handleSelectCreditAccrued);
      window.removeEventListener('practice-fill-manual-credit-amount', handleFillCreditAmount);
      window.removeEventListener('practice-fill-manual-ref-date', handleFillRefDate);
    };
  }, [officeList, currencyList, availableGlAccounts]);

  // Handlers for dynamic Debit rows
  const handleAddDebitEntry = () => {
    setDebitEntries(prev => [
      ...prev,
      { id: Date.now(), glAccount: null, amount: '' }
    ]);
  };

  const handleRemoveDebitEntry = (id) => {
    if (debitEntries.length <= 1) return;
    setDebitEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleDebitGlChange = (id, acc) => {
    setDebitEntries(prev => prev.map(e => (e.id === id ? { ...e, glAccount: acc } : e)));
    setOpenDebitDropdownId(null);
  };

  const handleDebitAmountChange = (id, val) => {
    setDebitEntries(prev => prev.map(e => (e.id === id ? { ...e, amount: val } : e)));
  };

  // Handlers for dynamic Credit rows
  const handleAddCreditEntry = () => {
    setCreditEntries(prev => [
      ...prev,
      { id: Date.now(), glAccount: null, amount: '' }
    ]);
  };

  const handleRemoveCreditEntry = (id) => {
    if (creditEntries.length <= 1) return;
    setCreditEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleCreditGlChange = (id, acc) => {
    setCreditEntries(prev => prev.map(e => (e.id === id ? { ...e, glAccount: acc } : e)));
    setOpenCreditDropdownId(null);
  };

  const handleCreditAmountChange = (id, val) => {
    setCreditEntries(prev => prev.map(e => (e.id === id ? { ...e, amount: val } : e)));
  };

  // Balance calculations
  const totalDebit = useMemo(() => {
    return debitEntries.reduce((sum, item) => {
      const val = parseFloat(item.amount);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [debitEntries]);

  const totalCredit = useMemo(() => {
    return creditEntries.reduce((sum, item) => {
      const val = parseFloat(item.amount);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [creditEntries]);

  // Form validity check
  const isFormValid = useMemo(() => {
    if (!selectedOffice || !selectedCurrency || !transactionDate) return false;

    // Check all debit rows
    const validDebits = debitEntries.every(
      d => d.glAccount && parseFloat(d.amount) > 0
    );
    if (!validDebits || debitEntries.length === 0) return false;

    // Check all credit rows
    const validCredits = creditEntries.every(
      c => c.glAccount && parseFloat(c.amount) > 0
    );
    if (!validCredits || creditEntries.length === 0) return false;

    // Must be balanced: Total Debit == Total Credit
    return totalDebit > 0 && totalCredit > 0 && Math.abs(totalDebit - totalCredit) < 0.001;
  }, [selectedOffice, selectedCurrency, transactionDate, debitEntries, creditEntries, totalDebit, totalCredit]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!isFormValid) return;

    const newJournalRecord = {
      id: String(Date.now()).slice(-4),
      office: selectedOffice.name,
      currency: selectedCurrency.code,
      txDate: transactionDate,
      referenceNumber: referenceNumber || undefined,
      paymentType: paymentType || undefined,
      accountNumber: accountNumber || undefined,
      chequeNumber: chequeNumber || undefined,
      routingCode: routingCode || undefined,
      receiptNumber: receiptNumber || undefined,
      bankNumber: bankNumber || undefined,
      comments: comments || undefined,
      debits: debitEntries.map(d => ({
        glCode: d.glAccount.glCode,
        name: d.glAccount.name,
        type: d.glAccount.type,
        amount: parseFloat(d.amount)
      })),
      credits: creditEntries.map(c => ({
        glCode: c.glAccount.glCode,
        name: c.glAccount.name,
        type: c.glAccount.type,
        amount: parseFloat(c.amount)
      })),
      totalAmount: totalDebit,
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    };

    if (onAddJournalEntry) {
      onAddJournalEntry(newJournalRecord);
    }

    if (navigate) {
      navigate('accounting-journal');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* 1. Header: Create | Home / Accounting / Journal Entries / Create */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          Create
        </h1>
        <span className="text-gray-300 font-light text-base">|</span>
        <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5">
          <span 
            onClick={() => navigate && navigate('home')} 
            className="text-[#1072ba] hover:underline cursor-pointer"
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
          <span className="text-gray-500">Create</span>
        </div>
      </div>

      {/* 2. Main White Form Card matching Screenshot */}
      <div id="tour-manual-journal-card" className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-7">
          
          {/* Row 1: Office * and Currency * */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
            {/* Office * */}
            <div className="relative" ref={officeRef}>
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Office *
              </label>
              <div
                id="tour-manual-office-select"
                onClick={() => setOfficeDropdownOpen(!officeDropdownOpen)}
                className="w-full flex items-center justify-between border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 cursor-pointer transition-colors"
              >
                <span className={`text-xs ${selectedOffice ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                  {selectedOffice ? selectedOffice.name : ''}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${officeDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {officeDropdownOpen && (
                <div 
                  id="tour-manual-office-dropdown"
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg max-h-56 overflow-y-auto z-50 py-1 text-xs animate-in fade-in duration-100"
                >
                  {officeList.map((off) => (
                    <div
                      key={off.id}
                      id={off.id === '1' || off.name.includes('HO') ? 'tour-manual-office-ho-option' : undefined}
                      onClick={() => {
                        setSelectedOffice(off);
                        setOfficeDropdownOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                        selectedOffice?.id === off.id ? 'bg-gray-100 font-semibold text-[#1072ba]' : 'text-gray-800'
                      }`}
                    >
                      {off.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Currency * */}
            <div className="relative" ref={currencyRef}>
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Currency *
              </label>
              <div
                id="tour-manual-currency-select"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="w-full flex items-center justify-between border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 cursor-pointer transition-colors"
              >
                <span className={`text-xs ${selectedCurrency ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                  {selectedCurrency ? `${selectedCurrency.name} [${selectedCurrency.code}]` : ''}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {currencyDropdownOpen && (
                <div 
                  id="tour-manual-currency-dropdown"
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg max-h-56 overflow-y-auto z-50 py-1 text-xs animate-in fade-in duration-100"
                >
                  {currencyList.map((curr) => (
                    <div
                      key={curr.code}
                      id={curr.code === 'VND' ? 'tour-manual-currency-vnd-option' : undefined}
                      onClick={() => {
                        setSelectedCurrency(curr);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                        selectedCurrency?.code === curr.code ? 'bg-gray-100 font-semibold text-[#1072ba]' : 'text-gray-800'
                      }`}
                    >
                      {curr.name} [{curr.code}]
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Debit Section - Affected GL Entry (Debit) * & Debit Amount * */}
          <div className="space-y-4">
            {debitEntries.map((entry, index) => {
              const isFirst = index === 0;
              const open = openDebitDropdownId === entry.id;
              const search = (debitSearchTerm[entry.id] || '').toLowerCase();
              const filteredAccounts = availableGlAccounts.filter(
                a => a.glCode.toLowerCase().includes(search) || a.name.toLowerCase().includes(search)
              );

              return (
                <div key={entry.id} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7 items-end">
                  {/* Affected GL Entry (Debit) * */}
                  <div className="relative debit-dropdown-container">
                    {isFirst && (
                      <label className="block text-xs text-gray-500 font-normal mb-1">
                        Affected GL Entry (Debit) *
                      </label>
                    )}
                    <div
                      id={isFirst ? "tour-manual-debit-gl" : undefined}
                      onClick={() => setOpenDebitDropdownId(open ? null : entry.id)}
                      className="w-full flex items-center justify-between border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 cursor-pointer transition-colors"
                    >
                      <span className={`text-xs ${entry.glAccount ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                        {entry.glAccount ? `(${entry.glAccount.glCode}) ${entry.glAccount.name}` : ''}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </div>

                    {open && (
                      <div 
                        id={isFirst ? "tour-manual-debit-gl-dropdown" : undefined}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg max-h-56 overflow-y-auto z-50 py-1 text-xs animate-in fade-in duration-100"
                      >
                        <div className="p-2 border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="Filter GL account..."
                            value={debitSearchTerm[entry.id] || ''}
                            onChange={(e) => setDebitSearchTerm(prev => ({ ...prev, [entry.id]: e.target.value }))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 border border-gray-200 rounded-[2px] text-xs focus:outline-none focus:border-[#1072ba]"
                          />
                        </div>
                        {filteredAccounts.map((acc) => (
                          <div
                            key={acc.glCode}
                            id={acc.glCode === '530101' ? 'tour-manual-debit-opex-option' : undefined}
                            onClick={() => handleDebitGlChange(entry.id, acc)}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                              entry.glAccount?.glCode === acc.glCode ? 'bg-gray-100 font-semibold text-[#1072ba]' : 'text-gray-800'
                            }`}
                          >
                            <span className="font-mono text-gray-500 mr-1.5">({acc.glCode})</span>
                            <span>{acc.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Debit Amount * with (+) and (-) buttons */}
                  <div>
                    {isFirst && (
                      <label className="block text-xs text-gray-500 font-normal mb-1">
                        Debit Amount *
                      </label>
                    )}
                    <div 
                      id={isFirst ? "tour-manual-debit-amount" : undefined}
                      className="flex items-center justify-between border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors"
                    >
                      <input
                        id={isFirst ? "tour-manual-input-debit-amount" : undefined}
                        type="number"
                        step="any"
                        value={entry.amount}
                        onChange={(e) => handleDebitAmountChange(entry.id, e.target.value)}
                        placeholder=""
                        className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                      />
                      <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
                        {isFirst ? (
                          <button
                            type="button"
                            onClick={handleAddDebitEntry}
                            className="w-4.5 h-4.5 rounded-full bg-[#1072ba] hover:bg-[#0e619e] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95"
                            title="Add another Debit row"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemoveDebitEntry(entry.id)}
                            className="w-4.5 h-4.5 rounded-full bg-gray-400 hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95"
                            title="Remove this Debit row"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 3: Credit Section - Affected GL Entry (Credit) * & Credit Amount * */}
          <div className="space-y-4">
            {creditEntries.map((entry, index) => {
              const isFirst = index === 0;
              const open = openCreditDropdownId === entry.id;
              const search = (creditSearchTerm[entry.id] || '').toLowerCase();
              const filteredAccounts = availableGlAccounts.filter(
                a => a.glCode.toLowerCase().includes(search) || a.name.toLowerCase().includes(search)
              );

              return (
                <div key={entry.id} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7 items-end">
                  {/* Affected GL Entry (Credit) * */}
                  <div className="relative credit-dropdown-container">
                    {isFirst && (
                      <label className="block text-xs text-gray-500 font-normal mb-1">
                        Affected GL Entry (Credit) *
                      </label>
                    )}
                    <div
                      id={isFirst ? "tour-manual-credit-gl" : undefined}
                      onClick={() => setOpenCreditDropdownId(open ? null : entry.id)}
                      className="w-full flex items-center justify-between border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 cursor-pointer transition-colors"
                    >
                      <span className={`text-xs ${entry.glAccount ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                        {entry.glAccount ? `(${entry.glAccount.glCode}) ${entry.glAccount.name}` : ''}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </div>

                    {open && (
                      <div 
                        id={isFirst ? "tour-manual-credit-gl-dropdown" : undefined}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg max-h-56 overflow-y-auto z-50 py-1 text-xs animate-in fade-in duration-100"
                      >
                        <div className="p-2 border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="Filter GL account..."
                            value={creditSearchTerm[entry.id] || ''}
                            onChange={(e) => setCreditSearchTerm(prev => ({ ...prev, [entry.id]: e.target.value }))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 border border-gray-200 rounded-[2px] text-xs focus:outline-none focus:border-[#1072ba]"
                          />
                        </div>
                        {filteredAccounts.map((acc) => (
                          <div
                            key={acc.glCode}
                            id={acc.glCode === '220301' ? 'tour-manual-credit-accrued-option' : undefined}
                            onClick={() => handleCreditGlChange(entry.id, acc)}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                              entry.glAccount?.glCode === acc.glCode ? 'bg-gray-100 font-semibold text-[#1072ba]' : 'text-gray-800'
                            }`}
                          >
                            <span className="font-mono text-gray-500 mr-1.5">({acc.glCode})</span>
                            <span>{acc.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Credit Amount * with (+) and (-) buttons */}
                  <div>
                    {isFirst && (
                      <label className="block text-xs text-gray-500 font-normal mb-1">
                        Credit Amount *
                      </label>
                    )}
                    <div 
                      id={isFirst ? "tour-manual-credit-amount" : undefined}
                      className="flex items-center justify-between border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors"
                    >
                      <input
                        id={isFirst ? "tour-manual-input-credit-amount" : undefined}
                        type="number"
                        step="any"
                        value={entry.amount}
                        onChange={(e) => handleCreditAmountChange(entry.id, e.target.value)}
                        placeholder=""
                        className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                      />
                      <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
                        {isFirst ? (
                          <button
                            type="button"
                            onClick={handleAddCreditEntry}
                            className="w-4.5 h-4.5 rounded-full bg-[#1072ba] hover:bg-[#0e619e] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95"
                            title="Add another Credit row"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemoveCreditEntry(entry.id)}
                            className="w-4.5 h-4.5 rounded-full bg-gray-400 hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95"
                            title="Remove this Credit row"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 4: Reference Number & Transaction Date * */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
            {/* Reference Number */}
            <div id="tour-manual-ref-number">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Reference Number
              </label>
              <div className="border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  id="tour-manual-input-ref-number"
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Transaction Date * with Calendar icon */}
            <div id="tour-manual-tx-date">
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Transaction Date *
              </label>
              <div className="flex items-center justify-between border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 transition-colors">
                <input
                  id="tour-manual-input-tx-date"
                  type="text"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
                />
                <div 
                  onClick={() => dateInputRef.current?.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current?.focus()}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 ml-2"
                >
                  <Calendar className="w-4 h-4" />
                </div>
                {/* Hidden native date input to trigger date picker */}
                <input
                  ref={dateInputRef}
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-');
                      setTransactionDate(`${d}/${m}/${y}`);
                    }
                  }}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Payment Type & Account Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
            {/* Payment Type */}
            <div className="relative" ref={paymentTypeRef}>
              <label className="block text-xs text-gray-500 font-normal mb-1">
                Payment Type
              </label>
              <div
                onClick={() => setPaymentTypeDropdownOpen(!paymentTypeDropdownOpen)}
                className="w-full flex items-center justify-between border-b border-gray-300 hover:border-gray-500 focus-within:border-[#1072ba] pb-1 cursor-pointer transition-colors"
              >
                <span className={`text-xs ${paymentType ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                  {paymentType || ''}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${paymentTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {paymentTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg max-h-56 overflow-y-auto z-50 py-1 text-xs animate-in fade-in duration-100">
                  <div
                    onClick={() => {
                      setPaymentType('');
                      setPaymentTypeDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-400 italic"
                  >
                    -- None --
                  </div>
                  {PAYMENT_TYPES.map((pt) => (
                    <div
                      key={pt}
                      onClick={() => {
                        setPaymentType(pt);
                        setPaymentTypeDropdownOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                        paymentType === pt ? 'bg-gray-100 font-semibold text-[#1072ba]' : 'text-gray-800'
                      }`}
                    >
                      {pt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account Number */}
            <div>
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
          </div>

          {/* Row 6: Cheque Number & Routing Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
            {/* Cheque Number */}
            <div>
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

            {/* Routing Code */}
            <div>
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
          </div>

          {/* Row 7: Receipt Number & Bank Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
            {/* Receipt Number */}
            <div>
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

            {/* Bank Number */}
            <div>
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
          </div>

          {/* Row 8: Comments (Full Width) */}
          <div>
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

          {/* Balance Preview Indicator (if amounts entered) */}
          {(totalDebit > 0 || totalCredit > 0) && (
            <div className="flex items-center justify-end space-x-6 pt-2 text-xs">
              <div>
                <span className="text-gray-500">Total Debit: </span>
                <span className="font-semibold text-gray-900">{totalDebit.toLocaleString()} {selectedCurrency?.code || ''}</span>
              </div>
              <div>
                <span className="text-gray-500">Total Credit: </span>
                <span className="font-semibold text-gray-900">{totalCredit.toLocaleString()} {selectedCurrency?.code || ''}</span>
              </div>
              <div>
                {totalDebit === totalCredit ? (
                  <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Balanced</span>
                ) : (
                  <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">
                    Difference: {Math.abs(totalDebit - totalCredit).toLocaleString()} {selectedCurrency?.code || ''}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Form Action Buttons at Bottom matching Screenshot */}
          <div className="pt-8 pb-2 flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => navigate && navigate('accounting')}
              className="px-6 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-[3px] shadow-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            {isFormValid ? (
              <button
                id="tour-manual-submit-btn"
                type="submit"
                className="px-6 py-2 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[3px] shadow-xs cursor-pointer transition-colors"
              >
                Submit
              </button>
            ) : (
              <button
                id="tour-manual-submit-btn"
                type="button"
                disabled
                className="px-6 py-2 bg-[#dcdcdc] text-gray-400 text-xs font-semibold rounded-[3px] cursor-not-allowed select-none"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
