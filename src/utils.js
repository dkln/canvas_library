canvaslib.Utils = {
  addOwnProperties: function(from, to) {
    for(var property in from) {
      if(!to.hasOwnProperty(property))
        to[property] = from[property];
    }
  }
};