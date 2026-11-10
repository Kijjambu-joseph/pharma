import { prescriptions } from '../../data/mockData';

export default function PrescriptionsPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Clinical records</p>
          <h2>Prescription monitoring</h2>
        </div>
        <button type="button" className="primary-button">New prescription</button>
      </div>

      <div className="panel-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Reference</th>
                <th>Prescriber</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((entry) => (
                <tr key={entry.reference}>
                  <td>{entry.patient}</td>
                  <td>{entry.reference}</td>
                  <td>{entry.prescriber}</td>
                  <td>
                    <span className={`status-pill ${entry.status === 'Pending' ? 'warning' : 'success'}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
