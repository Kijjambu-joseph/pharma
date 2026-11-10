import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { medicines as seedMedicines } from '../../data/mockData';

const defaultForm = {
  name: '',
  genericName: '',
  code: '',
  barcode: '',
  category: 'Antibiotic',
  price: '',
  stock: '',
  reorderLevel: '',
  supplier: '',
  expiry: '',
};

const statusClasses = {
  'In stock': 'success',
  'Low stock': 'warning',
  'Out of stock': 'danger',
};

const getStatus = (stock, reorderLevel) => {
  if (stock <= 0) return 'Out of stock';
  if (stock <= reorderLevel) return 'Low stock';
  return 'In stock';
};

export default function MedicinePage() {
  const [medicineList, setMedicineList] = useState(
    seedMedicines.map((item) => ({
      ...item,
      status: getStatus(item.stock, item.reorderLevel),
    })),
  );
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedMedicine, setSelectedMedicine] = useState(medicineList[0]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredMedicines = useMemo(() => {
    const query = search.trim().toLowerCase();

    return medicineList.filter((medicine) => {
      const matchesSearch =
        !query ||
        medicine.name.toLowerCase().includes(query) ||
        medicine.code.toLowerCase().includes(query) ||
        medicine.barcode.toLowerCase().includes(query) ||
        medicine.genericName.toLowerCase().includes(query);

      const matchesCategory = categoryFilter === 'All' || medicine.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || medicine.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [medicineList, search, categoryFilter, statusFilter]);

  const summary = useMemo(() => {
    const total = medicineList.length;
    const lowStock = medicineList.filter((item) => item.status === 'Low stock').length;
    const outOfStock = medicineList.filter((item) => item.status === 'Out of stock').length;
    const expiringSoon = medicineList.filter((item) => {
      const expiry = new Date(item.expiry);
      const soon = new Date();
      soon.setDate(soon.getDate() + 45);
      return expiry <= soon && item.stock > 0;
    }).length;

    return { total, lowStock, outOfStock, expiringSoon };
  }, [medicineList]);

  const openAddForm = () => {
    setFormMode('add');
    setFormData(defaultForm);
    setErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (medicine) => {
    setFormMode('edit');
    setFormData({
      name: medicine.name,
      genericName: medicine.genericName,
      code: medicine.code,
      barcode: medicine.barcode,
      category: medicine.category,
      price: String(medicine.price),
      stock: String(medicine.stock),
      reorderLevel: String(medicine.reorderLevel),
      supplier: medicine.supplier,
      expiry: medicine.expiry,
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormData(defaultForm);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Medicine name is required';
    if (!formData.code.trim()) nextErrors.code = 'Medicine code is required';
    if (!formData.barcode.trim()) nextErrors.barcode = 'Barcode is required';
    if (!formData.supplier.trim()) nextErrors.supplier = 'Supplier is required';
    if (!formData.price || Number(formData.price) <= 0) nextErrors.price = 'Price must be greater than zero';
    if (formData.stock === '' || Number(formData.stock) < 0) nextErrors.stock = 'Stock must be zero or more';
    if (formData.reorderLevel === '' || Number(formData.reorderLevel) < 0) nextErrors.reorderLevel = 'Reorder level is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    window.setTimeout(() => {
      if (formMode === 'add') {
        const newMedicine = {
          id: Date.now(),
          name: formData.name.trim(),
          genericName: formData.genericName.trim() || formData.name.trim(),
          code: formData.code.trim(),
          barcode: formData.barcode.trim(),
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
          reorderLevel: Number(formData.reorderLevel),
          supplier: formData.supplier.trim(),
          expiry: formData.expiry || '2028-01-01',
          status: getStatus(Number(formData.stock), Number(formData.reorderLevel)),
        };

        setMedicineList((current) => [newMedicine, ...current]);
        setSelectedMedicine(newMedicine);
      } else {
        setMedicineList((current) =>
          current.map((medicine) => {
            if (medicine.code !== formData.code) return medicine;

            const nextStock = Number(formData.stock);
            const nextReorder = Number(formData.reorderLevel);
            return {
              ...medicine,
              name: formData.name.trim(),
              genericName: formData.genericName.trim() || formData.name.trim(),
              barcode: formData.barcode.trim(),
              category: formData.category,
              price: Number(formData.price),
              stock: nextStock,
              reorderLevel: nextReorder,
              supplier: formData.supplier.trim(),
              expiry: formData.expiry || medicine.expiry,
              status: getStatus(nextStock, nextReorder),
            };
          }),
        );
      }

      setLoading(false);
      closeForm();

      Swal.fire({
        title: formMode === 'add' ? 'Medicine saved' : 'Changes saved',
        text: formMode === 'add' ? 'The medicine has been added successfully.' : 'The medicine details were updated successfully.',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }, 250);
  };

  const handleDelete = (medicine) => {
    Swal.fire({
      title: 'Delete medicine?',
      text: `This will remove ${medicine.name} from the inventory catalog. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;

      setMedicineList((current) => current.filter((item) => item.code !== medicine.code));
      setSelectedMedicine(null);

      Swal.fire({
        title: 'Medicine deleted',
        text: `${medicine.name} was removed from the catalog.`,
        icon: 'success',
        timer: 1400,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    });
  };

  return (
    <section className="page-section medicine-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Medicine management</h2>
        </div>
        <button type="button" className="primary-button" onClick={openAddForm}>Add medicine</button>
      </div>

      <div className="stats-grid medicine-summary">
        <article className="stat-card summary-card">
          <span>Total medicines</span>
          <strong>{summary.total}</strong>
        </article>
        <article className="stat-card summary-card warning-card">
          <span>Low stock</span>
          <strong>{summary.lowStock}</strong>
        </article>
        <article className="stat-card summary-card danger-card">
          <span>Out of stock</span>
          <strong>{summary.outOfStock}</strong>
        </article>
        <article className="stat-card summary-card">
          <span>Expiring soon</span>
          <strong>{summary.expiringSoon}</strong>
        </article>
      </div>

      <div className="toolbar-row medicine-toolbar">
        <input
          type="search"
          placeholder="Search by name, code, barcode or generic"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="All">All categories</option>
          <option value="Antibiotic">Antibiotic</option>
          <option value="Analgesic">Analgesic</option>
          <option value="Diabetes">Diabetes</option>
          <option value="Respiratory">Respiratory</option>
          <option value="Gastro">Gastro</option>
          <option value="Supplement">Supplement</option>
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="All">All status</option>
          <option value="In stock">In stock</option>
          <option value="Low stock">Low stock</option>
          <option value="Out of stock">Out of stock</option>
        </select>
      </div>

      {error ? (
        <div className="empty-state error-state">
          <strong>Unable to load medicines.</strong>
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="empty-state">
          <strong>Loading medicines...</strong>
        </div>
      ) : (
        <div className="medicine-layout">
          <div className="panel-card medicine-table-card">
            {filteredMedicines.length === 0 ? (
              <div className="empty-state">
                <strong>No medicines match your filters.</strong>
                <span>Try another search or create a new medicine</span>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Code</th>
                      <th>Category</th>
                      <th>Unit price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicines.map((item) => (
                      <tr key={item.code}>
                        <td>
                          <div className="medicine-name-cell">
                            <strong>{item.name}</strong>
                            <small>{item.genericName}</small>
                          </div>
                        </td>
                        <td>{item.code}</td>
                        <td>{item.category}</td>
                        <td>UGX {item.price.toLocaleString()}</td>
                        <td>{item.stock}</td>
                        <td>
                          <span className={`status-pill ${statusClasses[item.status] || 'neutral'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="inline-actions">
                            <button type="button" className="action-link" onClick={() => setSelectedMedicine(item)}>
                              View
                            </button>
                            <button type="button" className="action-link" onClick={() => openEditForm(item)}>
                              Edit
                            </button>
                            <button type="button" className="action-link danger-link" onClick={() => handleDelete(item)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <aside className="panel-card detail-panel">
            {selectedMedicine ? (
              <>
                <div className="panel-header detail-header">
                  <h3>{selectedMedicine.name}</h3>
                  <button type="button" className="action-link" onClick={() => openEditForm(selectedMedicine)}>
                    Edit
                  </button>
                </div>

                <div className="detail-grid">
                  <div>
                    <span>Generic</span>
                    <strong>{selectedMedicine.genericName}</strong>
                  </div>
                  <div>
                    <span>Barcode</span>
                    <strong>{selectedMedicine.barcode}</strong>
                  </div>
                  <div>
                    <span>Supplier</span>
                    <strong>{selectedMedicine.supplier}</strong>
                  </div>
                  <div>
                    <span>Expiry</span>
                    <strong>{selectedMedicine.expiry}</strong>
                  </div>
                  <div>
                    <span>Price</span>
                    <strong>UGX {selectedMedicine.price.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span>Reorder level</span>
                    <strong>{selectedMedicine.reorderLevel}</strong>
                  </div>
                </div>

                <div className="detail-status-box">
                  <span className={`status-pill ${statusClasses[selectedMedicine.status] || 'neutral'}`}>
                    {selectedMedicine.status}
                  </span>
                  <strong>{selectedMedicine.stock} units available</strong>
                </div>
              </>
            ) : (
              <div className="empty-state empty-side-panel">
                <strong>Select a medicine</strong>
                <span>Choose an item from the list to inspect details.</span>
              </div>
            )}
          </aside>
        </div>
      )}

      {isFormOpen && (
        <div className="modal-backdrop" onClick={closeForm}>
          <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="panel-header">
              <h3>{formMode === 'add' ? 'Add medicine' : 'Edit medicine'}</h3>
              <button type="button" className="action-link" onClick={closeForm}>Close</button>
            </div>

            <form onSubmit={handleSubmit} className="medicine-form">
              <div className="form-grid">
                <label>
                  <span>Medicine name</span>
                  <input name="name" value={formData.name} onChange={handleChange} />
                  {errors.name && <small>{errors.name}</small>}
                </label>

                <label>
                  <span>Generic name</span>
                  <input name="genericName" value={formData.genericName} onChange={handleChange} />
                </label>

                <label>
                  <span>Code</span>
                  <input name="code" value={formData.code} onChange={handleChange} />
                  {errors.code && <small>{errors.code}</small>}
                </label>

                <label>
                  <span>Barcode</span>
                  <input name="barcode" value={formData.barcode} onChange={handleChange} />
                  {errors.barcode && <small>{errors.barcode}</small>}
                </label>

                <label>
                  <span>Category</span>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Gastro">Gastro</option>
                    <option value="Supplement">Supplement</option>
                  </select>
                </label>

                <label>
                  <span>Supplier</span>
                  <input name="supplier" value={formData.supplier} onChange={handleChange} />
                  {errors.supplier && <small>{errors.supplier}</small>}
                </label>

                <label>
                  <span>Unit price</span>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} />
                  {errors.price && <small>{errors.price}</small>}
                </label>

                <label>
                  <span>Stock quantity</span>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
                  {errors.stock && <small>{errors.stock}</small>}
                </label>

                <label>
                  <span>Reorder level</span>
                  <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} />
                  {errors.reorderLevel && <small>{errors.reorderLevel}</small>}
                </label>

                <label>
                  <span>Expiry date</span>
                  <input type="date" name="expiry" value={formData.expiry} onChange={handleChange} />
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={closeForm}>Cancel</button>
                <button type="submit" className="primary-button" disabled={loading}>
                  {loading ? 'Saving...' : formMode === 'add' ? 'Save medicine' : 'Update medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
