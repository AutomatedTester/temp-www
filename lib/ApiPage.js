const marked = require('marked');
const swig = require('swig');
const path = require('path');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const Utils = require('./utils.js');

module.exports = class ApiPage {
  static get apiMethodPageTemplateFile() {
    return './src/pages/api/method.ejs';
  }

  static get headerTemplateFile() {
    return './src/include/header.html.ejs';
  }

  static get apiMethodPage() {
    return './src/pages/api/api-method.md';
  }

  static get apiMethodData() {
    return '../public/js/app/api/methods.json';
  }

  constructor({config}) {
    this.baseUrl = config.baseUrl;
    this.docsPath = config.NIGHTWATCH_DOCS_PATH;
    this.nightwatchVersion = config.NIGHTWATCH_VERSION;
    this.outputFolder = path.resolve(config.OUTPUT_FOLDER);
    this.mdApiOutputFolder = path.resolve('./build/api');
    this.apiOutputFile = path.resolve('./build/output.json');

    this.apiData = {
      output: require(this.apiOutputFile),
      methods: require(ApiPage.apiMethodData)
    };
  }

  /**
   * Read api output data and check if there's a detailed .md file for each method,
   *  and if so load it, parse the markdown and add it back to the output data object
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
      if (key.startsWith('protocol') || key === 'commands') {
        this.apiData.output[key].forEach(item => {
          apis[item.name] = item;
        });
      }
    });

    mkdirp.sync(path.join(this.outputFolder, 'api'));
    mkdirp.sync(path.join(this.outputFolder, 'api', 'appium'));
    const headerTemplateData = await Utils.readFile(ApiPage.headerTemplateFile);

    // content['_sections_'].api = ejs.render(content['_sections_'].api, {
    //   api: this.apiData.output,
    //   methods: this.apiData.methods,
    //   content
    // });

    // const keys = Object.keys(apis);
    let templateData = await Utils.readFile(ApiPage.apiMethodPageTemplateFile);

    //
    // return this.writeApiMethod({
    //   templateData,
    //   headerTemplateData,
    //   fileData: apis[keys[0]],
    //   fileName: keys[0],
    //   content
    // })

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
    const mdFileName = `${path.join(this.mdApiOutputFolder, fileName)}.md`;
    let subPageName = `${fileData.name}.html`;

    if (fileData.api === 'protocol.appium') {
      fileName = path.join('appium', fileName);
      subPageName = `appium/${fileData.name}.html`;
    }

    const outputFileName = `${path.join(this.outputFolder, 'api', fileName)}.html`;

    let methodData = swig.renderFile(ApiPage.apiMethodPage, {
      method: fileData
    });

    methodData = marked(methodData);
    const pageTitle = `${fileData.name} | API Reference | Nightwatch.js`;
    const title = `${fileData.name} | API Reference`;
    const pageDescription = `API Reference for command: ${fileData.name}`

    content['_includes_'].navbar = ejs.render(content['_includes_'].navbar, {
      version : this.nightwatchVersion,
      baseUrl : this.baseUrl,
      section:'api',
      title,
      pageDescription
    });

    content['_includes_'].header = ejs.render(headerTemplateData, {
      version: this.nightwatchVersion,
      baseUrl: this.baseUrl,
      pageTitle,
      pageImage: '/img/banners/nightwatch.jpg',
      section: 'apimethod',
      title,
      pageDescription
    });

    const rendered = ejs.render(templateData, {
      api: this.apiData.output,
      pageContent: methodData,
      content,
      subPageName,
      version: this.nightwatchVersion,
      baseUrl: this.baseUrl,
      apidocs: this.apiData.output
    });

    return Utils.writeFile(outputFileName, rendered);
  }

};
