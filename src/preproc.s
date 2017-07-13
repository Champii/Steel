require
  lodash

countTabs = (it) ->
  i = 0
  count = 0

  if it.length is 0
    return 0

  while i < it.length - 1 && it[i] is ' '
    if it[i] is ' ' && it[i + 1] is ' '
      count++
      i += 2
    else
      i++

  count

indent = '  '

preprocessor = (input) ->
  instrOrig = input
  .toString!
  .split('\n')
  .filter((val) -> val.length)
  .concat([''])

  tabCount = 0
  i = 0

  while i < instrOrig.length
    line = instrOrig[i]
    newTabCount = countTabs line
    trimed = instrOrig[i].trim!

    if tabCount < newTabCount && trimed.substr(0, 2) isnt '|>'
      instrOrig[i - 1] = instrOrig[i - 1] + '@{'
      tabCount = newTabCount
    else if tabCount > newTabCount
      for j = 0; j < tabCount - newTabCount; j++
        instrOrig.splice(i - j, 0, indent.repeat(j) + '@}')
        i += 1

      tabCount = newTabCount

    i++

  instrOrig.join '\n'

module.exports = (pair) ->
  pair.1 = preprocessor pair.1
  # console.log pair.1
  pair
