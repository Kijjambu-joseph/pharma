import { useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  CalendarClock,
  PackageSearch,
  Plus,
  TrendingDown,
  X,
} from 'lucide-react';
import { inventoryEntries } from '../../data/mockData';

const inventoryStats = [
  { label: 'Units in stock', value: '4,286', tone: 'success', detail: '+142 this week', icon: Boxes },
  { label: 'Low stock', value: '12', tone: 'warning', detail: 'Needs review', icon: PackageSearch },
  { label: 'Near expiry', value: '19', tone: 'warning', detail: 'In 30 days', icon: CalendarClock },
  { label: 'Expired', value: '4', tone: 'danger', detail: 'Action required', icon: AlertTriangle },
];

const stockAlerts = [
  { name: 'Cough Syrup 120ml', item: 'COU-902', message: 'Only 18 units left', tone: 'warning' },
  { name: 'Insulin Glargine', item: 'GLA-741', message: 'Expires in 10 days', tone: 'danger' },
  { name: 'Paracetamol 500mg', item: 'PCM-118', message: 'Reorder quantity reached', tone: 'neutral' },
];

const stockMovement = [
  { medicine: 'Amoxicillin 500mg', type: 'Purchase', qty: '+120', date: 'Today' },
  { medicine: 'Cough Syrup 120ml', type: 'Dispense', qty: '-18', date: 'Today' },
  { medicine: 'Insulin Glargine', type: 'Adjustment', qty: '-6', date: 'Yesterday' },
];

export default function InventoryPage() {
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Stock overview</p>
          <h2>Inventory and batch control</h2>
        </div>
        <button type="button" className="primary-button" onClick={() => setIsAdjustmentOpen(true)}>
          <Plus size={16} />
          Adjust stock
        </button>
      </div>

      <div className="stats-grid inventory-summary">
        {inventoryStats.map(({ label, value, tone, detail, icon: Icon }) => (
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
            <small>{detail}</small>
          </article>
        ))}
      </div>

      <div className="toolbar-row inventory-toolbar">
        <input type="search" placeholder="Search by medicine or batch" />
        <select>
          <option>All status</option>
          <option>Healthy</option>
          <option>Low stock</option>
          <option>Near expiry</option>
          <option>Expired</option>
        </select>
      </div>

      <div className="content-grid two-columns">
        <div className="panel-card">
          <div className="panel-header">
            <h3>Batch inventory</h3>
            <button type="button" className="action-link">Export</button>
          </div>

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

        <div className="panel-card">
          <div className="panel-header">
            <h3>Stock alerts</h3>
            <button type="button" className="action-link">Review</button>
          </div>

          <div className="stack-list">
            {stockAlerts.map((alert) => (
              <div key={alert.item} className={`stack-row alert-row ${alert.tone}`}>
                <div>
                  <strong>{alert.name}</strong>
                  <small>{alert.item} · {alert.message}</small>
                </div>
                <span className={`mini-badge ${alert.tone === 'danger' ? 'danger' : alert.tone === 'warning' ? 'warning' : 'neutral'}`}>
                  {alert.tone === 'danger' ? 'Urgent' : alert.tone === 'warning' ? 'Watch' : 'Info'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel-card inventory-form-panel">
        <div className="panel-header">
          <h3>Stock adjustment</h3>
          <button type="button" className="action-link">
            <TrendingDown size={14} />
            Movement log
          </button>
        </div>

        <form className="medicine-form inventory-form">
          <div className="form-grid">
            <label>
              Medicine
              <input type="text" placeholder="Select medicine" />
            </label>
            <label>
              Batch
              <input type="text" placeholder="Batch reference" />
            </label>
            <label>
              Quantity
              <input type="number" placeholder="Qty" />
            </label>
            <label>
              Adjustment type
              <select>
                <option>Restock</option>
                <option>Sale deduction</option>
                <option>Damage</option>
                <option>Return</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button">Clear</button>
            <button type="submit" className="primary-button">Save entry</button>
          </div>
        </form>
      </div>

      {isAdjustmentOpen && (
        <div className="modal-backdrop" onClick={() => setIsAdjustmentOpen(false)}>
          <div className="modal-panel inventory-modal" onClick={(event) => event.stopPropagation()}>
            <div className="panel-header">
              <h3>Adjust stock</h3>
              <button type="button" className="modal-close-button" onClick={() => setIsAdjustmentOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form className="medicine-form inventory-form">
              <div className="form-grid">
                <label>
                  Medicine
                  <input type="text" placeholder="Select medicine" />
                </label>
                <label>
                  Batch
                  <input type="text" placeholder="Enter batch number" />
                </label>
                <label>
                  Quantity change
                  <input type="number" placeholder="e.g. 25" />
                </label>
                <label>
                  Reason
                  <select>
                    <option>Restock</option>
                    <option>Sale</option>
                    <option>Damage</option>
                    <option>Return</option>
                    <option>Expired stock</option>
                  </select>
                </label>
                <label>
                  Date
                  <input type="date" />
                </label>
                <label>
                  Recorded by
                  <input type="text" placeholder="Staff name" />
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setIsAdjustmentOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button">Save adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="panel-card">
        <div className="panel-header">
          <h3>Recent movement</h3>
          <button type="button" className="action-link">View history</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stockMovement.map((item) => (
                <tr key={`${item.medicine}-${item.date}`}>
                  <td>{item.medicine}</td>
                  <td>{item.type}</td>
                  <td>{item.qty}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
