import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Plus, Search, Trash2, PackageCheck, Truck, Warehouse } from 'lucide-react';
import { purchases as purchaseSeed, suppliers, medicines } from '../../data/mockData';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(value || 0);

const emptyItem = {
  id: Date.now(),
  medicine: '',
  quantity: 1,
  unitCost: 0,
  batch: '',
  expiry: '',
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState(purchaseSeed);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(purchaseSeed[0]?.id ?? null);
  const [showForm, setShowForm] = useState(false);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? '');
  const [items, setItems] = useState([{ ...emptyItem, id: Date.now() }]);

  const filteredPurchases = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return purchases.filter((order) => {
      if (!query) return true;
      return `${order.id} ${order.supplier} ${order.date}`.toLowerCase().includes(query);
    });
  }, [searchTerm, purchases]);

  const selectedPurchase = filteredPurchases.find((order) => order.id === selectedPurchaseId) ?? null;

  const subtotal = items.reduce((total, item) => {
    const medicine = medicines.find((entry) => entry.name === item.medicine);
    const price = Number(item.unitCost || 0);
    return total + Number(item.quantity || 0) * price;
  }, 0);

  const updateItem = (id, field, value) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        return { ...item, [field]: field === 'quantity' || field === 'unitCost' ? Number(value || 0) : value };
      }),
    );
  };

  const addItemRow = () => {
    setItems((current) => [...current, { ...emptyItem, id: Date.now() + Math.random() }]);
  };

  const removeItemRow = (id) => {
    setItems((current) => {
      if (current.length === 1) return [{ ...emptyItem, id: Date.now() + Math.random() }];
      return current.filter((item) => item.id !== id);
    });
  };

  const handleSavePurchase = (event) => {
    event.preventDefault();

    const validItems = items.filter((item) => item.medicine && item.quantity > 0 && item.unitCost > 0 && item.batch && item.expiry);
    if (!supplierId || validItems.length === 0) {
      toast.error('Select a supplier and add at least one valid item.');
      return;
    }

    const supplier = suppliers.find((entry) => entry.id === Number(supplierId));
    const orderId = `PO-${Date.now().toString().slice(-5)}`;
    const orderTotal = validItems.reduce((total, item) => total + item.quantity * item.unitCost, 0);

    const newOrder = {
      id: orderId,
      supplier: supplier?.name ?? 'Supplier',
      date: new Date().toISOString().slice(0, 10),
      total: orderTotal,
      status: 'Received',
      items: validItems.map((item) => ({
        ...item,
        medicineName: item.medicine,
        total: item.quantity * item.unitCost,
      })),
    };

    setPurchases((current) => [newOrder, ...current]);
    setSelectedPurchaseId(orderId);
    setShowForm(false);
    setSupplierId(suppliers[0]?.id ?? '');
    setItems([{ ...emptyItem, id: Date.now() }]);
    toast.success(`Purchase ${orderId} recorded successfully`);
  };

  const handleDeletePurchase = (purchaseId) => {
    const purchase = purchases.find((item) => item.id === purchaseId);
    if (!purchase) return;

    Swal.fire({
      title: 'Delete purchase order?',
      text: `This will remove ${purchase.id} from the purchase history.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;

      const next = purchases.filter((item) => item.id !== purchaseId);
      setPurchases(next);
      setSelectedPurchaseId(next[0]?.id ?? null);
      toast.success(`${purchase.id} deleted successfully`);
    });
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Procurement</p>
          <h2>Purchase orders</h2>
        </div>
        <button type="button" className="primary-button" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Record purchase
        </button>
      </div>

      <div className="stats-grid supplier-summary purchases-summary">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total orders</span>
            <span className="stat-icon success"><PackageCheck size={16} /></span>
          </div>
          <strong>{purchases.length}</strong>
          <small>Across all suppliers</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Monthly spend</span>
            <span className="stat-icon warning"><Truck size={16} /></span>
          </div>
          <strong>{formatCurrency(purchases.reduce((sum, item) => sum + Number(item.total || 0), 0))}</strong>
          <small>Current purchase total</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Suppliers</span>
            <span className="stat-icon danger"><Warehouse size={16} /></span>
          </div>
          <strong>{new Set(purchases.map((order) => order.supplier)).size}</strong>
          <small>Active trading partners</small>
        </div>
      </div>

      <div className="content-grid two-columns supplier-layout purchase-layout">
        <div className="panel-card supplier-list-panel">
          <div className="toolbar-row supplier-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search purchase orders"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <strong>No purchase orders found.</strong>
                        <span>Record a new purchase to get started.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className={selectedPurchaseId === purchase.id ? 'supplier-row active' : 'supplier-row'} onClick={() => setSelectedPurchaseId(purchase.id)}>
                      <td>{purchase.id}</td>
                      <td>{purchase.supplier}</td>
                      <td>{purchase.date}</td>
                      <td>{formatCurrency(purchase.total)}</td>
                      <td>
                        <button type="button" className="icon-button danger-icon-button" onClick={(event) => {
                          event.stopPropagation();
                          handleDeletePurchase(purchase.id);
                        }} aria-label="Delete purchase">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="panel-card detail-panel supplier-detail-panel">
          {selectedPurchase ? (
            <>
              <div className="detail-header">
                <div>
                  <p className="eyebrow">Purchase details</p>
                  <h3>{selectedPurchase.id}</h3>
                </div>
                <span className="status-pill success">{selectedPurchase.status ?? 'Received'}</span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Supplier</span>
                  <strong>{selectedPurchase.supplier}</strong>
                </div>
                <div>
                  <span>Date</span>
                  <strong>{selectedPurchase.date}</strong>
                </div>
                <div>
                  <span>Items</span>
                  <strong>{selectedPurchase.items?.length ?? 0}</strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>{formatCurrency(selectedPurchase.total)}</strong>
                </div>
              </div>

              <div className="stack-list">
                {(selectedPurchase.items ?? []).map((item) => (
                  <div key={`${selectedPurchase.id}-${item.medicineName}-${item.batch}`} className="stack-row purchase-item-row">
                    <div>
                      <strong>{item.medicineName}</strong>
                      <small>{item.batch} • Expires {item.expiry}</small>
                    </div>
                    <div className="history-meta">
                      <strong>{item.quantity} × {formatCurrency(item.unitCost)}</strong>
                      <span className="mini-badge success">{formatCurrency(item.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state empty-side-panel">
              <PackageCheck size={26} />
              <strong>No purchase selected</strong>
              <span>Select a purchase to view details.</span>
            </div>
          )}
        </aside>
      </div>

      {showForm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel supplier-modal purchase-modal">
            <div className="panel-header modal-head">
              <div>
                <p className="eyebrow">Procurement</p>
                <h3>Record purchase</h3>
              </div>
              <button type="button" className="modal-close-button" onClick={() => setShowForm(false)} aria-label="Close purchase form">×</button>
            </div>

            <form className="medicine-form supplier-form purchase-form" onSubmit={handleSavePurchase}>
              <div className="form-grid purchase-header-grid">
                <label>
                  Supplier
                  <select value={supplierId} onChange={(event) => setSupplierId(event.target.value)} required>
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Date
                  <input type="date" defaultValue={new Date().toISOString().slice(0, 10)} readOnly />
                </label>
              </div>

              <div className="purchase-items-block">
                <div className="panel-header compact-header">
                  <h3>Items received</h3>
                  <button type="button" className="secondary-button" onClick={addItemRow}>Add item</button>
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="purchase-item-row purchase-item-editor">
                    <div className="purchase-item-grid">
                      <label>
                        Medicine
                        <select value={item.medicine} onChange={(event) => updateItem(item.id, 'medicine', event.target.value)} required>
                          <option value="">Select medicine</option>
                          {medicines.map((medicine) => (
                            <option key={medicine.id} value={medicine.name}>{medicine.name}</option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Quantity
                        <input type="number" min="1" value={item.quantity} onChange={(event) => updateItem(item.id, 'quantity', event.target.value)} required />
                      </label>

                      <label>
                        Unit cost
                        <input type="number" min="1" value={item.unitCost} onChange={(event) => updateItem(item.id, 'unitCost', event.target.value)} required />
                      </label>

                      <label>
                        Batch
                        <input type="text" value={item.batch} onChange={(event) => updateItem(item.id, 'batch', event.target.value)} placeholder="e.g. AMX-109" required />
                      </label>

                      <label>
                        Expiry
                        <input type="date" value={item.expiry} onChange={(event) => updateItem(item.id, 'expiry', event.target.value)} required />
                      </label>
                    </div>

                    <div className="purchase-row-total">
                      <strong>{formatCurrency(Number(item.quantity || 0) * Number(item.unitCost || 0))}</strong>
                      {items.length > 1 && (
                        <button type="button" className="icon-button danger-icon-button" onClick={() => removeItemRow(item.id)} aria-label="Remove item">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="totals-card purchase-total-box">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <strong>{formatCurrency(0)}</strong>
                </div>
                <div className="summary-row change-row">
                  <span>Grand total</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="primary-button">Save purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
