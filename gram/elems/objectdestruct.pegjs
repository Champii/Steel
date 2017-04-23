ObjectDestruct
  = BlockOpen
    body: ObjectDestructPropertyComa+
    BlockClose
  { return createNode('ObjectDestruct', body); }

ObjectDestructPropertyComa
  = ws
    id:Identifier
    ws
    Coma? EndOfLine?
  { return createNode('ObjectDestructPropertyComa', id); }
