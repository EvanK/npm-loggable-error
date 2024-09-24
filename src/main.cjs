/**
 * Converts any Error instance to a string format similar to what console.log generates.
 * Any other value will be cast to string.
 * 
 * @param {*} err The error to stringify
 * @param {number} depth For recursive calls on nested error objects, controls indentation
 * @returns {string}
 */
module.exports = function stringify (err, depth = 0) {
  let collapsed = '';
  if (err instanceof Error) {
    // add full stack trace if one exists, otherwise convert to string
    let stack = ( err?.stack ?? err.toString() ).replace(/^/gm, ' '.repeat(depth)).trim();

    // replace error name with class constructor as necessary
    if (stack.startsWith('Error: ') && err.constructor.name != 'Error') {
      stack = err.constructor.name + stack.substring(5);
    }
    collapsed += stack;

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
          collapsed += stringify(err[property], depth + 2);
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

