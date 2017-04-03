
const countTabs = (it) => {
  let i = 0;
  let count = 0;

  if (it.length === 0) {
    return 0;
  }

  while (i < it.length - 1 && it[i] === ' ') {
    if (it[i] === ' ' && it[i + 1] === ' ')  {
      count++;
      i += 2;
    } else {
      i++;
    }
  }

  return count;
};

module.exports = (input) => {
  const instrOrig = input.toString().split('\n').filter(val => val.length).concat(['']);

  let tabCount = 0;
  let i = 0;

  while (i < instrOrig.length) {
    const line = instrOrig[i];
    const newTabCount = countTabs(line);

    if (tabCount < newTabCount && instrOrig[i].trim()[0] !== '.') {
      instrOrig[i - 1] = instrOrig[i - 1] + '@{'
      tabCount = newTabCount
    } else if (tabCount > newTabCount) {
      for (let j = 0; j < tabCount - newTabCount; j++) {
        instrOrig.splice(i - j, 0, ('  ').repeat(j) + '@}');
        i += 1;
      }

      tabCount = newTabCount;
    }

    i++
  }

  // console.log(instrOrig.join('\n'));
  return instrOrig.join('\n');
};
