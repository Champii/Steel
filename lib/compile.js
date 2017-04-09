/// <reference path="node.d.ts" />
var _ = require('lodash');
var fs = require('fs');
var ts = require('typescript');
var path = require('path');
var tsPath = path.dirname(require.resolve('typescript'));
var libSource = fs.readFileSync(path.join(tsPath, 'lib.d.ts')).toString();
var es2015Source = fs.readFileSync(path.join(tsPath, 'lib.es2015.d.ts')).toString();
var es7Source = fs.readFileSync(path.join(tsPath, 'lib.es2016.d.ts')).toString();
var nodeSource = fs.readFileSync(path.resolve('.', './typings/globals/node/index.d.ts')).toString();
var createCompilerHost = function (inputs, outputs) {
    return { getSourceFile: function (filename, languageVersion) {
            var file = inputs[filename];
            if (filename.substr(0, 4) === 'lib.') {
                file = fs.readFileSync(path.join(tsPath, filename)).toString();
            }
            return ts.createSourceFile(filename, file, ts.ScriptTarget.ES6, '0');
        }, writeFile: function (name, text, writeByteOrderMark) {
            return outputs[name] = text;
        }, getDefaultLibFileName: function () {
            return 'lib.d.ts';
        }, useCaseSensitiveFileNames: function () {
            return false;
        }, getCanonicalFileName: function (filename) {
            return filename;
        }, getCurrentDirectory: function () {
            return '';
        }, getNewLine: function () {
            return '\n';
        }, fileExists: function () {
        } };
};
module.exports = function (file) {
    var filename = path.basename(file, '.s');
    var dirname = path.dirname(file);
    return function (input) {
        input = '/// <reference path=\"node.d.ts\" />\n' + input;
        var filesIn = (_a = {}, _a[filename + ".ts"] = input, _a['lib.d.ts'] = libSource, _a['node.d.ts'] = nodeSource, _a['ES2015.ts'] = es2015Source, _a['ES2016.ts'] = es7Source, _a);
        var filesOut = {};
        var compilerHost = createCompilerHost(filesIn, filesOut);
        var program = ts.createProgram([filename + ".ts"], { target: ts.ScriptTarget.ES6, module: ts.ModuleKind.CommonJS, lib: ['ES2015', 'ES2016'] }, compilerHost);
        var emitResult = program.emit();
        var allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        var errs = allDiagnostics.map(function (diagnostic) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            return diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message;
        });
        var exitCode = 0;
        if (emitResult.emitSkipped) {
            exitCode = 1;
        }
        errs = _.compact(errs);
        if (errs.length || exitCode) {
            return Promise.reject(errs.join('\n'));
        }
        return { filename: filename + ".js", dirname: dirname, output: filesOut[filename + ".js"] };
        var _a;
    };
};
