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
  _draw: function(context) {
    if(this.imageData) {
      // draw image
      context.drawImage(this.imageData, 0, 0);
    }
  }
};

// inherit from display container
canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.Bitmap.prototype);
