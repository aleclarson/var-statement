
fromArgs = require "fromArgs"
Finder = require "finder"
Type = require "Type"

type = Type "LocalVar"

type.optionTypes =
  name: String     # The variable name.
  position: Number # The variable list index.
  endIndex: Number # The last character index of the variable name.

type.defineValues

  name: fromArgs "name"

  position: fromArgs "position"

  endIndex: fromArgs "endIndex"

type.defineStatics

  find: Finder /[^\,\;\s]+/

module.exports = type.build()
