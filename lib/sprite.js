(function() {
  var Sprite;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Sprite = (function() {

    __extends(Sprite, Shape);

    function Sprite() {
      Sprite.__super__.constructor.call(this);
      this.children = [];
    }

    return Sprite;

  })();

  include(Sprite, DisplayContainerMixin);

  this.CanvasLibrary || (this.CanvasLibrary = {});

  this.CanvasLibrary.Sprite = Sprite;

}).call(this);
