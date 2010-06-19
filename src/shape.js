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
   *
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
    this._madeChanges = true;

    this._cursorX = x;
    this._cursorY = y;
    this._drawingCommands.push(['moveTo', x, y]);
  },

  /**
   * Draws a line from cursor to X Y pos
   */
  lineTo: function(x, y) {
    this._madeChanges = true;

    this._drawingCommands.push(['lineTo', x, y]);
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
    this._madeChanges = true;
    this._drawingCommands.push(['fillStyle=', color]);
  },

  /**
   * Changes the style of strokes
   */
  strokeStyle: function(color) {
    this._madeChanges = true;
    this._drawingCommands.push(['strokeStyle=', color]);
  },

  /**
   * Begins drawing a path
   */
  beginPath: function() {
    this._madeChanges = true;
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

    // did we not make any graphical changes and are we using a bitmap cache?
    if(!this._madeChanges && this.bitmapCache) {
      // draw to our backbuffer
      context.save();
      //context.globalCompositeOperation = 'destination-atop';
      context.translate(this._canvasX, this.canvasY);

      context.rotate(canvaslib.Math.angleToRadians(this.rotation));

      // @TODO W3C epic fail... putImageData cannot handle transparency because that would make it usefull
      //
      //context.putImageData(this._imageData, 0, 0);
      //context.drawImage(this._imageData, 0, 0);
      context.drawImage(this._backBufferCanvas, 0, 0);
      //context.drawImage(this._imageData, 0, 0);

    } else {
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
        context.rotate(canvaslib.Math.angleToRadians(this.rotation));
      }

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
      if(this.bitmapCache && this._madeChanges) this._cacheBitmap();
    }

    this._madeChanges = false;
  },

  _cacheBitmap: function() {
    this._imageData = this._backBufferContext.getImageData(0, 0, this._canvas.width, this._canvas.height);
  }
};

canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.Shape.prototype);
