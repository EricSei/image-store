// -----------------------------------------------------------------------------------------
// External Dependencies
// -----------------------------------------------------------------------------------------
const GridFsStorage = require('multer-gridfs-storage');
const crypto        = require('crypto'); 
const path          = require('path'); 

// -----------------------------------------------------------------------------------------
// GridFS Storage
// -----------------------------------------------------------------------------------------
module.exports = function(promise) {
  return new GridFsStorage({
    db: promise,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          } 
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads' // bucketname should match mongo collection name        
          };
          resolve(fileInfo);
        });
      });
    }
  });
}