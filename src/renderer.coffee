class Renderer
  constructor: (stage, fps) ->
    @timer = null
    @running = false
    @frameHandlers = null
    @stage = stage
    @setFps fps

  setFps: (fps) ->
    @interval = 1000 / fps

  run: (fps) ->
    @setFps(fps) if fps
    @stop() if @running
    @running = true
    @timer = setInterval(@handleInterval, @interval, this)

  addFrameHandler: (handler) ->
    @frameHandlers ||= []
    @frameHandlers.push(handler) if @frameHandlers.indexOf(handler) == -1
    this

  handleInterval: (self) ->
    if self.frameHandlers
      for frameHandler in self.frameHandlers
        frameHandler()

    Tween.update()
    self.stage.render true

  stop: ->
    clearInterval @timer
    @running = false
    @timer = null
