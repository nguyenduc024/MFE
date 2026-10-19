import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Search } from 'lucide-react';

/**
 * Predefined System Financial Activities in Mifos X
 * Matching Image 3: media_1792392236801_1a3e01c3.png
 */
export const FINANCIAL_ACTIVITY_OPTIONS = [
  { code: '100', name: 'Asset Transfer', type: 'ASSET' },
  { code: '200', name: 'Liability Transfer', type: 'LIABILITY' },
  { code: '101', name: 'Cash At Main Vault', type: 'ASSET' },
  { code: '102', name: 'Cash At Teller', type: 'ASSET' },
  { code: '300', name: 'Opening Balances Transfer Contra', type: 'EQUITY' },
  { code: '103', name: 'Fund Source', type: 'ASSET' }
];

/**
 * 6 Representative Financial Activity Mappings matching user table image
 * media_1792393596543_63f2c649.png
 */
export const SAMPLE_FINANCIAL_ACTIVITY_MAPPINGS = [
  {
    step: 1,
    activityCode: '300',
    activityName: 'Opening Balances Transfer Contra',
    accountType: 'EQUITY',
    accountCode: '310199',
    accountName: 'Opening Balance Contra',
    description: 'Ánh xạ tài khoản đối ứng số dư đầu kỳ khi chuyển đổi số liệu hệ thống.'
  },
  {
    step: 2,
    activityCode: '101',
    activityName: 'Cash At Main Vault',
    accountType: 'ASSET',
    accountCode: '110101',
    accountName: 'Cash at Vault',
    description: 'Ánh xạ quỹ tiền mặt tại kho/két chính của ngân hàng.'
  },
  {
    step: 3,
    activityCode: '102',
    activityName: 'Cash At Teller',
    accountType: 'ASSET',
    accountCode: '110102',
    accountName: 'Cash at Teller',
    description: 'Ánh xạ quỹ tiền mặt tại quầy giao dịch viên (Teller cash drawers).'
  },
  {
    step: 4,
    activityCode: '103',
    activityName: 'Fund Source',
    accountType: 'ASSET',
    accountCode: '110201',
    accountName: 'Settlement Bank Account',
    description: 'Ánh xạ tài khoản nguồn vốn thanh toán duy trì tại Ngân hàng Trung ương / đại lý.'
  },
  {
    step: 5,
    activityCode: '100',
    activityName: 'Asset Transfer',
    accountType: 'ASSET',
    accountCode: '130101',
    accountName: 'Clearing Receivable',
    description: 'Ánh xạ tài khoản phải thu bù trừ khi điều chuyển tài sản / tiền mặt giữa các đơn vị.'
  },
  {
    step: 6,
    activityCode: '200',
    activityName: 'Liability Transfer',
    accountType: 'LIABILITY',
    accountCode: '220201',
    accountName: 'Clearing Payable',
    description: 'Ánh xạ tài khoản phải trả bù trừ khi chuyển giao nghĩa vụ nợ giữa các chi nhánh.'
  }
];

export default function FinancialActivityMappingsView({
  activities = [],
  onSaveActivity,
  glAccounts = [],
  navigate,
  initialMode = 'list'
}) {
  const [viewMode, setViewMode] = useState(initialMode); // 'list' or 'create'
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Form states (matching Image 2, 3, 4)
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activityDropdownOpen, setActivityDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [accountSearch, setAccountSearch] = useState('');

  const activityDropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);

  // Listen for practice autofill event for Financial Activity Mapping (GL Part 5)
  useEffect(() => {
    const handleAutofill = (e) => {
      if (e.detail) {
        const { activityCode, accountCode } = e.detail;
        const act = FINANCIAL_ACTIVITY_OPTIONS.find(a => a.code === activityCode);
        if (act) {
          setSelectedActivity(act);
        }
        const acc = glAccounts.find(a => a.glCode === accountCode);
        if (acc) {
          setSelectedAccount(acc);
        }
      }
    };

    window.addEventListener('practice-autofill-activity-mapping', handleAutofill);
    return () => {
      window.removeEventListener('practice-autofill-activity-mapping', handleAutofill);
    };
  }, [glAccounts]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (activityDropdownRef.current && !activityDropdownRef.current.contains(event.target)) {
        setActivityDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter accounts based on selected Financial Activity's type
  const availableAccounts = React.useMemo(() => {
    if (!selectedActivity) return [];
    const targetType = selectedActivity.type;

    return glAccounts.filter(a => {
      const isDetail = (a.usage || '').toLowerCase() === 'detail';
      if (!isDetail) return false;

      const accType = (a.typeName || a.type || '').toUpperCase();
      return accType === targetType;
    });
  }, [glAccounts, selectedActivity]);

  // Filter accounts by search text (Image 4)
  const filteredAccounts = React.useMemo(() => {
    if (!accountSearch.trim()) return availableAccounts;
    const q = accountSearch.trim().toLowerCase();
    return availableAccounts.filter(a => 
      (a.glCode && a.glCode.toLowerCase().includes(q)) || 
      (a.name && a.name.toLowerCase().includes(q))
    );
  }, [availableAccounts, accountSearch]);

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    setActivityDropdownOpen(false);
    // If current selected account's type doesn't match new activity's type, reset account
    if (selectedAccount) {
      const accType = (selectedAccount.typeName || selectedAccount.type || '').toUpperCase();
      if (accType !== activity.type) {
        setSelectedAccount(null);
      }
    }
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setAccountDropdownOpen(false);
    setAccountSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedActivity || !selectedAccount) return;

    if (onSaveActivity) {
      onSaveActivity({
        id: String(Date.now()),
        activityCode: selectedActivity.code,
        activityName: selectedActivity.name,
        accountType: selectedActivity.type,
        accountCode: selectedAccount.glCode,
        accountName: selectedAccount.name
      });
    }

    // Reset and go back to list
    setSelectedActivity(null);
    setSelectedAccount(null);
    setAccountSearch('');
    setViewMode('list');
  };

  const handleCancel = () => {
    setSelectedActivity(null);
    setSelectedAccount(null);
    setAccountSearch('');
    setViewMode('list');
  };

  const totalCount = activities.length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* ========================================================
          1. LIST VIEW (Matching Image 1: media_1792392156439_239f5ead.png)
          ======================================================== */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Header row: "Financial Activity Mappings | Home / Accounting / Financial Activity Mappings" + "+ Define New Mapping" */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-normal text-[#212529]">
                Financial Activity Mappings
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
                  onClick={() => navigate && navigate('accounting')} 
                  className="text-[#1072ba] hover:underline cursor-pointer"
                >
                  Accounting
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-500">Financial Activity Mappings</span>
              </div>
            </div>

            <button
              type="button"
              id="tour-btn-define-mapping"
              onClick={() => {
                setSelectedActivity(null);
                setSelectedAccount(null);
                setAccountSearch('');
                setViewMode('create');
              }}
              className="py-1.5 px-3.5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors flex items-center space-x-1"
            >
              <span className="text-sm font-bold leading-none mr-1">+</span>
              <span>Define New Mapping</span>
            </button>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-700 bg-white">
                  <th className="py-3 px-6 font-semibold">Financial Activity</th>
                  <th className="py-3 px-6 font-semibold">Account Type</th>
                  <th className="py-3 px-6 font-semibold">Account Code</th>
                  <th className="py-3 px-6 font-semibold">Account Name</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((row, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <tr 
                      key={row.id || index}
                      className={`text-xs text-[#212529] border-b border-gray-100 last:border-0 hover:bg-sky-50/40 transition-colors ${
                        isEven ? 'bg-white' : 'bg-[#f9fafb]'
                      }`}
                    >
                      <td className="py-3.5 px-6 font-normal">
                        ({row.activityCode}) {row.activityName}
                      </td>
                      <td className="py-3.5 px-6 font-normal uppercase text-gray-700">
                        {row.accountType}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-gray-800">
                        {row.accountCode}
                      </td>
                      <td className="py-3.5 px-6 font-normal text-gray-800">
                        {row.accountName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination footer matching Screenshot 1 */}
            <div className="py-3 px-6 border-t border-gray-100 flex items-center justify-end space-x-6 text-xs text-gray-600 select-none">
              <div className="flex items-center space-x-2">
                <span>Items per page:</span>
                <select 
                  value={pageSize} 
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-transparent border-0 text-xs text-gray-700 font-medium focus:ring-0 cursor-pointer outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <span>
                {totalCount === 0 ? '0 of 0' : `1 – ${totalCount} of ${totalCount}`}
              </span>
              <div className="flex items-center space-x-3 text-gray-400">
                <button 
                  type="button" 
                  disabled={true} 
                  className="cursor-default disabled:opacity-40 p-1"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  disabled={true} 
                  className="cursor-default disabled:opacity-40 p-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  disabled={true} 
                  className="cursor-default disabled:opacity-40 p-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  disabled={true} 
                  className="cursor-default disabled:opacity-40 p-1"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. CREATE VIEW (Matching Image 2, 3, 4)
          ======================================================== */}
      {viewMode === 'create' && (
        <div className="space-y-6">
          {/* Header row: "Create | Home / Accounting / Financial Activity Mappings / Create" */}
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-normal text-[#212529]">
              Create
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
                onClick={() => navigate && navigate('accounting')} 
                className="text-[#1072ba] hover:underline cursor-pointer"
              >
                Accounting
              </span>
              <span className="text-gray-400">/</span>
              <span 
                onClick={handleCancel} 
                className="text-[#1072ba] hover:underline cursor-pointer"
              >
                Financial Activity Mappings
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">Create</span>
            </div>
          </div>

          {/* Create Form Card matching Screenshot 2 */}
          <div 
            id="tour-mapping-create-card"
            className="max-w-2xl bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Field 1: Financial Activity * */}
              <div className="relative" ref={activityDropdownRef}>
                <label className="block text-xs font-normal text-gray-600 mb-1">
                  Financial Activity <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => {
                    setActivityDropdownOpen(!activityDropdownOpen);
                    setAccountDropdownOpen(false);
                  }}
                  className={`w-full py-1.5 border-b cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    activityDropdownOpen 
                      ? 'border-[#1072ba]' 
                      : 'border-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span className={selectedActivity ? 'text-[#212529]' : 'text-transparent select-none'}>
                    {selectedActivity 
                      ? `(${selectedActivity.code}) ${selectedActivity.name}` 
                      : 'Placeholder'}
                  </span>
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-[5px] border-t-gray-600 inline-block mr-1" />
                </div>

                {/* Dropdown Menu matching Screenshot 3: media_1792392236801_1a3e01c3.png */}
                {activityDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-[2px] shadow-xl border border-gray-200 mt-0.5 overflow-hidden animate-in fade-in duration-100">
                    <div className="max-h-60 overflow-y-auto">
                      {FINANCIAL_ACTIVITY_OPTIONS.map((item) => {
                        const isSelected = selectedActivity?.code === item.code;
                        return (
                          <div
                            key={item.code}
                            onClick={() => handleSelectActivity(item)}
                            className={`py-2.5 px-4 text-xs text-gray-800 cursor-pointer transition-colors ${
                              isSelected ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                            }`}
                          >
                            ({item.code}) {item.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Field 2: Account * */}
              <div className="relative pt-2" ref={accountDropdownRef}>
                <label className="block text-xs font-normal text-gray-600 mb-1">
                  Account <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => {
                    setAccountDropdownOpen(!accountDropdownOpen);
                    setActivityDropdownOpen(false);
                  }}
                  className={`w-full py-1.5 border-b cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    accountDropdownOpen 
                      ? 'border-[#1072ba]' 
                      : 'border-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span className={selectedAccount ? 'text-[#212529]' : 'text-transparent select-none'}>
                    {selectedAccount 
                      ? `(${selectedAccount.glCode}) ${selectedAccount.name}` 
                      : 'Placeholder'}
                  </span>
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-[5px] border-t-gray-600 inline-block mr-1" />
                </div>

                {/* Dropdown Menu with Search matching Screenshot 4: media_1792392252269_dae027bc.png */}
                {accountDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-[2px] shadow-xl border border-gray-200 mt-0.5 overflow-hidden animate-in fade-in duration-100">
                    {/* Search box with blinking cursor / input */}
                    <div className="px-3 py-2 border-b border-gray-200 bg-white flex items-center">
                      <input
                        type="text"
                        autoFocus
                        value={accountSearch}
                        onChange={(e) => setAccountSearch(e.target.value)}
                        placeholder="Search"
                        className="w-full text-xs text-gray-800 outline-none border-0 bg-transparent placeholder-gray-400"
                      />
                    </div>

                    {/* Filtered account list */}
                    <div className="max-h-56 overflow-y-auto">
                      {!selectedActivity ? (
                        <div className="py-3 px-4 text-xs text-gray-400 text-center italic">
                          Vui lòng chọn Financial Activity trước
                        </div>
                      ) : filteredAccounts.length === 0 ? (
                        <div className="py-3 px-4 text-xs text-gray-400 text-center">
                          Không tìm thấy tài khoản phù hợp
                        </div>
                      ) : (
                        filteredAccounts.map((acc) => {
                          const isSelected = selectedAccount?.glCode === acc.glCode;
                          return (
                            <div
                              key={acc.glCode}
                              onClick={() => handleSelectAccount(acc)}
                              className={`py-2.5 px-4 text-xs text-gray-800 cursor-pointer transition-colors ${
                                isSelected ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                              }`}
                            >
                              ({acc.glCode}) {acc.name}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons matching Screenshot 2: Cancel and Submit */}
              <div className="mt-8 pt-4 flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="py-1.5 px-5 bg-white border border-gray-300 hover:bg-gray-50 text-[#333333] text-xs font-medium rounded-[2px] cursor-pointer shadow-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="tour-submit-mapping-btn"
                  disabled={!selectedActivity || !selectedAccount}
                  className={`py-1.5 px-5 text-xs font-medium rounded-[2px] transition-colors shadow-xs ${
                    selectedActivity && selectedAccount
                      ? 'bg-[#1072ba] hover:bg-[#0e619e] text-white cursor-pointer'
                      : 'bg-[#e0e0e0] text-[#888888] cursor-not-allowed'
                  }`}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
