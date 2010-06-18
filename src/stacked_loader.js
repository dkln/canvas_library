/**
 * Asset loader 
 *
 * @author D Lawson <webmaster@altovista.nl>
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
      
    this._loadStack.push({ type: type, url: url });
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
  
  _handleAssetLoadComplete: function() {
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
      this.toLoad = this._loadStack[0];
      
      switch(toLoad.type) {
        case 'image':
          this._stack[this.toLoad.id] = new Image();  
          break;
          
        case 'audio':
          this._stack[this.toLoad.id] = new Audio();
          break;
      }

      this._stack[this.toLoad.id].onLoad = this._handleAssetLoadComplete;
      this._stack[this.toLoad.id].src = this._stack[this.toLoad.id].url;      
    }
  }
};