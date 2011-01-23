var EaseDefault;
EaseDefault = function(t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
};