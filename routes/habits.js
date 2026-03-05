const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Get all habits with streak count
router.get('/', async (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  const result = await pool.query(
    `SELECT habits.*, 
     COUNT(habit_logs.id) as streak
     FROM habits 
     LEFT JOIN habit_logs ON habits.id = habit_logs.habit_id
     WHERE habits.user_id = $1
     GROUP BY habits.id
     ORDER BY habits.created_at DESC`,
    [req.session.userId]
  );
  res.json(result.rows);
});

// Add habit
router.post('/add', async (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  const { name } = req.body;
  await pool.query(
    'INSERT INTO habits (user_id, name) VALUES ($1, $2)',
    [req.session.userId, name]
  );
  res.redirect('/dashboard.html');
});

// Delete habit
router.post('/delete/:id', async (req, res) => {
  await pool.query(
    'DELETE FROM habits WHERE id = $1',
    [req.params.id]
  );
  res.redirect('/dashboard.html');
});

module.exports = router;