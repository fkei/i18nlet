# :globe_with_meridians: i18nlet

[![GitHub license](https://img.shields.io/github/license/fkei/i18nlet.svg)](https://github.com/fkei/i18nlet/blob/develop/LICENSE)
![Github All Releases](https://img.shields.io/github/downloads/fkei/i18nlet/total.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/fkei/i18nlet.svg)
![Travis CI](https://img.shields.io/travis/fkei/i18nlet/develop.svg)

[![NPM](https://nodei.co/npm/i18nlet.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/i18nlet/)

It is a simple internationalization library. (NodeJS, Browser)

<br />
<br />

## :musical_note: Features

----

### Named formatting


```js
const messages = {
  en: {
    hello: 'Hello {{name}}',
  },`
});
i18nlet.loads(messages);
var message = i18nlet.i('hello', { name: 'fkei' });
console.log(message);
// -- console panel
> 'Hello fkei'

```

### Named Reference formatting

```js
const message = {
  en: {
    'emoji.happy': ':)',
    hello: 'Hello {{name}} {{emoji.happy}}',
  },`
});

var message = i18nlet.i('hello', { name: 'fkei' });
console.log(message);
// -- console panel
> 'Hello fkei :)'
```

### Hooking of reading langage messages

```js
const i18nlet = new I18nlet().init({
  hook: {
    load: function (langage, terms) {
      // local memory or http request .......
    },
    loads: function (data) {
      // local memory or http request .......
    }
  }
});
```

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
bower install i18nlet
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
  console.log(message); // console panel > 'Hello fkei :)'

  var message1 = i18nlet.i('hello', { name: 'fkei' });
  console.log(message1); // console panel > 'こんにちは fkei :)'

</script>
```

<br />
<br />

## API

----

### Initialize

NodeJS

```js
const I18nlet = require('i18nlet');
const i18nlet = new I18nlet().init(/* settings */);
```

### I18nlet init

- Arguments : `(Object: settings)`
  - `settings.currentLangage`
    - Type: `string`
    - Description: Default language
    - Default: `en`
    - Required: `false`
  - `settings.debug`
    - Type: `boolean`
    - Description: debug mode
    - Default: `false`
    - Required: `false`
  - `settings.variableKeyPrefix`
    - Type: `string`
    - Description: Prefix to use in Named formatting
    - Default: `{{`
    - Required: `false`
  - `settings.variableKeySuffix`
    - Type: `string`
    - Description: Suffix to use in Named formatting
    - Default: `}}`
    - Required: `false`
  - `settings.noConvertVariable`
    - Type: `string`
    - Description: Default character string when `Named formatting` failed
    - Default: `null` // Display definition as it is
    - Required: `false`
  - `settings.reference`
    - Type: `boolean`
    - Description: Use `Named Reference formatting` by default
    - Default: `true`
    - Required: `false`
  - `settings.defaultText`
    - Type: `string`
    - Description: String to be returned in undefined case
    - Default: `''` // empty string
    - Required: `false`
  - `settings.getMessageFunctionName`
    - Type: `string`
    - Description: Specify the function name to get the message
    - Default: `i` // ex. i18n.i('hello');
    - Required: `false`
  - `settings.output`
    - Type: `function`
    - Description: Log output function
    - Default: console.log. see source code: `_output(...)`
    - Required: `false`
  - `settings.hook.load`
    - Type: `function`
    - Description: Function hooking language messages
    - Default: see source code: `defaultLoad(...)`
    - Required: `false`
  - `settings.hook.loads`
    - Type: `function`
    - Description: Function hooking language's messages
    - Default: see source code: `defaultLoads(...)`
    - Required: `false`


### I18nlet properties

- `VERSION`
  - Type: `String`
  - Description: i18n version
- `store`
  - Type: `Object`
  - Description: Message list store by language.
  - Format: `{en: {hello: 'Hello!'}, ja: 'hello': 'こんにちは' ....}`
- `regexpStr`
  - Type: `String`
  - Description: Regular expression(string) to find `Named formatting` dynamic variable
  - Scope: `private`
- `regexp`
  - Type: `RegExp`
  - Description: Regular expression(RegExp) to find `Named formatting` dynamic variable
  - Scope: `private`
- `logger.debug`
  - Type: `function`
  - Description: debug log output
- `logger.error`
  - Type: `function`
  - Description: error log output
- `settings`
  - See : `I18nlet.init(settigns)`
- `logger.output`
  - See : `I18nlet.init(settigns)`
- `hook.load`
  - See : `I18nlet.init(settigns)`
- `hook.loads`
  - See : `I18nlet.init(settigns)`

### I18nlet methods

- `load`
  - Description: Read language messages
  - Scope: `public`
- `loads`
  - Description: Read multiple language messages
  - Scope: `public`
- `changeLangage`
  - Description: Change default language
  - Scope: `public`
- `currentLangage`
  - Description: Get default language
  - Scope: `public`

## :scroll: Releases

----

Detailed changes for each release are documented in the [releases](https://github.com/fkei/i18nlet/releases).

<br />
<br />

## Develop

----

### eslint

```sh
npm run lint
```

### test (build, mocha and karma)

```sh
npm test
```

### build

```sh
# build
npm run build

# build and uglify
npm run release
```

### debug

```sh
# mocha
npm run mocha-dev

# karma
npm run karma-dev
```

<br />
<br />

## :copyright: License

----

[MIT](LICENSE)
