import React, { useState } from 'react';
import { Plus } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs & Action Button */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
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
              className="text-[#1072ba] hover:underline cursor-pointer"
            >
              Products
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Recurring Deposit Products</span>
          </div>
        </div>

        {/* Top Right: Actions */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            id="tour-create-rd-product-btn"
            onClick={onNavigateCreateRecurringDepositProduct}
            className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-4 py-2 rounded-[3px] flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Recurring Deposit Product</span>
          </button>
        </div>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-6 space-y-6">
        
        {/* Floating Underline Filter Input */}
        <div className="relative pt-3.5 pb-1 border-b transition-colors border-gray-300 max-w-full">
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

        {/* Products Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
              <tr>
                <th className="py-2.5 px-4 font-normal w-2/5">Product Name</th>
                <th className="py-2.5 px-4 font-normal w-1/5">Short Name</th>
                <th className="py-2.5 px-4 font-normal w-2/5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">
                    No recurring deposit products configured yet.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr 
                    key={p.id} 
                    id={`tour-rd-product-row-${p.shortName?.toLowerCase()}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-medium text-[#1072ba] cursor-pointer hover:underline">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-4 text-gray-700">
                      {p.shortName}
                    </td>
                    <td className="py-2.5 px-4 text-gray-500 truncate max-w-xs">
                      {p.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
