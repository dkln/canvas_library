/**
  * Pixelator machine
  *
  * @author D Lawson <webmaster@altovista.nl>
  */
canvaslib.PixelSprite = function(pixelmap) {
  canvaslib.Shape.call(this);
  this._grid = [];
  this.pixelSize = 3;

  // pixelmap? yay!
  if(pixelmap) {
  }
};

canvaslib.PixelSprite.prototype = {
  drawPixel: function(x, y, color) {
    if(!this._grid[y])
      this._grid[y] = [];

    this._grid[y][x] = color;
  },

  removePixel: function(x, y) {
    this._grid[y][x] = null;
  },

  _drawLine: function(x, y, xs, color) {
    this.fillRect(x, y, ((x - xs) + 1) * this.pixelSize, y + this.pixelSize, color);
  },

  submit: function() {
    var x = 0;
    var y = 0;
    var startX = null;
    var currentColor = null;
    var drawn = false;

    // reset drawing commands
    this._drawingCommands = [];

    for(y = 0; this._grid.length; y++) {
      currentColor = null;

      for(x = 0; this._grid[y].length; x++) {
        if(currentColor != this._grid[y][x]) {

          if(currentColor) this._drawLine(x, y, startX, currentColor);

          currentColor = this._grid[y][x];
          startX = x;
        }
      }

      if(currentColor) this._drawLine(x, y, startX, currentColor);
    }
  }
};

canvaslib.Utils.addOwnProperties(canvaslib.Shape.prototype, canvaslib.PixelSprite.prototype);
