Comment
  = ws "#" ws chars:(Char / "'")*
  { return createNode('Comment', [], chars.join('')); }
