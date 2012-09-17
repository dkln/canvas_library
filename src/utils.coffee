class Utils
  @hex2rgba: (hex) ->
    num = parseInt(hex.slice(1), 16)
    [num >> 16 & 255, num >> 8 & 255, num & 255, num >> 24 & 255]

  @angleToRadians: (angle) -> angle * Math.PI / 180

  @firstUpcase: (str) ->
    str.substr(0, 1).toUpperCase() + str.substr(1)

  # FIXME not working when scrolled
  @offsetPosition: (obj) ->
    top = 0
    left = 0

    while obj
      left += obj.offsetLeft
      top += obj.offsetTop
      obj = obj.offsetParent

    [left, top]

@extend = (obj, mixin) ->
  for name, method of mixin
    obj[name] = method

@include = (klass, mixin) ->
  extend klass.prototype, mixin

@CanvasLibrary ||= {}
@CanvasLibrary.Utils = Utils
