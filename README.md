# :globe_with_meridians: i18nlet

[![GitHub license](https://img.shields.io/github/license/fkei/i18nlet.svg)](https://github.com/fkei/i18nlet/blob/develop/LICENSE)
![Github All Releases](https://img.shields.io/github/downloads/fkei/i18nlet/total.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/fkei/i18nlet.svg)
![Travis CI](https://img.shields.io/travis/fkei/i18nlet/develop.svg)

[![NPM](https://nodei.co/npm/i18nlet.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/i18nlet/)

It is a simple internationalization library. (NodeJS, Browser)

## :scroll: Releases

Detailed changes for each release are documented in the [releases](https://github.com/fkei/i18nlet/releases).

<br />
<br />

## :book: Documentation

## :rocket: Install

----

### brower: script tag

Direct Download / CDN

```js
<script src="https://unpkg.com/i18nlet/dist/iife.i18nlet.js"></script>
```

### other release files

- [amd.i18nlet.js](https://unpkg.com/i18nlet/dist/amd.i18nlet.js)
- [amd.i18nlet.js.map](https://unpkg.com/i18nlet/dist/amd.i18nlet.js.map)
- [amd.i18nlet.min.js](https://unpkg.com/i18nlet/dist/amd.i18nlet.min.js)
- [cjs.i18nlet.js](https://unpkg.com/i18nlet/dist/cjs.i18nlet.js)
- [es.i18nlet.js](https://unpkg.com/i18nlet/dist/es.i18nlet.js)
- [iife.i18nlet.js](https://unpkg.com/i18nlet/dist/iife.i18nlet.js)
- [iife.i18nlet.js.map](https://unpkg.com/i18nlet/dist/iife.i18nlet.js.map)
- [iife.i18nlet.min.js](https://unpkg.com/i18nlet/dist/iife.i18nlet.min.js)



### NPM

```sh
npm install --save i18nlet
```

### bower

```sh
TODO
```

### Custom Build

You will have to clone directly from GitHub and build i18nlet yourself if you want to use the latest dev build.

```sh
git clone https://github.com/fkei/i18nlet.git
npm install
npm run release

---

出力ファイル
├── dist
      ├── amd.riot-i18nlet.js
      ├── amd.riot-i18nlet.js.map
      ├── amd.riot-i18nlet.min.js
      ├── cjs.riot-i18nlet.js
      ├── es.riot-i18nlet.js
      ├── iife.riot-i18nlet.js
      ├── iife.riot-i18nlet.js.map
      └── iife.riot-i18nlet.min.js
```

----

## :checkered_flag: Getting started

HTML/JavaScript

```html
<script src="https://unpkg.com/i18nlet/dist/iife.i18nlet.js"></script>

<script>
  var i18nlet = new I18nlet().init();
  i18nlet.loads({
`    ja: {
      'emoji.happy': ':)',
      hello: 'こんにちは {{name}} {{emoji.happy}}',
    },
    en: {
      'emoji.happy': ':)',
      hello: 'Hello {{name}} {{emoji.happy}}',
    },`
  });

  var message = i18nlet.i('hello', { name: 'fkei' });
  console.log(message); // output: 'Hello fkei :)'

  var message1 = i18nlet.i('hello', { name: 'fkei' });
  console.log(message1); // output: 'こんにちは fkei :)'

</script>
```



















<br />
<br />

# Develop


### eslint

```
$ npm run eslint
```

### test

```
$ npm test
```

<br />
<br />

## :copyright: License

[MIT](LICENSE)








