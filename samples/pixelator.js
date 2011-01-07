var screen = new canvaslib.DisplayContainer('screen');
var renderer = new canvaslib.Renderer(screen);
var logo;

canvaslib.StackedLoader.load('logo', 'sprite', 'logo.spr');
canvaslib.StackedLoader.start( function() {
  logo = canvaslib.StackedLoader.get('logo');
  screen.addChild(logo);

  canvaslib.Tween.to(logo, 5000, { x: 0, y: 200 });
});

renderer.run(25);
