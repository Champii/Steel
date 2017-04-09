const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Objects', () => {

  describe('Declatation', () => {

    it('should have inline empty object declared', () => {
      const string = `foo = {}`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo = {};\n`);
        })
      ;
    });

    it('should have inline object declared', () => {
      const string = `foo = a: 1, b: 2`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo = {a: 1, b: 2};\n`);
        })
      ;
    });

    it('should have inline object neasted', () => {
      const string = `foo = a: 1, b: 2, c: d: 2, e: {a: 1}, f: -> 1`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo = {a: 1, b: 2, c: {d: 2, e: {a: 1}, f: function () {\n  return 1;\n}}};\n`);
        })
      ;
    });

    it('should have multiline object', () => {
      const string = `foo =
  a: 1
  b: 'a'
  c: -> 1
`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo = {a: 1, b: 'a', c: function () {\n  return 1;\n}};\n`);
        })
      ;
    });

    it('should have object neasted', () => {
      const string = `foo =
  a: 1
  b: 2
  c:
    d: 2
    e: {a: 1}
    f: -> 1
    g: a: a
`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo = {a: 1, b: 2, c: {d: 2, e: {a: 1}, f: function () {\n  return 1;\n}, g: {a: a}}};\n`);
        })
      ;
    });

    it('should create object with shorthand syntax', () => {
      const string = `foo =
  a
  b
  c
`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`let foo = {a, b, c};\n`);
        })
      ;
    });

  });

  describe('Usage', () => {

    it('should have a computed variable property', () => {
      const string = `a.a`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a.a;\n`);
        })
      ;
    });

    it('should have a computed numeric property', () => {
      const string = `a.1`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a[1];\n`);
        })
      ;
    });

    it('should have a computed numeric property with braces', () => {
      const string = `a[1]`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a[1];\n`);
        })
      ;
    });

    it('should have a computed variable property with braces', () => {
      const string = `a[1]`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a[1];\n`);
        })
      ;
    });

    it('should have a triple computed variable property', () => {
      const string = `a.a.a`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a.a.a;\n`);
        })
      ;
    });

    it('should have a nested variable property', () => {
      const string = `a[a.a]`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a[a.a];\n`);
        })
      ;
    });

    it('should have a complexe variable property', () => {
      const string = `a.a[a.a[1]].f a .a.f!.f()`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a.a[a.a[1]].f(a).a.f().f();\n`);
        })
      ;
    });

    it('should have a complexe variable property 2', () => {
      const string = `a.a.1 1 .a 1, 2 .b[1] 1`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a.a[1](1).a(1, 2).b[1](1);\n`);
        })
      ;
    });

    it('should have a complexe variable property call', () => {
      const string = `a[1] a .a`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a[1](a).a;\n`);
        })
      ;
    });

    it('should have a complexe variable property call 2', () => {
      const string = `a.f a .a`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a.f(a).a;\n`);
        })
      ;
    });

    it('should have a complexe variable property call 3', () => {
      const string = `a['fa'] a .a`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a['fa'](a).a;\n`);
        })
      ;
    });

    it('should have a complexe variable property call 4', () => {
      const string = `f a .a`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`f(a).a;\n`);
        })
      ;
    });

    it('should have multiline property call', () => {
      const string = `a
  .b
  .c 1
  .e -> 1
`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`a.b.c(1).e(function () {
  return 1;
});
`);
        })
      ;
    });

  });

});
