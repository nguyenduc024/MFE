import React from 'react';
import { 
  RotateCcw, Plus, Search, Link2, HandCoins, 
  Archive, List, Calendar, Cog, ArrowDown 
} from 'lucide-react';

/**
 * Authentic Sitemap / Tree hierarchy icon for "Chart of Accounts"
 */
const SitemapIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="9" y="3" width="6" height="5" rx="1" />
    <rect x="3" y="16" width="6" height="5" rx="1" />
    <rect x="15" y="16" width="6" height="5" rx="1" />
    <path d="M12 8v4" />
    <path d="M6 12h12" />
    <path d="M6 12v4" />
    <path d="M18 12v4" />
  </svg>
);

/**
 * Authentic dual cogs icon for "Provisioning Entries"
 */
const DualCogsIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="9" cy="9" r="3" />
    <path d="M9 3v2" />
    <path d="M9 13v2" />
    <path d="M4 9h2" />
    <path d="M12 9h2" />
    <circle cx="17" cy="17" r="2.5" />
    <path d="M17 12v1.5" />
    <path d="M17 19.5V21" />
    <path d="M12.5 17H14" />
    <path d="M20 17h1.5" />
  </svg>
);

export default function AccountingView({ navigate }) {
  // Items matching exactly media_1792378278077_ac80fa6f.png
  // Column 1 (Left): 5 items
  const leftColumnItems = [
    {
      id: 'frequent-postings',
      title: 'Frequent Postings',
      icon: RotateCcw
    },
    {
      id: 'create-journal-entries',
      title: 'Create Journal Entries',
      icon: Plus
    },
    {
      id: 'search-journal-entries',
      title: 'Search Journal Entries',
      icon: Search
    },
    {
      id: 'financial-activities',
      title: 'Accounts Linked to Financial Activities',
      icon: Link2
    },
    {
      id: 'migrate-opening-balances',
      title: 'Migrate Opening Balances (Office-wise)',
      icon: HandCoins
    }
  ];

  // Column 2 (Right): 5 items
  const rightColumnItems = [
    {
      id: 'chart-of-accounts',
      title: 'Chart of Accounts',
      icon: SitemapIcon
    },
    {
      id: 'closing-entries',
      title: 'Closing Entries',
      icon: Archive
    },
    {
      id: 'accounting-rules',
      title: 'Accounting Rules',
      icon: List
    },
    {
      id: 'accruals',
      title: 'Accruals',
      icon: Calendar
    },
    {
      id: 'provisioning-entries',
      title: 'Provisioning Entries',
      icon: DualCogsIcon
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* Header: "Accounting | Home / Accounting" matching screenshot */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          Accounting
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
          <span className="text-gray-500">Accounting</span>
        </div>
      </div>

      {/* Main Card with 2 columns of items (Unlinked for now per user instruction) */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
          {/* Column 1 (Left) */}
          <div className="space-y-4">
            {leftColumnItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 px-2 rounded-[2px] cursor-default hover:bg-gray-50/60 transition-colors"
                  title={item.title}
                >
                  <div className="flex items-center space-x-3.5">
                    <Icon className="w-4 h-4 text-[#333333] flex-shrink-0" />
                    <span className="text-xs text-[#212529] font-normal">
                      {item.title}
                    </span>
                  </div>
                  <ArrowDown className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                </div>
              );
            })}
          </div>

          {/* Column 2 (Right) */}
          <div className="space-y-4">
            {rightColumnItems.map((item) => {
              const Icon = item.icon;
              const isCOA = item.id === 'chart-of-accounts';
              return (
                <div
                  key={item.id}
                  id={isCOA ? "tour-coa-tile" : undefined}
                  onClick={() => {
                    if (isCOA && navigate) {
                      navigate('accounting-coa');
                    }
                  }}
                  className={`flex items-center justify-between py-2 px-2 rounded-[2px] transition-colors ${
                    isCOA ? 'cursor-pointer hover:bg-gray-100/70' : 'cursor-default hover:bg-gray-50/60'
                  }`}
                  title={item.title}
                >
                  <div className="flex items-center space-x-3.5">
                    <Icon className="w-4 h-4 text-[#333333] flex-shrink-0" />
                    <span className="text-xs text-[#212529] font-normal">
                      {item.title}
                    </span>
                  </div>
                  <ArrowDown className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
