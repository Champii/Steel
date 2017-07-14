# Steel
### Strongly Typed Experimental Expressive Language

[![Build Status](https://travis-ci.org/Champii/Steel.svg?branch=master)](https://travis-ci.org/Champii/Steel)
[![Coverage Status](https://coveralls.io/repos/github/Champii/Steel/badge.svg?branch=master)](https://coveralls.io/github/Champii/Steel?branch=master)

Language that transpile to TypeScript and JavaScript.

Steel is a bootstraped language. That means the code itself is developed in Steel.

Check ./src folder for steel sources.
Check ./lib for the compiled sources.

Highly inspired from [LiveScript](http://livescript.net/).

## Goals

This language tries to implement strong static typing over a subset of Livescript.

To do so, it transpile first to TypeScript, and let it transpile to Javascript.
This allow to use the power of a well typed and designed language while smoothing its syntax.

It alse tries not to fall into the same 'over-simplification' Livescript does, and avoid to implement features complexifying the read and understanding of the code.

At term, this language aim to be more functional, and might borrow some concepts from language like Haskell or Ocaml (custom operator?, immutability?, infinite lists?, ...).

## Exemples

### Basics

```livescript
import
  fs
  path: { resolve }
  './localFile'
  './localFile2': customName

foo := number -> number -> number
foo = (a, b) -> a + b

bar = (c: number, d: number): number ~>
  if c? and d? and d isnt 0
    c + d
  else
    0

nonReturning = !-> 1

map    = (f: any, arr: any) --> arr.map f
filter = (f: any, arr: any) --> arr.filter f

[1, 2, 3]
  |> map (+ 2)
  |> filter (> 2)

class Animal
  a: 1
  b: -> 2
  constructor: (val: number) -> @a = val

class Dog: Animal

dog: Dog = new Dog 1
```

Transpiled in TypeScript with `sc -cts source.s` turns into:

```typescript
(function () {
  import fs = require('fs');
  import _path = require('path');
  let {resolve} = _path;
  import localFile = require('./localFile');
  import customName = require('./localFile2');
  let foo:(a:number,b:number) => number = function (a, b) {
    return a + b;
  };
  let bar = (c:number, d:number): number => {
    if ((c != null) && (d != null) && d !== 0) {
      return c + d;
    } else {
      return 0;
    }
  };
  let nonReturning = function (it?:any) {
    1;
  };
  let map = curry$(function (f:any, arr:any) {
    return arr.map(f);
  });
  let filter = curry$(function (f:any, arr:any) {
    return arr.filter(f);
  });
  (filter(function (it:any) {
    return it>2;
  })(map(function (it:any) {
    return it+2;
  })([1, 2, 3])));
  class Animal {
    a = 1;
    b(it?:any) {
      return 2;
    }
    constructor(val:number) {
      this.a = val;
    }
  };
  class Dog extends Animal {};
  let dog:Dog = new Dog(1);
  function curry$(f: any, bound?: any){ let context: any, _curry: any = function(args?: any){ return f.length > 1 ? function(){ var params = args ? args.concat() :[]; context = bound ? context || this : this; return params.push.apply(params, arguments) < f.length && arguments.length ? _curry.call(context, params) : f.apply(context, params); } : f; }; return _curry(); }
})();
```

## Install
  ```bash
  npm install -g steel-lang
  ```

## Compiler usage

Compiler name is `sc`, and stands for `Steel Compiler`.

### Usage
  ```bash
  $> sc -h

    Usage: sc [options] <files ...>


    Options:

      -V, --version          output the version number
      -c, --compile          Compile files
      -p, --print            Print files
      -o, --output <folder>  File/folder of output
      -s, --strict           Disallow implicit use of <Any> type
      -t, --typescript       Output Typescript instead of Javascript (no typechecking)
      -b, --bare             Dont wrap into top level anonymous function
      -q, --quiet            Dont output types errors/warnings (useful with -p)
      -h, --help             output usage information
  ```

### Compile and execute on the fly
  ```bash
  sc file.s
  ```

  You can only compile and execute single file on the fly

  Files extensions are `.s`.
  This extension is registered inside NodeJS when loading `steel-lang` to auto-compile steel files on the fly when required.

  This means you can write
  ```javascript
  require('steel-lang');
  const obj = require('./someFile.s');
  ```

### Compile a file/folder
  ```bash
  sc -c file1.s file2.s
  sc -c folder/*.s
  sc -c folder/**/*.s
  ```

  The format of the path is the same as for gulp. If you want to compile recursively or exclude some folders for exemple.

### Compile to a diferent output
  ```bash
  sc -o dir -c file1.s file2.s
  sc -o dir -c folder/*.s
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

* Generics
  ```livescript
  map = <T>(f: any, arr: T[]): T[] -> arr.map f
  map (+ 2), [1, 2, 3]
  ```

* Curry operator
  ```livescript
  # Exists for arrow function : '~~>'
  add = (a, b) --> a + b
  add5 = add 5
  add5 5 # === 10
  ```

* Auto add argument 'it' when only one
  ```livescript
  a = -> it + 2
  a 2 # === 4
  ```

* Shorthand function declaration
  ```livescript
  add2 = (+ 2)
  add2 2 # === 4

  obj = a: 1
  getA = (.a)
  getA obj # === 1
  ```

* Chained calls
  ```livescript
  [1, 2, 3]
    |> map (+ 2)
    |> filter (> 2)
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

  You can use `require` instead of `import` to make a regular require

TODO:
  * fix bug with $curry that swallows arguments type
  * generics specification on func call (map<number>(f, arr))
  * decimals
  * return loops
  * typeof, delete, instanceof, ...
  * Exports
  * Expression as assignable (if, while, ...)
  * implements
  * Class visibility (public, private,...)
  * class static
  * Class types for methods and properties
  * cast
  * Generics
  * readonly for interface
  * propname for interface
  * index for interface
  * func type for interface
  * abstract
  * Transpile code in template strings
  * Better error system (more details, more accuracy)
  * Std lib
  * Multiline string
  * Better error management for on-the-fly compilation (get rid of typescript-simple)
  * Import native (through options)
  * Add tests for
    - Operation
    - Existance
    - Function shorthand
    - Import native
    - Full compile
    - Comments
    - Generics / array type
  * Support tsconfig.json
  * (Plugin system ?)
  * |< operator for chained call with flipped arguments
