import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus } from 'lucide-react';

export const SCREENSHOT_SAMPLE_JOURNAL_ENTRIES = [
  {
    id: '57',
    office: 'Takashimaya Bank (TKB) - HO',
    txId: 'a2f68debe1a7',
    txDate: '12 October 2026 00:00:00',
    type: 'LIABILITY',
    createdBy: 'mifos',
    submittedDate: '12 October 2026 00:00:00',
    glCode: '220301',
    glName: 'Accrued Operating Expenses Payable',
    currency: 'VND',
    debit: null,
    credit: 5000000
  },
  {
    id: '58',
    office: 'Takashimaya Bank (TKB) - HO',
    txId: 'a2f68debe1a7',
    txDate: '12 October 2026 00:00:00',
    type: 'EXPENSE',
    createdBy: 'mifos',
    submittedDate: '12 October 2026 00:00:00',
    glCode: '530101',
    glName: 'Operating Expense',
    currency: 'VND',
    debit: 5000000,
    credit: null
  },
  {
    id: '61',
    office: 'Thu Duc Transaction Office',
    txId: 'S1',
    txDate: '13 October 2026',
    type: 'ASSET',
    createdBy: 'mifos',
    submittedDate: '13 October 2026 00:00:00',
    glCode: '110201',
    glName: 'Settlement Bank Account',
    currency: 'VND',
    debit: 5000000,
    credit: null
  },
  {
    id: '62',
    office: 'Thu Duc Transaction Office',
    txId: 'S1',
    txDate: '13 October 2026',
    type: 'LIABILITY',
    createdBy: 'mifos',
    submittedDate: '13 October 2026 00:00:00',
    glCode: '210102',
    glName: 'Current Account Deposits',
    currency: 'VND',
    debit: null,
    credit: 5000000
  },
  {
    id: '63',
    office: 'Thu Duc Transaction Office',
    txId: 'S2',
    txDate: '13 October 2026',
    type: 'LIABILITY',
    createdBy: 'mifos',
    submittedDate: '13 October 2026 00:00:00',
    glCode: '210102',
    glName: 'Current Account Deposits',
    currency: 'VND',
    debit: 2000000,
    credit: null
  },
  {
    id: '64',
    office: 'Thu Duc Transaction Office',
    txId: 'S2',
    txDate: '13 October 2026',
    type: 'ASSET',
    createdBy: 'mifos',
    submittedDate: '13 October 2026 00:00:00',
    glCode: '110201',
    glName: 'Settlement Bank Account',
    currency: 'VND',
    debit: null,
    credit: 2000000
  },
  {
    id: '65',
    office: 'Thu Duc Transaction Office',
    txId: 'S3',
    txDate: '13 October 2026',
    type: 'LIABILITY',
    createdBy: 'mifos',
    submittedDate: '13 October 2026 00:00:00',
    glCode: '210102',
    glName: 'Current Account Deposits',
    currency: 'VND',
    debit: 1000000,
    credit: null
  },
  {
    id: '66',
    office: 'Thu Duc Transaction Office',
    txId: 'S3',
    txDate: '13 October 2026',
    type: 'LIABILITY',
    createdBy: 'mifos',
    submittedDate: '13 October 2026 00:00:00',
    glCode: '220201',
    glName: 'Clearing Payable',
    currency: 'VND',
    debit: null,
    credit: 1000000
  },
  {
    id: '67',
    office: 'Thu Duc Transaction Office',
    txId: 'S4',
    txDate: '13 October 2026',
    type: 'LIABILITY',
    createdBy: 'mifos',
    submittedDate: '13 October 2026 00:00:00',
    glCode: '220201',
    glName: 'Clearing Payable',
    currency: 'VND',
    debit: 1000000,
    credit: null
  },
  {
    id: '68',
    office: 'Thu Duc Transaction Office',
    txId: 'S4',
    txDate: '13 October 2026',
    type: 'LIABILITY',
    createdBy: 'mifos',
    submittedDate: '13 October 2026 00:00:00',
    glCode: '210102',
    glName: 'Current Account Deposits',
    currency: 'VND',
    debit: null,
    credit: 1000000
  }
];

export const OPENING_BALANCE_MIGRATION_ENTRIES = [
  {
    id: '79',
    office: 'Takashimaya Bank (TKB) - HO',
    txId: 'TX-OPB-20261012-01',
    txDate: '12 October 2026 00:00:00',
    type: 'ASSET',
    createdBy: 'mifos',
    submittedDate: '12 October 2026 00:00:00',
    glCode: '110101',
    glName: 'Cash at Vault',
    currency: 'VND',
    debit: 200000000,
    credit: null,
    isTarget: true
  },
  {
    id: '80',
    office: 'Takashimaya Bank (TKB) - HO',
    txId: 'TX-OPB-20261012-01',
    txDate: '12 October 2026 00:00:00',
    type: 'ASSET',
    createdBy: 'mifos',
    submittedDate: '12 October 2026 00:00:00',
    glCode: '110201',
    glName: 'Settlement Bank Account',
    currency: 'VND',
    debit: 800000000,
    credit: null,
    isTarget: true
  },
  {
    id: '81',
    office: 'Takashimaya Bank (TKB) - HO',
    txId: 'TX-OPB-20261012-01',
    txDate: '12 October 2026 00:00:00',
    type: 'EQUITY',
    createdBy: 'mifos',
    submittedDate: '12 October 2026 00:00:00',
    glCode: '310101',
    glName: 'Contributed Capital',
    currency: 'VND',
    debit: null,
    credit: 1000000000,
    isTarget: true
  }
];

/**
 * JournalEntriesView
 * Pixel-perfect implementation of Mifos X Journal Entries (Search Journal Entries)
 * Matches screenshot media_1792397849040_eb2ddf29.png
 */
export default function JournalEntriesView({
  offices = [],
  glAccounts = [],
  hasOpeningBalanceSubmitted = false,
  customJournalEntries = [],
  navigate
}) {
  // Filter form states
  const [selectedOffice, setSelectedOffice] = useState('');
  const [officeDropdownOpen, setOfficeDropdownOpen] = useState(false);

  const [selectedGlAccount, setSelectedGlAccount] = useState('');
  const [glDropdownOpen, setGlDropdownOpen] = useState(false);

  const [filterType, setFilterType] = useState('All');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const [txDateFrom, setTxDateFrom] = useState('');
  const [txDateTo, setTxDateTo] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [submittedDateFrom, setSubmittedDateFrom] = useState('');
  const [submittedDateTo, setSubmittedDateTo] = useState('');

  // Pagination states
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [itemsPerPageDropdownOpen, setItemsPerPageDropdownOpen] = useState(false);

  // Filter trigger state
  const [isFiltered, setIsFiltered] = useState(false);

  const officeRef = useRef(null);
  const glRef = useRef(null);
  const filterRef = useRef(null);
  const itemsPerPageRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (officeRef.current && !officeRef.current.contains(e.target)) {
        setOfficeDropdownOpen(false);
      }
      if (glRef.current && !glRef.current.contains(e.target)) {
        setGlDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterDropdownOpen(false);
      }
      if (itemsPerPageRef.current && !itemsPerPageRef.current.contains(e.target)) {
        setItemsPerPageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen to practice event to filter dates
  useEffect(() => {
    const handleFilterDates = () => {
      setTxDateFrom('10/01/2026');
      setTxDateTo('10/31/2026');
      setIsFiltered(true);
    };
    const handleFilterManualDates = () => {
      setTxDateFrom('01/01/2026');
      setTxDateTo('10/31/2026');
      setIsFiltered(true);
    };

    const handleFilterTransfer = () => {
      setSelectedOffice('Thu Duc Transaction Office');
      setTxDateFrom('10/01/2026');
      setTxDateTo('10/31/2026');
      setIsFiltered(true);
    };

    window.addEventListener('practice-filter-journal-dates', handleFilterDates);
    window.addEventListener('practice-filter-manual-journal-dates', handleFilterManualDates);
    window.addEventListener('practice-filter-transfer-journal', handleFilterTransfer);
    return () => {
      window.removeEventListener('practice-filter-journal-dates', handleFilterDates);
      window.removeEventListener('practice-filter-manual-journal-dates', handleFilterManualDates);
      window.removeEventListener('practice-filter-transfer-journal', handleFilterTransfer);
    };
  }, []);

  // Computed displayed entries
  const displayedEntries = useMemo(() => {
    // Only display entries if submitted and filtered with valid date range
    if (!isFiltered && (!txDateFrom || !txDateTo)) {
      return [];
    }

    const customFlattened = (customJournalEntries || []).flatMap((rec) => {
      const rows = [];
      const isManualOpex = rec.referenceNumber === 'TKB-OPEX-202610-001' || String(rec.id).includes('OPEX') || rec.comments?.includes('OPEX');
      (rec.debits || []).forEach((d, dIdx) => {
        rows.push({
          id: `${rec.id}-${dIdx}`,
          office: rec.office,
          txId: rec.referenceNumber || `TX-${rec.id}`,
          txDate: rec.txDate,
          type: d.type || 'ASSET',
          createdBy: 'mifos',
          submittedDate: rec.submittedDate || rec.txDate,
          glCode: d.glCode,
          glName: d.name,
          currency: rec.currency,
          debit: d.amount,
          credit: null,
          isManualTarget: isManualOpex
        });
      });
      (rec.credits || []).forEach((c, cIdx) => {
        rows.push({
          id: `${rec.id}-cr-${cIdx}`,
          office: rec.office,
          txId: rec.referenceNumber || `TX-${rec.id}`,
          txDate: rec.txDate,
          type: c.type || 'LIABILITY',
          createdBy: 'mifos',
          submittedDate: rec.submittedDate || rec.txDate,
          glCode: c.glCode,
          glName: c.name,
          currency: rec.currency,
          debit: null,
          credit: c.amount,
          isManualTarget: isManualOpex
        });
      });
      return rows;
    });

    return [
      ...customFlattened,
      ...OPENING_BALANCE_MIGRATION_ENTRIES,
      ...SCREENSHOT_SAMPLE_JOURNAL_ENTRIES
    ];
  }, [isFiltered, txDateFrom, txDateTo, customJournalEntries]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* 1. Header: Journal Entries | Home / Accounting / Journal Entries */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            Journal Entries
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
            <span className="text-gray-500">Journal Entries</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate && navigate('accounting-create-journal')}
          className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Journal Entry</span>
        </button>
      </div>

      {/* 2. Main Container Card matching screenshot */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-6 space-y-6">
        
        {/* 2.1 Filter Form Controls (3 columns x 3 rows) */}
        <div id="tour-journal-filters-area" className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          
          {/* Row 1, Col 1: Office Name */}
          <div className="relative" ref={officeRef}>
            <label className="block text-[11px] text-gray-500 font-normal mb-0.5">
              Office Name
            </label>
            <div
              onClick={() => setOfficeDropdownOpen(!officeDropdownOpen)}
              className="w-full flex items-center justify-between border-b border-gray-300 pb-1 cursor-pointer hover:border-gray-400 focus:border-[#1072ba] transition-colors"
            >
              <span className={`text-xs ${selectedOffice ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {selectedOffice || ''}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>

            {officeDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg max-h-56 overflow-y-auto z-50 py-1">
                <div
                  onClick={() => {
                    setSelectedOffice('');
                    setOfficeDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  -- All Offices --
                </div>
                {offices.map(off => (
                  <div
                    key={off.id}
                    onClick={() => {
                      setSelectedOffice(off.name);
                      setOfficeDropdownOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-gray-100 ${
                      selectedOffice === off.name ? 'bg-sky-50 text-[#1072ba] font-medium' : 'text-gray-700'
                    }`}
                  >
                    {off.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 1, Col 2: GL Account Name or Code * */}
          <div className="relative" ref={glRef}>
            <label className="block text-[11px] text-gray-500 font-normal mb-0.5">
              GL Account Name or Code <span className="text-gray-500">*</span>
            </label>
            <div
              onClick={() => setGlDropdownOpen(!glDropdownOpen)}
              className="w-full flex items-center justify-between border-b border-gray-300 pb-1 cursor-pointer hover:border-gray-400 focus:border-[#1072ba] transition-colors"
            >
              <span className={`text-xs ${selectedGlAccount ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {selectedGlAccount || ''}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>

            {glDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg max-h-56 overflow-y-auto z-50 py-1">
                <div
                  onClick={() => {
                    setSelectedGlAccount('');
                    setGlDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  -- Select GL Account --
                </div>
                {glAccounts
                  .filter(acc => (acc.usage || '').toLowerCase() === 'detail')
                  .map(acc => (
                    <div
                      key={acc.id || acc.glCode}
                      onClick={() => {
                        setSelectedGlAccount(`(${acc.glCode}) ${acc.name}`);
                        setGlDropdownOpen(false);
                      }}
                      className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-gray-100 ${
                        selectedGlAccount.includes(acc.glCode) ? 'bg-sky-50 text-[#1072ba] font-medium' : 'text-gray-700'
                      }`}
                    >
                      ({acc.glCode}) {acc.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Row 1, Col 3: Filter */}
          <div className="relative" ref={filterRef}>
            <label className="block text-[11px] text-gray-500 font-normal mb-0.5">
              Filter
            </label>
            <div
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              className="w-full flex items-center justify-between border-b border-gray-300 pb-1 cursor-pointer hover:border-gray-400 focus:border-[#1072ba] transition-colors"
            >
              <span className="text-xs text-gray-800 font-normal">
                {filterType}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </div>

            {filterDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[2px] shadow-lg z-50 py-1">
                {['All', 'Manual Entries', 'System Entries'].map(item => (
                  <div
                    key={item}
                    onClick={() => {
                      setFilterType(item);
                      setFilterDropdownOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-gray-100 ${
                      filterType === item ? 'bg-sky-50 text-[#1072ba] font-medium' : 'text-gray-700'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 2, Col 1: Transaction Date From */}
          <div id="tour-journal-date-from" className="relative">
            <label className="block text-[11px] text-gray-500 font-normal mb-0.5">
              Transaction Date From
            </label>
            <div className="w-full flex items-center justify-between border-b border-gray-300 pb-1">
              <input
                type="text"
                value={txDateFrom}
                onChange={(e) => {
                  setTxDateFrom(e.target.value);
                  setIsFiltered(true);
                }}
                placeholder="M/D/YYYY"
                className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
              />
              <Calendar className="w-3.5 h-3.5 text-gray-500 cursor-pointer flex-shrink-0" />
            </div>
          </div>

          {/* Row 2, Col 2: Transaction Date To */}
          <div id="tour-journal-date-to" className="relative">
            <label className="block text-[11px] text-gray-500 font-normal mb-0.5">
              Transaction Date To
            </label>
            <div className="w-full flex items-center justify-between border-b border-gray-300 pb-1">
              <input
                type="text"
                value={txDateTo}
                onChange={(e) => {
                  setTxDateTo(e.target.value);
                  setIsFiltered(true);
                }}
                placeholder="M/D/YYYY"
                className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
              />
              <Calendar className="w-3.5 h-3.5 text-gray-500 cursor-pointer flex-shrink-0" />
            </div>
          </div>

          {/* Row 2, Col 3: Transaction ID */}
          <div className="relative">
            <label className="block text-[11px] text-gray-500 font-normal mb-0.5">
              Transaction ID
            </label>
            <div className="w-full border-b border-gray-300 pb-1">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Row 3, Col 1: Submitted on Date From */}
          <div className="relative">
            <label className="block text-[11px] text-gray-500 font-normal mb-0.5">
              Submitted on Date From
            </label>
            <div className="w-full flex items-center justify-between border-b border-gray-300 pb-1">
              <input
                type="text"
                value={submittedDateFrom}
                onChange={(e) => setSubmittedDateFrom(e.target.value)}
                placeholder=""
                className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
              />
              <Calendar className="w-3.5 h-3.5 text-gray-500 cursor-pointer flex-shrink-0" />
            </div>
          </div>

          {/* Row 3, Col 2: Submitted on Date To */}
          <div className="relative">
            <label className="block text-[11px] text-gray-500 font-normal mb-0.5">
              Submitted on Date To
            </label>
            <div className="w-full flex items-center justify-between border-b border-gray-300 pb-1">
              <input
                type="text"
                value={submittedDateTo}
                onChange={(e) => setSubmittedDateTo(e.target.value)}
                placeholder=""
                className="w-full text-xs text-gray-800 focus:outline-none bg-transparent"
              />
              <Calendar className="w-3.5 h-3.5 text-gray-500 cursor-pointer flex-shrink-0" />
            </div>
          </div>

          {/* Row 3, Col 3: Empty spacer or search trigger */}
          <div className="flex items-end justify-end pb-1">
            <button
              type="button"
              onClick={() => setIsFiltered(true)}
              className="text-xs text-[#1072ba] hover:underline font-medium cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* 2.2 Table of Journal Entries */}
        <div className="mt-8 overflow-x-auto border border-gray-100 rounded-[2px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] text-gray-500 font-normal">
                <th className="py-2.5 px-3 font-normal">Entry ID</th>
                <th className="py-2.5 px-3 font-normal">Office</th>
                <th className="py-2.5 px-3 font-normal">Transaction ID</th>
                <th className="py-2.5 px-3 font-normal">Transaction Date</th>
                <th className="py-2.5 px-3 font-normal">Type</th>
                <th className="py-2.5 px-3 font-normal">Created By</th>
                <th className="py-2.5 px-3 font-normal">Submitted on date</th>
                <th className="py-2.5 px-3 font-normal">Account Code</th>
                <th className="py-2.5 px-3 font-normal">Account Name</th>
                <th className="py-2.5 px-3 font-normal">Currency</th>
                <th className="py-2.5 px-3 font-normal text-right">Debit</th>
                <th className="py-2.5 px-3 font-normal text-right">Credit</th>
              </tr>
            </thead>
            {displayedEntries.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={12} className="py-12 text-center text-xs text-gray-400">
                    No records found
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                {/* 3 Opening Balance Migration Target Entries highlighted together */}
                <tbody id="tour-journal-entry-target" className="border-b-2 border-sky-400">
                  {displayedEntries.filter(item => item.isTarget).map((item, index) => (
                    <tr
                      key={`${item.id}-${item.glCode}-${index}`}
                      className="border-b border-sky-100 bg-sky-50/50 hover:bg-sky-50 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-normal text-gray-800">{item.id}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800">{item.office}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800 font-mono text-[11px]">{item.txId}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-700 whitespace-nowrap">{item.txDate}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800">{item.type}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-700">{item.createdBy}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-700 whitespace-nowrap">{item.submittedDate}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800 font-medium">{item.glCode}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800">{item.glName}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-700">{item.currency}</td>
                      <td className="py-2.5 px-3 font-normal text-right text-gray-900 font-mono">
                        {item.debit ? item.debit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                      </td>
                      <td className="py-2.5 px-3 font-normal text-right text-gray-900 font-mono">
                        {item.credit ? item.credit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Manual Journal Entry Target Entries (Phần 7: Manual Journal Entries) */}
                {displayedEntries.some(item => item.txId === 'TKB-OPEX-202610-001' || item.isManualTarget) && (
                  <tbody id="tour-journal-entry-manual-opex" className="border-b-2 border-amber-400">
                    {displayedEntries.filter(item => item.txId === 'TKB-OPEX-202610-001' || item.isManualTarget).map((item, index) => (
                      <tr
                        key={`manual-${item.id}-${item.glCode}-${index}`}
                        className="border-b border-amber-100 bg-amber-50/60 hover:bg-amber-50 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-normal text-gray-800">{item.id}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800">{item.office}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800 font-mono text-[11px] font-semibold text-amber-900">{item.txId}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-700 whitespace-nowrap">{item.txDate}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800">{item.type}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-700">{item.createdBy}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-700 whitespace-nowrap">{item.submittedDate}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800 font-medium">{item.glCode}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800">{item.glName}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-700">{item.currency}</td>
                        <td className="py-2.5 px-3 font-normal text-right text-gray-900 font-mono font-medium">
                          {item.debit ? item.debit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                        </td>
                        <td className="py-2.5 px-3 font-normal text-right text-gray-900 font-mono font-medium">
                          {item.credit ? item.credit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}

                {/* CASA Transfer Target Entries (Phần 5: Account Transfer) */}
                {displayedEntries.some(item => item.isTransferTarget || item.txId === 'S3' || item.txId === 'S4' || item.id === '65' || item.id === '66' || item.id === '67' || item.id === '68') && (
                  <tbody id="tour-journal-transfer-entries" className="border-b-2 border-emerald-400">
                    {displayedEntries.filter(item => item.isTransferTarget || item.txId === 'S3' || item.txId === 'S4' || item.id === '65' || item.id === '66' || item.id === '67' || item.id === '68').map((item, index) => (
                      <tr
                        key={`transfer-${item.id}-${item.glCode}-${index}`}
                        className="border-b border-emerald-100 bg-emerald-50/60 hover:bg-emerald-50 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-normal text-gray-800">{item.id}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800">{item.office}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800 font-mono text-[11px] font-semibold text-emerald-900">{item.txId}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-700 whitespace-nowrap">{item.txDate}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800">{item.type}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-700">{item.createdBy}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-700 whitespace-nowrap">{item.submittedDate}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800 font-medium">{item.glCode}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-800">{item.glName}</td>
                        <td className="py-2.5 px-3 font-normal text-gray-700">{item.currency}</td>
                        <td className="py-2.5 px-3 font-normal text-right text-gray-900 font-mono font-medium">
                          {item.debit ? item.debit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                        </td>
                        <td className="py-2.5 px-3 font-normal text-right text-gray-900 font-mono font-medium">
                          {item.credit ? item.credit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}

                {/* Other standard screenshot journal entries */}
                <tbody>
                  {displayedEntries.filter(item => !item.isTarget && !item.isManualTarget && item.txId !== 'TKB-OPEX-202610-001' && !item.isTransferTarget && item.txId !== 'S3' && item.txId !== 'S4' && item.id !== '65' && item.id !== '66' && item.id !== '67' && item.id !== '68').map((item, index) => (
                    <tr
                      key={`${item.id}-${item.glCode}-${index}`}
                      className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-normal text-gray-800">{item.id}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800">{item.office}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800 font-mono text-[11px]">{item.txId}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-700 whitespace-nowrap">{item.txDate}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800">{item.type}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-700">{item.createdBy}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-700 whitespace-nowrap">{item.submittedDate}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800 font-medium">{item.glCode}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-800">{item.glName}</td>
                      <td className="py-2.5 px-3 font-normal text-gray-700">{item.currency}</td>
                      <td className="py-2.5 px-3 font-normal text-right text-gray-900 font-mono">
                        {item.debit ? item.debit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                      </td>
                      <td className="py-2.5 px-3 font-normal text-right text-gray-900 font-mono">
                        {item.credit ? item.credit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>

          {/* 2.3 Pagination Footer */}
          <div className="py-3 px-4 flex items-center justify-end space-x-6 text-xs text-gray-500 border-t border-gray-100">
            {/* Items per page selector */}
            <div className="flex items-center space-x-2 relative" ref={itemsPerPageRef}>
              <span>Items per page:</span>
              <div
                onClick={() => setItemsPerPageDropdownOpen(!itemsPerPageDropdownOpen)}
                className="flex items-center space-x-1 border-b border-gray-300 pb-0.5 cursor-pointer font-medium text-gray-700"
              >
                <span>{itemsPerPage}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>

              {itemsPerPageDropdownOpen && (
                <div className="absolute bottom-full right-0 mb-1 bg-white border border-gray-200 rounded-[2px] shadow-lg z-50 py-1">
                  {[10, 25, 50, 100].map(val => (
                    <div
                      key={val}
                      onClick={() => {
                        setItemsPerPage(val);
                        setItemsPerPageDropdownOpen(false);
                      }}
                      className={`px-3 py-1 text-xs cursor-pointer hover:bg-gray-100 ${
                        itemsPerPage === val ? 'bg-sky-50 text-[#1072ba] font-medium' : 'text-gray-700'
                      }`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Range display */}
            <div>
              {displayedEntries.length === 0 ? '0 – 0 of 0' : `1 – ${displayedEntries.length} of ${displayedEntries.length}`}
            </div>

            {/* Page navigation buttons */}
            <div className="flex items-center space-x-2 text-gray-400">
              <button
                type="button"
                disabled
                className="p-1 cursor-not-allowed hover:text-gray-400"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled
                className="p-1 cursor-not-allowed hover:text-gray-400"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled
                className="p-1 cursor-not-allowed hover:text-gray-400"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled
                className="p-1 cursor-not-allowed hover:text-gray-400"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
