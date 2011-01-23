class Shape extends DisplayContainer
  constructor: ->
    super()
    @madeChanges = false
    @drawingCommands = []

  clear: ->
    @madeChanges = true
    @drawingCommands = []
    true

  addColorStops: (gradient, colorStops) ->
    for colorStop in colorStops
      gradient.addColorStop colorStop[0], colorStop[1]

    gradient

  createRadialGradient: (x1, y1, r1, x2, y2, r2, colorStops) ->
    gradient = @stage.backBufferContext.createRadialGradient(x1, y1, r1, x2, y2, r2)
    @addColorStops gradient, colorStops
    gradient

  createLinearGradient: (x1, y1, x2, y2, colorStops) ->
    gradient = @stage.backBufferContext.createLinearGradient(x1, y1, x2, y2)
    @addColorStops gradient, colorStops
    gradient

  setRadialGradient: (x1, y1, r1, x2, y2, r2, colorStops) ->
    @fillStyle @createRadialGradient(x1, y1, r1, x2, y2, r2, colorStops)
    this

  setLinearGradient: (x1, y1, x2, y2, colorStops) ->
    @fillStyle @createLinearGradient(x1, y1, x2, y2, colorStops)
    this

  moveTo: (x, y) ->
    @drawingCommands.push [true, 'moveTo', x, y]
    this

  lineWidth: (thickness) ->
    @drawingCommands.push [true, 'lineWidth', thickness]
    this

  lineCap: (cap) ->
    @drawingCommands.push [true, 'lineCap', cap]
    true

  lineTo: (x,y) ->
    @madeChanges = true
    @drawingCommands.push [true, 'lineTo', x, y]
    this

  bezierCurveTo: (cp1x, cp1y, cp2x, cp2y, x, y) ->
    @madeChanges = true
    @drawingCommands.push [true, 'bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]
    this

  quadraticCurveTo: (cpx, cpy, x, y) ->
    @madeChanges = true
    @drawingCommands.push [true, 'quadraticCurveTo', cpx, cpy, x, y]
    this

  miterLimit: (ratio) ->
    @drawingCommands.push [true, 'miterLimit', ratio]
    this

  beginPath: ->
    @drawingCommands.push [false, 'beginPath']
    this

  endPath: ->
    @drawingCommands.push [false, 'closePath']
    this

  fillRect: (x, y, width, height, color) ->
    @madeChanges = true
    @fillStyle(color) if color

    @drawingCommands.push [true, 'rect', x, y, width, height]
    @drawingCommands.push [false, 'fillRect', x, y, width, height]

    this

  circle: (x, y, radius) ->
    @arc x, y, radius / 2, 0, Math.PI * 2, true
    this

  arc: (x, y, sr, er, cw) ->
    @madeChanges = true
    @drawingCommands.push [true, 'arc', x, y, sr, er, cw]
    this

  strokeRect: (x, y, width, height, color) ->
    @madeChanges = true
    @drawingCommands.push [true, 'rect', x, y, width, height]
    @drawingCommands.push [false, 'strokeRect', x, y, width, height]
    this

  clearRect: (x, y, width, height) ->
    @madeChanges = true
    @drawingCommands.push [true, 'clearRect', x, y, width, height]

  fillStyle: (color) ->
    @drawingCommands.push [false, 'fillStyle=', color]
    this

  strokeStyle: (color) ->
    @drawingCommands.push [false, 'strokeStyle=', color]
    this

  globalAlpha: (alpha) ->
    @madeChanges = true
    @drawingCommands.push [false, 'globalAlpha=', alpha]
    this

  fill: ->
    @madeChanges = true
    @drawingCommands.push [false, 'fill']
    this

  draw: (context, drawHitarea) ->
    for command in  @drawingCommands
      instruction = command[1]

      if !drawHitarea || (drawHitarea && command[0])
        if instruction.substr(-1, 1) == '=' && command.length == 3
          context[instruction.substr(0, instruction.length - 1)] = command[2]

        else if command.length > 2
          context[instruction].apply context, command.slice(2)

        else if command.length == 2
          context[instruction]()

    @madeChanges = false
