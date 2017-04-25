const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Functions', () => {

  describe('Standard', () => {

    describe('Declaration', () => {

      it('should produce a function with no arguments that returns', () => {
        const string = 'foo = -> 1';
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = function (it?) {
  return 1;
};
`);
          })
        ;
      });

      it('should produce a function with no arguments that dont returns', () => {
        const string = 'foo = !-> 1';
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = function (it?) {
  1;
};
`);
          })
        ;
      });
      it('should produce a function with one argument and returns it', () => {
        const string = 'foo = (a) -> a';
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = function (a) {
  return a;
};
`);
          })
        ;
      });

      it('should produce a function with multiple arguments and dont returns', () => {
        const string = 'foo = (a, b) !-> a';
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = function (a, b) {
  a;
};
`);
          })
        ;
      });

      it('should produce a function with multiple arguments returns last', () => {
        const string = `foo = (a, b) ->
  a
  b
`;
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = function (a, b) {
  a;
  return b;
};
`);
          })
        ;
      });

    });

    describe('Call', () => {

      describe('Parenthesis', () => {

        it('should produce and call for no arguments', () => {
          const string = `foo = -> 1
foo()`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = function (it?) {
  return 1;
};
foo();
`);
            })
          ;
        });

        it('should produce and call for one argument', () => {
          const string = `foo = (a) -> a
foo(1)`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = function (a) {
  return a;
};
foo(1);
`);
            })
          ;
        });

        it('should produce and call for multiple arguments', () => {
          const string = `foo = (a, b) -> a
foo(1, 2)`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = function (a, b) {
  return a;
};
foo(1, 2);
`);
            })
          ;
        });

      });

      describe('Spaces', () => {

        it('should produce and call for one argument', () => {
          const string = `foo = (a) -> a
foo 1`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = function (a) {
  return a;
};
foo(1);
`);
            })
          ;
        });

        it('should produce and call for multiple arguments', () => {
          const string = `foo = (a, b) -> a
foo 1, 2`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = function (a, b) {
  return a;
};
foo(1, 2);
`);
            })
          ;
        });

      });

      describe('Shebang (!)', () => {

        it('should produce and call with no arguments', () => {
          const string = `foo = -> 1
foo!`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = function (it?) {
  return 1;
};
foo();
`);
            })
          ;
        });

      });

    });

  });

  describe('Arrow', () => {

    describe('Declaration', () => {

      it('should produce a function with no arguments that returns', () => {
        const string = 'foo = ~> 1';
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = (it?) => {
  return 1;
};
`);
          })
        ;
      });

      it('should produce a function with no arguments that dont returns', () => {
        const string = 'foo = !~> 1';
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = (it?) => {
  1;
};
`);
          })
        ;
      });
      it('should produce a function with one argument and returns it', () => {
        const string = 'foo = (a) ~> a';
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = (a) => {
  return a;
};
`);
          })
        ;
      });

      it('should produce a function with multiple arguments and dont returns', () => {
        const string = 'foo = (a, b) !~> a';
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = (a, b) => {
  a;
};
`);
          })
        ;
      });

      it('should produce a function with multiple arguments returns last', () => {
        const string = `foo = (a, b) ~>
  c = 1
  b
`;
        const promise = lightscript._transpileStringToTs(string);

        return expect(promise).to.be.fulfilled
          .then(res => {
            expect(res).to.eq(`let foo = (a, b) => {
  let c = 1;
  return b;
};
`);
          })
        ;
      });

    });

    describe('Call', () => {

      describe('Parenthesis', () => {

        it('should produce and call for no arguments', () => {
          const string = `foo = ~> 1
foo()`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = (it?) => {
  return 1;
};
foo();
`);
            })
          ;
        });

        it('should produce and call for one argument', () => {
          const string = `foo = (a) ~> a
foo(1)`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = (a) => {
  return a;
};
foo(1);
`);
            })
          ;
        });

        it('should produce and call for multiple arguments', () => {
          const string = `foo = (a, b) ~> a
foo(1, 2)`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = (a, b) => {
  return a;
};
foo(1, 2);
`);
            })
          ;
        });

      });

      describe('Spaces', () => {

        it('should produce and call for one argument', () => {
          const string = `foo = (a) ~> a
foo 1`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = (a) => {
  return a;
};
foo(1);
`);
            })
          ;
        });

        it('should produce and call for multiple arguments', () => {
          const string = `foo = (a, b) ~> a
foo 1, 2`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = (a, b) => {
  return a;
};
foo(1, 2);
`);
            })
          ;
        });

      });

      describe('Shebang (!)', () => {

        it('should produce and call with no arguments', () => {
          const string = `foo = ~> 1
foo!`;
          const promise = lightscript._transpileStringToTs(string);

          return expect(promise).to.be.fulfilled
            .then(res => {
              expect(res).to.eq(`let foo = (it?) => {
  return 1;
};
foo();
`);
            })
          ;
        });

      });

    });

  });

});
