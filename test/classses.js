const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Classes', () => {

  describe('without types', () => {

    it('should produce a good class output', () => {
      const string = `class A
  a: 1
  constructor: -> 1
  b: (a, b) ->
    2
`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`class A {
  a = 1;
  constructor(it) {
    1;
  }
  b(a, b) {
    return 2;
  }
};
`);
        })
      ;
    });

  });

});
