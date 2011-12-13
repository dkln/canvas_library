class Tween
  @tweens = []

  @initTime = new Date().getTime()

  @to: (object, duration, toParams, options) ->
    tween = new TweenCommand(object, toParams)
    tween.duration = duration

    if options
      tween.onComplete = options.onComplete
      tween.delay = options.delay || 0
      tween.ease = options.ease || EaseDefault

    tween.finished = false
    @tweens.push tween

  @kill: (object) ->
    i = 0

    while i < @tweens.length
      if @tweens[i].object == object
        @tweens[i] = null
        @tweens.splice i, 1
        i = -1

      i++

  @update: ->
    if @tweens.length > 0
      i = 0
      cleanup = false
      time = new Date().getTime()

      for tween in @tweens
        tween.update time

        if tween.finished
          cleanup = true
          tween = null

      @cleanup() if cleanup

  @cleanup: ->
    i = 0

    while i < @tweens.length
      if !@tweens[i]
        @tweens.splice i, 1
        i = -1

      i++

@CanvasLibrary ||= {}
@CanvasLibrary.Tween = Tween
