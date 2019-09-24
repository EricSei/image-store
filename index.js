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

// -----------------------------------------------------------------------------------------
// Internal Dependencies
// -----------------------------------------------------------------------------------------
require('dotenv/config');
const authRouter   = require('./routes/authentication');
const uploadRouter = require('./routes/upload');
const mongoDB      = require('./services/mongoDB');

// -----------------------------------------------------------------------------------------
// Middlewares
// -----------------------------------------------------------------------------------------
app.use(bodyParser.json());
app.use(cors());
app.use(methodOverride('_method'));

// -----------------------------------------------------------------------------------------
// Initialize gfs (grid fs stream)
// -----------------------------------------------------------------------------------------
let gfs;

mongoDB.conn.once('open', () => {
    // Init stream
    gfs = Grid(mongoDB.conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// -----------------------------------------------------------------------------------------
// Route Handlers
// -----------------------------------------------------------------------------------------
authRouter(app);
uploadRouter(app);

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

// -----------------------------------------------------------------------------------------
// Port Setup
// -----------------------------------------------------------------------------------------
const port = process.env.PORT || 5000;
app.listen(port);
console.log('Server is up and listening on port:', port);