var Stage;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Stage = (function() {
  function Stage(canvasId) {
    this.canvasId = canvasId;
    this.children = [];
    this.canvas = document.getElementById(this.canvasId);
    this.context = this.canvas.getContext('2d');
    this.backBufferCanvas = this.cloneCanvas();
    this.backBufferContext = this.backBufferCanvas.getContext('2d');
    this.hitBufferCanvas = this.cloneCanvas();
    this.hitBufferContext = this.backBufferCanvas.getContext('2d');
    this.childrenChanged = false;
    this.allChildren = [];
  }
  Stage.prototype.cloneCanvas = function() {
    var canvas;
    canvas = document.createElement('canvas');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    return canvas;
  };
  Stage.prototype.addChild = function(child) {
    return this.children.push(child);
  };
  Stage.prototype.render = function(clear) {
    this.setupMouse();
    if (clear) {
      this.backBufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.findAllChildren;
    return this.drawAllChildren;
  };
  Stage.prototype.drawAllChildren = function() {
    this.allChildren.forEach(__bind(function(child) {
      if (child.visible) {
        this.backBufferContext.save();
        this.setupContext(this.backBufferContext, child);
        child.draw(this.backBufferContext);
        return this.backBufferContext.restore;
      }
    }, this));
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return this.context.drawImage(this.backBufferCanvas, 0, 0);
  };
  Stage.prototype.findAllChildren = function() {
    if (this.childrenChanged) {
      this.allChildren = [];
      return getChildren(this, this.allChildren);
    }
  };
  Stage.prototype.getChildren = function(fromParent, collectedChildren) {
    return fromParent.children.forEach(__bind(function(child) {
      collectedChildren.push(child);
      if (child.children && child.children.length > 0) {
        return this.getChildren(child, collectedChildren);
      }
    }, this));
  };
  Stage.prototype.setupMouse = function() {
    if (!this.isMouseSetup) {
      this.isMouseSetup = true;
      this.canvas.addEventListener('mousemove', this.handleCanvasMouseMove);
      this.canvas.addEventListener('mousedown', this.handleCanvasMouseDown);
      return this.canvas.addEventListener('mouseup', this.handleCanvasMouseUp);
    }
  };
  return Stage;
})();