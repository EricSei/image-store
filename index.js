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
// Port Setup
// -----------------------------------------------------------------------------------------
const port = process.env.PORT || 5000;
app.listen(port);
console.log('Server is up and listening on port:', port);