/**
 * Asset loader 
 *
 * @author D Lawson <webmaster@altovista.nl>
 */
canvaslib.StackedLoader = {
  _onCompleteHandlers: [];
  _loadStack: [];
  _stack: {};
  _loading: false;
  
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
  
  /**
   * Loads the next item from the stack
   */
  _load: function() {
    
  }
};