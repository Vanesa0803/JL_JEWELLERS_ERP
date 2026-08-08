const db = require("../config/db");

// CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const query = `
      INSERT INTO attendance (employee_id, check_in, date)
      VALUES (?, NOW(), CURDATE())
    `;

    await db.query(query, [employee_id]);

    res.json({ message: "Checked in ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHECK-OUT
exports.checkOut = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const query = `
      UPDATE attendance
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
exports.getAttendance = async (req, res) => {
  try {
    const query = `
      SELECT a.*, e.name 
      FROM attendance a
      JOIN employees e 
      ON a.employee_id = e.employee_id
    `;

    const [rows] = await db.query(query);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
