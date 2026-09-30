import React from 'react';

export default function Navbar({ activeTab, setActiveTab, settings, isGlobalRainy, setIsGlobalRainy }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'customers', label: 'Customers & IDs', icon: '👨‍🌾' },
    { id: 'collection', label: 'Daily Leaf Intake', icon: '🍃' },
    { id: 'supplies', label: 'Supplies & Advances', icon: '📦' },
    { id: 'billing', label: 'Monthly Billing & Bills', icon: '🧾' },
    { id: 'sms', label: 'SMS Alerts', icon: '📱' },
    { id: 'settings', label: 'Settings & Rates', icon: '⚙️' },
  ];

  return (
    <header className="glass-header text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner">
              🍃
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                  {settings.factoryName || 'HIGHLAND TEA ESTATE'}
                </h1>
                <span className="text-xs bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-medium">
                  PRO SYSTEM
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 font-mono">
                Reg No: {settings.registrationNo} | Factory Rate: <span className="text-amber-300 font-bold">LKR {settings.monthlyRatePerKg}/kg</span>
              </p>
            </div>
          </div>

          {/* Rainy Day Global Quick Toggle */}
          <div className="hidden lg:flex items-center bg-emerald-950/60 border border-emerald-700/50 rounded-xl p-2 space-x-3">
            <div className="text-right">
              <div className="text-xs text-emerald-200 font-medium">Weather Status</div>
              <div className="text-xs text-gray-300 font-mono">
                {isGlobalRainy ? '🌧️ Wet Leaf (Rain Deduction Active)' : '☀️ Clear Weather (Standard Pluck)'}
              </div>
            </div>
            <button
              onClick={() => setIsGlobalRainy(!isGlobalRainy)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-sm ${
                isGlobalRainy
                  ? 'bg-blue-600 text-white hover:bg-blue-500 ring-2 ring-blue-300/40'
                  : 'bg-amber-500 text-amber-950 hover:bg-amber-400'
              }`}
            >
              <span>{isGlobalRainy ? '🌧️ Rain Mode ON (-10%)' : '☀️ Rain Mode OFF'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-3 pt-1 scrollbar-none border-t border-emerald-800/40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-md font-semibold ring-1 ring-emerald-300/50'
                  : 'text-emerald-100/80 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
}
