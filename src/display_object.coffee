class DisplayObject
  constructor: ->
    @id = ''

    @x = 0
    @y = 0
    @oldX = null
    @oldY = null
    @calculatedX = 0
    @calculatedY = 0

    @width = 0
    @height = 0

    @alpha = 1
    @oldAlpha = 1
    @calculatedAlpha = 1

    @scaleX = 1
    @scaleY = 1
    @oldScaleX = null
    @oldScaleY = null
    @calculatedScaleX = 1
    @calculatedScaleY = 1

    @rotation = 0
    @oldRotation = null
    @calculatedRotation = 0

    @enabled = true

    @visible = true
    @oldVisible = null
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
    @ancestors = null
    @translatedObjects = null
    @childrenChanged = false

  draw: (context, drawHitarea) ->
    # do nothing

  calculateCanvasPositions: ->
    if @positionChanged()
      @oldX = @x
      @oldY = @y
      @oldVisible = @visible
      @oldAlpha = @alpha

      newVars = @getInheritedTranslatedVars()

      @calculatedX = newVars[0]
      @calculatedY = newVars[1]
      @calculatedVisibility = newVars[2]
      @calculatedAlpha = newVars[3]

  getInheritedTranslatedVars: ->
    theParent = this
    translatedX = 0
    translatedY = 0
    translatedVisibility = true
    translatedAlpha = 1

    while theParent
      translatedX += theParent.x
      translatedY += theParent.y
      translatedVisibility = false if !theParent.visible
      translatedAlpha *= theParent.alpha

      theParent = theParent.parent

    [translatedX, translatedY, translatedVisibility, translatedAlpha]

  positionChanged: ->
    @x != @oldX || @y != @oldY || @rotation != @oldRotation || @scaleX != @oldScaleX || @scaleY != @oldScaleY || @visible != @old || @ancestorsPositionChanged()

  ancestorsPositionChanged: ->
    for ancestor in @ancestors
      return true if ancestor.positionChanged()
    false
