
{ isType, assertType } = require "type-utils"

SortedArray = require "sorted-array"
Factory = require "factory"
Finder = require "finder"

LocalVar = require "./LocalVar"

module.exports =
VarStatement = Factory "VarStatement",

  optionTypes:
    endIndex: Number
    contents: String
    source: String

  customValues:

    startIndex: lazy: ->
      @endIndex - @contents.length - 4

  initFrozenValues: (options) ->
    return options

  initValues: ->

    nodeCount: 0

    nodeMap: {} # Variables by name.

  init: ->
    LocalVar.find.target = @contents
    loop
      name = LocalVar.find.next()
      break unless name
      position = @nodeCount++
      endIndex = LocalVar.find.offset
      @nodeMap[name] = LocalVar { name, position, endIndex }
    return

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

  statics:

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

splice = (string, start, end) ->
  slices = []
  slices.push string.slice 0, start
  slices.push string.slice end
  slices.join ""
