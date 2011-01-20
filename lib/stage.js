var Stage;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Stage = (function() {
  function Stage(canvasId) {
    this.canvasId = canvasId;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.alpha = 1;
    this.mouseX = 0;
    this.mouseY = 0;
    this.oldMouseX = 0;
    this.oldMouseY = 0;
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
  Stage.prototype.setupContext = function(context, child) {
    context.globalAlpha = child.alpha;
    context.translate(child.canvasX, child.canvasY);
    context.rotate(Utils.angleToRadians(child.calculatedRotation));
    context.scale(child.calculatedScaleX, child.calculatedScaleY);
    if (child.shadow) {
      context.shadowBlur = child.shadowBlur;
      context.shadowColor = child.shadowColor;
      context.shadowOffsetX = child.shadowOffsetX;
      return context.shadowOffsetY = child.shadowOffsetY;
    }
  };
  Stage.prototype.renderBackBuffer = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return this.context.drawImage(this.backBufferCanvas, 0, 0);
  };
  Stage.prototype.drawAllChildren = function() {
    var child, i;
    i = 0;
    while (i < this.allChildren.length) {
      child = this.allChildren[i];
      child.calculateCanvasPositions();
      if (child.visible) {
        this.backBufferContext.save();
        this.setupContext(this.backBufferContext, child);
        child.draw(this.backBufferContext);
        this.backBufferContext.restore;
      }
      i++;
    }
    return this.renderBackBuffer();
  };
  Stage.prototype.determineObjectsUnderCursor = function() {
    var child, i, objectUnderCursor;
    i = this.allChildren.length - 1;
    objectUnderCursor = null;
    while (i >= 0 && objectUnderCursor === null) {
      child = this.allChildren[i];
      if (child.calculatedVisibility && child.mouseEnabled) {
        this.hitBufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hitBufferContext.save;
        this.setupContext(this.hitBufferContext, child);
        child.draw(this.hitBufferContext, true);
        child.localX = this.mouseX - this.canvasX;
        child.localY = this.mouseY - this.canvasY;
        if (this.hitBufferContext.isPointInPath(this.mouseX, this.mouseY)) {
          objectUnderCursor = child;
        }
        this.hitBufferContext.restore;
      }
    }
    return objectUnderCursor;
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
  Stage.prototype.handleCanvasMouseMove = function(event) {
    this.mouseX = event.clientX - this.canvas.offsetLeft;
    this.mouseY = event.clientY - this.canvas.offsetTop;
    this.oldMouseX = this.mouseX;
    this.oldMouseY = this.mouseY;
    if (this.onMouseMove) {
      return this.onMouseMove();
    }
  };
  Stage.prototype.handleCanvasMouseDown = function(event) {
    return this.mouseDown = true;
  };
  Stage.prototype.handleCanvasMouseUp = function(event) {
    return this.mouseUp = false;
  };
  return Stage;
})();