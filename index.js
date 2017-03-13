"use strict"

const fs           = require('fs');
const ts           = require('typescript');
const tiny         = require('tiny-parser');
const util         = require('util');
const path         = require('path');
const async        = require('async');


const getAst       = require('./getAst');
const compile = require('./compile');

getAst()
  .then(compile)
  .then(output => {
    console.log(output);
    // console.log('Transformed ast = ', ast);

    // const ast2 = ts.createSourceFile('./test.ts', fs.readFileSync('./test.ts').toString(), ts.ScriptTarget.ES6);

    // console.log(util.inspect(ast2, { depth: null }));
    // console.log(util.inspect(ast, { depth: null }));
    // console.log(ast.parseDiagnostics);
    // console.log(ts);

    // const compilerHost = {

    //   _output: '',
    //   _map: null,
    //   _ast: ast,

    //   directoryExists(directoryName) {
    //     return false;
    //   },

    //   useCaseSensitiveFileNames() {
    //     return false;
    //   },

    //   getCanonicalFileName(fileName) {
    //     return fileName;
    //   },

    //   getCurrentDirectory() {
    //     return '';
    //   },

    //   getNewLine() {
    //     return '\n';
    //   },

    //   getDefaultLibFileName(options) {
    //     return 'lib.d.ts';
    //   },

    //   getCancellationToken() {
    //     return null;
    //   },

    //   getDirectories(path) {
    //     return [];
    //   },

    //   get output() {
    //     return this._output;
    //   },

    //   get sourceMap() {
    //     return JSON.parse(this._map);
    //   },

    //   fileExists(fileName) {
    //     return fileName === this._ast.fileName;
    //   },

    //   readFile(fileName) {
    //     if (fileName === this._ast.fileName) {
    //       return this._ast.text;
    //     }
    //   },

    //   getSourceFile(fileName) {
    //     return this._ast;
    //   },

    //   writeFile(name, text, writeByteOrderMark) {
    //     this._output = text;
    //   },
    // }
    // const options = { module: ts.ModuleKind.AMD, target: ts.ScriptTarget.ES6 };
    // // const host = createCompilerHost(options);
    // // const compilerHost = new SingleFileHost(ast);
    // const program = ts.createProgram([], options, compilerHost);
    // // ts.createProgram(ast);

    // const emited  = program.emit();

    // console.log('FINAL OUTPUT', compilerHost.output);
  })
  .catch(console.error)
;
