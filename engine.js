const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')();
const ModuleRegistry = require('./core/engine/ModuleRegistry');
require('dotenv').config();


// Global directories
global.rootDir = __dirname;
global.publicDir = rootDir + "/public/";
global.cacheDir = publicDir + "cache/";
global.publicImgDir = publicDir + "images/";

// create express app
app = express();

// Trust proxy
app.enable('trust proxy');

// Cors settings
app.use(cors);
app.options('*', cors);

// parse requests of content-type - application/x-www-form-urlencoded
// parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load modules
global.loadedModules = ModuleRegistry.register();

// Include express routes
app.use(require("./core/routes/routes"));
let server = require('http').createServer(app);

// listen for requests
server.listen(process.env.MAIN_PORT, function () {
    console.log("Listening on " + process.env.MAIN_PORT);
});