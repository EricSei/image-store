// -----------------------------------------------------------------------------------------
// External Dependencies
// -----------------------------------------------------------------------------------------
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const jwt        = require('jwt-simple');
const cors       = require('cors');

// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
const User = require('./models/user');
require('dotenv/config');
const keys = require('./config/keys');

// -----------------------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------------------
app.use(bodyParser.json({ type: '*/*' }));
app.use(cors());

// -----------------------------------------------------------------------------------------
// MongoDB Setup
// -----------------------------------------------------------------------------------------
mongoose.connect('mongodb://localhost:27017/imagestore', { useNewUrlParser: true, useUnifiedTopology: true });

// -----------------------------------------------------------------------------------------
// Authentication API
// -----------------------------------------------------------------------------------------
app.get('/api', (req, res, next) => {
  res.send('Welcome to the Imagestore API.');
});

app.post('/api/signup', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) return res.status(422).send({ error: 'You must provide both email and password' });

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) return next(err);
    if (existingUser) return res.status(422).send({ error: 'Email is in use!' });

    const newUser = new User({
      email: email,
      password: password,
      image_filenames: []
    });

    newUser.save(err => {
      if (err) return next(err);
      res.json({ token: tokenForUser(newUser) });
    });
  });
});

// -----------------------------------------------------------------------------------------
// Helper Methods
// -----------------------------------------------------------------------------------------
function tokenForUser(user) {
  const timestamp = new Date().getTime();

  return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
}

// -----------------------------------------------------------------------------------------
// Port Setup
// -----------------------------------------------------------------------------------------
const port = process.env.PORT || 5000;
app.listen(port);
console.log('Server is up and listening on port:', port);