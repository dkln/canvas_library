/**
 * Copyright 2010-2011 Diederick Lawson. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY DIEDERICK LAWSON "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL DIEDERICK LAWSON OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Diederick Lawson.
 *
 * Shape Class
 *
 * @author D. Lawson <webmaster@altovista.nl>
 */
canvaslib.Shape = function() {
   canvaslib.DisplayContainer.call(this);

   this.bitmapCache = false;
   this._imageData = null;
   this._madeChanges = false;
   this._cursorX = 0;
   this._cursorY = 0;
   this._fillColor = 0;
   this._fill = false;
   this._alpha = 1;
   this._drawingCommands = [];
};

canvaslib.Shape.prototype = {
  /**
   * Clears all drawing commands
   */
  clear: function() {
    this._madeChanges = true;

    // removes all drawing instructions
    this._drawingCommands = [];
  },

  /**
   * Creates a gradient fillstyle with given colorStops
   */
  addColorStops: function(gradient, colorStops) {
    var i = 0;

    for(i = 0; i < colorStops.length; i++) {
      gradient.addColorStop(colorStops[i][0], colorStops[i][1]);
    }

    return gradient;
  },

  /**
   * Creates a radial gradient object
   */
  _createRadialGradient: function(x1, y1, r1, x2, y2, r2, colorStops) {
    var gradient = this._backBufferContext.createRadialGradient(x1, y1, r1, x2, y2, r2);
    this.addColorStops(gradient, colorStops);

    return gradient;
  },

  _createLinearGradient: function(x1, y1, x2, y2, colorStops) {
    var gradient = this._backBufferContext.createLinearGradient(x1, y1, x2, y2);
    this.addColorStops(gradient, colorStops);

    return gradient;
  },

  /**
   * Sets the radial gradient fill
   */
  setRadialGradient: function(x1, y1, r1, x2, y2, r2, colorStops) {
    this.fillStyle(this._createRadialGradient(x1, y1, r1, x2, y2, r2, colorStops));
  },

  /**
   * Sets the linear gradient fill
   */
  setLinearGradient: function(x1, y1, x2, y2, colorStops) {
    this.fillStyle(this._createLinearGradient(x1, y1, x2, y2, colorStops));
  },

  /**
   * Moves the cursor to X Y
   */
  moveTo: function(x, y) {
    this._cursorX = x;
    this._cursorY = y;
    this._drawingCommands.push([true, 'moveTo', x, y]);
  },

  /**
   * Sets the current line thickness
   */
  lineWidth: function(thickness) {
    this._drawingCommands.push([true, 'lineWidth', thickness]);
  },

  /**
   * Sets the line cap style
   *
   * Can be butt, round or square
   */
  lineCap: function(cap) {
    this._drawingCommands.push([true, 'lineCap', cap]);
  },

  /**
   * Line join style
   *
   * Possible values: bevel, round or miter
   */
  lineJoin: function(join) {
    this._drawingCommands.push([true, 'lineJoin', join]);
  },

  /**
   * Draws a line from cursor to X Y pos
   */
  lineTo: function(x, y) {
    this._madeChanges = true;
    this._drawingCommands.push([true, 'lineTo', x, y]);
  },

  /**
   * Draws a bezier curve
   */
  bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._madeChanges = true;
    this._drawingCommands.push([true, 'bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
  },

  /**
   * Draws quadtric curve to
   */
  quadraticCurveTo: function(cpx, cpy, x, y) {
    this._madeChanges = true;
    this._drawingCommands.push([true, 'quadraticCurveTo', cpx, cpy, x, y]);
  },

  /**
   * Sets the current miter limit ratio
   */
  miterLimit: function(ratio) {
    this._drawingCommands.push([true, 'miterLimit', ratio]);
  },

  beginPath: function() {
    this._drawingCommands.push([false, 'beginPath']);
  },

  closePath: function() {
    this._drawingCommands.push([false, 'closePath']);
  },

  /**
   * Draws a filled rectangle
   */
  fillRect: function(x, y, width, height, color) {
    this._madeChanges = true;

    if(color) this.fillStyle(color);

    // also add rect drawing command to add collision detection
    this._drawingCommands.push([true, 'rect', x, y, width, height]);
    this._drawingCommands.push([false, 'fillRect', x, y, width, height]);
  },

  /**
   * Draws a circle
   */
  circle: function(x, y, radius) {
    this.arc(x, y, radius / 2, 0, Math.PI * 2, true);
  },

  /**
   * Draws arc from start to end radius
   */
  arc: function(x, y, startRadius, endRadius, antiClockwise) {
    this._madeChanges = true;
    this._drawingCommands.push([true, 'arc', x, y, startRadius, endRadius, antiClockwise]);
  },

  /**
   * Drawa rectangle with only a stroke
   */
  strokeRect: function(x, y, width, height, color) {
    this._madeChanges = true;

    // also add rect drawing command to add collision detection
    this._drawingCommands.push([true, 'rect', x, y, width, height]);
    this._drawingCommands.push([false, 'strokeRect', x, y, width, height]);
  },

  /**
   * Clears the area with a transparent area
   */
  clearRect: function(x, y, width, height) {
    this._madeChanges = true;
    this._drawingCommands.push([true, 'clearRect', x, y, width, height]);
  },

  /**
   * Sets the fillstyle
   */
  fillStyle: function(color) {
    this._drawingCommands.push([false, 'fillStyle=', color]);
  },

  /**
   * Changes the style of strokes
   */
  strokeStyle: function(color) {
    this._drawingCommands.push([false, 'strokeStyle=', color]);
  },

  /**
   * Sets the global alpha
   */
  globalAlpha: function(alpha) {
    this._madeChanges = true;
    this._drawingCommands.push([false, 'globalAlpha=', alpha]);
  },

  /**
   * Fills the path
   */
  fill: function() {
    this._madeChanges = true;
    this._drawingCommands.push([false, 'fill']);
  },

  /**
   * Draws every command to the context of the canvas
   */
  _draw: function(context, drawHitarea) {
    var i = 0;
    var j = 0;
    var params = [];
    var param;

    // @TODO, @FIXME maybe an "eval" is quicker than executing seperate
    // methods?
    for(i = 0; i < this._drawingCommands.length; i++) {
      // draw the stuff on the canvas
      // does the drawing command have any params?
      // setter?
      // draw in hitArea mode?
      if(!drawHitarea || (drawHitarea && this._drawingCommands[i][0])) {
        if(this._drawingCommands[i][1].substr(-1, 1) == '=' && this._drawingCommands[i].length == 3) {
          context[this._drawingCommands[i][1].substr(0, this._drawingCommands[i][1].length - 1)] = this._drawingCommands[i][2];

        } else if(this._drawingCommands[i].length > 2) {
          // yes translate them
          context[this._drawingCommands[i][1]].apply(context, this._drawingCommands[i].slice(2));

        } else if(this._drawingCommands[i].length == 2) {
          // nope!
          context[this._drawingCommands[i][1]]();
        }
      }
    }

    this._madeChanges = false;
  }
};

canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.Shape.prototype);
