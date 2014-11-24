// Generated by CoffeeScript 1.8.0
(function() {
  "use strict";
  var Browser, Css, Keyframes, Strings, Style, Units, Words, Xs, flexArgs, prettify, _,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof window !== "undefined" && window !== null) {
    Xs = window.Xs;
  } else if (typeof module !== "undefined" && module !== null) {
    Xs = require('xs.js');
  }

  Words = Xs.Words;

  Strings = Xs.Strings;

  _ = Xs.Types;

  flexArgs = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length < 2) {
      if (_.isString(args[0])) {
        args = Strings.split(args.join(' '));
      } else if (_.isArray(args[0])) {
        args = args[0];
      }
    }
    return args;
  };

  prettify = function(string) {
    var align, char, index, key, pretty, tabs, _i, _len;
    tabs = function() {
      return Strings.times('\t', tabs.count);
    };
    tabs.count = 0;
    align = function(key) {
      var adjust;
      if (Strings.hasUpper(key)) {
        adjust = 1;
      } else {
        adjust = 0;
      }
      return Strings.times(' ', prettify.valuePosition - adjust - key.length);
    };
    pretty = '';
    key = '';
    for (index = _i = 0, _len = string.length; _i < _len; index = ++_i) {
      char = string[index];
      switch (char) {
        case '{':
          tabs.count++;
          pretty += '{\n' + tabs();
          key = '';
          break;
        case '}':
          tabs.count--;
          pretty += '\n' + tabs() + '}\n' + tabs();
          break;
        case ':':
          if (tabs.count > 0) {
            pretty += align(key);
          }
          pretty += char + ' ';
          break;
        case ';':
          if (string[index + 1] === '}') {
            pretty += char;
          } else {
            pretty += ';\n' + tabs();
          }
          key = '';
          break;
        default:
          pretty += char;
          key += char;
      }
    }
    return pretty;
  };

  prettify.valuePosition = 18;

  Browser = (function() {
    function Browser() {}

    Browser.prefixes = ['-webkit-', '-moz-', '-o-', '-ms-', ''];

    Browser.specific = [];

    Browser.each = function(callback, prefixes) {
      var family, index, _i, _len, _results;
      prefixes = flexArgs(prefixes);
      if (prefixes[0] === void 0) {
        prefixes = Browser.prefixes;
      }
      _results = [];
      for (index = _i = 0, _len = prefixes.length; _i < _len; index = ++_i) {
        family = prefixes[index];
        _results.push(callback(family, index));
      }
      return _results;
    };

    return Browser;

  })();

  Units = (function() {
    var remove, set;

    set = function(target, unit, keys) {
      var key, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        _results.push(target.unit[Strings.toCamel(key)] = unit);
      }
      return _results;
    };

    remove = function(target, keys) {
      var key, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        _results.push(delete target.unit[Strings.toCamel(key)]);
      }
      return _results;
    };

    Units.all = ['%', 'px', 'pt', 'em', 'pc', 'ex', 'deg', 'cm', 'mm', 'ms', 's', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'in', 'grad', 'rad', 'turn', 'Hz', 'kHz', 'dpi', 'dpcm', 'dppx'];

    Units.unit = {};

    Units.hasUnit = function(value) {
      var index, toFind, unit, _i, _len, _ref;
      _ref = Units.all;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        unit = _ref[index];
        toFind = new RegExp('^[0-9]+' + unit + '$');
        if (toFind.exec(value)) {
          return Units.all[index];
        }
      }
      return false;
    };

    Units.strip = function(value) {
      var unit;
      if (unit = Units.hasUnit(value)) {
        return Strings.remove(value, unit);
      }
      return value;
    };

    Units.set = function() {
      var keys, unit;
      unit = arguments[0], keys = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      set(Units, unit, flexArgs.apply(this, keys));
      return Units;
    };

    Units.remove = function() {
      var keys;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      remove(Units, flexArgs.apply(this, keys));
      return Units;
    };

    function Units() {
      this.unit = {};
    }

    Units.prototype.get = function() {
      var key, target, targets, unit, value, _i, _len;
      key = arguments[0], value = arguments[1], targets = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (!Units.hasUnit(value)) {
        if (unit = this.unit[Strings.toCamel(key)]) {
          return unit;
        }
        targets.push(Units);
        for (_i = 0, _len = targets.length; _i < _len; _i++) {
          target = targets[_i];
          if ('' !== (unit = _.forceString(target.unit[Strings.toCamel(key)]))) {
            return unit;
          }
        }
      }
      return '';
    };

    Units.prototype.set = function() {
      var keys, unit;
      unit = arguments[0], keys = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      set(this, unit, flexArgs.apply(this, keys));
      return this;
    };

    Units.prototype.remove = function() {
      var keys;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      remove(this, flexArgs.apply(this, keys));
      return this;
    };

    return Units;

  })();

  Keyframes = (function() {
    function Keyframes(parent) {
      this.parent = parent;
      this.keyframes = {};
      this.units = new Units;
      this.unit = this.units.unit;
    }

    Keyframes.prototype.add = function(id, frames, overwrite) {
      var frame, pairs, pct;
      if (this.keyframes[id] && !overwrite) {
        return;
      }
      this.keyframes[id] = {};
      for (frame in frames) {
        pairs = frames[frame];
        frame = Strings.trim(frame);
        if (Strings.contains(frame, '%')) {
          pct = '';
        } else {
          pct = '%';
        }
        this.keyframes[id][frame + pct] = pairs;
      }
      return this;
    };

    Keyframes.prototype.remove = function(id) {
      delete this.keyframes[id];
      return this;
    };

    Keyframes.prototype.set = function(id, frames) {
      return this.add(id, frames, true);
    };

    Keyframes.prototype.get = function(id) {
      var frame, frames, key, keys, unit, value, _ref;
      if (!this.keyframes[id]) {
        return '';
      }
      frames = id + '{';
      _ref = this.keyframes[id];
      for (frame in _ref) {
        keys = _ref[frame];
        frames += frame + '{';
        for (key in keys) {
          value = keys[key];
          unit = this.units.get(key, value, this.parent.units);
          frames += key + ':' + value + unit + ';';
        }
        frames += '}';
      }
      return frames += '}';
    };

    Keyframes.prototype.get_ = function(id) {
      return prettify(this.get(id));
    };

    Keyframes.prototype.dump = function(prefixes) {
      var all, id, keys, _ref;
      all = '';
      _ref = this.keyframes;
      for (id in _ref) {
        keys = _ref[id];
        Browser.each((function(_this) {
          return function(browser) {
            return all += '@' + browser + 'keyframes ' + _this.get(id);
          };
        })(this), prefixes);
      }
      return all;
    };

    Keyframes.prototype.dump_ = function() {
      return prettify(this.dump);
    };

    return Keyframes;

  })();

  Style = (function() {
    Style.createSheet = function() {
      var element;
      element = document.createElement('style');
      element.appendChild(document.createTextNode(''));
      document.head.appendChild(element);
      return element;
    };

    Style.remove = function(selector) {
      var element;
      if (typeof window !== "undefined" && window !== null) {
        element = document.querySelector(selector);
        return element.remove();
      }
    };

    function Style(parent) {
      this.parent = parent;
      if (typeof window !== "undefined" && window !== null) {
        this.sheet = Style.createSheet();
      }
    }

    Style.prototype.setSheet = function(sheet) {
      this.sheet.innerHTML = _.forceString(sheet);
      return this;
    };

    Style.prototype.set = function(selector, value) {
      var dom, key, path;
      dom = (function(_this) {
        return function(selector, key, value) {
          var element;
          if (!selector) {
            return;
          }
          value += _this.parent.units.get(key, value);
          element = document.querySelector(selector);
          if (element) {
            return element.style[key] = value;
          }
        };
      })(this);
      if (typeof window !== "undefined" && window !== null) {
        if (_.isObject(value)) {
          return this.parent.xs(function(key, value, path) {
            path = new Words(path);
            if (path.startsWith(selector) && _.notObject(value)) {
              path = path.remove(-1).$;
              return dom(path, key, value);
            }
          });
        } else {
          path = new Words(selector);
          key = path.pop();
          return dom(path.$, key, value);
        }
      }
    };

    return Style;

  })();

  Css = (function(_super) {
    __extends(Css, _super);

    Css.Xs = Xs;

    Css.Words = Words;

    Css.Strings = Strings;

    Css.Types = _;

    Css.Units = Units;

    Css.unit = Units.unit;

    Css.Keyframes = Keyframes;

    Css.Browser = Browser;

    Css.valuePosition = prettify.valuePosition;

    function Css(path, value) {
      Css.__super__.constructor.call(this, path, value);
      this.style = new Style(this);
      this.stylesheet = this.style.sheet;
      this.keyframes = new Keyframes(this);
      this.units = new Units;
      this.unit = this.units.unit;
      this.prefixes = [];
      this.specific = [];
    }

    Css.prototype.keyVal = function(key, value) {
      var allBrowsers, dashKey, specific, unit;
      unit = this.units.get(key, value);
      dashKey = Strings.unCamel(key);
      allBrowsers = '';
      if (this.specific.length < 1) {
        specific = Browser.specific;
      } else {
        specific = this.specific;
      }
      if (__indexOf.call(specific, key) >= 0) {
        Browser.each(function(browser) {
          return allBrowsers += browser + dashKey + ':' + value + unit + ';';
        }, this.prefixes);
        return allBrowsers;
      } else {
        return dashKey + ':' + value + unit + ';';
      }
    };

    Css.prototype.remove = function(selector, domToo) {
      if (domToo == null) {
        domToo = true;
      }
      Css.__super__.remove.call(this, selector);
      if (domToo) {
        Style.remove(selector);
      }
      return this;
    };

    Css.prototype.add = function(selector, value, toDom) {
      Css.__super__.add.call(this, selector, value);
      if (toDom) {
        this.style.set(selector, value);
      }
      return this;
    };

    Css.prototype.set = function(selector, value, toDom) {
      if (toDom == null) {
        toDom = true;
      }
      Css.__super__.set.call(this, selector, value);
      if (toDom) {
        this.style.set(selector, value);
      }
      return this;
    };

    Css.prototype.get = function(path) {
      var value;
      if (_.isStringOrNumber(value = Css.__super__.get.call(this, path))) {
        return value;
      }
      return '';
    };

    Css.prototype.gets = function(path) {
      return _.forceString(Css.__super__.gets.call(this, Strings.toCamel(path)));
    };

    Css.prototype.getn = function(path, replacement) {
      if (replacement == null) {
        replacement = 0;
      }
      return _.forceNumber(this.get(path), replacement);
    };

    Css.prototype.getu = function(path) {
      var value;
      value = this.gets(path);
      return value + this.units.get(new Words(path).get(-1), value);
    };

    Css.prototype.getRule = function(selector) {
      var key, node, props, value;
      selector = Strings.oneSpaceAndTrim(selector);
      if (Xs.empty(node = this.geto(selector))) {
        return '';
      }
      props = '';
      for (key in node) {
        value = node[key];
        if (_.isStringOrNumber(value)) {
          props += this.keyVal(key, value);
        }
      }
      if (!props) {
        return '';
      }
      return selector + '{' + props + '}';
    };

    Css.prototype.getRule_ = function(selector) {
      return prettify(this.getRule(selector));
    };

    Css.prototype.getRules = function(selector) {
      var node, nodes, path, rules, _i, _len;
      selector = Strings.oneSpaceAndTrim(selector);
      nodes = this.list(selector);
      if (nodes.length < 1) {
        return '';
      }
      path = '';
      rules = '';
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        if (node.key === new Words(selector).get(-1)) {
          continue;
        }
        if (_.isStringOrNumber(node.value)) {
          node.path = new Words(node.path).remove(-1).$;
          node.path = Strings.xs(node.path, function(char, index) {
            if (!((node.path[index] === ' ') && (node.path[index + 1] === ':'))) {
              return char;
            }
          });
          if (node.path !== path) {
            if (rules !== '') {
              rules += '}';
            }
            path = node.path;
            rules += path + '{';
          }
          rules += this.keyVal(node.key, node.value);
        }
      }
      if (rules) {
        return rules + '}';
      }
      return '';
    };

    Css.prototype.getRules_ = function(selector) {
      return prettify(this.getRules(selector));
    };

    Css.prototype.dump = function(toDom) {
      var allRules, key, rootKeys, rules, _i, _len;
      allRules = this.keyframes.dump(this.prefixes);
      rootKeys = [];
      for (key in this.object) {
        rootKeys.push(key);
      }
      for (_i = 0, _len = rootKeys.length; _i < _len; _i++) {
        rules = rootKeys[_i];
        allRules += this.getRules(rules);
      }
      if (toDom) {
        this.style.setSheet(allRules);
      }
      return allRules;
    };

    Css.prototype.dump_ = function(toDom) {
      return prettify(this.dump(toDom));
    };

    return Css;

  })(Xs);

  Css.Xs = Xs;

  Css.Words = Xs.Words;

  Css.Strings = Xs.Strings;

  Css.Types = Xs.Types;

  if (typeof window !== "undefined" && window !== null) {
    window.Css = Css;
  } else if (typeof module !== "undefined" && module !== null) {
    module.exports = Css;
  }

}).call(this);