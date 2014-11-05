var bn = require('bn.js');
var brorand = require('brorand');

exports.test = function test(n, k) {
  var len = n.bitLength();
  var red = bn.mont(n);
  var rone = new bn(1).toRed(red);

  // Fermat test
  if (new bn(2).toRed(red).redPow(n.subn(1)).cmp(rone) !== 0)
    return false;

  if (!k)
    k = Math.max(1, (len / 48) | 0);

  // Find d and s, (n - 1) = (2 ^ s) * d;
  var n1 = n.subn(1);
  var n2 = n1.subn(1);
  for (var s = 0; !n1.testn(s); s++) {}
  var d = n.shrn(s);

  var rn1 = n1.toRed(red);

  var prime = true;
  for (; k > 0; k--) {
    do
      var a = new bn(brorand(Math.ceil(len / 8)));
    while (a.cmpn(2) < 0 || a.cmp(n2) > 0);

    var x = a.toRed(red).redPow(d);
    if (x.cmp(rone) === 0 || x.cmp(rn1) === 0)
      continue;

    for (var i = 1; i < s; i++) {
      x = x.redSqr();

      if (x.cmp(rone) === 0)
        return false;
      if (x.cmp(rn1) === 0)
        break;
    }

    if (i === s)
      return false;
  }

  return prime;
};
