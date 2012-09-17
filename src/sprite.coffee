class Sprite extends CanvasLibrary.Shape
  constructor: ->
    super()
    @children = []

include Sprite, CanvasLibrary.DisplayContainerMixin

@CanvasLibrary ||= {}
@CanvasLibrary.Sprite = Sprite
