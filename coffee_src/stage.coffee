class Stage
  constructor: (@canvasId) ->
    @scaleX = 1
    @scaleY = 1
    @rotation = 0
    @alpha = 1
    @mouseX = 0
    @mouseY = 0
    @oldMouseX = 0
    @oldMouseY = 0
    @children = []
    @canvas = document.getElementById(@canvasId)
    @context = @canvas.getContext('2d')
    @backBufferCanvas = @cloneCanvas()
    @backBufferContext = @backBufferCanvas.getContext('2d')
    @hitBufferCanvas = @cloneCanvas()
    @hitBufferContext = @backBufferCanvas.getContext('2d')
    @childrenChanged = false
    @allChildren = []

  cloneCanvas: ->
    canvas = document.createElement('canvas')
    canvas.width = @canvas.width
    canvas.height = @canvas.height
    canvas

  addChild: (child) ->
    @children.push child

  render: (clear) ->
    @setupMouse()
    @backBufferContext.clearRect(0, 0, @canvas.width, @canvas.height) if clear
    @findAllChildren
    @drawAllChildren

  setupContext: (context, child) ->
    context.globalAlpha = child.alpha
    context.translate child.canvasX, child.canvasY
    context.rotate Utils.angleToRadians(child.calculatedRotation)
    context.scale child.calculatedScaleX, child.calculatedScaleY

    if child.shadow
      context.shadowBlur = child.shadowBlur
      context.shadowColor = child.shadowColor
      context.shadowOffsetX = child.shadowOffsetX
      context.shadowOffsetY = child.shadowOffsetY

  renderBackBuffer: ->
    @context.clearRect 0, 0, @canvas.width, @canvas.height
    @context.drawImage @backBufferCanvas, 0, 0

  drawAllChildren: ->
    i = 0

    while i < @allChildren.length
      child = @allChildren[i]
      child.calculateCanvasPositions()

      if child.visible
        @backBufferContext.save()
        @setupContext @backBufferContext, child
        child.draw @backBufferContext
        @backBufferContext.restore

      i++

    @renderBackBuffer()

  determineObjectsUnderCursor: ->
    i = @allChildren.length - 1
    objectUnderCursor = null

    while i >= 0 && objectUnderCursor == null
      child = @allChildren[i]

      if child.calculatedVisibility && child.mouseEnabled
        @hitBufferContext.clearRect 0, 0, @canvas.width, @canvas.height
        @hitBufferContext.save

        @setupContext @hitBufferContext, child

        child.draw @hitBufferContext, true

        child.localX = @mouseX - @canvasX
        child.localY = @mouseY - @canvasY

        if @hitBufferContext.isPointInPath(@mouseX, @mouseY)
          objectUnderCursor = child

        @hitBufferContext.restore

    objectUnderCursor

  findAllChildren: ->
    if @childrenChanged
      @allChildren = []
      getChildren this, @allChildren

  getChildren: (fromParent, collectedChildren) ->
    fromParent.children.forEach (child) =>
      collectedChildren.push child
      @getChildren(child, collectedChildren) if child.children && child.children.length > 0

  setupMouse: ->
    unless @isMouseSetup
      @isMouseSetup = true
      @canvas.addEventListener 'mousemove', @handleCanvasMouseMove
      @canvas.addEventListener 'mousedown', @handleCanvasMouseDown
      @canvas.addEventListener 'mouseup', @handleCanvasMouseUp

  handleCanvasMouseMove: (event) ->
    @mouseX = event.clientX - @canvas.offsetLeft
    @mouseY = event.clientY - @canvas.offsetTop
    @oldMouseX = @mouseX
    @oldMouseY = @mouseY
    @onMouseMove() if @onMouseMove

  handleCanvasMouseDown: (event) ->
    @mouseDown = true

  handleCanvasMouseUp: (event) ->
    @mouseUp = false
