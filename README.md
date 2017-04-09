# Steel
### Strongly Typed Experimental Expressive Language

Language that transpile to TypeScript and JavaScript

Steel is a bootstraped language. That means the code itself is developed in Steel.

Check ./src folder for sources

Inspired from LiveScript

## Install
  ```bash
  npm install -g steel-lang
  ```

## Compiler usage
### Compile and execute on the fly
  ```bash
  sc file.s
  ```

  Files extensions are `.s`. This extension is registered inside NodeJS when loading `steel-lang` to auto-compile steel files on the fly when required

### Compile a file/folder
  ```bash
  sc -c file1.s file2.s
  sc -c folder
  ```

  If a folder is given, every files inside will be recursively compiled and will stay at their original path. See `-o` option below to set a different output directory.

### Compile to a diferent output
  ```bash
  sc -o dir -c file1.s file2.s
  sc -o dir -c folder
  ```

  Will output compiled files into `dir` folder.

  If the folder doesnt exists, it is created on the fly.

  The arborescence is recreated if a folder is recursively compiled.


## Features

* Indent based language
  ```livescript
  if a is b
    a
  else
    b
  ```

* Variable declaration
  ```livescript
  foo = 1
  bar = -> 2
  ```

* Inline type declaration
  ```livescript
  foo: number = 1
  bar = (a: number, b: number) -> a + b
  ```

* Externalized type declaration
  ```livescript
  foo := number
  foo = 1

  bar := number -> number -> number
  bar = (a, b) -> a + b
  ```

* Function declaration
  * Standard function
    ```livescript
    foo = (a, b) -> a + b
    ```

  * Arrow function
    ```livescript
    foo = (a, b) ~> a + b
    ```

  * Last statement is returned (can be disabled by '!')
    ```livescript
    foo = (a, b) -> a + b
    # bar does not return its result
    bar = (a, b) !-> a + b
    ```

  * Argument types
    ```livescript
    foo = (a:number, b: number) -> a + b
    ```

* Function call
  * with parentheses
    ```livescript
    foo(1, 'a', var1)
    ```

  * with spaces
    ```livescript
    foo 1, 'a', var1
    ```

  * with '!' for no arguments
    ```livescript
    foo()
    # same as
    foo!
    ```

* Objects
  ```livescript
  obj1 = {}
  obj1 = { a: 1 }
  obj1 = a: 1, b: variable, c: -> 3, d: e: 4
  obj2 =
    a: 1
    b: variable
    c: -> 3
    d:
      e: 4
  ```

* Object usage
  ```livescript
    obj.a.b(a.b).1.c!.f 1, 2 .d
  ```

* Array
  ```livescript
    arr = [1, 2, 3]
  ```

* Class
  * Property declaration
    ```livescript
    class Test
      a: 1
    ```

  * Method declaration
    ```livescript
    class Test
      b: -> 2
    ```

* If / Else
  ```livescript
  if a is b
    a
  else
    b
  ```

* For / While
  ```livescript
  while a < b
    a = a + 1

  for i = 0; i < 10; i++
    console.log i
  ```

* Try / Catch
  ```livescript
  try
    a = JSON.parse foo
  catch e
    console.error e
  ```


* 'is / isnt' become '=== / !=='
* 'and / or' become '&& / ||'
* Arithmetic operations

* Import
  ```livescript
  import
    fs
    lodash: _
    path: { resolve }
    './foo/bar'
  ```

  Become

  ```typescript
  import fs = require('fs');
  import _ = require('lodash');
  import _path = require('path');
  let {resolve} = _path;
  import bar = require('./foo/bar');
  ```

## Exemples

### Basics

```livescript
foo: number -> number -> number
foo = (a, b) -> a + b

bar = (c, d) ~>
  if d isnt 0
    c / d
  else
    0

nonReturning = !-> 1
```

Transpile into

```typescript
const foo: (a: number, b: number) => number = function (a, b) {
  return a + b;
};

const bar = (c, d) => {
  if (d !== 0) {
    return c / d;
  } else {
    return 0;
  }
};

const nonReturning = function () {
  1;
};
```

### Classes

```livescript
class Foo
  a: 1

  b: (arg) -> 'bar'
```

Transpile into

```typescript
class Foo {
  a = 1
  b(arg) {
    return 'bar';
  }
}
```

TODO:
  * Solve bug with variable scope declaration
  * Inline function return type declaration
  * Class types for methods and properties
  * Interface and abstract
  * Add tests for
    - If
    - Else
    - For
    - While
    - Not
    - Class
    - New
    - Import
    - Try/Catch
    - TestOps
    - Unary
    - Operation
    - Return
    - Throw