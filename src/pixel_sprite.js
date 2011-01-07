/**
  * Pixelator machine
  *
  * @author D Lawson <webmaster@altovista.nl>
  */
canvaslib.PixelSprite = function() {
  canvaslib.Shape.call(this);
  this._grid = [];
  this.pixelSize = 4;
  this.colorPalette = [ 'rgba(0, 0, 0, 1)',
                        'rgba(170, 0, 0, 1)',
                        'rgba(0, 170, 0, 1)',
                        'rgba(170, 85, 0, 1)',
                        'rgba(0, 0, 170, 1)',
                        'rgba(170, 0, 170, 1)',
                        'rgba(0, 170, 170, 1)',
                        'rgba(170, 170, 170, 1)',
                        'rgba(85, 85, 85, 1)',
                        'rgba(255, 85, 85, 1)',
                        'rgba(82, 255, 85, 1)',
                        'rgba(255, 255, 85, 1)',
                        'rgba(85, 85, 255, 1)',
                        'rgba(255, 85, 255, 1)',
                        'rgba(85, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)' ];

};

canvaslib.PixelSprite.prototype = {
  drawPixelMap: function(map) {
    var x = 0;
    var y = 0;
    var rows;
    var columns;
    var color = 0;

    rows = map.split("\n")

    for(y = 0; y < rows.length; y++) {
      columns = rows[y].split('');

      for(x = 0; x < columns.length; x++) {
        color = columns[x].charCodeAt(0);

        if(color >= 65 && color <= 65 + this.colorPalette.length) {
          this.drawPixel(x, y, this.colorPalette[color - 65]);
        }
      }
    }

    this.submitPixels();
  },

  drawPixel: function(x, y, color) {
    if(!this._grid[y])
      this._grid[y] = [];

    this._grid[y][x] = color;
  },

  removePixel: function(x, y) {
    this._grid[y][x] = null;
  },

  _drawLine: function(x, y, xs, color) {
    this.fillRect(xs * this.pixelSize, y * this.pixelSize, (x - xs) * this.pixelSize, this.pixelSize, color);
  },

  submitPixels: function() {
    var x = 0;
    var y = 0;
    var startX = null;
    var currentColor = null;
    var drawn = false;

    // reset drawing commands
    this._drawingCommands = [];

    for(y = 0; y < this._grid.length; y++) {
      currentColor = null;
      startX = 0;

      if(this._grid[y]) {
        for(x = 0; x < this._grid[y].length; x++) {
          if(currentColor != this._grid[y][x]) {
            if(currentColor) this._drawLine(x, y, startX, currentColor);

            currentColor = this._grid[y][x];
            startX = x;
          }
        }

        if(currentColor) this._drawLine(x, y, startX, currentColor);
      }
    }
  }
};

canvaslib.Utils.addOwnProperties(canvaslib.Shape.prototype, canvaslib.PixelSprite.prototype);
