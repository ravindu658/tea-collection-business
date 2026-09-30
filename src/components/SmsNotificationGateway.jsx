import React, { useState } from 'react';

export default function SmsNotificationGateway({
  customers,
  collections,
  supplies,
  settings,
  routes,
  setSettings
}) {
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [isSending, setIsSending] = useState(false);
  const [sentLogs, setSentLogs] = useState([
    {
      id: 'LOG-901',
      time: '2026-09-30 08:30 AM',
      customerName: 'K. G. Ranbanda',
      phone: '+94771234567',
      status: 'DELIVERED',
      message: 'Dear K. G. Ranbanda, your Tea Payout for 2026-09 is Rs. 16,948.00. Net Leaf: 144.4 kg. Factory Rate: Rs. 245/kg. Thank you! - Highland Crest Tea'
    }
  ]);

  // Compute bill details for selected customer for SMS preview
  const currentCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const route = routes.find(r => r.id === currentCustomer?.routeId);
  const transportRate = route ? Number(route.transportRatePerKg || 0) : 10;

  const custCollections = collections.filter(c => c.customerId === currentCustomer?.id);
  const netKg = custCollections.reduce((sum, c) => sum + Number(c.netWeight || 0), 0);
  const grossAmount = netKg * Number(settings.monthlyRatePerKg || 0);

  const custSupplies = supplies.filter(s => s.customerId === currentCustomer?.id);
  const suppliesDeduction = custSupplies.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0);
  const transportDeduction = netKg * transportRate;
  const welfareFee = netKg > 0 ? Number(settings.welfareFeePerMonth || 150) : 0;
  const stampDuty = netKg > 0 ? Number(settings.stampDutyPerMonth || 50) : 0;

  const totalDeductions = suppliesDeduction + transportDeduction + welfareFee + stampDuty;
  const netPayable = grossAmount - totalDeductions;

  // Render preview SMS message
  const renderSmsText = () => {
    if (!currentCustomer) return '';
    return settings.smsTemplate
      .replace('{NAME}', currentCustomer.fullName)
      .replace('{MONTH}', selectedMonth)
      .replace('{NET_KG}', netKg.toFixed(1))
      .replace('{RATE}', settings.monthlyRatePerKg)
      .replace('{GROSS_PAY}', grossAmount.toFixed(2))
      .replace('{DEDUCTIONS}', totalDeductions.toFixed(2))
      .replace('{NET_PAYOUT}', netPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleSendSingleSms = () => {
    setIsSending(true);
    setTimeout(() => {
      const newLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        time: new Date().toLocaleString(),
        customerName: currentCustomer.fullName,
        phone: currentCustomer.phone,
        status: 'DELIVERED',
        message: renderSmsText()
      };
      setSentLogs([newLog, ...sentLogs]);
      setIsSending(false);
      alert(`SMS successfully dispatched to ${currentCustomer.fullName} (${currentCustomer.phone})!`);
    }, 800);
  };

  const handleBroadcastAllSms = () => {
    if (confirm(`Send monthly payout SMS alerts to all ${customers.length} registered tea suppliers?`)) {
      setIsSending(true);
      setTimeout(() => {
        const newLogs = customers.map(c => ({
          id: `LOG-${Math.floor(Math.random() * 9000 + 1000)}`,
          time: new Date().toLocaleString(),
          customerName: c.fullName,
          phone: c.phone,
          status: 'DELIVERED',
          message: settings.smsTemplate.replace('{NAME}', c.fullName).replace('{MONTH}', selectedMonth)
        }));
        setSentLogs([...newLogs, ...sentLogs]);
        setIsSending(false);
        alert(`Bulk SMS Broadcast complete! ${customers.length} SMS messages dispatched.`);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="tea-card p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📱</span>
            <h2 className="text-xl font-bold">Customer SMS & WhatsApp Notification Gateway</h2>
          </div>
          <p className="text-xs text-blue-200 mt-1">
            Dispatch automated monthly payout summaries & bill statements to suppliers' mobile phones
          </p>
        </div>

        <button
          onClick={handleBroadcastAllSms}
          disabled={isSending}
          className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold rounded-xl text-xs shadow-lg transition-all flex items-center space-x-2"
        >
          <span>🚀</span>
          <span>{isSending ? 'Sending Bulk SMS...' : `Broadcast SMS to All (${customers.length}) Suppliers`}</span>
        </button>
      </div>

      {/* Grid: SMS Editor & Phone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Template Config & Selector (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SMS Template Settings */}
          <div className="tea-card p-6 border-l-4 border-l-blue-600 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b pb-2">
              SMS Message Template Configuration
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">SMS Template Pattern</label>
              <textarea
                rows="3"
                value={settings.smsTemplate}
                onChange={(e) => setSettings({ ...settings, smsTemplate: e.target.value })}
                className="w-full p-3 border rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-1.5 mt-2 text-[10px] text-blue-900 font-mono">
                <span className="bg-blue-100 px-2 py-0.5 rounded font-bold">{'{NAME}'}</span>
                <span className="bg-blue-100 px-2 py-0.5 rounded font-bold">{'{MONTH}'}</span>
                <span className="bg-blue-100 px-2 py-0.5 rounded font-bold">{'{NET_KG}'}</span>
                <span className="bg-blue-100 px-2 py-0.5 rounded font-bold">{'{RATE}'}</span>
                <span className="bg-blue-100 px-2 py-0.5 rounded font-bold">{'{GROSS_PAY}'}</span>
                <span className="bg-blue-100 px-2 py-0.5 rounded font-bold">{'{DEDUCTIONS}'}</span>
                <span className="bg-blue-100 px-2 py-0.5 rounded font-bold">{'{NET_PAYOUT}'}</span>
              </div>
            </div>

            {/* Test Recipient Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Preview Recipient Supplier</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Billing Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSendSingleSms}
              disabled={isSending}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center space-x-2"
            >
              <span>📲 Dispatch SMS to {currentCustomer?.fullName}</span>
            </button>
          </div>

          {/* Delivery Logs */}
          <div className="tea-card p-5 space-y-3">
            <h3 className="text-base font-bold text-gray-900 border-b pb-2">Recent Dispatched SMS Activity Log</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {sentLogs.map(log => (
                <div key={log.id} className="p-3 bg-gray-50 border rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] border-b pb-1">
                    <span className="font-bold text-gray-900">{log.customerName} ({log.phone})</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                      ✓ {log.status}
                    </span>
                  </div>
                  <p className="text-gray-600 font-mono text-[11px] leading-relaxed">{log.message}</p>
                  <div className="text-[9px] text-gray-400 font-mono">{log.time}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Smartphone Simulator Preview (1 Col) */}
        <div className="flex justify-center">
          <div className="w-72 bg-gray-900 rounded-[36px] p-3 shadow-2xl border-4 border-gray-800 relative">
            
            {/* Phone Speaker & Camera Notch */}
            <div className="w-24 h-4 bg-gray-950 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-800"></div>
            </div>

            {/* Screen Area */}
            <div className="bg-slate-100 rounded-[28px] p-4 text-xs font-sans h-[480px] flex flex-col justify-between overflow-hidden border border-gray-300">
              
              {/* Header bar */}
              <div className="border-b pb-2 flex items-center justify-between text-gray-600">
                <span className="font-bold text-[10px] text-emerald-800">🍃 Tea Alert SMS</span>
                <span className="text-[10px] font-mono">NOW</span>
              </div>

              {/* Chat Bubble */}
              <div className="space-y-3 my-auto">
                <div className="text-[9px] text-center text-gray-400 font-mono uppercase">SMS Message</div>
                <div className="bg-emerald-800 text-white p-3.5 rounded-2xl rounded-tl-xs shadow-md text-[11px] font-mono leading-relaxed border border-emerald-700">
                  {renderSmsText()}
                </div>
              </div>

              {/* Phone Footer Bar */}
              <div className="pt-2 text-center text-[10px] text-gray-400 border-t font-mono">
                SMS Gateway • Connected
              </div>
            </div>

            {/* Home Bar */}
            <div className="w-24 h-1 bg-gray-700 rounded-full mx-auto mt-3"></div>
          </div>
        </div>

      </div>

    </div>
  );
}
