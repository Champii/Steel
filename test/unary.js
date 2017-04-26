const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Unary', () => {

  it('should produce an ++', () => {
    const string = `a++`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`a++;\n`);
      })
    ;
  });

  it('should produce an --', () => {
    const string = `a--`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`a--;\n`);
      })
    ;
  });

  it('should produce a complexe unary', () => {
    const string = `!a--?`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`!(a-- != null);\n`);
      })
    ;
  });

});
