import React, { useState, useMemo } from 'react';
import { 
  Plus, List, ChevronRight, ChevronDown, ChevronLeft, 
  ChevronsLeft, ChevronsRight, Upload
} from 'lucide-react';

/**
 * Format opening date to standard Mifos representation: "01 August 2026"
 */
const formatOpenedDate = (dateStr) => {
  if (!dateStr) return '';
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const parts = String(dateStr).trim().split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    const day = parts[2].padStart(2, '0');
    if (months[month]) {
      return `${day} ${months[month]} ${year}`;
    }
  }
  return dateStr;
};

export default function OfficesView({ offices = [], onAddOffice, navigate }) {
  const [viewMode, setViewMode] = useState('table'); // 'table' (list view) or 'tree' (hierarchy view)
  const [filterText, setFilterText] = useState('');
  const [filterFocused, setFilterFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Expanded nodes for Tree view: by default only expand the root office (Head Office)
  const [expandedNodes, setExpandedNodes] = useState(() => {
    const init = {};
    offices.forEach(o => {
      const isRoot = !o.parentId || o.parentId === 'none' || o.parentId === 'root';
      if (isRoot) {
        init[o.id] = true;
      }
    });
    return init;
  });

  const toggleExpand = (id) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isAnyExpanded = Object.values(expandedNodes).some(Boolean);

  const handleToggleAll = () => {
    if (isAnyExpanded) {
      setExpandedNodes({});
    } else {
      const all = {};
      offices.forEach(o => { all[o.id] = true; });
      setExpandedNodes(all);
    }
  };

  // Filtered offices matching filterText
  const filteredOffices = useMemo(() => {
    const query = filterText.toLowerCase().trim();
    if (!query) return offices;
    return offices.filter(o =>
      (o.name || '').toLowerCase().includes(query) ||
      (o.externalId || '').toLowerCase().includes(query) ||
      (o.parentName || '').toLowerCase().includes(query) ||
      (o.openingDate || '').toLowerCase().includes(query)
    );
  }, [offices, filterText]);

  // Hierarchically sorted offices matching default Mifos table order: HO -> RO -> Branches -> TOs
  const sortedOffices = useMemo(() => {
    return [...filteredOffices].sort((a, b) => {
      // 1. Root (no parent) first
      const aIsRoot = !a.parentId || a.parentId === 'none' || a.parentId === 'root';
      const bIsRoot = !b.parentId || b.parentId === 'none' || b.parentId === 'root';
      if (aIsRoot && !bIsRoot) return -1;
      if (!aIsRoot && bIsRoot) return 1;

      // 2. Depth by hierarchy if available
      const hA = a.hierarchy || '.';
      const hB = b.hierarchy || '.';
      const depthA = (hA.match(/\./g) || []).length;
      const depthB = (hB.match(/\./g) || []).length;
      if (depthA !== depthB) {
        return depthA - depthB;
      }

      // 3. ID numeric order
      const idA = parseInt(a.id, 10) || 0;
      const idB = parseInt(b.id, 10) || 0;
      return idA - idB;
    });
  }, [filteredOffices]);

  // Pagination calculations
  const totalItems = sortedOffices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentOfficesPage = sortedOffices.slice(startIndex, endIndex);

  // Build recursive hierarchy tree for Tree View (Image 2)
  const officeTree = useMemo(() => {
    const buildTree = (parentId = null) => {
      return offices
        .filter(o => {
          if (parentId === null) {
            return !o.parentId || o.parentId === 'none' || o.parentId === 'root';
          }
          return String(o.parentId) === String(parentId);
        })
        .map(node => ({
          ...node,
          children: buildTree(node.id)
        }));
    };
    return buildTree(null);
  }, [offices]);

  // Render a node in Tree View matching Image 2
  const renderTreeNode = (node, level = 0) => {
    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="space-y-1">
        <div 
          className="flex items-center py-1 hover:bg-gray-50/80 rounded transition-colors select-none"
          style={{ paddingLeft: `${level * 22}px` }}
        >
          {hasChildren ? (
            <button 
              type="button"
              onClick={() => toggleExpand(node.id)}
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
            onClick={() => hasChildren && toggleExpand(node.id)}
            className="text-xs text-[#212529] font-normal hover:text-[#1072ba] cursor-pointer"
          >
            {node.name}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 font-sans select-none animate-in fade-in duration-150">
      {/* Top Header: "Manage Offices | Home / Organization / Manage Offices" and Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        {/* Left: Title & Breadcrumbs */}
        <div className="flex items-baseline space-x-2.5">
          <h1 className="text-xl font-normal text-[#212529]">
            Manage Offices
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
              onClick={() => navigate && navigate('admin-organization')} 
              className="text-[#1072ba] hover:underline cursor-pointer"
            >
              Organization
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Manage Offices</span>
          </div>
        </div>

        {/* Right: View Toggle (List / Hierarchy) + Create Office + Import Offices */}
        <div className="flex items-center space-x-3">
          {/* Toggle Group: List View & Tree View */}
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
              title="Hierarchy Tree View"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <rect x="3" y="17" width="6" height="4" rx="1" />
                <rect x="15" y="17" width="6" height="4" rx="1" />
                <path d="M12 7v5" />
                <path d="M6 12h12" />
                <path d="M6 12v5" />
                <path d="M18 12v5" />
              </svg>
            </button>
          </div>

          {/* + Create Office Button */}
          <button
            id="tour-create-office-btn"
            onClick={() => navigate && navigate('admin-create-office')}
            className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[2px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Office</span>
          </button>

          {/* Import Offices Button */}
          <button
            type="button"
            className="bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-medium px-3.5 py-1.5 rounded-[2px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Import Offices</span>
          </button>
        </div>
      </div>

      {/* Main Content: List View (Image 1) OR Tree View (Image 2) */}
      {viewMode === 'table' ? (
        <>
          {/* Underline Filter Field (Matching Image 1) */}
          <div className="relative pt-3 pb-1 border-b border-gray-300 max-w-full mb-6">
            <label
              className={`absolute left-0 transition-all duration-200 pointer-events-none select-none ${
                filterFocused || filterText
                  ? '-top-1 text-[10px] text-[#1072ba] font-medium'
                  : 'top-2.5 text-xs text-gray-500'
              }`}
            >
              Filter
            </label>
            <input
              type="text"
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              onFocus={() => setFilterFocused(true)}
              onBlur={() => setFilterFocused(false)}
              className="w-full bg-transparent text-xs text-gray-800 outline-none pt-0.5"
            />
          </div>

          {/* Table Card (Matching Image 1) */}
          <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-normal text-xs">
                    <th className="py-3 px-4 font-normal">Office Name</th>
                    <th className="py-3 px-4 font-normal">External ID</th>
                    <th className="py-3 px-4 font-normal">Parent Office</th>
                    <th className="py-3 px-4 font-normal">Opened On</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOfficesPage.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-400 text-xs">
                        No offices found.
                      </td>
                    </tr>
                  ) : (
                    currentOfficesPage.map((office, idx) => {
                      const isZebra = idx % 2 === 1;
                      return (
                        <tr 
                          key={office.id} 
                          className={`transition-colors text-xs text-[#212529] hover:bg-gray-100/70 ${
                            isZebra ? 'bg-[#f9f9f9]' : 'bg-white'
                          }`}
                        >
                          <td className="py-3 px-4 font-normal">
                            {office.name}
                          </td>
                          <td className="py-3 px-4 font-normal text-gray-700">
                            {office.externalId || ''}
                          </td>
                          <td className="py-3 px-4 font-normal text-gray-700">
                            {office.parentName || ''}
                          </td>
                          <td className="py-3 px-4 font-normal text-gray-700">
                            {formatOpenedDate(office.openingDate)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (Matching Image 1 bottom right) */}
            <div className="flex items-center justify-end px-4 py-3 border-t border-gray-200 text-xs text-gray-600 space-x-6 select-none">
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
        /* Tree View (Matching Image 2) */
        <div className="space-y-4">
          {/* Collapse All / Expand All Button */}
          <div>
            <button
              type="button"
              onClick={handleToggleAll}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3.5 py-1 rounded-[2px] shadow-xs cursor-pointer transition-colors"
            >
              {isAnyExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          {/* White Card containing the nested tree list */}
          <div className="bg-white rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] p-8 min-h-[420px]">
            {officeTree.length === 0 ? (
              <div className="text-gray-400 text-xs py-8 text-center">
                No offices found in hierarchy.
              </div>
            ) : (
              <div className="space-y-1">
                {officeTree.map(rootNode => renderTreeNode(rootNode, 0))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page Footer (Matching Image 1 & Image 2 bottom center) */}
      <div className="mt-16 text-center text-[11px] text-gray-500 font-mono space-y-0.5 select-none">
        <div>Mifos 250331 -</div>
        <div>1.16.0 - SNAPSHOT</div>
      </div>
    </div>
  );
}
