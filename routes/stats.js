const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Get stats for all habits
router.get('/', async (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  const result = await pool.query(
    `SELECT habits.name,
     COUNT(habit_logs.id) as total_logs,
     MAX(habit_logs.logged_date) as last_logged
     FROM habits
     LEFT JOIN habit_logs ON habits.id = habit_logs.habit_id
     WHERE habits.user_id = $1
     GROUP BY habits.name
     ORDER BY total_logs DESC`,
    [req.session.userId]
  );
  res.json(result.rows);
});

module.exports = router;
