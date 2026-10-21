import React, { useState } from 'react';
import { Plus, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

export default function LoanProductsView({
  loanProducts = [],
  onNavigateHome,
  onNavigateProducts,
  onNavigateCreateLoanProduct,
  onStartPractice,
  isPracticeActive = false
}) {
  const [filterText, setFilterText] = useState('');
  const [isFilterFocused, setIsFilterFocused] = useState(false);

  // Filter products by Name or Short Name
  const filteredProducts = loanProducts.filter(p => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.shortName && p.shortName.toLowerCase().includes(q)) ||
      (p.externalId && p.externalId.toLowerCase().includes(q))
    );
  });

  const isFloated = isFilterFocused || filterText.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs & Action Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-normal text-[#212529]">
            Loan Products
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
            <span className="text-gray-600">Loan Products</span>
          </div>
        </div>

        {/* Top Right: Create Button */}
        <div>
          <button
            type="button"
            id="tour-create-loan-product-btn"
            onClick={onNavigateCreateLoanProduct}
            className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold px-4 py-2 rounded-[3px] flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Loan Product</span>
          </button>
        </div>
      </div>

      {/* 2. Floating Underline Filter Input */}
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

      {/* 3. Products Table Card */}
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
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-8 text-center text-gray-400 italic">
                  Chưa có sản phẩm cho vay nào. Hãy nhấn "+ Create Loan Product" ở góc trên bên phải để tạo gói vay mới.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p, idx) => {
                const isTarget = p.shortName === 'Loan' || p.externalId === 'TKB-PRD-PL-001' || p.name === 'TKB Personal Loan';
                return (
                  <tr 
                    key={p.id || idx}
                    id={isTarget ? 'tour-loan-product-row-loan' : undefined}
                    className={`hover:bg-[#f7f9fa] transition-colors cursor-pointer group ${
                      isTarget ? 'bg-sky-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-6 font-normal text-gray-800 group-hover:text-[#1072ba]">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-6 font-mono font-medium text-gray-700">
                      {p.shortName}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* 4. Table Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 text-xs text-gray-500 bg-white select-none">
          <div>
            Showing {filteredProducts.length > 0 ? 1 : 0} - {filteredProducts.length} of {filteredProducts.length}
          </div>
          <div className="flex items-center space-x-1">
            <button 
              disabled 
              className="p-1 rounded text-gray-300 cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button 
              disabled 
              className="p-1 rounded text-gray-300 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 text-xs text-gray-700 font-medium">1</span>
            <button 
              disabled 
              className="p-1 rounded text-gray-300 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              disabled 
              className="p-1 rounded text-gray-300 cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
