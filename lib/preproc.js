(function () {
    let countTabs = function (it) {
        let i = 0;
        let count = 0;
        if (it.length === 0) {
            return 0;
        }
        while (i < it.length - 1 && it[i] === ' ') {
            if (it[i] === ' ' && it[i + 1] === ' ') {
                count++;
                i += 2;
            }
            else {
                i++;
            }
        }
        return count;
    };
    let indent = '  ';
    let preprocessor = function (input) {
        let instrOrig = input.toString().split('\n').filter(function (val) {
            return val.length;
        }).concat(['']);
        let tabCount = 0;
        let i = 0;
        while (i < instrOrig.length) {
            let line = instrOrig[i];
            let newTabCount = countTabs(line);
            if (tabCount < newTabCount && instrOrig[i].trim()[0] !== '.' && instrOrig[i].trim().substr(0, 2) !== '|>') {
                instrOrig[i - 1] = instrOrig[i - 1] + '@{';
                tabCount = newTabCount;
            }
            else if (tabCount > newTabCount) {
                for (let j = 0; j < tabCount - newTabCount; j++) {
                    instrOrig.splice(i - j, 0, indent.repeat(j) + '@}');
                    i += 1;
                }
                tabCount = newTabCount;
            }
            i++;
        }
        return instrOrig.join('\n');
    };
    let _ = require('lodash');
    module.exports = function (pair) {
        pair[1] = preprocessor(pair[1]);
        return pair;
    };
})();
