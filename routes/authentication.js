// -----------------------------------------------------------------------------------------
// External Dependencies
// -----------------------------------------------------------------------------------------
const jwt = require('jwt-simple');

// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
const User = require('../models/user');
const keys = require('../config/keys');
require('../services/passport');
const middlewares = require('../middlewares');

// -----------------------------------------------------------------------------------------
// Helper Method
// -----------------------------------------------------------------------------------------
function tokenForUser(user) {
  const timestamp = new Date().getTime();

  return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
}

// -----------------------------------------------------------------------------------------
// Authentication API
// -----------------------------------------------------------------------------------------
module.exports = function(app) {
  app.get('/api', middlewares.requireToken, (req, res, next) => {
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
        image_fileIDs: []
      });
  
      newUser.save(err => {
        if (err) return next(err);
        res.json({ token: tokenForUser(newUser) });
      });
    });
  });

  app.post('/api/signin', middlewares.requireLogin, (req, res, next) => {
    res.send({ token: tokenForUser(req.user) });
  });

  app.get('/api/userid', middlewares.requireToken, (req, res) => {
    res.send({ userId: req.user._id });
  });
}