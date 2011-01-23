var Renderer;
Renderer = (function() {
  function Renderer(stage, fps) {
    this.timer = null;
    this.running = false;
    this.frameHandlers = null;
    this.stage = stage;
    this.setFps(fps);
  }
  Renderer.prototype.setFps = function(fps) {
    return this.interval = 1000 / fps;
  };
  Renderer.prototype.run = function(fps) {
    if (fps) {
      this.setFps(fps);
    }
    if (this.running) {
      this.stop();
    }
    this.running = true;
    return this.timer = setInterval(this.handleInterval, this.interval, this);
  };
  Renderer.prototype.addFrameHandler = function(handler) {
    this.frameHandlers || (this.frameHandlers = []);
    if (this.frameHandlers.indexOf(handler) === -1) {
      this.frameHandlers.push(handler);
    }
    return this;
  };
  Renderer.prototype.handleInterval = function(self) {
    var frameHandler, _i, _len, _ref;
    if (self.frameHandlers) {
      _ref = self.frameHandlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        frameHandler = _ref[_i];
        frameHandler();
      }
    }
    Tween.update();
    return self.stage.render(true);
  };
  Renderer.prototype.stop = function() {
    clearInterval(this.timer);
    this.running = false;
    return this.timer = null;
  };
  return Renderer;
})();