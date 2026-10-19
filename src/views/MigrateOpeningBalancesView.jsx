import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

/**
 * MigrateOpeningBalancesView
 * Pixel-perfect implementation of Mifos X Migrate Opening Balances (Office-wise)
 * Matches screenshots:
 * - Image 1: media_1792396653363_5ae3c121.png (Before selecting office & clicking Retrieve)
 * - Image 2: media_1792396664673_d4dfe35f.png (Office dropdown open)
 * - Image 3: media_1792396694691_4cec17c2.png (Retrieved, Contra Account, Currency, Date, ASSET accounts 1-6)
 * - Image 4: media_1792396708392_3077676e.png (ASSET accounts 7-13, LIABILITY accounts 1-2)
 * - Image 5: media_1792396724672_eb8d9f2a.png (LIABILITY accounts 3-12)
 */

export const MIGRATION_OPENING_BALANCE_ACCOUNTS = [
  // ASSET Accounts (13 accounts matching Image 3 & Image 4)
  { type: 'ASSET', glCode: '110101', name: 'Cash at Vault' },
  { type: 'ASSET', glCode: '110102', name: 'Cash at Teller' },
  { type: 'ASSET', glCode: '110201', name: 'Settlement Bank Account' },
  { type: 'ASSET', glCode: '110202', name: 'Central Bank Balance' },
  { type: 'ASSET', glCode: '110301', name: 'Interbank Placements' },
  { type: 'ASSET', glCode: '120101', name: 'Retail Loan Principal' },
  { type: 'ASSET', glCode: '120201', name: 'Loan Interest Receivable' },
  { type: 'ASSET', glCode: '120202', name: 'Loan Fee Receivable' },
  { type: 'ASSET', glCode: '120203', name: 'Loan Penalty Receivable' },
  { type: 'ASSET', glCode: '120301', name: 'Allowance for Credit Losses' },
  { type: 'ASSET', glCode: '130101', name: 'Clearing Receivable' },
  { type: 'ASSET', glCode: '130102', name: 'Interbranch Receivable' },
  { type: 'ASSET', glCode: '130103', name: 'Loan Transfer Suspense' },

  // LIABILITY Accounts (12 accounts matching Image 4 & Image 5)
  { type: 'LIABILITY', glCode: '210101', name: 'Savings Deposits' },
  { type: 'LIABILITY', glCode: '210102', name: 'Current Account Deposits' },
  { type: 'LIABILITY', glCode: '210103', name: 'Fixed Deposits' },
  { type: 'LIABILITY', glCode: '210104', name: 'Recurring Deposits' },
  { type: 'LIABILITY', glCode: '210201', name: 'Savings Interest Payable' },
  { type: 'LIABILITY', glCode: '210202', name: 'Fixed Deposit Interest Payable' },
  { type: 'LIABILITY', glCode: '220101', name: 'Interbank Borrowings' },
  { type: 'LIABILITY', glCode: '220201', name: 'Clearing Payable' },
  { type: 'LIABILITY', glCode: '220202', name: 'Loan Overpayment Liability' },
  { type: 'LIABILITY', glCode: '220203', name: 'Unapplied Customer Funds' },
  { type: 'LIABILITY', glCode: '220204', name: 'Loan Overpayment Liability' },
  { type: 'LIABILITY', glCode: '220301', name: 'Accrued Operating Expenses Payable' },

  // EQUITY Accounts
  { type: 'EQUITY', glCode: '310101', name: 'Contributed Capital' },

  // INCOME Accounts (11 accounts matching Image 6 & Image 7)
  { type: 'INCOME', glCode: '410101', name: 'Loan Interest Income' },
  { type: 'INCOME', glCode: '410102', name: 'Interbank Interest Income' },
  { type: 'INCOME', glCode: '420101', name: 'Loan Processing Fee Income' },
  { type: 'INCOME', glCode: '420102', name: 'Savings Service Fee Income' },
  { type: 'INCOME', glCode: '420103', name: 'Loan Penalty Income' },
  { type: 'INCOME', glCode: '420104', name: 'Payment Service Fee Income' },
  { type: 'INCOME', glCode: '420105', name: 'Loan Recovery Income' },
  { type: 'INCOME', glCode: '420107', name: 'Fixed Deposit Penalty Income' },
  { type: 'INCOME', glCode: '420108', name: 'Recurring Deposit Penalty Income' },
  { type: 'INCOME', glCode: '420109', name: 'Loan Fee Income' },
  { type: 'INCOME', glCode: '420110', name: 'Loan Recovery Income' },

  // EXPENSE Accounts (12 accounts matching Image 7 & Image 8)
  { type: 'EXPENSE', glCode: '510101', name: 'Savings Interest Expense' },
  { type: 'EXPENSE', glCode: '510102', name: 'Fixed Deposit Interest Expense' },
  { type: 'EXPENSE', glCode: '510103', name: 'Interbank Funding Expense' },
  { type: 'EXPENSE', glCode: '510201', name: 'Interbank Interest Expense' },
  { type: 'EXPENSE', glCode: '520101', name: 'Loan Write-off Expense' },
  { type: 'EXPENSE', glCode: '520102', name: 'Credit Impairment Expense' },
  { type: 'EXPENSE', glCode: '520104', name: 'Loan Goodwill Credit Expense' },
  { type: 'EXPENSE', glCode: '520105', name: 'Loan Charge-off Expense' },
  { type: 'EXPENSE', glCode: '520106', name: 'Loan Fraud Charge-off Expense' },
  { type: 'EXPENSE', glCode: '530101', name: 'Operating Expense' },
  { type: 'EXPENSE', glCode: '530102', name: 'Salary Expense' },
  { type: 'EXPENSE', glCode: '530103', name: 'Bank Charges Expense' }
];

export default function MigrateOpeningBalancesView({
  offices = [],
  currencies = [],
  glAccounts = [],
  financialActivities = [],
  navigate,
  onSubmitOpeningBalances
}) {
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [officeDropdownOpen, setOfficeDropdownOpen] = useState(false);
  const [officeTouched, setOfficeTouched] = useState(false);

  const [isRetrieved, setIsRetrieved] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [currencyTouched, setCurrencyTouched] = useState(false);

  const [openingDate, setOpeningDate] = useState('');
  const [dateTouched, setDateTouched] = useState(false);

  // Store debit and credit entries per GL code
  const [debitValues, setDebitValues] = useState({});
  const [creditValues, setCreditValues] = useState({});

  const officeDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (officeDropdownRef.current && !officeDropdownRef.current.contains(e.target)) {
        setOfficeDropdownOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Practice tour autofill listener
  useEffect(() => {
    const handleAutofill = () => {
      const hoOffice = (offices && offices.length > 0)
        ? offices.find(o => o.id === '1' || o.name.includes('HO') || o.name.includes('Takashimaya')) || offices[0]
        : { id: '1', name: 'Takashimaya Bank (TKB) - HO' };

      setSelectedOffice(hoOffice);
      setIsRetrieved(true);
      setSelectedCurrency({ code: 'VND', name: 'Vietnamese Dong', symbol: '₫' });
      setOpeningDate('10/12/2026');
      setDebitValues(prev => ({
        ...prev,
        '110101': '200000000',
        '110201': '800000000'
      }));
      setCreditValues(prev => ({
        ...prev,
        '310101': '1000000000'
      }));
    };

    window.addEventListener('practice-autofill-opening-balances', handleAutofill);

    const handleSingleAutofill = (e) => {
      if (e.detail?.glCode && e.detail?.debit !== undefined) {
        setDebitValues(prev => ({
          ...prev,
          [e.detail.glCode]: String(e.detail.debit)
        }));
      }
      if (e.detail?.glCode && e.detail?.credit !== undefined) {
        setCreditValues(prev => ({
          ...prev,
          [e.detail.glCode]: String(e.detail.credit)
        }));
      }
    };
    window.addEventListener('practice-autofill-single-balance', handleSingleAutofill);

    return () => {
      window.removeEventListener('practice-autofill-opening-balances', handleAutofill);
      window.removeEventListener('practice-autofill-single-balance', handleSingleAutofill);
    };
  }, [offices]);

  // Compute Opening Balances Contra Account from financial activities
  const contraAccountText = useMemo(() => {
    const contraMapping = financialActivities.find(
      fa => String(fa.activityCode) === '300' || String(fa.id) === '5'
    );
    if (contraMapping) {
      return `(${contraMapping.accountCode}) .........${contraMapping.accountName}`;
    }
    return '(310199) .........Opening Balance Contra';
  }, [financialActivities]);

  // Fallback office list if none provided
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

  // Currency options (defaults to USD & VND if empty)
  const currencyList = useMemo(() => {
    if (currencies && currencies.length > 0) return currencies;
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' }
    ];
  }, [currencies]);

  // Calculate totals
  const totalDebit = useMemo(() => {
    return Object.values(debitValues).reduce((acc, val) => {
      const num = parseFloat(val);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
  }, [debitValues]);

  const totalCredit = useMemo(() => {
    return Object.values(creditValues).reduce((acc, val) => {
      const num = parseFloat(val);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
  }, [creditValues]);

  const handleRetrieve = () => {
    setOfficeTouched(true);
    if (!selectedOffice) return;
    setIsRetrieved(true);
  };

  const handleDebitChange = (glCode, val) => {
    setDebitValues(prev => ({
      ...prev,
      [glCode]: val
    }));
  };

  const handleCreditChange = (glCode, val) => {
    setCreditValues(prev => ({
      ...prev,
      [glCode]: val
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* 1. Header row: Migrate Opening Balances | Home / Accounting / Migrate Opening Balances */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          Migrate Opening Balances
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
          <span className="text-gray-500">Migrate Opening Balances</span>
        </div>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8">
        
        {/* Office Selection Row */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 max-w-xl relative" ref={officeDropdownRef}>
            <label className={`block text-xs font-normal mb-1 ${!selectedOffice ? 'text-red-500' : 'text-gray-700'}`}>
              Office <span className="text-red-500">*</span>
            </label>
            
            <div
              id="tour-office-select-field"
              onClick={() => setOfficeDropdownOpen(!officeDropdownOpen)}
              className={`w-full flex items-center justify-between pb-1 cursor-pointer transition-colors border-b ${
                !selectedOffice
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              <span className={`text-xs ${selectedOffice ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {selectedOffice ? selectedOffice.name : ''}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${officeDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Validation error text matching Image 1 */}
            {!selectedOffice && (
              <p className="text-[11px] text-red-500 mt-1">
                Office is required
              </p>
            )}

            {/* Dropdown Menu matching Image 2 */}
            {officeDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg max-h-56 overflow-y-auto z-50 text-xs py-1 animate-in fade-in duration-100">
                {officeList.map((office) => (
                  <div
                    key={office.id}
                    onClick={() => {
                      setSelectedOffice(office);
                      setOfficeDropdownOpen(false);
                      setIsRetrieved(false); // require clicking Retrieve to reload
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                      selectedOffice?.id === office.id ? 'bg-gray-100 font-semibold text-[#1072ba]' : 'text-gray-800'
                    }`}
                  >
                    {office.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Retrieve Button matching Image 1 & Image 3 */}
          <div>
            <button
              id="tour-btn-retrieve"
              type="button"
              onClick={handleRetrieve}
              className="px-6 py-2 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
            >
              Retrieve
            </button>
          </div>
        </div>

        {/* 3. Detailed Opening Balances Section (After clicking Retrieve - Images 3, 4, 5) */}
        {isRetrieved && (
          <div id="tour-migration-form-card" className="mt-8 pt-6 border-t border-gray-100 space-y-6 animate-in fade-in duration-200">
            {/* Opening Balances Contra Account Row */}
            <div className="flex items-center justify-between text-xs py-2">
              <span className="font-normal text-gray-800">
                Opening Balances Contra Account
              </span>
              <span className="font-normal text-gray-800 tracking-tight">
                {contraAccountText}
              </span>
            </div>

            {/* Currency & Opening Balances Date Row (Image 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
              {/* Currency field */}
              <div className="relative" ref={currencyDropdownRef}>
                <label className={`block text-xs font-normal mb-1 ${!selectedCurrency ? 'text-red-500' : 'text-gray-700'}`}>
                  Currency <span className="text-red-500">*</span>
                </label>

                <div
                  id="tour-currency-field"
                  onClick={() => {
                    setCurrencyTouched(true);
                    setCurrencyDropdownOpen(!currencyDropdownOpen);
                  }}
                  className={`w-full flex items-center justify-between pb-1 cursor-pointer transition-colors border-b ${
                    !selectedCurrency
                      ? 'border-red-500'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className={`text-xs ${selectedCurrency ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {selectedCurrency ? `${selectedCurrency.code} - ${selectedCurrency.name}` : ''}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {!selectedCurrency && (
                  <p className="text-[11px] text-red-500 mt-1">
                    Currency is required
                  </p>
                )}

                {currencyDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg max-h-48 overflow-y-auto z-50 text-xs py-1">
                    {currencyList.map((curr) => (
                      <div
                        key={curr.code}
                        onClick={() => {
                          setSelectedCurrency(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      >
                        {curr.code} - {curr.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Opening Balances Date field */}
              <div id="tour-opening-date-field">
                <label className={`block text-xs font-normal mb-1 ${!openingDate ? 'text-red-500' : 'text-gray-700'}`}>
                  Opening Balances Date <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="date"
                    value={openingDate}
                    onChange={(e) => {
                      setOpeningDate(e.target.value);
                      setDateTouched(true);
                    }}
                    className={`w-full pb-1 text-xs text-gray-800 border-b focus:outline-none transition-colors ${
                      !openingDate ? 'border-red-500' : 'border-gray-300 focus:border-[#1072ba]'
                    }`}
                  />
                  {!openingDate && (
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-1 bottom-2 pointer-events-none" />
                  )}
                </div>

                {!openingDate && (
                  <p className="text-[11px] text-red-500 mt-1">
                    Opening Balances Date is required
                  </p>
                )}
              </div>
            </div>

            {/* Table Header Row: Type, GL Code, Account, Total Debit: $0.00, Total Credit: $0.00 */}
            <div className="pt-6 border-t border-gray-100">
              <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-xs font-semibold text-gray-800">
                <div className="col-span-2">Type</div>
                <div className="col-span-2">GL Code</div>
                <div className="col-span-4">Account</div>
                <div className="col-span-2 text-right">
                  Total Debit: {selectedCurrency?.symbol || '$'}{totalDebit.toFixed(2)}
                </div>
                <div className="col-span-2 text-right">
                  Total Credit: {selectedCurrency?.symbol || '$'}{totalCredit.toFixed(2)}
                </div>
              </div>

              {/* Account Rows matching Image 3, 4, 5 */}
              <div className="divide-y divide-gray-100 text-xs">
                {MIGRATION_OPENING_BALANCE_ACCOUNTS.map((acc, index) => {
                  const isFirstOfType = index === 0 || MIGRATION_OPENING_BALANCE_ACCOUNTS[index - 1].type !== acc.type;

                  return (
                    <div 
                      key={acc.glCode}
                      id={`tour-row-${acc.glCode}`}
                      className="grid grid-cols-12 gap-4 py-4 items-center hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Type Column (renders only on first row of group) */}
                      <div className="col-span-2 font-normal text-gray-900">
                        {isFirstOfType ? acc.type : ''}
                      </div>

                      {/* GL Code Column */}
                      <div className="col-span-2 font-normal text-gray-800">
                        {acc.glCode}
                      </div>

                      {/* Account Name Column */}
                      <div className="col-span-4 font-normal text-gray-800 pr-2">
                        {acc.name}
                      </div>

                      {/* Debit Input */}
                      <div id={`tour-cell-debit-${acc.glCode}`} className="col-span-2">
                        <label className="block text-[11px] text-gray-400 mb-0.5">Debit</label>
                        <input
                          id={`tour-input-debit-${acc.glCode}`}
                          type="number"
                          step="any"
                          value={debitValues[acc.glCode] || ''}
                          onChange={(e) => handleDebitChange(acc.glCode, e.target.value)}
                          className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] focus:outline-none pb-0.5"
                        />
                      </div>

                      {/* Credit Input */}
                      <div id={`tour-cell-credit-${acc.glCode}`} className="col-span-2">
                        <label className="block text-[11px] text-gray-400 mb-0.5">Credit</label>
                        <input
                          id={`tour-input-credit-${acc.glCode}`}
                          type="number"
                          step="any"
                          value={creditValues[acc.glCode] || ''}
                          onChange={(e) => handleCreditChange(acc.glCode, e.target.value)}
                          className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] focus:outline-none pb-0.5"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Form Action Buttons at Bottom matching Image 8 */}
              <div className="pt-10 pb-4 flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate && navigate('accounting')}
                  className="px-6 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-[3px] cursor-pointer shadow-xs transition-colors"
                >
                  Cancel
                </button>
                {selectedCurrency && openingDate ? (
                  <button
                    id="tour-submit-opening-balances-btn"
                    type="button"
                    onClick={() => {
                      if (onSubmitOpeningBalances) {
                        onSubmitOpeningBalances({
                          office: selectedOffice ? selectedOffice.name : 'Takashimaya Bank (TKB) - HO',
                          currency: selectedCurrency?.code || 'VND',
                          date: openingDate || '10/12/2026',
                          entries: [
                            { glCode: '110101', name: 'Cash at Vault', type: 'ASSET', debit: Number(debitValues['110101']) || 200000000, credit: 0 },
                            { glCode: '110201', name: 'Settlement Bank Account', type: 'ASSET', debit: Number(debitValues['110201']) || 800000000, credit: 0 },
                            { glCode: '310101', name: 'Contributed Capital', type: 'EQUITY', debit: 0, credit: Number(creditValues['310101']) || 1000000000 }
                          ]
                        });
                      } else {
                        alert('Opening balances recorded successfully!');
                      }
                    }}
                    className="px-6 py-2 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[3px] shadow-xs cursor-pointer transition-colors"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    id="tour-submit-opening-balances-btn"
                    type="button"
                    disabled
                    className="px-6 py-2 bg-[#dcdcdc] text-gray-400 text-xs font-semibold rounded-[3px] cursor-not-allowed select-none"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mifos Footer matching Image 1 */}
      {!isRetrieved && (
        <div className="mt-16 text-center text-xs text-gray-400 space-y-1">
          <div className="flex items-center justify-center space-x-4">
            <span>Mifos</span>
            <span>250331 -</span>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <span>Fineract</span>
            <span>1.16.0 - SNAPSHOT</span>
          </div>
          <div className="text-[11px] text-gray-400 pt-2">
            http://192.168.56.101:8080
          </div>
          <div className="text-[11px] text-gray-400 pt-3">
            Mifos X by Mifos
          </div>
        </div>
      )}
    </div>
  );
}
