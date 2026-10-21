import React, { useState } from 'react';
import { 
  Menu, User, Camera, Trash2, ArrowUp, ArrowDown, DollarSign,
  ChevronRight, X, Plus
} from 'lucide-react';

/**
 * Format date string to Mifos display format: DD MMMM YYYY (e.g. "13 October 2026")
 */
function formatDisplayDate(dateVal, fallback = '—') {
  if (!dateVal) return fallback;

  // Handle YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
    const [year, month, day] = dateVal.split('-');
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (!isNaN(d.getTime())) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  // Handle MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateVal)) {
    const [month, day, year] = dateVal.split('/');
    const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (!isNaN(d.getTime())) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  const parsed = new Date(dateVal);
  if (!isNaN(parsed.getTime())) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${String(parsed.getDate()).padStart(2, '0')} ${monthNames[parsed.getMonth()]} ${parsed.getFullYear()}`;
  }

  return dateVal;
}

/**
 * Format currency amount with comma separators and 2 decimal places (e.g. 12,000,000.00)
 */
function formatCurrency(amount) {
  if (amount === undefined || amount === null || amount === '') return '';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/,/g, ''));
  if (isNaN(num)) return String(amount);
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ClientDetailView({ 
  client, 
  loans = [], 
  savingsAccounts = [], 
  onBack, 
  onSelectLoan, 
  onSelectSavings,
  onOpenNewLoanModal,
  onOpenNewSavingsModal,
  onOpenNewFixedDeposit,
  onOpenNewRecurringDeposit,
  onSelectRecurringDeposit
}) {
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'address', 'family', 'identities', 'documents', 'notes'
  const [menuOpen, setMenuOpen] = useState(false);
  const [appsSubmenuOpen, setAppsSubmenuOpen] = useState(true);

  if (!client) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 text-center text-gray-500 font-sans">
        No client selected.
      </div>
    );
  }

  // Filter accounts belonging to this client (by id or accountNo)
  const clientLoans = loans.filter(l => String(l.clientId) === String(client.id) || String(l.clientId) === String(client.accountNo));
  const clientSavings = savingsAccounts.filter(s => String(s.clientId) === String(client.id) || String(s.clientId) === String(client.accountNo));

  // Split savings into Regular Savings/CASA, Fixed Deposit, and Recurring Deposit
  const recurringDepositAccounts = clientSavings.filter(s => 
    s.accountType === 'Recurring Deposit' || 
    (s.productName && (s.productName.toLowerCase().includes('recurring') || s.productName.toLowerCase().includes('goal savings') || s.productName.toLowerCase().includes('gửi góp')))
  );
  const fixedDepositAccounts = clientSavings.filter(s => 
    !recurringDepositAccounts.includes(s) && (s.accountType === 'Fixed Deposit' || (s.productName && (s.productName.toLowerCase().includes('fixed') || s.productName.toLowerCase().includes('kỳ hạn'))))
  );
  const currentAccounts = clientSavings.filter(s => 
    !recurringDepositAccounts.includes(s) && !fixedDepositAccounts.includes(s)
  );

  // Performance calculations
  const totalSavings = clientSavings.reduce((sum, s) => sum + (parseFloat(s.balance) || 0), 0);
  const lastLoanAmount = clientLoans.length > 0 ? clientLoans[0].principal : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Top Header & Breadcrumb matching Image: General | Home / Clients / Minh Quang Tran / General */}
      <div className="flex items-center space-x-2.5 mb-4">
        <h1 className="text-xl font-normal text-[#212529]">
          General
        </h1>
        <span className="text-gray-300 font-light text-base">|</span>
        <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5">
          <span 
            onClick={onBack} 
            className="text-gray-600 hover:underline cursor-pointer"
          >
            Home
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={onBack} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Clients
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={() => setActiveTab('general')} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {client.displayName || 'Minh Quang Tran'}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">General</span>
        </div>
      </div>

      {/* 2. Main Blue Banner Card matching Image: media_1792495256802_1f1cf497.png */}
      <div id="tour-client-detail-banner" className="bg-[#1072ba] text-white rounded-t-[3px] p-6 shadow-sm relative">
        <div className="flex items-start justify-between">
          
          <div className="flex items-start space-x-8">
            {/* Left: Silhouette Avatar & Action icons */}
            <div className="flex flex-col items-center">
              {/* Avatar silhouette */}
              <div className="w-16 h-16 bg-[#0c5c96] rounded-[2px] flex items-center justify-center border border-white/20">
                <svg className="w-12 h-12 text-white/90 fill-current" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>

              {/* 3 Action icons below avatar */}
              <div className="flex items-center space-x-1.5 mt-2">
                <button 
                  type="button" 
                  className="w-5 h-5 rounded-[2px] border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors"
                  title="Profile Photo"
                >
                  <User className="w-3 h-3 text-white" />
                </button>
                <button 
                  type="button" 
                  className="w-5 h-5 rounded-[2px] border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors"
                  title="Upload Document / Signature"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
                <button 
                  type="button" 
                  className="w-5 h-5 rounded-[2px] border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>

              <button 
                type="button"
                className="text-[11px] text-white hover:underline mt-1.5 font-normal"
              >
                View Signature
              </button>
            </div>

            {/* Middle: Client Details matching Image */}
            <div className="space-y-3">
              {/* Header: Green status box + Client Name */}
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#28a745] inline-block rounded-[1px]" />
                <h2 className="text-base font-bold text-white tracking-normal">
                  Client Name : {client.displayName || 'Minh Quang Tran'}
                </h2>
              </div>

              {/* Grid of details: Office, Client ID, External Id, Activation Date, Staff, Mobile, Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-1.5 text-xs text-white/95">
                {/* Column 1 */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-white/80">Office</span>
                    <span className="col-span-7 font-medium">{client.officeName || 'Thu Duc Transaction Office'}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-white/80">Client</span>
                    <span className="col-span-7 font-medium">{client.accountNo || '000000011'}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-white/80">External Id</span>
                    <span className="col-span-7 font-medium">{client.externalId || (client.accountNo === '000000012' ? 'TKB-CIF-TDU-002' : 'TKB-CIF-TDU-001')}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-white/80">Activation Date</span>
                    <span className="col-span-7 font-medium">{formatDisplayDate(client.activationDate, '13 October 2026')}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-white/80">Staff</span>
                    <span className="col-span-7 font-medium">{client.staffName ? client.staffName : (client.staffId ? 'Dang, Quan' : 'Unassigned')}</span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-white/80">Mobile Number</span>
                    <span className="col-span-7 font-medium">{client.mobileNo ? (client.mobileNo.startsWith('0') ? client.mobileNo.slice(1) : client.mobileNo) : (client.accountNo === '000000012' ? '94462817' : '955738216')}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 text-white/80">Email</span>
                    <span className="col-span-7 font-medium">{client.email || (client.accountNo === '000000012' ? 'ngoclan0805@gmail.com' : 'quang2004@gmail.com')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Far Right: Hamburger Action Menu matching Image 1 */}
          <div className="relative">
            <button
              id="tour-client-actions-menu-btn"
              type="button"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setAppsSubmenuOpen(true);
              }}
              className="p-1.5 text-white hover:bg-white/10 rounded-[2px] transition-colors cursor-pointer"
              title="Client Actions"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            {/* Dropdown Menu when clicked */}
            {menuOpen && (
              <div 
                id="tour-client-actions-dropdown" 
                className="absolute right-0 top-8 bg-white text-gray-800 rounded-[2px] shadow-xl border border-gray-200 py-1 z-50 text-xs flex animate-in fade-in duration-100"
              >
                {/* Main Menu Items */}
                <div className="w-44 py-1">
                  <div 
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                  >
                    <span>Edit</span>
                  </div>

                  <div 
                    onMouseEnter={() => setAppsSubmenuOpen(true)}
                    onClick={() => setAppsSubmenuOpen(!appsSubmenuOpen)}
                    className={`px-4 py-2 cursor-pointer flex items-center justify-between text-gray-700 ${
                      appsSubmenuOpen ? 'bg-sky-50 text-[#1072ba] font-medium' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>Applications</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>

                  <div 
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-700"
                  >
                    <span>Actions</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>

                  <div 
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  >
                    <span>Unassign Staff</span>
                  </div>

                  <div 
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-gray-700"
                  >
                    <span>More</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>

                {/* Submenu: Applications matching Image 1 */}
                {appsSubmenuOpen && (
                  <div 
                    id="tour-client-apps-submenu" 
                    className="w-56 border-l border-gray-200 py-1 bg-white"
                  >
                    <div 
                      onClick={() => {
                        setMenuOpen(false);
                        if (onOpenNewLoanModal) onOpenNewLoanModal();
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                    >
                      New Loan Account
                    </div>
                    <div 
                      onClick={() => {
                        setMenuOpen(false);
                        if (onOpenNewSavingsModal) onOpenNewSavingsModal();
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                    >
                      New Savings Account
                    </div>
                    <div 
                      className="px-4 py-2 text-gray-400 cursor-not-allowed"
                    >
                      New Share Account
                    </div>
                    <div 
                      id="tour-client-new-recurring-deposit-btn"
                      onClick={() => {
                        setMenuOpen(false);
                        if (onOpenNewRecurringDeposit) onOpenNewRecurringDeposit();
                      }}
                      className="px-4 py-2 bg-red-50/60 border border-red-500 text-red-700 font-semibold cursor-pointer hover:bg-red-100/60 transition-colors"
                    >
                      New Recurring Deposit Account
                    </div>
                    <div 
                      id="tour-client-new-fixed-deposit-btn"
                      onClick={() => {
                        setMenuOpen(false);
                        if (onOpenNewFixedDeposit) onOpenNewFixedDeposit();
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                    >
                      New Fixed Deposits Account
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 3. Tab Navigation Bar directly below Blue Banner matching Image */}
      <div className="bg-[#f8f9fa] border-x border-b border-gray-200 px-6 flex items-center space-x-8 text-xs font-normal">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`py-3 transition-colors ${
            activeTab === 'general'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          General
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('address')}
          className={`py-3 transition-colors ${
            activeTab === 'address'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Address
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('family')}
          className={`py-3 transition-colors ${
            activeTab === 'family'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Family Members
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identities')}
          className={`py-3 transition-colors ${
            activeTab === 'identities'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Identities
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`py-3 transition-colors ${
            activeTab === 'documents'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Documents
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`py-3 transition-colors ${
            activeTab === 'notes'
              ? 'border-b-2 border-[#1072ba] text-[#1072ba] font-medium'
              : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Notes
        </button>
      </div>

      {/* 4. Tab Content: General matching Image: media_1792495256802_1f1cf497.png */}
      {activeTab === 'general' && (
        <div className="bg-white border-x border-b border-gray-200 p-6 space-y-7">
          
          {/* Section: Performance History matching Image */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-800">
              Performance History
            </h3>

            <div className="border border-gray-400 p-4 rounded-[2px] bg-white grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
              {/* Column 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-48 text-gray-700">No. of Loan Cycles :</span>
                  <span className="font-normal text-gray-900">{clientLoans.length > 0 ? '1' : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-48 text-gray-700">No. of Active Loans :</span>
                  <span className="font-normal text-gray-900">{clientLoans.length > 0 ? clientLoans.length : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-48 text-gray-700">Last Loan Amount :</span>
                  <span className="font-normal text-gray-900">{lastLoanAmount ? formatCurrency(lastLoanAmount) : ''}</span>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-48 text-gray-700">No. of Active Savings :</span>
                  <span className="font-normal text-gray-900">{clientSavings.length > 0 ? clientSavings.length : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-48 text-gray-700">Total Savings :</span>
                  <span className="font-normal text-gray-900">{totalSavings > 0 ? formatCurrency(totalSavings) : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Upcoming Charges matching Image */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-800">
                Upcoming Charges
              </h3>
              <button
                type="button"
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[3px] shadow-2xs transition-colors cursor-pointer"
              >
                Charges Overview
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                  <tr>
                    <th className="py-2.5 px-3 font-normal">Name</th>
                    <th className="py-2.5 px-3 font-normal">Due as of</th>
                    <th className="py-2.5 px-3 font-normal">Due</th>
                    <th className="py-2.5 px-3 font-normal">Paid</th>
                    <th className="py-2.5 px-3 font-normal">Waived</th>
                    <th className="py-2.5 px-3 font-normal">Outstanding</th>
                    <th className="py-2.5 px-3 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state matching Image */}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Loan Accounts matching Image */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-800">
                Loan Accounts
              </h3>
              <button
                type="button"
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[3px] shadow-2xs transition-colors cursor-pointer"
              >
                View Closed Accounts
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                  <tr>
                    <th className="py-2.5 px-3 font-normal w-1/6">Account No.</th>
                    <th className="py-2.5 px-3 font-normal w-1/4">Loan Product</th>
                    <th className="py-2.5 px-3 font-normal">Original Loan</th>
                    <th className="py-2.5 px-3 font-normal">Loan Balance</th>
                    <th className="py-2.5 px-3 font-normal">Amount Paid</th>
                    <th className="py-2.5 px-3 font-normal">Type</th>
                    <th className="py-2.5 px-3 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clientLoans.length > 0 ? (
                    clientLoans.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50">
                        <td className="py-3 px-3 font-normal text-gray-900 flex items-center space-x-1.5">
                          <span className="w-2 h-2 bg-[#28a745] inline-block rounded-[1px]" />
                          <span 
                            onClick={() => onSelectLoan && onSelectLoan(l)}
                            className="text-gray-900 hover:text-[#1072ba] cursor-pointer"
                          >
                            {l.accountNo}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-normal text-gray-800">{l.productName}</td>
                        <td className="py-3 px-3 font-normal text-gray-800">{l.principal}</td>
                        <td className="py-3 px-3 font-normal text-gray-800">{formatCurrency(l.outstandingBalance || 9773366.75)}</td>
                        <td className="py-3 px-3 font-normal text-gray-800">{formatCurrency(l.totalRepaid || 888487.89)}</td>
                        <td className="py-3 px-3 font-normal text-gray-600">
                          <User className="w-3.5 h-3.5 text-gray-700" />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onSelectLoan && onSelectLoan(l)}
                            className="bg-[#1072ba] hover:bg-[#0e619e] text-white px-2.5 py-1 rounded-[2px] text-xs font-bold shadow-2xs cursor-pointer inline-flex items-center"
                            title="Make Repayment"
                          >
                            <DollarSign className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    /* User note: "khi không có sản phẩm nào bạn để trống" */
                    null
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Saving Accounts matching Image */}
          <div id="tour-client-detail-saving-table" className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-800">
                Saving Accounts
              </h3>
              <button
                type="button"
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[3px] shadow-2xs transition-colors cursor-pointer"
              >
                View Closed Accounts
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                  <tr>
                    <th className="py-2.5 px-3 font-normal w-1/5">Account No.</th>
                    <th className="py-2.5 px-3 font-normal w-2/5">Savings Product</th>
                    <th className="py-2.5 px-3 font-normal">Last Active</th>
                    <th className="py-2.5 px-3 font-normal">Balance</th>
                    <th className="py-2.5 px-3 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentAccounts.length > 0 ? (
                    currentAccounts.map((s) => (
                      <tr 
                        key={s.id} 
                        id={s.accountNo === '000000001' ? 'tour-saving-row-000000001' : s.accountNo === '000000002' ? 'tour-saving-row-000000002' : undefined}
                        onClick={() => onSelectSavings && onSelectSavings(s)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="py-3 px-3 font-normal text-gray-900 flex items-center space-x-1.5">
                          <span className="w-2 h-2 bg-[#28a745] inline-block rounded-[1px]" />
                          <span 
                            id={s.accountNo === '000000001' ? 'tour-saving-link-000000001' : s.accountNo === '000000002' ? 'tour-saving-link-000000002' : undefined}
                            className="text-[#1072ba] hover:underline font-medium cursor-pointer"
                          >
                            {s.accountNo}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-normal text-gray-800">{s.productName}</td>
                        <td className="py-3 px-3 font-normal text-gray-800">
                          {formatDisplayDate(s.lastActive || s.openedDate, '15 October 2026')}
                        </td>
                        <td className="py-3 px-3 font-normal text-gray-800">{formatCurrency(s.balance)}</td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          {/* Deposit Button: Blue up arrow */}
                          <button
                            type="button"
                            onClick={() => onSelectSavings && onSelectSavings(s)}
                            className="bg-[#1072ba] hover:bg-[#0e619e] text-white p-1 rounded-[2px] shadow-2xs inline-flex items-center cursor-pointer"
                            title="Deposit"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          {/* Withdraw Button: Blue down arrow */}
                          <button
                            type="button"
                            onClick={() => onSelectSavings && onSelectSavings(s)}
                            className="bg-[#1072ba] hover:bg-[#0e619e] text-white p-1 rounded-[2px] shadow-2xs inline-flex items-center cursor-pointer"
                            title="Withdraw"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    null
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Fixed Deposit Accounts matching Image */}
          <div id="tour-client-fixed-deposits-section" className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-800">
                Fixed Deposit Accounts
              </h3>
              <button
                type="button"
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[3px] shadow-2xs transition-colors cursor-pointer"
              >
                View Closed Accounts
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                  <tr>
                    <th className="py-2.5 px-3 font-normal w-1/5">Account No.</th>
                    <th className="py-2.5 px-3 font-normal w-2/5">Fixed Deposit Product</th>
                    <th className="py-2.5 px-3 font-normal">Last Active</th>
                    <th className="py-2.5 px-3 font-normal">Balance</th>
                    <th className="py-2.5 px-3 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fixedDepositAccounts.length > 0 ? (
                    fixedDepositAccounts.map((fd) => (
                      <tr 
                        key={fd.id} 
                        id={`tour-client-fd-row-${fd.accountNo}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-3 px-3 font-normal text-gray-900 flex items-center space-x-1.5">
                          <span className="w-2 h-2 bg-[#28a745] inline-block rounded-[1px]" />
                          <span 
                            onClick={() => onSelectSavings && onSelectSavings(fd)}
                            className="text-gray-900 hover:text-[#1072ba] cursor-pointer"
                          >
                            {fd.accountNo}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-normal text-gray-800">{fd.productName}</td>
                        <td className="py-3 px-3 font-normal text-gray-800">
                          {formatDisplayDate(fd.lastActive || fd.openedDate, '13 October 2026')}
                        </td>
                        <td className="py-3 px-3 font-normal text-gray-800">{formatCurrency(fd.balance)}</td>
                        <td className="py-3 px-3 text-right"></td>
                      </tr>
                    ))
                  ) : (
                    null
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Recurring Deposit Accounts matching Image */}
          <div id="tour-client-recurring-deposits-section" className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-800">
                Recurring Deposit Accounts
              </h3>
              <button
                type="button"
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[3px] shadow-2xs transition-colors cursor-pointer"
              >
                View Closed Accounts
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                  <tr>
                    <th className="py-2.5 px-3 font-normal w-1/5">Account No.</th>
                    <th className="py-2.5 px-3 font-normal w-2/5">Recurring Deposit Product</th>
                    <th className="py-2.5 px-3 font-normal">Last Active</th>
                    <th className="py-2.5 px-3 font-normal">Balance</th>
                    <th className="py-2.5 px-3 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recurringDepositAccounts.length > 0 ? (
                    recurringDepositAccounts.map((rd) => (
                      <tr 
                        key={rd.id || rd.accountNo} 
                        id={`tour-client-rd-row-${rd.accountNo}`}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => onSelectRecurringDeposit && onSelectRecurringDeposit(rd)}
                      >
                        <td className="py-3 px-3 font-normal text-gray-900 flex items-center space-x-1.5">
                          <span className={`w-2 h-2 inline-block rounded-[1px] ${
                            rd.status === 'Active' || rd.status === 'Activated'
                              ? 'bg-[#28a745]'
                              : rd.status === 'Approved'
                              ? 'bg-[#6366f1]'
                              : 'bg-[#f59e0b]'
                          }`} />
                          <span className="text-gray-900 hover:text-[#1072ba] cursor-pointer">
                            {rd.accountNo}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-normal text-gray-800">{rd.productName}</td>
                        <td className="py-3 px-3 font-normal text-gray-800">
                          {formatDisplayDate(rd.lastActive || rd.openedDate || rd.activatedOn, '13 October 2026')}
                        </td>
                        <td className="py-3 px-3 font-normal text-gray-800">
                          {rd.balance && Number(rd.balance) > 0 ? formatCurrency(rd.balance) : ''}
                        </td>
                        <td className="py-3 px-3 text-right"></td>
                      </tr>
                    ))
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Shares Accounts matching Image */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-800">
                Shares Accounts
              </h3>
              <button
                type="button"
                className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[3px] shadow-2xs transition-colors cursor-pointer"
              >
                View Closed Accounts
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                  <tr>
                    <th className="py-2.5 px-3 font-normal w-1/5">Account No.</th>
                    <th className="py-2.5 px-3 font-normal w-2/5">Share Product</th>
                    <th className="py-2.5 px-3 font-normal">Approved Shares</th>
                    <th className="py-2.5 px-3 font-normal">Pending For Approval Shares</th>
                    <th className="py-2.5 px-3 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state matching Image */}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Collateral Data matching Image */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-800">
                Collateral Data
              </h3>
              <button
                type="button"
                disabled
                className="bg-[#e0e0e0] text-[#9e9e9e] text-xs font-medium px-3.5 py-1.5 rounded-[3px] cursor-not-allowed select-none"
              >
                View Collaterals
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-[2px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-500 font-normal">
                  <tr>
                    <th className="py-2.5 px-3 font-normal">ID</th>
                    <th className="py-2.5 px-3 font-normal">Name</th>
                    <th className="py-2.5 px-3 font-normal">Quantity</th>
                    <th className="py-2.5 px-3 font-normal">Total Value</th>
                    <th className="py-2.5 px-3 font-normal">Total Collateral Value</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state matching Image */}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Other tabs placeholder if clicked */}
      {activeTab !== 'general' && (
        <div className="bg-white border-x border-b border-gray-200 p-8 text-center text-xs text-gray-500">
          Chưa có dữ liệu trong mục {activeTab.toUpperCase()}.
        </div>
      )}

    </div>
  );
}
