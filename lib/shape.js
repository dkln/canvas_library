var Shape;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Shape = (function() {
  __extends(Shape, DisplayObject);
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