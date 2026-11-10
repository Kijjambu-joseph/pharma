import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppShell from './components/AppShell';
import LoginPage from './modules/auth/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
