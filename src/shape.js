/**
 * Shape
 *
 * @author D Lawson <webmaster@altovista.nl>
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
    var gradient = this._context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    this.addColorStops(gradient, colorStops);

    return gradient;
  },

  _createLinearGradient: function(x1, y1, x2, y2, colorStops) {
    var gradient = this._context.createLinearGradient(x1, y1, x2, y2);
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
    this._drawingCommands.push(['moveTo', x, y]);
  },

  /**
   * Sets the current line thickness
   */
  lineWidth: function(thickness) {
    this._drawingCommands.push(['lineWidth', thickness]);
  },

  /**
   * Sets the line cap style
   *
   * Can be butt, round or square
   */
  lineCap: function(cap) {
    this._drawingCommands.push(['lineCap', cap]);
  },

  /**
   * Line join style
   *
   * Possible values: bevel, round or miter
   */
  lineJoin: function(join) {
    this._drawingCommands.push(['lineJoin', join]);
  },

  /**
   * Draws a line from cursor to X Y pos
   */
  lineTo: function(x, y) {
    this._madeChanges = true;
    this._drawingCommands.push(['lineTo', x, y]);
  },

  /**
   * Draws a bezier curve
   */
  bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._madeChanges = true;
    this._drawingCommands.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
  },

  /**
   * Draws quadtric curve to
   */
  quadraticCurveTo: function(cpx, cpy, x, y) {
    this._madeChanges = true;
    this._drawingCommands.push(['quadraticCurveTo', cpx, cpy, x, y]);
  },

  /**
   * Sets the current miter limit ratio
   */
  miterLimit: function(ratio) {
    this._drawingCommands.push(['miterLimit', ratio]);
  },

  /**
   * Draws a filled rectangle
   */
  fillRect: function(x, y, width, height, color) {
    this._madeChanges = true;

    if(color) this.fillStyle(color);
    this._drawingCommands.push(['fillRect', x, y, width, height]);
  },

  /**
   * Draws a circle
   */
  circle: function(x, y, radius) {
    this.arc(x, y, 0, Math.PI * 2, true);
  },

  /**
   * Draws arc from start to end radius
   */
  arc: function(x, y, startRadius, endRadius, antiClockwise) {
    this._madeChanges = true;
    this._drawingCommands.push(['arc', x, y, startRadius, endRadius, antiClockwise]);
  },

  /**
   * Drawa rectangle with only a stroke
   */
  strokeRect: function(x, y, width, height, color) {
    this._madeChanges = true;
    this._drawingCommands.push(['strokeRect', x, y, width, height]);
  },

  /**
   * Clears the area with a transparent area
   */
  clearRect: function(x, y, width, height) {
    this._madeChanges = true;
    this._drawingCommands.push(['clearRect', x, y, width, height]);
  },

  /**
   * Sets the fillstyle
   */
  fillStyle: function(color) {
    this._drawingCommands.push(['fillStyle=', color]);
  },

  /**
   * Changes the style of strokes
   */
  strokeStyle: function(color) {
    this._drawingCommands.push(['strokeStyle=', color]);
  },

  /**
   * Begins drawing a path
   */
  beginPath: function() {
    this._drawCommands.push(['beginPath']);
  },

  /**
   * Closes a path
   */
  closePath: function() {
    this._madeChanges = true;
    this._drawCommands.push(['closePath']);
  },

  /**
   * Sets the global alpha
   */
  globalAlpha: function(alpha) {
    this._madeChanges = true;
    this._drawCommands.push(['globalAlpha=', alpha]);
  },

  /**
   * Fills the path
   */
  fill: function() {
    this._madeChanges = true;
    this._drawCommands.push( { cmd: 'fill' } );
  },

  /**
   * Draws every command to the context of the canvas
   */
  _draw: function() {
    var i = 0;
    var j = 0;
    var params = [];
    var param;
    var context = this.bitmapCache && this._madeChanges ? this._backBufferContext : this._context;

    context.save();

    // sets the alpha of the image
    context.globalAlpha = this.alpha;

    // set start X and Y pos to the real-world-canvas-XY
    // do not translate if we are using bitmap caches
    if(this.bitmapCache) {
      // clear bitmap cache
      context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    } else {
      context.translate(this._canvasX, this._canvasY);
      //context.setTransform(this.transformM11, this.transformM12, this.transformM21, this.transformM22, this.transformDx, this.transformDy);
      context.rotate(canvaslib.Math.angleToRadians(this._rotation));
      context.scale(this._scaleX, this._scaleY);
    }

    // @TODO, @FIXME maybe an "eval" is quicker than executing seperate
    // methods
    for(i = 0; i < this._drawingCommands.length; i++) {
      // draw the stuff on the canvas
      // does the drawing command have any params?
      // setter?
      if(this._drawingCommands[i][0].substr(-1, 1) == '=' && this._drawingCommands[i].length == 2) {
        context[this._drawingCommands[i][0].substr(0, this._drawingCommands[i][0].length - 1)] = this._drawingCommands[i][1];
        //console.log(this._drawingCommands[i][0] + this._drawingCommands[i][1]);

      } else if(this._drawingCommands[i].length > 1) {
        // yes translate them
        context[this._drawingCommands[i][0]].apply(context, this._drawingCommands[i].slice(1));
        //console.log(this._drawingCommands[i][0] + "(" + this._drawingCommands[i].slice(1) + ")");

      } else {
        // nope!
        context[this._drawingCommands[i][0]]();
        //console.log(this._drawingCommands[i][0] + "()");

      }
    }

    context.restore();
    this._madeChanges = false;
  },

  _cacheBitmap: function() {
    this._imageData = this._backBufferContext.getImageData(0, 0, this._canvas.width, this._canvas.height);
  }
};

canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.Shape.prototype);
