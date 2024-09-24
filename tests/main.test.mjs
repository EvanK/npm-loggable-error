import * as chai from 'chai';
const { assert } = chai;

import stringify from '../src/import.mjs';

describe('stringify', function() {

  it('Stringifies standard error with cause', function() {
    const err = new Error('a problem occurred', { cause: 'some thing that caused it' });
    const result = stringify(err);

    assert.isTrue(
      result.startsWith(
        `Error: a problem occurred
    at Context.<anonymous> (`
      ),
      'startsWith failed'
    );

    assert.isTrue(
      result.endsWith(
        `{
  [cause]: "some thing that caused it"
}
`
      ),
      'endsWith failed'
    );

    assert.match(
      result,
      /^Error: a problem occurred\n(    at [^\)]+\)\n)+    at [^\)]+\) \{\n  \[cause\]: "some thing that caused it"\n\}\n$/
    );
  });

  it('Stringifies custom error with extra properties', function () {
    class ErrorWithProps extends Error {
      constructor(message, options) {
        super(message, options);
        // this.name = this.constructor.name;
        this.customProp1 = options.customProp1;
        this.customProp2 = options.customProp2;
        this.customProp3 = options.customProp3;
      }
    }

    const err = new ErrorWithProps(
      'oops',
      {
        customProp1: 3.14,
        customProp2: 'OH_SHIII',
        customProp3: [2, 3, 5, 8, 13],
      }
    );
    const result = stringify(err);

    assert.isTrue(
      result.startsWith(
        `ErrorWithProps: oops
    at Context.<anonymous> (`
      )
    );

    assert.isTrue(
      result.endsWith(
        `{
  [customProp1]: 3.14
  [customProp2]: "OH_SHIII"
  [customProp3]: [2,3,5,8,13]
}
`
      )
    );

    assert.match(
      result,
      /^ErrorWithProps: oops\n(    at [^\)]+\)\n)+    at [^\)]+\) \{\n  \[customProp1\]: 3.14\n  \[customProp2\]: "OH_SHIII"\n  \[customProp3\]: \[2,3,5,8,13\]\n\}\n$/
    );
  });

  it('Leaves already stringified error unmodified', function () {
    const err = 'We dont have time for Error objects!';
    const result = stringify(err);

    assert.equal(result, err);
  });

  it('Implicitly toString()s a non-Error object', function () {
    const err = { message: 'this is not an Error class/subclass' };
    const result = stringify(err);

    assert.equal(
      result,
      '[object Object]'
    );
  });

  it('Stringifies errors nested as cause', function () {
    const err = new Error('catch and rethrow', {
      cause: new Error('root cause')
    });
    const result = stringify(err);

    assert.isTrue(
      result.startsWith(
        `Error: catch and rethrow
    at Context.<anonymous> (`
      ),
      'startsWith failed'
    );

    assert.isTrue(
      result.endsWith(
        `
}
`
      ),
      'endsWith failed'
    );

    assert.include(
      result,
      `{
  [cause]: Error: root cause
      at Context.<anonymous> `
    );

    assert.match(
      result,
      /^Error: catch and rethrow(\n    at [^\)]+\))+ \{\n  \[cause\]: Error: root cause(\n      at [^\)]+\))+\n}\n$/
    );
  });

});
