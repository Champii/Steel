const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Variables', () => {

  describe('Declaration', () => {

    it('should produce a let variable', () => {
      const string = 'foo = 1';
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq('let foo = 1;\n');
        })
      ;
    });

    it('should not produce a let variable on second use', () => {
      const string = `foo = 1
foo = 2`;

      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo = 1;
foo = 2;
`);
        })
      ;
    });

  });

});
