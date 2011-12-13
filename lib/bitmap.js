(function() {
  var Bitmap;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Bitmap = (function() {

    __extends(Bitmap, DisplayObject);

    function Bitmap(imageData) {
      this.imageData = imageData;
      Bitmap.__super__.constructor.call(this);
    }

    Bitmap.prototype.draw = function(context, drawHitarea) {
      if (this.imageData) {
        if (this.drawHitarea) {
          return context.rect(0, 0, this.imageData.width, this.imageData.height);
        } else {
          return context.drawImage(this.imageData, 0, 0);
        }
      }
    };

    return Bitmap;

  })();

  this.CanvasLibrary || (this.CanvasLibrary = {});

  this.CanvasLibrary.Bitmap = Bitmap;

}).call(this);
