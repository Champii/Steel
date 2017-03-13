const fs    = require('fs');
const ts    = require('typescript');
const tiny  = require('tiny-parser');
const util  = require('util');
const path  = require('path');
const async = require('async');

const countTabs = (it) => {
  let i = 0;
  let count = 0;

  if (it.length === 0) {
    return 0;
  }

  while (i < it.length - 1) {
    if (it[i] === ' ' && it[i + 1] === ' ')  {
      count++;
      i += 2;
    } else {
      i++;
    }
  }

  return count;
};

const preprocessor = (filename, done) => {

  fs.readFile(filename, (err, file) => {
    if (err) {
      return done("Preprocessor: Unknown file #{err}");
    }

    const instr = file.toString().split('\n');
    const instrOrig = file.toString().split('\n');

    let tabCount = 0;
    let i = 0;

    while (i < instrOrig.length) {
      const line = instrOrig[i];
      const newTabCount = countTabs(line);

      if (tabCount < newTabCount) {
        instrOrig[i - 1] = instrOrig[i - 1] + ' {'
        tabCount = newTabCount
      } else if (tabCount > newTabCount) {
        for (let j = 0; j < tabCount - newTabCount; j++) {
          instrOrig.splice(i - j, 0, ('  ').repeat(j) + '}');
          i += 1;
        }

        tabCount = newTabCount;
      }

      i++
    }

    const baseName = filename.split('/');
    const newFileName = `/tmp/${baseName[baseName.length - 1]}_POSTPROC.live`;

    fs.writeFile(newFileName, instrOrig.join('\n'), (err, res) => {
      if (err) {
        return done(err);
      }

      done(null, newFileName);
    });
  })
};

const files = [process.argv[2]];

module.exports = (done) => {
  return new Promise((resolve, reject) => {
    async.mapSeries(files, (file, done) => {
      preprocessor(file, (err, filename) => {
        if (err) {
          return done(err);
        }

        tiny(path.resolve(__dirname, './light.gra'), filename, done);
      });

    }, (err, res) => {
      if (err) {
        return reject(err);
      }

      console.log('INSPECT AST', util.inspect(res, { depth: null }));
      return resolve(res);

    });
  });
};

