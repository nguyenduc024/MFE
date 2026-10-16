import React, { useState } from 'react';
import { 
  BookOpen, Search, Calendar, Filter, ArrowUpRight, 
  ArrowDownLeft, FileText, CheckCircle2
} from 'lucide-react';

export default function JournalEntriesView() {
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState('All');

  // 15 representative sample entries from the 75 entries in database
  const entries = [
    { id: "75", date: "2026-10-14", txId: "TX-20261014-001", glCode: "110102", glName: "Cash at Teller", entryType: "DEBIT", amount: 2500000, office: "Thu Duc Transaction Office", desc: "Thu nợ định kỳ kỳ 2 khoản vay #000000001" },
    { id: "74", date: "2026-10-14", txId: "TX-20261014-001", glCode: "120101", glName: "Retail Loan Principal", entryType: "CREDIT", amount: 2000000, office: "Thu Duc Transaction Office", desc: "Giảm dư nợ gốc khoản vay #000000001" },
    { id: "73", date: "2026-10-14", txId: "TX-20261014-001", glCode: "410001", glName: "Interest on Retail Loans", entryType: "CREDIT", amount: 500000, office: "Thu Duc Transaction Office", desc: "Hạch toán thu lãi vay cá nhân" },
    { id: "72", date: "2026-09-15", txId: "TX-20260915-001", glCode: "110102", glName: "Cash at Teller", entryType: "DEBIT", amount: 2500000, office: "Thu Duc Transaction Office", desc: "Thu nợ định kỳ kỳ 1 khoản vay #000000001" },
    { id: "71", date: "2026-09-15", txId: "TX-20260915-001", glCode: "120101", glName: "Retail Loan Principal", entryType: "CREDIT", amount: 2000000, office: "Thu Duc Transaction Office", desc: "Giảm dư nợ gốc khoản vay #000000001" },
    { id: "70", date: "2026-09-15", txId: "TX-20260915-001", glCode: "410001", glName: "Interest on Retail Loans", entryType: "CREDIT", amount: 500000, office: "Thu Duc Transaction Office", desc: "Hạch toán thu lãi vay cá nhân" },
    { id: "65", date: "2026-08-15", txId: "TX-20260815-002", glCode: "120101", glName: "Retail Loan Principal", entryType: "DEBIT", amount: 10000000, office: "Thu Duc Transaction Office", desc: "Giải ngân khoản vay TKB Personal Loan #000000001" },
    { id: "64", date: "2026-08-15", txId: "TX-20260815-002", glCode: "110102", glName: "Cash at Teller", entryType: "CREDIT", amount: 10000000, office: "Thu Duc Transaction Office", desc: "Chi tiền mặt giải ngân tại quầy giao dịch" },
    { id: "50", date: "2026-08-12", txId: "TX-20260812-001", glCode: "110102", glName: "Cash at Teller", entryType: "DEBIT", amount: 50000000, office: "Thu Duc Transaction Office", desc: "Khách hàng mở sổ tiết kiệm có kỳ hạn #000000003" },
    { id: "49", date: "2026-08-12", txId: "TX-20260812-001", glCode: "210201", glName: "Fixed Term Deposits", entryType: "CREDIT", amount: 50000000, office: "Thu Duc Transaction Office", desc: "Tăng nguồn vốn tiền gửi có kỳ hạn" },
    { id: "20", date: "2026-08-05", txId: "TX-20260805-001", glCode: "110102", glName: "Cash at Teller", entryType: "DEBIT", amount: 50000000, office: "Thu Duc Transaction Office", desc: "Cấp hạn mức tiền mặt đầu ngày cho Teller Thu Duc" },
    { id: "19", date: "2026-08-05", txId: "TX-20260805-001", glCode: "110101", glName: "Main Vault Cash", entryType: "CREDIT", amount: 50000000, office: "Takashimaya Bank (TKB) - HO", desc: "Xuất quỹ kho chính điều chuyển cho quầy giao dịch" },
    { id: "8", date: "2026-08-01", txId: "TX-20260801-001", glCode: "110101", glName: "Main Vault Cash", entryType: "DEBIT", amount: 500000000, office: "Takashimaya Bank (TKB) - HO", desc: "Ghi nhận số dư đầu kỳ quỹ tiền mặt Hội sở" },
    { id: "7", date: "2026-08-01", txId: "TX-20260801-001", glCode: "310001", glName: "Retained Earnings", entryType: "CREDIT", amount: 500000000, office: "Takashimaya Bank (TKB) - HO", desc: "Đối ứng vốn số dư đầu kỳ (Opening Balance Contra)" }
  ];

  const filtered = entries.filter(e => {
    const matchType = filterType === 'All' || e.entryType === filterType;
    const matchText = 
      e.glCode.includes(filterText) ||
      e.glName.toLowerCase().includes(filterText.toLowerCase()) ||
      e.desc.toLowerCase().includes(filterText.toLowerCase());
    return matchType && matchText;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-700" />
            <span>Search Journal Entries (Nhật Ký Sổ Cái Kế Toán)</span>
          </h1>
          <p className="text-xs text-gray-500">
            Tổng hợp 75 bút toán kế toán Nợ/Có phát sinh từ chu trình giải ngân vay, thu nợ, nộp tiết kiệm và điều chuyển quỹ
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded border border-gray-200 shadow-2xs">
        <div className="flex items-center space-x-3 flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Lọc theo mã GL, tên tài khoản, nội dung bút toán..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:border-sky-600"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
          </div>

          <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-200 text-xs">
            {['All', 'DEBIT', 'CREDIT'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  filterType === t ? 'bg-white shadow-xs text-sky-800' : 'text-gray-600'
                }`}
              >
                {t === 'All' ? 'Tất cả' : t === 'DEBIT' ? 'Nợ (Dr)' : 'Có (Cr)'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Hiển thị <strong>{filtered.length}</strong> bút toán tiêu biểu
        </div>
      </div>

      {/* Table */}
      <div className="mifos-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left mifos-table">
            <thead>
              <tr>
                <th className="w-12">ID</th>
                <th>Transaction Date</th>
                <th>GL Account (Tài Khoản Ghi Nhận)</th>
                <th>Type</th>
                <th className="text-right">Debit (Ghi Nợ)</th>
                <th className="text-right">Credit (Ghi Có)</th>
                <th>Office</th>
                <th>Transaction Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isDebit = item.entryType === 'DEBIT';
                return (
                  <tr key={item.id}>
                    <td className="font-mono text-xs text-gray-400">#{item.id}</td>
                    <td className="font-mono text-xs text-gray-700 whitespace-nowrap">{item.date}</td>
                    <td>
                      <div className="font-mono text-xs font-bold text-sky-800">{item.glCode}</div>
                      <div className="text-[11px] text-gray-600">{item.glName}</div>
                    </td>
                    <td>
                      <span className={`font-bold text-xs ${
                        isDebit ? 'text-rose-700' : 'text-emerald-700'
                      }`}>
                        {isDebit ? 'DEBIT (NỢ)' : 'CREDIT (CÓ)'}
                      </span>
                    </td>
                    <td className="text-right font-mono text-xs font-bold text-rose-700">
                      {isDebit ? `${item.amount.toLocaleString('vi-VN')} VND` : '—'}
                    </td>
                    <td className="text-right font-mono text-xs font-bold text-emerald-700">
                      {!isDebit ? `${item.amount.toLocaleString('vi-VN')} VND` : '—'}
                    </td>
                    <td className="text-xs text-gray-600 truncate max-w-[150px]">{item.office}</td>
                    <td className="text-xs text-gray-700 max-w-xs">{item.desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
