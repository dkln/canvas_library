(function() {
  var run;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  run = function() {
    var logo, mouseShape, otherShape, renderer, someShape, stage;
    stage = new Stage('test_canvas');
    logo = null;
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
    mouseShape = new Shape();
    mouseShape.beginPath();
    mouseShape.fillStyle('rgba(255, 0, 0, 1)');
    mouseShape.circle(0, 0, 10);
    mouseShape.closePath();
    mouseShape.fill();
    mouseShape.x = 300;
    mouseShape.y = 300;
    stage.onMouseMove = __bind(function() {
      mouseShape.x = stage.mouseX;
      return mouseShape.y = stage.mouseY;
    }, this);
    stage.addChild(someShape);
    stage.addChild(otherShape);
    stage.addChild(mouseShape);
    StackedLoader.add('logo', 'bitmap', 'logo.png');
    StackedLoader.load(function() {
      logo = StackedLoader.get('logo');
      stage.addChild(logo);
      logo.alpha = 0;
      return Tween.to(logo, 10000, {
        alpha: 1
      });
    });
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
