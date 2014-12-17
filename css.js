(function() {
  "use strict";
  var Browser, Css, Keyframes, LITERALS, Listeners, Strings, Style, TYPES, Tools, Types, Units, Words, Xs, breakIfEqual, createForce, instanceOf, prettify, testValues, typeOf, _,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  instanceOf = function(type, value) {
    return value instanceof type;
  };

  typeOf = function(value, type) {
    if (type == null) {
      type = 'object';
    }
    return typeof value === type;
  };

  LITERALS = {
    'Boolean': false,
    'String': '',
    'Object': {},
    'Array': [],
    'Function': function() {},
    'Number': (function() {
      var number;
      number = new Number;
      number["void"] = true;
      return number;
    })()
  };

  TYPES = {
    'Undefined': function(value) {
      return value === void 0;
    },
    'Null': function(value) {
      return value === null;
    },
    'Function': function(value) {
      return typeOf(value, 'function');
    },
    'Boolean': function(value) {
      return typeOf(value, 'boolean');
    },
    'String': function(value) {
      return typeOf(value, 'string');
    },
    'Array': function(value) {
      return typeOf(value) && instanceOf(Array, value);
    },
    'RegExp': function(value) {
      return typeOf(value) && instanceOf(RegExp, value);
    },
    'Date': function(value) {
      return typeOf(value) && instanceOf(Date, value);
    },
    'Number': function(value) {
      return typeOf(value, 'number') && (value === value) || (typeOf(value) && instanceOf(Number, value));
    },
    'Object': function(value) {
      return typeOf(value) && (value !== null) && !instanceOf(Boolean, value) && !instanceOf(Number, value) && !instanceOf(Array, value) && !instanceOf(RegExp, value) && !instanceOf(Date, value);
    },
    'NaN': function(value) {
      return typeOf(value, 'number') && (value !== value);
    },
    'Defined': function(value) {
      return value !== void 0;
    }
  };

  TYPES.StringOrNumber = function(value) {
    return TYPES.String(value) || TYPES.Number(value);
  };

  Types = _ = {
    parseIntBase: 10
  };

  createForce = function(type) {
    var convertType;
    convertType = function(value) {
      switch (type) {
        case 'Number':
          if ((_.isNumber(value = parseInt(value, _.parseIntBase))) && !value["void"]) {
            return value;
          }
          break;
        case 'String':
          if (_.isStringOrNumber(value)) {
            return value + '';
          }
          break;
        default:
          if (Types['is' + type](value)) {
            return value;
          }
      }
    };
    return function(value, replacement) {
      if ((value != null) && void 0 !== (value = convertType(value))) {
        return value;
      }
      if ((replacement != null) && void 0 !== (replacement = convertType(replacement))) {
        return replacement;
      }
      return LITERALS[type];
    };
  };

  testValues = function(predicate, breakState, values) {
    var value, _i, _len;
    if (values == null) {
      values = [];
    }
    if (values.length < 1) {
      return predicate === TYPES.Undefined;
    }
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      value = values[_i];
      if (predicate(value) === breakState) {
        return breakState;
      }
    }
    return !breakState;
  };

  breakIfEqual = true;

  (function() {
    var name, predicate, _results;
    _results = [];
    for (name in TYPES) {
      predicate = TYPES[name];
      _results.push((function(name, predicate) {
        Types['is' + name] = predicate;
        Types['not' + name] = function(value) {
          return !predicate(value);
        };
        Types['has' + name] = function() {
          return testValues(predicate, breakIfEqual, arguments);
        };
        Types['all' + name] = function() {
          return testValues(predicate, !breakIfEqual, arguments);
        };
        if (name in LITERALS) {
          return Types['force' + name] = createForce(name);
        }
      })(name, predicate));
    }
    return _results;
  })();

  Types.intoArray = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length < 2) {
      if (_.isString(args[0])) {
        args = args.join('').replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').split(' ');
      } else if (_.isArray(args[0])) {
        args = args[0];
      }
    }
    return args;
  };

  Types["typeof"] = function(value) {
    var name, predicate;
    for (name in TYPES) {
      predicate = TYPES[name];
      if (predicate(value) === true) {
        return name.toLowerCase();
      }
    }
  };

  Tools = (function() {
    function Tools() {}

    Tools.positiveIndex = function(index, max) {
      if (0 === (index = _.forceNumber(index, 0))) {
        return false;
      }
      max = Math.abs(_.forceNumber(max));
      if (Math.abs(index) <= max) {
        if (index > 0) {
          return index - 1;
        }
        return max + index;
      }
      return false;
    };

    Tools.noDupAndReverse = function(array) {
      var index, length, newArr, _i;
      length = array.length - 1;
      newArr = [];
      for (index = _i = length; length <= 0 ? _i <= 0 : _i >= 0; index = length <= 0 ? ++_i : --_i) {
        if (newArr[newArr.length - 1] !== array[index]) {
          newArr.push(array[index]);
        }
      }
      return newArr;
    };

    Tools.insertSort = function() {
      var array, current, index, length, prev, _i;
      array = _.intoArray.apply(this, arguments);
      if (array.length > 1) {
        length = array.length - 1;
        for (index = _i = 1; 1 <= length ? _i <= length : _i >= length; index = 1 <= length ? ++_i : --_i) {
          current = array[index];
          prev = index - 1;
          while ((prev >= 0) && (array[prev] > current)) {
            array[prev + 1] = array[prev];
            --prev;
          }
          array[+prev + 1] = current;
        }
      }
      return array;
    };

    return Tools;

  })();

  Strings = (function() {
    function Strings() {}

    Strings.create = function() {
      var arg, string, _i, _len;
      string = '';
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        string += _.forceString(arg);
      }
      return string;
    };

    Strings.find = function(string, toFind, flags) {
      var indices, result;
      indices = [];
      if ('' === (string = _.forceString(string))) {
        return indices;
      }
      flags = _.forceString(flags, 'g');
      if (_.isStringOrNumber(toFind)) {
        toFind = new RegExp(Strings.regEscape(toFind + ''), flags);
      } else if (_.isRegExp(toFind)) {
        toFind = new RegExp(toFind.source, flags);
      } else {
        return indices;
      }
      if (toFind.global) {
        while (result = toFind.exec(string)) {
          indices.push(result.index + 1);
        }
      } else {
        if (result = toFind.exec(string)) {
          indices.push(result.index + 1);
        }
      }
      return indices;
    };

    Strings.trim = function(string) {
      if (string == null) {
        string = '';
      }
      return (string + '').replace(/^\s+|\s+$/g, '');
    };

    Strings.oneSpace = function(string) {
      if (string == null) {
        string = '';
      }
      return (string + '').replace(/\s+/g, ' ');
    };

    Strings.oneSpaceAndTrim = function(string) {
      return Strings.oneSpace(Strings.trim(string));
    };

    Strings.split = function(string, delimiter) {
      var array, result, word, _i, _len;
      string = Strings.oneSpaceAndTrim(string);
      result = [];
      if (string.length < 1) {
        return result;
      }
      delimiter = _.forceString(delimiter, ' ');
      array = string.split(delimiter[0] || '');
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        word = array[_i];
        if (word.match(/^\s$/)) {
          continue;
        }
        result.push(Strings.trim(word));
      }
      return result;
    };

    Strings.xs = function(string, callback) {
      var index, length, response, result, _i;
      if (string == null) {
        string = '';
      }
      string = _.forceString(string);
      if (-1 === (length = string.length - 1)) {
        return '';
      }
      callback = _.forceFunction(callback, function(char) {
        return char;
      });
      result = '';
      for (index = _i = 0; 0 <= length ? _i <= length : _i >= length; index = 0 <= length ? ++_i : --_i) {
        if (response = callback(string[index], index)) {
          if (response === true) {
            result += string[index];
          } else if (_.isStringOrNumber(response)) {
            result += response;
          }
        }
      }
      return result;
    };

    Strings.times = function(string, amount) {
      var times;
      if ('' === (string = _.forceString(string))) {
        return '';
      }
      amount = _.forceNumber(amount, 1);
      times = '';
      while (amount-- > 0) {
        times += string;
      }
      return times;
    };

    Strings.hasUpper = function(string) {
      return /[A-Z]+/g.test(string);
    };

    Strings.REGEXP_SPECIAL_CHARS = ['?', '\\', '[', ']', '(', ')', '*', '+', '.', '/', '|', '^', '$', '<', '>', '-', '&'];

    Strings.regEscape = function(string) {
      if ('' === (string = _.forceString(string))) {
        return string;
      }
      return Strings.xs(string, function(char) {
        if (__indexOf.call(Strings.REGEXP_SPECIAL_CHARS, char) >= 0) {
          return '\\' + char;
        }
        return true;
      });
    };

    Strings.replace = function(string, toReplace, replacement, flags) {
      var _ref;
      if (string == null) {
        string = '';
      }
      if (toReplace == null) {
        toReplace = '';
      }
      if (replacement == null) {
        replacement = '';
      }
      if (flags == null) {
        flags = 'g';
      }
      if (!(_.isStringOrNumber(string) && ((_ref = _["typeof"](toReplace)) === 'string' || _ref === 'number' || _ref === 'regexp'))) {
        return _.forceString(string);
      }
      if (_.notRegExp(toReplace)) {
        toReplace = Strings.regEscape(toReplace + '');
        toReplace = new RegExp(toReplace, flags);
      }
      return (string + '').replace(toReplace, replacement);
    };

    Strings.toCamel = function(string, char) {
      var match;
      string = _.forceString(string);
      char = _.forceString(char, '-');
      match = new RegExp(Strings.regEscape(char) + '([a-z])', 'ig');
      return Strings.replace(string, match, function(all, found) {
        return found.toUpperCase();
      });
    };

    Strings.unCamel = function(string, insertion) {
      string = _.forceString(string);
      insertion = _.forceString(insertion, '-');
      return Strings.replace(string, /([A-Z])/g, insertion + '$1').toLowerCase();
    };

    Strings.remove = function() {
      var remove, string, toRemove, _i, _len;
      string = arguments[0], toRemove = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (string == null) {
        string = '';
      }
      if (('' === (string = _.forceString(string))) || (toRemove.length < 1)) {
        return string;
      }
      for (_i = 0, _len = toRemove.length; _i < _len; _i++) {
        remove = toRemove[_i];
        string = Strings.replace(string, remove);
      }
      return string;
    };

    Strings.count = function(string, toFind) {
      return Strings.find(string, toFind).length;
    };

    Strings.contains = function(string, substring) {
      return Strings.count(string, substring) > 0;
    };

    return Strings;

  })();

  Words = (function() {
    Words.delimiter = ' ';

    function Words() {
      this.set.apply(this, arguments);
    }

    Words.prototype.get = function() {
      var index, string, _i, _len;
      if (arguments.length < 1) {
        return this.words.join(Words.delimiter);
      }
      string = '';
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        index = arguments[_i];
        index = Tools.positiveIndex(index, this.count);
        if (index !== false) {
          string += this.words[index] + Words.delimiter;
        }
      }
      return Strings.trim(string);
    };

    Words.prototype.set = function() {
      var arg, args, str, _i, _j, _len, _len1, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.words = [];
      args = _.intoArray.apply(this, args);
      if (args.length < 1) {
        return this;
      }
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        _ref = Strings.split(Strings.create(arg), Words.delimiter);
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          str = _ref[_j];
          this.words.push(str);
        }
      }
      return this;
    };

    Words.prototype.xs = function(callback) {
      var index, response, result, word, _i, _len, _ref;
      if (callback == null) {
        callback = function() {
          return true;
        };
      }
      if (_.notFunction(callback) || this.count < 1) {
        return this;
      }
      result = [];
      _ref = this.words;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        word = _ref[index];
        if (response = callback(word, index)) {
          if (response === true) {
            result.push(word);
          } else if (_.isStringOrNumber(response)) {
            result.push(response + '');
          }
        }
      }
      this.words = result;
      return this;
    };

    Words.prototype.pop = function(amount) {
      var n, pop, popped, _i;
      amount = Math.abs(_.forceNumber(amount, 1));
      popped = '';
      for (n = _i = 1; 1 <= amount ? _i <= amount : _i >= amount; n = 1 <= amount ? ++_i : --_i) {
        pop = this.words.pop();
        if (pop !== void 0) {
          popped = pop + ' ' + popped;
        }
      }
      return popped.trim();
    };

    Words.prototype.startsWith = function(start) {
      var result;
      if ('' === (start = _.forceString(start))) {
        return false;
      }
      result = true;
      start = new Words(start);
      start.xs((function(_this) {
        return function(word, index) {
          if (word !== _this.words[index]) {
            return result = false;
          }
        };
      })(this));
      return result;
    };

    Words.prototype.remove = function() {
      var arg, args, index, _i, _j, _len, _len1;
      if (arguments.length < 1) {
        return this;
      }
      args = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        if (_.isString(arg)) {
          args.unshift(arg);
        } else if (_.isNumber(arg)) {
          args.push(Tools.positiveIndex(arg, this.count));
        }
      }
      args = Tools.noDupAndReverse(Tools.insertSort(args));
      for (index = _j = 0, _len1 = args.length; _j < _len1; index = ++_j) {
        arg = args[index];
        if (_.isNumber(arg)) {
          this.xs((function(_this) {
            return function(word, index) {
              if (index !== arg) {
                return true;
              }
            };
          })(this));
        } else if (_.isString(arg)) {
          this.xs(function(word) {
            if (word !== arg) {
              return true;
            }
          });
        }
      }
      return this;
    };

    return Words;

  })();

  Object.defineProperty(Words.prototype, '$', {
    get: function() {
      return this.get();
    }
  });

  Object.defineProperty(Words.prototype, 'count', {
    get: function() {
      return this.words.length;
    }
  });

  Xs = (function() {
    var emptyObject, extend, xs, xsPath;

    emptyObject = function(object) {
      var key;
      for (key in object) {
        if (object.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    };

    extend = function(target, source, append) {
      var key, value;
      if (target == null) {
        target = {};
      }
      for (key in source) {
        value = source[key];
        if (_.isObject(value)) {
          extend(target[key], value, append);
        } else {

        }
        if (!(append && target.hasOwnProperty(key))) {
          target[key] = value;
        }
      }
      return target;
    };

    xs = function(object, callback) {
      var path, result, traverse;
      callback = _.forceFunction(callback, function() {
        return true;
      });
      traverse = function(node) {
        var key, response, responseKey, value;
        for (key in node) {
          value = node[key];
          if (_.notObject(node)) {
            continue;
          }
          path.push(key);
          if (response = callback(key, value, path)) {
            if (_.isObject(response)) {
              if (response.remove === true) {
                delete node[key];
              } else {
                if (_.isDefined(response.value)) {
                  value = node[key] = response.value;
                  continue;
                }
                if (_.isDefined(response.key) && '' !== (responseKey = _.forceString(response.key))) {
                  if (!node.hasOwnProperty(responseKey)) {
                    node[responseKey] = value;
                    delete node[key];
                  }
                }
              }
            }
            result.push({
              key: key,
              value: value,
              path: path.join(' ')
            });
            if ((response != null ? response.stop : void 0) === true) {
              return;
            }
          }
          traverse(value);
          path.pop();
        }
      };
      result = [];
      path = [];
      traverse(object);
      return result;
    };

    xsPath = function(object, path, command) {
      var index, key, length, nodes, result, _i;
      nodes = Strings.oneSpaceAndTrim(_.forceString(path)).split(' ');
      if (nodes[0] === '') {
        return;
      }
      length = nodes.length - 2;
      if (length > -1) {
        for (index = _i = 0; 0 <= length ? _i <= length : _i >= length; index = 0 <= length ? ++_i : --_i) {
          if (void 0 === (object = object[nodes[index]])) {
            return;
          }
        }
      } else {
        index = 0;
      }
      key = nodes[index];
      if (_.isDefined(command) && object.hasOwnProperty(key)) {
        if (command.remove) {
          return delete object[key];
        }
        if (command.key && !object.hasOwnProperty(command.key)) {
          object[command.key] = object[key];
          delete object[key];
          key = command.key;
        }
        if (command.value && object.hasOwnProperty(key)) {
          object[key] = command.value;
        }
      }
      result = object[key];
      return result;
    };

    Xs.Types = Types;

    Xs.Tools = Tools;

    Xs.Strings = Strings;

    Xs.Words = Words;

    Xs.empty = function(object) {
      if (_.notObject(object) || object instanceof Number) {
        return false;
      }
      return emptyObject(object);
    };

    Xs.extend = function(target, source) {
      return extend(_.forceObject(target), _.forceObject(source));
    };

    Xs.append = function(target, source) {
      return extend(_.forceObject(target), _.forceObject(source), true);
    };

    Xs.add = function(object, path, value) {
      var index, node, target, valueIsObject, _i, _len, _ref;
      if (object == null) {
        object = {};
      }
      if (_.isObject(path)) {
        return extend(object, path, true);
      }
      path = new Words(path);
      valueIsObject = _.isObject(value);
      target = object;
      _ref = path.words;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        node = _ref[index];
        if (index < (path.count - 1) || valueIsObject) {
          if (target[node] == null) {
            target[node] = {};
          }
        }
        if (index < (path.count - 1)) {
          if (target.hasOwnProperty(node)) {
            target = target[node];
          }
        } else if (valueIsObject) {
          extend(target[node], value, true);
        } else {
          if (target[node] == null) {
            target[node] = value;
          }
        }
      }
      return object;
    };

    Xs.xs = function(object, callback) {
      if (_.notObject(object)) {
        return [];
      }
      return xs(object, callback);
    };

    Xs.copy = function(object) {
      var traverse;
      if (_.notObject(object)) {
        return {};
      }
      traverse = function(copy, node) {
        var key, value;
        for (key in node) {
          value = node[key];
          if (_.isObject(node)) {
            copy[key] = value;
          } else {
            traverse(value);
          }
        }
        return copy;
      };
      return traverse({}, object);
    };

    Xs.get = function(object, path, commands) {
      if (_.isObject(object)) {
        return xsPath(object, path, commands);
      }
      return '';
    };

    Xs.getn = function(object, path, replacement) {
      return _.forceNumber(Xs.get(object, path), replacement);
    };

    Xs.gets = function(object, path) {
      return _.forceString(Xs.get(object, path));
    };

    Xs.geta = function(object, path) {
      return _.forceArray(Xs.get(object, path));
    };

    Xs.geto = function(object, path) {
      return _.forceObject(Xs.get(object, path));
    };

    Xs.keys = function(object, path) {
      var key, keys;
      keys = [];
      if (_.isObject(path = Xs.get(object, path))) {
        for (key in path) {
          keys.push(key);
        }
      }
      return keys;
    };

    Xs.values = function(object, path) {
      var key, value, values;
      values = [];
      if (_.isObject(path = Xs.get(object, path))) {
        for (key in path) {
          value = path[key];
          values.push(value);
        }
      }
      return values;
    };

    function Xs(path, value) {
      this.object = {};
      if (path) {
        Xs.add(this.object, path, value);
      }
    }

    Xs.prototype.xs = function(callback) {
      return Xs.xs(this.object, callback);
    };

    Xs.prototype.empty = function() {
      return emptyObject(this.object);
    };

    Xs.prototype.copy = function() {
      return Xs.copy(this.object);
    };

    Xs.prototype.add = function(path, value) {
      return Xs.add(this.object, path, value);
    };

    Xs.prototype.remove = function(path) {
      return xsPath(this.object, path, {
        remove: true
      });
    };

    Xs.prototype.removeAll = function(query) {
      if ('' !== (query = Strings.trim(query))) {
        Xs.xs(this.object, function(key) {
          if (key === query) {
            return {
              remove: true
            };
          }
        });
      }
      return this;
    };

    Xs.prototype.set = function(nodePath, value) {
      var key, keys, _i, _len;
      if ('' === (nodePath = _.forceString(nodePath))) {
        return '';
      }
      if (value = xsPath(this.object, nodePath, {
        value: value
      })) {
        if (_.isObject(value)) {
          keys = new Xs(value).search();
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            this.triggerListener(nodePath + ' ' + key.path, value);
          }
        } else {
          this.triggerListener(nodePath, value);
        }
      }
      return value;
    };

    Xs.prototype.setAll = function(query, value) {
      var result, _i, _len, _ref;
      if ('' !== (query = Strings.trim(query))) {
        Xs.xs(this.object, function(key) {
          if (key === query) {
            return {
              value: value
            };
          }
        });
        _ref = this.search(query);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          result = _ref[_i];
          this.triggerListener(result.path, value);
        }
      }
      return this;
    };

    Xs.prototype.setKey = function(query, name) {
      return xsPath(this.object, query, {
        key: name
      });
    };

    Xs.prototype.setAllKeys = function(query, name) {
      if ('' !== (query = Strings.trim(query))) {
        Xs.xs(this.object, function(key) {
          if (key === query) {
            return {
              key: name
            };
          }
        });
      }
      return this;
    };

    Xs.prototype.search = function(query) {
      var predicate, result;
      if (_.isDefined(query)) {
        if ('' === (query = Strings.trim(query))) {
          return [];
        }
      }
      if (query) {
        predicate = function(key) {
          if (key === query) {
            return true;
          }
        };
      } else {
        predicate = function() {
          return true;
        };
      }
      result = this.xs(predicate);
      return result;
    };

    Xs.prototype.list = function(query) {
      var returnValue;
      if ('' === (query = Strings.oneSpaceAndTrim(query))) {
        return [];
      }
      if (query) {
        returnValue = function(path) {
          if (new Words(path.join(' ')).startsWith(query)) {
            return true;
          }
        };
      } else {
        returnValue = function() {
          return true;
        };
      }
      return this.xs(function(k, v, path) {
        return returnValue(path);
      });
    };

    Xs.prototype.get = function(path) {
      if (path === void 0) {
        return this.object;
      }
      return xsPath(this.object, path);
    };

    Xs.prototype.getn = function(path, replacement) {
      return Xs.getn(this.object, path, replacement);
    };

    Xs.prototype.gets = function(path) {
      return Xs.gets(this.object, path);
    };

    Xs.prototype.geta = function(path) {
      return Xs.geta(this.object, path);
    };

    Xs.prototype.geto = function(path) {
      return Xs.geto(this.object, path);
    };

    Xs.prototype.keys = function(path) {
      var key, keys;
      keys = [];
      if (_.isObject(path = xsPath(this.object, path))) {
        for (key in path) {
          keys.push(key);
        }
      }
      return keys;
    };

    Xs.prototype.values = function(path) {
      var key, value, values;
      values = [];
      if (_.isObject(path = xsPath(this.object, path))) {
        for (key in path) {
          value = path[key];
          values.push(value);
        }
      }
      return values;
    };

    Xs.prototype.paths = function(node) {
      var entry, paths, _i, _len, _ref;
      paths = [];
      _ref = this.search(node);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        paths.push(entry.path);
      }
      return paths;
    };

    Xs.prototype.addListener = function(path, callback) {
      if (!this.listeners) {
        this.listeners = new Listeners;
      }
      return this.listeners.add(path, callback);
    };

    Xs.prototype.triggerListener = function(path, data) {
      if (this.listeners) {
        this.listeners.trigger(path, data);
      }
      return this;
    };

    Xs.prototype.removeListener = function() {
      var path, paths, _i, _len;
      paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.listeners) {
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          this.listeners.remove(path);
        }
      }
      return this;
    };

    return Xs;

  })();

  Xs.prototype.ls = Xs.prototype.list;

  Xs.prototype.find = Xs.prototype.search;

  Listeners = (function() {
    Listeners.count = 0;

    Listeners.newName = function() {
      return '' + (++Listeners.count);
    };

    function Listeners(listeners) {
      this.listeners = listeners != null ? listeners : new Xs;
    }

    Listeners.prototype.add = function(path, callback) {
      var listener, name, obj, trigger;
      path = Strings.oneSpaceAndTrim(path);
      name = Listeners.newName();
      if (listener = this.listeners.get(path)) {
        listener[name] = callback;
      } else {
        obj = {};
        obj[name] = callback;
        this.listeners.add(path, obj);
      }
      trigger = this.listeners.get(path);
      return {
        trigger: function(data) {
          if (data == null) {
            data = '';
          }
          return typeof trigger[name] === "function" ? trigger[name](path, data) : void 0;
        },
        remove: function() {
          return delete trigger[name];
        }
      };
    };

    Listeners.prototype.trigger = function(path, data) {
      var callback, callbacks, k, listener, listeners, name, node, _i, _len, _ref;
      if (data == null) {
        data = '';
      }
      _ref = this.listeners.search('*');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        callbacks = node.value;
        if (new Words(path).startsWith(new Words(node.path).remove(-1).$)) {
          for (name in callbacks) {
            callback = callbacks[name];
            if (typeof callback === "function") {
              callback(path, data);
            }
          }
        }
      }
      listeners = this.listeners.get(Strings.oneSpaceAndTrim(path));
      for (k in listeners) {
        listener = listeners[k];
        if (typeof listener === "function") {
          listener(path, data);
        }
      }
      return this;
    };

    Listeners.prototype.remove = function(path) {
      this.listeners.remove(Strings.oneSpaceAndTrim(path));
      return this;
    };

    return Listeners;

  })();

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
            pretty += align(key) + char + ' ';
          } else {
            pretty += char;
          }
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
      prefixes = _.intoArray(prefixes);
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
      set(Units, unit, _.intoArray.apply(this, keys));
      return Units;
    };

    Units.remove = function() {
      var keys;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      remove(Units, _.intoArray.apply(this, keys));
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
      set(this, unit, _.intoArray.apply(this, keys));
      return this;
    };

    Units.prototype.remove = function() {
      var keys;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      remove(this, _.intoArray.apply(this, keys));
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

    Css.Types = Types;

    Css.Tools = Tools;

    Css.Strings = Strings;

    Css.Words = Words;

    Css.Xs = Xs;

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
      var node, nodes, path, rules, targetNode, _i, _len;
      selector = Strings.oneSpaceAndTrim(selector);
      nodes = this.list(selector);
      if (nodes.length < 1) {
        return '';
      }
      path = '';
      rules = '';
      targetNode = new Words(selector).get(-1);
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        if (node.key === targetNode) {
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
      if (toDom == null) {
        toDom = true;
      }
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

  if ((typeof define !== "undefined" && define !== null) && (typeof define === 'function') && define.amd) {
    define('css', [], function() {
      return Css;
    });
  } else if (typeof window !== "undefined" && window !== null) {
    window.Css = Css;
  } else if (typeof module !== "undefined" && module !== null) {
    module.exports = Css;
  }

}).call(this);
