const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const lightscript    = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Interface', () => {

  it('should produce a good interface', () => {
    const string = `interface Obj
  a: number
  b?: string`;
    const promise = lightscript._transpileStringToTs(string);

    return expect(promise).to.be.fulfilled
      .then(res => {
        expect(res).to.eq(`interface Obj {
  a:number;
  b?:string;
};
`);
      })
    ;
  });

});
