import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;