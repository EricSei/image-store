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
const passport        = require('passport');
const JwtStrategy     = require('passport-jwt').Strategy;
const ExtractJwt      = require('passport-jwt').ExtractJwt;
const LocalStrategy   = require('passport-local');

// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
const User  = require('./models/user');
const Image = require('./models/image');
require('dotenv/config');
const keys = require('./config/keys');

// -----------------------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------------------
app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride('_method'));

const requireAuth   = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false });

// -----------------------------------------------------------------------------------------
// MongoDB Setup
// -----------------------------------------------------------------------------------------
const mongoURI = 'mongodb+srv://imagicat:123@image-store-iz5hu.mongodb.net/test?retryWrites=true&w=majority';
const promise = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
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

const upload = multer({ 
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

// -----------------------------------------------------------------------------------------
// Authentication API
// -----------------------------------------------------------------------------------------
app.get('/api', requireAuth, (req, res, next) => {
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
      image_fileIDs: []
    });

    newUser.save(err => {
      if (err) return next(err);
      res.json({ token: tokenForUser(newUser) });
    });
  });
});

app.post('/api/signin', requireSignin, (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
});

// -----------------------------------------------------------------------------------------
// Upload API
// -----------------------------------------------------------------------------------------
app.post('/api/upload', /*requireAuth,*/ upload.array('file'), (req, res) => {
  req.files.forEach(file => {
    const fileID = file.id;
    const userId = req.user? req.user._id : null;

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

// -----------------------------------------------------------------------------------------
// JWT Strategy
// -----------------------------------------------------------------------------------------
function tokenForUser(user) {
  const timestamp = new Date().getTime();

  return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: keys.jwtSecret   
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);

    if (user) done(null, user);
    else      done(null, false);
  });
});

passport.use(jwtLogin);

// -----------------------------------------------------------------------------------------
// Local Strategy
// -----------------------------------------------------------------------------------------
const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email: email }, (err, user) => {
    if (err)   return done(err);
    if (!user) return done(null, false);

    user.comparePassword(password, (err, isMatch) => {
      if (err)      return done(err);
      if (!isMatch) return done(null, false);
      return done(null, user);
    });
  });
});

passport.use(localLogin);

// -----------------------------------------------------------------------------------------
// Port Setup
// -----------------------------------------------------------------------------------------
const port = process.env.PORT || 5000;
app.listen(port);
console.log('Server is up and listening on port:', port);