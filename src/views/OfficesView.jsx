import React, { useState } from 'react';
import { 
  Building2, Plus, Search, GitBranch, List, Calendar, 
  MapPin, Check, X, ShieldAlert, ChevronRight, ChevronDown
} from 'lucide-react';

export default function OfficesView({ offices, onAddOffice }) {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'tree'
  const [filterText, setFilterText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState({ '1': true, '2': true, '3': true, '4': true });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    parentId: '1',
    openingDate: new Date().toISOString().split('T')[0],
    externalId: ''
  });

  const filteredOffices = offices.filter(o => 
    o.name.toLowerCase().includes(filterText.toLowerCase()) ||
    (o.externalId || '').toLowerCase().includes(filterText.toLowerCase()) ||
    (o.parentName || '').toLowerCase().includes(filterText.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parent = offices.find(o => o.id === formData.parentId);
    const newOffice = {
      id: String(Date.now()),
      name: formData.name,
      externalId: formData.externalId,
      parentId: formData.parentId,
      parentName: parent ? parent.name : null,
      openingDate: formData.openingDate
    };

    onAddOffice(newOffice);
    setShowAddModal(false);
    setFormData({
      name: '',
      parentId: '1',
      openingDate: new Date().toISOString().split('T')[0],
      externalId: ''
    });
  };

  // Build tree hierarchy
  const buildTree = (parentId = null) => {
    return offices
      .filter(o => (parentId === null ? !o.parentId : o.parentId === parentId))
      .map(node => ({
        ...node,
        children: buildTree(node.id)
      }));
  };

  const officeTree = buildTree(null);

  const renderTreeNode = (node, level = 0) => {
    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="space-y-1">
        <div 
          className={`flex items-center justify-between p-2 rounded hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-colors ${
            level === 0 ? 'bg-sky-50/80 font-bold border-sky-200' : ''
          }`}
          style={{ paddingLeft: `${Math.max(8, level * 24)}px` }}
        >
          <div className="flex items-center space-x-2">
            {hasChildren ? (
              <button 
                onClick={() => toggleExpand(node.id)}
                className="p-1 hover:bg-gray-200 rounded text-gray-500"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-5" />
            )}
            <Building2 className={`w-4 h-4 ${level === 0 ? 'text-sky-700' : 'text-gray-400'}`} />
            <span className="text-xs text-gray-800 font-medium">{node.name}</span>
            {node.externalId && (
              <span className="text-xs font-mono text-gray-500 font-semibold">
                ({node.externalId})
              </span>
            )}
          </div>

          <div className="text-[11px] text-gray-400 flex items-center gap-3">
            <span>Ngày mở: {node.openingDate}</span>
            <span className="text-gray-300">|</span>
            <span className="font-mono text-[10px]">ID: {node.id}</span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-sky-100 ml-4 space-y-1">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#1072ba]" />
            <span>Manage Offices (Quản Lý Văn Phòng & Chi Nhánh)</span>
          </h1>
          <p className="text-xs text-gray-500">
            Hệ thống cơ cấu tổ chức 4 cấp: Hội sở chính → Vùng miền → Chi nhánh tỉnh/thành → Phòng giao dịch (PGD)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Switch View Mode */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-[#1072ba] font-bold' : 'text-gray-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Bảng ({offices.length})</span>
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
                viewMode === 'tree' ? 'bg-white shadow-xs text-[#1072ba] font-bold' : 'text-gray-600'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Cây Phân Cấp</span>
            </button>
          </div>

          {/* Add Office Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="mifos-btn-blue px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Office</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded shadow-xs">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Lọc theo tên văn phòng, mã external id..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1072ba]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
        </div>

        <div className="text-xs text-gray-500">
          Hiển thị <strong>{filteredOffices.length}</strong> / {offices.length} văn phòng
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        <div className="mifos-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left mifos-table">
              <thead>
                <tr>
                  <th className="w-12">ID</th>
                  <th>Office Name (Tên Đơn Vị)</th>
                  <th>External ID (Mã Định Danh)</th>
                  <th>Parent Office (Đơn Vị Quản Lý Cấp Trên)</th>
                  <th>Opening Date (Ngày Mở)</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      Không tìm thấy văn phòng nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredOffices.map((office) => {
                    const isHO = !office.parentId;
                    return (
                      <tr key={office.id} className={isHO ? 'bg-sky-50/50 font-semibold' : ''}>
                        <td className="font-mono text-gray-500 text-xs">{office.id}</td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <Building2 className={`w-3.5 h-3.5 ${isHO ? 'text-sky-700' : 'text-gray-400'}`} />
                            <span className="font-medium text-gray-900">{office.name}</span>
                            {isHO && (
                              <span className="text-xs text-sky-800 font-bold">
                                (HỘI SỞ)
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="font-mono text-xs text-gray-700 font-semibold">
                            {office.externalId || '—'}
                          </span>
                        </td>
                        <td className="text-gray-600">
                          {office.parentName ? (
                            <span className="text-sky-800">{office.parentName}</span>
                          ) : (
                            <span className="text-gray-400 italic">Cấp cao nhất (None)</span>
                          )}
                        </td>
                        <td className="text-gray-600 font-mono text-xs">
                          {office.openingDate}
                        </td>
                        <td className="text-right">
                          <button 
                            onClick={() => alert(`Xem chi tiết văn phòng: ${office.name} (ID: ${office.id})`)}
                            className="text-xs text-sky-700 hover:text-sky-900 font-medium hover:underline"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mifos-panel p-4 space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Cây phân cấp cơ cấu tổ chức Takashimaya Bank (TKB)
          </div>
          {officeTree.map(rootNode => renderTreeNode(rootNode, 0))}
        </div>
      )}

      {/* Add Office Modal (Mifos X form simulation) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-[#1072ba] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Create Office (Tạo Văn Phòng Mới)</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white hover:opacity-80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Office Name (Tên văn phòng) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Can Tho Transaction Office 01"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1072ba]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Parent Office (Đơn vị cấp trên) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1072ba]"
                >
                  {offices.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} {o.externalId ? `(${o.externalId})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Chọn Hội sở chính, Vùng hoặc Chi nhánh quản lý trực tiếp
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Opened On (Ngày khai trương / Bắt đầu) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.openingDate}
                  onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1072ba]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  External ID (Mã định danh hệ thống)
                </label>
                <input
                  type="text"
                  placeholder="VD: TKB-TO-CTO-03"
                  value={formData.externalId}
                  onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                  className="w-full px-3 py-1.5 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1072ba] font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mifos-btn-gray px-4 py-1.5 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mifos-btn-blue px-4 py-1.5 rounded text-xs font-semibold"
                >
                  Submit (Tạo văn phòng)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
