Comment
  // = ws "#" ws chars:(SourceCharacter / "'")*
  = ws "#" ws chars:(Char / "'")*
  { return createNode('Comment', [], chars.join('')); }
