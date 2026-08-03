const db = require("../config/db");

// CREATE
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, salary } = req.body;

    const [result] = await db.query(
      "INSERT INTO employees (name, email, phone, department, salary) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, department, salary]
    );

    res.json({ message: "Employee created ✅", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.getEmployees = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getEmployeeById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM employees WHERE id = ?",
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, role, salary } = req.body;

    await db.query(
      "UPDATE employees SET name=?, email=?, phone=?, department=?, salary=? WHERE id=?",
      [name, email, phone, department, salary, req.params.id]
    );

    res.json({ message: "Employee updated ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteEmployee = async (req, res) => {
  try {
    await db.query("DELETE FROM employees WHERE id = ?", [
      req.params.id,
    ]);

    res.json({ message: "Employee deleted ❌" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};