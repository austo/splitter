'use strict';

const types = {
  INTEGER: /^-?[1-9][0-9]*$/,
  ENUMERATION: null,
  BOOLEAN: /^(?:(?:true)|(?:false)|0|1)$/,
  FLOAT: /^-?[1-9][0-9]*(?:.[0-9]*)?$/,
  DATE: /[1-2][0-9]{3}[\.-][0-9]{2}[\.-][0-9]{2}\.?$/,
  STRING: /.*/,
  MULTI_ENUM: null,
  WIDESTRING: /.*/,
  DATE_AND_TIME: /^[1-2][0-9]{3}[\.-][0-9]{2}[\.-][0-9]{2}\.?\s(?:[0-9]{2}:){2}(?::[0-9]{2})?$/
};

function Splitter(type, enums) {
  if (!(this instanceof Splitter)) {
    return new Splitter(enums);
  }

  type = type.toUpperCase();

  if (types[type] === undefined) {
    throw new RangeError('invalid type');
  }

  if (type === 'ENUMERATION') {
    if (!Array.isArray(enums)) {
      throw new RangeError('ENUMERATION type splitter must be initialized with enums array');
    }
    this._rawEnums = enums;
    this._makeMaps();
    this.isEnum = true;
  }
  else {
    this.isEnum = false;
  }

  this.type = type;
}

Splitter.prototype._makeMaps = function() {
  this._enumNames = mapify(this._rawEnums, 'value', 'name');
  this._enumIds = mapify(this._rawEnums, 'name', 'value');
};

Splitter.prototype.validate = function(input, delimiters) {
  // var self = this;
  var re = this._makeRegExp(delimiters),
    valid = 0,
    invalid = 0,
    parts = input.split(re);

  // console.log(parts);
  parts.forEach((s) => {
    if (this.isEnum) {
      var map = isNaN(s) ? this._enumIds : this._enumNames;
      if (map[s] === undefined) {
        ++invalid;
      }
      else {
        ++valid;
      }
    }
    else {
      if (types[this.type].test(s)) {
        ++valid;
      }
      else {
        ++invalid;
      }
    }
  });
  return {
    valid: valid,
    invalid: invalid
  };
};


const delimiters = {
  COMMA: ',',
  SEMICOLON: ';',
  SPACE: '\\u0020+',
  TABULATOR: '\\t',
  NEWLINE: '\\r?\\n+'
};

Splitter.prototype._makeRegExp = function(delims) {
  var str = '';
  delims.forEach(function(type, index) {
    if (delimiters[type]) {
      if (index > 0) {
        str += '|';
      }
      str += delimiters[type];
    }
  });
  return new RegExp(str, 'm');
};

function mapify(arr, keyname, valname) {
  var map = {};
  arr.forEach(function(elem) {
    map[elem[keyname]] = elem[valname];
  });
  return map;
}

module.exports = Splitter;
