/*global VERSION*/

const debug = false;
const defaultLangage = 'en';
const variableKeyPrefix = '{{';
const variableKeySuffix = '}}';
const defaultNoConvertVariable = null;
const defaultText = '';
const defaultGetMessageFunctionName = 'i';
const defaultReference = true;

/**
 * console output
 *
 * @param {String} type level
 * @param {*} args output messages
 */
const _output = (type, ...args) => {
  args.unshift(`[${type.toUpperCase()}]`);
  args.unshift('[i18nlet]');

  try {
    console.log.apply(console, args); // eslint-disable-line
  } catch (e) {
    console.log(args); // eslint-disable-line
  }
};

const defaultLoad = function (langage, terms) {
  if (!this.store[langage]) {
    this.store[langage] = {};
  }
  Object.keys(terms).forEach(context => {
    this.store[langage][context] = terms[context];
  });
};

const defaultLoads = function (data) {
  Object.keys(data).forEach(v => {
    this.load(v, data[v]);
  });
};


/**
 * @class I18nlet
 */
class I18nlet {

  init(settings = {}) {
    this.version = VERSION || '';
    this.store = {};

    ///
    this.settings = {};
    this.settings.currentLangage = this.settings.defaultLangage = settings.defaultLangage || defaultLangage;
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

    this.regexpStr = `${this.settings.variableKeyPrefix}(.+?)${this.settings.variableKeySuffix}`;
    this.regexp = new RegExp(this.regexpStr, 'g');

    this.logger = {};
    this.logger.output = settings.output || _output;
    /**
     * console debug output
     * @param {*} args
     */
    this.logger.debug = (...args) => {
      if (!this.settings.debug) {
        return;
      }
      args.unshift('DEBUG');
      this.logger.output.apply(null, args);
    };

    /**
     * console error output
     * @param {*} message
     */
    this.logger.error = message => {
      const err = new Error(`[i18nlet] ${message}`);
      this.logger.output.apply(null, ['ERROR', err]);
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
  }


  load(/*langage, terms*/) {
    this.hook.load.apply(this, arguments);
    return this;
  }

  loads(/*data*/) {
    this.hook.loads.apply(this, arguments);
    return this;
  }

  changeLangage(langage) {
    this.settings.currentLangage = langage || this.settings.defaultLangage;
  }

  currentLangage() {
    return this.settings.currentLangage;
  }

  _getDefaultText(context, text, defaultText) {
    if ((typeof text) !== 'undefined' && text !== null) {
      return text;
    }
    this.logger.debug(`context not found. context:'${context}'`);

    if ((typeof defaultText) === 'string') {
      return defaultText;
    }
    return this.settings.defaultText;
  }

  _i18nlet_get_message(context, vals, options) { // eslint-disable-line
    vals = vals || {};
    options = options || {};

    if ((typeof options.ref) === 'boolean') {
      options.ref = !!options.ref;
    } else {
      options.ref = this.settings.reference;
    }
    options.langage = options.langage ? options.langage : this.currentLangage();

    const langageStore = this.store[options.langage];
    if (!langageStore || !langageStore[context]) {
      return this._getDefaultText(context, null, options.defaultText);
    }

    const value = langageStore[context];

    if (!value) {
      this.logger.debug(`Context not found. '${context}'`);
    }

    let ret = value;
    let match;
    while (match = this.regexp.exec(ret)) { // eslint-disable-line
      const val = vals[match[1].trim()];
      if (!val) {
        this.logger.debug(`It can not convert the variable part. '${match[0]}' for '${ret}'`);
        ret = (typeof this.settings.noConvertVariable === 'string') ? ret.replace(match[0], this.settings.noConvertVariable) : ret;
        continue;
      }

      ret = ret.replace(match[0], val);
      this.regexp.lastIndex = 0;
    }

    if (!options.ref) {
      return ret;
    }

    let matchRef;
    while (matchRef = this.regexp.exec(ret)) { // eslint-disable-line
      const ctxRef = matchRef[1].trim();
      const valRef = langageStore[ctxRef];
      if (!valRef) {
        this.logger.debug(`It can not convert the constant part. '${matchRef[0]}' for '${ret}'`);
        ret = (typeof this.settings.noConvertVariable === 'string') ? ret.replace(matchRef[0], this.settings.noConvertVariable) : ret;
        continue;
      }

      ret = ret.replace(matchRef[0], valRef);
      this.regexp.lastIndex = 0;

    }

    return ret;

  }

}

export default I18nlet;
