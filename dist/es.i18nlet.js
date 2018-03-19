/* i18nlet version 0.0.5 */
var VERSION = "0.0.5";

/*global VERSION*/

var debug = false;
var defaultLangage = 'en';
var langageSeparator = ':';
var variableKeyPrefix = '{{';
var variableKeySuffix = '}}';
var defaultNoConvertVariable = null;
var defaultText = '';
var defaultGetMessageFunctionName = 'i';
var defaultReference = true;

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

var defaultLoad = function (langage, terms) {
  var this$1 = this;

  Object.keys(terms).forEach(function (context) {
    this$1.k2v[("" + langage + (this$1.settings.langageSeparator) + context)] = terms[context];
  });
};

var defaultLoads = function (data) {
  var this$1 = this;

  Object.keys(data).forEach(function (v) {
    this$1.load(v, data[v]);
  });
};


/**
 * @class I18nlet
 */
var I18nlet = function I18nlet () {};

I18nlet.prototype.init = function init (settings) {
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
  this.settings.noConvertVariable = settings.noConvertVariable || defaultNoConvertVariable;

  this.settings.reference = defaultReference;
  if ((typeof settings.reference) === 'boolean') {
    this.settings.reference = settings.reference;
  }

  this.settings.defaultText = defaultText;
  if ((typeof settings.defaultText) === 'string') {
    this.settings.defaultText = settings.defaultText;
  }

  this.settings.getMessageFunctionName = settings.getMessageFunctionName || defaultGetMessageFunctionName;
  this[this.settings.getMessageFunctionName] = this._i18nlet_get_message;

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
  };

  this.hook = {
    load: defaultLoad,
    loads: defaultLoads,
  };
  if (settings.hook && settings.hook.load) {
    this.logger.debug('hook load()');
    this.hook.load = settings.hook.load;
  }
  if (settings.hook && settings.hook.loads) {
    this.logger.debug('hook loads()');
    this.hook.loads = settings.hook.loads;
  }

  ///

  return this;
};


I18nlet.prototype.load = function load (/*langage, terms*/) {
  this.hook.load.apply(this, arguments);
  return this;
};

I18nlet.prototype.loads = function loads (/*data*/) {
  this.hook.loads.apply(this, arguments);
  return this;
};

I18nlet.prototype.changeLangage = function changeLangage (langage) {
  this.settings.currentLangage = langage || this.settings.defaultLangage;
};

I18nlet.prototype.currentLangage = function currentLangage () {
  return this.settings.currentLangage;
};

I18nlet.prototype._getDefaultText = function _getDefaultText (context, text, defaultText) {
  if ((typeof text) !== 'undefined') {
    return text;
  }
  this.logger.debug(("context not found. context:'" + context + "'"));

  if ((typeof defaultText) === 'string') {
    return defaultText;
  }
  return this.settings.defaultText;
};

I18nlet.prototype._i18nlet_get_message = function _i18nlet_get_message (context, vals, options) {
    var this$1 = this;
 // eslint-disable-line
  vals = vals || {};
  options = options || {};

  if ((typeof options.ref) === 'boolean') {
    options.ref = !!options.ref;
  } else {
    options.ref = this.settings.reference;
  }
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
      ret = (typeof this$1.settings.noConvertVariable === 'string') ? ret.replace(match[0], this$1.settings.noConvertVariable) : ret;
      continue;
    }

    ret = ret.replace(match[0], val);
    this$1.regexp.lastIndex = 0;
  }

  if (!options.ref) {
    return this._getDefaultText(context, ret, options.defaultText);
  }

  var matchRef;
  while (matchRef = this.regexp.exec(ret)) { // eslint-disable-line
    var ctxRef = "" + (options.langage || this$1.currentLangage()) + (this$1.settings.langageSeparator) + (matchRef[1].trim());
    var valRef = this$1.k2v[ctxRef];
    if (!valRef) {
      this$1.logger.debug(("It can not convert the constant part. '" + (matchRef[0]) + "' for '" + ret + "'"));
      ret = (typeof this$1.settings.noConvertVariable === 'string') ? ret.replace(matchRef[0], this$1.settings.noConvertVariable) : ret;
      continue;
    }

    ret = ret.replace(matchRef[0], valRef);
    this$1.regexp.lastIndex = 0;

  }

  return this._getDefaultText(context, ret, options.defaultText);

};

export default I18nlet;
