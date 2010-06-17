/**
 * @author D Lawson <webmaster@altovista.nl>
 */
canvaslib.StackedLoader = new function() {
  this._onCompleteHandlers = [];
  this._loadStack = [];
  this._stack = {};
  this._loading = false;
  
  /**
   * Starts loading an item (audio or image)
   */
  this.load = function(id, type, url) {
    if(this._stack[id])
      this.remove(id);
      
    this._loadStack.push({ type: type, url: url });
  };
    
  /**
   * Starts loading the stack
   */
  this.start = function(onComplete) {
    if(this._onCompleteHandlers.indexOf(onComplete) == -1)
      this._onCompleteHandlers.push(onComplete);
      
    if(!this._loading) {
      this._loading = true;
      this._load();
    }
  };
  
  /**
   * Retrieves something from the stack
   */
  this.get = function(id) {
    return this._stack[id];
  };
  
  /**
   * Loads the next item from the stack
   */
  this._load = function() {
    
  };
};