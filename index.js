// -----------------------------------------------------------------------------------------
// External Dependencies
// -----------------------------------------------------------------------------------------
const express         = require('express');
const app             = express();
const bodyParser      = require('body-parser');
const mongoose        = require('mongoose');
const jwt             = require('jwt-simple');
const cors            = require('cors');
const path            = require('path'); 
const crypto          = require('crypto'); 
const multer          = require('multer');
const GridFsStorage   = require('multer-gridfs-storage');
const Grid            = require('gridfs-stream');
const methodOverride  = require('method-override'); // Not necessary but maybe useful later on

// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
const User = require('./models/user');
require('dotenv/config');
const keys = require('./config/keys');

// -----------------------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------------------
app.use(bodyParser.json({ type: '*/*' }));
app.use(cors());
app.use(methodOverride('_method')); 

// -----------------------------------------------------------------------------------------
// MongoDB Setup
// -----------------------------------------------------------------------------------------
const mongoURI = 'mongodb://localhost:27017/imagestore';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

// -----------------------------------------------------------------------------------------
// Initialize gfs (grid fs stream)
// -----------------------------------------------------------------------------------------
let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// -----------------------------------------------------------------------------------------
// Create storage engine
// -----------------------------------------------------------------------------------------
const storage = new GridFsStorage({
  url: mongoURI,
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

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => { // Makes sure only images upload to the uploads collection
      const ifValidFile = ['.png', '.jpg', '.jpeg'].some(ext => ext == path.extname(file.originalname));
      
      if(ifValidFile) {
          return cb(null, true);
      } else {
          return cb(null, false);
      }
    }
});

// -----------------------------------------------------------------------------------------
// Authentication API
// -----------------------------------------------------------------------------------------
app.get('/api', (req, res, next) => {
  res.send('Welcome to the Imagestore API.');
});

app.post('/api/signup', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) return res.status(422).send({ error: 'You must provide both email and password' });

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) return next(err);
    if (existingUser) return res.status(422).send({ error: 'Email is in use!' });

    const newUser = new User({
      email: email,
      password: password,
      image_filenames: []
    });

    newUser.save(err => {
      if (err) return next(err);
      res.json({ token: tokenForUser(newUser) });
    });
  });
});

// -----------------------------------------------------------------------------------------
// Helper Methods
// -----------------------------------------------------------------------------------------
function tokenForUser(user) {
  const timestamp = new Date().getTime();

  return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
}

// -----------------------------------------------------------------------------------------
// Port Setup
// -----------------------------------------------------------------------------------------
const port = process.env.PORT || 5000;
app.listen(port);
console.log('Server is up and listening on port:', port);