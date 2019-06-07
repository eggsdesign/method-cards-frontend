// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/browser-split/index.js":[function(require,module,exports) {
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],"node_modules/indexof/index.js":[function(require,module,exports) {

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],"node_modules/class-list/index.js":[function(require,module,exports) {
// contains, add, remove, toggle
var indexof = require('indexof')

module.exports = ClassList

function ClassList(elem) {
    var cl = elem.classList

    if (cl) {
        return cl
    }

    var classList = {
        add: add
        , remove: remove
        , contains: contains
        , toggle: toggle
        , toString: $toString
        , length: 0
        , item: item
    }

    return classList

    function add(token) {
        var list = getTokens()
        if (indexof(list, token) > -1) {
            return
        }
        list.push(token)
        setTokens(list)
    }

    function remove(token) {
        var list = getTokens()
            , index = indexof(list, token)

        if (index === -1) {
            return
        }

        list.splice(index, 1)
        setTokens(list)
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token)
            return false
        } else {
            add(token)
            return true
        }
    }

    function $toString() {
        return elem.className
    }

    function item(index) {
        var tokens = getTokens()
        return tokens[index] || null
    }

    function getTokens() {
        var className = elem.className

        return filter(className.split(" "), isTruthy)
    }

    function setTokens(list) {
        var length = list.length

        elem.className = list.join(" ")
        classList.length = length

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i]
        }

        delete list[length]
    }
}

function filter (arr, fn) {
    var ret = []
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i])
    }
    return ret
}

function isTruthy(value) {
    return !!value
}

},{"indexof":"node_modules/indexof/index.js"}],"node_modules/parcel/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/hyperscript/index.js":[function(require,module,exports) {
var split = require('browser-split')
var ClassList = require('class-list')

var w = typeof window === 'undefined' ? require('html-element') : window
var document = w.document
var Text = w.Text

function context () {

  var cleanupFuncs = []

  function h() {
    var args = [].slice.call(arguments), e = null
    function item (l) {
      var r
      function parseClass (string) {
        // Our minimal parser doesn’t understand escaping CSS special
        // characters like `#`. Don’t use them. More reading:
        // https://mathiasbynens.be/notes/css-escapes .

        var m = split(string, /([\.#]?[^\s#.]+)/)
        if(/^\.|#/.test(m[1]))
          e = document.createElement('div')
        forEach(m, function (v) {
          var s = v.substring(1,v.length)
          if(!v) return
          if(!e)
            e = document.createElement(v)
          else if (v[0] === '.')
            ClassList(e).add(s)
          else if (v[0] === '#')
            e.setAttribute('id', s)
        })
      }

      if(l == null)
        ;
      else if('string' === typeof l) {
        if(!e)
          parseClass(l)
        else
          e.appendChild(r = document.createTextNode(l))
      }
      else if('number' === typeof l
        || 'boolean' === typeof l
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(r = document.createTextNode(l.toString()))
      }
      //there might be a better way to handle this...
      else if (isArray(l))
        forEach(l, item)
      else if(isNode(l))
        e.appendChild(r = l)
      else if(l instanceof Text)
        e.appendChild(r = l)
      else if ('object' === typeof l) {
        for (var k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              (function (k, l) { // capture k, l in the closure
                if (e.addEventListener){
                  e.addEventListener(k.substring(2), l[k], false)
                  cleanupFuncs.push(function(){
                    e.removeEventListener(k.substring(2), l[k], false)
                  })
                }else{
                  e.attachEvent(k, l[k])
                  cleanupFuncs.push(function(){
                    e.detachEvent(k, l[k])
                  })
                }
              })(k, l)
            } else {
              // observable
              e[k] = l[k]()
              cleanupFuncs.push(l[k](function (v) {
                e[k] = v
              }))
            }
          }
          else if(k === 'style') {
            if('string' === typeof l[k]) {
              e.style.cssText = l[k]
            }else{
              for (var s in l[k]) (function(s, v) {
                if('function' === typeof v) {
                  // observable
                  e.style.setProperty(s, v())
                  cleanupFuncs.push(v(function (val) {
                    e.style.setProperty(s, val)
                  }))
                } else
                  var match = l[k][s].match(/(.*)\W+!important\W*$/);
                  if (match) {
                    e.style.setProperty(s, match[1], 'important')
                  } else {
                    e.style.setProperty(s, l[k][s])
                  }
              })(s, l[k][s])
            }
          } else if(k === 'attrs') {
            for (var v in l[k]) {
              e.setAttribute(v, l[k][v])
            }
          }
          else if (k.substr(0, 5) === "data-") {
            e.setAttribute(k, l[k])
          } else {
            e[k] = l[k]
          }
        }
      } else if ('function' === typeof l) {
        //assume it's an observable!
        var v = l()
        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

        cleanupFuncs.push(l(function (v) {
          if(isNode(v) && r.parentElement)
            r.parentElement.replaceChild(v, r), r = v
          else
            r.textContent = v
        }))
      }

      return r
    }
    while(args.length)
      item(args.shift())

    return e
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++){
      cleanupFuncs[i]()
    }
    cleanupFuncs.length = 0
  }

  return h
}

var h = module.exports = context()
h.context = context

function isNode (el) {
  return el && el.nodeName && el.nodeType
}

function forEach (arr, fn) {
  if (arr.forEach) return arr.forEach(fn)
  for (var i = 0; i < arr.length; i++) fn(arr[i], i)
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}



},{"browser-split":"node_modules/browser-split/index.js","class-list":"node_modules/class-list/index.js","html-element":"node_modules/parcel/src/builtins/_empty.js"}],"node_modules/object-assign/index.js":[function(require,module,exports) {
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
'use strict';
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};
},{}],"node_modules/@sanity/generate-help-url/index.js":[function(require,module,exports) {
var baseUrl = 'https://docs.sanity.io/help/'

module.exports = function generateHelpUrl(slug) {
  return baseUrl + slug
}

},{}],"node_modules/@sanity/image-url/lib/parseSource.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseSource;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Convert an asset-id, asset or image to an image record suitable for processing
// eslint-disable-next-line complexity
function parseSource(source) {
  if (!source) {
    return null;
  }

  var image;

  if (typeof source === 'string' && isUrl(source)) {
    // Someone passed an existing image url?
    image = {
      asset: {
        _ref: urlToId(source)
      }
    };
  } else if (typeof source === 'string') {
    // Just an asset id
    image = {
      asset: {
        _ref: source
      }
    };
  } else if (typeof source._ref === 'string') {
    // We just got passed an asset directly
    image = {
      asset: source
    };
  } else if (source._id) {
    // If we were passed an image asset document
    image = {
      asset: {
        _ref: source._id
      }
    };
  } else if (source.asset && source.asset.url && !source.asset._ref) {
    image = {
      asset: {
        _ref: urlToId(source.asset.url)
      }
    };
  } else if (_typeof(source.asset) === 'object') {
    image = source;
  } else {
    // We got something that does not look like an image, or it is an image
    // that currently isn't sporting an asset.
    return null;
  }

  if (source.crop) {
    image.crop = source.crop;
  }

  if (source.hotspot) {
    image.hotspot = source.hotspot;
  }

  return applyDefaults(image);
}

function isUrl(url) {
  return /^https?:\/\//.test("".concat(url));
}

function urlToId(url) {
  var parts = url.split('/').slice(-1);
  return "image-".concat(parts[0]).replace(/\.([a-z]+)$/, '-$1');
} // Mock crop and hotspot if image lacks it


function applyDefaults(image) {
  if (image.crop && image.hotspot) {
    return image;
  }

  return _objectSpread({
    crop: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    },
    hotspot: {
      x: 0.5,
      y: 0.5,
      height: 1.0,
      width: 1.0
    }
  }, image);
}

},{}],"node_modules/@sanity/image-url/lib/parseAssetId.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseAssetId;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var example = 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg';

function parseAssetId(ref) {
  var _ref$split = ref.split('-'),
      _ref$split2 = _slicedToArray(_ref$split, 4),
      id = _ref$split2[1],
      dimensionString = _ref$split2[2],
      format = _ref$split2[3];

  if (!id || !dimensionString || !format) {
    throw new Error("Malformed asset _ref '".concat(ref, "'. Expected an id like \"").concat(example, "\"."));
  }

  var _dimensionString$spli = dimensionString.split('x'),
      _dimensionString$spli2 = _slicedToArray(_dimensionString$spli, 2),
      imgWidthStr = _dimensionString$spli2[0],
      imgHeightStr = _dimensionString$spli2[1];

  var width = +imgWidthStr;
  var height = +imgHeightStr;
  var isValidAssetId = isFinite(width) && isFinite(height);

  if (!isValidAssetId) {
    throw new Error("Malformed asset _ref '".concat(ref, "'. Expected an id like \"").concat(example, "\"."));
  }

  return {
    id: id,
    width: width,
    height: height,
    format: format
  };
}

},{}],"node_modules/@sanity/image-url/lib/urlForImage.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = urlForImage;
Object.defineProperty(exports, "parseSource", {
  enumerable: true,
  get: function get() {
    return _parseSource.default;
  }
});

var _parseSource = _interopRequireDefault(require("./parseSource"));

var _parseAssetId = _interopRequireDefault(require("./parseAssetId"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SPEC_NAME_TO_URL_NAME_MAPPINGS = [['width', 'w'], ['height', 'h'], ['format', 'fm'], ['download', 'dl'], ['blur', 'blur'], ['sharpen', 'sharp'], ['invert', 'invert'], ['orientation', 'or'], ['minHeight', 'min-h'], ['maxHeight', 'max-h'], ['minWidth', 'min-w'], ['maxWidth', 'max-w'], ['quality', 'q'], ['fit', 'fit'], ['crop', 'crop']];

function urlForImage(options) {
  var spec = _objectSpread({}, options || {});

  var source = spec.source;
  delete spec.source;
  var image = (0, _parseSource.default)(source);

  if (!image) {
    return null;
  }

  var asset = (0, _parseAssetId.default)(image.asset._ref); // Compute crop rect in terms of pixel coordinates in the raw source image

  var crop = {
    left: Math.round(image.crop.left * asset.width),
    top: Math.round(image.crop.top * asset.height)
  };
  crop.width = Math.round(asset.width - image.crop.right * asset.width - crop.left);
  crop.height = Math.round(asset.height - image.crop.bottom * asset.height - crop.top); // Compute hot spot rect in terms of pixel coordinates

  var hotSpotVerticalRadius = image.hotspot.height * asset.height / 2;
  var hotSpotHorizontalRadius = image.hotspot.width * asset.width / 2;
  var hotSpotCenterX = image.hotspot.x * asset.width;
  var hotSpotCenterY = image.hotspot.y * asset.height;
  var hotspot = {
    left: hotSpotCenterX - hotSpotHorizontalRadius,
    top: hotSpotCenterY - hotSpotVerticalRadius,
    right: hotSpotCenterX + hotSpotHorizontalRadius,
    bottom: hotSpotCenterY + hotSpotHorizontalRadius
  };
  spec.asset = asset; // If irrelevant, or if we are requested to: don't perform crop/fit based on
  // the crop/hotspot.

  if (!(spec.rect || spec.focalPoint || spec.ignoreImageParams || spec.crop)) {
    spec = _objectSpread({}, spec, fit({
      crop: crop,
      hotspot: hotspot
    }, spec));
  }

  return specToImageUrl(spec);
} // eslint-disable-next-line complexity


function specToImageUrl(spec) {
  var cdnUrl = spec.baseUrl || 'https://cdn.sanity.io';
  var filename = "".concat(spec.asset.id, "-").concat(spec.asset.width, "x").concat(spec.asset.height, ".").concat(spec.asset.format);
  var baseUrl = "".concat(cdnUrl, "/images/").concat(spec.projectId, "/").concat(spec.dataset, "/").concat(filename);
  var params = [];

  if (spec.rect) {
    // Only bother url with a crop if it actually crops anything
    var isEffectiveCrop = spec.rect.left != 0 || spec.rect.top != 0 || spec.rect.height != spec.asset.height || spec.rect.width != spec.asset.width;

    if (isEffectiveCrop) {
      params.push("rect=".concat(spec.rect.left, ",").concat(spec.rect.top, ",").concat(spec.rect.width, ",").concat(spec.rect.height));
    }
  }

  if (spec.bg) {
    params.push("bg=".concat(spec.bg));
  }

  if (spec.focalPoint) {
    params.push("fp-x=".concat(spec.focalPoint.x));
    params.push("fp-x=".concat(spec.focalPoint.y));
  }

  if (spec.flipHorizontal || spec.flipVertical) {
    params.push("flip=".concat(spec.flipHorizontal ? 'h' : '').concat(spec.flipVertical ? 'v' : ''));
  } // Map from spec name to url param name, and allow using the actual param name as an alternative


  SPEC_NAME_TO_URL_NAME_MAPPINGS.forEach(function (mapping) {
    var _mapping = _slicedToArray(mapping, 2),
        specName = _mapping[0],
        param = _mapping[1];

    if (typeof spec[specName] !== 'undefined') {
      params.push("".concat(param, "=").concat(encodeURIComponent(spec[specName])));
    } else if (typeof spec[param] !== 'undefined') {
      params.push("".concat(param, "=").concat(encodeURIComponent(spec[param])));
    }
  });

  if (params.length === 0) {
    return baseUrl;
  }

  return "".concat(baseUrl, "?").concat(params.join('&'));
}

function fit(source, spec) {
  var result = {
    width: spec.width,
    height: spec.height // If we are not constraining the aspect ratio, we'll just use the whole crop

  };

  if (!(spec.width && spec.height)) {
    result.rect = source.crop;
    return result;
  }

  var crop = source.crop;
  var hotspot = source.hotspot; // If we are here, that means aspect ratio is locked and fitting will be a bit harder

  var desiredAspectRatio = spec.width / spec.height;
  var cropAspectRatio = crop.width / crop.height;

  if (cropAspectRatio > desiredAspectRatio) {
    // The crop is wider than the desired aspect ratio. That means we are cutting from the sides
    var _height = crop.height;

    var _width = _height * desiredAspectRatio;

    var _top = crop.top; // Center output horizontally over hotspot

    var hotspotXCenter = (hotspot.right - hotspot.left) / 2 + hotspot.left;

    var _left = hotspotXCenter - _width / 2; // Keep output within crop


    if (_left < crop.left) {
      _left = crop.left;
    } else if (_left + _width > crop.left + crop.width) {
      _left = crop.left + crop.width - _width;
    }

    result.rect = {
      left: Math.round(_left),
      top: Math.round(_top),
      width: Math.round(_width),
      height: Math.round(_height)
    };
    return result;
  } // The crop is taller than the desired ratio, we are cutting from top and bottom


  var width = crop.width;
  var height = width / desiredAspectRatio;
  var left = crop.left; // Center output vertically over hotspot

  var hotspotYCenter = (hotspot.bottom - hotspot.top) / 2 + hotspot.top;
  var top = hotspotYCenter - height / 2; // Keep output rect within crop

  if (top < crop.top) {
    top = crop.top;
  } else if (top + height > crop.top + crop.height) {
    top = crop.top + crop.height - height;
  }

  result.rect = {
    left: Math.max(0, Math.floor(left)),
    top: Math.max(0, Math.floor(top)),
    width: Math.round(width),
    height: Math.round(height)
  };
  return result;
} // For backwards-compatibility

},{"./parseSource":"node_modules/@sanity/image-url/lib/parseSource.js","./parseAssetId":"node_modules/@sanity/image-url/lib/parseAssetId.js"}],"node_modules/@sanity/image-url/lib/builder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = urlBuilder;

var _urlForImage = _interopRequireDefault(require("./urlForImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var validFits = ['clip', 'crop', 'fill', 'fillmax', 'max', 'scale', 'min'];
var validCrops = ['top', 'bottom', 'left', 'right', 'center', 'focalpoint', 'entropy'];

var ImageUrlBuilder =
/*#__PURE__*/
function () {
  function ImageUrlBuilder(parent, options) {
    _classCallCheck(this, ImageUrlBuilder);

    if (parent) {
      this.options = _objectSpread({}, parent.options || {}, options || {});
    } else {
      this.options = options || {};
    }
  }

  _createClass(ImageUrlBuilder, [{
    key: "withOptions",
    value: function withOptions(options) {
      return new ImageUrlBuilder(this, options);
    } // The image to be represented. Accepts a Sanity 'image'-document, 'asset'-document or
    // _id of asset. To get the benefit of automatic hot-spot/crop integration with the content
    // studio, the 'image'-document must be provided.

  }, {
    key: "image",
    value: function image(source) {
      return this.withOptions({
        source: source
      });
    } // Specify the dataset

  }, {
    key: "dataset",
    value: function dataset(_dataset) {
      return this.withOptions({
        dataset: _dataset
      });
    } // Specify the projectId

  }, {
    key: "projectId",
    value: function projectId(_projectId) {
      return this.withOptions({
        projectId: _projectId
      });
    } // Specify background color

  }, {
    key: "bg",
    value: function bg(_bg) {
      return this.withOptions({
        bg: _bg
      });
    } // Specify the width of the image in pixels

  }, {
    key: "width",
    value: function width(_width) {
      return this.withOptions({
        width: _width
      });
    } // Specify the height of the image in pixels

  }, {
    key: "height",
    value: function height(_height) {
      return this.withOptions({
        height: _height
      });
    } // Specify focal point in fraction of image dimensions. Each component 0.0-1.0

  }, {
    key: "focalPoint",
    value: function focalPoint(x, y) {
      return this.withOptions({
        focalPoint: {
          x: x,
          y: y
        }
      });
    }
  }, {
    key: "maxWidth",
    value: function maxWidth(_maxWidth) {
      return this.withOptions({
        maxWidth: _maxWidth
      });
    }
  }, {
    key: "minWidth",
    value: function minWidth(_minWidth) {
      return this.withOptions({
        minWidth: _minWidth
      });
    }
  }, {
    key: "maxHeight",
    value: function maxHeight(_maxHeight) {
      return this.withOptions({
        maxHeight: _maxHeight
      });
    }
  }, {
    key: "minHeight",
    value: function minHeight(_minHeight) {
      return this.withOptions({
        minHeight: _minHeight
      });
    } // Specify width and height in pixels

  }, {
    key: "size",
    value: function size(width, height) {
      return this.withOptions({
        width: width,
        height: height
      });
    } // Specify blur between 0 and 100

  }, {
    key: "blur",
    value: function blur(_blur) {
      return this.withOptions({
        blur: _blur
      });
    }
  }, {
    key: "sharpen",
    value: function sharpen(_sharpen) {
      return this.withOptions({
        sharpen: _sharpen
      });
    } // Specify the desired rectangle of the image

  }, {
    key: "rect",
    value: function rect(left, top, width, height) {
      return this.withOptions({
        rect: {
          left: left,
          top: top,
          width: width,
          height: height
        }
      });
    } // Specify the image format of the image. 'jpg', 'pjpg', 'png', 'webp'

  }, {
    key: "format",
    value: function format(_format) {
      return this.withOptions({
        format: _format
      });
    }
  }, {
    key: "invert",
    value: function invert(_invert) {
      return this.withOptions({
        invert: _invert
      });
    } // Rotation in degrees 0, 90, 180, 270

  }, {
    key: "orientation",
    value: function orientation(_orientation) {
      return this.withOptions({
        orientation: _orientation
      });
    } // Compression quality 0-100

  }, {
    key: "quality",
    value: function quality(_quality) {
      return this.withOptions({
        quality: _quality
      });
    } // Make it a download link. Parameter is default filename.

  }, {
    key: "forceDownload",
    value: function forceDownload(download) {
      return this.withOptions({
        download: download
      });
    } // Flip image horizontally

  }, {
    key: "flipHorizontal",
    value: function flipHorizontal() {
      return this.withOptions({
        flipHorizontal: true
      });
    } // Flip image verically

  }, {
    key: "flipVertical",
    value: function flipVertical() {
      return this.withOptions({
        flipVertical: true
      });
    } // Ignore crop/hotspot from image record, even when present

  }, {
    key: "ignoreImageParams",
    value: function ignoreImageParams() {
      return this.withOptions({
        ignoreImageParams: true
      });
    }
  }, {
    key: "fit",
    value: function fit(value) {
      if (validFits.indexOf(value) === -1) {
        throw new Error("Invalid fit mode \"".concat(value, "\""));
      }

      return this.withOptions({
        fit: value
      });
    }
  }, {
    key: "crop",
    value: function crop(value) {
      if (validCrops.indexOf(value) === -1) {
        throw new Error("Invalid crop mode \"".concat(value, "\""));
      }

      return this.withOptions({
        crop: value
      });
    } // Gets the url based on the submitted parameters

  }, {
    key: "url",
    value: function url() {
      return (0, _urlForImage.default)(this.options);
    } // Synonym for url()

  }, {
    key: "toString",
    value: function toString() {
      return this.url();
    }
  }]);

  return ImageUrlBuilder;
}();

function urlBuilder(options) {
  // Did we get a SanityClient?
  if (options && _typeof(options.clientConfig) === 'object') {
    // Inherit config from client
    return new ImageUrlBuilder(null, {
      baseUrl: options.clientConfig.apiHost.replace(/^https:\/\/api\./, 'https://cdn.'),
      projectId: options.clientConfig.projectId,
      dataset: options.clientConfig.dataset
    });
  } // Or just accept the options as given


  return new ImageUrlBuilder(null, options);
}

},{"./urlForImage":"node_modules/@sanity/image-url/lib/urlForImage.js"}],"node_modules/@sanity/image-url/index.js":[function(require,module,exports) {
// eslint-disable-next-line import/no-commonjs
module.exports = require('./lib/builder').default

},{"./lib/builder":"node_modules/@sanity/image-url/lib/builder.js"}],"node_modules/@sanity/block-content-to-hyperscript/lib/getImageUrl.js":[function(require,module,exports) {
'use strict';

var generateHelpUrl = require('@sanity/generate-help-url');
var urlBuilder = require('@sanity/image-url');
var objectAssign = require('object-assign');

var enc = encodeURIComponent;
var materializeError = 'You must either:\n  - Pass `projectId` and `dataset` to the block renderer\n  - Materialize images to include the `url` field.\n\nFor more information, see ' + generateHelpUrl('block-content-image-materializing');

var getQueryString = function getQueryString(options) {
  var query = options.imageOptions;
  var keys = Object.keys(query);
  if (!keys.length) {
    return '';
  }

  var params = keys.map(function (key) {
    return enc(key) + '=' + enc(query[key]);
  });
  return '?' + params.join('&');
};

var buildUrl = function buildUrl(props) {
  var node = props.node,
      options = props.options;
  var projectId = options.projectId,
      dataset = options.dataset;

  var asset = node.asset;

  if (!asset) {
    throw new Error('Image does not have required `asset` property');
  }

  if (asset.url) {
    return asset.url + getQueryString(options);
  }

  if (!projectId || !dataset) {
    throw new Error(materializeError);
  }

  var ref = asset._ref;
  if (!ref) {
    throw new Error('Invalid image reference in block, no `_ref` found on `asset`');
  }

  return urlBuilder(objectAssign({ projectId: projectId, dataset: dataset }, options.imageOptions || {})).image(node).toString();
};

module.exports = buildUrl;

},{"@sanity/generate-help-url":"node_modules/@sanity/generate-help-url/index.js","@sanity/image-url":"node_modules/@sanity/image-url/index.js","object-assign":"node_modules/object-assign/index.js"}],"node_modules/@sanity/block-content-to-hyperscript/lib/buildMarksTree.js":[function(require,module,exports) {
'use strict';

var defaultMarks = ['strong', 'em', 'code', 'underline', 'strike-through'];

var buildMarksTree = function buildMarksTree(block) {
  var children = block.children,
      markDefs = block.markDefs;

  if (!children || !children.length) {
    return [];
  }

  var sortedMarks = children.map(sortMarksByOccurences);
  var rootNode = { _type: 'span', children: [] };
  var nodeStack = [rootNode];

  children.forEach(function (span, i) {
    var marksNeeded = sortedMarks[i];
    if (!marksNeeded) {
      var lastNode = nodeStack[nodeStack.length - 1];
      lastNode.children.push(span);
      return;
    }

    var pos = 1;

    // Start at position one. Root is always plain and should never be removed. (?)
    if (nodeStack.length > 1) {
      for (pos; pos < nodeStack.length; pos++) {
        var mark = nodeStack[pos].markKey;
        var index = marksNeeded.indexOf(mark);
        // eslint-disable-next-line max-depth
        if (index === -1) {
          break;
        }

        marksNeeded.splice(index, 1);
      }
    }

    // Keep from beginning to first miss
    nodeStack = nodeStack.slice(0, pos);

    // Add needed nodes
    var currentNode = findLastParentNode(nodeStack);
    marksNeeded.forEach(function (mark) {
      var node = {
        _type: 'span',
        _key: span._key,
        children: [],
        mark: markDefs.find(function (def) {
          return def._key === mark;
        }) || mark,
        markKey: mark
      };

      currentNode.children.push(node);
      nodeStack.push(node);
      currentNode = node;
    });

    // Split at newlines to make individual line chunks, but keep newline
    // characters as individual elements in the array. We use these characters
    // in the span serializer to trigger hard-break rendering
    if (isTextSpan(span)) {
      var lines = span.text.split('\n');
      for (var line = lines.length; line-- > 1;) {
        lines.splice(line, 0, '\n');
      }

      currentNode.children = currentNode.children.concat(lines);
    } else {
      currentNode.children = currentNode.children.concat(span);
    }
  });

  return rootNode.children;
};

// We want to sort all the marks of all the spans in the following order:
// 1. Marks that are shared amongst the most adjacent siblings
// 2. Non-default marks (links, custom metadata)
// 3. Built-in, plain marks (bold, emphasis, code etc)
function sortMarksByOccurences(span, i, spans) {
  if (!span.marks || span.marks.length === 0) {
    return span.marks || [];
  }

  var markOccurences = span.marks.reduce(function (occurences, mark) {
    occurences[mark] = occurences[mark] ? occurences[mark] + 1 : 1;

    for (var siblingIndex = i + 1; siblingIndex < spans.length; siblingIndex++) {
      var sibling = spans[siblingIndex];

      if (sibling.marks && Array.isArray(sibling.marks) && sibling.marks.indexOf(mark) !== -1) {
        occurences[mark]++;
      } else {
        break;
      }
    }

    return occurences;
  }, {});

  var sortByOccurence = sortMarks.bind(null, markOccurences);

  // Slicing because sort() mutates the input
  return span.marks.slice().sort(sortByOccurence);
}

function sortMarks(occurences, markA, markB) {
  var aOccurences = occurences[markA] || 0;
  var bOccurences = occurences[markB] || 0;

  if (aOccurences !== bOccurences) {
    return bOccurences - aOccurences;
  }

  var aDefaultPos = defaultMarks.indexOf(markA);
  var bDefaultPos = defaultMarks.indexOf(markB);

  // Sort default marks last
  if (aDefaultPos !== bDefaultPos) {
    return aDefaultPos - bDefaultPos;
  }

  // Sort other marks simply by key
  if (markA < markB) {
    return -1;
  } else if (markA > markB) {
    return 1;
  }

  return 0;
}

function isTextSpan(node) {
  return node._type === 'span' && typeof node.text === 'string' && (Array.isArray(node.marks) || typeof node.marks === 'undefined');
}

function findLastParentNode(nodes) {
  for (var i = nodes.length - 1; i >= 0; i--) {
    var node = nodes[i];
    if (node._type === 'span' && node.children) {
      return node;
    }
  }

  return undefined;
}

module.exports = buildMarksTree;

},{}],"node_modules/@sanity/block-content-to-hyperscript/lib/nestLists.js":[function(require,module,exports) {
'use strict';

var objectAssign = require('object-assign');

/* eslint-disable max-depth, complexity */
function nestLists(blocks) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'html';

  var tree = [];
  var currentList = void 0;

  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i];
    if (!isListBlock(block)) {
      tree.push(block);
      currentList = null;
      continue;
    }

    // Start of a new list?
    if (!currentList) {
      currentList = listFromBlock(block);
      tree.push(currentList);
      continue;
    }

    // New list item within same list?
    if (blockMatchesList(block, currentList)) {
      currentList.children.push(block);
      continue;
    }

    // Different list props, are we going deeper?
    if (block.level > currentList.level) {
      var newList = listFromBlock(block);

      if (mode === 'html') {
        // Because HTML is kinda weird, nested lists needs to be nested within list items
        // So while you would think that we could populate the parent list with a new sub-list,
        // We actually have to target the last list element (child) of the parent.
        // However, at this point we need to be very careful - simply pushing to the list of children
        // will mutate the input, and we don't want to blindly clone the entire tree.

        // Clone the last child while adding our new list as the last child of it
        var lastListItem = lastChild(currentList);
        var newLastChild = objectAssign({}, lastListItem, {
          children: lastListItem.children.concat(newList)
        });

        // Swap the last child
        currentList.children[currentList.children.length - 1] = newLastChild;
      } else {
        currentList.children.push(newList);
      }

      // Set the newly created, deeper list as the current
      currentList = newList;
      continue;
    }

    // Different list props, are we going back up the tree?
    if (block.level < currentList.level) {
      // Current list has ended, and we need to hook up with a parent of the same level and type
      var match = findListMatching(tree[tree.length - 1], block);
      if (match) {
        currentList = match;
        currentList.children.push(block);
        continue;
      }

      // Similar parent can't be found, assume new list
      currentList = listFromBlock(block);
      tree.push(currentList);
      continue;
    }

    // Different list props, different list style?
    if (block.listItem !== currentList.listItem) {
      var _match = findListMatching(tree[tree.length - 1], { level: block.level });
      if (_match && _match.listItem === block.listItem) {
        currentList = _match;
        currentList.children.push(block);
        continue;
      } else {
        currentList = listFromBlock(block);
        tree.push(currentList);
        continue;
      }
    }

    // eslint-disable-next-line no-console
    console.warn('Unknown state encountered for block', block);
    tree.push(block);
  }

  return tree;
}

function isListBlock(block) {
  return Boolean(block.listItem);
}

function blockMatchesList(block, list) {
  return block.level === list.level && block.listItem === list.listItem;
}

function listFromBlock(block) {
  return {
    _type: 'list',
    _key: block._key + '-parent',
    level: block.level,
    listItem: block.listItem,
    children: [block]
  };
}

function lastChild(block) {
  return block.children && block.children[block.children.length - 1];
}

function findListMatching(rootNode, matching) {
  var filterOnType = typeof matching.listItem === 'string';
  if (rootNode._type === 'list' && rootNode.level === matching.level && filterOnType && rootNode.listItem === matching.listItem) {
    return rootNode;
  }

  var node = lastChild(rootNode);
  if (!node) {
    return false;
  }

  return findListMatching(node, matching);
}

module.exports = nestLists;

},{"object-assign":"node_modules/object-assign/index.js"}],"node_modules/@sanity/block-content-to-hyperscript/lib/generateKeys.js":[function(require,module,exports) {
'use strict';

var objectAssign = require('object-assign');

module.exports = function (blocks) {
  return blocks.map(function (block) {
    if (block._key) {
      return block;
    }

    return objectAssign({ _key: getStaticKey(block) }, block);
  });
};

function getStaticKey(item) {
  return checksum(JSON.stringify(item)).toString(36).replace(/[^A-Za-z0-9]/g, '');
}

/* eslint-disable no-bitwise */
function checksum(str) {
  var hash = 0;
  var strlen = str.length;
  if (strlen === 0) {
    return hash;
  }

  for (var i = 0; i < strlen; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash &= hash; // Convert to 32bit integer
  }

  return hash;
}
/* eslint-enable no-bitwise */

},{"object-assign":"node_modules/object-assign/index.js"}],"node_modules/@sanity/block-content-to-hyperscript/lib/mergeSerializers.js":[function(require,module,exports) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var objectAssign = require('object-assign');
var isDefined = function isDefined(val) {
  return typeof val !== 'undefined';
};

// Recursively merge/replace default serializers with user-specified serializers
module.exports = function mergeSerializers(defaultSerializers, userSerializers) {
  return Object.keys(defaultSerializers).reduce(function (acc, key) {
    var type = _typeof(defaultSerializers[key]);
    if (type === 'function') {
      acc[key] = isDefined(userSerializers[key]) ? userSerializers[key] : defaultSerializers[key];
    } else if (type === 'object') {
      acc[key] = objectAssign({}, defaultSerializers[key], userSerializers[key]);
    } else {
      acc[key] = typeof userSerializers[key] === 'undefined' ? defaultSerializers[key] : userSerializers[key];
    }
    return acc;
  }, {});
};

},{"object-assign":"node_modules/object-assign/index.js"}],"node_modules/@sanity/block-content-to-hyperscript/lib/blocksToNodes.js":[function(require,module,exports) {
'use strict';

var objectAssign = require('object-assign');
var buildMarksTree = require('./buildMarksTree');
var nestLists = require('./nestLists');
var generateKeys = require('./generateKeys');
var mergeSerializers = require('./mergeSerializers');

// Properties to extract from props and pass to serializers as options
var optionProps = ['projectId', 'dataset', 'imageOptions'];
var isDefined = function isDefined(val) {
  return typeof val !== 'undefined';
};
var defaults = { imageOptions: {} };

function blocksToNodes(h, properties, defaultSerializers, serializeSpan) {
  var props = objectAssign({}, defaults, properties);
  var rawBlocks = Array.isArray(props.blocks) ? props.blocks : [props.blocks];
  var keyedBlocks = generateKeys(rawBlocks);
  var blocks = nestLists(keyedBlocks, props.listNestMode);
  var serializers = mergeSerializers(defaultSerializers, props.serializers || {});

  var options = optionProps.reduce(function (opts, key) {
    var value = props[key];
    if (isDefined(value)) {
      opts[key] = value;
    }
    return opts;
  }, {});

  function serializeNode(node, index, siblings, isInline) {
    if (isList(node)) {
      return serializeList(node);
    }

    if (isListItem(node)) {
      return serializeListItem(node, findListItemIndex(node, siblings));
    }

    if (isSpan(node)) {
      return serializeSpan(node, serializers, index, { serializeNode: serializeNode });
    }

    return serializeBlock(node, index, isInline);
  }

  function findListItemIndex(node, siblings) {
    var index = 0;
    for (var i = 0; i < siblings.length; i++) {
      if (siblings[i] === node) {
        return index;
      }

      if (!isListItem(siblings[i])) {
        continue;
      }

      index++;
    }

    return index;
  }

  function serializeBlock(block, index, isInline) {
    var tree = buildMarksTree(block);
    var children = tree.map(function (node, i, siblings) {
      return serializeNode(node, i, siblings, true);
    });
    var blockProps = {
      key: block._key || 'block-' + index,
      node: block,
      isInline: isInline,
      serializers: serializers,
      options: options
    };

    return h(serializers.block, blockProps, children);
  }

  function serializeListItem(block, index) {
    var key = block._key;
    var tree = buildMarksTree(block);
    var children = tree.map(serializeNode);
    return h(serializers.listItem, { node: block, serializers: serializers, index: index, key: key, options: options }, children);
  }

  function serializeList(list) {
    var type = list.listItem;
    var level = list.level;
    var key = list._key;
    var children = list.children.map(serializeNode);
    return h(serializers.list, { key: key, level: level, type: type, options: options }, children);
  }

  // Default to false, so `undefined` will evaluate to the default here
  var renderContainerOnSingleChild = Boolean(props.renderContainerOnSingleChild);

  var nodes = blocks.map(serializeNode);
  if (renderContainerOnSingleChild || nodes.length > 1) {
    var containerProps = props.className ? { className: props.className } : {};
    return h(serializers.container, containerProps, nodes);
  }

  if (nodes[0]) {
    return nodes[0];
  }

  return typeof serializers.empty === 'function' ? h(serializers.empty) : serializers.empty;
}

function isList(block) {
  return block._type === 'list' && block.listItem;
}

function isListItem(block) {
  return block._type === 'block' && block.listItem;
}

function isSpan(block) {
  return typeof block === 'string' || block.marks || block._type === 'span';
}

module.exports = blocksToNodes;

},{"object-assign":"node_modules/object-assign/index.js","./buildMarksTree":"node_modules/@sanity/block-content-to-hyperscript/lib/buildMarksTree.js","./nestLists":"node_modules/@sanity/block-content-to-hyperscript/lib/nestLists.js","./generateKeys":"node_modules/@sanity/block-content-to-hyperscript/lib/generateKeys.js","./mergeSerializers":"node_modules/@sanity/block-content-to-hyperscript/lib/mergeSerializers.js"}],"node_modules/@sanity/block-content-to-hyperscript/lib/serializers.js":[function(require,module,exports) {
'use strict';

var objectAssign = require('object-assign');
var getImageUrl = require('./getImageUrl');

module.exports = function (h, serializerOpts) {
  var serializeOptions = serializerOpts || { useDashedStyles: false

    // Low-level block serializer
  };function BlockSerializer(props) {
    var node = props.node,
        serializers = props.serializers,
        options = props.options,
        isInline = props.isInline,
        children = props.children;

    var blockType = node._type;
    var serializer = serializers.types[blockType];
    if (!serializer) {
      throw new Error('Unknown block type "' + blockType + '", please specify a serializer for it in the `serializers.types` prop');
    }

    return h(serializer, { node: node, options: options, isInline: isInline }, children);
  }

  // Low-level span serializer
  function SpanSerializer(props) {
    var _props$node = props.node,
        mark = _props$node.mark,
        children = _props$node.children;

    var isPlain = typeof mark === 'string';
    var markType = isPlain ? mark : mark._type;
    var serializer = props.serializers.marks[markType];
    if (!serializer) {
      // @todo Revert back to throwing errors?
      // eslint-disable-next-line no-console
      console.warn('Unknown mark type "' + markType + '", please specify a serializer for it in the `serializers.marks` prop');
      return h(props.serializers.markFallback, null, children);
    }

    return h(serializer, props.node, children);
  }

  // Low-level list serializer
  function ListSerializer(props) {
    var tag = props.type === 'bullet' ? 'ul' : 'ol';
    return h(tag, null, props.children);
  }

  // Low-level list item serializer
  function ListItemSerializer(props) {
    var children = !props.node.style || props.node.style === 'normal' ? // Don't wrap plain text in paragraphs inside of a list item
    props.children : // But wrap any other style in whatever the block serializer says to use
    h(props.serializers.types.block, props, props.children);

    return h('li', null, children);
  }

  // Renderer of an actual block of type `block`. Confusing, we know.
  function BlockTypeSerializer(props) {
    var style = props.node.style || 'normal';

    if (/^h\d/.test(style)) {
      return h(style, null, props.children);
    }

    return style === 'blockquote' ? h('blockquote', null, props.children) : h('p', null, props.children);
  }

  // Serializers for things that can be directly attributed to a tag without any props
  // We use partial application to do this, passing the tag name as the first argument
  function RawMarkSerializer(tag, props) {
    return h(tag, null, props.children);
  }

  function UnderlineSerializer(props) {
    var style = serializeOptions.useDashedStyles ? { 'text-decoration': 'underline' } : { textDecoration: 'underline' };

    return h('span', { style: style }, props.children);
  }

  function StrikeThroughSerializer(props) {
    return h('del', null, props.children);
  }

  function LinkSerializer(props) {
    return h('a', { href: props.mark.href }, props.children);
  }

  function ImageSerializer(props) {
    if (!props.node.asset) {
      return null;
    }

    var img = h('img', { src: getImageUrl(props) });
    return props.isInline ? img : h('figure', null, img);
  }

  // Serializer that recursively calls itself, producing a hyperscript tree of spans
  function serializeSpan(span, serializers, index, options) {
    if (span === '\n' && serializers.hardBreak) {
      return h(serializers.hardBreak, { key: 'hb-' + index });
    }

    if (typeof span === 'string') {
      return serializers.text ? h(serializers.text, { key: 'text-' + index }, span) : span;
    }

    var children = void 0;
    if (span.children) {
      children = {
        children: span.children.map(function (child, i) {
          return options.serializeNode(child, i, span.children, true);
        })
      };
    }

    var serializedNode = objectAssign({}, span, children);

    return h(serializers.span, {
      key: span._key || 'span-' + index,
      node: serializedNode,
      serializers: serializers
    });
  }

  var HardBreakSerializer = function HardBreakSerializer() {
    return h('br');
  };
  var defaultMarkSerializers = {
    strong: RawMarkSerializer.bind(null, 'strong'),
    em: RawMarkSerializer.bind(null, 'em'),
    code: RawMarkSerializer.bind(null, 'code'),
    underline: UnderlineSerializer,
    'strike-through': StrikeThroughSerializer,
    link: LinkSerializer
  };

  var defaultSerializers = {
    // Common overrides
    types: {
      block: BlockTypeSerializer,
      image: ImageSerializer
    },
    marks: defaultMarkSerializers,

    // Less common overrides
    list: ListSerializer,
    listItem: ListItemSerializer,

    block: BlockSerializer,
    span: SpanSerializer,
    hardBreak: HardBreakSerializer,

    // Container element
    container: 'div',

    // When we can't resolve the mark properly, use this renderer as the container
    markFallback: 'span',

    // Allow overriding text renderer, but leave undefined to just use plain strings by default
    text: undefined,

    // Empty nodes (React uses null, hyperscript with empty strings)
    empty: ''
  };

  return {
    defaultSerializers: defaultSerializers,
    serializeSpan: serializeSpan
  };
};

},{"object-assign":"node_modules/object-assign/index.js","./getImageUrl":"node_modules/@sanity/block-content-to-hyperscript/lib/getImageUrl.js"}],"node_modules/@sanity/block-content-to-hyperscript/lib/index.js":[function(require,module,exports) {
'use strict';

var hyperscript = require('hyperscript');
var objectAssign = require('object-assign');
var getImageUrl = require('./getImageUrl');
var blocksToNodes = require('./blocksToNodes');
var getSerializers = require('./serializers');

var renderNode = function renderNode(serializer, properties, children) {
  var props = properties || {};
  if (typeof serializer === 'function') {
    return serializer(objectAssign({}, props, { children: children }));
  }

  var tag = serializer;
  var childNodes = props.children || children;
  return hyperscript(tag, props, childNodes);
};

var _getSerializers = getSerializers(renderNode, { useDashedStyles: true }),
    defaultSerializers = _getSerializers.defaultSerializers,
    serializeSpan = _getSerializers.serializeSpan;

var blockContentToHyperscript = function blockContentToHyperscript(options) {
  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan);
};

// Expose default serializers to the user
blockContentToHyperscript.defaultSerializers = defaultSerializers;

// Expose logic for building image URLs from an image reference/node
blockContentToHyperscript.getImageUrl = getImageUrl;

// Expose node renderer
blockContentToHyperscript.renderNode = renderNode;

module.exports = blockContentToHyperscript;

},{"hyperscript":"node_modules/hyperscript/index.js","object-assign":"node_modules/object-assign/index.js","./getImageUrl":"node_modules/@sanity/block-content-to-hyperscript/lib/getImageUrl.js","./blocksToNodes":"node_modules/@sanity/block-content-to-hyperscript/lib/blocksToNodes.js","./serializers":"node_modules/@sanity/block-content-to-hyperscript/lib/serializers.js"}],"node_modules/@sanity/block-content-to-html/lib/blocksToHtml.js":[function(require,module,exports) {
'use strict';

var blocksToHyperScript = require('@sanity/block-content-to-hyperscript');

var h = blocksToHyperScript.renderNode;
var blocksToHtml = function blocksToHtml(options) {
  var rootNode = blocksToHyperScript(options);
  return rootNode.outerHTML || rootNode;
};

blocksToHtml.defaultSerializers = blocksToHyperScript.defaultSerializers;
blocksToHtml.getImageUrl = blocksToHyperScript.getImageUrl;
blocksToHtml.renderNode = h;
blocksToHtml.h = h;

module.exports = blocksToHtml;

},{"@sanity/block-content-to-hyperscript":"node_modules/@sanity/block-content-to-hyperscript/lib/index.js"}],"projects.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var GLOBALS = {
  favorites: [],
  savedProjects: []
};
var ProjectHandler = {
  saveProjects: function saveProjects(name) {
    var stringified = JSON.stringify(GLOBALS.savedProjects);
    window.localStorage.setItem('method-cards-projects', stringified);
  },
  getProjectsFromStorage: function getProjectsFromStorage() {
    var projects = window.localStorage.getItem('method-cards-projects');
    GLOBALS.savedProjects = JSON.parse(projects);
    return JSON.parse(projects);
  },
  getGLOBALS: function getGLOBALS() {
    return GLOBALS;
  },
  addAsFavorite: function addAsFavorite(id) {
    if (GLOBALS.favorites.indexOf(id) >= 0) {
      return 'Card already added to project';
    }

    GLOBALS.favorites.push(id);
    return 'Added card to project';
  },
  removeFavorite: function removeFavorite(title, id) {
    GLOBALS.favorites = GLOBALS.favorites.filter(function (item) {
      return item !== id;
    });
    return "Removed ".concat(title, " from project");
  },
  saveFavoritesAsProject: function saveFavoritesAsProject(projectName) {
    var tmpObj = {
      _id: "0".concat(GLOBALS.savedProjects.length),
      name: projectName,
      cards: GLOBALS.favorites
    };
    GLOBALS.savedProjects.push(tmpObj);
    ProjectHandler.saveProjects(tmpObj.name);
    return GLOBALS.savedProjects;
  },
  clearFavorites: function clearFavorites() {
    GLOBALS.favorites = [];
    return 'Cards cleared from working project';
  },
  deleteProject: function deleteProject() {// TODO
  },
  loadProject: function loadProject(title) {
    var result = GLOBALS.savedProjects.filter(function (i) {
      return i.name === title;
    });

    if (result.length <= 0) {
      return false;
    }

    GLOBALS.favorites = result[0].cards;
    return true;
  }
};
var _default = ProjectHandler;
exports.default = _default;
},{}],"main.js":[function(require,module,exports) {
"use strict";

var _blockContentToHtml = _interopRequireDefault(require("@sanity/block-content-to-html"));

var _projects = _interopRequireDefault(require("./projects.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SANITY_PROJECT_ID = 'r1vilzq1';
// SERVER COMMUNICATION -------------------------------------------------------------
// Define the sanity communication module we call 'client'
var client = window.SanityClient({
  projectId: SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: true
}); // Fetch all documents of type method. "..." means get all content in the method object. The following stuff makes sure we also fetch referenced files to get the image urls

var query = "*[_type==\"method\"]{\n  ...,\n  \"imageUrl\": image.asset->url,\n  \"phase\": phase->phaseTitle\n}";
client.fetch(query) // Talk to server: request data based on query
.then(renderPageContent) // Send received data into renderCards function
.catch(function () {
  console.log("Error!");
}); // ...but if data fetch fails, do this

var GLOBALS = {
  cards: [],
  phases: ['All'],
  activePhaseFilter: 'All'
};

function renderPageContent(cardsData) {
  createGlobals(cardsData);
  renderFilter();
  renderCards(cardsData);
  renderDetailsPages(cardsData);
  renderSavedProjectsDropdown(_projects.default.getProjectsFromStorage());
  addSaveProjectButton();
  addClearProjectButton();
} // END of SERVER COMMUNICATION ---------------------------------------------------------
// Some setup


function createGlobals(cardsData) {
  GLOBALS.cards = cardsData;
  GLOBALS.cards.map(function (card) {
    if (GLOBALS.phases.indexOf(card.phase) < 0) {
      GLOBALS.phases.push(card.phase);
    }
  });
} // PAGE RENDERING ----------------------------------------------------------------------


function renderFavorites() {
  var projectElement = document.getElementById('favorites'); // Get favoritted cards from all cards

  var favorites = _projects.default.getGLOBALS().favorites;

  var addedCards = GLOBALS.cards.filter(function (card) {
    return favorites.includes(card._id);
  }); // Remove elements from html

  while (projectElement.firstChild) {
    projectElement.removeChild(projectElement.firstChild);
  } // Create elements


  addedCards.map(function (card) {
    var item = document.createElement('li');
    item.innerHTML = card.title;
    item.dataset['id'] = card._id;
    var itemRemove = document.createElement('i');
    item.append(itemRemove);
    itemRemove.innerHTML = "\u24B3";
    itemRemove.addEventListener('click', function () {
      _projects.default.removeFavorite(card.title, card._id);

      renderFavorites();
    });
    projectElement.append(item);
  });
}

function addSaveProjectButton() {
  var button = document.getElementById('saveProject');
  button.addEventListener('mousedown', function () {
    var name = null;

    if (_projects.default.getGLOBALS().favorites.length > 0) {
      name = prompt('Enter project name');
    } else {
      showUserMessage('No cards added to project', 'warning');
      return;
    }

    if (name !== null && name.length > 0) {
      renderSavedProjectsDropdown(_projects.default.saveFavoritesAsProject(name));
    } else {
      showUserMessage('Project needs a name, try again', 'warning');
    }
  }, false);
}

function addClearProjectButton() {
  var button = document.getElementById('clearProject');
  button.addEventListener('mousedown', function () {
    _projects.default.clearFavorites();

    renderFavorites();
  });
}

var projectTemplate = function projectTemplate(props) {
  return "\n    <option data-title=\"".concat(props, "\">\n      ").concat(props, "\n    </option>\n  ");
};

function renderSavedProjectsDropdown(savedProjects) {
  var container = document.getElementById('projects'); // Remove elements from html

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  var projectsSelect = document.createElement('select');
  projectsSelect.classList.add('project-container');
  var emptyOption = document.createElement('option');
  emptyOption.classList.add('project-button');
  emptyOption.innerHTML = projectTemplate('Projects');
  projectsSelect.append(emptyOption);
  savedProjects.map(function (project) {
    var option = document.createElement('option');
    option.classList.add('project-button');
    option.setAttribute('value', project.name);
    option.innerHTML = projectTemplate(project.name);
    projectsSelect.append(option);
  });
  projectsSelect.addEventListener('change', loadProject);
  document.getElementById('projects').append(projectsSelect);
}

function loadProject(event) {
  if (_projects.default.loadProject(event.target.value)) {
    renderFavorites();
  }
}

var filterTemplate = function filterTemplate(props) {
  return "\n    <option data-phase=\"".concat(props, "\">\n      ").concat(props, "\n    </option>\n  ");
};

function renderFilter() {
  var filter = document.createElement('select');
  filter.classList.add('filter-container');
  GLOBALS.phases.map(function (phase) {
    var option = document.createElement('option');
    option.classList.add('filter-button');
    option.setAttribute('value', phase);
    option.innerHTML = filterTemplate(phase);
    filter.append(option);
  });
  filter.addEventListener('change', setPhaseFilter);
  document.getElementById('filter').append(filter);
}

function setPhaseFilter(event) {
  if (event.target.value === GLOBALS.activePhaseFilter) return;
  GLOBALS.activePhaseFilter = event.target.value; // Remove cards before adding new

  var cardsContainer = document.getElementById('cards');

  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }

  if (GLOBALS.activePhaseFilter === 'All') {
    renderCards(GLOBALS.cards);
  } else {
    var filteredCards = GLOBALS.cards.filter(function (card) {
      return card.phase === GLOBALS.activePhaseFilter;
    });
    GLOBALS.filteredCards = filteredCards;
    renderCards(GLOBALS.filteredCards);
  }
}

var cardTemplate = function cardTemplate(props) {
  return "\n    <div class=card-text>\n      <span class=\"card-phase\">".concat(props.phase, "</span>\n      <h2 class=\"card-title\">").concat(props.title, "</h2>\n      <p class=\"card-subtext\">").concat(props.subtitle, "</p>\n    </div>\n\n    <div class=\"img-container\">\n      <img src=\"").concat(props.imageUrl, "?h=500\" class=\"card-image\">\n    </div>\n  ");
};

function renderCards(cardsData) {
  // Generate a container element to collect generated cards
  var cardList = document.createElement('div');
  cardList.classList.add("cards-container"); // Step through all entries in the 'data' array, generate html-elements and append to cardList container element

  cardsData.map(function (dataEntry, key) {
    var card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = cardTemplate(dataEntry);
    card.dataset['key'] = key;
    card.dataset['hash'] = dataEntry._id;
    var favBtn = document.createElement('button');
    favBtn.innerHTML = 'Add to project';
    favBtn.dataset['id'] = dataEntry._id;
    card.append(favBtn);
    cardList.append(card); // Handle clicks on cards

    card.addEventListener('click', function (event) {
      window.location.hash = dataEntry._id;
      document.body.style.overflow = 'hidden';
    });
    favBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      var result = _projects.default.addAsFavorite(event.target.dataset['id']);

      showUserMessage(result);
      renderFavorites();
    });
  }); // Add card container cardList to an element in the page

  document.getElementById('cards').append(cardList);
} // -- MESSAGES


function showUserMessage(message, level) {
  var container = document.getElementById('userMessage');
  var colorClass = level || 'neutral';
  container.classList.add('show');
  container.classList.add(colorClass);
  window.setTimeout(function () {
    container.innerHTML = message;
    window.setTimeout(function () {
      container.classList.remove('show');
      container.classList.remove(colorClass);
      container.innerHTML = '';
    }, 2000);
  }, 300);
}

window.addEventListener('keyup', function (event) {
  if (!window.location.hash) return false;
  var cardList = GLOBALS.activePhaseFilter !== 'All' ? GLOBALS.filteredCards : GLOBALS.cards;
  var currentId = window.location.hash.substr(1);
  var currentCard = document.querySelectorAll("[data-hash='".concat(currentId, "']"))[0];
  var currentKey = parseInt(currentCard.dataset['key']);
  var previous, next;

  if (currentKey === 0) {
    previous = cardList.length - 1;
    next = currentKey + 1;
  } else if (currentKey === cardList.length - 1) {
    previous = currentKey - 1;
    next = 0;
  } else {
    previous = currentKey - 1;
    next = currentKey + 1;
  }

  var _arr = Object.entries(window.methodDetailsPages);

  for (var _i = 0; _i < _arr.length; _i++) {
    var page = _arr[_i];
    page[1].hidden = true;
  }

  switch (event.which) {
    case 39:
      window.location.hash = cardList[next]._id; // Next card

      break;

    case 37:
      window.location.hash = cardList[previous]._id; // Previous card

      break;
  }
}); // Card details pages

var cardDetailsPageTemplate = function cardDetailsPageTemplate(props) {
  var description = (0, _blockContentToHtml.default)({
    blocks: props.description
  });
  var instruction = (0, _blockContentToHtml.default)({
    blocks: props.instruction
  }); // These elements are injected into a div.method-page in the renderDetailsPages() function

  return "\n    <div class=\"method-page-inner\">\n      <span>".concat(props.phase, "</span>\n      <h1>").concat(props.title, "</h1>\n      <p>").concat(props.subtitle, "</p>\n      <div>\n        <h2>When to use it</h2>\n        ").concat(description, "\n      </div>\n      <div>\n        <h2>How to use it</h2>\n        ").concat(instruction, "\n      </div>\n      <div class=\"img-container\">\n        <img src=\"").concat(props.imageUrl, "?h=500\" class=\"card-image\">\n      </div>\n    </div>\n  ");
}; // Function to handle card rendering


function renderDetailsPages(cardsData) {
  var pageContainer = document.getElementById('page-container');
  window.methodDetailsPages = {};
  cardsData.map(function (cardData) {
    var cardPage = document.createElement('div');
    cardPage.classList.add('method-page');
    cardPage.innerHTML = cardDetailsPageTemplate(cardData);
    cardPage.hidden = true;
    pageContainer.append(cardPage); // Add the card page to globally available object attached to window object

    window.methodDetailsPages[cardData._id] = cardPage;
  });
  pageContainer.hidden = true;
} // When deselecting a page, ie clicking outside of the modal, hide the overlay


document.getElementById('page-container').addEventListener('click', function (e) {
  document.body.style.overflow = 'auto';

  if (e.path[0].id == 'page-container') {
    document.getElementById('page-container').hidden = true;

    var _arr2 = Object.entries(window.methodDetailsPages);

    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
      var page = _arr2[_i2];
      page[1].hidden = true;
    }

    history.replaceState(null, null, ' ');
  }
}); // Show the proper page when url changes (this is what makes tha modal appear)

window.addEventListener('hashchange', function () {
  document.getElementById('page-container').hidden = false;
  var pageId = window.location.hash.substring(1);
  window.methodDetailsPages[pageId].hidden = false;
}); // END of PAGE RENDERING -----------------------------------------------------------------
},{"@sanity/block-content-to-html":"node_modules/@sanity/block-content-to-html/lib/blocksToHtml.js","./projects.js":"projects.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50903" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map