// -----------------------------------------------------------------------------------------
// External Dependencies
// -----------------------------------------------------------------------------------------
const multer = require('multer');
const path   = require('path'); 

// -----------------------------------------------------------------------------------------
// Multer Setup
// -----------------------------------------------------------------------------------------
module.exports = function(storage) {
  return multer({ 
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
}