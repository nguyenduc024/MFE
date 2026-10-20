import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';

/**
 * Reusable Floating Label Input Component (Material underline style)
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  rightIcon = null,
  disabled = false,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors ${
      isFocused ? 'border-[#1072ba]' : 'border-gray-300'
    } ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? '-top-1 text-[11px] ' + (isFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        required={required}
        disabled={disabled}
        value={value ?? ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5"
      />
      {rightIcon && (
        <div className="absolute right-0 bottom-1.5 pointer-events-none text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Floating Label Select Component (Material underline style)
 */
function FloatingSelect({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  return (
    <div className={`relative pt-3.5 pb-1 border-b transition-colors ${
      isFocused ? 'border-[#1072ba]' : 'border-gray-300'
    } ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? '-top-1 text-[11px] ' + (isFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      <select
        required={required}
        disabled={disabled}
        value={value ?? ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 appearance-none cursor-pointer"
      >
        {children}
      </select>
      <div className="absolute right-0 bottom-1.5 pointer-events-none text-gray-500">
        <ChevronDown className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

export default function CreateSavingsAccountView({
  client,
  savingsProducts = [],
  users = [],
  onSaveSavingsAccount,
  onCancel,
  onNavigateHome,
  onNavigateClients
}) {
  const defaultProduct = savingsProducts.find(p => p.shortName === 'TKCA' || p.name.includes('Current')) || savingsProducts[0];

  const [formData, setFormData] = useState({
    productId: defaultProduct?.id || '',
    submittedOnDate: '10/20/2026',
    fieldOfficerId: users[0]?.id || '',
    externalId: 'TKB-CASA-001',
    initialDeposit: '12000000'
  });

  const selectedProduct = savingsProducts.find(p => String(p.id) === String(formData.productId)) || defaultProduct;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const depositAmount = parseFloat(formData.initialDeposit) || 12000000;
    const newSavingsAccount = {
      id: String(Date.now()),
      accountNo: '000000001',
      clientId: client.id,
      clientName: client.displayName,
      productId: selectedProduct?.id || '1',
      productName: selectedProduct?.name || 'TKB Current Account',
      accountType: 'Savings (Thanh toán)',
      balance: depositAmount,
      status: 'Active',
      lastActive: '2026-10-15',
      openedDate: '2026-10-15',
      externalId: formData.externalId
    };

    if (onSaveSavingsAccount) {
      onSaveSavingsAccount(newSavingsAccount);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-5 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs: Create Saving Account | Home / Clients / Minh Quang Tran / Create Saving Account */}
      <div className="flex items-center space-x-2.5 mb-5">
        <h1 className="text-xl font-normal text-[#212529]">
          Create Saving Account
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
            onClick={onNavigateClients} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Clients
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={onCancel} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            {client?.displayName || 'Minh Quang Tran'}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Create Saving Account</span>
        </div>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-7">
        
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            Cấp Tài Khoản Tiền Gửi Thanh Toán (CASA Application)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Khách hàng thụ hưởng: <strong className="text-[#1072ba]">{client?.displayName}</strong> ({client?.officeName})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Product * & Submitted On * */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FloatingSelect
              label="Product *"
              required
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            >
              {savingsProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.shortName})
                </option>
              ))}
            </FloatingSelect>

            <FloatingInput
              label="Submitted On *"
              required
              value={formData.submittedOnDate}
              onChange={(e) => setFormData({ ...formData, submittedOnDate: e.target.value })}
              rightIcon={<Calendar className="w-3.5 h-3.5" />}
            />
          </div>

          {/* Row 2: Field Officer & External Id */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FloatingSelect
              label="Field Officer"
              value={formData.fieldOfficerId}
              onChange={(e) => setFormData({ ...formData, fieldOfficerId: e.target.value })}
            >
              <option value="">Dang, Quan</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.firstname} {u.lastname}</option>
              ))}
            </FloatingSelect>

            <FloatingInput
              label="External Id"
              value={formData.externalId}
              onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
            />
          </div>

          {/* Row 3: Initial Deposit Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FloatingInput
              label="Initial Deposit Amount (Số tiền nộp mở tài khoản)"
              type="number"
              value={formData.initialDeposit}
              onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
            />
            <div />
          </div>

          {/* Inherited Product Terms Preview */}
          <div className="bg-gray-50 p-4 rounded-[2px] border border-gray-200 space-y-3 text-xs text-gray-700">
            <h4 className="font-bold text-[#1072ba] uppercase tracking-wider text-[11px]">
              Quy cách điều khoản sản phẩm: {selectedProduct?.name || 'TKB Current Account'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-500">Đơn vị tiền tệ:</span>
                <div className="font-medium text-gray-900">{selectedProduct?.currencyCode || 'VND'}</div>
              </div>
              <div>
                <span className="text-gray-500">Lãi suất hàng năm:</span>
                <div className="font-medium text-gray-900">{selectedProduct?.nominalAnnualInterestRate ?? 0}%</div>
              </div>
              <div>
                <span className="text-gray-500">Chu kỳ tính lãi:</span>
                <div className="font-medium text-gray-900">Daily Balance</div>
              </div>
              <div>
                <span className="text-gray-500">Chu kỳ ghi nhận lãi:</span>
                <div className="font-medium text-gray-900">Monthly</div>
              </div>
              <div>
                <span className="text-gray-500">Số ngày trong năm:</span>
                <div className="font-medium text-gray-900">365 Days</div>
              </div>
              <div>
                <span className="text-gray-500">Phương thức hạch toán:</span>
                <div className="font-medium text-purple-700">{selectedProduct?.accountingRule || 'Cash Based'}</div>
              </div>
            </div>
          </div>

          {/* Actions: [ Cancel ] [ Submit ] */}
          <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-normal px-5 py-2 rounded-[3px] transition-colors shadow-2xs cursor-pointer select-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-6 py-2 rounded-[3px] transition-colors shadow-2xs cursor-pointer select-none"
            >
              Submit & Activate CASA
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
