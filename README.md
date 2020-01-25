[![TypeScript version][ts-badge]][typescript-37]
[![Node.js version][nodejs-badge]][nodejs]
[![Build Status](https://travis-ci.com/mikeporterdev/odeon-notifier.svg?token=bsUoyywxdKyupEznaZLN&branch=master)](https://travis-ci.com/mikeporterdev/odeon-notifier)
# node-typescript-boilerplate

Simple project to monitor my local Odeon cinema for new releases being uploaded.

## Quick start

```shell script
docker run \
  -e PUSHOVER_TOKEN=<PUSHOVER_TOKEN> \
  -e PUSHOVER_USER=<PUSHOVER_USER> \
  odeon-notifier
```


or download and unzip current `master` branch:

```sh
wget https://github.com/jsynowiec/node-typescript-boilerplate/archive/master.zip -O node-typescript-boilerplate
unzip node-typescript-boilerplate.zip && rm node-typescript-boilerplate.zip
```

Now start adding your code in the `src` and unit tests in the `__tests__` directories. Have fun and build amazing things 🚀

### Unit tests in JavaScript

Writing unit tests in TypeScript can sometimes be troublesome and confusing. Especially when mocking dependencies and using spies.

This is **optional**, but if you want to learn how to write JavaScript tests for TypeScript modules, read the [corresponding wiki page][wiki-js-tests].

## Available scripts

+ `clean` - remove coverage data, Jest cache and transpiled files,
+ `build` - transpile TypeScript to ES6,
+ `build:watch` - interactive watch mode to automatically transpile source files,
+ `lint` - lint source files and tests,
+ `test` - run tests,
+ `test:watch` - interactive watch mode to automatically re-run tests

## License
Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/master/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-3.7-blue.svg
[typescript-37]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2012.13-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v12.x/docs/api/