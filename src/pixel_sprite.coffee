class PixelSprite extends Shape
  @defaultColorPalette: [ 'rgba(0, 0, 0, 1)',
                          'rgba(170, 0, 0, 1)',
                          'rgba(0, 170, 0, 1)',
                          'rgba(170, 85, 0, 1)',
                          'rgba(0, 0, 170, 1)',
                          'rgba(170, 0, 170, 1)',
                          'rgba(0, 170, 170, 1)',
                          'rgba(170, 170, 170, 1)',
                          'rgba(85, 85, 85, 1)',
                          'rgba(255, 85, 85, 1)',
                          'rgba(82, 255, 85, 1)',
                          'rgba(255, 255, 85, 1)',
                          'rgba(85, 85, 255, 1)',
                          'rgba(255, 85, 255, 1)',
                          'rgba(85, 255, 255, 1)',
                          'rgba(255, 255, 255, 1)' ]

  constructor: (map) ->
    super()
    @pixels = []
    @colorPalette = PixelSprite.defaultColorPalette
    @pixelSize = 4
    @drawPixelMap(map) if map

  drawPixelMap: (map) ->
    x = 0
    y = 0

    rows = map.split("\n")

    for row in rows
      columns = row.split('')
      x = 0

      for column in columns
        color = column.charCodeAt(0)
        @drawPixel(x, y, @colorPalette[color]) if @colorPalette[color]
        x++
      y++

    @submitPixels()

  drawPixel: (x, y, color) ->
    @pixels[y] = [] if !@pixels[y]
    @pixels[y][x] = color

  removePixel: (x, y) ->
    @pixels[y][x] = null

  submitPixels: ->
    x = 0
    y = 0

    for row in @pixels
      x = 0
      if row
        for column in row
          @fillRect(x * @pixelSize, y * @pixelSize, @pixelSize, @pixelSize, column) if column
          x++
      y++

@CanvasLibrary ||= {}
@CanvasLibrary.PixelSprite = PixelSprite
