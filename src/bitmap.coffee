class Bitmap extends CanvasLibrary.DisplayObject
  constructor: (@imageData) ->
    super()

  draw: (context, drawHitarea) ->
    if @imageData
      if @drawHitarea
        context.rect 0, 0, @imageData.width, @imageData.height
      else
        context.drawImage @imageData, 0, 0

@CanvasLibrary ||= {}
@CanvasLibrary.Bitmap = Bitmap
