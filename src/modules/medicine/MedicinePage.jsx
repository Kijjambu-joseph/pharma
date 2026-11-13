import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { AlertTriangle, Boxes, Eye, PackageCheck, Pencil, Pill, Trash2 } from 'lucide-react';
import { medicines as seedMedicines } from '../../data/mockData';

const defaultForm = {
  name: '',
  genericName: '',
  code: '',
  barcode: '',
  category: 'Antibiotic',
  batch: 'BATCH-001',
  price: '',
  stock: '',
  reorderLevel: '',
  supplier: '',
  expiry: '',
  photo: '',
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

  const summaryCards = [
    { label: 'Total medicines', value: summary.total, tone: 'primary', icon: Boxes },
    { label: 'Low stock', value: summary.lowStock, tone: 'warning', icon: AlertTriangle },
    { label: 'Out of stock', value: summary.outOfStock, tone: 'danger', icon: PackageCheck },
    { label: 'Expiring soon', value: summary.expiringSoon, tone: 'neutral', icon: Pill },
  ];

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

  const openAddForm = () => {
    setFormMode('add');
    setFormData(defaultForm);
    setErrors({});
    setIsFormOpen(true);
  };

  const openMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const openEditForm = (medicine) => {
    setFormMode('edit');
    setFormData({
      name: medicine.name,
      genericName: medicine.genericName,
      code: medicine.code,
      barcode: medicine.barcode,
      category: medicine.category,
      batch: medicine.batch || 'BATCH-001',
      price: String(medicine.price),
      stock: String(medicine.stock),
      reorderLevel: String(medicine.reorderLevel),
      supplier: medicine.supplier,
      expiry: medicine.expiry,
      photo: medicine.photo || '',
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

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, photo: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
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
          batch: formData.batch || 'BATCH-001',
          price: Number(formData.price),
          stock: Number(formData.stock),
          reorderLevel: Number(formData.reorderLevel),
          supplier: formData.supplier.trim(),
          expiry: formData.expiry || '2028-01-01',
          photo: formData.photo || '',
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
              batch: formData.batch || medicine.batch || 'BATCH-001',
              price: Number(formData.price),
              stock: nextStock,
              reorderLevel: nextReorder,
              supplier: formData.supplier.trim(),
              expiry: formData.expiry || medicine.expiry,
              photo: formData.photo || medicine.photo || '',
              status: getStatus(nextStock, nextReorder),
            };
          }),
        );
      }

      setLoading(false);
      closeForm();

      toast.success(formMode === 'add' ? 'Medicine saved successfully' : 'Medicine updated successfully');
    }, 250);
  };

  const handleDelete = (medicine) => {
    Swal.fire({
      title: 'Delete medicine?',
      text: `This will remove ${medicine.name} from the inventory catalog. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;

      setMedicineList((current) => current.filter((item) => item.code !== medicine.code));
      setSelectedMedicine(null);
      toast.success(`${medicine.name} deleted successfully`);
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
        {summaryCards.map(({ label, value, tone, icon: Icon }) => (
          <article key={label} className={`stat-card summary-card ${tone === 'warning' ? 'warning-card' : tone === 'danger' ? 'danger-card' : ''}`}>
            <div className="stat-header compact-stat-header">
              <span>{label}</span>
              <span className={`stat-icon ${tone === 'warning' ? 'warning' : tone === 'danger' ? 'danger' : ''}`}>
                <Icon size={20} />
              </span>
            </div>
            <strong>{value}</strong>
          </article>
        ))}
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
                      <th>Batch</th>
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
                            <div className="medicine-thumb">
                              {item.photo ? (
                                <img src={item.photo} alt={item.name} />
                              ) : (
                                <span className="medicine-thumb-placeholder">
                                  <Pill size={16} />
                                </span>
                              )}
                            </div>
                            <div className="medicine-name-meta">
                              <strong>{item.name}</strong>
                              <small>{item.genericName}</small>
                            </div>
                          </div>
                        </td>
                        <td>{item.batch || 'BATCH-001'}</td>
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
                            <button
                              type="button"
                              className="icon-button"
                              onClick={() => openMedicineDetails(item)}
                              aria-label={`View ${item.name}`}
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              className="icon-button"
                              onClick={() => openEditForm(item)}
                              aria-label={`Edit ${item.name}`}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="icon-button danger-icon-button"
                              onClick={() => handleDelete(item)}
                              aria-label={`Delete ${item.name}`}
                              title="Delete"
                            >
                              <Trash2 size={16} />
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

                <div className="medicine-detail-hero">
                  {selectedMedicine.photo ? (
                    <img src={selectedMedicine.photo} alt={selectedMedicine.name} />
                  ) : (
                    <div className="medicine-detail-placeholder">
                      <Pill size={24} />
                    </div>
                  )}
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
                    <span>Batch</span>
                    <strong>{selectedMedicine.batch || 'BATCH-001'}</strong>
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
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Amoxicillin 500mg"
                  />
                  {errors.name && <small>{errors.name}</small>}
                </label>

                <label>
                  <span>Generic name</span>
                  <input
                    name="genericName"
                    value={formData.genericName}
                    onChange={handleChange}
                    placeholder="e.g. Amoxicillin"
                  />
                </label>

                <label>
                  <span>Code</span>
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g. MED-101"
                  />
                  {errors.code && <small>{errors.code}</small>}
                </label>

                <label>
                  <span>Barcode</span>
                  <input
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    placeholder="e.g. 8901234561011"
                  />
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
                  <span>Batch</span>
                  <select name="batch" value={formData.batch} onChange={handleChange}>
                    <option value="BATCH-001">BATCH-001</option>
                    <option value="BATCH-002">BATCH-002</option>
                    <option value="BATCH-003">BATCH-003</option>
                    <option value="BATCH-004">BATCH-004</option>
                    <option value="BATCH-005">BATCH-005</option>
                  </select>
                </label>

                <label>
                  <span>Supplier</span>
                  <input
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="e.g. MediCare Uganda"
                  />
                  {errors.supplier && <small>{errors.supplier}</small>}
                </label>

                <label>
                  <span>Unit price</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2500"
                  />
                  {errors.price && <small>{errors.price}</small>}
                </label>

                <label>
                  <span>Stock quantity</span>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                  {errors.stock && <small>{errors.stock}</small>}
                </label>

                <label>
                  <span>Reorder level</span>
                  <input
                    type="number"
                    name="reorderLevel"
                    value={formData.reorderLevel}
                    onChange={handleChange}
                    placeholder="20"
                  />
                  {errors.reorderLevel && <small>{errors.reorderLevel}</small>}
                </label>

                <label>
                  <span>Expiry date</span>
                  <input type="date" name="expiry" value={formData.expiry} onChange={handleChange} />
                </label>

                <label className="full-width medicine-image-upload">
                  <span>Medicine photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                  {formData.photo && (
                    <div className="form-image-preview">
                      <img src={formData.photo} alt="Medicine preview" />
                    </div>
                  )}
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
