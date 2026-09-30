import React, { useState } from 'react';

export default function SettingsManager({
  settings,
  setSettings,
  routes,
  setRoutes
}) {
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteRate, setNewRouteRate] = useState('12.00');

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newRouteName) return;

    const newRoute = {
      id: `R0${routes.length + 1}`,
      name: newRouteName,
      transportRatePerKg: parseFloat(newRouteRate) || 10
    };

    setRoutes([...routes, newRoute]);
    setNewRouteName('');
    setNewRouteRate('12.00');
  };

  const handleUpdateRouteRate = (id, newRate) => {
    setRoutes(routes.map(r => r.id === id ? { ...r, transportRatePerKg: parseFloat(newRate) || 0 } : r));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="tea-card p-6 border-l-4 border-l-gray-800">
        <h2 className="text-xl font-bold text-gray-900">System Parameters & Factory Configuration</h2>
        <p className="text-xs text-gray-500">Manage factory rates, route transport costs, and default moisture deduction rules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Factory Profile & Financial Rules */}
        <div className="tea-card p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b pb-2">Factory Information & Base Rates</h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Factory Name</label>
            <input
              type="text"
              value={settings.factoryName}
              onChange={(e) => setSettings({ ...settings, factoryName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-xs font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Registration No</label>
              <input
                type="text"
                value={settings.registrationNo}
                onChange={(e) => setSettings({ ...settings, registrationNo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 border-t pt-3">
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-1">Monthly Factory Rate (LKR / Kg)</label>
              <input
                type="number"
                step="1"
                value={settings.monthlyRatePerKg}
                onChange={(e) => setSettings({ ...settings, monthlyRatePerKg: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-amber-400 bg-amber-50 rounded-lg text-xs font-mono font-bold text-amber-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-900 mb-1">Default Rain Deduction %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="30"
                value={settings.defaultRainDeductionPercent}
                onChange={(e) => setSettings({ ...settings, defaultRainDeductionPercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-blue-400 bg-blue-50 rounded-lg text-xs font-mono font-bold text-blue-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t pt-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Monthly Welfare Levy (LKR)</label>
              <input
                type="number"
                value={settings.welfareFeePerMonth}
                onChange={(e) => setSettings({ ...settings, welfareFeePerMonth: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stamp Duty (LKR)</label>
              <input
                type="number"
                value={settings.stampDutyPerMonth}
                onChange={(e) => setSettings({ ...settings, stampDutyPerMonth: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Route Transport Rates Configuration */}
        <div className="tea-card p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b pb-2">Transport Routes & Transport Cost per Kg</h3>

          {/* Add New Route Form */}
          <form onSubmit={handleAddRoute} className="flex gap-2 bg-gray-50 p-3 rounded-xl border">
            <input
              type="text"
              required
              placeholder="New Route Name..."
              value={newRouteName}
              onChange={(e) => setNewRouteName(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-xs flex-1"
            />
            <input
              type="number"
              step="0.5"
              placeholder="Rate/kg"
              value={newRouteRate}
              onChange={(e) => setNewRouteRate(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-xs w-24 font-mono font-bold"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
            >
              + Add Route
            </button>
          </form>

          {/* Route List */}
          <div className="space-y-3 pt-2">
            {routes.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-white border rounded-xl shadow-xs">
                <div>
                  <div className="font-bold text-xs text-gray-900">{r.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">Route ID: {r.id}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 font-medium">Rate:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={r.transportRatePerKg}
                    onChange={(e) => handleUpdateRouteRate(r.id, e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-xs font-mono font-bold text-emerald-800 text-right"
                  />
                  <span className="text-xs text-gray-600 font-mono">LKR/kg</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
