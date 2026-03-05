const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretkey123',
  resave: false,
  saveUninitialized: false
}));

const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const logRoutes = require('./routes/logs');
const statsRoutes = require('./routes/stats');

app.use('/auth', authRoutes);
app.use('/habits', habitRoutes);
app.use('/logs', logRoutes);
app.use('/stats', statsRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});