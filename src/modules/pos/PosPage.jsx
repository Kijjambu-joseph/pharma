import { cartItems } from '../../data/mockData';

const totals = cartItems.reduce(
  (sum, item) => sum + item.qty * item.unitPrice,
  0,
);

export default function PosPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Cash counter</p>
          <h2>Point of sale</h2>
        </div>
        <button type="button" className="primary-button">Complete checkout</button>
      </div>

      <div className="pos-layout">
        <div className="panel-card">
          <div className="panel-header">
            <h3>Cart</h3>
            <button type="button" className="action-link">Add item</button>
          </div>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.name} className="cart-item">
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.qty} units</small>
                </div>
                <span>UGX {(item.qty * item.unitPrice).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="panel-card totals-card">
          <h3>Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>UGX {totals.toLocaleString()}</strong>
          </div>
          <div className="summary-row">
            <span>VAT</span>
            <strong>UGX 0</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>UGX {totals.toLocaleString()}</strong>
          </div>
          <label>
            <span>Payment method</span>
            <select defaultValue="cash">
              <option value="cash">Cash</option>
              <option value="mobile-money">Mobile money</option>
              <option value="card">Card</option>
            </select>
          </label>
        </aside>
      </div>
    </section>
  );
}
