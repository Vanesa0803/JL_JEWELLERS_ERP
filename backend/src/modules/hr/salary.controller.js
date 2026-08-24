import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import SalaryService from "./salary.service.js";


// ---------------------------------------------------------
// CREATE
// ---------------------------------------------------------
const createSalary = asyncHandler(async (req, res) => {

    const salary =
        await SalaryService.createSalary(
            req.body
        );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                salary,
                "Salary created successfully"
            )
        );
});


// ---------------------------------------------------------
// GET ALL
// ---------------------------------------------------------
const getAllSalaries = asyncHandler(async (req, res) => {

    const salaries =
        await SalaryService.getAllSalaries();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                salaries,
                "Salaries retrieved successfully"
            )
        );
});


// ---------------------------------------------------------
// GET BY ID
// ---------------------------------------------------------
const getSalaryById = asyncHandler(async (req, res) => {

    const salary =
        await SalaryService.getSalaryById(
            req.params.id
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                salary,
                "Salary retrieved successfully"
            )
        );
});


// ---------------------------------------------------------
// GET BY EMPLOYEE
// ---------------------------------------------------------
const getSalariesByEmployee = asyncHandler(async (req, res) => {

    const result =
        await SalaryService.getSalariesByEmployee(
            req.params.employeeId
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Employee salary history retrieved successfully"
            )
        );
});


// ---------------------------------------------------------
// GET BY PERIOD
// ---------------------------------------------------------
const getSalaryByPeriod = asyncHandler(async (req, res) => {

    const {
        month,
        year
    } = req.query;

    const salaries =
        await SalaryService.getSalaryByPeriod(
            month,
            year
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                salaries,
                "Salary records retrieved successfully"
            )
        );
});


// ---------------------------------------------------------
// UPDATE
// ---------------------------------------------------------
const updateSalary = asyncHandler(async (req, res) => {

    const salary =
        await SalaryService.updateSalary(
            req.params.id,
            req.body
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                salary,
                "Salary updated successfully"
            )
        );
});


// ---------------------------------------------------------
// DELETE
// ---------------------------------------------------------
const deleteSalary = asyncHandler(async (req, res) => {

    const result =
        await SalaryService.deleteSalary(
            req.params.id
        );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Salary deleted successfully"
            )
        );
});


export {
    createSalary,
    getAllSalaries,
    getSalaryById,
    getSalariesByEmployee,
    getSalaryByPeriod,
    updateSalary,
    deleteSalary
};