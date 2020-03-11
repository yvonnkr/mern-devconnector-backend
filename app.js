const express = require('express');
const connectDB = require('./db/db-connect');

const app = express();

//connect to db
connectDB();

//init middleware  --alternative to using bodyParser --no need to install bodyParser express covers it
app.use(express.json({ extended: false }));

//Solve CORS error  --Cross-Origin-Resource-Sharing --blocks sharing data/resources from different domains
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token '
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  next();
});

//routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
