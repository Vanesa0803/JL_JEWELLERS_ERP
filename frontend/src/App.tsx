import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <div className="flex min-h-screen items-center justify-center text-4xl font-bold">
            Dashboard Coming Soon 🚀
          </div>
        }
      />
    </Routes>
  );
}

export default App;