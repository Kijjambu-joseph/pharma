import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Activity, Download, Filter, Search } from 'lucide-react';
import { auditLogs as auditSeed } from '../../data/mockData';

const severityClassMap = {
  Critical: 'danger',
  Warning: 'warning',
  Info: 'success',
};

const formatTimestamp = (value) =>
  new Intl.DateTimeFormat('en-UG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState(auditSeed);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(auditSeed[0]?.id ?? null);

  const filteredLogs = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return auditLogs.filter((entry) => {
      const matchesFilter = severityFilter === 'All' || entry.severity === severityFilter;
      const haystack = [entry.actor, entry.action, entry.record, entry.module, entry.role].join(' ').toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [auditLogs, searchTerm, severityFilter]);

  const selectedLog = filteredLogs.find((entry) => entry.id === selectedId) ?? null;

  const totalEvents = auditLogs.length;
  const criticalEvents = auditLogs.filter((entry) => entry.severity === 'Critical').length;
  const todayEvents = auditLogs.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    const today = new Date();
    return entryDate.toDateString() === today.toDateString();
  }).length;
  const modulesTracked = new Set(auditLogs.map((entry) => entry.module)).size;

  const handleExport = () => {
    toast.success('Audit log exported successfully');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSeverityFilter('All');
    toast.success('Filters reset');
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Security</p>
          <h2>Audit logs</h2>
        </div>
        <button type="button" className="primary-button" onClick={handleExport}>
          <Download size={16} /> Export logs
        </button>
      </div>

      <div className="stats-grid supplier-summary">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total events</span>
            <span className="stat-icon success"><Activity size={16} /></span>
          </div>
          <strong>{totalEvents}</strong>
          <small>System activity captured</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Critical</span>
            <span className="stat-icon danger"><Activity size={16} /></span>
          </div>
          <strong>{criticalEvents}</strong>
          <small>Priority events requiring review</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Today</span>
            <span className="stat-icon warning"><Filter size={16} /></span>
          </div>
          <strong>{todayEvents}</strong>
          <small>Events recorded today</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Modules</span>
            <span className="stat-icon success"><Activity size={16} /></span>
          </div>
          <strong>{modulesTracked}</strong>
          <small>Tracked areas in the system</small>
        </div>
      </div>

      <div className="content-grid two-columns supplier-layout">
        <div className="panel-card supplier-list-panel">
          <div className="toolbar-row supplier-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search audit entries"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)}>
              <option value="All">All severity</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Actor</th>
                  <th>Module</th>
                  <th>Action</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <strong>No audit entries match your filters.</strong>
                        <span>Try another search or reset the filters.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((entry) => (
                    <tr
                      key={entry.id}
                      className={selectedId === entry.id ? 'supplier-row active' : 'supplier-row'}
                      onClick={() => setSelectedId(entry.id)}
                    >
                      <td>{formatTimestamp(entry.timestamp)}</td>
                      <td>
                        <div className="supplier-name-block">
                          <strong>{entry.actor}</strong>
                          <small>{entry.role}</small>
                        </div>
                      </td>
                      <td>{entry.module}</td>
                      <td>{entry.action}</td>
                      <td>
                        <span className={`status-pill ${severityClassMap[entry.severity] ?? 'neutral'}`}>
                          {entry.severity}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="panel-card detail-panel supplier-detail-panel">
          {selectedLog ? (
            <>
              <div className="detail-header">
                <div>
                  <p className="eyebrow">Event details</p>
                  <h3>{selectedLog.action}</h3>
                </div>
                <span className={`status-pill ${severityClassMap[selectedLog.severity] ?? 'neutral'}`}>
                  {selectedLog.severity}
                </span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Actor</span>
                  <strong>{selectedLog.actor}</strong>
                </div>
                <div>
                  <span>Role</span>
                  <strong>{selectedLog.role}</strong>
                </div>
                <div>
                  <span>Module</span>
                  <strong>{selectedLog.module}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{selectedLog.status}</strong>
                </div>
                <div>
                  <span>Record</span>
                  <strong>{selectedLog.record}</strong>
                </div>
                <div>
                  <span>Timestamp</span>
                  <strong>{formatTimestamp(selectedLog.timestamp)}</strong>
                </div>
                <div className="full-span">
                  <span>Details</span>
                  <strong>{selectedLog.details}</strong>
                </div>
              </div>

              <div className="detail-status-box">
                <div>
                  <small>Impact</small>
                  <strong>{selectedLog.impact}</strong>
                </div>
                <button type="button" className="secondary-button" onClick={handleResetFilters}>
                  Reset filters
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state empty-side-panel">
              <Activity size={24} />
              <strong>No log selected</strong>
              <span>Select a log entry to review the event details.</span>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
