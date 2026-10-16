const employeeService = require("../services/employeeService");

async function getAll(req, res) {
  const employees = await employeeService.getAllEmployees();
  res.status(200).json(employees);
}

async function create(req, res) {
  const employee = await employeeService.createEmployee(req.validated.body);
  res
    .location(`/employees/${employee.id}`)
    .status(201)
    .json(employee);
}

async function update(req, res) {
  const { id } = req.validated.params;
  const employee = await employeeService.updateEmployee(id, req.validated.body);
  res.status(200).json(employee);
}

async function remove(req, res) {
  const { id } = req.validated.params;
  await employeeService.deleteEmployee(id);
  res.status(204).send();
}

module.exports = { getAll, create, update, remove };
