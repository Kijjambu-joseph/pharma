import { dashboardStats, lowStockMedicines, recentSales } from '../../data/mockData';

const statusClass = {
  positive: 'status-pill success',
  warning: 'status-pill warning',
  danger: 'status-pill danger',
  neutral: 'status-pill neutral',
};

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
        {dashboardStats.map((item) => (
          <article key={item.label} className="stat-card">
            <div className="stat-header">
              <span>{item.label}</span>
              <span className={statusClass[item.tone] || 'status-pill neutral'}>{item.change}</span>
            </div>
            <strong>{item.value}</strong>
          </article>
        ))}
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
