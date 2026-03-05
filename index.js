const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');

app.use('/auth', authRoutes);
app.use('/habits', habitRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
});