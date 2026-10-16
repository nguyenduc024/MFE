import React, { useState } from 'react';
import { 
  ArrowLeft, PiggyBank, DollarSign, Calendar, 
  ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, 
  AlertCircle, Plus, Minus
} from 'lucide-react';

export default function SavingsDetailView({ savings, onBack, onDeposit, onWithdraw }) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState(1000000);

  if (!savings) return null;

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (onDeposit) {
      onDeposit(savings.id, Number(amount));
    }
    setShowDepositModal(false);
    alert(`Đã nộp thành công ${Number(amount).toLocaleString('vi-VN')} VND vào tài khoản #${savings.accountNo}! Bút toán kế toán đã tự động ghi nhận.`);
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (onWithdraw) {
      onWithdraw(savings.id, Number(amount));
    }
    setShowWithdrawModal(false);
    alert(`Đã rút thành công ${Number(amount).toLocaleString('vi-VN')} VND từ tài khoản #${savings.accountNo}!`);
  };

  // Sample transactions
  const transactions = [
    { id: "101", date: "2026-10-10", type: "DEPOSIT", amount: 2000000, balanceAfter: savings.balance, desc: "Nộp tiền mặt tại quầy giao dịch (Deposit)" },
    { id: "100", date: "2026-09-01", type: "DEPOSIT", amount: 5000000, balanceAfter: savings.balance - 2000000, desc: "Chuyển khoản nộp tiền định kỳ" },
    { id: "98", date: "2026-08-15", type: "OPENING", amount: savings.balance - 7000000, balanceAfter: savings.balance - 7000000, desc: "Khởi tạo số dư mở tài khoản ban đầu" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-sky-800 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại hồ sơ khách hàng ({savings.clientName})</span>
        </button>

        <span className="text-xs font-mono text-gray-500">
          Account #: <strong className="text-gray-900">{savings.accountNo}</strong>
        </span>
      </div>

      {/* Header Profile Card */}
      <div className="mifos-panel p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center shadow-md">
              <PiggyBank className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  {savings.productName} #{savings.accountNo}
                </h1>
                <span className="text-xs text-emerald-700 font-bold">
                  ● {savings.status}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                Chủ tài khoản: <strong className="text-emerald-900">{savings.clientName}</strong> • Loại hình: <strong>{savings.accountType}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDepositModal(true)}
              className="mifos-btn-success px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Deposit (Nộp Tiền)</span>
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="mifos-btn-default px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 border shadow-sm text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              <Minus className="w-4 h-4" />
              <span>Withdrawal (Rút Tiền)</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-100 text-xs">
          <div>
            <div className="text-gray-400 text-[11px]">Số dư khả dụng hiện tại</div>
            <div className="font-mono font-bold text-emerald-800 text-base mt-0.5">
              {savings.balance.toLocaleString('vi-VN')} VND
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-[11px]">Ngày mở tài khoản</div>
            <div className="font-bold text-gray-800 mt-0.5">
              {savings.openedDate || '2026-08-10'}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-[11px]">Hạn mức tối thiểu</div>
            <div className="font-mono font-bold text-gray-800 mt-0.5">
              50.000 VND
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-[11px]">Lãi suất áp dụng</div>
            <div className="font-bold text-emerald-700 mt-0.5">
              {savings.interestRate ? `${savings.interestRate}%/năm` : '0.2%/năm (Không kỳ hạn)'}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Account Transactions (Lịch Sử Giao Dịch Tài Khoản)</span>
          </h2>
        </div>

        <div className="mifos-panel overflow-hidden">
          <table className="w-full text-left mifos-table">
            <thead>
              <tr>
                <th className="w-16">Tx #</th>
                <th>Transaction Date</th>
                <th>Transaction Type</th>
                <th className="text-right">Debit (Rút)</th>
                <th className="text-right">Credit (Nộp)</th>
                <th className="text-right">Balance After (Số Dư Sau GD)</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const isDeposit = t.type === 'DEPOSIT' || t.type === 'OPENING';
                return (
                  <tr key={t.id}>
                    <td className="font-mono text-xs text-gray-400">#{t.id}</td>
                    <td className="font-mono text-xs text-gray-700">{t.date}</td>
                    <td>
                      <span className={`text-xs font-bold ${
                        isDeposit ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {isDeposit ? 'Nộp tiền (Deposit)' : 'Rút tiền (Withdraw)'}
                      </span>
                    </td>
                    <td className="text-right font-mono text-xs text-rose-700">
                      {!isDeposit ? `${t.amount.toLocaleString('vi-VN')} VND` : '—'}
                    </td>
                    <td className="text-right font-mono text-xs font-bold text-emerald-700">
                      {isDeposit ? `${t.amount.toLocaleString('vi-VN')} VND` : '—'}
                    </td>
                    <td className="text-right font-mono text-xs font-bold text-gray-800">
                      {t.balanceAfter.toLocaleString('vi-VN')} VND
                    </td>
                    <td className="text-xs text-gray-600 max-w-xs">{t.desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Deposit to Savings Account (Nộp Tiền Vào Tài Khoản)</span>
              </h3>
            </div>

            <form onSubmit={handleDepositSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Khách hàng & Tài khoản</label>
                <input
                  type="text"
                  disabled
                  value={`${savings.clientName} - #${savings.accountNo}`}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Số tiền nộp (VND) *</label>
                <input
                  type="number"
                  required
                  min="50000"
                  step="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-600 font-mono text-sm font-bold text-emerald-800"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="mifos-btn-default px-4 py-1.5 rounded font-medium border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mifos-btn-success px-4 py-1.5 rounded font-bold shadow-xs"
                >
                  Xác nhận nộp tiền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-rose-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Minus className="w-4 h-4" />
                <span>Withdrawal from Savings Account (Rút Tiền)</span>
              </h3>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Khách hàng & Tài khoản</label>
                <input
                  type="text"
                  disabled
                  value={`${savings.clientName} - #${savings.accountNo} (Số dư: ${savings.balance.toLocaleString('vi-VN')} VND)`}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Số tiền rút (VND) *</label>
                <input
                  type="number"
                  required
                  min="50000"
                  max={savings.balance}
                  step="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-rose-600 font-mono text-sm font-bold text-rose-800"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="mifos-btn-default px-4 py-1.5 rounded font-medium border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mifos-btn-danger px-4 py-1.5 rounded font-bold shadow-xs"
                >
                  Xác nhận rút tiền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
