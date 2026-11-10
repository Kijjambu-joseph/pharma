import { purchases } from '../../data/mockData';

export default function PurchasesPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Procurement</p>
          <h2>Purchase orders</h2>
        </div>
        <button type="button" className="primary-button">Record purchase</button>
      </div>

      <div className="panel-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
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
                  <td>UGX {purchase.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
