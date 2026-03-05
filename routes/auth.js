const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    [username, email, hashed]
  );
  res.redirect('/login.html');
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1', [email]
  );
  const user = result.rows[0];
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    res.redirect('/dashboard.html');
  } else {
    res.send('Invalid credentials. <a href="/">Try again</a>');
  }
});

module.exports = router;
