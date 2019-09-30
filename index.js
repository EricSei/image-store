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
const authRouter   = require('./routes/authentication');
const uploadRouter = require('./routes/upload');
const displayRouter = require('./routes/display')
// const mongoDB      = require('./services/mongoDB');
const keys         = require('./config/keys');

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
    displayRouter(app, gfs);
    console.log('connected'); 
});

// -----------------------------------------------------------------------------------------
// Route Handlers
// -----------------------------------------------------------------------------------------
authRouter(app);
uploadRouter(app);

app.get('/api/images', (req, res) => {
  gfs.files.find({}).toArray((err, images) => {
    if (err) return res.json([]);
    return res.json(images);
  });
});

app.get('/api/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || !file.length) return res.status(404).json({ error: 'No image to serve!'});
    
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gfs.createReadStream({ filename: file.filename });
      readstream.pipe(res);
    } else {
      res.status(404).json({ error: 'Not an image!' });
    }
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