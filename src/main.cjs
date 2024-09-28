const packageJson = require('../package.json');

/**
 * Converts any Error instance to a string format similar to what console.log generates.
 * Any other value will be cast to string.
 * 
 * @param {*} err The error to stringify
 * @param {object} [options]
 * @param {number} [options.depth=0] Controls indentation of stack traces, properties and nested errors
 * @param {boolean} [options.stack=true] Controls stack traces, displayed by default
 * @returns {string} The stringified error
 * @property {string} version
 */
function stringify(err, options = {}) {
  const depth = options.hasOwnProperty('depth') ? parseInt(options.depth, 10) : 0;
  const stack = options.hasOwnProperty('stack') ? (!!options.stack) : true;

  let collapsed = '';
  if (err instanceof Error) {
    let body;
    if (stack) {
      // add full stack trace if one exists, otherwise convert to string
      body = ( err?.stack ?? `${err}` ).replace(/^/gm, ' '.repeat(depth)).trim();

      // replace error name with class constructor as necessary
      if (body.startsWith('Error: ') && err.constructor.name != 'Error') {
        body = err.constructor.name + body.substring(5);
      }
    } else {
      body = `${err}`;
    }
    collapsed += body;

    const props = Object.getOwnPropertyNames(err);

    // skip these two ahead of time
    for (const skipped of ['message','stack']) {
      const propAt = props.indexOf(skipped);
      if (propAt > -1) props.splice(propAt, 1);
    }

    // only break into object notation if we have addtl props to dump
    if (props.length) {
      const dedent = ' '.repeat(depth);
      const indent = ' '.repeat(depth + 2);

      collapsed += ' {\n';

      // loop and print each (indented) prop name
      for (let property of props) {
        collapsed += `${indent}[${property}]: `;

        // if another error object, stringify it too
        if (err[property] instanceof Error) {
          collapsed += stringify(err[property], { depth: depth + 2, stack });
        }
        // otherwise stringify as JSON
        else {
          collapsed += JSON.stringify(err[property]);
        }

        collapsed += '\n';
      }

      collapsed += `${dedent}}\n`;
    }
  } else {
    collapsed += err;
  }

  return collapsed;
}
stringify.version = packageJson.version;

module.exports = stringify;
