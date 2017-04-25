(function () {
    let _ = require('lodash');
    let fs = require('fs');
    let util = require('util');
    let path = require('path');
    let pegjs = require('pegjs');
    let grammar = '';
    let whitespace = ' ';
    let loadGrammar = function (it) {
        let main = fs.readFileSync(path.resolve(__dirname, '../gram/steel.pegjs').toString());
        let folder = fs.readdirSync(path.resolve(__dirname, '../gram/elems'));
        let files = folder.map(function (file) {
            return fs.readFileSync(path.resolve(__dirname, `../gram/elems/${file}`)).toString() + '\n';
        });
        return grammar = _.reduce(files, function (acc, item) {
            return `${acc}${item}`;
        }, main);
    };
    loadGrammar();
    let parser = pegjs.generate(grammar, { cache: true });
    let transpile = function (pair) {
        try {
            pair[1] = parser.parse(pair[1]);
            return pair;
        }
        catch (e) {
            if (e.location != null) {
                let locationLength = e.location.end.offset - e.location.start.offset;
                let location = pair[1].substr(_.max([e.location.start.offset - 10, 0]), _.min([locationLength + 20, pair[1].length]));
                console.log(`${pair[0]}: ${e.name}: Line ${e.location.start.line} / Col ${e.location.start.column}`);
                console.log(location);
                console.log(`${whitespace.repeat(e.location.start.offset - _.max([e.location.start.offset - 10, 0]))}^`);
                throw e;
            }
            throw e;
        }
    };
    module.exports = transpile;
})();
