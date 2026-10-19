import React, { useState, useMemo } from 'react';
import { 
  Plus, List, ChevronRight, ChevronDown, ChevronLeft, 
  ChevronsLeft, ChevronsRight, Check
} from 'lucide-react';

/**
 * Authentic Sitemap / Tree hierarchy icon for view switch toggle
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

export default function ChartOfAccountsView({ 
  glAccounts = [], 
  onAddAccount, 
  navigate,
  initialMode = 'table' // 'table' (Hình 1), 'tree' (Hình 2), 'create' (Hình 3)
}) {
  const [viewMode, setViewMode] = useState(initialMode); // 'table', 'tree', or 'create'
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form State for Create GL Account (Hình 3)
  const [formData, setFormData] = useState({
    type: 'ASSET',
    name: '',
    usage: 'DETAIL',
    glCode: '',
    parentId: '',
    tagId: '',
    manualEntriesAllowed: true,
    description: ''
  });

  // Expanded nodes for Tree View (Hình 2)
  // By default: ACCOUNTS expanded, ASSET expanded, 100000 expanded, 130000 expanded, EQUITY expanded.
  // Collapsed: 110000, 120000, 300000, EXPENSE, INCOME, LIABILITY matching Image 2 exactly.
  const [expandedNodes, setExpandedNodes] = useState({
    'root-accounts': true,
    'cat-ASSET': true,
    'code-100000': true,
    'code-130000': true,
    'cat-EQUITY': true
  });

  const toggleExpand = (nodeKey) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  const isAnyExpanded = Object.values(expandedNodes).some(Boolean);

  const handleToggleAll = () => {
    if (isAnyExpanded) {
      setExpandedNodes({});
    } else {
      const all = { 'root-accounts': true };
      ['ASSET', 'EQUITY', 'EXPENSE', 'INCOME', 'LIABILITY'].forEach(c => {
        all[`cat-${c}`] = true;
      });
      glAccounts.forEach(a => {
        if (a.usage.toLowerCase() === 'header') {
          all[`code-${a.glCode}`] = true;
        }
      });
      setExpandedNodes(all);
    }
  };

  // Sorted accounts matching default Mifos table order (Hình 1)
  // 1. Root Level 1 Headers (parent === null) sorted by glCode: 100000, 200000, 300000, 400000, 500000
  // 2. Sub-headers (usage === Header) sorted by glCode: 110000, 120000, 130000, 210000, 220000...
  // 3. Detail accounts sorted by glCode
  const sortedAccounts = useMemo(() => {
    const list = [...glAccounts];
    return list.sort((a, b) => {
      const aIsHeader = a.usage.toLowerCase() === 'header';
      const bIsHeader = b.usage.toLowerCase() === 'header';
      const aIsRoot = !a.parentId || a.parentId === 'none' || a.parentId === 'root';
      const bIsRoot = !b.parentId || b.parentId === 'none' || b.parentId === 'root';

      // Level 1 Root Headers first
      if (aIsHeader && aIsRoot && (!bIsHeader || !bIsRoot)) return -1;
      if (bIsHeader && bIsRoot && (!aIsHeader || !aIsRoot)) return 1;

      // Sub-headers second
      if (aIsHeader && !bIsHeader) return -1;
      if (!aIsHeader && bIsHeader) return 1;

      // Numeric GL Code sorting
      const codeA = parseInt(a.glCode, 10) || 0;
      const codeB = parseInt(b.glCode, 10) || 0;
      return codeA - codeB;
    });
  }, [glAccounts]);

  // Filtered accounts matching filterText
  const filteredAccounts = useMemo(() => {
    const q = filterText.toLowerCase().trim();
    if (!q) return sortedAccounts;
    return sortedAccounts.filter(a =>
      (a.name || '').toLowerCase().includes(q) ||
      (a.glCode || '').toLowerCase().includes(q) ||
      (a.typeName || '').toLowerCase().includes(q) ||
      (a.usage || '').toLowerCase().includes(q)
    );
  }, [sortedAccounts, filterText]);

  // Pagination for List view
  const totalItems = filteredAccounts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentAccountsPage = filteredAccounts.slice(startIndex, endIndex);

  // Group accounts by Category for Tree View (Hình 2)
  // Categories sorted alphabetically: ASSET, EQUITY, EXPENSE, INCOME, LIABILITY
  const treeCategories = useMemo(() => {
    const categories = ['ASSET', 'EQUITY', 'EXPENSE', 'INCOME', 'LIABILITY'];
    const byCategory = {};
    categories.forEach(c => { byCategory[c] = []; });

    glAccounts.forEach(acc => {
      const catKey = (acc.typeName || '').toUpperCase();
      if (byCategory[catKey]) {
        byCategory[catKey].push(acc);
      }
    });

    // Build hierarchy for each category
    const result = categories.map(catName => {
      const catAccounts = byCategory[catName] || [];
      const rootHeaders = catAccounts.filter(
        a => a.usage.toLowerCase() === 'header' && (!a.parentId || a.parentId === 'none' || a.parentId === 'root')
      );

      const buildSubTree = (parentId) => {
        return catAccounts
          .filter(a => String(a.parentId) === String(parentId))
          .map(child => ({
            ...child,
            children: buildSubTree(child.id)
          }))
          .sort((x, y) => (parseInt(x.glCode, 10) || 0) - (parseInt(y.glCode, 10) || 0));
      };

      const tree = rootHeaders
        .map(rootHeader => ({
          ...rootHeader,
          children: buildSubTree(rootHeader.id)
        }))
        .sort((x, y) => (parseInt(x.glCode, 10) || 0) - (parseInt(y.glCode, 10) || 0));

      return {
        name: catName,
        roots: tree
      };
    });

    return result;
  }, [glAccounts]);

  // Parent header options for Create GL Account form (filtered by selected Account Type)
  const availableParentHeaders = useMemo(() => {
    return glAccounts.filter(a => {
      const matchType = (a.typeName || '').toUpperCase() === (formData.type || '').toUpperCase();
      const isHeader = (a.usage || '').toUpperCase() === 'HEADER';
      return matchType && isHeader;
    }).sort((a, b) => (parseInt(a.glCode, 10) || 0) - (parseInt(b.glCode, 10) || 0));
  }, [glAccounts, formData.type]);

  // Form validity check for Create GL Account
  const isFormValid = useMemo(() => {
    return (
      formData.name.trim().length > 0 &&
      formData.glCode.trim().length > 0 &&
      formData.type &&
      formData.usage
    );
  }, [formData]);

  // Handle Create Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const typeNames = {
      'ASSET': 'Asset',
      'LIABILITY': 'Liability',
      'EQUITY': 'Equity',
      'INCOME': 'Income',
      'EXPENSE': 'Expense'
    };

    const typeIds = {
      'ASSET': '1',
      'LIABILITY': '2',
      'EQUITY': '3',
      'INCOME': '4',
      'EXPENSE': '5'
    };

    const newAccount = {
      id: String(Date.now()),
      glCode: formData.glCode.trim(),
      name: formData.usage === 'HEADER' ? formData.name.trim().toUpperCase() : formData.name.trim(),
      typeId: typeIds[formData.type] || '1',
      typeName: typeNames[formData.type] || 'Asset',
      usage: formData.usage === 'HEADER' ? 'Header' : 'Detail',
      manualEntriesAllowed: formData.manualEntriesAllowed,
      parentId: formData.parentId || null,
      description: formData.description.trim()
    };

    if (onAddAccount) {
      onAddAccount(newAccount);
    }

    // Reset form and return to table view
    setFormData({
      type: 'ASSET',
      name: '',
      usage: 'DETAIL',
      glCode: '',
      parentId: '',
      tagId: '',
      manualEntriesAllowed: true,
      description: ''
    });
    setViewMode('table');
  };

  // Recursive renderer for Tree View nodes
  const renderAccountTreeNode = (node, level = 0) => {
    const isHeader = node.usage.toLowerCase() === 'header';
    const hasChildren = node.children && node.children.length > 0;
    const nodeKey = `code-${node.glCode}`;
    const isExpanded = !!expandedNodes[nodeKey];

    return (
      <div key={node.id || node.glCode} className="space-y-1">
        <div 
          className="flex items-center py-1 hover:bg-gray-50/80 rounded transition-colors select-none"
          style={{ paddingLeft: `${level * 22}px` }}
        >
          {isHeader ? (
            <button 
              type="button"
              onClick={() => toggleExpand(nodeKey)}
              className="w-4 h-4 mr-2 flex items-center justify-center text-gray-700 hover:text-black cursor-pointer"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </button>
          ) : (
            <span className="w-4 mr-2 inline-block" />
          )}

          <span 
            onClick={() => isHeader && toggleExpand(nodeKey)}
            className={`text-xs ${
              isHeader 
                ? 'text-[#212529] font-normal cursor-pointer hover:text-[#1072ba]' 
                : 'text-gray-700 font-normal'
            }`}
          >
            ({node.glCode})&nbsp;&nbsp;{node.name}
          </span>
        </div>

        {isHeader && hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderAccountTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 font-sans select-none animate-in fade-in duration-150">
      {viewMode === 'create' ? (
        /* ========================================================
           HÌNH 3: CREATE GL ACCOUNT FORM
           ======================================================== */
        <div>
          {/* Header & Breadcrumbs: "Create GL Account | Home / Accounting / Chart of Accounts / Create GL Account" */}
          <div className="flex items-baseline space-x-2.5 mb-6">
            <h1 className="text-xl font-normal text-[#212529]">
              Create GL Account
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
                onClick={() => setViewMode('table')} 
                className="text-[#1072ba] hover:underline cursor-pointer"
              >
                Chart of Accounts
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">Create GL Account</span>
            </div>
          </div>

          {/* Form Card (Matching Image 3) */}
          <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8 max-w-4xl mx-auto">
            <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
              {/* Row 1: Account Type * & Account Name * */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <label className="block text-[11px] font-normal text-gray-500 mb-0.5">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, parentId: '' })}
                    className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] py-1.5 bg-transparent outline-none transition-colors cursor-pointer"
                  >
                    <option value="ASSET">ASSET</option>
                    <option value="LIABILITY">LIABILITY</option>
                    <option value="EQUITY">EQUITY</option>
                    <option value="INCOME">INCOME</option>
                    <option value="EXPENSE">EXPENSE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-normal text-gray-500 mb-0.5">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] py-1.5 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Account Usage * & GL Code * */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <label className="block text-[11px] font-normal text-gray-500 mb-0.5">
                    Account Usage <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                    className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] py-1.5 bg-transparent outline-none transition-colors cursor-pointer"
                  >
                    <option value="DETAIL">DETAIL</option>
                    <option value="HEADER">HEADER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-normal text-gray-500 mb-0.5">
                    GL Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.glCode}
                    onChange={(e) => setFormData({ ...formData, glCode: e.target.value })}
                    className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] py-1.5 outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Parent & Tag & Manual Entries Allowed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 items-end">
                <div>
                  <label className="block text-[11px] font-normal text-gray-500 mb-0.5">
                    Parent
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] py-1.5 bg-transparent outline-none transition-colors cursor-pointer"
                  >
                    <option value="">(None)</option>
                    {availableParentHeaders.map(p => (
                      <option key={p.id || p.glCode} value={p.id}>
                        ({p.glCode}) {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end space-x-6">
                  <div className="flex-1">
                    <label className="block text-[11px] font-normal text-gray-500 mb-0.5">
                      Tag
                    </label>
                    <select
                      value={formData.tagId}
                      onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                      className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] py-1.5 bg-transparent outline-none transition-colors cursor-pointer"
                    >
                      <option value="">(None)</option>
                      <option value="default">Default Tag</option>
                    </select>
                  </div>

                  {/* Manual Entries Allowed Checkbox (Matching Image 3) */}
                  <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer pb-2 select-none">
                    <div 
                      onClick={() => setFormData({ ...formData, manualEntriesAllowed: !formData.manualEntriesAllowed })}
                      className={`w-4 h-4 rounded-[2px] flex items-center justify-center border transition-colors ${
                        formData.manualEntriesAllowed 
                          ? 'bg-[#28a745] border-[#28a745] text-white' 
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {formData.manualEntriesAllowed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>Manual Entries Allowed</span>
                  </label>
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block text-[11px] font-normal text-gray-500 mb-0.5">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] py-1.5 outline-none transition-colors"
                />
              </div>

              {/* Buttons: Cancel & Submit (Matching Image 3 bottom) */}
              <div className="pt-8 flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-4 py-1.5 rounded-[2px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`text-xs px-5 py-1.5 rounded-[2px] shadow-xs font-medium transition-colors ${
                    isFormValid 
                      ? 'bg-[#1072ba] hover:bg-[#0d5d99] text-white cursor-pointer' 
                      : 'bg-[#e0e0e0] text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* ========================================================
           HÌNH 1 & HÌNH 2: LIST VIEW & TREE VIEW
           ======================================================== */
        <div>
          {/* Header & Breadcrumbs: "Chart of Accounts | Home / Accounting / Chart of Accounts" & Action Group */}
          <div className="flex items-center justify-between mb-6">
            {/* Title & Breadcrumbs */}
            <div className="flex items-baseline space-x-2.5">
              <h1 className="text-xl font-normal text-[#212529]">
                Chart of Accounts
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
                <span className="text-gray-500">Chart of Accounts</span>
              </div>
            </div>

            {/* Right Actions: View Mode Toggle Group + + Add Account Button */}
            <div className="flex items-center space-x-3">
              {/* Joined Icon Toggle: List View (Hình 1) & Tree View (Hình 2) */}
              <div className="inline-flex border border-gray-300 rounded-[2px] overflow-hidden bg-[#f5f5f5] shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 px-2.5 transition-colors cursor-pointer flex items-center justify-center ${
                    viewMode === 'table'
                      ? 'bg-[#e0e0e0] text-gray-800 shadow-inner'
                      : 'bg-[#f5f5f5] text-gray-500 hover:bg-gray-200'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('tree')}
                  className={`p-1.5 px-2.5 border-l border-gray-300 transition-colors cursor-pointer flex items-center justify-center ${
                    viewMode === 'tree'
                      ? 'bg-[#e0e0e0] text-gray-800 shadow-inner'
                      : 'bg-[#f5f5f5] text-gray-500 hover:bg-gray-200'
                  }`}
                  title="Hierarchy View"
                >
                  <SitemapIcon className="w-4 h-4" />
                </button>
              </div>

              {/* + Add Account Button (Matching Image 1 & 2 top right) */}
              <button
                type="button"
                onClick={() => setViewMode('create')}
                className="bg-[#1072ba] hover:bg-[#0d5d99] text-white text-xs px-3.5 py-1.5 rounded-[2px] shadow-xs cursor-pointer flex items-center space-x-1.5 transition-colors font-medium"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Account</span>
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            /* ========================================================
               HÌNH 1: TABLE / LIST VIEW
               ======================================================== */
            <>
              {/* Underline Filter Bar (Material style matching Image 1) */}
              <div className="mb-6 relative max-w-sm">
                <label className="block text-[11px] font-normal text-gray-500 mb-0.5">
                  Filter
                </label>
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs text-gray-800 border-b border-gray-300 focus:border-[#1072ba] py-1 outline-none transition-colors"
                />
              </div>

              {/* Table Card (Matching Image 1) */}
              <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-600 font-normal select-none">
                        <th className="py-3 px-6 font-normal">Account</th>
                        <th className="py-3 px-6 font-normal">GL Code</th>
                        <th className="py-3 px-6 font-normal">Type</th>
                        <th className="py-3 px-6 font-normal text-center">Disabled</th>
                        <th className="py-3 px-6 font-normal text-center">Manual Entries Allowed</th>
                        <th className="py-3 px-6 font-normal">Used as</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAccountsPage.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-6 text-center text-gray-400">
                            No accounts found.
                          </td>
                        </tr>
                      ) : (
                        currentAccountsPage.map((acc, idx) => {
                          const isOdd = idx % 2 === 1;
                          const isManualAllowed = acc.manualEntriesAllowed;

                          return (
                            <tr 
                              key={acc.id || acc.glCode} 
                              className={`transition-colors border-b border-gray-100/60 ${isOdd ? 'bg-[#f9f9f9]' : 'bg-white'}`}
                            >
                              <td className="py-3 px-6 font-normal text-gray-800">
                                {acc.name}
                              </td>
                              <td className="py-3 px-6 font-normal text-gray-700 font-mono">
                                {acc.glCode}
                              </td>
                              <td className="py-3 px-6 font-normal text-gray-700 uppercase">
                                {acc.typeName}
                              </td>
                              <td className="py-3 px-6 text-center">
                                {/* Disabled Status: Green circle matching Image 1 */}
                                <span 
                                  className="inline-block w-2.5 h-2.5 rounded-full bg-[#28a745]" 
                                  title="Account is enabled"
                                />
                              </td>
                              <td className="py-3 px-6 text-center">
                                {/* Manual Entries Allowed Status: Red circle with X if false, green with check if true */}
                                {isManualAllowed ? (
                                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#28a745] text-white text-[9px] font-bold">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#e53935] text-white text-[9px] font-bold">
                                    ✕
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-6 font-normal text-gray-700 uppercase">
                                {acc.usage}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer (Matching Image 1 bottom right: 1 – 10 of 70) */}
                <div className="flex items-center justify-end px-6 py-3 border-t border-gray-200 text-xs text-gray-600 space-x-6 select-none">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-gray-500">Items per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-transparent text-xs text-gray-700 outline-none cursor-pointer"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  <div className="text-[11px] text-gray-600 font-mono">
                    {totalItems === 0 
                      ? '0 of 0' 
                      : `${startIndex + 1} – ${endIndex} of ${totalItems}`}
                  </div>

                  <div className="flex items-center space-x-1 text-gray-500">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="First page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-1 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage >= totalPages}
                      className="p-1 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage >= totalPages}
                      className="p-1 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Last page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ========================================================
               HÌNH 2: TREE / HIERARCHY VIEW
               ======================================================== */
            <div className="space-y-4">
              {/* Collapse All / Expand All Button (Matching Image 2 top left) */}
              <div>
                <button
                  type="button"
                  onClick={handleToggleAll}
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3.5 py-1 rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  {isAnyExpanded ? 'Collapse All' : 'Expand All'}
                </button>
              </div>

              {/* White Card containing the nested recursive tree list */}
              <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8 min-h-[460px]">
                {/* Root: ACCOUNTS */}
                <div className="space-y-1">
                  <div className="flex items-center py-1 select-none">
                    <button
                      type="button"
                      onClick={() => toggleExpand('root-accounts')}
                      className="w-4 h-4 mr-2 flex items-center justify-center text-gray-700 hover:text-black cursor-pointer"
                    >
                      {expandedNodes['root-accounts'] ? (
                        <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                    </button>
                    <span 
                      onClick={() => toggleExpand('root-accounts')}
                      className="text-xs text-[#212529] font-normal uppercase cursor-pointer hover:text-[#1072ba]"
                    >
                      ACCOUNTS
                    </span>
                  </div>

                  {/* Level 1: Categories (ASSET, EQUITY, EXPENSE, INCOME, LIABILITY) */}
                  {expandedNodes['root-accounts'] && (
                    <div className="space-y-1">
                      {treeCategories.map(cat => {
                        const catKey = `cat-${cat.name}`;
                        const isCatExpanded = !!expandedNodes[catKey];
                        const hasRoots = cat.roots.length > 0;

                        return (
                          <div key={cat.name} className="space-y-1">
                            <div 
                              className="flex items-center py-1 select-none hover:bg-gray-50/70 rounded transition-colors"
                              style={{ paddingLeft: '22px' }}
                            >
                              {hasRoots ? (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(catKey)}
                                  className="w-4 h-4 mr-2 flex items-center justify-center text-gray-700 hover:text-black cursor-pointer"
                                >
                                  {isCatExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                  )}
                                </button>
                              ) : (
                                <span className="w-4 mr-2 inline-block" />
                              )}

                              <span 
                                onClick={() => hasRoots && toggleExpand(catKey)}
                                className="text-xs text-[#212529] font-normal uppercase cursor-pointer hover:text-[#1072ba]"
                              >
                                {cat.name}
                              </span>
                            </div>

                            {/* Level 2+: Accounts inside this category */}
                            {isCatExpanded && hasRoots && (
                              <div>
                                {cat.roots.map(rootNode => renderAccountTreeNode(rootNode, 2))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Page Footer (Matching Image 1, 2, 3 bottom center) */}
      <div className="mt-16 text-center text-[11px] text-gray-500 font-mono space-y-0.5 select-none">
        <div>Mifos 250331 -</div>
        <div>1.16.0 - SNAPSHOT</div>
      </div>
    </div>
  );
}
