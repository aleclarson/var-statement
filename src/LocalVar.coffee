
fromArgs = require "fromArgs"
Finder = require "finder"
Type = require "Type"

type = Type "LocalVar"

type.defineOptions
  name: String.isRequired     # The variable name.
  position: Number.isRequired # The variable list index.
  endIndex: Number.isRequired # The last character index of the variable name.

type.defineValues

  name: fromArgs "name"

  position: fromArgs "position"

  endIndex: fromArgs "endIndex"

type.defineStatics

  find: Finder /[^\,\;\s]+/

module.exports = type.build()
