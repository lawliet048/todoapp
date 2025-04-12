const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


/*const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If using SSL on Render (most likely yes):
  ssl: {
    rejectUnauthorized: false,
  },
});


// Get all tasks
app.get("/tasks", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
  res.json(result.rows);
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title]
  );
  res.json(result.rows[0]);
});

// Update task status
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const result = await pool.query(
    "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
    [completed, id]
  );
  res.json(result.rows[0]);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  res.json({ message: "Task deleted" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
