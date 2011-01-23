class Stage
  constructor: (@canvasId) ->
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
    @oldMouseX = 0
    @oldMouseY = 0
    @children = []
    @canvas = document.getElementById(@canvasId)
    @context = @canvas.getContext('2d')
    @hitBufferCanvas = @cloneCanvas()
    @hitBufferContext = @hitBufferCanvas.getContext('2d')
    @childrenChanged = false
    @allChildren = []

  cloneCanvas: ->
    canvas = document.createElement('canvas')
    canvas.width = @canvas.width
    canvas.height = @canvas.height
    canvas

  addChild: (child) ->
    child.parent.removeChild(child) if child.parent

    @childrenChanged = true
    child.parent = this
    child.stage = this
    @children.push child
    this

  removeChild: (child) ->
    if i = @children.indexOf(child) == -1
      throw 'Child object not found on stage'
    else
      child.stage = null
      child.parent = null
      @childrenChanged = true
      @children.splice(i, 1)

    this

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
    context.translate parseInt(child.calculatedX), parseInt(child.calculatedY)
    context.rotate Utils.angleToRadians(child.calculatedRotation)
    context.scale child.calculatedScaleX, child.calculatedScaleY

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

  getObjectUnderCursor: ->
    objectUnderCursor = null

    for child in @allChildren
      if child.calculatedVisibility && child.mouseEnabled
        @hitBufferContext.clearRect 0, 0, @canvas.width, @canvas.height
        @hitBufferContext.save

        @setupContext @hitBufferContext, child

        child.draw @hitBufferContext, true

        child.localX = @mouseX - child.calculatedX
        child.localY = @mouseY - child.calculatedY

        if @hitBufferContext.isPointInPath(@mouseX, @mouseY)
          @hitBufferContext.restore
          objectUnderCursor = child
          break

        @hitBufferContext.restore

    objectUnderCursor

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
      @canvas.addEventListener 'mousemove', => @handleCanvasMouseMove
      @canvas.addEventListener 'mousedown', => @handleCanvasMouseDown
      @canvas.addEventListener 'mouseup', => @handleCanvasMouseUp

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

  mouseHasMoved: ->
    (@oldMouseX != @mouseX || @oldMouseY != @mouseY)

  setHandCursor: (showHand) ->
    @canvas.style.cursor = showHand ? 'pointer' : ''

  handleMouseEventsOfAllChildren: ->
    objectUnderCursor = @getObjectUnderCursor

    if @lastObjectUnderCursor != objectUnderCursor
      if @lastObjectUnderCursor
        @lastObjectUnderCursor.onMouseOut() if @lastObjectUnderCursor.onMouseOut

        if @lastObjectUnderCursor.useHandCursor
          @setHandCursor false

      if objectUnderCursor
        objectUnderCursor.onMouseOver if objectUnderCursor.onMouseOver

        if objectUnderCursor.onMouseDown && !objectUnderCursor.mouseDown
          objectUnderCursor.mouseDown = true
          objectUnderCursor.onMouseDown()

        if objectUnderCursor.onMouseUp && objectUnderCursor.mouseDown
          objectUnderCursor.mouseDown = false
          objectUnderCursor.onMouseUp()

        @setHandCursor objectUnderCursor.useHandCursor

    else if objectUnderCursor && @mouseHasMoved() && objectUnderCursor.onMouseMove
      objectUnderCursor.onMouseMove

    @lastObjectUnderCursor = objectUnderCursor
