import { inventoryEntries } from '../../data/mockData';

export default function InventoryPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Stock overview</p>
          <h2>Inventory and batch control</h2>
        </div>
        <button type="button" className="primary-button">Adjust stock</button>
      </div>

      <div className="panel-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Batch</th>
                <th>Expiry</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventoryEntries.map((entry) => (
                <tr key={entry.batch}>
                  <td>{entry.item}</td>
                  <td>{entry.batch}</td>
                  <td>{entry.expiry}</td>
                  <td>{entry.stock}</td>
                  <td>
                    <span className={`status-pill ${entry.stock < 25 ? 'warning' : 'success'}`}>
                      {entry.stock < 25 ? 'Low stock' : 'Healthy'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
