const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const Utils = require('./utils.js');

module.exports = class ApiDocs {
  static get outputFileName() {
    return 'js/app/api/output.json';
  }

  constructor({config}) {
    this.outputFile = path.join(config.OUTPUT_FOLDER, ApiDocs.outputFileName);
    this.apiRepoUrl = config.apiRepoUrl;
    this.libPath = config.NIGHTWATCH_LIB_PATH;
    this.apiFileList = config.apiFileList.slice(0);
    this.methods = {};
  }

  writeToFile() {
    fs.writeFile(this.outputFile, JSON.stringify(this.methods, null, 2), () => {
      console.log('Done. wrote output:', this.outputFile);
    });
  }

  async createDocFile() {
    const entry = this.apiFileList.shift();
    const filePath = entry[0];
    const fullPath = this.libPath + filePath;
    const section = entry[1];

    let promises;
    const isFolder = await Utils.isFolder(fullPath);
    if (isFolder) {
      const files = await Utils.readDir(fullPath);
      promises = files.reduce((prev, fileName) => {
        if (!fileName.startsWith('_')) {
          prev.push(this.loadFile(path.join(fullPath, fileName), section));
        }

        return prev;
      }, []);
    } else {
      promises = [this.loadFile(fullPath, section)];
    }

    await Promise.all(promises);

    if (this.apiFileList.length) {
      await this.createDocFile();

      return;
    }

    this.writeToFile();
  }

  loadFile(sourcePath, section) {
    let fileLink = sourcePath.substring(sourcePath.indexOf('/lib/api/'));

    return new Promise((resolve, reject) => {
      exec('dox < ' + sourcePath, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(error || stderr);
        }

        const jsondata = JSON.parse(stdout);
        this.parseDocFile({jsondata, section, fileLink});
        //this.sortApiMethods(section);
        console.log('dox finished', sourcePath);

        resolve();
      });
    });
  }

  parseDocFile({jsondata, section, fileLink}) {
    jsondata.forEach((item) => {
      if (item.ignore) {
        return;
      }

      let name = item.ctx && item.ctx.name || '';
      let api;
      let aliases = [];
      let apiname = null;
      let params = [];
      let link = '';
      let linkDisplay = '';
      let descr = '';
      let example = '';
      let see = null;
      let since = null;
      let syntax = [];
      let returns = null;
      let editLineNumber = '';
      let internal = false;
      let editLink = `${this.apiRepoUrl}edit/master${fileLink}?message=api-docs%3A%20update%20`;

      item.tags.forEach((tag) => {
        if (tag.type === 'method') {
          name = tag.string;
        } else if (tag.type === 'link') {
          linkDisplay = tag.string;
          link = linkDisplay.replace(/\/+/g, '').replace(/:/g,'').toLowerCase();
        } else if (tag.type === 'param') {
          let paramName = tag.name;
          let optional = false;

          if (/\[(.+?)\]/.test(paramName)) {
            optional = true;
            let matches = paramName.match(/\[(.+)\]/);
            paramName = matches[1];
          }

          params.push({
            name : paramName,
            types : tag.types.join('|'),
            descr : tag.description,
            optional : optional
          });
        } else if (tag.type === 'api') {
          api = tag.visibility;
        } else if (tag.type === 'editline') {
          editLineNumber = tag.editline;
        } else if (tag.type === 'alias') {
          aliases.push(tag.string);
        } else if (tag.type === 'display') {
          apiname = tag.string;
        } else if (tag.type === 'syntax') {
          syntax.push(tag.string);
        } else if (tag.type === 'see') {
          see = tag.visibility;
        } else if (tag.type === 'returns') {
          let content = tag.string;
          let parts = content.split(/{(.+)}/);
          returns = {};

          if (parts.length > 1) {
            returns.type = parts[1];
            returns.descr = parts[2] || '';
          }
        } else if (tag.type === 'since') {
          since = tag.string;
        } else if (tag.type === 'internal') {
          internal = true;
        } else if (tag.type === 'example') {
          example = tag.string;
        }
      });

      if (item.description) {
        descr = item.description.full;
      }

      if (name) {
        editLink += `${name}#${editLineNumber}`;
        let inputData = {
          name,
          params,
          link,
          linkDisplay,
          api,
          descr,
          example,
          returns,
          since,
          see,
          aliases,
          editLink,
          internal,
          display: apiname,
          syntax: syntax.join('\n')
        };

        let key = section;
        if (api && api !== section) {
          key = api;
        }

        this.methods[key] = this.methods[key] || [];
        this.methods[key].push(inputData);
      }
    });
  }

  sortApiMethods(section) {
    if (this.methods[section]) {
      this.methods[section] = this.methods[section].sort(function(a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
    }
  }
};
