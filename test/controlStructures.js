const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Controle Structures', () => {

  describe('If', () => {

    it('should produce a single if', () => {
      const string = `if a
  1`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`if (a) {
  1;
}
`);
        })
      ;
    });

    it('should produce a if else', () => {
      const string = `if a
  1
else
  2`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`if (a) {
  1;
} else {
  2;
}
`);
        })
      ;
    });

    it('should produce a if elseif', () => {
      const string = `if a
  1
else if b
  2`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`if (a) {
  1;
} else if (b) {
  2;
}
`);
        })
      ;
    });

    it('should produce a if elseif elseif', () => {
      const string = `if a
  1
else if b
  2
else if c
  3`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`if (a) {
  1;
} else if (b) {
  2;
} else if (c) {
  3;
}
`);
        })
      ;
    });

    it('should produce a if elseif else', () => {
      const string = `if a
  1
else if b
  2
else
  3`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`if (a) {
  1;
} else if (b) {
  2;
} else {
  3;
}
`);
        })
      ;
    });

  });

  describe('For', () => {

    it('should produce a single for', () => {
      const string = `for a = 2; a < b; a++
  1`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`for (let a = 2;a < b;a++) {
  1;
}
`);
        })
      ;
    });

  });

  describe('While', () => {

    it('should produce a single while', () => {
      const string = `while a < b
  1`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`while (a < b) {
  1;
}
`);
        })
      ;
    });

  });

  describe('Try/Catch', () => {

    it('should produce a single try', () => {
      const string = `try
  JSON.parse data`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`try {
  JSON.parse(data);
}
`);
        })
      ;
    });

    it('should produce a try catch without args', () => {
      const string = `try
  JSON.parse data
catch
  console.log 'catch'`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`try {
  JSON.parse(data);
} catch () {
  console.log('catch');
}
`);
        })
      ;
    });

    it('should produce a try catch with args', () => {
      const string = `try
  JSON.parse data
catch e
  console.log e`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`try {
  JSON.parse(data);
} catch (e) {
  console.log(e);
}
`);
        })
      ;
    });

  });

  describe('Return', () => {

    it('should produce a return', () => {
      const string = `return 3`;
      const promise = lightscript._transpileStringToTs(string);

      return expect(promise).to.be.fulfilled
        .then(res => {
          expect(res).to.eq(`return 3;
`);
        })
      ;
    });

  });

});
