const db = require("../config/db");

// CREATE EMPLOYEE
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, salary, department_id } = req.body;

    const [result] = await db.query(
      "INSERT INTO employees (name, email, phone, salary, department_id) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, salary, department_id]
    );

    res.status(201).json({
      message: "Employee created ✅",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL EMPLOYEES (WITH DEPARTMENT NAME 🔥)
exports.getEmployees = async (req, res) => {
  try {
    const query = `
      SELECT e.*, d.department_name 
      FROM employees e
      LEFT JOIN departments d 
      ON e.department_id = d.department_id
    `;

    const [rows] = await db.query(query);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Fetch All Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE EMPLOYEE
exports.getEmployeeById = async (req, res) => {
  try {
    const query = `
      SELECT e.*, d.department_name 
      FROM employees e
      LEFT JOIN departments d 
      ON e.department_id = d.department_id
      WHERE e.employee_id = ?
    `;

    const [rows] = await db.query(query, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found ❌" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Fetch One Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, salary, department_id } = req.body;

    const [result] = await db.query(
      "UPDATE employees SET name=?, email=?, phone=?, salary=?, department_id=? WHERE employee_id=?",
      [name, email, phone, salary, department_id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found ❌" });
    }

    res.status(200).json({ message: "Employee updated ✅" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM employees WHERE employee_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found ❌" });
    }

    res.status(200).json({ message: "Employee deleted ❌" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: err.message });
  }
};