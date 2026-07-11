const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.get("/about", (req, res) => {
  res.json({
    name: "Christy Cyril",
    course: "Week 1 assignment"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});