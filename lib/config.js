const path = require('path');
const fs = require('fs');
require('dotenv').config();

const initConfig = function({ configFile }) {
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

    return prev;
  }, {});
};

module.exports = initConfig({
  configFile: 'app.conf.json'
});
