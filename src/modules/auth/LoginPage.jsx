import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();

    Swal.fire({
      title: 'Signed in successfully',
      text: 'Welcome back to the Pharmacy POS dashboard.',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });

    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <p className="eyebrow">Authorized access</p>
          <h1>Welcome back</h1>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label>
            <span>Email or username</span>
            <input type="text" defaultValue="nadiak" />
          </label>

          <label>
            <span>Password</span>
            <input type="password" defaultValue="secret123" />
          </label>

          <label>
            <span>Role</span>
            <select defaultValue="pharmacist">
              <option value="pharmacist">Pharmacist</option>
              <option value="cashier">Cashier</option>
              <option value="storekeeper">Storekeeper</option>
              <option value="manager">Manager</option>
            </select>
          </label>

          <button type="submit" className="primary-button wide-button">Sign in</button>
        </form>
      </div>
    </div>
  );
}
