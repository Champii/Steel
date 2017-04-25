"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let fs = require('fs');
let ts = require('typescript');
let path = require('path');
let gts = require('gulp-typescript');
let TypeScriptSimple = require('typescript-simple').TypeScriptSimple;
let compilerOptions = { target: 'es6', module: 'commonjs', moduleResolution: 'node', sourceMap: false, emitDecoratorMetadata: false, experimentalDecorators: false, removeComments: false, noImplicitAny: false, suppressImplicitAnyIndexErrors: true };
let tss = new TypeScriptSimple(compilerOptions);
compilerOptions = _.assign({}, { isolatedModules: true }, compilerOptions);
module.exports = function (stream) {
    let obj = compilerOptions;
    return stream.pipe(gts(obj));
};
module.exports.file = function (file) {
    return tss.compile(file.contents.toString());
};