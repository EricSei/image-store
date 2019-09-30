// -----------------------------------------------------------------------------------------
// External Dependencies
// -----------------------------------------------------------------------------------------
const express         = require('express');
const app             = express();
const bodyParser      = require('body-parser');
const cors            = require('cors');
const Grid            = require('gridfs-stream');
const methodOverride  = require('method-override');
const mongoose        = require('mongoose');
const https           = require('https');

// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
if(process.env.NODE_ENV !== 'production') require('dotenv/config');
const authRouter    = require('./routes/authentication');
const uploadRouter  = require('./routes/upload');
const displayRouter = require('./routes/display')
const keys          = require('./config/keys');
const Image         = require('./models/image');

// -----------------------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------------------
app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride('_method'));

// -----------------------------------------------------------------------------------------
// MongoDB Connection
// -----------------------------------------------------------------------------------------
const mongoURI = keys.mongoURI;
const promise = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
const conn = mongoose.connection;

// -----------------------------------------------------------------------------------------
// Initialize gfs (grid fs stream)
// -----------------------------------------------------------------------------------------
let gfs = {};

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    // Display Route Handlers.
    // displayRouter(app, gfs);
});

// -----------------------------------------------------------------------------------------
// Route Handlers
// -----------------------------------------------------------------------------------------
authRouter(app);
uploadRouter(app);

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

// -----------------------------------------------------------------------------------------
// Heroku Setup
// -----------------------------------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets. (e.g. main.js, or main.css)
  app.use(express.static('client/build'));

  // Express will serve up the index.html if it doesn't recognize the route.
  const path = require('path');

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

setInterval(function() {
  https.get("https://ctp-image-store.herokuapp.com/");
}, 300000);

// -----------------------------------------------------------------------------------------
// Port Setup
// -----------------------------------------------------------------------------------------
const port = process.env.PORT || 5000;
app.listen(port);
console.log('Server is up and listening on port:', port);