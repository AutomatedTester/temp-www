const marked = require('marked');
const swig = require('swig');
const path = require('path');
const ejs = require('ejs');
const ApiDocs = require('./ApiDocs.js');
const Utils = require('./utils.js');

module.exports = class ApiPage {
  static get apiPageTemplateFile() {
    return './src/pages/api.ejs';
  }

  static get apiPage() {
    return './public/js/app/api/index.html';
  }

  static get headerTemplateFile() {
    return './src/include/header.html.ejs';
  }

  static get apiMethodPage() {
    return './public/js/app/api/method.html';
  }

  static get apiMethodData() {
    return '../public/js/app/api/methods.json';
  }

  constructor({config}) {
    this.docsPath = config.NIGHTWATCH_DOCS_PATH;
    this.nightwatchVersion = config.NIGHTWATCH_VERSION;
    this.outputFolder = path.resolve(config.OUTPUT_FOLDER);
    this.apiOutputFile = path.join(this.outputFolder, ApiDocs.outputFileName);

    this.apiData = {
      output: require(this.apiOutputFile),
      methods: require(ApiPage.apiMethodData)
    };
  }

  parseApiDocs() {
    return swig.renderFile(ApiPage.apiPage, {
      api: this.apiData.output,
      methods: this.apiData.methods
    });
  }

  /**
   * Read api output data and check if there's a detailed .md file for each method,
   *  and if so load it, parse the markdown and added it back to the output data object
   *
   * @return {Promise}
   */
  readApiMethodsOutput() {
    const promises = Object.keys(this.apiData.output).reduce((prev, namespace) => {
      if (namespace.startsWith('protocol')) {
        this.apiData.output[namespace].forEach((method, index) => {
          const filePath = `${path.join(this.docsPath, 'api/method/', method.name)}.md`;

          prev.push(Utils
            .readFile(filePath)
            .catch(_ => (null))
            .then(data => {
              if (data) {
                this.apiData.output[namespace][index]['more'] = marked(data);
              }
            })
          );
        });
      }

      return prev;
    }, []);

    return Promise.all(promises).then(_ => {
      const json = JSON.stringify(this.apiData.output);

      return Utils.writeFile(this.apiOutputFile, json);
    });
  }

  /**
   * For each api method, write a static html page
   */
  async writeApiMethodPages(content) {
    const apis = {};

    Object.keys(this.apiData.output).forEach((key) => {
      if (key.startsWith('protocol.') || key === 'commands') {
        this.apiData.output[key].forEach(item => {
          apis[item.name] = item;
        });
      }
    });

    const templateData = await Utils.readFile(ApiPage.apiPageTemplateFile);
    const headerTemplateData = await Utils.readFile(ApiPage.headerTemplateFile);

    return Promise.all(Object
      .keys(apis)
      .map(fileName => this.writeApiMethod({
        templateData,
        headerTemplateData,
        fileData: apis[fileName],
        fileName,
        content
      }))
    );
  }

  writeApiMethod({fileData, templateData, headerTemplateData, content, fileName}) {
    const outputFileName = `${path.join(this.docsPath, 'api/', fileName)}.html`;
    const methodData = swig.renderFile(ApiPage.apiMethodPage, fileData);
    const pageTitle = `${fileData.name} | API Reference | Nightwatch.js`;
    const title = `${fileData.name} | API Reference`;
    const pageDescription = fileData.descr.split('<')[0];

    content['_includes_'].header = ejs.render(headerTemplateData, {
      version : this.nightwatchVersion,
      pageTitle,
      title,
      pageDescription
    });

    const rendered = ejs.render(templateData, {
      apiMethodData: methodData,
      content,
      version: this.nightwatchVersion,
      apidocs: this.apiData.output
    });


    return Utils.writeFile(outputFileName, rendered);
  }

};
