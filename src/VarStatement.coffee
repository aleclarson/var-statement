
SortedArray = require "sorted-array"
assertType = require "assertType"
Finder = require "finder"
isType = require "isType"
Type = require "Type"

LocalVar = require "./LocalVar"

type = Type "VarStatement"

type.defineOptions
  endIndex: Number.isRequired
  contents: String.isRequired
  source: String.isRequired

type.defineProperties

  startIndex: lazy: ->
    @endIndex - @contents.length - 4

type.defineFrozenValues

  endIndex: (options) -> options.endIndex

  contents: (options) -> options.contents

  source: (options) -> options.source

type.defineValues

  nodeCount: 0

  nodeMap: -> {} # Variables by name.

type.initInstance ->
  LocalVar.find.target = @contents
  loop
    name = LocalVar.find.next()
    break unless name
    position = @nodeCount++
    endIndex = LocalVar.find.offset
    @nodeMap[name] = LocalVar { name, position, endIndex }
  return

type.defineMethods

  remove: (names) ->

    names = [ names ] unless Array.isArray names

    nodes = SortedArray [], (a, b) ->
      if a.position > b.position then 1 else -1

    for name in names
      node = @nodeMap[name]
      continue unless node
      nodes.insert node

    newNodeCount = @nodeCount - nodes.length

    # Remove the whole statement!
    if newNodeCount is 0
      splice @source, @startIndex, @endIndex + 1

    removedCharCount = 0

    result = @source

    for node in nodes
      contents = @getContents node
      contents.startIndex -= removedCharCount
      contents.endIndex -= removedCharCount
      removedCharCount += contents.length
      result = splice result, contents.startIndex, contents.endIndex
    result

  # Returns the full contents of a specific variable inside this statement.
  getContents: (node) ->
    contents = {}
    contents.endIndex = @startIndex + node.endIndex + 4
    contents.startIndex = contents.endIndex - node.name.length
    contents.length = contents.endIndex - contents.startIndex
    if node.position is 0 then contents.endIndex += 2
    else contents.startIndex -= 2
    contents

type.defineStatics

  find: Finder
    regex: /var ([^\;]+)/
    group: 1

  first: (source) ->

    if isType source, Function
      source = source.toString()
    else assertType source, String

    contents = VarStatement.find source
    return null unless contents

    return VarStatement
      source: source
      contents: contents
      endIndex: VarStatement.find.offset

module.exports = VarStatement = type.build()

splice = (string, start, end) ->
  slices = []
  slices.push string.slice 0, start
  slices.push string.slice end
  slices.join ""
