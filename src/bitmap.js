/**
 *
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
  _draw: function(context, drawHitarea) {
    if(this.imageData) {
      // draw hit area
      if(drawHitarea) {
        context.rect(0, 0, this.imageData.width, this.imageData.height);
      } else {
        context.drawImage(this.imageData, 0, 0);
      }
    }
  }
};

// inherit from display container
canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.Bitmap.prototype);
