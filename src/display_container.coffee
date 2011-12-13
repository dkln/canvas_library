class DisplayContainer
  draw: (context, drawHitarea) ->
    true

include DisplayContainer, DisplayContainerMixin

@CanvasLibrary ||= {}
@CanvasLibrary.DisplayContainer = DisplayContainer
