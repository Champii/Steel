/// <reference path="node.d.ts" />
var _ = require('lodash');
var fs = require('fs');
var util = require('util');
var path = require('path');
var pegjs = require('pegjs');
var grammar = '';
var whitespace = ' ';
var loadGrammar = function () {
    var main = fs.readFileSync(path.resolve(__dirname, '../gram/steel.pegjs').toString());
    var folder = fs.readdirSync(path.resolve(__dirname, '../gram/elems'));
    var files = folder.map(function (file) {
        return fs.readFileSync(path.resolve(__dirname, "../gram/elems/" + file)).toString() + '\n';
    });
    return grammar = _.reduce(files, function (acc, item) {
        return "" + acc + item;
    }, main);
};
loadGrammar();
var parser = pegjs.generate(grammar, { cache: true });
var transpile = function (filename, input) {
    try {
        return parser.parse(input);
    }
    catch (e) {
        if (e.location != null) {
            var locationLength = e.location.end.offset - e.location.start.offset;
            var location = input.substr(_.max([e.location.start.offset - 10, 0]), _.min([locationLength + 20, input.length]));
            console.log(filename + ": " + e.name + ": Line " + e.location.start.line + " / Col " + e.location.start.column);
            console.log(location);
            console.log(whitespace.repeat(e.location.start.offset - _.max([e.location.start.offset - 10, 0])) + "^");
            throw e;
        }
        throw e;
    }
};
module.exports = transpile;
