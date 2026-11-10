import {
  ArrowRight,
  BellRing,
  PackagePlus,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { dashboardStats, lowStockMedicines, recentSales } from '../../data/mockData';

const statusClass = {
  positive: 'status-pill success',
  warning: 'status-pill warning',
  danger: 'status-pill danger',
  neutral: 'status-pill neutral',
};

const salesTrend = [
  { day: 'Mon', value: 42, tone: '#16a34a' },
  { day: 'Tue', value: 52, tone: '#22c55e' },
  { day: 'Wed', value: 64, tone: '#34d399' },
  { day: 'Thu', value: 58, tone: '#10b981' },
  { day: 'Fri', value: 76, tone: '#14b8a6' },
  { day: 'Sat', value: 88, tone: '#2dd4bf' },
  { day: 'Sun', value: 70, tone: '#22c55e' },
];

const quickActions = [
  {
    label: 'New sale',
    description: 'Process an instant walk-in purchase',
    tone: 'primary',
    icon: ShoppingCart,
  },
  {
    label: 'Add medicine',
    description: 'Create a new stock item in the catalog',
    tone: 'secondary',
    icon: PackagePlus,
  },
  {
    label: 'Stock check',
    description: 'Review urgent expiry and reorder items',
    tone: 'warning',
    icon: BellRing,
  },
];

const expiryAlerts = [
  { name: 'Insulin Glargine', expiry: '2026-11-20', daysLeft: 10, tone: 'danger' },
  { name: 'Paracetamol 500mg', expiry: '2026-12-02', daysLeft: 22, tone: 'warning' },
  { name: 'Amoxicillin 500mg', expiry: '2027-05-12', daysLeft: 183, tone: 'neutral' },
];

export default function DashboardPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Daily pharmacy performance</h2>
        </div>
        <button type="button" className="secondary-button">This week</button>
      </div>

      <div className="stats-grid">
        {dashboardStats.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.label} className="stat-card">
              <div className="stat-header">
                <div className="stat-label-wrap">
                  <span className="stat-icon">
                    <Icon size={16} />
                  </span>
                  <span>{item.label}</span>
                </div>
                <span className={statusClass[item.tone] || 'status-pill neutral'}>{item.change}</span>
              </div>
              <strong>{item.value}</strong>
            </article>
          );
        })}
      </div>

      <div className="dashboard-quick-actions">
        {quickActions.map(({ label, description, tone, icon: Icon }) => (
          <button key={label} type="button" className={`quick-action ${tone}`}>
            <span className="quick-action-icon">
              <Icon size={18} />
            </span>
            <span className="quick-action-copy">
              <strong>{label}</strong>
              <small>{description}</small>
            </span>
            <ArrowRight size={16} className="quick-action-arrow" />
          </button>
        ))}
      </div>

      <div className="content-grid dashboard-main-grid">
        <div className="panel-card">
          <div className="panel-header">
            <h3>Sales trend</h3>
            <button type="button" className="action-link">
              <TrendingUp size={14} />
              View report
            </button>
          </div>

          <div className="chart-panel">
            <div className="chart-grid">
              {salesTrend.map((item) => (
                <div key={item.day} className="chart-column">
                  <span
                    className="chart-bar"
                    style={{ height: `${item.value}%`, background: item.tone }}
                  />
                  <small>{item.day}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h3>Expiry alerts</h3>
            <button type="button" className="action-link">Review</button>
          </div>

          <div className="alert-list">
            {expiryAlerts.map((item) => (
              <div key={item.name} className={`alert-row ${item.tone}`}>
                <div>
                  <strong>{item.name}</strong>
                  <small>Expires {item.expiry}</small>
                </div>
                <span className={`mini-badge ${item.tone === 'danger' ? 'danger' : item.tone === 'warning' ? 'warning' : 'neutral'}`}>
                  {item.daysLeft} days
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-grid two-columns">
        <div className="panel-card">
          <div className="panel-header">
            <h3>Recent sales</h3>
            <button type="button" className="action-link">View all</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Time</th>
                  <th>Customer</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{sale.time}</td>
                    <td>{sale.customer}</td>
                    <td>UGX {sale.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h3>Low stock</h3>
            <button type="button" className="action-link">Reorder</button>
          </div>

          <div className="stack-list">
            {lowStockMedicines.map((item) => (
              <div key={item.name} className="stack-row">
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.stock} units left</small>
                </div>
                <span className="mini-badge">Reorder {item.reorderLevel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
