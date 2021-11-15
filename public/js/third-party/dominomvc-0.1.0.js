/**
 * dominomvc - v0.1.0 - 2014-01-17
 * http://dominomvc.org
 *
 * Copyright (c) 2014 Andrei Rusu
 * Licensed MIT <https://raw.github.com/beatfactor/dominomvc/master/LICENSE>
 */
(function(window, document, undefined) {
  'use strict';
  window.domino = window.domino || {util:{}};
  if (window._) {
    for (var prop in _) {
      domino.util[prop] = _[prop];
    }
  };

  domino.App = function(options) {
    // TODO: validate options
    this.options = options;
    this.bootstrap = new domino.bootstrap(this.options);
  };

  domino.App.prototype.init = function() {
    this.bootstrap.render();
  };

})(window, document);


(function() {

  // long stack traces
  var hasStacks = false;
  try {
    throw new Error();
  } catch (e) {
    hasStacks = !!e.stack;
  }

  var STACK_JUMP_SEPARATOR = "From previous event:";
  function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
      promise.stack &&
      typeof error === "object" &&
      error !== null &&
      error.stack &&
      error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
      var stacks = [];
      for (var p = promise; !!p && handlers.get(p); p = handlers.get(p).became) {
        if (p.stack) {
          stacks.unshift(p.stack);
        }
      }
      stacks.unshift(error.stack);

      var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
      error.stack = filterStackString(concatedStacks);
    }
  }

  function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i];

      if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
        desiredLines.push(line);
      }
    }
    return desiredLines.join("\n");
  }

  function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
  }

  function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
      return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
      return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
      return [attempt3[1], Number(attempt3[2])];
    }
  }

  function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
      return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
      lineNumber >= qStartingLine &&
      lineNumber <= qEndingLine;
  }

  // discover own file name and line number range for filtering stack
  // traces
  function captureLine() {
    if (!hasStacks) {
      return;
    }

    try {
      throw new Error();
    } catch (e) {
      var lines = e.stack.split("\n");
      var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
      var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
      if (!fileNameAndLineNumber) {
        return;
      }

      qFileName = fileNameAndLineNumber[0];
      return fileNameAndLineNumber[1];
    }
  }

  function deprecate(callback, name, alternative) {
    return function () {
      if (
          typeof console !== "undefined" &&
          typeof console.warn === "function"
      ) {

      }
      return callback.apply(this, arguments);
    };
  }

  var qStartingLine = captureLine();
  var qFileName;
  // end of long stack traces


})();

domino.util.string = {
  _prepare_str_cache: {},
  capitalize: function(s) {
    s = s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
    return s;
  },

  contains : function(s, text) {
    return s.indexOf(text) >= 0;
  },

  startsWith : function(s, text) {
    return s.indexOf(text) === 0;
  },

  trim : function(s) {
    return jQuery.trim(s);
  },

  prepareStr : function(s) {
    s = s.toLowerCase();
    // turn dashes into camel case
    if (this.contains(s, '-') || this.contains(s, '_')) {
      if (this._prepare_str_cache[s]) {
        s =  this._prepare_str_cache[s];
      } else {
        s = this._prepare_str_cache[s] = domino.util.map(s.split(/-|_/), function(el, index) {
          if (index == 0) {
            return el;
          }
          return this.capitalize(el);
        }, this).join('');
      }
    }

    return s;
  },

  hashCode : function(str) {
    var hash = 0, i, character;
    if (str.length == 0) {
      return hash;
    }
    for (i = 0, l = str.length; i < l; i++) {
      character = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + character;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  },

  decodeQueryString : function(str) {
    var
      decode = decodeURIComponent,
      params = {},
      parts  = str.split('&'),
      i,
      pair,
      key,
      value;

    for (i=0; i<parts.length; i++) {
      pair = parts[i].split('=');

      if (pair && pair.length) {
        key = pair.shift();
        value = pair.join('=');
      }

      if (pair && key) {
        params[decode(key)] = decode(value);
      }
    }

    return params;
  }
};

domino.util.diff = function(main, second) {
  var diff = {};
  domino.util.each(second, function(item, key) {
    if (!(key in main) || second[key] != main[key]) {
      diff[key] = second[key];
    }
  });

  return diff;
};

domino.util.deepClone = function(obj) {
  if (!domino.util.isObject(obj) || domino.util.isFunction(obj)) {
    return obj;
  }

  if (domino.util.isDate(obj)) {
    return new Date(obj.getTime());
  }
  if (domino.util.isRegExp(obj)) {
    return new RegExp(obj.source, obj.toString().replace(/.*\//, ""));
  }

  var isArr = (domino.util.isArray(obj) || domino.util.isArguments(obj));
  var func = function (memo, value, key) {
    if (isArr) {
      memo.push(domino.util.deepClone(value));
    } else {
      memo[key] = domino.util.deepClone(value);
    }
    return memo;
  };

  return domino.util.reduce(obj, func, isArr ? [] : {});
};

domino.util.inArray = function(arr, item) {
  return domino.util.indexOf(arr, item) > -1;
};

domino.util.array = {
  /**
   *
   * @param {Array} arr
   * @param [* mixed] item ...
   */
  remove : function(arr, item) {
    var i = domino.util.indexOf(arr, item);
    var rv = i;
    if (rv >= 0) {
      arr.splice(i, 1);
    }
    return rv;
  }
};


domino.util.construct = function construct(constructor, args) {
  function F() {
    var self = this;
    var argss = domino.util.map(args, function(element, index) {
      return element.initModel(self);
    });

    return constructor.apply(this, argss);
  }
  F.prototype = constructor.prototype;
  return new F();
};

domino.util.inherits = function(receiver, source) {
  if (!source) {
    throw 'Invalid source specified';
  }

  var sourceproto = source.prototype, receiverproto = {};
    // copy any existing methods on the receiver prototype to the same copy
  for (var prop in receiver.prototype) {
    receiverproto[prop] = receiver.prototype[prop];
  }

  // create a copy of the source prototype
  // for (var prop in sourceproto) {
    // receiverproto[prop] = sourceproto[prop];
  // }

  // assign the copy to the prototype of the receiver
  //receiver.prototype = receiverproto;

  // assign a link to the superclass
  //receiver.prototype.superclass = sourceproto;

  var F = function() {};
  F.prototype = sourceproto;
  receiver.prototype = new F();
  for (var prop in receiverproto) {
    receiver.prototype[prop] = receiverproto[prop];
  }
  // assign the copy to the prototype of the receiver
  receiver.prototype.constructor = receiver;

   // assign links to the superclass and constructor
  receiver.prototype.superclass = sourceproto;



  // receiverproto.constructor = receiver;
//
  // receiver.superclass = sourceproto;

  // assign constructor property
  if (typeof source != "object" && sourceproto.constructor == Object.prototype.constructor) {
    sourceproto.constructor = source;
  }

  return receiver;
};

domino.util.extend = function extend(receiver, source) {
  if (!source) {
    throw 'Invalid source specified';
  }

  var sourceproto = source.prototype, receiverproto = {};
  // create a copy of the source prototype
  var F = function() {};
  F.prototype = sourceproto;
  receiver.prototype = new F();

  // assign the copy to the prototype of the receiver
  receiver.prototype.constructor = receiver;

  // assign links to the superclass and constructor
  receiver.prototype.superclass = sourceproto;

  receiver.prototype.super = function $super() {
    function getsuper() {
        var s = this.superclass;
        if ($super.caller === this.constructor) {
            return this.superclass;
        }

        while ($super.caller !== s.constructor && s.superclass) {
            s = s.superclass;
            }

        return s.superclass;
    }
    var s = getsuper.call(this);
    return s.constructor.call(this);
  };
  //receiver.superclass = sourceproto;

  // assign constructor property
  if (typeof source != "object" && sourceproto.constructor == Object.prototype.constructor) {
    sourceproto.constructor = source;
  }

  return receiver;
};

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {
  var isArray = domino.util.isArray;

  function EventEmitter() {
    this._events = null;
  }
  domino.util.EventEmitter = EventEmitter;

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  var defaultMaxListeners = 10;
  EventEmitter.prototype.setMaxListeners = function(n) {
    if (!this._events) {
      this._events = {};
    }
    this._maxListeners = n;
  };


  EventEmitter.prototype.emit = function() {
    var type = arguments[0];
    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      if (!this._events || !this._events.error ||
          (isArray(this._events.error) && !this._events.error.length))
      {
        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    if (!this._events) {
      return false;
    }
    var handler = this._events[type];
    if (!handler) {
      return false;
    }
    handler.firingStart = true;
    handler.fired = false;
    handler.deferred = null;

    var l = arguments.length;
    var args = handler.args = new Array(l - 1);
    for (var i = 1; i < l; i++) {
      handler.args[i - 1] = args[i - 1] = arguments[i];
    }

    if (handler.listeners.length == 1 && typeof handler.listeners[0] == 'function') {
      var handlerFn = handler.listeners[0];
      switch (arguments.length) {
        // fast cases
        case 1:
          handlerFn.call(this);
          break;
        case 2:
          handlerFn.call(this, arguments[1]);
          break;
        case 3:
          handlerFn.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          handlerFn.apply(this, args);
      }
    } else {
      var listeners = handler.listeners.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
    }

    handler.firingStart = false;
    handler.fired = true;
    handler.emitter = this;
    handler.count++;
    return this;
  };

  function Promise(type) {
    this.type = type;
    this.firingStart = false;
    this.fired = false;
    this.count = 0;
    this.args = null;
    this.deferred = null;
    this.listeners = [];
  };

  Promise.prototype = {
    addListener : function(listener, cacheresult) {
      this.listeners.push(listener);
      if (!cacheresult) {
        return this;
      }
      if (!this.firingStart && this.fired && !this.deferred) {
        var self = this;
        var args = [self.type].concat(self.args);

        this.deferred = window.setTimeout(function() {
          self.emitter.emit.apply(self.emitter, args);
        }, 0);
      }
    }
  };

  // EventEmitter is defined in src/node_events.cc
  // EventEmitter.prototype.emit() is also defined there.
  EventEmitter.prototype.addListener = function(type, listener, cacheresult) {
    if ('function' !== typeof listener) {
      throw new Error('addListener only takes instances of Function');
    }

    if (!this._events) {
      this._events = {};
    }

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);
    if (!this._events[type]) {
      this._events[type] = new Promise(type);
    }
    this._events[type].addListener(listener, cacheresult);
    /*
    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    } else if (isArray(this._events[type])) {

      // If we've already got an array, just append.
      this._events[type].push(listener);

    } else {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];

    }
    */
    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._maxListeners !== undefined) {
        m = this._maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;

      }
    }

    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function(type, listener, cacheresult) {
    if ('function' !== typeof listener) {
      throw new Error('.once only takes instances of Function');
    }

    var self = this;
    function g() {
      self.removeListener(type, g);
      listener.apply(this, arguments);
    };

    g.listener = listener;

    self.on(type, g, cacheresult);

    return this;
  };

  EventEmitter.prototype.removeListener = function(type, listener) {
    if ('function' !== typeof listener) {
      throw new Error('removeListener only takes instances of Function');
    }

    // does not use listeners(), so no side effect of creating _events[type]
    if (!this._events || !this._events[type]) {
      return this;
    }

    var list = this._events[type].listeners;
    if (isArray(list)) {
      var position = -1;
      for (var i = 0, length = list.length; i < length; i++) {
        if (list[i] === listener ||
            (list[i].listener && list[i].listener === listener))
        {
          position = i;
          break;
        }
      }

      if (position < 0) {
        return this;
      }

      list.splice(position, 1);

      if (list.length == 0) {
        //delete this._events[type];
      }

    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      this._events = {};
      return this;
    }

    // does not use listeners(), so no side effect of creating _events[type]
    if (type && this._events && this._events[type]) {
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if (!this._events) {
      this._events = {};
    }
    return this._events[type];
  };

})();

(function(window, document, undefined) {
  ////////////////////////////////////////////////////////////////////////
  // MODELS
  ////////////////////////////////////////////////////////////////////////
  function DepedencyTracker() {
    this.superclass.constructor.call(this);
  };

  domino.util.inherits(DepedencyTracker, domino.util.EventEmitter);

  /**
   * BaseTransportAdapter
   */
  function BaseTransportAdapter() {};
  BaseTransportAdapter.prototype = {
    success : function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift('success');
      this.emit.apply(this, args);
      return this;
    },

    complete : function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift('complete');
      this.emit.apply(this, args);
      return this;
    },

    error : function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift('error');
      this.emit.apply(this, args);
      return this;
    },

    cached : function() {
      return null;
    }
  };

  domino.util.inherits(BaseTransportAdapter, domino.util.EventEmitter);

  /**
   * jQuery HTTP Adapter
   */
  function jqHttpAdapter(model, method) {
    this.superclass.superclass.constructor.call(this);
    this.superclass.constructor.call(this);
    this.defaults = model.defaults || {};
    this.url = model.url || '/';
    this.dataType = model.dataType || 'json';
    this.headers = {};
    this.statusCode = {};
    this._method = method;
    this.context = model;
  };

  jqHttpAdapter.prototype = {
    _methods_list : ['post', 'get', 'head', 'delete', 'options', 'put'],
    _jsonDataType : function() {
      return this.dataType == 'json';
    },

    getStoreKey : function(data) {
      try {
        var params = decodeURIComponent($.param(data));
        if (params) {
          params += '|';
        }
        return this._method._id + params;
      } catch (err) {
        throw new Error('Constructing the request failed. Check paramters', err);
      }
    },

    getArgs : function() {
      var params = this._method.getArgs() || [];
      var defaults = this._method.defaults;
      var model_defaults = this.context.defaults;
      var data = {};

      $.extend(data, model_defaults);
      $.extend(data, defaults);

      if (params.length > 0) {
        params = params[0];
        if (domino.util.isObject(params)) {
          for (var prop in params) {
            if (params[prop] instanceof Resolver) {
              params[prop] = params[prop].resolve();
            }
          }
          $.extend(data, params);
        } else {
          data[params] = '';
        }
      }

      return data;
    },

    send : function(params, http_method) {
      var request = this._method;
      request.loading = true;
      var data = this.getArgs(params);
      var reqOpts = {
        url : this.url,
        type : http_method || 'GET',
        data : data,
        context : this.context,
        headers : this.headers,
        statusCode : this.statusCode,
        cache : request.cacheresult
      };
      if (this._method.dataType) {
        reqOpts.dataType = this._method.dataType;
      }
      var req = $.ajax(reqOpts);

      var self = this;
      req.done(function(response, status, jqxhr) {
        // TODO: pass other XHR related paramters to the result
        if (request.cacheresult) {
          request.data = request.data || {};
          var storekey = self.getStoreKey(data);
          request.data[storekey] = response;
        }

        var store = domino.util.deepClone(response);
        if (domino.util.isFunction(request.done)) {
          store = request.done(store);
        }

        store = request.__runDoneFilters(store);

        request.ready = true;
        request.jqxhr = jqxhr;
        request.__call(store);
        request.emit('result', store);
      })
      .fail(function(jqxhr, textstatus, error) {
        request.error = true;
        request.jqxhr = jqxhr;

        var data = jqxhr.responseText;
        if (self._jsonDataType() && jqxhr.responseText) {
          try {
            data = jQuery.parseJSON(data);
          } catch (ex) {}
        }
        request.emit('error', data, error, textstatus);
      })
      .always(function() {
        request.loading = false;
        request._reload = false;
        self.complete();
      });
      return req;
    }
  };

  var proto = jqHttpAdapter.prototype;
  for (var i = 0; i < proto._methods_list.length; i++) {
    (function(index) {
      var httpmethod = proto._methods_list[index];
      proto[httpmethod] = function(params) {
        params = params || {};
        return this.send(params, httpmethod);
      };
    })(i);
  }
  domino.util.inherits(jqHttpAdapter, BaseTransportAdapter);

  function BaseMethod(model) {
    this._id = null;
    this.__args = [];
    this.__callbacks = [];
    this.__filtersDone = [];
    this.__adapter = null;
    this._reload = false;
    this.ready = false;
    this.loading = false;
    this.error = false;
    this.model = model;
    this.superclass.superclass.constructor.call(this);
  };

  BaseMethod.prototype = {
    args : function() {
      if (arguments.length == 0) {
        return this.__args;
      }
      var args = Array.prototype.slice.call(arguments);
      for (var i = 0; i < args.length; i++) {
        if (domino.util.isFunction(args[i])) {
          args[i] = domino.util.bind(args[i], this);
        }
      }

      if (args.length == 1) {
        this.__args.push(args[0]);
        return this;
      }

      Array.prototype.push.apply(this.__args, args);
      return this;
    },

    getStoreKey : function(data) {
      var storekey = [];
      domino.util.each(data, function(value) {
        if (typeof value == 'string' || typeof value == 'number') {
          storekey.push(value);
        }
      });

      if (storekey.length == 0) {
        return this._id;
      }
      return this._id + '|' + storekey.join('###');
    },

    refresh : function() {
      this._reload = true;
      return this.execute();
    },

    doneFilter : function(callback) {
      var controller = domino.controllers.getCurrent();
      var cb = function doneFilterCb() {
        return domino.controllers.wrapAction(controller.instance, callback, arguments);
      };

      this.__filtersDone.push(cb);
      return this;
    },

    __call : function() {
      var args = Array.prototype.slice.call(arguments, 0);
      var callback;

      while (this.__callbacks.length) {
        callback = this.__callbacks.shift();
        callback.apply(null, args);
      }

      return this;
    },

    __runDoneFilters : function(data) {
      if (this.__filtersDone.length > 0) {
        var filtered = data;
        while (this.__filtersDone.length) {
          var fn = this.__filtersDone.shift();
          var result = fn(filtered);
          if (!domino.util.isUndefined(result)) {
            filtered = result;
          }
        }

        return filtered;
      }
      return data;
    },

    result : function(callback) {
      var controller = domino.controllers.getCurrent();
      var cb = function resultCallback() {
        return domino.controllers.wrapAction(controller.instance, callback, arguments);
      };
      /*
      if (this.ready && !this.loading && this.data) {
        var data = domino.util.clone(this.data);

        if (this.done) {
          data = this.done(data);
        }
        cb(data);
        return this;
      }
      */
      this.__callbacks.push(cb);
      return this;
    },

    getArgs : function() {
      return this.__args;
    },

    execute : function execute() {
      var adapter = this.model.initAdapter(this);
      var passed_args = Array.prototype.slice.call(arguments, 0);

      // overwrite any previously declared arguments with .args()

      if (!this.method) {
        throw new Error('Request method was not defined!');
      }

      if (this.loading && !this.ready) {
        return this;
      }

      var self = this;
      if (this.model.__dependencies.length > 0) {
        var dependency_parts = this.model.__dependencies.shift();
        this.model.runDependency(dependency_parts[0], dependency_parts[1], dependency_parts[2]).once('result', function() {
          var methodInstance = arguments[0];

          execute.apply(self, passed_args);
        });
        return this;
      }

      for (var i = 0; i < passed_args.length; i++) {
        if (passed_args[i] instanceof Resolver) {
          this.__args[i] = passed_args[i].resolve();
        } else {
          this.__args[i] = passed_args[i];
        }
      }

      var dataArgs = domino.util.isFunction(adapter.getArgs) ? adapter.getArgs() : this.getArgs();
      var storekey = domino.util.isFunction(adapter.getStoreKey) ? adapter.getStoreKey(dataArgs) : this.getStoreKey(dataArgs);
      var datastore = this.data && storekey && this.data[storekey];



      if (!this.loading && this.ready && datastore && !this._reload) {
        var data = domino.util.clone(datastore);
        window.setTimeout(function() {
          if (self.done) {
            data = self.done(data);
          }
          data = self.__runDoneFilters(data);
          self.__call(data);
          self.emit('result', data);
        }, 0);

        return this;
      } else {

      }

      adapter[this.method].apply(adapter, this.__args);
      this.__adapter = adapter;
      return this;
    }
  };

  BaseMethod.extend = function(spec, model) {
    var instance = function(m) {
      this.superclass.constructor.call(this, m);
      spec.call(this);
    };
    domino.util.inherits(instance, BaseMethod);
    domino.util.inherits(spec, instance);
    return new instance(model);
  };

  domino.util.inherits(BaseMethod, domino.util.EventEmitter);

  /**
   * Abstract model class
   */
  function BaseModel() {
    /**
     * @override
     */
    this.callbacks = {
      result : []
    };
    this.__store = {};
    this.__methods = {};
    this.__custom_adapters = {};
    this.__bindings = null;
    this.__dependencies = [];
    this.current_method = null;
    this.adapter = null;
    this.setAdapterType();
  };

  BaseModel.defaultAdapterType = 'jqHTTP';
  BaseModel.prototype = {
    // TODO: validation
    depends : function afterDependecy(dependency) {
      var definition, args = null;

      if (domino.util.isArray(dependency) && dependency.length > 0) {
        definition = dependency.shift();
      } else {
        definition = dependency;
      }

      if (definition && domino.util.isArray(definition) && definition.length > 1) {
        args = definition.slice(1);
        definition = definition[0];
      }

      var parts  = definition.split('.');
      var model  = parts[0];
      var method = parts[1] || 'init';
      this.__dependencies.push([model, method, args]);
      return this;
    },

    runDependency : function(model, method, args) {
      var emitter = new DepedencyTracker();
      var self = this;

      if (model && method) {
        var controller = domino.controllers.getCurrent().instance;
        var m = controller.initModel(model);
        var instance = (args ? m[method].apply(m, args) : m[method]());

        instance.once('result', function() {
          var args = Array.prototype.slice.call(arguments, 0);

          args.unshift(this);
          args.unshift('result');

          emitter.emit.apply(emitter, args);
        }, instance.cacheresult);
      }
      return emitter;
    },

    setAdapterType : function() {
      this.adapter_type = this.adapter_type || BaseModel.defaultAdapterType;
      switch (this.adapter_type) {
        case 'custom':
          break;
        case 'jqHTTP':
          var self = this;
          var methods_list = jqHttpAdapter.prototype._methods_list;
          for (var i = 0; i < methods_list.length; i++) {
            (function(index) {
              var httpmethod = methods_list[index];
              self['$' + httpmethod] = function(spec) {
                return self.createMethod(spec, httpmethod);
              };
            })(i);
          }
          this.adapter = function adapterFactory(model, methodInstance) {
            return new jqHttpAdapter(model, methodInstance);
          };
          break;
        default:
          var custom_adapter = domino.models.getCustomAdapter(this.adapter_type);
          if (!custom_adapter) {
            throw new Error('Invalid adapter type specified: ' + this.adapter_type);
          }
          this.adapter = new custom_adapter(this);
      }
    },

    initAdapter : function(methodInstance) {
      var adapter = this.adapter;

      if (domino.util.isFunction(this.adapter)) {
        adapter = adapter(this, methodInstance);
      }
      return adapter;
    },

    method : function(method) {
      return this.__methods[method];
    },

    createMethod : function(spec, adapter_method) {
      var m = BaseMethod.extend(spec, this);
      if (!m._id) {
        throw new Error('The method needs an unique id. Please specify the ._id property.');
      }
      if (adapter_method) {
        m.method = adapter_method;
      }
      var self = this;
      m.cacheresult = domino.util.isUndefined(m.cacheresult) || m.cacheresult;
      this.__methods[m._id] = m;

      return function() {
        var method  = this.__methods[m._id];
        if (self.url && domino.util.isFunction(self.url)) {
          self.url = self.url.apply(self, arguments);
        }

        if (method._events && method._events['result']) {
          var handler = m._events['result'];
          handler.firingStart = true;
          handler.args = [];
          handler.fired = false;
          handler.deferred = null;
        }

        method.execute.apply(method, arguments);
        return method;
      };
    },

    set : function(data) {
      if (arguments.length == 2) {
        var key = arguments[0];
        var value = arguments[1];
        // TODO: improve this with implementing a propertyvalue factory
        this.__store[key] = value;
      } else if (arguments.length == 1 && typeof data == 'object') {
        for (var key in data) {
          this.set(key, data[key]);
        }
      }
      return this;
    },

    get : function(key) {
      return this.__store[key];
    },

    resolve : function(key) {
      return new Resolver(key, this);
    }
  };

  function Resolver(key, model) {
    this.key = key;
    this.model = model;
  };

  Resolver.prototype.resolve = function() {
    return this.model.get(this.key);
  };

  domino.models = new function() {
    var __models = {}, __current_model = null, __custom_adapters = {};

    this.provide = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (!domino.util.isString(args[0])) {
        throw new Error('first argument needs to be string!');
      }
      var name = args[0].toLowerCase();
      if (!domino.util.isFunction(args[1])) {
        throw new Error('second argument needs to be a function!');
      }
      var fn = args[1];

      if (__models[name]) {
        throw new Error('a model with the name "' + name + '" has already been defined!');
      }
      __models[name] = {fn: fn, started: false, instance: null, name: name};
    };

    /**
     * TODO: implement here custom adapters to inherit from Base
     */
    this.createAdapter = function(adapter) {
      function Instance() {
        this.superclass.constructor.call(this);

      };

      domino.util.inherits(Instance, BaseTransportAdapter);
    };

    this.run = function(model) {
      if (domino.util.isUndefined(__models[model])) {
        throw new Error('no model defined by this name: ' + model);
      }

      __current_model =  __models[model];
      var instance;
      if (__current_model.started) {
        instance = __current_model.instance;
      } else {
        var init = __current_model.fn;
        function Instance() {
          this.superclass.constructor.call(this);
          init.call(this);
        };
        domino.util.inherits(Instance, BaseModel);
        instance = __current_model.instance = new Instance();
        //
        if (__current_model._bindings && __current_model._bindings.length) {
          __current_model.instance.setupBindings(__current_model._bindings);
        }
        __current_model.started = true;
      }

      return __current_model.instance;
    };

    this.addAdapter = function(name, adapter) {
      if (__custom_adapters[name]) {
        throw new Error('An adapter with the name ' + name + ' has already been defined for this model.');
      }

      __custom_adapters[name] = createAdapter(adapter);
    };

    this.getCustomAdapter = function(name) {
      return __custom_adapters[name];
    };

    var createAdapter = this.createAdapter = function(adapter) {
      domino.util.inherits(adapter, BaseTransportAdapter);
      return adapter;
    };
  };

})(window, document);

(function(window, document, undefined) {
////////////////////////////////////////////////////////////////////////
// VIEW MANAGER
////////////////////////////////////////////////////////////////////////
domino.views = new function() {
  var __views = {},
      __views_cache = {},
      __controllers_map = {},
      __view_filters = {},
      __current_view,
      __views_base_path = '/';

  function BaseView() {
    this._currentView = null;
    this._currentAction = null;
    this.__events = null;
    this.__id = domino.util.uniqueId('_views_');
    __views_cache[this.__id] = {};
    this.$helper = {};
  };

  BaseView.prototype = {
    /**
     *
     * @param {String} newstate
     * @param {Object} data
     */
    changeState : function(newstate, data, opts) {
      domino.viewstates.change(newstate, data, opts);
      return this;
    },

    renderPartial : function(selector /*, [options], [callback] */) {
      var view_cache = __views_cache[this.__id];
      var renderer = view_cache && view_cache[this._currentView + '#' + this._currentAction];
      if (!renderer) {

        return null;
      }

      var controller = __controllers_map[this.__id];
      var self = this;
      var options = controller && controller._options[this._currentAction] || {};

      var view_options = renderer.options;
      view_options.partial = true;
      view_options.partial_options = {
        container : selector
      };
      var cbFn;
      if (domino.util.isObject(arguments[1])) {
        var opts = arguments[1];
        for (var prop in opts) {
          view_options.partial_options[prop] = opts[prop];
        }

        if (domino.util.isFunction(arguments[1])) {
          cbFn = arguments[1];
        }
      }

      if (domino.util.isFunction(arguments[2])) {
        cbFn = arguments[2];
      }

      if (cbFn) {
        view_options.partial_options.callback = cbFn;
      }

      if (controller) {
        domino.util.forEach(this.$scope, function(value, key, object) {
          controller.assign(key, value);
        });
      }


      this.render(this._currentView, this._currentAction, {}, controller);

      domino.controllers.wrapAction(controller, this._currentAction + 'Action', [options]);

      return this;
    },

    navigateTo : function(uri) {
      window.history.pushState("", "Title", uri);
      $(window).trigger('popstate');
    },

    initHelper : function(/* helper name, arg1, arg2 ... */) {
      var args = Array.prototype.slice.call(arguments, 0);
      if (args.length == 0) {
        throw new Error('view helper name needs to be specified!');
      }
      if (!domino.util.isString(args[0])) {
        throw new Error('view helper name needs to be string!');
      }
      var helper = args.shift();
      var instance = domino.viewhelpers.run(helper, this, args);
      this.$helper[helper] = instance;
      return instance;
    },

    getViewArgs : function() {
      var args = {};
      var self = this;

      if (__current_view._vars && __current_view._vars.length > 0) {
        domino.util.forEach(__current_view._vars, function(var_name) {
          args[var_name] = self[var_name];
        });
      }

      return args;
    },

    updateViewArgs : function(scope) {
      for (var prop in scope) {
        if (domino.util.indexOf(__current_view._vars, prop) == -1) {
          //__current_view._vars.push(prop);
          domino.views.assignVar(prop, scope[prop]);
        }
      }
    },

    handleViewScope : function(view, action, script_options, controller) {
      var view_scope = controller && controller.view;
      var self = this;

      if (view_scope) {
        if (view_scope.previous && domino.util.isEqual(view_scope.previous, view_scope['@datastore'])) {
          return;
        }

        for (var key in view_scope['@datastore']) {
          var value = view_scope['@datastore'][key];
          if (value instanceof domino.util.EventEmitter) {
            (function(emitter, itemkey) {
              emitter.once('result', function(result) {
                var action = domino.controllers.getCurrent().instance.currentAction;
                controller.assign(itemkey, result);
                self.render(view, action, script_options, controller);
                view_scope['@datastore'][itemkey] = result;
              });
            })(value, key);
            delete view_scope['@datastore'][key];
          } else {
            controller.assign(key, value);
          }
        }

        //controller.render(controller.currentAction);
        view_scope.previous = domino.util.clone(view_scope['@datastore']);
      }
    },

    getRenderer : function(view, action) {
      var renderer = __views_cache[this.__id][view + '#' + action];
      return renderer;
    },

    render : function(view, action, script_options, controllerInstance) {
      var view_args = this.getViewArgs();
      var renderer = this.getRenderer(view, action);




      __controllers_map[this.__id] = controllerInstance;

      if (renderer) {
        renderer.setOptions(script_options);
      } else {
        renderer = __views_cache[this.__id][view + '#' + action] = new domino.views.ViewRenderer(view, action, script_options, this);
      }
      view_args.self = this;
      if (renderer.options.partial) {
        renderer.renderPartial(renderer.options.partial_options, view_args);
      } else {
        renderer.renderViewScript(view_args, controllerInstance);
      }
      this._currentView = view;
      this._currentAction = action;
      return this;
    }
  };

  function ViewScope(controller, action) {
    this.controller = controller;
    this.action = controller && action && controller[action] || null;
    this.actionName = action;
    this.previous = null;
    this['@datastore'] = {};
  };

  ViewScope.prototype = {
    set : function(key, value) {
      this['@datastore'][key] = value;
      return this;
    },

    keys : function() {
      if (Object.hasOwnProperty('keys')) {
        return Object.keys(this['@datastore']);
      }
      var keys = [];
      for (var key in this['@datastore']) {
        keys.push(key);
      }
      return keys;
    },

    get : function(key) {
      return this['@datastore'][key];
    }
  };

  this.viewScope = ViewScope;

  this.define = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!domino.util.isString(args[0])) {
      throw new Error('first argument needs to be string!');
    }
    var name = args[0].toLowerCase();
    if (!domino.util.isFunction(args[1])) {
      throw new Error('second argument needs to be a function!');
    }
    var fn = args[1];

    if (__views[name]) {
      throw new Error('a view with the name "' + name + '" has already been defined!');
    }
    __views[name] = {fn: fn, started: false, instance: null, name: name};
  };

  this.has = function(name) {
    return !domino.util.isUndefined(__views[name]);
  };

  this.run = function(view_name, view_scope) {
    if (domino.util.isUndefined(__views[view_name])) {
      throw new Error('no view defined by this name: ' + view_name);
    }

    __current_view = __views[view_name];
    var instance;
    if (__current_view.started) {
      instance = __current_view.instance;
    } else {
      domino.util.inherits(__current_view.fn, BaseView);
      instance = __current_view.instance = new __current_view.fn(view_scope);
      instance.superclass.constructor.call(instance);

      domino.events.provide(view_name, instance);
      domino.events.run(view_name);

      __current_view.started = true;
    }

    return __current_view.instance;
  };

  this.assignVar = function(var_name, value) {
    if (domino.util.isUndefined(__current_view)) {
      return;
    }
    var is_update = false;
    if (__current_view._vars && domino.util.inArray(__current_view._vars, var_name)) {
      is_update = true;
    }

    if (!domino.util.isUndefined(__current_view.instance[var_name]) && !is_update) {
      throw new Error('Invalid variable name: ' + var_name + '. Please use a different one.');
    }

    __current_view.instance[var_name] = value;
    __current_view._vars = __current_view._vars || [];
    if (!is_update) {
      __current_view._vars.push(var_name);
    }

  };

  this.getCurrent = function() {
    return __current_view;
  };

  this.getFilter = function(filter) {
    return __view_filters[filter];
  };

  this.setFilter = function(filter, fn) {
    if (!__view_filters[filter]) {
      __view_filters[filter] = fn;
    }
    return swig.setFilter(filter, fn);
  };

  this.setCustomTag = function(definition) {
    if (!definition || !domino.util.isObject(definition)) {
      throw new Error('tag definition object missing!');
    }

    if (!domino.util.isString(definition.name)) {
      throw new Error('tag name must be defined.');
    }
    if (!domino.util.isFunction(definition.parse)) {
      throw new Error('parse method must be a function.');
    }
    if (!domino.util.isFunction(definition.compile)) {
      throw new Error('compile method must be a function.');
    }

    swig.setTag(definition.name, definition.parse, definition.compile, definition.ends || false, definition.blockLevel || false);
  };

  this.setBasePath = function(path) {
    __views_base_path = path;
    return this;
  };

  this.getBasePath = function(path) {
    return __views_base_path;
  };
};

////////////////////////////////////////////////////////////////////////
// VIEW HELPERS
////////////////////////////////////////////////////////////////////////
domino.viewhelpers = new function() {
  var __helpers = {};

  this.define = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!domino.util.isString(args[0])) {
      throw new Error('first argument needs to be string!');
    }
    var name = args[0].toLowerCase();
    if (!domino.util.isFunction(args[1])) {
      throw new Error('second argument needs to be a function!');
    }
    if (__helpers[name]) {
      throw new Error('a view helper with the name "' + name + '" has already been defined!');
    }
    var fn = args[1];
    var helperCallback = (function() {
      if (fn.hasOwnProperty('beforeInit')) {
        fn.beforeInit();
      }
      return fn;
    })();

    __helpers[name] = {fn: fn, started: false, instance: null, name: name};
  };

  this.run = function(viewhelper, view_instance, args) {
    if (domino.util.isUndefined(__helpers[viewhelper])) {
      throw new Error('no view helper defined by this name: ' + viewhelper);
    }

    var helper =  __helpers[viewhelper];
    var instance;
    if (helper.started) {
      instance = helper.instance;
    } else {
      helper.started = true;
      instance = helper.instance = new helper.fn(view_instance.$scope);
      instance.view = view_instance;
      if (domino.util.isFunction(instance.init)) {
        instance.init.apply(instance, args);
      }
    }

    return instance;
  };
};

////////////////////////////////////////////////////////////////////////
// CUSTOM TAGS
////////////////////////////////////////////////////////////////////////
domino.views.setCustomTag({
  name : 'include_partial',
  parse : function parse(str, line, parser, types, stack, opts) {
    var ignore = 'ignore',
        missing = 'missing',
        only = 'only';
    var file, w;
    parser.on(types.STRING, function (token) {
      if (!file) {
        file = token.match;
        this.out.push(file);
        return;
      }

      return true;
    });

    parser.on(types.VAR, function (token) {
      if (!file) {
        file = token.match;
        return true;
      }

      if (!w && token.match === 'with') {
        w = true;
        return;
      }

      if (w && token.match === only && this.prevToken.match !== 'with') {
        this.out.push(token.match);
        return;
      }

      if (token.match === ignore) {
        return false;
      }

      if (token.match === missing) {
        if (this.prevToken.match !== ignore) {
          throw new Error('Unexpected token "' + missing + '" on line ' + line + '.');
        }
        this.out.push(token.match);
        return false;
      }

      if (this.prevToken.match === ignore) {
        throw new Error('Expected "' + missing + '" on line ' + line + ' but found "' + token.match + '".');
      }

      return true;
    });

    parser.on('end', function () {
      this.out.push(opts.filename || null);
    });

    return true;
  },

  compile : function compile(compiler, args) {
    var file = args[0];
    var file_include = eval(file); // FIXME: eval
    var w = args.slice(1).join('');
    var ctx = '_utils.extend({}, _ctx, ' + w + ')';

    return '_output += \'<div data-include-partial="'+ file_include +'"></div>\';\n';
  }
});

domino.views.setCustomTag({
  name : 'initHelper',
  parse : function parse(str, line, parser, types, options) {
    var firstVar, ready;

    parser.on('*', function (token) {

      if (token.type === types.WHITESPACE) {
        return;
      }
      if (token.type === types.PARENOPEN) {
        return;
      }
      if (token.type === types.PARENCLOSE) {
        return;
      }
      if (token.type === types.COMMA) {
        return;
      }
      if (token.type === types.STRING) {
        this.out.push(this.filters.addslashes(token.match));
        return;
      }

      if (token.type === types.NUMBER) {
        this.out.push(token.match);
        return;
      }

      if (token.type === types.CURLYOPEN) {
        this.state.push(token.type);
        return;
      }
      if (token.type === types.CURLYCLOSE) {
        if (this.state.pop() !== types.CURLYOPEN) {
          throw new Error('Unexpected closing curly brace');
        }
        //this.out.push('{}');
        return;
      }
    });

    parser.on('end', function () {

    });

    return true;
  },

  compile : function compile(compiler, args, content, parents, options, blockName) {
    var helper = args[0];
    if (helper) {
      var argss = Array.prototype.slice.call(args, 1);
      return '_output += \'data-helper="' + helper.replace(/\\'/g, "") +'|'+ argss.join('|') +'"\';\n';
    }
  }
});
})(window, document);

(function(window, document, undefined) {
  function ViewRenderer(view, action, options, view_instance) {
    this.view = view;
    this.action = action;
    this.options = options || {};
    this.view_instance = view_instance;
    this.controller = null;
    this.view_content = {container: null, content: '', loading : false, promise: null, parsed : {}, partials: {}};
    this.eventbus = new domino.eventmanager.EventBus(this);
  };

  ViewRenderer.prototype = {
    parseTemplate : function(container, content) {
      var tpl = this.view_content.compiled(this.view_args);
      this.view_instance.updateViewArgs(this.view_args);
      container.innerHTML = tpl;
    },

    setOptions : function(opts) {
      //this.options.partial = false;
      //this.options.partial_options = null;

      for (prop in opts) {
        this.options[prop] = opts[prop];
      }
      return this;
    },

    getContainer : function() {
      return this.view_content.container && $(this.view_content.container);
    },

    getContent : function() {
      return this.view_content.container && this.view_content.container.content;
    },

    clear : function(view_args) {
      if (this.view_content.container) {
        var parentNode = this.view_content.container.parentNode;
        if (parentNode) {
          parentNode.removeChild(this.view_content.container);
        }
      }
    },

    renderViewScript : function(view_args, controller) {
      if (this.view_args && domino.util.isEqual(this.view_args, view_args)) {

        return this;
      }

      //this.clear(view_args);
      this.eventbus.setController(controller);
      this.view_args = view_args || {};

      var self = this;

      var needs_parse = domino.util.isUndefined(this.options.no_render) || !this.options.no_render;
      if (!needs_parse) {
        return this;
      }
      var view_template = this.options.$template && $(this.options.$template);
      var content = "";

      if (view_template && view_template.length > 0 && needs_parse) {
        // the template is located inside the DOM
        this.view_content.compiled = swig.compile(view_template.text());
        this.renderTemplate();
      } else if (this.view_content.compiled) {
        // re-render a cached template directly
        this.renderTemplate();
      } else {
        // Download the file and render the content
        this.downloadViewScript(function(content) {
          self.renderTemplate();
        });
      }

      return this;
    },

    downloadViewScript : function(doneCallback) {
      var self        = this;
      var path_path   = domino.views.getBasePath();
      var view_script = path_path + this.view + '/' + this.action + '.html';
      var cache_elem  = this.view_content;
      if (cache_elem.loading) {
        return cache_elem.promise;
      }
      cache_elem.promise = $.get(view_script).done(function(content) {
        self.view_content.compiled = swig.compile(content);
        cache_elem.content = content;
        cache_elem.loading = false;
        cache_elem.promise = null;
        doneCallback();
      }).fail(function() {
        self.view_content = null;
      });
      cache_elem.loading = true;
      return cache_elem.promise;
    },

    renderTemplate : function() {
      var $container = this.options.$container && $(this.options.$container);
      var is_cached = $container && $container.length > 0;
      var is_rendered = this.view_content.content != '';
      var element;

      // TODO: support other atributes
      /*if (this.options.$cacheresult && this.options.$id) {
        $container = document.getElementById(this.options.$id);
        if ($container) {
          is_cached = true;
          if (has_parent) {
            parent.children().not($container).hide();
          }
        }
      }*/

      //

      var tagName = this.options.$tagName || 'div';
      element = document.createElement(tagName);

      if (this.options.$className) {
        element.className = this.options.$className;
      }

      if (this.options.$id) {
        element.id = this.options.$id;
      }

      this.parseTemplate(element);
      this.parseCustomTags(element);

      if (is_cached) {
        $container.empty().append($(element).contents());
      } else {
        $container = $(element);
        if (this.options.$insertBefore) {
          $container.insertBefore($(this.options.$insertBefore));
        } else {
          document.body.appendChild(element);
        }
      }

      this.view_content.$container = $container[0];
      this.view_instance.$element = $container;

      //if (!is_rendered) {
        this.addEventHandlers($container[0]);
        this.executeViewHelpers($container[0]);
        this.parseViewBindings($container);
        this.parseIncludeTags($container);
      //}

      //container.show();

      if (domino.util.isFunction(this.options.render)) {
        this.options.render.call(this.view_instance, $container);
      }
    },

    renderPartial : function(options, args) {
      var $container = this.getContainer().find(options.container);
      var content = this.view_content.content;
      var partialContent = '';

      if (content) {
        var tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = content;
        var partialEl = $(tmpDiv).find(options.container);
        partialContent = partialEl.html();
      }

      if (!partialContent) {
        return;
      }

      var output  = swig.render(domino.util.unescape(partialContent), {locals : args});
      var replace = domino.util.isUndefined(options.replace) || options.replace;
      var append  = options.append;
      var preserve = options.preserve;

      var $element = $('<div></div>').append(output);
      if (preserve) {
        if (!domino.util.isArray(preserve)) {
          preserve = [preserve];
        }
        this.preserveNodes($element, preserve);
      }

      this.parseCustomTags($element[0]);

      output = $element.html();

      if (options.element) {
        $container = $(options.element);
        output = $element.find(options.element).html();
      }

      if (replace) {
        $container.empty().append(output);
      } else if (append) {
        $container.append(output);
      }

      this.updateEventHandlers($container);

      // TODO: test this
      this.parseViewBindings($container);
      this.parseIncludeTags($container);

      if (domino.util.isFunction(options.callback)) {
        options.callback.call(this.view_instance, $element, $container);
      }

      return this;
    },

    preserveNodes : function($element, preserve_def) {
      var PreserveMethod = {
        PREPEND : 'prepend',
        APPEND : 'append'
      };

      var PRESERVE_DEFAULT_METHOD = PreserveMethod.APPEND;

      for (var i = 0; i < preserve_def.length; i++) {
        var preserveEl = preserve_def[i].selector || preserve_def[i].element;
        if (!(preserveEl instanceof jQuery)) {
          preserveEl = $(preserveEl);
        }
        var preserveHtml = preserveEl.html();
        var preserveSelector = preserveEl.selector;
        if (preserveHtml && preserveSelector) {
          var method = preserve_def[i].method || PRESERVE_DEFAULT_METHOD;
          if (!domino.util.findWhere(PreserveMethod, method)) {
            throw new Error('Invalid preserve method: ' + method + '! Valid methods are: prepend | append');
          }

          $element.find(preserveSelector)[method](preserveHtml);
        }
      }
    },

    executeViewHelpers : function(container) {
      var self = this;

      $(container).find('[data-helper]').each(function() {
        var elem = $(this);
        var helper = elem.attr('data-helper');

        if (helper) {
          var parts = helper.split('|');
          parts.splice(1, 0, elem);

          var instance = self.view_instance.initHelper.apply(self.view_instance, parts);
          if (instance.render && domino.util.isFunction(instance.render)) {
            instance.render();
          }

          elem.removeAttr('data-helper');
        }
      });
    },

    updateViewBindings : function(scope) {
      var self = this;
      $(this.view_content.container).find('[data-bind]').each(function() {

        var binding = $.trim(this.getAttribute('data-bind'));
        var value = this.value || "";

        try {
          var parts = binding.split('|');
          var key = parts.shift();
          if (parts.length > 0 && value) {
            value = self.applyFilters(value, parts, this);
          }
          scope[key] = value;

        } catch (e) {

        }
      });
    },

    parseViewBindings : function($container) {
      var self = this;
      $container.find('[data-bind]').each(function() {

        var binding = $.trim(this.getAttribute('data-bind'));

        try {
          var parts = binding.split('|');
          var key = parts.shift();
          this.value = self.view_args[key] || this.value || "";

        } catch (e) {

        }
      });
    },

    applyFilters : function(value, filters_arr, element) {
      var filtered = value;
      while (filters_arr.length > 0) {
        var filter = filters_arr.shift();
        var fn = domino.views.getFilter(filter);
        if (fn) {
          filtered = fn.call(element, filtered);
        }
      }
      return filtered;
    },

    addEventListener : function(type, handlername, args) {
      this.eventbus.bind(type, handlername, args);
      return this;
    },

    addEventHandlers : function(container) {
      //
      var self = this;
      this.eventbus.setElement(container);

      $(container).find('[data-bind-event]').each(function() {
        var element = this;
        var elem = $(element);
        var eventdata = elem.attr('data-bind-event');

        if (eventdata) {

          var parts = eventdata.split('|');
          if (parts.length >= 2) {
            var eventtype = parts.shift();
            var handlername = parts.shift();
            parts.unshift(element);

            var isValidHandler = domino.util.isFunction(self.view_instance[handlername]);
            if (!isValidHandler) {
              throw new Error('No event handler defined by this name: ' + handlername);
            }
            elem.removeAttr('data-bind-event');
            self.addEventListener(eventtype, handlername, parts);
          }
        }
      });

      $(container).find('[data-bind-click]').each(function() {
        var element = this;
        var elem = $(element);
        var eventtype = 'click';
        var data = self.parseEventHandlerData(eventtype, elem);
        if (data && data.length == 2) {
          var handlername = data[0];
          var args = data[1];
          var isValidHandler = domino.util.isFunction(self.view_instance[handlername]);
          if (!isValidHandler) {
            throw new Error('No event handler defined by this name: ' + handlername);
          }
          elem.removeAttr('data-bind-click');
          self.addEventListener(eventtype, handlername, args);
        }
      });
    },

    parsePartialTemplate : function(compiled, element, is_last, callback) {
      var html = compiled(this.view_args);
      element.replaceWith(html);
      if (is_last && callback) {
        callback();
      }
    },

    parseIncludeTags : function($container) {
      //
      var includeTags = $container.find('[data-include-partial]');
      var includeTagsLen = includeTags.length;
      var self = this, renderCallback, renderFn;
      if (domino.util.isFunction(this.options.render) && includeTagsLen > 0) {
        renderFn = self.options.render;
        renderCallback = function() {
          renderFn.call(self.view_instance, $container);
        };

        this.options.render = function() {};
      }

      var includeTags = $container.find('[data-include-partial]');
      var includeTagsLen = includeTags.length;

      includeTags.each(function(index) {
        var element = this;
        var elem = $(element);
        var file_url = elem.attr('data-include-partial');

        if (file_url) {
          var isLast = index == includeTagsLen -1;
          var compiled = self.view_content.partials[file_url];
          if (domino.util.isFunction(compiled)) {
            self.parsePartialTemplate(compiled, elem, isLast, renderCallback);
          } else if (domino.util.isObject(compiled) && compiled.readyState && compiled.readyState != 4) {
            compiled.done(function() {
              var c = self.view_content.partials[file_url];
              self.parsePartialTemplate(c, elem, isLast, renderCallback);
            });
          } else {
            self.view_content.partials[file_url] = $.get(file_url).done(function(content) {
              var compiled = swig.compile(content);
              self.view_content.partials[file_url] = compiled;
              self.parsePartialTemplate(compiled, elem, isLast, renderCallback);
            }).fail(function() {
              throw new Error("Error including partial from: " + file_url);
            });
          }
        }
      });
    },

    parseEventHandlerData : function(eventtype, elem) {
      var eventdata = elem.attr('data-bind-click');
      if (!eventdata) {
        return null;
      }

      var parts = eventdata.split(/\((.+)\)/i);
      parts = parts.map(function(s) {
        return domino.util.string.trim(s);
      });

      var handlername = parts[0];
      var args;
      if (parts.length > 1) {
        args = parts[1].split(',');
        args = args.map(function(s) {
          return domino.util.string.trim(s);
        });
      } else {
        args = [];
      }

      args.unshift(elem[0]);
      return [handlername, args];
    },

    updateEventHandlers : function($element) {
      var self = this;
      $element.find('[data-bind-event]').each(function() {
        var elem = $(this);
        elem.removeAttr('data-bind-event');
      });

      $element.find('[data-bind-click]').each(function() {
        var element = this;
        var elem = $(element);
        var eventtype = 'click';
        var data = self.parseEventHandlerData(eventtype, elem);
        if (data && data.length == 2) {
          elem.removeAttr('data-bind-click');
          self.addEventListener(eventtype, data[0], data[1]);
          self.eventbus.cleanupElements(eventtype, data[0]);
        }
      });
    },

    parseCustomTags : function(container) {
      var self = this;
      var custom_tags = ['dm:debug'];
      var tags = container.getElementsByTagName('dm:debug');
      for (var i = 0; i < tags.length; i++) {
        var debugentry = tags[i];
        $(debugentry).children().each(function() {
          var caption = this.getAttribute('caption') || '';
          var method = this.nodeName.toLowerCase();
          var content = this.innerHTML;
          // TODO: add some kind of validation here
          content = 'self.view_args.' + content;
          console[method](caption, eval(content));
        });

        debugentry.parentNode.removeChild(debugentry);
      }
    }
  };

  domino.views.ViewRenderer = ViewRenderer;

})(window, document);


(function(window, document, undefined) {
  ////////////////////////////////////////////////////////////////////////
  // CONTROLLERS
  ////////////////////////////////////////////////////////////////////////
  function validateModel() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length == 0) {
      throw new Error('model name needs to be specified!');
    }
    if (!domino.util.isString(args[0])) {
      throw new Error('model name needs to be string!');
    }
    var model = args.shift();
    return [model, args];
  };

  function getFuncArgNames(fn) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var fnStr = fn.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);

    return result;
  };

  function DepedencyTracker() {
    this.superclass.constructor.call(this);
  };

  domino.util.inherits(DepedencyTracker, domino.util.EventEmitter);

  function ModelInjector(model) {
    this.context = null;
    this.model = model || null;
  };

  ModelInjector.prototype = {
    initModel : function(context) {
      var self = this;
      this.context = context;

      var data = validateModel(this.model);
      var instance = domino.models.run(this.model);

      instance.after = function afterDependecy(dependency, callback, models) {
        var definition, args = null;
        models = models || [];


        if (domino.util.isArray(dependency) && dependency.length > 0) {
          definition = dependency.shift();
        } else {
          definition = dependency;
        }

        if (definition && domino.util.isArray(definition) && definition.length > 1) {
          args = definition.slice(1);
          definition = definition[0];
        }

        var parts  = definition.split('.');
        var model  = parts[0];
        var method = parts[1] || 'init';

        self.runDependencies(model, method, args).once('result', function() {
          var methodInstance = arguments[0];
          models.push(methodInstance.model);

          if (domino.util.isArray(dependency) && dependency.length > 0) {
            afterDependecy(dependency, callback, models);
          } else {
            domino.controllers.wrapAction(self.context, callback, models);
          }
        });
        return instance;
      };

      return instance;
    },

    runDependencies : function(model, method, args) {
      var emitter = new DepedencyTracker();
      var self = this;

      if (model && method) {
        var m = this.context.initModel(model);
        var instance = (args ? m[method].apply(m, args) : m[method]());

        instance.once('result', function() {
          var args = Array.prototype.slice.call(arguments, 0);

          args.unshift(this);
          args.unshift('result');

          emitter.emit.apply(emitter, args);
        }, instance.cacheresult);
      }
      return emitter;
    }
  };

  domino.controllers = new function() {
    var __controllers = {}, __controller = null;

    function BaseController() {
    };

    BaseController.prototype = {
      model : function(/* model name, arg1, arg2 ... */) {
        var data = validateModel.apply(null, arguments);
        return domino.models.run(data[0], data[1]);
      },

      initModel : function(model) {
        var modelName = model + 'Model';
        var mi = new ModelInjector(model);
        this[modelName] = mi.initModel(this);
        return this[modelName];
      },

      /**
       *
       * @param {String} newstate
       * @param {Object} data
       */
      changeState : function(newstate, data, opts) {
        domino.viewstates.change(newstate, data, opts);
        return this;
      },

      assign : function(var_name, value) {
        domino.views.assignVar(var_name, value);
        return this;
      },

      render : function(actionName) {
        if (!__controller) {
          return;
        }

        actionName = actionName || this.currentAction;
        var currentView = domino.views.getCurrent();

        if (currentView && currentView.instance && currentView.started) {
          currentView.instance.render(__controller.name, actionName, {}, __controller.instance);
        }
      }
    };

    /**
     *
     * @param {BaseController} controller the controller instance
     * @param {String|Function} fn
     * @param {Array} args
     */
    this.wrapAction = function wrapAction(controller, fn, args) {
      var result;
      if (domino.util.isString(fn)) {
        result = controller[fn].apply(controller, args);
      } else {
        result = fn.apply(controller, args);
      }

      var view = controller.view;
      if (view) {


        for (var key in view['@datastore']) {
          var value = view['@datastore'][key];
          if (value instanceof domino.util.EventEmitter) {
            (function(emitter, itemkey) {
              emitter.once('result', function(result) {
                var controller = domino.controllers.getCurrent().instance;
                controller.assign(itemkey, result);
                var action = controller.currentAction;
                controller.render(action);

                view['@datastore'][itemkey] = result;
              }, emitter.cacheresult);
            })(value, key, controller);
            delete view['@datastore'][key];
          } else {
            controller.assign(key, value);
          }
        }

        if (view.previous && domino.util.isEqual(view.previous, view['@datastore'])) {
          return result;
        }

        //controller.render(controller.currentAction);
        view.previous = domino.util.clone(view['@datastore']);
      } else {

      }

      return result;
    };

    this.inherits = function(controller, parent, spec) {
      if (domino.util.isUndefined(__controllers[parent])) {
        throw new Error('no controller defined by this name: ' + parent);
      }

      domino.util.inherits(__controllers[parent].fn, BaseController);
      domino.util.inherits(spec, __controllers[parent].fn);
      domino.controllers.define(controller, spec, true);
    };

    this.define = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      if (!domino.util.isString(args[0])) {
        throw new Error('first argument needs to be a string!');
      }
      var name = args[0].toLowerCase();
      if (!domino.util.isFunction(args[1])) {
        throw new Error('second argument needs to be a function!');
      }
      var fn = args[1];
      var extended = args[2] || false;

      if (__controllers[name]) {
        throw new Error('a controller with the name "' + name + '" has already been defined!');
      }
      __controllers[name] = {fn: fn, started: false, instance: null, name: name, extended: extended};
    };

    this.has = function(name) {
      return !domino.util.isUndefined(__controllers[name]);
    };

    this.run = function(controller) {
      if (domino.util.isUndefined(__controllers[controller])) {
        throw new Error('no controller defined by this name: ' + controller);
      }

      __controller =  __controllers[controller];
      var instance;
      if (__controller.started) {
        instance = __controller.instance;
      } else {
        if (!__controller.extended) {
          domino.util.inherits(__controller.fn, BaseController);
        }
        var args = [];
        var argnames = getFuncArgNames(__controller.fn);
        if (argnames && argnames.length) {
          for (var i = 0; i < argnames.length; i++) {
            if (argnames[i].indexOf('$') == 0) {
              var modelName = argnames[i].substring(1);
              var model = new ModelInjector(modelName);
              args.push(model);
            }
          }
        }

        instance = __controller.instance = args.length > 0
          ? domino.util.construct(__controller.fn, args)
          : new __controller.fn();

        instance['@id'] = controller + '-controller';

        if (argnames && argnames.length) {
          domino.util.forEach(argnames, function(element, index) {
            instance[element.substring(1) + 'Model'] = args[index];
          });
        }

        __controller.started = true;
      }

      return __controller.instance;
    };

    this.getCurrent = function() {
      return __controller;
    };
  };

})(window, document);

(function(window, document, undefined) {

  domino.router = function(options) {
    this.controller = null;
    this.action = null;
    this.options = options;
    this.currentController = null;
    this.actionName = '';
    this.routes = [];
    this.params = null;
    this.named_params = false;
    if (options.routes) {
      this.setupRoutes(options.routes);
    }
  };

  domino.router.prototype.routeUrl = function(path) {
    try {
      this.route();
    } catch (ex) {
      if (ex instanceof domino.util.NotFoundError) {
        location.href = '/404.html';
      } else {

      }
    }
  };

  domino.router.prototype.route = function() {
    var controller = this.controller;
    var action = this.action;
    var params = this.params;
    var self = this;

    this.currentController = domino.controllers.run(controller);

    var route = {
      fragment : this.fragment,
      query : this.query,
      params : this.params
    };

    this.currentController.params = params;
    this.currentController.view = new domino.views.viewScope(this.currentController, action);
    this.currentController.$view = this.currentController.view['@datastore'];
    this.currentController.currentAction = this.actionName;
    this.currentController.fragment = this.fragment || {};
    this.currentController.query = this.query || {};
    this.currentController._options = {};

    var isActionDefined = domino.util.isFunction(this.currentController[action]);
    var options;
    if (isActionDefined) {
      options = this.currentController._options[this.actionName] = {};
    }

    if (domino.util.isFunction(this.currentController.init)) {
      //domino.controllers.wrapAction(this.currentController, 'init', [options]);
      this.currentController.init(options);
    }

    if (domino.util.isFunction(this.currentController[action])) {
      // Run the controller action
      this.currentController[action].call(this.currentController, options, route);
    } else if (this.options.throw_exceptions) {

      throw new NotFoundError('An action does not exist with this name for the current controller: ' + action);
    }
  };

  domino.router.prototype.parseUrl = function(path) {
    var hasHash = domino.util.string.contains(path, '#');
    var hasQuery = domino.util.string.contains(path, '?');

    this.query = null;
    this.fragment = null;

    if (hasHash) {
      var fragment = path.substring(path.indexOf('#') + 1);
      this.fragment = domino.util.string.decodeQueryString(fragment);
      path = path.substring(0, path.indexOf('#'));
    }
    if (hasQuery) {
      var query = path.substring(path.indexOf('?') + 1);
      this.query = domino.util.string.decodeQueryString(query);
      path = path.substring(0, path.indexOf('?'));
    }

    var route = this.find(path);
    this.params = null;
    this.actionName = null;

    if (route) {
      this.controller   = route.controller;
      this.action       = route.action.concat('Action');
      this.actionName   = route.action;
      this.named_params = true;
      this.params       = {};
      var params = path.match(route.regex);
      if (params && params.length > 1) {
        for (var i = 1; i < params.length; i++) {
          var param = {};
          this.params[route.keys[i-1].name] = params[i];
        }
      }
    } else {
      this.named_params = false;
      this.params       = [];
      var parts = path.split('/'), part;
      var controller = null, action = null, instance = null;

      for (var i = 0; i < parts.length; i++) {
        part = parts[i];
        if (part) {
          if (!controller) {
              controller = part;
              continue;
            }

          if (!action) {
            this.actionName = part;
            action = part.toLowerCase().concat('Action');
            continue;
          }
          part = part.replace(/(.+)\.[^.]+$/, "$1");
          this.params.push(part);
        }
      }

      this.controller = controller || 'index';
      this.action = action || 'indexAction';
      this.actionName = this.actionName || 'index';
    }

  };

  domino.router.prototype.setupRoutes = function(routes) {
    domino.util.each(routes, function(item) {
      var route        = {};
      route.keys       = [];
      route.controller = item.defaults.controller;
      route.action     = item.defaults.action || 'index';
      route.regex      = normalize(item.route, route.keys, false, true);

      this.routes.push(route);
    }, this);
  };


  domino.router.prototype.find = function(url) {
    for (var i = 0, len = this.routes.length; i < len; i++) {
      var item = this.routes[i];
      if (item.regex.test(url)) {
        return item;
      }
    }

    return false;
  };

  function normalize(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  }

  var NotFoundError = domino.util.NotFoundError = function NotFoundError(msg) {
    this.super.apply(this, arguments);
    this.message = msg;
  };
  domino.util.extend(domino.util.NotFoundError, Error);
})(window, document);

(function(window, document, undefined) {
////////////////////////////////////////////////////////////////////////
// EVENT MANAGER
////////////////////////////////////////////////////////////////////////
domino.eventmanager = new function() {
  var __events = {}, currentProvider = null;

  function setupEventsRouter() {
    document.body.addEventListener('click', function(event) {
      routeEventHandler('click', event);
    }, false);

    document.body.addEventListener('submit', function(event) {
      event.preventDefault();
      routeEventHandler('submit', event);
    }, false);
  };

  function routeEventHandler(type, event) {
    var element = event.target;
    var name;
    var actionFn;

    if (element.hasAttribute('id')) {
      name = domino.util.string.prepareStr(element.getAttribute('id'));
      return domino.events.call(name, event);
    }
  };

  return {
    setup : setupEventsRouter
  };
};

domino.events = new function() {
  var __providers = {}, __current_provider = null;

  this.provide = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!domino.util.isString(args[0])) {
      throw new Error('first argument needs to be string!');
    }
    var name = args[0].toLowerCase();
    var instance = args[1];

    if (__providers[name]) {
      throw new Error('an event provider with the name "' + name + '" has already been defined!');
    }
    __providers[name] = {started: false, instance: instance, name: name};
  };

  this.run = function(provider) {
    if (domino.util.isUndefined(__providers[provider])) {
      throw new Error('no event provider defined by this name: ' + provider);
    }

    __current_provider =  __providers[provider];
    if (!__current_provider.started) {
      __current_provider.started = true;
    }

    return __current_provider.instance;
  };

  this.hasProvider = function(name) {
    return !domino.util.isUndefined(__providers[name]);
  };

  this.call = function(value, event) {
    var handlerName = [value, domino.util.string.capitalize(event.type), 'Handler'].join('');

    if (!domino.util.isUndefined(__current_provider.instance[handlerName])) {
      var currentView = __current_provider.instance;

      if (currentView && currentView._currentView && currentView._currentAction) {
        var renderer = currentView.getRenderer(currentView._currentView, currentView._currentAction);
        if (renderer) {
          renderer.updateViewBindings(currentView.$scope);
        }
    }
      return currentView[handlerName].call(currentView, event);
    }
    return null;
  };

  this.provider = function(name) {
    return this.run(name);
  };
};

domino.eventmanager.EventBus = function(renderer) {
  this.view = renderer.view_instance;
  this.element = null;
  this.renderer = renderer;
  this.controller = null;
  this.__events = {};
  this.__delegators = {};
  this.__elements = [];
};

domino.eventmanager.EventBus.prototype = {
  setController : function(controller) {
    this.controller = controller;
    return this;
  },

  setElement : function(element) {
    if (element) {
      var self = this;
      $(this.element).off();
      this.__events = {};
      this.__delegators = {};
    }
    this.element = element;
    return this;
  },

  bind : function(type, handler, args) {
    var element = args[0];
    if (this.isRegistered(type, element, handler)) {
      return this;
    }

    this.registerHandler(type, handler, args);
  },

  isRegistered : function(type, element, handler) {
    if (this.__events[type]) {
      var matches = this.__events[type];
      if (matches && matches.length > 0) {
        var el = domino.util.findWhere(matches, {
          handler : handler,
          element : element
        });

        if (el) {
          return true;
        }
      }
    }
    return false;
  },

  getRegisteredHandlers : function(type, element) {
    if (this.__events[type]) {
      return domino.util.where(this.__events[type], {
        element : element
      });;
    }
    return null;
  },

  registerHandler : function(type, handler, args) {
    if (!this.__delegators[type]) {
      this.addDelegator(type);
    }

    if (!this.__events[type]) {
      this.__events[type] = [];
    }

    var item = {
      element : args[0],
      handler : handler,
      args : args.slice(1)
    };

    this.__events[type].push(item);
    this.__elements.push(args[0]);
  },

  addDelegator : function(type) {
    var self = this;
    var listener = this.__delegators[type] = function(event) {
      var target = event.target;
      var matches = self.getRegisteredHandlers(type, target);
      if (matches && matches.length) {
        self.executeHandlers(matches, event);
      }
    };
    $(this.element).on(type, listener);
  },

  callHandler : function(item, event) {
    var handlerFn = this.view[item.handler];
    var args = item.args.slice(0);
    if (event.target != item.element) {
      item.element = event.target;
    }

    if (args[0] == 'event') {
      args[0] = event;
    }
    handlerFn.apply(this.view, args);
  },

  executeHandlers : function(matches, event) {
    var self = this;
    if (matches.length == 1) {
      self.callHandler(matches[0], event);
      return;
    }

    for (var i = 0; i < matches.length; i++) {
      (function(index) {
        var item = matches[index];
        self.callHandler(item, event);
      })(i);
    }
  },

  cleanupElements : function(eventtype, handlername) {
    var detached = domino.util.filter(this.__elements, function(element) {
      return !$.contains(document.documentElement, element);
    });

    for (var i = 0; i < detached.length; i++) {
      var entry = domino.util.findWhere(this.__events[eventtype], {
        element : detached[i],
        handler : handlername
      });

      domino.util.array.remove(this.__events[eventtype], entry);
      domino.util.array.remove(this.__elements, detached[i]);
    }
  }
};

})(window, document);

(function(window, document, undefined) {
  ////////////////////////////////////////////////////////////////////////
  // BOOTSTRAP
  ////////////////////////////////////////////////////////////////////////
  var supportsPushState = window.history.pushState && domino.util.isFunction(window.history.pushState);

  domino.bootstrap = function(options) {
    this.options = options;
    if (options.views_path) {
      domino.views.setBasePath(options.views_path);
    }
    this.router = new domino.router(options);
    this.currentView = null;
    this.supportsPushState = supportsPushState;
    this.boot();
  };

  domino.bootstrap.prototype.boot = function() {
    domino.eventmanager.setup();

    this.setupPushStateListener();
    this.handleUrl();
    return this;
  };

  domino.bootstrap.prototype.setupPushStateListener = function() {
    var self = this;

    $(window).bind('popstate', function(ev) {
      self.handlePushState(ev);
    });

    $('body').on('click', 'a', function(ev) {
      if (!supportsPushState) {
        return;
      }
      if (ev.isDefaultPrevented() || ev.isPropagationStopped()) {
        return;
      }
      var href = $(this).attr('href');
      var hostname = location.protocol + '//' + location.host;
      if (!domino.util.string.startsWith(href, 'http://') &&
        !domino.util.string.startsWith(href, 'https://') ||
        hostname.indexOf(href) === 0) {
          ev.preventDefault();
          window.history.pushState("", "Title", href);
          self.handlePushState(ev);
      }
    });
  };

  domino.bootstrap.prototype.handleUrl = function() {
    var url = location.pathname + location.search + location.hash;
    this.router.parseUrl(url);
    var view_found = false, controller_found = false;
    var controller = this.router.controller;

    if (domino.views.has(controller)) {
      this.currentView = domino.views.run(controller);
      view_found = true;
    }

    if (controller && domino.controllers.has(controller)) {
      this.router.routeUrl();
      controller_found = true;
    }

    if (!view_found && !controller_found) {

      throw new domino.util.NotFoundError('Controller does not exist with this name: ' + controller);
    }
  };

  domino.bootstrap.prototype.handlePushState = function(event) {
    this.handleUrl();
    this.render(event);
  };

  domino.bootstrap.prototype.render = function(event) {
    var controller = this.router.controller;

    if (this.currentView) {
      if (event) {
        this.currentView.$event = event;
      }
      var actionName = this.router.actionName;
      var opts = this.router.currentController && this.router.currentController._options[actionName] || {};
      var script_options = {};

      this.currentView.$scope = this.router.currentController && this.router.currentController.$view;

      if (domino.util.isFunction(this.currentView.init)) {
        this.currentView.init(opts);
      }

      if (domino.util.isFunction(this.currentView[actionName.toLowerCase() + 'View'])) {
        this.currentView[actionName.toLowerCase() + 'View'](script_options);
      }
      var render = domino.util.isUndefined(opts.script_render) || opts.script_render;
      if (render) {
        this.currentView.handleViewScope(controller, actionName, script_options, this.router.currentController);
        this.currentView.render(controller, actionName, script_options, this.router.currentController);
      }
    }
  };

})(window, document);
