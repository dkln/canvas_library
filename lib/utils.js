var Utils;
Utils = (function() {
  function Utils() {}
  Utils.hex2rgba = function(hex) {
    var num;
    num = parseInt(hex.slice(1), 16);
    return [num >> 16 & 255, num >> 8 & 255, num & 255, num >> 24 & 255];
  };
  Utils.angleToRadians = function(angle) {
    return angle * Math.PI / 180;
  };
  Utils.firstUpcase = function(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  };
  Utils.offsetPosition = function(obj) {
    var left, top;
    top = 0;
    left = 0;
    while (obj) {
      left += obj.offsetLeft;
      top += obj.offsetTop;
      obj = obj.offsetParent;
    }
    return [left, top];
  };
  return Utils;
})();