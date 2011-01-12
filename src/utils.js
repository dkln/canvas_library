canvaslib.Utils = {
  hex2rgba: function(hex) {
    var num = parseInt(hex.slice(1), 16);
    return [num >> 16 & 255, num >> 8 & 255, num & 255, num >> 24 & 255];
  },

  addOwnProperties: function(from, to) {
    for(var property in from) {
      if(!to.hasOwnProperty(property))
        to[property] = from[property];
    }
  },

  bind: function(self, funct) {
    var context = self;

    return function() {
      return funct.apply(context, arguments);
    };
  }
};
