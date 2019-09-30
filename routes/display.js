// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
const middlewares = require('../middlewares');
const Image       = require('../models/image');
const mongoDB     = require('../services/mongoDB')

//----------------------------------------------------------------
// Display API
//----------------------------------------------------------------

module.exports = function(app, gfs) {

    //This will send image info
    app.get('/api/display', (req, res) => {
        Image.find()
        .then(imgs => {
            res.json({images: imgs})
        })
        .catch(err => res.json({err: err}));
    });

    //This will send image stream
    app.get('/api/display/filestream/:filename', (req, res) => {
        gfs.files.findOne({filename: req.params.filename}, (err, file) => {
            if(err) {
                return res.status(404).json({err});
            }
            // Check if file
            if(!file || file.length == 0) {
                return res.status(404).json({
                    err: 'No file exists'
                });
            };
            res.contentType =  file.contentType;
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        });    
    });
  }