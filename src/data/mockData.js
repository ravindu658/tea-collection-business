// Initial Sample Data for Industry Tea Collection System

export const INITIAL_ROUTES = [
  { id: 'R01', name: 'Route 1 - Central Hills (Nuwara Eliya Rd)', transportRatePerKg: 12.00 },
  { id: 'R02', name: 'Route 2 - Valley View Estate', transportRatePerKg: 10.00 },
  { id: 'R03', name: 'Route 3 - Highland Slope', transportRatePerKg: 15.00 },
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'TEA-2026-001',
    fullName: 'K. G. Ranbanda',
    nic: '681452930V',
    phone: '+94771234567',
    routeId: 'R01',
    bankName: 'Bank of Ceylon',
    accountNumber: '8392014852',
    registeredDate: '2025-01-10',
    status: 'ACTIVE'
  },
  {
    id: 'TEA-2026-002',
    fullName: 'S. Periyasamy',
    nic: '752940182V',
    phone: '+94719876543',
    routeId: 'R01',
    bankName: 'People\'s Bank',
    accountNumber: '1092847291',
    registeredDate: '2025-02-15',
    status: 'ACTIVE'
  },
  {
    id: 'TEA-2026-003',
    fullName: 'Sunil Wickramasinghe',
    nic: '821039481V',
    phone: '+94765432109',
    routeId: 'R02',
    bankName: 'Commercial Bank',
    accountNumber: '8840291847',
    registeredDate: '2025-03-01',
    status: 'ACTIVE'
  },
  {
    id: 'TEA-2026-004',
    fullName: 'M. Selliah',
    nic: '710392817V',
    phone: '+94701122334',
    routeId: 'R03',
    bankName: 'Hatton National Bank',
    accountNumber: '6720194827',
    registeredDate: '2025-03-12',
    status: 'ACTIVE'
  }
];

export const INITIAL_COLLECTIONS = [
  {
    id: 'COL-1001',
    date: '2026-09-28',
    customerId: 'TEA-2026-001',
    grossWeight: 45.5,
    tareWeight: 1.5,
    isRainyDay: false,
    rainDeductionPercent: 0,
    netWeight: 44.0,
    grade: 'Super (100%)',
    notes: 'Good quality tender leaves'
  },
  {
    id: 'COL-1002',
    date: '2026-09-28',
    customerId: 'TEA-2026-002',
    grossWeight: 62.0,
    tareWeight: 2.0,
    isRainyDay: false,
    rainDeductionPercent: 0,
    netWeight: 60.0,
    grade: 'Super (100%)',
    notes: ''
  },
  {
    id: 'COL-1003',
    date: '2026-09-29',
    customerId: 'TEA-2026-001',
    grossWeight: 58.0,
    tareWeight: 2.0,
    isRainyDay: true,
    rainDeductionPercent: 10,
    netWeight: 50.4, // (58-2) * 0.90 = 50.4 kg
    notes: 'Heavy morning rain - 10% water weight deducted'
  },
  {
    id: 'COL-1004',
    date: '2026-09-29',
    customerId: 'TEA-2026-003',
    grossWeight: 85.0,
    tareWeight: 3.0,
    isRainyDay: true,
    rainDeductionPercent: 10,
    netWeight: 73.8, // (85-3) * 0.90 = 73.8 kg
    notes: 'Wet leaves collected'
  },
  {
    id: 'COL-1005',
    date: '2026-09-30',
    customerId: 'TEA-2026-001',
    grossWeight: 52.0,
    tareWeight: 2.0,
    isRainyDay: false,
    rainDeductionPercent: 0,
    netWeight: 50.0,
    grade: 'Super (100%)',
    notes: 'Fresh pluck'
  },
  {
    id: 'COL-1006',
    date: '2026-09-30',
    customerId: 'TEA-2026-004',
    grossWeight: 90.0,
    tareWeight: 3.0,
    isRainyDay: false,
    rainDeductionPercent: 0,
    netWeight: 87.0,
    grade: 'Grade A (95%)',
    notes: 'Coarse leaf mixed'
  }
];

export const INITIAL_SUPPLIES = [
  {
    id: 'SUP-501',
    date: '2026-09-05',
    customerId: 'TEA-2026-001',
    category: 'Fertilizer',
    itemName: 'T-200 Tea Fertilizer 50kg',
    quantity: 2,
    unitPrice: 6500.00,
    totalAmount: 13000.00
  },
  {
    id: 'SUP-502',
    date: '2026-09-12',
    customerId: 'TEA-2026-002',
    category: 'Cash Advance',
    itemName: 'Mid-month Cash Advance',
    quantity: 1,
    unitPrice: 15000.00,
    totalAmount: 15000.00
  },
  {
    id: 'SUP-503',
    date: '2026-09-15',
    customerId: 'TEA-2026-003',
    category: 'Equipment',
    itemName: 'Heavy Duty Tea Sacks (Set of 5)',
    quantity: 1,
    unitPrice: 3500.00,
    totalAmount: 3500.00
  },
  {
    id: 'SUP-504',
    date: '2026-09-20',
    customerId: 'TEA-2026-001',
    category: 'Cash Advance',
    itemName: 'Medical Cash Advance',
    quantity: 1,
    unitPrice: 5000.00,
    totalAmount: 5000.00
  }
];

export const INITIAL_SETTINGS = {
  factoryName: 'HIGHLAND CREST TEA FACTORY & ESTATES',
  registrationNo: 'TF/2024/9842',
  address: 'No. 45, Factory Road, Nuwara Eliya, Sri Lanka',
  phone: '+94 52 222 3400',
  monthlyRatePerKg: 245.00, // LKR per net kg
  welfareFeePerMonth: 150.00,
  stampDutyPerMonth: 50.00,
  defaultRainDeductionPercent: 10,
  smsTemplate: 'Dear {NAME}, your Tea Payout for {MONTH} is Rs. {NET_PAYOUT}. Net Leaf: {NET_KG} kg. Factory Rate: Rs. {RATE}/kg. Total Deductions: Rs. {DEDUCTIONS}. Thank you! - Highland Crest Tea'
};
