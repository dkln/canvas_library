(function() {
  var Tween;

  Tween = (function() {

    function Tween() {}

    Tween.tweens = [];

    Tween.initTime = new Date().getTime();

    Tween.to = function(object, duration, toParams, options) {
      var tween;
      tween = new TweenCommand(object, toParams);
      tween.duration = duration;
      if (options) {
        tween.onComplete = options.onComplete;
        tween.delay = options.delay || 0;
        tween.ease = options.ease || EaseDefault;
      }
      tween.finished = false;
      return this.tweens.push(tween);
    };

    Tween.kill = function(object) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < this.tweens.length) {
        if (this.tweens[i].object === object) {
          this.tweens[i] = null;
          this.tweens.splice(i, 1);
          i = -1;
        }
        _results.push(i++);
      }
      return _results;
    };

    Tween.update = function() {
      var cleanup, i, time, tween, _i, _len, _ref;
      if (this.tweens.length > 0) {
        i = 0;
        cleanup = false;
        time = new Date().getTime();
        _ref = this.tweens;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tween = _ref[_i];
          tween.update(time);
          if (tween.finished) {
            cleanup = true;
            tween = null;
          }
        }
        if (cleanup) return this.cleanup();
      }
    };

    Tween.cleanup = function() {
      var i, _results;
      i = 0;
      _results = [];
      while (i < this.tweens.length) {
        if (!this.tweens[i]) {
          this.tweens.splice(i, 1);
          i = -1;
        }
        _results.push(i++);
      }
      return _results;
    };

    return Tween;

  })();

  this.CanvasLibrary || (this.CanvasLibrary = {});

  this.CanvasLibrary.Tween = Tween;

}).call(this);
