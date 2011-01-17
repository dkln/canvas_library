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
 * PixelSprite Class
 *
 * @author D. Lawson <webmaster@altovista.nl>
 */
canvaslib.PixelSprite = function() {
  canvaslib.Shape.call(this);

  this._grid = [];
  this.pixelSize = 4;

  // default palette (ANSI colors)
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
  /**
   * Draws the given pixelmap (string)
   */
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

  /**
   * Draws a pixel
   */
  drawPixel: function(x, y, color) {
    if(!this._grid[y])
      this._grid[y] = [];

    this._grid[y][x] = color;
  },

  /**
   * Removes pixel from grid
   */
  removePixel: function(x, y) {
    this._grid[y][x] = null;
  },

  /**
   * Submits the pixels in the _grid to drawing commands
   */
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

  /**
   * Draws a pixel line
   */
  _drawLine: function(x, y, xs, color) {
    this.fillRect(xs * this.pixelSize, y * this.pixelSize, (x - xs) * this.pixelSize, this.pixelSize, color);
  },
};

canvaslib.Utils.addOwnProperties(canvaslib.Shape.prototype, canvaslib.PixelSprite.prototype);
