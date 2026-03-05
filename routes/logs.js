const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Log a habit for today
router.post('/check/:habitId', async (req, res) => {
  const { habitId } = req.params;
  
  // Check if already logged today
  const existing = await pool.query(
    'SELECT * FROM habit_logs WHERE habit_id = $1 AND logged_date = CURRENT_DATE',
    [habitId]
  );

  if (existing.rows.length === 0) {
    await pool.query(
      'INSERT INTO habit_logs (habit_id) VALUES ($1)',
      [habitId]
    );
  }
  res.redirect('/dashboard.html');
});

// Get today's logs
router.get('/today', async (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  const result = await pool.query(
    `SELECT habit_logs.habit_id 
     FROM habit_logs 
     JOIN habits ON habits.id = habit_logs.habit_id
     WHERE habits.user_id = $1 
     AND habit_logs.logged_date = CURRENT_DATE`,
    [req.session.userId]
  );
  res.json(result.rows);
});

module.exports = router;