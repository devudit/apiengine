const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')();
const ModuleRegistry = require('./core/engine/ModuleRegistry');
require('dotenv').config();
const _dbm = require('db-migrate');
const bluebird = require('bluebird');

// Global directories
global.rootDir = __dirname;
global.publicDir = rootDir + "/public/";
global.cacheDir = publicDir + "cache/";
global.publicImgDir = publicDir + "images/";

// Engine Globals
global.dbMigrate = _dbm.getInstance(true);
global.fs = bluebird.promisifyAll(require("fs"));
global.utils = require('./core/engine/Utils');
global.mysql = require('./core/database/mysql');

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

// Load core and contrib modules
global.loadedModules = ModuleRegistry.register();

// Server
let server = require('http').createServer(app);

// listen for requests
server.listen(process.env.MAIN_PORT, function () {
    console.log("Listening on " + process.env.MAIN_PORT);
});