const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Chained calls', () => {

  it('should have simple chained call', () => {
    const string = `a = [1, 2, 3] |> map console.log`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`let a = (map(console.log)([1, 2, 3]));
`);
      })
    ;
  });

  it('should have complexe chained call', () => {
    const string = `a = b
  |> map console.log
  |> foo 1
`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`let a = (foo(1)(map(console.log)(b)));
`);
      })
    ;
  });

});
