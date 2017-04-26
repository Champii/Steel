const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Classes', () => {

  describe('without types', () => {

    it('should produce an empty class', () => {
      const string = `class A`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`class A {};\n`);
        })
      ;
    });

    it('should produce a good class output', () => {
      const string = `class A
  a: 1
  constructor: -> 1
  b: (a, b) ->
    2
inst = new A`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`class A {
  a = 1;
  constructor(it?) {
    1;
  }
  b(a, b) {
    return 2;
  }
};
let inst = new A;
`);
        })
      ;
    });

  });

  describe('Inheritance', () => {

    it('should produce an inherited class', () => {
      const string = `class A
class B: A`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`class A {};
class B extends A {};\n`);
        })
      ;
    });

    it('should produce an full inherited class', () => {
      const string = `class A
  a: 1
  b: -> 2

class B: A
  b: -> super.b!
  c: -> d`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`class A {
  a = 1;
  b(it?) {
    return 2;
  }
};
class B extends A {
  b(it?) {
    return super.b();
  }
  c(it?) {
    return d;
  }
};\n`);
        })
      ;
    });

  });

});
