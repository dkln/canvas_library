var StackedLoader;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
StackedLoader = (function() {
  function StackedLoader() {}
  StackedLoader.stack = {};
  StackedLoader.loadStack = [];
  StackedLoader.toLoad = null;
  StackedLoader.onCompleteHandlers = [];
  StackedLoader.loading = false;
  StackedLoader.add = function(id, type, url) {
    if (this.stack[id]) {
      this.remove(id);
    }
    return this.loadStack.push({
      type: type,
      url: url,
      id: id
    });
  };
  StackedLoader.load = function(onCompleteHandler) {
    if (onCompleteHandler != null) {
      this.onCompleteHandlers.push(onCompleteHandler);
    }
    if (!this.loading) {
      this.loading = true;
      return this.loadNext();
    }
  };
  StackedLoader.get = function(id) {
    return this.stack[id];
  };
  StackedLoader.getClonedBitmap = function(id) {
    return new Bitmap(this.stack[this.toLoad.id]);
  };
  StackedLoader.loadNext = function() {
    var onCompleteHandler, _i, _len, _ref;
    if (this.loadStack.length === 0) {
      _ref = this.onCompleteHandlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        onCompleteHandler = _ref[_i];
        onCompleteHandler();
      }
      this.onCompleteHandlers = [];
      return this.loading = false;
    } else {
      this.toLoad = this.loadStack[0];
      return this['load' + Utils.firstUpcase(this.toLoad.type)]();
    }
  };
  StackedLoader.loadString = function() {
    this.stack[this.toLoad.id] = new XMLHttpRequest();
    this.stack[this.toLoad.id].onreadystatechange = __bind(function() {
      if (this.stack[this.toLoad.id].readyState === 4 && this.stack[this.toLoad.id].status === 200) {
        return this['handle' + Utils.firstUpcase(this.toLoad.type) + 'LoadComplete']();
      }
    }, this);
    this.stack[this.toLoad.id].open('GET', this.toLoad.url, true);
    return this.stack[this.toLoad.id].send(null);
  };
  StackedLoader.loadBitmap = function() {
    this.stack[this.toLoad.id] = new Image();
    this.stack[this.toLoad.id].onload = __bind(function() {
      return this.handleBitmapLoadComplete();
    }, this);
    return this.stack[this.toLoad.id].src = this.toLoad.url;
  };
  StackedLoader.loadSprite = function() {
    return this.loadString();
  };
  StackedLoader.loadAudio = function() {
    this.stack[this.toLoad.id] = new Audio();
    this.stack[this.toLoad.id].src = this.toLoad.url;
    return this.handleAssetLoadComplete();
  };
  StackedLoader.handleBitmapLoadComplete = function() {
    this.stack[this.toLoad.id].onload = null;
    this.stack[this.toLoad.id] = new Bitmap(this.stack[this.toLoad.id]);
    this.stack[this.toLoad.id].id = this.toLoad.id;
    return this.handleAssetLoadComplete();
  };
  StackedLoader.handleStringLoadComplete = function() {
    this.stack[this.toLoad.id].onreadystatechange = null;
    this.stack[this.toLoad.id] = this.stack[this.toLoad.id].responseText;
    return this.handleAssetLoadComplete;
  };
  StackedLoader.handleSpriteLoadComplete = function() {
    this.stack[this.toLoad.id].onreadystatechange = null;
    this.stack[this.toLoad.id] = new PixelSprite(this.stack[this.toLoad.id].responseText);
    return this.handleAssetLoadComplete;
  };
  StackedLoader.handleAssetLoadComplete = function() {
    this.loadStack.splice(0, 1);
    return this.loadNext();
  };
  return StackedLoader;
})();