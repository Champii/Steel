ReservedWords
  = TestOp
  / (
      (
        "interface"
      / "class"
      / "for"
      / "while"
      / "if"
      / "else"
      / "not"
      / "return"
      )
      " "
    )

ReservedWord
  = Keyword
  / FutureReservedWord
  / NullLiteral
  / BooleanLiteral

FutureReservedWord
  = ClassToken
  / ConstToken
  / EnumToken
  / ExportToken
  / ExtendsToken
  / ImportToken
  / SuperToken

