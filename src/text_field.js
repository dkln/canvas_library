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
  _draw: function() {
    this._context.save();
    this._setupContext();

    this._context.font = this.font;

    if(this.strokeStyle != '')
      this._context.strokeStyle = this.strokeStyle;

    if(this.fillStyle != '')
      this._context.fillStyle = this.fillStyle;

    this._context.fillText(this.text, 0, 0);//, this.maxWidth);

    this._context.restore();
  }
};

canvaslib.Utils.addOwnProperties(canvaslib.DisplayContainer.prototype, canvaslib.TextField.prototype);
