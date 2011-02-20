class Stage
  constructor: (@canvasId) ->
    @stage = this
    @children = []
    @scaleX = 1
    @scaleY = 1
    @rotation = 0
    @visible = true
    @x = 0
    @y = 0
    @alpha = 1
    @mouseX = 0
    @mouseY = 0
    @parent = null
    @isMouseSetup = false
    @oldMouseX = 0
    @oldMouseY = 0
    @children = []
    @canvas = document.getElementById(@canvasId)
    @context = @canvas.getContext('2d')
    @hitBufferCanvas = @cloneCanvas()
    @hitBufferContext = @hitBufferCanvas.getContext('2d')
    @childrenChanged = false
    @allChildren = []
    @canvasOffsetPosition = Utils.offsetPosition(@canvas)

    window.onresize = => @handleWindowResize()

  cloneCanvas: ->
    canvas = document.createElement('canvas')
    canvas.width = @canvas.width
    canvas.height = @canvas.height
    canvas

  render: (clear) ->
    @setupMouse()
    @context.clearRect 0, 0, @canvas.width, @canvas.height

    if @childrenChanged
      @findAllChildren()
      @childrenChanged = false

    @drawAllChildren()
    @handleMouseEventsOfAllChildren()

  setupContext: (context, child) ->
    context.globalAlpha = child.calculatedAlpha

    for object in child.translatedObjects
      context.translate object.x, object.y
      context.rotate Utils.angleToRadians(object.rotation)
      context.scale object.scaleX, object.scaleY

    if child.shadow
      context.shadowBlur = child.shadowBlur
      context.shadowColor = child.shadowColor
      context.shadowOffsetX = child.shadowOffsetX
      context.shadowOffsetY = child.shadowOffsetY

  drawAllChildren: ->
    for child in @allChildren
      child.calculateCanvasPositions()

      if child.calculatedVisibility
        @context.save()
        @setupContext @context, child
        child.draw @context
        @context.restore()

  # FIXME Not working properly. Every object now is placed under cursor.
  getObjectUnderCursor: ->
    i = @allChildren.length - 1

    while i >= 0
      child = @allChildren[i]

      if child.calculatedVisibility && child.mouseEnabled
        @hitBufferContext.clearRect 0, 0, @canvas.width, @canvas.height
        @hitBufferContext.save()

        @setupContext @hitBufferContext, child
        @hitBufferContext.beginPath()

        child.draw @hitBufferContext, true

        @hitBufferContext.closePath()

        child.localX = @mouseX - child.calculatedX
        child.localY = @mouseY - child.calculatedY

        @hitBufferContext.restore()

        if @hitBufferContext.isPointInPath(@mouseX, @mouseY)
          return child

      i--

    null

  findAllChildren: ->
    @allChildren = []
    @getChildren this, @allChildren

  getChildren: (fromParent, collectedChildren) ->
    for child in fromParent.children
      collectedChildren.push child
      @getChildren(child, collectedChildren) if child.children? && child.children.length > 0

    collectedChildren

  setupMouse: ->
    unless @isMouseSetup
      @isMouseSetup = true
      @canvas.addEventListener 'mousemove', ((event) => @handleCanvasMouseMove(event)), false
      @canvas.addEventListener 'mousedown', ((event) => @handleCanvasMouseDown(event)), false
      @canvas.addEventListener 'mouseup', ((event) => @handleCanvasMouseUp(event)), false

  handleCanvasMouseMove: (event) ->
    @oldMouseX = @mouseX
    @oldMouseY = @mouseY
    @mouseX = event.clientX - @canvasOffsetPosition[0]
    @mouseY = event.clientY - @canvasOffsetPosition[1]
    @onMouseMove() if @onMouseMove

  handleCanvasMouseDown: (event) ->
    @onMouseDown() if @onMouseDown && !@mouseDown
    @mouseDown = true

  handleCanvasMouseUp: (event) ->
    @onMouseUp() if @onMouseUp && @mouseDown
    @mouseDown = false

  mouseHasMoved: ->
    (@oldMouseX != @mouseX || @oldMouseY != @mouseY)

  setHandCursor: (showHand) ->
    @canvas.style.cursor = showHand ? 'pointer' : ''

  # FIXME/TODO not working properly
  handleMouseEventsOfAllChildren: ->
    objectUnderCursor = @getObjectUnderCursor()

    if @lastObjectUnderCursor != objectUnderCursor
      if @lastObjectUnderCursor
        @lastObjectUnderCursor.onMouseOut() if @lastObjectUnderCursor.onMouseOut

        if @lastObjectUnderCursor.useHandCursor
          @setHandCursor false

      if objectUnderCursor
        objectUnderCursor.onMouseOver() if objectUnderCursor.onMouseOver

        if objectUnderCursor.onMouseDown && !objectUnderCursor.mouseDown
          objectUnderCursor.mouseDown = true
          objectUnderCursor.onMouseDown()

        if objectUnderCursor.onMouseUp && objectUnderCursor.mouseDown
          objectUnderCursor.mouseDown = false
          objectUnderCursor.onMouseUp()

        @setHandCursor objectUnderCursor.useHandCursor

    else if objectUnderCursor && @mouseHasMoved() && objectUnderCursor.onMouseMove
      objectUnderCursor.onMouseMove()

    @lastObjectUnderCursor = objectUnderCursor

  handleWindowResize: ->
    @canvasOffsetPosition = Utils.offsetPosition(@canvas)

  positionChanged: ->
    false

include Stage, DisplayContainerMixin
