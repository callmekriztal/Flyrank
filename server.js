require("dotenv").config();

const express = require("express");

const {
  initializeDatabase,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require("./repository");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.get("/about", (req, res) => {
  res.json({
    name: "Christy Cyril",
    course: "Week 3 PostgreSQL Assignment"
  });
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error"
    });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const task = await getTask(id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error"
    });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "Title is required"
      });
    }

    const task = await createTask(title.trim());

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error"
    });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    if (!title || typeof done !== "boolean") {
      return res.status(400).json({
        error: "Title and done are required"
      });
    }

    const existing = await getTask(id);

    if (!existing) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    const updatedTask = await updateTask(
      id,
      title.trim(),
      done
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error"
    });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const task = await deleteTask(id);

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error"
    });
  }
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });