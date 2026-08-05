const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new Database("tasks.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL
  )
`).run();

const count = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

if (count.count === 0) {
  const insert = db.prepare(
    "INSERT INTO tasks (title, done) VALUES (?, ?)"
  );

  insert.run("Learn Express", 0);
  insert.run("Build CRUD API", 0);
  insert.run("Practice SQLite", 0);
}

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.get("/about", (req, res) => {
  res.json({
    name: "Christy Cyril",
    course: "Week 3 SQLite Assignment"
  });
});

app.get("/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();

  const formattedTasks = tasks.map(task => ({
    ...task,
    done: Boolean(task.done)
  }));

  res.json(formattedTasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  task.done = Boolean(task.done);

  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  const result = db
    .prepare("INSERT INTO tasks (title, done) VALUES (?, ?)")
    .run(title, 0);

  const newTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid);

  newTask.done = Boolean(newTask.done);

  res.status(201).json(newTask);
});


app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, done } = req.body;

  if (!title || typeof done !== "boolean") {
    return res.status(400).json({
      error: "Title and done are required"
    });
  }

  const existing = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  if (!existing) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  db.prepare(
    "UPDATE tasks SET title = ?, done = ? WHERE id = ?"
  ).run(title, done ? 1 : 0, id);

  const updatedTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(id);

  updatedTask.done = Boolean(updatedTask.done);

  res.json(updatedTask);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const result = db
    .prepare("DELETE FROM tasks WHERE id = ?")
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});