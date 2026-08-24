import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

class SalaryService {

    // ---------------------------------------------------------
    // CREATE SALARY
    // ---------------------------------------------------------
    async createSalary(data) {

        const {
            employee_id,
            month,
            year,
            present_days,
            total_days,
            monthly_salary
        } = data;

        // Basic validation
        if (
            employee_id === undefined ||
            month === undefined ||
            year === undefined ||
            present_days === undefined ||
            total_days === undefined ||
            monthly_salary === undefined
        ) {
            throw new ApiError(
                400,
                "employee_id, month, year, present_days, total_days and monthly_salary are required"
            );
        }

        const employeeId = Number(employee_id);
        const salaryMonth = Number(month);
        const salaryYear = Number(year);
        const presentDays = Number(present_days);
        const totalDays = Number(total_days);
        const monthlySalary = Number(monthly_salary);

        // Validate numbers
        if (
            !Number.isInteger(employeeId) ||
            employeeId <= 0
        ) {
            throw new ApiError(
                400,
                "employee_id must be a valid positive integer"
            );
        }

        if (
            !Number.isInteger(salaryMonth) ||
            salaryMonth < 1 ||
            salaryMonth > 12
        ) {
            throw new ApiError(
                400,
                "month must be between 1 and 12"
            );
        }

        if (
            !Number.isInteger(salaryYear) ||
            salaryYear < 2000 ||
            salaryYear > 2100
        ) {
            throw new ApiError(
                400,
                "year must be between 2000 and 2100"
            );
        }

        if (
            !Number.isInteger(totalDays) ||
            totalDays <= 0 ||
            totalDays > 31
        ) {
            throw new ApiError(
                400,
                "total_days must be between 1 and 31"
            );
        }

        if (
            !Number.isInteger(presentDays) ||
            presentDays < 0 ||
            presentDays > totalDays
        ) {
            throw new ApiError(
                400,
                "present_days must be between 0 and total_days"
            );
        }

        if (
            !Number.isFinite(monthlySalary) ||
            monthlySalary < 0
        ) {
            throw new ApiError(
                400,
                "monthly_salary must be a valid non-negative number"
            );
        }

        // Check employee exists
        const [employees] = await pool.execute(
            `SELECT
                id,
                name,
                salary,
                status
             FROM employees
             WHERE id = ?
             LIMIT 1`,
            [employeeId]
        );

        if (employees.length === 0) {
            throw new ApiError(
                404,
                "Employee not found"
            );
        }

        // Prevent duplicate salary for same employee/month/year
        const [existing] = await pool.execute(
            `SELECT id
             FROM salaries
             WHERE employee_id = ?
               AND month = ?
               AND year = ?
             LIMIT 1`,
            [
                employeeId,
                salaryMonth,
                salaryYear
            ]
        );

        if (existing.length > 0) {
            throw new ApiError(
                409,
                "Salary already exists for this employee and month"
            );
        }

        // Calculate salary
        const totalSalary =
            Number(
                (
                    (monthlySalary / totalDays) *
                    presentDays
                ).toFixed(2)
            );

        const [result] = await pool.execute(
            `INSERT INTO salaries
            (
                employee_id,
                month,
                year,
                present_days,
                total_days,
                monthly_salary,
                total_salary
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                employeeId,
                salaryMonth,
                salaryYear,
                presentDays,
                totalDays,
                monthlySalary,
                totalSalary
            ]
        );

        return this.getSalaryById(result.insertId);
    }


    // ---------------------------------------------------------
    // GET SALARY BY ID
    // ---------------------------------------------------------
    async getSalaryById(id) {

        const salaryId = Number(id);

        if (
            !Number.isInteger(salaryId) ||
            salaryId <= 0
        ) {
            throw new ApiError(
                400,
                "Invalid salary id"
            );
        }

        const [rows] = await pool.execute(
            `SELECT
                s.id,
                s.employee_id,
                e.name AS employee_name,
                e.email AS employee_email,
                s.month,
                s.year,
                s.present_days,
                s.total_days,
                s.monthly_salary,
                s.total_salary,
                s.created_at
             FROM salaries s
             LEFT JOIN employees e
                ON e.id = s.employee_id
             WHERE s.id = ?
             LIMIT 1`,
            [salaryId]
        );

        if (rows.length === 0) {
            throw new ApiError(
                404,
                "Salary record not found"
            );
        }

        return rows[0];
    }


    // ---------------------------------------------------------
    // GET ALL SALARIES
    // ---------------------------------------------------------
    async getAllSalaries() {

        const [rows] = await pool.execute(
            `SELECT
                s.id,
                s.employee_id,
                e.name AS employee_name,
                e.email AS employee_email,
                s.month,
                s.year,
                s.present_days,
                s.total_days,
                s.monthly_salary,
                s.total_salary,
                s.created_at
             FROM salaries s
             LEFT JOIN employees e
                ON e.id = s.employee_id
             ORDER BY s.year DESC, s.month DESC, s.id DESC`
        );

        return rows;
    }


    // ---------------------------------------------------------
    // GET SALARIES BY EMPLOYEE
    // ---------------------------------------------------------
    async getSalariesByEmployee(employeeId) {

        const id = Number(employeeId);

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            throw new ApiError(
                400,
                "Invalid employee id"
            );
        }

        const [employee] = await pool.execute(
            `SELECT id, name
             FROM employees
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        if (employee.length === 0) {
            throw new ApiError(
                404,
                "Employee not found"
            );
        }

        const [rows] = await pool.execute(
            `SELECT
                id,
                employee_id,
                month,
                year,
                present_days,
                total_days,
                monthly_salary,
                total_salary,
                created_at
             FROM salaries
             WHERE employee_id = ?
             ORDER BY year DESC, month DESC`,
            [id]
        );

        return {
            employee: employee[0],
            salaries: rows
        };
    }


    // ---------------------------------------------------------
    // GET SALARY BY MONTH/YEAR
    // ---------------------------------------------------------
    async getSalaryByPeriod(month, year) {

        const salaryMonth = Number(month);
        const salaryYear = Number(year);

        if (
            !Number.isInteger(salaryMonth) ||
            salaryMonth < 1 ||
            salaryMonth > 12
        ) {
            throw new ApiError(
                400,
                "month must be between 1 and 12"
            );
        }

        if (
            !Number.isInteger(salaryYear) ||
            salaryYear < 2000 ||
            salaryYear > 2100
        ) {
            throw new ApiError(
                400,
                "Invalid year"
            );
        }

        const [rows] = await pool.execute(
            `SELECT
                s.id,
                s.employee_id,
                e.name AS employee_name,
                e.email AS employee_email,
                s.month,
                s.year,
                s.present_days,
                s.total_days,
                s.monthly_salary,
                s.total_salary,
                s.created_at
             FROM salaries s
             LEFT JOIN employees e
                ON e.id = s.employee_id
             WHERE s.month = ?
               AND s.year = ?
             ORDER BY e.name ASC`,
            [
                salaryMonth,
                salaryYear
            ]
        );

        return rows;
    }


    // ---------------------------------------------------------
    // UPDATE SALARY
    // ---------------------------------------------------------
    async updateSalary(id, data) {

        const salaryId = Number(id);

        if (
            !Number.isInteger(salaryId) ||
            salaryId <= 0
        ) {
            throw new ApiError(
                400,
                "Invalid salary id"
            );
        }

        const [existing] = await pool.execute(
            `SELECT *
             FROM salaries
             WHERE id = ?
             LIMIT 1`,
            [salaryId]
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Salary record not found"
            );
        }

        const current = existing[0];

        const employeeId =
            data.employee_id !== undefined
                ? Number(data.employee_id)
                : current.employee_id;

        const salaryMonth =
            data.month !== undefined
                ? Number(data.month)
                : current.month;

        const salaryYear =
            data.year !== undefined
                ? Number(data.year)
                : current.year;

        const presentDays =
            data.present_days !== undefined
                ? Number(data.present_days)
                : current.present_days;

        const totalDays =
            data.total_days !== undefined
                ? Number(data.total_days)
                : current.total_days;

        const monthlySalary =
            data.monthly_salary !== undefined
                ? Number(data.monthly_salary)
                : Number(current.monthly_salary);

        if (
            salaryMonth < 1 ||
            salaryMonth > 12
        ) {
            throw new ApiError(
                400,
                "month must be between 1 and 12"
            );
        }

        if (
            totalDays <= 0 ||
            totalDays > 31
        ) {
            throw new ApiError(
                400,
                "total_days must be between 1 and 31"
            );
        }

        if (
            presentDays < 0 ||
            presentDays > totalDays
        ) {
            throw new ApiError(
                400,
                "present_days must be between 0 and total_days"
            );
        }

        if (monthlySalary < 0) {
            throw new ApiError(
                400,
                "monthly_salary cannot be negative"
            );
        }

        // Check duplicate period if employee/month/year changed
        const [duplicate] = await pool.execute(
            `SELECT id
             FROM salaries
             WHERE employee_id = ?
               AND month = ?
               AND year = ?
               AND id != ?
             LIMIT 1`,
            [
                employeeId,
                salaryMonth,
                salaryYear,
                salaryId
            ]
        );

        if (duplicate.length > 0) {
            throw new ApiError(
                409,
                "Another salary record already exists for this employee and month"
            );
        }

        const totalSalary =
            Number(
                (
                    (monthlySalary / totalDays) *
                    presentDays
                ).toFixed(2)
            );

        await pool.execute(
            `UPDATE salaries
             SET
                employee_id = ?,
                month = ?,
                year = ?,
                present_days = ?,
                total_days = ?,
                monthly_salary = ?,
                total_salary = ?
             WHERE id = ?`,
            [
                employeeId,
                salaryMonth,
                salaryYear,
                presentDays,
                totalDays,
                monthlySalary,
                totalSalary,
                salaryId
            ]
        );

        return this.getSalaryById(salaryId);
    }


    // ---------------------------------------------------------
    // DELETE SALARY
    // ---------------------------------------------------------
    async deleteSalary(id) {

        const salaryId = Number(id);

        const [existing] = await pool.execute(
            `SELECT id
             FROM salaries
             WHERE id = ?
             LIMIT 1`,
            [salaryId]
        );

        if (existing.length === 0) {
            throw new ApiError(
                404,
                "Salary record not found"
            );
        }

        await pool.execute(
            `DELETE FROM salaries
             WHERE id = ?`,
            [salaryId]
        );

        return {
            id: salaryId
        };
    }
}

export default new SalaryService();