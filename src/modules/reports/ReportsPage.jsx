import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle, Download, FileText, PackageSearch, ShoppingCart, TrendingUp } from 'lucide-react';
import { medicines, purchases, reportRows } from '../../data/mockData';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(value || 0);

const salesSeries = [
  { label: 'Mon', sales: 420000, color: '#2563eb' },
  { label: 'Tue', sales: 540000, color: '#60a5fa' },
  { label: 'Wed', sales: 490000, color: '#22c55e' },
  { label: 'Thu', sales: 660000, color: '#f59e0b' },
  { label: 'Fri', sales: 720000, color: '#ef4444' },
  { label: 'Sat', sales: 820000, color: '#8b5cf6' },
  { label: 'Sun', sales: 680000, color: '#14b8a6' },
];

export default function ReportsPage() {
  const [range, setRange] = useState('30d');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-10');

  const summary = useMemo(() => {
    const totalRevenue = salesSeries.reduce((sum, day) => sum + day.sales, 0);
    const transactions = salesSeries.reduce((sum, day) => sum + Math.max(10, Math.round(day.sales / 26000)), 0);
    const bestSeller = medicines[0];
    const inventoryValue = medicines.reduce((sum, item) => sum + item.stock * item.price, 0);
    const lowStock = medicines.filter((item) => item.stock <= item.reorderLevel).length;
    const expiringSoon = medicines.filter((item) => {
      const expiry = new Date(item.expiry);
      const soon = new Date();
      soon.setDate(soon.getDate() + 45);
      return expiry <= soon && item.stock > 0;
    }).length;

    return {
      totalRevenue,
      transactions,
      bestSeller,
      inventoryValue,
      lowStock,
      expiringSoon,
    };
  }, []);

  const topMedicines = useMemo(
    () =>
      medicines
        .slice()
        .sort((a, b) => b.price * b.stock - a.price * a.stock)
        .slice(0, 4)
        .map((item) => ({
          name: item.name,
          units: item.stock,
          revenue: item.stock * item.price,
        })),
    [],
  );

  const inventoryAlerts = useMemo(
    () =>
      medicines
        .filter((item) => item.stock <= item.reorderLevel)
        .map((item) => ({
          name: item.name,
          stock: item.stock,
          reorderLevel: item.reorderLevel,
          expiry: item.expiry,
        })),
    [],
  );

  const expiredSoon = useMemo(
    () =>
      medicines
        .filter((item) => {
          const expiry = new Date(item.expiry);
          const soon = new Date();
          soon.setDate(soon.getDate() + 45);
          return expiry <= soon && item.stock > 0;
        })
        .slice(0, 4),
    [],
  );

  const handleGenerateReport = () => {
    toast.success(`Report generated for ${range === '30d' ? 'the last 30 days' : range === '7d' ? 'the last 7 days' : 'the selected range'}`);
  };

  const chartMax = Math.max(...salesSeries.map((item) => item.sales));
  const donutSegments = salesSeries.map((day, index) => {
    const previous = salesSeries.slice(0, index).reduce((sum, item) => sum + item.sales, 0);
    const start = (previous / chartMax) * 100;
    const end = ((previous + day.sales) / chartMax) * 100;
    return {
      ...day,
      start,
      end,
    };
  });

  const donutStyle = {
    background: `conic-gradient(${donutSegments
      .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
      .join(', ')})`,
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Reports and analytics</h2>
        </div>
        <div className="page-header-actions">
          <button type="button" className="secondary-button">
            <Download size={16} /> Export
          </button>
          <button type="button" className="primary-button" onClick={handleGenerateReport}>
            Generate report
          </button>
        </div>
      </div>

      <div className="reports-toolbar">
        <div className="report-filters">
          <select value={range} onChange={(event) => setRange(event.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="custom">Custom range</option>
          </select>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </div>
      </div>

      <div className="stats-grid reports-grid">
        {reportRows.map((row) => (
          <article key={row.label} className="stat-card report-card">
            <div className="stat-header">
              <span>{row.label}</span>
              <span className="stat-icon success"><TrendingUp size={16} /></span>
            </div>
            <strong>{row.value}</strong>
          </article>
        ))}
      </div>

      <div className="content-grid two-columns report-main-grid">
        <article className="panel-card">
          <div className="panel-header">
            <h3>Sales trend</h3>
            <span className="mini-badge success">Updated today</span>
          </div>

          <div className="donut-chart-wrap">
            <div className="donut-chart" style={donutStyle} aria-label="Sales donut chart">
              <div className="donut-center">
                <strong>{formatCurrency(summary.totalRevenue)}</strong>
                <small>Weekly sales</small>
              </div>
            </div>

            <div className="donut-legend">
              {salesSeries.map((day) => (
                <div key={day.label} className="legend-item">
                  <span className="legend-dot" style={{ background: day.color }} />
                  <span>{day.label}</span>
                  <strong>{formatCurrency(day.sales)}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <h3>Key performance</h3>
          </div>

          <div className="key-metrics">
            <div className="metric-row">
              <span><ShoppingCart size={15} /> Total revenue</span>
              <strong>{formatCurrency(summary.totalRevenue)}</strong>
            </div>
            <div className="metric-row">
              <span><FileText size={15} /> Transactions</span>
              <strong>{summary.transactions}</strong>
            </div>
            <div className="metric-row">
              <span><TrendingUp size={15} /> Best seller</span>
              <strong>{summary.bestSeller.name}</strong>
            </div>
            <div className="metric-row">
              <span><PackageSearch size={15} /> Inventory value</span>
              <strong>{formatCurrency(summary.inventoryValue)}</strong>
            </div>
          </div>
        </article>
      </div>

      <div className="content-grid two-columns report-secondary-grid">
        <article className="panel-card">
          <div className="panel-header">
            <h3>Top medicines</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Units</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topMedicines.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.units}</td>
                    <td>{formatCurrency(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <h3>Low stock & expiry</h3>
          </div>
          <div className="stack-list">
            {inventoryAlerts.slice(0, 3).map((item) => (
              <div key={item.name} className="stack-row alert-row warning">
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.stock} left • reorder at {item.reorderLevel}</small>
                </div>
                <span className="mini-badge warning">Low stock</span>
              </div>
            ))}
            {expiredSoon.map((item) => (
              <div key={`${item.name}-expiry`} className="stack-row alert-row danger">
                <div>
                  <strong>{item.name}</strong>
                  <small>Expires {item.expiry}</small>
                </div>
                <span className="mini-badge danger">Expiry</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="panel-card report-table-panel">
        <div className="panel-header">
          <h3>Purchase history</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.id}</td>
                  <td>{purchase.supplier}</td>
                  <td>{purchase.date}</td>
                  <td>{formatCurrency(purchase.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
