Array
  =arr:(
      EmptyArray
    / ArrayBlock
    / (
        BraceOpen
        ArrayProperties
        BraceClose
      )
    )
  { return createNode('Array', arr);}

EmptyArray
  = ws "[" ws "]" ws
  { return []; }

ArrayBlock
  = BraceOpen
    body: ArrayPropertyLine*
    BraceClose
  { return body; }

ArrayProperties
  = ass:  Expression
    tail: ArrayPropertyComa?
  { return createNode('ArrayProperties', _.compact([ass, tail])); }

ArrayPropertyComa
  = Coma
    body: ArrayProperties
  { return createNode('ArrayPropertyComa', body); }

ArrayPropertyLine
  = ws
    prop: ArrayProperties
    ws
    Coma?
    EndOfLine?
  { return prop; }
