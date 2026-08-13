const db = require("../config/db.cjs");

// CREATE
const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    await db.query(
      "INSERT INTO employees (name, email, phone, role) VALUES (?, ?, ?, ?)",
      [name, email, phone, role]
    );

    res.json({ message: "Employee created ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
const getEmployees = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM employees");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ONE
const getEmployeeById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM employees WHERE id = ?",
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
const updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    await db.query(
      "UPDATE employees SET name=?, email=?, phone=?, role=? WHERE id=?",
      [name, email, phone, role, req.params.id]
    );

    res.json({ message: "Employee updated ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
const deleteEmployee = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM employees WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Employee deleted ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};