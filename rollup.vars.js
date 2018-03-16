const package = require('./package.json');

const
  banner = '/* i18nlet version ' + package.version + ' */',
  banner_bundle = '/* i18nlet version ' + package.version + ' */',
  intro = 'var VERSION = "' + package.version + '";';

module.exports = {
  banner: banner,
  banner_bundle: banner_bundle,
  intro: intro,
};
