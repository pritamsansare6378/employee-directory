const { z } = require("zod");

const employeeBody = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(100, "Name must be 100 characters or fewer.")
    .refine((value) => value.length > 0, "Name is required."),
  email: z.string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer.")
    .transform((value) => value.toLowerCase()),
  role: z.string()
    .trim()
    .min(2, "Role must contain at least 2 characters.")
    .max(100, "Role must be 100 characters or fewer."),
}).strict();

const createEmployeeSchema = z.object({
  body: employeeBody,
  params: z.object({}),
  query: z.object({}),
});

const updateEmployeeSchema = z.object({
  body: employeeBody,
  params: z.object({
    id: z.coerce.number().int().positive("Employee ID must be a positive integer."),
  }),
  query: z.object({}),
});

const employeeIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.coerce.number().int().positive("Employee ID must be a positive integer."),
  }),
  query: z.object({}),
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeIdSchema,
};
