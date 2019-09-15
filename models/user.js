const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  image_fileIDs: [mongoose.SchemaTypes.ObjectId]
});

userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;