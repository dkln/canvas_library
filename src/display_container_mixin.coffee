class DisplayContainerMixin
  @addChild: (child) ->
    child.parent.removeChild(child) if child.parent

    @stage.childrenChanged = true if @stage
    @determineAncestors child
    child.stage = @stage
    child.translatedObjects = [child].concat(child.ancestors).reverse()
    @children.push child
    this

  @removeChild: (child) ->
    i = @children.indexOf(child)

    if i == -1
      throw 'Child object not found in DisplayList'
    else
      @stage.childrenChanged = true if @stage
      @children.splice i, 1
      child.parent = null
      child.ancestors = null
      child.translatedObjects = null
      this

  @determineAncestors: (child) ->
    child.parent = this
    child.ancestors = []

    theParent = this

    while theParent
      child.ancestors.push theParent
      theParent = theParent.parent

    true
