import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FileText, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { prescriptions as prescriptionSeed, medicines } from '../../data/mockData';

const emptyLine = {
  id: Date.now(),
  medicine: '',
  dosage: '',
  quantity: 1,
  frequency: 'Twice daily',
  duration: '5 days',
  status: 'Pending',
};

const statusClassMap = {
  Pending: 'warning',
  Reviewed: 'neutral',
  Dispensed: 'success',
  Cancelled: 'danger',
};

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(prescriptionSeed);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReference, setSelectedReference] = useState(prescriptionSeed[0]?.reference ?? null);
  const [showForm, setShowForm] = useState(false);
  const [patient, setPatient] = useState('');
  const [prescriber, setPrescriber] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState([{ ...emptyLine, id: Date.now() }]);

  const filteredPrescriptions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return prescriptions.filter((entry) => {
      const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
      const haystack = `${entry.patient} ${entry.reference} ${entry.prescriber}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [prescriptions, searchTerm, statusFilter]);

  useMemo(() => {
    if (!filteredPrescriptions.length) {
      setSelectedReference(null);
      return;
    }

    if (!filteredPrescriptions.some((entry) => entry.reference === selectedReference)) {
      setSelectedReference(filteredPrescriptions[0].reference);
    }
  }, [filteredPrescriptions, selectedReference]);

  const selectedPrescription = filteredPrescriptions.find((entry) => entry.reference === selectedReference) ?? null;

  const totalPending = prescriptions.filter((entry) => entry.status === 'Pending').length;
  const totalDispensed = prescriptions.filter((entry) => entry.status === 'Dispensed').length;

  const updateLine = (id, field, value) => {
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, [field]: field === 'quantity' ? Number(value || 0) : value } : line))
    );
  };

  const addLine = () => {
    setLines((current) => [...current, { ...emptyLine, id: Date.now() + Math.random() }]);
  };

  const removeLine = (id) => {
    setLines((current) => {
      if (current.length === 1) return [{ ...emptyLine, id: Date.now() + Math.random() }];
      return current.filter((line) => line.id !== id);
    });
  };

  const handleSavePrescription = (event) => {
    event.preventDefault();

    if (!patient || !prescriber || !reference || !lines.some((line) => line.medicine && line.dosage)) {
      toast.error('Please complete patient, prescriber, reference, and at least one medicine item.');
      return;
    }

    const newRecord = {
      patient: patient.trim(),
      reference: reference.trim(),
      prescriber: prescriber.trim(),
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
      notes: notes.trim(),
      medicines: lines.map((line) => ({
        medicine: line.medicine,
        dosage: line.dosage,
        quantity: line.quantity,
        frequency: line.frequency,
        duration: line.duration,
      })),
    };

    setPrescriptions((current) => [newRecord, ...current]);
    setSelectedReference(newRecord.reference);
    setShowForm(false);
    setPatient('');
    setPrescriber('');
    setReference('');
    setNotes('');
    setLines([{ ...emptyLine, id: Date.now() }]);
    toast.success(`Prescription ${newRecord.reference} saved successfully`);
  };

  const handleDelete = (prescriptionReference) => {
    const record = prescriptions.find((entry) => entry.reference === prescriptionReference);
    if (!record) return;

    Swal.fire({
      title: 'Delete prescription?',
      text: `This will remove ${record.reference} from the prescription list.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;

      const next = prescriptions.filter((entry) => entry.reference !== prescriptionReference);
      setPrescriptions(next);
      setSelectedReference(next[0]?.reference ?? null);
      toast.success(`${record.reference} deleted successfully`);
    });
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedPrescription) return;

    setPrescriptions((current) =>
      current.map((entry) =>
        entry.reference === selectedPrescription.reference ? { ...entry, status: newStatus } : entry,
      ),
    );
    toast.success(`Prescription marked as ${newStatus}`);
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Clinical records</p>
          <h2>Prescription monitoring</h2>
        </div>
        <button type="button" className="primary-button" onClick={() => setShowForm(true)}>
          <Plus size={16} /> New prescription
        </button>
      </div>

      <div className="stats-grid supplier-summary prescription-summary">
        <div className="stat-card">
          <div className="stat-header">
            <span>Open</span>
            <span className="stat-icon warning"><FileText size={16} /></span>
          </div>
          <strong>{totalPending}</strong>
          <small>Awaiting review</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Dispensed</span>
            <span className="stat-icon success"><ShieldCheck size={16} /></span>
          </div>
          <strong>{totalDispensed}</strong>
          <small>Completed today</small>
        </div>
      </div>

      <div className="content-grid two-columns supplier-layout prescription-layout">
        <div className="panel-card supplier-list-panel">
          <div className="toolbar-row supplier-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search prescriptions"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="All">All status</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Dispensed">Dispensed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Reference</th>
                  <th>Prescriber</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <strong>No prescriptions match your filters.</strong>
                        <span>Try a new search or record a prescription.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((entry) => (
                    <tr key={entry.reference} className={selectedReference === entry.reference ? 'supplier-row active' : 'supplier-row'} onClick={() => setSelectedReference(entry.reference)}>
                      <td>{entry.patient}</td>
                      <td>{entry.reference}</td>
                      <td>{entry.prescriber}</td>
                      <td>
                        <span className={`status-pill ${statusClassMap[entry.status] ?? 'neutral'}`}>{entry.status}</span>
                      </td>
                      <td>
                        <button type="button" className="icon-button danger-icon-button" onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(entry.reference);
                        }} aria-label="Delete prescription">
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
          {selectedPrescription ? (
            <>
              <div className="detail-header">
                <div>
                  <p className="eyebrow">Prescription record</p>
                  <h3>{selectedPrescription.reference}</h3>
                </div>
                <span className={`status-pill ${statusClassMap[selectedPrescription.status] ?? 'neutral'}`}>
                  {selectedPrescription.status}
                </span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Patient</span>
                  <strong>{selectedPrescription.patient}</strong>
                </div>
                <div>
                  <span>Prescriber</span>
                  <strong>{selectedPrescription.prescriber}</strong>
                </div>
                <div>
                  <span>Date</span>
                  <strong>{selectedPrescription.date}</strong>
                </div>
                <div>
                  <span>Items</span>
                  <strong>{selectedPrescription.medicines?.length ?? 0}</strong>
                </div>
              </div>

              <div className="detail-status-box">
                <div>
                  <small>Dispensing status</small>
                  <strong>{selectedPrescription.status}</strong>
                </div>
                <div className="inline-actions compact-actions">
                  <button type="button" className="secondary-button" onClick={() => handleStatusChange('Reviewed')}>Review</button>
                  <button type="button" className="primary-button" onClick={() => handleStatusChange('Dispensed')}>Dispense</button>
                </div>
              </div>

              <div>
                <div className="panel-header compact-header">
                  <h3>Medicine list</h3>
                </div>
                <div className="stack-list">
                  {(selectedPrescription.medicines ?? []).map((line) => (
                    <div key={`${selectedPrescription.reference}-${line.medicine}-${line.dosage}`} className="stack-row supplier-history-item">
                      <div>
                        <strong>{line.medicine}</strong>
                        <small>{line.dosage} • {line.frequency}</small>
                      </div>
                      <div className="history-meta">
                        <strong>{line.quantity} pack(s)</strong>
                        <span className="mini-badge neutral">{line.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state empty-side-panel">
              <FileText size={26} />
              <strong>No prescription selected</strong>
              <span>Select a prescription to inspect details.</span>
            </div>
          )}
        </aside>
      </div>

      {showForm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel supplier-modal purchase-modal">
            <div className="panel-header modal-head">
              <div>
                <p className="eyebrow">Clinical form</p>
                <h3>New prescription</h3>
              </div>
              <button type="button" className="modal-close-button" onClick={() => setShowForm(false)} aria-label="Close prescription form">×</button>
            </div>

            <form className="medicine-form supplier-form purchase-form" onSubmit={handleSavePrescription}>
              <div className="form-grid purchase-header-grid">
                <label>
                  Patient name
                  <input type="text" value={patient} onChange={(event) => setPatient(event.target.value)} required />
                </label>

                <label>
                  Prescriber
                  <input type="text" value={prescriber} onChange={(event) => setPrescriber(event.target.value)} required />
                </label>

                <label className="full-width">
                  Prescription reference
                  <input type="text" value={reference} onChange={(event) => setReference(event.target.value)} required />
                </label>

                <label className="full-width">
                  Notes
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="3" placeholder="Symptoms, dosage notes, or alerts" />
                </label>
              </div>

              <div className="purchase-items-block">
                <div className="panel-header compact-header">
                  <h3>Prescribed medicines</h3>
                  <button type="button" className="secondary-button" onClick={addLine}>Add item</button>
                </div>

                {lines.map((line) => (
                  <div key={line.id} className="purchase-item-row purchase-item-editor">
                    <div className="purchase-item-grid">
                      <label>
                        Medicine
                        <select value={line.medicine} onChange={(event) => updateLine(line.id, 'medicine', event.target.value)} required>
                          <option value="">Select medicine</option>
                          {medicines.map((item) => (
                            <option key={item.id} value={item.name}>{item.name}</option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Dosage
                        <input type="text" value={line.dosage} onChange={(event) => updateLine(line.id, 'dosage', event.target.value)} placeholder="500mg" required />
                      </label>

                      <label>
                        Quantity
                        <input type="number" min="1" value={line.quantity} onChange={(event) => updateLine(line.id, 'quantity', event.target.value)} required />
                      </label>

                      <label>
                        Frequency
                        <select value={line.frequency} onChange={(event) => updateLine(line.id, 'frequency', event.target.value)}>
                          <option>Once daily</option>
                          <option>Twice daily</option>
                          <option>Three times daily</option>
                          <option>As needed</option>
                        </select>
                      </label>

                      <label>
                        Duration
                        <input type="text" value={line.duration} onChange={(event) => updateLine(line.id, 'duration', event.target.value)} placeholder="5 days" required />
                      </label>
                    </div>

                    {lines.length > 1 && (
                      <div className="purchase-row-total">
                        <span className="mini-badge neutral">Line item</span>
                        <button type="button" className="icon-button danger-icon-button" onClick={() => removeLine(line.id)} aria-label="Remove medicine line">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="primary-button">Save prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
