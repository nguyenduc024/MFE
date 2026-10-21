import React, { useState } from 'react';
import { 
  Plus, Upload, X, ChevronDown, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Users, Check
} from 'lucide-react';

export default function ClientsView({ 
  clients = [], 
  offices = [], 
  onAddClient, 
  onSelectClient,
  onNavigateHome,
  onNavigateCreateClient
}) {
  const [filterText, setFilterText] = useState('');
  const [showClosed, setShowClosed] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Form State for creating a client
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    officeId: '26', // Thu Duc TO
    mobileNo: '0909888999',
    externalId: ''
  });

  // Filter clients
  const filteredClients = clients.filter(c => {
    // If showClosed is false, hide closed clients (if any)
    if (!showClosed && c.status === 'Closed') return false;

    const query = filterText.toLowerCase().trim();
    if (!query) return true;

    return (
      c.displayName.toLowerCase().includes(query) ||
      c.accountNo.includes(query) ||
      (c.externalId || '').toLowerCase().includes(query) ||
      (c.mobileNo || '').includes(query)
    );
  });

  // Sort descending by accountNo to match the exact order in the screenshot (000000012 down to 000000001)
  const sortedClients = [...filteredClients].sort((a, b) => 
    b.accountNo.localeCompare(a.accountNo)
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstname.trim() || !formData.lastname.trim()) return;

    const office = offices.find(o => o.id === formData.officeId);
    const nextAccountNo = String(clients.length + 1).padStart(9, '0');

    const newClient = {
      id: String(Date.now()),
      accountNo: nextAccountNo,
      externalId: formData.externalId || `TKB-CUS-${nextAccountNo.slice(-3)}`,
      displayName: `${formData.firstname} ${formData.lastname}`,
      firstname: formData.firstname,
      lastname: formData.lastname,
      officeId: formData.officeId,
      officeName: office ? office.name : 'Takashimaya Bank (TKB) - HO',
      status: 'Active',
      activationDate: new Date().toISOString().split('T')[0],
      mobileNo: formData.mobileNo
    };

    onAddClient(newClient);
    setShowAddModal(false);
    setFormData({
      firstname: '',
      lastname: '',
      officeId: '26',
      mobileNo: '0909888999',
      externalId: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 select-none font-sans">
      {/* Title & Breadcrumb (Matches Image: "Clients | Home / Clients") */}
      <div className="flex items-center space-x-3 mb-5">
        <h1 className="text-xl font-normal text-gray-800">
          Clients
        </h1>
        <div className="text-xs text-gray-500 flex items-center space-x-1.5">
          <span 
            onClick={() => onNavigateHome && onNavigateHome()} 
            className="text-[#1072ba] hover:underline cursor-pointer"
          >
            Home
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">Clients</span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-xs shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 p-6 space-y-4">
        {/* Top Controls: Search Input, Show Closed Checkbox, Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          {/* Left: Search input with bottom border & Checkbox */}
          <div className="flex items-center space-x-6">
            <div className="relative border-b border-gray-300 focus-within:border-[#1072ba] transition-colors pt-3 pb-1 w-80">
              <label
                className={`absolute left-0 transition-all duration-200 pointer-events-none origin-[0] select-none ${
                  filterText || isSearchFocused
                    ? '-top-0.5 text-[10px] ' + (isSearchFocused ? 'text-[#1072ba] font-medium' : 'text-gray-500')
                    : 'top-3 text-xs text-gray-400'
                }`}
              >
                Search by client name, external id, mobile
              </label>
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full text-xs text-gray-800 bg-transparent outline-none pt-0.5"
              />
            </div>

            <label className="inline-flex items-center space-x-2 text-xs text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showClosed}
                onChange={(e) => setShowClosed(e.target.checked)}
                className="rounded border-gray-300 text-[#1072ba] focus:ring-0"
              />
              <span>Show Closed Accounts</span>
            </label>
          </div>

          {/* Right: Import Client & + Create Client buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-[#186fa8] hover:bg-[#135d8e] text-white text-xs font-medium px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Client</span>
            </button>

            <button
              id="tour-create-client-btn"
              onClick={() => onNavigateCreateClient ? onNavigateCreateClient() : setShowAddModal(true)}
              className="bg-[#1072ba] hover:bg-[#0d5f9c] text-white text-xs font-medium px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Client</span>
            </button>
          </div>
        </div>

        {/* Clients Table (Matches Exact 5 Columns: Name | Account No. | External Id | Status | Office Name) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2.5 px-4 text-xs font-medium text-gray-600">Name</th>
                <th className="py-2.5 px-4 text-xs font-medium text-gray-600">Account No.</th>
                <th className="py-2.5 px-4 text-xs font-medium text-gray-600">External Id</th>
                <th className="py-2.5 px-4 text-xs font-medium text-gray-600">Status</th>
                <th className="py-2.5 px-4 text-xs font-medium text-gray-600">Office Name</th>
              </tr>
            </thead>
            <tbody>
              {sortedClients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400 text-xs">
                    No clients found.
                  </td>
                </tr>
              ) : (
                sortedClients.map((client, idx) => {
                  const isEven = idx % 2 === 1;
                  const isActive = client.status === 'Active';
                  const statusLabel = isActive ? 'Active' : 'Pending';

                  return (
                    <tr 
                      key={client.id}
                      id={
                        client.accountNo === '000000011' || client.externalId === 'TKB-CIF-TDU-001' || client.displayName?.toLowerCase().includes('minh quang tran') 
                          ? 'tour-client-row-minh' 
                          : client.accountNo === '000000012' || client.externalId === 'TKB-CIF-TDU-002' || client.displayName?.toLowerCase().includes('lan ngoc pham')
                          ? 'tour-client-row-lan'
                          : undefined
                      }
                      onClick={() => onSelectClient && onSelectClient(client)}
                      className={`cursor-pointer transition-colors ${
                        isEven ? 'bg-[#f5f6f8]' : 'bg-white'
                      } hover:bg-[#eef2f6]`}
                    >
                      <td className="py-2.5 px-4 text-xs text-gray-800">
                        {client.displayName}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-800 font-mono">
                        {client.accountNo}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-800">
                        {client.externalId || ''}
                      </td>
                      <td className="py-2.5 px-4 text-xs">
                        <div className="flex items-center space-x-2">
                          <span 
                            className={`inline-block w-2.5 h-2.5 rounded-[1px] ${
                              isActive ? 'bg-[#5cb85c]' : 'bg-[#f0ad4e]'
                            }`}
                          />
                          <span className="text-gray-800">{statusLabel}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-700">
                        {client.officeName}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (Matches Image: "Items per page: 50 ▼  1 - 12 of 12  |< < > >|") */}
        <div className="flex items-center justify-end space-x-6 text-xs text-gray-500 pt-4 pb-1 select-none">
          <div className="flex items-center space-x-2">
            <span>Items per page:</span>
            <div className="relative inline-flex items-center border-b border-gray-400 pb-0.5">
              <select 
                value={itemsPerPage} 
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-transparent text-gray-700 font-medium outline-none cursor-pointer pr-4 appearance-none text-xs"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-500 absolute right-0 pointer-events-none" />
            </div>
          </div>

          <div>
            1 - {sortedClients.length} of {sortedClients.length}
          </div>

          <div className="flex items-center space-x-3 text-gray-400">
            <button className="hover:text-gray-700 disabled:opacity-40" disabled title="First Page">
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button className="hover:text-gray-700 disabled:opacity-40" disabled title="Previous Page">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="hover:text-gray-700 disabled:opacity-40" disabled title="Next Page">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="hover:text-gray-700 disabled:opacity-40" disabled title="Last Page">
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xs shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-[#1072ba] text-white flex items-center justify-between">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Create Client</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Van B"
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#1072ba]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nguyen"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#1072ba]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Office *</label>
                  <select
                    value={formData.officeId}
                    onChange={(e) => setFormData({ ...formData, officeId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#1072ba] bg-white"
                  >
                    {offices.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-medium">External ID (CIF) *</label>
                  <input
                    type="text"
                    placeholder="e.g. TKB-CIF-TDU-003"
                    value={formData.externalId}
                    onChange={(e) => setFormData({ ...formData, externalId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#1072ba] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">Mobile No</label>
                <input
                  type="text"
                  placeholder="e.g. 0912345678"
                  value={formData.mobileNo}
                  onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#1072ba] font-mono"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 rounded font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1072ba] hover:bg-[#0d5f9c] text-white px-4 py-1.5 rounded font-medium shadow-xs"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Client Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xs shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-[#186fa8] text-white flex items-center justify-between">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Import Client</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-white hover:opacity-80">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-gray-700">
              <p>Select Excel / CSV file containing client demographic data to batch import:</p>
              <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-[#1072ba] cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-xs text-gray-500">Drag and drop file here, or browse</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Client batch template downloaded!');
                    setShowImportModal(false);
                  }}
                  className="bg-[#186fa8] hover:bg-[#135d8e] text-white px-4 py-1.5 rounded"
                >
                  Download Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
