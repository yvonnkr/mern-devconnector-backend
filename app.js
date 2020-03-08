const express = require('express');
const connectDB = require('./db/db-connect');

const app = express();

//connect to db
connectDB();

app.get('/', (req, res) => res.json({ message: 'Api running' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
