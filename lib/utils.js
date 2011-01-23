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
  return Utils;
})();