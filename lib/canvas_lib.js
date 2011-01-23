var DisplayContainer, EaseDefault, Renderer, Shape, Stage, Tween, TweenCommand, Utils;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
DisplayContainer = (function() {
  function DisplayContainer() {
    this.id = '';
    this.children = [];
    this.x = 0;
    this.y = 0;
    this.oldX = 0;
    this.oldY = 0;
    this.calculatedX = 0;
    this.calculatedY = 0;
    this.width = 0;
    this.height = 0;
    this.alpha = 1;
    this.oldAlpha = 1;
    this.calculatedAlpha = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.oldScaleX = 1;
    this.oldScaleY = 1;
    this.calculatedScaleX = 1;
    this.calculatedScaleY = 1;
    this.rotation = 0;
    this.oldRotation = 0;
    this.calculatedRotation = 0;
    this.enabled = true;
    this.visible = true;
    this.oldVisible = true;
    this.calculatedVisibility = true;
    this.mouseEnabled = false;
    this.mouseDown = false;
    this.useHandCursor = false;
    this.shadow = false;
    this.shadowBlur = 0;
    this.shadowColor = 0;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    this.onMouseOver = null;
    this.onMouseOut = null;
    this.onMouseDown = null;
    this.onMouseMove = null;
    this.localX = 0;
    this.localY = 0;
    this.isMouseSetup = false;
    this.mouseDown = false;
    this.lastObjectUnderCursor = null;
    this.stage = null;
    this.parent = null;
    this.childrenChanged = false;
  }
  DisplayContainer.prototype.addChild = function(child) {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    if (this.stage) {
      this.stage.childrenChanged = true;
    }
    child.parent = this;
    child.stage = this.stage;
    this.children.push(child);
    return this;
  };
  DisplayContainer.prototype.setChildIndex = function(child, index) {
    if (this.children.indexOf(child) === -1) {
      throw 'Child object not found in DisplayList';
    } else {
      return this.superDisplayContainer()._childrenChanged = true;
    }
  };
  DisplayContainer.prototype.removeChild = function(child) {
    var i;
    i = this.children.indexOf(child);
    if (i === -1) {
      throw 'Child object not found in DisplayList';
    } else {
      if (this.stage) {
        this.stage.childrenChanged = true;
      }
      this.children.splice(i, 1);
      return this;
    }
  };
  DisplayContainer.prototype.draw = function(context, drawHitarea) {};
  DisplayContainer.prototype.calculateCanvasPositions = function() {
    var newVars;
    if (this.positionChanged()) {
      this.oldX = this.x;
      this.oldY = this.y;
      this.oldRotation = this.rotation;
      this.oldScaleX = this.scaleX;
      this.oldScaleY = this.scaleY;
      this.oldVisible = this.visible;
      this.oldAlpha = this.alpha;
      newVars = this.getInheritedTranslatedVars();
      this.calculatedX = newVars[0];
      this.calculatedY = newVars[1];
      this.calculatedRotation = newVars[2];
      this.calculatedScaleX = newVars[3];
      this.calculatedScaleY = newVars[4];
      this.calculatedVisibility = newVars[5];
      return this.calculatedAlpha = newVars[6];
    }
  };
  DisplayContainer.prototype.getInheritedTranslatedVars = function() {
    var theParent, translatedAlpha, translatedRotation, translatedScaleX, translatedScaleY, translatedVisibility, translatedX, translatedY;
    theParent = this;
    translatedX = 0;
    translatedY = 0;
    translatedRotation = 0;
    translatedScaleX = 1;
    translatedScaleY = 1;
    translatedVisibility = true;
    translatedAlpha = 1;
    while (!(theParent === null || theParent === this.stage)) {
      translatedX += theParent.x;
      translatedY += theParent.y;
      translatedRotation += theParent.rotation;
      translatedScaleX *= theParent.scaleX;
      translatedScaleY *= theParent.scaleY;
      if (!theParent.visible) {
        translatedVisibility = false;
      }
      translatedAlpha *= theParent.alpha;
      theParent = theParent.parent;
    }
    return [translatedX, translatedY, translatedRotation, translatedScaleX, translatedScaleY, translatedVisibility, translatedAlpha];
  };
  DisplayContainer.prototype.positionChanged = function() {
    return this.x !== this.oldX || this.y !== this.oldY || this.rotation !== this.oldRotation || this.scaleX !== this.oldScaleX || this.scaleY !== this.oldScaleY || this.visible !== this.oldVisible || this.alpha !== this.oldAlpha;
  };
  return DisplayContainer;
})();
EaseDefault = function(t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
};
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
Shape = (function() {
  __extends(Shape, DisplayContainer);
  function Shape() {
    Shape.__super__.constructor.call(this);
    this.madeChanges = false;
    this.drawingCommands = [];
  }
  Shape.prototype.clear = function() {
    this.madeChanges = true;
    this.drawingCommands = [];
    return true;
  };
  Shape.prototype.addColorStops = function(gradient, colorStops) {
    var colorStop, _i, _len;
    for (_i = 0, _len = colorStops.length; _i < _len; _i++) {
      colorStop = colorStops[_i];
      gradient.addColorStop(colorStop[0], colorStop[1]);
    }
    return gradient;
  };
  Shape.prototype.createRadialGradient = function(x1, y1, r1, x2, y2, r2, colorStops) {
    var gradient;
    gradient = this.stage.backBufferContext.createRadialGradient(x1, y1, r1, x2, y2, r2);
    this.addColorStops(gradient, colorStops);
    return gradient;
  };
  Shape.prototype.createLinearGradient = function(x1, y1, x2, y2, colorStops) {
    var gradient;
    gradient = this.stage.backBufferContext.createLinearGradient(x1, y1, x2, y2);
    this.addColorStops(gradient, colorStops);
    return gradient;
  };
  Shape.prototype.setRadialGradient = function(x1, y1, r1, x2, y2, r2, colorStops) {
    this.fillStyle(this.createRadialGradient(x1, y1, r1, x2, y2, r2, colorStops));
    return this;
  };
  Shape.prototype.setLinearGradient = function(x1, y1, x2, y2, colorStops) {
    this.fillStyle(this.createLinearGradient(x1, y1, x2, y2, colorStops));
    return this;
  };
  Shape.prototype.moveTo = function(x, y) {
    this.drawingCommands.push([true, 'moveTo', x, y]);
    return this;
  };
  Shape.prototype.lineWidth = function(thickness) {
    this.drawingCommands.push([true, 'lineWidth', thickness]);
    return this;
  };
  Shape.prototype.lineCap = function(cap) {
    this.drawingCommands.push([true, 'lineCap', cap]);
    return true;
  };
  Shape.prototype.lineTo = function(x, y) {
    this.madeChanges = true;
    this.drawingCommands.push([true, 'lineTo', x, y]);
    return this;
  };
  Shape.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.madeChanges = true;
    this.drawingCommands.push([true, 'bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
    return this;
  };
  Shape.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
    this.madeChanges = true;
    this.drawingCommands.push([true, 'quadraticCurveTo', cpx, cpy, x, y]);
    return this;
  };
  Shape.prototype.miterLimit = function(ratio) {
    this.drawingCommands.push([true, 'miterLimit', ratio]);
    return this;
  };
  Shape.prototype.beginPath = function() {
    this.drawingCommands.push([false, 'beginPath']);
    return this;
  };
  Shape.prototype.endPath = function() {
    this.drawingCommands.push([false, 'closePath']);
    return this;
  };
  Shape.prototype.fillRect = function(x, y, width, height, color) {
    this.madeChanges = true;
    if (color) {
      this.fillStyle(color);
    }
    this.drawingCommands.push([true, 'rect', x, y, width, height]);
    this.drawingCommands.push([false, 'fillRect', x, y, width, height]);
    return this;
  };
  Shape.prototype.circle = function(x, y, radius) {
    this.arc(x, y, radius / 2, 0, Math.PI * 2, true);
    return this;
  };
  Shape.prototype.arc = function(x, y, sr, er, cw) {
    this.madeChanges = true;
    this.drawingCommands.push([true, 'arc', x, y, sr, er, cw]);
    return this;
  };
  Shape.prototype.strokeRect = function(x, y, width, height, color) {
    this.madeChanges = true;
    this.drawingCommands.push([true, 'rect', x, y, width, height]);
    this.drawingCommands.push([false, 'strokeRect', x, y, width, height]);
    return this;
  };
  Shape.prototype.clearRect = function(x, y, width, height) {
    this.madeChanges = true;
    return this.drawingCommands.push([true, 'clearRect', x, y, width, height]);
  };
  Shape.prototype.fillStyle = function(color) {
    this.drawingCommands.push([false, 'fillStyle=', color]);
    return this;
  };
  Shape.prototype.strokeStyle = function(color) {
    this.drawingCommands.push([false, 'strokeStyle=', color]);
    return this;
  };
  Shape.prototype.globalAlpha = function(alpha) {
    this.madeChanges = true;
    this.drawingCommands.push([false, 'globalAlpha=', alpha]);
    return this;
  };
  Shape.prototype.fill = function() {
    this.madeChanges = true;
    this.drawingCommands.push([false, 'fill']);
    return this;
  };
  Shape.prototype.draw = function(context, drawHitarea) {
    var command, instruction, _i, _len, _ref;
    _ref = this.drawingCommands;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      command = _ref[_i];
      instruction = command[1];
      if (!drawHitarea || (drawHitarea && command[0])) {
        if (instruction.substr(-1, 1) === '=' && command.length === 3) {
          context[instruction.substr(0, instruction.length - 1)] = command[2];
        } else if (command.length > 2) {
          context[instruction].apply(context, command.slice(2));
        } else if (command.length === 2) {
          context[instruction]();
        }
      }
    }
    return this.madeChanges = false;
  };
  return Shape;
})();
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
    this.oldMouseX = 0;
    this.oldMouseY = 0;
    this.children = [];
    this.canvas = document.getElementById(this.canvasId);
    this.context = this.canvas.getContext('2d');
    this.hitBufferCanvas = this.cloneCanvas();
    this.hitBufferContext = this.hitBufferCanvas.getContext('2d');
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
    i = this.children.indexOf(child);
    if (i === -1) {
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
    return this.drawAllChildren();
  };
  Stage.prototype.setupContext = function(context, child) {
    context.globalAlpha = child.alpha;
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
    var child, objectUnderCursor, _i, _len, _ref;
    objectUnderCursor = null;
    _ref = this.allChildren;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child.calculatedVisibility && child.mouseEnabled) {
        this.hitBufferContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hitBufferContext.save;
        this.setupContext(this.hitBufferContext, child);
        child.draw(this.hitBufferContext, true);
        child.localX = this.mouseX - child.calculatedX;
        child.localY = this.mouseY - child.calculatedY;
        if (this.hitBufferContext.isPointInPath(this.mouseX, this.mouseY)) {
          this.hitBufferContext.restore;
          objectUnderCursor = child;
          break;
        }
        this.hitBufferContext.restore;
      }
    }
    return objectUnderCursor;
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
      if (child.children && child.children.length > 0) {
        this.getChildren(child, collectedChildren);
      }
    }
    return collectedChildren;
  };
  Stage.prototype.setupMouse = function() {
    if (!this.isMouseSetup) {
      this.isMouseSetup = true;
      this.canvas.addEventListener('mousemove', __bind(function() {
        return this.handleCanvasMouseMove;
      }, this));
      this.canvas.addEventListener('mousedown', __bind(function() {
        return this.handleCanvasMouseDown;
      }, this));
      return this.canvas.addEventListener('mouseup', __bind(function() {
        return this.handleCanvasMouseUp;
      }, this));
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
    objectUnderCursor = this.getObjectUnderCursor;
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
          objectUnderCursor.onMouseOver;
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
      objectUnderCursor.onMouseMove;
    }
    return this.lastObjectUnderCursor = objectUnderCursor;
  };
  return Stage;
})();
Tween = (function() {
  function Tween() {}
  Tween.tweens = [];
  Tween.initTime = new Date().getTime();
  Tween.to = function(object, duration, toParams, options) {
    var tween;
    tween = new TweenCommand(object, toParams);
    tween.duration = duration;
    if (options) {
      tween.onComplete = options.onComplete;
      tween.delay = options.delay || 0;
      tween.ease = options.ease || EaseDefault;
    }
    tween.finished = false;
    return this.tweens.push(tween);
  };
  Tween.kill = function(object) {
    var i, _results;
    i = 0;
    _results = [];
    while (i < this.tweens.length) {
      if (this.tweens[i].object === object) {
        this.tweens[i] = null;
        this.tweens.splice(i, 1);
        i = -1;
      }
      _results.push(i++);
    }
    return _results;
  };
  Tween.update = function() {
    var cleanup, i, time, tween, _i, _len, _ref;
    if (this.tweens.length > 0) {
      i = 0;
      cleanup = false;
      time = new Date().getTime();
      _ref = this.tweens;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tween = _ref[_i];
        tween.update(time);
        if (tween.finished) {
          cleanup = true;
          tween = null;
        }
      }
      if (cleanup) {
        return this.cleanup();
      }
    }
  };
  Tween.cleanup = function() {
    var i, _results;
    i = 0;
    _results = [];
    while (i < this.tweens.length) {
      if (!this.tweens[i]) {
        this.tweens.splice(i, 1);
        i = -1;
      }
      _results.push(i++);
    }
    return _results;
  };
  return Tween;
})();
TweenCommand = (function() {
  function TweenCommand(object, toParams) {
    var property;
    this.object = object;
    this.toParams = toParams;
    this.startTime = new Date().getTime();
    this.duration = 0;
    this.delay = 0;
    this.ease = EaseDefault;
    this.finished = false;
    this.onComplete = null;
    this.startValues = {};
    for (property in this.toParams) {
      if (this.object.hasOwnProperty(property)) {
        this.startValues[property] = this.object[property];
        this.toParams[property] = this.toParams[property] - this.object[property];
      }
    }
  }
  TweenCommand.prototype.update = function(updateTime) {
    var factor, property, time, _results;
    time = updateTime - this.startTime;
    if (time >= this.duration) {
      factor = 1;
      this.finished = true;
    } else {
      this.finished = false;
      factor = this.ease(time, 0, 1, this.duration);
    }
    _results = [];
    for (property in this.toParams) {
      _results.push(this.object[property] = this.startValues[property] + (factor * this.toParams[property]));
    }
    return _results;
  };
  return TweenCommand;
})();
Utils = (function() {
  function Utils() {}
  Utils.hex2rgba = function(hex) {
    var num;
    num = parseInt(hex.slice(1), 16);
    return [num >> 16 & 255, num >> 8 & 255, num & 255, num >> 24 & 255];
  };
  Utils.angleToRadians = function(angle) {
    return angle * Math.PI / 180;
  };
  return Utils;
})();