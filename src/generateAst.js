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

const preprocessor = (input) => {
  const instrOrig = input.toString().split('\n').filter(val => val.length).concat(['']);

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

  return Promise.resolve(instrOrig.join('\n'));
};

module.exports = (input) => {
  let grammar;

  return fs
    .readFileAsync(path.resolve(__dirname, './light.gra'))
    .then(_grammar => {
      grammar = _grammar;

      return preprocessor(input);
    })
    .then(preprocessed => {
      return tiny(grammar, Buffer.from(preprocessed));
    })
    // .then(ast => console.log(util.inspect(ast, { depth: null })))
  ;
};

