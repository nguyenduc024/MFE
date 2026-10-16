import React from 'react';
import { 
  Table2, List, Key, GitFork, Anchor, Building2, 
  ClipboardList, ReceiptText, FileText, Clock, 
  Settings2, Settings, ArrowDown
} from 'lucide-react';

export default function SystemView({ navigate }) {
  // Items matching exactly media_1792152591540_26d900a3.png
  const leftColumnItems = [
    {
      id: 'datatables',
      title: 'Manage Data tables',
      icon: Table2,
      path: null,
      disabled: false
    },
    {
      id: 'codes',
      title: 'Manage Codes',
      icon: List,
      path: null,
      disabled: false
    },
    {
      id: 'roles',
      title: 'Manage Roles and Permissions',
      icon: Key,
      path: 'admin-roles',
      disabled: false
    },
    {
      id: 'maker-checker',
      title: 'Configure Maker Checker Tasks',
      icon: GitFork,
      path: null,
      disabled: false
    },
    {
      id: 'hooks',
      title: 'Manage Hooks',
      icon: Anchor,
      path: null,
      disabled: false
    },
    {
      id: 'entity-mapping',
      title: 'Entity to Entity Mapping',
      icon: Building2,
      path: null,
      disabled: false
    },
    {
      id: 'surveys',
      title: 'Manage Surveys',
      icon: ClipboardList,
      path: null,
      disabled: true // Disabled/greyed out in screenshot
    },
    {
      id: 'external-events',
      title: 'Manage External Events',
      icon: Anchor,
      path: null,
      disabled: false
    }
  ];

  const rightColumnItems = [
    {
      id: 'audit-trails',
      title: 'Audit Trails',
      icon: ReceiptText,
      path: null,
      disabled: false
    },
    {
      id: 'reports',
      title: 'Manage Reports',
      icon: FileText,
      path: null,
      disabled: false
    },
    {
      id: 'jobs',
      title: 'Manage Jobs',
      icon: Clock,
      path: null,
      disabled: false
    },
    {
      id: 'configurations',
      title: 'Configurations',
      icon: Settings2,
      path: null,
      disabled: false
    },
    {
      id: 'account-preferences',
      title: 'Account Number Preferences',
      icon: Key,
      path: null,
      disabled: false
    },
    {
      id: 'external-services',
      title: 'External Services',
      icon: Settings,
      path: null,
      disabled: false
    },
    {
      id: 'two-factor-auth',
      title: 'Two-Factor Authentication',
      icon: Key,
      path: null,
      disabled: true // Disabled/greyed out in screenshot
    }
  ];

  const handleItemClick = (item) => {
    if (!item.disabled && item.path && navigate) {
      navigate(item.path);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans">
      {/* Header: "System | Home / System" matching screenshot */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          System
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
          <span className="text-gray-500">System</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
          {/* Column 1 (Left: 8 items) */}
          <div className="space-y-4">
            {leftColumnItems.map((item) => {
              const Icon = item.icon;
              const isDisabled = item.disabled;

              return (
                <div
                  key={item.id}
                  id={item.id === 'roles' ? 'tour-manage-roles' : undefined}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center justify-between py-2 px-2 rounded-[2px] transition-colors ${
                    isDisabled
                      ? 'cursor-not-allowed opacity-40'
                      : item.path
                      ? 'cursor-pointer hover:bg-gray-50'
                      : 'cursor-default hover:bg-gray-50/60'
                  }`}
                  title={isDisabled ? `${item.title} (Disabled)` : item.path ? `Open ${item.title}` : item.title}
                >
                  <div className="flex items-center space-x-3.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isDisabled ? 'text-gray-400' : 'text-[#333333]'}`} />
                    <span className={`text-xs font-normal ${isDisabled ? 'text-gray-400' : 'text-[#212529]'}`}>
                      {item.title}
                    </span>
                  </div>
                  <ArrowDown className={`w-3.5 h-3.5 flex-shrink-0 ${isDisabled ? 'text-gray-300' : 'text-gray-700'}`} />
                </div>
              );
            })}
          </div>

          {/* Column 2 (Right: 7 items) */}
          <div className="space-y-4">
            {rightColumnItems.map((item) => {
              const Icon = item.icon;
              const isDisabled = item.disabled;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center justify-between py-2 px-2 rounded-[2px] transition-colors ${
                    isDisabled
                      ? 'cursor-not-allowed opacity-40'
                      : item.path
                      ? 'cursor-pointer hover:bg-gray-50'
                      : 'cursor-default hover:bg-gray-50/60'
                  }`}
                  title={isDisabled ? `${item.title} (Disabled)` : item.path ? `Open ${item.title}` : item.title}
                >
                  <div className="flex items-center space-x-3.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isDisabled ? 'text-gray-400' : 'text-[#333333]'}`} />
                    <span className={`text-xs font-normal ${isDisabled ? 'text-gray-400' : 'text-[#212529]'}`}>
                      {item.title}
                    </span>
                  </div>
                  <ArrowDown className={`w-3.5 h-3.5 flex-shrink-0 ${isDisabled ? 'text-gray-300' : 'text-gray-700'}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
