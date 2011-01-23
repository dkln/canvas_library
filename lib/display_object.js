var DisplayObject;
DisplayObject = (function() {
  function DisplayObject() {
    this.id = '';
    this.x = 0;
    this.y = 0;
    this.oldX = 0;
    this.oldY = 0;
    this.calculatedX = 0;
    this.calculatedY = 0;
    this.width = 0;
    this.height = 0;
    this.alpha = 1;
    this.oldAlpha = 1;
    this.calculatedAlpha = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.oldScaleX = 1;
    this.oldScaleY = 1;
    this.calculatedScaleX = 1;
    this.calculatedScaleY = 1;
    this.rotation = 0;
    this.oldRotation = 0;
    this.calculatedRotation = 0;
    this.enabled = true;
    this.visible = true;
    this.oldVisible = true;
    this.calculatedVisibility = true;
    this.mouseEnabled = false;
    this.mouseDown = false;
    this.useHandCursor = false;
    this.shadow = false;
    this.shadowBlur = 0;
    this.shadowColor = 0;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    this.onMouseOver = null;
    this.onMouseOut = null;
    this.onMouseDown = null;
    this.onMouseMove = null;
    this.localX = 0;
    this.localY = 0;
    this.isMouseSetup = false;
    this.mouseDown = false;
    this.lastObjectUnderCursor = null;
    this.stage = null;
    this.parent = null;
    this.childrenChanged = false;
  }
  DisplayObject.prototype.draw = function(context, drawHitarea) {};
  DisplayObject.prototype.calculateCanvasPositions = function() {
    var newVars;
    if (this.positionChanged()) {
      this.oldX = this.x;
      this.oldY = this.y;
      this.oldRotation = this.rotation;
      this.oldScaleX = this.scaleX;
      this.oldScaleY = this.scaleY;
      this.oldVisible = this.visible;
      this.oldAlpha = this.alpha;
      newVars = this.getInheritedTranslatedVars();
      this.calculatedX = newVars[0];
      this.calculatedY = newVars[1];
      this.calculatedRotation = newVars[2];
      this.calculatedScaleX = newVars[3];
      this.calculatedScaleY = newVars[4];
      this.calculatedVisibility = newVars[5];
      return this.calculatedAlpha = newVars[6];
    }
  };
  DisplayObject.prototype.getInheritedTranslatedVars = function() {
    var theParent, translatedAlpha, translatedRotation, translatedScaleX, translatedScaleY, translatedVisibility, translatedX, translatedY;
    theParent = this;
    translatedX = 0;
    translatedY = 0;
    translatedRotation = 0;
    translatedScaleX = 1;
    translatedScaleY = 1;
    translatedVisibility = true;
    translatedAlpha = 1;
    while (!(theParent === null || theParent === this.stage)) {
      translatedX += theParent.x;
      translatedY += theParent.y;
      translatedRotation += theParent.rotation;
      translatedScaleX *= theParent.scaleX;
      translatedScaleY *= theParent.scaleY;
      if (!theParent.visible) {
        translatedVisibility = false;
      }
      translatedAlpha *= theParent.alpha;
      theParent = theParent.parent;
    }
    return [translatedX, translatedY, translatedRotation, translatedScaleX, translatedScaleY, translatedVisibility, translatedAlpha];
  };
  DisplayObject.prototype.positionChanged = function() {
    return this.x !== this.oldX || this.y !== this.oldY || this.rotation !== this.oldRotation || this.scaleX !== this.oldScaleX || this.scaleY !== this.oldScaleY || this.visible !== this.oldVisible || this.alpha !== this.oldAlpha;
  };
  return DisplayObject;
})();