import React, { useState } from 'react';
import { Plus, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

export default function RecurringDepositProductsView({
  recurringDepositProducts = [],
  onNavigateHome,
  onNavigateProducts,
  onNavigateCreateRecurringDepositProduct,
  onStartPractice,
  isPracticeActive = false
}) {
  const [filterText, setFilterText] = useState('');
  const [isFilterFocused, setIsFilterFocused] = useState(false);

  // Filter products by Name or Short Name
  const filteredProducts = recurringDepositProducts.filter(p => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.shortName && p.shortName.toLowerCase().includes(q))
    );
  });

  const isFloated = isFilterFocused || filterText.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs & Action Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-normal text-[#212529]">
            Recurring Deposit Products
          </h1>
          <span className="text-gray-300 font-light text-base">|</span>
          <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5">
            <span 
              onClick={onNavigateHome} 
              className="text-gray-600 hover:underline cursor-pointer"
            >
              Home
            </span>
            <span className="text-gray-400">/</span>
            <span 
              onClick={onNavigateProducts} 
              className="text-[#1072ba] hover:underline cursor-pointer font-normal"
            >
              Products
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Recurring Deposit Products</span>
          </div>
        </div>

        {/* Top Right: Create Button */}
        <div>
          <button
            type="button"
            id="tour-create-rd-product-btn"
            onClick={onNavigateCreateRecurringDepositProduct}
            className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold px-4 py-2 rounded-[3px] flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Recurring Deposit Product</span>
          </button>
        </div>
      </div>

      {/* 2. Floating Underline Filter Input (Outside the table card matching screenshot) */}
      <div className="mb-4">
        <div className="relative pt-3.5 pb-1 border-b border-gray-300 max-w-full">
          <label
            className={`absolute left-0 pointer-events-none origin-[0] select-none transition-all duration-200 ease-out z-10 ${
              isFloated
                ? '-top-1 text-[11px] ' + (isFilterFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
                : 'top-3.5 text-xs text-gray-500'
            }`}
          >
            Filter
          </label>
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            onFocus={() => setIsFilterFocused(true)}
            onBlur={() => setIsFilterFocused(false)}
            className="w-full bg-transparent text-xs text-gray-800 outline-none pr-4 pt-0.5"
          />
        </div>
      </div>

      {/* 3. Products Table Card matching screenshot */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.18)] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-200 text-gray-600 font-medium bg-white">
            <tr>
              <th className="py-4 px-6 font-medium text-gray-600 text-[12px] w-1/2">
                Name
              </th>
              <th className="py-4 px-6 font-medium text-gray-600 text-[12px] w-1/2">
                Short Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-12 text-center text-xs text-gray-400">
                  No recurring deposit products configured yet.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr 
                  key={p.id} 
                  id={`tour-rd-product-row-${p.shortName?.toLowerCase()}`}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="py-4 px-6 text-gray-800 text-[13px] font-normal">
                    {p.name}
                  </td>
                  <td className="py-4 px-6 text-gray-800 text-[13px] font-normal">
                    {p.shortName}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Material Table Pagination Footer matching screenshot */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-gray-100 text-xs text-gray-500 space-x-6 select-none bg-white">
          <div className="flex items-center space-x-1.5">
            <span>Items per page:</span>
            <span className="text-gray-700 font-normal inline-flex items-center border-b border-gray-600 pb-0.5 cursor-pointer">
              <span>10</span>
              <span className="text-[9px] ml-1 text-gray-600">▼</span>
            </span>
          </div>

          <div className="text-gray-600 text-[11px]">
            {filteredProducts.length > 0 ? `1 - ${filteredProducts.length} of ${filteredProducts.length}` : '0 - 0 of 0'}
          </div>

          <div className="flex items-center space-x-4 text-gray-300">
            <button type="button" disabled className="disabled:cursor-not-allowed">
              <ChevronsLeft className="w-4 h-4 text-gray-300" />
            </button>
            <button type="button" disabled className="disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 text-gray-300" />
            </button>
            <button type="button" disabled className="disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
            <button type="button" disabled className="disabled:cursor-not-allowed">
              <ChevronsRight className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
