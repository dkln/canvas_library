/**
 * Renderer
 *
 * @author D Lawson <webmaster@altovista.nl>
 */
canvaslib.Renderer = function(mainContainer, fps) {
  this._timer = null;
  this._running = false;
  this._frameHandlers = null;
  this._mainContainer = mainContainer;
  this._drawing = false;

  /**
   * Sets the frames per second
   */
  this.setFps = function(fps) {
    this._interval = 1000 / fps;
  };

  /**
   * Runs the render engine
   */
  this.run = function(fps) {
    if(fps) this.setFps(fps);
    if(this._running) this.stop();
    this._running = true;
    this._timer = setInterval(this.handleInterval, this._interval, this);
  };

  /**
   * Add a frame handler that is called every frame draw
   */
  this.addFrameHandler = function(handler) {
    // create array (if we don't already have one)
    if(!this._frameHandlers) this._frameHandlers = [];

    // check if handler already exists
    if(this._frameHandlers.indexOf(handler) == -1)
      this._frameHandlers.push(handler);
  };

  /**
   * Is called every frame. Calls the onEnterFrame handler is there is one defined
   */
  this.handleInterval = function(self) {
    self._drawing = true;

    var i = 0;

    // call frame handlers (if we have one)
    if(self._frameHandlers)
      for(i = 0; i < self._frameHandlers.length; i++) self._frameHandlers[i]();

    // update tweening objects
    canvaslib.Tween.update();

    // draw everything to canvas
    self._mainContainer.draw(true);
    self._drawing = false;
  };

  /**
   * Stops the renderer
   */
  this.stop = function() {
    clearInterval(this._timer);
    this._running = false;
    this._timer = null;
  };
};