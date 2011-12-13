(function() {
  var StackedLoader;

  StackedLoader = (function() {

    function StackedLoader() {}

    StackedLoader.stack = {};

    StackedLoader.loadStack = [];

    StackedLoader.toLoad = null;

    StackedLoader.onCompleteHandlers = [];

    StackedLoader.loading = false;

    StackedLoader.add = function(id, type, url) {
      if (this.stack[id]) this.remove(id);
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
      var _this = this;
      this.stack[this.toLoad.id] = new XMLHttpRequest();
      this.stack[this.toLoad.id].onreadystatechange = function() {
        if (_this.stack[_this.toLoad.id].readyState === 4 && _this.stack[_this.toLoad.id].status === 200) {
          return _this['handle' + Utils.firstUpcase(_this.toLoad.type) + 'LoadComplete']();
        }
      };
      this.stack[this.toLoad.id].open('GET', this.toLoad.url, true);
      return this.stack[this.toLoad.id].send(null);
    };

    StackedLoader.loadBitmap = function() {
      var _this = this;
      this.stack[this.toLoad.id] = new Image();
      this.stack[this.toLoad.id].onload = function() {
        return _this.handleBitmapLoadComplete();
      };
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

  this.CanvasLibrary || (this.CanvasLibrary = {});

  this.CanvasLibrary.StackedLoader = StackedLoader;

}).call(this);
