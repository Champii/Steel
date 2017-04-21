{
  const _ = require('lodash');
  let variables   = [];
  let types       = {};
  let indentCount = 0;

  const Assignation = (identifier, assignable) => {
    if (!variables.includes(identifier)) {
      variables.push(identifier);
      identifier = `let ${identifier}`;
    }

    return `${identifier} = ${assignable}`;
  };

  const FunctionDeclaration = (args, noReturn, template, body) => {
    if (noReturn != null) {
      noReturn = createNode('NoReturn', [], '!');
    }

    template.children.push(args, noReturn, body);

    template.children = _.compact(template.children);

    return createNode('FunctionDeclaration', template);
  };

  const BlockIndentation = (body, open, close) => {
    // const indent = indentCount;


    // close = (' ').repeat(indentCount) + close

    const res = body.map(item => (' ').repeat(indentCount) + item);
    indentCount -= 2;

    // res.unshift(open + '\n');
    // res.push(close);

    return body.join('');
  };

  const AddReturnLast = () => {

  };

  const createNode = (symbol, children, literal) => {
    if (!_.isArray(children)) {
      children = [children];
    }

    if (literal == null) {
      literal = _(children)
        .map('literal')
        .join()
      ;
    }

    return {
      symbol,
      literal,
      children,
    };
  };
}

Root
  = head:Statement+
  { return createNode('Root', head); }

BlockOpen       = ws "{" ws EndOfLine? { indentCount += 1; return ''; }
BlockClose      = ws "}" ws { return ''; }
IndentBlockOpen = ws "@{" ws EndOfLine? { indentCount += 1; return ''; }
IndentBlockClose= ws "@}" ws { return ''; }
ParensOpen      = ws "(" ws
ParensClose     = ws ")" ws
BraceOpen       = ws "[" ws
BraceClose      = ws "]" ws

Coma            = ws "," ws
Dot             = "." ws
AssignationOp   = ws "=" ws
Colon           = ws ":" ws
EmptyStatement  = ""

Comment
  = ws "#" ws chars:(Char / "'")*
  { return createNode('Comment', [], chars.join('')); }

Statement
  = ws
    body:(
      Comment
    / Expression
    / EmptyStatement
    )
    Comment?
    EndOfLine
  { return createNode('Statement', body || [], text()); }

ParensExpression
  = ParensOpen
    expr:Expression
    ParensClose
  { return createNode('ParensExpression', expr); }

Expression "Expression"
  = Assignation
  / Class
  / Interface
  / Import
  / Operation
  / BooleanExpr
  / Return
  / If
  / Try
  / Throw
  / While
  / For
  / TypeAssignation
  / Assignable

Assignable "Assignable"
  = ass:(
      Literal
    / Unary
    / ComputedProperty
    / Array
    / Object
    / New
    / This
    / FunctionCall
    / FunctionDeclaration
    / Not
    / Identifier
    )
    ex:Existance?
  {
    if (ex) {
      return createNode('Existance', ass);
    }

    return ass;
  }

This
  = "@"

New
  = "new "
    body:(
      FunctionCall
    / Identifier
    )
  { return createNode('New', body); }

Import
  = "import" ws
    block:ImportBlock
  { return createNode('Import', block); }

ImportBlock
  = IndentBlockOpen
    body:ImportLine+
    IndentBlockClose
  { return createNode('ImportBlock', body); }

ImportLine
  = ws
    body:(
      String
    / Identifier
    )
    from:ImportFrom?
    EndOfLine
  { return createNode('ImportLine', _.compact([body, from])); }

ImportFrom
  = Colon
    body:(
      Identifier
    / ObjectDestruct
    / ArrayDestruct
    )
  { return createNode('ImportFrom', body); }

Assignation "Assignation"
  = head:(
      ComputedProperty
    / ObjectDestruct
    / ArrayDestruct
    / Identifier
    )
    type:InlineTypeDeclaration?
    AssignationOp
    tail:Expression
  { return createNode('Assignation', _.compact([head, tail, type]), text()); }

ParensAssignable "ParensAssignable"
  = "(" ws
    ass:Expression
    ws ")"
  { return createNode('ParensAssignable', _.compact([ass])); }

TypeAssignation
  = id:Identifier
    ws ":=" ws
    expr:TypeExpression
  { return createNode('TypeAssignation', [id, expr]); }

TypeExpression
  = id:Identifier
    expr:FunctionTypeExpression*
  { return createNode('TypeExpression', [id].concat(expr)); }

FunctionTypeExpression
  = ws "->" ws
    id:Identifier
  { return id; }

InlineTypeDeclaration
  = ws ":" ws
    id:Identifier
  { return id; }

Not
  = ("!" / "not ") ws ass:Assignable
  { return createNode('Not', [ass]); }

Operation
  = left:Assignable
    ws
    op:Operator
    ws
    right:(
      Operation
    / Assignable
    )
  { return createNode('Operation', [left, op, right]); }

Operator
  = op:(
      "+"
    / "-"
    / "*"
    / "/"
    )
    eq:"="?
  { return createNode('Operator', [], op + (eq || '')); }

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

FunctionDeclaration "FunctionDeclaration"
  = args:FunctionArguments?
    ws noReturn: "!"? ws
    template:(
      FunctionExpression
    / ArrowFunction
    )
    body:FunctionBlock
  { return FunctionDeclaration(args, noReturn, template, body); }

FunctionExpression "FunctionExpression"
  = ws "->" ws
  { return createNode('FunctionExpression', []); }

ArrowFunction "ArrowFunction"
  = ws "~>" ws
  { return createNode('ArrowFunction', []); }

FunctionArguments "FunctionArguments"
  = "(" ws
    args:FunctionArgument?
    ws ")"
    returnType:FunctionReturnType?
  { return createNode('FunctionArguments', _.compact([...args, returnType])); }

FunctionReturnType
  = Colon
    id:Identifier
  { return createNode('FunctionReturnType', id); }

FunctionArgument "FunctionArgument"
  = head:Identifier
    type:InlineTypeDeclaration?
    tail:FunctionArgumentComa?
  {
    if (type) {
      head.literal = head.literal + ':' + type.literal;
    }

    return _([head].concat(tail))
      .flatten()
      .compact()
      .value()
    ;
  }

FunctionArgumentComa "FunctionArgumentComa"
  = Coma
    arg:FunctionArgument
  { return arg; }

FunctionCall
  = ident:Identifier
    call:Call ws
  { return createNode('FunctionCall', [ident, call]); }

Call
  = call:(
      ParensCall
    / SpaceCall
    / BangCall
    )
  { return createNode('Call', call); }

ParensCall
  = "(" ws
    args: CallArg?
    ws ")"
  { return createNode('ParensCall', args || []); }

SpaceCall
  = " "+
    args: CallArg
    ws
  { return createNode('SpaceCall', args); }

BangCall
  = "!"
  { return createNode('BangCall', []); }

CallArg
  = args:CallArg_
  { return createNode('CallArg', args); }
CallArg_
  = head: Expression
    tail: CallArgComa?
  {
    return _([head].concat(tail))
      .flatten()
      .compact()
      .value()
    ;
  }

CallArgComa
  = LineSpace?
    Coma
    arg: CallArg
  { return arg; }

Object
  =obj:(
      EmptyObject
    / IndentObjectBlock
    / ObjectBlock
    / ObjectProperties
    )
  { return createNode('Object', obj);}

EmptyObject
  = ws "{" ws "}" ws
  { return []; }

ObjectBlock
  = BlockOpen
    body: (ObjectPropertyLine / ObjectDestructPropertyComa)*
    BlockClose
  { return body; }

IndentObjectBlock
  = IndentBlockOpen
    body: (ObjectPropertyLine / ObjectDestructPropertyComa)*
    IndentBlockClose
  { return body; }

ObjectProperties
  = id:(
      Identifier
    / Literal
    )
    Colon
    ass:Assignable
    tail: ObjectPropertyComa?
  { return createNode('ObjectProperties', _.compact([id, ass, tail])); }

ObjectPropertyPair
  = id:(
      Identifier
    / Literal
    )
    Colon
    ass:Assignable
  { return createNode('ObjectPropertyPair', _.compact([id, ass])); }

ObjectPropertyComa
  = Coma
    body: ObjectProperties
  { return createNode('ObjectPropertyComa', body); }

ObjectPropertyLine
  = ws
    prop: ObjectProperties
    ws
    Coma?
    EndOfLine?
  { return prop; }

ObjectDestruct
  = BlockOpen
    body: ObjectDestructPropertyComa+
    BlockClose
  { return createNode('ObjectDestruct', body); }

ObjectDestructPropertyComa
  = ws
    id:Identifier
    ws
    Coma? EndOfLine?
  { return createNode('ObjectDestructPropertyComa', id); }

ArrayDestruct
  = BraceOpen
    body: ArrayDestructPropertyComa+
    BraceClose
  { return createNode('ArrayDestruct', body); }

ArrayDestructPropertyComa
  = ws
    id:Identifier
    ws
    Coma? EndOfLine?
  { return createNode('ArrayDestructPropertyComa', id); }

Array
  =arr:(
      EmptyArray
    / ArrayBlock
    / (
        BraceOpen
        ArrayProperties
        BraceClose
      )
    )
  { return createNode('Array', arr);}

EmptyArray
  = ws "[" ws "]" ws
  { return []; }

ArrayBlock
  = BraceOpen
    body: ArrayPropertyLine*
    BraceClose
  { return body; }

ArrayProperties
  = ass:  Expression
    tail: ArrayPropertyComa?
  { return createNode('ArrayProperties', _.compact([ass, tail])); }

ArrayPropertyComa
  = Coma
    body: ArrayProperties
  { return createNode('ArrayPropertyComa', body); }

ArrayPropertyLine
  = ws
    prop: ArrayProperties
    ws
    Coma?
    EndOfLine?
  { return prop; }

ComputedProperty
  = prop:(
      ComputedPropertyDirect
    / ComputedPropertyIndirect
    )
  { return createNode('ComputedProperty', prop); }

ComputedPropertyDirect
  = id:This
    prop:ComputedPropertiesTypes+
  { return createNode('ComputedPropertyDirect', _.compact([id, ...prop])); }

ComputedPropertyIndirect
  = id:(
      Literal
    / FunctionCall
    / This
    / Identifier
    / Array
    / Object
    )
    prop:PossibleComputedProperties+
  { return createNode('ComputedPropertyIndirect', _.compact([id, ...prop])); }

PossibleComputedProperties
  = LineSpace?
    prop:(
      ComputedPropertiesDots
    / ComputedPropertiesBraces
    )
    call:Call? ws
  { return createNode('PossibleComputedProperties', _.compact([prop, call])); }

ComputedPropertiesBraces
  = BraceOpen
    prop:ComputedPropertiesTypes
    ws "]"
  {
    return createNode('ComputedPropertiesBraces', _.compact([prop]));
  }

ComputedPropertiesDots
  = Dot
    prop:(
      NumericComputedProperty
    / ComputedPropertiesTypes
    )
  { return createNode('ComputedPropertiesDots', _.compact([prop])); }

ComputedPropertiesTypes
  = Literal
  / ComputedProperty
  / FunctionCall
  / Operation
  / Identifier

NumericComputedProperty
  = Number
  { return createNode('NumericComputedProperty', [], text()); }

LineSpace
  = ws EndOfLine ws

If
  = "if"
    ws ass:Expression ws
    body:Block
    other:(
      ElseIf
    / Else
    )?
  { return createNode('If', _.compact([ass, body, other])); }

ElseIf
  = EndOfLine ws "else if"
    ws ass:Expression ws
    body:Block
    other:(
      ElseIf
    / Else
    )?
  { return createNode('ElseIf', _.compact([ass, body, other])); }

Else
  = EndOfLine ws "else"
    body:Block
  { return createNode('Else', body); }

Try
  = "try"
    body:Block
    other:Catch?
  { return createNode('Try', _.compact([body, other])); }

Catch
  = EndOfLine ws "catch" ws
    id: Identifier?
    body:Block
  { return createNode('Catch', _.compact([id, body])); }

While
  = "while"
    ws ass:Expression ws
    body:Block
  { return createNode('While', _.compact([ass, body])); }

For
  = "for"
    cond:ForCond
    body:Block
  { return createNode('For', _.compact([cond, body])); }

ForCond
  = ws ass:Assignation? ws
    ";"
    ws ex1:Expression? ws
    ";"
    ws ex2:Expression? ws
  { return createNode('ForCond', _.compact([ass, ex1, ex2])); }

Return
  = ws "return" ws
    expr:Expression
  { return createNode('Return', expr); }

Throw
  = ws "throw" ws
    expr:Expression
  { return createNode('Throw', expr); }

Class
  = "class " ws
    id:Identifier
    ws
    block:ClassBlock
  { return createNode('Class', [id, block]); }

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

Existance
  = "?"
  { return createNode('Existance', [], text()); }

BooleanExpr
  = left:(
      Operation
    / Assignable
    )
    ws
    test:TestOp
    ws
    right:(
      BooleanExpr
    / Operation
    / Assignable
    )
  { return createNode('BooleanExpr', [left, test, right]); }

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
      )
      " "
    )

Unary
  = body:(
      ComputedProperty
    / Identifier
    )
    op:UnaryOp
  { return createNode('Unary', [body, op]); }

UnaryOp
  = op:(
      "++"
    / "--"
  )
  { return createNode('UnaryOp', [], text()); }

Literal "Literal"
  = body:(
      String
    / TemplateString
    / Number
    )
  { return createNode('Literal', body); }

Identifier "Identifier"
  = !ReservedWords
    $IdentifierChar+
  { return createNode('Identifier', [], text()); }

String "String"
  = SingleQuote
    (DoubleQuote / Char / "`")*
    SingleQuote
  { return createNode('String', [], text()); }

TemplateString "TemplateString"
  = BackQuote
    (Char / "'" / DoubleQuote)*
    BackQuote
  { return createNode('TemplateString', [], text()); }

SingleQuote "SingleQuote"
  = "'"

DoubleQuote "DoubleQuote"
  = '"'

BackQuote "BackQuote"
  = "`"

SingleQuoteChar
  = !(SingleQuote)
    c:Char
  { return c; }

DoubleQuoteChar
  = !(DoubleQuote)
    c:Char
  { return c; }

IdentifierChar "IdentifierChar"
  = [_a-zA-Z] [a-zA-Z0-9_\-]*

Char "Char"
  = Unescaped
  / Escape sequence:(
      "`"
    / SingleQuote
    / DoubleQuote
    / "\\"
    / "/"
    / "b" { return "\b"; }
    / "f" { return "\f"; }
    / "n" { return "\n"; }
    / "r" { return "\r"; }
    / "t" { return "\t"; }
  )
  { return sequence; }

Escape "Escape"
  = "\\"

Unescaped "Unescaped"
  = [^\0-\x1F\x22\x5C'`]

// Unescaped = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]

ws "WhiteSpace"
  = " "*
  { return null }

Number "Number"
  = [0-9]+
  { return createNode('Number', [], text()); }

EndOfLine "EndOfLine"
  = "\n"
