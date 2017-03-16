"use strict"

let fs            = require('fs');
const ts          = require('typescript');
const tiny        = require('tiny-parser');
const util        = require('util');
const path        = require('path');
const async       = require('async');
const bluebird    = require('bluebird');

const generateAst = require('./generateAst');
const transpile   = require('./transpile');
const compile     = require('./compile');

fs = bluebird.promisifyAll(fs);

exports.transpileFiles = (files) => {
  const promises = files.map(file => {
    process.stdout.write(file + ' -> ');

    return fs.readFileAsync(file)
      .then(generateAst)
      .then(transpile)
      .then(compile)
      .then(() => console.log('OK'))
      .catch(errs => console.log('FAILED\n', errs))
    ;
  });

  return bluebird.mapSeries(promises, () => {});
};

exports.transpileStrings = (strings) => {
};

// For testing purpose
exports._transpileStringToTs = (string) => {
  return generateAst(string)
    .then(transpile)
  ;
};
