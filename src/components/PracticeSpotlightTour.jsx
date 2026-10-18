import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * PracticeSpotlightTour - Guided interactive walkthrough for:
 * 1. Creating 1 role (spotlighting input box & suggest autofill)
 * 2. Pop-up prompt to confirm auto-importing remaining 13 bank roles
 * 3. Continuing the walkthrough to create a user account for staff
 */
export default function PracticeSpotlightTour({
  isActive,
  onClose,
  currentPath,
  module = 'part-1',
  roles = [],
  users = [],
  offices = [],
  navigate,
  onLoadAllRoles,
  onLoadAllUsers,
  onLoadAllOffices,
  onLoadRegionalOffices
}) {
  const [targetRect, setTargetRect] = useState(null);
  const [roleCreated, setRoleCreated] = useState(false);
  const [rolesImported, setRolesImported] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [usersImported, setUsersImported] = useState(false);
  const [tourPhase, setTourPhase] = useState('role'); // 'role', 'role-popup', 'user', 'user-popup', 'completed'

  // Part 2 state
  const [officePopup, setOfficePopup] = useState(null); // null, 'ho-created', 'ro-created', 'br-created', 'to-created'
  const [officesImported, setOfficesImported] = useState(false);
  const startOfficeCountRef = useRef(offices.length);

  const startRoleCountRef = useRef(roles.length);
  const startUserCountRef = useRef(users.length);

  // Reset session reference whenever practice becomes active
  useEffect(() => {
    if (isActive) {
      if (module === 'part-2') {
        startOfficeCountRef.current = offices.length;
        setOfficePopup(null);
        setOfficesImported(false);
      } else {
        startRoleCountRef.current = roles.length;
        startUserCountRef.current = users.length;
        setRoleCreated(false);
        setRolesImported(false);
        setUserCreated(false);
        setUsersImported(false);
        setTourPhase('role');
      }
    }
  }, [isActive, module]);

  // Track if a role was created during this active session
  useEffect(() => {
    if (isActive && module === 'part-1' && roles.length > startRoleCountRef.current && !roleCreated) {
      setRoleCreated(true);
      setTourPhase('role-popup');
    }
  }, [roles.length, isActive, module, roleCreated]);

  // Track if a user was created during this active session
  useEffect(() => {
    if (isActive && module === 'part-1' && users.length > startUserCountRef.current && !userCreated) {
      setUserCreated(true);
      setTourPhase('user-popup');
    }
  }, [users.length, isActive, module, userCreated]);

  // Track if an office was created during this active session (Part 2)
  useEffect(() => {
    if (isActive && module === 'part-2' && offices.length > startOfficeCountRef.current && !officePopup) {
      const newlyAdded = offices[0];
      startOfficeCountRef.current = offices.length;
      if (!newlyAdded.parentId || newlyAdded.parentId === 'none' || newlyAdded.parentId === 'root') {
        setOfficePopup('ho-created');
      } else {
        const parent = offices.find(p => String(p.id) === String(newlyAdded.parentId));
        const isParentHO = parent && (!parent.parentId || parent.parentId === 'none' || parent.parentId === 'root');
        if (isParentHO || newlyAdded.name.toLowerCase().includes('region') || newlyAdded.name.toLowerCase().includes('khu vực')) {
          setOfficePopup('ro-created');
        } else if (newlyAdded.name.toLowerCase().includes('branch') || newlyAdded.name.toLowerCase().includes('chi nhánh')) {
          setOfficePopup('br-created');
        } else {
          setOfficePopup('to-created');
        }
      }
    }
  }, [offices.length, isActive, module, officePopup, offices]);

  // Check form fill status for Role form
  const submitRoleBtn = typeof document !== 'undefined' ? document.getElementById('tour-submit-role-btn') : null;
  const isRoleFormFilled = Boolean(submitRoleBtn && !submitRoleBtn.disabled);

  // Check form fill status for User form
  const submitUserBtn = typeof document !== 'undefined' ? document.getElementById('tour-submit-user-btn') : null;
  const isUserFormFilled = Boolean(submitUserBtn && !submitUserBtn.disabled);

  // Check form fill status for Office form (Part 2)
  const submitOfficeBtn = typeof document !== 'undefined' ? document.getElementById('tour-submit-office-btn') : null;
  const isOfficeFormFilled = Boolean(submitOfficeBtn && !submitOfficeBtn.disabled);

  // Determine active step & target element
  let currentStep = 1;
  let targetSelector = '#tour-nav-admin';
  let stepTitle = 'Bước 1 / 4: Mở menu Quản trị';
  let stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở các phân hệ quản trị.';

  if (module === 'part-2') {
    if (officePopup) {
      targetSelector = null;
    } else if (currentPath === 'admin-create-office') {
      currentStep = 5;
      if (!isOfficeFormFilled) {
        targetSelector = '#tour-office-input-card';
        stepTitle = 'Bước 5: Nhập thông tin Office theo phân cấp';
        stepInstruction = 'Nhập tên văn phòng, chọn Parent Office (hoặc Root cho Hội sở) hoặc chọn các nút gợi ý "Điền nhanh mẫu thực hành" phía trên.';
      } else {
        targetSelector = '#tour-submit-office-btn';
        stepTitle = 'Bước 5: Nhấn Submit để lưu đơn vị';
        stepInstruction = 'Thông tin văn phòng đã hợp lệ. Nhấn nút Submit để lưu vào cây cơ cấu tổ chức.';
      }
    } else if (currentPath === 'admin-offices') {
      currentStep = 4;
      targetSelector = '#tour-create-office-btn';
      stepTitle = 'Bước 4: Nhấn nút Create Office';
      stepInstruction = 'Bấm vào nút Create Office ở góc trên bên phải để mở biểu mẫu khởi tạo văn phòng mới.';
    } else if (currentPath === 'admin-organization') {
      currentStep = 3;
      targetSelector = '#tour-manage-offices';
      stepTitle = 'Bước 3: Chọn Manage Offices';
      stepInstruction = 'Bấm vào mục Manage Offices để mở trang Quản lý danh sách văn phòng và cây phân cấp.';
    } else {
      const adminOrgEl = typeof document !== 'undefined' ? document.getElementById('tour-admin-organization') : null;
      if (adminOrgEl) {
        currentStep = 2;
        targetSelector = '#tour-admin-organization';
        stepTitle = 'Bước 2: Chọn Cơ cấu tổ chức (Organization)';
        stepInstruction = 'Bấm vào mục Organization trong danh sách thả xuống.';
      } else {
        currentStep = 1;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 1: Mở menu Quản trị';
        stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở các phân hệ quản trị.';
      }
    }
  } else if (tourPhase === 'role-popup') {
    targetSelector = null; // Displaying confirmation popup
  } else if (tourPhase === 'user') {
    if (userCreated && currentPath === 'admin-user-detail') {
      currentStep = 9;
      targetSelector = null;
      stepTitle = 'Hoàn thành xuất sắc bài học!';
      stepInstruction = 'Bạn đã thiết lập thành công các vai trò nghiệp vụ và tạo tài khoản nhân viên.';
    } else if (currentPath === 'admin-create-user') {
      currentStep = 8;
      if (!isUserFormFilled) {
        targetSelector = '#tour-user-input-card';
        stepTitle = 'Bước 8: Nhập thông tin người dùng';
        stepInstruction = 'Nhập thông tin nhân viên (Username, Email, Họ tên, Chi nhánh, Vai trò) hoặc bấm "Điền nhanh mẫu user".';
      } else {
        targetSelector = '#tour-submit-user-btn';
        stepTitle = 'Bước 8: Nhấn Submit để tạo người dùng';
        stepInstruction = 'Thông tin tài khoản đã hợp lệ. Nhấn nút Submit để lưu người dùng vào hệ thống.';
      }
    } else if (currentPath === 'admin-users') {
      currentStep = 7;
      targetSelector = '#tour-create-user-btn';
      stepTitle = 'Bước 7: Nhấn nút Create User';
      stepInstruction = 'Bấm vào nút Create User ở góc trên bên phải để bắt đầu biểu mẫu cấp tài khoản mới.';
    } else {
      // Guide user to open Admin -> Users from wherever they currently are
      const adminUsersEl = typeof document !== 'undefined' ? document.getElementById('tour-admin-users') : null;
      if (adminUsersEl) {
        currentStep = 6;
        targetSelector = '#tour-admin-users';
        stepTitle = 'Bước 6.2: Chọn mục Users';
        stepInstruction = 'Bấm vào mục Users trong menu thả xuống để mở trang Quản lý danh sách người dùng.';
      } else {
        currentStep = 6;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 6.1: Mở menu Quản trị';
        stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở danh sách phân hệ quản trị.';
      }
    }
  } else {
    // Phase 1: Role Creation
    if (currentPath === 'admin-add-role') {
      currentStep = 5;
      if (!isRoleFormFilled) {
        targetSelector = '#tour-role-input-card';
        stepTitle = 'Bước 5: Nhập thông tin Role';
        stepInstruction = 'Nhập thông tin Name * và Description * vào ô bên dưới, hoặc bấm nút gợi ý "Điền nhanh mẫu".';
      } else {
        targetSelector = '#tour-submit-role-btn';
        stepTitle = 'Bước 5: Nhấn Submit để lưu';
        stepInstruction = 'Thông tin vai trò đã được điền đầy đủ. Nhấn nút Submit để lưu vai trò vào hệ thống.';
      }
    } else if (currentPath === 'admin-roles') {
      currentStep = 4;
      targetSelector = '#tour-add-role-btn';
      stepTitle = 'Bước 4 / 4: Nhấn nút Add Role';
      stepInstruction = 'Bấm vào nút Add Role ở góc trên bên phải để mở biểu mẫu tạo vai trò mới.';
    } else if (currentPath === 'admin-system') {
      currentStep = 3;
      targetSelector = '#tour-manage-roles';
      stepTitle = 'Bước 3 / 4: Chọn Manage Roles and Permissions';
      stepInstruction = 'Bấm vào dòng Manage Roles and Permissions để mở trang quản lý vai trò và phân quyền.';
    } else {
      const adminSystemEl = typeof document !== 'undefined' ? document.getElementById('tour-admin-system') : null;
      if (adminSystemEl) {
        currentStep = 2;
        targetSelector = '#tour-admin-system';
        stepTitle = 'Bước 2 / 4: Chọn Quản trị hệ thống (System)';
        stepInstruction = 'Bấm vào mục System trong danh sách thả xuống.';
      } else {
        currentStep = 1;
        targetSelector = '#tour-nav-admin';
        stepTitle = 'Bước 1 / 4: Mở menu Quản trị';
        stepInstruction = 'Bấm vào nút Admin trên thanh điều hướng để mở các phân hệ quản trị.';
      }
    }
  }

  // Update target bounding rectangle continuously
  const updateRect = useCallback(() => {
    if (!isActive || !targetSelector) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect({
          left: Math.round(rect.left),
          top: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom)
        });
        return;
      }
    }
    setTargetRect(null);
  }, [isActive, targetSelector]);

  useEffect(() => {
    if (!isActive) return;

    updateRect();
    const timer = setInterval(updateRect, 100);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isActive, updateRect]);

  if (!isActive) return null;

  const handleAutofillRole = () => {
    window.dispatchEvent(new CustomEvent('practice-autofill-role', {
      detail: {
        name: 'TKB_TELLER_CASHIER',
        description: 'Responsible for authorized cash transactions and teller operations.'
      }
    }));
  };

  const handleAutofillUser = () => {
    window.dispatchEvent(new CustomEvent('practice-autofill-user', {
      detail: {
        username: 'tkb.teller01',
        email: 'tkb.teller01@tkb.org',
        firstname: 'Huong',
        lastname: 'Doan'
      }
    }));
  };

  const handleConfirmImportRoles = () => {
    if (onLoadAllRoles) {
      onLoadAllRoles();
    }
    setRolesImported(true);
  };

  const handleContinueToUsers = () => {
    setTourPhase('user');
  };

  const handleConfirmImportUsers = () => {
    if (onLoadAllUsers) {
      onLoadAllUsers();
    }
    setUsersImported(true);
  };

  // Pop-up modals for Part 2: 4-Tier Organization Flow
  if (module === 'part-2' && officePopup) {
    if (officePopup === 'ho-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Bước 1 hoàn tất: Hội sở chính
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Tạo thành công Hội sở chính (Head Office)!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn đã tạo thành công đơn vị đầu não: <strong className="text-gray-900">{offices[0]?.name || 'Takashimaya Bank (TKB) - HO'}</strong> (Root Head Office).
            </p>
            <div className="py-2.5 px-3 bg-sky-50 border-l-2 border-[#1072ba] text-xs text-sky-900">
              <strong>Bước 2 tiếp theo:</strong> Tạo 3 Văn phòng khu vực (Miền Bắc, Miền Trung, Miền Nam) và chọn <strong>Parent Office</strong> là Hội sở vừa tạo.
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  if (onLoadRegionalOffices) onLoadRegionalOffices();
                  setOfficePopup('ro-created');
                }}
                className="py-1.5 px-3 border border-sky-300 hover:bg-sky-50 text-[#1072ba] text-xs rounded-[2px] cursor-pointer transition-colors"
              >
                Nạp nhanh 3 VP Khu vực
              </button>
              <button
                onClick={() => {
                  setOfficePopup(null);
                  if (navigate) navigate('admin-create-office');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục tạo VP Khu vực →
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (officePopup === 'ro-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Bước 2 hoàn tất: Văn phòng khu vực
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Thiết lập thành công Văn phòng khu vực!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Văn phòng khu vực đã được liên kết đúng với Hội sở chính theo mô hình cha - con (Parent Office).
            </p>
            <div className="py-2.5 px-3 bg-sky-50 border-l-2 border-[#1072ba] text-xs text-sky-900">
              <strong>Bước 3 tiếp theo:</strong> Tạo Chi nhánh (Branch) và chọn <strong>Parent Office</strong> là Văn phòng khu vực quản lý tương ứng (VD: Hanoi Branch thuộc Miền Bắc).
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setOfficePopup(null);
                  if (navigate) navigate('admin-create-office');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục tạo Chi nhánh →
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (officePopup === 'br-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
              Bước 3 hoàn tất: Chi nhánh
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              Thiết lập thành công Chi nhánh ngân hàng!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Chi nhánh đã được gắn đúng về Văn phòng khu vực điều phối.
            </p>
            <div className="py-2.5 px-3 bg-emerald-50 border-l-2 border-[#28a745] text-xs text-emerald-900">
              <strong>Bước 4 tiếp theo:</strong> Tạo Phòng giao dịch (Transaction Office - TO) và chọn <strong>Parent Office</strong> là Chi nhánh trực tiếp quản lý (VD: Cau Giay TO thuộc Hanoi Branch).
            </div>
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setOfficePopup(null);
                  if (navigate) navigate('admin-create-office');
                }}
                className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
              >
                Tiếp tục tạo Phòng giao dịch (TO) →
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (officePopup === 'to-created') {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
              {officesImported ? 'Đã nạp toàn bộ mạng lưới' : 'Hoàn tất xuất sắc 4 cấp cơ cấu tổ chức!'}
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              {officesImported 
                ? 'Đã nạp đầy đủ 32 đơn vị mạng lưới vào hệ thống!' 
                : 'Chúc mừng bạn đã thiết lập trọn vẹn mô hình 4 cấp mạng lưới ngân hàng!'}
            </h3>
            {!officesImported ? (
              <>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bạn đã thực hành chính xác trọn vẹn luồng phân cấp:
                </p>
                <div className="py-2.5 px-3 bg-gray-50 border-l-2 border-[#28a745] text-xs text-gray-700 space-y-1">
                  <div>✓ Cấp 1: Hội sở chính (Head Office)</div>
                  <div>✓ Cấp 2: Văn phòng khu vực (Bắc, Trung, Nam có parent là Hội sở)</div>
                  <div>✓ Cấp 3: Chi nhánh (có parent là Văn phòng khu vực)</div>
                  <div>✓ Cấp 4: Phòng giao dịch (có parent là Chi nhánh)</div>
                </div>
                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      if (onLoadAllOffices) onLoadAllOffices();
                      setOfficesImported(true);
                    }}
                    className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Nạp toàn bộ 32 đơn vị từ database
                  </button>
                  <button
                    onClick={() => {
                      setOfficePopup(null);
                      onClose();
                      if (navigate) navigate('admin-offices');
                    }}
                    className="py-1.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs rounded-[2px] cursor-pointer transition-colors"
                  >
                    Xem Cây phân cấp
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Toàn bộ 32 đơn vị chi nhánh và phòng giao dịch từ cơ sở dữ liệu đã được nạp đầy đủ và sẵn sàng vận hành.
                </p>
                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setOfficePopup(null);
                      onClose();
                      if (navigate) navigate('admin-offices');
                    }}
                    className="py-2 px-4 bg-[#28a745] hover:bg-[#218838] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                  >
                    Xem Cây phân cấp cơ cấu tổ chức
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
  }

  // Pop-up prompt after creating 1 role
  if (tourPhase === 'role-popup') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
            {rolesImported ? 'Đã nạp toàn bộ vai trò' : 'Tiếp tục thiết lập vai trò nghiệp vụ'}
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {rolesImported 
              ? 'Đã nạp đầy đủ 16 vai trò chuẩn vào hệ thống!' 
              : 'Tiếp tục nhập 13 vai trò còn lại cho ngân hàng?'}
          </h3>

          {!rolesImported ? (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bạn đã thực hành tạo thành công 1 vai trò: <strong className="text-gray-900">TKB_TELLER_CASHIER</strong>.
              </p>

              <p className="text-xs text-gray-600 leading-relaxed">
                Theo thiết kế hệ thống ngân hàng Takashimaya Bank (TKB), cần thiết lập thêm <strong className="text-gray-900">13 vai trò nghiệp vụ khác</strong> (Kế toán Maker/Checker, Tín dụng Maker/Approver, Giám sát tiền mặt, Quản lý chi nhánh...).
              </p>

              <div className="py-2.5 px-3 bg-gray-50 border-l-2 border-[#1072ba] text-[11px] text-gray-600 space-y-1">
                <div>Nhấn <strong>Xác nhận</strong> để hệ thống tự động nạp toàn bộ dữ liệu 13 vai trò còn lại từ cơ sở dữ liệu đã chuẩn bị trước.</div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="py-1.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs rounded-[2px] cursor-pointer transition-colors"
                >
                  Để tôi tự tạo thủ công
                </button>
                <button
                  onClick={handleConfirmImportRoles}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Xác nhận nạp tự động 13 vai trò
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hệ thống đã tự động nạp đủ 16 vai trò (gồm 2 vai trò mặc định và 14 vai trò nghiệp vụ ngân hàng) vào danh sách.
              </p>

              <div className="py-2.5 px-3 bg-emerald-50 border-l-2 border-[#28a745] text-xs text-emerald-900">
                Bước tiếp theo của phân hệ: Khởi tạo tài khoản nhân viên (Users) và liên kết với vai trò vừa nạp.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="py-1.5 px-3 text-gray-500 hover:text-gray-700 text-xs cursor-pointer"
                >
                  Đóng hướng dẫn
                </button>
                <button
                  onClick={handleContinueToUsers}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Tiếp tục: Tạo tài khoản Người dùng (Users)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Pop-up prompt after creating 1 user
  if (tourPhase === 'user-popup') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
            {usersImported ? 'Đã nạp toàn bộ tài khoản nhân sự' : 'Tiếp tục thiết lập tài khoản nhân viên'}
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {usersImported 
              ? 'Đã nạp đầy đủ 26 tài khoản nhân viên vào hệ thống!' 
              : 'Tiếp tục nạp 24 tài khoản nhân viên còn lại cho ngân hàng?'}
          </h3>

          {!usersImported ? (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bạn đã thực hành tạo thành công 1 tài khoản nhân viên: <strong className="text-gray-900 font-semibold">tkb.teller01</strong> (Huong Doan - Takashimaya Bank HO).
              </p>

              <p className="text-xs text-gray-600 leading-relaxed">
                Theo thiết kế hệ thống ngân hàng Takashimaya Bank (TKB), cần thiết lập đầy đủ danh sách nhân sự cho các bộ phận (Tín dụng, Kế toán, Kiểm toán, Quản trị hệ thống, Thu ngân...).
              </p>

              <div className="py-2.5 px-3 bg-gray-50 border-l-2 border-[#1072ba] text-[11px] text-gray-600 space-y-1">
                <div>Nhấn <strong>Xác nhận</strong> để hệ thống tự động nạp toàn bộ 24 tài khoản nhân viên còn lại từ cơ sở dữ liệu đã chuẩn bị trước.</div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="py-1.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs rounded-[2px] cursor-pointer transition-colors"
                >
                  Để tôi tự tạo thủ công
                </button>
                <button
                  onClick={handleConfirmImportUsers}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Xác nhận nạp tự động 24 nhân viên
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hệ thống đã tự động nạp đủ 26 tài khoản nhân sự (gồm 2 tài khoản quản trị hệ thống mặc định và 24 tài khoản nhân sự các phòng ban) từ cơ sở dữ liệu.
              </p>

              <div className="py-2.5 px-3 bg-amber-50 border-l-2 border-amber-500 text-[11px] text-amber-900">
                <strong>Lưu ý bảo mật:</strong> 2 tài khoản hệ thống mặc định (<code>bank Administrator</code> và <code>system</code>) luôn được bảo vệ, khi bấm vào sẽ có thông báo khóa không cho phép sửa đổi hoặc xóa.
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    if (navigate) navigate('admin-users');
                    setTourPhase('completed');
                  }}
                  className="py-2 px-4 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
                >
                  Xem danh sách Users (26 tài khoản)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Final completion modal
  if (tourPhase === 'completed') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-[2px] shadow-2xl max-w-md w-full p-6 text-gray-800 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#28a745]">
            Phân hệ hoàn tất thành công
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">
            Hoàn tất Phân hệ 01: User & Access Management!
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Chúc mừng bạn đã hoàn thành trọn vẹn luồng thực hành Phân hệ 01:
          </p>

          <div className="py-2.5 px-3 bg-gray-50 border-l-2 border-[#1072ba] text-xs text-gray-700 space-y-1.5">
            <div>✓ Thiết lập hệ thống vai trò tác nghiệp (Roles) chuẩn ngân hàng.</div>
            <div>✓ Tạo tài khoản người dùng nhân viên (Users) và phân quyền nghiệp vụ.</div>
            <div>✓ Nạp toàn bộ dữ liệu 26 nhân sự ngân hàng từ cơ sở dữ liệu.</div>
            <div>✓ Bảo vệ nghiêm ngặt 2 tài khoản và 2 vai trò hệ thống mặc định.</div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="py-2 px-5 bg-[#1072ba] hover:bg-[#0e619e] text-white text-xs font-semibold rounded-[2px] shadow-xs cursor-pointer transition-colors"
            >
              Hoàn tất thực hành
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tooltip position calculation
  const padding = 6;
  const box = targetRect ? {
    left: Math.max(0, targetRect.left - padding),
    top: Math.max(0, targetRect.top - padding),
    width: targetRect.width + padding * 2,
    height: targetRect.height + padding * 2,
    right: targetRect.left - padding + targetRect.width + padding * 2,
    bottom: targetRect.top - padding + targetRect.height + padding * 2
  } : null;

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  let tooltipStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };

  if (box) {
    const spaceBelow = windowHeight - box.bottom;
    const spaceAbove = box.top;
    let tooltipTop = box.bottom + 12;

    if (box.height > 200) {
      if (spaceBelow >= 160) {
        tooltipTop = box.bottom + 12;
      } else if (spaceAbove >= 160) {
        tooltipTop = Math.max(16, box.top - 165);
      } else {
        tooltipTop = 16;
      }
    } else {
      const placeAbove = spaceBelow < 190 && spaceAbove > 190;
      tooltipTop = placeAbove ? Math.max(10, box.top - 180) : Math.min(windowHeight - 200, box.bottom + 12);
    }

    const tooltipLeft = Math.min(Math.max(16, box.left), windowWidth - 360);

    tooltipStyle = {
      position: 'fixed',
      top: `${tooltipTop}px`,
      left: `${tooltipLeft}px`,
      width: '340px'
    };
  }

  return (
    <>
      {/* 1. Dark overlay with spotlight cutout using SVG mask */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[9985]">
        <defs>
          <mask id="practice-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {box && (
              <rect
                x={box.left}
                y={box.top}
                width={box.width}
                height={box.height}
                rx={4}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.72)"
          mask="url(#practice-spotlight-mask)"
        />
      </svg>

      {/* 2. Transparent click-blockers around target cutout */}
      {box && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: `${Math.max(0, box.top)}px`,
              zIndex: 9988,
              cursor: 'not-allowed'
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: `${box.bottom}px`,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9988,
              cursor: 'not-allowed'
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: `${box.top}px`,
              left: 0,
              width: `${Math.max(0, box.left)}px`,
              height: `${box.height}px`,
              zIndex: 9988,
              cursor: 'not-allowed'
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: `${box.top}px`,
              left: `${box.right}px`,
              right: 0,
              height: `${box.height}px`,
              zIndex: 9988,
              cursor: 'not-allowed'
            }}
          />
        </>
      )}

      {/* 3. Glowing animated highlight ring */}
      {box && (
        <div
          style={{
            position: 'fixed',
            left: `${box.left}px`,
            top: `${box.top}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
            zIndex: 9992,
            pointerEvents: 'none'
          }}
          className="border-2 border-[#1072ba] rounded-[3px] ring-4 ring-[#1072ba]/40 animate-pulse"
        />
      )}

      {/* 4. Instruction Tooltip Card */}
      <div
        style={tooltipStyle}
        className="fixed z-[9999] bg-white rounded-[2px] shadow-2xl border border-gray-200 p-4 text-xs text-gray-800 space-y-3 animate-in fade-in zoom-in-95 duration-150 select-none"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1072ba]">
            Chế độ thực hành có hướng dẫn
          </span>
          <button
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-gray-700 font-medium cursor-pointer"
          >
            Thoát thực hành
          </button>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 text-xs">
            {stepTitle}
          </h4>
          <p className="text-gray-600 text-[11px] mt-1 leading-relaxed">
            {stepInstruction}
          </p>
        </div>

        {/* Quick autofill suggestion button for Role creation (Part 1) */}
        {module === 'part-1' && currentStep === 5 && (
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAutofillRole}
              className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Điền nhanh mẫu (TKB_TELLER_CASHIER)
            </button>
          </div>
        )}

        {/* Quick autofill suggestion button for Office creation (Part 2) */}
        {module === 'part-2' && currentStep === 5 && (
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const hasHO = offices.some(o => !o.parentId || o.parentId === 'none' || o.parentId === 'root');
                const headOffice = offices.find(o => !o.parentId || o.parentId === 'none' || o.parentId === 'root');
                const regionalOffice = offices.find(o => o.name.toLowerCase().includes('region') || o.name.toLowerCase().includes('khu vực'));
                const branchOffice = offices.find(o => o.name.toLowerCase().includes('branch') || o.name.toLowerCase().includes('chi nhánh'));

                if (!hasHO) {
                  window.dispatchEvent(new CustomEvent('practice-autofill-office', {
                    detail: {
                      name: 'Takashimaya Bank (TKB) - HO',
                      parentId: 'none',
                      openingDate: '2026-08-01',
                      externalId: 'TKB - HO - 001'
                    }
                  }));
                } else if (!regionalOffice) {
                  window.dispatchEvent(new CustomEvent('practice-autofill-office', {
                    detail: {
                      name: 'TKB - Northern Region Office',
                      parentId: headOffice?.id || '1',
                      openingDate: '2026-08-02',
                      externalId: 'TKB - RO - NORTH'
                    }
                  }));
                } else if (!branchOffice) {
                  window.dispatchEvent(new CustomEvent('practice-autofill-office', {
                    detail: {
                      name: 'Hanoi Branch',
                      parentId: regionalOffice?.id || '2',
                      openingDate: '2026-08-03',
                      externalId: 'TKB - BR - HAN'
                    }
                  }));
                } else {
                  window.dispatchEvent(new CustomEvent('practice-autofill-office', {
                    detail: {
                      name: 'Cau Giay Transaction Office',
                      parentId: branchOffice?.id || '5',
                      openingDate: '2026-08-04',
                      externalId: 'TKB-TO-HAN-02'
                    }
                  }));
                }
              }}
              className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Điền nhanh mẫu đơn vị tiếp theo
            </button>
          </div>
        )}

        {/* Quick autofill suggestion button for User creation */}
        {currentStep === 8 && (
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAutofillUser}
              className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#1072ba] border border-sky-200 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-colors"
            >
              Điền nhanh mẫu user (tkb.teller01)
            </button>
          </div>
        )}

        <div className="pt-1 text-[10px] text-gray-400 flex items-center justify-between">
          <span>
            {(currentStep === 5 && !isRoleFormFilled) || (currentStep === 8 && !isUserFormFilled)
              ? 'Nhập vào ô phía trên hoặc chọn điền nhanh' 
              : 'Nhấn trực tiếp vào vùng phát sáng để tiếp tục'}
          </span>
        </div>
      </div>
    </>
  );
}
