/* eslint-env browser, node */

var assert;
var I18nlet;

if (typeof window === 'undefined') {
  assert = require('power-assert');
  I18nlet = require('../dist/cjs.i18nlet');
} else {
  assert = window.assert;
  I18nlet = window.I18nlet;
}

var data = {
  ja: {
    'project.name': 'i18nlet',
    browser: 'ブラウザ',
    nodejs: 'NodeJS',
    'emoji.happy': ':)',
    'project.description': '国際化対応ライブラリ ({{nodejs}}, {{browser}})',
    hello: 'こんにちは {{name}} {{emoji.happy}}',
    goodbye: 'さようなら! {{name}}'
  },
  en: {
    'project.name': 'i18nlet',
    browser: 'Browser',
    nodejs: 'NodeJS',
    'emoji.happy': ':)',
    'project.description': 'Internationalization library. ({{nodejs}}, {{browser}})',
    hello: 'Hello {{name}} {{emoji.happy}}',
    goodbye: 'GoodBye! {{name}}'
  },
};


describe('basic test case.', () => {

  it('constructor normal', () => {
    const normal = new I18nlet();

    assert.equal(0, Object.keys(normal.k2v).length);
    ///
    assert.equal('function', typeof normal.logger.debug);
    assert.equal('function', typeof normal.logger.output);
    assert.equal('function', typeof normal.logger.error);
    ///
    assert.equal('/{{(.+?)}}/g', normal.regexp.toString());
    assert.equal('{{(.+?)}}', normal.regexpStr);
    ///
    assert.equal('en', normal.settings.currentLangage);
    assert.equal(false, normal.settings.debug);
    assert.equal('en', normal.settings.defaultLangage);
    assert.equal(null, normal.settings.defaultNoConvertVariable);
    assert.equal(':', normal.settings.langageSeparator);
    assert.equal('{{', normal.settings.variableKeyPrefix);
    assert.equal('}}', normal.settings.variableKeySuffix);
    ///
    assert.ok(!!normal.version);

  });

  it('constructor custom', () => {
    const custom = new I18nlet({
      currentLangage: 'ja',
      debug: true,
      defaultLangage: 'ja',
      defaultNoConvertVariable: 'empty',
      langageSeparator: '_',
      variableKeyPrefix: '#{',
      variableKeySuffix: '}#',
    });
    custom.loads(data);

    ///
    //assert.equal('function', typeof custom.logger.error);
    ///
    assert.equal('/#{(.+?)}#/g', custom.regexp.toString());
    assert.equal('#{(.+?)}#', custom.regexpStr);
    ///
    assert.equal('ja', custom.settings.currentLangage);
    assert.equal(true, custom.settings.debug);
    assert.equal('ja', custom.settings.defaultLangage);
    assert.equal('empty', custom.settings.defaultNoConvertVariable);
    assert.equal('_', custom.settings.langageSeparator);
    assert.equal('#{', custom.settings.variableKeyPrefix);
    assert.equal('}#', custom.settings.variableKeySuffix);

    assert.ok(!!custom.k2v['ja_project.description']);
    assert.equal('国際化対応ライブラリ ({{nodejs}}, {{browser}})', custom.i('project.description', null, {
      ref: false,
    }));

  });


  it('loads', () => {
    const i18nlet = new I18nlet();
    i18nlet.loads(data);
    assert.ok(!!i18nlet.k2v['ja:project.description']);
  });

  it('load', () => {
    const i18nlet = new I18nlet();
    i18nlet.load('en', data.en);
    assert.ok(!!i18nlet.k2v['en:project.description']);
    assert.ok(!i18nlet.k2v['ja:project.description']);
    i18nlet.load('ja', data.ja);
    assert.ok(!!i18nlet.k2v['en:project.description']);
    assert.ok(!!i18nlet.k2v['ja:project.description']);
  });

  it('get message i(context)', () => {
    const i18nlet = new I18nlet();
    i18nlet.loads(data);
    assert.equal(data.en.hello, i18nlet.i('hello'));
  });

  it('get message i(context, vals)', () => {
    const i18nlet = new I18nlet();
    i18nlet.loads(data);
    assert.equal('GoodBye! fkei', i18nlet.i('goodbye', {
      name: 'fkei',
    }));

  });

  it('get message i(context, vals, ref)', () => {
    const i18nlet = new I18nlet();
    i18nlet.loads(data);
    assert.equal(data.en.hello, i18nlet.i('hello'));
    assert.equal('Hello fkei :)', i18nlet.i('hello', {
      name: 'fkei',
    }, {
      ref: true,
      langage: 'en'
    }));
  });


  it('get message i(context, vals, {ref, langage)', () => {
    const i18nlet = new I18nlet();
    i18nlet.loads(data);

    assert.equal('こんにちは えふけい :)', i18nlet.i('hello', {
      name: 'えふけい',
    }, {
      ref: true,
      langage: 'ja'
    }));

    assert.equal(data.ja.hello, i18nlet.i('hello', null, {
      ref: false,
      langage: 'ja'
    }));

    assert.equal('国際化対応ライブラリ (NodeJS, ブラウザ)', i18nlet.i('project.description', {}, {
      ref: true,
      langage: 'ja'
    }));

  });

});