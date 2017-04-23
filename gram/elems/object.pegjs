Object
  =obj:(
      EmptyObject
    / IndentObjectBlock
    / ObjectBlock
    / ObjectProperties
    )
  { return createNode('Object', obj);}

EmptyObject
  = ws "{" ws "}" ws
  { return []; }

ObjectBlock
  = BlockOpen
    body: (ObjectPropertyLine / ObjectDestructPropertyComa)*
    BlockClose
  { return body; }

IndentObjectBlock
  = IndentBlockOpen
    body: (ObjectPropertyLine / ObjectDestructPropertyComa)*
    IndentBlockClose
  { return body; }

ObjectProperties
  = id:(
      Identifier
    / Literal
    )
    Colon
    ass:Assignable
    tail: ObjectPropertyComa?
  { return createNode('ObjectProperties', _.compact([id, ass, tail])); }

ObjectPropertyPair
  = id:(
      Identifier
    / Literal
    )
    Colon
    ass:Assignable
  { return createNode('ObjectPropertyPair', _.compact([id, ass])); }

ObjectPropertyComa
  = Coma
    body: ObjectProperties
  { return createNode('ObjectPropertyComa', body); }

ObjectPropertyLine
  = ws
    prop: ObjectProperties
    ws
    Coma?
    EndOfLine?
  { return prop; }
