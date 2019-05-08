const path = require('path');
const marked = require('marked');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
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
    return './src/pages';
  }

  constructor({config}) {
    this.sections = config.sections;
    this.docsRepoUrl = config.docsRepoUrl;
    this.nightwatchVersion = config.NIGHTWATCH_VERSION;
    this.outputFolder = path.resolve(config.OUTPUT_FOLDER);
    this.docsPath = config.NIGHTWATCH_DOCS_PATH;
    this.pagesConfig = require(path.resolve(Parser.docsPagesConfig));

    this.output = {
      indexFile: path.join(this.outputFolder, 'index.html'),
      sectionsFolder: path.join(this.outputFolder, 'js/app/sections')
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
      const editLink = `${this.docsRepoUrl}/edit/master/${fileName}?message=docs%3A%20describe%20your%20change`;

      return Utils.readFile(path.join(this.docsPath, fileName)).then(data => {
        this.content[section] = marked(data.replace(/<body>/g, '&lt;body&gt;'));

        // inserting the suggest edit link
        this.content[section] = this.content[section].replace(/^<(h2|h3)\s([^>]+)>(.+)<\/(h2|h3)>/,
          `<$1 $2>$3 <a title="Suggest edits" class="edit-source" href="${editLink}">Suggest edits</a></$4>`);

        // inserting the surrounding div around h2
        this.content[section] = this.content[section].replace(/^<(h2)\s([^>]+)>(.+)<\/(h2)>/,
          '<div class="page-header"><h2 $2>$3</h2></div>');
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
        .concat(this.loadIncludes(), this.loadSections(), this.loadPageTemplates())
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
        this.content['_sections_'] = values;
      });
  }

  loadPageTemplates() {
    this.content._pages_ = {};

    const promises = Object.keys(this.sections).map(async sectionName => {
      const fullPath = `${path.join(Parser.pagesIncludesPath, sectionName)}.html.ejs`;

      this.content._pages_[sectionName] = await Utils.readFile(fullPath);
    });

    return Promise.all(promises);
  }

  writeSections({apiData}) {
    mkdirp.sync(this.output.sectionsFolder);

    const promises = Object.keys(this.sections).reduce((prev, key) => {
      if (this.content['_sections_'][key]) {
        const fileName = path.join(this.output.sectionsFolder, `${key}.txt`);
        const {pageTitle, title, description} = this.sections[key];

        this.content._includes_ = this.renderIncludes(this.content._includes_, true, {
          pageTitle,
          title,
          section:key,
          pageDescription: description
        });

        this.content['_sections_'][key] = ejs.render(this.content['_sections_'][key], {
          content: this.content,
          version: this.nightwatchVersion,
          pageTitle,
          title,
          api: apiData.output,
          methods: apiData.methods,
          pageDescription: description
        });

        prev.push(Utils.writeFile(fileName, this.content['_sections_'][key]));
      }

      return prev;
    }, []);

    return Promise.all(promises);
  }

  writePages() {
    const promises = Object.keys(this.sections).map(async (key) => {
      let outputFolder = this.outputFolder;
      let secondaryPage = false;
      if (key !== 'index') {
        secondaryPage = true;
        outputFolder = path.join(this.outputFolder, key);
        mkdirp.sync(outputFolder);
      }

      const fileName = path.join(outputFolder, 'index.html');
      const {pageTitle, title, description} = this.sections[key];

      await this.loadIncludes();
      this.content._includes_ = this.renderIncludes(this.content._includes_, secondaryPage, {
        pageTitle,
        title,
        section:key,
        pageDescription: description
      });

      this.content['_pages_'][key] = ejs.render(this.content['_pages_'][key], {
        content: this.content,
        version: this.nightwatchVersion,
        pageTitle,
        title,
        pageDescription: description
      });

      return Utils.writeFile(fileName, this.content['_pages_'][key]);
    }, []);

    return Promise.all(promises);
  }

  async start(apiData) {
    const startTime = new Date().getTime();

    await this.writeSections({apiData});
    await this.writePages();

    console.log('DONE');
  }
};
