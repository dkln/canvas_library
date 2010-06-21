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
  this.fillStyle = 'black';
  this.font = '20pt Arial';
  this.maxWidth = null;
};

canvaslib.TextField.prototype = {
  _draw: function() {
    context.save();
    context.translate(this._canvasX, this._canvasY);
    context.rotation(canvaslib.Math.angleToRadians(this.rotation));

    if(this.strokeStyle != '')
      context.strokeStyle = this.strokeStyle;

    if(this.fillStyle != '')
      context.fillStyle = this.fillStyle;

    context.fillText(this.text, 0, 0, this.maxWidth);
    context.stroke();

    context.restore();
  }
};

canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.TextField);
