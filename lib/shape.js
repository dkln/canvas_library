var Shape;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Shape = (function() {
  __extends(Shape, DisplayContainer);
  function Shape() {
    this.madeChanges = false;
    this.drawingCommands = [];
  }
  Shape.prototype.clear = function() {
    this.madeChanges = true;
    return this.drawingCommands = [];
  };
  Shape.prototype.addColorStops = function(gradient, colorStops) {
    colorStops.forEach(__bind(function(colorStop) {
      return gradient.addColorStop(colorStop[0], colorStop[1]);
    }, this));
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
    return this.fillStyle(this.createRadialGradient(x1, y1, r1, x2, y2, r2, colorStops));
  };
  Shape.prototype.setLinearGradient = function(x1, y1, x2, y2, colorStops) {
    return this.fillStyle(this.createLinearGradient(x1, y1, x2, y2, colorStops));
  };
  Shape.prototype.moveTo = function(x, y) {
    return this.drawingCommands.push([true, 'moveTo', x, y]);
  };
  Shape.prototype.lineWidth = function(thickness) {
    return this.drawingCommands.push([true, 'lineWidth', thickness]);
  };
  Shape.prototype.lineCap = function(cap) {
    return this.drawingCommands.push([true, 'lineCap', cap]);
  };
  Shape.prototype.lineTo = function(x, y) {
    this.madeChanges = true;
    return this.drawingCommands.push([true, 'lineTo', x, y]);
  };
  Shape.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.madeChanges = true;
    return this.drawingCommands.push([true, 'bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
  };
  Shape.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
    this.madeChanges = true;
    return this.drawingCommands.push([true, 'quadraticCurveTo', cpx, cpy, x, y]);
  };
  Shape.prototype.miterLimit = ratio > Shape.drawingCommands.push([true, 'miterLimit', ratio]);
  Shape.prototype.beginPath = function() {
    return this.drawingCommands.push([false, 'beginPath']);
  };
  Shape.prototype.endPath = function() {
    return this.drawingCommands.push([false, 'closePath']);
  };
  Shape.prototype.fillRect = function(x, y, width, height, color) {
    this.madeChanges = true;
    if (color) {
      this.fillStyle(color);
    }
    this.drawingCommands.push([true, 'rect', x, y, width, height]);
    return this.drawingCommands.push([false, 'fillRect', x, y, width, height]);
  };
  Shape.prototype.circle = function(x, y, radius) {
    return this.arc(x, y, radius / 2, 0, Math.PI * 2, true);
  };
  Shape.prototype.arc = function(x, y, sr, er, cw) {
    this.madeChanges = true;
    return this.drawingCommands.push([true, 'arc', x, y, sr, er, cw]);
  };
  Shape.prototype.strokeRect = function(x, y, width, height, color) {
    this.madeChanges = true;
    this.drawingCommands.push([true, 'rect', x, y, width, height]);
    return this.drawingCommands.push([false, 'strokeRect', x, y, width, height]);
  };
  Shape.prototype.clearRect = function(x, y, width, height) {
    this.madeChanges = true;
    return this.drawingCommands.push([true, 'clearRect', x, y, width, height]);
  };
  Shape.prototype.fillStyle = function(color) {
    return this.drawingCommands.push([false, 'fillStyle=', color]);
  };
  Shape.prototype.strokeStyle = function(color) {
    return this.drawingCommands.push([false, 'strokeStyle=', color]);
  };
  Shape.prototype.globalAlpha = function(alpha) {
    this.madeChanges = true;
    return this.drawingCommands.push([false, 'globalAlpha=', alpha]);
  };
  Shape.prototype.fill = function() {
    this.madeChanges = true;
    return this.drawingCommands.push([false, 'fill']);
  };
  Shape.prototype.draw = function(context, drawHitarea) {
    var command, i, instruction;
    i = 0;
    while (i < this.drawingCommands.length) {
      command = this.drawingCommands[i];
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