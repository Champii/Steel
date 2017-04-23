ArrayDestruct
  = BraceOpen
    body: ArrayDestructPropertyComa+
    BraceClose
  { return createNode('ArrayDestruct', body); }

ArrayDestructPropertyComa
  = ws
    id:Identifier
    ws
    Coma? EndOfLine?
  { return createNode('ArrayDestructPropertyComa', id); }
