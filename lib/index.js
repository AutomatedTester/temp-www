const config = require('./config.js');
const ApiDocs = require('./ApiDocs.js');
const ApiPage = require('./ApiPage.js');
const MarkdownParser = require('./MarkdownParser.js');

module.exports.makeApiDocs = function() {
  const apiDocs = new ApiDocs({config});

  return apiDocs.createDocFile();
};

module.exports.parsePages = async function() {
  const parser = new MarkdownParser({config});
  const apiPage = new ApiPage({config});

  // loading .ejs content pages
  await parser.loadContent();

  // loading api methods
  await apiPage.readApiMethodsOutput();

  // writing individual api method pages
  await apiPage.writeApiMethodPages(parser.content);

  // writing individual pages
  const apiDocs = apiPage.parseApiDocs();

  await parser.start(apiDocs);
};
