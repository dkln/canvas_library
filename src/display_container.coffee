class DisplayContainer
  draw: (context, drawHitarea) ->
    true

include DisplayContainer, CanvasLibrary.DisplayContainerMixin

@CanvasLibrary ||= {}
@CanvasLibrary.DisplayContainer = DisplayContainer
