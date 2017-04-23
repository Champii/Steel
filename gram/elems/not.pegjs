Not
  = ("!" / "not ") ws ass:Assignable
  { return createNode('Not', [ass]); }
