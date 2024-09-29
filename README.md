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

## Stringification Options

Our exported function accepts a second `options` argument, in case you want to control whether stack traces are displayed or the amount of starting indentation:

```js
stringify(e, { stack: false });
// => 'Error: testing one two three'

stringify(e, { depth: 8 });
/* =>
'        Error: testing one two three\n' +
'            at Object.<anonymous> (/home/jdoe/test.js:7:9)\n' +
'            at Module._compile (node:internal/modules/cjs/loader:1546:14)\n' +
'            at Module._extensions..js (node:internal/modules/cjs/loader:1691:10)\n' +
'            at Module.load (node:internal/modules/cjs/loader:1317:32)\n' +
'            at Module._load (node:internal/modules/cjs/loader:1127:12)\n' +
'            at TracingChannel.traceSync (node:diagnostics_channel:315:14)\n' +
'            at wrapModuleLoad (node:internal/modules/cjs/loader:217:24)\n' +
'            at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:166:5)\n' +
'            at node:internal/main/run_main_module:30:49'
*/
```
