import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

export default function ViewAccountingRuleView({
  rule,
  navigate,
  onDeleteRule
}) {
  // Fallback default rule if none selected
  const currentRule = rule || {
    id: '1',
    name: 'Operating Expense Accrual',
    officeName: 'Takashimaya Bank (TKB) - HO',
    description: 'Records operating expenses incurred but not yet paid, ensuring consistent accrual accounting entries.',
    allowMultipleDebitEntries: false,
    allowMultipleCreditEntries: false,
    debitAccount: 'Operating Expense',
    debitAccountId: '530101',
    creditAccount: 'Accrued Operating Expenses Payable',
    creditAccountId: '220301'
  };

  const debitDisplay = currentRule.debitAccount
    ? `${currentRule.debitAccount} (${currentRule.debitAccountId || '530101'})`
    : currentRule.debitTags || 'Operating Expense (530101)';

  const creditDisplay = currentRule.creditAccount
    ? `${currentRule.creditAccount} (${currentRule.creditAccountId || '220301'})`
    : currentRule.creditTags || 'Accrued Operating Expenses Payable (220301)';

  return (
    <div id="tour-view-rule-screen" className="max-w-6xl mx-auto px-6 py-6 select-none font-sans animate-in fade-in duration-150">
      {/* 1. Header & Actions matching media_1792408749928_15ce7c1c.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Left: Title & Breadcrumbs */}
        <div className="flex items-center space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            {currentRule.name}
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
            <span className="text-gray-500">{currentRule.name}</span>
          </div>
        </div>

        {/* Right: Edit & Delete Buttons */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => navigate && navigate('accounting-create-rule')}
            className="bg-[#1072ba] hover:bg-[#0e63a3] text-white text-xs font-medium px-4 py-2 rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (onDeleteRule) onDeleteRule(currentRule.id);
              if (navigate) navigate('accounting-rules');
            }}
            className="bg-[#e53935] hover:bg-[#d32f2f] text-white text-xs font-medium px-4 py-2 rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* 2. Side-by-Side Detail Cards matching openMF/web-app view-rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Card: Office, Description, Multiple entries flags */}
        <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-6 space-y-6">
          {/* Office */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <span className="font-semibold text-gray-800">Office</span>
            <span className="text-gray-800">{currentRule.officeName}</span>
          </div>

          {/* Description */}
          {currentRule.description && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <span className="font-semibold text-gray-800">Description</span>
              <span className="text-gray-800 leading-relaxed">{currentRule.description}</span>
            </div>
          )}

          {/* Multiple Debit Entries Allowed */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <span className="font-semibold text-gray-800">Multiple Debit Entries Allowed</span>
            <span className="text-gray-800 font-mono">
              {currentRule.allowMultipleDebitEntries ? 'true' : 'false'}
            </span>
          </div>

          {/* Multiple Credit Entries Allowed */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <span className="font-semibold text-gray-800">Multiple Credit Entries Allowed</span>
            <span className="text-gray-800 font-mono">
              {currentRule.allowMultipleCreditEntries ? 'true' : 'false'}
            </span>
          </div>
        </div>

        {/* Right Card: Debit Account Name & Credit Account Name */}
        <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Debit Account Column */}
            <div className="space-y-4">
              <div className="font-semibold text-gray-800">
                {currentRule.debitAccount ? 'Debit Account Name' : 'Debit Tags'}
              </div>
              <div className="text-gray-800">
                {debitDisplay}
              </div>
            </div>

            {/* Credit Account Column */}
            <div className="space-y-4">
              <div className="font-semibold text-gray-800">
                {currentRule.creditAccount ? 'Credit Account Name' : 'Credit Tags'}
              </div>
              <div className="text-gray-800">
                {creditDisplay}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
