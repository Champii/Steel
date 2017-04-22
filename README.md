# Steel
### Strongly Typed Experimental Expressive Language

Language that transpile to TypeScript and JavaScript

Steel is a bootstraped language. That means the code itself is developed in Steel.

Check ./src folder for steel sources
Check ./lib for the compiled sources

Highly inspired from [LiveScript](http://livescript.net/)

## Exemples

### Basics

```livescript
foo: number -> number -> number
foo = (a, b) -> a + b

bar = (c: number, d: number): number ~>
  if c? and d?
    c + d
  else
    0

nonReturning = !-> 1

class Animal
  a: 1
  b: -> 2
  constructor: (val: number) -> @a = val

class Dog: Animal

dog: Dog = new Dog
```

Transpile into

```typescript
const foo: (a: number, b: number) => number = function (a, b) {
  return a + b;
};

const bar = (c: number, d: number): number => {
  if ((c != null) && (d != null)) {
    return c + d;
  } else {
    return 0;
  }
};

const nonReturning = function () {
  1;
};

class Animal {
  a = 1
  b() {
    return 1;
  }
  constructor(val:number) {
    this.a = val;
  }
}

class Dog extends Animal {};

let dog: Dog = new Dog();
```

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
  bar = (a: number, b: number): number -> a + b
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
    foo = (a:number, b: number):number -> a + b
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

* Curry operator
  ```livescript
  # Exists for arrow function : '~~>'
  add = (a, b) --> a + b
  add5 = add 5
  add5 5 # === 10
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
  ```livescript
  class Animal
    walk: -> 1

  class Dog: Animal
    a: 1
    walk: -> super.walk! + 1
  ```

* Interface
  ```livescript
  interface Test
    a: number
    b?: string
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

* 'not' stands for '!'
* '?' for existance checks (!= null)
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

TODO:
  * implements
  * Options for compiler
  * Transpile code in template strings
  * Better scoped variables (bug in 'let')
  * Better error system (more details, more accuracy)
  * Class types for methods and properties
  * Class visibility (public, private,...)
  * class static
  * cast
  * Generics
  * readonly for interface
  * propname for interface
  * index for interface
  * func type for interface
  * abstract
  * method chaining |>
  * function shorthand (+2)
  * Better multiline chaining of ComputedProperty
  * curry operator --> and ~~>
  * Std lib
  * Split grammar
  * Add tests for
    - If
    - Else
    - For
    - While
    - Not
    - Class
    - Interface
    - New
    - Import
    - Try/Catch
    - TestOps
    - Unary
    - Operation
    - Return
    - Throw
  * (Plugin system ?)