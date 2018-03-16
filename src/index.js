/*global VERSION*/

const debug = false;
const defaultLangage = 'en';
const langageSeparator = ':';
const variableKeyPrefix = '{{';
const variableKeySuffix = '}}';
const defaultNoConvertVariable = null;
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
  Object.keys(terms).forEach(context => {
    this.k2v[`${langage}${this.settings.langageSeparator}${context}`] = terms[context];
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

  /**
   * Creates an instance of I18nlet.
   * @memberof I18nlet
   */
  constructor(settings = {}) {
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

  i(context, vals, options) {
    vals = vals || {};
    options = options || {};
    options.ref = !!options.ref;
    options.langage = options.langage ? options.langage : this.currentLangage();


    const ctx = `${options.langage}${this.settings.langageSeparator}${context}`;
    const value = this.k2v[ctx];

    if (!value) {
      this.logger.debug(`Context not found. '${context}' for '${ctx}'`);
    }

    let ret = value;
    let match;
    while (match = this.regexp.exec(ret)) { // eslint-disable-line
      const val = vals[match[1].trim()];
      if (!val) {
        this.logger.debug(`It can not convert the variable part. '${match[0]}' for '${ret}'`);
        ret = (typeof this.settings.defaultNoConvertVariable === 'string') ? ret.replace(match[0], this.settings.defaultNoConvertVariable) : ret;
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
      const ctxRef = `${options.langage || this.currentLangage()}${this.settings.langageSeparator}${matchRef[1].trim()}`;
      const valRef = this.k2v[ctxRef];
      if (!valRef) {
        this.logger.debug(`It can not convert the constant part. '${matchRef[0]}' for '${ret}'`);
        ret = (typeof this.settings.defaultNoConvertVariable === 'string') ? ret.replace(matchRef[0], this.settings.defaultNoConvertVariable) : ret;
        continue;
      }

      ret = ret.replace(matchRef[0], valRef);
      this.regexp.lastIndex = 0;

    }

    return ret;

  }

}

export default I18nlet;
