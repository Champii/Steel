const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Operations', () => {

  it('should have simple operation', () => {
    const string = `a = 1 + 1`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`let a = 1 + 1;
`);
      })
    ;
  });

  it('should have complexe operation', () => {
    const string = `a = a.foo(1) + b 1`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`let a = a.foo(1) + b(1);
`);
      })
    ;
  });

});
