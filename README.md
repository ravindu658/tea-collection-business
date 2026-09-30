# 🍃 Tea Collection & Payout Management System

An industry-grade web application tailored for tea factories, leaf collecting centers, and estate agents to manage daily green tea leaf collections, smallholder farmer registrations, rainy day wet-leaf deductions, agricultural supplies & cash advances, and automated monthly net payout ledgers.

---

## ✨ Features

- **👨‍🌾 Customer & Supplier Directory**: Register smallholder farmers with auto-generated IDs (`TEA-2026-001`), transport routes, bank accounts, and printable digital QR ID passes.
- **🍃 Daily Leaf Intake Weighbridge**: Record gross weight, bag tare weight, and leaf quality grades.
- **🌧️ Rainy Day Wet Leaf Moisture Deduction Engine**: Dynamic percentage reduction (e.g. 5%–15% water weight deduction) automatically applied on rainy days.
- **📦 Supplies & Cash Advances Ledger**: Debit tracking for fertilizer bags, agro-chemicals, tea sacks, and cash advances issued to farmers during the month.
- **🧾 Automated Monthly Billing & Payslip Generator**: Instant ledger calculation:
  $$\text{Net Payable} = (\text{Net Kg} \times \text{Factory Rate}) - (\text{Supplies} + \text{Transport} + \text{Welfare Levy} + \text{Stamp Duty})$$
- **🖨️ Printable Vouchers & Payslips**: Official Sri Lankan / South Asian Tea Estate payslip layout formatted for A4 & thermal printers.
- **📱 Customer SMS Payout Alert Simulator**: Automated monthly payout notification broadcast gateway with customizable message tags.

---

## 🚀 Quick Start

### 1. Standalone Instant Access (No Node Setup Required)
Open `app.html` directly in any browser:
```bash
double-click app.html
```

### 2. Node / Vite Local Development
```bash
# Install dependencies
npm install

# Start local server
npm run dev
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, HTML5, JavaScript (ES6+), Tailwind CSS
- **Architecture**: Modular Component-Driven Architecture with LocalStorage State Persistence
- **Deployment**: Compatible with Vercel, Netlify, or local estate servers.

---

## 📄 System Architecture Blueprint
Detailed ER schemas and architecture specs are located in `tea_collection_system_architecture.md`.
# tea-collection-business
