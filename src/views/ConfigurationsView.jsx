import React, { useState, useEffect } from 'react';
import { SquarePen, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

/**
 * Initial Configurations list matching Mifos X System Configurations screenshot
 * (media_1792395666235_cdd160ac.png)
 *
 * Requirements:
 * 1. maker-checker and office-opening-balances-contra-account at the top.
 * 2. Both set to Disabled.
 * 3. Actions button disabled/non-interactive.
 */
export const INITIAL_CONFIGURATIONS = [
  {
    id: '1',
    name: 'maker-checker',
    status: 'Disabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '2',
    name: 'office-opening-balances-contra-account',
    status: 'Disabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '3',
    name: 'amazon-s3',
    status: 'Disabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '4',
    name: 'reschedule-future-repayments',
    status: 'Enabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '5',
    name: 'reschedule-repayments-on-holidays',
    status: 'Disabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '6',
    name: 'allow-transactions-on-holiday',
    status: 'Disabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '7',
    name: 'allow-transactions-on-non-workingday',
    status: 'Disabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '8',
    name: 'constraint-approach-for-datatables',
    status: 'Disabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '9',
    name: 'penalty-wait-period',
    status: 'Enabled',
    value: 2,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '10',
    name: 'force-password-reset-days',
    status: 'Disabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  },
  {
    id: '11',
    name: 'grace-on-penalty-posting',
    status: 'Enabled',
    value: 0,
    stringValue: '',
    dateValue: ''
  }
];

export default function ConfigurationsView({
  navigate,
  contraAccountEnabled = false,
  onToggleContraAccount
}) {
  const [filterText, setFilterText] = useState('');
  const [internalContraEnabled, setInternalContraEnabled] = useState(contraAccountEnabled);

  useEffect(() => {
    setInternalContraEnabled(contraAccountEnabled);
  }, [contraAccountEnabled]);

  useEffect(() => {
    const handleAutofill = () => {
      setInternalContraEnabled(true);
      if (onToggleContraAccount) onToggleContraAccount(true);
    };
    window.addEventListener('practice-enable-contra-account', handleAutofill);
    return () => window.removeEventListener('practice-enable-contra-account', handleAutofill);
  }, [onToggleContraAccount]);

  const configs = INITIAL_CONFIGURATIONS.map(item => {
    if (item.name === 'office-opening-balances-contra-account') {
      return {
        ...item,
        status: internalContraEnabled ? 'Enabled' : 'Disabled'
      };
    }
    return item;
  });

  const filteredConfigs = configs.filter(item => 
    item.name.toLowerCase().includes(filterText.toLowerCase().trim())
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* 1. Header row: Configurations | Home / System / Configurations */}
      <div className="flex items-center space-x-2.5 mb-5">
        <h1 className="text-xl font-normal text-[#212529]">
          Configurations
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
            onClick={() => navigate && navigate('admin-system')} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            System
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Configurations</span>
        </div>
      </div>

      {/* 2. Main Card Container matching screenshot */}
      <div className="bg-white border border-gray-200 rounded-[2px] shadow-xs overflow-hidden">
        {/* Top Tab: Global Configurations */}
        <div className="border-b border-gray-200 flex justify-center pt-3">
          <div className="px-6 py-2 border-b-2 border-[#1072ba] text-xs font-semibold text-[#1072ba] tracking-wide cursor-default">
            Global Configurations
          </div>
        </div>

        {/* Filter Input */}
        <div className="px-6 pt-4 pb-3">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter"
            className="w-full text-xs text-gray-700 pb-1.5 border-b border-gray-300 focus:border-[#1072ba] focus:outline-none placeholder-gray-400 transition-colors"
          />
        </div>

        {/* Configurations Table */}
        <div className="px-6 pb-4">
          <div className="border border-gray-200 rounded-[2px] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-gray-200 text-gray-700 font-semibold text-xs">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                  <th className="py-3 px-4 text-left font-semibold">Value</th>
                  <th className="py-3 px-4 text-left font-semibold">String Value</th>
                  <th className="py-3 px-4 text-left font-semibold">Date Value</th>
                  <th className="py-3 px-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-800">
                {filteredConfigs.map((item, index) => {
                  const isContraAccount = item.name === 'office-opening-balances-contra-account';
                  return (
                  <tr
                    key={item.id}
                    id={isContraAccount ? "tour-contra-account-row" : undefined}
                    className={`${index % 2 === 1 ? 'bg-[#f7f8f9]' : 'bg-white'} hover:bg-sky-50/40 transition-colors`}
                  >
                    {/* Name */}
                    <td className="py-2.5 px-4 font-normal text-gray-800">
                      {item.name}
                    </td>

                    {/* Status with Toggle Switch */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div
                          id={isContraAccount ? "tour-enable-contra-account-btn" : undefined}
                          onClick={() => {
                            if (isContraAccount) {
                              const nextVal = !internalContraEnabled;
                              setInternalContraEnabled(nextVal);
                              if (onToggleContraAccount) onToggleContraAccount(nextVal);
                            }
                          }}
                          className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                            isContraAccount ? 'cursor-pointer hover:ring-2 hover:ring-[#8bc34a]/40' : 'cursor-not-allowed'
                          } ${
                            item.status === 'Enabled' ? 'bg-[#8bc34a]' : 'bg-[#9e9e9e]'
                          }`}
                          title={isContraAccount ? 'Nhấn để Bật/Tắt cấu hình Contra Account' : 'Cấu hình hệ thống ở chế độ chỉ đọc'}
                        >
                          <div
                            className={`bg-white w-3 h-3 rounded-full shadow-xs transform transition-transform ${
                              item.status === 'Enabled' ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs font-normal ${
                            item.status === 'Enabled' ? 'text-[#4caf50]' : 'text-[#e57373]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>

                    {/* Value */}
                    <td className="py-2.5 px-4 font-normal text-gray-700">
                      {item.value}
                    </td>

                    {/* String Value */}
                    <td className="py-2.5 px-4 font-normal text-gray-700">
                      {item.stringValue || ''}
                    </td>

                    {/* Date Value */}
                    <td className="py-2.5 px-4 font-normal text-gray-700">
                      {item.dateValue || ''}
                    </td>

                    {/* Actions: Disabled / Non-interactive */}
                    <td className="py-2.5 px-4 text-center">
                      <button
                        type="button"
                        disabled
                        aria-label="Edit configuration (disabled)"
                        className="inline-flex items-center justify-center p-1 text-[#1072ba] opacity-60 cursor-not-allowed rounded hover:bg-transparent"
                        title="Không cho phép chỉnh sửa hành động này"
                      >
                        <SquarePen className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

                {filteredConfigs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-gray-400">
                      Không tìm thấy cấu hình phù hợp với từ khóa tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Table Pagination matching screenshot */}
            <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center justify-end space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-1.5 cursor-default">
                <span>Items per page:</span>
                <span className="font-medium text-gray-700">10</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </div>

              <div>
                1 - 10 of 74
              </div>

              <div className="flex items-center space-x-3 text-gray-400 select-none">
                <ChevronsLeft className="w-4 h-4 cursor-not-allowed opacity-50" />
                <ChevronLeft className="w-4 h-4 cursor-not-allowed opacity-50" />
                <ChevronRight className="w-4 h-4 cursor-not-allowed opacity-50" />
                <ChevronsRight className="w-4 h-4 cursor-not-allowed opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
