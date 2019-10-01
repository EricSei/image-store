// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
const middlewares = require('../middlewares');
const Image       = require('../models/image');

//----------------------------------------------------------------
// Display API
//----------------------------------------------------------------

module.exports = function(app) {

    // For debugging purposes.
    app.get('/api/display', (req, res) => {
        res.send({ msg: 'This is the display route!'});
    });
    
    //This will send all images' info
    app.get('/api/display/fetchall', (req, res) => {
        Image.find()
        .then(imgs => {
            res.json(imgs)
        })
        .catch(err => res.json({err: err.toString()}));
    });
  }