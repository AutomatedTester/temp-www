const path = require('path');
const fs = require('fs');
const Utils = require('./utils.js');
require('dotenv').config();

const initConfig = function({ configFile, parsers = {} }) {
  let AppConf;
  try {
    const data = fs.readFileSync(path.resolve(process.cwd(), configFile));
    AppConf = JSON.parse(data);
  } catch (err) {
    console.error(err);
    AppConf = {};
  }

  return Object.keys(AppConf).reduce((prev, key) => {
    const isDefined = process.env[key] !== undefined;
    prev[key] = isDefined ? process.env[key] : AppConf[key];

    if (parsers[key]) {
      prev[key] = parsers[key](prev[key]);
    }

    return prev;
  }, {});
};

const convertToBoolen = function(val) {
  return Utils.convertBoolean(val);
};

const convertToNumber = function(val) {
  return Number(val);
};

module.exports = initConfig({
  configFile: 'app.conf.json',
  parsers: {

  },
});
