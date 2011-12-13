(function() {
  var DisplayContainer;

  DisplayContainer = (function() {

    function DisplayContainer() {}

    DisplayContainer.prototype.draw = function(context, drawHitarea) {
      return true;
    };

    return DisplayContainer;

  })();

  include(DisplayContainer, DisplayContainerMixin);

  this.CanvasLibrary || (this.CanvasLibrary = {});

  this.CanvasLibrary.DisplayContainer = DisplayContainer;

}).call(this);
