import React, { useState } from 'react';

export default function SuppliesManager({
  supplies,
  setSupplies,
  customers
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Fertilizer');
  const [itemName, setItemName] = useState('T-200 Tea Fertilizer 50kg');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('6500.00');
  const [searchQuery, setSearchQuery] = useState('');

  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  const totalAmount = Math.round(qty * price * 100) / 100;

  const handleAddSupply = (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Please select a Supplier/Customer');
      return;
    }
    if (totalAmount <= 0) {
      alert('Total amount must be greater than 0');
      return;
    }

    const newSupply = {
      id: `SUP-${Date.now().toString().slice(-5)}`,
      date,
      customerId: selectedCustomerId,
      category,
      itemName,
      quantity: qty,
      unitPrice: price,
      totalAmount
    };

    setSupplies([newSupply, ...supplies]);

    // Reset form
    setItemName('');
    setQuantity('1');
    setUnitPrice('');
  };

  const handleDeleteSupply = (id) => {
    if (confirm('Delete this supply record?')) {
      setSupplies(supplies.filter(s => s.id !== id));
    }
  };

  const filteredSupplies = supplies.filter(s => {
    const cust = customers.find(c => c.id === s.customerId);
    return (
      s.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust && cust.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Supplies Entry Form */}
      <div className="tea-card p-6 border-l-4 border-l-rose-600">
        <div className="border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <span>📦</span>
            <span>Issue Customer Supplies & Cash Advances</span>
          </h2>
          <p className="text-xs text-gray-500">Log fertilizer, tea sacks, agro-chemicals, or cash advances to be deducted from monthly payouts</p>
        </div>

        <form onSubmit={handleAddSupply} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Issue Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Supplier / Customer *</label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-rose-500"
              >
                <option value="">-- Choose Supplier --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs font-medium"
              >
                <option value="Fertilizer">Fertilizer</option>
                <option value="Cash Advance">Cash Advance</option>
                <option value="Equipment">Equipment / Bags</option>
                <option value="Chemicals">Agro-Chemicals</option>
                <option value="Groceries">Estate Groceries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Item Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Urea 50kg, Mid-month Cash"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Unit Price (LKR)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Amount Summary */}
          <div className="flex items-center justify-between bg-rose-50 p-4 rounded-xl border border-rose-200">
            <div>
              <span className="text-xs text-rose-900 font-bold uppercase">Total Deduction Amount:</span>
              <div className="text-2xl font-extrabold text-rose-950 font-mono">
                Rs. {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              + Record Issued Debit
            </button>
          </div>
        </form>
      </div>

      {/* Supplies History Table */}
      <div className="tea-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Issued Supplies & Cash Advance Debits Log</h3>
            <p className="text-xs text-gray-500">Track all items issued to suppliers during the billing month</p>
          </div>
          <input
            type="text"
            placeholder="Search Supplier or Item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-xs w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 font-semibold text-gray-600 uppercase">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Supplier ID & Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Total Debit (LKR)</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSupplies.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-400">
                    No issued supply transactions found.
                  </td>
                </tr>
              ) : (
                filteredSupplies.map(s => {
                  const cust = customers.find(c => c.id === s.customerId);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-gray-500">{s.date}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{cust?.fullName || s.customerId}</div>
                        <div className="text-[10px] font-mono text-rose-700">{s.customerId}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-800">{s.itemName}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{s.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-600">
                        Rs. {Number(s.unitPrice).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700 text-sm">
                        Rs. {Number(s.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteSupply(s.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold hover:underline"
                        >
                          Delete
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

    </div>
  );
}
