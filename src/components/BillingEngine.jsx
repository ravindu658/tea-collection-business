import React, { useState } from 'react';

export default function BillingEngine({
  customers,
  collections,
  supplies,
  settings,
  routes,
  setSettings
}) {
  const [billingMonth, setBillingMonth] = useState('2026-09');
  const [selectedCustomerBill, setSelectedCustomerBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate monthly summary per customer
  const customerBills = customers.map(customer => {
    const route = routes.find(r => r.id === customer.routeId);
    const transportRate = route ? Number(route.transportRatePerKg || 0) : 10;

    // Filter collections for this customer
    const custCollections = collections.filter(c => c.customerId === customer.id);
    
    const grossKg = custCollections.reduce((sum, c) => sum + Number(c.grossWeight || 0), 0);
    const netKg = custCollections.reduce((sum, c) => sum + Number(c.netWeight || 0), 0);
    const rainDeductionKg = grossKg - netKg;

    // Gross Earned
    const grossAmount = netKg * Number(settings.monthlyRatePerKg || 0);

    // Deductions
    const custSupplies = supplies.filter(s => s.customerId === customer.id);
    const suppliesDeduction = custSupplies.reduce((sum, s) => sum + Number(s.totalAmount || 0), 0);
    
    const transportDeduction = netKg * transportRate;
    const welfareFee = netKg > 0 ? Number(settings.welfareFeePerMonth || 150) : 0;
    const stampDuty = netKg > 0 ? Number(settings.stampDutyPerMonth || 50) : 0;

    const totalDeductions = suppliesDeduction + transportDeduction + welfareFee + stampDuty;
    const netPayable = grossAmount - totalDeductions;

    return {
      customer,
      route,
      collectionsCount: custCollections.length,
      grossKg,
      netKg,
      rainDeductionKg,
      grossAmount,
      suppliesDeduction,
      transportDeduction,
      welfareFee,
      stampDuty,
      totalDeductions,
      netPayable,
      custCollections,
      custSupplies
    };
  });

  const filteredBills = customerBills.filter(b => 
    b.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEstateNetKg = customerBills.reduce((sum, b) => sum + b.netKg, 0);
  const totalEstateGrossPayout = customerBills.reduce((sum, b) => sum + b.grossAmount, 0);
  const totalEstateDeductions = customerBills.reduce((sum, b) => sum + b.totalDeductions, 0);
  const totalEstateNetPayable = customerBills.reduce((sum, b) => sum + b.netPayable, 0);

  return (
    <div className="space-y-6">
      
      {/* Monthly Rate Configuration & Summary Header */}
      <div className="tea-card p-6 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-700/60 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧾</span>
              <h2 className="text-xl font-bold">Monthly Tea Payout Calculation Ledger</h2>
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              Final month billing engine & automated supplier net payout generator
            </p>
          </div>

          {/* Month Selector & Factory Rate Setting */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-emerald-900/80 p-2 rounded-xl border border-emerald-600/50 flex items-center space-x-2">
              <span className="text-xs text-emerald-200 font-semibold">Billing Month:</span>
              <input
                type="month"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                className="bg-emerald-950 border border-emerald-600 text-white text-xs px-2 py-1 rounded font-mono"
              />
            </div>

            <div className="bg-amber-950/80 p-2 rounded-xl border border-amber-600/50 flex items-center space-x-2">
              <span className="text-xs text-amber-200 font-semibold">Factory Rate:</span>
              <input
                type="number"
                step="1"
                value={settings.monthlyRatePerKg}
                onChange={(e) => setSettings({ ...settings, monthlyRatePerKg: parseFloat(e.target.value) || 0 })}
                className="bg-amber-900 border border-amber-500 text-amber-300 font-bold text-xs px-2 py-1 rounded font-mono w-24"
              />
              <span className="text-xs text-amber-200 font-bold">LKR/kg</span>
            </div>
          </div>
        </div>

        {/* Ledger Totals Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-center font-mono">
          <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-700/40">
            <div className="text-[10px] text-emerald-300 uppercase">Total Net Leaf</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{totalEstateNetKg.toFixed(1)} Kg</div>
          </div>
          <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-700/40">
            <div className="text-[10px] text-emerald-300 uppercase">Gross Payout Value</div>
            <div className="text-xl font-extrabold text-amber-300 mt-0.5">Rs. {totalEstateGrossPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="p-3 bg-emerald-900/50 rounded-xl border border-emerald-700/40">
            <div className="text-[10px] text-emerald-300 uppercase">Total Deductions</div>
            <div className="text-xl font-extrabold text-rose-300 mt-0.5">Rs. {totalEstateDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-400/40">
            <div className="text-[10px] text-amber-200 uppercase font-bold">Net Estate Payable</div>
            <div className="text-2xl font-extrabold text-amber-300 mt-0.5">Rs. {totalEstateNetPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Customer Billing Ledger Table */}
      <div className="tea-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-base font-bold text-gray-900">Supplier Monthly Payslip Ledger</h3>
          <input
            type="text"
            placeholder="Search Supplier Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-xs w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-950 text-emerald-100 font-semibold uppercase">
              <tr>
                <th className="py-3 px-3">Supplier ID & Name</th>
                <th className="py-3 px-3 text-right">Net Kg</th>
                <th className="py-3 px-3 text-right">Gross Earnings (LKR)</th>
                <th className="py-3 px-3 text-right">Supplies Debit</th>
                <th className="py-3 px-3 text-right">Transport Fee</th>
                <th className="py-3 px-3 text-right">Welfare/Stamp</th>
                <th className="py-3 px-3 text-right">Net Payable Amount</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBills.map((b) => (
                <tr key={b.customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-gray-900">{b.customer.fullName}</div>
                    <div className="text-[10px] font-mono text-emerald-700">{b.customer.id} | Route: {b.route?.name || 'Central'}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-900 text-sm">
                    {b.netKg.toFixed(1)} Kg
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-gray-700">
                    Rs. {b.grossAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-rose-600">
                    -Rs. {b.suppliesDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-rose-600">
                    -Rs. {b.transportDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-gray-500">
                    -Rs. {(b.welfareFee + b.stampDuty).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-sm">
                    <span className={`px-2 py-1 rounded ${
                      b.netPayable >= 0 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      Rs. {b.netPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setSelectedCustomerBill(b)}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[11px] shadow-sm"
                    >
                      🖨️ View & Print Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Official Invoice / Pay Voucher Modal */}
      {selectedCustomerBill && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8" id="printable-bill">
            
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-gray-300 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">🍃</span>
                  <div>
                    <h2 className="text-xl font-extrabold text-emerald-950 uppercase tracking-tight">
                      {settings.factoryName}
                    </h2>
                    <p className="text-xs text-gray-600 font-mono">{settings.address} | Tel: {settings.phone}</p>
                    <p className="text-[10px] text-gray-500 font-mono">Tea Factory Reg No: {settings.registrationNo}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-emerald-900 text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded">
                  OFFICIAL TEA PAYSLIP
                </span>
                <div className="text-xs text-gray-500 font-mono mt-2">Statement Month: {billingMonth}</div>
                <div className="text-xs text-gray-500 font-mono">Date: {new Date().toISOString().split('T')[0]}</div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
              <div>
                <div className="text-gray-500 uppercase font-semibold text-[10px]">Supplier Details</div>
                <div className="font-extrabold text-gray-900 text-sm">{selectedCustomerBill.customer.fullName}</div>
                <div className="font-mono text-emerald-700 font-bold">ID: {selectedCustomerBill.customer.id}</div>
                <div className="text-gray-600">Phone: {selectedCustomerBill.customer.phone}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 uppercase font-semibold text-[10px]">Payment Settlement</div>
                <div className="font-bold text-gray-800">{selectedCustomerBill.customer.bankName}</div>
                <div className="font-mono text-gray-600">Acc: {selectedCustomerBill.customer.accountNumber}</div>
                <div className="text-gray-500 text-[11px]">Route: {selectedCustomerBill.route?.name}</div>
              </div>
            </div>

            {/* Bill Calculation Breakdown Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Financial Breakdown Ledger</h4>
              <table className="w-full text-xs border border-gray-300">
                <thead className="bg-gray-100 font-bold text-gray-700">
                  <tr>
                    <th className="p-2 text-left border-b border-r">Item Description</th>
                    <th className="p-2 text-center border-b border-r">Qty / Rate</th>
                    <th className="p-2 text-right border-b">Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-mono">
                  <tr>
                    <td className="p-2 border-r font-semibold">Total Net Tea Leaf Plucked</td>
                    <td className="p-2 text-center border-r">{selectedCustomerBill.netKg.toFixed(1)} Kg @ LKR {settings.monthlyRatePerKg}/kg</td>
                    <td className="p-2 text-right font-bold text-emerald-900">
                      Rs. {selectedCustomerBill.grossAmount.toFixed(2)}
                    </td>
                  </tr>
                  
                  {/* Deductions */}
                  <tr className="bg-rose-50/50">
                    <td className="p-2 border-r text-rose-900 font-semibold">Less: Supplies & Cash Advances Issued</td>
                    <td className="p-2 text-center border-r text-gray-500">{selectedCustomerBill.custSupplies.length} Store Items</td>
                    <td className="p-2 text-right font-bold text-rose-700">
                      -Rs. {selectedCustomerBill.suppliesDeduction.toFixed(2)}
                    </td>
                  </tr>

                  <tr className="bg-rose-50/50">
                    <td className="p-2 border-r text-rose-900 font-semibold">Less: Transport Fee ({selectedCustomerBill.route?.name})</td>
                    <td className="p-2 text-center border-r text-gray-500">LKR {selectedCustomerBill.route?.transportRatePerKg || 10}/kg</td>
                    <td className="p-2 text-right font-bold text-rose-700">
                      -Rs. {selectedCustomerBill.transportDeduction.toFixed(2)}
                    </td>
                  </tr>

                  <tr className="bg-rose-50/50">
                    <td className="p-2 border-r text-rose-900 font-semibold">Less: Tea Welfare Levy & Government Stamp Duty</td>
                    <td className="p-2 text-center border-r text-gray-500">Fixed Monthly Fees</td>
                    <td className="p-2 text-right font-bold text-rose-700">
                      -Rs. {(selectedCustomerBill.welfareFee + selectedCustomerBill.stampDuty).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-emerald-950 text-white font-mono">
                  <tr>
                    <td colSpan="2" className="p-3 text-right font-extrabold uppercase text-xs">
                      FINAL NET PAYABLE TO SUPPLIER:
                    </td>
                    <td className="p-3 text-right font-extrabold text-amber-300 text-base">
                      LKR {selectedCustomerBill.netPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signature & Seal Block */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-300 text-xs">
              <div className="text-center">
                <div className="border-b border-gray-400 pb-8"></div>
                <p className="mt-1 font-semibold text-gray-700">Prepared by Factory Accountant</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-400 pb-8"></div>
                <p className="mt-1 font-semibold text-gray-700">Supplier Signature / Thumb Print</p>
              </div>
            </div>

            {/* Modal Controls (No print class) */}
            <div className="flex items-center justify-between pt-4 border-t no-print">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md"
              >
                🖨️ Print Pay Voucher / Save PDF
              </button>
              <button
                onClick={() => setSelectedCustomerBill(null)}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-300"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
