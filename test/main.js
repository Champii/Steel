const chai           = require('chai');
const Vinyl          = require('vinyl');
const stream         = require('stream');
const chaiAsPromised = require('chai-as-promised');

const steel          = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Main process', () => {

  describe('Full compile', () => {

    it('should process file with no error', (done) => {
      this.timeout(5000);
      const pair = new Vinyl({ path: '/tmp/test.s', contents: new Buffer(`a = []`)});
      const passStream = new stream.PassThrough({ objectMode: true });

      const outStream = steel.transpileStream(passStream);

      outStream.on('data', (file) => {
        expect(file.path).to.eq('/tmp/test.js');
        expect(file.contents.toString()).to.eq(`(function () {
    let a = [];
})();
`);
      });

      outStream.on('error', (err) => {
        done(new Error('Error'));
      });

      outStream.on('end', (err) => {
        done();
      });

      passStream.push(pair);
      passStream.push(null);

    });

    it('should process file with error', (done) => {
      this.timeout(5000);
      const pair = new Vinyl({ path: '/tmp/test.s', contents: new Buffer(`a: number = 'a'`)});
      const passStream = new stream.PassThrough({ objectMode: true });

      const outStream = steel.transpileStream(passStream);

      outStream.on('data', (file) => {
      });

      outStream.on('error', (err) => {
        done();
        done = () => {};
      });

      passStream.push(pair);
      passStream.push(null);

    });

  });

});
