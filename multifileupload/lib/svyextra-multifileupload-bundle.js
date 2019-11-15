(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.Uppy = {}
Uppy.Core = require('@uppy/core')
Uppy.XHRUpload = require('@uppy/xhr-upload')
Uppy.Dashboard = require('@uppy/dashboard')
Uppy.Webcam = require('@uppy/webcam')
Uppy.DragDrop = require('@uppy/drag-drop')
Uppy.Informer = require('@uppy/informer')
Uppy.StatusBar = require('@uppy/status-bar')
Uppy.locales = {}
Uppy.locales.zh_CN = require('@uppy/locales/lib/zh_CN')
Uppy.locales.nl_NL = require('@uppy/locales/lib/nl_NL')
Uppy.locales.de_DE = require('@uppy/locales/lib/de_DE')
Uppy.locales.fr_FR = require('@uppy/locales/lib/fr_FR')
Uppy.locales.it_IT = require('@uppy/locales/lib/it_IT')
Uppy.locales.es_ES = require('@uppy/locales/lib/es_ES')
Uppy.locales.cs_CZ = require('@uppy/locales/lib/cs_CZ')
Uppy.locales.da_DK = require('@uppy/locales/lib/da_DK')
Uppy.locales.fi_FI = require('@uppy/locales/lib/fi_FI')
Uppy.locales.el_GR = require('@uppy/locales/lib/el_GR')
Uppy.locales.hu_HU = require('@uppy/locales/lib/hu_HU')
Uppy.locales.ja_JP = require('@uppy/locales/lib/ja_JP')
Uppy.locales.fa_IR = require('@uppy/locales/lib/fa_IR')
Uppy.locales.ru_RU = require('@uppy/locales/lib/ru_RU')
Uppy.locales.sv_SE = require('@uppy/locales/lib/sv_SE')
Uppy.locales.tr_TR = require('@uppy/locales/lib/tr_TR')
},{"@uppy/core":9,"@uppy/dashboard":27,"@uppy/drag-drop":36,"@uppy/informer":37,"@uppy/locales/lib/cs_CZ":38,"@uppy/locales/lib/da_DK":39,"@uppy/locales/lib/de_DE":40,"@uppy/locales/lib/el_GR":41,"@uppy/locales/lib/es_ES":42,"@uppy/locales/lib/fa_IR":43,"@uppy/locales/lib/fi_FI":44,"@uppy/locales/lib/fr_FR":45,"@uppy/locales/lib/hu_HU":46,"@uppy/locales/lib/it_IT":47,"@uppy/locales/lib/ja_JP":48,"@uppy/locales/lib/nl_NL":49,"@uppy/locales/lib/ru_RU":50,"@uppy/locales/lib/sv_SE":51,"@uppy/locales/lib/tr_TR":52,"@uppy/locales/lib/zh_CN":53,"@uppy/status-bar":56,"@uppy/webcam":100,"@uppy/xhr-upload":102}],2:[function(require,module,exports){
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AuthError =
/*#__PURE__*/
function (_Error) {
  _inheritsLoose(AuthError, _Error);

  function AuthError() {
    var _this;

    _this = _Error.call(this, 'Authorization required') || this;
    _this.name = 'AuthError';
    _this.isAuthError = true;
    return _this;
  }

  return AuthError;
}(_wrapNativeSuper(Error));

module.exports = AuthError;
},{}],3:[function(require,module,exports){
'use strict';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RequestClient = require('./RequestClient');

var tokenStorage = require('./tokenStorage');

var _getName = function _getName(id) {
  return id.split('-').map(function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }).join(' ');
};

module.exports =
/*#__PURE__*/
function (_RequestClient) {
  _inheritsLoose(Provider, _RequestClient);

  function Provider(uppy, opts) {
    var _this;

    _this = _RequestClient.call(this, uppy, opts) || this;
    _this.provider = opts.provider;
    _this.id = _this.provider;
    _this.authProvider = opts.authProvider || _this.provider;
    _this.name = _this.opts.name || _getName(_this.id);
    _this.pluginId = _this.opts.pluginId;
    _this.tokenKey = "companion-" + _this.pluginId + "-auth-token";
    return _this;
  }

  var _proto = Provider.prototype;

  _proto.headers = function headers() {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      _RequestClient.prototype.headers.call(_this2).then(function (headers) {
        _this2.getAuthToken().then(function (token) {
          resolve(_extends({}, headers, {
            'uppy-auth-token': token
          }));
        });
      }).catch(reject);
    });
  };

  _proto.onReceiveResponse = function onReceiveResponse(response) {
    response = _RequestClient.prototype.onReceiveResponse.call(this, response);
    var plugin = this.uppy.getPlugin(this.pluginId);
    var oldAuthenticated = plugin.getPluginState().authenticated;
    var authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated: authenticated
    });
    return response;
  } // @todo(i.olarewaju) consider whether or not this method should be exposed
  ;

  _proto.setAuthToken = function setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  };

  _proto.getAuthToken = function getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  };

  _proto.authUrl = function authUrl() {
    return this.hostname + "/" + this.id + "/connect";
  };

  _proto.fileUrl = function fileUrl(id) {
    return this.hostname + "/" + this.id + "/get/" + id;
  };

  _proto.list = function list(directory) {
    return this.get(this.id + "/list/" + (directory || ''));
  };

  _proto.logout = function logout() {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      _this3.get(_this3.id + "/logout").then(function (res) {
        _this3.uppy.getPlugin(_this3.pluginId).storage.removeItem(_this3.tokenKey).then(function () {
          return resolve(res);
        }).catch(reject);
      }).catch(reject);
    });
  };

  Provider.initPlugin = function initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = _extends({}, defaultOpts, opts);
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      var pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(plugin.id + ": the option \"companionAllowedHosts\" must be one of string, Array, RegExp");
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else {
      // does not start with https://
      if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
        plugin.opts.companionAllowedHosts = "https://" + opts.companionUrl.replace(/^\/\//, '');
      } else {
        plugin.opts.companionAllowedHosts = opts.companionUrl;
      }
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  };

  return Provider;
}(RequestClient);
},{"./RequestClient":4,"./tokenStorage":7}],4:[function(require,module,exports){
'use strict';

var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthError = require('./AuthError'); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

module.exports = (_temp = _class =
/*#__PURE__*/
function () {
  function RequestClient(uppy, opts) {
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  var _proto = RequestClient.prototype;

  _proto.headers = function headers() {
    var userHeaders = this.opts.companionHeaders || this.opts.serverHeaders || {};
    return Promise.resolve(_extends({}, this.defaultHeaders, {}, userHeaders));
  };

  _proto._getPostResponseFunc = function _getPostResponseFunc(skip) {
    var _this = this;

    return function (response) {
      if (!skip) {
        return _this.onReceiveResponse(response);
      }

      return response;
    };
  };

  _proto.onReceiveResponse = function onReceiveResponse(response) {
    var state = this.uppy.getState();
    var companion = state.companion || {};
    var host = this.opts.companionUrl;
    var headers = response.headers; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      var _extends2;

      this.uppy.setState({
        companion: _extends({}, companion, (_extends2 = {}, _extends2[host] = headers.get('i-am'), _extends2))
      });
    }

    return response;
  };

  _proto._getUrl = function _getUrl(url) {
    if (/^(https?:|)\/\//.test(url)) {
      return url;
    }

    return this.hostname + "/" + url;
  };

  _proto._json = function _json(res) {
    if (res.status === 401) {
      throw new AuthError();
    }

    if (res.status < 200 || res.status > 300) {
      var errMsg = "Failed request with status: " + res.status + ". " + res.statusText;
      return res.json().then(function (errData) {
        errMsg = errData.message ? errMsg + " message: " + errData.message : errMsg;
        errMsg = errData.requestId ? errMsg + " request-Id: " + errData.requestId : errMsg;
        throw new Error(errMsg);
      }).catch(function () {
        throw new Error(errMsg);
      });
    }

    return res.json();
  };

  _proto.preflight = function preflight(path) {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      if (_this2.preflightDone) {
        return resolve(_this2.allowedHeaders.slice());
      }

      fetch(_this2._getUrl(path), {
        method: 'OPTIONS'
      }).then(function (response) {
        if (response.headers.has('access-control-allow-headers')) {
          _this2.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(function (headerName) {
            return headerName.trim().toLowerCase();
          });
        }

        _this2.preflightDone = true;
        resolve(_this2.allowedHeaders.slice());
      }).catch(function (err) {
        _this2.uppy.log("[CompanionClient] unable to make preflight request " + err, 'warning');

        _this2.preflightDone = true;
        resolve(_this2.allowedHeaders.slice());
      });
    });
  };

  _proto.preflightAndHeaders = function preflightAndHeaders(path) {
    var _this3 = this;

    return Promise.all([this.preflight(path), this.headers()]).then(function (_ref) {
      var allowedHeaders = _ref[0],
          headers = _ref[1];
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(function (header) {
        if (allowedHeaders.indexOf(header.toLowerCase()) === -1) {
          _this3.uppy.log("[CompanionClient] excluding unallowed header " + header);

          delete headers[header];
        }
      });
      return headers;
    });
  };

  _proto.get = function get(path, skipPostResponse) {
    var _this4 = this;

    return new Promise(function (resolve, reject) {
      _this4.preflightAndHeaders(path).then(function (headers) {
        fetch(_this4._getUrl(path), {
          method: 'get',
          headers: headers,
          credentials: 'same-origin'
        }).then(_this4._getPostResponseFunc(skipPostResponse)).then(function (res) {
          return _this4._json(res).then(resolve);
        }).catch(function (err) {
          err = err.isAuthError ? err : new Error("Could not get " + _this4._getUrl(path) + ". " + err);
          reject(err);
        });
      }).catch(reject);
    });
  };

  _proto.post = function post(path, data, skipPostResponse) {
    var _this5 = this;

    return new Promise(function (resolve, reject) {
      _this5.preflightAndHeaders(path).then(function (headers) {
        fetch(_this5._getUrl(path), {
          method: 'post',
          headers: headers,
          credentials: 'same-origin',
          body: JSON.stringify(data)
        }).then(_this5._getPostResponseFunc(skipPostResponse)).then(function (res) {
          return _this5._json(res).then(resolve);
        }).catch(function (err) {
          err = err.isAuthError ? err : new Error("Could not post " + _this5._getUrl(path) + ". " + err);
          reject(err);
        });
      }).catch(reject);
    });
  };

  _proto.delete = function _delete(path, data, skipPostResponse) {
    var _this6 = this;

    return new Promise(function (resolve, reject) {
      _this6.preflightAndHeaders(path).then(function (headers) {
        fetch(_this6.hostname + "/" + path, {
          method: 'delete',
          headers: headers,
          credentials: 'same-origin',
          body: data ? JSON.stringify(data) : null
        }).then(_this6._getPostResponseFunc(skipPostResponse)).then(function (res) {
          return _this6._json(res).then(resolve);
        }).catch(function (err) {
          err = err.isAuthError ? err : new Error("Could not delete " + _this6._getUrl(path) + ". " + err);
          reject(err);
        });
      }).catch(reject);
    });
  };

  _createClass(RequestClient, [{
    key: "hostname",
    get: function get() {
      var _this$uppy$getState = this.uppy.getState(),
          companion = _this$uppy$getState.companion;

      var host = this.opts.companionUrl;
      return stripSlash(companion && companion[host] ? companion[host] : host);
    }
  }, {
    key: "defaultHeaders",
    get: function get() {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Uppy-Versions': "@uppy/companion-client=" + RequestClient.VERSION
      };
    }
  }]);

  return RequestClient;
}(), _class.VERSION = "1.4.1", _temp);
},{"./AuthError":2}],5:[function(require,module,exports){
var ee = require('namespace-emitter');

module.exports =
/*#__PURE__*/
function () {
  function UppySocket(opts) {
    this.opts = opts;
    this._queued = [];
    this.isOpen = false;
    this.emitter = ee();
    this._handleMessage = this._handleMessage.bind(this);
    this.close = this.close.bind(this);
    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
    this.once = this.once.bind(this);
    this.send = this.send.bind(this);

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  var _proto = UppySocket.prototype;

  _proto.open = function open() {
    var _this = this;

    this.socket = new WebSocket(this.opts.target);

    this.socket.onopen = function (e) {
      _this.isOpen = true;

      while (_this._queued.length > 0 && _this.isOpen) {
        var first = _this._queued[0];

        _this.send(first.action, first.payload);

        _this._queued = _this._queued.slice(1);
      }
    };

    this.socket.onclose = function (e) {
      _this.isOpen = false;
    };

    this.socket.onmessage = this._handleMessage;
  };

  _proto.close = function close() {
    if (this.socket) {
      this.socket.close();
    }
  };

  _proto.send = function send(action, payload) {
    // attach uuid
    if (!this.isOpen) {
      this._queued.push({
        action: action,
        payload: payload
      });

      return;
    }

    this.socket.send(JSON.stringify({
      action: action,
      payload: payload
    }));
  };

  _proto.on = function on(action, handler) {
    this.emitter.on(action, handler);
  };

  _proto.emit = function emit(action, payload) {
    this.emitter.emit(action, payload);
  };

  _proto.once = function once(action, handler) {
    this.emitter.once(action, handler);
  };

  _proto._handleMessage = function _handleMessage(e) {
    try {
      var message = JSON.parse(e.data);
      this.emit(message.action, message.payload);
    } catch (err) {
      console.log(err);
    }
  };

  return UppySocket;
}();
},{"namespace-emitter":114}],6:[function(require,module,exports){
'use strict';
/**
 * Manages communications with Companion
 */

var RequestClient = require('./RequestClient');

var Provider = require('./Provider');

var Socket = require('./Socket');

module.exports = {
  RequestClient: RequestClient,
  Provider: Provider,
  Socket: Socket
};
},{"./Provider":3,"./RequestClient":4,"./Socket":5}],7:[function(require,module,exports){
'use strict';
/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = function (key, value) {
  return new Promise(function (resolve) {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = function (key) {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = function (key) {
  return new Promise(function (resolve) {
    localStorage.removeItem(key);
    resolve();
  });
};
},{}],8:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var preact = require('preact');

var findDOMElement = require('@uppy/utils/lib/findDOMElement');
/**
 * Defer a frequent call to the microtask queue.
 */


function debounce(fn) {
  var calling = null;
  var latestArgs = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(function () {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn.apply(void 0, latestArgs);
      });
    }

    return calling;
  };
}
/**
 * Boilerplate that all Plugins share - and should not be used
 * directly. It also shows which methods final plugins should implement/override,
 * this deciding on structure.
 *
 * @param {object} main Uppy core object
 * @param {object} object with plugin options
 * @returns {Array|string} files or success/fail message
 */


module.exports =
/*#__PURE__*/
function () {
  function Plugin(uppy, opts) {
    this.uppy = uppy;
    this.opts = opts || {};
    this.update = this.update.bind(this);
    this.mount = this.mount.bind(this);
    this.install = this.install.bind(this);
    this.uninstall = this.uninstall.bind(this);
  }

  var _proto = Plugin.prototype;

  _proto.getPluginState = function getPluginState() {
    var _this$uppy$getState = this.uppy.getState(),
        plugins = _this$uppy$getState.plugins;

    return plugins[this.id] || {};
  };

  _proto.setPluginState = function setPluginState(update) {
    var _extends2;

    var _this$uppy$getState2 = this.uppy.getState(),
        plugins = _this$uppy$getState2.plugins;

    this.uppy.setState({
      plugins: _extends({}, plugins, (_extends2 = {}, _extends2[this.id] = _extends({}, plugins[this.id], {}, update), _extends2))
    });
  };

  _proto.setOptions = function setOptions(newOpts) {
    this.opts = _extends({}, this.opts, {}, newOpts);
    this.setPluginState(); // so that UI re-renders with new options
  };

  _proto.update = function update(state) {
    if (typeof this.el === 'undefined') {
      return;
    }

    if (this._updateUI) {
      this._updateUI(state);
    }
  } // Called after every state update, after everything's mounted. Debounced.
  ;

  _proto.afterUpdate = function afterUpdate() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */
  ;

  _proto.onMount = function onMount() {}
  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   *
   * @param {string|object} target
   *
   */
  ;

  _proto.mount = function mount(target, plugin) {
    var _this = this;

    var callerPluginName = plugin.id;
    var targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // API for plugins that require a synchronous rerender.

      this.rerender = function (state) {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!_this.uppy.getPlugin(_this.id)) return;
        _this.el = preact.render(_this.render(state), targetElement, _this.el);

        _this.afterUpdate();
      };

      this._updateUI = debounce(this.rerender);
      this.uppy.log("Installing " + callerPluginName + " to a DOM element '" + target + "'"); // clear everything inside the target container

      if (this.opts.replaceTargetContent) {
        targetElement.innerHTML = '';
      }

      this.el = preact.render(this.render(this.uppy.getState()), targetElement);
      this.onMount();
      return this.el;
    }

    var targetPlugin;

    if (typeof target === 'object' && target instanceof Plugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      var Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(function (plugin) {
        if (plugin instanceof Target) {
          targetPlugin = plugin;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log("Installing " + callerPluginName + " to " + targetPlugin.id);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log("Not installing " + callerPluginName);
    throw new Error("Invalid target option given to " + callerPluginName + ". Please make sure that the element\n      exists on the page, or that the plugin you are targeting has been installed. Check that the <script> tag initializing Uppy\n      comes at the bottom of the page, before the closing </body> tag (see https://github.com/transloadit/uppy/issues/1042).");
  };

  _proto.render = function render(state) {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  };

  _proto.addTarget = function addTarget(plugin) {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  };

  _proto.unmount = function unmount() {
    if (this.isTargetDOMEl && this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  };

  _proto.install = function install() {};

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return Plugin;
}();
},{"@uppy/utils/lib/findDOMElement":69,"preact":116}],9:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Translator = require('@uppy/utils/lib/Translator');

var ee = require('namespace-emitter');

var cuid = require('cuid');

var throttle = require('lodash.throttle');

var prettyBytes = require('@uppy/utils/lib/prettyBytes');

var match = require('mime-match');

var DefaultStore = require('@uppy/store-default');

var getFileType = require('@uppy/utils/lib/getFileType');

var getFileNameAndExtension = require('@uppy/utils/lib/getFileNameAndExtension');

var generateFileID = require('@uppy/utils/lib/generateFileID');

var supportsUploadProgress = require('./supportsUploadProgress');

var _require = require('./loggers'),
    nullLogger = _require.nullLogger,
    debugLogger = _require.debugLogger;

var Plugin = require('./Plugin'); // Exported from here.


var RestrictionError =
/*#__PURE__*/
function (_Error) {
  _inheritsLoose(RestrictionError, _Error);

  function RestrictionError() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Error.call.apply(_Error, [this].concat(args)) || this;
    _this.isRestriction = true;
    return _this;
  }

  return RestrictionError;
}(_wrapNativeSuper(Error));
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var Uppy =
/*#__PURE__*/
function () {
  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  function Uppy(opts) {
    var _this2 = this;

    this.defaultLocale = {
      strings: {
        youCanOnlyUploadX: {
          0: 'You can only upload %{smart_count} file',
          1: 'You can only upload %{smart_count} files',
          2: 'You can only upload %{smart_count} files'
        },
        youHaveToAtLeastSelectX: {
          0: 'You have to select at least %{smart_count} file',
          1: 'You have to select at least %{smart_count} files',
          2: 'You have to select at least %{smart_count} files'
        },
        exceedsSize: 'This file exceeds maximum allowed size of',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        companionError: 'Connection with Companion failed',
        companionAuthError: 'Authorization required',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        selectX: {
          0: 'Select %{smart_count}',
          1: 'Select %{smart_count}',
          2: 'Select %{smart_count}'
        },
        selectAllFilesFromFolderNamed: 'Select all files from folder %{name}',
        unselectAllFilesFromFolderNamed: 'Unselect all files from folder %{name}',
        selectFileNamed: 'Select file %{name}',
        unselectFileNamed: 'Unselect file %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        emptyFolderAdded: 'No files were added from empty folder',
        folderAdded: {
          0: 'Added %{smart_count} file from %{folder}',
          1: 'Added %{smart_count} files from %{folder}',
          2: 'Added %{smart_count} files from %{folder}'
        }
      }
    };
    var defaultOptions = {
      id: 'uppy',
      autoProceed: false,
      allowMultipleUploads: true,
      debug: false,
      restrictions: {
        maxFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: null
      },
      meta: {},
      onBeforeFileAdded: function onBeforeFileAdded(currentFile, files) {
        return currentFile;
      },
      onBeforeUpload: function onBeforeUpload(files) {
        return files;
      },
      store: DefaultStore(),
      logger: nullLogger // Merge default options with the ones set by user,
      // making sure to merge restrictions too

    };
    this.opts = _extends({}, defaultOptions, {}, opts, {
      restrictions: _extends({}, defaultOptions.restrictions, {}, opts && opts.restrictions) // Support debug: true for backwards-compatability, unless logger is set in opts
      // opts instead of this.opts to avoid comparing objects — we set logger: nullLogger in defaultOptions

    });

    if (opts && opts.logger && opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (opts && opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log("Using Core v" + this.constructor.VERSION);

    if (this.opts.restrictions.allowedFileTypes && this.opts.restrictions.allowedFileTypes !== null && !Array.isArray(this.opts.restrictions.allowedFileTypes)) {
      throw new TypeError('`restrictions.allowedFileTypes` must be an array');
    }

    this.i18nInit(); // Container for different types of plugins

    this.plugins = {};
    this.getState = this.getState.bind(this);
    this.getPlugin = this.getPlugin.bind(this);
    this.setFileMeta = this.setFileMeta.bind(this);
    this.setFileState = this.setFileState.bind(this);
    this.log = this.log.bind(this);
    this.info = this.info.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.addFile = this.addFile.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.pauseResume = this.pauseResume.bind(this); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file, and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this._calculateProgress = throttle(this._calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.resetProgress = this.resetProgress.bind(this);
    this.pauseAll = this.pauseAll.bind(this);
    this.resumeAll = this.resumeAll.bind(this);
    this.retryAll = this.retryAll.bind(this);
    this.cancelAll = this.cancelAll.bind(this);
    this.retryUpload = this.retryUpload.bind(this);
    this.upload = this.upload.bind(this);
    this.emitter = ee();
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.once = this.emitter.once.bind(this.emitter);
    this.emit = this.emitter.emit.bind(this.emitter);
    this.preProcessors = [];
    this.uploaders = [];
    this.postProcessors = [];
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: _extends({}, this.opts.meta),
      info: {
        isHidden: true,
        type: 'info',
        message: ''
      }
    });
    this._storeUnsubscribe = this.store.subscribe(function (prevState, nextState, patch) {
      _this2.emit('state-update', prevState, nextState, patch);

      _this2.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    this._addListeners();
  }

  var _proto = Uppy.prototype;

  _proto.on = function on(event, callback) {
    this.emitter.on(event, callback);
    return this;
  };

  _proto.off = function off(event, callback) {
    this.emitter.off(event, callback);
    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */
  ;

  _proto.updateAll = function updateAll(state) {
    this.iteratePlugins(function (plugin) {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */
  ;

  _proto.setState = function setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */
  ;

  _proto.getState = function getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   */
  ;

  /**
   * Shorthand to set state for a specific file.
   */
  _proto.setFileState = function setFileState(fileID, state) {
    var _extends2;

    if (!this.getState().files[fileID]) {
      throw new Error("Can\u2019t set state for " + fileID + " (the file could have been removed)");
    }

    this.setState({
      files: _extends({}, this.getState().files, (_extends2 = {}, _extends2[fileID] = _extends({}, this.getState().files[fileID], state), _extends2))
    });
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.locale = this.translator.locale;
    this.i18n = this.translator.translate.bind(this.translator);
    this.i18nArray = this.translator.translateArray.bind(this.translator);
  };

  _proto.setOptions = function setOptions(newOpts) {
    this.opts = _extends({}, this.opts, {}, newOpts, {
      restrictions: _extends({}, this.opts.restrictions, {}, newOpts && newOpts.restrictions)
    });

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(function (plugin) {
        plugin.setOptions();
      });
    }

    this.setState(); // so that UI re-renders with new options
  };

  _proto.resetProgress = function resetProgress() {
    var defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };

    var files = _extends({}, this.getState().files);

    var updatedFiles = {};
    Object.keys(files).forEach(function (fileID) {
      var updatedFile = _extends({}, files[fileID]);

      updatedFile.progress = _extends({}, updatedFile.progress, defaultProgress);
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    }); // TODO Document on the website

    this.emit('reset-progress');
  };

  _proto.addPreProcessor = function addPreProcessor(fn) {
    this.preProcessors.push(fn);
  };

  _proto.removePreProcessor = function removePreProcessor(fn) {
    var i = this.preProcessors.indexOf(fn);

    if (i !== -1) {
      this.preProcessors.splice(i, 1);
    }
  };

  _proto.addPostProcessor = function addPostProcessor(fn) {
    this.postProcessors.push(fn);
  };

  _proto.removePostProcessor = function removePostProcessor(fn) {
    var i = this.postProcessors.indexOf(fn);

    if (i !== -1) {
      this.postProcessors.splice(i, 1);
    }
  };

  _proto.addUploader = function addUploader(fn) {
    this.uploaders.push(fn);
  };

  _proto.removeUploader = function removeUploader(fn) {
    var i = this.uploaders.indexOf(fn);

    if (i !== -1) {
      this.uploaders.splice(i, 1);
    }
  };

  _proto.setMeta = function setMeta(data) {
    var updatedMeta = _extends({}, this.getState().meta, data);

    var updatedFiles = _extends({}, this.getState().files);

    Object.keys(updatedFiles).forEach(function (fileID) {
      updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
        meta: _extends({}, updatedFiles[fileID].meta, data)
      });
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  };

  _proto.setFileMeta = function setFileMeta(fileID, data) {
    var updatedFiles = _extends({}, this.getState().files);

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    var newMeta = _extends({}, updatedFiles[fileID].meta, data);

    updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
      meta: newMeta
    });
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */
  ;

  _proto.getFile = function getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */
  ;

  _proto.getFiles = function getFiles() {
    var _this$getState = this.getState(),
        files = _this$getState.files;

    return Object.keys(files).map(function (fileID) {
      return files[fileID];
    });
  }
  /**
   * Check if minNumberOfFiles restriction is reached before uploading.
   *
   * @private
   */
  ;

  _proto._checkMinNumberOfFiles = function _checkMinNumberOfFiles(files) {
    var minNumberOfFiles = this.opts.restrictions.minNumberOfFiles;

    if (Object.keys(files).length < minNumberOfFiles) {
      throw new RestrictionError("" + this.i18n('youHaveToAtLeastSelectX', {
        smart_count: minNumberOfFiles
      }));
    }
  }
  /**
   * Check if file passes a set of restrictions set in options: maxFileSize,
   * maxNumberOfFiles and allowedFileTypes.
   *
   * @param {object} file object to check
   * @private
   */
  ;

  _proto._checkRestrictions = function _checkRestrictions(file) {
    var _this$opts$restrictio = this.opts.restrictions,
        maxFileSize = _this$opts$restrictio.maxFileSize,
        maxNumberOfFiles = _this$opts$restrictio.maxNumberOfFiles,
        allowedFileTypes = _this$opts$restrictio.allowedFileTypes;

    if (maxNumberOfFiles) {
      if (Object.keys(this.getState().files).length + 1 > maxNumberOfFiles) {
        throw new RestrictionError("" + this.i18n('youCanOnlyUploadX', {
          smart_count: maxNumberOfFiles
        }));
      }
    }

    if (allowedFileTypes) {
      var isCorrectFileType = allowedFileTypes.some(function (type) {
        // is this is a mime-type
        if (type.indexOf('/') > -1) {
          if (!file.type) return false;
          return match(file.type, type);
        } // otherwise this is likely an extension


        if (type[0] === '.') {
          return file.extension.toLowerCase() === type.substr(1).toLowerCase();
        }

        return false;
      });

      if (!isCorrectFileType) {
        var allowedFileTypesString = allowedFileTypes.join(', ');
        throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
          types: allowedFileTypesString
        }));
      }
    } // We can't check maxFileSize if the size is unknown.


    if (maxFileSize && file.data.size != null) {
      if (file.data.size > maxFileSize) {
        throw new RestrictionError(this.i18n('exceedsSize') + " " + prettyBytes(maxFileSize));
      }
    }
  };

  _proto._showOrLogErrorAndThrow = function _showOrLogErrorAndThrow(err, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$showInformer = _ref.showInformer,
        showInformer = _ref$showInformer === void 0 ? true : _ref$showInformer,
        _ref$file = _ref.file,
        file = _ref$file === void 0 ? null : _ref$file;

    var message = typeof err === 'object' ? err.message : err;
    var details = typeof err === 'object' && err.details ? err.details : ''; // Restriction errors should be logged, but not as errors,
    // as they are expected and shown in the UI.

    if (err.isRestriction) {
      this.log(message + " " + details);
      this.emit('restriction-failed', file, err);
    } else {
      this.log(message + " " + details, 'error');
    } // Sometimes informer has to be shown manually by the developer,
    // for example, in `onBeforeFileAdded`.


    if (showInformer) {
      this.info({
        message: message,
        details: details
      }, 'error', 5000);
    }

    throw typeof err === 'object' ? err : new Error(err);
  }
  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  ;

  _proto.addFile = function addFile(file) {
    var _extends3,
        _this3 = this;

    var _this$getState2 = this.getState(),
        files = _this$getState2.files,
        allowNewUpload = _this$getState2.allowNewUpload;

    if (allowNewUpload === false) {
      this._showOrLogErrorAndThrow(new RestrictionError('Cannot add new files: already uploading.'), {
        file: file
      });
    }

    var fileType = getFileType(file);
    file.type = fileType;
    var onBeforeFileAddedResult = this.opts.onBeforeFileAdded(file, files);

    if (onBeforeFileAddedResult === false) {
      // Don’t show UI info for this error, as it should be done by the developer
      this._showOrLogErrorAndThrow(new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.'), {
        showInformer: false,
        file: file
      });
    }

    if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult) {
      file = onBeforeFileAddedResult;
    }

    var fileName;

    if (file.name) {
      fileName = file.name;
    } else if (fileType.split('/')[0] === 'image') {
      fileName = fileType.split('/')[0] + '.' + fileType.split('/')[1];
    } else {
      fileName = 'noname';
    }

    var fileExtension = getFileNameAndExtension(fileName).extension;
    var isRemote = file.isRemote || false;
    var fileID = generateFileID(file);

    if (files[fileID]) {
      this._showOrLogErrorAndThrow(new RestrictionError("Cannot add the duplicate file '" + fileName + "', it already exists."), {
        file: file
      });
    }

    var meta = file.meta || {};
    meta.name = fileName;
    meta.type = fileType; // `null` means the size is unknown.

    var size = isFinite(file.data.size) ? file.data.size : null;
    var newFile = {
      source: file.source || '',
      id: fileID,
      name: fileName,
      extension: fileExtension || '',
      meta: _extends({}, this.getState().meta, meta),
      type: fileType,
      data: file.data,
      progress: {
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: size,
        uploadComplete: false,
        uploadStarted: null
      },
      size: size,
      isRemote: isRemote,
      remote: file.remote || '',
      preview: file.preview
    };

    try {
      this._checkRestrictions(newFile);
    } catch (err) {
      this._showOrLogErrorAndThrow(err, {
        file: newFile
      });
    }

    this.setState({
      files: _extends({}, files, (_extends3 = {}, _extends3[fileID] = newFile, _extends3))
    });
    this.emit('file-added', newFile);
    this.log("Added file: " + fileName + ", " + fileID + ", mime type: " + fileType);

    if (this.opts.autoProceed && !this.scheduledAutoProceed) {
      this.scheduledAutoProceed = setTimeout(function () {
        _this3.scheduledAutoProceed = null;

        _this3.upload().catch(function (err) {
          if (!err.isRestriction) {
            _this3.log(err.stack || err.message || err);
          }
        });
      }, 4);
    }

    return fileID;
  };

  _proto.removeFile = function removeFile(fileID) {
    var _this4 = this;

    var _this$getState3 = this.getState(),
        files = _this$getState3.files,
        currentUploads = _this$getState3.currentUploads;

    var updatedFiles = _extends({}, files);

    var removedFile = updatedFiles[fileID];
    delete updatedFiles[fileID]; // Remove this file from its `currentUpload`.

    var updatedUploads = _extends({}, currentUploads);

    var removeUploads = [];
    Object.keys(updatedUploads).forEach(function (uploadID) {
      var newFileIDs = currentUploads[uploadID].fileIDs.filter(function (uploadFileID) {
        return uploadFileID !== fileID;
      }); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        removeUploads.push(uploadID);
        return;
      }

      updatedUploads[uploadID] = _extends({}, currentUploads[uploadID], {
        fileIDs: newFileIDs
      });
    });
    this.setState(_extends({
      currentUploads: updatedUploads,
      files: updatedFiles
    }, // If this is the last file we just removed - allow new uploads!
    Object.keys(updatedFiles).length === 0 && {
      allowNewUpload: true
    }));
    removeUploads.forEach(function (uploadID) {
      _this4._removeUpload(uploadID);
    });

    this._calculateTotalProgress();

    this.emit('file-removed', removedFile);
    this.log("File removed: " + removedFile.id);
  };

  _proto.pauseResume = function pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return;
    }

    var wasPaused = this.getFile(fileID).isPaused || false;
    var isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused: isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  };

  _proto.pauseAll = function pauseAll() {
    var updatedFiles = _extends({}, this.getState().files);

    var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function (file) {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: true
      });

      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  };

  _proto.resumeAll = function resumeAll() {
    var updatedFiles = _extends({}, this.getState().files);

    var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function (file) {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: false,
        error: null
      });

      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  };

  _proto.retryAll = function retryAll() {
    var updatedFiles = _extends({}, this.getState().files);

    var filesToRetry = Object.keys(updatedFiles).filter(function (file) {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: false,
        error: null
      });

      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    var uploadID = this._createUpload(filesToRetry);

    return this._runUpload(uploadID);
  };

  _proto.cancelAll = function cancelAll() {
    var _this5 = this;

    this.emit('cancel-all');
    var files = Object.keys(this.getState().files);
    files.forEach(function (fileID) {
      _this5.removeFile(fileID);
    });
    this.setState({
      totalProgress: 0,
      error: null
    });
  };

  _proto.retryUpload = function retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    var uploadID = this._createUpload([fileID]);

    return this._runUpload(uploadID);
  };

  _proto.reset = function reset() {
    this.cancelAll();
  };

  _proto._calculateProgress = function _calculateProgress(file, data) {
    if (!this.getFile(file.id)) {
      this.log("Not setting progress for a file that has been removed: " + file.id);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    var canHavePercentage = isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: _extends({}, this.getFile(file.id).progress, {
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage // TODO(goto-bus-stop) flooring this should probably be the choice of the UI?
        // we get more accurate calculations if we don't round this at all.
        ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      })
    });

    this._calculateTotalProgress();
  };

  _proto._calculateTotalProgress = function _calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    var files = this.getFiles();
    var inProgress = files.filter(function (file) {
      return file.progress.uploadStarted;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    var sizedFiles = inProgress.filter(function (file) {
      return file.progress.bytesTotal != null;
    });
    var unsizedFiles = inProgress.filter(function (file) {
      return file.progress.bytesTotal == null;
    });

    if (sizedFiles.length === 0) {
      var progressMax = inProgress.length * 100;
      var currentProgress = unsizedFiles.reduce(function (acc, file) {
        return acc + file.progress.percentage;
      }, 0);

      var _totalProgress = Math.round(currentProgress / progressMax * 100);

      this.setState({
        totalProgress: _totalProgress
      });
      return;
    }

    var totalSize = sizedFiles.reduce(function (acc, file) {
      return acc + file.progress.bytesTotal;
    }, 0);
    var averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    var uploadedSize = 0;
    sizedFiles.forEach(function (file) {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(function (file) {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    var totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress: totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */
  ;

  _proto._addListeners = function _addListeners() {
    var _this6 = this;

    this.on('error', function (error) {
      _this6.setState({
        error: error.message || 'Unknown error'
      });
    });
    this.on('upload-error', function (file, error, response) {
      _this6.setFileState(file.id, {
        error: error.message || 'Unknown error',
        response: response
      });

      _this6.setState({
        error: error.message
      });

      var message = _this6.i18n('failedToUpload', {
        file: file.name
      });

      if (typeof error === 'object' && error.message) {
        message = {
          message: message,
          details: error.message
        };
      }

      _this6.info(message, 'error', 5000);
    });
    this.on('upload', function () {
      _this6.setState({
        error: null
      });
    });
    this.on('upload-started', function (file, upload) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      _this6.setFileState(file.id, {
        progress: {
          uploadStarted: Date.now(),
          uploadComplete: false,
          percentage: 0,
          bytesUploaded: 0,
          bytesTotal: file.size
        }
      });
    });
    this.on('upload-progress', this._calculateProgress);
    this.on('upload-success', function (file, uploadResp) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      var currentProgress = _this6.getFile(file.id).progress;

      _this6.setFileState(file.id, {
        progress: _extends({}, currentProgress, {
          uploadComplete: true,
          percentage: 100,
          bytesUploaded: currentProgress.bytesTotal
        }),
        response: uploadResp,
        uploadURL: uploadResp.uploadURL,
        isPaused: false
      });

      _this6._calculateTotalProgress();
    });
    this.on('preprocess-progress', function (file, progress) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      _this6.setFileState(file.id, {
        progress: _extends({}, _this6.getFile(file.id).progress, {
          preprocess: progress
        })
      });
    });
    this.on('preprocess-complete', function (file) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      var files = _extends({}, _this6.getState().files);

      files[file.id] = _extends({}, files[file.id], {
        progress: _extends({}, files[file.id].progress)
      });
      delete files[file.id].progress.preprocess;

      _this6.setState({
        files: files
      });
    });
    this.on('postprocess-progress', function (file, progress) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      _this6.setFileState(file.id, {
        progress: _extends({}, _this6.getState().files[file.id].progress, {
          postprocess: progress
        })
      });
    });
    this.on('postprocess-complete', function (file) {
      if (!_this6.getFile(file.id)) {
        _this6.log("Not setting progress for a file that has been removed: " + file.id);

        return;
      }

      var files = _extends({}, _this6.getState().files);

      files[file.id] = _extends({}, files[file.id], {
        progress: _extends({}, files[file.id].progress)
      });
      delete files[file.id].progress.postprocess; // TODO should we set some kind of `fullyComplete` property on the file object
      // so it's easier to see that the file is upload…fully complete…rather than
      // what we have to do now (`uploadComplete && !postprocess`)

      _this6.setState({
        files: files
      });
    });
    this.on('restored', function () {
      // Files may have changed--ensure progress is still accurate.
      _this6._calculateTotalProgress();
    }); // show informer if offline

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('online', function () {
        return _this6.updateOnlineStatus();
      });
      window.addEventListener('offline', function () {
        return _this6.updateOnlineStatus();
      });
      setTimeout(function () {
        return _this6.updateOnlineStatus();
      }, 3000);
    }
  };

  _proto.updateOnlineStatus = function updateOnlineStatus() {
    var online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  };

  _proto.getID = function getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  ;

  _proto.use = function use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      var msg = "Expected a plugin class, but got " + (Plugin === null ? 'null' : typeof Plugin) + "." + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    var plugin = new Plugin(this, opts);
    var pluginId = plugin.id;
    this.plugins[plugin.type] = this.plugins[plugin.type] || [];

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    var existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      var _msg = "Already found a plugin named '" + existsPluginAlready.id + "'. " + ("Tried to use: '" + pluginId + "'.\n") + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';

      throw new Error(_msg);
    }

    if (Plugin.VERSION) {
      this.log("Using " + pluginId + " v" + Plugin.VERSION);
    }

    this.plugins[plugin.type].push(plugin);
    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {object|boolean}
   */
  ;

  _proto.getPlugin = function getPlugin(id) {
    var foundPlugin = null;
    this.iteratePlugins(function (plugin) {
      if (plugin.id === id) {
        foundPlugin = plugin;
        return false;
      }
    });
    return foundPlugin;
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */
  ;

  _proto.iteratePlugins = function iteratePlugins(method) {
    var _this7 = this;

    Object.keys(this.plugins).forEach(function (pluginType) {
      _this7.plugins[pluginType].forEach(method);
    });
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */
  ;

  _proto.removePlugin = function removePlugin(instance) {
    this.log("Removing plugin " + instance.id);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    var list = this.plugins[instance.type].slice();
    var index = list.indexOf(instance);

    if (index !== -1) {
      list.splice(index, 1);
      this.plugins[instance.type] = list;
    }

    var updatedState = this.getState();
    delete updatedState.plugins[instance.id];
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */
  ;

  _proto.close = function close() {
    var _this8 = this;

    this.log("Closing Uppy instance " + this.opts.id + ": removing all files and uninstalling plugins");
    this.reset();

    this._storeUnsubscribe();

    this.iteratePlugins(function (plugin) {
      _this8.removePlugin(plugin);
    });
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */
  ;

  _proto.info = function info(message, type, duration) {
    if (type === void 0) {
      type = 'info';
    }

    if (duration === void 0) {
      duration = 3000;
    }

    var isComplexMessage = typeof message === 'object';
    this.setState({
      info: {
        isHidden: false,
        type: type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }
    });
    this.emit('info-visible');
    clearTimeout(this.infoTimeoutID);

    if (duration === 0) {
      this.infoTimeoutID = undefined;
      return;
    } // hide the informer after `duration` milliseconds


    this.infoTimeoutID = setTimeout(this.hideInfo, duration);
  };

  _proto.hideInfo = function hideInfo() {
    var newInfo = _extends({}, this.getState().info, {
      isHidden: true
    });

    this.setState({
      info: newInfo
    });
    this.emit('info-hidden');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */
  ;

  _proto.log = function log(message, type) {
    var logger = this.opts.logger;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Obsolete, event listeners are now added in the constructor.
   */
  ;

  _proto.run = function run() {
    this.log('Calling run() is no longer necessary.', 'warning');
    return this;
  }
  /**
   * Restore an upload by its ID.
   */
  ;

  _proto.restore = function restore(uploadID) {
    this.log("Core: attempting to restore upload \"" + uploadID + "\"");

    if (!this.getState().currentUploads[uploadID]) {
      this._removeUpload(uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return this._runUpload(uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */
  ;

  _proto._createUpload = function _createUpload(fileIDs) {
    var _extends4;

    var _this$getState4 = this.getState(),
        allowNewUpload = _this$getState4.allowNewUpload,
        currentUploads = _this$getState4.currentUploads;

    if (!allowNewUpload) {
      throw new Error('Cannot create a new upload: already uploading.');
    }

    var uploadID = cuid();
    this.emit('upload', {
      id: uploadID,
      fileIDs: fileIDs
    });
    this.setState({
      allowNewUpload: this.opts.allowMultipleUploads !== false,
      currentUploads: _extends({}, currentUploads, (_extends4 = {}, _extends4[uploadID] = {
        fileIDs: fileIDs,
        step: 0,
        result: {}
      }, _extends4))
    });
    return uploadID;
  };

  _proto._getUpload = function _getUpload(uploadID) {
    var _this$getState5 = this.getState(),
        currentUploads = _this$getState5.currentUploads;

    return currentUploads[uploadID];
  }
  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  ;

  _proto.addResultData = function addResultData(uploadID, data) {
    var _extends5;

    if (!this._getUpload(uploadID)) {
      this.log("Not setting result for an upload that has been removed: " + uploadID);
      return;
    }

    var currentUploads = this.getState().currentUploads;

    var currentUpload = _extends({}, currentUploads[uploadID], {
      result: _extends({}, currentUploads[uploadID].result, data)
    });

    this.setState({
      currentUploads: _extends({}, currentUploads, (_extends5 = {}, _extends5[uploadID] = currentUpload, _extends5))
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */
  ;

  _proto._removeUpload = function _removeUpload(uploadID) {
    var currentUploads = _extends({}, this.getState().currentUploads);

    delete currentUploads[uploadID];
    this.setState({
      currentUploads: currentUploads
    });
  }
  /**
   * Run an upload. This picks up where it left off in case the upload is being restored.
   *
   * @private
   */
  ;

  _proto._runUpload = function _runUpload(uploadID) {
    var _this9 = this;

    var uploadData = this.getState().currentUploads[uploadID];
    var restoreStep = uploadData.step;
    var steps = [].concat(this.preProcessors, this.uploaders, this.postProcessors);
    var lastStep = Promise.resolve();
    steps.forEach(function (fn, step) {
      // Skip this step if we are restoring and have already completed this step before.
      if (step < restoreStep) {
        return;
      }

      lastStep = lastStep.then(function () {
        var _extends6;

        var _this9$getState = _this9.getState(),
            currentUploads = _this9$getState.currentUploads;

        var currentUpload = currentUploads[uploadID];

        if (!currentUpload) {
          return;
        }

        var updatedUpload = _extends({}, currentUpload, {
          step: step
        });

        _this9.setState({
          currentUploads: _extends({}, currentUploads, (_extends6 = {}, _extends6[uploadID] = updatedUpload, _extends6))
        }); // TODO give this the `updatedUpload` object as its only parameter maybe?
        // Otherwise when more metadata may be added to the upload this would keep getting more parameters


        return fn(updatedUpload.fileIDs, uploadID);
      }).then(function (result) {
        return null;
      });
    }); // Not returning the `catch`ed promise, because we still want to return a rejected
    // promise from this method if the upload failed.

    lastStep.catch(function (err) {
      _this9.emit('error', err, uploadID);

      _this9._removeUpload(uploadID);
    });
    return lastStep.then(function () {
      // Set result data.
      var _this9$getState2 = _this9.getState(),
          currentUploads = _this9$getState2.currentUploads;

      var currentUpload = currentUploads[uploadID];

      if (!currentUpload) {
        return;
      }

      var files = currentUpload.fileIDs.map(function (fileID) {
        return _this9.getFile(fileID);
      });
      var successful = files.filter(function (file) {
        return !file.error;
      });
      var failed = files.filter(function (file) {
        return file.error;
      });

      _this9.addResultData(uploadID, {
        successful: successful,
        failed: failed,
        uploadID: uploadID
      });
    }).then(function () {
      // Emit completion events.
      // This is in a separate function so that the `currentUploads` variable
      // always refers to the latest state. In the handler right above it refers
      // to an outdated object without the `.result` property.
      var _this9$getState3 = _this9.getState(),
          currentUploads = _this9$getState3.currentUploads;

      if (!currentUploads[uploadID]) {
        return;
      }

      var currentUpload = currentUploads[uploadID];
      var result = currentUpload.result;

      _this9.emit('complete', result);

      _this9._removeUpload(uploadID);

      return result;
    }).then(function (result) {
      if (result == null) {
        _this9.log("Not setting result for an upload that has been removed: " + uploadID);
      }

      return result;
    });
  }
  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  ;

  _proto.upload = function upload() {
    var _this10 = this;

    if (!this.plugins.uploader) {
      this.log('No uploader type plugins are used', 'warning');
    }

    var files = this.getState().files;
    var onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult;
    }

    return Promise.resolve().then(function () {
      return _this10._checkMinNumberOfFiles(files);
    }).then(function () {
      var _this10$getState = _this10.getState(),
          currentUploads = _this10$getState.currentUploads; // get a list of files that are currently assigned to uploads


      var currentlyUploadingFiles = Object.keys(currentUploads).reduce(function (prev, curr) {
        return prev.concat(currentUploads[curr].fileIDs);
      }, []);
      var waitingFileIDs = [];
      Object.keys(files).forEach(function (fileID) {
        var file = _this10.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..


        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      var uploadID = _this10._createUpload(waitingFileIDs);

      return _this10._runUpload(uploadID);
    }).catch(function (err) {
      _this10._showOrLogErrorAndThrow(err);
    });
  };

  _createClass(Uppy, [{
    key: "state",
    get: function get() {
      return this.getState();
    }
  }]);

  return Uppy;
}();

Uppy.VERSION = "1.6.0";

module.exports = function (opts) {
  return new Uppy(opts);
}; // Expose class constructor.


module.exports.Uppy = Uppy;
module.exports.Plugin = Plugin;
module.exports.debugLogger = debugLogger;
},{"./Plugin":8,"./loggers":10,"./supportsUploadProgress":11,"@uppy/store-default":57,"@uppy/utils/lib/Translator":64,"@uppy/utils/lib/generateFileID":70,"@uppy/utils/lib/getFileNameAndExtension":77,"@uppy/utils/lib/getFileType":78,"@uppy/utils/lib/prettyBytes":90,"cuid":104,"lodash.throttle":111,"mime-match":113,"namespace-emitter":114}],10:[function(require,module,exports){
var getTimeStamp = require('@uppy/utils/lib/getTimeStamp'); // Swallow logs, default if logger is not set or debug: false


var nullLogger = {
  debug: function debug() {},
  warn: function warn() {},
  error: function error() {} // Print logs to console with namespace + timestamp,
  // set by logger: Uppy.debugLogger or debug: true

};
var debugLogger = {
  debug: function debug() {
    // IE 10 doesn’t support console.debug
    var debug = console.debug || console.log;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    debug.call.apply(debug, [console, "[Uppy] [" + getTimeStamp() + "]"].concat(args));
  },
  warn: function warn() {
    var _console;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return (_console = console).warn.apply(_console, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  },
  error: function error() {
    var _console2;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return (_console2 = console).error.apply(_console2, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
  }
};
module.exports = {
  nullLogger: nullLogger,
  debugLogger: debugLogger
};
},{"@uppy/utils/lib/getTimeStamp":82}],11:[function(require,module,exports){
// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  var m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  var edgeVersion = m[1];

  var _edgeVersion$split = edgeVersion.split('.'),
      major = _edgeVersion$split[0],
      minor = _edgeVersion$split[1];

  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};
},{}],12:[function(require,module,exports){
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('./icons'),
    localIcon = _require.localIcon;

var _require2 = require('preact'),
    h = _require2.h,
    Component = _require2.Component;

var AddFiles =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(AddFiles, _Component);

  function AddFiles(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.triggerFileInputClick = _this.triggerFileInputClick.bind(_assertThisInitialized(_this));
    _this.handleFileInputChange = _this.handleFileInputChange.bind(_assertThisInitialized(_this));
    _this.renderPoweredByUppy = _this.renderPoweredByUppy.bind(_assertThisInitialized(_this));
    _this.renderHiddenFileInput = _this.renderHiddenFileInput.bind(_assertThisInitialized(_this));
    _this.renderDropPasteBrowseTagline = _this.renderDropPasteBrowseTagline.bind(_assertThisInitialized(_this));
    _this.renderMyDeviceAcquirer = _this.renderMyDeviceAcquirer.bind(_assertThisInitialized(_this));
    _this.renderAcquirer = _this.renderAcquirer.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = AddFiles.prototype;

  _proto.triggerFileInputClick = function triggerFileInputClick() {
    this.fileInput.click();
  };

  _proto.handleFileInputChange = function handleFileInputChange(event) {
    this.props.handleInputChange(event); // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).

    event.target.value = null;
  };

  _proto.renderPoweredByUppy = function renderPoweredByUppy() {
    return h("a", {
      tabindex: "-1",
      href: "https://uppy.io",
      rel: "noreferrer noopener",
      target: "_blank",
      class: "uppy-Dashboard-poweredBy"
    }, this.props.i18n('poweredBy') + ' ', h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "UppyIcon uppy-Dashboard-poweredByIcon",
      width: "11",
      height: "11",
      viewBox: "0 0 11 11"
    }, h("path", {
      d: "M7.365 10.5l-.01-4.045h2.612L5.5.806l-4.467 5.65h2.604l.01 4.044h3.718z",
      "fill-rule": "evenodd"
    })), h("span", {
      class: "uppy-Dashboard-poweredByUppy"
    }, "Uppy"));
  };

  _proto.renderHiddenFileInput = function renderHiddenFileInput() {
    var _this2 = this;

    return h("input", {
      class: "uppy-Dashboard-input",
      hidden: true,
      "aria-hidden": "true",
      tabindex: -1,
      type: "file",
      name: "files[]",
      multiple: this.props.maxNumberOfFiles !== 1,
      onchange: this.handleFileInputChange,
      accept: this.props.allowedFileTypes,
      ref: function ref(_ref) {
        _this2.fileInput = _ref;
      }
    });
  };

  _proto.renderDropPasteBrowseTagline = function renderDropPasteBrowseTagline() {
    var browse = h("button", {
      type: "button",
      class: "uppy-u-reset uppy-Dashboard-browse",
      onclick: this.triggerFileInputClick
    }, this.props.i18n('browse'));
    return h("div", {
      class: "uppy-Dashboard-dropFilesTitle"
    }, this.props.acquirers.length === 0 ? this.props.i18nArray('dropPaste', {
      browse: browse
    }) : this.props.i18nArray('dropPasteImport', {
      browse: browse
    }));
  };

  _proto.renderMyDeviceAcquirer = function renderMyDeviceAcquirer() {
    return h("div", {
      class: "uppy-DashboardTab",
      role: "presentation"
    }, h("button", {
      type: "button",
      class: "uppy-DashboardTab-btn",
      role: "tab",
      tabindex: 0,
      "data-uppy-super-focusable": true,
      onclick: this.triggerFileInputClick
    }, localIcon(), h("div", {
      class: "uppy-DashboardTab-name"
    }, this.props.i18n('myDevice'))));
  };

  _proto.renderAcquirer = function renderAcquirer(acquirer) {
    var _this3 = this;

    return h("div", {
      class: "uppy-DashboardTab",
      role: "presentation"
    }, h("button", {
      type: "button",
      class: "uppy-DashboardTab-btn",
      role: "tab",
      tabindex: 0,
      "aria-controls": "uppy-DashboardContent-panel--" + acquirer.id,
      "aria-selected": this.props.activePickerPanel.id === acquirer.id,
      "data-uppy-super-focusable": true,
      onclick: function onclick() {
        return _this3.props.showPanel(acquirer.id);
      }
    }, acquirer.icon(), h("div", {
      class: "uppy-DashboardTab-name"
    }, acquirer.name)));
  };

  _proto.render = function render() {
    var _this4 = this;

    return h("div", {
      class: "uppy-DashboardAddFiles"
    }, this.renderHiddenFileInput(), h("div", {
      class: "uppy-DashboardTabs"
    }, this.renderDropPasteBrowseTagline(), this.props.acquirers.length > 0 && h("div", {
      class: "uppy-DashboardTabs-list",
      role: "tablist"
    }, this.renderMyDeviceAcquirer(), this.props.acquirers.map(function (acquirer) {
      return _this4.renderAcquirer(acquirer);
    }))), h("div", {
      class: "uppy-DashboardAddFiles-info"
    }, this.props.note && h("div", {
      class: "uppy-Dashboard-note"
    }, this.props.note), this.props.proudlyDisplayPoweredByUppy && this.renderPoweredByUppy(this.props)));
  };

  return AddFiles;
}(Component);

module.exports = AddFiles;
},{"./icons":26,"preact":116}],13:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

var AddFiles = require('./AddFiles');

var AddFilesPanel = function AddFilesPanel(props) {
  return h("div", {
    class: "uppy-Dashboard-AddFilesPanel",
    "data-uppy-panelType": "AddFiles",
    "aria-hidden": props.showAddFilesPanel
  }, h("div", {
    class: "uppy-DashboardContent-bar"
  }, h("div", {
    class: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "h1"
  }, props.i18n('addingMoreFiles')), h("button", {
    class: "uppy-DashboardContent-back",
    type: "button",
    onclick: function onclick(ev) {
      return props.toggleAddFilesPanel(false);
    }
  }, props.i18n('back'))), h(AddFiles, props));
};

module.exports = AddFilesPanel;
},{"./AddFiles":12,"preact":116}],14:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var FileList = require('./FileList');

var AddFiles = require('./AddFiles');

var AddFilesPanel = require('./AddFilesPanel');

var PickerPanelContent = require('./PickerPanelContent');

var PanelTopBar = require('./PickerPanelTopBar');

var FileCard = require('./FileCard');

var classNames = require('classnames');

var isTouchDevice = require('@uppy/utils/lib/isTouchDevice');

var _require = require('preact'),
    h = _require.h;

var PreactCSSTransitionGroup = require('preact-css-transition-group'); // http://dev.edenspiekermann.com/2016/02/11/introducing-accessible-modal-dialog
// https://github.com/ghosh/micromodal


function TransitionWrapper(props) {
  return h(PreactCSSTransitionGroup, {
    transitionName: "uppy-transition-slideDownUp",
    transitionEnterTimeout: 250,
    transitionLeaveTimeout: 250
  }, props.children);
}

module.exports = function Dashboard(props) {
  var noFiles = props.totalFileCount === 0;
  var dashboardClassName = classNames({
    'uppy-Root': props.isTargetDOMEl
  }, 'uppy-Dashboard', {
    'Uppy--isTouchDevice': isTouchDevice()
  }, {
    'uppy-Dashboard--animateOpenClose': props.animateOpenClose
  }, {
    'uppy-Dashboard--isClosing': props.isClosing
  }, {
    'uppy-Dashboard--isDraggingOver': props.isDraggingOver
  }, {
    'uppy-Dashboard--modal': !props.inline
  }, {
    'uppy-size--md': props.containerWidth > 576
  }, {
    'uppy-size--lg': props.containerWidth > 700
  }, {
    'uppy-size--xl': props.containerWidth > 900
  }, {
    'uppy-Dashboard--isAddFilesPanelVisible': props.showAddFilesPanel
  }, {
    'uppy-Dashboard--isInnerWrapVisible': props.areInsidesReadyToBeVisible
  });
  return h("div", {
    class: dashboardClassName,
    "aria-hidden": props.inline ? 'false' : props.isHidden,
    "aria-label": !props.inline ? props.i18n('dashboardWindowTitle') : props.i18n('dashboardTitle'),
    onpaste: props.handlePaste,
    onDragOver: props.handleDragOver,
    onDragLeave: props.handleDragLeave,
    onDrop: props.handleDrop
  }, h("div", {
    class: "uppy-Dashboard-overlay",
    tabindex: -1,
    onclick: props.handleClickOutside
  }), h("div", {
    class: "uppy-Dashboard-inner",
    "aria-modal": !props.inline && 'true',
    role: !props.inline && 'dialog',
    style: {
      width: props.inline && props.width ? props.width : '',
      height: props.inline && props.height ? props.height : ''
    }
  }, !props.inline ? h("button", {
    class: "uppy-u-reset uppy-Dashboard-close",
    type: "button",
    "aria-label": props.i18n('closeModal'),
    title: props.i18n('closeModal'),
    onclick: props.closeModal
  }, h("span", {
    "aria-hidden": "true"
  }, "\xD7")) : null, h("div", {
    class: "uppy-Dashboard-innerWrap"
  }, h("div", {
    class: "uppy-Dashboard-dropFilesHereHint"
  }, props.i18n('dropHint')), !noFiles && props.showSelectedFiles && h(PanelTopBar, props), props.showSelectedFiles ? noFiles ? h(AddFiles, props) : h(FileList, props) : h(AddFiles, props), h(TransitionWrapper, null, props.showAddFilesPanel ? h(AddFilesPanel, _extends({
    key: "AddFilesPanel"
  }, props)) : null), h(TransitionWrapper, null, props.fileCardFor ? h(FileCard, _extends({
    key: "FileCard"
  }, props)) : null), h(TransitionWrapper, null, props.activePickerPanel ? h(PickerPanelContent, _extends({
    key: "PickerPanelContent"
  }, props)) : null), h("div", {
    class: "uppy-Dashboard-progressindicators"
  }, props.progressindicators.map(function (target) {
    return props.getPlugin(target.id).render(props.state);
  })))));
};
},{"./AddFiles":12,"./AddFilesPanel":13,"./FileCard":15,"./FileList":22,"./PickerPanelContent":24,"./PickerPanelTopBar":25,"@uppy/utils/lib/isTouchDevice":88,"classnames":103,"preact":116,"preact-css-transition-group":115}],15:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('preact'),
    h = _require.h,
    Component = _require.Component;

var getFileTypeIcon = require('../../utils/getFileTypeIcon');

var ignoreEvent = require('../../utils/ignoreEvent.js');

var FilePreview = require('../FilePreview');

var FileCard =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(FileCard, _Component);

  function FileCard(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _this.saveOnEnter = function (ev) {
      if (ev.keyCode === 13) {
        ev.stopPropagation();
        ev.preventDefault();
        var file = _this.props.files[_this.props.fileCardFor];

        _this.props.saveFileCard(_this.state.formState, file.id);
      }
    };

    _this.tempStoreMeta = function (ev, name) {
      var _extends2;

      _this.setState({
        formState: _extends({}, _this.state.formState, (_extends2 = {}, _extends2[name] = ev.target.value, _extends2))
      });
    };

    _this.handleSave = function () {
      var fileID = _this.props.fileCardFor;

      _this.props.saveFileCard(_this.state.formState, fileID);
    };

    _this.handleCancel = function () {
      _this.props.toggleFileCard();
    };

    _this.renderMetaFields = function () {
      var metaFields = _this.props.metaFields || [];
      return metaFields.map(function (field) {
        var id = "uppy-Dashboard-FileCard-input-" + field.id;
        return h("fieldset", {
          key: field.id,
          class: "uppy-Dashboard-FileCard-fieldset"
        }, h("label", {
          class: "uppy-Dashboard-FileCard-label",
          for: id
        }, field.name), h("input", {
          class: "uppy-u-reset uppy-c-textInput uppy-Dashboard-FileCard-input",
          id: id,
          type: "text",
          value: _this.state.formState[field.id],
          placeholder: field.placeholder,
          onkeyup: _this.saveOnEnter,
          onkeydown: _this.saveOnEnter,
          onkeypress: _this.saveOnEnter,
          oninput: function oninput(ev) {
            return _this.tempStoreMeta(ev, field.id);
          },
          "data-uppy-super-focusable": true
        }));
      });
    };

    var _file = _this.props.files[_this.props.fileCardFor];

    var _metaFields = _this.props.metaFields || [];

    var storedMetaData = {};

    _metaFields.forEach(function (field) {
      storedMetaData[field.id] = _file.meta[field.id] || '';
    });

    _this.state = {
      formState: storedMetaData
    };
    return _this;
  }

  var _proto = FileCard.prototype;

  _proto.render = function render() {
    var file = this.props.files[this.props.fileCardFor];
    return h("div", {
      class: "uppy-Dashboard-FileCard",
      "data-uppy-panelType": "FileCard",
      onDragOver: ignoreEvent,
      onDragLeave: ignoreEvent,
      onDrop: ignoreEvent,
      onPaste: ignoreEvent
    }, h("div", {
      class: "uppy-DashboardContent-bar"
    }, h("div", {
      class: "uppy-DashboardContent-title",
      role: "heading",
      "aria-level": "h1"
    }, this.props.i18nArray('editing', {
      file: h("span", {
        class: "uppy-DashboardContent-titleFile"
      }, file.meta ? file.meta.name : file.name)
    })), h("button", {
      class: "uppy-DashboardContent-back",
      type: "button",
      title: this.props.i18n('finishEditingFile'),
      onclick: this.handleSave
    }, this.props.i18n('done'))), h("div", {
      class: "uppy-Dashboard-FileCard-inner"
    }, h("div", {
      class: "uppy-Dashboard-FileCard-preview",
      style: {
        backgroundColor: getFileTypeIcon(file.type).color
      }
    }, h(FilePreview, {
      file: file
    })), h("div", {
      class: "uppy-Dashboard-FileCard-info"
    }, this.renderMetaFields()), h("div", {
      class: "uppy-Dashboard-FileCard-actions"
    }, h("button", {
      class: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Dashboard-FileCard-actionsBtn",
      type: "button",
      onclick: this.handleSave
    }, this.props.i18n('saveChanges')), h("button", {
      class: "uppy-u-reset uppy-c-btn uppy-c-btn-link uppy-Dashboard-FileCard-actionsBtn",
      type: "button",
      onclick: this.handleCancel
    }, this.props.i18n('cancel')))));
  };

  return FileCard;
}(Component);

module.exports = FileCard;
},{"../../utils/getFileTypeIcon":31,"../../utils/ignoreEvent.js":32,"../FilePreview":23,"preact":116}],16:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

var copyToClipboard = require('../../../utils/copyToClipboard');

var _require2 = require('../../icons'),
    iconPencil = _require2.iconPencil,
    iconCross = _require2.iconCross,
    iconCopyLink = _require2.iconCopyLink;

var renderEditButton = function renderEditButton(props) {
  return !props.uploadInProgressOrComplete && props.metaFields && props.metaFields.length > 0 && h("button", {
    class: "uppy-u-reset uppy-DashboardItem-action uppy-DashboardItem-action--edit",
    type: "button",
    "aria-label": props.i18n('editFile') + ' ' + props.file.meta.name,
    title: props.i18n('editFile'),
    onclick: function onclick(e) {
      return props.toggleFileCard(props.file.id);
    }
  }, iconPencil());
};

var renderRemoveButton = function renderRemoveButton(props) {
  return props.showRemoveButton && h("button", {
    class: "uppy-u-reset uppy-DashboardItem-action uppy-DashboardItem-action--remove",
    type: "button",
    "aria-label": props.i18n('removeFile'),
    title: props.i18n('removeFile'),
    onclick: function onclick() {
      return props.removeFile(props.file.id);
    }
  }, iconCross());
};

var copyLinkToClipboard = function copyLinkToClipboard(event, props) {
  return copyToClipboard(props.file.uploadURL, props.i18n('copyLinkToClipboardFallback')).then(function () {
    props.log('Link copied to clipboard.');
    props.info(props.i18n('copyLinkToClipboardSuccess'), 'info', 3000);
  }).catch(props.log) // avoid losing focus
  .then(function () {
    return event.target.focus({
      preventScroll: true
    });
  });
};

var renderCopyLinkButton = function renderCopyLinkButton(props) {
  return props.showLinkToFileUploadResult && props.file.uploadURL && h("button", {
    class: "uppy-u-reset uppy-DashboardItem-action uppy-DashboardItem-action--copyLink",
    type: "button",
    "aria-label": props.i18n('copyLink'),
    title: props.i18n('copyLink'),
    onclick: function onclick(event) {
      return copyLinkToClipboard(event, props);
    }
  }, iconCopyLink());
};

module.exports = function Buttons(props) {
  return h("div", {
    className: "uppy-DashboardItem-actionWrapper"
  }, renderEditButton(props), renderCopyLinkButton(props), renderRemoveButton(props));
};
},{"../../../utils/copyToClipboard":28,"../../icons":26,"preact":116}],17:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

var prettyBytes = require('@uppy/utils/lib/prettyBytes');

var truncateString = require('../../../utils/truncateString');

var renderAcquirerIcon = function renderAcquirerIcon(acquirer, props) {
  return h("span", {
    title: props.i18n('fileSource', {
      name: acquirer.name
    })
  }, acquirer.icon());
};

var renderFileSource = function renderFileSource(props) {
  return props.file.source && props.file.source !== props.id && h("div", {
    class: "uppy-DashboardItem-sourceIcon"
  }, props.acquirers.map(function (acquirer) {
    if (acquirer.id === props.file.source) {
      return renderAcquirerIcon(acquirer, props);
    }
  }));
};

var renderFileName = function renderFileName(props) {
  // Take up at most 2 lines on any screen
  var maxNameLength; // For very small mobile screens

  if (props.containerWidth <= 352) {
    maxNameLength = 35; // For regular mobile screens
  } else if (props.containerWidth <= 576) {
    maxNameLength = 60; // For desktops
  } else {
    maxNameLength = 30;
  }

  return h("div", {
    class: "uppy-DashboardItem-name",
    title: props.file.meta.name
  }, truncateString(props.file.meta.name, maxNameLength));
};

var renderFileSize = function renderFileSize(props) {
  return props.file.data.size && h("div", {
    class: "uppy-DashboardItem-statusSize"
  }, prettyBytes(props.file.data.size));
};

module.exports = function FileInfo(props) {
  return h("div", {
    class: "uppy-DashboardItem-fileInfo",
    "data-uppy-file-source": props.file.source
  }, renderFileName(props), h("div", {
    class: "uppy-DashboardItem-status"
  }, renderFileSize(props), renderFileSource(props)));
};
},{"../../../utils/truncateString":35,"@uppy/utils/lib/prettyBytes":90,"preact":116}],18:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

var FilePreview = require('../../FilePreview');

var getFileTypeIcon = require('../../../utils/getFileTypeIcon');

module.exports = function FilePreviewAndLink(props) {
  return h("div", {
    class: "uppy-DashboardItem-previewInnerWrap",
    style: {
      backgroundColor: getFileTypeIcon(props.file.type).color
    }
  }, props.showLinkToFileUploadResult && props.file.uploadURL && h("a", {
    class: "uppy-DashboardItem-previewLink",
    href: props.file.uploadURL,
    rel: "noreferrer noopener",
    target: "_blank",
    "aria-label": props.file.meta.name
  }), h(FilePreview, {
    file: props.file
  }));
};
},{"../../../utils/getFileTypeIcon":31,"../../FilePreview":23,"preact":116}],19:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h; // http://codepen.io/Harkko/pen/rVxvNM
// https://css-tricks.com/svg-line-animation-works/
// https://gist.github.com/eswak/ad4ea57bcd5ff7aa5d42
// circle length equals 2 * PI * R


var circleLength = 2 * Math.PI * 15; // stroke-dashoffset is a percentage of the progress from circleLength,
// substracted from circleLength, because its an offset

module.exports = function PauseResumeCancelIcon(props) {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "70",
    height: "70",
    viewBox: "0 0 36 36",
    class: "UppyIcon UppyIcon-progressCircle"
  }, h("g", {
    class: "progress-group"
  }, h("circle", {
    class: "bg",
    r: "15",
    cx: "18",
    cy: "18",
    "stroke-width": "2",
    fill: "none"
  }), h("circle", {
    class: "progress",
    r: "15",
    cx: "18",
    cy: "18",
    transform: "rotate(-90, 18, 18)",
    "stroke-width": "2",
    fill: "none",
    "stroke-dasharray": circleLength,
    "stroke-dashoffset": circleLength - circleLength / 100 * props.progress
  })), !props.hidePauseResumeCancelButtons && h("g", null, h("polygon", {
    class: "play",
    transform: "translate(3, 3)",
    points: "12 20 12 10 20 15"
  }), h("g", {
    class: "pause",
    transform: "translate(14.5, 13)"
  }, h("rect", {
    x: "0",
    y: "0",
    width: "2",
    height: "10",
    rx: "0"
  }), h("rect", {
    x: "5",
    y: "0",
    width: "2",
    height: "10",
    rx: "0"
  })), h("polygon", {
    class: "cancel",
    transform: "translate(2, 2)",
    points: "19.8856516 11.0625 16 14.9481516 12.1019737 11.0625 11.0625 12.1143484 14.9481516 16 11.0625 19.8980263 12.1019737 20.9375 16 17.0518484 19.8856516 20.9375 20.9375 19.8980263 17.0518484 16 20.9375 12"
  })), h("polygon", {
    class: "check",
    transform: "translate(2, 3)",
    points: "14 22.5 7 15.2457065 8.99985857 13.1732815 14 18.3547104 22.9729883 9 25 11.1005634"
  }));
};
},{"preact":116}],20:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

var _require2 = require('../../icons'),
    iconRetry = _require2.iconRetry;

var PauseResumeCancelIcon = require('./PauseResumeCancelIcon');

function onPauseResumeCancelRetry(props) {
  if (props.isUploaded) return;

  if (props.error && !props.hideRetryButton) {
    props.retryUpload(props.file.id);
    return;
  }

  if (props.hidePauseResumeCancelButtons) {
    return;
  }

  if (props.resumableUploads) {
    props.pauseUpload(props.file.id);
  } else if (props.individualCancellation) {
    props.cancelUpload(props.file.id);
  }
}

function progressIndicatorTitle(props) {
  if (props.isUploaded) {
    return props.i18n('uploadComplete');
  }

  if (props.error) {
    return props.i18n('retryUpload');
  }

  if (props.resumableUploads) {
    if (props.file.isPaused) {
      return props.i18n('resumeUpload');
    }

    return props.i18n('pauseUpload');
  } else if (props.individualCancellation) {
    return props.i18n('cancelUpload');
  }

  return '';
}

module.exports = function FileProgress(props) {
  if (props.hideRetryButton && props.error) {
    return h("div", {
      class: "uppy-DashboardItem-progress"
    });
  } else if (props.isUploaded || props.hidePauseResumeCancelButtons && !props.error) {
    return h("div", {
      class: "uppy-DashboardItem-progress"
    }, h("div", {
      class: "uppy-DashboardItem-progressIndicator"
    }, h(PauseResumeCancelIcon, {
      progress: props.file.progress.percentage,
      hidePauseResumeCancelButtons: props.hidePauseResumeCancelButtons
    })));
  } else {
    return h("div", {
      class: "uppy-DashboardItem-progress"
    }, h("button", {
      class: "uppy-u-reset uppy-DashboardItem-progressIndicator",
      type: "button",
      "aria-label": progressIndicatorTitle(props),
      title: progressIndicatorTitle(props),
      onclick: function onclick() {
        return onPauseResumeCancelRetry(props);
      }
    }, props.error ? props.hideRetryButton ? null : iconRetry() : h(PauseResumeCancelIcon, {
      progress: props.file.progress.percentage,
      hidePauseResumeCancelButtons: props.hidePauseResumeCancelButtons
    })));
  }
};
},{"../../icons":26,"./PauseResumeCancelIcon":19,"preact":116}],21:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _require = require('preact'),
    h = _require.h;

var classNames = require('classnames');

var pure = require('../../utils/pure');

var FilePreviewAndLink = require('./FilePreviewAndLink');

var FileProgress = require('./FileProgress');

var FileInfo = require('./FileInfo');

var Buttons = require('./Buttons');

module.exports = pure(function FileItem(props) {
  var file = props.file;
  var isProcessing = file.progress.preprocess || file.progress.postprocess;
  var isUploaded = file.progress.uploadComplete && !isProcessing && !file.error;
  var uploadInProgressOrComplete = file.progress.uploadStarted || isProcessing;
  var uploadInProgress = file.progress.uploadStarted && !file.progress.uploadComplete || isProcessing;
  var isPaused = file.isPaused || false;
  var error = file.error || false;
  var showRemoveButton = props.individualCancellation ? !isUploaded : !uploadInProgress && !isUploaded;
  var dashboardItemClass = classNames('uppy-u-reset', 'uppy-DashboardItem', {
    'is-inprogress': uploadInProgress
  }, {
    'is-processing': isProcessing
  }, {
    'is-complete': isUploaded
  }, {
    'is-paused': isPaused
  }, {
    'is-error': !!error
  }, {
    'is-resumable': props.resumableUploads
  }, {
    'is-noIndividualCancellation': !props.individualCancellation
  });
  return h("li", {
    class: dashboardItemClass,
    id: "uppy_" + file.id
  }, h("div", {
    class: "uppy-DashboardItem-preview"
  }, h(FilePreviewAndLink, {
    file: file,
    showLinkToFileUploadResult: props.showLinkToFileUploadResult
  }), h(FileProgress, _extends({}, props, {
    file: file,
    error: error,
    isUploaded: isUploaded
  }))), h("div", {
    class: "uppy-DashboardItem-fileInfoAndButtons"
  }, h(FileInfo, {
    file: file,
    id: props.id,
    acquirers: props.acquirers,
    containerWidth: props.containerWidth,
    i18n: props.i18n
  }), h(Buttons, {
    file: file,
    metaFields: props.metaFields,
    showLinkToFileUploadResult: props.showLinkToFileUploadResult,
    showRemoveButton: showRemoveButton,
    uploadInProgressOrComplete: uploadInProgressOrComplete,
    removeFile: props.removeFile,
    toggleFileCard: props.toggleFileCard,
    i18n: props.i18n,
    log: props.log,
    info: props.info
  })));
});
},{"../../utils/pure":33,"./Buttons":16,"./FileInfo":17,"./FilePreviewAndLink":18,"./FileProgress":20,"classnames":103,"preact":116}],22:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var FileItem = require('./FileItem/index.js');

var classNames = require('classnames');

var _require = require('preact'),
    h = _require.h;

module.exports = function (props) {
  var noFiles = props.totalFileCount === 0;
  var dashboardFilesClass = classNames('uppy-Dashboard-files', {
    'uppy-Dashboard-files--noFiles': noFiles
  });
  var fileProps = {
    // FIXME This is confusing, it's actually the Dashboard's plugin ID
    id: props.id,
    error: props.error,
    // TODO move this to context
    i18n: props.i18n,
    log: props.log,
    info: props.info,
    // features
    acquirers: props.acquirers,
    resumableUploads: props.resumableUploads,
    individualCancellation: props.individualCancellation,
    // visual options
    hideRetryButton: props.hideRetryButton,
    hidePauseResumeCancelButtons: props.hidePauseResumeCancelButtons,
    showLinkToFileUploadResult: props.showLinkToFileUploadResult,
    isWide: props.isWide,
    metaFields: props.metaFields,
    // callbacks
    retryUpload: props.retryUpload,
    pauseUpload: props.pauseUpload,
    cancelUpload: props.cancelUpload,
    toggleFileCard: props.toggleFileCard,
    removeFile: props.removeFile
  };
  return h("ul", {
    class: dashboardFilesClass // making <ul> not focusable for firefox
    ,
    tabindex: "-1"
  }, Object.keys(props.files).map(function (fileID) {
    return h(FileItem, _extends({
      key: fileID
    }, fileProps, {
      file: props.files[fileID]
    }));
  }));
};
},{"./FileItem/index.js":21,"classnames":103,"preact":116}],23:[function(require,module,exports){
var getFileTypeIcon = require('../utils/getFileTypeIcon');

var _require = require('preact'),
    h = _require.h;

module.exports = function FilePreview(props) {
  var file = props.file;

  if (file.preview) {
    return h("img", {
      class: "uppy-DashboardItem-previewImg",
      alt: file.name,
      src: file.preview
    });
  }

  var _getFileTypeIcon = getFileTypeIcon(file.type),
      color = _getFileTypeIcon.color,
      icon = _getFileTypeIcon.icon;

  return h("div", {
    class: "uppy-DashboardItem-previewIconWrap"
  }, h("span", {
    class: "uppy-DashboardItem-previewIcon",
    style: {
      color: color
    }
  }, icon), h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-DashboardItem-previewIconBg",
    width: "58",
    height: "76",
    viewBox: "0 0 58 76"
  }, h("rect", {
    fill: "#FFF",
    width: "58",
    height: "76",
    rx: "3",
    "fill-rule": "evenodd"
  })));
};
},{"../utils/getFileTypeIcon":31,"preact":116}],24:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

var ignoreEvent = require('../utils/ignoreEvent.js');

function PickerPanelContent(props) {
  return h("div", {
    class: "uppy-DashboardContent-panel",
    role: "tabpanel",
    "data-uppy-panelType": "PickerPanel",
    id: "uppy-DashboardContent-panel--" + props.activePickerPanel.id,
    onDragOver: ignoreEvent,
    onDragLeave: ignoreEvent,
    onDrop: ignoreEvent,
    onPaste: ignoreEvent
  }, h("div", {
    class: "uppy-DashboardContent-bar"
  }, h("div", {
    class: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "h1"
  }, props.i18n('importFrom', {
    name: props.activePickerPanel.name
  })), h("button", {
    class: "uppy-DashboardContent-back",
    type: "button",
    onclick: props.hideAllPanels
  }, props.i18n('done'))), h("div", {
    class: "uppy-DashboardContent-panelBody"
  }, props.getPlugin(props.activePickerPanel.id).render(props.state)));
}

module.exports = PickerPanelContent;
},{"../utils/ignoreEvent.js":32,"preact":116}],25:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

var _require2 = require('./icons'),
    iconPlus = _require2.iconPlus;

var uploadStates = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete',
  STATE_PAUSED: 'paused'
};

function getUploadingState(isAllErrored, isAllComplete, isAllPaused, files) {
  if (files === void 0) {
    files = {};
  }

  if (isAllErrored) {
    return uploadStates.STATE_ERROR;
  }

  if (isAllComplete) {
    return uploadStates.STATE_COMPLETE;
  }

  if (isAllPaused) {
    return uploadStates.STATE_PAUSED;
  }

  var state = uploadStates.STATE_WAITING;
  var fileIDs = Object.keys(files);

  for (var i = 0; i < fileIDs.length; i++) {
    var progress = files[fileIDs[i]].progress; // If ANY files are being uploaded right now, show the uploading state.

    if (progress.uploadStarted && !progress.uploadComplete) {
      return uploadStates.STATE_UPLOADING;
    } // If files are being preprocessed AND postprocessed at this time, we show the
    // preprocess state. If any files are being uploaded we show uploading.


    if (progress.preprocess && state !== uploadStates.STATE_UPLOADING) {
      state = uploadStates.STATE_PREPROCESSING;
    } // If NO files are being preprocessed or uploaded right now, but some files are
    // being postprocessed, show the postprocess state.


    if (progress.postprocess && state !== uploadStates.STATE_UPLOADING && state !== uploadStates.STATE_PREPROCESSING) {
      state = uploadStates.STATE_POSTPROCESSING;
    }
  }

  return state;
}

function UploadStatus(props) {
  var uploadingState = getUploadingState(props.isAllErrored, props.isAllComplete, props.isAllPaused, props.files);

  switch (uploadingState) {
    case 'uploading':
      return props.i18n('uploadingXFiles', {
        smart_count: props.inProgressNotPausedFiles.length
      });

    case 'preprocessing':
    case 'postprocessing':
      return props.i18n('processingXFiles', {
        smart_count: props.processingFiles.length
      });

    case 'paused':
      return props.i18n('uploadPaused');

    case 'waiting':
      return props.i18n('xFilesSelected', {
        smart_count: props.newFiles.length
      });

    case 'complete':
      return props.i18n('uploadComplete');
  }
}

function PanelTopBar(props) {
  var allowNewUpload = props.allowNewUpload; // TODO maybe this should be done in ../index.js, then just pass that down as `allowNewUpload`

  if (allowNewUpload && props.maxNumberOfFiles) {
    allowNewUpload = props.totalFileCount < props.maxNumberOfFiles;
  }

  return h("div", {
    class: "uppy-DashboardContent-bar"
  }, !props.isAllComplete ? h("button", {
    class: "uppy-DashboardContent-back",
    type: "button",
    onclick: props.cancelAll
  }, props.i18n('cancel')) : h("div", null), h("div", {
    class: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "h1"
  }, h(UploadStatus, props)), allowNewUpload ? h("button", {
    class: "uppy-DashboardContent-addMore",
    type: "button",
    "aria-label": props.i18n('addMoreFiles'),
    title: props.i18n('addMoreFiles'),
    onclick: function onclick() {
      return props.toggleAddFilesPanel(true);
    }
  }, iconPlus(), h("span", {
    class: "uppy-DashboardContent-addMoreCaption"
  }, props.i18n('addMore'))) : h("div", null));
}

module.exports = PanelTopBar;
},{"./icons":26,"preact":116}],26:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h; // https://css-tricks.com/creating-svg-icon-system-react/


function defaultPickerIcon() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "30",
    height: "30",
    viewBox: "0 0 30 30"
  }, h("path", {
    d: "M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15zm4.258-12.676v6.846h-8.426v-6.846H5.204l9.82-12.364 9.82 12.364H19.26z"
  }));
}

function iconCopy() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "51",
    height: "51",
    viewBox: "0 0 51 51"
  }, h("path", {
    d: "M17.21 45.765a5.394 5.394 0 0 1-7.62 0l-4.12-4.122a5.393 5.393 0 0 1 0-7.618l6.774-6.775-2.404-2.404-6.775 6.776c-3.424 3.427-3.424 9 0 12.426l4.12 4.123a8.766 8.766 0 0 0 6.216 2.57c2.25 0 4.5-.858 6.214-2.57l13.55-13.552a8.72 8.72 0 0 0 2.575-6.213 8.73 8.73 0 0 0-2.575-6.213l-4.123-4.12-2.404 2.404 4.123 4.12a5.352 5.352 0 0 1 1.58 3.81c0 1.438-.562 2.79-1.58 3.808l-13.55 13.55z"
  }), h("path", {
    d: "M44.256 2.858A8.728 8.728 0 0 0 38.043.283h-.002a8.73 8.73 0 0 0-6.212 2.574l-13.55 13.55a8.725 8.725 0 0 0-2.575 6.214 8.73 8.73 0 0 0 2.574 6.216l4.12 4.12 2.405-2.403-4.12-4.12a5.357 5.357 0 0 1-1.58-3.812c0-1.437.562-2.79 1.58-3.808l13.55-13.55a5.348 5.348 0 0 1 3.81-1.58c1.44 0 2.792.562 3.81 1.58l4.12 4.12c2.1 2.1 2.1 5.518 0 7.617L39.2 23.775l2.404 2.404 6.775-6.777c3.426-3.427 3.426-9 0-12.426l-4.12-4.12z"
  }));
}

function iconResume() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "25",
    height: "25",
    viewBox: "0 0 44 44"
  }, h("polygon", {
    class: "play",
    transform: "translate(6, 5.5)",
    points: "13 21.6666667 13 11 21 16.3333333"
  }));
}

function iconPause() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "25px",
    height: "25px",
    viewBox: "0 0 44 44"
  }, h("g", {
    transform: "translate(18, 17)",
    class: "pause"
  }, h("rect", {
    x: "0",
    y: "0",
    width: "2",
    height: "10",
    rx: "0"
  }), h("rect", {
    x: "6",
    y: "0",
    width: "2",
    height: "10",
    rx: "0"
  })));
}

function localIcon() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    fill: "#607d8b",
    width: "27",
    height: "25",
    viewBox: "0 0 27 25"
  }, h("path", {
    d: "M5.586 9.288a.313.313 0 0 0 .282.176h4.84v3.922c0 1.514 1.25 2.24 2.792 2.24 1.54 0 2.79-.726 2.79-2.24V9.464h4.84c.122 0 .23-.068.284-.176a.304.304 0 0 0-.046-.324L13.735.106a.316.316 0 0 0-.472 0l-7.63 8.857a.302.302 0 0 0-.047.325z"
  }), h("path", {
    d: "M24.3 5.093c-.218-.76-.54-1.187-1.208-1.187h-4.856l1.018 1.18h3.948l2.043 11.038h-7.193v2.728H9.114v-2.725h-7.36l2.66-11.04h3.33l1.018-1.18H3.907c-.668 0-1.06.46-1.21 1.186L0 16.456v7.062C0 24.338.676 25 1.51 25h23.98c.833 0 1.51-.663 1.51-1.482v-7.062L24.3 5.093z"
  }));
}

function iconRetry() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon retry",
    width: "28",
    height: "31",
    viewBox: "0 0 16 19"
  }, h("path", {
    d: "M16 11a8 8 0 1 1-8-8v2a6 6 0 1 0 6 6h2z"
  }), h("path", {
    d: "M7.9 3H10v2H7.9z"
  }), h("path", {
    d: "M8.536.5l3.535 3.536-1.414 1.414L7.12 1.914z"
  }), h("path", {
    d: "M10.657 2.621l1.414 1.415L8.536 7.57 7.12 6.157z"
  }));
}

function checkIcon() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon UppyIcon-check",
    width: "13",
    height: "9",
    viewBox: "0 0 13 9"
  }, h("polygon", {
    points: "5 7.293 1.354 3.647 0.646 4.354 5 8.707 12.354 1.354 11.646 0.647"
  }));
}

function iconAudio() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M9.5 18.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V7.25a.5.5 0 0 1 .379-.485l9-2.25A.5.5 0 0 1 18.5 5v11.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V8.67l-8 2v7.97zm8-11v-2l-8 2v2l8-2zM7 19.64c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1zm9-2c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1z",
    fill: "#049BCF",
    "fill-rule": "nonzero"
  }));
}

function iconVideo() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M16 11.834l4.486-2.691A1 1 0 0 1 22 10v6a1 1 0 0 1-1.514.857L16 14.167V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2.834zM15 9H5v8h10V9zm1 4l5 3v-6l-5 3z",
    fill: "#19AF67",
    "fill-rule": "nonzero"
  }));
}

function iconPDF() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M9.766 8.295c-.691-1.843-.539-3.401.747-3.726 1.643-.414 2.505.938 2.39 3.299-.039.79-.194 1.662-.537 3.148.324.49.66.967 1.055 1.51.17.231.382.488.629.757 1.866-.128 3.653.114 4.918.655 1.487.635 2.192 1.685 1.614 2.84-.566 1.133-1.839 1.084-3.416.249-1.141-.604-2.457-1.634-3.51-2.707a13.467 13.467 0 0 0-2.238.426c-1.392 4.051-4.534 6.453-5.707 4.572-.986-1.58 1.38-4.206 4.914-5.375.097-.322.185-.656.264-1.001.08-.353.306-1.31.407-1.737-.678-1.059-1.2-2.031-1.53-2.91zm2.098 4.87c-.033.144-.068.287-.104.427l.033-.01-.012.038a14.065 14.065 0 0 1 1.02-.197l-.032-.033.052-.004a7.902 7.902 0 0 1-.208-.271c-.197-.27-.38-.526-.555-.775l-.006.028-.002-.003c-.076.323-.148.632-.186.8zm5.77 2.978c1.143.605 1.832.632 2.054.187.26-.519-.087-1.034-1.113-1.473-.911-.39-2.175-.608-3.55-.608.845.766 1.787 1.459 2.609 1.894zM6.559 18.789c.14.223.693.16 1.425-.413.827-.648 1.61-1.747 2.208-3.206-2.563 1.064-4.102 2.867-3.633 3.62zm5.345-10.97c.088-1.793-.351-2.48-1.146-2.28-.473.119-.564 1.05-.056 2.405.213.566.52 1.188.908 1.859.18-.858.268-1.453.294-1.984z",
    fill: "#E2514A",
    "fill-rule": "nonzero"
  }));
}

function iconFile() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("g", {
    fill: "#A7AFB7",
    "fill-rule": "nonzero"
  }, h("path", {
    d: "M5.5 22a.5.5 0 0 1-.5-.5v-18a.5.5 0 0 1 .5-.5h10.719a.5.5 0 0 1 .367.16l3.281 3.556a.5.5 0 0 1 .133.339V21.5a.5.5 0 0 1-.5.5h-14zm.5-1h13V7.25L16 4H6v17z"
  }), h("path", {
    d: "M15 4v3a1 1 0 0 0 1 1h3V7h-3V4h-1z"
  })));
}

function iconText() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M4.5 7h13a.5.5 0 1 1 0 1h-13a.5.5 0 0 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z",
    fill: "#5A5E69",
    "fill-rule": "nonzero"
  }));
}

function iconCopyLink() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "14",
    height: "14",
    viewBox: "0 0 14 12"
  }, h("path", {
    d: "M7.94 7.703a2.613 2.613 0 0 1-.626 2.681l-.852.851a2.597 2.597 0 0 1-1.849.766A2.616 2.616 0 0 1 2.764 7.54l.852-.852a2.596 2.596 0 0 1 2.69-.625L5.267 7.099a1.44 1.44 0 0 0-.833.407l-.852.851a1.458 1.458 0 0 0 1.03 2.486c.39 0 .755-.152 1.03-.426l.852-.852c.231-.231.363-.522.406-.824l1.04-1.038zm4.295-5.937A2.596 2.596 0 0 0 10.387 1c-.698 0-1.355.272-1.849.766l-.852.851a2.614 2.614 0 0 0-.624 2.688l1.036-1.036c.041-.304.173-.6.407-.833l.852-.852c.275-.275.64-.426 1.03-.426a1.458 1.458 0 0 1 1.03 2.486l-.852.851a1.442 1.442 0 0 1-.824.406l-1.04 1.04a2.596 2.596 0 0 0 2.683-.628l.851-.85a2.616 2.616 0 0 0 0-3.697zm-6.88 6.883a.577.577 0 0 0 .82 0l3.474-3.474a.579.579 0 1 0-.819-.82L5.355 7.83a.579.579 0 0 0 0 .819z"
  }));
}

function iconPencil() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "14",
    height: "14",
    viewBox: "0 0 14 14"
  }, h("g", {
    "fill-rule": "evenodd"
  }, h("path", {
    d: "M1.5 10.793h2.793A1 1 0 0 0 5 10.5L11.5 4a1 1 0 0 0 0-1.414L9.707.793a1 1 0 0 0-1.414 0l-6.5 6.5A1 1 0 0 0 1.5 8v2.793zm1-1V8L9 1.5l1.793 1.793-6.5 6.5H2.5z",
    "fill-rule": "nonzero"
  }), h("rect", {
    x: "1",
    y: "12.293",
    width: "11",
    height: "1",
    rx: ".5"
  }), h("path", {
    "fill-rule": "nonzero",
    d: "M6.793 2.5L9.5 5.207l.707-.707L7.5 1.793z"
  })));
}

function iconCross() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "18",
    height: "18",
    viewBox: "0 0 18 18"
  }, h("path", {
    d: "M9 0C4.034 0 0 4.034 0 9s4.034 9 9 9 9-4.034 9-9-4.034-9-9-9z"
  }), h("path", {
    fill: "#FFF",
    d: "M13 12.222l-.778.778L9 9.778 5.778 13 5 12.222 8.222 9 5 5.778 5.778 5 9 8.222 12.222 5l.778.778L9.778 9z"
  }));
}

function iconPlus() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "15",
    height: "15",
    viewBox: "0 0 15 15"
  }, h("path", {
    d: "M8 6.5h6a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H8v6a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V8h-6a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h6v-6A.5.5 0 0 1 7 0h.5a.5.5 0 0 1 .5.5v6z"
  }));
}

module.exports = {
  defaultPickerIcon: defaultPickerIcon,
  iconCopy: iconCopy,
  iconResume: iconResume,
  iconPause: iconPause,
  iconRetry: iconRetry,
  localIcon: localIcon,
  checkIcon: checkIcon,
  iconAudio: iconAudio,
  iconVideo: iconVideo,
  iconPDF: iconPDF,
  iconFile: iconFile,
  iconText: iconText,
  iconCopyLink: iconCopyLink,
  iconPencil: iconPencil,
  iconCross: iconCross,
  iconPlus: iconPlus
};
},{"preact":116}],27:[function(require,module,exports){
var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var Translator = require('@uppy/utils/lib/Translator');

var DashboardUI = require('./components/Dashboard');

var StatusBar = require('@uppy/status-bar');

var Informer = require('@uppy/informer');

var ThumbnailGenerator = require('@uppy/thumbnail-generator');

var findAllDOMElements = require('@uppy/utils/lib/findAllDOMElements');

var toArray = require('@uppy/utils/lib/toArray');

var getDroppedFiles = require('@uppy/utils/lib/getDroppedFiles');

var trapFocus = require('./utils/trapFocus');

var cuid = require('cuid');

var ResizeObserver = require('resize-observer-polyfill').default || require('resize-observer-polyfill');

var _require2 = require('./components/icons'),
    defaultPickerIcon = _require2.defaultPickerIcon;

var createSuperFocus = require('./utils/createSuperFocus');

var memoize = require('memoize-one').default || require('memoize-one');

var TAB_KEY = 9;
var ESC_KEY = 27;

function createPromise() {
  var o = {};
  o.promise = new Promise(function (resolve, reject) {
    o.resolve = resolve;
    o.reject = reject;
  });
  return o;
}
/**
 * Dashboard UI with previews, metadata editing, tabs for various services and more
 */


module.exports = (_temp = _class =
/*#__PURE__*/
function (_Plugin) {
  _inheritsLoose(Dashboard, _Plugin);

  function Dashboard(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;

    _this.cancelUpload = function (fileID) {
      _this.uppy.removeFile(fileID);
    };

    _this.saveFileCard = function (meta, fileID) {
      _this.uppy.setFileMeta(fileID, meta);

      _this.toggleFileCard();
    };

    _this._attachRenderFunctionToTarget = function (target) {
      var plugin = _this.uppy.getPlugin(target.id);

      return _extends({}, target, {
        icon: plugin.icon || _this.opts.defaultPickerIcon,
        render: plugin.render
      });
    };

    _this._isTargetSupported = function (target) {
      var plugin = _this.uppy.getPlugin(target.id); // If the plugin does not provide a `supported` check, assume the plugin works everywhere.


      if (typeof plugin.isSupported !== 'function') {
        return true;
      }

      return plugin.isSupported();
    };

    _this._getAcquirers = memoize(function (targets) {
      return targets.filter(function (target) {
        return target.type === 'acquirer' && _this._isTargetSupported(target);
      }).map(_this._attachRenderFunctionToTarget);
    });
    _this._getProgressIndicators = memoize(function (targets) {
      return targets.filter(function (target) {
        return target.type === 'progressindicator';
      }).map(_this._attachRenderFunctionToTarget);
    });
    _this.id = _this.opts.id || 'Dashboard';
    _this.title = 'Dashboard';
    _this.type = 'orchestrator';
    _this.modalName = "uppy-Dashboard-" + cuid();
    _this.defaultLocale = {
      strings: {
        closeModal: 'Close Modal',
        importFrom: 'Import from %{name}',
        addingMoreFiles: 'Adding more files',
        addMoreFiles: 'Add more files',
        dashboardWindowTitle: 'File Uploader Window (Press escape to close)',
        dashboardTitle: 'File Uploader',
        copyLinkToClipboardSuccess: 'Link copied to clipboard',
        copyLinkToClipboardFallback: 'Copy the URL below',
        copyLink: 'Copy link',
        link: 'Link',
        fileSource: 'File source: %{name}',
        done: 'Done',
        back: 'Back',
        addMore: 'Add more',
        removeFile: 'Remove file',
        editFile: 'Edit file',
        editing: 'Editing %{file}',
        edit: 'Edit',
        finishEditingFile: 'Finish editing file',
        saveChanges: 'Save changes',
        cancel: 'Cancel',
        myDevice: 'My Device',
        dropPasteImport: 'Drop files here, paste, %{browse} or import from',
        dropPaste: 'Drop files here, paste or %{browse}',
        dropHint: 'Drop your files here',
        browse: 'browse',
        uploadComplete: 'Upload complete',
        uploadPaused: 'Upload paused',
        resumeUpload: 'Resume upload',
        pauseUpload: 'Pause upload',
        retryUpload: 'Retry upload',
        cancelUpload: 'Cancel upload',
        xFilesSelected: {
          0: '%{smart_count} file selected',
          1: '%{smart_count} files selected',
          2: '%{smart_count} files selected'
        },
        uploadingXFiles: {
          0: 'Uploading %{smart_count} file',
          1: 'Uploading %{smart_count} files',
          2: 'Uploading %{smart_count} files'
        },
        processingXFiles: {
          0: 'Processing %{smart_count} file',
          1: 'Processing %{smart_count} files',
          2: 'Processing %{smart_count} files'
        },
        poweredBy: 'Powered by'
      } // set default options

    };
    var defaultOptions = {
      target: 'body',
      metaFields: [],
      trigger: '#uppy-select-files',
      inline: false,
      width: 750,
      height: 550,
      thumbnailWidth: 280,
      waitForThumbnailsBeforeUpload: false,
      defaultPickerIcon: defaultPickerIcon,
      showLinkToFileUploadResult: true,
      showProgressDetails: false,
      hideUploadButton: false,
      hideRetryButton: false,
      hidePauseResumeCancelButtons: false,
      hideProgressAfterFinish: false,
      note: null,
      closeModalOnClickOutside: false,
      closeAfterFinish: false,
      disableStatusBar: false,
      disableInformer: false,
      disableThumbnailGenerator: false,
      disablePageScrollWhenModalOpen: true,
      animateOpenClose: true,
      proudlyDisplayPoweredByUppy: true,
      onRequestCloseModal: function onRequestCloseModal() {
        return _this.closeModal();
      },
      showSelectedFiles: true,
      browserBackButtonClose: false // merge default options with the ones set by user

    };
    _this.opts = _extends({}, defaultOptions, {}, opts);

    _this.i18nInit();

    _this.openModal = _this.openModal.bind(_assertThisInitialized(_this));
    _this.closeModal = _this.closeModal.bind(_assertThisInitialized(_this));
    _this.requestCloseModal = _this.requestCloseModal.bind(_assertThisInitialized(_this));
    _this.isModalOpen = _this.isModalOpen.bind(_assertThisInitialized(_this));
    _this.addTarget = _this.addTarget.bind(_assertThisInitialized(_this));
    _this.removeTarget = _this.removeTarget.bind(_assertThisInitialized(_this));
    _this.hideAllPanels = _this.hideAllPanels.bind(_assertThisInitialized(_this));
    _this.showPanel = _this.showPanel.bind(_assertThisInitialized(_this));
    _this.toggleFileCard = _this.toggleFileCard.bind(_assertThisInitialized(_this));
    _this.toggleAddFilesPanel = _this.toggleAddFilesPanel.bind(_assertThisInitialized(_this));
    _this.initEvents = _this.initEvents.bind(_assertThisInitialized(_this));
    _this.handlePopState = _this.handlePopState.bind(_assertThisInitialized(_this));
    _this.handleKeyDownInModal = _this.handleKeyDownInModal.bind(_assertThisInitialized(_this));
    _this.handleKeyDownInInline = _this.handleKeyDownInInline.bind(_assertThisInitialized(_this));
    _this.handleComplete = _this.handleComplete.bind(_assertThisInitialized(_this));
    _this.handleClickOutside = _this.handleClickOutside.bind(_assertThisInitialized(_this));
    _this.handlePaste = _this.handlePaste.bind(_assertThisInitialized(_this));
    _this.handlePasteOnBody = _this.handlePasteOnBody.bind(_assertThisInitialized(_this));
    _this.handleInputChange = _this.handleInputChange.bind(_assertThisInitialized(_this));
    _this.handleDragOver = _this.handleDragOver.bind(_assertThisInitialized(_this));
    _this.handleDragLeave = _this.handleDragLeave.bind(_assertThisInitialized(_this));
    _this.handleDrop = _this.handleDrop.bind(_assertThisInitialized(_this));
    _this.superFocusOnEachUpdate = _this.superFocusOnEachUpdate.bind(_assertThisInitialized(_this));
    _this.recordIfFocusedOnUppyRecently = _this.recordIfFocusedOnUppyRecently.bind(_assertThisInitialized(_this));
    _this.render = _this.render.bind(_assertThisInitialized(_this));
    _this.install = _this.install.bind(_assertThisInitialized(_this));
    _this.superFocus = createSuperFocus();
    _this.ifFocusedOnUppyRecently = false; // Timeouts

    _this.makeDashboardInsidesVisibleAnywayTimeout = null;
    _this.removeDragOverClassTimeout = null;
    return _this;
  }

  var _proto = Dashboard.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.i18nArray = this.translator.translateArray.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.removeTarget = function removeTarget(plugin) {
    var pluginState = this.getPluginState(); // filter out the one we want to remove

    var newTargets = pluginState.targets.filter(function (target) {
      return target.id !== plugin.id;
    });
    this.setPluginState({
      targets: newTargets
    });
  };

  _proto.addTarget = function addTarget(plugin) {
    var callerPluginId = plugin.id || plugin.constructor.name;
    var callerPluginName = plugin.title || callerPluginId;
    var callerPluginType = plugin.type;

    if (callerPluginType !== 'acquirer' && callerPluginType !== 'progressindicator' && callerPluginType !== 'presenter') {
      var msg = 'Dashboard: Modal can only be used by plugins of types: acquirer, progressindicator, presenter';
      this.uppy.log(msg, 'error');
      return;
    }

    var target = {
      id: callerPluginId,
      name: callerPluginName,
      type: callerPluginType
    };
    var state = this.getPluginState();
    var newTargets = state.targets.slice();
    newTargets.push(target);
    this.setPluginState({
      targets: newTargets
    });
    return this.el;
  };

  _proto.hideAllPanels = function hideAllPanels() {
    this.setPluginState({
      activePickerPanel: false,
      showAddFilesPanel: false,
      activeOverlayType: null
    });
  };

  _proto.showPanel = function showPanel(id) {
    var _this$getPluginState = this.getPluginState(),
        targets = _this$getPluginState.targets;

    var activePickerPanel = targets.filter(function (target) {
      return target.type === 'acquirer' && target.id === id;
    })[0];
    this.setPluginState({
      activePickerPanel: activePickerPanel,
      activeOverlayType: 'PickerPanel'
    });
  };

  _proto.openModal = function openModal() {
    var _this2 = this;

    var _createPromise = createPromise(),
        promise = _createPromise.promise,
        resolve = _createPromise.resolve; // save scroll position


    this.savedScrollPosition = window.pageYOffset; // save active element, so we can restore focus when modal is closed

    this.savedActiveElement = document.activeElement;

    if (this.opts.disablePageScrollWhenModalOpen) {
      document.body.classList.add('uppy-Dashboard-isFixed');
    }

    if (this.opts.animateOpenClose && this.getPluginState().isClosing) {
      var handler = function handler() {
        _this2.setPluginState({
          isHidden: false
        });

        _this2.el.removeEventListener('animationend', handler, false);

        resolve();
      };

      this.el.addEventListener('animationend', handler, false);
    } else {
      this.setPluginState({
        isHidden: false
      });
      resolve();
    }

    if (this.opts.browserBackButtonClose) {
      this.updateBrowserHistory();
    } // handle ESC and TAB keys in modal dialog


    document.addEventListener('keydown', this.handleKeyDownInModal);
    this.uppy.emit('dashboard:modal-open');
    return promise;
  };

  _proto.closeModal = function closeModal(opts) {
    var _this3 = this;

    if (opts === void 0) {
      opts = {};
    }

    var _opts = opts,
        _opts$manualClose = _opts.manualClose,
        manualClose = _opts$manualClose === void 0 ? true : _opts$manualClose;

    var _this$getPluginState2 = this.getPluginState(),
        isHidden = _this$getPluginState2.isHidden,
        isClosing = _this$getPluginState2.isClosing;

    if (isHidden || isClosing) {
      // short-circuit if animation is ongoing
      return;
    }

    var _createPromise2 = createPromise(),
        promise = _createPromise2.promise,
        resolve = _createPromise2.resolve;

    if (this.opts.disablePageScrollWhenModalOpen) {
      document.body.classList.remove('uppy-Dashboard-isFixed');
    }

    if (this.opts.animateOpenClose) {
      this.setPluginState({
        isClosing: true
      });

      var handler = function handler() {
        _this3.setPluginState({
          isHidden: true,
          isClosing: false
        });

        _this3.superFocus.cancel();

        _this3.savedActiveElement.focus();

        _this3.el.removeEventListener('animationend', handler, false);

        resolve();
      };

      this.el.addEventListener('animationend', handler, false);
    } else {
      this.setPluginState({
        isHidden: true
      });
      this.superFocus.cancel();
      this.savedActiveElement.focus();
      resolve();
    } // handle ESC and TAB keys in modal dialog


    document.removeEventListener('keydown', this.handleKeyDownInModal);

    if (manualClose) {
      if (this.opts.browserBackButtonClose) {
        // Make sure that the latest entry in the history state is our modal name
        if (history.state && history.state[this.modalName]) {
          // Go back in history to clear out the entry we created (ultimately closing the modal)
          history.go(-1);
        }
      }
    }

    this.uppy.emit('dashboard:modal-closed');
    return promise;
  };

  _proto.isModalOpen = function isModalOpen() {
    return !this.getPluginState().isHidden || false;
  };

  _proto.requestCloseModal = function requestCloseModal() {
    if (this.opts.onRequestCloseModal) {
      return this.opts.onRequestCloseModal();
    }

    return this.closeModal();
  };

  _proto.toggleFileCard = function toggleFileCard(fileId) {
    if (fileId) {
      this.uppy.emit('dashboard:file-edit-start');
    } else {
      this.uppy.emit('dashboard:file-edit-complete');
    }

    this.setPluginState({
      fileCardFor: fileId || null,
      activeOverlayType: fileId ? 'FileCard' : null
    });
  };

  _proto.toggleAddFilesPanel = function toggleAddFilesPanel(show) {
    this.setPluginState({
      showAddFilesPanel: show,
      activeOverlayType: show ? 'AddFiles' : null
    });
  };

  _proto.addFile = function addFile(file) {
    try {
      this.uppy.addFile({
        source: this.id,
        name: file.name,
        type: file.type,
        data: file,
        meta: {
          // path of the file relative to the ancestor directory the user selected.
          // e.g. 'docs/Old Prague/airbnb.pdf'
          relativePath: file.relativePath || null
        }
      });
    } catch (err) {
      if (!err.isRestriction) {
        this.uppy.log(err);
      }
    }
  } // ___Why make insides of Dashboard invisible until first ResizeObserver event is emitted?
  //    ResizeOberserver doesn't emit the first resize event fast enough, users can see the jump from one .uppy-size-- to another (e.g. in Safari)
  // ___Why not apply visibility property to .uppy-Dashboard-inner?
  //    Because ideally, acc to specs, ResizeObserver should see invisible elements as of width 0. So even though applying invisibility to .uppy-Dashboard-inner works now, it may not work in the future.
  ;

  _proto.startListeningToResize = function startListeningToResize() {
    var _this4 = this;

    // Watch for Dashboard container (`.uppy-Dashboard-inner`) resize
    // and update containerWidth/containerHeight in plugin state accordingly.
    // Emits first event on initialization.
    this.resizeObserver = new ResizeObserver(function (entries, observer) {
      var uppyDashboardInnerEl = entries[0];
      var _uppyDashboardInnerEl = uppyDashboardInnerEl.contentRect,
          width = _uppyDashboardInnerEl.width,
          height = _uppyDashboardInnerEl.height;

      _this4.uppy.log("[Dashboard] resized: " + width + " / " + height, 'debug');

      _this4.setPluginState({
        containerWidth: width,
        containerHeight: height,
        areInsidesReadyToBeVisible: true
      });
    });
    this.resizeObserver.observe(this.el.querySelector('.uppy-Dashboard-inner')); // If ResizeObserver fails to emit an event telling us what size to use - default to the mobile view

    this.makeDashboardInsidesVisibleAnywayTimeout = setTimeout(function () {
      var pluginState = _this4.getPluginState();

      var isModalAndClosed = !_this4.opts.inline && pluginState.isHidden;

      if ( // if ResizeObserver hasn't yet fired,
      !pluginState.areInsidesReadyToBeVisible && // and it's not due to the modal being closed
      !isModalAndClosed) {
        _this4.uppy.log("[Dashboard] resize event didn't fire on time: defaulted to mobile layout", 'debug');

        _this4.setPluginState({
          areInsidesReadyToBeVisible: true
        });
      }
    }, 1000);
  };

  _proto.stopListeningToResize = function stopListeningToResize() {
    this.resizeObserver.disconnect();
    clearTimeout(this.makeDashboardInsidesVisibleAnywayTimeout);
  } // Records whether we have been interacting with uppy right now, which is then used to determine whether state updates should trigger a refocusing.
  ;

  _proto.recordIfFocusedOnUppyRecently = function recordIfFocusedOnUppyRecently(event) {
    if (this.el.contains(event.target)) {
      this.ifFocusedOnUppyRecently = true;
    } else {
      this.ifFocusedOnUppyRecently = false; // ___Why run this.superFocus.cancel here when it already runs in superFocusOnEachUpdate?
      //    Because superFocus is debounced, when we move from Uppy to some other element on the page,
      //    previously run superFocus sometimes hits and moves focus back to Uppy.

      this.superFocus.cancel();
    }
  };

  _proto.updateBrowserHistory = function updateBrowserHistory() {
    // Ensure history state does not already contain our modal name to avoid double-pushing
    if (!history.state || !history.state[this.modalName]) {
      var _extends2;

      // Push to history so that the page is not lost on browser back button press
      history.pushState(_extends({}, history.state, (_extends2 = {}, _extends2[this.modalName] = true, _extends2)), '');
    } // Listen for back button presses


    window.addEventListener('popstate', this.handlePopState, false);
  };

  _proto.handlePopState = function handlePopState(event) {
    // Close the modal if the history state no longer contains our modal name
    if (this.isModalOpen() && (!event.state || !event.state[this.modalName])) {
      this.closeModal({
        manualClose: false
      });
    } // When the browser back button is pressed and uppy is now the latest entry in the history but the modal is closed, fix the history by removing the uppy history entry
    // This occurs when another entry is added into the history state while the modal is open, and then the modal gets manually closed
    // Solves PR #575 (https://github.com/transloadit/uppy/pull/575)


    if (!this.isModalOpen() && event.state && event.state[this.modalName]) {
      history.go(-1);
    }
  };

  _proto.handleKeyDownInModal = function handleKeyDownInModal(event) {
    // close modal on esc key press
    if (event.keyCode === ESC_KEY) this.requestCloseModal(event); // trap focus on tab key press

    if (event.keyCode === TAB_KEY) trapFocus.forModal(event, this.getPluginState().activeOverlayType, this.el);
  };

  _proto.handleClickOutside = function handleClickOutside() {
    if (this.opts.closeModalOnClickOutside) this.requestCloseModal();
  };

  _proto.handlePaste = function handlePaste(event) {
    var _this5 = this;

    // 1. Let any acquirer plugin (Url/Webcam/etc.) handle pastes to the root
    this.uppy.iteratePlugins(function (plugin) {
      if (plugin.type === 'acquirer') {
        // Every Plugin with .type acquirer can define handleRootPaste(event)
        plugin.handleRootPaste && plugin.handleRootPaste(event);
      }
    }); // 2. Add all dropped files

    var files = toArray(event.clipboardData.files);
    files.forEach(function (file) {
      _this5.uppy.log('[Dashboard] File pasted');

      _this5.addFile(file);
    });
  };

  _proto.handleInputChange = function handleInputChange(event) {
    var _this6 = this;

    event.preventDefault();
    var files = toArray(event.target.files);
    files.forEach(function (file) {
      return _this6.addFile(file);
    });
  };

  _proto.handleDragOver = function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.removeDragOverClassTimeout);
    this.setPluginState({
      isDraggingOver: true
    });
  };

  _proto.handleDragLeave = function handleDragLeave(event) {
    var _this7 = this;

    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.removeDragOverClassTimeout); // Timeout against flickering, this solution is taken from drag-drop library. Solution with 'pointer-events: none' didn't work across browsers.

    this.removeDragOverClassTimeout = setTimeout(function () {
      _this7.setPluginState({
        isDraggingOver: false
      });
    }, 50);
  };

  _proto.handleDrop = function handleDrop(event, dropCategory) {
    var _this8 = this;

    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.removeDragOverClassTimeout); // 1. Add a small (+) icon on drop

    event.dataTransfer.dropEffect = 'copy'; // 2. Remove dragover class

    this.setPluginState({
      isDraggingOver: false
    }); // 3. Let any acquirer plugin (Url/Webcam/etc.) handle drops to the root

    this.uppy.iteratePlugins(function (plugin) {
      if (plugin.type === 'acquirer') {
        // Every Plugin with .type acquirer can define handleRootDrop(event)
        plugin.handleRootDrop && plugin.handleRootDrop(event);
      }
    }); // 4. Add all dropped files

    var executedDropErrorOnce = false;

    var logDropError = function logDropError(error) {
      _this8.uppy.log(error, 'error'); // In practice all drop errors are most likely the same, so let's just show one to avoid overwhelming the user


      if (!executedDropErrorOnce) {
        _this8.uppy.info(error.message, 'error');

        executedDropErrorOnce = true;
      }
    };

    getDroppedFiles(event.dataTransfer, {
      logDropError: logDropError
    }).then(function (files) {
      if (files.length > 0) {
        _this8.uppy.log('[Dashboard] Files were dropped');

        files.forEach(function (file) {
          return _this8.addFile(file);
        });
      }
    });
  };

  _proto.handleKeyDownInInline = function handleKeyDownInInline(event) {
    // Trap focus on tab key press.
    if (event.keyCode === TAB_KEY) trapFocus.forInline(event, this.getPluginState().activeOverlayType, this.el);
  } // ___Why do we listen to the 'paste' event on a document instead of onPaste={props.handlePaste} prop, or this.el.addEventListener('paste')?
  //    Because (at least) Chrome doesn't handle paste if focus is on some button, e.g. 'My Device'.
  //    => Therefore, the best option is to listen to all 'paste' events, and only react to them when we are focused on our particular Uppy instance.
  // ___Why do we still need onPaste={props.handlePaste} for the DashboardUi?
  //    Because if we click on the 'Drop files here' caption e.g., `document.activeElement` will be 'body'. Which means our standard determination of whether we're pasting into our Uppy instance won't work.
  //    => Therefore, we need a traditional onPaste={props.handlePaste} handler too.
  ;

  _proto.handlePasteOnBody = function handlePasteOnBody(event) {
    var isFocusInOverlay = this.el.contains(document.activeElement);

    if (isFocusInOverlay) {
      this.handlePaste(event);
    }
  };

  _proto.handleComplete = function handleComplete(_ref) {
    var failed = _ref.failed,
        uploadID = _ref.uploadID;

    if (this.opts.closeAfterFinish && failed.length === 0) {
      // All uploads are done
      this.requestCloseModal();
    }
  };

  _proto.initEvents = function initEvents() {
    var _this9 = this;

    // Modal open button
    var showModalTrigger = findAllDOMElements(this.opts.trigger);

    if (!this.opts.inline && showModalTrigger) {
      showModalTrigger.forEach(function (trigger) {
        return trigger.addEventListener('click', _this9.openModal);
      });
    }

    if (!this.opts.inline && !showModalTrigger) {
      this.uppy.log('Dashboard modal trigger not found. Make sure `trigger` is set in Dashboard options unless you are planning to call openModal() method yourself', 'error');
    }

    this.startListeningToResize();
    document.addEventListener('paste', this.handlePasteOnBody);
    this.uppy.on('plugin-remove', this.removeTarget);
    this.uppy.on('file-added', this.hideAllPanels);
    this.uppy.on('dashboard:modal-closed', this.hideAllPanels);
    this.uppy.on('complete', this.handleComplete); // ___Why fire on capture?
    //    Because this.ifFocusedOnUppyRecently needs to change before onUpdate() fires.

    document.addEventListener('focus', this.recordIfFocusedOnUppyRecently, true);
    document.addEventListener('click', this.recordIfFocusedOnUppyRecently, true);

    if (this.opts.inline) {
      this.el.addEventListener('keydown', this.handleKeyDownInInline);
    }
  };

  _proto.removeEvents = function removeEvents() {
    var _this10 = this;

    var showModalTrigger = findAllDOMElements(this.opts.trigger);

    if (!this.opts.inline && showModalTrigger) {
      showModalTrigger.forEach(function (trigger) {
        return trigger.removeEventListener('click', _this10.openModal);
      });
    }

    this.stopListeningToResize();
    document.removeEventListener('paste', this.handlePasteOnBody);
    window.removeEventListener('popstate', this.handlePopState, false);
    this.uppy.off('plugin-remove', this.removeTarget);
    this.uppy.off('file-added', this.hideAllPanels);
    this.uppy.off('dashboard:modal-closed', this.hideAllPanels);
    this.uppy.off('complete', this.handleComplete);
    document.removeEventListener('focus', this.recordIfFocusedOnUppyRecently);
    document.removeEventListener('click', this.recordIfFocusedOnUppyRecently);

    if (this.opts.inline) {
      this.el.removeEventListener('keydown', this.handleKeyDownInInline);
    }
  };

  _proto.superFocusOnEachUpdate = function superFocusOnEachUpdate() {
    var isFocusInUppy = this.el.contains(document.activeElement); // When focus is lost on the page (== focus is on body for most browsers, or focus is null for IE11)

    var isFocusNowhere = document.activeElement === document.querySelector('body') || document.activeElement === null;
    var isInformerHidden = this.uppy.getState().info.isHidden;
    var isModal = !this.opts.inline;

    if ( // If update is connected to showing the Informer - let the screen reader calmly read it.
    isInformerHidden && ( // If we are in a modal - always superfocus without concern for other elements on the page (user is unlikely to want to interact with the rest of the page)
    isModal || // If we are already inside of Uppy, or
    isFocusInUppy || // If we are not focused on anything BUT we have already, at least once, focused on uppy
    //   1. We focus when isFocusNowhere, because when the element we were focused on disappears (e.g. an overlay), - focus gets lost. If user is typing something somewhere else on the page, - focus won't be 'nowhere'.
    //   2. We only focus when focus is nowhere AND this.ifFocusedOnUppyRecently, to avoid focus jumps if we do something else on the page.
    //   [Practical check] Without '&& this.ifFocusedOnUppyRecently', in Safari, in inline mode, when file is uploading, - navigate via tab to the checkbox, try to press space multiple times. Focus will jump to Uppy.
    isFocusNowhere && this.ifFocusedOnUppyRecently)) {
      this.superFocus(this.el, this.getPluginState().activeOverlayType);
    } else {
      this.superFocus.cancel();
    }
  };

  _proto.afterUpdate = function afterUpdate() {
    this.superFocusOnEachUpdate();
  };

  _proto.render = function render(state) {
    var pluginState = this.getPluginState();
    var files = state.files,
        capabilities = state.capabilities,
        allowNewUpload = state.allowNewUpload; // TODO: move this to Core, to share between Status Bar and Dashboard
    // (and any other plugin that might need it, too)

    var newFiles = Object.keys(files).filter(function (file) {
      return !files[file].progress.uploadStarted;
    });
    var uploadStartedFiles = Object.keys(files).filter(function (file) {
      return files[file].progress.uploadStarted;
    });
    var pausedFiles = Object.keys(files).filter(function (file) {
      return files[file].isPaused;
    });
    var completeFiles = Object.keys(files).filter(function (file) {
      return files[file].progress.uploadComplete;
    });
    var erroredFiles = Object.keys(files).filter(function (file) {
      return files[file].error;
    });
    var inProgressFiles = Object.keys(files).filter(function (file) {
      return !files[file].progress.uploadComplete && files[file].progress.uploadStarted;
    });
    var inProgressNotPausedFiles = inProgressFiles.filter(function (file) {
      return !files[file].isPaused;
    });
    var processingFiles = Object.keys(files).filter(function (file) {
      return files[file].progress.preprocess || files[file].progress.postprocess;
    });
    var isUploadStarted = uploadStartedFiles.length > 0;
    var isAllComplete = state.totalProgress === 100 && completeFiles.length === Object.keys(files).length && processingFiles.length === 0;
    var isAllErrored = isUploadStarted && erroredFiles.length === uploadStartedFiles.length;
    var isAllPaused = inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length;

    var acquirers = this._getAcquirers(pluginState.targets);

    var progressindicators = this._getProgressIndicators(pluginState.targets);

    return DashboardUI({
      state: state,
      isHidden: pluginState.isHidden,
      files: files,
      newFiles: newFiles,
      uploadStartedFiles: uploadStartedFiles,
      completeFiles: completeFiles,
      erroredFiles: erroredFiles,
      inProgressFiles: inProgressFiles,
      inProgressNotPausedFiles: inProgressNotPausedFiles,
      processingFiles: processingFiles,
      isUploadStarted: isUploadStarted,
      isAllComplete: isAllComplete,
      isAllErrored: isAllErrored,
      isAllPaused: isAllPaused,
      totalFileCount: Object.keys(files).length,
      totalProgress: state.totalProgress,
      allowNewUpload: allowNewUpload,
      acquirers: acquirers,
      activePickerPanel: pluginState.activePickerPanel,
      animateOpenClose: this.opts.animateOpenClose,
      isClosing: pluginState.isClosing,
      getPlugin: this.uppy.getPlugin,
      progressindicators: progressindicators,
      autoProceed: this.uppy.opts.autoProceed,
      id: this.id,
      closeModal: this.requestCloseModal,
      handleClickOutside: this.handleClickOutside,
      handleInputChange: this.handleInputChange,
      handlePaste: this.handlePaste,
      inline: this.opts.inline,
      showPanel: this.showPanel,
      hideAllPanels: this.hideAllPanels,
      log: this.uppy.log,
      i18n: this.i18n,
      i18nArray: this.i18nArray,
      addFile: this.uppy.addFile,
      removeFile: this.uppy.removeFile,
      info: this.uppy.info,
      note: this.opts.note,
      metaFields: pluginState.metaFields,
      resumableUploads: capabilities.resumableUploads || false,
      individualCancellation: capabilities.individualCancellation,
      pauseUpload: this.uppy.pauseResume,
      retryUpload: this.uppy.retryUpload,
      cancelUpload: this.cancelUpload,
      cancelAll: this.uppy.cancelAll,
      fileCardFor: pluginState.fileCardFor,
      toggleFileCard: this.toggleFileCard,
      toggleAddFilesPanel: this.toggleAddFilesPanel,
      showAddFilesPanel: pluginState.showAddFilesPanel,
      saveFileCard: this.saveFileCard,
      width: this.opts.width,
      height: this.opts.height,
      showLinkToFileUploadResult: this.opts.showLinkToFileUploadResult,
      proudlyDisplayPoweredByUppy: this.opts.proudlyDisplayPoweredByUppy,
      containerWidth: pluginState.containerWidth,
      areInsidesReadyToBeVisible: pluginState.areInsidesReadyToBeVisible,
      isTargetDOMEl: this.isTargetDOMEl,
      parentElement: this.el,
      allowedFileTypes: this.uppy.opts.restrictions.allowedFileTypes,
      maxNumberOfFiles: this.uppy.opts.restrictions.maxNumberOfFiles,
      showSelectedFiles: this.opts.showSelectedFiles,
      // drag props
      isDraggingOver: pluginState.isDraggingOver,
      handleDragOver: this.handleDragOver,
      handleDragLeave: this.handleDragLeave,
      handleDrop: this.handleDrop
    });
  };

  _proto.discoverProviderPlugins = function discoverProviderPlugins() {
    var _this11 = this;

    this.uppy.iteratePlugins(function (plugin) {
      if (plugin && !plugin.target && plugin.opts && plugin.opts.target === _this11.constructor) {
        _this11.addTarget(plugin);
      }
    });
  };

  _proto.install = function install() {
    var _this12 = this;

    // Set default state for Dashboard
    this.setPluginState({
      isHidden: true,
      fileCardFor: null,
      activeOverlayType: null,
      showAddFilesPanel: false,
      activePickerPanel: false,
      metaFields: this.opts.metaFields,
      targets: [],
      // We'll make them visible once .containerWidth is determined
      areInsidesReadyToBeVisible: false,
      isDraggingOver: false
    });
    var _this$opts = this.opts,
        inline = _this$opts.inline,
        closeAfterFinish = _this$opts.closeAfterFinish;

    if (inline && closeAfterFinish) {
      throw new Error('[Dashboard] `closeAfterFinish: true` cannot be used on an inline Dashboard, because an inline Dashboard cannot be closed at all. Either set `inline: false`, or disable the `closeAfterFinish` option.');
    }

    var allowMultipleUploads = this.uppy.opts.allowMultipleUploads;

    if (allowMultipleUploads && closeAfterFinish) {
      this.uppy.log('[Dashboard] When using `closeAfterFinish`, we recommended setting the `allowMultipleUploads` option to `false` in the Uppy constructor. See https://uppy.io/docs/uppy/#allowMultipleUploads-true', 'warning');
    }

    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }

    var plugins = this.opts.plugins || [];
    plugins.forEach(function (pluginID) {
      var plugin = _this12.uppy.getPlugin(pluginID);

      if (plugin) {
        plugin.mount(_this12, plugin);
      }
    });

    if (!this.opts.disableStatusBar) {
      this.uppy.use(StatusBar, {
        id: this.id + ":StatusBar",
        target: this,
        hideUploadButton: this.opts.hideUploadButton,
        hideRetryButton: this.opts.hideRetryButton,
        hidePauseResumeButton: this.opts.hidePauseResumeButton,
        hideCancelButton: this.opts.hideCancelButton,
        showProgressDetails: this.opts.showProgressDetails,
        hideAfterFinish: this.opts.hideProgressAfterFinish,
        locale: this.opts.locale
      });
    }

    if (!this.opts.disableInformer) {
      this.uppy.use(Informer, {
        id: this.id + ":Informer",
        target: this
      });
    }

    if (!this.opts.disableThumbnailGenerator) {
      this.uppy.use(ThumbnailGenerator, {
        id: this.id + ":ThumbnailGenerator",
        thumbnailWidth: this.opts.thumbnailWidth,
        waitForThumbnailsBeforeUpload: this.opts.waitForThumbnailsBeforeUpload
      });
    }

    this.discoverProviderPlugins();
    this.initEvents();
  };

  _proto.uninstall = function uninstall() {
    var _this13 = this;

    if (!this.opts.disableInformer) {
      var informer = this.uppy.getPlugin(this.id + ":Informer"); // Checking if this plugin exists, in case it was removed by uppy-core
      // before the Dashboard was.

      if (informer) this.uppy.removePlugin(informer);
    }

    if (!this.opts.disableStatusBar) {
      var statusBar = this.uppy.getPlugin(this.id + ":StatusBar");
      if (statusBar) this.uppy.removePlugin(statusBar);
    }

    if (!this.opts.disableThumbnailGenerator) {
      var thumbnail = this.uppy.getPlugin(this.id + ":ThumbnailGenerator");
      if (thumbnail) this.uppy.removePlugin(thumbnail);
    }

    var plugins = this.opts.plugins || [];
    plugins.forEach(function (pluginID) {
      var plugin = _this13.uppy.getPlugin(pluginID);

      if (plugin) plugin.unmount();
    });
    this.unmount();
    this.removeEvents();
  };

  return Dashboard;
}(Plugin), _class.VERSION = "1.5.0", _temp);
},{"./components/Dashboard":14,"./components/icons":26,"./utils/createSuperFocus":29,"./utils/trapFocus":34,"@uppy/core":9,"@uppy/informer":37,"@uppy/status-bar":56,"@uppy/thumbnail-generator":59,"@uppy/utils/lib/Translator":64,"@uppy/utils/lib/findAllDOMElements":68,"@uppy/utils/lib/getDroppedFiles":72,"@uppy/utils/lib/toArray":94,"cuid":104,"memoize-one":112,"resize-observer-polyfill":117}],28:[function(require,module,exports){
/**
 * Copies text to clipboard by creating an almost invisible textarea,
 * adding text there, then running execCommand('copy').
 * Falls back to prompt() when the easy way fails (hello, Safari!)
 * From http://stackoverflow.com/a/30810322
 *
 * @param {string} textToCopy
 * @param {string} fallbackString
 * @returns {Promise}
 */
module.exports = function copyToClipboard(textToCopy, fallbackString) {
  fallbackString = fallbackString || 'Copy the URL below';
  return new Promise(function (resolve) {
    var textArea = document.createElement('textarea');
    textArea.setAttribute('style', {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '2em',
      height: '2em',
      padding: 0,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent'
    });
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();

    var magicCopyFailed = function magicCopyFailed() {
      document.body.removeChild(textArea);
      window.prompt(fallbackString, textToCopy);
      resolve();
    };

    try {
      var successful = document.execCommand('copy');

      if (!successful) {
        return magicCopyFailed('copy command unavailable');
      }

      document.body.removeChild(textArea);
      return resolve();
    } catch (err) {
      document.body.removeChild(textArea);
      return magicCopyFailed(err);
    }
  });
};
},{}],29:[function(require,module,exports){
var debounce = require('lodash.debounce');

var FOCUSABLE_ELEMENTS = require('@uppy/utils/lib/FOCUSABLE_ELEMENTS');

var getActiveOverlayEl = require('./getActiveOverlayEl');
/*
  Focuses on some element in the currently topmost overlay.

  1. If there are some [data-uppy-super-focusable] elements rendered already - focuses on the first superfocusable element, and leaves focus up to the control of a user (until currently focused element disappears from the screen [which can happen when overlay changes, or, e.g., when we click on a folder in googledrive]).
  2. If there are no [data-uppy-super-focusable] elements yet (or ever) - focuses on the first focusable element, but switches focus if superfocusable elements appear on next render.
*/


module.exports = function createSuperFocus() {
  var lastFocusWasOnSuperFocusableEl = false;

  var superFocus = function superFocus(dashboardEl, activeOverlayType) {
    var overlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
    var isFocusInOverlay = overlayEl.contains(document.activeElement); // If focus is already in the topmost overlay, AND on last update we focused on the superfocusable element - then leave focus up to the user.
    // [Practical check] without this line, typing in the search input in googledrive overlay won't work.

    if (isFocusInOverlay && lastFocusWasOnSuperFocusableEl) return;
    var superFocusableEl = overlayEl.querySelector('[data-uppy-super-focusable]'); // If we are already in the topmost overlay, AND there are no super focusable elements yet, - leave focus up to the user.
    // [Practical check] without this line, if you are in an empty folder in google drive, and something's uploading in the bg, - focus will be jumping to Done all the time.

    if (isFocusInOverlay && !superFocusableEl) return;

    if (superFocusableEl) {
      superFocusableEl.focus({
        preventScroll: true
      });
      lastFocusWasOnSuperFocusableEl = true;
    } else {
      var firstEl = overlayEl.querySelector(FOCUSABLE_ELEMENTS);
      firstEl && firstEl.focus({
        preventScroll: true
      });
      lastFocusWasOnSuperFocusableEl = false;
    }
  }; // ___Why do we need to debounce?
  //    1. To deal with animations: overlay changes via animations, which results in the DOM updating AFTER plugin.update() already executed.
  //    [Practical check] without debounce, if we open the Url overlay, and click 'Done', Dashboard won't get focused again.
  //    [Practical check] if we delay 250ms instead of 260ms - IE11 won't get focused in same situation.
  //    2. Performance: there can be many state update()s in a second, and this function is called every time.


  return debounce(superFocus, 260);
};
},{"./getActiveOverlayEl":30,"@uppy/utils/lib/FOCUSABLE_ELEMENTS":61,"lodash.debounce":110}],30:[function(require,module,exports){
/**
 * @returns {HTMLElement} - either dashboard element, or the overlay that's most on top
 */
module.exports = function getActiveOverlayEl(dashboardEl, activeOverlayType) {
  if (activeOverlayType) {
    var overlayEl = dashboardEl.querySelector("[data-uppy-paneltype=\"" + activeOverlayType + "\"]"); // if an overlay is already mounted

    if (overlayEl) return overlayEl;
  }

  return dashboardEl;
};
},{}],31:[function(require,module,exports){
var _require = require('../components/icons'),
    iconFile = _require.iconFile,
    iconText = _require.iconText,
    iconAudio = _require.iconAudio,
    iconVideo = _require.iconVideo,
    iconPDF = _require.iconPDF;

module.exports = function getIconByMime(fileType) {
  var defaultChoice = {
    color: '#838999',
    icon: iconFile()
  };
  if (!fileType) return defaultChoice;
  var fileTypeGeneral = fileType.split('/')[0];
  var fileTypeSpecific = fileType.split('/')[1];

  if (fileTypeGeneral === 'text') {
    return {
      color: '#5a5e69',
      icon: iconText()
    };
  }

  if (fileTypeGeneral === 'audio') {
    return {
      color: '#068dbb',
      icon: iconAudio()
    };
  }

  if (fileTypeGeneral === 'video') {
    return {
      color: '#19af67',
      icon: iconVideo()
    };
  }

  if (fileTypeGeneral === 'application' && fileTypeSpecific === 'pdf') {
    return {
      color: '#e25149',
      icon: iconPDF()
    };
  }

  if (fileTypeGeneral === 'image') {
    return {
      color: '#f2f2f2',
      icon: ''
    };
  }

  return defaultChoice;
};
},{"../components/icons":26}],32:[function(require,module,exports){
// ignore drop/paste events if they are not in input or textarea —
// otherwise when Url plugin adds drop/paste listeners to this.el,
// draging UI elements or pasting anything into any field triggers those events —
// Url treats them as URLs that need to be imported
function ignoreEvent(ev) {
  var tagName = ev.target.tagName;

  if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
    ev.stopPropagation();
    return;
  }

  ev.preventDefault();
  ev.stopPropagation();
}

module.exports = ignoreEvent;
},{}],33:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var shallowEqual = require('is-shallow-equal');

var _require = require('preact'),
    h = _require.h,
    Component = _require.Component;
/**
 * Higher order component that doesn't rerender an element if its props didn't change.
 */


module.exports = function pure(Inner) {
  return (
    /*#__PURE__*/
    function (_Component) {
      _inheritsLoose(Pure, _Component);

      function Pure() {
        return _Component.apply(this, arguments) || this;
      }

      var _proto = Pure.prototype;

      _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return !shallowEqual(this.props, nextProps);
      };

      _proto.render = function render() {
        // we have to clone this or Preact mutates it:
        // https://github.com/preactjs/preact/issues/836
        // TODO can be removed if we upgrade to Preact X
        var props = _extends({}, this.props);

        return h(Inner, props);
      };

      return Pure;
    }(Component)
  );
};
},{"is-shallow-equal":109,"preact":116}],34:[function(require,module,exports){
var toArray = require('@uppy/utils/lib/toArray');

var getActiveOverlayEl = require('./getActiveOverlayEl');

var FOCUSABLE_ELEMENTS = require('@uppy/utils/lib//FOCUSABLE_ELEMENTS');

function focusOnFirstNode(event, nodes) {
  var node = nodes[0];

  if (node) {
    node.focus();
    event.preventDefault();
  }
}

function focusOnLastNode(event, nodes) {
  var node = nodes[nodes.length - 1];

  if (node) {
    node.focus();
    event.preventDefault();
  }
} // ___Why not just use (focusedItemIndex === -1)?
//    Firefox thinks <ul> is focusable, but we don't have <ul>s in our FOCUSABLE_ELEMENTS. Which means that if we tab into the <ul>, code will think that we are not in the active overlay, and we should focusOnFirstNode() of the currently active overlay!
//    [Practical check] if we use (focusedItemIndex === -1), instagram provider in firefox will never get focus on its pics in the <ul>.


function isFocusInOverlay(activeOverlayEl) {
  return activeOverlayEl.contains(document.activeElement);
}

function trapFocus(event, activeOverlayType, dashboardEl) {
  var activeOverlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
  var focusableNodes = toArray(activeOverlayEl.querySelectorAll(FOCUSABLE_ELEMENTS));
  var focusedItemIndex = focusableNodes.indexOf(document.activeElement); // If we pressed tab, and focus is not yet within the current overlay - focus on the first element within the current overlay.
  // This is a safety measure (for when user returns from another tab e.g.), most plugins will try to focus on some important element as it loads.

  if (!isFocusInOverlay(activeOverlayEl)) {
    focusOnFirstNode(event, focusableNodes); // If we pressed shift + tab, and we're on the first element of a modal
  } else if (event.shiftKey && focusedItemIndex === 0) {
    focusOnLastNode(event, focusableNodes); // If we pressed tab, and we're on the last element of the modal
  } else if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
    focusOnFirstNode(event, focusableNodes);
  }
}

module.exports = {
  // Traps focus inside of the currently open overlay (e.g. Dashboard, or e.g. Instagram), never lets focus disappear from the modal.
  forModal: function forModal(event, activeOverlayType, dashboardEl) {
    trapFocus(event, activeOverlayType, dashboardEl);
  },
  // Traps focus inside of the currently open overlay, unless overlay is null - then let the user tab away.
  forInline: function forInline(event, activeOverlayType, dashboardEl) {
    // ___When we're in the bare 'Drop files here, paste, browse or import from' screen
    if (activeOverlayType === null) {// Do nothing and let the browser handle it, user can tab away from Uppy to other elements on the page
      // ___When there is some overlay with 'Done' button
    } else {
      // Trap the focus inside this overlay!
      // User can close the overlay (click 'Done') if they want to travel away from Uppy.
      trapFocus(event, activeOverlayType, dashboardEl);
    }
  }
};
},{"./getActiveOverlayEl":30,"@uppy/utils/lib//FOCUSABLE_ELEMENTS":61,"@uppy/utils/lib/toArray":94}],35:[function(require,module,exports){
/**
 * Truncates a string to the given number of chars (maxLength) by inserting '...' in the middle of that string.
 * Partially taken from https://stackoverflow.com/a/5723274/3192470.
 *
 * @param {string} string - string to be truncated
 * @param {number} maxLength - maximum size of the resulting string
 * @returns {string}
 */
module.exports = function truncateString(string, maxLength) {
  var separator = '...'; // Return original string if it's already shorter than maxLength

  if (string.length <= maxLength) {
    return string; // Return truncated substring without '...' if string can't be meaningfully truncated
  } else if (maxLength <= separator.length) {
    return string.substr(0, maxLength); // Return truncated string divided in half by '...'
  } else {
    var charsToShow = maxLength - separator.length;
    var frontChars = Math.ceil(charsToShow / 2);
    var backChars = Math.floor(charsToShow / 2);
    return string.substr(0, frontChars) + separator + string.substr(string.length - backChars);
  }
};
},{}],36:[function(require,module,exports){
var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var Translator = require('@uppy/utils/lib/Translator');

var toArray = require('@uppy/utils/lib/toArray');

var isDragDropSupported = require('@uppy/utils/lib/isDragDropSupported');

var getDroppedFiles = require('@uppy/utils/lib/getDroppedFiles');

var _require2 = require('preact'),
    h = _require2.h;
/**
 * Drag & Drop plugin
 *
 */


module.exports = (_temp = _class =
/*#__PURE__*/
function (_Plugin) {
  _inheritsLoose(DragDrop, _Plugin);

  function DragDrop(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.type = 'acquirer';
    _this.id = _this.opts.id || 'DragDrop';
    _this.title = 'Drag & Drop';
    _this.defaultLocale = {
      strings: {
        dropHereOr: 'Drop files here or %{browse}',
        browse: 'browse'
      } // Default options

    };
    var defaultOpts = {
      target: null,
      inputName: 'files[]',
      width: '100%',
      height: '100%',
      note: null // Merge default options with the ones set by user

    };
    _this.opts = _extends({}, defaultOpts, {}, opts); // Check for browser dragDrop support

    _this.isDragDropSupported = isDragDropSupported();
    _this.removeDragOverClassTimeout = null;

    _this.i18nInit(); // Bind `this` to class methods


    _this.handleInputChange = _this.handleInputChange.bind(_assertThisInitialized(_this));
    _this.handleDragOver = _this.handleDragOver.bind(_assertThisInitialized(_this));
    _this.handleDragLeave = _this.handleDragLeave.bind(_assertThisInitialized(_this));
    _this.handleDrop = _this.handleDrop.bind(_assertThisInitialized(_this));
    _this.addFile = _this.addFile.bind(_assertThisInitialized(_this));
    _this.render = _this.render.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = DragDrop.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.i18nArray = this.translator.translateArray.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.addFile = function addFile(file) {
    try {
      this.uppy.addFile({
        source: this.id,
        name: file.name,
        type: file.type,
        data: file,
        meta: {
          relativePath: file.relativePath || null
        }
      });
    } catch (err) {
      if (!err.isRestriction) {
        this.uppy.log(err);
      }
    }
  };

  _proto.handleInputChange = function handleInputChange(event) {
    this.uppy.log('[DragDrop] Files selected through input');
    var files = toArray(event.target.files);
    files.forEach(this.addFile); // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).

    event.target.value = null;
  };

  _proto.handleDrop = function handleDrop(event, dropCategory) {
    var _this2 = this;

    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.removeDragOverClassTimeout); // 1. Add a small (+) icon on drop

    event.dataTransfer.dropEffect = 'copy'; // 2. Remove dragover class

    this.setPluginState({
      isDraggingOver: false
    }); // 3. Add all dropped files

    this.uppy.log('[DragDrop] Files were dropped');

    var logDropError = function logDropError(error) {
      _this2.uppy.log(error, 'error');
    };

    getDroppedFiles(event.dataTransfer, {
      logDropError: logDropError
    }).then(function (files) {
      files.forEach(_this2.addFile);
    });
  };

  _proto.handleDragOver = function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.removeDragOverClassTimeout);
    this.setPluginState({
      isDraggingOver: true
    });
  };

  _proto.handleDragLeave = function handleDragLeave(event) {
    var _this3 = this;

    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.removeDragOverClassTimeout); // Timeout against flickering, this solution is taken from drag-drop library. Solution with 'pointer-events: none' didn't work across browsers.

    this.removeDragOverClassTimeout = setTimeout(function () {
      _this3.setPluginState({
        isDraggingOver: false
      });
    }, 50);
  };

  _proto.renderHiddenFileInput = function renderHiddenFileInput() {
    var _this4 = this;

    var restrictions = this.uppy.opts.restrictions;
    return h("input", {
      class: "uppy-DragDrop-input",
      type: "file",
      tabindex: -1,
      focusable: "false",
      ref: function ref(_ref) {
        _this4.fileInputRef = _ref;
      },
      name: this.opts.inputName,
      multiple: restrictions.maxNumberOfFiles !== 1,
      accept: restrictions.allowedFileTypes,
      onchange: this.handleInputChange
    });
  };

  _proto.renderArrowSvg = function renderArrowSvg() {
    return h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "UppyIcon uppy-DragDrop-arrow",
      width: "16",
      height: "16",
      viewBox: "0 0 16 16"
    }, h("path", {
      d: "M11 10V0H5v10H2l6 6 6-6h-3zm0 0",
      "fill-rule": "evenodd"
    }));
  };

  _proto.renderLabel = function renderLabel() {
    return h("div", {
      class: "uppy-DragDrop-label"
    }, this.i18nArray('dropHereOr', {
      browse: h("span", {
        class: "uppy-DragDrop-browse"
      }, this.i18n('browse'))
    }));
  };

  _proto.renderNote = function renderNote() {
    return h("span", {
      class: "uppy-DragDrop-note"
    }, this.opts.note);
  };

  _proto.render = function render(state) {
    var _this5 = this;

    var dragDropClass = "\n      uppy-Root\n      uppy-u-reset\n      uppy-DragDrop-container\n      " + (this.isDragDropSupported ? 'uppy-DragDrop--is-dragdrop-supported' : '') + "\n      " + (this.getPluginState().isDraggingOver ? 'uppy-DragDrop--isDraggingOver' : '') + "\n    ";
    var dragDropStyle = {
      width: this.opts.width,
      height: this.opts.height
    };
    return h("button", {
      type: "button",
      class: dragDropClass,
      style: dragDropStyle,
      onClick: function onClick() {
        return _this5.fileInputRef.click();
      },
      onDragOver: this.handleDragOver,
      onDragLeave: this.handleDragLeave,
      onDrop: this.handleDrop
    }, this.renderHiddenFileInput(), h("div", {
      class: "uppy-DragDrop-inner"
    }, this.renderArrowSvg(), this.renderLabel(), this.renderNote()));
  };

  _proto.install = function install() {
    this.setPluginState({
      isDraggingOver: false
    });
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return DragDrop;
}(Plugin), _class.VERSION = "1.4.0", _temp);
},{"@uppy/core":9,"@uppy/utils/lib/Translator":64,"@uppy/utils/lib/getDroppedFiles":72,"@uppy/utils/lib/isDragDropSupported":85,"@uppy/utils/lib/toArray":94,"preact":116}],37:[function(require,module,exports){
var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var _require2 = require('preact'),
    h = _require2.h;
/**
 * Informer
 * Shows rad message bubbles
 * used like this: `uppy.info('hello world', 'info', 5000)`
 * or for errors: `uppy.info('Error uploading img.jpg', 'error', 5000)`
 *
 */


module.exports = (_temp = _class =
/*#__PURE__*/
function (_Plugin) {
  _inheritsLoose(Informer, _Plugin);

  function Informer(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.type = 'progressindicator';
    _this.id = _this.opts.id || 'Informer';
    _this.title = 'Informer'; // set default options

    var defaultOptions = {}; // merge default options with the ones set by user

    _this.opts = _extends({}, defaultOptions, opts);
    _this.render = _this.render.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Informer.prototype;

  _proto.render = function render(state) {
    var _state$info = state.info,
        isHidden = _state$info.isHidden,
        message = _state$info.message,
        details = _state$info.details;
    return h("div", {
      class: "uppy uppy-Informer",
      "aria-hidden": isHidden
    }, h("p", {
      role: "alert"
    }, message, ' ', details && h("span", {
      "aria-label": details,
      "data-microtip-position": "top-left",
      "data-microtip-size": "medium",
      role: "tooltip"
    }, "?")));
  };

  _proto.install = function install() {
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  return Informer;
}(Plugin), _class.VERSION = "1.3.2", _temp);
},{"@uppy/core":9,"preact":116}],38:[function(require,module,exports){
var cs_CZ = {};
cs_CZ.strings = {
  addMore: 'Přidat další',
  addMoreFiles: 'Přidat další soubory',
  addingMoreFiles: 'Přidávání dalších souborů',
  allowAccessDescription: 'Pokud chcete pořizovat fotografie vaším zařízením, povolte prosím přístup ke kameře.',
  allowAccessTitle: 'Povolte prosím přístup ke kameře.',
  authenticateWith: 'Připojit k %{pluginName}',
  authenticateWithTitle: 'Prosím přihlaste se k %{pluginName} pro výběr souborů',
  back: 'Zpět',
  browse: 'procházet',
  cancel: 'Zrušit',
  cancelUpload: 'Zrušit nahrávání',
  chooseFiles: 'Vyberte soubory',
  closeModal: 'Zavřít dialog',
  companionAuthError: 'Vyžadováno přihlášení',
  companionError: 'Spojení s modulem Companion se nezdařilo',
  complete: 'Hotovo',
  connectedToInternet: 'Připojeno k internetu',
  copyLink: 'Zkopírovat odkaz',
  copyLinkToClipboardFallback: 'Zkopírujte odkaz níže',
  copyLinkToClipboardSuccess: 'Odkaz zkopírován do schránky',
  creatingAssembly: 'Nahrávání se připravuje...',
  creatingAssemblyFailed: 'Transloadit: Nelze vytvořit Assembly',
  dashboardTitle: 'Nahrát soubory',
  dashboardWindowTitle: 'Okno pro nahrání souborů. (Stiskněte ESC pro zavření.)',
  dataUploadedOfTotal: '%{complete} z %{total}',
  done: 'Dokončeno',
  dropHereOr: 'Přetáhněte soubory sem nebo %{browse}',
  dropHint: 'Přetáhněte soubory sem',
  dropPaste: 'Přetáhněte soubory sem, vložte je, nebo %{browse}',
  dropPasteImport: 'Přetáhněte soubory sem, vložte je, %{browse} nebo je importujte',
  edit: 'Upravit',
  editFile: 'Upravit soubor',
  editing: 'Upravujete %{file}',
  emptyFolderAdded: 'Nebyly přidány žádné soubory, adresář je prázdný.',
  encoding: 'Převádění...',
  enterCorrectUrl: 'Chybná URL: Ujistěte se, že vkládáte přímý odkaz na soubor.',
  enterUrlToImport: 'Vložte URL pro import souboru.',
  exceedsSize: 'Tento soubor překračuje maximální povolenou velikost: ',
  failedToFetch: 'Modulu Companion se nepodařilo stáhnout soubor z této URL, zkontrolujte prosím, jestli je URL správná.',
  failedToUpload: 'Nepodařilo se nahrát soubor %{file}',
  fileSource: 'Zdroj souboru: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} z %{smart_count} souboru nahráno',
    '1': '%{complete} z %{smart_count} souborů nahráno',
    '2': '%{complete} z %{smart_count} souborů nahráno'
  },
  filter: 'Filtrovat',
  finishEditingFile: 'Dokončit editaci souboru',
  folderAdded: {
    '0': 'Přidán %{smart_count} soubor z adresáře %{folder}',
    '1': 'Přidáno %{smart_count} souborů z adresáře %{folder}',
    '2': 'Přidáno %{smart_count} souborů z adresáře %{folder}'
  },
  generatingThumbnails: 'Vytvářím miniatury...',
  import: 'Importovat',
  importFrom: 'Importovat z %{name}',
  link: 'Odkaz',
  loading: 'Nahrávání...',
  logOut: 'Odhlásit',
  myDevice: 'Moje zařízení',
  noFilesFound: 'Nenalezeny žádné soubory ani adresáře',
  noInternetConnection: 'Nepřipojeno k internetu',
  openFolderNamed: 'Otevřít adresář %{name}',
  pause: 'Pozastavit',
  pauseUpload: 'Pozastavit nahrávání',
  paused: 'Pozastaveno',
  poweredBy: 'Vytvořeno pomocí ',
  preparingUpload: 'Připavuje se nahrávání...',
  processingXFiles: {
    '0': 'Zpracování %{smart_count} souborů',
    '1': 'Zpracování %{smart_count} souborů',
    '2': 'Zpracování %{smart_count} souborů'
  },
  removeFile: 'Odebrat soubor',
  resetFilter: 'Reset filtru',
  resume: 'Pokřačovat',
  resumeUpload: 'Pokračovat v nahrávání',
  retry: 'Opakovat',
  retryUpload: 'Opakovat nahrávání',
  saveChanges: 'Uložit změny',
  selectAllFilesFromFolderNamed: 'Vybrat vše z adresáře %{name}',
  selectFileNamed: 'Vybrat soubor %{name}',
  selectX: {
    '0': 'Vybrat %{smart_count}',
    '1': 'Vybrat %{smart_count}',
    '2': 'Vybrat %{smart_count}'
  },
  smile: 'Úsměv prosím!',
  startRecording: 'Spustit nahrávání videa',
  stopRecording: 'Zastavit nahrávání videa',
  takePicture: 'Pořídit fotografii',
  timedOut: 'Stav nahrávání se nezměnil %{seconds} sekund, ruším nahrávání.',
  unselectAllFilesFromFolderNamed: 'Zrušit výběr všech souborů z adresáře %{name}',
  unselectFileNamed: 'Zrušit výběr souboru %{name}',
  upload: 'Nahrát',
  uploadComplete: 'Nahrání dokončeno',
  uploadFailed: 'Nahrání se nezdařilo',
  uploadPaused: 'Nahrání dokončeno',
  uploadXFiles: {
    '0': 'Nahrát %{smart_count} soubor',
    '1': 'Nahrát %{smart_count} souborů',
    '2': 'Nahrát %{smart_count} souborů'
  },
  uploadXNewFiles: {
    '0': 'Nahrát +%{smart_count} soubor',
    '1': 'Nahrát +%{smart_count} souborů',
    '2': 'Nahrát +%{smart_count} souborů'
  },
  uploading: 'Nahrávání',
  uploadingXFiles: {
    '0': 'Nahrávám %{smart_count} soubor',
    '1': 'Nahrávám %{smart_count} souborů',
    '2': 'Nahrávám %{smart_count} souborů'
  },
  xFilesSelected: {
    '0': '%{smart_count} soubor vybrán',
    '1': '%{smart_count} soubory vybrány',
    '2': '%{smart_count} soubory vybrány'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} další soubor přidán',
    '1': '%{smart_count} dalších souborů přidáno',
    '2': '%{smart_count} dalších souborů přidáno'
  },
  xTimeLeft: '%{time} zbývá',
  youCanOnlyUploadFileTypes: 'Lze nahrát pouze následující typy souborů: %{types}',
  youCanOnlyUploadX: {
    '0': 'Lze nahrát pouze %{smart_count} soubor',
    '1': 'Lze nahrát pouze %{smart_count} souborů',
    '2': 'Lze nahrát pouze %{smart_count} souborů'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Je třeba vybrat alespoň %{smart_count} soubor',
    '1': 'Je třeba vybrat alespoň %{smart_count} souborů',
    '2': 'Je třeba vybrat alespoň %{smart_count} souborů'
  }
};

cs_CZ.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.cs_CZ = cs_CZ;
}

module.exports = cs_CZ;
},{}],39:[function(require,module,exports){
var da_DK = {};
da_DK.strings = {
  addMore: 'Tilføj flere',
  addMoreFiles: 'Tilføj flere filer',
  addingMoreFiles: 'Tilføj flere filer',
  allowAccessDescription: 'For at kunne tage billeder eller video med dit kamera, skal du tillade adgang til dit kamera for denne side.',
  allowAccessTitle: 'Venligst giv adgang til dit kamera',
  authenticateWith: 'Forbind til %{pluginName}',
  authenticateWithTitle: 'Venligst autentificer med %{pluginName} for at vælge filer',
  back: 'Tilbage',
  browse: 'gennemse',
  cancel: 'Annuller',
  cancelUpload: 'Annuller upload',
  chooseFiles: 'Vælg filer',
  closeModal: 'Luk Modal',
  companionAuthError: 'Autorisation påkrævet',
  companionError: 'Forbindelse til Companion fejlede',
  complete: 'Afsluttet',
  connectedToInternet: 'Forbundet til internettet',
  copyLink: 'Kopier link',
  copyLinkToClipboardFallback: 'Kopier URLen forneden',
  copyLinkToClipboardSuccess: 'Link kopieret til udklipsholderen',
  creatingAssembly: 'Forbereder upload...',
  creatingAssemblyFailed: 'Transloadit: Kunne ikke oprette Assembly',
  dashboardTitle: 'Fil Uploader',
  dashboardWindowTitle: 'Fil Uploader Vindue (Tryk escape for at lukke)',
  dataUploadedOfTotal: '%{complete} af %{total}',
  done: 'Færdig',
  dropHereOr: 'Træk filer her eller %{browse}',
  dropHint: 'Træk dine filer her',
  dropPaste: 'Træk filer her, sæt ind eller %{browse}',
  dropPasteImport: 'Træk filer her, sæt ind, %{browse} eller importer fra',
  edit: 'Rediger',
  editFile: 'Rediger fil',
  editing: 'Redigerer %{file}',
  emptyFolderAdded: 'Ingen filer blev tilføjet fra en tom mappe',
  encoding: 'Encoding...',
  enterCorrectUrl: 'Forkert URL: Venligst sørg for at du indtaster et direkte link til en fil',
  enterUrlToImport: 'Indtast URL for at importerer en fil',
  exceedsSize: 'Denne fil overskrider den maksimale tilladte størrelse af',
  failedToFetch: 'Companion kunne ikke hente denne URL, venligst undersøg om denne er korrekt',
  failedToUpload: 'Fejlede upload af %{file}',
  fileSource: 'Fil kilde: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} af %{smart_count} filer uploaded',
    '1': '%{complete} af %{smart_count} fil uploaded',
    '2': '%{complete} af %{smart_count} filer uploaded'
  },
  filter: 'Filter',
  finishEditingFile: 'Færddiggør redigering af fil',
  folderAdded: {
    '0': 'Tilføjet %{smart_count} filer fra %{folder}',
    '1': 'Tilføjet %{smart_count} fil fra %{folder}',
    '2': 'Tilføjet %{smart_count} filer fra %{folder}'
  },
  import: 'Importer',
  importFrom: 'Importer fra %{name}',
  link: 'Link',
  loading: 'Loading...',
  logOut: 'Log ud',
  myDevice: 'Min enhed',
  noFilesFound: 'Du har ingen filer eller mapper her',
  noInternetConnection: 'Ingen Internet forbindelse',
  openFolderNamed: 'Åben mappe %{name}',
  pause: 'Pause',
  pauseUpload: 'Pause upload',
  paused: 'Sat på pause',
  poweredBy: 'Drevet af',
  preparingUpload: 'Forbereder upload...',
  processingXFiles: {
    '0': 'Behandler %{smart_count} filer',
    '1': 'Behandler %{smart_count} fil',
    '2': 'Behandler %{smart_count} filer'
  },
  removeFile: 'Fjern fil',
  resetFilter: 'Nulstil filter',
  resume: 'Genoptag',
  resumeUpload: 'Genoptag upload',
  retry: 'Forsøg igen',
  retryUpload: 'Forsøg upload igen',
  saveChanges: 'Gem ændringer',
  selectAllFilesFromFolderNamed: 'Vælg alle filer fra mappen %{name}',
  selectFileNamed: 'Vælg fil %{name}',
  selectX: {
    '0': 'Vælg %{smart_count}',
    '1': 'Vælg %{smart_count}',
    '2': 'Vælg %{smart_count}'
  },
  smile: 'Smil!',
  startRecording: 'Start video optagelse',
  stopRecording: 'Stop video optagelse',
  takePicture: 'Tag et billede',
  timedOut: 'Upload gået i stå for %{seconds} sekunder, afbryder.',
  unselectAllFilesFromFolderNamed: 'Afmarker alle filer fra mappen %{name}',
  unselectFileNamed: 'Afmarker filen %{name}',
  upload: 'Upload',
  uploadComplete: 'Upload færdig',
  uploadFailed: 'Upload fejlede',
  uploadPaused: 'Upload sat på pause',
  uploadXFiles: {
    '0': 'Upload %{smart_count} fil',
    '1': 'Upload %{smart_count} filer',
    '2': 'Upload %{smart_count} filer'
  },
  uploadXNewFiles: {
    '0': 'Upload +%{smart_count} fil',
    '1': 'Upload +%{smart_count} filer',
    '2': 'Upload +%{smart_count} filer'
  },
  uploading: 'Uploader',
  uploadingXFiles: {
    '0': 'Uploader %{smart_count} fil',
    '1': 'Uploader %{smart_count} filer',
    '2': 'Uploader %{smart_count} filer'
  },
  xFilesSelected: {
    '0': '%{smart_count} fil valgt',
    '1': '%{smart_count} filer valgt',
    '2': '%{smart_count} filer valgt'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} flere filer tilføjet',
    '1': '%{smart_count} flere filer tilføjet',
    '2': '%{smart_count} flere filer tilføjet'
  },
  xTimeLeft: '%{time} tilbage',
  youCanOnlyUploadFileTypes: 'Du kan kun uploade: %{types}',
  youCanOnlyUploadX: {
    '0': 'Du kan kun uploade %{smart_count} fil',
    '1': 'Du kan kun uploade %{smart_count} filer',
    '2': 'Du kan kun uploade %{smart_count} filer'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Du skal vælge mindst %{smart_count} fil',
    '1': 'Du skal vælge mindst %{smart_count} filer',
    '2': 'Du skal vælge mindst %{smart_count} filer'
  }
};

da_DK.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.da_DK = da_DK;
}

module.exports = da_DK;
},{}],40:[function(require,module,exports){
var de_DE = {};
de_DE.strings = {
  addMoreFiles: 'Dateien hinzufügen',
  addingMoreFiles: 'Dateien hinzufügen',
  allowAccessDescription: 'Um Bilder oder Videos mit Ihrer Kamera aufzunehmen, erlauben Sie dieser Website bitte Zugriff auf Ihre Kamera.',
  allowAccessTitle: 'Bitte erlauben Sie Zugriff auf Ihre Kamera',
  authenticateWith: 'Mit %{pluginName} verbinden',
  authenticateWithTitle: 'Bitte authentifizieren Sie sich mit %{pluginName}, um Dateien auszuwählen',
  back: 'Zurück',
  addMore: 'Dateien hinzufügen',
  browse: 'Suche',
  cancel: 'Abbrechen',
  cancelUpload: 'Upload abbrechen',
  chooseFiles: 'Dateien auswählen',
  closeModal: 'Modal schließen',
  companionAuthError: 'Authorisierung benötigt',
  companionError: 'Verbindung zu Companion fehlgeschlagen',
  complete: 'Fertig',
  connectedToInternet: 'Verbunden mit dem Internet',
  copyLink: 'Link kopieren',
  copyLinkToClipboardFallback: 'Untenstehenden URL kopieren',
  copyLinkToClipboardSuccess: 'Link in die Zwischenablage kopiert',
  creatingAssembly: 'Upload vorbereiten...',
  creatingAssemblyFailed: 'Transloadit: Konnte Assembly nicht erstellen',
  dashboardTitle: 'Datei Uploader',
  dashboardWindowTitle: 'Datei Uploader Fenster (Esc drücken zum Schließen)',
  dataUploadedOfTotal: '%{complete} von %{total}',
  done: 'Abgeschlossen',
  dropHereOr: 'Dateien können über Drag/Drop oder per %{browse} hinzugefügt werden',
  dropHint: 'Dateien können über Drag/Drop hinzugefügt werden',
  dropPaste: 'Dateien können über Drag/Drop, Einfügen oder per %{browse} hinzugefügt werden',
  dropPasteImport: 'Dateien können über Drag/Drop, Einfügen, per %{browse} oder von folgenden Services hinzugefügt werden',
  edit: 'Bearbeiten',
  editFile: 'Datei bearbeiten',
  editing: '%{file} bearbeiten',
  emptyFolderAdded: 'Keine Dateien konnten hinzugefügt werden, da der Ordner leer war',
  encoding: 'Enkodieren...',
  enterCorrectUrl: 'Falsche URL: Bitte stellen Sie sicher, dass Sie einen direkten Link zu einer Datei eingeben',
  enterUrlToImport: 'URL zum Importieren einer Datei eingeben',
  exceedsSize: 'Diese Datei ist größer als die maximal erlaubte Dateigröße',
  failedToFetch: 'Companion konnte diese URL nicht verarbeiten - stellen Sie bitte sicher, dass sie korrekt ist',
  failedToUpload: 'Fehler beim Upload von Datei %{file}',
  fileSource: 'Dateiquelle: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} von %{smart_count} Datei hochgeladen',
    '1': '%{complete} von %{smart_count} Dateien hochgeladen',
    '2': '%{complete} von %{smart_count} Dateien hochgeladen'
  },
  filter: 'Filter',
  finishEditingFile: 'Dateibearbeitung beenden',
  folderAdded: {
    '0': '%{smart_count} Datei von %{folder} hinzugefügt',
    '1': '%{smart_count} Dateien von %{folder} hinzugefügt',
    '2': '%{smart_count} Dateien von %{folder} hinzugefügt'
  },
  import: 'Import',
  importFrom: 'Importieren von %{name}',
  link: 'Link',
  loading: 'Laden...',
  logOut: 'Ausloggen',
  myDevice: 'Mein Gerät',
  noFilesFound: 'Sie haben keine Dateien oder Ordner hier',
  noInternetConnection: 'Keine Internetverbindung',
  pause: 'Pausieren',
  pauseUpload: 'Upload pausieren',
  paused: 'Pausiert',
  poweredBy: 'Angetrieben von',
  preparingUpload: 'Upload vorbereiten...',
  processingXFiles: {
    '0': '%{smart_count} Datei verarbeiten',
    '1': '%{smart_count} Dateien verarbeiten',
    '2': '%{smart_count} Dateien verarbeiten'
  },
  removeFile: 'Datei entfernen',
  resetFilter: 'Filter zurücksetzen',
  resume: 'Fortsetzen',
  resumeUpload: 'Upload fortsetzen',
  retry: 'Erneut versuchen',
  retryUpload: 'Upload erneut versuchen',
  saveChanges: 'Änderungen speichern',
  selectX: {
    '0': 'Wählen Sie %{smart_count}',
    '1': 'Wählen Sie %{smart_count}',
    '2': 'Wählen Sie %{smart_count}'
  },
  smile: 'Bitte lächeln!',
  startRecording: 'Videoaufnahme starten',
  stopRecording: 'Videoaufnahme beenden',
  takePicture: 'Ein Foto machen',
  timedOut: 'Upload für %{seconds} Sekunden stehen geblieben, breche ab.',
  upload: 'Upload',
  uploadComplete: 'Upload beendet',
  uploadFailed: 'Upload fehlgeschlagen',
  uploadPaused: 'Upload pausiert',
  uploadXFiles: {
    '0': '%{smart_count} Datei hochladen',
    '1': '%{smart_count} Dateien hochladen',
    '2': '%{smart_count} Dateien hochladen'
  },
  uploadXNewFiles: {
    '0': '+%{smart_count} Datei hochladen',
    '1': '+%{smart_count} Dateien hochladen',
    '2': '+%{smart_count} Dateien hochladen'
  },
  uploading: 'Uploading',
  uploadingXFiles: {
    '0': '%{smart_count} Datei wird hochgeladen',
    '1': '%{smart_count} Dateien werden hochgeladen',
    '2': '%{smart_count} Dateien werden hochgeladen'
  },
  xFilesSelected: {
    '0': '%{smart_count} Datei ausgewählt',
    '1': '%{smart_count} Dateien ausgewählt',
    '2': '%{smart_count} Dateien ausgewählt'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} weitere Datei hinzugefügt',
    '1': '%{smart_count} weitere Dateien hinzugefügt',
    '2': '%{smart_count} weitere Dateien hinzugefügt'
  },
  xTimeLeft: '%{time} verbleibend',
  youCanOnlyUploadFileTypes: 'Sie können nur folgende Dateitypen hochladen: %{types}',
  youCanOnlyUploadX: {
    '0': 'Sie können nur %{smart_count} Datei hochladen',
    '1': 'Sie können nur %{smart_count} Dateien hochladen',
    '2': 'Sie können nur %{smart_count} Dateien hochladen'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Sie müssen mindestens %{smart_count} Datei auswählen',
    '1': 'Sie müssen mindestens %{smart_count} Dateien auswählen',
    '2': 'Sie müssen mindestens %{smart_count} Dateien auswählen'
  },
  selectAllFilesFromFolderNamed: 'Wählen Sie alle Dateien aus dem Ordner %{name}',
  unselectAllFilesFromFolderNamed: 'Heben Sie die Auswahl aller Dateien aus dem Ordner auf %{name}',
  selectFileNamed: 'Datei aussuchen %{name}',
  unselectFileNamed: 'Datei abwählen %{name}',
  openFolderNamed: 'Ordner öffnen %{name}'
};

de_DE.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.de_DE = de_DE;
}

module.exports = de_DE;
},{}],41:[function(require,module,exports){
var el_GR = {};
el_GR.strings = {
  addMore: 'Προσθέστε περισσότερα',
  addMoreFiles: 'Προσθέστε περισσότερα αρχεία',
  addingMoreFiles: 'Προσθήκη αρχείων',
  allowAccessDescription: 'Για να βγάλετε φωτογραφίες ή βίντεο με την κάμερά σας, παρακαλούμε επιτρέψτε την πρόσβαση στην κάμερά σας για αυτόν τον ιστότοπο.',
  allowAccessTitle: 'Παρακαλούμε επιτρέψτε την πρόσβαση στην κάμερά σας',
  authenticateWith: 'Σύνδεση με %{pluginName}',
  authenticateWithTitle: 'Παρακαλούμε συνδεθείτε με %{pluginName} για να επιλέξετε αρχεία',
  back: 'Πίσω',
  browse: 'Περιήγηση',
  cancel: 'Άκυρο',
  cancelUpload: 'Ακύρωση μεταφόρτωσης',
  chooseFiles: 'Επιλέξτε αρχεία',
  closeModal: 'Κλείσιμο παραθύρου',
  companionAuthError: 'Απαιτείται εξουσιοδότηση',
  companionError: 'Η σύνδεση με το Companion απέτυχε',
  complete: 'Ολοκληρώθηκε',
  connectedToInternet: 'Συνδεθήκατε στο Internet',
  copyLink: 'Αντιγραφή συνδέσμου',
  copyLinkToClipboardFallback: 'Αντιγραφή του παρακάτω συνδέσμου',
  copyLinkToClipboardSuccess: 'Ο σύνδεσμος αντιγράφηκε',
  creatingAssembly: 'Προετοιμασία μεταφόρτωσης...',
  creatingAssemblyFailed: 'Transloadit: Σφάλμα κατά την προετοιμασία',
  dashboardTitle: 'Μεταφόρτωση αρχείων',
  dashboardWindowTitle: 'Παράθυρο μεταφόρτωσης αρχείων (Πατήστε escape για να κλείσει)',
  dataUploadedOfTotal: '%{complete} από %{total}',
  done: 'Τέλος',
  dropHereOr: 'Ρίξτε τα αρχεία εδώ ή %{browse}',
  dropHint: 'Ρίξτε τα αρχεία σας εδώ',
  dropPaste: 'Ρίξτε τα αρχεία εδώ, κάντε επικόλληση ή %{browse}',
  dropPasteImport: 'Ρίξτε αρχεία εδώ, κάντε επικόλληση, %{browse} ή εισαγωγή από',
  edit: 'Επεξεργασία',
  editFile: 'Επεξεργασία αρχείου',
  editing: 'Γίνεται επεξεργασία %{file}',
  emptyFolderAdded: 'Δεν προστέθηκαν αρχεία από τον άδειο φάκελο',
  encoding: 'Γίνεται κωδικοποίηση...',
  enterCorrectUrl: 'Λανθασμένο URL: Παρακαλούμε βεβαιωθείτε ότι εισάγετε έναν άμεσο σύνδεσμο προς κάποιο αρχείο',
  enterUrlToImport: 'Εισάγετε URL για να γίνει εισαγωγή του αρχείου',
  exceedsSize: 'Το αρχείο υπερβαίνει το μέγιστο επιτρεπτό όριο που είναι',
  failedToFetch: 'Δεν ήταν δυνατή η λήψη από το URL, παρακαλούμε βεβαιωθείτε ότι είναι σωστό',
  failedToUpload: 'Δεν ήταν δυνατή η μεταφόρτωση %{file}',
  fileSource: 'Πηγή αρχείου: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} από %{smart_count} αρχεία ανέβηκαν',
    '1': '%{complete} από %{smart_count} αρχείο ανέβηκε',
    '2': '%{complete} από %{smart_count} αρχεία ανέβηκαν'
  },
  filter: 'Φιλτράρισμα',
  finishEditingFile: 'Ολοκλήρωση επεξεργασίας αρχείου',
  folderAdded: {
    '0': 'Προστέθηκαν %{smart_count} αρχεία από %{folder}',
    '1': 'Προστέθηκε %{smart_count} αρχείο από %{folder}',
    '2': 'Προστέθηκαν %{smart_count} αρχεία από %{folder}'
  },
  import: 'Εισαγωγή',
  importFrom: 'Εισαγωγή από %{name}',
  link: 'Σύνδεσμος',
  loading: 'Φορτώνει...',
  logOut: 'Αποσύνδεση',
  myDevice: 'Η συσκευή μου',
  noFilesFound: 'Δεν υπάρχουν αρχεία ή φάκελοι εδώ',
  noInternetConnection: 'Δεν υπάρχει σύνδεση στο Internet',
  openFolderNamed: 'Άνοιγμα φακέλου %{name}',
  pause: 'Παύση',
  pauseUpload: 'Παύση μεταφόρτωσης',
  paused: 'Έγινε παύση',
  poweredBy: 'Με τη δύναμη τού',
  preparingUpload: 'Προετοιμασία μεταφόρτωσης...',
  processingXFiles: {
    '0': 'Προετοιμασία %{smart_count} αρχείων',
    '1': 'Προετοιμασία %{smart_count} αρχείου',
    '2': 'Προετοιμασία %{smart_count} αρχείων'
  },
  removeFile: 'Αφαίρεση αρχείου',
  resetFilter: 'Επαναφορά φίλτρου',
  resume: 'Συνέχεια',
  resumeUpload: 'Συνέχεια μεταφόρτωσης',
  retry: 'Προσπάθεια ξανά',
  retryUpload: 'Προσπάθεια μεταφόρτωσης ξανά',
  saveChanges: 'Αποθήκευση αλλαγών',
  selectAllFilesFromFolderNamed: 'Επιλογή όλων των αρχείων από τον φάκελο %{name}',
  selectFileNamed: 'Επιλογή αρχείου %{name}',
  selectX: {
    '0': 'Επιλογή %{smart_count}',
    '1': 'Επιλογή %{smart_count}',
    '2': 'Επιλογή %{smart_count}'
  },
  smile: 'Χαμογελάστε!',
  startRecording: 'Ξεκίνημα εγγραφής βίντεο',
  stopRecording: 'Σταμάτημα εγγραφής βίντεο',
  takePicture: 'Βγάλτε μια φωτογραφία',
  timedOut: 'Η μεταφόρτωση σταμάτησε για %{seconds} δευτερόλεπτα, γίνεται ακύρωση.',
  unselectAllFilesFromFolderNamed: 'Αποεπιλογή όλων των αρχείων από τον φάκελο %{name}',
  unselectFileNamed: 'Αποεπιλογή αρχείου %{name}',
  upload: 'Μεταφόρτωση',
  uploadComplete: 'Μεταφόρτωση ολοκληρώθηκε',
  uploadFailed: 'Μεταφόρτωση απέτυχε',
  uploadPaused: 'Μεταφόρτωση σε παύση',
  uploadXFiles: {
    '0': 'Μεταφόρτωση %{smart_count} αρχείων',
    '1': 'Μεταφόρτωση %{smart_count} αρχείου',
    '2': 'Μεταφόρτωση %{smart_count} αρχείων'
  },
  uploadXNewFiles: {
    '0': 'Μεταφόρτωση +%{smart_count} αρχείων',
    '1': 'Μεταφόρτωση +%{smart_count} αρχείου',
    '2': 'Μεταφόρτωση +%{smart_count} αρχείων'
  },
  uploading: 'Γίνεται μεταφόρτωση',
  uploadingXFiles: {
    '0': 'Μεταφορτώνονται %{smart_count} αρχεία',
    '1': 'Μεταφορτώνεται %{smart_count} αρχείο',
    '2': 'Μεταφορτώνονται %{smart_count} αρχεία'
  },
  xFilesSelected: {
    '0': '%{smart_count} επιλεγμένα αρχεία',
    '1': '%{smart_count} επιλεγμένο αρχείο',
    '2': '%{smart_count} επιλεγμένα αρχεία'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} ακόμα αρχεία προστέθηκαν',
    '1': '%{smart_count} ακόμα αρχείο προστέθηκε',
    '2': '%{smart_count} ακόμα αρχεία προστέθηκαν'
  },
  xTimeLeft: '%{time} απομένουν',
  youCanOnlyUploadFileTypes: 'Μπορείτε να ανεβάσετε μόνο: %{types}',
  youCanOnlyUploadX: {
    '0': 'Μπορείτε να ανεβάσετε μόνο %{smart_count} αρχεία',
    '1': 'Μπορείτε να ανεβάσετε μόνο %{smart_count} αρχείο',
    '2': 'Μπορείτε να ανεβάσετε μόνο %{smart_count} αρχεία'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Πρέπει να επιλέξετε τουλάχιστον %{smart_count} αρχεία',
    '1': 'Πρέπει να επιλέξετε τουλάχιστον %{smart_count} αρχείο',
    '2': 'Πρέπει να επιλέξετε τουλάχιστον %{smart_count} αρχεία'
  }
};

el_GR.pluralize = function (n) {
  if (n === 1) {
    return 1;
  }

  return 0;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.el_GR = el_GR;
}

module.exports = el_GR;
},{}],42:[function(require,module,exports){
var es_ES = {};
es_ES.strings = {
  addMoreFiles: 'Agregar más archivos',
  addingMoreFiles: 'Agregando más archivos',
  allowAccessDescription: 'Para tomar fotos o grabar video con tu cámara, por favor permite a este sitio el acceso a la cámara.',
  allowAccessTitle: 'Por favor permite el acceso a tu cámara',
  authenticateWith: 'Conectar a %{pluginName}',
  authenticateWithTitle: 'Por favor autentícate con %{pluginName} para seleccionar archivos',
  back: 'Atrás',
  addMore: 'Agregar más',
  browse: 'navegar',
  cancel: 'Cancelar',
  cancelUpload: 'Cancelar subida',
  chooseFiles: 'Seleccionar archivos',
  closeModal: 'Cerrar ventana flotante',
  companionAuthError: 'Autorización requerida',
  companionError: 'Conexión con Companion falló',
  complete: 'Completado',
  connectedToInternet: 'Conectado a Internet',
  copyLink: 'Copiar enlace',
  copyLinkToClipboardFallback: 'Copia la siguiente URL',
  copyLinkToClipboardSuccess: 'Enlace copiado al portapapeles',
  creatingAssembly: 'Preparando subida...',
  creatingAssemblyFailed: 'Transloadit: No se pudo crear un Assembly',
  dashboardTitle: 'Cargador de archivos',
  dashboardWindowTitle: 'Ventana para cargar archivos (Presiona escape para cerrar)',
  dataUploadedOfTotal: '%{complete} de %{total}',
  done: 'Hecho',
  dropHereOr: 'Soltar archivos aquí o %{browse}',
  dropHint: 'Suelta tus archivos aquí',
  dropPaste: 'Soltar archivos aquí, pegar o %{browse}',
  dropPasteImport: 'Soltar archivos aquí, pegar, %{browse} o importar desde',
  edit: 'Editar',
  editFile: 'Editar archivo',
  editing: 'Editando %{file}',
  emptyFolderAdded: 'Ningún archivo fue agregado desde la carpeta vacía',
  encoding: 'Codificando...',
  enterCorrectUrl: 'URL incorrecta: Por favor asegúrate que estás ingresando un enlace a un archivo',
  enterUrlToImport: 'Ingresa una URL para importar un archivo',
  exceedsSize: 'Este archivo excede el tamaño máximo de',
  failedToFetch: 'Companion no ha podido recuperar esta URL, por favor asegúrate que sea correcta',
  failedToUpload: 'Error al subir %{file}',
  fileSource: 'Fuente de archivo: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} de %{smart_count} archivo subido',
    '1': '%{complete} de %{smart_count} archivos subidos',
    '2': '%{complete} de %{smart_count} archivos subidos'
  },
  filter: 'Filtrar',
  finishEditingFile: 'Terminar edición de archivo',
  folderAdded: {
    '0': 'Agregado %{smart_count} archivo desde %{folder}',
    '1': 'Agregados %{smart_count} archivos desde %{folder}',
    '2': 'Agregados %{smart_count} archivos desde %{folder}'
  },
  import: 'Importar',
  importFrom: 'Importar desde %{name}',
  link: 'Enlace',
  loading: 'Cargando...',
  logOut: 'Cerrar sesión',
  myDevice: 'Mi Dispositivo',
  noFilesFound: 'No existen archivos o carpetas aquí',
  noInternetConnection: 'Sin conexión a Internet',
  pause: 'Pausar',
  pauseUpload: 'Pausar subida',
  paused: 'En pausa',
  poweredBy: 'Soportado por',
  preparingUpload: 'Preparando subida...',
  processingXFiles: {
    '0': 'Procesando %{smart_count} archivo',
    '1': 'Procesando %{smart_count} archivos',
    '2': 'Procesando %{smart_count} archivos'
  },
  removeFile: 'Eliminar archivo',
  resetFilter: 'Limpiar filtro',
  resume: 'Reanudar',
  resumeUpload: 'Reanudar subida',
  retry: 'Intentar nuevamente',
  retryUpload: 'Intentar subida nuevamente',
  saveChanges: 'Guardar cambios',
  selectX: {
    '0': 'Seleccionar %{smart_count}',
    '1': 'Seleccionar %{smart_count}',
    '2': 'Seleccionar %{smart_count}'
  },
  smile: 'Sonríe!',
  startRecording: 'Comenzar la grabación de video',
  stopRecording: 'Detener la grabación de video',
  takePicture: 'Tomar una foto',
  timedOut: 'Subida estancada por %{seconds} segundos, anulando.',
  upload: 'Subir',
  uploadComplete: 'Subida terminada',
  uploadFailed: 'Subida falló',
  uploadPaused: 'Subida pausada',
  uploadXFiles: {
    '0': 'Subir %{smart_count} archivo',
    '1': 'Subir %{smart_count} archivos',
    '2': 'Subir %{smart_count} archivos'
  },
  uploadXNewFiles: {
    '0': 'Subir +%{smart_count} archivo',
    '1': 'Subir +%{smart_count} archivos',
    '2': 'Subir +%{smart_count} archivos'
  },
  uploading: 'Subiendo',
  uploadingXFiles: {
    '0': 'Subiendo %{smart_count} archivo',
    '1': 'Subiendo %{smart_count} archivos',
    '2': 'Subiendo %{smart_count} archivos'
  },
  xFilesSelected: {
    '0': '%{smart_count} archivo seleccionado',
    '1': '%{smart_count} archivos seleccionados',
    '2': '%{smart_count} archivos seleccionados'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} archivo más agregado',
    '1': '%{smart_count} archivos más agregados',
    '2': '%{smart_count} archivos más agregados'
  },
  xTimeLeft: '%{time} restantes',
  youCanOnlyUploadFileTypes: 'Solo puedes subir: %{types}',
  youCanOnlyUploadX: {
    '0': 'Solo puedes subir %{smart_count} archivo',
    '1': 'Solo puedes subir %{smart_count} archivos',
    '2': 'Solo puedes subir %{smart_count} archivos'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Tienes que seleccionar al menos %{smart_count} archivo',
    '1': 'Tienes que seleccionar al menos %{smart_count} archivos',
    '2': 'Tienes que seleccionar al menos %{smart_count} archivos'
  },
  selectAllFilesFromFolderNamed: 'Seleccionar todos los archivos de la carpeta %{name}',
  unselectAllFilesFromFolderNamed: 'Deselecciona todos los archivos de la carpeta %{name}',
  selectFileNamed: 'Seleccione archivo %{name}',
  unselectFileNamed: 'Deseleccionar archivo %{name}',
  openFolderNamed: 'Carpeta abierta %{name}'
};

es_ES.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.es_ES = es_ES;
}

module.exports = es_ES;
},{}],43:[function(require,module,exports){
var fa_IR = {};
fa_IR.strings = {
  addMoreFiles: 'افزودن فایل‌های بیشتر',
  addingMoreFiles: 'درحال افزودن فایل‌ها',
  allowAccessDescription: 'برای استفاده از دوربین جهت عکس و فیلمبرداری، لطفا به این سایت اجازه‌ی دسترسی به دوربین را بدهید',
  allowAccessTitle: 'لطفا به دوربین اجازه‌ی دسترسی بدهید',
  authenticateWith: 'در حال اتصال به %{pluginName}',
  authenticateWithTitle: 'احراز هویت %{pluginName} برای انتخاب فایل ضروریست!',
  back: 'بازگشت',
  addMore: 'اضافه کردن بیشتر',
  browse: 'انتخاب کنید',
  cancel: 'انصراف',
  cancelUpload: 'لغو بارگذاری',
  chooseFiles: 'انتخاب فایل',
  closeModal: 'بستن پنجره',
  companionAuthError: 'نیازمند تایید هویت',
  companionError: 'Connection with Companion failed',
  complete: 'کامل شد',
  connectedToInternet: 'م به شبکه اینترنت متصل شد',
  copyLink: 'کپی پیوند',
  copyLinkToClipboardFallback: 'پیوند زیر را کپی کنید',
  copyLinkToClipboardSuccess: 'پیوند به حافظه‌ی موقت منتقل شد',
  creatingAssembly: 'درحال آماده سازی برای بارگذاری',
  creatingAssemblyFailed: 'Transloadit: Could not create Assembly',
  dashboardTitle: 'بارگذاری فایل',
  dashboardWindowTitle: 'پنجره بارگذاری فایل. برای لغو کلید esc را بفشارید',
  dataUploadedOfTotal: '%{complete} از %{total}',
  done: 'انجام شد',
  dropHereOr: 'فایل را بکشید و اینجا رها کنید یا  %{browse}',
  dropHint: 'فایل‌ها را بکشید و اینجا رها کنید',
  dropPaste: 'فایلها اینجا رها کنید، بچسبانید یا  %{browse}',
  dropPasteImport: 'فایلها را اینجا رها کنید، بچسبانید یا %{browse}',
  edit: 'ویرایش',
  editFile: 'ویرایش فایل',
  editing: 'در حال ویرایش %{file}',
  emptyFolderAdded: 'از پوشه‌ی خالی هیچ فایلی افزوده نشد',
  encoding: 'رمزگذاری...',
  enterCorrectUrl: 'آدرس نامعتبر. لطفا مطمئن شوید که آدرس مستقیم به یک فایل را انتخاب کرده‌اید.',
  enterUrlToImport: 'آدرس فایل را برای بارگذاری بنویسید',
  exceedsSize: 'اندازه‌ی این فایل از حد مجاز بیشتر است!',
  failedToFetch: 'Companion failed to fetch this URL, please make sure it’s correct',
  failedToUpload: 'شکست در بارگذاری %{file}',
  fileSource: 'منبع فایل: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} از %{smart_count} فایل بارگذاری شد.',
    '1': '%{complete} از %{smart_count} فایل بارگذاری شد.',
    '2': '%{complete} از %{smart_count} فایل بارگذاری شد.'
  },
  filter: 'پالایش',
  finishEditingFile: 'اتمام ویرایش فایل',
  folderAdded: {
    '0': '%{smart_count} فایل از %{folder} افزوده شد.',
    '1': '%{smart_count} فایل از %{folder} افزوده شد.',
    '2': '%{smart_count} فایل از %{folder} افزوده شد.'
  },
  import: 'واردکردن',
  importFrom: 'واردکردن از %{name}',
  link: 'پیوند',
  loading: 'درحال بارگذاری',
  logOut: 'خروج',
  myDevice: 'دستگاه من',
  noFilesFound: 'هیچ فایل یا پوشه‌ای اینجا ندارید',
  noInternetConnection: 'عدم اتصال به اینترنت',
  pause: 'توقف',
  pauseUpload: 'توقف بارگذاری',
  paused: 'متوقف شده',
  poweredBy: 'قدرت گرفته از',
  preparingUpload: 'درحال آماده سازی برای بارگذاری',
  processingXFiles: {
    '0': 'درحال پردازش %{smart_count} فایل',
    '1': 'درحال پردازش %{smart_count} فایل',
    '2': 'درحال پردازش %{smart_count} فایل'
  },
  removeFile: 'حذف فایل',
  resetFilter: 'بازنشانی فیلتر',
  resume: 'ادامه',
  resumeUpload: 'ادامه بارگذاری',
  retry: 'تلاش دوباره',
  retryUpload: 'تلاش دوباره بارگذاری',
  saveChanges: 'ذخیره‌ی تغییرات',
  selectX: {
    '0': 'را انتخاب کنید %{smart_count}',
    '1': 'را انتخاب کنید %{smart_count}',
    '2': 'را انتخاب کنید %{smart_count}'
  },
  smile: 'Smile!',
  startRecording: 'آغاز تصویربرداری',
  stopRecording: 'توقف تصویربرداری',
  takePicture: 'عکس بگیرید',
  timedOut: 'بارگذاری به مدت %{seconds} ثانیه متوقف شد, درحال متوقف کردن.',
  upload: 'بارگذاری',
  uploadComplete: 'بارگذاری انجام شد',
  uploadFailed: 'بارگذاری شکست خورد',
  uploadPaused: 'بارگذاری متوقف شد',
  uploadXFiles: {
    '0': 'بارگذاری %{smart_count} فایل',
    '1': 'بارگذاری %{smart_count} فایل',
    '2': 'بارگذاری %{smart_count} فایل'
  },
  uploadXNewFiles: {
    '0': 'بارگذاری +%{smart_count} فایل',
    '1': 'بارگذاری +%{smart_count} فایل',
    '2': 'بارگذاری +%{smart_count} فایل'
  },
  uploading: 'بارگذاری',
  uploadingXFiles: {
    '0': 'بارگذاری %{smart_count} فایل',
    '1': 'بارگذاری %{smart_count} فایل',
    '2': 'بارگذاری %{smart_count} fiفایلles'
  },
  xFilesSelected: {
    '0': '%{smart_count} فایل انتخاب شده',
    '1': '%{smart_count} فایل انتخاب شده',
    '2': '%{smart_count} فایل انتخاب شده'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} فایل دیگر افزوده شد',
    '1': '%{smart_count} فایل دیگر افزوده شد',
    '2': '%{smart_count} فایل دیگر افزوده شد'
  },
  xTimeLeft: '%{time} left',
  youCanOnlyUploadFileTypes: 'فایل‌های قابل قبول: %{types}',
  youCanOnlyUploadX: {
    '0': 'فقط می‌توانید %{smart_count} فایل انتخاب کنید',
    '1': 'فقط می‌توانید %{smart_count} فایل انتخاب کنید',
    '2': 'فقط می‌توانید %{smart_count} فایل انتخاب کنید'
  },
  youHaveToAtLeastSelectX: {
    '0': 'می‌بایست حداقل %{smart_count} فایل انتخاب کنید',
    '1': 'می‌بایست حداقل %{smart_count} فایل انتخاب کنید',
    '2': 'می‌بایست حداقل %{smart_count} فایل انتخاب کنید'
  },
  selectAllFilesFromFolderNamed: 'همه فایل ها را از پوشه انتخاب کنید %{name}',
  unselectAllFilesFromFolderNamed: 'همه فایل ها را از پوشه حذف کنید %{name}',
  selectFileNamed: 'فایل را انتخاب کنید %{name}',
  unselectFileNamed: 'لغو انتخاب پرونده %{name}',
  openFolderNamed: 'پوشه باز کنید %{name}'
};

fa_IR.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.fa_IR = fa_IR;
}

module.exports = fa_IR;
},{}],44:[function(require,module,exports){
var fi_FI = {};
fi_FI.strings = {
  addMore: 'Lisää',
  addMoreFiles: 'Lisää tiedostoja',
  addingMoreFiles: 'Lisätään tiedostoja',
  allowAccessDescription: 'Jotta voit lähettää kuvia tai videota kamerastasi, sinun tulee antaa tälle sivustolle oikeus käyttää kameraasi.',
  allowAccessTitle: 'Salli kameran käyttö, kiitos',
  authenticateWith: 'Mene %{pluginName}',
  authenticateWithTitle: '%{pluginName} vaadittu tunnistautumiseen, jotta voit valita tiedostoja',
  back: 'Takaisin',
  browse: 'selaa',
  cancel: 'Peruuta',
  cancelUpload: 'Peruuta lähetys',
  chooseFiles: 'Valitse tiedostot',
  closeModal: 'Sulje ikkuna',
  companionAuthError: 'Käyttöoikeus vaadittu',
  companionError: 'Yhdistäminen Companioniin epäonnistui',
  complete: 'Valmis',
  connectedToInternet: 'Yhdistetty Internettiin',
  copyLink: 'Kopioi linkki',
  copyLinkToClipboardFallback: 'Kopioi alla oleva linkki',
  copyLinkToClipboardSuccess: 'Linkki kopioitu leikepöydälle',
  creatingAssembly: 'Valmistellaan lähetystä...',
  creatingAssemblyFailed: 'Transloadit: Assemblyn luonti epäonnistui',
  dashboardTitle: 'Tiedoston Lataaja',
  dashboardWindowTitle: 'Tiedoston latausikkuna (Paina Esc sulkeaksesi)',
  dataUploadedOfTotal: '%{complete} / %{total}',
  done: 'Valmis',
  dropHereOr: 'Raahaa tiedostot tähän tai %{browse}',
  dropHint: 'Raahaa tiedostot tähän',
  dropPaste: 'Raahaa tiedostot tähän, liitä tai %{browse}',
  dropPasteImport: 'Raahaa tiedostot tähän, liitä, %{browse} tai tuo',
  edit: 'Muokkaa',
  editFile: 'Muokkaa tiedostoa',
  editing: 'Muokataan %{file}',
  emptyFolderAdded: 'Ei lisätty tiedostoja tyhjästä kansiosta',
  encoding: 'Koodataan...',
  enterCorrectUrl: 'Epäkelpo osoite: Varmista, että osoite osoittaa suoraan tiedostoon',
  enterUrlToImport: 'Anna osoite tuodaksesi tiedoston',
  exceedsSize: 'Tiedoston koko ylittää sallitun maksimin',
  failedToFetch: 'Companion ei voinut ladata tiedostoa osoitteesta, onko osoite varmasti oikea?',
  failedToUpload: 'Ei voitu lähettää tiedostoa %{file}',
  fileSource: 'Tiedoston lähde: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} / %{smart_count} tiedostosta lähetetty',
    '1': '%{complete} / %{smart_count} tiedostoa lähetetty',
    '2': '%{complete} / %{smart_count} tiedostoa lähetetty'
  },
  filter: 'Suodata',
  finishEditingFile: 'Lopeta tiedoston muokkaus',
  folderAdded: {
    '0': 'Lisätty %{smart_count} tiedosto kansiosta %{folder}',
    '1': 'Lisätty %{smart_count} tiedostoa kansiosta %{folder}',
    '2': 'Lisätty %{smart_count} tiedostoa kansiosta %{folder}'
  },
  import: 'Tuo',
  importFrom: 'Tuo %{name}',
  link: 'Linkki',
  loading: 'Ladataan...',
  logOut: 'Kirjaudu ulos',
  myDevice: 'Laitteeltani',
  noFilesFound: 'Sinulla ei ole tiedostoja tai kansioita täällä',
  noInternetConnection: 'Ei Internet-yhteyttä',
  openFolderNamed: 'Avaa kansio %{name}',
  pause: 'Keskeytä',
  pauseUpload: 'Keskeytä lähetys',
  paused: 'Keskeytetty',
  poweredBy: 'Powered by',
  preparingUpload: 'Valmistellaan lähetystä...',
  processingXFiles: {
    '0': 'Käsitellään %{smart_count} tiedostoa',
    '1': 'Käsitellään %{smart_count} tiedostoa',
    '2': 'Käsitellään %{smart_count} tiedostoa'
  },
  removeFile: 'Poista tiedosto',
  resetFilter: 'Resetoi suodatin',
  resume: 'Jatka',
  resumeUpload: 'Jatka lähetystä',
  retry: 'Yritä uudelleen',
  retryUpload: 'Yritä lähetystä uudelleen',
  saveChanges: 'Tallenna muutokset',
  selectAllFilesFromFolderNamed: 'Valitse kaikki tiedostot kansiosta %{name}',
  selectFileNamed: 'Valitse tiedosto %{name}',
  selectX: {
    '0': 'Valitse %{smart_count}',
    '1': 'Valitse %{smart_count}',
    '2': 'Valitse %{smart_count}'
  },
  smile: 'Hymyile!',
  startRecording: 'Aloita videon tallennus',
  stopRecording: 'Lopeta videon tallennus',
  takePicture: 'Ota kuva',
  timedOut: 'Lähetys jumittunut %{seconds} sekunniksi, keskeytetään.',
  unselectAllFilesFromFolderNamed: 'Poista tiedostojen valinta kansiossa %{name}',
  unselectFileNamed: 'Poista valinta tiedostosta %{name}',
  upload: 'Lähetä',
  uploadComplete: 'Lähetys valmis',
  uploadFailed: 'Lähetys epäonnistui',
  uploadPaused: 'Lähetys keskeytetty',
  uploadXFiles: {
    '0': 'Lähetä %{smart_count} tiedosto',
    '1': 'Lähetä %{smart_count} tiedostoa',
    '2': 'Lähetä %{smart_count} tiedostoa'
  },
  uploadXNewFiles: {
    '0': 'Lähetä +%{smart_count} tiedosto',
    '1': 'Lähetä +%{smart_count} tiedostoa',
    '2': 'Lähetä +%{smart_count} tiedostoa'
  },
  uploading: 'Lähetetään',
  uploadingXFiles: {
    '0': 'Lähetetään %{smart_count} tiedosto',
    '1': 'Lähetetään %{smart_count} tiedostoa',
    '2': 'Lähetetään %{smart_count} tiedostoa'
  },
  xFilesSelected: {
    '0': '%{smart_count} tiedosto valittu',
    '1': '%{smart_count} tiedostoa valittu',
    '2': '%{smart_count} tiedostoa valittu'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} tiedosto added',
    '1': '%{smart_count} tiedostoa added',
    '2': '%{smart_count} tiedostoa added'
  },
  xTimeLeft: '%{time} jäljellä',
  youCanOnlyUploadFileTypes: 'Sallitut tiedostomuodot: %{types}',
  youCanOnlyUploadX: {
    '0': 'Voit lähettää vain %{smart_count} tiedosto',
    '1': 'Voit lähettää vain %{smart_count} tiedostoa',
    '2': 'Voit lähettää vain %{smart_count} tiedostoa'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Sinun pitää valita vähintään %{smart_count} tiedosto',
    '1': 'Sinun pitää valita vähintään %{smart_count} tiedostoa',
    '2': 'Sinun pitää valita vähintään %{smart_count} tiedostoa'
  }
};

fi_FI.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.fi_FI = fi_FI;
}

module.exports = fi_FI;
},{}],45:[function(require,module,exports){
var fr_FR = {};
fr_FR.strings = {
  addMoreFiles: 'Ajouter d\'autres fichiers',
  addingMoreFiles: 'En train d\'ajouter des fichiers',
  allowAccessDescription: 'Pour prendre des photos ou enregistrer une vidéo avec votre caméra, veuillez autoriser l\'accès à votre caméra pour ce site.',
  allowAccessTitle: 'Veuillez autoriser l\'accès à votre caméra',
  authenticateWith: 'Se connecter à %{pluginName}',
  authenticateWithTitle: 'Veuillez vous authentifier avec %{pluginName} pour sélectionner les fichiers',
  back: 'Retour',
  addMore: 'Ajouter d\'autres',
  browse: 'naviguer',
  cancel: 'Annuler',
  cancelUpload: 'Annuler téléchargement',
  chooseFiles: 'Choisir des fichiers',
  closeModal: 'Fermer fenêtre',
  companionAuthError: 'Autorisation requise',
  companionError: 'Connexion avec Companion a échoué',
  complete: 'Terminé',
  connectedToInternet: 'Connecté à Internet',
  copyLink: 'Copier lien',
  copyLinkToClipboardFallback: 'Copier le lien en dessous',
  copyLinkToClipboardSuccess: 'Lien copié',
  creatingAssembly: 'Préparation du téléchargement...',
  creatingAssemblyFailed: 'Transloadit: Impossible de créer une Assembly',
  dashboardTitle: 'Téléchargeur de fichier',
  dashboardWindowTitle: 'Fenêtre de téléchargeur de fichier (Appuyez sur echap pour fermer)',
  dataUploadedOfTotal: '%{complete} sur %{total}',
  done: 'Terminé',
  dropHereOr: 'Déposez les fichiers ici ou %{browse}',
  dropHint: 'Déposez vos fichiers ici',
  dropPaste: 'Déposez les fichiers ici, coller ou %{browse}',
  dropPasteImport: 'Déposez les fichiers ici, coller, %{browse} ou importer du',
  edit: 'Modifier',
  editFile: 'Modifier fichier',
  editing: 'Modification en cours du %{file}',
  emptyFolderAdded: 'Aucun fichier n\'a été ajouté depuis un dossier vide',
  encoding: 'Traitement...',
  enterCorrectUrl: 'Lien incorrecte: Assurez-vous que vous entrez un lien direct vers le fichier',
  enterUrlToImport: 'Entrez un lien ou importer un fichier',
  exceedsSize: 'Ce fichier dépasse la taille maximale autorisée de',
  failedToFetch: 'Companion a échoué à récupérer ce lien, assurez-vous que c\'est correct',
  failedToUpload: 'Le téléchargement de %{file} a échoué',
  fileSource: 'Fichier source: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} sur %{smart_count} fichier téléchargé',
    '1': '%{complete} sur %{smart_count} fichiers téléchargés',
    '2': '%{complete} sur %{smart_count} fichiers téléchargés'
  },
  filter: 'Filtrer',
  finishEditingFile: 'Terminer l\'édition du fichier',
  folderAdded: {
    '0': '%{smart_count} ajouté fichier de %{folder}',
    '1': '%{smart_count} ajouté fichiers de %{folder}',
    '2': '%{smart_count} ajouté fichiers de %{folder}'
  },
  import: 'Importer',
  importFrom: 'Importer du %{name}',
  link: 'Lien',
  loading: 'Chargement...',
  logOut: 'Déconnexion',
  myDevice: 'Mon appareil',
  noFilesFound: 'Vous n\'avez aucun fichier ou dossier ici',
  noInternetConnection: 'Pas de connexion à Internet',
  pause: 'Pause',
  pauseUpload: 'Mettre en pause le téléchargement',
  paused: 'En pause',
  poweredBy: 'Soutenu par',
  preparingUpload: 'Préparation du téléchargement...',
  processingXFiles: {
    '0': 'Traitement de %{smart_count} fichier',
    '1': 'Traitement de %{smart_count} fichiers',
    '2': 'Traitement de %{smart_count} fichiers'
  },
  removeFile: 'Effacer le fichier',
  resetFilter: 'Réinitialiser filtre',
  resume: 'Continuer',
  resumeUpload: 'Continuer le téléchargement',
  retry: 'Réessayer',
  retryUpload: 'Réessayez le téléchargement',
  saveChanges: 'Sauvegarder les modifications',
  selectX: {
    '0': 'Sélectionner %{smart_count}',
    '1': 'Sélectionner %{smart_count}',
    '2': 'Sélectionner %{smart_count}'
  },
  smile: 'Souris!',
  startRecording: 'Commencer l\'enregistrement vidéo',
  stopRecording: 'Arrêter l\'enregistrement vidéo',
  takePicture: 'Prendre une photo',
  timedOut: 'Téléchargement bloqué pour %{seconds} secondes, annulation.',
  upload: 'Télécharger',
  uploadComplete: 'Téléchargement terminé',
  uploadFailed: 'Téléchargement a échoué',
  uploadPaused: 'Téléchargement mis en pause',
  uploadXFiles: {
    '0': 'Télécharger %{smart_count} fichier',
    '1': 'Télécharger %{smart_count} fichiers',
    '2': 'Télécharger %{smart_count} fichiers'
  },
  uploadXNewFiles: {
    '0': 'Télécharger +%{smart_count} fichier',
    '1': 'Télécharger +%{smart_count} fichiers',
    '2': 'Télécharger +%{smart_count} fichiers'
  },
  uploading: 'Téléchargement en cours',
  uploadingXFiles: {
    '0': 'Uploading %{smart_count} file',
    '1': 'Uploading %{smart_count} files',
    '2': 'Uploading %{smart_count} files'
  },
  xFilesSelected: {
    '0': '%{smart_count} fichier sélectionné',
    '1': '%{smart_count} fichiers sélectionnés',
    '2': '%{smart_count} fichiers sélectionnés'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} autre fichier ajouté',
    '1': '%{smart_count} autres fichiers ajoutés',
    '2': '%{smart_count} autres fichiers ajoutés'
  },
  xTimeLeft: '%{time} restantes',
  youCanOnlyUploadFileTypes: 'Vous pouvez seulement télécharger: %{types}',
  youCanOnlyUploadX: {
    '0': 'Vous pouvez seulement télécharger %{smart_count} fichier',
    '1': 'Vous pouvez seulement télécharger %{smart_count} fichiers',
    '2': 'Vous pouvez seulement télécharger %{smart_count} fichiers'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Vous devez sélectionner au moins %{smart_count} fichier',
    '1': 'Vous devez sélectionner au moins %{smart_count} fichiers',
    '2': 'Vous devez sélectionner au moins %{smart_count} fichiers'
  },
  selectAllFilesFromFolderNamed: 'Sélectionner tous les fichiers du dossier %{name}',
  unselectAllFilesFromFolderNamed: 'Désélectionner tous les fichiers du dossier%{name}',
  selectFileNamed: 'Choisir le dossier %{name}',
  unselectFileNamed: 'Désélectionner le fichier %{name}',
  openFolderNamed: 'Dossier ouvert %{name}'
};

fr_FR.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.fr_FR = fr_FR;
}

module.exports = fr_FR;
},{}],46:[function(require,module,exports){
var hu_HU = {};
hu_HU.contributors = ['nagyv'];
hu_HU.strings = {
  addMore: 'Adj hozzá többet',
  addMoreFiles: 'További fájlok hozzáadása',
  addingMoreFiles: 'További fájlok hozzáadása',
  allowAccessDescription: 'A képek vagy videó felvételéhez, kérjük engedélyezze a kamera használatát ezen az oldalon.',
  allowAccessTitle: 'Engedélyezze a kamera használatát',
  authenticateWith: 'Kapcsolódás a %{pluginName}-val',
  authenticateWithTitle: 'Kérjük lépjen be a %{pluginName}-ba a fájlok kiválasztásához',
  back: 'Vissza',
  browse: 'válasszon',
  cancel: 'Mégse',
  cancelUpload: 'Feltöltés megszakítása',
  chooseFiles: 'Fájlok kiválasztása',
  closeModal: 'Ablak bezárása',
  companionAuthError: 'Bejelentkezés szükséges',
  companionError: 'A Companion-hoz történő kapcsolódás nem sikerült',
  complete: 'Kész',
  connectedToInternet: 'Kapcsolódótt az Internethez',
  copyLink: 'Link másolása',
  copyLinkToClipboardFallback: 'Másolja ki az alábbi URL-t',
  copyLinkToClipboardSuccess: 'Link a vágólapra másolva',
  creatingAssembly: 'Feltöltés előkészítése...',
  creatingAssemblyFailed: 'Transloadit: Nem sikerült létrehozni az Assembly-t',
  dashboardTitle: 'Fájlfeltöltő',
  dashboardWindowTitle: 'Fájlfeltöltő ablak (Escape a bezáráshoz)',
  dataUploadedOfTotal: '%{complete} / %{total}',
  done: 'Kész',
  dropHereOr: 'Ejtse ide vagy %{browse} fájlt',
  dropHint: 'Ejtse ide a fájlokat',
  dropPaste: 'Ejtse vagy másolja ide a fájlokat, vagy %{browse}',
  dropPasteImport: 'Ejtse vagy másolja ide a fájlokat, vagy %{browse} vagy importálja',
  edit: 'Szerkesztés',
  editFile: 'Fájl szerkesztése',
  editing: '%{file} szerkesztése',
  emptyFolderAdded: 'Az üres mappából nem kerültek fájlok hozzáadásra',
  encoding: 'Kódolás...',
  enterCorrectUrl: 'Érvénytelen URL: Bizonyosodjon meg róla, hogy egy fájlra mutató közvetlen linket ír be',
  enterUrlToImport: 'Adjon meg egy URL-t a fájl importálásához',
  exceedsSize: 'Ez a fájl meghaladja a maximális megengedett méretet',
  failedToFetch: 'A Companion-nak nem sikerült az URL letöltése, győzödjön meg az URL helyességéről',
  failedToUpload: '%{file}-t nem sikerült feltölteni',
  fileSource: 'Fájl forrása: %{name}',
  filesUploadedOfTotal: {
    '0': 'A %{smart_count}-ból %{complete} fájl feltöltve',
    '1': 'A %{smart_count}-ból %{complete} fájl feltöltve',
    '2': 'A %{smart_count}-ból %{complete} fájl feltöltve'
  },
  filter: 'Szűrő',
  finishEditingFile: 'Fájl szerkesztésének befejezése',
  folderAdded: {
    '0': 'A %{folder}-ból %{smart_count} fájl hozzáadva',
    '1': 'A %{folder}-ból %{smart_count} fájl hozzáadva',
    '2': 'A %{folder}-ból %{smart_count} fájl hozzáadva'
  },
  import: 'Importálás',
  importFrom: 'Importálás innen: %{name}',
  link: 'Link',
  loading: 'Töltés...',
  logOut: 'Kijelentkezés',
  myDevice: 'Eszközöm',
  noFilesFound: 'Nem találhatóak fájlok vagy könyvtárak',
  noInternetConnection: 'Nincsen Internetkapcsolat',
  pause: 'Szünet',
  pauseUpload: 'Feltöltés szüneteltetése',
  paused: 'Szüneteltetve',
  poweredBy: 'Meghajtja az',
  preparingUpload: 'Feltöltés előkészítése...',
  processingXFiles: {
    '0': '%{smart_count} fájl feldolgozása',
    '1': '%{smart_count} fájl feldolgozása',
    '2': '%{smart_count} fájl feldolgozása'
  },
  removeFile: 'Fájl törlése',
  resetFilter: 'Szűrő visszaállítása',
  resume: 'Folytatás',
  resumeUpload: 'Feltöltés folytatása',
  retry: 'Újra',
  retryUpload: 'Próbálja újra a feltöltést',
  saveChanges: 'Változtatások mentése',
  selectX: {
    '0': 'Válassza az %{smart_count} lehetőséget',
    '1': 'Válassza az %{smart_count} lehetőséget',
    '2': 'Válassza az %{smart_count} lehetőséget'
  },
  smile: 'Csíííz!',
  startRecording: 'Videófeltével indul',
  stopRecording: 'Videófelvétel megáll',
  takePicture: 'Fénykép',
  timedOut: 'A feltöltés elakadt %{seconds} másodpercig, a feltöltés leáll.',
  upload: 'Feltöltés',
  uploadComplete: 'A feltöltés kész',
  uploadFailed: 'Sikertelen feltöltés',
  uploadPaused: 'Szüneteltetett feltöltés',
  uploadXFiles: {
    '0': '%{smart_count} fájl feltöltése',
    '1': '%{smart_count} fájl feltöltése',
    '2': '%{smart_count} fájl feltöltése'
  },
  uploadXNewFiles: {
    '0': '+%{smart_count} fájl feltöltése',
    '1': '+%{smart_count} fájl feltöltése',
    '2': '+%{smart_count} fájl feltöltése'
  },
  uploading: 'Feltölés',
  uploadingXFiles: {
    '0': '+%{smart_count} fájl feltöltése',
    '1': '+%{smart_count} fájl feltöltése',
    '2': '+%{smart_count} fájl feltöltése'
  },
  xFilesSelected: {
    '0': '%{smart_count} fájl kiválasztva',
    '1': '%{smart_count} fájl kiválasztva',
    '2': '%{smart_count} fájl kiválasztva'
  },
  xMoreFilesAdded: {
    '0': 'további %{smart_count} fájl hozzáadva',
    '1': 'további %{smart_count} fájl hozzáadva',
    '2': 'további %{smart_count} fájl hozzáadva'
  },
  xTimeLeft: '%{time} van hátra',
  youCanOnlyUploadFileTypes: 'Feltölthető formátumok: %{types}',
  youCanOnlyUploadX: {
    '0': 'Csak %{smart_count} fájl tölthető fel',
    '1': 'Csak %{smart_count} fájl tölthető fel',
    '2': 'Csak %{smart_count} fájl tölthető fel'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Legalább %{smart_count} fájlt ki kell választania',
    '1': 'Legalább %{smart_count} fájlt ki kell választania',
    '2': 'Legalább %{smart_count} fájlt ki kell választania'
  },
  selectAllFilesFromFolderNamed: 'Válassza ki az összes fájlt a mappából %{name}',
  unselectAllFilesFromFolderNamed: 'Az összes fájl törlése a mappából %{name}',
  selectFileNamed: 'Válaszd ki a fájlt %{name}',
  unselectFileNamed: 'A fájl törlése %{name}',
  openFolderNamed: 'Nyitott mappa %{name}'
};

hu_HU.pluralize = function (n) {
  return 0;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.hu_HU = hu_HU;
}

module.exports = hu_HU;
},{}],47:[function(require,module,exports){
var it_IT = {};
it_IT.strings = {
  addMoreFiles: 'Aggiungi più file',
  addingMoreFiles: 'Sto aggiungendo altri file',
  allowAccessDescription: 'Per acquisire foto o video con la tua fotocamera, abilitane l\'accesso da questo sito.',
  allowAccessTitle: 'Abilita l\'accesso alla fotocamera',
  authenticateWith: 'Connetti a %{pluginName}',
  authenticateWithTitle: 'Autenticati con %{pluginName} per selezionare i file',
  back: 'Indietro',
  addMore: 'Aggiungi più',
  browse: 'sfoglia',
  cancel: 'Annulla',
  cancelUpload: 'Annulla upload',
  chooseFiles: 'Scegli i file',
  closeModal: 'Chiudi modale',
  companionAuthError: 'Autorizzazione richiesta',
  companionError: 'Connessione con Companion fallita',
  complete: 'Completato',
  connectedToInternet: 'Connesso a internet',
  copyLink: 'Copia link',
  copyLinkToClipboardFallback: 'Copia l\'URL sottostante',
  copyLinkToClipboardSuccess: 'Link copiato',
  creatingAssembly: 'Upload in preparazione...',
  creatingAssemblyFailed: 'Transloadit: Non ho potuto creare l\'Assembly',
  dashboardTitle: 'File Uploader',
  dashboardWindowTitle: 'File Uploader (Premi Esc per chiudere)',
  dataUploadedOfTotal: '%{complete} di %{total}',
  done: 'Fatto',
  dropHereOr: 'Trascina i file qui o %{browse}',
  dropHint: 'Trascina i file qui',
  dropPaste: 'Trascina i file qui, incolla o %{browse}',
  dropPasteImport: 'Trascina i file qui, incolla, %{browse} o importa da',
  edit: 'Modifica',
  editFile: 'Modifica file',
  editing: 'Modifica %{file}',
  emptyFolderAdded: 'Nessun file aggiunto dalla cartella vuota',
  encoding: 'Encoding...',
  enterCorrectUrl: 'URL non corretta: assicurati che sia un link diretto ad un file',
  enterUrlToImport: 'Immetti l\'URL per importare un file',
  exceedsSize: 'Questo file supera la dimensione massima di',
  failedToFetch: 'Impossibile verificare questa URL, assicurati che sia corretta',
  failedToUpload: 'Upload del file %{file} non riuscito',
  fileSource: 'Sorgente file: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} di %{smart_count} file caricato',
    '1': '%{complete} di %{smart_count} file caricati',
    '2': '%{complete} di %{smart_count} file caricati'
  },
  filter: 'Filter',
  finishEditingFile: 'Finish editing file',
  folderAdded: {
    '0': 'Aggiunto %{smart_count} file da %{folder}',
    '1': 'Aggiunti %{smart_count} file da %{folder}',
    '2': 'Aggiunti %{smart_count} file da %{folder}'
  },
  import: 'Importa',
  importFrom: 'Importa da %{name}',
  link: 'Link',
  loading: 'Caricamento...',
  logOut: 'Logout',
  myDevice: 'Il mio computer',
  noFilesFound: 'Non hai file o cartelle qui',
  noInternetConnection: 'Nessuna connessione a internet',
  pause: 'Pausa',
  pauseUpload: 'Pausa upload',
  paused: 'In pausa',
  poweredBy: 'Powered by',
  preparingUpload: 'Upload in preparazione...',
  processingXFiles: {
    '0': 'Sto processando %{smart_count} file',
    '1': 'Sto processando %{smart_count} file',
    '2': 'Sto processando %{smart_count} file'
  },
  removeFile: 'Rimuovi il file',
  resetFilter: 'Ripristina filtro',
  resume: 'Riprendi',
  resumeUpload: 'Riprendi l\'upload',
  retry: 'Riprova',
  retryUpload: 'Riprova l\'upload',
  saveChanges: 'Salva le modifiche',
  selectX: {
    '0': 'Seleziona %{smart_count}',
    '1': 'Seleziona %{smart_count}',
    '2': 'Seleziona %{smart_count}'
  },
  smile: 'Sorridi!',
  startRecording: 'Inizia la registrazione del video',
  stopRecording: 'Interrompi la registrazione del video',
  takePicture: 'Scatta una foto',
  timedOut: 'Upload fermo da %{seconds} secondi, sto annullando.',
  upload: 'Upload',
  uploadComplete: 'Upload completato',
  uploadFailed: 'Upload non riuscito',
  uploadPaused: 'Upload in pausa',
  uploadXFiles: {
    '0': 'Upload di %{smart_count} file',
    '1': 'Upload di %{smart_count} file',
    '2': 'Upload di %{smart_count} file'
  },
  uploadXNewFiles: {
    '0': 'Upload +%{smart_count} file',
    '1': 'Upload +%{smart_count} file',
    '2': 'Upload +%{smart_count} file'
  },
  uploading: 'In caricamento',
  uploadingXFiles: {
    '0': 'Caricando %{smart_count} file',
    '1': 'Caricando %{smart_count} file',
    '2': 'Caricando %{smart_count} file'
  },
  xFilesSelected: {
    '0': '%{smart_count} file selezionato',
    '1': '%{smart_count} file selezionati',
    '2': '%{smart_count} file selezionati'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} alto file aggiunto',
    '1': '%{smart_count} altri file aggiunti',
    '2': '%{smart_count} ltri file aggiunti'
  },
  xTimeLeft: '%{time} rimasto',
  youCanOnlyUploadFileTypes: 'Puoi caricare solamente: %{types}',
  youCanOnlyUploadX: {
    '0': 'Puoi caricare %{smart_count} solo file',
    '1': 'Puoi caricare solo %{smart_count} file',
    '2': 'Puoi caricare solo %{smart_count} file'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Devi selezionare almeno %{smart_count} file',
    '1': 'Devi selezionare almeno %{smart_count} file',
    '2': 'Devi selezionare almeno %{smart_count} file'
  },
  selectAllFilesFromFolderNamed: 'Seleziona tutti i file dalla cartella %{name}',
  unselectAllFilesFromFolderNamed: 'Deseleziona tutti i file dalla cartella %{name}',
  selectFileNamed: 'Seleziona il file %{name}',
  unselectFileNamed: 'Deseleziona il file %{name}',
  openFolderNamed: 'Cartella aperta %{name}'
};

it_IT.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.it_IT = it_IT;
}

module.exports = it_IT;
},{}],48:[function(require,module,exports){
var ja_JP = {};
ja_JP.strings = {
  addMore: 'さらに追加',
  addMoreFiles: 'ファイルを追加',
  addingMoreFiles: 'ファイルを追加しています',
  allowAccessDescription: 'カメラやビデオの機能を使用するには、カメラへのアクセスを許可してください。',
  allowAccessTitle: 'カメラへのアクセスを許可してください',
  authenticateWith: '%{pluginName}に接続します',
  authenticateWithTitle: 'ファイルを選択するには%{pluginName}で認証してください',
  back: '戻る',
  browse: '参照',
  cancel: 'キャンセル',
  cancelUpload: 'アップロードをキャンセル',
  chooseFiles: 'ファイルを選択',
  closeModal: 'モーダルを閉じる',
  companionAuthError: '認証が必要です',
  companionError: 'Companionとの接続に失敗しました',
  complete: '完了しました',
  connectedToInternet: 'インターネットに接続しました',
  copyLink: 'リンクをコピー',
  copyLinkToClipboardFallback: '以下のURLをコピー',
  copyLinkToClipboardSuccess: 'リンクをクリップボードにコピーしました',
  creatingAssembly: 'アップロードの準備をしています...',
  creatingAssemblyFailed: 'Transloadit: アセンブリを作成できませんでした',
  dashboardTitle: 'ファイルアップローダー',
  dashboardWindowTitle: 'ファイルアップローダーウィンドウ（閉じるにはEscapeキーを押してください）',
  dataUploadedOfTotal: '%{total} %{complete}',
  done: '完了しました',
  dropHereOr: 'ここにファイルをドロップするか%{browse}してください',
  dropHint: 'ここにファイルをドロップしてください',
  dropPaste: 'ここにファイルをドロップするか、貼り付けるか、%{browse}してください',
  dropPasteImport: 'ここにファイルをドロップするか、貼り付けるか、%{browse}するか、以下からインポートしてください',
  edit: '編集',
  editFile: 'ファイルを編集',
  editing: '%{file}を編集しています',
  emptyFolderAdded: 'フォルダが空なためファイルが追加されませんでした',
  encoding: 'エンコードしています...',
  enterCorrectUrl: '不正なURL: ファイルへの直接リンクが入力されていることを確認してください',
  enterUrlToImport: 'ファイルをインポートするためのURLを入力してください',
  exceedsSize: 'ファイルサイズが大きすぎます',
  failedToFetch: 'CompanionがURLを取得できませんでした。URLが正しいか確認してください',
  failedToUpload: '%{file}のアップロードに失敗しました',
  fileSource: '元ファイル：%{name}',
  filesUploadedOfTotal: {
    '0': '%{smart_count} 個のファイルのアップロードが%{complete}',
    '1': '%{smart_count} 個のファイルのアップロードが%{complete}',
    '2': '%{cmart_count} 個のファイルのアップロードが%{complete}'
  },
  filter: 'フィルタ',
  finishEditingFile: 'ファイルの編集を終了',
  folderAdded: {
    '0': '%{folder} から% {smart_count} 個のファイルを追加しました',
    '1': '%{folder} から% {smart_count} 個のファイルを追加しました',
    '2': '%{folder} から% {smart_count} 個のファイルを追加しました'
  },
  import: 'インポート',
  importFrom: '%{name}からインポート',
  link: 'リンク',
  loading: 'ロード中...',
  logOut: 'ログアウト',
  myDevice: 'マイデバイス',
  noFilesFound: 'ファイルやフォルダがありません',
  noInternetConnection: 'インターネット接続がありません',
  pause: '一時停止',
  pauseUpload: 'アップロードを一時停止',
  paused: '停止中',
  poweredBy: 'Powered by',
  preparingUpload: 'アップロードを準備中...',
  processingXFiles: {
    '0': '%{smart_count} ファイル処理中',
    '1': '%{smart_count} ファイル処理中',
    '2': '%{smart_count} ファイル処理中'
  },
  removeFile: 'ファイルを消す',
  resetFilter: 'フィルタをリセット',
  resume: '再開',
  resumeUpload: 'アップロードを再開',
  retry: 'リトライ',
  retryUpload: 'アップロードをリトライ',
  saveChanges: '変更を保存',
  selectX: {
    '0': '%{smart_count} を選択',
    '1': '%{smart_count} を選択',
    '2': '%{smart_count} を選択'
  },
  smile: 'スマイル〜！',
  startRecording: '録画開始',
  stopRecording: '録画停止',
  takePicture: '写真を撮る',
  timedOut: 'アップロードが %{seconds} 秒間止まった為中断しました',
  upload: 'アップロード',
  uploadComplete: 'アップロード完了',
  uploadFailed: 'アップロード失敗',
  uploadPaused: 'アップロード一時停止',
  uploadXFiles: {
    '0': '%{smart_count} ファイルをアップロード',
    '1': '%{smart_count} ファイルをアップロード',
    '2': '%{smart_count} ファイルをアップロード'
  },
  uploadXNewFiles: {
    '0': '+%{smart_count} ファイルをアップロード',
    '1': '+%{smart_count} ファイルをアップロード',
    '2': '+%{smart_count} ファイルをアップロード'
  },
  uploading: 'アップロード中',
  uploadingXFiles: {
    '0': '%{smart_count} ファイルアップロード中',
    '1': '%{smart_count} ファイルアップロード中',
    '2': '%{smart_count} ファイルアップロード中'
  },
  xFilesSelected: {
    '0': '%{smart_count} ファイルを選択',
    '1': '%{smart_count} ファイルを選択',
    '2': '%{smart_count} ファイルを選択'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} ファイルを追加',
    '1': '%{smart_count} ファイルを追加',
    '2': '%{smart_count} ファイルを追加'
  },
  xTimeLeft: '残り %{time}',
  youCanOnlyUploadFileTypes: '許可されているファイル形式は次の物です: %{types}',
  youCanOnlyUploadX: {
    '0': '%{smart_count} ファイル数のみアップロード可能です',
    '1': '%{smart_count} ファイル数のみアップロード可能です',
    '2': '%{smart_count} ファイル数のみアップロード可能です'
  },
  youHaveToAtLeastSelectX: {
    '0': '最低でも %{smart_count} ファイル選択してください',
    '1': '最低でも %{smart_count} ファイル選択してください',
    '2': '最低でも %{smart_count} ファイル選択してください'
  },
  selectAllFilesFromFolderNamed: 'フォルダからすべてのファイルを選択 %{name}',
  unselectAllFilesFromFolderNamed: 'フォルダからすべてのファイルを選択解除 %{name}',
  selectFileNamed: 'ファイルを選ぶ %{name}',
  unselectFileNamed: 'ファイルの選択を解除 %{name}',
  openFolderNamed: '開いたフォルダ %{name}'
};

ja_JP.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.ja_JP = ja_JP;
}

module.exports = ja_JP;
},{}],49:[function(require,module,exports){
var nl_NL = {};
nl_NL.strings = {
  addMoreFiles: 'Extra bestanden toevoegen',
  addingMoreFiles: 'Bezig met extra bestanden toe te voegen',
  allowAccessDescription: 'Geef toestemming om foto\'s of videobeelden te kunnen maken.',
  allowAccessTitle: 'Geef toestemming om je camera te gebruiken',
  authenticateWith: 'Verbinden met %{pluginName}',
  authenticateWithTitle: 'Verbindt met %{pluginName} om bestanden te selecteren',
  back: 'Terug',
  addMore: 'Meer toevoegen',
  browse: 'blader',
  cancel: 'Annuleer',
  cancelUpload: 'Annuleer upload',
  chooseFiles: 'Kies bestanden',
  closeModal: 'Sluit Venster',
  companionAuthError: 'Toestemming vereist',
  companionError: 'Verbinding met Companion mislukt',
  complete: 'Voltooid',
  connectedToInternet: 'Verbonden met het internet',
  copyLink: 'Kopieer link',
  copyLinkToClipboardFallback: 'Kopieer de onderstaande URL',
  copyLinkToClipboardSuccess: 'Link naar klembord gekopieerd',
  creatingAssembly: 'Upload voorbereiden...',
  creatingAssemblyFailed: 'Transloadit: Kon Assembly niet creëeren',
  dashboardTitle: 'Uppy Dashboard',
  dashboardWindowTitle: 'Uppy Dashboard Venster (Druk escape om te sluiten)',
  dataUploadedOfTotal: '%{complete} van %{total}',
  done: 'Klaar',
  dropHereOr: 'Sleep hier je bestanden naartoe of %{browse}',
  dropHint: 'Sleep hier je bestanden naartoe',
  dropPaste: 'Sleep hier je bestanden naartoe, plak of %{browse}',
  dropPasteImport: 'Sleep hier je bestanden naartoe, plak, %{browse} of importeer vanuit',
  edit: 'Aanpassen',
  editFile: 'Bestand aanpassen',
  editing: 'Bezig %{file} aan te passen',
  emptyFolderAdded: 'Er werden geen bestanden toegevoegd uit de lege map',
  encoding: 'Coderen...',
  enterCorrectUrl: 'Ongeldige URL: Zorg dat je een directe link naar een bestand invoert',
  enterUrlToImport: 'Voeg URL toe om een bestand te importeren',
  exceedsSize: 'Dit bestand overschrijdt de maximaal toegelaten bestandsgrootte van',
  failedToFetch: 'Companion kan deze URL niet laden, controleer of de URL correct is',
  failedToUpload: 'Kon %{file} niet uploaden',
  fileSource: 'Bronbestand: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} van %{smart_count} bestand geüpload',
    '1': '%{complete} van %{smart_count} bestanden geüpload',
    '2': '%{complete} van %{smart_count} bestanden geüpload'
  },
  filter: 'Filter',
  finishEditingFile: 'Klaar met bestand aan te passen',
  folderAdded: {
    '0': '%{smart_count} bestand uit %{folder} toegevoegd',
    '1': '%{smart_count} bestanden uit %{folder} toegevoegd',
    '2': '%{smart_count} bestanden uit %{folder} toegevoegd'
  },
  import: 'Importeer',
  importFrom: 'Importeer vanuit %{name}',
  link: 'Link',
  loading: 'Bezig met laden...',
  logOut: 'Uitloggen',
  myDevice: 'Mijn apparaat',
  noFilesFound: 'Geen bestanden of mappen gevonden',
  noInternetConnection: 'Geen internetverbinding',
  pause: 'Pauze',
  pauseUpload: 'Pauzeer upload',
  paused: 'Gepauzeerd',
  poweredBy: 'Mogelijk gemaakt door',
  preparingUpload: 'Upload voorbereiden...',
  processingXFiles: {
    '0': 'Bezig met %{smart_count} bestand te verwerken',
    '1': 'Bezig met %{smart_count} bestanden te verwerken',
    '2': 'Bezig met %{smart_count} bestanden te verwerken'
  },
  removeFile: 'Bestand verwijderen',
  resetFilter: 'Filter resetten',
  resume: 'Hervatten',
  resumeUpload: 'Upload hervatten',
  retry: 'Opnieuw',
  retryUpload: 'Upload opnieuw',
  saveChanges: 'Wijzigingen opslaan',
  selectX: {
    '0': 'Selecteer %{smart_count}',
    '1': 'Selecteer %{smart_count}',
    '2': 'Selecteer %{smart_count}'
  },
  smile: 'Lach!',
  startRecording: 'Start video-opname',
  stopRecording: 'Stop video-opname',
  takePicture: 'Neem een foto',
  timedOut: 'Upload al gedurende %{seconds} seconden vastgelopen, bezig afbreken upload.',
  upload: 'Upload',
  uploadComplete: 'Upload voltooid',
  uploadFailed: 'Upload mislukt',
  uploadPaused: 'Upload gepauzeerd',
  uploadXFiles: {
    '0': 'Upload %{smart_count} bestand',
    '1': 'Upload %{smart_count} bestanden',
    '2': 'Upload %{smart_count} bestanden'
  },
  uploadXNewFiles: {
    '0': 'Upload +%{smart_count} bestand',
    '1': 'Upload +%{smart_count} bestanden',
    '2': 'Upload +%{smart_count} bestanden'
  },
  uploading: 'Bezig met uploaden',
  uploadingXFiles: {
    '0': 'Bezig met %{smart_count} bestand te uploaden',
    '1': 'Bezig met %{smart_count} bestanden te uploaden',
    '2': 'Bezig met %{smart_count} bestanden te uploaden'
  },
  xFilesSelected: {
    '0': '%{smart_count} bestand geselecteerd',
    '1': '%{smart_count} bestanden geselecteerd',
    '2': '%{smart_count} bestanden geselecteerd'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} extra bestand toegevoegd',
    '1': '%{smart_count} extra bestanden toegevoegd',
    '2': '%{smart_count} extra bestanden toegevoegd'
  },
  xTimeLeft: '%{time} over',
  youCanOnlyUploadFileTypes: 'Je kan enkel volgende types uploaden: %{types}',
  youCanOnlyUploadX: {
    '0': 'Je kan slechts %{smart_count} bestand uploaden',
    '1': 'Je kan slechts %{smart_count} bestanden uploaden',
    '2': 'Je kan slechts %{smart_count} bestanden uploaden'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Je moet minstens %{smart_count} bestand selecteren',
    '1': 'Je moet minstens %{smart_count} bestanden selecteren',
    '2': 'Je moet minstens %{smart_count} bestanden selecteren'
  },
  selectAllFilesFromFolderNamed: 'Selecteer alle bestanden uit de map %{name}',
  unselectAllFilesFromFolderNamed: 'Deselecteer alle bestanden uit de map %{name}',
  selectFileNamed: 'Selecteer bestand %{name}',
  unselectFileNamed: 'Deselecteer bestand %{name}',
  openFolderNamed: 'Open map %{name}'
};

nl_NL.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.nl_NL = nl_NL;
}

module.exports = nl_NL;
},{}],50:[function(require,module,exports){
var ru_RU = {};
ru_RU.strings = {
  addMoreFiles: 'Добавить еще файлы',
  addingMoreFiles: 'Добавление дополнительных файлов',
  allowAccessDescription: 'Чтобы сделать фото или видео, пожалуйста, разрешите доступ к камере для этого сайта',
  allowAccessTitle: 'Пожалуйста, разрешите доступ к вашей камере',
  authenticateWithTitle: 'Пожалуйста, авторизуйтесь в %{pluginName} чтобы выбрать файлы',
  authenticateWith: 'Подключиться к %{pluginName}',
  back: 'Назад',
  addMore: 'Добавить еще',
  browse: 'выберите',
  cancel: 'Отменить',
  cancelUpload: 'Отменить загрузку',
  chooseFiles: 'Выбрать файлы',
  closeModal: 'Закрыть окно',
  companionAuthError: 'Требуется авторизация',
  companionError: 'Не удалось подключиться к Companion',
  // «Готово» вместо «загрузка завершена», потому что кроме загрузки бывает encoding — транскодирование файлов
  complete: 'Готово',
  // «Нет подключения к интернету» — «Подключено к интернету»
  connectedToInternet: 'Подключено к интернету',
  copyLink: 'Скопировать ссылку',
  copyLinkToClipboardFallback: 'Скопируйте ссылку',
  copyLinkToClipboardSuccess: 'Ссылка скопирована в буфер обмена',
  creatingAssembly: 'Подготовка загрузки...',
  creatingAssemblyFailed: 'Transloadit: Не удалось создать Assembly',
  dashboardTitle: 'Загрузчик файлов',
  dashboardWindowTitle: 'Окно загрузчика файлов (Нажмите escape, чтобы закрыть)',
  dataUploadedOfTotal: '%{complete} из %{total}',
  done: 'Готово',
  dropHereOr: 'Перетащите файлы или %{browse}',
  dropHint: 'Перетащите файлы сюда',
  dropPaste: 'Перетащите файлы, вставьте или %{browse}',
  dropPasteImport: 'Перетащите файлы, вставьте, %{browse} или импортируйте',
  edit: 'Редактировать',
  editFile: 'Редактировать файл',
  editing: 'Редактируется %{file}',
  emptyFolderAdded: 'Файлы не были добавлены — папка пуста',
  encoding: 'Обработка...',
  enterCorrectUrl: 'Неправильный адрес: пожалуйста, убедитесь что вы используете прямую ссылку на файл',
  enterUrlToImport: 'Введите адрес, чтобы импортировать файл',
  exceedsSize: 'Этот файл больше максимально разрешенного размера в',
  failedToFetch: 'Companion не смог загрузить файл по ссылке, пожалуйста, убедитесь, что адрес верный',
  failedToUpload: 'Ошибка загрузки %{file}',
  fileSource: 'Источник файла: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} из %{smart_count} файла загружено',
    '1': '%{complete} из %{smart_count} файлов загружено',
    '2': '%{complete} из %{smart_count} файлов загружено'
  },
  filter: 'Фильтр',
  finishEditingFile: 'Закончить редактирование файла',
  folderAdded: {
    '0': 'Добавлен %{smart_count} файл из %{folder}',
    '1': 'Добавлено %{smart_count} файла из %{folder}',
    '2': 'Добавлено %{smart_count} файлов из %{folder}'
  },
  import: 'Импортировать',
  importFrom: 'Импортировать из %{name}',
  link: 'Ссылка',
  loading: 'Загрузка...',
  logOut: 'Выйти',
  myDevice: 'Мое устройство',
  noFilesFound: 'Здесь нет файлов или папок',
  noInternetConnection: 'Нет подключения к интернету',
  pause: 'Поставить на паузу',
  pauseUpload: 'Поставить загрузку на паузу',
  paused: 'На паузе',
  preparingUpload: 'Подготовка к загрузке...',
  processingXFiles: {
    '0': 'Обрабатывается %{smart_count} файл',
    '1': 'Обрабатываются %{smart_count} файла',
    '2': 'Обрабатываются %{smart_count} файлов'
  },
  poweredBy: 'Работает на',
  removeFile: 'Удалить файл',
  resetFilter: 'Сбросить фильтр',
  resume: 'Продолжить',
  resumeUpload: 'Продолжить загрузку',
  retry: 'Повторить попытку',
  retryUpload: 'Повторить попытку загрузки',
  saveChanges: 'Сохранить',
  selectX: {
    '0': 'Выбрать %{smart_count}',
    '1': 'Выбрать %{smart_count}',
    '2': 'Выбрать %{smart_count}'
  },
  smile: 'Улыбнитесь!',
  startRecording: 'Начать запись видео',
  stopRecording: 'Закончить запись видео',
  takePicture: 'Сделать фотографию',
  timedOut: 'Загрузка остановилась на %{seconds} секунд, отмена',
  upload: 'Загрузить',
  uploadComplete: 'Загрузка завершена',
  uploadFailed: 'Загрузка не удалась',
  uploadPaused: 'Загрузка на паузе',
  uploadXFiles: {
    '0': 'Загрузить %{smart_count} файл',
    '1': 'Загрузить %{smart_count} файла',
    '2': 'Загрузить %{smart_count} файлов'
  },
  uploadXNewFiles: {
    '0': 'Загрузить +%{smart_count} файл',
    '1': 'Загрузить +%{smart_count} файла',
    '2': 'Загрузить +%{smart_count} файлов'
  },
  uploading: 'Загрузка',
  uploadingXFiles: {
    '0': 'Загружается %{smart_count} файл',
    '1': 'Загружается %{smart_count} файла',
    '2': 'Загружается %{smart_count} файлов'
  },
  xFilesSelected: {
    '0': '%{smart_count} файл выбран',
    '1': '%{smart_count} файла выбрано',
    '2': '%{smart_count} файлов выбрано'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} дополнительный файл добавлен',
    '1': '%{smart_count} дополнительных файла добавлено',
    '2': '%{smart_count} дополнительных файлов добавлено'
  },
  xTimeLeft: 'осталось %{time}',
  youCanOnlyUploadFileTypes: 'Вы можете загрузить только: %{types}',
  youCanOnlyUploadX: {
    '0': 'Вы можете загрузить только %{smart_count} файл',
    '1': 'Вы можете загрузить только %{smart_count} файла',
    '2': 'Вы можете загрузить только %{smart_count} файлов'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Вы должны выбрать хотя бы %{smart_count} файл',
    '1': 'Вы должны выбрать хотя бы %{smart_count} файла',
    '2': 'Вы должны выбрать хотя бы %{smart_count} файлов'
  },
  selectAllFilesFromFolderNamed: 'Выбрать все файлы из папки %{name}',
  unselectAllFilesFromFolderNamed: 'Отменить выбор всех файлов из папки %{name}',
  selectFileNamed: 'Выбрать файл %{name}',
  unselectFileNamed: 'Отменить выбор файла %{name}',
  openFolderNamed: 'Открыть папку %{name}'
};

ru_RU.pluralize = function (n) {
  if (n % 10 === 1 && n % 100 !== 11) {
    return 0;
  }

  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    return 1;
  }

  return 2;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.ru_RU = ru_RU;
}

module.exports = ru_RU;
},{}],51:[function(require,module,exports){
var sv_SE = {};
sv_SE.strings = {
  addMore: 'Lägg till',
  addMoreFiles: 'Lägg till filer',
  addingMoreFiles: 'Lägger till fler filer',
  allowAccessDescription: 'För att kunna ta bilder eller spela in video behöver du ge sidan behörighet att använda din kamera.',
  allowAccessTitle: 'Tillåt användning av kameran',
  authenticateWith: 'Anslut till %{pluginName}',
  authenticateWithTitle: 'Anslut till %{pluginName} för att välja filer',
  back: 'Tillbaka',
  browse: 'bläddra',
  cancel: 'Avbryt',
  cancelUpload: 'Avbryt uppladdning',
  chooseFiles: 'Välj filer',
  closeModal: 'Stäng fönster',
  companionAuthError: 'Inloggning krävs',
  companionError: 'Anslutning till Companion misslyckades',
  complete: 'Klart',
  connectedToInternet: 'Ansluten till internet',
  copyLink: 'Kopiera länk',
  copyLinkToClipboardFallback: 'Kopiera länken nedanför',
  copyLinkToClipboardSuccess: 'Länken kopierad till urklipp',
  creatingAssembly: 'Förbereder uppladdning...',
  creatingAssemblyFailed: 'Transloadit: Kunde inte skapa Assembly',
  dashboardTitle: 'Filuppladdare',
  dashboardWindowTitle: 'Uppladdningsfönster (Tryck på Esc-tangenten för att stänga)',
  dataUploadedOfTotal: '%{complete} av %{total}',
  done: 'Klart',
  dropHereOr: 'Släpp filer här eller %{browse}',
  dropHint: 'Släpp dina filer här',
  dropPaste: 'Släpp filer här, klistra in eller %{browse}',
  dropPasteImport: 'Släpp filer här, klistra in, %{browse} eller importera från',
  edit: 'Redigera',
  editFile: 'Redigera fil',
  editing: 'Redigerar %{file}',
  emptyFolderAdded: 'Inga filer lades till från en tom mapp',
  encoding: 'Kodar...',
  enterCorrectUrl: 'Ogiltig URL: Kontrollera att adressen du anger är en direktlänk till en fil.',
  enterUrlToImport: 'Ange URL för att importera en fil',
  exceedsSize: 'Storleken på filen överstiger den tillåtna maxgränsen på',
  failedToFetch: 'Companion kunde inte ladda ner filen, kontrollera att adressen är korrekt',
  failedToUpload: 'Kunde inte ladda upp %{file}',
  fileSource: 'Källa: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} av %{smart_count} fil uppladdad',
    '1': '%{complete} av %{smart_count} filer uppladdade',
    '2': '%{complete} av %{smart_count} filer uppladdade'
  },
  filter: 'Filtrera',
  finishEditingFile: 'Avsluta redigering av filen',
  folderAdded: {
    '0': 'La till %{smart_count} fil från %{folder}',
    '1': 'La till %{smart_count} filer från %{folder}',
    '2': 'La till %{smart_count} filer från %{folder}'
  },
  import: 'Importera',
  importFrom: 'Importera från %{name}',
  link: 'Länk',
  loading: 'Laddar...',
  logOut: 'Logga ut',
  myDevice: 'Min enhet',
  noFilesFound: 'Du har inga filer eller mappar här',
  noInternetConnection: 'Ingen internetuppkoppling',
  openFolderNamed: 'Öppna mappen %{name}',
  pause: 'Pausa',
  pauseUpload: 'Pausa uppladdning',
  paused: 'Pausad',
  poweredBy: 'Drivs av',
  preparingUpload: 'Förbereder uppladdning...',
  processingXFiles: {
    '0': 'Processerar %{smart_count} fil',
    '1': 'Processerar %{smart_count} filer',
    '2': 'Processerar %{smart_count} filer'
  },
  removeFile: 'Ta bort fil',
  resetFilter: 'Nollställ filter',
  resume: 'Återuppta',
  resumeUpload: 'Återuppta uppladdning',
  retry: 'Försök igen',
  retryUpload: 'Försök igen',
  saveChanges: 'Spara ändringar',
  selectAllFilesFromFolderNamed: 'Välj alla filer i mappen %{name}',
  selectFileNamed: 'Välj fil %{name}',
  selectX: {
    '0': 'Välj %{smart_count}',
    '1': 'Välj %{smart_count}',
    '2': 'Välj %{smart_count}'
  },
  smile: 'Säg omelett!',
  // translates to "Say cheese!" - which works well in this context in Swedish
  startRecording: 'Starta inspelning',
  stopRecording: 'Avbryt inspelning',
  takePicture: 'Ta bild',
  timedOut: 'Uppladdningen har stått stilla i %{seconds} sekunder; avbryter.',
  unselectAllFilesFromFolderNamed: 'Avmarkera alla filer i mappen %{name}',
  unselectFileNamed: 'Avmarkera filen %{name}',
  upload: 'Ladda upp',
  uploadComplete: 'Uppladdning slutförd',
  uploadFailed: 'Uppladdning misslyckad',
  uploadPaused: 'Uppladdning pausad',
  uploadXFiles: {
    '0': 'Ladda upp %{smart_count} fil',
    '1': 'Ladda upp %{smart_count} filer',
    '2': 'Ladda upp %{smart_count} filer'
  },
  uploadXNewFiles: {
    '0': 'Ladda upp %{smart_count} fil',
    '1': 'Ladda upp %{smart_count} filer',
    '2': 'Ladda upp %{smart_count} filer'
  },
  uploading: 'Laddar upp',
  uploadingXFiles: {
    '0': 'Ladda upp %{smart_count} fil',
    '1': 'Ladda upp %{smart_count} filer',
    '2': 'Ladda upp %{smart_count} filer'
  },
  xFilesSelected: {
    '0': '%{smart_count} fil vald',
    '1': '%{smart_count} filer valda',
    '2': '%{smart_count} filer valda'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} fil tillagd',
    '1': '%{smart_count} filer tillagda',
    '2': '%{smart_count} filer tillagda'
  },
  xTimeLeft: '%{time} återstår',
  youCanOnlyUploadFileTypes: 'Du kan endast ladda upp: %{types}',
  youCanOnlyUploadX: {
    '0': 'Du kan endast ladda upp %{smart_count} fil',
    '1': 'Du kan endast ladda upp %{smart_count} filer',
    '2': 'Du kan endast ladda upp %{smart_count} filer'
  },
  youHaveToAtLeastSelectX: {
    '0': 'Du måste välja minst %{smart_count} fil',
    '1': 'Du måste välja minst %{smart_count} filer',
    '2': 'Du måste välja minst %{smart_count} filer'
  }
};

sv_SE.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.sv_SE = sv_SE;
}

module.exports = sv_SE;
},{}],52:[function(require,module,exports){
var tr_TR = {};
tr_TR.strings = {
  addMore: 'Daha ekle',
  addMoreFiles: 'Daha fazla dosya ekle',
  addingMoreFiles: 'Daha fazla dosya ekleniyor',
  allowAccessDescription: 'Kameranızla fotoğraf çekmek veya video kaydetmek için lütfen erişim izni verin.',
  allowAccessTitle: 'Lütfen kameranıza erişim izni verin',
  authenticateWith: '%{pluginName} ile bağlan',
  authenticateWithTitle: 'Lütfen dosyaları seçmek için %{pluginName} ile bağlanın',
  back: 'Geri',
  browse: 'gözat',
  cancel: 'İptal',
  cancelUpload: 'Yüklemeyi İptal Et',
  chooseFiles: 'Dosyaları seç',
  closeModal: 'Kapat',
  companionAuthError: 'Bağlantı izni gerekli',
  companionError: 'Bağlantı başarısız',
  complete: 'Yüklendi',
  connectedToInternet: 'İnternete bağlanıldı',
  copyLink: 'Linki kopyala',
  copyLinkToClipboardFallback: 'Aşağıdaki linki kopyala',
  copyLinkToClipboardSuccess: 'Link panoya kopyalandı',
  creatingAssembly: 'Yüklemeye hazırlanıyor...',
  creatingAssemblyFailed: 'Transloadit: Yükleme oluşturulamadı',
  dashboardTitle: 'Dosya Yükle',
  dashboardWindowTitle: 'Dosya Yükle (Kapatmak için Esc)',
  dataUploadedOfTotal: '%{complete} / %{total}',
  done: 'Bitti',
  dropHereOr: 'Sürükleyip bırak veya %{browse}',
  dropHint: 'Buraya sürükleyip bırakın',
  dropPaste: 'Sürükleyip bırak, yapıştır veya %{browse}',
  dropPasteImport: 'Sürükleyip bırak, yapıştır, %{browse} veya içeri aktar',
  edit: 'Düzenle',
  editFile: 'Dosyayı düzenle',
  editing: '%{file} düzenleniyor',
  emptyFolderAdded: 'Klasör boş',
  encoding: 'Çözümleniyor...',
  enterCorrectUrl: 'Hatalı URL: Lütfen bir dosyaya doğrudan bağlantı girdiğinizden emin olun.',
  enterUrlToImport: 'Dosya URL’sini buraya yapıştırın',
  exceedsSize: 'Bu dosya izin verilen maksimum boyutu aşıyor',
  failedToFetch: 'Bu URL’den alınamadı, lütfen doğru olduğundan emin olun',
  failedToUpload: '%{file} dosyası yüklenemedi',
  fileSource: 'Dosya kaynağı: %{name}',
  filesUploadedOfTotal: {
    '0': '%{complete} / %{smart_count} dosya yüklendi',
    '1': '%{complete} / %{smart_count} dosya yüklendi',
    '2': '%{complete} / %{smart_count} dosya yüklendi'
  },
  filter: 'Filtre',
  finishEditingFile: 'Düzenlemeyi bitir',
  folderAdded: {
    '0': '%{folder} klasöründen %{smart_count} dosya eklendi',
    '1': '%{folder} klasöründen %{smart_count} dosya eklendi',
    '2': '%{folder} klasöründen %{smart_count} dosya eklendi'
  },
  import: 'Ekle',
  importFrom: '%{name} Ekle',
  link: 'Link',
  loading: 'Yükleniyor...',
  logOut: 'Çıkış',
  myDevice: 'Dosyalarım',
  noFilesFound: 'Dosya veya klasör bulunamadı',
  noInternetConnection: 'İnternet bağlantınız yok',
  pause: 'Durdur',
  pauseUpload: 'Yükleme Durdu',
  paused: 'Durdu',
  poweredBy: 'Powered by',
  preparingUpload: 'Yüklemeye hazırlanıyor...',
  processingXFiles: {
    '0': '%{smart_count} dosya işleniyor',
    '1': '%{smart_count} dosya işleniyor',
    '2': '%{smart_count} dosya işleniyor'
  },
  removeFile: 'Dosyayı kaldır',
  resetFilter: 'Filtreyi temizle',
  resume: 'Devam Et',
  resumeUpload: 'Yüklemeye devam et',
  retry: 'Tekrar',
  retryUpload: 'Tekrar yükle',
  saveChanges: 'Değişiklikleri kaydet',
  selectX: {
    '0': '%{smart_count} seç',
    '1': '%{smart_count} seç',
    '2': '%{smart_count} seç'
  },
  smile: 'Gülümse!',
  startRecording: 'Video kaydına başla',
  stopRecording: 'Video kaydını durdur',
  takePicture: 'Fotoğraf çek',
  timedOut: 'Yükleme işlemi %{seconds} saniyeden fazla sürdüğü için iptal edildi.',
  upload: 'Yükle',
  uploadComplete: 'Yükleme tamamlandı',
  uploadFailed: 'Yükleme başarısız',
  uploadPaused: 'Yükleme durduruldu',
  uploadXFiles: {
    '0': '%{smart_count} dosyayı yükle',
    '1': '%{smart_count} dosyayı yükle',
    '2': '%{smart_count} dosyayı yükle'
  },
  uploadXNewFiles: {
    '0': '+%{smart_count} dosyayı yükle',
    '1': '+%{smart_count} dosyayı yükle',
    '2': '+%{smart_count} dosyayı yükle'
  },
  uploading: 'Yükleniyor',
  uploadingXFiles: {
    '0': '%{smart_count} dosya yükleniyor',
    '1': '%{smart_count} dosya yükleniyor',
    '2': '%{smart_count} dosya yükleniyor'
  },
  xFilesSelected: {
    '0': '%{smart_count} dosya seçildi',
    '1': '%{smart_count} dosya seçildi',
    '2': '%{smart_count} dosya seçildi'
  },
  xMoreFilesAdded: {
    '0': '%{smart_count} dosya daha eklendi',
    '1': '%{smart_count} dosya daha eklendi',
    '2': '%{smart_count} dosya daha eklendi'
  },
  xTimeLeft: 'kalan süre %{time}',
  youCanOnlyUploadFileTypes: 'Sadece %{types} yükleyebilirsiniz',
  youCanOnlyUploadX: {
    '0': 'Sadece %{smart_count} dosya yükleyebilirsiniz',
    '1': 'Sadece %{smart_count} dosya yükleyebilirsiniz',
    '2': 'Sadece %{smart_count} dosya yükleyebilirsiniz'
  },
  youHaveToAtLeastSelectX: {
    '0': 'En az %{smart_count} dosya seçmelisin',
    '1': 'En az %{smart_count} dosya seçmelisin',
    '2': 'En az %{smart_count} dosya seçmelisin'
  },
  selectAllFilesFromFolderNamed: 'Klasördeki tüm dosyaları seç %{name}',
  unselectAllFilesFromFolderNamed: 'Klasördeki tüm dosyaların seçimini kaldır %{name}',
  selectFileNamed: 'Dosya Seç %{name}',
  unselectFileNamed: 'Dosya seçimini kaldır %{name}',
  openFolderNamed: 'Açık dosya %{name}'
};

tr_TR.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.tr_TR = tr_TR;
}

module.exports = tr_TR;
},{}],53:[function(require,module,exports){
var zh_CN = {};
zh_CN.strings = {
  addMoreFiles: '添加更多文件',
  addingMoreFiles: '正在添加更多文件',
  allowAccessDescription: '为了通过您的相机进行拍照或录像，请给网站相机的访问权限',
  allowAccessTitle: '请允许对相机的访问权限',
  authenticateWith: '连接到%{pluginName}',
  authenticateWithTitle: '请使用%{pluginName}进行身份验证以选择文件',
  back: '返回',
  addMore: '添加更多',
  browse: '浏览',
  cancel: '取消',
  cancelUpload: '取消上传',
  chooseFiles: '选择文件',
  closeModal: '关闭模态',
  companionAuthError: '需要认证',
  companionError: '与Companion的连接失败',
  complete: '完成',
  connectedToInternet: '连接至网络',
  copyLink: '复制链接',
  copyLinkToClipboardFallback: '复制以下网址',
  copyLinkToClipboardSuccess: '链接已复制到剪贴板',
  creatingAssembly: '准备上传中...',
  creatingAssemblyFailed: 'Transloadit：无法创建程序集',
  dashboardTitle: '文件上传工具',
  dashboardWindowTitle: '文件上传工具窗口（点击离开以关闭）',
  dataUploadedOfTotal: '%{total}%{complete}',
  done: '完成',
  dropHereOr: '拖动文件到这里或%{browse}',
  dropHint: '拖动文件到这里',
  dropPaste: '拖动文件到这里，粘贴或者%{browse}',
  dropPasteImport: '拖动文件到这里，粘贴，%{browse}或者导入',
  edit: '编辑',
  editFile: '编辑文件',
  editing: '正在编辑%{file}',
  emptyFolderAdded: '无法从空文件夹添加文件',
  encoding: '编码中...',
  enterCorrectUrl: '错误链接： 请确认您输入的是文件的链接',
  enterUrlToImport: '输入链接或者导入文件',
  exceedsSize: '此文件超出允许的最大大小',
  failedToFetch: 'Companion无法抓取此链接，请确保它是正确的',
  failedToUpload: '上传%{file}失败',
  fileSource: '文件源：%{name}',
  filesUploadedOfTotal: {
    '0': '%{smart_count}个文件上传%{complete}',
    '1': '%{smart_count}个文件上传%{complete}',
    '2': '%{smart_count}个文件上传%{complete}'
  },
  filter: '筛选器',
  finishEditingFile: '完成文件编辑',
  folderAdded: {
    '0': '从%{folder}添加了%{smart_count}个文件',
    '1': '从%{folder}添加了%{smart_count}个文件',
    '2': '从%{folder}添加了%{smart_count}个文件'
  },
  import: '导入',
  importFrom: '从%{name}导入',
  link: '链接',
  loading: '载入中...',
  logOut: '登出',
  myDevice: '我的设备',
  noFilesFound: '这里空空如也',
  noInternetConnection: '无法连接到网络',
  pause: '暂停',
  pauseUpload: '暂停上传',
  paused: '已暂停',
  poweredBy: '强力驱动于',
  preparingUpload: '准备上传中...',
  processingXFiles: {
    '0': '%{smart_count}个文件处理中',
    '1': '%{smart_count}个文件处理中',
    '2': '%{smart_count}个文件处理中'
  },
  removeFile: '移除文件',
  resetFilter: '重置筛选器',
  resume: '恢复',
  resumeUpload: '恢复上传',
  retry: '重试',
  retryUpload: '重试上传',
  saveChanges: '保存变更',
  selectX: {
    '0': '选择%{smart_count}',
    '1': '选择%{smart_count}',
    '2': '选择%{smart_count}'
  },
  smile: '笑！',
  startRecording: '开始视频录制',
  stopRecording: '停止视频录制',
  takePicture: '拍照',
  timedOut: '上传已经停滞不前%{seconds}秒，中止上传',
  upload: '上传',
  uploadComplete: '上传完成',
  uploadFailed: '上传失败',
  uploadPaused: '上传暂停',
  uploadXFiles: {
    '0': '上传%{smart_count}个文件',
    '1': '上传%{smart_count}个文件',
    '2': '上传%{smart_count}个文件'
  },
  uploadXNewFiles: {
    '0': '新上传了%{smart_count}个文件',
    '1': '新上传了%{smart_count}个文件',
    '2': '新上传了%{smart_count}个文件'
  },
  uploading: '正在上传',
  uploadingXFiles: {
    '0': '正在上传%{smart_count}个文件',
    '1': '正在上传%{smart_count}个文件',
    '2': '正在上传%{smart_count}个文件'
  },
  xFilesSelected: {
    '0': '%{smart_count}个文件被选中',
    '1': '%{smart_count}个文件被选中',
    '2': '%{smart_count}个文件被选中'
  },
  xMoreFilesAdded: {
    '0': '又有%{smart_count}个文件被添加',
    '1': '又有%{smart_count}个文件被添加',
    '2': '又有%{smart_count}个文件被添加'
  },
  xTimeLeft: '还剩下%{time}',
  youCanOnlyUploadFileTypes: '您只能上传这些文件类型：%{types}',
  youCanOnlyUploadX: {
    '0': '您只能上传%{smart_count}个文件',
    '1': '您只能上传%{smart_count}个文件',
    '2': '您只能上传%{smart_count}个文件'
  },
  youHaveToAtLeastSelectX: {
    '0': '您至少要选择%{smart_count}个文件',
    '1': '您至少要选择%{smart_count}个文件',
    '2': '您至少要选择%{smart_count}个文件'
  },
  selectAllFilesFromFolderNamed: '从文件夹中选择所有文件 %{name}',
  unselectAllFilesFromFolderNamed: '取消选择文件夹中的所有文件 %{name}',
  selectFileNamed: '选择文件 %{name}',
  unselectFileNamed: '取消选择文件 %{name}',
  openFolderNamed: '打开文件夹 %{name}'
};

zh_CN.pluralize = function (n) {
  if (n === 1) {
    return 0;
  }

  return 1;
};

if (typeof window !== 'undefined' && typeof window.Uppy !== 'undefined') {
  window.Uppy.locales.zh_CN = zh_CN;
}

module.exports = zh_CN;
},{}],54:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var throttle = require('lodash.throttle');

var classNames = require('classnames');

var statusBarStates = require('./StatusBarStates');

var prettyBytes = require('@uppy/utils/lib/prettyBytes');

var prettyETA = require('@uppy/utils/lib/prettyETA');

var _require = require('preact'),
    h = _require.h;

function calculateProcessingProgress(files) {
  // Collect pre or postprocessing progress states.
  var progresses = [];
  Object.keys(files).forEach(function (fileID) {
    var progress = files[fileID].progress;

    if (progress.preprocess) {
      progresses.push(progress.preprocess);
    }

    if (progress.postprocess) {
      progresses.push(progress.postprocess);
    }
  }); // In the future we should probably do this differently. For now we'll take the
  // mode and message from the first file…

  var _progresses$ = progresses[0],
      mode = _progresses$.mode,
      message = _progresses$.message;
  var value = progresses.filter(isDeterminate).reduce(function (total, progress, index, all) {
    return total + progress.value / all.length;
  }, 0);

  function isDeterminate(progress) {
    return progress.mode === 'determinate';
  }

  return {
    mode: mode,
    message: message,
    value: value
  };
}

function togglePauseResume(props) {
  if (props.isAllComplete) return;

  if (!props.resumableUploads) {
    return props.cancelAll();
  }

  if (props.isAllPaused) {
    return props.resumeAll();
  }

  return props.pauseAll();
}

module.exports = function (props) {
  props = props || {};
  var _props = props,
      newFiles = _props.newFiles,
      allowNewUpload = _props.allowNewUpload,
      isUploadInProgress = _props.isUploadInProgress,
      isAllPaused = _props.isAllPaused,
      resumableUploads = _props.resumableUploads,
      error = _props.error,
      hideUploadButton = _props.hideUploadButton,
      hidePauseResumeButton = _props.hidePauseResumeButton,
      hideCancelButton = _props.hideCancelButton,
      hideRetryButton = _props.hideRetryButton;
  var uploadState = props.uploadState;
  var progressValue = props.totalProgress;
  var progressMode;
  var progressBarContent;

  if (uploadState === statusBarStates.STATE_PREPROCESSING || uploadState === statusBarStates.STATE_POSTPROCESSING) {
    var progress = calculateProcessingProgress(props.files);
    progressMode = progress.mode;

    if (progressMode === 'determinate') {
      progressValue = progress.value * 100;
    }

    progressBarContent = ProgressBarProcessing(progress);
  } else if (uploadState === statusBarStates.STATE_COMPLETE) {
    progressBarContent = ProgressBarComplete(props);
  } else if (uploadState === statusBarStates.STATE_UPLOADING) {
    if (!props.supportsUploadProgress) {
      progressMode = 'indeterminate';
      progressValue = null;
    }

    progressBarContent = ProgressBarUploading(props);
  } else if (uploadState === statusBarStates.STATE_ERROR) {
    progressValue = undefined;
    progressBarContent = ProgressBarError(props);
  }

  var width = typeof progressValue === 'number' ? progressValue : 100;
  var isHidden = uploadState === statusBarStates.STATE_WAITING && props.hideUploadButton || uploadState === statusBarStates.STATE_WAITING && !props.newFiles > 0 || uploadState === statusBarStates.STATE_COMPLETE && props.hideAfterFinish;
  var showUploadBtn = !error && newFiles && !isUploadInProgress && !isAllPaused && allowNewUpload && !hideUploadButton;
  var showCancelBtn = !hideCancelButton && uploadState !== statusBarStates.STATE_WAITING && uploadState !== statusBarStates.STATE_COMPLETE;
  var showPauseResumeBtn = resumableUploads && !hidePauseResumeButton && uploadState !== statusBarStates.STATE_WAITING && uploadState !== statusBarStates.STATE_PREPROCESSING && uploadState !== statusBarStates.STATE_POSTPROCESSING && uploadState !== statusBarStates.STATE_COMPLETE;
  var showRetryBtn = error && !hideRetryButton;
  var progressClassNames = "uppy-StatusBar-progress\n                           " + (progressMode ? 'is-' + progressMode : '');
  var statusBarClassNames = classNames({
    'uppy-Root': props.isTargetDOMEl
  }, 'uppy-StatusBar', "is-" + uploadState);
  return h("div", {
    class: statusBarClassNames,
    "aria-hidden": isHidden
  }, h("div", {
    class: progressClassNames,
    style: {
      width: width + '%'
    },
    role: "progressbar",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": progressValue
  }), progressBarContent, h("div", {
    class: "uppy-StatusBar-actions"
  }, showUploadBtn ? h(UploadBtn, _extends({}, props, {
    uploadState: uploadState
  })) : null, showRetryBtn ? h(RetryBtn, props) : null, showPauseResumeBtn ? h(PauseResumeButton, props) : null, showCancelBtn ? h(CancelBtn, props) : null));
};

var UploadBtn = function UploadBtn(props) {
  var uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--upload', {
    'uppy-c-btn-primary': props.uploadState === statusBarStates.STATE_WAITING
  });
  return h("button", {
    type: "button",
    class: uploadBtnClassNames,
    "aria-label": props.i18n('uploadXFiles', {
      smart_count: props.newFiles
    }),
    onclick: props.startUpload,
    "data-uppy-super-focusable": true
  }, props.newFiles && props.isUploadStarted ? props.i18n('uploadXNewFiles', {
    smart_count: props.newFiles
  }) : props.i18n('uploadXFiles', {
    smart_count: props.newFiles
  }));
};

var RetryBtn = function RetryBtn(props) {
  return h("button", {
    type: "button",
    class: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry",
    "aria-label": props.i18n('retryUpload'),
    onclick: props.retryAll,
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "8",
    height: "10",
    viewBox: "0 0 8 10"
  }, h("path", {
    d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z"
  })), props.i18n('retry'));
};

var CancelBtn = function CancelBtn(props) {
  return h("button", {
    type: "button",
    class: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    title: props.i18n('cancel'),
    "aria-label": props.i18n('cancel'),
    onclick: props.cancelAll,
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    "fill-rule": "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z"
  }))));
};

var PauseResumeButton = function PauseResumeButton(props) {
  var isAllPaused = props.isAllPaused,
      i18n = props.i18n;
  var title = isAllPaused ? i18n('resume') : i18n('pause');
  return h("button", {
    title: title,
    "aria-label": title,
    class: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    type: "button",
    onclick: function onclick() {
      return togglePauseResume(props);
    },
    "data-uppy-super-focusable": true
  }, isAllPaused ? h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    "fill-rule": "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    fill: "#FFF",
    d: "M6 4.25L11.5 8 6 11.75z"
  }))) : h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, h("g", {
    fill: "none",
    "fill-rule": "evenodd"
  }, h("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), h("path", {
    d: "M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z",
    fill: "#FFF"
  }))));
};

var LoadingSpinner = function LoadingSpinner() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-StatusBar-spinner",
    width: "14",
    height: "14"
  }, h("path", {
    d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0",
    "fill-rule": "evenodd"
  }));
};

var ProgressBarProcessing = function ProgressBarProcessing(props) {
  var value = Math.round(props.value * 100);
  return h("div", {
    class: "uppy-StatusBar-content"
  }, h(LoadingSpinner, null), props.mode === 'determinate' ? value + "% \xB7 " : '', props.message);
};

var renderDot = function renderDot() {
  return " \xB7 ";
};

var ProgressDetails = function ProgressDetails(props) {
  var ifShowFilesUploadedOfTotal = props.numUploads > 1;
  return h("div", {
    class: "uppy-StatusBar-statusSecondary"
  }, ifShowFilesUploadedOfTotal && props.i18n('filesUploadedOfTotal', {
    complete: props.complete,
    smart_count: props.numUploads
  }), h("span", {
    class: "uppy-StatusBar-additionalInfo"
  }, ifShowFilesUploadedOfTotal && renderDot(), props.i18n('dataUploadedOfTotal', {
    complete: prettyBytes(props.totalUploadedSize),
    total: prettyBytes(props.totalSize)
  }), renderDot(), props.i18n('xTimeLeft', {
    time: prettyETA(props.totalETA)
  })));
};

var UnknownProgressDetails = function UnknownProgressDetails(props) {
  return h("div", {
    class: "uppy-StatusBar-statusSecondary"
  }, props.i18n('filesUploadedOfTotal', {
    complete: props.complete,
    smart_count: props.numUploads
  }));
};

var UploadNewlyAddedFiles = function UploadNewlyAddedFiles(props) {
  var uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--uploadNewlyAdded');
  return h("div", {
    class: "uppy-StatusBar-statusSecondary"
  }, h("div", {
    class: "uppy-StatusBar-statusSecondaryHint"
  }, props.i18n('xMoreFilesAdded', {
    smart_count: props.newFiles
  })), h("button", {
    type: "button",
    class: uploadBtnClassNames,
    "aria-label": props.i18n('uploadXFiles', {
      smart_count: props.newFiles
    }),
    onclick: props.startUpload
  }, props.i18n('upload')));
};

var ThrottledProgressDetails = throttle(ProgressDetails, 500, {
  leading: true,
  trailing: true
});

var ProgressBarUploading = function ProgressBarUploading(props) {
  if (!props.isUploadStarted || props.isAllComplete) {
    return null;
  }

  var title = props.isAllPaused ? props.i18n('paused') : props.i18n('uploading');
  var showUploadNewlyAddedFiles = props.newFiles && props.isUploadStarted;
  return h("div", {
    class: "uppy-StatusBar-content",
    "aria-label": title,
    title: title
  }, !props.isAllPaused ? h(LoadingSpinner, null) : null, h("div", {
    class: "uppy-StatusBar-status"
  }, h("div", {
    class: "uppy-StatusBar-statusPrimary"
  }, props.supportsUploadProgress ? title + ": " + props.totalProgress + "%" : title), !props.isAllPaused && !showUploadNewlyAddedFiles && props.showProgressDetails ? props.supportsUploadProgress ? h(ThrottledProgressDetails, props) : h(UnknownProgressDetails, props) : null, showUploadNewlyAddedFiles ? h(UploadNewlyAddedFiles, props) : null));
};

var ProgressBarComplete = function ProgressBarComplete(_ref) {
  var totalProgress = _ref.totalProgress,
      i18n = _ref.i18n;
  return h("div", {
    class: "uppy-StatusBar-content",
    role: "status",
    title: i18n('complete')
  }, h("div", {
    class: "uppy-StatusBar-status"
  }, h("div", {
    class: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-StatusBar-statusIndicator UppyIcon",
    width: "15",
    height: "11",
    viewBox: "0 0 15 11"
  }, h("path", {
    d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z"
  })), i18n('complete'))));
};

var ProgressBarError = function ProgressBarError(_ref2) {
  var error = _ref2.error,
      retryAll = _ref2.retryAll,
      hideRetryButton = _ref2.hideRetryButton,
      i18n = _ref2.i18n;
  return h("div", {
    class: "uppy-StatusBar-content",
    role: "alert",
    title: i18n('uploadFailed')
  }, h("div", {
    class: "uppy-StatusBar-status"
  }, h("div", {
    class: "uppy-StatusBar-statusPrimary"
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "uppy-StatusBar-statusIndicator UppyIcon",
    width: "11",
    height: "11",
    viewBox: "0 0 11 11"
  }, h("path", {
    d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z"
  })), i18n('uploadFailed'))), h("span", {
    class: "uppy-StatusBar-details",
    "aria-label": error,
    "data-microtip-position": "top-right",
    "data-microtip-size": "medium",
    role: "tooltip"
  }, "?"));
};
},{"./StatusBarStates":55,"@uppy/utils/lib/prettyBytes":90,"@uppy/utils/lib/prettyETA":91,"classnames":103,"lodash.throttle":111,"preact":116}],55:[function(require,module,exports){
module.exports = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete'
};
},{}],56:[function(require,module,exports){
var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var Translator = require('@uppy/utils/lib/Translator');

var StatusBarUI = require('./StatusBar');

var statusBarStates = require('./StatusBarStates');

var getSpeed = require('@uppy/utils/lib/getSpeed');

var getBytesRemaining = require('@uppy/utils/lib/getBytesRemaining');
/**
 * StatusBar: renders a status bar with upload/pause/resume/cancel/retry buttons,
 * progress percentage and time remaining.
 */


module.exports = (_temp = _class =
/*#__PURE__*/
function (_Plugin) {
  _inheritsLoose(StatusBar, _Plugin);

  function StatusBar(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;

    _this.startUpload = function () {
      return _this.uppy.upload().catch(function (err) {
        if (!err.isRestriction) {
          _this.uppy.log(err.stack || err.message || err);
        }
      });
    };

    _this.id = _this.opts.id || 'StatusBar';
    _this.title = 'StatusBar';
    _this.type = 'progressindicator';
    _this.defaultLocale = {
      strings: {
        uploading: 'Uploading',
        upload: 'Upload',
        complete: 'Complete',
        uploadFailed: 'Upload failed',
        paused: 'Paused',
        retry: 'Retry',
        cancel: 'Cancel',
        pause: 'Pause',
        resume: 'Resume',
        filesUploadedOfTotal: {
          0: '%{complete} of %{smart_count} file uploaded',
          1: '%{complete} of %{smart_count} files uploaded',
          2: '%{complete} of %{smart_count} files uploaded'
        },
        dataUploadedOfTotal: '%{complete} of %{total}',
        xTimeLeft: '%{time} left',
        uploadXFiles: {
          0: 'Upload %{smart_count} file',
          1: 'Upload %{smart_count} files',
          2: 'Upload %{smart_count} files'
        },
        uploadXNewFiles: {
          0: 'Upload +%{smart_count} file',
          1: 'Upload +%{smart_count} files',
          2: 'Upload +%{smart_count} files'
        },
        xMoreFilesAdded: {
          0: '%{smart_count} more file added',
          1: '%{smart_count} more files added',
          2: '%{smart_count} more files added'
        }
      } // set default options

    };
    var defaultOptions = {
      target: 'body',
      hideUploadButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideCancelButton: false,
      showProgressDetails: false,
      hideAfterFinish: true
    };
    _this.opts = _extends({}, defaultOptions, {}, opts);

    _this.i18nInit();

    _this.render = _this.render.bind(_assertThisInitialized(_this));
    _this.install = _this.install.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = StatusBar.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.getTotalSpeed = function getTotalSpeed(files) {
    var totalSpeed = 0;
    files.forEach(function (file) {
      totalSpeed = totalSpeed + getSpeed(file.progress);
    });
    return totalSpeed;
  };

  _proto.getTotalETA = function getTotalETA(files) {
    var totalSpeed = this.getTotalSpeed(files);

    if (totalSpeed === 0) {
      return 0;
    }

    var totalBytesRemaining = files.reduce(function (total, file) {
      return total + getBytesRemaining(file.progress);
    }, 0);
    return Math.round(totalBytesRemaining / totalSpeed * 10) / 10;
  };

  _proto.getUploadingState = function getUploadingState(isAllErrored, isAllComplete, files) {
    if (isAllErrored) {
      return statusBarStates.STATE_ERROR;
    }

    if (isAllComplete) {
      return statusBarStates.STATE_COMPLETE;
    }

    var state = statusBarStates.STATE_WAITING;
    var fileIDs = Object.keys(files);

    for (var i = 0; i < fileIDs.length; i++) {
      var progress = files[fileIDs[i]].progress; // If ANY files are being uploaded right now, show the uploading state.

      if (progress.uploadStarted && !progress.uploadComplete) {
        return statusBarStates.STATE_UPLOADING;
      } // If files are being preprocessed AND postprocessed at this time, we show the
      // preprocess state. If any files are being uploaded we show uploading.


      if (progress.preprocess && state !== statusBarStates.STATE_UPLOADING) {
        state = statusBarStates.STATE_PREPROCESSING;
      } // If NO files are being preprocessed or uploaded right now, but some files are
      // being postprocessed, show the postprocess state.


      if (progress.postprocess && state !== statusBarStates.STATE_UPLOADING && state !== statusBarStates.STATE_PREPROCESSING) {
        state = statusBarStates.STATE_POSTPROCESSING;
      }
    }

    return state;
  };

  _proto.render = function render(state) {
    var capabilities = state.capabilities,
        files = state.files,
        allowNewUpload = state.allowNewUpload,
        totalProgress = state.totalProgress,
        error = state.error; // TODO: move this to Core, to share between Status Bar and Dashboard
    // (and any other plugin that might need it, too)

    var filesArray = Object.keys(files).map(function (file) {
      return files[file];
    });
    var newFiles = filesArray.filter(function (file) {
      return !file.progress.uploadStarted && !file.progress.preprocess && !file.progress.postprocess;
    });
    var uploadStartedFiles = filesArray.filter(function (file) {
      return file.progress.uploadStarted;
    });
    var pausedFiles = uploadStartedFiles.filter(function (file) {
      return file.isPaused;
    });
    var completeFiles = filesArray.filter(function (file) {
      return file.progress.uploadComplete;
    });
    var erroredFiles = filesArray.filter(function (file) {
      return file.error;
    });
    var inProgressFiles = filesArray.filter(function (file) {
      return !file.progress.uploadComplete && file.progress.uploadStarted;
    });
    var inProgressNotPausedFiles = inProgressFiles.filter(function (file) {
      return !file.isPaused;
    });
    var startedFiles = filesArray.filter(function (file) {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });
    var processingFiles = filesArray.filter(function (file) {
      return file.progress.preprocess || file.progress.postprocess;
    });
    var totalETA = this.getTotalETA(inProgressNotPausedFiles);
    var totalSize = 0;
    var totalUploadedSize = 0;
    uploadStartedFiles.forEach(function (file) {
      totalSize = totalSize + (file.progress.bytesTotal || 0);
      totalUploadedSize = totalUploadedSize + (file.progress.bytesUploaded || 0);
    });
    var isUploadStarted = uploadStartedFiles.length > 0;
    var isAllComplete = totalProgress === 100 && completeFiles.length === Object.keys(files).length && processingFiles.length === 0;
    var isAllErrored = isUploadStarted && erroredFiles.length === uploadStartedFiles.length;
    var isAllPaused = inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length;
    var isUploadInProgress = inProgressFiles.length > 0;
    var resumableUploads = capabilities.resumableUploads || false;
    var supportsUploadProgress = capabilities.uploadProgress !== false;
    return StatusBarUI({
      error: error,
      uploadState: this.getUploadingState(isAllErrored, isAllComplete, state.files || {}),
      allowNewUpload: allowNewUpload,
      totalProgress: totalProgress,
      totalSize: totalSize,
      totalUploadedSize: totalUploadedSize,
      isAllComplete: isAllComplete,
      isAllPaused: isAllPaused,
      isAllErrored: isAllErrored,
      isUploadStarted: isUploadStarted,
      isUploadInProgress: isUploadInProgress,
      complete: completeFiles.length,
      newFiles: newFiles.length,
      numUploads: startedFiles.length,
      totalETA: totalETA,
      files: files,
      i18n: this.i18n,
      pauseAll: this.uppy.pauseAll,
      resumeAll: this.uppy.resumeAll,
      retryAll: this.uppy.retryAll,
      cancelAll: this.uppy.cancelAll,
      startUpload: this.startUpload,
      resumableUploads: resumableUploads,
      supportsUploadProgress: supportsUploadProgress,
      showProgressDetails: this.opts.showProgressDetails,
      hideUploadButton: this.opts.hideUploadButton,
      hideRetryButton: this.opts.hideRetryButton,
      hidePauseResumeButton: this.opts.hidePauseResumeButton,
      hideCancelButton: this.opts.hideCancelButton,
      hideAfterFinish: this.opts.hideAfterFinish,
      isTargetDOMEl: this.isTargetDOMEl
    });
  };

  _proto.install = function install() {
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return StatusBar;
}(Plugin), _class.VERSION = "1.4.0", _temp);
},{"./StatusBar":54,"./StatusBarStates":55,"@uppy/core":9,"@uppy/utils/lib/Translator":64,"@uppy/utils/lib/getBytesRemaining":71,"@uppy/utils/lib/getSpeed":81}],57:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Default store that keeps state in a simple object.
 */
var DefaultStore =
/*#__PURE__*/
function () {
  function DefaultStore() {
    this.state = {};
    this.callbacks = [];
  }

  var _proto = DefaultStore.prototype;

  _proto.getState = function getState() {
    return this.state;
  };

  _proto.setState = function setState(patch) {
    var prevState = _extends({}, this.state);

    var nextState = _extends({}, this.state, patch);

    this.state = nextState;

    this._publish(prevState, nextState, patch);
  };

  _proto.subscribe = function subscribe(listener) {
    var _this = this;

    this.callbacks.push(listener);
    return function () {
      // Remove the listener.
      _this.callbacks.splice(_this.callbacks.indexOf(listener), 1);
    };
  };

  _proto._publish = function _publish() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.callbacks.forEach(function (listener) {
      listener.apply(void 0, args);
    });
  };

  return DefaultStore;
}();

DefaultStore.VERSION = "1.2.0";

module.exports = function defaultStore() {
  return new DefaultStore();
};
},{}],58:[function(require,module,exports){
var ORIENTATIONS = {
  1: {
    rotation: 0,
    xScale: 1,
    yScale: 1
  },
  2: {
    rotation: 0,
    xScale: -1,
    yScale: 1
  },
  3: {
    rotation: 180,
    xScale: 1,
    yScale: 1
  },
  4: {
    rotation: 180,
    xScale: -1,
    yScale: 1
  },
  5: {
    rotation: 90,
    xScale: 1,
    yScale: -1
  },
  6: {
    rotation: 90,
    xScale: 1,
    yScale: 1
  },
  7: {
    rotation: 270,
    xScale: 1,
    yScale: -1
  },
  8: {
    rotation: 270,
    xScale: 1,
    yScale: 1
  }
};
module.exports = ORIENTATIONS;
},{}],59:[function(require,module,exports){
var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Exif = require('exif-js');

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var Translator = require('@uppy/utils/lib/Translator');

var dataURItoBlob = require('@uppy/utils/lib/dataURItoBlob');

var isObjectURL = require('@uppy/utils/lib/isObjectURL');

var isPreviewSupported = require('@uppy/utils/lib/isPreviewSupported');

var ORIENTATIONS = require('./image-orientations');
/**
 * The Thumbnail Generator plugin
 */


module.exports = (_temp = _class =
/*#__PURE__*/
function (_Plugin) {
  _inheritsLoose(ThumbnailGenerator, _Plugin);

  function ThumbnailGenerator(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;

    _this.onFileAdded = function (file) {
      if (!file.preview) {
        _this.addToQueue(file);
      }
    };

    _this.onFileRemoved = function (file) {
      var index = _this.queue.indexOf(file);

      if (index !== -1) {
        _this.queue.splice(index, 1);
      } // Clean up object URLs.


      if (file.preview && isObjectURL(file.preview)) {
        URL.revokeObjectURL(file.preview);
      }
    };

    _this.onRestored = function () {
      var _this$uppy$getState = _this.uppy.getState(),
          files = _this$uppy$getState.files;

      var fileIDs = Object.keys(files);
      fileIDs.forEach(function (fileID) {
        var file = _this.uppy.getFile(fileID);

        if (!file.isRestored) return; // Only add blob URLs; they are likely invalid after being restored.

        if (!file.preview || isObjectURL(file.preview)) {
          _this.addToQueue(file);
        }
      });
    };

    _this.waitUntilAllProcessed = function (fileIDs) {
      fileIDs.forEach(function (fileID) {
        var file = _this.uppy.getFile(fileID);

        _this.uppy.emit('preprocess-progress', file, {
          mode: 'indeterminate',
          message: _this.i18n('generatingThumbnails')
        });
      });
      return new Promise(function (resolve, reject) {
        if (_this.queueProcessing) {
          _this.uppy.once('thumbnail:all-generated', function () {
            resolve();
          });
        } else {
          resolve();
        }
      });
    };

    _this.type = 'modifier';
    _this.id = _this.opts.id || 'ThumbnailGenerator';
    _this.title = 'Thumbnail Generator';
    _this.queue = [];
    _this.queueProcessing = false;
    _this.defaultThumbnailDimension = 200;
    _this.defaultLocale = {
      strings: {
        generatingThumbnails: 'Generating thumbnails...'
      }
    };
    var defaultOptions = {
      thumbnailWidth: null,
      thumbnailHeight: null,
      waitForThumbnailsBeforeUpload: false
    };
    _this.opts = _extends({}, defaultOptions, {}, opts);

    _this.i18nInit();

    return _this;
  }

  var _proto = ThumbnailGenerator.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  }
  /**
   * Create a thumbnail for the given Uppy file object.
   *
   * @param {{data: Blob}} file
   * @param {number} width
   * @returns {Promise}
   */
  ;

  _proto.createThumbnail = function createThumbnail(file, targetWidth, targetHeight) {
    var _this2 = this;

    var originalUrl = URL.createObjectURL(file.data);
    var onload = new Promise(function (resolve, reject) {
      var image = new Image();
      image.src = originalUrl;
      image.addEventListener('load', function () {
        URL.revokeObjectURL(originalUrl);
        resolve(image);
      });
      image.addEventListener('error', function (event) {
        URL.revokeObjectURL(originalUrl);
        reject(event.error || new Error('Could not create thumbnail'));
      });
    });
    return Promise.all([onload, this.getOrientation(file)]).then(function (values) {
      var image = values[0];
      var orientation = values[1];

      var dimensions = _this2.getProportionalDimensions(image, targetWidth, targetHeight, orientation.rotation);

      var rotatedImage = _this2.rotateImage(image, orientation);

      var resizedImage = _this2.resizeImage(rotatedImage, dimensions.width, dimensions.height);

      return _this2.canvasToBlob(resizedImage, 'image/png');
    }).then(function (blob) {
      return URL.createObjectURL(blob);
    });
  }
  /**
   * Get the new calculated dimensions for the given image and a target width
   * or height. If both width and height are given, only width is taken into
   * account. If neither width nor height are given, the default dimension
   * is used.
   */
  ;

  _proto.getProportionalDimensions = function getProportionalDimensions(img, width, height, rotation) {
    var aspect = img.width / img.height;

    if (rotation === 90 || rotation === 270) {
      aspect = img.height / img.width;
    }

    if (width != null) {
      return {
        width: width,
        height: Math.round(width / aspect)
      };
    }

    if (height != null) {
      return {
        width: Math.round(height * aspect),
        height: height
      };
    }

    return {
      width: this.defaultThumbnailDimension,
      height: Math.round(this.defaultThumbnailDimension / aspect)
    };
  };

  _proto.getOrientation = function getOrientation(file) {
    var _this3 = this;

    return new Promise(function (resolve) {
      var uppy = _this3.uppy;
      Exif.getData(file.data, function exifGetDataCallback() {
        var exifdata = Exif.getAllTags(this); // delete the thumbnail from exif metadata, because it contains a blob
        // and we don’t blobs in meta — it might lead to unexpected issues on the server

        delete exifdata.thumbnail;
        uppy.setFileMeta(file.id, {
          exifdata: exifdata
        });
        var orientation = Exif.getTag(this, 'Orientation') || 1;
        resolve(ORIENTATIONS[orientation]);
      });
    });
  }
  /**
   * Make sure the image doesn’t exceed browser/device canvas limits.
   * For ios with 256 RAM and ie
   */
  ;

  _proto.protect = function protect(image) {
    // https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
    var ratio = image.width / image.height;
    var maxSquare = 5000000; // ios max canvas square

    var maxSize = 4096; // ie max canvas dimensions

    var maxW = Math.floor(Math.sqrt(maxSquare * ratio));
    var maxH = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio));

    if (maxW > maxSize) {
      maxW = maxSize;
      maxH = Math.round(maxW / ratio);
    }

    if (maxH > maxSize) {
      maxH = maxSize;
      maxW = Math.round(ratio * maxH);
    }

    if (image.width > maxW) {
      var canvas = document.createElement('canvas');
      canvas.width = maxW;
      canvas.height = maxH;
      canvas.getContext('2d').drawImage(image, 0, 0, maxW, maxH);
      image = canvas;
    }

    return image;
  }
  /**
   * Resize an image to the target `width` and `height`.
   *
   * Returns a Canvas with the resized image on it.
   */
  ;

  _proto.resizeImage = function resizeImage(image, targetWidth, targetHeight) {
    // Resizing in steps refactored to use a solution from
    // https://blog.uploadcare.com/image-resize-in-browsers-is-broken-e38eed08df01
    image = this.protect(image); // Use the Polyfill for Math.log2() since IE doesn't support log2
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2#Polyfill

    var steps = Math.ceil(Math.log(image.width / targetWidth) * Math.LOG2E);

    if (steps < 1) {
      steps = 1;
    }

    var sW = targetWidth * Math.pow(2, steps - 1);
    var sH = targetHeight * Math.pow(2, steps - 1);
    var x = 2;

    while (steps--) {
      var canvas = document.createElement('canvas');
      canvas.width = sW;
      canvas.height = sH;
      canvas.getContext('2d').drawImage(image, 0, 0, sW, sH);
      image = canvas;
      sW = Math.round(sW / x);
      sH = Math.round(sH / x);
    }

    return image;
  };

  _proto.rotateImage = function rotateImage(image, translate) {
    var w = image.width;
    var h = image.height;

    if (translate.rotation === 90 || translate.rotation === 270) {
      w = image.height;
      h = image.width;
    }

    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var context = canvas.getContext('2d');
    context.translate(w / 2, h / 2);
    context.rotate(translate.rotation * Math.PI / 180);
    context.scale(translate.xScale, translate.yScale);
    context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
    return canvas;
  }
  /**
   * Save a <canvas> element's content to a Blob object.
   *
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise}
   */
  ;

  _proto.canvasToBlob = function canvasToBlob(canvas, type, quality) {
    try {
      canvas.getContext('2d').getImageData(0, 0, 1, 1);
    } catch (err) {
      if (err.code === 18) {
        return Promise.reject(new Error('cannot read image, probably an svg with external resources'));
      }
    }

    if (canvas.toBlob) {
      return new Promise(function (resolve) {
        canvas.toBlob(resolve, type, quality);
      }).then(function (blob) {
        if (blob === null) {
          throw new Error('cannot read image, probably an svg with external resources');
        }

        return blob;
      });
    }

    return Promise.resolve().then(function () {
      return dataURItoBlob(canvas.toDataURL(type, quality), {});
    }).then(function (blob) {
      if (blob === null) {
        throw new Error('could not extract blob, probably an old browser');
      }

      return blob;
    });
  }
  /**
   * Set the preview URL for a file.
   */
  ;

  _proto.setPreviewURL = function setPreviewURL(fileID, preview) {
    this.uppy.setFileState(fileID, {
      preview: preview
    });
  };

  _proto.addToQueue = function addToQueue(item) {
    this.queue.push(item);

    if (this.queueProcessing === false) {
      this.processQueue();
    }
  };

  _proto.processQueue = function processQueue() {
    var _this4 = this;

    this.queueProcessing = true;

    if (this.queue.length > 0) {
      var current = this.queue.shift();
      return this.requestThumbnail(current).catch(function (err) {}) // eslint-disable-line handle-callback-err
      .then(function () {
        return _this4.processQueue();
      });
    } else {
      this.queueProcessing = false;
      this.uppy.log('[ThumbnailGenerator] Emptied thumbnail queue');
      this.uppy.emit('thumbnail:all-generated');
    }
  };

  _proto.requestThumbnail = function requestThumbnail(file) {
    var _this5 = this;

    if (isPreviewSupported(file.type) && !file.isRemote) {
      return this.createThumbnail(file, this.opts.thumbnailWidth, this.opts.thumbnailHeight).then(function (preview) {
        _this5.setPreviewURL(file.id, preview);

        _this5.uppy.log("[ThumbnailGenerator] Generated thumbnail for " + file.id);

        _this5.uppy.emit('thumbnail:generated', _this5.uppy.getFile(file.id), preview);
      }).catch(function (err) {
        _this5.uppy.log("[ThumbnailGenerator] Failed thumbnail for " + file.id + ":", 'warning');

        _this5.uppy.log(err, 'warning');

        _this5.uppy.emit('thumbnail:error', _this5.uppy.getFile(file.id), err);
      });
    }

    return Promise.resolve();
  };

  _proto.install = function install() {
    this.uppy.on('file-added', this.onFileAdded);
    this.uppy.on('file-removed', this.onFileRemoved);
    this.uppy.on('restored', this.onRestored);

    if (this.opts.waitForThumbnailsBeforeUpload) {
      this.uppy.addPreProcessor(this.waitUntilAllProcessed);
    }
  };

  _proto.uninstall = function uninstall() {
    this.uppy.off('file-added', this.onFileAdded);
    this.uppy.off('file-removed', this.onFileRemoved);
    this.uppy.off('restored', this.onRestored);

    if (this.opts.waitForThumbnailsBeforeUpload) {
      this.uppy.removePreProcessor(this.waitUntilAllProcessed);
    }
  };

  return ThumbnailGenerator;
}(Plugin), _class.VERSION = "1.5.0", _temp);
},{"./image-orientations":58,"@uppy/core":9,"@uppy/utils/lib/Translator":64,"@uppy/utils/lib/dataURItoBlob":66,"@uppy/utils/lib/isObjectURL":86,"@uppy/utils/lib/isPreviewSupported":87,"exif-js":108}],60:[function(require,module,exports){
/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports =
/*#__PURE__*/
function () {
  function EventTracker(emitter) {
    this._events = [];
    this._emitter = emitter;
  }

  var _proto = EventTracker.prototype;

  _proto.on = function on(event, fn) {
    this._events.push([event, fn]);

    return this._emitter.on(event, fn);
  };

  _proto.remove = function remove() {
    var _this = this;

    this._events.forEach(function (_ref) {
      var event = _ref[0],
          fn = _ref[1];

      _this._emitter.off(event, fn);
    });
  };

  return EventTracker;
}();
},{}],61:[function(require,module,exports){
module.exports = ['a[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'area[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'input:not([disabled]):not([inert]):not([aria-hidden])', 'select:not([disabled]):not([inert]):not([aria-hidden])', 'textarea:not([disabled]):not([inert]):not([aria-hidden])', 'button:not([disabled]):not([inert]):not([aria-hidden])', 'iframe:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'object:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'embed:not([tabindex^="-"]):not([inert]):not([aria-hidden])', '[contenteditable]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', '[tabindex]:not([tabindex^="-"]):not([inert]):not([aria-hidden])'];
},{}],62:[function(require,module,exports){
/**
 * Helper to abort upload requests if there has not been any progress for `timeout` ms.
 * Create an instance using `timer = new ProgressTimeout(10000, onTimeout)`
 * Call `timer.progress()` to signal that there has been progress of any kind.
 * Call `timer.done()` when the upload has completed.
 */
var ProgressTimeout =
/*#__PURE__*/
function () {
  function ProgressTimeout(timeout, timeoutHandler) {
    this._timeout = timeout;
    this._onTimedOut = timeoutHandler;
    this._isDone = false;
    this._aliveTimer = null;
    this._onTimedOut = this._onTimedOut.bind(this);
  }

  var _proto = ProgressTimeout.prototype;

  _proto.progress = function progress() {
    // Some browsers fire another progress event when the upload is
    // cancelled, so we have to ignore progress after the timer was
    // told to stop.
    if (this._isDone) return;

    if (this._timeout > 0) {
      if (this._aliveTimer) clearTimeout(this._aliveTimer);
      this._aliveTimer = setTimeout(this._onTimedOut, this._timeout);
    }
  };

  _proto.done = function done() {
    if (this._aliveTimer) {
      clearTimeout(this._aliveTimer);
      this._aliveTimer = null;
    }

    this._isDone = true;
  };

  return ProgressTimeout;
}();

module.exports = ProgressTimeout;
},{}],63:[function(require,module,exports){
module.exports =
/*#__PURE__*/
function () {
  function RateLimitedQueue(limit) {
    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }

    this.activeRequests = 0;
    this.queuedHandlers = [];
  }

  var _proto = RateLimitedQueue.prototype;

  _proto._call = function _call(fn) {
    var _this = this;

    this.activeRequests += 1;
    var _done = false;
    var cancelActive;

    try {
      cancelActive = fn();
    } catch (err) {
      this.activeRequests -= 1;
      throw err;
    }

    return {
      abort: function abort() {
        if (_done) return;
        _done = true;
        _this.activeRequests -= 1;
        cancelActive();

        _this._queueNext();
      },
      done: function done() {
        if (_done) return;
        _done = true;
        _this.activeRequests -= 1;

        _this._queueNext();
      }
    };
  };

  _proto._queueNext = function _queueNext() {
    var _this2 = this;

    // Do it soon but not immediately, this allows clearing out the entire queue synchronously
    // one by one without continuously _advancing_ it (and starting new tasks before immediately
    // aborting them)
    Promise.resolve().then(function () {
      _this2._next();
    });
  };

  _proto._next = function _next() {
    if (this.activeRequests >= this.limit) {
      return;
    }

    if (this.queuedHandlers.length === 0) {
      return;
    } // Dispatch the next request, and update the abort/done handlers
    // so that cancelling it does the Right Thing (and doesn't just try
    // to dequeue an already-running request).


    var next = this.queuedHandlers.shift();

    var handler = this._call(next.fn);

    next.abort = handler.abort;
    next.done = handler.done;
  };

  _proto._queue = function _queue(fn) {
    var _this3 = this;

    var handler = {
      fn: fn,
      abort: function abort() {
        _this3._dequeue(handler);
      },
      done: function done() {
        throw new Error('Cannot mark a queued request as done: this indicates a bug');
      }
    };
    this.queuedHandlers.push(handler);
    return handler;
  };

  _proto._dequeue = function _dequeue(handler) {
    var index = this.queuedHandlers.indexOf(handler);

    if (index !== -1) {
      this.queuedHandlers.splice(index, 1);
    }
  };

  _proto.run = function run(fn) {
    if (this.activeRequests < this.limit) {
      return this._call(fn);
    }

    return this._queue(fn);
  };

  _proto.wrapPromiseFunction = function wrapPromiseFunction(fn) {
    var _this4 = this;

    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new Promise(function (resolve, reject) {
        var queuedRequest = _this4.run(function () {
          var cancelError;
          var promise;

          try {
            promise = Promise.resolve(fn.apply(void 0, args));
          } catch (err) {
            promise = Promise.reject(err);
          }

          promise.then(function (result) {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, function (err) {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return function () {
            cancelError = new Error('Cancelled');
          };
        });
      });
    };
  };

  return RateLimitedQueue;
}();
},{}],64:[function(require,module,exports){
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var has = require('./hasProperty');
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports =
/*#__PURE__*/
function () {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  function Translator(locales) {
    var _this = this;

    this.locale = {
      strings: {},
      pluralize: function pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }
    };

    if (Array.isArray(locales)) {
      locales.forEach(function (locale) {
        return _this._apply(locale);
      });
    } else {
      this._apply(locales);
    }
  }

  var _proto = Translator.prototype;

  _proto._apply = function _apply(locale) {
    if (!locale || !locale.strings) {
      return;
    }

    var prevLocale = this.locale;
    this.locale = _extends({}, prevLocale, {
      strings: _extends({}, prevLocale.strings, locale.strings)
    });
    this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
  }
  /**
   * Takes a string with placeholder variables like `%{smart_count} file selected`
   * and replaces it with values from options `{smart_count: 5}`
   *
   * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
   * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
   *
   * @param {string} phrase that needs interpolation, with placeholders
   * @param {object} options with values that will be used to replace placeholders
   * @returns {string} interpolated
   */
  ;

  _proto.interpolate = function interpolate(phrase, options) {
    var _String$prototype = String.prototype,
        split = _String$prototype.split,
        replace = _String$prototype.replace;
    var dollarRegex = /\$/g;
    var dollarBillsYall = '$$$$';
    var interpolated = [phrase];

    for (var arg in options) {
      if (arg !== '_' && has(options, arg)) {
        // Ensure replacement value is escaped to prevent special $-prefixed
        // regex replace tokens. the "$$$$" is needed because each "$" needs to
        // be escaped with "$" itself, and we need two in the resulting output.
        var replacement = options[arg];

        if (typeof replacement === 'string') {
          replacement = replace.call(options[arg], dollarRegex, dollarBillsYall);
        } // We create a new `RegExp` each time instead of using a more-efficient
        // string replace so that the same argument can be replaced multiple times
        // in the same phrase.


        interpolated = insertReplacement(interpolated, new RegExp('%\\{' + arg + '\\}', 'g'), replacement);
      }
    }

    return interpolated;

    function insertReplacement(source, rx, replacement) {
      var newParts = [];
      source.forEach(function (chunk) {
        split.call(chunk, rx).forEach(function (raw, i, list) {
          if (raw !== '') {
            newParts.push(raw);
          } // Interlace with the `replacement` value


          if (i < list.length - 1) {
            newParts.push(replacement);
          }
        });
      });
      return newParts;
    }
  }
  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  ;

  _proto.translate = function translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */
  ;

  _proto.translateArray = function translateArray(key, options) {
    if (options && typeof options.smart_count !== 'undefined') {
      var plural = this.locale.pluralize(options.smart_count);
      return this.interpolate(this.locale.strings[key][plural], options);
    }

    return this.interpolate(this.locale.strings[key], options);
  };

  return Translator;
}();
},{"./hasProperty":83}],65:[function(require,module,exports){
var dataURItoBlob = require('./dataURItoBlob');
/**
 * Save a <canvas> element's content to a Blob object.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise}
 */


module.exports = function canvasToBlob(canvas, type, quality) {
  if (canvas.toBlob) {
    return new Promise(function (resolve) {
      canvas.toBlob(resolve, type, quality);
    });
  }

  return Promise.resolve().then(function () {
    return dataURItoBlob(canvas.toDataURL(type, quality), {});
  });
};
},{"./dataURItoBlob":66}],66:[function(require,module,exports){
module.exports = function dataURItoBlob(dataURI, opts, toFile) {
  // get the base64 data
  var data = dataURI.split(',')[1]; // user may provide mime type, if not get it from data URI

  var mimeType = opts.mimeType || dataURI.split(',')[0].split(':')[1].split(';')[0]; // default to plain/text if data URI has no mimeType

  if (mimeType == null) {
    mimeType = 'plain/text';
  }

  var binary = atob(data);
  var array = [];

  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }

  var bytes;

  try {
    bytes = new Uint8Array(array); // eslint-disable-line compat/compat
  } catch (err) {
    return null;
  } // Convert to a File?


  if (toFile) {
    return new File([bytes], opts.name || '', {
      type: mimeType
    });
  }

  return new Blob([bytes], {
    type: mimeType
  });
};
},{}],67:[function(require,module,exports){
var throttle = require('lodash.throttle');

function _emitSocketProgress(uploader, progressData, file) {
  var progress = progressData.progress,
      bytesUploaded = progressData.bytesUploaded,
      bytesTotal = progressData.bytesTotal;

  if (progress) {
    uploader.uppy.log("Upload progress: " + progress);
    uploader.uppy.emit('upload-progress', file, {
      uploader: uploader,
      bytesUploaded: bytesUploaded,
      bytesTotal: bytesTotal
    });
  }
}

module.exports = throttle(_emitSocketProgress, 300, {
  leading: true,
  trailing: true
});
},{"lodash.throttle":111}],68:[function(require,module,exports){
var isDOMElement = require('./isDOMElement');
/**
 * Find one or more DOM elements.
 *
 * @param {string} element
 * @returns {Array|null}
 */


module.exports = function findAllDOMElements(element) {
  if (typeof element === 'string') {
    var elements = [].slice.call(document.querySelectorAll(element));
    return elements.length > 0 ? elements : null;
  }

  if (typeof element === 'object' && isDOMElement(element)) {
    return [element];
  }
};
},{"./isDOMElement":84}],69:[function(require,module,exports){
var isDOMElement = require('./isDOMElement');
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context) {
  if (context === void 0) {
    context = document;
  }

  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (typeof element === 'object' && isDOMElement(element)) {
    return element;
  }
};
},{"./isDOMElement":84}],70:[function(require,module,exports){
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 *
 */
module.exports = function generateFileID(file) {
  // filter is needed to not join empty values with `-`
  return ['uppy', file.name ? encodeFilename(file.name.toLowerCase()) : '', file.type, file.meta && file.meta.relativePath ? encodeFilename(file.meta.relativePath.toLowerCase()) : '', file.data.size, file.data.lastModified].filter(function (val) {
    return val;
  }).join('-');
};

function encodeFilename(name) {
  var suffix = '';
  return name.replace(/[^A-Z0-9]/ig, function (character) {
    suffix += '-' + encodeCharacter(character);
    return '/';
  }) + suffix;
}

function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}
},{}],71:[function(require,module,exports){
module.exports = function getBytesRemaining(fileProgress) {
  return fileProgress.bytesTotal - fileProgress.bytesUploaded;
};
},{}],72:[function(require,module,exports){
var webkitGetAsEntryApi = require('./utils/webkitGetAsEntryApi/index');

var fallbackApi = require('./utils/fallbackApi');
/**
 * Returns a promise that resolves to the array of dropped files (if a folder is dropped, and browser supports folder parsing - promise resolves to the flat array of all files in all directories).
 * Each file has .relativePath prop appended to it (e.g. "/docs/Prague/ticket_from_prague_to_ufa.pdf") if browser supports it. Otherwise it's undefined.
 *
 * @param {DataTransfer} dataTransfer
 * @param {Function} logDropError - a function that's called every time some folder or some file error out (e.g. because of the folder name being too long on Windows). Notice that resulting promise will always be resolved anyway.
 *
 * @returns {Promise} - Array<File>
 */


module.exports = function getDroppedFiles(dataTransfer, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$logDropError = _ref.logDropError,
      logDropError = _ref$logDropError === void 0 ? function () {} : _ref$logDropError;

  // Get all files from all subdirs. Works (at least) in Chrome, Mozilla, and Safari
  if (dataTransfer.items && dataTransfer.items[0] && 'webkitGetAsEntry' in dataTransfer.items[0]) {
    return webkitGetAsEntryApi(dataTransfer, logDropError); // Otherwise just return all first-order files
  } else {
    return fallbackApi(dataTransfer);
  }
};
},{"./utils/fallbackApi":73,"./utils/webkitGetAsEntryApi/index":76}],73:[function(require,module,exports){
var toArray = require('../../toArray'); // .files fallback, should be implemented in any browser


module.exports = function fallbackApi(dataTransfer) {
  var files = toArray(dataTransfer.files);
  return Promise.resolve(files);
};
},{"../../toArray":94}],74:[function(require,module,exports){
/**
 * Recursive function, calls the original callback() when the directory is entirely parsed.
 *
 * @param {FileSystemDirectoryReader} directoryReader
 * @param {Array} oldEntries
 * @param {Function} logDropError
 * @param {Function} callback - called with ([ all files and directories in that directoryReader ])
 */
module.exports = function getFilesAndDirectoriesFromDirectory(directoryReader, oldEntries, logDropError, _ref) {
  var onSuccess = _ref.onSuccess;
  directoryReader.readEntries(function (entries) {
    var newEntries = [].concat(oldEntries, entries); // According to the FileSystem API spec, getFilesAndDirectoriesFromDirectory() must be called until it calls the onSuccess with an empty array.

    if (entries.length) {
      setTimeout(function () {
        getFilesAndDirectoriesFromDirectory(directoryReader, newEntries, logDropError, {
          onSuccess: onSuccess
        });
      }, 0); // Done iterating this particular directory
    } else {
      onSuccess(newEntries);
    }
  }, // Make sure we resolve on error anyway, it's fine if only one directory couldn't be parsed!
  function (error) {
    logDropError(error);
    onSuccess(oldEntries);
  });
};
},{}],75:[function(require,module,exports){
/**
 * Get the relative path from the FileEntry#fullPath, because File#webkitRelativePath is always '', at least onDrop.
 *
 * @param {FileEntry} fileEntry
 *
 * @returns {string|null} - if file is not in a folder - return null (this is to be consistent with .relativePath-s of files selected from My Device). If file is in a folder - return its fullPath, e.g. '/simpsons/hi.jpeg'.
 */
module.exports = function getRelativePath(fileEntry) {
  // fileEntry.fullPath - "/simpsons/hi.jpeg" or undefined (for browsers that don't support it)
  // fileEntry.name - "hi.jpeg"
  if (!fileEntry.fullPath || fileEntry.fullPath === '/' + fileEntry.name) {
    return null;
  } else {
    return fileEntry.fullPath;
  }
};
},{}],76:[function(require,module,exports){
var toArray = require('../../../toArray');

var getRelativePath = require('./getRelativePath');

var getFilesAndDirectoriesFromDirectory = require('./getFilesAndDirectoriesFromDirectory');

module.exports = function webkitGetAsEntryApi(dataTransfer, logDropError) {
  var files = [];
  var rootPromises = [];
  /**
   * Returns a resolved promise, when :files array is enhanced
   *
   * @param {(FileSystemFileEntry|FileSystemDirectoryEntry)} entry
   * @returns {Promise} - empty promise that resolves when :files is enhanced with a file
   */

  var createPromiseToAddFileOrParseDirectory = function createPromiseToAddFileOrParseDirectory(entry) {
    return new Promise(function (resolve) {
      // This is a base call
      if (entry.isFile) {
        // Creates a new File object which can be used to read the file.
        entry.file(function (file) {
          file.relativePath = getRelativePath(entry);
          files.push(file);
          resolve();
        }, // Make sure we resolve on error anyway, it's fine if only one file couldn't be read!
        function (error) {
          logDropError(error);
          resolve();
        }); // This is a recursive call
      } else if (entry.isDirectory) {
        var directoryReader = entry.createReader();
        getFilesAndDirectoriesFromDirectory(directoryReader, [], logDropError, {
          onSuccess: function onSuccess(entries) {
            var promises = entries.map(function (entry) {
              return createPromiseToAddFileOrParseDirectory(entry);
            });
            Promise.all(promises).then(function () {
              return resolve();
            });
          }
        });
      }
    });
  }; // For each dropped item, - make sure it's a file/directory, and start deepening in!


  toArray(dataTransfer.items).forEach(function (item) {
    var entry = item.webkitGetAsEntry(); // :entry can be null when we drop the url e.g.

    if (entry) {
      rootPromises.push(createPromiseToAddFileOrParseDirectory(entry));
    }
  });
  return Promise.all(rootPromises).then(function () {
    return files;
  });
};
},{"../../../toArray":94,"./getFilesAndDirectoriesFromDirectory":74,"./getRelativePath":75}],77:[function(require,module,exports){
/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  var re = /(?:\.([^.]+))?$/;
  var fileExt = re.exec(fullFileName)[1];
  var fileName = fullFileName.replace('.' + fileExt, '');
  return {
    name: fileName,
    extension: fileExt
  };
};
},{}],78:[function(require,module,exports){
var getFileNameAndExtension = require('./getFileNameAndExtension');

var mimeTypes = require('./mimeTypes');

module.exports = function getFileType(file) {
  var fileExtension = file.name ? getFileNameAndExtension(file.name).extension : null;
  fileExtension = fileExtension ? fileExtension.toLowerCase() : null;

  if (file.type) {
    // if mime type is set in the file object already, use that
    return file.type;
  } else if (fileExtension && mimeTypes[fileExtension]) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } else {
    // if all fails, fall back to a generic byte stream type
    return 'application/octet-stream';
  }
};
},{"./getFileNameAndExtension":77,"./mimeTypes":89}],79:[function(require,module,exports){
// TODO Check which types are actually supported in browsers. Chrome likes webm
// from my testing, but we may need more.
// We could use a library but they tend to contain dozens of KBs of mappings,
// most of which will go unused, so not sure if that's worth it.
var mimeToExtensions = {
  'video/ogg': 'ogv',
  'audio/ogg': 'ogg',
  'video/webm': 'webm',
  'audio/webm': 'webm',
  'video/x-matroska': 'mkv',
  'video/mp4': 'mp4',
  'audio/mp3': 'mp3'
};

module.exports = function getFileTypeExtension(mimeType) {
  // Remove the ; bit in 'video/x-matroska;codecs=avc1'
  mimeType = mimeType.replace(/;.*$/, '');
  return mimeToExtensions[mimeType] || null;
};
},{}],80:[function(require,module,exports){
module.exports = function getSocketHost(url) {
  // get the host domain
  var regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  var host = regex.exec(url)[1];
  var socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return socketProtocol + "://" + host;
};
},{}],81:[function(require,module,exports){
module.exports = function getSpeed(fileProgress) {
  if (!fileProgress.bytesUploaded) return 0;
  var timeElapsed = new Date() - fileProgress.uploadStarted;
  var uploadSpeed = fileProgress.bytesUploaded / (timeElapsed / 1000);
  return uploadSpeed;
};
},{}],82:[function(require,module,exports){
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */
module.exports = function getTimeStamp() {
  var date = new Date();
  var hours = pad(date.getHours().toString());
  var minutes = pad(date.getMinutes().toString());
  var seconds = pad(date.getSeconds().toString());
  return hours + ':' + minutes + ':' + seconds;
};
/**
 * Adds zero to strings shorter than two characters
 */


function pad(str) {
  return str.length !== 2 ? 0 + str : str;
}
},{}],83:[function(require,module,exports){
module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};
},{}],84:[function(require,module,exports){
/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return obj && typeof obj === 'object' && obj.nodeType === Node.ELEMENT_NODE;
};
},{}],85:[function(require,module,exports){
/**
 * Checks if the browser supports Drag & Drop (not supported on mobile devices, for example).
 *
 * @returns {boolean}
 */
module.exports = function isDragDropSupported() {
  var div = document.createElement('div');

  if (!('draggable' in div) || !('ondragstart' in div && 'ondrop' in div)) {
    return false;
  }

  if (!('FormData' in window)) {
    return false;
  }

  if (!('FileReader' in window)) {
    return false;
  }

  return true;
};
},{}],86:[function(require,module,exports){
/**
 * Check if a URL string is an object URL from `URL.createObjectURL`.
 *
 * @param {string} url
 * @returns {boolean}
 */
module.exports = function isObjectURL(url) {
  return url.indexOf('blob:') === 0;
};
},{}],87:[function(require,module,exports){
module.exports = function isPreviewSupported(fileType) {
  if (!fileType) return false;
  var fileTypeSpecific = fileType.split('/')[1]; // list of images that browsers can preview

  if (/^(jpe?g|gif|png|svg|svg\+xml|bmp)$/.test(fileTypeSpecific)) {
    return true;
  }

  return false;
};
},{}],88:[function(require,module,exports){
module.exports = function isTouchDevice() {
  // works on most browsers
  if ('ontouchstart' in window) {
    return true;
  } // works on IE10/11 and Surface
  // eslint-disable-next-line compat/compat


  return !!navigator.maxTouchPoints;
};
},{}],89:[function(require,module,exports){
// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf'
};
},{}],90:[function(require,module,exports){
// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
module.exports = prettierBytes;

function prettierBytes(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num);
  }

  var neg = num < 0;
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B';
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1);
  num = Number(num / Math.pow(1024, exponent));
  var unit = units[exponent];

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit;
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit;
  }
}
},{}],91:[function(require,module,exports){
var secondsToTime = require('./secondsToTime');

module.exports = function prettyETA(seconds) {
  var time = secondsToTime(seconds); // Only display hours and minutes if they are greater than 0 but always
  // display minutes if hours is being displayed
  // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s

  var hoursStr = time.hours ? time.hours + 'h ' : '';
  var minutesVal = time.hours ? ('0' + time.minutes).substr(-2) : time.minutes;
  var minutesStr = minutesVal ? minutesVal + 'm' : '';
  var secondsVal = minutesVal ? ('0' + time.seconds).substr(-2) : time.seconds;
  var secondsStr = time.hours ? '' : minutesVal ? ' ' + secondsVal + 's' : secondsVal + 's';
  return "" + hoursStr + minutesStr + secondsStr;
};
},{"./secondsToTime":92}],92:[function(require,module,exports){
module.exports = function secondsToTime(rawSeconds) {
  var hours = Math.floor(rawSeconds / 3600) % 24;
  var minutes = Math.floor(rawSeconds / 60) % 60;
  var seconds = Math.floor(rawSeconds % 60);
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
};
},{}],93:[function(require,module,exports){
module.exports = function settle(promises) {
  var resolutions = [];
  var rejections = [];

  function resolved(value) {
    resolutions.push(value);
  }

  function rejected(error) {
    rejections.push(error);
  }

  var wait = Promise.all(promises.map(function (promise) {
    return promise.then(resolved, rejected);
  }));
  return wait.then(function () {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
};
},{}],94:[function(require,module,exports){
/**
 * Converts list into array
 */
module.exports = function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
};
},{}],95:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

module.exports = function (props) {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    fill: "#0097DC",
    width: "66",
    height: "55",
    viewBox: "0 0 66 55"
  }, h("path", {
    d: "M57.3 8.433c4.59 0 8.1 3.51 8.1 8.1v29.7c0 4.59-3.51 8.1-8.1 8.1H8.7c-4.59 0-8.1-3.51-8.1-8.1v-29.7c0-4.59 3.51-8.1 8.1-8.1h9.45l4.59-7.02c.54-.54 1.35-1.08 2.16-1.08h16.2c.81 0 1.62.54 2.16 1.08l4.59 7.02h9.45zM33 14.64c-8.62 0-15.393 6.773-15.393 15.393 0 8.62 6.773 15.393 15.393 15.393 8.62 0 15.393-6.773 15.393-15.393 0-8.62-6.773-15.393-15.393-15.393zM33 40c-5.648 0-9.966-4.319-9.966-9.967 0-5.647 4.318-9.966 9.966-9.966s9.966 4.319 9.966 9.966C42.966 35.681 38.648 40 33 40z",
    "fill-rule": "evenodd"
  }));
};
},{"preact":116}],96:[function(require,module,exports){
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('preact'),
    h = _require.h,
    Component = _require.Component;

var SnapshotButton = require('./SnapshotButton');

var RecordButton = require('./RecordButton');

function isModeAvailable(modes, mode) {
  return modes.indexOf(mode) !== -1;
}

var CameraScreen =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(CameraScreen, _Component);

  function CameraScreen() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = CameraScreen.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.props.onFocus();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.props.onStop();
  };

  _proto.render = function render() {
    var shouldShowRecordButton = this.props.supportsRecording && (isModeAvailable(this.props.modes, 'video-only') || isModeAvailable(this.props.modes, 'audio-only') || isModeAvailable(this.props.modes, 'video-audio'));
    var shouldShowSnapshotButton = isModeAvailable(this.props.modes, 'picture');
    return h("div", {
      class: "uppy uppy-Webcam-container"
    }, h("div", {
      class: "uppy-Webcam-videoContainer"
    }, h("video", {
      class: "uppy-Webcam-video  " + (this.props.mirror ? 'uppy-Webcam-video--mirrored' : ''),
      autoplay: true,
      muted: true,
      playsinline: true,
      srcObject: this.props.src || ''
    })), h("div", {
      class: "uppy-Webcam-buttonContainer"
    }, shouldShowSnapshotButton ? SnapshotButton(this.props) : null, ' ', shouldShowRecordButton ? RecordButton(this.props) : null));
  };

  return CameraScreen;
}(Component);

module.exports = CameraScreen;
},{"./RecordButton":98,"./SnapshotButton":99,"preact":116}],97:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

module.exports = function (props) {
  return h("div", {
    class: "uppy-Webcam-permissons"
  }, h("div", {
    class: "uppy-Webcam-permissonsIcon"
  }, props.icon()), h("h1", {
    class: "uppy-Webcam-title"
  }, props.i18n('allowAccessTitle')), h("p", null, props.i18n('allowAccessDescription')));
};
},{"preact":116}],98:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

module.exports = function RecordButton(_ref) {
  var recording = _ref.recording,
      onStartRecording = _ref.onStartRecording,
      onStopRecording = _ref.onStopRecording,
      i18n = _ref.i18n;

  if (recording) {
    return h("button", {
      class: "uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--video",
      type: "button",
      title: i18n('stopRecording'),
      "aria-label": i18n('stopRecording'),
      onclick: onStopRecording,
      "data-uppy-super-focusable": true
    }, h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "UppyIcon",
      width: "100",
      height: "100",
      viewBox: "0 0 100 100"
    }, h("rect", {
      x: "15",
      y: "15",
      width: "70",
      height: "70"
    })));
  }

  return h("button", {
    class: "uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--video",
    type: "button",
    title: i18n('startRecording'),
    "aria-label": i18n('startRecording'),
    onclick: onStartRecording,
    "data-uppy-super-focusable": true
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    class: "UppyIcon",
    width: "100",
    height: "100",
    viewBox: "0 0 100 100"
  }, h("circle", {
    cx: "50",
    cy: "50",
    r: "40"
  })));
};
},{"preact":116}],99:[function(require,module,exports){
var _require = require('preact'),
    h = _require.h;

var CameraIcon = require('./CameraIcon');

module.exports = function (_ref) {
  var onSnapshot = _ref.onSnapshot,
      i18n = _ref.i18n;
  return h("button", {
    class: "uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--picture",
    type: "button",
    title: i18n('takePicture'),
    "aria-label": i18n('takePicture'),
    onclick: onSnapshot,
    "data-uppy-super-focusable": true
  }, CameraIcon());
};
},{"./CameraIcon":95,"preact":116}],100:[function(require,module,exports){
var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('preact'),
    h = _require.h;

var _require2 = require('@uppy/core'),
    Plugin = _require2.Plugin;

var Translator = require('@uppy/utils/lib/Translator');

var getFileTypeExtension = require('@uppy/utils/lib/getFileTypeExtension');

var canvasToBlob = require('@uppy/utils/lib/canvasToBlob');

var supportsMediaRecorder = require('./supportsMediaRecorder');

var CameraIcon = require('./CameraIcon');

var CameraScreen = require('./CameraScreen');

var PermissionsScreen = require('./PermissionsScreen'); // Setup getUserMedia, with polyfill for older browsers
// Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia


function getMediaDevices() {
  // eslint-disable-next-line compat/compat
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // eslint-disable-next-line compat/compat
    return navigator.mediaDevices;
  }

  var _getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

  if (!_getUserMedia) {
    return null;
  }

  return {
    getUserMedia: function getUserMedia(opts) {
      return new Promise(function (resolve, reject) {
        _getUserMedia.call(navigator, opts, resolve, reject);
      });
    }
  };
}
/**
 * Webcam
 */


module.exports = (_temp = _class =
/*#__PURE__*/
function (_Plugin) {
  _inheritsLoose(Webcam, _Plugin);

  function Webcam(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.mediaDevices = getMediaDevices();
    _this.supportsUserMedia = !!_this.mediaDevices;
    _this.protocol = location.protocol.match(/https/i) ? 'https' : 'http';
    _this.id = _this.opts.id || 'Webcam';
    _this.title = _this.opts.title || 'Camera';
    _this.type = 'acquirer';
    _this.icon = CameraIcon;
    _this.defaultLocale = {
      strings: {
        smile: 'Smile!',
        takePicture: 'Take a picture',
        startRecording: 'Begin video recording',
        stopRecording: 'Stop video recording',
        allowAccessTitle: 'Please allow access to your camera',
        allowAccessDescription: 'In order to take pictures or record video with your camera, please allow camera access for this site.'
      } // set default options

    };
    var defaultOptions = {
      onBeforeSnapshot: function onBeforeSnapshot() {
        return Promise.resolve();
      },
      countdown: false,
      modes: ['video-audio', 'video-only', 'audio-only', 'picture'],
      mirror: true,
      facingMode: 'user',
      preferredVideoMimeType: null
    };
    _this.opts = _extends({}, defaultOptions, {}, opts);

    _this.i18nInit();

    _this.install = _this.install.bind(_assertThisInitialized(_this));
    _this.setPluginState = _this.setPluginState.bind(_assertThisInitialized(_this));
    _this.render = _this.render.bind(_assertThisInitialized(_this)); // Camera controls

    _this.start = _this.start.bind(_assertThisInitialized(_this));
    _this.stop = _this.stop.bind(_assertThisInitialized(_this));
    _this.takeSnapshot = _this.takeSnapshot.bind(_assertThisInitialized(_this));
    _this.startRecording = _this.startRecording.bind(_assertThisInitialized(_this));
    _this.stopRecording = _this.stopRecording.bind(_assertThisInitialized(_this));
    _this.oneTwoThreeSmile = _this.oneTwoThreeSmile.bind(_assertThisInitialized(_this));
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.webcamActive = false;

    if (_this.opts.countdown) {
      _this.opts.onBeforeSnapshot = _this.oneTwoThreeSmile;
    }

    return _this;
  }

  var _proto = Webcam.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.i18nArray = this.translator.translateArray.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.isSupported = function isSupported() {
    return !!this.mediaDevices;
  };

  _proto.getConstraints = function getConstraints() {
    var acceptsAudio = this.opts.modes.indexOf('video-audio') !== -1 || this.opts.modes.indexOf('audio-only') !== -1;
    var acceptsVideo = this.opts.modes.indexOf('video-audio') !== -1 || this.opts.modes.indexOf('video-only') !== -1 || this.opts.modes.indexOf('picture') !== -1;
    return {
      audio: acceptsAudio,
      video: acceptsVideo ? {
        facingMode: this.opts.facingMode
      } : false
    };
  };

  _proto.start = function start() {
    var _this2 = this;

    if (!this.isSupported()) {
      return Promise.reject(new Error('Webcam access not supported'));
    }

    this.webcamActive = true;
    var constraints = this.getConstraints(); // ask user for access to their camera

    return this.mediaDevices.getUserMedia(constraints).then(function (stream) {
      _this2.stream = stream; // this.streamSrc = URL.createObjectURL(this.stream)

      _this2.setPluginState({
        cameraReady: true
      });
    }).catch(function (err) {
      _this2.setPluginState({
        cameraError: err
      });
    });
  };

  _proto.startRecording = function startRecording() {
    var _this3 = this;

    var options = {};
    var preferredVideoMimeType = this.opts.preferredVideoMimeType; // Attempt to use the passed preferredVideoMimeType (if any) during recording.
    // If the browser doesn't support it, we'll fall back to the browser default instead

    if (preferredVideoMimeType && MediaRecorder.isTypeSupported(preferredVideoMimeType) && getFileTypeExtension(preferredVideoMimeType)) {
      options.mimeType = preferredVideoMimeType;
    }

    this.recorder = new MediaRecorder(this.stream, options);
    this.recordingChunks = [];
    this.recorder.addEventListener('dataavailable', function (event) {
      _this3.recordingChunks.push(event.data);
    });
    this.recorder.start();
    this.setPluginState({
      isRecording: true
    });
  };

  _proto.stopRecording = function stopRecording() {
    var _this4 = this;

    var stopped = new Promise(function (resolve, reject) {
      _this4.recorder.addEventListener('stop', function () {
        resolve();
      });

      _this4.recorder.stop();
    });
    return stopped.then(function () {
      _this4.setPluginState({
        isRecording: false
      });

      return _this4.getVideo();
    }).then(function (file) {
      try {
        _this4.uppy.addFile(file);
      } catch (err) {
        // Logging the error, exept restrictions, which is handled in Core
        if (!err.isRestriction) {
          _this4.uppy.log(err);
        }
      }
    }).then(function () {
      _this4.recordingChunks = null;
      _this4.recorder = null; // Close the Dashboard panel if plugin is installed
      // into Dashboard (could be other parent UI plugin)
      // if (this.parent && this.parent.hideAllPanels) {
      //   this.parent.hideAllPanels()
      // }
    }, function (error) {
      _this4.recordingChunks = null;
      _this4.recorder = null;
      throw error;
    });
  };

  _proto.stop = function stop() {
    this.stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });
    this.stream.getVideoTracks().forEach(function (track) {
      track.stop();
    });
    this.webcamActive = false;
    this.stream = null;
  };

  _proto.getVideoElement = function getVideoElement() {
    return this.el.querySelector('.uppy-Webcam-video');
  };

  _proto.oneTwoThreeSmile = function oneTwoThreeSmile() {
    var _this5 = this;

    return new Promise(function (resolve, reject) {
      var count = _this5.opts.countdown;
      var countDown = setInterval(function () {
        if (!_this5.webcamActive) {
          clearInterval(countDown);
          _this5.captureInProgress = false;
          return reject(new Error('Webcam is not active'));
        }

        if (count > 0) {
          _this5.uppy.info(count + "...", 'warning', 800);

          count--;
        } else {
          clearInterval(countDown);

          _this5.uppy.info(_this5.i18n('smile'), 'success', 1500);

          setTimeout(function () {
            return resolve();
          }, 1500);
        }
      }, 1000);
    });
  };

  _proto.takeSnapshot = function takeSnapshot() {
    var _this6 = this;

    if (this.captureInProgress) return;
    this.captureInProgress = true;
    this.opts.onBeforeSnapshot().catch(function (err) {
      var message = typeof err === 'object' ? err.message : err;

      _this6.uppy.info(message, 'error', 5000);

      return Promise.reject(new Error("onBeforeSnapshot: " + message));
    }).then(function () {
      return _this6.getImage();
    }).then(function (tagFile) {
      _this6.captureInProgress = false; // Close the Dashboard panel if plugin is installed
      // into Dashboard (could be other parent UI plugin)
      // if (this.parent && this.parent.hideAllPanels) {
      //   this.parent.hideAllPanels()
      // }

      try {
        _this6.uppy.addFile(tagFile);
      } catch (err) {
        // Logging the error, exept restrictions, which is handled in Core
        if (!err.isRestriction) {
          _this6.uppy.log(err);
        }
      }
    }, function (error) {
      _this6.captureInProgress = false;
      throw error;
    });
  };

  _proto.getImage = function getImage() {
    var _this7 = this;

    var video = this.getVideoElement();

    if (!video) {
      return Promise.reject(new Error('No video element found, likely due to the Webcam tab being closed.'));
    }

    var name = "cam-" + Date.now() + ".jpg";
    var mimeType = 'image/jpeg';
    var width = video.videoWidth;
    var height = video.videoHeight; // const scaleH = this.opts.mirror ? -1 : 1 // Set horizontal scale to -1 if flip horizontal
    // const scaleV = 1
    // const posX = this.opts.mirror ? width * -1 : 0 // Set x position to -100% if flip horizontal
    // const posY = 0

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0); // ctx.save() // Save the current state
    // ctx.scale(scaleH, scaleV) // Set scale to flip the image
    // ctx.drawImage(video, posX, posY, width, height) // draw the image
    // ctx.restore() // Restore the last saved state

    return canvasToBlob(canvas, mimeType).then(function (blob) {
      return {
        source: _this7.id,
        name: name,
        data: new Blob([blob], {
          type: mimeType
        }),
        type: mimeType
      };
    });
  };

  _proto.getVideo = function getVideo() {
    var mimeType = this.recordingChunks[0].type;
    var fileExtension = getFileTypeExtension(mimeType);

    if (!fileExtension) {
      return Promise.reject(new Error("Could not retrieve recording: Unsupported media type \"" + mimeType + "\""));
    }

    var name = "webcam-" + Date.now() + "." + fileExtension;
    var blob = new Blob(this.recordingChunks, {
      type: mimeType
    });
    var file = {
      source: this.id,
      name: name,
      data: new Blob([blob], {
        type: mimeType
      }),
      type: mimeType
    };
    return Promise.resolve(file);
  };

  _proto.focus = function focus() {
    var _this8 = this;

    if (!this.opts.countdown) return;
    setTimeout(function () {
      _this8.uppy.info(_this8.i18n('smile'), 'success', 1500);
    }, 1000);
  };

  _proto.render = function render(state) {
    if (!this.webcamActive) {
      this.start();
    }

    var webcamState = this.getPluginState();

    if (!webcamState.cameraReady) {
      return h(PermissionsScreen, {
        icon: CameraIcon,
        i18n: this.i18n
      });
    }

    return h(CameraScreen, _extends({}, webcamState, {
      onSnapshot: this.takeSnapshot,
      onStartRecording: this.startRecording,
      onStopRecording: this.stopRecording,
      onFocus: this.focus,
      onStop: this.stop,
      i18n: this.i18n,
      modes: this.opts.modes,
      supportsRecording: supportsMediaRecorder(),
      recording: webcamState.isRecording,
      mirror: this.opts.mirror,
      src: this.stream
    }));
  };

  _proto.install = function install() {
    this.setPluginState({
      cameraReady: false
    });
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    if (this.stream) {
      this.stop();
    }

    this.unmount();
  };

  return Webcam;
}(Plugin), _class.VERSION = "1.4.0", _temp);
},{"./CameraIcon":95,"./CameraScreen":96,"./PermissionsScreen":97,"./supportsMediaRecorder":101,"@uppy/core":9,"@uppy/utils/lib/Translator":64,"@uppy/utils/lib/canvasToBlob":65,"@uppy/utils/lib/getFileTypeExtension":79,"preact":116}],101:[function(require,module,exports){
module.exports = function supportsMediaRecorder() {
  return typeof MediaRecorder === 'function' && !!MediaRecorder.prototype && typeof MediaRecorder.prototype.start === 'function';
};
},{}],102:[function(require,module,exports){
var _class, _temp;

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var cuid = require('cuid');

var Translator = require('@uppy/utils/lib/Translator');

var _require2 = require('@uppy/companion-client'),
    Provider = _require2.Provider,
    RequestClient = _require2.RequestClient,
    Socket = _require2.Socket;

var emitSocketProgress = require('@uppy/utils/lib/emitSocketProgress');

var getSocketHost = require('@uppy/utils/lib/getSocketHost');

var settle = require('@uppy/utils/lib/settle');

var EventTracker = require('@uppy/utils/lib/EventTracker');

var ProgressTimeout = require('@uppy/utils/lib/ProgressTimeout');

var RateLimitedQueue = require('@uppy/utils/lib/RateLimitedQueue');

function buildResponseError(xhr, error) {
  // No error message
  if (!error) error = new Error('Upload error'); // Got an error message string

  if (typeof error === 'string') error = new Error(error); // Got something else

  if (!(error instanceof Error)) {
    error = _extends(new Error('Upload error'), {
      data: error
    });
  }

  error.request = xhr;
  return error;
}
/**
 * Set `data.type` in the blob to `file.meta.type`,
 * because we might have detected a more accurate file type in Uppy
 * https://stackoverflow.com/a/50875615
 *
 * @param {object} file File object with `data`, `size` and `meta` properties
 * @returns {object} blob updated with the new `type` set from `file.meta.type`
 */


function setTypeInBlob(file) {
  var dataWithUpdatedType = file.data.slice(0, file.data.size, file.meta.type);
  return dataWithUpdatedType;
}

module.exports = (_temp = _class =
/*#__PURE__*/
function (_Plugin) {
  _inheritsLoose(XHRUpload, _Plugin);

  function XHRUpload(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.type = 'uploader';
    _this.id = _this.opts.id || 'XHRUpload';
    _this.title = 'XHRUpload';
    _this.defaultLocale = {
      strings: {
        timedOut: 'Upload stalled for %{seconds} seconds, aborting.'
      } // Default options

    };
    var defaultOptions = {
      formData: true,
      fieldName: 'files[]',
      method: 'post',
      metaFields: null,
      responseUrlFieldName: 'url',
      bundle: false,
      headers: {},
      timeout: 30 * 1000,
      limit: 0,
      withCredentials: false,
      responseType: '',

      /**
       * @typedef respObj
       * @property {string} responseText
       * @property {number} status
       * @property {string} statusText
       * @property {object.<string, string>} headers
       *
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      getResponseData: function getResponseData(responseText, response) {
        var parsedResponse = {};

        try {
          parsedResponse = JSON.parse(responseText);
        } catch (err) {
          console.log(err);
        }

        return parsedResponse;
      },

      /**
       *
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      getResponseError: function getResponseError(responseText, response) {
        return new Error('Upload error');
      },

      /**
       * @param {number} status the response status code
       * @param {string} responseText the response body string
       * @param {XMLHttpRequest | respObj} response the response object (XHR or similar)
       */
      validateStatus: function validateStatus(status, responseText, response) {
        return status >= 200 && status < 300;
      }
    };
    _this.opts = _extends({}, defaultOptions, {}, opts);

    _this.i18nInit();

    _this.handleUpload = _this.handleUpload.bind(_assertThisInitialized(_this)); // Simultaneous upload limiting is shared across all uploads with this plugin.
    // __queue is for internal Uppy use only!

    if (_this.opts.__queue instanceof RateLimitedQueue) {
      _this.requests = _this.opts.__queue;
    } else {
      _this.requests = new RateLimitedQueue(_this.opts.limit);
    }

    if (_this.opts.bundle && !_this.opts.formData) {
      throw new Error('`opts.formData` must be true when `opts.bundle` is enabled.');
    }

    _this.uploaderEvents = Object.create(null);
    return _this;
  }

  var _proto = XHRUpload.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.getOptions = function getOptions(file) {
    var overrides = this.uppy.getState().xhrUpload;

    var opts = _extends({}, this.opts, {}, overrides || {}, {}, file.xhrUpload || {}, {
      headers: {}
    });

    _extends(opts.headers, this.opts.headers);

    if (overrides) {
      _extends(opts.headers, overrides.headers);
    }

    if (file.xhrUpload) {
      _extends(opts.headers, file.xhrUpload.headers);
    }

    return opts;
  };

  _proto.addMetadata = function addMetadata(formData, meta, opts) {
    var metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
    : Object.keys(meta);
    metaFields.forEach(function (item) {
      formData.append(item, meta[item]);
    });
  };

  _proto.createFormDataUpload = function createFormDataUpload(file, opts) {
    var formPost = new FormData();
    this.addMetadata(formPost, file.meta, opts);
    var dataWithUpdatedType = setTypeInBlob(file);

    if (file.name) {
      formPost.append(opts.fieldName, dataWithUpdatedType, file.meta.name);
    } else {
      formPost.append(opts.fieldName, dataWithUpdatedType);
    }

    return formPost;
  };

  _proto.createBundledUpload = function createBundledUpload(files, opts) {
    var _this2 = this;

    var formPost = new FormData();

    var _this$uppy$getState = this.uppy.getState(),
        meta = _this$uppy$getState.meta;

    this.addMetadata(formPost, meta, opts);
    files.forEach(function (file) {
      var opts = _this2.getOptions(file);

      var dataWithUpdatedType = setTypeInBlob(file);

      if (file.name) {
        formPost.append(opts.fieldName, dataWithUpdatedType, file.name);
      } else {
        formPost.append(opts.fieldName, dataWithUpdatedType);
      }
    });
    return formPost;
  };

  _proto.createBareUpload = function createBareUpload(file, opts) {
    return file.data;
  };

  _proto.upload = function upload(file, current, total) {
    var _this3 = this;

    var opts = this.getOptions(file);
    this.uppy.log("uploading " + current + " of " + total);
    return new Promise(function (resolve, reject) {
      _this3.uppy.emit('upload-started', file);

      var data = opts.formData ? _this3.createFormDataUpload(file, opts) : _this3.createBareUpload(file, opts);
      var timer = new ProgressTimeout(opts.timeout, function () {
        xhr.abort();
        var error = new Error(_this3.i18n('timedOut', {
          seconds: Math.ceil(opts.timeout / 1000)
        }));

        _this3.uppy.emit('upload-error', file, error);

        reject(error);
      });
      var xhr = new XMLHttpRequest();
      _this3.uploaderEvents[file.id] = new EventTracker(_this3.uppy);
      var id = cuid();
      xhr.upload.addEventListener('loadstart', function (ev) {
        _this3.uppy.log("[XHRUpload] " + id + " started");
      });
      xhr.upload.addEventListener('progress', function (ev) {
        _this3.uppy.log("[XHRUpload] " + id + " progress: " + ev.loaded + " / " + ev.total); // Begin checking for timeouts when progress starts, instead of loading,
        // to avoid timing out requests on browser concurrency queue


        timer.progress();

        if (ev.lengthComputable) {
          _this3.uppy.emit('upload-progress', file, {
            uploader: _this3,
            bytesUploaded: ev.loaded,
            bytesTotal: ev.total
          });
        }
      });
      xhr.addEventListener('load', function (ev) {
        _this3.uppy.log("[XHRUpload] " + id + " finished");

        timer.done();
        queuedRequest.done();

        if (_this3.uploaderEvents[file.id]) {
          _this3.uploaderEvents[file.id].remove();

          _this3.uploaderEvents[file.id] = null;
        }

        if (opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
          var body = opts.getResponseData(xhr.responseText, xhr);
          var uploadURL = body[opts.responseUrlFieldName];
          var uploadResp = {
            status: ev.target.status,
            body: body,
            uploadURL: uploadURL
          };

          _this3.uppy.emit('upload-success', file, uploadResp);

          if (uploadURL) {
            _this3.uppy.log("Download " + file.name + " from " + uploadURL);
          }

          return resolve(file);
        } else {
          var _body = opts.getResponseData(xhr.responseText, xhr);

          var error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
          var response = {
            status: ev.target.status,
            body: _body
          };

          _this3.uppy.emit('upload-error', file, error, response);

          return reject(error);
        }
      });
      xhr.addEventListener('error', function (ev) {
        _this3.uppy.log("[XHRUpload] " + id + " errored");

        timer.done();
        queuedRequest.done();

        if (_this3.uploaderEvents[file.id]) {
          _this3.uploaderEvents[file.id].remove();

          _this3.uploaderEvents[file.id] = null;
        }

        var error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));

        _this3.uppy.emit('upload-error', file, error);

        return reject(error);
      });
      xhr.open(opts.method.toUpperCase(), opts.endpoint, true); // IE10 does not allow setting `withCredentials` and `responseType`
      // before `open()` is called.

      xhr.withCredentials = opts.withCredentials;

      if (opts.responseType !== '') {
        xhr.responseType = opts.responseType;
      }

      Object.keys(opts.headers).forEach(function (header) {
        xhr.setRequestHeader(header, opts.headers[header]);
      });

      var queuedRequest = _this3.requests.run(function () {
        xhr.send(data);
        return function () {
          timer.done();
          xhr.abort();
        };
      });

      _this3.onFileRemove(file.id, function () {
        queuedRequest.abort();
        reject(new Error('File removed'));
      });

      _this3.onCancelAll(file.id, function () {
        queuedRequest.abort();
        reject(new Error('Upload cancelled'));
      });
    });
  };

  _proto.uploadRemote = function uploadRemote(file, current, total) {
    var _this4 = this;

    var opts = this.getOptions(file);
    return new Promise(function (resolve, reject) {
      _this4.uppy.emit('upload-started', file);

      var fields = {};
      var metaFields = Array.isArray(opts.metaFields) ? opts.metaFields // Send along all fields by default.
      : Object.keys(file.meta);
      metaFields.forEach(function (name) {
        fields[name] = file.meta[name];
      });
      var Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      var client = new Client(_this4.uppy, file.remote.providerOptions);
      client.post(file.remote.url, _extends({}, file.remote.body, {
        endpoint: opts.endpoint,
        size: file.data.size,
        fieldname: opts.fieldName,
        metadata: fields,
        headers: opts.headers
      })).then(function (res) {
        var token = res.token;
        var host = getSocketHost(file.remote.companionUrl);
        var socket = new Socket({
          target: host + "/api/" + token,
          autoOpen: false
        });
        _this4.uploaderEvents[file.id] = new EventTracker(_this4.uppy);

        _this4.onFileRemove(file.id, function () {
          socket.send('pause', {});
          queuedRequest.abort();
          resolve("upload " + file.id + " was removed");
        });

        _this4.onCancelAll(file.id, function () {
          socket.send('pause', {});
          queuedRequest.abort();
          resolve("upload " + file.id + " was canceled");
        });

        _this4.onRetry(file.id, function () {
          socket.send('pause', {});
          socket.send('resume', {});
        });

        _this4.onRetryAll(file.id, function () {
          socket.send('pause', {});
          socket.send('resume', {});
        });

        socket.on('progress', function (progressData) {
          return emitSocketProgress(_this4, progressData, file);
        });
        socket.on('success', function (data) {
          var body = opts.getResponseData(data.response.responseText, data.response);
          var uploadURL = body[opts.responseUrlFieldName];
          var uploadResp = {
            status: data.response.status,
            body: body,
            uploadURL: uploadURL
          };

          _this4.uppy.emit('upload-success', file, uploadResp);

          queuedRequest.done();

          if (_this4.uploaderEvents[file.id]) {
            _this4.uploaderEvents[file.id].remove();

            _this4.uploaderEvents[file.id] = null;
          }

          return resolve();
        });
        socket.on('error', function (errData) {
          var resp = errData.response;
          var error = resp ? opts.getResponseError(resp.responseText, resp) : _extends(new Error(errData.error.message), {
            cause: errData.error
          });

          _this4.uppy.emit('upload-error', file, error);

          queuedRequest.done();

          if (_this4.uploaderEvents[file.id]) {
            _this4.uploaderEvents[file.id].remove();

            _this4.uploaderEvents[file.id] = null;
          }

          reject(error);
        });

        var queuedRequest = _this4.requests.run(function () {
          socket.open();

          if (file.isPaused) {
            socket.send('pause', {});
          }

          return function () {
            return socket.close();
          };
        });
      });
    });
  };

  _proto.uploadBundle = function uploadBundle(files) {
    var _this5 = this;

    return new Promise(function (resolve, reject) {
      var endpoint = _this5.opts.endpoint;
      var method = _this5.opts.method;

      var optsFromState = _this5.uppy.getState().xhrUpload;

      var formData = _this5.createBundledUpload(files, _extends({}, _this5.opts, {}, optsFromState || {}));

      var xhr = new XMLHttpRequest();
      var timer = new ProgressTimeout(_this5.opts.timeout, function () {
        xhr.abort();
        var error = new Error(_this5.i18n('timedOut', {
          seconds: Math.ceil(_this5.opts.timeout / 1000)
        }));
        emitError(error);
        reject(error);
      });

      var emitError = function emitError(error) {
        files.forEach(function (file) {
          _this5.uppy.emit('upload-error', file, error);
        });
      };

      xhr.upload.addEventListener('loadstart', function (ev) {
        _this5.uppy.log('[XHRUpload] started uploading bundle');

        timer.progress();
      });
      xhr.upload.addEventListener('progress', function (ev) {
        timer.progress();
        if (!ev.lengthComputable) return;
        files.forEach(function (file) {
          _this5.uppy.emit('upload-progress', file, {
            uploader: _this5,
            bytesUploaded: ev.loaded / ev.total * file.size,
            bytesTotal: file.size
          });
        });
      });
      xhr.addEventListener('load', function (ev) {
        timer.done();

        if (_this5.opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
          var body = _this5.opts.getResponseData(xhr.responseText, xhr);

          var uploadResp = {
            status: ev.target.status,
            body: body
          };
          files.forEach(function (file) {
            _this5.uppy.emit('upload-success', file, uploadResp);
          });
          return resolve();
        }

        var error = _this5.opts.getResponseError(xhr.responseText, xhr) || new Error('Upload error');
        error.request = xhr;
        emitError(error);
        return reject(error);
      });
      xhr.addEventListener('error', function (ev) {
        timer.done();
        var error = _this5.opts.getResponseError(xhr.responseText, xhr) || new Error('Upload error');
        emitError(error);
        return reject(error);
      });

      _this5.uppy.on('cancel-all', function () {
        timer.done();
        xhr.abort();
      });

      xhr.open(method.toUpperCase(), endpoint, true); // IE10 does not allow setting `withCredentials` and `responseType`
      // before `open()` is called.

      xhr.withCredentials = _this5.opts.withCredentials;

      if (_this5.opts.responseType !== '') {
        xhr.responseType = _this5.opts.responseType;
      }

      Object.keys(_this5.opts.headers).forEach(function (header) {
        xhr.setRequestHeader(header, _this5.opts.headers[header]);
      });
      xhr.send(formData);
      files.forEach(function (file) {
        _this5.uppy.emit('upload-started', file);
      });
    });
  };

  _proto.uploadFiles = function uploadFiles(files) {
    var _this6 = this;

    var promises = files.map(function (file, i) {
      var current = parseInt(i, 10) + 1;
      var total = files.length;

      if (file.error) {
        return Promise.reject(new Error(file.error));
      } else if (file.isRemote) {
        return _this6.uploadRemote(file, current, total);
      } else {
        return _this6.upload(file, current, total);
      }
    });
    return settle(promises);
  };

  _proto.onFileRemove = function onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', function (file) {
      if (fileID === file.id) cb(file.id);
    });
  };

  _proto.onRetry = function onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', function (targetFileID) {
      if (fileID === targetFileID) {
        cb();
      }
    });
  };

  _proto.onRetryAll = function onRetryAll(fileID, cb) {
    var _this7 = this;

    this.uploaderEvents[fileID].on('retry-all', function (filesToRetry) {
      if (!_this7.uppy.getFile(fileID)) return;
      cb();
    });
  };

  _proto.onCancelAll = function onCancelAll(fileID, cb) {
    var _this8 = this;

    this.uploaderEvents[fileID].on('cancel-all', function () {
      if (!_this8.uppy.getFile(fileID)) return;
      cb();
    });
  };

  _proto.handleUpload = function handleUpload(fileIDs) {
    var _this9 = this;

    if (fileIDs.length === 0) {
      this.uppy.log('[XHRUpload] No files to upload!');
      return Promise.resolve();
    }

    if (this.opts.limit === 0) {
      this.uppy.log('[XHRUpload] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/xhr-upload/#limit-0', 'warning');
    }

    this.uppy.log('[XHRUpload] Uploading...');
    var files = fileIDs.map(function (fileID) {
      return _this9.uppy.getFile(fileID);
    });

    if (this.opts.bundle) {
      // if bundle: true, we don’t support remote uploads
      var isSomeFileRemote = files.some(function (file) {
        return file.isRemote;
      });

      if (isSomeFileRemote) {
        throw new Error('Can’t upload remote files when bundle: true option is set');
      }

      return this.uploadBundle(files);
    }

    return this.uploadFiles(files).then(function () {
      return null;
    });
  };

  _proto.install = function install() {
    if (this.opts.bundle) {
      var _this$uppy$getState2 = this.uppy.getState(),
          capabilities = _this$uppy$getState2.capabilities;

      this.uppy.setState({
        capabilities: _extends({}, capabilities, {
          individualCancellation: false
        })
      });
    }

    this.uppy.addUploader(this.handleUpload);
  };

  _proto.uninstall = function uninstall() {
    if (this.opts.bundle) {
      var _this$uppy$getState3 = this.uppy.getState(),
          capabilities = _this$uppy$getState3.capabilities;

      this.uppy.setState({
        capabilities: _extends({}, capabilities, {
          individualCancellation: true
        })
      });
    }

    this.uppy.removeUploader(this.handleUpload);
  };

  return XHRUpload;
}(Plugin), _class.VERSION = "1.4.0", _temp);
},{"@uppy/companion-client":6,"@uppy/core":9,"@uppy/utils/lib/EventTracker":60,"@uppy/utils/lib/ProgressTimeout":62,"@uppy/utils/lib/RateLimitedQueue":63,"@uppy/utils/lib/Translator":64,"@uppy/utils/lib/emitSocketProgress":67,"@uppy/utils/lib/getSocketHost":80,"@uppy/utils/lib/settle":93,"cuid":104}],103:[function(require,module,exports){
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],104:[function(require,module,exports){
/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */

var fingerprint = require('./lib/fingerprint.js');
var pad = require('./lib/pad.js');
var getRandomValue = require('./lib/getRandomValue.js');

var c = 0,
  blockSize = 4,
  base = 36,
  discreteValues = Math.pow(base, blockSize);

function randomBlock () {
  return pad((getRandomValue() *
    discreteValues << 0)
    .toString(base), blockSize);
}

function safeCounter () {
  c = c < discreteValues ? c : 0;
  c++; // this is not subliminal
  return c - 1;
}

function cuid () {
  // Starting with a lowercase letter makes
  // it HTML element ID friendly.
  var letter = 'c', // hard-coded allows for sequential access

    // timestamp
    // warning: this exposes the exact date and time
    // that the uid was created.
    timestamp = (new Date().getTime()).toString(base),

    // Prevent same-machine collisions.
    counter = pad(safeCounter().toString(base), blockSize),

    // A few chars to generate distinct ids for different
    // clients (so different computers are far less
    // likely to generate the same id)
    print = fingerprint(),

    // Grab some more chars from Math.random()
    random = randomBlock() + randomBlock();

  return letter + timestamp + counter + print + random;
}

cuid.slug = function slug () {
  var date = new Date().getTime().toString(36),
    counter = safeCounter().toString(36).slice(-4),
    print = fingerprint().slice(0, 1) +
      fingerprint().slice(-1),
    random = randomBlock().slice(-2);

  return date.slice(-2) +
    counter + print + random;
};

cuid.isCuid = function isCuid (stringToCheck) {
  if (typeof stringToCheck !== 'string') return false;
  if (stringToCheck.startsWith('c')) return true;
  return false;
};

cuid.isSlug = function isSlug (stringToCheck) {
  if (typeof stringToCheck !== 'string') return false;
  var stringLength = stringToCheck.length;
  if (stringLength >= 7 && stringLength <= 10) return true;
  return false;
};

cuid.fingerprint = fingerprint;

module.exports = cuid;

},{"./lib/fingerprint.js":105,"./lib/getRandomValue.js":106,"./lib/pad.js":107}],105:[function(require,module,exports){
var pad = require('./pad.js');

var env = typeof window === 'object' ? window : self;
var globalCount = Object.keys(env).length;
var mimeTypesLength = navigator.mimeTypes ? navigator.mimeTypes.length : 0;
var clientId = pad((mimeTypesLength +
  navigator.userAgent.length).toString(36) +
  globalCount.toString(36), 4);

module.exports = function fingerprint () {
  return clientId;
};

},{"./pad.js":107}],106:[function(require,module,exports){

var getRandomValue;

var crypto = window.crypto || window.msCrypto;

if (crypto) {
    var lim = Math.pow(2, 32) - 1;
    getRandomValue = function () {
        return Math.abs(crypto.getRandomValues(new Uint32Array(1))[0] / lim);
    };
} else {
    getRandomValue = Math.random;
}

module.exports = getRandomValue;

},{}],107:[function(require,module,exports){
module.exports = function pad (num, size) {
  var s = '000000000' + num;
  return s.substr(s.length - size);
};

},{}],108:[function(require,module,exports){
(function() {

    var debug = false;

    var root = this;

    var EXIF = function(obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
    } else {
        root.EXIF = EXIF;
    }

    var ExifTags = EXIF.Tags = {

        // version tags
        0x9000 : "ExifVersion",             // EXIF version
        0xA000 : "FlashpixVersion",         // Flashpix format version

        // colorspace tags
        0xA001 : "ColorSpace",              // Color space information tag

        // image configuration
        0xA002 : "PixelXDimension",         // Valid width of meaningful image
        0xA003 : "PixelYDimension",         // Valid height of meaningful image
        0x9101 : "ComponentsConfiguration", // Information about channels
        0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

        // user information
        0x927C : "MakerNote",               // Any desired information written by the manufacturer
        0x9286 : "UserComment",             // Comments by user

        // related file
        0xA004 : "RelatedSoundFile",        // Name of related sound file

        // date and time
        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
        0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
        0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
        0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A : "ExposureTime",            // Exposure time (in seconds)
        0x829D : "FNumber",                 // F number
        0x8822 : "ExposureProgram",         // Exposure program
        0x8824 : "SpectralSensitivity",     // Spectral sensitivity
        0x8827 : "ISOSpeedRatings",         // ISO speed rating
        0x8828 : "OECF",                    // Optoelectric conversion factor
        0x9201 : "ShutterSpeedValue",       // Shutter speed
        0x9202 : "ApertureValue",           // Lens aperture
        0x9203 : "BrightnessValue",         // Value of brightness
        0x9204 : "ExposureBias",            // Exposure bias
        0x9205 : "MaxApertureValue",        // Smallest F number of lens
        0x9206 : "SubjectDistance",         // Distance to subject in meters
        0x9207 : "MeteringMode",            // Metering mode
        0x9208 : "LightSource",             // Kind of light source
        0x9209 : "Flash",                   // Flash status
        0x9214 : "SubjectArea",             // Location and area of main subject
        0x920A : "FocalLength",             // Focal length of the lens in mm
        0xA20B : "FlashEnergy",             // Strobe energy in BCPS
        0xA20C : "SpatialFrequencyResponse",    //
        0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214 : "SubjectLocation",         // Location of subject in image
        0xA215 : "ExposureIndex",           // Exposure index selected on camera
        0xA217 : "SensingMethod",           // Image sensor type
        0xA300 : "FileSource",              // Image source (3 == DSC)
        0xA301 : "SceneType",               // Scene type (1 == directly photographed)
        0xA302 : "CFAPattern",              // Color filter array geometric pattern
        0xA401 : "CustomRendered",          // Special processing
        0xA402 : "ExposureMode",            // Exposure mode
        0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
        0xA404 : "DigitalZoomRation",       // Digital zoom ratio
        0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406 : "SceneCaptureType",        // Type of scene
        0xA407 : "GainControl",             // Degree of overall image gain adjustment
        0xA408 : "Contrast",                // Direction of contrast processing applied by camera
        0xA409 : "Saturation",              // Direction of saturation processing applied by camera
        0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
        0xA40B : "DeviceSettingDescription",    //
        0xA40C : "SubjectDistanceRange",    // Distance to subject

        // other tags
        0xA005 : "InteroperabilityIFDPointer",
        0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
    };

    var TiffTags = EXIF.TiffTags = {
        0x0100 : "ImageWidth",
        0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        0x8825 : "GPSInfoIFDPointer",
        0xA005 : "InteroperabilityIFDPointer",
        0x0102 : "BitsPerSample",
        0x0103 : "Compression",
        0x0106 : "PhotometricInterpretation",
        0x0112 : "Orientation",
        0x0115 : "SamplesPerPixel",
        0x011C : "PlanarConfiguration",
        0x0212 : "YCbCrSubSampling",
        0x0213 : "YCbCrPositioning",
        0x011A : "XResolution",
        0x011B : "YResolution",
        0x0128 : "ResolutionUnit",
        0x0111 : "StripOffsets",
        0x0116 : "RowsPerStrip",
        0x0117 : "StripByteCounts",
        0x0201 : "JPEGInterchangeFormat",
        0x0202 : "JPEGInterchangeFormatLength",
        0x012D : "TransferFunction",
        0x013E : "WhitePoint",
        0x013F : "PrimaryChromaticities",
        0x0211 : "YCbCrCoefficients",
        0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime",
        0x010E : "ImageDescription",
        0x010F : "Make",
        0x0110 : "Model",
        0x0131 : "Software",
        0x013B : "Artist",
        0x8298 : "Copyright"
    };

    var GPSTags = EXIF.GPSTags = {
        0x0000 : "GPSVersionID",
        0x0001 : "GPSLatitudeRef",
        0x0002 : "GPSLatitude",
        0x0003 : "GPSLongitudeRef",
        0x0004 : "GPSLongitude",
        0x0005 : "GPSAltitudeRef",
        0x0006 : "GPSAltitude",
        0x0007 : "GPSTimeStamp",
        0x0008 : "GPSSatellites",
        0x0009 : "GPSStatus",
        0x000A : "GPSMeasureMode",
        0x000B : "GPSDOP",
        0x000C : "GPSSpeedRef",
        0x000D : "GPSSpeed",
        0x000E : "GPSTrackRef",
        0x000F : "GPSTrack",
        0x0010 : "GPSImgDirectionRef",
        0x0011 : "GPSImgDirection",
        0x0012 : "GPSMapDatum",
        0x0013 : "GPSDestLatitudeRef",
        0x0014 : "GPSDestLatitude",
        0x0015 : "GPSDestLongitudeRef",
        0x0016 : "GPSDestLongitude",
        0x0017 : "GPSDestBearingRef",
        0x0018 : "GPSDestBearing",
        0x0019 : "GPSDestDistanceRef",
        0x001A : "GPSDestDistance",
        0x001B : "GPSProcessingMethod",
        0x001C : "GPSAreaInformation",
        0x001D : "GPSDateStamp",
        0x001E : "GPSDifferential"
    };

     // EXIF 2.3 Spec
    var IFD1Tags = EXIF.IFD1Tags = {
        0x0100: "ImageWidth",
        0x0101: "ImageHeight",
        0x0102: "BitsPerSample",
        0x0103: "Compression",
        0x0106: "PhotometricInterpretation",
        0x0111: "StripOffsets",
        0x0112: "Orientation",
        0x0115: "SamplesPerPixel",
        0x0116: "RowsPerStrip",
        0x0117: "StripByteCounts",
        0x011A: "XResolution",
        0x011B: "YResolution",
        0x011C: "PlanarConfiguration",
        0x0128: "ResolutionUnit",
        0x0201: "JpegIFOffset",    // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
        0x0202: "JpegIFByteCount", // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
        0x0211: "YCbCrCoefficients",
        0x0212: "YCbCrSubSampling",
        0x0213: "YCbCrPositioning",
        0x0214: "ReferenceBlackWhite"
    };

    var StringValues = EXIF.StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }


    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function(e) {
            if (this.status == 200 || this.status === 0) {
                callback(this.response);
            }
        };
        http.send();
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            img.exifdata = data || {};
            var iptcdata = findIPTCinJPEG(binFile);
            img.iptcdata = iptcdata || {};
            if (EXIF.isXmpEnabled) {
               var xmpdata= findXMPinJPEG(binFile);
               img.xmpdata = xmpdata || {};               
            }
            if (callback) {
                callback.call(img);
            }
        }

        if (img.src) {
            if (/^data\:/i.test(img.src)) { // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);

            } else if (/^blob\:/i.test(img.src)) { // Object URL
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            } else {
                var http = new XMLHttpRequest();
                http.onload = function() {
                    if (this.status == 200 || this.status === 0) {
                        handleBinaryFile(http.response);
                    } else {
                        throw "Could not load image";
                    }
                    http = null;
                };
                http.open("GET", img.src, true);
                http.responseType = "arraybuffer";
                http.send(null);
            }
        } else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset+2);
            }

        }

    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;


        var isFieldSegmentStart = function(dataView, offset){
            return (
                dataView.getUint8(offset) === 0x38 &&
                dataView.getUint8(offset+1) === 0x42 &&
                dataView.getUint8(offset+2) === 0x49 &&
                dataView.getUint8(offset+3) === 0x4D &&
                dataView.getUint8(offset+4) === 0x04 &&
                dataView.getUint8(offset+5) === 0x04
            );
        };

        while (offset < length) {

            if ( isFieldSegmentStart(dataView, offset )){

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset+7);
                if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
                // Check for pre photoshop 6 format
                if(nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);

                break;

            }


            // Not the marker, continue searching
            offset++;

        }

    }
    var IptcFieldMap = {
        0x78 : 'caption',
        0x6E : 'credit',
        0x19 : 'keywords',
        0x37 : 'dateCreated',
        0x50 : 'byline',
        0x55 : 'bylineTitle',
        0x7A : 'captionWriter',
        0x69 : 'headline',
        0x74 : 'copyright',
        0x0F : 'category'
    };
    function readIPTCData(file, startOffset, sectionLength){
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while(segmentStartPos < startOffset+sectionLength) {
            if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
                segmentType = dataView.getUint8(segmentStartPos+2);
                if(segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos+3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
                    // Check if we already stored a value with this name
                    if(data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if(data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        }
                        else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    }
                    else {
                        data[fieldName] = fieldValue;
                    }
                }

            }
            segmentStartPos++;
        }
        return data;
    }



    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i=0;i<entries;i++) {
            entryOffset = dirStart + i*12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset+2, !bigEnd),
            numValues = file.getUint32(entryOffset+4, !bigEnd),
            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues-1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 5:    // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset+4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

    /**
    * Given an IFD (Image File Directory) start offset
    * returns an offset to next IFD or 0 if it's the last IFD.
    */
    function getNextIFDOffset(dataView, dirStart, bigEnd){
        //the first 2bytes means the number of directory entries contains in this IFD
        var entries = dataView.getUint16(dirStart, !bigEnd);

        // After last directory entry, there is a 4bytes of data,
        // it means an offset to next IFD.
        // If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

        return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
    }

    function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd){
        // get the IFD1 offset
        var IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart+firstIFDOffset, bigEnd);

        if (!IFD1OffsetPointer) {
            // console.log('******** IFD1Offset is empty, image thumb not found ********');
            return {};
        }
        else if (IFD1OffsetPointer > dataView.byteLength) { // this should not happen
            // console.log('******** IFD1Offset is outside the bounds of the DataView ********');
            return {};
        }
        // console.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

        var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd)

        // EXIF 2.3 specification for JPEG format thumbnail

        // If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
        // Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
        // by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
        // Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
        // JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

        if (thumbTags['Compression']) {
            // console.log('Thumbnail image found!');

            switch (thumbTags['Compression']) {
                case 6:
                    // console.log('Thumbnail image format is JPEG');
                    if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
                    // extract the thumbnail
                        var tOffset = tiffStart + thumbTags.JpegIFOffset;
                        var tLength = thumbTags.JpegIFByteCount;
                        thumbTags['blob'] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
                            type: 'image/jpeg'
                        });
                    }
                break;

            case 1:
                console.log("Thumbnail image format is TIFF, which is not implemented.");
                break;
            default:
                console.log("Unknown thumbnail image format '%s'", thumbTags['Compression']);
            }
        }
        else if (thumbTags['PhotometricInterpretation'] == 2) {
            console.log("Thumbnail image format is RGB, which is not implemented.");
        }
        return thumbTags;
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (n = start; n < start+length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]] +
                            StringValues.Components[exifData[tag][1]] +
                            StringValues.Components[exifData[tag][2]] +
                            StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0] +
                            "." + gpsData[tag][1] +
                            "." + gpsData[tag][2] +
                            "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        // extract thumbnail
        tags['thumbnail'] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);

        return tags;
    }

   function findXMPinJPEG(file) {

        if (!('DOMParser' in self)) {
            // console.warn('XML parsing not supported without DOMParser');
            return;
        }
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
           if (debug) console.log("Not a valid JPEG");
           return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            dom = new DOMParser();

        while (offset < (length-4)) {
            if (getStringFromDB(dataView, offset, 4) == "http") {
                var startOffset = offset - 1;
                var sectionLength = dataView.getUint16(offset - 2) - 1;
                var xmpString = getStringFromDB(dataView, startOffset, sectionLength)
                var xmpEndIndex = xmpString.indexOf('xmpmeta>') + 8;
                xmpString = xmpString.substring( xmpString.indexOf( '<x:xmpmeta' ), xmpEndIndex );

                var indexOfXmp = xmpString.indexOf('x:xmpmeta') + 10
                //Many custom written programs embed xmp/xml without any namespace. Following are some of them.
                //Without these namespaces, XML is thought to be invalid by parsers
                xmpString = xmpString.slice(0, indexOfXmp)
                            + 'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" '
                            + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
                            + 'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" '
                            + 'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" '
                            + 'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" '
                            + 'xmlns:exif="http://ns.adobe.com/exif/1.0/" '
                            + 'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" '
                            + 'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" '
                            + 'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" '
                            + 'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" '
                            + 'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" '
                            + xmpString.slice(indexOfXmp)

                var domDocument = dom.parseFromString( xmpString, 'text/xml' );
                return xml2Object(domDocument);
            } else{
             offset++;
            }
        }
    }

    function xml2json(xml) {
        var json = {};
      
        if (xml.nodeType == 1) { // element node
          if (xml.attributes.length > 0) {
            json['@attributes'] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
              var attribute = xml.attributes.item(j);
              json['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if (xml.nodeType == 3) { // text node
          return xml.nodeValue;
        }
      
        // deal with children
        if (xml.hasChildNodes()) {
          for(var i = 0; i < xml.childNodes.length; i++) {
            var child = xml.childNodes.item(i);
            var nodeName = child.nodeName;
            if (json[nodeName] == null) {
              json[nodeName] = xml2json(child);
            } else {
              if (json[nodeName].push == null) {
                var old = json[nodeName];
                json[nodeName] = [];
                json[nodeName].push(old);
              }
              json[nodeName].push(xml2json(child));
            }
          }
        }
        
        return json;
    }

    function xml2Object(xml) {
        try {
            var obj = {};
            if (xml.children.length > 0) {
              for (var i = 0; i < xml.children.length; i++) {
                var item = xml.children.item(i);
                var attributes = item.attributes;
                for(var idx in attributes) {
                    var itemAtt = attributes[idx];
                    var dataKey = itemAtt.nodeName;
                    var dataValue = itemAtt.nodeValue;

                    if(dataKey !== undefined) {
                        obj[dataKey] = dataValue;
                    }
                }
                var nodeName = item.nodeName;

                if (typeof (obj[nodeName]) == "undefined") {
                  obj[nodeName] = xml2json(item);
                } else {
                  if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];

                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                  }
                  obj[nodeName].push(xml2json(item));
                }
              }
            } else {
              obj = xml.textContent;
            }
            return obj;
          } catch (e) {
              console.log(e.message);
          }
    }

    EXIF.enableXmp = function() {
        EXIF.isXmpEnabled = true;
    }

    EXIF.disableXmp = function() {
        EXIF.isXmpEnabled = false;
    }

    EXIF.getData = function(img, callback) {
        if (((self.Image && img instanceof self.Image)
            || (self.HTMLImageElement && img instanceof self.HTMLImageElement))
            && !img.complete)
            return false;

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    EXIF.getTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    }
    
    EXIF.getIptcTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.iptcdata[tag];
    }

    EXIF.getAllTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }
    
    EXIF.getAllIptcTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.iptcdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    EXIF.pretty = function(img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    EXIF.readFromBinaryFile = function(file) {
        return findEXIFinJPEG(file);
    }

    if (typeof define === 'function' && define.amd) {
        define('exif-js', [], function() {
            return EXIF;
        });
    }
}.call(this));


},{}],109:[function(require,module,exports){
module.exports = function isShallowEqual (a, b) {
  if (a === b) return true
  for (var i in a) if (!(i in b)) return false
  for (var i in b) if (a[i] !== b[i]) return false
  return true
}

},{}],110:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],111:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],112:[function(require,module,exports){
'use strict';

function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (newInputs[i] !== lastInputs[i]) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var lastThis;
    var lastArgs = [];
    var lastResult;
    var calledOnce = false;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
            return lastResult;
        }
        lastResult = resultFn.apply(this, newArgs);
        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        return lastResult;
    }
    return memoized;
}

module.exports = memoizeOne;

},{}],113:[function(require,module,exports){
var wildcard = require('wildcard');
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};

},{"wildcard":118}],114:[function(require,module,exports){
/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}

},{}],115:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('preact')) :
  typeof define === 'function' && define.amd ? define(['preact'], factory) :
  (global.PreactCSSTransitionGroup = factory(global.preact));
}(this, (function (preact) { 'use strict';

function getKey(vnode) {
	return vnode.attributes && vnode.attributes.key;
}

function getComponentBase(component) {
	return component.base;
}

function onlyChild(children) {
	return children && children[0];
}

function filterNullChildren(children) {
	return children && children.filter(function (i) {
		return i !== null;
	});
}

function find(arr, iter) {
	for (var i = arr.length; i--;) {
		if (iter(arr[i])) return true;
	}
	return false;
}

function inChildrenByKey(children, key) {
	return find(children, function (c) {
		return getKey(c) === key;
	});
}

function inChildren(children, child) {
	return inChildrenByKey(children, getKey(child));
}

function isShownInChildrenByKey(children, key, showProp) {
	return find(children, function (c) {
		return getKey(c) === key && c.props[showProp];
	});
}

function isShownInChildren(children, child, showProp) {
	return isShownInChildrenByKey(children, getKey(child), showProp);
}

function mergeChildMappings(prev, next) {
	var ret = [];

	var nextChildrenPending = {},
	    pendingChildren = [];
	prev.forEach(function (c) {
		var key = getKey(c);
		if (inChildrenByKey(next, key)) {
			if (pendingChildren.length) {
				nextChildrenPending[key] = pendingChildren;
				pendingChildren = [];
			}
		} else {
			pendingChildren.push(c);
		}
	});

	next.forEach(function (c) {
		var key = getKey(c);
		if (nextChildrenPending.hasOwnProperty(key)) {
			ret = ret.concat(nextChildrenPending[key]);
		}
		ret.push(c);
	});

	return ret.concat(pendingChildren);
}

var SPACE = ' ';
var RE_CLASS = /[\n\t\r]+/g;

var norm = function (elemClass) {
	return (SPACE + elemClass + SPACE).replace(RE_CLASS, SPACE);
};

function addClass(elem, className) {
	if (elem.classList) {
		var _elem$classList;

		(_elem$classList = elem.classList).add.apply(_elem$classList, className.split(' '));
	} else {
		elem.className += ' ' + className;
	}
}

function removeClass(elem, needle) {
	needle = needle.trim();
	if (elem.classList) {
		var _elem$classList2;

		(_elem$classList2 = elem.classList).remove.apply(_elem$classList2, needle.split(' '));
	} else {
		var elemClass = elem.className.trim();
		var className = norm(elemClass);
		needle = SPACE + needle + SPACE;
		while (className.indexOf(needle) >= 0) {
			className = className.replace(needle, SPACE);
		}
		elem.className = className.trim();
	}
}

var EVENT_NAME_MAP = {
	transitionend: {
		transition: 'transitionend',
		WebkitTransition: 'webkitTransitionEnd',
		MozTransition: 'mozTransitionEnd',
		OTransition: 'oTransitionEnd',
		msTransition: 'MSTransitionEnd'
	},

	animationend: {
		animation: 'animationend',
		WebkitAnimation: 'webkitAnimationEnd',
		MozAnimation: 'mozAnimationEnd',
		OAnimation: 'oAnimationEnd',
		msAnimation: 'MSAnimationEnd'
	}
};

var endEvents = [];

function detectEvents() {
	var testEl = document.createElement('div'),
	    style = testEl.style;

	if (!('AnimationEvent' in window)) {
		delete EVENT_NAME_MAP.animationend.animation;
	}

	if (!('TransitionEvent' in window)) {
		delete EVENT_NAME_MAP.transitionend.transition;
	}

	for (var baseEventName in EVENT_NAME_MAP) {
		var baseEvents = EVENT_NAME_MAP[baseEventName];
		for (var styleName in baseEvents) {
			if (styleName in style) {
				endEvents.push(baseEvents[styleName]);
				break;
			}
		}
	}
}

if (typeof window !== 'undefined') {
	detectEvents();
}

function addEndEventListener(node, eventListener) {
	if (!endEvents.length) {
		return window.setTimeout(eventListener, 0);
	}
	endEvents.forEach(function (endEvent) {
		node.addEventListener(endEvent, eventListener, false);
	});
}

function removeEndEventListener(node, eventListener) {
	if (!endEvents.length) return;
	endEvents.forEach(function (endEvent) {
		node.removeEventListener(endEvent, eventListener, false);
	});
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var TICK = 17;

var CSSTransitionGroupChild = function (_Component) {
	inherits(CSSTransitionGroupChild, _Component);

	function CSSTransitionGroupChild() {
		var _temp, _this, _ret;

		classCallCheck(this, CSSTransitionGroupChild);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.flushClassNameQueue = function () {
			if (getComponentBase(_this)) {
				addClass(getComponentBase(_this), _this.classNameQueue.join(' '));
			}
			_this.classNameQueue.length = 0;
			_this.timeout = null;
		}, _temp), possibleConstructorReturn(_this, _ret);
	}

	CSSTransitionGroupChild.prototype.transition = function transition(animationType, finishCallback, timeout) {
		var _this2 = this;

		var node = getComponentBase(this);

		var className = this.props.name[animationType] || this.props.name + '-' + animationType;
		var activeClassName = this.props.name[animationType + 'Active'] || className + '-active';
		var timer = null;

		if (this.endListener) {
			this.endListener();
		}

		this.endListener = function (e) {
			if (e && e.target !== node) return;

			clearTimeout(timer);
			removeClass(node, className);
			removeClass(node, activeClassName);
			removeEndEventListener(node, _this2.endListener);
			_this2.endListener = null;

			if (finishCallback) {
				finishCallback();
			}
		};

		if (timeout) {
			timer = setTimeout(this.endListener, timeout);
			this.transitionTimeouts.push(timer);
		} else {
			addEndEventListener(node, this.endListener);
		}

		addClass(node, className);

		this.queueClass(activeClassName);
	};

	CSSTransitionGroupChild.prototype.queueClass = function queueClass(className) {
		this.classNameQueue.push(className);

		if (!this.timeout) {
			this.timeout = setTimeout(this.flushClassNameQueue, TICK);
		}
	};

	CSSTransitionGroupChild.prototype.stop = function stop() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.classNameQueue.length = 0;
			this.timeout = null;
		}
		if (this.endListener) {
			this.endListener();
		}
	};

	CSSTransitionGroupChild.prototype.componentWillMount = function componentWillMount() {
		this.classNameQueue = [];
		this.transitionTimeouts = [];
	};

	CSSTransitionGroupChild.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.transitionTimeouts.forEach(function (timeout) {
			clearTimeout(timeout);
		});
	};

	CSSTransitionGroupChild.prototype.componentWillEnter = function componentWillEnter(done) {
		if (this.props.enter) {
			this.transition('enter', done, this.props.enterTimeout);
		} else {
			done();
		}
	};

	CSSTransitionGroupChild.prototype.componentWillLeave = function componentWillLeave(done) {
		if (this.props.leave) {
			this.transition('leave', done, this.props.leaveTimeout);
		} else {
			done();
		}
	};

	CSSTransitionGroupChild.prototype.render = function render() {
		return onlyChild(this.props.children);
	};

	return CSSTransitionGroupChild;
}(preact.Component);

var CSSTransitionGroup = function (_Component) {
	inherits(CSSTransitionGroup, _Component);

	function CSSTransitionGroup(props) {
		classCallCheck(this, CSSTransitionGroup);

		var _this = possibleConstructorReturn(this, _Component.call(this));

		_this.renderChild = function (child) {
			var _this$props = _this.props;
			var transitionName = _this$props.transitionName;
			var transitionEnter = _this$props.transitionEnter;
			var transitionLeave = _this$props.transitionLeave;
			var transitionEnterTimeout = _this$props.transitionEnterTimeout;
			var transitionLeaveTimeout = _this$props.transitionLeaveTimeout;
			var key = getKey(child);
			return preact.h(
				CSSTransitionGroupChild,
				{
					key: key,
					ref: function (c) {
						if (!(_this.refs[key] = c)) child = null;
					},
					name: transitionName,
					enter: transitionEnter,
					leave: transitionLeave,
					enterTimeout: transitionEnterTimeout,
					leaveTimeout: transitionLeaveTimeout },
				child
			);
		};

		_this.refs = {};
		_this.state = {
			children: (props.children || []).slice()
		};
		return _this;
	}

	CSSTransitionGroup.prototype.shouldComponentUpdate = function shouldComponentUpdate(_, _ref) {
		var children = _ref.children;

		return children !== this.state.children;
	};

	CSSTransitionGroup.prototype.componentWillMount = function componentWillMount() {
		this.currentlyTransitioningKeys = {};
		this.keysToEnter = [];
		this.keysToLeave = [];
	};

	CSSTransitionGroup.prototype.componentWillReceiveProps = function componentWillReceiveProps(_ref2) {
		var _this2 = this;

		var children = _ref2.children;
		var exclusive = _ref2.exclusive;
		var showProp = _ref2.showProp;

		var nextChildMapping = filterNullChildren(children || []).slice();

		var prevChildMapping = filterNullChildren(exclusive ? this.props.children : this.state.children);

		var newChildren = mergeChildMappings(prevChildMapping, nextChildMapping);

		if (showProp) {
			newChildren = newChildren.map(function (c) {
				if (!c.props[showProp] && isShownInChildren(prevChildMapping, c, showProp)) {
					var _cloneElement;

					c = preact.cloneElement(c, (_cloneElement = {}, _cloneElement[showProp] = true, _cloneElement));
				}
				return c;
			});
		}

		if (exclusive) {
			newChildren.forEach(function (c) {
				return _this2.stop(getKey(c));
			});
		}

		this.setState({ children: newChildren });
		this.forceUpdate();

		nextChildMapping.forEach(function (c) {
			var key = c.key;
			var hasPrev = prevChildMapping && inChildren(prevChildMapping, c);
			if (showProp) {
				if (hasPrev) {
					var showInPrev = isShownInChildren(prevChildMapping, c, showProp),
					    showInNow = c.props[showProp];
					if (!showInPrev && showInNow && !_this2.currentlyTransitioningKeys[key]) {
						_this2.keysToEnter.push(key);
					}
				}
			} else if (!hasPrev && !_this2.currentlyTransitioningKeys[key]) {
				_this2.keysToEnter.push(key);
			}
		});

		prevChildMapping.forEach(function (c) {
			var key = c.key;
			var hasNext = nextChildMapping && inChildren(nextChildMapping, c);
			if (showProp) {
				if (hasNext) {
					var showInNext = isShownInChildren(nextChildMapping, c, showProp);
					var showInNow = c.props[showProp];
					if (!showInNext && showInNow && !_this2.currentlyTransitioningKeys[key]) {
						_this2.keysToLeave.push(key);
					}
				}
			} else if (!hasNext && !_this2.currentlyTransitioningKeys[key]) {
				_this2.keysToLeave.push(key);
			}
		});
	};

	CSSTransitionGroup.prototype.performEnter = function performEnter(key) {
		var _this3 = this;

		this.currentlyTransitioningKeys[key] = true;
		var component = this.refs[key];
		if (component.componentWillEnter) {
			component.componentWillEnter(function () {
				return _this3._handleDoneEntering(key);
			});
		} else {
			this._handleDoneEntering(key);
		}
	};

	CSSTransitionGroup.prototype._handleDoneEntering = function _handleDoneEntering(key) {
		delete this.currentlyTransitioningKeys[key];
		var currentChildMapping = filterNullChildren(this.props.children),
		    showProp = this.props.showProp;
		if (!currentChildMapping || !showProp && !inChildrenByKey(currentChildMapping, key) || showProp && !isShownInChildrenByKey(currentChildMapping, key, showProp)) {
			this.performLeave(key);
		} else {
			this.setState({ children: currentChildMapping });
		}
	};

	CSSTransitionGroup.prototype.stop = function stop(key) {
		delete this.currentlyTransitioningKeys[key];
		var component = this.refs[key];
		if (component) component.stop();
	};

	CSSTransitionGroup.prototype.performLeave = function performLeave(key) {
		var _this4 = this;

		this.currentlyTransitioningKeys[key] = true;
		var component = this.refs[key];
		if (component && component.componentWillLeave) {
			component.componentWillLeave(function () {
				return _this4._handleDoneLeaving(key);
			});
		} else {
			this._handleDoneLeaving(key);
		}
	};

	CSSTransitionGroup.prototype._handleDoneLeaving = function _handleDoneLeaving(key) {
		delete this.currentlyTransitioningKeys[key];
		var showProp = this.props.showProp,
		    currentChildMapping = filterNullChildren(this.props.children);
		if (showProp && currentChildMapping && isShownInChildrenByKey(currentChildMapping, key, showProp)) {
			this.performEnter(key);
		} else if (!showProp && currentChildMapping && inChildrenByKey(currentChildMapping, key)) {
			this.performEnter(key);
		} else {
			this.setState({ children: currentChildMapping });
		}
	};

	CSSTransitionGroup.prototype.componentDidUpdate = function componentDidUpdate() {
		var _this5 = this;

		var keysToEnter = this.keysToEnter;
		var keysToLeave = this.keysToLeave;

		this.keysToEnter = [];
		keysToEnter.forEach(function (k) {
			return _this5.performEnter(k);
		});
		this.keysToLeave = [];
		keysToLeave.forEach(function (k) {
			return _this5.performLeave(k);
		});
	};

	CSSTransitionGroup.prototype.render = function render(_ref3, _ref4) {
		var Component = _ref3.component;
		var transitionName = _ref3.transitionName;
		var transitionEnter = _ref3.transitionEnter;
		var transitionLeave = _ref3.transitionLeave;
		var transitionEnterTimeout = _ref3.transitionEnterTimeout;
		var transitionLeaveTimeout = _ref3.transitionLeaveTimeout;
		var c = _ref3.children;
		var props = objectWithoutProperties(_ref3, ['component', 'transitionName', 'transitionEnter', 'transitionLeave', 'transitionEnterTimeout', 'transitionLeaveTimeout', 'children']);
		var children = _ref4.children;

		return preact.h(
			Component,
			props,
			filterNullChildren(children).map(this.renderChild)
		);
	};

	return CSSTransitionGroup;
}(preact.Component);
CSSTransitionGroup.defaultProps = {
	component: 'span',
	transitionEnter: true,
	transitionLeave: true
};

return CSSTransitionGroup;

})));


},{"preact":116}],116:[function(require,module,exports){
!function() {
    'use strict';
    function VNode() {}
    function h(nodeName, attributes) {
        var lastSimple, child, simple, i, children = EMPTY_CHILDREN;
        for (i = arguments.length; i-- > 2; ) stack.push(arguments[i]);
        if (attributes && null != attributes.children) {
            if (!stack.length) stack.push(attributes.children);
            delete attributes.children;
        }
        while (stack.length) if ((child = stack.pop()) && void 0 !== child.pop) for (i = child.length; i--; ) stack.push(child[i]); else {
            if ('boolean' == typeof child) child = null;
            if (simple = 'function' != typeof nodeName) if (null == child) child = ''; else if ('number' == typeof child) child = String(child); else if ('string' != typeof child) simple = !1;
            if (simple && lastSimple) children[children.length - 1] += child; else if (children === EMPTY_CHILDREN) children = [ child ]; else children.push(child);
            lastSimple = simple;
        }
        var p = new VNode();
        p.nodeName = nodeName;
        p.children = children;
        p.attributes = null == attributes ? void 0 : attributes;
        p.key = null == attributes ? void 0 : attributes.key;
        if (void 0 !== options.vnode) options.vnode(p);
        return p;
    }
    function extend(obj, props) {
        for (var i in props) obj[i] = props[i];
        return obj;
    }
    function cloneElement(vnode, props) {
        return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
    }
    function enqueueRender(component) {
        if (!component.__d && (component.__d = !0) && 1 == items.push(component)) (options.debounceRendering || defer)(rerender);
    }
    function rerender() {
        var p, list = items;
        items = [];
        while (p = list.pop()) if (p.__d) renderComponent(p);
    }
    function isSameNodeType(node, vnode, hydrating) {
        if ('string' == typeof vnode || 'number' == typeof vnode) return void 0 !== node.splitText;
        if ('string' == typeof vnode.nodeName) return !node._componentConstructor && isNamedNode(node, vnode.nodeName); else return hydrating || node._componentConstructor === vnode.nodeName;
    }
    function isNamedNode(node, nodeName) {
        return node.__n === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
    }
    function getNodeProps(vnode) {
        var props = extend({}, vnode.attributes);
        props.children = vnode.children;
        var defaultProps = vnode.nodeName.defaultProps;
        if (void 0 !== defaultProps) for (var i in defaultProps) if (void 0 === props[i]) props[i] = defaultProps[i];
        return props;
    }
    function createNode(nodeName, isSvg) {
        var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
        node.__n = nodeName;
        return node;
    }
    function removeNode(node) {
        var parentNode = node.parentNode;
        if (parentNode) parentNode.removeChild(node);
    }
    function setAccessor(node, name, old, value, isSvg) {
        if ('className' === name) name = 'class';
        if ('key' === name) ; else if ('ref' === name) {
            if (old) old(null);
            if (value) value(node);
        } else if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {
            if (!value || 'string' == typeof value || 'string' == typeof old) node.style.cssText = value || '';
            if (value && 'object' == typeof value) {
                if ('string' != typeof old) for (var i in old) if (!(i in value)) node.style[i] = '';
                for (var i in value) node.style[i] = 'number' == typeof value[i] && !1 === IS_NON_DIMENSIONAL.test(i) ? value[i] + 'px' : value[i];
            }
        } else if ('dangerouslySetInnerHTML' === name) {
            if (value) node.innerHTML = value.__html || '';
        } else if ('o' == name[0] && 'n' == name[1]) {
            var useCapture = name !== (name = name.replace(/Capture$/, ''));
            name = name.toLowerCase().substring(2);
            if (value) {
                if (!old) node.addEventListener(name, eventProxy, useCapture);
            } else node.removeEventListener(name, eventProxy, useCapture);
            (node.__l || (node.__l = {}))[name] = value;
        } else if ('list' !== name && 'type' !== name && !isSvg && name in node) {
            setProperty(node, name, null == value ? '' : value);
            if (null == value || !1 === value) node.removeAttribute(name);
        } else {
            var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));
            if (null == value || !1 === value) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); else node.removeAttribute(name); else if ('function' != typeof value) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); else node.setAttribute(name, value);
        }
    }
    function setProperty(node, name, value) {
        try {
            node[name] = value;
        } catch (e) {}
    }
    function eventProxy(e) {
        return this.__l[e.type](options.event && options.event(e) || e);
    }
    function flushMounts() {
        var c;
        while (c = mounts.pop()) {
            if (options.afterMount) options.afterMount(c);
            if (c.componentDidMount) c.componentDidMount();
        }
    }
    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
        if (!diffLevel++) {
            isSvgMode = null != parent && void 0 !== parent.ownerSVGElement;
            hydrating = null != dom && !('__preactattr_' in dom);
        }
        var ret = idiff(dom, vnode, context, mountAll, componentRoot);
        if (parent && ret.parentNode !== parent) parent.appendChild(ret);
        if (!--diffLevel) {
            hydrating = !1;
            if (!componentRoot) flushMounts();
        }
        return ret;
    }
    function idiff(dom, vnode, context, mountAll, componentRoot) {
        var out = dom, prevSvgMode = isSvgMode;
        if (null == vnode || 'boolean' == typeof vnode) vnode = '';
        if ('string' == typeof vnode || 'number' == typeof vnode) {
            if (dom && void 0 !== dom.splitText && dom.parentNode && (!dom._component || componentRoot)) {
                if (dom.nodeValue != vnode) dom.nodeValue = vnode;
            } else {
                out = document.createTextNode(vnode);
                if (dom) {
                    if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                    recollectNodeTree(dom, !0);
                }
            }
            out.__preactattr_ = !0;
            return out;
        }
        var vnodeName = vnode.nodeName;
        if ('function' == typeof vnodeName) return buildComponentFromVNode(dom, vnode, context, mountAll);
        isSvgMode = 'svg' === vnodeName ? !0 : 'foreignObject' === vnodeName ? !1 : isSvgMode;
        vnodeName = String(vnodeName);
        if (!dom || !isNamedNode(dom, vnodeName)) {
            out = createNode(vnodeName, isSvgMode);
            if (dom) {
                while (dom.firstChild) out.appendChild(dom.firstChild);
                if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                recollectNodeTree(dom, !0);
            }
        }
        var fc = out.firstChild, props = out.__preactattr_, vchildren = vnode.children;
        if (null == props) {
            props = out.__preactattr_ = {};
            for (var a = out.attributes, i = a.length; i--; ) props[a[i].name] = a[i].value;
        }
        if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && null != fc && void 0 !== fc.splitText && null == fc.nextSibling) {
            if (fc.nodeValue != vchildren[0]) fc.nodeValue = vchildren[0];
        } else if (vchildren && vchildren.length || null != fc) innerDiffNode(out, vchildren, context, mountAll, hydrating || null != props.dangerouslySetInnerHTML);
        diffAttributes(out, vnode.attributes, props);
        isSvgMode = prevSvgMode;
        return out;
    }
    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
        var j, c, f, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0;
        if (0 !== len) for (var i = 0; i < len; i++) {
            var _child = originalChildren[i], props = _child.__preactattr_, key = vlen && props ? _child._component ? _child._component.__k : props.key : null;
            if (null != key) {
                keyedLen++;
                keyed[key] = _child;
            } else if (props || (void 0 !== _child.splitText ? isHydrating ? _child.nodeValue.trim() : !0 : isHydrating)) children[childrenLen++] = _child;
        }
        if (0 !== vlen) for (var i = 0; i < vlen; i++) {
            vchild = vchildren[i];
            child = null;
            var key = vchild.key;
            if (null != key) {
                if (keyedLen && void 0 !== keyed[key]) {
                    child = keyed[key];
                    keyed[key] = void 0;
                    keyedLen--;
                }
            } else if (!child && min < childrenLen) for (j = min; j < childrenLen; j++) if (void 0 !== children[j] && isSameNodeType(c = children[j], vchild, isHydrating)) {
                child = c;
                children[j] = void 0;
                if (j === childrenLen - 1) childrenLen--;
                if (j === min) min++;
                break;
            }
            child = idiff(child, vchild, context, mountAll);
            f = originalChildren[i];
            if (child && child !== dom && child !== f) if (null == f) dom.appendChild(child); else if (child === f.nextSibling) removeNode(f); else dom.insertBefore(child, f);
        }
        if (keyedLen) for (var i in keyed) if (void 0 !== keyed[i]) recollectNodeTree(keyed[i], !1);
        while (min <= childrenLen) if (void 0 !== (child = children[childrenLen--])) recollectNodeTree(child, !1);
    }
    function recollectNodeTree(node, unmountOnly) {
        var component = node._component;
        if (component) unmountComponent(component); else {
            if (null != node.__preactattr_ && node.__preactattr_.ref) node.__preactattr_.ref(null);
            if (!1 === unmountOnly || null == node.__preactattr_) removeNode(node);
            removeChildren(node);
        }
    }
    function removeChildren(node) {
        node = node.lastChild;
        while (node) {
            var next = node.previousSibling;
            recollectNodeTree(node, !0);
            node = next;
        }
    }
    function diffAttributes(dom, attrs, old) {
        var name;
        for (name in old) if ((!attrs || null == attrs[name]) && null != old[name]) setAccessor(dom, name, old[name], old[name] = void 0, isSvgMode);
        for (name in attrs) if (!('children' === name || 'innerHTML' === name || name in old && attrs[name] === ('value' === name || 'checked' === name ? dom[name] : old[name]))) setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
    function collectComponent(component) {
        var name = component.constructor.name;
        (components[name] || (components[name] = [])).push(component);
    }
    function createComponent(Ctor, props, context) {
        var inst, list = components[Ctor.name];
        if (Ctor.prototype && Ctor.prototype.render) {
            inst = new Ctor(props, context);
            Component.call(inst, props, context);
        } else {
            inst = new Component(props, context);
            inst.constructor = Ctor;
            inst.render = doRender;
        }
        if (list) for (var i = list.length; i--; ) if (list[i].constructor === Ctor) {
            inst.__b = list[i].__b;
            list.splice(i, 1);
            break;
        }
        return inst;
    }
    function doRender(props, state, context) {
        return this.constructor(props, context);
    }
    function setComponentProps(component, props, opts, context, mountAll) {
        if (!component.__x) {
            component.__x = !0;
            if (component.__r = props.ref) delete props.ref;
            if (component.__k = props.key) delete props.key;
            if (!component.base || mountAll) {
                if (component.componentWillMount) component.componentWillMount();
            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);
            if (context && context !== component.context) {
                if (!component.__c) component.__c = component.context;
                component.context = context;
            }
            if (!component.__p) component.__p = component.props;
            component.props = props;
            component.__x = !1;
            if (0 !== opts) if (1 === opts || !1 !== options.syncComponentUpdates || !component.base) renderComponent(component, 1, mountAll); else enqueueRender(component);
            if (component.__r) component.__r(component);
        }
    }
    function renderComponent(component, opts, mountAll, isChild) {
        if (!component.__x) {
            var rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.__p || props, previousState = component.__s || state, previousContext = component.__c || context, isUpdate = component.base, nextBase = component.__b, initialBase = isUpdate || nextBase, initialChildComponent = component._component, skip = !1;
            if (isUpdate) {
                component.props = previousProps;
                component.state = previousState;
                component.context = previousContext;
                if (2 !== opts && component.shouldComponentUpdate && !1 === component.shouldComponentUpdate(props, state, context)) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
                component.props = props;
                component.state = state;
                component.context = context;
            }
            component.__p = component.__s = component.__c = component.__b = null;
            component.__d = !1;
            if (!skip) {
                rendered = component.render(props, state, context);
                if (component.getChildContext) context = extend(extend({}, context), component.getChildContext());
                var toUnmount, base, childComponent = rendered && rendered.nodeName;
                if ('function' == typeof childComponent) {
                    var childProps = getNodeProps(rendered);
                    inst = initialChildComponent;
                    if (inst && inst.constructor === childComponent && childProps.key == inst.__k) setComponentProps(inst, childProps, 1, context, !1); else {
                        toUnmount = inst;
                        component._component = inst = createComponent(childComponent, childProps, context);
                        inst.__b = inst.__b || nextBase;
                        inst.__u = component;
                        setComponentProps(inst, childProps, 0, context, !1);
                        renderComponent(inst, 1, mountAll, !0);
                    }
                    base = inst.base;
                } else {
                    cbase = initialBase;
                    toUnmount = initialChildComponent;
                    if (toUnmount) cbase = component._component = null;
                    if (initialBase || 1 === opts) {
                        if (cbase) cbase._component = null;
                        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, !0);
                    }
                }
                if (initialBase && base !== initialBase && inst !== initialChildComponent) {
                    var baseParent = initialBase.parentNode;
                    if (baseParent && base !== baseParent) {
                        baseParent.replaceChild(base, initialBase);
                        if (!toUnmount) {
                            initialBase._component = null;
                            recollectNodeTree(initialBase, !1);
                        }
                    }
                }
                if (toUnmount) unmountComponent(toUnmount);
                component.base = base;
                if (base && !isChild) {
                    var componentRef = component, t = component;
                    while (t = t.__u) (componentRef = t).base = base;
                    base._component = componentRef;
                    base._componentConstructor = componentRef.constructor;
                }
            }
            if (!isUpdate || mountAll) mounts.unshift(component); else if (!skip) {
                if (component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, previousContext);
                if (options.afterUpdate) options.afterUpdate(component);
            }
            if (null != component.__h) while (component.__h.length) component.__h.pop().call(component);
            if (!diffLevel && !isChild) flushMounts();
        }
    }
    function buildComponentFromVNode(dom, vnode, context, mountAll) {
        var c = dom && dom._component, originalComponent = c, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
        while (c && !isOwner && (c = c.__u)) isOwner = c.constructor === vnode.nodeName;
        if (c && isOwner && (!mountAll || c._component)) {
            setComponentProps(c, props, 3, context, mountAll);
            dom = c.base;
        } else {
            if (originalComponent && !isDirectOwner) {
                unmountComponent(originalComponent);
                dom = oldDom = null;
            }
            c = createComponent(vnode.nodeName, props, context);
            if (dom && !c.__b) {
                c.__b = dom;
                oldDom = null;
            }
            setComponentProps(c, props, 1, context, mountAll);
            dom = c.base;
            if (oldDom && dom !== oldDom) {
                oldDom._component = null;
                recollectNodeTree(oldDom, !1);
            }
        }
        return dom;
    }
    function unmountComponent(component) {
        if (options.beforeUnmount) options.beforeUnmount(component);
        var base = component.base;
        component.__x = !0;
        if (component.componentWillUnmount) component.componentWillUnmount();
        component.base = null;
        var inner = component._component;
        if (inner) unmountComponent(inner); else if (base) {
            if (base.__preactattr_ && base.__preactattr_.ref) base.__preactattr_.ref(null);
            component.__b = base;
            removeNode(base);
            collectComponent(component);
            removeChildren(base);
        }
        if (component.__r) component.__r(null);
    }
    function Component(props, context) {
        this.__d = !0;
        this.context = context;
        this.props = props;
        this.state = this.state || {};
    }
    function render(vnode, parent, merge) {
        return diff(merge, vnode, {}, !1, parent, !1);
    }
    var options = {};
    var stack = [];
    var EMPTY_CHILDREN = [];
    var defer = 'function' == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
    var items = [];
    var mounts = [];
    var diffLevel = 0;
    var isSvgMode = !1;
    var hydrating = !1;
    var components = {};
    extend(Component.prototype, {
        setState: function(state, callback) {
            var s = this.state;
            if (!this.__s) this.__s = extend({}, s);
            extend(s, 'function' == typeof state ? state(s, this.props) : state);
            if (callback) (this.__h = this.__h || []).push(callback);
            enqueueRender(this);
        },
        forceUpdate: function(callback) {
            if (callback) (this.__h = this.__h || []).push(callback);
            renderComponent(this, 2);
        },
        render: function() {}
    });
    var preact = {
        h: h,
        createElement: h,
        cloneElement: cloneElement,
        Component: Component,
        render: render,
        rerender: rerender,
        options: options
    };
    if ('undefined' != typeof module) module.exports = preact; else self.preact = preact;
}();

},{}],117:[function(require,module,exports){
(function (global){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ResizeObserver = factory());
}(this, (function () { 'use strict';

    /**
     * A collection of shims that provide minimal functionality of the ES6 collections.
     *
     * These implementations are not meant to be used outside of the ResizeObserver
     * modules as they cover only a limited range of use cases.
     */
    /* eslint-disable require-jsdoc, valid-jsdoc */
    var MapShim = (function () {
        if (typeof Map !== 'undefined') {
            return Map;
        }
        /**
         * Returns index in provided array that matches the specified key.
         *
         * @param {Array<Array>} arr
         * @param {*} key
         * @returns {number}
         */
        function getIndex(arr, key) {
            var result = -1;
            arr.some(function (entry, index) {
                if (entry[0] === key) {
                    result = index;
                    return true;
                }
                return false;
            });
            return result;
        }
        return /** @class */ (function () {
            function class_1() {
                this.__entries__ = [];
            }
            Object.defineProperty(class_1.prototype, "size", {
                /**
                 * @returns {boolean}
                 */
                get: function () {
                    return this.__entries__.length;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @param {*} key
             * @returns {*}
             */
            class_1.prototype.get = function (key) {
                var index = getIndex(this.__entries__, key);
                var entry = this.__entries__[index];
                return entry && entry[1];
            };
            /**
             * @param {*} key
             * @param {*} value
             * @returns {void}
             */
            class_1.prototype.set = function (key, value) {
                var index = getIndex(this.__entries__, key);
                if (~index) {
                    this.__entries__[index][1] = value;
                }
                else {
                    this.__entries__.push([key, value]);
                }
            };
            /**
             * @param {*} key
             * @returns {void}
             */
            class_1.prototype.delete = function (key) {
                var entries = this.__entries__;
                var index = getIndex(entries, key);
                if (~index) {
                    entries.splice(index, 1);
                }
            };
            /**
             * @param {*} key
             * @returns {void}
             */
            class_1.prototype.has = function (key) {
                return !!~getIndex(this.__entries__, key);
            };
            /**
             * @returns {void}
             */
            class_1.prototype.clear = function () {
                this.__entries__.splice(0);
            };
            /**
             * @param {Function} callback
             * @param {*} [ctx=null]
             * @returns {void}
             */
            class_1.prototype.forEach = function (callback, ctx) {
                if (ctx === void 0) { ctx = null; }
                for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    callback.call(ctx, entry[1], entry[0]);
                }
            };
            return class_1;
        }());
    })();

    /**
     * Detects whether window and document objects are available in current environment.
     */
    var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

    // Returns global object of a current environment.
    var global$1 = (function () {
        if (typeof global !== 'undefined' && global.Math === Math) {
            return global;
        }
        if (typeof self !== 'undefined' && self.Math === Math) {
            return self;
        }
        if (typeof window !== 'undefined' && window.Math === Math) {
            return window;
        }
        // eslint-disable-next-line no-new-func
        return Function('return this')();
    })();

    /**
     * A shim for the requestAnimationFrame which falls back to the setTimeout if
     * first one is not supported.
     *
     * @returns {number} Requests' identifier.
     */
    var requestAnimationFrame$1 = (function () {
        if (typeof requestAnimationFrame === 'function') {
            // It's required to use a bounded function because IE sometimes throws
            // an "Invalid calling object" error if rAF is invoked without the global
            // object on the left hand side.
            return requestAnimationFrame.bind(global$1);
        }
        return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
    })();

    // Defines minimum timeout before adding a trailing call.
    var trailingTimeout = 2;
    /**
     * Creates a wrapper function which ensures that provided callback will be
     * invoked only once during the specified delay period.
     *
     * @param {Function} callback - Function to be invoked after the delay period.
     * @param {number} delay - Delay after which to invoke callback.
     * @returns {Function}
     */
    function throttle (callback, delay) {
        var leadingCall = false, trailingCall = false, lastCallTime = 0;
        /**
         * Invokes the original callback function and schedules new invocation if
         * the "proxy" was called during current request.
         *
         * @returns {void}
         */
        function resolvePending() {
            if (leadingCall) {
                leadingCall = false;
                callback();
            }
            if (trailingCall) {
                proxy();
            }
        }
        /**
         * Callback invoked after the specified delay. It will further postpone
         * invocation of the original function delegating it to the
         * requestAnimationFrame.
         *
         * @returns {void}
         */
        function timeoutCallback() {
            requestAnimationFrame$1(resolvePending);
        }
        /**
         * Schedules invocation of the original function.
         *
         * @returns {void}
         */
        function proxy() {
            var timeStamp = Date.now();
            if (leadingCall) {
                // Reject immediately following calls.
                if (timeStamp - lastCallTime < trailingTimeout) {
                    return;
                }
                // Schedule new call to be in invoked when the pending one is resolved.
                // This is important for "transitions" which never actually start
                // immediately so there is a chance that we might miss one if change
                // happens amids the pending invocation.
                trailingCall = true;
            }
            else {
                leadingCall = true;
                trailingCall = false;
                setTimeout(timeoutCallback, delay);
            }
            lastCallTime = timeStamp;
        }
        return proxy;
    }

    // Minimum delay before invoking the update of observers.
    var REFRESH_DELAY = 20;
    // A list of substrings of CSS properties used to find transition events that
    // might affect dimensions of observed elements.
    var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
    // Check if MutationObserver is available.
    var mutationObserverSupported = typeof MutationObserver !== 'undefined';
    /**
     * Singleton controller class which handles updates of ResizeObserver instances.
     */
    var ResizeObserverController = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserverController.
         *
         * @private
         */
        function ResizeObserverController() {
            /**
             * Indicates whether DOM listeners have been added.
             *
             * @private {boolean}
             */
            this.connected_ = false;
            /**
             * Tells that controller has subscribed for Mutation Events.
             *
             * @private {boolean}
             */
            this.mutationEventsAdded_ = false;
            /**
             * Keeps reference to the instance of MutationObserver.
             *
             * @private {MutationObserver}
             */
            this.mutationsObserver_ = null;
            /**
             * A list of connected observers.
             *
             * @private {Array<ResizeObserverSPI>}
             */
            this.observers_ = [];
            this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
            this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
        }
        /**
         * Adds observer to observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be added.
         * @returns {void}
         */
        ResizeObserverController.prototype.addObserver = function (observer) {
            if (!~this.observers_.indexOf(observer)) {
                this.observers_.push(observer);
            }
            // Add listeners if they haven't been added yet.
            if (!this.connected_) {
                this.connect_();
            }
        };
        /**
         * Removes observer from observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be removed.
         * @returns {void}
         */
        ResizeObserverController.prototype.removeObserver = function (observer) {
            var observers = this.observers_;
            var index = observers.indexOf(observer);
            // Remove observer if it's present in registry.
            if (~index) {
                observers.splice(index, 1);
            }
            // Remove listeners if controller has no connected observers.
            if (!observers.length && this.connected_) {
                this.disconnect_();
            }
        };
        /**
         * Invokes the update of observers. It will continue running updates insofar
         * it detects changes.
         *
         * @returns {void}
         */
        ResizeObserverController.prototype.refresh = function () {
            var changesDetected = this.updateObservers_();
            // Continue running updates if changes have been detected as there might
            // be future ones caused by CSS transitions.
            if (changesDetected) {
                this.refresh();
            }
        };
        /**
         * Updates every observer from observers list and notifies them of queued
         * entries.
         *
         * @private
         * @returns {boolean} Returns "true" if any observer has detected changes in
         *      dimensions of it's elements.
         */
        ResizeObserverController.prototype.updateObservers_ = function () {
            // Collect observers that have active observations.
            var activeObservers = this.observers_.filter(function (observer) {
                return observer.gatherActive(), observer.hasActive();
            });
            // Deliver notifications in a separate cycle in order to avoid any
            // collisions between observers, e.g. when multiple instances of
            // ResizeObserver are tracking the same element and the callback of one
            // of them changes content dimensions of the observed target. Sometimes
            // this may result in notifications being blocked for the rest of observers.
            activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
            return activeObservers.length > 0;
        };
        /**
         * Initializes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.connect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already added.
            if (!isBrowser || this.connected_) {
                return;
            }
            // Subscription to the "Transitionend" event is used as a workaround for
            // delayed transitions. This way it's possible to capture at least the
            // final state of an element.
            document.addEventListener('transitionend', this.onTransitionEnd_);
            window.addEventListener('resize', this.refresh);
            if (mutationObserverSupported) {
                this.mutationsObserver_ = new MutationObserver(this.refresh);
                this.mutationsObserver_.observe(document, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            }
            else {
                document.addEventListener('DOMSubtreeModified', this.refresh);
                this.mutationEventsAdded_ = true;
            }
            this.connected_ = true;
        };
        /**
         * Removes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.disconnect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already removed.
            if (!isBrowser || !this.connected_) {
                return;
            }
            document.removeEventListener('transitionend', this.onTransitionEnd_);
            window.removeEventListener('resize', this.refresh);
            if (this.mutationsObserver_) {
                this.mutationsObserver_.disconnect();
            }
            if (this.mutationEventsAdded_) {
                document.removeEventListener('DOMSubtreeModified', this.refresh);
            }
            this.mutationsObserver_ = null;
            this.mutationEventsAdded_ = false;
            this.connected_ = false;
        };
        /**
         * "Transitionend" event handler.
         *
         * @private
         * @param {TransitionEvent} event
         * @returns {void}
         */
        ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
            var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
            // Detect whether transition may affect dimensions of an element.
            var isReflowProperty = transitionKeys.some(function (key) {
                return !!~propertyName.indexOf(key);
            });
            if (isReflowProperty) {
                this.refresh();
            }
        };
        /**
         * Returns instance of the ResizeObserverController.
         *
         * @returns {ResizeObserverController}
         */
        ResizeObserverController.getInstance = function () {
            if (!this.instance_) {
                this.instance_ = new ResizeObserverController();
            }
            return this.instance_;
        };
        /**
         * Holds reference to the controller's instance.
         *
         * @private {ResizeObserverController}
         */
        ResizeObserverController.instance_ = null;
        return ResizeObserverController;
    }());

    /**
     * Defines non-writable/enumerable properties of the provided target object.
     *
     * @param {Object} target - Object for which to define properties.
     * @param {Object} props - Properties to be defined.
     * @returns {Object} Target object.
     */
    var defineConfigurable = (function (target, props) {
        for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
            var key = _a[_i];
            Object.defineProperty(target, key, {
                value: props[key],
                enumerable: false,
                writable: false,
                configurable: true
            });
        }
        return target;
    });

    /**
     * Returns the global object associated with provided element.
     *
     * @param {Object} target
     * @returns {Object}
     */
    var getWindowOf = (function (target) {
        // Assume that the element is an instance of Node, which means that it
        // has the "ownerDocument" property from which we can retrieve a
        // corresponding global object.
        var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
        // Return the local global object if it's not possible extract one from
        // provided element.
        return ownerGlobal || global$1;
    });

    // Placeholder of an empty content rectangle.
    var emptyRect = createRectInit(0, 0, 0, 0);
    /**
     * Converts provided string to a number.
     *
     * @param {number|string} value
     * @returns {number}
     */
    function toFloat(value) {
        return parseFloat(value) || 0;
    }
    /**
     * Extracts borders size from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @param {...string} positions - Borders positions (top, right, ...)
     * @returns {number}
     */
    function getBordersSize(styles) {
        var positions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            positions[_i - 1] = arguments[_i];
        }
        return positions.reduce(function (size, position) {
            var value = styles['border-' + position + '-width'];
            return size + toFloat(value);
        }, 0);
    }
    /**
     * Extracts paddings sizes from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @returns {Object} Paddings box.
     */
    function getPaddings(styles) {
        var positions = ['top', 'right', 'bottom', 'left'];
        var paddings = {};
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
            var position = positions_1[_i];
            var value = styles['padding-' + position];
            paddings[position] = toFloat(value);
        }
        return paddings;
    }
    /**
     * Calculates content rectangle of provided SVG element.
     *
     * @param {SVGGraphicsElement} target - Element content rectangle of which needs
     *      to be calculated.
     * @returns {DOMRectInit}
     */
    function getSVGContentRect(target) {
        var bbox = target.getBBox();
        return createRectInit(0, 0, bbox.width, bbox.height);
    }
    /**
     * Calculates content rectangle of provided HTMLElement.
     *
     * @param {HTMLElement} target - Element for which to calculate the content rectangle.
     * @returns {DOMRectInit}
     */
    function getHTMLElementContentRect(target) {
        // Client width & height properties can't be
        // used exclusively as they provide rounded values.
        var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
        // By this condition we can catch all non-replaced inline, hidden and
        // detached elements. Though elements with width & height properties less
        // than 0.5 will be discarded as well.
        //
        // Without it we would need to implement separate methods for each of
        // those cases and it's not possible to perform a precise and performance
        // effective test for hidden elements. E.g. even jQuery's ':visible' filter
        // gives wrong results for elements with width & height less than 0.5.
        if (!clientWidth && !clientHeight) {
            return emptyRect;
        }
        var styles = getWindowOf(target).getComputedStyle(target);
        var paddings = getPaddings(styles);
        var horizPad = paddings.left + paddings.right;
        var vertPad = paddings.top + paddings.bottom;
        // Computed styles of width & height are being used because they are the
        // only dimensions available to JS that contain non-rounded values. It could
        // be possible to utilize the getBoundingClientRect if only it's data wasn't
        // affected by CSS transformations let alone paddings, borders and scroll bars.
        var width = toFloat(styles.width), height = toFloat(styles.height);
        // Width & height include paddings and borders when the 'border-box' box
        // model is applied (except for IE).
        if (styles.boxSizing === 'border-box') {
            // Following conditions are required to handle Internet Explorer which
            // doesn't include paddings and borders to computed CSS dimensions.
            //
            // We can say that if CSS dimensions + paddings are equal to the "client"
            // properties then it's either IE, and thus we don't need to subtract
            // anything, or an element merely doesn't have paddings/borders styles.
            if (Math.round(width + horizPad) !== clientWidth) {
                width -= getBordersSize(styles, 'left', 'right') + horizPad;
            }
            if (Math.round(height + vertPad) !== clientHeight) {
                height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
            }
        }
        // Following steps can't be applied to the document's root element as its
        // client[Width/Height] properties represent viewport area of the window.
        // Besides, it's as well not necessary as the <html> itself neither has
        // rendered scroll bars nor it can be clipped.
        if (!isDocumentElement(target)) {
            // In some browsers (only in Firefox, actually) CSS width & height
            // include scroll bars size which can be removed at this step as scroll
            // bars are the only difference between rounded dimensions + paddings
            // and "client" properties, though that is not always true in Chrome.
            var vertScrollbar = Math.round(width + horizPad) - clientWidth;
            var horizScrollbar = Math.round(height + vertPad) - clientHeight;
            // Chrome has a rather weird rounding of "client" properties.
            // E.g. for an element with content width of 314.2px it sometimes gives
            // the client width of 315px and for the width of 314.7px it may give
            // 314px. And it doesn't happen all the time. So just ignore this delta
            // as a non-relevant.
            if (Math.abs(vertScrollbar) !== 1) {
                width -= vertScrollbar;
            }
            if (Math.abs(horizScrollbar) !== 1) {
                height -= horizScrollbar;
            }
        }
        return createRectInit(paddings.left, paddings.top, width, height);
    }
    /**
     * Checks whether provided element is an instance of the SVGGraphicsElement.
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    var isSVGGraphicsElement = (function () {
        // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
        // interface.
        if (typeof SVGGraphicsElement !== 'undefined') {
            return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
        }
        // If it's so, then check that element is at least an instance of the
        // SVGElement and that it has the "getBBox" method.
        // eslint-disable-next-line no-extra-parens
        return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
            typeof target.getBBox === 'function'); };
    })();
    /**
     * Checks whether provided element is a document element (<html>).
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    function isDocumentElement(target) {
        return target === getWindowOf(target).document.documentElement;
    }
    /**
     * Calculates an appropriate content rectangle for provided html or svg element.
     *
     * @param {Element} target - Element content rectangle of which needs to be calculated.
     * @returns {DOMRectInit}
     */
    function getContentRect(target) {
        if (!isBrowser) {
            return emptyRect;
        }
        if (isSVGGraphicsElement(target)) {
            return getSVGContentRect(target);
        }
        return getHTMLElementContentRect(target);
    }
    /**
     * Creates rectangle with an interface of the DOMRectReadOnly.
     * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
     *
     * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
     * @returns {DOMRectReadOnly}
     */
    function createReadOnlyRect(_a) {
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        // If DOMRectReadOnly is available use it as a prototype for the rectangle.
        var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
        var rect = Object.create(Constr.prototype);
        // Rectangle's properties are not writable and non-enumerable.
        defineConfigurable(rect, {
            x: x, y: y, width: width, height: height,
            top: y,
            right: x + width,
            bottom: height + y,
            left: x
        });
        return rect;
    }
    /**
     * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
     * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
     *
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} width - Rectangle's width.
     * @param {number} height - Rectangle's height.
     * @returns {DOMRectInit}
     */
    function createRectInit(x, y, width, height) {
        return { x: x, y: y, width: width, height: height };
    }

    /**
     * Class that is responsible for computations of the content rectangle of
     * provided DOM element and for keeping track of it's changes.
     */
    var ResizeObservation = /** @class */ (function () {
        /**
         * Creates an instance of ResizeObservation.
         *
         * @param {Element} target - Element to be observed.
         */
        function ResizeObservation(target) {
            /**
             * Broadcasted width of content rectangle.
             *
             * @type {number}
             */
            this.broadcastWidth = 0;
            /**
             * Broadcasted height of content rectangle.
             *
             * @type {number}
             */
            this.broadcastHeight = 0;
            /**
             * Reference to the last observed content rectangle.
             *
             * @private {DOMRectInit}
             */
            this.contentRect_ = createRectInit(0, 0, 0, 0);
            this.target = target;
        }
        /**
         * Updates content rectangle and tells whether it's width or height properties
         * have changed since the last broadcast.
         *
         * @returns {boolean}
         */
        ResizeObservation.prototype.isActive = function () {
            var rect = getContentRect(this.target);
            this.contentRect_ = rect;
            return (rect.width !== this.broadcastWidth ||
                rect.height !== this.broadcastHeight);
        };
        /**
         * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
         * from the corresponding properties of the last observed content rectangle.
         *
         * @returns {DOMRectInit} Last observed content rectangle.
         */
        ResizeObservation.prototype.broadcastRect = function () {
            var rect = this.contentRect_;
            this.broadcastWidth = rect.width;
            this.broadcastHeight = rect.height;
            return rect;
        };
        return ResizeObservation;
    }());

    var ResizeObserverEntry = /** @class */ (function () {
        /**
         * Creates an instance of ResizeObserverEntry.
         *
         * @param {Element} target - Element that is being observed.
         * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
         */
        function ResizeObserverEntry(target, rectInit) {
            var contentRect = createReadOnlyRect(rectInit);
            // According to the specification following properties are not writable
            // and are also not enumerable in the native implementation.
            //
            // Property accessors are not being used as they'd require to define a
            // private WeakMap storage which may cause memory leaks in browsers that
            // don't support this type of collections.
            defineConfigurable(this, { target: target, contentRect: contentRect });
        }
        return ResizeObserverEntry;
    }());

    var ResizeObserverSPI = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserver.
         *
         * @param {ResizeObserverCallback} callback - Callback function that is invoked
         *      when one of the observed elements changes it's content dimensions.
         * @param {ResizeObserverController} controller - Controller instance which
         *      is responsible for the updates of observer.
         * @param {ResizeObserver} callbackCtx - Reference to the public
         *      ResizeObserver instance which will be passed to callback function.
         */
        function ResizeObserverSPI(callback, controller, callbackCtx) {
            /**
             * Collection of resize observations that have detected changes in dimensions
             * of elements.
             *
             * @private {Array<ResizeObservation>}
             */
            this.activeObservations_ = [];
            /**
             * Registry of the ResizeObservation instances.
             *
             * @private {Map<Element, ResizeObservation>}
             */
            this.observations_ = new MapShim();
            if (typeof callback !== 'function') {
                throw new TypeError('The callback provided as parameter 1 is not a function.');
            }
            this.callback_ = callback;
            this.controller_ = controller;
            this.callbackCtx_ = callbackCtx;
        }
        /**
         * Starts observing provided element.
         *
         * @param {Element} target - Element to be observed.
         * @returns {void}
         */
        ResizeObserverSPI.prototype.observe = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            // Do nothing if element is already being observed.
            if (observations.has(target)) {
                return;
            }
            observations.set(target, new ResizeObservation(target));
            this.controller_.addObserver(this);
            // Force the update of observations.
            this.controller_.refresh();
        };
        /**
         * Stops observing provided element.
         *
         * @param {Element} target - Element to stop observing.
         * @returns {void}
         */
        ResizeObserverSPI.prototype.unobserve = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            // Do nothing if element is not being observed.
            if (!observations.has(target)) {
                return;
            }
            observations.delete(target);
            if (!observations.size) {
                this.controller_.removeObserver(this);
            }
        };
        /**
         * Stops observing all elements.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.disconnect = function () {
            this.clearActive();
            this.observations_.clear();
            this.controller_.removeObserver(this);
        };
        /**
         * Collects observation instances the associated element of which has changed
         * it's content rectangle.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.gatherActive = function () {
            var _this = this;
            this.clearActive();
            this.observations_.forEach(function (observation) {
                if (observation.isActive()) {
                    _this.activeObservations_.push(observation);
                }
            });
        };
        /**
         * Invokes initial callback function with a list of ResizeObserverEntry
         * instances collected from active resize observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.broadcastActive = function () {
            // Do nothing if observer doesn't have active observations.
            if (!this.hasActive()) {
                return;
            }
            var ctx = this.callbackCtx_;
            // Create ResizeObserverEntry instance for every active observation.
            var entries = this.activeObservations_.map(function (observation) {
                return new ResizeObserverEntry(observation.target, observation.broadcastRect());
            });
            this.callback_.call(ctx, entries, ctx);
            this.clearActive();
        };
        /**
         * Clears the collection of active observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.clearActive = function () {
            this.activeObservations_.splice(0);
        };
        /**
         * Tells whether observer has active observations.
         *
         * @returns {boolean}
         */
        ResizeObserverSPI.prototype.hasActive = function () {
            return this.activeObservations_.length > 0;
        };
        return ResizeObserverSPI;
    }());

    // Registry of internal observers. If WeakMap is not available use current shim
    // for the Map collection as it has all required methods and because WeakMap
    // can't be fully polyfilled anyway.
    var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
    /**
     * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
     * exposing only those methods and properties that are defined in the spec.
     */
    var ResizeObserver = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserver.
         *
         * @param {ResizeObserverCallback} callback - Callback that is invoked when
         *      dimensions of the observed elements change.
         */
        function ResizeObserver(callback) {
            if (!(this instanceof ResizeObserver)) {
                throw new TypeError('Cannot call a class as a function.');
            }
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            var controller = ResizeObserverController.getInstance();
            var observer = new ResizeObserverSPI(callback, controller, this);
            observers.set(this, observer);
        }
        return ResizeObserver;
    }());
    // Expose public methods of ResizeObserver.
    [
        'observe',
        'unobserve',
        'disconnect'
    ].forEach(function (method) {
        ResizeObserver.prototype[method] = function () {
            var _a;
            return (_a = observers.get(this))[method].apply(_a, arguments);
        };
    });

    var index = (function () {
        // Export existing implementation if available.
        if (typeof global$1.ResizeObserver !== 'undefined') {
            return global$1.ResizeObserver;
        }
        return ResizeObserver;
    })();

    return index;

})));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],118:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

},{}]},{},[1]);
