const path = require('path');
const marked = require('marked');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const ApiDocs = require('./ApiDocs.js');
const ApiPage = require('./ApiPage.js');
const Utils = require('./Utils.js');

module.exports = class Parser {
  static get docsPagesConfig() {
    return './src/pages.json';
  }

  static get includesPath() {
    return './src/include';
  }

  static get sectionsIncludesPath() {
    return './src/sections';
  }

  static get pagesIncludesPath() {
    return './src/pages-test';
  }

  constructor({config}) {
    this.sections = config.sections;
    this.nightwatchVersion = config.NIGHTWATCH_VERSION;
    this.outputFolder = path.resolve(config.OUTPUT_FOLDER);
    this.docsPath = config.NIGHTWATCH_DOCS_PATH;
    this.pagesConfig = require(path.resolve(Parser.docsPagesConfig));

    this.output = {
      indexFile: path.join(this.outputFolder, 'index.html')
    };


    this.content = {};
  }

  static async loadIncludes(includesPath) {
    const includes = {};
    let files = await Utils.readDir(includesPath);
    files = files.filter(filename => (filename.endsWith('.ejs')));

    const promises = files.map(async filename => {
      const key = filename.split('.')[0];
      const fullPath = path.join(includesPath, filename);

      includes[key] = await Utils.readFile(fullPath);
    });

    await Promise.all(promises);

    return includes;
  }

  readDocsPages(pageSections) {
    return Promise.all(Object.keys(pageSections).map(section => {
      const fileName = pageSections[section];

      return Utils.readFile(path.join(this.docsPath, fileName)).then(data => {
        this.content[section] = marked(data.replace(/<body>/g, '&lt;body&gt;'));
      });
    }));
  }

  renderIncludes(includes, secondaryPage, data = {}) {
    let rendered = {};
    Object.keys(includes).forEach(key => {
      rendered[key] = ejs.render(includes[key], Object.assign({
        secondaryPage,
        version : this.nightwatchVersion
      }, data));
    });

    return rendered;
  }

  loadContent() {
    return Promise.all(
      Object
        .keys(this.pagesConfig)
        .map(page => this.readDocsPages(this.pagesConfig[page]))
        .concat(this.loadIncludes(), this.loadSections())
    );
  }

  loadIncludes() {
    return Parser.loadIncludes(Parser.includesPath)
      .then(values => {
        this.content['_includes_'] = values;
      });
  }

  loadSections() {
    return Parser.loadIncludes(Parser.sectionsIncludesPath)
      .then(values => {
        console.log('sections', values)
        this.content['_sections_'] = values;
      });
  }

  writeSections({sections, apiDocs}) {
    mkdirp.sync(path.join(this.outputFolder, 'sections'));

    const promises = Object.keys(sections).reduce((prev, key) => {
      console.log(key, typeof this.content['_sections_'][key])
      if (this.content['_sections_'][key]) {
        let fileName = path.join(this.outputFolder, 'sections', `${key}.txt`);
        console.log('fileName', fileName)

        const data = sections[key];
        const {pageTitle, title, description} = data;

        this.content._includes_ = this.renderIncludes(this.content._includes_, true, {
          pageTitle,
          title,
          pageDescription: description
        });

        this.content['_sections_'][key] = ejs.render(this.content['_sections_'][key], {
          content: this.content,
          version: this.nightwatchVersion,
          pageTitle,
          title,
          apiDocs,
          pageDescription: description
        });

        prev.push(Utils.writeFile(fileName, this.content['_sections_'][key]));
      }

      return prev;
    }, []);

    return Promise.all(promises);
  }

  async start(apiDocs) {
    const startTime = new Date().getTime();
    const sections = {
      index: {
        "pageTitle" : "Nightwatch.js",
        "title" : "Nightwatch.js",
        "description" : ""
      },
      contact: {
        pageTitle : 'Contact | Nightwatch.js',
        title : 'Contact',
        description : 'How to get in touch with the team, and where to submit bugs and feature requests.'
      },
      api : {
        pageTitle : 'API Reference | Nightwatch.js',
        title : 'API Reference',
        description : 'Complete reference of the Nightwatch commands and assertions.'
      },
    };

    await this.writeSections({sections, apiDocs});
    console.log('DONE');
  }
};
