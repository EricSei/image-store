// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
const middlewares = require('../middlewares');
const Image       = require('../models/image');

// -----------------------------------------------------------------------------------------
// Upload API
// -----------------------------------------------------------------------------------------
module.exports = function(app) {
  app.post('/api/upload', middlewares.upload.array('file'), (req, res) => {
    req.files.forEach(file => {
      const fileID = file.id;
      const userId = req.user? req.user._id : null;
      console.log(req.user);
      const newImage = new Image({
        fileID: fileID,
        uploadDate: Date.now(),
        filename: file.filename,
        title: req.body.title,
        creator: userId
      });
  
      newImage.save(err => {
        if (err) return next(err);
      });
    });
  
    res.send({ fileCount: req.files.length });
  });
}