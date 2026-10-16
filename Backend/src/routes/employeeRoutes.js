const express = require("express");
const employeeController = require("../controllers/employeeController");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeIdSchema,
} = require("../validators/employeeSchemas");

const router = express.Router();

router.get("/", asyncHandler(employeeController.getAll));
router.post("/", validate(createEmployeeSchema), asyncHandler(employeeController.create));
router.put("/:id", validate(updateEmployeeSchema), asyncHandler(employeeController.update));
router.delete("/:id", validate(employeeIdSchema), asyncHandler(employeeController.remove));

module.exports = { employeeRoutes: router };
