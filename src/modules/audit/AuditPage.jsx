import { auditLogs } from '../../data/mockData';

export default function AuditPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Security</p>
          <h2>Audit logs</h2>
        </div>
      </div>

      <div className="panel-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Record</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((item) => (
                <tr key={`${item.time}-${item.action}`}>
                  <td>{item.time}</td>
                  <td>{item.actor}</td>
                  <td>{item.action}</td>
                  <td>{item.record}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
