/* eslint-env node, mocha */

const
  buble = require('rollup-plugin-buble'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  commonjs = require('rollup-plugin-commonjs'),
  banner = require('../rollup.vars').banner,
  intro = require('../rollup.vars').intro;

var debug = !!process.env.DEBUG;

let namedExports = {};


module.exports = config => {
  config.set({
    autoWatch: true,
    // client: { captureConsole: false },
    browsers: [
      'Chrome',
      //'Firefox',
      //'Safari'
    ],
    browserConsoleLogOptions: {
      level: 'error',
      format: '%b %T: %m',
      terminal: false
    },
    colors: true,
    files: [
      '../src/index.js',
      'index.js',
    ],
    frameworks: ['mocha', 'power-assert'],
    logLevel: config.LOG_DEBUG,
    //logLevel: config.LOG_ERROR,
    plugins: [
      //'karma-rollup-plugin',
      'karma-rollup-preprocessor',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-power-assert',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-coverage',
    ],
    preprocessors: {
      '../src/index.js': ['rollup', 'coverage'],
      'index.js': ['rollup'],
    },
    reporters: ['mocha', 'coverage'],
    rollupPreprocessor: {
      format: 'iife',
      name: 'I18nlet',
      banner: banner,
      intro: intro,
      plugins: [
        nodeResolve({
          jsnext: true,
          main: true,
          browser: true
        }),
        commonjs({
          include: 'node_modules/**',
          namedExports: namedExports
        }),
        buble()
      ],
      sourceMap: false // 'inline'
    },
    singleRun: !debug,
  });
};
