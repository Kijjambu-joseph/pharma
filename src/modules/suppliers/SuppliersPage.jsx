import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Eye, PencilLine, Phone, Plus, Search, Trash2, Warehouse } from 'lucide-react';
import { suppliers as supplierSeed } from '../../data/mockData';

const emptyForm = {
  name: '',
  contact: '',
  email: '',
  phone: '',
  address: '',
  status: 'Active',
  creditLimit: 1000000,
  balance: 0,
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(supplierSeed);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(supplierSeed[0]?.id ?? null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filteredSuppliers = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesStatus = statusFilter === 'All' || supplier.status === statusFilter;
      const haystack = [supplier.name, supplier.contact, supplier.phone, supplier.email]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [searchTerm, statusFilter, suppliers]);

  useEffect(() => {
    if (!filteredSuppliers.length) {
      setSelectedId(null);
      return;
    }

    if (!filteredSuppliers.some((supplier) => supplier.id === selectedId)) {
      setSelectedId(filteredSuppliers[0].id);
    }
  }, [filteredSuppliers, selectedId]);

  const selectedSupplier = filteredSuppliers.find((supplier) => supplier.id === selectedId) ?? null;

  const totalBalances = suppliers.reduce((total, supplier) => total + supplier.balance, 0);
  const activeSuppliers = suppliers.filter((supplier) => supplier.status === 'Active').length;
  const pendingSuppliers = suppliers.filter((supplier) => supplier.balance > supplier.creditLimit).length;

  const openNewSupplier = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditSupplier = (supplier) => {
    setEditingId(supplier.id);
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      status: supplier.status,
      creditLimit: supplier.creditLimit,
      balance: supplier.balance,
    });
    setShowForm(true);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'creditLimit' || name === 'balance' ? Number(value || 0) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name || !formData.contact || !formData.phone || !formData.email || !formData.address) {
      toast.error('Please fill in all required supplier fields.');
      return;
    }

    const nextSupplier = {
      id: editingId ?? Date.now(),
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      status: formData.status,
      balance: Number(formData.balance || 0),
      creditLimit: Number(formData.creditLimit || 0),
      lastOrder: new Date().toISOString().slice(0, 10),
      purchaseHistory: editingId
        ? suppliers.find((supplier) => supplier.id === editingId)?.purchaseHistory ?? []
        : [
            { id: `PO-${Date.now().toString().slice(-4)}`, date: new Date().toISOString().slice(0, 10), total: 0, status: 'New' },
          ],
    };

    if (editingId) {
      setSuppliers((current) =>
        current.map((supplier) => (supplier.id === editingId ? nextSupplier : supplier))
      );
      setSelectedId(editingId);
      toast.success(`${nextSupplier.name} updated successfully`);
    } else {
      setSuppliers((current) => [nextSupplier, ...current]);
      setSelectedId(nextSupplier.id);
      toast.success(`${nextSupplier.name} added successfully`);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDeleteSupplier = (supplierId) => {
    const supplier = suppliers.find((item) => item.id === supplierId);
    if (!supplier) return;

    Swal.fire({
      title: 'Delete supplier?',
      text: `This will remove ${supplier.name} from the supplier list. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete supplier',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;

      const nextSuppliers = suppliers.filter((item) => item.id !== supplierId);
      setSuppliers(nextSuppliers);
      setSelectedId(nextSuppliers[0]?.id ?? null);
      toast.success(`${supplier.name} deleted successfully`);
    });
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Supply chain</p>
          <h2>Supplier management</h2>
        </div>
        <button type="button" className="primary-button" onClick={openNewSupplier}>
          <Plus size={16} /> New supplier
        </button>
      </div>

      <div className="stats-grid supplier-summary">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total suppliers</span>
            <span className="stat-icon success"><Warehouse size={16} /></span>
          </div>
          <strong>{suppliers.length}</strong>
          <small>Across all supply channels</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Active</span>
            <span className="stat-icon success"><Warehouse size={16} /></span>
          </div>
          <strong>{activeSuppliers}</strong>
          <small>Approved and trading</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Payables</span>
            <span className="stat-icon warning"><Phone size={16} /></span>
          </div>
          <strong>{formatCurrency(totalBalances)}</strong>
          <small>Outstanding supplier balances</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Credit risk</span>
            <span className="stat-icon danger"><Warehouse size={16} /></span>
          </div>
          <strong>{pendingSuppliers}</strong>
          <small>Suppliers beyond credit limit</small>
        </div>
      </div>

      <div className="content-grid two-columns supplier-layout">
        <div className="panel-card supplier-list-panel">
          <div className="toolbar-row supplier-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search suppliers"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All">All status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Contact</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <strong>No suppliers match your filters.</strong>
                        <span>Try adjusting the search or add a new supplier.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className={selectedId === supplier.id ? 'supplier-row active' : 'supplier-row'}
                      onClick={() => setSelectedId(supplier.id)}
                    >
                      <td>
                        <div className="supplier-name-block">
                          <strong>{supplier.name}</strong>
                          <small>{supplier.email}</small>
                        </div>
                      </td>
                      <td>
                        <div className="supplier-name-block">
                          <strong>{supplier.contact}</strong>
                          <small>{supplier.phone}</small>
                        </div>
                      </td>
                      <td>{formatCurrency(supplier.balance)}</td>
                      <td>
                        <span className={`status-pill ${supplier.status === 'Active' ? 'success' : 'neutral'}`}>
                          {supplier.status}
                        </span>
                      </td>
                      <td>
                        <div className="inline-actions" onClick={(event) => event.stopPropagation()}>
                          <button type="button" className="icon-button" onClick={() => setSelectedId(supplier.id)} aria-label="View supplier">
                            <Eye size={15} />
                          </button>
                          <button type="button" className="icon-button" onClick={() => openEditSupplier(supplier)} aria-label="Edit supplier">
                            <PencilLine size={15} />
                          </button>
                          <button type="button" className="icon-button danger-icon-button" onClick={() => handleDeleteSupplier(supplier.id)} aria-label="Delete supplier">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="panel-card detail-panel supplier-detail-panel">
          {selectedSupplier ? (
            <>
              <div className="detail-header">
                <div>
                  <p className="eyebrow">Supplier profile</p>
                  <h3>{selectedSupplier.name}</h3>
                </div>
                <span className={`status-pill ${selectedSupplier.status === 'Active' ? 'success' : 'neutral'}`}>
                  {selectedSupplier.status}
                </span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Contact</span>
                  <strong>{selectedSupplier.contact}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{selectedSupplier.phone}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{selectedSupplier.email}</strong>
                </div>
                <div>
                  <span>Last order</span>
                  <strong>{selectedSupplier.lastOrder}</strong>
                </div>
                <div className="full-span">
                  <span>Address</span>
                  <strong>{selectedSupplier.address}</strong>
                </div>
                <div>
                  <span>Credit limit</span>
                  <strong>{formatCurrency(selectedSupplier.creditLimit)}</strong>
                </div>
                <div>
                  <span>Balance due</span>
                  <strong>{formatCurrency(selectedSupplier.balance)}</strong>
                </div>
              </div>

              <div className="detail-status-box">
                <div>
                  <small>Payment status</small>
                  <strong>{selectedSupplier.balance > selectedSupplier.creditLimit ? 'Above limit' : 'Within limit'}</strong>
                </div>
                <button type="button" className="secondary-button" onClick={() => openEditSupplier(selectedSupplier)}>
                  Edit supplier
                </button>
              </div>

              <div>
                <div className="panel-header compact-header">
                  <h3>Purchase history</h3>
                </div>
                <div className="stack-list">
                  {selectedSupplier.purchaseHistory?.map((record) => (
                    <div key={record.id} className="stack-row supplier-history-item">
                      <div>
                        <strong>{record.id}</strong>
                        <small>{record.date}</small>
                      </div>
                      <div className="history-meta">
                        <strong>{formatCurrency(record.total)}</strong>
                        <span className={`mini-badge ${record.status === 'Pending' ? 'warning' : record.status === 'Overdue' ? 'danger' : 'success'}`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state empty-side-panel">
              <Warehouse size={26} />
              <strong>No supplier selected</strong>
              <span>Select a supplier to review account details.</span>
            </div>
          )}
        </aside>
      </div>

      {showForm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel supplier-modal">
            <div className="panel-header modal-head">
              <div>
                <p className="eyebrow">Supplier form</p>
                <h3>{editingId ? 'Edit supplier' : 'Add supplier'}</h3>
              </div>
              <button type="button" className="modal-close-button" onClick={() => setShowForm(false)} aria-label="Close supplier form">
                ×
              </button>
            </div>

            <form className="medicine-form supplier-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Supplier name
                  <input type="text" name="name" value={formData.name} onChange={handleFieldChange} required />
                </label>

                <label>
                  Contact person
                  <input type="text" name="contact" value={formData.contact} onChange={handleFieldChange} required />
                </label>

                <label>
                  Email
                  <input type="email" name="email" value={formData.email} onChange={handleFieldChange} required />
                </label>

                <label>
                  Phone
                  <input type="tel" name="phone" value={formData.phone} onChange={handleFieldChange} required />
                </label>

                <label className="full-width">
                  Address
                  <input type="text" name="address" value={formData.address} onChange={handleFieldChange} required />
                </label>

                <label>
                  Status
                  <select name="status" value={formData.status} onChange={handleFieldChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>

                <label>
                  Credit limit
                  <input type="number" min="0" name="creditLimit" value={formData.creditLimit} onChange={handleFieldChange} />
                </label>

                <label>
                  Current balance
                  <input type="number" min="0" name="balance" value={formData.balance} onChange={handleFieldChange} />
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingId ? 'Update supplier' : 'Save supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
