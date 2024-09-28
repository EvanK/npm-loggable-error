# loggable-error

![ci status](https://github.com/EvanK/npm-loggable-error/actions/workflows/ci.yml/badge.svg)

In those times when you need to log an error to somewhere other than standard output, this simple module stringifies Error objects in a format akin to `console.log`:

```js
// supports cjs require
const stringify = require('loggable-error');
// or esm import
// import stringify from 'loggable-error';

try {
  throw new Error('testing one two three');
} catch(e) {
  fs.writeFileSync(
    '/home/jdoe/log.txt',
    stringify(e)
  );
}
```

Open up said file and you'll find something along the lines of:

```
Error: testing one two three
    at Object.<anonymous> (/home/jdoe/test.js:7:9)
    at Module._compile (node:internal/modules/cjs/loader:1126:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
    at Module.load (node:internal/modules/cjs/loader:1004:32)
    at Function.Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47
```
