const config = require('../lib/config.js');
const mkdirp = require('mkdirp');
const ncp = require('ncp').ncp;
const path = require('path');

mkdirp.sync(config.OUTPUT_FOLDER);
ncp(path.join(__dirname, '../public/'), config.OUTPUT_FOLDER, function (err) {
  if (err) {
    return console.error(err);
  }
});
