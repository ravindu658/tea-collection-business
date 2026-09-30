import React from 'react';

export default function Dashboard({
  customers,
  collections,
  supplies,
  settings,
  routes,
  setActiveTab,
  isGlobalRainy
}) {
  // Calculations for current period
  const totalGrossKg = collections.reduce((sum, item) => sum + Number(item.grossWeight || 0), 0);
  const totalNetKg = collections.reduce((sum, item) => sum + Number(item.netWeight || 0), 0);
  const totalRainDeductionKg = totalGrossKg - totalNetKg;
  
  const estimatedGrossPayout = totalNetKg * settings.monthlyRatePerKg;
  const totalSuppliesAmount = supplies.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
  
  const rainyCollectionsCount = collections.filter(c => c.isRainyDay).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert */}
      <div className={`p-4 rounded-xl border shadow-sm flex items-center justify-between transition-all ${
        isGlobalRainy
          ? 'bg-blue-50 border-blue-200 text-blue-900'
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{isGlobalRainy ? '🌧️' : '☀️'}</div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">
              {isGlobalRainy
                ? 'Rainy Weather Deduction Mode Active'
                : 'Clear Weather Collection Mode'}
            </h3>
            <p className="text-xs text-gray-600">
              {isGlobalRainy
                ? `Daily collections will automatically apply a ${settings.defaultRainDeductionPercent}% wet leaf moisture weight reduction.`
                : 'Standard green leaf collection weight without moisture penalty.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('collection')}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow transition-all"
        >
          + Add Today's Collection
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Net Leaf Collected */}
        <div className="tea-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Net Green Leaf</span>
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg text-lg">🍃</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-950 font-mono">
              {totalNetKg.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
            <span className="text-sm font-semibold text-emerald-700">Kg</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 flex items-center justify-between border-t pt-2">
            <span>Gross: {totalGrossKg.toFixed(1)} Kg</span>
            <span className="text-blue-600 font-medium">Wet Deducted: -{totalRainDeductionKg.toFixed(1)} Kg</span>
          </p>
        </div>

        {/* Estimated Monthly Gross Payout */}
        <div className="tea-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Leaf Payout</span>
            <span className="p-2 bg-amber-100 text-amber-800 rounded-lg text-lg">💰</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-950 font-mono">
              Rs. {estimatedGrossPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500 flex items-center justify-between border-t pt-2">
            <span>Current Rate:</span>
            <span className="font-bold text-amber-800">LKR {settings.monthlyRatePerKg.toFixed(2)} / Kg</span>
          </p>
        </div>

        {/* Total Active Farmers / Customers */}
        <div className="tea-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Suppliers</span>
            <span className="p-2 bg-indigo-100 text-indigo-800 rounded-lg text-lg">👨‍🌾</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-indigo-950 font-mono">{customers.length}</span>
            <span className="text-xs text-indigo-600 font-medium">Active Accounts</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 flex items-center justify-between border-t pt-2">
            <span>Routes Managed:</span>
            <span className="font-semibold text-gray-700">{routes.length} Active Routes</span>
          </p>
        </div>

        {/* Total Issued Supplies & Advances */}
        <div className="tea-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplies & Cash Debits</span>
            <span className="p-2 bg-rose-100 text-rose-800 rounded-lg text-lg">📦</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-950 font-mono">
              Rs. {totalSuppliesAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500 flex items-center justify-between border-t pt-2">
            <span>Issued Items:</span>
            <span className="font-semibold text-rose-700">{supplies.length} Transactions</span>
          </p>
        </div>

      </div>

      {/* Quick Action Grid & Recent Intake */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Daily Leaf Collections Table (2 Cols) */}
        <div className="lg:col-span-2 tea-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Tea Leaf Collections</h2>
              <p className="text-xs text-gray-500">Live intake entries from estate weighbridges</p>
            </div>
            <button
              onClick={() => setActiveTab('collection')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              View All Logged Bags →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer ID & Name</th>
                  <th className="py-2.5 px-3 text-right">Gross (Kg)</th>
                  <th className="py-2.5 px-3 text-center">Weather Mode</th>
                  <th className="py-2.5 px-3 text-right">Net Payable (Kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {collections.slice(0, 5).map((col) => {
                  const customer = customers.find(c => c.id === col.customerId);
                  return (
                    <tr key={col.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-gray-600">{col.date}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-gray-900">{customer?.fullName || col.customerId}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{col.customerId}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium text-gray-700">
                        {Number(col.grossWeight).toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {col.isRainyDay ? (
                          <span className="badge-rainy text-[10px] px-2 py-0.5 rounded-full font-bold">
                            🌧️ Rainy (-{col.rainDeductionPercent}%)
                          </span>
                        ) : (
                          <span className="badge-sunny text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            ☀️ Dry Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 text-sm">
                        {Number(col.netWeight).toFixed(1)} Kg
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations Sidebar (1 Col) */}
        <div className="tea-card p-5 space-y-4 bg-gradient-to-b from-white to-gray-50">
          <h2 className="text-base font-bold text-gray-900 border-b pb-2">Quick Management Panel</h2>

          {/* Shortcut 1 */}
          <div
            onClick={() => setActiveTab('collection')}
            className="p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl cursor-pointer transition-all flex items-center space-x-3"
          >
            <span className="text-2xl">⚖️</span>
            <div>
              <div className="font-bold text-xs text-emerald-950">Record Leaf Weight</div>
              <div className="text-[11px] text-emerald-700">Log daily gross & tare weights with wet leaf reduction</div>
            </div>
          </div>

          {/* Shortcut 2 */}
          <div
            onClick={() => setActiveTab('customers')}
            className="p-3 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-xl cursor-pointer transition-all flex items-center space-x-3"
          >
            <span className="text-2xl">🆔</span>
            <div>
              <div className="font-bold text-xs text-indigo-950">Register New Customer</div>
              <div className="text-[11px] text-indigo-700">Issue Customer ID & printable QR ID Card</div>
            </div>
          </div>

          {/* Shortcut 3 */}
          <div
            onClick={() => setActiveTab('billing')}
            className="p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl cursor-pointer transition-all flex items-center space-x-3"
          >
            <span className="text-2xl">🧾</span>
            <div>
              <div className="font-bold text-xs text-amber-950">Generate Monthly Bills</div>
              <div className="text-[11px] text-amber-700">Calculate net payable balances & print pay vouchers</div>
            </div>
          </div>

          {/* Shortcut 4 */}
          <div
            onClick={() => setActiveTab('sms')}
            className="p-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl cursor-pointer transition-all flex items-center space-x-3"
          >
            <span className="text-2xl">📱</span>
            <div>
              <div className="font-bold text-xs text-blue-950">Send Monthly Payment SMS</div>
              <div className="text-[11px] text-blue-700">Notify suppliers via automated mobile SMS</div>
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-gray-400 font-mono">
            System Status: Industry Mode Online • Database Synced
          </div>
        </div>

      </div>

    </div>
  );
}
