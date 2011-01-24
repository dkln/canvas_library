run = ->
  # this is the screen
  stage = new Stage('test_canvas')

  logo = null

  # create a rectangle
  someShape = new Shape()
  someShape.x = 0
  someShape.y = 0

  someShape.fillStyle 'rgba(0, 0, 0, 1)'
  someShape.fillRect 0, 0, 50, 50

  # create another rectangle
  otherShape = new Shape()
  otherShape.alpha = .5
  otherShape.fillStyle 'rgba(255, 0, 0, 1)'
  otherShape.fillRect 0, 0, 25, 25
  otherShape.x = 10
  otherShape.y = 10
  otherShape.scaleX = 1
  otherShape.scaleY = 1
  otherShape.mouseEnabled = true

  # make this shape follow the mouse
  mouseShape = new Shape()
  mouseShape.beginPath()
  mouseShape.fillStyle 'rgba(255, 0, 0, 1)'
  mouseShape.circle 0, 0, 10
  mouseShape.closePath()
  mouseShape.fill()

  mouseShape.x = 300
  mouseShape.y = 300

  stage.onMouseMove = =>
    mouseShape.x = stage.mouseX
    mouseShape.y = stage.mouseY

  # some text
  text = new TextField()
  text.mouseEnabled = true
  text.text = "canvas_library demo"
  text.x = 10
  text.y = 450

  text.onMouseOver = =>
    text.fillStyle = 'rgba(255, 0, 0, 1)'
    console.log 'over'

  text.onMouseOut = =>
    text.fillStyle = 'rgba(0, 0, 0, 1)'
    console.log 'out'

  stage.onMouseUp = =>
    if logo
      Tween.kill logo
      Tween.to logo, 500, { x: stage.mouseX, y: stage.mouseY }

  stage.addChild someShape
  stage.addChild otherShape
  stage.addChild mouseShape
  stage.addChild text

  # load an external bitmap
  StackedLoader.add 'logo', 'bitmap', 'logo.png'
  #StackedLoader.add 'sprite', 'sprite', 'logo.spr'

  StackedLoader.load ->
    logo = StackedLoader.get('logo')
    stage.addChild logo

    logo.alpha = 0
    Tween.to logo, 10000, { alpha: 1 }

    #sprite = StackerLoader.get('sprite')
    #stage.addChild sprite

  # setup renderer and connect it to the stage and run at 25 fps
  renderer = new Renderer(stage, 25)
  renderer.run()

  # tween some stuff
  Tween.to someShape, 5000, { x: 100, y: 100 }
  Tween.to otherShape, 20000, { rotation: 180, x: 320, y: 200, alpha: 1, scaleX: 1, scaleY: 1 }

window.onload = run
