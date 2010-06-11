canvaslib.Bitmap = function() {
  this.init();
};

canvaslib.Bitmap.prototype = {
  init: function() {
  }
};

canvaslib.extend(canvaslib.Bitmap, canvaslib.DisplayContainer);