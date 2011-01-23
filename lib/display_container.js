var DisplayContainer;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
DisplayContainer = (function() {
  __extends(DisplayContainer, DisplayObject);
  function DisplayContainer() {
    this.children = [];
    DisplayContainer.__super__.constructor.call(this);
  }
  DisplayContainer.prototype.addChild = function(child) {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    if (this.stage) {
      this.stage.childrenChanged = true;
    }
    child.parent = this;
    child.stage = this.stage;
    this.children.push(child);
    return this;
  };
  DisplayContainer.prototype.removeChild = function(child) {
    var i;
    i = this.children.indexOf(child);
    if (i === -1) {
      throw 'Child object not found in DisplayList';
    } else {
      if (this.stage) {
        this.stage.childrenChanged = true;
      }
      this.children.splice(i, 1);
      return this;
    }
  };
  DisplayContainer.prototype.draw = function(context, drawHitarea) {};
  return DisplayContainer;
})();