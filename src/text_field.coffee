class TextField extends DisplayObject
  constructor: ->
    @text = ''
    @textAlign = 'left'
    @strokeStyle = null
    @fillStyle = 'rgba(0, 0, 0, 1)'
    @fontFace = 'Arial'
    @fontSize = 20
    @maxWidth = null
    super()

  draw: (context, drawHitarea) ->
    context.font = @fontSize + 'px ' + @fontFace
    context.textBaseline = 'top'

    if drawHitarea
      context.beginPath()
      context.rect 0, 0, context.measureText(@text).width, @fontSize
      context.closePath()
    else
      context.strokeStyle = @strokeStyle if @strokeStyle
      context.fillStyle = @fillStyle if @fillStyle
      context.fillText @text, 0, 0

@CanvasLibrary ||= {}
@CanvasLibrary.TextField = TextField
