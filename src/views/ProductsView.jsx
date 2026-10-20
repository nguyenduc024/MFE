import React from 'react';
import { 
  Briefcase, Banknote, ShieldCheck, Shuffle, Settings, 
  TrendingUp, ArrowDown, Coins
} from 'lucide-react';

export default function ProductsView({
  onNavigateHome,
  onNavigateSavingsProducts,
  onNavigateLoanProducts
}) {
  const column1Items = [
    {
      label: 'Loan Products',
      icon: Briefcase,
      onClick: onNavigateLoanProducts
    },
    {
      label: 'Savings Products',
      icon: Briefcase,
      onClick: onNavigateSavingsProducts
    },
    {
      label: 'Share Products',
      icon: Briefcase,
      onClick: null
    },
    {
      label: 'Charges',
      icon: Banknote,
      onClick: null
    },
    {
      label: 'Collateral Management',
      icon: ShieldCheck,
      onClick: null
    },
    {
      label: 'Delinquency Buckets',
      icon: Briefcase,
      onClick: null
    }
  ];

  const column2Items = [
    {
      label: 'Products Mix',
      icon: Shuffle,
      onClick: null
    },
    {
      label: 'Fixed Deposit Products',
      icon: Briefcase,
      onClick: null
    },
    {
      label: 'Recurring Deposit Products',
      icon: Briefcase,
      onClick: null
    },
    {
      label: 'Manage Tax Configurations',
      icon: Settings,
      onClick: null
    },
    {
      label: 'Floating Rates',
      icon: Coins,
      onClick: null
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs matching Image 1: Products | Home / Products */}
      <div className="flex items-center space-x-2.5 mb-5">
        <h1 className="text-xl font-normal text-[#212529]">
          Products
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
          <span className="text-gray-500">Products</span>
        </div>
      </div>

      {/* 2. Main White Card matching Image 1 */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          
          {/* Column 1 (Left) */}
          <div className="space-y-1">
            {column1Items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={item.onClick || undefined}
                  className={`flex items-center justify-between py-3 px-3 rounded-[2px] transition-colors ${
                    item.onClick 
                      ? 'hover:bg-gray-50 cursor-pointer text-gray-900 group' 
                      : 'hover:bg-gray-50/50 cursor-pointer text-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <Icon className="w-4 h-4 text-gray-800 group-hover:text-[#1072ba] transition-colors" />
                    <span className="text-xs font-normal text-gray-900 group-hover:text-[#1072ba] transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <ArrowDown className="w-3.5 h-3.5 text-gray-700 group-hover:text-[#1072ba] transition-colors" />
                </div>
              );
            })}
          </div>

          {/* Column 2 (Right) */}
          <div className="space-y-1">
            {column2Items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={item.onClick || undefined}
                  className={`flex items-center justify-between py-3 px-3 rounded-[2px] transition-colors ${
                    item.onClick 
                      ? 'hover:bg-gray-50 cursor-pointer text-gray-900 group' 
                      : 'hover:bg-gray-50/50 cursor-pointer text-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <Icon className="w-4 h-4 text-gray-800 group-hover:text-[#1072ba] transition-colors" />
                    <span className="text-xs font-normal text-gray-900 group-hover:text-[#1072ba] transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <ArrowDown className="w-3.5 h-3.5 text-gray-700 group-hover:text-[#1072ba] transition-colors" />
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
