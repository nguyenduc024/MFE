import React, { useState } from 'react';
import { 
  BookOpen, Plus, Search, Filter, CheckCircle2, 
  X, AlertCircle, ChevronRight, Layers, Tag
} from 'lucide-react';

export default function ChartOfAccountsView({ glAccounts, onAddAccount }) {
  const [filterType, setFilterType] = useState('All');
  const [filterText, setFilterText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    glCode: '',
    name: '',
    typeId: '1',
    usage: 'Detail',
    manualEntriesAllowed: true,
    description: ''
  });

  const categories = [
    { id: 'All', label: 'Tất Cả (70)', count: glAccounts.length },
    { id: 'Asset', label: '1 - Asset (Tài sản)', count: glAccounts.filter(g => g.typeName === 'Asset').length },
    { id: 'Liability', label: '2 - Liability (Nợ phải trả)', count: glAccounts.filter(g => g.typeName === 'Liability').length },
    { id: 'Equity', label: '3 - Equity (Vốn CSH)', count: glAccounts.filter(g => g.typeName === 'Equity').length },
    { id: 'Income', label: '4 - Income (Thu nhập)', count: glAccounts.filter(g => g.typeName === 'Income').length },
    { id: 'Expense', label: '5 - Expense (Chi phí)', count: glAccounts.filter(g => g.typeName === 'Expense').length },
  ];

  const filteredAccounts = glAccounts.filter(g => {
    const matchType = filterType === 'All' || g.typeName === filterType;
    const matchText = 
      g.glCode.includes(filterText) ||
      g.name.toLowerCase().includes(filterText.toLowerCase());
    return matchType && matchText;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.glCode.trim() || !formData.name.trim()) return;

    const typeNames = { '1': 'Asset', '2': 'Liability', '3': 'Equity', '4': 'Income', '5': 'Expense' };
    const newAccount = {
      id: String(Date.now()),
      glCode: formData.glCode,
      name: formData.name,
      typeId: formData.typeId,
      typeName: typeNames[formData.typeId] || 'Asset',
      usage: formData.usage,
      manualEntriesAllowed: formData.manualEntriesAllowed,
      description: formData.description
    };

    onAddAccount(newAccount);
    setShowAddModal(false);
    setFormData({
      glCode: '',
      name: '',
      typeId: '1',
      usage: 'Detail',
      manualEntriesAllowed: true,
      description: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1072ba]" />
            <span>Chart of Accounts (Hệ Thống Tài Khoản Kế Toán Sổ Cái - COA)</span>
          </h1>
          <p className="text-xs text-gray-500">
            Cấu trúc 70 tài khoản kế toán tổng hợp COA của ngân hàng Takashimaya Bank (TKB) phân loại theo chuẩn IFRS/VAS
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="mifos-btn-blue px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Account</span>
        </button>
      </div>

      {/* Account Type Category Filters */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterType(cat.id)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterType === cat.id
                ? 'bg-[#1072ba] text-white font-bold shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded shadow-xs">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Tìm theo mã GL (VD: 110101, 120101) hoặc tên..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1072ba] font-mono"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
        </div>

        <div className="text-xs text-gray-500">
          Hiển thị <strong>{filteredAccounts.length}</strong> / {glAccounts.length} tài khoản
        </div>
      </div>

      {/* Table */}
      <div className="mifos-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left mifos-table">
            <thead>
              <tr>
                <th className="w-28">GL Code</th>
                <th>Account Name (Tên Tài Khoản)</th>
                <th>Type (Phân Loại)</th>
                <th>Usage (Cấp Độ)</th>
                <th>Manual Entries (Hạch Toán Tay)</th>
                <th className="text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Không tìm thấy tài khoản nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const isHeader = acc.usage === 'Header';
                  const typeColors = {
                    Asset: 'text-[#1072ba]',
                    Liability: 'text-gray-800',
                    Equity: 'text-gray-800',
                    Income: 'text-[#28a745]',
                    Expense: 'text-gray-800'
                  };

                  return (
                    <tr key={acc.id} className={isHeader ? 'bg-gray-50/80 font-bold' : ''}>
                      <td className="font-mono text-xs text-sky-900 font-bold">
                        {acc.glCode}
                      </td>
                      <td className="text-gray-900 text-xs">
                        <div className="flex items-center space-x-2">
                          {isHeader ? (
                            <Layers className="w-3.5 h-3.5 text-sky-700" />
                          ) : (
                            <Tag className="w-3 h-3 text-gray-400 ml-2" />
                          )}
                          <span>{acc.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`text-xs font-semibold ${typeColors[acc.typeName] || 'text-gray-700'}`}>
                          {acc.typeName}
                        </span>
                      </td>
                      <td>
                        <span className={`text-xs font-mono font-medium ${
                          isHeader ? 'text-gray-900 font-bold' : 'text-sky-800'
                        }`}>
                          {acc.usage}
                        </span>
                      </td>
                      <td>
                        {acc.manualEntriesAllowed ? (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Được phép
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">
                            Không (Chỉ tự động)
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => alert(`Tài khoản GL: ${acc.glCode} - ${acc.name}\nPhân loại: ${acc.typeName}\nUsage: ${acc.usage}`)}
                          className="text-xs text-sky-700 hover:text-sky-900 font-medium hover:underline"
                        >
                          Xem
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

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-[#1f7bb6] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Create GL Account (Mở Tài Khoản Sổ Cái)</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Account Type (Loại tài khoản) *
                  </label>
                  <select
                    value={formData.typeId}
                    onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-sky-600 bg-white"
                  >
                    <option value="1">1 - Asset (Tài sản)</option>
                    <option value="2">2 - Liability (Nợ phải trả)</option>
                    <option value="3">3 - Equity (Vốn chủ sở hữu)</option>
                    <option value="4">4 - Income (Thu nhập)</option>
                    <option value="5">5 - Expense (Chi phí)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    GL Code (Mã số tài khoản) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 120103"
                    value={formData.glCode}
                    onChange={(e) => setFormData({ ...formData, glCode: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-sky-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Account Name (Tên tài khoản) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Mortgage Loan Principal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Account Usage (Cấp độ tài khoản) *
                  </label>
                  <select
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-sky-600 bg-white"
                  >
                    <option value="Detail">Detail (Tài khoản chi tiết - được hạch toán)</option>
                    <option value="Header">Header (Tài khoản mẹ - chỉ tổng hợp)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.manualEntriesAllowed}
                      onChange={(e) => setFormData({ ...formData, manualEntriesAllowed: e.target.checked })}
                      className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="font-bold text-gray-700">Cho phép hạch toán tay (Manual Entries)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mifos-btn-default px-4 py-1.5 rounded font-medium border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mifos-btn-primary px-4 py-1.5 rounded font-bold shadow-xs"
                >
                  Submit (Tạo tài khoản)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
