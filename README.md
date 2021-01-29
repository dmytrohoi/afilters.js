
<p align="center">
  <img width="400" height="400" src="./img/logo.png">
</p>


![GitHub top language](https://img.shields.io/github/languages/top/dmytrohoi/afilters.js) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/dmytrohoi/afilters.js/dev/jest/main) ![Codecov](https://img.shields.io/codecov/c/github/dmytrohoi/afilters.js) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/dmytrohoi/afilters.js) ![GitHub](https://img.shields.io/github/license/dmytrohoi/afilters.js)

-----

About
=====

AFilters.js - Advanced Filters library to help you make you own filters.

Easy to use.
Lightweight.
User-friendly.

Usage
=====

**Node.js 12.0.0 or newer is required.**

1. Install package from npm: `npm install afilters.js`
2. Add new filter to your code: `const Filter = require('afilters.js');`
3. Use filters!

Example
=====

``` js
const Filter = require('afilters.js');

new Filter({ filters: [(a, b) => a > b] }).try(1, 0).finally((a) => console.log(a));

```

Links
=====

[Website](https://dmytrohoi.github.io/afilters)
