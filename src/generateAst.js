"use strict"

const _          = require('lodash');
const fs         = require('fs');
const util       = require('util');
const path       = require('path');
const pegjs      = require('pegjs');

const grammar    = fs.readFileSync(path.resolve(__dirname, './light.pegjs')).toString();

const parser     = pegjs.generate(grammar, { cache: true });

const transpile = (input) => {
  let a;

  try {
    a = parser.parse(input);

    // console.log(util.inspect(a, { depth: null }));

    return a;
  } catch (e) {
    if (e.location != null) {
      let locationLength = e.location.end.offset - e.location.start.offset;
      const location = input.substr(_.max([e.location.start.offset - 10, 0]), _.min([locationLength + 20, input.length]));

      console.log(`${e.name}: Line ${e.location.start.line} / Col ${e.location.start.column}`);
      console.log(location);
      console.log(`${(' ').repeat(e.location.start.offset - _.max([e.location.start.offset - 10, 0]))}^`);

      throw e;
    }

    throw e;
  }
};

module.exports = transpile;
