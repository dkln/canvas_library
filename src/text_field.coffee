class TextField extends DisplayObject
  constructor: ->
    @text = ''
    @textAlign = 'left'
    @strokeStyle = null
    @fillStyle = 'rgba(0, 0, 0, 1)'
    @font = '20pt Arial'
    @maxWidth = null
    super()

  draw: (context, drawHitarea) ->
    context.font = @font
    context.strokeStyle = @strokeStyle if @strokeStyle?
    context.fillStyle = @fillStyle if @fillStyle?
    context.fillText @text, 0, 0
