import React, { useState } from 'react';
import { 
  Package, Plus, Search, Layers, CheckCircle2, 
  PiggyBank, Calendar, Clock, DollarSign
} from 'lucide-react';

export default function SavingsProductsView({ savingsProducts = [] }) {
  const [selectedProduct, setSelectedProduct] = useState(savingsProducts[0] || null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-sky-700" />
            <span>Savings & Deposit Products (Sản Phẩm Tiết Kiệm & Huy Động Tiền Gửi)</span>
          </h1>
          <p className="text-xs text-gray-500">
            3 Loại hình huy động vốn tiêu biểu của ngân hàng: Tiền gửi thanh toán (CA), Tiết kiệm có kỳ hạn (FD) và Tiết kiệm gửi góp (RD)
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Products List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="mifos-panel p-3">
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Danh sách sản phẩm huy động ({savingsProducts.length})
            </div>

            <div className="space-y-2">
              {savingsProducts.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-3.5 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-50 border-sky-400 shadow-xs'
                        : 'bg-white border-gray-200 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <span>{p.name}</span>
                        <span className="font-mono text-xs text-sky-800 font-bold">
                          ({p.shortName})
                        </span>
                      </div>
                      <span className="text-xs text-emerald-700 font-bold">
                        Active
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-gray-600">
                      Loại hình: <strong className="text-sky-800">{p.depositType}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Details Panel */}
        {selectedProduct && (
          <div className="lg:col-span-7 space-y-4">
            <div className="mifos-panel p-5 space-y-4">
              <div className="pb-3 border-b border-gray-200">
                <div className="text-[10px] font-bold uppercase text-sky-700 tracking-wider">
                  Chi tiết sản phẩm tiền gửi
                </div>
                <h2 className="text-lg font-bold text-gray-900 mt-0.5">
                  {selectedProduct.name} ({selectedProduct.shortName})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mã tiền tệ: <strong>{selectedProduct.currencyCode} (VND)</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded border border-gray-200 text-xs">
                <div>
                  <div className="text-gray-400 text-[11px]">Phân loại tiền gửi (Deposit Type)</div>
                  <div className="font-bold text-sky-800 mt-0.5">{selectedProduct.depositType}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">Mã định danh (Short Name)</div>
                  <div className="font-mono font-bold text-gray-800 mt-0.5">{selectedProduct.shortName}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">Phương thức hạch toán (Accounting)</div>
                  <div className="font-bold text-purple-700 mt-0.5">{selectedProduct.accountingRule}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[11px]">Tần suất tính lãi</div>
                  <div className="font-bold text-gray-800 mt-0.5">Cuối kỳ / Định kỳ hàng tháng</div>
                </div>
              </div>

              {/* Accounting Mappings for Deposit Product */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-700" />
                  <span>Accounting Integration (Ánh Xạ Kế Toán Huy Động Vốn)</span>
                </div>

                <div className="bg-white border border-gray-200 rounded divide-y divide-gray-100 text-xs">
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-gray-600">Savings Reference (Quỹ nhận tiền gửi):</span>
                    <span className="font-mono font-bold text-sky-800">110102 - Cash at Teller</span>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-gray-600">Savings Control (Nợ phải trả tiền gửi KH):</span>
                    <span className="font-mono font-bold text-sky-800">210101 - Customer Current Accounts</span>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-gray-600">Interest on Savings (Chi phí trả lãi tiền gửi):</span>
                    <span className="font-mono font-bold text-rose-700">510001 - Interest Expense on Deposits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
