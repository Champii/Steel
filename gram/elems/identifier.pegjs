Identifier "Identifier"
  = !ReservedWords
    $IdentifierChar+
  { return createNode('Identifier', [], text()); }

IdentifierChar "IdentifierChar"
  = [_a-zA-Z] [a-zA-Z0-9_\-]*