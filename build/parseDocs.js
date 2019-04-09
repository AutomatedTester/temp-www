#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const swig = require('swig');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const Pages = require('./templates/pages.json');

const CONFIG = {
  Version: 'v1.0.18',
  includesPath: './templates/include/',
  pagesIncludesPath: './templates/pages/',
  templateFile: './templates/index.html.ejs',
  outputFolder: process.argv[2] || './output',
  nightwatchDocsPath: '../nightwatch-docs/',
  nightwatchFolder: process.env.NIGHTWATCH_FOLDER || '/Users/andrei/www/new.nightwatchjs.org/',
};

const OUTPUT = {
  apiOutputFile: `${CONFIG.nightwatchFolder}js/app/api/output.json`,
  apiTemplate: `${CONFIG.nightwatchFolder}js/app/api/index.html`,
  apiMethodPage: `${CONFIG.nightwatchFolder}js/app/api/method.html`,
  indexOutputFile: `${CONFIG.outputFolder}index.html`
};

const ApiOutput = require(OUTPUT.apiOutputFile);
const ApiMethods = require(`${CONFIG.nightwatchFolder}js/app/api/methods.json`);

const Sections = {
  guide : {
    pageTitle : 'Developer Guide | Nightwatch.js',
    title : 'Developer Guide',
    description : 'In depth guides on how to use Nightwatch to write and execute tests.'
  },
  api : {
    pageTitle : 'API Reference | Nightwatch.js',
    title : 'API Reference',
    description : 'Complete reference of the Nightwatch commands and assertions.'
  },
  contact : {
    pageTitle : 'Contact | Nightwatch.js',
    title : 'Contact',
    description : 'How to get in touch with the team, and where to submit bugs and feature requests.'
  },
  gettingstarted : {
    pageTitle : 'Getting Started | Nightwatch.js',
    title : 'Getting Started',
    description : 'Everything you need in order to get started with Nightwatch.js, step-by-step, with configuration guides for various browsers.'
  }
};

process.on('unhandledRejection', err => {
  console.error('unhandledRejection##', err.stack)
});

class Parser {
  static parseApiDocs(cb) {
    return swig.renderFile(OUTPUT.apiTemplate, {
      api: ApiOutput,
      methods: ApiMethods
    });
  }

  static readFileSync(file) {
    return fs.readFileSync(file).toString();
  }

  static readFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, function (err, data) {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        resolve(data.toString());
      });
    });
  }

  static loadIncludes(includesPath) {
    return new Promise((resolve, reject) => {
      let includes = {};

      fs.readdir(includesPath, (err, filenames) => {
        if (err) {
          reject(err);
          return;
        }

        Promise.all(filenames.filter(filename => {
          return filename.endsWith('.ejs');
        }).map(filename => {
          let key = filename.split('.')[0];

          return Parser.readFile(path.join(includesPath, filename)).then(data => {
            includes[key] = data;
          });
        })).then(_ => {
          resolve(includes);
        });
      });
    });
  }

  static loadIndexTemplate() {
    return Parser.readFile(CONFIG.templateFile);
  }

  constructor() {
    this.content = {};
  }

  readSectionPages(pageSections) {
    return Promise.all(Object.keys(pageSections).map(section => {
      let file = pageSections[section];

      return Parser.readFile(CONFIG.nightwatchDocsPath + file).then(data => {
        this.content[section] = marked(data.replace(/<body>/g, '&lt;body&gt;'));
      });
    }));
  }

  readContent() {
    return Promise.all(Object.keys(Pages).map(page => {
      return this.readSectionPages(Pages[page]);
    }));
  }

  static parseExtraFileData(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return resolve(null);
        }

        if (stats.isFile()) {
          Parser.readFile(filePath).then(data => {
            resolve(marked(data));
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  static readApiMethodsOutput(cb) {
    const startTime = new Date().getTime();

    return new Promise((resolve, reject) => {
      const promises = Object.keys(ApiOutput).reduce((prev, namespace) => {
        if (namespace.startsWith('protocol')) {
          ApiOutput[namespace].forEach((method, index) => {
            const filePath = `${CONFIG.nightwatchDocsPath}api/method/${method.name}.md`;

            prev.push(Parser.parseExtraFileData(filePath).then(data => {
              if (data) {
                ApiOutput[namespace][index]['more'] = marked(data);
              }
            }));
          });
        }

        return prev;
      }, []);

      Promise.all(promises).then(_ => {
        const json = JSON.stringify(ApiOutput);
        fs.writeFile(OUTPUT.apiOutputFile, json, 'utf8', function(err) {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log('readApiMethodsOutput', new Date().getTime() - startTime);
            resolve(ApiOutput);
          }
        });
      });
    });
  }

  renderIncludes(includes, secondaryPage) {
    let rendered = {};
    Object.keys(includes).forEach(key => {
      rendered[key] = ejs.render(includes[key], {
        secondaryPage,
        version : CONFIG.Version
      });
    });

    return rendered;
  }

  renderPages(includes, pageTitle, title = '', descr) {
    let rendered = {};
    Object.keys(includes).forEach(key => {
      rendered[key] = ejs.render(includes[key], {
        content : this.content,
        version : CONFIG.Version,
        pageTitle: pageTitle,
        title: title,
        pageDescription: descr
      });
    });

    return rendered;
  }

  writeApiMethod(templateData, fileData, apiDocs, fileName, includes) {
    const outputFileName = `${CONFIG.outputFolder}api/${fileName}.html`;
    const methodData = swig.renderFile(OUTPUT.apiMethodPage, fileData);
    const pageTitle = `${fileData.name} | API Reference | Nightwatch.js`;
    const title = `${fileData.name} | API Reference`;
    const descr = fileData.descr.split('<')[0];

    this.content['_pages_'] = this.renderPages(includes, pageTitle, title, descr);

    const rendered = ejs.render(templateData, {
      apiMethodData : methodData,
      content : this.content,
      version : CONFIG.Version,
      apidocs : apiDocs
    });

    return new Promise((resolve, reject) => {
      fs.writeFile(outputFileName, rendered, 'utf8', function(err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  writeIndexPage(fileName, template, apiDocs, secondaryPage) {
    return new Promise((resolve) => {
      let rendered = ejs.render(template, {
        content: this.content,
        version: CONFIG.Version,
        apidocs: apiDocs,
        secondaryPage
      });

      fs.writeFile(fileName, rendered, function(err) {
        if (err) {
          console.log(err);
          throw err;
        }
        resolve();
      });
    });
  }

  writePages(includes, template, apiDocs) {
    const promises = [];
    const startTime = new Date().getTime();

    Object.keys(Sections).forEach(key => {
      try {
        mkdirp.sync(`${CONFIG.outputFolder}${key}`);
      } catch (e) {}

      let fileName = `${CONFIG.outputFolder}${key}/index.html`;
      let data = Sections[key];
      this.content['_pages_'] = this.renderPages(includes, data.pageTitle, data.title, data.description);

      promises.push(this.writeIndexPage(fileName, template, apiDocs, true));
    });

    return Promise.all(promises).then(_ => {
      console.log('writePages', new Date().getTime() - startTime);
    })
  }

  writeApiMethodPages(includes, output, apiDocs) {
    let apis = {};
    const startTime = new Date().getTime();

    Object.keys(output).forEach((key) => {
      if (key.startsWith('protocol.') || key === 'commands') {
        output[key].forEach(item => {
          apis[item.name] = item;
        });
      }
    });

    return Parser.readFile('./templates/api/index.html.ejs')
      .then(data => {
        return Promise.all(Object.keys(apis).map(fileName => {
          return this.writeApiMethod(data, apis[fileName], apiDocs, fileName, includes);
        }));
      })
      .then(_ => {
        console.log('writeApiMethodPages', new Date().getTime() - startTime);
      })
  }

  start() {
    let startTime = new Date().getTime();

    Promise.all([
      Parser.loadIncludes(CONFIG.includesPath),
      Parser.loadIncludes(CONFIG.pagesIncludesPath),
      Parser.loadIndexTemplate(),
      Parser.readApiMethodsOutput()
    ])
    .then(values => {
      const apiDocs = Parser.parseApiDocs();

      this.content['_includes_'] = this.renderIncludes(values[0], true);

      let pagesContent = values[1];
      let templateContent = values[2];
      let apiOutput = values[3];

      return Promise.all([
        this.writePages(pagesContent, templateContent, apiDocs),
        this.writeApiMethodPages(pagesContent, apiOutput, apiDocs)
      ]).then(() => {
        let indexTitle = 'Nightwatch.js | Node.js powered End-to-End testing framework';
        let indexDescr = 'Write efficient and straightforward end-to-end tests in Node.js which run against a Selenium/WebDriver server.';
        this.content['_includes_'] = this.renderIncludes(values[0], false);
        this.content['_pages_'] = this.renderPages(pagesContent, indexTitle, indexTitle, indexDescr);

        return this.writeIndexPage(OUTPUT.indexOutputFile, templateContent, apiDocs, false);
      });
    })
    .then(function() {
      console.log(`FINISHED in ${new Date().getTime() - startTime}ms.`);
    });
  }
}

let parser = new Parser();
parser.readContent().then(_ => parser.start());
