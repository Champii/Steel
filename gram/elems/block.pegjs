Block
  = body:(
      BlockBraces
    / ass:Expression { return createNode('Statement', ass) }
    / "" { return [] }
    )
  { return createNode('Block', body); }

BlockBraces "Block"
  = IndentBlockOpen
    body:Statement+
    IndentBlockClose
  { return body; }

FunctionBlock
  = block:Block
  { return createNode('FunctionBlock', block.children); }
