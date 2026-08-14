// Promise-style pool: these controllers use `await db.query(...)`.
import { pool as db } from "../../config/db.js";

// ➕ Create Department
const createDepartment = async (req, res) => {
  const { name } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO departments (name) VALUES (?)",
      [name]
    );

    res.status(201).json({
      message: "Department created successfully ✅",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Create Department Error:", err);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// 📋 Get All Departments
const getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM departments");

    res.json(rows);
  } catch (err) {
    console.error("Get Departments Error:", err);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// ✏️ Update Department
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE departments SET name=? WHERE id=?",
      [name, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Department not found ❌",
      });
    }

    res.json({
      message: "Department updated successfully ✅",
    });
  } catch (err) {
    console.error("Update Department Error:", err);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// ❌ Delete Department
const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM departments WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Department not found ❌",
      });
    }

    res.json({
      message: "Department deleted successfully ✅",
    });
  } catch (err) {
    console.error("Delete Department Error:", err);
    res.status(500).json({ error: "Server error ❌" });
  }
};

export {
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment
};

export default {
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment,
};
