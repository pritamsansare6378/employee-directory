const { pool } = require("../config/db");

const EMPLOYEE_COLUMNS = "id, name, email, role, created_at";

async function findAll() {
  const [rows] = await pool.query(
    `SELECT ${EMPLOYEE_COLUMNS} FROM employees ORDER BY created_at DESC, id DESC`,
  );
  return rows;
}

async function create({ name, email, role }) {
  const [result] = await pool.execute(
    "INSERT INTO employees (name, email, role) VALUES (?, ?, ?)",
    [name, email, role],
  );

  const [rows] = await pool.execute(
    `SELECT ${EMPLOYEE_COLUMNS} FROM employees WHERE id = ? LIMIT 1`,
    [result.insertId],
  );

  return rows[0];
}

async function updateById(id, { name, email, role }) {
  // Check existence first: MySQL can report zero changed rows when values are unchanged.
  const [existingRows] = await pool.execute(
    `SELECT id FROM employees WHERE id = ? LIMIT 1`,
    [id],
  );

  if (existingRows.length === 0) {
    return null;
  }

  await pool.execute(
    "UPDATE employees SET name = ?, email = ?, role = ? WHERE id = ?",
    [name, email, role, id],
  );

  const [rows] = await pool.execute(
    `SELECT ${EMPLOYEE_COLUMNS} FROM employees WHERE id = ? LIMIT 1`,
    [id],
  );

  return rows[0] || null;
}

async function deleteById(id) {
  const [result] = await pool.execute(
    "DELETE FROM employees WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, create, updateById, deleteById };
