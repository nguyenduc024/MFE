import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Material-style Floating Label Input
 */
function FloatingInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  error = '',
  type = 'text',
  required = false,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue || Boolean(error);

  let borderColor = 'border-gray-300';
  let labelColor = 'text-gray-500';

  if (error) {
    borderColor = 'border-[#e53935]';
    labelColor = 'text-[#e53935] font-medium';
  } else if (isFocused) {
    borderColor = 'border-[#1072ba]';
    labelColor = 'text-[#1072ba] font-medium';
  }

  return (
    <div id={id} className={`relative pt-3.5 pb-1 border-b transition-colors ${borderColor} ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? '-top-0.5 text-[10px] ' + labelColor
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-2 pt-0.5"
      />
      {error && (
        <div className="absolute left-0 top-full pt-0.5 text-[10px] text-[#e53935] select-none pointer-events-none leading-none">
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Material-style Floating Label Textarea
 */
function FloatingTextarea({
  id,
  label,
  value,
  onChange,
  onBlur,
  rows = 2,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue;

  const borderColor = isFocused ? 'border-[#1072ba]' : 'border-gray-300';
  const labelColor = isFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500';

  return (
    <div id={id} className={`relative pt-3.5 pb-1 border-b transition-colors ${borderColor} ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? '-top-0.5 text-[10px] ' + labelColor
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      <textarea
        rows={rows}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pt-1 resize-none"
      />
    </div>
  );
}

/**
 * Material-style Floating Select
 */
function FloatingSelect({
  id,
  label,
  value,
  onChange,
  children,
  error = '',
  required = false,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const isFloated = isFocused || hasValue || Boolean(error);

  let borderColor = 'border-gray-300';
  let labelColor = 'text-gray-500';
  let chevronColor = 'text-gray-400';

  if (error) {
    borderColor = 'border-[#e53935]';
    labelColor = 'text-[#e53935] font-medium';
    chevronColor = 'text-[#e53935]';
  } else if (isFocused) {
    borderColor = 'border-[#1072ba]';
    labelColor = 'text-[#1072ba] font-medium';
    chevronColor = 'text-[#1072ba]';
  }

  return (
    <div id={id} className={`relative pt-3.5 pb-1 border-b transition-colors ${borderColor} ${className}`}>
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
          isFloated
            ? '-top-0.5 text-[10px] ' + labelColor
            : 'top-3.5 text-xs text-gray-500'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          required={required}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent text-xs outline-none pr-6 pt-0.5 appearance-none cursor-pointer ${!hasValue && !isFocused ? 'text-transparent' : 'text-gray-800'}`}
        >
          {children}
        </select>
        <ChevronDown
          className={`w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${chevronColor}`}
        />
      </div>
      {error && (
        <div className="absolute left-0 top-full pt-0.5 text-[10px] text-[#e53935] select-none pointer-events-none leading-none">
          {error}
        </div>
      )}
    </div>
  );
}

// Predefined authentic account tag options in Apache Fineract
const PREDEFINED_TAG_OPTIONS = [
  { id: '1', name: 'Operating Cost Tags' },
  { id: '2', name: 'General Administrative Tags' },
  { id: '3', name: 'Payroll & Benefits Tags' },
  { id: '4', name: 'Treasury & Liquidity Tags' },
  { id: '5', name: 'Provisioning Tags' }
];

export default function CreateAccountingRuleView({
  offices = [],
  glAccounts = [],
  navigate,
  onAddRule
}) {
  // Offices data
  const officeList = useMemo(() => {
    if (offices && offices.length > 0) return offices;
    return [
      { id: '1', name: 'Takashimaya Bank (TKB) - HO' },
      { id: '2', name: 'Hanoi Branch' }
    ];
  }, [offices]);

  // GL Accounts data (filter detail accounts)
  const detailGlAccounts = useMemo(() => {
    const defaultAccounts = [
      { id: '530101', glCode: '530101', name: 'Operating Expense' },
      { id: '220301', glCode: '220301', name: 'Accrued Operating Expenses Payable' },
      { id: '110101', glCode: '110101', name: 'Cash on Hand' },
      { id: '110102', glCode: '110102', name: 'Vault Cash' }
    ];

    if (glAccounts && glAccounts.length > 0) {
      const details = glAccounts.filter(a => !a.usage || a.usage.toLowerCase() === 'detail');
      if (details.length > 0) {
        // Ensure 530101 and 220301 exist
        const has530101 = details.some(a => a.glCode === '530101');
        const has220301 = details.some(a => a.glCode === '220301');
        const merged = [...details];
        if (!has530101) merged.unshift(defaultAccounts[0]);
        if (!has220301) merged.unshift(defaultAccounts[1]);
        return merged;
      }
    }
    return defaultAccounts;
  }, [glAccounts]);

  // Form State
  const [name, setName] = useState('');
  const [officeId, setOfficeId] = useState(officeList[0]?.id || '1');
  const [debitRuleType, setDebitRuleType] = useState('fixedAccount'); // 'fixedAccount' | 'listOfAccounts'
  const [accountToDebit, setAccountToDebit] = useState(
    detailGlAccounts.find(a => a.glCode === '530101')?.id || detailGlAccounts[0]?.id || ''
  );
  const [debitTags, setDebitTags] = useState('');
  const [allowMultipleDebitEntries, setAllowMultipleDebitEntries] = useState(false);

  const [creditRuleType, setCreditRuleType] = useState('fixedAccount'); // 'fixedAccount' | 'listOfAccounts'
  const [accountToCredit, setAccountToCredit] = useState(
    detailGlAccounts.find(a => a.glCode === '220301')?.id || detailGlAccounts[1]?.id || detailGlAccounts[0]?.id || ''
  );
  const [creditTags, setCreditTags] = useState('');
  const [allowMultipleCreditEntries, setAllowMultipleCreditEntries] = useState(false);

  const [description, setDescription] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  // Listen to custom practice events
  useEffect(() => {
    const handleFillName = () => {
      setName('Operating Expense Accrual');
      setNameTouched(true);
    };
    const handleFillOffice = () => {
      setOfficeId(officeList[0]?.id || '1');
    };
    const handleFillDebit = () => {
      setDebitRuleType('fixedAccount');
      const debitAcc = detailGlAccounts.find(a => a.glCode === '530101');
      if (debitAcc) setAccountToDebit(debitAcc.id);
    };
    const handleFillCredit = () => {
      setCreditRuleType('fixedAccount');
      const creditAcc = detailGlAccounts.find(a => a.glCode === '220301');
      if (creditAcc) setAccountToCredit(creditAcc.id);
    };
    const handleFillDesc = () => {
      setDescription('Records operating expenses incurred but not yet paid, ensuring consistent accrual accounting entries.');
    };
    const handleFillAll = () => {
      handleFillName();
      handleFillOffice();
      handleFillDebit();
      handleFillCredit();
      handleFillDesc();
    };

    window.addEventListener('practice-fill-accounting-rule-name', handleFillName);
    window.addEventListener('practice-fill-accounting-rule-office', handleFillOffice);
    window.addEventListener('practice-fill-accounting-rule-debit', handleFillDebit);
    window.addEventListener('practice-fill-accounting-rule-credit', handleFillCredit);
    window.addEventListener('practice-fill-accounting-rule-desc', handleFillDesc);
    window.addEventListener('practice-fill-accounting-rule-all', handleFillAll);

    return () => {
      window.removeEventListener('practice-fill-accounting-rule-name', handleFillName);
      window.removeEventListener('practice-fill-accounting-rule-office', handleFillOffice);
      window.removeEventListener('practice-fill-accounting-rule-debit', handleFillDebit);
      window.removeEventListener('practice-fill-accounting-rule-credit', handleFillCredit);
      window.removeEventListener('practice-fill-accounting-rule-desc', handleFillDesc);
      window.removeEventListener('practice-fill-accounting-rule-all', handleFillAll);
    };
  }, [detailGlAccounts, officeList]);

  // Validation
  const isNameValid = name.trim().length > 0;
  const isOfficeValid = Boolean(officeId);
  const isDebitValid = debitRuleType === 'fixedAccount' ? Boolean(accountToDebit) : Boolean(debitTags);
  const isCreditValid = creditRuleType === 'fixedAccount' ? Boolean(accountToCredit) : Boolean(creditTags);
  const isFormValid = isNameValid && isOfficeValid && isDebitValid && isCreditValid;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!isFormValid) return;

    const selectedOfficeObj = officeList.find(o => String(o.id) === String(officeId));
    const selectedDebitAcc = detailGlAccounts.find(a => String(a.id) === String(accountToDebit));
    const selectedCreditAcc = detailGlAccounts.find(a => String(a.id) === String(accountToCredit));
    const selectedDebitTagObj = PREDEFINED_TAG_OPTIONS.find(t => String(t.id) === String(debitTags));
    const selectedCreditTagObj = PREDEFINED_TAG_OPTIONS.find(t => String(t.id) === String(creditTags));

    const newRule = {
      id: String(Date.now()),
      name: name.trim(),
      officeId: officeId,
      officeName: selectedOfficeObj?.name || 'Takashimaya Bank (TKB) - HO',
      debitRuleType,
      debitAccountId: debitRuleType === 'fixedAccount' ? selectedDebitAcc?.glCode || selectedDebitAcc?.id : null,
      debitAccount: debitRuleType === 'fixedAccount' ? selectedDebitAcc?.name : '',
      debitTags: debitRuleType === 'listOfAccounts' ? selectedDebitTagObj?.name || '' : '',
      allowMultipleDebitEntries: debitRuleType === 'listOfAccounts' ? allowMultipleDebitEntries : false,
      creditRuleType,
      creditAccountId: creditRuleType === 'fixedAccount' ? selectedCreditAcc?.glCode || selectedCreditAcc?.id : null,
      creditAccount: creditRuleType === 'fixedAccount' ? selectedCreditAcc?.name : '',
      creditTags: creditRuleType === 'listOfAccounts' ? selectedCreditTagObj?.name || '' : '',
      allowMultipleCreditEntries: creditRuleType === 'listOfAccounts' ? allowMultipleCreditEntries : false,
      description: description.trim()
    };

    if (onAddRule) {
      onAddRule(newRule);
    }
    if (navigate) {
      navigate('accounting-view-rule', { rule: newRule });
    }
  };

  const handleCancel = () => {
    if (navigate) {
      navigate('accounting-rules');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* 1. Header: Create | Home / Accounting / Accounting Rules / Create matching media_1792408628696_fc32191c.png */}
      <div className="flex items-center space-x-2.5 mb-6">
        <h1 className="text-xl font-normal text-[#212529]">
          Create
        </h1>
        <span className="text-gray-300 font-light text-base">|</span>
        <div className="text-xs text-gray-500 font-normal flex items-center space-x-1.5 flex-wrap">
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
            onClick={() => navigate && navigate('accounting-rules')}
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Accounting Rules
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Create</span>
        </div>
      </div>

      {/* 2. Main Form Card matching media_1792408628696_fc32191c.png */}
      <div id="tour-create-rule-card" className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Rule Name & Office */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FloatingInput
              id="tour-rule-name-input"
              label="Accounting Rule Name *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              error={nameTouched && !name.trim() ? 'Accounting Rule Name is required' : ''}
            />

            <FloatingSelect
              id="tour-rule-office-select"
              label="Office *"
              required
              value={officeId}
              onChange={(e) => setOfficeId(e.target.value)}
            >
              {officeList.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.name}
                </option>
              ))}
            </FloatingSelect>
          </div>

          {/* Row 2: Debit Rule Type & Debit Account/Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center pt-2">
            {/* Debit Rule Type Radio */}
            <div id="tour-rule-debit-type" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-gray-700">
                Affected GL Entry (Debit) Rule Type *
              </span>
              <div className="flex items-center space-x-5 text-xs text-gray-700">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="debitRuleType"
                    value="fixedAccount"
                    checked={debitRuleType === 'fixedAccount'}
                    onChange={() => setDebitRuleType('fixedAccount')}
                    className="accent-[#8bc34a]"
                  />
                  <span>Fixed Account</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="debitRuleType"
                    value="listOfAccounts"
                    checked={debitRuleType === 'listOfAccounts'}
                    onChange={() => setDebitRuleType('listOfAccounts')}
                    className="accent-[#8bc34a]"
                  />
                  <span>List of Accounts</span>
                </label>
              </div>
            </div>

            {/* Debit Account or Debit Tags */}
            {debitRuleType === 'fixedAccount' ? (
              <FloatingSelect
                id="tour-rule-debit-account-select"
                label="Account to Debit"
                value={accountToDebit}
                onChange={(e) => setAccountToDebit(e.target.value)}
              >
                <option value=""></option>
                {detailGlAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </FloatingSelect>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <FloatingSelect
                  label="Debit Tags"
                  value={debitTags}
                  onChange={(e) => setDebitTags(e.target.value)}
                >
                  <option value=""></option>
                  {PREDEFINED_TAG_OPTIONS.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </FloatingSelect>
                <div className="flex items-center justify-end pt-3">
                  <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                    <span>Multiple Debit Entries Allowed</span>
                    <input
                      type="checkbox"
                      checked={allowMultipleDebitEntries}
                      onChange={(e) => setAllowMultipleDebitEntries(e.target.checked)}
                      className="accent-[#1072ba] rounded"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Row 3: Credit Rule Type & Credit Account/Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center pt-2">
            {/* Credit Rule Type Radio */}
            <div id="tour-rule-credit-type" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-gray-700">
                Affected GL Entry (Credit) Rule Type *
              </span>
              <div className="flex items-center space-x-5 text-xs text-gray-700">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="creditRuleType"
                    value="fixedAccount"
                    checked={creditRuleType === 'fixedAccount'}
                    onChange={() => setCreditRuleType('fixedAccount')}
                    className="accent-[#8bc34a]"
                  />
                  <span>Fixed Account</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="creditRuleType"
                    value="listOfAccounts"
                    checked={creditRuleType === 'listOfAccounts'}
                    onChange={() => setCreditRuleType('listOfAccounts')}
                    className="accent-[#8bc34a]"
                  />
                  <span>List of Accounts</span>
                </label>
              </div>
            </div>

            {/* Credit Account or Credit Tags */}
            {creditRuleType === 'fixedAccount' ? (
              <FloatingSelect
                id="tour-rule-credit-account-select"
                label="Account to Credit"
                value={accountToCredit}
                onChange={(e) => setAccountToCredit(e.target.value)}
              >
                <option value=""></option>
                {detailGlAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </FloatingSelect>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <FloatingSelect
                  label="Credit Tags"
                  value={creditTags}
                  onChange={(e) => setCreditTags(e.target.value)}
                >
                  <option value=""></option>
                  {PREDEFINED_TAG_OPTIONS.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </FloatingSelect>
                <div className="flex items-center justify-end pt-3">
                  <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                    <span>Multiple Credit Entries Allowed</span>
                    <input
                      type="checkbox"
                      checked={allowMultipleCreditEntries}
                      onChange={(e) => setAllowMultipleCreditEntries(e.target.checked)}
                      className="accent-[#1072ba] rounded"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Row 4: Description */}
          <div className="pt-2">
            <FloatingTextarea
              id="tour-rule-description-input"
              label="Description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Form Actions: Centered Cancel and Submit buttons */}
          <div className="flex items-center justify-center space-x-2.5 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-[3px] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="tour-rule-submit-btn"
              type="submit"
              disabled={!isFormValid}
              className={`px-4 py-2 text-xs font-medium text-white rounded-[3px] shadow-sm transition-colors ${
                isFormValid
                  ? 'bg-[#1072ba] hover:bg-[#0e63a3] cursor-pointer'
                  : 'bg-[#1072ba]/50 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
