import React, { useState } from 'react';

export default function DailyCollection({
  collections,
  setCollections,
  customers,
  settings,
  isGlobalRainy
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [grossWeight, setGrossWeight] = useState('');
  const [tareWeight, setTareWeight] = useState('1.5');
  const [isRainyDay, setIsRainyDay] = useState(isGlobalRainy);
  const [rainDeductionPercent, setRainDeductionPercent] = useState(settings.defaultRainDeductionPercent || 10);
  const [leafGrade, setLeafGrade] = useState('Super (100%)');
  const [notes, setNotes] = useState('');

  // Search filter for collection log table
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate net weight preview live
  const gross = parseFloat(grossWeight) || 0;
  const tare = parseFloat(tareWeight) || 0;
  const rawNet = Math.max(0, gross - tare);
  const rainReductionMultiplier = isRainyDay ? (1 - rainDeductionPercent / 100) : 1.0;
  const calculatedNetWeight = Math.round(rawNet * rainReductionMultiplier * 10) / 10;

  const handleAddCollection = (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Please select or scan a Customer ID');
      return;
    }
    if (gross <= 0) {
      alert('Please enter a valid Gross Weight greater than 0');
      return;
    }

    const newEntry = {
      id: `COL-${Date.now().toString().slice(-6)}`,
      date,
      customerId: selectedCustomerId,
      grossWeight: gross,
      tareWeight: tare,
      isRainyDay,
      rainDeductionPercent: isRainyDay ? Number(rainDeductionPercent) : 0,
      netWeight: calculatedNetWeight,
      grade: leafGrade,
      notes
    };

    setCollections([newEntry, ...collections]);

    // Reset Form (keep customer or clear)
    setGrossWeight('');
    setNotes('');
  };

  const handleDeleteEntry = (id) => {
    if (confirm('Are you sure you want to delete this collection entry?')) {
      setCollections(collections.filter(c => c.id !== id));
    }
  };

  const filteredCollections = collections.filter(col => {
    const cust = customers.find(c => c.id === col.customerId);
    const matchesSearch = 
      col.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust && cust.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDate = !filterDate || col.date === filterDate;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      
      {/* Upper Form Section: Intake & Scale Input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Container (2 Cols) */}
        <div className="lg:col-span-2 tea-card p-6 border-l-4 border-l-emerald-700">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <span>⚖️</span>
                <span>Record Green Tea Leaf Collection</span>
              </h2>
              <p className="text-xs text-gray-500">Log weighbridge gross weight, tare weight, and moisture deductions</p>
            </div>
            
            {/* Quick Weather Status Indicator */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1 ${
              isRainyDay ? 'bg-blue-100 border-blue-300 text-blue-900' : 'bg-amber-100 border-amber-300 text-amber-900'
            }`}>
              <span>{isRainyDay ? '🌧️ Rainy Day Active' : '☀️ Normal Weather'}</span>
            </div>
          </div>

          <form onSubmit={handleAddCollection} className="space-y-4">
            
            {/* Row 1: Date & Customer Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Collection Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Supplier / Scan Customer ID *</label>
                <select
                  required
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-emerald-50/50"
                >
                  <option value="">-- Choose Supplier --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.fullName} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Weight Scale Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Gross Weight (Kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  placeholder="e.g. 65.0"
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-base font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bag Tare Weight (Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={tareWeight}
                  onChange={(e) => setTareWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Leaf Quality Grade</label>
                <select
                  value={leafGrade}
                  onChange={(e) => setLeafGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Super (100%)">Super Tender (100%)</option>
                  <option value="Grade A (95%)">Grade A (95%)</option>
                  <option value="Grade B (90%)">Grade B Coarse (90%)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Rainy Day Water Deduction Engine */}
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRainyDay}
                    onChange={(e) => setIsRainyDay(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-blue-950">
                    🌧️ Apply Rainy Day Wet Leaf Moisture Deduction
                  </span>
                </label>

                {isRainyDay && (
                  <span className="text-xs font-mono font-bold text-blue-800 bg-blue-200 px-2 py-0.5 rounded">
                    -{rainDeductionPercent}% Moisture Deduction
                  </span>
                )}
              </div>

              {isRainyDay && (
                <div className="flex items-center space-x-4 pt-1">
                  <span className="text-xs text-blue-900 font-medium whitespace-nowrap">Water Deduction %:</span>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={rainDeductionPercent}
                    onChange={(e) => setRainDeductionPercent(e.target.value)}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-xs font-mono font-bold text-blue-900 w-12 text-right">
                    {rainDeductionPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Field Notes / Bag Tags</label>
              <input
                type="text"
                placeholder="e.g. Wet leaf, coarse stems, collected from Sector 4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>💾 Log Tea Leaf Intake Entry</span>
            </button>

          </form>
        </div>

        {/* Live Calculation Preview Card (1 Col) */}
        <div className="tea-card p-6 bg-gradient-to-br from-emerald-950 to-emerald-900 text-white flex flex-col justify-between shadow-xl">
          <div>
            <div className="text-xs text-emerald-300 font-mono uppercase tracking-wider mb-2">
              REAL-TIME WEIGHT CALCULATOR
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Calculated Net Payable</h3>

            <div className="space-y-3 font-mono text-xs text-emerald-100 border-t border-emerald-800/80 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Gross Weight:</span>
                <span className="font-bold text-white">{gross.toFixed(1)} Kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Bag Tare Weight:</span>
                <span className="text-amber-300">-{tare.toFixed(1)} Kg</span>
              </div>
              <div className="flex justify-between border-t border-emerald-800/60 pt-2">
                <span className="text-gray-300">Raw Leaf Weight:</span>
                <span className="text-white">{rawNet.toFixed(1)} Kg</span>
              </div>
              {isRainyDay && (
                <div className="flex justify-between text-blue-300 bg-blue-900/40 p-2 rounded">
                  <span>Rain Moisture Deduction ({rainDeductionPercent}%):</span>
                  <span className="font-bold">
                    -{(rawNet * (rainDeductionPercent / 100)).toFixed(1)} Kg
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-emerald-900/90 border border-emerald-500/40 rounded-xl text-center shadow-inner">
              <div className="text-[10px] text-emerald-300 font-mono uppercase">FINAL NET PAYABLE WEIGHT</div>
              <div className="text-4xl font-extrabold text-amber-300 font-mono mt-1">
                {calculatedNetWeight.toFixed(1)} <span className="text-lg text-white">Kg</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-emerald-300/70 border-t border-emerald-800/60 pt-3 font-mono">
            Est. Value: LKR {(calculatedNetWeight * settings.monthlyRatePerKg).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

      </div>

      {/* Intake Log Records Table */}
      <div className="tea-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Tea Leaf Intake Logs</h3>
            <p className="text-xs text-gray-500">Historical daily leaf intake entries</p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-xs font-mono"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Clear Date
              </button>
            )}
            <input
              type="text"
              placeholder="Search Supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 text-gray-600 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-3">Entry ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Supplier Name & ID</th>
                <th className="py-2.5 px-3 text-right">Gross (Kg)</th>
                <th className="py-2.5 px-3 text-right">Tare (Kg)</th>
                <th className="py-2.5 px-3 text-center">Rain Deduct</th>
                <th className="py-2.5 px-3 text-right">Net Kg</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-400">
                    No intake records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCollections.map(c => {
                  const cust = customers.find(cu => cu.id === c.customerId);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-gray-500">{c.id}</td>
                      <td className="py-2.5 px-3 font-mono font-medium">{c.date}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-gray-900">{cust?.fullName || c.customerId}</div>
                        <div className="text-[10px] font-mono text-emerald-700">{c.customerId}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-700">
                        {Number(c.grossWeight).toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-500">
                        -{Number(c.tareWeight).toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {c.isRainyDay ? (
                          <span className="badge-rainy text-[10px] px-2 py-0.5 rounded-full font-bold">
                            🌧️ -{c.rainDeductionPercent}%
                          </span>
                        ) : (
                          <span className="badge-sunny text-[10px] px-2 py-0.5 rounded-full font-medium">
                            ☀️ Dry 0%
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-extrabold text-emerald-800 text-sm">
                        {Number(c.netWeight).toFixed(1)} Kg
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteEntry(c.id)}
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
