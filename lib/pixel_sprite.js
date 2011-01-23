var PixelSprite;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
PixelSprite = (function() {
  __extends(PixelSprite, Shape);
  PixelSprite.defaultColorPalette = ['rgba(0, 0, 0, 1)', 'rgba(170, 0, 0, 1)', 'rgba(0, 170, 0, 1)', 'rgba(170, 85, 0, 1)', 'rgba(0, 0, 170, 1)', 'rgba(170, 0, 170, 1)', 'rgba(0, 170, 170, 1)', 'rgba(170, 170, 170, 1)', 'rgba(85, 85, 85, 1)', 'rgba(255, 85, 85, 1)', 'rgba(82, 255, 85, 1)', 'rgba(255, 255, 85, 1)', 'rgba(85, 85, 255, 1)', 'rgba(255, 85, 255, 1)', 'rgba(85, 255, 255, 1)', 'rgba(255, 255, 255, 1)'];
  function PixelSprite(map) {
    PixelSprite.__super__.constructor.call(this);
    this.pixels = [];
    this.colorPalette = PixelSprite.defaultColorPalette;
    this.pixelSize = 4;
    if (map) {
      this.drawPixelMap(map);
    }
  }
  PixelSprite.prototype.drawPixelMap = function(map) {
    var color, column, columns, row, rows, x, y, _i, _j, _len, _len2;
    x = 0;
    y = 0;
    rows = map.split("\n");
    for (_i = 0, _len = rows.length; _i < _len; _i++) {
      row = rows[_i];
      columns = row.split('');
      x = 0;
      for (_j = 0, _len2 = columns.length; _j < _len2; _j++) {
        column = columns[_j];
        color = column.charCodeAt(0);
        if (this.colorPalette[color]) {
          this.drawPixel(x, y, this.colorPalette[color]);
        }
        x++;
      }
      y++;
    }
    return this.submitPixels();
  };
  PixelSprite.prototype.drawPixel = function(x, y, color) {
    if (!this.pixels[y]) {
      this.pixels[y] = [];
    }
    return this.pixels[y][x] = color;
  };
  PixelSprite.prototype.removePixel = function(x, y) {
    return this.pixels[y][x] = null;
  };
  PixelSprite.prototype.submitPixels = function() {
    var column, row, x, y, _i, _j, _len, _len2, _ref, _results;
    x = 0;
    y = 0;
    _ref = this.pixels;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      x = 0;
      if (row) {
        for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
          column = row[_j];
          if (column) {
            this.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize, column);
          }
          x++;
        }
      }
      _results.push(y++);
    }
    return _results;
  };
  return PixelSprite;
})();