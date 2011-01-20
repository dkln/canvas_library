class DisplayContainer
  constructor: ->
    @id = ''

    @children = []

    @x = 0
    @y = 0
    @canvasX = 0
    @canvasY = 0

    @width = 0
    @height = 0
    @alpha = 1

    @scaleX = 1
    @scaleY = 1
    @calculatedScaleX = 1
    @calculatedScaleY = 1

    @rotation = 0
    @calculatedRotation = 0

    @enabled = true

    @visible = true
    @calculatedVisibility = true

    @mouseEnabled = false
    @useHandCursor = false

    @shadow = false
    @shadowBlur = 0
    @shadowColor = 0
    @shadowOffsetX = 0
    @shadowOffsetY = 0

    @onMouseOver = null
    @onMouseOut = null
    @onMouseDown = null
    @onMouseMove = null
    @localX = 0
    @localY = 0

    @oldX = 0
    @oldY = 0
    @oldRotation = 0
    @oldScaleX = 1
    @oldScaleY = 1
    @oldVisible = true
    @oldMouseX = 0
    @oldMouseY = 0

    @isMouseSetup = false
    @mouseDown = false
    @canvas = null
    @lastObjectUnderCursor = null
    @stage = null
    @parent = null
    @childrenChanged = false

  addChild: (child) ->
    @stage.childrenChanged = true

    child.parent.removeChild(child) if child.parent

    child.parent = this
    child.stage = @stage
    @children.push child
    this

  setChildIndex: (child, index) ->
    if @children.indexOf(child) == -1
      throw 'Child object not found in DisplayList'
    else
      # TODO: Implement me
      @superDisplayContainer()._childrenChanged = true

  removeChild: (child) ->
    i = @children.indexOf(child)

    if i == -1
      throw 'Child object not found in DisplayList'
    else
      @stage.childrenChanged = true
      @children.splice i, 1
      this

  draw: (context, drawHitarea) ->
    # do nothing

  calculateCanvasPositions: ->
    if @positionChanged
      newVars = @getInheritedTranslatedVars()

      @oldX = @x
      @oldY = @y
      @oldRotation = @rotation
      @oldScaleX = @scaleX
      @oldScaleY = @scaleY

      @canvasX = newVars[0]
      @canvasY = newVars[1]
      @calculatedRotation = newVars[2]
      @calculatedScaleX = newVars[3]
      @calculatedScaleY = newVars[4]
      @calculatedVisibility = newVars[5]

  getInheritedTranslatedVars: ->
    theParent = this
    translatedX = 0
    translatedY = 0
    translatedRotation = 0
    translatedScaleX = 1
    translatedScaleY = 1
    visible = true

    while theParent != null
      translatedX += theParent.x
      translatedY += theParent.y
      translatedRotation += theParent.rotation
      translatedScaleX *= theParent.scaleX
      translatedScaleY *= theParent.scaleY
      visible = false if !theParent.visible

      theParent = theParent.parent

    [translatedX, translatedScaleY, translatedRotation, translatedScaleX, translatedScaleY, visible]
