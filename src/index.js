"use strict"

let fs            = require('fs');
const ts          = require('typescript');
const tiny        = require('tiny-parser');
const hook        = require('node-hook');
const util        = require('util');
const path        = require('path');
const async       = require('async');
const bluebird    = require('bluebird');

const preproc     = require('./preproc');
const generateAst = require('./generateAst');
const transformAst = require('./transformAst');
const transpile   = require('./transpile');
const compile     = require('./compile');

fs = bluebird.promisifyAll(fs);

exports.transpileFiles = (files) => {
  return bluebird.mapSeries(files, exports.transpileFile)
};

exports.transpileFile = (file) => {
  return fs
    .readFileAsync(file)
    .then(input => exports.transpile(input, file))
  ;
};

exports.transpile = (input, file) => {
  const preprocessed   = preproc(input);
  const ast            = generateAst(preprocessed);
  const transformedAst = transformAst(ast);
  const transpiled     = transpile(transformedAst);

  const compiled       = compile(file)(transpiled);

  return compiled;
};

// For testing purpose
exports._transpileStringToTs = (input) => {
  const preprocessed = preproc(input);
  const ast          = generateAst(preprocessed);
  const transformedAst = transformAst(ast);
  const transpiled = transpile(transformedAst);

  return Promise.resolve(transpiled);
};

hook.hook('.li', (input, file) => {
  return exports.transpile(input, file).output;
});
