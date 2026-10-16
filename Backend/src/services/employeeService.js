const employeeRepository = require("../repositories/employeeRepository");
const { AppError } = require("../utils/AppError");

async function getAllEmployees() {
  return employeeRepository.findAll();
}

async function createEmployee(payload) {
  return employeeRepository.create(payload);
}

async function updateEmployee(id, payload) {
  const employee = await employeeRepository.updateById(id, payload);

  if (!employee) {
    throw new AppError("Employee not found.", 404, "EMPLOYEE_NOT_FOUND");
  }

  return employee;
}

async function deleteEmployee(id) {
  const deleted = await employeeRepository.deleteById(id);

  if (!deleted) {
    throw new AppError("Employee not found.", 404, "EMPLOYEE_NOT_FOUND");
  }
}

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
