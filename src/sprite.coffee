class Sprite extends Shape
  constructor: ->
    super()
    @children = []

include Sprite, DisplayContainerMixin

@CanvasLibrary ||= {}
@CanvasLibrary.Sprite = Sprite
