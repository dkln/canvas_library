/**
 * Main display container
 *
 * @author D Lawson <webmaster@altovista.nl>
 */
canvaslib.DisplayContainer = new Class({
  // publics
  x: 0,
  y: 0,
  visible: true,
  alpha: 1,
  childs: [],  
  _parent: null,
  _canvas: null,

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
    this.super._canvas;
  },

  /**
   * Returns the parent displaycontainer
   */
  parent: function() {
    return this._parent;
  },

  /**
   * Find super parent object
   */
  super: function() {
    return this._findParent(this);
  },

  /**
   * Tests if this object is the super
   */
  isSuper: function() {
    return (this.super == this);
  },

  /**
   * Adds a given child to the displaylist of the object container
   */
  addChild: function(child) {    
    child._parent = this;
    this.childs.push(child);
  },

  /**
   * Removes the given child form the displaylist
   */
  removeChild: function(child) {
    var i = this.childs.indexOf(child);
  
    if(i != -1) {
    
    }
  },

  /**
   * Draws everyone
   */
  draw: function() {
    if(this.isSuper()) {
      this._draw();
    
    } else {
      this.super.draw();
    
    }
  },

  /**
   * Draws all objects
   */ 
  _draw: function() {
  
  },

  // privates
  _findParent: function(parent) {
    if(parent.parent) {
      return this._findParent(parent);
    
    } else {
      return parent;
    
    }
  }
});
