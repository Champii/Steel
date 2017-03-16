const fs = require('fs');
const ts = require('typescript');

module.exports = (string) => {
  // console.log(string);
  fs.writeFileSync('./out/test.ts', string);

  let program = ts.createProgram(['./out/test.ts'], {
    noEmitOnError: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES6,
    module: ts.ModuleKind.CommonJS
  });

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

};
