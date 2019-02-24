# SPA github pages cli

[![Greenkeeper badge](https://badges.greenkeeper.io/nerdmax/spa-github-pages-cli.svg)](https://greenkeeper.io/)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

[![NPM Version][npm-image]][npm-url]
[![License Stats][npm-license]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]
[![Github stars][github-stars]][github-url]
[![Github issues][github-issues]][github-issues-url]
[![Build Status](https://travis-ci.org/nerdmax/spa-github-pages-cli.svg?branch=master)](https://travis-ci.org/nerdmax/spa-github-pages-cli)
[![codecov](https://codecov.io/gh/nerdmax/spa-github-pages-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/nerdmax/spa-github-pages-cli)
[![Dev Dependencies](https://david-dm.org/nerdmax/spa-github-pages-cli.svg)](https://david-dm.org/nerdmax/spa-github-pages-cli?type=dev)

[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/nerdmax)

> A cli tool for [spa-github-pages](https://github.com/rafrex/spa-github-pages). It can help you host single page apps with GitHub Pages.

[![nodei.co][npm-io]][npm-url]

- [SPA github pages cli](#spa-github-pages-cli)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
  - [Advance Usage](#advance-usage)
  - [Contributing](#contributing)
  - [Contributors](#contributors)

## Installation

```shell
# npm
npm install --save spa-github-pages-cli --dev

# yarn
yarn add spa-github-pages-cli --dev
```

## Basic Usage

Add to your npm script:

```json
"spa-github-pages": "spa-github-pages",
```

Run npm script:

```shell
// yarn
yarn spa-github-pages
```

```shell
// npm
npm run spa-github-pages
```

## Advance Usage

Set the folder's name that contains index.html. (The default value is docs)

```json
"spa-github-pages": "spa-github-pages -d 'your_custom_folder'",
```

Set customDomain to true if you are using a custom domain. (The default value is false)

```json
"spa-github-pages": "spa-github-pages -c",
```

## Contributing

1. Fork it (<https://github.com/nerdmax/spa-github-pages-cli/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->

[npm-image]: https://img.shields.io/npm/v/spa-github-pages-cli.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/spa-github-pages-cli
[npm-license]: https://img.shields.io/npm/l/spa-github-pages-cli.svg
[npm-downloads]: https://img.shields.io/npm/dm/spa-github-pages-cli.svg?style=flat-square
[github-url]: https://github.com/nerdmax/spa-github-pages-cli
[github-issues]: https://img.shields.io/github/issues/nerdmax/spa-github-pages-cli.svg
[github-issues-url]: https://github.com/nerdmax/spa-github-pages-cli/issues
[github-stars]: https://img.shields.io/github/stars/nerdmax/spa-github-pages-cli.svg
[travis-image]: https://img.shields.io/travis/dbader/node-spa-github-pages-cli/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-spa-github-pages-cli
[npm-io]: https://nodei.co/npm/spa-github-pages-cli.png?downloads=true&downloadRank=true&stars=true
[wiki]: https://github.com/nerdmax/spa-github-pages-cli/wiki

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/18550349?v=4" width="100px;"/><br /><sub><b>Max Liu</b></sub>](https://github.com/nerdmax)<br />[💻](https://github.com/nerdmax/spa-github-pages-cli/commits?author=nerdmax "Code") [📖](https://github.com/nerdmax/spa-github-pages-cli/commits?author=nerdmax "Documentation") [🚇](#infra-nerdmax "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/nerdmax/spa-github-pages-cli/commits?author=nerdmax "Tests") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
