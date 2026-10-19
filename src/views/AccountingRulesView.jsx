import React, { useState, useMemo } from 'react';
import { Plus, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

export default function AccountingRulesView({
  rules = [],
  navigate,
  onNavigateCreateRule
}) {
  const [filterText, setFilterText] = useState('');
  const [isFilterFocused, setIsFilterFocused] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Default initial rule if none provided
  const ruleList = useMemo(() => {
    if (rules && rules.length > 0) return rules;
    return [
      {
        id: '1',
        name: 'Operating Expense Accrual',
        officeName: 'Takashimaya Bank (TKB) - HO',
        debitTags: '',
        debitAccount: 'Operating Expense',
        creditTags: '',
        creditAccount: 'Accrued Operating Expenses Payable'
      }
    ];
  }, [rules]);

  // Filtered rows
  const filteredRules = useMemo(() => {
    if (!filterText.trim()) return ruleList;
    const query = filterText.toLowerCase().trim();
    return ruleList.filter((r) => {
      const name = (r.name || '').toLowerCase();
      const office = (r.officeName || '').toLowerCase();
      const debitTags = (r.debitTags || '').toLowerCase();
      const debitAcc = (r.debitAccount || '').toLowerCase();
      const creditTags = (r.creditTags || '').toLowerCase();
      const creditAcc = (r.creditAccount || '').toLowerCase();

      return (
        name.includes(query) ||
        office.includes(query) ||
        debitTags.includes(query) ||
        debitAcc.includes(query) ||
        creditTags.includes(query) ||
        creditAcc.includes(query)
      );
    });
  }, [ruleList, filterText]);

  const totalCount = filteredRules.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const displayedRules = filteredRules.slice(startIndex, startIndex + pageSize);

  const handleAddRuleClick = () => {
    if (onNavigateCreateRule) {
      onNavigateCreateRule();
    } else if (navigate) {
      navigate('accounting-create-rule');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* 1. Top Bar: Title & Breadcrumbs on left, [+ Add Rule] button on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            Accounting Rules
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
            <span className="text-gray-500">Accounting Rules</span>
          </div>
        </div>

        <button
          id="tour-add-rule-btn"
          onClick={handleAddRuleClick}
          className="bg-[#1072ba] hover:bg-[#0e63a3] text-white text-xs font-medium px-4 py-2 rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] flex items-center space-x-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* 2. Filter input (Material underline style matching screenshot) */}
      <div className="mb-6">
        <div
          className={`relative pt-3 pb-1 border-b transition-colors ${
            isFilterFocused ? 'border-[#1072ba]' : 'border-gray-400/80'
          }`}
        >
          <label
            className={`absolute left-0 transition-all duration-200 pointer-events-none select-none ${
              isFilterFocused || filterText
                ? '-top-0.5 text-[10px] text-[#1072ba] font-medium'
                : 'top-3 text-xs text-gray-500'
            }`}
          >
            Filter
          </label>
          <input
            type="text"
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            onFocus={() => setIsFilterFocused(true)}
            onBlur={() => setIsFilterFocused(false)}
            className="w-full bg-transparent text-xs text-gray-800 outline-none pt-0.5"
          />
        </div>
      </div>

      {/* 3. Table Card */}
      <div id="tour-accounting-rules-table" className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-xs font-normal text-gray-600 px-6 py-4 whitespace-nowrap">
                  Name
                </th>
                <th className="text-xs font-normal text-gray-600 px-6 py-4 whitespace-nowrap">
                  Office
                </th>
                <th className="text-xs font-normal text-gray-600 px-6 py-4 whitespace-nowrap">
                  Debit Tags
                </th>
                <th className="text-xs font-normal text-gray-600 px-6 py-4 whitespace-nowrap">
                  Debit Account
                </th>
                <th className="text-xs font-normal text-gray-600 px-6 py-4 whitespace-nowrap">
                  Credit Tags
                </th>
                <th className="text-xs font-normal text-gray-600 px-6 py-4 whitespace-nowrap">
                  Credit Account
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedRules.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-xs text-gray-500 italic"
                  >
                    No accounting rules found.
                  </td>
                </tr>
              ) : (
                displayedRules.map((rule, idx) => (
                  <tr
                    key={rule.id || idx}
                    onClick={() => {
                      if (navigate) navigate('accounting-view-rule', { rule });
                    }}
                    className="border-b border-gray-100 hover:bg-black/[0.04] transition-colors cursor-pointer"
                  >
                    <td className="text-xs text-gray-900 px-6 py-4 whitespace-nowrap">
                      {rule.name}
                    </td>
                    <td className="text-xs text-gray-800 px-6 py-4 whitespace-nowrap">
                      {rule.officeName}
                    </td>
                    <td className="text-xs text-gray-700 px-6 py-4 whitespace-nowrap">
                      {rule.debitTags || ''}
                    </td>
                    <td className="text-xs text-gray-800 px-6 py-4 whitespace-nowrap">
                      {rule.debitAccount || ''}
                    </td>
                    <td className="text-xs text-gray-700 px-6 py-4 whitespace-nowrap">
                      {rule.creditTags || ''}
                    </td>
                    <td className="text-xs text-gray-800 px-6 py-4 whitespace-nowrap">
                      {rule.creditAccount || ''}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Footer / Paginator matching screenshot */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-gray-100 text-xs text-gray-600 space-x-6">
          <div className="flex items-center space-x-2">
            <span>Items per page:</span>
            <div className="relative inline-flex items-center">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none bg-transparent pr-5 pl-1 py-0.5 border-b border-gray-400 outline-none text-xs text-gray-700 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-0 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            {totalCount === 0
              ? '0 - 0 of 0'
              : `${startIndex + 1} - ${Math.min(startIndex + pageSize, totalCount)} of ${totalCount}`}
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="p-1 hover:text-gray-800 disabled:opacity-30 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-default"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 hover:text-gray-800 disabled:opacity-30 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-default"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 hover:text-gray-800 disabled:opacity-30 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-default"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="p-1 hover:text-gray-800 disabled:opacity-30 disabled:hover:text-gray-500 cursor-pointer disabled:cursor-default"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
