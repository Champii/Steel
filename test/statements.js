const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Statements', () => {

  it('should have semi-column on each end of line', () => {
    const string = `foo = 1
bar = -> 1
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`let foo = 1;
let bar = function () {
  return 1;
};
`);
      })
    ;
  });

  it('should not have semi-column on structures of control', () => {
    // @todo: check why is there a need of a terminating \n
    const string = `if a is b
  a
else
  b
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`if (a === b) {
  a;
} else {
  b;
}

`);
      })
    ;
  });

});
