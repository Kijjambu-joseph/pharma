import { suppliers } from '../../data/mockData';

export default function SuppliersPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Supply chain</p>
          <h2>Supplier management</h2>
        </div>
        <button type="button" className="primary-button">New supplier</button>
      </div>

      <div className="panel-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.name}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact}</td>
                  <td>{supplier.phone}</td>
                  <td>UGX {supplier.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
