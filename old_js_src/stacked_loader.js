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
 * StackedLoader Class
 *
 * @author D. Lawson <webmaster@altovista.nl>
 */
canvaslib.StackedLoader = {
  _onCompleteHandlers: [],
  _loadStack: [],
  _toLoad: null,
  _stack: {},
  _loading: false,

  /**
   * Starts loading an item (audio or image)
   */
  load: function(id, type, url) {
    if(this._stack[id])
      this.remove(id);

    this._loadStack.push({ type: type, url: url, id: id });
  },

  /**
   * Starts loading the stack
   */
  start: function(onComplete) {
    if(this._onCompleteHandlers.indexOf(onComplete) == -1)
      this._onCompleteHandlers.push(onComplete);

    if(!this._loading) {
      this._loading = true;
      this._load();
    }
  },

  /**
   * Retrieves something from the stack
   */
  get: function(id) {
    return this._stack[id];
  },

  _handleAssetLoadComplete: function(data, status, xmlHttpRequest) {
    var image;

    // check if this is a image so convert it in a bitmap obj
    if(this._toLoad.type == 'image') {
      image = this._stack[this._toLoad.id];
      image.onload = null;

      this._stack[this._toLoad.id] = new canvaslib.Bitmap(image);

      image = null;

    } else if(this._toLoad.type == 'sprite') {
      image = new canvaslib.PixelSprite(data);
      image.drawPixelMap(data);

      this._stack[this._toLoad.id] = image;

      image = null;
    }

    // ok we're done with this item matey! remove it from stack
    this._loadStack.splice(0, 1);

    // ok next one please!
    this._load();
  },

  /**
   * Loads the next item from the stack
   */
  _load: function() {
    var i;

    // check if we have something on stack
    if(this._loadStack.length == 0) {
      // nothing to do!
      for(i = 0; i < this._onCompleteHandlers.length; i++) {
        this._onCompleteHandlers[i]();
      }

      // remove references to handlers
      this._onCompleteHandlers = [];

      // we're done!
      this._loading = false;

    } else {
      // yes catch first item of stack
      this._toLoad = this._loadStack[0];

      switch(this._toLoad.type) {
        case 'sprite':
          this._stack[this._toLoad.id] = {}
          $.ajax( { url: this._toLoad.url,
                    dataType: 'text',
                    success: canvaslib.Utils.bind(this, this._handleAssetLoadComplete) } );
          break;

        case 'image':
          this._stack[this._toLoad.id] = new Image();
          this._stack[this._toLoad.id].onload = canvaslib.Utils.bind(this, this._handleAssetLoadComplete);
          this._stack[this._toLoad.id].src = this._toLoad.url;
          break;

        case 'audio':
          this._stack[this._toLoad.id] = new Audio();
          this._stack[this._toLoad.id].src = this._toLoad.url;
          this._handleAssetLoadComplete();
          break;
      }
    }
  }
};