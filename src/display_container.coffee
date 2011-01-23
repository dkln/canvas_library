class DisplayContainer extends DisplayObject
  constructor: ->
    @children = []
    super()

  addChild: (child) ->
    child.parent.removeChild(child) if child.parent

    @stage.childrenChanged = true if @stage

    child.parent = this
    child.stage = @stage
    @children.push child
    this

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
