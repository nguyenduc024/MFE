import React from 'react';
import { 
  Building2, Calendar, User, FileText, Banknote, 
  Lock, SquarePen, Check, Settings2, DollarSign, 
  Mail, ChevronRight, ArrowDown, ArrowUpToLine
} from 'lucide-react';

export default function OrganizationView({ navigate }) {
  // Items matching exactly media_1792152211860_185c8384.png (Column 1: 9 items, Column 2: 9 items)
  const leftColumnItems = [
    {
      id: 'offices',
      title: 'Manage Offices',
      icon: Building2,
      path: 'admin-offices'
    },
    {
      id: 'holidays',
      title: 'Manage Holidays',
      icon: Calendar,
      path: null
    },
    {
      id: 'employees',
      title: 'Manage Employees',
      icon: User,
      path: null
    },
    {
      id: 'standing-instructions',
      title: 'Standing Instructions History',
      icon: FileText,
      path: null
    },
    {
      id: 'investors',
      title: 'Investors',
      icon: User,
      path: null
    },
    {
      id: 'fund-mapping',
      title: 'Fund Mapping',
      icon: Banknote,
      path: null
    },
    {
      id: 'password-preferences',
      title: 'Password Preferences',
      icon: Lock,
      path: null
    },
    {
      id: 'loan-provisioning',
      title: 'Loan Provisioning Criteria',
      icon: SquarePen,
      path: null
    },
    {
      id: 'entity-checks',
      title: 'Entity Data Table Checks',
      icon: Check,
      path: null
    }
  ];

  const rightColumnItems = [
    {
      id: 'currency',
      title: 'Currency Configuration',
      icon: Settings2,
      path: 'admin-currency-config'
    },
    {
      id: 'funds',
      title: 'Manage Funds',
      icon: Banknote,
      path: null
    },
    {
      id: 'bulk-loan',
      title: 'Bulk Loan Reassignment',
      icon: Banknote,
      path: null
    },
    {
      id: 'tellers',
      title: 'Teller / Cashier Management',
      icon: Banknote,
      path: 'admin-tellers'
    },
    {
      id: 'working-days',
      title: 'Working Days',
      icon: Calendar,
      path: null
    },
    {
      id: 'payment-type',
      title: 'Payment Type',
      icon: DollarSign,
      path: null
    },
    {
      id: 'sms-campaigns',
      title: 'SMS Campaigns',
      icon: Mail,
      path: null
    },
    {
      id: 'adhoc-query',
      title: 'AdHocQuery',
      icon: ChevronRight,
      path: null
    },
    {
      id: 'bulk-import',
      title: 'Bulk Import',
      icon: ArrowUpToLine,
      path: null
    }
  ];

  const handleItemClick = (item) => {
    if (item.path && navigate) {
      navigate(item.path);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans">
      {/* Header: "Organization | Home / Organization" matching screenshot */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          Organization
        </h1>
        <span className="text-gray-300 font-light text-base">|</span>
        <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5">
          <span 
            onClick={() => navigate && navigate('home')} 
            className="hover:text-[#1072ba] cursor-pointer"
          >
            Home
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Organization</span>
        </div>
      </div>

      {/* Main Card with 2 columns of items */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
          {/* Column 1 (Left) */}
          <div className="space-y-4">
            {leftColumnItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  id={item.id === 'offices' ? 'tour-manage-offices' : undefined}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center justify-between py-2 px-2 rounded-[2px] transition-colors ${
                    item.path ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default hover:bg-gray-50/60'
                  }`}
                  title={item.path ? `Open ${item.title}` : item.title}
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
              return (
                <div
                  key={item.id}
                  id={item.id === 'currency' ? 'tour-currency-config' : undefined}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center justify-between py-2 px-2 rounded-[2px] transition-colors ${
                    item.path ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default hover:bg-gray-50/60'
                  }`}
                  title={item.path ? `Open ${item.title}` : item.title}
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
