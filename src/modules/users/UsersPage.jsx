import { users } from '../../data/mockData';

export default function UsersPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Access control</p>
          <h2>User management</h2>
        </div>
        <button type="button" className="primary-button">Create user</button>
      </div>

      <div className="panel-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.name}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-pill ${user.status === 'Active' ? 'success' : 'neutral'}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
