const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Array', () => {

  describe('Declaration', () => {

    it('should produce an empty array', () => {
      const string = `a = []`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let a = [];\n`);
        })
      ;
    });

    it('should produce an mixed array', () => {
      const string = `a = [1, 'a', { b: 2 }]`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let a = [1, 'a', {b: 2}];\n`);
        })
      ;
    });

  });

  describe('Destruction', () => {

    it('should produce an array destruct', () => {
      const string = `[a, b] = c`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let [a, b] = c;\n`);
        })
      ;
    });

  });

});
