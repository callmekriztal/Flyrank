const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory tasks
let tasks = [
  { id: 1, title: "Learn Express", done: false },
  { id: 2, title: "Build CRUD API", done: false },
  { id: 3, title: "Practice SQLite", done: false }
];

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// About route
app.get("/about", (req, res) => {
  res.json({
    name: "Christy Cyril",
    course: "Week 1 assignment"
  });
});

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// GET one task
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  res.json(task);
});

// CREATE task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    done: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// UPDATE task
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, done } = req.body;

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  if (!title || typeof done !== "boolean") {
    return res.status(400).json({
      error: "Title and done are required"
    });
  }

  task.title = title;
  task.done = done;

  res.json(task);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  tasks.splice(index, 1);

  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});