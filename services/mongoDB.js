// -----------------------------------------------------------------------------------------
// External Dependencies
// -----------------------------------------------------------------------------------------
const mongoose = require('mongoose');

// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
const keys = require('../config/keys');

// -----------------------------------------------------------------------------------------
// MongoDB Connection
// -----------------------------------------------------------------------------------------
let mongoDB = {};

mongoDB.mongoURI = keys.mongoURI;
mongoDB.promise = mongoose.connect(mongoDB.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoDB.conn = mongoose.connection;

module.exports = mongoDB;