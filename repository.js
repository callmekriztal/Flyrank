const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE
    )
  `);

  const result = await pool.query(
    "SELECT COUNT(*) AS count FROM tasks"
  );

  if (Number(result.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO tasks (title, done)
      VALUES
        ('Learn Express', false),
        ('Build CRUD API', false),
        ('Practice PostgreSQL', false)
    `);
  }
}

async function getTasks() {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY id"
  );

  return result.rows;
}

async function getTask(id) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

async function createTask(title) {
  const result = await pool.query(
    `INSERT INTO tasks (title, done)
     VALUES ($1, $2)
     RETURNING *`,
    [title, false]
  );

  return result.rows[0];
}

async function updateTask(id, title, done) {
  const result = await pool.query(
    `UPDATE tasks
     SET title = $1, done = $2
     WHERE id = $3
     RETURNING *`,
    [title, done, id]
  );

  return result.rows[0];
}

async function deleteTask(id) {
  const result = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}

module.exports = {
  initializeDatabase,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
