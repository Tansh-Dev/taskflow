const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── Database setup ──────────────────────────────────
// DB file lives in /app/data/ inside the container
// That folder is mapped to a Docker volume → data survives restarts
const DB_PATH = path.join('/app/data', 'tasks.db');
const db = new Database(DB_PATH);

// Create table if it doesn't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'todo',
    priority   TEXT    NOT NULL DEFAULT 'medium',
    createdAt  TEXT    NOT NULL
  )
`);

// Seed default tasks only if table is empty
const count = db.prepare('SELECT COUNT(*) as cnt FROM tasks').get();
if (count.cnt === 0) {
  const insert = db.prepare(
    'INSERT INTO tasks (title, status, priority, createdAt) VALUES (?, ?, ?, ?)'
  );
  const now = new Date().toISOString();
  insert.run('Complete AWS Cloud Practitioner', 'done',  'high',   now);
  insert.run('Learn Docker',                    'done',  'high',   now);
  insert.run('Deploy to AWS EC2',               'todo',  'high',   now);
  insert.run('Set up Nginx reverse proxy',      'todo',  'medium', now);
  insert.run('Configure GitHub Actions CI/CD',  'todo',  'medium', now);
  console.log('✅ Database seeded with default tasks');
}

console.log(`✅ SQLite database connected at ${DB_PATH}`);

// ── Routes ──────────────────────────────────────────

// GET all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
  res.json({ success: true, tasks });
});

// GET single task
app.get('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, task });
});

// POST create task
app.post('/api/tasks', (req, res) => {
  const { title, priority = 'medium' } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
  const result = db.prepare(
    'INSERT INTO tasks (title, status, priority, createdAt) VALUES (?, ?, ?, ?)'
  ).run(title, 'todo', priority, new Date().toISOString());
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, task });
});

// PATCH update task
app.patch('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  const updated = {
    title:    req.body.title    ?? task.title,
    status:   req.body.status   ?? task.status,
    priority: req.body.priority ?? task.priority,
  };
  db.prepare(
    'UPDATE tasks SET title = ?, status = ?, priority = ? WHERE id = ?'
  ).run(updated.title, updated.status, updated.priority, req.params.id);
  const result = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json({ success: true, task: result });
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Task deleted' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), db: 'sqlite' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on port ${PORT}`);
});