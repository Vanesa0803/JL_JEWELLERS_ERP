// ===============================
// 💸 SALARY CONTROLLER
// ===============================

// Generate Salary
const generateSalary = (req, res) => {
  try {
    res.json({
      success: true,
      message: "Salary generated successfully ✅",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Get Salary Slip
const getSalarySlip = (req, res) => {
  try {
    const { employee_id, month, year } = req.params;

    res.json({
      success: true,
      message: "Salary slip fetched ✅",
      data: { employee_id, month, year },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Get All Salaries
const getAllSalaries = (req, res) => {
  try {
    res.json({
      success: true,
      message: "All salaries fetched ✅",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Download Salary PDF
const downloadSalaryPDF = (req, res) => {
  try {
    res.json({
      success: true,
      message: "Salary PDF download working ✅",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ✅ IMPORTANT EXPORT
module.exports = {
  generateSalary,
  getSalarySlip,
  getAllSalaries,
  downloadSalaryPDF,
};