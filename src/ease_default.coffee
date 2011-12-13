EaseDefault = (t, b, c, d) ->
  -c * (t /= d) * (t - 2) + b

@CanvasLibrary ||= {}
@CanvasLibrary.EaseDefault = EaseDefault
