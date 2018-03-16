/* i18nlet version 0.0.1 */
'use strict';

var VERSION = "0.0.1";

/*global VERSION*/

var debug = false;
var defaultLangage = 'en';
var langageSeparator = ':';
var variableKeyPrefix = '{{';
var variableKeySuffix = '}}';
var defaultNoConvertVariable = null;
/**
 * console output
 *
 * @param {String} type level
 * @param {*} args output messages
 */
var _output = function (type) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  args.unshift(("[" + (type.toUpperCase()) + "]"));
  args.unshift('[i18nlet]');

  try {
    console.log.apply(console, args); // eslint-disable-line
  } catch (e) {
    console.log(args); // eslint-disable-line
  }
};


/**
 * @class I18nlet
 */
var I18nlet = function I18nlet(settings) {
  var this$1 = this;
  if ( settings === void 0 ) settings = {};

  this.version = VERSION || '';
  this.k2v = {};

  ///
  this.settings = {};
  this.settings.currentLangage = this.settings.defaultLangage = settings.defaultLangage || defaultLangage;
  this.settings.langageSeparator = settings.langageSeparator || langageSeparator;
  this.settings.debug = settings.debug || debug;

  this.settings.variableKeyPrefix = settings.variableKeyPrefix || variableKeyPrefix;
  this.settings.variableKeySuffix = settings.variableKeySuffix || variableKeySuffix;
  this.settings.defaultNoConvertVariable = settings.defaultNoConvertVariable || defaultNoConvertVariable;

  this.regexpStr = (this.settings.variableKeyPrefix) + "(.+?)" + (this.settings.variableKeySuffix);
  this.regexp = new RegExp(this.regexpStr, 'g');


  this.logger = {};
  this.logger.output = settings.output || _output;
  /**
   * console debug output
   * @param {*} args
   */
  this.logger.debug = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (!this$1.settings.debug) {
      return;
    }
    args.unshift('DEBUG');
    this$1.logger.output.apply(null, args);
  };

  /**
   * console error output
   * @param {*} message
   */
  this.logger.error = function (message) {
    var err = new Error(("[i18nlet] " + message));
    this$1.logger.output.apply(null, ['ERROR', err]);
    throw err;
  };

  ///
};


I18nlet.prototype.load = function load (langage, terms) {
    var this$1 = this;

  Object.keys(terms).forEach(function (context) {
    this$1.k2v[("" + langage + (this$1.settings.langageSeparator) + context)] = terms[context];
  });
};

I18nlet.prototype.loads = function loads (data) {
    var this$1 = this;

  Object.keys(data).forEach(function (v) {
    this$1.load(v, data[v]);
  });
};

I18nlet.prototype.changeLangage = function changeLangage (langage) {
  this.settings.currentLangage = langage || this.settings.defaultLangage;
};

I18nlet.prototype.currentLangage = function currentLangage () {
  return this.settings.currentLangage;
};

I18nlet.prototype.i = function i (context, vals, options) {
    var this$1 = this;

  vals = vals || {};
  options = options || {};
  options.ref = !!options.ref;
  options.langage = options.langage ? options.langage : this.currentLangage();


  var ctx = "" + (options.langage) + (this.settings.langageSeparator) + context;
  var value = this.k2v[ctx];

  if (!value) {
    this.logger.debug(("Context not found. '" + context + "' for '" + ctx + "'"));
  }

  var ret = value;
  var match;
  while (match = this.regexp.exec(ret)) { // eslint-disable-line
    var val = vals[match[1].trim()];
    if (!val) {
      this$1.logger.debug(("It can not convert the variable part. '" + (match[0]) + "' for '" + ret + "'"));
      ret = (typeof this$1.settings.defaultNoConvertVariable === 'string') ? ret.replace(match[0], this$1.settings.defaultNoConvertVariable) : ret;
      continue;
    }

    ret = ret.replace(match[0], val);
    this$1.regexp.lastIndex = 0;
  }

  if (!options.ref) {
    return ret;
  }

  var matchRef;
  while (matchRef = this.regexp.exec(ret)) { // eslint-disable-line
    var ctxRef = "" + (options.langage || this$1.currentLangage()) + (this$1.settings.langageSeparator) + (matchRef[1].trim());
    var valRef = this$1.k2v[ctxRef];
    if (!valRef) {
      this$1.logger.debug(("It can not convert the constant part. '" + (matchRef[0]) + "' for '" + ret + "'"));
      ret = (typeof this$1.settings.defaultNoConvertVariable === 'string') ? ret.replace(matchRef[0], this$1.settings.defaultNoConvertVariable) : ret;
      continue;
    }

    ret = ret.replace(matchRef[0], valRef);
    this$1.regexp.lastIndex = 0;

  }

  return ret;

};

module.exports = I18nlet;
