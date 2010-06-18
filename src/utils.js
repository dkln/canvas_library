canvaslib.Utils = {
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