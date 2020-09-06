const fs = require('fs');
const path = require('path');

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

const aDay = 24 * 60 * 60 * 1000;
const timeFormats = [
  [60, 'seconds'], // 60
  [120, '1 minute ago'], // 60*2
  [3600, 'minutes', 60], // 60*60, 60
  [7200, '1 hour ago'], // 60*60*2
  [86400, 'hours', 3600], // 60*60*24, 60*60
  [172800, 'Yesterday']
];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];

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

  static isFolder(source) {
    return Utils.checkPath(source, null, false).then(stats => stats.isDirectory());
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

  static isFileNameValid(fileName) {
    return path.extname(fileName) === '.md';
  }

  static checkPath(source, originalErr = null, followSymlinks = true) {
    return new Promise(function(resolve, reject) {
      fs[followSymlinks ? 'stat' : 'lstat'](source, function(err, stats) {
        if (err) {
          return reject(err.code === 'ENOENT' && originalErr || err);
        }

        resolve(stats);
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

  static checkNamespace(pathFolder, namespace, resource) {
    const endPathName = resource ? [...namespace, resource].join(path.sep) : namespace.join(path.sep);

    if ((namespace.length > 0) && !pathFolder.endsWith(endPathName)) {
      // check if subfolder
      namespace.pop();
    }

    if ((namespace.length > 0) && !pathFolder.endsWith(endPathName)) {
      Utils.checkNamespace(pathFolder, namespace, resource);
    }
  }

  /**
   *
   * @param {string} sourcePath
   * @param {Array} namespace
   * @param {function} loadFn
   */
  static readFolderRecursively(sourcePath, namespace = [], loadFn) {
    const resources = fs.readdirSync(sourcePath);

    resources.forEach(resource => {
      const isFolder = fs.lstatSync(path.join(sourcePath, resource)).isDirectory();

      if (isFolder) {
        const pathFolder = path.join(sourcePath, resource);
        //let ns = namespace.slice(0);

        Utils.checkNamespace(pathFolder, namespace, resource);

        namespace.push(resource);

        Utils.readFolderRecursively(pathFolder, namespace, loadFn);

        return;
      }

      if (Utils.isFileNameValid(resource)) {
        Utils.checkNamespace(sourcePath, namespace);
        loadFn(sourcePath, resource, namespace);
      }
    });
  }

  static timeAgo(time) {

    const d = new Date(time);

    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();;

    if (new Date() - d > aDay) {
      return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    let seconds = (+new Date() - d.getTime()) / 1000;
    if (seconds === 0) {
      return 'Just now'
    }

    for (let i = 0; i < timeFormats.length; i++) {
      const format = timeFormats[i];

      if (seconds < format[0]) {
        if (!format[2]) {
          return format[1] + ' ago';
        }

        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ago';
      }
    }

    return time;
  }
};
