import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import {
  Activity,
  Boxes,
  CreditCard,
  FileText,
  LayoutDashboard,
  Pill,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react';
import DashboardPage from '../modules/dashboard/DashboardPage';
import MedicinePage from '../modules/medicine/MedicinePage';
import InventoryPage from '../modules/inventory/InventoryPage';
import PosPage from '../modules/pos/PosPage';
import SuppliersPage from '../modules/suppliers/SuppliersPage';
import PurchasesPage from '../modules/purchases/PurchasesPage';
import PrescriptionsPage from '../modules/prescriptions/PrescriptionsPage';
import ReportsPage from '../modules/reports/ReportsPage';
import UsersPage from '../modules/users/UsersPage';
import AuditPage from '../modules/audit/AuditPage';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/medicine', label: 'Medicine', icon: Pill },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/pos', label: 'POS', icon: CreditCard },
  { to: '/suppliers', label: 'Suppliers', icon: Warehouse },
  { to: '/purchases', label: 'Purchases', icon: ReceiptText },
  { to: '/prescriptions', label: 'Prescriptions', icon: FileText },
  { to: '/reports', label: 'Reports', icon: TrendingUp },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/audit', label: 'Audit logs', icon: Activity },
];

export default function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-icon">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="eyebrow">Pharmacy</p>
            <h2>POS</h2>
          </div>
        </div>

        <nav className="nav-menu" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations dashboard</p>
            <h1>Pharmacy Control Centre</h1>
          </div>

          <div className="topbar-actions">
            <button type="button" className="secondary-button">Export</button>
            <button type="button" className="primary-button">New sale</button>
          </div>
        </header>

        <main className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/medicine" element={<MedicinePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/audit" element={<AuditPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
