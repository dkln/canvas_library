/**
 * Main display container
 *
 * @author D Lawson <webmaster@altovista.nl>
 */
 
canvaslib.DisplayContainer = function(canvasId) {
  this.initialize(canvasId);
};
 
canvaslib.DisplayContainer.prototype = { 
  // publics
  id: '',
  x: 0,
  y: 0,
  visible: true,
  alpha: 1,
  enabled: true,
  width: 0,
  height: 0,
  scaleX: 1,
  scaleY: 1,
  _canvasX: 0,
  _canvasY: 0,
  _oldX: 0,
  _oldY: 0,  
  childs: [],  
  _canvas: null,
  _parentDisplayContainer: null,
  _superDisplayContainer: null,

  /**
   * Initialization
   */
  initialize: function(canvasId) {
    if(canvasId)
      this._canvas = document.getElementById(canvasId);
  },
  
  context: function() {
    return this.canvas().getContext('2d');
  },

  /**
   * Returns the canvas
   */
  canvas: function() {
    this.superDisplayContainer()._canvas;
  },

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
    if(!this._superDisplayContainer)
      this._superDisplayContainer = this._findSuperDisplayContainer(this);

    return this._superDisplayContainer;
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
    this.childs.push(child);
  },
  
  /**
   * Sets Z-index of given child
   */
  setChildIndex: function(child, index) {
    if(this.childs.indexOf(child) == -1) {
      throw "Child object not found in displaylist";
      
    } else {
      // @TODO implement me please!
    }
  },

  /**
   * Removes the given child form the displaylist
   */
  removeChild: function(child) {
    if(this.childs.indexOf(child) == -1) {
      throw "Child object not found in displaylist";
      
    } else {
      child._superDisplayContainer = null;
      child._parentDisplayContainer = null;
      child._canvas = null;
      this.childs.erase(child);
      
    }
  },

  /**
   * Draws everyone
   */
  draw: function() {
    if(this.isSuperDisplayContainer()) {
      this._drawAllChildren();
    
    } else {
      this.superDisplayContainer().draw();
    
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
    var translatedX = x;
    var translatedY = y;
    var theParent = parentDisplayContainer;
    
    while(theParent != null) {
      translatedX += theParent.x;
      translatedY += theParent.y;
      theParent = theParent.parentDisplayContainer;
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
      this.canvasX = newPos[0];
      this.canvasY = newPos[1];
    }
  },
    
  /**
   * Draws all objects
   */ 
  _drawAllChildren: function() {
    var i = 0;
    var children;
    var newCanvasPos;

    if(this.isSuperDisplayContainer()) {    
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
   * Retrieves ALL children from given parent and it's sub-childs
   */
  _getChildren: function(fromParent, collectedChildren) {
    var i = 0;
    
    for(i = 0; i < fromParent.childs.length; i++) {
      collectedChildren.push(fromParent.childs[i]);

      if(fromParent.childs[i].childs && fromParent.childs[i].childs.length > 0)
        this._getChildren(fromParent.childs[i], collectedChildren);
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
