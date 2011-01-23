var TweenCommand;
TweenCommand = (function() {
  function TweenCommand(object, toParams) {
    var property;
    this.object = object;
    this.toParams = toParams;
    this.startTime = new Date().getTime();
    this.duration = 0;
    this.delay = 0;
    this.ease = EaseDefault;
    this.finished = false;
    this.onComplete = null;
    this.startValues = {};
    for (property in this.toParams) {
      if (this.object.hasOwnProperty(property)) {
        this.startValues[property] = this.object[property];
        this.toParams[property] = this.toParams[property] - this.object[property];
      }
    }
  }
  TweenCommand.prototype.update = function(updateTime) {
    var factor, property, time, _results;
    time = updateTime - this.startTime;
    if (time >= this.duration) {
      factor = 1;
      this.finished = true;
    } else {
      this.finished = false;
      factor = this.ease(time, 0, 1, this.duration);
    }
    _results = [];
    for (property in this.toParams) {
      _results.push(this.object[property] = this.startValues[property] + (factor * this.toParams[property]));
    }
    return _results;
  };
  return TweenCommand;
})();