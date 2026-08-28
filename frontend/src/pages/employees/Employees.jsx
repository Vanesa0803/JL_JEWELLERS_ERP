import { useEffect, useState } from "react";
import {
  getEmployees,
  getDepartments,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employee.service";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    salary: "",
    department_id: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [employeeResponse, departmentResponse] =
        await Promise.all([
          getEmployees(),
          getDepartments(),
        ]);

      const employeeData = Array.isArray(employeeResponse.data)
        ? employeeResponse.data
        : employeeResponse.data?.data ?? [];

      const departmentData = Array.isArray(departmentResponse.data)
        ? departmentResponse.data
        : departmentResponse.data?.data ?? [];

      setEmployees(employeeData);
      setDepartments(departmentData);
    } catch (err) {
      console.error("HR API ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = () => {
    setEditingEmployee(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      salary: "",
      department_id: "",
    });

    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);

    setForm({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      salary: employee.salary || "",
      department_id: employee.department_id || "",
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        salary: form.salary,
        department_id: Number(form.department_id),
      };

      if (editingEmployee) {
        await updateEmployee(
          editingEmployee.employee_id,
          payload
        );
      } else {
        await createEmployee(payload);
      }

      setShowModal(false);
      await loadData();
    } catch (err) {
      console.error("SAVE EMPLOYEE ERROR:", err);

      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to save employee."
      );
    }
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    try {
      await deleteEmployee(employee.employee_id);
      await loadData();
    } catch (err) {
      console.error("DELETE EMPLOYEE ERROR:", err);

      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to delete employee."
      );
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      employee.name?.toLowerCase().includes(searchValue) ||
      employee.email?.toLowerCase().includes(searchValue) ||
      employee.phone?.toLowerCase().includes(searchValue) ||
      String(employee.employee_id).includes(searchValue);

    const matchesDepartment =
      !departmentFilter ||
      String(employee.department_id) === String(departmentFilter);

    const matchesStatus =
      !statusFilter ||
      employee.status?.toLowerCase() === statusFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesStatus
    );
  });

  if (loading) {
    return (
      <div className="p-6 text-sm text-[#85786D]">
        Loading employees...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#2B2622]">
            Employees
          </h1>

          <p className="mt-1 text-sm text-[#85786D]">
            Manage employee records and department information.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-xl bg-[#6F3E32] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5C3229]"
        >
          + Add Employee
        </button>

      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">

        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-xl border border-[#E7DED3] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6F3E32]"
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="rounded-xl border border-[#E7DED3] bg-white px-4 py-2.5 text-sm text-[#4B423C] outline-none"
        >
          <option value="">All Departments</option>

          {departments.map((department) => (
            <option
              key={department.department_id}
              value={department.department_id}
            >
              {department.department_name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#E7DED3] bg-white px-4 py-2.5 text-sm text-[#4B423C] outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-[#E7DED3] bg-white">

        <table className="w-full min-w-[1100px]">

          <thead>
            <tr className="border-b border-[#E7DED3] bg-[#FCFAF8] text-left">

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                ID
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                Name
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                Phone
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                Email
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                Department
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                Designation
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                Salary
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                Joining Date
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                Status
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-[#85786D]">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-5 py-10 text-center text-sm text-[#85786D]"
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (

                <tr
                  key={employee.employee_id}
                  className="border-b border-[#F0E9E2] last:border-0 hover:bg-[#FCFAF8]"
                >

                  <td className="px-5 py-4 text-sm font-medium text-[#6F3E32]">
                    #{employee.employee_id}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#2B2622]">
                    {employee.name}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#4B423C]">
                    {employee.phone}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#85786D]">
                    {employee.email}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#4B423C]">
                    {employee.department_name}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#4B423C]">
                    {employee.designation || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#4B423C]">
                    ₹{employee.salary}
                  </td>

                  <td className="px-5 py-4 text-sm text-[#85786D]">
                    {employee.joining_date
                      ? new Date(
                          employee.joining_date
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        employee.status?.toLowerCase() === "active"
                          ? "bg-[#EAF4EC] text-[#397047]"
                          : "bg-[#F5E8E5] text-[#8A493D]"
                      }`}
                    >
                      {employee.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() => openEditModal(employee)}
                        className="rounded-lg border border-[#E7DED3] px-3 py-1.5 text-xs font-medium text-[#6F3E32] hover:bg-[#FCFAF8]"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(employee)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-[#2B2622]">
                  {editingEmployee
                    ? "Edit Employee"
                    : "Add Employee"}
                </h2>

                <p className="mt-1 text-sm text-[#85786D]">
                  Enter employee information.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-[#85786D] hover:text-[#2B2622]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#4B423C]">
                  Name
                </label>

                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E7DED3] px-4 py-2.5 text-sm outline-none focus:border-[#6F3E32]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#4B423C]">
                  Email
                </label>

                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E7DED3] px-4 py-2.5 text-sm outline-none focus:border-[#6F3E32]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#4B423C]">
                  Phone
                </label>

                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E7DED3] px-4 py-2.5 text-sm outline-none focus:border-[#6F3E32]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#4B423C]">
                  Salary
                </label>

                <input
                  required
                  type="number"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E7DED3] px-4 py-2.5 text-sm outline-none focus:border-[#6F3E32]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#4B423C]">
                  Department
                </label>

                <select
                  required
                  name="department_id"
                  value={form.department_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E7DED3] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6F3E32]"
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.department_id}
                      value={department.department_id}
                    >
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#E7DED3] px-5 py-2.5 text-sm font-medium text-[#4B423C]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#6F3E32] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5C3229]"
                >
                  {editingEmployee
                    ? "Update Employee"
                    : "Create Employee"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Employees;