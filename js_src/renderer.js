/**
 * Copyright 2010-2011 Diederick Lawson. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY DIEDERICK LAWSON "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL DIEDERICK LAWSON OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Diederick Lawson.
 *
 * Main Renderer Class
 *
 * @author D. Lawson <webmaster@altovista.nl>
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