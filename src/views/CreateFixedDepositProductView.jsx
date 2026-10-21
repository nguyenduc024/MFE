import React, { useState, useEffect } from 'react';
import { Pencil, Check, Calendar, Trash2, Plus, ChevronDown } from 'lucide-react';

/**
 * Reusable Floating Label Input Component (Material underline style matching screenshot)
 */
function FloatingInput({
  label,
  value,
  onChange,
  type = 'text',
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
      <input
        type={type}
        required={required}
        disabled={disabled}
        value={value ?? ''}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent text-xs text-gray-800 outline-none pr-4 pt-0.5"
      />
    </div>
  );
}

/**
 * Reusable Floating Label Select Component (Material underline style matching screenshot)
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
      <div className="relative flex items-center">
        <select
          required={required}
          disabled={disabled}
          value={value ?? ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent text-xs text-gray-800 outline-none pr-6 pt-0.5 cursor-pointer appearance-none"
        >
          {children}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 pointer-events-none" />
      </div>
    </div>
  );
}

export default function CreateFixedDepositProductView({
  onNavigateHome,
  onNavigateProducts,
  onNavigateFixedDepositProducts,
  onSaveProduct
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1 to 7

  const steps = [
    { id: 1, label: 'DETAILS' },
    { id: 2, label: 'CURRENCY' },
    { id: 3, label: 'TERMS' },
    { id: 4, label: 'SETTINGS' },
    { id: 5, label: 'INTEREST RATE CHART' },
    { id: 6, label: 'CHARGES' },
    { id: 7, label: 'ACCOUNTING' }
  ];

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: DETAILS (Image 1)
    name: '',
    shortName: '',
    description: '',

    // Step 2: CURRENCY (Image 2)
    currency: 'Vietnamese Dong',
    decimalPlaces: '0',
    currencyMultiplesOf: '1',

    // Step 3: TERMS (Image 3)
    minDepositAmount: '',
    defaultDepositAmount: '',
    maxDepositAmount: '',
    interestCompoundingPeriod: 'Monthly',
    interestPostingPeriod: 'Monthly',
    interestCalculationUsing: 'Daily Balance',
    daysInYear: '365 Days',

    // Step 4: SETTINGS (Image 4)
    lockinPeriodFrequency: '',
    lockinPeriodType: '',
    minDepositTermFrequency: '',
    minDepositTermType: 'Months',
    inMultiplesOfFrequency: '',
    inMultiplesOfType: 'Months',
    maxDepositTermFrequency: '',
    maxDepositTermType: 'Months',
    applyPenalInterest: false,
    penalInterest: '',
    penalInterestPeriod: '',
    isWithholdTaxApplicable: false,

    // Step 5: INTEREST RATE CHART (Image 5)
    hasChart: true,
    chartName: '',
    chartFromDate: '',
    chartEndDate: '',
    chartDescription: '',
    isPrimaryGroupingByAmount: false
  });

  // Practice event listeners
  useEffect(() => {
    const handleAutofillDetails = () => {
      setFormData(prev => ({
        ...prev,
        name: 'TKB Fixed Deposit',
        shortName: 'TKFD',
        description: 'A VND fixed term deposit product offered by Takashimaya Bank, supporting 3, 6, and 12-month deposit terms with tiered annual interest rates. Designed for secure savings interest revenue, with maturity-based withdrawal.'
      }));
    };

    const handleAutofillCurrency = () => {
      setFormData(prev => ({
        ...prev,
        currency: 'Vietnamese Dong',
        decimalPlaces: '0',
        currencyMultiplesOf: '1'
      }));
    };

    const handleAutofillTerms = () => {
      setFormData(prev => ({
        ...prev,
        minDepositAmount: '1000000',
        defaultDepositAmount: '10000000',
        maxDepositAmount: '1000000000',
        interestCompoundingPeriod: 'Monthly',
        interestPostingPeriod: 'Monthly',
        interestCalculationUsing: 'Daily Balance',
        daysInYear: '365 Days'
      }));
    };

    const handleAutofillSettings = () => {
      setFormData(prev => ({
        ...prev,
        lockinPeriodFrequency: '',
        lockinPeriodType: '',
        minDepositTermFrequency: '3',
        minDepositTermType: 'Months',
        inMultiplesOfFrequency: '3',
        inMultiplesOfType: 'Months',
        maxDepositTermFrequency: '12',
        maxDepositTermType: 'Months',
        applyPenalInterest: false,
        penalInterest: '',
        penalInterestPeriod: '',
        isWithholdTaxApplicable: false
      }));
    };

    const handleAutofillChart = () => {
      setFormData(prev => ({
        ...prev,
        hasChart: true,
        chartName: 'TKB FD VND Interest Rates 2026',
        chartFromDate: '9/1/2026',
        chartEndDate: '',
        chartDescription: 'Annual interest rate schedule for TKB Fixed Deposit with 3, 6, 9 and 12-month terms.',
        isPrimaryGroupingByAmount: false
      }));
    };

    const handleNextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, 7));
    };

    window.addEventListener('practice-autofill-fd-details', handleAutofillDetails);
    window.addEventListener('practice-autofill-fd-currency', handleAutofillCurrency);
    window.addEventListener('practice-autofill-fd-terms', handleAutofillTerms);
    window.addEventListener('practice-autofill-fd-settings', handleAutofillSettings);
    window.addEventListener('practice-autofill-fd-chart', handleAutofillChart);
    window.addEventListener('practice-next-fd-step', handleNextStep);

    return () => {
      window.removeEventListener('practice-autofill-fd-details', handleAutofillDetails);
      window.removeEventListener('practice-autofill-fd-currency', handleAutofillCurrency);
      window.removeEventListener('practice-autofill-fd-terms', handleAutofillTerms);
      window.removeEventListener('practice-autofill-fd-settings', handleAutofillSettings);
      window.removeEventListener('practice-autofill-fd-chart', handleAutofillChart);
      window.removeEventListener('practice-next-fd-step', handleNextStep);
    };
  }, []);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 select-none font-sans text-gray-800">
      
      {/* 1. Header & Breadcrumbs matching Image 1: Create | Home / Products / Fixed Deposit Products / Create */}
      <div className="flex items-center space-x-2.5 mb-5">
        <h1 className="text-xl font-normal text-[#212529]">
          Create
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
            onClick={onNavigateProducts} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Products
          </span>
          <span className="text-gray-400">/</span>
          <span 
            onClick={onNavigateFixedDepositProducts} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Fixed Deposit Products
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Create</span>
        </div>
      </div>

      {/* 2. Main White Card */}
      <div className="bg-white rounded-[2px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-100 p-8 space-y-8">
        
        {/* Stepper Header matching Image 1, 2, 3, 4, 5 */}
        <div id="tour-fd-stepper" className="relative flex items-center justify-between px-4 pt-1 pb-4">
          <div className="absolute left-8 right-8 top-4.5 h-[1px] bg-gray-300 -z-0" />

          {steps.map((st) => {
            const isActive = currentStep === st.id;
            const isCompleted = currentStep > st.id;

            return (
              <div 
                key={st.id}
                onClick={() => {
                  if (isCompleted || (formData.name && formData.shortName)) {
                    setCurrentStep(st.id);
                  }
                }}
                className={`flex flex-col items-center z-10 cursor-pointer ${
                  isActive ? 'px-2 py-1 -my-1 rounded-[2px]' : ''
                }`}
              >
                {/* Circle Icon */}
                {isActive ? (
                  <div className="w-7 h-7 rounded-full bg-[#1072ba] text-white flex items-center justify-center shadow-2xs">
                    <Pencil className="w-3.5 h-3.5" />
                  </div>
                ) : isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-[#28a745] text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#808080] text-white flex items-center justify-center shadow-2xs">
                    <Pencil className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Step Label */}
                <span className={`text-[10px] font-semibold tracking-wider mt-1.5 uppercase ${
                  isActive ? 'text-gray-900 font-bold' : 'text-gray-500'
                }`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tab 1: DETAILS matching Image 1 */}
        {currentStep === 1 && (
          <form 
            id="tour-fd-details-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <FloatingInput
                label="Product Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <FloatingInput
                label="Short Name *"
                required
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
              />
            </div>

            <div className="pt-2">
              <FloatingInput
                label="Description *"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                disabled
                className="px-5 py-2 text-xs font-medium text-gray-400 bg-gray-100 rounded-[3px] cursor-not-allowed select-none"
              >
                Previous
              </button>
              <button
                type="submit"
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: CURRENCY matching Image 2 */}
        {currentStep === 2 && (
          <form 
            id="tour-fd-currency-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <FloatingSelect
                label="Currency *"
                required
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="Vietnamese Dong">Vietnamese Dong</option>
                <option value="US Dollar">US Dollar</option>
                <option value="Euro">Euro</option>
              </FloatingSelect>

              <FloatingInput
                label="Decimal Places *"
                required
                type="number"
                value={formData.decimalPlaces}
                onChange={(e) => setFormData({ ...formData, decimalPlaces: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-2">
              <FloatingInput
                label="Currency in multiples of"
                type="number"
                value={formData.currencyMultiplesOf}
                onChange={(e) => setFormData({ ...formData, currencyMultiplesOf: e.target.value })}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: TERMS matching Image 3 */}
        {currentStep === 3 && (
          <form 
            id="tour-fd-terms-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div>
              <h3 className="text-xs font-semibold text-gray-800 mb-3">
                Deposit Amount
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                <FloatingInput
                  label="Minimum"
                  value={formData.minDepositAmount}
                  onChange={(e) => setFormData({ ...formData, minDepositAmount: e.target.value })}
                />
                <FloatingInput
                  label="Default *"
                  required
                  value={formData.defaultDepositAmount}
                  onChange={(e) => setFormData({ ...formData, defaultDepositAmount: e.target.value })}
                />
                <FloatingInput
                  label="Maximum"
                  value={formData.maxDepositAmount}
                  onChange={(e) => setFormData({ ...formData, maxDepositAmount: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-2">
              <FloatingSelect
                label="Interest Compounding Period *"
                required
                value={formData.interestCompoundingPeriod}
                onChange={(e) => setFormData({ ...formData, interestCompoundingPeriod: e.target.value })}
              >
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annually">Annually</option>
              </FloatingSelect>

              <FloatingSelect
                label="Interest Posting Period *"
                required
                value={formData.interestPostingPeriod}
                onChange={(e) => setFormData({ ...formData, interestPostingPeriod: e.target.value })}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="BiAnnual">BiAnnual</option>
                <option value="Annually">Annually</option>
              </FloatingSelect>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-2">
              <FloatingSelect
                label="Interest Calculated using *"
                required
                value={formData.interestCalculationUsing}
                onChange={(e) => setFormData({ ...formData, interestCalculationUsing: e.target.value })}
              >
                <option value="Daily Balance">Daily Balance</option>
                <option value="Average Daily Balance">Average Daily Balance</option>
              </FloatingSelect>

              <FloatingSelect
                label="Days in Year *"
                required
                value={formData.daysInYear}
                onChange={(e) => setFormData({ ...formData, daysInYear: e.target.value })}
              >
                <option value="360 Days">360 Days</option>
                <option value="365 Days">365 Days</option>
              </FloatingSelect>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: SETTINGS matching Image 4 */}
        {currentStep === 4 && (
          <form 
            id="tour-fd-settings-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            {/* Lock-in Period ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Lock-in Period ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FloatingInput
                  label="Frequency"
                  value={formData.lockinPeriodFrequency}
                  onChange={(e) => setFormData({ ...formData, lockinPeriodFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Type"
                  value={formData.lockinPeriodType}
                  onChange={(e) => setFormData({ ...formData, lockinPeriodType: e.target.value })}
                >
                  <option value="">Select Type</option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Minimum Deposit Term ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Minimum Deposit Term ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FloatingInput
                  label="Frequency *"
                  required
                  value={formData.minDepositTermFrequency}
                  onChange={(e) => setFormData({ ...formData, minDepositTermFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Frequency Type *"
                  required
                  value={formData.minDepositTermType}
                  onChange={(e) => setFormData({ ...formData, minDepositTermType: e.target.value })}
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* And thereafter, in Multiples of ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                And thereafter, in Multiples of ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FloatingInput
                  label="Frequency"
                  value={formData.inMultiplesOfFrequency}
                  onChange={(e) => setFormData({ ...formData, inMultiplesOfFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Type"
                  value={formData.inMultiplesOfType}
                  onChange={(e) => setFormData({ ...formData, inMultiplesOfType: e.target.value })}
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* Maximum Deposit Term ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Maximum Deposit Term ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <FloatingInput
                  label="Frequency"
                  value={formData.maxDepositTermFrequency}
                  onChange={(e) => setFormData({ ...formData, maxDepositTermFrequency: e.target.value })}
                />
                <FloatingSelect
                  label="Type"
                  value={formData.maxDepositTermType}
                  onChange={(e) => setFormData({ ...formData, maxDepositTermType: e.target.value })}
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </FloatingSelect>
              </div>
            </div>

            {/* For Pre-mature closure ? */}
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                For Pre-mature closure ?
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.applyPenalInterest}
                    onChange={(e) => setFormData({ ...formData, applyPenalInterest: e.target.checked })}
                    className="rounded-[2px] border-gray-300 text-[#1072ba]"
                  />
                  <span>Apply Penal Interest (less)</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <FloatingInput
                    label="Penal Interest (%)"
                    disabled={!formData.applyPenalInterest}
                    value={formData.penalInterest}
                    onChange={(e) => setFormData({ ...formData, penalInterest: e.target.value })}
                  />
                  <FloatingSelect
                    label="Period"
                    disabled={!formData.applyPenalInterest}
                    value={formData.penalInterestPeriod}
                    onChange={(e) => setFormData({ ...formData, penalInterestPeriod: e.target.value })}
                  >
                    <option value="">Select Period</option>
                    <option value="Whole Term">Whole Term</option>
                    <option value="Till Premature Date">Till Premature Date</option>
                  </FloatingSelect>
                </div>
              </div>
            </div>

            {/* Withhold Tax */}
            <div className="pt-1">
              <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isWithholdTaxApplicable}
                  onChange={(e) => setFormData({ ...formData, isWithholdTaxApplicable: e.target.checked })}
                  className="rounded-[2px] border-gray-300 text-[#1072ba]"
                />
                <span>Is Withhold Tax Applicable</span>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 5: INTEREST RATE CHART matching Image 5 */}
        {currentStep === 5 && (
          <form 
            id="tour-fd-chart-form"
            onSubmit={handleNext} 
            className="space-y-6 pt-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-700">
                Interest Rate Chart ?
              </h3>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, hasChart: true }))}
                className="px-3.5 py-1.5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium rounded-[2px] shadow-xs cursor-pointer flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Chart Box Container */}
            {formData.hasChart && (
              <div className="border border-gray-200 rounded-[2px] p-5 bg-white relative space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, hasChart: false }))}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition-colors"
                    title="Delete Chart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FloatingInput
                    label="Name *"
                    required
                    value={formData.chartName}
                    onChange={(e) => setFormData({ ...formData, chartName: e.target.value })}
                  />

                  <div className="relative">
                    <FloatingInput
                      label="From Date *"
                      required
                      placeholder="M/D/YYYY"
                      value={formData.chartFromDate}
                      onChange={(e) => setFormData({ ...formData, chartFromDate: e.target.value })}
                    />
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-1 bottom-2 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <FloatingInput
                      label="End Date"
                      placeholder="M/D/YYYY"
                      value={formData.chartEndDate}
                      onChange={(e) => setFormData({ ...formData, chartEndDate: e.target.value })}
                    />
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-1 bottom-2 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-center pt-2">
                  <div className="md:col-span-2">
                    <FloatingInput
                      label="Description *"
                      required
                      value={formData.chartDescription}
                      onChange={(e) => setFormData({ ...formData, chartDescription: e.target.value })}
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPrimaryGroupingByAmount}
                        onChange={(e) => setFormData({ ...formData, isPrimaryGroupingByAmount: e.target.checked })}
                        className="rounded-[2px] border-gray-300 text-[#1072ba]"
                      />
                      <span>Is primary grouping by amount?</span>
                    </label>
                  </div>
                </div>

                {/* Add Slab section matching Image 5 */}
                <div className="pt-3 border-t border-gray-100 flex flex-col items-center justify-center space-y-2 py-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer flex items-center space-x-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slab</span>
                  </button>

                  <div className="text-xs text-gray-600 font-medium">
                    It is required to add at least one Slab
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="submit"
                id="tour-fd-next-btn"
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Tab 6: CHARGES (placeholder ready for next steps) */}
        {currentStep === 6 && (
          <div className="space-y-6 pt-2 text-center text-xs text-gray-500 py-10">
            <p>Charges tab will be configured in subsequent steps.</p>
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 text-xs font-semibold text-white bg-[#1072ba] hover:bg-[#0e619e] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Tab 7: ACCOUNTING (placeholder ready for next steps) */}
        {currentStep === 7 && (
          <div className="space-y-6 pt-2 text-center text-xs text-gray-500 py-10">
            <p>Accounting tab will be configured in subsequent steps.</p>
            <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-[3px] cursor-pointer select-none transition-colors"
              >
                &larr; Previous
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSaveProduct) {
                    onSaveProduct({
                      id: String(Date.now()),
                      name: formData.name || 'TKB Fixed Deposit',
                      shortName: formData.shortName || 'TKFD',
                      description: formData.description,
                      currency: formData.currency,
                      status: 'Active'
                    });
                  }
                  if (onNavigateFixedDepositProducts) onNavigateFixedDepositProducts();
                }}
                className="px-6 py-2 text-xs font-semibold text-white bg-[#28a745] hover:bg-[#218838] rounded-[3px] shadow-xs cursor-pointer select-none transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
