const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 5000);
const DB_SSL = String(process.env.DB_SSL || "false").toLowerCase() === "true";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: DB_SSL ? { rejectUnauthorized: false } : false,
});

app.use(cors());
app.use(express.json());

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/tasks", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, completed, created_at FROM tasks ORDER BY id DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, completed, created_at",
      [title.trim()],
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed must be boolean" });
  }

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING id, title, completed, created_at",
      [title.trim(), completed, Number(id)],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1", [
      Number(id),
    ]);

    if (!result.rowCount) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete task" });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  });
