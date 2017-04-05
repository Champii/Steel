var fs = require('fs');
var ts = require('typescript');
var tiny = require('tiny-parser');
var hook = require('node-hook');
var util = require('util');
var path = require('path');
var async = require('async');
var bluebird = require('bluebird');
var preproc = require('./preproc');
var generateAst = require('./generateAst');
var transformAst = require('./transformAst');
var transpile = require('./transpile');
var compile = require('./compile');
fs = bluebird.promisifyAll(fs);
exports.transpileFiles = function (files) {
    return bluebird.mapSeries(files, exports.transpileFile);
};
exports.transpileFile = function (file) {
    return fs.readFileAsync(file).then(function (input) {
        return exports.transpile(input, file);
    });
};
exports.transpile = function (input, file) {
    console.log('Start');
    var preprocessed = preproc(input);
    console.log('Processed');
    var ast = generateAst(file, preprocessed);
    console.log('Ast');
    var transformedAst = transformAst(ast);
    console.log('TransformedAst');
    var transpiled = transpile(transformedAst);
    var compileFunc = compile(file);
    var compiled = compileFunc(transpiled);
    return compiled;
};
exports._transpileStringToTs = function (input) {
    preprocessed = preproc(input);
    ast = generateAst(preprocessed);
    transformedAst = transformAst(ast);
    transpiled = transpile(transformedAst);
    return Promise.resolve(transpiled);
};
hook.hook('.li', function (input, file) {
    return exports.transpile(input, file).output;
});
