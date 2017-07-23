const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Types', () => {

  describe('Inline', () => {

    it('should declare a typed var', () => {
      const string = `foo: number = 1`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo:number = 1;\n`);
        })
      ;
    });

    it('should declare a typed func', () => {
      const string = `foo = (a: number, b: string): number -> a`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo = function (a:number, b:string): number {
  return a;
};
`);
        })
      ;
    });

    it('should declare a typed func with func arg', () => {
      const string = `foo = (a: (a: number): number, b: string): number -> a`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo = function (a:(a: number)=> number, b:string): number {
  return a;
};
`);
        })
      ;
    });

  });

  describe('Externalized', () => {

    it('should declare a typed var', () => {
      const string = `foo := number
foo = 1`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo:number = 1;\n`);
        })
      ;
    });

    it('should declare a typed func', () => {
      const string = `foo := number -> number -> number
foo = (a, b) -> a`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo:(a:number,b:number) => number = function (a, b) {
  return a;
};
`);
        })
      ;
    });

  });

});
