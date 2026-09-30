import React, { useState } from 'react';

export default function CustomerManager({
  customers,
  setCustomers,
  routes,
  collections,
  supplies,
  settings
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('ALL');
  
  // Registration Form State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    phone: '',
    routeId: routes[0]?.id || 'R01',
    bankName: 'Bank of Ceylon',
    accountNumber: '',
  });

  // ID Card Preview Modal State
  const [selectedCustomerForCard, setSelectedCustomerForCard] = useState(null);

  // Customer Detailed Profile Modal
  const [selectedCustomerForProfile, setSelectedCustomerForProfile] = useState(null);

  // Auto-generate next customer ID
  const generateNextId = () => {
    const year = new Date().getFullYear();
    const count = customers.length + 1;
    const formattedCount = String(count).padStart(3, '0');
    return `TEA-${year}-${formattedCount}`;
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Please fill in Customer Full Name and Phone Number');
      return;
    }

    const newCustomer = {
      id: generateNextId(),
      fullName: formData.fullName,
      nic: formData.nic || 'N/A',
      phone: formData.phone,
      routeId: formData.routeId,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber || 'N/A',
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };

    setCustomers([newCustomer, ...customers]);
    setIsRegisterModalOpen(false);
    setFormData({
      fullName: '',
      nic: '',
      phone: '',
      routeId: routes[0]?.id || 'R01',
      bankName: 'Bank of Ceylon',
      accountNumber: '',
    });
    setSelectedCustomerForCard(newCustomer);
  };

  // Filtered customers
  const filteredCustomers = customers.filter(c => {
    const matchesQuery = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.nic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoute = selectedRouteFilter === 'ALL' || c.routeId === selectedRouteFilter;

    return matchesQuery && matchesRoute;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 tea-card p-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tea Supplier / Customer Registry</h2>
          <p className="text-xs text-gray-500">Register smallholder farmers, assign unique IDs, and manage route details</p>
        </div>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2"
        >
          <span>👤+</span>
          <span>Register New Customer & Issue ID</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="🔍 Search by Name, Customer ID (e.g. TEA-2026-001), Phone, or NIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
        <div>
          <select
            value={selectedRouteFilter}
            onChange={(e) => setSelectedRouteFilter(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          >
            <option value="ALL">All Transport Routes</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="tea-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-950 text-emerald-100 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Assigned Transport Route</th>
                <th className="py-3 px-4 text-right">Total Net Leaf (Kg)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 text-xs">
                    No matching customer records found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const route = routes.find(r => r.id === customer.routeId);
                  const custCollections = collections.filter(c => c.customerId === customer.id);
                  const totalLeaf = custCollections.reduce((sum, item) => sum + Number(item.netWeight || 0), 0);

                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded border border-emerald-300">
                          {customer.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 text-sm">{customer.fullName}</div>
                        <div className="text-[10px] text-gray-400">NIC: {customer.nic}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-700">{customer.phone}</td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                          {route?.name || customer.routeId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                        {totalLeaf.toFixed(1)} Kg
                      </td>
                      <td className="py-3.5 px-4 text-center space-x-2">
                        <button
                          onClick={() => setSelectedCustomerForCard(customer)}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded font-semibold text-[11px]"
                          title="View Digital QR ID Card"
                        >
                          💳 ID Card
                        </button>
                        <button
                          onClick={() => setSelectedCustomerForProfile(customer)}
                          className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300 rounded font-semibold text-[11px]"
                          title="View Customer Tea Details & History"
                        >
                          📊 Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Register New Tea Supplier</h3>
                <p className="text-xs text-gray-500">System generated ID: <span className="font-mono font-bold text-emerald-700">{generateNextId()}</span></p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. G. Sunethra Silva"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+94 77 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">NIC / ID Number</label>
                  <input
                    type="text"
                    placeholder="901827462V"
                    value={formData.nic}
                    onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Transport Route *</label>
                <select
                  value={formData.routeId}
                  onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name} (Rs. {r.transportRatePerKg}/kg)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Bank of Ceylon"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 8392014852"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-md"
                >
                  Save & Generate ID Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Digital ID Card Modal */}
      {selectedCustomerForCard && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-900 text-sm">Digital Supplier ID Pass</h3>
              <button
                onClick={() => setSelectedCustomerForCard(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Visual ID Card Graphic */}
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-2xl p-6 shadow-xl border border-emerald-600 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🍃</span>
                  <div>
                    <div className="font-bold text-xs text-white">{settings.factoryName}</div>
                    <div className="text-[9px] text-emerald-300 font-mono">SUPPLIER OFFICIAL ID CARD</div>
                  </div>
                </div>
                <span className="bg-emerald-400 text-emerald-950 font-extrabold text-[10px] px-2 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] text-emerald-300 font-mono">CUSTOMER ID</div>
                  <div className="text-xl font-extrabold text-amber-300 font-mono tracking-wider">
                    {selectedCustomerForCard.id}
                  </div>
                  <div className="text-sm font-bold text-white pt-1">{selectedCustomerForCard.fullName}</div>
                  <div className="text-[11px] text-emerald-200 font-mono">📞 {selectedCustomerForCard.phone}</div>
                </div>

                {/* Simulated QR Code Graphic */}
                <div className="bg-white p-2 rounded-xl shadow-md border-2 border-amber-400 text-center">
                  <div className="w-20 h-20 bg-gray-900 p-1 flex items-center justify-center rounded text-white text-[8px] font-mono leading-none break-all text-center">
                    [QR CODE]<br />
                    {selectedCustomerForCard.id}
                  </div>
                  <span className="text-[8px] text-gray-600 font-bold font-mono">SCAN TO WEIGH</span>
                </div>
              </div>

              <div className="border-t border-emerald-700/60 pt-2 flex items-center justify-between text-[10px] text-emerald-200">
                <span>Route: {routes.find(r => r.id === selectedCustomerForCard.routeId)?.name || 'Central'}</span>
                <span>Issue: {selectedCustomerForCard.registeredDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
              >
                🖨️ Print ID Card
              </button>
              <button
                onClick={() => setSelectedCustomerForCard(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Full Tea Details & History Modal */}
      {selectedCustomerForProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {selectedCustomerForProfile.id}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{selectedCustomerForProfile.fullName}</h3>
                <p className="text-xs text-gray-500">Phone: {selectedCustomerForProfile.phone} | Route: {routes.find(r => r.id === selectedCustomerForProfile.routeId)?.name}</p>
              </div>
              <button
                onClick={() => setSelectedCustomerForProfile(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Profile Statistics */}
            {(() => {
              const custCols = collections.filter(c => c.customerId === selectedCustomerForProfile.id);
              const custSups = supplies.filter(s => s.customerId === selectedCustomerForProfile.id);
              
              const totalGross = custCols.reduce((sum, c) => sum + Number(c.grossWeight || 0), 0);
              const totalNet = custCols.reduce((sum, c) => sum + Number(c.netWeight || 0), 0);
              const grossEarn = totalNet * settings.monthlyRatePerKg;
              const totalSupplies = custSups.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0);

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="text-[10px] text-emerald-700 font-bold uppercase">Net Leaf Delivered</div>
                      <div className="text-lg font-extrabold text-emerald-950 font-mono">{totalNet.toFixed(1)} Kg</div>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="text-[10px] text-amber-700 font-bold uppercase">Gross Leaf Value</div>
                      <div className="text-lg font-extrabold text-amber-950 font-mono">Rs. {grossEarn.toFixed(2)}</div>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <div className="text-[10px] text-rose-700 font-bold uppercase">Issued Advances/Supplies</div>
                      <div className="text-lg font-extrabold text-rose-950 font-mono">Rs. {totalSupplies.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Daily Collection History Table */}
                  <div>
                    <h4 className="font-bold text-xs text-gray-800 mb-2">Leaf Intake Log History</h4>
                    <div className="overflow-x-auto border rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 font-semibold text-gray-600">
                          <tr>
                            <th className="p-2">Date</th>
                            <th className="p-2 text-right">Gross Kg</th>
                            <th className="p-2 text-center">Rain Deduction</th>
                            <th className="p-2 text-right">Net Kg</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {custCols.length === 0 ? (
                            <tr><td colSpan="4" className="p-4 text-center text-gray-400">No collections logged yet.</td></tr>
                          ) : (
                            custCols.map(c => (
                              <tr key={c.id}>
                                <td className="p-2 font-mono">{c.date}</td>
                                <td className="p-2 text-right font-mono">{Number(c.grossWeight).toFixed(1)}</td>
                                <td className="p-2 text-center">
                                  {c.isRainyDay ? <span className="text-blue-600 font-bold">🌧️ -{c.rainDeductionPercent}%</span> : '☀️ Dry'}
                                </td>
                                <td className="p-2 text-right font-mono font-bold text-emerald-700">{Number(c.netWeight).toFixed(1)} Kg</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
}
