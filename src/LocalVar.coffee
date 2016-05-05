
Factory = require "factory"
Finder = require "finder"

module.exports = Factory "LocalVar",

  optionTypes:
    name: String     # The variable name.
    position: Number # The variable list index.
    endIndex: Number # The last character index of the variable name.

  initValues: (options) ->
    return options

  statics: {
    find: Finder /[^\,\;\s]+/
  }
