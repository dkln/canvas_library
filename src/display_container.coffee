class DisplayContainer
  constructor: ->
    @id = ''

    @children = []

    @x = 0
    @y = 0
    @oldX = 0
    @oldY = 0
    @calculatedX = 0
    @calculatedY = 0

    @width = 0
    @height = 0

    @alpha = 1
    @oldAlpha = 1
    @calculatedAlpha = 1

    @scaleX = 1
    @scaleY = 1
    @oldScaleX = 1
    @oldScaleY = 1
    @calculatedScaleX = 1
    @calculatedScaleY = 1

    @rotation = 0
    @oldRotation = 0
    @calculatedRotation = 0

    @enabled = true

    @visible = true
    @oldVisible = true
    @calculatedVisibility = true

    @mouseEnabled = false
    @mouseDown = false
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

    @isMouseSetup = false
    @mouseDown = false
    @lastObjectUnderCursor = null
    @stage = null
    @parent = null
    @childrenChanged = false

  addChild: (child) ->
    child.parent.removeChild(child) if child.parent

    @stage.childrenChanged = true if @stage

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
      @stage.childrenChanged = true if @stage
      @children.splice i, 1
      this

  draw: (context, drawHitarea) ->
    # do nothing

  calculateCanvasPositions: ->
    if @positionChanged()
      @oldX = @x
      @oldY = @y
      @oldRotation = @rotation
      @oldScaleX = @scaleX
      @oldScaleY = @scaleY
      @oldVisible = @visible
      @oldAlpha = @alpha

      newVars = @getInheritedTranslatedVars()

      @calculatedX = newVars[0]
      @calculatedY = newVars[1]
      @calculatedRotation = newVars[2]
      @calculatedScaleX = newVars[3]
      @calculatedScaleY = newVars[4]
      @calculatedVisibility = newVars[5]
      @calculatedAlpha = newVars[6]

  getInheritedTranslatedVars: ->
    theParent = this
    translatedX = 0
    translatedY = 0
    translatedRotation = 0
    translatedScaleX = 1
    translatedScaleY = 1
    translatedVisibility = true
    translatedAlpha = 1

    while !(theParent == null || theParent == @stage)
      translatedX += theParent.x
      translatedY += theParent.y
      translatedRotation += theParent.rotation
      translatedScaleX *= theParent.scaleX
      translatedScaleY *= theParent.scaleY
      translatedVisibility = false if !theParent.visible
      translatedAlpha *= theParent.alpha

      theParent = theParent.parent

    [translatedX, translatedY, translatedRotation, translatedScaleX, translatedScaleY, translatedVisibility, translatedAlpha]

  positionChanged: ->
    @x != @oldX || @y != @oldY || @rotation != @oldRotation || @scaleX != @oldScaleX || @scaleY != @oldScaleY || @visible != @oldVisible || @alpha != @oldAlpha
