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
 * Experimental PixelSpriteBitmap Class
 *
 * @author D. Lawson <webmaster@altovista.nl>
 */
canvaslib.PixelSpriteBitmap = function() {
  canvaslib.DisplayContainer.call(this);

  this._grid = [];
  this._modified = false;
  this.imageData = null;
  this.pixelSize = 5;
  this.colorPalette = [ '#000000FF',
                        '#AA0000FF',
                        '#00AA00FF',
                        '#AA5500FF',
                        '#0000AAFF',
                        '#AA00AAFF',
                        '#00AAAAFF',
                        '#AAAAAAFF',
                        '#555555FF',
                        '#FF5555FF',
                        '#55FF55FF',
                        '#FFFF55FF',
                        '#5555FFFF',
                        '#FF55FFFF',
                        '#55FFFFFF',
                        '#FFFFFFFF' ];
};

canvaslib.PixelSprite.prototype = {
  /**
   * Draws a given pixelmap
   */
  drawPixelMap: function(map) {
    var x = 0;
    var y = 0;
    var rows;
    var columns;
    var color = 0;

    // initialize image
    this._initWidthAndHeightFromMap(map);

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
  },

  /**
   * Draws a pixel
   */
  drawPixel: function(x, y, color) {
    this._modified = true;

    if(!this._grid[y])
      this._grid[y] = [];

    this._grid[y][x] = color;
  },

  /**
   * Removes a pixel
   */
  removePixel: function(x, y) {
    this._modified = true;
    this._grid[y][x] = null;
  },

  /**
   * Submits pixels to imageData map
   */
  _submitPixels: function() {
    var x = 0;
    var y = 0;
    var x2 = 0;
    var y2 = 0;
    var i = 0;
    var rgba = [];

    // loop in grid
    for(y = 0; y < this._grid.length; y++) {

      if(this._grid[y]) {
        for(x = 0; x < this._grid[y].length; x++) {

          if(this._grid[y][x]) {
            rgba = canvaslib.Utils.hex2rgba(this._grid[y][x]);

            // draw according to pixelsize
            if(this.pixelSize > 1) {
              for(y2 = 0; y2 < this.pixelSize; y2++) {
                for(x2 = 0; x2 < this.pixelSize; x2++) {
                  this._drawPixelInImageData(x * this.pixelSize + x2, y * this.pixelSize + y2, rgba);
                }
              }
            } else {
              this._drawPixelInImageData(x, y, rgba);
            }
          }
        }
      }
    }
  },

  _createEmptyImageData: function() {
    this.imageData = this._backBufferContext.createImageData(this.width, this.height);
  },

  /**
   * Creates empty image data map than can be drawn on
   */
  _initWidthAndHeightFromMap: function(map) {
    var width = 0;
    var height = 0;

    rows = map.split("\n");
    height = rows.length;

    for(y = 0; y < rows.length; y++) {
      columns = rows[y].split('');
      if(columns.length > width) width = columns.length;
    }

    width = width * this.pixelSize;
    height = height * this.pixelSize;

    this.width = width;
    this.height = height;
  },

  /**
   * Draws a rgba pixel in the imagedata array
   */
  _drawPixelInImageData: function(x, y, rgba) {
    var i = (y * 4) * this.imageData.width + (x * 4);

    this.imageData.data[i] = rgba[0];
    this.imageData.data[i + 1] = rgba[1];
    this.imageData.data[i + 2] = rgba[2];
    this.imageData.data[i + 3] = rgba[3];
  },

  /**
   * Draws the image to the canvas
   */
  _draw: function(context, drawHitarea) {
    if(this._modified && !this.imageData)
      this._createEmptyImageData();

    if(this.imageData && this._modified)
      this._submitPixels();

    if(this.imageData) {
      // draw hit area
      if(drawHitarea) {
        context.rect(0, 0, this.imageData.width, this.imageData.height);
      } else {
        context.putImageData(this.imageData, this.x, this.y);
      }
    }

    this._modified = false;
  }
};

canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.PixelSpriteBitmap.prototype);

