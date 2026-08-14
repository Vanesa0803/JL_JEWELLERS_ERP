// Promise-style pool: these controllers use `await db.query(...)`.
import { pool as db } from "../../config/db.js";

// CHECK-IN
const checkIn = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const query = `
      INSERT INTO employee_attendance (employee_id, check_in, date)
      VALUES (?, NOW(), CURDATE())
    `;

    await db.query(query, [employee_id]);

    res.json({ message: "Checked in ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHECK-OUT
const checkOut = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const query = `
      UPDATE employee_attendance
      SET check_out = NOW()
      WHERE employee_id = ? AND date = CURDATE()
    `;

    await db.query(query, [employee_id]);

    res.json({ message: "Checked out ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ATTENDANCE
const getAttendance = async (req, res) => {
  try {
    const query = `
      SELECT a.*, e.name 
      FROM employee_attendance a
      JOIN employees e 
      ON a.employee_id = e.employee_id
    `;

    const [rows] = await db.query(query);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
    checkIn,
    checkOut,
    getAttendance
};

export default {
    checkIn,
    checkOut,
    getAttendance,
};
