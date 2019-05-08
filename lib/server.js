const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const config = require('./config.js');

app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.text({limit: '10mb'}));
app.use(cookieParser('123456'));

app.use('/', express.static(config.OUTPUT_FOLDER, {}));
app.listen(config.devServerPort, function () {
  console.log('Listening ...');
});
