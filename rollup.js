/* global */
/* eslint-env node, mocha */
const
  rollup = require('rollup'),
  buble = require('rollup-plugin-buble'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  commonjs = require('rollup-plugin-commonjs'),
  banner = require('./rollup.vars').banner,
  banner_bundle = require('./rollup.vars').banner_bundle, // eslint-disable-line
  intro = require('./rollup.vars').intro;

let namedExports = {};

// @see https://rollupjs.org/guide/en#javascript-api

// iife/amd
async function buildIifeAmd() {
  // create a bundle
  const bundle = await rollup.rollup({
    input: 'src/index.js',
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
    ]
  });
  await bundle.write({
    format: 'iife',
    name: 'i18nlet',
    banner: banner,
    intro: intro,
    file: 'dist/iife.i18nlet.js',
    sourcemap: true
  });
  await bundle.write({
    format: 'amd',
    banner: banner,
    intro: intro,
    file: 'dist/amd.i18nlet.js',
    sourcemap: true
  });
}

buildIifeAmd();

// es/cjs
async function buildEsCjs() {
  // create a bundle
  const bundle = await rollup.rollup({
    input: 'src/index.js',
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
    ]
  });
  await bundle.write({
    format: 'es',
    banner: banner,
    intro: intro,
    file: 'dist/es.i18nlet.js'
  });
  await bundle.write({
    format: 'cjs',
    banner: banner,
    intro: intro,
    file: 'dist/cjs.i18nlet.js'
  });
}

buildEsCjs();
