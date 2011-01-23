class Utils
  @hex2rgba: (hex) ->
    num = parseInt(hex.slice(1), 16)
    [num >> 16 & 255, num >> 8 & 255, num & 255, num >> 24 & 255]

  @angleToRadians: (angle) -> angle * Math.PI / 180

  @firstUpcase: (str) ->
    str.substr(0, 1).toUpperCase() + str.substr(1)
