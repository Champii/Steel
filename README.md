# LightScript
Language that transpile to TypeScript

Inspired from LiveScript

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
  foo: number
  foo = 1

  bar: number -> number -> number
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
  for a < b
    a = a + 1
  ```

* is / isnt (not working now, conflicting with space declarated function arguments)
* Arithmetic operations

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
  a: number
  a: 1

  b: string -> string
  b: (arg) -> 'bar'
```

Transpile into

```typescript
class Foo {
  a: string = 1
  b(arg: string): string {
    return 'bar';
  }
}
```

TODO:
  * Inline function return type declaration