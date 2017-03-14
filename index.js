"use strict"

const fs           = require('fs');
const ts           = require('typescript');
const tiny         = require('tiny-parser');
const util         = require('util');
const path         = require('path');
const async        = require('async');

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

const getAst       = require('./getAst');
const compile      = require('./compile');

getAst()
  .then(compile)
  .then(output => {
    // console.log(output);

    fs.writeFileSync('./out/test.ts', output);

    let program = ts.createProgram(['./out/test.ts'], {
      noEmitOnError: true,
      noImplicitAny: true,
      target: ts.ScriptTarget.ES6,
      module: ts.ModuleKind.CommonJS
    });

    let emitResult = program.emit();

    let allDiagnostics = emitResult.diagnostics;

    allDiagnostics.forEach(diagnostic => {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;

    if (exitCode) {
      console.log(`Process exiting with code '${exitCode}'.`);
    }
  })
  .catch(console.error)
;
