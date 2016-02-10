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

  test('should validate enums correctly with extra spaces', () => {
    var splitter = new Splitter('enumeration', enums);
    // inspect(splitter._enumIds);
    var result = splitter.validate(`ACCOMACK, Virginia\tADA, Idaho\t17001\tdog`,
      ['NEWLINE', 'TABULATOR']);
    assert.deepEqual({
      valid: 3,
      invalid: 1
    }, result);
  });

  test('should validate integer with all delimiters', () => {
    var splitter = new Splitter('integer');
    // inspect(splitter._enumIds);
    var result = splitter.validate(`1,2;3 4\t5\r\n6`,
      ['COMMA', 'SEMICOLON', 'SPACE', 'TABULATOR', 'NEWLINE']);
    assert.deepEqual({
      valid: 6,
      invalid: 0
    }, result);
  });

  test('should validate boolean with all delimiters', () => {
    var splitter = new Splitter('boolean');
    // inspect(splitter._enumIds);
    var result = splitter.validate(`true,false;true false\t1\r\n0`,
      ['COMMA', 'SEMICOLON', 'SPACE', 'TABULATOR', 'NEWLINE']);
    assert.deepEqual({
      valid: 6,
      invalid: 0
    }, result);
  });

  test('should validate float with all delimiters', () => {
    var splitter = new Splitter('float');
    // inspect(splitter._enumIds);
    var result = splitter.validate(`1.1,2.2;3.3 4.4\t5.5\r\n6.6`,
      ['COMMA', 'SEMICOLON', 'SPACE', 'TABULATOR', 'NEWLINE']);
    assert.deepEqual({
      valid: 6,
      invalid: 0
    }, result);
  });

  test('should validate date with all delimiters', () => {
    var splitter = new Splitter('date');
    // inspect(splitter._enumIds);
    var result = splitter.validate(`1999-12-25,1999-12-25;1999-12-25 1999-12-25\t1999-12-25\r\n1999-12-25`,
      ['COMMA', 'SEMICOLON', 'SPACE', 'TABULATOR', 'NEWLINE']);
    assert.deepEqual({
      valid: 6,
      invalid: 0
    }, result);
  });

  test('should validate date with all delimiters', () => {
    var splitter = new Splitter('date');
    // inspect(splitter._enumIds);
    var result = splitter.validate(`1999-12-25,1999-12-25;1999-12-25 1999-12-25\t1999-12-25\r\n1999-12-25`,
      ['COMMA', 'SEMICOLON', 'SPACE', 'TABULATOR', 'NEWLINE']);
    assert.deepEqual({
      valid: 6,
      invalid: 0
    }, result);
  });

  test('should validate string with all delimiters', () => {
    var splitter = new Splitter('string');
    // inspect(splitter._enumIds);
    var result = splitter.validate(`this,should;provide every\ttype\nof\r\ndelimiter`,
      ['COMMA', 'SEMICOLON', 'SPACE', 'TABULATOR', 'NEWLINE']);
    assert.deepEqual({
      valid: 7,
      invalid: 0
    }, result);
  });

  test('should validate multi_enum correctly', () => {
    var splitter = new Splitter('multi_enum', enums);
    // inspect(splitter._enumIds);
    var result = splitter.validate(`ACCOMACK, Virginia\nADA, Idaho\n17001\ndog`, ['NEWLINE']);
    assert.deepEqual({
      valid: 3,
      invalid: 1
    }, result);
  });

  test('should validate widestring with all delimiters', () => {
    var splitter = new Splitter('widestring');
    // inspect(splitter._enumIds);
    var result = splitter.validate(`this,should;provide every\ttype\nof\r\ndelimiter`,
      ['COMMA', 'SEMICOLON', 'SPACE', 'TABULATOR', 'NEWLINE']);
    assert.deepEqual({
      valid: 7,
      invalid: 0
    }, result);
  });

  test('should validate DATE_AND_TIME with all delimiters', () => {
    var splitter = new Splitter('DATE_AND_TIME');
    // inspect(splitter._enumIds);
    var result = splitter.validate('1999-12-25 12:25:25,1999-12-26 12:25:25;1999-12-27 12:25:25' +
      '\t1999-12-28 12:25:25\r\n1999-12-29 12:25:25',
      ['COMMA', 'SEMICOLON', 'TABULATOR', 'NEWLINE']);
    assert.deepEqual({
      valid: 5,
      invalid: 0
    }, result);
  });
});
