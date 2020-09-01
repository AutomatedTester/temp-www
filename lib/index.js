const config = require('./config.js');
const ApiDocs = require('./ApiDocs.js');
const ApiPage = require('./ApiPage.js');
const MarkdownParser = require('./MarkdownParser.js');

module.exports.makeApiDocs = function() {
  const apiDocs = new ApiDocs({config});

  return apiDocs.createDocFile();
};

module.exports.parsePages = async function({buildReleases = false} = {}) {
  const parser = new MarkdownParser({config, buildReleases});
  const apiPage = new ApiPage({config});

  // loading .ejs content pages
  try {
    await parser.loadContent();

    // loading api methods
    await apiPage.readApiMethodsOutput();

    // writing individual api method pages
    await apiPage.writeApiMethodPages(parser.content);

    await parser.start(apiPage.apiData);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
