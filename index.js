const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Habit Tracker is running!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
});
```

**Create `.env`** — new file, name it `.env`:
```
PORT=3000
DATABASE_URL=postgresql://localhost/habittracker
SESSION_SECRET=mysecretkey123