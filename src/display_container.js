/**
 * Main display container
 *
 * @author D Lawson <webmaster@altovista.nl>
 */

canvaslib.DisplayContainer = function(canvasId) {
  this.id = '';
  this.rotation = 0;
  this.x = 0;
  this.y = 0;
  this.alpha = 1;
  this.enabled = true;
  this.width = 0;
  this.height = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  this.children = [];
  this.visible = true;
  this.shadow = false;
  this.shadowBlur = 0;
  this.shadowColor = 0;
  this.shadowOffsetX = 0;
  this.shadowOffsetY = 0;

  this._oldX = 0;
  this._oldY = 0;
  this._oldRotation = 0;
  this._oldScaleX = 1;
  this._oldScaleY = 1;
  this._oldVisible = true;

  this._mouseX = 0;
  this._mouseY = 0;
  this._canvasX = 0;
  this._canvasY = 0;
  this._visible = true;
  this._rotation = 0;
  this._scaleX = 1;
  this._scaleY = 1;
  this._canvas = null;
  this._mouseHit = false;
  this._backBufferCanvas = null;
  this._backBufferContext;
  this._context = null;
  this._parentDisplayContainer = null;
  this._superDisplayContainer = null;
  this._childrenChanged = false;
  this._allChildren = null;

  if(canvasId) {
    this._canvas = document.getElementById(canvasId);
    this._context = this._canvas.getContext('2d');

    this._backBufferCanvas = document.createElement('canvas');
    this._backBufferCanvas.width = this._canvas.width;
    this._backBufferCanvas.height = this._canvas.height;
    this._backBufferContext = this._backBufferCanvas.getContext('2d');
  }
};

canvaslib.DisplayContainer.prototype = {
  /**
   * Returns the parent displaycontainer
   */
  parentDisplayContainer: function() {
    return this._parentDisplayContainer;
  },

  /**
   * Find super parent object
   */
  superDisplayContainer: function() {
    // cache search of super display container
    if(this._parentDisplayContainer) {
      if(!this._superDisplayContainer)
        this._superDisplayContainer = this._findSuperDisplayContainer(this);

      return this._superDisplayContainer;

    } else {
      return this;

    }
  },

  /**
   * Tests if this object is the super
   */
  isSuperDisplayContainer: function() {
    return (this.superDisplayContainer() == this);
  },

  /**
   * Adds a given child to the displaylist of the object container
   */
  addChild: function(child) {
    this.superDisplayContainer()._childrenChanged = true;

    // is the object already a child of another display container? then remove it
    if(child._parentDisplayContainer)
      child._parentDisplayContainer.removeChild(child);

    // ok set new parent
    child._parentDisplayContainer = this;
    child._context = this.superDisplayContainer()._context;
    child._canvas = this.superDisplayContainer()._canvas;
    child._backBufferCanvas = this.superDisplayContainer()._backBufferCanvas;
    child._backBufferContext = this.superDisplayContainer()._backBufferContext;

    // add to displaylist
    this.children.push(child);

    return this;
  },

  /**
   * Sets Z-index of given child
   */
  setChildIndex: function(child, index) {

    if(this.children.indexOf(child) == -1) {
      throw "Child object not found in displaylist";

    } else {
      // @TODO implement me please!
      this.superDisplayContainer()._childrenChanged = true;
    }
  },

  /**
   * Removes the given child form the displaylist
   */
  removeChild: function(child) {
    var i;

    i = this.children.indexOf(child); // [0, 1, 2, 3, 4, 5, 6, 7]

    if(i == -1) {
      throw "Child object not found in displaylist";

    } else {
      this.superDisplayContainer()._childrenChanged = true;

      child._superDisplayContainer = null;
      child._parentDisplayContainer = null;
      child._canvas = null;
      child._context = null;
      child._backBufferCanvas = null;
      child._backBufferContext = null;

      this.children.splice(i, 1);

      return this;
    }
  },

  /**
   * Draws everyone
   */
  draw: function(clear) {
    if(this.isSuperDisplayContainer()) {
      this._drawAllChildren(clear);

    } else {
      this.superDisplayContainer().draw(clear);

    }
  },

  /**
   * Tests if the object's position has been changed
   */
  positionChanged: function() {
    return (  this.x != this._oldX || this.y != this._oldY ||
              this.rotation != this._oldRotation ||
              this.scaleX != this._oldScaleX || this.scaleY != this._oldScaleY ||
              this.visible != this._oldVisible );
  },

  /**
   * Translates relative X, Y pos to canvas/world X, Y pos
   */
  _getInheritedTranslatedVars: function() {
    var translatedX = 0;
    var translatedY = 0;
    var translatedRotation = 0;
    var translatedScaleX = 0;
    var translatedScaleY = 0;
    var theParent = this;
    var visible = true;

    while(theParent != null) {
      translatedX += theParent.x;
      translatedY += theParent.y;
      translatedRotation += theParent.rotation;
      translatedScaleX += theParent.scaleX;
      translatedScaleY += theParent.scaleY;
      if(!theParent.visible) visible = false;

      theParent = theParent._parentDisplayContainer;
    }

    return [translatedX, translatedY, translatedRotation, translatedScaleX, translatedScaleY, visible];
  },

  /**
   * Translated relative X, Y pos to canvas/world X, Y pos
   */
  _setCanvasPosition: function() {
    var newVars;

    if(this.positionChanged()) {
      newVars = this._getInheritedTranslatedVars();

      this._oldX = this.x;
      this._oldY = this.y;
      this._oldRotation = this.rotation;
      this._oldScaleX = this.scaleX;
      this._oldScaleY = this.scaleY;

      this._canvasX = newVars[0];
      this._canvasY = newVars[1];
      this._rotation = newVars[2];
      this._scaleX = newVars[3];
      this._scaleY = newVars[4];
      this._visible = newVars[5];
    }
  },

  /**
   * Draws all objects
   */
  _drawAllChildren: function(clear) {
    var i = 0;
    var children;
    var newCanvasPos;

    if(this.isSuperDisplayContainer()) {
      if(clear) this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

      // retrieve ALL children
      if(this._childrenChanged) {
        this._allChildren = this._getAllChildren();
        this._childrenChanged = false;
      }

      // loop all children
      for(i = 0; i < this._allChildren.length; i++) {
        // translate X, Y pos
        this._allChildren[i]._setCanvasPosition();
        if(this._allChildren[i]._visible) {
          // draw on surface
          // setup context
          this._context.save();
          this._context.beginPath();
          this._setupContext(this._context, this._allChildren[i]);

          // go draw!
          this._allChildren[i]._draw(this._context);
          this._detectMouseInPath(this._context, this._allChildren[i]);
          this._context.closePath();

          // restore it
          this._context.restore();

          // draw on backbuffer for collision detection
          /**this._backBufferContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
          this._backBufferContext.save();
          this._setupContext(this._backBufferContext, this._allChildren[i]);
          this._backBufferContext.beginPath();
          this._allChildren[i]._draw(this._backBufferContext);

          // detect mouse
          this._detectMouseInPath(this._backBufferContext, this._allChildren[i]);
          this._backBufferContext.restore();**/
        }
      }

    } else {
      this.superDisplayContainer()._drawAllChildren();

    }
  },

  /**
   * Retrieves all children in the tree
   */
  _getAllChildren: function() {
    var i = 0;
    var children = [];

    if(this.isSuperDisplayContainer()) {
      this._getChildren(this, children);
      return children;

    } else {
      return this.superDisplayContainer()._getAllChildren();

    }
  },

  /**
   * Retrieves ALL children from given parent and it's sub-children
   */
  _getChildren: function(fromParent, collectedChildren) {
    var i = 0;

    for(i = 0; i < fromParent.children.length; i++) {
      collectedChildren.push(fromParent.children[i]);

      if(fromParent.children[i].children && fromParent.children[i].children.length > 0)
        this._getChildren(fromParent.children[i], collectedChildren);
    }
  },

  _draw: function(context) {
    // you could implement this...
  },

  // privates
  _findSuperDisplayContainer: function(parent) {
    if(parent._parentDisplayContainer) {
      return this._findSuperDisplayContainer(parent._parentDisplayContainer);

    } else {
      return parent;

    }
  },

  /**
   * Sets the mouse hit detection flag
   */
  _detectMouseInPath: function(context, displayObj) {
    if(!displayObj._mouseHit && context.isPointInPath(this.superDisplayContainer()._mouseX, this.superDisplayContainer()._mouseY)) {
      displayObj._mouseHit = true;
      alert('score!');
    } else {
      displayObj._mouseHit = false;
    }
  },

  /**
   * Set's up global mouse event listener
   */
  _setupMouse: function() {
      var self = this;

      this._canvas.mouseover = true;
      this._canvas.addEventListener('mousemove', function(event) {
        self.superDisplayContainer()._mouseX = event.clientX - self._canvas.offsetLeft;
        self.superDisplayContainer()._mouseY = event.clientY - self._canvas.offsetTop;
      }, false);
  },

  /**
   * Sets up context for drawing
   */
  _setupContext: function(context, displayObj) {
    // sets mouse over events if not present yet
    if(!this._canvas.mouseover)
      this._setupMouse();

    // sets the alpha of the image
    context.globalAlpha = displayObj.alpha;
    context.translate(displayObj._canvasX, displayObj._canvasY);
    context.rotate(canvaslib.Math.angleToRadians(displayObj._rotation));
    context.scale(displayObj._scaleX, displayObj._scaleY);

    // add shadow?
    if(displayObj.shadow) {
      context.shadowBlur = displayObj.shadowBlur;
      context.shadowColor = displayObj.shadowColor;
      context.shadowOffsetX = displayObj.shadowOffsetX;
      context.shadowOffsetY = displayObj.shadowOffsetY;
    }
  }
};
