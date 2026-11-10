import {
  AlertTriangle,
  Boxes,
  CalendarClock,
  CircleDollarSign,
  PackageSearch,
  ReceiptText,
} from 'lucide-react';

export const dashboardStats = [
  { label: 'Today sales', value: 'UGX 4.8M', change: '+12.5%', tone: 'positive', icon: CircleDollarSign },
  { label: 'Transactions', value: '142', change: '+9.1%', tone: 'positive', icon: ReceiptText },
  { label: 'Medicines', value: '1,284', change: '+28', tone: 'neutral', icon: Boxes },
  { label: 'Low stock', value: '23', change: '6 critical', tone: 'warning', icon: PackageSearch },
  { label: 'Expiring soon', value: '19', change: '3 urgent', tone: 'warning', icon: CalendarClock },
  { label: 'Expired stock', value: '4', change: 'Action needed', tone: 'danger', icon: AlertTriangle },
];

export const recentSales = [
  { id: 'INV-1042', time: '09:15', customer: 'Jane Nsubuga', total: 328000, items: 6 },
  { id: 'INV-1043', time: '09:42', customer: 'Musa Kato', total: 184500, items: 3 },
  { id: 'INV-1044', time: '10:05', customer: 'Aisha Namutebi', total: 561000, items: 8 },
  { id: 'INV-1045', time: '10:31', customer: 'David Okwii', total: 275500, items: 5 },
];

export const lowStockMedicines = [
  { name: 'Amoxicillin 500mg', stock: 12, reorderLevel: 25 },
  { name: 'Paracetamol 500mg', stock: 8, reorderLevel: 20 },
  { name: 'Cough Syrup 120ml', stock: 10, reorderLevel: 18 },
  { name: 'Metformin 850mg', stock: 6, reorderLevel: 30 },
];

export const medicines = [
  {
    id: 1,
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    code: 'MED-101',
    barcode: '8901234561011',
    category: 'Antibiotic',
    price: 2300,
    stock: 24,
    reorderLevel: 20,
    supplier: 'MediCare Uganda',
    expiry: '2027-05-12',
    status: 'In stock',
  },
  {
    id: 2,
    name: 'Paracetamol 500mg',
    genericName: 'Paracetamol',
    code: 'MED-204',
    barcode: '8901234562042',
    category: 'Analgesic',
    price: 1200,
    stock: 8,
    reorderLevel: 15,
    supplier: 'Pharma Supply Co.',
    expiry: '2026-12-02',
    status: 'Low stock',
  },
  {
    id: 3,
    name: 'Insulin Glargine',
    genericName: 'Insulin glargine',
    code: 'MED-312',
    barcode: '8901234563123',
    category: 'Diabetes',
    price: 42500,
    stock: 16,
    reorderLevel: 10,
    supplier: 'Apex Health Group',
    expiry: '2026-11-20',
    status: 'In stock',
  },
  {
    id: 4,
    name: 'Cough Syrup 120ml',
    genericName: 'Dextromethorphan',
    code: 'MED-421',
    barcode: '8901234564214',
    category: 'Respiratory',
    price: 9600,
    stock: 4,
    reorderLevel: 12,
    supplier: 'Global Rx Imports',
    expiry: '2027-01-10',
    status: 'Low stock',
  },
  {
    id: 5,
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    code: 'MED-135',
    barcode: '8901234561355',
    category: 'Gastro',
    price: 5400,
    stock: 0,
    reorderLevel: 8,
    supplier: 'MediCare Uganda',
    expiry: '2026-08-18',
    status: 'Out of stock',
  },
  {
    id: 6,
    name: 'Zinc Supplement',
    genericName: 'Zinc oxide',
    code: 'MED-554',
    barcode: '8901234565546',
    category: 'Supplement',
    price: 3100,
    stock: 31,
    reorderLevel: 18,
    supplier: 'Pharma Supply Co.',
    expiry: '2028-03-01',
    status: 'In stock',
  },
];

export const inventoryEntries = [
  { item: 'Amoxicillin 500mg', batch: 'AMX-446', expiry: '2027-05-12', stock: 246 },
  { item: 'Paracetamol 500mg', batch: 'PCM-118', expiry: '2026-12-02', stock: 84 },
  { item: 'Insulin Glargine', batch: 'GLA-741', expiry: '2026-11-20', stock: 34 },
  { item: 'Cough Syrup 120ml', batch: 'COU-902', expiry: '2027-01-10', stock: 18 },
];

export const suppliers = [
  { name: 'MediCare Uganda', contact: 'Nassanga Mary', phone: '+256 772 420 110', balance: 2680000 },
  { name: 'Pharma Supply Co.', contact: 'Kisitu Daniel', phone: '+256 704 682 400', balance: 940000 },
  { name: 'Apex Health Group', contact: 'Amina Kato', phone: '+256 758 214 660', balance: 1430000 },
  { name: 'Global Rx Imports', contact: 'Zvirete Jonah', phone: '+256 782 045 198', balance: 510000 },
];

export const purchases = [
  { id: 'PO-3348', supplier: 'MediCare Uganda', date: '2026-11-09', total: 1624000 },
  { id: 'PO-3349', supplier: 'Pharma Supply Co.', date: '2026-11-08', total: 840000 },
  { id: 'PO-3351', supplier: 'Apex Health Group', date: '2026-11-05', total: 1275000 },
  { id: 'PO-3353', supplier: 'Global Rx Imports', date: '2026-11-02', total: 690000 },
];

export const prescriptions = [
  { patient: 'B. Kafuko', reference: 'RX-4401', prescriber: 'Dr. S. Okello', status: 'Dispensed', date: '2026-11-10' },
  { patient: 'R. Mugisha', reference: 'RX-4402', prescriber: 'Dr. N. Lutaaya', status: 'Pending', date: '2026-11-10' },
  { patient: 'E. Nakato', reference: 'RX-4403', prescriber: 'Dr. A. Mugerwa', status: 'Reviewed', date: '2026-11-09' },
  { patient: 'J. Ouma', reference: 'RX-4404', prescriber: 'Dr. M. Aine', status: 'Dispensed', date: '2026-11-09' },
];

export const reportRows = [
  { label: 'Daily sales', value: 'UGX 4.8M' },
  { label: 'Best seller', value: 'Paracetamol 500mg' },
  { label: 'Inventory value', value: 'UGX 56.4M' },
  { label: 'Low stock items', value: '23' },
  { label: 'Expiring this month', value: '19' },
];

export const users = [
  { name: 'Nadia Kanyike', role: 'Pharmacist', status: 'Active' },
  { name: 'Peter Kibuuka', role: 'Cashier', status: 'Active' },
  { name: 'Owomugisha A.', role: 'Storekeeper', status: 'Inactive' },
  { name: 'Ernest Muwonge', role: 'Manager', status: 'Active' },
];

export const auditLogs = [
  { time: '08:42', actor: 'Nadia Kanyike', action: 'Updated medicine pricing', record: 'Amoxicillin 500mg' },
  { time: '09:11', actor: 'Peter Kibuuka', action: 'Completed sale', record: 'INV-1042' },
  { time: '09:25', actor: 'Ernest Muwonge', action: 'Adjusted stock', record: 'Batch GLA-741' },
  { time: '10:14', actor: 'Nadia Kanyike', action: 'Approved prescription', record: 'RX-4401' },
];

export const cartItems = [
  { name: 'Paracetamol 500mg', qty: 3, unitPrice: 1200 },
  { name: 'Amoxicillin 500mg', qty: 2, unitPrice: 2300 },
  { name: 'Cough Syrup 120ml', qty: 1, unitPrice: 9600 },
];
