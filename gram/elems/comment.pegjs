Comment
  = ws "#" ws chars:(SourceCharacter / "'")*
  { return createNode('Comment', [], chars.join('')); }
