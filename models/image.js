const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  fileId: mongoose.Schema.Types.ObjectId
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;