/**
 * Textfield
 *
 * @author D Lawson <webmaster@altovista.nl>
 */
canvaslib.TextField = function() {
  canvaslib.DisplayContainer.call(this);
  this.text = '';
  this.textAlign = 'left';
  this.strokeStyle = '';
  this.fillStyle = 'rgba(0,0,0,1)';
  this.font = '20pt Arial';
  this.maxWidth = null;
};

canvaslib.TextField.prototype = {
  _draw: function(context, drawHitarea) {
    context.font = this.font;

    if(this.strokeStyle != '')
      context.strokeStyle = this.strokeStyle;

    if(this.fillStyle != '')
      context.fillStyle = this.fillStyle;

    context.fillText(this.text, 0, 0);//, this.maxWidth);
  }
};

canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.TextField.prototype);
