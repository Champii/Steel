const chai           = require('chai');
const gulp           = require('gulp');
const Vinyl          = require('vinyl');
const stream         = require('stream');
const chaiAsPromised = require('chai-as-promised');

const steel          = require('../');

const expect         = chai.expect;

chai.use(chaiAsPromised);

describe('Main process', () => {

  describe('Full compile', () => {

    it('should recompile the whole project without errors', function (done) {
      this.timeout(10000);
      const outStream = steel.transpileStream(gulp.src('./src/*'));

      outStream.on('data', (file) => {
      });

      outStream.on('error', (err) => {
        done(new Error('Error'));
      });

      outStream.on('end', (err) => {
        done();
      });

    });

    it('should process file with no error', function (done) {
      this.timeout(10000);
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

    it('should process file with error', function (done) {
      this.timeout(10000);
      const pair = new Vinyl({ path: '/tmp/test.s', contents: new Buffer(`a: number = 'a'`)});
      const passStream = new stream.PassThrough({ objectMode: true });

      const outStream = steel.transpileStream(passStream, { quiet: true });

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
