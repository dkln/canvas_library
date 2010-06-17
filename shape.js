/**
 * Shape
 *
 * @author D Lawson <webmaster@altovista.nl>
 */
canvaslib.Shape = function() {
  this.constructor = canvaslib.Shape;
  canvaslib.DisplayContainer.call(this);
  
  this._cursorX = 0;
  this._cursorY = 0;
  this._fillColor = 0;
  this._fill = false;
  this._alpha = 1;
  this._drawingCommands = [];
  
  /**
   * Clears all drawing commands
   */
  this.clear = function() {
    // removes all drawing instructions
    this._drawingCommands = [];
  };
  
  /**
   *
   */
  this.addColorStops = function(gradient, colorStops) {
    var i = 0;
    
    for(i = 0; i < colorStops.length; i++) {
      gradient.addColorStop(colorStops[i][0], colorStops[i][1]);
    }
    
    return gradient;
  };
  
  /**
   * Creates a radial gradient object
   */
  this._createRadialGradient = function(x1, y1, x2, y2, r1, colorStops) {
    var gradient = this._context.createRadialGradient(x1, y1, x2, y2, r1);
    this.addColorStop(gradient, colorStops);
        
    return gradient;
  };
  
  this._createLinearGradient = function(x1, y1, x2, y2, colorStops) {
    var gradient = this._context.createLinearGradient(x1, y1, x2, y2);
    this.addColorStop(gradient, colorStops);
    
    return gradient;
  };
  
  /**
   * Sets the radial gradient fill
   */
  this.setRadialGradient = function(x1, y1, x2, y2, r1, colorStops) {
    this.fillStyle(this._createRadialGradient(x1, y1, x2, y2, r1, colorStops));
  };
  
  /**
   * Sets the linear gradient fill
   */
  this.setLinearGradient = function(x1, y1, x2, y2, colorStops) {
    this.fillStyle(this._createLinearGradient(x1, y1, x2, y2, colorStops));
  };
  
  /**
   * Moves the cursor to X Y
   */
  this.moveTo = function(x, y) {
    this._cursorX = x;
    this._cursorY = y;
    this._drawingCommands.push(['moveTo', x, y]);
  };

  /**
   * Draws a line from cursor to X Y pos
   */
  this.lineTo = function(x, y) {
    this._drawingCommands.push(['lineTo', x, y]);
  };
  
  // draws a rectangle
  this.fillRect = function(x, y, width, height, color) {
    if(color) this.fillStyle(color);
    this._drawingCommands.push(['fillRect', x, y, width, height]);
  };

  // strokes the path
  this.strokeRect = function(x, y, width, height, color) {
    //if(color)
    this._drawingCommands.push(['strokeRect', x, y, width, height]);
  };
  
  // clears the area with a transparent area
  this.clearRect = function(x, y, width, height) {
    this._drawingCommands.push(['clearRect', x, y, width, height]);
  };
  
  // draws a circle
  this.fillStyle = function(color) {
    this._drawingCommands.push(['fillStyle=', color]);
  };
  
  // draws path
  this.beginPath = function() {
    this._drawCommands.push(['beginPath']);
  };
  
  // end path
  this.closePath = function() {
    this._drawCommands.push(['closePath']);
  };
  
  this.globalAlpha = function(alpha) {
    this._drawCommands.push(['globalAlpha=', alpha]);
  };
  
  // fills everything
  this.fill = function() {
    this._drawCommands.push( { cmd: 'fill' } );
  };
  
  // draws every command to the context of the canvas
  this._draw = function() {
    var i = 0;
    var j = 0;
    var params = [];
    var param;
    
    this._context.save();
    
    // set start X and Y pos to the real-world-canvas-XY
    this._context.translate(this._canvasX, this._canvasY);
    this._context.rotate(canvaslib.Math.angleToRadians(this.rotation));
    
    for(i = 0; i < this._drawingCommands.length; i++) {
      // draw the stuff on the canvas      
      // does the drawing command have any params?
      // setter?
      if(this._drawingCommands[i][0].substr(-1, 1) == '=' && this._drawingCommands[i].length == 2) {
        this._context[this._drawingCommands[i][0].substr(0, this._drawingCommands[i][0].length - 1)] = this._drawingCommands[i][1];
        //console.log(this._drawingCommands[i][0] + this._drawingCommands[i][1]);
        
      } else if(this._drawingCommands[i].length > 1) {
        // yes translate them
        this._context[this._drawingCommands[i][0]].apply(this._context, this._drawingCommands[i].slice(1));
        //console.log(this._drawingCommands[i][0] + "(" + this._drawingCommands[i].slice(1) + ")");
        
      } else {
        // nope!
        this._context[this._drawingCommands[i][0]]();
        //console.log(this._drawingCommands[i][0] + "()");
                
      }
    }
    
    this._context.restore();
  };
};