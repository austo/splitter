/* global suite:true */
/* global test:true */
/* global before:true */

'use strict';

var path = require('path'),
  util = require('util'),
  assert = require('assert'),
  Splitter = require('../');

function inspect(obj) {
  console.log(util.inspect(obj, {
    colors: true,
    depth: null
  }));
}

suite('splitter', () => {
  var enums;
  before((done) => {
    enums = require(path.join(__dirname, 'fixtures', 'county_enums'));
    done();
  });

  test('should throw error if invalid type', () => {
    assert.throws(() => {
      new Splitter('dog');
    }, RangeError);
  });

  test('should throw error if enumeration splitter is initialized w/o enums array', () => {
    assert.throws(() => {
      new Splitter('enumeration');
    }, RangeError);
  });

  test('should make enum maps correctly', () => {
    var splitter = new Splitter('enumeration', enums);
    // inspect(splitter);
    assert.equal(enums.length, Object.keys(splitter._enumNames).length);
    assert.equal(enums.length, Object.keys(splitter._enumIds).length);
  });

  test('should make regex correctly', () => {
    var splitter = new Splitter('INTEGER');
    var re = splitter._makeRegExp(['COMMA', 'SEMICOLON', 'SPACE', 'TABULATOR', 'NEWLINE']);
    var parts = 'this,should;provide every\ttype\nof\r\ndelimiter'.split(re);
    assert.equal(7, parts.length);
  });

  test('should validate enums correctly', () => {
    var splitter = new Splitter('enumeration', enums);
    // inspect(splitter._enumIds);
    var result = splitter.validate(`ACCOMACK, Virginia\nADA, Idaho\n17001\ndog`, ['NEWLINE']);
    assert.deepEqual({
      valid: 3,
      invalid: 1
    }, result);
  });
});
