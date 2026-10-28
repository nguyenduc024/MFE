import React, { useState } from 'react';
import { 
  Building2, Plus, ArrowRightLeft, DollarSign, Calendar, 
  UserCheck, Shield, CheckCircle2, History, AlertCircle
} from 'lucide-react';

export default function TellersView({ tellers, onAllocateCash }) {
  const [activeTab, setActiveTab] = useState('tellers'); // 'tellers' or 'cashiers'
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocateAmount, setAllocateAmount] = useState(10000000);
  const [selectedTeller, setSelectedTeller] = useState(tellers[0] || null);

  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    if (selectedTeller && onAllocateCash) {
      onAllocateCash(selectedTeller.id, Number(allocateAmount));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('practice-teller-cash-allocated', { detail: { amount: Number(allocateAmount) } }));
    }
    setShowAllocateModal(false);
    alert(`Đã cấp thêm ${Number(allocateAmount).toLocaleString('vi-VN')} VND cho quầy ${selectedTeller?.name}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>Cash Management (Quản Lý Bàn Thu Ngân & Tiền Mặt Tại Quầy)</span>
          </h1>
          <p className="text-xs text-gray-500">
            Cấu hình bàn thu ngân (Teller), phân bổ nhân viên giao dịch (Cashier) và cấp/thu hồi tiền mặt đầu/cuối ngày
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="tour-teller-header-allocate-btn"
            onClick={() => setShowAllocateModal(true)}
            className="mifos-btn-success px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <DollarSign className="w-4 h-4" />
            <span>Allocate Cash (Cấp Tiền Mặt)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('tellers')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'tellers'
              ? 'border-sky-600 text-sky-800 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Danh Sách Tellers ({tellers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('cashiers')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'cashiers'
              ? 'border-sky-600 text-sky-800 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Phân Bổ Cashiers</span>
        </button>
      </div>

      {/* Tellers List Table */}
      {activeTab === 'tellers' ? (
        <div id="tour-teller-table" className="mifos-panel overflow-hidden">
          <table className="w-full text-left mifos-table">
            <thead>
              <tr>
                <th>Teller Name (Tên Bàn Thu Ngân)</th>
                <th>Office (Thuộc Chi Nhánh / PGD)</th>
                <th>Status (Trạng Thái)</th>
                <th>Valid From (Hiệu Lực Từ)</th>
                <th>Cashier Phụ Trách</th>
                <th>Hạn Mức Tiền Mặt Hiện Tại</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tellers.map((t) => (
                <tr key={t.id}>
                  <td className="font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span>{t.name}</span>
                    </div>
                  </td>
                  <td className="text-sky-800 font-medium">
                    {t.officeName}
                  </td>
                  <td>
                    <span className="text-xs text-emerald-700 font-bold">
                      {t.state}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-gray-600">{t.validFrom}</td>
                  <td className="text-gray-800 font-medium">{t.cashierName}</td>
                  <td className="font-mono font-bold text-emerald-700 text-xs">
                    {(t.currentCashBalance || 50000000).toLocaleString('vi-VN')} VND
                  </td>
                  <td className="text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTeller(t);
                        setShowAllocateModal(true);
                      }}
                      id="tour-teller-row-allocate-btn"
                      className="text-xs text-sky-700 hover:text-sky-900 font-bold hover:underline"
                    >
                      Cấp quỹ
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => alert(`Xem lịch sử giao dịch tiền mặt của ${t.name}`)}
                      className="text-xs text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      Lịch sử
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mifos-panel p-4 space-y-4">
          <div className="bg-sky-50 p-3 rounded border border-sky-100 text-xs text-sky-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-sky-700 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Quy trình phân bổ Cashier:</strong> Mỗi bàn thu ngân (Teller) phải được gán cho một nhân sự cụ thể (Staff) với khoảng thời gian hiệu lực (Start Date - End Date) và chế độ làm việc toàn thời gian (Full Day) trước khi có thể thực hiện giao dịch nộp/rút tiền mặt.
            </div>
          </div>

          <table className="w-full text-left mifos-table">
            <thead>
              <tr>
                <th>Cashier Name</th>
                <th>Bàn Teller</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Chế Độ</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {tellers.map((t) => (
                <tr key={t.id}>
                  <td className="font-bold text-gray-900">{t.cashierName}</td>
                  <td>{t.name} ({t.officeName})</td>
                  <td className="font-mono text-xs">{t.startDate}</td>
                  <td className="font-mono text-xs">{t.endDate}</td>
                  <td>
                    <span className="text-xs text-gray-700 font-medium">Full Day (Cả ngày)</span>
                  </td>
                  <td>
                    <span className="text-xs text-emerald-700 font-bold">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Allocate Cash Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Allocate Cash to Cashier (Cấp Tiền Đầu Ngày)</span>
              </h3>
            </div>

            <form onSubmit={handleAllocateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Bàn thu ngân</label>
                <input 
                  type="text" 
                  disabled 
                  value={`${selectedTeller?.name} (${selectedTeller?.officeName})`} 
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded font-medium text-gray-700"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Số tiền cấp (VND) *</label>
                <input 
                  type="number" 
                  min="1000000"
                  step="500000"
                  required
                  id="tour-teller-allocate-amount"
                  value={allocateAmount}
                  onChange={(e) => setAllocateAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-600 font-mono text-sm font-bold text-emerald-800"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Định mức thông thường đầu ngày: 10.000.000 VND - 50.000.000 VND
                </p>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="mifos-btn-default px-4 py-1.5 rounded font-medium border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="tour-teller-allocate-submit"
                  className="mifos-btn-success px-4 py-1.5 rounded font-bold shadow-xs"
                >
                  Xác nhận cấp tiền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
