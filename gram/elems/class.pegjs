Class
  = "class " ws
    id:Identifier
    ws
    extend:Extends?
    ws
    block:ClassBlock?
  { return createNode('Class', _.compact([id, block, extend])); }

Extends
  = Colon
  id:Identifier
  { return createNode('Extends', id); }

ClassBlock
  = IndentBlockOpen
    statm:ClassStatement*
    IndentBlockClose
  { return createNode('ClassBlock', statm); }

ClassStatement
  = ws
    body:(
      ClassMethodDeclaration
    / ClassPropertyDeclaration
    / EmptyStatement
    )
    EndOfLine
  { return createNode('ClassStatement', body); }

ClassPropertyDeclaration
  = id:Identifier
    Colon
    body:(
      Literal
    / Identifier
    )
  { return createNode('ClassPropertyDeclaration', _.compact([id, body])); }

ClassMethodDeclaration
  = id:Identifier
    Colon
    func:ClassMethod
  { return createNode('ClassMethodDeclaration', [id, func]); }

ClassMethod
  = func:FunctionDeclaration
  { return createNode('ClassMethod', func.children); }
