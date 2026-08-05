import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F6F2] px-6">
      <section className="w-full max-w-3xl rounded-2xl bg-white p-10 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#B8860B]">
          JL Jewellers ERP
        </p>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Login successful. Your session token has been saved.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 rounded-xl bg-[#2A0E06] px-6 py-3 font-semibold text-white transition hover:bg-[#4A1D12]"
        >
          Logout
        </button>
      </section>
    </main>
  );
};

export default Dashboard;
