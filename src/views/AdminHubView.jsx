import React from 'react';
import { 
  Briefcase, Users, Building2, Package, Settings, 
  ShieldCheck, DollarSign, BookOpen, ChevronRight, Layers
} from 'lucide-react';

export default function AdminHubView({ navigate }) {
  const sections = [
    {
      title: "Users (Quản Trị Người Dùng & Phân Quyền)",
      icon: Users,
      color: "text-[#1072ba] bg-[#1072ba]/10",
      links: [
        { label: "Users (27 tài khoản nhân sự TKB)", path: "admin-users", desc: "Quản lý tài khoản, chi nhánh trực thuộc, mật khẩu" },
        { label: "Roles & Permissions (16 vai trò Maker - Checker)", path: "admin-roles", desc: "Ma trận phân quyền chi tiết cho từng bộ phận nghiệp vụ" }
      ]
    },
    {
      title: "Organization (Cơ Cấu Tổ Chức & Quỹ Tiền)",
      icon: Building2,
      color: "text-[#1072ba] bg-[#1072ba]/10",
      links: [
        { label: "Manage Offices (30 Văn phòng & Chi nhánh)", path: "admin-offices", desc: "Hội sở chính, 3 vùng, chi nhánh và các PGD" },
        { label: "Cash Management (Tellers & Cashiers)", path: "admin-tellers", desc: "Quản lý quầy giao dịch và phân bổ nhân sự thu ngân" }
      ]
    },
    {
      title: "Products (Sản Phẩm Tín Dụng & Tiền Gửi)",
      icon: Package,
      color: "text-[#1072ba] bg-[#1072ba]/10",
      links: [
        { label: "Products (Danh mục phân hệ Products)", path: "admin-products", desc: "Sản phẩm tiền gửi, tín dụng, biểu phí, thuế và lãi suất" },
        { label: "Loan Products (Gói vay TKB Personal Loan)", path: "admin-loan-products", desc: "Kỳ hạn 12 tháng, lãi suất 12%/năm, liên kết GL" },
        { label: "Savings & Deposit Products (3 sản phẩm huy động)", path: "admin-savings-products", desc: "Tiền gửi thanh toán, tiết kiệm có kỳ hạn, gửi góp" }
      ]
    },
    {
      title: "Accounting (Sổ Cái & Kế Toán)",
      icon: BookOpen,
      color: "text-[#1072ba] bg-[#1072ba]/10",
      links: [
        { label: "Chart of Accounts (70 Tài khoản GL)", path: "accounting-coa", desc: "Hệ thống tài khoản tổng hợp phân loại 5 nhóm chuẩn" },
        { label: "Financial Activities & Accounting Rules", path: "accounting-activities", desc: "Ánh xạ dòng tiền tự động, quy tắc trích trước và khóa sổ" },
        { label: "Search Journal Entries (75 Bút toán sổ cái)", path: "accounting-journal", desc: "Kiểm tra nhật ký hạch toán tự động phát sinh từ nghiệp vụ" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="pb-2">
        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#1072ba]" />
          <span>Admin Center (Trung Tâm Quản Trị Hệ Thống Mifos X)</span>
        </h1>
        <p className="text-xs text-gray-500">
          Cổng điều hướng quản trị toàn bộ các cấu hình nền tảng của ngân hàng Takashimaya Bank (TKB)
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((section, idx) => {
          const SecIcon = section.icon;
          return (
            <div key={idx} className="mifos-card p-5 space-y-4">
              <div className="flex items-center space-x-3 pb-2.5">
                <div className={`p-2 rounded ${section.color}`}>
                  <SecIcon className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-1.5">
                {section.links.map((link, lIdx) => (
                  <button
                    key={lIdx}
                    onClick={() => navigate(link.path)}
                    className="w-full text-left p-3 rounded hover:bg-gray-50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#1072ba] group-hover:text-sky-900 flex items-center gap-1.5">
                        <span>{link.label}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {link.desc}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sky-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
