TestOp
  = op:(
      (
        op:(
          "isnt"
        / "is"
        / "and"
        / "or"
        )
        " "
        { return op; }
      )
      /
      (
        "<"
      / "==="
      / "!=="
      / "=="
      / "!="
      / "<="
      / ">"
      / ">="
      / "&&"
      / "||"
    )
  )
  { return createNode('TestOp', [], op); }
