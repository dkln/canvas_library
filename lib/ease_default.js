(function() {
  var EaseDefault;

  EaseDefault = function(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  };

  this.CanvasLibrary || (this.CanvasLibrary = {});

  this.CanvasLibrary.EaseDefault = EaseDefault;

}).call(this);
