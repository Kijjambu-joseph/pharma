import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  BellRing,
  Building2,
  CircleDollarSign,
  Lock,
  Printer,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Store,
  UserCog,
  RefreshCw,
} from 'lucide-react';
import { defaultBusinessProfile, saveBusinessProfile } from '../../data/businessProfile';

const defaultSettings = {
  ...defaultBusinessProfile,
  enableEmailAlerts: true,
  enableSmsAlerts: true,
  lowStockAlerts: true,
  expiryAlerts: true,
  requireTwoFactor: true,
  sessionTimeout: '30 minutes',
  allowSelfService: false,
  defaultLandingPage: 'Dashboard',
  defaultPrinter: 'Thermal Printer',
  autoBackup: true,
  auditRetention: '365 days',
  posTheme: 'Dark mode',
};

const summaryCards = [
  { label: 'Business status', value: 'Operational', tone: 'success', icon: Store },
  { label: 'Security', value: 'Protected', tone: 'primary', icon: ShieldCheck },
  { label: 'Alerts', value: '4 active', tone: 'warning', icon: BellRing },
  { label: 'Backup', value: 'Daily', tone: 'neutral', icon: RefreshCw },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => {
    const storedProfile = localStorage.getItem('pharmacy-business-profile');

    if (!storedProfile) {
      return defaultSettings;
    }

    try {
      return {
        ...defaultSettings,
        ...JSON.parse(storedProfile),
      };
    } catch (error) {
      console.error('Unable to load saved business settings', error);
      return defaultSettings;
    }
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleToggle = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { pharmacyName, address, contactPhone, email, currency, receiptFooter } = settings;
    saveBusinessProfile({ pharmacyName, address, contactPhone, email, currency, receiptFooter });
    toast.success('Settings saved successfully');
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Configuration</p>
          <h2>System settings</h2>
        </div>
        <button type="button" className="primary-button" onClick={handleSubmit}>
          <Save size={16} />
          Save changes
        </button>
      </div>

      <div className="stats-grid settings-summary">
        {summaryCards.map(({ label, value, tone, icon: Icon }) => (
          <article key={label} className="stat-card inventory-stat-card">
            <div className="stat-header">
              <div className="stat-label-wrap">
                <span className={`stat-icon ${tone}`}>
                  <Icon size={16} />
                </span>
                <span>{label}</span>
              </div>
            </div>
            <strong>{value}</strong>
            <small>Updated today</small>
          </article>
        ))}
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-layout">
          <div className="panel-card settings-panel">
            <div className="panel-header">
              <h3>Business profile</h3>
              <span className="status-pill success">Live</span>
            </div>

            <div className="form-grid">
              <label>
                Pharmacy name
                <input
                  type="text"
                  name="pharmacyName"
                  value={settings.pharmacyName}
                  onChange={handleFieldChange}
                  placeholder="Enter pharmacy name"
                />
              </label>

              <label>
                Currency
                <select name="currency" value={settings.currency} onChange={handleFieldChange}>
                  <option value="UGX">UGX</option>
                  <option value="USD">USD</option>
                  <option value="KES">KES</option>
                </select>
              </label>

              <label className="full-width">
                Address
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleFieldChange}
                  placeholder="Enter pharmacy address"
                />
              </label>

              <label>
                Contact phone
                <input
                  type="tel"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleFieldChange}
                  placeholder="e.g. +256 700 000 000"
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleFieldChange}
                  placeholder="name@pharmacy.ug"
                />
              </label>

              <label className="full-width">
                Receipt footer
                <input
                  type="text"
                  name="receiptFooter"
                  value={settings.receiptFooter}
                  onChange={handleFieldChange}
                  placeholder="Thank you for shopping with us"
                />
              </label>
            </div>
          </div>

          <div className="panel-card settings-panel">
            <div className="panel-header">
              <h3>Access and security</h3>
              <ShieldCheck size={16} color="#16a34a" />
            </div>

            <div className="settings-list">
              <div className="setting-row">
                <div>
                  <strong>Require 2FA</strong>
                  <small>For all pharmacy administrators</small>
                </div>
                <button type="button" className={`toggle-switch ${settings.requireTwoFactor ? 'active' : ''}`} onClick={() => handleToggle('requireTwoFactor')} aria-label="Toggle two-factor authentication">
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <strong>Session timeout</strong>
                  <small>Auto sign-out after inactivity</small>
                </div>
                <select name="sessionTimeout" value={settings.sessionTimeout} onChange={handleFieldChange}>
                  <option value="15 minutes">15 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="2 hours">2 hours</option>
                </select>
              </div>

              <div className="setting-row">
                <div>
                  <strong>Self-service portal</strong>
                  <small>Allow patients to view prescriptions</small>
                </div>
                <button type="button" className={`toggle-switch ${settings.allowSelfService ? 'active' : ''}`} onClick={() => handleToggle('allowSelfService')} aria-label="Toggle self-service portal">
                  <span />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-layout secondary">
          <div className="panel-card settings-panel">
            <div className="panel-header">
              <h3>Notifications</h3>
              <BellRing size={16} color="#2563eb" />
            </div>

            <div className="settings-list">
              <div className="setting-row">
                <div>
                  <strong>Email alerts</strong>
                  <small>Send operational status updates</small>
                </div>
                <button type="button" className={`toggle-switch ${settings.enableEmailAlerts ? 'active' : ''}`} onClick={() => handleToggle('enableEmailAlerts')} aria-label="Toggle email alerts">
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <strong>SMS alerts</strong>
                  <small>Trigger critical stock notifications</small>
                </div>
                <button type="button" className={`toggle-switch ${settings.enableSmsAlerts ? 'active' : ''}`} onClick={() => handleToggle('enableSmsAlerts')} aria-label="Toggle SMS alerts">
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <strong>Low stock alerts</strong>
                  <small>Notify when reorder thresholds are reached</small>
                </div>
                <button type="button" className={`toggle-switch ${settings.lowStockAlerts ? 'active' : ''}`} onClick={() => handleToggle('lowStockAlerts')} aria-label="Toggle low stock alerts">
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <strong>Expiry reminders</strong>
                  <small>Warn before medicines expire</small>
                </div>
                <button type="button" className={`toggle-switch ${settings.expiryAlerts ? 'active' : ''}`} onClick={() => handleToggle('expiryAlerts')} aria-label="Toggle expiry reminders">
                  <span />
                </button>
              </div>
            </div>
          </div>

          <div className="panel-card settings-panel">
            <div className="panel-header">
              <h3>Pharmacy operations</h3>
              <SlidersHorizontal size={16} color="#64748b" />
            </div>

            <div className="form-grid compact-grid">
              <label>
                Default landing page
                <select name="defaultLandingPage" value={settings.defaultLandingPage} onChange={handleFieldChange}>
                  <option value="Dashboard">Dashboard</option>
                  <option value="POS">POS</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Reports">Reports</option>
                </select>
              </label>

              <label>
                Default printer
                <select name="defaultPrinter" value={settings.defaultPrinter} onChange={handleFieldChange}>
                  <option value="Thermal Printer">Thermal Printer</option>
                  <option value="Laser Printer">Laser Printer</option>
                  <option value="A4 Invoice Printer">A4 Invoice Printer</option>
                </select>
              </label>

              <label>
                POS theme
                <select name="posTheme" value={settings.posTheme} onChange={handleFieldChange}>
                  <option value="Dark mode">Dark mode</option>
                  <option value="Light mode">Light mode</option>
                  <option value="Blue accent">Blue accent</option>
                </select>
              </label>

              <label>
                Audit retention
                <select name="auditRetention" value={settings.auditRetention} onChange={handleFieldChange}>
                  <option value="90 days">90 days</option>
                  <option value="180 days">180 days</option>
                  <option value="365 days">365 days</option>
                  <option value="730 days">730 days</option>
                </select>
              </label>
            </div>

            <div className="settings-list compact-list">
              <div className="setting-row">
                <div>
                  <strong>Automatic backup</strong>
                  <small>Nightly full backup for pharmacy data</small>
                </div>
                <button type="button" className={`toggle-switch ${settings.autoBackup ? 'active' : ''}`} onClick={() => handleToggle('autoBackup')} aria-label="Toggle automatic backup">
                  <span />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="panel-card settings-panel footer-panel">
          <div className="panel-header">
            <h3>Quick tools</h3>
          </div>

          <div className="settings-tools">
            <div className="tool-chip">
              <Building2 size={16} />
              Business details
            </div>
            <div className="tool-chip">
              <UserCog size={16} />
              Roles & permissions
            </div>
            <div className="tool-chip">
              <Lock size={16} />
              Access control
            </div>
            <div className="tool-chip">
              <CircleDollarSign size={16} />
              Payment rules
            </div>
            <div className="tool-chip">
              <Smartphone size={16} />
              Mobile sync
            </div>
            <div className="tool-chip">
              <Printer size={16} />
              Receipt setup
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
