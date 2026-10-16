import React, { useState } from 'react';
import { 
  Users, ArrowLeft, Plus, DollarSign, PiggyBank, 
  CreditCard, Calendar, Phone, Building, CheckCircle2, 
  ChevronRight, ArrowRightLeft, FileText, AlertCircle
} from 'lucide-react';

export default function ClientDetailView({ 
  client, 
  loans = [], 
  savingsAccounts = [], 
  onBack, 
  onSelectLoan, 
  onSelectSavings,
  onOpenNewLoanModal,
  onOpenNewSavingsModal
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!client) return null;

  const clientLoans = loans.filter(l => String(l.clientId) === String(client.id));
  const clientSavings = savingsAccounts.filter(s => String(s.clientId) === String(client.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* Back Button & Breadcrumb helper */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-sky-800 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách khách hàng</span>
        </button>

        <span className="text-xs font-mono text-gray-500">
          Mã CIF: <strong className="text-gray-900">{client.externalId}</strong>
        </span>
      </div>

      {/* Client 360 Header Profile Card */}
      <div className="mifos-panel p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-sky-700 text-white font-bold text-xl flex items-center justify-center uppercase shadow-md">
              {client.displayName?.[0] || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900">
                  {client.displayName}
                </h1>
                <span className={`text-xs font-bold ${
                  client.status === 'Active' 
                    ? 'text-emerald-700' 
                    : 'text-amber-700'
                }`}>
                  ● {client.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-1">
                <span>Account #: <strong className="font-mono text-sky-900">{client.accountNo}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  {client.officeName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {client.mobileNo || '0901234567'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Kích hoạt: {client.activationDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewLoanModal}
              className="mifos-btn-primary px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>+ New Loan</span>
            </button>
            <button
              onClick={onOpenNewSavingsModal}
              className="mifos-btn-success px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <PiggyBank className="w-3.5 h-3.5" />
              <span>+ New Savings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-sky-600 text-sky-800 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Tổng Quan Tài Khoản (Overview)</span>
        </button>

        <button
          onClick={() => setActiveTab('loans')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'loans'
              ? 'border-sky-600 text-sky-800 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Hồ Sơ Vay Vốn ({clientLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('savings')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'savings'
              ? 'border-sky-600 text-sky-800 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <PiggyBank className="w-3.5 h-3.5" />
          <span>Tài Khoản Tiết Kiệm ({clientSavings.length})</span>
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Loan Accounts Summary Card */}
            <div className="mifos-panel p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-700" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                    Khoản Vay Đang Hoạt Động
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-sky-800">
                  {clientLoans.length} Khoản vay
                </span>
              </div>

              {clientLoans.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs">
                  Khách hàng chưa có hồ sơ vay nào.
                  <div className="mt-2">
                    <button
                      onClick={onOpenNewLoanModal}
                      className="text-sky-700 font-bold hover:underline"
                    >
                      + Tạo hồ sơ vay mới ngay
                    </button>
                  </div>
                </div>
              ) : (
                clientLoans.map(loan => (
                  <div 
                    key={loan.id}
                    onClick={() => onSelectLoan(loan)}
                    className="p-3 rounded bg-gray-50 hover:bg-sky-50 border border-gray-200 hover:border-sky-300 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">{loan.productName}</span>
                      <span className="text-xs text-emerald-700 font-bold">
                        {loan.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        Số tiền giải ngân: <strong className="font-mono">{loan.principal.toLocaleString('vi-VN')} VND</strong>
                      </div>
                      <div>
                        Dư nợ còn lại: <strong className="font-mono text-rose-700">{loan.outstandingBalance.toLocaleString('vi-VN')} VND</strong>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-sky-700 font-semibold flex items-center justify-end gap-1">
                      <span>Xem lịch trả nợ & hạch toán</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Savings Accounts Summary Card */}
            <div className="mifos-panel p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                    Tài Khoản & Sổ Tiết Kiệm
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700">
                  {clientSavings.length} Tài khoản
                </span>
              </div>

              {clientSavings.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs">
                  Khách hàng chưa mở tài khoản tiết kiệm nào.
                  <div className="mt-2">
                    <button
                      onClick={onOpenNewSavingsModal}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      + Mở tài khoản tiết kiệm ngay
                    </button>
                  </div>
                </div>
              ) : (
                clientSavings.map(s => (
                  <div 
                    key={s.id}
                    onClick={() => onSelectSavings(s)}
                    className="p-3 rounded bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">{s.productName}</span>
                      <span className="text-xs text-emerald-700 font-bold">
                        {s.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-mono">#{s.accountNo} ({s.accountType})</span>
                      <span className="font-mono font-bold text-emerald-700 text-sm">
                        {s.balance.toLocaleString('vi-VN')} VND
                      </span>
                    </div>

                    <div className="text-right text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                      <span>Nộp/Rút tiền & lịch sử</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Loans Table */}
      {activeTab === 'loans' && (
        <div className="mifos-panel overflow-hidden">
          <table className="w-full text-left mifos-table">
            <thead>
              <tr>
                <th>Account #</th>
                <th>Loan Product</th>
                <th>Principal (Số Tiền Gốc)</th>
                <th>Đã Thu Hồi</th>
                <th>Dư Nợ Còn Lại</th>
                <th>Lãi Suất</th>
                <th>Trạng Thái</th>
                <th className="text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {clientLoans.map(loan => (
                <tr key={loan.id}>
                  <td className="font-mono text-xs font-bold text-sky-800">{loan.accountNo}</td>
                  <td className="font-bold text-gray-900 text-xs">{loan.productName}</td>
                  <td className="font-mono text-xs font-bold text-gray-800">{loan.principal.toLocaleString('vi-VN')} VND</td>
                  <td className="font-mono text-xs text-emerald-700">{loan.totalRepaid.toLocaleString('vi-VN')} VND</td>
                  <td className="font-mono text-xs font-bold text-rose-700">{loan.outstandingBalance.toLocaleString('vi-VN')} VND</td>
                  <td className="font-mono text-xs">{loan.annualInterestRate}%/năm</td>
                  <td>
                    <span className="text-xs text-emerald-700 font-bold">
                      {loan.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => onSelectLoan(loan)}
                      className="text-xs text-sky-700 hover:text-sky-900 font-bold hover:underline"
                    >
                      Mở hồ sơ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Savings Table */}
      {activeTab === 'savings' && (
        <div className="mifos-panel overflow-hidden">
          <table className="w-full text-left mifos-table">
            <thead>
              <tr>
                <th>Account #</th>
                <th>Product Name</th>
                <th>Deposit Type</th>
                <th>Số Dư Hiện Tại</th>
                <th>Ngày Mở</th>
                <th>Trạng Thái</th>
                <th className="text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {clientSavings.map(s => (
                <tr key={s.id}>
                  <td className="font-mono text-xs font-bold text-emerald-800">{s.accountNo}</td>
                  <td className="font-bold text-gray-900 text-xs">{s.productName}</td>
                  <td className="text-xs text-gray-600">{s.accountType}</td>
                  <td className="font-mono text-xs font-bold text-emerald-700 text-sm">
                    {s.balance.toLocaleString('vi-VN')} VND
                  </td>
                  <td className="font-mono text-xs text-gray-600">{s.openedDate}</td>
                  <td>
                    <span className="text-xs text-emerald-700 font-bold">
                      {s.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => onSelectSavings(s)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                    >
                      Giao dịch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
