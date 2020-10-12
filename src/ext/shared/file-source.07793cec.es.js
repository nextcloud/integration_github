function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

var consoleLogger = {
  type: 'logger',
  log: function log(args) {
    this.output('log', args);
  },
  warn: function warn(args) {
    this.output('warn', args);
  },
  error: function error(args) {
    this.output('error', args);
  },
  output: function output(type, args) {
    if (console && console[type]) console[type].apply(console, args);
  }
};

var Logger = function () {
  function Logger(concreteLogger) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Logger);

    this.init(concreteLogger, options);
  }

  _createClass(Logger, [{
    key: "init",
    value: function init(concreteLogger) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.prefix = options.prefix || 'i18next:';
      this.logger = concreteLogger || consoleLogger;
      this.options = options;
      this.debug = options.debug;
    }
  }, {
    key: "setDebug",
    value: function setDebug(bool) {
      this.debug = bool;
    }
  }, {
    key: "log",
    value: function log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.forward(args, 'log', '', true);
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.forward(args, 'warn', '', true);
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.forward(args, 'error', '');
    }
  }, {
    key: "deprecate",
    value: function deprecate() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
    }
  }, {
    key: "forward",
    value: function forward(args, lvl, prefix, debugOnly) {
      if (debugOnly && !this.debug) return null;
      if (typeof args[0] === 'string') args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
      return this.logger[lvl](args);
    }
  }, {
    key: "create",
    value: function create(moduleName) {
      return new Logger(this.logger, _objectSpread({}, {
        prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
      }, this.options));
    }
  }]);

  return Logger;
}();

var baseLogger = new Logger();

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.observers = {};
  }

  _createClass(EventEmitter, [{
    key: "on",
    value: function on(events, listener) {
      var _this = this;

      events.split(' ').forEach(function (event) {
        _this.observers[event] = _this.observers[event] || [];

        _this.observers[event].push(listener);
      });
      return this;
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      if (!this.observers[event]) return;

      if (!listener) {
        delete this.observers[event];
        return;
      }

      this.observers[event] = this.observers[event].filter(function (l) {
        return l !== listener;
      });
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.observers[event]) {
        var cloned = [].concat(this.observers[event]);
        cloned.forEach(function (observer) {
          observer.apply(void 0, args);
        });
      }

      if (this.observers['*']) {
        var _cloned = [].concat(this.observers['*']);

        _cloned.forEach(function (observer) {
          observer.apply(observer, [event].concat(args));
        });
      }
    }
  }]);

  return EventEmitter;
}();

function defer() {
  var res;
  var rej;
  var promise = new Promise(function (resolve, reject) {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
}
function makeString(object) {
  if (object == null) return '';
  return '' + object;
}
function copy(a, s, t) {
  a.forEach(function (m) {
    if (s[m]) t[m] = s[m];
  });
}

function getLastOfPath(object, path, Empty) {
  function cleanKey(key) {
    return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
  }

  function canNotTraverseDeeper() {
    return !object || typeof object === 'string';
  }

  var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');

  while (stack.length > 1) {
    if (canNotTraverseDeeper()) return {};
    var key = cleanKey(stack.shift());
    if (!object[key] && Empty) object[key] = new Empty();
    object = object[key];
  }

  if (canNotTraverseDeeper()) return {};
  return {
    obj: object,
    k: cleanKey(stack.shift())
  };
}

function setPath(object, path, newValue) {
  var _getLastOfPath = getLastOfPath(object, path, Object),
      obj = _getLastOfPath.obj,
      k = _getLastOfPath.k;

  obj[k] = newValue;
}
function pushPath(object, path, newValue, concat) {
  var _getLastOfPath2 = getLastOfPath(object, path, Object),
      obj = _getLastOfPath2.obj,
      k = _getLastOfPath2.k;

  obj[k] = obj[k] || [];
  if (concat) obj[k] = obj[k].concat(newValue);
  if (!concat) obj[k].push(newValue);
}
function getPath(object, path) {
  var _getLastOfPath3 = getLastOfPath(object, path),
      obj = _getLastOfPath3.obj,
      k = _getLastOfPath3.k;

  if (!obj) return undefined;
  return obj[k];
}
function getPathWithDefaults(data, defaultData, key) {
  var value = getPath(data, key);

  if (value !== undefined) {
    return value;
  }

  return getPath(defaultData, key);
}
function deepExtend(target, source, overwrite) {
  for (var prop in source) {
    if (prop !== '__proto__') {
      if (prop in target) {
        if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}
function regexEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
var _entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
function escape(data) {
  if (typeof data === 'string') {
    return data.replace(/[&<>"'\/]/g, function (s) {
      return _entityMap[s];
    });
  }

  return data;
}
var isIE10 = typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1;

var ResourceStore = function (_EventEmitter) {
  _inherits(ResourceStore, _EventEmitter);

  function ResourceStore(data) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      ns: ['translation'],
      defaultNS: 'translation'
    };

    _classCallCheck(this, ResourceStore);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResourceStore).call(this));

    if (isIE10) {
      EventEmitter.call(_assertThisInitialized(_this));
    }

    _this.data = data || {};
    _this.options = options;

    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }

    return _this;
  }

  _createClass(ResourceStore, [{
    key: "addNamespaces",
    value: function addNamespaces(ns) {
      if (this.options.ns.indexOf(ns) < 0) {
        this.options.ns.push(ns);
      }
    }
  }, {
    key: "removeNamespaces",
    value: function removeNamespaces(ns) {
      var index = this.options.ns.indexOf(ns);

      if (index > -1) {
        this.options.ns.splice(index, 1);
      }
    }
  }, {
    key: "getResource",
    value: function getResource(lng, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var path = [lng, ns];
      if (key && typeof key !== 'string') path = path.concat(key);
      if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
      }

      return getPath(this.data, path);
    }
  }, {
    key: "addResource",
    value: function addResource(lng, ns, key, value) {
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
        silent: false
      };
      var keySeparator = this.options.keySeparator;
      if (keySeparator === undefined) keySeparator = '.';
      var path = [lng, ns];
      if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        value = ns;
        ns = path[1];
      }

      this.addNamespaces(ns);
      setPath(this.data, path, value);
      if (!options.silent) this.emit('added', lng, ns, key, value);
    }
  }, {
    key: "addResources",
    value: function addResources(lng, ns, resources) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        silent: false
      };

      for (var m in resources) {
        if (typeof resources[m] === 'string' || Object.prototype.toString.apply(resources[m]) === '[object Array]') this.addResource(lng, ns, m, resources[m], {
          silent: true
        });
      }

      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "addResourceBundle",
    value: function addResourceBundle(lng, ns, resources, deep, overwrite) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
        silent: false
      };
      var path = [lng, ns];

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        deep = resources;
        resources = ns;
        ns = path[1];
      }

      this.addNamespaces(ns);
      var pack = getPath(this.data, path) || {};

      if (deep) {
        deepExtend(pack, resources, overwrite);
      } else {
        pack = _objectSpread({}, pack, resources);
      }

      setPath(this.data, path, pack);
      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "removeResourceBundle",
    value: function removeResourceBundle(lng, ns) {
      if (this.hasResourceBundle(lng, ns)) {
        delete this.data[lng][ns];
      }

      this.removeNamespaces(ns);
      this.emit('removed', lng, ns);
    }
  }, {
    key: "hasResourceBundle",
    value: function hasResourceBundle(lng, ns) {
      return this.getResource(lng, ns) !== undefined;
    }
  }, {
    key: "getResourceBundle",
    value: function getResourceBundle(lng, ns) {
      if (!ns) ns = this.options.defaultNS;
      if (this.options.compatibilityAPI === 'v1') return _objectSpread({}, {}, this.getResource(lng, ns));
      return this.getResource(lng, ns);
    }
  }, {
    key: "getDataByLanguage",
    value: function getDataByLanguage(lng) {
      return this.data[lng];
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.data;
    }
  }]);

  return ResourceStore;
}(EventEmitter);

var postProcessor = {
  processors: {},
  addPostProcessor: function addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle: function handle(processors, value, key, options, translator) {
    var _this = this;

    processors.forEach(function (processor) {
      if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
    });
    return value;
  }
};

var checkedLoadedFor = {};

var Translator = function (_EventEmitter) {
  _inherits(Translator, _EventEmitter);

  function Translator(services) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Translator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Translator).call(this));

    if (isIE10) {
      EventEmitter.call(_assertThisInitialized(_this));
    }

    copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, _assertThisInitialized(_this));
    _this.options = options;

    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }

    _this.logger = baseLogger.create('translator');
    return _this;
  }

  _createClass(Translator, [{
    key: "changeLanguage",
    value: function changeLanguage(lng) {
      if (lng) this.language = lng;
    }
  }, {
    key: "exists",
    value: function exists(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        interpolation: {}
      };
      var resolved = this.resolve(key, options);
      return resolved && resolved.res !== undefined;
    }
  }, {
    key: "extractFromKey",
    value: function extractFromKey(key, options) {
      var nsSeparator = options.nsSeparator !== undefined ? options.nsSeparator : this.options.nsSeparator;
      if (nsSeparator === undefined) nsSeparator = ':';
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var namespaces = options.ns || this.options.defaultNS;

      if (nsSeparator && key.indexOf(nsSeparator) > -1) {
        var m = key.match(this.interpolator.nestingRegexp);

        if (m && m.length > 0) {
          return {
            key: key,
            namespaces: namespaces
          };
        }

        var parts = key.split(nsSeparator);
        if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
        key = parts.join(keySeparator);
      }

      if (typeof namespaces === 'string') namespaces = [namespaces];
      return {
        key: key,
        namespaces: namespaces
      };
    }
  }, {
    key: "translate",
    value: function translate(keys, options, lastKey) {
      var _this2 = this;

      if (_typeof(options) !== 'object' && this.options.overloadTranslationOptionHandler) {
        options = this.options.overloadTranslationOptionHandler(arguments);
      }

      if (!options) options = {};
      if (keys === undefined || keys === null) return '';
      if (!Array.isArray(keys)) keys = [String(keys)];
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;

      var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options),
          key = _this$extractFromKey.key,
          namespaces = _this$extractFromKey.namespaces;

      var namespace = namespaces[namespaces.length - 1];
      var lng = options.lng || this.language;
      var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;

      if (lng && lng.toLowerCase() === 'cimode') {
        if (appendNamespaceToCIMode) {
          var nsSeparator = options.nsSeparator || this.options.nsSeparator;
          return namespace + nsSeparator + key;
        }

        return key;
      }

      var resolved = this.resolve(keys, options);
      var res = resolved && resolved.res;
      var resUsedKey = resolved && resolved.usedKey || key;
      var resExactUsedKey = resolved && resolved.exactUsedKey || key;
      var resType = Object.prototype.toString.apply(res);
      var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
      var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;
      var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
      var handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';

      if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === 'string' && resType === '[object Array]')) {
        if (!options.returnObjects && !this.options.returnObjects) {
          this.logger.warn('accessing an object - but returnObjects options is not enabled!');
          return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, options) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
        }

        if (keySeparator) {
          var resTypeIsArray = resType === '[object Array]';
          var copy$$1 = resTypeIsArray ? [] : {};
          var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;

          for (var m in res) {
            if (Object.prototype.hasOwnProperty.call(res, m)) {
              var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m);
              copy$$1[m] = this.translate(deepKey, _objectSpread({}, options, {
                joinArrays: false,
                ns: namespaces
              }));
              if (copy$$1[m] === deepKey) copy$$1[m] = res[m];
            }
          }

          res = copy$$1;
        }
      } else if (handleAsObjectInI18nFormat && typeof joinArrays === 'string' && resType === '[object Array]') {
        res = res.join(joinArrays);
        if (res) res = this.extendTranslation(res, keys, options, lastKey);
      } else {
        var usedDefault = false;
        var usedKey = false;

        if (!this.isValidLookup(res) && options.defaultValue !== undefined) {
          usedDefault = true;

          if (options.count !== undefined) {
            var suffix = this.pluralResolver.getSuffix(lng, options.count);
            res = options["defaultValue".concat(suffix)];
          }

          if (!res) res = options.defaultValue;
        }

        if (!this.isValidLookup(res)) {
          usedKey = true;
          res = key;
        }

        var updateMissing = options.defaultValue && options.defaultValue !== res && this.options.updateMissing;

        if (usedKey || usedDefault || updateMissing) {
          this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? options.defaultValue : res);

          if (keySeparator) {
            var fk = this.resolve(key, _objectSpread({}, options, {
              keySeparator: false
            }));
            if (fk && fk.res) this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.');
          }

          var lngs = [];
          var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);

          if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
            for (var i = 0; i < fallbackLngs.length; i++) {
              lngs.push(fallbackLngs[i]);
            }
          } else if (this.options.saveMissingTo === 'all') {
            lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
          } else {
            lngs.push(options.lng || this.language);
          }

          var send = function send(l, k) {
            if (_this2.options.missingKeyHandler) {
              _this2.options.missingKeyHandler(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
            } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
              _this2.backendConnector.saveMissing(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
            }

            _this2.emit('missingKey', l, namespace, k, res);
          };

          if (this.options.saveMissing) {
            var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';

            if (this.options.saveMissingPlurals && needsPluralHandling) {
              lngs.forEach(function (l) {
                var plurals = _this2.pluralResolver.getPluralFormsOfKey(l, key);

                plurals.forEach(function (p) {
                  return send([l], p);
                });
              });
            } else {
              send(lngs, key);
            }
          }
        }

        res = this.extendTranslation(res, keys, options, resolved, lastKey);
        if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = "".concat(namespace, ":").concat(key);
        if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
      }

      return res;
    }
  }, {
    key: "extendTranslation",
    value: function extendTranslation(res, key, options, resolved, lastKey) {
      var _this3 = this;

      if (this.i18nFormat && this.i18nFormat.parse) {
        res = this.i18nFormat.parse(res, options, resolved.usedLng, resolved.usedNS, resolved.usedKey, {
          resolved: resolved
        });
      } else if (!options.skipInterpolation) {
        if (options.interpolation) this.interpolator.init(_objectSpread({}, options, {
          interpolation: _objectSpread({}, this.options.interpolation, options.interpolation)
        }));
        var skipOnVariables = options.interpolation && options.interpolation.skipOnVariables || this.options.interpolation.skipOnVariables;
        var nestBef;

        if (skipOnVariables) {
          var nb = res.match(this.interpolator.nestingRegexp);
          nestBef = nb && nb.length;
        }

        var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
        if (this.options.interpolation.defaultVariables) data = _objectSpread({}, this.options.interpolation.defaultVariables, data);
        res = this.interpolator.interpolate(res, data, options.lng || this.language, options);

        if (skipOnVariables) {
          var na = res.match(this.interpolator.nestingRegexp);
          var nestAft = na && na.length;
          if (nestBef < nestAft) options.nest = false;
        }

        if (options.nest !== false) res = this.interpolator.nest(res, function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (lastKey && lastKey[0] === args[0]) {
            _this3.logger.warn("It seems you are nesting recursively key: ".concat(args[0], " in key: ").concat(key[0]));

            return null;
          }

          return _this3.translate.apply(_this3, args.concat([key]));
        }, options);
        if (options.interpolation) this.interpolator.reset();
      }

      var postProcess = options.postProcess || this.options.postProcess;
      var postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

      if (res !== undefined && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
        res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? _objectSpread({
          i18nResolved: resolved
        }, options) : options, this);
      }

      return res;
    }
  }, {
    key: "resolve",
    value: function resolve(keys) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var found;
      var usedKey;
      var exactUsedKey;
      var usedLng;
      var usedNS;
      if (typeof keys === 'string') keys = [keys];
      keys.forEach(function (k) {
        if (_this4.isValidLookup(found)) return;

        var extracted = _this4.extractFromKey(k, options);

        var key = extracted.key;
        usedKey = key;
        var namespaces = extracted.namespaces;
        if (_this4.options.fallbackNS) namespaces = namespaces.concat(_this4.options.fallbackNS);
        var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
        var needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';
        var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language, options.fallbackLng);
        namespaces.forEach(function (ns) {
          if (_this4.isValidLookup(found)) return;
          usedNS = ns;

          if (!checkedLoadedFor["".concat(codes[0], "-").concat(ns)] && _this4.utils && _this4.utils.hasLoadedNamespace && !_this4.utils.hasLoadedNamespace(usedNS)) {
            checkedLoadedFor["".concat(codes[0], "-").concat(ns)] = true;

            _this4.logger.warn("key \"".concat(usedKey, "\" for languages \"").concat(codes.join(', '), "\" won't get resolved as namespace \"").concat(usedNS, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
          }

          codes.forEach(function (code) {
            if (_this4.isValidLookup(found)) return;
            usedLng = code;
            var finalKey = key;
            var finalKeys = [finalKey];

            if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
              _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
            } else {
              var pluralSuffix;
              if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count);
              if (needsPluralHandling && needsContextHandling) finalKeys.push(finalKey + pluralSuffix);
              if (needsContextHandling) finalKeys.push(finalKey += "".concat(_this4.options.contextSeparator).concat(options.context));
              if (needsPluralHandling) finalKeys.push(finalKey += pluralSuffix);
            }

            var possibleKey;

            while (possibleKey = finalKeys.pop()) {
              if (!_this4.isValidLookup(found)) {
                exactUsedKey = possibleKey;
                found = _this4.getResource(code, ns, possibleKey, options);
              }
            }
          });
        });
      });
      return {
        res: found,
        usedKey: usedKey,
        exactUsedKey: exactUsedKey,
        usedLng: usedLng,
        usedNS: usedNS
      };
    }
  }, {
    key: "isValidLookup",
    value: function isValidLookup(res) {
      return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
    }
  }, {
    key: "getResource",
    value: function getResource(code, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
      return this.resourceStore.getResource(code, ns, key, options);
    }
  }]);

  return Translator;
}(EventEmitter);

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var LanguageUtil = function () {
  function LanguageUtil(options) {
    _classCallCheck(this, LanguageUtil);

    this.options = options;
    this.whitelist = this.options.supportedLngs || false;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create('languageUtils');
  }

  _createClass(LanguageUtil, [{
    key: "getScriptPartFromCode",
    value: function getScriptPartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return null;
      var p = code.split('-');
      if (p.length === 2) return null;
      p.pop();
      if (p[p.length - 1].toLowerCase() === 'x') return null;
      return this.formatLanguageCode(p.join('-'));
    }
  }, {
    key: "getLanguagePartFromCode",
    value: function getLanguagePartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return code;
      var p = code.split('-');
      return this.formatLanguageCode(p[0]);
    }
  }, {
    key: "formatLanguageCode",
    value: function formatLanguageCode(code) {
      if (typeof code === 'string' && code.indexOf('-') > -1) {
        var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
        var p = code.split('-');

        if (this.options.lowerCaseLng) {
          p = p.map(function (part) {
            return part.toLowerCase();
          });
        } else if (p.length === 2) {
          p[0] = p[0].toLowerCase();
          p[1] = p[1].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
        } else if (p.length === 3) {
          p[0] = p[0].toLowerCase();
          if (p[1].length === 2) p[1] = p[1].toUpperCase();
          if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
          if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
        }

        return p.join('-');
      }

      return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
    }
  }, {
    key: "isWhitelisted",
    value: function isWhitelisted(code) {
      this.logger.deprecate('languageUtils.isWhitelisted', 'function "isWhitelisted" will be renamed to "isSupportedCode" in the next major - please make sure to rename it\'s usage asap.');
      return this.isSupportedCode(code);
    }
  }, {
    key: "isSupportedCode",
    value: function isSupportedCode(code) {
      if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
        code = this.getLanguagePartFromCode(code);
      }

      return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
    }
  }, {
    key: "getBestMatchFromCodes",
    value: function getBestMatchFromCodes(codes) {
      var _this = this;

      if (!codes) return null;
      var found;
      codes.forEach(function (code) {
        if (found) return;

        var cleanedLng = _this.formatLanguageCode(code);

        if (!_this.options.supportedLngs || _this.isSupportedCode(cleanedLng)) found = cleanedLng;
      });

      if (!found && this.options.supportedLngs) {
        codes.forEach(function (code) {
          if (found) return;

          var lngOnly = _this.getLanguagePartFromCode(code);

          if (_this.isSupportedCode(lngOnly)) return found = lngOnly;
          found = _this.options.supportedLngs.find(function (supportedLng) {
            if (supportedLng.indexOf(lngOnly) === 0) return supportedLng;
          });
        });
      }

      if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
      return found;
    }
  }, {
    key: "getFallbackCodes",
    value: function getFallbackCodes(fallbacks, code) {
      if (!fallbacks) return [];
      if (typeof fallbacks === 'string') fallbacks = [fallbacks];
      if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;
      if (!code) return fallbacks["default"] || [];
      var found = fallbacks[code];
      if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
      if (!found) found = fallbacks[this.formatLanguageCode(code)];
      if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
      if (!found) found = fallbacks["default"];
      return found || [];
    }
  }, {
    key: "toResolveHierarchy",
    value: function toResolveHierarchy(code, fallbackCode) {
      var _this2 = this;

      var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
      var codes = [];

      var addCode = function addCode(c) {
        if (!c) return;

        if (_this2.isSupportedCode(c)) {
          codes.push(c);
        } else {
          _this2.logger.warn("rejecting language code not found in supportedLngs: ".concat(c));
        }
      };

      if (typeof code === 'string' && code.indexOf('-') > -1) {
        if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
        if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
        if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
      } else if (typeof code === 'string') {
        addCode(this.formatLanguageCode(code));
      }

      fallbackCodes.forEach(function (fc) {
        if (codes.indexOf(fc) < 0) addCode(_this2.formatLanguageCode(fc));
      });
      return codes;
    }
  }]);

  return LanguageUtil;
}();

var sets = [{
  lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'ti', 'tr', 'uz', 'wa'],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'hi', 'hu', 'hy', 'ia', 'it', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ['ay', 'bo', 'cgg', 'fa', 'id', 'ja', 'jbo', 'ka', 'kk', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'],
  nr: [1],
  fc: 3
}, {
  lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ['ar'],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ['cs', 'sk'],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ['csb', 'pl'],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ['cy'],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ['fr'],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ['ga'],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ['gd'],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ['is'],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ['jv'],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ['kw'],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ['lt'],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ['lv'],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ['mk'],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ['mnk'],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ['mt'],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ['or'],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ['ro'],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ['sl'],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ['he'],
  nr: [1, 2, 20, 21],
  fc: 22
}];
var _rulesPluralsTypes = {
  1: function _(n) {
    return Number(n > 1);
  },
  2: function _(n) {
    return Number(n != 1);
  },
  3: function _(n) {
    return 0;
  },
  4: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  5: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
  },
  6: function _(n) {
    return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
  },
  7: function _(n) {
    return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  8: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
  },
  9: function _(n) {
    return Number(n >= 2);
  },
  10: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
  },
  11: function _(n) {
    return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
  },
  12: function _(n) {
    return Number(n % 10 != 1 || n % 100 == 11);
  },
  13: function _(n) {
    return Number(n !== 0);
  },
  14: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
  },
  15: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  16: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
  },
  17: function _(n) {
    return Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1);
  },
  18: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
  },
  19: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
  },
  20: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
  },
  21: function _(n) {
    return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
  },
  22: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
  }
};

function createRules() {
  var rules = {};
  sets.forEach(function (set) {
    set.lngs.forEach(function (l) {
      rules[l] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
}

var PluralResolver = function () {
  function PluralResolver(languageUtils) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, PluralResolver);

    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create('pluralResolver');
    this.rules = createRules();
  }

  _createClass(PluralResolver, [{
    key: "addRule",
    value: function addRule(lng, obj) {
      this.rules[lng] = obj;
    }
  }, {
    key: "getRule",
    value: function getRule(code) {
      return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
    }
  }, {
    key: "needsPlural",
    value: function needsPlural(code) {
      var rule = this.getRule(code);
      return rule && rule.numbers.length > 1;
    }
  }, {
    key: "getPluralFormsOfKey",
    value: function getPluralFormsOfKey(code, key) {
      var _this = this;

      var ret = [];
      var rule = this.getRule(code);
      if (!rule) return ret;
      rule.numbers.forEach(function (n) {
        var suffix = _this.getSuffix(code, n);

        ret.push("".concat(key).concat(suffix));
      });
      return ret;
    }
  }, {
    key: "getSuffix",
    value: function getSuffix(code, count) {
      var _this2 = this;

      var rule = this.getRule(code);

      if (rule) {
        var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
        var suffix = rule.numbers[idx];

        if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          if (suffix === 2) {
            suffix = 'plural';
          } else if (suffix === 1) {
            suffix = '';
          }
        }

        var returnSuffix = function returnSuffix() {
          return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
        };

        if (this.options.compatibilityJSON === 'v1') {
          if (suffix === 1) return '';
          if (typeof suffix === 'number') return "_plural_".concat(suffix.toString());
          return returnSuffix();
        } else if (this.options.compatibilityJSON === 'v2') {
          return returnSuffix();
        } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          return returnSuffix();
        }

        return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
      }

      this.logger.warn("no plural rule found for: ".concat(code));
      return '';
    }
  }]);

  return PluralResolver;
}();

var Interpolator = function () {
  function Interpolator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Interpolator);

    this.logger = baseLogger.create('interpolator');
    this.options = options;

    this.format = options.interpolation && options.interpolation.format || function (value) {
      return value;
    };

    this.init(options);
  }

  _createClass(Interpolator, [{
    key: "init",
    value: function init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!options.interpolation) options.interpolation = {
        escapeValue: true
      };
      var iOpts = options.interpolation;
      this.escape = iOpts.escape !== undefined ? iOpts.escape : escape;
      this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;
      this.useRawValueToEscape = iOpts.useRawValueToEscape !== undefined ? iOpts.useRawValueToEscape : false;
      this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
      this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';
      this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
      this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
      this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';
      this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape('$t(');
      this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(')');
      this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ',';
      this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1000;
      this.alwaysFormat = iOpts.alwaysFormat !== undefined ? iOpts.alwaysFormat : false;
      this.resetRegExp();
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.options) this.init(this.options);
    }
  }, {
    key: "resetRegExp",
    value: function resetRegExp() {
      var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
      this.regexp = new RegExp(regexpStr, 'g');
      var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
      this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');
      var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
      this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
    }
  }, {
    key: "interpolate",
    value: function interpolate(str, data, lng, options) {
      var _this = this;

      var match;
      var value;
      var replaces;
      var defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};

      function regexSafe(val) {
        return val.replace(/\$/g, '$$$$');
      }

      var handleFormat = function handleFormat(key) {
        if (key.indexOf(_this.formatSeparator) < 0) {
          var path = getPathWithDefaults(data, defaultData, key);
          return _this.alwaysFormat ? _this.format(path, undefined, lng) : path;
        }

        var p = key.split(_this.formatSeparator);
        var k = p.shift().trim();
        var f = p.join(_this.formatSeparator).trim();
        return _this.format(getPathWithDefaults(data, defaultData, k), f, lng, options);
      };

      this.resetRegExp();
      var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
      var skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables || this.options.interpolation.skipOnVariables;
      var todos = [{
        regex: this.regexpUnescape,
        safeValue: function safeValue(val) {
          return regexSafe(val);
        }
      }, {
        regex: this.regexp,
        safeValue: function safeValue(val) {
          return _this.escapeValue ? regexSafe(_this.escape(val)) : regexSafe(val);
        }
      }];
      todos.forEach(function (todo) {
        replaces = 0;

        while (match = todo.regex.exec(str)) {
          value = handleFormat(match[1].trim());

          if (value === undefined) {
            if (typeof missingInterpolationHandler === 'function') {
              var temp = missingInterpolationHandler(str, match, options);
              value = typeof temp === 'string' ? temp : '';
            } else if (skipOnVariables) {
              value = match[0];
              continue;
            } else {
              _this.logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));

              value = '';
            }
          } else if (typeof value !== 'string' && !_this.useRawValueToEscape) {
            value = makeString(value);
          }

          str = str.replace(match[0], todo.safeValue(value));
          todo.regex.lastIndex = 0;
          replaces++;

          if (replaces >= _this.maxReplaces) {
            break;
          }
        }
      });
      return str;
    }
  }, {
    key: "nest",
    value: function nest(str, fc) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var match;
      var value;

      var clonedOptions = _objectSpread({}, options);

      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;

      function handleHasOptions(key, inheritedOptions) {
        var sep = this.nestingOptionsSeparator;
        if (key.indexOf(sep) < 0) return key;
        var c = key.split(new RegExp("".concat(sep, "[ ]*{")));
        var optionsString = "{".concat(c[1]);
        key = c[0];
        optionsString = this.interpolate(optionsString, clonedOptions);
        optionsString = optionsString.replace(/'/g, '"');

        try {
          clonedOptions = JSON.parse(optionsString);
          if (inheritedOptions) clonedOptions = _objectSpread({}, inheritedOptions, clonedOptions);
        } catch (e) {
          this.logger.warn("failed parsing options string in nesting for key ".concat(key), e);
          return "".concat(key).concat(sep).concat(optionsString);
        }

        delete clonedOptions.defaultValue;
        return key;
      }

      while (match = this.nestingRegexp.exec(str)) {
        var formatters = [];
        var doReduce = false;

        if (match[0].includes(this.formatSeparator) && !/{.*}/.test(match[1])) {
          var r = match[1].split(this.formatSeparator).map(function (elem) {
            return elem.trim();
          });
          match[1] = r.shift();
          formatters = r;
          doReduce = true;
        }

        value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
        if (value && match[0] === str && typeof value !== 'string') return value;
        if (typeof value !== 'string') value = makeString(value);

        if (!value) {
          this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
          value = '';
        }

        if (doReduce) {
          value = formatters.reduce(function (v, f) {
            return _this2.format(v, f, options.lng, options);
          }, value.trim());
        }

        str = str.replace(match[0], value);
        this.regexp.lastIndex = 0;
      }

      return str;
    }
  }]);

  return Interpolator;
}();

function remove(arr, what) {
  var found = arr.indexOf(what);

  while (found !== -1) {
    arr.splice(found, 1);
    found = arr.indexOf(what);
  }
}

var Connector = function (_EventEmitter) {
  _inherits(Connector, _EventEmitter);

  function Connector(backend, store, services) {
    var _this;

    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Connector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Connector).call(this));

    if (isIE10) {
      EventEmitter.call(_assertThisInitialized(_this));
    }

    _this.backend = backend;
    _this.store = store;
    _this.services = services;
    _this.languageUtils = services.languageUtils;
    _this.options = options;
    _this.logger = baseLogger.create('backendConnector');
    _this.state = {};
    _this.queue = [];

    if (_this.backend && _this.backend.init) {
      _this.backend.init(services, options.backend, options);
    }

    return _this;
  }

  _createClass(Connector, [{
    key: "queueLoad",
    value: function queueLoad(languages, namespaces, options, callback) {
      var _this2 = this;

      var toLoad = [];
      var pending = [];
      var toLoadLanguages = [];
      var toLoadNamespaces = [];
      languages.forEach(function (lng) {
        var hasAllNamespaces = true;
        namespaces.forEach(function (ns) {
          var name = "".concat(lng, "|").concat(ns);

          if (!options.reload && _this2.store.hasResourceBundle(lng, ns)) {
            _this2.state[name] = 2;
          } else if (_this2.state[name] < 0) ; else if (_this2.state[name] === 1) {
            if (pending.indexOf(name) < 0) pending.push(name);
          } else {
            _this2.state[name] = 1;
            hasAllNamespaces = false;
            if (pending.indexOf(name) < 0) pending.push(name);
            if (toLoad.indexOf(name) < 0) toLoad.push(name);
            if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
          }
        });
        if (!hasAllNamespaces) toLoadLanguages.push(lng);
      });

      if (toLoad.length || pending.length) {
        this.queue.push({
          pending: pending,
          loaded: {},
          errors: [],
          callback: callback
        });
      }

      return {
        toLoad: toLoad,
        pending: pending,
        toLoadLanguages: toLoadLanguages,
        toLoadNamespaces: toLoadNamespaces
      };
    }
  }, {
    key: "loaded",
    value: function loaded(name, err, data) {
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      if (err) this.emit('failedLoading', lng, ns, err);

      if (data) {
        this.store.addResourceBundle(lng, ns, data);
      }

      this.state[name] = err ? -1 : 2;
      var loaded = {};
      this.queue.forEach(function (q) {
        pushPath(q.loaded, [lng], ns);
        remove(q.pending, name);
        if (err) q.errors.push(err);

        if (q.pending.length === 0 && !q.done) {
          Object.keys(q.loaded).forEach(function (l) {
            if (!loaded[l]) loaded[l] = [];

            if (q.loaded[l].length) {
              q.loaded[l].forEach(function (ns) {
                if (loaded[l].indexOf(ns) < 0) loaded[l].push(ns);
              });
            }
          });
          q.done = true;

          if (q.errors.length) {
            q.callback(q.errors);
          } else {
            q.callback();
          }
        }
      });
      this.emit('loaded', loaded);
      this.queue = this.queue.filter(function (q) {
        return !q.done;
      });
    }
  }, {
    key: "read",
    value: function read(lng, ns, fcName) {
      var _this3 = this;

      var tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 350;
      var callback = arguments.length > 5 ? arguments[5] : undefined;
      if (!lng.length) return callback(null, {});
      return this.backend[fcName](lng, ns, function (err, data) {
        if (err && data && tried < 5) {
          setTimeout(function () {
            _this3.read.call(_this3, lng, ns, fcName, tried + 1, wait * 2, callback);
          }, wait);
          return;
        }

        callback(err, data);
      });
    }
  }, {
    key: "prepareLoading",
    value: function prepareLoading(languages, namespaces) {
      var _this4 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = arguments.length > 3 ? arguments[3] : undefined;

      if (!this.backend) {
        this.logger.warn('No backend was added via i18next.use. Will not load resources.');
        return callback && callback();
      }

      if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
      if (typeof namespaces === 'string') namespaces = [namespaces];
      var toLoad = this.queueLoad(languages, namespaces, options, callback);

      if (!toLoad.toLoad.length) {
        if (!toLoad.pending.length) callback();
        return null;
      }

      toLoad.toLoad.forEach(function (name) {
        _this4.loadOne(name);
      });
    }
  }, {
    key: "load",
    value: function load(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {}, callback);
    }
  }, {
    key: "reload",
    value: function reload(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {
        reload: true
      }, callback);
    }
  }, {
    key: "loadOne",
    value: function loadOne(name) {
      var _this5 = this;

      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      this.read(lng, ns, 'read', undefined, undefined, function (err, data) {
        if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
        if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);

        _this5.loaded(name, err, data);
      });
    }
  }, {
    key: "saveMissing",
    value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

      if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
        this.logger.warn("did not save key \"".concat(key, "\" as the namespace \"").concat(namespace, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
        return;
      }

      if (key === undefined || key === null || key === '') return;

      if (this.backend && this.backend.create) {
        this.backend.create(languages, namespace, key, fallbackValue, null, _objectSpread({}, options, {
          isUpdate: isUpdate
        }));
      }

      if (!languages || !languages[0]) return;
      this.store.addResource(languages[0], namespace, key, fallbackValue);
    }
  }]);

  return Connector;
}(EventEmitter);

function get() {
  return {
    debug: false,
    initImmediate: true,
    ns: ['translation'],
    defaultNS: ['translation'],
    fallbackLng: ['dev'],
    fallbackNS: false,
    whitelist: false,
    nonExplicitWhitelist: false,
    supportedLngs: false,
    nonExplicitSupportedLngs: false,
    load: 'all',
    preload: false,
    simplifyPluralSuffix: true,
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
    partialBundledLanguages: false,
    saveMissing: false,
    updateMissing: false,
    saveMissingTo: 'fallback',
    saveMissingPlurals: true,
    missingKeyHandler: false,
    missingInterpolationHandler: false,
    postProcess: false,
    postProcessPassResolved: false,
    returnNull: true,
    returnEmptyString: true,
    returnObjects: false,
    joinArrays: false,
    returnedObjectHandler: false,
    parseMissingKeyHandler: false,
    appendNamespaceToMissingKey: false,
    appendNamespaceToCIMode: false,
    overloadTranslationOptionHandler: function handle(args) {
      var ret = {};
      if (_typeof(args[1]) === 'object') ret = args[1];
      if (typeof args[1] === 'string') ret.defaultValue = args[1];
      if (typeof args[2] === 'string') ret.tDescription = args[2];

      if (_typeof(args[2]) === 'object' || _typeof(args[3]) === 'object') {
        var options = args[3] || args[2];
        Object.keys(options).forEach(function (key) {
          ret[key] = options[key];
        });
      }

      return ret;
    },
    interpolation: {
      escapeValue: true,
      format: function format(value, _format, lng, options) {
        return value;
      },
      prefix: '{{',
      suffix: '}}',
      formatSeparator: ',',
      unescapePrefix: '-',
      nestingPrefix: '$t(',
      nestingSuffix: ')',
      nestingOptionsSeparator: ',',
      maxReplaces: 1000,
      skipOnVariables: false
    }
  };
}
function transformOptions(options) {
  if (typeof options.ns === 'string') options.ns = [options.ns];
  if (typeof options.fallbackLng === 'string') options.fallbackLng = [options.fallbackLng];
  if (typeof options.fallbackNS === 'string') options.fallbackNS = [options.fallbackNS];

  if (options.whitelist) {
    if (options.whitelist && options.whitelist.indexOf('cimode') < 0) {
      options.whitelist = options.whitelist.concat(['cimode']);
    }

    options.supportedLngs = options.whitelist;
  }

  if (options.nonExplicitWhitelist) {
    options.nonExplicitSupportedLngs = options.nonExplicitWhitelist;
  }

  if (options.supportedLngs && options.supportedLngs.indexOf('cimode') < 0) {
    options.supportedLngs = options.supportedLngs.concat(['cimode']);
  }

  return options;
}

function noop() {}

var I18n = function (_EventEmitter) {
  _inherits(I18n, _EventEmitter);

  function I18n() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, I18n);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(I18n).call(this));

    if (isIE10) {
      EventEmitter.call(_assertThisInitialized(_this));
    }

    _this.options = transformOptions(options);
    _this.services = {};
    _this.logger = baseLogger;
    _this.modules = {
      external: []
    };

    if (callback && !_this.isInitialized && !options.isClone) {
      if (!_this.options.initImmediate) {
        _this.init(options, callback);

        return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
      }

      setTimeout(function () {
        _this.init(options, callback);
      }, 0);
    }

    return _this;
  }

  _createClass(I18n, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      if (options.whitelist && !options.supportedLngs) {
        this.logger.deprecate('whitelist', 'option "whitelist" will be renamed to "supportedLngs" in the next major - please make sure to rename this option asap.');
      }

      if (options.nonExplicitWhitelist && !options.nonExplicitSupportedLngs) {
        this.logger.deprecate('whitelist', 'options "nonExplicitWhitelist" will be renamed to "nonExplicitSupportedLngs" in the next major - please make sure to rename this option asap.');
      }

      this.options = _objectSpread({}, get(), this.options, transformOptions(options));
      this.format = this.options.interpolation.format;
      if (!callback) callback = noop;

      function createClassOnDemand(ClassOrObject) {
        if (!ClassOrObject) return null;
        if (typeof ClassOrObject === 'function') return new ClassOrObject();
        return ClassOrObject;
      }

      if (!this.options.isClone) {
        if (this.modules.logger) {
          baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
        } else {
          baseLogger.init(null, this.options);
        }

        var lu = new LanguageUtil(this.options);
        this.store = new ResourceStore(this.options.resources, this.options);
        var s = this.services;
        s.logger = baseLogger;
        s.resourceStore = this.store;
        s.languageUtils = lu;
        s.pluralResolver = new PluralResolver(lu, {
          prepend: this.options.pluralSeparator,
          compatibilityJSON: this.options.compatibilityJSON,
          simplifyPluralSuffix: this.options.simplifyPluralSuffix
        });
        s.interpolator = new Interpolator(this.options);
        s.utils = {
          hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
        };
        s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
        s.backendConnector.on('*', function (event) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          _this2.emit.apply(_this2, [event].concat(args));
        });

        if (this.modules.languageDetector) {
          s.languageDetector = createClassOnDemand(this.modules.languageDetector);
          s.languageDetector.init(s, this.options.detection, this.options);
        }

        if (this.modules.i18nFormat) {
          s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
          if (s.i18nFormat.init) s.i18nFormat.init(this);
        }

        this.translator = new Translator(this.services, this.options);
        this.translator.on('*', function (event) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          _this2.emit.apply(_this2, [event].concat(args));
        });
        this.modules.external.forEach(function (m) {
          if (m.init) m.init(_this2);
        });
      }

      if (!this.modules.languageDetector && !this.options.lng) {
        this.logger.warn('init: no languageDetector is used and no lng is defined');
      }

      var storeApi = ['getResource', 'addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
      storeApi.forEach(function (fcName) {
        _this2[fcName] = function () {
          var _this2$store;

          return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
        };
      });
      var deferred = defer();

      var load = function load() {
        _this2.changeLanguage(_this2.options.lng, function (err, t) {
          _this2.isInitialized = true;

          _this2.logger.log('initialized', _this2.options);

          _this2.emit('initialized', _this2.options);

          deferred.resolve(t);
          callback(err, t);
        });
      };

      if (this.options.resources || !this.options.initImmediate) {
        load();
      } else {
        setTimeout(load, 0);
      }

      return deferred;
    }
  }, {
    key: "loadResources",
    value: function loadResources(language) {
      var _this3 = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var usedCallback = callback;
      var usedLng = typeof language === 'string' ? language : this.language;
      if (typeof language === 'function') usedCallback = language;

      if (!this.options.resources || this.options.partialBundledLanguages) {
        if (usedLng && usedLng.toLowerCase() === 'cimode') return usedCallback();
        var toLoad = [];

        var append = function append(lng) {
          if (!lng) return;

          var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);

          lngs.forEach(function (l) {
            if (toLoad.indexOf(l) < 0) toLoad.push(l);
          });
        };

        if (!usedLng) {
          var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          fallbacks.forEach(function (l) {
            return append(l);
          });
        } else {
          append(usedLng);
        }

        if (this.options.preload) {
          this.options.preload.forEach(function (l) {
            return append(l);
          });
        }

        this.services.backendConnector.load(toLoad, this.options.ns, usedCallback);
      } else {
        usedCallback(null);
      }
    }
  }, {
    key: "reloadResources",
    value: function reloadResources(lngs, ns, callback) {
      var deferred = defer();
      if (!lngs) lngs = this.languages;
      if (!ns) ns = this.options.ns;
      if (!callback) callback = noop;
      this.services.backendConnector.reload(lngs, ns, function (err) {
        deferred.resolve();
        callback(err);
      });
      return deferred;
    }
  }, {
    key: "use",
    value: function use(module) {
      if (!module) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
      if (!module.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');

      if (module.type === 'backend') {
        this.modules.backend = module;
      }

      if (module.type === 'logger' || module.log && module.warn && module.error) {
        this.modules.logger = module;
      }

      if (module.type === 'languageDetector') {
        this.modules.languageDetector = module;
      }

      if (module.type === 'i18nFormat') {
        this.modules.i18nFormat = module;
      }

      if (module.type === 'postProcessor') {
        postProcessor.addPostProcessor(module);
      }

      if (module.type === '3rdParty') {
        this.modules.external.push(module);
      }

      return this;
    }
  }, {
    key: "changeLanguage",
    value: function changeLanguage(lng, callback) {
      var _this4 = this;

      this.isLanguageChangingTo = lng;
      var deferred = defer();
      this.emit('languageChanging', lng);

      var done = function done(err, l) {
        if (l) {
          _this4.language = l;
          _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);

          _this4.translator.changeLanguage(l);

          _this4.isLanguageChangingTo = undefined;

          _this4.emit('languageChanged', l);

          _this4.logger.log('languageChanged', l);
        } else {
          _this4.isLanguageChangingTo = undefined;
        }

        deferred.resolve(function () {
          return _this4.t.apply(_this4, arguments);
        });
        if (callback) callback(err, function () {
          return _this4.t.apply(_this4, arguments);
        });
      };

      var setLng = function setLng(lngs) {
        var l = typeof lngs === 'string' ? lngs : _this4.services.languageUtils.getBestMatchFromCodes(lngs);

        if (l) {
          if (!_this4.language) {
            _this4.language = l;
            _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);
          }

          if (!_this4.translator.language) _this4.translator.changeLanguage(l);
          if (_this4.services.languageDetector) _this4.services.languageDetector.cacheUserLanguage(l);
        }

        _this4.loadResources(l, function (err) {
          done(err, l);
        });
      };

      if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
        setLng(this.services.languageDetector.detect());
      } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
        this.services.languageDetector.detect(setLng);
      } else {
        setLng(lng);
      }

      return deferred;
    }
  }, {
    key: "getFixedT",
    value: function getFixedT(lng, ns) {
      var _this5 = this;

      var fixedT = function fixedT(key, opts) {
        var options;

        if (_typeof(opts) !== 'object') {
          for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            rest[_key3 - 2] = arguments[_key3];
          }

          options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
        } else {
          options = _objectSpread({}, opts);
        }

        options.lng = options.lng || fixedT.lng;
        options.lngs = options.lngs || fixedT.lngs;
        options.ns = options.ns || fixedT.ns;
        return _this5.t(key, options);
      };

      if (typeof lng === 'string') {
        fixedT.lng = lng;
      } else {
        fixedT.lngs = lng;
      }

      fixedT.ns = ns;
      return fixedT;
    }
  }, {
    key: "t",
    value: function t() {
      var _this$translator;

      return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
    }
  }, {
    key: "exists",
    value: function exists() {
      var _this$translator2;

      return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
    }
  }, {
    key: "setDefaultNamespace",
    value: function setDefaultNamespace(ns) {
      this.options.defaultNS = ns;
    }
  }, {
    key: "hasLoadedNamespace",
    value: function hasLoadedNamespace(ns) {
      var _this6 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!this.isInitialized) {
        this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
        return false;
      }

      if (!this.languages || !this.languages.length) {
        this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
        return false;
      }

      var lng = this.languages[0];
      var fallbackLng = this.options ? this.options.fallbackLng : false;
      var lastLng = this.languages[this.languages.length - 1];
      if (lng.toLowerCase() === 'cimode') return true;

      var loadNotPending = function loadNotPending(l, n) {
        var loadState = _this6.services.backendConnector.state["".concat(l, "|").concat(n)];

        return loadState === -1 || loadState === 2;
      };

      if (options.precheck) {
        var preResult = options.precheck(this, loadNotPending);
        if (preResult !== undefined) return preResult;
      }

      if (this.hasResourceBundle(lng, ns)) return true;
      if (!this.services.backendConnector.backend) return true;
      if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
      return false;
    }
  }, {
    key: "loadNamespaces",
    value: function loadNamespaces(ns, callback) {
      var _this7 = this;

      var deferred = defer();

      if (!this.options.ns) {
        callback && callback();
        return Promise.resolve();
      }

      if (typeof ns === 'string') ns = [ns];
      ns.forEach(function (n) {
        if (_this7.options.ns.indexOf(n) < 0) _this7.options.ns.push(n);
      });
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "loadLanguages",
    value: function loadLanguages(lngs, callback) {
      var deferred = defer();
      if (typeof lngs === 'string') lngs = [lngs];
      var preloaded = this.options.preload || [];
      var newLngs = lngs.filter(function (lng) {
        return preloaded.indexOf(lng) < 0;
      });

      if (!newLngs.length) {
        if (callback) callback();
        return Promise.resolve();
      }

      this.options.preload = preloaded.concat(newLngs);
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "dir",
    value: function dir(lng) {
      if (!lng) lng = this.languages && this.languages.length > 0 ? this.languages[0] : this.language;
      if (!lng) return 'rtl';
      var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'];
      return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
    }
  }, {
    key: "createInstance",
    value: function createInstance() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      return new I18n(options, callback);
    }
  }, {
    key: "cloneInstance",
    value: function cloneInstance() {
      var _this8 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

      var mergedOptions = _objectSpread({}, this.options, options, {
        isClone: true
      });

      var clone = new I18n(mergedOptions);
      var membersToCopy = ['store', 'services', 'language'];
      membersToCopy.forEach(function (m) {
        clone[m] = _this8[m];
      });
      clone.services = _objectSpread({}, this.services);
      clone.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      clone.translator = new Translator(clone.services, clone.options);
      clone.translator.on('*', function (event) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        clone.emit.apply(clone, [event].concat(args));
      });
      clone.init(mergedOptions, callback);
      clone.translator.options = clone.options;
      clone.translator.backendConnector.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      return clone;
    }
  }]);

  return I18n;
}(EventEmitter);

var i18next = new I18n();

function humanFileSize(bytes, si = false) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

/**
 * Creates a new i18next instance that is fully initialized.
 *
 * Call changeLanguage() on the returned object to change the language.
 *
 * @param {object} languages - Mapping from languages to translation objects
 * @param {string} lng - The default language
 * @param {string} fallback - The fallback language to use for unknown languages or untranslated keys
 * @returns {i18next.i18n} A new independent i18next instance
 */
function createInstance(languages, lng, fallback) {
    var options = {
        lng: lng,
        fallbackLng: fallback,
        debug: false,
        initImmediate: false, // Don't init async
        resources: {},
    };

    Object.keys(languages).forEach(function(key) {
        options['resources'][key] = {translation: languages[key]};
    });

    var i18n = i18next.createInstance();
    i18n.init(options);
    console.assert(i18n.isInitialized);

    return i18n;
}

var intro = "Laden Sie mehrere Dateien mit dem Auswahldialog oder durch Ziehen und Fallenlassen in diesem Bereich hoch";
var de = {
	"error-head": "FEHLER: Information",
	"is-forbidden": "ist verboten",
	"troubled-server": "macht Probleme am Server",
	"unknown-problems": "mit unbekanntem Problem",
	"was-not-found": "wurde nicht gefunden",
	"demo-title": "Datei Abgabe Demo",
	"server-required": "Es wird unter der URL <a href=\"{{- url}}\"><tt>{{- url}}</tt></a> ein Server benötigt um die Dateien zu empfangen.",
	intro: intro,
	"upload-label": "Dateiauswahl",
	"upload-disabled-title": "Die Dateiauswahl ist während dem Hochladvorgang gesperrt!",
	"file-source": {
	"modal-select-files": "Dateien auswählen",
	"modal-close": "Dialog schließen",
	"nav-local": "Lokaler Computer"
},
	"file-sink": {
	"local-intro": "{{amount}} Datei(en) als ZIP-Datei herunterladen",
	"local-button": "ZIP-Datei herunterladen",
	"modal-close": "Dialog schließen",
	"nav-local": "Lokaler Computer",
	"upload-success-title": "Erfolgreich hochgeladen",
	"upload-success-body": "Sie haben Ihre Dateien erfolgreich in {{name}} hochgeladen."
},
	"nextcloud-file-picker": {
	open: "Nextcloud",
	"open-nextcloud-file-picker": "Dateien von {{name}} wählen",
	"folder-last": "In das zuletzt ausgewählte Verzeichnis springen",
	"folder-up": "In das übergeordnete Verzeichnis springen",
	"folder-home": "In das Home Verzeichnis springen",
	"select-files": "Dateien auswählen",
	"refresh-nextcloud-file-picker": "Erneut verbinden",
	"loadpath-nextcloud-file-picker": "Das {{name}} Verzeichnis wird geladen",
	"load-path-link": "Gehe zu {{path}}",
	"auth-progress": "Anmeldung läuft",
	"last-modified": "Geändert",
	"mime-type": "Art",
	filename: "Name",
	size: "Größe",
	"init-text-1": "Wählen Sie Ihre Dateien von {{name}}.",
	"init-text-2": "Sie müssen sich zuerst authentifizieren.",
	"auth-info": "Eine neue Seite wird geöffnet, um Ihr Konto zu verbinden.",
	"connect-nextcloud": "{{name}} verbinden",
	"open-in-nextcloud": "In {{name}} öffnen",
	"no-data": "In diesem Ordner befinden sich keine Daten vom benötigten Typ.",
	"select-folder": "In diesem Ordner hochladen",
	"webdav-error": "Etwas ist schief gelaufen",
	"add-folder": "Neuen Ordner erstellen",
	"new-folder-placeholder": "Neuer Ordner",
	"load-in-folder": "Ins aktuelle Verzeichnis laden",
	"load-to-folder": "Im ausgewählten Ordner hochladen"
}
};

var intro$1 = "Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region";
var en = {
	"error-head": "ERROR: information",
	"is-forbidden": "is forbidden",
	"troubled-server": "troubled server",
	"unknown-problems": "with unknown problems",
	"was-not-found": "was not found",
	"demo-title": "File Upload Demo",
	"required-server": "You need an upload server listening at <a href=\"{{- url}}\"><tt>{{- url}}</tt></a> to receive the files...",
	intro: intro$1,
	"upload-label": "Select some files",
	"upload-disabled-title": "The file selection is disabled while uploading!",
	"file-source": {
	"modal-select-files": "Select files",
	"modal-close": "Close dialog",
	"nav-local": "My device"
},
	"file-sink": {
	"local-intro": "Download {{amount}} file(s) as ZIP-file",
	"local-button": "Download ZIP-file",
	"modal-close": "Close dialog",
	"nav-local": "My device",
	"upload-success-title": "Successful uploaded",
	"upload-success-body": "You have successfully uploaded your files to {{name}}."
},
	"nextcloud-file-picker": {
	open: "Nextcloud",
	"open-nextcloud-file-picker": "Select files from your {{name}}",
	"folder-last": "Jump to the last directory",
	"folder-up": "Jump to the home directory",
	"select-files": "Select files",
	"refresh-nextcloud-file-picker": "Connect again",
	"loadpath-nextcloud-file-picker": "Loading directory from {{name}}",
	"load-path-link": "Go to {{path}}",
	"auth-progress": "Authentification in progress",
	"last-modified": "Last modified",
	"mime-type": "Type",
	filename: "Filename",
	size: "Size",
	"init-text-1": "Chose your files from {{name}}.",
	"init-text-2": "You need to authenticate first.",
	"auth-info": "A new page will open to connect your account.",
	"connect-nextcloud": "Connect {{name}}",
	"open-in-nextcloud": "Open in {{name}}",
	"no-data": "No data avaible in this folder.",
	"select-folder": "Upload in selected folder",
	"webdav-error": "Something went wrong",
	"add-folder": "Add new folder",
	"new-folder-placeholder": "New folder",
	"load-in-folder": "Load into the current directory",
	"load-to-folder": "Upload to the selected folder"
}
};

const i18n = createInstance({en: en, de: de}, 'de', 'en');

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (node.hasAttributes()) {
                    const attributes = node.attributes;
                    const { length } = attributes;
                    // Per
                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order.
                    // In particular, Edge/IE can return them out of order, so we cannot
                    // assume a correspondence between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < length; i++) {
                        if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = strings[partIndex];
                        // Find the attribute name
                        const name = lastAttributeNameRegex.exec(stringForPart)[2];
                        // Find the corresponding attribute
                        // All bound attributes have had a suffix added in
                        // TemplateResult#getHTML to opt out of special attribute
                        // handling. To look up the attribute value we also need to add
                        // the suffix.
                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                        const attributeValue = node.getAttribute(attributeLookupName);
                        node.removeAttribute(attributeLookupName);
                        const statics = attributeValue.split(markerRegex);
                        this.parts.push({ type: 'attribute', index, name, strings: statics });
                        partIndex += statics.length - 1;
                    }
                }
                if (node.tagName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const data = node.data;
                if (data.indexOf(marker) >= 0) {
                    const parent = node.parentNode;
                    const strings = data.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        let insert;
                        let s = strings[i];
                        if (s === '') {
                            insert = createMarker();
                        }
                        else {
                            const match = lastAttributeNameRegex.exec(s);
                            if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                s = s.slice(0, match.index) + match[1] +
                                    match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                            }
                            insert = document.createTextNode(s);
                        }
                        parent.insertBefore(insert, node);
                        this.parts.push({ type: 'node', index: ++index });
                    }
                    // If there's no text, we must insert a comment to mark our place.
                    // Else, we can trust it will stick around after cloning.
                    if (strings[lastIndex] === '') {
                        parent.insertBefore(createMarker(), node);
                        nodesToRemove.push(node);
                    }
                    else {
                        node.data = strings[lastIndex];
                    }
                    // We have a part for each match found
                    partIndex += lastIndex;
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                if (node.data === marker) {
                    const parent = node.parentNode;
                    // Add a new marker node to be the startNode of the Part if any of
                    // the following are true:
                    //  * We don't have a previousSibling
                    //  * The previousSibling is already the start of a previous part
                    if (node.previousSibling === null || index === lastPartIndex) {
                        index++;
                        parent.insertBefore(createMarker(), node);
                    }
                    lastPartIndex = index;
                    this.parts.push({ type: 'node', index });
                    // If we don't have a nextSibling, keep this node so we have an end.
                    // Else, we can remove it to save future costs.
                    if (node.nextSibling === null) {
                        node.data = '';
                    }
                    else {
                        nodesToRemove.push(node);
                        index--;
                    }
                    partIndex++;
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        this.parts.push({ type: 'node', index: -1 });
                        partIndex++;
                    }
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
const countNodes = (node) => {
    let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if (isTemplatePartActive(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive = (f) => ((...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
});
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!isTemplatePartActive(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const commentMarker = ` ${marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : nodeMarker);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                    marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable = (value) => {
    return Array.isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = this.parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive(v) || !isIterable(v)) {
                    text += typeof v === 'string' ? v : String(v);
                }
                else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
/**
 * A Part that controls all or part of an attribute value.
 */
class AttributePart {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective(this.value)) {
            const directive = this.value;
            this.value = noChange;
            directive(this);
        }
        if (this.value === noChange) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = createMarker());
        part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof TemplateResult) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable(value)) {
            this.__commitIterable(value);
        }
        else if (value === nothing) {
            this.value = nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = noChange;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // event options not supported
    }
})();
class EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes(container, container.firstChild);
        parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new NodePart(options);
    }
}
const defaultTemplateProcessor = new DefaultTemplateProcessor();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.2.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
}
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
        const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach((template) => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach((s) => {
                    styles.add(s);
                });
                removeNodesFromTemplate(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template ? template.element : document.createElement('template');
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        //
        // ShadyCSS will only update styles containing @apply in the template
        // given to `prepareTemplateStyles`. If no lit Template was given,
        // ShadyCSS will not be able to update uses of @apply in any relevant
        // template. However, this is not a problem because we only create the
        // template for the purpose of supporting `prepareAdoptedCssText`,
        // which doesn't support @apply at all.
        window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
        insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    }
    else {
        content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');
    if (window.ShadyCSS.nativeShadow && style !== null) {
        // When in native Shadow DOM, ensure the style created by ShadyCSS is
        // included in initially rendered output (`renderedDOM`).
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    }
    else if (!!template) {
        // When no style is left in the template, parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // There can be no style in the template in 2 cases (1) when Shady DOM
        // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
        // is in use ShadyCSS removes the style if it contains no content.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        content.insertBefore(condensedStyle, content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        removeNodesFromTemplate(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render$1 = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
    }
    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping = compatibleShadyCSSVersion &&
        container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
        !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = parts.get(renderContainer);
        parts.delete(renderContainer);
        // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
        // that should apply to `renderContainer` even if the rendered value is
        // not a TemplateInstance. However, it will only insert scoped styles
        // into the document if `prepareTemplateStyles` has already been called
        // for the given scope name.
        const template = part.value instanceof TemplateInstance ?
            part.value.template :
            undefined;
        prepareTemplateStyles(scopeName, renderContainer, template);
        removeNodes(container, container.firstChild);
        container.appendChild(renderContainer);
        parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this._updateState = 0;
        this._instanceProperties = undefined;
        // Initialize to an unresolved Promise so we can make sure the element has
        // connected before first update.
        this._updatePromise = new Promise((res) => this._enableUpdatingResolver = res);
        /**
         * Map with keys for any properties that have changed since the last
         * update cycle with previous values.
         */
        this._changedProperties = new Map();
        /**
         * Map with keys of properties that should be reflected when updated.
         */
        this._reflectingProperties = undefined;
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        const descriptor = this.getPropertyDescriptor(name, key, options);
        if (descriptor !== undefined) {
            Object.defineProperty(this.prototype, name, descriptor);
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, _options) {
        return {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this._requestUpdate(name, oldValue);
            },
            configurable: true,
            enumerable: true
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
        return this._classProperties && this._classProperties.get(name) ||
            defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (!superCtor.hasOwnProperty(finalized)) {
            superCtor.finalize();
        }
        this[finalized] = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function') ?
                    Object.getOwnPropertySymbols(props) :
                    []
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ?
            undefined :
            (typeof attribute === 'string' ?
                attribute :
                (typeof name === 'string' ? name.toLowerCase() : undefined));
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute ||
            defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this._requestUpdate();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor
            ._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        // Ensure first connection completes an update. Updates cannot complete
        // before connection.
        this.enableUpdating();
    }
    enableUpdating() {
        if (this._enableUpdatingResolver !== undefined) {
            this._enableUpdatingResolver();
            this._enableUpdatingResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {
    }
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor.getPropertyOptions(propName);
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
                // tslint:disable-next-line:no-any
                ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This private version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    _requestUpdate(name, oldValue) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            const options = ctor.getPropertyOptions(name);
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true &&
                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._updatePromise = this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this._requestUpdate(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this._updatePromise;
        }
        catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return (this._updateState & STATE_UPDATE_REQUESTED);
    }
    get hasUpdated() {
        return (this._updateState & STATE_HAS_UPDATED);
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    _getUpdateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
        this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {
    }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {
    }
}
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement[_a] = true;

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
            // is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
/**
 * Wrap a value for interpolation in a css tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => {
    return new CSSResult(String(value), constructionToken);
};
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.3.1');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};
class LitElement extends UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
        return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Only gather styles once per class
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
            return;
        }
        // Take care not to call `this.getStyles()` multiple times since this
        // generates new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.getStyles();
        if (userStyles === undefined) {
            this._styles = [];
        }
        else if (Array.isArray(userStyles)) {
            // De-duplicate styles preserving the _last_ instance in the set.
            // This is a performance optimization to avoid duplicated styles that can
            // occur especially when composing via subclassing.
            // The last item is kept to try to preserve the cascade order with the
            // assumption that it's most important that last added styles override
            // previous styles.
            const addStyles = (styles, set) => styles.reduceRight((set, s) => 
            // Note: On IE set.add() does not return the set
            Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
            // Array.from does not work on Set in IE, otherwise return
            // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
            const set = addStyles(userStyles, new Set());
            const styles = [];
            set.forEach((v) => styles.unshift(v));
            this._styles = styles;
        }
        else {
            this._styles = [userStyles];
        }
    }
    /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */
    initialize() {
        super.initialize();
        this.constructor._getUniqueStyles();
        this.renderRoot =
            this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    /**
     * Applies styling to the element shadowRoot using the `static get styles`
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it.
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
        }
        else if (supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets =
                styles.map((s) => s.styleSheet);
        }
        else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const templateResult = this.render();
        super.update(changedProperties);
        // If render is not implemented by the component, don't call lit-html render
        if (templateResult !== renderNotImplemented) {
            this.constructor
                .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach((s) => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's NodePart - typically a TemplateResult.
     * Setting properties inside this method will *not* trigger the element to
     * update.
     */
    render() {
        return renderNotImplemented;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */
LitElement['finalized'] = true;
/**
 * Render method used to render the value to the element's DOM.
 * @param result The value to render.
 * @param container Node into which to render.
 * @param options Element name.
 * @nocollapse
 */
LitElement.render = render$1;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// For each part, remember the value that was last rendered to the part by the
// unsafeHTML directive, and the DocumentFragment that was last set as a value.
// The DocumentFragment is used as a unique key to check if the last value
// rendered to the part was with unsafeHTML. If not, we'll always re-render the
// value passed to unsafeHTML.
const previousValues = new WeakMap();
/**
 * Renders the result as HTML, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */
const unsafeHTML = directive((value) => (part) => {
    if (!(part instanceof NodePart)) {
        throw new Error('unsafeHTML can only be used in text bindings');
    }
    const previousValue = previousValues.get(part);
    if (previousValue !== undefined && isPrimitive(value) &&
        value === previousValue.value && part.value === previousValue.fragment) {
        return;
    }
    const template = document.createElement('template');
    template.innerHTML = value; // innerHTML casts to string internally
    const fragment = document.importNode(template.content, true);
    part.setValue(fragment);
    previousValues.set(part, { value, fragment });
});

const appliedClassMixins = new WeakMap();

function getPrototypeChain(obj) {
  const chain = [];
  let proto = obj;
  while (proto) {
    chain.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  return chain;
}

function wasApplied(mixin, superClass) {
  const classes = getPrototypeChain(superClass);
  for (const klass of classes) {
    if (appliedClassMixins.get(klass) === mixin) {
      return true;
    }
  }
  return false;
}

function dedupeMixin(mixin) {
  return superClass => {
    if (wasApplied(mixin, superClass)) {
      return superClass;
    }
    const mixedClass = mixin(superClass);
    appliedClassMixins.set(mixedClass, mixin);
    return mixedClass;
  };
}

/**
 * Global counter to scope the custom elements
 *
 * @type {number}
 */
let counter = Math.round(Math.random() * 100000);

/**
 * Allowed tag name chars
 *
 * @type {string}
 */
const chars = `-|\\.|[0-9]|[a-z]`;

/**
 * Regular expression to check if a value is a valid tag name
 *
 * @type {RegExp}
 */
const tagRegExp = new RegExp(`[a-z](${chars})*-(${chars})*`);

/**
 * Checks if the tag name is valid
 *
 * @param {string} tag
 * @returns {boolean}
 */
const isValid = tag => tagRegExp.exec(tag) !== null;

/**
 * Checks if the tag is already registered
 *
 * @param {string} name
 * @param {CustomElementRegistry} registry
 * @returns {boolean}
 */
const isTagRegistered = (name, registry) => !!registry.get(name);

/**
 * Given a tag name scopes it with a number suffix
 *
 * @param {string} tagName
 * @param {CustomElementRegistry} registry
 * @returns {string} scoped tag name
 */
const incrementTagName = (tagName, registry) => {
  const newTagName = `${tagName}-${(counter += 1)}`;

  if (isTagRegistered(newTagName, registry)) {
    return incrementTagName(tagName, registry);
  }

  return newTagName;
};

/**
 * Creates a unique scoped tag name
 *
 * @exports
 * @param {string} tagName - tag name to scope
 * @param {CustomElementRegistry} registry
 * @returns {string} scoped tag name
 */
function createUniqueTag(tagName, registry = customElements) {
  if (!isValid(tagName)) {
    throw new Error('tagName is invalid');
  }

  return incrementTagName(tagName, registry);
}

/**
 * The global cache for tag names
 *
 * @type {Map<typeof HTMLElement, string>}
 */
const globalTagsCache = new Map();

/**
 * Adds a tag to the global tags cache
 *
 * @param {string} tag
 * @param {typeof HTMLElement} klass
 */
const addToGlobalTagsCache = (tag, klass) => globalTagsCache.set(klass, tag);

/**
 * Gets a tag from the global tags cache
 *
 * @exports
 * @param {typeof HTMLElement} klass
 * @returns {undefined|string}
 */
const getFromGlobalTagsCache = klass => globalTagsCache.get(klass);

/**
 * Checks if klass is a subclass of HTMLElement
 *
 * @param {typeof HTMLElement} klass
 * @returns {boolean}
 */
const extendsHTMLElement = klass => Object.prototype.isPrototypeOf.call(HTMLElement, klass);

/**
 * Defines a custom element
 *
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {CustomElementRegistry} registry
 */
const defineElement = (tagName, klass, registry = customElements) => {
  addToGlobalTagsCache(tagName, klass);
  registry.define(tagName, class extends klass {});
};

/**
 * Stores a lazy element in the cache to be used in future
 *
 * @param {string} tagName
 * @param {CustomElementRegistry} registry
 * @param {Map<string, string>} tagsCache
 * @returns {string}
 */
const storeLazyElementInCache = (tagName, registry, tagsCache) => {
  const tag = createUniqueTag(tagName, registry);

  if (!tagsCache) {
    throw new Error('Lazy scoped elements requires the use of tags cache');
  }

  tagsCache.set(tagName, tag);

  return tag;
};

/**
 * Define a scoped custom element storing the scoped tag name in the cache
 *
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {Map<string, string>} tagsCache
 * @returns {string}
 */
const defineElementAndStoreInCache = (tagName, klass, tagsCache) => {
  const registry = customElements;

  if (!extendsHTMLElement(klass)) {
    return storeLazyElementInCache(tagName, registry, tagsCache);
  }

  if (klass === customElements.get(tagName)) {
    addToGlobalTagsCache(tagName, klass);

    return tagName;
  }

  const tag = createUniqueTag(tagName, registry);
  // @ts-ignore
  // we extend it just in case the class has been defined manually
  defineElement(tag, klass, registry);

  return tag;
};

/**
 * Gets a scoped tag name from the cache or generates a new one and defines the element if needed
 *
 * @exports
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {Map<string, string>} tagsCache
 * @returns {string}
 */
function registerElement(tagName, klass, tagsCache = undefined) {
  const tag =
    getFromGlobalTagsCache(klass) ||
    (tagsCache && tagsCache.get(tagName)) ||
    defineElementAndStoreInCache(tagName, klass, tagsCache);

  return tag;
}

/**
 * Defines a lazy element
 *
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {Map<string, string>} tagsCache
 */
function defineScopedElement(tagName, klass, tagsCache) {
  const tag = tagsCache.get(tagName);

  if (tag) {
    if (customElements.get(tag) === undefined) {
      defineElement(tag, klass, customElements);
    }
  } else {
    tagsCache.set(tagName, registerElement(tagName, klass, tagsCache));
  }
}

/**
 * @typedef {import('./types').ScopedElementsMap} ScopedElementsMap
 */

/**
 * Allowed tag name chars
 *
 * @type {string}
 */
const chars$1 = `-|\\.|[0-9]|[a-z]`;

/**
 * Regular Expression to find a custom element tag
 *
 * @type {RegExp}
 */
const re = new RegExp(`<\\/?([a-z](${chars$1})*-(${chars$1})*)`, 'g');

/**
 * The global cache of processed string arrays
 *
 * @type {Map<TemplateStringsArray, TemplateStringsArray>}
 */
const globalCache = new Map();

/**
 * Find custom element tags in the string
 *
 * @param {string} str
 * @returns {RegExpExecArray[]}
 */
const matchAll = str => {
  const matches = [];
  let result;
  // eslint-disable-next-line no-cond-assign
  while ((result = re.exec(str)) !== null) {
    matches.push(result);
  }

  return matches;
};

/**
 * Transforms a string array into another one with resolved scoped elements and caches it for future references
 *
 * @param {TemplateStringsArray} strings
 * @param {ScopedElementsMap} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Map<string, string>} tagsCache
 * @returns {TemplateStringsArray}
 */
const transformTemplate = (strings, scopedElements, templateCache, tagsCache) => {
  const transformedStrings = strings.map(str => {
    let acc = str;
    const matches = matchAll(str);

    for (let i = matches.length - 1; i >= 0; i -= 1) {
      const item = matches[i];
      const klass = scopedElements[item[1]];
      const tag = registerElement(item[1], klass, tagsCache);
      const start = item.index + item[0].length - item[1].length;
      const end = start + item[1].length;

      acc = acc.slice(0, start) + tag + acc.slice(end);
    }

    return acc;
  });

  // @ts-ignore
  // noinspection JSCheckFunctionSignatures
  templateCache.set(strings, transformedStrings);

  // @ts-ignore
  // noinspection JSValidateTypes
  return transformedStrings;
};

/**
 * Obtains the cached strings array with resolved scoped elements or creates it
 *
 * @exports
 * @param {TemplateStringsArray} strings
 * @param {ScopedElementsMap} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Map<string, string>} tagsCache
 * @returns {TemplateStringsArray}
 */
function transform(strings, scopedElements, templateCache = globalCache, tagsCache) {
  return (
    templateCache.get(strings) ||
    transformTemplate(strings, scopedElements, templateCache, tagsCache)
  );
}

const getTemplateCacheKey$1 = (type, scopeName) => `${type}--${scopeName}`;

let compatibleShadyCSSVersion$1 = true;

// @ts-ignore
const { ShadyCSS } = window;

if (typeof ShadyCSS === 'undefined') {
  compatibleShadyCSSVersion$1 = false;
} else if (typeof ShadyCSS.prepareTemplateDom === 'undefined') {
  compatibleShadyCSSVersion$1 = false;
}

/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory$1 = scopeName => result => {
  const cacheKey = getTemplateCacheKey$1(result.type, scopeName);
  let templateCache = templateCaches.get(cacheKey);
  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map(),
    };
    templateCaches.set(cacheKey, templateCache);
  }
  let template = templateCache.stringsArray.get(result.strings);
  if (template !== undefined) {
    return template;
  }
  const key = result.strings.join(marker);
  template = templateCache.keyString.get(key);
  if (template === undefined) {
    const element = result.getTemplateElement();
    if (compatibleShadyCSSVersion$1) {
      ShadyCSS.prepareTemplateDom(element, scopeName);
    }
    template = new Template(result, element);
    templateCache.keyString.set(key, template);
  }
  templateCache.stringsArray.set(result.strings, template);
  return template;
};

/* eslint-disable no-use-before-define */

/**
 * @typedef {import('./types').ScopedElementsMixin} ScopedElementsMixin
 * @typedef {import('./types').ScopedElementsMap} ScopedElementsMap
 * @typedef {import("lit-element").LitElement} LitElement
 * @typedef {import('lit-html/lib/shady-render').ShadyRenderOptions} ShadyRenderOptions
 * @typedef {function(TemplateResult, Element|DocumentFragment|ShadowRoot, ShadyRenderOptions): void} RenderFunction
 */

/**
 * Template caches
 *
 * @type {WeakMap<Function, Map<TemplateStringsArray, TemplateStringsArray>>}
 */
const templateCaches$1 = new WeakMap();

/**
 * Retrieves or creates a templateCache for a specific key
 *
 * @param {Function} key
 * @returns {Map<TemplateStringsArray, TemplateStringsArray>}
 */
const getTemplateCache = key => {
  if (!templateCaches$1.has(key)) {
    templateCaches$1.set(key, new Map());
  }

  return templateCaches$1.get(key);
};

/**
 * Tags caches
 *
 * @type {WeakMap<object, Map<string, string>>}
 */
const tagsCaches = new WeakMap();

/**
 * Retrieves or creates a tagsCache for a specific key
 * @param {object} key
 * @returns {Map<string, string>}
 */
const getTagsCache = key => {
  if (!tagsCaches.has(key)) {
    tagsCaches.set(key, new Map());
  }

  return tagsCaches.get(key);
};

/**
 * Transforms an array of TemplateResults or arrays into another one with resolved scoped elements
 *
 * @param {ReadonlyArray} items
 * @param {ScopedElementsMap} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Map<string, string>} tagsCache
 * @returns {ReadonlyArray}
 */
const transformArray = (items, scopedElements, templateCache, tagsCache) =>
  items.map(value => {
    if (value instanceof TemplateResult) {
      return transformTemplate$1(value, scopedElements, templateCache, tagsCache);
    }

    if (Array.isArray(value)) {
      return transformArray(value, scopedElements, templateCache, tagsCache);
    }

    return value;
  });

/**
 * Transforms a TemplateResult into another one with resolved scoped elements
 *
 * @param {TemplateResult} template
 * @param {ScopedElementsMap} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Map<string, string>} tagsCache
 * @returns {TemplateResult}
 */
const transformTemplate$1 = (template, scopedElements, templateCache, tagsCache) =>
  new TemplateResult(
    transform(template.strings, scopedElements, templateCache, tagsCache),
    transformArray(template.values, scopedElements, templateCache, tagsCache),
    template.type,
    template.processor,
  );

/**
 * Gets an instance of the ScopedElementsTemplateFactory
 *
 * @param {string} scopeName
 * @param {ScopedElementsMap} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Map<string, string>} tagsCache
 * @returns {function(any): any}
 */
const scopedElementsTemplateFactory = (
  scopeName,
  scopedElements,
  templateCache,
  tagsCache,
) => template => {
  const newTemplate = transformTemplate$1(template, scopedElements, templateCache, tagsCache);

  return shadyTemplateFactory$1(scopeName)(newTemplate);
};

/** @type {ScopedElementsMixin} */
const ScopedElementsMixinImplementation = superclass =>
  class ScopedElementsHost extends superclass {
    /**
     * Obtains the scoped elements definitions map
     *
     * @returns {ScopedElementsMap}
     */
    static get scopedElements() {
      return {};
    }

    /** @override */
    static render(template, container, options) {
      if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
      }
      const { scopeName } = options;

      const templateCache = getTemplateCache(this);
      const tagsCache = getTagsCache(this);
      const { scopedElements } = this;

      return super.render(template, container, {
        ...options,
        templateFactory: scopedElementsTemplateFactory(
          scopeName,
          scopedElements,
          templateCache,
          tagsCache,
        ),
      });
    }

    /**
     * Defines a scoped element
     *
     * @param {string} tagName
     * @param {typeof HTMLElement} klass
     */
    defineScopedElement(tagName, klass) {
      return defineScopedElement(tagName, klass, getTagsCache(this.constructor));
    }

    /**
     * Returns a scoped tag name
     *
     * @param {string} tagName
     * @returns {string|undefined}
     */
    static getScopedTagName(tagName) {
      const klass = this.scopedElements[tagName];

      return klass
        ? registerElement(tagName, klass, getTagsCache(this))
        : getTagsCache(this).get(tagName);
    }
  };

const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);

class DBPLitElement extends LitElement {
    _(selector) {
        return this.shadowRoot === null ? this.querySelector(selector) : this.shadowRoot.querySelector(selector);
    }
}

/**
 * Like customElements.define() but tries to display an error in case the browser doesn't
 * support everything we need.
 *
 * Returns false in case define failed, true otherwise.
 *
 * @returns {boolean}
 */

/**
 * 
 * @param {string} name 
 * @param {Function} constructor 
 * @param {object} options 
 */
const defineCustomElement = (name, constructor, options) => {
    // In case the constructor is already defined just do nothing
    if (customElements.get(name) === constructor) {
        return true;
    }
    // Checks taken from https://github.com/webcomponents/webcomponentsjs/blob/master/webcomponents-loader.js
    if (!('attachShadow' in Element.prototype && 'getRootNode' in Element.prototype && window.customElements)) {
        var elements = document.getElementsByTagName(name);
        for(var i=0; i < elements.length; i++) {
            elements[i].innerHTML = "<span style='border: 1px solid red; font-size: 0.8em; "
                + "opacity: 0.5; padding: 0.2em;'>☹ Your browser is not supported ☹</span>";
        }
       return false;
    }
    customElements.define(name, constructor, options);
    return true;
};

/**
 * Get an absolute path for assets given a relative path to the js bundle.
 *
 * @param {string} pkg The package which provides the asset
 * @param {string} path The relative path based on the js bundle path
 */
const getAssetURL = (pkg, path) => {
    let fullPath = '';
    if (path === undefined) {
        // backwards compat: in case only one parameter is passed
        // assume it is a full path
        fullPath = pkg;
    } else {
        fullPath = 'local/' + pkg + '/' + path;
    }
    return new URL(fullPath, new URL('..', import.meta.url).href).href;
};

/**
 * Doing a async foreach for non-linear integer keys
 *
 * @param array
 * @param callback
 * @returns {Promise<void>}
 */
async function asyncObjectForEach(array, callback) {
    const keys = Object.keys(array);

    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        await callback(array[key], key, array);
    }
}

/**
 * Doing a async foreach for linear integer keys
 *
 * @param array
 * @param callback
 * @returns {Promise<void>}
 */
async function asyncArrayForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

/**
 * Attempts to determine the mime type of a file or blob
 *
 * @param file
 * @returns {Promise<unknown>}
 */
async function getMimeTypeOfFile(file) {
    const getMimeType = (signature) => {
        switch (signature) {
            case '89504E47':
                return 'image/png'
            case '47494638':
                return 'image/gif'
            case '25504446':
                return 'application/pdf'
            case 'FFD8FFDB':
            case 'FFD8FFE0':
            case 'FFD8FFE1':
                return 'image/jpeg'
            case '504B0304':
                return 'application/zip'
            default:
                return 'Unknown filetype'
        }
    };

    return await new Promise((resolve) => {
        let fileReader = new FileReader();

        fileReader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
                const uint = new Uint8Array(evt.target.result);
                let bytes = [];

                uint.forEach((byte) => {
                    bytes.push(byte.toString(16));
                });

                const hex = bytes.join('').toUpperCase();
                const mimeType = getMimeType(hex);

                resolve(mimeType);
            }
        };

        fileReader.readAsArrayBuffer(file.slice(0, 4));
    });
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const _state = new WeakMap();
// Effectively infinity, but a SMI.
const _infinity = 0x7fffffff;
/**
 * Renders one of a series of values, including Promises, to a Part.
 *
 * Values are rendered in priority order, with the first argument having the
 * highest priority and the last argument having the lowest priority. If a
 * value is a Promise, low-priority values will be rendered until it resolves.
 *
 * The priority of values can be used to create placeholder content for async
 * data. For example, a Promise with pending content can be the first,
 * highest-priority, argument, and a non_promise loading indicator template can
 * be used as the second, lower-priority, argument. The loading indicator will
 * render immediately, and the primary content will render when the Promise
 * resolves.
 *
 * Example:
 *
 *     const content = fetch('./content.txt').then(r => r.text());
 *     html`${until(content, html`<span>Loading...</span>`)}`
 */
const until = directive((...args) => (part) => {
    let state = _state.get(part);
    if (state === undefined) {
        state = {
            lastRenderedIndex: _infinity,
            values: [],
        };
        _state.set(part, state);
    }
    const previousValues = state.values;
    let previousLength = previousValues.length;
    state.values = args;
    for (let i = 0; i < args.length; i++) {
        // If we've rendered a higher-priority value already, stop.
        if (i > state.lastRenderedIndex) {
            break;
        }
        const value = args[i];
        // Render non-Promise values immediately
        if (isPrimitive(value) ||
            typeof value.then !== 'function') {
            part.setValue(value);
            state.lastRenderedIndex = i;
            // Since a lower-priority value will never overwrite a higher-priority
            // synchronous value, we can stop processing now.
            break;
        }
        // If this is a Promise we've already handled, skip it.
        if (i < previousLength && value === previousValues[i]) {
            continue;
        }
        // We have a Promise that we haven't seen before, so priorities may have
        // changed. Forget what we rendered before.
        state.lastRenderedIndex = _infinity;
        previousLength = 0;
        Promise.resolve(value).then((resolvedValue) => {
            const index = state.values.indexOf(value);
            // If state.values doesn't contain the value, we've re-rendered without
            // the value, so don't render it. Then, only render if the value is
            // higher-priority than what's already been rendered.
            if (index > -1 && index < state.lastRenderedIndex) {
                state.lastRenderedIndex = index;
                part.setValue(resolvedValue);
                part.commit();
            }
        });
    }
});

// Use in case the icon fails to load
const errorIcon = `
<svg version="1.1" id="Layer_2_1_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
<g>
	<path d="M38.2,98.7c-1.1,0-2.2-0.6-2.8-1.6c-0.5-0.8-0.6-1.8-0.3-2.6l8.9-37.8H24.5c-1.2,0-2.2-0.6-2.8-1.5c-0.6-1-0.7-2.2-0.1-3.2
		l0.2-0.3L54.9,3.1c0.9-1.6,2.3-1.8,2.8-1.8c1.1,0,2.2,0.6,2.8,1.6c0.5,0.8,0.6,1.7,0.3,2.6l-6.9,30.4L75.6,36
		c1.1,0,2.2,0.6,2.8,1.5c0.6,1,0.7,2.2,0.1,3.2l-0.2,0.3L40.8,97.4l-0.2,0.2C40.3,97.9,39.5,98.7,38.2,98.7z M28.6,51.2h18.1
		c1.8,0,3.2,1.5,3.2,3.4v0.3l-6.8,29l28.2-42.4l-20.3-0.1c-1.8,0-3.2-1.5-3.2-3.4v-0.3l5-21.9L28.6,51.2z M75.5,41.5
		C75.5,41.5,75.5,41.5,75.5,41.5L75.5,41.5z M51.1,35.9L51.1,35.9C51.2,35.9,51.1,35.9,51.1,35.9z"/>
</g>
</svg>
`;

function getIconSVGURL(name) {
    return getAssetURL('dbp-common', 'icons/' + encodeURI(name) + '.svg');
}

async function getSVGTextElement(name) {
    const iconURL = getIconSVGURL(name);

    const response = await fetch(iconURL);
    if (!response.ok) {
        return unsafeHTML(errorIcon);
    }
    let text = await response.text();
    if (text.indexOf('<svg') === -1) {
        return unsafeHTML(errorIcon);
    }
    text = text.slice(text.indexOf('<svg'));
    return unsafeHTML(text);
}

const iconCache =  {};

/**
 * Avoid lots of requests in case an icon is used multiple times on the same page.
 *
 * @param {string} name
 */
async function getSVGTextElementCached(name) {
    if (iconCache[name] === undefined) {
        let promise = getSVGTextElement(name);
        iconCache[name] = promise;
        return promise;
    } else {
        return iconCache[name];
    }
}

/**
 * For icon names see https://lineicons.com
 */
class Icon extends LitElement {

    constructor() {
        super();
        this.name = "bolt";
    }

    static get properties() {
        return { 
          name: { type: String },
        };
      }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                height: 1em;
                top: .125em;
                position: relative;
            }

            svg {
                height: 100%;
            }

            svg * {
                fill: currentColor;
            }
        `;
    } 

    render() {
        let svg = getSVGTextElementCached(this.name);
        return html`
            ${until(svg)}
        `;
    }
}

class MiniSpinner extends LitElement {
    constructor() {
        super();
        this.text = "";
    }

    static get properties() {
        return {
            text: { type: String },
        };
    }

    static get styles() {
        // language=css
        return css`
        .outer {
            display: inline-block;
        }
        .inner {
            display: flex;
        }
        .ring {
          display: inline-block;
          position: relative;
          width: 1em;
          height: 1em;
        }
        .ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          border: 0.2em solid currentColor;
          border-radius: 50%;
          animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: currentColor transparent transparent transparent;
        }
        .ring div:nth-child(1) {
          animation-delay: -0.45s;
        }
        .ring div:nth-child(2) {
          animation-delay: -0.3s;
        }
        .ring div:nth-child(3) {
          animation-delay: -0.15s;
        }
        @keyframes ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .text {
            display: inline-block;
            margin-left: 0.5em;
            font-size: 0.7em;
        }`;
    } 

    render() {
        const textHtml = this.text !== "" ? html`<div class="text">${this.text}</div>` : html``;

        return html`<div class="outer"><div class="inner"><div class="ring"><div></div><div></div><div></div><div></div></div>${textHtml}</div></div>`;
    }
}

/**
 * We want to have "neutral" colors here
 *
 * @returns {CSSResult}
 */
function getThemeCSS() {
    // language=css
    return css`
        :host {
            --dbp-primary-bg-color: var(--dbp-override-primary-bg-color, #007bff);
            --dbp-primary-text-color: var(--dbp-override-primary-text-color, #fff);
            --dbp-primary-button-border: var(--dbp-override-primary-button-border, #007bff);
            --dbp-secondary-bg-color: var(--dbp-override-secondary-bg-color, #6c757d);
            --dbp-secondary-text-color: var(--dbp-override-secondary-text-color, #fff);
            --dbp-info-bg-color: var(--dbp-override-info-bg-color, #17a2b8);
            --dbp-info-text-color: var(--dbp-override-info-text-color, #fff);
            --dbp-success-bg-color: var(--dbp-override-success-bg-color, #28a745);
            --dbp-success-text-color: var(--dbp-override-success-text-color, #fff);
            --dbp-warning-bg-color: var(--dbp-override-warning-bg-color, #ffc107);
            --dbp-warning-text-color: var(--dbp-override-warning-text-color, #343a40);
            --dbp-danger-bg-color: var(--dbp-override-danger-bg-color, #dc3545);
            --dbp-danger-text-color: var(--dbp-override-danger-text-color, #fff);
            --dbp-light: var(--dbp-override-light, #f8f9fa);
            --dbp-dark: var(--dbp-override-dark, #343a40);
            --dbp-muted-text: var(--dbp-override-muted-text, #6c757d);
            --dbp-border-radius: var(--dbp-override-border-radius, 0px);
            --dbp-border-width: var(--dbp-override-border-width, 1px);
            --dbp-placeholder-color: #777; 
        }
    `;
}

function getGeneralCSS(doMarginPaddingReset = true) {
    // language=css
    const marginPaddingResetCss = doMarginPaddingReset ? css`
        blockquote, body, dd, dl, dt, fieldset, figure, h1, h2, h3, h4, h5, h6, hr, html, iframe, legend, li, ol, p, pre, textarea, ul {
            margin: 0;
            padding: 0;
        }
    ` : css``;

    // language=css
    return css`
        h2 {
            font-weight: 300;
        }

        code {
            background-color: var(--dbp-light);
            color: var(--dbp-danger-bg-color);
            font-size: 1em;
            line-height: 1.5em;
            font-weight: normal;
            padding: 0.25em 0.5em 0.25em;
        }

        .field:not(:last-child) {
            margin-bottom: 0.75rem;
        }

        .field.has-addons {
            display: flex;
            justify-content: flex-start;
        }

        .input, .textarea, .select select {
            border: solid 1px #aaa;
            border-radius: var(--dbp-border-radius);
            padding-bottom: calc(.375em - 1px);
            padding-left: calc(.625em - 1px);
            padding-right: calc(.625em - 1px);
            padding-top: calc(.375em - 1px);
        }

        .input::placeholder, .textarea::placeholder, .select select::placeholder {
            color: var(--dbp-placeholder-color);
        }

        input, ::placeholder, textarea, select, .select select {
            font-size: inherit;
            font-family: inherit;
        }

        .control {
            box-sizing: border-box;
            clear: both;
            font-size: 1rem;
            position: relative;
            text-align: left;
        }

        .label {
            margin-bottom: .5em;
            display: block;
            font-weight: 600;
        }

        .hidden { display: none; }

        a {
            color: var(--dbp-override-muted-text);
            cursor: pointer;
            text-decoration: none;
        }

        a.is-download {
            border-bottom: 1px solid rgba(0,0,0,0.4);
            transition: background-color 0.15s, color 0.15s;
        }

        a.is-download:hover {
            color: #fff;
            background-color: #000;
        }

        /* Inline SVG don't work in our web-components */
        /*
        a.is-download:after, a.is-download:hover:after {
            content: "\\00a0\\00a0\\00a0\\00a0";
            background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%228.3021mm%22%20width%3D%228.2977mm%22%20version%3D%221.1%22%20xmlns%3Acc%3D%22http%3A%2F%2Fcreativecommons.org%2Fns%23%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20viewBox%3D%220%200%2029.401607%2029.41681%22%3E%3Cg%20style%3D%22stroke-width%3A2.1%22%20transform%3D%22translate(-271.68%20-367.92)%22%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-width%3A2.1%3Bfill%3Anone%22%20d%3D%22m300.13%20390.41v2.3918c0%201.9813-1.6064%203.5877-3.5877%203.5877h-20.326c-1.9813%200-3.5877-1.6064-3.5877-3.5877v-2.3918%22%2F%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-width%3A2.1%3Bfill%3Anone%22%20d%3D%22m286.38%20390.27v-21.384%22%2F%3E%3Cpath%20style%3D%22stroke-linejoin%3Around%3Bstroke%3A%23000%3Bstroke-linecap%3Around%3Bstroke-width%3A2.1%3Bfill%3Anone%22%20d%3D%22m295.13%20381.52-8.7501%208.7462-8.7501-8.7462%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
            margin: 0 0.25% 0 1.5%;
            font-size: 94%;
        }
        */

        .title {
            color: #363636;
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.125;
        }

        ${marginPaddingResetCss}

        .button[disabled], .file-cta[disabled], .file-name[disabled], .input[disabled], .pagination-ellipsis[disabled],
        .pagination-link[disabled], .pagination-next[disabled], .pagination-previous[disabled], .select fieldset[disabled] select,
        .select select[disabled], .textarea[disabled], fieldset[disabled] .button, fieldset[disabled] .file-cta,
        fieldset[disabled] .file-name, fieldset[disabled] .input, fieldset[disabled] .pagination-ellipsis,
        fieldset[disabled] .pagination-link, fieldset[disabled] .pagination-next, fieldset[disabled] .pagination-previous,
        fieldset[disabled] .select select, fieldset[disabled] .textarea {
            cursor: not-allowed;
        }

        .input, .select select, .textarea {
            background-color: #fff;
            border-color: var(--dbp-muted);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-muted);
        }

        *, ::after, ::before {
            box-sizing: inherit;
        }

        select:not(.select) {
            -moz-appearance: none;
            -webkit-appearance: none;
            background: calc(100% - 0.2rem) center no-repeat url("${unsafeCSS(getIconSVGURL('chevron-down'))}");
            background-size: 25%;
            border-color: black;
            border-width: 1px;
            border-radius: var(--dbp-border-radius);
            color: black;
            padding: 0.14rem 1.0rem 0.14rem 0.14rem;
            border-style: solid;
        }
    `;
}

function getButtonCSS() {
    // language=css
    return css`
        button.button, .button, button.dt-button {
            border-style: solid;
            border-color: black;
            border-width: 1px;
            border-radius: var(--dbp-border-radius);
            color: black;
            cursor: pointer;
            justify-content: center;
            padding-bottom: calc(0.375em - 1px);
            padding-left: 0.75em;
            padding-right: 0.75em;
            padding-top: calc(0.375em - 1px);
            text-align: center;
            white-space: nowrap;
            font-size: inherit;
            font-family: inherit;
            transition: background-color 0.15s ease 0s, color 0.15s ease 0s;
            background: none;
        }

        button.button:hover, .button:hover, button.dt-button:hover, button.dt-button:hover:not(.disabled) {
            color: white;
            background: none;
            background-color: black;
        }

        button.button.is-small, .button.is-small {
            border-radius: calc(var(--dbp-border-radius) / 2);
            font-size: .75rem;
        }

        button.button.is-primary, .button.is-primary {
            background-color: var(--dbp-primary-bg-color);
            border: var(--dbp-primary-button-border);
            color: var(--dbp-primary-text-color);
        }

        button.button.is-info, .button.is-info {
            background-color: var(--dbp-info-bg-color);
            color: var(--dbp-info-text-color);
        }

        button.button.is-success, .button.is-success {
            background-color: var(--dbp-success-bg-color);
            color: var(--dbp-success-text-color);
        }

        button.button.is-warning, .button.is-warning {
            background-color: var(--dbp-warning-bg-color);
            color: var(--dbp-warning-text-color);
        }

        .button.button.is-danger, .button.is-danger {
            background-color: var(--dbp-danger-bg-color);
            color: var(--dbp-danger-text-color);
        }

        button.button[disabled], .button[disabled], fieldset[disabled] .button {
            opacity: .5;
            cursor: not-allowed;
        }
    `;
}

function getModalDialogCSS() {
    // language=css
    return css`
        /**************************\\
          Modal Styles
        \\**************************/

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }

        .modal-container {
            background-color: #fff;
            max-width: 600px;
            max-height: 100vh;
            min-width: 60%;
            min-height: 50%;
            overflow-y: auto;
            box-sizing: border-box;
            display: grid;
            height: 70%;
            width: 70%;
            position: relative;
        }
        
        .modal-close {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            color: var(--dbp-override-danger-bg-color);
            cursor: pointer;
            padding: 0px;
        }
        
        .modal-close .close-icon svg, .close-icon{
            pointer-events: none;
        }

        button.modal-close:focus {
            outline: none;
        }


        /**************************\\
          Modal Animation Style
        \\**************************/
        @keyframes mmfadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes mmfadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }

        @keyframes mmslideIn {
            from {
                transform: translateY(15%);
            }
            to {
                transform: translateY(0);
            }
        }

        @keyframes mmslideOut {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(-10%);
            }
        }

        .micromodal-slide {
            display: none;
        }

        .micromodal-slide.is-open {
            display: block;
        }

        .micromodal-slide[aria-hidden="false"] .modal-overlay {
            animation: mmfadeIn .3s cubic-bezier(0.0, 0.0, 0.2, 1);
        }

        .micromodal-slide[aria-hidden="false"] .modal-container {
            animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1);
        }

        .micromodal-slide[aria-hidden="true"] .modal-overlay {
            animation: mmfadeOut .3s cubic-bezier(0.0, 0.0, 0.2, 1);
        }

        .micromodal-slide[aria-hidden="true"] .modal-container {
            animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1);
        }

        .micromodal-slide .modal-container,
        .micromodal-slide .modal-overlay {
            will-change: transform;
        }
        
        @media only screen
        and (orientation: landscape)
        and (max-device-width: 896px) {
             .modal-container {
                 width: 100%;
                 height: 100%;
                 max-width: 100%;
             }
         }
        
        @media only screen
        and (orientation: portrait)
        and (max-device-width: 800px) {
            .micromodal-slide .modal-container{
                height: 100%;
                width: 100%;
            }
        }

        
    `;
}

function getTextUtilities() {
    // language=css
    return css`
        .text-left {
            text-align: left;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-lowercase {
            text-transform: lowercase;
        }

        .text-uppercase {
            text-transform: uppercase;
        }

        .text-capitalize {
            text-transform: capitalize;
        }

      
    `;
}

/**
 * dbp-button implements a button with Bulma styles and automatic spinner and
 * disabling if button is clicked
 *
 * Use the attribute "no-spinner-on-click" to disable the spinner, then you can
 * start it with start() and stop it with stop()
 *
 * Type can be is-primary/is-info/is-success/is-warning/is-danger
 */
class Button extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.value = "";
        this.type = "";
        this.spinner = false;
        this.noSpinnerOnClick = false;
        this.disabled = false;
    }

    static get scopedElements() {
        return {
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    static get properties() {
        return {
            value: { type: String },
            type: { type: String },
            spinner: { type: Boolean },
            noSpinnerOnClick: { type: Boolean, attribute: 'no-spinner-on-click' },
            disabled: { type: Boolean, reflect: true },
        };
    }

    clickHandler() {
        if (!this.noSpinnerOnClick) {
            this.start();
        }
    }

    start() {
        this.spinner = true;
        this.disabled = true;
    }

    stop() {
        this.spinner = false;
        this.disabled = false;
    }

    isDisabled() {
        return this.disabled;
    }

    static get styles() {
        // language=css
        return css`
            ${getThemeCSS()}
            ${getButtonCSS()}

            .spinner { margin-left: 0.5em; }
        `;
    }

    render() {
        return html`
            <button @click="${this.clickHandler}" class="button ${this.type}" ?disabled="${this.disabled}">
                ${this.value} <dbp-mini-spinner class="spinner" style="display: ${this.spinner ? "inline" : "none"}"></dbp-mini-spinner>
            </button>
        `;
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var web = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n});},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=26)}([function(t,e,r){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(11),i=Object.prototype.toString;function a(t){return "[object Array]"===i.call(t)}function s(t){return void 0===t}function u(t){return null!==t&&"object"===n(t)}function c(t){return "[object Function]"===i.call(t)}function f(t,e){if(null!=t)if("object"!==n(t)&&(t=[t]),a(t))for(var r=0,o=t.length;r<o;r++)e.call(null,t[r],r,t);else for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.call(null,t[i],i,t);}t.exports={isArray:a,isArrayBuffer:function(t){return "[object ArrayBuffer]"===i.call(t)},isBuffer:function(t){return null!==t&&!s(t)&&null!==t.constructor&&!s(t.constructor)&&"function"==typeof t.constructor.isBuffer&&t.constructor.isBuffer(t)},isFormData:function(t){return "undefined"!=typeof FormData&&t instanceof FormData},isArrayBufferView:function(t){return "undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(t):t&&t.buffer&&t.buffer instanceof ArrayBuffer},isString:function(t){return "string"==typeof t},isNumber:function(t){return "number"==typeof t},isObject:u,isUndefined:s,isDate:function(t){return "[object Date]"===i.call(t)},isFile:function(t){return "[object File]"===i.call(t)},isBlob:function(t){return "[object Blob]"===i.call(t)},isFunction:c,isStream:function(t){return u(t)&&c(t.pipe)},isURLSearchParams:function(t){return "undefined"!=typeof URLSearchParams&&t instanceof URLSearchParams},isStandardBrowserEnv:function(){return ("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:f,merge:function t(){var e={};function r(r,o){"object"===n(e[o])&&"object"===n(r)?e[o]=t(e[o],r):e[o]=r;}for(var o=0,i=arguments.length;o<i;o++)f(arguments[o],r);return e},deepMerge:function t(){var e={};function r(r,o){"object"===n(e[o])&&"object"===n(r)?e[o]=t(e[o],r):"object"===n(r)?e[o]=t({},r):e[o]=r;}for(var o=0,i=arguments.length;o<i;o++)f(arguments[o],r);return e},extend:function(t,e,r){return f(e,(function(e,n){t[n]=r&&"function"==typeof e?o(e,r):e;})),t},trim:function(t){return t.replace(/^\s*/,"").replace(/\s*$/,"")}};},function(t,e,r){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(10),i=r(43),a=r(44),s=r(4).merge;t.exports={axios:o,encodePath:function(t){var e=t.replace(/\//g,"__PATH_SEPARATOR_POSIX__").replace(/\\\\/g,"__PATH_SEPARATOR_WINDOWS__");return encodeURIComponent(e).split("__PATH_SEPARATOR_WINDOWS__").join("\\\\").split("__PATH_SEPARATOR_POSIX__").join("/")},joinURL:function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return i(e.reduce((function(t,e,r){return (0===r||"/"!==e||"/"===e&&"/"!==t[t.length-1])&&t.push(e),t}),[]))},prepareRequestOptions:function(t,e){e.httpAgent&&(t.httpAgent=e.httpAgent),e.httpsAgent&&(t.httpsAgent=e.httpsAgent),e.data&&(t.data=e.data),e.headers&&"object"===n(e.headers)&&(t.headers=s(t.headers||{},e.headers)),"boolean"==typeof e.withCredentials&&(t.withCredentials=e.withCredentials),e.maxContentLength&&(t.maxContentLength=e.maxContentLength),e.onUploadProgress&&"function"==typeof e.onUploadProgress&&(t.onUploadProgress=e.onUploadProgress),e._digest&&(t._digest=e._digest,t.validateStatus=function(t){return t>=200&&t<300||401==t});},request:function(t){return a(t)}};},function(t,e,r){var n=r(58);t.exports={handleResponseCode:function(t){var e,r=parseInt(t.status,10);if(r>=400)throw (e=new Error("Invalid response: "+r+" "+t.statusText)).status=r,e;return t},processGlobFilter:function(t,e){return t.filter((function(t){return n(t.filename,e,{matchBase:!0})}))},processResponsePayload:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return r?{data:e,headers:t.headers||{}}:e}};},function(t,e,r){var n=":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",o="["+n+"][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*",i=new RegExp("^"+o+"$");e.isExist=function(t){return void 0!==t},e.isEmptyObject=function(t){return 0===Object.keys(t).length},e.merge=function(t,e,r){if(e)for(var n=Object.keys(e),o=n.length,i=0;i<o;i++)t[n[i]]="strict"===r?[e[n[i]]]:e[n[i]];},e.getValue=function(t){return e.isExist(t)?t:""},e.buildOptions=function(t,e,r){var n={};if(!t)return e;for(var o=0;o<r.length;o++)void 0!==t[r[o]]?n[r[o]]=t[r[o]]:n[r[o]]=e[r[o]];return n},e.isName=function(t){var e=i.exec(t);return !(null==e)},e.getAllMatches=function(t,e){for(var r=[],n=e.exec(t);n;){for(var o=[],i=n.length,a=0;a<i;a++)o.push(n[a]);r.push(o),n=e.exec(t);}return r},e.nameRegexp=o;},function(t,e){function r(t){return function(t){if(Array.isArray(t))return n(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return n(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function o(t){return (o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t){return function(t){if("object"!==o(t)||null===t||"[object Object]"!=Object.prototype.toString.call(t))return !1;if(null===Object.getPrototypeOf(t))return !0;var e=t;for(;null!==Object.getPrototypeOf(e);)e=Object.getPrototypeOf(e);return Object.getPrototypeOf(t)===e}(t)?Object.assign({},t):Object.setPrototypeOf(Object.assign({},t),Object.getPrototypeOf(t))}function a(t,e){var n=i(t);return Object.keys(e).forEach((function(t){n.hasOwnProperty(t)?Array.isArray(e[t])?n[t]=Array.isArray(n[t])?[].concat(r(n[t]),r(e[t])):r(e[t]):"object"===o(e[t])&&e[t]?n[t]="object"===o(n[t])&&n[t]?a(n[t],e[t]):i(e[t]):n[t]=e[t]:n[t]=e[t];})),n}t.exports={merge:function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];for(var n=null,o=[].concat(e);o.length>0;){var s=o.shift();n=n?a(n,s):i(s);}return n}};},function(t,e,r){var n=r(47),o=n.decode,i=n.encode;t.exports={decodeHTMLEntities:function(t){var e=document.createElement("textarea");return e.innerHTML=t,e.value},fromBase64:function(t){return o(t)},toBase64:function(t){return i(t)}};},function(t,e,r){var n=r(3),o=r(3).buildOptions,i=r(64),a=1,s=2,u=3,c=4,f="<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g,n.nameRegexp);!Number.parseInt&&window.parseInt&&(Number.parseInt=window.parseInt),!Number.parseFloat&&window.parseFloat&&(Number.parseFloat=window.parseFloat);var l={attributeNamePrefix:"@_",attrNodeName:!1,textNodeName:"#text",ignoreAttributes:!0,ignoreNameSpace:!1,allowBooleanAttributes:!1,parseNodeValue:!0,parseAttributeValue:!1,arrayMode:!1,trimValues:!0,cdataTagName:!1,cdataPositionChar:"\\c",tagValueProcessor:function(t,e){return t},attrValueProcessor:function(t,e){return t},stopNodes:[]};e.defaultOptions=l;var p=["attributeNamePrefix","attrNodeName","textNodeName","ignoreAttributes","ignoreNameSpace","allowBooleanAttributes","parseNodeValue","parseAttributeValue","arrayMode","trimValues","cdataTagName","cdataPositionChar","tagValueProcessor","attrValueProcessor","parseTrueNumberOnly","stopNodes"];e.props=p;function h(t,e,r){var n=t[7]||r,o=t[12];return o&&(e.trimValues&&(o=o.trim()),o=m(o=e.tagValueProcessor(o,n),e.parseNodeValue,e.parseTrueNumberOnly)),o}function d(t){return "]]>"===t[4]?c:"/"===t[10]?s:void 0!==t[8]&&"/"===t[8].substr(t[8].length-1)?u:a}function g(t,e){if(e.ignoreNameSpace){var r=t.split(":"),n="/"===t.charAt(0)?"/":"";if("xmlns"===r[0])return "";2===r.length&&(t=n+r[1]);}return t}function m(t,e,r){var o;return e&&"string"==typeof t?(""===t.trim()||isNaN(t)?o="true"===t||"false"!==t&&t:(-1!==t.indexOf("0x")?o=Number.parseInt(t,16):-1!==t.indexOf(".")?(o=Number.parseFloat(t),t=t.replace(/0+$/,"")):o=Number.parseInt(t,10),r&&(o=String(o)===t?o:t)),o):n.isExist(t)?t:""}var y=new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])(.*?)\\3)?","g");function v(t,e){if(!e.ignoreAttributes&&"string"==typeof t){t=t.replace(/\r?\n/g," ");for(var r=n.getAllMatches(t,y),o=r.length,i={},a=0;a<o;a++){var s=g(r[a][1],e);s.length&&(void 0!==r[a][4]?(e.trimValues&&(r[a][4]=r[a][4].trim()),r[a][4]=e.attrValueProcessor(r[a][4],s),i[e.attributeNamePrefix+s]=m(r[a][4],e.parseAttributeValue,e.parseTrueNumberOnly)):e.allowBooleanAttributes&&(i[e.attributeNamePrefix+s]=!0));}if(!Object.keys(i).length)return;if(e.attrNodeName){var u={};return u[e.attrNodeName]=i,u}return i}}e.getTraversalObj=function(t,e){e=o(e,l,p),t=t.replace(/<!--[\s\S]*?-->/g,"");for(var r=new i("!xml"),a=r,g=new RegExp(f,"g"),m=g.exec(t),y=g.exec(t);m;){var b=d(m);if(b===s)a.parent&&m[12]&&(a.parent.val=n.getValue(a.parent.val)+""+h(m,e,a.parent.tagname)),e.stopNodes.length&&e.stopNodes.includes(a.tagname)&&(a.child=[],null==a.attrsMap&&(a.attrsMap={}),a.val=t.substr(a.startIndex+1,m.index-a.startIndex-1)),a=a.parent;else if(b===c)if(e.cdataTagName){var w=new i(e.cdataTagName,a,m[3]);w.attrsMap=v(m[8],e),a.addChild(w),a.val=n.getValue(a.val)+e.cdataPositionChar,m[12]&&(a.val+=h(m,e));}else a.val=(a.val||"")+(m[3]||"")+h(m,e);else if(b===u){a&&m[12]&&(a.val=n.getValue(a.val)+""+h(m,e));var x=new i(e.ignoreNameSpace?m[7]:m[5],a,"");m[8]&&m[8].length>0&&(m[8]=m[8].substr(0,m[8].length-1)),x.attrsMap=v(m[8],e),a.addChild(x);}else {var A=new i(e.ignoreNameSpace?m[7]:m[5],a,h(m,e));e.stopNodes.length&&e.stopNodes.includes(A.tagname)&&(A.startIndex=m.index+m[1].length),A.attrsMap=v(m[8],e),a.addChild(A),a=A;}m=y,y=g.exec(t);}return r};},function(t,e){var r,n,o=t.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(t){if(r===setTimeout)return setTimeout(t,0);if((r===i||!r)&&setTimeout)return r=setTimeout,setTimeout(t,0);try{return r(t,0)}catch(e){try{return r.call(null,t,0)}catch(e){return r.call(this,t,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:i;}catch(t){r=i;}try{n="function"==typeof clearTimeout?clearTimeout:a;}catch(t){n=a;}}();var u,c=[],f=!1,l=-1;function p(){f&&u&&(f=!1,u.length?c=u.concat(c):l=-1,c.length&&h());}function h(){if(!f){var t=s(p);f=!0;for(var e=c.length;e;){for(u=c,c=[];++l<e;)u&&u[l].run();l=-1,e=c.length;}u=null,f=!1,function(t){if(n===clearTimeout)return clearTimeout(t);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(t);try{n(t);}catch(e){try{return n.call(null,t)}catch(e){return n.call(this,t)}}}(t);}}function d(t,e){this.fun=t,this.array=e;}function g(){}o.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];c.push(new d(t,e)),1!==c.length||f||s(h);},d.prototype.run=function(){this.fun.apply(null,this.array);},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=g,o.addListener=g,o.once=g,o.off=g,o.removeListener=g,o.removeAllListeners=g,o.emit=g,o.prependListener=g,o.prependOnceListener=g,o.listeners=function(t){return []},o.binding=function(t){throw new Error("process.binding is not supported")},o.cwd=function(){return "/"},o.chdir=function(t){throw new Error("process.chdir is not supported")},o.umask=function(){return 0};},function(t,e,r){var n=r(51);function o(t){var e=t;return "/"!==e[0]&&(e="/"+e),/^.+\/$/.test(e)&&(e=e.substr(0,e.length-1)),decodeURIComponent(e)}t.exports={extractURLPath:function(t){var e=new n(t).pathname;return e.length<=0&&(e="/"),o(e)},normaliseHREF:function(t){return t.replace(/^https?:\/\/[^\/]+/,"")},normalisePath:o};},function(t,e,r){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(62),i=r(69),a=r(5).decodeHTMLEntities;function s(t,e,r){var n=i.get(t,e);return "array"===r&&!1===Array.isArray(n)?[n]:"object"===r&&Array.isArray(n)?n[0]:n}function u(t){var e=t.multistatus;if(!e)throw new Error("Invalid response: No root multistatus found");var r={};return r.multistatus=Array.isArray(e)?e[0]:e,i.set(r,"multistatus.response",s(r,"multistatus.response","array")),i.set(r,"multistatus.response",i.get(r,"multistatus.response").map((function(t){return function(t){var e=Object.assign({},t);return i.set(e,"propstat",s(e,"propstat","object")),i.set(e,"propstat.prop",s(e,"propstat.prop","object")),e}(t)}))),r}t.exports={parseXML:function(t){return new Promise((function(e){e(u(o.parse(t,{arrayMode:!1,ignoreNameSpace:!0})));}))},prepareFileFromProps:function(t,e){var o=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=r(24),s=t.getlastmodified,u=void 0===s?null:s,c=t.getcontentlength,f=void 0===c?"0":c,l=t.resourcetype,p=void 0===l?null:l,h=t.getcontenttype,d=void 0===h?null:h,g=t.getetag,m=void 0===g?null:g,y=p&&"object"===n(p)&&void 0!==p.collection?"directory":"file",v=a(e),b={filename:v,basename:i.basename(v),lastmod:u,size:parseInt(f,10),type:y,etag:"string"==typeof m?m.replace(/"/g,""):null};return "file"===y&&(b.mime=d&&"string"==typeof d?d.split(";")[0]:""),o&&(b.props=t),b},translateDiskSpace:function(t){switch(t.toString()){case"-3":return "unlimited";case"-2":case"-1":return "unknown";default:return parseInt(t,10)}}};},function(t,e,r){t.exports=r(27);},function(t,e,r){t.exports=function(t,e){return function(){for(var r=new Array(arguments.length),n=0;n<r.length;n++)r[n]=arguments[n];return t.apply(e,r)}};},function(t,e,r){var n=r(0);function o(t){return encodeURIComponent(t).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}t.exports=function(t,e,r){if(!e)return t;var i;if(r)i=r(e);else if(n.isURLSearchParams(e))i=e.toString();else {var a=[];n.forEach(e,(function(t,e){null!=t&&(n.isArray(t)?e+="[]":t=[t],n.forEach(t,(function(t){n.isDate(t)?t=t.toISOString():n.isObject(t)&&(t=JSON.stringify(t)),a.push(o(e)+"="+o(t));})));})),i=a.join("&");}if(i){var s=t.indexOf("#");-1!==s&&(t=t.slice(0,s)),t+=(-1===t.indexOf("?")?"?":"&")+i;}return t};},function(t,e,r){t.exports=function(t){return !(!t||!t.__CANCEL__)};},function(t,e,r){(function(e){var n=r(0),o=r(32),i={"Content-Type":"application/x-www-form-urlencoded"};function a(t,e){!n.isUndefined(t)&&n.isUndefined(t["Content-Type"])&&(t["Content-Type"]=e);}var s,u={adapter:(("undefined"!=typeof XMLHttpRequest||void 0!==e&&"[object process]"===Object.prototype.toString.call(e))&&(s=r(15)),s),transformRequest:[function(t,e){return o(e,"Accept"),o(e,"Content-Type"),n.isFormData(t)||n.isArrayBuffer(t)||n.isBuffer(t)||n.isStream(t)||n.isFile(t)||n.isBlob(t)?t:n.isArrayBufferView(t)?t.buffer:n.isURLSearchParams(t)?(a(e,"application/x-www-form-urlencoded;charset=utf-8"),t.toString()):n.isObject(t)?(a(e,"application/json;charset=utf-8"),JSON.stringify(t)):t}],transformResponse:[function(t){if("string"==typeof t)try{t=JSON.parse(t);}catch(t){}return t}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(t){return t>=200&&t<300}};u.headers={common:{Accept:"application/json, text/plain, */*"}},n.forEach(["delete","get","head"],(function(t){u.headers[t]={};})),n.forEach(["post","put","patch"],(function(t){u.headers[t]=n.merge(i);})),t.exports=u;}).call(this,r(7));},function(t,e,r){var n=r(0),o=r(33),i=r(12),a=r(35),s=r(38),u=r(39),c=r(16);t.exports=function(t){return new Promise((function(e,f){var l=t.data,p=t.headers;n.isFormData(l)&&delete p["Content-Type"];var h=new XMLHttpRequest;if(t.auth){var d=t.auth.username||"",g=t.auth.password||"";p.Authorization="Basic "+btoa(d+":"+g);}var m=a(t.baseURL,t.url);if(h.open(t.method.toUpperCase(),i(m,t.params,t.paramsSerializer),!0),h.timeout=t.timeout,h.onreadystatechange=function(){if(h&&4===h.readyState&&(0!==h.status||h.responseURL&&0===h.responseURL.indexOf("file:"))){var r="getAllResponseHeaders"in h?s(h.getAllResponseHeaders()):null,n={data:t.responseType&&"text"!==t.responseType?h.response:h.responseText,status:h.status,statusText:h.statusText,headers:r,config:t,request:h};o(e,f,n),h=null;}},h.onabort=function(){h&&(f(c("Request aborted",t,"ECONNABORTED",h)),h=null);},h.onerror=function(){f(c("Network Error",t,null,h)),h=null;},h.ontimeout=function(){var e="timeout of "+t.timeout+"ms exceeded";t.timeoutErrorMessage&&(e=t.timeoutErrorMessage),f(c(e,t,"ECONNABORTED",h)),h=null;},n.isStandardBrowserEnv()){var y=r(40),v=(t.withCredentials||u(m))&&t.xsrfCookieName?y.read(t.xsrfCookieName):void 0;v&&(p[t.xsrfHeaderName]=v);}if("setRequestHeader"in h&&n.forEach(p,(function(t,e){void 0===l&&"content-type"===e.toLowerCase()?delete p[e]:h.setRequestHeader(e,t);})),n.isUndefined(t.withCredentials)||(h.withCredentials=!!t.withCredentials),t.responseType)try{h.responseType=t.responseType;}catch(e){if("json"!==t.responseType)throw e}"function"==typeof t.onDownloadProgress&&h.addEventListener("progress",t.onDownloadProgress),"function"==typeof t.onUploadProgress&&h.upload&&h.upload.addEventListener("progress",t.onUploadProgress),t.cancelToken&&t.cancelToken.promise.then((function(t){h&&(h.abort(),f(t),h=null);})),void 0===l&&(l=null),h.send(l);}))};},function(t,e,r){var n=r(34);t.exports=function(t,e,r,o,i){var a=new Error(t);return n(a,e,r,o,i)};},function(t,e,r){var n=r(0);t.exports=function(t,e){e=e||{};var r={},o=["url","method","params","data"],i=["headers","auth","proxy"],a=["baseURL","url","transformRequest","transformResponse","paramsSerializer","timeout","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","maxContentLength","validateStatus","maxRedirects","httpAgent","httpsAgent","cancelToken","socketPath"];n.forEach(o,(function(t){void 0!==e[t]&&(r[t]=e[t]);})),n.forEach(i,(function(o){n.isObject(e[o])?r[o]=n.deepMerge(t[o],e[o]):void 0!==e[o]?r[o]=e[o]:n.isObject(t[o])?r[o]=n.deepMerge(t[o]):void 0!==t[o]&&(r[o]=t[o]);})),n.forEach(a,(function(n){void 0!==e[n]?r[n]=e[n]:void 0!==t[n]&&(r[n]=t[n]);}));var s=o.concat(i).concat(a),u=Object.keys(e).filter((function(t){return -1===s.indexOf(t)}));return n.forEach(u,(function(n){void 0!==e[n]?r[n]=e[n]:void 0!==t[n]&&(r[n]=t[n]);})),r};},function(t,e,r){function n(t){this.message=t;}n.prototype.toString=function(){return "Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,t.exports=n;},function(t,e,r){var n=r(45),o=null;t.exports={getPatcher:function(){return o||(o=new n),o}};},function(t,e,r){var n=r(5).toBase64,o=r(49),i=o.md5,a=o.ha1Compute;t.exports={generateBasicAuthHeader:function(t,e){var r=n("".concat(t,":").concat(e));return "Basic ".concat(r)},generateTokenAuthHeader:function(t){return "".concat(t.token_type," ").concat(t.access_token)},generateDigestAuthHeader:function(t,e){var r=t.url.replace("//",""),n=-1==r.indexOf("/")?"/":r.slice(r.indexOf("/")),o=t.method?t.method.toUpperCase():"GET",s=!!/(^|,)\s*auth\s*($|,)/.test(e.qop)&&"auth",u="00000000".concat(e.nc).slice(-8),c=(e.cnonce,a(e.algorithm,e.username,e.realm,e.password,e.nonce,e.cnonce)),f=i("".concat(o,":").concat(n)),l=i(s?"".concat(c,":").concat(e.nonce,":").concat(u,":").concat(e.cnonce,":").concat(s,":").concat(f):"".concat(c,":").concat(e.nonce,":").concat(f)),p={username:e.username,realm:e.realm,nonce:e.nonce,uri:n,qop:s,response:l,nc:u,cnonce:e.cnonce,algorithm:e.algorithm,opaque:e.opaque},h=[];for(var d in p)p[d]&&("qop"===d||"nc"===d||"algorithm"===d?h.push("".concat(d,"=").concat(p[d])):h.push("".concat(d,'="').concat(p[d],'"')));return "Digest ".concat(h.join(", "))}};},function(t,e){function r(t){return (r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var n;n=function(){return this}();try{n=n||new Function("return this")();}catch(t){"object"===("undefined"==typeof window?"undefined":r(window))&&(n=window);}t.exports=n;},function(t,e){(function(e){t.exports=e;}).call(this,{});},function(t,e){},function(t,e,r){(function(e){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(55),i=function(t){return "string"==typeof t};function a(t,e){for(var r=[],n=0;n<t.length;n++){var o=t[n];o&&"."!==o&&(".."===o?r.length&&".."!==r[r.length-1]?r.pop():e&&r.push(".."):r.push(o));}return r}var s=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,u={};function c(t){return s.exec(t).slice(1)}u.resolve=function(){for(var t="",r=!1,n=arguments.length-1;n>=-1&&!r;n--){var o=n>=0?arguments[n]:e.cwd();if(!i(o))throw new TypeError("Arguments to path.resolve must be strings");o&&(t=o+"/"+t,r="/"===o.charAt(0));}return (r?"/":"")+(t=a(t.split("/"),!r).join("/"))||"."},u.normalize=function(t){var e=u.isAbsolute(t),r="/"===t.substr(-1);return (t=a(t.split("/"),!e).join("/"))||e||(t="."),t&&r&&(t+="/"),(e?"/":"")+t},u.isAbsolute=function(t){return "/"===t.charAt(0)},u.join=function(){for(var t="",e=0;e<arguments.length;e++){var r=arguments[e];if(!i(r))throw new TypeError("Arguments to path.join must be strings");r&&(t+=t?"/"+r:r);}return u.normalize(t)},u.relative=function(t,e){function r(t){for(var e=0;e<t.length&&""===t[e];e++);for(var r=t.length-1;r>=0&&""===t[r];r--);return e>r?[]:t.slice(e,r+1)}t=u.resolve(t).substr(1),e=u.resolve(e).substr(1);for(var n=r(t.split("/")),o=r(e.split("/")),i=Math.min(n.length,o.length),a=i,s=0;s<i;s++)if(n[s]!==o[s]){a=s;break}var c=[];for(s=a;s<n.length;s++)c.push("..");return (c=c.concat(o.slice(a))).join("/")},u._makeLong=function(t){return t},u.dirname=function(t){var e=c(t),r=e[0],n=e[1];return r||n?(n&&(n=n.substr(0,n.length-1)),r+n):"."},u.basename=function(t,e){var r=c(t)[2];return e&&r.substr(-1*e.length)===e&&(r=r.substr(0,r.length-e.length)),r},u.extname=function(t){return c(t)[3]},u.format=function(t){if(!o.isObject(t))throw new TypeError("Parameter 'pathObject' must be an object, not "+n(t));var e=t.root||"";if(!i(e))throw new TypeError("'pathObject.root' must be a string or undefined, not "+n(t.root));return (t.dir?t.dir+u.sep:"")+(t.base||"")},u.parse=function(t){if(!i(t))throw new TypeError("Parameter 'pathString' must be a string, not "+n(t));var e=c(t);if(!e||4!==e.length)throw new TypeError("Invalid path '"+t+"'");return e[1]=e[1]||"",e[2]=e[2]||"",e[3]=e[3]||"",{root:e[0],dir:e[0]+e[1].slice(0,e[1].length-1),base:e[2],ext:e[3],name:e[2].slice(0,e[2].length-e[3].length)}},u.sep="/",u.delimiter=":",t.exports=u;}).call(this,r(7));},function(t,e,r){r(4).merge;var n=r(2),o=n.handleResponseCode,i=n.processResponsePayload,a=r(9),s=a.parseXML,u=a.prepareFileFromProps,c=r(8),f=r(1),l=f.encodePath,p=f.joinURL,h=f.prepareRequestOptions,d=f.request;function g(t,e){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=null;try{n=t.multistatus.response[0];}catch(t){}if(!n)throw new Error("Failed getting item stat: bad response");var o=n,i=o.propstat.prop,a=c.normalisePath(e);return u(i,a,r)}t.exports={getStat:function(t,e){var r={url:p(e.remoteURL,l(t)),method:"PROPFIND",headers:{Accept:"text/plain",Depth:0},responseType:"text"},n=null;return h(r,e),d(r).then(o).then((function(t){return n=t,t.data})).then(s).then((function(r){return g(r,t,e.details)})).then((function(t){return i(n,t,e.details)}))},parseStat:g};},function(t,e,r){var n=r(1).axios,o=r(50).createClient,i=r(19).getPatcher;t.exports={axios:n,createClient:o,getPatcher:i};},function(t,e,r){var n=r(0),o=r(11),i=r(28),a=r(17);function s(t){var e=new i(t),r=o(i.prototype.request,e);return n.extend(r,i.prototype,e),n.extend(r,e),r}var u=s(r(14));u.Axios=i,u.create=function(t){return s(a(u.defaults,t))},u.Cancel=r(18),u.CancelToken=r(41),u.isCancel=r(13),u.all=function(t){return Promise.all(t)},u.spread=r(42),t.exports=u,t.exports.default=u;},function(t,e,r){var n=r(0),o=r(12),i=r(29),a=r(30),s=r(17);function u(t){this.defaults=t,this.interceptors={request:new i,response:new i};}u.prototype.request=function(t){"string"==typeof t?(t=arguments[1]||{}).url=arguments[0]:t=t||{},(t=s(this.defaults,t)).method?t.method=t.method.toLowerCase():this.defaults.method?t.method=this.defaults.method.toLowerCase():t.method="get";var e=[a,void 0],r=Promise.resolve(t);for(this.interceptors.request.forEach((function(t){e.unshift(t.fulfilled,t.rejected);})),this.interceptors.response.forEach((function(t){e.push(t.fulfilled,t.rejected);}));e.length;)r=r.then(e.shift(),e.shift());return r},u.prototype.getUri=function(t){return t=s(this.defaults,t),o(t.url,t.params,t.paramsSerializer).replace(/^\?/,"")},n.forEach(["delete","get","head","options"],(function(t){u.prototype[t]=function(e,r){return this.request(n.merge(r||{},{method:t,url:e}))};})),n.forEach(["post","put","patch"],(function(t){u.prototype[t]=function(e,r,o){return this.request(n.merge(o||{},{method:t,url:e,data:r}))};})),t.exports=u;},function(t,e,r){var n=r(0);function o(){this.handlers=[];}o.prototype.use=function(t,e){return this.handlers.push({fulfilled:t,rejected:e}),this.handlers.length-1},o.prototype.eject=function(t){this.handlers[t]&&(this.handlers[t]=null);},o.prototype.forEach=function(t){n.forEach(this.handlers,(function(e){null!==e&&t(e);}));},t.exports=o;},function(t,e,r){var n=r(0),o=r(31),i=r(13),a=r(14);function s(t){t.cancelToken&&t.cancelToken.throwIfRequested();}t.exports=function(t){return s(t),t.headers=t.headers||{},t.data=o(t.data,t.headers,t.transformRequest),t.headers=n.merge(t.headers.common||{},t.headers[t.method]||{},t.headers),n.forEach(["delete","get","head","post","put","patch","common"],(function(e){delete t.headers[e];})),(t.adapter||a.adapter)(t).then((function(e){return s(t),e.data=o(e.data,e.headers,t.transformResponse),e}),(function(e){return i(e)||(s(t),e&&e.response&&(e.response.data=o(e.response.data,e.response.headers,t.transformResponse))),Promise.reject(e)}))};},function(t,e,r){var n=r(0);t.exports=function(t,e,r){return n.forEach(r,(function(r){t=r(t,e);})),t};},function(t,e,r){var n=r(0);t.exports=function(t,e){n.forEach(t,(function(r,n){n!==e&&n.toUpperCase()===e.toUpperCase()&&(t[e]=r,delete t[n]);}));};},function(t,e,r){var n=r(16);t.exports=function(t,e,r){var o=r.config.validateStatus;!o||o(r.status)?t(r):e(n("Request failed with status code "+r.status,r.config,null,r.request,r));};},function(t,e,r){t.exports=function(t,e,r,n,o){return t.config=e,r&&(t.code=r),t.request=n,t.response=o,t.isAxiosError=!0,t.toJSON=function(){return {message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},t};},function(t,e,r){var n=r(36),o=r(37);t.exports=function(t,e){return t&&!n(e)?o(t,e):e};},function(t,e,r){t.exports=function(t){return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(t)};},function(t,e,r){t.exports=function(t,e){return e?t.replace(/\/+$/,"")+"/"+e.replace(/^\/+/,""):t};},function(t,e,r){var n=r(0),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];t.exports=function(t){var e,r,i,a={};return t?(n.forEach(t.split("\n"),(function(t){if(i=t.indexOf(":"),e=n.trim(t.substr(0,i)).toLowerCase(),r=n.trim(t.substr(i+1)),e){if(a[e]&&o.indexOf(e)>=0)return;a[e]="set-cookie"===e?(a[e]?a[e]:[]).concat([r]):a[e]?a[e]+", "+r:r;}})),a):a};},function(t,e,r){var n=r(0);t.exports=n.isStandardBrowserEnv()?function(){var t,e=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a");function o(t){var n=t;return e&&(r.setAttribute("href",n),n=r.href),r.setAttribute("href",n),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:"/"===r.pathname.charAt(0)?r.pathname:"/"+r.pathname}}return t=o(window.location.href),function(e){var r=n.isString(e)?o(e):e;return r.protocol===t.protocol&&r.host===t.host}}():function(){return !0};},function(t,e,r){var n=r(0);t.exports=n.isStandardBrowserEnv()?{write:function(t,e,r,o,i,a){var s=[];s.push(t+"="+encodeURIComponent(e)),n.isNumber(r)&&s.push("expires="+new Date(r).toGMTString()),n.isString(o)&&s.push("path="+o),n.isString(i)&&s.push("domain="+i),!0===a&&s.push("secure"),document.cookie=s.join("; ");},read:function(t){var e=document.cookie.match(new RegExp("(^|;\\s*)("+t+")=([^;]*)"));return e?decodeURIComponent(e[3]):null},remove:function(t){this.write(t,"",Date.now()-864e5);}}:{write:function(){},read:function(){return null},remove:function(){}};},function(t,e,r){var n=r(18);function o(t){if("function"!=typeof t)throw new TypeError("executor must be a function.");var e;this.promise=new Promise((function(t){e=t;}));var r=this;t((function(t){r.reason||(r.reason=new n(t),e(r.reason));}));}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.source=function(){var t;return {token:new o((function(e){t=e;})),cancel:t}},t.exports=o;},function(t,e,r){t.exports=function(t){return function(e){return t.apply(null,e)}};},function(t,e,r){var n,o,i;function a(t){return (a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}i=function(){function t(t){var e=[];if(0===t.length)return "";if("string"!=typeof t[0])throw new TypeError("Url must be a string. Received "+t[0]);if(t[0].match(/^[^/:]+:\/*$/)&&t.length>1){var r=t.shift();t[0]=r+t[0];}t[0].match(/^file:\/\/\//)?t[0]=t[0].replace(/^([^/:]+):\/*/,"$1:///"):t[0]=t[0].replace(/^([^/:]+):\/*/,"$1://");for(var n=0;n<t.length;n++){var o=t[n];if("string"!=typeof o)throw new TypeError("Url must be a string. Received "+o);""!==o&&(n>0&&(o=o.replace(/^[\/]+/,"")),o=n<t.length-1?o.replace(/[\/]+$/,""):o.replace(/[\/]+$/,"/"),e.push(o));}var i=e.join("/"),a=(i=i.replace(/\/(\?|&|#[^!])/g,"$1")).split("?");return i=a.shift()+(a.length>0?"?":"")+a.join("&")}return function(){return t("object"===a(arguments[0])?arguments[0]:[].slice.call(arguments))}},t.exports?t.exports=i():void 0===(o="function"==typeof(n=i)?n.call(e,r,e,t):n)||(t.exports=o);},function(t,e,r){var n=r(10),o=r(4).merge,i=r(19).getPatcher,a=r(20).generateDigestAuthHeader;function s(t,e){var r=t.headers["www-authenticate"]||"";if("digest"!==r.split(/\s/)[0].toLowerCase())return !1;for(var n=/([a-z0-9_-]+)=(?:"([^"]+)"|([a-z0-9_-]+))/gi;;){var o=n.exec(r);if(!o)break;e[o[1]]=o[2]||o[3];}return e.nc++,e.cnonce=function(){for(var t="",e=0;e<32;++e)t+="abcdef0123456789"[Math.floor(Math.random()*"abcdef0123456789".length)];return t}(),!0}function u(t){return i().patchInline("request",(function(t){return n(t)}),t)}t.exports=function(t){if(!t._digest)return u(t);var e=t._digest;return delete t._digest,e.hasDigestAuth&&(t=o(t,{headers:{Authorization:a(t,e)}})),u(t).then((function(r){if(401==r.status){if(e.hasDigestAuth=s(r,e),e.hasDigestAuth)return u(t=o(t,{headers:{Authorization:a(t,e)}})).then((function(t){return 401==t.status?e.hasDigestAuth=!1:e.nc++,t}))}else e.nc++;return r}))};},function(t,e,r){function n(t){return function(t){if(Array.isArray(t))return o(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function i(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n);}}var a=r(46).sequence,s=function(){};function u(t){return {original:t,methods:[t],final:!1}}var c=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._configuration={registry:{},getEmptyAction:"null"},this.__type__="@@HOTPATCHER";}var e,r;return e=t,(r=[{key:"control",value:function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(!t||"@@HOTPATCHER"!==t.__type__)throw new Error("Failed taking control of target HotPatcher instance: Invalid type or object");return Object.keys(t.configuration.registry).forEach((function(n){e.configuration.registry.hasOwnProperty(n)?r&&(e.configuration.registry[n]=Object.assign({},t.configuration.registry[n])):e.configuration.registry[n]=Object.assign({},t.configuration.registry[n]);})),t._configuration=this.configuration,this}},{key:"execute",value:function(t){for(var e=this.get(t)||s,r=arguments.length,n=new Array(r>1?r-1:0),o=1;o<r;o++)n[o-1]=arguments[o];return e.apply(void 0,n)}},{key:"get",value:function(t){var e=this.configuration.registry[t];if(!e)switch(this.getEmptyAction){case"null":return null;case"throw":throw new Error("Failed handling method request: No method provided for override: ".concat(t));default:throw new Error("Failed handling request which resulted in an empty method: Invalid empty-action specified: ".concat(this.getEmptyAction))}return a.apply(void 0,n(e.methods))}},{key:"isPatched",value:function(t){return !!this.configuration.registry[t]}},{key:"patch",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=r.chain,o=void 0!==n&&n;if(this.configuration.registry[t]&&this.configuration.registry[t].final)throw new Error("Failed patching '".concat(t,"': Method marked as being final"));if("function"!=typeof e)throw new Error("Failed patching '".concat(t,"': Provided method is not a function"));if(o)this.configuration.registry[t]?this.configuration.registry[t].methods.push(e):this.configuration.registry[t]=u(e);else if(this.isPatched(t)){var i=this.configuration.registry[t].original;this.configuration.registry[t]=Object.assign(u(e),{original:i});}else this.configuration.registry[t]=u(e);return this}},{key:"patchInline",value:function(t,e){this.isPatched(t)||this.patch(t,e);for(var r=arguments.length,n=new Array(r>2?r-2:0),o=2;o<r;o++)n[o-2]=arguments[o];return this.execute.apply(this,[t].concat(n))}},{key:"plugin",value:function(t){for(var e=this,r=arguments.length,n=new Array(r>1?r-1:0),o=1;o<r;o++)n[o-1]=arguments[o];return n.forEach((function(r){e.patch(t,r,{chain:!0});})),this}},{key:"restore",value:function(t){if(!this.isPatched(t))throw new Error("Failed restoring method: No method present for key: ".concat(t));if("function"!=typeof this.configuration.registry[t].original)throw new Error("Failed restoring method: Original method not found or of invalid type for key: ".concat(t));this.configuration.registry[t].methods=[this.configuration.registry[t].original];}},{key:"setFinal",value:function(t){if(!this.configuration.registry.hasOwnProperty(t))throw new Error("Failed marking '".concat(t,"' as final: No method found for key"));return this.configuration.registry[t].final=!0,this}},{key:"configuration",get:function(){return this._configuration}},{key:"getEmptyAction",get:function(){return this.configuration.getEmptyAction},set:function(t){this.configuration.getEmptyAction=t;}}])&&i(e.prototype,r),t}();t.exports=c;},function(t,e){t.exports={sequence:function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];if(0===e.length)throw new Error("Failed creating sequence: No functions provided");return function(){for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];for(var o=r,i=this;e.length>0;){var a=e.shift();o=[a.apply(i,o)];}return o[0]}}};},function(t,e,r){(function(t,n){var o;function i(t){return (i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}
/*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */!function(a){var s="object"==i(e)&&e,u="object"==i(t)&&t&&t.exports==s&&t,c="object"==(void 0===n?"undefined":i(n))&&n;c.global!==c&&c.window!==c||(a=c);var f=function(t){this.message=t;};(f.prototype=new Error).name="InvalidCharacterError";var l=function(t){throw new f(t)},p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",h=/[\t\n\f\r ]/g,d={encode:function(t){t=String(t),/[^\0-\xFF]/.test(t)&&l("The string to be encoded contains characters outside of the Latin1 range.");for(var e,r,n,o,i=t.length%3,a="",s=-1,u=t.length-i;++s<u;)e=t.charCodeAt(s)<<16,r=t.charCodeAt(++s)<<8,n=t.charCodeAt(++s),a+=p.charAt((o=e+r+n)>>18&63)+p.charAt(o>>12&63)+p.charAt(o>>6&63)+p.charAt(63&o);return 2==i?(e=t.charCodeAt(s)<<8,r=t.charCodeAt(++s),a+=p.charAt((o=e+r)>>10)+p.charAt(o>>4&63)+p.charAt(o<<2&63)+"="):1==i&&(o=t.charCodeAt(s),a+=p.charAt(o>>2)+p.charAt(o<<4&63)+"=="),a},decode:function(t){var e=(t=String(t).replace(h,"")).length;e%4==0&&(e=(t=t.replace(/==?$/,"")).length),(e%4==1||/[^+a-zA-Z0-9/]/.test(t))&&l("Invalid character: the string to be decoded is not correctly encoded.");for(var r,n,o=0,i="",a=-1;++a<e;)n=p.indexOf(t.charAt(a)),r=o%4?64*r+n:n,o++%4&&(i+=String.fromCharCode(255&r>>(-2*o&6)));return i},version:"0.1.0"};if("object"==i(r(22))&&r(22))void 0===(o=function(){return d}.call(e,r,e,t))||(t.exports=o);else if(s&&!s.nodeType)if(u)u.exports=d;else for(var g in d)d.hasOwnProperty(g)&&(s[g]=d[g]);else a.base64=d;}(this);}).call(this,r(48)(t),r(21));},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t};},function(t,e,r){var n=r(23).createHash;function o(t){return n("md5").update(t).digest("hex")}t.exports={md5:o,ha1Compute:function(t,e,r,n,i,a){var s=o("".concat(e,":").concat(r,":").concat(n));return t&&"md5-sess"===t.toLowerCase()?o("".concat(s,":").concat(i,":").concat(a)):s}};},function(t,e,r){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(20),i=r(8),a=r(4).merge,s=r(54),u=r(70),c=r(71),f=r(72),l=r(73),p=r(74),h=r(75),d=r(76),g=r(77),m=r(78),y=r(25);t.exports={createClient:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e||"object"!==n(e))throw new Error("Options must be an object, if specified");var r=e.username,v=e.password,b=e.httpAgent,w=e.httpsAgent,x=e.token,A=void 0===x?null:x,j=e.digest,S=void 0!==j&&j,O={headers:{},remotePath:i.extractURLPath(t),remoteURL:t,httpAgent:b,httpsAgent:w};return S?O._digest={username:r,password:v,nc:0,algorithm:"md5",hasDigestAuth:!1}:r?O.headers.Authorization=o.generateBasicAuthHeader(r,v):A&&"object"===n(A)&&(O.headers.Authorization=o.generateTokenAuthHeader(A)),{copyFile:function(t,e,r){var n=a(O,r||{});return g.copyFile(t,e,n)},createDirectory:function(t,e){var r=a(O,e||{});return u.createDirectory(t,r)},createReadStream:function(t,e){throw new Error("createReadStream not implemented in web environment")},createWriteStream:function(t,e){throw new Error("createWriteStream not implemented in web environment")},customRequest:function(t,e,r){var n=a(O,r||{});return c.customRequest(t,e,n)},deleteFile:function(t,e){var r=a(O,e||{});return f.deleteFile(t,r)},exists:function(t,e){var r=a(O,e||{});return l.pathExists(t,r)},getDirectoryContents:function(t,e){var r=a(O,e||{});return s.getDirectoryContents(t,r)},getFileContents:function(t,e){var r=a(O,e||{});if(r.format=r.format||"binary",["binary","text"].indexOf(r.format)<0)throw new Error("Unknown format: "+r.format);return "text"===r.format?p.getFileContentsString(t,r):p.getFileContentsBuffer(t,r)},getFileDownloadLink:function(t,e){var r=a(O,e||{});return p.getFileLink(t,r)},getFileUploadLink:function(t,e){var r=a(O,e||{});return m.getFileUploadLink(t,r)},getQuota:function(t){var e=a(O,t||{});return h.getQuota(e)},moveFile:function(t,e,r){var n=a(O,r||{});return d.moveFile(t,e,n)},putFileContents:function(t,e,r){var n=a(O,r||{});return m.putFileContents(t,e,n)},stat:function(t,e){var r=a(O,e||{});return y.getStat(t,r)}}}};},function(t,e,r){(function(e){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(52),i=r(53),a=/^[A-Za-z][A-Za-z0-9+-.]*:\/\//,s=/^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,u=new RegExp("^[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]+");function c(t){return (t||"").toString().replace(u,"")}var f=[["#","hash"],["?","query"],function(t){return t.replace("\\","/")},["/","pathname"],["@","auth",1],[NaN,"host",void 0,1,1],[/:(\d+)$/,"port",void 0,1],[NaN,"hostname",void 0,1,1]],l={hash:1,query:1};function p(t){var r,o=("undefined"!=typeof window?window:void 0!==e?e:"undefined"!=typeof self?self:{}).location||{},i={},s=n(t=t||o);if("blob:"===t.protocol)i=new d(unescape(t.pathname),{});else if("string"===s)for(r in i=new d(t,{}),l)delete i[r];else if("object"===s){for(r in t)r in l||(i[r]=t[r]);void 0===i.slashes&&(i.slashes=a.test(t.href));}return i}function h(t){t=c(t);var e=s.exec(t);return {protocol:e[1]?e[1].toLowerCase():"",slashes:!!e[2],rest:e[3]}}function d(t,e,r){if(t=c(t),!(this instanceof d))return new d(t,e,r);var a,s,u,l,g,m,y=f.slice(),v=n(e),b=this,w=0;for("object"!==v&&"string"!==v&&(r=e,e=null),r&&"function"!=typeof r&&(r=i.parse),e=p(e),a=!(s=h(t||"")).protocol&&!s.slashes,b.slashes=s.slashes||a&&e.slashes,b.protocol=s.protocol||e.protocol||"",t=s.rest,s.slashes||(y[3]=[/(.*)/,"pathname"]);w<y.length;w++)"function"!=typeof(l=y[w])?(u=l[0],m=l[1],u!=u?b[m]=t:"string"==typeof u?~(g=t.indexOf(u))&&("number"==typeof l[2]?(b[m]=t.slice(0,g),t=t.slice(g+l[2])):(b[m]=t.slice(g),t=t.slice(0,g))):(g=u.exec(t))&&(b[m]=g[1],t=t.slice(0,g.index)),b[m]=b[m]||a&&l[3]&&e[m]||"",l[4]&&(b[m]=b[m].toLowerCase())):t=l(t);r&&(b.query=r(b.query)),a&&e.slashes&&"/"!==b.pathname.charAt(0)&&(""!==b.pathname||""!==e.pathname)&&(b.pathname=function(t,e){if(""===t)return e;for(var r=(e||"/").split("/").slice(0,-1).concat(t.split("/")),n=r.length,o=r[n-1],i=!1,a=0;n--;)"."===r[n]?r.splice(n,1):".."===r[n]?(r.splice(n,1),a++):a&&(0===n&&(i=!0),r.splice(n,1),a--);return i&&r.unshift(""),"."!==o&&".."!==o||r.push(""),r.join("/")}(b.pathname,e.pathname)),o(b.port,b.protocol)||(b.host=b.hostname,b.port=""),b.username=b.password="",b.auth&&(l=b.auth.split(":"),b.username=l[0]||"",b.password=l[1]||""),b.origin=b.protocol&&b.host&&"file:"!==b.protocol?b.protocol+"//"+b.host:"null",b.href=b.toString();}d.prototype={set:function(t,e,r){var n=this;switch(t){case"query":"string"==typeof e&&e.length&&(e=(r||i.parse)(e)),n[t]=e;break;case"port":n[t]=e,o(e,n.protocol)?e&&(n.host=n.hostname+":"+e):(n.host=n.hostname,n[t]="");break;case"hostname":n[t]=e,n.port&&(e+=":"+n.port),n.host=e;break;case"host":n[t]=e,/:\d+$/.test(e)?(e=e.split(":"),n.port=e.pop(),n.hostname=e.join(":")):(n.hostname=e,n.port="");break;case"protocol":n.protocol=e.toLowerCase(),n.slashes=!r;break;case"pathname":case"hash":if(e){var a="pathname"===t?"/":"#";n[t]=e.charAt(0)!==a?a+e:e;}else n[t]=e;break;default:n[t]=e;}for(var s=0;s<f.length;s++){var u=f[s];u[4]&&(n[u[1]]=n[u[1]].toLowerCase());}return n.origin=n.protocol&&n.host&&"file:"!==n.protocol?n.protocol+"//"+n.host:"null",n.href=n.toString(),n},toString:function(t){t&&"function"==typeof t||(t=i.stringify);var e,r=this,o=r.protocol;o&&":"!==o.charAt(o.length-1)&&(o+=":");var a=o+(r.slashes?"//":"");return r.username&&(a+=r.username,r.password&&(a+=":"+r.password),a+="@"),a+=r.host+r.pathname,(e="object"===n(r.query)?t(r.query):r.query)&&(a+="?"!==e.charAt(0)?"?"+e:e),r.hash&&(a+=r.hash),a}},d.extractProtocol=h,d.location=p,d.trimLeft=c,d.qs=i,t.exports=d;}).call(this,r(21));},function(t,e,r){t.exports=function(t,e){if(e=e.split(":")[0],!(t=+t))return !1;switch(e){case"http":case"ws":return 80!==t;case"https":case"wss":return 443!==t;case"ftp":return 21!==t;case"gopher":return 70!==t;case"file":return !1}return 0!==t};},function(t,e,r){var n=Object.prototype.hasOwnProperty;function o(t){try{return decodeURIComponent(t.replace(/\+/g," "))}catch(t){return null}}e.stringify=function(t,e){e=e||"";var r,o,i=[];for(o in "string"!=typeof e&&(e="?"),t)if(n.call(t,o)){if((r=t[o])||null!=r&&!isNaN(r)||(r=""),o=encodeURIComponent(o),r=encodeURIComponent(r),null===o||null===r)continue;i.push(o+"="+r);}return i.length?e+i.join("&"):""},e.parse=function(t){for(var e,r=/([^=?&]+)=?([^&]*)/g,n={};e=r.exec(t);){var i=o(e[1]),a=o(e[2]);null===i||null===a||i in n||(n[i]=a);}return n};},function(t,e,r){var n=r(24),o=(r(4).merge,r(2)),i=o.handleResponseCode,a=o.processGlobFilter,s=o.processResponsePayload,u=r(8),c=u.normaliseHREF,f=u.normalisePath,l=r(9),p=l.parseXML,h=l.prepareFileFromProps,d=r(1),g=d.encodePath,m=d.joinURL,y=d.prepareRequestOptions,v=d.request;t.exports={getDirectoryContents:function(t,e){var r={url:m(e.remoteURL,g(t),"/"),method:"PROPFIND",headers:{Accept:"text/plain",Depth:e.deep?"infinity":1},responseType:"text"},o=null;return y(r,e),v(r).then(i).then((function(t){return o=t,t.data})).then(p).then((function(r){return function(t,e,r){var o=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i=n.join(e,r,"/"),a=n.join(e,"/"),s=t.multistatus.response;return s.filter((function(t){var e=t.href;return (e=n.join(f(c(e)),"/"))!==a&&e!==i})).map((function(t){var e=c(t.href),r=t.propstat.prop,i=f("/"===a?e:n.relative(a,e));return h(r,i,o)}))}(r,e.remotePath,t,e.details)})).then((function(t){return s(o,t,e.details)})).then((function(t){return e.glob?a(t,e.glob):t}))}};},function(t,e,r){(function(t){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=Object.getOwnPropertyDescriptors||function(t){for(var e=Object.keys(t),r={},n=0;n<e.length;n++)r[e[n]]=Object.getOwnPropertyDescriptor(t,e[n]);return r},i=/%[sdj%]/g;e.format=function(t){if(!v(t)){for(var e=[],r=0;r<arguments.length;r++)e.push(u(arguments[r]));return e.join(" ")}r=1;for(var n=arguments,o=n.length,a=String(t).replace(i,(function(t){if("%%"===t)return "%";if(r>=o)return t;switch(t){case"%s":return String(n[r++]);case"%d":return Number(n[r++]);case"%j":try{return JSON.stringify(n[r++])}catch(t){return "[Circular]"}default:return t}})),s=n[r];r<o;s=n[++r])m(s)||!x(s)?a+=" "+s:a+=" "+u(s);return a},e.deprecate=function(r,n){if(void 0!==t&&!0===t.noDeprecation)return r;if(void 0===t)return function(){return e.deprecate(r,n).apply(this,arguments)};var o=!1;return function(){if(!o){if(t.throwDeprecation)throw new Error(n);t.traceDeprecation?console.trace(n):console.error(n),o=!0;}return r.apply(this,arguments)}};var a,s={};function u(t,r){var n={seen:[],stylize:f};return arguments.length>=3&&(n.depth=arguments[2]),arguments.length>=4&&(n.colors=arguments[3]),g(r)?n.showHidden=r:r&&e._extend(n,r),b(n.showHidden)&&(n.showHidden=!1),b(n.depth)&&(n.depth=2),b(n.colors)&&(n.colors=!1),b(n.customInspect)&&(n.customInspect=!0),n.colors&&(n.stylize=c),l(n,t,n.depth)}function c(t,e){var r=u.styles[e];return r?"["+u.colors[r][0]+"m"+t+"["+u.colors[r][1]+"m":t}function f(t,e){return t}function l(t,r,n){if(t.customInspect&&r&&S(r.inspect)&&r.inspect!==e.inspect&&(!r.constructor||r.constructor.prototype!==r)){var o=r.inspect(n,t);return v(o)||(o=l(t,o,n)),o}var i=function(t,e){if(b(e))return t.stylize("undefined","undefined");if(v(e)){var r="'"+JSON.stringify(e).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return t.stylize(r,"string")}if(y(e))return t.stylize(""+e,"number");if(g(e))return t.stylize(""+e,"boolean");if(m(e))return t.stylize("null","null")}(t,r);if(i)return i;var a=Object.keys(r),s=function(t){var e={};return t.forEach((function(t,r){e[t]=!0;})),e}(a);if(t.showHidden&&(a=Object.getOwnPropertyNames(r)),j(r)&&(a.indexOf("message")>=0||a.indexOf("description")>=0))return p(r);if(0===a.length){if(S(r)){var u=r.name?": "+r.name:"";return t.stylize("[Function"+u+"]","special")}if(w(r))return t.stylize(RegExp.prototype.toString.call(r),"regexp");if(A(r))return t.stylize(Date.prototype.toString.call(r),"date");if(j(r))return p(r)}var c,f="",x=!1,O=["{","}"];(d(r)&&(x=!0,O=["[","]"]),S(r))&&(f=" [Function"+(r.name?": "+r.name:"")+"]");return w(r)&&(f=" "+RegExp.prototype.toString.call(r)),A(r)&&(f=" "+Date.prototype.toUTCString.call(r)),j(r)&&(f=" "+p(r)),0!==a.length||x&&0!=r.length?n<0?w(r)?t.stylize(RegExp.prototype.toString.call(r),"regexp"):t.stylize("[Object]","special"):(t.seen.push(r),c=x?function(t,e,r,n,o){for(var i=[],a=0,s=e.length;a<s;++a)P(e,String(a))?i.push(h(t,e,r,n,String(a),!0)):i.push("");return o.forEach((function(o){o.match(/^\d+$/)||i.push(h(t,e,r,n,o,!0));})),i}(t,r,n,s,a):a.map((function(e){return h(t,r,n,s,e,x)})),t.seen.pop(),function(t,e,r){if(t.reduce((function(t,e){return e.indexOf("\n")>=0&&0,t+e.replace(/\u001b\[\d\d?m/g,"").length+1}),0)>60)return r[0]+(""===e?"":e+"\n ")+" "+t.join(",\n  ")+" "+r[1];return r[0]+e+" "+t.join(", ")+" "+r[1]}(c,f,O)):O[0]+f+O[1]}function p(t){return "["+Error.prototype.toString.call(t)+"]"}function h(t,e,r,n,o,i){var a,s,u;if((u=Object.getOwnPropertyDescriptor(e,o)||{value:e[o]}).get?s=u.set?t.stylize("[Getter/Setter]","special"):t.stylize("[Getter]","special"):u.set&&(s=t.stylize("[Setter]","special")),P(n,o)||(a="["+o+"]"),s||(t.seen.indexOf(u.value)<0?(s=m(r)?l(t,u.value,null):l(t,u.value,r-1)).indexOf("\n")>-1&&(s=i?s.split("\n").map((function(t){return "  "+t})).join("\n").substr(2):"\n"+s.split("\n").map((function(t){return "   "+t})).join("\n")):s=t.stylize("[Circular]","special")),b(a)){if(i&&o.match(/^\d+$/))return s;(a=JSON.stringify(""+o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(a=a.substr(1,a.length-2),a=t.stylize(a,"name")):(a=a.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),a=t.stylize(a,"string"));}return a+": "+s}function d(t){return Array.isArray(t)}function g(t){return "boolean"==typeof t}function m(t){return null===t}function y(t){return "number"==typeof t}function v(t){return "string"==typeof t}function b(t){return void 0===t}function w(t){return x(t)&&"[object RegExp]"===O(t)}function x(t){return "object"===n(t)&&null!==t}function A(t){return x(t)&&"[object Date]"===O(t)}function j(t){return x(t)&&("[object Error]"===O(t)||t instanceof Error)}function S(t){return "function"==typeof t}function O(t){return Object.prototype.toString.call(t)}function E(t){return t<10?"0"+t.toString(10):t.toString(10)}e.debuglog=function(r){if(b(a)&&(a=t.env.NODE_DEBUG||""),r=r.toUpperCase(),!s[r])if(new RegExp("\\b"+r+"\\b","i").test(a)){var n=t.pid;s[r]=function(){var t=e.format.apply(e,arguments);console.error("%s %d: %s",r,n,t);};}else s[r]=function(){};return s[r]},e.inspect=u,u.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},u.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},e.isArray=d,e.isBoolean=g,e.isNull=m,e.isNullOrUndefined=function(t){return null==t},e.isNumber=y,e.isString=v,e.isSymbol=function(t){return "symbol"===n(t)},e.isUndefined=b,e.isRegExp=w,e.isObject=x,e.isDate=A,e.isError=j,e.isFunction=S,e.isPrimitive=function(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"===n(t)||void 0===t},e.isBuffer=r(56);var C=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function N(){var t=new Date,e=[E(t.getHours()),E(t.getMinutes()),E(t.getSeconds())].join(":");return [t.getDate(),C[t.getMonth()],e].join(" ")}function P(t,e){return Object.prototype.hasOwnProperty.call(t,e)}e.log=function(){console.log("%s - %s",N(),e.format.apply(e,arguments));},e.inherits=r(57),e._extend=function(t,e){if(!e||!x(e))return t;for(var r=Object.keys(e),n=r.length;n--;)t[r[n]]=e[r[n]];return t};var T="undefined"!=typeof Symbol?Symbol("util.promisify.custom"):void 0;function R(t,e){if(!t){var r=new Error("Promise was rejected with a falsy value");r.reason=t,t=r;}return e(t)}e.promisify=function(t){if("function"!=typeof t)throw new TypeError('The "original" argument must be of type Function');if(T&&t[T]){var e;if("function"!=typeof(e=t[T]))throw new TypeError('The "util.promisify.custom" argument must be of type Function');return Object.defineProperty(e,T,{value:e,enumerable:!1,writable:!1,configurable:!0}),e}function e(){for(var e,r,n=new Promise((function(t,n){e=t,r=n;})),o=[],i=0;i<arguments.length;i++)o.push(arguments[i]);o.push((function(t,n){t?r(t):e(n);}));try{t.apply(this,o);}catch(t){r(t);}return n}return Object.setPrototypeOf(e,Object.getPrototypeOf(t)),T&&Object.defineProperty(e,T,{value:e,enumerable:!1,writable:!1,configurable:!0}),Object.defineProperties(e,o(t))},e.promisify.custom=T,e.callbackify=function(e){if("function"!=typeof e)throw new TypeError('The "original" argument must be of type Function');function r(){for(var r=[],n=0;n<arguments.length;n++)r.push(arguments[n]);var o=r.pop();if("function"!=typeof o)throw new TypeError("The last argument must be of type Function");var i=this,a=function(){return o.apply(i,arguments)};e.apply(this,r).then((function(e){t.nextTick(a,null,e);}),(function(e){t.nextTick(R,e,a);}));}return Object.setPrototypeOf(r,Object.getPrototypeOf(e)),Object.defineProperties(r,o(e)),r};}).call(this,r(7));},function(t,e){function r(t){return (r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}t.exports=function(t){return t&&"object"===r(t)&&"function"==typeof t.copy&&"function"==typeof t.fill&&"function"==typeof t.readUInt8};},function(t,e){"function"==typeof Object.create?t.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}});}:t.exports=function(t,e){t.super_=e;var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t;};},function(t,e,r){t.exports=f,f.Minimatch=l;var n={sep:"/"};try{n=r(23);}catch(t){}var o=f.GLOBSTAR=l.GLOBSTAR={},i=r(59),a={"!":{open:"(?:(?!(?:",close:"))[^/]*?)"},"?":{open:"(?:",close:")?"},"+":{open:"(?:",close:")+"},"*":{open:"(?:",close:")*"},"@":{open:"(?:",close:")"}},s="().*{}+?[]^$\\!".split("").reduce((function(t,e){return t[e]=!0,t}),{});var u=/\/+/;function c(t,e){t=t||{},e=e||{};var r={};return Object.keys(e).forEach((function(t){r[t]=e[t];})),Object.keys(t).forEach((function(e){r[e]=t[e];})),r}function f(t,e,r){if("string"!=typeof e)throw new TypeError("glob pattern string required");return r||(r={}),!(!r.nocomment&&"#"===e.charAt(0))&&(""===e.trim()?""===t:new l(e,r).match(t))}function l(t,e){if(!(this instanceof l))return new l(t,e);if("string"!=typeof t)throw new TypeError("glob pattern string required");e||(e={}),t=t.trim(),"/"!==n.sep&&(t=t.split(n.sep).join("/")),this.options=e,this.set=[],this.pattern=t,this.regexp=null,this.negate=!1,this.comment=!1,this.empty=!1,this.make();}function p(t,e){if(e||(e=this instanceof l?this.options:{}),void 0===(t=void 0===t?this.pattern:t))throw new TypeError("undefined pattern");return e.nobrace||!t.match(/\{.*\}/)?[t]:i(t)}f.filter=function(t,e){return e=e||{},function(r,n,o){return f(r,t,e)}},f.defaults=function(t){if(!t||!Object.keys(t).length)return f;var e=f,r=function(r,n,o){return e.minimatch(r,n,c(t,o))};return r.Minimatch=function(r,n){return new e.Minimatch(r,c(t,n))},r},l.defaults=function(t){return t&&Object.keys(t).length?f.defaults(t).Minimatch:l},l.prototype.debug=function(){},l.prototype.make=function(){if(this._made)return;var t=this.pattern,e=this.options;if(!e.nocomment&&"#"===t.charAt(0))return void(this.comment=!0);if(!t)return void(this.empty=!0);this.parseNegate();var r=this.globSet=this.braceExpand();e.debug&&(this.debug=console.error);this.debug(this.pattern,r),r=this.globParts=r.map((function(t){return t.split(u)})),this.debug(this.pattern,r),r=r.map((function(t,e,r){return t.map(this.parse,this)}),this),this.debug(this.pattern,r),r=r.filter((function(t){return -1===t.indexOf(!1)})),this.debug(this.pattern,r),this.set=r;},l.prototype.parseNegate=function(){var t=this.pattern,e=!1,r=this.options,n=0;if(r.nonegate)return;for(var o=0,i=t.length;o<i&&"!"===t.charAt(o);o++)e=!e,n++;n&&(this.pattern=t.substr(n));this.negate=e;},f.braceExpand=function(t,e){return p(t,e)},l.prototype.braceExpand=p,l.prototype.parse=function(t,e){if(t.length>65536)throw new TypeError("pattern is too long");var r=this.options;if(!r.noglobstar&&"**"===t)return o;if(""===t)return "";var n,i="",u=!!r.nocase,c=!1,f=[],l=[],p=!1,d=-1,g=-1,m="."===t.charAt(0)?"":r.dot?"(?!(?:^|\\/)\\.{1,2}(?:$|\\/))":"(?!\\.)",y=this;function v(){if(n){switch(n){case"*":i+="[^/]*?",u=!0;break;case"?":i+="[^/]",u=!0;break;default:i+="\\"+n;}y.debug("clearStateChar %j %j",n,i),n=!1;}}for(var b,w=0,x=t.length;w<x&&(b=t.charAt(w));w++)if(this.debug("%s\t%s %s %j",t,w,i,b),c&&s[b])i+="\\"+b,c=!1;else switch(b){case"/":return !1;case"\\":v(),c=!0;continue;case"?":case"*":case"+":case"@":case"!":if(this.debug("%s\t%s %s %j <-- stateChar",t,w,i,b),p){this.debug("  in class"),"!"===b&&w===g+1&&(b="^"),i+=b;continue}y.debug("call clearStateChar %j",n),v(),n=b,r.noext&&v();continue;case"(":if(p){i+="(";continue}if(!n){i+="\\(";continue}f.push({type:n,start:w-1,reStart:i.length,open:a[n].open,close:a[n].close}),i+="!"===n?"(?:(?!(?:":"(?:",this.debug("plType %j %j",n,i),n=!1;continue;case")":if(p||!f.length){i+="\\)";continue}v(),u=!0;var A=f.pop();i+=A.close,"!"===A.type&&l.push(A),A.reEnd=i.length;continue;case"|":if(p||!f.length||c){i+="\\|",c=!1;continue}v(),i+="|";continue;case"[":if(v(),p){i+="\\"+b;continue}p=!0,g=w,d=i.length,i+=b;continue;case"]":if(w===g+1||!p){i+="\\"+b,c=!1;continue}if(p){var j=t.substring(g+1,w);try{RegExp("["+j+"]");}catch(t){var S=this.parse(j,h);i=i.substr(0,d)+"\\["+S[0]+"\\]",u=u||S[1],p=!1;continue}}u=!0,p=!1,i+=b;continue;default:v(),c?c=!1:!s[b]||"^"===b&&p||(i+="\\"),i+=b;}p&&(j=t.substr(g+1),S=this.parse(j,h),i=i.substr(0,d)+"\\["+S[0],u=u||S[1]);for(A=f.pop();A;A=f.pop()){var O=i.slice(A.reStart+A.open.length);this.debug("setting tail",i,A),O=O.replace(/((?:\\{2}){0,64})(\\?)\|/g,(function(t,e,r){return r||(r="\\"),e+e+r+"|"})),this.debug("tail=%j\n   %s",O,O,A,i);var E="*"===A.type?"[^/]*?":"?"===A.type?"[^/]":"\\"+A.type;u=!0,i=i.slice(0,A.reStart)+E+"\\("+O;}v(),c&&(i+="\\\\");var C=!1;switch(i.charAt(0)){case".":case"[":case"(":C=!0;}for(var N=l.length-1;N>-1;N--){var P=l[N],T=i.slice(0,P.reStart),R=i.slice(P.reStart,P.reEnd-8),F=i.slice(P.reEnd-8,P.reEnd),k=i.slice(P.reEnd);F+=k;var D=T.split("(").length-1,L=k;for(w=0;w<D;w++)L=L.replace(/\)[+*?]?/,"");var U="";""===(k=L)&&e!==h&&(U="$"),i=T+R+k+U+F;}""!==i&&u&&(i="(?=.)"+i);C&&(i=m+i);if(e===h)return [i,u];if(!u)return function(t){return t.replace(/\\(.)/g,"$1")}(t);var I=r.nocase?"i":"";try{var M=new RegExp("^"+i+"$",I);}catch(t){return new RegExp("$.")}return M._glob=t,M._src=i,M};var h={};f.makeRe=function(t,e){return new l(t,e||{}).makeRe()},l.prototype.makeRe=function(){if(this.regexp||!1===this.regexp)return this.regexp;var t=this.set;if(!t.length)return this.regexp=!1,this.regexp;var e=this.options,r=e.noglobstar?"[^/]*?":e.dot?"(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?":"(?:(?!(?:\\/|^)\\.).)*?",n=e.nocase?"i":"",i=t.map((function(t){return t.map((function(t){return t===o?r:"string"==typeof t?function(t){return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}(t):t._src})).join("\\/")})).join("|");i="^(?:"+i+")$",this.negate&&(i="^(?!"+i+").*$");try{this.regexp=new RegExp(i,n);}catch(t){this.regexp=!1;}return this.regexp},f.match=function(t,e,r){var n=new l(e,r=r||{});return t=t.filter((function(t){return n.match(t)})),n.options.nonull&&!t.length&&t.push(e),t},l.prototype.match=function(t,e){if(this.debug("match",t,this.pattern),this.comment)return !1;if(this.empty)return ""===t;if("/"===t&&e)return !0;var r=this.options;"/"!==n.sep&&(t=t.split(n.sep).join("/"));t=t.split(u),this.debug(this.pattern,"split",t);var o,i,a=this.set;for(this.debug(this.pattern,"set",a),i=t.length-1;i>=0&&!(o=t[i]);i--);for(i=0;i<a.length;i++){var s=a[i],c=t;if(r.matchBase&&1===s.length&&(c=[o]),this.matchOne(c,s,e))return !!r.flipNegate||!this.negate}return !r.flipNegate&&this.negate},l.prototype.matchOne=function(t,e,r){var n=this.options;this.debug("matchOne",{this:this,file:t,pattern:e}),this.debug("matchOne",t.length,e.length);for(var i=0,a=0,s=t.length,u=e.length;i<s&&a<u;i++,a++){this.debug("matchOne loop");var c,f=e[a],l=t[i];if(this.debug(e,f,l),!1===f)return !1;if(f===o){this.debug("GLOBSTAR",[e,f,l]);var p=i,h=a+1;if(h===u){for(this.debug("** at the end");i<s;i++)if("."===t[i]||".."===t[i]||!n.dot&&"."===t[i].charAt(0))return !1;return !0}for(;p<s;){var d=t[p];if(this.debug("\nglobstar while",t,p,e,h,d),this.matchOne(t.slice(p),e.slice(h),r))return this.debug("globstar found match!",p,s,d),!0;if("."===d||".."===d||!n.dot&&"."===d.charAt(0)){this.debug("dot detected!",t,p,e,h);break}this.debug("globstar swallow a segment, and continue"),p++;}return !(!r||(this.debug("\n>>> no match, partial?",t,p,e,h),p!==s))}if("string"==typeof f?(c=n.nocase?l.toLowerCase()===f.toLowerCase():l===f,this.debug("string match",f,l,c)):(c=l.match(f),this.debug("pattern match",f,l,c)),!c)return !1}if(i===s&&a===u)return !0;if(i===s)return r;if(a===u)return i===s-1&&""===t[i];throw new Error("wtf?")};},function(t,e,r){var n=r(60),o=r(61);t.exports=function(t){if(!t)return [];"{}"===t.substr(0,2)&&(t="\\{\\}"+t.substr(2));return function t(e,r){var i=[],a=o("{","}",e);if(!a||/\$$/.test(a.pre))return [e];var u,c=/^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(a.body),l=/^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(a.body),m=c||l,y=a.body.indexOf(",")>=0;if(!m&&!y)return a.post.match(/,.*\}/)?(e=a.pre+"{"+a.body+s+a.post,t(e)):[e];if(m)u=a.body.split(/\.\./);else {if(1===(u=function t(e){if(!e)return [""];var r=[],n=o("{","}",e);if(!n)return e.split(",");var i=n.pre,a=n.body,s=n.post,u=i.split(",");u[u.length-1]+="{"+a+"}";var c=t(s);s.length&&(u[u.length-1]+=c.shift(),u.push.apply(u,c));return r.push.apply(r,u),r}(a.body)).length)if(1===(u=t(u[0],!1).map(p)).length)return (w=a.post.length?t(a.post,!1):[""]).map((function(t){return a.pre+u[0]+t}))}var v,b=a.pre,w=a.post.length?t(a.post,!1):[""];if(m){var x=f(u[0]),A=f(u[1]),j=Math.max(u[0].length,u[1].length),S=3==u.length?Math.abs(f(u[2])):1,O=d;A<x&&(S*=-1,O=g);var E=u.some(h);v=[];for(var C=x;O(C,A);C+=S){var N;if(l)"\\"===(N=String.fromCharCode(C))&&(N="");else if(N=String(C),E){var P=j-N.length;if(P>0){var T=new Array(P+1).join("0");N=C<0?"-"+T+N.slice(1):T+N;}}v.push(N);}}else v=n(u,(function(e){return t(e,!1)}));for(var R=0;R<v.length;R++)for(var F=0;F<w.length;F++){var k=b+v[R]+w[F];(!r||m||k)&&i.push(k);}return i}(function(t){return t.split("\\\\").join(i).split("\\{").join(a).split("\\}").join(s).split("\\,").join(u).split("\\.").join(c)}(t),!0).map(l)};var i="\0SLASH"+Math.random()+"\0",a="\0OPEN"+Math.random()+"\0",s="\0CLOSE"+Math.random()+"\0",u="\0COMMA"+Math.random()+"\0",c="\0PERIOD"+Math.random()+"\0";function f(t){return parseInt(t,10)==t?parseInt(t,10):t.charCodeAt(0)}function l(t){return t.split(i).join("\\").split(a).join("{").split(s).join("}").split(u).join(",").split(c).join(".")}function p(t){return "{"+t+"}"}function h(t){return /^-?0\d/.test(t)}function d(t,e){return t<=e}function g(t,e){return t>=e}},function(t,e){t.exports=function(t,e){for(var n=[],o=0;o<t.length;o++){var i=e(t[o],o);r(i)?n.push.apply(n,i):n.push(i);}return n};var r=Array.isArray||function(t){return "[object Array]"===Object.prototype.toString.call(t)};},function(t,e,r){function n(t,e,r){t instanceof RegExp&&(t=o(t,r)),e instanceof RegExp&&(e=o(e,r));var n=i(t,e,r);return n&&{start:n[0],end:n[1],pre:r.slice(0,n[0]),body:r.slice(n[0]+t.length,n[1]),post:r.slice(n[1]+e.length)}}function o(t,e){var r=e.match(t);return r?r[0]:null}function i(t,e,r){var n,o,i,a,s,u=r.indexOf(t),c=r.indexOf(e,u+1),f=u;if(u>=0&&c>0){for(n=[],i=r.length;f>=0&&!s;)f==u?(n.push(f),u=r.indexOf(t,f+1)):1==n.length?s=[n.pop(),c]:((o=n.pop())<i&&(i=o,a=c),c=r.indexOf(e,f+1)),f=u<c&&u>=0?u:c;n.length&&(s=[i,a]);}return s}t.exports=n,n.range=i;},function(t,e,r){var n=r(63),o=r(6),i=r(6),a=r(3).buildOptions,s=r(65);e.parse=function(t,e,r){if(r){!0===r&&(r={});var u=s.validate(t,r);if(!0!==u)throw Error(u.err.msg)}return e=a(e,i.defaultOptions,i.props),n.convertToJson(o.getTraversalObj(t,e),e)},e.convertTonimn=r(66).convert2nimn,e.getTraversalObj=o.getTraversalObj,e.convertToJson=n.convertToJson,e.convertToJsonString=r(67).convertToJsonString,e.validate=s.validate,e.j2xParser=r(68),e.parseToNimn=function(t,r,n){return e.convertTonimn(e.getTraversalObj(t,n),r,n)};},function(t,e,r){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(3);e.convertToJson=function t(e,r){var i={};if(!(e.child&&!o.isEmptyObject(e.child)||e.attrsMap&&!o.isEmptyObject(e.attrsMap)))return o.isExist(e.val)?e.val:"";o.isExist(e.val)&&("string"!=typeof e.val||""!==e.val&&e.val!==r.cdataPositionChar)&&("strict"===r.arrayMode?i[r.textNodeName]=[e.val]:i[r.textNodeName]=e.val),o.merge(i,e.attrsMap,r.arrayMode);for(var a=Object.keys(e.child),s=0;s<a.length;s++){var u=a[s];if(e.child[u]&&e.child[u].length>1)for(var c in i[u]=[],e.child[u])i[u].push(t(e.child[u][c],r));else if(!0===r.arrayMode){var f=t(e.child[u][0],r);"object"===n(f)?i[u]=[f]:i[u]=f;}else "strict"===r.arrayMode?i[u]=[t(e.child[u][0],r)]:i[u]=t(e.child[u][0],r);}return i};},function(t,e,r){t.exports=function(t,e,r){this.tagname=t,this.parent=e,this.child={},this.attrsMap={},this.val=r,this.addChild=function(t){Array.isArray(this.child[t.tagname])?this.child[t.tagname].push(t):this.child[t.tagname]=[t];};};},function(t,e,r){var n=r(3),o={allowBooleanAttributes:!1},i=["allowBooleanAttributes"];function a(t,e){for(var r=e;e<t.length;e++)if("?"!=t[e]&&" "!=t[e]);else {var n=t.substr(r,e-r);if(e>5&&"xml"===n)return p("InvalidXml","XML declaration allowed only at the start of the document.",d(t,e));if("?"==t[e]&&">"==t[e+1]){e++;break}}return e}function s(t,e){if(t.length>e+5&&"-"===t[e+1]&&"-"===t[e+2]){for(e+=3;e<t.length;e++)if("-"===t[e]&&"-"===t[e+1]&&">"===t[e+2]){e+=2;break}}else if(t.length>e+8&&"D"===t[e+1]&&"O"===t[e+2]&&"C"===t[e+3]&&"T"===t[e+4]&&"Y"===t[e+5]&&"P"===t[e+6]&&"E"===t[e+7]){var r=1;for(e+=8;e<t.length;e++)if("<"===t[e])r++;else if(">"===t[e]&&0===--r)break}else if(t.length>e+9&&"["===t[e+1]&&"C"===t[e+2]&&"D"===t[e+3]&&"A"===t[e+4]&&"T"===t[e+5]&&"A"===t[e+6]&&"["===t[e+7])for(e+=8;e<t.length;e++)if("]"===t[e]&&"]"===t[e+1]&&">"===t[e+2]){e+=2;break}return e}e.validate=function(t,e){e=n.buildOptions(e,o,i);var r,c=[],h=!1,g=!1;"\ufeff"===t[0]&&(t=t.substr(1));for(var m=0;m<t.length;m++){if("<"!==t[m]){if(" "===t[m]||"\t"===t[m]||"\n"===t[m]||"\r"===t[m])continue;return p("InvalidChar","char '".concat(t[m],"' is not expected."),d(t,m))}if("?"===t[++m]){if((m=a(t,++m)).err)return m}else {if("!"===t[m]){m=s(t,m);continue}var y=!1;"/"===t[m]&&(y=!0,m++);for(var v="";m<t.length&&">"!==t[m]&&" "!==t[m]&&"\t"!==t[m]&&"\n"!==t[m]&&"\r"!==t[m];m++)v+=t[m];if("/"===(v=v.trim())[v.length-1]&&(v=v.substring(0,v.length-1),m--),r=v,!n.isName(r)){return p("InvalidTag",0===v.trim().length?"There is an unnecessary space between tag name and backward slash '</ ..'.":"Tag '".concat(v,"' is an invalid name."),d(t,m))}var b=u(t,m);if(!1===b)return p("InvalidAttr","Attributes for '".concat(v,"' have open quote."),d(t,m));var w=b.value;if(m=b.index,"/"===w[w.length-1]){var x=f(w=w.substring(0,w.length-1),e);if(!0!==x)return p(x.err.code,x.err.msg,d(t,m-w.length+x.err.line));h=!0;}else if(y){if(!b.tagClosed)return p("InvalidTag","Closing tag '".concat(v,"' doesn't have proper closing."),d(t,m));if(w.trim().length>0)return p("InvalidTag","Closing tag '".concat(v,"' can't have attributes or invalid starting."),d(t,m));var A=c.pop();if(v!==A)return p("InvalidTag","Closing tag '".concat(A,"' is expected inplace of '").concat(v,"'."),d(t,m));0==c.length&&(g=!0);}else {var j=f(w,e);if(!0!==j)return p(j.err.code,j.err.msg,d(t,m-w.length+j.err.line));if(!0===g)return p("InvalidXml","Multiple possible root nodes found.",d(t,m));c.push(v),h=!0;}for(m++;m<t.length;m++){if("<"===t[m]){if("!"===t[m+1]){m=s(t,++m);continue}break}if("&"===t[m]){var S=l(t,m);if(-1==S)return p("InvalidChar","char '&' is not expected.",d(t,m));m=S;}}"<"===t[m]&&m--;}}return h?!(c.length>0)||p("InvalidXml","Invalid '".concat(JSON.stringify(c,null,4).replace(/\r?\n/g,""),"' found."),1):p("InvalidXml","Start tag expected.",1)};function u(t,e){for(var r="",n="",o=!1;e<t.length;e++){if('"'===t[e]||"'"===t[e])if(""===n)n=t[e];else {if(n!==t[e])continue;n="";}else if(">"===t[e]&&""===n){o=!0;break}r+=t[e];}return ""===n&&{value:r,index:e,tagClosed:o}}var c=new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?","g");function f(t,e){for(var r=n.getAllMatches(t,c),o={},i=0;i<r.length;i++){if(0===r[i][1].length)return p("InvalidAttr","Attribute '".concat(r[i][2],"' has no space in starting."),g(t,r[i][0]));if(void 0===r[i][3]&&!e.allowBooleanAttributes)return p("InvalidAttr","boolean attribute '".concat(r[i][2],"' is not allowed."),g(t,r[i][0]));var a=r[i][2];if(!h(a))return p("InvalidAttr","Attribute '".concat(a,"' is an invalid name."),g(t,r[i][0]));if(o.hasOwnProperty(a))return p("InvalidAttr","Attribute '".concat(a,"' is repeated."),g(t,r[i][0]));o[a]=1;}return !0}function l(t,e){if(";"===t[++e])return -1;if("#"===t[e])return function(t,e){var r=/\d/;for("x"===t[e]&&(e++,r=/[\da-fA-F]/);e<t.length;e++){if(";"===t[e])return e;if(!t[e].match(r))break}return -1}(t,++e);for(var r=0;e<t.length;e++,r++)if(!(t[e].match(/\w/)&&r<20)){if(";"===t[e])break;return -1}return e}function p(t,e,r){return {err:{code:t,msg:e,line:r}}}function h(t){return n.isName(t)}function d(t,e){return t.substring(0,e).split(/\r?\n/).length}function g(t,e){return t.indexOf(e)+e.length}},function(t,e,r){var n=function(t){return String.fromCharCode(t)},o={nilChar:n(176),missingChar:n(201),nilPremitive:n(175),missingPremitive:n(200),emptyChar:n(178),emptyValue:n(177),boundryChar:n(179),objStart:n(198),arrStart:n(204),arrayEnd:n(185)},i=[o.nilChar,o.nilPremitive,o.missingChar,o.missingPremitive,o.boundryChar,o.emptyChar,o.emptyValue,o.arrayEnd,o.objStart,o.arrStart],a=function t(e,r,n){if("string"==typeof r)return e&&e[0]&&void 0!==e[0].val?s(e[0].val):s(e);var i,a=void 0===(i=e)?o.missingChar:null===i?o.nilChar:!(i.child&&0===Object.keys(i.child).length&&(!i.attrsMap||0===Object.keys(i.attrsMap).length))||o.emptyChar;if(!0===a){var c="";if(Array.isArray(r)){c+=o.arrStart;var f=r[0],l=e.length;if("string"==typeof f)for(var p=0;p<l;p++){var h=s(e[p].val);c=u(c,h);}else for(var d=0;d<l;d++){var g=t(e[d],f,n);c=u(c,g);}c+=o.arrayEnd;}else {c+=o.objStart;var m=Object.keys(r);for(var y in Array.isArray(e)&&(e=e[0]),m){var v=m[y],b=void 0;b=!n.ignoreAttributes&&e.attrsMap&&e.attrsMap[v]?t(e.attrsMap[v],r[v],n):v===n.textNodeName?t(e.val,r[v],n):t(e.child[v],r[v],n),c=u(c,b);}}return c}return a},s=function(t){switch(t){case void 0:return o.missingPremitive;case null:return o.nilPremitive;case"":return o.emptyValue;default:return t}},u=function(t,e){return c(e[0])||c(t[t.length-1])||(t+=o.boundryChar),t+e},c=function(t){return -1!==i.indexOf(t)};var f=r(6),l=r(3).buildOptions;e.convert2nimn=function(t,e,r){return r=l(r,f.defaultOptions,f.props),a(t,e,r)};},function(t,e,r){var n=r(3),o=r(3).buildOptions,i=r(6),a=function t(e,r,o){for(var i,a="{",s=Object.keys(e.child),u=0;u<s.length;u++){var c=s[u];if(e.child[c]&&e.child[c].length>1){for(var f in a+='"'+c+'" : [ ',e.child[c])a+=t(e.child[c][f],r)+" , ";a=a.substr(0,a.length-1)+" ] ";}else a+='"'+c+'" : '+t(e.child[c][0],r)+" ,";}return n.merge(a,e.attrsMap),n.isEmptyObject(a)?n.isExist(e.val)?e.val:"":(n.isExist(e.val)&&("string"!=typeof e.val||""!==e.val&&e.val!==r.cdataPositionChar)&&(a+='"'+r.textNodeName+'" : '+(!0!==(i=e.val)&&!1!==i&&isNaN(i)?'"'+i+'"':i)),","===a[a.length-1]&&(a=a.substr(0,a.length-2)),a+"}")};e.convertToJsonString=function(t,e){return (e=o(e,i.defaultOptions,i.props)).indentBy=e.indentBy||"",a(t,e)};},function(t,e,r){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(3).buildOptions,i={attributeNamePrefix:"@_",attrNodeName:!1,textNodeName:"#text",ignoreAttributes:!0,cdataTagName:!1,cdataPositionChar:"\\c",format:!1,indentBy:"  ",supressEmptyNode:!1,tagValueProcessor:function(t){return t},attrValueProcessor:function(t){return t}},a=["attributeNamePrefix","attrNodeName","textNodeName","ignoreAttributes","cdataTagName","cdataPositionChar","format","indentBy","supressEmptyNode","tagValueProcessor","attrValueProcessor"];function s(t){this.options=o(t,i,a),this.options.ignoreAttributes||this.options.attrNodeName?this.isAttribute=function(){return !1}:(this.attrPrefixLen=this.options.attributeNamePrefix.length,this.isAttribute=g),this.options.cdataTagName?this.isCDATA=m:this.isCDATA=function(){return !1},this.replaceCDATAstr=u,this.replaceCDATAarr=c,this.options.format?(this.indentate=d,this.tagEndChar=">\n",this.newLine="\n"):(this.indentate=function(){return ""},this.tagEndChar=">",this.newLine=""),this.options.supressEmptyNode?(this.buildTextNode=h,this.buildObjNode=l):(this.buildTextNode=p,this.buildObjNode=f),this.buildTextValNode=p,this.buildObjectNode=f;}function u(t,e){return t=this.options.tagValueProcessor(""+t),""===this.options.cdataPositionChar||""===t?t+"<![CDATA["+e+"]]"+this.tagEndChar:t.replace(this.options.cdataPositionChar,"<![CDATA["+e+"]]"+this.tagEndChar)}function c(t,e){if(t=this.options.tagValueProcessor(""+t),""===this.options.cdataPositionChar||""===t)return t+"<![CDATA["+e.join("]]><![CDATA[")+"]]"+this.tagEndChar;for(var r in e)t=t.replace(this.options.cdataPositionChar,"<![CDATA["+e[r]+"]]>");return t+this.newLine}function f(t,e,r,n){return r&&!t.includes("<")?this.indentate(n)+"<"+e+r+">"+t+"</"+e+this.tagEndChar:this.indentate(n)+"<"+e+r+this.tagEndChar+t+this.indentate(n)+"</"+e+this.tagEndChar}function l(t,e,r,n){return ""!==t?this.buildObjectNode(t,e,r,n):this.indentate(n)+"<"+e+r+"/"+this.tagEndChar}function p(t,e,r,n){return this.indentate(n)+"<"+e+r+">"+this.options.tagValueProcessor(t)+"</"+e+this.tagEndChar}function h(t,e,r,n){return ""!==t?this.buildTextValNode(t,e,r,n):this.indentate(n)+"<"+e+r+"/"+this.tagEndChar}function d(t){return this.options.indentBy.repeat(t)}function g(t){return !!t.startsWith(this.options.attributeNamePrefix)&&t.substr(this.attrPrefixLen)}function m(t){return t===this.options.cdataTagName}s.prototype.parse=function(t){return this.j2x(t,0).val},s.prototype.j2x=function(t,e){for(var r="",o="",i=Object.keys(t),a=i.length,s=0;s<a;s++){var u=i[s];if(void 0===t[u]);else if(null===t[u])o+=this.indentate(e)+"<"+u+"/"+this.tagEndChar;else if(t[u]instanceof Date)o+=this.buildTextNode(t[u],u,"",e);else if("object"!==n(t[u])){var c=this.isAttribute(u);c?r+=" "+c+'="'+this.options.attrValueProcessor(""+t[u])+'"':this.isCDATA(u)?t[this.options.textNodeName]?o+=this.replaceCDATAstr(t[this.options.textNodeName],t[u]):o+=this.replaceCDATAstr("",t[u]):u===this.options.textNodeName?t[this.options.cdataTagName]||(o+=this.options.tagValueProcessor(""+t[u])):o+=this.buildTextNode(t[u],u,"",e);}else if(Array.isArray(t[u]))if(this.isCDATA(u))o+=this.indentate(e),t[this.options.textNodeName]?o+=this.replaceCDATAarr(t[this.options.textNodeName],t[u]):o+=this.replaceCDATAarr("",t[u]);else for(var f=t[u].length,l=0;l<f;l++){var p=t[u][l];if(void 0===p);else if(null===p)o+=this.indentate(e)+"<"+u+"/"+this.tagEndChar;else if("object"===n(p)){var h=this.j2x(p,e+1);o+=this.buildObjNode(h.val,u,h.attrStr,e);}else o+=this.buildTextNode(p,u,"",e);}else if(this.options.attrNodeName&&u===this.options.attrNodeName)for(var d=Object.keys(t[u]),g=d.length,m=0;m<g;m++)r+=" "+d[m]+'="'+this.options.attrValueProcessor(""+t[u][d[m]])+'"';else {var y=this.j2x(t[u],e+1);o+=this.buildObjNode(y.val,u,y.attrStr,e);}}return {attrStr:r,val:o}},t.exports=s;},function(t,e,r){/**
* @license nested-property https://github.com/cosmosio/nested-property
*
* The MIT License (MIT)
*
* Copyright (c) 2014-2020 Olivier Scherrer <pode.fr@gmail.com>
*/function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}t.exports={set:function(t,e,r){if(t&&"object"==n(t)){if("string"==typeof e&&""!==e){var o=e.split(".");return o.reduce((function(t,e,n){var i=Number.isInteger(Number(o[n+1]));return t[e]=t[e]||(i?[]:{}),o.length==n+1&&(t[e]=r),t[e]}),t)}return "number"==typeof e?(t[e]=r,t[e]):t}return t},get:function(t,e){return t&&"object"==n(t)?"string"==typeof e&&""!==e?e.split(".").reduce((function(t,e){return t&&t[e]}),t):"number"==typeof e?t[e]:t:t},has:function(t,e,r){return r=r||{},!(!t||"object"!=n(t))&&("string"==typeof e&&""!==e?e.split(".").reduce((function(t,e,o,i){return o==i.length-1?r.own?!(!t||!t.hasOwnProperty(e)):!(null===t||"object"!=n(t)||!(e in t)):t&&t[e]}),t):"number"==typeof e&&e in t)},hasOwn:function(t,e,r){return this.has(t,e,r||{own:!0})},isIn:function(t,e,r,o){if(o=o||{},t&&"object"==n(t)){if("string"==typeof e&&""!==e){var i,a=e.split("."),s=!1;return i=!!a.reduce((function(t,e){return s=s||t===r||!!t&&t[e]===r,t&&t[e]}),t),o.validPath?s&&i:s}return !1}return !1}};},function(t,e,r){var n=r(2),o=r(1),i=o.encodePath,a=o.joinURL,s=o.prepareRequestOptions,u=o.request;t.exports={createDirectory:function(t,e){var r={url:a(e.remoteURL,i(t)),method:"MKCOL"};return s(r,e),u(r).then(n.handleResponseCode)}};},function(t,e,r){var n=r(2).handleResponseCode,o=r(1),i=o.encodePath,a=o.joinURL,s=o.prepareRequestOptions,u=o.request;t.exports={customRequest:function(t,e,r){return e.url||(e.url=a(r.remoteURL,i(t),"/")),s(e,r),u(e).then(n)}};},function(t,e,r){var n=r(2),o=r(1),i=o.encodePath,a=o.joinURL,s=o.prepareRequestOptions,u=o.request;t.exports={deleteFile:function(t,e){var r={url:a(e.remoteURL,i(t)),method:"DELETE"};return s(r,e),u(r).then(n.handleResponseCode)}};},function(t,e,r){var n=r(25).getStat;t.exports={pathExists:function(t,e){return n(t,e).then((function(){return !0})).catch((function(t){if(t.response&&404===t.response.status)return !1;throw t}))}};},function(t,e,r){var n=r(2),o=n.handleResponseCode,i=n.processResponsePayload,a=r(1),s=a.encodePath,u=a.joinURL,c=a.prepareRequestOptions,f=a.request,l=r(5).fromBase64;t.exports={getFileContentsBuffer:function(t,e){var r={url:u(e.remoteURL,s(t)),method:"GET",responseType:"arraybuffer"};return c(r,e),f(r).then(o).then((function(t){return i(t,t.data,e.details)}))},getFileContentsString:function(t,e){var r={url:u(e.remoteURL,s(t)),method:"GET",responseType:"text"};return c(r,e),f(r).then(o).then((function(t){return i(t,t.data,e.details)}))},getFileLink:function(t,e){var r=u(e.remoteURL,s(t)),n=/^https:/i.test(r)?"https":"http";if(e.headers&&e.headers.Authorization){if(!1===/^Basic /i.test(e.headers.Authorization))throw new Error("Failed retrieving download link: Invalid authorisation method");var o=e.headers.Authorization.replace(/^Basic /i,"").trim(),i=l(o);r=r.replace(/^https?:\/\//,"".concat(n,"://").concat(i,"@"));}return r}};},function(t,e,r){function n(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var r=[],n=!0,o=!1,i=void 0;try{for(var a,s=t[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!e||r.length!==e);n=!0);}catch(t){o=!0,i=t;}finally{try{n||null==s.return||s.return();}finally{if(o)throw i}}return r}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var i=r(2),a=i.handleResponseCode,s=i.processResponsePayload,u=r(1),c=(u.encodePath,u.joinURL),f=u.prepareRequestOptions,l=u.request,p=r(9),h=p.parseXML,d=p.translateDiskSpace;function g(t){try{var e=n(t.multistatus.response,1)[0].propstat.prop,r=e["quota-used-bytes"],o=e["quota-available-bytes"];return void 0!==r&&void 0!==o?{used:parseInt(r,10),available:d(o)}:null}catch(t){}return null}t.exports={getQuota:function(t){var e={url:c(t.remoteURL,"/"),method:"PROPFIND",headers:{Accept:"text/plain",Depth:0},responseType:"text"},r=null;return f(e,t),l(e).then(a).then((function(t){return r=t,t.data})).then(h).then(g).then((function(e){return s(r,e,t.details)}))}};},function(t,e,r){var n=r(2),o=r(1),i=o.encodePath,a=o.joinURL,s=o.prepareRequestOptions,u=o.request;t.exports={moveFile:function(t,e,r){var o={url:a(r.remoteURL,i(t)),method:"MOVE",headers:{Destination:a(r.remoteURL,i(e))}};return s(o,r),u(o).then(n.handleResponseCode)}};},function(t,e,r){var n=r(2),o=r(1),i=o.encodePath,a=o.joinURL,s=o.prepareRequestOptions,u=o.request;t.exports={copyFile:function(t,e,r){var o={url:a(r.remoteURL,i(t)),method:"COPY",headers:{Destination:a(r.remoteURL,i(e))}};return s(o,r),u(o).then(n.handleResponseCode)}};},function(t,e,r){var n=r(4).merge,o=r(2),i=r(1),a=i.encodePath,s=i.joinURL,u=i.prepareRequestOptions,c=i.request,f=r(5).fromBase64;t.exports={getFileUploadLink:function(t,e){var r=s(e.remoteURL,a(t)),n=/^https:/i.test(r+="?Content-Type=application/octet-stream")?"https":"http";if(e.headers&&e.headers.Authorization){if(!1===/^Basic /i.test(e.headers.Authorization))throw new Error("Failed retrieving download link: Invalid authorisation method");var o=e.headers.Authorization.replace(/^Basic /i,"").trim(),i=f(o);r=r.replace(/^https?:\/\//,"".concat(n,"://").concat(i,"@"));}return r},putFileContents:function(t,e,r){var i={"Content-Length":e.length},f=n({headers:{"Content-Type":"application/octet-stream"},overwrite:!0},{headers:i},r||{});!1===f.overwrite&&(f.headers["If-None-Match"]="*");var l={url:s(r.remoteURL,a(t)),method:"PUT",headers:f.headers,data:e};return u(l,r),c(l).then(o.handleResponseCode)}};}])}));
});

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IE11 doesn't support classList on SVG elements, so we emulate it with a Set
class ClassList {
    constructor(element) {
        this.classes = new Set();
        this.changed = false;
        this.element = element;
        const classList = (element.getAttribute('class') || '').split(/\s+/);
        for (const cls of classList) {
            this.classes.add(cls);
        }
    }
    add(cls) {
        this.classes.add(cls);
        this.changed = true;
    }
    remove(cls) {
        this.classes.delete(cls);
        this.changed = true;
    }
    commit() {
        if (this.changed) {
            let classString = '';
            this.classes.forEach((cls) => classString += cls + ' ');
            this.element.setAttribute('class', classString);
        }
    }
}
/**
 * Stores the ClassInfo object applied to a given AttributePart.
 * Used to unset existing values when a new ClassInfo object is applied.
 */
const previousClassesCache = new WeakMap();
/**
 * A directive that applies CSS classes. This must be used in the `class`
 * attribute and must be the only part used in the attribute. It takes each
 * property in the `classInfo` argument and adds the property name to the
 * element's `class` if the property value is truthy; if the property value is
 * falsey, the property name is removed from the element's `class`. For example
 * `{foo: bar}` applies the class `foo` if the value of `bar` is truthy.
 * @param classInfo {ClassInfo}
 */
const classMap = directive((classInfo) => (part) => {
    if (!(part instanceof AttributePart) || (part instanceof PropertyPart) ||
        part.committer.name !== 'class' || part.committer.parts.length > 1) {
        throw new Error('The `classMap` directive must be used in the `class` attribute ' +
            'and must be the only part in the attribute.');
    }
    const { committer } = part;
    const { element } = committer;
    let previousClasses = previousClassesCache.get(part);
    if (previousClasses === undefined) {
        // Write static classes once
        // Use setAttribute() because className isn't a string on SVG elements
        element.setAttribute('class', committer.strings.join(' '));
        previousClassesCache.set(part, previousClasses = new Set());
    }
    const classList = (element.classList || new ClassList(element));
    // Remove old classes that no longer apply
    // We use forEach() instead of for-of so that re don't require down-level
    // iteration.
    previousClasses.forEach((name) => {
        if (!(name in classInfo)) {
            classList.remove(name);
            previousClasses.delete(name);
        }
    });
    // Add or remove classes based on their classMap value
    for (const name in classInfo) {
        const value = classInfo[name];
        if (value != previousClasses.has(name)) {
            // We explicitly want a loose truthy check of `value` because it seems
            // more convenient that '' and 0 are skipped.
            if (value) {
                classList.add(name);
                previousClasses.add(name);
            }
            else {
                classList.remove(name);
                previousClasses.delete(name);
            }
        }
    }
    if (typeof classList.commit === 'function') {
        classList.commit();
    }
});

var tabulator = createCommonjsModule(function (module, exports) {
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
(function (global, factory) {
	if (( _typeof(exports)) === 'object' && 'object' !== 'undefined') {
		module.exports = factory();
	} else {
		global.Tabulator = factory();
	}
})(commonjsGlobal, function () {

	// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex


	if (!Array.prototype.findIndex) {

		Object.defineProperty(Array.prototype, 'findIndex', {

			value: function value(predicate) {

				// 1. Let O be ? ToObject(this value).


				if (this == null) {

					throw new TypeError('"this" is null or not defined');
				}

				var o = Object(this);

				// 2. Let len be ? ToLength(? Get(O, "length")).


				var len = o.length >>> 0;

				// 3. If IsCallable(predicate) is false, throw a TypeError exception.


				if (typeof predicate !== 'function') {

					throw new TypeError('predicate must be a function');
				}

				// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


				var thisArg = arguments[1];

				// 5. Let k be 0.


				var k = 0;

				// 6. Repeat, while k < len


				while (k < len) {

					// a. Let Pk be ! ToString(k).


					// b. Let kValue be ? Get(O, Pk).


					// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).


					// d. If testResult is true, return k.


					var kValue = o[k];

					if (predicate.call(thisArg, kValue, k, o)) {

						return k;
					}

					// e. Increase k by 1.


					k++;
				}

				// 7. Return -1.


				return -1;
			}

		});
	}

	// https://tc39.github.io/ecma262/#sec-array.prototype.find


	if (!Array.prototype.find) {

		Object.defineProperty(Array.prototype, 'find', {

			value: function value(predicate) {

				// 1. Let O be ? ToObject(this value).


				if (this == null) {

					throw new TypeError('"this" is null or not defined');
				}

				var o = Object(this);

				// 2. Let len be ? ToLength(? Get(O, "length")).


				var len = o.length >>> 0;

				// 3. If IsCallable(predicate) is false, throw a TypeError exception.


				if (typeof predicate !== 'function') {

					throw new TypeError('predicate must be a function');
				}

				// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


				var thisArg = arguments[1];

				// 5. Let k be 0.


				var k = 0;

				// 6. Repeat, while k < len


				while (k < len) {

					// a. Let Pk be ! ToString(k).


					// b. Let kValue be ? Get(O, Pk).


					// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).


					// d. If testResult is true, return kValue.


					var kValue = o[k];

					if (predicate.call(thisArg, kValue, k, o)) {

						return kValue;
					}

					// e. Increase k by 1.


					k++;
				}

				// 7. Return undefined.


				return undefined;
			}

		});
	}

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill


	if (!String.prototype.includes) {

		String.prototype.includes = function (search, start) {

			if (search instanceof RegExp) {

				throw TypeError('first argument must not be a RegExp');
			}

			if (start === undefined) {
				start = 0;
			}

			return this.indexOf(search, start) !== -1;
		};
	}

	// https://tc39.github.io/ecma262/#sec-array.prototype.includes


	if (!Array.prototype.includes) {

		Object.defineProperty(Array.prototype, 'includes', {

			value: function value(searchElement, fromIndex) {

				if (this == null) {

					throw new TypeError('"this" is null or not defined');
				}

				// 1. Let O be ? ToObject(this value).


				var o = Object(this);

				// 2. Let len be ? ToLength(? Get(O, "length")).


				var len = o.length >>> 0;

				// 3. If len is 0, return false.


				if (len === 0) {

					return false;
				}

				// 4. Let n be ? ToInteger(fromIndex).


				//    (If fromIndex is undefined, this step produces the value 0.)


				var n = fromIndex | 0;

				// 5. If n ≥ 0, then


				//  a. Let k be n.


				// 6. Else n < 0,


				//  a. Let k be len + n.


				//  b. If k < 0, let k be 0.


				var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

				function sameValueZero(x, y) {

					return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
				}

				// 7. Repeat, while k < len


				while (k < len) {

					// a. Let elementK be the result of ? Get(O, ! ToString(k)).


					// b. If SameValueZero(searchElement, elementK) is true, return true.


					if (sameValueZero(o[k], searchElement)) {

						return true;
					}

					// c. Increase k by 1.


					k++;
				}

				// 8. Return false


				return false;
			}

		});
	}

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill


	if (typeof Object.assign !== 'function') {

		// Must be writable: true, enumerable: false, configurable: true


		Object.defineProperty(Object, "assign", {

			value: function assign(target, varArgs) {

				if (target === null || target === undefined) {

					throw new TypeError('Cannot convert undefined or null to object');
				}

				var to = Object(target);

				for (var index = 1; index < arguments.length; index++) {

					var nextSource = arguments[index];

					if (nextSource !== null && nextSource !== undefined) {

						for (var nextKey in nextSource) {

							// Avoid bugs when hasOwnProperty is shadowed


							if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {

								to[nextKey] = nextSource[nextKey];
							}
						}
					}
				}

				return to;
			},

			writable: true,

			configurable: true

		});
	}

	var ColumnManager = function ColumnManager(table) {

		this.table = table; //hold parent table


		this.blockHozScrollEvent = false;

		this.headersElement = this.createHeadersElement();

		this.element = this.createHeaderElement(); //containing element


		this.rowManager = null; //hold row manager object


		this.columns = []; // column definition object


		this.columnsByIndex = []; //columns by index


		this.columnsByField = {}; //columns by field


		this.scrollLeft = 0;

		this.element.insertBefore(this.headersElement, this.element.firstChild);
	};

	////////////// Setup Functions /////////////////


	ColumnManager.prototype.createHeadersElement = function () {

		var el = document.createElement("div");

		el.classList.add("tabulator-headers");

		return el;
	};

	ColumnManager.prototype.createHeaderElement = function () {

		var el = document.createElement("div");

		el.classList.add("tabulator-header");

		if (!this.table.options.headerVisible) {

			el.classList.add("tabulator-header-hidden");
		}

		return el;
	};

	ColumnManager.prototype.initialize = function () {

		//scroll body along with header


		// self.element.addEventListener("scroll", function(e){


		// 	if(!self.blockHozScrollEvent){


		// 		self.table.rowManager.scrollHorizontal(self.element.scrollLeft);


		// 	}


		// });

	};

	//link to row manager


	ColumnManager.prototype.setRowManager = function (manager) {

		this.rowManager = manager;
	};

	//return containing element


	ColumnManager.prototype.getElement = function () {

		return this.element;
	};

	//return header containing element


	ColumnManager.prototype.getHeadersElement = function () {

		return this.headersElement;
	};

	// ColumnManager.prototype.tempScrollBlock = function(){


	// 	clearTimeout(this.blockHozScrollEvent);


	// 	this.blockHozScrollEvent = setTimeout(() => {this.blockHozScrollEvent = false;}, 50);


	// }


	//scroll horizontally to match table body


	ColumnManager.prototype.scrollHorizontal = function (left) {

		var hozAdjust = 0,
		    scrollWidth = this.element.scrollWidth - this.table.element.clientWidth;

		// this.tempScrollBlock();


		this.element.scrollLeft = left;

		//adjust for vertical scrollbar moving table when present


		if (left > scrollWidth) {

			hozAdjust = left - scrollWidth;

			this.element.style.marginLeft = -hozAdjust + "px";
		} else {

			this.element.style.marginLeft = 0;
		}

		//keep frozen columns fixed in position


		//this._calcFrozenColumnsPos(hozAdjust + 3);


		this.scrollLeft = left;

		if (this.table.modExists("frozenColumns")) {

			this.table.modules.frozenColumns.scrollHorizontal();
		}
	};

	///////////// Column Setup Functions /////////////


	ColumnManager.prototype.generateColumnsFromRowData = function (data) {

		var cols = [],
		    row,
		    sorter;

		if (data && data.length) {

			row = data[0];

			for (var key in row) {

				var col = {

					field: key,

					title: key

				};

				var value = row[key];

				switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {

					case "undefined":

						sorter = "string";

						break;

					case "boolean":

						sorter = "boolean";

						break;

					case "object":

						if (Array.isArray(value)) {

							sorter = "array";
						} else {

							sorter = "string";
						}

						break;

					default:

						if (!isNaN(value) && value !== "") {

							sorter = "number";
						} else {

							if (value.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i)) {

								sorter = "alphanum";
							} else {

								sorter = "string";
							}
						}

						break;

				}

				col.sorter = sorter;

				cols.push(col);
			}

			this.table.options.columns = cols;

			this.setColumns(this.table.options.columns);
		}
	};

	ColumnManager.prototype.setColumns = function (cols, row) {

		var self = this;

		while (self.headersElement.firstChild) {
			self.headersElement.removeChild(self.headersElement.firstChild);
		}self.columns = [];

		self.columnsByIndex = [];

		self.columnsByField = {};

		//reset frozen columns


		if (self.table.modExists("frozenColumns")) {

			self.table.modules.frozenColumns.reset();
		}

		cols.forEach(function (def, i) {

			self._addColumn(def);
		});

		self._reIndexColumns();

		if (self.table.options.responsiveLayout && self.table.modExists("responsiveLayout", true)) {

			self.table.modules.responsiveLayout.initialize();
		}

		self.redraw(true);
	};

	ColumnManager.prototype._addColumn = function (definition, before, nextToColumn) {

		var column = new Column(definition, this),
		    colEl = column.getElement(),
		    index = nextToColumn ? this.findColumnIndex(nextToColumn) : nextToColumn;

		if (nextToColumn && index > -1) {

			var parentIndex = this.columns.indexOf(nextToColumn.getTopColumn());

			var nextEl = nextToColumn.getElement();

			if (before) {

				this.columns.splice(parentIndex, 0, column);

				nextEl.parentNode.insertBefore(colEl, nextEl);
			} else {

				this.columns.splice(parentIndex + 1, 0, column);

				nextEl.parentNode.insertBefore(colEl, nextEl.nextSibling);
			}
		} else {

			if (before) {

				this.columns.unshift(column);

				this.headersElement.insertBefore(column.getElement(), this.headersElement.firstChild);
			} else {

				this.columns.push(column);

				this.headersElement.appendChild(column.getElement());
			}

			column.columnRendered();
		}

		return column;
	};

	ColumnManager.prototype.registerColumnField = function (col) {

		if (col.definition.field) {

			this.columnsByField[col.definition.field] = col;
		}
	};

	ColumnManager.prototype.registerColumnPosition = function (col) {

		this.columnsByIndex.push(col);
	};

	ColumnManager.prototype._reIndexColumns = function () {

		this.columnsByIndex = [];

		this.columns.forEach(function (column) {

			column.reRegisterPosition();
		});
	};

	//ensure column headers take up the correct amount of space in column groups


	ColumnManager.prototype._verticalAlignHeaders = function () {

		var self = this,
		    minHeight = 0;

		self.columns.forEach(function (column) {

			var height;

			column.clearVerticalAlign();

			height = column.getHeight();

			if (height > minHeight) {

				minHeight = height;
			}
		});

		self.columns.forEach(function (column) {

			column.verticalAlign(self.table.options.columnHeaderVertAlign, minHeight);
		});

		self.rowManager.adjustTableSize();
	};

	//////////////// Column Details /////////////////


	ColumnManager.prototype.findColumn = function (subject) {

		var self = this;

		if ((typeof subject === 'undefined' ? 'undefined' : _typeof(subject)) == "object") {

			if (subject instanceof Column) {

				//subject is column element


				return subject;
			} else if (subject instanceof ColumnComponent) {

				//subject is public column component


				return subject._getSelf() || false;
			} else if (typeof HTMLElement !== "undefined" && subject instanceof HTMLElement) {

				//subject is a HTML element of the column header


				var match = self.columns.find(function (column) {

					return column.element === subject;
				});

				return match || false;
			}
		} else {

			//subject should be treated as the field name of the column


			return this.columnsByField[subject] || false;
		}

		//catch all for any other type of input


		return false;
	};

	ColumnManager.prototype.getColumnByField = function (field) {

		return this.columnsByField[field];
	};

	ColumnManager.prototype.getColumnsByFieldRoot = function (root) {
		var _this = this;

		var matches = [];

		Object.keys(this.columnsByField).forEach(function (field) {

			var fieldRoot = field.split(".")[0];

			if (fieldRoot === root) {

				matches.push(_this.columnsByField[field]);
			}
		});

		return matches;
	};

	ColumnManager.prototype.getColumnByIndex = function (index) {

		return this.columnsByIndex[index];
	};

	ColumnManager.prototype.getFirstVisibileColumn = function (index) {

		var index = this.columnsByIndex.findIndex(function (col) {

			return col.visible;
		});

		return index > -1 ? this.columnsByIndex[index] : false;
	};

	ColumnManager.prototype.getColumns = function () {

		return this.columns;
	};

	ColumnManager.prototype.findColumnIndex = function (column) {

		return this.columnsByIndex.findIndex(function (col) {

			return column === col;
		});
	};

	//return all columns that are not groups


	ColumnManager.prototype.getRealColumns = function () {

		return this.columnsByIndex;
	};

	//travers across columns and call action


	ColumnManager.prototype.traverse = function (callback) {

		var self = this;

		self.columnsByIndex.forEach(function (column, i) {

			callback(column, i);
		});
	};

	//get defintions of actual columns


	ColumnManager.prototype.getDefinitions = function (active) {

		var self = this,
		    output = [];

		self.columnsByIndex.forEach(function (column) {

			if (!active || active && column.visible) {

				output.push(column.getDefinition());
			}
		});

		return output;
	};

	//get full nested definition tree


	ColumnManager.prototype.getDefinitionTree = function () {

		var self = this,
		    output = [];

		self.columns.forEach(function (column) {

			output.push(column.getDefinition(true));
		});

		return output;
	};

	ColumnManager.prototype.getComponents = function (structured) {

		var self = this,
		    output = [],
		    columns = structured ? self.columns : self.columnsByIndex;

		columns.forEach(function (column) {

			output.push(column.getComponent());
		});

		return output;
	};

	ColumnManager.prototype.getWidth = function () {

		var width = 0;

		this.columnsByIndex.forEach(function (column) {

			if (column.visible) {

				width += column.getWidth();
			}
		});

		return width;
	};

	ColumnManager.prototype.moveColumn = function (from, to, after) {

		this.moveColumnActual(from, to, after);

		if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

			this.table.modules.responsiveLayout.initialize();
		}

		if (this.table.modExists("columnCalcs")) {

			this.table.modules.columnCalcs.recalc(this.table.rowManager.activeRows);
		}

		to.element.parentNode.insertBefore(from.element, to.element);

		if (after) {

			to.element.parentNode.insertBefore(to.element, from.element);
		}

		this._verticalAlignHeaders();

		this.table.rowManager.reinitialize();
	};

	ColumnManager.prototype.moveColumnActual = function (from, to, after) {

		if (from.parent.isGroup) {

			this._moveColumnInArray(from.parent.columns, from, to, after);
		} else {

			this._moveColumnInArray(this.columns, from, to, after);
		}

		this._moveColumnInArray(this.columnsByIndex, from, to, after, true);

		if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

			this.table.modules.responsiveLayout.initialize();
		}

		if (this.table.options.columnMoved) {

			this.table.options.columnMoved.call(this.table, from.getComponent(), this.table.columnManager.getComponents());
		}

		if (this.table.options.persistence && this.table.modExists("persistence", true) && this.table.modules.persistence.config.columns) {

			this.table.modules.persistence.save("columns");
		}
	};

	ColumnManager.prototype._moveColumnInArray = function (columns, from, to, after, updateRows) {

		var fromIndex = columns.indexOf(from),
		    toIndex;

		if (fromIndex > -1) {

			columns.splice(fromIndex, 1);

			toIndex = columns.indexOf(to);

			if (toIndex > -1) {

				if (after) {

					toIndex = toIndex + 1;
				}
			} else {

				toIndex = fromIndex;
			}

			columns.splice(toIndex, 0, from);

			if (updateRows) {

				this.table.rowManager.rows.forEach(function (row) {

					if (row.cells.length) {

						var cell = row.cells.splice(fromIndex, 1)[0];

						row.cells.splice(toIndex, 0, cell);
					}
				});
			}
		}
	};

	ColumnManager.prototype.scrollToColumn = function (column, position, ifVisible) {
		var _this2 = this;

		var left = 0,
		    offset = 0,
		    adjust = 0,
		    colEl = column.getElement();

		return new Promise(function (resolve, reject) {

			if (typeof position === "undefined") {

				position = _this2.table.options.scrollToColumnPosition;
			}

			if (typeof ifVisible === "undefined") {

				ifVisible = _this2.table.options.scrollToColumnIfVisible;
			}

			if (column.visible) {

				//align to correct position


				switch (position) {

					case "middle":

					case "center":

						adjust = -_this2.element.clientWidth / 2;

						break;

					case "right":

						adjust = colEl.clientWidth - _this2.headersElement.clientWidth;

						break;

				}

				//check column visibility


				if (!ifVisible) {

					offset = colEl.offsetLeft;

					if (offset > 0 && offset + colEl.offsetWidth < _this2.element.clientWidth) {

						return false;
					}
				}

				//calculate scroll position


				left = colEl.offsetLeft + _this2.element.scrollLeft + adjust;

				left = Math.max(Math.min(left, _this2.table.rowManager.element.scrollWidth - _this2.table.rowManager.element.clientWidth), 0);

				_this2.table.rowManager.scrollHorizontal(left);

				_this2.scrollHorizontal(left);

				resolve();
			} else {

				console.warn("Scroll Error - Column not visible");

				reject("Scroll Error - Column not visible");
			}
		});
	};

	//////////////// Cell Management /////////////////


	ColumnManager.prototype.generateCells = function (row) {

		var self = this;

		var cells = [];

		self.columnsByIndex.forEach(function (column) {

			cells.push(column.generateCell(row));
		});

		return cells;
	};

	//////////////// Column Management /////////////////


	ColumnManager.prototype.getFlexBaseWidth = function () {

		var self = this,
		    totalWidth = self.table.element.clientWidth,
		    //table element width


		fixedWidth = 0;

		//adjust for vertical scrollbar if present


		if (self.rowManager.element.scrollHeight > self.rowManager.element.clientHeight) {

			totalWidth -= self.rowManager.element.offsetWidth - self.rowManager.element.clientWidth;
		}

		this.columnsByIndex.forEach(function (column) {

			var width, minWidth, colWidth;

			if (column.visible) {

				width = column.definition.width || 0;

				minWidth = typeof column.minWidth == "undefined" ? self.table.options.columnMinWidth : parseInt(column.minWidth);

				if (typeof width == "string") {

					if (width.indexOf("%") > -1) {

						colWidth = totalWidth / 100 * parseInt(width);
					} else {

						colWidth = parseInt(width);
					}
				} else {

					colWidth = width;
				}

				fixedWidth += colWidth > minWidth ? colWidth : minWidth;
			}
		});

		return fixedWidth;
	};

	ColumnManager.prototype.addColumn = function (definition, before, nextToColumn) {
		var _this3 = this;

		return new Promise(function (resolve, reject) {

			var column = _this3._addColumn(definition, before, nextToColumn);

			_this3._reIndexColumns();

			if (_this3.table.options.responsiveLayout && _this3.table.modExists("responsiveLayout", true)) {

				_this3.table.modules.responsiveLayout.initialize();
			}

			if (_this3.table.modExists("columnCalcs")) {

				_this3.table.modules.columnCalcs.recalc(_this3.table.rowManager.activeRows);
			}

			_this3.redraw();

			if (_this3.table.modules.layout.getMode() != "fitColumns") {

				column.reinitializeWidth();
			}

			_this3._verticalAlignHeaders();

			_this3.table.rowManager.reinitialize();

			resolve(column);
		});
	};

	//remove column from system


	ColumnManager.prototype.deregisterColumn = function (column) {

		var field = column.getField(),
		    index;

		//remove from field list


		if (field) {

			delete this.columnsByField[field];
		}

		//remove from index list


		index = this.columnsByIndex.indexOf(column);

		if (index > -1) {

			this.columnsByIndex.splice(index, 1);
		}

		//remove from column list


		index = this.columns.indexOf(column);

		if (index > -1) {

			this.columns.splice(index, 1);
		}

		if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

			this.table.modules.responsiveLayout.initialize();
		}

		this.redraw();
	};

	//redraw columns


	ColumnManager.prototype.redraw = function (force) {

		if (force) {

			if (Tabulator.prototype.helpers.elVisible(this.element)) {

				this._verticalAlignHeaders();
			}

			this.table.rowManager.resetScroll();

			this.table.rowManager.reinitialize();
		}

		if (["fitColumns", "fitDataStretch"].indexOf(this.table.modules.layout.getMode()) > -1) {

			this.table.modules.layout.layout();
		} else {

			if (force) {

				this.table.modules.layout.layout();
			} else {

				if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

					this.table.modules.responsiveLayout.update();
				}
			}
		}

		if (this.table.modExists("frozenColumns")) {

			this.table.modules.frozenColumns.layout();
		}

		if (this.table.modExists("columnCalcs")) {

			this.table.modules.columnCalcs.recalc(this.table.rowManager.activeRows);
		}

		if (force) {

			if (this.table.options.persistence && this.table.modExists("persistence", true) && this.table.modules.persistence.config.columns) {

				this.table.modules.persistence.save("columns");
			}

			if (this.table.modExists("columnCalcs")) {

				this.table.modules.columnCalcs.redraw();
			}
		}

		this.table.footerManager.redraw();
	};

	//public column object

	var ColumnComponent = function ColumnComponent(column) {

		this._column = column;

		this.type = "ColumnComponent";
	};

	ColumnComponent.prototype.getElement = function () {

		return this._column.getElement();
	};

	ColumnComponent.prototype.getDefinition = function () {

		return this._column.getDefinition();
	};

	ColumnComponent.prototype.getField = function () {

		return this._column.getField();
	};

	ColumnComponent.prototype.getCells = function () {

		var cells = [];

		this._column.cells.forEach(function (cell) {

			cells.push(cell.getComponent());
		});

		return cells;
	};

	ColumnComponent.prototype.getVisibility = function () {

		console.warn("getVisibility function is deprecated, you should now use the isVisible function");

		return this._column.visible;
	};

	ColumnComponent.prototype.isVisible = function () {

		return this._column.visible;
	};

	ColumnComponent.prototype.show = function () {

		if (this._column.isGroup) {

			this._column.columns.forEach(function (column) {

				column.show();
			});
		} else {

			this._column.show();
		}
	};

	ColumnComponent.prototype.hide = function () {

		if (this._column.isGroup) {

			this._column.columns.forEach(function (column) {

				column.hide();
			});
		} else {

			this._column.hide();
		}
	};

	ColumnComponent.prototype.toggle = function () {

		if (this._column.visible) {

			this.hide();
		} else {

			this.show();
		}
	};

	ColumnComponent.prototype.delete = function () {

		return this._column.delete();
	};

	ColumnComponent.prototype.getSubColumns = function () {

		var output = [];

		if (this._column.columns.length) {

			this._column.columns.forEach(function (column) {

				output.push(column.getComponent());
			});
		}

		return output;
	};

	ColumnComponent.prototype.getParentColumn = function () {

		return this._column.parent instanceof Column ? this._column.parent.getComponent() : false;
	};

	ColumnComponent.prototype._getSelf = function () {

		return this._column;
	};

	ColumnComponent.prototype.scrollTo = function () {

		return this._column.table.columnManager.scrollToColumn(this._column);
	};

	ColumnComponent.prototype.getTable = function () {

		return this._column.table;
	};

	ColumnComponent.prototype.headerFilterFocus = function () {

		if (this._column.table.modExists("filter", true)) {

			this._column.table.modules.filter.setHeaderFilterFocus(this._column);
		}
	};

	ColumnComponent.prototype.reloadHeaderFilter = function () {

		if (this._column.table.modExists("filter", true)) {

			this._column.table.modules.filter.reloadHeaderFilter(this._column);
		}
	};

	ColumnComponent.prototype.getHeaderFilterValue = function () {

		if (this._column.table.modExists("filter", true)) {

			return this._column.table.modules.filter.getHeaderFilterValue(this._column);
		}
	};

	ColumnComponent.prototype.setHeaderFilterValue = function (value) {

		if (this._column.table.modExists("filter", true)) {

			this._column.table.modules.filter.setHeaderFilterValue(this._column, value);
		}
	};

	ColumnComponent.prototype.move = function (to, after) {

		var toColumn = this._column.table.columnManager.findColumn(to);

		if (toColumn) {

			this._column.table.columnManager.moveColumn(this._column, toColumn, after);
		} else {

			console.warn("Move Error - No matching column found:", toColumn);
		}
	};

	ColumnComponent.prototype.getNextColumn = function () {

		var nextCol = this._column.nextColumn();

		return nextCol ? nextCol.getComponent() : false;
	};

	ColumnComponent.prototype.getPrevColumn = function () {

		var prevCol = this._column.prevColumn();

		return prevCol ? prevCol.getComponent() : false;
	};

	ColumnComponent.prototype.updateDefinition = function (updates) {

		return this._column.updateDefinition(updates);
	};

	ColumnComponent.prototype.getWidth = function () {

		return this._column.getWidth();
	};

	ColumnComponent.prototype.setWidth = function (width) {

		if (width === true) {

			return this._column.reinitializeWidth(true);
		} else {

			return this._column.setWidth(width);
		}
	};

	ColumnComponent.prototype.validate = function () {

		return this._column.validate();
	};

	var Column = function Column(def, parent) {

		var self = this;

		this.table = parent.table;

		this.definition = def; //column definition

		this.parent = parent; //hold parent object

		this.type = "column"; //type of element

		this.columns = []; //child columns

		this.cells = []; //cells bound to this column

		this.element = this.createElement(); //column header element

		this.contentElement = false;

		this.titleElement = false;

		this.groupElement = this.createGroupElement(); //column group holder element

		this.isGroup = false;

		this.tooltip = false; //hold column tooltip

		this.hozAlign = ""; //horizontal text alignment

		this.vertAlign = ""; //vert text alignment


		//multi dimensional filed handling

		this.field = "";

		this.fieldStructure = "";

		this.getFieldValue = "";

		this.setFieldValue = "";

		this.titleFormatterRendered = false;

		this.setField(this.definition.field);

		if (this.table.options.invalidOptionWarnings) {

			this.checkDefinition();
		}

		this.modules = {}; //hold module variables;


		this.cellEvents = {

			cellClick: false,

			cellDblClick: false,

			cellContext: false,

			cellTap: false,

			cellDblTap: false,

			cellTapHold: false,

			cellMouseEnter: false,

			cellMouseLeave: false,

			cellMouseOver: false,

			cellMouseOut: false,

			cellMouseMove: false

		};

		this.width = null; //column width

		this.widthStyled = ""; //column width prestyled to improve render efficiency

		this.minWidth = null; //column minimum width

		this.minWidthStyled = ""; //column minimum prestyled to improve render efficiency

		this.widthFixed = false; //user has specified a width for this column


		this.visible = true; //default visible state


		this.component = null;

		this._mapDepricatedFunctionality();

		//initialize column

		if (def.columns) {

			this.isGroup = true;

			def.columns.forEach(function (def, i) {

				var newCol = new Column(def, self);

				self.attachColumn(newCol);
			});

			self.checkColumnVisibility();
		} else {

			parent.registerColumnField(this);
		}

		if (def.rowHandle && this.table.options.movableRows !== false && this.table.modExists("moveRow")) {

			this.table.modules.moveRow.setHandle(true);
		}

		this._buildHeader();

		this.bindModuleColumns();
	};

	Column.prototype.createElement = function () {

		var el = document.createElement("div");

		el.classList.add("tabulator-col");

		el.setAttribute("role", "columnheader");

		el.setAttribute("aria-sort", "none");

		return el;
	};

	Column.prototype.createGroupElement = function () {

		var el = document.createElement("div");

		el.classList.add("tabulator-col-group-cols");

		return el;
	};

	Column.prototype.checkDefinition = function () {
		var _this4 = this;

		Object.keys(this.definition).forEach(function (key) {

			if (_this4.defaultOptionList.indexOf(key) === -1) {

				console.warn("Invalid column definition option in '" + (_this4.field || _this4.definition.title) + "' column:", key);
			}
		});
	};

	Column.prototype.setField = function (field) {

		this.field = field;

		this.fieldStructure = field ? this.table.options.nestedFieldSeparator ? field.split(this.table.options.nestedFieldSeparator) : [field] : [];

		this.getFieldValue = this.fieldStructure.length > 1 ? this._getNestedData : this._getFlatData;

		this.setFieldValue = this.fieldStructure.length > 1 ? this._setNestedData : this._setFlatData;
	};

	//register column position with column manager

	Column.prototype.registerColumnPosition = function (column) {

		this.parent.registerColumnPosition(column);
	};

	//register column position with column manager

	Column.prototype.registerColumnField = function (column) {

		this.parent.registerColumnField(column);
	};

	//trigger position registration

	Column.prototype.reRegisterPosition = function () {

		if (this.isGroup) {

			this.columns.forEach(function (column) {

				column.reRegisterPosition();
			});
		} else {

			this.registerColumnPosition(this);
		}
	};

	Column.prototype._mapDepricatedFunctionality = function () {

		if (typeof this.definition.hideInHtml !== "undefined") {

			this.definition.htmlOutput = !this.definition.hideInHtml;

			console.warn("hideInHtml column definition property is deprecated, you should now use htmlOutput");
		}

		if (typeof this.definition.align !== "undefined") {

			this.definition.hozAlign = this.definition.align;

			console.warn("align column definition property is deprecated, you should now use hozAlign");
		}

		if (typeof this.definition.downloadTitle !== "undefined") {

			this.definition.titleDownload = this.definition.downloadTitle;

			console.warn("downloadTitle definition property is deprecated, you should now use titleDownload");
		}
	};

	Column.prototype.setTooltip = function () {

		var self = this,
		    def = self.definition;

		//set header tooltips

		var tooltip = def.headerTooltip || def.tooltip === false ? def.headerTooltip : self.table.options.tooltipsHeader;

		if (tooltip) {

			if (tooltip === true) {

				if (def.field) {

					self.table.modules.localize.bind("columns|" + def.field, function (value) {

						self.element.setAttribute("title", value || def.title);
					});
				} else {

					self.element.setAttribute("title", def.title);
				}
			} else {

				if (typeof tooltip == "function") {

					tooltip = tooltip(self.getComponent());

					if (tooltip === false) {

						tooltip = "";
					}
				}

				self.element.setAttribute("title", tooltip);
			}
		} else {

			self.element.setAttribute("title", "");
		}
	};

	//build header element

	Column.prototype._buildHeader = function () {

		var self = this,
		    def = self.definition;

		while (self.element.firstChild) {
			self.element.removeChild(self.element.firstChild);
		}if (def.headerVertical) {

			self.element.classList.add("tabulator-col-vertical");

			if (def.headerVertical === "flip") {

				self.element.classList.add("tabulator-col-vertical-flip");
			}
		}

		self.contentElement = self._bindEvents();

		self.contentElement = self._buildColumnHeaderContent();

		self.element.appendChild(self.contentElement);

		if (self.isGroup) {

			self._buildGroupHeader();
		} else {

			self._buildColumnHeader();
		}

		self.setTooltip();

		//set resizable handles

		if (self.table.options.resizableColumns && self.table.modExists("resizeColumns")) {

			self.table.modules.resizeColumns.initializeColumn("header", self, self.element);
		}

		//set resizable handles

		if (def.headerFilter && self.table.modExists("filter") && self.table.modExists("edit")) {

			if (typeof def.headerFilterPlaceholder !== "undefined" && def.field) {

				self.table.modules.localize.setHeaderFilterColumnPlaceholder(def.field, def.headerFilterPlaceholder);
			}

			self.table.modules.filter.initializeColumn(self);
		}

		//set resizable handles

		if (self.table.modExists("frozenColumns")) {

			self.table.modules.frozenColumns.initializeColumn(self);
		}

		//set movable column

		if (self.table.options.movableColumns && !self.isGroup && self.table.modExists("moveColumn")) {

			self.table.modules.moveColumn.initializeColumn(self);
		}

		//set calcs column

		if ((def.topCalc || def.bottomCalc) && self.table.modExists("columnCalcs")) {

			self.table.modules.columnCalcs.initializeColumn(self);
		}

		//handle persistence

		if (self.table.modExists("persistence") && self.table.modules.persistence.config.columns) {

			self.table.modules.persistence.initializeColumn(self);
		}

		//update header tooltip on mouse enter

		self.element.addEventListener("mouseenter", function (e) {

			self.setTooltip();
		});
	};

	Column.prototype._bindEvents = function () {

		var self = this,
		    def = self.definition,
		    dblTap,
		    tapHold,
		    tap;

		//setup header click event bindings

		if (typeof def.headerClick == "function") {

			self.element.addEventListener("click", function (e) {
				def.headerClick(e, self.getComponent());
			});
		}

		if (typeof def.headerDblClick == "function") {

			self.element.addEventListener("dblclick", function (e) {
				def.headerDblClick(e, self.getComponent());
			});
		}

		if (typeof def.headerContext == "function") {

			self.element.addEventListener("contextmenu", function (e) {
				def.headerContext(e, self.getComponent());
			});
		}

		//setup header tap event bindings

		if (typeof def.headerTap == "function") {

			tap = false;

			self.element.addEventListener("touchstart", function (e) {

				tap = true;
			}, { passive: true });

			self.element.addEventListener("touchend", function (e) {

				if (tap) {

					def.headerTap(e, self.getComponent());
				}

				tap = false;
			});
		}

		if (typeof def.headerDblTap == "function") {

			dblTap = null;

			self.element.addEventListener("touchend", function (e) {

				if (dblTap) {

					clearTimeout(dblTap);

					dblTap = null;

					def.headerDblTap(e, self.getComponent());
				} else {

					dblTap = setTimeout(function () {

						clearTimeout(dblTap);

						dblTap = null;
					}, 300);
				}
			});
		}

		if (typeof def.headerTapHold == "function") {

			tapHold = null;

			self.element.addEventListener("touchstart", function (e) {

				clearTimeout(tapHold);

				tapHold = setTimeout(function () {

					clearTimeout(tapHold);

					tapHold = null;

					tap = false;

					def.headerTapHold(e, self.getComponent());
				}, 1000);
			}, { passive: true });

			self.element.addEventListener("touchend", function (e) {

				clearTimeout(tapHold);

				tapHold = null;
			});
		}

		//store column cell click event bindings

		if (typeof def.cellClick == "function") {

			self.cellEvents.cellClick = def.cellClick;
		}

		if (typeof def.cellDblClick == "function") {

			self.cellEvents.cellDblClick = def.cellDblClick;
		}

		if (typeof def.cellContext == "function") {

			self.cellEvents.cellContext = def.cellContext;
		}

		//store column mouse event bindings

		if (typeof def.cellMouseEnter == "function") {

			self.cellEvents.cellMouseEnter = def.cellMouseEnter;
		}

		if (typeof def.cellMouseLeave == "function") {

			self.cellEvents.cellMouseLeave = def.cellMouseLeave;
		}

		if (typeof def.cellMouseOver == "function") {

			self.cellEvents.cellMouseOver = def.cellMouseOver;
		}

		if (typeof def.cellMouseOut == "function") {

			self.cellEvents.cellMouseOut = def.cellMouseOut;
		}

		if (typeof def.cellMouseMove == "function") {

			self.cellEvents.cellMouseMove = def.cellMouseMove;
		}

		//setup column cell tap event bindings

		if (typeof def.cellTap == "function") {

			self.cellEvents.cellTap = def.cellTap;
		}

		if (typeof def.cellDblTap == "function") {

			self.cellEvents.cellDblTap = def.cellDblTap;
		}

		if (typeof def.cellTapHold == "function") {

			self.cellEvents.cellTapHold = def.cellTapHold;
		}

		//setup column cell edit callbacks

		if (typeof def.cellEdited == "function") {

			self.cellEvents.cellEdited = def.cellEdited;
		}

		if (typeof def.cellEditing == "function") {

			self.cellEvents.cellEditing = def.cellEditing;
		}

		if (typeof def.cellEditCancelled == "function") {

			self.cellEvents.cellEditCancelled = def.cellEditCancelled;
		}
	};

	//build header element for header

	Column.prototype._buildColumnHeader = function () {

		var self = this,
		    def = self.definition,
		    table = self.table;

		//set column sorter

		if (table.modExists("sort")) {

			table.modules.sort.initializeColumn(self, self.contentElement);
		}

		//set column header context menu

		if ((def.headerContextMenu || def.headerMenu) && table.modExists("menu")) {

			table.modules.menu.initializeColumnHeader(self);
		}

		//set column formatter

		if (table.modExists("format")) {

			table.modules.format.initializeColumn(self);
		}

		//set column editor

		if (typeof def.editor != "undefined" && table.modExists("edit")) {

			table.modules.edit.initializeColumn(self);
		}

		//set colum validator

		if (typeof def.validator != "undefined" && table.modExists("validate")) {

			table.modules.validate.initializeColumn(self);
		}

		//set column mutator

		if (table.modExists("mutator")) {

			table.modules.mutator.initializeColumn(self);
		}

		//set column accessor

		if (table.modExists("accessor")) {

			table.modules.accessor.initializeColumn(self);
		}

		//set respoviveLayout

		if (_typeof(table.options.responsiveLayout) && table.modExists("responsiveLayout")) {

			table.modules.responsiveLayout.initializeColumn(self);
		}

		//set column visibility

		if (typeof def.visible != "undefined") {

			if (def.visible) {

				self.show(true);
			} else {

				self.hide(true);
			}
		}

		//asign additional css classes to column header

		if (def.cssClass) {

			var classeNames = def.cssClass.split(" ");

			classeNames.forEach(function (className) {

				self.element.classList.add(className);
			});
		}

		if (def.field) {

			this.element.setAttribute("tabulator-field", def.field);
		}

		//set min width if present

		self.setMinWidth(typeof def.minWidth == "undefined" ? self.table.options.columnMinWidth : parseInt(def.minWidth));

		self.reinitializeWidth();

		//set tooltip if present

		self.tooltip = self.definition.tooltip || self.definition.tooltip === false ? self.definition.tooltip : self.table.options.tooltips;

		//set orizontal text alignment

		self.hozAlign = typeof self.definition.hozAlign == "undefined" ? self.table.options.cellHozAlign : self.definition.hozAlign;

		self.vertAlign = typeof self.definition.vertAlign == "undefined" ? self.table.options.cellVertAlign : self.definition.vertAlign;
	};

	Column.prototype._buildColumnHeaderContent = function () {

		var def = this.definition,
		    table = this.table;

		var contentElement = document.createElement("div");

		contentElement.classList.add("tabulator-col-content");

		this.titleElement = this._buildColumnHeaderTitle();

		contentElement.appendChild(this.titleElement);

		return contentElement;
	};

	//build title element of column

	Column.prototype._buildColumnHeaderTitle = function () {

		var self = this,
		    def = self.definition,
		    table = self.table;

		var titleHolderElement = document.createElement("div");

		titleHolderElement.classList.add("tabulator-col-title");

		if (def.editableTitle) {

			var titleElement = document.createElement("input");

			titleElement.classList.add("tabulator-title-editor");

			titleElement.addEventListener("click", function (e) {

				e.stopPropagation();

				titleElement.focus();
			});

			titleElement.addEventListener("change", function () {

				def.title = titleElement.value;

				table.options.columnTitleChanged.call(self.table, self.getComponent());
			});

			titleHolderElement.appendChild(titleElement);

			if (def.field) {

				table.modules.localize.bind("columns|" + def.field, function (text) {

					titleElement.value = text || def.title || "&nbsp;";
				});
			} else {

				titleElement.value = def.title || "&nbsp;";
			}
		} else {

			if (def.field) {

				table.modules.localize.bind("columns|" + def.field, function (text) {

					self._formatColumnHeaderTitle(titleHolderElement, text || def.title || "&nbsp;");
				});
			} else {

				self._formatColumnHeaderTitle(titleHolderElement, def.title || "&nbsp;");
			}
		}

		return titleHolderElement;
	};

	Column.prototype._formatColumnHeaderTitle = function (el, title) {
		var _this5 = this;

		var formatter, contents, params, mockCell, onRendered;

		if (this.definition.titleFormatter && this.table.modExists("format")) {

			formatter = this.table.modules.format.getFormatter(this.definition.titleFormatter);

			onRendered = function onRendered(callback) {

				_this5.titleFormatterRendered = callback;
			};

			mockCell = {

				getValue: function getValue() {

					return title;
				},

				getElement: function getElement() {

					return el;
				}

			};

			params = this.definition.titleFormatterParams || {};

			params = typeof params === "function" ? params() : params;

			contents = formatter.call(this.table.modules.format, mockCell, params, onRendered);

			switch (typeof contents === 'undefined' ? 'undefined' : _typeof(contents)) {

				case "object":

					if (contents instanceof Node) {

						el.appendChild(contents);
					} else {

						el.innerHTML = "";

						console.warn("Format Error - Title formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", contents);
					}

					break;

				case "undefined":

				case "null":

					el.innerHTML = "";

					break;

				default:

					el.innerHTML = contents;

			}
		} else {

			el.innerHTML = title;
		}
	};

	//build header element for column group

	Column.prototype._buildGroupHeader = function () {
		var _this6 = this;

		this.element.classList.add("tabulator-col-group");

		this.element.setAttribute("role", "columngroup");

		this.element.setAttribute("aria-title", this.definition.title);

		//asign additional css classes to column header

		if (this.definition.cssClass) {

			var classeNames = this.definition.cssClass.split(" ");

			classeNames.forEach(function (className) {

				_this6.element.classList.add(className);
			});
		}

		//set column header context menu

		if ((this.definition.headerContextMenu || this.definition.headerMenu) && this.table.modExists("menu")) {

			this.table.modules.menu.initializeColumnHeader(this);
		}

		this.element.appendChild(this.groupElement);
	};

	//flat field lookup

	Column.prototype._getFlatData = function (data) {

		return data[this.field];
	};

	//nested field lookup

	Column.prototype._getNestedData = function (data) {

		var dataObj = data,
		    structure = this.fieldStructure,
		    length = structure.length,
		    output;

		for (var _i = 0; _i < length; _i++) {

			dataObj = dataObj[structure[_i]];

			output = dataObj;

			if (!dataObj) {

				break;
			}
		}

		return output;
	};

	//flat field set

	Column.prototype._setFlatData = function (data, value) {

		if (this.field) {

			data[this.field] = value;
		}
	};

	//nested field set

	Column.prototype._setNestedData = function (data, value) {

		var dataObj = data,
		    structure = this.fieldStructure,
		    length = structure.length;

		for (var _i2 = 0; _i2 < length; _i2++) {

			if (_i2 == length - 1) {

				dataObj[structure[_i2]] = value;
			} else {

				if (!dataObj[structure[_i2]]) {

					if (typeof value !== "undefined") {

						dataObj[structure[_i2]] = {};
					} else {

						break;
					}
				}

				dataObj = dataObj[structure[_i2]];
			}
		}
	};

	//attach column to this group

	Column.prototype.attachColumn = function (column) {

		var self = this;

		if (self.groupElement) {

			self.columns.push(column);

			self.groupElement.appendChild(column.getElement());
		} else {

			console.warn("Column Warning - Column being attached to another column instead of column group");
		}
	};

	//vertically align header in column

	Column.prototype.verticalAlign = function (alignment, height) {

		//calculate height of column header and group holder element

		var parentHeight = this.parent.isGroup ? this.parent.getGroupElement().clientHeight : height || this.parent.getHeadersElement().clientHeight;

		// var parentHeight = this.parent.isGroup ? this.parent.getGroupElement().clientHeight : this.parent.getHeadersElement().clientHeight;


		this.element.style.height = parentHeight + "px";

		if (this.isGroup) {

			this.groupElement.style.minHeight = parentHeight - this.contentElement.offsetHeight + "px";
		}

		//vertically align cell contents

		if (!this.isGroup && alignment !== "top") {

			if (alignment === "bottom") {

				this.element.style.paddingTop = this.element.clientHeight - this.contentElement.offsetHeight + "px";
			} else {

				this.element.style.paddingTop = (this.element.clientHeight - this.contentElement.offsetHeight) / 2 + "px";
			}
		}

		this.columns.forEach(function (column) {

			column.verticalAlign(alignment);
		});
	};

	//clear vertical alignmenet

	Column.prototype.clearVerticalAlign = function () {

		this.element.style.paddingTop = "";

		this.element.style.height = "";

		this.element.style.minHeight = "";

		this.groupElement.style.minHeight = "";

		this.columns.forEach(function (column) {

			column.clearVerticalAlign();
		});
	};

	Column.prototype.bindModuleColumns = function () {

		//check if rownum formatter is being used on a column

		if (this.definition.formatter == "rownum") {

			this.table.rowManager.rowNumColumn = this;
		}
	};

	//// Retreive Column Information ////


	//return column header element

	Column.prototype.getElement = function () {

		return this.element;
	};

	//return colunm group element

	Column.prototype.getGroupElement = function () {

		return this.groupElement;
	};

	//return field name

	Column.prototype.getField = function () {

		return this.field;
	};

	//return the first column in a group

	Column.prototype.getFirstColumn = function () {

		if (!this.isGroup) {

			return this;
		} else {

			if (this.columns.length) {

				return this.columns[0].getFirstColumn();
			} else {

				return false;
			}
		}
	};

	//return the last column in a group

	Column.prototype.getLastColumn = function () {

		if (!this.isGroup) {

			return this;
		} else {

			if (this.columns.length) {

				return this.columns[this.columns.length - 1].getLastColumn();
			} else {

				return false;
			}
		}
	};

	//return all columns in a group

	Column.prototype.getColumns = function () {

		return this.columns;
	};

	//return all columns in a group

	Column.prototype.getCells = function () {

		return this.cells;
	};

	//retreive the top column in a group of columns

	Column.prototype.getTopColumn = function () {

		if (this.parent.isGroup) {

			return this.parent.getTopColumn();
		} else {

			return this;
		}
	};

	//return column definition object

	Column.prototype.getDefinition = function (updateBranches) {

		var colDefs = [];

		if (this.isGroup && updateBranches) {

			this.columns.forEach(function (column) {

				colDefs.push(column.getDefinition(true));
			});

			this.definition.columns = colDefs;
		}

		return this.definition;
	};

	//////////////////// Actions ////////////////////


	Column.prototype.checkColumnVisibility = function () {

		var visible = false;

		this.columns.forEach(function (column) {

			if (column.visible) {

				visible = true;
			}
		});

		if (visible) {

			this.show();

			this.parent.table.options.columnVisibilityChanged.call(this.table, this.getComponent(), false);
		} else {

			this.hide();
		}
	};

	//show column

	Column.prototype.show = function (silent, responsiveToggle) {

		if (!this.visible) {

			this.visible = true;

			this.element.style.display = "";

			if (this.parent.isGroup) {

				this.parent.checkColumnVisibility();
			}

			this.cells.forEach(function (cell) {

				cell.show();
			});

			if (!this.isGroup && this.width === null) {

				this.reinitializeWidth();
			}

			this.table.columnManager._verticalAlignHeaders();

			if (this.table.options.persistence && this.table.modExists("persistence", true) && this.table.modules.persistence.config.columns) {

				this.table.modules.persistence.save("columns");
			}

			if (!responsiveToggle && this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

				this.table.modules.responsiveLayout.updateColumnVisibility(this, this.visible);
			}

			if (!silent) {

				this.table.options.columnVisibilityChanged.call(this.table, this.getComponent(), true);
			}

			if (this.parent.isGroup) {

				this.parent.matchChildWidths();
			}
		}
	};

	//hide column

	Column.prototype.hide = function (silent, responsiveToggle) {

		if (this.visible) {

			this.visible = false;

			this.element.style.display = "none";

			this.table.columnManager._verticalAlignHeaders();

			if (this.parent.isGroup) {

				this.parent.checkColumnVisibility();
			}

			this.cells.forEach(function (cell) {

				cell.hide();
			});

			if (this.table.options.persistence && this.table.modExists("persistence", true) && this.table.modules.persistence.config.columns) {

				this.table.modules.persistence.save("columns");
			}

			if (!responsiveToggle && this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

				this.table.modules.responsiveLayout.updateColumnVisibility(this, this.visible);
			}

			if (!silent) {

				this.table.options.columnVisibilityChanged.call(this.table, this.getComponent(), false);
			}

			if (this.parent.isGroup) {

				this.parent.matchChildWidths();
			}
		}
	};

	Column.prototype.matchChildWidths = function () {

		var childWidth = 0;

		if (this.contentElement && this.columns.length) {

			this.columns.forEach(function (column) {

				if (column.visible) {

					childWidth += column.getWidth();
				}
			});

			this.contentElement.style.maxWidth = childWidth - 1 + "px";

			if (this.parent.isGroup) {

				this.parent.matchChildWidths();
			}
		}
	};

	Column.prototype.setWidth = function (width) {

		this.widthFixed = true;

		this.setWidthActual(width);
	};

	Column.prototype.setWidthActual = function (width) {

		if (isNaN(width)) {

			width = Math.floor(this.table.element.clientWidth / 100 * parseInt(width));
		}

		width = Math.max(this.minWidth, width);

		this.width = width;

		this.widthStyled = width ? width + "px" : "";

		this.element.style.width = this.widthStyled;

		if (!this.isGroup) {

			this.cells.forEach(function (cell) {

				cell.setWidth();
			});
		}

		if (this.parent.isGroup) {

			this.parent.matchChildWidths();
		}

		//set resizable handles

		if (this.table.modExists("frozenColumns")) {

			this.table.modules.frozenColumns.layout();
		}
	};

	Column.prototype.checkCellHeights = function () {

		var rows = [];

		this.cells.forEach(function (cell) {

			if (cell.row.heightInitialized) {

				if (cell.row.getElement().offsetParent !== null) {

					rows.push(cell.row);

					cell.row.clearCellHeight();
				} else {

					cell.row.heightInitialized = false;
				}
			}
		});

		rows.forEach(function (row) {

			row.calcHeight();
		});

		rows.forEach(function (row) {

			row.setCellHeight();
		});
	};

	Column.prototype.getWidth = function () {

		var width = 0;

		if (this.isGroup) {

			this.columns.forEach(function (column) {

				if (column.visible) {

					width += column.getWidth();
				}
			});
		} else {

			width = this.width;
		}

		return width;
	};

	Column.prototype.getHeight = function () {

		return this.element.offsetHeight;
	};

	Column.prototype.setMinWidth = function (minWidth) {

		this.minWidth = minWidth;

		this.minWidthStyled = minWidth ? minWidth + "px" : "";

		this.element.style.minWidth = this.minWidthStyled;

		this.cells.forEach(function (cell) {

			cell.setMinWidth();
		});
	};

	Column.prototype.delete = function () {
		var _this7 = this;

		return new Promise(function (resolve, reject) {

			if (_this7.isGroup) {

				_this7.columns.forEach(function (column) {

					column.delete();
				});
			}

			//cancel edit if column is currently being edited

			if (_this7.table.modExists("edit")) {

				if (_this7.table.modules.edit.currentCell.column === _this7) {

					_this7.table.modules.edit.cancelEdit();
				}
			}

			var cellCount = _this7.cells.length;

			for (var _i3 = 0; _i3 < cellCount; _i3++) {

				_this7.cells[0].delete();
			}

			_this7.element.parentNode.removeChild(_this7.element);

			_this7.table.columnManager.deregisterColumn(_this7);

			resolve();
		});
	};

	Column.prototype.columnRendered = function () {

		if (this.titleFormatterRendered) {

			this.titleFormatterRendered();
		}
	};

	Column.prototype.validate = function () {

		var invalid = [];

		this.cells.forEach(function (cell) {

			if (!cell.validate()) {

				invalid.push(cell.getComponent());
			}
		});

		return invalid.length ? invalid : true;
	};

	//////////////// Cell Management /////////////////


	//generate cell for this column

	Column.prototype.generateCell = function (row) {

		var self = this;

		var cell = new Cell(self, row);

		this.cells.push(cell);

		return cell;
	};

	Column.prototype.nextColumn = function () {

		var index = this.table.columnManager.findColumnIndex(this);

		return index > -1 ? this._nextVisibleColumn(index + 1) : false;
	};

	Column.prototype._nextVisibleColumn = function (index) {

		var column = this.table.columnManager.getColumnByIndex(index);

		return !column || column.visible ? column : this._nextVisibleColumn(index + 1);
	};

	Column.prototype.prevColumn = function () {

		var index = this.table.columnManager.findColumnIndex(this);

		return index > -1 ? this._prevVisibleColumn(index - 1) : false;
	};

	Column.prototype._prevVisibleColumn = function (index) {

		var column = this.table.columnManager.getColumnByIndex(index);

		return !column || column.visible ? column : this._prevVisibleColumn(index - 1);
	};

	Column.prototype.reinitializeWidth = function (force) {

		this.widthFixed = false;

		//set width if present

		if (typeof this.definition.width !== "undefined" && !force) {

			this.setWidth(this.definition.width);
		}

		//hide header filters to prevent them altering column width

		if (this.table.modExists("filter")) {

			this.table.modules.filter.hideHeaderFilterElements();
		}

		this.fitToData();

		//show header filters again after layout is complete

		if (this.table.modExists("filter")) {

			this.table.modules.filter.showHeaderFilterElements();
		}
	};

	//set column width to maximum cell width

	Column.prototype.fitToData = function () {

		var self = this;

		if (!this.widthFixed) {

			this.element.style.width = "";

			self.cells.forEach(function (cell) {

				cell.clearWidth();
			});
		}

		var maxWidth = this.element.offsetWidth;

		if (!self.width || !this.widthFixed) {

			self.cells.forEach(function (cell) {

				var width = cell.getWidth();

				if (width > maxWidth) {

					maxWidth = width;
				}
			});

			if (maxWidth) {

				self.setWidthActual(maxWidth + 1);
			}
		}
	};

	Column.prototype.updateDefinition = function (updates) {
		var _this8 = this;

		return new Promise(function (resolve, reject) {

			var definition;

			if (!_this8.isGroup) {

				definition = Object.assign({}, _this8.getDefinition());

				definition = Object.assign(definition, updates);

				_this8.table.columnManager.addColumn(definition, false, _this8).then(function (column) {

					if (definition.field == _this8.field) {

						_this8.field = false; //cleair field name to prevent deletion of duplicate column from arrays
					}

					_this8.delete().then(function () {

						resolve(column.getComponent());
					}).catch(function (err) {

						reject(err);
					});
				}).catch(function (err) {

					reject(err);
				});
			} else {

				console.warn("Column Update Error - The updateDefintion function is only available on columns, not column groups");

				reject("Column Update Error - The updateDefintion function is only available on columns, not column groups");
			}
		});
	};

	Column.prototype.deleteCell = function (cell) {

		var index = this.cells.indexOf(cell);

		if (index > -1) {

			this.cells.splice(index, 1);
		}
	};

	Column.prototype.defaultOptionList = ["title", "field", "columns", "visible", "align", "hozAlign", "vertAlign", "width", "minWidth", "widthGrow", "widthShrink", "resizable", "frozen", "responsive", "tooltip", "cssClass", "rowHandle", "hideInHtml", "print", "htmlOutput", "sorter", "sorterParams", "formatter", "formatterParams", "variableHeight", "editable", "editor", "editorParams", "validator", "mutator", "mutatorParams", "mutatorData", "mutatorDataParams", "mutatorEdit", "mutatorEditParams", "mutatorClipboard", "mutatorClipboardParams", "accessor", "accessorParams", "accessorData", "accessorDataParams", "accessorDownload", "accessorDownloadParams", "accessorClipboard", "accessorClipboardParams", "accessorPrint", "accessorPrintParams", "accessorHtmlOutput", "accessorHtmlOutputParams", "clipboard", "download", "downloadTitle", "topCalc", "topCalcParams", "topCalcFormatter", "topCalcFormatterParams", "bottomCalc", "bottomCalcParams", "bottomCalcFormatter", "bottomCalcFormatterParams", "cellClick", "cellDblClick", "cellContext", "cellTap", "cellDblTap", "cellTapHold", "cellMouseEnter", "cellMouseLeave", "cellMouseOver", "cellMouseOut", "cellMouseMove", "cellEditing", "cellEdited", "cellEditCancelled", "headerSort", "headerSortStartingDir", "headerSortTristate", "headerClick", "headerDblClick", "headerContext", "headerTap", "headerDblTap", "headerTapHold", "headerTooltip", "headerVertical", "editableTitle", "titleFormatter", "titleFormatterParams", "headerFilter", "headerFilterPlaceholder", "headerFilterParams", "headerFilterEmptyCheck", "headerFilterFunc", "headerFilterFuncParams", "headerFilterLiveFilter", "print", "headerContextMenu", "headerMenu", "contextMenu", "formatterPrint", "formatterPrintParams", "formatterClipboard", "formatterClipboardParams", "formatterHtmlOutput", "formatterHtmlOutputParams", "titlePrint", "titleClipboard", "titleHtmlOutput", "titleDownload"];

	//////////////// Event Bindings /////////////////


	//////////////// Object Generation /////////////////

	Column.prototype.getComponent = function () {

		if (!this.component) {

			this.component = new ColumnComponent(this);
		}

		return this.component;
	};

	var RowManager = function RowManager(table) {

		this.table = table;

		this.element = this.createHolderElement(); //containing element

		this.tableElement = this.createTableElement(); //table element

		this.heightFixer = this.createTableElement(); //table element

		this.columnManager = null; //hold column manager object

		this.height = 0; //hold height of table element


		this.firstRender = false; //handle first render

		this.renderMode = "virtual"; //current rendering mode

		this.fixedHeight = false; //current rendering mode


		this.rows = []; //hold row data objects

		this.activeRows = []; //rows currently available to on display in the table

		this.activeRowsCount = 0; //count of active rows


		this.displayRows = []; //rows currently on display in the table

		this.displayRowsCount = 0; //count of display rows


		this.scrollTop = 0;

		this.scrollLeft = 0;

		this.vDomRowHeight = 20; //approximation of row heights for padding


		this.vDomTop = 0; //hold position for first rendered row in the virtual DOM

		this.vDomBottom = 0; //hold possition for last rendered row in the virtual DOM


		this.vDomScrollPosTop = 0; //last scroll position of the vDom top;

		this.vDomScrollPosBottom = 0; //last scroll position of the vDom bottom;


		this.vDomTopPad = 0; //hold value of padding for top of virtual DOM

		this.vDomBottomPad = 0; //hold value of padding for bottom of virtual DOM


		this.vDomMaxRenderChain = 90; //the maximum number of dom elements that can be rendered in 1 go


		this.vDomWindowBuffer = 0; //window row buffer before removing elements, to smooth scrolling


		this.vDomWindowMinTotalRows = 20; //minimum number of rows to be generated in virtual dom (prevent buffering issues on tables with tall rows)

		this.vDomWindowMinMarginRows = 5; //minimum number of rows to be generated in virtual dom margin


		this.vDomTopNewRows = []; //rows to normalize after appending to optimize render speed

		this.vDomBottomNewRows = []; //rows to normalize after appending to optimize render speed


		this.rowNumColumn = false; //hold column component for row number column


		this.redrawBlock = false; //prevent redraws to allow multiple data manipulations becore continuing

		this.redrawBlockRestoreConfig = false; //store latest redraw function calls for when redraw is needed

		this.redrawBlockRederInPosition = false; //store latest redraw function calls for when redraw is needed
	};

	//////////////// Setup Functions /////////////////


	RowManager.prototype.createHolderElement = function () {

		var el = document.createElement("div");

		el.classList.add("tabulator-tableHolder");

		el.setAttribute("tabindex", 0);

		return el;
	};

	RowManager.prototype.createTableElement = function () {

		var el = document.createElement("div");

		el.classList.add("tabulator-table");

		return el;
	};

	//return containing element

	RowManager.prototype.getElement = function () {

		return this.element;
	};

	//return table element

	RowManager.prototype.getTableElement = function () {

		return this.tableElement;
	};

	//return position of row in table

	RowManager.prototype.getRowPosition = function (row, active) {

		if (active) {

			return this.activeRows.indexOf(row);
		} else {

			return this.rows.indexOf(row);
		}
	};

	//link to column manager

	RowManager.prototype.setColumnManager = function (manager) {

		this.columnManager = manager;
	};

	RowManager.prototype.initialize = function () {

		var self = this;

		self.setRenderMode();

		//initialize manager

		self.element.appendChild(self.tableElement);

		self.firstRender = true;

		//scroll header along with table body

		self.element.addEventListener("scroll", function () {

			var left = self.element.scrollLeft;

			//handle horizontal scrolling

			if (self.scrollLeft != left) {

				self.columnManager.scrollHorizontal(left);

				if (self.table.options.groupBy) {

					self.table.modules.groupRows.scrollHeaders(left);
				}

				if (self.table.modExists("columnCalcs")) {

					self.table.modules.columnCalcs.scrollHorizontal(left);
				}

				self.table.options.scrollHorizontal(left);
			}

			self.scrollLeft = left;
		});

		//handle virtual dom scrolling

		if (this.renderMode === "virtual") {

			self.element.addEventListener("scroll", function () {

				var top = self.element.scrollTop;

				var dir = self.scrollTop > top;

				//handle verical scrolling

				if (self.scrollTop != top) {

					self.scrollTop = top;

					self.scrollVertical(dir);

					if (self.table.options.ajaxProgressiveLoad == "scroll") {

						self.table.modules.ajax.nextPage(self.element.scrollHeight - self.element.clientHeight - top);
					}

					self.table.options.scrollVertical(top);
				} else {

					self.scrollTop = top;
				}
			});
		}
	};

	////////////////// Row Manipulation //////////////////


	RowManager.prototype.findRow = function (subject) {

		var self = this;

		if ((typeof subject === 'undefined' ? 'undefined' : _typeof(subject)) == "object") {

			if (subject instanceof Row) {

				//subject is row element

				return subject;
			} else if (subject instanceof RowComponent) {

				//subject is public row component

				return subject._getSelf() || false;
			} else if (typeof HTMLElement !== "undefined" && subject instanceof HTMLElement) {

				//subject is a HTML element of the row

				var match = self.rows.find(function (row) {

					return row.element === subject;
				});

				return match || false;
			}
		} else if (typeof subject == "undefined" || subject === null) {

			return false;
		} else {

			//subject should be treated as the index of the row

			var _match = self.rows.find(function (row) {

				return row.data[self.table.options.index] == subject;
			});

			return _match || false;
		}

		//catch all for any other type of input


		return false;
	};

	RowManager.prototype.getRowFromDataObject = function (data) {

		var match = this.rows.find(function (row) {

			return row.data === data;
		});

		return match || false;
	};

	RowManager.prototype.getRowFromPosition = function (position, active) {

		if (active) {

			return this.activeRows[position];
		} else {

			return this.rows[position];
		}
	};

	RowManager.prototype.scrollToRow = function (row, position, ifVisible) {
		var _this9 = this;

		var rowIndex = this.getDisplayRows().indexOf(row),
		    rowEl = row.getElement(),
		    rowTop,
		    offset = 0;

		return new Promise(function (resolve, reject) {

			if (rowIndex > -1) {

				if (typeof position === "undefined") {

					position = _this9.table.options.scrollToRowPosition;
				}

				if (typeof ifVisible === "undefined") {

					ifVisible = _this9.table.options.scrollToRowIfVisible;
				}

				if (position === "nearest") {

					switch (_this9.renderMode) {

						case "classic":

							rowTop = Tabulator.prototype.helpers.elOffset(rowEl).top;

							position = Math.abs(_this9.element.scrollTop - rowTop) > Math.abs(_this9.element.scrollTop + _this9.element.clientHeight - rowTop) ? "bottom" : "top";

							break;

						case "virtual":

							position = Math.abs(_this9.vDomTop - rowIndex) > Math.abs(_this9.vDomBottom - rowIndex) ? "bottom" : "top";

							break;

					}
				}

				//check row visibility

				if (!ifVisible) {

					if (Tabulator.prototype.helpers.elVisible(rowEl)) {

						offset = Tabulator.prototype.helpers.elOffset(rowEl).top - Tabulator.prototype.helpers.elOffset(_this9.element).top;

						if (offset > 0 && offset < _this9.element.clientHeight - rowEl.offsetHeight) {

							return false;
						}
					}
				}

				//scroll to row

				switch (_this9.renderMode) {

					case "classic":

						_this9.element.scrollTop = Tabulator.prototype.helpers.elOffset(rowEl).top - Tabulator.prototype.helpers.elOffset(_this9.element).top + _this9.element.scrollTop;

						break;

					case "virtual":

						_this9._virtualRenderFill(rowIndex, true);

						break;

				}

				//align to correct position

				switch (position) {

					case "middle":

					case "center":

						if (_this9.element.scrollHeight - _this9.element.scrollTop == _this9.element.clientHeight) {

							_this9.element.scrollTop = _this9.element.scrollTop + (rowEl.offsetTop - _this9.element.scrollTop) - (_this9.element.scrollHeight - rowEl.offsetTop) / 2;
						} else {

							_this9.element.scrollTop = _this9.element.scrollTop - _this9.element.clientHeight / 2;
						}

						break;

					case "bottom":

						if (_this9.element.scrollHeight - _this9.element.scrollTop == _this9.element.clientHeight) {

							_this9.element.scrollTop = _this9.element.scrollTop - (_this9.element.scrollHeight - rowEl.offsetTop) + rowEl.offsetHeight;
						} else {

							_this9.element.scrollTop = _this9.element.scrollTop - _this9.element.clientHeight + rowEl.offsetHeight;
						}

						break;

				}

				resolve();
			} else {

				console.warn("Scroll Error - Row not visible");

				reject("Scroll Error - Row not visible");
			}
		});
	};

	////////////////// Data Handling //////////////////


	RowManager.prototype.setData = function (data, renderInPosition, columnsChanged) {
		var _this10 = this;

		var self = this;

		return new Promise(function (resolve, reject) {

			if (renderInPosition && _this10.getDisplayRows().length) {

				if (self.table.options.pagination) {

					self._setDataActual(data, true);
				} else {

					_this10.reRenderInPosition(function () {

						self._setDataActual(data);
					});
				}
			} else {

				if (_this10.table.options.autoColumns && columnsChanged) {

					_this10.table.columnManager.generateColumnsFromRowData(data);
				}

				_this10.resetScroll();

				_this10._setDataActual(data);
			}

			resolve();
		});
	};

	RowManager.prototype._setDataActual = function (data, renderInPosition) {

		var self = this;

		self.table.options.dataLoading.call(this.table, data);

		this._wipeElements();

		if (this.table.options.history && this.table.modExists("history")) {

			this.table.modules.history.clear();
		}

		if (Array.isArray(data)) {

			if (this.table.modExists("selectRow")) {

				this.table.modules.selectRow.clearSelectionData();
			}

			if (this.table.options.reactiveData && this.table.modExists("reactiveData", true)) {

				this.table.modules.reactiveData.watchData(data);
			}

			data.forEach(function (def, i) {

				if (def && (typeof def === 'undefined' ? 'undefined' : _typeof(def)) === "object") {

					var row = new Row(def, self);

					self.rows.push(row);
				} else {

					console.warn("Data Loading Warning - Invalid row data detected and ignored, expecting object but received:", def);
				}
			});

			self.refreshActiveData(false, false, renderInPosition);

			self.table.options.dataLoaded.call(this.table, data);
		} else {

			console.error("Data Loading Error - Unable to process data due to invalid data type \nExpecting: array \nReceived: ", typeof data === 'undefined' ? 'undefined' : _typeof(data), "\nData:     ", data);
		}
	};

	RowManager.prototype._wipeElements = function () {

		this.rows.forEach(function (row) {

			row.wipe();
		});

		if (this.table.options.groupBy && this.table.modExists("groupRows")) {

			this.table.modules.groupRows.wipe();
		}

		this.rows = [];

		this.adjustTableSize();
	};

	RowManager.prototype.deleteRow = function (row, blockRedraw) {

		var allIndex = this.rows.indexOf(row),
		    activeIndex = this.activeRows.indexOf(row);

		if (activeIndex > -1) {

			this.activeRows.splice(activeIndex, 1);
		}

		if (allIndex > -1) {

			this.rows.splice(allIndex, 1);
		}

		this.setActiveRows(this.activeRows);

		this.displayRowIterator(function (rows) {

			var displayIndex = rows.indexOf(row);

			if (displayIndex > -1) {

				rows.splice(displayIndex, 1);
			}
		});

		if (!blockRedraw) {

			this.reRenderInPosition();
		}

		this.regenerateRowNumbers();

		this.table.options.rowDeleted.call(this.table, row.getComponent());

		this.table.options.dataEdited.call(this.table, this.getData());

		if (this.table.options.groupBy && this.table.modExists("groupRows")) {

			this.table.modules.groupRows.updateGroupRows(true);
		} else if (this.table.options.pagination && this.table.modExists("page")) {

			this.refreshActiveData(false, false, true);
		} else {

			if (this.table.options.pagination && this.table.modExists("page")) {

				this.refreshActiveData("page");
			}
		}
	};

	RowManager.prototype.addRow = function (data, pos, index, blockRedraw) {

		var row = this.addRowActual(data, pos, index, blockRedraw);

		if (this.table.options.history && this.table.modExists("history")) {

			this.table.modules.history.action("rowAdd", row, { data: data, pos: pos, index: index });
		}

		return row;
	};

	//add multiple rows

	RowManager.prototype.addRows = function (data, pos, index) {
		var _this11 = this;

		var self = this,
		    length = 0,
		    rows = [];

		return new Promise(function (resolve, reject) {

			pos = _this11.findAddRowPos(pos);

			if (!Array.isArray(data)) {

				data = [data];
			}

			length = data.length - 1;

			if (typeof index == "undefined" && pos || typeof index !== "undefined" && !pos) {

				data.reverse();
			}

			data.forEach(function (item, i) {

				var row = self.addRow(item, pos, index, true);

				rows.push(row);
			});

			if (_this11.table.options.groupBy && _this11.table.modExists("groupRows")) {

				_this11.table.modules.groupRows.updateGroupRows(true);
			} else if (_this11.table.options.pagination && _this11.table.modExists("page")) {

				_this11.refreshActiveData(false, false, true);
			} else {

				_this11.reRenderInPosition();
			}

			//recalc column calculations if present

			if (_this11.table.modExists("columnCalcs")) {

				_this11.table.modules.columnCalcs.recalc(_this11.table.rowManager.activeRows);
			}

			_this11.regenerateRowNumbers();

			resolve(rows);
		});
	};

	RowManager.prototype.findAddRowPos = function (pos) {

		if (typeof pos === "undefined") {

			pos = this.table.options.addRowPos;
		}

		if (pos === "pos") {

			pos = true;
		}

		if (pos === "bottom") {

			pos = false;
		}

		return pos;
	};

	RowManager.prototype.addRowActual = function (data, pos, index, blockRedraw) {

		var row = data instanceof Row ? data : new Row(data || {}, this),
		    top = this.findAddRowPos(pos),
		    allIndex = -1,
		    activeIndex,
		    dispRows;

		if (!index && this.table.options.pagination && this.table.options.paginationAddRow == "page") {

			dispRows = this.getDisplayRows();

			if (top) {

				if (dispRows.length) {

					index = dispRows[0];
				} else {

					if (this.activeRows.length) {

						index = this.activeRows[this.activeRows.length - 1];

						top = false;
					}
				}
			} else {

				if (dispRows.length) {

					index = dispRows[dispRows.length - 1];

					top = dispRows.length < this.table.modules.page.getPageSize() ? false : true;
				}
			}
		}

		if (typeof index !== "undefined") {

			index = this.findRow(index);
		}

		if (this.table.options.groupBy && this.table.modExists("groupRows")) {

			this.table.modules.groupRows.assignRowToGroup(row);

			var groupRows = row.getGroup().rows;

			if (groupRows.length > 1) {

				if (!index || index && groupRows.indexOf(index) == -1) {

					if (top) {

						if (groupRows[0] !== row) {

							index = groupRows[0];

							this._moveRowInArray(row.getGroup().rows, row, index, !top);
						}
					} else {

						if (groupRows[groupRows.length - 1] !== row) {

							index = groupRows[groupRows.length - 1];

							this._moveRowInArray(row.getGroup().rows, row, index, !top);
						}
					}
				} else {

					this._moveRowInArray(row.getGroup().rows, row, index, !top);
				}
			}
		}

		if (index) {

			allIndex = this.rows.indexOf(index);
		}

		if (index && allIndex > -1) {

			activeIndex = this.activeRows.indexOf(index);

			this.displayRowIterator(function (rows) {

				var displayIndex = rows.indexOf(index);

				if (displayIndex > -1) {

					rows.splice(top ? displayIndex : displayIndex + 1, 0, row);
				}
			});

			if (activeIndex > -1) {

				this.activeRows.splice(top ? activeIndex : activeIndex + 1, 0, row);
			}

			this.rows.splice(top ? allIndex : allIndex + 1, 0, row);
		} else {

			if (top) {

				this.displayRowIterator(function (rows) {

					rows.unshift(row);
				});

				this.activeRows.unshift(row);

				this.rows.unshift(row);
			} else {

				this.displayRowIterator(function (rows) {

					rows.push(row);
				});

				this.activeRows.push(row);

				this.rows.push(row);
			}
		}

		this.setActiveRows(this.activeRows);

		this.table.options.rowAdded.call(this.table, row.getComponent());

		this.table.options.dataEdited.call(this.table, this.getData());

		if (!blockRedraw) {

			this.reRenderInPosition();
		}

		return row;
	};

	RowManager.prototype.moveRow = function (from, to, after) {

		if (this.table.options.history && this.table.modExists("history")) {

			this.table.modules.history.action("rowMove", from, { posFrom: this.getRowPosition(from), posTo: this.getRowPosition(to), to: to, after: after });
		}

		this.moveRowActual(from, to, after);

		this.regenerateRowNumbers();

		this.table.options.rowMoved.call(this.table, from.getComponent());
	};

	RowManager.prototype.moveRowActual = function (from, to, after) {
		var _this12 = this;

		this._moveRowInArray(this.rows, from, to, after);

		this._moveRowInArray(this.activeRows, from, to, after);

		this.displayRowIterator(function (rows) {

			_this12._moveRowInArray(rows, from, to, after);
		});

		if (this.table.options.groupBy && this.table.modExists("groupRows")) {

			if (!after && to instanceof Group) {

				to = this.table.rowManager.prevDisplayRow(from) || to;
			}

			var toGroup = to.getGroup();

			var fromGroup = from.getGroup();

			if (toGroup === fromGroup) {

				this._moveRowInArray(toGroup.rows, from, to, after);
			} else {

				if (fromGroup) {

					fromGroup.removeRow(from);
				}

				toGroup.insertRow(from, to, after);
			}
		}
	};

	RowManager.prototype._moveRowInArray = function (rows, from, to, after) {

		var fromIndex, toIndex, start, end;

		if (from !== to) {

			fromIndex = rows.indexOf(from);

			if (fromIndex > -1) {

				rows.splice(fromIndex, 1);

				toIndex = rows.indexOf(to);

				if (toIndex > -1) {

					if (after) {

						rows.splice(toIndex + 1, 0, from);
					} else {

						rows.splice(toIndex, 0, from);
					}
				} else {

					rows.splice(fromIndex, 0, from);
				}
			}

			//restyle rows

			if (rows === this.getDisplayRows()) {

				start = fromIndex < toIndex ? fromIndex : toIndex;

				end = toIndex > fromIndex ? toIndex : fromIndex + 1;

				for (var _i4 = start; _i4 <= end; _i4++) {

					if (rows[_i4]) {

						this.styleRow(rows[_i4], _i4);
					}
				}
			}
		}
	};

	RowManager.prototype.clearData = function () {

		this.setData([]);
	};

	RowManager.prototype.getRowIndex = function (row) {

		return this.findRowIndex(row, this.rows);
	};

	RowManager.prototype.getDisplayRowIndex = function (row) {

		var index = this.getDisplayRows().indexOf(row);

		return index > -1 ? index : false;
	};

	RowManager.prototype.nextDisplayRow = function (row, rowOnly) {

		var index = this.getDisplayRowIndex(row),
		    nextRow = false;

		if (index !== false && index < this.displayRowsCount - 1) {

			nextRow = this.getDisplayRows()[index + 1];
		}

		if (nextRow && (!(nextRow instanceof Row) || nextRow.type != "row")) {

			return this.nextDisplayRow(nextRow, rowOnly);
		}

		return nextRow;
	};

	RowManager.prototype.prevDisplayRow = function (row, rowOnly) {

		var index = this.getDisplayRowIndex(row),
		    prevRow = false;

		if (index) {

			prevRow = this.getDisplayRows()[index - 1];
		}

		if (rowOnly && prevRow && (!(prevRow instanceof Row) || prevRow.type != "row")) {

			return this.prevDisplayRow(prevRow, rowOnly);
		}

		return prevRow;
	};

	RowManager.prototype.findRowIndex = function (row, list) {

		var rowIndex;

		row = this.findRow(row);

		if (row) {

			rowIndex = list.indexOf(row);

			if (rowIndex > -1) {

				return rowIndex;
			}
		}

		return false;
	};

	RowManager.prototype.getData = function (active, transform) {

		var output = [],
		    rows = this.getRows(active);

		rows.forEach(function (row) {

			if (row.type == "row") {

				output.push(row.getData(transform || "data"));
			}
		});

		return output;
	};

	RowManager.prototype.getComponents = function (active) {

		var output = [],
		    rows = this.getRows(active);

		rows.forEach(function (row) {

			output.push(row.getComponent());
		});

		return output;
	};

	RowManager.prototype.getDataCount = function (active) {

		var rows = this.getRows(active);

		return rows.length;
	};

	RowManager.prototype._genRemoteRequest = function () {
		var _this13 = this;

		var table = this.table,
		    options = table.options,
		    params = {};

		if (table.modExists("page")) {

			//set sort data if defined

			if (options.ajaxSorting) {

				var sorters = this.table.modules.sort.getSort();

				sorters.forEach(function (item) {

					delete item.column;
				});

				params[this.table.modules.page.paginationDataSentNames.sorters] = sorters;
			}

			//set filter data if defined

			if (options.ajaxFiltering) {

				var filters = this.table.modules.filter.getFilters(true, true);

				params[this.table.modules.page.paginationDataSentNames.filters] = filters;
			}

			this.table.modules.ajax.setParams(params, true);
		}

		table.modules.ajax.sendRequest().then(function (data) {

			_this13._setDataActual(data, true);
		}).catch(function (e) {});
	};

	//choose the path to refresh data after a filter update

	RowManager.prototype.filterRefresh = function () {

		var table = this.table,
		    options = table.options,
		    left = this.scrollLeft;

		if (options.ajaxFiltering) {

			if (options.pagination == "remote" && table.modExists("page")) {

				table.modules.page.reset(true);

				table.modules.page.setPage(1).then(function () {}).catch(function () {});
			} else if (options.ajaxProgressiveLoad) {

				table.modules.ajax.loadData().then(function () {}).catch(function () {});
			} else {

				//assume data is url, make ajax call to url to get data

				this._genRemoteRequest();
			}
		} else {

			this.refreshActiveData("filter");
		}

		this.scrollHorizontal(left);
	};

	//choose the path to refresh data after a sorter update

	RowManager.prototype.sorterRefresh = function (loadOrignalData) {

		var table = this.table,
		    options = this.table.options,
		    left = this.scrollLeft;

		if (options.ajaxSorting) {

			if ((options.pagination == "remote" || options.progressiveLoad) && table.modExists("page")) {

				table.modules.page.reset(true);

				table.modules.page.setPage(1).then(function () {}).catch(function () {});
			} else if (options.ajaxProgressiveLoad) {

				table.modules.ajax.loadData().then(function () {}).catch(function () {});
			} else {

				//assume data is url, make ajax call to url to get data

				this._genRemoteRequest();
			}
		} else {

			this.refreshActiveData(loadOrignalData ? "filter" : "sort");
		}

		this.scrollHorizontal(left);
	};

	RowManager.prototype.scrollHorizontal = function (left) {

		this.scrollLeft = left;

		this.element.scrollLeft = left;

		if (this.table.options.groupBy) {

			this.table.modules.groupRows.scrollHeaders(left);
		}

		if (this.table.modExists("columnCalcs")) {

			this.table.modules.columnCalcs.scrollHorizontal(left);
		}
	};

	//set active data set

	RowManager.prototype.refreshActiveData = function (stage, skipStage, renderInPosition) {

		var self = this,
		    table = this.table,
		    cascadeOrder = ["all", "filter", "sort", "display", "freeze", "group", "tree", "page"],
		    displayIndex;

		if (this.redrawBlock) {

			if (!this.redrawBlockRestoreConfig || cascadeOrder.indexOf(stage) < cascadeOrder.indexOf(this.redrawBlockRestoreConfig.stage)) {

				this.redrawBlockRestoreConfig = {

					stage: stage,

					skipStage: skipStage,

					renderInPosition: renderInPosition

				};
			}

			return;
		} else {

			if (self.table.modExists("edit")) {

				self.table.modules.edit.cancelEdit();
			}

			if (!stage) {

				stage = "all";
			}

			if (table.options.selectable && !table.options.selectablePersistence && table.modExists("selectRow")) {

				table.modules.selectRow.deselectRows();
			}

			//cascade through data refresh stages

			switch (stage) {

				case "all":

				case "filter":

					if (!skipStage) {

						if (table.modExists("filter")) {

							self.setActiveRows(table.modules.filter.filter(self.rows));
						} else {

							self.setActiveRows(self.rows.slice(0));
						}
					} else {

						skipStage = false;
					}

				case "sort":

					if (!skipStage) {

						if (table.modExists("sort")) {

							table.modules.sort.sort(this.activeRows);
						}
					} else {

						skipStage = false;
					}

					//regenerate row numbers for row number formatter if in use

					this.regenerateRowNumbers();

				//generic stage to allow for pipeline trigger after the data manipulation stage

				case "display":

					this.resetDisplayRows();

				case "freeze":

					if (!skipStage) {

						if (this.table.modExists("frozenRows")) {

							if (table.modules.frozenRows.isFrozen()) {

								if (!table.modules.frozenRows.getDisplayIndex()) {

									table.modules.frozenRows.setDisplayIndex(this.getNextDisplayIndex());
								}

								displayIndex = table.modules.frozenRows.getDisplayIndex();

								displayIndex = self.setDisplayRows(table.modules.frozenRows.getRows(this.getDisplayRows(displayIndex - 1)), displayIndex);

								if (displayIndex !== true) {

									table.modules.frozenRows.setDisplayIndex(displayIndex);
								}
							}
						}
					} else {

						skipStage = false;
					}

				case "group":

					if (!skipStage) {

						if (table.options.groupBy && table.modExists("groupRows")) {

							if (!table.modules.groupRows.getDisplayIndex()) {

								table.modules.groupRows.setDisplayIndex(this.getNextDisplayIndex());
							}

							displayIndex = table.modules.groupRows.getDisplayIndex();

							displayIndex = self.setDisplayRows(table.modules.groupRows.getRows(this.getDisplayRows(displayIndex - 1)), displayIndex);

							if (displayIndex !== true) {

								table.modules.groupRows.setDisplayIndex(displayIndex);
							}
						}
					} else {

						skipStage = false;
					}

				case "tree":

					if (!skipStage) {

						if (table.options.dataTree && table.modExists("dataTree")) {

							if (!table.modules.dataTree.getDisplayIndex()) {

								table.modules.dataTree.setDisplayIndex(this.getNextDisplayIndex());
							}

							displayIndex = table.modules.dataTree.getDisplayIndex();

							displayIndex = self.setDisplayRows(table.modules.dataTree.getRows(this.getDisplayRows(displayIndex - 1)), displayIndex);

							if (displayIndex !== true) {

								table.modules.dataTree.setDisplayIndex(displayIndex);
							}
						}
					} else {

						skipStage = false;
					}

					if (table.options.pagination && table.modExists("page") && !renderInPosition) {

						if (table.modules.page.getMode() == "local") {

							table.modules.page.reset();
						}
					}

				case "page":

					if (!skipStage) {

						if (table.options.pagination && table.modExists("page")) {

							if (!table.modules.page.getDisplayIndex()) {

								table.modules.page.setDisplayIndex(this.getNextDisplayIndex());
							}

							displayIndex = table.modules.page.getDisplayIndex();

							if (table.modules.page.getMode() == "local") {

								table.modules.page.setMaxRows(this.getDisplayRows(displayIndex - 1).length);
							}

							displayIndex = self.setDisplayRows(table.modules.page.getRows(this.getDisplayRows(displayIndex - 1)), displayIndex);

							if (displayIndex !== true) {

								table.modules.page.setDisplayIndex(displayIndex);
							}
						}
					} else {

						skipStage = false;
					}

			}

			if (Tabulator.prototype.helpers.elVisible(self.element)) {

				if (renderInPosition) {

					self.reRenderInPosition();
				} else {

					self.renderTable();

					if (table.options.layoutColumnsOnNewData) {

						self.table.columnManager.redraw(true);
					}
				}
			}

			if (table.modExists("columnCalcs")) {

				table.modules.columnCalcs.recalc(this.activeRows);
			}
		}
	};

	//regenerate row numbers for row number formatter if in use

	RowManager.prototype.regenerateRowNumbers = function () {
		var _this14 = this;

		if (this.rowNumColumn) {

			this.activeRows.forEach(function (row) {

				var cell = row.getCell(_this14.rowNumColumn);

				if (cell) {

					cell._generateContents();
				}
			});
		}
	};

	RowManager.prototype.setActiveRows = function (activeRows) {

		this.activeRows = activeRows;

		this.activeRowsCount = this.activeRows.length;
	};

	//reset display rows array

	RowManager.prototype.resetDisplayRows = function () {

		this.displayRows = [];

		this.displayRows.push(this.activeRows.slice(0));

		this.displayRowsCount = this.displayRows[0].length;

		if (this.table.modExists("frozenRows")) {

			this.table.modules.frozenRows.setDisplayIndex(0);
		}

		if (this.table.options.groupBy && this.table.modExists("groupRows")) {

			this.table.modules.groupRows.setDisplayIndex(0);
		}

		if (this.table.options.pagination && this.table.modExists("page")) {

			this.table.modules.page.setDisplayIndex(0);
		}
	};

	RowManager.prototype.getNextDisplayIndex = function () {

		return this.displayRows.length;
	};

	//set display row pipeline data

	RowManager.prototype.setDisplayRows = function (displayRows, index) {

		var output = true;

		if (index && typeof this.displayRows[index] != "undefined") {

			this.displayRows[index] = displayRows;

			output = true;
		} else {

			this.displayRows.push(displayRows);

			output = index = this.displayRows.length - 1;
		}

		if (index == this.displayRows.length - 1) {

			this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length;
		}

		return output;
	};

	RowManager.prototype.getDisplayRows = function (index) {

		if (typeof index == "undefined") {

			return this.displayRows.length ? this.displayRows[this.displayRows.length - 1] : [];
		} else {

			return this.displayRows[index] || [];
		}
	};

	RowManager.prototype.getVisibleRows = function (viewable) {

		var topEdge = this.element.scrollTop,
		    bottomEdge = this.element.clientHeight + topEdge,
		    topFound = false,
		    topRow = 0,
		    bottomRow = 0,
		    rows = this.getDisplayRows();

		if (viewable) {

			this.getDisplayRows();

			for (var i = this.vDomTop; i <= this.vDomBottom; i++) {

				if (rows[i]) {

					if (!topFound) {

						if (topEdge - rows[i].getElement().offsetTop >= 0) {

							topRow = i;
						} else {

							topFound = true;

							if (bottomEdge - rows[i].getElement().offsetTop >= 0) {

								bottomRow = i;
							} else {

								break;
							}
						}
					} else {

						if (bottomEdge - rows[i].getElement().offsetTop >= 0) {

							bottomRow = i;
						} else {

							break;
						}
					}
				}
			}
		} else {

			topRow = this.vDomTop;

			bottomRow = this.vDomBottom;
		}

		return rows.slice(topRow, bottomRow + 1);
	};

	//repeat action accross display rows

	RowManager.prototype.displayRowIterator = function (callback) {

		this.displayRows.forEach(callback);

		this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length;
	};

	//return only actual rows (not group headers etc)

	RowManager.prototype.getRows = function (active) {

		var rows;

		switch (active) {

			case "active":

				rows = this.activeRows;

				break;

			case "display":

				rows = this.table.rowManager.getDisplayRows();

				break;

			case "visible":

				rows = this.getVisibleRows(true);

				break;

			default:

				rows = this.rows;

		}

		return rows;
	};

	///////////////// Table Rendering /////////////////


	//trigger rerender of table in current position

	RowManager.prototype.reRenderInPosition = function (callback) {

		if (this.getRenderMode() == "virtual") {

			if (this.redrawBlock) {

				if (callback) {

					callback();
				} else {

					this.redrawBlockRederInPosition = true;
				}
			} else {

				var scrollTop = this.element.scrollTop;

				var topRow = false;

				var topOffset = false;

				var left = this.scrollLeft;

				var rows = this.getDisplayRows();

				for (var i = this.vDomTop; i <= this.vDomBottom; i++) {

					if (rows[i]) {

						var diff = scrollTop - rows[i].getElement().offsetTop;

						if (topOffset === false || Math.abs(diff) < topOffset) {

							topOffset = diff;

							topRow = i;
						} else {

							break;
						}
					}
				}

				if (callback) {

					callback();
				}

				this._virtualRenderFill(topRow === false ? this.displayRowsCount - 1 : topRow, true, topOffset || 0);

				this.scrollHorizontal(left);
			}
		} else {

			this.renderTable();

			if (callback) {

				callback();
			}
		}
	};

	RowManager.prototype.setRenderMode = function () {

		if (this.table.options.virtualDom) {

			this.renderMode = "virtual";

			if (this.table.element.clientHeight || this.table.options.height) {

				this.fixedHeight = true;
			} else {

				this.fixedHeight = false;
			}
		} else {

			this.renderMode = "classic";
		}
	};

	RowManager.prototype.getRenderMode = function () {

		return this.renderMode;
	};

	RowManager.prototype.renderTable = function () {

		this.table.options.renderStarted.call(this.table);

		this.element.scrollTop = 0;

		switch (this.renderMode) {

			case "classic":

				this._simpleRender();

				break;

			case "virtual":

				this._virtualRenderFill();

				break;

		}

		if (this.firstRender) {

			if (this.displayRowsCount) {

				this.firstRender = false;

				this.table.modules.layout.layout();
			} else {

				this.renderEmptyScroll();
			}
		}

		if (this.table.modExists("frozenColumns")) {

			this.table.modules.frozenColumns.layout();
		}

		if (!this.displayRowsCount) {

			if (this.table.options.placeholder) {

				this.table.options.placeholder.setAttribute("tabulator-render-mode", this.renderMode);

				this.getElement().appendChild(this.table.options.placeholder);

				this.table.options.placeholder.style.width = this.table.columnManager.getWidth() + "px";
			}
		}

		this.table.options.renderComplete.call(this.table);
	};

	//simple render on heightless table

	RowManager.prototype._simpleRender = function () {

		this._clearVirtualDom();

		if (this.displayRowsCount) {

			this.checkClassicModeGroupHeaderWidth();
		} else {

			this.renderEmptyScroll();
		}
	};

	RowManager.prototype.checkClassicModeGroupHeaderWidth = function () {

		var self = this,
		    element = this.tableElement,
		    onlyGroupHeaders = true;

		self.getDisplayRows().forEach(function (row, index) {

			self.styleRow(row, index);

			element.appendChild(row.getElement());

			row.initialize(true);

			if (row.type !== "group") {

				onlyGroupHeaders = false;
			}
		});

		if (onlyGroupHeaders) {

			element.style.minWidth = self.table.columnManager.getWidth() + "px";
		} else {

			element.style.minWidth = "";
		}
	};

	//show scrollbars on empty table div

	RowManager.prototype.renderEmptyScroll = function () {

		if (this.table.options.placeholder) {

			this.tableElement.style.display = "none";
		} else {

			this.tableElement.style.minWidth = this.table.columnManager.getWidth() + "px";

			this.tableElement.style.minHeight = "1px";

			this.tableElement.style.visibility = "hidden";
		}
	};

	RowManager.prototype._clearVirtualDom = function () {

		var element = this.tableElement;

		if (this.table.options.placeholder && this.table.options.placeholder.parentNode) {

			this.table.options.placeholder.parentNode.removeChild(this.table.options.placeholder);
		}

		// element.children.detach();

		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}element.style.paddingTop = "";

		element.style.paddingBottom = "";

		element.style.minWidth = "";

		element.style.minHeight = "";

		element.style.display = "";

		element.style.visibility = "";

		this.scrollTop = 0;

		this.scrollLeft = 0;

		this.vDomTop = 0;

		this.vDomBottom = 0;

		this.vDomTopPad = 0;

		this.vDomBottomPad = 0;
	};

	RowManager.prototype.styleRow = function (row, index) {

		var rowEl = row.getElement();

		if (index % 2) {

			rowEl.classList.add("tabulator-row-even");

			rowEl.classList.remove("tabulator-row-odd");
		} else {

			rowEl.classList.add("tabulator-row-odd");

			rowEl.classList.remove("tabulator-row-even");
		}
	};

	//full virtual render

	RowManager.prototype._virtualRenderFill = function (position, forceMove, offset) {

		var self = this,
		    element = self.tableElement,
		    holder = self.element,
		    topPad = 0,
		    rowsHeight = 0,
		    topPadHeight = 0,
		    i = 0,
		    onlyGroupHeaders = true,
		    rows = self.getDisplayRows();

		position = position || 0;

		offset = offset || 0;

		if (!position) {

			self._clearVirtualDom();
		} else {

			while (element.firstChild) {
				element.removeChild(element.firstChild);
			} //check if position is too close to bottom of table

			var heightOccupied = (self.displayRowsCount - position + 1) * self.vDomRowHeight;

			if (heightOccupied < self.height) {

				position -= Math.ceil((self.height - heightOccupied) / self.vDomRowHeight);

				if (position < 0) {

					position = 0;
				}
			}

			//calculate initial pad

			topPad = Math.min(Math.max(Math.floor(self.vDomWindowBuffer / self.vDomRowHeight), self.vDomWindowMinMarginRows), position);

			position -= topPad;
		}

		if (self.displayRowsCount && Tabulator.prototype.helpers.elVisible(self.element)) {

			self.vDomTop = position;

			self.vDomBottom = position - 1;

			while ((rowsHeight <= self.height + self.vDomWindowBuffer || i < self.vDomWindowMinTotalRows) && self.vDomBottom < self.displayRowsCount - 1) {

				var index = self.vDomBottom + 1,
				    row = rows[index],
				    rowHeight = 0;

				self.styleRow(row, index);

				element.appendChild(row.getElement());

				if (!row.initialized) {

					row.initialize(true);
				} else {

					if (!row.heightInitialized) {

						row.normalizeHeight(true);
					}
				}

				rowHeight = row.getHeight();

				if (i < topPad) {

					topPadHeight += rowHeight;
				} else {

					rowsHeight += rowHeight;
				}

				if (rowHeight > this.vDomWindowBuffer) {

					this.vDomWindowBuffer = rowHeight * 2;
				}

				if (row.type !== "group") {

					onlyGroupHeaders = false;
				}

				self.vDomBottom++;

				i++;
			}

			if (!position) {

				this.vDomTopPad = 0;

				//adjust rowheight to match average of rendered elements

				self.vDomRowHeight = Math.floor((rowsHeight + topPadHeight) / i);

				self.vDomBottomPad = self.vDomRowHeight * (self.displayRowsCount - self.vDomBottom - 1);

				self.vDomScrollHeight = topPadHeight + rowsHeight + self.vDomBottomPad - self.height;
			} else {

				self.vDomTopPad = !forceMove ? self.scrollTop - topPadHeight : self.vDomRowHeight * this.vDomTop + offset;

				self.vDomBottomPad = self.vDomBottom == self.displayRowsCount - 1 ? 0 : Math.max(self.vDomScrollHeight - self.vDomTopPad - rowsHeight - topPadHeight, 0);
			}

			element.style.paddingTop = self.vDomTopPad + "px";

			element.style.paddingBottom = self.vDomBottomPad + "px";

			if (forceMove) {

				this.scrollTop = self.vDomTopPad + topPadHeight + offset - (this.element.scrollWidth > this.element.clientWidth ? this.element.offsetHeight - this.element.clientHeight : 0);
			}

			this.scrollTop = Math.min(this.scrollTop, this.element.scrollHeight - this.height);

			//adjust for horizontal scrollbar if present (and not at top of table)

			if (this.element.scrollWidth > this.element.offsetWidth && forceMove) {

				this.scrollTop += this.element.offsetHeight - this.element.clientHeight;
			}

			this.vDomScrollPosTop = this.scrollTop;

			this.vDomScrollPosBottom = this.scrollTop;

			holder.scrollTop = this.scrollTop;

			element.style.minWidth = onlyGroupHeaders ? self.table.columnManager.getWidth() + "px" : "";

			if (self.table.options.groupBy) {

				if (self.table.modules.layout.getMode() != "fitDataFill" && self.displayRowsCount == self.table.modules.groupRows.countGroups()) {

					self.tableElement.style.minWidth = self.table.columnManager.getWidth();
				}
			}
		} else {

			this.renderEmptyScroll();
		}

		if (!this.fixedHeight) {

			this.adjustTableSize();
		}
	};

	//handle vertical scrolling

	RowManager.prototype.scrollVertical = function (dir) {

		var topDiff = this.scrollTop - this.vDomScrollPosTop;

		var bottomDiff = this.scrollTop - this.vDomScrollPosBottom;

		var margin = this.vDomWindowBuffer * 2;

		if (-topDiff > margin || bottomDiff > margin) {

			//if big scroll redraw table;

			var left = this.scrollLeft;

			this._virtualRenderFill(Math.floor(this.element.scrollTop / this.element.scrollHeight * this.displayRowsCount));

			this.scrollHorizontal(left);
		} else {

			if (dir) {

				//scrolling up

				if (topDiff < 0) {

					this._addTopRow(-topDiff);
				}

				if (bottomDiff < 0) {

					//hide bottom row if needed

					if (this.vDomScrollHeight - this.scrollTop > this.vDomWindowBuffer) {

						this._removeBottomRow(-bottomDiff);
					} else {

						this.vDomScrollPosBottom = this.scrollTop;
					}
				}
			} else {

				//scrolling down

				if (topDiff >= 0) {

					//hide top row if needed

					if (this.scrollTop > this.vDomWindowBuffer) {

						this._removeTopRow(topDiff);
					} else {

						this.vDomScrollPosTop = this.scrollTop;
					}
				}

				if (bottomDiff >= 0) {

					this._addBottomRow(bottomDiff);
				}
			}
		}
	};

	RowManager.prototype._addTopRow = function (topDiff) {
		var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


		var table = this.tableElement,
		    rows = this.getDisplayRows();

		if (this.vDomTop) {

			var index = this.vDomTop - 1,
			    topRow = rows[index],
			    topRowHeight = topRow.getHeight() || this.vDomRowHeight;

			//hide top row if needed

			if (topDiff >= topRowHeight) {

				this.styleRow(topRow, index);

				table.insertBefore(topRow.getElement(), table.firstChild);

				if (!topRow.initialized || !topRow.heightInitialized) {

					this.vDomTopNewRows.push(topRow);

					if (!topRow.heightInitialized) {

						topRow.clearCellHeight();
					}
				}

				topRow.initialize();

				this.vDomTopPad -= topRowHeight;

				if (this.vDomTopPad < 0) {

					this.vDomTopPad = index * this.vDomRowHeight;
				}

				if (!index) {

					this.vDomTopPad = 0;
				}

				table.style.paddingTop = this.vDomTopPad + "px";

				this.vDomScrollPosTop -= topRowHeight;

				this.vDomTop--;
			}

			topDiff = -(this.scrollTop - this.vDomScrollPosTop);

			if (topRow.getHeight() > this.vDomWindowBuffer) {

				this.vDomWindowBuffer = topRow.getHeight() * 2;
			}

			if (i < this.vDomMaxRenderChain && this.vDomTop && topDiff >= (rows[this.vDomTop - 1].getHeight() || this.vDomRowHeight)) {

				this._addTopRow(topDiff, i + 1);
			} else {

				this._quickNormalizeRowHeight(this.vDomTopNewRows);
			}
		}
	};

	RowManager.prototype._removeTopRow = function (topDiff) {

		var table = this.tableElement,
		    topRow = this.getDisplayRows()[this.vDomTop],
		    topRowHeight = topRow.getHeight() || this.vDomRowHeight;

		if (topDiff >= topRowHeight) {

			var rowEl = topRow.getElement();

			rowEl.parentNode.removeChild(rowEl);

			this.vDomTopPad += topRowHeight;

			table.style.paddingTop = this.vDomTopPad + "px";

			this.vDomScrollPosTop += this.vDomTop ? topRowHeight : topRowHeight + this.vDomWindowBuffer;

			this.vDomTop++;

			topDiff = this.scrollTop - this.vDomScrollPosTop;

			this._removeTopRow(topDiff);
		}
	};

	RowManager.prototype._addBottomRow = function (bottomDiff) {
		var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


		var table = this.tableElement,
		    rows = this.getDisplayRows();

		if (this.vDomBottom < this.displayRowsCount - 1) {

			var index = this.vDomBottom + 1,
			    bottomRow = rows[index],
			    bottomRowHeight = bottomRow.getHeight() || this.vDomRowHeight;

			//hide bottom row if needed

			if (bottomDiff >= bottomRowHeight) {

				this.styleRow(bottomRow, index);

				table.appendChild(bottomRow.getElement());

				if (!bottomRow.initialized || !bottomRow.heightInitialized) {

					this.vDomBottomNewRows.push(bottomRow);

					if (!bottomRow.heightInitialized) {

						bottomRow.clearCellHeight();
					}
				}

				bottomRow.initialize();

				this.vDomBottomPad -= bottomRowHeight;

				if (this.vDomBottomPad < 0 || index == this.displayRowsCount - 1) {

					this.vDomBottomPad = 0;
				}

				table.style.paddingBottom = this.vDomBottomPad + "px";

				this.vDomScrollPosBottom += bottomRowHeight;

				this.vDomBottom++;
			}

			bottomDiff = this.scrollTop - this.vDomScrollPosBottom;

			if (bottomRow.getHeight() > this.vDomWindowBuffer) {

				this.vDomWindowBuffer = bottomRow.getHeight() * 2;
			}

			if (i < this.vDomMaxRenderChain && this.vDomBottom < this.displayRowsCount - 1 && bottomDiff >= (rows[this.vDomBottom + 1].getHeight() || this.vDomRowHeight)) {

				this._addBottomRow(bottomDiff, i + 1);
			} else {

				this._quickNormalizeRowHeight(this.vDomBottomNewRows);
			}
		}
	};

	RowManager.prototype._removeBottomRow = function (bottomDiff) {

		var table = this.tableElement,
		    bottomRow = this.getDisplayRows()[this.vDomBottom],
		    bottomRowHeight = bottomRow.getHeight() || this.vDomRowHeight;

		if (bottomDiff >= bottomRowHeight) {

			var rowEl = bottomRow.getElement();

			if (rowEl.parentNode) {

				rowEl.parentNode.removeChild(rowEl);
			}

			this.vDomBottomPad += bottomRowHeight;

			if (this.vDomBottomPad < 0) {

				this.vDomBottomPad = 0;
			}

			table.style.paddingBottom = this.vDomBottomPad + "px";

			this.vDomScrollPosBottom -= bottomRowHeight;

			this.vDomBottom--;

			bottomDiff = -(this.scrollTop - this.vDomScrollPosBottom);

			this._removeBottomRow(bottomDiff);
		}
	};

	RowManager.prototype._quickNormalizeRowHeight = function (rows) {

		rows.forEach(function (row) {

			row.calcHeight();
		});

		rows.forEach(function (row) {

			row.setCellHeight();
		});

		rows.length = 0;
	};

	//normalize height of active rows

	RowManager.prototype.normalizeHeight = function () {

		this.activeRows.forEach(function (row) {

			row.normalizeHeight();
		});
	};

	//adjust the height of the table holder to fit in the Tabulator element

	RowManager.prototype.adjustTableSize = function () {

		var initialHeight = this.element.clientHeight,
		    modExists;

		if (this.renderMode === "virtual") {

			var otherHeight = this.columnManager.getElement().offsetHeight + (this.table.footerManager && !this.table.footerManager.external ? this.table.footerManager.getElement().offsetHeight : 0);

			if (this.fixedHeight) {

				this.element.style.minHeight = "calc(100% - " + otherHeight + "px)";

				this.element.style.height = "calc(100% - " + otherHeight + "px)";

				this.element.style.maxHeight = "calc(100% - " + otherHeight + "px)";
			} else {

				this.element.style.height = "";

				this.element.style.height = this.table.element.clientHeight - otherHeight + "px";

				this.element.scrollTop = this.scrollTop;
			}

			this.height = this.element.clientHeight;

			this.vDomWindowBuffer = this.table.options.virtualDomBuffer || this.height;

			//check if the table has changed size when dealing with variable height tables

			if (!this.fixedHeight && initialHeight != this.element.clientHeight) {

				modExists = this.table.modExists("resizeTable");

				if (modExists && !this.table.modules.resizeTable.autoResize || !modExists) {

					this.redraw();
				}
			}
		}
	};

	//renitialize all rows

	RowManager.prototype.reinitialize = function () {

		this.rows.forEach(function (row) {

			row.reinitialize();
		});
	};

	//prevent table from being redrawn

	RowManager.prototype.blockRedraw = function () {

		this.redrawBlock = true;

		this.redrawBlockRestoreConfig = false;
	};

	//restore table redrawing

	RowManager.prototype.restoreRedraw = function () {

		this.redrawBlock = false;

		if (this.redrawBlockRestoreConfig) {

			this.refreshActiveData(this.redrawBlockRestoreConfig.stage, this.redrawBlockRestoreConfig.skipStage, this.redrawBlockRestoreConfig.renderInPosition);

			this.redrawBlockRestoreConfig = false;
		} else {

			if (this.redrawBlockRederInPosition) {

				this.reRenderInPosition();
			}
		}

		this.redrawBlockRederInPosition = false;
	};

	//redraw table

	RowManager.prototype.redraw = function (force) {

		var left = this.scrollLeft;

		this.adjustTableSize();

		this.table.tableWidth = this.table.element.clientWidth;

		if (!force) {

			if (this.renderMode == "classic") {

				if (this.table.options.groupBy) {

					this.refreshActiveData("group", false, false);
				} else {

					this._simpleRender();
				}
			} else {

				this.reRenderInPosition();

				this.scrollHorizontal(left);
			}

			if (!this.displayRowsCount) {

				if (this.table.options.placeholder) {

					this.getElement().appendChild(this.table.options.placeholder);
				}
			}
		} else {

			this.renderTable();
		}
	};

	RowManager.prototype.resetScroll = function () {

		this.element.scrollLeft = 0;

		this.element.scrollTop = 0;

		if (this.table.browser === "ie") {

			var event = document.createEvent("Event");

			event.initEvent("scroll", false, true);

			this.element.dispatchEvent(event);
		} else {

			this.element.dispatchEvent(new Event('scroll'));
		}
	};

	//public row object

	var RowComponent = function RowComponent(row) {

		this._row = row;
	};

	RowComponent.prototype.getData = function (transform) {

		return this._row.getData(transform);
	};

	RowComponent.prototype.getElement = function () {

		return this._row.getElement();
	};

	RowComponent.prototype.getCells = function () {

		var cells = [];

		this._row.getCells().forEach(function (cell) {

			cells.push(cell.getComponent());
		});

		return cells;
	};

	RowComponent.prototype.getCell = function (column) {

		var cell = this._row.getCell(column);

		return cell ? cell.getComponent() : false;
	};

	RowComponent.prototype.getIndex = function () {

		return this._row.getData("data")[this._row.table.options.index];
	};

	RowComponent.prototype.getPosition = function (active) {

		return this._row.table.rowManager.getRowPosition(this._row, active);
	};

	RowComponent.prototype.delete = function () {

		return this._row.delete();
	};

	RowComponent.prototype.scrollTo = function () {

		return this._row.table.rowManager.scrollToRow(this._row);
	};

	RowComponent.prototype.pageTo = function () {

		if (this._row.table.modExists("page", true)) {

			return this._row.table.modules.page.setPageToRow(this._row);
		}
	};

	RowComponent.prototype.move = function (to, after) {

		this._row.moveToRow(to, after);
	};

	RowComponent.prototype.update = function (data) {

		return this._row.updateData(data);
	};

	RowComponent.prototype.normalizeHeight = function () {

		this._row.normalizeHeight(true);
	};

	RowComponent.prototype.select = function () {

		this._row.table.modules.selectRow.selectRows(this._row);
	};

	RowComponent.prototype.deselect = function () {

		this._row.table.modules.selectRow.deselectRows(this._row);
	};

	RowComponent.prototype.toggleSelect = function () {

		this._row.table.modules.selectRow.toggleRow(this._row);
	};

	RowComponent.prototype.isSelected = function () {

		return this._row.table.modules.selectRow.isRowSelected(this._row);
	};

	RowComponent.prototype._getSelf = function () {

		return this._row;
	};

	RowComponent.prototype.validate = function () {

		return this._row.validate();
	};

	RowComponent.prototype.freeze = function () {

		if (this._row.table.modExists("frozenRows", true)) {

			this._row.table.modules.frozenRows.freezeRow(this._row);
		}
	};

	RowComponent.prototype.unfreeze = function () {

		if (this._row.table.modExists("frozenRows", true)) {

			this._row.table.modules.frozenRows.unfreezeRow(this._row);
		}
	};

	RowComponent.prototype.isFrozen = function () {

		if (this._row.table.modExists("frozenRows", true)) {

			var index = this._row.table.modules.frozenRows.rows.indexOf(this._row);

			return index > -1;
		}

		return false;
	};

	RowComponent.prototype.treeCollapse = function () {

		if (this._row.table.modExists("dataTree", true)) {

			this._row.table.modules.dataTree.collapseRow(this._row);
		}
	};

	RowComponent.prototype.treeExpand = function () {

		if (this._row.table.modExists("dataTree", true)) {

			this._row.table.modules.dataTree.expandRow(this._row);
		}
	};

	RowComponent.prototype.treeToggle = function () {

		if (this._row.table.modExists("dataTree", true)) {

			this._row.table.modules.dataTree.toggleRow(this._row);
		}
	};

	RowComponent.prototype.getTreeParent = function () {

		if (this._row.table.modExists("dataTree", true)) {

			return this._row.table.modules.dataTree.getTreeParent(this._row);
		}

		return false;
	};

	RowComponent.prototype.getTreeChildren = function () {

		if (this._row.table.modExists("dataTree", true)) {

			return this._row.table.modules.dataTree.getTreeChildren(this._row);
		}

		return false;
	};

	RowComponent.prototype.addTreeChild = function (data, pos, index) {

		if (this._row.table.modExists("dataTree", true)) {

			return this._row.table.modules.dataTree.addTreeChildRow(this._row, data, pos, index);
		}

		return false;
	};

	RowComponent.prototype.reformat = function () {

		return this._row.reinitialize();
	};

	RowComponent.prototype.getGroup = function () {

		return this._row.getGroup().getComponent();
	};

	RowComponent.prototype.getTable = function () {

		return this._row.table;
	};

	RowComponent.prototype.getNextRow = function () {

		var row = this._row.nextRow();

		return row ? row.getComponent() : row;
	};

	RowComponent.prototype.getPrevRow = function () {

		var row = this._row.prevRow();

		return row ? row.getComponent() : row;
	};

	var Row = function Row(data, parent) {
		var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "row";


		this.table = parent.table;

		this.parent = parent;

		this.data = {};

		this.type = type; //type of element

		this.element = this.createElement();

		this.modules = {}; //hold module variables;

		this.cells = [];

		this.height = 0; //hold element height

		this.heightStyled = ""; //hold element height prestyled to improve render efficiency

		this.manualHeight = false; //user has manually set row height

		this.outerHeight = 0; //holde lements outer height

		this.initialized = false; //element has been rendered

		this.heightInitialized = false; //element has resized cells to fit


		this.component = null;

		this.setData(data);

		this.generateElement();
	};

	Row.prototype.createElement = function () {

		var el = document.createElement("div");

		el.classList.add("tabulator-row");

		el.setAttribute("role", "row");

		return el;
	};

	Row.prototype.getElement = function () {

		return this.element;
	};

	Row.prototype.detachElement = function () {

		if (this.element && this.element.parentNode) {

			this.element.parentNode.removeChild(this.element);
		}
	};

	Row.prototype.generateElement = function () {

		var self = this,
		    dblTap,
		    tapHold,
		    tap;

		//set row selection characteristics

		if (self.table.options.selectable !== false && self.table.modExists("selectRow")) {

			self.table.modules.selectRow.initializeRow(this);
		}

		//setup movable rows

		if (self.table.options.movableRows !== false && self.table.modExists("moveRow")) {

			self.table.modules.moveRow.initializeRow(this);
		}

		//setup data tree

		if (self.table.options.dataTree !== false && self.table.modExists("dataTree")) {

			self.table.modules.dataTree.initializeRow(this);
		}

		//setup column colapse container

		if (self.table.options.responsiveLayout === "collapse" && self.table.modExists("responsiveLayout")) {

			self.table.modules.responsiveLayout.initializeRow(this);
		}

		//set column menu

		if (self.table.options.rowContextMenu && this.table.modExists("menu")) {

			self.table.modules.menu.initializeRow(this);
		}

		//handle row click events

		if (self.table.options.rowClick) {

			self.element.addEventListener("click", function (e) {

				self.table.options.rowClick(e, self.getComponent());
			});
		}

		if (self.table.options.rowDblClick) {

			self.element.addEventListener("dblclick", function (e) {

				self.table.options.rowDblClick(e, self.getComponent());
			});
		}

		if (self.table.options.rowContext) {

			self.element.addEventListener("contextmenu", function (e) {

				self.table.options.rowContext(e, self.getComponent());
			});
		}

		//handle mouse events

		if (self.table.options.rowMouseEnter) {

			self.element.addEventListener("mouseenter", function (e) {

				self.table.options.rowMouseEnter(e, self.getComponent());
			});
		}

		if (self.table.options.rowMouseLeave) {

			self.element.addEventListener("mouseleave", function (e) {

				self.table.options.rowMouseLeave(e, self.getComponent());
			});
		}

		if (self.table.options.rowMouseOver) {

			self.element.addEventListener("mouseover", function (e) {

				self.table.options.rowMouseOver(e, self.getComponent());
			});
		}

		if (self.table.options.rowMouseOut) {

			self.element.addEventListener("mouseout", function (e) {

				self.table.options.rowMouseOut(e, self.getComponent());
			});
		}

		if (self.table.options.rowMouseMove) {

			self.element.addEventListener("mousemove", function (e) {

				self.table.options.rowMouseMove(e, self.getComponent());
			});
		}

		if (self.table.options.rowTap) {

			tap = false;

			self.element.addEventListener("touchstart", function (e) {

				tap = true;
			}, { passive: true });

			self.element.addEventListener("touchend", function (e) {

				if (tap) {

					self.table.options.rowTap(e, self.getComponent());
				}

				tap = false;
			});
		}

		if (self.table.options.rowDblTap) {

			dblTap = null;

			self.element.addEventListener("touchend", function (e) {

				if (dblTap) {

					clearTimeout(dblTap);

					dblTap = null;

					self.table.options.rowDblTap(e, self.getComponent());
				} else {

					dblTap = setTimeout(function () {

						clearTimeout(dblTap);

						dblTap = null;
					}, 300);
				}
			});
		}

		if (self.table.options.rowTapHold) {

			tapHold = null;

			self.element.addEventListener("touchstart", function (e) {

				clearTimeout(tapHold);

				tapHold = setTimeout(function () {

					clearTimeout(tapHold);

					tapHold = null;

					tap = false;

					self.table.options.rowTapHold(e, self.getComponent());
				}, 1000);
			}, { passive: true });

			self.element.addEventListener("touchend", function (e) {

				clearTimeout(tapHold);

				tapHold = null;
			});
		}
	};

	Row.prototype.generateCells = function () {

		this.cells = this.table.columnManager.generateCells(this);
	};

	//functions to setup on first render

	Row.prototype.initialize = function (force) {

		var self = this;

		if (!self.initialized || force) {

			self.deleteCells();

			while (self.element.firstChild) {
				self.element.removeChild(self.element.firstChild);
			} //handle frozen cells

			if (this.table.modExists("frozenColumns")) {

				this.table.modules.frozenColumns.layoutRow(this);
			}

			this.generateCells();

			self.cells.forEach(function (cell) {

				self.element.appendChild(cell.getElement());

				cell.cellRendered();
			});

			if (force) {

				self.normalizeHeight();
			}

			//setup movable rows

			if (self.table.options.dataTree && self.table.modExists("dataTree")) {

				self.table.modules.dataTree.layoutRow(this);
			}

			//setup column colapse container

			if (self.table.options.responsiveLayout === "collapse" && self.table.modExists("responsiveLayout")) {

				self.table.modules.responsiveLayout.layoutRow(this);
			}

			if (self.table.options.rowFormatter) {

				self.table.options.rowFormatter(self.getComponent());
			}

			//set resizable handles

			if (self.table.options.resizableRows && self.table.modExists("resizeRows")) {

				self.table.modules.resizeRows.initializeRow(self);
			}

			self.initialized = true;
		}
	};

	Row.prototype.reinitializeHeight = function () {

		this.heightInitialized = false;

		if (this.element.offsetParent !== null) {

			this.normalizeHeight(true);
		}
	};

	Row.prototype.reinitialize = function () {

		this.initialized = false;

		this.heightInitialized = false;

		if (!this.manualHeight) {

			this.height = 0;

			this.heightStyled = "";
		}

		if (this.element.offsetParent !== null) {

			this.initialize(true);
		}
	};

	//get heights when doing bulk row style calcs in virtual DOM

	Row.prototype.calcHeight = function (force) {

		var maxHeight = 0,
		    minHeight = this.table.options.resizableRows ? this.element.clientHeight : 0;

		this.cells.forEach(function (cell) {

			var height = cell.getHeight();

			if (height > maxHeight) {

				maxHeight = height;
			}
		});

		if (force) {

			this.height = Math.max(maxHeight, minHeight);
		} else {

			this.height = this.manualHeight ? this.height : Math.max(maxHeight, minHeight);
		}

		this.heightStyled = this.height ? this.height + "px" : "";

		this.outerHeight = this.element.offsetHeight;
	};

	//set of cells

	Row.prototype.setCellHeight = function () {

		this.cells.forEach(function (cell) {

			cell.setHeight();
		});

		this.heightInitialized = true;
	};

	Row.prototype.clearCellHeight = function () {

		this.cells.forEach(function (cell) {

			cell.clearHeight();
		});
	};

	//normalize the height of elements in the row

	Row.prototype.normalizeHeight = function (force) {

		if (force) {

			this.clearCellHeight();
		}

		this.calcHeight(force);

		this.setCellHeight();
	};

	// Row.prototype.setHeight = function(height){

	// 	this.height = height;


	// 	this.setCellHeight();

	// };


	//set height of rows

	Row.prototype.setHeight = function (height, force) {

		if (this.height != height || force) {

			this.manualHeight = true;

			this.height = height;

			this.heightStyled = height ? height + "px" : "";

			this.setCellHeight();

			// this.outerHeight = this.element.outerHeight();

			this.outerHeight = this.element.offsetHeight;
		}
	};

	//return rows outer height

	Row.prototype.getHeight = function () {

		return this.outerHeight;
	};

	//return rows outer Width

	Row.prototype.getWidth = function () {

		return this.element.offsetWidth;
	};

	//////////////// Cell Management /////////////////


	Row.prototype.deleteCell = function (cell) {

		var index = this.cells.indexOf(cell);

		if (index > -1) {

			this.cells.splice(index, 1);
		}
	};

	//////////////// Data Management /////////////////


	Row.prototype.setData = function (data) {

		if (this.table.modExists("mutator")) {

			data = this.table.modules.mutator.transformRow(data, "data");
		}

		this.data = data;

		if (this.table.options.reactiveData && this.table.modExists("reactiveData", true)) {

			this.table.modules.reactiveData.watchRow(this);
		}
	};

	//update the rows data

	Row.prototype.updateData = function (updatedData) {
		var _this15 = this;

		var visible = Tabulator.prototype.helpers.elVisible(this.element),
		    tempData = {},
		    newRowData;

		return new Promise(function (resolve, reject) {

			if (typeof updatedData === "string") {

				updatedData = JSON.parse(updatedData);
			}

			if (_this15.table.options.reactiveData && _this15.table.modExists("reactiveData", true)) {

				_this15.table.modules.reactiveData.block();
			}

			//mutate incomming data if needed

			if (_this15.table.modExists("mutator")) {

				tempData = Object.assign(tempData, _this15.data);

				tempData = Object.assign(tempData, updatedData);

				newRowData = _this15.table.modules.mutator.transformRow(tempData, "data", updatedData);
			} else {

				newRowData = updatedData;
			}

			//set data

			for (var attrname in newRowData) {

				_this15.data[attrname] = newRowData[attrname];
			}

			if (_this15.table.options.reactiveData && _this15.table.modExists("reactiveData", true)) {

				_this15.table.modules.reactiveData.unblock();
			}

			//update affected cells only

			for (var attrname in updatedData) {

				var columns = _this15.table.columnManager.getColumnsByFieldRoot(attrname);

				columns.forEach(function (column) {

					var cell = _this15.getCell(column.getField());

					if (cell) {

						var value = column.getFieldValue(newRowData);

						if (cell.getValue() != value) {

							cell.setValueProcessData(value);

							if (visible) {

								cell.cellRendered();
							}
						}
					}
				});
			}

			//Partial reinitialization if visible

			if (visible) {

				_this15.normalizeHeight(true);

				if (_this15.table.options.rowFormatter) {

					_this15.table.options.rowFormatter(_this15.getComponent());
				}
			} else {

				_this15.initialized = false;

				_this15.height = 0;

				_this15.heightStyled = "";
			}

			if (_this15.table.options.dataTree !== false && _this15.table.modExists("dataTree") && _this15.table.modules.dataTree.redrawNeeded(updatedData)) {

				_this15.table.modules.dataTree.initializeRow(_this15);

				_this15.table.modules.dataTree.layoutRow(_this15);

				_this15.table.rowManager.refreshActiveData("tree", false, true);
			}

			//this.reinitialize();


			_this15.table.options.rowUpdated.call(_this15.table, _this15.getComponent());

			resolve();
		});
	};

	Row.prototype.getData = function (transform) {

		var self = this;

		if (transform) {

			if (self.table.modExists("accessor")) {

				return self.table.modules.accessor.transformRow(self.data, transform);
			}
		} else {

			return this.data;
		}
	};

	Row.prototype.getCell = function (column) {

		var match = false;

		column = this.table.columnManager.findColumn(column);

		match = this.cells.find(function (cell) {

			return cell.column === column;
		});

		return match;
	};

	Row.prototype.getCellIndex = function (findCell) {

		return this.cells.findIndex(function (cell) {

			return cell === findCell;
		});
	};

	Row.prototype.findNextEditableCell = function (index) {

		var nextCell = false;

		if (index < this.cells.length - 1) {

			for (var i = index + 1; i < this.cells.length; i++) {

				var cell = this.cells[i];

				if (cell.column.modules.edit && Tabulator.prototype.helpers.elVisible(cell.getElement())) {

					var allowEdit = true;

					if (typeof cell.column.modules.edit.check == "function") {

						allowEdit = cell.column.modules.edit.check(cell.getComponent());
					}

					if (allowEdit) {

						nextCell = cell;

						break;
					}
				}
			}
		}

		return nextCell;
	};

	Row.prototype.findPrevEditableCell = function (index) {

		var prevCell = false;

		if (index > 0) {

			for (var i = index - 1; i >= 0; i--) {

				var cell = this.cells[i],
				    allowEdit = true;

				if (cell.column.modules.edit && Tabulator.prototype.helpers.elVisible(cell.getElement())) {

					if (typeof cell.column.modules.edit.check == "function") {

						allowEdit = cell.column.modules.edit.check(cell.getComponent());
					}

					if (allowEdit) {

						prevCell = cell;

						break;
					}
				}
			}
		}

		return prevCell;
	};

	Row.prototype.getCells = function () {

		return this.cells;
	};

	Row.prototype.nextRow = function () {

		var row = this.table.rowManager.nextDisplayRow(this, true);

		return row || false;
	};

	Row.prototype.prevRow = function () {

		var row = this.table.rowManager.prevDisplayRow(this, true);

		return row || false;
	};

	Row.prototype.moveToRow = function (to, before) {

		var toRow = this.table.rowManager.findRow(to);

		if (toRow) {

			this.table.rowManager.moveRowActual(this, toRow, !before);

			this.table.rowManager.refreshActiveData("display", false, true);
		} else {

			console.warn("Move Error - No matching row found:", to);
		}
	};

	Row.prototype.validate = function () {

		var invalid = [];

		this.cells.forEach(function (cell) {

			if (!cell.validate()) {

				invalid.push(cell.getComponent());
			}
		});

		return invalid.length ? invalid : true;
	};

	///////////////////// Actions  /////////////////////


	Row.prototype.delete = function () {
		var _this16 = this;

		return new Promise(function (resolve, reject) {

			var index, rows;

			if (_this16.table.options.history && _this16.table.modExists("history")) {

				if (_this16.table.options.groupBy && _this16.table.modExists("groupRows")) {

					rows = _this16.getGroup().rows;

					index = rows.indexOf(_this16);

					if (index) {

						index = rows[index - 1];
					}
				} else {

					index = _this16.table.rowManager.getRowIndex(_this16);

					if (index) {

						index = _this16.table.rowManager.rows[index - 1];
					}
				}

				_this16.table.modules.history.action("rowDelete", _this16, { data: _this16.getData(), pos: !index, index: index });
			}

			_this16.deleteActual();

			resolve();
		});
	};

	Row.prototype.deleteActual = function (blockRedraw) {

		var index = this.table.rowManager.getRowIndex(this);

		this.detatchModules();

		// if(this.table.options.dataTree && this.table.modExists("dataTree")){

		// 	this.table.modules.dataTree.collapseRow(this, true);

		// }


		//remove any reactive data watchers from row object

		if (this.table.options.reactiveData && this.table.modExists("reactiveData", true)) ;

		// this.table.modules.reactiveData.unwatchRow(this);

		//remove from group

		if (this.modules.group) {

			this.modules.group.removeRow(this);
		}

		this.table.rowManager.deleteRow(this, blockRedraw);

		this.deleteCells();

		this.initialized = false;

		this.heightInitialized = false;

		if (this.table.options.dataTree && this.table.modExists("dataTree", true)) {

			this.table.modules.dataTree.rowDelete(this);
		}

		//recalc column calculations if present

		if (this.table.modExists("columnCalcs")) {

			if (this.table.options.groupBy && this.table.modExists("groupRows")) {

				this.table.modules.columnCalcs.recalcRowGroup(this);
			} else {

				this.table.modules.columnCalcs.recalc(this.table.rowManager.activeRows);
			}
		}
	};

	Row.prototype.detatchModules = function () {

		//deselect row if it is selected

		if (this.table.modExists("selectRow")) {

			this.table.modules.selectRow._deselectRow(this, true);
		}

		//cancel edit if row is currently being edited

		if (this.table.modExists("edit")) {

			if (this.table.modules.edit.currentCell.row === this) {

				this.table.modules.edit.cancelEdit();
			}
		}

		if (this.table.modExists("frozenRows")) {

			this.table.modules.frozenRows.detachRow(this);
		}
	};

	Row.prototype.deleteCells = function () {

		var cellCount = this.cells.length;

		for (var _i5 = 0; _i5 < cellCount; _i5++) {

			this.cells[0].delete();
		}
	};

	Row.prototype.wipe = function () {

		this.detatchModules();

		this.deleteCells();

		while (this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}this.element = false;

		this.modules = {};

		if (this.element.parentNode) {

			this.element.parentNode.removeChild(this.element);
		}
	};

	Row.prototype.getGroup = function () {

		return this.modules.group || false;
	};

	//////////////// Object Generation /////////////////

	Row.prototype.getComponent = function () {

		if (!this.component) {

			this.component = new RowComponent(this);
		}

		return this.component;
	};

	//public row object

	var CellComponent = function CellComponent(cell) {

		this._cell = cell;
	};

	CellComponent.prototype.getValue = function () {

		return this._cell.getValue();
	};

	CellComponent.prototype.getOldValue = function () {

		return this._cell.getOldValue();
	};

	CellComponent.prototype.getElement = function () {

		return this._cell.getElement();
	};

	CellComponent.prototype.getRow = function () {

		return this._cell.row.getComponent();
	};

	CellComponent.prototype.getData = function () {

		return this._cell.row.getData();
	};

	CellComponent.prototype.getField = function () {

		return this._cell.column.getField();
	};

	CellComponent.prototype.getColumn = function () {

		return this._cell.column.getComponent();
	};

	CellComponent.prototype.setValue = function (value, mutate) {

		if (typeof mutate == "undefined") {

			mutate = true;
		}

		this._cell.setValue(value, mutate);
	};

	CellComponent.prototype.restoreOldValue = function () {

		this._cell.setValueActual(this._cell.getOldValue());
	};

	CellComponent.prototype.edit = function (force) {

		return this._cell.edit(force);
	};

	CellComponent.prototype.cancelEdit = function () {

		this._cell.cancelEdit();
	};

	CellComponent.prototype.isEdited = function () {

		return !!this._cell.modules.edit && this._cell.modules.edit.edited;
	};

	CellComponent.prototype.clearEdited = function () {

		if (self.table.modExists("edit", true)) {

			this._cell.table.modules.edit.clearEdited(this._cell);
		}
	};

	CellComponent.prototype.isValid = function () {

		return this._cell.modules.validate ? !this._cell.modules.validate.invalid : true;
	};

	CellComponent.prototype.validate = function () {

		return this._cell.validate();
	};

	CellComponent.prototype.clearValidation = function () {

		if (self.table.modExists("validate", true)) {

			this._cell.table.modules.validate.clearValidation(this._cell);
		}
	};

	CellComponent.prototype.nav = function () {

		return this._cell.nav();
	};

	CellComponent.prototype.checkHeight = function () {

		this._cell.checkHeight();
	};

	CellComponent.prototype.getTable = function () {

		return this._cell.table;
	};

	CellComponent.prototype._getSelf = function () {

		return this._cell;
	};

	var Cell = function Cell(column, row) {

		this.table = column.table;

		this.column = column;

		this.row = row;

		this.element = null;

		this.value = null;

		this.oldValue = null;

		this.modules = {};

		this.height = null;

		this.width = null;

		this.minWidth = null;

		this.component = null;

		this.build();
	};

	//////////////// Setup Functions /////////////////


	//generate element

	Cell.prototype.build = function () {

		this.generateElement();

		this.setWidth();

		this._configureCell();

		this.setValueActual(this.column.getFieldValue(this.row.data));
	};

	Cell.prototype.generateElement = function () {

		this.element = document.createElement('div');

		this.element.className = "tabulator-cell";

		this.element.setAttribute("role", "gridcell");

		this.element = this.element;
	};

	Cell.prototype._configureCell = function () {

		var self = this,
		    cellEvents = self.column.cellEvents,
		    element = self.element,
		    field = this.column.getField(),
		    vertAligns = {

			top: "flex-start",

			bottom: "flex-end",

			middle: "center"

		},
		    hozAligns = {

			left: "flex-start",

			right: "flex-end",

			center: "center"

		};

		//set text alignment

		element.style.textAlign = self.column.hozAlign;

		if (self.column.vertAlign) {

			element.style.display = "inline-flex";

			element.style.alignItems = vertAligns[self.column.vertAlign] || "";

			if (self.column.hozAlign) {

				element.style.justifyContent = hozAligns[self.column.hozAlign] || "";
			}
		}

		if (field) {

			element.setAttribute("tabulator-field", field);
		}

		//add class to cell if needed

		if (self.column.definition.cssClass) {

			var classNames = self.column.definition.cssClass.split(" ");

			classNames.forEach(function (className) {

				element.classList.add(className);
			});
		}

		//update tooltip on mouse enter

		if (this.table.options.tooltipGenerationMode === "hover") {

			element.addEventListener("mouseenter", function (e) {

				self._generateTooltip();
			});
		}

		self._bindClickEvents(cellEvents);

		self._bindTouchEvents(cellEvents);

		self._bindMouseEvents(cellEvents);

		if (self.column.modules.edit) {

			self.table.modules.edit.bindEditor(self);
		}

		if (self.column.definition.rowHandle && self.table.options.movableRows !== false && self.table.modExists("moveRow")) {

			self.table.modules.moveRow.initializeCell(self);
		}

		//hide cell if not visible

		if (!self.column.visible) {

			self.hide();
		}
	};

	Cell.prototype._bindClickEvents = function (cellEvents) {

		var self = this,
		    element = self.element;

		//set event bindings

		if (cellEvents.cellClick || self.table.options.cellClick) {

			element.addEventListener("click", function (e) {

				var component = self.getComponent();

				if (cellEvents.cellClick) {

					cellEvents.cellClick.call(self.table, e, component);
				}

				if (self.table.options.cellClick) {

					self.table.options.cellClick.call(self.table, e, component);
				}
			});
		}

		if (cellEvents.cellDblClick || this.table.options.cellDblClick) {

			element.addEventListener("dblclick", function (e) {

				var component = self.getComponent();

				if (cellEvents.cellDblClick) {

					cellEvents.cellDblClick.call(self.table, e, component);
				}

				if (self.table.options.cellDblClick) {

					self.table.options.cellDblClick.call(self.table, e, component);
				}
			});
		} else {

			element.addEventListener("dblclick", function (e) {

				if (self.table.modExists("edit")) {

					if (self.table.modules.edit.currentCell === self) {

						return; //prevent instant selection of editor content
					}
				}

				e.preventDefault();

				try {

					if (document.selection) {
						// IE

						var range = document.body.createTextRange();

						range.moveToElementText(self.element);

						range.select();
					} else if (window.getSelection) {

						var range = document.createRange();

						range.selectNode(self.element);

						window.getSelection().removeAllRanges();

						window.getSelection().addRange(range);
					}
				} catch (e) {}
			});
		}

		if (cellEvents.cellContext || this.table.options.cellContext) {

			element.addEventListener("contextmenu", function (e) {

				var component = self.getComponent();

				if (cellEvents.cellContext) {

					cellEvents.cellContext.call(self.table, e, component);
				}

				if (self.table.options.cellContext) {

					self.table.options.cellContext.call(self.table, e, component);
				}
			});
		}
	};

	Cell.prototype._bindMouseEvents = function (cellEvents) {

		var self = this,
		    element = self.element;

		if (cellEvents.cellMouseEnter || self.table.options.cellMouseEnter) {

			element.addEventListener("mouseenter", function (e) {

				var component = self.getComponent();

				if (cellEvents.cellMouseEnter) {

					cellEvents.cellMouseEnter.call(self.table, e, component);
				}

				if (self.table.options.cellMouseEnter) {

					self.table.options.cellMouseEnter.call(self.table, e, component);
				}
			});
		}

		if (cellEvents.cellMouseLeave || self.table.options.cellMouseLeave) {

			element.addEventListener("mouseleave", function (e) {

				var component = self.getComponent();

				if (cellEvents.cellMouseLeave) {

					cellEvents.cellMouseLeave.call(self.table, e, component);
				}

				if (self.table.options.cellMouseLeave) {

					self.table.options.cellMouseLeave.call(self.table, e, component);
				}
			});
		}

		if (cellEvents.cellMouseOver || self.table.options.cellMouseOver) {

			element.addEventListener("mouseover", function (e) {

				var component = self.getComponent();

				if (cellEvents.cellMouseOver) {

					cellEvents.cellMouseOver.call(self.table, e, component);
				}

				if (self.table.options.cellMouseOver) {

					self.table.options.cellMouseOver.call(self.table, e, component);
				}
			});
		}

		if (cellEvents.cellMouseOut || self.table.options.cellMouseOut) {

			element.addEventListener("mouseout", function (e) {

				var component = self.getComponent();

				if (cellEvents.cellMouseOut) {

					cellEvents.cellMouseOut.call(self.table, e, component);
				}

				if (self.table.options.cellMouseOut) {

					self.table.options.cellMouseOut.call(self.table, e, component);
				}
			});
		}

		if (cellEvents.cellMouseMove || self.table.options.cellMouseMove) {

			element.addEventListener("mousemove", function (e) {

				var component = self.getComponent();

				if (cellEvents.cellMouseMove) {

					cellEvents.cellMouseMove.call(self.table, e, component);
				}

				if (self.table.options.cellMouseMove) {

					self.table.options.cellMouseMove.call(self.table, e, component);
				}
			});
		}
	};

	Cell.prototype._bindTouchEvents = function (cellEvents) {

		var self = this,
		    element = self.element,
		    dblTap,
		    tapHold,
		    tap;

		if (cellEvents.cellTap || this.table.options.cellTap) {

			tap = false;

			element.addEventListener("touchstart", function (e) {

				tap = true;
			}, { passive: true });

			element.addEventListener("touchend", function (e) {

				if (tap) {

					var component = self.getComponent();

					if (cellEvents.cellTap) {

						cellEvents.cellTap.call(self.table, e, component);
					}

					if (self.table.options.cellTap) {

						self.table.options.cellTap.call(self.table, e, component);
					}
				}

				tap = false;
			});
		}

		if (cellEvents.cellDblTap || this.table.options.cellDblTap) {

			dblTap = null;

			element.addEventListener("touchend", function (e) {

				if (dblTap) {

					clearTimeout(dblTap);

					dblTap = null;

					var component = self.getComponent();

					if (cellEvents.cellDblTap) {

						cellEvents.cellDblTap.call(self.table, e, component);
					}

					if (self.table.options.cellDblTap) {

						self.table.options.cellDblTap.call(self.table, e, component);
					}
				} else {

					dblTap = setTimeout(function () {

						clearTimeout(dblTap);

						dblTap = null;
					}, 300);
				}
			});
		}

		if (cellEvents.cellTapHold || this.table.options.cellTapHold) {

			tapHold = null;

			element.addEventListener("touchstart", function (e) {

				clearTimeout(tapHold);

				tapHold = setTimeout(function () {

					clearTimeout(tapHold);

					tapHold = null;

					tap = false;

					var component = self.getComponent();

					if (cellEvents.cellTapHold) {

						cellEvents.cellTapHold.call(self.table, e, component);
					}

					if (self.table.options.cellTapHold) {

						self.table.options.cellTapHold.call(self.table, e, component);
					}
				}, 1000);
			}, { passive: true });

			element.addEventListener("touchend", function (e) {

				clearTimeout(tapHold);

				tapHold = null;
			});
		}
	};

	//generate cell contents

	Cell.prototype._generateContents = function () {

		var val;

		if (this.table.modExists("format")) {

			val = this.table.modules.format.formatValue(this);
		} else {

			val = this.element.innerHTML = this.value;
		}

		switch (typeof val === 'undefined' ? 'undefined' : _typeof(val)) {

			case "object":

				if (val instanceof Node) {

					//clear previous cell contents

					while (this.element.firstChild) {
						this.element.removeChild(this.element.firstChild);
					}this.element.appendChild(val);
				} else {

					this.element.innerHTML = "";

					if (val != null) {

						console.warn("Format Error - Formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", val);
					}
				}

				break;

			case "undefined":

			case "null":

				this.element.innerHTML = "";

				break;

			default:

				this.element.innerHTML = val;

		}
	};

	Cell.prototype.cellRendered = function () {

		if (this.table.modExists("format") && this.table.modules.format.cellRendered) {

			this.table.modules.format.cellRendered(this);
		}
	};

	//generate tooltip text

	Cell.prototype._generateTooltip = function () {

		var tooltip = this.column.tooltip;

		if (tooltip) {

			if (tooltip === true) {

				tooltip = this.value;
			} else if (typeof tooltip == "function") {

				tooltip = tooltip(this.getComponent());

				if (tooltip === false) {

					tooltip = "";
				}
			}

			if (typeof tooltip === "undefined") {

				tooltip = "";
			}

			this.element.setAttribute("title", tooltip);
		} else {

			this.element.setAttribute("title", "");
		}
	};

	//////////////////// Getters ////////////////////

	Cell.prototype.getElement = function () {

		return this.element;
	};

	Cell.prototype.getValue = function () {

		return this.value;
	};

	Cell.prototype.getOldValue = function () {

		return this.oldValue;
	};

	//////////////////// Actions ////////////////////


	Cell.prototype.setValue = function (value, mutate) {

		var changed = this.setValueProcessData(value, mutate),
		    component;

		if (changed) {

			if (this.table.options.history && this.table.modExists("history")) {

				this.table.modules.history.action("cellEdit", this, { oldValue: this.oldValue, newValue: this.value });
			}

			component = this.getComponent();

			if (this.column.cellEvents.cellEdited) {

				this.column.cellEvents.cellEdited.call(this.table, component);
			}

			this.cellRendered();

			this.table.options.cellEdited.call(this.table, component);

			this.table.options.dataEdited.call(this.table, this.table.rowManager.getData());
		}
	};

	Cell.prototype.setValueProcessData = function (value, mutate) {

		var changed = false;

		if (this.value != value) {

			changed = true;

			if (mutate) {

				if (this.column.modules.mutate) {

					value = this.table.modules.mutator.transformCell(this, value);
				}
			}
		}

		this.setValueActual(value);

		if (changed && this.table.modExists("columnCalcs")) {

			if (this.column.definition.topCalc || this.column.definition.bottomCalc) {

				if (this.table.options.groupBy && this.table.modExists("groupRows")) {

					if (this.table.options.columnCalcs == "table" || this.table.options.columnCalcs == "both") {

						this.table.modules.columnCalcs.recalc(this.table.rowManager.activeRows);
					}

					if (this.table.options.columnCalcs != "table") {

						this.table.modules.columnCalcs.recalcRowGroup(this.row);
					}
				} else {

					this.table.modules.columnCalcs.recalc(this.table.rowManager.activeRows);
				}
			}
		}

		return changed;
	};

	Cell.prototype.setValueActual = function (value) {

		this.oldValue = this.value;

		this.value = value;

		if (this.table.options.reactiveData && this.table.modExists("reactiveData")) {

			this.table.modules.reactiveData.block();
		}

		this.column.setFieldValue(this.row.data, value);

		if (this.table.options.reactiveData && this.table.modExists("reactiveData")) {

			this.table.modules.reactiveData.unblock();
		}

		this._generateContents();

		this._generateTooltip();

		//set resizable handles

		if (this.table.options.resizableColumns && this.table.modExists("resizeColumns")) {

			this.table.modules.resizeColumns.initializeColumn("cell", this.column, this.element);
		}

		//set column menu

		if (this.column.definition.contextMenu && this.table.modExists("menu")) {

			this.table.modules.menu.initializeCell(this);
		}

		//handle frozen cells

		if (this.table.modExists("frozenColumns")) {

			this.table.modules.frozenColumns.layoutElement(this.element, this.column);
		}
	};

	Cell.prototype.setWidth = function () {

		this.width = this.column.width;

		this.element.style.width = this.column.widthStyled;
	};

	Cell.prototype.clearWidth = function () {

		this.width = "";

		this.element.style.width = "";
	};

	Cell.prototype.getWidth = function () {

		return this.width || this.element.offsetWidth;
	};

	Cell.prototype.setMinWidth = function () {

		this.minWidth = this.column.minWidth;

		this.element.style.minWidth = this.column.minWidthStyled;
	};

	Cell.prototype.checkHeight = function () {

		// var height = this.element.css("height");

		this.row.reinitializeHeight();
	};

	Cell.prototype.clearHeight = function () {

		this.element.style.height = "";

		this.height = null;
	};

	Cell.prototype.setHeight = function () {

		this.height = this.row.height;

		this.element.style.height = this.row.heightStyled;
	};

	Cell.prototype.getHeight = function () {

		return this.height || this.element.offsetHeight;
	};

	Cell.prototype.show = function () {

		this.element.style.display = "";
	};

	Cell.prototype.hide = function () {

		this.element.style.display = "none";
	};

	Cell.prototype.edit = function (force) {

		if (this.table.modExists("edit", true)) {

			return this.table.modules.edit.editCell(this, force);
		}
	};

	Cell.prototype.cancelEdit = function () {

		if (this.table.modExists("edit", true)) {

			var editing = this.table.modules.edit.getCurrentCell();

			if (editing && editing._getSelf() === this) {

				this.table.modules.edit.cancelEdit();
			} else {

				console.warn("Cancel Editor Error - This cell is not currently being edited ");
			}
		}
	};

	Cell.prototype.validate = function () {

		if (this.column.modules.validate && this.table.modExists("validate", true)) {

			var valid = this.table.modules.validate.validate(this.column.modules.validate, this, this.getValue());

			return valid === true;
		} else {

			return true;
		}
	};

	Cell.prototype.delete = function () {

		if (!this.table.rowManager.redrawBlock && this.element.parentNode) {

			this.element.parentNode.removeChild(this.element);
		}

		if (this.modules.validate && this.modules.validate.invalid) {

			this.table.modules.validate.clearValidation(this);
		}

		if (this.modules.edit && this.modules.edit.edited) {

			this.table.modules.edit.clearEdited(this);
		}

		this.element = false;

		this.column.deleteCell(this);

		this.row.deleteCell(this);

		this.calcs = {};
	};

	//////////////// Navigation /////////////////


	Cell.prototype.nav = function () {

		var self = this,
		    nextCell = false,
		    index = this.row.getCellIndex(this);

		return {

			next: function next() {

				var nextCell = this.right(),
				    nextRow;

				if (!nextCell) {

					nextRow = self.table.rowManager.nextDisplayRow(self.row, true);

					if (nextRow) {

						nextCell = nextRow.findNextEditableCell(-1);

						if (nextCell) {

							nextCell.edit();

							return true;
						}
					}
				} else {

					return true;
				}

				return false;
			},

			prev: function prev() {

				var nextCell = this.left(),
				    prevRow;

				if (!nextCell) {

					prevRow = self.table.rowManager.prevDisplayRow(self.row, true);

					if (prevRow) {

						nextCell = prevRow.findPrevEditableCell(prevRow.cells.length);

						if (nextCell) {

							nextCell.edit();

							return true;
						}
					}
				} else {

					return true;
				}

				return false;
			},

			left: function left() {

				nextCell = self.row.findPrevEditableCell(index);

				if (nextCell) {

					nextCell.edit();

					return true;
				} else {

					return false;
				}
			},

			right: function right() {

				nextCell = self.row.findNextEditableCell(index);

				if (nextCell) {

					nextCell.edit();

					return true;
				} else {

					return false;
				}
			},

			up: function up() {

				var nextRow = self.table.rowManager.prevDisplayRow(self.row, true);

				if (nextRow) {

					nextRow.cells[index].edit();
				}
			},

			down: function down() {

				var nextRow = self.table.rowManager.nextDisplayRow(self.row, true);

				if (nextRow) {

					nextRow.cells[index].edit();
				}
			}

		};
	};

	Cell.prototype.getIndex = function () {

		this.row.getCellIndex(this);
	};

	//////////////// Object Generation /////////////////

	Cell.prototype.getComponent = function () {

		if (!this.component) {

			this.component = new CellComponent(this);
		}

		return this.component;
	};

	var FooterManager = function FooterManager(table) {

		this.table = table;

		this.active = false;

		this.element = this.createElement(); //containing element

		this.external = false;

		this.links = [];

		this._initialize();
	};

	FooterManager.prototype.createElement = function () {

		var el = document.createElement("div");

		el.classList.add("tabulator-footer");

		return el;
	};

	FooterManager.prototype._initialize = function (element) {

		if (this.table.options.footerElement) {

			switch (_typeof(this.table.options.footerElement)) {

				case "string":

					if (this.table.options.footerElement[0] === "<") {

						this.element.innerHTML = this.table.options.footerElement;
					} else {

						this.external = true;

						this.element = document.querySelector(this.table.options.footerElement);
					}

					break;

				default:

					this.element = this.table.options.footerElement;

					break;

			}
		}
	};

	FooterManager.prototype.getElement = function () {

		return this.element;
	};

	FooterManager.prototype.append = function (element, parent) {

		this.activate(parent);

		this.element.appendChild(element);

		this.table.rowManager.adjustTableSize();
	};

	FooterManager.prototype.prepend = function (element, parent) {

		this.activate(parent);

		this.element.insertBefore(element, this.element.firstChild);

		this.table.rowManager.adjustTableSize();
	};

	FooterManager.prototype.remove = function (element) {

		element.parentNode.removeChild(element);

		this.deactivate();
	};

	FooterManager.prototype.deactivate = function (force) {

		if (!this.element.firstChild || force) {

			if (!this.external) {

				this.element.parentNode.removeChild(this.element);
			}

			this.active = false;
		}

		// this.table.rowManager.adjustTableSize();
	};

	FooterManager.prototype.activate = function (parent) {

		if (!this.active) {

			this.active = true;

			if (!this.external) {

				this.table.element.appendChild(this.getElement());

				this.table.element.style.display = '';
			}
		}

		if (parent) {

			this.links.push(parent);
		}
	};

	FooterManager.prototype.redraw = function () {

		this.links.forEach(function (link) {

			link.footerRedraw();
		});
	};

	var Tabulator = function Tabulator(element, options) {

		this.options = {};

		this.columnManager = null; // hold Column Manager

		this.rowManager = null; //hold Row Manager

		this.footerManager = null; //holder Footer Manager

		this.browser = ""; //hold current browser type

		this.browserSlow = false; //handle reduced functionality for slower browsers

		this.browserMobile = false; //check if running on moble, prevent resize cancelling edit on keyboard appearence


		this.modules = {}; //hold all modules bound to this table


		this.initializeElement(element);

		this.initializeOptions(options || {});

		this._create();

		Tabulator.prototype.comms.register(this); //register table for inderdevice communication
	};

	//default setup options

	Tabulator.prototype.defaultOptions = {

		height: false, //height of tabulator

		minHeight: false, //minimum height of tabulator

		maxHeight: false, //maximum height of tabulator


		layout: "fitData", ///layout type "fitColumns" | "fitData"

		layoutColumnsOnNewData: false, //update column widths on setData


		columnMinWidth: 40, //minimum global width for a column

		columnHeaderVertAlign: "top", //vertical alignment of column headers

		columnVertAlign: false, // DEPRECATED - Left to allow warning


		resizableColumns: true, //resizable columns

		resizableRows: false, //resizable rows

		autoResize: true, //auto resize table


		columns: [], //store for colum header info


		cellHozAlign: "", //horizontal align columns

		cellVertAlign: "", //certical align columns


		data: [], //default starting data


		autoColumns: false, //build columns from data row structure


		reactiveData: false, //enable data reactivity


		nestedFieldSeparator: ".", //seperatpr for nested data


		tooltips: false, //Tool tip value

		tooltipsHeader: false, //Tool tip for headers

		tooltipGenerationMode: "load", //when to generate tooltips


		initialSort: false, //initial sorting criteria

		initialFilter: false, //initial filtering criteria

		initialHeaderFilter: false, //initial header filtering criteria


		columnHeaderSortMulti: true, //multiple or single column sorting


		sortOrderReverse: false, //reverse internal sort ordering


		headerSort: true, //set default global header sort

		headerSortTristate: false, //set default tristate header sorting


		footerElement: false, //hold footer element


		index: "id", //filed for row index


		keybindings: [], //array for keybindings


		tabEndNewRow: false, //create new row when tab to end of table


		invalidOptionWarnings: true, //allow toggling of invalid option warnings


		clipboard: false, //enable clipboard

		clipboardCopyStyled: true, //formatted table data

		clipboardCopyConfig: false, //clipboard config

		clipboardCopyFormatter: false, //DEPRICATED - REMOVE in 5.0

		clipboardCopyRowRange: "active", //restrict clipboard to visible rows only

		clipboardPasteParser: "table", //convert pasted clipboard data to rows

		clipboardPasteAction: "insert", //how to insert pasted data into the table


		clipboardCopied: function clipboardCopied() {}, //data has been copied to the clipboard

		clipboardPasted: function clipboardPasted() {}, //data has been pasted into the table

		clipboardPasteError: function clipboardPasteError() {}, //data has not successfully been pasted into the table


		downloadDataFormatter: false, //function to manipulate table data before it is downloaded

		downloadReady: function downloadReady(data, blob) {
			return blob;
		}, //function to manipulate download data

		downloadComplete: false, //function to manipulate download data

		downloadConfig: {}, //download config

		downloadRowRange: "active", //restrict download to active rows only


		dataTree: false, //enable data tree

		dataTreeElementColumn: false,

		dataTreeBranchElement: true, //show data tree branch element

		dataTreeChildIndent: 9, //data tree child indent in px

		dataTreeChildField: "_children", //data tre column field to look for child rows

		dataTreeCollapseElement: false, //data tree row collapse element

		dataTreeExpandElement: false, //data tree row expand element

		dataTreeStartExpanded: false,

		dataTreeRowExpanded: function dataTreeRowExpanded() {}, //row has been expanded

		dataTreeRowCollapsed: function dataTreeRowCollapsed() {}, //row has been collapsed

		dataTreeChildColumnCalcs: false, //include visible data tree rows in column calculations

		dataTreeSelectPropagate: false, //seleccting a parent row selects its children


		printAsHtml: false, //enable print as html

		printFormatter: false, //printing page formatter

		printHeader: false, //page header contents

		printFooter: false, //page footer contents

		printCopyStyle: true, //DEPRICATED - REMOVE in 5.0

		printStyled: true, //enable print as html styling

		printVisibleRows: true, //DEPRICATED - REMOVE in 5.0

		printRowRange: "visible", //restrict print to visible rows only

		printConfig: {}, //print config options


		addRowPos: "bottom", //position to insert blank rows, top|bottom


		selectable: "highlight", //highlight rows on hover

		selectableRangeMode: "drag", //highlight rows on hover

		selectableRollingSelection: true, //roll selection once maximum number of selectable rows is reached

		selectablePersistence: true, // maintain selection when table view is updated

		selectableCheck: function selectableCheck(data, row) {
			return true;
		}, //check wheather row is selectable


		headerFilterLiveFilterDelay: 300, //delay before updating column after user types in header filter

		headerFilterPlaceholder: false, //placeholder text to display in header filters


		headerVisible: true, //hide header


		history: false, //enable edit history


		locale: false, //current system language

		langs: {},

		virtualDom: true, //enable DOM virtualization

		virtualDomBuffer: 0, // set virtual DOM buffer size


		persistentLayout: false, //DEPRICATED - REMOVE in 5.0

		persistentSort: false, //DEPRICATED - REMOVE in 5.0

		persistentFilter: false, //DEPRICATED - REMOVE in 5.0

		persistenceID: "", //key for persistent storage

		persistenceMode: true, //mode for storing persistence information

		persistenceReaderFunc: false, //function for handling persistence data reading

		persistenceWriterFunc: false, //function for handling persistence data writing


		persistence: false,

		responsiveLayout: false, //responsive layout flags

		responsiveLayoutCollapseStartOpen: true, //start showing collapsed data

		responsiveLayoutCollapseUseFormatters: true, //responsive layout collapse formatter

		responsiveLayoutCollapseFormatter: false, //responsive layout collapse formatter


		pagination: false, //set pagination type

		paginationSize: false, //set number of rows to a page

		paginationInitialPage: 1, //initail page to show on load

		paginationButtonCount: 5, // set count of page button

		paginationSizeSelector: false, //add pagination size selector element

		paginationElement: false, //element to hold pagination numbers

		paginationDataSent: {}, //pagination data sent to the server

		paginationDataReceived: {}, //pagination data received from the server

		paginationAddRow: "page", //add rows on table or page


		ajaxURL: false, //url for ajax loading

		ajaxURLGenerator: false,

		ajaxParams: {}, //params for ajax loading

		ajaxConfig: "get", //ajax request type

		ajaxContentType: "form", //ajax request type

		ajaxRequestFunc: false, //promise function

		ajaxLoader: true, //show loader

		ajaxLoaderLoading: false, //loader element

		ajaxLoaderError: false, //loader element

		ajaxFiltering: false,

		ajaxSorting: false,

		ajaxProgressiveLoad: false, //progressive loading

		ajaxProgressiveLoadDelay: 0, //delay between requests

		ajaxProgressiveLoadScrollMargin: 0, //margin before scroll begins


		groupBy: false, //enable table grouping and set field to group by

		groupStartOpen: true, //starting state of group

		groupValues: false,

		groupHeader: false, //header generation function

		groupHeaderPrint: null,

		groupHeaderClipboard: null,

		groupHeaderHtmlOutput: null,

		groupHeaderDownload: null,

		htmlOutputConfig: false, //html outypu config


		movableColumns: false, //enable movable columns


		movableRows: false, //enable movable rows

		movableRowsConnectedTables: false, //tables for movable rows to be connected to

		movableRowsConnectedElements: false, //other elements for movable rows to be connected to

		movableRowsSender: false,

		movableRowsReceiver: "insert",

		movableRowsSendingStart: function movableRowsSendingStart() {},

		movableRowsSent: function movableRowsSent() {},

		movableRowsSentFailed: function movableRowsSentFailed() {},

		movableRowsSendingStop: function movableRowsSendingStop() {},

		movableRowsReceivingStart: function movableRowsReceivingStart() {},

		movableRowsReceived: function movableRowsReceived() {},

		movableRowsReceivedFailed: function movableRowsReceivedFailed() {},

		movableRowsReceivingStop: function movableRowsReceivingStop() {},

		movableRowsElementDrop: function movableRowsElementDrop() {},

		scrollToRowPosition: "top",

		scrollToRowIfVisible: true,

		scrollToColumnPosition: "left",

		scrollToColumnIfVisible: true,

		rowFormatter: false,

		rowFormatterPrint: null,

		rowFormatterClipboard: null,

		rowFormatterHtmlOutput: null,

		placeholder: false,

		//table building callbacks

		tableBuilding: function tableBuilding() {},

		tableBuilt: function tableBuilt() {},

		//render callbacks

		renderStarted: function renderStarted() {},

		renderComplete: function renderComplete() {},

		//row callbacks

		rowClick: false,

		rowDblClick: false,

		rowContext: false,

		rowTap: false,

		rowDblTap: false,

		rowTapHold: false,

		rowMouseEnter: false,

		rowMouseLeave: false,

		rowMouseOver: false,

		rowMouseOut: false,

		rowMouseMove: false,

		rowContextMenu: false,

		rowAdded: function rowAdded() {},

		rowDeleted: function rowDeleted() {},

		rowMoved: function rowMoved() {},

		rowUpdated: function rowUpdated() {},

		rowSelectionChanged: function rowSelectionChanged() {},

		rowSelected: function rowSelected() {},

		rowDeselected: function rowDeselected() {},

		rowResized: function rowResized() {},

		//cell callbacks

		//row callbacks

		cellClick: false,

		cellDblClick: false,

		cellContext: false,

		cellTap: false,

		cellDblTap: false,

		cellTapHold: false,

		cellMouseEnter: false,

		cellMouseLeave: false,

		cellMouseOver: false,

		cellMouseOut: false,

		cellMouseMove: false,

		cellEditing: function cellEditing() {},

		cellEdited: function cellEdited() {},

		cellEditCancelled: function cellEditCancelled() {},

		//column callbacks

		columnMoved: false,

		columnResized: function columnResized() {},

		columnTitleChanged: function columnTitleChanged() {},

		columnVisibilityChanged: function columnVisibilityChanged() {},

		//HTML iport callbacks

		htmlImporting: function htmlImporting() {},

		htmlImported: function htmlImported() {},

		//data callbacks

		dataLoading: function dataLoading() {},

		dataLoaded: function dataLoaded() {},

		dataEdited: function dataEdited() {},

		//ajax callbacks

		ajaxRequesting: function ajaxRequesting() {},

		ajaxResponse: false,

		ajaxError: function ajaxError() {},

		//filtering callbacks

		dataFiltering: false,

		dataFiltered: false,

		//sorting callbacks

		dataSorting: function dataSorting() {},

		dataSorted: function dataSorted() {},

		//grouping callbacks

		groupToggleElement: "arrow",

		groupClosedShowCalcs: false,

		dataGrouping: function dataGrouping() {},

		dataGrouped: false,

		groupVisibilityChanged: function groupVisibilityChanged() {},

		groupClick: false,

		groupDblClick: false,

		groupContext: false,

		groupContextMenu: false,

		groupTap: false,

		groupDblTap: false,

		groupTapHold: false,

		columnCalcs: true,

		//pagination callbacks

		pageLoaded: function pageLoaded() {},

		//localization callbacks

		localized: function localized() {},

		//validation callbacks

		validationMode: "blocking",

		validationFailed: function validationFailed() {},

		//history callbacks

		historyUndo: function historyUndo() {},

		historyRedo: function historyRedo() {},

		//scroll callbacks

		scrollHorizontal: function scrollHorizontal() {},

		scrollVertical: function scrollVertical() {}

	};

	Tabulator.prototype.initializeOptions = function (options) {

		//warn user if option is not available

		if (options.invalidOptionWarnings !== false) {

			for (var key in options) {

				if (typeof this.defaultOptions[key] === "undefined") {

					console.warn("Invalid table constructor option:", key);
				}
			}
		}

		//assign options to table

		for (var key in this.defaultOptions) {

			if (key in options) {

				this.options[key] = options[key];
			} else {

				if (Array.isArray(this.defaultOptions[key])) {

					this.options[key] = [];
				} else if (_typeof(this.defaultOptions[key]) === "object" && this.defaultOptions[key] !== null) {

					this.options[key] = {};
				} else {

					this.options[key] = this.defaultOptions[key];
				}
			}
		}
	};

	Tabulator.prototype.initializeElement = function (element) {

		if (typeof HTMLElement !== "undefined" && element instanceof HTMLElement) {

			this.element = element;

			return true;
		} else if (typeof element === "string") {

			this.element = document.querySelector(element);

			if (this.element) {

				return true;
			} else {

				console.error("Tabulator Creation Error - no element found matching selector: ", element);

				return false;
			}
		} else {

			console.error("Tabulator Creation Error - Invalid element provided:", element);

			return false;
		}
	};

	//convert depricated functionality to new functions

	Tabulator.prototype._mapDepricatedFunctionality = function () {

		//map depricated persistance setup options

		if (this.options.persistentLayout || this.options.persistentSort || this.options.persistentFilter) {

			if (!this.options.persistence) {

				this.options.persistence = {};
			}
		}

		if (this.options.downloadDataFormatter) {

			console.warn("DEPRECATION WARNING - downloadDataFormatter option has been deprecated");
		}

		if (typeof this.options.clipboardCopyHeader !== "undefined") {

			this.options.columnHeaders = this.options.clipboardCopyHeader;

			console.warn("DEPRECATION WARNING - clipboardCopyHeader option has been deprecated, please use the columnHeaders property on the clipboardCopyConfig option");
		}

		if (this.options.printVisibleRows !== true) {

			console.warn("printVisibleRows option is deprecated, you should now use the printRowRange option");

			this.options.persistence.printRowRange = "active";
		}

		if (this.options.printCopyStyle !== true) {

			console.warn("printCopyStyle option is deprecated, you should now use the printStyled option");

			this.options.persistence.printStyled = this.options.printCopyStyle;
		}

		if (this.options.persistentLayout) {

			console.warn("persistentLayout option is deprecated, you should now use the persistence option");

			if (this.options.persistence !== true && typeof this.options.persistence.columns === "undefined") {

				this.options.persistence.columns = true;
			}
		}

		if (this.options.persistentSort) {

			console.warn("persistentSort option is deprecated, you should now use the persistence option");

			if (this.options.persistence !== true && typeof this.options.persistence.sort === "undefined") {

				this.options.persistence.sort = true;
			}
		}

		if (this.options.persistentFilter) {

			console.warn("persistentFilter option is deprecated, you should now use the persistence option");

			if (this.options.persistence !== true && typeof this.options.persistence.filter === "undefined") {

				this.options.persistence.filter = true;
			}
		}

		if (this.options.columnVertAlign) {

			console.warn("columnVertAlign option is deprecated, you should now use the columnHeaderVertAlign option");

			this.options.columnHeaderVertAlign = this.options.columnVertAlign;
		}
	};

	Tabulator.prototype._clearSelection = function () {

		this.element.classList.add("tabulator-block-select");

		if (window.getSelection) {

			if (window.getSelection().empty) {
				// Chrome

				window.getSelection().empty();
			} else if (window.getSelection().removeAllRanges) {
				// Firefox

				window.getSelection().removeAllRanges();
			}
		} else if (document.selection) {
			// IE?

			document.selection.empty();
		}

		this.element.classList.remove("tabulator-block-select");
	};

	//concreate table

	Tabulator.prototype._create = function () {

		this._clearObjectPointers();

		this._mapDepricatedFunctionality();

		this.bindModules();

		if (this.element.tagName === "TABLE") {

			if (this.modExists("htmlTableImport", true)) {

				this.modules.htmlTableImport.parseTable();
			}
		}

		this.columnManager = new ColumnManager(this);

		this.rowManager = new RowManager(this);

		this.footerManager = new FooterManager(this);

		this.columnManager.setRowManager(this.rowManager);

		this.rowManager.setColumnManager(this.columnManager);

		this._buildElement();

		this._loadInitialData();
	};

	//clear pointers to objects in default config object

	Tabulator.prototype._clearObjectPointers = function () {

		this.options.columns = this.options.columns.slice(0);

		if (!this.options.reactiveData) {

			this.options.data = this.options.data.slice(0);
		}
	};

	//build tabulator element

	Tabulator.prototype._buildElement = function () {
		var _this17 = this;

		var element = this.element,
		    mod = this.modules,
		    options = this.options;

		options.tableBuilding.call(this);

		element.classList.add("tabulator");

		element.setAttribute("role", "grid");

		//empty element

		while (element.firstChild) {
			element.removeChild(element.firstChild);
		} //set table height

		if (options.height) {

			options.height = isNaN(options.height) ? options.height : options.height + "px";

			element.style.height = options.height;
		}

		//set table min height

		if (options.minHeight !== false) {

			options.minHeight = isNaN(options.minHeight) ? options.minHeight : options.minHeight + "px";

			element.style.minHeight = options.minHeight;
		}

		//set table maxHeight

		if (options.maxHeight !== false) {

			options.maxHeight = isNaN(options.maxHeight) ? options.maxHeight : options.maxHeight + "px";

			element.style.maxHeight = options.maxHeight;
		}

		this.columnManager.initialize();

		this.rowManager.initialize();

		this._detectBrowser();

		if (this.modExists("layout", true)) {

			mod.layout.initialize(options.layout);
		}

		//set localization

		if (options.headerFilterPlaceholder !== false) {

			mod.localize.setHeaderFilterPlaceholder(options.headerFilterPlaceholder);
		}

		for (var locale in options.langs) {

			mod.localize.installLang(locale, options.langs[locale]);
		}

		mod.localize.setLocale(options.locale);

		//configure placeholder element

		if (typeof options.placeholder == "string") {

			var el = document.createElement("div");

			el.classList.add("tabulator-placeholder");

			var span = document.createElement("span");

			span.innerHTML = options.placeholder;

			el.appendChild(span);

			options.placeholder = el;
		}

		//build table elements

		element.appendChild(this.columnManager.getElement());

		element.appendChild(this.rowManager.getElement());

		if (options.footerElement) {

			this.footerManager.activate();
		}

		if (options.persistence && this.modExists("persistence", true)) {

			mod.persistence.initialize();
		}

		if (options.persistence && this.modExists("persistence", true) && mod.persistence.config.columns) {

			options.columns = mod.persistence.load("columns", options.columns);
		}

		if (options.movableRows && this.modExists("moveRow")) {

			mod.moveRow.initialize();
		}

		if (options.autoColumns && this.options.data) {

			this.columnManager.generateColumnsFromRowData(this.options.data);
		}

		if (this.modExists("columnCalcs")) {

			mod.columnCalcs.initialize();
		}

		this.columnManager.setColumns(options.columns);

		if (options.dataTree && this.modExists("dataTree", true)) {

			mod.dataTree.initialize();
		}

		if (this.modExists("frozenRows")) {

			this.modules.frozenRows.initialize();
		}

		if ((options.persistence && this.modExists("persistence", true) && mod.persistence.config.sort || options.initialSort) && this.modExists("sort", true)) {

			var sorters = [];

			if (options.persistence && this.modExists("persistence", true) && mod.persistence.config.sort) {

				sorters = mod.persistence.load("sort");

				if (sorters === false && options.initialSort) {

					sorters = options.initialSort;
				}
			} else if (options.initialSort) {

				sorters = options.initialSort;
			}

			mod.sort.setSort(sorters);
		}

		if ((options.persistence && this.modExists("persistence", true) && mod.persistence.config.filter || options.initialFilter) && this.modExists("filter", true)) {

			var filters = [];

			if (options.persistence && this.modExists("persistence", true) && mod.persistence.config.filter) {

				filters = mod.persistence.load("filter");

				if (filters === false && options.initialFilter) {

					filters = options.initialFilter;
				}
			} else if (options.initialFilter) {

				filters = options.initialFilter;
			}

			mod.filter.setFilter(filters);
		}

		if (options.initialHeaderFilter && this.modExists("filter", true)) {

			options.initialHeaderFilter.forEach(function (item) {

				var column = _this17.columnManager.findColumn(item.field);

				if (column) {

					mod.filter.setHeaderFilterValue(column, item.value);
				} else {

					console.warn("Column Filter Error - No matching column found:", item.field);

					return false;
				}
			});
		}

		if (this.modExists("ajax")) {

			mod.ajax.initialize();
		}

		if (options.pagination && this.modExists("page", true)) {

			mod.page.initialize();
		}

		if (options.groupBy && this.modExists("groupRows", true)) {

			mod.groupRows.initialize();
		}

		if (this.modExists("keybindings")) {

			mod.keybindings.initialize();
		}

		if (this.modExists("selectRow")) {

			mod.selectRow.clearSelectionData(true);
		}

		if (options.autoResize && this.modExists("resizeTable")) {

			mod.resizeTable.initialize();
		}

		if (this.modExists("clipboard")) {

			mod.clipboard.initialize();
		}

		if (options.printAsHtml && this.modExists("print")) {

			mod.print.initialize();
		}

		options.tableBuilt.call(this);
	};

	Tabulator.prototype._loadInitialData = function () {

		var self = this;

		if (self.options.pagination && self.modExists("page")) {

			self.modules.page.reset(true, true);

			if (self.options.pagination == "local") {

				if (self.options.data.length) {

					self.rowManager.setData(self.options.data, false, true);
				} else {

					if ((self.options.ajaxURL || self.options.ajaxURLGenerator) && self.modExists("ajax")) {

						self.modules.ajax.loadData(false, true).then(function () {}).catch(function () {

							if (self.options.paginationInitialPage) {

								self.modules.page.setPage(self.options.paginationInitialPage);
							}
						});

						return;
					} else {

						self.rowManager.setData(self.options.data, false, true);
					}
				}

				if (self.options.paginationInitialPage) {

					self.modules.page.setPage(self.options.paginationInitialPage);
				}
			} else {

				if (self.options.ajaxURL) {

					self.modules.page.setPage(self.options.paginationInitialPage).then(function () {}).catch(function () {});
				} else {

					self.rowManager.setData([], false, true);
				}
			}
		} else {

			if (self.options.data.length) {

				self.rowManager.setData(self.options.data);
			} else {

				if ((self.options.ajaxURL || self.options.ajaxURLGenerator) && self.modExists("ajax")) {

					self.modules.ajax.loadData(false, true).then(function () {}).catch(function () {});
				} else {

					self.rowManager.setData(self.options.data, false, true);
				}
			}
		}
	};

	//deconstructor

	Tabulator.prototype.destroy = function () {

		var element = this.element;

		Tabulator.prototype.comms.deregister(this); //deregister table from inderdevice communication


		if (this.options.reactiveData && this.modExists("reactiveData", true)) {

			this.modules.reactiveData.unwatchData();
		}

		//clear row data

		this.rowManager.rows.forEach(function (row) {

			row.wipe();
		});

		this.rowManager.rows = [];

		this.rowManager.activeRows = [];

		this.rowManager.displayRows = [];

		//clear event bindings

		if (this.options.autoResize && this.modExists("resizeTable")) {

			this.modules.resizeTable.clearBindings();
		}

		if (this.modExists("keybindings")) {

			this.modules.keybindings.clearBindings();
		}

		//clear DOM

		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}element.classList.remove("tabulator");
	};

	Tabulator.prototype._detectBrowser = function () {

		var ua = navigator.userAgent || navigator.vendor || window.opera;

		if (ua.indexOf("Trident") > -1) {

			this.browser = "ie";

			this.browserSlow = true;
		} else if (ua.indexOf("Edge") > -1) {

			this.browser = "edge";

			this.browserSlow = true;
		} else if (ua.indexOf("Firefox") > -1) {

			this.browser = "firefox";

			this.browserSlow = false;
		} else {

			this.browser = "other";

			this.browserSlow = false;
		}

		this.browserMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
	};

	////////////////// Data Handling //////////////////


	//block table redrawing

	Tabulator.prototype.blockRedraw = function () {

		return this.rowManager.blockRedraw();
	};

	//restore table redrawing

	Tabulator.prototype.restoreRedraw = function () {

		return this.rowManager.restoreRedraw();
	};

	//local data from local file

	Tabulator.prototype.setDataFromLocalFile = function (extensions) {
		var _this18 = this;

		return new Promise(function (resolve, reject) {

			var input = document.createElement("input");

			input.type = "file";

			input.accept = extensions || ".json,application/json";

			input.addEventListener("change", function (e) {

				var file = input.files[0],
				    reader = new FileReader(),
				    data;

				reader.readAsText(file);

				reader.onload = function (e) {

					try {

						data = JSON.parse(reader.result);
					} catch (e) {

						console.warn("File Load Error - File contents is invalid JSON", e);

						reject(e);

						return;
					}

					_this18.setData(data).then(function (data) {

						resolve(data);
					}).catch(function (err) {

						resolve(err);
					});
				};

				reader.onerror = function (e) {

					console.warn("File Load Error - Unable to read file");

					reject();
				};
			});

			input.click();
		});
	};

	//load data

	Tabulator.prototype.setData = function (data, params, config) {

		if (this.modExists("ajax")) {

			this.modules.ajax.blockActiveRequest();
		}

		return this._setData(data, params, config, false, true);
	};

	Tabulator.prototype._setData = function (data, params, config, inPosition, columnsChanged) {

		var self = this;

		if (typeof data === "string") {

			if (data.indexOf("{") == 0 || data.indexOf("[") == 0) {

				//data is a json encoded string

				return self.rowManager.setData(JSON.parse(data), inPosition, columnsChanged);
			} else {

				if (self.modExists("ajax", true)) {

					if (params) {

						self.modules.ajax.setParams(params);
					}

					if (config) {

						self.modules.ajax.setConfig(config);
					}

					self.modules.ajax.setUrl(data);

					if (self.options.pagination == "remote" && self.modExists("page", true)) {

						self.modules.page.reset(true, true);

						return self.modules.page.setPage(1);
					} else {

						//assume data is url, make ajax call to url to get data

						return self.modules.ajax.loadData(inPosition, columnsChanged);
					}
				}
			}
		} else {

			if (data) {

				//asume data is already an object

				return self.rowManager.setData(data, inPosition, columnsChanged);
			} else {

				//no data provided, check if ajaxURL is present;

				if (self.modExists("ajax") && (self.modules.ajax.getUrl || self.options.ajaxURLGenerator)) {

					if (self.options.pagination == "remote" && self.modExists("page", true)) {

						self.modules.page.reset(true, true);

						return self.modules.page.setPage(1);
					} else {

						return self.modules.ajax.loadData(inPosition, columnsChanged);
					}
				} else {

					//empty data

					return self.rowManager.setData([], inPosition, columnsChanged);
				}
			}
		}
	};

	//clear data

	Tabulator.prototype.clearData = function () {

		if (this.modExists("ajax")) {

			this.modules.ajax.blockActiveRequest();
		}

		this.rowManager.clearData();
	};

	//get table data array

	Tabulator.prototype.getData = function (active) {

		if (active === true) {

			console.warn("passing a boolean to the getData function is deprecated, you should now pass the string 'active'");

			active = "active";
		}

		return this.rowManager.getData(active);
	};

	//get table data array count

	Tabulator.prototype.getDataCount = function (active) {

		if (active === true) {

			console.warn("passing a boolean to the getDataCount function is deprecated, you should now pass the string 'active'");

			active = "active";
		}

		return this.rowManager.getDataCount(active);
	};

	//search for specific row components

	Tabulator.prototype.searchRows = function (field, type, value) {

		if (this.modExists("filter", true)) {

			return this.modules.filter.search("rows", field, type, value);
		}
	};

	//search for specific data

	Tabulator.prototype.searchData = function (field, type, value) {

		if (this.modExists("filter", true)) {

			return this.modules.filter.search("data", field, type, value);
		}
	};

	//get table html

	Tabulator.prototype.getHtml = function (visible, style, config) {

		if (this.modExists("export", true)) {

			return this.modules.export.getHtml(visible, style, config);
		}
	};

	//get print html

	Tabulator.prototype.print = function (visible, style, config) {

		if (this.modExists("print", true)) {

			return this.modules.print.printFullscreen(visible, style, config);
		}
	};

	//retrieve Ajax URL

	Tabulator.prototype.getAjaxUrl = function () {

		if (this.modExists("ajax", true)) {

			return this.modules.ajax.getUrl();
		}
	};

	//replace data, keeping table in position with same sort

	Tabulator.prototype.replaceData = function (data, params, config) {

		if (this.modExists("ajax")) {

			this.modules.ajax.blockActiveRequest();
		}

		return this._setData(data, params, config, true);
	};

	//update table data

	Tabulator.prototype.updateData = function (data) {
		var _this19 = this;

		var self = this;

		var responses = 0;

		return new Promise(function (resolve, reject) {

			if (_this19.modExists("ajax")) {

				_this19.modules.ajax.blockActiveRequest();
			}

			if (typeof data === "string") {

				data = JSON.parse(data);
			}

			if (data) {

				data.forEach(function (item) {

					var row = self.rowManager.findRow(item[self.options.index]);

					if (row) {

						responses++;

						row.updateData(item).then(function () {

							responses--;

							if (!responses) {

								resolve();
							}
						});
					}
				});
			} else {

				console.warn("Update Error - No data provided");

				reject("Update Error - No data provided");
			}
		});
	};

	Tabulator.prototype.addData = function (data, pos, index) {
		var _this20 = this;

		return new Promise(function (resolve, reject) {

			if (_this20.modExists("ajax")) {

				_this20.modules.ajax.blockActiveRequest();
			}

			if (typeof data === "string") {

				data = JSON.parse(data);
			}

			if (data) {

				_this20.rowManager.addRows(data, pos, index).then(function (rows) {

					var output = [];

					rows.forEach(function (row) {

						output.push(row.getComponent());
					});

					resolve(output);
				});
			} else {

				console.warn("Update Error - No data provided");

				reject("Update Error - No data provided");
			}
		});
	};

	//update table data

	Tabulator.prototype.updateOrAddData = function (data) {
		var _this21 = this;

		var self = this,
		    rows = [],
		    responses = 0;

		return new Promise(function (resolve, reject) {

			if (_this21.modExists("ajax")) {

				_this21.modules.ajax.blockActiveRequest();
			}

			if (typeof data === "string") {

				data = JSON.parse(data);
			}

			if (data) {

				data.forEach(function (item) {

					var row = self.rowManager.findRow(item[self.options.index]);

					responses++;

					if (row) {

						row.updateData(item).then(function () {

							responses--;

							rows.push(row.getComponent());

							if (!responses) {

								resolve(rows);
							}
						});
					} else {

						self.rowManager.addRows(item).then(function (newRows) {

							responses--;

							rows.push(newRows[0].getComponent());

							if (!responses) {

								resolve(rows);
							}
						});
					}
				});
			} else {

				console.warn("Update Error - No data provided");

				reject("Update Error - No data provided");
			}
		});
	};

	//get row object

	Tabulator.prototype.getRow = function (index) {

		var row = this.rowManager.findRow(index);

		if (row) {

			return row.getComponent();
		} else {

			console.warn("Find Error - No matching row found:", index);

			return false;
		}
	};

	//get row object

	Tabulator.prototype.getRowFromPosition = function (position, active) {

		var row = this.rowManager.getRowFromPosition(position, active);

		if (row) {

			return row.getComponent();
		} else {

			console.warn("Find Error - No matching row found:", position);

			return false;
		}
	};

	//delete row from table

	Tabulator.prototype.deleteRow = function (index) {
		var _this22 = this;

		return new Promise(function (resolve, reject) {

			var self = _this22,
			    count = 0,
			    successCount = 0,
			    foundRows = [];

			function doneCheck() {

				count++;

				if (count == index.length) {

					if (successCount) {

						self.rowManager.reRenderInPosition();

						resolve();
					}
				}
			}

			if (!Array.isArray(index)) {

				index = [index];
			}

			//find matching rows

			index.forEach(function (item) {

				var row = _this22.rowManager.findRow(item, true);

				if (row) {

					foundRows.push(row);
				} else {

					console.warn("Delete Error - No matching row found:", item);

					reject("Delete Error - No matching row found");

					doneCheck();
				}
			});

			//sort rows into correct order to ensure smooth delete from table

			foundRows.sort(function (a, b) {

				return _this22.rowManager.rows.indexOf(a) > _this22.rowManager.rows.indexOf(b) ? 1 : -1;
			});

			foundRows.forEach(function (row) {

				row.delete().then(function () {

					successCount++;

					doneCheck();
				}).catch(function (err) {

					doneCheck();

					reject(err);
				});
			});
		});
	};

	//add row to table

	Tabulator.prototype.addRow = function (data, pos, index) {
		var _this23 = this;

		return new Promise(function (resolve, reject) {

			if (typeof data === "string") {

				data = JSON.parse(data);
			}

			_this23.rowManager.addRows(data, pos, index).then(function (rows) {

				//recalc column calculations if present

				if (_this23.modExists("columnCalcs")) {

					_this23.modules.columnCalcs.recalc(_this23.rowManager.activeRows);
				}

				resolve(rows[0].getComponent());
			});
		});
	};

	//update a row if it exitsts otherwise create it

	Tabulator.prototype.updateOrAddRow = function (index, data) {
		var _this24 = this;

		return new Promise(function (resolve, reject) {

			var row = _this24.rowManager.findRow(index);

			if (typeof data === "string") {

				data = JSON.parse(data);
			}

			if (row) {

				row.updateData(data).then(function () {

					//recalc column calculations if present

					if (_this24.modExists("columnCalcs")) {

						_this24.modules.columnCalcs.recalc(_this24.rowManager.activeRows);
					}

					resolve(row.getComponent());
				}).catch(function (err) {

					reject(err);
				});
			} else {

				row = _this24.rowManager.addRows(data).then(function (rows) {

					//recalc column calculations if present

					if (_this24.modExists("columnCalcs")) {

						_this24.modules.columnCalcs.recalc(_this24.rowManager.activeRows);
					}

					resolve(rows[0].getComponent());
				}).catch(function (err) {

					reject(err);
				});
			}
		});
	};

	//update row data

	Tabulator.prototype.updateRow = function (index, data) {
		var _this25 = this;

		return new Promise(function (resolve, reject) {

			var row = _this25.rowManager.findRow(index);

			if (typeof data === "string") {

				data = JSON.parse(data);
			}

			if (row) {

				row.updateData(data).then(function () {

					resolve(row.getComponent());
				}).catch(function (err) {

					reject(err);
				});
			} else {

				console.warn("Update Error - No matching row found:", index);

				reject("Update Error - No matching row found");
			}
		});
	};

	//scroll to row in DOM

	Tabulator.prototype.scrollToRow = function (index, position, ifVisible) {
		var _this26 = this;

		return new Promise(function (resolve, reject) {

			var row = _this26.rowManager.findRow(index);

			if (row) {

				_this26.rowManager.scrollToRow(row, position, ifVisible).then(function () {

					resolve();
				}).catch(function (err) {

					reject(err);
				});
			} else {

				console.warn("Scroll Error - No matching row found:", index);

				reject("Scroll Error - No matching row found");
			}
		});
	};

	Tabulator.prototype.moveRow = function (from, to, after) {

		var fromRow = this.rowManager.findRow(from);

		if (fromRow) {

			fromRow.moveToRow(to, after);
		} else {

			console.warn("Move Error - No matching row found:", from);
		}
	};

	Tabulator.prototype.getRows = function (active) {

		if (active === true) {

			console.warn("passing a boolean to the getRows function is deprecated, you should now pass the string 'active'");

			active = "active";
		}

		return this.rowManager.getComponents(active);
	};

	//get position of row in table

	Tabulator.prototype.getRowPosition = function (index, active) {

		var row = this.rowManager.findRow(index);

		if (row) {

			return this.rowManager.getRowPosition(row, active);
		} else {

			console.warn("Position Error - No matching row found:", index);

			return false;
		}
	};

	//copy table data to clipboard

	Tabulator.prototype.copyToClipboard = function (selector) {

		if (this.modExists("clipboard", true)) {

			this.modules.clipboard.copy(selector);
		}
	};

	/////////////// Column Functions  ///////////////


	Tabulator.prototype.setColumns = function (definition) {

		this.columnManager.setColumns(definition);
	};

	Tabulator.prototype.getColumns = function (structured) {

		return this.columnManager.getComponents(structured);
	};

	Tabulator.prototype.getColumn = function (field) {

		var col = this.columnManager.findColumn(field);

		if (col) {

			return col.getComponent();
		} else {

			console.warn("Find Error - No matching column found:", field);

			return false;
		}
	};

	Tabulator.prototype.getColumnDefinitions = function () {

		return this.columnManager.getDefinitionTree();
	};

	Tabulator.prototype.getColumnLayout = function () {

		if (this.modExists("persistence", true)) {

			return this.modules.persistence.parseColumns(this.columnManager.getColumns());
		}
	};

	Tabulator.prototype.setColumnLayout = function (layout) {

		if (this.modExists("persistence", true)) {

			this.columnManager.setColumns(this.modules.persistence.mergeDefinition(this.options.columns, layout));

			return true;
		}

		return false;
	};

	Tabulator.prototype.showColumn = function (field) {

		var column = this.columnManager.findColumn(field);

		if (column) {

			column.show();

			if (this.options.responsiveLayout && this.modExists("responsiveLayout", true)) {

				this.modules.responsiveLayout.update();
			}
		} else {

			console.warn("Column Show Error - No matching column found:", field);

			return false;
		}
	};

	Tabulator.prototype.hideColumn = function (field) {

		var column = this.columnManager.findColumn(field);

		if (column) {

			column.hide();

			if (this.options.responsiveLayout && this.modExists("responsiveLayout", true)) {

				this.modules.responsiveLayout.update();
			}
		} else {

			console.warn("Column Hide Error - No matching column found:", field);

			return false;
		}
	};

	Tabulator.prototype.toggleColumn = function (field) {

		var column = this.columnManager.findColumn(field);

		if (column) {

			if (column.visible) {

				column.hide();
			} else {

				column.show();
			}
		} else {

			console.warn("Column Visibility Toggle Error - No matching column found:", field);

			return false;
		}
	};

	Tabulator.prototype.addColumn = function (definition, before, field) {
		var _this27 = this;

		return new Promise(function (resolve, reject) {

			var column = _this27.columnManager.findColumn(field);

			_this27.columnManager.addColumn(definition, before, column).then(function (column) {

				resolve(column.getComponent());
			}).catch(function (err) {

				reject(err);
			});
		});
	};

	Tabulator.prototype.deleteColumn = function (field) {
		var _this28 = this;

		return new Promise(function (resolve, reject) {

			var column = _this28.columnManager.findColumn(field);

			if (column) {

				column.delete().then(function () {

					resolve();
				}).catch(function (err) {

					reject(err);
				});
			} else {

				console.warn("Column Delete Error - No matching column found:", field);

				reject();
			}
		});
	};

	Tabulator.prototype.updateColumnDefinition = function (field, definition) {
		var _this29 = this;

		return new Promise(function (resolve, reject) {

			var column = _this29.columnManager.findColumn(field);

			if (column) {

				column.updateDefinition(definition).then(function (col) {

					resolve(col);
				}).catch(function (err) {

					reject(err);
				});
			} else {

				console.warn("Column Update Error - No matching column found:", field);

				reject();
			}
		});
	};

	Tabulator.prototype.moveColumn = function (from, to, after) {

		var fromColumn = this.columnManager.findColumn(from);

		var toColumn = this.columnManager.findColumn(to);

		if (fromColumn) {

			if (toColumn) {

				this.columnManager.moveColumn(fromColumn, toColumn, after);
			} else {

				console.warn("Move Error - No matching column found:", toColumn);
			}
		} else {

			console.warn("Move Error - No matching column found:", from);
		}
	};

	//scroll to column in DOM

	Tabulator.prototype.scrollToColumn = function (field, position, ifVisible) {
		var _this30 = this;

		return new Promise(function (resolve, reject) {

			var column = _this30.columnManager.findColumn(field);

			if (column) {

				_this30.columnManager.scrollToColumn(column, position, ifVisible).then(function () {

					resolve();
				}).catch(function (err) {

					reject(err);
				});
			} else {

				console.warn("Scroll Error - No matching column found:", field);

				reject("Scroll Error - No matching column found");
			}
		});
	};

	//////////// Localization Functions  ////////////

	Tabulator.prototype.setLocale = function (locale) {

		this.modules.localize.setLocale(locale);
	};

	Tabulator.prototype.getLocale = function () {

		return this.modules.localize.getLocale();
	};

	Tabulator.prototype.getLang = function (locale) {

		return this.modules.localize.getLang(locale);
	};

	//////////// General Public Functions ////////////


	//redraw list without updating data

	Tabulator.prototype.redraw = function (force) {

		this.columnManager.redraw(force);

		this.rowManager.redraw(force);
	};

	Tabulator.prototype.setHeight = function (height) {

		if (this.rowManager.renderMode !== "classic") {

			this.options.height = isNaN(height) ? height : height + "px";

			this.element.style.height = this.options.height;

			this.rowManager.setRenderMode();

			this.rowManager.redraw();
		} else {

			console.warn("setHeight function is not available in classic render mode");
		}
	};

	///////////////////// Sorting ////////////////////


	//trigger sort

	Tabulator.prototype.setSort = function (sortList, dir) {

		if (this.modExists("sort", true)) {

			this.modules.sort.setSort(sortList, dir);

			this.rowManager.sorterRefresh();
		}
	};

	Tabulator.prototype.getSorters = function () {

		if (this.modExists("sort", true)) {

			return this.modules.sort.getSort();
		}
	};

	Tabulator.prototype.clearSort = function () {

		if (this.modExists("sort", true)) {

			this.modules.sort.clear();

			this.rowManager.sorterRefresh();
		}
	};

	///////////////////// Filtering ////////////////////


	//set standard filters

	Tabulator.prototype.setFilter = function (field, type, value, params) {

		if (this.modExists("filter", true)) {

			this.modules.filter.setFilter(field, type, value, params);

			this.rowManager.filterRefresh();
		}
	};

	//add filter to array

	Tabulator.prototype.addFilter = function (field, type, value, params) {

		if (this.modExists("filter", true)) {

			this.modules.filter.addFilter(field, type, value, params);

			this.rowManager.filterRefresh();
		}
	};

	//get all filters

	Tabulator.prototype.getFilters = function (all) {

		if (this.modExists("filter", true)) {

			return this.modules.filter.getFilters(all);
		}
	};

	Tabulator.prototype.setHeaderFilterFocus = function (field) {

		if (this.modExists("filter", true)) {

			var column = this.columnManager.findColumn(field);

			if (column) {

				this.modules.filter.setHeaderFilterFocus(column);
			} else {

				console.warn("Column Filter Focus Error - No matching column found:", field);

				return false;
			}
		}
	};

	Tabulator.prototype.getHeaderFilterValue = function (field) {

		if (this.modExists("filter", true)) {

			var column = this.columnManager.findColumn(field);

			if (column) {

				return this.modules.filter.getHeaderFilterValue(column);
			} else {

				console.warn("Column Filter Error - No matching column found:", field);
			}
		}
	};

	Tabulator.prototype.setHeaderFilterValue = function (field, value) {

		if (this.modExists("filter", true)) {

			var column = this.columnManager.findColumn(field);

			if (column) {

				this.modules.filter.setHeaderFilterValue(column, value);
			} else {

				console.warn("Column Filter Error - No matching column found:", field);

				return false;
			}
		}
	};

	Tabulator.prototype.getHeaderFilters = function () {

		if (this.modExists("filter", true)) {

			return this.modules.filter.getHeaderFilters();
		}
	};

	//remove filter from array

	Tabulator.prototype.removeFilter = function (field, type, value) {

		if (this.modExists("filter", true)) {

			this.modules.filter.removeFilter(field, type, value);

			this.rowManager.filterRefresh();
		}
	};

	//clear filters

	Tabulator.prototype.clearFilter = function (all) {

		if (this.modExists("filter", true)) {

			this.modules.filter.clearFilter(all);

			this.rowManager.filterRefresh();
		}
	};

	//clear header filters

	Tabulator.prototype.clearHeaderFilter = function () {

		if (this.modExists("filter", true)) {

			this.modules.filter.clearHeaderFilter();

			this.rowManager.filterRefresh();
		}
	};

	///////////////////// select ////////////////////

	Tabulator.prototype.selectRow = function (rows) {

		if (this.modExists("selectRow", true)) {

			if (rows === true) {

				console.warn("passing a boolean to the selectRowselectRow function is deprecated, you should now pass the string 'active'");

				rows = "active";
			}

			this.modules.selectRow.selectRows(rows);
		}
	};

	Tabulator.prototype.deselectRow = function (rows) {

		if (this.modExists("selectRow", true)) {

			this.modules.selectRow.deselectRows(rows);
		}
	};

	Tabulator.prototype.toggleSelectRow = function (row) {

		if (this.modExists("selectRow", true)) {

			this.modules.selectRow.toggleRow(row);
		}
	};

	Tabulator.prototype.getSelectedRows = function () {

		if (this.modExists("selectRow", true)) {

			return this.modules.selectRow.getSelectedRows();
		}
	};

	Tabulator.prototype.getSelectedData = function () {

		if (this.modExists("selectRow", true)) {

			return this.modules.selectRow.getSelectedData();
		}
	};

	///////////////////// validation  ////////////////////

	Tabulator.prototype.getInvalidCells = function () {

		if (this.modExists("validate", true)) {

			return this.modules.validate.getInvalidCells();
		}
	};

	Tabulator.prototype.clearCellValidation = function (cells) {
		var _this31 = this;

		if (this.modExists("validate", true)) {

			if (!cells) {

				cells = this.modules.validate.getInvalidCells();
			}

			if (!Array.isArray(cells)) {

				cells = [cells];
			}

			cells.forEach(function (cell) {

				_this31.modules.validate.clearValidation(cell._getSelf());
			});
		}
	};

	Tabulator.prototype.validate = function (cells) {

		var output = [];

		//clear row data

		this.rowManager.rows.forEach(function (row) {

			var valid = row.validate();

			if (valid !== true) {

				output = output.concat(valid);
			}
		});

		return output.length ? output : true;
	};

	//////////// Pagination Functions  ////////////


	Tabulator.prototype.setMaxPage = function (max) {

		if (this.options.pagination && this.modExists("page")) {

			this.modules.page.setMaxPage(max);
		} else {

			return false;
		}
	};

	Tabulator.prototype.setPage = function (page) {

		if (this.options.pagination && this.modExists("page")) {

			return this.modules.page.setPage(page);
		} else {

			return new Promise(function (resolve, reject) {
				reject();
			});
		}
	};

	Tabulator.prototype.setPageToRow = function (row) {
		var _this32 = this;

		return new Promise(function (resolve, reject) {

			if (_this32.options.pagination && _this32.modExists("page")) {

				row = _this32.rowManager.findRow(row);

				if (row) {

					_this32.modules.page.setPageToRow(row).then(function () {

						resolve();
					}).catch(function () {

						reject();
					});
				} else {

					reject();
				}
			} else {

				reject();
			}
		});
	};

	Tabulator.prototype.setPageSize = function (size) {

		if (this.options.pagination && this.modExists("page")) {

			this.modules.page.setPageSize(size);

			this.modules.page.setPage(1).then(function () {}).catch(function () {});
		} else {

			return false;
		}
	};

	Tabulator.prototype.getPageSize = function () {

		if (this.options.pagination && this.modExists("page", true)) {

			return this.modules.page.getPageSize();
		}
	};

	Tabulator.prototype.previousPage = function () {

		if (this.options.pagination && this.modExists("page")) {

			this.modules.page.previousPage();
		} else {

			return false;
		}
	};

	Tabulator.prototype.nextPage = function () {

		if (this.options.pagination && this.modExists("page")) {

			this.modules.page.nextPage();
		} else {

			return false;
		}
	};

	Tabulator.prototype.getPage = function () {

		if (this.options.pagination && this.modExists("page")) {

			return this.modules.page.getPage();
		} else {

			return false;
		}
	};

	Tabulator.prototype.getPageMax = function () {

		if (this.options.pagination && this.modExists("page")) {

			return this.modules.page.getPageMax();
		} else {

			return false;
		}
	};

	///////////////// Grouping Functions ///////////////


	Tabulator.prototype.setGroupBy = function (groups) {

		if (this.modExists("groupRows", true)) {

			this.options.groupBy = groups;

			this.modules.groupRows.initialize();

			this.rowManager.refreshActiveData("display");

			if (this.options.persistence && this.modExists("persistence", true) && this.modules.persistence.config.group) {

				this.modules.persistence.save("group");
			}
		} else {

			return false;
		}
	};

	Tabulator.prototype.setGroupStartOpen = function (values) {

		if (this.modExists("groupRows", true)) {

			this.options.groupStartOpen = values;

			this.modules.groupRows.initialize();

			if (this.options.groupBy) {

				this.rowManager.refreshActiveData("group");

				if (this.options.persistence && this.modExists("persistence", true) && this.modules.persistence.config.group) {

					this.modules.persistence.save("group");
				}
			} else {

				console.warn("Grouping Update - cant refresh view, no groups have been set");
			}
		} else {

			return false;
		}
	};

	Tabulator.prototype.setGroupHeader = function (values) {

		if (this.modExists("groupRows", true)) {

			this.options.groupHeader = values;

			this.modules.groupRows.initialize();

			if (this.options.groupBy) {

				this.rowManager.refreshActiveData("group");

				if (this.options.persistence && this.modExists("persistence", true) && this.modules.persistence.config.group) {

					this.modules.persistence.save("group");
				}
			} else {

				console.warn("Grouping Update - cant refresh view, no groups have been set");
			}
		} else {

			return false;
		}
	};

	Tabulator.prototype.getGroups = function (values) {

		if (this.modExists("groupRows", true)) {

			return this.modules.groupRows.getGroups(true);
		} else {

			return false;
		}
	};

	// get grouped table data in the same format as getData()

	Tabulator.prototype.getGroupedData = function () {

		if (this.modExists("groupRows", true)) {

			return this.options.groupBy ? this.modules.groupRows.getGroupedData() : this.getData();
		}
	};

	Tabulator.prototype.getEditedCells = function () {

		if (this.modExists("edit", true)) {

			return this.modules.edit.getEditedCells();
		}
	};

	Tabulator.prototype.clearCellEdited = function (cells) {
		var _this33 = this;

		if (this.modExists("edit", true)) {

			if (!cells) {

				cells = this.modules.edit.getEditedCells();
			}

			if (!Array.isArray(cells)) {

				cells = [cells];
			}

			cells.forEach(function (cell) {

				_this33.modules.edit.clearEdited(cell._getSelf());
			});
		}
	};

	///////////////// Column Calculation Functions ///////////////

	Tabulator.prototype.getCalcResults = function () {

		if (this.modExists("columnCalcs", true)) {

			return this.modules.columnCalcs.getResults();
		} else {

			return false;
		}
	};

	Tabulator.prototype.recalc = function () {

		if (this.modExists("columnCalcs", true)) {

			this.modules.columnCalcs.recalcAll(this.rowManager.activeRows);
		}
	};

	/////////////// Navigation Management //////////////


	Tabulator.prototype.navigatePrev = function () {

		var cell = false;

		if (this.modExists("edit", true)) {

			cell = this.modules.edit.currentCell;

			if (cell) {

				return cell.nav().prev();
			}
		}

		return false;
	};

	Tabulator.prototype.navigateNext = function () {

		var cell = false;

		if (this.modExists("edit", true)) {

			cell = this.modules.edit.currentCell;

			if (cell) {

				return cell.nav().next();
			}
		}

		return false;
	};

	Tabulator.prototype.navigateLeft = function () {

		var cell = false;

		if (this.modExists("edit", true)) {

			cell = this.modules.edit.currentCell;

			if (cell) {

				e.preventDefault();

				return cell.nav().left();
			}
		}

		return false;
	};

	Tabulator.prototype.navigateRight = function () {

		var cell = false;

		if (this.modExists("edit", true)) {

			cell = this.modules.edit.currentCell;

			if (cell) {

				e.preventDefault();

				return cell.nav().right();
			}
		}

		return false;
	};

	Tabulator.prototype.navigateUp = function () {

		var cell = false;

		if (this.modExists("edit", true)) {

			cell = this.modules.edit.currentCell;

			if (cell) {

				e.preventDefault();

				return cell.nav().up();
			}
		}

		return false;
	};

	Tabulator.prototype.navigateDown = function () {

		var cell = false;

		if (this.modExists("edit", true)) {

			cell = this.modules.edit.currentCell;

			if (cell) {

				e.preventDefault();

				return cell.nav().down();
			}
		}

		return false;
	};

	/////////////// History Management //////////////

	Tabulator.prototype.undo = function () {

		if (this.options.history && this.modExists("history", true)) {

			return this.modules.history.undo();
		} else {

			return false;
		}
	};

	Tabulator.prototype.redo = function () {

		if (this.options.history && this.modExists("history", true)) {

			return this.modules.history.redo();
		} else {

			return false;
		}
	};

	Tabulator.prototype.getHistoryUndoSize = function () {

		if (this.options.history && this.modExists("history", true)) {

			return this.modules.history.getHistoryUndoSize();
		} else {

			return false;
		}
	};

	Tabulator.prototype.getHistoryRedoSize = function () {

		if (this.options.history && this.modExists("history", true)) {

			return this.modules.history.getHistoryRedoSize();
		} else {

			return false;
		}
	};

	/////////////// Download Management //////////////


	Tabulator.prototype.download = function (type, filename, options, active) {

		if (this.modExists("download", true)) {

			this.modules.download.download(type, filename, options, active);
		}
	};

	Tabulator.prototype.downloadToTab = function (type, filename, options, active) {

		if (this.modExists("download", true)) {

			this.modules.download.download(type, filename, options, active, true);
		}
	};

	/////////// Inter Table Communications ///////////


	Tabulator.prototype.tableComms = function (table, module, action, data) {

		this.modules.comms.receive(table, module, action, data);
	};

	////////////// Extension Management //////////////


	//object to hold module

	Tabulator.prototype.moduleBindings = {};

	//extend module

	Tabulator.prototype.extendModule = function (name, property, values) {

		if (Tabulator.prototype.moduleBindings[name]) {

			var source = Tabulator.prototype.moduleBindings[name].prototype[property];

			if (source) {

				if ((typeof values === 'undefined' ? 'undefined' : _typeof(values)) == "object") {

					for (var key in values) {

						source[key] = values[key];
					}
				} else {

					console.warn("Module Error - Invalid value type, it must be an object");
				}
			} else {

				console.warn("Module Error - property does not exist:", property);
			}
		} else {

			console.warn("Module Error - module does not exist:", name);
		}
	};

	//add module to tabulator

	Tabulator.prototype.registerModule = function (name, module) {

		Tabulator.prototype.moduleBindings[name] = module;
	};

	//ensure that module are bound to instantiated function

	Tabulator.prototype.bindModules = function () {

		this.modules = {};

		for (var name in Tabulator.prototype.moduleBindings) {

			this.modules[name] = new Tabulator.prototype.moduleBindings[name](this);
		}
	};

	//Check for module

	Tabulator.prototype.modExists = function (plugin, required) {

		if (this.modules[plugin]) {

			return true;
		} else {

			if (required) {

				console.error("Tabulator Module Not Installed: " + plugin);
			}

			return false;
		}
	};

	Tabulator.prototype.helpers = {

		elVisible: function elVisible(el) {

			return !(el.offsetWidth <= 0 && el.offsetHeight <= 0);
		},

		elOffset: function elOffset(el) {

			var box = el.getBoundingClientRect();

			return {

				top: box.top + window.pageYOffset - document.documentElement.clientTop,

				left: box.left + window.pageXOffset - document.documentElement.clientLeft

			};
		},

		deepClone: function deepClone(obj) {

			var clone = Array.isArray(obj) ? [] : {};

			for (var i in obj) {

				if (obj[i] != null && _typeof(obj[i]) === "object") {

					if (obj[i] instanceof Date) {

						clone[i] = new Date(obj[i]);
					} else {

						clone[i] = this.deepClone(obj[i]);
					}
				} else {

					clone[i] = obj[i];
				}
			}

			return clone;
		}

	};

	Tabulator.prototype.comms = {

		tables: [],

		register: function register(table) {

			Tabulator.prototype.comms.tables.push(table);
		},

		deregister: function deregister(table) {

			var index = Tabulator.prototype.comms.tables.indexOf(table);

			if (index > -1) {

				Tabulator.prototype.comms.tables.splice(index, 1);
			}
		},

		lookupTable: function lookupTable(query, silent) {

			var results = [],
			    matches,
			    match;

			if (typeof query === "string") {

				matches = document.querySelectorAll(query);

				if (matches.length) {

					for (var i = 0; i < matches.length; i++) {

						match = Tabulator.prototype.comms.matchElement(matches[i]);

						if (match) {

							results.push(match);
						}
					}
				}
			} else if (typeof HTMLElement !== "undefined" && query instanceof HTMLElement || query instanceof Tabulator) {

				match = Tabulator.prototype.comms.matchElement(query);

				if (match) {

					results.push(match);
				}
			} else if (Array.isArray(query)) {

				query.forEach(function (item) {

					results = results.concat(Tabulator.prototype.comms.lookupTable(item));
				});
			} else {

				if (!silent) {

					console.warn("Table Connection Error - Invalid Selector", query);
				}
			}

			return results;
		},

		matchElement: function matchElement(element) {

			return Tabulator.prototype.comms.tables.find(function (table) {

				return element instanceof Tabulator ? table === element : table.element === element;
			});
		}

	};

	Tabulator.prototype.findTable = function (query) {

		var results = Tabulator.prototype.comms.lookupTable(query, true);

		return Array.isArray(results) && !results.length ? false : results;
	};

	var Layout = function Layout(table) {

		this.table = table;

		this.mode = null;
	};

	//initialize layout system


	Layout.prototype.initialize = function (layout) {

		if (this.modes[layout]) {

			this.mode = layout;
		} else {

			console.warn("Layout Error - invalid mode set, defaulting to 'fitData' : " + layout);

			this.mode = 'fitData';
		}

		this.table.element.setAttribute("tabulator-layout", this.mode);
	};

	Layout.prototype.getMode = function () {

		return this.mode;
	};

	//trigger table layout


	Layout.prototype.layout = function () {

		this.modes[this.mode].call(this, this.table.columnManager.columnsByIndex);
	};

	//layout render functions


	Layout.prototype.modes = {

		//resize columns to fit data they contain


		"fitData": function fitData(columns) {

			columns.forEach(function (column) {

				column.reinitializeWidth();
			});

			if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

				this.table.modules.responsiveLayout.update();
			}
		},

		//resize columns to fit data they contain and stretch row to fill table


		"fitDataFill": function fitDataFill(columns) {

			columns.forEach(function (column) {

				column.reinitializeWidth();
			});

			if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

				this.table.modules.responsiveLayout.update();
			}
		},

		//resize columns to fit data they contain


		"fitDataTable": function fitDataTable(columns) {

			columns.forEach(function (column) {

				column.reinitializeWidth();
			});

			if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

				this.table.modules.responsiveLayout.update();
			}
		},

		//resize columns to fit data the contain and stretch last column to fill table


		"fitDataStretch": function fitDataStretch(columns) {
			var _this34 = this;

			var colsWidth = 0,
			    tableWidth = this.table.rowManager.element.clientWidth,
			    gap = 0,
			    lastCol = false;

			columns.forEach(function (column, i) {

				if (!column.widthFixed) {

					column.reinitializeWidth();
				}

				if (_this34.table.options.responsiveLayout ? column.modules.responsive.visible : column.visible) {

					lastCol = column;
				}

				if (column.visible) {

					colsWidth += column.getWidth();
				}
			});

			if (lastCol) {

				gap = tableWidth - colsWidth + lastCol.getWidth();

				if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

					lastCol.setWidth(0);

					this.table.modules.responsiveLayout.update();
				}

				if (gap > 0) {

					lastCol.setWidth(gap);
				} else {

					lastCol.reinitializeWidth();
				}
			} else {

				if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

					this.table.modules.responsiveLayout.update();
				}
			}
		},

		//resize columns to fit


		"fitColumns": function fitColumns(columns) {

			var self = this;

			var totalWidth = self.table.element.clientWidth; //table element width


			var fixedWidth = 0; //total width of columns with a defined width


			var flexWidth = 0; //total width available to flexible columns


			var flexGrowUnits = 0; //total number of widthGrow blocks accross all columns


			var flexColWidth = 0; //desired width of flexible columns


			var flexColumns = []; //array of flexible width columns


			var fixedShrinkColumns = []; //array of fixed width columns that can shrink


			var flexShrinkUnits = 0; //total number of widthShrink blocks accross all columns


			var overflowWidth = 0; //horizontal overflow width


			var gapFill = 0; //number of pixels to be added to final column to close and half pixel gaps


			function calcWidth(width) {

				var colWidth;

				if (typeof width == "string") {

					if (width.indexOf("%") > -1) {

						colWidth = totalWidth / 100 * parseInt(width);
					} else {

						colWidth = parseInt(width);
					}
				} else {

					colWidth = width;
				}

				return colWidth;
			}

			//ensure columns resize to take up the correct amount of space


			function scaleColumns(columns, freeSpace, colWidth, shrinkCols) {

				var oversizeCols = [],
				    oversizeSpace = 0,
				    remainingSpace = 0,
				    nextColWidth = 0,
				    gap = 0,
				    changeUnits = 0,
				    undersizeCols = [];

				function calcGrow(col) {

					return colWidth * (col.column.definition.widthGrow || 1);
				}

				function calcShrink(col) {

					return calcWidth(col.width) - colWidth * (col.column.definition.widthShrink || 0);
				}

				columns.forEach(function (col, i) {

					var width = shrinkCols ? calcShrink(col) : calcGrow(col);

					if (col.column.minWidth >= width) {

						oversizeCols.push(col);
					} else {

						undersizeCols.push(col);

						changeUnits += shrinkCols ? col.column.definition.widthShrink || 1 : col.column.definition.widthGrow || 1;
					}
				});

				if (oversizeCols.length) {

					oversizeCols.forEach(function (col) {

						oversizeSpace += shrinkCols ? col.width - col.column.minWidth : col.column.minWidth;

						col.width = col.column.minWidth;
					});

					remainingSpace = freeSpace - oversizeSpace;

					nextColWidth = changeUnits ? Math.floor(remainingSpace / changeUnits) : remainingSpace;

					gap = remainingSpace - nextColWidth * changeUnits;

					gap += scaleColumns(undersizeCols, remainingSpace, nextColWidth, shrinkCols);
				} else {

					gap = changeUnits ? freeSpace - Math.floor(freeSpace / changeUnits) * changeUnits : freeSpace;

					undersizeCols.forEach(function (column) {

						column.width = shrinkCols ? calcShrink(column) : calcGrow(column);
					});
				}

				return gap;
			}

			if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {

				this.table.modules.responsiveLayout.update();
			}

			//adjust for vertical scrollbar if present


			if (this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight) {

				totalWidth -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth;
			}

			columns.forEach(function (column) {

				var width, minWidth, colWidth;

				if (column.visible) {

					width = column.definition.width;

					minWidth = parseInt(column.minWidth);

					if (width) {

						colWidth = calcWidth(width);

						fixedWidth += colWidth > minWidth ? colWidth : minWidth;

						if (column.definition.widthShrink) {

							fixedShrinkColumns.push({

								column: column,

								width: colWidth > minWidth ? colWidth : minWidth

							});

							flexShrinkUnits += column.definition.widthShrink;
						}
					} else {

						flexColumns.push({

							column: column,

							width: 0

						});

						flexGrowUnits += column.definition.widthGrow || 1;
					}
				}
			});

			//calculate available space


			flexWidth = totalWidth - fixedWidth;

			//calculate correct column size


			flexColWidth = Math.floor(flexWidth / flexGrowUnits);

			//generate column widths


			var gapFill = scaleColumns(flexColumns, flexWidth, flexColWidth, false);

			//increase width of last column to account for rounding errors


			if (flexColumns.length && gapFill > 0) {

				flexColumns[flexColumns.length - 1].width += +gapFill;
			}

			//caculate space for columns to be shrunk into


			flexColumns.forEach(function (col) {

				flexWidth -= col.width;
			});

			overflowWidth = Math.abs(gapFill) + flexWidth;

			//shrink oversize columns if there is no available space


			if (overflowWidth > 0 && flexShrinkUnits) {

				gapFill = scaleColumns(fixedShrinkColumns, overflowWidth, Math.floor(overflowWidth / flexShrinkUnits), true);
			}

			//decrease width of last column to account for rounding errors


			if (fixedShrinkColumns.length) {

				fixedShrinkColumns[fixedShrinkColumns.length - 1].width -= gapFill;
			}

			flexColumns.forEach(function (col) {

				col.column.setWidth(col.width);
			});

			fixedShrinkColumns.forEach(function (col) {

				col.column.setWidth(col.width);
			});
		}

	};

	Tabulator.prototype.registerModule("layout", Layout);

	var Localize = function Localize(table) {

		this.table = table; //hold Tabulator object

		this.locale = "default"; //current locale

		this.lang = false; //current language

		this.bindings = {}; //update events to call when locale is changed
	};

	//set header placehoder

	Localize.prototype.setHeaderFilterPlaceholder = function (placeholder) {

		this.langs.default.headerFilters.default = placeholder;
	};

	//set header filter placeholder by column

	Localize.prototype.setHeaderFilterColumnPlaceholder = function (column, placeholder) {

		this.langs.default.headerFilters.columns[column] = placeholder;

		if (this.lang && !this.lang.headerFilters.columns[column]) {

			this.lang.headerFilters.columns[column] = placeholder;
		}
	};

	//setup a lang description object

	Localize.prototype.installLang = function (locale, lang) {

		if (this.langs[locale]) {

			this._setLangProp(this.langs[locale], lang);
		} else {

			this.langs[locale] = lang;
		}
	};

	Localize.prototype._setLangProp = function (lang, values) {

		for (var key in values) {

			if (lang[key] && _typeof(lang[key]) == "object") {

				this._setLangProp(lang[key], values[key]);
			} else {

				lang[key] = values[key];
			}
		}
	};

	//set current locale

	Localize.prototype.setLocale = function (desiredLocale) {

		var self = this;

		desiredLocale = desiredLocale || "default";

		//fill in any matching languge values

		function traverseLang(trans, path) {

			for (var prop in trans) {

				if (_typeof(trans[prop]) == "object") {

					if (!path[prop]) {

						path[prop] = {};
					}

					traverseLang(trans[prop], path[prop]);
				} else {

					path[prop] = trans[prop];
				}
			}
		}

		//determing correct locale to load

		if (desiredLocale === true && navigator.language) {

			//get local from system

			desiredLocale = navigator.language.toLowerCase();
		}

		if (desiredLocale) {

			//if locale is not set, check for matching top level locale else use default

			if (!self.langs[desiredLocale]) {

				var prefix = desiredLocale.split("-")[0];

				if (self.langs[prefix]) {

					console.warn("Localization Error - Exact matching locale not found, using closest match: ", desiredLocale, prefix);

					desiredLocale = prefix;
				} else {

					console.warn("Localization Error - Matching locale not found, using default: ", desiredLocale);

					desiredLocale = "default";
				}
			}
		}

		self.locale = desiredLocale;

		//load default lang template

		self.lang = Tabulator.prototype.helpers.deepClone(self.langs.default || {});

		if (desiredLocale != "default") {

			traverseLang(self.langs[desiredLocale], self.lang);
		}

		self.table.options.localized.call(self.table, self.locale, self.lang);

		self._executeBindings();
	};

	//get current locale

	Localize.prototype.getLocale = function (locale) {

		return self.locale;
	};

	//get lang object for given local or current if none provided

	Localize.prototype.getLang = function (locale) {

		return locale ? this.langs[locale] : this.lang;
	};

	//get text for current locale

	Localize.prototype.getText = function (path, value) {

		var path = value ? path + "|" + value : path,
		    pathArray = path.split("|"),
		    text = this._getLangElement(pathArray, this.locale);

		// if(text === false){

		// 	console.warn("Localization Error - Matching localized text not found for given path: ", path);

		// }


		return text || "";
	};

	//traverse langs object and find localized copy

	Localize.prototype._getLangElement = function (path, locale) {

		var self = this;

		var root = self.lang;

		path.forEach(function (level) {

			var rootPath;

			if (root) {

				rootPath = root[level];

				if (typeof rootPath != "undefined") {

					root = rootPath;
				} else {

					root = false;
				}
			}
		});

		return root;
	};

	//set update binding

	Localize.prototype.bind = function (path, callback) {

		if (!this.bindings[path]) {

			this.bindings[path] = [];
		}

		this.bindings[path].push(callback);

		callback(this.getText(path), this.lang);
	};

	//itterate through bindings and trigger updates

	Localize.prototype._executeBindings = function () {

		var self = this;

		var _loop = function _loop(path) {

			self.bindings[path].forEach(function (binding) {

				binding(self.getText(path), self.lang);
			});
		};

		for (var path in self.bindings) {
			_loop(path);
		}
	};

	//Localized text listings

	Localize.prototype.langs = {

		"default": { //hold default locale text

			"groups": {

				"item": "item",

				"items": "items"

			},

			"columns": {},

			"ajax": {

				"loading": "Loading",

				"error": "Error"

			},

			"pagination": {

				"page_size": "Page Size",

				"page_title": "Show Page",

				"first": "First",

				"first_title": "First Page",

				"last": "Last",

				"last_title": "Last Page",

				"prev": "Prev",

				"prev_title": "Prev Page",

				"next": "Next",

				"next_title": "Next Page",

				"all": "All"

			},

			"headerFilters": {

				"default": "filter column...",

				"columns": {}

			}

		}

	};

	Tabulator.prototype.registerModule("localize", Localize);

	var Comms = function Comms(table) {

		this.table = table;
	};

	Comms.prototype.getConnections = function (selectors) {

		var self = this,
		    connections = [],
		    connection;

		connection = Tabulator.prototype.comms.lookupTable(selectors);

		connection.forEach(function (con) {

			if (self.table !== con) {

				connections.push(con);
			}
		});

		return connections;
	};

	Comms.prototype.send = function (selectors, module, action, data) {

		var self = this,
		    connections = this.getConnections(selectors);

		connections.forEach(function (connection) {

			connection.tableComms(self.table.element, module, action, data);
		});

		if (!connections.length && selectors) {

			console.warn("Table Connection Error - No tables matching selector found", selectors);
		}
	};

	Comms.prototype.receive = function (table, module, action, data) {

		if (this.table.modExists(module)) {

			return this.table.modules[module].commsReceived(table, action, data);
		} else {

			console.warn("Inter-table Comms Error - no such module:", module);
		}
	};

	Tabulator.prototype.registerModule("comms", Comms);

	var Accessor = function Accessor(table) {
		this.table = table; //hold Tabulator object
		this.allowedTypes = ["", "data", "download", "clipboard", "print", "htmlOutput"]; //list of accessor types
	};

	//initialize column accessor
	Accessor.prototype.initializeColumn = function (column) {
		var self = this,
		    match = false,
		    config = {};

		this.allowedTypes.forEach(function (type) {
			var key = "accessor" + (type.charAt(0).toUpperCase() + type.slice(1)),
			    accessor;

			if (column.definition[key]) {
				accessor = self.lookupAccessor(column.definition[key]);

				if (accessor) {
					match = true;

					config[key] = {
						accessor: accessor,
						params: column.definition[key + "Params"] || {}
					};
				}
			}
		});

		if (match) {
			column.modules.accessor = config;
		}
	};

	Accessor.prototype.lookupAccessor = function (value) {
		var accessor = false;

		//set column accessor
		switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
			case "string":
				if (this.accessors[value]) {
					accessor = this.accessors[value];
				} else {
					console.warn("Accessor Error - No such accessor found, ignoring: ", value);
				}
				break;

			case "function":
				accessor = value;
				break;
		}

		return accessor;
	};

	//apply accessor to row
	Accessor.prototype.transformRow = function (dataIn, type) {
		var self = this,
		    key = "accessor" + (type.charAt(0).toUpperCase() + type.slice(1));

		//clone data object with deep copy to isolate internal data from returned result
		var data = Tabulator.prototype.helpers.deepClone(dataIn || {});

		self.table.columnManager.traverse(function (column) {
			var value, accessor, params, component;

			if (column.modules.accessor) {

				accessor = column.modules.accessor[key] || column.modules.accessor.accessor || false;

				if (accessor) {
					value = column.getFieldValue(data);

					if (value != "undefined") {
						component = column.getComponent();
						params = typeof accessor.params === "function" ? accessor.params(value, data, type, component) : accessor.params;
						column.setFieldValue(data, accessor.accessor(value, data, type, params, component));
					}
				}
			}
		});

		return data;
	},

	//default accessors
	Accessor.prototype.accessors = {};

	Tabulator.prototype.registerModule("accessor", Accessor);
	var Ajax = function Ajax(table) {

		this.table = table; //hold Tabulator object
		this.config = false; //hold config object for ajax request
		this.url = ""; //request URL
		this.urlGenerator = false;
		this.params = false; //request parameters

		this.loaderElement = this.createLoaderElement(); //loader message div
		this.msgElement = this.createMsgElement(); //message element
		this.loadingElement = false;
		this.errorElement = false;
		this.loaderPromise = false;

		this.progressiveLoad = false;
		this.loading = false;

		this.requestOrder = 0; //prevent requests comming out of sequence if overridden by another load request
	};

	//initialize setup options
	Ajax.prototype.initialize = function () {
		var template;

		this.loaderElement.appendChild(this.msgElement);

		if (this.table.options.ajaxLoaderLoading) {
			if (typeof this.table.options.ajaxLoaderLoading == "string") {
				template = document.createElement('template');
				template.innerHTML = this.table.options.ajaxLoaderLoading.trim();
				this.loadingElement = template.content.firstChild;
			} else {
				this.loadingElement = this.table.options.ajaxLoaderLoading;
			}
		}

		this.loaderPromise = this.table.options.ajaxRequestFunc || this.defaultLoaderPromise;

		this.urlGenerator = this.table.options.ajaxURLGenerator || this.defaultURLGenerator;

		if (this.table.options.ajaxLoaderError) {
			if (typeof this.table.options.ajaxLoaderError == "string") {
				template = document.createElement('template');
				template.innerHTML = this.table.options.ajaxLoaderError.trim();
				this.errorElement = template.content.firstChild;
			} else {
				this.errorElement = this.table.options.ajaxLoaderError;
			}
		}

		if (this.table.options.ajaxParams) {
			this.setParams(this.table.options.ajaxParams);
		}

		if (this.table.options.ajaxConfig) {
			this.setConfig(this.table.options.ajaxConfig);
		}

		if (this.table.options.ajaxURL) {
			this.setUrl(this.table.options.ajaxURL);
		}

		if (this.table.options.ajaxProgressiveLoad) {
			if (this.table.options.pagination) {
				this.progressiveLoad = false;
				console.error("Progressive Load Error - Pagination and progressive load cannot be used at the same time");
			} else {
				if (this.table.modExists("page")) {
					this.progressiveLoad = this.table.options.ajaxProgressiveLoad;
					this.table.modules.page.initializeProgressive(this.progressiveLoad);
				} else {
					console.error("Pagination plugin is required for progressive ajax loading");
				}
			}
		}
	};

	Ajax.prototype.createLoaderElement = function () {
		var el = document.createElement("div");
		el.classList.add("tabulator-loader");
		return el;
	};

	Ajax.prototype.createMsgElement = function () {
		var el = document.createElement("div");

		el.classList.add("tabulator-loader-msg");
		el.setAttribute("role", "alert");

		return el;
	};

	//set ajax params
	Ajax.prototype.setParams = function (params, update) {
		if (update) {
			this.params = this.params || {};

			for (var key in params) {
				this.params[key] = params[key];
			}
		} else {
			this.params = params;
		}
	};

	Ajax.prototype.getParams = function () {
		return this.params || {};
	};

	//load config object
	Ajax.prototype.setConfig = function (config) {
		this._loadDefaultConfig();

		if (typeof config == "string") {
			this.config.method = config;
		} else {
			for (var key in config) {
				this.config[key] = config[key];
			}
		}
	};

	//create config object from default
	Ajax.prototype._loadDefaultConfig = function (force) {
		var self = this;
		if (!self.config || force) {

			self.config = {};

			//load base config from defaults
			for (var key in self.defaultConfig) {
				self.config[key] = self.defaultConfig[key];
			}
		}
	};

	//set request url
	Ajax.prototype.setUrl = function (url) {
		this.url = url;
	};

	//get request url
	Ajax.prototype.getUrl = function () {
		return this.url;
	};

	//lstandard loading function
	Ajax.prototype.loadData = function (inPosition, columnsChanged) {

		if (this.progressiveLoad) {
			return this._loadDataProgressive();
		} else {
			return this._loadDataStandard(inPosition, columnsChanged);
		}
	};

	Ajax.prototype.nextPage = function (diff) {
		var margin;

		if (!this.loading) {

			margin = this.table.options.ajaxProgressiveLoadScrollMargin || this.table.rowManager.getElement().clientHeight * 2;

			if (diff < margin) {
				this.table.modules.page.nextPage().then(function () {}).catch(function () {});
			}
		}
	};

	Ajax.prototype.blockActiveRequest = function () {
		this.requestOrder++;
	};

	Ajax.prototype._loadDataProgressive = function () {
		this.table.rowManager.setData([]);
		return this.table.modules.page.setPage(1);
	};

	Ajax.prototype._loadDataStandard = function (inPosition, columnsChanged) {
		var _this35 = this;

		return new Promise(function (resolve, reject) {
			_this35.sendRequest(inPosition).then(function (data) {
				_this35.table.rowManager.setData(data, inPosition, columnsChanged).then(function () {
					resolve();
				}).catch(function (e) {
					reject(e);
				});
			}).catch(function (e) {
				reject(e);
			});
		});
	};

	Ajax.prototype.generateParamsList = function (data, prefix) {
		var self = this,
		    output = [];

		prefix = prefix || "";

		if (Array.isArray(data)) {
			data.forEach(function (item, i) {
				output = output.concat(self.generateParamsList(item, prefix ? prefix + "[" + i + "]" : i));
			});
		} else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === "object") {
			for (var key in data) {
				output = output.concat(self.generateParamsList(data[key], prefix ? prefix + "[" + key + "]" : key));
			}
		} else {
			output.push({ key: prefix, value: data });
		}

		return output;
	};

	Ajax.prototype.serializeParams = function (params) {
		var output = this.generateParamsList(params),
		    encoded = [];

		output.forEach(function (item) {
			encoded.push(encodeURIComponent(item.key) + "=" + encodeURIComponent(item.value));
		});

		return encoded.join("&");
	};

	//send ajax request
	Ajax.prototype.sendRequest = function (silent) {
		var _this36 = this;

		var self = this,
		    url = self.url,
		    requestNo;

		self.requestOrder++;
		requestNo = self.requestOrder;

		self._loadDefaultConfig();

		return new Promise(function (resolve, reject) {
			if (self.table.options.ajaxRequesting.call(_this36.table, self.url, self.params) !== false) {

				self.loading = true;

				if (!silent) {
					self.showLoader();
				}

				_this36.loaderPromise(url, self.config, self.params).then(function (data) {
					if (requestNo === self.requestOrder) {
						if (self.table.options.ajaxResponse) {
							data = self.table.options.ajaxResponse.call(self.table, self.url, self.params, data);
						}
						resolve(data);

						self.hideLoader();
						self.loading = false;
					} else {
						console.warn("Ajax Response Blocked - An active ajax request was blocked by an attempt to change table data while the request was being made");
					}
				}).catch(function (error) {
					console.error("Ajax Load Error: ", error);
					self.table.options.ajaxError.call(self.table, error);

					self.showError();

					setTimeout(function () {
						self.hideLoader();
					}, 3000);

					self.loading = false;

					reject();
				});
			} else {
				reject();
			}
		});
	};

	Ajax.prototype.showLoader = function () {
		var shouldLoad = typeof this.table.options.ajaxLoader === "function" ? this.table.options.ajaxLoader() : this.table.options.ajaxLoader;

		if (shouldLoad) {

			this.hideLoader();

			while (this.msgElement.firstChild) {
				this.msgElement.removeChild(this.msgElement.firstChild);
			}this.msgElement.classList.remove("tabulator-error");
			this.msgElement.classList.add("tabulator-loading");

			if (this.loadingElement) {
				this.msgElement.appendChild(this.loadingElement);
			} else {
				this.msgElement.innerHTML = this.table.modules.localize.getText("ajax|loading");
			}

			this.table.element.appendChild(this.loaderElement);
		}
	};

	Ajax.prototype.showError = function () {
		this.hideLoader();

		while (this.msgElement.firstChild) {
			this.msgElement.removeChild(this.msgElement.firstChild);
		}this.msgElement.classList.remove("tabulator-loading");
		this.msgElement.classList.add("tabulator-error");

		if (this.errorElement) {
			this.msgElement.appendChild(this.errorElement);
		} else {
			this.msgElement.innerHTML = this.table.modules.localize.getText("ajax|error");
		}

		this.table.element.appendChild(this.loaderElement);
	};

	Ajax.prototype.hideLoader = function () {
		if (this.loaderElement.parentNode) {
			this.loaderElement.parentNode.removeChild(this.loaderElement);
		}
	};

	//default ajax config object
	Ajax.prototype.defaultConfig = {
		method: "GET"
	};

	Ajax.prototype.defaultURLGenerator = function (url, config, params) {

		if (url) {
			if (params && Object.keys(params).length) {
				if (!config.method || config.method.toLowerCase() == "get") {
					config.method = "get";

					url += (url.includes("?") ? "&" : "?") + this.serializeParams(params);
				}
			}
		}

		return url;
	};

	Ajax.prototype.defaultLoaderPromise = function (url, config, params) {
		var self = this,
		    contentType;

		return new Promise(function (resolve, reject) {

			//set url
			url = self.urlGenerator(url, config, params);

			//set body content if not GET request
			if (config.method.toUpperCase() != "GET") {
				contentType = _typeof(self.table.options.ajaxContentType) === "object" ? self.table.options.ajaxContentType : self.contentTypeFormatters[self.table.options.ajaxContentType];
				if (contentType) {

					for (var key in contentType.headers) {
						if (!config.headers) {
							config.headers = {};
						}

						if (typeof config.headers[key] === "undefined") {
							config.headers[key] = contentType.headers[key];
						}
					}

					config.body = contentType.body.call(self, url, config, params);
				} else {
					console.warn("Ajax Error - Invalid ajaxContentType value:", self.table.options.ajaxContentType);
				}
			}

			if (url) {

				//configure headers
				if (typeof config.headers === "undefined") {
					config.headers = {};
				}

				if (typeof config.headers.Accept === "undefined") {
					config.headers.Accept = "application/json";
				}

				if (typeof config.headers["X-Requested-With"] === "undefined") {
					config.headers["X-Requested-With"] = "XMLHttpRequest";
				}

				if (typeof config.mode === "undefined") {
					config.mode = "cors";
				}

				if (config.mode == "cors") {

					if (typeof config.headers["Access-Control-Allow-Origin"] === "undefined") {
						config.headers["Access-Control-Allow-Origin"] = window.location.origin;
					}

					if (typeof config.credentials === "undefined") {
						config.credentials = 'same-origin';
					}
				} else {
					if (typeof config.credentials === "undefined") {
						config.credentials = 'include';
					}
				}

				//send request
				fetch(url, config).then(function (response) {
					if (response.ok) {
						response.json().then(function (data) {
							resolve(data);
						}).catch(function (error) {
							reject(error);
							console.warn("Ajax Load Error - Invalid JSON returned", error);
						});
					} else {
						console.error("Ajax Load Error - Connection Error: " + response.status, response.statusText);
						reject(response);
					}
				}).catch(function (error) {
					console.error("Ajax Load Error - Connection Error: ", error);
					reject(error);
				});
			} else {
				console.warn("Ajax Load Error - No URL Set");
				resolve([]);
			}
		});
	};

	Ajax.prototype.contentTypeFormatters = {
		"json": {
			headers: {
				'Content-Type': 'application/json'
			},
			body: function body(url, config, params) {
				return JSON.stringify(params);
			}
		},
		"form": {
			headers: {},
			body: function body(url, config, params) {
				var output = this.generateParamsList(params),
				    form = new FormData();

				output.forEach(function (item) {
					form.append(item.key, item.value);
				});

				return form;
			}
		}
	};

	Tabulator.prototype.registerModule("ajax", Ajax);

	var ColumnCalcs = function ColumnCalcs(table) {
		this.table = table; //hold Tabulator object
		this.topCalcs = [];
		this.botCalcs = [];
		this.genColumn = false;
		this.topElement = this.createElement();
		this.botElement = this.createElement();
		this.topRow = false;
		this.botRow = false;
		this.topInitialized = false;
		this.botInitialized = false;

		this.initialize();
	};

	ColumnCalcs.prototype.createElement = function () {
		var el = document.createElement("div");
		el.classList.add("tabulator-calcs-holder");
		return el;
	};

	ColumnCalcs.prototype.initialize = function () {
		this.genColumn = new Column({ field: "value" }, this);
	};

	//dummy functions to handle being mock column manager
	ColumnCalcs.prototype.registerColumnField = function () {};

	//initialize column calcs
	ColumnCalcs.prototype.initializeColumn = function (column) {
		var def = column.definition;

		var config = {
			topCalcParams: def.topCalcParams || {},
			botCalcParams: def.bottomCalcParams || {}
		};

		if (def.topCalc) {

			switch (_typeof(def.topCalc)) {
				case "string":
					if (this.calculations[def.topCalc]) {
						config.topCalc = this.calculations[def.topCalc];
					} else {
						console.warn("Column Calc Error - No such calculation found, ignoring: ", def.topCalc);
					}
					break;

				case "function":
					config.topCalc = def.topCalc;
					break;

			}

			if (config.topCalc) {
				column.modules.columnCalcs = config;
				this.topCalcs.push(column);

				if (this.table.options.columnCalcs != "group") {
					this.initializeTopRow();
				}
			}
		}

		if (def.bottomCalc) {
			switch (_typeof(def.bottomCalc)) {
				case "string":
					if (this.calculations[def.bottomCalc]) {
						config.botCalc = this.calculations[def.bottomCalc];
					} else {
						console.warn("Column Calc Error - No such calculation found, ignoring: ", def.bottomCalc);
					}
					break;

				case "function":
					config.botCalc = def.bottomCalc;
					break;

			}

			if (config.botCalc) {
				column.modules.columnCalcs = config;
				this.botCalcs.push(column);

				if (this.table.options.columnCalcs != "group") {
					this.initializeBottomRow();
				}
			}
		}
	};

	ColumnCalcs.prototype.removeCalcs = function () {
		var changed = false;

		if (this.topInitialized) {
			this.topInitialized = false;
			this.topElement.parentNode.removeChild(this.topElement);
			changed = true;
		}

		if (this.botInitialized) {
			this.botInitialized = false;
			this.table.footerManager.remove(this.botElement);
			changed = true;
		}

		if (changed) {
			this.table.rowManager.adjustTableSize();
		}
	};

	ColumnCalcs.prototype.initializeTopRow = function () {
		if (!this.topInitialized) {
			// this.table.columnManager.headersElement.after(this.topElement);
			this.table.columnManager.getElement().insertBefore(this.topElement, this.table.columnManager.headersElement.nextSibling);
			this.topInitialized = true;
		}
	};

	ColumnCalcs.prototype.initializeBottomRow = function () {
		if (!this.botInitialized) {
			this.table.footerManager.prepend(this.botElement);
			this.botInitialized = true;
		}
	};

	ColumnCalcs.prototype.scrollHorizontal = function (left) {
		var scrollWidth = this.table.columnManager.getElement().scrollWidth - this.table.element.clientWidth;

		if (this.botInitialized) {
			this.botRow.getElement().style.marginLeft = -left + "px";
		}
	};

	ColumnCalcs.prototype.recalc = function (rows) {
		var data, row;

		if (this.topInitialized || this.botInitialized) {
			data = this.rowsToData(rows);

			if (this.topInitialized) {
				if (this.topRow) {
					this.topRow.deleteCells();
				}

				row = this.generateRow("top", this.rowsToData(rows));
				this.topRow = row;
				while (this.topElement.firstChild) {
					this.topElement.removeChild(this.topElement.firstChild);
				}this.topElement.appendChild(row.getElement());
				row.initialize(true);
			}

			if (this.botInitialized) {
				if (this.botRow) {
					this.botRow.deleteCells();
				}

				row = this.generateRow("bottom", this.rowsToData(rows));
				this.botRow = row;
				while (this.botElement.firstChild) {
					this.botElement.removeChild(this.botElement.firstChild);
				}this.botElement.appendChild(row.getElement());
				row.initialize(true);
			}

			this.table.rowManager.adjustTableSize();

			//set resizable handles
			if (this.table.modExists("frozenColumns")) {
				this.table.modules.frozenColumns.layout();
			}
		}
	};

	ColumnCalcs.prototype.recalcRowGroup = function (row) {
		this.recalcGroup(this.table.modules.groupRows.getRowGroup(row));
	};

	ColumnCalcs.prototype.recalcAll = function () {
		var _this37 = this;

		if (this.topCalcs.length || this.botCalcs.length) {
			if (this.table.options.columnCalcs !== "group") {
				this.recalc(this.table.rowManager.activeRows);
			}

			if (this.table.options.groupBy && this.table.options.columnCalcs !== "table") {

				var groups = table.modules.groupRows.getChildGroups();

				groups.forEach(function (group) {
					_this37.recalcGroup(group);
				});
			}
		}
	};

	ColumnCalcs.prototype.recalcGroup = function (group) {
		var data, rowData;

		if (group) {
			if (group.calcs) {
				if (group.calcs.bottom) {
					data = this.rowsToData(group.rows);
					rowData = this.generateRowData("bottom", data);

					group.calcs.bottom.updateData(rowData);
					group.calcs.bottom.reinitialize();
				}

				if (group.calcs.top) {
					data = this.rowsToData(group.rows);
					rowData = this.generateRowData("top", data);

					group.calcs.top.updateData(rowData);
					group.calcs.top.reinitialize();
				}
			}
		}
	};

	//generate top stats row
	ColumnCalcs.prototype.generateTopRow = function (rows) {
		return this.generateRow("top", this.rowsToData(rows));
	};
	//generate bottom stats row
	ColumnCalcs.prototype.generateBottomRow = function (rows) {
		return this.generateRow("bottom", this.rowsToData(rows));
	};

	ColumnCalcs.prototype.rowsToData = function (rows) {
		var _this38 = this;

		var data = [];

		rows.forEach(function (row) {
			data.push(row.getData());

			if (_this38.table.options.dataTree && _this38.table.options.dataTreeChildColumnCalcs) {
				if (row.modules.dataTree.open) {
					var children = _this38.rowsToData(_this38.table.modules.dataTree.getFilteredTreeChildren(row));
					data = data.concat(children);
				}
			}
		});

		return data;
	};

	//generate stats row
	ColumnCalcs.prototype.generateRow = function (pos, data) {
		var self = this,
		    rowData = this.generateRowData(pos, data),
		    row;

		if (self.table.modExists("mutator")) {
			self.table.modules.mutator.disable();
		}

		row = new Row(rowData, this, "calc");

		if (self.table.modExists("mutator")) {
			self.table.modules.mutator.enable();
		}

		row.getElement().classList.add("tabulator-calcs", "tabulator-calcs-" + pos);

		row.generateCells = function () {

			var cells = [];

			self.table.columnManager.columnsByIndex.forEach(function (column) {

				//set field name of mock column
				self.genColumn.setField(column.getField());
				self.genColumn.hozAlign = column.hozAlign;

				if (column.definition[pos + "CalcFormatter"] && self.table.modExists("format")) {

					self.genColumn.modules.format = {
						formatter: self.table.modules.format.getFormatter(column.definition[pos + "CalcFormatter"]),
						params: column.definition[pos + "CalcFormatterParams"]
					};
				} else {
					self.genColumn.modules.format = {
						formatter: self.table.modules.format.getFormatter("plaintext"),
						params: {}
					};
				}

				//ensure css class defintion is replicated to calculation cell
				self.genColumn.definition.cssClass = column.definition.cssClass;

				//generate cell and assign to correct column
				var cell = new Cell(self.genColumn, row);
				cell.column = column;
				cell.setWidth();

				column.cells.push(cell);
				cells.push(cell);

				if (!column.visible) {
					cell.hide();
				}
			});

			this.cells = cells;
		};

		return row;
	};

	//generate stats row
	ColumnCalcs.prototype.generateRowData = function (pos, data) {
		var rowData = {},
		    calcs = pos == "top" ? this.topCalcs : this.botCalcs,
		    type = pos == "top" ? "topCalc" : "botCalc",
		    params,
		    paramKey;

		calcs.forEach(function (column) {
			var values = [];

			if (column.modules.columnCalcs && column.modules.columnCalcs[type]) {
				data.forEach(function (item) {
					values.push(column.getFieldValue(item));
				});

				paramKey = type + "Params";
				params = typeof column.modules.columnCalcs[paramKey] === "function" ? column.modules.columnCalcs[paramKey](values, data) : column.modules.columnCalcs[paramKey];

				column.setFieldValue(rowData, column.modules.columnCalcs[type](values, data, params));
			}
		});

		return rowData;
	};

	ColumnCalcs.prototype.hasTopCalcs = function () {
		return !!this.topCalcs.length;
	};

	ColumnCalcs.prototype.hasBottomCalcs = function () {
		return !!this.botCalcs.length;
	};

	//handle table redraw
	ColumnCalcs.prototype.redraw = function () {
		if (this.topRow) {
			this.topRow.normalizeHeight(true);
		}
		if (this.botRow) {
			this.botRow.normalizeHeight(true);
		}
	};

	//return the calculated
	ColumnCalcs.prototype.getResults = function () {
		var self = this,
		    results = {},
		    groups;

		if (this.table.options.groupBy && this.table.modExists("groupRows")) {
			groups = this.table.modules.groupRows.getGroups(true);

			groups.forEach(function (group) {
				results[group.getKey()] = self.getGroupResults(group);
			});
		} else {
			results = {
				top: this.topRow ? this.topRow.getData() : {},
				bottom: this.botRow ? this.botRow.getData() : {}
			};
		}

		return results;
	};

	//get results from a group
	ColumnCalcs.prototype.getGroupResults = function (group) {
		var self = this,
		    groupObj = group._getSelf(),
		    subGroups = group.getSubGroups(),
		    subGroupResults = {},
		    results = {};

		subGroups.forEach(function (subgroup) {
			subGroupResults[subgroup.getKey()] = self.getGroupResults(subgroup);
		});

		results = {
			top: groupObj.calcs.top ? groupObj.calcs.top.getData() : {},
			bottom: groupObj.calcs.bottom ? groupObj.calcs.bottom.getData() : {},
			groups: subGroupResults
		};

		return results;
	};

	//default calculations
	ColumnCalcs.prototype.calculations = {
		"avg": function avg(values, data, calcParams) {
			var output = 0,
			    precision = typeof calcParams.precision !== "undefined" ? calcParams.precision : 2;

			if (values.length) {
				output = values.reduce(function (sum, value) {
					value = Number(value);
					return sum + value;
				});

				output = output / values.length;

				output = precision !== false ? output.toFixed(precision) : output;
			}

			return parseFloat(output).toString();
		},
		"max": function max(values, data, calcParams) {
			var output = null,
			    precision = typeof calcParams.precision !== "undefined" ? calcParams.precision : false;

			values.forEach(function (value) {

				value = Number(value);

				if (value > output || output === null) {
					output = value;
				}
			});

			return output !== null ? precision !== false ? output.toFixed(precision) : output : "";
		},
		"min": function min(values, data, calcParams) {
			var output = null,
			    precision = typeof calcParams.precision !== "undefined" ? calcParams.precision : false;

			values.forEach(function (value) {

				value = Number(value);

				if (value < output || output === null) {
					output = value;
				}
			});

			return output !== null ? precision !== false ? output.toFixed(precision) : output : "";
		},
		"sum": function sum(values, data, calcParams) {
			var output = 0,
			    precision = typeof calcParams.precision !== "undefined" ? calcParams.precision : false;

			if (values.length) {
				values.forEach(function (value) {
					value = Number(value);

					output += !isNaN(value) ? Number(value) : 0;
				});
			}

			return precision !== false ? output.toFixed(precision) : output;
		},
		"concat": function concat(values, data, calcParams) {
			var output = 0;

			if (values.length) {
				output = values.reduce(function (sum, value) {
					return String(sum) + String(value);
				});
			}

			return output;
		},
		"count": function count(values, data, calcParams) {
			var output = 0;

			if (values.length) {
				values.forEach(function (value) {
					if (value) {
						output++;
					}
				});
			}

			return output;
		}
	};

	Tabulator.prototype.registerModule("columnCalcs", ColumnCalcs);

	var Clipboard = function Clipboard(table) {
		this.table = table;
		this.mode = true;

		this.pasteParser = function () {};
		this.pasteAction = function () {};
		this.customSelection = false;
		this.rowRange = false;
		this.blocked = true; //block copy actions not originating from this command
	};

	Clipboard.prototype.initialize = function () {
		var _this39 = this;

		this.mode = this.table.options.clipboard;

		this.rowRange = this.table.options.clipboardCopyRowRange;

		if (this.mode === true || this.mode === "copy") {
			this.table.element.addEventListener("copy", function (e) {
				var plain, html, list;

				if (!_this39.blocked) {
					e.preventDefault();

					if (_this39.customSelection) {
						plain = _this39.customSelection;

						if (_this39.table.options.clipboardCopyFormatter) {
							plain = _this39.table.options.clipboardCopyFormatter("plain", plain);
						}
					} else {

						var list = _this39.table.modules.export.generateExportList(_this39.rowRange, _this39.table.options.clipboardCopyStyled, _this39.table.options.clipboardCopyConfig, "clipboard");

						html = _this39.table.modules.export.genereateHTMLTable(list);
						plain = html ? _this39.generatePlainContent(list) : "";

						if (_this39.table.options.clipboardCopyFormatter) {
							plain = _this39.table.options.clipboardCopyFormatter("plain", plain);
							html = _this39.table.options.clipboardCopyFormatter("html", html);
						}
					}

					if (window.clipboardData && window.clipboardData.setData) {
						window.clipboardData.setData('Text', plain);
					} else if (e.clipboardData && e.clipboardData.setData) {
						e.clipboardData.setData('text/plain', plain);
						if (html) {
							e.clipboardData.setData('text/html', html);
						}
					} else if (e.originalEvent && e.originalEvent.clipboardData.setData) {
						e.originalEvent.clipboardData.setData('text/plain', plain);
						if (html) {
							e.originalEvent.clipboardData.setData('text/html', html);
						}
					}

					_this39.table.options.clipboardCopied.call(_this39.table, plain, html);

					_this39.reset();
				}
			});
		}

		if (this.mode === true || this.mode === "paste") {
			this.table.element.addEventListener("paste", function (e) {
				_this39.paste(e);
			});
		}

		this.setPasteParser(this.table.options.clipboardPasteParser);
		this.setPasteAction(this.table.options.clipboardPasteAction);
	};

	Clipboard.prototype.reset = function () {
		this.blocked = false;
		this.originalSelectionText = "";
	};

	Clipboard.prototype.generatePlainContent = function (list) {
		var output = [];

		list.forEach(function (row) {
			var rowData = [];

			row.columns.forEach(function (col) {
				var value = "";

				if (col) {

					if (row.type === "group") {
						col.value = col.component.getKey();
					}

					switch (_typeof(col.value)) {
						case "object":
							value = JSON.stringify(col.value);
							break;

						case "undefined":
						case "null":
							value = "";
							break;

						default:
							value = col.value;
					}
				}

				rowData.push(value);
			});

			output.push(rowData.join("\t"));
		});

		return output.join("\n");
	};

	Clipboard.prototype.copy = function (range, internal) {
		var range, sel, textRange;
		this.blocked = false;
		this.customSelection = false;

		if (this.mode === true || this.mode === "copy") {

			this.rowRange = range || this.table.options.clipboardCopyRowRange;

			if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
				range = document.createRange();
				range.selectNodeContents(this.table.element);
				sel = window.getSelection();

				if (sel.toString() && internal) {
					this.customSelection = sel.toString();
				}

				sel.removeAllRanges();
				sel.addRange(range);
			} else if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
				textRange = document.body.createTextRange();
				textRange.moveToElementText(this.table.element);
				textRange.select();
			}

			document.execCommand('copy');

			if (sel) {
				sel.removeAllRanges();
			}
		}
	};

	//PASTE EVENT HANDLING

	Clipboard.prototype.setPasteAction = function (action) {

		switch (typeof action === 'undefined' ? 'undefined' : _typeof(action)) {
			case "string":
				this.pasteAction = this.pasteActions[action];

				if (!this.pasteAction) {
					console.warn("Clipboard Error - No such paste action found:", action);
				}
				break;

			case "function":
				this.pasteAction = action;
				break;
		}
	};

	Clipboard.prototype.setPasteParser = function (parser) {
		switch (typeof parser === 'undefined' ? 'undefined' : _typeof(parser)) {
			case "string":
				this.pasteParser = this.pasteParsers[parser];

				if (!this.pasteParser) {
					console.warn("Clipboard Error - No such paste parser found:", parser);
				}
				break;

			case "function":
				this.pasteParser = parser;
				break;
		}
	};

	Clipboard.prototype.paste = function (e) {
		var data, rowData, rows;

		if (this.checkPaseOrigin(e)) {

			data = this.getPasteData(e);

			rowData = this.pasteParser.call(this, data);

			if (rowData) {
				e.preventDefault();

				if (this.table.modExists("mutator")) {
					rowData = this.mutateData(rowData);
				}

				rows = this.pasteAction.call(this, rowData);
				this.table.options.clipboardPasted.call(this.table, data, rowData, rows);
			} else {
				this.table.options.clipboardPasteError.call(this.table, data);
			}
		}
	};

	Clipboard.prototype.mutateData = function (data) {
		var self = this,
		    output = [];

		if (Array.isArray(data)) {
			data.forEach(function (row) {
				output.push(self.table.modules.mutator.transformRow(row, "clipboard"));
			});
		} else {
			output = data;
		}

		return output;
	};

	Clipboard.prototype.checkPaseOrigin = function (e) {
		var valid = true;

		if (e.target.tagName != "DIV" || this.table.modules.edit.currentCell) {
			valid = false;
		}

		return valid;
	};

	Clipboard.prototype.getPasteData = function (e) {
		var data;

		if (window.clipboardData && window.clipboardData.getData) {
			data = window.clipboardData.getData('Text');
		} else if (e.clipboardData && e.clipboardData.getData) {
			data = e.clipboardData.getData('text/plain');
		} else if (e.originalEvent && e.originalEvent.clipboardData.getData) {
			data = e.originalEvent.clipboardData.getData('text/plain');
		}

		return data;
	};

	Clipboard.prototype.pasteParsers = {
		table: function table(clipboard) {
			var data = [],
			    headerFindSuccess = true,
			    columns = this.table.columnManager.columns,
			    columnMap = [],
			    rows = [];

			//get data from clipboard into array of columns and rows.
			clipboard = clipboard.split("\n");

			clipboard.forEach(function (row) {
				data.push(row.split("\t"));
			});

			if (data.length && !(data.length === 1 && data[0].length < 2)) {

				//check if headers are present by title
				data[0].forEach(function (value) {
					var column = columns.find(function (column) {
						return value && column.definition.title && value.trim() && column.definition.title.trim() === value.trim();
					});

					if (column) {
						columnMap.push(column);
					} else {
						headerFindSuccess = false;
					}
				});

				//check if column headers are present by field
				if (!headerFindSuccess) {
					headerFindSuccess = true;
					columnMap = [];

					data[0].forEach(function (value) {
						var column = columns.find(function (column) {
							return value && column.field && value.trim() && column.field.trim() === value.trim();
						});

						if (column) {
							columnMap.push(column);
						} else {
							headerFindSuccess = false;
						}
					});

					if (!headerFindSuccess) {
						columnMap = this.table.columnManager.columnsByIndex;
					}
				}

				//remove header row if found
				if (headerFindSuccess) {
					data.shift();
				}

				data.forEach(function (item) {
					var row = {};

					item.forEach(function (value, i) {
						if (columnMap[i]) {
							row[columnMap[i].field] = value;
						}
					});

					rows.push(row);
				});

				return rows;
			} else {
				return false;
			}
		}
	};

	Clipboard.prototype.pasteActions = {
		replace: function replace(rows) {
			return this.table.setData(rows);
		},
		update: function update(rows) {
			return this.table.updateOrAddData(rows);
		},
		insert: function insert(rows) {
			return this.table.addData(rows);
		}
	};

	Tabulator.prototype.registerModule("clipboard", Clipboard);

	var DataTree = function DataTree(table) {
		this.table = table;
		this.indent = 10;
		this.field = "";
		this.collapseEl = null;
		this.expandEl = null;
		this.branchEl = null;
		this.elementField = false;

		this.startOpen = function () {};

		this.displayIndex = 0;
	};

	DataTree.prototype.initialize = function () {
		var dummyEl = null,
		    firstCol = this.table.columnManager.getFirstVisibileColumn(),
		    options = this.table.options;

		this.field = options.dataTreeChildField;
		this.indent = options.dataTreeChildIndent;
		this.elementField = options.dataTreeElementColumn || (firstCol ? firstCol.field : false);

		if (options.dataTreeBranchElement) {

			if (options.dataTreeBranchElement === true) {
				this.branchEl = document.createElement("div");
				this.branchEl.classList.add("tabulator-data-tree-branch");
			} else {
				if (typeof options.dataTreeBranchElement === "string") {
					dummyEl = document.createElement("div");
					dummyEl.innerHTML = options.dataTreeBranchElement;
					this.branchEl = dummyEl.firstChild;
				} else {
					this.branchEl = options.dataTreeBranchElement;
				}
			}
		}

		if (options.dataTreeCollapseElement) {
			if (typeof options.dataTreeCollapseElement === "string") {
				dummyEl = document.createElement("div");
				dummyEl.innerHTML = options.dataTreeCollapseElement;
				this.collapseEl = dummyEl.firstChild;
			} else {
				this.collapseEl = options.dataTreeCollapseElement;
			}
		} else {
			this.collapseEl = document.createElement("div");
			this.collapseEl.classList.add("tabulator-data-tree-control");
			this.collapseEl.tabIndex = 0;
			this.collapseEl.innerHTML = "<div class='tabulator-data-tree-control-collapse'></div>";
		}

		if (options.dataTreeExpandElement) {
			if (typeof options.dataTreeExpandElement === "string") {
				dummyEl = document.createElement("div");
				dummyEl.innerHTML = options.dataTreeExpandElement;
				this.expandEl = dummyEl.firstChild;
			} else {
				this.expandEl = options.dataTreeExpandElement;
			}
		} else {
			this.expandEl = document.createElement("div");
			this.expandEl.classList.add("tabulator-data-tree-control");
			this.expandEl.tabIndex = 0;
			this.expandEl.innerHTML = "<div class='tabulator-data-tree-control-expand'></div>";
		}

		switch (_typeof(options.dataTreeStartExpanded)) {
			case "boolean":
				this.startOpen = function (row, index) {
					return options.dataTreeStartExpanded;
				};
				break;

			case "function":
				this.startOpen = options.dataTreeStartExpanded;
				break;

			default:
				this.startOpen = function (row, index) {
					return options.dataTreeStartExpanded[index];
				};
				break;
		}
	};

	DataTree.prototype.initializeRow = function (row) {
		var childArray = row.getData()[this.field];
		var isArray = Array.isArray(childArray);

		var children = isArray || !isArray && (typeof childArray === 'undefined' ? 'undefined' : _typeof(childArray)) === "object" && childArray !== null;

		if (!children && row.modules.dataTree && row.modules.dataTree.branchEl) {
			row.modules.dataTree.branchEl.parentNode.removeChild(row.modules.dataTree.branchEl);
		}

		if (!children && row.modules.dataTree && row.modules.dataTree.controlEl) {
			row.modules.dataTree.controlEl.parentNode.removeChild(row.modules.dataTree.controlEl);
		}

		row.modules.dataTree = {
			index: row.modules.dataTree ? row.modules.dataTree.index : 0,
			open: children ? row.modules.dataTree ? row.modules.dataTree.open : this.startOpen(row.getComponent(), 0) : false,
			controlEl: row.modules.dataTree && children ? row.modules.dataTree.controlEl : false,
			branchEl: row.modules.dataTree && children ? row.modules.dataTree.branchEl : false,
			parent: row.modules.dataTree ? row.modules.dataTree.parent : false,
			children: children
		};
	};

	DataTree.prototype.layoutRow = function (row) {
		var cell = this.elementField ? row.getCell(this.elementField) : row.getCells()[0],
		    el = cell.getElement(),
		    config = row.modules.dataTree;

		if (config.branchEl) {
			if (config.branchEl.parentNode) {
				config.branchEl.parentNode.removeChild(config.branchEl);
			}
			config.branchEl = false;
		}

		if (config.controlEl) {
			if (config.controlEl.parentNode) {
				config.controlEl.parentNode.removeChild(config.controlEl);
			}
			config.controlEl = false;
		}

		this.generateControlElement(row, el);

		row.element.classList.add("tabulator-tree-level-" + config.index);

		if (config.index) {
			if (this.branchEl) {
				config.branchEl = this.branchEl.cloneNode(true);
				el.insertBefore(config.branchEl, el.firstChild);
				config.branchEl.style.marginLeft = (config.branchEl.offsetWidth + config.branchEl.style.marginRight) * (config.index - 1) + config.index * this.indent + "px";
			} else {
				el.style.paddingLeft = parseInt(window.getComputedStyle(el, null).getPropertyValue('padding-left')) + config.index * this.indent + "px";
			}
		}
	};

	DataTree.prototype.generateControlElement = function (row, el) {
		var _this40 = this;

		var config = row.modules.dataTree,
		    el = el || row.getCells()[0].getElement(),
		    oldControl = config.controlEl;

		if (config.children !== false) {

			if (config.open) {
				config.controlEl = this.collapseEl.cloneNode(true);
				config.controlEl.addEventListener("click", function (e) {
					e.stopPropagation();
					_this40.collapseRow(row);
				});
			} else {
				config.controlEl = this.expandEl.cloneNode(true);
				config.controlEl.addEventListener("click", function (e) {
					e.stopPropagation();
					_this40.expandRow(row);
				});
			}

			config.controlEl.addEventListener("mousedown", function (e) {
				e.stopPropagation();
			});

			if (oldControl && oldControl.parentNode === el) {
				oldControl.parentNode.replaceChild(config.controlEl, oldControl);
			} else {
				el.insertBefore(config.controlEl, el.firstChild);
			}
		}
	};

	DataTree.prototype.setDisplayIndex = function (index) {
		this.displayIndex = index;
	};

	DataTree.prototype.getDisplayIndex = function () {
		return this.displayIndex;
	};

	DataTree.prototype.getRows = function (rows) {
		var _this41 = this;

		var output = [];

		rows.forEach(function (row, i) {
			var config, children;

			output.push(row);

			if (row instanceof Row) {

				config = row.modules.dataTree.children;

				if (!config.index && config.children !== false) {
					children = _this41.getChildren(row);

					children.forEach(function (child) {
						output.push(child);
					});
				}
			}
		});

		return output;
	};

	DataTree.prototype.getChildren = function (row) {
		var _this42 = this;

		var config = row.modules.dataTree,
		    children = [],
		    output = [];

		if (config.children !== false && config.open) {
			if (!Array.isArray(config.children)) {
				config.children = this.generateChildren(row);
			}

			if (this.table.modExists("filter")) {
				children = this.table.modules.filter.filter(config.children);
			} else {
				children = config.children;
			}

			if (this.table.modExists("sort")) {
				this.table.modules.sort.sort(children);
			}

			children.forEach(function (child) {
				output.push(child);

				var subChildren = _this42.getChildren(child);

				subChildren.forEach(function (sub) {
					output.push(sub);
				});
			});
		}

		return output;
	};

	DataTree.prototype.generateChildren = function (row) {
		var _this43 = this;

		var children = [];

		var childArray = row.getData()[this.field];

		if (!Array.isArray(childArray)) {
			childArray = [childArray];
		}

		childArray.forEach(function (childData) {
			var childRow = new Row(childData || {}, _this43.table.rowManager);
			childRow.modules.dataTree.index = row.modules.dataTree.index + 1;
			childRow.modules.dataTree.parent = row;
			if (childRow.modules.dataTree.children) {
				childRow.modules.dataTree.open = _this43.startOpen(childRow.getComponent(), childRow.modules.dataTree.index);
			}
			children.push(childRow);
		});

		return children;
	};

	DataTree.prototype.expandRow = function (row, silent) {
		var config = row.modules.dataTree;

		if (config.children !== false) {
			config.open = true;

			row.reinitialize();

			this.table.rowManager.refreshActiveData("tree", false, true);

			this.table.options.dataTreeRowExpanded(row.getComponent(), row.modules.dataTree.index);
		}
	};

	DataTree.prototype.collapseRow = function (row) {
		var config = row.modules.dataTree;

		if (config.children !== false) {
			config.open = false;

			row.reinitialize();

			this.table.rowManager.refreshActiveData("tree", false, true);

			this.table.options.dataTreeRowCollapsed(row.getComponent(), row.modules.dataTree.index);
		}
	};

	DataTree.prototype.toggleRow = function (row) {
		var config = row.modules.dataTree;

		if (config.children !== false) {
			if (config.open) {
				this.collapseRow(row);
			} else {
				this.expandRow(row);
			}
		}
	};

	DataTree.prototype.getTreeParent = function (row) {
		return row.modules.dataTree.parent ? row.modules.dataTree.parent.getComponent() : false;
	};

	DataTree.prototype.getFilteredTreeChildren = function (row) {
		var config = row.modules.dataTree,
		    output = [],
		    children;

		if (config.children) {

			if (!Array.isArray(config.children)) {
				config.children = this.generateChildren(row);
			}

			if (this.table.modExists("filter")) {
				children = this.table.modules.filter.filter(config.children);
			} else {
				children = config.children;
			}

			children.forEach(function (childRow) {
				if (childRow instanceof Row) {
					output.push(childRow);
				}
			});
		}

		return output;
	};

	DataTree.prototype.rowDelete = function (row) {
		var parent = row.modules.dataTree.parent,
		    childIndex;

		if (parent) {
			childIndex = this.findChildIndex(row, parent);

			if (childIndex !== false) {
				parent.data[this.field].splice(childIndex, 1);
			}

			if (!parent.data[this.field].length) {
				delete parent.data[this.field];
			}

			this.initializeRow(parent);
			this.layoutRow(parent);
		}

		this.table.rowManager.refreshActiveData("tree", false, true);
	};

	DataTree.prototype.addTreeChildRow = function (row, data, top, index) {
		var childIndex = false;

		if (typeof data === "string") {
			data = JSON.parse(data);
		}

		if (!Array.isArray(row.data[this.field])) {
			row.data[this.field] = [];

			row.modules.dataTree.open = this.startOpen(row.getComponent(), row.modules.dataTree.index);
		}

		if (typeof index !== "undefined") {
			childIndex = this.findChildIndex(index, row);

			if (childIndex !== false) {
				row.data[this.field].splice(top ? childIndex : childIndex + 1, 0, data);
			}
		}

		if (childIndex === false) {
			if (top) {
				row.data[this.field].unshift(data);
			} else {
				row.data[this.field].push(data);
			}
		}

		this.initializeRow(row);
		this.layoutRow(row);

		this.table.rowManager.refreshActiveData("tree", false, true);
	};

	DataTree.prototype.findChildIndex = function (subject, parent) {
		var _this44 = this;

		var match = false;

		if ((typeof subject === 'undefined' ? 'undefined' : _typeof(subject)) == "object") {

			if (subject instanceof Row) {
				//subject is row element
				match = subject.data;
			} else if (subject instanceof RowComponent) {
				//subject is public row component
				match = subject._getSelf().data;
			} else if (typeof HTMLElement !== "undefined" && subject instanceof HTMLElement) {
				if (parent.modules.dataTree) {
					match = parent.modules.dataTree.children.find(function (childRow) {
						return childRow instanceof Row ? childRow.element === subject : false;
					});

					if (match) {
						match = match.data;
					}
				}
			}
		} else if (typeof subject == "undefined" || subject === null) {
			match = false;
		} else {
			//subject should be treated as the index of the row
			match = parent.data[this.field].find(function (row) {
				return row.data[_this44.table.options.index] == subject;
			});
		}

		if (match) {

			if (Array.isArray(parent.data[this.field])) {
				match = parent.data[this.field].indexOf(match);
			}

			if (match == -1) {
				match = false;
			}
		}

		//catch all for any other type of input

		return match;
	};

	DataTree.prototype.getTreeChildren = function (row) {
		var config = row.modules.dataTree,
		    output = [];

		if (config.children) {

			if (!Array.isArray(config.children)) {
				config.children = this.generateChildren(row);
			}

			config.children.forEach(function (childRow) {
				if (childRow instanceof Row) {
					output.push(childRow.getComponent());
				}
			});
		}

		return output;
	};

	DataTree.prototype.checkForRestyle = function (cell) {
		if (!cell.row.cells.indexOf(cell)) {
			cell.row.reinitialize();
		}
	};

	DataTree.prototype.getChildField = function () {
		return this.field;
	};

	DataTree.prototype.redrawNeeded = function (data) {
		return (this.field ? typeof data[this.field] !== "undefined" : false) || (this.elementField ? typeof data[this.elementField] !== "undefined" : false);
	};

	Tabulator.prototype.registerModule("dataTree", DataTree);

	var Download = function Download(table) {
		this.table = table; //hold Tabulator object
	};

	//trigger file download
	Download.prototype.download = function (type, filename, options, range, interceptCallback) {
		var self = this,
		    downloadFunc = false;

		function buildLink(data, mime) {
			if (interceptCallback) {
				if (interceptCallback === true) {
					self.triggerDownload(data, mime, type, filename, true);
				} else {
					interceptCallback(data);
				}
			} else {
				self.triggerDownload(data, mime, type, filename);
			}
		}

		if (typeof type == "function") {
			downloadFunc = type;
		} else {
			if (self.downloaders[type]) {
				downloadFunc = self.downloaders[type];
			} else {
				console.warn("Download Error - No such download type found: ", type);
			}
		}

		if (downloadFunc) {
			var list = this.generateExportList(range);

			downloadFunc.call(this.table, list, options || {}, buildLink);
		}
	};

	Download.prototype.generateExportList = function (range) {
		var list = this.table.modules.export.generateExportList(this.table.options.downloadConfig, false, range || this.table.options.downloadRowRange, "download");

		//assign group header formatter
		var groupHeader = this.table.options.groupHeaderDownload;

		if (groupHeader && !Array.isArray(groupHeader)) {
			groupHeader = [groupHeader];
		}

		list.forEach(function (row) {
			var group;

			if (row.type === "group") {
				group = row.columns[0];

				if (groupHeader && groupHeader[row.indent]) {
					group.value = groupHeader[row.indent](group.value, row.component._group.getRowCount(), row.component._group.getData(), row.component);
				}
			}
		});

		return list;
	};

	Download.prototype.triggerDownload = function (data, mime, type, filename, newTab) {
		var element = document.createElement('a'),
		    blob = new Blob([data], { type: mime }),
		    filename = filename || "Tabulator." + (typeof type === "function" ? "txt" : type);

		blob = this.table.options.downloadReady.call(this.table, data, blob);

		if (blob) {

			if (newTab) {
				window.open(window.URL.createObjectURL(blob));
			} else {
				if (navigator.msSaveOrOpenBlob) {
					navigator.msSaveOrOpenBlob(blob, filename);
				} else {
					element.setAttribute('href', window.URL.createObjectURL(blob));

					//set file title
					element.setAttribute('download', filename);

					//trigger download
					element.style.display = 'none';
					document.body.appendChild(element);
					element.click();

					//remove temporary link element
					document.body.removeChild(element);
				}
			}

			if (this.table.options.downloadComplete) {
				this.table.options.downloadComplete();
			}
		}
	};

	Download.prototype.commsReceived = function (table, action, data) {
		switch (action) {
			case "intercept":
				this.download(data.type, "", data.options, data.active, data.intercept);
				break;
		}
	};

	//downloaders
	Download.prototype.downloaders = {
		csv: function csv(list, options, setFileContents) {
			var delimiter = options && options.delimiter ? options.delimiter : ",",
			    fileContents = [],
			    headers = [];

			list.forEach(function (row) {
				var item = [];

				switch (row.type) {
					case "group":
						console.warn("Download Warning - CSV downloader cannot process row groups");
						break;

					case "calc":
						console.warn("Download Warning - CSV downloader cannot process column calculations");
						break;

					case "header":
						row.columns.forEach(function (col, i) {
							if (col && col.depth === 1) {
								headers[i] = typeof col.value == "undefined" || typeof col.value == "null" ? "" : col.value;
							}
						});
						break;

					case "row":
						row.columns.forEach(function (col) {

							if (col) {

								switch (_typeof(col.value)) {
									case "object":
										col.value = JSON.stringify(col.value);
										break;

									case "undefined":
									case "null":
										col.value = "";
										break;
								}

								item.push('"' + String(col.value).split('"').join('""') + '"');
							}
						});

						fileContents.push(item.join(delimiter));
						break;
				}
			});

			if (headers.length) {
				fileContents = [headers].concat(fileContents);
			}

			fileContents = fileContents.join("\n");

			if (options.bom) {
				fileContents = '\uFEFF' + fileContents;
			}

			setFileContents(fileContents, "text/csv");
		},

		json: function json(list, options, setFileContents) {
			var fileContents = [];

			list.forEach(function (row) {
				var item = {};

				switch (row.type) {
					case "header":
						break;

					case "group":
						console.warn("Download Warning - JSON downloader cannot process row groups");
						break;

					case "calc":
						console.warn("Download Warning - JSON downloader cannot process column calculations");
						break;

					case "row":
						row.columns.forEach(function (col) {
							if (col) {
								item[col.component.getField()] = col.value;
							}
						});

						fileContents.push(item);
						break;
				}
			});

			fileContents = JSON.stringify(fileContents, null, '\t');

			setFileContents(fileContents, "application/json");
		},

		pdf: function pdf(list, options, setFileContents) {
			var header = [],
			    body = [],
			    autoTableParams = {},
			    rowGroupStyles = options.rowGroupStyles || {
				fontStyle: "bold",
				fontSize: 12,
				cellPadding: 6,
				fillColor: 220
			},
			    rowCalcStyles = options.rowCalcStyles || {
				fontStyle: "bold",
				fontSize: 10,
				cellPadding: 4,
				fillColor: 232
			},
			    jsPDFParams = options.jsPDF || {},
			    title = options && options.title ? options.title : "";

			if (!jsPDFParams.orientation) {
				jsPDFParams.orientation = options.orientation || "landscape";
			}

			if (!jsPDFParams.unit) {
				jsPDFParams.unit = "pt";
			}

			//parse row list
			list.forEach(function (row) {

				switch (row.type) {
					case "header":
						header.push(parseRow(row));
						break;

					case "group":
						body.push(parseRow(row, rowGroupStyles));
						break;

					case "calc":
						body.push(parseRow(row, rowCalcStyles));
						break;

					case "row":
						body.push(parseRow(row));
						break;
				}
			});

			function parseRow(row, styles) {
				var rowData = [];

				row.columns.forEach(function (col) {
					var cell;

					if (col) {
						switch (_typeof(col.value)) {
							case "object":
								col.value = JSON.stringify(col.value);
								break;

							case "undefined":
							case "null":
								col.value = "";
								break;
						}

						cell = {
							content: col.value,
							colSpan: col.width,
							rowSpan: col.height
						};

						if (styles) {
							cell.styles = styles;
						}

						rowData.push(cell);
					} else {
						rowData.push("");
					}
				});

				return rowData;
			}

			//configure PDF
			var doc = new jsPDF(jsPDFParams); //set document to landscape, better for most tables

			if (options && options.autoTable) {
				if (typeof options.autoTable === "function") {
					autoTableParams = options.autoTable(doc) || {};
				} else {
					autoTableParams = options.autoTable;
				}
			}

			if (title) {
				autoTableParams.addPageContent = function (data) {
					doc.text(title, 40, 30);
				};
			}

			autoTableParams.head = header;
			autoTableParams.body = body;

			doc.autoTable(autoTableParams);

			if (options && options.documentProcessing) {
				options.documentProcessing(doc);
			}

			setFileContents(doc.output("arraybuffer"), "application/pdf");
		},

		xlsx: function xlsx(list, options, setFileContents) {
			var self = this,
			    sheetName = options.sheetName || "Sheet1",
			    workbook = XLSX.utils.book_new(),
			    output;

			workbook.SheetNames = [];
			workbook.Sheets = {};

			function generateSheet() {
				var rows = [],
				    merges = [],
				    worksheet = {},
				    range = { s: { c: 0, r: 0 }, e: { c: list[0] ? list[0].columns.reduce(function (a, b) {
							return a + (b && b.width ? b.width : 1);
						}, 0) : 0, r: list.length } };

				//parse row list
				list.forEach(function (row, i) {
					var rowData = [];

					row.columns.forEach(function (col, j) {

						if (col) {
							rowData.push(!(col.value instanceof Date) && _typeof(col.value) === "object" ? JSON.stringify(col.value) : col.value);

							if (col.width > 1 || col.height > -1) {
								merges.push({ s: { r: i, c: j }, e: { r: i + col.height - 1, c: j + col.width - 1 } });
							}
						} else {
							rowData.push("");
						}
					});

					rows.push(rowData);
				});

				//convert rows to worksheet
				XLSX.utils.sheet_add_aoa(worksheet, rows);

				worksheet['!ref'] = XLSX.utils.encode_range(range);

				if (merges.length) {
					worksheet["!merges"] = merges;
				}

				return worksheet;
			}

			if (options.sheetOnly) {
				setFileContents(generateSheet());
				return;
			}

			if (options.sheets) {
				for (var sheet in options.sheets) {

					if (options.sheets[sheet] === true) {
						workbook.SheetNames.push(sheet);
						workbook.Sheets[sheet] = generateSheet();
					} else {

						workbook.SheetNames.push(sheet);

						this.table.modules.comms.send(options.sheets[sheet], "download", "intercept", {
							type: "xlsx",
							options: { sheetOnly: true },
							active: self.active,
							intercept: function intercept(data) {
								workbook.Sheets[sheet] = data;
							}
						});
					}
				}
			} else {
				workbook.SheetNames.push(sheetName);
				workbook.Sheets[sheetName] = generateSheet();
			}

			if (options.documentProcessing) {
				workbook = options.documentProcessing(workbook);
			}

			//convert workbook to binary array
			function s2ab(s) {
				var buf = new ArrayBuffer(s.length);
				var view = new Uint8Array(buf);
				for (var i = 0; i != s.length; ++i) {
					view[i] = s.charCodeAt(i) & 0xFF;
				}return buf;
			}

			output = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });

			setFileContents(s2ab(output), "application/octet-stream");
		},

		html: function html(list, options, setFileContents) {
			if (this.modExists("export", true)) {
				setFileContents(this.modules.export.genereateHTMLTable(list), "text/html");
			}
		}

	};

	Tabulator.prototype.registerModule("download", Download);

	var Edit = function Edit(table) {
		this.table = table; //hold Tabulator object
		this.currentCell = false; //hold currently editing cell
		this.mouseClick = false; //hold mousedown state to prevent click binding being overriden by editor opening
		this.recursionBlock = false; //prevent focus recursion
		this.invalidEdit = false;
		this.editedCells = [];
	};

	//initialize column editor
	Edit.prototype.initializeColumn = function (column) {
		var self = this,
		    config = {
			editor: false,
			blocked: false,
			check: column.definition.editable,
			params: column.definition.editorParams || {}
		};

		//set column editor
		switch (_typeof(column.definition.editor)) {
			case "string":

				if (column.definition.editor === "tick") {
					column.definition.editor = "tickCross";
					console.warn("DEPRECATION WARNING - the tick editor has been deprecated, please use the tickCross editor");
				}

				if (self.editors[column.definition.editor]) {
					config.editor = self.editors[column.definition.editor];
				} else {
					console.warn("Editor Error - No such editor found: ", column.definition.editor);
				}
				break;

			case "function":
				config.editor = column.definition.editor;
				break;

			case "boolean":

				if (column.definition.editor === true) {

					if (typeof column.definition.formatter !== "function") {

						if (column.definition.formatter === "tick") {
							column.definition.formatter = "tickCross";
							console.warn("DEPRECATION WARNING - the tick editor has been deprecated, please use the tickCross editor");
						}

						if (self.editors[column.definition.formatter]) {
							config.editor = self.editors[column.definition.formatter];
						} else {
							config.editor = self.editors["input"];
						}
					} else {
						console.warn("Editor Error - Cannot auto lookup editor for a custom formatter: ", column.definition.formatter);
					}
				}
				break;
		}

		if (config.editor) {
			column.modules.edit = config;
		}
	};

	Edit.prototype.getCurrentCell = function () {
		return this.currentCell ? this.currentCell.getComponent() : false;
	};

	Edit.prototype.clearEditor = function (cancel) {
		var cell = this.currentCell,
		    cellEl;

		this.invalidEdit = false;

		if (cell) {
			this.currentCell = false;

			cellEl = cell.getElement();

			if (cancel) {
				cell.validate();
			} else {
				cellEl.classList.remove("tabulator-validation-fail");
			}

			cellEl.classList.remove("tabulator-editing");
			while (cellEl.firstChild) {
				cellEl.removeChild(cellEl.firstChild);
			}cell.row.getElement().classList.remove("tabulator-row-editing");
		}
	};

	Edit.prototype.cancelEdit = function () {

		if (this.currentCell) {
			var cell = this.currentCell;
			var component = this.currentCell.getComponent();

			this.clearEditor(true);
			cell.setValueActual(cell.getValue());
			cell.cellRendered();

			if (cell.column.cellEvents.cellEditCancelled) {
				cell.column.cellEvents.cellEditCancelled.call(this.table, component);
			}

			this.table.options.cellEditCancelled.call(this.table, component);
		}
	};

	//return a formatted value for a cell
	Edit.prototype.bindEditor = function (cell) {
		var self = this,
		    element = cell.getElement();

		element.setAttribute("tabindex", 0);

		element.addEventListener("click", function (e) {
			if (!element.classList.contains("tabulator-editing")) {
				element.focus({ preventScroll: true });
			}
		});

		element.addEventListener("mousedown", function (e) {
			self.mouseClick = true;
		});

		element.addEventListener("focus", function (e) {
			if (!self.recursionBlock) {
				self.edit(cell, e, false);
			}
		});
	};

	Edit.prototype.focusCellNoEvent = function (cell, block) {
		this.recursionBlock = true;
		if (!(block && this.table.browser === "ie")) {
			cell.getElement().focus({ preventScroll: true });
		}
		this.recursionBlock = false;
	};

	Edit.prototype.editCell = function (cell, forceEdit) {
		this.focusCellNoEvent(cell);
		this.edit(cell, false, forceEdit);
	};

	Edit.prototype.focusScrollAdjust = function (cell) {
		if (this.table.rowManager.getRenderMode() == "virtual") {
			var topEdge = this.table.rowManager.element.scrollTop,
			    bottomEdge = this.table.rowManager.element.clientHeight + this.table.rowManager.element.scrollTop,
			    rowEl = cell.row.getElement(),
			    offset = rowEl.offsetTop;

			if (rowEl.offsetTop < topEdge) {
				this.table.rowManager.element.scrollTop -= topEdge - rowEl.offsetTop;
			} else {
				if (rowEl.offsetTop + rowEl.offsetHeight > bottomEdge) {
					this.table.rowManager.element.scrollTop += rowEl.offsetTop + rowEl.offsetHeight - bottomEdge;
				}
			}

			var leftEdge = this.table.rowManager.element.scrollLeft,
			    rightEdge = this.table.rowManager.element.clientWidth + this.table.rowManager.element.scrollLeft,
			    cellEl = cell.getElement(),
			    offset = cellEl.offsetLeft;

			if (this.table.modExists("frozenColumns")) {
				leftEdge += parseInt(this.table.modules.frozenColumns.leftMargin);
				rightEdge -= parseInt(this.table.modules.frozenColumns.rightMargin);
			}

			if (cellEl.offsetLeft < leftEdge) {
				this.table.rowManager.element.scrollLeft -= leftEdge - cellEl.offsetLeft;
			} else {
				if (cellEl.offsetLeft + cellEl.offsetWidth > rightEdge) {
					this.table.rowManager.element.scrollLeft += cellEl.offsetLeft + cellEl.offsetWidth - rightEdge;
				}
			}
		}
	};

	Edit.prototype.edit = function (cell, e, forceEdit) {
		var self = this,
		    allowEdit = true,
		    rendered = function rendered() {},
		    element = cell.getElement(),
		    cellEditor,
		    component,
		    params;

		//prevent editing if another cell is refusing to leave focus (eg. validation fail)
		if (this.currentCell) {
			if (!this.invalidEdit) {
				this.cancelEdit();
			}
			return;
		}

		//handle successfull value change
		function success(value) {
			if (self.currentCell === cell) {
				var valid = true;

				if (cell.column.modules.validate && self.table.modExists("validate") && self.table.options.validationMode != "manual") {
					valid = self.table.modules.validate.validate(cell.column.modules.validate, cell, value);
				}

				if (valid === true || self.table.options.validationMode === "highlight") {
					self.clearEditor();
					cell.setValue(value, true);

					if (!cell.modules.edit) {
						cell.modules.edit = {};
					}

					cell.modules.edit.edited = true;

					if (self.editedCells.indexOf(cell) == -1) {
						self.editedCells.push(cell);
					}

					if (self.table.options.dataTree && self.table.modExists("dataTree")) {
						self.table.modules.dataTree.checkForRestyle(cell);
					}

					if (valid !== true) {
						element.classList.add("tabulator-validation-fail");
						self.table.options.validationFailed.call(self.table, cell.getComponent(), value, valid);
						return false;
					}

					return true;
				} else {
					self.invalidEdit = true;
					element.classList.add("tabulator-validation-fail");
					self.focusCellNoEvent(cell, true);
					rendered();
					self.table.options.validationFailed.call(self.table, cell.getComponent(), value, valid);

					return false;
				}
			}
		}

		//handle aborted edit
		function cancel() {
			if (self.currentCell === cell) {
				self.cancelEdit();

				if (self.table.options.dataTree && self.table.modExists("dataTree")) {
					self.table.modules.dataTree.checkForRestyle(cell);
				}
			}
		}

		function onRendered(callback) {
			rendered = callback;
		}

		if (!cell.column.modules.edit.blocked) {
			if (e) {
				e.stopPropagation();
			}

			switch (_typeof(cell.column.modules.edit.check)) {
				case "function":
					allowEdit = cell.column.modules.edit.check(cell.getComponent());
					break;

				case "boolean":
					allowEdit = cell.column.modules.edit.check;
					break;
			}

			if (allowEdit || forceEdit) {

				self.cancelEdit();

				self.currentCell = cell;

				this.focusScrollAdjust(cell);

				component = cell.getComponent();

				if (this.mouseClick) {
					this.mouseClick = false;

					if (cell.column.cellEvents.cellClick) {
						cell.column.cellEvents.cellClick.call(this.table, e, component);
					}
				}

				if (cell.column.cellEvents.cellEditing) {
					cell.column.cellEvents.cellEditing.call(this.table, component);
				}

				self.table.options.cellEditing.call(this.table, component);

				params = typeof cell.column.modules.edit.params === "function" ? cell.column.modules.edit.params(component) : cell.column.modules.edit.params;

				cellEditor = cell.column.modules.edit.editor.call(self, component, onRendered, success, cancel, params);

				//if editor returned, add to DOM, if false, abort edit
				if (cellEditor !== false) {

					if (cellEditor instanceof Node) {
						element.classList.add("tabulator-editing");
						cell.row.getElement().classList.add("tabulator-row-editing");
						while (element.firstChild) {
							element.removeChild(element.firstChild);
						}element.appendChild(cellEditor);

						//trigger onRendered Callback
						rendered();

						//prevent editing from triggering rowClick event
						var children = element.children;

						for (var i = 0; i < children.length; i++) {
							children[i].addEventListener("click", function (e) {
								e.stopPropagation();
							});
						}
					} else {
						console.warn("Edit Error - Editor should return an instance of Node, the editor returned:", cellEditor);
						element.blur();
						return false;
					}
				} else {
					element.blur();
					return false;
				}

				return true;
			} else {
				this.mouseClick = false;
				element.blur();
				return false;
			}
		} else {
			this.mouseClick = false;
			element.blur();
			return false;
		}
	};

	Edit.prototype.maskInput = function (el, options) {
		var mask = options.mask,
		    maskLetter = typeof options.maskLetterChar !== "undefined" ? options.maskLetterChar : "A",
		    maskNumber = typeof options.maskNumberChar !== "undefined" ? options.maskNumberChar : "9",
		    maskWildcard = typeof options.maskWildcardChar !== "undefined" ? options.maskWildcardChar : "*";

		function fillSymbols(index) {
			var symbol = mask[index];
			if (typeof symbol !== "undefined" && symbol !== maskWildcard && symbol !== maskLetter && symbol !== maskNumber) {
				el.value = el.value + "" + symbol;
				fillSymbols(index + 1);
			}
		}

		el.addEventListener("keydown", function (e) {
			var index = el.value.length,
			    char = e.key;

			if (e.keyCode > 46) {
				if (index >= mask.length) {
					e.preventDefault();
					e.stopPropagation();
					return false;
				} else {
					switch (mask[index]) {
						case maskLetter:
							if (char.toUpperCase() == char.toLowerCase()) {
								e.preventDefault();
								e.stopPropagation();
								return false;
							}
							break;

						case maskNumber:
							if (isNaN(char)) {
								e.preventDefault();
								e.stopPropagation();
								return false;
							}
							break;

						case maskWildcard:
							break;

						default:
							if (char !== mask[index]) {
								e.preventDefault();
								e.stopPropagation();
								return false;
							}
					}
				}
			}

			return;
		});

		el.addEventListener("keyup", function (e) {
			if (e.keyCode > 46) {
				if (options.maskAutoFill) {
					fillSymbols(el.value.length);
				}
			}
		});

		if (!el.placeholder) {
			el.placeholder = mask;
		}

		if (options.maskAutoFill) {
			fillSymbols(el.value.length);
		}
	};

	Edit.prototype.getEditedCells = function () {
		var output = [];

		this.editedCells.forEach(function (cell) {
			output.push(cell.getComponent());
		});

		return output;
	};

	Edit.prototype.clearEdited = function (cell) {
		var editIndex;

		if (cell.modules.validate && cell.modules.edit && cell.modules.edit.edited) {
			cell.modules.validate.invalid = false;

			editIndex = this.editedCells.indexOf(cell);

			if (editIndex > -1) {
				this.editedCells.splice(editIndex, 1);
			}
		}
	};

	//default data editors
	Edit.prototype.editors = {

		//input element
		input: function input(cell, onRendered, success, cancel, editorParams) {

			//create and style input
			var cellValue = cell.getValue(),
			    input = document.createElement("input");

			input.setAttribute("type", editorParams.search ? "search" : "text");

			input.style.padding = "4px";
			input.style.width = "100%";
			input.style.boxSizing = "border-box";

			if (editorParams.elementAttributes && _typeof(editorParams.elementAttributes) == "object") {
				for (var key in editorParams.elementAttributes) {
					if (key.charAt(0) == "+") {
						key = key.slice(1);
						input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
					} else {
						input.setAttribute(key, editorParams.elementAttributes[key]);
					}
				}
			}

			input.value = typeof cellValue !== "undefined" ? cellValue : "";

			onRendered(function () {
				input.focus({ preventScroll: true });
				input.style.height = "100%";
			});

			function onChange(e) {
				if ((cellValue === null || typeof cellValue === "undefined") && input.value !== "" || input.value !== cellValue) {
					if (success(input.value)) {
						cellValue = input.value; //persist value if successfully validated incase editor is used as header filter
					}
				} else {
					cancel();
				}
			}

			//submit new value on blur or change
			input.addEventListener("change", onChange);
			input.addEventListener("blur", onChange);

			//submit new value on enter
			input.addEventListener("keydown", function (e) {
				switch (e.keyCode) {
					// case 9:
					case 13:
						onChange();
						break;

					case 27:
						cancel();
						break;
				}
			});

			if (editorParams.mask) {
				this.table.modules.edit.maskInput(input, editorParams);
			}

			return input;
		},

		//resizable text area element
		textarea: function textarea(cell, onRendered, success, cancel, editorParams) {
			var cellValue = cell.getValue(),
			    vertNav = editorParams.verticalNavigation || "hybrid",
			    value = String(cellValue !== null && typeof cellValue !== "undefined" ? cellValue : ""),
			    count = (value.match(/(?:\r\n|\r|\n)/g) || []).length + 1,
			    input = document.createElement("textarea"),
			    scrollHeight = 0;

			//create and style input
			input.style.display = "block";
			input.style.padding = "2px";
			input.style.height = "100%";
			input.style.width = "100%";
			input.style.boxSizing = "border-box";
			input.style.whiteSpace = "pre-wrap";
			input.style.resize = "none";

			if (editorParams.elementAttributes && _typeof(editorParams.elementAttributes) == "object") {
				for (var key in editorParams.elementAttributes) {
					if (key.charAt(0) == "+") {
						key = key.slice(1);
						input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
					} else {
						input.setAttribute(key, editorParams.elementAttributes[key]);
					}
				}
			}

			input.value = value;

			onRendered(function () {
				input.focus({ preventScroll: true });
				input.style.height = "100%";
			});

			function onChange(e) {

				if ((cellValue === null || typeof cellValue === "undefined") && input.value !== "" || input.value !== cellValue) {

					if (success(input.value)) {
						cellValue = input.value; //persist value if successfully validated incase editor is used as header filter
					}

					setTimeout(function () {
						cell.getRow().normalizeHeight();
					}, 300);
				} else {
					cancel();
				}
			}

			//submit new value on blur or change
			input.addEventListener("change", onChange);
			input.addEventListener("blur", onChange);

			input.addEventListener("keyup", function () {

				input.style.height = "";

				var heightNow = input.scrollHeight;

				input.style.height = heightNow + "px";

				if (heightNow != scrollHeight) {
					scrollHeight = heightNow;
					cell.getRow().normalizeHeight();
				}
			});

			input.addEventListener("keydown", function (e) {

				switch (e.keyCode) {
					case 27:
						cancel();
						break;

					case 38:
						//up arrow
						if (vertNav == "editor" || vertNav == "hybrid" && input.selectionStart) {
							e.stopImmediatePropagation();
							e.stopPropagation();
						}

						break;

					case 40:
						//down arrow
						if (vertNav == "editor" || vertNav == "hybrid" && input.selectionStart !== input.value.length) {
							e.stopImmediatePropagation();
							e.stopPropagation();
						}
						break;
				}
			});

			if (editorParams.mask) {
				this.table.modules.edit.maskInput(input, editorParams);
			}

			return input;
		},

		//input element with type of number
		number: function number(cell, onRendered, success, cancel, editorParams) {

			var cellValue = cell.getValue(),
			    vertNav = editorParams.verticalNavigation || "editor",
			    input = document.createElement("input");

			input.setAttribute("type", "number");

			if (typeof editorParams.max != "undefined") {
				input.setAttribute("max", editorParams.max);
			}

			if (typeof editorParams.min != "undefined") {
				input.setAttribute("min", editorParams.min);
			}

			if (typeof editorParams.step != "undefined") {
				input.setAttribute("step", editorParams.step);
			}

			//create and style input
			input.style.padding = "4px";
			input.style.width = "100%";
			input.style.boxSizing = "border-box";

			if (editorParams.elementAttributes && _typeof(editorParams.elementAttributes) == "object") {
				for (var key in editorParams.elementAttributes) {
					if (key.charAt(0) == "+") {
						key = key.slice(1);
						input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
					} else {
						input.setAttribute(key, editorParams.elementAttributes[key]);
					}
				}
			}

			input.value = cellValue;

			var blurFunc = function blurFunc(e) {
				onChange();
			};

			onRendered(function () {
				//submit new value on blur
				input.removeEventListener("blur", blurFunc);

				input.focus({ preventScroll: true });
				input.style.height = "100%";

				//submit new value on blur
				input.addEventListener("blur", blurFunc);
			});

			function onChange() {
				var value = input.value;

				if (!isNaN(value) && value !== "") {
					value = Number(value);
				}

				if (value !== cellValue) {
					if (success(value)) {
						cellValue = value; //persist value if successfully validated incase editor is used as header filter
					}
				} else {
					cancel();
				}
			}

			//submit new value on enter
			input.addEventListener("keydown", function (e) {
				switch (e.keyCode) {
					case 13:
						// case 9:
						onChange();
						break;

					case 27:
						cancel();
						break;

					case 38: //up arrow
					case 40:
						//down arrow
						if (vertNav == "editor") {
							e.stopImmediatePropagation();
							e.stopPropagation();
						}
						break;
				}
			});

			if (editorParams.mask) {
				this.table.modules.edit.maskInput(input, editorParams);
			}

			return input;
		},

		//input element with type of number
		range: function range(cell, onRendered, success, cancel, editorParams) {

			var cellValue = cell.getValue(),
			    input = document.createElement("input");

			input.setAttribute("type", "range");

			if (typeof editorParams.max != "undefined") {
				input.setAttribute("max", editorParams.max);
			}

			if (typeof editorParams.min != "undefined") {
				input.setAttribute("min", editorParams.min);
			}

			if (typeof editorParams.step != "undefined") {
				input.setAttribute("step", editorParams.step);
			}

			//create and style input
			input.style.padding = "4px";
			input.style.width = "100%";
			input.style.boxSizing = "border-box";

			if (editorParams.elementAttributes && _typeof(editorParams.elementAttributes) == "object") {
				for (var key in editorParams.elementAttributes) {
					if (key.charAt(0) == "+") {
						key = key.slice(1);
						input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
					} else {
						input.setAttribute(key, editorParams.elementAttributes[key]);
					}
				}
			}

			input.value = cellValue;

			onRendered(function () {
				input.focus({ preventScroll: true });
				input.style.height = "100%";
			});

			function onChange() {
				var value = input.value;

				if (!isNaN(value) && value !== "") {
					value = Number(value);
				}

				if (value != cellValue) {
					if (success(value)) {
						cellValue = value; //persist value if successfully validated incase editor is used as header filter
					}
				} else {
					cancel();
				}
			}

			//submit new value on blur
			input.addEventListener("blur", function (e) {
				onChange();
			});

			//submit new value on enter
			input.addEventListener("keydown", function (e) {
				switch (e.keyCode) {
					case 13:
						// case 9:
						onChange();
						break;

					case 27:
						cancel();
						break;
				}
			});

			return input;
		},

		//select
		select: function select(cell, onRendered, success, cancel, editorParams) {
			var _this45 = this;

			var self = this,
			    cellEl = cell.getElement(),
			    initialValue = cell.getValue(),
			    vertNav = editorParams.verticalNavigation || "editor",
			    initialDisplayValue = typeof initialValue !== "undefined" || initialValue === null ? Array.isArray(initialValue) ? initialValue : [initialValue] : typeof editorParams.defaultValue !== "undefined" ? editorParams.defaultValue : [],
			    input = document.createElement("input"),
			    listEl = document.createElement("div"),
			    multiselect = editorParams.multiselect,
			    dataItems = [],
			    currentItem = {},
			    displayItems = [],
			    currentItems = [],
			    blurable = true,
			    blockListShow = false;

			if (Array.isArray(editorParams) || !Array.isArray(editorParams) && (typeof editorParams === 'undefined' ? 'undefined' : _typeof(editorParams)) === "object" && !editorParams.values) {
				console.warn("DEPRECATION WARNING - values for the select editor must now be passed into the values property of the editorParams object, not as the editorParams object");
				editorParams = { values: editorParams };
			}

			function getUniqueColumnValues(field) {
				var output = {},
				    data = self.table.getData(),
				    column;

				if (field) {
					column = self.table.columnManager.getColumnByField(field);
				} else {
					column = cell.getColumn()._getSelf();
				}

				if (column) {
					data.forEach(function (row) {
						var val = column.getFieldValue(row);

						if (val !== null && typeof val !== "undefined" && val !== "") {
							output[val] = true;
						}
					});

					if (editorParams.sortValuesList) {
						if (editorParams.sortValuesList == "asc") {
							output = Object.keys(output).sort();
						} else {
							output = Object.keys(output).sort().reverse();
						}
					} else {
						output = Object.keys(output);
					}
				} else {
					console.warn("unable to find matching column to create select lookup list:", field);
				}

				return output;
			}

			function parseItems(inputValues, curentValues) {
				var dataList = [];
				var displayList = [];

				function processComplexListItem(item) {
					var item = {
						label: item.label,
						value: item.value,
						itemParams: item.itemParams,
						elementAttributes: item.elementAttributes,
						element: false
					};

					// if(item.value === curentValue || (!isNaN(parseFloat(item.value)) && !isNaN(parseFloat(item.value)) && parseFloat(item.value) === parseFloat(curentValue))){
					// 	setCurrentItem(item);
					// }

					if (curentValues.indexOf(item.value) > -1) {
						setItem(item);
					}

					dataList.push(item);
					displayList.push(item);

					return item;
				}

				if (typeof inputValues == "function") {
					inputValues = inputValues(cell);
				}

				if (Array.isArray(inputValues)) {
					inputValues.forEach(function (value) {
						var item;

						if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object") {

							if (value.options) {
								item = {
									label: value.label,
									group: true,
									itemParams: value.itemParams,
									elementAttributes: value.elementAttributes,
									element: false
								};

								displayList.push(item);

								value.options.forEach(function (item) {
									processComplexListItem(item);
								});
							} else {
								processComplexListItem(value);
							}
						} else {

							item = {
								label: value,
								value: value,
								element: false
							};

							// if(item.value === curentValue || (!isNaN(parseFloat(item.value)) && !isNaN(parseFloat(item.value)) && parseFloat(item.value) === parseFloat(curentValue))){
							// 	setCurrentItem(item);
							// }

							if (curentValues.indexOf(item.value) > -1) {
								setItem(item);
							}

							dataList.push(item);
							displayList.push(item);
						}
					});
				} else {
					for (var key in inputValues) {
						var item = {
							label: inputValues[key],
							value: key,
							element: false
						};

						// if(item.value === curentValue || (!isNaN(parseFloat(item.value)) && !isNaN(parseFloat(item.value)) && parseFloat(item.value) === parseFloat(curentValue))){
						// 	setCurrentItem(item);
						// }

						if (curentValues.indexOf(item.value) > -1) {
							setItem(item);
						}

						dataList.push(item);
						displayList.push(item);
					}
				}

				dataItems = dataList;
				displayItems = displayList;

				fillList();
			}

			function fillList() {
				while (listEl.firstChild) {
					listEl.removeChild(listEl.firstChild);
				}displayItems.forEach(function (item) {

					var el = item.element;

					if (!el) {
						el = document.createElement("div");
						item.label = editorParams.listItemFormatter ? editorParams.listItemFormatter(item.value, item.label, cell, el, item.itemParams) : item.label;
						if (item.group) {
							el.classList.add("tabulator-edit-select-list-group");
							el.tabIndex = 0;
							el.innerHTML = item.label === "" ? "&nbsp;" : item.label;
						} else {
							el.classList.add("tabulator-edit-select-list-item");
							el.tabIndex = 0;
							el.innerHTML = item.label === "" ? "&nbsp;" : item.label;

							el.addEventListener("click", function () {
								blockListShow = true;

								setTimeout(function () {
									blockListShow = false;
								}, 10);

								// setCurrentItem(item);
								// chooseItem();
								if (multiselect) {
									toggleItem(item);
									input.focus();
								} else {
									chooseItem(item);
								}
							});

							// if(item === currentItem){
							// 	el.classList.add("active");
							// }

							if (currentItems.indexOf(item) > -1) {
								el.classList.add("active");
							}
						}

						if (item.elementAttributes && _typeof(item.elementAttributes) == "object") {
							for (var key in item.elementAttributes) {
								if (key.charAt(0) == "+") {
									key = key.slice(1);
									el.setAttribute(key, input.getAttribute(key) + item.elementAttributes["+" + key]);
								} else {
									el.setAttribute(key, item.elementAttributes[key]);
								}
							}
						}
						el.addEventListener("mousedown", function () {
							blurable = false;

							setTimeout(function () {
								blurable = true;
							}, 10);
						});

						item.element = el;
					}

					listEl.appendChild(el);
				});
			}

			function setCurrentItem(item, active) {

				if (!multiselect && currentItem && currentItem.element) {
					currentItem.element.classList.remove("active");
				}

				if (currentItem && currentItem.element) {
					currentItem.element.classList.remove("focused");
				}

				currentItem = item;

				if (item.element) {
					item.element.classList.add("focused");
					if (active) {
						item.element.classList.add("active");
					}
				}
			}

			// function chooseItem(){
			// 	hideList();

			// 	if(initialValue !== currentItem.value){
			// 		initialValue = currentItem.value;
			// 		success(currentItem.value);
			// 	}else{
			// 		cancel();
			// 	}
			// }

			function setItem(item) {
				var index = currentItems.indexOf(item);

				if (index == -1) {
					currentItems.push(item);
					setCurrentItem(item, true);
				}

				fillInput();
			}

			function unsetItem(index) {
				var item = currentItems[index];

				if (index > -1) {
					currentItems.splice(index, 1);
					if (item.element) {
						item.element.classList.remove("active");
					}
				}
			}

			function toggleItem(item) {
				if (!item) {
					item = currentItem;
				}

				var index = currentItems.indexOf(item);

				if (index > -1) {
					unsetItem(index);
				} else {
					if (multiselect !== true && currentItems.length >= multiselect) {
						unsetItem(0);
					}

					setItem(item);
				}

				fillInput();
			}

			function chooseItem(item) {
				hideList();

				if (!item) {
					item = currentItem;
				}

				if (item) {
					input.value = item.label;
					success(item.value);
				}

				initialDisplayValue = input.value;
			}

			function chooseItems(silent) {
				if (!silent) {
					hideList();
				}

				var output = [];

				currentItems.forEach(function (item) {
					output.push(item.value);
				});

				initialDisplayValue = input.value;

				success(output);
			}

			function fillInput() {
				var output = [];

				currentItems.forEach(function (item) {
					output.push(item.label);
				});

				input.value = output.join(", ");

				if (self.currentCell === false) {
					chooseItems(true);
				}
			}

			function unsetItems() {

				var len = currentItems.length;

				for (var _i6 = 0; _i6 < len; _i6++) {
					unsetItem(0);
				}
			}

			function cancelItem() {
				hideList();
				cancel();
			}

			function showList() {
				currentItems = [];

				if (!listEl.parentNode) {
					if (editorParams.values === true) {
						parseItems(getUniqueColumnValues(), initialDisplayValue);
					} else if (typeof editorParams.values === "string") {
						parseItems(getUniqueColumnValues(editorParams.values), initialDisplayValue);
					} else {
						parseItems(editorParams.values || [], initialDisplayValue);
					}

					var offset = Tabulator.prototype.helpers.elOffset(cellEl);

					listEl.style.minWidth = cellEl.offsetWidth + "px";

					listEl.style.top = offset.top + cellEl.offsetHeight + "px";
					listEl.style.left = offset.left + "px";

					listEl.addEventListener("mousedown", function (e) {
						blurable = false;

						setTimeout(function () {
							blurable = true;
						}, 10);
					});

					document.body.appendChild(listEl);
				}
			}

			function hideList() {
				if (listEl.parentNode) {
					listEl.parentNode.removeChild(listEl);
				}

				removeScrollListener();
			}

			function removeScrollListener() {
				self.table.rowManager.element.removeEventListener("scroll", cancelItem);
			}

			//style input
			input.setAttribute("type", "text");

			input.style.padding = "4px";
			input.style.width = "100%";
			input.style.boxSizing = "border-box";
			input.style.cursor = "default";
			input.readOnly = this.currentCell != false;

			if (editorParams.elementAttributes && _typeof(editorParams.elementAttributes) == "object") {
				for (var key in editorParams.elementAttributes) {
					if (key.charAt(0) == "+") {
						key = key.slice(1);
						input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
					} else {
						input.setAttribute(key, editorParams.elementAttributes[key]);
					}
				}
			}

			input.value = typeof initialValue !== "undefined" || initialValue === null ? initialValue : "";

			// if(editorParams.values === true){
			// 	parseItems(getUniqueColumnValues(), initialValue);
			// }else if(typeof editorParams.values === "string"){
			// 	parseItems(getUniqueColumnValues(editorParams.values), initialValue);
			// }else{
			// 	parseItems(editorParams.values || [], initialValue);
			// }

			input.addEventListener("search", function (e) {
				if (!input.value) {
					unsetItems();
					chooseItems();
				}
			});

			//allow key based navigation
			input.addEventListener("keydown", function (e) {
				var index;

				switch (e.keyCode) {
					case 38:
						//up arrow
						index = dataItems.indexOf(currentItem);

						if (vertNav == "editor" || vertNav == "hybrid" && index) {
							e.stopImmediatePropagation();
							e.stopPropagation();
							e.preventDefault();

							if (index > 0) {
								setCurrentItem(dataItems[index - 1], !multiselect);
							}
						}
						break;

					case 40:
						//down arrow
						index = dataItems.indexOf(currentItem);

						if (vertNav == "editor" || vertNav == "hybrid" && index < dataItems.length - 1) {
							e.stopImmediatePropagation();
							e.stopPropagation();
							e.preventDefault();

							if (index < dataItems.length - 1) {
								if (index == -1) {
									setCurrentItem(dataItems[0], !multiselect);
								} else {
									setCurrentItem(dataItems[index + 1], !multiselect);
								}
							}
						}
						break;

					case 37: //left arrow
					case 39:
						//right arrow
						e.stopImmediatePropagation();
						e.stopPropagation();
						e.preventDefault();
						break;

					case 13:
						//enter
						// chooseItem();

						if (multiselect) {
							toggleItem();
						} else {
							chooseItem();
						}

						break;

					case 27:
						//escape
						cancelItem();
						break;

					case 9:
						//tab
						break;

					default:
						if (self.currentCell === false) {
							e.preventDefault();
						}
				}
			});

			input.addEventListener("blur", function (e) {
				if (blurable) {
					if (multiselect) {
						chooseItems();
					} else {
						cancelItem();
					}
				}
			});

			input.addEventListener("focus", function (e) {
				if (!blockListShow) {
					showList();
				}
			});

			//style list element
			listEl = document.createElement("div");
			listEl.classList.add("tabulator-edit-select-list");

			onRendered(function () {
				input.style.height = "100%";
				input.focus({ preventScroll: true });
			});

			setTimeout(function () {
				_this45.table.rowManager.element.addEventListener("scroll", cancelItem);
			}, 10);

			return input;
		},

		//autocomplete
		autocomplete: function autocomplete(cell, onRendered, success, cancel, editorParams) {
			var _this46 = this;

			var self = this,
			    cellEl = cell.getElement(),
			    initialValue = cell.getValue(),
			    vertNav = editorParams.verticalNavigation || "editor",
			    initialDisplayValue = typeof initialValue !== "undefined" || initialValue === null ? initialValue : typeof editorParams.defaultValue !== "undefined" ? editorParams.defaultValue : "",
			    input = document.createElement("input"),
			    listEl = document.createElement("div"),
			    displayItems = [],
			    currentItem = false,
			    blurable = true,
			    uniqueColumnValues = false;

			//style input
			input.setAttribute("type", "search");

			input.style.padding = "4px";
			input.style.width = "100%";
			input.style.boxSizing = "border-box";

			if (editorParams.elementAttributes && _typeof(editorParams.elementAttributes) == "object") {
				for (var key in editorParams.elementAttributes) {
					if (key.charAt(0) == "+") {
						key = key.slice(1);
						input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
					} else {
						input.setAttribute(key, editorParams.elementAttributes[key]);
					}
				}
			}

			//style list element
			listEl.classList.add("tabulator-edit-select-list");

			listEl.addEventListener("mousedown", function (e) {
				blurable = false;

				setTimeout(function () {
					blurable = true;
				}, 10);
			});

			function genUniqueColumnValues() {
				if (editorParams.values === true) {
					uniqueColumnValues = getUniqueColumnValues();
				} else if (typeof editorParams.values === "string") {
					uniqueColumnValues = getUniqueColumnValues(editorParams.values);
				}
			}

			function getUniqueColumnValues(field) {
				var output = {},
				    data = self.table.getData(),
				    column;

				if (field) {
					column = self.table.columnManager.getColumnByField(field);
				} else {
					column = cell.getColumn()._getSelf();
				}

				if (column) {
					data.forEach(function (row) {
						var val = column.getFieldValue(row);

						if (val !== null && typeof val !== "undefined" && val !== "") {
							output[val] = true;
						}
					});

					if (editorParams.sortValuesList) {
						if (editorParams.sortValuesList == "asc") {
							output = Object.keys(output).sort();
						} else {
							output = Object.keys(output).sort().reverse();
						}
					} else {
						output = Object.keys(output);
					}
				} else {
					console.warn("unable to find matching column to create autocomplete lookup list:", field);
				}

				return output;
			}

			function filterList(term, intialLoad) {
				var matches = [],
				    values,
				    items;

				//lookup base values list
				if (uniqueColumnValues) {
					values = uniqueColumnValues;
				} else {
					values = editorParams.values || [];
				}

				if (editorParams.searchFunc) {
					matches = editorParams.searchFunc(term, values);

					if (matches instanceof Promise) {

						addNotice(typeof editorParams.searchingPlaceholder !== "undefined" ? editorParams.searchingPlaceholder : "Searching...");

						matches.then(function (result) {
							fillListIfNotEmpty(parseItems(result), intialLoad);
						}).catch(function (err) {
							console.err("error in autocomplete search promise:", err);
						});
					} else {
						fillListIfNotEmpty(parseItems(matches), intialLoad);
					}
				} else {
					items = parseItems(values);

					if (term === "") {
						if (editorParams.showListOnEmpty) {
							matches = items;
						}
					} else {
						items.forEach(function (item) {
							if (item.value !== null || typeof item.value !== "undefined") {
								if (String(item.value).toLowerCase().indexOf(String(term).toLowerCase()) > -1 || String(item.title).toLowerCase().indexOf(String(term).toLowerCase()) > -1) {
									matches.push(item);
								}
							}
						});
					}

					fillListIfNotEmpty(matches, intialLoad);
				}
			}

			function addNotice(notice) {
				var searchEl = document.createElement("div");

				clearList();

				if (notice !== false) {
					searchEl.classList.add("tabulator-edit-select-list-notice");
					searchEl.tabIndex = 0;

					if (notice instanceof Node) {
						searchEl.appendChild(notice);
					} else {
						searchEl.innerHTML = notice;
					}

					listEl.appendChild(searchEl);
				}
			}

			function parseItems(inputValues) {
				var itemList = [];

				if (Array.isArray(inputValues)) {
					inputValues.forEach(function (value) {

						var item = {};

						if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object") {
							item.title = editorParams.listItemFormatter ? editorParams.listItemFormatter(value.value, value.label) : value.label;
							item.value = value.value;
						} else {
							item.title = editorParams.listItemFormatter ? editorParams.listItemFormatter(value, value) : value;
							item.value = value;
						}

						itemList.push(item);
					});
				} else {
					for (var key in inputValues) {
						var item = {
							title: editorParams.listItemFormatter ? editorParams.listItemFormatter(key, inputValues[key]) : inputValues[key],
							value: key
						};

						itemList.push(item);
					}
				}

				return itemList;
			}

			function clearList() {
				while (listEl.firstChild) {
					listEl.removeChild(listEl.firstChild);
				}
			}

			function fillListIfNotEmpty(items, intialLoad) {
				if (items.length) {
					fillList(items, intialLoad);
				} else {
					if (editorParams.emptyPlaceholder) {
						addNotice(editorParams.emptyPlaceholder);
					}
				}
			}

			function fillList(items, intialLoad) {
				var current = false;

				clearList();

				displayItems = items;

				displayItems.forEach(function (item) {
					var el = item.element;

					if (!el) {
						el = document.createElement("div");
						el.classList.add("tabulator-edit-select-list-item");
						el.tabIndex = 0;
						el.innerHTML = item.title;

						el.addEventListener("click", function (e) {
							setCurrentItem(item);
							chooseItem();
						});

						el.addEventListener("mousedown", function (e) {
							blurable = false;

							setTimeout(function () {
								blurable = true;
							}, 10);
						});

						item.element = el;

						if (intialLoad && item.value == initialValue) {
							input.value = item.title;
							item.element.classList.add("active");
							current = true;
						}

						if (item === currentItem) {
							item.element.classList.add("active");
							current = true;
						}
					}

					listEl.appendChild(el);
				});

				if (!current) {
					setCurrentItem(false);
				}
			}

			function chooseItem() {
				hideList();

				if (currentItem) {
					if (initialValue !== currentItem.value) {
						initialValue = currentItem.value;
						input.value = currentItem.title;
						success(currentItem.value);
					} else {
						cancel();
					}
				} else {
					if (editorParams.freetext) {
						initialValue = input.value;
						success(input.value);
					} else {
						if (editorParams.allowEmpty && input.value === "") {
							initialValue = input.value;
							success(input.value);
						} else {
							cancel();
						}
					}
				}
			}

			function showList() {
				if (!listEl.parentNode) {
					while (listEl.firstChild) {
						listEl.removeChild(listEl.firstChild);
					}var offset = Tabulator.prototype.helpers.elOffset(cellEl);

					listEl.style.minWidth = cellEl.offsetWidth + "px";

					listEl.style.top = offset.top + cellEl.offsetHeight + "px";
					listEl.style.left = offset.left + "px";
					document.body.appendChild(listEl);
				}
			}

			function setCurrentItem(item, showInputValue) {
				if (currentItem && currentItem.element) {
					currentItem.element.classList.remove("active");
				}

				currentItem = item;

				if (item && item.element) {
					item.element.classList.add("active");
				}
			}

			function hideList() {
				if (listEl.parentNode) {
					listEl.parentNode.removeChild(listEl);
				}

				removeScrollListener();
			}

			function cancelItem() {
				hideList();
				cancel();
			}

			function removeScrollListener() {
				self.table.rowManager.element.removeEventListener("scroll", cancelItem);
			}

			//allow key based navigation
			input.addEventListener("keydown", function (e) {
				var index;

				switch (e.keyCode) {
					case 38:
						//up arrow
						index = displayItems.indexOf(currentItem);

						if (vertNav == "editor" || vertNav == "hybrid" && index) {
							e.stopImmediatePropagation();
							e.stopPropagation();
							e.preventDefault();

							if (index > 0) {
								setCurrentItem(displayItems[index - 1]);
							} else {
								setCurrentItem(false);
							}
						}
						break;

					case 40:
						//down arrow

						index = displayItems.indexOf(currentItem);

						if (vertNav == "editor" || vertNav == "hybrid" && index < displayItems.length - 1) {

							e.stopImmediatePropagation();
							e.stopPropagation();
							e.preventDefault();

							if (index < displayItems.length - 1) {
								if (index == -1) {
									setCurrentItem(displayItems[0]);
								} else {
									setCurrentItem(displayItems[index + 1]);
								}
							}
						}
						break;

					case 37: //left arrow
					case 39:
						//right arrow
						e.stopImmediatePropagation();
						e.stopPropagation();
						// e.preventDefault();
						break;

					case 13:
						//enter
						chooseItem();
						break;

					case 27:
						//escape
						cancelItem();
						break;

					case 36: //home
					case 35:
						//end
						//prevent table navigation while using input element
						e.stopImmediatePropagation();
						break;
				}
			});

			input.addEventListener("keyup", function (e) {

				switch (e.keyCode) {
					case 38: //up arrow
					case 37: //left arrow
					case 39: //up arrow
					case 40: //right arrow
					case 13: //enter
					case 27:
						//escape
						break;

					default:
						filterList(input.value);
				}
			});

			input.addEventListener("search", function (e) {
				filterList(input.value);
			});

			input.addEventListener("blur", function (e) {
				if (blurable) {
					chooseItem();
				}
			});

			input.addEventListener("focus", function (e) {
				var value = initialDisplayValue;
				genUniqueColumnValues();
				showList();
				input.value = value;
				filterList(value, true);
			});

			onRendered(function () {
				input.style.height = "100%";
				input.focus({ preventScroll: true });
			});

			if (editorParams.mask) {
				this.table.modules.edit.maskInput(input, editorParams);
			}

			setTimeout(function () {
				_this46.table.rowManager.element.addEventListener("scroll", cancelItem);
			}, 10);

			genUniqueColumnValues();
			input.value = initialDisplayValue;
			filterList(initialDisplayValue, true);

			return input;
		},

		//star rating
		star: function star(cell, onRendered, success, cancel, editorParams) {
			var self = this,
			    element = cell.getElement(),
			    value = cell.getValue(),
			    maxStars = element.getElementsByTagName("svg").length || 5,
			    size = element.getElementsByTagName("svg")[0] ? element.getElementsByTagName("svg")[0].getAttribute("width") : 14,
			    stars = [],
			    starsHolder = document.createElement("div"),
			    star = document.createElementNS('http://www.w3.org/2000/svg', "svg");

			//change star type
			function starChange(val) {
				stars.forEach(function (star, i) {
					if (i < val) {
						if (self.table.browser == "ie") {
							star.setAttribute("class", "tabulator-star-active");
						} else {
							star.classList.replace("tabulator-star-inactive", "tabulator-star-active");
						}

						star.innerHTML = '<polygon fill="#488CE9" stroke="#014AAE" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>';
					} else {
						if (self.table.browser == "ie") {
							star.setAttribute("class", "tabulator-star-inactive");
						} else {
							star.classList.replace("tabulator-star-active", "tabulator-star-inactive");
						}

						star.innerHTML = '<polygon fill="#010155" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>';
					}
				});
			}

			//build stars
			function buildStar(i) {

				var starHolder = document.createElement("span");
				var nextStar = star.cloneNode(true);

				stars.push(nextStar);

				starHolder.addEventListener("mouseenter", function (e) {
					e.stopPropagation();
					e.stopImmediatePropagation();
					starChange(i);
				});

				starHolder.addEventListener("mousemove", function (e) {
					e.stopPropagation();
					e.stopImmediatePropagation();
				});

				starHolder.addEventListener("click", function (e) {
					e.stopPropagation();
					e.stopImmediatePropagation();
					success(i);
					element.blur();
				});

				starHolder.appendChild(nextStar);
				starsHolder.appendChild(starHolder);
			}

			//handle keyboard navigation value change
			function changeValue(val) {
				value = val;
				starChange(val);
			}

			//style cell
			element.style.whiteSpace = "nowrap";
			element.style.overflow = "hidden";
			element.style.textOverflow = "ellipsis";

			//style holding element
			starsHolder.style.verticalAlign = "middle";
			starsHolder.style.display = "inline-block";
			starsHolder.style.padding = "4px";

			//style star
			star.setAttribute("width", size);
			star.setAttribute("height", size);
			star.setAttribute("viewBox", "0 0 512 512");
			star.setAttribute("xml:space", "preserve");
			star.style.padding = "0 1px";

			if (editorParams.elementAttributes && _typeof(editorParams.elementAttributes) == "object") {
				for (var key in editorParams.elementAttributes) {
					if (key.charAt(0) == "+") {
						key = key.slice(1);
						starsHolder.setAttribute(key, starsHolder.getAttribute(key) + editorParams.elementAttributes["+" + key]);
					} else {
						starsHolder.setAttribute(key, editorParams.elementAttributes[key]);
					}
				}
			}

			//create correct number of stars
			for (var i = 1; i <= maxStars; i++) {
				buildStar(i);
			}

			//ensure value does not exceed number of stars
			value = Math.min(parseInt(value), maxStars);

			// set initial styling of stars
			starChange(value);

			starsHolder.addEventListener("mousemove", function (e) {
				starChange(0);
			});

			starsHolder.addEventListener("click", function (e) {
				success(0);
			});

			element.addEventListener("blur", function (e) {
				cancel();
			});

			//allow key based navigation
			element.addEventListener("keydown", function (e) {
				switch (e.keyCode) {
					case 39:
						//right arrow
						changeValue(value + 1);
						break;

					case 37:
						//left arrow
						changeValue(value - 1);
						break;

					case 13:
						//enter
						success(value);
						break;

					case 27:
						//escape
						cancel();
						break;
				}
			});

			return starsHolder;
		},

		//draggable progress bar
		progress: function progress(cell, onRendered, success, cancel, editorParams) {
			var element = cell.getElement(),
			    max = typeof editorParams.max === "undefined" ? element.getElementsByTagName("div")[0].getAttribute("max") || 100 : editorParams.max,
			    min = typeof editorParams.min === "undefined" ? element.getElementsByTagName("div")[0].getAttribute("min") || 0 : editorParams.min,
			    percent = (max - min) / 100,
			    value = cell.getValue() || 0,
			    handle = document.createElement("div"),
			    bar = document.createElement("div"),
			    mouseDrag,
			    mouseDragWidth;

			//set new value
			function updateValue() {
				var calcVal = percent * Math.round(bar.offsetWidth / (element.clientWidth / 100)) + min;
				success(calcVal);
				element.setAttribute("aria-valuenow", calcVal);
				element.setAttribute("aria-label", value);
			}

			//style handle
			handle.style.position = "absolute";
			handle.style.right = "0";
			handle.style.top = "0";
			handle.style.bottom = "0";
			handle.style.width = "5px";
			handle.classList.add("tabulator-progress-handle");

			//style bar
			bar.style.display = "inline-block";
			bar.style.position = "relative";
			// bar.style.top = "8px";
			// bar.style.bottom = "8px";
			// bar.style.left = "4px";
			// bar.style.marginRight = "4px";
			bar.style.height = "100%";
			bar.style.backgroundColor = "#488CE9";
			bar.style.maxWidth = "100%";
			bar.style.minWidth = "0%";

			if (editorParams.elementAttributes && _typeof(editorParams.elementAttributes) == "object") {
				for (var key in editorParams.elementAttributes) {
					if (key.charAt(0) == "+") {
						key = key.slice(1);
						bar.setAttribute(key, bar.getAttribute(key) + editorParams.elementAttributes["+" + key]);
					} else {
						bar.setAttribute(key, editorParams.elementAttributes[key]);
					}
				}
			}

			//style cell
			element.style.padding = "4px 4px";

			//make sure value is in range
			value = Math.min(parseFloat(value), max);
			value = Math.max(parseFloat(value), min);

			//workout percentage
			value = Math.round((value - min) / percent);
			// bar.style.right = value + "%";
			bar.style.width = value + "%";

			element.setAttribute("aria-valuemin", min);
			element.setAttribute("aria-valuemax", max);

			bar.appendChild(handle);

			handle.addEventListener("mousedown", function (e) {
				mouseDrag = e.screenX;
				mouseDragWidth = bar.offsetWidth;
			});

			handle.addEventListener("mouseover", function () {
				handle.style.cursor = "ew-resize";
			});

			element.addEventListener("mousemove", function (e) {
				if (mouseDrag) {
					bar.style.width = mouseDragWidth + e.screenX - mouseDrag + "px";
				}
			});

			element.addEventListener("mouseup", function (e) {
				if (mouseDrag) {
					e.stopPropagation();
					e.stopImmediatePropagation();

					mouseDrag = false;
					mouseDragWidth = false;

					updateValue();
				}
			});

			//allow key based navigation
			element.addEventListener("keydown", function (e) {
				switch (e.keyCode) {
					case 39:
						//right arrow
						e.preventDefault();
						bar.style.width = bar.clientWidth + element.clientWidth / 100 + "px";
						break;

					case 37:
						//left arrow
						e.preventDefault();
						bar.style.width = bar.clientWidth - element.clientWidth / 100 + "px";
						break;

					case 9: //tab
					case 13:
						//enter
						updateValue();
						break;

					case 27:
						//escape
						cancel();
						break;

				}
			});

			element.addEventListener("blur", function () {
				cancel();
			});

			return bar;
		},

		//checkbox
		tickCross: function tickCross(cell, onRendered, success, cancel, editorParams) {
			var value = cell.getValue(),
			    input = document.createElement("input"),
			    tristate = editorParams.tristate,
			    indetermValue = typeof editorParams.indeterminateValue === "undefined" ? null : editorParams.indeterminateValue,
			    indetermState = false;

			input.setAttribute("type", "checkbox");
			input.style.marginTop = "5px";
			input.style.boxSizing = "border-box";

			if (editorParams.elementAttributes && _typeof(editorParams.elementAttributes) == "object") {
				for (var key in editorParams.elementAttributes) {
					if (key.charAt(0) == "+") {
						key = key.slice(1);
						input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
					} else {
						input.setAttribute(key, editorParams.elementAttributes[key]);
					}
				}
			}

			input.value = value;

			if (tristate && (typeof value === "undefined" || value === indetermValue || value === "")) {
				indetermState = true;
				input.indeterminate = true;
			}

			if (this.table.browser != "firefox") {
				//prevent blur issue on mac firefox
				onRendered(function () {
					input.focus({ preventScroll: true });
				});
			}

			input.checked = value === true || value === "true" || value === "True" || value === 1;

			function setValue(blur) {
				if (tristate) {
					if (!blur) {
						if (input.checked && !indetermState) {
							input.checked = false;
							input.indeterminate = true;
							indetermState = true;
							return indetermValue;
						} else {
							indetermState = false;
							return input.checked;
						}
					} else {
						if (indetermState) {
							return indetermValue;
						} else {
							return input.checked;
						}
					}
				} else {
					return input.checked;
				}
			}

			//submit new value on blur
			input.addEventListener("change", function (e) {
				success(setValue());
			});

			input.addEventListener("blur", function (e) {
				success(setValue(true));
			});

			//submit new value on enter
			input.addEventListener("keydown", function (e) {
				if (e.keyCode == 13) {
					success(setValue());
				}
				if (e.keyCode == 27) {
					cancel();
				}
			});

			return input;
		}
	};

	Tabulator.prototype.registerModule("edit", Edit);

	var ExportRow = function ExportRow(type, columns, component, indent) {
		this.type = type;
		this.columns = columns;
		this.component = component || false;
		this.indent = indent || 0;
	};

	var ExportColumn = function ExportColumn(value, component, width, height, depth) {
		this.value = value;
		this.component = component || false;
		this.width = width;
		this.height = height;
		this.depth = depth;
	};

	var Export = function Export(table) {
		this.table = table; //hold Tabulator object
		this.config = {};
		this.cloneTableStyle = true;
		this.colVisProp = "";
	};

	Export.prototype.generateExportList = function (config, style, range, colVisProp) {
		this.cloneTableStyle = style;
		this.config = config || {};
		this.colVisProp = colVisProp;

		var headers = this.config.columnHeaders !== false ? this.headersToExportRows(this.generateColumnGroupHeaders()) : [];
		var body = this.bodyToExportRows(this.rowLookup(range));

		return headers.concat(body);
	};

	Export.prototype.genereateTable = function (config, style, range, colVisProp) {
		var list = this.generateExportList(config, style, range, colVisProp);

		return this.genereateTableElement(list);
	};

	Export.prototype.rowLookup = function (range) {
		var _this47 = this;

		var rows = [];

		if (typeof range == "function") {
			range.call(this.table).forEach(function (row) {
				row = _this47.table.rowManager.findRow(row);

				if (row) {
					rows.push(row);
				}
			});
		} else {
			switch (range) {
				case true:
				case "visible":
					rows = this.table.rowManager.getVisibleRows(true);
					break;

				case "all":
					rows = this.table.rowManager.rows;
					break;

				case "selected":
					rows = this.table.modules.selectRow.selectedRows;
					break;

				case "active":
				default:
					rows = this.table.rowManager.getDisplayRows();
			}
		}

		return Object.assign([], rows);
	};

	Export.prototype.generateColumnGroupHeaders = function () {
		var _this48 = this;

		var output = [];

		var columns = this.config.columnGroups !== false ? this.table.columnManager.columns : this.table.columnManager.columnsByIndex;

		columns.forEach(function (column) {
			var colData = _this48.processColumnGroup(column);

			if (colData) {
				output.push(colData);
			}
		});

		return output;
	};

	Export.prototype.processColumnGroup = function (column) {
		var _this49 = this;

		var subGroups = column.columns,
		    maxDepth = 0,
		    title = column.definition["title" + (this.colVisProp.charAt(0).toUpperCase() + this.colVisProp.slice(1))] || column.definition.title;

		var groupData = {
			title: title,
			column: column,
			depth: 1
		};

		if (subGroups.length) {
			groupData.subGroups = [];
			groupData.width = 0;

			subGroups.forEach(function (subGroup) {
				var subGroupData = _this49.processColumnGroup(subGroup);

				if (subGroupData) {
					groupData.width += subGroupData.width;
					groupData.subGroups.push(subGroupData);

					if (subGroupData.depth > maxDepth) {
						maxDepth = subGroupData.depth;
					}
				}
			});

			groupData.depth += maxDepth;

			if (!groupData.width) {
				return false;
			}
		} else {
			if (this.columnVisCheck(column)) {
				groupData.width = 1;
			} else {
				return false;
			}
		}

		return groupData;
	};

	Export.prototype.columnVisCheck = function (column) {
		return column.definition[this.colVisProp] !== false && (column.visible || !column.visible && column.definition[this.colVisProp]);
	};

	Export.prototype.headersToExportRows = function (columns) {
		var headers = [],
		    headerDepth = 0,
		    exportRows = [];

		function parseColumnGroup(column, level) {

			var depth = headerDepth - level;

			if (typeof headers[level] === "undefined") {
				headers[level] = [];
			}

			column.height = column.subGroups ? 1 : depth - column.depth + 1;

			headers[level].push(column);

			if (column.height > 1) {
				for (var _i7 = 1; _i7 < column.height; _i7++) {

					if (typeof headers[level + _i7] === "undefined") {
						headers[level + _i7] = [];
					}

					headers[level + _i7].push(false);
				}
			}

			if (column.width > 1) {
				for (var _i8 = 1; _i8 < column.width; _i8++) {
					headers[level].push(false);
				}
			}

			if (column.subGroups) {
				column.subGroups.forEach(function (subGroup) {
					parseColumnGroup(subGroup, level + 1);
				});
			}
		}

		//calculate maximum header debth
		columns.forEach(function (column) {
			if (column.depth > headerDepth) {
				headerDepth = column.depth;
			}
		});

		columns.forEach(function (column) {
			parseColumnGroup(column, 0);
		});

		headers.forEach(function (header) {
			var columns = [];

			header.forEach(function (col) {
				if (col) {
					columns.push(new ExportColumn(col.title, col.column.getComponent(), col.width, col.height, col.depth));
				} else {
					columns.push(null);
				}
			});

			exportRows.push(new ExportRow("header", columns));
		});

		return exportRows;
	};

	Export.prototype.bodyToExportRows = function (rows) {
		var _this50 = this;

		var columns = [];
		var exportRows = [];

		this.table.columnManager.columnsByIndex.forEach(function (column) {
			if (_this50.columnVisCheck(column)) {
				columns.push(column.getComponent());
			}
		});

		if (this.config.columnCalcs !== false && this.table.modExists("columnCalcs")) {
			if (this.table.modules.columnCalcs.topInitialized) {
				rows.unshift(this.table.modules.columnCalcs.topRow);
			}

			if (this.table.modules.columnCalcs.botInitialized) {
				rows.push(this.table.modules.columnCalcs.botRow);
			}
		}

		rows = rows.filter(function (row) {
			switch (row.type) {
				case "group":
					return _this50.config.rowGroups !== false;

				case "calc":
					return _this50.config.columnCalcs !== false;

				case "row":
					return !(_this50.table.options.dataTree && _this50.config.dataTree === false && row.modules.dataTree.parent);
			}

			return true;
		});

		rows.forEach(function (row, i) {
			var rowData = row.getData(_this50.colVisProp);
			var exportCols = [];
			var indent = 0;

			switch (row.type) {
				case "group":
					indent = row.level;
					exportCols.push(new ExportColumn(row.key, row.getComponent(), columns.length, 1));
					break;

				case "calc":
				case "row":
					columns.forEach(function (col) {
						exportCols.push(new ExportColumn(col._column.getFieldValue(rowData), col, 1, 1));
					});

					if (_this50.table.options.dataTree && _this50.config.dataTree !== false) {
						indent = row.modules.dataTree.index;
					}
					break;
			}

			exportRows.push(new ExportRow(row.type, exportCols, row.getComponent(), indent));
		});

		return exportRows;
	};

	Export.prototype.genereateTableElement = function (list) {
		var _this51 = this;

		var table = document.createElement("table"),
		    headerEl = document.createElement("thead"),
		    bodyEl = document.createElement("tbody"),
		    styles = this.lookupTableStyles(),
		    rowFormatter = this.table.options["rowFormatter" + (this.colVisProp.charAt(0).toUpperCase() + this.colVisProp.slice(1))],
		    setup = {};

		setup.rowFormatter = rowFormatter !== null ? rowFormatter : this.table.options.rowFormatter;

		if (this.table.options.dataTree && this.config.dataTree !== false && this.table.modExists("columnCalcs")) {
			setup.treeElementField = this.table.modules.dataTree.elementField;
		}

		//assign group header formatter
		setup.groupHeader = this.table.options["groupHeader" + (this.colVisProp.charAt(0).toUpperCase() + this.colVisProp.slice(1))];

		if (setup.groupHeader && !Array.isArray(setup.groupHeader)) {
			setup.groupHeader = [setup.groupHeader];
		}

		table.classList.add("tabulator-print-table");

		this.mapElementStyles(this.table.columnManager.getHeadersElement(), headerEl, ["border-top", "border-left", "border-right", "border-bottom", "background-color", "color", "font-weight", "font-family", "font-size"]);

		if (list.length > 1000) {
			console.warn("It may take a long time to render an HTML table with more than 1000 rows");
		}

		list.forEach(function (row, i) {
			switch (row.type) {
				case "header":
					headerEl.appendChild(_this51.genereateHeaderElement(row, setup, styles));
					break;

				case "group":
					bodyEl.appendChild(_this51.genereateGroupElement(row, setup, styles));
					break;

				case "calc":
					bodyEl.appendChild(_this51.genereateCalcElement(row, setup, styles));
					break;

				case "row":
					var rowEl = _this51.genereateRowElement(row, setup, styles);
					_this51.mapElementStyles(i % 2 && styles.evenRow ? styles.evenRow : styles.oddRow, rowEl, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]);
					bodyEl.appendChild(rowEl);
					break;
			}
		});

		if (headerEl.innerHTML) {
			table.appendChild(headerEl);
		}

		table.appendChild(bodyEl);

		this.mapElementStyles(this.table.element, table, ["border-top", "border-left", "border-right", "border-bottom"]);
		return table;
	};

	Export.prototype.lookupTableStyles = function () {
		var styles = {};

		//lookup row styles
		if (this.cloneTableStyle && window.getComputedStyle) {
			styles.oddRow = this.table.element.querySelector(".tabulator-row-odd:not(.tabulator-group):not(.tabulator-calcs)");
			styles.evenRow = this.table.element.querySelector(".tabulator-row-even:not(.tabulator-group):not(.tabulator-calcs)");
			styles.calcRow = this.table.element.querySelector(".tabulator-row.tabulator-calcs");
			styles.firstRow = this.table.element.querySelector(".tabulator-row:not(.tabulator-group):not(.tabulator-calcs)");
			styles.firstGroup = this.table.element.getElementsByClassName("tabulator-group")[0];

			if (styles.firstRow) {
				styles.styleCells = styles.firstRow.getElementsByClassName("tabulator-cell");
				styles.firstCell = styles.styleCells[0];
				styles.lastCell = styles.styleCells[styles.styleCells.length - 1];
			}
		}

		return styles;
	};

	Export.prototype.genereateHeaderElement = function (row, setup, styles) {
		var _this52 = this;

		var rowEl = document.createElement("tr");

		row.columns.forEach(function (column) {
			if (column) {
				var cellEl = document.createElement("th");
				var classNames = column.component._column.definition.cssClass ? column.component._column.definition.cssClass.split(" ") : [];

				cellEl.colSpan = column.width;
				cellEl.rowSpan = column.height;

				cellEl.innerHTML = column.value;

				if (_this52.cloneTableStyle) {
					cellEl.style.boxSizing = "border-box";
				}

				classNames.forEach(function (className) {
					cellEl.classList.add(className);
				});

				_this52.mapElementStyles(column.component.getElement(), cellEl, ["text-align", "border-top", "border-left", "border-right", "border-bottom", "background-color", "color", "font-weight", "font-family", "font-size"]);
				_this52.mapElementStyles(column.component._column.contentElement, cellEl, ["padding-top", "padding-left", "padding-right", "padding-bottom"]);

				if (column.component._column.visible) {
					_this52.mapElementStyles(column.component.getElement(), cellEl, ["width"]);
				} else {
					if (column.component._column.definition.width) {
						cellEl.style.width = column.component._column.definition.width + "px";
					}
				}

				if (column.component._column.parent) {
					_this52.mapElementStyles(column.component._column.parent.groupElement, cellEl, ["border-top"]);
				}

				rowEl.appendChild(cellEl);
			}
		});

		return rowEl;
	};

	Export.prototype.genereateGroupElement = function (row, setup, styles) {

		var rowEl = document.createElement("tr"),
		    cellEl = document.createElement("td"),
		    group = row.columns[0];

		rowEl.classList.add("tabulator-print-table-row");

		if (setup.groupHeader && setup.groupHeader[row.indent]) {
			group.value = setup.groupHeader[row.indent](group.value, row.component._group.getRowCount(), row.component._group.getData(), row.component);
		} else {
			if (setup.groupHeader === false) {
				group.value = group.value;
			} else {
				group.value = row.component._group.generator(group.value, row.component._group.getRowCount(), row.component._group.getData(), row.component);
			}
		}

		cellEl.colSpan = group.width;
		cellEl.innerHTML = group.value;

		rowEl.classList.add("tabulator-print-table-group");
		rowEl.classList.add("tabulator-group-level-" + row.indent);

		if (group.component.getVisibility()) {
			rowEl.classList.add("tabulator-group-visible");
		}

		this.mapElementStyles(styles.firstGroup, rowEl, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]);
		this.mapElementStyles(styles.firstGroup, cellEl, ["padding-top", "padding-left", "padding-right", "padding-bottom"]);

		rowEl.appendChild(cellEl);

		return rowEl;
	};

	Export.prototype.genereateCalcElement = function (row, setup, styles) {
		var rowEl = this.genereateRowElement(row, setup, styles);

		rowEl.classList.add("tabulator-print-table-calcs");
		this.mapElementStyles(styles.calcRow, rowEl, ["border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size", "background-color"]);

		return rowEl;
	};

	Export.prototype.genereateRowElement = function (row, setup, styles) {
		var _this53 = this;

		var rowEl = document.createElement("tr");

		rowEl.classList.add("tabulator-print-table-row");

		row.columns.forEach(function (col) {

			if (col) {
				var cellEl = document.createElement("td"),
				    column = col.component._column,
				    value = col.value;

				var cellWrapper = {
					modules: {},
					getValue: function getValue() {
						return value;
					},
					getField: function getField() {
						return column.definition.field;
					},
					getElement: function getElement() {
						return cellEl;
					},
					getColumn: function getColumn() {
						return column.getComponent();
					},
					getData: function getData() {
						return rowData;
					},
					getRow: function getRow() {
						return row.getComponent();
					},
					getComponent: function getComponent() {
						return cellWrapper;
					},
					column: column
				};

				var classNames = column.definition.cssClass ? column.definition.cssClass.split(" ") : [];

				classNames.forEach(function (className) {
					cellEl.classList.add(className);
				});

				if (_this53.table.modExists("format") && _this53.config.formatCells !== false) {
					value = _this53.table.modules.format.formatExportValue(cellWrapper, _this53.colVisProp);
				} else {
					switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
						case "object":
							value = JSON.stringify(value);
							break;

						case "undefined":
						case "null":
							value = "";
							break;

						default:
							value = value;
					}
				}

				if (value instanceof Node) {
					cellEl.appendChild(value);
				} else {
					cellEl.innerHTML = value;
				}

				if (styles.firstCell) {
					_this53.mapElementStyles(styles.firstCell, cellEl, ["padding-top", "padding-left", "padding-right", "padding-bottom", "border-top", "border-left", "border-right", "border-bottom", "color", "font-weight", "font-family", "font-size"]);

					if (column.definition.align) {
						cellEl.style.textAlign = column.definition.align;
					}
				}

				if (_this53.table.options.dataTree && _this53.config.dataTree !== false) {
					if (setup.treeElementField && setup.treeElementField == column.field || !setup.treeElementField && i == 0) {
						if (row.component._row.modules.dataTree.controlEl) {
							cellEl.insertBefore(row.component._row.modules.dataTree.controlEl.cloneNode(true), cellEl.firstChild);
						}
						if (row.component._row.modules.dataTree.branchEl) {
							cellEl.insertBefore(row.component._row.modules.dataTree.branchEl.cloneNode(true), cellEl.firstChild);
						}
					}
				}

				rowEl.appendChild(cellEl);

				if (cellWrapper.modules.format && cellWrapper.modules.format.renderedCallback) {
					cellWrapper.modules.format.renderedCallback();
				}

				if (setup.rowFormatter && _this53.config.formatCells !== false) {
					var rowComponent = row.getComponent();

					rowComponent.getElement = function () {
						return rowEl;
					};

					setup.rowFormatter(rowComponent);
				}
			}
		});

		return rowEl;
	};

	Export.prototype.genereateHTMLTable = function (list) {
		var holder = document.createElement("div");

		holder.appendChild(this.genereateTableElement(list));

		return holder.innerHTML;
	};

	Export.prototype.getHtml = function (visible, style, config, colVisProp) {
		var list = this.generateExportList(config || this.table.options.htmlOutputConfig, style, visible, colVisProp || "htmlOutput");

		return this.genereateHTMLTable(list);
	};

	Export.prototype.mapElementStyles = function (from, to, props) {
		if (this.cloneTableStyle && from && to) {

			var lookup = {
				"background-color": "backgroundColor",
				"color": "fontColor",
				"width": "width",
				"font-weight": "fontWeight",
				"font-family": "fontFamily",
				"font-size": "fontSize",
				"text-align": "textAlign",
				"border-top": "borderTop",
				"border-left": "borderLeft",
				"border-right": "borderRight",
				"border-bottom": "borderBottom",
				"padding-top": "paddingTop",
				"padding-left": "paddingLeft",
				"padding-right": "paddingRight",
				"padding-bottom": "paddingBottom"
			};

			if (window.getComputedStyle) {
				var fromStyle = window.getComputedStyle(from);

				props.forEach(function (prop) {
					to.style[lookup[prop]] = fromStyle.getPropertyValue(prop);
				});
			}
		}
	};

	Tabulator.prototype.registerModule("export", Export);

	var Filter = function Filter(table) {

		this.table = table; //hold Tabulator object

		this.filterList = []; //hold filter list
		this.headerFilters = {}; //hold column filters
		this.headerFilterColumns = []; //hold columns that use header filters

		this.prevHeaderFilterChangeCheck = "";
		this.prevHeaderFilterChangeCheck = "{}";

		this.changed = false; //has filtering changed since last render
	};

	//initialize column header filter
	Filter.prototype.initializeColumn = function (column, value) {
		var self = this,
		    field = column.getField();

		//handle successfull value change
		function success(value) {
			var filterType = column.modules.filter.tagType == "input" && column.modules.filter.attrType == "text" || column.modules.filter.tagType == "textarea" ? "partial" : "match",
			    type = "",
			    filterChangeCheck = "",
			    filterFunc;

			if (typeof column.modules.filter.prevSuccess === "undefined" || column.modules.filter.prevSuccess !== value) {

				column.modules.filter.prevSuccess = value;

				if (!column.modules.filter.emptyFunc(value)) {
					column.modules.filter.value = value;

					switch (_typeof(column.definition.headerFilterFunc)) {
						case "string":
							if (self.filters[column.definition.headerFilterFunc]) {
								type = column.definition.headerFilterFunc;
								filterFunc = function filterFunc(data) {
									var params = column.definition.headerFilterFuncParams || {};
									var fieldVal = column.getFieldValue(data);

									params = typeof params === "function" ? params(value, fieldVal, data) : params;

									return self.filters[column.definition.headerFilterFunc](value, fieldVal, data, params);
								};
							} else {
								console.warn("Header Filter Error - Matching filter function not found: ", column.definition.headerFilterFunc);
							}
							break;

						case "function":
							filterFunc = function filterFunc(data) {
								var params = column.definition.headerFilterFuncParams || {};
								var fieldVal = column.getFieldValue(data);

								params = typeof params === "function" ? params(value, fieldVal, data) : params;

								return column.definition.headerFilterFunc(value, fieldVal, data, params);
							};

							type = filterFunc;
							break;
					}

					if (!filterFunc) {
						switch (filterType) {
							case "partial":
								filterFunc = function filterFunc(data) {
									var colVal = column.getFieldValue(data);

									if (typeof colVal !== 'undefined' && colVal !== null) {
										return String(colVal).toLowerCase().indexOf(String(value).toLowerCase()) > -1;
									} else {
										return false;
									}
								};
								type = "like";
								break;

							default:
								filterFunc = function filterFunc(data) {
									return column.getFieldValue(data) == value;
								};
								type = "=";
						}
					}

					self.headerFilters[field] = { value: value, func: filterFunc, type: type, params:  {} };
				} else {
					delete self.headerFilters[field];
				}

				filterChangeCheck = JSON.stringify(self.headerFilters);

				if (self.prevHeaderFilterChangeCheck !== filterChangeCheck) {
					self.prevHeaderFilterChangeCheck = filterChangeCheck;

					self.changed = true;
					self.table.rowManager.filterRefresh();
				}
			}

			return true;
		}

		column.modules.filter = {
			success: success,
			attrType: false,
			tagType: false,
			emptyFunc: false
		};

		this.generateHeaderFilterElement(column);
	};

	Filter.prototype.generateHeaderFilterElement = function (column, initialValue, reinitialize) {
		var _this54 = this;

		var self = this,
		    success = column.modules.filter.success,
		    field = column.getField(),
		    filterElement,
		    editor,
		    editorElement,
		    cellWrapper,
		    typingTimer,
		    searchTrigger,
		    params;

		//handle aborted edit
		function cancel() {}

		if (column.modules.filter.headerElement && column.modules.filter.headerElement.parentNode) {
			column.contentElement.removeChild(column.modules.filter.headerElement.parentNode);
		}

		if (field) {

			//set empty value function
			column.modules.filter.emptyFunc = column.definition.headerFilterEmptyCheck || function (value) {
				return !value && value !== "0";
			};

			filterElement = document.createElement("div");
			filterElement.classList.add("tabulator-header-filter");

			//set column editor
			switch (_typeof(column.definition.headerFilter)) {
				case "string":
					if (self.table.modules.edit.editors[column.definition.headerFilter]) {
						editor = self.table.modules.edit.editors[column.definition.headerFilter];

						if ((column.definition.headerFilter === "tick" || column.definition.headerFilter === "tickCross") && !column.definition.headerFilterEmptyCheck) {
							column.modules.filter.emptyFunc = function (value) {
								return value !== true && value !== false;
							};
						}
					} else {
						console.warn("Filter Error - Cannot build header filter, No such editor found: ", column.definition.editor);
					}
					break;

				case "function":
					editor = column.definition.headerFilter;
					break;

				case "boolean":
					if (column.modules.edit && column.modules.edit.editor) {
						editor = column.modules.edit.editor;
					} else {
						if (column.definition.formatter && self.table.modules.edit.editors[column.definition.formatter]) {
							editor = self.table.modules.edit.editors[column.definition.formatter];

							if ((column.definition.formatter === "tick" || column.definition.formatter === "tickCross") && !column.definition.headerFilterEmptyCheck) {
								column.modules.filter.emptyFunc = function (value) {
									return value !== true && value !== false;
								};
							}
						} else {
							editor = self.table.modules.edit.editors["input"];
						}
					}
					break;
			}

			if (editor) {

				cellWrapper = {
					getValue: function getValue() {
						return typeof initialValue !== "undefined" ? initialValue : "";
					},
					getField: function getField() {
						return column.definition.field;
					},
					getElement: function getElement() {
						return filterElement;
					},
					getColumn: function getColumn() {
						return column.getComponent();
					},
					getRow: function getRow() {
						return {
							normalizeHeight: function normalizeHeight() {}
						};
					}
				};

				params = column.definition.headerFilterParams || {};

				params = typeof params === "function" ? params.call(self.table) : params;

				editorElement = editor.call(this.table.modules.edit, cellWrapper, function () {}, success, cancel, params);

				if (!editorElement) {
					console.warn("Filter Error - Cannot add filter to " + field + " column, editor returned a value of false");
					return;
				}

				if (!(editorElement instanceof Node)) {
					console.warn("Filter Error - Cannot add filter to " + field + " column, editor should return an instance of Node, the editor returned:", editorElement);
					return;
				}

				//set Placeholder Text
				if (field) {
					self.table.modules.localize.bind("headerFilters|columns|" + column.definition.field, function (value) {
						editorElement.setAttribute("placeholder", typeof value !== "undefined" && value ? value : self.table.modules.localize.getText("headerFilters|default"));
					});
				} else {
					self.table.modules.localize.bind("headerFilters|default", function (value) {
						editorElement.setAttribute("placeholder", typeof self.column.definition.headerFilterPlaceholder !== "undefined" && self.column.definition.headerFilterPlaceholder ? self.column.definition.headerFilterPlaceholder : value);
					});
				}

				//focus on element on click
				editorElement.addEventListener("click", function (e) {
					e.stopPropagation();
					editorElement.focus();
				});

				editorElement.addEventListener("focus", function (e) {
					var left = _this54.table.columnManager.element.scrollLeft;

					if (left !== _this54.table.rowManager.element.scrollLeft) {
						_this54.table.rowManager.scrollHorizontal(left);
						_this54.table.columnManager.scrollHorizontal(left);
					}
				});

				//live update filters as user types
				typingTimer = false;

				searchTrigger = function searchTrigger(e) {
					if (typingTimer) {
						clearTimeout(typingTimer);
					}

					typingTimer = setTimeout(function () {
						success(editorElement.value);
					}, self.table.options.headerFilterLiveFilterDelay);
				};

				column.modules.filter.headerElement = editorElement;
				column.modules.filter.attrType = editorElement.hasAttribute("type") ? editorElement.getAttribute("type").toLowerCase() : "";
				column.modules.filter.tagType = editorElement.tagName.toLowerCase();

				if (column.definition.headerFilterLiveFilter !== false) {

					if (!(column.definition.headerFilter === 'autocomplete' || column.definition.headerFilter === 'tickCross' || (column.definition.editor === 'autocomplete' || column.definition.editor === 'tickCross') && column.definition.headerFilter === true)) {
						editorElement.addEventListener("keyup", searchTrigger);
						editorElement.addEventListener("search", searchTrigger);

						//update number filtered columns on change
						if (column.modules.filter.attrType == "number") {
							editorElement.addEventListener("change", function (e) {
								success(editorElement.value);
							});
						}

						//change text inputs to search inputs to allow for clearing of field
						if (column.modules.filter.attrType == "text" && this.table.browser !== "ie") {
							editorElement.setAttribute("type", "search");
							// editorElement.off("change blur"); //prevent blur from triggering filter and preventing selection click
						}
					}

					//prevent input and select elements from propegating click to column sorters etc
					if (column.modules.filter.tagType == "input" || column.modules.filter.tagType == "select" || column.modules.filter.tagType == "textarea") {
						editorElement.addEventListener("mousedown", function (e) {
							e.stopPropagation();
						});
					}
				}

				filterElement.appendChild(editorElement);

				column.contentElement.appendChild(filterElement);

				if (!reinitialize) {
					self.headerFilterColumns.push(column);
				}
			}
		} else {
			console.warn("Filter Error - Cannot add header filter, column has no field set:", column.definition.title);
		}
	};

	//hide all header filter elements (used to ensure correct column widths in "fitData" layout mode)
	Filter.prototype.hideHeaderFilterElements = function () {
		this.headerFilterColumns.forEach(function (column) {
			if (column.modules.filter && column.modules.filter.headerElement) {
				column.modules.filter.headerElement.style.display = 'none';
			}
		});
	};

	//show all header filter elements (used to ensure correct column widths in "fitData" layout mode)
	Filter.prototype.showHeaderFilterElements = function () {
		this.headerFilterColumns.forEach(function (column) {
			if (column.modules.filter && column.modules.filter.headerElement) {
				column.modules.filter.headerElement.style.display = '';
			}
		});
	};

	//programatically set focus of header filter
	Filter.prototype.setHeaderFilterFocus = function (column) {
		if (column.modules.filter && column.modules.filter.headerElement) {
			column.modules.filter.headerElement.focus();
		} else {
			console.warn("Column Filter Focus Error - No header filter set on column:", column.getField());
		}
	};

	//programmatically get value of header filter
	Filter.prototype.getHeaderFilterValue = function (column) {
		if (column.modules.filter && column.modules.filter.headerElement) {
			return column.modules.filter.headerElement.value;
		} else {
			console.warn("Column Filter Error - No header filter set on column:", column.getField());
		}
	};

	//programatically set value of header filter
	Filter.prototype.setHeaderFilterValue = function (column, value) {
		if (column) {
			if (column.modules.filter && column.modules.filter.headerElement) {
				this.generateHeaderFilterElement(column, value, true);
				column.modules.filter.success(value);
			} else {
				console.warn("Column Filter Error - No header filter set on column:", column.getField());
			}
		}
	};

	Filter.prototype.reloadHeaderFilter = function (column) {
		if (column) {
			if (column.modules.filter && column.modules.filter.headerElement) {
				this.generateHeaderFilterElement(column, column.modules.filter.value, true);
			} else {
				console.warn("Column Filter Error - No header filter set on column:", column.getField());
			}
		}
	};

	//check if the filters has changed since last use
	Filter.prototype.hasChanged = function () {
		var changed = this.changed;
		this.changed = false;
		return changed;
	};

	//set standard filters
	Filter.prototype.setFilter = function (field, type, value, params) {
		var self = this;

		self.filterList = [];

		if (!Array.isArray(field)) {
			field = [{ field: field, type: type, value: value, params: params }];
		}

		self.addFilter(field);
	};

	//add filter to array
	Filter.prototype.addFilter = function (field, type, value, params) {
		var self = this;

		if (!Array.isArray(field)) {
			field = [{ field: field, type: type, value: value, params: params }];
		}

		field.forEach(function (filter) {

			filter = self.findFilter(filter);

			if (filter) {
				self.filterList.push(filter);

				self.changed = true;
			}
		});

		if (this.table.options.persistence && this.table.modExists("persistence", true) && this.table.modules.persistence.config.filter) {
			this.table.modules.persistence.save("filter");
		}
	};

	Filter.prototype.findFilter = function (filter) {
		var self = this,
		    column;

		if (Array.isArray(filter)) {
			return this.findSubFilters(filter);
		}

		var filterFunc = false;

		if (typeof filter.field == "function") {
			filterFunc = function filterFunc(data) {
				return filter.field(data, filter.type || {}); // pass params to custom filter function
			};
		} else {

			if (self.filters[filter.type]) {

				column = self.table.columnManager.getColumnByField(filter.field);

				if (column) {
					filterFunc = function filterFunc(data) {
						return self.filters[filter.type](filter.value, column.getFieldValue(data), data, filter.params || {});
					};
				} else {
					filterFunc = function filterFunc(data) {
						return self.filters[filter.type](filter.value, data[filter.field], data, filter.params || {});
					};
				}
			} else {
				console.warn("Filter Error - No such filter type found, ignoring: ", filter.type);
			}
		}

		filter.func = filterFunc;

		return filter.func ? filter : false;
	};

	Filter.prototype.findSubFilters = function (filters) {
		var self = this,
		    output = [];

		filters.forEach(function (filter) {
			filter = self.findFilter(filter);

			if (filter) {
				output.push(filter);
			}
		});

		return output.length ? output : false;
	};

	//get all filters
	Filter.prototype.getFilters = function (all, ajax) {
		var output = [];

		if (all) {
			output = this.getHeaderFilters();
		}

		if (ajax) {
			output.forEach(function (item) {
				if (typeof item.type == "function") {
					item.type = "function";
				}
			});
		}

		output = output.concat(this.filtersToArray(this.filterList, ajax));

		return output;
	};

	//filter to Object
	Filter.prototype.filtersToArray = function (filterList, ajax) {
		var _this55 = this;

		var output = [];

		filterList.forEach(function (filter) {
			var item;

			if (Array.isArray(filter)) {
				output.push(_this55.filtersToArray(filter, ajax));
			} else {
				item = { field: filter.field, type: filter.type, value: filter.value };

				if (ajax) {
					if (typeof item.type == "function") {
						item.type = "function";
					}
				}

				output.push(item);
			}
		});

		return output;
	};

	//get all filters
	Filter.prototype.getHeaderFilters = function () {
		var output = [];

		for (var key in this.headerFilters) {
			output.push({ field: key, type: this.headerFilters[key].type, value: this.headerFilters[key].value });
		}

		return output;
	};

	//remove filter from array
	Filter.prototype.removeFilter = function (field, type, value) {
		var self = this;

		if (!Array.isArray(field)) {
			field = [{ field: field, type: type, value: value }];
		}

		field.forEach(function (filter) {
			var index = -1;

			if (_typeof(filter.field) == "object") {
				index = self.filterList.findIndex(function (element) {
					return filter === element;
				});
			} else {
				index = self.filterList.findIndex(function (element) {
					return filter.field === element.field && filter.type === element.type && filter.value === element.value;
				});
			}

			if (index > -1) {
				self.filterList.splice(index, 1);
				self.changed = true;
			} else {
				console.warn("Filter Error - No matching filter type found, ignoring: ", filter.type);
			}
		});

		if (this.table.options.persistence && this.table.modExists("persistence", true) && this.table.modules.persistence.config.filter) {
			this.table.modules.persistence.save("filter");
		}
	};

	//clear filters
	Filter.prototype.clearFilter = function (all) {
		this.filterList = [];

		if (all) {
			this.clearHeaderFilter();
		}

		this.changed = true;

		if (this.table.options.persistence && this.table.modExists("persistence", true) && this.table.modules.persistence.config.filter) {
			this.table.modules.persistence.save("filter");
		}
	};

	//clear header filters
	Filter.prototype.clearHeaderFilter = function () {
		var self = this;

		this.headerFilters = {};
		self.prevHeaderFilterChangeCheck = "{}";

		this.headerFilterColumns.forEach(function (column) {
			column.modules.filter.value = null;
			column.modules.filter.prevSuccess = undefined;
			self.reloadHeaderFilter(column);
		});

		this.changed = true;
	};

	//search data and return matching rows
	Filter.prototype.search = function (searchType, field, type, value) {
		var self = this,
		    activeRows = [],
		    filterList = [];

		if (!Array.isArray(field)) {
			field = [{ field: field, type: type, value: value }];
		}

		field.forEach(function (filter) {
			filter = self.findFilter(filter);

			if (filter) {
				filterList.push(filter);
			}
		});

		this.table.rowManager.rows.forEach(function (row) {
			var match = true;

			filterList.forEach(function (filter) {
				if (!self.filterRecurse(filter, row.getData())) {
					match = false;
				}
			});

			if (match) {
				activeRows.push(searchType === "data" ? row.getData("data") : row.getComponent());
			}
		});

		return activeRows;
	};

	//filter row array
	Filter.prototype.filter = function (rowList, filters) {
		var self = this,
		    activeRows = [],
		    activeRowComponents = [];

		if (self.table.options.dataFiltering) {
			self.table.options.dataFiltering.call(self.table, self.getFilters());
		}

		if (!self.table.options.ajaxFiltering && (self.filterList.length || Object.keys(self.headerFilters).length)) {

			rowList.forEach(function (row) {
				if (self.filterRow(row)) {
					activeRows.push(row);
				}
			});
		} else {
			activeRows = rowList.slice(0);
		}

		if (self.table.options.dataFiltered) {

			activeRows.forEach(function (row) {
				activeRowComponents.push(row.getComponent());
			});

			self.table.options.dataFiltered.call(self.table, self.getFilters(), activeRowComponents);
		}

		return activeRows;
	};

	//filter individual row
	Filter.prototype.filterRow = function (row, filters) {
		var self = this,
		    match = true,
		    data = row.getData();

		self.filterList.forEach(function (filter) {
			if (!self.filterRecurse(filter, data)) {
				match = false;
			}
		});

		for (var field in self.headerFilters) {
			if (!self.headerFilters[field].func(data)) {
				match = false;
			}
		}

		return match;
	};

	Filter.prototype.filterRecurse = function (filter, data) {
		var self = this,
		    match = false;

		if (Array.isArray(filter)) {
			filter.forEach(function (subFilter) {
				if (self.filterRecurse(subFilter, data)) {
					match = true;
				}
			});
		} else {
			match = filter.func(data);
		}

		return match;
	};

	//list of available filters
	Filter.prototype.filters = {

		//equal to
		"=": function _(filterVal, rowVal, rowData, filterParams) {
			return rowVal == filterVal ? true : false;
		},

		//less than
		"<": function _(filterVal, rowVal, rowData, filterParams) {
			return rowVal < filterVal ? true : false;
		},

		//less than or equal to
		"<=": function _(filterVal, rowVal, rowData, filterParams) {
			return rowVal <= filterVal ? true : false;
		},

		//greater than
		">": function _(filterVal, rowVal, rowData, filterParams) {
			return rowVal > filterVal ? true : false;
		},

		//greater than or equal to
		">=": function _(filterVal, rowVal, rowData, filterParams) {
			return rowVal >= filterVal ? true : false;
		},

		//not equal to
		"!=": function _(filterVal, rowVal, rowData, filterParams) {
			return rowVal != filterVal ? true : false;
		},

		"regex": function regex(filterVal, rowVal, rowData, filterParams) {

			if (typeof filterVal == "string") {
				filterVal = new RegExp(filterVal);
			}

			return filterVal.test(rowVal);
		},

		//contains the string
		"like": function like(filterVal, rowVal, rowData, filterParams) {
			if (filterVal === null || typeof filterVal === "undefined") {
				return rowVal === filterVal ? true : false;
			} else {
				if (typeof rowVal !== 'undefined' && rowVal !== null) {
					return String(rowVal).toLowerCase().indexOf(filterVal.toLowerCase()) > -1;
				} else {
					return false;
				}
			}
		},

		//contains the keywords
		"keywords": function keywords(filterVal, rowVal, rowData, filterParams) {
			var keywords = filterVal.toLowerCase().split(typeof filterParams.separator === "undefined" ? " " : filterParams.separator),
			    value = String(rowVal === null || typeof rowVal === "undefined" ? "" : rowVal).toLowerCase(),
			    matches = [];

			keywords.forEach(function (keyword) {
				if (value.includes(keyword)) {
					matches.push(true);
				}
			});

			return filterParams.matchAll ? matches.length === keywords.length : !!matches.length;
		},

		//starts with the string
		"starts": function starts(filterVal, rowVal, rowData, filterParams) {
			if (filterVal === null || typeof filterVal === "undefined") {
				return rowVal === filterVal ? true : false;
			} else {
				if (typeof rowVal !== 'undefined' && rowVal !== null) {
					return String(rowVal).toLowerCase().startsWith(filterVal.toLowerCase());
				} else {
					return false;
				}
			}
		},

		//ends with the string
		"ends": function ends(filterVal, rowVal, rowData, filterParams) {
			if (filterVal === null || typeof filterVal === "undefined") {
				return rowVal === filterVal ? true : false;
			} else {
				if (typeof rowVal !== 'undefined' && rowVal !== null) {
					return String(rowVal).toLowerCase().endsWith(filterVal.toLowerCase());
				} else {
					return false;
				}
			}
		},

		//in array
		"in": function _in(filterVal, rowVal, rowData, filterParams) {
			if (Array.isArray(filterVal)) {
				return filterVal.length ? filterVal.indexOf(rowVal) > -1 : true;
			} else {
				console.warn("Filter Error - filter value is not an array:", filterVal);
				return false;
			}
		}
	};

	Tabulator.prototype.registerModule("filter", Filter);

	var Format = function Format(table) {
		this.table = table; //hold Tabulator object
	};

	//initialize column formatter
	Format.prototype.initializeColumn = function (column) {
		column.modules.format = this.lookupFormatter(column, "");

		if (typeof column.definition.formatterPrint !== "undefined") {
			column.modules.format.print = this.lookupFormatter(column, "Print");
		}

		if (typeof column.definition.formatterClipboard !== "undefined") {
			column.modules.format.clipboard = this.lookupFormatter(column, "Clipboard");
		}

		if (typeof column.definition.formatterHtmlOutput !== "undefined") {
			column.modules.format.htmlOutput = this.lookupFormatter(column, "HtmlOutput");
		}
	};

	Format.prototype.lookupFormatter = function (column, type) {
		var config = { params: column.definition["formatter" + type + "Params"] || {} },
		    formatter = column.definition["formatter" + type];

		//set column formatter
		switch (typeof formatter === 'undefined' ? 'undefined' : _typeof(formatter)) {
			case "string":

				if (formatter === "tick") {
					formatter = "tickCross";

					if (typeof config.params.crossElement == "undefined") {
						config.params.crossElement = false;
					}

					console.warn("DEPRECATION WARNING - the tick formatter has been deprecated, please use the tickCross formatter with the crossElement param set to false");
				}

				if (this.formatters[formatter]) {
					config.formatter = this.formatters[formatter];
				} else {
					console.warn("Formatter Error - No such formatter found: ", formatter);
					config.formatter = this.formatters.plaintext;
				}
				break;

			case "function":
				config.formatter = formatter;
				break;

			default:
				config.formatter = this.formatters.plaintext;
				break;
		}

		return config;
	};

	Format.prototype.cellRendered = function (cell) {
		if (cell.modules.format && cell.modules.format.renderedCallback) {
			cell.modules.format.renderedCallback();
		}
	};

	//return a formatted value for a cell
	Format.prototype.formatValue = function (cell) {
		var component = cell.getComponent(),
		    params = typeof cell.column.modules.format.params === "function" ? cell.column.modules.format.params(component) : cell.column.modules.format.params;

		function onRendered(callback) {
			if (!cell.modules.format) {
				cell.modules.format = {};
			}

			cell.modules.format.renderedCallback = callback;
		}

		return cell.column.modules.format.formatter.call(this, component, params, onRendered);
	};

	Format.prototype.formatExportValue = function (cell, type) {
		var formatter = cell.column.modules.format[type],
		    params;

		if (formatter) {
			var onRendered = function onRendered(callback) {
				if (!cell.modules.format) {
					cell.modules.format = {};
				}

				cell.modules.format.renderedCallback = callback;
			};

			params = typeof formatter.params === "function" ? formatter.params(component) : formatter.params;

			return formatter.formatter.call(this, cell.getComponent(), params, onRendered);
		} else {
			return this.formatValue(cell);
		}
	};

	Format.prototype.sanitizeHTML = function (value) {
		if (value) {
			var entityMap = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
				'/': '&#x2F;',
				'`': '&#x60;',
				'=': '&#x3D;'
			};

			return String(value).replace(/[&<>"'`=\/]/g, function (s) {
				return entityMap[s];
			});
		} else {
			return value;
		}
	};

	Format.prototype.emptyToSpace = function (value) {
		return value === null || typeof value === "undefined" || value === "" ? "&nbsp;" : value;
	};

	//get formatter for cell
	Format.prototype.getFormatter = function (formatter) {
		var formatter;

		switch (typeof formatter === 'undefined' ? 'undefined' : _typeof(formatter)) {
			case "string":
				if (this.formatters[formatter]) {
					formatter = this.formatters[formatter];
				} else {
					console.warn("Formatter Error - No such formatter found: ", formatter);
					formatter = this.formatters.plaintext;
				}
				break;

			case "function":
				formatter = formatter;
				break;

			default:
				formatter = this.formatters.plaintext;
				break;
		}

		return formatter;
	};

	//default data formatters
	Format.prototype.formatters = {
		//plain text value
		plaintext: function plaintext(cell, formatterParams, onRendered) {
			return this.emptyToSpace(this.sanitizeHTML(cell.getValue()));
		},

		//html text value
		html: function html(cell, formatterParams, onRendered) {
			return cell.getValue();
		},

		//multiline text area
		textarea: function textarea(cell, formatterParams, onRendered) {
			cell.getElement().style.whiteSpace = "pre-wrap";
			return this.emptyToSpace(this.sanitizeHTML(cell.getValue()));
		},

		//currency formatting
		money: function money(cell, formatterParams, onRendered) {
			var floatVal = parseFloat(cell.getValue()),
			    number,
			    integer,
			    decimal,
			    rgx;

			var decimalSym = formatterParams.decimal || ".";
			var thousandSym = formatterParams.thousand || ",";
			var symbol = formatterParams.symbol || "";
			var after = !!formatterParams.symbolAfter;
			var precision = typeof formatterParams.precision !== "undefined" ? formatterParams.precision : 2;

			if (isNaN(floatVal)) {
				return this.emptyToSpace(this.sanitizeHTML(cell.getValue()));
			}

			number = precision !== false ? floatVal.toFixed(precision) : floatVal;
			number = String(number).split(".");

			integer = number[0];
			decimal = number.length > 1 ? decimalSym + number[1] : "";

			rgx = /(\d+)(\d{3})/;

			while (rgx.test(integer)) {
				integer = integer.replace(rgx, "$1" + thousandSym + "$2");
			}

			return after ? integer + decimal + symbol : symbol + integer + decimal;
		},

		//clickable anchor tag
		link: function link(cell, formatterParams, onRendered) {
			var value = cell.getValue(),
			    urlPrefix = formatterParams.urlPrefix || "",
			    download = formatterParams.download,
			    label = value,
			    el = document.createElement("a"),
			    data;

			if (formatterParams.labelField) {
				data = cell.getData();
				label = data[formatterParams.labelField];
			}

			if (formatterParams.label) {
				switch (_typeof(formatterParams.label)) {
					case "string":
						label = formatterParams.label;
						break;

					case "function":
						label = formatterParams.label(cell);
						break;
				}
			}

			if (label) {
				if (formatterParams.urlField) {
					data = cell.getData();
					value = data[formatterParams.urlField];
				}

				if (formatterParams.url) {
					switch (_typeof(formatterParams.url)) {
						case "string":
							value = formatterParams.url;
							break;

						case "function":
							value = formatterParams.url(cell);
							break;
					}
				}

				el.setAttribute("href", urlPrefix + value);

				if (formatterParams.target) {
					el.setAttribute("target", formatterParams.target);
				}

				if (formatterParams.download) {

					if (typeof download == "function") {
						download = download(cell);
					} else {
						download = download === true ? "" : download;
					}

					el.setAttribute("download", download);
				}

				el.innerHTML = this.emptyToSpace(this.sanitizeHTML(label));

				return el;
			} else {
				return "&nbsp;";
			}
		},

		//image element
		image: function image(cell, formatterParams, onRendered) {
			var el = document.createElement("img");
			el.setAttribute("src", cell.getValue());

			switch (_typeof(formatterParams.height)) {
				case "number":
					el.style.height = formatterParams.height + "px";
					break;

				case "string":
					el.style.height = formatterParams.height;
					break;
			}

			switch (_typeof(formatterParams.width)) {
				case "number":
					el.style.width = formatterParams.width + "px";
					break;

				case "string":
					el.style.width = formatterParams.width;
					break;
			}

			el.addEventListener("load", function () {
				cell.getRow().normalizeHeight();
			});

			return el;
		},

		//tick or cross
		tickCross: function tickCross(cell, formatterParams, onRendered) {
			var value = cell.getValue(),
			    element = cell.getElement(),
			    empty = formatterParams.allowEmpty,
			    truthy = formatterParams.allowTruthy,
			    tick = typeof formatterParams.tickElement !== "undefined" ? formatterParams.tickElement : '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>',
			    cross = typeof formatterParams.crossElement !== "undefined" ? formatterParams.crossElement : '<svg enable-background="new 0 0 24 24" height="14" width="14"  viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';

			if (truthy && value || value === true || value === "true" || value === "True" || value === 1 || value === "1") {
				element.setAttribute("aria-checked", true);
				return tick || "";
			} else {
				if (empty && (value === "null" || value === "" || value === null || typeof value === "undefined")) {
					element.setAttribute("aria-checked", "mixed");
					return "";
				} else {
					element.setAttribute("aria-checked", false);
					return cross || "";
				}
			}
		},

		datetime: function datetime(cell, formatterParams, onRendered) {
			var inputFormat = formatterParams.inputFormat || "YYYY-MM-DD hh:mm:ss";
			var outputFormat = formatterParams.outputFormat || "DD/MM/YYYY hh:mm:ss";
			var invalid = typeof formatterParams.invalidPlaceholder !== "undefined" ? formatterParams.invalidPlaceholder : "";
			var value = cell.getValue();

			var newDatetime = moment(value, inputFormat);

			if (newDatetime.isValid()) {
				return formatterParams.timezone ? newDatetime.tz(formatterParams.timezone).format(outputFormat) : newDatetime.format(outputFormat);
			} else {

				if (invalid === true) {
					return value;
				} else if (typeof invalid === "function") {
					return invalid(value);
				} else {
					return invalid;
				}
			}
		},

		datetimediff: function datetime(cell, formatterParams, onRendered) {
			var inputFormat = formatterParams.inputFormat || "YYYY-MM-DD hh:mm:ss";
			var invalid = typeof formatterParams.invalidPlaceholder !== "undefined" ? formatterParams.invalidPlaceholder : "";
			var suffix = typeof formatterParams.suffix !== "undefined" ? formatterParams.suffix : false;
			var unit = typeof formatterParams.unit !== "undefined" ? formatterParams.unit : undefined;
			var humanize = typeof formatterParams.humanize !== "undefined" ? formatterParams.humanize : false;
			var date = typeof formatterParams.date !== "undefined" ? formatterParams.date : moment();
			var value = cell.getValue();

			var newDatetime = moment(value, inputFormat);

			if (newDatetime.isValid()) {
				if (humanize) {
					return moment.duration(newDatetime.diff(date)).humanize(suffix);
				} else {
					return newDatetime.diff(date, unit) + (suffix ? " " + suffix : "");
				}
			} else {

				if (invalid === true) {
					return value;
				} else if (typeof invalid === "function") {
					return invalid(value);
				} else {
					return invalid;
				}
			}
		},

		//select
		lookup: function lookup(cell, formatterParams, onRendered) {
			var value = cell.getValue();

			if (typeof formatterParams[value] === "undefined") {
				console.warn('Missing display value for ' + value);
				return value;
			}

			return formatterParams[value];
		},

		//star rating
		star: function star(cell, formatterParams, onRendered) {
			var value = cell.getValue(),
			    element = cell.getElement(),
			    maxStars = formatterParams && formatterParams.stars ? formatterParams.stars : 5,
			    stars = document.createElement("span"),
			    star = document.createElementNS('http://www.w3.org/2000/svg', "svg"),
			    starActive = '<polygon fill="#FFEA00" stroke="#C1AB60" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>',
			    starInactive = '<polygon fill="#D2D2D2" stroke="#686868" stroke-width="37.6152" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="259.216,29.942 330.27,173.919 489.16,197.007 374.185,309.08 401.33,467.31 259.216,392.612 117.104,467.31 144.25,309.08 29.274,197.007 188.165,173.919 "/>';

			//style stars holder
			stars.style.verticalAlign = "middle";

			//style star
			star.setAttribute("width", "14");
			star.setAttribute("height", "14");
			star.setAttribute("viewBox", "0 0 512 512");
			star.setAttribute("xml:space", "preserve");
			star.style.padding = "0 1px";

			value = value && !isNaN(value) ? parseInt(value) : 0;

			value = Math.max(0, Math.min(value, maxStars));

			for (var i = 1; i <= maxStars; i++) {
				var nextStar = star.cloneNode(true);
				nextStar.innerHTML = i <= value ? starActive : starInactive;

				stars.appendChild(nextStar);
			}

			element.style.whiteSpace = "nowrap";
			element.style.overflow = "hidden";
			element.style.textOverflow = "ellipsis";

			element.setAttribute("aria-label", value);

			return stars;
		},

		traffic: function traffic(cell, formatterParams, onRendered) {
			var value = this.sanitizeHTML(cell.getValue()) || 0,
			    el = document.createElement("span"),
			    max = formatterParams && formatterParams.max ? formatterParams.max : 100,
			    min = formatterParams && formatterParams.min ? formatterParams.min : 0,
			    colors = formatterParams && typeof formatterParams.color !== "undefined" ? formatterParams.color : ["red", "orange", "green"],
			    color = "#666666",
			    percent,
			    percentValue;

			if (isNaN(value) || typeof cell.getValue() === "undefined") {
				return;
			}

			el.classList.add("tabulator-traffic-light");

			//make sure value is in range
			percentValue = parseFloat(value) <= max ? parseFloat(value) : max;
			percentValue = parseFloat(percentValue) >= min ? parseFloat(percentValue) : min;

			//workout percentage
			percent = (max - min) / 100;
			percentValue = Math.round((percentValue - min) / percent);

			//set color
			switch (typeof colors === 'undefined' ? 'undefined' : _typeof(colors)) {
				case "string":
					color = colors;
					break;
				case "function":
					color = colors(value);
					break;
				case "object":
					if (Array.isArray(colors)) {
						var unit = 100 / colors.length;
						var index = Math.floor(percentValue / unit);

						index = Math.min(index, colors.length - 1);
						index = Math.max(index, 0);
						color = colors[index];
						break;
					}
			}

			el.style.backgroundColor = color;

			return el;
		},

		//progress bar
		progress: function progress(cell, formatterParams, onRendered) {
			//progress bar
			var value = this.sanitizeHTML(cell.getValue()) || 0,
			    element = cell.getElement(),
			    max = formatterParams && formatterParams.max ? formatterParams.max : 100,
			    min = formatterParams && formatterParams.min ? formatterParams.min : 0,
			    legendAlign = formatterParams && formatterParams.legendAlign ? formatterParams.legendAlign : "center",
			    percent,
			    percentValue,
			    color,
			    legend,
			    legendColor;

			//make sure value is in range
			percentValue = parseFloat(value) <= max ? parseFloat(value) : max;
			percentValue = parseFloat(percentValue) >= min ? parseFloat(percentValue) : min;

			//workout percentage
			percent = (max - min) / 100;
			percentValue = Math.round((percentValue - min) / percent);

			//set bar color
			switch (_typeof(formatterParams.color)) {
				case "string":
					color = formatterParams.color;
					break;
				case "function":
					color = formatterParams.color(value);
					break;
				case "object":
					if (Array.isArray(formatterParams.color)) {
						var unit = 100 / formatterParams.color.length;
						var index = Math.floor(percentValue / unit);

						index = Math.min(index, formatterParams.color.length - 1);
						index = Math.max(index, 0);
						color = formatterParams.color[index];
						break;
					}
				default:
					color = "#2DC214";
			}

			//generate legend
			switch (_typeof(formatterParams.legend)) {
				case "string":
					legend = formatterParams.legend;
					break;
				case "function":
					legend = formatterParams.legend(value);
					break;
				case "boolean":
					legend = value;
					break;
				default:
					legend = false;
			}

			//set legend color
			switch (_typeof(formatterParams.legendColor)) {
				case "string":
					legendColor = formatterParams.legendColor;
					break;
				case "function":
					legendColor = formatterParams.legendColor(value);
					break;
				case "object":
					if (Array.isArray(formatterParams.legendColor)) {
						var unit = 100 / formatterParams.legendColor.length;
						var index = Math.floor(percentValue / unit);

						index = Math.min(index, formatterParams.legendColor.length - 1);
						index = Math.max(index, 0);
						legendColor = formatterParams.legendColor[index];
					}
					break;
				default:
					legendColor = "#000";
			}

			element.style.minWidth = "30px";
			element.style.position = "relative";

			element.setAttribute("aria-label", percentValue);

			var barEl = document.createElement("div");
			barEl.style.display = "inline-block";
			barEl.style.position = "relative";
			barEl.style.width = percentValue + "%";
			barEl.style.backgroundColor = color;
			barEl.style.height = "100%";

			barEl.setAttribute('data-max', max);
			barEl.setAttribute('data-min', min);

			if (legend) {
				var legendEl = document.createElement("div");
				legendEl.style.position = "absolute";
				legendEl.style.top = "4px";
				legendEl.style.left = 0;
				legendEl.style.textAlign = legendAlign;
				legendEl.style.width = "100%";
				legendEl.style.color = legendColor;
				legendEl.innerHTML = legend;
			}

			onRendered(function () {

				//handle custom element needed if formatter is to be included in printed/downloaded output
				if (!(cell instanceof CellComponent)) {
					var holderEl = document.createElement("div");
					holderEl.style.position = "absolute";
					holderEl.style.top = "4px";
					holderEl.style.bottom = "4px";
					holderEl.style.left = "4px";
					holderEl.style.right = "4px";

					element.appendChild(holderEl);

					element = holderEl;
				}

				element.appendChild(barEl);

				if (legend) {
					element.appendChild(legendEl);
				}
			});

			return "";
		},

		//background color
		color: function color(cell, formatterParams, onRendered) {
			cell.getElement().style.backgroundColor = this.sanitizeHTML(cell.getValue());
			return "";
		},

		//tick icon
		buttonTick: function buttonTick(cell, formatterParams, onRendered) {
			return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#2DC214" clip-rule="evenodd" d="M21.652,3.211c-0.293-0.295-0.77-0.295-1.061,0L9.41,14.34  c-0.293,0.297-0.771,0.297-1.062,0L3.449,9.351C3.304,9.203,3.114,9.13,2.923,9.129C2.73,9.128,2.534,9.201,2.387,9.351  l-2.165,1.946C0.078,11.445,0,11.63,0,11.823c0,0.194,0.078,0.397,0.223,0.544l4.94,5.184c0.292,0.296,0.771,0.776,1.062,1.07  l2.124,2.141c0.292,0.293,0.769,0.293,1.062,0l14.366-14.34c0.293-0.294,0.293-0.777,0-1.071L21.652,3.211z" fill-rule="evenodd"/></svg>';
		},

		//cross icon
		buttonCross: function buttonCross(cell, formatterParams, onRendered) {
			return '<svg enable-background="new 0 0 24 24" height="14" width="14" viewBox="0 0 24 24" xml:space="preserve" ><path fill="#CE1515" d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';
		},

		//current row number
		rownum: function rownum(cell, formatterParams, onRendered) {
			return this.table.rowManager.activeRows.indexOf(cell.getRow()._getSelf()) + 1;
		},

		//row handle
		handle: function handle(cell, formatterParams, onRendered) {
			cell.getElement().classList.add("tabulator-row-handle");
			return "<div class='tabulator-row-handle-box'><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div><div class='tabulator-row-handle-bar'></div></div>";
		},

		responsiveCollapse: function responsiveCollapse(cell, formatterParams, onRendered) {
			var el = document.createElement("div"),
			    config = cell.getRow()._row.modules.responsiveLayout;

			el.classList.add("tabulator-responsive-collapse-toggle");
			el.innerHTML = "<span class='tabulator-responsive-collapse-toggle-open'>+</span><span class='tabulator-responsive-collapse-toggle-close'>-</span>";

			cell.getElement().classList.add("tabulator-row-handle");

			function toggleList(isOpen) {
				var collapseEl = config.element;

				config.open = isOpen;

				if (collapseEl) {

					if (config.open) {
						el.classList.add("open");
						collapseEl.style.display = '';
					} else {
						el.classList.remove("open");
						collapseEl.style.display = 'none';
					}
				}
			}

			el.addEventListener("click", function (e) {
				e.stopImmediatePropagation();
				toggleList(!config.open);
			});

			toggleList(config.open);

			return el;
		},

		rowSelection: function rowSelection(cell) {
			var _this56 = this;

			var checkbox = document.createElement("input");

			checkbox.type = 'checkbox';

			if (this.table.modExists("selectRow", true)) {

				checkbox.addEventListener("click", function (e) {
					e.stopPropagation();
				});

				if (typeof cell.getRow == 'function') {
					var row = cell.getRow();

					checkbox.addEventListener("change", function (e) {
						row.toggleSelect();
					});

					checkbox.checked = row.isSelected();
					this.table.modules.selectRow.registerRowSelectCheckbox(row, checkbox);
				} else {
					checkbox.addEventListener("change", function (e) {
						if (_this56.table.modules.selectRow.selectedRows.length) {
							_this56.table.deselectRow();
						} else {
							_this56.table.selectRow();
						}
					});

					this.table.modules.selectRow.registerHeaderSelectCheckbox(checkbox);
				}
			}
			return checkbox;
		}
	};

	Tabulator.prototype.registerModule("format", Format);

	var FrozenColumns = function FrozenColumns(table) {
		this.table = table; //hold Tabulator object
		this.leftColumns = [];
		this.rightColumns = [];
		this.leftMargin = 0;
		this.rightMargin = 0;
		this.rightPadding = 0;
		this.initializationMode = "left";
		this.active = false;
		this.scrollEndTimer = false;
	};

	//reset initial state
	FrozenColumns.prototype.reset = function () {
		this.initializationMode = "left";
		this.leftColumns = [];
		this.rightColumns = [];
		this.leftMargin = 0;
		this.rightMargin = 0;
		this.rightMargin = 0;
		this.active = false;

		this.table.columnManager.headersElement.style.marginLeft = 0;
		this.table.columnManager.element.style.paddingRight = 0;
	};

	//initialize specific column
	FrozenColumns.prototype.initializeColumn = function (column) {
		var config = { margin: 0, edge: false };

		if (!column.isGroup) {

			if (this.frozenCheck(column)) {

				config.position = this.initializationMode;

				if (this.initializationMode == "left") {
					this.leftColumns.push(column);
				} else {
					this.rightColumns.unshift(column);
				}

				this.active = true;

				column.modules.frozen = config;
			} else {
				this.initializationMode = "right";
			}
		}
	};

	FrozenColumns.prototype.frozenCheck = function (column) {

		if (column.parent.isGroup && column.definition.frozen) {
			console.warn("Frozen Column Error - Parent column group must be frozen, not individual columns or sub column groups");
		}

		if (column.parent.isGroup) {
			return this.frozenCheck(column.parent);
		} else {
			return column.definition.frozen;
		}
	};

	//quick layout to smooth horizontal scrolling
	FrozenColumns.prototype.scrollHorizontal = function () {
		var _this57 = this;

		var rows;

		if (this.active) {
			clearTimeout(this.scrollEndTimer);

			//layout all rows after scroll is complete
			this.scrollEndTimer = setTimeout(function () {
				_this57.layout();
			}, 100);

			rows = this.table.rowManager.getVisibleRows();

			this.calcMargins();

			this.layoutColumnPosition();

			this.layoutCalcRows();

			rows.forEach(function (row) {
				if (row.type === "row") {
					_this57.layoutRow(row);
				}
			});

			this.table.rowManager.tableElement.style.marginRight = this.rightMargin;
		}
	};

	//calculate margins for rows
	FrozenColumns.prototype.calcMargins = function () {
		this.leftMargin = this._calcSpace(this.leftColumns, this.leftColumns.length) + "px";
		this.table.columnManager.headersElement.style.marginLeft = this.leftMargin;

		this.rightMargin = this._calcSpace(this.rightColumns, this.rightColumns.length) + "px";
		this.table.columnManager.element.style.paddingRight = this.rightMargin;

		//calculate right frozen columns
		this.rightPadding = this.table.rowManager.element.clientWidth + this.table.columnManager.scrollLeft;
	};

	//layout calculation rows
	FrozenColumns.prototype.layoutCalcRows = function () {
		if (this.table.modExists("columnCalcs")) {
			if (this.table.modules.columnCalcs.topInitialized && this.table.modules.columnCalcs.topRow) {
				this.layoutRow(this.table.modules.columnCalcs.topRow);
			}
			if (this.table.modules.columnCalcs.botInitialized && this.table.modules.columnCalcs.botRow) {
				this.layoutRow(this.table.modules.columnCalcs.botRow);
			}
		}
	};

	//calculate column positions and layout headers
	FrozenColumns.prototype.layoutColumnPosition = function (allCells) {
		var _this58 = this;

		var leftParents = [];

		this.leftColumns.forEach(function (column, i) {
			column.modules.frozen.margin = _this58._calcSpace(_this58.leftColumns, i) + _this58.table.columnManager.scrollLeft + "px";

			if (i == _this58.leftColumns.length - 1) {
				column.modules.frozen.edge = true;
			} else {
				column.modules.frozen.edge = false;
			}

			if (column.parent.isGroup) {
				var parentEl = _this58.getColGroupParentElement(column);
				if (!leftParents.includes(parentEl)) {
					_this58.layoutElement(parentEl, column);
					leftParents.push(parentEl);
				}

				if (column.modules.frozen.edge) {
					parentEl.classList.add("tabulator-frozen-" + column.modules.frozen.position);
				}
			} else {
				_this58.layoutElement(column.getElement(), column);
			}

			if (allCells) {
				column.cells.forEach(function (cell) {
					_this58.layoutElement(cell.getElement(), column);
				});
			}
		});

		this.rightColumns.forEach(function (column, i) {
			column.modules.frozen.margin = _this58.rightPadding - _this58._calcSpace(_this58.rightColumns, i + 1) + "px";

			if (i == _this58.rightColumns.length - 1) {
				column.modules.frozen.edge = true;
			} else {
				column.modules.frozen.edge = false;
			}

			if (column.parent.isGroup) {
				_this58.layoutElement(_this58.getColGroupParentElement(column), column);
			} else {
				_this58.layoutElement(column.getElement(), column);
			}

			if (allCells) {
				column.cells.forEach(function (cell) {
					_this58.layoutElement(cell.getElement(), column);
				});
			}
		});
	};

	FrozenColumns.prototype.getColGroupParentElement = function (column) {
		return column.parent.isGroup ? this.getColGroupParentElement(column.parent) : column.getElement();
	};

	//layout columns appropropriatly
	FrozenColumns.prototype.layout = function () {
		var self = this;

		if (self.active) {

			//calculate row padding
			this.calcMargins();

			// self.table.rowManager.activeRows.forEach(function(row){
			// 	self.layoutRow(row);
			// });

			// if(self.table.options.dataTree){
			self.table.rowManager.getDisplayRows().forEach(function (row) {
				if (row.type === "row") {
					self.layoutRow(row);
				}
			});
			// }

			this.layoutCalcRows();

			//calculate left columns
			this.layoutColumnPosition(true);

			// if(tableHolder.scrollHeight > tableHolder.clientHeight){
			// 	rightMargin -= tableHolder.offsetWidth - tableHolder.clientWidth;
			// }

			this.table.rowManager.tableElement.style.marginRight = this.rightMargin;
		}
	};

	FrozenColumns.prototype.layoutRow = function (row) {
		var _this59 = this;

		var rowEl = row.getElement();

		rowEl.style.paddingLeft = this.leftMargin;
		// rowEl.style.paddingRight = this.rightMargin + "px";

		this.leftColumns.forEach(function (column) {
			var cell = row.getCell(column);

			if (cell) {
				_this59.layoutElement(cell.getElement(), column);
			}
		});

		this.rightColumns.forEach(function (column) {
			var cell = row.getCell(column);

			if (cell) {
				_this59.layoutElement(cell.getElement(), column);
			}
		});
	};

	FrozenColumns.prototype.layoutElement = function (element, column) {

		if (column.modules.frozen) {
			element.style.position = "absolute";
			element.style.left = column.modules.frozen.margin;

			element.classList.add("tabulator-frozen");

			if (column.modules.frozen.edge) {
				element.classList.add("tabulator-frozen-" + column.modules.frozen.position);
			}
		}
	};

	FrozenColumns.prototype._calcSpace = function (columns, index) {
		var width = 0;

		for (var _i9 = 0; _i9 < index; _i9++) {
			if (columns[_i9].visible) {
				width += columns[_i9].getWidth();
			}
		}

		return width;
	};

	Tabulator.prototype.registerModule("frozenColumns", FrozenColumns);
	var FrozenRows = function FrozenRows(table) {
		this.table = table; //hold Tabulator object
		this.topElement = document.createElement("div");
		this.rows = [];
		this.displayIndex = 0; //index in display pipeline
	};

	FrozenRows.prototype.initialize = function () {
		this.rows = [];

		this.topElement.classList.add("tabulator-frozen-rows-holder");

		// this.table.columnManager.element.append(this.topElement);
		this.table.columnManager.getElement().insertBefore(this.topElement, this.table.columnManager.headersElement.nextSibling);
	};

	FrozenRows.prototype.setDisplayIndex = function (index) {
		this.displayIndex = index;
	};

	FrozenRows.prototype.getDisplayIndex = function () {
		return this.displayIndex;
	};

	FrozenRows.prototype.isFrozen = function () {
		return !!this.rows.length;
	};

	//filter frozen rows out of display data
	FrozenRows.prototype.getRows = function (rows) {
		var output = rows.slice(0);

		this.rows.forEach(function (row) {
			var index = output.indexOf(row);

			if (index > -1) {
				output.splice(index, 1);
			}
		});

		return output;
	};

	FrozenRows.prototype.freezeRow = function (row) {
		if (!row.modules.frozen) {
			row.modules.frozen = true;
			this.topElement.appendChild(row.getElement());
			row.initialize();
			row.normalizeHeight();
			this.table.rowManager.adjustTableSize();

			this.rows.push(row);

			this.table.rowManager.refreshActiveData("display");

			this.styleRows();
		} else {
			console.warn("Freeze Error - Row is already frozen");
		}
	};

	FrozenRows.prototype.unfreezeRow = function (row) {
		var index = this.rows.indexOf(row);

		if (row.modules.frozen) {

			row.modules.frozen = false;

			this.detachRow(row);

			this.table.rowManager.adjustTableSize();

			this.table.rowManager.refreshActiveData("display");

			if (this.rows.length) {
				this.styleRows();
			}
		} else {
			console.warn("Freeze Error - Row is already unfrozen");
		}
	};

	FrozenRows.prototype.detachRow = function (row) {
		var index = this.rows.indexOf(row);

		if (index > -1) {
			var rowEl = row.getElement();
			rowEl.parentNode.removeChild(rowEl);

			this.rows.splice(index, 1);
		}
	};

	FrozenRows.prototype.styleRows = function (row) {
		var self = this;

		this.rows.forEach(function (row, i) {
			self.table.rowManager.styleRow(row, i);
		});
	};

	Tabulator.prototype.registerModule("frozenRows", FrozenRows);

	//public group object
	var GroupComponent = function GroupComponent(group) {
		this._group = group;
		this.type = "GroupComponent";
	};

	GroupComponent.prototype.getKey = function () {
		return this._group.key;
	};

	GroupComponent.prototype.getField = function () {
		return this._group.field;
	};

	GroupComponent.prototype.getElement = function () {
		return this._group.element;
	};

	GroupComponent.prototype.getRows = function () {
		return this._group.getRows(true);
	};

	GroupComponent.prototype.getSubGroups = function () {
		return this._group.getSubGroups(true);
	};

	GroupComponent.prototype.getParentGroup = function () {
		return this._group.parent ? this._group.parent.getComponent() : false;
	};

	GroupComponent.prototype.getVisibility = function () {
		console.warn("getVisibility function is deprecated, you should now use the isVisible function");
		return this._group.visible;
	};

	GroupComponent.prototype.isVisible = function () {
		return this._group.visible;
	};

	GroupComponent.prototype.show = function () {
		this._group.show();
	};

	GroupComponent.prototype.hide = function () {
		this._group.hide();
	};

	GroupComponent.prototype.toggle = function () {
		this._group.toggleVisibility();
	};

	GroupComponent.prototype._getSelf = function () {
		return this._group;
	};

	GroupComponent.prototype.getTable = function () {
		return this._group.groupManager.table;
	};

	//////////////////////////////////////////////////
	//////////////// Group Functions /////////////////
	//////////////////////////////////////////////////

	var Group = function Group(groupManager, parent, level, key, field, generator, oldGroup) {

		this.groupManager = groupManager;
		this.parent = parent;
		this.key = key;
		this.level = level;
		this.field = field;
		this.hasSubGroups = level < groupManager.groupIDLookups.length - 1;
		this.addRow = this.hasSubGroups ? this._addRowToGroup : this._addRow;
		this.type = "group"; //type of element
		this.old = oldGroup;
		this.rows = [];
		this.groups = [];
		this.groupList = [];
		this.generator = generator;
		this.elementContents = false;
		this.height = 0;
		this.outerHeight = 0;
		this.initialized = false;
		this.calcs = {};
		this.initialized = false;
		this.modules = {};
		this.arrowElement = false;

		this.visible = oldGroup ? oldGroup.visible : typeof groupManager.startOpen[level] !== "undefined" ? groupManager.startOpen[level] : groupManager.startOpen[0];

		this.component = null;

		this.createElements();
		this.addBindings();

		this.createValueGroups();
	};

	Group.prototype.wipe = function () {
		if (this.groupList.length) {
			this.groupList.forEach(function (group) {
				group.wipe();
			});
		} else {
			this.element = false;
			this.arrowElement = false;
			this.elementContents = false;
		}
	};

	Group.prototype.createElements = function () {
		var arrow = document.createElement("div");
		arrow.classList.add("tabulator-arrow");

		this.element = document.createElement("div");
		this.element.classList.add("tabulator-row");
		this.element.classList.add("tabulator-group");
		this.element.classList.add("tabulator-group-level-" + this.level);
		this.element.setAttribute("role", "rowgroup");

		this.arrowElement = document.createElement("div");
		this.arrowElement.classList.add("tabulator-group-toggle");
		this.arrowElement.appendChild(arrow);

		//setup movable rows
		if (this.groupManager.table.options.movableRows !== false && this.groupManager.table.modExists("moveRow")) {
			this.groupManager.table.modules.moveRow.initializeGroupHeader(this);
		}
	};

	Group.prototype.createValueGroups = function () {
		var _this60 = this;

		var level = this.level + 1;
		if (this.groupManager.allowedValues && this.groupManager.allowedValues[level]) {
			this.groupManager.allowedValues[level].forEach(function (value) {
				_this60._createGroup(value, level);
			});
		}
	};

	Group.prototype.addBindings = function () {
		var self = this,
		    dblTap,
		    tapHold,
		    tap,
		    toggleElement;

		//handle group click events
		if (self.groupManager.table.options.groupClick) {
			self.element.addEventListener("click", function (e) {
				self.groupManager.table.options.groupClick.call(self.groupManager.table, e, self.getComponent());
			});
		}

		if (self.groupManager.table.options.groupDblClick) {
			self.element.addEventListener("dblclick", function (e) {
				self.groupManager.table.options.groupDblClick.call(self.groupManager.table, e, self.getComponent());
			});
		}

		if (self.groupManager.table.options.groupContext) {
			self.element.addEventListener("contextmenu", function (e) {
				self.groupManager.table.options.groupContext.call(self.groupManager.table, e, self.getComponent());
			});
		}

		if (self.groupManager.table.options.groupContextMenu && self.groupManager.table.modExists("menu")) {
			self.groupManager.table.modules.menu.initializeGroup.call(self.groupManager.table.modules.menu, self);
		}

		if (self.groupManager.table.options.groupTap) {

			tap = false;

			self.element.addEventListener("touchstart", function (e) {
				tap = true;
			}, { passive: true });

			self.element.addEventListener("touchend", function (e) {
				if (tap) {
					self.groupManager.table.options.groupTap(e, self.getComponent());
				}

				tap = false;
			});
		}

		if (self.groupManager.table.options.groupDblTap) {

			dblTap = null;

			self.element.addEventListener("touchend", function (e) {

				if (dblTap) {
					clearTimeout(dblTap);
					dblTap = null;

					self.groupManager.table.options.groupDblTap(e, self.getComponent());
				} else {

					dblTap = setTimeout(function () {
						clearTimeout(dblTap);
						dblTap = null;
					}, 300);
				}
			});
		}

		if (self.groupManager.table.options.groupTapHold) {

			tapHold = null;

			self.element.addEventListener("touchstart", function (e) {
				clearTimeout(tapHold);

				tapHold = setTimeout(function () {
					clearTimeout(tapHold);
					tapHold = null;
					tap = false;
					self.groupManager.table.options.groupTapHold(e, self.getComponent());
				}, 1000);
			}, { passive: true });

			self.element.addEventListener("touchend", function (e) {
				clearTimeout(tapHold);
				tapHold = null;
			});
		}

		if (self.groupManager.table.options.groupToggleElement) {
			toggleElement = self.groupManager.table.options.groupToggleElement == "arrow" ? self.arrowElement : self.element;

			toggleElement.addEventListener("click", function (e) {
				e.stopPropagation();
				e.stopImmediatePropagation();
				self.toggleVisibility();
			});
		}
	};

	Group.prototype._createGroup = function (groupID, level) {
		var groupKey = level + "_" + groupID;
		var group = new Group(this.groupManager, this, level, groupID, this.groupManager.groupIDLookups[level].field, this.groupManager.headerGenerator[level] || this.groupManager.headerGenerator[0], this.old ? this.old.groups[groupKey] : false);

		this.groups[groupKey] = group;
		this.groupList.push(group);
	};

	Group.prototype._addRowToGroup = function (row) {

		var level = this.level + 1;

		if (this.hasSubGroups) {
			var groupID = this.groupManager.groupIDLookups[level].func(row.getData()),
			    groupKey = level + "_" + groupID;

			if (this.groupManager.allowedValues && this.groupManager.allowedValues[level]) {
				if (this.groups[groupKey]) {
					this.groups[groupKey].addRow(row);
				}
			} else {
				if (!this.groups[groupKey]) {
					this._createGroup(groupID, level);
				}

				this.groups[groupKey].addRow(row);
			}
		}
	};

	Group.prototype._addRow = function (row) {
		this.rows.push(row);
		row.modules.group = this;
	};

	Group.prototype.insertRow = function (row, to, after) {
		var data = this.conformRowData({});

		row.updateData(data);

		var toIndex = this.rows.indexOf(to);

		if (toIndex > -1) {
			if (after) {
				this.rows.splice(toIndex + 1, 0, row);
			} else {
				this.rows.splice(toIndex, 0, row);
			}
		} else {
			if (after) {
				this.rows.push(row);
			} else {
				this.rows.unshift(row);
			}
		}

		row.modules.group = this;

		this.generateGroupHeaderContents();

		if (this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.options.columnCalcs != "table") {
			this.groupManager.table.modules.columnCalcs.recalcGroup(this);
		}

		this.groupManager.updateGroupRows(true);
	};

	Group.prototype.scrollHeader = function (left) {
		this.arrowElement.style.marginLeft = left;

		this.groupList.forEach(function (child) {
			child.scrollHeader(left);
		});
	};

	Group.prototype.getRowIndex = function (row) {};

	//update row data to match grouping contraints
	Group.prototype.conformRowData = function (data) {
		if (this.field) {
			data[this.field] = this.key;
		} else {
			console.warn("Data Conforming Error - Cannot conform row data to match new group as groupBy is a function");
		}

		if (this.parent) {
			data = this.parent.conformRowData(data);
		}

		return data;
	};

	Group.prototype.removeRow = function (row) {
		var index = this.rows.indexOf(row);
		var el = row.getElement();

		if (index > -1) {
			this.rows.splice(index, 1);
		}

		if (!this.groupManager.table.options.groupValues && !this.rows.length) {
			if (this.parent) {
				this.parent.removeGroup(this);
			} else {
				this.groupManager.removeGroup(this);
			}

			this.groupManager.updateGroupRows(true);
		} else {

			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}

			this.generateGroupHeaderContents();

			if (this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.options.columnCalcs != "table") {
				this.groupManager.table.modules.columnCalcs.recalcGroup(this);
			}
		}
	};

	Group.prototype.removeGroup = function (group) {
		var groupKey = group.level + "_" + group.key,
		    index;

		if (this.groups[groupKey]) {
			delete this.groups[groupKey];

			index = this.groupList.indexOf(group);

			if (index > -1) {
				this.groupList.splice(index, 1);
			}

			if (!this.groupList.length) {
				if (this.parent) {
					this.parent.removeGroup(this);
				} else {
					this.groupManager.removeGroup(this);
				}
			}
		}
	};

	Group.prototype.getHeadersAndRows = function (noCalc) {
		var output = [];

		output.push(this);

		this._visSet();

		if (this.visible) {
			if (this.groupList.length) {
				this.groupList.forEach(function (group) {
					output = output.concat(group.getHeadersAndRows(noCalc));
				});
			} else {
				if (!noCalc && this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.modules.columnCalcs.hasTopCalcs()) {
					if (this.calcs.top) {
						this.calcs.top.detachElement();
						this.calcs.top.deleteCells();
					}

					this.calcs.top = this.groupManager.table.modules.columnCalcs.generateTopRow(this.rows);
					output.push(this.calcs.top);
				}

				output = output.concat(this.rows);

				if (!noCalc && this.groupManager.table.options.columnCalcs != "table" && this.groupManager.table.modExists("columnCalcs") && this.groupManager.table.modules.columnCalcs.hasBottomCalcs()) {
					if (this.calcs.bottom) {
						this.calcs.bottom.detachElement();
						this.calcs.bottom.deleteCells();
					}

					this.calcs.bottom = this.groupManager.table.modules.columnCalcs.generateBottomRow(this.rows);
					output.push(this.calcs.bottom);
				}
			}
		} else {
			if (!this.groupList.length && this.groupManager.table.options.columnCalcs != "table") {

				if (this.groupManager.table.modExists("columnCalcs")) {

					if (!noCalc && this.groupManager.table.modules.columnCalcs.hasTopCalcs()) {
						if (this.calcs.top) {
							this.calcs.top.detachElement();
							this.calcs.top.deleteCells();
						}

						if (this.groupManager.table.options.groupClosedShowCalcs) {
							this.calcs.top = this.groupManager.table.modules.columnCalcs.generateTopRow(this.rows);
							output.push(this.calcs.top);
						}
					}

					if (!noCalc && this.groupManager.table.modules.columnCalcs.hasBottomCalcs()) {
						if (this.calcs.bottom) {
							this.calcs.bottom.detachElement();
							this.calcs.bottom.deleteCells();
						}

						if (this.groupManager.table.options.groupClosedShowCalcs) {
							this.calcs.bottom = this.groupManager.table.modules.columnCalcs.generateBottomRow(this.rows);
							output.push(this.calcs.bottom);
						}
					}
				}
			}
		}

		return output;
	};

	Group.prototype.getData = function (visible, transform) {
		var output = [];

		this._visSet();

		if (!visible || visible && this.visible) {
			this.rows.forEach(function (row) {
				output.push(row.getData(transform || "data"));
			});
		}

		return output;
	};

	// Group.prototype.getRows = function(){
	// 	this._visSet();

	// 	return this.visible ? this.rows : [];
	// };

	Group.prototype.getRowCount = function () {
		var count = 0;

		if (this.groupList.length) {
			this.groupList.forEach(function (group) {
				count += group.getRowCount();
			});
		} else {
			count = this.rows.length;
		}
		return count;
	};

	Group.prototype.toggleVisibility = function () {
		if (this.visible) {
			this.hide();
		} else {
			this.show();
		}
	};

	Group.prototype.hide = function () {
		this.visible = false;

		if (this.groupManager.table.rowManager.getRenderMode() == "classic" && !this.groupManager.table.options.pagination) {

			this.element.classList.remove("tabulator-group-visible");

			if (this.groupList.length) {
				this.groupList.forEach(function (group) {

					var rows = group.getHeadersAndRows();

					rows.forEach(function (row) {
						row.detachElement();
					});
				});
			} else {
				this.rows.forEach(function (row) {
					var rowEl = row.getElement();
					rowEl.parentNode.removeChild(rowEl);
				});
			}

			this.groupManager.table.rowManager.setDisplayRows(this.groupManager.updateGroupRows(), this.groupManager.getDisplayIndex());

			this.groupManager.table.rowManager.checkClassicModeGroupHeaderWidth();
		} else {
			this.groupManager.updateGroupRows(true);
		}

		this.groupManager.table.options.groupVisibilityChanged.call(this.table, this.getComponent(), false);
	};

	Group.prototype.show = function () {
		var self = this;

		self.visible = true;

		if (this.groupManager.table.rowManager.getRenderMode() == "classic" && !this.groupManager.table.options.pagination) {

			this.element.classList.add("tabulator-group-visible");

			var prev = self.getElement();

			if (this.groupList.length) {
				this.groupList.forEach(function (group) {
					var rows = group.getHeadersAndRows();

					rows.forEach(function (row) {
						var rowEl = row.getElement();
						prev.parentNode.insertBefore(rowEl, prev.nextSibling);
						row.initialize();
						prev = rowEl;
					});
				});
			} else {
				self.rows.forEach(function (row) {
					var rowEl = row.getElement();
					prev.parentNode.insertBefore(rowEl, prev.nextSibling);
					row.initialize();
					prev = rowEl;
				});
			}

			this.groupManager.table.rowManager.setDisplayRows(this.groupManager.updateGroupRows(), this.groupManager.getDisplayIndex());

			this.groupManager.table.rowManager.checkClassicModeGroupHeaderWidth();
		} else {
			this.groupManager.updateGroupRows(true);
		}

		this.groupManager.table.options.groupVisibilityChanged.call(this.table, this.getComponent(), true);
	};

	Group.prototype._visSet = function () {
		var data = [];

		if (typeof this.visible == "function") {

			this.rows.forEach(function (row) {
				data.push(row.getData());
			});

			this.visible = this.visible(this.key, this.getRowCount(), data, this.getComponent());
		}
	};

	Group.prototype.getRowGroup = function (row) {
		var match = false;
		if (this.groupList.length) {
			this.groupList.forEach(function (group) {
				var result = group.getRowGroup(row);

				if (result) {
					match = result;
				}
			});
		} else {
			if (this.rows.find(function (item) {
				return item === row;
			})) {
				match = this;
			}
		}

		return match;
	};

	Group.prototype.getSubGroups = function (component) {
		var output = [];

		this.groupList.forEach(function (child) {
			output.push(component ? child.getComponent() : child);
		});

		return output;
	};

	Group.prototype.getRows = function (compoment) {
		var output = [];

		this.rows.forEach(function (row) {
			output.push(compoment ? row.getComponent() : row);
		});

		return output;
	};

	Group.prototype.generateGroupHeaderContents = function () {
		var data = [];

		this.rows.forEach(function (row) {
			data.push(row.getData());
		});

		this.elementContents = this.generator(this.key, this.getRowCount(), data, this.getComponent());

		while (this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}if (typeof this.elementContents === "string") {
			this.element.innerHTML = this.elementContents;
		} else {
			this.element.appendChild(this.elementContents);
		}

		this.element.insertBefore(this.arrowElement, this.element.firstChild);
	};

	////////////// Standard Row Functions //////////////

	Group.prototype.getElement = function () {
		this.addBindingsd = false;

		this._visSet();

		if (this.visible) {
			this.element.classList.add("tabulator-group-visible");
		} else {
			this.element.classList.remove("tabulator-group-visible");
		}

		for (var i = 0; i < this.element.childNodes.length; ++i) {
			this.element.childNodes[i].parentNode.removeChild(this.element.childNodes[i]);
		}

		this.generateGroupHeaderContents();

		// this.addBindings();

		return this.element;
	};

	Group.prototype.detachElement = function () {
		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
		}
	};

	//normalize the height of elements in the row
	Group.prototype.normalizeHeight = function () {
		this.setHeight(this.element.clientHeight);
	};

	Group.prototype.initialize = function (force) {
		if (!this.initialized || force) {
			this.normalizeHeight();
			this.initialized = true;
		}
	};

	Group.prototype.reinitialize = function () {
		this.initialized = false;
		this.height = 0;

		if (Tabulator.prototype.helpers.elVisible(this.element)) {
			this.initialize(true);
		}
	};

	Group.prototype.setHeight = function (height) {
		if (this.height != height) {
			this.height = height;
			this.outerHeight = this.element.offsetHeight;
		}
	};

	//return rows outer height
	Group.prototype.getHeight = function () {
		return this.outerHeight;
	};

	Group.prototype.getGroup = function () {
		return this;
	};

	Group.prototype.reinitializeHeight = function () {};
	Group.prototype.calcHeight = function () {};
	Group.prototype.setCellHeight = function () {};
	Group.prototype.clearCellHeight = function () {};

	//////////////// Object Generation /////////////////
	Group.prototype.getComponent = function () {
		if (!this.component) {
			this.component = new GroupComponent(this);
		}

		return this.component;
	};

	//////////////////////////////////////////////////
	////////////// Group Row Extension ///////////////
	//////////////////////////////////////////////////

	var GroupRows = function GroupRows(table) {

		this.table = table; //hold Tabulator object

		this.groupIDLookups = false; //enable table grouping and set field to group by
		this.startOpen = [function () {
			return false;
		}]; //starting state of group
		this.headerGenerator = [function () {
			return "";
		}];
		this.groupList = []; //ordered list of groups
		this.allowedValues = false;
		this.groups = {}; //hold row groups
		this.displayIndex = 0; //index in display pipeline
	};

	//initialize group configuration
	GroupRows.prototype.initialize = function () {
		var self = this,
		    groupBy = self.table.options.groupBy,
		    startOpen = self.table.options.groupStartOpen,
		    groupHeader = self.table.options.groupHeader;

		this.allowedValues = self.table.options.groupValues;

		if (Array.isArray(groupBy) && Array.isArray(groupHeader) && groupBy.length > groupHeader.length) {
			console.warn("Error creating group headers, groupHeader array is shorter than groupBy array");
		}

		self.headerGenerator = [function () {
			return "";
		}];
		this.startOpen = [function () {
			return false;
		}]; //starting state of group

		self.table.modules.localize.bind("groups|item", function (langValue, lang) {
			self.headerGenerator[0] = function (value, count, data) {
				//header layout function
				return (typeof value === "undefined" ? "" : value) + "<span>(" + count + " " + (count === 1 ? langValue : lang.groups.items) + ")</span>";
			};
		});

		this.groupIDLookups = [];

		if (Array.isArray(groupBy) || groupBy) {
			if (this.table.modExists("columnCalcs") && this.table.options.columnCalcs != "table" && this.table.options.columnCalcs != "both") {
				this.table.modules.columnCalcs.removeCalcs();
			}
		} else {
			if (this.table.modExists("columnCalcs") && this.table.options.columnCalcs != "group") {

				var cols = this.table.columnManager.getRealColumns();

				cols.forEach(function (col) {
					if (col.definition.topCalc) {
						self.table.modules.columnCalcs.initializeTopRow();
					}

					if (col.definition.bottomCalc) {
						self.table.modules.columnCalcs.initializeBottomRow();
					}
				});
			}
		}

		if (!Array.isArray(groupBy)) {
			groupBy = [groupBy];
		}

		groupBy.forEach(function (group, i) {
			var lookupFunc, column;

			if (typeof group == "function") {
				lookupFunc = group;
			} else {
				column = self.table.columnManager.getColumnByField(group);

				if (column) {
					lookupFunc = function lookupFunc(data) {
						return column.getFieldValue(data);
					};
				} else {
					lookupFunc = function lookupFunc(data) {
						return data[group];
					};
				}
			}

			self.groupIDLookups.push({
				field: typeof group === "function" ? false : group,
				func: lookupFunc,
				values: self.allowedValues ? self.allowedValues[i] : false
			});
		});

		if (startOpen) {

			if (!Array.isArray(startOpen)) {
				startOpen = [startOpen];
			}

			startOpen.forEach(function (level) {
			});

			self.startOpen = startOpen;
		}

		if (groupHeader) {
			self.headerGenerator = Array.isArray(groupHeader) ? groupHeader : [groupHeader];
		}

		this.initialized = true;
	};

	GroupRows.prototype.setDisplayIndex = function (index) {
		this.displayIndex = index;
	};

	GroupRows.prototype.getDisplayIndex = function () {
		return this.displayIndex;
	};

	//return appropriate rows with group headers
	GroupRows.prototype.getRows = function (rows) {
		if (this.groupIDLookups.length) {

			this.table.options.dataGrouping.call(this.table);

			this.generateGroups(rows);

			if (this.table.options.dataGrouped) {
				this.table.options.dataGrouped.call(this.table, this.getGroups(true));
			}

			return this.updateGroupRows();
		} else {
			return rows.slice(0);
		}
	};

	GroupRows.prototype.getGroups = function (compoment) {
		var groupComponents = [];

		this.groupList.forEach(function (group) {
			groupComponents.push(compoment ? group.getComponent() : group);
		});

		return groupComponents;
	};

	GroupRows.prototype.getChildGroups = function (group) {
		var _this61 = this;

		var groupComponents = [];

		if (!group) {
			group = this;
		}

		group.groupList.forEach(function (child) {
			if (child.groupList.length) {
				groupComponents = groupComponents.concat(_this61.getChildGroups(child));
			} else {
				groupComponents.push(child);
			}
		});

		return groupComponents;
	};

	GroupRows.prototype.wipe = function () {
		this.groupList.forEach(function (group) {
			group.wipe();
		});
	};

	GroupRows.prototype.pullGroupListData = function (groupList) {
		var self = this;
		var groupListData = [];

		groupList.forEach(function (group) {
			var groupHeader = {};
			groupHeader.level = 0;
			groupHeader.rowCount = 0;
			groupHeader.headerContent = "";
			var childData = [];

			if (group.hasSubGroups) {
				childData = self.pullGroupListData(group.groupList);

				groupHeader.level = group.level;
				groupHeader.rowCount = childData.length - group.groupList.length; // data length minus number of sub-headers
				groupHeader.headerContent = group.generator(group.key, groupHeader.rowCount, group.rows, group);

				groupListData.push(groupHeader);
				groupListData = groupListData.concat(childData);
			} else {
				groupHeader.level = group.level;
				groupHeader.headerContent = group.generator(group.key, group.rows.length, group.rows, group);
				groupHeader.rowCount = group.getRows().length;

				groupListData.push(groupHeader);

				group.getRows().forEach(function (row) {
					groupListData.push(row.getData("data"));
				});
			}
		});

		return groupListData;
	};

	GroupRows.prototype.getGroupedData = function () {

		return this.pullGroupListData(this.groupList);
	};

	GroupRows.prototype.getRowGroup = function (row) {
		var match = false;

		this.groupList.forEach(function (group) {
			var result = group.getRowGroup(row);

			if (result) {
				match = result;
			}
		});

		return match;
	};

	GroupRows.prototype.countGroups = function () {
		return this.groupList.length;
	};

	GroupRows.prototype.generateGroups = function (rows) {
		var self = this,
		    oldGroups = self.groups;

		self.groups = {};
		self.groupList = [];

		if (this.allowedValues && this.allowedValues[0]) {
			this.allowedValues[0].forEach(function (value) {
				self.createGroup(value, 0, oldGroups);
			});

			rows.forEach(function (row) {
				self.assignRowToExistingGroup(row, oldGroups);
			});
		} else {
			rows.forEach(function (row) {
				self.assignRowToGroup(row, oldGroups);
			});
		}
	};

	GroupRows.prototype.createGroup = function (groupID, level, oldGroups) {
		var groupKey = level + "_" + groupID,
		    group;

		oldGroups = oldGroups || [];

		group = new Group(this, false, level, groupID, this.groupIDLookups[0].field, this.headerGenerator[0], oldGroups[groupKey]);

		this.groups[groupKey] = group;
		this.groupList.push(group);
	};

	// GroupRows.prototype.assignRowToGroup = function(row, oldGroups){
	// 	var groupID = this.groupIDLookups[0].func(row.getData()),
	// 	groupKey = "0_" + groupID;

	// 	if(!this.groups[groupKey]){
	// 		this.createGroup(groupID, 0, oldGroups);
	// 	}

	// 	this.groups[groupKey].addRow(row);
	// };

	GroupRows.prototype.assignRowToExistingGroup = function (row, oldGroups) {
		var groupID = this.groupIDLookups[0].func(row.getData()),
		    groupKey = "0_" + groupID;

		if (this.groups[groupKey]) {
			this.groups[groupKey].addRow(row);
		}
	};

	GroupRows.prototype.assignRowToGroup = function (row, oldGroups) {
		var groupID = this.groupIDLookups[0].func(row.getData()),
		    newGroupNeeded = !this.groups["0_" + groupID];

		if (newGroupNeeded) {
			this.createGroup(groupID, 0, oldGroups);
		}

		this.groups["0_" + groupID].addRow(row);

		return !newGroupNeeded;
	};

	GroupRows.prototype.updateGroupRows = function (force) {
		var self = this,
		    output = [];

		self.groupList.forEach(function (group) {
			output = output.concat(group.getHeadersAndRows());
		});

		//force update of table display
		if (force) {

			var displayIndex = self.table.rowManager.setDisplayRows(output, this.getDisplayIndex());

			if (displayIndex !== true) {
				this.setDisplayIndex(displayIndex);
			}

			self.table.rowManager.refreshActiveData("group", true, true);
		}

		return output;
	};

	GroupRows.prototype.scrollHeaders = function (left) {
		left = left + "px";

		this.groupList.forEach(function (group) {
			group.scrollHeader(left);
		});
	};

	GroupRows.prototype.removeGroup = function (group) {
		var groupKey = group.level + "_" + group.key,
		    index;

		if (this.groups[groupKey]) {
			delete this.groups[groupKey];

			index = this.groupList.indexOf(group);

			if (index > -1) {
				this.groupList.splice(index, 1);
			}
		}
	};

	Tabulator.prototype.registerModule("groupRows", GroupRows);
	var History = function History(table) {
		this.table = table; //hold Tabulator object

		this.history = [];
		this.index = -1;
	};

	History.prototype.clear = function () {
		this.history = [];
		this.index = -1;
	};

	History.prototype.action = function (type, component, data) {

		this.history = this.history.slice(0, this.index + 1);

		this.history.push({
			type: type,
			component: component,
			data: data
		});

		this.index++;
	};

	History.prototype.getHistoryUndoSize = function () {
		return this.index + 1;
	};

	History.prototype.getHistoryRedoSize = function () {
		return this.history.length - (this.index + 1);
	};

	History.prototype.undo = function () {

		if (this.index > -1) {
			var action = this.history[this.index];

			this.undoers[action.type].call(this, action);

			this.index--;

			this.table.options.historyUndo.call(this.table, action.type, action.component.getComponent(), action.data);

			return true;
		} else {
			console.warn("History Undo Error - No more history to undo");
			return false;
		}
	};

	History.prototype.redo = function () {
		if (this.history.length - 1 > this.index) {

			this.index++;

			var action = this.history[this.index];

			this.redoers[action.type].call(this, action);

			this.table.options.historyRedo.call(this.table, action.type, action.component.getComponent(), action.data);

			return true;
		} else {
			console.warn("History Redo Error - No more history to redo");
			return false;
		}
	};

	History.prototype.undoers = {
		cellEdit: function cellEdit(action) {
			action.component.setValueProcessData(action.data.oldValue);
		},

		rowAdd: function rowAdd(action) {
			action.component.deleteActual();
		},

		rowDelete: function rowDelete(action) {
			var newRow = this.table.rowManager.addRowActual(action.data.data, action.data.pos, action.data.index);

			if (this.table.options.groupBy && this.table.modExists("groupRows")) {
				this.table.modules.groupRows.updateGroupRows(true);
			}

			this._rebindRow(action.component, newRow);
		},

		rowMove: function rowMove(action) {
			this.table.rowManager.moveRowActual(action.component, this.table.rowManager.rows[action.data.posFrom], !action.data.after);
			this.table.rowManager.redraw();
		}
	};

	History.prototype.redoers = {
		cellEdit: function cellEdit(action) {
			action.component.setValueProcessData(action.data.newValue);
		},

		rowAdd: function rowAdd(action) {
			var newRow = this.table.rowManager.addRowActual(action.data.data, action.data.pos, action.data.index);

			if (this.table.options.groupBy && this.table.modExists("groupRows")) {
				this.table.modules.groupRows.updateGroupRows(true);
			}

			this._rebindRow(action.component, newRow);
		},

		rowDelete: function rowDelete(action) {
			action.component.deleteActual();
		},

		rowMove: function rowMove(action) {
			this.table.rowManager.moveRowActual(action.component, this.table.rowManager.rows[action.data.posTo], action.data.after);
			this.table.rowManager.redraw();
		}
	};

	//rebind rows to new element after deletion
	History.prototype._rebindRow = function (oldRow, newRow) {
		this.history.forEach(function (action) {
			if (action.component instanceof Row) {
				if (action.component === oldRow) {
					action.component = newRow;
				}
			} else if (action.component instanceof Cell) {
				if (action.component.row === oldRow) {
					var field = action.component.column.getField();

					if (field) {
						action.component = newRow.getCell(field);
					}
				}
			}
		});
	};

	Tabulator.prototype.registerModule("history", History);
	var HtmlTableImport = function HtmlTableImport(table) {
		this.table = table; //hold Tabulator object
		this.fieldIndex = [];
		this.hasIndex = false;
	};

	HtmlTableImport.prototype.parseTable = function () {
		var self = this,
		    element = self.table.element,
		    options = self.table.options,
		    columns = options.columns,
		    headers = element.getElementsByTagName("th"),
		    rows = element.getElementsByTagName("tbody")[0],
		    data = [];

		self.hasIndex = false;

		self.table.options.htmlImporting.call(this.table);

		rows = rows ? rows.getElementsByTagName("tr") : [];

		//check for tablator inline options
		self._extractOptions(element, options);

		if (headers.length) {
			self._extractHeaders(headers, rows);
		} else {
			self._generateBlankHeaders(headers, rows);
		}

		//iterate through table rows and build data set
		for (var index = 0; index < rows.length; index++) {
			var row = rows[index],
			    cells = row.getElementsByTagName("td"),
			    item = {};

			//create index if the dont exist in table
			if (!self.hasIndex) {
				item[options.index] = index;
			}

			for (var i = 0; i < cells.length; i++) {
				var cell = cells[i];
				if (typeof this.fieldIndex[i] !== "undefined") {
					item[this.fieldIndex[i]] = cell.innerHTML;
				}
			}

			//add row data to item
			data.push(item);
		}

		//create new element
		var newElement = document.createElement("div");

		//transfer attributes to new element
		var attributes = element.attributes;

		// loop through attributes and apply them on div

		for (var i in attributes) {
			if (_typeof(attributes[i]) == "object") {
				newElement.setAttribute(attributes[i].name, attributes[i].value);
			}
		}

		// replace table with div element
		element.parentNode.replaceChild(newElement, element);

		options.data = data;

		self.table.options.htmlImported.call(this.table);

		// // newElement.tabulator(options);

		this.table.element = newElement;
	};

	//extract tabulator attribute options
	HtmlTableImport.prototype._extractOptions = function (element, options, defaultOptions) {
		var attributes = element.attributes;
		var optionsArr = defaultOptions ? Object.assign([], defaultOptions) : Object.keys(options);
		var optionsList = {};

		optionsArr.forEach(function (item) {
			optionsList[item.toLowerCase()] = item;
		});

		for (var index in attributes) {
			var attrib = attributes[index];
			var name;

			if (attrib && (typeof attrib === 'undefined' ? 'undefined' : _typeof(attrib)) == "object" && attrib.name && attrib.name.indexOf("tabulator-") === 0) {
				name = attrib.name.replace("tabulator-", "");

				if (typeof optionsList[name] !== "undefined") {
					options[optionsList[name]] = this._attribValue(attrib.value);
				}
			}
		}
	};

	//get value of attribute
	HtmlTableImport.prototype._attribValue = function (value) {
		if (value === "true") {
			return true;
		}

		if (value === "false") {
			return false;
		}

		return value;
	};

	//find column if it has already been defined
	HtmlTableImport.prototype._findCol = function (title) {
		var match = this.table.options.columns.find(function (column) {
			return column.title === title;
		});

		return match || false;
	};

	//extract column from headers
	HtmlTableImport.prototype._extractHeaders = function (headers, rows) {
		for (var index = 0; index < headers.length; index++) {
			var header = headers[index],
			    exists = false,
			    col = this._findCol(header.textContent),
			    width,
			    attributes;

			if (col) {
				exists = true;
			} else {
				col = { title: header.textContent.trim() };
			}

			if (!col.field) {
				col.field = header.textContent.trim().toLowerCase().replace(" ", "_");
			}

			width = header.getAttribute("width");

			if (width && !col.width) {
				col.width = width;
			}

			//check for tablator inline options
			attributes = header.attributes;

			// //check for tablator inline options
			this._extractOptions(header, col, Column.prototype.defaultOptionList);

			this.fieldIndex[index] = col.field;

			if (col.field == this.table.options.index) {
				this.hasIndex = true;
			}

			if (!exists) {
				this.table.options.columns.push(col);
			}
		}
	};

	//generate blank headers
	HtmlTableImport.prototype._generateBlankHeaders = function (headers, rows) {
		for (var index = 0; index < headers.length; index++) {
			var header = headers[index],
			    col = { title: "", field: "col" + index };

			this.fieldIndex[index] = col.field;

			var width = header.getAttribute("width");

			if (width) {
				col.width = width;
			}

			this.table.options.columns.push(col);
		}
	};

	Tabulator.prototype.registerModule("htmlTableImport", HtmlTableImport);
	var Keybindings = function Keybindings(table) {
		this.table = table; //hold Tabulator object
		this.watchKeys = null;
		this.pressedKeys = null;
		this.keyupBinding = false;
		this.keydownBinding = false;
	};

	Keybindings.prototype.initialize = function () {
		var bindings = this.table.options.keybindings,
		    mergedBindings = {};

		this.watchKeys = {};
		this.pressedKeys = [];

		if (bindings !== false) {

			for (var key in this.bindings) {
				mergedBindings[key] = this.bindings[key];
			}

			if (Object.keys(bindings).length) {

				for (var _key in bindings) {
					mergedBindings[_key] = bindings[_key];
				}
			}

			this.mapBindings(mergedBindings);
			this.bindEvents();
		}
	};

	Keybindings.prototype.mapBindings = function (bindings) {
		var _this62 = this;

		var self = this;

		var _loop2 = function _loop2(key) {

			if (_this62.actions[key]) {

				if (bindings[key]) {

					if (_typeof(bindings[key]) !== "object") {
						bindings[key] = [bindings[key]];
					}

					bindings[key].forEach(function (binding) {
						self.mapBinding(key, binding);
					});
				}
			} else {
				console.warn("Key Binding Error - no such action:", key);
			}
		};

		for (var key in bindings) {
			_loop2(key);
		}
	};

	Keybindings.prototype.mapBinding = function (action, symbolsList) {
		var self = this;

		var binding = {
			action: this.actions[action],
			keys: [],
			ctrl: false,
			shift: false,
			meta: false
		};

		var symbols = symbolsList.toString().toLowerCase().split(" ").join("").split("+");

		symbols.forEach(function (symbol) {
			switch (symbol) {
				case "ctrl":
					binding.ctrl = true;
					break;

				case "shift":
					binding.shift = true;
					break;

				case "meta":
					binding.meta = true;
					break;

				default:
					symbol = parseInt(symbol);
					binding.keys.push(symbol);

					if (!self.watchKeys[symbol]) {
						self.watchKeys[symbol] = [];
					}

					self.watchKeys[symbol].push(binding);
			}
		});
	};

	Keybindings.prototype.bindEvents = function () {
		var self = this;

		this.keyupBinding = function (e) {
			var code = e.keyCode;
			var bindings = self.watchKeys[code];

			if (bindings) {

				self.pressedKeys.push(code);

				bindings.forEach(function (binding) {
					self.checkBinding(e, binding);
				});
			}
		};

		this.keydownBinding = function (e) {
			var code = e.keyCode;
			var bindings = self.watchKeys[code];

			if (bindings) {

				var index = self.pressedKeys.indexOf(code);

				if (index > -1) {
					self.pressedKeys.splice(index, 1);
				}
			}
		};

		this.table.element.addEventListener("keydown", this.keyupBinding);

		this.table.element.addEventListener("keyup", this.keydownBinding);
	};

	Keybindings.prototype.clearBindings = function () {
		if (this.keyupBinding) {
			this.table.element.removeEventListener("keydown", this.keyupBinding);
		}

		if (this.keydownBinding) {
			this.table.element.removeEventListener("keyup", this.keydownBinding);
		}
	};

	Keybindings.prototype.checkBinding = function (e, binding) {
		var self = this,
		    match = true;

		if (e.ctrlKey == binding.ctrl && e.shiftKey == binding.shift && e.metaKey == binding.meta) {
			binding.keys.forEach(function (key) {
				var index = self.pressedKeys.indexOf(key);

				if (index == -1) {
					match = false;
				}
			});

			if (match) {
				binding.action.call(self, e);
			}

			return true;
		}

		return false;
	};

	//default bindings
	Keybindings.prototype.bindings = {
		navPrev: "shift + 9",
		navNext: 9,
		navUp: 38,
		navDown: 40,
		scrollPageUp: 33,
		scrollPageDown: 34,
		scrollToStart: 36,
		scrollToEnd: 35,
		undo: "ctrl + 90",
		redo: "ctrl + 89",
		copyToClipboard: "ctrl + 67"
	};

	//default actions
	Keybindings.prototype.actions = {
		keyBlock: function keyBlock(e) {
			e.stopPropagation();
			e.preventDefault();
		},
		scrollPageUp: function scrollPageUp(e) {
			var rowManager = this.table.rowManager,
			    newPos = rowManager.scrollTop - rowManager.height,
			    scrollMax = rowManager.element.scrollHeight;

			e.preventDefault();

			if (rowManager.displayRowsCount) {
				if (newPos >= 0) {
					rowManager.element.scrollTop = newPos;
				} else {
					rowManager.scrollToRow(rowManager.getDisplayRows()[0]);
				}
			}

			this.table.element.focus();
		},
		scrollPageDown: function scrollPageDown(e) {
			var rowManager = this.table.rowManager,
			    newPos = rowManager.scrollTop + rowManager.height,
			    scrollMax = rowManager.element.scrollHeight;

			e.preventDefault();

			if (rowManager.displayRowsCount) {
				if (newPos <= scrollMax) {
					rowManager.element.scrollTop = newPos;
				} else {
					rowManager.scrollToRow(rowManager.getDisplayRows()[rowManager.displayRowsCount - 1]);
				}
			}

			this.table.element.focus();
		},
		scrollToStart: function scrollToStart(e) {
			var rowManager = this.table.rowManager;

			e.preventDefault();

			if (rowManager.displayRowsCount) {
				rowManager.scrollToRow(rowManager.getDisplayRows()[0]);
			}

			this.table.element.focus();
		},
		scrollToEnd: function scrollToEnd(e) {
			var rowManager = this.table.rowManager;

			e.preventDefault();

			if (rowManager.displayRowsCount) {
				rowManager.scrollToRow(rowManager.getDisplayRows()[rowManager.displayRowsCount - 1]);
			}

			this.table.element.focus();
		},
		navPrev: function navPrev(e) {
			var cell = false;

			if (this.table.modExists("edit")) {
				cell = this.table.modules.edit.currentCell;

				if (cell) {
					e.preventDefault();
					cell.nav().prev();
				}
			}
		},

		navNext: function navNext(e) {
			var cell = false;
			var newRow = this.table.options.tabEndNewRow;
			var nav;

			if (this.table.modExists("edit")) {
				cell = this.table.modules.edit.currentCell;

				if (cell) {
					e.preventDefault();

					nav = cell.nav();

					if (!nav.next()) {
						if (newRow) {

							cell.getElement().firstChild.blur();

							if (newRow === true) {
								newRow = this.table.addRow({});
							} else {
								if (typeof newRow == "function") {
									newRow = this.table.addRow(newRow(cell.row.getComponent()));
								} else {
									newRow = this.table.addRow(Object.assign({}, newRow));
								}
							}

							newRow.then(function () {
								setTimeout(function () {
									nav.next();
								});
							});
						}
					}
				}
			}
		},

		navLeft: function navLeft(e) {
			var cell = false;

			if (this.table.modExists("edit")) {
				cell = this.table.modules.edit.currentCell;

				if (cell) {
					e.preventDefault();
					cell.nav().left();
				}
			}
		},

		navRight: function navRight(e) {
			var cell = false;

			if (this.table.modExists("edit")) {
				cell = this.table.modules.edit.currentCell;

				if (cell) {
					e.preventDefault();
					cell.nav().right();
				}
			}
		},

		navUp: function navUp(e) {
			var cell = false;

			if (this.table.modExists("edit")) {
				cell = this.table.modules.edit.currentCell;

				if (cell) {
					e.preventDefault();
					cell.nav().up();
				}
			}
		},

		navDown: function navDown(e) {
			var cell = false;

			if (this.table.modExists("edit")) {
				cell = this.table.modules.edit.currentCell;

				if (cell) {
					e.preventDefault();
					cell.nav().down();
				}
			}
		},

		undo: function undo(e) {
			var cell = false;
			if (this.table.options.history && this.table.modExists("history") && this.table.modExists("edit")) {

				cell = this.table.modules.edit.currentCell;

				if (!cell) {
					e.preventDefault();
					this.table.modules.history.undo();
				}
			}
		},

		redo: function redo(e) {
			var cell = false;
			if (this.table.options.history && this.table.modExists("history") && this.table.modExists("edit")) {

				cell = this.table.modules.edit.currentCell;

				if (!cell) {
					e.preventDefault();
					this.table.modules.history.redo();
				}
			}
		},

		copyToClipboard: function copyToClipboard(e) {
			if (!this.table.modules.edit.currentCell) {
				if (this.table.modExists("clipboard", true)) {
					this.table.modules.clipboard.copy(false, true);
				}
			}
		}
	};

	Tabulator.prototype.registerModule("keybindings", Keybindings);
	var Menu = function Menu(table) {
		this.table = table; //hold Tabulator object
		this.menuEl = false;
		this.blurEvent = this.hideMenu.bind(this);
		this.escEvent = this.escMenu.bind(this);
		this.nestedMenuBlock = false;
	};

	Menu.prototype.initializeColumnHeader = function (column) {
		var _this63 = this;

		var headerMenuEl;

		if (column.definition.headerContextMenu) {
			column.getElement().addEventListener("contextmenu", function (e) {
				var menu = typeof column.definition.headerContextMenu == "function" ? column.definition.headerContextMenu(column.getComponent()) : column.definition.headerContextMenu;

				e.preventDefault();

				_this63.loadMenu(e, column, menu);
			});
		}

		if (column.definition.headerMenu) {

			headerMenuEl = document.createElement("span");
			headerMenuEl.classList.add("tabulator-header-menu-button");
			headerMenuEl.innerHTML = "&vellip;";

			headerMenuEl.addEventListener("click", function (e) {
				var menu = typeof column.definition.headerMenu == "function" ? column.definition.headerMenu(column.getComponent()) : column.definition.headerMenu;
				e.stopPropagation();
				e.preventDefault();

				_this63.loadMenu(e, column, menu);
			});

			column.titleElement.insertBefore(headerMenuEl, column.titleElement.firstChild);
		}
	};

	Menu.prototype.initializeCell = function (cell) {
		var _this64 = this;

		cell.getElement().addEventListener("contextmenu", function (e) {
			var menu = typeof cell.column.definition.contextMenu == "function" ? cell.column.definition.contextMenu(cell.getComponent()) : cell.column.definition.contextMenu;

			if (menu) {
				e.stopImmediatePropagation();
			}

			_this64.loadMenu(e, cell, menu);
		});
	};

	Menu.prototype.initializeRow = function (row) {
		var _this65 = this;

		row.getElement().addEventListener("contextmenu", function (e) {
			var menu = typeof _this65.table.options.rowContextMenu == "function" ? _this65.table.options.rowContextMenu(row.getComponent()) : _this65.table.options.rowContextMenu;

			_this65.loadMenu(e, row, menu);
		});
	};

	Menu.prototype.initializeGroup = function (group) {
		var _this66 = this;

		group.getElement().addEventListener("contextmenu", function (e) {
			var menu = typeof _this66.table.options.groupContextMenu == "function" ? _this66.table.options.groupContextMenu(group.getComponent()) : _this66.table.options.groupContextMenu;

			_this66.loadMenu(e, group, menu);
		});
	};

	Menu.prototype.loadMenu = function (e, component, menu) {
		var _this67 = this;

		var docHeight = Math.max(document.body.offsetHeight, window.innerHeight);

		e.preventDefault();

		//abort if no menu set
		if (!menu || !menu.length) {
			return;
		}

		if (this.nestedMenuBlock) {
			//abort if child menu already open
			if (this.isOpen()) {
				return;
			}
		} else {
			this.nestedMenuBlock = setTimeout(function () {
				_this67.nestedMenuBlock = false;
			}, 100);
		}

		this.hideMenu();

		this.menuEl = document.createElement("div");
		this.menuEl.classList.add("tabulator-menu");

		menu.forEach(function (item) {
			var itemEl = document.createElement("div");
			var label = item.label;
			var disabled = item.disabled;

			if (item.separator) {
				itemEl.classList.add("tabulator-menu-separator");
			} else {
				itemEl.classList.add("tabulator-menu-item");

				if (typeof label == "function") {
					label = label(component.getComponent());
				}

				if (label instanceof Node) {
					itemEl.appendChild(label);
				} else {
					itemEl.innerHTML = label;
				}

				if (typeof disabled == "function") {
					disabled = disabled(component.getComponent());
				}

				if (disabled) {
					itemEl.classList.add("tabulator-menu-item-disabled");
					itemEl.addEventListener("click", function (e) {
						e.stopPropagation();
					});
				} else {
					itemEl.addEventListener("click", function (e) {
						_this67.hideMenu();
						item.action(e, component.getComponent());
					});
				}
			}

			_this67.menuEl.appendChild(itemEl);
		});

		this.menuEl.style.top = e.pageY + "px";
		this.menuEl.style.left = e.pageX + "px";

		document.body.addEventListener("click", this.blurEvent);
		this.table.rowManager.element.addEventListener("scroll", this.blurEvent);

		setTimeout(function () {
			document.body.addEventListener("contextmenu", _this67.blurEvent);
		}, 100);

		document.body.addEventListener("keydown", this.escEvent);

		document.body.appendChild(this.menuEl);

		//move menu to start on right edge if it is too close to the edge of the screen
		if (e.pageX + this.menuEl.offsetWidth >= document.body.offsetWidth) {
			this.menuEl.style.left = "";
			this.menuEl.style.right = document.body.offsetWidth - e.pageX + "px";
		}

		//move menu to start on bottom edge if it is too close to the edge of the screen
		if (e.pageY + this.menuEl.offsetHeight >= docHeight) {
			this.menuEl.style.top = "";
			this.menuEl.style.bottom = docHeight - e.pageY + "px";
		}
	};

	Menu.prototype.isOpen = function () {
		return !!this.menuEl.parentNode;
	};

	Menu.prototype.escMenu = function (e) {
		if (e.keyCode == 27) {
			this.hideMenu();
		}
	};

	Menu.prototype.hideMenu = function () {
		if (this.menuEl.parentNode) {
			this.menuEl.parentNode.removeChild(this.menuEl);
		}

		if (this.escEvent) {
			document.body.removeEventListener("keydown", this.escEvent);
		}

		if (this.blurEvent) {
			document.body.removeEventListener("click", this.blurEvent);
			document.body.removeEventListener("contextmenu", this.blurEvent);
			this.table.rowManager.element.removeEventListener("scroll", this.blurEvent);
		}
	};

	//default accessors
	Menu.prototype.menus = {};

	Tabulator.prototype.registerModule("menu", Menu);
	var MoveColumns = function MoveColumns(table) {
		this.table = table; //hold Tabulator object
		this.placeholderElement = this.createPlaceholderElement();
		this.hoverElement = false; //floating column header element
		this.checkTimeout = false; //click check timeout holder
		this.checkPeriod = 250; //period to wait on mousedown to consider this a move and not a click
		this.moving = false; //currently moving column
		this.toCol = false; //destination column
		this.toColAfter = false; //position of moving column relative to the desitnation column
		this.startX = 0; //starting position within header element
		this.autoScrollMargin = 40; //auto scroll on edge when within margin
		this.autoScrollStep = 5; //auto scroll distance in pixels
		this.autoScrollTimeout = false; //auto scroll timeout
		this.touchMove = false;

		this.moveHover = this.moveHover.bind(this);
		this.endMove = this.endMove.bind(this);
	};

	MoveColumns.prototype.createPlaceholderElement = function () {
		var el = document.createElement("div");

		el.classList.add("tabulator-col");
		el.classList.add("tabulator-col-placeholder");

		return el;
	};

	MoveColumns.prototype.initializeColumn = function (column) {
		var self = this,
		    config = {},
		    colEl;

		if (!column.modules.frozen) {

			colEl = column.getElement();

			config.mousemove = function (e) {
				if (column.parent === self.moving.parent) {
					if ((self.touchMove ? e.touches[0].pageX : e.pageX) - Tabulator.prototype.helpers.elOffset(colEl).left + self.table.columnManager.element.scrollLeft > column.getWidth() / 2) {
						if (self.toCol !== column || !self.toColAfter) {
							colEl.parentNode.insertBefore(self.placeholderElement, colEl.nextSibling);
							self.moveColumn(column, true);
						}
					} else {
						if (self.toCol !== column || self.toColAfter) {
							colEl.parentNode.insertBefore(self.placeholderElement, colEl);
							self.moveColumn(column, false);
						}
					}
				}
			}.bind(self);

			colEl.addEventListener("mousedown", function (e) {
				self.touchMove = false;
				if (e.which === 1) {
					self.checkTimeout = setTimeout(function () {
						self.startMove(e, column);
					}, self.checkPeriod);
				}
			});

			colEl.addEventListener("mouseup", function (e) {
				if (e.which === 1) {
					if (self.checkTimeout) {
						clearTimeout(self.checkTimeout);
					}
				}
			});

			self.bindTouchEvents(column);
		}

		column.modules.moveColumn = config;
	};

	MoveColumns.prototype.bindTouchEvents = function (column) {
		var self = this,
		    colEl = column.getElement(),
		    startXMove = false,
		    nextCol,
		    prevCol,
		    nextColWidth,
		    prevColWidth,
		    nextColWidthLast,
		    prevColWidthLast;

		colEl.addEventListener("touchstart", function (e) {
			self.checkTimeout = setTimeout(function () {
				self.touchMove = true;
				nextCol = column.nextColumn();
				nextColWidth = nextCol ? nextCol.getWidth() / 2 : 0;
				prevCol = column.prevColumn();
				prevColWidth = prevCol ? prevCol.getWidth() / 2 : 0;
				nextColWidthLast = 0;
				prevColWidthLast = 0;
				startXMove = false;

				self.startMove(e, column);
			}, self.checkPeriod);
		}, { passive: true });

		colEl.addEventListener("touchmove", function (e) {
			var diff, moveToCol;

			if (self.moving) {
				self.moveHover(e);

				if (!startXMove) {
					startXMove = e.touches[0].pageX;
				}

				diff = e.touches[0].pageX - startXMove;

				if (diff > 0) {
					if (nextCol && diff - nextColWidthLast > nextColWidth) {
						moveToCol = nextCol;

						if (moveToCol !== column) {
							startXMove = e.touches[0].pageX;
							moveToCol.getElement().parentNode.insertBefore(self.placeholderElement, moveToCol.getElement().nextSibling);
							self.moveColumn(moveToCol, true);
						}
					}
				} else {
					if (prevCol && -diff - prevColWidthLast > prevColWidth) {
						moveToCol = prevCol;

						if (moveToCol !== column) {
							startXMove = e.touches[0].pageX;
							moveToCol.getElement().parentNode.insertBefore(self.placeholderElement, moveToCol.getElement());
							self.moveColumn(moveToCol, false);
						}
					}
				}

				if (moveToCol) {
					nextCol = moveToCol.nextColumn();
					nextColWidthLast = nextColWidth;
					nextColWidth = nextCol ? nextCol.getWidth() / 2 : 0;
					prevCol = moveToCol.prevColumn();
					prevColWidthLast = prevColWidth;
					prevColWidth = prevCol ? prevCol.getWidth() / 2 : 0;
				}
			}
		}, { passive: true });

		colEl.addEventListener("touchend", function (e) {
			if (self.checkTimeout) {
				clearTimeout(self.checkTimeout);
			}
			if (self.moving) {
				self.endMove(e);
			}
		});
	};

	MoveColumns.prototype.startMove = function (e, column) {
		var element = column.getElement();

		this.moving = column;
		this.startX = (this.touchMove ? e.touches[0].pageX : e.pageX) - Tabulator.prototype.helpers.elOffset(element).left;

		this.table.element.classList.add("tabulator-block-select");

		//create placeholder
		this.placeholderElement.style.width = column.getWidth() + "px";
		this.placeholderElement.style.height = column.getHeight() + "px";

		element.parentNode.insertBefore(this.placeholderElement, element);
		element.parentNode.removeChild(element);

		//create hover element
		this.hoverElement = element.cloneNode(true);
		this.hoverElement.classList.add("tabulator-moving");

		this.table.columnManager.getElement().appendChild(this.hoverElement);

		this.hoverElement.style.left = "0";
		this.hoverElement.style.bottom = "0";

		if (!this.touchMove) {
			this._bindMouseMove();

			document.body.addEventListener("mousemove", this.moveHover);
			document.body.addEventListener("mouseup", this.endMove);
		}

		this.moveHover(e);
	};

	MoveColumns.prototype._bindMouseMove = function () {
		this.table.columnManager.columnsByIndex.forEach(function (column) {
			if (column.modules.moveColumn.mousemove) {
				column.getElement().addEventListener("mousemove", column.modules.moveColumn.mousemove);
			}
		});
	};

	MoveColumns.prototype._unbindMouseMove = function () {
		this.table.columnManager.columnsByIndex.forEach(function (column) {
			if (column.modules.moveColumn.mousemove) {
				column.getElement().removeEventListener("mousemove", column.modules.moveColumn.mousemove);
			}
		});
	};

	MoveColumns.prototype.moveColumn = function (column, after) {
		var movingCells = this.moving.getCells();

		this.toCol = column;
		this.toColAfter = after;

		if (after) {
			column.getCells().forEach(function (cell, i) {
				var cellEl = cell.getElement();
				cellEl.parentNode.insertBefore(movingCells[i].getElement(), cellEl.nextSibling);
			});
		} else {
			column.getCells().forEach(function (cell, i) {
				var cellEl = cell.getElement();
				cellEl.parentNode.insertBefore(movingCells[i].getElement(), cellEl);
			});
		}
	};

	MoveColumns.prototype.endMove = function (e) {
		if (e.which === 1 || this.touchMove) {
			this._unbindMouseMove();

			this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
			this.placeholderElement.parentNode.removeChild(this.placeholderElement);
			this.hoverElement.parentNode.removeChild(this.hoverElement);

			this.table.element.classList.remove("tabulator-block-select");

			if (this.toCol) {
				this.table.columnManager.moveColumnActual(this.moving, this.toCol, this.toColAfter);
			}

			this.moving = false;
			this.toCol = false;
			this.toColAfter = false;

			if (!this.touchMove) {
				document.body.removeEventListener("mousemove", this.moveHover);
				document.body.removeEventListener("mouseup", this.endMove);
			}
		}
	};

	MoveColumns.prototype.moveHover = function (e) {
		var self = this,
		    columnHolder = self.table.columnManager.getElement(),
		    scrollLeft = columnHolder.scrollLeft,
		    xPos = (self.touchMove ? e.touches[0].pageX : e.pageX) - Tabulator.prototype.helpers.elOffset(columnHolder).left + scrollLeft,
		    scrollPos;

		self.hoverElement.style.left = xPos - self.startX + "px";

		if (xPos - scrollLeft < self.autoScrollMargin) {
			if (!self.autoScrollTimeout) {
				self.autoScrollTimeout = setTimeout(function () {
					scrollPos = Math.max(0, scrollLeft - 5);
					self.table.rowManager.getElement().scrollLeft = scrollPos;
					self.autoScrollTimeout = false;
				}, 1);
			}
		}

		if (scrollLeft + columnHolder.clientWidth - xPos < self.autoScrollMargin) {
			if (!self.autoScrollTimeout) {
				self.autoScrollTimeout = setTimeout(function () {
					scrollPos = Math.min(columnHolder.clientWidth, scrollLeft + 5);
					self.table.rowManager.getElement().scrollLeft = scrollPos;
					self.autoScrollTimeout = false;
				}, 1);
			}
		}
	};

	Tabulator.prototype.registerModule("moveColumn", MoveColumns);

	var MoveRows = function MoveRows(table) {

		this.table = table; //hold Tabulator object
		this.placeholderElement = this.createPlaceholderElement();
		this.hoverElement = false; //floating row header element
		this.checkTimeout = false; //click check timeout holder
		this.checkPeriod = 150; //period to wait on mousedown to consider this a move and not a click
		this.moving = false; //currently moving row
		this.toRow = false; //destination row
		this.toRowAfter = false; //position of moving row relative to the desitnation row
		this.hasHandle = false; //row has handle instead of fully movable row
		this.startY = 0; //starting Y position within header element
		this.startX = 0; //starting X position within header element

		this.moveHover = this.moveHover.bind(this);
		this.endMove = this.endMove.bind(this);
		this.tableRowDropEvent = false;

		this.touchMove = false;

		this.connection = false;
		this.connectionSelectorsTables = false;
		this.connectionSelectorsElements = false;
		this.connectionElements = [];
		this.connections = [];

		this.connectedTable = false;
		this.connectedRow = false;
	};

	MoveRows.prototype.createPlaceholderElement = function () {
		var el = document.createElement("div");

		el.classList.add("tabulator-row");
		el.classList.add("tabulator-row-placeholder");

		return el;
	};

	MoveRows.prototype.initialize = function (handle) {
		this.connectionSelectorsTables = this.table.options.movableRowsConnectedTables;
		this.connectionSelectorsElements = this.table.options.movableRowsConnectedElements;

		this.connection = this.connectionSelectorsTables || this.connectionSelectorsElements;
	};

	MoveRows.prototype.setHandle = function (handle) {
		this.hasHandle = handle;
	};

	MoveRows.prototype.initializeGroupHeader = function (group) {
		var self = this,
		    config = {};

		//inter table drag drop
		config.mouseup = function (e) {
			self.tableRowDrop(e, row);
		}.bind(self);

		//same table drag drop
		config.mousemove = function (e) {
			if (e.pageY - Tabulator.prototype.helpers.elOffset(group.element).top + self.table.rowManager.element.scrollTop > group.getHeight() / 2) {
				if (self.toRow !== group || !self.toRowAfter) {
					var rowEl = group.getElement();
					rowEl.parentNode.insertBefore(self.placeholderElement, rowEl.nextSibling);
					self.moveRow(group, true);
				}
			} else {
				if (self.toRow !== group || self.toRowAfter) {
					var rowEl = group.getElement();
					if (rowEl.previousSibling) {
						rowEl.parentNode.insertBefore(self.placeholderElement, rowEl);
						self.moveRow(group, false);
					}
				}
			}
		}.bind(self);

		group.modules.moveRow = config;
	};

	MoveRows.prototype.initializeRow = function (row) {
		var self = this,
		    config = {},
		    rowEl;

		//inter table drag drop
		config.mouseup = function (e) {
			self.tableRowDrop(e, row);
		}.bind(self);

		//same table drag drop
		config.mousemove = function (e) {
			if (e.pageY - Tabulator.prototype.helpers.elOffset(row.element).top + self.table.rowManager.element.scrollTop > row.getHeight() / 2) {
				if (self.toRow !== row || !self.toRowAfter) {
					var rowEl = row.getElement();
					rowEl.parentNode.insertBefore(self.placeholderElement, rowEl.nextSibling);
					self.moveRow(row, true);
				}
			} else {
				if (self.toRow !== row || self.toRowAfter) {
					var rowEl = row.getElement();
					rowEl.parentNode.insertBefore(self.placeholderElement, rowEl);
					self.moveRow(row, false);
				}
			}
		}.bind(self);

		if (!this.hasHandle) {

			rowEl = row.getElement();

			rowEl.addEventListener("mousedown", function (e) {
				if (e.which === 1) {
					self.checkTimeout = setTimeout(function () {
						self.startMove(e, row);
					}, self.checkPeriod);
				}
			});

			rowEl.addEventListener("mouseup", function (e) {
				if (e.which === 1) {
					if (self.checkTimeout) {
						clearTimeout(self.checkTimeout);
					}
				}
			});

			this.bindTouchEvents(row, row.getElement());
		}

		row.modules.moveRow = config;
	};

	MoveRows.prototype.initializeCell = function (cell) {
		var self = this,
		    cellEl = cell.getElement();

		cellEl.addEventListener("mousedown", function (e) {
			if (e.which === 1) {
				self.checkTimeout = setTimeout(function () {
					self.startMove(e, cell.row);
				}, self.checkPeriod);
			}
		});

		cellEl.addEventListener("mouseup", function (e) {
			if (e.which === 1) {
				if (self.checkTimeout) {
					clearTimeout(self.checkTimeout);
				}
			}
		});

		this.bindTouchEvents(cell.row, cell.getElement());
	};

	MoveRows.prototype.bindTouchEvents = function (row, element) {
		var self = this,
		    startYMove = false,
		    nextRow,
		    prevRow,
		    nextRowHeight,
		    prevRowHeight,
		    nextRowHeightLast,
		    prevRowHeightLast;

		element.addEventListener("touchstart", function (e) {
			self.checkTimeout = setTimeout(function () {
				self.touchMove = true;
				nextRow = row.nextRow();
				nextRowHeight = nextRow ? nextRow.getHeight() / 2 : 0;
				prevRow = row.prevRow();
				prevRowHeight = prevRow ? prevRow.getHeight() / 2 : 0;
				nextRowHeightLast = 0;
				prevRowHeightLast = 0;
				startYMove = false;

				self.startMove(e, row);
			}, self.checkPeriod);
		}, { passive: true });
		this.moving, this.toRow, this.toRowAfter;
		element.addEventListener("touchmove", function (e) {

			var diff, moveToRow;

			if (self.moving) {
				e.preventDefault();

				self.moveHover(e);

				if (!startYMove) {
					startYMove = e.touches[0].pageY;
				}

				diff = e.touches[0].pageY - startYMove;

				if (diff > 0) {
					if (nextRow && diff - nextRowHeightLast > nextRowHeight) {
						moveToRow = nextRow;

						if (moveToRow !== row) {
							startYMove = e.touches[0].pageY;
							moveToRow.getElement().parentNode.insertBefore(self.placeholderElement, moveToRow.getElement().nextSibling);
							self.moveRow(moveToRow, true);
						}
					}
				} else {
					if (prevRow && -diff - prevRowHeightLast > prevRowHeight) {
						moveToRow = prevRow;

						if (moveToRow !== row) {
							startYMove = e.touches[0].pageY;
							moveToRow.getElement().parentNode.insertBefore(self.placeholderElement, moveToRow.getElement());
							self.moveRow(moveToRow, false);
						}
					}
				}

				if (moveToRow) {
					nextRow = moveToRow.nextRow();
					nextRowHeightLast = nextRowHeight;
					nextRowHeight = nextRow ? nextRow.getHeight() / 2 : 0;
					prevRow = moveToRow.prevRow();
					prevRowHeightLast = prevRowHeight;
					prevRowHeight = prevRow ? prevRow.getHeight() / 2 : 0;
				}
			}
		});

		element.addEventListener("touchend", function (e) {
			if (self.checkTimeout) {
				clearTimeout(self.checkTimeout);
			}
			if (self.moving) {
				self.endMove(e);
				self.touchMove = false;
			}
		});
	};

	MoveRows.prototype._bindMouseMove = function () {
		var self = this;

		self.table.rowManager.getDisplayRows().forEach(function (row) {
			if ((row.type === "row" || row.type === "group") && row.modules.moveRow.mousemove) {
				row.getElement().addEventListener("mousemove", row.modules.moveRow.mousemove);
			}
		});
	};

	MoveRows.prototype._unbindMouseMove = function () {
		var self = this;

		self.table.rowManager.getDisplayRows().forEach(function (row) {
			if ((row.type === "row" || row.type === "group") && row.modules.moveRow.mousemove) {
				row.getElement().removeEventListener("mousemove", row.modules.moveRow.mousemove);
			}
		});
	};

	MoveRows.prototype.startMove = function (e, row) {
		var element = row.getElement();

		this.setStartPosition(e, row);

		this.moving = row;

		this.table.element.classList.add("tabulator-block-select");

		//create placeholder
		this.placeholderElement.style.width = row.getWidth() + "px";
		this.placeholderElement.style.height = row.getHeight() + "px";

		if (!this.connection) {
			element.parentNode.insertBefore(this.placeholderElement, element);
			element.parentNode.removeChild(element);
		} else {
			this.table.element.classList.add("tabulator-movingrow-sending");
			this.connectToTables(row);
		}

		//create hover element
		this.hoverElement = element.cloneNode(true);
		this.hoverElement.classList.add("tabulator-moving");

		if (this.connection) {
			document.body.appendChild(this.hoverElement);
			this.hoverElement.style.left = "0";
			this.hoverElement.style.top = "0";
			this.hoverElement.style.width = this.table.element.clientWidth + "px";
			this.hoverElement.style.whiteSpace = "nowrap";
			this.hoverElement.style.overflow = "hidden";
			this.hoverElement.style.pointerEvents = "none";
		} else {
			this.table.rowManager.getTableElement().appendChild(this.hoverElement);

			this.hoverElement.style.left = "0";
			this.hoverElement.style.top = "0";

			this._bindMouseMove();
		}

		document.body.addEventListener("mousemove", this.moveHover);
		document.body.addEventListener("mouseup", this.endMove);

		this.moveHover(e);
	};

	MoveRows.prototype.setStartPosition = function (e, row) {
		var pageX = this.touchMove ? e.touches[0].pageX : e.pageX,
		    pageY = this.touchMove ? e.touches[0].pageY : e.pageY,
		    element,
		    position;

		element = row.getElement();
		if (this.connection) {
			position = element.getBoundingClientRect();

			this.startX = position.left - pageX + window.pageXOffset;
			this.startY = position.top - pageY + window.pageYOffset;
		} else {
			this.startY = pageY - element.getBoundingClientRect().top;
		}
	};

	MoveRows.prototype.endMove = function (e) {
		if (!e || e.which === 1 || this.touchMove) {
			this._unbindMouseMove();

			if (!this.connection) {
				this.placeholderElement.parentNode.insertBefore(this.moving.getElement(), this.placeholderElement.nextSibling);
				this.placeholderElement.parentNode.removeChild(this.placeholderElement);
			}

			this.hoverElement.parentNode.removeChild(this.hoverElement);

			this.table.element.classList.remove("tabulator-block-select");

			if (this.toRow) {
				this.table.rowManager.moveRow(this.moving, this.toRow, this.toRowAfter);
			}

			this.moving = false;
			this.toRow = false;
			this.toRowAfter = false;

			document.body.removeEventListener("mousemove", this.moveHover);
			document.body.removeEventListener("mouseup", this.endMove);

			if (this.connection) {
				this.table.element.classList.remove("tabulator-movingrow-sending");
				this.disconnectFromTables();
			}
		}
	};

	MoveRows.prototype.moveRow = function (row, after) {
		this.toRow = row;
		this.toRowAfter = after;
	};

	MoveRows.prototype.moveHover = function (e) {
		if (this.connection) {
			this.moveHoverConnections.call(this, e);
		} else {
			this.moveHoverTable.call(this, e);
		}
	};

	MoveRows.prototype.moveHoverTable = function (e) {
		var rowHolder = this.table.rowManager.getElement(),
		    scrollTop = rowHolder.scrollTop,
		    yPos = (this.touchMove ? e.touches[0].pageY : e.pageY) - rowHolder.getBoundingClientRect().top + scrollTop;

		this.hoverElement.style.top = yPos - this.startY + "px";
	};

	MoveRows.prototype.moveHoverConnections = function (e) {
		this.hoverElement.style.left = this.startX + (this.touchMove ? e.touches[0].pageX : e.pageX) + "px";
		this.hoverElement.style.top = this.startY + (this.touchMove ? e.touches[0].pageY : e.pageY) + "px";
	};

	MoveRows.prototype.elementRowDrop = function (e, element, row) {
		if (this.table.options.movableRowsElementDrop) {
			this.table.options.movableRowsElementDrop(e, element, row ? row.getComponent() : false);
		}
	};

	//establish connection with other tables
	MoveRows.prototype.connectToTables = function (row) {
		var _this68 = this;

		var connectionTables;

		if (this.connectionSelectorsTables) {
			connectionTables = this.table.modules.comms.getConnections(this.connectionSelectorsTables);

			this.table.options.movableRowsSendingStart.call(this.table, connectionTables);

			this.table.modules.comms.send(this.connectionSelectorsTables, "moveRow", "connect", {
				row: row
			});
		}

		if (this.connectionSelectorsElements) {

			this.connectionElements = [];

			if (!Array.isArray(this.connectionSelectorsElements)) {
				this.connectionSelectorsElements = [this.connectionSelectorsElements];
			}

			this.connectionSelectorsElements.forEach(function (query) {
				if (typeof query === "string") {
					_this68.connectionElements = _this68.connectionElements.concat(Array.prototype.slice.call(document.querySelectorAll(query)));
				} else {
					_this68.connectionElements.push(query);
				}
			});

			this.connectionElements.forEach(function (element) {
				var dropEvent = function dropEvent(e) {
					_this68.elementRowDrop(e, element, _this68.moving);
				};

				element.addEventListener("mouseup", dropEvent);
				element.tabulatorElementDropEvent = dropEvent;

				element.classList.add("tabulator-movingrow-receiving");
			});
		}
	};

	//disconnect from other tables
	MoveRows.prototype.disconnectFromTables = function () {
		var connectionTables;

		if (this.connectionSelectorsTables) {
			connectionTables = this.table.modules.comms.getConnections(this.connectionSelectorsTables);

			this.table.options.movableRowsSendingStop.call(this.table, connectionTables);

			this.table.modules.comms.send(this.connectionSelectorsTables, "moveRow", "disconnect");
		}

		this.connectionElements.forEach(function (element) {
			element.classList.remove("tabulator-movingrow-receiving");
			element.removeEventListener("mouseup", element.tabulatorElementDropEvent);
			delete element.tabulatorElementDropEvent;
		});
	};

	//accept incomming connection
	MoveRows.prototype.connect = function (table, row) {
		var self = this;
		if (!this.connectedTable) {
			this.connectedTable = table;
			this.connectedRow = row;

			this.table.element.classList.add("tabulator-movingrow-receiving");

			self.table.rowManager.getDisplayRows().forEach(function (row) {
				if (row.type === "row" && row.modules.moveRow && row.modules.moveRow.mouseup) {
					row.getElement().addEventListener("mouseup", row.modules.moveRow.mouseup);
				}
			});

			self.tableRowDropEvent = self.tableRowDrop.bind(self);

			self.table.element.addEventListener("mouseup", self.tableRowDropEvent);

			this.table.options.movableRowsReceivingStart.call(this.table, row, table);

			return true;
		} else {
			console.warn("Move Row Error - Table cannot accept connection, already connected to table:", this.connectedTable);
			return false;
		}
	};

	//close incomming connection
	MoveRows.prototype.disconnect = function (table) {
		var self = this;
		if (table === this.connectedTable) {
			this.connectedTable = false;
			this.connectedRow = false;

			this.table.element.classList.remove("tabulator-movingrow-receiving");

			self.table.rowManager.getDisplayRows().forEach(function (row) {
				if (row.type === "row" && row.modules.moveRow && row.modules.moveRow.mouseup) {
					row.getElement().removeEventListener("mouseup", row.modules.moveRow.mouseup);
				}
			});

			self.table.element.removeEventListener("mouseup", self.tableRowDropEvent);

			this.table.options.movableRowsReceivingStop.call(this.table, table);
		} else {
			console.warn("Move Row Error - trying to disconnect from non connected table");
		}
	};

	MoveRows.prototype.dropComplete = function (table, row, success) {
		var sender = false;

		if (success) {

			switch (_typeof(this.table.options.movableRowsSender)) {
				case "string":
					sender = this.senders[this.table.options.movableRowsSender];
					break;

				case "function":
					sender = this.table.options.movableRowsSender;
					break;
			}

			if (sender) {
				sender.call(this, this.moving.getComponent(), row ? row.getComponent() : undefined, table);
			} else {
				if (this.table.options.movableRowsSender) {
					console.warn("Mover Row Error - no matching sender found:", this.table.options.movableRowsSender);
				}
			}

			this.table.options.movableRowsSent.call(this.table, this.moving.getComponent(), row ? row.getComponent() : undefined, table);
		} else {
			this.table.options.movableRowsSentFailed.call(this.table, this.moving.getComponent(), row ? row.getComponent() : undefined, table);
		}

		this.endMove();
	};

	MoveRows.prototype.tableRowDrop = function (e, row) {
		var receiver = false,
		    success = false;

		console.trace("drop");

		e.stopImmediatePropagation();

		switch (_typeof(this.table.options.movableRowsReceiver)) {
			case "string":
				receiver = this.receivers[this.table.options.movableRowsReceiver];
				break;

			case "function":
				receiver = this.table.options.movableRowsReceiver;
				break;
		}

		if (receiver) {
			success = receiver.call(this, this.connectedRow.getComponent(), row ? row.getComponent() : undefined, this.connectedTable);
		} else {
			console.warn("Mover Row Error - no matching receiver found:", this.table.options.movableRowsReceiver);
		}

		if (success) {
			this.table.options.movableRowsReceived.call(this.table, this.connectedRow.getComponent(), row ? row.getComponent() : undefined, this.connectedTable);
		} else {
			this.table.options.movableRowsReceivedFailed.call(this.table, this.connectedRow.getComponent(), row ? row.getComponent() : undefined, this.connectedTable);
		}

		this.table.modules.comms.send(this.connectedTable, "moveRow", "dropcomplete", {
			row: row,
			success: success
		});
	};

	MoveRows.prototype.receivers = {
		insert: function insert(fromRow, toRow, fromTable) {
			this.table.addRow(fromRow.getData(), undefined, toRow);
			return true;
		},

		add: function add(fromRow, toRow, fromTable) {
			this.table.addRow(fromRow.getData());
			return true;
		},

		update: function update(fromRow, toRow, fromTable) {
			if (toRow) {
				toRow.update(fromRow.getData());
				return true;
			}

			return false;
		},

		replace: function replace(fromRow, toRow, fromTable) {
			if (toRow) {
				this.table.addRow(fromRow.getData(), undefined, toRow);
				toRow.delete();
				return true;
			}

			return false;
		}
	};

	MoveRows.prototype.senders = {
		delete: function _delete(fromRow, toRow, toTable) {
			fromRow.delete();
		}
	};

	MoveRows.prototype.commsReceived = function (table, action, data) {
		switch (action) {
			case "connect":
				return this.connect(table, data.row);

			case "disconnect":
				return this.disconnect(table);

			case "dropcomplete":
				return this.dropComplete(table, data.row, data.success);
		}
	};

	Tabulator.prototype.registerModule("moveRow", MoveRows);
	var Mutator = function Mutator(table) {
		this.table = table; //hold Tabulator object
		this.allowedTypes = ["", "data", "edit", "clipboard"]; //list of muatation types
		this.enabled = true;
	};

	//initialize column mutator
	Mutator.prototype.initializeColumn = function (column) {
		var self = this,
		    match = false,
		    config = {};

		this.allowedTypes.forEach(function (type) {
			var key = "mutator" + (type.charAt(0).toUpperCase() + type.slice(1)),
			    mutator;

			if (column.definition[key]) {
				mutator = self.lookupMutator(column.definition[key]);

				if (mutator) {
					match = true;

					config[key] = {
						mutator: mutator,
						params: column.definition[key + "Params"] || {}
					};
				}
			}
		});

		if (match) {
			column.modules.mutate = config;
		}
	};

	Mutator.prototype.lookupMutator = function (value) {
		var mutator = false;

		//set column mutator
		switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
			case "string":
				if (this.mutators[value]) {
					mutator = this.mutators[value];
				} else {
					console.warn("Mutator Error - No such mutator found, ignoring: ", value);
				}
				break;

			case "function":
				mutator = value;
				break;
		}

		return mutator;
	};

	//apply mutator to row
	Mutator.prototype.transformRow = function (data, type, updatedData) {
		var self = this,
		    key = "mutator" + (type.charAt(0).toUpperCase() + type.slice(1)),
		    value;

		if (this.enabled) {

			self.table.columnManager.traverse(function (column) {
				var mutator, params, component;

				if (column.modules.mutate) {
					mutator = column.modules.mutate[key] || column.modules.mutate.mutator || false;

					if (mutator) {
						value = column.getFieldValue(typeof updatedData !== "undefined" ? updatedData : data);

						if (type == "data" || typeof value !== "undefined") {
							component = column.getComponent();
							params = typeof mutator.params === "function" ? mutator.params(value, data, type, component) : mutator.params;
							column.setFieldValue(data, mutator.mutator(value, data, type, params, component));
						}
					}
				}
			});
		}

		return data;
	};

	//apply mutator to new cell value
	Mutator.prototype.transformCell = function (cell, value) {
		var mutator = cell.column.modules.mutate.mutatorEdit || cell.column.modules.mutate.mutator || false,
		    tempData = {};

		if (mutator) {
			tempData = Object.assign(tempData, cell.row.getData());
			cell.column.setFieldValue(tempData, value);
			return mutator.mutator(value, tempData, "edit", mutator.params, cell.getComponent());
		} else {
			return value;
		}
	};

	Mutator.prototype.enable = function () {
		this.enabled = true;
	};

	Mutator.prototype.disable = function () {
		this.enabled = false;
	};

	//default mutators
	Mutator.prototype.mutators = {};

	Tabulator.prototype.registerModule("mutator", Mutator);
	var Page = function Page(table) {

		this.table = table; //hold Tabulator object

		this.mode = "local";
		this.progressiveLoad = false;

		this.size = 0;
		this.page = 1;
		this.count = 5;
		this.max = 1;

		this.displayIndex = 0; //index in display pipeline

		this.initialLoad = true;

		this.pageSizes = [];

		this.dataReceivedNames = {};
		this.dataSentNames = {};

		this.createElements();
	};

	Page.prototype.createElements = function () {

		var button;

		this.element = document.createElement("span");
		this.element.classList.add("tabulator-paginator");

		this.pagesElement = document.createElement("span");
		this.pagesElement.classList.add("tabulator-pages");

		button = document.createElement("button");
		button.classList.add("tabulator-page");
		button.setAttribute("type", "button");
		button.setAttribute("role", "button");
		button.setAttribute("aria-label", "");
		button.setAttribute("title", "");

		this.firstBut = button.cloneNode(true);
		this.firstBut.setAttribute("data-page", "first");

		this.prevBut = button.cloneNode(true);
		this.prevBut.setAttribute("data-page", "prev");

		this.nextBut = button.cloneNode(true);
		this.nextBut.setAttribute("data-page", "next");

		this.lastBut = button.cloneNode(true);
		this.lastBut.setAttribute("data-page", "last");

		if (this.table.options.paginationSizeSelector) {
			this.pageSizeSelect = document.createElement("select");
			this.pageSizeSelect.classList.add("tabulator-page-size");
		}
	};

	Page.prototype.generatePageSizeSelectList = function () {
		var _this69 = this;

		var pageSizes = [];

		if (this.pageSizeSelect) {

			if (Array.isArray(this.table.options.paginationSizeSelector)) {
				pageSizes = this.table.options.paginationSizeSelector;
				this.pageSizes = pageSizes;

				if (this.pageSizes.indexOf(this.size) == -1) {
					pageSizes.unshift(this.size);
				}
			} else {

				if (this.pageSizes.indexOf(this.size) == -1) {
					pageSizes = [];

					for (var _i10 = 1; _i10 < 5; _i10++) {
						pageSizes.push(this.size * _i10);
					}

					this.pageSizes = pageSizes;
				} else {
					pageSizes = this.pageSizes;
				}
			}

			while (this.pageSizeSelect.firstChild) {
				this.pageSizeSelect.removeChild(this.pageSizeSelect.firstChild);
			}pageSizes.forEach(function (item) {
				var itemEl = document.createElement("option");
				itemEl.value = item;

				if (item === true) {
					_this69.table.modules.localize.bind("pagination|all", function (value) {
						itemEl.innerHTML = value;
					});
				} else {
					itemEl.innerHTML = item;
				}

				_this69.pageSizeSelect.appendChild(itemEl);
			});

			this.pageSizeSelect.value = this.size;
		}
	};

	//setup pageination
	Page.prototype.initialize = function (hidden) {
		var self = this,
		    pageSelectLabel,
		    testElRow,
		    testElCell;

		//update param names
		this.dataSentNames = Object.assign({}, this.paginationDataSentNames);
		this.dataSentNames = Object.assign(this.dataSentNames, this.table.options.paginationDataSent);

		this.dataReceivedNames = Object.assign({}, this.paginationDataReceivedNames);
		this.dataReceivedNames = Object.assign(this.dataReceivedNames, this.table.options.paginationDataReceived);

		//build pagination element

		//bind localizations
		self.table.modules.localize.bind("pagination|first", function (value) {
			self.firstBut.innerHTML = value;
		});

		self.table.modules.localize.bind("pagination|first_title", function (value) {
			self.firstBut.setAttribute("aria-label", value);
			self.firstBut.setAttribute("title", value);
		});

		self.table.modules.localize.bind("pagination|prev", function (value) {
			self.prevBut.innerHTML = value;
		});

		self.table.modules.localize.bind("pagination|prev_title", function (value) {
			self.prevBut.setAttribute("aria-label", value);
			self.prevBut.setAttribute("title", value);
		});

		self.table.modules.localize.bind("pagination|next", function (value) {
			self.nextBut.innerHTML = value;
		});

		self.table.modules.localize.bind("pagination|next_title", function (value) {
			self.nextBut.setAttribute("aria-label", value);
			self.nextBut.setAttribute("title", value);
		});

		self.table.modules.localize.bind("pagination|last", function (value) {
			self.lastBut.innerHTML = value;
		});

		self.table.modules.localize.bind("pagination|last_title", function (value) {
			self.lastBut.setAttribute("aria-label", value);
			self.lastBut.setAttribute("title", value);
		});

		//click bindings
		self.firstBut.addEventListener("click", function () {
			self.setPage(1);
		});

		self.prevBut.addEventListener("click", function () {
			self.previousPage();
		});

		self.nextBut.addEventListener("click", function () {
			self.nextPage().then(function () {}).catch(function () {});
		});

		self.lastBut.addEventListener("click", function () {
			self.setPage(self.max);
		});

		if (self.table.options.paginationElement) {
			self.element = self.table.options.paginationElement;
		}

		if (this.pageSizeSelect) {
			pageSelectLabel = document.createElement("label");

			self.table.modules.localize.bind("pagination|page_size", function (value) {
				self.pageSizeSelect.setAttribute("aria-label", value);
				self.pageSizeSelect.setAttribute("title", value);
				pageSelectLabel.innerHTML = value;
			});

			self.element.appendChild(pageSelectLabel);
			self.element.appendChild(self.pageSizeSelect);

			self.pageSizeSelect.addEventListener("change", function (e) {
				self.setPageSize(self.pageSizeSelect.value == "true" ? true : self.pageSizeSelect.value);
				self.setPage(1).then(function () {}).catch(function () {});
			});
		}

		//append to DOM
		self.element.appendChild(self.firstBut);
		self.element.appendChild(self.prevBut);
		self.element.appendChild(self.pagesElement);
		self.element.appendChild(self.nextBut);
		self.element.appendChild(self.lastBut);

		if (!self.table.options.paginationElement && !hidden) {
			self.table.footerManager.append(self.element, self);
		}

		//set default values
		self.mode = self.table.options.pagination;

		if (self.table.options.paginationSize) {
			self.size = self.table.options.paginationSize;
		} else {
			testElRow = document.createElement("div");
			testElRow.classList.add("tabulator-row");
			testElRow.style.visibility = hidden;

			testElCell = document.createElement("div");
			testElCell.classList.add("tabulator-cell");
			testElCell.innerHTML = "Page Row Test";

			testElRow.appendChild(testElCell);

			self.table.rowManager.getTableElement().appendChild(testElRow);

			self.size = Math.floor(self.table.rowManager.getElement().clientHeight / testElRow.offsetHeight);

			self.table.rowManager.getTableElement().removeChild(testElRow);
		}

		// self.page = self.table.options.paginationInitialPage || 1;
		self.count = self.table.options.paginationButtonCount;

		self.generatePageSizeSelectList();
	};

	Page.prototype.initializeProgressive = function (mode) {
		this.initialize(true);
		this.mode = "progressive_" + mode;
		this.progressiveLoad = true;
	};

	Page.prototype.setDisplayIndex = function (index) {
		this.displayIndex = index;
	};

	Page.prototype.getDisplayIndex = function () {
		return this.displayIndex;
	};

	//calculate maximum page from number of rows
	Page.prototype.setMaxRows = function (rowCount) {
		if (!rowCount) {
			this.max = 1;
		} else {
			this.max = this.size === true ? 1 : Math.ceil(rowCount / this.size);
		}

		if (this.page > this.max) {
			this.page = this.max;
		}
	};

	//reset to first page without triggering action
	Page.prototype.reset = function (force, columnsChanged) {
		if (this.mode == "local" || force) {
			this.page = 1;
		}

		if (columnsChanged) {
			this.initialLoad = true;
		}

		return true;
	};

	//set the maxmum page
	Page.prototype.setMaxPage = function (max) {

		max = parseInt(max);

		this.max = max || 1;

		if (this.page > this.max) {
			this.page = this.max;
			this.trigger();
		}
	};

	//set current page number
	Page.prototype.setPage = function (page) {
		var _this70 = this;

		var self = this;

		switch (page) {
			case "first":
				return this.setPage(1);

			case "prev":
				return this.previousPage();

			case "next":
				return this.nextPage();

			case "last":
				return this.setPage(this.max);
		}

		return new Promise(function (resolve, reject) {

			page = parseInt(page);

			if (page > 0 && page <= _this70.max) {
				_this70.page = page;
				_this70.trigger().then(function () {
					resolve();
				}).catch(function () {
					reject();
				});

				if (self.table.options.persistence && self.table.modExists("persistence", true) && self.table.modules.persistence.config.page) {
					self.table.modules.persistence.save("page");
				}
			} else {
				console.warn("Pagination Error - Requested page is out of range of 1 - " + _this70.max + ":", page);
				reject();
			}
		});
	};

	Page.prototype.setPageToRow = function (row) {
		var _this71 = this;

		return new Promise(function (resolve, reject) {

			var rows = _this71.table.rowManager.getDisplayRows(_this71.displayIndex - 1);
			var index = rows.indexOf(row);

			if (index > -1) {
				var page = _this71.size === true ? 1 : Math.ceil((index + 1) / _this71.size);

				_this71.setPage(page).then(function () {
					resolve();
				}).catch(function () {
					reject();
				});
			} else {
				console.warn("Pagination Error - Requested row is not visible");
				reject();
			}
		});
	};

	Page.prototype.setPageSize = function (size) {
		if (size !== true) {
			size = parseInt(size);
		}

		if (size > 0) {
			this.size = size;
		}

		if (this.pageSizeSelect) {
			// this.pageSizeSelect.value = size;
			this.generatePageSizeSelectList();
		}

		if (this.table.options.persistence && this.table.modExists("persistence", true) && this.table.modules.persistence.config.page) {
			this.table.modules.persistence.save("page");
		}
	};

	//setup the pagination buttons
	Page.prototype._setPageButtons = function () {
		var self = this;

		var leftSize = Math.floor((this.count - 1) / 2);
		var rightSize = Math.ceil((this.count - 1) / 2);
		var min = this.max - this.page + leftSize + 1 < this.count ? this.max - this.count + 1 : Math.max(this.page - leftSize, 1);
		var max = this.page <= rightSize ? Math.min(this.count, this.max) : Math.min(this.page + rightSize, this.max);

		while (self.pagesElement.firstChild) {
			self.pagesElement.removeChild(self.pagesElement.firstChild);
		}if (self.page == 1) {
			self.firstBut.disabled = true;
			self.prevBut.disabled = true;
		} else {
			self.firstBut.disabled = false;
			self.prevBut.disabled = false;
		}

		if (self.page == self.max) {
			self.lastBut.disabled = true;
			self.nextBut.disabled = true;
		} else {
			self.lastBut.disabled = false;
			self.nextBut.disabled = false;
		}

		for (var _i11 = min; _i11 <= max; _i11++) {
			if (_i11 > 0 && _i11 <= self.max) {
				self.pagesElement.appendChild(self._generatePageButton(_i11));
			}
		}

		this.footerRedraw();
	};

	Page.prototype._generatePageButton = function (page) {
		var self = this,
		    button = document.createElement("button");

		button.classList.add("tabulator-page");
		if (page == self.page) {
			button.classList.add("active");
		}

		button.setAttribute("type", "button");
		button.setAttribute("role", "button");

		self.table.modules.localize.bind("pagination|page_title", function (value) {
			button.setAttribute("aria-label", value + " " + page);
			button.setAttribute("title", value + " " + page);
		});

		button.setAttribute("data-page", page);
		button.textContent = page;

		button.addEventListener("click", function (e) {
			self.setPage(page);
		});

		return button;
	};

	//previous page
	Page.prototype.previousPage = function () {
		var _this72 = this;

		return new Promise(function (resolve, reject) {
			if (_this72.page > 1) {
				_this72.page--;
				_this72.trigger().then(function () {
					resolve();
				}).catch(function () {
					reject();
				});

				if (_this72.table.options.persistence && _this72.table.modExists("persistence", true) && _this72.table.modules.persistence.config.page) {
					_this72.table.modules.persistence.save("page");
				}
			} else {
				console.warn("Pagination Error - Previous page would be less than page 1:", 0);
				reject();
			}
		});
	};

	//next page
	Page.prototype.nextPage = function () {
		var _this73 = this;

		return new Promise(function (resolve, reject) {
			if (_this73.page < _this73.max) {
				_this73.page++;
				_this73.trigger().then(function () {
					resolve();
				}).catch(function () {
					reject();
				});

				if (_this73.table.options.persistence && _this73.table.modExists("persistence", true) && _this73.table.modules.persistence.config.page) {
					_this73.table.modules.persistence.save("page");
				}
			} else {
				if (!_this73.progressiveLoad) {
					console.warn("Pagination Error - Next page would be greater than maximum page of " + _this73.max + ":", _this73.max + 1);
				}
				reject();
			}
		});
	};

	//return current page number
	Page.prototype.getPage = function () {
		return this.page;
	};

	//return max page number
	Page.prototype.getPageMax = function () {
		return this.max;
	};

	Page.prototype.getPageSize = function (size) {
		return this.size;
	};

	Page.prototype.getMode = function () {
		return this.mode;
	};

	//return appropriate rows for current page
	Page.prototype.getRows = function (data) {
		var output, start, end;

		if (this.mode == "local") {
			output = [];

			if (this.size === true) {
				start = 0;
				end = data.length - 1;
			} else {
				start = this.size * (this.page - 1);
				end = start + parseInt(this.size);
			}

			this._setPageButtons();

			for (var _i12 = start; _i12 < end; _i12++) {
				if (data[_i12]) {
					output.push(data[_i12]);
				}
			}

			return output;
		} else {

			this._setPageButtons();

			return data.slice(0);
		}
	};

	Page.prototype.trigger = function () {
		var _this74 = this;

		var left;

		return new Promise(function (resolve, reject) {

			switch (_this74.mode) {
				case "local":
					left = _this74.table.rowManager.scrollLeft;

					_this74.table.rowManager.refreshActiveData("page");
					_this74.table.rowManager.scrollHorizontal(left);

					_this74.table.options.pageLoaded.call(_this74.table, _this74.getPage());
					resolve();
					break;

				case "remote":
				case "progressive_load":
				case "progressive_scroll":
					_this74.table.modules.ajax.blockActiveRequest();
					_this74._getRemotePage().then(function () {
						resolve();
					}).catch(function () {
						reject();
					});
					break;

				default:
					console.warn("Pagination Error - no such pagination mode:", _this74.mode);
					reject();
			}
		});
	};

	Page.prototype._getRemotePage = function () {
		var _this75 = this;

		var self = this,
		    oldParams,
		    pageParams;

		return new Promise(function (resolve, reject) {

			if (!self.table.modExists("ajax", true)) {
				reject();
			}

			//record old params and restore after request has been made
			oldParams = Tabulator.prototype.helpers.deepClone(self.table.modules.ajax.getParams() || {});
			pageParams = self.table.modules.ajax.getParams();

			//configure request params
			pageParams[_this75.dataSentNames.page] = self.page;

			//set page size if defined
			if (_this75.size) {
				pageParams[_this75.dataSentNames.size] = _this75.size;
			}

			//set sort data if defined
			if (_this75.table.options.ajaxSorting && _this75.table.modExists("sort")) {
				var sorters = self.table.modules.sort.getSort();

				sorters.forEach(function (item) {
					delete item.column;
				});

				pageParams[_this75.dataSentNames.sorters] = sorters;
			}

			//set filter data if defined
			if (_this75.table.options.ajaxFiltering && _this75.table.modExists("filter")) {
				var filters = self.table.modules.filter.getFilters(true, true);
				pageParams[_this75.dataSentNames.filters] = filters;
			}

			self.table.modules.ajax.setParams(pageParams);

			self.table.modules.ajax.sendRequest(_this75.progressiveLoad).then(function (data) {
				self._parseRemoteData(data);
				resolve();
			}).catch(function (e) {
				reject();
			});

			self.table.modules.ajax.setParams(oldParams);
		});
	};

	Page.prototype._parseRemoteData = function (data) {
		var self = this,
		    left,
		    data,
		    margin;

		if (typeof data[this.dataReceivedNames.last_page] === "undefined") {
			console.warn("Remote Pagination Error - Server response missing '" + this.dataReceivedNames.last_page + "' property");
		}

		if (data[this.dataReceivedNames.data]) {
			this.max = parseInt(data[this.dataReceivedNames.last_page]) || 1;

			if (this.progressiveLoad) {
				switch (this.mode) {
					case "progressive_load":

						if (this.page == 1) {
							this.table.rowManager.setData(data[this.dataReceivedNames.data], false, this.initialLoad && this.page == 1);
						} else {
							this.table.rowManager.addRows(data[this.dataReceivedNames.data]);
						}

						if (this.page < this.max) {
							setTimeout(function () {
								self.nextPage().then(function () {}).catch(function () {});
							}, self.table.options.ajaxProgressiveLoadDelay);
						}
						break;

					case "progressive_scroll":
						data = this.table.rowManager.getData().concat(data[this.dataReceivedNames.data]);

						this.table.rowManager.setData(data, true, this.initialLoad && this.page == 1);

						margin = this.table.options.ajaxProgressiveLoadScrollMargin || this.table.rowManager.element.clientHeight * 2;

						if (self.table.rowManager.element.scrollHeight <= self.table.rowManager.element.clientHeight + margin) {
							self.nextPage().then(function () {}).catch(function () {});
						}
						break;
				}
			} else {
				left = this.table.rowManager.scrollLeft;

				this.table.rowManager.setData(data[this.dataReceivedNames.data], false, this.initialLoad && this.page == 1);

				this.table.rowManager.scrollHorizontal(left);

				this.table.columnManager.scrollHorizontal(left);

				this.table.options.pageLoaded.call(this.table, this.getPage());
			}

			this.initialLoad = false;
		} else {
			console.warn("Remote Pagination Error - Server response missing '" + this.dataReceivedNames.data + "' property");
		}
	};

	//handle the footer element being redrawn
	Page.prototype.footerRedraw = function () {
		var footer = this.table.footerManager.element;

		if (Math.ceil(footer.clientWidth) - footer.scrollWidth < 0) {
			this.pagesElement.style.display = 'none';
		} else {
			this.pagesElement.style.display = '';

			if (Math.ceil(footer.clientWidth) - footer.scrollWidth < 0) {
				this.pagesElement.style.display = 'none';
			}
		}
	};

	//set the paramter names for pagination requests
	Page.prototype.paginationDataSentNames = {
		"page": "page",
		"size": "size",
		"sorters": "sorters",
		// "sort_dir":"sort_dir",
		"filters": "filters"
		// "filter_value":"filter_value",
		// "filter_type":"filter_type",
	};

	//set the property names for pagination responses
	Page.prototype.paginationDataReceivedNames = {
		"current_page": "current_page",
		"last_page": "last_page",
		"data": "data"
	};

	Tabulator.prototype.registerModule("page", Page);

	var Persistence = function Persistence(table) {
		this.table = table; //hold Tabulator object
		this.mode = "";
		this.id = "";
		// this.persistProps = ["field", "width", "visible"];
		this.defWatcherBlock = false;
		this.config = {};
		this.readFunc = false;
		this.writeFunc = false;
	};

	// Test for whether localStorage is available for use.
	Persistence.prototype.localStorageTest = function () {
		var testKey = "_tabulator_test";

		try {
			window.localStorage.setItem(testKey, testKey);
			window.localStorage.removeItem(testKey);
			return true;
		} catch (e) {
			return false;
		}
	};

	//setup parameters
	Persistence.prototype.initialize = function () {
		//determine persistent layout storage type

		var mode = this.table.options.persistenceMode,
		    id = this.table.options.persistenceID,
		    retreivedData;

		this.mode = mode !== true ? mode : this.localStorageTest() ? "local" : "cookie";

		if (this.table.options.persistenceReaderFunc) {
			if (typeof this.table.options.persistenceReaderFunc === "function") {
				this.readFunc = this.table.options.persistenceReaderFunc;
			} else {
				if (this.readers[this.table.options.persistenceReaderFunc]) {
					this.readFunc = this.readers[this.table.options.persistenceReaderFunc];
				} else {
					console.warn("Persistence Read Error - invalid reader set", this.table.options.persistenceReaderFunc);
				}
			}
		} else {
			if (this.readers[this.mode]) {
				this.readFunc = this.readers[this.mode];
			} else {
				console.warn("Persistence Read Error - invalid reader set", this.mode);
			}
		}

		if (this.table.options.persistenceWriterFunc) {
			if (typeof this.table.options.persistenceWriterFunc === "function") {
				this.writeFunc = this.table.options.persistenceWriterFunc;
			} else {
				if (this.readers[this.table.options.persistenceWriterFunc]) {
					this.writeFunc = this.readers[this.table.options.persistenceWriterFunc];
				} else {
					console.warn("Persistence Write Error - invalid reader set", this.table.options.persistenceWriterFunc);
				}
			}
		} else {
			if (this.writers[this.mode]) {
				this.writeFunc = this.writers[this.mode];
			} else {
				console.warn("Persistence Write Error - invalid writer set", this.mode);
			}
		}

		//set storage tag
		this.id = "tabulator-" + (id || this.table.element.getAttribute("id") || "");

		this.config = {
			sort: this.table.options.persistence === true || this.table.options.persistence.sort,
			filter: this.table.options.persistence === true || this.table.options.persistence.filter,
			group: this.table.options.persistence === true || this.table.options.persistence.group,
			page: this.table.options.persistence === true || this.table.options.persistence.page,
			columns: this.table.options.persistence === true ? ["title", "width", "visible"] : this.table.options.persistence.columns
		};

		//load pagination data if needed
		if (this.config.page) {
			retreivedData = this.retreiveData("page");

			if (retreivedData) {
				if (typeof retreivedData.paginationSize !== "undefined" && (this.config.page === true || this.config.page.size)) {
					this.table.options.paginationSize = retreivedData.paginationSize;
				}

				if (typeof retreivedData.paginationInitialPage !== "undefined" && (this.config.page === true || this.config.page.page)) {
					this.table.options.paginationInitialPage = retreivedData.paginationInitialPage;
				}
			}
		}

		//load group data if needed
		if (this.config.group) {
			retreivedData = this.retreiveData("group");

			if (retreivedData) {
				if (typeof retreivedData.groupBy !== "undefined" && (this.config.group === true || this.config.group.groupBy)) {
					this.table.options.groupBy = retreivedData.groupBy;
				}
				if (typeof retreivedData.groupStartOpen !== "undefined" && (this.config.group === true || this.config.group.groupStartOpen)) {
					this.table.options.groupStartOpen = retreivedData.groupStartOpen;
				}
				if (typeof retreivedData.groupHeader !== "undefined" && (this.config.group === true || this.config.group.groupHeader)) {
					this.table.options.groupHeader = retreivedData.groupHeader;
				}
			}
		}
	};

	Persistence.prototype.initializeColumn = function (column) {
		var self = this,
		    def,
		    keys;

		if (this.config.columns) {
			this.defWatcherBlock = true;

			def = column.getDefinition();

			keys = this.config.columns === true ? Object.keys(def) : this.config.columns;

			keys.forEach(function (key) {
				var props = Object.getOwnPropertyDescriptor(def, key);
				var value = def[key];
				if (props) {
					Object.defineProperty(def, key, {
						set: function set(newValue) {
							value = newValue;

							if (!self.defWatcherBlock) {
								self.save("columns");
							}

							if (props.set) {
								props.set(newValue);
							}
						},
						get: function get() {
							if (props.get) {
								props.get();
							}
							return value;
						}
					});
				}
			});

			this.defWatcherBlock = false;
		}
	};

	//load saved definitions
	Persistence.prototype.load = function (type, current) {
		var data = this.retreiveData(type);

		if (current) {
			data = data ? this.mergeDefinition(current, data) : current;
		}

		return data;
	};

	//retreive data from memory
	Persistence.prototype.retreiveData = function (type) {
		return this.readFunc ? this.readFunc(this.id, type) : false;
	};

	//merge old and new column definitions
	Persistence.prototype.mergeDefinition = function (oldCols, newCols) {
		var self = this,
		    output = [];

		// oldCols = oldCols || [];
		newCols = newCols || [];

		newCols.forEach(function (column, to) {

			var from = self._findColumn(oldCols, column),
			    keys;

			if (from) {

				if (self.config.columns === true || self.config.columns == undefined) {
					keys = Object.keys(from);
					keys.push("width");
				} else {
					keys = self.config.columns;
				}

				keys.forEach(function (key) {
					if (typeof column[key] !== "undefined") {
						from[key] = column[key];
					}
				});

				if (from.columns) {
					from.columns = self.mergeDefinition(from.columns, column.columns);
				}

				output.push(from);
			}
		});

		oldCols.forEach(function (column, i) {
			var from = self._findColumn(newCols, column);
			if (!from) {
				if (output.length > i) {
					output.splice(i, 0, column);
				} else {
					output.push(column);
				}
			}
		});

		return output;
	};

	//find matching columns
	Persistence.prototype._findColumn = function (columns, subject) {
		var type = subject.columns ? "group" : subject.field ? "field" : "object";

		return columns.find(function (col) {
			switch (type) {
				case "group":
					return col.title === subject.title && col.columns.length === subject.columns.length;

				case "field":
					return col.field === subject.field;

				case "object":
					return col === subject;
			}
		});
	};

	//save data
	Persistence.prototype.save = function (type) {
		var data = {};

		switch (type) {
			case "columns":
				data = this.parseColumns(this.table.columnManager.getColumns());
				break;

			case "filter":
				data = this.table.modules.filter.getFilters();
				break;

			case "sort":
				data = this.validateSorters(this.table.modules.sort.getSort());
				break;

			case "group":
				data = this.getGroupConfig();
				break;

			case "page":
				data = this.getPageConfig();
				break;
		}

		if (this.writeFunc) {
			this.writeFunc(this.id, type, data);
		}
	};

	//ensure sorters contain no function data
	Persistence.prototype.validateSorters = function (data) {
		data.forEach(function (item) {
			item.column = item.field;
			delete item.field;
		});

		return data;
	};

	Persistence.prototype.getGroupConfig = function () {
		if (this.config.group) {
			if (this.config.group === true || this.config.group.groupBy) {
				data.groupBy = this.table.options.groupBy;
			}

			if (this.config.group === true || this.config.group.groupStartOpen) {
				data.groupStartOpen = this.table.options.groupStartOpen;
			}

			if (this.config.group === true || this.config.group.groupHeader) {
				data.groupHeader = this.table.options.groupHeader;
			}
		}

		return data;
	};

	Persistence.prototype.getPageConfig = function () {
		var data = {};

		if (this.config.page) {
			if (this.config.page === true || this.config.page.size) {
				data.paginationSize = this.table.modules.page.getPageSize();
			}

			if (this.config.page === true || this.config.page.page) {
				data.paginationInitialPage = this.table.modules.page.getPage();
			}
		}

		return data;
	};

	//parse columns for data to store
	Persistence.prototype.parseColumns = function (columns) {
		var self = this,
		    definitions = [];

		columns.forEach(function (column) {
			var defStore = {},
			    colDef = column.getDefinition(),
			    keys;

			if (column.isGroup) {
				defStore.title = colDef.title;
				defStore.columns = self.parseColumns(column.getColumns());
			} else {
				defStore.field = column.getField();

				if (self.config.columns === true || self.config.columns == undefined) {
					keys = Object.keys(colDef);
					keys.push("width");
				} else {
					keys = self.config.columns;
				}

				keys.forEach(function (key) {

					switch (key) {
						case "width":
							defStore.width = column.getWidth();
							break;
						case "visible":
							defStore.visible = column.visible;
							break;

						default:
							defStore[key] = colDef[key];
					}
				});
			}

			definitions.push(defStore);
		});

		return definitions;
	};

	// read peristence information from storage
	Persistence.prototype.readers = {
		local: function local(id, type) {
			var data = localStorage.getItem(id + "-" + type);

			return data ? JSON.parse(data) : false;
		},
		cookie: function cookie(id, type) {
			var cookie = document.cookie,
			    key = id + "-" + type,
			    cookiePos = cookie.indexOf(key + "="),
			    end,
			    data;

			//if cookie exists, decode and load column data into tabulator
			if (cookiePos > -1) {
				cookie = cookie.substr(cookiePos);

				end = cookie.indexOf(";");

				if (end > -1) {
					cookie = cookie.substr(0, end);
				}

				data = cookie.replace(key + "=", "");
			}

			return data ? JSON.parse(data) : false;
		}
	};

	//write persistence information to storage
	Persistence.prototype.writers = {
		local: function local(id, type, data) {
			localStorage.setItem(id + "-" + type, JSON.stringify(data));
		},
		cookie: function cookie(id, type, data) {
			var expireDate = new Date();

			expireDate.setDate(expireDate.getDate() + 10000);

			document.cookie = id + "-" + type + "=" + JSON.stringify(data) + "; expires=" + expireDate.toUTCString();
		}
	};

	Tabulator.prototype.registerModule("persistence", Persistence);

	var Print = function Print(table) {
		this.table = table; //hold Tabulator object
		this.element = false;
		this.manualBlock = false;
	};

	Print.prototype.initialize = function () {
		window.addEventListener("beforeprint", this.replaceTable.bind(this));
		window.addEventListener("afterprint", this.cleanup.bind(this));
	};

	Print.prototype.replaceTable = function () {
		if (!this.manualBlock) {
			this.element = document.createElement("div");
			this.element.classList.add("tabulator-print-table");

			this.element.appendChild(this.table.modules.export.genereateTable(this.table.options.printConfig, this.table.options.printStyled, this.table.options.printRowRange, "print"));

			this.table.element.style.display = "none";

			this.table.element.parentNode.insertBefore(this.element, this.table.element);
		}
	};

	Print.prototype.cleanup = function () {
		document.body.classList.remove("tabulator-print-fullscreen-hide");

		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
			this.table.element.style.display = "";
		}
	};

	Print.prototype.printFullscreen = function (visible, style, config) {
		var scrollX = window.scrollX,
		    scrollY = window.scrollY,
		    headerEl = document.createElement("div"),
		    footerEl = document.createElement("div"),
		    tableEl = this.table.modules.export.genereateTable(typeof config != "undefined" ? config : this.table.options.printConfig, typeof style != "undefined" ? style : this.table.options.printStyled, visible, "print"),
		    headerContent,
		    footerContent;

		this.manualBlock = true;

		this.element = document.createElement("div");
		this.element.classList.add("tabulator-print-fullscreen");

		if (this.table.options.printHeader) {
			headerEl.classList.add("tabulator-print-header");

			headerContent = typeof this.table.options.printHeader == "function" ? this.table.options.printHeader.call(this.table) : this.table.options.printHeader;

			if (typeof headerContent == "string") {
				headerEl.innerHTML = headerContent;
			} else {
				headerEl.appendChild(headerContent);
			}

			this.element.appendChild(headerEl);
		}

		this.element.appendChild(tableEl);

		if (this.table.options.printFooter) {
			footerEl.classList.add("tabulator-print-footer");

			footerContent = typeof this.table.options.printFooter == "function" ? this.table.options.printFooter.call(this.table) : this.table.options.printFooter;

			if (typeof footerContent == "string") {
				footerEl.innerHTML = footerContent;
			} else {
				footerEl.appendChild(footerContent);
			}

			this.element.appendChild(footerEl);
		}

		document.body.classList.add("tabulator-print-fullscreen-hide");
		document.body.appendChild(this.element);

		if (this.table.options.printFormatter) {
			this.table.options.printFormatter(this.element, tableEl);
		}

		window.print();

		this.cleanup();

		window.scrollTo(scrollX, scrollY);

		this.manualBlock = false;
	};

	Tabulator.prototype.registerModule("print", Print);
	var ReactiveData = function ReactiveData(table) {
		this.table = table; //hold Tabulator object
		this.data = false;
		this.blocked = false; //block reactivity while performing update
		this.origFuncs = {}; // hold original data array functions to allow replacement after data is done with
		this.currentVersion = 0;
	};

	ReactiveData.prototype.watchData = function (data) {
		var self = this,
		    version;

		this.currentVersion++;

		version = this.currentVersion;

		self.unwatchData();

		self.data = data;

		//override array push function
		self.origFuncs.push = data.push;

		Object.defineProperty(self.data, "push", {
			enumerable: false,
			configurable: true,
			value: function value() {
				var args = Array.from(arguments);

				if (!self.blocked && version === self.currentVersion) {
					args.forEach(function (arg) {
						self.table.rowManager.addRowActual(arg, false);
					});
				}

				return self.origFuncs.push.apply(data, arguments);
			}
		});

		//override array unshift function
		self.origFuncs.unshift = data.unshift;

		Object.defineProperty(self.data, "unshift", {
			enumerable: false,
			configurable: true,
			value: function value() {
				var args = Array.from(arguments);

				if (!self.blocked && version === self.currentVersion) {
					args.forEach(function (arg) {
						self.table.rowManager.addRowActual(arg, true);
					});
				}

				return self.origFuncs.unshift.apply(data, arguments);
			}
		});

		//override array shift function
		self.origFuncs.shift = data.shift;

		Object.defineProperty(self.data, "shift", {
			enumerable: false,
			configurable: true,
			value: function value() {
				var row;

				if (!self.blocked && version === self.currentVersion) {
					if (self.data.length) {
						row = self.table.rowManager.getRowFromDataObject(self.data[0]);

						if (row) {
							row.deleteActual();
						}
					}
				}

				return self.origFuncs.shift.call(data);
			}
		});

		//override array pop function
		self.origFuncs.pop = data.pop;

		Object.defineProperty(self.data, "pop", {
			enumerable: false,
			configurable: true,
			value: function value() {
				var row;
				if (!self.blocked && version === self.currentVersion) {
					if (self.data.length) {
						row = self.table.rowManager.getRowFromDataObject(self.data[self.data.length - 1]);

						if (row) {
							row.deleteActual();
						}
					}
				}
				return self.origFuncs.pop.call(data);
			}
		});

		//override array splice function
		self.origFuncs.splice = data.splice;

		Object.defineProperty(self.data, "splice", {
			enumerable: false,
			configurable: true,
			value: function value() {
				var args = Array.from(arguments),
				    start = args[0] < 0 ? data.length + args[0] : args[0],
				    end = args[1],
				    newRows = args[2] ? args.slice(2) : false,
				    startRow;

				if (!self.blocked && version === self.currentVersion) {

					//add new rows
					if (newRows) {
						startRow = data[start] ? self.table.rowManager.getRowFromDataObject(data[start]) : false;

						if (startRow) {
							newRows.forEach(function (rowData) {
								self.table.rowManager.addRowActual(rowData, true, startRow, true);
							});
						} else {
							newRows = newRows.slice().reverse();

							newRows.forEach(function (rowData) {
								self.table.rowManager.addRowActual(rowData, true, false, true);
							});
						}
					}

					//delete removed rows
					if (end !== 0) {
						var oldRows = data.slice(start, typeof args[1] === "undefined" ? args[1] : start + end);

						oldRows.forEach(function (rowData, i) {
							var row = self.table.rowManager.getRowFromDataObject(rowData);

							if (row) {
								row.deleteActual(i !== oldRows.length - 1);
							}
						});
					}

					if (newRows || end !== 0) {
						self.table.rowManager.reRenderInPosition();
					}
				}

				return self.origFuncs.splice.apply(data, arguments);
			}
		});
	};

	ReactiveData.prototype.unwatchData = function () {
		if (this.data !== false) {
			for (var key in this.origFuncs) {
				Object.defineProperty(this.data, key, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: this.origFuncs.key
				});
			}
		}
	};

	ReactiveData.prototype.watchRow = function (row) {
		var data = row.getData();

		this.blocked = true;

		for (var key in data) {
			this.watchKey(row, data, key);
		}

		this.blocked = false;
	};

	ReactiveData.prototype.watchKey = function (row, data, key) {
		var self = this,
		    props = Object.getOwnPropertyDescriptor(data, key),
		    value = data[key],
		    version = this.currentVersion;

		Object.defineProperty(data, key, {
			set: function set(newValue) {
				value = newValue;
				if (!self.blocked && version === self.currentVersion) {
					var update = {};
					update[key] = newValue;
					row.updateData(update);
				}

				if (props.set) {
					props.set(newValue);
				}
			},
			get: function get() {

				if (props.get) {
					props.get();
				}

				return value;
			}
		});
	};

	ReactiveData.prototype.unwatchRow = function (row) {
		var data = row.getData();

		for (var key in data) {
			Object.defineProperty(data, key, {
				value: data[key]
			});
		}
	};

	ReactiveData.prototype.block = function () {
		this.blocked = true;
	};

	ReactiveData.prototype.unblock = function () {
		this.blocked = false;
	};

	Tabulator.prototype.registerModule("reactiveData", ReactiveData);

	var ResizeColumns = function ResizeColumns(table) {
		this.table = table; //hold Tabulator object
		this.startColumn = false;
		this.startX = false;
		this.startWidth = false;
		this.handle = null;
		this.prevHandle = null;
	};

	ResizeColumns.prototype.initializeColumn = function (type, column, element) {
		var self = this,
		    variableHeight = false,
		    mode = this.table.options.resizableColumns;

		//set column resize mode
		if (type === "header") {
			variableHeight = column.definition.formatter == "textarea" || column.definition.variableHeight;
			column.modules.resize = { variableHeight: variableHeight };
		}

		if (mode === true || mode == type) {

			var handle = document.createElement('div');
			handle.className = "tabulator-col-resize-handle";

			var prevHandle = document.createElement('div');
			prevHandle.className = "tabulator-col-resize-handle prev";

			handle.addEventListener("click", function (e) {
				e.stopPropagation();
			});

			var handleDown = function handleDown(e) {
				var nearestColumn = column.getLastColumn();

				if (nearestColumn && self._checkResizability(nearestColumn)) {
					self.startColumn = column;
					self._mouseDown(e, nearestColumn, handle);
				}
			};

			handle.addEventListener("mousedown", handleDown);
			handle.addEventListener("touchstart", handleDown, { passive: true });

			//reszie column on  double click
			handle.addEventListener("dblclick", function (e) {
				var col = column.getLastColumn();

				if (col && self._checkResizability(col)) {
					e.stopPropagation();
					col.reinitializeWidth(true);
				}
			});

			prevHandle.addEventListener("click", function (e) {
				e.stopPropagation();
			});

			var prevHandleDown = function prevHandleDown(e) {
				var nearestColumn, colIndex, prevColumn;

				nearestColumn = column.getFirstColumn();

				if (nearestColumn) {
					colIndex = self.table.columnManager.findColumnIndex(nearestColumn);
					prevColumn = colIndex > 0 ? self.table.columnManager.getColumnByIndex(colIndex - 1) : false;

					if (prevColumn && self._checkResizability(prevColumn)) {
						self.startColumn = column;
						self._mouseDown(e, prevColumn, prevHandle);
					}
				}
			};

			prevHandle.addEventListener("mousedown", prevHandleDown);
			prevHandle.addEventListener("touchstart", prevHandleDown, { passive: true });

			//resize column on double click
			prevHandle.addEventListener("dblclick", function (e) {
				var nearestColumn, colIndex, prevColumn;

				nearestColumn = column.getFirstColumn();

				if (nearestColumn) {
					colIndex = self.table.columnManager.findColumnIndex(nearestColumn);
					prevColumn = colIndex > 0 ? self.table.columnManager.getColumnByIndex(colIndex - 1) : false;

					if (prevColumn && self._checkResizability(prevColumn)) {
						e.stopPropagation();
						prevColumn.reinitializeWidth(true);
					}
				}
			});

			element.appendChild(handle);
			element.appendChild(prevHandle);
		}
	};

	ResizeColumns.prototype._checkResizability = function (column) {
		return typeof column.definition.resizable != "undefined" ? column.definition.resizable : this.table.options.resizableColumns;
	};

	ResizeColumns.prototype._mouseDown = function (e, column, handle) {
		var self = this;

		self.table.element.classList.add("tabulator-block-select");

		function mouseMove(e) {
			// self.table.columnManager.tempScrollBlock();

			column.setWidth(self.startWidth + ((typeof e.screenX === "undefined" ? e.touches[0].screenX : e.screenX) - self.startX));

			if (!self.table.browserSlow && column.modules.resize && column.modules.resize.variableHeight) {
				column.checkCellHeights();
			}
		}

		function mouseUp(e) {

			//block editor from taking action while resizing is taking place
			if (self.startColumn.modules.edit) {
				self.startColumn.modules.edit.blocked = false;
			}

			if (self.table.browserSlow && column.modules.resize && column.modules.resize.variableHeight) {
				column.checkCellHeights();
			}

			document.body.removeEventListener("mouseup", mouseUp);
			document.body.removeEventListener("mousemove", mouseMove);

			handle.removeEventListener("touchmove", mouseMove);
			handle.removeEventListener("touchend", mouseUp);

			self.table.element.classList.remove("tabulator-block-select");

			if (self.table.options.persistence && self.table.modExists("persistence", true) && self.table.modules.persistence.config.columns) {
				self.table.modules.persistence.save("columns");
			}

			self.table.options.columnResized.call(self.table, column.getComponent());
		}

		e.stopPropagation(); //prevent resize from interfereing with movable columns

		//block editor from taking action while resizing is taking place
		if (self.startColumn.modules.edit) {
			self.startColumn.modules.edit.blocked = true;
		}

		self.startX = typeof e.screenX === "undefined" ? e.touches[0].screenX : e.screenX;
		self.startWidth = column.getWidth();

		document.body.addEventListener("mousemove", mouseMove);
		document.body.addEventListener("mouseup", mouseUp);
		handle.addEventListener("touchmove", mouseMove, { passive: true });
		handle.addEventListener("touchend", mouseUp);
	};

	Tabulator.prototype.registerModule("resizeColumns", ResizeColumns);
	var ResizeRows = function ResizeRows(table) {
		this.table = table; //hold Tabulator object
		this.startColumn = false;
		this.startY = false;
		this.startHeight = false;
		this.handle = null;
		this.prevHandle = null;
	};

	ResizeRows.prototype.initializeRow = function (row) {
		var self = this,
		    rowEl = row.getElement();

		var handle = document.createElement('div');
		handle.className = "tabulator-row-resize-handle";

		var prevHandle = document.createElement('div');
		prevHandle.className = "tabulator-row-resize-handle prev";

		handle.addEventListener("click", function (e) {
			e.stopPropagation();
		});

		var handleDown = function handleDown(e) {
			self.startRow = row;
			self._mouseDown(e, row, handle);
		};

		handle.addEventListener("mousedown", handleDown);
		handle.addEventListener("touchstart", handleDown, { passive: true });

		prevHandle.addEventListener("click", function (e) {
			e.stopPropagation();
		});

		var prevHandleDown = function prevHandleDown(e) {
			var prevRow = self.table.rowManager.prevDisplayRow(row);

			if (prevRow) {
				self.startRow = prevRow;
				self._mouseDown(e, prevRow, prevHandle);
			}
		};

		prevHandle.addEventListener("mousedown", prevHandleDown);
		prevHandle.addEventListener("touchstart", prevHandleDown, { passive: true });

		rowEl.appendChild(handle);
		rowEl.appendChild(prevHandle);
	};

	ResizeRows.prototype._mouseDown = function (e, row, handle) {
		var self = this;

		self.table.element.classList.add("tabulator-block-select");

		function mouseMove(e) {
			row.setHeight(self.startHeight + ((typeof e.screenY === "undefined" ? e.touches[0].screenY : e.screenY) - self.startY));
		}

		function mouseUp(e) {

			// //block editor from taking action while resizing is taking place
			// if(self.startColumn.modules.edit){
			// 	self.startColumn.modules.edit.blocked = false;
			// }

			document.body.removeEventListener("mouseup", mouseMove);
			document.body.removeEventListener("mousemove", mouseMove);

			handle.removeEventListener("touchmove", mouseMove);
			handle.removeEventListener("touchend", mouseUp);

			self.table.element.classList.remove("tabulator-block-select");

			self.table.options.rowResized.call(this.table, row.getComponent());
		}

		e.stopPropagation(); //prevent resize from interfereing with movable columns

		//block editor from taking action while resizing is taking place
		// if(self.startColumn.modules.edit){
		// 	self.startColumn.modules.edit.blocked = true;
		// }

		self.startY = typeof e.screenY === "undefined" ? e.touches[0].screenY : e.screenY;
		self.startHeight = row.getHeight();

		document.body.addEventListener("mousemove", mouseMove);
		document.body.addEventListener("mouseup", mouseUp);

		handle.addEventListener("touchmove", mouseMove, { passive: true });
		handle.addEventListener("touchend", mouseUp);
	};

	Tabulator.prototype.registerModule("resizeRows", ResizeRows);
	var ResizeTable = function ResizeTable(table) {
		this.table = table; //hold Tabulator object
		this.binding = false;
		this.observer = false;
		this.containerObserver = false;

		this.tableHeight = 0;
		this.tableWidth = 0;
		this.containerHeight = 0;
		this.containerWidth = 0;

		this.autoResize = false;
	};

	ResizeTable.prototype.initialize = function (row) {
		var _this76 = this;

		var table = this.table,
		    tableStyle;

		this.tableHeight = table.element.clientHeight;
		this.tableWidth = table.element.clientWidth;

		if (table.element.parentNode) {
			this.containerHeight = table.element.parentNode.clientHeight;
			this.containerWidth = table.element.parentNode.clientWidth;
		}

		if (typeof ResizeObserver !== "undefined" && table.rowManager.getRenderMode() === "virtual") {

			this.autoResize = true;

			this.observer = new ResizeObserver(function (entry) {
				if (!table.browserMobile || table.browserMobile && !table.modules.edit.currentCell) {

					var nodeHeight = Math.floor(entry[0].contentRect.height);
					var nodeWidth = Math.floor(entry[0].contentRect.width);

					if (_this76.tableHeight != nodeHeight || _this76.tableWidth != nodeWidth) {
						_this76.tableHeight = nodeHeight;
						_this76.tableWidth = nodeWidth;

						if (table.element.parentNode) {
							_this76.containerHeight = table.element.parentNode.clientHeight;
							_this76.containerWidth = table.element.parentNode.clientWidth;
						}

						table.redraw();
					}
				}
			});

			this.observer.observe(table.element);

			tableStyle = window.getComputedStyle(table.element);

			if (this.table.element.parentNode && !this.table.rowManager.fixedHeight && (tableStyle.getPropertyValue("max-height") || tableStyle.getPropertyValue("min-height"))) {

				this.containerObserver = new ResizeObserver(function (entry) {
					if (!table.browserMobile || table.browserMobile && !table.modules.edit.currentCell) {

						var nodeHeight = Math.floor(entry[0].contentRect.height);
						var nodeWidth = Math.floor(entry[0].contentRect.width);

						if (_this76.containerHeight != nodeHeight || _this76.containerWidth != nodeWidth) {
							_this76.containerHeight = nodeHeight;
							_this76.containerWidth = nodeWidth;
							_this76.tableHeight = table.element.clientHeight;
							_this76.tableWidth = table.element.clientWidth;

							table.redraw();
						}

						table.redraw();
					}
				});

				this.containerObserver.observe(this.table.element.parentNode);
			}
		} else {
			this.binding = function () {
				if (!table.browserMobile || table.browserMobile && !table.modules.edit.currentCell) {
					table.redraw();
				}
			};

			window.addEventListener("resize", this.binding);
		}
	};

	ResizeTable.prototype.clearBindings = function (row) {
		if (this.binding) {
			window.removeEventListener("resize", this.binding);
		}

		if (this.observer) {
			this.observer.unobserve(this.table.element);
		}

		if (this.containerObserver) {
			this.containerObserver.unobserve(this.table.element.parentNode);
		}
	};

	Tabulator.prototype.registerModule("resizeTable", ResizeTable);
	var ResponsiveLayout = function ResponsiveLayout(table) {
		this.table = table; //hold Tabulator object
		this.columns = [];
		this.hiddenColumns = [];
		this.mode = "";
		this.index = 0;
		this.collapseFormatter = [];
		this.collapseStartOpen = true;
		this.collapseHandleColumn = false;
	};

	//generate resposive columns list
	ResponsiveLayout.prototype.initialize = function () {
		var self = this,
		    columns = [];

		this.mode = this.table.options.responsiveLayout;
		this.collapseFormatter = this.table.options.responsiveLayoutCollapseFormatter || this.formatCollapsedData;
		this.collapseStartOpen = this.table.options.responsiveLayoutCollapseStartOpen;
		this.hiddenColumns = [];

		//detemine level of responsivity for each column
		this.table.columnManager.columnsByIndex.forEach(function (column, i) {
			if (column.modules.responsive) {
				if (column.modules.responsive.order && column.modules.responsive.visible) {
					column.modules.responsive.index = i;
					columns.push(column);

					if (!column.visible && self.mode === "collapse") {
						self.hiddenColumns.push(column);
					}
				}
			}
		});

		//sort list by responsivity
		columns = columns.reverse();
		columns = columns.sort(function (a, b) {
			var diff = b.modules.responsive.order - a.modules.responsive.order;
			return diff || b.modules.responsive.index - a.modules.responsive.index;
		});

		this.columns = columns;

		if (this.mode === "collapse") {
			this.generateCollapsedContent();
		}

		//assign collapse column
		for (var _iterator = this.table.columnManager.columnsByIndex, _isArray = Array.isArray(_iterator), _i13 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i13 >= _iterator.length) break;
				_ref = _iterator[_i13++];
			} else {
				_i13 = _iterator.next();
				if (_i13.done) break;
				_ref = _i13.value;
			}

			var col = _ref;

			if (col.definition.formatter == "responsiveCollapse") {
				this.collapseHandleColumn = col;
				break;
			}
		}

		if (this.collapseHandleColumn) {
			if (this.hiddenColumns.length) {
				this.collapseHandleColumn.show();
			} else {
				this.collapseHandleColumn.hide();
			}
		}
	};

	//define layout information
	ResponsiveLayout.prototype.initializeColumn = function (column) {
		var def = column.getDefinition();

		column.modules.responsive = { order: typeof def.responsive === "undefined" ? 1 : def.responsive, visible: def.visible === false ? false : true };
	};

	ResponsiveLayout.prototype.initializeRow = function (row) {
		var el;

		if (row.type !== "calc") {
			el = document.createElement("div");
			el.classList.add("tabulator-responsive-collapse");

			row.modules.responsiveLayout = {
				element: el,
				open: this.collapseStartOpen
			};

			if (!this.collapseStartOpen) {
				el.style.display = 'none';
			}
		}
	};

	ResponsiveLayout.prototype.layoutRow = function (row) {
		var rowEl = row.getElement();

		if (row.modules.responsiveLayout) {
			rowEl.appendChild(row.modules.responsiveLayout.element);
			this.generateCollapsedRowContent(row);
		}
	};

	//update column visibility
	ResponsiveLayout.prototype.updateColumnVisibility = function (column, visible) {
		if (column.modules.responsive) {
			column.modules.responsive.visible = visible;
			this.initialize();
		}
	};

	ResponsiveLayout.prototype.hideColumn = function (column) {
		var colCount = this.hiddenColumns.length;

		column.hide(false, true);

		if (this.mode === "collapse") {
			this.hiddenColumns.unshift(column);
			this.generateCollapsedContent();

			if (this.collapseHandleColumn && !colCount) {
				this.collapseHandleColumn.show();
			}
		}
	};

	ResponsiveLayout.prototype.showColumn = function (column) {
		var index;

		column.show(false, true);
		//set column width to prevent calculation loops on uninitialized columns
		column.setWidth(column.getWidth());

		if (this.mode === "collapse") {
			index = this.hiddenColumns.indexOf(column);

			if (index > -1) {
				this.hiddenColumns.splice(index, 1);
			}

			this.generateCollapsedContent();

			if (this.collapseHandleColumn && !this.hiddenColumns.length) {
				this.collapseHandleColumn.hide();
			}
		}
	};

	//redraw columns to fit space
	ResponsiveLayout.prototype.update = function () {
		var self = this,
		    working = true;

		while (working) {

			var width = self.table.modules.layout.getMode() == "fitColumns" ? self.table.columnManager.getFlexBaseWidth() : self.table.columnManager.getWidth();

			var diff = (self.table.options.headerVisible ? self.table.columnManager.element.clientWidth : self.table.element.clientWidth) - width;

			if (diff < 0) {
				//table is too wide
				var column = self.columns[self.index];

				if (column) {
					self.hideColumn(column);
					self.index++;
				} else {
					working = false;
				}
			} else {

				//table has spare space
				var _column = self.columns[self.index - 1];

				if (_column) {
					if (diff > 0) {
						if (diff >= _column.getWidth()) {
							self.showColumn(_column);
							self.index--;
						} else {
							working = false;
						}
					} else {
						working = false;
					}
				} else {
					working = false;
				}
			}

			if (!self.table.rowManager.activeRowsCount) {
				self.table.rowManager.renderEmptyScroll();
			}
		}
	};

	ResponsiveLayout.prototype.generateCollapsedContent = function () {
		var self = this,
		    rows = this.table.rowManager.getDisplayRows();

		rows.forEach(function (row) {
			self.generateCollapsedRowContent(row);
		});
	};

	ResponsiveLayout.prototype.generateCollapsedRowContent = function (row) {
		var el, contents;

		if (row.modules.responsiveLayout) {
			el = row.modules.responsiveLayout.element;

			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}contents = this.collapseFormatter(this.generateCollapsedRowData(row));
			if (contents) {
				el.appendChild(contents);
			}
		}
	};

	ResponsiveLayout.prototype.generateCollapsedRowData = function (row) {
		var self = this,
		    data = row.getData(),
		    output = [],
		    mockCellComponent;

		this.hiddenColumns.forEach(function (column) {
			var value = column.getFieldValue(data);

			if (column.definition.title && column.field) {
				if (column.modules.format && self.table.options.responsiveLayoutCollapseUseFormatters) {

					mockCellComponent = {
						value: false,
						data: {},
						getValue: function getValue() {
							return value;
						},
						getData: function getData() {
							return data;
						},
						getElement: function getElement() {
							return document.createElement("div");
						},
						getRow: function getRow() {
							return row.getComponent();
						},
						getColumn: function getColumn() {
							return column.getComponent();
						}
					};

					output.push({
						title: column.definition.title,
						value: column.modules.format.formatter.call(self.table.modules.format, mockCellComponent, column.modules.format.params)
					});
				} else {
					output.push({
						title: column.definition.title,
						value: value
					});
				}
			}
		});

		return output;
	};

	ResponsiveLayout.prototype.formatCollapsedData = function (data) {
		var list = document.createElement("table"),
		    listContents = "";

		data.forEach(function (item) {
			var div = document.createElement("div");

			if (item.value instanceof Node) {
				div.appendChild(item.value);
				item.value = div.innerHTML;
			}

			listContents += "<tr><td><strong>" + item.title + "</strong></td><td>" + item.value + "</td></tr>";
		});

		list.innerHTML = listContents;

		return Object.keys(data).length ? list : "";
	};

	Tabulator.prototype.registerModule("responsiveLayout", ResponsiveLayout);

	var SelectRow = function SelectRow(table) {
		this.table = table; //hold Tabulator object
		this.selecting = false; //flag selecting in progress
		this.lastClickedRow = false; //last clicked row
		this.selectPrev = []; //hold previously selected element for drag drop selection
		this.selectedRows = []; //hold selected rows
		this.headerCheckboxElement = null; // hold header select element
	};

	SelectRow.prototype.clearSelectionData = function (silent) {
		this.selecting = false;
		this.lastClickedRow = false;
		this.selectPrev = [];
		this.selectedRows = [];

		if (!silent) {
			this._rowSelectionChanged();
		}
	};

	SelectRow.prototype.initializeRow = function (row) {
		var self = this,
		    element = row.getElement();

		// trigger end of row selection
		var endSelect = function endSelect() {

			setTimeout(function () {
				self.selecting = false;
			}, 50);

			document.body.removeEventListener("mouseup", endSelect);
		};

		row.modules.select = { selected: false };

		//set row selection class
		if (self.table.options.selectableCheck.call(this.table, row.getComponent())) {
			element.classList.add("tabulator-selectable");
			element.classList.remove("tabulator-unselectable");

			if (self.table.options.selectable && self.table.options.selectable != "highlight") {
				if (self.table.options.selectableRangeMode === "click") {
					element.addEventListener("click", function (e) {
						if (e.shiftKey) {
							self.table._clearSelection();
							self.lastClickedRow = self.lastClickedRow || row;

							var lastClickedRowIdx = self.table.rowManager.getDisplayRowIndex(self.lastClickedRow);
							var rowIdx = self.table.rowManager.getDisplayRowIndex(row);

							var fromRowIdx = lastClickedRowIdx <= rowIdx ? lastClickedRowIdx : rowIdx;
							var toRowIdx = lastClickedRowIdx >= rowIdx ? lastClickedRowIdx : rowIdx;

							var rows = self.table.rowManager.getDisplayRows().slice(0);
							var toggledRows = rows.splice(fromRowIdx, toRowIdx - fromRowIdx + 1);

							if (e.ctrlKey || e.metaKey) {
								toggledRows.forEach(function (toggledRow) {
									if (toggledRow !== self.lastClickedRow) {

										if (self.table.options.selectable !== true && !self.isRowSelected(row)) {
											if (self.selectedRows.length < self.table.options.selectable) {
												self.toggleRow(toggledRow);
											}
										} else {
											self.toggleRow(toggledRow);
										}
									}
								});
								self.lastClickedRow = row;
							} else {
								self.deselectRows(undefined, true);

								if (self.table.options.selectable !== true) {
									if (toggledRows.length > self.table.options.selectable) {
										toggledRows = toggledRows.slice(0, self.table.options.selectable);
									}
								}

								self.selectRows(toggledRows);
							}
							self.table._clearSelection();
						} else if (e.ctrlKey || e.metaKey) {
							self.toggleRow(row);
							self.lastClickedRow = row;
						} else {
							self.deselectRows(undefined, true);
							self.selectRows(row);
							self.lastClickedRow = row;
						}
					});
				} else {
					element.addEventListener("click", function (e) {
						if (!self.table.modExists("edit") || !self.table.modules.edit.getCurrentCell()) {
							self.table._clearSelection();
						}

						if (!self.selecting) {
							self.toggleRow(row);
						}
					});

					element.addEventListener("mousedown", function (e) {
						if (e.shiftKey) {
							self.table._clearSelection();

							self.selecting = true;

							self.selectPrev = [];

							document.body.addEventListener("mouseup", endSelect);
							document.body.addEventListener("keyup", endSelect);

							self.toggleRow(row);

							return false;
						}
					});

					element.addEventListener("mouseenter", function (e) {
						if (self.selecting) {
							self.table._clearSelection();
							self.toggleRow(row);

							if (self.selectPrev[1] == row) {
								self.toggleRow(self.selectPrev[0]);
							}
						}
					});

					element.addEventListener("mouseout", function (e) {
						if (self.selecting) {
							self.table._clearSelection();
							self.selectPrev.unshift(row);
						}
					});
				}
			}
		} else {
			element.classList.add("tabulator-unselectable");
			element.classList.remove("tabulator-selectable");
		}
	};

	//toggle row selection
	SelectRow.prototype.toggleRow = function (row) {
		if (this.table.options.selectableCheck.call(this.table, row.getComponent())) {
			if (row.modules.select && row.modules.select.selected) {
				this._deselectRow(row);
			} else {
				this._selectRow(row);
			}
		}
	};

	//select a number of rows
	SelectRow.prototype.selectRows = function (rows) {
		var _this77 = this;

		var rowMatch;

		switch (typeof rows === 'undefined' ? 'undefined' : _typeof(rows)) {
			case "undefined":
				this.table.rowManager.rows.forEach(function (row) {
					_this77._selectRow(row, true, true);
				});

				this._rowSelectionChanged();
				break;

			case "string":

				rowMatch = this.table.rowManager.findRow(rows);

				if (rowMatch) {
					this._selectRow(rowMatch, true, true);
				} else {
					this.table.rowManager.getRows(rows).forEach(function (row) {
						_this77._selectRow(row, true, true);
					});
				}

				this._rowSelectionChanged();
				break;

			default:
				if (Array.isArray(rows)) {
					rows.forEach(function (row) {
						_this77._selectRow(row, true, true);
					});

					this._rowSelectionChanged();
				} else {
					this._selectRow(rows, false, true);
				}
				break;
		}
	};

	//select an individual row
	SelectRow.prototype._selectRow = function (rowInfo, silent, force) {

		//handle max row count
		if (!isNaN(this.table.options.selectable) && this.table.options.selectable !== true && !force) {
			if (this.selectedRows.length >= this.table.options.selectable) {
				if (this.table.options.selectableRollingSelection) {
					this._deselectRow(this.selectedRows[0]);
				} else {
					return false;
				}
			}
		}

		var row = this.table.rowManager.findRow(rowInfo);

		if (row) {
			if (this.selectedRows.indexOf(row) == -1) {
				if (!row.modules.select) {
					row.modules.select = {};
				}

				row.modules.select.selected = true;
				if (row.modules.select.checkboxEl) {
					row.modules.select.checkboxEl.checked = true;
				}
				row.getElement().classList.add("tabulator-selected");

				this.selectedRows.push(row);

				if (this.table.options.dataTreeSelectPropagate) {
					this.childRowSelection(row, true);
				}

				if (!silent) {
					this.table.options.rowSelected.call(this.table, row.getComponent());
				}

				this._rowSelectionChanged(silent);
			}
		} else {
			if (!silent) {
				console.warn("Selection Error - No such row found, ignoring selection:" + rowInfo);
			}
		}
	};

	SelectRow.prototype.isRowSelected = function (row) {
		return this.selectedRows.indexOf(row) !== -1;
	};

	//deselect a number of rows
	SelectRow.prototype.deselectRows = function (rows, silent) {
		var self = this,
		    rowCount;

		if (typeof rows == "undefined") {

			rowCount = self.selectedRows.length;

			for (var _i14 = 0; _i14 < rowCount; _i14++) {
				self._deselectRow(self.selectedRows[0], true);
			}

			self._rowSelectionChanged(silent);
		} else {
			if (Array.isArray(rows)) {
				rows.forEach(function (row) {
					self._deselectRow(row, true);
				});

				self._rowSelectionChanged(silent);
			} else {
				self._deselectRow(rows, silent);
			}
		}
	};

	//deselect an individual row
	SelectRow.prototype._deselectRow = function (rowInfo, silent) {
		var self = this,
		    row = self.table.rowManager.findRow(rowInfo),
		    index;

		if (row) {
			index = self.selectedRows.findIndex(function (selectedRow) {
				return selectedRow == row;
			});

			if (index > -1) {

				if (!row.modules.select) {
					row.modules.select = {};
				}

				row.modules.select.selected = false;
				if (row.modules.select.checkboxEl) {
					row.modules.select.checkboxEl.checked = false;
				}
				row.getElement().classList.remove("tabulator-selected");
				self.selectedRows.splice(index, 1);

				if (this.table.options.dataTreeSelectPropagate) {
					this.childRowSelection(row, false);
				}

				if (!silent) {
					self.table.options.rowDeselected.call(this.table, row.getComponent());
				}

				self._rowSelectionChanged(silent);
			}
		} else {
			if (!silent) {
				console.warn("Deselection Error - No such row found, ignoring selection:" + rowInfo);
			}
		}
	};

	SelectRow.prototype.getSelectedData = function () {
		var data = [];

		this.selectedRows.forEach(function (row) {
			data.push(row.getData());
		});

		return data;
	};

	SelectRow.prototype.getSelectedRows = function () {

		var rows = [];

		this.selectedRows.forEach(function (row) {
			rows.push(row.getComponent());
		});

		return rows;
	};

	SelectRow.prototype._rowSelectionChanged = function (silent) {
		if (this.headerCheckboxElement) {
			if (this.selectedRows.length === 0) {
				this.headerCheckboxElement.checked = false;
				this.headerCheckboxElement.indeterminate = false;
			} else if (this.table.rowManager.rows.length === this.selectedRows.length) {
				this.headerCheckboxElement.checked = true;
				this.headerCheckboxElement.indeterminate = false;
			} else {
				this.headerCheckboxElement.indeterminate = true;
				this.headerCheckboxElement.checked = false;
			}
		}

		if (!silent) {
			this.table.options.rowSelectionChanged.call(this.table, this.getSelectedData(), this.getSelectedRows());
		}
	};

	SelectRow.prototype.registerRowSelectCheckbox = function (row, element) {
		if (!row._row.modules.select) {
			row._row.modules.select = {};
		}

		row._row.modules.select.checkboxEl = element;
	};

	SelectRow.prototype.registerHeaderSelectCheckbox = function (element) {
		this.headerCheckboxElement = element;
	};

	SelectRow.prototype.childRowSelection = function (row, select) {
		var children = this.table.modules.dataTree.getChildren(row);

		if (select) {
			for (var _iterator2 = children, _isArray2 = Array.isArray(_iterator2), _i15 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i15 >= _iterator2.length) break;
					_ref2 = _iterator2[_i15++];
				} else {
					_i15 = _iterator2.next();
					if (_i15.done) break;
					_ref2 = _i15.value;
				}

				var child = _ref2;

				this._selectRow(child, true);
			}
		} else {
			for (var _iterator3 = children, _isArray3 = Array.isArray(_iterator3), _i16 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
				var _ref3;

				if (_isArray3) {
					if (_i16 >= _iterator3.length) break;
					_ref3 = _iterator3[_i16++];
				} else {
					_i16 = _iterator3.next();
					if (_i16.done) break;
					_ref3 = _i16.value;
				}

				var _child = _ref3;

				this._deselectRow(_child, true);
			}
		}
	};

	Tabulator.prototype.registerModule("selectRow", SelectRow);

	var Sort = function Sort(table) {
		this.table = table; //hold Tabulator object
		this.sortList = []; //holder current sort
		this.changed = false; //has the sort changed since last render
	};

	//initialize column header for sorting
	Sort.prototype.initializeColumn = function (column, content) {
		var self = this,
		    sorter = false,
		    colEl,
		    arrowEl;

		switch (_typeof(column.definition.sorter)) {
			case "string":
				if (self.sorters[column.definition.sorter]) {
					sorter = self.sorters[column.definition.sorter];
				} else {
					console.warn("Sort Error - No such sorter found: ", column.definition.sorter);
				}
				break;

			case "function":
				sorter = column.definition.sorter;
				break;
		}

		column.modules.sort = {
			sorter: sorter, dir: "none",
			params: column.definition.sorterParams || {},
			startingDir: column.definition.headerSortStartingDir || "asc",
			tristate: typeof column.definition.headerSortTristate !== "undefined" ? column.definition.headerSortTristate : this.table.options.headerSortTristate
		};

		if (typeof column.definition.headerSort === "undefined" ? this.table.options.headerSort !== false : column.definition.headerSort !== false) {

			colEl = column.getElement();

			colEl.classList.add("tabulator-sortable");

			arrowEl = document.createElement("div");
			arrowEl.classList.add("tabulator-arrow");
			//create sorter arrow
			content.appendChild(arrowEl);

			//sort on click
			colEl.addEventListener("click", function (e) {
				var dir = "",
				    sorters = [],
				    match = false;

				if (column.modules.sort) {
					if (column.modules.sort.tristate) {
						if (column.modules.sort.dir == "none") {
							dir = column.modules.sort.startingDir;
						} else {
							if (column.modules.sort.dir == column.modules.sort.startingDir) {
								dir = column.modules.sort.dir == "asc" ? "desc" : "asc";
							} else {
								dir = "none";
							}
						}
					} else {
						switch (column.modules.sort.dir) {
							case "asc":
								dir = "desc";
								break;

							case "desc":
								dir = "asc";
								break;

							default:
								dir = column.modules.sort.startingDir;
						}
					}

					if (self.table.options.columnHeaderSortMulti && (e.shiftKey || e.ctrlKey)) {
						sorters = self.getSort();

						match = sorters.findIndex(function (sorter) {
							return sorter.field === column.getField();
						});

						if (match > -1) {
							sorters[match].dir = dir;

							if (match != sorters.length - 1) {
								match = sorters.splice(match, 1)[0];
								if (dir != "none") {
									sorters.push(match);
								}
							}
						} else {
							if (dir != "none") {
								sorters.push({ column: column, dir: dir });
							}
						}

						//add to existing sort
						self.setSort(sorters);
					} else {
						if (dir == "none") {
							self.clear();
						} else {
							//sort by column only
							self.setSort(column, dir);
						}
					}

					self.table.rowManager.sorterRefresh(!self.sortList.length);
				}
			});
		}
	};

	//check if the sorters have changed since last use
	Sort.prototype.hasChanged = function () {
		var changed = this.changed;
		this.changed = false;
		return changed;
	};

	//return current sorters
	Sort.prototype.getSort = function () {
		var self = this,
		    sorters = [];

		self.sortList.forEach(function (item) {
			if (item.column) {
				sorters.push({ column: item.column.getComponent(), field: item.column.getField(), dir: item.dir });
			}
		});

		return sorters;
	};

	//change sort list and trigger sort
	Sort.prototype.setSort = function (sortList, dir) {
		var self = this,
		    newSortList = [];

		if (!Array.isArray(sortList)) {
			sortList = [{ column: sortList, dir: dir }];
		}

		sortList.forEach(function (item) {
			var column;

			column = self.table.columnManager.findColumn(item.column);

			if (column) {
				item.column = column;
				newSortList.push(item);
				self.changed = true;
			} else {
				console.warn("Sort Warning - Sort field does not exist and is being ignored: ", item.column);
			}
		});

		self.sortList = newSortList;

		if (this.table.options.persistence && this.table.modExists("persistence", true) && this.table.modules.persistence.config.sort) {
			this.table.modules.persistence.save("sort");
		}
	};

	//clear sorters
	Sort.prototype.clear = function () {
		this.setSort([]);
	};

	//find appropriate sorter for column
	Sort.prototype.findSorter = function (column) {
		var row = this.table.rowManager.activeRows[0],
		    sorter = "string",
		    field,
		    value;

		if (row) {
			row = row.getData();
			field = column.getField();

			if (field) {

				value = column.getFieldValue(row);

				switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
					case "undefined":
						sorter = "string";
						break;

					case "boolean":
						sorter = "boolean";
						break;

					default:
						if (!isNaN(value) && value !== "") {
							sorter = "number";
						} else {
							if (value.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i)) {
								sorter = "alphanum";
							}
						}
						break;
				}
			}
		}

		return this.sorters[sorter];
	};

	//work through sort list sorting data
	Sort.prototype.sort = function (data) {
		var self = this,
		    sortList = this.table.options.sortOrderReverse ? self.sortList.slice().reverse() : self.sortList,
		    sortListActual = [],
		    rowComponents = [];

		if (self.table.options.dataSorting) {
			self.table.options.dataSorting.call(self.table, self.getSort());
		}

		self.clearColumnHeaders();

		if (!self.table.options.ajaxSorting) {

			//build list of valid sorters and trigger column specific callbacks before sort begins
			sortList.forEach(function (item, i) {
				var sortObj = item.column.modules.sort;

				if (item.column && sortObj) {

					//if no sorter has been defined, take a guess
					if (!sortObj.sorter) {
						sortObj.sorter = self.findSorter(item.column);
					}

					item.params = typeof sortObj.params === "function" ? sortObj.params(item.column.getComponent(), item.dir) : sortObj.params;

					sortListActual.push(item);
				}

				self.setColumnHeader(item.column, item.dir);
			});

			//sort data
			if (sortListActual.length) {
				self._sortItems(data, sortListActual);
			}
		} else {
			sortList.forEach(function (item, i) {
				self.setColumnHeader(item.column, item.dir);
			});
		}

		if (self.table.options.dataSorted) {
			data.forEach(function (row) {
				rowComponents.push(row.getComponent());
			});

			self.table.options.dataSorted.call(self.table, self.getSort(), rowComponents);
		}
	};

	//clear sort arrows on columns
	Sort.prototype.clearColumnHeaders = function () {
		this.table.columnManager.getRealColumns().forEach(function (column) {
			if (column.modules.sort) {
				column.modules.sort.dir = "none";
				column.getElement().setAttribute("aria-sort", "none");
			}
		});
	};

	//set the column header sort direction
	Sort.prototype.setColumnHeader = function (column, dir) {
		column.modules.sort.dir = dir;
		column.getElement().setAttribute("aria-sort", dir);
	};

	//sort each item in sort list
	Sort.prototype._sortItems = function (data, sortList) {
		var _this78 = this;

		var sorterCount = sortList.length - 1;

		data.sort(function (a, b) {
			var result;

			for (var i = sorterCount; i >= 0; i--) {
				var sortItem = sortList[i];

				result = _this78._sortRow(a, b, sortItem.column, sortItem.dir, sortItem.params);

				if (result !== 0) {
					break;
				}
			}

			return result;
		});
	};

	//process individual rows for a sort function on active data
	Sort.prototype._sortRow = function (a, b, column, dir, params) {
		var el1Comp, el2Comp;

		//switch elements depending on search direction
		var el1 = dir == "asc" ? a : b;
		var el2 = dir == "asc" ? b : a;

		a = column.getFieldValue(el1.getData());
		b = column.getFieldValue(el2.getData());

		a = typeof a !== "undefined" ? a : "";
		b = typeof b !== "undefined" ? b : "";

		el1Comp = el1.getComponent();
		el2Comp = el2.getComponent();

		return column.modules.sort.sorter.call(this, a, b, el1Comp, el2Comp, column.getComponent(), dir, params);
	};

	//default data sorters
	Sort.prototype.sorters = {

		//sort numbers
		number: function number(a, b, aRow, bRow, column, dir, params) {
			var alignEmptyValues = params.alignEmptyValues;
			var decimal = params.decimalSeparator || ".";
			var thousand = params.thousandSeparator || ",";
			var emptyAlign = 0;

			a = parseFloat(String(a).split(thousand).join("").split(decimal).join("."));
			b = parseFloat(String(b).split(thousand).join("").split(decimal).join("."));

			//handle non numeric values
			if (isNaN(a)) {
				emptyAlign = isNaN(b) ? 0 : -1;
			} else if (isNaN(b)) {
				emptyAlign = 1;
			} else {
				//compare valid values
				return a - b;
			}

			//fix empty values in position
			if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
				emptyAlign *= -1;
			}

			return emptyAlign;
		},

		//sort strings
		string: function string(a, b, aRow, bRow, column, dir, params) {
			var alignEmptyValues = params.alignEmptyValues;
			var emptyAlign = 0;
			var locale;

			//handle empty values
			if (!a) {
				emptyAlign = !b ? 0 : -1;
			} else if (!b) {
				emptyAlign = 1;
			} else {
				//compare valid values
				switch (_typeof(params.locale)) {
					case "boolean":
						if (params.locale) {
							locale = this.table.modules.localize.getLocale();
						}
						break;
					case "string":
						locale = params.locale;
						break;
				}

				return String(a).toLowerCase().localeCompare(String(b).toLowerCase(), locale);
			}

			//fix empty values in position
			if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
				emptyAlign *= -1;
			}

			return emptyAlign;
		},

		//sort date
		date: function date(a, b, aRow, bRow, column, dir, params) {
			if (!params.format) {
				params.format = "DD/MM/YYYY";
			}

			return this.sorters.datetime.call(this, a, b, aRow, bRow, column, dir, params);
		},

		//sort HH:mm formatted times
		time: function time(a, b, aRow, bRow, column, dir, params) {
			if (!params.format) {
				params.format = "HH:mm";
			}

			return this.sorters.datetime.call(this, a, b, aRow, bRow, column, dir, params);
		},

		//sort datetime
		datetime: function datetime(a, b, aRow, bRow, column, dir, params) {
			var format = params.format || "DD/MM/YYYY HH:mm:ss",
			    alignEmptyValues = params.alignEmptyValues,
			    emptyAlign = 0;

			if (typeof moment != "undefined") {
				a = moment(a, format);
				b = moment(b, format);

				if (!a.isValid()) {
					emptyAlign = !b.isValid() ? 0 : -1;
				} else if (!b.isValid()) {
					emptyAlign = 1;
				} else {
					//compare valid values
					return a - b;
				}

				//fix empty values in position
				if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
					emptyAlign *= -1;
				}

				return emptyAlign;
			} else {
				console.error("Sort Error - 'datetime' sorter is dependant on moment.js");
			}
		},

		//sort booleans
		boolean: function boolean(a, b, aRow, bRow, column, dir, params) {
			var el1 = a === true || a === "true" || a === "True" || a === 1 ? 1 : 0;
			var el2 = b === true || b === "true" || b === "True" || b === 1 ? 1 : 0;

			return el1 - el2;
		},

		//sort if element contains any data
		array: function array(a, b, aRow, bRow, column, dir, params) {
			var el1 = 0;
			var el2 = 0;
			var type = params.type || "length";
			var alignEmptyValues = params.alignEmptyValues;
			var emptyAlign = 0;

			function calc(value) {

				switch (type) {
					case "length":
						return value.length;

					case "sum":
						return value.reduce(function (c, d) {
							return c + d;
						});

					case "max":
						return Math.max.apply(null, value);

					case "min":
						return Math.min.apply(null, value);

					case "avg":
						return value.reduce(function (c, d) {
							return c + d;
						}) / value.length;
				}
			}

			//handle non array values
			if (!Array.isArray(a)) {
				alignEmptyValues = !Array.isArray(b) ? 0 : -1;
			} else if (!Array.isArray(b)) {
				alignEmptyValues = 1;
			} else {

				//compare valid values
				el1 = a ? calc(a) : 0;
				el2 = b ? calc(b) : 0;

				return el1 - el2;
			}

			//fix empty values in position
			if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
				emptyAlign *= -1;
			}

			return emptyAlign;
		},

		//sort if element contains any data
		exists: function exists(a, b, aRow, bRow, column, dir, params) {
			var el1 = typeof a == "undefined" ? 0 : 1;
			var el2 = typeof b == "undefined" ? 0 : 1;

			return el1 - el2;
		},

		//sort alpha numeric strings
		alphanum: function alphanum(as, bs, aRow, bRow, column, dir, params) {
			var a,
			    b,
			    a1,
			    b1,
			    i = 0,
			    L,
			    rx = /(\d+)|(\D+)/g,
			    rd = /\d/;
			var alignEmptyValues = params.alignEmptyValues;
			var emptyAlign = 0;

			//handle empty values
			if (!as && as !== 0) {
				emptyAlign = !bs && bs !== 0 ? 0 : -1;
			} else if (!bs && bs !== 0) {
				emptyAlign = 1;
			} else {

				if (isFinite(as) && isFinite(bs)) return as - bs;
				a = String(as).toLowerCase();
				b = String(bs).toLowerCase();
				if (a === b) return 0;
				if (!(rd.test(a) && rd.test(b))) return a > b ? 1 : -1;
				a = a.match(rx);
				b = b.match(rx);
				L = a.length > b.length ? b.length : a.length;
				while (i < L) {
					a1 = a[i];
					b1 = b[i++];
					if (a1 !== b1) {
						if (isFinite(a1) && isFinite(b1)) {
							if (a1.charAt(0) === "0") a1 = "." + a1;
							if (b1.charAt(0) === "0") b1 = "." + b1;
							return a1 - b1;
						} else return a1 > b1 ? 1 : -1;
					}
				}

				return a.length > b.length;
			}

			//fix empty values in position
			if (alignEmptyValues === "top" && dir === "desc" || alignEmptyValues === "bottom" && dir === "asc") {
				emptyAlign *= -1;
			}

			return emptyAlign;
		}
	};

	Tabulator.prototype.registerModule("sort", Sort);

	var Validate = function Validate(table) {
		this.table = table;
		this.invalidCells = [];
	};

	//validate
	Validate.prototype.initializeColumn = function (column) {
		var self = this,
		    config = [],
		    validator;

		if (column.definition.validator) {

			if (Array.isArray(column.definition.validator)) {
				column.definition.validator.forEach(function (item) {
					validator = self._extractValidator(item);

					if (validator) {
						config.push(validator);
					}
				});
			} else {
				validator = this._extractValidator(column.definition.validator);

				if (validator) {
					config.push(validator);
				}
			}

			column.modules.validate = config.length ? config : false;
		}
	};

	Validate.prototype._extractValidator = function (value) {
		var type, params, pos;

		switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
			case "string":
				pos = value.indexOf(':');

				if (pos > -1) {
					type = value.substring(0, pos);
					params = value.substring(pos + 1);
				} else {
					type = value;
				}

				return this._buildValidator(type, params);

			case "function":
				return this._buildValidator(value);

			case "object":
				return this._buildValidator(value.type, value.parameters);
		}
	};

	Validate.prototype._buildValidator = function (type, params) {

		var func = typeof type == "function" ? type : this.validators[type];

		if (!func) {
			console.warn("Validator Setup Error - No matching validator found:", type);
			return false;
		} else {
			return {
				type: typeof type == "function" ? "function" : type,
				func: func,
				params: params
			};
		}
	};

	Validate.prototype.validate = function (validators, cell, value) {
		var self = this,
		    valid = [],
		    invalidIndex = this.invalidCells.indexOf(cell);

		if (validators) {
			validators.forEach(function (item) {
				if (!item.func.call(self, cell.getComponent(), value, item.params)) {
					valid.push({
						type: item.type,
						parameters: item.params
					});
				}
			});
		}

		valid = valid.length ? valid : true;

		if (!cell.modules.validate) {
			cell.modules.validate = {};
		}

		if (valid === true) {
			cell.modules.validate.invalid = false;
			cell.getElement().classList.remove("tabulator-validation-fail");

			if (invalidIndex > -1) {
				this.invalidCells.splice(invalidIndex, 1);
			}
		} else {
			cell.modules.validate.invalid = true;

			if (this.table.options.validationMode !== "manual") {
				cell.getElement().classList.add("tabulator-validation-fail");
			}

			if (invalidIndex == -1) {
				this.invalidCells.push(cell);
			}
		}

		return valid;
	};

	Validate.prototype.getInvalidCells = function () {
		var output = [];

		this.invalidCells.forEach(function (cell) {
			output.push(cell.getComponent());
		});

		return output;
	};

	Validate.prototype.clearValidation = function (cell) {
		var invalidIndex;

		if (cell.modules.validate && cell.modules.validate.invalid) {

			cell.element.classList.remove("tabulator-validation-fail");
			cell.modules.validate.invalid = false;

			invalidIndex = this.invalidCells.indexOf(cell);

			if (invalidIndex > -1) {
				this.invalidCells.splice(invalidIndex, 1);
			}
		}
	};

	Validate.prototype.validators = {

		//is integer
		integer: function integer(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			value = Number(value);
			return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
		},

		//is float
		float: function float(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			value = Number(value);
			return typeof value === 'number' && isFinite(value) && value % 1 !== 0;
		},

		//must be a number
		numeric: function numeric(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			return !isNaN(value);
		},

		//must be a string
		string: function string(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			return isNaN(value);
		},

		//maximum value
		max: function max(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			return parseFloat(value) <= parameters;
		},

		//minimum value
		min: function min(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			return parseFloat(value) >= parameters;
		},

		//starts with  value
		starts: function starts(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			return String(value).toLowerCase().startsWith(String(parameters).toLowerCase());
		},

		//ends with  value
		ends: function ends(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			return String(value).toLowerCase().endsWith(String(parameters).toLowerCase());
		},

		//minimum string length
		minLength: function minLength(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			return String(value).length >= parameters;
		},

		//maximum string length
		maxLength: function maxLength(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			return String(value).length <= parameters;
		},

		//in provided value list
		in: function _in(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			if (typeof parameters == "string") {
				parameters = parameters.split("|");
			}

			return value === "" || parameters.indexOf(value) > -1;
		},

		//must match provided regex
		regex: function regex(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			var reg = new RegExp(parameters);

			return reg.test(value);
		},

		//value must be unique in this column
		unique: function unique(cell, value, parameters) {
			if (value === "" || value === null || typeof value === "undefined") {
				return true;
			}
			var unique = true;

			var cellData = cell.getData();
			var column = cell.getColumn()._getSelf();

			this.table.rowManager.rows.forEach(function (row) {
				var data = row.getData();

				if (data !== cellData) {
					if (value == column.getFieldValue(data)) {
						unique = false;
					}
				}
			});

			return unique;
		},

		//must have a value
		required: function required(cell, value, parameters) {
			return value !== "" && value !== null && typeof value !== "undefined";
		}
	};

	Tabulator.prototype.registerModule("validate", Validate);

	return Tabulator;
});
});

var nextcloudFileURL = "https://cloud.tugraz.at/apps/files/?dir=";

// see https://github.com/ghosh/Micromodal/pull/351

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1(Constructor, staticProps);
  return Constructor;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var MicroModal = function () {

  var FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])', 'button:not([disabled]):not([aria-hidden])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];

  var Modal = /*#__PURE__*/function () {
    function Modal(_ref) {
      var targetModal = _ref.targetModal,
          _ref$triggers = _ref.triggers,
          triggers = _ref$triggers === void 0 ? [] : _ref$triggers,
          _ref$onShow = _ref.onShow,
          onShow = _ref$onShow === void 0 ? function () {} : _ref$onShow,
          _ref$onClose = _ref.onClose,
          onClose = _ref$onClose === void 0 ? function () {} : _ref$onClose,
          _ref$openTrigger = _ref.openTrigger,
          openTrigger = _ref$openTrigger === void 0 ? 'data-micromodal-trigger' : _ref$openTrigger,
          _ref$closeTrigger = _ref.closeTrigger,
          closeTrigger = _ref$closeTrigger === void 0 ? 'data-micromodal-close' : _ref$closeTrigger,
          _ref$openClass = _ref.openClass,
          openClass = _ref$openClass === void 0 ? 'is-open' : _ref$openClass,
          _ref$disableScroll = _ref.disableScroll,
          disableScroll = _ref$disableScroll === void 0 ? false : _ref$disableScroll,
          _ref$disableFocus = _ref.disableFocus,
          disableFocus = _ref$disableFocus === void 0 ? false : _ref$disableFocus,
          _ref$awaitCloseAnimat = _ref.awaitCloseAnimation,
          awaitCloseAnimation = _ref$awaitCloseAnimat === void 0 ? false : _ref$awaitCloseAnimat,
          _ref$awaitOpenAnimati = _ref.awaitOpenAnimation,
          awaitOpenAnimation = _ref$awaitOpenAnimati === void 0 ? false : _ref$awaitOpenAnimati,
          _ref$debugMode = _ref.debugMode,
          debugMode = _ref$debugMode === void 0 ? false : _ref$debugMode;

      _classCallCheck$1(this, Modal);

      // Save a reference of the modal
      this.modal = this.modal = typeof targetModal === "string" ? document.getElementById(targetModal) : targetModal; // Save a reference to the passed config

      this.config = {
        debugMode: debugMode,
        disableScroll: disableScroll,
        openTrigger: openTrigger,
        closeTrigger: closeTrigger,
        openClass: openClass,
        onShow: onShow,
        onClose: onClose,
        awaitCloseAnimation: awaitCloseAnimation,
        awaitOpenAnimation: awaitOpenAnimation,
        disableFocus: disableFocus
      }; // Register click events only if pre binding eventListeners

      if (triggers.length > 0) this.registerTriggers.apply(this, _toConsumableArray(triggers)); // pre bind functions for event listeners

      this.onClick = this.onClick.bind(this);
      this.onKeydown = this.onKeydown.bind(this);
    }
    /**
     * Loops through all openTriggers and binds click event
     * @param  {array} triggers [Array of node elements]
     * @return {void}
     */


    _createClass$1(Modal, [{
      key: "registerTriggers",
      value: function registerTriggers() {
        var _this = this;

        for (var _len = arguments.length, triggers = new Array(_len), _key = 0; _key < _len; _key++) {
          triggers[_key] = arguments[_key];
        }

        triggers.filter(Boolean).forEach(function (trigger) {
          trigger.addEventListener('click', function (event) {
            return _this.showModal(event);
          });
        });
      }
    }, {
      key: "showModal",
      value: function showModal() {
        var _this2 = this;

        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.activeElement = document.activeElement;
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.classList.add(this.config.openClass);
        this.scrollBehaviour('disable');
        this.addEventListeners();

        if (this.config.awaitOpenAnimation) {
          var handler = function handler() {
            _this2.modal.removeEventListener('animationend', handler, false);

            _this2.setFocusToFirstNode();
          };

          this.modal.addEventListener('animationend', handler, false);
        } else {
          this.setFocusToFirstNode();
        }

        this.config.onShow(this.modal, this.activeElement, event);
      }
    }, {
      key: "closeModal",
      value: function closeModal() {
        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var modal = this.modal;
        this.modal.setAttribute('aria-hidden', 'true');
        this.removeEventListeners();
        this.scrollBehaviour('enable');

        if (this.activeElement && this.activeElement.focus) {
          this.activeElement.focus();
        }

        this.config.onClose(this.modal, this.activeElement, event);

        if (this.config.awaitCloseAnimation) {
          var openClass = this.config.openClass; // <- old school ftw

          this.modal.addEventListener('animationend', function handler() {
            modal.classList.remove(openClass);
            modal.removeEventListener('animationend', handler, false);
          }, false);
        } else {
          modal.classList.remove(this.config.openClass);
        }
      }
    }, {
      key: "closeModalById",
      value: function closeModalById(targetModal) {
        this.modal = document.getElementById(targetModal);
        if (this.modal) this.closeModal();
      }
    }, {
      key: "scrollBehaviour",
      value: function scrollBehaviour(toggle) {
        if (!this.config.disableScroll) return;
        var body = document.querySelector('body');

        switch (toggle) {
          case 'enable':
            Object.assign(body.style, {
              overflow: ''
            });
            break;

          case 'disable':
            Object.assign(body.style, {
              overflow: 'hidden'
            });
            break;
        }
      }
    }, {
      key: "addEventListeners",
      value: function addEventListeners() {
        this.modal.addEventListener('touchstart', this.onClick);
        this.modal.addEventListener('click', this.onClick);
        document.addEventListener('keydown', this.onKeydown);
      }
    }, {
      key: "removeEventListeners",
      value: function removeEventListeners() {
        this.modal.removeEventListener('touchstart', this.onClick);
        this.modal.removeEventListener('click', this.onClick);
        document.removeEventListener('keydown', this.onKeydown);
      }
    }, {
      key: "onClick",
      value: function onClick(event) {
        if (event.target.hasAttribute(this.config.closeTrigger)) {
          this.closeModal(event);
        }
      }
    }, {
      key: "onKeydown",
      value: function onKeydown(event) {
        if (event.keyCode === 27) this.closeModal(event); // esc

        if (event.keyCode === 9) this.retainFocus(event); // tab
      }
    }, {
      key: "getFocusableNodes",
      value: function getFocusableNodes() {
        var nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS);
        return Array.apply(void 0, _toConsumableArray(nodes));
      }
      /**
       * Tries to set focus on a node which is not a close trigger
       * if no other nodes exist then focuses on first close trigger
       */

    }, {
      key: "setFocusToFirstNode",
      value: function setFocusToFirstNode() {
        var _this3 = this;

        if (this.config.disableFocus) return;
        var focusableNodes = this.getFocusableNodes(); // no focusable nodes

        if (focusableNodes.length === 0) return; // remove nodes on whose click, the modal closes
        // could not think of a better name :(

        var nodesWhichAreNotCloseTargets = focusableNodes.filter(function (node) {
          return !node.hasAttribute(_this3.config.closeTrigger);
        });
        if (nodesWhichAreNotCloseTargets.length > 0) nodesWhichAreNotCloseTargets[0].focus();
        if (nodesWhichAreNotCloseTargets.length === 0) focusableNodes[0].focus();
      }
    }, {
      key: "retainFocus",
      value: function retainFocus(event) {
        var focusableNodes = this.getFocusableNodes(); // no focusable nodes

        if (focusableNodes.length === 0) return;
        /**
         * Filters nodes which are hidden to prevent
         * focus leak outside modal
         */

        focusableNodes = focusableNodes.filter(function (node) {
          return node.offsetParent !== null;
        }); // if disableFocus is true

        if (!this.modal.contains(document.activeElement)) {
          focusableNodes[0].focus();
        } else {
          var focusedItemIndex = focusableNodes.indexOf(document.activeElement);

          if (event.shiftKey && focusedItemIndex === 0) {
            focusableNodes[focusableNodes.length - 1].focus();
            event.preventDefault();
          }

          if (!event.shiftKey && focusableNodes.length > 0 && focusedItemIndex === focusableNodes.length - 1) {
            focusableNodes[0].focus();
            event.preventDefault();
          }
        }
      }
    }]);

    return Modal;
  }();
  /**
   * Modal prototype ends.
   * Here on code is responsible for detecting and
   * auto binding event handlers on modal triggers
   */
  // Keep a reference to the opened modal


  var activeModal = null;
  /**
   * Generates an associative array of modals and it's
   * respective triggers
   * @param  {array} triggers     An array of all triggers
   * @param  {string} triggerAttr The data-attribute which triggers the module
   * @return {array}
   */

  var generateTriggerMap = function generateTriggerMap(triggers, triggerAttr) {
    var triggerMap = [];
    triggers.forEach(function (trigger) {
      var targetModal = trigger.attributes[triggerAttr].value;
      if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = [];
      triggerMap[targetModal].push(trigger);
    });
    return triggerMap;
  };
  /**
   * Validates whether a modal of the given id exists
   * in the DOM
   * @param  {number} id  The id of the modal
   * @return {boolean}
   */


  var validateModalPresence = function validateModalPresence(id) {
    if (!document.getElementById(id)) {
      console.warn("MicroModal: \u2757Seems like you have missed %c'".concat(id, "'"), 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'ID somewhere in your code. Refer example below to resolve it.');
      console.warn("%cExample:", 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', "<div class=\"modal\" id=\"".concat(id, "\"></div>"));
      return false;
    }
  };
  /**
   * Validates if there are modal triggers present
   * in the DOM
   * @param  {array} triggers An array of data-triggers
   * @return {boolean}
   */


  var validateTriggerPresence = function validateTriggerPresence(triggers) {
    if (triggers.length <= 0) {
      console.warn("MicroModal: \u2757Please specify at least one %c'micromodal-trigger'", 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'data attribute.');
      console.warn("%cExample:", 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', "<a href=\"#\" data-micromodal-trigger=\"my-modal\"></a>");
      return false;
    }
  };
  /**
   * Checks if triggers and their corresponding modals
   * are present in the DOM
   * @param  {array} triggers   Array of DOM nodes which have data-triggers
   * @param  {array} triggerMap Associative array of modals and their triggers
   * @return {boolean}
   */


  var validateArgs = function validateArgs(triggers, triggerMap) {
    validateTriggerPresence(triggers);
    if (!triggerMap) return true;

    for (var id in triggerMap) {
      validateModalPresence(id);
    }

    return true;
  };
  /**
   * Binds click handlers to all modal triggers
   * @param  {object} config [description]
   * @return void
   */


  var init = function init(config) {
    // Create an config object with default openTrigger
    var options = Object.assign({}, {
      openTrigger: 'data-micromodal-trigger'
    }, config); // Collects all the nodes with the trigger

    var triggers = _toConsumableArray(document.querySelectorAll("[".concat(options.openTrigger, "]"))); // Makes a mappings of modals with their trigger nodes


    var triggerMap = generateTriggerMap(triggers, options.openTrigger); // Checks if modals and triggers exist in dom

    if (options.debugMode === true && validateArgs(triggers, triggerMap) === false) return; // For every target modal creates a new instance

    for (var key in triggerMap) {
      var value = triggerMap[key];
      options.targetModal = key;
      options.triggers = _toConsumableArray(value);
      activeModal = new Modal(options); // eslint-disable-line no-new
    }
  };
  /**
   * Shows a particular modal
   * @param  {string} targetModal [The id of the modal to display]
   * @param  {object} config [The configuration object to pass]
   * @return {void}
   */


  var show = function show(targetModal, config) {
    var options = config || {};
    options.targetModal = targetModal; // Checks if modals and triggers exist in dom

    if (options.debugMode === true && validateModalPresence(targetModal) === false) return; // clear events in case previous modal wasn't close

    if (activeModal) activeModal.removeEventListeners(); // stores reference to active modal

    activeModal = new Modal(options); // eslint-disable-line no-new

    activeModal.showModal();
  };
  /**
   * Closes the active modal
   * @param  {string} targetModal [The id of the modal to close]
   * @return {void}
   */


  var close = function close(targetModal) {
    targetModal ? activeModal.closeModalById(targetModal) : activeModal.closeModal();
  };

  return {
    init: init,
    show: show,
    close: close
  };
}();
window.MicroModal = MicroModal;

/**
 * NextcloudFilePicker web component
 */
class NextcloudFilePicker extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.lang = 'de';
        this.authUrl = '';
        this.webDavUrl = '';
        this.nextcloudName = 'Nextcloud';
        this.loginWindow = null;
        this.isPickerActive = false;
        this.statusText = '';
        this.lastDirectoryPath = '/';
        this.directoryPath = '/';
        this.webDavClient = null;
        this.tabulatorTable = null;
        this.allowedMimeTypes = '*/*';
        this.directoriesOnly = null;
        this.maxSelectedItems = true;
        this.loading = false;
        this._onReceiveWindowMessage = this.onReceiveWindowMessage.bind(this);

        this.folderIsSelected = i18n.t('nextcloud-file-picker.load-in-folder');
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
        };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            lang: { type: String },
            authUrl: { type: String, attribute: 'auth-url' },
            webDavUrl: { type: String, attribute: 'web-dav-url' },
            nextcloudName: { type: String, attribute: 'nextcloud-name' },
            isPickerActive: { type: Boolean, attribute: false },
            statusText: { type: String, attribute: false },
            folderIsSelected: { type: String, attribute: false },
            directoryPath: { type: String, attribute: false },
            allowedMimeTypes: { type: String, attribute: 'allowed-mime-types' },
            directoriesOnly: { type: Boolean, attribute: 'directories-only' },
            maxSelectedItems: { type: Number, attribute: 'max-selected-items' },
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
            }
        });

        super.update(changedProperties);
    }

    disconnectedCallback() {
        window.removeEventListener('message', this._onReceiveWindowMessage);
        super.disconnectedCallback();
    }

    connectedCallback() {
        super.connectedCallback();
        const that = this;
        this.updateComplete.then(() => {
            // see: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
            window.addEventListener('message', this._onReceiveWindowMessage);

            // see: http://tabulator.info/docs/4.7
            this.tabulatorTable = new tabulator(this._("#directory-content-table"), {
                layout: "fitColumns",
                selectable: this.maxSelectedItems,
                selectableRangeMode: "drag",
                responsiveLayout: true,
                placeholder:i18n.t('nextcloud-file-picker.no-data'),
                resizableColumns:false,
                columns: [

                    {title: "", field: "type", align:"center", headerSort:false, width:50, responsive:1, formatter: (cell, formatterParams, onRendered) => {
                            const icon_tag =  that.constructor.getScopedTagName("dbp-icon");
                            let icon = `<${icon_tag} name="empty-file"></${icon_tag}>`;
                            return (cell.getValue() === "directory") ? `<${icon_tag} name="folder"></${icon_tag}>` : icon;
                        }},
                    {title: i18n.t('nextcloud-file-picker.filename'), responsive: 0, widthGrow:5,  minWidth: 150, field: "basename", sorter: "alphanum",
                        formatter: (cell) => {
                            var data = cell.getRow().getData();
                            if(data.edit)
                            {
                                cell.getElement().classList.add("fokus-edit");
                            }
                            return cell.getValue();
                        }},
                    {title: i18n.t('nextcloud-file-picker.size'), responsive: 4, widthGrow:1, minWidth: 50, field: "size", formatter: (cell, formatterParams, onRendered) => {
                            return cell.getRow().getData().type === "directory" ? "" : humanFileSize(cell.getValue());}},
                    {title: i18n.t('nextcloud-file-picker.mime-type'), responsive: 2, widthGrow:1, field: "mime", formatter: (cell, formatterParams, onRendered) => {
                            if (typeof cell.getValue() === 'undefined') {
                                return "";
                            }
                            const [fileMainType, fileSubType] = cell.getValue().split('/');
                            return fileSubType;
                        }},
                    {title: i18n.t('nextcloud-file-picker.last-modified'), responsive: 3, widthGrow:1, minWidth: 100, field: "lastmod",sorter: (a, b, aRow, bRow, column, dir, sorterParams) => {
                            const a_timestamp = Date.parse(a);
                            const b_timestamp = Date.parse(b);
                            return a_timestamp - b_timestamp;
                        }, formatter:function(cell, formatterParams, onRendered) {
                            const d = Date.parse(cell.getValue());
                            const timestamp = new Date(d);
                            const year = timestamp.getFullYear();
                            const month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
                            const date = ("0" + timestamp.getDate()).slice(-2);
                            const hours = ("0" + timestamp.getHours()).slice(-2);
                            const minutes = ("0" + timestamp.getMinutes()).slice(-2);
                            return date + "." + month + "." + year + " " + hours + ":" + minutes;
                        }}
                ],
                initialSort:[
                    {column:"basename", dir:"asc"},
                    {column:"type", dir:"asc"},

                ],
                rowSelectionChanged: (data, rows) => {
                    if( data.length > 0  && this.directoriesOnly) {
                        this.folderIsSelected = i18n.t('nextcloud-file-picker.load-to-folder');
                    }
                    else {
                        this.folderIsSelected = i18n.t('nextcloud-file-picker.load-in-folder');
                    }
                },
                rowClick: (e, row) => {
                    const data = row.getData();

                    if (this.directoriesOnly) ;
                    else
                    {
                        switch(data.type) {
                            case "directory":
                                this.directoryClicked(e, data);
                                break;
                        }
                    }
                },
                rowDblClick: (e, row) => {
                    if (this.directoriesOnly) {
                        const data = row.getData();
                        this.directoryClicked(e, data);
                        this.folderIsSelected = i18n.t('nextcloud-file-picker.load-in-folder');
                    }
                }
            });

            if (this.tabulatorTable.browserMobile === false)
            {
                this.tabulatorTable.options.selectableRangeMode = "click";
            }
            function checkFileType(data, filterParams) {
                // check if file is allowed
                if (typeof data.mime === 'undefined') {
                    return true;
                }
                const [fileMainType, fileSubType] = data.mime.split('/');
                const mimeTypes = filterParams.split(',');
                let deny = true;

                mimeTypes.forEach((str) => {
                    const [mainType, subType] = str.split('/');
                    deny = deny && ((mainType !== '*' && mainType !== fileMainType) || (subType !== '*' && subType !== fileSubType));
                });

                return !deny;
            }
            if (typeof this.allowedMimeTypes !== 'undefined') {
                this.tabulatorTable.setFilter(checkFileType, this.allowedMimeTypes);
            }
            if (typeof this.directoriesOnly !== 'undefined' && this.directoriesOnly)
            {
                console.log("filter " + this.directoriesOnly);
                this.tabulatorTable.setFilter([
                    {field:"type", type:"=", value:"directory"},
                ]);
            }
        });
    }

    openFilePicker() {
        if (this.webDavClient === null)
        {
            this.loading = true;
            this.statusText = i18n.t('nextcloud-file-picker.auth-progress');
            const authUrl = this.authUrl + "?target-origin=" + encodeURIComponent(window.location.href);
            this.loginWindow = window.open(authUrl, "Nextcloud Login",
                "width=400,height=400,menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");
        }
        else {

            this.loadDirectory(this.directoryPath, this.webDavClient);

        }
    }

    onReceiveWindowMessage(event) {
        const data = event.data;
        console.log("data", data);

        if (data.type === "webapppassword") {
            if(this.loginWindow !== null) {
                this.loginWindow.close();
            }

            const apiUrl = this.webDavUrl + "/" + data.loginName;
            console.log("url: ", this.webDavUrl);
            // see https://github.com/perry-mitchell/webdav-client/blob/master/API.md#module_WebDAV.createClient

            this.webDavClient = web.createClient(
                apiUrl,
                {
                    username: data.loginName,
                    password: data.token
                }
            );

            this.loadDirectory(this.directoryPath);
        }
    }

    /**
     * Loads the directory from WebDAV
     *
     * @param path
     */
    loadDirectory(path) {
        this.loading = true;
        this.statusText = i18n.t('nextcloud-file-picker.loadpath-nextcloud-file-picker', {name: this.nextcloudName});
        this.lastDirectoryPath = this.directoryPath;
        this.directoryPath = path;

        // see https://github.com/perry-mitchell/webdav-client#getdirectorycontents

        this.webDavClient
            .getDirectoryContents(path, {details: true})
            .then(contents => {
                console.log("contents", contents);
                this.loading = false;
                this.statusText = "";
                this.tabulatorTable.setData(contents.data);
                this.isPickerActive = true;
            }).catch(error => {
                console.error(error.message);

                // on Error: try to reload with home directory
                if (path != "/"){
                    this.loadDirectory("/");
                }
                else {
                    this.loading = false;
                    this.statusText = error.message;
                    this.isPickerActive = false;
                }

                // client is broken reload try to reset & reconnect
                this.webDavClient = null;
                let reloadButton = html`<button class="button"
                            title="${i18n.t('nextcloud-file-picker.refresh-nextcloud-file-picker')}"
                            @click="${async () => { this.openFilePicker(); } }"><dbp-icon name="reload"></button>`;
                this.loading = false;
                this.statusText = reloadButton;
        });
    }

    directoryClicked(event, file) {
        this.loadDirectory(file.filename);
        event.preventDefault();
    }

    downloadFiles(files) {
        files.forEach((fileData) => this.downloadFile(fileData));
        MicroModal.close();
    }

    downloadFile(fileData) {
        this.loading = true;
        this.statusText = "Loading " + fileData.filename + "...";

        // https://github.com/perry-mitchell/webdav-client#getfilecontents
        this.webDavClient
            .getFileContents(fileData.filename)
            .then(contents => {
                // create file to send via event
                const file = new File([contents], fileData.basename, { type: fileData.mime });
                console.log("binaryFile", file);

                // send event
                const data = {"file": file, "data": fileData};
                const event = new CustomEvent("dbp-nextcloud-file-picker-file-downloaded",
                    { "detail": data, bubbles: true, composed: true });
                this.dispatchEvent(event);
                this.loading = false;
                this.statusText = "";
            }).catch(error => {
                console.error(error.message);
                this.loading = false;
                this.statusText = error.message;
        });
    }

    sendDirectory(directory) {

        let path;

        if(!directory[0])
        {
            path = this.directoryPath;
        }
        else {
            path = directory[0].filename;
        }
        this.loading = true;
        this.statusText = "Uploading to " + path + " ...";

        const event = new CustomEvent("dbp-nextcloud-file-picker-file-uploaded",
            { "detail": path, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }


    async uploadFiles(files, directory) {
        console.log("before all file finished");
        let ret = false;
        let ret_outer = true;
        const start = async () => {
            for (let index = 0; index < files.length; index++) {
                ret = await this.uploadFile(files[index], directory);
                if(ret === false) {
                    ret_outer = false;
                    break;
                }
            }
        };

        await start();
        //let ret = await files.forEach((file) => this.uploadFile(file, directory));
        console.log("all files finished", ret_outer);
        return ret_outer;
    }

    async uploadFile(file, directory) {
        console.log("before one file finished");
        let path = directory + "/" + file.name;
        // https://github.com/perry-mitchell/webdav-client#putfilecontents
        let ret = false;
        try{
            let contents = await this.webDavClient
            .putFileContents(path, file,  { overwrite: false, onUploadProgress: progress => {
                    console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);
                }});
            this.loading = false;
            this.statusText = "";
            console.log("try finished");
            ret = true;
        } catch(error ) {
            console.error(error.message);
            this.loading = false;
            this.statusText = error.message;
        }
        console.log("after one file finished");
        return ret;
    }

    /**
     * Add new folder with webdav
     *
     *
     */
    addFolder() {
        if(this._('#new-folder').value !== "") {
            let folderPath = this.directoryPath + "/" +this._('#new-folder').value;
            this.webDavClient.createDirectory(folderPath).then( contents => { this.loadDirectory(this.directoryPath); }).catch(error => {
                this.loading = false;
                this.statusText = i18n.t('nextcloud-file-picker.webdav-error');
            });
        }
    }

    /**
     * Returns the parent directory path
     *
     * @returns {string} parent directory path
     */
    getParentDirectoryPath() {
        let path = this.directoryPath.replace(/\/$/, "");
        path = path.replace(path.split("/").pop(), "").replace(/\/$/, "");

        return (path === "") ? "/" : path;
    }

    /**
     * Returns the directory path as clickable breadcrumbs
     *
     * @returns {string} clickable breadcrumb path
     */
    getBreadcrumb() {
        let htmlpath = [];
        htmlpath[0] =  html`<a @click="${() => { this.loadDirectory("/"); }}" title="${i18n.t('nextcloud-file-picker.folder-home')}"><dbp-icon name="home"></dbp-icon> </a>`;
        const directories = this.directoryPath.split('/');
        if (directories[1] === "")
        {
            return htmlpath;
        }
        for(let i = 1; i < directories.length; i ++)
        {
            let path = "";
            for(let j = 1; j <= i; j++)
            {
                path += "/";
                path += directories[j];
            }

            htmlpath[i] = html` › <a @click="${() => { this.loadDirectory(path); }}" title="${i18n.t('nextcloud-file-picker.load-path-link', {path: directories[i]})}">${directories[i]}</a>`;
        }

        return htmlpath;
    }

    /**
     * Returns Link to Nextcloud with actual directory
     *
     * @returns {string} actual directory Nextcloud link
     */
    getNextCloudLink() {
        let link = nextcloudFileURL + this.directoryPath;
        return link;
    }

    getCloudLogo() {
        let cloudLogo = html `<dbp-icon name="cloud" class="nextcloud-logo-icon"></dbp-icon>`;
        if (this.nextcloudName === "TU Graz cloud")
        {
            cloudLogo = html`
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 97.6 81.74">
                  <g>
                    <path d="M89.8,22.7a28.51,28.51,0,0,0-16.9-9.1,27.84,27.84,0,0,0-14.8-12A24,24,0,0,0,48.9,0,28.36,28.36,0,0,0,20.6,27.4,22.42,22.42,0,0,0,13,70.11v-6.3A16.7,16.7,0,0,1,5.5,50a17,17,0,0,1,17-17h3.6V28.5A23,23,0,0,1,49,5.6a19.75,19.75,0,0,1,7.2,1.2h.1A22.48,22.48,0,0,1,68.9,17.5l.6,1.3,1.4.2a23.07,23.07,0,0,1,14.9,7.5,23.85,23.85,0,0,1-1.23,33.74v7A29.56,29.56,0,0,0,89.8,22.7Z"/>
                    <g>
                      <path d="M16.39,71.61H36.65V51.36H16.39Z" style="fill: #e4154b"/>
                      <path d="M38.67,71.61H58.93V51.36H38.67Z" style="fill: #e4154b"/>
                      <path d="M61,71.61H81.21V51.36H61Z" style="fill: #e4154b"/>
                      <path d="M26.52,81.74H46.78V61.49H26.52Z" style="fill: #e4154b"/>
                      <path d="M50.83,61.49H71.08V41.23H50.83Z" style="fill: #e4154b"/>
                    </g>
                  </g>
            </svg>
        `;
        }

        return cloudLogo;
    }

    static get styles() {
        // language=css
        return css`
            ${getGeneralCSS()}
            ${getButtonCSS()}
            ${getTextUtilities()}
            
            .block {
                margin-bottom: 10px;
            }
            
            .force-no-select{
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            .nextcloud-header{
                margin-bottom: 2rem;  
                display: inline-grid;
                width: 100%;
                grid-template-columns: auto auto;          
            }
            
            .nextcloud-header div button{
                justify-self: start;
            }
            
            .nextcloud-intro{
                text-align: center;
            }
            
            .nextcloud-logo{
                width: 80px;
                justify-self: end;  
                transition: all 0.5s ease;
                margin: auto;
            }
            
            .nextcloud-logo-icon{
                height: 100%;
            }
            
            .nextcloud-logo-sm{
                width: 40px;
                justify-self: inherit;  
                margin-right: 70px;
                display:none;
            }
            
            .m-inherit{
                margin: inherit;
            }
            
            .wrapper{
                width: 100%;
                height:100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            
            .wrapper-select{
                justify-content: inherit;
            }
            
            .select-button{
                justify-self: end;
            }
            
            .nextcloud-content{
                width: 100%;
                height: 100%;
                overflow-y: auto;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{
                padding-top: 4px;
                padding-bottom: 4px;
                font-weight: normal
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-arrow, 
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-arrow,
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow{
                padding-bottom: 6px;
            }
            
            .tabulator .tabulator-header, .tabulator .tabulator-header, .tabulator .tabulator-header .tabulator-col, .tabulator, .tabulator-row .tabulator-cell, .tabulator-row.tabulator-row-even,
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable:hover{
                background-color: unset;
                background: unset;
                color: unset;
                border: none;
            }
            
            .tabulator-row, .tabulator-row.tabulator-row-even{
                background-color: white;
            }
            
            .tabulator-row.tabulator-selected:hover, .tabulator-row.tabulator-selected{
                background-color: var(--dbp-dark);
                color: var(--dbp-light);
            }
            
            .tabulator-row.tabulator-selectable:hover{
                background-color: #eee;
                color: var(--dbp-dark);
            }
            
            .tabulator .tabulator-header .tabulator-col .tabulator-col-content{
                display: inline-flex;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow{
                top: 16px;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="asc"] .tabulator-col-content .tabulator-arrow{
                border-top: none;
                border-bottom: 4px solid #666;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-arrow{
                border-top: none;
                border-bottom: 4px solid #bbb;
            }
            
            .tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-arrow{
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
            }
            
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow,
            .tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="desc"] .tabulator-col-content .tabulator-arrow{
                border-top: 4px solid #666;
                border-bottom: none;
            }
            
            .tabulator-row, .tabulator-row.tabulator-row-even{
                padding-top: 10px;
                padding-bottom: 10px;
                border-top: 1px solid #eee;
            }
            
            .tabulator-header{
                padding-top: 10px;
                padding-bottom: 10px;
            }
            
            .nextcloud-nav{
                display: flex;
                justify-content: space-between;
            }
            
            .nextcloud-footer{
                background-color: white;
                width: 100%;
                padding-top: 10px;
            }
            
            .nextcloud-footer-grid{
                width: 100%;
                display: flex;
                align-items: center;
                flex-direction: row-reverse;
                justify-content: space-between;
            }
            
            .tabulator .tabulator-tableHolder{
                overflow: hidden;
            }
            
            .tabulator .tabulator-tableHolder .tabulator-placeholder span{
                font-size: inherit;
                font-weight: inherit;
                color: inherit;
            }
            
            .add-folder{
                padding-top: 10px;
            }
            
            @media only screen
            and (orientation: portrait)
            and (max-device-width: 765px) {
            
                
                .nextcloud-nav h2 > a{
                    font-size: 1.3rem;
                }
                
                .nextcloud-nav a{
                    font-size: 0.9rem;
                }
                
                .nextcloud-logo-sm{
                    display: none;
                }
                
                .tabulator .tabulator-tableHolder{
                    white-space: inherit;
                }
                .button-wrapper{
                    justify-self: start;
                }
                
                .wrapper{
                    display: grid;
                    /*grid-template-areas: "header-l header-r" "content content";
                    grid-template-rows: 50px auto;
                    grid-template-columns: 50% 50%;*/
                    grid-template-rows: auto 50px;
                    grid-template-columns: 100%;
                    grid-template-areas: "content" "footer";
                }
                
                .nextcloud-header{
                    grid-area: header-l;
                    margin-bottom: 0px;
                }
                
                .nextcloud-content, .nextcloud-intro{
                    grid-area: content;
                }
                
                .nextcloud-intro{
                    /*grid-column-start: header-l-start;
                    grid-column-end: header-r-end;
                    grid-row-start: header-l-start;
                    grid-row-end: content-end;*/
                    grid-area: content;
                    text-align: center;
                }
                
                .nextcloud-footer{
                    /*grid-area: header-r;*/
                    padding-top: 0px;
                    grid-area: footer;
                }
                
                .info-box{
                    display: none;
                }
                
                .nextcloud-footer-grid{
                    display: flex;
                    justify-content: end;
                    
                    justify-content: center;
                }
                
                .select-button{
                    margin: 0px;
                }
                
                #new-folder{
                    width: 86%;
                }
                
            }

        `;
    }

    render() {
        const tabulatorCss = getAssetURL('local/dbp-file-source/tabulator-tables/css/tabulator.min.css');
        console.log("tabulatorCss", tabulatorCss);

        return html`
            <div class="wrapper">
                <link rel="stylesheet" href="${tabulatorCss}">
                <div class="nextcloud-intro">
                    <div class="nextcloud-logo ${classMap({"nextcloud-logo-sm": this.isPickerActive})}">
                             ${this.getCloudLogo()}
                        </div>
                    <div class="block text-center ${classMap({hidden: this.isPickerActive})}">
                        <h2 class="m-inherit">
                            ${this.nextcloudName}
                        </h2>
                        <p class="m-inherit">
                            ${i18n.t('nextcloud-file-picker.init-text-1', {name: this.nextcloudName})}   <br>           
                            ${i18n.t('nextcloud-file-picker.init-text-2')}              
                        </p>
                    </div>
                    <div class="block ${classMap({hidden: this.isPickerActive})}">
                        <button class="button  is-primary"
                                title="${i18n.t('nextcloud-file-picker.open-nextcloud-file-picker', {name: this.nextcloudName})}"
                                @click="${async () => { this.openFilePicker(); } }">${i18n.t('nextcloud-file-picker.connect-nextcloud', {name: this.nextcloudName})}</button>
                    </div>
                    <div class="block text-center m-inherit ${classMap({hidden: this.isPickerActive})}">
                    <p class="m-inherit">
                         ${i18n.t('nextcloud-file-picker.auth-info')}
                    </p>
                </div>
               </div>
                <div class="nextcloud-content ${classMap({hidden: !this.isPickerActive})}">
                    <div class="nextcloud-nav">
                        <h2>${this.getBreadcrumb()}</h2>
                        <div class="add-folder ${classMap({hidden: !this.directoriesOnly})}">
                            <input type="text" placeholder="${i18n.t('nextcloud-file-picker.new-folder-placeholder')}" name="new-folder" class="input" id="new-folder">
                            <button class="button"
                                    title="${i18n.t('nextcloud-file-picker.add-folder')}"
                                    @click="${() => { this.addFolder(); }}">
                                <dbp-icon name="plus" class="nextcloud-add-folder"></dbp-icon>
                            </button>
                        </div>
                    </div>
                    <table id="directory-content-table" class="force-no-select"></table>
                </div>
                 
                <div class="nextcloud-footer ${classMap({hidden: !this.isPickerActive})}">
                    <div class="nextcloud-footer-grid">
                        <button class="button select-button is-primary ${classMap({hidden: !this.directoriesOnly})}"
                                @click="${() => { this.sendDirectory(this.tabulatorTable.getSelectedData()); }}">${this.folderIsSelected}</button>
                        <button class="button select-button is-primary ${classMap({hidden: this.directoriesOnly})}"
                                @click="${() => { this.downloadFiles(this.tabulatorTable.getSelectedData()); }}">${i18n.t('nextcloud-file-picker.select-files')}</button>
                               
                                
                        <div class="block info-box ${classMap({hidden: this.statusText === ""})}">
                            <dbp-mini-spinner style="font-size: 0.7em" class="${classMap({hidden: this.loading === false})}"></dbp-mini-spinner>
                            ${this.statusText}
                        </div>
                       
                    </div>
                </div>
            </div>
        `;
    }
}

function getFileHandlingCss() {
    // language=css
    return css`        
        /**************************\\
          Modal Styles
        \\**************************/

        .modal-container {
            grid-template-columns: 150px 1fr;
            grid-template-rows: auto 1fr;
            gap: 1px 1px;
            grid-template-areas: "sidebar header" "sidebar main";
            position: relative;
        }

        .modal-nav {
            cursor: pointer;
            overflow: hidden;
            background-color: white;
            border-right: 1px solid black;
            grid-area: sidebar;
        }

        .modal-nav > div {
            padding: 5px;
            text-align: center;
        }

        .modal-nav .nav-icon {
            width: 35px;
            height: 35px;
        }

        .modal-nav .active{
            background-color: var(--dbp-dark);;
            color: var(--dbp-light);;
        }

        .modal-content {
            padding: 10px 20px 20px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        .modal-content .source-main {
            /*flex-grow: 1;*/
            /*justify-content: center;*/
            /*align-items: center;*/
            height: 100%;
            width: 100%;
            display:flex;
            align-items: flex-end;
        }

        .modal-content .source-main.hidden {
            display: none;
        }

        .modal-header{
            grid-area: header;
            display: flex;
            padding: 10px 20px 0px 20px;
            flex-direction: row-reverse;
            justify-content: space-between;
            align-items: center;
        }


        /**************************\\
         Picker Styles
       \\**************************/

        #nextcloud-file-picker {
            width: 100%;
            height: 100%;
            margin: var(--FUMargin, 0px);
            padding: var(--FUPadding, 20px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        #fileElem {
            display: none;
        }

        #nextcloud-file-picker.hidden {
            display: none;
        }

        #modal-picker-content{
            grid-area: main;
        }


        /**************************\\
         Mobile Landscape Styles
       \\**************************/
        
        @media only screen
        and (orientation: landscape)
        and (max-device-width: 896px) {
            .modal-container {
                width: 100%;
                height: 100%;
                max-width: 100%;
            }
        }


        /**************************\\
         Tablett Portrait Styles
       \\**************************/
        
        @media only screen
        and (orientation: portrait)
        and (max-device-width: 800px) {

            .modal-nav{
                display: flex;
                justify-content: space-around;
                grid-area: nav;
                border: none;
                border-bottom: 1px solid black;
                border-top: 1px solid black;
            }

            .modal-content{
                grid-area: main;
            }

            .modal-container{
                grid-template-rows: 40px 55px auto;
                grid-template-areas: "header" "nav" "main";
                grid-template-columns: auto;
            }

            .modal-header{
                grid-area: header;
                padding: 5px;
            }

            .modal-nav > div{
                flex-grow: 1;
            }

            .modal-nav .nav-icon{
                height: 20px;
            }

            #nextcloud-file-picker{
                padding: 0px;
            }
        }

        /**************************\\
         Mobile Portrait Styles
        \\**************************/
        
        @media only screen
        and (orientation: portrait)
        and (max-device-width: 765px) {
            

            




        }
    
    `;
}

function mimeTypesToAccept(mimeTypes) {
    // Some operating systems can't handle mime types and
    // need file extensions, this tries to add them for some..
    let mapping = {
        'application/pdf': ['.pdf'],
        'application/zip': ['.zip'],
    };
    let accept = [];
    mimeTypes.split(',').forEach((mime) => {
        accept.push(mime);
        if (mime.trim() in mapping) {
            accept = accept.concat(mapping[mime.trim()]);
        }
    });
    return accept.join(',');
}


/**
 * FileSource web component
 */
class FileSource extends ScopedElementsMixin(DBPLitElement) {
    constructor() {
        super();
        this.context = '';
        this.lang = 'de';
        this.nextcloudAuthUrl = '';
        this.nextcloudName ='Nextcloud';
        this.nextcloudWebDavUrl = '';
        this.dropArea = null;
        this.allowedMimeTypes = '*/*';
        this.enabledSources = 'local';        this.text = '';
        this.buttonLabel = '';
        this.disabled = false;
        this.decompressZip = false;
        this._queueKey = 0;
        this.activeSource = 'local';
        this.isDialogOpen = false;
    }

    static get scopedElements() {
        return {
            'dbp-icon': Icon,
            'dbp-mini-spinner': MiniSpinner,
            'dbp-nextcloud-file-picker': NextcloudFilePicker,
        };
    }

    /**
     * See: https://lit-element.polymer-project.org/guide/properties#initialize
     */
    static get properties() {
        return {
            context: { type: String, attribute: 'context'},
            lang: { type: String },
            allowedMimeTypes: { type: String, attribute: 'allowed-mime-types' },
            enabledSources: { type: String, attribute: 'enabled-sources' },
            nextcloudAuthUrl: { type: String, attribute: 'nextcloud-auth-url' },
            nextcloudWebDavUrl: { type: String, attribute: 'nextcloud-web-dav-url' },
            nextcloudName: { type: String, attribute: 'nextcloud-name' },
            text: { type: String },
            buttonLabel: { type: String, attribute: 'button-label' },
            disabled: { type: Boolean },
            decompressZip: { type: Boolean, attribute: 'decompress-zip' },
            activeSource: { type: Boolean, attribute: false },
            isDialogOpen: { type: Boolean, attribute: 'dialog-open' },
        };
    }

    update(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case "lang":
                    i18n.changeLanguage(this.lang);
                    break;
                case "enabledSources":
                    if (!this.hasEnabledSource(this.activeSource)) {
                        this.activeSource = this.enabledSources.split(",")[0];
                    }
                    break;
                case "isDialogOpen":
                    if (this.isDialogOpen) {
                        // this.setAttribute("dialog-open", "");
                        this.openDialog();
                    } else {
                        this.removeAttribute("dialog-open");
                        // this.closeDialog();
                    }

                    break;
            }
        });

        super.update(changedProperties);
    }

    connectedCallback() {
        super.connectedCallback();

        this.updateComplete.then(() => {
            this.dropArea = this._('#dropArea');
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.preventDefaults, false);
            });
            ['dragenter', 'dragover'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.highlight.bind(this), false);
            });
            ['dragleave', 'drop'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, this.unhighlight.bind(this), false);
            });
            this.dropArea.addEventListener('drop', this.handleDrop.bind(this), false);
            this._('#fileElem').addEventListener('change', this.handleChange.bind(this));
        });
    }

    preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(e) {
        this.dropArea.classList.add('highlight');
    }

    unhighlight(e) {
        this.dropArea.classList.remove('highlight');
    }

    handleDrop(e) {
        if (this.disabled) {
            return;
        }

        let dt = e.dataTransfer;
        console.dir(dt);
        let files = dt.files;

        this.handleFiles(files);
    }

    async handleChange(e) {
        let fileElem = this._('#fileElem');

        if (fileElem.files.length === 0) {
            return;
        }

        await this.handleFiles(fileElem.files);

        // reset the element's value so the user can upload the same file(s) again
        fileElem.value = '';
    }

    /**
     * Handles files that were dropped to or selected in the component
     *
     * @param files
     * @returns {Promise<void>}
     */
    async handleFiles(files) {
        console.log('handleFiles: files.length = ' + files.length);
        // this.dispatchEvent(new CustomEvent("dbp-file-source-selection-start",
        //     { "detail": {}, bubbles: true, composed: true }));

        await asyncArrayForEach(files, async (file) => {
            if (file.size === 0) {
                console.log('file \'' + file.name + '\' has size=0 and is denied!');
                return;
            }

            // check if we want to decompress the zip and queue the contained files
            if (this.decompressZip && file.type === "application/zip") {
                // add decompressed files to tempFilesToHandle
                await asyncArrayForEach(
                    await this.decompressZIP(file), (file) => this.sendFileEvent(file));

                return;
            } else if (this.allowedMimeTypes && !this.checkFileType(file)) {
                return;
            }

            await this.sendFileEvent(file);
        });

        // this.dispatchEvent(new CustomEvent("dbp-file-source-selection-finished",
        //     { "detail": {}, bubbles: true, composed: true }));

        this.closeDialog();
    }

    /**
     * @param file
     */
    sendFileEvent(file) {
        const data = {"file": file};
        const event = new CustomEvent("dbp-file-source-file-selected", { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    checkFileType(file) {
        // check if file is allowed
        const [fileMainType, fileSubType] = file.type.split('/');
        const mimeTypes = this.allowedMimeTypes.split(',');
        let deny = true;

        mimeTypes.forEach((str) => {
            const [mainType, subType] = str.split('/');
            deny = deny && ((mainType !== '*' && mainType !== fileMainType) || (subType !== '*' && subType !== fileSubType));
        });

        if (deny) {
            console.log(`mime type ${file.type} of file '${file.name}' is not compatible with ${this.allowedMimeTypes}`);

            return false;
        }

        return true;
    }

    hasEnabledSource(source) {
        return this.enabledSources.split(',').includes(source);
    }

    /**
     * Decompress files synchronously
     *
     * @param file
     * @returns {Promise<[]>}
     */
    async decompressZIP(file) {
        // see: https://stuk.github.io/jszip/
        let JSZip = (await import('./jszip.0a4ba6fc.es.js').then(function (n) { return n.j; })).default;
        let filesToHandle = [];

        // load zip file
        await JSZip.loadAsync(file)
            .then(async (zip) => {
                // we are not using zip.forEach because we need to handle those files synchronously which
                // isn't supported by JSZip (see https://github.com/Stuk/jszip/issues/281)
                // using zip.files directly works great!
                await asyncObjectForEach(zip.files, async (zipEntry) => {
                    // skip directory entries
                    if (zipEntry.dir) {
                        return;
                    }

                    await zipEntry.async("blob")
                        .then(async (blob) => {
                            // get mime type of Blob, see https://github.com/Stuk/jszip/issues/626
                            const mimeType = await getMimeTypeOfFile(blob);

                            // create new file with name and mime type
                            const zipEntryFile = new File([blob], zipEntry.name, { type: mimeType });

                            // check mime type
                            if (!this.checkFileType(zipEntryFile)) {
                                return;
                            }

                            filesToHandle.push(zipEntryFile);
                        }, (e) => {
                            // handle the error
                            console.error("Decompressing of file in " + file.name + " failed: " + e.message);
                        });
                    });
            }, function (e) {
                // handle the error
                console.error("Loading of " + file.name + " failed: " + e.message);
            });

        return filesToHandle;
    }

    async sendFinishedEvent(response, file, sendFile = false) {
        if (response === undefined) {
            return;
        }

        let data =  {
            fileName: file.name,
            status: response.status,
            json: {"hydra:description": ""}
        };

        try {
            await response.json().then((json) => {
                data.json = json;
            });
        } catch (e) {}

        if (sendFile) {
            data.file = file;
        }

        const event = new CustomEvent("dbp-file-source-file-finished", { "detail": data, bubbles: true, composed: true });
        this.dispatchEvent(event);
    }

    openDialog() {
        console.log("openDialog");

        MicroModal.show(this._('#modal-picker'), {
            onClose: modal => { this.isDialogOpen = false; }
        });
    }

    closeDialog() {
        console.log("closeDialog");
        MicroModal.close();
    }

    static get styles() {
        // language=css
        return css`
            ${getThemeCSS()}
            ${getGeneralCSS()}
            ${getButtonCSS()}
            ${getModalDialogCSS()}
            ${getFileHandlingCss()}

           

            p {
                margin-top: 0;
            }
            
            .block {
                margin-bottom: 10px;
            }
            
            #dropArea {
                border: var(--FUBorderWidth, 2px) var(--FUBorderStyle, dashed) var(--FUBBorderColor, black);
                border-radius: var(--FUBorderRadius, 0);
                width: auto;
                margin: var(--FUMargin, 0px);
                padding: var(--FUPadding, 20px);
                /*flex-grow: 1;*/
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
    
            #dropArea.highlight {
                border-color: var(--FUBorderColorHighlight, purple);
            }
            
            
             @media only screen
            and (orientation: portrait)
            and (max-device-width: 800px) {
                #dropArea{
                    height: 100%;
                }
            
            }
            
        `;
    }

    render() {
        let allowedMimeTypes = this.allowedMimeTypes;

        if (this.decompressZip) {
            allowedMimeTypes += ",application/zip";
        }

        return html`
<!--
            <button class="button"
                ?disabled="${this.disabled}"
                @click="${() => { this.openDialog(); }}">${i18n.t('file-source.open-menu')}</button>
-->
            <div class="modal micromodal-slide" id="modal-picker" aria-hidden="true">
                <div class="modal-overlay" tabindex="-1" data-micromodal-close>
                    <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-picker-title">
                        <nav class="modal-nav">
                            <div title="${i18n.t('file-source.nav-local')}"
                                 @click="${() => { this.activeSource = "local"; }}"
                                 class="${classMap({"active": this.activeSource === "local", hidden: !this.hasEnabledSource("local")})}">
                                <dbp-icon class="nav-icon" name="laptop"></dbp-icon>
                                <p>${i18n.t('file-source.nav-local')}</p>
                            </div>
                            <div title="Nextcloud"
                                 @click="${() => { this.activeSource = "nextcloud"; }}"
                                 class="${classMap({"active": this.activeSource === "nextcloud", hidden: !this.hasEnabledSource("nextcloud")})}">
                                <dbp-icon class="nav-icon" name="cloud"></dbp-icon>
                                <p> ${this.nextcloudName} </p>
                            </div>
                            
                        </nav>
                        <div class="modal-header">
                            <button title="${i18n.t('file-source.modal-close')}" class="modal-close"  aria-label="Close modal"  @click="${() => {this.closeDialog();}}">
                                    <dbp-icon name="close" class="close-icon"></dbp-icon>
                            </button>
                       
                            <p class="modal-context"> ${this.context}</p>
                        </div>
                        <main class="modal-content" id="modal-picker-content">
                            
                            <div class="source-main ${classMap({"hidden": this.activeSource !== "local"})}">
                                <div id="dropArea">
                                    <div class="block">
                                        <p>${this.text || i18n.t('intro')}</p>
                                    </div>
                                    <input ?disabled="${this.disabled}"
                                           type="file"
                                           id="fileElem"
                                           multiple
                                           accept="${mimeTypesToAccept(allowedMimeTypes)}"
                                           name='file'>
                                    <label class="button is-primary" for="fileElem" ?disabled="${this.disabled}">
                                        ${this.buttonLabel || i18n.t('upload-label')}
                                    </label>
                                </div>
                            </div>
                            <div class="source-main ${classMap({"hidden": this.activeSource !== "nextcloud"})}">
                                <dbp-nextcloud-file-picker id="nextcloud-file-picker"
                                       class="${classMap({hidden: this.nextcloudWebDavUrl === "" || this.nextcloudAuthUrl === ""})}"
                                       ?disabled="${this.disabled}"
                                       lang="${this.lang}"
                                       auth-url="${this.nextcloudAuthUrl}"
                                       web-dav-url="${this.nextcloudWebDavUrl}"
                                       nextcloud-name="${this.nextcloudName}"
                                       allowed-mime-types="${this.allowedMimeTypes}"
                                       @dbp-nextcloud-file-picker-file-downloaded="${(event) => {
                                    this.sendFileEvent(event.detail.file);
                                }}"></dbp-nextcloud-file-picker>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
          `;
    }
}

export { FileSource as F, LitElement as L, ScopedElementsMixin as S, commonjsGlobal as a, commonjsRequire as b, createCommonjsModule as c, defineCustomElement as d, html as h, i18n as i, unsafeHTML as u };
//# sourceMappingURL=file-source.07793cec.es.js.map
