import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import AppShell from './components/AppShell';
import LoginPage from './modules/auth/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1800,
          style: {
            borderRadius: '10px',
            background: '#111827',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
