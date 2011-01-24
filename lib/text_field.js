var TextField;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
TextField = (function() {
  __extends(TextField, DisplayObject);
  function TextField() {
    this.text = '';
    this.textAlign = 'left';
    this.strokeStyle = null;
    this.fillStyle = 'rgba(0, 0, 0, 1)';
    this.fontFace = 'Arial';
    this.fontSize = 20;
    this.maxWidth = null;
    TextField.__super__.constructor.call(this);
  }
  TextField.prototype.draw = function(context, drawHitarea) {
    context.font = this.fontSize + 'px ' + this.fontFace;
    context.textBaseline = 'top';
    if (drawHitarea) {
      context.beginPath();
      context.rect(0, 0, context.measureText(this.text).width, this.fontSize);
      return context.closePath();
    } else {
      context.strokeStyle = this.strokeStyle;
      context.fillStyle = this.fillStyle;
      return context.fillText(this.text, 0, 0);
    }
  };
  return TextField;
})();