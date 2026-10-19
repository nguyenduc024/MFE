import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, X, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import { ALL_ISO_CURRENCIES, INITIAL_CONFIGURED_CURRENCIES } from '../data/mifosData';

export default function CurrencyConfigView({ 
  navigate, 
  initialMode = 'list',
  currencies: propCurrencies,
  onSaveCurrencies
}) {
  // Mode: 'list' (Hình 1 - Currency Configuration) or 'edit' (Hình 2 - Manage Currencies)
  const [mode, setMode] = useState(initialMode);

  // Active currencies state
  const [configuredCurrencies, setConfiguredCurrencies] = useState(
    Array.isArray(propCurrencies) ? propCurrencies : INITIAL_CONFIGURED_CURRENCIES
  );

  // Working draft state for Edit mode
  const [draftCurrencies, setDraftCurrencies] = useState(
    Array.isArray(propCurrencies) ? propCurrencies : INITIAL_CONFIGURED_CURRENCIES
  );

  // Synchronize when propCurrencies updates (e.g. on reset to [])
  useEffect(() => {
    if (Array.isArray(propCurrencies)) {
      setConfiguredCurrencies(propCurrencies);
      setDraftCurrencies(propCurrencies);
    }
  }, [propCurrencies]);

  // Filter text for List view (Hình 1)
  const [filterText, setFilterText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Autocomplete search state for Edit mode (Hình 2)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sync draft currencies when entering edit mode
  const handleEnterEditMode = () => {
    setDraftCurrencies([...configuredCurrencies]);
    setSearchTerm('');
    setSelectedCurrency(null);
    setIsDropdownOpen(false);
    setMode('edit');
    if (navigate) {
      navigate('admin-manage-currencies');
    }
  };

  // Close autocomplete dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Practice tour autofill listener
  useEffect(() => {
    const handleAutofill = (e) => {
      const curr = e.detail || { code: 'VND', name: 'Vietnamese Dong' };
      setSelectedCurrency(curr);
      setSearchTerm(`(${curr.code}) ${curr.name}`);
      setIsDropdownOpen(false);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    };
    window.addEventListener('practice-autofill-currency', handleAutofill);
    return () => window.removeEventListener('practice-autofill-currency', handleAutofill);
  }, []);

  // Filtered ISO currencies for autocomplete (Hình 2)
  const filteredIsoCurrencies = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return ALL_ISO_CURRENCIES.filter(curr => {
      // Exclude already added currencies
      const isAlreadyAdded = draftCurrencies.some(
        c => c.code.toLowerCase() === curr.code.toLowerCase()
      );
      if (isAlreadyAdded) return false;

      if (!query) return true;
      const matchCode = curr.code.toLowerCase().includes(query);
      const matchName = curr.name.toLowerCase().includes(query);
      return matchCode || matchName;
    });
  }, [searchTerm, draftCurrencies]);

  // Handle selecting currency from dropdown
  const handleSelectCurrency = (curr) => {
    setSelectedCurrency(curr);
    setSearchTerm(`(${curr.code}) ${curr.name}`);
    setIsDropdownOpen(false);
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Handle adding currency (+ button)
  const handleAddCurrency = () => {
    let currToAdd = selectedCurrency;

    // If no explicit selection but user typed code or name, find best match
    if (!currToAdd && searchTerm.trim()) {
      const match = filteredIsoCurrencies[0];
      if (match) currToAdd = match;
    }

    if (currToAdd) {
      if (!draftCurrencies.some(c => c.code === currToAdd.code)) {
        setDraftCurrencies(prev => [...prev, currToAdd]);
      }
      // Retain the entered data in input field as requested
      setSelectedCurrency(currToAdd);
      setSearchTerm(`(${currToAdd.code}) ${currToAdd.name}`);
      setIsDropdownOpen(false);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  // Handle deleting currency in Edit mode
  const handleDeleteCurrency = (code) => {
    setDraftCurrencies(prev => prev.filter(c => c.code !== code));
  };

  // Handle save / submit in Edit mode
  const handleSaveEdit = () => {
    setConfiguredCurrencies(draftCurrencies);
    if (onSaveCurrencies) {
      onSaveCurrencies(draftCurrencies);
    }
    setMode('list');
    if (navigate) {
      navigate('admin-currency-config');
    }
  };

  // Filtered currencies for List view table (Hình 1)
  const filteredListCurrencies = useMemo(() => {
    const q = filterText.toLowerCase().trim();
    if (!q) return configuredCurrencies;
    return configuredCurrencies.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.code || '').toLowerCase().includes(q)
    );
  }, [configuredCurrencies, filterText]);

  // Pagination for List view
  const totalItems = filteredListCurrencies.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentCurrenciesPage = filteredListCurrencies.slice(startIndex, endIndex);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 font-sans select-none animate-in fade-in duration-150">
      {mode === 'list' ? (
        /* ========================================================
           HÌNH 1: CURRENCY CONFIGURATION (List View)
           ======================================================== */
        <div>
          {/* Top Header: "Currency Configuration | Home / Organization / Currency Configuration" and + Add/Edit Button */}
          <div className="flex items-center justify-between mb-6">
            {/* Title & Breadcrumbs */}
            <div className="flex items-baseline space-x-2.5">
              <h1 className="text-xl font-normal text-[#212529]">
                Currency Configuration
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
                  onClick={() => navigate && navigate('admin-organization')} 
                  className="text-[#1072ba] hover:underline cursor-pointer"
                >
                  Organization
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-500">Currency Configuration</span>
              </div>
            </div>

            {/* + Add/Edit Button (Matching Image 1 top right) */}
            <button
              id="tour-btn-add-edit-currency"
              type="button"
              onClick={handleEnterEditMode}
              className="bg-[#1072ba] hover:bg-[#0d5d99] text-white text-xs px-3.5 py-1.5 rounded-[2px] shadow-xs cursor-pointer flex items-center space-x-1.5 transition-colors font-medium"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add/Edit</span>
            </button>
          </div>

          {/* Underline Filter Bar (Material style matching Image 1) */}
          <div className="mb-6 relative max-w-sm">
            <label className="block text-[11px] font-normal text-gray-500 mb-0.5">
              Filter
            </label>
            <input
              type="text"
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] py-1 outline-none transition-colors"
            />
          </div>

          {/* Table Card (Matching Image 1) */}
          <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600 font-normal select-none">
                    <th className="py-3 px-6 font-normal w-1/2">Currency Name</th>
                    <th className="py-3 px-6 font-normal w-1/2">Currency Code</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCurrenciesPage.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="py-6 text-center text-gray-400">
                        No currencies found.
                      </td>
                    </tr>
                  ) : (
                    currentCurrenciesPage.map((curr, idx) => {
                      const isOdd = idx % 2 === 1;
                      return (
                        <tr 
                          key={curr.code} 
                          className={`transition-colors border-b border-gray-100/60 ${isOdd ? 'bg-[#f9f9f9]' : 'bg-white'}`}
                        >
                          <td className="py-3 px-6 font-normal text-gray-800">
                            {curr.name}
                          </td>
                          <td className="py-3 px-6 font-normal text-gray-700">
                            {curr.code}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (Matching Image 1 bottom right) */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-gray-200 text-xs text-gray-600 space-x-6 select-none">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-gray-500">Items per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs text-gray-700 outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="text-[11px] text-gray-600 font-mono">
                {totalItems === 0 
                  ? '0 of 0' 
                  : `${startIndex + 1} – ${endIndex} of ${totalItems}`}
              </div>

              <div className="flex items-center space-x-1 text-gray-500">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage >= totalPages}
                  className="p-1 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
           HÌNH 2: MANAGE CURRENCIES (Add/Edit View)
           ======================================================== */
        <div>
          {/* Header: "Manage Currencies | Home / Organization / Currency Configuration / Manage Currencies" */}
          <div className="flex items-baseline space-x-2.5 mb-6">
            <h1 className="text-xl font-normal text-[#212529]">
              Manage Currencies
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
                onClick={() => navigate && navigate('admin-organization')} 
                className="text-[#1072ba] hover:underline cursor-pointer"
              >
                Organization
              </span>
              <span className="text-gray-400">/</span>
              <span 
                onClick={() => setMode('list')} 
                className="text-[#1072ba] hover:underline cursor-pointer"
              >
                Currency Configuration
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">Manage Currencies</span>
            </div>
          </div>

          {/* White Card matching Image 2 */}
          <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8 relative">
            {/* Top Search Input & + Add Button */}
            <div id="tour-search-currency-area" className="flex items-start space-x-2 relative z-20">
              {/* Autocomplete Input Container */}
              <div className="relative w-80">
                {/* Floating Label */}
                <label className="block text-[11px] text-gray-500 font-normal mb-1">
                  Currency <span className="text-amber-500">*</span>
                </label>

                {/* Input with Clear ✕ icon */}
                <div className="relative flex items-center border border-gray-300 rounded-[2px] bg-white px-2 py-1.5 focus-within:border-[#1072ba]">
                  <input
                    id="tour-input-currency"
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    placeholder="Currency *"
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedCurrency(null);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCurrency();
                      }
                    }}
                    className="w-full text-xs text-gray-800 outline-none pr-5 placeholder:text-gray-400"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCurrency(null);
                        if (searchInputRef.current) searchInputRef.current.focus();
                      }}
                      className="absolute right-2 text-gray-400 hover:text-gray-700 cursor-pointer p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown List (Matching Image 2 popup) */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    id="tour-currency-dropdown"
                    className="absolute left-0 top-full mt-1 w-[340px] bg-white rounded-[2px] shadow-[0_8px_24px_rgba(0,0,0,0.25)] border border-gray-200 py-1 max-h-56 overflow-y-auto z-50 text-xs pointer-events-auto"
                  >
                    {filteredIsoCurrencies.length === 0 ? (
                      <div className="px-3 py-2 text-gray-400 text-[11px]">
                        No matching currencies
                      </div>
                    ) : (
                      filteredIsoCurrencies.slice(0, 30).map((curr, idx) => {
                        const isFirst = idx === 0;
                        return (
                          <div
                            key={curr.code}
                            onClick={() => handleSelectCurrency(curr)}
                            className={`px-3 py-2 cursor-pointer transition-colors text-gray-800 ${
                              isFirst ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                            }`}
                          >
                            ({curr.code}) {curr.name}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

              </div>

              {/* + Icon Button (Turns blue #1072ba when currency is typed/selected) */}
              <div className="pt-[22px]">
                {(() => {
                  const isAlreadyDrafted = selectedCurrency && draftCurrencies.some(c => c.code === selectedCurrency.code);
                  const hasSelection = (!isAlreadyDrafted && !!selectedCurrency) || (!isAlreadyDrafted && searchTerm.trim().length > 0 && filteredIsoCurrencies.length > 0);
                  return (
                    <button
                      id="tour-btn-add-currency"
                      type="button"
                      onClick={handleAddCurrency}
                      disabled={!hasSelection}
                      className={`w-8 h-8 rounded-[2px] flex items-center justify-center transition-colors shadow-xs ${
                        hasSelection 
                          ? 'bg-[#1072ba] hover:bg-[#0d5d99] text-white cursor-pointer' 
                          : 'bg-[#e0e0e0] text-gray-400 cursor-not-allowed'
                      }`}
                      title={hasSelection ? "Add currency (Thêm đơn vị tiền tệ)" : "Vui lòng chọn đơn vị tiền tệ"}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Configured Currencies List (2-column layout matching Image 2) */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div id="tour-draft-currencies-list" className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-3">
                {draftCurrencies.map((curr) => (
                  <div
                    key={curr.code}
                    data-currency-code={curr.code}
                    className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50/70 rounded-[2px] transition-colors border-b border-gray-100/60"
                  >
                    <span className="text-xs text-[#212529] font-normal">
                      {curr.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCurrency(curr.code)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition-colors"
                      title={`Remove ${curr.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Cancel & Submit buttons */}
            <div className="mt-10 pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setMode('list')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-4 py-1.5 rounded-[2px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="tour-submit-currencies-btn"
                type="button"
                onClick={handleSaveEdit}
                className="bg-[#1072ba] hover:bg-[#0d5d99] text-white text-xs px-5 py-1.5 rounded-[2px] shadow-xs transition-colors cursor-pointer font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Footer (Matching Image 1 & Image 2 bottom center) */}
      <div className="mt-16 text-center text-[11px] text-gray-500 font-mono space-y-0.5 select-none">
        <div>Mifos 250331 -</div>
        <div>1.16.0 - SNAPSHOT</div>
      </div>
    </div>
  );
}
