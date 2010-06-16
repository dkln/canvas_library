canvaslib.Shape = function() {
  this.initialize();
};

canvaslib.Shape.prototype = {
  _drawingCommands: [],
  _cursorX: 0,
  _cursorY: 0,
  
  initialize: function() {
    // something
  },
  
  clear: function() {
    // removes all drawing instructions
    this._drawingCommands = [];
  },
  
  moveTo: function(x, y) {
    _cursorX = x;
    _cursorY = y;
  },

  lineTo: function(x, y) {
    
  },
  
  drawRectangle: function(x, y, width, height) {
    
  },
  
  drawCircle: function(x, y, radius) {
    
  },
  
  setFill: function(color, alpha) {
    
  },
  
  endFill: function() {
    
  },
  
  _draw: function() {
    var i = 0;
    
    for(i = 0; i < this._drawingCommands.length; i++) {
      // draw the stuff on the canvas
    }
  }
};