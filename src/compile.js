const fs   = require('fs');
const path = require('path');
const ts   = require('typescript');

const libSource = fs.readFileSync(path.join(path.dirname(require.resolve('typescript')), 'lib.d.ts')).toString();

const createCompilerHost = (inputs, outputs) => {
  return ({
    getSourceFile: function (filename, languageVersion) {
      return ts.createSourceFile(filename, inputs[filename], ts.ScriptTarget.ES6, "0");
    },
    writeFile: function (name, text, writeByteOrderMark) {
      outputs[name] = text;
    },
    getDefaultLibFileName: function () { return "lib.d.ts"; },
    useCaseSensitiveFileNames: function () { return false; },
    getCanonicalFileName: function (filename) { return filename; },
    getCurrentDirectory: function () { return ""; },
    getNewLine: function () { return "\n"; },
  });
};

module.exports = (file) => {
  const filename = path.basename(file, '.li');
  const dirname  = path.dirname(file);

  return (input) => {
    const inputs = {
      [`${filename}.ts`]: input,
      'lib.d.ts': libSource
    };
    const outputs = {};

    const compilerHost = createCompilerHost(inputs, outputs);
    const program = ts.createProgram([`${filename}.ts`], { target: ts.ScriptTarget.ES6, module: ts.ModuleKind.AMD }, compilerHost);

    let emitResult = program.emit();

    let allDiagnostics = emitResult.diagnostics;

    const errs = allDiagnostics.map(diagnostic => {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;

    if (exitCode) {
      return Promise.reject(errs.join('\n'));
    }

    return {
      filename: `${filename}.js`,
      dirname,
      output: outputs[`${filename}.js`],
    };

  };
};
