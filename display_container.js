/**
 * Main display container
 *
 * @author D Lawson <webmaster@altovista.nl>
 */
canvaslib.DisplayContainer = new Class({  
  childs: [],  
  _parent: null,
  _canvas: null,
  _parentDisplayContainer: null,

  extends: canvaslib.DisplayObject,
  
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

  canvas: function() {
    this.superDisplayContainer._canvas;
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
    return this._findParentDisplayContainer(this);
  },

  /**
   * Tests if this object is the super
   */
  isSuperDisplayContainer: function() {
    return (this.superDisplayContainer == this);
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
      this.childs.erase(child);
      
    }
  },

  /**
   * Draws everyone
   */
  draw: function() {
    if(this.isSuper()) {
      this._drawChildren();
    
    } else {
      this.superDisplayContainer.draw();
    
    }
  },
  
  _getX: function(x) {
    return this.parentDisplayContainer().x + x;
  },
  
  _getY: function(y) {
    return this.parentDisplayContainer().y + y;
  },

  /**
   * Draws all objects
   */ 
  _drawChildren: function() {
    var i = 0;
    
    // respect the z-order
    for(i = childs.length - 1; i >= 0; i--) {
      childs[i]._draw();
      childs[i]._drawChildren();
    }
  },
  
  _draw: function() {
    // you could implement this...
  },

  // privates
  _findParentDisplayContainer: function(parentDisplayContainer) {
    if(parentDisplayContainer.parentDisplayContainer) {
      return this._findParentDisplayContainer(parentDisplayContainer);
    
    } else {
      return parentDisplayContainer;
    
    }
  }
});
