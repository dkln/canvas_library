var Stage;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Stage = (function() {
  function Stage(canvasId) {
    this.canvasId = canvasId;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.visible = true;
    this.x = 0;
    this.y = 0;
    this.alpha = 1;
    this.mouseX = 0;
    this.mouseY = 0;
    this.parent = null;
    this.isMouseSetup = false;
    this.oldMouseX = 0;
    this.oldMouseY = 0;
    this.children = [];
    this.canvas = document.getElementById(this.canvasId);
    this.context = this.canvas.getContext('2d');
    this.hitBufferCanvas = this.cloneCanvas();
    this.hitBufferContext = this.hitBufferCanvas.getContext('2d');
    this.childrenChanged = false;
    this.allChildren = [];
    this.canvasOffsetPosition = Utils.offsetPosition(this.canvas);
    window.onresize = __bind(function() {
      return this.handleWindowResize();
    }, this);
  }
  Stage.prototype.cloneCanvas = function() {
    var canvas;
    canvas = document.createElement('canvas');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    return canvas;
  };
  Stage.prototype.addChild = function(child) {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    this.childrenChanged = true;
    child.parent = this;
    child.stage = this;
    this.children.push(child);
    return this;
  };
  Stage.prototype.removeChild = function(child) {
    var i;
    if (i = this.children.indexOf(child) === -1) {
      throw 'Child object not found on stage';
    } else {
      child.stage = null;
      child.parent = null;
      this.childrenChanged = true;
      this.children.splice(i, 1);
    }
    return this;
  };
  Stage.prototype.render = function(clear) {
    this.setupMouse();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.childrenChanged) {
      this.findAllChildren();
      this.childrenChanged = false;
    }
    this.drawAllChildren();
    return this.handleMouseEventsOfAllChildren();
  };
  Stage.prototype.setupContext = function(context, child) {
    context.globalAlpha = child.calculatedAlpha;
    context.translate(parseInt(child.calculatedX), parseInt(child.calculatedY));
    context.rotate(Utils.angleToRadians(child.calculatedRotation));
    context.scale(child.calculatedScaleX, child.calculatedScaleY);
    if (child.shadow) {
      context.shadowBlur = child.shadowBlur;
      context.shadowColor = child.shadowColor;
      context.shadowOffsetX = child.shadowOffsetX;
      return context.shadowOffsetY = child.shadowOffsetY;
    }
  };
  Stage.prototype.drawAllChildren = function() {
    var child, _i, _len, _ref, _results;
    _ref = this.allChildren;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      child.calculateCanvasPositions();
      _results.push(child.calculatedVisibility ? (this.context.save(), this.setupContext(this.context, child), child.draw(this.context), this.context.restore()) : void 0);
    }
    return _results;
  };
  Stage.prototype.getObjectUnderCursor = function() {
    var child, i, _results;
    i = this.allChildren.length - 1;
    _results = [];
    while (i >= 0) {
      child = this.allChildren[i];
      if (child.calculatedVisibility && child.mouseEnabled) {
        this.hitBufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hitBufferContext.save();
        this.setupContext(this.hitBufferContext, child);
        this.hitBufferContext.beginPath();
        child.draw(this.hitBufferContext, true);
        this.hitBufferContext.closePath();
        child.localX = this.mouseX - child.calculatedX;
        child.localY = this.mouseY - child.calculatedY;
        this.hitBufferContext.restore();
        if (this.hitBufferContext.isPointInPath(this.mouseX, this.mouseY)) {
          return child;
        }
      }
      _results.push(i--);
    }
    return _results;
  };
  Stage.prototype.findAllChildren = function() {
    this.allChildren = [];
    return this.getChildren(this, this.allChildren);
  };
  Stage.prototype.getChildren = function(fromParent, collectedChildren) {
    var child, _i, _len, _ref;
    _ref = fromParent.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      collectedChildren.push(child);
      if ((child.children != null) && child.children.length > 0) {
        this.getChildren(child, collectedChildren);
      }
    }
    return collectedChildren;
  };
  Stage.prototype.setupMouse = function() {
    if (!this.isMouseSetup) {
      this.isMouseSetup = true;
      this.canvas.addEventListener('mousemove', __bind(function(event) {
        return this.handleCanvasMouseMove(event);
      }, this));
      this.canvas.addEventListener('mousedown', __bind(function(event) {
        return this.handleCanvasMouseDown(event);
      }, this));
      return this.canvas.addEventListener('mouseup', __bind(function(event) {
        return this.handleCanvasMouseUp(event);
      }, this));
    }
  };
  Stage.prototype.handleCanvasMouseMove = function(event) {
    this.oldMouseX = this.mouseX;
    this.oldMouseY = this.mouseY;
    this.mouseX = event.clientX - this.canvasOffsetPosition[0];
    this.mouseY = event.clientY - this.canvasOffsetPosition[1];
    if (this.onMouseMove) {
      return this.onMouseMove();
    }
  };
  Stage.prototype.handleCanvasMouseDown = function(event) {
    if (this.onMouseDown && !this.mouseDown) {
      this.onMouseDown();
    }
    return this.mouseDown = true;
  };
  Stage.prototype.handleCanvasMouseUp = function(event) {
    if (this.onMouseUp && this.mouseDown) {
      this.onMouseUp();
    }
    return this.mouseDown = false;
  };
  Stage.prototype.mouseHasMoved = function() {
    return this.oldMouseX !== this.mouseX || this.oldMouseY !== this.mouseY;
  };
  Stage.prototype.setHandCursor = function(showHand) {
    return this.canvas.style.cursor = showHand != null ? showHand : {
      'pointer': ''
    };
  };
  Stage.prototype.handleMouseEventsOfAllChildren = function() {
    var objectUnderCursor;
    objectUnderCursor = this.getObjectUnderCursor();
    if (this.lastObjectUnderCursor !== objectUnderCursor) {
      if (this.lastObjectUnderCursor) {
        if (this.lastObjectUnderCursor.onMouseOut) {
          this.lastObjectUnderCursor.onMouseOut();
        }
        if (this.lastObjectUnderCursor.useHandCursor) {
          this.setHandCursor(false);
        }
      }
      if (objectUnderCursor) {
        if (objectUnderCursor.onMouseOver) {
          objectUnderCursor.onMouseOver();
        }
        if (objectUnderCursor.onMouseDown && !objectUnderCursor.mouseDown) {
          objectUnderCursor.mouseDown = true;
          objectUnderCursor.onMouseDown();
        }
        if (objectUnderCursor.onMouseUp && objectUnderCursor.mouseDown) {
          objectUnderCursor.mouseDown = false;
          objectUnderCursor.onMouseUp();
        }
        this.setHandCursor(objectUnderCursor.useHandCursor);
      }
    } else if (objectUnderCursor && this.mouseHasMoved() && objectUnderCursor.onMouseMove) {
      objectUnderCursor.onMouseMove();
    }
    return this.lastObjectUnderCursor = objectUnderCursor;
  };
  Stage.prototype.handleWindowResize = function() {
    return this.canvasOffsetPosition = Utils.offsetPosition(this.canvas);
  };
  return Stage;
})();