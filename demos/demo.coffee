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

  stage.onMouseUp = =>
    if logo
      Tween.to logo, 500, { x: stage.mouseX, y: stage.mouseY }

  stage.addChild someShape
  stage.addChild otherShape
  stage.addChild mouseShape

  # load an external bitmap
  StackedLoader.add 'logo', 'bitmap', 'logo.png'
  StackedLoader.load ->
    logo = StackedLoader.get('logo')
    stage.addChild logo

    logo.alpha = 0
    Tween.to logo, 10000, { alpha: 1 }

  # setup renderer and connect it to the stage and run at 25 fps
  renderer = new Renderer(stage, 25)
  renderer.run()

  # tween some stuff
  Tween.to someShape, 5000, { x: 100, y: 100 }
  Tween.to otherShape, 20000, { rotation: 180, x: 320, y: 200, alpha: 1, scaleX: 1, scaleY: 1 }

window.onload = run
