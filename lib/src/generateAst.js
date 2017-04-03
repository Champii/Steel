var _ = require('lodash');
var fs = require('fs');
var util = require('util');
var path = require('path');
var pegjs = require('pegjs');
var grammar = fs.readFileSync(path.resolve(__dirname, './light.pegjs')).toString();
var parser = pegjs.generate(grammar, { cache: true });
var whitespace = ' ';
var transpile = function (input) {
    return ;
    try {
        var a = parser.parse(input);
        return (a);
    }
    catch (e) {
        if (e.location != null) {
            var locationLength = e.location.end.offset - e.location.start.offset;
            var location_1 = input.substr(_.max([e.location.start.offset - 10, 0]), _.min([locationLength + 20, input.length]));
            console.log(e.name + ": Line " + e.location.start.line + " / Col " + e.location.start.column);
            console.log(location_1);
            console.log(whitespace.repeat(e.location.start.offset - _.max([e.location.start.offset - 10, 0])) + "^");
            throw e;
        }
        ;
        throw e;
    }
    ;
};
var module, exports = transpile;
