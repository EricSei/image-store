const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  fileID: mongoose.Schema.Types.ObjectId,
  uploadDate: Date,
  filename: String,
  title: String,
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;