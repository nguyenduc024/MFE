import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function SavingsProductsView({
  savingsProducts = [],
  onNavigateHome,
  onNavigateProducts,
  onNavigateCreateSavingsProduct
}) {
  const [filterText, setFilterText] = useState('');
  const [isFilterFocused, setIsFilterFocused] = useState(false);

  // Filter products by Name or Short Name
  const filteredProducts = savingsProducts.filter(p => {
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
      
      {/* 1. Header & Breadcrumbs & Action Button matching Image 2 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            Saving Products
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
            <span className="text-gray-500">Saving Products</span>
          </div>
        </div>

        {/* Top Right: + Create Savings Product Button matching Image 2 */}
        <button
          type="button"
          onClick={onNavigateCreateSavingsProduct}
          className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-4 py-2 rounded-[3px] flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer select-none"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Savings Product</span>
        </button>
      </div>

      {/* 2. Main White Card matching Image 2 */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-6 space-y-6">
        
        {/* Floating Underline Filter Input matching Image 2 */}
        <div className="relative pt-3.5 pb-1 border-b transition-colors border-gray-300 max-w-full">
          <label
            className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
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
            className="w-full bg-transparent text-xs text-gray-800 outline-none pt-0.5"
          />
        </div>

        {/* Table of Savings Products matching Image 2 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-normal">
                <th className="py-2.5 px-4 font-medium w-3/5">Name</th>
                <th className="py-2.5 px-4 font-medium w-2/5">Short Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-gray-400">
                    No savings products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="py-3 px-4 font-normal text-gray-900">{p.name}</td>
                    <td className="py-3 px-4 font-normal text-gray-700">{p.shortName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Image 2: Items per page: 10 [v]    1 - 1 of 1    |<  <  >  >| */}
        <div className="flex items-center justify-end space-x-6 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1.5">
            <span>Items per page:</span>
            <div className="flex items-center space-x-1 border-b border-gray-400 px-1 py-0.5 cursor-pointer">
              <span>10</span>
              <ChevronDown className="w-3 h-3 text-gray-600" />
            </div>
          </div>

          <div>
            1 – {filteredProducts.length} of {filteredProducts.length}
          </div>

          <div className="flex items-center space-x-2 text-gray-400">
            <button type="button" disabled className="cursor-not-allowed hover:text-gray-600">
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button type="button" disabled className="cursor-not-allowed hover:text-gray-600">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button type="button" disabled className="cursor-not-allowed hover:text-gray-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button type="button" disabled className="cursor-not-allowed hover:text-gray-600">
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
