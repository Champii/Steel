Interface
  = "interface "
    ws
    id:Identifier
    ws
    block:InterfaceBlock
  { return createNode('Interface', [id, block]); }

InterfaceBlock
  = IndentBlockOpen
    types:BlockTypeDeclaration+
    IndentBlockClose
  { return createNode('InterfaceBlock', types); }

BlockTypeDeclaration
  = ws id:Identifier
    ws ex:Existance?
    ws type:InlineTypeDeclaration
    ws EndOfLine
  { return createNode('BlockTypeDeclaration', _.compact([id, type, ex])); }
