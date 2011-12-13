(function() {
  var DisplayObject;

  DisplayObject = (function() {

    function DisplayObject() {
      this.id = '';
      this.x = 0;
      this.y = 0;
      this.oldX = null;
      this.oldY = null;
      this.calculatedX = 0;
      this.calculatedY = 0;
      this.width = 0;
      this.height = 0;
      this.alpha = 1;
      this.oldAlpha = 1;
      this.calculatedAlpha = 1;
      this.scaleX = 1;
      this.scaleY = 1;
      this.oldScaleX = null;
      this.oldScaleY = null;
      this.calculatedScaleX = 1;
      this.calculatedScaleY = 1;
      this.rotation = 0;
      this.oldRotation = null;
      this.calculatedRotation = 0;
      this.enabled = true;
      this.visible = true;
      this.oldVisible = null;
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
      this.ancestors = null;
      this.translatedObjects = null;
      this.childrenChanged = false;
    }

    DisplayObject.prototype.draw = function(context, drawHitarea) {};

    DisplayObject.prototype.calculateCanvasPositions = function() {
      var newVars;
      if (this.positionChanged()) {
        this.oldX = this.x;
        this.oldY = this.y;
        this.oldVisible = this.visible;
        this.oldAlpha = this.alpha;
        newVars = this.getInheritedTranslatedVars();
        this.calculatedX = newVars[0];
        this.calculatedY = newVars[1];
        this.calculatedVisibility = newVars[2];
        return this.calculatedAlpha = newVars[3];
      }
    };

    DisplayObject.prototype.getInheritedTranslatedVars = function() {
      var theParent, translatedAlpha, translatedVisibility, translatedX, translatedY;
      theParent = this;
      translatedX = 0;
      translatedY = 0;
      translatedVisibility = true;
      translatedAlpha = 1;
      while (theParent) {
        translatedX += theParent.x;
        translatedY += theParent.y;
        if (!theParent.visible) translatedVisibility = false;
        translatedAlpha *= theParent.alpha;
        theParent = theParent.parent;
      }
      return [translatedX, translatedY, translatedVisibility, translatedAlpha];
    };

    DisplayObject.prototype.positionChanged = function() {
      return this.x !== this.oldX || this.y !== this.oldY || this.rotation !== this.oldRotation || this.scaleX !== this.oldScaleX || this.scaleY !== this.oldScaleY || this.visible !== this.old || this.ancestorsPositionChanged();
    };

    DisplayObject.prototype.ancestorsPositionChanged = function() {
      var ancestor, _i, _len, _ref;
      _ref = this.ancestors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ancestor = _ref[_i];
        if (ancestor.positionChanged()) return true;
      }
      return false;
    };

    return DisplayObject;

  })();

  this.CanvasLibrary || (this.CanvasLibrary = {});

  this.CanvasLibrary.DisplayObject = DisplayObject;

}).call(this);
