import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import {
  Activity,
  Bell,
  Boxes,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  Pill,
  Power,
  PowerOff,
  ReceiptText,
  Settings,
  ShieldCheck,
  Sun,
  TrendingUp,
  UserRound,
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
import SettingsPage from '../modules/settings/SettingsPage';

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
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell() {
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const currentUser = {
    name: 'Amina Okello',
    role: 'Pharmacist',
    email: 'amina.okello@pharmacy.com',
    department: 'Pharmacy operations',
  };

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode);
  }, [darkMode]);

  return (
    <div className={`app-shell ${darkMode ? 'dark-theme' : ''}`}>
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
            <button type="button" className="header-icon-button" aria-label="Notifications">
              <Bell size={16} />
            </button>
            <button type="button" className="header-icon-button" aria-label="Toggle dark mode" onClick={() => setDarkMode((current) => !current)}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="avatar-menu-wrap">
              <button type="button" className="header-avatar-button" aria-label="User profile" onClick={() => setProfileOpen((open) => !open)}>
                <UserRound size={18} />
              </button>

              {profileOpen && (
                <div className="header-profile-menu">
                  <div className="profile-summary">
                    <div className="profile-avatar-badge">{currentUser.name.charAt(0)}</div>
                    <div>
                      <strong>{currentUser.name}</strong>
                      <small>{currentUser.role}</small>
                    </div>
                  </div>

                  <div className="profile-meta-grid">
                    <div>
                      <span>Email</span>
                      <strong>{currentUser.email}</strong>
                    </div>
                    <div>
                      <span>Department</span>
                      <strong>{currentUser.department}</strong>
                    </div>
                  </div>

                  <button type="button" className="profile-menu-action">
                    <Settings size={15} />
                    Profile settings
                  </button>
                  <button type="button" className="profile-menu-action danger-action">
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
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
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
