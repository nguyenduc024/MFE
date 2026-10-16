import React, { useState } from 'react';
import { 
  ArrowLeft, CreditCard, DollarSign, Calendar, 
  CheckCircle2, Clock, AlertCircle, FileText, ArrowRightLeft
} from 'lucide-react';

export default function LoanDetailView({ loan, onBack, onMakeRepayment }) {
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [repayAmount, setRepayAmount] = useState(933333);

  if (!loan) return null;

  const handleRepaymentSubmit = (e) => {
    e.preventDefault();
    if (onMakeRepayment) {
      onMakeRepayment(loan.id, Number(repayAmount));
    }
    setShowRepayModal(false);
    alert(`Đã ghi nhận thu nợ thành công số tiền ${Number(repayAmount).toLocaleString('vi-VN')} VND cho khoản vay #${loan.accountNo}! Bút toán kế toán đã tự động ghi nhận.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-sky-800 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại hồ sơ khách hàng ({loan.clientName})</span>
        </button>

        <span className="text-xs font-mono text-gray-500">
          Account #: <strong className="text-gray-900">{loan.accountNo}</strong>
        </span>
      </div>

      {/* Loan Summary Header Card */}
      <div className="mifos-panel p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-sky-700 text-white font-bold flex items-center justify-center shadow-md">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  {loan.productName} #{loan.accountNo}
                </h1>
                <span className="text-xs text-emerald-700 font-bold">
                  ● {loan.status}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                Khách hàng: <strong className="text-sky-900">{loan.clientName}</strong> • Giải ngân ngày: <strong>{loan.disbursementDate}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRepayModal(true)}
              className="mifos-btn-success px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <DollarSign className="w-4 h-4" />
              <span>Make Repayment (Thu Nợ)</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-sky-100 text-xs">
          <div>
            <div className="text-gray-400 text-[11px]">Số tiền vay ban đầu</div>
            <div className="font-mono font-bold text-sky-900 text-sm mt-0.5">
              {loan.principal.toLocaleString('vi-VN')} VND
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-[11px]">Tổng nợ đã thu</div>
            <div className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
              {loan.totalRepaid.toLocaleString('vi-VN')} VND
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-[11px]">Dư nợ gốc còn lại</div>
            <div className="font-mono font-bold text-rose-700 text-sm mt-0.5">
              {loan.outstandingBalance.toLocaleString('vi-VN')} VND
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-[11px]">Lãi suất & Thời hạn</div>
            <div className="font-bold text-gray-800 text-xs mt-0.5">
              {loan.annualInterestRate}%/năm • {loan.termMonths} tháng
            </div>
          </div>
        </div>
      </div>

      {/* Repayment Schedule Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-700" />
              <span>Loan Repayment Schedule (Lịch Trả Nợ Gốc & Lãi)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Phương pháp Flat: Gốc chia đều 12 kỳ, lãi cố định tính trên dư nợ ban đầu
            </p>
          </div>
        </div>

        <div className="mifos-panel overflow-hidden">
          <table className="w-full text-left mifos-table">
            <thead>
              <tr>
                <th className="w-16">Kỳ #</th>
                <th>Due Date (Ngày Đến Hạn)</th>
                <th className="text-right">Principal Due (Gốc)</th>
                <th className="text-right">Interest (Lãi)</th>
                <th className="text-right">Total Due (Tổng Trả)</th>
                <th>Status (Trạng Thái)</th>
              </tr>
            </thead>
            <tbody>
              {(loan.schedule || []).map((s) => {
                const isPaid = s.status === 'Paid';
                return (
                  <tr key={s.installment} className={isPaid ? 'bg-emerald-50/40' : ''}>
                    <td className="font-mono text-xs font-bold text-gray-500">Kỳ {s.installment}</td>
                    <td className="font-mono text-xs text-gray-700">{s.dueDate}</td>
                    <td className="text-right font-mono text-xs">{s.principal.toLocaleString('vi-VN')} VND</td>
                    <td className="text-right font-mono text-xs text-emerald-700">{s.interest.toLocaleString('vi-VN')} VND</td>
                    <td className="text-right font-mono text-xs font-bold text-sky-900">{s.total.toLocaleString('vi-VN')} VND</td>
                    <td>
                      <span className={`text-xs font-bold ${
                        isPaid 
                          ? 'text-emerald-700' 
                          : 'text-amber-700'
                      }`}>
                        {isPaid ? '✓ Đã thanh toán' : 'Chờ đến hạn'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Repay Modal */}
      {showRepayModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Make Loan Repayment (Thu Nợ Khoản Vay)</span>
              </h3>
            </div>

            <form onSubmit={handleRepaymentSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Khách hàng & Khoản vay</label>
                <input
                  type="text"
                  disabled
                  value={`${loan.clientName} - #${loan.accountNo}`}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Số tiền nộp thu nợ (VND) *</label>
                <input
                  type="number"
                  required
                  min="100000"
                  step="10000"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-600 font-mono text-sm font-bold text-emerald-800"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Định mức kỳ trả nợ: <strong>933.333 VND</strong> (Gốc: 833.333 + Lãi: 100.000)
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phương thức thanh toán *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-600 bg-white">
                  <option>Tiền mặt tại quầy (Cash at Teller - 110102)</option>
                  <option>Trích nợ tài khoản thanh toán (Current Account - 210101)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRepayModal(false)}
                  className="mifos-btn-default px-4 py-1.5 rounded font-medium border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mifos-btn-success px-4 py-1.5 rounded font-bold shadow-xs"
                >
                  Xác nhận thu nợ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
