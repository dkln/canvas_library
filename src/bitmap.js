/**
 * Bitmap
 *
 * @author D Lawson <webmaster@altovista.nl>
 */
canvaslib.Bitmap = function(imageObj) {
  canvaslib.DisplayContainer.call(this);

  this.imageData = imageObj ? imageObj : null;
};

canvaslib.Bitmap.prototype = {
  /**
   * Draws the image to the canvas
   */
  _draw: function() {
    if(this.imageData) {
      this._context.save();

      // set pos and rotate
      this._context.translate(this._canvasX, this._canvasY);
      this._context.rotate(canvaslib.Math.angleToRadians(this._rotation));
      this._context.scale(this._scaleX, this._scaleY);

      // draw image
      this._context.drawImage(this.imageData, 0, 0);

      // restore context
      this._context.restore();
    }
  }
};

// inherit from display container
canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.Bitmap.prototype);
