
require "../../../lotus-require"
NamedFunction = require "named-function"
Finder = require "finder"

# Only works for CoffeeScript-generated JavaScript, which puts 'var' 
# statements only at the beginning of the function, always includes a 
# semi-colon at the end, and always sets variables after the 'var' statement.
VarStatement = module.exports = NamedFunction "VarStatement", (options) ->

  return new VarStatement options unless this instanceof VarStatement

  @varCount = 0
  @vars = {}

  _startIndex = null
  Object.defineProperty this, "startIndex",
    enumerable: yes
    get: -> _startIndex ? _startIndex = @endIndex - @contents.length - 4
    set: (newValue) -> _startIndex = newValue

  mergeOptionsInto this, options, VarStatement.options

  LocalVar.find.target = @contents
  loop
    name = LocalVar.find.next()
    break if !name?
    position = @varCount++
    endIndex = LocalVar.find.offset
    @vars[name] = LocalVar { name, position, endIndex }

  this

# Finds a 'var' statement in the Function.
VarStatement.find = Finder /var ([^\;]+)/

VarStatement.first = (func) ->

  if typeof func is "function"
    func = func.toString()
  else if typeof func isnt "string"
    throw TypeError "'func' must be a Function or String."

  statement = VarStatement.find func
  return null if !statement?

  VarStatement
    contents: statement
    endIndex: VarStatement.find.offset
    origin: VarStatement.find.target

VarStatement.options =
  endIndex: Number
  contents: String
  origin: String

VarStatement::remove = (names...) ->
  removedCharCount = 0
  result = @origin
  varCount = @varCount - names.length
  lvars = names.map (name) => @vars[name]
  lvars = lvars.sort (a, b) -> if a.position > b.position then 1 else -1
  for lvar in lvars
    if varCount is 0
      result = splice @origin, @startIndex, @endIndex + 1
      break
    else
      contents = @getContents lvar
      contents.startIndex -= removedCharCount
      contents.endIndex -= removedCharCount
      removedCharCount += contents.length
      result = splice result, contents.startIndex, contents.endIndex
  result

# Returns the full contents of a specific variable inside this statement.
VarStatement::getContents = (lvar) ->
  contents = {}
  contents.endIndex = @startIndex + lvar.endIndex + 4
  contents.startIndex = contents.endIndex - lvar.name.length
  contents.length = contents.endIndex - contents.startIndex
  if lvar.position is 0 then contents.endIndex += 2
  else contents.startIndex -= 2
  contents

LocalVar = exports.LocalVar = NamedFunction "LocalVar", (options) ->
  return new LocalVar options unless this instanceof LocalVar
  mergeOptionsInto this, options, LocalVar.options

# Finds a variable name within a 'var' statement.
LocalVar.find = Finder /[^\,\;\s]+/

LocalVar.options =
  name: String
  position: Number
  endIndex: Number

splice = (string, start, end) ->
  slices = []
  slices.push string.slice 0, start
  slices.push string.slice end
  slices.join ""

mergeOptionsInto = (target, options, types) ->
  for key, type of types
    value = options[key]
    if value? and value.constructor is type then target[key] = value
    else throw TypeError "'options.#{key}' must be a #{type.name}, but instead was a #{if value? then value.constructor.name else 'Void'}"
  target
