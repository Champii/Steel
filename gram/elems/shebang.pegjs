Shebang
  = "#!" (!LineTerminatorSequence SourceCharacter)* LineTerminatorSequence
  { return createNode('Shebang', [], text()); }
