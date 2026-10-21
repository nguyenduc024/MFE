import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function FixedDepositProductsView({
  fixedDepositProducts = [],
  onNavigateHome,
  onNavigateProducts,
  onNavigateCreateFixedDepositProduct,
  onStartPractice,
  isPracticeActive = false
}) {
  const [filterText, setFilterText] = useState('');
  const [isFilterFocused, setIsFilterFocused] = useState(false);

  // Filter products by Name or Short Name
  const filteredProducts = fixedDepositProducts.filter(p => {
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
            Fixed Deposit Products
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
            <span className="text-gray-500">Fixed Deposit Products</span>
          </div>
        </div>

        {/* Top Right: Actions */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            id="tour-create-fd-product-btn"
            onClick={onNavigateCreateFixedDepositProduct}
            className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-4 py-2 rounded-[3px] flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Fixed Deposit Product</span>
          </button>
        </div>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-6 space-y-6">
        
        {/* Floating Underline Filter Input */}
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p, idx) => (
                  <tr 
                    key={p.id || idx}
                    id={p.shortName === 'TKFD' ? 'tour-fd-product-row-tkfd' : undefined}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      p.shortName === 'TKFD' ? 'bg-sky-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-normal text-gray-900">
                      <span className="text-[#1072ba] hover:underline font-medium">
                        {p.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-800">
                      {p.shortName}
                    </td>
                    <td className="py-3 px-4 text-gray-600 line-clamp-1">
                      {p.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-xs text-gray-400">
                    No Fixed Deposit products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
