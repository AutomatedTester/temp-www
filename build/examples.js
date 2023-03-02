const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

const ExamplesDir = path.join(process.env.EXAMPLES_DIR, 'tests');
const OutputDir = path.join(process.env.OUTPUT_FOLDER, '__examples');
const ejsTemplate_JS = fs.readFileSync(path.join(__dirname, 'example-js.ejs')).toString('utf-8');
const ejsTemplate_IFRAME = fs.readFileSync(path.join(__dirname, 'example-iframe.ejs')).toString('utf-8');

const ApiCommands = require('./output.json');

Object.keys(ApiCommands).forEach(key => {

  const item = ApiCommands[key];

  item.forEach((command, index) => {
    const exampleFile = path.resolve(path.join(ExamplesDir, `api/${command.name}.js`));
    const fileExists = fs.existsSync(exampleFile);

    if (fileExists) {
      command.exampleLink =  `tests/api/${command.name}.js`;

      ApiCommands[key][index] = command;

      const contents = fs.readFileSync(exampleFile).toString('utf-8');

      const jsResult = ejs.render(ejsTemplate_JS, {
        name: command.name,
        editorOnly: command.editorOnly,
        contents
      });

      const iframeResult = ejs.render(ejsTemplate_IFRAME, {
        name: command.name,
        pageTitle: `${command.name} command example - Nightwatch.js`,
        pageDescription: `Live example for Nightwatch.js ${command.name} command running in the browser.`,
        pageImage: 'https://nightwatchjs.org/img/banners/nightwatchjs.jpg',
        editorOnly: command.editorOnly,
        contents
      });

      const jsOutputFile = path.join(OutputDir, `${command.name}.js`)
      const htmlOutputFile = path.join(OutputDir, `${command.name}.html`)

      fs.writeFileSync(jsOutputFile, jsResult);
      fs.writeFileSync(htmlOutputFile, iframeResult);
      console.log(`Generated ${jsOutputFile}`);
    }
  })
});

fs.writeFileSync('./build/output.json', JSON.stringify(ApiCommands, null, 2));