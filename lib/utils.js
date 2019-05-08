const fs = require('fs');

const contains = (str, text) => {
  if (Array.isArray(text)) {
    for (let i = 0; i < text.length; i += 1) {
      if (contains(str, text[i])) {
        return true;
      }
    }
  }

  return str.includes(text);
};

module.exports = class Utils {
  static isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  static isFunction(fn) {
    return typeof fn === 'function';
  }

  static isBoolean(value) {
    return typeof value === 'boolean';
  }

  static isNumber(value) {
    return typeof value === 'number';
  }

  static isString(value) {
    return typeof value === 'string';
  }

  static isUndefined(value) {
    return typeof value === 'undefined';
  }

  static convertBoolean(value) {
    if (Utils.isString(value) && (!value || value === 'false' || value === '0')) {
      return false;
    }

    return Boolean(value);
  }

  static readDir(source) {
    return new Promise(function(resolve, reject) {
      fs.readdir(source, function(err, list) {
        if (err) {
          return reject(err);
        }

        resolve(list);
      });
    });
  }

  static isFolder(path) {
    return Utils.checkPath(path)
      .then(function(stats) {
        return stats.isDirectory();
      });
  }

  static readFileSync(file) {
    return fs.readFileSync(file).toString();
  }

  static readFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, function (error, data) {
        if (error) {
          const err = new Error(`Error while reading file ${file}: ${error.message}.`);
          err.path = error.path;
          err.code = error.code;
          err.syscall = error.syscall;
          reject(err);
          return;
        }

        resolve(data.toString());
      });
    });
  }

  static checkPath(source, originalErr = null) {
    return new Promise(function(resolve, reject) {
      fs.stat(source, function(err, stat) {
        if (err) {
          return reject(err.code === 'ENOENT' && originalErr || err);
        }

        resolve(stat);
      });
    });
  }

  static writeFile(filePath, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, 'utf8', function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  static createDeferred() {
    const deferred = {
      resolve: null,
      reject: null,
      promise: null,
    };

    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    return deferred;
  }

};
