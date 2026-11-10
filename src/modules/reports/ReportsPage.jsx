import { reportRows } from '../../data/mockData';

export default function ReportsPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Reports and analytics</h2>
        </div>
        <button type="button" className="primary-button">Generate report</button>
      </div>

      <div className="stats-grid reports-grid">
        {reportRows.map((row) => (
          <article key={row.label} className="stat-card report-card">
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
