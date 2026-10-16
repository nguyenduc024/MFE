import React, { useState } from 'react';
import { 
  BookOpen, Plus, Shield, CheckCircle2, AlertCircle, 
  Lock, ArrowRight, ArrowRightLeft, FileSpreadsheet
} from 'lucide-react';

export default function AccountingRulesView({ 
  activities = [], 
  rules = [], 
  closures = [],
  defaultTab = 'activities'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-700" />
            <span>Accounting Configurations & Rules (Cấu Hình Kế Toán & Quy Tắc Định Khoản)</span>
          </h1>
          <p className="text-xs text-gray-500">
            Ánh xạ hoạt động tài chính tự động (Financial Activities), quy tắc trích trước (Accruals) và khóa sổ (GL Closure)
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('activities')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'activities'
              ? 'border-sky-600 text-sky-800 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Financial Activity Mappings ({activities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'border-sky-600 text-sky-800 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Accounting Rules ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('closure')}
          className={`pb-2.5 px-1 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'closure'
              ? 'border-sky-600 text-sky-800 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Closing Entries (Khóa Sổ - {closures.length})</span>
        </button>
      </div>

      {/* Tab 1: Financial Activity Mappings */}
      {activeTab === 'activities' && (
        <div className="space-y-3">
          <div className="bg-sky-50 border border-sky-100 p-3 rounded text-xs text-sky-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-sky-700 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Ý nghĩa nghiệp vụ:</strong> Ánh xạ tự động định hướng các giao dịch hệ thống đặc thù (như nạp số dư đầu kỳ, chuyển quỹ tiền mặt giữa các chi nhánh, điều chuyển kho tiền...) đến đúng tài khoản GL tương ứng trong sổ cái mà không cần kế toán viên phải tự hạch toán thủ công từng bút toán.
            </div>
          </div>

          <div className="mifos-panel overflow-hidden">
            <table className="w-full text-left mifos-table">
              <thead>
                <tr>
                  <th>Financial Activity (Hoạt Động Tài Chính)</th>
                  <th>Mapped GL Account (Tài Khoản GL Đã Ánh Xạ)</th>
                  <th>Activity Type ID</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => (
                  <tr key={act.id}>
                    <td className="font-bold text-gray-900 text-xs">
                      {act.activityName}
                    </td>
                    <td>
                      <span className="font-mono text-xs text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {act.glCode} - {act.glName}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-gray-500">
                      Type #{act.type}
                    </td>
                    <td>
                      <span className="text-xs text-emerald-700 font-bold">
                        Mapped (Đã liên kết)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Accounting Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-3">
          <div className="bg-sky-50 border border-sky-100 p-3 rounded text-xs text-sky-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-sky-700 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Quy tắc hạch toán mẫu:</strong> Cho phép định sẵn cặp tài khoản Nợ (Debit) và Có (Credit) cho các giao dịch nghiệp vụ thường ngày (như trích trước chi phí quản lý vận hành, chi trả lương...).
            </div>
          </div>

          <div className="mifos-panel overflow-hidden">
            <table className="w-full text-left mifos-table">
              <thead>
                <tr>
                  <th>Rule Name (Tên Quy Tắc)</th>
                  <th>Office (Áp Dụng)</th>
                  <th>Debit Account (Ghi Nợ)</th>
                  <th>Credit Account (Ghi Có)</th>
                  <th>Description (Mô Tả Nghiệp Vụ)</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id}>
                    <td className="font-bold text-gray-900 text-xs">
                      {r.name}
                    </td>
                    <td className="text-gray-700 text-xs font-medium">
                      {r.officeName}
                    </td>
                    <td>
                      <span className="font-mono text-xs text-rose-700 font-bold">
                        Dr: {r.debitAccount}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-emerald-700 font-bold">
                        Cr: {r.creditAccount}
                      </span>
                    </td>
                    <td className="text-xs text-gray-600 max-w-xs">
                      {r.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Closing Entries (GL Closure) */}
      {activeTab === 'closure' && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Quy định khóa sổ kế toán (GL Closure):</strong> Sau ngày khóa sổ, hệ thống nghiêm cấm mọi thao tác ghi sổ, hạch toán bù hoặc sửa đổi số liệu vào các ngày trước hoặc bằng ngày khóa sổ.
            </div>
          </div>

          <div className="mifos-panel overflow-hidden">
            <table className="w-full text-left mifos-table">
              <thead>
                <tr>
                  <th>Office (Chi Nhánh Khóa Sổ)</th>
                  <th>Closing Date (Ngày Chốt Khóa Sổ)</th>
                  <th>Comments (Ghi Chú Khóa Sổ)</th>
                  <th>Closed By (Người Thực Hiện)</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {closures.map((c) => (
                  <tr key={c.id}>
                    <td className="font-bold text-gray-900 text-xs">
                      {c.officeName}
                    </td>
                    <td>
                      <span className="font-mono text-xs font-bold text-amber-800">
                        {c.closingDate}
                      </span>
                    </td>
                    <td className="text-xs text-gray-700 max-w-sm leading-relaxed">
                      {c.comments}
                    </td>
                    <td className="text-xs text-gray-600 font-mono">
                      {c.closedBy}
                    </td>
                    <td>
                      <span className="text-xs text-rose-700 font-bold flex items-center gap-1 w-max">
                        <Lock className="w-3.5 h-3.5" />
                        Đã khóa sổ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
