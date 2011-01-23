(function() {
  var run;
  run = function() {
    var otherShape, renderer, someShape, stage;
    stage = new Stage('test_canvas');
    someShape = new Shape();
    someShape.x = 0;
    someShape.y = 0;
    someShape.fillStyle('rgba(0, 0, 0, 1)');
    someShape.fillRect(0, 0, 50, 50);
    otherShape = new Shape();
    otherShape.alpha = .5;
    otherShape.fillStyle('rgba(255, 0, 0, 1)');
    otherShape.fillRect(0, 0, 25, 25);
    otherShape.x = 10;
    otherShape.y = 10;
    otherShape.scaleX = 1;
    otherShape.scaleY = 1;
    stage.addChild(someShape);
    stage.addChild(otherShape);
    renderer = new Renderer(stage, 25);
    renderer.run();
    Tween.to(someShape, 5000, {
      x: 100,
      y: 100
    });
    return Tween.to(otherShape, 20000, {
      rotation: 180,
      x: 320,
      y: 200,
      alpha: 1,
      scaleX: 1,
      scaleY: 1
    });
  };
  window.onload = run;
}).call(this);
