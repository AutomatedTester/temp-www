const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

const ExamplesDir = path.join(process.env.EXAMPLES_DIR, 'tests');
const OutputDir = path.join(process.env.OUTPUT_FOLDER, '__examples');
const ejsTemplate = fs.readFileSync(path.join(__dirname, 'example.ejs')).toString('utf-8');
const ApiCommands = require('./output.json');

Object.keys(ApiCommands).forEach(key => {

  const item = ApiCommands[key];

  item.forEach(command => {
    if (command.exampleLink) {
      const filePath = path.join(ExamplesDir, command.exampleLink);
      const contents = fs.readFileSync(filePath).toString('utf-8');
      const result = ejs.render(ejsTemplate, {
        name: command.name,
        editorOnly: command.editorOnly,
        contents
      });

      fs.writeFileSync(path.join(OutputDir, `${command.name}.html`), result);
    }
  })


})