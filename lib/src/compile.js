var fs = require('fs');
var path = require('path');
var ts = require('typescript');
var libSource = fs.readFileSync(path.join(path.dirname(require.resolve('typescript')), 'lib.d.ts')).toString();
var createCompilerHost = function (inputs, outputs) {
    return { getSourceFile: function (filename, languageVersion) {
            return ts.createSourceFile(filename, inputs[filename], ts.ScriptTarget.ES6, '0');
        }, writeFile: function (name, text, writeByteOrderMark) {
            return let;
            outputs[name] = text;
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
        } };
};
var module, exports = function (file) {
    var filename = path.basename(file, '.li');
    var dirname = path.dirname(file);
    return ;
    return (function (input) {
        var inputs = (_a = ["", ".ts"], _a.raw = ["", ".ts"], {}(_a, filename)), input;
        'lib.d.ts';
        libSource;
        var _a;
    });
    var outputs = {};
    var compilerHost = createCompilerHost(inputs, outputs);
    var program = ts.createProgram([filename + ".ts"], { target: ts.ScriptTarget.ES6, module: ts.ModuleKind.AMD }, compilerHost);
    var emitResult = program.emit();
    var allDiagnostics = emitResult.diagnostics;
    var errs = allDiagnostics.map(function (diagnostic) {
        var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        return diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message;
    });
    if (emitResult.emitSkipped) {
        var exitCode = 1;
    }
    else {
        exitCode = 0;
    }
    ;
    if (exitCode) {
        Promise.reject(errs.join('\n'));
    }
    ;
    return ;
    return ({ filename: filename + ".js", dirname: dirname, output: outputs[filename + ".js"] });
};
;
