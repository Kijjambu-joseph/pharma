import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Lock, PencilLine, Plus, Power, PowerOff, Search, ShieldCheck, Users } from 'lucide-react';
import { users as userSeed } from '../../data/mockData';

const emptyForm = {
  name: '',
  username: '',
  email: '',
  phone: '',
  role: 'Pharmacist',
  department: 'Pharmacy',
  status: 'Active',
  permissions: 'Inventory, Sales, Prescriptions',
};

const formatDate = (value) => {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function UsersPage() {
  const [users, setUsers] = useState(userSeed);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(userSeed[0]?.id ?? null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const haystack = [user.name, user.username, user.email, user.phone, user.department, user.role]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

      return matchesRole && matchesQuery;
    });
  }, [roleFilter, searchTerm, users]);

  useEffect(() => {
    if (!filteredUsers.length) {
      setSelectedId(null);
      return;
    }

    if (!filteredUsers.some((user) => user.id === selectedId)) {
      setSelectedId(filteredUsers[0].id);
    }
  }, [filteredUsers, selectedId]);

  const selectedUser = filteredUsers.find((user) => user.id === selectedId) ?? null;

  const activeUsers = users.filter((user) => user.status === 'Active').length;
  const inactiveUsers = users.filter((user) => user.status === 'Inactive').length;
  const adminUsers = users.filter((user) => ['Manager', 'Administrator'].includes(user.role)).length;

  const openNewUser = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditUser = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      status: user.status,
      permissions: Array.isArray(user.permissions) ? user.permissions.join(', ') : user.permissions ?? '',
    });
    setShowForm(true);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name || !formData.username || !formData.email || !formData.phone || !formData.role || !formData.department) {
      toast.error('Please complete all required user fields.');
      return;
    }

    const parsedPermissions = formData.permissions
      .split(',')
      .map((permission) => permission.trim())
      .filter(Boolean);

    const nextUser = {
      id: editingId ?? Date.now(),
      name: formData.name.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      department: formData.department,
      status: formData.status,
      permissions: parsedPermissions.length ? parsedPermissions : ['View'],
      createdAt: editingId
        ? users.find((user) => user.id === editingId)?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
      lastLogin: editingId
        ? users.find((user) => user.id === editingId)?.lastLogin ?? new Date().toISOString()
        : new Date().toISOString(),
    };

    if (editingId) {
      setUsers((current) => current.map((user) => (user.id === editingId ? nextUser : user)));
      setSelectedId(editingId);
      toast.success(`${nextUser.name} updated successfully`);
    } else {
      setUsers((current) => [nextUser, ...current]);
      setSelectedId(nextUser.id);
      toast.success(`${nextUser.name} added successfully`);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleStatusToggle = (userId = selectedId) => {
    const targetUser = users.find((user) => user.id === userId);
    if (!targetUser) return;

    const nextStatus = targetUser.status === 'Active' ? 'Inactive' : 'Active';
    setUsers((current) =>
      current.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user))
    );
    toast.success(`${targetUser.name} marked as ${nextStatus}`);
  };

  const toggleUserSelection = (userId) => {
    setSelectedIds((current) => {
      if (current.includes(userId)) {
        return current.filter((id) => id !== userId);
      }

      return [...current, userId];
    });
  };

  const toggleAllUsers = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(filteredUsers.map((user) => user.id));
  };

  const bulkStatusToggle = () => {
    if (!selectedIds.length) return;

    const nextState = users.find((user) => selectedIds.includes(user.id))?.status === 'Active' ? 'Inactive' : 'Active';

    setUsers((current) =>
      current.map((user) => (selectedIds.includes(user.id) ? { ...user, status: nextState } : user))
    );

    const names = users.filter((user) => selectedIds.includes(user.id)).map((user) => user.name).join(', ');
    toast.success(`${names || 'Selected users'} marked as ${nextState}`);
    setSelectedIds([]);
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Access control</p>
          <h2>User management</h2>
        </div>
        <button type="button" className="primary-button" onClick={openNewUser}>
          <Plus size={16} /> Create user
        </button>
      </div>

      <div className="stats-grid supplier-summary">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total users</span>
            <span className="stat-icon success"><Users size={16} /></span>
          </div>
          <strong>{users.length}</strong>
          <small>Across all departments</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Active</span>
            <span className="stat-icon success"><ShieldCheck size={16} /></span>
          </div>
          <strong>{activeUsers}</strong>
          <small>Users with access enabled</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Inactive</span>
            <span className="stat-icon warning"><Lock size={16} /></span>
          </div>
          <strong>{inactiveUsers}</strong>
          <small>Pending or disabled accounts</small>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Managers</span>
            <span className="stat-icon danger"><Users size={16} /></span>
          </div>
          <strong>{adminUsers}</strong>
          <small>Leadership and admin roles</small>
        </div>
      </div>

      <div className="content-grid two-columns supplier-layout">
        <div className="panel-card supplier-list-panel">
          <div className="toolbar-row supplier-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="All">All roles</option>
              <option value="Manager">Manager</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Cashier">Cashier</option>
              <option value="Storekeeper">Storekeeper</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          {selectedIds.length > 0 && (
            <div className="bulk-actions">
              <strong>{selectedIds.length} selected</strong>
              <div className="inline-actions">
                <button type="button" className="status-toggle-button" onClick={bulkStatusToggle} aria-label="Toggle selected users">
                  {users.find((user) => selectedIds.includes(user.id))?.status === 'Active' ? <PowerOff size={15} /> : <Power size={15} />}
                </button>
              </div>
            </div>
          )}

          <div className="table-wrapper">
            <table className="batch-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length}
                      onChange={toggleAllUsers}
                      aria-label="Select all users"
                    />
                  </th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <strong>No users match your filters.</strong>
                        <span>Try another search or create a new user.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`${selectedId === user.id ? 'supplier-row active' : 'supplier-row'} ${selectedIds.includes(user.id) ? 'selected' : ''}`}
                      onClick={() => setSelectedId(user.id)}
                    >
                      <td onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          aria-label={`Select ${user.name}`}
                        />
                      </td>
                      <td>
                        <div className="supplier-name-block">
                          <strong>{user.name}</strong>
                          <small>{user.username}</small>
                        </div>
                      </td>
                      <td>{user.role}</td>
                      <td>{user.department}</td>
                      <td>
                        <span className={`status-pill ${user.status === 'Active' ? 'success' : 'neutral'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="inline-actions" onClick={(event) => event.stopPropagation()}>
                          <button type="button" className="icon-button" onClick={() => setSelectedId(user.id)} aria-label="View user">
                            <Eye size={15} />
                          </button>
                          <button type="button" className="icon-button" onClick={() => openEditUser(user)} aria-label="Edit user">
                            <PencilLine size={15} />
                          </button>
                          <button type="button" className="status-toggle-button" onClick={() => handleStatusToggle(user.id)} aria-label={user.status === 'Active' ? 'Deactivate user' : 'Activate user'}>
                            {user.status === 'Active' ? <PowerOff size={15} /> : <Power size={15} />}
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
          {selectedUser ? (
            <>
              <div className="detail-header">
                <div>
                  <p className="eyebrow">User profile</p>
                  <h3>{selectedUser.name}</h3>
                </div>
                <span className={`status-pill ${selectedUser.status === 'Active' ? 'success' : 'neutral'}`}>
                  {selectedUser.status}
                </span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Username</span>
                  <strong>{selectedUser.username}</strong>
                </div>
                <div>
                  <span>Role</span>
                  <strong>{selectedUser.role}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{selectedUser.email}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{selectedUser.phone}</strong>
                </div>
                <div>
                  <span>Department</span>
                  <strong>{selectedUser.department}</strong>
                </div>
                <div>
                  <span>Last login</span>
                  <strong>{formatDate(selectedUser.lastLogin)}</strong>
                </div>
                <div className="full-span">
                  <span>Permissions</span>
                  <strong>{selectedUser.permissions?.join(', ') || 'No permissions assigned'}</strong>
                </div>
              </div>

              <div className="detail-status-box">
                <div>
                  <small>Account status</small>
                  <strong>{selectedUser.status === 'Active' ? 'Access enabled' : 'Access disabled'}</strong>
                </div>
                <button type="button" className="secondary-button icon-toggle-button" onClick={handleStatusToggle} aria-label={selectedUser.status === 'Active' ? 'Deactivate user' : 'Activate user'}>
                  {selectedUser.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                </button>
              </div>

              <div>
                <div className="panel-header compact-header">
                  <h3>Access scope</h3>
                </div>
                <div className="stack-list">
                  {selectedUser.permissions?.map((permission) => (
                    <div key={permission} className="stack-row supplier-history-item">
                      <div>
                        <strong>{permission}</strong>
                        <small>{selectedUser.department}</small>
                      </div>
                      <span className="mini-badge success">Granted</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state empty-side-panel">
              <Users size={26} />
              <strong>No user selected</strong>
              <span>Select a user to review their access and permissions.</span>
            </div>
          )}
        </aside>
      </div>

      {showForm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel supplier-modal">
            <div className="panel-header modal-head">
              <div>
                <p className="eyebrow">User form</p>
                <h3>{editingId ? 'Edit user' : 'Add user'}</h3>
              </div>
              <button type="button" className="modal-close-button" onClick={() => setShowForm(false)} aria-label="Close user form">
                ×
              </button>
            </div>

            <form className="medicine-form supplier-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Full name
                  <input type="text" name="name" value={formData.name} onChange={handleFieldChange} required />
                </label>

                <label>
                  Username
                  <input type="text" name="username" value={formData.username} onChange={handleFieldChange} required />
                </label>

                <label>
                  Email
                  <input type="email" name="email" value={formData.email} onChange={handleFieldChange} required />
                </label>

                <label>
                  Phone
                  <input type="tel" name="phone" value={formData.phone} onChange={handleFieldChange} required />
                </label>

                <label>
                  Role
                  <select name="role" value={formData.role} onChange={handleFieldChange}>
                    <option value="Manager">Manager</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Storekeeper">Storekeeper</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </label>

                <label>
                  Department
                  <select name="department" value={formData.department} onChange={handleFieldChange}>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Sales">Sales</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Administration">Administration</option>
                  </select>
                </label>

                <label>
                  Status
                  <select name="status" value={formData.status} onChange={handleFieldChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>

                <label className="full-width">
                  Permissions
                  <input
                    type="text"
                    name="permissions"
                    value={formData.permissions}
                    onChange={handleFieldChange}
                    placeholder="Inventory, Sales, Prescriptions"
                  />
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingId ? 'Update user' : 'Save user'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
