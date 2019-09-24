// -----------------------------------------------------------------------------------------
// External Dependencies
// -----------------------------------------------------------------------------------------
const passport = require('passport');
const multer   = require('multer');
const path     = require('path'); 

// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
const mongoDB = require('../services/mongoDB');
const storage = require('../services/gridFsStorage')(mongoDB.promise);

// -----------------------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------------------
let middlewares = {};

middlewares.requireToken = passport.authenticate('jwt', { session: false});
middlewares.requireLogin = passport.authenticate('local', { session: false });

middlewares.upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => { 
      // Makes sure only images upload to the uploads collection
      const ifValidFile = ['.png', '.jpg', '.jpeg'].some(ext => ext == path.extname(file.originalname));
      
      if(ifValidFile) {
          return cb(null, true); // This means the image will upload
      } else {
          return cb(null, false); // This means the image won't upload
      }
    }
});

module.exports = middlewares;