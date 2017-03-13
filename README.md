# LightScript
Language that transpile to TypeScript

Inspired from LiveScript

## Features

* Indent based language
* Variable declaration
* Function declaration
  * Standard function
  * Arrow function
  * Last statement is returned
* Function call
  * with parentheses
  * with spaces
  * with '!' for no arguments
* If / Else
* For / While
* is / isnt
* Arithmetic operations

## Exemple

```livescript
foo = (a, b) -> a + b
bar = (c, d) ~>
  if d isnt 0
    c / d
  else
    0
```

Transpile into

```typescript
const foo = function (a, b) {
  return a + b;
};
const bar = (c, d) => {
  if (d !== 0) {
    return c / d;
  } else {
    return 0;
  }
};
```