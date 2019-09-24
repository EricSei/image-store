// -----------------------------------------------------------------------------------------
// External Dependencies
// -----------------------------------------------------------------------------------------
const mongoose = require('mongoose');

// -----------------------------------------------------------------------------------------
// MongoDB Connection
// -----------------------------------------------------------------------------------------
let mongoDB = {};

mongoDB.mongoURI = 'mongodb+srv://imagicat:123@image-store-iz5hu.mongodb.net/test?retryWrites=true&w=majority';
mongoDB.promise = mongoose.connect(mongoDB.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoDB.conn = mongoose.connection;

module.exports = mongoDB;