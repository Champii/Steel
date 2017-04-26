const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Import', () => {

  it('should produce an basic import', () => {
    const string = `import
  fs
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`import fs = require('fs');\n`);
      })
    ;
  });

  it('should produce an double import', () => {
    const string = `import
  fs
  lodash
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`import fs = require('fs');
import lodash = require('lodash');\n`);
      })
    ;
  });

  it('should produce an named import', () => {
    const string = `import
  fs: newFs
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`import newFs = require('fs');\n`);
      })
    ;
  });

  it('should produce an selective import', () => {
    const string = `import
  fs: { readFile, writeFile }
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`import _fs = require('fs');
let {readFile, writeFile} = _fs;\n`);
      })
    ;
  });

  it('should produce an custom import', () => {
    const string = `import
  './foo/bar'
  './foo/bar.js'
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`import bar = require('./foo/bar');
import bar = require('./foo/bar.js');\n`);
      })
    ;
  });

  it('should produce an named custom import', () => {
    const string = `import
  './foo/bar': toto
  './foo/bar.js': { tata }
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`import toto = require('./foo/bar');
import _bar = require('./foo/bar.js');
let {tata} = _bar;\n`);
      })
    ;
  });

  it('should do all in one', () => {
    const string = `import
  fs
  lodash: _
  path: { resolve }
  './foo/bar'
  './foo/bar.js': toto
  './foo/bar2.js': { tata }
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`import fs = require('fs');
import _ = require('lodash');
import _path = require('path');
let {resolve} = _path;
import bar = require('./foo/bar');
import toto = require('./foo/bar.js');
import _bar2 = require('./foo/bar2.js');
let {tata} = _bar2;\n`);
      })
    ;
  });

});
