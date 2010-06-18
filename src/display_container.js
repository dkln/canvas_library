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
   
   this._canvasX = 0;
   this._canvasY = 0;
   this._oldX = 0;
   this._oldY = 0;
   this._canvas = null;
   this._backBufferCanvas = null;
   this._backBufferContext;
   this._context = null;
   this._parentDisplayContainer = null;
   this._superDisplayContainer = null;

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
    return (this.x != this._oldX || this.y != this._oldY);
  },

  /**
   * Translates relative X, Y pos to canvas/world X, Y pos
   */
  _getCanvasPosition: function(x, y) {
    var translatedX = 0;
    var translatedY = 0;
    var theParent = this;

    while(theParent != null) {
      translatedX += theParent.x;
      translatedY += theParent.y;
      
      theParent = theParent._parentDisplayContainer;
    }
    
    return [translatedX, translatedY];
  },

  /**
   * Translated relative X, Y pos to canvas/world X, Y pos
   */
  _setCanvasPosition: function() {
    var newPos;

    if(this.positionChanged()) {
      newPos = this._getCanvasPosition(this.x, this.y);
      this._oldX = this.x;
      this._oldY = this.y;
      this._canvasX = newPos[0];
      this._canvasY = newPos[1];
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
      children = this._getAllChildren();
      
      // loop all children
      for(i = 0; i < children.length; i++) {
        // translate X, Y pos
        children[i]._setCanvasPosition();
        children[i]._draw();
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

  _draw: function() {
    // you could implement this...
  },

  // privates
  _findSuperDisplayContainer: function(parent) {
    if(parent._parentDisplayContainer) {
      return this._findSuperDisplayContainer(parent._parentDisplayContainer);

    } else {
      return parent;

    }
  }
};