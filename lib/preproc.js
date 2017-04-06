var countTabs = function (it) {
    var i = 0;
    var count = 0;
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
var indent = '  ';
module.exports = function (input) {
    var instrOrig = input.toString().split('\n').filter(function (val) {
        return val.length;
    }).concat(['']);
    var tabCount = 0;
    var i = 0;
    while (i < instrOrig.length) {
        var line = instrOrig[i];
        var newTabCount = countTabs(line);
        if (tabCount < newTabCount && instrOrig[i].trim()[0] !== '.') {
            instrOrig[i - 1] = instrOrig[i - 1] + '@{';
            tabCount = newTabCount;
        }
        else if (tabCount > newTabCount) {
            for (var j = 0; j < tabCount - newTabCount; j++) {
                instrOrig.splice(i - j, 0, indent.repeat(j) + '@}');
                i += 1;
            }
            tabCount = newTabCount;
        }
        i++;
    }
    return instrOrig.join('\n');
};
