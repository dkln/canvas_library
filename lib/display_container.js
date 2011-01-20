var DisplayContainer;
DisplayContainer = (function() {
  function DisplayContainer() {
    this.id = '';
    this.children = [];
    this.x = 0;
    this.y = 0;
    this.canvasX = 0;
    this.canvasY = 0;
    this.width = 0;
    this.height = 0;
    this.alpha = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.calculatedScaleX = 1;
    this.calculatedScaleY = 1;
    this.rotation = 0;
    this.calculatedRotation = 0;
    this.enabled = true;
    this.visible = true;
    this.calculatedVisibility = true;
    this.mouseEnabled = false;
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
    this.oldX = 0;
    this.oldY = 0;
    this.oldRotation = 0;
    this.oldScaleX = 1;
    this.oldScaleY = 1;
    this.oldVisible = true;
    this.oldMouseX = 0;
    this.oldMouseY = 0;
    this.isMouseSetup = false;
    this.mouseDown = false;
    this.canvas = null;
    this.lastObjectUnderCursor = null;
    this.stage = null;
    this.parent = null;
    this.childrenChanged = false;
  }
  DisplayContainer.prototype.addChild = function(child) {
    this.stage.childrenChanged = true;
    if (child.parent) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    child.stage = this.stage;
    this.children.push(child);
    return this;
  };
  DisplayContainer.prototype.setChildIndex = function(child, index) {
    if (this.children.indexOf(child) === -1) {
      throw 'Child object not found in DisplayList';
    } else {
      return this.superDisplayContainer()._childrenChanged = true;
    }
  };
  DisplayContainer.prototype.removeChild = function(child) {
    var i;
    i = this.children.indexOf(child);
    if (i === -1) {
      throw 'Child object not found in DisplayList';
    } else {
      this.stage.childrenChanged = true;
      this.children.splice(i, 1);
      return this;
    }
  };
  DisplayContainer.prototype.draw = function(context, drawHitarea) {};
  DisplayContainer.prototype.calculateCanvasPositions = function() {
    var newVars;
    if (this.positionChanged) {
      newVars = this.getInheritedTranslatedVars();
      this.oldX = this.x;
      this.oldY = this.y;
      this.oldRotation = this.rotation;
      this.oldScaleX = this.scaleX;
      this.oldScaleY = this.scaleY;
      this.canvasX = newVars[0];
      this.canvasY = newVars[1];
      this.calculatedRotation = newVars[2];
      this.calculatedScaleX = newVars[3];
      this.calculatedScaleY = newVars[4];
      return this.calculatedVisibility = newVars[5];
    }
  };
  DisplayContainer.prototype.getInheritedTranslatedVars = function() {
    var theParent, translatedRotation, translatedScaleX, translatedScaleY, translatedX, translatedY, visible;
    theParent = this;
    translatedX = 0;
    translatedY = 0;
    translatedRotation = 0;
    translatedScaleX = 1;
    translatedScaleY = 1;
    visible = true;
    while (theParent !== null) {
      translatedX += theParent.x;
      translatedY += theParent.y;
      translatedRotation += theParent.rotation;
      translatedScaleX *= theParent.scaleX;
      translatedScaleY *= theParent.scaleY;
      if (!theParent.visible) {
        visible = false;
      }
      theParent = theParent.parent;
    }
    return [translatedX, translatedScaleY, translatedRotation, translatedScaleX, translatedScaleY, visible];
  };
  return DisplayContainer;
})();