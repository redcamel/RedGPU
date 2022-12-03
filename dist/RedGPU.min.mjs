/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */

var n = 1e-6,
  a = "undefined" != typeof Float32Array ? Float32Array : Array,
  r = Math.random;
var u = Math.PI / 180;
Math.hypot || (Math.hypot = function () {
  for (var t = 0, n = arguments.length; n--;) t += arguments[n] * arguments[n];
  return Math.sqrt(t);
});
var e = Object.freeze({
  EPSILON: n,
  get ARRAY_TYPE() {
    return a;
  },
  RANDOM: r,
  setMatrixArrayType: function (t) {
    a = t;
  },
  toRadian: function (t) {
    return t * u;
  },
  equals: function (t, a) {
    return Math.abs(t - a) <= n * Math.max(1, Math.abs(t), Math.abs(a));
  }
});
function o(t, n, a) {
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = a[0],
    c = a[1],
    h = a[2],
    s = a[3];
  return t[0] = r * i + e * c, t[1] = u * i + o * c, t[2] = r * h + e * s, t[3] = u * h + o * s, t;
}
function i(t, n, a) {
  return t[0] = n[0] - a[0], t[1] = n[1] - a[1], t[2] = n[2] - a[2], t[3] = n[3] - a[3], t;
}
var c = o,
  h = i,
  s = Object.freeze({
    create: function () {
      var t = new a(4);
      return a != Float32Array && (t[1] = 0, t[2] = 0), t[0] = 1, t[3] = 1, t;
    },
    clone: function (t) {
      var n = new a(4);
      return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n;
    },
    copy: function (t, n) {
      return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t;
    },
    identity: function (t) {
      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t;
    },
    fromValues: function (t, n, r, u) {
      var e = new a(4);
      return e[0] = t, e[1] = n, e[2] = r, e[3] = u, e;
    },
    set: function (t, n, a, r, u) {
      return t[0] = n, t[1] = a, t[2] = r, t[3] = u, t;
    },
    transpose: function (t, n) {
      if (t === n) {
        var a = n[1];
        t[1] = n[2], t[2] = a;
      } else t[0] = n[0], t[1] = n[2], t[2] = n[1], t[3] = n[3];
      return t;
    },
    invert: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = a * e - u * r;
      return o ? (o = 1 / o, t[0] = e * o, t[1] = -r * o, t[2] = -u * o, t[3] = a * o, t) : null;
    },
    adjoint: function (t, n) {
      var a = n[0];
      return t[0] = n[3], t[1] = -n[1], t[2] = -n[2], t[3] = a, t;
    },
    determinant: function (t) {
      return t[0] * t[3] - t[2] * t[1];
    },
    multiply: o,
    rotate: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3],
        i = Math.sin(a),
        c = Math.cos(a);
      return t[0] = r * c + e * i, t[1] = u * c + o * i, t[2] = r * -i + e * c, t[3] = u * -i + o * c, t;
    },
    scale: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3],
        i = a[0],
        c = a[1];
      return t[0] = r * i, t[1] = u * i, t[2] = e * c, t[3] = o * c, t;
    },
    fromRotation: function (t, n) {
      var a = Math.sin(n),
        r = Math.cos(n);
      return t[0] = r, t[1] = a, t[2] = -a, t[3] = r, t;
    },
    fromScaling: function (t, n) {
      return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = n[1], t;
    },
    str: function (t) {
      return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
    },
    frob: function (t) {
      return Math.hypot(t[0], t[1], t[2], t[3]);
    },
    LDU: function (t, n, a, r) {
      return t[2] = r[2] / r[0], a[0] = r[0], a[1] = r[1], a[3] = r[3] - t[2] * a[1], [t, n, a];
    },
    add: function (t, n, a) {
      return t[0] = n[0] + a[0], t[1] = n[1] + a[1], t[2] = n[2] + a[2], t[3] = n[3] + a[3], t;
    },
    subtract: i,
    exactEquals: function (t, n) {
      return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === n[3];
    },
    equals: function (t, a) {
      var r = t[0],
        u = t[1],
        e = t[2],
        o = t[3],
        i = a[0],
        c = a[1],
        h = a[2],
        s = a[3];
      return Math.abs(r - i) <= n * Math.max(1, Math.abs(r), Math.abs(i)) && Math.abs(u - c) <= n * Math.max(1, Math.abs(u), Math.abs(c)) && Math.abs(e - h) <= n * Math.max(1, Math.abs(e), Math.abs(h)) && Math.abs(o - s) <= n * Math.max(1, Math.abs(o), Math.abs(s));
    },
    multiplyScalar: function (t, n, a) {
      return t[0] = n[0] * a, t[1] = n[1] * a, t[2] = n[2] * a, t[3] = n[3] * a, t;
    },
    multiplyScalarAndAdd: function (t, n, a, r) {
      return t[0] = n[0] + a[0] * r, t[1] = n[1] + a[1] * r, t[2] = n[2] + a[2] * r, t[3] = n[3] + a[3] * r, t;
    },
    mul: c,
    sub: h
  });
function M(t, n, a) {
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = n[4],
    c = n[5],
    h = a[0],
    s = a[1],
    M = a[2],
    f = a[3],
    l = a[4],
    v = a[5];
  return t[0] = r * h + e * s, t[1] = u * h + o * s, t[2] = r * M + e * f, t[3] = u * M + o * f, t[4] = r * l + e * v + i, t[5] = u * l + o * v + c, t;
}
function f(t, n, a) {
  return t[0] = n[0] - a[0], t[1] = n[1] - a[1], t[2] = n[2] - a[2], t[3] = n[3] - a[3], t[4] = n[4] - a[4], t[5] = n[5] - a[5], t;
}
var l = M,
  v = f,
  b = Object.freeze({
    create: function () {
      var t = new a(6);
      return a != Float32Array && (t[1] = 0, t[2] = 0, t[4] = 0, t[5] = 0), t[0] = 1, t[3] = 1, t;
    },
    clone: function (t) {
      var n = new a(6);
      return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n;
    },
    copy: function (t, n) {
      return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t;
    },
    identity: function (t) {
      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t;
    },
    fromValues: function (t, n, r, u, e, o) {
      var i = new a(6);
      return i[0] = t, i[1] = n, i[2] = r, i[3] = u, i[4] = e, i[5] = o, i;
    },
    set: function (t, n, a, r, u, e, o) {
      return t[0] = n, t[1] = a, t[2] = r, t[3] = u, t[4] = e, t[5] = o, t;
    },
    invert: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = n[4],
        i = n[5],
        c = a * e - r * u;
      return c ? (c = 1 / c, t[0] = e * c, t[1] = -r * c, t[2] = -u * c, t[3] = a * c, t[4] = (u * i - e * o) * c, t[5] = (r * o - a * i) * c, t) : null;
    },
    determinant: function (t) {
      return t[0] * t[3] - t[1] * t[2];
    },
    multiply: M,
    rotate: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3],
        i = n[4],
        c = n[5],
        h = Math.sin(a),
        s = Math.cos(a);
      return t[0] = r * s + e * h, t[1] = u * s + o * h, t[2] = r * -h + e * s, t[3] = u * -h + o * s, t[4] = i, t[5] = c, t;
    },
    scale: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3],
        i = n[4],
        c = n[5],
        h = a[0],
        s = a[1];
      return t[0] = r * h, t[1] = u * h, t[2] = e * s, t[3] = o * s, t[4] = i, t[5] = c, t;
    },
    translate: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3],
        i = n[4],
        c = n[5],
        h = a[0],
        s = a[1];
      return t[0] = r, t[1] = u, t[2] = e, t[3] = o, t[4] = r * h + e * s + i, t[5] = u * h + o * s + c, t;
    },
    fromRotation: function (t, n) {
      var a = Math.sin(n),
        r = Math.cos(n);
      return t[0] = r, t[1] = a, t[2] = -a, t[3] = r, t[4] = 0, t[5] = 0, t;
    },
    fromScaling: function (t, n) {
      return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = n[1], t[4] = 0, t[5] = 0, t;
    },
    fromTranslation: function (t, n) {
      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = n[0], t[5] = n[1], t;
    },
    str: function (t) {
      return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")";
    },
    frob: function (t) {
      return Math.hypot(t[0], t[1], t[2], t[3], t[4], t[5], 1);
    },
    add: function (t, n, a) {
      return t[0] = n[0] + a[0], t[1] = n[1] + a[1], t[2] = n[2] + a[2], t[3] = n[3] + a[3], t[4] = n[4] + a[4], t[5] = n[5] + a[5], t;
    },
    subtract: f,
    multiplyScalar: function (t, n, a) {
      return t[0] = n[0] * a, t[1] = n[1] * a, t[2] = n[2] * a, t[3] = n[3] * a, t[4] = n[4] * a, t[5] = n[5] * a, t;
    },
    multiplyScalarAndAdd: function (t, n, a, r) {
      return t[0] = n[0] + a[0] * r, t[1] = n[1] + a[1] * r, t[2] = n[2] + a[2] * r, t[3] = n[3] + a[3] * r, t[4] = n[4] + a[4] * r, t[5] = n[5] + a[5] * r, t;
    },
    exactEquals: function (t, n) {
      return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === n[3] && t[4] === n[4] && t[5] === n[5];
    },
    equals: function (t, a) {
      var r = t[0],
        u = t[1],
        e = t[2],
        o = t[3],
        i = t[4],
        c = t[5],
        h = a[0],
        s = a[1],
        M = a[2],
        f = a[3],
        l = a[4],
        v = a[5];
      return Math.abs(r - h) <= n * Math.max(1, Math.abs(r), Math.abs(h)) && Math.abs(u - s) <= n * Math.max(1, Math.abs(u), Math.abs(s)) && Math.abs(e - M) <= n * Math.max(1, Math.abs(e), Math.abs(M)) && Math.abs(o - f) <= n * Math.max(1, Math.abs(o), Math.abs(f)) && Math.abs(i - l) <= n * Math.max(1, Math.abs(i), Math.abs(l)) && Math.abs(c - v) <= n * Math.max(1, Math.abs(c), Math.abs(v));
    },
    mul: l,
    sub: v
  });
function m() {
  var t = new a(9);
  return a != Float32Array && (t[1] = 0, t[2] = 0, t[3] = 0, t[5] = 0, t[6] = 0, t[7] = 0), t[0] = 1, t[4] = 1, t[8] = 1, t;
}
function d(t, n, a) {
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = n[4],
    c = n[5],
    h = n[6],
    s = n[7],
    M = n[8],
    f = a[0],
    l = a[1],
    v = a[2],
    b = a[3],
    m = a[4],
    d = a[5],
    x = a[6],
    p = a[7],
    y = a[8];
  return t[0] = f * r + l * o + v * h, t[1] = f * u + l * i + v * s, t[2] = f * e + l * c + v * M, t[3] = b * r + m * o + d * h, t[4] = b * u + m * i + d * s, t[5] = b * e + m * c + d * M, t[6] = x * r + p * o + y * h, t[7] = x * u + p * i + y * s, t[8] = x * e + p * c + y * M, t;
}
function x(t, n, a) {
  return t[0] = n[0] - a[0], t[1] = n[1] - a[1], t[2] = n[2] - a[2], t[3] = n[3] - a[3], t[4] = n[4] - a[4], t[5] = n[5] - a[5], t[6] = n[6] - a[6], t[7] = n[7] - a[7], t[8] = n[8] - a[8], t;
}
var p = d,
  y = x,
  q = Object.freeze({
    create: m,
    fromMat4: function (t, n) {
      return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[4], t[4] = n[5], t[5] = n[6], t[6] = n[8], t[7] = n[9], t[8] = n[10], t;
    },
    clone: function (t) {
      var n = new a(9);
      return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n;
    },
    copy: function (t, n) {
      return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t;
    },
    fromValues: function (t, n, r, u, e, o, i, c, h) {
      var s = new a(9);
      return s[0] = t, s[1] = n, s[2] = r, s[3] = u, s[4] = e, s[5] = o, s[6] = i, s[7] = c, s[8] = h, s;
    },
    set: function (t, n, a, r, u, e, o, i, c, h) {
      return t[0] = n, t[1] = a, t[2] = r, t[3] = u, t[4] = e, t[5] = o, t[6] = i, t[7] = c, t[8] = h, t;
    },
    identity: function (t) {
      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
    },
    transpose: function (t, n) {
      if (t === n) {
        var a = n[1],
          r = n[2],
          u = n[5];
        t[1] = n[3], t[2] = n[6], t[3] = a, t[5] = n[7], t[6] = r, t[7] = u;
      } else t[0] = n[0], t[1] = n[3], t[2] = n[6], t[3] = n[1], t[4] = n[4], t[5] = n[7], t[6] = n[2], t[7] = n[5], t[8] = n[8];
      return t;
    },
    invert: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = n[4],
        i = n[5],
        c = n[6],
        h = n[7],
        s = n[8],
        M = s * o - i * h,
        f = -s * e + i * c,
        l = h * e - o * c,
        v = a * M + r * f + u * l;
      return v ? (v = 1 / v, t[0] = M * v, t[1] = (-s * r + u * h) * v, t[2] = (i * r - u * o) * v, t[3] = f * v, t[4] = (s * a - u * c) * v, t[5] = (-i * a + u * e) * v, t[6] = l * v, t[7] = (-h * a + r * c) * v, t[8] = (o * a - r * e) * v, t) : null;
    },
    adjoint: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = n[4],
        i = n[5],
        c = n[6],
        h = n[7],
        s = n[8];
      return t[0] = o * s - i * h, t[1] = u * h - r * s, t[2] = r * i - u * o, t[3] = i * c - e * s, t[4] = a * s - u * c, t[5] = u * e - a * i, t[6] = e * h - o * c, t[7] = r * c - a * h, t[8] = a * o - r * e, t;
    },
    determinant: function (t) {
      var n = t[0],
        a = t[1],
        r = t[2],
        u = t[3],
        e = t[4],
        o = t[5],
        i = t[6],
        c = t[7],
        h = t[8];
      return n * (h * e - o * c) + a * (-h * u + o * i) + r * (c * u - e * i);
    },
    multiply: d,
    translate: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3],
        i = n[4],
        c = n[5],
        h = n[6],
        s = n[7],
        M = n[8],
        f = a[0],
        l = a[1];
      return t[0] = r, t[1] = u, t[2] = e, t[3] = o, t[4] = i, t[5] = c, t[6] = f * r + l * o + h, t[7] = f * u + l * i + s, t[8] = f * e + l * c + M, t;
    },
    rotate: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3],
        i = n[4],
        c = n[5],
        h = n[6],
        s = n[7],
        M = n[8],
        f = Math.sin(a),
        l = Math.cos(a);
      return t[0] = l * r + f * o, t[1] = l * u + f * i, t[2] = l * e + f * c, t[3] = l * o - f * r, t[4] = l * i - f * u, t[5] = l * c - f * e, t[6] = h, t[7] = s, t[8] = M, t;
    },
    scale: function (t, n, a) {
      var r = a[0],
        u = a[1];
      return t[0] = r * n[0], t[1] = r * n[1], t[2] = r * n[2], t[3] = u * n[3], t[4] = u * n[4], t[5] = u * n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t;
    },
    fromTranslation: function (t, n) {
      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = n[0], t[7] = n[1], t[8] = 1, t;
    },
    fromRotation: function (t, n) {
      var a = Math.sin(n),
        r = Math.cos(n);
      return t[0] = r, t[1] = a, t[2] = 0, t[3] = -a, t[4] = r, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
    },
    fromScaling: function (t, n) {
      return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = n[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
    },
    fromMat2d: function (t, n) {
      return t[0] = n[0], t[1] = n[1], t[2] = 0, t[3] = n[2], t[4] = n[3], t[5] = 0, t[6] = n[4], t[7] = n[5], t[8] = 1, t;
    },
    fromQuat: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = a + a,
        i = r + r,
        c = u + u,
        h = a * o,
        s = r * o,
        M = r * i,
        f = u * o,
        l = u * i,
        v = u * c,
        b = e * o,
        m = e * i,
        d = e * c;
      return t[0] = 1 - M - v, t[3] = s - d, t[6] = f + m, t[1] = s + d, t[4] = 1 - h - v, t[7] = l - b, t[2] = f - m, t[5] = l + b, t[8] = 1 - h - M, t;
    },
    normalFromMat4: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = n[4],
        i = n[5],
        c = n[6],
        h = n[7],
        s = n[8],
        M = n[9],
        f = n[10],
        l = n[11],
        v = n[12],
        b = n[13],
        m = n[14],
        d = n[15],
        x = a * i - r * o,
        p = a * c - u * o,
        y = a * h - e * o,
        q = r * c - u * i,
        g = r * h - e * i,
        A = u * h - e * c,
        w = s * b - M * v,
        R = s * m - f * v,
        z = s * d - l * v,
        P = M * m - f * b,
        j = M * d - l * b,
        I = f * d - l * m,
        S = x * I - p * j + y * P + q * z - g * R + A * w;
      return S ? (S = 1 / S, t[0] = (i * I - c * j + h * P) * S, t[1] = (c * z - o * I - h * R) * S, t[2] = (o * j - i * z + h * w) * S, t[3] = (u * j - r * I - e * P) * S, t[4] = (a * I - u * z + e * R) * S, t[5] = (r * z - a * j - e * w) * S, t[6] = (b * A - m * g + d * q) * S, t[7] = (m * y - v * A - d * p) * S, t[8] = (v * g - b * y + d * x) * S, t) : null;
    },
    projection: function (t, n, a) {
      return t[0] = 2 / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = -2 / a, t[5] = 0, t[6] = -1, t[7] = 1, t[8] = 1, t;
    },
    str: function (t) {
      return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")";
    },
    frob: function (t) {
      return Math.hypot(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
    },
    add: function (t, n, a) {
      return t[0] = n[0] + a[0], t[1] = n[1] + a[1], t[2] = n[2] + a[2], t[3] = n[3] + a[3], t[4] = n[4] + a[4], t[5] = n[5] + a[5], t[6] = n[6] + a[6], t[7] = n[7] + a[7], t[8] = n[8] + a[8], t;
    },
    subtract: x,
    multiplyScalar: function (t, n, a) {
      return t[0] = n[0] * a, t[1] = n[1] * a, t[2] = n[2] * a, t[3] = n[3] * a, t[4] = n[4] * a, t[5] = n[5] * a, t[6] = n[6] * a, t[7] = n[7] * a, t[8] = n[8] * a, t;
    },
    multiplyScalarAndAdd: function (t, n, a, r) {
      return t[0] = n[0] + a[0] * r, t[1] = n[1] + a[1] * r, t[2] = n[2] + a[2] * r, t[3] = n[3] + a[3] * r, t[4] = n[4] + a[4] * r, t[5] = n[5] + a[5] * r, t[6] = n[6] + a[6] * r, t[7] = n[7] + a[7] * r, t[8] = n[8] + a[8] * r, t;
    },
    exactEquals: function (t, n) {
      return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === n[3] && t[4] === n[4] && t[5] === n[5] && t[6] === n[6] && t[7] === n[7] && t[8] === n[8];
    },
    equals: function (t, a) {
      var r = t[0],
        u = t[1],
        e = t[2],
        o = t[3],
        i = t[4],
        c = t[5],
        h = t[6],
        s = t[7],
        M = t[8],
        f = a[0],
        l = a[1],
        v = a[2],
        b = a[3],
        m = a[4],
        d = a[5],
        x = a[6],
        p = a[7],
        y = a[8];
      return Math.abs(r - f) <= n * Math.max(1, Math.abs(r), Math.abs(f)) && Math.abs(u - l) <= n * Math.max(1, Math.abs(u), Math.abs(l)) && Math.abs(e - v) <= n * Math.max(1, Math.abs(e), Math.abs(v)) && Math.abs(o - b) <= n * Math.max(1, Math.abs(o), Math.abs(b)) && Math.abs(i - m) <= n * Math.max(1, Math.abs(i), Math.abs(m)) && Math.abs(c - d) <= n * Math.max(1, Math.abs(c), Math.abs(d)) && Math.abs(h - x) <= n * Math.max(1, Math.abs(h), Math.abs(x)) && Math.abs(s - p) <= n * Math.max(1, Math.abs(s), Math.abs(p)) && Math.abs(M - y) <= n * Math.max(1, Math.abs(M), Math.abs(y));
    },
    mul: p,
    sub: y
  });
function g(t) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
}
function A(t, n, a) {
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = n[4],
    c = n[5],
    h = n[6],
    s = n[7],
    M = n[8],
    f = n[9],
    l = n[10],
    v = n[11],
    b = n[12],
    m = n[13],
    d = n[14],
    x = n[15],
    p = a[0],
    y = a[1],
    q = a[2],
    g = a[3];
  return t[0] = p * r + y * i + q * M + g * b, t[1] = p * u + y * c + q * f + g * m, t[2] = p * e + y * h + q * l + g * d, t[3] = p * o + y * s + q * v + g * x, p = a[4], y = a[5], q = a[6], g = a[7], t[4] = p * r + y * i + q * M + g * b, t[5] = p * u + y * c + q * f + g * m, t[6] = p * e + y * h + q * l + g * d, t[7] = p * o + y * s + q * v + g * x, p = a[8], y = a[9], q = a[10], g = a[11], t[8] = p * r + y * i + q * M + g * b, t[9] = p * u + y * c + q * f + g * m, t[10] = p * e + y * h + q * l + g * d, t[11] = p * o + y * s + q * v + g * x, p = a[12], y = a[13], q = a[14], g = a[15], t[12] = p * r + y * i + q * M + g * b, t[13] = p * u + y * c + q * f + g * m, t[14] = p * e + y * h + q * l + g * d, t[15] = p * o + y * s + q * v + g * x, t;
}
function w(t, n, a) {
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = r + r,
    c = u + u,
    h = e + e,
    s = r * i,
    M = r * c,
    f = r * h,
    l = u * c,
    v = u * h,
    b = e * h,
    m = o * i,
    d = o * c,
    x = o * h;
  return t[0] = 1 - (l + b), t[1] = M + x, t[2] = f - d, t[3] = 0, t[4] = M - x, t[5] = 1 - (s + b), t[6] = v + m, t[7] = 0, t[8] = f + d, t[9] = v - m, t[10] = 1 - (s + l), t[11] = 0, t[12] = a[0], t[13] = a[1], t[14] = a[2], t[15] = 1, t;
}
function R(t, n) {
  return t[0] = n[12], t[1] = n[13], t[2] = n[14], t;
}
function z(t, n) {
  var a = n[0],
    r = n[1],
    u = n[2],
    e = n[4],
    o = n[5],
    i = n[6],
    c = n[8],
    h = n[9],
    s = n[10];
  return t[0] = Math.hypot(a, r, u), t[1] = Math.hypot(e, o, i), t[2] = Math.hypot(c, h, s), t;
}
function P(t, n) {
  var r = new a(3);
  z(r, n);
  var u = 1 / r[0],
    e = 1 / r[1],
    o = 1 / r[2],
    i = n[0] * u,
    c = n[1] * e,
    h = n[2] * o,
    s = n[4] * u,
    M = n[5] * e,
    f = n[6] * o,
    l = n[8] * u,
    v = n[9] * e,
    b = n[10] * o,
    m = i + M + b,
    d = 0;
  return m > 0 ? (d = 2 * Math.sqrt(m + 1), t[3] = .25 * d, t[0] = (f - v) / d, t[1] = (l - h) / d, t[2] = (c - s) / d) : i > M && i > b ? (d = 2 * Math.sqrt(1 + i - M - b), t[3] = (f - v) / d, t[0] = .25 * d, t[1] = (c + s) / d, t[2] = (l + h) / d) : M > b ? (d = 2 * Math.sqrt(1 + M - i - b), t[3] = (l - h) / d, t[0] = (c + s) / d, t[1] = .25 * d, t[2] = (f + v) / d) : (d = 2 * Math.sqrt(1 + b - i - M), t[3] = (c - s) / d, t[0] = (l + h) / d, t[1] = (f + v) / d, t[2] = .25 * d), t;
}
function j(t, n, a) {
  return t[0] = n[0] - a[0], t[1] = n[1] - a[1], t[2] = n[2] - a[2], t[3] = n[3] - a[3], t[4] = n[4] - a[4], t[5] = n[5] - a[5], t[6] = n[6] - a[6], t[7] = n[7] - a[7], t[8] = n[8] - a[8], t[9] = n[9] - a[9], t[10] = n[10] - a[10], t[11] = n[11] - a[11], t[12] = n[12] - a[12], t[13] = n[13] - a[13], t[14] = n[14] - a[14], t[15] = n[15] - a[15], t;
}
var I = A,
  S = j,
  E = Object.freeze({
    create: function () {
      var t = new a(16);
      return a != Float32Array && (t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0), t[0] = 1, t[5] = 1, t[10] = 1, t[15] = 1, t;
    },
    clone: function (t) {
      var n = new a(16);
      return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n[9] = t[9], n[10] = t[10], n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
    },
    copy: function (t, n) {
      return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], t;
    },
    fromValues: function (t, n, r, u, e, o, i, c, h, s, M, f, l, v, b, m) {
      var d = new a(16);
      return d[0] = t, d[1] = n, d[2] = r, d[3] = u, d[4] = e, d[5] = o, d[6] = i, d[7] = c, d[8] = h, d[9] = s, d[10] = M, d[11] = f, d[12] = l, d[13] = v, d[14] = b, d[15] = m, d;
    },
    set: function (t, n, a, r, u, e, o, i, c, h, s, M, f, l, v, b, m) {
      return t[0] = n, t[1] = a, t[2] = r, t[3] = u, t[4] = e, t[5] = o, t[6] = i, t[7] = c, t[8] = h, t[9] = s, t[10] = M, t[11] = f, t[12] = l, t[13] = v, t[14] = b, t[15] = m, t;
    },
    identity: g,
    transpose: function (t, n) {
      if (t === n) {
        var a = n[1],
          r = n[2],
          u = n[3],
          e = n[6],
          o = n[7],
          i = n[11];
        t[1] = n[4], t[2] = n[8], t[3] = n[12], t[4] = a, t[6] = n[9], t[7] = n[13], t[8] = r, t[9] = e, t[11] = n[14], t[12] = u, t[13] = o, t[14] = i;
      } else t[0] = n[0], t[1] = n[4], t[2] = n[8], t[3] = n[12], t[4] = n[1], t[5] = n[5], t[6] = n[9], t[7] = n[13], t[8] = n[2], t[9] = n[6], t[10] = n[10], t[11] = n[14], t[12] = n[3], t[13] = n[7], t[14] = n[11], t[15] = n[15];
      return t;
    },
    invert: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = n[4],
        i = n[5],
        c = n[6],
        h = n[7],
        s = n[8],
        M = n[9],
        f = n[10],
        l = n[11],
        v = n[12],
        b = n[13],
        m = n[14],
        d = n[15],
        x = a * i - r * o,
        p = a * c - u * o,
        y = a * h - e * o,
        q = r * c - u * i,
        g = r * h - e * i,
        A = u * h - e * c,
        w = s * b - M * v,
        R = s * m - f * v,
        z = s * d - l * v,
        P = M * m - f * b,
        j = M * d - l * b,
        I = f * d - l * m,
        S = x * I - p * j + y * P + q * z - g * R + A * w;
      return S ? (S = 1 / S, t[0] = (i * I - c * j + h * P) * S, t[1] = (u * j - r * I - e * P) * S, t[2] = (b * A - m * g + d * q) * S, t[3] = (f * g - M * A - l * q) * S, t[4] = (c * z - o * I - h * R) * S, t[5] = (a * I - u * z + e * R) * S, t[6] = (m * y - v * A - d * p) * S, t[7] = (s * A - f * y + l * p) * S, t[8] = (o * j - i * z + h * w) * S, t[9] = (r * z - a * j - e * w) * S, t[10] = (v * g - b * y + d * x) * S, t[11] = (M * y - s * g - l * x) * S, t[12] = (i * R - o * P - c * w) * S, t[13] = (a * P - r * R + u * w) * S, t[14] = (b * p - v * q - m * x) * S, t[15] = (s * q - M * p + f * x) * S, t) : null;
    },
    adjoint: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = n[4],
        i = n[5],
        c = n[6],
        h = n[7],
        s = n[8],
        M = n[9],
        f = n[10],
        l = n[11],
        v = n[12],
        b = n[13],
        m = n[14],
        d = n[15];
      return t[0] = i * (f * d - l * m) - M * (c * d - h * m) + b * (c * l - h * f), t[1] = -(r * (f * d - l * m) - M * (u * d - e * m) + b * (u * l - e * f)), t[2] = r * (c * d - h * m) - i * (u * d - e * m) + b * (u * h - e * c), t[3] = -(r * (c * l - h * f) - i * (u * l - e * f) + M * (u * h - e * c)), t[4] = -(o * (f * d - l * m) - s * (c * d - h * m) + v * (c * l - h * f)), t[5] = a * (f * d - l * m) - s * (u * d - e * m) + v * (u * l - e * f), t[6] = -(a * (c * d - h * m) - o * (u * d - e * m) + v * (u * h - e * c)), t[7] = a * (c * l - h * f) - o * (u * l - e * f) + s * (u * h - e * c), t[8] = o * (M * d - l * b) - s * (i * d - h * b) + v * (i * l - h * M), t[9] = -(a * (M * d - l * b) - s * (r * d - e * b) + v * (r * l - e * M)), t[10] = a * (i * d - h * b) - o * (r * d - e * b) + v * (r * h - e * i), t[11] = -(a * (i * l - h * M) - o * (r * l - e * M) + s * (r * h - e * i)), t[12] = -(o * (M * m - f * b) - s * (i * m - c * b) + v * (i * f - c * M)), t[13] = a * (M * m - f * b) - s * (r * m - u * b) + v * (r * f - u * M), t[14] = -(a * (i * m - c * b) - o * (r * m - u * b) + v * (r * c - u * i)), t[15] = a * (i * f - c * M) - o * (r * f - u * M) + s * (r * c - u * i), t;
    },
    determinant: function (t) {
      var n = t[0],
        a = t[1],
        r = t[2],
        u = t[3],
        e = t[4],
        o = t[5],
        i = t[6],
        c = t[7],
        h = t[8],
        s = t[9],
        M = t[10],
        f = t[11],
        l = t[12],
        v = t[13],
        b = t[14],
        m = t[15];
      return (n * o - a * e) * (M * m - f * b) - (n * i - r * e) * (s * m - f * v) + (n * c - u * e) * (s * b - M * v) + (a * i - r * o) * (h * m - f * l) - (a * c - u * o) * (h * b - M * l) + (r * c - u * i) * (h * v - s * l);
    },
    multiply: A,
    translate: function (t, n, a) {
      var r,
        u,
        e,
        o,
        i,
        c,
        h,
        s,
        M,
        f,
        l,
        v,
        b = a[0],
        m = a[1],
        d = a[2];
      return n === t ? (t[12] = n[0] * b + n[4] * m + n[8] * d + n[12], t[13] = n[1] * b + n[5] * m + n[9] * d + n[13], t[14] = n[2] * b + n[6] * m + n[10] * d + n[14], t[15] = n[3] * b + n[7] * m + n[11] * d + n[15]) : (r = n[0], u = n[1], e = n[2], o = n[3], i = n[4], c = n[5], h = n[6], s = n[7], M = n[8], f = n[9], l = n[10], v = n[11], t[0] = r, t[1] = u, t[2] = e, t[3] = o, t[4] = i, t[5] = c, t[6] = h, t[7] = s, t[8] = M, t[9] = f, t[10] = l, t[11] = v, t[12] = r * b + i * m + M * d + n[12], t[13] = u * b + c * m + f * d + n[13], t[14] = e * b + h * m + l * d + n[14], t[15] = o * b + s * m + v * d + n[15]), t;
    },
    scale: function (t, n, a) {
      var r = a[0],
        u = a[1],
        e = a[2];
      return t[0] = n[0] * r, t[1] = n[1] * r, t[2] = n[2] * r, t[3] = n[3] * r, t[4] = n[4] * u, t[5] = n[5] * u, t[6] = n[6] * u, t[7] = n[7] * u, t[8] = n[8] * e, t[9] = n[9] * e, t[10] = n[10] * e, t[11] = n[11] * e, t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], t;
    },
    rotate: function (t, a, r, u) {
      var e,
        o,
        i,
        c,
        h,
        s,
        M,
        f,
        l,
        v,
        b,
        m,
        d,
        x,
        p,
        y,
        q,
        g,
        A,
        w,
        R,
        z,
        P,
        j,
        I = u[0],
        S = u[1],
        E = u[2],
        O = Math.hypot(I, S, E);
      return O < n ? null : (I *= O = 1 / O, S *= O, E *= O, e = Math.sin(r), i = 1 - (o = Math.cos(r)), c = a[0], h = a[1], s = a[2], M = a[3], f = a[4], l = a[5], v = a[6], b = a[7], m = a[8], d = a[9], x = a[10], p = a[11], y = I * I * i + o, q = S * I * i + E * e, g = E * I * i - S * e, A = I * S * i - E * e, w = S * S * i + o, R = E * S * i + I * e, z = I * E * i + S * e, P = S * E * i - I * e, j = E * E * i + o, t[0] = c * y + f * q + m * g, t[1] = h * y + l * q + d * g, t[2] = s * y + v * q + x * g, t[3] = M * y + b * q + p * g, t[4] = c * A + f * w + m * R, t[5] = h * A + l * w + d * R, t[6] = s * A + v * w + x * R, t[7] = M * A + b * w + p * R, t[8] = c * z + f * P + m * j, t[9] = h * z + l * P + d * j, t[10] = s * z + v * P + x * j, t[11] = M * z + b * P + p * j, a !== t && (t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t);
    },
    rotateX: function (t, n, a) {
      var r = Math.sin(a),
        u = Math.cos(a),
        e = n[4],
        o = n[5],
        i = n[6],
        c = n[7],
        h = n[8],
        s = n[9],
        M = n[10],
        f = n[11];
      return n !== t && (t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15]), t[4] = e * u + h * r, t[5] = o * u + s * r, t[6] = i * u + M * r, t[7] = c * u + f * r, t[8] = h * u - e * r, t[9] = s * u - o * r, t[10] = M * u - i * r, t[11] = f * u - c * r, t;
    },
    rotateY: function (t, n, a) {
      var r = Math.sin(a),
        u = Math.cos(a),
        e = n[0],
        o = n[1],
        i = n[2],
        c = n[3],
        h = n[8],
        s = n[9],
        M = n[10],
        f = n[11];
      return n !== t && (t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15]), t[0] = e * u - h * r, t[1] = o * u - s * r, t[2] = i * u - M * r, t[3] = c * u - f * r, t[8] = e * r + h * u, t[9] = o * r + s * u, t[10] = i * r + M * u, t[11] = c * r + f * u, t;
    },
    rotateZ: function (t, n, a) {
      var r = Math.sin(a),
        u = Math.cos(a),
        e = n[0],
        o = n[1],
        i = n[2],
        c = n[3],
        h = n[4],
        s = n[5],
        M = n[6],
        f = n[7];
      return n !== t && (t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15]), t[0] = e * u + h * r, t[1] = o * u + s * r, t[2] = i * u + M * r, t[3] = c * u + f * r, t[4] = h * u - e * r, t[5] = s * u - o * r, t[6] = M * u - i * r, t[7] = f * u - c * r, t;
    },
    fromTranslation: function (t, n) {
      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t;
    },
    fromScaling: function (t, n) {
      return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = n[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = n[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
    },
    fromRotation: function (t, a, r) {
      var u,
        e,
        o,
        i = r[0],
        c = r[1],
        h = r[2],
        s = Math.hypot(i, c, h);
      return s < n ? null : (i *= s = 1 / s, c *= s, h *= s, u = Math.sin(a), o = 1 - (e = Math.cos(a)), t[0] = i * i * o + e, t[1] = c * i * o + h * u, t[2] = h * i * o - c * u, t[3] = 0, t[4] = i * c * o - h * u, t[5] = c * c * o + e, t[6] = h * c * o + i * u, t[7] = 0, t[8] = i * h * o + c * u, t[9] = c * h * o - i * u, t[10] = h * h * o + e, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t);
    },
    fromXRotation: function (t, n) {
      var a = Math.sin(n),
        r = Math.cos(n);
      return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = r, t[6] = a, t[7] = 0, t[8] = 0, t[9] = -a, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
    },
    fromYRotation: function (t, n) {
      var a = Math.sin(n),
        r = Math.cos(n);
      return t[0] = r, t[1] = 0, t[2] = -a, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = a, t[9] = 0, t[10] = r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
    },
    fromZRotation: function (t, n) {
      var a = Math.sin(n),
        r = Math.cos(n);
      return t[0] = r, t[1] = a, t[2] = 0, t[3] = 0, t[4] = -a, t[5] = r, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
    },
    fromRotationTranslation: w,
    fromQuat2: function (t, n) {
      var r = new a(3),
        u = -n[0],
        e = -n[1],
        o = -n[2],
        i = n[3],
        c = n[4],
        h = n[5],
        s = n[6],
        M = n[7],
        f = u * u + e * e + o * o + i * i;
      return f > 0 ? (r[0] = 2 * (c * i + M * u + h * o - s * e) / f, r[1] = 2 * (h * i + M * e + s * u - c * o) / f, r[2] = 2 * (s * i + M * o + c * e - h * u) / f) : (r[0] = 2 * (c * i + M * u + h * o - s * e), r[1] = 2 * (h * i + M * e + s * u - c * o), r[2] = 2 * (s * i + M * o + c * e - h * u)), w(t, n, r), t;
    },
    getTranslation: R,
    getScaling: z,
    getRotation: P,
    fromRotationTranslationScale: function (t, n, a, r) {
      var u = n[0],
        e = n[1],
        o = n[2],
        i = n[3],
        c = u + u,
        h = e + e,
        s = o + o,
        M = u * c,
        f = u * h,
        l = u * s,
        v = e * h,
        b = e * s,
        m = o * s,
        d = i * c,
        x = i * h,
        p = i * s,
        y = r[0],
        q = r[1],
        g = r[2];
      return t[0] = (1 - (v + m)) * y, t[1] = (f + p) * y, t[2] = (l - x) * y, t[3] = 0, t[4] = (f - p) * q, t[5] = (1 - (M + m)) * q, t[6] = (b + d) * q, t[7] = 0, t[8] = (l + x) * g, t[9] = (b - d) * g, t[10] = (1 - (M + v)) * g, t[11] = 0, t[12] = a[0], t[13] = a[1], t[14] = a[2], t[15] = 1, t;
    },
    fromRotationTranslationScaleOrigin: function (t, n, a, r, u) {
      var e = n[0],
        o = n[1],
        i = n[2],
        c = n[3],
        h = e + e,
        s = o + o,
        M = i + i,
        f = e * h,
        l = e * s,
        v = e * M,
        b = o * s,
        m = o * M,
        d = i * M,
        x = c * h,
        p = c * s,
        y = c * M,
        q = r[0],
        g = r[1],
        A = r[2],
        w = u[0],
        R = u[1],
        z = u[2],
        P = (1 - (b + d)) * q,
        j = (l + y) * q,
        I = (v - p) * q,
        S = (l - y) * g,
        E = (1 - (f + d)) * g,
        O = (m + x) * g,
        T = (v + p) * A,
        D = (m - x) * A,
        F = (1 - (f + b)) * A;
      return t[0] = P, t[1] = j, t[2] = I, t[3] = 0, t[4] = S, t[5] = E, t[6] = O, t[7] = 0, t[8] = T, t[9] = D, t[10] = F, t[11] = 0, t[12] = a[0] + w - (P * w + S * R + T * z), t[13] = a[1] + R - (j * w + E * R + D * z), t[14] = a[2] + z - (I * w + O * R + F * z), t[15] = 1, t;
    },
    fromQuat: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = a + a,
        i = r + r,
        c = u + u,
        h = a * o,
        s = r * o,
        M = r * i,
        f = u * o,
        l = u * i,
        v = u * c,
        b = e * o,
        m = e * i,
        d = e * c;
      return t[0] = 1 - M - v, t[1] = s + d, t[2] = f - m, t[3] = 0, t[4] = s - d, t[5] = 1 - h - v, t[6] = l + b, t[7] = 0, t[8] = f + m, t[9] = l - b, t[10] = 1 - h - M, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
    },
    frustum: function (t, n, a, r, u, e, o) {
      var i = 1 / (a - n),
        c = 1 / (u - r),
        h = 1 / (e - o);
      return t[0] = 2 * e * i, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * e * c, t[6] = 0, t[7] = 0, t[8] = (a + n) * i, t[9] = (u + r) * c, t[10] = (o + e) * h, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = o * e * 2 * h, t[15] = 0, t;
    },
    perspective: function (t, n, a, r, u) {
      var e,
        o = 1 / Math.tan(n / 2);
      return t[0] = o / a, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = o, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[11] = -1, t[12] = 0, t[13] = 0, t[15] = 0, null != u && u !== 1 / 0 ? (e = 1 / (r - u), t[10] = (u + r) * e, t[14] = 2 * u * r * e) : (t[10] = -1, t[14] = -2 * r), t;
    },
    perspectiveFromFieldOfView: function (t, n, a, r) {
      var u = Math.tan(n.upDegrees * Math.PI / 180),
        e = Math.tan(n.downDegrees * Math.PI / 180),
        o = Math.tan(n.leftDegrees * Math.PI / 180),
        i = Math.tan(n.rightDegrees * Math.PI / 180),
        c = 2 / (o + i),
        h = 2 / (u + e);
      return t[0] = c, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = h, t[6] = 0, t[7] = 0, t[8] = -(o - i) * c * .5, t[9] = (u - e) * h * .5, t[10] = r / (a - r), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = r * a / (a - r), t[15] = 0, t;
    },
    ortho: function (t, n, a, r, u, e, o) {
      var i = 1 / (n - a),
        c = 1 / (r - u),
        h = 1 / (e - o);
      return t[0] = -2 * i, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * c, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * h, t[11] = 0, t[12] = (n + a) * i, t[13] = (u + r) * c, t[14] = (o + e) * h, t[15] = 1, t;
    },
    lookAt: function (t, a, r, u) {
      var e,
        o,
        i,
        c,
        h,
        s,
        M,
        f,
        l,
        v,
        b = a[0],
        m = a[1],
        d = a[2],
        x = u[0],
        p = u[1],
        y = u[2],
        q = r[0],
        A = r[1],
        w = r[2];
      return Math.abs(b - q) < n && Math.abs(m - A) < n && Math.abs(d - w) < n ? g(t) : (M = b - q, f = m - A, l = d - w, e = p * (l *= v = 1 / Math.hypot(M, f, l)) - y * (f *= v), o = y * (M *= v) - x * l, i = x * f - p * M, (v = Math.hypot(e, o, i)) ? (e *= v = 1 / v, o *= v, i *= v) : (e = 0, o = 0, i = 0), c = f * i - l * o, h = l * e - M * i, s = M * o - f * e, (v = Math.hypot(c, h, s)) ? (c *= v = 1 / v, h *= v, s *= v) : (c = 0, h = 0, s = 0), t[0] = e, t[1] = c, t[2] = M, t[3] = 0, t[4] = o, t[5] = h, t[6] = f, t[7] = 0, t[8] = i, t[9] = s, t[10] = l, t[11] = 0, t[12] = -(e * b + o * m + i * d), t[13] = -(c * b + h * m + s * d), t[14] = -(M * b + f * m + l * d), t[15] = 1, t);
    },
    targetTo: function (t, n, a, r) {
      var u = n[0],
        e = n[1],
        o = n[2],
        i = r[0],
        c = r[1],
        h = r[2],
        s = u - a[0],
        M = e - a[1],
        f = o - a[2],
        l = s * s + M * M + f * f;
      l > 0 && (s *= l = 1 / Math.sqrt(l), M *= l, f *= l);
      var v = c * f - h * M,
        b = h * s - i * f,
        m = i * M - c * s;
      return (l = v * v + b * b + m * m) > 0 && (v *= l = 1 / Math.sqrt(l), b *= l, m *= l), t[0] = v, t[1] = b, t[2] = m, t[3] = 0, t[4] = M * m - f * b, t[5] = f * v - s * m, t[6] = s * b - M * v, t[7] = 0, t[8] = s, t[9] = M, t[10] = f, t[11] = 0, t[12] = u, t[13] = e, t[14] = o, t[15] = 1, t;
    },
    str: function (t) {
      return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")";
    },
    frob: function (t) {
      return Math.hypot(t[0], t[1], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
    },
    add: function (t, n, a) {
      return t[0] = n[0] + a[0], t[1] = n[1] + a[1], t[2] = n[2] + a[2], t[3] = n[3] + a[3], t[4] = n[4] + a[4], t[5] = n[5] + a[5], t[6] = n[6] + a[6], t[7] = n[7] + a[7], t[8] = n[8] + a[8], t[9] = n[9] + a[9], t[10] = n[10] + a[10], t[11] = n[11] + a[11], t[12] = n[12] + a[12], t[13] = n[13] + a[13], t[14] = n[14] + a[14], t[15] = n[15] + a[15], t;
    },
    subtract: j,
    multiplyScalar: function (t, n, a) {
      return t[0] = n[0] * a, t[1] = n[1] * a, t[2] = n[2] * a, t[3] = n[3] * a, t[4] = n[4] * a, t[5] = n[5] * a, t[6] = n[6] * a, t[7] = n[7] * a, t[8] = n[8] * a, t[9] = n[9] * a, t[10] = n[10] * a, t[11] = n[11] * a, t[12] = n[12] * a, t[13] = n[13] * a, t[14] = n[14] * a, t[15] = n[15] * a, t;
    },
    multiplyScalarAndAdd: function (t, n, a, r) {
      return t[0] = n[0] + a[0] * r, t[1] = n[1] + a[1] * r, t[2] = n[2] + a[2] * r, t[3] = n[3] + a[3] * r, t[4] = n[4] + a[4] * r, t[5] = n[5] + a[5] * r, t[6] = n[6] + a[6] * r, t[7] = n[7] + a[7] * r, t[8] = n[8] + a[8] * r, t[9] = n[9] + a[9] * r, t[10] = n[10] + a[10] * r, t[11] = n[11] + a[11] * r, t[12] = n[12] + a[12] * r, t[13] = n[13] + a[13] * r, t[14] = n[14] + a[14] * r, t[15] = n[15] + a[15] * r, t;
    },
    exactEquals: function (t, n) {
      return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === n[3] && t[4] === n[4] && t[5] === n[5] && t[6] === n[6] && t[7] === n[7] && t[8] === n[8] && t[9] === n[9] && t[10] === n[10] && t[11] === n[11] && t[12] === n[12] && t[13] === n[13] && t[14] === n[14] && t[15] === n[15];
    },
    equals: function (t, a) {
      var r = t[0],
        u = t[1],
        e = t[2],
        o = t[3],
        i = t[4],
        c = t[5],
        h = t[6],
        s = t[7],
        M = t[8],
        f = t[9],
        l = t[10],
        v = t[11],
        b = t[12],
        m = t[13],
        d = t[14],
        x = t[15],
        p = a[0],
        y = a[1],
        q = a[2],
        g = a[3],
        A = a[4],
        w = a[5],
        R = a[6],
        z = a[7],
        P = a[8],
        j = a[9],
        I = a[10],
        S = a[11],
        E = a[12],
        O = a[13],
        T = a[14],
        D = a[15];
      return Math.abs(r - p) <= n * Math.max(1, Math.abs(r), Math.abs(p)) && Math.abs(u - y) <= n * Math.max(1, Math.abs(u), Math.abs(y)) && Math.abs(e - q) <= n * Math.max(1, Math.abs(e), Math.abs(q)) && Math.abs(o - g) <= n * Math.max(1, Math.abs(o), Math.abs(g)) && Math.abs(i - A) <= n * Math.max(1, Math.abs(i), Math.abs(A)) && Math.abs(c - w) <= n * Math.max(1, Math.abs(c), Math.abs(w)) && Math.abs(h - R) <= n * Math.max(1, Math.abs(h), Math.abs(R)) && Math.abs(s - z) <= n * Math.max(1, Math.abs(s), Math.abs(z)) && Math.abs(M - P) <= n * Math.max(1, Math.abs(M), Math.abs(P)) && Math.abs(f - j) <= n * Math.max(1, Math.abs(f), Math.abs(j)) && Math.abs(l - I) <= n * Math.max(1, Math.abs(l), Math.abs(I)) && Math.abs(v - S) <= n * Math.max(1, Math.abs(v), Math.abs(S)) && Math.abs(b - E) <= n * Math.max(1, Math.abs(b), Math.abs(E)) && Math.abs(m - O) <= n * Math.max(1, Math.abs(m), Math.abs(O)) && Math.abs(d - T) <= n * Math.max(1, Math.abs(d), Math.abs(T)) && Math.abs(x - D) <= n * Math.max(1, Math.abs(x), Math.abs(D));
    },
    mul: I,
    sub: S
  });
function O() {
  var t = new a(3);
  return a != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0), t;
}
function T(t) {
  var n = t[0],
    a = t[1],
    r = t[2];
  return Math.hypot(n, a, r);
}
function D(t, n, r) {
  var u = new a(3);
  return u[0] = t, u[1] = n, u[2] = r, u;
}
function F(t, n, a) {
  return t[0] = n[0] - a[0], t[1] = n[1] - a[1], t[2] = n[2] - a[2], t;
}
function L(t, n, a) {
  return t[0] = n[0] * a[0], t[1] = n[1] * a[1], t[2] = n[2] * a[2], t;
}
function V(t, n, a) {
  return t[0] = n[0] / a[0], t[1] = n[1] / a[1], t[2] = n[2] / a[2], t;
}
function Q(t, n) {
  var a = n[0] - t[0],
    r = n[1] - t[1],
    u = n[2] - t[2];
  return Math.hypot(a, r, u);
}
function Y(t, n) {
  var a = n[0] - t[0],
    r = n[1] - t[1],
    u = n[2] - t[2];
  return a * a + r * r + u * u;
}
function X(t) {
  var n = t[0],
    a = t[1],
    r = t[2];
  return n * n + a * a + r * r;
}
function Z(t, n) {
  var a = n[0],
    r = n[1],
    u = n[2],
    e = a * a + r * r + u * u;
  return e > 0 && (e = 1 / Math.sqrt(e)), t[0] = n[0] * e, t[1] = n[1] * e, t[2] = n[2] * e, t;
}
function _(t, n) {
  return t[0] * n[0] + t[1] * n[1] + t[2] * n[2];
}
function B(t, n, a) {
  var r = n[0],
    u = n[1],
    e = n[2],
    o = a[0],
    i = a[1],
    c = a[2];
  return t[0] = u * c - e * i, t[1] = e * o - r * c, t[2] = r * i - u * o, t;
}
var N,
  k = F,
  U = L,
  W = V,
  C = Q,
  G = Y,
  H = T,
  J = X,
  K = (N = O(), function (t, n, a, r, u, e) {
    var o, i;
    for (n || (n = 3), a || (a = 0), i = r ? Math.min(r * n + a, t.length) : t.length, o = a; o < i; o += n) N[0] = t[o], N[1] = t[o + 1], N[2] = t[o + 2], u(N, N, e), t[o] = N[0], t[o + 1] = N[1], t[o + 2] = N[2];
    return t;
  }),
  $ = Object.freeze({
    create: O,
    clone: function (t) {
      var n = new a(3);
      return n[0] = t[0], n[1] = t[1], n[2] = t[2], n;
    },
    length: T,
    fromValues: D,
    copy: function (t, n) {
      return t[0] = n[0], t[1] = n[1], t[2] = n[2], t;
    },
    set: function (t, n, a, r) {
      return t[0] = n, t[1] = a, t[2] = r, t;
    },
    add: function (t, n, a) {
      return t[0] = n[0] + a[0], t[1] = n[1] + a[1], t[2] = n[2] + a[2], t;
    },
    subtract: F,
    multiply: L,
    divide: V,
    ceil: function (t, n) {
      return t[0] = Math.ceil(n[0]), t[1] = Math.ceil(n[1]), t[2] = Math.ceil(n[2]), t;
    },
    floor: function (t, n) {
      return t[0] = Math.floor(n[0]), t[1] = Math.floor(n[1]), t[2] = Math.floor(n[2]), t;
    },
    min: function (t, n, a) {
      return t[0] = Math.min(n[0], a[0]), t[1] = Math.min(n[1], a[1]), t[2] = Math.min(n[2], a[2]), t;
    },
    max: function (t, n, a) {
      return t[0] = Math.max(n[0], a[0]), t[1] = Math.max(n[1], a[1]), t[2] = Math.max(n[2], a[2]), t;
    },
    round: function (t, n) {
      return t[0] = Math.round(n[0]), t[1] = Math.round(n[1]), t[2] = Math.round(n[2]), t;
    },
    scale: function (t, n, a) {
      return t[0] = n[0] * a, t[1] = n[1] * a, t[2] = n[2] * a, t;
    },
    scaleAndAdd: function (t, n, a, r) {
      return t[0] = n[0] + a[0] * r, t[1] = n[1] + a[1] * r, t[2] = n[2] + a[2] * r, t;
    },
    distance: Q,
    squaredDistance: Y,
    squaredLength: X,
    negate: function (t, n) {
      return t[0] = -n[0], t[1] = -n[1], t[2] = -n[2], t;
    },
    inverse: function (t, n) {
      return t[0] = 1 / n[0], t[1] = 1 / n[1], t[2] = 1 / n[2], t;
    },
    normalize: Z,
    dot: _,
    cross: B,
    lerp: function (t, n, a, r) {
      var u = n[0],
        e = n[1],
        o = n[2];
      return t[0] = u + r * (a[0] - u), t[1] = e + r * (a[1] - e), t[2] = o + r * (a[2] - o), t;
    },
    hermite: function (t, n, a, r, u, e) {
      var o = e * e,
        i = o * (2 * e - 3) + 1,
        c = o * (e - 2) + e,
        h = o * (e - 1),
        s = o * (3 - 2 * e);
      return t[0] = n[0] * i + a[0] * c + r[0] * h + u[0] * s, t[1] = n[1] * i + a[1] * c + r[1] * h + u[1] * s, t[2] = n[2] * i + a[2] * c + r[2] * h + u[2] * s, t;
    },
    bezier: function (t, n, a, r, u, e) {
      var o = 1 - e,
        i = o * o,
        c = e * e,
        h = i * o,
        s = 3 * e * i,
        M = 3 * c * o,
        f = c * e;
      return t[0] = n[0] * h + a[0] * s + r[0] * M + u[0] * f, t[1] = n[1] * h + a[1] * s + r[1] * M + u[1] * f, t[2] = n[2] * h + a[2] * s + r[2] * M + u[2] * f, t;
    },
    random: function (t, n) {
      n = n || 1;
      var a = 2 * r() * Math.PI,
        u = 2 * r() - 1,
        e = Math.sqrt(1 - u * u) * n;
      return t[0] = Math.cos(a) * e, t[1] = Math.sin(a) * e, t[2] = u * n, t;
    },
    transformMat4: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = a[3] * r + a[7] * u + a[11] * e + a[15];
      return o = o || 1, t[0] = (a[0] * r + a[4] * u + a[8] * e + a[12]) / o, t[1] = (a[1] * r + a[5] * u + a[9] * e + a[13]) / o, t[2] = (a[2] * r + a[6] * u + a[10] * e + a[14]) / o, t;
    },
    transformMat3: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2];
      return t[0] = r * a[0] + u * a[3] + e * a[6], t[1] = r * a[1] + u * a[4] + e * a[7], t[2] = r * a[2] + u * a[5] + e * a[8], t;
    },
    transformQuat: function (t, n, a) {
      var r = a[0],
        u = a[1],
        e = a[2],
        o = a[3],
        i = n[0],
        c = n[1],
        h = n[2],
        s = u * h - e * c,
        M = e * i - r * h,
        f = r * c - u * i,
        l = u * f - e * M,
        v = e * s - r * f,
        b = r * M - u * s,
        m = 2 * o;
      return s *= m, M *= m, f *= m, l *= 2, v *= 2, b *= 2, t[0] = i + s + l, t[1] = c + M + v, t[2] = h + f + b, t;
    },
    rotateX: function (t, n, a, r) {
      var u = [],
        e = [];
      return u[0] = n[0] - a[0], u[1] = n[1] - a[1], u[2] = n[2] - a[2], e[0] = u[0], e[1] = u[1] * Math.cos(r) - u[2] * Math.sin(r), e[2] = u[1] * Math.sin(r) + u[2] * Math.cos(r), t[0] = e[0] + a[0], t[1] = e[1] + a[1], t[2] = e[2] + a[2], t;
    },
    rotateY: function (t, n, a, r) {
      var u = [],
        e = [];
      return u[0] = n[0] - a[0], u[1] = n[1] - a[1], u[2] = n[2] - a[2], e[0] = u[2] * Math.sin(r) + u[0] * Math.cos(r), e[1] = u[1], e[2] = u[2] * Math.cos(r) - u[0] * Math.sin(r), t[0] = e[0] + a[0], t[1] = e[1] + a[1], t[2] = e[2] + a[2], t;
    },
    rotateZ: function (t, n, a, r) {
      var u = [],
        e = [];
      return u[0] = n[0] - a[0], u[1] = n[1] - a[1], u[2] = n[2] - a[2], e[0] = u[0] * Math.cos(r) - u[1] * Math.sin(r), e[1] = u[0] * Math.sin(r) + u[1] * Math.cos(r), e[2] = u[2], t[0] = e[0] + a[0], t[1] = e[1] + a[1], t[2] = e[2] + a[2], t;
    },
    angle: function (t, n) {
      var a = D(t[0], t[1], t[2]),
        r = D(n[0], n[1], n[2]);
      Z(a, a), Z(r, r);
      var u = _(a, r);
      return u > 1 ? 0 : u < -1 ? Math.PI : Math.acos(u);
    },
    zero: function (t) {
      return t[0] = 0, t[1] = 0, t[2] = 0, t;
    },
    str: function (t) {
      return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")";
    },
    exactEquals: function (t, n) {
      return t[0] === n[0] && t[1] === n[1] && t[2] === n[2];
    },
    equals: function (t, a) {
      var r = t[0],
        u = t[1],
        e = t[2],
        o = a[0],
        i = a[1],
        c = a[2];
      return Math.abs(r - o) <= n * Math.max(1, Math.abs(r), Math.abs(o)) && Math.abs(u - i) <= n * Math.max(1, Math.abs(u), Math.abs(i)) && Math.abs(e - c) <= n * Math.max(1, Math.abs(e), Math.abs(c));
    },
    sub: k,
    mul: U,
    div: W,
    dist: C,
    sqrDist: G,
    len: H,
    sqrLen: J,
    forEach: K
  });
function tt() {
  var t = new a(4);
  return a != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0), t;
}
function nt(t) {
  var n = new a(4);
  return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n;
}
function at(t, n, r, u) {
  var e = new a(4);
  return e[0] = t, e[1] = n, e[2] = r, e[3] = u, e;
}
function rt(t, n) {
  return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t;
}
function ut(t, n, a, r, u) {
  return t[0] = n, t[1] = a, t[2] = r, t[3] = u, t;
}
function et(t, n, a) {
  return t[0] = n[0] + a[0], t[1] = n[1] + a[1], t[2] = n[2] + a[2], t[3] = n[3] + a[3], t;
}
function ot(t, n, a) {
  return t[0] = n[0] - a[0], t[1] = n[1] - a[1], t[2] = n[2] - a[2], t[3] = n[3] - a[3], t;
}
function it(t, n, a) {
  return t[0] = n[0] * a[0], t[1] = n[1] * a[1], t[2] = n[2] * a[2], t[3] = n[3] * a[3], t;
}
function ct(t, n, a) {
  return t[0] = n[0] / a[0], t[1] = n[1] / a[1], t[2] = n[2] / a[2], t[3] = n[3] / a[3], t;
}
function ht(t, n, a) {
  return t[0] = n[0] * a, t[1] = n[1] * a, t[2] = n[2] * a, t[3] = n[3] * a, t;
}
function st(t, n) {
  var a = n[0] - t[0],
    r = n[1] - t[1],
    u = n[2] - t[2],
    e = n[3] - t[3];
  return Math.hypot(a, r, u, e);
}
function Mt(t, n) {
  var a = n[0] - t[0],
    r = n[1] - t[1],
    u = n[2] - t[2],
    e = n[3] - t[3];
  return a * a + r * r + u * u + e * e;
}
function ft(t) {
  var n = t[0],
    a = t[1],
    r = t[2],
    u = t[3];
  return Math.hypot(n, a, r, u);
}
function lt(t) {
  var n = t[0],
    a = t[1],
    r = t[2],
    u = t[3];
  return n * n + a * a + r * r + u * u;
}
function vt(t, n) {
  var a = n[0],
    r = n[1],
    u = n[2],
    e = n[3],
    o = a * a + r * r + u * u + e * e;
  return o > 0 && (o = 1 / Math.sqrt(o)), t[0] = a * o, t[1] = r * o, t[2] = u * o, t[3] = e * o, t;
}
function bt(t, n) {
  return t[0] * n[0] + t[1] * n[1] + t[2] * n[2] + t[3] * n[3];
}
function mt(t, n, a, r) {
  var u = n[0],
    e = n[1],
    o = n[2],
    i = n[3];
  return t[0] = u + r * (a[0] - u), t[1] = e + r * (a[1] - e), t[2] = o + r * (a[2] - o), t[3] = i + r * (a[3] - i), t;
}
function dt(t, n) {
  return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === n[3];
}
function xt(t, a) {
  var r = t[0],
    u = t[1],
    e = t[2],
    o = t[3],
    i = a[0],
    c = a[1],
    h = a[2],
    s = a[3];
  return Math.abs(r - i) <= n * Math.max(1, Math.abs(r), Math.abs(i)) && Math.abs(u - c) <= n * Math.max(1, Math.abs(u), Math.abs(c)) && Math.abs(e - h) <= n * Math.max(1, Math.abs(e), Math.abs(h)) && Math.abs(o - s) <= n * Math.max(1, Math.abs(o), Math.abs(s));
}
var pt = ot,
  yt = it,
  qt = ct,
  gt = st,
  At = Mt,
  wt = ft,
  Rt = lt,
  zt = function () {
    var t = tt();
    return function (n, a, r, u, e, o) {
      var i, c;
      for (a || (a = 4), r || (r = 0), c = u ? Math.min(u * a + r, n.length) : n.length, i = r; i < c; i += a) t[0] = n[i], t[1] = n[i + 1], t[2] = n[i + 2], t[3] = n[i + 3], e(t, t, o), n[i] = t[0], n[i + 1] = t[1], n[i + 2] = t[2], n[i + 3] = t[3];
      return n;
    };
  }(),
  Pt = Object.freeze({
    create: tt,
    clone: nt,
    fromValues: at,
    copy: rt,
    set: ut,
    add: et,
    subtract: ot,
    multiply: it,
    divide: ct,
    ceil: function (t, n) {
      return t[0] = Math.ceil(n[0]), t[1] = Math.ceil(n[1]), t[2] = Math.ceil(n[2]), t[3] = Math.ceil(n[3]), t;
    },
    floor: function (t, n) {
      return t[0] = Math.floor(n[0]), t[1] = Math.floor(n[1]), t[2] = Math.floor(n[2]), t[3] = Math.floor(n[3]), t;
    },
    min: function (t, n, a) {
      return t[0] = Math.min(n[0], a[0]), t[1] = Math.min(n[1], a[1]), t[2] = Math.min(n[2], a[2]), t[3] = Math.min(n[3], a[3]), t;
    },
    max: function (t, n, a) {
      return t[0] = Math.max(n[0], a[0]), t[1] = Math.max(n[1], a[1]), t[2] = Math.max(n[2], a[2]), t[3] = Math.max(n[3], a[3]), t;
    },
    round: function (t, n) {
      return t[0] = Math.round(n[0]), t[1] = Math.round(n[1]), t[2] = Math.round(n[2]), t[3] = Math.round(n[3]), t;
    },
    scale: ht,
    scaleAndAdd: function (t, n, a, r) {
      return t[0] = n[0] + a[0] * r, t[1] = n[1] + a[1] * r, t[2] = n[2] + a[2] * r, t[3] = n[3] + a[3] * r, t;
    },
    distance: st,
    squaredDistance: Mt,
    length: ft,
    squaredLength: lt,
    negate: function (t, n) {
      return t[0] = -n[0], t[1] = -n[1], t[2] = -n[2], t[3] = -n[3], t;
    },
    inverse: function (t, n) {
      return t[0] = 1 / n[0], t[1] = 1 / n[1], t[2] = 1 / n[2], t[3] = 1 / n[3], t;
    },
    normalize: vt,
    dot: bt,
    cross: function (t, n, a, r) {
      var u = a[0] * r[1] - a[1] * r[0],
        e = a[0] * r[2] - a[2] * r[0],
        o = a[0] * r[3] - a[3] * r[0],
        i = a[1] * r[2] - a[2] * r[1],
        c = a[1] * r[3] - a[3] * r[1],
        h = a[2] * r[3] - a[3] * r[2],
        s = n[0],
        M = n[1],
        f = n[2],
        l = n[3];
      return t[0] = M * h - f * c + l * i, t[1] = -s * h + f * o - l * e, t[2] = s * c - M * o + l * u, t[3] = -s * i + M * e - f * u, t;
    },
    lerp: mt,
    random: function (t, n) {
      var a, u, e, o, i, c;
      n = n || 1;
      do {
        i = (a = 2 * r() - 1) * a + (u = 2 * r() - 1) * u;
      } while (i >= 1);
      do {
        c = (e = 2 * r() - 1) * e + (o = 2 * r() - 1) * o;
      } while (c >= 1);
      var h = Math.sqrt((1 - i) / c);
      return t[0] = n * a, t[1] = n * u, t[2] = n * e * h, t[3] = n * o * h, t;
    },
    transformMat4: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = n[3];
      return t[0] = a[0] * r + a[4] * u + a[8] * e + a[12] * o, t[1] = a[1] * r + a[5] * u + a[9] * e + a[13] * o, t[2] = a[2] * r + a[6] * u + a[10] * e + a[14] * o, t[3] = a[3] * r + a[7] * u + a[11] * e + a[15] * o, t;
    },
    transformQuat: function (t, n, a) {
      var r = n[0],
        u = n[1],
        e = n[2],
        o = a[0],
        i = a[1],
        c = a[2],
        h = a[3],
        s = h * r + i * e - c * u,
        M = h * u + c * r - o * e,
        f = h * e + o * u - i * r,
        l = -o * r - i * u - c * e;
      return t[0] = s * h + l * -o + M * -c - f * -i, t[1] = M * h + l * -i + f * -o - s * -c, t[2] = f * h + l * -c + s * -i - M * -o, t[3] = n[3], t;
    },
    zero: function (t) {
      return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t;
    },
    str: function (t) {
      return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
    },
    exactEquals: dt,
    equals: xt,
    sub: pt,
    mul: yt,
    div: qt,
    dist: gt,
    sqrDist: At,
    len: wt,
    sqrLen: Rt,
    forEach: zt
  });
function jt() {
  var t = new a(4);
  return a != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0), t[3] = 1, t;
}
function It(t, n, a) {
  a *= .5;
  var r = Math.sin(a);
  return t[0] = r * n[0], t[1] = r * n[1], t[2] = r * n[2], t[3] = Math.cos(a), t;
}
function St(t, n, a) {
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = a[0],
    c = a[1],
    h = a[2],
    s = a[3];
  return t[0] = r * s + o * i + u * h - e * c, t[1] = u * s + o * c + e * i - r * h, t[2] = e * s + o * h + r * c - u * i, t[3] = o * s - r * i - u * c - e * h, t;
}
function Et(t, n, a) {
  a *= .5;
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = Math.sin(a),
    c = Math.cos(a);
  return t[0] = r * c + o * i, t[1] = u * c + e * i, t[2] = e * c - u * i, t[3] = o * c - r * i, t;
}
function Ot(t, n, a) {
  a *= .5;
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = Math.sin(a),
    c = Math.cos(a);
  return t[0] = r * c - e * i, t[1] = u * c + o * i, t[2] = e * c + r * i, t[3] = o * c - u * i, t;
}
function Tt(t, n, a) {
  a *= .5;
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = Math.sin(a),
    c = Math.cos(a);
  return t[0] = r * c + u * i, t[1] = u * c - r * i, t[2] = e * c + o * i, t[3] = o * c - e * i, t;
}
function Dt(t, n) {
  var a = n[0],
    r = n[1],
    u = n[2],
    e = n[3],
    o = Math.sqrt(a * a + r * r + u * u),
    i = Math.exp(e),
    c = o > 0 ? i * Math.sin(o) / o : 0;
  return t[0] = a * c, t[1] = r * c, t[2] = u * c, t[3] = i * Math.cos(o), t;
}
function Ft(t, n) {
  var a = n[0],
    r = n[1],
    u = n[2],
    e = n[3],
    o = Math.sqrt(a * a + r * r + u * u),
    i = o > 0 ? Math.atan2(o, e) / o : 0;
  return t[0] = a * i, t[1] = r * i, t[2] = u * i, t[3] = .5 * Math.log(a * a + r * r + u * u + e * e), t;
}
function Lt(t, a, r, u) {
  var e,
    o,
    i,
    c,
    h,
    s = a[0],
    M = a[1],
    f = a[2],
    l = a[3],
    v = r[0],
    b = r[1],
    m = r[2],
    d = r[3];
  return (o = s * v + M * b + f * m + l * d) < 0 && (o = -o, v = -v, b = -b, m = -m, d = -d), 1 - o > n ? (e = Math.acos(o), i = Math.sin(e), c = Math.sin((1 - u) * e) / i, h = Math.sin(u * e) / i) : (c = 1 - u, h = u), t[0] = c * s + h * v, t[1] = c * M + h * b, t[2] = c * f + h * m, t[3] = c * l + h * d, t;
}
function Vt(t, n) {
  var a,
    r = n[0] + n[4] + n[8];
  if (r > 0) a = Math.sqrt(r + 1), t[3] = .5 * a, a = .5 / a, t[0] = (n[5] - n[7]) * a, t[1] = (n[6] - n[2]) * a, t[2] = (n[1] - n[3]) * a;else {
    var u = 0;
    n[4] > n[0] && (u = 1), n[8] > n[3 * u + u] && (u = 2);
    var e = (u + 1) % 3,
      o = (u + 2) % 3;
    a = Math.sqrt(n[3 * u + u] - n[3 * e + e] - n[3 * o + o] + 1), t[u] = .5 * a, a = .5 / a, t[3] = (n[3 * e + o] - n[3 * o + e]) * a, t[e] = (n[3 * e + u] + n[3 * u + e]) * a, t[o] = (n[3 * o + u] + n[3 * u + o]) * a;
  }
  return t;
}
var Qt,
  Yt,
  Xt,
  Zt,
  _t,
  Bt,
  Nt = nt,
  kt = at,
  Ut = rt,
  Wt = ut,
  Ct = et,
  Gt = St,
  Ht = ht,
  Jt = bt,
  Kt = mt,
  $t = ft,
  tn = $t,
  nn = lt,
  an = nn,
  rn = vt,
  un = dt,
  en = xt,
  on = (Qt = O(), Yt = D(1, 0, 0), Xt = D(0, 1, 0), function (t, n, a) {
    var r = _(n, a);
    return r < -.999999 ? (B(Qt, Yt, n), H(Qt) < 1e-6 && B(Qt, Xt, n), Z(Qt, Qt), It(t, Qt, Math.PI), t) : r > .999999 ? (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t) : (B(Qt, n, a), t[0] = Qt[0], t[1] = Qt[1], t[2] = Qt[2], t[3] = 1 + r, rn(t, t));
  }),
  cn = (Zt = jt(), _t = jt(), function (t, n, a, r, u, e) {
    return Lt(Zt, n, u, e), Lt(_t, a, r, e), Lt(t, Zt, _t, 2 * e * (1 - e)), t;
  }),
  hn = (Bt = m(), function (t, n, a, r) {
    return Bt[0] = a[0], Bt[3] = a[1], Bt[6] = a[2], Bt[1] = r[0], Bt[4] = r[1], Bt[7] = r[2], Bt[2] = -n[0], Bt[5] = -n[1], Bt[8] = -n[2], rn(t, Vt(t, Bt));
  }),
  sn = Object.freeze({
    create: jt,
    identity: function (t) {
      return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t;
    },
    setAxisAngle: It,
    getAxisAngle: function (t, a) {
      var r = 2 * Math.acos(a[3]),
        u = Math.sin(r / 2);
      return u > n ? (t[0] = a[0] / u, t[1] = a[1] / u, t[2] = a[2] / u) : (t[0] = 1, t[1] = 0, t[2] = 0), r;
    },
    getAngle: function (t, n) {
      var a = Jt(t, n);
      return Math.acos(2 * a * a - 1);
    },
    multiply: St,
    rotateX: Et,
    rotateY: Ot,
    rotateZ: Tt,
    calculateW: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2];
      return t[0] = a, t[1] = r, t[2] = u, t[3] = Math.sqrt(Math.abs(1 - a * a - r * r - u * u)), t;
    },
    exp: Dt,
    ln: Ft,
    pow: function (t, n, a) {
      return Ft(t, n), Ht(t, t, a), Dt(t, t), t;
    },
    slerp: Lt,
    random: function (t) {
      var n = r(),
        a = r(),
        u = r(),
        e = Math.sqrt(1 - n),
        o = Math.sqrt(n);
      return t[0] = e * Math.sin(2 * Math.PI * a), t[1] = e * Math.cos(2 * Math.PI * a), t[2] = o * Math.sin(2 * Math.PI * u), t[3] = o * Math.cos(2 * Math.PI * u), t;
    },
    invert: function (t, n) {
      var a = n[0],
        r = n[1],
        u = n[2],
        e = n[3],
        o = a * a + r * r + u * u + e * e,
        i = o ? 1 / o : 0;
      return t[0] = -a * i, t[1] = -r * i, t[2] = -u * i, t[3] = e * i, t;
    },
    conjugate: function (t, n) {
      return t[0] = -n[0], t[1] = -n[1], t[2] = -n[2], t[3] = n[3], t;
    },
    fromMat3: Vt,
    fromEuler: function (t, n, a, r) {
      var u = .5 * Math.PI / 180;
      n *= u, a *= u, r *= u;
      var e = Math.sin(n),
        o = Math.cos(n),
        i = Math.sin(a),
        c = Math.cos(a),
        h = Math.sin(r),
        s = Math.cos(r);
      return t[0] = e * c * s - o * i * h, t[1] = o * i * s + e * c * h, t[2] = o * c * h - e * i * s, t[3] = o * c * s + e * i * h, t;
    },
    str: function (t) {
      return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
    },
    clone: Nt,
    fromValues: kt,
    copy: Ut,
    set: Wt,
    add: Ct,
    mul: Gt,
    scale: Ht,
    dot: Jt,
    lerp: Kt,
    length: $t,
    len: tn,
    squaredLength: nn,
    sqrLen: an,
    normalize: rn,
    exactEquals: un,
    equals: en,
    rotationTo: on,
    sqlerp: cn,
    setAxes: hn
  });
function Mn(t, n, a) {
  var r = .5 * a[0],
    u = .5 * a[1],
    e = .5 * a[2],
    o = n[0],
    i = n[1],
    c = n[2],
    h = n[3];
  return t[0] = o, t[1] = i, t[2] = c, t[3] = h, t[4] = r * h + u * c - e * i, t[5] = u * h + e * o - r * c, t[6] = e * h + r * i - u * o, t[7] = -r * o - u * i - e * c, t;
}
function fn(t, n) {
  return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t;
}
var ln = Ut;
var vn = Ut;
function bn(t, n, a) {
  var r = n[0],
    u = n[1],
    e = n[2],
    o = n[3],
    i = a[4],
    c = a[5],
    h = a[6],
    s = a[7],
    M = n[4],
    f = n[5],
    l = n[6],
    v = n[7],
    b = a[0],
    m = a[1],
    d = a[2],
    x = a[3];
  return t[0] = r * x + o * b + u * d - e * m, t[1] = u * x + o * m + e * b - r * d, t[2] = e * x + o * d + r * m - u * b, t[3] = o * x - r * b - u * m - e * d, t[4] = r * s + o * i + u * h - e * c + M * x + v * b + f * d - l * m, t[5] = u * s + o * c + e * i - r * h + f * x + v * m + l * b - M * d, t[6] = e * s + o * h + r * c - u * i + l * x + v * d + M * m - f * b, t[7] = o * s - r * i - u * c - e * h + v * x - M * b - f * m - l * d, t;
}
var mn = bn;
var dn = Jt;
var xn = $t,
  pn = xn,
  yn = nn,
  qn = yn;
var gn = Object.freeze({
  create: function () {
    var t = new a(8);
    return a != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0), t[3] = 1, t;
  },
  clone: function (t) {
    var n = new a(8);
    return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n;
  },
  fromValues: function (t, n, r, u, e, o, i, c) {
    var h = new a(8);
    return h[0] = t, h[1] = n, h[2] = r, h[3] = u, h[4] = e, h[5] = o, h[6] = i, h[7] = c, h;
  },
  fromRotationTranslationValues: function (t, n, r, u, e, o, i) {
    var c = new a(8);
    c[0] = t, c[1] = n, c[2] = r, c[3] = u;
    var h = .5 * e,
      s = .5 * o,
      M = .5 * i;
    return c[4] = h * u + s * r - M * n, c[5] = s * u + M * t - h * r, c[6] = M * u + h * n - s * t, c[7] = -h * t - s * n - M * r, c;
  },
  fromRotationTranslation: Mn,
  fromTranslation: function (t, n) {
    return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = .5 * n[0], t[5] = .5 * n[1], t[6] = .5 * n[2], t[7] = 0, t;
  },
  fromRotation: function (t, n) {
    return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t;
  },
  fromMat4: function (t, n) {
    var r = jt();
    P(r, n);
    var u = new a(3);
    return R(u, n), Mn(t, r, u), t;
  },
  copy: fn,
  identity: function (t) {
    return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t;
  },
  set: function (t, n, a, r, u, e, o, i, c) {
    return t[0] = n, t[1] = a, t[2] = r, t[3] = u, t[4] = e, t[5] = o, t[6] = i, t[7] = c, t;
  },
  getReal: ln,
  getDual: function (t, n) {
    return t[0] = n[4], t[1] = n[5], t[2] = n[6], t[3] = n[7], t;
  },
  setReal: vn,
  setDual: function (t, n) {
    return t[4] = n[0], t[5] = n[1], t[6] = n[2], t[7] = n[3], t;
  },
  getTranslation: function (t, n) {
    var a = n[4],
      r = n[5],
      u = n[6],
      e = n[7],
      o = -n[0],
      i = -n[1],
      c = -n[2],
      h = n[3];
    return t[0] = 2 * (a * h + e * o + r * c - u * i), t[1] = 2 * (r * h + e * i + u * o - a * c), t[2] = 2 * (u * h + e * c + a * i - r * o), t;
  },
  translate: function (t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = .5 * a[0],
      c = .5 * a[1],
      h = .5 * a[2],
      s = n[4],
      M = n[5],
      f = n[6],
      l = n[7];
    return t[0] = r, t[1] = u, t[2] = e, t[3] = o, t[4] = o * i + u * h - e * c + s, t[5] = o * c + e * i - r * h + M, t[6] = o * h + r * c - u * i + f, t[7] = -r * i - u * c - e * h + l, t;
  },
  rotateX: function (t, n, a) {
    var r = -n[0],
      u = -n[1],
      e = -n[2],
      o = n[3],
      i = n[4],
      c = n[5],
      h = n[6],
      s = n[7],
      M = i * o + s * r + c * e - h * u,
      f = c * o + s * u + h * r - i * e,
      l = h * o + s * e + i * u - c * r,
      v = s * o - i * r - c * u - h * e;
    return Et(t, n, a), r = t[0], u = t[1], e = t[2], o = t[3], t[4] = M * o + v * r + f * e - l * u, t[5] = f * o + v * u + l * r - M * e, t[6] = l * o + v * e + M * u - f * r, t[7] = v * o - M * r - f * u - l * e, t;
  },
  rotateY: function (t, n, a) {
    var r = -n[0],
      u = -n[1],
      e = -n[2],
      o = n[3],
      i = n[4],
      c = n[5],
      h = n[6],
      s = n[7],
      M = i * o + s * r + c * e - h * u,
      f = c * o + s * u + h * r - i * e,
      l = h * o + s * e + i * u - c * r,
      v = s * o - i * r - c * u - h * e;
    return Ot(t, n, a), r = t[0], u = t[1], e = t[2], o = t[3], t[4] = M * o + v * r + f * e - l * u, t[5] = f * o + v * u + l * r - M * e, t[6] = l * o + v * e + M * u - f * r, t[7] = v * o - M * r - f * u - l * e, t;
  },
  rotateZ: function (t, n, a) {
    var r = -n[0],
      u = -n[1],
      e = -n[2],
      o = n[3],
      i = n[4],
      c = n[5],
      h = n[6],
      s = n[7],
      M = i * o + s * r + c * e - h * u,
      f = c * o + s * u + h * r - i * e,
      l = h * o + s * e + i * u - c * r,
      v = s * o - i * r - c * u - h * e;
    return Tt(t, n, a), r = t[0], u = t[1], e = t[2], o = t[3], t[4] = M * o + v * r + f * e - l * u, t[5] = f * o + v * u + l * r - M * e, t[6] = l * o + v * e + M * u - f * r, t[7] = v * o - M * r - f * u - l * e, t;
  },
  rotateByQuatAppend: function (t, n, a) {
    var r = a[0],
      u = a[1],
      e = a[2],
      o = a[3],
      i = n[0],
      c = n[1],
      h = n[2],
      s = n[3];
    return t[0] = i * o + s * r + c * e - h * u, t[1] = c * o + s * u + h * r - i * e, t[2] = h * o + s * e + i * u - c * r, t[3] = s * o - i * r - c * u - h * e, i = n[4], c = n[5], h = n[6], s = n[7], t[4] = i * o + s * r + c * e - h * u, t[5] = c * o + s * u + h * r - i * e, t[6] = h * o + s * e + i * u - c * r, t[7] = s * o - i * r - c * u - h * e, t;
  },
  rotateByQuatPrepend: function (t, n, a) {
    var r = n[0],
      u = n[1],
      e = n[2],
      o = n[3],
      i = a[0],
      c = a[1],
      h = a[2],
      s = a[3];
    return t[0] = r * s + o * i + u * h - e * c, t[1] = u * s + o * c + e * i - r * h, t[2] = e * s + o * h + r * c - u * i, t[3] = o * s - r * i - u * c - e * h, i = a[4], c = a[5], h = a[6], s = a[7], t[4] = r * s + o * i + u * h - e * c, t[5] = u * s + o * c + e * i - r * h, t[6] = e * s + o * h + r * c - u * i, t[7] = o * s - r * i - u * c - e * h, t;
  },
  rotateAroundAxis: function (t, a, r, u) {
    if (Math.abs(u) < n) return fn(t, a);
    var e = Math.hypot(r[0], r[1], r[2]);
    u *= .5;
    var o = Math.sin(u),
      i = o * r[0] / e,
      c = o * r[1] / e,
      h = o * r[2] / e,
      s = Math.cos(u),
      M = a[0],
      f = a[1],
      l = a[2],
      v = a[3];
    t[0] = M * s + v * i + f * h - l * c, t[1] = f * s + v * c + l * i - M * h, t[2] = l * s + v * h + M * c - f * i, t[3] = v * s - M * i - f * c - l * h;
    var b = a[4],
      m = a[5],
      d = a[6],
      x = a[7];
    return t[4] = b * s + x * i + m * h - d * c, t[5] = m * s + x * c + d * i - b * h, t[6] = d * s + x * h + b * c - m * i, t[7] = x * s - b * i - m * c - d * h, t;
  },
  add: function (t, n, a) {
    return t[0] = n[0] + a[0], t[1] = n[1] + a[1], t[2] = n[2] + a[2], t[3] = n[3] + a[3], t[4] = n[4] + a[4], t[5] = n[5] + a[5], t[6] = n[6] + a[6], t[7] = n[7] + a[7], t;
  },
  multiply: bn,
  mul: mn,
  scale: function (t, n, a) {
    return t[0] = n[0] * a, t[1] = n[1] * a, t[2] = n[2] * a, t[3] = n[3] * a, t[4] = n[4] * a, t[5] = n[5] * a, t[6] = n[6] * a, t[7] = n[7] * a, t;
  },
  dot: dn,
  lerp: function (t, n, a, r) {
    var u = 1 - r;
    return dn(n, a) < 0 && (r = -r), t[0] = n[0] * u + a[0] * r, t[1] = n[1] * u + a[1] * r, t[2] = n[2] * u + a[2] * r, t[3] = n[3] * u + a[3] * r, t[4] = n[4] * u + a[4] * r, t[5] = n[5] * u + a[5] * r, t[6] = n[6] * u + a[6] * r, t[7] = n[7] * u + a[7] * r, t;
  },
  invert: function (t, n) {
    var a = yn(n);
    return t[0] = -n[0] / a, t[1] = -n[1] / a, t[2] = -n[2] / a, t[3] = n[3] / a, t[4] = -n[4] / a, t[5] = -n[5] / a, t[6] = -n[6] / a, t[7] = n[7] / a, t;
  },
  conjugate: function (t, n) {
    return t[0] = -n[0], t[1] = -n[1], t[2] = -n[2], t[3] = n[3], t[4] = -n[4], t[5] = -n[5], t[6] = -n[6], t[7] = n[7], t;
  },
  length: xn,
  len: pn,
  squaredLength: yn,
  sqrLen: qn,
  normalize: function (t, n) {
    var a = yn(n);
    if (a > 0) {
      a = Math.sqrt(a);
      var r = n[0] / a,
        u = n[1] / a,
        e = n[2] / a,
        o = n[3] / a,
        i = n[4],
        c = n[5],
        h = n[6],
        s = n[7],
        M = r * i + u * c + e * h + o * s;
      t[0] = r, t[1] = u, t[2] = e, t[3] = o, t[4] = (i - r * M) / a, t[5] = (c - u * M) / a, t[6] = (h - e * M) / a, t[7] = (s - o * M) / a;
    }
    return t;
  },
  str: function (t) {
    return "quat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ")";
  },
  exactEquals: function (t, n) {
    return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === n[3] && t[4] === n[4] && t[5] === n[5] && t[6] === n[6] && t[7] === n[7];
  },
  equals: function (t, a) {
    var r = t[0],
      u = t[1],
      e = t[2],
      o = t[3],
      i = t[4],
      c = t[5],
      h = t[6],
      s = t[7],
      M = a[0],
      f = a[1],
      l = a[2],
      v = a[3],
      b = a[4],
      m = a[5],
      d = a[6],
      x = a[7];
    return Math.abs(r - M) <= n * Math.max(1, Math.abs(r), Math.abs(M)) && Math.abs(u - f) <= n * Math.max(1, Math.abs(u), Math.abs(f)) && Math.abs(e - l) <= n * Math.max(1, Math.abs(e), Math.abs(l)) && Math.abs(o - v) <= n * Math.max(1, Math.abs(o), Math.abs(v)) && Math.abs(i - b) <= n * Math.max(1, Math.abs(i), Math.abs(b)) && Math.abs(c - m) <= n * Math.max(1, Math.abs(c), Math.abs(m)) && Math.abs(h - d) <= n * Math.max(1, Math.abs(h), Math.abs(d)) && Math.abs(s - x) <= n * Math.max(1, Math.abs(s), Math.abs(x));
  }
});
function An() {
  var t = new a(2);
  return a != Float32Array && (t[0] = 0, t[1] = 0), t;
}
function wn(t, n, a) {
  return t[0] = n[0] - a[0], t[1] = n[1] - a[1], t;
}
function Rn(t, n, a) {
  return t[0] = n[0] * a[0], t[1] = n[1] * a[1], t;
}
function zn(t, n, a) {
  return t[0] = n[0] / a[0], t[1] = n[1] / a[1], t;
}
function Pn(t, n) {
  var a = n[0] - t[0],
    r = n[1] - t[1];
  return Math.hypot(a, r);
}
function jn(t, n) {
  var a = n[0] - t[0],
    r = n[1] - t[1];
  return a * a + r * r;
}
function In(t) {
  var n = t[0],
    a = t[1];
  return Math.hypot(n, a);
}
function Sn(t) {
  var n = t[0],
    a = t[1];
  return n * n + a * a;
}
var En = In,
  On = wn,
  Tn = Rn,
  Dn = zn,
  Fn = Pn,
  Ln = jn,
  Vn = Sn,
  Qn = function () {
    var t = An();
    return function (n, a, r, u, e, o) {
      var i, c;
      for (a || (a = 2), r || (r = 0), c = u ? Math.min(u * a + r, n.length) : n.length, i = r; i < c; i += a) t[0] = n[i], t[1] = n[i + 1], e(t, t, o), n[i] = t[0], n[i + 1] = t[1];
      return n;
    };
  }(),
  Yn = Object.freeze({
    create: An,
    clone: function (t) {
      var n = new a(2);
      return n[0] = t[0], n[1] = t[1], n;
    },
    fromValues: function (t, n) {
      var r = new a(2);
      return r[0] = t, r[1] = n, r;
    },
    copy: function (t, n) {
      return t[0] = n[0], t[1] = n[1], t;
    },
    set: function (t, n, a) {
      return t[0] = n, t[1] = a, t;
    },
    add: function (t, n, a) {
      return t[0] = n[0] + a[0], t[1] = n[1] + a[1], t;
    },
    subtract: wn,
    multiply: Rn,
    divide: zn,
    ceil: function (t, n) {
      return t[0] = Math.ceil(n[0]), t[1] = Math.ceil(n[1]), t;
    },
    floor: function (t, n) {
      return t[0] = Math.floor(n[0]), t[1] = Math.floor(n[1]), t;
    },
    min: function (t, n, a) {
      return t[0] = Math.min(n[0], a[0]), t[1] = Math.min(n[1], a[1]), t;
    },
    max: function (t, n, a) {
      return t[0] = Math.max(n[0], a[0]), t[1] = Math.max(n[1], a[1]), t;
    },
    round: function (t, n) {
      return t[0] = Math.round(n[0]), t[1] = Math.round(n[1]), t;
    },
    scale: function (t, n, a) {
      return t[0] = n[0] * a, t[1] = n[1] * a, t;
    },
    scaleAndAdd: function (t, n, a, r) {
      return t[0] = n[0] + a[0] * r, t[1] = n[1] + a[1] * r, t;
    },
    distance: Pn,
    squaredDistance: jn,
    length: In,
    squaredLength: Sn,
    negate: function (t, n) {
      return t[0] = -n[0], t[1] = -n[1], t;
    },
    inverse: function (t, n) {
      return t[0] = 1 / n[0], t[1] = 1 / n[1], t;
    },
    normalize: function (t, n) {
      var a = n[0],
        r = n[1],
        u = a * a + r * r;
      return u > 0 && (u = 1 / Math.sqrt(u)), t[0] = n[0] * u, t[1] = n[1] * u, t;
    },
    dot: function (t, n) {
      return t[0] * n[0] + t[1] * n[1];
    },
    cross: function (t, n, a) {
      var r = n[0] * a[1] - n[1] * a[0];
      return t[0] = t[1] = 0, t[2] = r, t;
    },
    lerp: function (t, n, a, r) {
      var u = n[0],
        e = n[1];
      return t[0] = u + r * (a[0] - u), t[1] = e + r * (a[1] - e), t;
    },
    random: function (t, n) {
      n = n || 1;
      var a = 2 * r() * Math.PI;
      return t[0] = Math.cos(a) * n, t[1] = Math.sin(a) * n, t;
    },
    transformMat2: function (t, n, a) {
      var r = n[0],
        u = n[1];
      return t[0] = a[0] * r + a[2] * u, t[1] = a[1] * r + a[3] * u, t;
    },
    transformMat2d: function (t, n, a) {
      var r = n[0],
        u = n[1];
      return t[0] = a[0] * r + a[2] * u + a[4], t[1] = a[1] * r + a[3] * u + a[5], t;
    },
    transformMat3: function (t, n, a) {
      var r = n[0],
        u = n[1];
      return t[0] = a[0] * r + a[3] * u + a[6], t[1] = a[1] * r + a[4] * u + a[7], t;
    },
    transformMat4: function (t, n, a) {
      var r = n[0],
        u = n[1];
      return t[0] = a[0] * r + a[4] * u + a[12], t[1] = a[1] * r + a[5] * u + a[13], t;
    },
    rotate: function (t, n, a, r) {
      var u = n[0] - a[0],
        e = n[1] - a[1],
        o = Math.sin(r),
        i = Math.cos(r);
      return t[0] = u * i - e * o + a[0], t[1] = u * o + e * i + a[1], t;
    },
    angle: function (t, n) {
      var a = t[0],
        r = t[1],
        u = n[0],
        e = n[1],
        o = a * a + r * r;
      o > 0 && (o = 1 / Math.sqrt(o));
      var i = u * u + e * e;
      i > 0 && (i = 1 / Math.sqrt(i));
      var c = (a * u + r * e) * o * i;
      return c > 1 ? 0 : c < -1 ? Math.PI : Math.acos(c);
    },
    zero: function (t) {
      return t[0] = 0, t[1] = 0, t;
    },
    str: function (t) {
      return "vec2(" + t[0] + ", " + t[1] + ")";
    },
    exactEquals: function (t, n) {
      return t[0] === n[0] && t[1] === n[1];
    },
    equals: function (t, a) {
      var r = t[0],
        u = t[1],
        e = a[0],
        o = a[1];
      return Math.abs(r - e) <= n * Math.max(1, Math.abs(r), Math.abs(e)) && Math.abs(u - o) <= n * Math.max(1, Math.abs(u), Math.abs(o));
    },
    len: En,
    sub: On,
    mul: Tn,
    div: Dn,
    dist: Fn,
    sqrDist: Ln,
    sqrLen: Vn,
    forEach: Qn
  });
let t = {};
t.glMatrix = e, t.mat2 = s, t.mat2d = b, t.mat3 = q, t.mat4 = E, t.quat = sn, t.quat2 = gn, t.vec2 = Yn, t.vec3 = $, t.vec4 = Pt, Object.defineProperty(t, "__esModule", {
  value: !0
});

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */

let _UUID = 1;
class UUID {
  constructor() {
    this._UUID = _UUID++;
  }
  static getNextUUID() {
    return _UUID++;
  }
  updateUUID() {
    this._UUID = _UUID++;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.11 18:20:56
 *
 */

let TypeSize = {
  'float32': 1 * Float32Array.BYTES_PER_ELEMENT,
  'float32x2': 2 * Float32Array.BYTES_PER_ELEMENT,
  "float32x3": 3 * Float32Array.BYTES_PER_ELEMENT,
  'float32x4': 4 * Float32Array.BYTES_PER_ELEMENT,
  'mat2': 4 * Float32Array.BYTES_PER_ELEMENT,
  'mat3': 12 * Float32Array.BYTES_PER_ELEMENT,
  /* use 4*3 */
  'mat4': 16 * Float32Array.BYTES_PER_ELEMENT
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */
var UTILColor = {
  rgb2hex: (red, green, blue) => {
    let rgb = blue | green << 8 | red << 16;
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
  },
  regHex: function () {
    const reg = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    return function (hex) {
      return reg.test(hex);
    };
  }(),
  hexToRGB_ZeroToOne: function (hex) {
    let t0, t1;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      t1 = [];
      t0 = hex.substring(1).split('');
      if (t0.length === 3) t0 = [t0[0], t0[0], t0[1], t0[1], t0[2], t0[2]];
      t0 = '0x' + t0.join('');
      t1[0] = (t0 >> 16 & 255) / 255;
      t1[1] = (t0 >> 8 & 255) / 255;
      t1[2] = (t0 & 255) / 255;
      return t1;
    } else UTIL.throwFunc('RedGLUtil.hexToRGB_ZeroToOne : 잘못된 hex값입니다.', hex);
  }
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.23 14:37:36
 *
 */

let clamp = function (value, min, max) {
  return Math.max(min, Math.min(max, value));
};
var UTILMath = {
  clamp: clamp,
  nextHighestPowerOfTwo: function () {
    let i;
    return function (v) {
      --v;
      for (i = 1; i < 32; i <<= 1) v = v | v >> i;
      return v + 1;
    };
  }(),
  quaternionToRotationMat4: function (q, m) {
    let x = q[0];
    let y = q[1];
    let z = q[2];
    let w = q[3];
    let x2 = x + x,
      y2 = y + y,
      z2 = z + z;
    let xx = x * x2,
      xy = x * y2,
      xz = x * z2;
    let yy = y * y2,
      yz = y * z2,
      zz = z * z2;
    let wx = w * x2,
      wy = w * y2,
      wz = w * z2;
    m[0] = 1 - (yy + zz);
    m[4] = xy - wz;
    m[8] = xz + wy;
    m[1] = xy + wz;
    m[5] = 1 - (xx + zz);
    m[9] = yz - wx;
    m[2] = xz - wy;
    m[6] = yz + wx;
    m[10] = 1 - (xx + yy);
    // last column
    m[3] = 0;
    m[7] = 0;
    m[11] = 0;
    // bottom row
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return m;
  },
  mat4ToEuler: function (mat, dest, order) {
    dest = dest || [0, 0, 0];
    order = order || 'XYZ';
    // Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    let m11 = mat[0],
      m12 = mat[4],
      m13 = mat[8];
    let m21 = mat[1],
      m22 = mat[5],
      m23 = mat[9];
    let m31 = mat[2],
      m32 = mat[6],
      m33 = mat[10];
    if (order === 'XYZ') {
      dest[1] = Math.asin(clamp(m13, -1, 1));
      if (Math.abs(m13) < 0.99999) {
        dest[0] = Math.atan2(-m23, m33);
        dest[2] = Math.atan2(-m12, m11);
      } else {
        dest[0] = Math.atan2(m32, m22);
        dest[2] = 0;
      }
    } else if (order === 'YXZ') {
      dest[0] = Math.asin(-clamp(m23, -1, 1));
      if (Math.abs(m23) < 0.99999) {
        dest[1] = Math.atan2(m13, m33);
        dest[2] = Math.atan2(m21, m22);
      } else {
        dest[1] = Math.atan2(-m31, m11);
        dest[2] = 0;
      }
    } else if (order === 'ZXY') {
      dest[0] = Math.asin(clamp(m32, -1, 1));
      if (Math.abs(m32) < 0.99999) {
        dest[1] = Math.atan2(-m31, m33);
        dest[2] = Math.atan2(-m12, m22);
      } else {
        dest[1] = 0;
        dest[2] = Math.atan2(m21, m11);
      }
    } else if (order === 'ZYX') {
      dest[1] = Math.asin(-clamp(m31, -1, 1));
      if (Math.abs(m31) < 0.99999) {
        dest[0] = Math.atan2(m32, m33);
        dest[2] = Math.atan2(m21, m11);
      } else {
        dest[0] = 0;
        dest[2] = Math.atan2(-m12, m22);
      }
    } else if (order === 'YZX') {
      dest[2] = Math.asin(clamp(m21, -1, 1));
      if (Math.abs(m21) < 0.99999) {
        dest[0] = Math.atan2(-m23, m22);
        dest[1] = Math.atan2(-m31, m11);
      } else {
        dest[0] = 0;
        dest[1] = Math.atan2(m13, m33);
      }
    } else if (order === 'XZY') {
      dest[2] = Math.asin(-clamp(m12, -1, 1));
      if (Math.abs(m12) < 0.99999) {
        dest[0] = Math.atan2(m32, m22);
        dest[1] = Math.atan2(m13, m11);
      } else {
        dest[0] = Math.atan2(-m23, m33);
        dest[1] = 0;
      }
    }
    return dest;
  },
  calculateNormals: function (vertexArray, indexArray) {
    //TODO: 이함수 정리
    let i, j;
    let x = 0;
    let y = 1;
    let z = 2;
    let result = [];
    for (i = 0; i < vertexArray.length; i = i + 3) {
      //for each vertex, initialize normal x, normal y, normal z
      result[i + x] = 0.0;
      result[i + y] = 0.0;
      result[i + z] = 0.0;
    }
    for (i = 0; i < indexArray.length; i = i + 3) {
      //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
      let v1 = [];
      let v2 = [];
      let normal = [];
      let index0, index1, index2, indexJ;
      index0 = 3 * indexArray[i];
      index1 = 3 * indexArray[i + 1];
      index2 = 3 * indexArray[i + 2];
      //p2 - p1
      v1[x] = vertexArray[index2 + x] - vertexArray[index1 + x];
      v1[y] = vertexArray[index2 + y] - vertexArray[index1 + y];
      v1[z] = vertexArray[index2 + z] - vertexArray[index1 + z];
      //p0 - p1
      v2[x] = vertexArray[index0 + x] - vertexArray[index1 + x];
      v2[y] = vertexArray[index0 + y] - vertexArray[index1 + y];
      v2[z] = vertexArray[index0 + z] - vertexArray[index1 + z];
      //cross product by Sarrus Rule
      normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
      normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
      normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
      for (j = 0; j < 3; j++) {
        //update the normals of that triangle: sum of vectors
        indexJ = 3 * indexArray[i + j];
        result[indexJ + x] = result[indexJ + x] + normal[x];
        result[indexJ + y] = result[indexJ + y] + normal[y];
        result[indexJ + z] = result[indexJ + z] + normal[z];
      }
    }
    //normalize the result
    for (i = 0; i < vertexArray.length; i = i + 3) {
      //the increment here is because each vertex occurs with an offset of 3 in the array (due to x, y, z contiguous values)
      let nn = [];
      nn[x] = result[i + x];
      nn[y] = result[i + y];
      nn[z] = result[i + z];
      let len = Math.sqrt(nn[x] * nn[x] + nn[y] * nn[y] + nn[z] * nn[z]);
      if (len === 0) len = 1.0;
      nn[x] = nn[x] / len;
      nn[y] = nn[y] / len;
      nn[z] = nn[z] / len;
      result[i + x] = nn[x];
      result[i + y] = nn[y];
      result[i + z] = nn[z];
    }
    return result;
  }
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:3:14
 *
 */
const screenToWorld = (_ => {
  let z, w;
  let invW;
  let point = [0, 0, 0];
  let pointMTX = t.mat4.create();
  let invViewProjection = t.mat4.create();
  let resultMTX;
  let camera;
  return (x, y, view) => {
    x = 2.0 * x / view.viewRect[2] - 1;
    y = -2.0 * y / view.viewRect[3] + 1;
    z = 1;
    camera = view.camera;
    t.mat4.multiply(invViewProjection, view.projectionMatrix, camera.matrix);
    resultMTX = t.mat4.clone(invViewProjection);
    t.mat4.invert(resultMTX, resultMTX);
    point = [x, y, z];
    t.mat4.identity(pointMTX);
    t.mat4.translate(pointMTX, pointMTX, point);
    t.mat4.multiply(resultMTX, resultMTX, pointMTX);
    point[0] = resultMTX[12];
    point[1] = resultMTX[13];
    point[2] = resultMTX[14];
    w = invViewProjection[12] * x + invViewProjection[13] * y + invViewProjection[15]; // required for perspective divide
    if (w !== 0) {
      invW = 1 / w;
      point[0] /= invW;
      point[1] /= invW;
      point[2] /= invW;
      point[0] = point[0] + camera.x;
      point[1] = point[1] + camera.y;
      point[2] = point[2] + camera.z;
    }
    return point;
  };
})();
const getFlatChildList = list => {
  function flattenDeep(input) {
    console.log('input', input);
    const stack = [...input];
    const res = [];
    while (stack.length) {
      // 스택에서 값을 pop
      const next = stack.shift();
      res.push(next);
      stack.push(...next._children);
    }
    return res;
  }
  let result = flattenDeep(list);
  result = result.reverse();
  return result;
};
var UTIL = {
  throwFunc: function () {
    throw 'Error : ' + Array.prototype.slice.call(arguments).join(' ');
  },
  ...UTILColor,
  ...UTILMath,
  getFlatChildList,
  screenToWorld
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 20:56:47
 *
 */
class UniformBufferDescriptor {
  constructor(redStruct = [], usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST) {
    if (!Array.isArray(redStruct)) UTIL.throwFunc(`${this.constructor.name} - only allow Array Instance. / inputValue : ${redStruct} { type : ${typeof redStruct} }`);
    this.redStruct = JSON.parse(JSON.stringify(redStruct));
    this.redStructOffsetMap = {};
    let offset = 0;
    let FLOAT4_SIZE = TypeSize.float32x4;
    this.redStruct.map(v => {
      console.log(v);
      if (!v.valueName) UTIL.throwFunc(`${this.constructor.name} - need valueName / inputValue : ${v.valueName} { type : ${typeof v.valueName} }`);
      if (!v.hasOwnProperty('size')) UTIL.throwFunc(`${this.constructor.name} - need size / inputValue : ${v.size} { type : ${typeof v.size} }`);
      if (v.size <= FLOAT4_SIZE) {
        let t0 = Math.floor(offset / FLOAT4_SIZE);
        let t1 = Math.floor((offset + v.size - 1) / FLOAT4_SIZE);
        if (t0 != t1) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
        v.offset = offset;
        // console.log(v.valueName, '결정된 오프셋', offset)
        offset += v.size;
      } else {
        if (offset % FLOAT4_SIZE) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
        v.offset = offset;
        offset += v.size;
      }
      this.redStructOffsetMap[v['valueName']] = v.offset;
      v._UUID = v.valueName + '_' + UUID.getNextUUID();
    });
    let t0 = offset % FLOAT4_SIZE;
    this.size = this.redStruct.length ? offset + (t0 ? FLOAT4_SIZE - t0 : 0) : FLOAT4_SIZE;
    this.usage = usage;
    console.log(this);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */
var _getBrowserInfo = /*#__PURE__*/new WeakMap();
class DetectorGPU {
  constructor() {
    _defineProperty(this, "redGPUContext", void 0);
    _defineProperty(this, "detectGPU", _ => {
      if (RedGPUContext.useDebugConsole) console.log('TODO - 추후 GPU 디텍팅을 해야한다.');
    });
    _classPrivateFieldInitSpec(this, _getBrowserInfo, {
      writable: true,
      value: _ => {
        let navi = window.navigator,
          agent = navi.userAgent.toLowerCase(),
          platform = navi.platform.toLowerCase(),
          app = navi.appVersion.toLowerCase(),
          device = 'pc',
          isMobile = 0,
          browser,
          bv,
          os,
          osv,
          i,
          t0,
          ie = _ => {
            if (agent.includes('edge')) {
              if (agent.includes('iemobile')) os = 'winMobile';
              return browser = 'edge', bv = /edge\/([\d]+)/.exec(agent)[1];
            } else {
              if (!agent.includes('msie') && !agent.includes('trident')) return;
              if (agent.includes('iemobile')) os = 'winMobile';
              return browser = 'ie', bv = agent.includes('msie 7') && agent.includes('trident') ? -1 : !agent.includes('msie') ? 11 : parseFloat(/msie ([\d]+)/.exec(agent)[1]);
            }
          },
          whale = _ => {
            return agent.includes('whale') ? (bv = parseFloat(/whale\/([\d]+)/.exec(agent)[1]), browser = 'whale') : 0;
          },
          chrome = _ => {
            if (!agent.includes(i = 'chrome') && !agent.includes(i = 'crios')) return;
            return browser = 'chrome', bv = parseFloat((i === 'chrome' ? /chrome\/([\d]+)/ : /crios\/([\d]+)/).exec(agent)[1]);
          },
          firefox = _ => {
            return agent.includes('firefox') ? (browser = 'firefox', bv = parseFloat(/firefox\/([\d]+)/.exec(agent)[1])) : 0;
          },
          safari = _ => {
            return agent.includes('safari') ? (browser = 'safari', bv = parseFloat(/safari\/([\d]+)/.exec(agent)[1])) : 0;
          },
          opera = _ => {
            let i;
            return !agent.includes(i = 'opera') && !agent.includes(i = 'opr') ? 0 : (browser = 'opera', bv = i === 'opera' ? parseFloat(/version\/([\d]+)/.exec(agent)[1]) : parseFloat(/opr\/([\d]+)/.exec(agent)[1]));
          },
          naver = _ => {
            return agent.includes('naver') ? browser = 'naver' : 0;
          };
        if (agent.includes('android')) {
          browser = os = 'android', device = agent.includes('mobile') ? (browser += 'Tablet', 'tablet') : 'mobile', osv = (i = /android ([\d.]+)/.exec(agent)) ? (i = i[1].split('.'), parseFloat(i[0] + '.' + i[1])) : 0, isMobile = 1, whale() || naver() || opera() || chrome() || firefox() || (bv = i = /safari\/([\d.]+)/.exec(agent) ? parseFloat(i[1]) : 0);
        } else if (agent.includes(i = 'ipad') || agent.includes(i = 'iphone')) {
          device = i === 'ipad' ? 'tablet' : 'mobile', browser = os = i, osv = (i = /os ([\d_]+)/.exec(agent)) ? (i = i[1].split('_'), parseFloat(i[0] + '.' + i[1])) : 0, isMobile = 1, whale() || naver() || opera() || chrome() || firefox() || (bv = (i = /mobile\/([\S]+)/.exec(agent)) ? parseFloat(i[1]) : 0);
        } else if (platform.includes('win')) {
          for (i in t0 = {
            '5.1': 'xp',
            '6.0': 'vista',
            '6.1': '7',
            '6.2': '8',
            '6.3': '8.1',
            '10.0': '10'
          }) {
            if (agent.includes('windows nt ' + i)) {
              osv = t0[i];
              break;
            }
          }
          os = 'win', ie() || whale() || opera() || chrome() || firefox() || safari();
        } else if (platform.includes('mac')) {
          os = 'mac', i = /os x ([\d._]+)/.exec(agent)[1].replace('_', '.').split('.'), osv = parseFloat(i[0] + '.' + i[1]), whale() || opera() || chrome() || firefox() || safari();
        } else os = app.includes('x11') ? 'unix' : app.includes('linux') ? 'linux' : 0, whale() || chrome() || firefox();
        for (i in t0 = {
          device: device,
          isMobile: isMobile,
          browser: browser,
          browserVer: bv,
          os: os,
          osVer: osv,
          down: isMobile ? 'touchstart' : 'mousedown',
          move: isMobile ? 'touchmove' : 'mousemove',
          up: isMobile ? 'touchend' : 'mouseup',
          click: 'click',
          over: 'mouseover',
          out: 'mouseout'
        }) if (t0.hasOwnProperty(i)) this[i] = t0[i];
      }
    });
    _classPrivateFieldGet(this, _getBrowserInfo).call(this);
    if (this.browser === 'ie') console.table = console.log;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.29 22:10:29
 *
 */
class ShareGLSL {}
_defineProperty(ShareGLSL, "MESH_UNIFORM_POOL_NUM", 25);
_defineProperty(ShareGLSL, "GLSL_VERSION", '#version 460');
_defineProperty(ShareGLSL, "MAX_DIRECTIONAL_LIGHT", 3);
_defineProperty(ShareGLSL, "MAX_POINT_LIGHT", 10);
_defineProperty(ShareGLSL, "MAX_SPOT_LIGHT", 1);
_defineProperty(ShareGLSL, "SET_INDEX_ComputeUniforms", 0);
_defineProperty(ShareGLSL, "SET_INDEX_SystemUniforms_vertex", 0);
_defineProperty(ShareGLSL, "SET_INDEX_SystemUniforms_fragment", 1);
_defineProperty(ShareGLSL, "SET_INDEX_MeshUniforms", 2);
_defineProperty(ShareGLSL, "SET_INDEX_VertexUniforms", 3);
_defineProperty(ShareGLSL, "SET_INDEX_FragmentUniforms", 3);
_defineProperty(ShareGLSL, "GLSL_SystemUniforms_vertex", {
  systemUniforms: `
		const float TRUTHY = 1.0;
		layout( set =  ${ShareGLSL.SET_INDEX_SystemUniforms_vertex}, binding = 0 ) uniform SystemUniforms {
	        mat4 perspectiveMTX;
	        mat4 cameraMTX;
	        vec2 resolution;
	        float time;
	    } systemUniforms;
	    `,
  meshUniforms: `
		layout( set = ${ShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshMatrixUniforms {
	        mat4 modelMatrix[${ShareGLSL.MESH_UNIFORM_POOL_NUM}];
	        mat4 normalMatrix[${ShareGLSL.MESH_UNIFORM_POOL_NUM}];
	    } meshMatrixUniforms;
	    layout( set = ${ShareGLSL.SET_INDEX_MeshUniforms}, binding = 1 ) uniform MeshUniformIndex {
	        float index;
	        float mouseColorID;
	        float sumOpacity;
	    } meshUniforms;
		`,
  calcDisplacement: (vNormal = 'vNormal', displacementFlowSpeedX = 'displacementFlowSpeedX', displacementFlowSpeedY = 'displacementFlowSpeedY', displacementPower = 'displacementPower', targetUV = 'targetUV', targetDisplacementTexture = 'targetDisplacementTexture', targetSampler = 'targetSampler') => {
    return `
        normalize(${vNormal}) 
        * texture(
            sampler2D(${targetDisplacementTexture}, ${targetSampler}), 
            ${targetUV} + vec2(
                ${displacementFlowSpeedX} * (systemUniforms.time/1000.0),
                ${displacementFlowSpeedY} * (systemUniforms.time/1000.0)
            )
        ).x * ${displacementPower};
		`;
  },
  getSprite3DMatrix: `
		mat4 getSprite3DMatrix(mat4 cameraMTX, mat4 mvMatrix){
			mat4 tMTX = cameraMTX * mvMatrix;
			tMTX[0][0] = mvMatrix[0][0], tMTX[0][1] = 0.0, tMTX[0][2] = 0.0;
			tMTX[1][0] = 0.0, tMTX[1][1] = mvMatrix[1][1], tMTX[1][2] = 0.0;
			tMTX[2][0] = 0.0, tMTX[2][1] = 0.0, tMTX[2][2] = mvMatrix[2][2];
			return tMTX;
		}
		`
});
_defineProperty(ShareGLSL, "GLSL_SystemUniforms_fragment", {
  systemUniforms: `
		const float TRUTHY = 1.0;
		const int MAX_DIRECTIONAL_LIGHT = ${ShareGLSL.MAX_DIRECTIONAL_LIGHT};
		const int MAX_POINT_LIGHT =  ${ShareGLSL.MAX_POINT_LIGHT};
		const int MAX_SPOT_LIGHT =  ${ShareGLSL.MAX_SPOT_LIGHT};
		struct DirectionalLight {
	        vec4 color;
	        vec3 position;
	        float intensity;
		};
		struct PointLight {
	        vec4 color;
	        vec3 position;
	        float intensity;
	        float radius;
		};
		struct AmbientLight {
	        vec4 color;
	        float intensity;
		};
		struct SpotLight {
	        vec4 color;
	        vec3 position;
	        float intensity;
	        float cutoff;
	        float exponent;
		};
		layout( set =  ${ShareGLSL.SET_INDEX_SystemUniforms_fragment}, binding = 0 ) uniform SystemUniforms {
	        float directionalLightCount;
	        float pointLightCount;
	        float spotLightCount;
	        DirectionalLight directionalLightList[MAX_DIRECTIONAL_LIGHT];
	        PointLight pointLightList[MAX_POINT_LIGHT];
	        AmbientLight ambientLight;	        
	        SpotLight spotLightList[MAX_SPOT_LIGHT];
	        vec2 resolution;
	        vec3 cameraPosition;
        } systemUniforms;
        /////////////////////////////////////////////////////////////////////////////
        vec4 la = systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity;
        vec4 calcDirectionalLight(
            vec4 diffuseColor,
            vec3 N,		
			float loopNum,
			DirectionalLight[MAX_DIRECTIONAL_LIGHT] lightList,
			float shininess,
			float specularPower,
			vec4 specularColor,
			float specularTextureValue
		){
		    vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
		    vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);
		    
		    vec3 L;	
		    vec4 lightColor;
		    
		    float lambertTerm;
		    float intensity;
		    float specular;
		    		    
		    DirectionalLight lightInfo;
		    for(int i = 0; i< loopNum; i++){
		        lightInfo = lightList[i];
			    L = normalize(-lightInfo.position);	
			    lightColor = lightInfo.color;
			    lambertTerm = dot(N,-L);
			    intensity = lightInfo.intensity;
			    if(lambertTerm > 0.0){
					ld += lightColor * diffuseColor * lambertTerm * intensity;
					specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower * specularTextureValue;
					ls +=  specularColor * specular * intensity ;
			    }
		    }
		    return ld + ls;
		}
		/////////////////////////////////////////////////////////////////////////////
		vec4 calcPointLight(
            vec4 diffuseColor,
            vec3 N,		
			float loopNum,
			PointLight[MAX_POINT_LIGHT] lightList,
			float shininess,
			float specularPower,
			vec4 specularColor,
			float specularTextureValue,
			vec3 vVertexPosition
		){
			vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
		    vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);
		    
		    vec3 L;	
		    vec4 lightColor;
		    
		    float lambertTerm;
		    float intensity;
		    float specular;
		  
		    PointLight lightInfo;
		    float distanceLength ;
		    float attenuation;
		    for(int i = 0; i< loopNum; i++){
		        lightInfo = lightList[i];
		        L = -lightInfo.position + vVertexPosition;
			    distanceLength = abs(length(L));
			    if(lightInfo.radius> distanceLength){
			        L = normalize(L);	
              lightColor = lightInfo.color;
              lambertTerm = dot(N,-L);
              intensity = lightInfo.intensity;
              if(lambertTerm > 0.0){
                  attenuation = clamp(1.0 - distanceLength*distanceLength/(lightInfo.radius*lightInfo.radius), 0.0, 1.0); 
                  attenuation *= attenuation;
            	    ld += lightColor* diffuseColor * lambertTerm * intensity * attenuation;
            	 
                  specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower * specularTextureValue;
                  ls +=  specularColor * specular * intensity * attenuation;
              }
			    }
		    }
		    return ld + ls;
		}
		vec4 calcSpotLight(
            vec4 diffuseColor,
            vec3 N,		
			float loopNum,
			SpotLight[MAX_SPOT_LIGHT] lightList,
			float shininess,
			float specularPower,
			vec4 specularColor,
			float specularTextureValue,
			vec3 vVertexPosition
		){
			vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
		    vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);
		    
		    vec3 L;	
		    vec4 lightColor;
		    
		    float lambertTerm;
		    float intensity;
		    float specular;
		  
		    SpotLight lightInfo;
	        float distanceLength ;
		    float attenuation;
		    for(int i = 0; i< loopNum; i++){
		        lightInfo = lightList[i];
		        L = -lightInfo.position + vVertexPosition;
			    distanceLength = abs(length(L));
			    vec3 spotDirection = vec3(0.1,-1,0);
			    L = normalize(L);	
			    lambertTerm = dot(N,-L);
				float spotEffect = dot(normalize(spotDirection),L);
                lightColor = lightInfo.color;
		        float limit = 10;
		        float inLight = step(cos(limit * 3.141592653589793/180), spotEffect);
                float light = inLight * spotEffect;
			    if(lambertTerm > 0 && spotEffect > lightInfo.cutoff ){			     
			        if(spotEffect > cos(limit * 3.141592653589793/180) ){
				        spotEffect = pow(spotEffect, lightInfo.exponent);
		                attenuation = spotEffect * light ;
					    intensity = lightInfo.intensity;					 
				     
						ld += lightColor * diffuseColor * intensity * attenuation;
						specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower * specularTextureValue;
						ls +=  specularColor * specular * intensity * attenuation ;
					}
			    }
		    }
		    return ld + ls;
		}
		/////////////////////////////////////////////////////////////////////////////
		vec3 getFlatNormal(vec3 vertexPosition){
			vec3 dx = dFdx(vertexPosition.xyz);
			vec3 dy = dFdy(vertexPosition.xyz);
			return normalize(cross(normalize(dy), normalize(dx)));
		}
		`,
  perturb_normal: `
		vec3 perturb_normal( vec3 N, vec3 V, vec2 texcoord, vec3 normalColor , float normalPower)
		{	   
			vec3 map = normalColor;
			map =  map * 255./127. - 128./127.;
			map.xy *= -normalPower;
			mat3 TBN = cotangent_frame(N, V, texcoord);
			return normalize(TBN * map);
		}
		`,
  cotangent_frame: `
		mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv)
		{
		
			vec3 dp1 = dFdx( p );
			vec3 dp2 = dFdy( p );
			vec2 duv1 = dFdx( uv );
			vec2 duv2 = dFdy( uv );
			
			vec3 dp2perp = cross( dp2, N );
			vec3 dp1perp = cross( N, dp1 );
			vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
			vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;
			
			float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );
			return mat3( T * invmax, B * invmax, N );
		}
		`
});

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */

const TABLE = {};
class Sampler {
  constructor(redGPUContext, option = {}) {
    option = {
      magFilter: option['magFilter'] || "linear",
      minFilter: option['minFilter'] || "linear",
      mipmapFilter: option['mipmapFilter'] || "linear",
      addressModeU: option['addressModeU'] || "repeat",
      addressModeV: option['addressModeV'] || "repeat",
      addressModeW: option['addressModeW'] || "repeat"
    };
    this.string = JSON.stringify(option);
    if (TABLE[this.string]) return TABLE[this.string];else this.GPUSampler = redGPUContext.device.createSampler(option);
    TABLE[this.string] = this;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:47:56
 *
 */
let redGPUContextList = new Set();
let setGlobalResizeEvent = function () {
  const resize = _ => {
    for (const redGPUContext of redGPUContextList) {
      redGPUContext.setSize();
      configure(redGPUContext);
    }
  };
  window.addEventListener('resize', resize);
  requestAnimationFrame(e => {
    resize();
  });
};
let configure = function (redGPUContext) {
  const swapChainDescriptor = {
    device: redGPUContext.device,
    format: redGPUContext.swapChainFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
    // size: {
    //   width: redGPUContext.canvas.clientWidth * window.devicePixelRatio,
    //   height: redGPUContext.canvas.clientHeight * window.devicePixelRatio,
    // },
    alphaMode: 'premultiplied'
  };
  console.log(swapChainDescriptor);
  if (redGPUContext.useDebugConsole) console.log('swapChainDescriptor', swapChainDescriptor);
  return redGPUContext.context.configure(swapChainDescriptor);
};
let glslangModule;
let glslang;
let checkGlslang = function () {
  return new Promise(async resolve => {
    if (!glslang) {
      glslangModule = await import( /* webpackIgnore: true */'https://unpkg.com/@webgpu/glslang@0.0.15/dist/web-devel/glslang.js');
      glslang = await glslangModule.default();
      glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'vertex');
      glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'fragment');
      resolve();
    } else {
      glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'vertex');
      glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'fragment');
      resolve();
    }
  });
};
let twgslLib;
let checkTwgsl = function () {
  return new Promise(async resolve => {
    if (!twgslLib) {
      await import( /* webpackIgnore: true */'https://preview.babylonjs.com/twgsl/twgsl.js');
      // await import(/* webpackIgnore: true */ 'https://redcamel.github.io/RedGPU/libs/twgsl.js');
      console.log('twgsl', twgsl);
      twgslLib = twgsl;
      resolve();
    } else {
      resolve();
    }
  });
};
var _width = /*#__PURE__*/new WeakMap();
var _height = /*#__PURE__*/new WeakMap();
var _detector = /*#__PURE__*/new WeakMap();
class RedGPUContext {
  constructor(canvas, initFunc) {
    _classPrivateFieldInitSpec(this, _width, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(this, _height, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(this, _detector, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "viewList", []);
    checkGlslang().then(_ => checkTwgsl()).then(_ => {
      return twgslLib('https://preview.babylonjs.com/twgsl/twgsl.wasm');
      // return twgslLib('https://redcamel.github.io/RedGPU/libs/twgsl.wasm')
    }).then(twgsl => {
      console.log(twgsl, twgsl);
      console.log('glslang', glslang);
      console.log(this);
      _classPrivateFieldSet(this, _detector, new DetectorGPU(this));
      let state = true;
      if (navigator.gpu) {
        navigator.gpu.requestAdapter({
          powerPreference: "high-performance"
        }).then(adapter => {
          adapter.requestDevice({
            // extensions: ["anisotropic-filtering"]
            // limits:{
            // 	maxUniformBufferBindingSize : 16384
            // }
          }).then(device => {
            this.adapter = adapter;
            this.twgsl = twgsl;
            this.glslang = glslang;
            this.canvas = canvas;
            this.context = canvas.getContext('webgpu');
            this.device = device;
            this.swapChainFormat = navigator.gpu.getPreferredCanvasFormat(this.adapter);
            this.state = {
              Geometry: new Map(),
              Buffer: {
                vertexBuffer: new Map(),
                indexBuffer: new Map()
              },
              emptySampler: new Sampler(this),
              emptyTextureView: device.createTexture({
                size: {
                  width: 1,
                  height: 1,
                  depthOrArrayLayers: 1
                },
                format: 'r8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING
              }).createView(),
              emptyCubeTextureView: device.createTexture({
                size: {
                  width: 1,
                  height: 1,
                  depthOrArrayLayers: 6
                },
                dimension: '2d',
                // arrayLayerCount: 6,
                mipLevelCount: 1,
                sampleCount: 1,
                format: 'r8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING
              }).createView({
                format: 'r8unorm',
                dimension: 'cube',
                aspect: 'all',
                baseMipLevel: 0,
                mipLevelCount: 1,
                baseArrayLayer: 0,
                arrayLayerCount: 6
              })
            };
            /////
            [_classPrivateFieldGet(this, _detector).click, _classPrivateFieldGet(this, _detector).move, _classPrivateFieldGet(this, _detector).down, _classPrivateFieldGet(this, _detector).up].forEach(v => {
              let tXkey, tYkey;
              tXkey = 'offsetX';
              tYkey = 'offsetY';
              let mouseX, mouseY;
              this.canvas.addEventListener(v, e => {
                e.preventDefault();
                let tEvent;
                if (_classPrivateFieldGet(this, _detector).isMobile) {
                  if (e.changedTouches[0]) {
                    tEvent = {
                      type: e.type,
                      x: e.changedTouches[0].clientX,
                      y: e.changedTouches[0].clientY,
                      nativeEvent: e
                    };
                    mouseX = e.changedTouches[0].clientX;
                    mouseY = e.changedTouches[0].clientY;
                  }
                } else {
                  tEvent = {
                    type: e.type,
                    x: e[tXkey],
                    y: e[tYkey],
                    nativeEvent: e
                  };
                  mouseX = e[tXkey];
                  mouseY = e[tYkey];
                }
                let i, tView;
                i = this.viewList.length;
                while (i--) {
                  tView = this.viewList[i];
                  tView.mouseEventChecker.mouseEventInfo.push(tEvent);
                  tView.mouseX = mouseX - tView.viewRect[0];
                  tView.mouseY = mouseY - tView.viewRect[1];
                }
              }, false);
            });
            /////
            _classPrivateFieldGet(this, _detector).detectGPU();
            ///////
            this.setSize('100%', '100%');
            if (!redGPUContextList.size) setGlobalResizeEvent();
            redGPUContextList.add(this);
            initFunc.call(this, true);
            ////////////////////////////////////////////////////////
            // new ColorPhongMaterial(this);
            // new ColorMaterial(this);
            // new GridMaterial(this);
            // new SkyBoxMaterial(this);
            // new StandardMaterial(this);
            // new BitmapMaterial(this);
            // new EnvironmentMaterial(this);
            // new ColorPhongTextureMaterial(this);
            // new LineMaterial(this);
            // new TextMaterial(this);
            // new SpriteSheetMaterial(this);
            // new PBRMaterial_System(this)
            ////////////////////////////////////////////////////////
          });
        }).catch(error => {
          state = false;
          initFunc(false, error);
        });
      } else {
        initFunc(state = false, 'navigate.gpu is null');
      }
    });
  }
  get detector() {
    return _classPrivateFieldGet(this, _detector);
  }
  addView(redView) {
    this.viewList.push(redView);
    redView.resetTexture(this);
  }
  removeView(redView) {
    if (this.viewList.includes(redView)) this.viewList.splice(redView, 1);
  }
  setSize(w = _classPrivateFieldGet(this, _width), h = _classPrivateFieldGet(this, _height)) {
    _classPrivateFieldSet(this, _width, w);
    _classPrivateFieldSet(this, _height, h);
    let tW, tH;
    let rect = document.body.getBoundingClientRect();
    rect.height = window.innerHeight;
    // console.log('rect',rect)
    if (typeof w != 'number' && w.includes('%')) tW = parseInt(+rect.width * w.replace('%', '') / 100);else tW = w;
    if (typeof h != 'number' && h.includes('%')) tH = parseInt(+rect.height * h.replace('%', '') / 100);else tH = h;
    if (tW < 1) tW = 1;
    if (tH < 1) tH = 1;
    this.canvas.width = tW;
    this.canvas.height = tH;
    this.canvas.style.width = tW + 'px';
    this.canvas.style.height = tH + 'px';
    this.viewList.forEach(redView => {
      redView.setSize();
      redView.setLocation();
    });
    if (RedGPUContext.useDebugConsole) console.log(`setSize - input : ${w},${h} / result : ${tW}, ${tH}`);
  }
}
_defineProperty(RedGPUContext, "useDebugConsole", false);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */
class UniformBuffer extends UUID {
  constructor(redGPUContext) {
    super();
    _defineProperty(this, "redGPUContext", void 0);
    _defineProperty(this, "GPUBuffer", void 0);
    _defineProperty(this, "uniformBufferDescriptor", void 0);
    if (!(redGPUContext instanceof RedGPUContext)) UTIL.throwFunc(`${this.constructor.name} - only allow redGPUContext Instance.- inputValue : ${redGPUContext} { type : ${typeof redGPUContext} }`);
    this.redGPUContext = redGPUContext;
  }
  setBuffer(uniformBufferDescriptor) {
    if (!(uniformBufferDescriptor instanceof UniformBufferDescriptor)) UTIL.throwFunc(`${this.constructor.name} - only allow UniformBufferDescriptor Instance.- inputValue : ${uniformBufferDescriptor} { type : ${typeof uniformBufferDescriptor} }`);
    if (this.GPUBuffer) this.GPUBuffer.destroy();
    this.GPUBuffer = this.redGPUContext.device.createBuffer(uniformBufferDescriptor);
    this.float32Array = new Float32Array(uniformBufferDescriptor.size / Float32Array.BYTES_PER_ELEMENT);
    this.uniformBufferDescriptor = uniformBufferDescriptor;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
class DisplayContainer extends UUID {
  constructor() {
    super();
    _defineProperty(this, "_parent", void 0);
    _defineProperty(this, "_children", []);
  }
  get children() {
    return this._children;
  }
  set children(value) {
    this._children = value;
  }
  addChild(...child) {
    child.forEach(v => {
      v instanceof BaseObject3D || UTIL.throwFunc(`addChild - only allow BaseObject3D Instance. - inputValue : ${v} { type : ${typeof v} }`);
      if (this._children.includes(v)) UTIL.throwFunc(`${v} : Already registered object. - inputValue : ${v} { type : ${typeof v} }`);else {
        v._parent = this.directionalLightList ? null : this;
        this._children.push(v);
      }
    });
    DisplayContainer.needFlatListUpdate = true;
  }
  addChildAt(child, index) {
    child instanceof BaseObject3D || UTIL.throwFunc(`addChildAt - only allow BaseObject3D Instance. - inputValue : ${child}, ${index} { type : ${typeof child}, ${typeof index} }`);
    if (this._children.includes(child)) this.removeChild(child);
    if (this._children.length < index) index = this._children.length;
    if (index != undefined) this._children.splice(index, 0, child);else {
      child._parent = this.directionalLightList ? null : this;
      this._children.push(child);
    }
    DisplayContainer.needFlatListUpdate = true;
  }
  removeChild(child) {
    if (this._children.includes(child)) {
      child._parent = null;
      this._children.splice(this._children.indexOf(child), 1);
    } else UTIL.throwFunc(`removeChild - Attempt to delete an object that does not exist. - inputValue : ${child} { type : ${typeof child} }`);
    DisplayContainer.needFlatListUpdate = true;
  }
  removeChildAt(index) {
    if (this._children[index]) {
      this._children[index]._parent = null;
      this._children.splice(index, 1);
    } else UTIL.throwFunc(`removeChildAt - No object at index. - inputValue : ${index} { type : ${typeof index} }`);
    DisplayContainer.needFlatListUpdate = true;
  }
  removeChildAll() {
    let i = this._children.length;
    while (i--) this._children[i]._parent = null;
    this._children.length = 0;
    DisplayContainer.needFlatListUpdate = true;
  }
  getChildAt(index) {
    return this._children[index];
  }
  getChildIndex(child) {
    this._children.indexOf(child);
  }
  numChildren() {
    return this._children.length;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.30 19:35:31
 *
 */
var _targetMesh = /*#__PURE__*/new WeakMap();
class PipelineBasic extends UUID {
  constructor(redGPUContext, targetMesh) {
    super();
    _defineProperty(this, "redGPUContext", void 0);
    _classPrivateFieldInitSpec(this, _targetMesh, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "GPURenderPipeline", void 0);
    this.redGPUContext = redGPUContext;
    _classPrivateFieldSet(this, _targetMesh, targetMesh);
    this.GPURenderPipeline = null;
  }
  update(redGPUContext, redView) {
    console.log('navigator.gpu.getPreferredCanvasFormat(redGPUContext.adapter)', navigator.gpu.getPreferredCanvasFormat(redGPUContext.adapter));
    let targetMesh = _classPrivateFieldGet(this, _targetMesh);
    const device = redGPUContext.device;
    const descriptor = {
      // 레이아웃은 재질이 알고있으니 들고옴
      layout: device.createPipelineLayout({
        bindGroupLayouts: [redView.systemUniformInfo_vertex.GPUBindGroupLayout, redView.systemUniformInfo_fragment.GPUBindGroupLayout, targetMesh.GPUBindGroupLayout, targetMesh._material.GPUBindGroupLayout]
      }),
      // 버텍스와 프레그먼트는 재질에서 들고온다.
      vertex: {
        module: targetMesh._material.vShaderModule.GPUShaderModule,
        entryPoint: 'main',
        buffers: targetMesh._geometry.vertexState.vertexBuffers
      },
      fragment: {
        module: targetMesh._material.fShaderModule.GPUShaderModule,
        entryPoint: 'main',
        targets: [{
          format: navigator.gpu.getPreferredCanvasFormat(redGPUContext.adapter),
          // format: 'rgba8unorm',
          blend: {
            color: {
              srcFactor: "src-alpha",
              dstFactor: "one-minus-src-alpha",
              operation: "add"
            },
            alpha: {
              srcFactor: "src-alpha",
              dstFactor: "one",
              operation: "add"
            }
            // color: {
            //   srcFactor: "src-alpha",
            //   dstFactor: "one-minus-src-alpha",
            //   operation: "add"
            // },
            // alpha: {
            //   srcFactor: "src-alpha",
            //   dstFactor: "one-minus-src-alpha",
            //   operation: "add"
            // }
          }
        }, {
          format: 'rgba16float'
          // format: navigator.gpu.getPreferredCanvasFormat(redGPUContext.adapter),
        }]
      },

      // 버텍스 상태는 지오메트리가 알고있음으로 들고옴
      // vertexState: targetMesh._geometry.vertexState,
      // 컬러모드 지정하고

      primitive: {
        topology: targetMesh._primitiveTopology,
        cullMode: targetMesh._cullMode,
        frontFace: 'ccw'
      },
      depthStencil: {
        format: "depth24plus-stencil8",
        depthWriteEnabled: targetMesh._depthWriteEnabled,
        depthCompare: targetMesh._depthCompare
      },
      multisample: {
        count: 4
      }
      //alphaToCoverageEnabled : true // alphaToCoverageEnabled isn't supported (yet)
    };

    if (targetMesh._primitiveTopology === 'line-strip' || targetMesh._primitiveTopology === 'triangle-strip') {
      descriptor.primitive.stripIndexFormat = 'uint32';
    }

    // console.time('update - ' + this._UUID)
    this.GPURenderPipeline = device.createRenderPipeline(descriptor);
    // console.log('update - ', targetMesh._material.fShaderModule.currentKey)
    // console.timeEnd('update - ' + this._UUID)
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.11 18:20:56
 *
 */
var _effectList = /*#__PURE__*/new WeakMap();
class PostEffect {
  constructor(redGPUContext) {
    _classPrivateFieldInitSpec(this, _effectList, {
      writable: true,
      value: []
    });
  }
  get effectList() {
    return _classPrivateFieldGet(this, _effectList);
  }
  addEffect(v) {
    _classPrivateFieldGet(this, _effectList).push(v);
  }
  removeEffect(v) {
    if (_classPrivateFieldGet(this, _effectList).includes(v)) _classPrivateFieldGet(this, _effectList).splice(_classPrivateFieldGet(this, _effectList).indexOf(v), 1);else UTIL.throwFunc(`removeEffect - Attempt to delete an object that does not exist. - inputValue : ${v} { type : ${typeof v} }`);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 16:13:31
 *
 */
let fireEvent = function (fireList) {
  if (fireList.length) {
    // console.log(fireList)
    let v = fireList.shift();
    v['info'][v['type']].call(v['info']['target'], {
      target: v['info']['target'],
      type: 'out'
    });
  }
};
var _currentPickedArrayBuffer = /*#__PURE__*/new WeakMap();
var _currentPickedMouseID = /*#__PURE__*/new WeakMap();
var _fireList = /*#__PURE__*/new WeakMap();
var _redView = /*#__PURE__*/new WeakMap();
var _prevInfo = /*#__PURE__*/new WeakMap();
var _mouseEventInfo = /*#__PURE__*/new WeakMap();
class MouseEventChecker extends UUID {
  constructor(redView) {
    super();
    _classPrivateFieldInitSpec(this, _currentPickedArrayBuffer, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _currentPickedMouseID, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _fireList, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _redView, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _prevInfo, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _mouseEventInfo, {
      writable: true,
      value: []
    });
    _defineProperty(this, "checkMouseEvent", function (redGPUContext, pickedMouseID) {
      let i, len;
      i = 0;
      len = _classPrivateFieldGet(this, _mouseEventInfo).length;
      // console.log(this.#mouseEventInfo.length,this.#mouseEventInfo)
      for (i; i < len; i++) {
        let canvasMouseEvent = _classPrivateFieldGet(this, _mouseEventInfo)[i];
        // 마우스 이벤트 체크
        let meshEventData;
        if (pickedMouseID) meshEventData = MouseEventChecker.mouseMAP[pickedMouseID];
        let tEventType;
        if (meshEventData) {
          if (canvasMouseEvent['type'] == redGPUContext.detector.down) {
            tEventType = 'down';
            console.log('다운', tEventType, meshEventData);
            if (tEventType && meshEventData[tEventType]) {
              meshEventData[tEventType].call(meshEventData['target'], {
                target: meshEventData['target'],
                type: tEventType,
                nativeEvent: canvasMouseEvent.nativeEvent
              });
            }
          }
          if (canvasMouseEvent['type'] == redGPUContext.detector.up) {
            tEventType = 'up';
            // console.log('업');
            if (tEventType && meshEventData[tEventType]) {
              meshEventData[tEventType].call(meshEventData['target'], {
                target: meshEventData['target'],
                type: tEventType,
                nativeEvent: canvasMouseEvent.nativeEvent
              });
            }
          }
          if (_classPrivateFieldGet(this, _prevInfo) && _classPrivateFieldGet(this, _prevInfo) != meshEventData) {
            tEventType = 'out';
            // console.log('아웃');
            if (tEventType && _classPrivateFieldGet(this, _prevInfo)[tEventType]) {
              _classPrivateFieldGet(this, _prevInfo)[tEventType].call(_classPrivateFieldGet(this, _prevInfo)['target'], {
                target: _classPrivateFieldGet(this, _prevInfo)['target'],
                type: tEventType
              });
            }
          }
          if (_classPrivateFieldGet(this, _prevInfo) != meshEventData) {
            tEventType = 'over';
            if (tEventType && meshEventData[tEventType]) {
              meshEventData[tEventType].call(meshEventData['target'], {
                target: meshEventData['target'],
                type: tEventType,
                nativeEvent: canvasMouseEvent.nativeEvent
              });
            }
            // console.log('오버')
          }

          _classPrivateFieldSet(this, _prevInfo, meshEventData);
        } else {
          tEventType = 'out';
          if (_classPrivateFieldGet(this, _prevInfo) && _classPrivateFieldGet(this, _prevInfo)[tEventType]) {
            // console.log('아웃');
            _classPrivateFieldGet(this, _fireList).push({
              info: _classPrivateFieldGet(this, _prevInfo),
              type: tEventType,
              nativeEvent: canvasMouseEvent.nativeEvent
            });
          }
          _classPrivateFieldSet(this, _prevInfo, null);
        }
        fireEvent(_classPrivateFieldGet(this, _fireList));
      }
      if (_classPrivateFieldGet(this, _prevInfo)) this.cursorState = 'pointer';else this.cursorState = 'default';
      _classPrivateFieldGet(this, _mouseEventInfo).length = 0;
      // console.log(this.#mouseEventInfo)
    });
    _defineProperty(this, "check", redGPUContext => {
      if (!_classPrivateFieldGet(this, _currentPickedArrayBuffer)) {
        _classPrivateFieldSet(this, _currentPickedArrayBuffer, _classPrivateFieldGet(this, _redView).readPixelArrayBuffer(redGPUContext, _classPrivateFieldGet(this, _redView), _classPrivateFieldGet(this, _redView).baseAttachment_mouseColorID_depth_ResolveTarget, _classPrivateFieldGet(this, _redView).mouseX, _classPrivateFieldGet(this, _redView).mouseY));
        _classPrivateFieldGet(this, _currentPickedArrayBuffer).then(arrayBuffer => {
          const {
            Float16Array
          } = float16;
          _classPrivateFieldSet(this, _currentPickedArrayBuffer, null);
          _classPrivateFieldSet(this, _currentPickedMouseID, Math.round(new Float16Array(arrayBuffer || new ArrayBuffer(256))[0]));
          console.log(_classPrivateFieldGet(this, _currentPickedMouseID));
          this.checkMouseEvent(redGPUContext, _classPrivateFieldGet(this, _currentPickedMouseID));
        });
      }
      return this.cursorState;
    });
    _classPrivateFieldSet(this, _redView, redView);
  }
  get mouseEventInfo() {
    return _classPrivateFieldGet(this, _mouseEventInfo);
  }
}
/**
 * Minified by jsDelivr using Terser v5.10.0.
 * Original file: /npm/@petamoriken/float16@3.6.3/browser/float16.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/*! @petamoriken/float16 v3.6.3 | MIT License - https://git.io/float16 */
_defineProperty(MouseEventChecker, "mouseMAP", {});
const float16 = function (t) {

  const n = "This constructor is not a subclass of Float16Array",
    r = "The constructor property value is not an object",
    e = "Attempting to access detached ArrayBuffer",
    o = "Cannot convert undefined or null to object",
    i = "Cannot convert a BigInt value to a number",
    s = "Cannot mix BigInt and other types, use explicit conversions",
    u = "@@iterator property is not callable",
    f = "Reduce of empty array with no initial value",
    c = "Offset is out of bounds";
  function l(t) {
    return (n, ...r) => a(t, n, r);
  }
  function h(t, n) {
    return l(g(t, n).get);
  }
  const {
      apply: a,
      construct: y,
      defineProperty: w,
      get: p,
      getOwnPropertyDescriptor: g,
      getPrototypeOf: d,
      has: v,
      ownKeys: b,
      set: A,
      setPrototypeOf: _
    } = Reflect,
    E = Proxy,
    T = Number,
    {
      isFinite: m,
      isNaN: O
    } = T,
    {
      iterator: S,
      species: j,
      toStringTag: x,
      for: P
    } = Symbol,
    F = Object,
    {
      create: B,
      defineProperty: I,
      freeze: L,
      is: M
    } = F,
    R = F.prototype,
    k = R.__lookupGetter__ ? l(R.__lookupGetter__) : (t, n) => {
      if (null == t) throw Pt(o);
      let r = F(t);
      do {
        const t = g(r, n);
        if (void 0 !== t) return N(t, "get") ? t.get : void 0;
      } while (null !== (r = d(r)));
    },
    N = F.hasOwn || l(R.hasOwnProperty),
    U = Array,
    D = U.isArray,
    W = U.prototype,
    C = l(W.join),
    G = l(W.push),
    V = l(W.toLocaleString),
    Y = W[S],
    z = l(Y),
    K = Math.trunc,
    X = ArrayBuffer,
    q = X.isView,
    H = X.prototype,
    J = l(H.slice),
    Q = h(H, "byteLength"),
    Z = "undefined" != typeof SharedArrayBuffer ? SharedArrayBuffer : null,
    $ = Z && h(Z.prototype, "byteLength"),
    tt = d(Uint8Array),
    nt = tt.from,
    rt = tt.prototype,
    et = rt[S],
    ot = l(rt.keys),
    it = l(rt.values),
    st = l(rt.entries),
    ut = l(rt.set),
    ft = l(rt.reverse),
    ct = l(rt.fill),
    lt = l(rt.copyWithin),
    ht = l(rt.sort),
    at = l(rt.slice),
    yt = l(rt.subarray),
    wt = h(rt, "buffer"),
    pt = h(rt, "byteOffset"),
    gt = h(rt, "length"),
    dt = h(rt, x),
    vt = Uint16Array,
    bt = (...t) => a(nt, vt, t),
    At = Uint32Array,
    _t = Float32Array,
    Et = d([][S]()),
    Tt = l(Et.next),
    mt = l(function* () {}().next),
    Ot = d(Et),
    St = DataView.prototype,
    jt = l(St.getUint16),
    xt = l(St.setUint16),
    Pt = TypeError,
    Ft = RangeError,
    Bt = WeakSet,
    It = Bt.prototype,
    Lt = l(It.add),
    Mt = l(It.has),
    Rt = WeakMap,
    kt = Rt.prototype,
    Nt = l(kt.get),
    Ut = l(kt.has),
    Dt = l(kt.set),
    Wt = new Rt(),
    Ct = B(null, {
      next: {
        value: function () {
          const t = Nt(Wt, this);
          return Tt(t);
        }
      },
      [S]: {
        value: function () {
          return this;
        }
      }
    });
  function Gt(t) {
    if (t[S] === Y) return t;
    const n = B(Ct);
    return Dt(Wt, n, z(t)), n;
  }
  const Vt = new Rt(),
    Yt = B(Ot, {
      next: {
        value: function () {
          const t = Nt(Vt, this);
          return mt(t);
        },
        writable: !0,
        configurable: !0
      }
    });
  for (const t of b(Et)) "next" !== t && I(Yt, t, g(Et, t));
  function zt(t) {
    const n = B(Yt);
    return Dt(Vt, n, t), n;
  }
  function Kt(t) {
    return null !== t && "object" == typeof t || "function" == typeof t;
  }
  function Xt(t) {
    return null !== t && "object" == typeof t;
  }
  function qt(t) {
    return void 0 !== dt(t);
  }
  function Ht(t) {
    const n = dt(t);
    return "BigInt64Array" === n || "BigUint64Array" === n;
  }
  function Jt(t) {
    if (null === Z) return !1;
    try {
      return $(t), !0;
    } catch (t) {
      return !1;
    }
  }
  function Qt(t) {
    if (!D(t)) return !1;
    if (t[S] === Y) return !0;
    return "Array Iterator" === t[S]()[x];
  }
  function Zt(t) {
    if ("string" != typeof t) return !1;
    const n = T(t);
    return t === n + "" && !!m(n) && n === K(n);
  }
  const $t = P("__Float16Array__");
  const tn = new X(4),
    nn = new _t(tn),
    rn = new At(tn),
    en = new At(512),
    on = new At(512);
  for (let t = 0; t < 256; ++t) {
    const n = t - 127;
    n < -27 ? (en[t] = 0, en[256 | t] = 32768, on[t] = 24, on[256 | t] = 24) : n < -14 ? (en[t] = 1024 >> -n - 14, en[256 | t] = 1024 >> -n - 14 | 32768, on[t] = -n - 1, on[256 | t] = -n - 1) : n <= 15 ? (en[t] = n + 15 << 10, en[256 | t] = n + 15 << 10 | 32768, on[t] = 13, on[256 | t] = 13) : n < 128 ? (en[t] = 31744, en[256 | t] = 64512, on[t] = 24, on[256 | t] = 24) : (en[t] = 31744, en[256 | t] = 64512, on[t] = 13, on[256 | t] = 13);
  }
  function sn(t) {
    nn[0] = t;
    const n = rn[0],
      r = n >> 23 & 511;
    return en[r] + ((8388607 & n) >> on[r]);
  }
  const un = new At(2048),
    fn = new At(64),
    cn = new At(64);
  for (let t = 1; t < 1024; ++t) {
    let n = t << 13,
      r = 0;
    for (; 0 == (8388608 & n);) n <<= 1, r -= 8388608;
    n &= -8388609, r += 947912704, un[t] = n | r;
  }
  for (let t = 1024; t < 2048; ++t) un[t] = 939524096 + (t - 1024 << 13);
  for (let t = 1; t < 31; ++t) fn[t] = t << 23;
  fn[31] = 1199570944, fn[32] = 2147483648;
  for (let t = 33; t < 63; ++t) fn[t] = 2147483648 + (t - 32 << 23);
  fn[63] = 3347054592;
  for (let t = 1; t < 64; ++t) 32 !== t && (cn[t] = 1024);
  function ln(t) {
    const n = t >> 10;
    return rn[0] = un[cn[n] + (1023 & t)] + fn[n], nn[0];
  }
  const hn = T.MAX_SAFE_INTEGER;
  function an(t) {
    if ("bigint" == typeof t) throw Pt(i);
    const n = T(t);
    return O(n) || 0 === n ? 0 : K(n);
  }
  function yn(t) {
    const n = an(t);
    return n < 0 ? 0 : n < hn ? n : hn;
  }
  function wn(t, n) {
    if (!Kt(t)) throw Pt("This is not an object");
    const e = t.constructor;
    if (void 0 === e) return n;
    if (!Kt(e)) throw Pt(r);
    const o = e[j];
    return null == o ? n : o;
  }
  function pn(t) {
    if (Jt(t)) return !1;
    try {
      return J(t, 0, 0), !1;
    } catch (t) {}
    return !0;
  }
  function gn(t, n) {
    const r = O(t),
      e = O(n);
    if (r && e) return 0;
    if (r) return 1;
    if (e) return -1;
    if (t < n) return -1;
    if (t > n) return 1;
    if (0 === t && 0 === n) {
      const r = M(t, 0),
        e = M(n, 0);
      if (!r && e) return -1;
      if (r && !e) return 1;
    }
    return 0;
  }
  const dn = new Rt();
  function vn(t) {
    return Ut(dn, t) || !q(t) && function (t) {
      if (!Xt(t)) return !1;
      const n = d(t);
      if (!Xt(n)) return !1;
      const e = n.constructor;
      if (void 0 === e) return !1;
      if (!Kt(e)) throw Pt(r);
      return v(e, $t);
    }(t);
  }
  function bn(t) {
    if (!vn(t)) throw Pt("This is not a Float16Array object");
  }
  function An(t, n) {
    const r = vn(t),
      e = qt(t);
    if (!r && !e) throw Pt("Species constructor didn't return TypedArray object");
    if ("number" == typeof n) {
      let e;
      if (r) {
        const n = _n(t);
        e = gt(n);
      } else e = gt(t);
      if (e < n) throw Pt("Derived constructor created TypedArray object which was too small length");
    }
    if (Ht(t)) throw Pt(s);
  }
  function _n(t) {
    const n = Nt(dn, t);
    if (void 0 !== n) {
      if (pn(wt(n))) throw Pt(e);
      return n;
    }
    const r = t.buffer;
    if (pn(r)) throw Pt(e);
    const o = y(On, [r, t.byteOffset, t.length], t.constructor);
    return Nt(dn, o);
  }
  function En(t) {
    const n = gt(t),
      r = [];
    for (let e = 0; e < n; ++e) r[e] = ln(t[e]);
    return r;
  }
  const Tn = new Bt();
  for (const t of b(rt)) {
    if (t === x) continue;
    const n = g(rt, t);
    N(n, "get") && "function" == typeof n.get && Lt(Tn, n.get);
  }
  const mn = L({
    get: (t, n, r) => Zt(n) && N(t, n) ? ln(p(t, n)) : Mt(Tn, k(t, n)) ? p(t, n) : p(t, n, r),
    set: (t, n, r, e) => Zt(n) && N(t, n) ? A(t, n, sn(r)) : A(t, n, r, e),
    getOwnPropertyDescriptor(t, n) {
      if (Zt(n) && N(t, n)) {
        const r = g(t, n);
        return r.value = ln(r.value), r;
      }
      return g(t, n);
    },
    defineProperty: (t, n, r) => Zt(n) && N(t, n) && N(r, "value") ? (r.value = sn(r.value), w(t, n, r)) : w(t, n, r)
  });
  class On {
    constructor(t, n, r) {
      let o;
      if (vn(t)) o = y(vt, [_n(t)], new.target);else if (Kt(t) && !function (t) {
        try {
          return Q(t), !0;
        } catch (t) {
          return !1;
        }
      }(t)) {
        let n, r;
        if (qt(t)) {
          n = t, r = gt(t);
          const i = wt(t),
            u = Jt(i) ? X : wn(i, X);
          if (pn(i)) throw Pt(e);
          if (Ht(t)) throw Pt(s);
          const f = new u(2 * r);
          o = y(vt, [f], new.target);
        } else {
          const e = t[S];
          if (null != e && "function" != typeof e) throw Pt(u);
          null != e ? Qt(t) ? (n = t, r = t.length) : (n = [...t], r = n.length) : (n = t, r = yn(n.length)), o = y(vt, [r], new.target);
        }
        for (let t = 0; t < r; ++t) o[t] = sn(n[t]);
      } else o = y(vt, arguments, new.target);
      const i = new E(o, mn);
      return Dt(dn, i, o), i;
    }
    static from(t, ...r) {
      const e = this;
      if (!v(e, $t)) throw Pt(n);
      if (e === On) {
        if (vn(t) && 0 === r.length) {
          const n = _n(t),
            r = new vt(wt(n), pt(n), gt(n));
          return new On(wt(at(r)));
        }
        if (0 === r.length) return new On(wt(bt(t, sn)));
        const n = r[0],
          e = r[1];
        return new On(wt(bt(t, function (t, ...r) {
          return sn(a(n, this, [t, ...Gt(r)]));
        }, e)));
      }
      let i, s;
      const f = t[S];
      if (null != f && "function" != typeof f) throw Pt(u);
      if (null != f) Qt(t) ? (i = t, s = t.length) : !qt(c = t) || c[S] !== et && "Array Iterator" !== c[S]()[x] ? (i = [...t], s = i.length) : (i = t, s = gt(t));else {
        if (null == t) throw Pt(o);
        i = F(t), s = yn(i.length);
      }
      var c;
      const l = new e(s);
      if (0 === r.length) for (let t = 0; t < s; ++t) l[t] = i[t];else {
        const t = r[0],
          n = r[1];
        for (let r = 0; r < s; ++r) l[r] = a(t, n, [i[r], r]);
      }
      return l;
    }
    static of(...t) {
      const r = this;
      if (!v(r, $t)) throw Pt(n);
      const e = t.length;
      if (r === On) {
        const n = new On(e),
          r = _n(n);
        for (let n = 0; n < e; ++n) r[n] = sn(t[n]);
        return n;
      }
      const o = new r(e);
      for (let n = 0; n < e; ++n) o[n] = t[n];
      return o;
    }
    keys() {
      bn(this);
      const t = _n(this);
      return ot(t);
    }
    values() {
      bn(this);
      const t = _n(this);
      return zt(function* () {
        for (const n of it(t)) yield ln(n);
      }());
    }
    entries() {
      bn(this);
      const t = _n(this);
      return zt(function* () {
        for (const [n, r] of st(t)) yield [n, ln(r)];
      }());
    }
    at(t) {
      bn(this);
      const n = _n(this),
        r = gt(n),
        e = an(t),
        o = e >= 0 ? e : r + e;
      if (!(o < 0 || o >= r)) return ln(n[o]);
    }
    map(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r),
        o = n[0],
        i = wn(r, On);
      if (i === On) {
        const n = new On(e),
          i = _n(n);
        for (let n = 0; n < e; ++n) {
          const e = ln(r[n]);
          i[n] = sn(a(t, o, [e, n, this]));
        }
        return n;
      }
      const s = new i(e);
      An(s, e);
      for (let n = 0; n < e; ++n) {
        const e = ln(r[n]);
        s[n] = a(t, o, [e, n, this]);
      }
      return s;
    }
    filter(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r),
        o = n[0],
        i = [];
      for (let n = 0; n < e; ++n) {
        const e = ln(r[n]);
        a(t, o, [e, n, this]) && G(i, e);
      }
      const s = new (wn(r, On))(i);
      return An(s), s;
    }
    reduce(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r);
      if (0 === e && 0 === n.length) throw Pt(f);
      let o, i;
      0 === n.length ? (o = ln(r[0]), i = 1) : (o = n[0], i = 0);
      for (let n = i; n < e; ++n) o = t(o, ln(r[n]), n, this);
      return o;
    }
    reduceRight(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r);
      if (0 === e && 0 === n.length) throw Pt(f);
      let o, i;
      0 === n.length ? (o = ln(r[e - 1]), i = e - 2) : (o = n[0], i = e - 1);
      for (let n = i; n >= 0; --n) o = t(o, ln(r[n]), n, this);
      return o;
    }
    forEach(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r),
        o = n[0];
      for (let n = 0; n < e; ++n) a(t, o, [ln(r[n]), n, this]);
    }
    find(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r),
        o = n[0];
      for (let n = 0; n < e; ++n) {
        const e = ln(r[n]);
        if (a(t, o, [e, n, this])) return e;
      }
    }
    findIndex(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r),
        o = n[0];
      for (let n = 0; n < e; ++n) {
        const e = ln(r[n]);
        if (a(t, o, [e, n, this])) return n;
      }
      return -1;
    }
    findLast(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r),
        o = n[0];
      for (let n = e - 1; n >= 0; --n) {
        const e = ln(r[n]);
        if (a(t, o, [e, n, this])) return e;
      }
    }
    findLastIndex(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r),
        o = n[0];
      for (let n = e - 1; n >= 0; --n) {
        const e = ln(r[n]);
        if (a(t, o, [e, n, this])) return n;
      }
      return -1;
    }
    every(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r),
        o = n[0];
      for (let n = 0; n < e; ++n) if (!a(t, o, [ln(r[n]), n, this])) return !1;
      return !0;
    }
    some(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r),
        o = n[0];
      for (let n = 0; n < e; ++n) if (a(t, o, [ln(r[n]), n, this])) return !0;
      return !1;
    }
    set(t, ...n) {
      bn(this);
      const r = _n(this),
        i = an(n[0]);
      if (i < 0) throw Ft(c);
      if (null == t) throw Pt(o);
      if (Ht(t)) throw Pt(s);
      if (vn(t)) return ut(_n(this), _n(t), i);
      if (qt(t)) {
        if (pn(wt(t))) throw Pt(e);
      }
      const u = gt(r),
        f = F(t),
        l = yn(f.length);
      if (i === 1 / 0 || l + i > u) throw Ft(c);
      for (let t = 0; t < l; ++t) r[t + i] = sn(f[t]);
    }
    reverse() {
      bn(this);
      const t = _n(this);
      return ft(t), this;
    }
    fill(t, ...n) {
      bn(this);
      const r = _n(this);
      return ct(r, sn(t), ...Gt(n)), this;
    }
    copyWithin(t, n, ...r) {
      bn(this);
      const e = _n(this);
      return lt(e, t, n, ...Gt(r)), this;
    }
    sort(...t) {
      bn(this);
      const n = _n(this),
        r = void 0 !== t[0] ? t[0] : gn;
      return ht(n, (t, n) => r(ln(t), ln(n))), this;
    }
    slice(...t) {
      bn(this);
      const n = _n(this),
        r = wn(n, On);
      if (r === On) {
        const r = new vt(wt(n), pt(n), gt(n));
        return new On(wt(at(r, ...Gt(t))));
      }
      const o = gt(n),
        i = an(t[0]),
        s = void 0 === t[1] ? o : an(t[1]);
      let u, f;
      u = i === -1 / 0 ? 0 : i < 0 ? o + i > 0 ? o + i : 0 : o < i ? o : i, f = s === -1 / 0 ? 0 : s < 0 ? o + s > 0 ? o + s : 0 : o < s ? o : s;
      const c = f - u > 0 ? f - u : 0,
        l = new r(c);
      if (An(l, c), 0 === c) return l;
      if (pn(wt(n))) throw Pt(e);
      let h = 0;
      for (; u < f;) l[h] = ln(n[u]), ++u, ++h;
      return l;
    }
    subarray(...t) {
      bn(this);
      const n = _n(this),
        r = wn(n, On),
        e = new vt(wt(n), pt(n), gt(n)),
        o = yt(e, ...Gt(t)),
        i = new r(wt(o), pt(o), gt(o));
      return An(i), i;
    }
    indexOf(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r);
      let o = an(n[0]);
      if (o === 1 / 0) return -1;
      o < 0 && (o += e, o < 0 && (o = 0));
      for (let n = o; n < e; ++n) if (N(r, n) && ln(r[n]) === t) return n;
      return -1;
    }
    lastIndexOf(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r);
      let o = n.length >= 1 ? an(n[0]) : e - 1;
      if (o === -1 / 0) return -1;
      o >= 0 ? o = o < e - 1 ? o : e - 1 : o += e;
      for (let n = o; n >= 0; --n) if (N(r, n) && ln(r[n]) === t) return n;
      return -1;
    }
    includes(t, ...n) {
      bn(this);
      const r = _n(this),
        e = gt(r);
      let o = an(n[0]);
      if (o === 1 / 0) return !1;
      o < 0 && (o += e, o < 0 && (o = 0));
      const i = O(t);
      for (let n = o; n < e; ++n) {
        const e = ln(r[n]);
        if (i && O(e)) return !0;
        if (e === t) return !0;
      }
      return !1;
    }
    join(...t) {
      bn(this);
      const n = En(_n(this));
      return C(n, ...Gt(t));
    }
    toLocaleString(...t) {
      bn(this);
      const n = En(_n(this));
      return V(n, ...Gt(t));
    }
    get [x]() {
      if (vn(this)) return "Float16Array";
    }
  }
  I(On, "BYTES_PER_ELEMENT", {
    value: 2
  }), I(On, $t, {}), _(On, tt);
  const Sn = On.prototype;
  return I(Sn, "BYTES_PER_ELEMENT", {
    value: 2
  }), I(Sn, S, {
    value: Sn.values,
    writable: !0,
    configurable: !0
  }), _(Sn, rt), t.Float16Array = On, t.getFloat16 = function (t, n, ...r) {
    return ln(jt(t, n, ...Gt(r)));
  }, t.hfround = function (t) {
    if ("bigint" == typeof t) throw Pt(i);
    return t = T(t), m(t) && 0 !== t ? ln(sn(t)) : t;
  }, t.isFloat16Array = vn, t.isTypedArray = function (t) {
    return qt(t) || vn(t);
  }, t.setFloat16 = function (t, n, r, ...e) {
    return xt(t, n, sn(r), ...Gt(e));
  }, Object.defineProperties(t, {
    __esModule: {
      value: !0
    },
    [Symbol.toStringTag]: {
      value: "Module"
    }
  }), t;
}({});

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
var _scene = /*#__PURE__*/new WeakMap();
var _camera = /*#__PURE__*/new WeakMap();
var _width$1 = /*#__PURE__*/new WeakMap();
var _height$1 = /*#__PURE__*/new WeakMap();
var _viewRect = /*#__PURE__*/new WeakMap();
var _systemUniformInfo_vertex_data = /*#__PURE__*/new WeakMap();
var _systemUniformInfo_fragment_data = /*#__PURE__*/new WeakMap();
var _postEffect = /*#__PURE__*/new WeakMap();
var _mouseEventChecker = /*#__PURE__*/new WeakMap();
var _makeSystemUniformInfo_vertex = /*#__PURE__*/new WeakMap();
var _makeSystemUniformInfo_fragment = /*#__PURE__*/new WeakMap();
class View extends UUID {
  //

  //

  //

  //

  //

  constructor(_redGPUContext, scene, camera) {
    super();
    _defineProperty(this, "redGPUContext", void 0);
    _classPrivateFieldInitSpec(this, _scene, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _camera, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "projectionMatrix", void 0);
    _classPrivateFieldInitSpec(this, _width$1, {
      writable: true,
      value: '100%'
    });
    _classPrivateFieldInitSpec(this, _height$1, {
      writable: true,
      value: '100%'
    });
    _classPrivateFieldInitSpec(this, _viewRect, {
      writable: true,
      value: []
    });
    _defineProperty(this, "systemUniformInfo_vertex", void 0);
    _defineProperty(this, "systemUniformInfo_fragment", void 0);
    _classPrivateFieldInitSpec(this, _systemUniformInfo_vertex_data, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _systemUniformInfo_fragment_data, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "baseAttachment", void 0);
    _defineProperty(this, "baseAttachmentView", void 0);
    _defineProperty(this, "baseAttachment_ResolveTarget", void 0);
    _defineProperty(this, "baseAttachment_ResolveTargetView", void 0);
    _defineProperty(this, "baseAttachment_mouseColorID_depth", void 0);
    _defineProperty(this, "baseAttachment_mouseColorID_depthView", void 0);
    _defineProperty(this, "baseAttachment_mouseColorID_depth_ResolveTarget", void 0);
    _defineProperty(this, "baseAttachment_mouseColorID_depth_ResolveTargetView", void 0);
    _defineProperty(this, "baseDepthStencilAttachment", void 0);
    _defineProperty(this, "baseDepthStencilAttachmentView", void 0);
    _classPrivateFieldInitSpec(this, _postEffect, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "debugLightList", []);
    _defineProperty(this, "mouseX", 0);
    _defineProperty(this, "mouseY", 0);
    _classPrivateFieldInitSpec(this, _mouseEventChecker, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "_x", 0);
    _defineProperty(this, "_y", 0);
    _defineProperty(this, "_useFrustumCulling", true);
    _classPrivateFieldInitSpec(this, _makeSystemUniformInfo_vertex, {
      writable: true,
      value: function (device) {
        let uniformBufferSize = TypeSize.mat4 +
        // projectionMatrix
        TypeSize.mat4 +
        // camera3D
        TypeSize.float32x2 +
        // resolution
        TypeSize.float32 // time
        ;

        const uniformBufferDescriptor = {
          size: uniformBufferSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        };
        const bindGroupLayoutDescriptor = {
          entries: [{
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
              type: 'uniform'
            }
          }]
        };
        let uniformBuffer, uniformBindGroupLayout, uniformBindGroup, bindGroupDescriptor;
        _classPrivateFieldSet(this, _systemUniformInfo_vertex_data, new Float32Array(uniformBufferSize / Float32Array.BYTES_PER_ELEMENT));
        console.log('uniformBufferDescriptor', uniformBufferDescriptor);
        bindGroupDescriptor = {
          layout: uniformBindGroupLayout = device.createBindGroupLayout(bindGroupLayoutDescriptor),
          entries: [{
            binding: 0,
            resource: {
              buffer: uniformBuffer = device.createBuffer(uniformBufferDescriptor),
              offset: 0,
              size: uniformBufferSize
            }
          }]
        };
        uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
        return {
          GPUBuffer: uniformBuffer,
          GPUBindGroupLayout: uniformBindGroupLayout,
          GPUBindGroup: uniformBindGroup
        };
      }
    });
    _classPrivateFieldInitSpec(this, _makeSystemUniformInfo_fragment, {
      writable: true,
      value: function (device) {
        let uniformBufferSize = TypeSize.float32x4 +
        // directionalLightCount,pointLightCount, spotLightCount
        TypeSize.float32x4 * 2 * ShareGLSL.MAX_DIRECTIONAL_LIGHT +
        // directionalLight
        TypeSize.float32x4 * 3 * ShareGLSL.MAX_POINT_LIGHT +
        // pointLight
        TypeSize.float32x4 * TypeSize.float32x4 +
        // ambientLight
        TypeSize.float32x4 * 3 * ShareGLSL.MAX_SPOT_LIGHT +
        // spotLight
        TypeSize.float32x4 +
        // cameraPosition
        TypeSize.float32x2 // resolution
        ;

        const uniformBufferDescriptor = {
          size: uniformBufferSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        };
        const bindGroupLayoutDescriptor = {
          entries: [{
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
              type: 'uniform'
            }
          }]
        };
        let uniformBuffer, uniformBindGroupLayout, uniformBindGroup, bindGroupDescriptor;
        _classPrivateFieldSet(this, _systemUniformInfo_fragment_data, new Float32Array(uniformBufferSize / Float32Array.BYTES_PER_ELEMENT));
        bindGroupDescriptor = {
          layout: uniformBindGroupLayout = device.createBindGroupLayout(bindGroupLayoutDescriptor),
          entries: [{
            binding: 0,
            resource: {
              buffer: uniformBuffer = device.createBuffer(uniformBufferDescriptor),
              offset: 0,
              size: uniformBufferSize
            }
          }]
        };
        uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
        return {
          GPUBuffer: uniformBuffer,
          GPUBindGroupLayout: uniformBindGroupLayout,
          GPUBindGroup: uniformBindGroup
        };
      }
    });
    _defineProperty(this, "readPixelArrayBuffer", async (redGPUContext, redView, targetTexture, x = 0, y = 0, width = 1, height = 1) => {
      // 이미지 카피
      let viewRect = redView.viewRect;
      if (x > 0 && x < viewRect[2] && y > 0 && y < viewRect[3]) {
        let readPixelCommandEncoder, readPixelBuffer, textureView, bufferView, textureExtent;
        readPixelCommandEncoder = redGPUContext.device.createCommandEncoder();
        readPixelBuffer = redGPUContext.device.createBuffer({
          size: 16 * width * height,
          usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
        textureView = {
          texture: targetTexture,
          origin: {
            x: x,
            y: y,
            z: 0
          }
        };
        bufferView = {
          buffer: readPixelBuffer,
          bytesPerRow: Math.max(256, 4 * width * height),
          rowsPerImage: 1
        };
        textureExtent = {
          width: width,
          height: height,
          depthOrArrayLayers: 1
        };
        readPixelCommandEncoder.copyTextureToBuffer(textureView, bufferView, textureExtent);
        redGPUContext.device.queue.submit([readPixelCommandEncoder.finish()]);
        // console.log(readPixelBuffer)
        readPixelBuffer = redGPUContext.device.createBuffer({
          mappedAtCreation: true,
          size: 16 * width * height,
          usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
        // console.log('bufferView',bufferView)

        let promise = new Promise(resolve => {
          bufferView.buffer.mapAsync(GPUMapMode.READ).then(arrayBuffer => {
            const data = bufferView.buffer.getMappedRange();
            // console.log(data)
            readPixelBuffer.unmap();
            readPixelBuffer.destroy();
            readPixelBuffer = null;
            resolve(data);
          });
        });
        return promise;
      }
    });
    this.redGPUContext = _redGPUContext;
    this.camera = camera;
    this.scene = scene;
    this.systemUniformInfo_vertex = _classPrivateFieldGet(this, _makeSystemUniformInfo_vertex).call(this, _redGPUContext.device);
    this.systemUniformInfo_fragment = _classPrivateFieldGet(this, _makeSystemUniformInfo_fragment).call(this, _redGPUContext.device);
    this.projectionMatrix = t.mat4.create();
    _classPrivateFieldSet(this, _postEffect, new PostEffect(_redGPUContext));
    _classPrivateFieldSet(this, _mouseEventChecker, new MouseEventChecker(this));
  }

  //

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get useFrustumCulling() {
    return this._useFrustumCulling;
  }
  set useFrustumCulling(value) {
    this._useFrustumCulling = value;
  }
  get mouseEventChecker() {
    return _classPrivateFieldGet(this, _mouseEventChecker);
  }
  get postEffect() {
    return _classPrivateFieldGet(this, _postEffect);
  }
  get scene() {
    return _classPrivateFieldGet(this, _scene);
  }
  set scene(value) {
    _classPrivateFieldSet(this, _scene, value);
  }
  get camera() {
    return _classPrivateFieldGet(this, _camera);
  }
  set camera(value) {
    _classPrivateFieldSet(this, _camera, value);
  }
  get width() {
    return _classPrivateFieldGet(this, _width$1);
  }
  get height() {
    return _classPrivateFieldGet(this, _height$1);
  }
  get viewRect() {
    return _classPrivateFieldGet(this, _viewRect);
  }
  resetTexture(redGPUContext) {
    _classPrivateFieldSet(this, _viewRect, this.getViewRect(redGPUContext));
    let info = {
      colorAttachments: [{
        key: 'baseAttachment',
        format: redGPUContext.swapChainFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING,
        resolveUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING
      }, {
        key: 'baseAttachment_mouseColorID_depth',
        format: 'rgba16float',
        // format: redGPUContext.context.getPreferredFormat(redGPUContext.adapter),
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING,
        resolveUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING
      }],
      depthStencilAttachment: {
        key: 'baseDepthStencilAttachment',
        format: "depth24plus-stencil8",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
      }
    };
    let sizeInfo = {
      width: _classPrivateFieldGet(this, _viewRect)[2],
      height: _classPrivateFieldGet(this, _viewRect)[3],
      depthOrArrayLayers: 1
    };
    [...info.colorAttachments, info.depthStencilAttachment].forEach(v => {
      let key = v['key'];
      let format = v['format'];
      let usage = v['usage'];
      let resolveUsage = v['resolveUsage'];
      if (this[key]) {
        this[key].destroy();
        if (resolveUsage) this[key + '_ResolveTarget'].destroy();
      }
      this[key] = redGPUContext.device.createTexture({
        size: sizeInfo,
        sampleCount: 4,
        format: format,
        usage: usage
      });
      this[key + 'View'] = this[key].createView();
      if (resolveUsage) {
        this[key + '_ResolveTarget'] = redGPUContext.device.createTexture({
          size: sizeInfo,
          sampleCount: 1,
          format: format,
          usage: resolveUsage
        });
        this[key + '_ResolveTargetView'] = this[key + '_ResolveTarget'].createView();
      }
    });
  }
  updateSystemUniform(passEncoder, redGPUContext) {
    //TODO 여기도 오프셋 자동으로 계산하게 변경해야함
    let systemUniformInfo_vertex, systemUniformInfo_fragment, aspect, offset;
    let i, len;
    systemUniformInfo_vertex = this.systemUniformInfo_vertex;
    systemUniformInfo_fragment = this.systemUniformInfo_fragment;
    _classPrivateFieldSet(this, _viewRect, this.getViewRect(redGPUContext));
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update systemUniformInfo_vertex /////////////////////////////////////////////////////////////////////////////////////////////////
    offset = 0;
    aspect = Math.abs(_classPrivateFieldGet(this, _viewRect)[2] / _classPrivateFieldGet(this, _viewRect)[3]);
    if (this.camera.hasOwnProperty('farClipping')) {
      t.mat4.perspective(this.projectionMatrix, Math.PI / 180 * this.camera.fov, aspect, this.camera.nearClipping, this.camera.farClipping);
    } else {
      t.mat4.ortho(this.projectionMatrix, 0.,
      // left
      1.,
      // right
      0.,
      // bottom
      1.,
      // top,
      -1000, 1000);
      t.mat4.scale(this.projectionMatrix, this.projectionMatrix, [1 / _classPrivateFieldGet(this, _viewRect)[2], 1 / _classPrivateFieldGet(this, _viewRect)[3], 1]);
      t.mat4.translate(this.projectionMatrix, this.projectionMatrix, [0, _classPrivateFieldGet(this, _viewRect)[3], 0]);
    }
    _classPrivateFieldGet(this, _systemUniformInfo_vertex_data).set(this.projectionMatrix, offset);
    offset += TypeSize.mat4 / Float32Array.BYTES_PER_ELEMENT;
    _classPrivateFieldGet(this, _systemUniformInfo_vertex_data).set(this.camera.matrix, offset);
    offset += TypeSize.mat4 / Float32Array.BYTES_PER_ELEMENT;
    _classPrivateFieldGet(this, _systemUniformInfo_vertex_data).set([_classPrivateFieldGet(this, _viewRect)[2], _classPrivateFieldGet(this, _viewRect)[3], performance.now()], offset);
    offset += TypeSize.float32x2 / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update systemUniformInfo_fragment /////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update light counts
    offset = 0;
    _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set([this.scene.directionalLightList.length, this.scene.pointLightList.length, this.scene.spotLightList.length], offset);
    this.debugLightList.length = 0;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update directionalLightList
    i = 0;
    offset = TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
    len = this.scene.directionalLightList.length;
    for (i; i < len; i++) {
      let tLight = this.scene.directionalLightList[i];
      if (tLight) {
        _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set(tLight._colorRGBA, offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set([tLight._x, tLight._y, tLight._z, tLight._intensity], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        if (tLight.useDebugMesh) this.debugLightList.push(tLight._debugMesh);
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update pointLightList
    offset = (TypeSize.float32x4 + TypeSize.float32x4 * 2 * ShareGLSL.MAX_DIRECTIONAL_LIGHT) / Float32Array.BYTES_PER_ELEMENT;
    i = 0;
    len = this.scene.pointLightList.length;
    for (i; i < len; i++) {
      let tLight = this.scene.pointLightList[i];
      if (tLight) {
        _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set(tLight._colorRGBA, offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set([tLight._x, tLight._y, tLight._z, tLight._intensity], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set([tLight._radius], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        if (tLight.useDebugMesh) this.debugLightList.push(tLight._debugMesh);
      }
    }
    offset = (TypeSize.float32x4 + TypeSize.float32x4 * 2 * ShareGLSL.MAX_DIRECTIONAL_LIGHT + TypeSize.float32x4 * 3 * ShareGLSL.MAX_POINT_LIGHT) / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update ambientLight
    let tLight = this.scene.ambientLight;
    _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set(tLight ? tLight._colorRGBA : [0, 0, 0, 0], offset);
    offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
    _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set([tLight ? tLight._intensity : 1], offset);
    offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update spotLightList
    i = 0;
    len = this.scene.spotLightList.length;
    for (i; i < len; i++) {
      let tLight = this.scene.spotLightList[i];
      if (tLight) {
        _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set(tLight._colorRGBA, offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set([tLight._x, tLight._y, tLight._z, tLight._intensity], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set([tLight.cutoff, tLight.exponent], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        if (tLight.useDebugMesh) this.debugLightList.push(tLight._debugMesh.children);
      }
    }
    offset = (TypeSize.float32x4 + TypeSize.float32x4 * 2 * ShareGLSL.MAX_DIRECTIONAL_LIGHT + TypeSize.float32x4 * 3 * ShareGLSL.MAX_POINT_LIGHT + TypeSize.float32x4 * 3 * ShareGLSL.MAX_SPOT_LIGHT + TypeSize.float32x4 * 2) / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update camera3D position
    _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set([this.camera.x, this.camera.y, this.camera.z], offset);
    offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update resolution
    _classPrivateFieldGet(this, _systemUniformInfo_fragment_data).set([+_classPrivateFieldGet(this, _viewRect)[2], +_classPrivateFieldGet(this, _viewRect)[3]], offset);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update GPUBuffer
    passEncoder.setBindGroup(0, systemUniformInfo_vertex.GPUBindGroup);
    passEncoder.setBindGroup(1, systemUniformInfo_fragment.GPUBindGroup);
    // systemUniformInfo_vertex.GPUBuffer.setSubData(0, this.#systemUniformInfo_vertex_data);
    redGPUContext.device.queue.writeBuffer(systemUniformInfo_vertex.GPUBuffer, 0, _classPrivateFieldGet(this, _systemUniformInfo_vertex_data));
    // systemUniformInfo_fragment.GPUBuffer.setSubData(0, this.#systemUniformInfo_fragment_data);
    redGPUContext.device.queue.writeBuffer(systemUniformInfo_fragment.GPUBuffer, 0, _classPrivateFieldGet(this, _systemUniformInfo_fragment_data));
  }
  getViewRect(redGPUContext) {
    return [typeof this.x == 'number' ? this.x : parseInt(this.x) / 100 * redGPUContext.canvas.width, typeof this.y == 'number' ? this.y : parseInt(this.y) / 100 * redGPUContext.canvas.height, typeof this.width == 'number' ? this.width : parseInt(parseInt(this.width) / 100 * redGPUContext.canvas.width), typeof this.height == 'number' ? this.height : parseInt(parseInt(this.height) / 100 * redGPUContext.canvas.height)];
  }
  setSize(width = _classPrivateFieldGet(this, _width$1), height = _classPrivateFieldGet(this, _height$1)) {
    let t0 = _classPrivateFieldGet(this, _viewRect).toString();
    if (typeof width == 'number') _classPrivateFieldSet(this, _width$1, width < 1 ? 1 : parseInt(width));else {
      if (width.includes('%') && +width.replace('%', '') >= 0) _classPrivateFieldSet(this, _width$1, width);else UTIL.throwFunc('View setSize : width는 0이상의 숫자나 %만 허용.', width);
    }
    if (typeof height == 'number') _classPrivateFieldSet(this, _height$1, height < 1 ? 1 : parseInt(height));else {
      if (height.includes('%') && +height.replace('%', '') >= 0) _classPrivateFieldSet(this, _height$1, height);else UTIL.throwFunc('View setSize : height는 0이상의 숫자나 %만 허용.', height);
    }
    if (RedGPUContext.useDebugConsole) console.log(`setSize - input : ${width},${height} / result : ${_classPrivateFieldGet(this, _width$1)}, ${_classPrivateFieldGet(this, _height$1)}`);
    if (this.getViewRect(this.redGPUContext).toString() != t0) this.resetTexture(this.redGPUContext);
  }
  setLocation(x = this._x, y = this._y) {
    if (typeof x == 'number') this._x = parseInt(x);else {
      if (x.includes('%') && +x.replace('%', '') >= 0) this._x = x;else UTIL.throwFunc('View setLocation : x는 0이상의 숫자나 %만 허용.', x);
    }
    if (typeof y == 'number') this._y = parseInt(y);else {
      if (y.includes('%') && +y.replace('%', '') >= 0) this._y = y;else UTIL.throwFunc('View setLocation : y는 0이상의 숫자나 %만 허용.', y);
    }
    if (RedGPUContext.useDebugConsole) console.log(`setLocation - input : ${x},${y} / result : ${this._x}, ${this._y}`);
    this.getViewRect(this.redGPUContext);
  }
  computeViewFrustumPlanes() {
    let tMTX = t.mat4.create();
    t.mat4.multiply(tMTX, this.projectionMatrix, this.camera.matrix);
    let planes = [];
    planes[0] = [tMTX[3] - tMTX[0], tMTX[7] - tMTX[4], tMTX[11] - tMTX[8], tMTX[15] - tMTX[12]];
    planes[1] = [tMTX[3] + tMTX[0], tMTX[7] + tMTX[4], tMTX[11] + tMTX[8], tMTX[15] + tMTX[12]];
    planes[2] = [tMTX[3] + tMTX[1], tMTX[7] + tMTX[5], tMTX[11] + tMTX[9], tMTX[15] + tMTX[13]];
    planes[3] = [tMTX[3] - tMTX[1], tMTX[7] - tMTX[5], tMTX[11] - tMTX[9], tMTX[15] - tMTX[13]];
    planes[4] = [tMTX[3] - tMTX[2], tMTX[7] - tMTX[6], tMTX[11] - tMTX[10], tMTX[15] - tMTX[14]];
    planes[5] = [tMTX[3] + tMTX[2], tMTX[7] + tMTX[6], tMTX[11] + tMTX[10], tMTX[15] + tMTX[14]];
    for (let i = 0; i < planes.length; i++) {
      let plane = planes[i];
      let norm = Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2]);
      plane[0] /= norm;
      plane[1] /= norm;
      plane[2] /= norm;
      plane[3] /= norm;
    }
    return planes;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:3:14
 *
 */
const MESH_UNIFORM_TABLE = [];
let MESH_UNIFORM_POOL_index = 0;
let MESH_UNIFORM_POOL_tableIndex = 0;
let float1_Float32Array = new Float32Array(1);
const uniformBufferDescriptor_mesh = new UniformBufferDescriptor([{
  size: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM,
  valueName: 'matrix'
}, {
  size: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM,
  valueName: 'normalMatrix'
}]);
let MOUSE_UUID = 0;
const getPool = function (redGPUContext, targetMesh) {
  let uniformBuffer_meshMatrix;
  if (!MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex]) {
    uniformBuffer_meshMatrix = new UniformBuffer(redGPUContext);
    uniformBuffer_meshMatrix.setBuffer(uniformBufferDescriptor_mesh);
    MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex] = uniformBuffer_meshMatrix;
  }
  uniformBuffer_meshMatrix = MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex];
  let result = {
    float32Array: uniformBuffer_meshMatrix.float32Array,
    uniformBuffer_meshMatrix: uniformBuffer_meshMatrix,
    offsetMatrix: TypeSize.mat4 * MESH_UNIFORM_POOL_index,
    offsetNormalMatrix: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM + TypeSize.mat4 * MESH_UNIFORM_POOL_index,
    uniformIndex: MESH_UNIFORM_POOL_index
  };
  MESH_UNIFORM_POOL_index++;
  if (MESH_UNIFORM_POOL_index == ShareGLSL.MESH_UNIFORM_POOL_NUM) {
    MESH_UNIFORM_POOL_tableIndex++;
    MESH_UNIFORM_POOL_index = 0;
  }
  // console.log('MESH_UNIFORM_TABLE',MESH_UNIFORM_TABLE)
  return result;
};
var _entries = /*#__PURE__*/new WeakMap();
var _mouseColorID = /*#__PURE__*/new WeakMap();
class BaseObject3D extends DisplayContainer {
  //FIXME - 유일키가 될수있도록 변경

  constructor(redGPUContext) {
    super();
    _defineProperty(this, "dirtyTransform", true);
    _defineProperty(this, "dirtyPipeline", true);
    _defineProperty(this, "_redGPUContext", void 0);
    _defineProperty(this, "pipeline", void 0);
    _classPrivateFieldInitSpec(this, _entries, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _mouseColorID, {
      writable: true,
      value: 0
    });
    _defineProperty(this, "localToWorld", (_ => {
      //TODO - 값 확인해봐야함
      let tMTX;
      tMTX = t.mat4.create();
      return function (x = 0, y = 0, z = 0) {
        typeof x == 'number' || UTIL.throwFunc('BaseObject3D - localToWorld : x - number만 허용함', '입력값 : ', x);
        typeof y == 'number' || UTIL.throwFunc('BaseObject3D - localToWorld : y - number만 허용함', '입력값 : ', y);
        typeof z == 'number' || UTIL.throwFunc('BaseObject3D - localToWorld : z - number만 허용함', '입력값 : ', z);
        tMTX[0] = 1, tMTX[1] = 0, tMTX[2] = 0, tMTX[3] = 0;
        tMTX[4] = 0, tMTX[5] = 1, tMTX[6] = 0, tMTX[7] = 0;
        tMTX[8] = 0, tMTX[9] = 0, tMTX[10] = 1, tMTX[11] = 0;
        tMTX[12] = x, tMTX[13] = y, tMTX[14] = z, tMTX[15] = 1;
        t.mat4.multiply(tMTX, this.matrix, tMTX);
        return [tMTX[12], tMTX[13], tMTX[14]];
      };
    })());
    _defineProperty(this, "worldToLocal", (_ => {
      let tMTX, resultMTX;
      tMTX = t.mat4.create();
      resultMTX = t.mat4.create();
      return function (x = 0, y = 0, z = 0) {
        typeof x == 'number' || UTIL.throwFunc('BaseObject3D - worldToLocal : x - number만 허용함', '입력값 : ', x);
        typeof y == 'number' || UTIL.throwFunc('BaseObject3D - worldToLocal : y - number만 허용함', '입력값 : ', y);
        typeof z == 'number' || UTIL.throwFunc('BaseObject3D - worldToLocal : z - number만 허용함', '입력값 : ', z);
        t.mat4.invert(tMTX, this.matrix);
        t.mat4.transpose(tMTX, tMTX);
        t.mat4.multiply(resultMTX, tMTX, this.matrix);
        return [resultMTX[0] * x + resultMTX[1] * y + resultMTX[2] * z + resultMTX[3], resultMTX[4] * x + resultMTX[5] * y + resultMTX[6] * z + resultMTX[7], resultMTX[8] * x + resultMTX[9] * y + resultMTX[10] * z + resultMTX[11]];
      };
    })());
    _defineProperty(this, "getScreenPoint", (_ => {
      //TODO - 값 확인해봐야함
      let tMTX = t.mat4.create();
      let tPositionMTX = t.mat4.create();
      let tCamera, tViewRect;
      let resultPosition;
      resultPosition = {
        x: 0,
        y: 0,
        z: 0,
        w: 0
      };
      return function (redView, localX = 0, localY = 0, localZ = 0) {
        let worldPosition = this.localToWorld(localX, localY, localZ);
        tPositionMTX[0] = 1, tPositionMTX[1] = 0, tPositionMTX[2] = 0, tPositionMTX[3] = 0;
        tPositionMTX[4] = 0, tPositionMTX[5] = 1, tPositionMTX[6] = 0, tPositionMTX[7] = 0;
        tPositionMTX[8] = 0, tPositionMTX[9] = 0, tPositionMTX[10] = 1, tPositionMTX[11] = 0;
        tPositionMTX[12] = worldPosition[0], tPositionMTX[13] = worldPosition[1], tPositionMTX[14] = worldPosition[2], tPositionMTX[15] = 1;
        redView instanceof View || UTIL.throwFunc('BaseObject3D - getScreenPoint : redView - RedView Instance 만 허용함', '입력값 : ', redView);
        tCamera = redView.camera;
        tViewRect = redView.viewRect;
        t.mat4.multiply(tMTX, redView.projectionMatrix, tCamera.matrix);
        t.mat4.multiply(tMTX, tMTX, tPositionMTX);
        resultPosition.x = tMTX[12];
        resultPosition.y = tMTX[13];
        resultPosition.z = tMTX[14];
        resultPosition.w = tMTX[15];
        resultPosition.x = resultPosition.x * 0.5 / resultPosition.w + 0.5;
        resultPosition.y = resultPosition.y * 0.5 / resultPosition.w + 0.5;
        return [(tViewRect[0] + resultPosition.x * tViewRect[2]) / window.devicePixelRatio, (tViewRect[1] + (1 - resultPosition.y) * tViewRect[3]) / window.devicePixelRatio];
      };
    })());
    _defineProperty(this, "_x", 0);
    _defineProperty(this, "_y", 0);
    _defineProperty(this, "_z", 0);
    _defineProperty(this, "_pivotX", 0);
    _defineProperty(this, "_pivotY", 0);
    _defineProperty(this, "_pivotZ", 0);
    _defineProperty(this, "_rotationX", 0);
    _defineProperty(this, "_rotationY", 0);
    _defineProperty(this, "_rotationZ", 0);
    _defineProperty(this, "targetTo", (_ => {
      let up = new Float32Array([0, 1, 0]);
      let tPosition = [];
      let tRotation = [];
      let tMTX = t.mat4.create();
      return function (x, y, z) {
        tPosition[0] = x;
        tPosition[1] = y;
        tPosition[2] = z;
        //out, eye, center, up
        t.mat4.identity(tMTX);
        t.mat4.targetTo(tMTX, [this._x, this._y, this._z], tPosition, up);
        tRotation = UTIL.mat4ToEuler(tMTX, []);
        this._rotationX = -tRotation[0] * 180 / Math.PI;
        this._rotationY = -tRotation[1] * 180 / Math.PI;
        this._rotationZ = -tRotation[2] * 180 / Math.PI;
        this.dirtyTransform = true;
      };
    })());
    _defineProperty(this, "_scaleX", 1);
    _defineProperty(this, "_scaleY", 1);
    _defineProperty(this, "_scaleZ", 1);
    _defineProperty(this, "_material", void 0);
    _defineProperty(this, "_geometry", void 0);
    _defineProperty(this, "_depthWriteEnabled", true);
    _defineProperty(this, "_depthCompare", 'less-equal');
    _defineProperty(this, "_cullMode", 'back');
    _defineProperty(this, "_primitiveTopology", "triangle-list");
    _defineProperty(this, "_blendColorSrc", 'src-alpha');
    _defineProperty(this, "_blendColorDst", 'one-minus-src-alpha');
    _defineProperty(this, "_blendAlphaSrc", 'one');
    _defineProperty(this, "_blendAlphaDst", 'one-minus-src-alpha');
    _defineProperty(this, "_renderDrawLayerIndex", Render.DRAW_LAYER_INDEX0);
    _defineProperty(this, "_sumOpacity", 1);
    _defineProperty(this, "_opacity", 1);
    this._redGPUContext = redGPUContext;
    let bufferData = getPool(redGPUContext);
    this.uniformBuffer_meshMatrix = bufferData.uniformBuffer_meshMatrix;
    this.uniformBuffer_meshMatrix.meshFloat32Array = bufferData.float32Array;
    this.offsetMatrix = bufferData.offsetMatrix;
    this.offsetNormalMatrix = bufferData.offsetNormalMatrix;
    // MOUSE_UUID++;
    MOUSE_UUID++;
    _classPrivateFieldSet(this, _mouseColorID, MOUSE_UUID);
    this.uniformBuffer_mesh = new UniformBuffer(redGPUContext);
    this.uniformBuffer_mesh.setBuffer(BaseObject3D.uniformBufferDescriptor_meshIndex);
    // this.uniformBuffer_mesh.GPUBuffer.setSubData(0, new Float32Array([bufferData.uniformIndex]));
    redGPUContext.device.queue.writeBuffer(this.uniformBuffer_mesh.GPUBuffer, 0, new Float32Array([bufferData.uniformIndex]));
    // this.uniformBuffer_mesh.GPUBuffer.setSubData(TypeSize.float32, new Float32Array([this.#mouseColorID]));
    redGPUContext.device.queue.writeBuffer(this.uniformBuffer_mesh.GPUBuffer, TypeSize.float32, new Float32Array([_classPrivateFieldGet(this, _mouseColorID)]));
    this.sumOpacity = 1;
    _classPrivateFieldSet(this, _entries, [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_meshMatrix.GPUBuffer,
        offset: 0,
        size: this.uniformBuffer_meshMatrix.uniformBufferDescriptor.size
      }
    }, {
      binding: 1,
      resource: {
        buffer: this.uniformBuffer_mesh.GPUBuffer,
        offset: 0,
        size: this.uniformBuffer_mesh.uniformBufferDescriptor.size
      }
    }]);
    this.GPUBindGroupLayout = redGPUContext.device.createBindGroupLayout(BaseObject3D.uniformsBindGroupLayoutDescriptor_mesh);
    this.GPUBindGroup = this._redGPUContext.device.createBindGroup({
      layout: this.GPUBindGroupLayout,
      entries: _classPrivateFieldGet(this, _entries)
    });
    this.pipeline = new PipelineBasic(redGPUContext, this);
    this.normalMatrix = t.mat4.create();
    this.matrix = t.mat4.create();
    this.localMatrix = t.mat4.create();
  }
  /////////////////////////////////////////////////////////
  get x() {
    return this._x;
  }
  set x(v) {
    this._x = v;
    this.dirtyTransform = true;
  }
  get y() {
    return this._y;
  }
  set y(v) {
    this._y = v;
    this.dirtyTransform = true;
  }
  get z() {
    return this._z;
  }
  set z(v) {
    this._z = v;
    this.dirtyTransform = true;
  }
  get pivotX() {
    return this._pivotX;
  }
  set pivotX(value) {
    this._pivotX = value;
    this.dirtyTransform = true;
  }
  get pivotY() {
    return this._pivotY;
  }
  set pivotY(value) {
    this._pivotY = value;
    this.dirtyTransform = true;
  }
  /////////////////////////////////////////////////////////
  get pivotZ() {
    return this._pivotZ;
  }
  set pivotZ(value) {
    this._pivotZ = value;
    this.dirtyTransform = true;
  }
  /////////////////////////////////////////////////////////
  get rotationX() {
    return this._rotationX;
  }
  set rotationX(v) {
    this._rotationX = v;
    this.dirtyTransform = true;
  }
  get rotationY() {
    return this._rotationY;
  }
  set rotationY(v) {
    this._rotationY = v;
    this.dirtyTransform = true;
  }
  get rotationZ() {
    return this._rotationZ;
  }
  set rotationZ(v) {
    this._rotationZ = v;
    this.dirtyTransform = true;
  }
  /////////////////////////////////////////////////////////
  get scaleX() {
    return this._scaleX;
  }
  set scaleX(v) {
    this._scaleX = v;
    this.dirtyTransform = true;
  }
  get scaleY() {
    return this._scaleY;
  }
  set scaleY(v) {
    this._scaleY = v;
    this.dirtyTransform = true;
  }
  get scaleZ() {
    return this._scaleZ;
  }
  set scaleZ(v) {
    this._scaleZ = v;
    this.dirtyTransform = true;
  }

  //

  get material() {
    return this._material;
  }
  set material(v) {
    this._material = v;
    this.dirtyPipeline = true; /* this.dirtyTransform = true*/
  }

  /////////////////////////////////////////////////////////
  get geometry() {
    return this._geometry;
  }
  set geometry(v) {
    this._geometry = v;
    this.dirtyPipeline = true; /* this.dirtyTransform = true*/
  }

  //

  get depthWriteEnabled() {
    return this._depthWriteEnabled;
  }
  set depthWriteEnabled(value) {
    this.dirtyPipeline = true;
    this._depthWriteEnabled = value;
  }
  get depthCompare() {
    return this._depthCompare;
  }
  set depthCompare(value) {
    this.dirtyPipeline = true;
    this._depthCompare = value;
  }
  get cullMode() {
    return this._cullMode;
  }
  set cullMode(value) {
    this.dirtyPipeline = true;
    this._cullMode = value;
  }
  get primitiveTopology() {
    return this._primitiveTopology;
  }
  set primitiveTopology(value) {
    this.dirtyPipeline = true;
    this._primitiveTopology = value;
  }
  get blendColorSrc() {
    return this._blendColorSrc;
  }
  set blendColorSrc(value) {
    this._blendColorSrc = value;
    this.dirtyPipeline = true;
  }
  get blendColorDst() {
    return this._blendColorDst;
  }
  set blendColorDst(value) {
    this._blendColorDst = value;
    this.dirtyPipeline = true;
  }
  get blendAlphaSrc() {
    return this._blendAlphaSrc;
  }
  set blendAlphaSrc(value) {
    this._blendAlphaSrc = value;
    this.dirtyPipeline = true;
  }
  get blendAlphaDst() {
    return this._blendAlphaDst;
  }
  set blendAlphaDst(value) {
    this._blendAlphaDst = value;
    this.dirtyPipeline = true;
  }
  get renderDrawLayerIndex() {
    return this._renderDrawLayerIndex;
  }
  set renderDrawLayerIndex(value) {
    this._renderDrawLayerIndex = value;
  }
  get sumOpacity() {
    return this._sumOpacity;
  }
  set sumOpacity(value) {
    this._sumOpacity = value;
    float1_Float32Array[0] = this._sumOpacity;
    // this.uniformBuffer_mesh.GPUBuffer.setSubData(TypeSize.float32x2, float1_Float32Array)
    this._redGPUContext.device.queue.writeBuffer(this.uniformBuffer_mesh.GPUBuffer, TypeSize.float32x2, float1_Float32Array);
  }
  get opacity() {
    return this._opacity;
  }
  set opacity(value) {
    this._opacity = value;
  }
  getPosition() {
    return [this._x, this._y, this._z];
  }
  setPosition(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
    this.dirtyTransform = true;
  }
  getPivotPosition() {
    return [this._pivotX, this._pivotY, this._pivotZ];
  }
  setPivotPosition(x, y, z) {
    this._pivotX = x;
    this._pivotY = y;
    this._pivotZ = z;
    this.dirtyTransform = true;
  }
  getRotation() {
    return [this._rotationX, this._rotationY, this._rotationZ];
  }
  setRotation(rX, rY, rZ) {
    this._rotationX = rX;
    this._rotationY = rY;
    this._rotationZ = rZ;
    this.dirtyTransform = true;
  }
  getScale() {
    return [this._scaleX, this._scaleY, this._scaleZ];
  }
  setScale(sX, sY, sZ) {
    this._scaleX = sX;
    this._scaleY = sY;
    this._scaleZ = sZ;
    this.dirtyTransform = true;
  }

  /////////////////////////////////////////////////////////
  addEventListener(type, handler) {
    if (!MouseEventChecker.mouseMAP[_classPrivateFieldGet(this, _mouseColorID)]) {
      MouseEventChecker.mouseMAP[_classPrivateFieldGet(this, _mouseColorID)] = {
        target: this
      };
    }
    MouseEventChecker.mouseMAP[_classPrivateFieldGet(this, _mouseColorID)][type] = handler;
    // console.log(MouseEventChecker.mouseMAP)
  }

  removeEventListener(type) {
    if (MouseEventChecker.mouseMAP[_classPrivateFieldGet(this, _mouseColorID)]) {
      MouseEventChecker.mouseMAP[_classPrivateFieldGet(this, _mouseColorID)][type] = null;
    }
  }
}
_defineProperty(BaseObject3D, "uniformsBindGroupLayoutDescriptor_mesh", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }]
});
_defineProperty(BaseObject3D, "uniformBufferDescriptor_meshIndex", new UniformBufferDescriptor([{
  size: TypeSize.float32,
  valueName: 'meshUniformIndex'
}, {
  size: TypeSize.float32,
  valueName: 'mouseColorID'
}, {
  size: TypeSize.float32,
  valueName: 'sumOpacity'
}]));

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */
class Mesh extends BaseObject3D {
  constructor(redGPUContext, geometry, material) {
    super(redGPUContext);
    this.geometry = geometry;
    this.material = material;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:47:56
 *
 */

function createWorker(f) {
  return new Worker(URL.createObjectURL(new Blob([`(${f})()`], {
    type: 'application/javascript'
  })));
}
const workerImage = createWorker(async () => {

  /////////////////////////////////////////////////////////////////////////////
  let getImage = (_ => {
    let nextHighestPowerOfTwo = function () {
      let i;
      return function (v) {
        --v;
        for (i = 1; i < 32; i <<= 1) v = v | v >> i;
        return v + 1;
      };
    }();
    return data => {
      const src = data.src;
      let errorInfo;
      fetch(src, {
        mode: 'cors'
      }).then(response => {
        errorInfo = {
          url: response.url,
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          type: response.type
        };
        if (!response.ok) throw Error('error');else {
          response.blob().then(blob => self.createImageBitmap(blob)).then(bitmap => {
            let faceWidth = nextHighestPowerOfTwo(bitmap.width);
            let faceHeight = nextHighestPowerOfTwo(bitmap.height);
            if (faceWidth > 1920) faceWidth = 1920;
            if (faceHeight > 1920) faceHeight = 1920;
            // console.log(data)
            let imageDatas = [];
            let mipIndex = 0,
              len = Math.round(Math.log2(Math.max(faceWidth, faceHeight)));
            let getMipmapDatas = img => {
              const cvs = new OffscreenCanvas(faceWidth, faceHeight);
              const ctx = cvs.getContext('2d');
              ctx.fillStyle = 'rgba(0,0,0,0)';
              ctx.fillRect(0, 0, faceWidth, faceHeight);
              ctx.drawImage(img, 0, 0, faceWidth, faceHeight);
              let imageData = ctx.getImageData(0, 0, faceWidth, faceHeight).data;
              let data;
              const bytesPerRow = Math.ceil(faceWidth * 4 / 256) * 256;
              if (bytesPerRow == faceWidth * 4) data = imageData;else {
                data = new Uint8ClampedArray(bytesPerRow * faceHeight);
                let pixelsIndex = 0;
                for (let y = 0; y < faceHeight; ++y) {
                  for (let x = 0; x < faceWidth; ++x) {
                    let i = x * 4 + y * bytesPerRow;
                    data[i] = imageData[pixelsIndex];
                    data[i + 1] = imageData[pixelsIndex + 1];
                    data[i + 2] = imageData[pixelsIndex + 2];
                    data[i + 3] = imageData[pixelsIndex + 3];
                    pixelsIndex += 4;
                  }
                }
              }
              imageDatas.push({
                data: data.buffer,
                width: faceWidth,
                height: faceHeight,
                bytesPerRow: bytesPerRow
              });
              faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
              faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
              mipIndex++;
              if (mipIndex == len + 1) self.postMessage({
                src,
                imageDatas: imageDatas,
                ok: true
              });else getMipmapDatas(cvs);
            };
            getMipmapDatas(bitmap);
          });
        }
      }).catch(error => {
        self.postMessage({
          error: errorInfo,
          src: src
        });
      });
    };
  })();
  self.addEventListener('message', e => {
    // console.log('뭐가오지?', e)
    getImage(e.data);
  });
});
const workerGLSLCompile = createWorker(async () => {

  let glslangModule = await import( /* webpackIgnore: true */'https://unpkg.com/@webgpu/glslang@0.0.15/dist/web-devel/glslang.js');
  let glslang = await glslangModule.default();
  let twgslLib;
  let checkTwgsl = async function () {
    return new Promise(async resolve => {
      if (!twgslLib) {
        await import( /* webpackIgnore: true */'https://preview.babylonjs.com/twgsl/twgsl.js');
        // await import(/* webpackIgnore: true */ 'https://redcamel.github.io/RedGPU/libs/twgsl.js');
        console.log('twgsl2', twgsl);
        twgslLib = twgsl;
        resolve();
      } else {
        resolve();
      }
    });
  };
  await checkTwgsl().then(_ => {
    return twgslLib('https://preview.babylonjs.com/twgsl/twgsl.wasm');
    // return twgslLib('https://redcamel.github.io/RedGPU/libs/twgsl.wasm')
  }).then(twgsl => {
    let combinations = (_ => {
      let k_combinations = (set, k) => {
        let i, j, combs, head, tailcombs;
        if (k > set.length || k <= 0) return [];
        if (k === set.length) return [set];
        if (k === 1) {
          combs = [];
          for (i = 0; i < set.length; i++) combs.push([set[i]]);
          return combs;
        }
        combs = [];
        for (i = 0; i < set.length - k + 1; i++) {
          head = set.slice(i, i + 1);
          tailcombs = k_combinations(set.slice(i + 1), k - 1);
          for (j = 0; j < tailcombs.length; j++) combs.push(head.concat(tailcombs[j]));
        }
        return combs;
      };
      return set => {
        let k, i, combs, k_combs;
        combs = [];
        for (k = 1; k <= set.length; k++) {
          k_combs = k_combinations(set, k);
          for (i = 0; i < k_combs.length; i++) combs.push(k_combs[i]);
        }
        return combs;
      };
    })();
    let getCompileGLSL = (_ => {
      let parseSource = function (tSource, replaceList) {
        tSource = JSON.parse(JSON.stringify(tSource));
        // console.time('searchTime :' + replaceList);
        let i = replaceList.length;
        while (i--) {
          let tReg = new RegExp(`\/\/\#RedGPU\#${replaceList[i]}\#`, 'gi');
          tSource = tSource.replace(tReg, '');
        }
        // console.timeEnd('searchTime :' + replaceList);
        return tSource;
      };
      return async data => {
        const info = data.src;
        const shaderType = info.shaderType;
        const shaderName = info.shaderName;
        let originSource = info.originSource;
        let temp = {};
        let num = 0;
        //FIXME - 이부분 최적화해야함
        const tList = combinations(info.optionList.sort());
        console.log('조합을 찾아라', shaderType, shaderName, tList.length);
        // console.log(tList)
        let parse = optionList => {
          let searchKey = shaderName + '_' + optionList.join('_');
          if (!temp[searchKey]) {
            temp[searchKey] = 1;
            let parsedSource = parseSource(originSource, optionList);
            // console.time('compileGLSL - in worker : ' + num + ' / ' + shaderType + ' / ' + searchKey);
            let compileGLSL = twgsl.convertSpirV2WGSL(glslang.compileGLSL(parsedSource, shaderType)).replace(/@stride\([0-9]*\)/g, '');
            // console.timeEnd('compileGLSL - in worker : ' + num + ' / ' + shaderType + ' / ' + searchKey);
            num++;
            self.postMessage({
              endCompile: true,
              shaderName: shaderName,
              searchKey: searchKey,
              compileGLSL: compileGLSL,
              shaderType: shaderType
            });
          }
        };
        tList.forEach(newList => {
          parse(newList);
        });
        self.postMessage({
          end: true,
          shaderName: shaderName,
          shaderType: shaderType,
          totalNum: num
        });
      };
    })();
    self.addEventListener('message', e => {
      // console.log('뭐가오지?', e)
      getCompileGLSL(e.data);
    });
  });
});
const RedGPUWorker = {
  loadImageWithWorker: src => {
    return new Promise((resolve, reject) => {
      function handler(e) {
        if (e.data.src === src) {
          workerImage.removeEventListener('message', handler);
          if (e.data.error) reject(e.data.error);
          resolve(e.data);
        }
      }
      workerImage.addEventListener('message', handler);
      workerImage.postMessage({
        src: src,
        workerType: 'image'
      });
    });
  },
  glslParserWorker: (redGPUContext, target, shaderName, originSource, shaderType, optionList) => {
    return new Promise((resolve, reject) => {
      function handler(e) {
        if (e.data.shaderName === shaderName && e.data.shaderType === shaderType) {
          if (e.data.endCompile) {
            // console.log('오니', e.data.searchKey)
            let tSearchKey = e.data.searchKey;
            if (!target.sourceMap.has(tSearchKey)) {
              console.log('머가오는겨', e.data.searchKey, e.data);
              target.sourceMap.set(tSearchKey, e.data.compileGLSL);
              let shaderModuleDescriptor = {
                key: tSearchKey,
                code: e.data.compileGLSL
                // source: this.sourceMap.get(searchKey)
              };

              target.shaderModuleMap[tSearchKey] = redGPUContext.device.createShaderModule(shaderModuleDescriptor);
            }
            if (e.data.error) reject(e.data.error);
          }
          if (e.data.end) {
            workerGLSLCompile.removeEventListener('message', handler);
            resolve(e);
          }
        }
      }
      workerGLSLCompile.addEventListener('message', handler);
      workerGLSLCompile.postMessage({
        src: {
          originSource: originSource,
          shaderName: shaderName,
          shaderType: shaderType,
          optionList: optionList
        },
        workerType: 'compileGLSL'
      });
    });
  }
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 17:50:10
 *
 */
const SRC_MAP = {};

//TODO 정리해야함

class ImageLoader extends UUID {
  constructor(redGPUContext, src, callback, type = ImageLoader.TYPE_2D) {
    super();
    this.callback = callback;
    if (type === ImageLoader.TYPE_2D) {
      let path = location.pathname.split('/');
      if (path.length > 1) path.pop();
      let targetSRC = location.origin + path.join('/') + '/' + src;
      if (src.includes(';base64,') || src.includes('://')) targetSRC = src;
      if (SRC_MAP[targetSRC]) {
        if (SRC_MAP[targetSRC].loaded) {
          console.log('곧장 맵찾으러감', SRC_MAP[targetSRC]);
          this['imageDatas'] = SRC_MAP[targetSRC]['imageDatas'];
          if (callback) callback.call(this, {
            ok: true
          });
        } else {
          SRC_MAP[targetSRC].tempList.push(this);
        }
      } else {
        SRC_MAP[targetSRC] = {
          loaded: false,
          tempList: []
        };
        SRC_MAP[targetSRC].tempList.push(this);
        RedGPUWorker.loadImageWithWorker(targetSRC).then(result => {
          // console.log('result', result);
          // console.log('첫 로딩업데이트 해야될 대상', SRC_MAP[targetSRC]);
          SRC_MAP[targetSRC].loaded = true;
          SRC_MAP[targetSRC]['imageDatas'] = result['imageDatas'];
          SRC_MAP[targetSRC].tempList.forEach(loader => {
            loader['imageDatas'] = SRC_MAP[targetSRC]['imageDatas'];
            if (loader.callback) loader.callback.call(loader, result);
          });
          SRC_MAP[targetSRC].tempList.length = 0;
        }).catch(result => {
          console.log('로딩실패!', result);
          SRC_MAP[targetSRC].tempList.forEach(loader => {
            if (loader.callback) loader.callback.call(loader, result);
          });
          SRC_MAP[targetSRC].tempList.length = 0;
        });
      }
    } else {
      let maxW = 0;
      let maxH = 0;
      let loadCount = 0;
      let imgList = [];
      let srcList = src;
      srcList.forEach((src, face) => {
        if (!src) ; else {
          let path = location.pathname.split('/');
          if (path.length > 1) path.pop();
          let targetSRC = location.origin + path.join('/') + '/' + src;
          if (src.includes(';base64,') || src.includes('://')) {
            targetSRC = src;
          }
          if (SRC_MAP[targetSRC]) {
            if (SRC_MAP[targetSRC].loaded) {
              console.log('곧장 맵찾으러감');
              this['imageDatas'] = SRC_MAP[targetSRC]['imageDatas'];
              if (callback) callback.call(this, {
                ok: true
              });
            } else {
              SRC_MAP[targetSRC].tempList.push(this);
            }
          } else {
            SRC_MAP[targetSRC] = {
              loaded: false,
              imgList: imgList,
              tempList: []
            };
            SRC_MAP[targetSRC].tempList.push(this);
            RedGPUWorker.loadImageWithWorker(targetSRC).then(result => {
              imgList[face] = result;
              loadCount++;
              maxW = Math.max(maxW, result.imageDatas[0].width);
              maxH = Math.max(maxH, result.imageDatas[0].height);
              if (maxW > 1920) maxW = 1920;
              if (maxH > 1920) maxH = 1920;
              // console.log('result', result);
              // console.log('첫 로딩업데이트 해야될 대상', SRC_MAP[targetSRC]);
              if (loadCount == 6) {
                SRC_MAP[targetSRC].loaded = true;
                SRC_MAP[targetSRC]['imgList'] = imgList;
                SRC_MAP[targetSRC]['maxW'] = maxW;
                SRC_MAP[targetSRC]['maxH'] = maxH;
                SRC_MAP[targetSRC].tempList.forEach(loader => {
                  loader['imgList'] = SRC_MAP[targetSRC]['imgList'];
                  loader['maxW'] = SRC_MAP[targetSRC]['maxW'];
                  loader['maxH'] = SRC_MAP[targetSRC]['maxH'];
                  if (loader.callback) loader.callback.call(loader, result);
                });
                SRC_MAP[targetSRC].tempList.length = 0;
              }
            }).catch(result => {
              console.log('로딩실패!', targetSRC, result);
              SRC_MAP[targetSRC].tempList.forEach(loader => {
                if (loader.callback) loader.callback.call(loader, result);
              });
              SRC_MAP[targetSRC].tempList.length = 0;
            });
          }
        }
      });
    }
  }
}
_defineProperty(ImageLoader, "TYPE_2D", 'TYPE_2D');
_defineProperty(ImageLoader, "TYPE_CUBE", 'TYPE_CUBE');

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.6 18:57:8
 *
 */
function CopyBufferToTexture(commandEncoder, device, imageDatas, gpuTexture, updateTarget, face = -1) {
  let promise = new Promise((resolve, reject) => {
    imageDatas.forEach((info, mip) => {
      if (!updateTarget.useMipmap && mip) return;
      if (mip > updateTarget.mipMaps) return;
      let data = new Uint8ClampedArray(info.data);
      let width = info.width;
      let height = info.height;
      let bytesPerRow = info.bytesPerRow;
      const textureDataBuffer = device.createBuffer({
        size: data.byteLength + data.byteLength % 4,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
      });
      // console.log(imageData)
      // textureDataBuffer.setSubData(0, data);
      device.queue.writeBuffer(textureDataBuffer, 0, data);
      const bufferView = {
        buffer: textureDataBuffer,
        bytesPerRow: bytesPerRow,
        rowsPerImage: height
      };
      const textureView = {
        texture: gpuTexture,
        mipLevel: mip,
        origin: {
          z: Math.max(face, 0)
        }
      };
      const textureExtent = {
        width: width,
        height: height,
        depthOrArrayLayers: 1
      };
      commandEncoder.copyBufferToTexture(bufferView, textureView, textureExtent);
      if (RedGPUContext.useDebugConsole) console.log('mip', mip, 'width', width, 'height', height);
    });
    resolve();
  });
  return promise;
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */
var _updateList = /*#__PURE__*/new WeakMap();
class BaseTexture extends UUID {
  constructor() {
    super();
    _classPrivateFieldInitSpec(this, _updateList, {
      writable: true,
      value: []
    });
    _defineProperty(this, "_GPUTexture", void 0);
    _defineProperty(this, "_GPUTextureView", void 0);
  }
  get GPUTexture() {
    return this._GPUTexture;
  }
  get GPUTextureView() {
    return this._GPUTextureView;
  }
  resolve(texture) {
    this._GPUTexture = texture;
    if (this instanceof BitmapTexture) this._GPUTextureView = texture ? texture.createView() : null;else {
      this._GPUTexture = texture;
      console.log(this);
      if (texture._GPUTextureView) {
        this._GPUTextureView = texture._GPUTextureView;
      } else {
        texture._GPUTextureView = this._GPUTextureView = texture ? texture.createView({
          format: 'rgba8unorm',
          dimension: 'cube',
          aspect: 'all',
          baseMipLevel: 0,
          mipLevelCount: this.mipMaps + 1,
          baseArrayLayer: 0,
          arrayLayerCount: 6
        }) : null;
      }
    }
    let i = _classPrivateFieldGet(this, _updateList).length;
    while (i--) {
      let data = _classPrivateFieldGet(this, _updateList)[i];
      data[0][data[1]] = this;
    }
    _classPrivateFieldGet(this, _updateList).length = 0;
  }
  addUpdateTarget(target, key) {
    _classPrivateFieldGet(this, _updateList).push([target, key]);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */
let defaultSampler;
const MIPMAP_TABLE = new Map();
let makeMipmap = function (redGPUContext, imageDatas, targetTexture) {
  let tW, tH, textureDescriptor, gpuTexture, commandEncoder;
  tW = imageDatas[0].width;
  tH = imageDatas[0].height;
  if (targetTexture.useMipmap) {
    targetTexture.mipMaps = Math.round(Math.log2(Math.max(tW, tH)));
    if (targetTexture.mipMaps > 10) targetTexture.mipMaps = 10;
  }
  textureDescriptor = {
    size: {
      width: tW,
      height: tH,
      depthOrArrayLayers: 1
    },
    dimension: '2d',
    format: 'rgba8unorm',
    sampleCount: 1,
    // arrayLayerCount: 1,
    mipLevelCount: targetTexture.useMipmap ? targetTexture.mipMaps + 1 : 1,
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING
  };
  gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
  MIPMAP_TABLE.set(targetTexture.mapKey, gpuTexture);
  commandEncoder = redGPUContext.device.createCommandEncoder({});
  CopyBufferToTexture(commandEncoder, redGPUContext.device, imageDatas, gpuTexture, targetTexture).then(_ => {
    redGPUContext.device.queue.submit([commandEncoder.finish()]);
    targetTexture.resolve(gpuTexture);
    if (targetTexture.onload) targetTexture.onload(targetTexture);
  });
};
class BitmapTexture extends BaseTexture {
  //TODO 옵션값이 바뀌면 어떻게 할건지 결정해야함
  constructor(redGPUContext, src, sampler, useMipmap = true, onload, onerror) {
    super();
    if (!defaultSampler) defaultSampler = new Sampler(redGPUContext);
    this.sampler = sampler || defaultSampler;
    this.onload = onload;
    this.onerror = onerror;
    this.mapKey = src + useMipmap + this.sampler.string;
    this.useMipmap = useMipmap;
    if (!src) {
      console.log('src');
    } else {
      let self = this;
      new ImageLoader(redGPUContext, src, function (e) {
        // console.log(MIPMAP_TABLE)
        // console.log(self.mapKey)
        if (MIPMAP_TABLE.get(self.mapKey)) {
          console.log('BitmapTexture - 캐싱사용', e);
          self.resolve(MIPMAP_TABLE.get(self.mapKey));
          if (self.onload) self.onload(self);
        } else {
          console.log('BitmapTexture - 신규생성', e);
          if (e.ok) makeMipmap(redGPUContext, this.imageDatas, self);else {
            self.resolve(null);
            if (self.onerror) self.onerror(self);
          }
        }
      }, ImageLoader.TYPE_2D);
    }
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 20:9:14
 *
 */
let defaultSampler$1;
const MIPMAP_TABLE$1 = new Map();
let makeMipmap$1 = function (redGPUContext, imgList, targetTexture) {
  let tW, tH, textureDescriptor, gpuTexture, commandEncoder;
  tW = imgList[0].imageDatas[0].width;
  tH = imgList[0].imageDatas[0].height;
  if (targetTexture.useMipmap) {
    targetTexture.mipMaps = Math.round(Math.log2(Math.max(tW, tH)));
    if (targetTexture.mipMaps > 10) targetTexture.mipMaps = 10;
  }
  textureDescriptor = {
    size: {
      width: tW,
      height: tH,
      depthOrArrayLayers: targetTexture instanceof BitmapTexture ? 1 : 6
    },
    dimension: '2d',
    format: 'rgba8unorm',
    // sampleCount: 1,
    mipLevelCount: targetTexture.useMipmap ? targetTexture.mipMaps + 1 : 1,
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING
  };
  gpuTexture = redGPUContext.device.createTexture(textureDescriptor);
  MIPMAP_TABLE$1.set(targetTexture.mapKey, gpuTexture);
  let promiseList = [];
  commandEncoder = redGPUContext.device.createCommandEncoder({});
  imgList.forEach((imgInfo, face) => {
    promiseList.push(CopyBufferToTexture(commandEncoder, redGPUContext.device, imgInfo.imageDatas, gpuTexture, targetTexture, face));
  });
  Promise.all(promiseList).then(_ => {
    redGPUContext.device.queue.submit([commandEncoder.finish()]);
    console.log('이놈은뭐냐', gpuTexture);
    targetTexture.resolve(gpuTexture);
    if (targetTexture.onload) targetTexture.onload.call(targetTexture);
  });
};
class BitmapCubeTexture extends BaseTexture {
  constructor(redGPUContext, srcList, sampler, useMipmap = true, onload, onerror) {
    super();
    if (!defaultSampler$1) defaultSampler$1 = new Sampler(redGPUContext);
    this.sampler = sampler || defaultSampler$1;
    this.onload = onload;
    this.onerror = onerror;
    this.mapKey = srcList + useMipmap + this.sampler.string;
    this.useMipmap = useMipmap;
    if (!srcList) {
      console.log('src');
    } else {
      let self = this;
      new ImageLoader(redGPUContext, srcList, function (e) {
        // console.log(MIPMAP_TABLE.get(self.mapKey));
        //FIXME - 캐싱이 왜안되나
        if (MIPMAP_TABLE$1.get(self.mapKey)) {
          console.log('BitmapCubeTexture - 캐싱사용', e);
          console.log('뭐가오는거지', MIPMAP_TABLE$1);
          self.resolve(MIPMAP_TABLE$1.get(self.mapKey));
          if (self.onload) self.onload(self);
        } else {
          console.log('BitmapCubeTexture - 신규생성', e);
          if (e.ok) makeMipmap$1(redGPUContext, this.imgList, self);else {
            self.resolve(null);
            if (self.onerror) self.onerror(self);
          }
        }
      }, ImageLoader.TYPE_CUBE);
    }
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */
class TextureLoader extends UUID {
  constructor(redGPUContext, srcInfoList, callback, progressCallback) {
    super();
    _defineProperty(this, "textures", []);
    let loaded, check;
    srcInfoList = srcInfoList || [];
    loaded = 0;
    check = _ => {
      loaded++;
      if (progressCallback) progressCallback.call(this, {
        totalNum: srcInfoList.length,
        loaded: loaded
      });
      if (loaded == srcInfoList.length) {
        requestAnimationFrame(_ => {
          if (callback) callback.call(this, this);
        });
      }
    };
    if (srcInfoList.length) {
      srcInfoList.forEach((srcInfo, idx) => {
        let t0, tSrc, tSampler;
        let targetClass = BitmapTexture;
        if (srcInfo.hasOwnProperty('src')) {
          tSrc = srcInfo.src;
          tSampler = srcInfo.sampler;
        } else tSrc = srcInfo;
        if (tSrc instanceof Array) targetClass = BitmapCubeTexture;
        t0 = {
          src: tSrc,
          texture: null,
          loadEnd: false,
          loadSuccess: false,
          userInfo: srcInfo
        };
        t0.texture = new targetClass(redGPUContext, tSrc, tSampler, true, function (e) {
          // console.log('onload', this);
          t0.loadSuccess = true;
          t0.loadEnd = true;
          check();
        }, function (e) {
          // console.log('onerror', this, e);
          t0.loadSuccess = false;
          t0.loadEnd = true;
          check();
        });
        // console.log(t0)
        this.textures.push(t0);
      });
    } else {
      requestAnimationFrame(_ => {
        if (callback) callback.call(this, this);
      });
    }

    // console.log(this)
  }

  getTextureByIndex(index) {
    if (this.textures[index]) return this.textures[index].texture;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.17 11:10:39
 *
 */
function gltfAnimationLooper(time, loopList) {
  let currentTime, previousTime, nextTime;
  let nX, nY, nZ, nW, nXOut, nYOut, nZOut, nXIn, nYIn, nZIn, nWIn;
  let pX, pY, pZ, pW, pXOut, pYOut, pZOut, pWOut;
  let x, y, z, w, len;
  let loopListIDX = loopList.length;
  let targetAnimationData;
  let interpolationValue;
  let loopListItem;
  let targetAnimationDataIDX;
  let aniData;
  let target;
  let nextIndex, prevIndex;
  let tTimeData;
  let tAniData;
  let aniDataTime_Length;
  let aniDataTimeIDX;
  //weights
  let weights_aniTargetsIDX;
  let weights_targetMesh;
  let weights_targetData;
  let weights_originData;
  let weights_stride;
  let weights_index;
  let weights_LOOP_NUM;
  let weights_prev, weights_next;
  let weights_prev1, weights_next1;
  let weights_prev2, weights_next2;
  let weights_baseIndex;
  let weights_morphLen;
  let weights_tMorphList;
  let weights_morphIndex;
  let weights_prevAniData;
  let weights_nextAniData;
  let weights_morphInterleaveData;
  let weights_cacheKey;
  while (loopListIDX--) {
    loopListItem = loopList[loopListIDX];
    targetAnimationData = loopListItem['targetAnimationData'];
    targetAnimationDataIDX = targetAnimationData.length;
    while (targetAnimationDataIDX--) {
      aniData = targetAnimationData[targetAnimationDataIDX];
      // targetAnimationData.forEach(function (aniData) {
      currentTime = (time - loopListItem['startTime']) % (targetAnimationData['maxTime'] * 1000) / 1000;
      /////////////////////////////////////////////////////////////////////////////////
      target = aniData['target'];
      tTimeData = aniData['time'];
      tAniData = aniData['time'];
      aniDataTime_Length = tTimeData.length;
      aniDataTimeIDX = 0;
      prevIndex = tTimeData.length - 1;
      nextIndex = 0;
      previousTime = tTimeData[prevIndex];
      nextTime = tTimeData[nextIndex];
      for (aniDataTimeIDX; aniDataTimeIDX < aniDataTime_Length; aniDataTimeIDX++) {
        let tTime = tTimeData[aniDataTimeIDX];
        if (tTime < currentTime) {
          prevIndex = aniDataTimeIDX;
          previousTime = tTimeData[prevIndex];
          if (tTimeData[prevIndex + 1] == undefined) {
            nextIndex = 0;
            nextTime = tTimeData[nextIndex];
          } else {
            nextIndex = prevIndex + 1;
            nextTime = tTimeData[nextIndex];
          }
        }
        if (aniDataTimeIDX == 0 && currentTime < tTimeData[aniDataTimeIDX]) {
          prevIndex = aniDataTime_Length - 1;
          previousTime = tTimeData[prevIndex];
          nextIndex = aniDataTimeIDX;
          nextTime = tTimeData[nextIndex];
          currentTime = tTime;
          break;
        }
        if (aniDataTimeIDX == aniDataTime_Length - 1 && currentTime > tTime) {
          prevIndex = 0;
          previousTime = tTimeData[prevIndex];
          nextIndex = aniDataTime_Length - 1;
          nextTime = tTimeData[nextIndex];
          currentTime = tTime;
          break;
        }
      }
      /////////////////////////////////////////////////////////////////////////////////
      if (target) target.dirtyTransform = true;
      if (aniData['interpolation'] == 'CUBICSPLINE') {
        interpolationValue = nextTime - previousTime;
        if (interpolationValue.toString() == 'NaN') interpolationValue = 0;
        let p = (currentTime - previousTime) / interpolationValue;
        if (p.toString() == 'NaN') p = 0;
        let pp = p * p;
        let ppp = pp * p;
        let s2 = -2 * ppp + 3 * pp;
        let s3 = ppp - pp;
        let s0 = 1 - s2;
        let s1 = s3 - pp + p;
        if (target) {
          let startV, startOut, endV, endIn;
          let tAniData_data = aniData['data'];
          switch (aniData['key']) {
            case 'rotation':
              // quat.normalize(prevRotation, prevRotation);
              // quat.normalize(nextRotation, nextRotation);
              // quat.normalize(prevRotationOut, prevRotationOut);
              // quat.normalize(nextRotationIn, nextRotationIn);
              // prevRotation
              x = tAniData_data[prevIndex * 12 + 4];
              y = tAniData_data[prevIndex * 12 + 5];
              z = tAniData_data[prevIndex * 12 + 6];
              w = tAniData_data[prevIndex * 12 + 7];
              len = x * x + y * y + z * z + w * w;
              if (len > 0) len = 1 / Math.sqrt(len);
              pX = x * len;
              pY = y * len;
              pZ = z * len;
              pW = w * len;
              // nextRotation
              x = tAniData_data[nextIndex * 12 + 4];
              y = tAniData_data[nextIndex * 12 + 5];
              z = tAniData_data[nextIndex * 12 + 6];
              w = tAniData_data[nextIndex * 12 + 7];
              len = x * x + y * y + z * z + w * w;
              if (len > 0) len = 1 / Math.sqrt(len);
              nX = x * len;
              nY = y * len;
              nZ = z * len;
              nW = w * len;
              // prevRotationOut
              x = tAniData_data[prevIndex * 12 + 8];
              y = tAniData_data[prevIndex * 12 + 9];
              z = tAniData_data[prevIndex * 12 + 10];
              w = tAniData_data[prevIndex * 12 + 11];
              len = x * x + y * y + z * z + w * w;
              if (len > 0) len = 1 / Math.sqrt(len);
              pXOut = x * len;
              pYOut = y * len;
              pZOut = z * len;
              pWOut = w * len;
              // nexRotationIn
              x = tAniData_data[prevIndex * 12 + 0];
              y = tAniData_data[prevIndex * 12 + 1];
              z = tAniData_data[prevIndex * 12 + 2];
              w = tAniData_data[prevIndex * 12 + 3];
              len = x * x + y * y + z * z + w * w;
              if (len > 0) len = 1 / Math.sqrt(len);
              nXIn = x * len;
              nYIn = y * len;
              nZIn = z * len;
              nWIn = w * len;

              // tQuat
              if (prevIndex != aniDataTime_Length - 1) {
                startV = pX;
                startOut = pXOut * interpolationValue;
                endV = nX;
                endIn = nXIn * interpolationValue;
                x = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
                //
                startV = pY;
                startOut = pYOut * interpolationValue;
                endV = nY;
                endIn = nYIn * interpolationValue;
                y = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
                //
                startV = pZ;
                startOut = pZOut * interpolationValue;
                endV = nZ;
                endIn = nZIn * interpolationValue;
                z = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
                //
                startV = pW;
                startOut = pWOut * interpolationValue;
                endV = nW;
                endIn = nWIn * interpolationValue;
                w = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
                let rotationMTX = [];
                let tRotation = [0, 0, 0];
                // UTIL.quaternionToRotationMat4(tQuat, rotationMTX);
                // UTIL.mat4ToEuler(rotationMTX, tRotation);
                let x2 = x + x,
                  y2 = y + y,
                  z2 = z + z;
                let xx = x * x2,
                  xy = x * y2,
                  xz = x * z2;
                let yy = y * y2,
                  yz = y * z2,
                  zz = z * z2;
                let wx = w * x2,
                  wy = w * y2,
                  wz = w * z2;
                rotationMTX[0] = 1 - (yy + zz);
                rotationMTX[4] = xy - wz;
                rotationMTX[8] = xz + wy;
                rotationMTX[1] = xy + wz;
                rotationMTX[5] = 1 - (xx + zz);
                rotationMTX[9] = yz - wx;
                rotationMTX[2] = xz - wy;
                rotationMTX[6] = yz + wx;
                rotationMTX[10] = 1 - (xx + yy);
                // last column
                rotationMTX[3] = 0;
                rotationMTX[7] = 0;
                rotationMTX[11] = 0;
                // bottom row
                rotationMTX[12] = 0;
                rotationMTX[13] = 0;
                rotationMTX[14] = 0;
                rotationMTX[15] = 1;
                // Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
                let m11 = rotationMTX[0],
                  m12 = rotationMTX[4],
                  m13 = rotationMTX[8];
                let m22 = rotationMTX[5],
                  m23 = rotationMTX[9];
                let m32 = rotationMTX[6],
                  m33 = rotationMTX[10];
                tRotation[1] = Math.asin(Math.max(-1, Math.min(1, m13)));
                if (Math.abs(m13) < 0.99999) {
                  tRotation[0] = Math.atan2(-m23, m33);
                  tRotation[2] = Math.atan2(-m12, m11);
                } else {
                  tRotation[0] = Math.atan2(m32, m22);
                  tRotation[2] = 0;
                }
                tRotation[0] = -(tRotation[0] * 180 / Math.PI);
                tRotation[1] = -(tRotation[1] * 180 / Math.PI);
                tRotation[2] = -(tRotation[2] * 180 / Math.PI);
                target._rotationX = tRotation[0];
                target._rotationY = tRotation[1];
                target._rotationZ = tRotation[2];
              }
              break;
            case 'translation':
              nX = tAniData_data[prevIndex * 9 + 3];
              nY = tAniData_data[prevIndex * 9 + 4];
              nZ = tAniData_data[prevIndex * 9 + 5];
              pX = tAniData_data[nextIndex * 9 + 3];
              pY = tAniData_data[nextIndex * 9 + 4];
              pZ = tAniData_data[nextIndex * 9 + 5];
              pXOut = tAniData_data[prevIndex * 9 + 6];
              pYOut = tAniData_data[prevIndex * 9 + 7];
              pZOut = tAniData_data[prevIndex * 9 + 8];
              nXOut = tAniData_data[nextIndex * 9 + 0];
              nYOut = tAniData_data[nextIndex * 9 + 1];
              nZOut = tAniData_data[nextIndex * 9 + 2];
              if (prevIndex != aniDataTime_Length - 1) {
                startV = pX;
                startOut = pXOut * interpolationValue;
                endV = nX;
                endIn = nXOut * interpolationValue;
                target._x = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
                startV = pY;
                startOut = pYOut * interpolationValue;
                endV = nY;
                endIn = nYOut * interpolationValue;
                target._y = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
                startV = pZ;
                startOut = pZOut * interpolationValue;
                endV = nZ;
                endIn = nZOut * interpolationValue;
                target._z = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
              }
              break;
            case 'scale':
              nX = tAniData_data[prevIndex * 9 + 3];
              nY = tAniData_data[prevIndex * 9 + 4];
              nZ = tAniData_data[prevIndex * 9 + 5];
              pX = tAniData_data[nextIndex * 9 + 3];
              pY = tAniData_data[nextIndex * 9 + 4];
              pZ = tAniData_data[nextIndex * 9 + 5];
              pXOut = tAniData_data[prevIndex * 9 + 6];
              pYOut = tAniData_data[prevIndex * 9 + 7];
              pZOut = tAniData_data[prevIndex * 9 + 8];
              nXOut = tAniData_data[nextIndex * 9 + 0];
              nYOut = tAniData_data[nextIndex * 9 + 1];
              nZOut = tAniData_data[nextIndex * 9 + 2];
              if (prevIndex != aniDataTime_Length - 1) {
                startV = pX;
                startOut = pXOut * interpolationValue;
                endV = nX;
                endIn = nXOut * interpolationValue;
                target._scaleX = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
                startV = pY;
                startOut = pYOut * interpolationValue;
                endV = nY;
                endIn = nYOut * interpolationValue;
                target._scaleY = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
                startV = pZ;
                startOut = pZOut * interpolationValue;
                endV = nZ;
                endIn = nZOut * interpolationValue;
                target._scaleZ = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
              }
              break;
            case 'weights':
              weights_aniTargetsIDX = aniData['targets'].length;
              while (weights_aniTargetsIDX--) {
                weights_targetMesh = aniData['targets'][weights_aniTargetsIDX];
                weights_targetData = weights_targetMesh['geometry']['interleaveBuffer']['data'];
                weights_originData = weights_targetMesh['_morphInfo']['origin'];
                weights_stride = weights_targetMesh['geometry']['interleaveBuffer']['stride'];
                weights_LOOP_NUM = weights_targetData.length / weights_stride;
                weights_morphLen = weights_targetMesh['_morphInfo']['list'].length;
                tAniData = aniData['data'];
                weights_tMorphList = weights_targetMesh['_morphInfo']['list'];
                if (!weights_tMorphList['cacheData']) weights_tMorphList['cacheData'] = {};
                let t1;
                weights_index = 0;
                for (weights_index; weights_index < weights_LOOP_NUM; weights_index++) {
                  weights_baseIndex = weights_index * weights_stride;
                  weights_cacheKey = weights_tMorphList['cacheData'][weights_baseIndex + '_' + prevIndex + '_' + nextIndex];
                  if (weights_cacheKey) {
                    weights_prev = weights_cacheKey[0];
                    weights_next = weights_cacheKey[1];
                    weights_prev1 = weights_cacheKey[2];
                    weights_next1 = weights_cacheKey[3];
                    weights_prev2 = weights_cacheKey[4];
                    weights_next2 = weights_cacheKey[5];
                  } else {
                    weights_prev = weights_originData[weights_baseIndex];
                    weights_next = weights_originData[weights_baseIndex];
                    weights_prev1 = weights_originData[weights_baseIndex + 1];
                    weights_next1 = weights_originData[weights_baseIndex + 1];
                    weights_prev2 = weights_originData[weights_baseIndex + 2];
                    weights_next2 = weights_originData[weights_baseIndex + 2];
                    weights_morphIndex = weights_morphLen;
                    while (weights_morphIndex--) {
                      if (weights_morphIndex % 3 == 1) {
                        weights_prevAniData = tAniData[prevIndex * weights_morphLen + weights_morphIndex];
                        weights_nextAniData = tAniData[nextIndex * weights_morphLen + weights_morphIndex];
                        weights_morphInterleaveData = weights_tMorphList[weights_morphIndex]['interleaveData'];
                        t1 = weights_morphInterleaveData[weights_baseIndex];
                        weights_prev += weights_prevAniData * t1;
                        weights_next += weights_nextAniData * t1;
                        t1 = weights_morphInterleaveData[weights_baseIndex + 1];
                        weights_prev1 += weights_prevAniData * t1;
                        weights_next1 += weights_nextAniData * t1;
                        t1 = weights_morphInterleaveData[weights_baseIndex + 2];
                        weights_prev2 += weights_prevAniData * t1;
                        weights_next2 += weights_nextAniData * t1;
                      }
                    }
                    weights_tMorphList['cacheData'][weights_baseIndex + '_' + prevIndex + '_' + nextIndex] = [weights_prev, weights_next, weights_prev1, weights_next1, weights_prev2, weights_next2];
                  }
                  weights_targetData[weights_baseIndex] = weights_prev + interpolationValue * (weights_next - weights_prev);
                  weights_targetData[weights_baseIndex + 1] = weights_prev1 + interpolationValue * (weights_next1 - weights_prev1);
                  weights_targetData[weights_baseIndex + 2] = weights_prev2 + interpolationValue * (weights_next2 - weights_prev2);
                }
                weights_targetMesh['geometry']['interleaveBuffer'].update(weights_targetData);
              }
              break;
          }
        }
      } else {
        if (aniData['interpolation'] == 'STEP') interpolationValue = 0;else interpolationValue = (currentTime - previousTime) / (nextTime - previousTime);
        if (interpolationValue.toString() == 'NaN') interpolationValue = 0;
        if (target) {
          let tAniData_data = aniData['data'];
          switch (aniData['key']) {
            case 'rotation':
              /////////////////////////////////////////////
              // quat.normalize(prevRotation, prevRotation);
              // quat.normalize(nextRotation, nextRotation);
              // prevRotation
              x = tAniData_data[prevIndex * 4];
              y = tAniData_data[prevIndex * 4 + 1];
              z = tAniData_data[prevIndex * 4 + 2];
              w = tAniData_data[prevIndex * 4 + 3];
              len = x * x + y * y + z * z + w * w;
              if (len > 0) len = 1 / Math.sqrt(len);
              pX = x * len;
              pY = y * len;
              pZ = z * len;
              pW = w * len;
              // nextRotation
              x = tAniData_data[nextIndex * 4];
              y = tAniData_data[nextIndex * 4 + 1];
              z = tAniData_data[nextIndex * 4 + 2];
              w = tAniData_data[nextIndex * 4 + 3];
              len = x * x + y * y + z * z + w * w;
              if (len > 0) len = 1 / Math.sqrt(len);
              nX = x * len;
              nY = y * len;
              nZ = z * len;
              nW = w * len;
              /////////////////////////////////////////////
              let omega, cosom, sinom, scale0, scale1;
              // calc cosine
              cosom = pX * nX + pY * nY + pZ * nZ + pW * nW;
              // adjust signs (if necessary)
              if (cosom < 0.0) {
                cosom = -cosom;
                nX = -nX;
                nY = -nY;
                nZ = -nZ;
                nW = -nW;
              }
              // calculate coefficients
              if (1.0 - cosom > t.glMatrix.EPSILON) {
                // standard case (slerp)
                omega = Math.acos(cosom);
                sinom = Math.sin(omega);
                scale0 = Math.sin((1.0 - interpolationValue) * omega) / sinom;
                scale1 = Math.sin(interpolationValue * omega) / sinom;
              } else {
                // "from" and "to" quaternions are very close
                //  ... so we can do a linear interpolation
                scale0 = 1.0 - interpolationValue;
                scale1 = interpolationValue;
              }
              // calculate final values
              // tQuat
              x = scale0 * pX + scale1 * nX;
              y = scale0 * pY + scale1 * nY;
              z = scale0 * pZ + scale1 * nZ;
              w = scale0 * pW + scale1 * nW;
              let rotationMTX = [];
              let tRotation = [0, 0, 0];
              // UTIL.quaternionToRotationMat4(tQuat, rotationMTX);
              // UTIL.mat4ToEuler(rotationMTX, tRotation);
              //////////////////////////////////////////////////////////
              let x2 = x + x,
                y2 = y + y,
                z2 = z + z;
              let xx = x * x2,
                xy = x * y2,
                xz = x * z2;
              let yy = y * y2,
                yz = y * z2,
                zz = z * z2;
              let wx = w * x2,
                wy = w * y2,
                wz = w * z2;
              rotationMTX[0] = 1 - (yy + zz);
              rotationMTX[4] = xy - wz;
              rotationMTX[8] = xz + wy;
              rotationMTX[1] = xy + wz;
              rotationMTX[5] = 1 - (xx + zz);
              rotationMTX[9] = yz - wx;
              rotationMTX[2] = xz - wy;
              rotationMTX[6] = yz + wx;
              rotationMTX[10] = 1 - (xx + yy);
              // last column
              rotationMTX[3] = 0;
              rotationMTX[7] = 0;
              rotationMTX[11] = 0;
              // bottom row
              rotationMTX[12] = 0;
              rotationMTX[13] = 0;
              rotationMTX[14] = 0;
              rotationMTX[15] = 1;
              // Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
              let m11 = rotationMTX[0],
                m12 = rotationMTX[4],
                m13 = rotationMTX[8];
              let m22 = rotationMTX[5],
                m23 = rotationMTX[9];
              let m32 = rotationMTX[6],
                m33 = rotationMTX[10];
              tRotation[1] = Math.asin(Math.max(-1, Math.min(1, m13)));
              if (Math.abs(m13) < 0.99999) {
                tRotation[0] = Math.atan2(-m23, m33);
                tRotation[2] = Math.atan2(-m12, m11);
              } else {
                tRotation[0] = Math.atan2(m32, m22);
                tRotation[2] = 0;
              }
              //////////////////////////////////////////////////////////
              tRotation[0] = -(tRotation[0] * 180 / Math.PI);
              tRotation[1] = -(tRotation[1] * 180 / Math.PI);
              tRotation[2] = -(tRotation[2] * 180 / Math.PI);
              target._rotationX = tRotation[0];
              target._rotationY = tRotation[1];
              target._rotationZ = tRotation[2];
              break;
            case 'translation':
              // nextTranslation
              nX = tAniData_data[nextIndex * 3];
              nY = tAniData_data[nextIndex * 3 + 1];
              nZ = tAniData_data[nextIndex * 3 + 2];
              // prevTranslation
              pX = tAniData_data[prevIndex * 3];
              pY = tAniData_data[prevIndex * 3 + 1];
              pZ = tAniData_data[prevIndex * 3 + 2];
              target._x = pX + interpolationValue * (nX - pX);
              target._y = pY + interpolationValue * (nY - pY);
              target._z = pZ + interpolationValue * (nZ - pZ);
              break;
            case 'scale':
              // nextScale
              nX = tAniData_data[nextIndex * 3];
              nY = tAniData_data[nextIndex * 3 + 1];
              nZ = tAniData_data[nextIndex * 3 + 2];
              // prevScale
              pX = tAniData_data[prevIndex * 3];
              pY = tAniData_data[prevIndex * 3 + 1];
              pZ = tAniData_data[prevIndex * 3 + 2];
              target._scaleX = pX + interpolationValue * (nX - pX);
              target._scaleY = pY + interpolationValue * (nY - pY);
              target._scaleZ = pZ + interpolationValue * (nZ - pZ);
              break;
            case 'weights':
              weights_aniTargetsIDX = aniData['targets'].length;
              while (weights_aniTargetsIDX--) {
                weights_targetMesh = aniData['targets'][weights_aniTargetsIDX];
                weights_targetData = weights_targetMesh['geometry']['interleaveBuffer']['data'];
                weights_originData = weights_targetMesh['_morphInfo']['origin'];
                weights_stride = weights_targetMesh['geometry']['interleaveBuffer']['stride'];
                weights_LOOP_NUM = weights_targetData.length / weights_stride;
                weights_morphLen = weights_targetMesh['_morphInfo']['list'].length;
                tAniData = aniData['data'];
                weights_tMorphList = weights_targetMesh['_morphInfo']['list'];
                if (!weights_tMorphList['cacheData']) weights_tMorphList['cacheData'] = {};
                let t1;
                weights_index = 0;
                for (weights_index; weights_index < weights_LOOP_NUM; weights_index++) {
                  weights_baseIndex = weights_index * weights_stride;
                  weights_cacheKey = weights_tMorphList['cacheData'][weights_baseIndex + '_' + prevIndex + '_' + nextIndex];
                  if (weights_cacheKey) {
                    weights_prev = weights_cacheKey[0];
                    weights_next = weights_cacheKey[1];
                    weights_prev1 = weights_cacheKey[2];
                    weights_next1 = weights_cacheKey[3];
                    weights_prev2 = weights_cacheKey[4];
                    weights_next2 = weights_cacheKey[5];
                  } else {
                    weights_prev = weights_originData[weights_baseIndex];
                    weights_next = weights_originData[weights_baseIndex];
                    weights_prev1 = weights_originData[weights_baseIndex + 1];
                    weights_next1 = weights_originData[weights_baseIndex + 1];
                    weights_prev2 = weights_originData[weights_baseIndex + 2];
                    weights_next2 = weights_originData[weights_baseIndex + 2];
                    weights_morphIndex = weights_morphLen;
                    while (weights_morphIndex--) {
                      weights_prevAniData = tAniData[prevIndex * weights_morphLen + weights_morphIndex];
                      weights_nextAniData = tAniData[nextIndex * weights_morphLen + weights_morphIndex];
                      weights_morphInterleaveData = weights_tMorphList[weights_morphIndex]['interleaveData'];
                      t1 = weights_morphInterleaveData[weights_baseIndex];
                      weights_prev += weights_prevAniData * t1;
                      weights_next += weights_nextAniData * t1;
                      t1 = weights_morphInterleaveData[weights_baseIndex + 1];
                      weights_prev1 += weights_prevAniData * t1;
                      weights_next1 += weights_nextAniData * t1;
                      t1 = weights_morphInterleaveData[weights_baseIndex + 2];
                      weights_prev2 += weights_prevAniData * t1;
                      weights_next2 += weights_nextAniData * t1;
                    }
                    weights_tMorphList['cacheData'][weights_baseIndex + '_' + prevIndex + '_' + nextIndex] = [weights_prev, weights_next, weights_prev1, weights_next1, weights_prev2, weights_next2];
                  }
                  weights_targetData[weights_baseIndex] = weights_prev + interpolationValue * (weights_next - weights_prev);
                  weights_targetData[weights_baseIndex + 1] = weights_prev1 + interpolationValue * (weights_next1 - weights_prev1);
                  weights_targetData[weights_baseIndex + 2] = weights_prev2 + interpolationValue * (weights_next2 - weights_prev2);
                }
                weights_targetMesh['geometry']['interleaveBuffer'].update(weights_targetData);
              }
              break;
          }
        }
      }
      // })
    }
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */

const WEBGL_COMPONENT_TYPES = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */
class AccessorInfo_GLTF {
  constructor(redGLTFLoader, json, accessorIndex) {
    this['accessor'] = json['accessors'][accessorIndex];
    this['bufferView'] = json['bufferViews'][this['accessor']['bufferView']];
    this['bufferIndex'] = this['bufferView']['buffer'];
    this['buffer'] = json['buffers'][this['bufferIndex']];
    this['bufferURIDataView'] = null;
    if (this['buffer']['uri']) {
      this['bufferURIDataView'] = redGLTFLoader['parsingResult']['uris']['buffers'][this['bufferIndex']];
    }
    ////////////////////////////
    this['componentType'] = WEBGL_COMPONENT_TYPES[this['accessor']['componentType']];
    this['componentType_BYTES_PER_ELEMENT'] = this['componentType']['BYTES_PER_ELEMENT'];
    switch (this['componentType']) {
      case Float32Array:
        this['getMethod'] = 'getFloat32';
        break;
      case Uint32Array:
        this['getMethod'] = 'getUint32';
        break;
      case Uint16Array:
        this['getMethod'] = 'getUint16';
        break;
      case Int16Array:
        this['getMethod'] = 'getInt16';
        break;
      case Uint8Array:
        this['getMethod'] = 'getUint8';
        break;
      case Int8Array:
        this['getMethod'] = 'getInt8';
        break;
      default:
        UTIL.throwFunc('파싱할수없는 타입', this['componentType']);
    }
    this['accessorBufferOffset'] = this['accessor']['byteOffset'] || 0;
    this['bufferViewOffset'] = this['bufferView']['byteOffset'] || 0;
    this['bufferViewByteStride'] = this['bufferView']['byteStride'] || 0;
    this['startIndex'] = (this['bufferViewOffset'] + this['accessorBufferOffset']) / this['componentType_BYTES_PER_ELEMENT'];
    // console.log('해당 bufferView 정보', this['bufferView'])
    // console.log('바라볼 버퍼 인덱스', this['bufferIndex'])
    // console.log('바라볼 버퍼', this['buffer'])
    // console.log('바라볼 버퍼데이터', this['bufferURIDataView'])
    // console.log('바라볼 엑세서', this['accessor'])
    // console.log('this['componentType']', this['componentType'])
    // console.log("this['getMethod']", this['getMethod'])
    // console.log("this['bufferView']['byteOffset']", this['bufferView']['byteOffset'])
    // console.log("this['accessor']['byteOffset']", this['accessor']['byteOffset'])
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
let parseAnimationInfo;
parseAnimationInfo = function (redGLTFLoader, json, accessorIndex) {
  // console.time("parseAnimationInfo_" + redGLTFLoader.fileName+'_'+accessorIndex)
  let dataList = [];
  let accessorInfo = new AccessorInfo_GLTF(redGLTFLoader, json, accessorIndex);
  let tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
  let tBufferURIDataView = accessorInfo['bufferURIDataView'];
  let tGetMethod = accessorInfo['getMethod'];
  let tType = accessorInfo['accessor']['type'];
  let tCount = accessorInfo['accessor']['count'];
  let i = accessorInfo['startIndex'];
  let len;
  switch (tType) {
    case 'SCALAR':
      len = i + tCount * 1;
      for (i; i < len; i++) dataList.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
      break;
    case 'VEC4':
      len = i + tCount * 4;
      for (i; i < len; i++) dataList.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
      break;
    case 'VEC3':
      len = i + tCount * 3;
      for (i; i < len; i++) dataList.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
      break;
    default:
      console.log('알수없는 형식 엑세서 타입', accessorInfo['accessor']);
      break;
  }
  // console.timeEnd("parseAnimationInfo_" + redGLTFLoader.fileName+'_'+accessorIndex)
  return dataList;
};
let parseAnimation_GLTF = function (redGLTFLoader, json, callback) {
  return new Promise(resolve => {
    if (RedGPUContext.useDebugConsole) console.log('Animation parsing has start.');
    if (!json['animations']) json['animations'] = [];
    if (json['animations'].length) {
      let nodes = json['nodes'];
      let meshes = json['meshes'];
      let current = 0,
        total = 0;
      console.log(json['animations']);
      json['animations'].forEach(function (v) {
        let samplers = v['samplers'];
        //TODO: 용어를 정리해봐야겠음.
        // 이걸 애니메이션 클립으로 봐야하는가..
        let animationClip = [];
        animationClip['minTime'] = 10000000;
        animationClip['maxTime'] = -1;
        animationClip['name'] = v['name'];
        // 로더에 애니메이션 데이터들을 입력함
        redGLTFLoader['parsingResult']['animations'].push(animationClip);
        // 채널을 돌면서 파악한다.
        let i = 0;
        const len = v['channels'].length;
        total += len;
        let parseChannels = index => {
          let tSampler;
          let tChannelTargetData;
          let tMesh;
          let tNode;
          let aniTrack; //
          let targets = [];
          let channel = v['channels'][index];
          tSampler = samplers[channel['sampler']];
          tChannelTargetData = channel['target'];
          tNode = nodes[tChannelTargetData['node']];
          if ('mesh' in tNode) {
            tMesh = tNode['Mesh'];
            meshes[tNode['mesh']]['primitives'].forEach(v => targets.push(v['Mesh']));
          } else {
            let tGroup;
            if (redGLTFLoader['parsingResult']['groups'][tChannelTargetData['node']]) {
              tGroup = redGLTFLoader['parsingResult']['groups'][tChannelTargetData['node']];
              tMesh = tGroup;
              // console.log('tGroup', tGroup)
            } else return console.log('여기로 오는경우가 있는건가2');
          }
          if (tChannelTargetData['path'] == 'scale' || tChannelTargetData['path'] == 'rotation' || tChannelTargetData['path'] == 'translation' || tChannelTargetData['path'] == 'weights') {
            // console.log('path', tChannelTargetData['path'])
            // // 시간축은 샘플의 input
            // console.log('시간축', tSampler['input'])
            // console.log('시간엑세서 데이터', tSampler['input'])
            // console.log('시간축 데이터리스트', animationData['time'])
            // // 로테이션 축은 샘플의 output
            // console.log('translation', tSampler['output'])
            // console.log('translation 엑세서 데이터', tSampler['output'])
            // console.log('scale 데이터리스트', t0)
            animationClip.push(aniTrack = {
              key: tChannelTargetData['path'],
              time: parseAnimationInfo(redGLTFLoader, json, tSampler['input']),
              data: parseAnimationInfo(redGLTFLoader, json, tSampler['output']),
              interpolation: tSampler['interpolation'],
              target: tMesh,
              targets: targets
            });
          } else {
            console.log('파싱할수없는 데이터', tChannelTargetData['path']);
          }
          if (aniTrack) {
            if (animationClip['minTime'] > aniTrack['time'][0]) animationClip['minTime'] = aniTrack['time'][0];
            if (animationClip['maxTime'] < aniTrack['time'][aniTrack['time'].length - 1]) animationClip['maxTime'] = aniTrack['time'][aniTrack['time'].length - 1];
          }
          i++;
          current++;
          if (i != len) requestAnimationFrame(_ => parseChannels(i));
          if (current == total) {
            if (redGLTFLoader['parsingResult']['animations'].length) {
              redGLTFLoader['parsingResult']['animations'].forEach(v => redGLTFLoader.playAnimation(v));
            }
            if (RedGPUContext.useDebugConsole) console.log('Animation parsing has ended.');
            resolve();
          }
        };
        parseChannels(i);
        console.log('animationClip', animationClip);
      });
    } else resolve();
  });
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
var _up = /*#__PURE__*/new WeakMap();
class Camera3D extends BaseObject3D {
  constructor(redGPUContext) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _up, {
      writable: true,
      value: new Float32Array([0, 1, 0])
    });
    _defineProperty(this, "fov", 60);
    _defineProperty(this, "nearClipping", 0.1);
    _defineProperty(this, "farClipping", 100000);
  }
  get x() {
    return this._x;
  }
  set x(v) {
    this._x = v;
    this.matrix[12] = v;
  }
  get y() {
    return this._y;
  }
  set y(v) {
    this._y = v;
    this.matrix[13] = v;
  }
  get z() {
    return this._z;
  }
  set z(v) {
    this._z = v;
    this.matrix[14] = v;
  }
  lookAt(x, y, z) {
    t.mat4.lookAt(this.matrix, [this.x, this.y, this.z], [x, y, z], _classPrivateFieldGet(this, _up));
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
let parseCameras_GLTF = function (redGLTFLoader, json) {
  if (RedGPUContext.useDebugConsole) console.log(json);
  if (json['cameras']) {
    json['cameras'].forEach(function (v) {
      console.log('카메라', v);
      let t0 = new Camera3D(redGLTFLoader['redGPUContext']);
      if (v['type'] == 'orthographic') {
        t0.mode2DYn = true;
      } else {
        t0['fov'] = v['perspective']['yfov'] * 180 / Math.PI;
        t0['farClipping'] = v['perspective']['zfar'];
        t0['nearClipping'] = v['perspective']['znear'];
      }
      redGLTFLoader['parsingResult']['cameras'].push(t0);
    });
  }
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:3:14
 *
 */
const parseTRSAndMATRIX_GLTF = function () {
  const rotationMTX = t.mat4.create();
  const tRotation = [0, 0, 0];
  let tQuaternion = [];
  const tScale = [];
  let tMatrix;
  return function (target, info) {
    if ('matrix' in info) {
      // parseMatrix
      tMatrix = info['matrix'];
      UTIL.mat4ToEuler(tMatrix, tRotation);
      target._rotationX = -(tRotation[0] * 180 / Math.PI);
      target._rotationY = -(tRotation[1] * 180 / Math.PI);
      target._rotationZ = -(tRotation[2] * 180 / Math.PI);
      target._x = tMatrix[12];
      target._y = tMatrix[13];
      target._z = tMatrix[14];
      t.mat4.getScaling(tScale, tMatrix);
      target._scaleX = tScale[0];
      target._scaleY = tScale[1];
      target._scaleZ = tScale[2];
    }
    if ('rotation' in info) {
      // 로데이션은 쿼터니언으로 들어온다.
      tQuaternion = info['rotation'];
      UTIL.quaternionToRotationMat4(tQuaternion, rotationMTX);
      UTIL.mat4ToEuler(rotationMTX, tRotation);
      target._rotationX = -(tRotation[0] * 180 / Math.PI);
      target._rotationY = -(tRotation[1] * 180 / Math.PI);
      target._rotationZ = -(tRotation[2] * 180 / Math.PI);
    }
    if ('translation' in info) {
      // 위치
      target._x = info['translation'][0];
      target._y = info['translation'][1];
      target._z = info['translation'][2];
    }
    if ('scale' in info) {
      // 스케일
      target._scaleX = info['scale'][0];
      target._scaleY = info['scale'][1];
      target._scaleZ = info['scale'][2];
    }
    target.dirtyTransform = true;
  };
}();

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
let checkJoint = function (redGLTFLoader, skinInfo, nodes, v) {
  let tJointMesh = nodes[v]['Mesh'];
  if (tJointMesh) {
    let tJointMesh = nodes[v]['Mesh'];
    skinInfo['joints'].push(tJointMesh);
    // tJointMesh.geometry = Sphere(redGLTFLoader['redGPUContext'], 0.05, 3, 3, 3);
    // tJointMesh.material = ColorMaterial(redGLTFLoader['redGPUContext'], '#ff0000');
    tJointMesh.primitiveTopology = 'line-list';
    tJointMesh.depthCompare = 'never';
  } else requestAnimationFrame(function () {
    checkJoint(redGLTFLoader, skinInfo, nodes, v);
  });
};
let parseSkin_GLTF = function (redGLTFLoader, json, info, tMesh) {
  console.log('스킨설정!', info);
  let skinInfo = {
    joints: [],
    inverseBindMatrices: []
  };
  let nodes = json['nodes'];
  info['joints'].forEach(function (v) {
    checkJoint(redGLTFLoader, skinInfo, nodes, v);
  });
  // 스켈레톤 정보가 있으면 정보와 메쉬를 연결해둔다.
  if (info['skeleton']) skinInfo['skeleton'] = json['nodes'][info['skeleton']]['Mesh'];
  // 액세서 구하고..
  // 정보 파싱한다.
  let accessorIndex = info['inverseBindMatrices'];
  let accessorInfo = new AccessorInfo_GLTF(redGLTFLoader, json, accessorIndex);
  let tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
  let tBufferViewByteStride = accessorInfo['bufferViewByteStride'];
  let tBufferURIDataView = accessorInfo['bufferURIDataView'];
  let tGetMethod = accessorInfo['getMethod'];
  let tType = accessorInfo['accessor']['type'];
  let tCount = accessorInfo['accessor']['count'];
  let strideIndex = 0;
  let stridePerElement = tBufferViewByteStride / tBYTES_PER_ELEMENT;
  let i = accessorInfo['startIndex'];
  let len;
  switch (tType) {
    case 'MAT4':
      if (tBufferViewByteStride) {
        len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
        for (i; i < len; i++) {
          if (strideIndex % stridePerElement < 16) {
            skinInfo['inverseBindMatrices'].push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          }
          strideIndex++;
        }
      } else {
        len = i + tCount * 16;
        for (i; i < len; i++) {
          skinInfo['inverseBindMatrices'].push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          strideIndex++;
        }
      }
      break;
    default:
      console.log('알수없는 형식 엑세서 타입', tType);
      break;
  }
  skinInfo['inverseBindMatrices'] = new Float32Array(skinInfo['inverseBindMatrices']);
  tMesh['skinInfo'] = skinInfo;
  tMesh.material.useSkin = tMesh['skinInfo'] ? true : false;
};

//TODO 정리해야함
const rootOriginSourceMap = {
  vertex: {},
  fragment: {}
};
const shaderModuleMap = {
  vertex: {},
  fragment: {}
};
let ShaderModule_GLSL_searchShaderModule_callNum = 0;
const parseSource = function (tSource, replaceList) {
  tSource = JSON.parse(JSON.stringify(tSource));
  if (RedGPUContext.useDebugConsole) console.time('searchTime :' + replaceList);
  let i = replaceList.length;
  while (i--) tSource = tSource.replace(new RegExp(`\/\/\#RedGPU\#${replaceList[i]}\#`, 'gi'), '');
  if (RedGPUContext.useDebugConsole) console.timeEnd('searchTime :' + replaceList);
  return tSource;
};
class ShaderModule_GLSL {
  constructor(redGPUContext, type, materialClass, source) {
    _defineProperty(this, "redGPUContext", void 0);
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "originSource", void 0);
    _defineProperty(this, "shaderModuleMap", void 0);
    _defineProperty(this, "sourceMap", void 0);
    _defineProperty(this, "GPUShaderModule", void 0);
    _defineProperty(this, "currentKey", void 0);
    let className = materialClass.name;
    let checkMap = rootOriginSourceMap[type][className];
    if (!checkMap) {
      rootOriginSourceMap[type][className] = new Map();
      shaderModuleMap[type][className] = {};
    }
    this.redGPUContext = redGPUContext;
    this.type = type;
    this.originSource = source;
    this.sourceMap = rootOriginSourceMap[type][className];
    this.shaderModuleMap = shaderModuleMap[type][className];
    if (!checkMap) {
      let tOptionList = materialClass.PROGRAM_OPTION_LIST[type];
      // console.log('type', type);
      // console.log(`materialClass.PROGRAM_OPTION_LIST - ${className}`, tOptionList.length, tOptionList);
      if (tOptionList.length) {
        RedGPUWorker.glslParserWorker(this.redGPUContext, this, className, this.originSource, this.type, tOptionList).then(e => {
          console.log('모든경우의수 컴파일 완료', e.data.shaderName, e.data.shaderType, e.data.totalNum);
          // console.log(this.sourceMap)
        });
      }
    }

    this.searchShaderModule([className]);
  }
  searchShaderModule(optionList) {
    optionList.sort();
    let searchKey = optionList.join('_');
    if (this.currentKey == searchKey) return;
    ShaderModule_GLSL_searchShaderModule_callNum++;
    if (RedGPUContext.useDebugConsole) console.log('ShaderModule_GLSL_searchShaderModule_callNum', ShaderModule_GLSL_searchShaderModule_callNum);
    this.currentKey = searchKey;
    if (this.shaderModuleMap[searchKey]) {
      console.log('use cached shaderModule', this.type, searchKey);
      return this.GPUShaderModule = this.shaderModuleMap[searchKey];
    } else {
      // console.log('searchKey', searchKey)
      let tCompileGLSL;
      // console.time('compileGLSL : ' + this.type + ' / ' + searchKey);
      tCompileGLSL = this.sourceMap.get(searchKey);
      // console.log('머가오는겨3',searchKey,parseSource(this.originSource, optionList),tCompileGLSL)
      if (tCompileGLSL instanceof Uint32Array) {
        console.log('compileGLSL - cached shader source.', this.type, searchKey);
      } else {
        // console.log(this.originSource)
        if (!tCompileGLSL) this.sourceMap.set(searchKey, tCompileGLSL = this.redGPUContext.twgsl.convertSpirV2WGSL(this.redGPUContext.glslang.compileGLSL(parseSource(this.originSource, optionList), this.type)).replace(/@stride\([0-9]*\)/g, ''));
        // if (!tCompileGLSL) this.sourceMap.set(searchKey, tCompileGLSL = (this.redGPUContext.glslang.compileGLSL(parseSource(this.originSource, optionList), this.type)));
        // console.log('spirv',spirv)
        // console.log('tCompileGLSL',tCompileGLSL)
        console.log('compileGLSL - new shader source.', this.type, searchKey);
      }
      // console.timeEnd('compileGLSL : ' + this.type + ' / ' + searchKey);
      // console.log('머가오는겨2',searchKey,tCompileGLSL)
      this.shaderModuleDescriptor = {
        key: searchKey,
        code: tCompileGLSL
        // source: this.sourceMap.get(searchKey)
      };

      this.GPUShaderModule = this.redGPUContext.device.createShaderModule(this.shaderModuleDescriptor);
      this.shaderModuleMap[searchKey] = this.GPUShaderModule;
    }
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.3 15:45:13
 *
 */
class BindGroup {
  constructor(redGPUContext) {
    _defineProperty(this, "redGPUContext", void 0);
    _defineProperty(this, "GPUBindGroup", null);
    this.redGPUContext = redGPUContext;
  }
  setGPUBindGroup(uniformBindGroupDescriptor) {
    if (RedGPUContext.useDebugConsole) console.time('uniformBindGroupDescriptor');
    if (RedGPUContext.useDebugConsole) console.log('uniformBindGroupDescriptor', uniformBindGroupDescriptor);
    this.GPUBindGroup = this.redGPUContext.device.createBindGroup(uniformBindGroupDescriptor);
    if (RedGPUContext.useDebugConsole) console.timeEnd('uniformBindGroupDescriptor');
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
const TABLE$1 = new Map();
let makeUniformBindLayout = function (redGPUContext, uniformsBindGroupLayoutDescriptor) {
  let uniformsBindGroupLayout;
  if (!(uniformsBindGroupLayout = TABLE$1.get(uniformsBindGroupLayoutDescriptor))) {
    uniformsBindGroupLayout = redGPUContext.device.createBindGroupLayout(uniformsBindGroupLayoutDescriptor);
    TABLE$1.set(uniformsBindGroupLayoutDescriptor, uniformsBindGroupLayout);
  }
  return uniformsBindGroupLayout;
};
let BaseMaterial_searchModules_callNum = 0;
var _uniformBufferUpdated = /*#__PURE__*/new WeakMap();
class BaseMaterial extends UUID {
  //

  constructor(redGPUContext) {
    super();
    _defineProperty(this, "uniformBufferDescriptor_vertex", void 0);
    _defineProperty(this, "uniformBufferDescriptor_fragment", void 0);
    _defineProperty(this, "GPUBindGroupLayout", void 0);
    _classPrivateFieldInitSpec(this, _uniformBufferUpdated, {
      writable: true,
      value: false
    });
    _defineProperty(this, "vShaderModule", void 0);
    _defineProperty(this, "fShaderModule", void 0);
    _defineProperty(this, "vertexStage", void 0);
    _defineProperty(this, "fragmentStage", void 0);
    _defineProperty(this, "entries", void 0);
    _defineProperty(this, "redGPUContext", void 0);
    _defineProperty(this, "uniformBuffer_vertex", void 0);
    _defineProperty(this, "uniformBuffer_fragment", void 0);
    _defineProperty(this, "uniformBindGroup_material", void 0);
    _defineProperty(this, "needResetBindingInfo", true);
    let vShaderModule, fShaderModule;
    let materialClass = this.constructor;
    let vertexGLSL = materialClass.vertexShaderGLSL;
    let fragmentGLSL = materialClass.fragmentShaderGLSL;
    let programOptionList = materialClass.PROGRAM_OPTION_LIST || {
      vertex: [],
      fragment: []
    };
    fShaderModule = new ShaderModule_GLSL(redGPUContext, 'fragment', materialClass, fragmentGLSL);
    vShaderModule = new ShaderModule_GLSL(redGPUContext, 'vertex', materialClass, vertexGLSL);
    if (!materialClass.uniformBufferDescriptor_vertex) throw new Error(`${materialClass.name} : must define a static uniformBufferDescriptor_vertex.`);
    if (!materialClass.uniformBufferDescriptor_fragment) throw new Error(`${materialClass.name} : must define a static uniformBufferDescriptor_fragment.`);
    if (!materialClass.uniformsBindGroupLayoutDescriptor_material) throw new Error(`${materialClass.name} : must define a static uniformsBindGroupLayoutDescriptor_material.`);
    this.uniformBufferDescriptor_vertex = new UniformBufferDescriptor(materialClass.uniformBufferDescriptor_vertex);
    this.uniformBufferDescriptor_fragment = new UniformBufferDescriptor(materialClass.uniformBufferDescriptor_fragment);
    this.GPUBindGroupLayout = makeUniformBindLayout(redGPUContext, materialClass.uniformsBindGroupLayoutDescriptor_material);
    this.vShaderModule = vShaderModule;
    this.fShaderModule = fShaderModule;

    // 버퍼속성
    this.uniformBuffer_vertex = new UniformBuffer(redGPUContext);
    this.uniformBuffer_vertex.setBuffer(this.uniformBufferDescriptor_vertex);
    this.uniformBuffer_fragment = new UniformBuffer(redGPUContext);
    this.uniformBuffer_fragment.setBuffer(this.uniformBufferDescriptor_fragment);
    this.uniformBindGroup_material = new BindGroup(redGPUContext);
    this.redGPUContext = redGPUContext;
  }
  updateUniformBuffer() {
    let tempFloat32 = new Float32Array(1);
    //TODO : 이거 한번에 업데이트 할수있게 수정해야함
    let i2;
    let dataVertex, dataFragment, tData;
    let tValue;
    dataVertex = this.uniformBufferDescriptor_vertex.redStruct;
    dataFragment = this.uniformBufferDescriptor_fragment.redStruct;
    i2 = dataVertex.length > dataFragment.length ? dataVertex.length : dataFragment.length;
    //FIXME - _로 가져올 수있게 변경할까?
    while (i2--) {
      tData = dataVertex[i2];
      if (tData) {
        // console.log(tData);
        tValue = this[tData.valueName];
        if (tValue == undefined || tValue == null) UTIL.throwFunc(`uniformBufferDescriptor_vertex에 올바르지않은 ${tData.valueName}가 존재함`);
        if (typeof tValue == 'number') {
          tempFloat32[0] = tValue;
          tValue = tempFloat32;
        } else if (typeof tValue == 'boolean') {
          tempFloat32[0] = tValue ? 1 : 0;
          tValue = tempFloat32;
        }
        this.uniformBuffer_vertex.float32Array.set(tValue, tData['offset'] / Float32Array.BYTES_PER_ELEMENT);
      }
      tData = dataFragment[i2];
      if (tData) {
        // console.log(tData);
        tValue = this[tData.valueName];
        if (tValue == undefined || tValue == null) UTIL.throwFunc(`uniformBufferDescriptor_fragment에 올바르지않은 ${tData.valueName}가 존재함`);
        if (typeof tValue == 'number') {
          tempFloat32[0] = tValue;
          tValue = tempFloat32;
        } else if (typeof tValue == 'boolean') {
          tempFloat32[0] = tValue ? 1 : 0;
          tValue = tempFloat32;
        }
        this.uniformBuffer_fragment.float32Array.set(tValue, tData['offset'] / Float32Array.BYTES_PER_ELEMENT);
      }
    }
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(0, this.uniformBuffer_vertex.float32Array);
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, 0, this.uniformBuffer_vertex.float32Array);
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(0, this.uniformBuffer_fragment.float32Array);
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, 0, this.uniformBuffer_fragment.float32Array);
  }
  checkTexture(texture, textureName) {
    throw new Error(`${this.constructor.name} : checkTexture must override!!!`);
  }
  resetBindingInfo() {
    throw new Error(`${this.constructor.name} : resetBindingInfo must override!!!`);
  }
  _afterResetBindingInfo() {
    if (RedGPUContext.useDebugConsole) console.time('_afterResetBindingInfo - ' + this.constructor.name);
    this.searchModules();
    this.setUniformBindGroupDescriptor();
    this.uniformBindGroup_material.setGPUBindGroup(this.uniformBindGroupDescriptor);
    if (!_classPrivateFieldGet(this, _uniformBufferUpdated)) {
      this.updateUniformBuffer();
      _classPrivateFieldSet(this, _uniformBufferUpdated, true);
    }
    if (RedGPUContext.useDebugConsole) console.timeEnd('_afterResetBindingInfo - ' + this.constructor.name);
    this.updateUUID();
  }
  searchModules() {
    BaseMaterial_searchModules_callNum++;
    if (RedGPUContext.useDebugConsole) console.log('BaseMaterial_searchModules_callNum', BaseMaterial_searchModules_callNum);
    let tKeyVertex = [this.constructor.name];
    let tKeyFragment = [this.constructor.name];
    let i = 0,
      len = Math.max(this.constructor.PROGRAM_OPTION_LIST.vertex.length, this.constructor.PROGRAM_OPTION_LIST.fragment.length);
    for (i; i < len; i++) {
      let key;
      key = this.constructor.PROGRAM_OPTION_LIST.vertex[i];
      if (key && this[key]) tKeyVertex.push(key);
      key = this.constructor.PROGRAM_OPTION_LIST.fragment[i];
      if (key && this[key]) tKeyFragment.push(key);
    }
    if (RedGPUContext.useDebugConsole) console.log('searchModules_vertex_', tKeyVertex);
    if (RedGPUContext.useDebugConsole) console.log('searchModules_fragment_', tKeyFragment);
    if (RedGPUContext.useDebugConsole) console.time('searchModules_vertex_' + tKeyVertex);
    if (RedGPUContext.useDebugConsole) console.time('searchModules_fragment_' + tKeyFragment);
    this.vShaderModule.searchShaderModule(tKeyVertex);
    this.fShaderModule.searchShaderModule(tKeyFragment);
    if (RedGPUContext.useDebugConsole) console.timeEnd('searchModules_vertex_' + tKeyVertex);
    if (RedGPUContext.useDebugConsole) console.timeEnd('searchModules_fragment_' + tKeyFragment);
  }
  setUniformBindGroupDescriptor() {
    this.uniformBindGroupDescriptor = {
      layout: this.GPUBindGroupLayout,
      entries: this.entries
    };
  }
}
_defineProperty(BaseMaterial, "uniformBufferDescriptor_empty", []);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
let float1_Float32Array$1 = new Float32Array(1);
const mix = (Base, ...texture) => {
  return [Base, ...texture].reduce((parent, extender) => {
    return extender(parent);
  });
};
const color = Base => {
  var _color, _colorAlpha;
  return _color = /*#__PURE__*/new WeakMap(), _colorAlpha = /*#__PURE__*/new WeakMap(), class extends Base {
    constructor(...args) {
      super(...args);
      _classPrivateFieldInitSpec(this, _color, {
        writable: true,
        value: '#ff0000'
      });
      _classPrivateFieldInitSpec(this, _colorAlpha, {
        writable: true,
        value: 1
      });
      _defineProperty(this, "_colorRGBA", new Float32Array([1, 0, 0, _classPrivateFieldGet(this, _colorAlpha)]));
    }
    get colorRGBA() {
      return this._colorRGBA;
    }
    get color() {
      return _classPrivateFieldGet(this, _color);
    }
    set color(hex) {
      _classPrivateFieldSet(this, _color, hex);
      let rgb = UTIL.hexToRGB_ZeroToOne(hex);
      this._colorRGBA[0] = rgb[0] * _classPrivateFieldGet(this, _colorAlpha);
      this._colorRGBA[1] = rgb[1] * _classPrivateFieldGet(this, _colorAlpha);
      this._colorRGBA[2] = rgb[2] * _classPrivateFieldGet(this, _colorAlpha);
      this._colorRGBA[3] = _classPrivateFieldGet(this, _colorAlpha);
      //TODO - 시스템 버퍼쪽도 같은 개념으로 바꿔야 if 비용을 줄일 수 있음
      if (this.uniformBuffer_fragment) {
        // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this._colorRGBA)
        this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this._colorRGBA);
      }
    }
    get colorAlpha() {
      return _classPrivateFieldGet(this, _colorAlpha);
    }
    set colorAlpha(value) {
      let rgb = UTIL.hexToRGB_ZeroToOne(_classPrivateFieldGet(this, _color));
      this._colorRGBA[0] = rgb[0] * value;
      this._colorRGBA[1] = rgb[1] * value;
      this._colorRGBA[2] = rgb[2] * value;
      this._colorRGBA[3] = value;
      _classPrivateFieldSet(this, _colorAlpha, value);
      if (this.uniformBuffer_fragment) {
        // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this._colorRGBA)
        this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['colorRGBA'], this._colorRGBA);
      }
    }
  };
};
const alpha = Base => {
  var _alpha;
  return _alpha = /*#__PURE__*/new WeakMap(), class extends Base {
    constructor(...args) {
      super(...args);
      _classPrivateFieldInitSpec(this, _alpha, {
        writable: true,
        value: 1
      });
    }
    get alpha() {
      return _classPrivateFieldGet(this, _alpha);
    }
    set alpha(value) {
      _classPrivateFieldSet(this, _alpha, value);
      float1_Float32Array$1[0] = _classPrivateFieldGet(this, _alpha);
      if (this.uniformBuffer_fragment) {
        // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['alpha'], float1_Float32Array)
        this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['alpha'], float1_Float32Array$1);
      }
    }
  };
};
const defineTextureClass = function (name) {
  return Base => class extends Base {
    constructor(...args) {
      super(...args);
      _defineProperty(this, `_${name}`, null);
      _defineProperty(this, `__${name}RenderYn`, 0);
    }
    set [name](texture) {
      // this[`_${name}`] = null;
      this.checkTexture(texture, name);
    }
    get [name]() {
      return this[`_${name}`];
    }
  };
};
const diffuseTexture = defineTextureClass('diffuseTexture');
const normalTexture = defineTextureClass('normalTexture');
const specularTexture = defineTextureClass('specularTexture');
const emissiveTextureBase = defineTextureClass('emissiveTexture');
const emissiveTexture = Base => {
  let t0 = class t0 extends Base {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "_emissivePower", 1.0);
    }
    get emissivePower() {
      return this._emissivePower;
    }
    set emissivePower(value) {
      this._emissivePower = value;
      float1_Float32Array$1[0] = this._emissivePower;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissivePower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissivePower'], float1_Float32Array$1);
    }
  };
  return mix(t0, emissiveTextureBase);
};
const environmentTextureBase = defineTextureClass('environmentTexture');
const environmentTexture = Base => {
  let t0 = class t0 extends Base {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "_environmentPower", 1);
    }
    get environmentPower() {
      return this._environmentPower;
    }
    set environmentPower(value) {
      this._environmentPower = value;
      float1_Float32Array$1[0] = this._environmentPower;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['environmentPower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['environmentPower'], float1_Float32Array$1);
    }
  };
  return mix(t0, environmentTextureBase);
};
const refractionTextureBase = defineTextureClass('refractionTexture');
const refractionTexture = Base => {
  let t0 = class t0 extends Base {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "_refractionPower", 1);
      _defineProperty(this, "_refractionRatio", 0.95);
    }
    get refractionPower() {
      return this._refractionPower;
    }
    set refractionPower(value) {
      this._refractionPower = value;
      float1_Float32Array$1[0] = this._refractionPower;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['refractionPower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['refractionPower'], float1_Float32Array$1);
    }
    get refractionRatio() {
      return this._refractionRatio;
    }
    set refractionRatio(value) {
      this._refractionRatio = value;
      float1_Float32Array$1[0] = this._refractionRatio;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['refractionRatio'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['refractionRatio'], float1_Float32Array$1);
    }
  };
  return mix(t0, refractionTextureBase);
};
const displacementTextureBase = defineTextureClass('displacementTexture');
const displacementTexture = Base => {
  let t0 = class t0 extends Base {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "_displacementFlowSpeedX", 0.0);
      _defineProperty(this, "_displacementFlowSpeedY", 0.0);
      _defineProperty(this, "_displacementPower", 0.1);
    }
    get displacementFlowSpeedX() {
      return this._displacementFlowSpeedX;
    }
    set displacementFlowSpeedX(value) {
      this._displacementFlowSpeedX = value;
      float1_Float32Array$1[0] = this._displacementFlowSpeedX;
      // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedX'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedX'], float1_Float32Array$1);
    }
    get displacementFlowSpeedY() {
      return this._displacementFlowSpeedY;
    }
    set displacementFlowSpeedY(value) {
      this._displacementFlowSpeedY = value;
      float1_Float32Array$1[0] = this._displacementFlowSpeedY;
      // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedY'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementFlowSpeedY'], float1_Float32Array$1);
    }
    get displacementPower() {
      return this._displacementPower;
    }
    set displacementPower(value) {
      this._displacementPower = value;
      float1_Float32Array$1[0] = this._displacementPower;
      // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementPower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['displacementPower'], float1_Float32Array$1);
    }
  };
  return mix(t0, displacementTextureBase);
};
const roughnessTextureBase = defineTextureClass('roughnessTexture');
const roughnessTextureGLTF = Base => {
  let t0 = class t0 extends Base {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "_roughnessTexCoordIndex", 0);
      _defineProperty(this, "_roughnessFactor", 1);
    }
    get roughnessTexCoordIndex() {
      return this._roughnessTexCoordIndex;
    }
    set roughnessTexCoordIndex(value) {
      this._roughnessTexCoordIndex = value;
      float1_Float32Array$1[0] = value;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessTexCoordIndex'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessTexCoordIndex'], float1_Float32Array$1);
    }
    get roughnessFactor() {
      return this._roughnessFactor;
    }
    set roughnessFactor(value) {
      this._roughnessFactor = value;
      float1_Float32Array$1[0] = value;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessFactor'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['roughnessFactor'], float1_Float32Array$1);
    }
    get roughnessTexture() {
      return this._roughnessTexture;
    }
    set roughnessTexture(texture) {
      this.checkTexture(texture, 'roughnessTexture');
    }
  };
  return mix(t0, roughnessTextureBase);
};
const occlusionTextureBase = defineTextureClass('occlusionTexture');
const occlusionTextureGLTF = Base => {
  let t0 = class t0 extends Base {
    constructor(...args) {
      super(...args);
      _defineProperty(this, "_occlusionTexCoordIndex", 0);
      _defineProperty(this, "_occlusionPower", 1);
    }
    get occlusionTexCoordIndex() {
      return this._occlusionTexCoordIndex;
    }
    set occlusionTexCoordIndex(value) {
      this._occlusionTexCoordIndex = value;
      float1_Float32Array$1[0] = value;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionTexCoordIndex'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionTexCoordIndex'], float1_Float32Array$1);
    }
    get occlusionPower() {
      return this._occlusionPower;
    }
    set occlusionPower(value) {
      this._occlusionPower = value;
      float1_Float32Array$1[0] = value;
      // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionPower'], float1_Float32Array)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['occlusionPower'], float1_Float32Array$1);
    }
    get occlusionTexture() {
      return this._occlusionTexture;
    }
    set occlusionTexture(texture) {
      this.checkTexture(texture, 'occlusionTexture');
    }
  };
  return mix(t0, occlusionTextureBase);
};
const basicLightPropertys = Base => class extends Base {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "_normalPower", 1);
    _defineProperty(this, "_shininess", 32);
    _defineProperty(this, "_specularPower", 1);
    _defineProperty(this, "_specularColor", '#ffffff');
    _defineProperty(this, "_specularColorRGBA", new Float32Array([1, 1, 1, 1]));
    _defineProperty(this, "_useFlatMode", false);
  }
  get normalPower() {
    return this._normalPower;
  }
  set normalPower(value) {
    this._normalPower = value;
    float1_Float32Array$1[0] = this._normalPower;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalPower'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalPower'], float1_Float32Array$1);
  }
  get shininess() {
    return this._shininess;
  }
  set shininess(value) {
    this._shininess = value;
    float1_Float32Array$1[0] = this._shininess;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['shininess'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['shininess'], float1_Float32Array$1);
  }
  get specularPower() {
    return this._specularPower;
  }
  set specularPower(value) {
    this._specularPower = value;
    float1_Float32Array$1[0] = this._specularPower;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularPower'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularPower'], float1_Float32Array$1);
  }
  get specularColor() {
    return this._specularColor;
  }
  set specularColor(value) {
    this._specularColor = value;
    let rgb = UTIL.hexToRGB_ZeroToOne(value);
    this._specularColorRGBA[0] = rgb[0];
    this._specularColorRGBA[1] = rgb[1];
    this._specularColorRGBA[2] = rgb[2];
    this._specularColorRGBA[3] = 1;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularColorRGBA'], this._specularColorRGBA)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['specularColorRGBA'], this._specularColorRGBA);
  }
  get specularColorRGBA() {
    return this._specularColorRGBA;
  }

  //

  get useFlatMode() {
    return this._useFlatMode;
  }
  set useFlatMode(value) {
    this._useFlatMode = value;
    float1_Float32Array$1[0] = value ? 1 : 0;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useFlatMode'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['useFlatMode'], float1_Float32Array$1);
  }
};
const defineNumber = function (keyName, option = {}) {
  let t0;
  let hasMin = option.hasOwnProperty('min');
  let hsaMax = option.hasOwnProperty('max');
  let min = option['min'];
  let max = option['max'];
  t0 = Base => {
    var _range;
    return _range = /*#__PURE__*/new WeakMap(), class extends Base {
      constructor(...args) {
        super(...args);
        _classPrivateFieldInitSpec(this, _range, {
          writable: true,
          value: {
            min: min,
            max: max
          }
        });
        _defineProperty(this, `#${keyName}`, option['value']);
      }
      set [keyName](value) {
        this[`#${keyName}`] = null;
        if (typeof value != 'number') UTIL.throwFunc(`${keyName} : only allow Number. - inputValue : ${value} { type : ${typeof value} }`);
        if (hasMin && value < min) value = min;
        if (hsaMax && value > max) value = max;
        this[`#${keyName}`] = value;
        if (option['callback']) option['callback'].call(this, value);
      }
      get [keyName]() {
        return this[`#${keyName}`];
      }
    };
  };
  return t0;
};
class EmptyClass {}
var Mix = {
  mix: mix,
  EmptyClass: EmptyClass,
  color: color,
  alpha: alpha,
  defineNumber: defineNumber,
  diffuseTexture: diffuseTexture,
  normalTexture: normalTexture,
  specularTexture: specularTexture,
  emissiveTexture: emissiveTexture,
  environmentTexture: environmentTexture,
  refractionTexture: refractionTexture,
  displacementTexture: displacementTexture,
  roughnessTextureGLTF: roughnessTextureGLTF,
  occlusionTextureGLTF: occlusionTextureGLTF,
  basicLightPropertys: basicLightPropertys
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
let maxJoint = 127; // TODO - 이거 계산해내야함 나중에
let float1_Float32Array$2 = new Float32Array(1);
var _raf = /*#__PURE__*/new WeakMap();
class PBRMaterial_System extends Mix.mix(BaseMaterial, Mix.diffuseTexture, Mix.normalTexture, Mix.emissiveTexture, Mix.environmentTexture, Mix.displacementTexture, Mix.roughnessTextureGLTF, Mix.occlusionTextureGLTF, Mix.basicLightPropertys) {
  constructor(redGPUContext, diffuseTexture, environmentTexture, normalTexture, occlusionTexture, emissiveTexture, roughnessTexture) {
    super(redGPUContext);
    _defineProperty(this, "jointMatrix", new Float32Array(TypeSize.mat4 * maxJoint / Float32Array.BYTES_PER_ELEMENT));
    _defineProperty(this, "inverseBindMatrixForJoint", new Float32Array(TypeSize.mat4 * maxJoint / Float32Array.BYTES_PER_ELEMENT));
    _defineProperty(this, "globalTransformOfNodeThatTheMeshIsAttachedTo", new Float32Array(TypeSize.mat4 / Float32Array.BYTES_PER_ELEMENT));
    _classPrivateFieldInitSpec(this, _raf, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "_baseColorFactor", new Float32Array(4));
    _defineProperty(this, "_useVertexColor_0", false);
    _defineProperty(this, "_diffuseTexCoordIndex", 0);
    _defineProperty(this, "_normalTexCoordIndex", 0);
    _defineProperty(this, "_emissiveTexCoordIndex", 0);
    _defineProperty(this, "_metallicFactor", 1);
    _defineProperty(this, "_useMaterialDoubleSide", false);
    _defineProperty(this, "_useVertexTangent", false);
    _defineProperty(this, "_emissivePower", 1);
    _defineProperty(this, "_cutOff", 0.0);
    _defineProperty(this, "_useCutOff", true);
    _defineProperty(this, "_alphaBlend", 0);
    _defineProperty(this, "_useSkin", false);
    this.diffuseTexture = diffuseTexture;
    this.environmentTexture = environmentTexture;
    this.normalTexture = normalTexture;
    this.occlusionTexture = occlusionTexture;
    this.emissiveTexture = emissiveTexture;
    this.roughnessTexture = roughnessTexture;
    this.needResetBindingInfo = true;
  }
  get baseColorFactor() {
    return this._baseColorFactor;
  }
  set baseColorFactor(value) {
    this._baseColorFactor = new Float32Array(value);
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['baseColorFactor'], this._baseColorFactor)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['baseColorFactor'], this._baseColorFactor);
  }
  get useVertexColor_0() {
    return this._useVertexColor_0;
  }
  set useVertexColor_0(value) {
    this._useVertexColor_0 = value;
    float1_Float32Array$2[0] = value ? 1 : 0;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useVertexColor_0'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['useVertexColor_0'], float1_Float32Array$2);
  }
  get diffuseTexCoordIndex() {
    return this._diffuseTexCoordIndex;
  }
  set diffuseTexCoordIndex(value) {
    this._diffuseTexCoordIndex = value;
    float1_Float32Array$2[0] = value;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['diffuseTexCoordIndex'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['diffuseTexCoordIndex'], float1_Float32Array$2);
  }
  get normalTexCoordIndex() {
    return this._normalTexCoordIndex;
  }
  set normalTexCoordIndex(value) {
    this._normalTexCoordIndex = value;
    float1_Float32Array$2[0] = value;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalTexCoordIndex'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['normalTexCoordIndex'], float1_Float32Array$2);
  }
  get emissiveTexCoordIndex() {
    return this._emissiveTexCoordIndex;
  }
  set emissiveTexCoordIndex(value) {
    this._emissiveTexCoordIndex = value;
    float1_Float32Array$2[0] = value;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissiveTexCoordIndex'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissiveTexCoordIndex'], float1_Float32Array$2);
  }
  get metallicFactor() {
    return this._metallicFactor;
  }
  set metallicFactor(value) {
    this._metallicFactor = value;
    float1_Float32Array$2[0] = value;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['metallicFactor'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['metallicFactor'], float1_Float32Array$2);
  }
  get useMaterialDoubleSide() {
    return this._useMaterialDoubleSide;
  }
  set useMaterialDoubleSide(v) {
    this._useMaterialDoubleSide = v;
    float1_Float32Array$2[0] = v ? 1 : 0;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useMaterialDoubleSide'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['useMaterialDoubleSide'], float1_Float32Array$2);
  }
  get useVertexTangent() {
    return this._useVertexTangent;
  }
  set useVertexTangent(v) {
    this._useVertexTangent = v;
    float1_Float32Array$2[0] = v;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useVertexTangent'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['useVertexTangent'], float1_Float32Array$2);
  }
  get emissivePower() {
    return this._emissivePower;
  }
  set emissivePower(value) {
    this._emissivePower = value;
    float1_Float32Array$2[0] = value;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissivePower'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['emissivePower'], float1_Float32Array$2);
  }
  get cutOff() {
    return this._cutOff;
  }
  set cutOff(value) {
    this._cutOff = value;
    float1_Float32Array$2[0] = value;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['cutOff'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['cutOff'], float1_Float32Array$2);
  }
  get useCutOff() {
    return this._useCutOff;
  }
  set useCutOff(v) {
    this._useCutOff = v;
    float1_Float32Array$2[0] = v ? 1 : 0;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['useCutOff'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['useCutOff'], float1_Float32Array$2);
  }
  get alphaBlend() {
    return this._alphaBlend;
  }
  set alphaBlend(value) {
    this._alphaBlend = value;
    float1_Float32Array$2[0] = value;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['alphaBlend'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['alphaBlend'], float1_Float32Array$2);
  }
  get useSkin() {
    return this._useSkin;
  }
  set useSkin(v) {
    this._useSkin = v;
    float1_Float32Array$2[0] = v ? 1 : 0;
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['useSkin'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['useSkin'], float1_Float32Array$2);
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        let tKey;
        switch (textureName) {
          case 'diffuseTexture':
            this._diffuseTexture = texture;
            tKey = textureName;
            break;
          case 'normalTexture':
            this._normalTexture = texture;
            tKey = textureName;
            break;
          case 'environmentTexture':
            this._environmentTexture = texture;
            tKey = textureName;
            break;
          case 'emissiveTexture':
            this._emissiveTexture = texture;
            tKey = textureName;
            break;
          case 'roughnessTexture':
            this._roughnessTexture = texture;
            tKey = textureName;
            break;
          case 'occlusionTexture':
            this._occlusionTexture = texture;
            tKey = textureName;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        if (tKey) {
          float1_Float32Array$2[0] = this[`__${textureName}RenderYn`] = 1;
          if (tKey == 'displacementTexture') {
            // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$2);
          } else {
            // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$2);
          }
        }
        // cancelAnimationFrame(this.#raf);
        // this.#raf = requestAnimationFrame(_ => {this.needResetBindingInfo = true})
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        float1_Float32Array$2[0] = this[`__${textureName}RenderYn`] = 0;
        if (textureName == 'displacementTexture') {
          // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$2);
        } else {
          // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$2);
        }
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }, {
      binding: 1,
      resource: this._displacementTexture ? this._displacementTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 2,
      resource: this._displacementTexture ? this._displacementTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 3,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 4,
      resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 5,
      resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 6,
      resource: this._normalTexture ? this._normalTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 7,
      resource: this._normalTexture ? this._normalTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 8,
      resource: this._roughnessTexture ? this._roughnessTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 9,
      resource: this._roughnessTexture ? this._roughnessTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 10,
      resource: this._emissiveTexture ? this._emissiveTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 11,
      resource: this._emissiveTexture ? this._emissiveTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 12,
      resource: this._environmentTexture ? this._environmentTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 13,
      resource: this._environmentTexture ? this._environmentTexture._GPUTextureView : this.redGPUContext.state.emptyCubeTextureView
    }, {
      binding: 14,
      resource: this._occlusionTexture ? this._occlusionTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 15,
      resource: this._occlusionTexture ? this._occlusionTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(PBRMaterial_System, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
         
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 3 ) in vec2 uv1;
	layout( location = 4 ) in vec4 vertexColor_0;
	layout( location = 5 ) in vec4 aVertexWeight;
	layout( location = 6 ) in vec4 aVertexJoint;
	layout( location = 7 ) in vec4 vertexTangent;
	layout( location = 0 ) out vec4 vVertexColor_0;
	layout( location = 1 ) out vec3 vNormal;
	layout( location = 2 ) out vec2 vUV;
	layout( location = 3 ) out vec2 vUV1;
	layout( location = 4 ) out vec4 vVertexTangent;
	layout( location = 5 ) out vec4 vVertexPosition;
	layout( location = 6 ) out float vMouseColorID;	
	layout( location = 7 ) out float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
		mat4 jointMatrix[${maxJoint}];
		mat4 inverseBindMatrixForJoint[${maxJoint}];
		mat4 globalTransformOfNodeThatTheMeshIsAttachedTo;
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
        float __displacementTextureRenderYn;
        float useSkin;
        
    } vertexUniforms;
	
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uDisplacementSampler;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDisplacementTexture;
	void main() {		
		mat4 targetMatrix = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] ;
		mat4 skinMat = mat4(1.0,0.0,0.0,0.0, 0.0,1.0,0.0,0.0, 0.0,0.0,1.0,0.0, 0.0,0.0,0.0,1.0);
		if(vertexUniforms.useSkin == TRUTHY) {
			skinMat =
			aVertexWeight.x * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.x) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.x)]+
			aVertexWeight.y * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.y) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.y)]+
			aVertexWeight.z * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.z) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.z)]+
			aVertexWeight.w * vertexUniforms.globalTransformOfNodeThatTheMeshIsAttachedTo * vertexUniforms.jointMatrix[ int(aVertexJoint.w) ] * vertexUniforms.inverseBindMatrixForJoint[int(aVertexJoint.w)];
			vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * skinMat * vec4(position, 1.0);
			vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ]  * skinMat * vec4(normal,0.0)).xyz;
		}else{
			vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position, 1.0);
			vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] *  vec4(normal,1.0)).xyz;
		}
		
		vVertexColor_0 = vertexColor_0;
		
		vUV = uv;
		vUV1 = uv1;
		vVertexTangent = vertexTangent;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		if(vertexUniforms.__displacementTextureRenderYn == TRUTHY) vVertexPosition.xyz += ${ShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement('vNormal', 'vertexUniforms.displacementFlowSpeedX', 'vertexUniforms.displacementFlowSpeedY', 'vertexUniforms.displacementPower', 'uv', 'uDisplacementTexture', 'uDisplacementSampler')}
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;		
	}
	`);
_defineProperty(PBRMaterial_System, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${ShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
        float normalPower;
        float shininess; 
	    float emissivePower;
	    float occlusionPower;
	    float environmentPower;
	    vec4 baseColorFactor;
	    float diffuseTexCoordIndex;
	    float normalTexCoordIndex;
	    float emissiveTexCoordIndex;
	    float roughnessTexCoordIndex;
	    float occlusionTexCoordIndex;
	    float metallicFactor;
	    float roughnessFactor;
	    float cutOff;
	    float alphaBlend;
	    //
	    float useFlatMode;
	    float useCutOff;
	    float useVertexTangent;
	    float useVertexColor_0;
	    float useMaterialDoubleSide;
	    //
	    float __diffuseTextureRenderYn;
		float __environmentTextureRenderYn;
		float __normalTextureRenderYn;
		float __occlusionTextureRenderYn;
		float __emissiveTextureRenderYn;
		float __roughnessTextureRenderYn;
	    
    } fragmentUniforms;
	layout( location = 0 ) in vec4 vVertexColor_0;
	layout( location = 1 ) in vec3 vNormal;
	layout( location = 2 ) in vec2 vUV;
	layout( location = 3 ) in vec2 vUV1;
	layout( location = 4 ) in vec4 vVertexTangent;
	layout( location = 5 ) in vec4 vVertexPosition;
	layout( location = 6 ) in float vMouseColorID;	
	layout( location = 7 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uDiffuseSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uDiffuseTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform sampler uNormalSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uNormalTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform sampler uRoughnessSampler;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uRoughnessTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 10 ) uniform sampler uEmissiveSampler;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 11 ) uniform texture2D uEmissiveTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 12 ) uniform sampler uEnvironmentSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 13 ) uniform textureCube uEnvironmentTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 14 ) uniform sampler uOcclusionSampler;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 15 ) uniform texture2D uOcclusionTexture;
	layout( location = 0 ) out vec4 outColor;
	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	vec2 diffuseTexCoord;
	vec2 normalTexCoord;
	vec2 emissiveTexCoord;
	vec2 roughnessTexCoord;
	vec2 occlusionTexCoord;
	void main() {
		// 인덱스 찾고
		diffuseTexCoord = fragmentUniforms.diffuseTexCoordIndex == 0.0 ? vUV : vUV1;
		normalTexCoord = fragmentUniforms.normalTexCoordIndex == 0.0 ? vUV : vUV1;
		emissiveTexCoord = fragmentUniforms.emissiveTexCoordIndex == 0.0 ? vUV : vUV1;
		roughnessTexCoord = fragmentUniforms.roughnessTexCoordIndex == 0.0 ? vUV : vUV1;
		occlusionTexCoord = fragmentUniforms.occlusionTexCoordIndex == 0.0 ? vUV : vUV1;
		
		
		float tMetallicPower = fragmentUniforms.metallicFactor;
		float tRoughnessPower = fragmentUniforms.roughnessFactor;
		
		vec4 roughnessColor = vec4(0.0);
		if(fragmentUniforms.__roughnessTextureRenderYn == TRUTHY) {
			roughnessColor = texture(sampler2D(uRoughnessTexture, uRoughnessSampler), roughnessTexCoord);
			tMetallicPower *= roughnessColor.b; // 메탈릭 산출 roughnessColor.b
			tRoughnessPower *= roughnessColor.g; // 거칠기 산출 roughnessColor.g
		}
		
		
	
		vec4 diffuseColor = fragmentUniforms.baseColorFactor;
		if(fragmentUniforms.useVertexColor_0 == TRUTHY) diffuseColor *= clamp(vVertexColor_0,0.0,1.0) ;
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor *= texture(sampler2D(uDiffuseTexture, uDiffuseSampler), diffuseTexCoord) ;
			
		float tAlpha = diffuseColor.a;
	
		
	    vec3 N = normalize(vNormal);
	    bool backFaceYn = false;
	    if(fragmentUniforms.useMaterialDoubleSide == TRUTHY) {
		    vec3 fdx = dFdx(vVertexPosition.xyz);
			vec3 fdy = dFdy(vVertexPosition.xyz);
			vec3 faceNormal = normalize(cross(fdy,fdx));
			if (dot (vNormal, faceNormal) < 0.0) { N = -N; backFaceYn = true; };
	    } 
		vec4 normalColor = vec4(0.0);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), normalTexCoord) ;
		if(fragmentUniforms.useFlatMode == TRUTHY) N = getFlatNormal(vVertexPosition.xyz);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) N = perturb_normal(N, vVertexPosition.xyz, backFaceYn ?  1.0 - normalTexCoord : normalTexCoord, vec3(normalColor.r, 1.0- normalColor.g, normalColor.b), fragmentUniforms.normalPower) ;

		if(fragmentUniforms.useVertexTangent == TRUTHY) {
			if(fragmentUniforms.__normalTextureRenderYn == TRUTHY){
				vec3 pos_dx = dFdx(vVertexPosition.xyz);
				vec3 pos_dy = dFdy(vVertexPosition.xyz);
				vec3 tex_dx = dFdx(vec3(normalTexCoord, 0.0));
				vec3 tex_dy = dFdy(vec3(normalTexCoord, 0.0));
				vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);
				vec3 ng = normalize(vNormal);
				t = normalize(t - ng * dot(ng, t));
				vec3 b = normalize(cross(ng, t));
				mat3 tbn = mat3(t, b, ng);
				N = normalize(tbn * ((2.0 * normalColor.rgb - 1.0) * vec3(1.0, 1.0 * vVertexTangent.w,1.0)));
				N = backFaceYn ? -N : N;
			}			
		}

		if(fragmentUniforms.__environmentTextureRenderYn == TRUTHY) {
			// 환경맵 계산
			vec3 R = reflect( vVertexPosition.xyz - systemUniforms.cameraPosition, N);
			vec4 reflectionColor = texture(samplerCube(uEnvironmentTexture,uEnvironmentSampler), R);		
			// 환경맵 합성
			diffuseColor.rgb = mix( diffuseColor.rgb , reflectionColor.rgb , max(tMetallicPower-tRoughnessPower,0.0)*(1.0-tRoughnessPower));
			diffuseColor = mix( diffuseColor , vec4(0.04, 0.04, 0.04, 1.0) , tRoughnessPower * (tMetallicPower) * 0.5);
		}
		


	
		outColor = diffuseColor;
		vec4 specularLightColor = vec4(1.0, 1.0, 1.0, 1.0);
	    vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
	    vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);

	    vec3 L;	


	    float lambertTerm;
	    float intensity;
	    float specular;

		DirectionalLight lightInfo;
		vec4 lightColor;
		for(int i=0; i<systemUniforms.directionalLightCount; i++){
			lightInfo = systemUniforms.directionalLightList[i];
			vec3 L = normalize(-lightInfo.position);
			float lambertTerm = dot(N,-L);
			if(lambertTerm > 0.0){
				ld += lightInfo.color * diffuseColor * lambertTerm * lightInfo.intensity * lightInfo.color.a;
				specular = pow( max(dot(reflect(L, N), -L), 0.0), pow(fragmentUniforms.shininess, 1.0-tRoughnessPower+0.04) );
				specular *= pow(1.0-tRoughnessPower+0.04, 2.0 * (1.0-tMetallicPower)) ;
				ls +=  specularLightColor * specular * fragmentUniforms.metallicFactor * lightInfo.intensity * lightInfo.color.a * (1.0-tRoughnessPower+0.04);
			}
		}
		
		 vec4 finalColor = ld + ls + la;;
		
		if(fragmentUniforms.__emissiveTextureRenderYn == TRUTHY) {
			// 이미시브 합성
			vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uEmissiveSampler), emissiveTexCoord);
			finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		}		
	
		if(fragmentUniforms.__occlusionTextureRenderYn == TRUTHY) {
		// 오클루젼 합성
			vec4 occlusionColor =texture(sampler2D(uOcclusionTexture, uOcclusionSampler), occlusionTexCoord);
			finalColor.rgb = mix(finalColor.rgb, finalColor.rgb * occlusionColor.r, occlusionColor.r * fragmentUniforms.occlusionPower);
		}


		// 알파블렌드 - BLEND
		if( fragmentUniforms.alphaBlend == 2.0 ) {		
			finalColor.a = tAlpha;
		}
    if(fragmentUniforms.useCutOff == TRUTHY) {
			if(tAlpha <= fragmentUniforms.cutOff) discard;
		}
		outColor = finalColor;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(PBRMaterial_System, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
  // vertex: ['displacementTexture', 'skin'],
  // fragment: [
  // 	'diffuseTexture', 'emissiveTexture', 'environmentTexture', 'normalTexture', 'occlusionTexture', 'roughnessTexture',
  // 	'useCutOff',
  // 	'useFlatMode', ,
  // 	'useMaterialDoubleSide',
  // 	'useVertexTangent',
  // 	'useVertexColor_0'
  // ]
});
_defineProperty(PBRMaterial_System, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.VERTEX,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.VERTEX,
    texture: {
      type: "float"
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 4,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 5,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 6,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 7,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 8,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 9,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 10,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 11,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 12,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 13,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      viewDimension: 'cube'
    }
  }, {
    binding: 14,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 15,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(PBRMaterial_System, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.mat4 * maxJoint,
  valueName: 'jointMatrix'
}, {
  size: TypeSize.mat4 * maxJoint,
  valueName: 'inverseBindMatrixForJoint'
}, {
  size: TypeSize.mat4,
  valueName: 'globalTransformOfNodeThatTheMeshIsAttachedTo'
}, {
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedX'
}, {
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedY'
}, {
  size: TypeSize.float32,
  valueName: 'displacementPower'
}, {
  size: TypeSize.float32,
  valueName: '__displacementTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: 'useSkin'
}]);
_defineProperty(PBRMaterial_System, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'normalPower'
}, {
  size: TypeSize.float32,
  valueName: 'shininess'
}, {
  size: TypeSize.float32,
  valueName: 'emissivePower'
}, {
  size: TypeSize.float32,
  valueName: 'occlusionPower'
}, {
  size: TypeSize.float32,
  valueName: 'environmentPower'
}, {
  size: TypeSize.float32x4,
  valueName: 'baseColorFactor'
}, {
  size: TypeSize.float32,
  valueName: 'diffuseTexCoordIndex'
}, {
  size: TypeSize.float32,
  valueName: 'normalTexCoordIndex'
}, {
  size: TypeSize.float32,
  valueName: 'emissiveTexCoordIndex'
}, {
  size: TypeSize.float32,
  valueName: 'roughnessTexCoordIndex'
}, {
  size: TypeSize.float32,
  valueName: 'occlusionTexCoordIndex'
}, {
  size: TypeSize.float32,
  valueName: 'metallicFactor'
}, {
  size: TypeSize.float32,
  valueName: 'roughnessFactor'
}, {
  size: TypeSize.float32,
  valueName: 'cutOff'
}, {
  size: TypeSize.float32,
  valueName: 'alphaBlend'
},
//
{
  size: TypeSize.float32,
  valueName: 'useFlatMode'
}, {
  size: TypeSize.float32,
  valueName: 'useCutOff'
}, {
  size: TypeSize.float32,
  valueName: 'useVertexTangent'
}, {
  size: TypeSize.float32,
  valueName: 'useVertexColor_0'
}, {
  size: TypeSize.float32,
  valueName: 'useMaterialDoubleSide'
},
//
{
  size: TypeSize.float32,
  valueName: '__diffuseTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__environmentTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__normalTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__occlusionTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__emissiveTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__roughnessTextureRenderYn'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */
class InterleaveInfo {
  constructor(attributeHint, format) {
    this['attributeHint'] = attributeHint;
    this['format'] = format;
    this['stride'] = TypeSize[format];
    if (RedGPUContext.useDebugConsole) console.log(this);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */
class baseGeometry extends UUID {
  constructor() {
    super();
    _defineProperty(this, "_volume", void 0);
  }
  get volume() {
    if (!this._volume) this.volumeCalculate();
    return this._volume;
  }
  volumeCalculate() {
    // console.time('volumeCalculate');
    let minX, minY, minZ, maxX, maxY, maxZ, t0, t1, t2, t, i, len;
    let stride = this.interleaveBuffer['stride'];
    // if (!volume[this]) {
    minX = minY = minZ = maxX = maxY = maxZ = 0;
    t = this.interleaveBuffer['data'];
    i = 0;
    len = this.interleaveBuffer['vertexCount'];
    for (i; i < len; i++) {
      t0 = i * stride, t1 = t0 + 1, t2 = t0 + 2, minX = t[t0] < minX ? t[t0] : minX, maxX = t[t0] > maxX ? t[t0] : maxX, minY = t[t1] < minY ? t[t1] : minY, maxY = t[t1] > maxY ? t[t1] : maxY, minZ = t[t2] < minZ ? t[t2] : minZ, maxZ = t[t2] > maxZ ? t[t2] : maxZ;
    }
    this._volume = {};
    this._volume.volume = [maxX - minX, maxY - minY, maxZ - minZ];
    this._volume.minX = minX;
    this._volume.maxX = maxX;
    this._volume.minY = minY;
    this._volume.maxY = maxY;
    this._volume.minZ = minZ;
    this._volume.maxZ = maxZ;
    this._volume.xSize = Math.max(Math.abs(minX), Math.abs(maxX));
    this._volume.ySize = Math.max(Math.abs(minY), Math.abs(maxY));
    this._volume.zSize = Math.max(Math.abs(minZ), Math.abs(maxZ));
    this._volume.geometryRadius = Math.max(this._volume.xSize, this._volume.ySize, this._volume.zSize);
    // }
    // console.timeEnd('volumeCalculate');
    return this._volume;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */
class Geometry extends baseGeometry {
  constructor(redGPUContext, interleaveBuffer, indexBuffer) {
    super();
    _defineProperty(this, "interleaveBuffer", void 0);
    _defineProperty(this, "indexBuffer", void 0);
    _defineProperty(this, "vertexState", void 0);
    this.interleaveBuffer = interleaveBuffer;
    this.indexBuffer = indexBuffer;
    let arrayStride = 0;
    let attributes = [];
    interleaveBuffer.interleaveInfo.forEach(function (v, idx) {
      attributes.push({
        attributeHint: v['attributeHint'],
        shaderLocation: idx,
        offset: arrayStride,
        format: v['format']
      });
      arrayStride += v['stride'];
    });
    // attributes.forEach(function(v){console.log(v)});
    this.vertexState = {
      // indexFormat: 'uint32',
      vertexBuffers: [{
        arrayStride: arrayStride,
        attributes: attributes
      }]
    };
    this.volumeCalculate();
    if (RedGPUContext.useDebugConsole) console.log(this);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 20:56:47
 *
 */
class Buffer extends UUID {
  constructor(redGPUContext, typeKey, bufferType, data, interleaveInfo, usage) {
    super();
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "vertexCount", void 0);
    _defineProperty(this, "bufferDescriptor", void 0);
    _defineProperty(this, "GPUBuffer", void 0);
    _defineProperty(this, "redGPUContext", void 0);
    if (redGPUContext.state.Buffer[bufferType].has(typeKey)) return redGPUContext.state.Buffer[bufferType].get(typeKey);
    this.redGPUContext = redGPUContext;
    let tUsage;
    this.type = bufferType;
    this.vertexCount = 0;
    this.stride = 0;
    switch (bufferType) {
      case Buffer.TYPE_VERTEX:
        tUsage = usage || GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
        this.interleaveInfo = interleaveInfo;
        interleaveInfo.forEach(v => {
          this.vertexCount += v['stride'] / Float32Array.BYTES_PER_ELEMENT;
          this.stride += v['stride'] / Float32Array.BYTES_PER_ELEMENT;
        });
        this.vertexCount = data.length / this.vertexCount;
        break;
      case Buffer.TYPE_INDEX:
        tUsage = usage || GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST;
        this.indexNum = data.length;
        break;
    }
    // 실제 버퍼 생성
    this.bufferDescriptor = {
      size: data.byteLength,
      usage: tUsage
    };
    this.data = data;
    this.GPUBuffer = redGPUContext.device.createBuffer(this.bufferDescriptor);
    redGPUContext.device.queue.writeBuffer(this.GPUBuffer, 0, data);
    // this.GPUBuffer.setSubData(0, data);
    redGPUContext.state.Buffer[bufferType].set(typeKey, this);
    if (RedGPUContext.useDebugConsole) console.log(this);
  }
  update(data) {
    this.data = data;
    // this.GPUBuffer.setSubData(0, new Float32Array(data));
    this.redGPUContext.device.queue.writeBuffer(this.GPUBuffer, 0, new Float32Array(data));
  }
  destroy() {
    if (this.GPUBuffer) this.GPUBuffer.destroy();
    this.GPUBuffer = null;
  }
}
_defineProperty(Buffer, "TYPE_VERTEX", 'vertexBuffer');
_defineProperty(Buffer, "TYPE_INDEX", 'indexBuffer');

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

let makeInterleaveData_GLTF = function (interleaveData, vertices, verticesColor_0, normalData, uvs, uvs1, jointWeights, joints, tangents) {
  let i = 0,
    len = vertices.length / 3;
  let idx = 0;
  for (i; i < len; i++) {
    if (vertices.length) {
      interleaveData[idx++] = vertices[i * 3 + 0];
      interleaveData[idx++] = vertices[i * 3 + 1];
      interleaveData[idx++] = vertices[i * 3 + 2];
    }
    if (normalData.length) {
      interleaveData[idx++] = normalData[i * 3 + 0];
      interleaveData[idx++] = normalData[i * 3 + 1];
      interleaveData[idx++] = normalData[i * 3 + 2];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
    if (!uvs.length) uvs.push(0, 0);
    if (uvs.length) {
      interleaveData[idx++] = uvs[i * 2 + 0];
      interleaveData[idx++] = uvs[i * 2 + 1];
    }
    if (uvs1.length) {
      interleaveData[idx++] = uvs1[i * 2 + 0];
      interleaveData[idx++] = uvs1[i * 2 + 1];
    } else if (uvs.length) {
      interleaveData[idx++] = uvs[i * 2 + 0];
      interleaveData[idx++] = uvs[i * 2 + 1];
    }
    if (verticesColor_0.length) {
      interleaveData[idx++] = verticesColor_0[i * 4 + 0];
      interleaveData[idx++] = verticesColor_0[i * 4 + 1];
      interleaveData[idx++] = verticesColor_0[i * 4 + 2];
      interleaveData[idx++] = verticesColor_0[i * 4 + 3];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
    if (jointWeights.length) {
      interleaveData[idx++] = jointWeights[i * 4 + 0];
      interleaveData[idx++] = jointWeights[i * 4 + 1];
      interleaveData[idx++] = jointWeights[i * 4 + 2];
      interleaveData[idx++] = jointWeights[i * 4 + 3];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
    if (joints.length) {
      interleaveData[idx++] = joints[i * 4 + 0];
      interleaveData[idx++] = joints[i * 4 + 1];
      interleaveData[idx++] = joints[i * 4 + 2];
      interleaveData[idx++] = joints[i * 4 + 3];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
    if (tangents.length) {
      interleaveData[idx++] = tangents[i * 4 + 0];
      interleaveData[idx++] = tangents[i * 4 + 1];
      interleaveData[idx++] = tangents[i * 4 + 2];
      interleaveData[idx++] = tangents[i * 4 + 3];
    } else {
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
      interleaveData[idx++] = 0;
    }
  }
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */
let parseAttributeInfo_GLTF = function (redGLTFLoader, json, key, accessorInfo, vertices, uvs, uvs1, normals, jointWeights, joints, verticesColor_0, tangents) {
  let tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
  let tBufferViewByteStride = accessorInfo['bufferViewByteStride'];
  let tBufferURIDataView = accessorInfo['bufferURIDataView'];
  let tGetMethod = accessorInfo['getMethod'];
  let tType = accessorInfo['accessor']['type'];
  let tCount = accessorInfo['accessor']['count'];
  let strideIndex = 0;
  let stridePerElement = tBufferViewByteStride / tBYTES_PER_ELEMENT;
  let i = accessorInfo['startIndex'];
  let len;
  switch (tType) {
    case 'VEC4':
      if (tBufferViewByteStride) {
        len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
        for (i; i < len; i++) {
          if (strideIndex % stridePerElement < 4) {
            if (key == 'WEIGHTS_0') jointWeights.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'JOINTS_0') joints.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'COLOR_0') verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'TANGENT') tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            // else UTIL.throwFunc('VEC4에서 현재 지원하고 있지 않는 키', key)
          }

          strideIndex++;
        }
      } else {
        len = i + tCount * 4;
        for (i; i < len; i++) {
          if (key == 'WEIGHTS_0') jointWeights.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'JOINTS_0') joints.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'COLOR_0') verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'TANGENT') tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          // else UTIL.throwFunc('VEC4에서 현재 지원하고 있지 않는 키', key)
          strideIndex++;
        }
      }
      break;
    case 'VEC3':
      if (tBufferViewByteStride) {
        len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
        for (i; i < len; i++) {
          if (strideIndex % stridePerElement < 3) {
            if (key == 'NORMAL') normals.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'POSITION') vertices.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'COLOR_0') {
              verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
              if (strideIndex % stridePerElement == 2) verticesColor_0.push(1);
            }
            // else if ( key == 'TANGENT' ) tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
            // else UTIL.throwFunc('VEC3에서 현재 지원하고 있지 않는 키', key)
          }

          strideIndex++;
        }
      } else {
        len = i + tCount * 3;
        for (i; i < len; i++) {
          if (key == 'NORMAL') normals.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'POSITION') vertices.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));else if (key == 'COLOR_0') {
            verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            if (strideIndex % 3 == 2) verticesColor_0.push(1);
          }
          // else if ( key == 'TANGENT' ) tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
          // else UTIL.throwFunc('VEC3에서 현재 지원하고 있지 않는 키', key)
          strideIndex++;
        }
      }
      break;
    case 'VEC2':
      if (tBufferViewByteStride) {
        len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
        for (i; i < len; i++) {
          if (strideIndex % stridePerElement < 2) {
            if (key == 'TEXCOORD_0') {
              uvs.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            } else if (key == 'TEXCOORD_1') {
              uvs1.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
            } else UTIL.throwFunc('VEC2에서 현재 지원하고 있지 않는 키', key);
          }
          strideIndex++;
        }
      } else {
        len = i + tCount * 2;
        for (i; i < len; i++) {
          if (key == 'TEXCOORD_0') {
            uvs.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          } else if (key == 'TEXCOORD_1') {
            uvs1.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
          } else UTIL.throwFunc('VEC2에서 현재 지원하고 있지 않는 키', key);
          strideIndex++;
        }
      }
      break;
    default:
      console.log('알수없는 형식 엑세서 타입', tType);
      break;
  }
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

let parseIndicesInfo_GLTF = function (redGLTFLoader, json, accessorInfo, indices) {
  let tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
  let tBufferURIDataView = accessorInfo['bufferURIDataView'];
  let tGetMethod = accessorInfo['getMethod'];
  let tType = accessorInfo['accessor']['type'];
  let tCount = accessorInfo['accessor']['count'];
  let i = accessorInfo['startIndex'];
  let len;
  switch (tType) {
    case 'SCALAR':
      len = i + tCount;
      for (i; i < len; i++) {
        indices.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
      }
      break;
    default:
      console.log('알수없는 형식 엑세서 타입', accessorInfo['accessor']);
      break;
  }
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
let parseMaterialInfo_GLTF = function () {
  let getURL = function (redGLTFLoader, json, sourceIndex) {
    if (json['images'][sourceIndex]['uri'].indexOf('blob:http') > -1) {
      return json['images'][sourceIndex]['uri'];
    } else {
      return (json['images'][sourceIndex]['uri'].indexOf(';base64,') > -1 ? '' : redGLTFLoader['path']) + json['images'][sourceIndex]['uri'];
    }
  };
  let getSamplerInfo = function (redGLTFLoader, json, samplerIndex) {
    let result = {
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "linear",
      addressModeU: "repeat",
      addressModeV: "repeat",
      addressModeW: "repeat"
    };
    let wrapTable = {
      33071: 'clamp-to-edge',
      //CLAMP_TO_EDGE,
      33648: 'mirror-repeat',
      //MIRRORED_REPEAT
      10497: 'repeat' //REPEAT
    };

    let magFilterTable = {
      9728: 'nearest',
      //NEAREST,
      9729: 'linear' //LINEAR
    };

    let minFilterTable = {
      9728: 'nearest',
      //NEAREST
      9729: 'linear' //LINEAR
    };

    if (json['samplers']) {
      let t0 = json['samplers'][samplerIndex];
      if ('magFilter' in t0) result['magFilter'] = magFilterTable[t0['magFilter']] || 'linear';
      if ('minFilter' in t0) result['minFilter'] = minFilterTable[t0['minFilter']] || 'linear';
      if ('wrapS' in t0) result['addressModeU'] = wrapTable[t0['wrapS']];
      if ('wrapT' in t0) result['addressModeV'] = wrapTable[t0['wrapT']];
    } else {
      console.log('샘플러가 존재하지않음', samplerIndex);
    }
    result['string'] = JSON.stringify(result);
    if (RedGPUContext.useDebugConsole) console.log('result', result);
    return result;
  };
  return function (redGLTFLoader, json, v) {
    let tMaterial;
    let doubleSide = false;
    let alphaMode;
    let alphaCutoff = 0.5;
    if ('material' in v) {
      let env = redGLTFLoader['environmentTexture'];
      tMaterial = new PBRMaterial_System(redGLTFLoader['redGPUContext'], null, env, null, null, null, null);
      let tIndex = v['material'];
      let tMaterialInfo = json['materials'][tIndex];
      if ('doubleSided' in tMaterialInfo) doubleSide = tMaterialInfo['doubleSided'] ? true : false;
      if ('alphaMode' in tMaterialInfo) alphaMode = tMaterialInfo['alphaMode'];
      if ('alphaCutoff' in tMaterialInfo) alphaCutoff = tMaterialInfo['alphaCutoff'];
      if ('baseColorTexture' in tMaterialInfo['pbrMetallicRoughness']) {
        let baseTextureIndex = tMaterialInfo['pbrMetallicRoughness']['baseColorTexture']['index'];
        let baseTextureInfo = json['textures'][baseTextureIndex];
        let diffuseSourceIndex = baseTextureInfo['source'];
        let tURL = getURL(redGLTFLoader, json, diffuseSourceIndex);
        let samplerIndex = baseTextureInfo['sampler'];
        let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
        redGLTFLoader['parsingResult']['textureRawList'].push({
          src: tURL,
          sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
          targetTexture: 'diffuseTexture',
          targetMaterial: tMaterial
        });
        // diffuseTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))
      }

      if ('metallicRoughnessTexture' in tMaterialInfo['pbrMetallicRoughness']) {
        let roughnessTextureIndex = tMaterialInfo['pbrMetallicRoughness']['metallicRoughnessTexture']['index'];
        let roughnessTextureInfo = json['textures'][roughnessTextureIndex];
        let roughnessSourceIndex = roughnessTextureInfo['source'];
        let tURL = getURL(redGLTFLoader, json, roughnessSourceIndex);
        let samplerIndex = roughnessTextureInfo['sampler'];
        let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
        redGLTFLoader['parsingResult']['textureRawList'].push({
          src: tURL,
          sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
          targetTexture: 'roughnessTexture',
          targetMaterial: tMaterial
        });
        // roughnessTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))
      }

      let normalTextureIndex = tMaterialInfo['normalTexture'];
      if (normalTextureIndex != undefined) {
        normalTextureIndex = normalTextureIndex['index'];
        let normalTextureInfo = json['textures'][normalTextureIndex];
        let normalSourceIndex = normalTextureInfo['source'];
        let tURL = getURL(redGLTFLoader, json, normalSourceIndex);
        let samplerIndex = normalTextureInfo['sampler'];
        let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
        redGLTFLoader['parsingResult']['textureRawList'].push({
          src: tURL,
          sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
          targetTexture: 'normalTexture',
          targetMaterial: tMaterial
        });
        // normalTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))
      }

      let emissiveTextureIndex = tMaterialInfo['emissiveTexture'];
      if (emissiveTextureIndex != undefined) {
        emissiveTextureIndex = emissiveTextureIndex['index'];
        let emissiveTextureInfo = json['textures'][emissiveTextureIndex];
        let emissiveSourceIndex = emissiveTextureInfo['source'];
        let tURL = getURL(redGLTFLoader, json, emissiveSourceIndex);
        let samplerIndex = emissiveTextureInfo['sampler'];
        let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
        redGLTFLoader['parsingResult']['textureRawList'].push({
          src: tURL,
          sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
          targetTexture: 'emissiveTexture',
          targetMaterial: tMaterial
        });
        // emissiveTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))
      }

      let occlusionTextureIndex = tMaterialInfo['occlusionTexture'];
      if (occlusionTextureIndex != undefined) {
        occlusionTextureIndex = occlusionTextureIndex['index'];
        let occlusionTextureInfo = json['textures'][occlusionTextureIndex];
        let occlusionSourceIndex = occlusionTextureInfo['source'];
        let tURL = getURL(redGLTFLoader, json, occlusionSourceIndex);
        let samplerIndex = occlusionTextureInfo['sampler'];
        let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
        redGLTFLoader['parsingResult']['textureRawList'].push({
          src: tURL,
          sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
          targetTexture: 'occlusionTexture',
          targetMaterial: tMaterial
        });
        // occlusionTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))
        // let t0 = document.createElement('img')
        // t0.src = json['images'][occlusionSourceIndex]['uri']
        // t0.style.cssText = 'position:absolute;top:0px;left:0px;width:500px'
        // document.body.appendChild(t0)
      }

      let metallicFactor, roughnessFactor;
      if ('metallicFactor' in tMaterialInfo['pbrMetallicRoughness']) {
        metallicFactor = tMaterialInfo['pbrMetallicRoughness']['metallicFactor'];
      }
      if ('roughnessFactor' in tMaterialInfo['pbrMetallicRoughness']) {
        roughnessFactor = tMaterialInfo['pbrMetallicRoughness']['roughnessFactor'];
      }
      let tColor;

      // Type	Description	Required
      // baseColorFactor	number [4]	The material's base color factor.	No, default: [1,1,1,1]
      // baseColorTexture	object	The base color texture.	No
      // metallicFactor	number	The metalness of the material.	No, default: 1
      // roughnessFactor	number	The roughness of the material.	No, default: 1
      // metallicRoughnessTexture	object	The metallic-roughness texture.	No

      if (tMaterialInfo['pbrMetallicRoughness'] && tMaterialInfo['pbrMetallicRoughness']['baseColorFactor']) tColor = tMaterialInfo['pbrMetallicRoughness']['baseColorFactor'];else tColor = [1.0, 1.0, 1.0, 1.0];
      tMaterial['baseColorFactor'] = tColor;
      if (tMaterialInfo['pbrMetallicRoughness']) {
        tMaterial.metallicFactor = metallicFactor != undefined ? metallicFactor : 1;
        tMaterial.roughnessFactor = roughnessFactor != undefined ? roughnessFactor : 1;
      }
      tMaterial.emissiveFactor = tMaterialInfo.emissiveFactor != undefined ? tMaterialInfo.emissiveFactor : new Float32Array([1, 1, 1]);
      if (tMaterialInfo['pbrMetallicRoughness']) {
        if (tMaterialInfo['pbrMetallicRoughness']['metallicRoughnessTexture']) tMaterial['roughnessTexCoordIndex'] = tMaterialInfo['pbrMetallicRoughness']['metallicRoughnessTexture']['texCoord'] || 0;
        if (tMaterialInfo['pbrMetallicRoughness']['baseColorTexture']) tMaterial['diffuseTexCoordIndex'] = tMaterialInfo['pbrMetallicRoughness']['baseColorTexture']['texCoord'] || 0;
      }
      if (tMaterialInfo['occlusionTexture']) {
        tMaterial['occlusionTexCoordIndex'] = tMaterialInfo['occlusionTexture']['texCoord'] || 0;
        tMaterial['occlusionPower'] = tMaterialInfo['occlusionTexture']['strength'] || 1;
      }
      if (tMaterialInfo['emissiveTexture']) tMaterial['emissiveTexCoordIndex'] = tMaterialInfo['emissiveTexture']['texCoord'] || 0;
      if (tMaterialInfo['normalTexture']) tMaterial['normalTexCoordIndex'] = tMaterialInfo['normalTexture']['texCoord'] || 0;
    } else {
      let tColor = [Math.random(), Math.random(), Math.random(), 1];
      tMaterial = new PBRMaterial_System(redGLTFLoader['redGPUContext']);
      tMaterial.baseColorFactor = tColor;
    }
    return [tMaterial, doubleSide, alphaMode, alphaCutoff];
  };
}();

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */
let parseSparse_GLTF = function (redGLTFLoader, key, tAccessors, json, vertices, uvs, uvs1, normals, jointWeights, joints) {
  if (tAccessors['sparse']) {
    let sparseVerties = [];
    let sparseNormals = [];
    let sparseUvs = [];
    (function () {
      let tSparse = tAccessors['sparse'];
      let tSparseValuesAccessors = tSparse['values'];
      let tBufferView = json['bufferViews'][tSparseValuesAccessors['bufferView']];
      let tBufferIndex = tBufferView['buffer'];
      let tBuffer = json['buffers'][tBufferIndex];
      let tBufferURIDataView;
      if (tBuffer['uri']) {
        tBufferURIDataView = redGLTFLoader['parsingResult']['uris']['buffers'][tBufferIndex];
      }
      let i, len;
      let tComponentType;
      let tMethod;
      tComponentType = WEBGL_COMPONENT_TYPES[tAccessors['componentType']];
      if (tComponentType == Float32Array) tMethod = 'getFloat32';
      if (tComponentType == Uint32Array) tMethod = 'getUint32';
      if (tComponentType == Uint16Array) tMethod = 'getUint16';
      if (tComponentType == Int16Array) tMethod = 'getInt16';
      if (tComponentType == Uint8Array) tMethod = 'getUint8';
      if (tComponentType == Int8Array) tMethod = 'getInt8';
      let tAccessorBufferOffset = tAccessors['byteOffset'] || 0;
      let tBufferViewOffset = tBufferView['byteOffset'] || 0;
      i = (tBufferViewOffset + tAccessorBufferOffset) / tComponentType['BYTES_PER_ELEMENT'];
      switch (tAccessors['type']) {
        case 'VEC3':
          len = i + tComponentType['BYTES_PER_ELEMENT'] * tSparse['count'] / tComponentType['BYTES_PER_ELEMENT'] * 3;
          for (i; i < len; i++) {
            if (key == 'NORMAL') sparseNormals.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true));else if (key == 'POSITION') sparseVerties.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true));
          }
          break;
        case 'VEC2':
          len = i + tComponentType['BYTES_PER_ELEMENT'] * tSparse['count'] / tComponentType['BYTES_PER_ELEMENT'] * 2;
          for (i; i < len; i++) {
            if (key == 'TEXCOORD_0') {
              sparseUvs.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true));
            }
          }
          break;
        default:
          console.log('알수없는 형식 엑세서 타입', tAccessors['type']);
          break;
      }
    })();
    let tSparse = tAccessors['sparse'];
    let tSparseAccessors = tSparse['indices'];
    let tBufferView = json['bufferViews'][tSparseAccessors['bufferView']];
    let tBufferIndex = tBufferView['buffer'];
    let tBuffer = json['buffers'][tBufferIndex];
    let tBufferURIDataView;
    if (tBuffer['uri']) {
      tBufferURIDataView = redGLTFLoader['parsingResult']['uris']['buffers'][tBufferIndex];
    }
    let i, len;
    let tComponentType;
    let tMethod;
    tComponentType = WEBGL_COMPONENT_TYPES[tSparseAccessors['componentType']];
    if (tComponentType == Uint16Array) tMethod = 'getUint16';else if (tComponentType == Uint8Array) tMethod = 'getUint8';
    let tAccessorBufferOffset = tSparseAccessors['byteOffset'] || 0;
    let tBufferViewOffset = tBufferView['byteOffset'] || 0;
    i = (tBufferViewOffset + tAccessorBufferOffset) / tComponentType['BYTES_PER_ELEMENT'];
    //
    len = i + tComponentType['BYTES_PER_ELEMENT'] * tSparse['count'] / tComponentType['BYTES_PER_ELEMENT'];
    let sparseIndex = 0;
    for (i; i < len; i++) {
      let targetIndex = tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true);
      vertices[targetIndex * 3] = sparseVerties[sparseIndex * 3];
      vertices[targetIndex * 3 + 1] = sparseVerties[sparseIndex * 3 + 1];
      vertices[targetIndex * 3 + 2] = sparseVerties[sparseIndex * 3 + 2];
      sparseIndex++;
    }
  }
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
class MorphInfo_GLTF {
  constructor(redGLTFLoader, json, primitiveData, weightsData) {
    let morphList = [];
    if (primitiveData['targets']) {
      primitiveData['targets'].forEach(function (v2) {
        let tMorphData = {
          vertices: [],
          verticesColor_0: [],
          normals: [],
          uvs: [],
          uvs1: [],
          jointWeights: [],
          joints: [],
          tangents: []
        };
        morphList.push(tMorphData);
        for (let key in v2) {
          let vertices = tMorphData['vertices'];
          let verticesColor_0 = tMorphData['verticesColor_0'];
          let normals = tMorphData['normals'];
          let uvs = tMorphData['uvs'];
          let uvs1 = tMorphData['uvs1'];
          let jointWeights = tMorphData['jointWeights'];
          let joints = tMorphData['joints'];
          let tangents = tMorphData['tangents'];
          let accessorIndex = v2[key];
          let accessorInfo = new AccessorInfo_GLTF(redGLTFLoader, json, accessorIndex);
          // 어트리뷰트 갈궈서 파악함
          parseAttributeInfo_GLTF(redGLTFLoader, json, key, accessorInfo, vertices, uvs, uvs1, normals, jointWeights, joints, verticesColor_0, tangents);
          // 스파스 정보도 갈굼
          if (accessorInfo['accessor']['sparse']) parseSparse_GLTF(redGLTFLoader, key, accessorInfo['accessor'], json, vertices);
        }
      });
    }
    this['list'] = morphList;
    morphList['weights'] = weightsData || [];
    this['origin'] = null;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */
let makeMesh_GLTF = function (redGLTFLoader, json, meshData) {
  let tName, tDoubleSide, tAlphaMode, tAlphaCutoff;
  if (meshData['name']) tName = meshData['name'];
  let tMeshList = [];
  meshData['primitives'].forEach(function (v, index) {
    let tMesh;
    let tMaterial;
    let indices = [];
    // 어트리뷰트에서 파싱되는놈들
    let vertices = [];
    let verticesColor_0 = [];
    let uvs = [];
    let uvs1 = [];
    let normals = [];
    let jointWeights = [];
    let joints = [];
    let tangents = [];
    let tDrawMode;
    // 형상 파싱
    if (v['attributes']) {
      for (let key in v['attributes']) {
        // 엑세서를 통해서 정보파악하고
        let accessorIndex = v['attributes'][key];
        let accessorInfo = new AccessorInfo_GLTF(redGLTFLoader, json, accessorIndex);
        // 어트리뷰트 갈궈서 파악함
        parseAttributeInfo_GLTF(redGLTFLoader, json, key, accessorInfo, vertices, uvs, uvs1, normals, jointWeights, joints, verticesColor_0, tangents);
        // 스파스 정보도 갈굼
        if (accessorInfo['accessor']['sparse']) parseSparse_GLTF(redGLTFLoader, key, accessorInfo['accessor'], json, vertices);
      }
    }
    // 인덱스 파싱
    if ('indices' in v) {
      // 버퍼뷰의 위치를 말하므로...이를 추적파싱항
      let accessorIndex = v['indices'];
      let accessorInfo = new AccessorInfo_GLTF(redGLTFLoader, json, accessorIndex);
      parseIndicesInfo_GLTF(redGLTFLoader, json, accessorInfo, indices);
    }
    // 재질파싱
    tMaterial = parseMaterialInfo_GLTF(redGLTFLoader, json, v);
    tDoubleSide = tMaterial[1];
    tAlphaMode = tMaterial[2];
    tAlphaCutoff = tMaterial[3];
    tMaterial = tMaterial[0];
    if (tMaterial instanceof PBRMaterial_System) redGLTFLoader['parsingResult']['materials'].push(tMaterial);
    // 모드 파싱
    if ('mode' in v) {
      // 0 POINTS
      // 1 LINES
      // 2 LINE_LOOP
      // 3 LINE_STRIP
      // 4 TRIANGLES
      // 5 TRIANGLE_STRIP
      // 6 TRIANGLE_FAN
      switch (v['mode']) {
        case 0:
          tDrawMode = "point-list";
          break;
        case 1:
          tDrawMode = "line-list"; //redGLTFLoader['redGPUContext'].gl.LINES;
          break;
        case 2:
          tDrawMode = "line-list"; //redGLTFLoader['redGPUContext'].gl.LINE_LOOP;
          break;
        case 3:
          // tDrawMode = "line-strip";//redGLTFLoader['redGPUContext'].gl.LINE_STRIP;
          tDrawMode = "line-list"; //redGLTFLoader['redGPUContext'].gl.LINE_STRIP;
          break;
        case 4:
          tDrawMode = "triangle-list";
          break;
        case 5:
          tDrawMode = "triangle-strip";
          break;
        case 6:
          tDrawMode = "triangle-strip"; //redGLTFLoader['redGPUContext'].gl.TRIANGLE_FAN;
          break;
      }
    }
    /////////////////////////////////////////////////////////
    // 최종데이터 생산
    let normalData;
    if (normals.length) normalData = normals;else normalData = UTIL.calculateNormals(vertices, indices);
    let interleaveData = [];
    makeInterleaveData_GLTF(interleaveData, vertices, verticesColor_0, normalData, uvs, uvs1, jointWeights, joints, tangents);
    if (RedGPUContext.useDebugConsole) console.log('interleaveData', interleaveData);

    /////////////////////////////////////////////////////////
    // 메쉬 생성
    let tGeo;
    let tInterleaveInfoList = [];
    if (vertices.length) tInterleaveInfoList.push(new InterleaveInfo('aVertexPosition', "float32x3"));
    if (normalData.length) tInterleaveInfoList.push(new InterleaveInfo('aVertexNormal', "float32x3"));
    if (uvs.length) tInterleaveInfoList.push(new InterleaveInfo('aTexcoord', 'float32x2'));
    if (uvs1.length) tInterleaveInfoList.push(new InterleaveInfo('aTexcoord1', 'float32x2'));else if (uvs.length) tInterleaveInfoList.push(new InterleaveInfo('aTexcoord1', 'float32x2'));
    tInterleaveInfoList.push(new InterleaveInfo('aVertexColor_0', 'float32x4'));
    tInterleaveInfoList.push(new InterleaveInfo('aVertexWeight', 'float32x4'));
    tInterleaveInfoList.push(new InterleaveInfo('aVertexJoint', 'float32x4'));
    tInterleaveInfoList.push(new InterleaveInfo('aVertexTangent', 'float32x4'));
    tGeo = new Geometry(redGLTFLoader['redGPUContext'], new Buffer(redGLTFLoader['redGPUContext'], 'testGLTF_interleaveBuffer_' + UUID.getNextUUID(), Buffer.TYPE_VERTEX, new Float32Array(interleaveData), tInterleaveInfoList), indices.length ? new Buffer(redGLTFLoader['redGPUContext'], 'testGLTF_indexBuffer_' + UUID.getNextUUID(), Buffer.TYPE_INDEX, new Uint32Array(indices)) : null);
    if (!tMaterial) {
      UTIL.throwFunc('재질을 파싱할수없는경우 ', v);
    }
    tMesh = new Mesh(redGLTFLoader['redGPUContext'], tGeo, tMaterial);
    if (tName) {
      tMesh.name = tName;
      if (redGLTFLoader['parsingOption']) {
        for (let k in redGLTFLoader['parsingOption']) {
          if (tName.toLowerCase().indexOf(k) > -1) {
            redGLTFLoader['parsingOption'][k](tMesh);
          }
        }
      }
    }
    if (tDrawMode) tMesh.primitiveTopology = tDrawMode;else tMesh.primitiveTopology = "triangle-list";
    //
    if (tDoubleSide) {
      tMesh.cullMode = 'none';
      tMaterial.useMaterialDoubleSide = true;
    }
    switch (tAlphaMode) {
      // TODO

      case 'BLEND':
        tMesh.renderDrawLayerIndex = Render.DRAW_LAYER_INDEX1;
        tMaterial.alphaBlend = 2;
        break;
      case 'MASK':
        tMaterial.alphaBlend = 1;
        tMaterial.cutOff = tAlphaCutoff;
        tMaterial.useCutOff = true;
        break;
      default:
        tMaterial.alphaBlend = 0;
        tMaterial.useCutOff = false;
    }
    if (verticesColor_0.length) tMaterial.useVertexColor_0 = true;
    if (tangents.length) tMaterial.useVertexTangent = true;

    /////////////////////////////////////////////////////////
    // 모프리스트 설정
    let morphInfo = new MorphInfo_GLTF(redGLTFLoader, json, v, meshData['weights']);
    morphInfo['list'].forEach(function (v) {
      let normalData;
      if (v['normals'].length) normalData = v['normals'];else normalData = UTIL.calculateNormals(v['vertices'], indices);
      let interleaveData = [];
      makeInterleaveData_GLTF(interleaveData, v['vertices'], v['verticesColor_0'], normalData, v['uvs'], v['uvs1'], v['jointWeights'], v['joints'], v['tangents']);
      v['interleaveData'] = interleaveData;
    });
    tMesh['_morphInfo'] = morphInfo;
    tMesh['_morphInfo']['origin'] = new Float32Array(interleaveData);
    if (RedGPUContext.useDebugConsole) console.log('모프리스트', tMesh['_morphInfo']);
    /////////////////////////////////////////////////////
    let targetData = tMesh['geometry']['interleaveBuffer']['data'];
    let NUM = 0;
    tInterleaveInfoList.forEach(function (v) {
      NUM += v['size'];
    });
    tMesh['_morphInfo']['list'].forEach(function (v, index) {
      let i = 0,
        len = targetData.length / NUM;
      let tWeights = tMesh['_morphInfo']['list']['weights'][index] == undefined ? 0.5 : tMesh['_morphInfo']['list']['weights'][index];
      for (i; i < len; i++) {
        targetData[i * NUM + 0] += v['vertices'][i * 3 + 0] * tWeights;
        targetData[i * NUM + 1] += v['vertices'][i * 3 + 1] * tWeights;
        targetData[i * NUM + 2] += v['vertices'][i * 3 + 2] * tWeights;
      }
    });
    tMesh['geometry']['interleaveBuffer'].update(targetData);
    tMesh['_morphInfo']['origin'] = new Float32Array(targetData);
    /////////////////////////////////////////////////////
    v['Mesh'] = tMesh;
    tMeshList.push(tMesh);
    // console.log('vertices', vertices);
    // console.log('normalData', normalData);
    // console.log('uvs', uvs);
    // console.log('joints', joints);
    // console.log('jointWeights', jointWeights);
    // console.log('tangents', tangents);
    // console.log('indices', indices)
  });

  return tMeshList;
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.17 11:10:39
 *
 */
let parseNode_GLTF = function () {
  return function (redGLTFLoader, json, nodeIndex, info, parentMesh) {
    if ('mesh' in info) {
      let tMeshIndex = info['mesh'];
      makeMesh_GLTF(redGLTFLoader, json, json['meshes'][tMeshIndex]).forEach(function (tMesh) {
        parentMesh.addChild(info['Mesh'] = tMesh);
        parseTRSAndMATRIX_GLTF(tMesh, info);
        if ('children' in info) {
          info['children'].forEach(function (index) {
            parseNode_GLTF(redGLTFLoader, json, index, json['nodes'][index], tMesh);
          });
        }
        if ('skin' in info) parseSkin_GLTF(redGLTFLoader, json, json['skins'][info['skin']], tMesh);
      });
    } else {
      let tGroup;
      if (redGLTFLoader['parsingResult']['groups'][nodeIndex]) {
        console.log('기존에 존재!', redGLTFLoader['parsingResult']['groups'][nodeIndex]);
        tGroup = redGLTFLoader['parsingResult']['groups'][nodeIndex];
        info['Mesh'] = tGroup;
      } else {
        tGroup = new Mesh(redGLTFLoader['redGPUContext']);
        parentMesh.addChild(tGroup);
        info['Mesh'] = tGroup;
        redGLTFLoader['parsingResult']['groups'][nodeIndex] = tGroup;
        redGLTFLoader['parsingResult']['groups'][nodeIndex]['name'] = info['name'];
      }
      parseTRSAndMATRIX_GLTF(tGroup, info);
      // 카메라가 있으면 또 연결시킴
      if ('camera' in info) {
        redGLTFLoader['parsingResult']['cameras'][info['camera']]['_parentMesh'] = parentMesh;
        redGLTFLoader['parsingResult']['cameras'][info['camera']]['_targetMesh'] = tGroup;
        let tCameraMesh = new Mesh(redGLTFLoader['redGPUContext']);
        tGroup.addChild(tCameraMesh);
        redGLTFLoader['parsingResult']['cameras'][info['camera']]['_cameraMesh'] = tCameraMesh;
      }
      if ('children' in info) {
        info['children'].forEach(function (index) {
          parseNode_GLTF(redGLTFLoader, json, index, json['nodes'][index], tGroup);
        });
      }
      if ('skin' in info) parseSkin_GLTF(redGLTFLoader, json, json['skins'][info['skin']], tGroup);
    }
  };
}();

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.17 11:10:39
 *
 */
let parseScene_GLTF = function (redGLTFLoader, json, callback) {
  if (RedGPUContext.useDebugConsole) console.log('parseScene_GLTF 시작');
  if (RedGPUContext.useDebugConsole) console.log(json);
  let i, len;
  let nodesInScene;
  let nodeIndex;
  nodesInScene = json['scenes'][0]['nodes'];
  i = 0;
  len = nodesInScene.length;
  let parse = function () {
    nodeIndex = nodesInScene[i];
    parseNode_GLTF(redGLTFLoader, json, nodeIndex, json['nodes'][nodeIndex], redGLTFLoader['resultMesh']);
    i++;
    if (i === len) {
      if (callback) callback();
    } else parse();
  };
  parse();
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
var GLTFLoader;
(function () {
  var parser;
  /*DOC:
   {
     constructorYn : true,
     title :`GLTFLoader`,
     description : `
       GLTF 로더.
       애니메이션 지원함.
     `,
     params : {
       redGPUContext : [
         {type:'RedGL'}
       ],
       path : [
         {type:'String'},
         '파일이 위치한 경로'
       ],
       fileName : [
         {type:'String'},
         '파일이름'
       ],
       callback : [
         {type:'Function'},
         '로딩완료시 실행될 콜백'
       ]
     },
     example : `
      // GLTF 로딩
      GLTFLoader(
        RedGL Instance, // redGPUContext
        assetPath + 'glTF/basic/', // assetRootPath
        'DamagedHelmet.gltf', // fileName
        function (v) { // callBack
          tScene.addChild(v['resultMesh'])
        },
        BitmapCubeTexture( // environmentTexture
          RedGL Instance,
          [
            assetPath + 'cubemap/posx.png',
            assetPath + 'cubemap/negx.png',
            assetPath + 'cubemap/posy.png',
            assetPath + 'cubemap/negy.png',
            assetPath + 'cubemap/posz.png',
            assetPath + 'cubemap/negz.png'
          ]
        )
      );
     `,
     demo : '../example/loader/gltf/GLTFLoader.html',
     return : 'void'
   }
   :DOC*/
  var fileLoader = function () {
    var cache = {};
    return function (src, type, onLoader, onError) {
      if (cache[src]) {
        requestAnimationFrame(function () {
          onLoader(cache[src]);
        });
      } else {
        var request = new XMLHttpRequest();
        request.open("GET", src, true);
        // request.overrideMimeType('model/gltf+json')
        // request.setRequestHeader("Content-Type", (type ? type : "application/xml; ") + 'charset=UTF-8')
        request.onreadystatechange = function (e) {
          if (request.readyState === 4 && request.status === 200) {
            if (RedGPUContext.useDebugConsole) console.log(request);
            cache[src] = request;
            onLoader(request);
          } else {
            onError(request, e);
          }
        };
        request.send();
      }
    };
  }();
  var arrayBufferLoader = function () {
    var cache = {};
    return function (src, onLoader, onError) {
      if (cache[src]) {
        requestAnimationFrame(function () {
          onLoader(cache[src]);
        });
      } else {
        var request = new XMLHttpRequest();
        request.open("GET", src, true);
        request.overrideMimeType('application/octet-stream');
        request.responseType = "arraybuffer";
        request.onreadystatechange = function (e) {
          if (request.readyState === 4 && request.status === 200) {
            if (RedGPUContext.useDebugConsole) console.log(request);
            cache[src] = request;
            onLoader(request);
          } else {
            onError(request, e);
          }
        };
        request.send();
      }
    };
  }();
  GLTFLoader = function (redGPUContext, path, fileName, callback, environmentTexture, parsingOption) {
    if (!(this instanceof GLTFLoader)) return new GLTFLoader(redGPUContext, path, fileName, callback, environmentTexture, parsingOption);
    this.redGPUContext = redGPUContext;
    var self = this;
    if (fileName.indexOf('.glb') > -1) {
      var BINPACKER_HEADER_LENGTH = 12;
      var BINPACKER_CHUNK_TYPE_JSON = 0x4e4f534a;
      var BINPACKER_CHUNK_TYPE_BINARY = 0x004e4942;
      var convertUint8ArrayToString;
      convertUint8ArrayToString = function (array) {
        var str = '';
        array.map(function (item) {
          str += String.fromCharCode(item);
        });
        return str;
      };
      /////////////////////////
      arrayBufferLoader(path + fileName, function (request) {
        console.log(request['response']);
        var content = null;
        var contentArray = null;
        var body = null;
        var byteOffset = null;
        var chunkIndex = 0;
        var chunkLength = 0;
        var chunkType = null;
        var headerView = new DataView(request['response'], BINPACKER_HEADER_LENGTH);
        var header = {
          magic: convertUint8ArrayToString(new Uint8Array(request['response'], 0, 4)),
          version: headerView.getUint32(4, true),
          length: headerView.getUint32(8, true)
        };
        console.log(headerView);
        console.log(header);
        var chunkView = new DataView(request['response'], BINPACKER_HEADER_LENGTH);
        while (chunkIndex < chunkView.byteLength) {
          chunkLength = chunkView.getUint32(chunkIndex, true);
          chunkIndex += 4;
          chunkType = chunkView.getUint32(chunkIndex, true);
          chunkIndex += 4;
          if (chunkType === BINPACKER_CHUNK_TYPE_JSON) {
            contentArray = new Uint8Array(request['response'], BINPACKER_HEADER_LENGTH + chunkIndex, chunkLength);
            content = convertUint8ArrayToString(contentArray);
          } else if (chunkType === BINPACKER_CHUNK_TYPE_BINARY) {
            byteOffset = BINPACKER_HEADER_LENGTH + chunkIndex;
            body = request['response'].slice(byteOffset, byteOffset + chunkLength);
          }
          chunkIndex += chunkLength;
        }
        if (content === null) {
          throw new Error('JSON content not found');
        }
        var jsonChunk = JSON.parse(content);
        var binaryChunk = body;
        if (jsonChunk['images']) {
          jsonChunk['images'].forEach(function (v) {
            if (v['mimeType'] === 'image/png' || v['mimeType'] === 'image/jpeg' || v['mimeType'] === 'image/gif') {
              var tS;
              tS = jsonChunk['bufferViews'][v['bufferView']]['byteOffset'] || 0;
              var tt = binaryChunk.slice(tS, tS + jsonChunk['bufferViews'][v['bufferView']]['byteLength']);
              var test = new Blob([new Uint8Array(tt)], {
                type: v['mimeType']
              });
              v['uri'] = URL.createObjectURL(test);
            }
          });
        }
        parser(self, redGPUContext, jsonChunk, function () {
          if (callback) {
            if (RedGPUContext.useDebugConsole) console.log('Model parsing has ended.');
            callback(self);
          }
        }, binaryChunk);
      }, function (request, error) {
        console.log(request, error);
      });
    } else {
      fileLoader(path + fileName, null, function (request) {
        parser(self, redGPUContext, JSON.parse(request['response']), function () {
          if (callback) {
            if (RedGPUContext.useDebugConsole) console.log('Model parsing has ended.');
            callback(self);
          }
        });
      }, function (request, error) {
        if (RedGPUContext.useDebugConsole) console.log(request, error);
      });
    }
    this['redGPUContext'] = redGPUContext;
    this['path'] = path;
    this['fileName'] = fileName;
    this['resultMesh'] = new Mesh(redGPUContext);
    this['resultMesh']['name'] = 'instanceOfGLTFLoader_' + UUID.getNextUUID();
    this['parsingResult'] = {
      groups: [],
      materials: [],
      uris: {
        buffers: []
      },
      textures: {},
      textureRawList: [],
      cameras: [],
      animations: []
    };
    this['parsingOption'] = parsingOption;
    this['environmentTexture'] = environmentTexture || null;
    var _currentAnimationInfo = null;
    this['stopAnimation'] = function () {
      console.log('_currentAnimationInfo', _currentAnimationInfo, loopList.indexOf(_currentAnimationInfo));
      if (loopList.indexOf(_currentAnimationInfo) > -1) {
        loopList.splice(loopList.indexOf(_currentAnimationInfo), 1);
      }
      console.log('loopList', loopList);
    };
    this['playAnimation'] = function (animationData) {
      loopList.push(_currentAnimationInfo = {
        startTime: performance.now(),
        targetAnimationData: animationData
      });
    };
    if (RedGPUContext.useDebugConsole) console.log(this);
  };
  var loopList = [];
  GLTFLoader['animationLooper'] = time => gltfAnimationLooper(time, loopList);
  parser = function () {
    var checkAsset;
    var getBufferResources;
    /*
      glTF는 asset 속성이 있어야한다.
      최소한 버전을 반드시 포함해야함.
     */
    checkAsset = function (json) {
      if (json['asset'] === undefined) UTIL.throwFunc('GLTFLoader - asset은 반드시 정의되어야함');
      if (json['asset'].version[0] < 2) UTIL.throwFunc('GLTFLoader - asset의 버전은 2.0이상이어야함');
    };
    /*
    전체 데이터중 외부소스데이터를 모두 실제화 해둔다.
    */
    getBufferResources = function (redGLTFLoader, data, callback) {
      var allNum = 0,
        loadedNum = 0;
      data['buffers'].forEach(function (v, index) {
        v['_redURIkey'] = 'buffers';
        v['_redURIIndex'] = index;
        allNum++;
        if (v['uri'] instanceof ArrayBuffer) {
          loadedNum++;
          redGLTFLoader['parsingResult']['uris'][v['_redURIkey']][v['_redURIIndex']] = new DataView(v['uri']);
          if (loadedNum == allNum) {
            if (RedGPUContext.useDebugConsole) console.log("redGLTFLoader['parsingResult']['uris']", redGLTFLoader['parsingResult']['uris']);
            if (RedGPUContext.useDebugConsole) console.log("uris로딩현황", loadedNum, loadedNum);
            if (callback) callback();
          }
        } else {
          var tSrc = v['uri'].substr(0, 5) == 'data:' ? v['uri'] : redGLTFLoader['path'] + v['uri'];
          arrayBufferLoader(tSrc, function (request) {
            loadedNum++;
            if (RedGPUContext.useDebugConsole) console.log(request);
            redGLTFLoader['parsingResult']['uris'][v['_redURIkey']][v['_redURIIndex']] = new DataView(request.response);
            if (loadedNum == allNum) {
              if (RedGPUContext.useDebugConsole) console.log("redGLTFLoader['parsingResult']['uris']", redGLTFLoader['parsingResult']['uris']);
              if (RedGPUContext.useDebugConsole) console.log("uris로딩현황", loadedNum, loadedNum);
              if (callback) callback();
            }
          }, function (request, error) {
            if (RedGPUContext.useDebugConsole) console.log(request, error);
          });
        }
      });
    };
    return function (redGLTFLoader, redGPUContext, json, callBack, binaryChunk) {
      if (RedGPUContext.useDebugConsole) console.log('parsing start', redGLTFLoader['path'] + redGLTFLoader['fileName']);
      if (RedGPUContext.useDebugConsole) console.log('rawData', json);
      checkAsset(json);
      if (binaryChunk) {
        json.buffers[0]['uri'] = binaryChunk;
        getBufferResources(redGLTFLoader, json, function () {
          // 리소스 로딩이 완료되면 다음 진행
          parseCameras_GLTF(redGLTFLoader, json);
          parseScene_GLTF(redGLTFLoader, json, function () {
            new TextureLoader(redGLTFLoader['redGPUContext'], redGLTFLoader['parsingResult']['textureRawList'], result => {
              result.textures.forEach(v => {
                v.userInfo.targetMaterial[v.userInfo.targetTexture] = v.texture;
              });
              parseAnimation_GLTF(redGLTFLoader, json).then(_ => {
                console.time('parseAnimation_GLTF_' + redGLTFLoader.fileName);
                if (callBack) callBack();
                console.timeEnd('parseAnimation_GLTF_' + redGLTFLoader.fileName);
              });
            });
          });
        });
      } else {
        getBufferResources(redGLTFLoader, json, function () {
          // 리소스 로딩이 완료되면 다음 진행
          parseCameras_GLTF(redGLTFLoader, json);
          parseScene_GLTF(redGLTFLoader, json, function () {
            new TextureLoader(redGLTFLoader['redGPUContext'], redGLTFLoader['parsingResult']['textureRawList'], result => {
              result.textures.forEach(v => {
                v.userInfo.targetMaterial[v.userInfo.targetTexture] = v.texture;
              });
              parseAnimation_GLTF(redGLTFLoader, json).then(_ => {
                console.time('parseAnimation_GLTF_' + redGLTFLoader.fileName);
                if (callBack) callBack();
                console.timeEnd('parseAnimation_GLTF_' + redGLTFLoader.fileName);
              });
            });
          });
        });
      }
    };
  }();
  // Object.freeze(GLTFLoader);
})();

var GLTFLoader$1 = GLTFLoader;

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
let float1_Float32Array$3 = new Float32Array(1);
var _frameRate = /*#__PURE__*/new WeakMap();
var _nextFrameTime = /*#__PURE__*/new WeakMap();
var _aniMap = /*#__PURE__*/new WeakMap();
class SpriteSheetMaterial extends Mix.mix(BaseMaterial, Mix.alpha, Mix.diffuseTexture) {
  constructor(redGPUContext, spriteSheetAction) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _frameRate, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _nextFrameTime, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(this, _aniMap, {
      writable: true,
      value: {}
    });
    if (spriteSheetAction) {
      this.addAction('default', spriteSheetAction);
      this.setAction('default');
    }
    this.needResetBindingInfo = true;
    this.sheetRect = new Float32Array(4);
    this.currentIndex = 0;
    this.loop = true;
    this._playYn = true;
    // console.log(this)
  }

  get frameRate() {
    return _classPrivateFieldGet(this, _frameRate);
  }
  set frameRate(value) {
    if (value < 1) _classPrivateFieldSet(this, _frameRate, 1);
    _classPrivateFieldSet(this, _frameRate, value);
    this._perFrameTime = 1000 / _classPrivateFieldGet(this, _frameRate);
  }
  update(time) {
    if (!_classPrivateFieldGet(this, _nextFrameTime)) _classPrivateFieldSet(this, _nextFrameTime, this._perFrameTime + time);
    if (this._playYn && _classPrivateFieldGet(this, _nextFrameTime) < time) {
      let gapFrame = parseInt((time - _classPrivateFieldGet(this, _nextFrameTime)) / this._perFrameTime);
      gapFrame = gapFrame || 1;
      _classPrivateFieldSet(this, _nextFrameTime, this._perFrameTime + time);
      this.currentIndex += gapFrame;
      if (this.currentIndex >= this.totalFrame) {
        if (this.loop) this._playYn = true, this.currentIndex = 0;else this._playYn = false, this.currentIndex = this.totalFrame - 1;
      }
    }
    this.sheetRect[0] = 1 / this.segmentW;
    this.sheetRect[1] = 1 / this.segmentH;
    this.sheetRect[2] = this.currentIndex % this.segmentW / this.segmentW;
    this.sheetRect[3] = Math.floor(this.currentIndex / this.segmentH) / this.segmentH;
    if (this.uniformBuffer_vertex) {
      // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['sheetRect'], this.sheetRect)
      this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['sheetRect'], this.sheetRect);
    }
  }
  addAction(key, option) {
    _classPrivateFieldGet(this, _aniMap)[key] = option;
  }
  removeAction(key, option) {
    delete _classPrivateFieldGet(this, _aniMap)[key];
  }
  setAction(key) {
    this.diffuseTexture = _classPrivateFieldGet(this, _aniMap)[key]['texture'];
    this.segmentW = _classPrivateFieldGet(this, _aniMap)[key]['segmentW'];
    this.segmentH = _classPrivateFieldGet(this, _aniMap)[key]['segmentH'];
    this.totalFrame = _classPrivateFieldGet(this, _aniMap)[key]['totalFrame'];
    this.frameRate = _classPrivateFieldGet(this, _aniMap)[key]['frameRate'];
    this.currentIndex = 0;
    _classPrivateFieldSet(this, _nextFrameTime, 0);
  }
  play() {
    this._playYn = true;
    _classPrivateFieldSet(this, _nextFrameTime, 0);
  }
  pause() {
    this._playYn = false;
  }
  stop() {
    this._playYn = false;
    this.currentIndex = 0;
  }
  gotoAndStop(index) {
    if (index > this.totalFrame - 1) index = this.totalFrame - 1;
    if (index < 0) index = 0;
    this._playYn = false;
    this.currentIndex = index;
  }
  gotoAndPlay(index) {
    if (index > this.totalFrame - 1) index = this.totalFrame - 1;
    if (index < 0) index = 0;
    this._playYn = true;
    this.currentIndex = index;
    _classPrivateFieldSet(this, _nextFrameTime, 0);
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        let tKey;
        switch (textureName) {
          case 'diffuseTexture':
            this._diffuseTexture = texture;
            tKey = textureName;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        if (tKey) {
          float1_Float32Array$3[0] = this[`__${textureName}RenderYn`] = 1;
          if (tKey == 'displacementTexture') {
            // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$3);
          } else {
            // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$3);
          }
        }
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        float1_Float32Array$3[0] = this[`__${textureName}RenderYn`] = 0;
        if (textureName == 'displacementTexture') {
          // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$3);
        } else {
          // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$3);
        }
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }, {
      binding: 1,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 2,
      resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 3,
      resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(SpriteSheetMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
    layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        vec4 sheetRect;
    } vertexUniforms;
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vMouseColorID;
	layout( location = 3 ) out float vSumOpacity;	
	void main() {
		vUV = uv;
		vUV = vec2(
			vUV.s * vertexUniforms.sheetRect.x + vertexUniforms.sheetRect.z,
			vUV.t * vertexUniforms.sheetRect.y -vertexUniforms.sheetRect.w
		);	
		vSumOpacity = meshUniforms.sumOpacity;	
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		vNormal = normal;
		vMouseColorID = meshUniforms.mouseColorID;
	
	}
	`);
_defineProperty(SpriteSheetMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	const float TRUTHY = 1.0;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vMouseColorID;	
	layout( location = 3 ) in float vSumOpacity;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform FragmentUniforms {
        float alpha;
        //
        float __diffuseTextureRenderYn;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		
		if(diffuseColor.a<0.05) discard;
			
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(SpriteSheetMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
  // vertex: [],
  // fragment: ['diffuseTexture']
});
_defineProperty(SpriteSheetMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(SpriteSheetMaterial, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.float32x4,
  valueName: 'sheetRect'
}]);
_defineProperty(SpriteSheetMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'alpha'
},
//
{
  size: TypeSize.float32,
  valueName: '__diffuseTextureRenderYn'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 11:31:50
 *
 */

let info;
let _visible = false;
let debuggerBox;
let style_bgColor = `rgba(0, 0, 0, 0.5)`;
let setDebugBox = _ => {
  if (!debuggerBox) {
    debuggerBox = document.createElement('div');
    debuggerBox.style.cssText = `
			position:fixed;
			bottom:0; left:0;
			width : 200px;
			overflow : hidden;
			background:${style_bgColor};
			padding:5px;
			font-size:11px;
			color:#fff;
		`;
  }
};
const Debugger = {
  LEFT_TOP: 'leftTop',
  RIGHT_TOP: 'rightTop',
  LEFT_BOTTOM: 'leftBottom',
  RIGHT_BOTTOM: 'rightBottom',
  resetData: viewList => {
    info = [];
    viewList.forEach(view => info.push({
      view: view,
      object3DNum: 0,
      dirtyTransformNum: 0,
      drawCallNum: 0,
      triangleNum: 0,
      dirtyPipelineNum: 0,
      x: view.x,
      y: view.y,
      width: view.width,
      height: view.height,
      viewRect: view.viewRect,
      baseRenderTime: 0,
      postEffectRenderTime: 0,
      finalRenderTime: 0
    }));
    return info;
  },
  visible: (v, location = Debugger.LEFT_BOTTOM) => {
    _visible = v;
    setDebugBox();
    if (_visible) {
      document.body.appendChild(debuggerBox);
      Debugger.setLocation(location);
    } else {
      if (debuggerBox.parentNode) document.body.removeChild(debuggerBox);
    }
  },
  setLocation: (location = Debugger.LEFT_BOTTOM) => {
    debuggerBox.style.top = '';
    debuggerBox.style.bottom = '';
    debuggerBox.style.left = '';
    debuggerBox.style.right = '';
    switch (location) {
      case Debugger.LEFT_TOP:
        debuggerBox.style.left = debuggerBox.style.top = 0;
        break;
      case Debugger.LEFT_BOTTOM:
        debuggerBox.style.left = debuggerBox.style.bottom = 0;
        break;
      case Debugger.RIGHT_TOP:
        debuggerBox.style.right = debuggerBox.style.top = 0;
        break;
      case Debugger.RIGHT_BOTTOM:
        debuggerBox.style.right = debuggerBox.style.bottom = 0;
        break;
    }
  },
  update: _ => {
    setDebugBox();
    if (_visible) {
      debuggerBox.innerHTML = '';
      info.forEach(data => {
        let container, t0, t1;
        let noBR = {
          'x': 1,
          'width': 1
        };
        let tData;
        container = document.createElement('div');
        container.style.cssText = `
					background : rgba(0,0,0,0.75);
					margin-bottom : 1px;
					padding : 8px;
				`;
        debuggerBox.appendChild(container);
        t0 = document.createElement('div');
        t0.style.color = '#fff';
        container.appendChild(t0);
        t1 = '';
        for (let k in data) {
          tData = data[k];
          if (typeof tData == 'number') {
            if (k.includes('Time')) tData = tData.toFixed(5);
            tData = tData.toLocaleString();
          }
          t1 += `<span style="color:rgba(255,255,255,0.5)">${k}</span> : ${tData}`;
          t1 += noBR[k] ? ' / ' : '<br>';
        }
        t0.innerHTML = t1;
      });
    }
  }
};

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */
var _makeData = /*#__PURE__*/new WeakMap();
class Plane extends baseGeometry {
  constructor(_redGPUContext, _width = 1, _height = 1, _wSegments = 1, _hSegments = 1, _uvSize = 1, _flipY = false) {
    super();
    _classPrivateFieldInitSpec(this, _makeData, {
      writable: true,
      value: function () {
        let width_half, height_half;
        let gridX, gridY;
        let gridX1, gridY1;
        let segment_width, segment_height;
        let ix, iy;
        let tX, tY;
        let a, b, c, d;
        return function (redGPUContext, typeKey, width, height, wSegments, hSegments, uvSize, flipY) {
          width_half = width / 2;
          height_half = height / 2;
          gridX = Math.floor(wSegments) || 1;
          gridY = Math.floor(hSegments) || 1;
          gridX1 = gridX + 1;
          gridY1 = gridY + 1;
          segment_width = width / gridX;
          segment_height = height / gridY;
          ////////////////////////////////////////////////////////////////////////////
          // 데이터 생성!
          // buffers Datas
          const interleaveData = [];
          const indexData = [];
          // interleaveData
          for (iy = 0; iy < gridY1; iy++) {
            tY = iy * segment_height - height_half;
            for (ix = 0; ix < gridX1; ix++) {
              tX = ix * segment_width - width_half;
              // position, normal, texcoord
              interleaveData.push(tX, -tY, 0, 0, 0, 1, ix / gridX * uvSize, (flipY ? 1 - iy / gridY : iy / gridY) * uvSize);
            }
          }
          // indexData
          for (iy = 0; iy < gridY; iy++) {
            for (ix = 0; ix < gridX; ix++) {
              a = ix + gridX1 * iy;
              b = ix + gridX1 * (iy + 1);
              c = ix + 1 + gridX1 * (iy + 1);
              d = ix + 1 + gridX1 * iy;
              indexData.push(a, b, d, b, c, d);
            }
          }
          ////////////////////////////////////////////////////////////////////////////
          return new Geometry(redGPUContext, new Buffer(redGPUContext, `${typeKey}_interleaveBuffer`, Buffer.TYPE_VERTEX, new Float32Array(interleaveData), [new InterleaveInfo('vertexPosition', "float32x3"), new InterleaveInfo('vertexNormal', "float32x3"), new InterleaveInfo('texcoord', 'float32x2')]), new Buffer(redGPUContext, `${typeKey}_indexBuffer`, Buffer.TYPE_INDEX, new Uint32Array(indexData)));
        };
      }()
    });
    let _typeKey;
    // 유일키 생성
    _typeKey = [this.constructor.name, _width, _height, _wSegments, _hSegments, _uvSize, _flipY].join('_');
    if (_redGPUContext.state.Geometry.has(_typeKey)) return _redGPUContext.state.Geometry.get(_typeKey);
    let tData = _classPrivateFieldGet(this, _makeData).call(this, _redGPUContext, _typeKey, _width, _height, _wSegments, _hSegments, _uvSize, _flipY);
    this.interleaveBuffer = tData['interleaveBuffer'];
    this.indexBuffer = tData['indexBuffer'];
    this.vertexState = tData['vertexState'];
    _redGPUContext.state.Geometry.set(_typeKey, this);
    if (RedGPUContext.useDebugConsole) console.log(this);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
let float1_Float32Array$4 = new Float32Array(1);
class BitmapMaterial extends Mix.mix(BaseMaterial, Mix.diffuseTexture, Mix.alpha) {
  constructor(redGPUContext, diffuseTexture) {
    super(redGPUContext);
    this.diffuseTexture = diffuseTexture;
    this.needResetBindingInfo = true;
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        let tKey;
        switch (textureName) {
          case 'diffuseTexture':
            this._diffuseTexture = texture;
            tKey = textureName;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        if (tKey) {
          float1_Float32Array$4[0] = this[`__${textureName}RenderYn`] = 1;
          if (tKey == 'displacementTexture') {
            // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$4);
          } else {
            // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$4);
          }
        }
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        float1_Float32Array$4[0] = this[`__${textureName}RenderYn`] = 0;
        if (textureName == 'displacementTexture') {
          // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$4);
        } else {
          // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$4);
        }
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 1,
      resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 2,
      resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(BitmapMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vMouseColorID;	
	layout( location = 3 ) out float vSumOpacity;
	void main() {
		vNormal = normal;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
	}
	`);
_defineProperty(BitmapMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	const float TRUTHY = 1.0;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vMouseColorID;	
	layout( location = 3 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float alpha;
        //
        float __diffuseTextureRenderYn;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(BitmapMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
  // vertex: [],
  // fragment: ['diffuseTexture']
});
_defineProperty(BitmapMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(BitmapMaterial, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(BitmapMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'alpha'
},
//
{
  size: TypeSize.float32,
  valueName: '__diffuseTextureRenderYn'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.30 19:35:31
 *
 */
let float1_Float32Array$5 = new Float32Array(1);
class ParticleMaterial extends BitmapMaterial {
  constructor(redGPUContext, diffuseTexture) {
    super(redGPUContext);
    _defineProperty(this, "_sprite3DMode", true);
    this.diffuseTexture = diffuseTexture;
    this.needResetBindingInfo = true;
  }
  get sprite3DMode() {
    return this._sprite3DMode;
  }
  set sprite3DMode(value) {
    this._sprite3DMode = value;
    float1_Float32Array$5[0] = value ? 1 : 0;
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['sprite3DMode'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['sprite3DMode'], float1_Float32Array$5);
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }, {
      binding: 1,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 2,
      resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 3,
      resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(ParticleMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.getSprite3DMatrix}    
	layout(location = 0) in vec3 a_pos;
    layout(location = 1) in vec2 a_uv;
    layout(location = 2) in vec3 position;
    layout(location = 3) in float alpha;
    layout(location = 4) in vec3 rotation;
    layout(location = 5) in float scale;
	layout(location = 0 ) out vec2 vUV;
	layout(location = 1 ) out float vMouseColorID;	
	layout(location = 2 ) out float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float sprite3DMode;
    } vertexUniforms;
	mat4 rotationMTX(vec3 t)
    {
       float s = sin(t[0]);float c = cos(t[0]);
       mat4 m1 = mat4( 1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1);s = sin(t[1]);c = cos(t[1]);
       mat4 m2 = mat4(c,0,-s,0, 0,1,0,0, s,0,c,0,  0,0,0,1);s = sin(t[2]);c = cos(t[2]);
       mat4 m3 = mat4(c,s,0,0, -s,c,0,0, 0,0,1,0,  0,0,0,1);
       return m3*m2*m1;
    }
	void main() {
		vUV = a_uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity * alpha;
		float ratio = systemUniforms.resolution.x/systemUniforms.resolution.y; 
		if( vertexUniforms.sprite3DMode == 1.0 ) {
			mat4 scaleMTX = mat4(
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				position, 1
			) *
			mat4(
				scale, 0, 0, 0,
				0, scale , 0, 0,
				0, 0, scale, 0,
				0, 0, 0, 1
			) ;
			gl_Position = systemUniforms.perspectiveMTX * getSprite3DMatrix( systemUniforms.cameraMTX,  scaleMTX ) * rotationMTX(vec3(0,0, rotation.z)) * vec4(a_pos , 1);
		}else{
			mat4 scaleMTX = mat4(
				scale, 0, 0, 0,
				0, scale, 0, 0,
				0, 0, scale, 0,
				position, 1
			)
			* rotationMTX(rotation);
			gl_Position = systemUniforms.perspectiveMTX *  systemUniforms.cameraMTX * scaleMTX * vec4(a_pos , 1);
		}
		
	}
	`);
_defineProperty(ParticleMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	const float TRUTHY = 1.0;
	layout( location = 0 ) in vec2 vUV;
	layout( location = 1 ) in float vMouseColorID;	
	layout( location = 2 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform FragmentUniforms {
        float alpha;
        //
        float __diffuseTextureRenderYn;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(ParticleMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
  // vertex: [],
  // fragment: ['diffuseTexture']
});
_defineProperty(ParticleMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(ParticleMaterial, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.float32,
  valueName: 'sprite3DMode'
}]);
_defineProperty(ParticleMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'alpha'
}, {
  size: TypeSize.float32,
  valueName: '__diffuseTextureRenderYn'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:3:14
 *
 */
var _targetMesh$1 = /*#__PURE__*/new WeakMap();
class PipelineParticle extends UUID {
  constructor(redGPUContext, targetMesh) {
    super();
    _defineProperty(this, "redGPUContext", void 0);
    _classPrivateFieldInitSpec(this, _targetMesh$1, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "GPURenderPipeline", void 0);
    this.redGPUContext = redGPUContext;
    _classPrivateFieldSet(this, _targetMesh$1, targetMesh);
    this.GPURenderPipeline = null;
  }
  update(redGPUContext, redView) {
    let targetMesh = _classPrivateFieldGet(this, _targetMesh$1);
    const device = redGPUContext.device;
    console.log('targetMesh._geometry.vertexState', targetMesh._geometry.vertexState);
    const descriptor = {
      // 레이아웃은 재질이 알고있으니 들고옴
      layout: device.createPipelineLayout({
        bindGroupLayouts: [redView.systemUniformInfo_vertex.GPUBindGroupLayout, redView.systemUniformInfo_fragment.GPUBindGroupLayout, targetMesh.GPUBindGroupLayout, targetMesh._material.GPUBindGroupLayout]
      }),
      // 버텍스와 프레그먼트는 재질에서 들고온다.
      vertex: {
        module: targetMesh._material.vShaderModule.GPUShaderModule,
        entryPoint: 'main',
        buffers: [{
          // vertex buffer
          arrayStride: 8 * 4,
          stepMode: "vertex",
          attributes: [{
            // vertex positions
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3'
          }, {
            // vertex uv
            shaderLocation: 1,
            offset: 6 * 4,
            format: 'float32x2'
          }]
        }, {
          // instanced particles buffer
          arrayStride: targetMesh._PROPERTY_NUM * 4,
          stepMode: "instance",
          attributes: [{
            /* position*/
            shaderLocation: 2,
            offset: 4 * 4,
            format: 'float32x3'
          }, {
            /* alpha*/
            shaderLocation: 3,
            offset: 7 * 4,
            format: 'float32'
          }, {
            /* rotation*/
            shaderLocation: 4,
            offset: 8 * 4,
            format: 'float32x3'
          }, {
            /* scale*/
            shaderLocation: 5,
            offset: 11 * 4,
            format: 'float32'
          }]
        }]
      },
      fragment: {
        module: targetMesh._material.fShaderModule.GPUShaderModule,
        entryPoint: 'main',
        targets: [{
          format: navigator.gpu.getPreferredCanvasFormat(redGPUContext.adapter),
          // format: 'rgba8unorm',
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one',
              operation: "add"
            },
            alpha: {
              srcFactor: 'src-alpha',
              dstFactor: 'one',
              operation: "add"
            }
          }
        }, {
          format: 'rgba16float'
          // format: redGPUContext.context.getPreferredFormat(redGPUContext.adapter),
        }]
      },

      // 컬러모드 지정하고

      primitive: {
        topology: targetMesh._primitiveTopology,
        cullMode: targetMesh._cullMode,
        frontFace: 'ccw'
      },
      depthStencil: {
        format: "depth24plus-stencil8",
        depthWriteEnabled: targetMesh._depthWriteEnabled,
        depthCompare: targetMesh._depthCompare
      },
      multisample: {
        count: 4
      }
      //alphaToCoverageEnabled : true // alphaToCoverageEnabled isn't supported (yet)
    };

    // console.time('update - ' + this._UUID)
    this.GPURenderPipeline = device.createRenderPipeline(descriptor);
    // console.log('update - ', targetMesh._material.fShaderModule.currentKey)
    // console.timeEnd('update - ' + this._UUID)
  }
}

let getComputeSource = v => {
  return `
	#version 450
	// 파티클 구조체 선언
	struct Info {
		float startValue;
		float endValue;
		float easeType;
		float birthCenterValue;
	};
	struct InfoGroup {
		Info infoX;
		Info infoY;
		Info infoZ;
	};
	struct Particle {
		float startTime;
	    float life;
	    vec3 valuePosition;
	    float valueAlpha;
        vec3 valueRotation;
	    float valueScale;	  
	    InfoGroup infoPosition;
	    InfoGroup infoRotation;
	    Info infoScale;
	    Info infoAlpha;
	};
	
	// 이건 설정값인듯 하고
	layout(std140, set = ${ShareGLSL.SET_INDEX_ComputeUniforms}, binding = 0) uniform SimParams {
	    float time;
        float currentPositionX,currentPositionY,currentPositionZ;
	    float minLife, maxLife;
	    float minStartX, maxStartX, minEndX, maxEndX, easeX;
	    float minStartY, maxStartY, minEndY, maxEndY, easeY;
	    float minStartZ, maxStartZ, minEndZ, maxEndZ, easeZ;
	    float minStartAlpha, maxStartAlpha, minEndAlpha, maxEndAlpha, easeAlpha;
	    float minStartScale, maxStartScale, minEndScale, maxEndScale, easeScale;
        float minStartRotationX, maxStartRotationX, minEndRotationX, maxEndRotationX, easeRotationX;
	    float minStartRotationY, maxStartRotationY, minEndRotationY, maxEndRotationY, easeRotationY;
	    float minStartRotationZ, maxStartRotationZ, minEndRotationZ, maxEndRotationZ, easeRotationZ;
	
	} params;
	
	// 여기다 쓰곘다는건가	
	layout(std140, set = ${ShareGLSL.SET_INDEX_ComputeUniforms}, binding = 1) buffer ParticlesA {
	    Particle particles[${v}];
	} particlesA;
	
	

	
	const float PI = 3.141592653589793;
	const float HPI = PI * 0.5;
	const float PI2 = PI * 2;
	float calEasing(float n, float type){
		switch( int(type) ){
			// linear
			case 0 : break;
			// QuintIn
			case 1 : n = n * n * n * n * n; break;
			// QuintOut
			case 2 : n = ((n -= 1) * n * n * n * n) + 1; break;
			// QuintInOut
			case 3 : n = ((n = n * 2) < 1) ? n * n * n * n * n * 0.5 : 0.5 * ((n -= 2) * n * n * n * n + 2); break;
			////////////////////////
			// BackIn
			case 4 : n = n * n * (n * 1.70158 + n - 1.70158); break;
			// BackOut
			case 5 : n = (n -= 1) * n * (n * 1.70158 + n + 1.70158) + 1; break;
			// BackInOut
			case 6 : n = ((n = n * 2) < 1) ? 0.5 * n * n * (n * 1.70158 + n - 1.70158) : 0.5 * (n -= 2) * n * (n * 1.70158 + n + 1.70158) + 1; break;
			////////////////////////
			// CircIn
			case 7 : n = -1 * (sqrt(1 - n * n) - 1); break;
			// CircOut
			case 8 : n = sqrt(1 - (n -= 1) * n); break;
			// CircInOut
			case 9 : n = ((n = n * 2) < 1) ? -0.5 * (sqrt(1 - n * n) - 1) : 0.5 * sqrt(1 - (n -= 2) * n) + 0.5; break;
			////////////////////////
			// CubicIn
			case 10 : n = n * n * n; break;
			// CubicOut
			case 11 : n = ((n -= 1) * n * n) + 1; break;
			// CubicInOut
			case 12 : n = ((n = n * 2) < 1) ? n * n * n * 0.5 : 0.5 * ((n -= 2) * n * n + 2); break;
			////////////////////////
			// ExpoIn
			case 13 : n = n == 0.0 ? 0.0 : pow(2, 10 * (n - 1)); break;
			// ExpoOut
			case 14 : n = n == 1.0 ? 1.0 : -pow(2, -10 * n) + 1; break;
			// ExpoInOut
			case 15 : n = ((n = n * 2) < 1) ? (n == 0.0 ? 0.0 : 0.5 * pow(2, 10 * (n - 1))) : (n == 2.0 ? 1.0 : -0.5 * pow(2, -10 * (n - 1)) + 1); break;
			////////////////////////
			// QuadIn
			case 16 : n = n * n; break;
			// QuadOut
			case 17 : n = ((2 - n) * n); break;
			// QuadInOut
			case 18 : n = ((n = n * 2) < 1) ? n * n * 0.5 : 0.5 * ((2 - (n -= 1)) * n + 1); break;
			////////////////////////
			// QuartIn
			case 19 : n = n * n * n * n; break;
			// QuartOut
			case 20 : n = 1 - ((n -= 1) * n * n * n); break;
			// QuartInOut
			case 21 : n = ((n = n * 2) < 1) ? n * n * n * n * 0.5 : 1 - ((n -= 2) * n * n * n * 0.5); break;
			////////////////////////
			// SineIn
			case 22 : n = -cos(n * HPI) + 1; break;
			// SineOut
			case 23 : n = sin(n * HPI); break;
			// SineInOut
			case 24 : n = (-cos(n * PI) + 1) * 0.5; break;
			////////////////////////
			// ElasticIn
			case 25 : n = n == 0.0 ? 0.0 : n == 1.0 ? 1.0 : -1 * pow(2, 10 * (n -= 1)) * sin((n - 0.075) * (PI2) / 0.3); break;
			// ElasticOut
			case 26 : n = n == 0.0 ? 0.0 : n == 1.0 ? 1.0 : pow(2, -10 * n) * sin((n - 0.075) * (PI2) / 0.3) + 1; break;
			// ElasticInOut
			case 27 : n =( (n == 0.0 ? 0.0 : (n == 1.0 ? 1.0 : n *= 2)), (n < 1) ? -0.5 * pow(2, 10 * (n -= 1)) * sin((n - 0.075) * (PI2) / 0.3) : 0.5 * pow(2, -10 * (n -= 1)) * sin((n - 0.075) * (PI2) / 0.3) + 1); break;
		}
		return n;
	}
	float rand(float n){return fract(sin(n) * 43758.5453123);}
	float randomRange(float min, float max, float v)
	{
        float newValue = rand(v);
		return (newValue * (max-min)) + min;
	}
	void main() {
		uint index = gl_GlobalInvocationID.x;
		Particle targetParticle = particlesA.particles[index];
	
		float age = params.time - targetParticle.startTime;
		float lifeRatio = age/targetParticle.life;
		if(lifeRatio>=1) {
			float uuid = params.time + index;
			particlesA.particles[index].startTime = params.time;
			particlesA.particles[index].life = randomRange( params.minLife, params.maxLife, uuid );
			// position
			particlesA.particles[index].infoPosition.infoX.startValue = randomRange( params.minStartX, params.maxStartX, uuid + 1 );
			particlesA.particles[index].infoPosition.infoX.endValue   = randomRange( params.minEndX, params.maxEndX, uuid + 2 );
			particlesA.particles[index].infoPosition.infoX.easeType   = params.easeX;
			particlesA.particles[index].infoPosition.infoY.startValue = randomRange( params.minStartY, params.maxStartY, uuid + 3 );
			particlesA.particles[index].infoPosition.infoY.endValue   = randomRange( params.minEndY, params.maxEndY, uuid + 4 );
			particlesA.particles[index].infoPosition.infoY.easeType   = params.easeY;
			particlesA.particles[index].infoPosition.infoZ.startValue = randomRange( params.minStartZ, params.maxStartZ, uuid + 5 );
			particlesA.particles[index].infoPosition.infoZ.endValue   = randomRange( params.minEndZ, params.maxEndZ, uuid + 6 );
			particlesA.particles[index].infoPosition.infoZ.easeType   = params.easeZ;
			// alpha
			particlesA.particles[index].infoAlpha.startValue = randomRange( params.minStartAlpha, params.maxStartAlpha, uuid + 7 );
			particlesA.particles[index].infoAlpha.endValue   = randomRange( params.minEndAlpha, params.maxEndAlpha, uuid + 8 );
			particlesA.particles[index].infoAlpha.easeType   = params.easeAlpha;
			// scale
			particlesA.particles[index].infoScale.startValue = randomRange( params.minStartScale, params.maxStartScale, uuid + 9 );
			particlesA.particles[index].infoScale.endValue   = randomRange( params.minEndScale, params.maxEndScale, uuid + 10 );
			particlesA.particles[index].infoScale.easeType   = params.easeScale;
			// rotation
			particlesA.particles[index].infoRotation.infoX.startValue = randomRange( params.minStartRotationX, params.maxStartRotationX, uuid + 11 );
			particlesA.particles[index].infoRotation.infoX.endValue   = randomRange( params.minEndRotationX, params.maxEndRotationX, uuid + 12 );
			particlesA.particles[index].infoRotation.infoX.easeType   = params.easeRotationX;
			particlesA.particles[index].infoRotation.infoY.startValue = randomRange( params.minStartRotationY, params.maxStartRotationY, uuid + 13 );
			particlesA.particles[index].infoRotation.infoY.endValue   = randomRange( params.minEndRotationY, params.maxEndRotationY, uuid + 14 );
			particlesA.particles[index].infoRotation.infoY.easeType   = params.easeRotationY;
			particlesA.particles[index].infoRotation.infoZ.startValue = randomRange( params.minStartRotationZ, params.maxStartRotationZ, uuid + 15 );
			particlesA.particles[index].infoRotation.infoZ.endValue   = randomRange( params.minEndRotationZ, params.maxEndRotationZ, uuid + 16 );
			particlesA.particles[index].infoRotation.infoZ.easeType   = params.easeRotationZ;
			// birth position
			particlesA.particles[index].infoPosition.infoX.birthCenterValue = params.currentPositionX;
			particlesA.particles[index].infoPosition.infoY.birthCenterValue = params.currentPositionY;
			particlesA.particles[index].infoPosition.infoZ.birthCenterValue = params.currentPositionZ;
			lifeRatio = 0;
		}
		Info tInfo;
		// position
		tInfo = targetParticle.infoPosition.infoX;
		particlesA.particles[index].valuePosition.x = tInfo.birthCenterValue + tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoPosition.infoY;
		particlesA.particles[index].valuePosition.y = tInfo.birthCenterValue + tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		tInfo = targetParticle.infoPosition.infoZ;
		particlesA.particles[index].valuePosition.z = tInfo.birthCenterValue + tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		
		// alpha
		tInfo = targetParticle.infoAlpha;
		particlesA.particles[index].valueAlpha = tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
		
		// scale
		tInfo = targetParticle.infoScale;
		particlesA.particles[index].valueScale = tInfo.startValue + (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType);
				
		// rotation
		tInfo = targetParticle.infoRotation.infoX;
		particlesA.particles[index].valueRotation.x = (tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType)) * PI/180;
		tInfo = targetParticle.infoRotation.infoY;
		particlesA.particles[index].valueRotation.y = (tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType)) * PI/180;
		tInfo = targetParticle.infoRotation.infoZ;
		particlesA.particles[index].valueRotation.z = (tInfo.startValue +  (tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType)) * PI/180;
	}
`;
};
var _simParamData = /*#__PURE__*/new WeakMap();
class Particle extends BaseObject3D {
  //

  //

  //

  //

  //

  //

  //

  //

  //

  //

  //

  //

  //

  //

  //

  //

  constructor(redGPUContext, particleNum = 1, initInfo = {}, texture, geometry) {
    super(redGPUContext);
    _defineProperty(this, "redGPUContext", void 0);
    _classPrivateFieldInitSpec(this, _simParamData, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "computePipeline", void 0);
    _defineProperty(this, "particleBindGroup", void 0);
    _defineProperty(this, "particleBuffer", void 0);
    _defineProperty(this, "minLife", 2000);
    _defineProperty(this, "maxLife", 10000);
    _defineProperty(this, "minStartX", -1);
    _defineProperty(this, "maxStartX", 1);
    _defineProperty(this, "minEndX", -15);
    _defineProperty(this, "maxEndX", 15);
    _defineProperty(this, "minStartY", -1);
    _defineProperty(this, "maxStartY", 1);
    _defineProperty(this, "minEndY", -15);
    _defineProperty(this, "maxEndY", 15);
    _defineProperty(this, "minStartZ", -1);
    _defineProperty(this, "maxStartZ", 1);
    _defineProperty(this, "minEndZ", -15);
    _defineProperty(this, "maxEndZ", 15);
    _defineProperty(this, "minStartAlpha", 0.0);
    _defineProperty(this, "maxStartAlpha", 1.0);
    _defineProperty(this, "minEndAlpha", 0.0);
    _defineProperty(this, "maxEndAlpha", 0.0);
    _defineProperty(this, "minStartScale", 0.0);
    _defineProperty(this, "maxStartScale", 0.25);
    _defineProperty(this, "minEndScale", 0.0);
    _defineProperty(this, "maxEndScale", 3.0);
    _defineProperty(this, "minStartRotationX", -Math.random() * 360);
    _defineProperty(this, "maxStartRotationX", Math.random() * 360);
    _defineProperty(this, "minEndRotationX", -Math.random() * 360);
    _defineProperty(this, "maxEndRotationX", Math.random() * 360);
    _defineProperty(this, "minStartRotationY", -Math.random() * 360);
    _defineProperty(this, "maxStartRotationY", Math.random() * 360);
    _defineProperty(this, "minEndRotationY", -Math.random() * 360);
    _defineProperty(this, "maxEndRotationY", Math.random() * 360);
    _defineProperty(this, "minStartRotationZ", -Math.random() * 360);
    _defineProperty(this, "maxStartRotationZ", Math.random() * 360);
    _defineProperty(this, "minEndRotationZ", -Math.random() * 360);
    _defineProperty(this, "maxEndRotationZ", Math.random() * 360);
    _defineProperty(this, "easeX", Particle.Linear);
    _defineProperty(this, "easeY", Particle.Linear);
    _defineProperty(this, "easeZ", Particle.Linear);
    _defineProperty(this, "easeScale", Particle.Linear);
    _defineProperty(this, "easeRotationX", Particle.Linear);
    _defineProperty(this, "easeRotationY", Particle.Linear);
    _defineProperty(this, "easeRotationZ", Particle.Linear);
    _defineProperty(this, "easeAlpha", Particle.Linear);
    this.redGPUContext = redGPUContext;
    this._material = new ParticleMaterial(redGPUContext);
    {
      for (const k in initInfo) {
        if (this.hasOwnProperty(k)) {
          console.log(k);
          this[k] = initInfo[k];
        }
      }
    }
    this.geometry = geometry || new Plane(redGPUContext);
    this.texture = texture;
    this.renderDrawLayerIndex = Render.DRAW_LAYER_INDEX2_Z_POINT_SORT;
    this._PROPERTY_NUM = 44;
    this.blendColorSrc = 'src-alpha';
    this.blendColorDst = 'one';
    this.blendAlphaSrc = 'src-alpha';
    this.blendAlphaDst = 'one';
    this.depthWriteEnabled = false;
    this.cullMode = 'none';

    // 컴퓨트 파이프 라인 생성
    _classPrivateFieldSet(this, _simParamData, new Float32Array([
    // startTime time
    performance.now(),
    // position
    this._x, this._y, this._z,
    // lifeRange
    this.minLife, this.maxLife,
    // x,y,z Range
    this.minStartX, this.maxStartX, this.minEndX, this.maxEndX, this.easeX, this.minStartY, this.maxStartY, this.minEndY, this.maxEndY, this.easeY, this.minStartZ, this.maxStartZ, this.minEndZ, this.maxEndZ, this.easeZ,
    // alphaRange
    this.minStartAlpha, this.maxStartAlpha, this.minEndAlpha, this.maxEndAlpha, this.easeAlpha,
    // scaleRange
    this.minStartScale, this.maxStartScale, this.minEndScale, this.maxEndScale, this.easeScale,
    // x,y,z Range
    this.minStartRotationX, this.maxStartRotationX, this.minEndRotationX, this.maxEndRotationX, this.easeRotationX, this.minStartRotationY, this.maxStartRotationY, this.minEndRotationY, this.maxEndRotationY, this.easeRotationY, this.minStartRotationZ, this.maxStartRotationZ, this.minEndRotationZ, this.maxEndRotationZ, this.easeRotationZ]));
    let bufferDescriptor = {
      size: _classPrivateFieldGet(this, _simParamData).byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    };
    this.simParamBuffer = redGPUContext.device.createBuffer(bufferDescriptor);
    // this.simParamBuffer.setSubData(0, this.#simParamData);
    redGPUContext.device.queue.writeBuffer(this.simParamBuffer, 0, _classPrivateFieldGet(this, _simParamData));
    //
    this.pipeline = new PipelineParticle(redGPUContext, this);
    this.particleNum = particleNum || 1;
  }

  //
  get particleNum() {
    return this._particleNum;
  }
  set particleNum(value) {
    this._particleNum = value;
    this.setParticleData();
  }
  get sprite3DMode() {
    return this._material._sprite3DMode;
  }
  set sprite3DMode(value) {
    return this._material.sprite3DMode = value;
  }
  get texture() {
    return this._material.diffuseTexture;
  }
  set texture(value) {
    return this._material.diffuseTexture = value;
  }
  get material() {
    return this._material;
  }
  set material(v) {/*임의설정불가*/}
  compute(time) {
    _classPrivateFieldGet(this, _simParamData).set([
    // startTime time
    time,
    // position
    this._x, this._y, this._z,
    // lifeRange
    this.minLife, this.maxLife,
    // x,y,z Range
    this.minStartX, this.maxStartX, this.minEndX, this.maxEndX, this.easeX, this.minStartY, this.maxStartY, this.minEndY, this.maxEndY, this.easeY, this.minStartZ, this.maxStartZ, this.minEndZ, this.maxEndZ, this.easeZ,
    // alphaRange
    this.minStartAlpha, this.maxStartAlpha, this.minEndAlpha, this.maxEndAlpha, this.easeAlpha,
    // scaleRange
    this.minStartScale, this.maxStartScale, this.minEndScale, this.maxEndScale, this.easeScale,
    // x,y,z Range
    this.minStartRotationX, this.maxStartRotationX, this.minEndRotationX, this.maxEndRotationX, this.easeRotationX, this.minStartRotationY, this.maxStartRotationY, this.minEndRotationY, this.maxEndRotationY, this.easeRotationY, this.minStartRotationZ, this.maxStartRotationZ, this.minEndRotationZ, this.maxEndRotationZ, this.easeRotationZ], 0);
    // this.simParamBuffer.setSubData(0, this.#simParamData);
    this.redGPUContext.device.queue.writeBuffer(this.simParamBuffer, 0, _classPrivateFieldGet(this, _simParamData));
    //
    const commandEncoder = this.redGPUContext.device.createCommandEncoder({});
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.computePipeline);
    passEncoder.setBindGroup(ShareGLSL.SET_INDEX_ComputeUniforms, this.particleBindGroup);
    passEncoder.dispatchWorkgroups(this._particleNum);
    passEncoder.end();
    this.redGPUContext.device.queue.submit([commandEncoder.finish()]);
  }
  setParticleData() {
    let redGPUContext = this.redGPUContext;
    const _PROPERTY_NUM = this._PROPERTY_NUM;
    const initialParticleData = new Float32Array(this._particleNum * _PROPERTY_NUM);
    const currentTime = performance.now();
    for (let i = 0; i < this._particleNum; ++i) {
      let life = Math.random() * this.maxLife;
      let age = Math.random() * life;
      initialParticleData[_PROPERTY_NUM * i + 0] = currentTime - age; // start time
      initialParticleData[_PROPERTY_NUM * i + 1] = life; // life
      // position
      initialParticleData[_PROPERTY_NUM * i + 4] = 0; // x
      initialParticleData[_PROPERTY_NUM * i + 5] = 0; // y
      initialParticleData[_PROPERTY_NUM * i + 6] = 0; // z
      initialParticleData[_PROPERTY_NUM * i + 7] =
      // alpha;
      // scale
      initialParticleData[_PROPERTY_NUM * i + 8] = 0; // rotationX
      initialParticleData[_PROPERTY_NUM * i + 9] = 0; // rotationY
      initialParticleData[_PROPERTY_NUM * i + 10] = 0; // rotationZ
      initialParticleData[_PROPERTY_NUM * i + 11] = 0; // scale
      // x
      initialParticleData[_PROPERTY_NUM * i + 12] = Math.random() * (this.maxStartX - this.minStartX) + this.minStartX; // startValue
      initialParticleData[_PROPERTY_NUM * i + 13] = Math.random() * (this.maxEndX - this.minEndX) + this.minEndX; // endValue
      initialParticleData[_PROPERTY_NUM * i + 14] = this.easeX; // ease
      initialParticleData[_PROPERTY_NUM * i + 15] = this._x; // startPosition
      // y
      initialParticleData[_PROPERTY_NUM * i + 16] = Math.random() * (this.maxStartY - this.minStartY) + this.minStartY; // startValue
      initialParticleData[_PROPERTY_NUM * i + 17] = Math.random() * (this.maxEndY - this.minEndY) + this.minEndY; // endValue
      initialParticleData[_PROPERTY_NUM * i + 18] = this.easeY; // ease
      initialParticleData[_PROPERTY_NUM * i + 19] = this._y; // startPosition
      // z
      initialParticleData[_PROPERTY_NUM * i + 20] = Math.random() * (this.maxStartZ - this.minStartZ) + this.minStartZ; // startValue
      initialParticleData[_PROPERTY_NUM * i + 21] = Math.random() * (this.maxEndZ - this.minEndZ) + this.minEndZ; // endValue
      initialParticleData[_PROPERTY_NUM * i + 22] = this.easeZ; // ease
      initialParticleData[_PROPERTY_NUM * i + 23] = this._z; // startPosition
      // rotationX
      initialParticleData[_PROPERTY_NUM * i + 24] = Math.random() * (this.maxStartRotationX - this.minStartRotationX) + this.minStartRotationX; // startValue
      initialParticleData[_PROPERTY_NUM * i + 25] = Math.random() * (this.maxEndRotationX - this.minEndRotationX) + this.minEndRotationX; // endValue
      initialParticleData[_PROPERTY_NUM * i + 26] = this.easeRotationX; // ease
      initialParticleData[_PROPERTY_NUM * i + 27] = 0; //
      // rotationY
      initialParticleData[_PROPERTY_NUM * i + 28] = Math.random() * (this.maxStartRotationY - this.minStartRotationY) + this.minStartRotationY; // startValue
      initialParticleData[_PROPERTY_NUM * i + 29] = Math.random() * (this.maxEndRotationY - this.minEndRotationY) + this.minEndRotationY; // endValue
      initialParticleData[_PROPERTY_NUM * i + 30] = this.easeRotationY; // ease
      initialParticleData[_PROPERTY_NUM * i + 31] = 0; //
      // rotationZ
      initialParticleData[_PROPERTY_NUM * i + 32] = Math.random() * (this.maxStartRotationZ - this.minStartRotationZ) + this.minStartRotationZ; // startValue
      initialParticleData[_PROPERTY_NUM * i + 33] = Math.random() * (this.maxEndRotationZ - this.minEndRotationZ) + this.minEndRotationZ; // endValue
      initialParticleData[_PROPERTY_NUM * i + 34] = this.easeRotationZ; // ease
      initialParticleData[_PROPERTY_NUM * i + 35] = 0; //
      // scale
      initialParticleData[_PROPERTY_NUM * i + 36] = Math.random() * (this.maxStartScale - this.minStartScale) + this.minStartScale; // startValue
      initialParticleData[_PROPERTY_NUM * i + 37] = Math.random() * (this.maxEndScale - this.minEndScale) + this.minEndScale; // endValue
      initialParticleData[_PROPERTY_NUM * i + 38] = this.easeScale; // ease
      initialParticleData[_PROPERTY_NUM * i + 39] = 0; //
      // alpha
      initialParticleData[_PROPERTY_NUM * i + 40] = Math.random() * (this.maxStartAlpha - this.minStartAlpha) + this.minStartAlpha;
      // startValue
      initialParticleData[_PROPERTY_NUM * i + 41] = Math.random() * (this.maxEndAlpha - this.minEndAlpha) + this.minEndAlpha; // endValue
      initialParticleData[_PROPERTY_NUM * i + 42] = this.easeAlpha; // ease
      initialParticleData[_PROPERTY_NUM * i + 43] = 0; //
    }

    if (this.particleBuffer) {
      this.particleBuffer.destroy();
      this.particleBuffer = null;
    }
    this.particleBuffer = redGPUContext.device.createBuffer({
      size: initialParticleData.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE
    });
    // this.particleBuffer.setSubData(0, initialParticleData);
    redGPUContext.device.queue.writeBuffer(this.particleBuffer, 0, initialParticleData);
    //
    let computeSource = getComputeSource(this._particleNum);
    let shaderModuleDescriptor = {
      code: redGPUContext.twgsl.convertSpirV2WGSL(redGPUContext.glslang.compileGLSL(computeSource, 'compute')).replace(/@stride\([0-9]*\)/g, ''),
      source: computeSource
    };
    console.log('shaderModuleDescriptor', shaderModuleDescriptor);
    let computeModule = redGPUContext.device.createShaderModule(shaderModuleDescriptor);
    const computeBindGroupLayout = redGPUContext.device.createBindGroupLayout({
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'uniform'
        }
      }, {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage'
        }
      }]
    });
    const computePipelineLayout = redGPUContext.device.createPipelineLayout({
      bindGroupLayouts: [computeBindGroupLayout]
    });
    this.particleBindGroup = redGPUContext.device.createBindGroup({
      layout: computeBindGroupLayout,
      entries: [{
        binding: 0,
        resource: {
          buffer: this.simParamBuffer,
          offset: 0,
          size: _classPrivateFieldGet(this, _simParamData).byteLength
        }
      }, {
        binding: 1,
        resource: {
          buffer: this.particleBuffer,
          offset: 0,
          size: initialParticleData.byteLength
        }
      }]
    });
    this.computePipeline = redGPUContext.device.createComputePipeline({
      layout: computePipelineLayout,
      compute: {
        module: computeModule,
        entryPoint: "main"
      }
    });
  }
}
_defineProperty(Particle, "Linear", 0);
_defineProperty(Particle, "QuintIn", 1);
_defineProperty(Particle, "QuintOut", 2);
_defineProperty(Particle, "QuintInOut", 3);
_defineProperty(Particle, "BackIn", 4);
_defineProperty(Particle, "BackOut", 5);
_defineProperty(Particle, "BackInOut", 6);
_defineProperty(Particle, "CircIn", 7);
_defineProperty(Particle, "CircOut", 8);
_defineProperty(Particle, "CircInOut", 9);
_defineProperty(Particle, "CubicIn", 10);
_defineProperty(Particle, "CubicOut", 11);
_defineProperty(Particle, "CubicInOut", 12);
_defineProperty(Particle, "ExpoIn", 13);
_defineProperty(Particle, "ExpoOut", 14);
_defineProperty(Particle, "ExpoInOut", 15);
_defineProperty(Particle, "QuadIn", 16);
_defineProperty(Particle, "QuadOut", 17);
_defineProperty(Particle, "QuadInOut", 18);
_defineProperty(Particle, "QuartIn", 19);
_defineProperty(Particle, "QuartOut", 20);
_defineProperty(Particle, "QuartInOut", 21);
_defineProperty(Particle, "SineIn", 22);
_defineProperty(Particle, "SineOut", 23);
_defineProperty(Particle, "SineInOut", 24);
_defineProperty(Particle, "ElasticIn", 25);
_defineProperty(Particle, "ElasticOut", 26);
_defineProperty(Particle, "ElasticInOut", 27);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
class Camera2D extends BaseObject3D {
  constructor(redGPUContext) {
    super(redGPUContext);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */
var _targetMesh$2 = /*#__PURE__*/new WeakMap();
class PipelinePostEffect extends UUID {
  constructor(redGPUContext, targetMesh) {
    super();
    _defineProperty(this, "redGPUContext", void 0);
    _classPrivateFieldInitSpec(this, _targetMesh$2, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "GPURenderPipeline", void 0);
    this.redGPUContext = redGPUContext;
    _classPrivateFieldSet(this, _targetMesh$2, targetMesh);
    this.GPURenderPipeline = null;
  }
  update(redGPUContext, redView) {
    let targetMesh = _classPrivateFieldGet(this, _targetMesh$2);
    const device = redGPUContext.device;
    const descriptor = {
      // 레이아웃은 재질이 알고있으니 들고옴
      layout: device.createPipelineLayout({
        bindGroupLayouts: [redView.systemUniformInfo_vertex.GPUBindGroupLayout, redView.systemUniformInfo_fragment.GPUBindGroupLayout, targetMesh.GPUBindGroupLayout, targetMesh._material.GPUBindGroupLayout]
      }),
      // 버텍스와 프레그먼트는 재질에서 들고온다.
      vertex: {
        module: targetMesh._material.vShaderModule.GPUShaderModule,
        entryPoint: 'main',
        buffers: targetMesh._geometry.vertexState.vertexBuffers
      },
      fragment: {
        module: targetMesh._material.fShaderModule.GPUShaderModule,
        entryPoint: 'main',
        targets: [{
          format: navigator.gpu.getPreferredCanvasFormat(redGPUContext.adapter),
          // format: 'rgba8unorm',
          blend: {
            color: {
              srcFactor: "src-alpha",
              dstFactor: "one-minus-src-alpha",
              operation: "add"
            },
            alpha: {
              srcFactor: "src-alpha",
              // dstFactor: "one-minus-src-alpha",
              dstFactor: "one",
              operation: "add"
            }
          }
        }]
      },
      // 컬러모드 지정하고

      primitive: {
        topology: targetMesh._primitiveTopology,
        cullMode: targetMesh._cullMode,
        frontFace: 'ccw'
      },
      multisample: {
        count: 1
      }
      //alphaToCoverageEnabled : true // alphaToCoverageEnabled isn't supported (yet)
    };

    this.GPURenderPipeline = device.createRenderPipeline(descriptor);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 14:41:31
 *
 */
var _prevViewRect = /*#__PURE__*/new WeakMap();
class BasePostEffect extends Mix.mix(BaseMaterial) {
  constructor(redGPUContext) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _prevViewRect, {
      writable: true,
      value: []
    });
    _defineProperty(this, "baseAttachment", void 0);
    _defineProperty(this, "baseAttachmentView", void 0);
    this.quad = new Mesh(redGPUContext, new Plane(redGPUContext), this);
    this.quad.pipeline = new PipelinePostEffect(redGPUContext, this.quad);
    this.sampler = new Sampler(redGPUContext, {
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge",
      addressModeW: "repeat"
    });
  }
  checkSize(redGPUContext, redView) {
    if ([_classPrivateFieldGet(this, _prevViewRect)[2], _classPrivateFieldGet(this, _prevViewRect)[3]].toString() != [redView.viewRect[2], redView.viewRect[3]].toString()) {
      if (this.baseAttachment) this.baseAttachment.destroy();
      _classPrivateFieldSet(this, _prevViewRect, redView.viewRect.concat());
      this.baseAttachment = redGPUContext.device.createTexture({
        size: {
          width: redView.viewRect[2],
          height: redView.viewRect[3],
          depthOrArrayLayers: 1
        },
        sampleCount: 1,
        format: redGPUContext.swapChainFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING
      });
      this.baseAttachmentView = this.baseAttachment.createView();
      return true;
    }
  }
  render(redGPUContext, redView, renderScene, sourceTextureView) {
    let result = this.checkSize(redGPUContext, redView);
    const commandEncoder_effect = redGPUContext.device.createCommandEncoder();
    const passEncoder_effect = commandEncoder_effect.beginRenderPass({
      colorAttachments: [{
        view: this.baseAttachmentView,
        clearValue: {
          r: 0,
          g: 0,
          b: 0,
          a: 0
        },
        storeOp: 'store',
        loadOp: 'clear'
      }]
    });
    let t0 = this.sourceTexture === sourceTextureView;
    this.sourceTexture = sourceTextureView;
    if (!t0) this.resetBindingInfo();
    if (result) {
      this.quad.pipeline.update(redGPUContext, redView);
    }
    Render.clearStateCache();
    redView.updateSystemUniform(passEncoder_effect, redGPUContext);
    renderScene(redGPUContext, redView, passEncoder_effect, [this.quad]);
    passEncoder_effect.end();
    redGPUContext.device.queue.submit([commandEncoder_effect.finish()]);
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 1,
      resource: this.sampler.GPUSampler
    }, {
      binding: 2,
      resource: this.sourceTexture
    }, {
      binding: 3,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(BasePostEffect, "vertexShaderGLSL", `
  ${ShareGLSL.GLSL_VERSION}
  void main() {
      gl_Position = vec4(0.0);
  }
 `);
_defineProperty(BasePostEffect, "fragmentShaderGLSL", `
  ${ShareGLSL.GLSL_VERSION}
  void main() {
  } `);
_defineProperty(BasePostEffect, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(BasePostEffect, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }]
});
_defineProperty(BasePostEffect, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(BasePostEffect, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:3:14
 *
 */
class FinalRender extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "viewRect", new Float32Array(4));
    this.projectionMatrix = t.mat4.create();
  }
  checkSize(redGPUContext, redView) {
    t.mat4.ortho(this.projectionMatrix, 0.,
    // left
    1.,
    // right
    0.,
    // bottom
    1.,
    // top,
    -1000, 1000);
    t.mat4.scale(this.projectionMatrix, this.projectionMatrix, [1 / parseInt(redGPUContext.canvas.style.width), 1 / parseInt(redGPUContext.canvas.style.height), 1]);
    t.mat4.translate(this.projectionMatrix, this.projectionMatrix, [redView.getViewRect(redGPUContext)[2] / 2 + redView.getViewRect(redGPUContext)[0], parseInt(redGPUContext.canvas.style.height) - redView.getViewRect(redGPUContext)[3] / 2 - redView.getViewRect(redGPUContext)[1], 0]);
    t.mat4.scale(this.projectionMatrix, this.projectionMatrix, [redView.getViewRect(redGPUContext)[2], redView.getViewRect(redGPUContext)[3], 1]);
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['projectionMatrix'], this.projectionMatrix);
    redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['projectionMatrix'], this.projectionMatrix);
    return true;
  }
  render(redGPUContext, redView, renderScene, sourceTextureView, passEncoder_effect) {
    let result = this.checkSize(redGPUContext, redView);
    let t0 = this.sourceTexture === sourceTextureView;
    this.sourceTexture = sourceTextureView;
    if (!t0) this.resetBindingInfo();
    if (result) {
      this.quad.pipeline.update(redGPUContext, redView);
    }
    Render.clearStateCache();
    redView.updateSystemUniform(passEncoder_effect, redGPUContext);
    renderScene(redGPUContext, redView, passEncoder_effect, [this.quad]);
  }
}
_defineProperty(FinalRender, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 3 ) uniform VertexUniforms {
	    mat4 projectionMatrix;
        vec4 viewRect;
    } vertexUniforms;
	void main() {
		// gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		gl_Position = vertexUniforms.projectionMatrix * vec4(position,1.0);
		
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(FinalRender, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);
	
		diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV ) ;
		// diffuseColor.a = 0.5;

		// diffuseColor.rgb = 1.0 - diffuseColor.rgb;
		outColor = diffuseColor;
	}
`);
_defineProperty(FinalRender, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(FinalRender, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(FinalRender, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.mat4,
  valueName: 'projectionMatrix'
}, {
  size: TypeSize.float32x4,
  valueName: 'viewRect'
}]);
_defineProperty(FinalRender, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

let _frustumPlanes = [];
let currentDebuggerData;
let renderDrawLayerIndexList = [];
let updateTargetMatrixBufferList = [];
let textToTransparentLayerList = [];
let tCacheUniformInfo = {};
let currentTime;
let prevVertexBuffer_UUID;
let prevIndexBuffer_UUID;
let prevMaterial_UUID;
let changedMaterial_UUID;
let renderScene = (_ => {
  return (redGPUContext, redView, passEncoder, children, renderDrawLayerIndexMode = 0) => {
    let i;
    let aSx, aSy, aSz, aCx, aCy, aCz, aX, aY, aZ, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33, b0, b1, b2, b3, b00, b01, b02, b10, b11, b12, b20, b21, b22;
    // sin,cos 관련
    let tRadian, CPI, CPI2, C225, C127, C045, C157;
    let CONVERT_RADIAN = Math.PI / 180;
    CPI = 3.141592653589793, CPI2 = 6.283185307179586, C225 = 0.225, C127 = 1.27323954, C045 = 0.405284735, C157 = 1.5707963267948966;
    /////

    i = children.length;
    let frustumPlanes0, frustumPlanes1, frustumPlanes2, frustumPlanes3, frustumPlanes4, frustumPlanes5;
    frustumPlanes0 = _frustumPlanes[0];
    frustumPlanes1 = _frustumPlanes[1];
    frustumPlanes2 = _frustumPlanes[2];
    frustumPlanes3 = _frustumPlanes[3];
    frustumPlanes4 = _frustumPlanes[4];
    frustumPlanes5 = _frustumPlanes[5];
    let tMVMatrix, tNMatrix;
    let tLocalMatrix;
    let parentMTX, parentDirty, parent;
    let tSkinInfo;
    let tGeometry;
    let tMaterial;
    let tMesh;
    let tDirtyTransform;
    let tPipeline;
    let tDirtyPipeline;
    let tMaterialChanged;
    let tVisible;
    let geoVolume;
    let radius;
    let radiusTemp;
    let tOpacity, tParentSumOpacity;
    let tFlatRenderYn = children == redView.scene._flatChildList;
    let isCamera2D = redView.camera instanceof Camera2D;
    while (i--) {
      tMesh = children[i];
      tMaterial = tMesh._material;
      tGeometry = tMesh._geometry;
      parent = tMesh._parent;
      parentMTX = 0;
      tParentSumOpacity = 1;
      parentDirty = 0;
      tOpacity = tMesh._opacity;
      if (parent) {
        parentDirty = parent._renderTimeDirtyTransform;
        parentMTX = parent.matrix;
        tParentSumOpacity = parent._sumOpacity;
      }
      if (tMesh._sumOpacity != tOpacity * tParentSumOpacity) {
        tMesh.sumOpacity = tOpacity * tParentSumOpacity;
        console.log('sumOpacity', tOpacity);
      }
      tDirtyTransform = tMesh.dirtyTransform;
      tMesh._renderTimeDirtyTransform = parentDirty || tDirtyTransform;
      // console.log(tMesh._geometry, parentDirty,tMesh.dirtyTransform)

      tDirtyPipeline = tMesh.dirtyPipeline;
      tPipeline = tMesh.pipeline;
      tSkinInfo = tMesh.skinInfo;
      tMVMatrix = tMesh.matrix;
      tLocalMatrix = tMesh.localMatrix;
      tMaterialChanged = 0;
      currentDebuggerData['object3DNum']++;
      if (tMaterial) {
        if (tMaterial.needResetBindingInfo) {
          tMaterial.resetBindingInfo();
          tMaterial.needResetBindingInfo = false;
          tMaterialChanged = tMesh._prevMaterialUUID != tMaterial._UUID;
          changedMaterial_UUID[tMaterial._UUID] = 1;
        }
        if (tMaterial instanceof SpriteSheetMaterial) {
          tMaterial.update(currentTime);
        }
        tMaterialChanged = changedMaterial_UUID[tMaterial._UUID];
      }
      if (tGeometry) {
        if (tDirtyPipeline || tMaterialChanged) {
          if (tPipeline instanceof PipelineBasic || tPipeline instanceof PipelineParticle) {
            // console.log('tDirtyPipeline', tDirtyPipeline, 'tMaterialChanged', tMaterialChanged)
            // console.time('tPipeline.update' + tMesh._UUID)
            tPipeline.update(redGPUContext, redView);
            currentDebuggerData['dirtyPipelineNum']++;
            // console.timeEnd('tPipeline.update' + tMesh._UUID)
          }
        }

        tVisible = 1;
        let needRenderCheck = false;
        if (renderDrawLayerIndexMode == Render.DRAW_LAYER_INDEX0 && tMesh._renderDrawLayerIndex == Render.DRAW_LAYER_INDEX1) {
          renderDrawLayerIndexList.push(tMesh);
        } else {
          if (tMesh._renderDrawLayerIndex == Render.DRAW_LAYER_INDEX2_Z_POINT_SORT || tMaterial instanceof SpriteSheetMaterial) {
            a02 = redView.camera.matrix[2], a12 = redView.camera.matrix[6], a22 = redView.camera.matrix[10], a32 = redView.camera.matrix[14];
            // b0 = tMesh._x, b1 = tMesh._y, b2 = tMesh._z, b3 = 1;
            b0 = tMVMatrix[12], b1 = tMVMatrix[13], b2 = tMVMatrix[14], b3 = 1;
            textToTransparentLayerList.push({
              z: b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
              targetText: tMesh
            });
          } else {
            needRenderCheck = true;
          }
        }
        if (needRenderCheck || renderDrawLayerIndexMode) {
          if (redView._useFrustumCulling) {
            geoVolume = tGeometry._volume || tGeometry.volume;
            radius = geoVolume.xSize * tMesh.matrix[0];
            radiusTemp = geoVolume.ySize * tMesh.matrix[5];
            radius = radius < radiusTemp ? radiusTemp : radius;
            radiusTemp = geoVolume.zSize * tMesh.matrix[10];
            radius = radius < radiusTemp ? radiusTemp : radius;
            a00 = tMVMatrix[12], a01 = tMVMatrix[13], a02 = tMVMatrix[14], frustumPlanes0[0] * a00 + frustumPlanes0[1] * a01 + frustumPlanes0[2] * a02 + frustumPlanes0[3] <= -radius ? tVisible = 0 : frustumPlanes1[0] * a00 + frustumPlanes1[1] * a01 + frustumPlanes1[2] * a02 + frustumPlanes1[3] <= -radius ? tVisible = 0 : frustumPlanes2[0] * a00 + frustumPlanes2[1] * a01 + frustumPlanes2[2] * a02 + frustumPlanes2[3] <= -radius ? tVisible = 0 : frustumPlanes3[0] * a00 + frustumPlanes3[1] * a01 + frustumPlanes3[2] * a02 + frustumPlanes3[3] <= -radius ? tVisible = 0 : frustumPlanes4[0] * a00 + frustumPlanes4[1] * a01 + frustumPlanes4[2] * a02 + frustumPlanes4[3] <= -radius ? tVisible = 0 : frustumPlanes5[0] * a00 + frustumPlanes5[1] * a01 + frustumPlanes5[2] * a02 + frustumPlanes5[3] <= -radius ? tVisible = 0 : 0;
          }
          // console.log(tVisible);
          ///////////////////////////////////////
          if (tMesh instanceof Particle) {
            tMesh.compute(currentTime);
            passEncoder.setPipeline(tPipeline.GPURenderPipeline);
            if (prevVertexBuffer_UUID != tGeometry.interleaveBuffer._UUID) {
              passEncoder.setVertexBuffer(0, tGeometry.interleaveBuffer.GPUBuffer);
              prevVertexBuffer_UUID = tGeometry.interleaveBuffer._UUID;
            }
            passEncoder.setVertexBuffer(1, tMesh.particleBuffer);
            passEncoder.setBindGroup(2, tMesh.GPUBindGroup); // 메쉬 바인딩 그룹는 매그룹마다 다르니 또 업데이트 해줘야함 -_-
            if (prevMaterial_UUID != tMaterial._UUID) {
              passEncoder.setBindGroup(3, tMaterial.uniformBindGroup_material.GPUBindGroup);
              prevMaterial_UUID = tMaterial._UUID;
            }
            if (tGeometry.indexBuffer) {
              if (prevIndexBuffer_UUID != tGeometry.indexBuffer._UUID) {
                passEncoder.setIndexBuffer(tGeometry.indexBuffer.GPUBuffer, 'uint32');
                prevIndexBuffer_UUID = tGeometry.indexBuffer._UUID;
              }
              passEncoder.drawIndexed(tGeometry.indexBuffer.indexNum, tMesh._particleNum, 0, 0, 0);
              currentDebuggerData['triangleNum'] += tGeometry.indexBuffer.indexNum / 3;
            } else {
              passEncoder.draw(tGeometry.interleaveBuffer.vertexCount, tMesh._particleNum, 0, 0, 0);
              currentDebuggerData['triangleNum'] += tGeometry.interleaveBuffer.data.length / tGeometry.interleaveBuffer.stride;
            }
            currentDebuggerData['drawCallNum']++;
          } else {
            if (tVisible) {
              passEncoder.setPipeline(tPipeline.GPURenderPipeline);
              if (prevVertexBuffer_UUID != tGeometry.interleaveBuffer._UUID) {
                passEncoder.setVertexBuffer(0, tGeometry.interleaveBuffer.GPUBuffer);
                prevVertexBuffer_UUID = tGeometry.interleaveBuffer._UUID;
              }
              passEncoder.setBindGroup(2, tMesh.GPUBindGroup); // 메쉬 바인딩 그룹는 매그룹마다 다르니 또 업데이트 해줘야함 -_-
              if (prevMaterial_UUID != tMaterial._UUID) {
                passEncoder.setBindGroup(3, tMaterial.uniformBindGroup_material.GPUBindGroup);
                prevMaterial_UUID = tMaterial._UUID;
              }
              if (tGeometry.indexBuffer) {
                if (prevIndexBuffer_UUID != tGeometry.indexBuffer._UUID) {
                  passEncoder.setIndexBuffer(tGeometry.indexBuffer.GPUBuffer, 'uint32');
                  prevIndexBuffer_UUID = tGeometry.indexBuffer._UUID;
                }
                passEncoder.drawIndexed(tGeometry.indexBuffer.indexNum, 1, 0, 0, 0);
                currentDebuggerData['triangleNum'] += tGeometry.indexBuffer.indexNum / 3;
              } else {
                passEncoder.draw(tGeometry.interleaveBuffer.vertexCount, 1, 0, 0, 0);
                currentDebuggerData['triangleNum'] += tGeometry.interleaveBuffer.data.length / tGeometry.interleaveBuffer.stride;
              }
              currentDebuggerData['drawCallNum']++;
            }
          }
          tMesh._prevMaterialUUID = tMaterial._UUID;
        }

        // materialPropertyCheck
        ////////////////////////
      }

      if (tDirtyTransform) {
        /////////////////////////////////////
        a00 = 1, a01 = 0, a02 = 0, a10 = 0, a11 = 1, a12 = 0, a20 = 0, a21 = 0, a22 = 1,
        // tLocalMatrix translate
        tLocalMatrix[12] = tMesh._x, tLocalMatrix[13] = tMesh._y * (isCamera2D ? -1 : 1), tLocalMatrix[14] = tMesh._z, tLocalMatrix[15] = 1,
        // tLocalMatrix rotate
        aX = tMesh._rotationX * CONVERT_RADIAN, aY = tMesh._rotationY * CONVERT_RADIAN, aZ = tMesh._rotationZ * CONVERT_RADIAN;
        /////////////////////////
        tRadian = aX % CPI2, tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0, tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian, aSx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian, tRadian = (aX + C157) % CPI2, tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0, tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian, aCx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian, tRadian = aY % CPI2, tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0, tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian, aSy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian, tRadian = (aY + C157) % CPI2, tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0, tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian, aCy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian, tRadian = aZ % CPI2, tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0, tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian, aSz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian, tRadian = (aZ + C157) % CPI2, tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0, tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian, aCz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
        /////////////////////////
        b00 = aCy * aCz, b01 = aSx * aSy * aCz - aCx * aSz, b02 = aCx * aSy * aCz + aSx * aSz, b10 = aCy * aSz, b11 = aSx * aSy * aSz + aCx * aCz, b12 = aCx * aSy * aSz - aSx * aCz, b20 = -aSy, b21 = aSx * aCy, b22 = aCx * aCy,
        // tLocalMatrix scale
        aX = tMesh._scaleX, aY = tMesh._scaleY, aZ = tMesh._scaleZ, tLocalMatrix[0] = (a00 * b00 + a10 * b01 + a20 * b02) * aX, tLocalMatrix[1] = (a01 * b00 + a11 * b01 + a21 * b02) * aX, tLocalMatrix[2] = (a02 * b00 + a12 * b01 + a22 * b02) * aX, tLocalMatrix[3] = tLocalMatrix[3] * aX, tLocalMatrix[4] = (a00 * b10 + a10 * b11 + a20 * b12) * aY, tLocalMatrix[5] = (a01 * b10 + a11 * b11 + a21 * b12) * aY, tLocalMatrix[6] = (a02 * b10 + a12 * b11 + a22 * b12) * aY, tLocalMatrix[7] = tLocalMatrix[7] * aY, tLocalMatrix[8] = (a00 * b20 + a10 * b21 + a20 * b22) * aZ, tLocalMatrix[9] = (a01 * b20 + a11 * b21 + a21 * b22) * aZ, tLocalMatrix[10] = (a02 * b20 + a12 * b21 + a22 * b22) * aZ, tLocalMatrix[11] = tLocalMatrix[11] * aZ,
        // 피봇처리
        tMesh['_pivotX'] || tMesh['_pivotY'] || tMesh['_pivotZ'] ? (a00 = tLocalMatrix[0], a01 = tLocalMatrix[1], a02 = tLocalMatrix[2], a03 = tLocalMatrix[3], a10 = tLocalMatrix[4], a11 = tLocalMatrix[5], a12 = tLocalMatrix[6], a13 = tLocalMatrix[7], a20 = tLocalMatrix[8], a21 = tLocalMatrix[9], a22 = tLocalMatrix[10], a23 = tLocalMatrix[11], a30 = tLocalMatrix[12], a31 = tLocalMatrix[13], a32 = tLocalMatrix[14], a33 = tLocalMatrix[15],
        // Cache only the current line of the second matrix
        b0 = 1, b1 = 0, b2 = 0, b3 = 0, tLocalMatrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, tLocalMatrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, tLocalMatrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, tLocalMatrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = 0, b1 = 1, b2 = 0, b3 = 0, tLocalMatrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, tLocalMatrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, tLocalMatrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, tLocalMatrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = 0, b1 = 0, b2 = 1, b3 = 0, tLocalMatrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, tLocalMatrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, tLocalMatrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, tLocalMatrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, isCamera2D ? parentMTX ? (b0 = -tMesh['_pivotX'], b1 = tMesh['_pivotY'], b2 = -tMesh['_pivotZ'], b3 = 1) : (b0 = -tMesh['_pivotX'] / aX, b1 = tMesh['_pivotY'] / aY, b2 = -tMesh['_pivotZ'], b3 = 1) : (b0 = -tMesh['_pivotX'], b1 = -tMesh['_pivotY'], b2 = -tMesh['_pivotZ'], b3 = 1), tLocalMatrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, tLocalMatrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, tLocalMatrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, tLocalMatrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33) : 0;
      }
      if (parentDirty || tDirtyTransform) {
        currentDebuggerData['dirtyTransformNum']++;
        // 부모가 있으면 곱처리함
        parentMTX ? (
        // 부모매트릭스 복사
        // 매트립스 곱
        a00 = parentMTX[0], a01 = parentMTX[1], a02 = parentMTX[2], a03 = parentMTX[3], a10 = parentMTX[4], a11 = parentMTX[5], a12 = parentMTX[6], a13 = parentMTX[7], a20 = parentMTX[8], a21 = parentMTX[9], a22 = parentMTX[10], a23 = parentMTX[11], a30 = parentMTX[12], a31 = parentMTX[13], a32 = parentMTX[14], a33 = parentMTX[15], b0 = tLocalMatrix[0], b1 = tLocalMatrix[1], b2 = tLocalMatrix[2], b3 = tLocalMatrix[3], tMVMatrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, tMVMatrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, tMVMatrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, tMVMatrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = tLocalMatrix[4], b1 = tLocalMatrix[5], b2 = tLocalMatrix[6], b3 = tLocalMatrix[7], tMVMatrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, tMVMatrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, tMVMatrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, tMVMatrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = tLocalMatrix[8], b1 = tLocalMatrix[9], b2 = tLocalMatrix[10], b3 = tLocalMatrix[11], tMVMatrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, tMVMatrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, tMVMatrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, tMVMatrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = tLocalMatrix[12], b1 = tLocalMatrix[13], b2 = tLocalMatrix[14], b3 = tLocalMatrix[15], tMVMatrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, tMVMatrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, tMVMatrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, tMVMatrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33) : (tMVMatrix[0] = tLocalMatrix[0], tMVMatrix[1] = tLocalMatrix[1], tMVMatrix[2] = tLocalMatrix[2], tMVMatrix[3] = tLocalMatrix[3], tMVMatrix[4] = tLocalMatrix[4], tMVMatrix[5] = tLocalMatrix[5], tMVMatrix[6] = tLocalMatrix[6], tMVMatrix[7] = tLocalMatrix[7], tMVMatrix[8] = tLocalMatrix[8], tMVMatrix[9] = tLocalMatrix[9], tMVMatrix[10] = tLocalMatrix[10], tMVMatrix[11] = tLocalMatrix[11], tMVMatrix[12] = tLocalMatrix[12], tMVMatrix[13] = tLocalMatrix[13], tMVMatrix[14] = tLocalMatrix[14], tMVMatrix[15] = tLocalMatrix[15]),
        // normal calc

        tNMatrix = tMesh.normalMatrix;
        a00 = tMVMatrix[0], a01 = tMVMatrix[1], a02 = tMVMatrix[2], a03 = tMVMatrix[3], a10 = tMVMatrix[4], a11 = tMVMatrix[5], a12 = tMVMatrix[6], a13 = tMVMatrix[7], a20 = tMVMatrix[8], a21 = tMVMatrix[9], a22 = tMVMatrix[10], a23 = tMVMatrix[11], a31 = tMVMatrix[12], a32 = tMVMatrix[13], a33 = tMVMatrix[14], b0 = tMVMatrix[15], a30 = a00 * a11 - a01 * a10, b1 = a00 * a12 - a02 * a10, b2 = a00 * a13 - a03 * a10, b3 = a01 * a12 - a02 * a11, b00 = a01 * a13 - a03 * a11, b01 = a02 * a13 - a03 * a12, b02 = a20 * a32 - a21 * a31, b10 = a20 * a33 - a22 * a31, b11 = a20 * b0 - a23 * a31, b12 = a21 * a33 - a22 * a32, b20 = a21 * b0 - a23 * a32, b12 = a22 * b0 - a23 * a33, b22 = a30 * b12 - b1 * b20 + b2 * b12 + b3 * b11 - b00 * b10 + b01 * b02, b22 = 1 / b22, tNMatrix[0] = (a11 * b12 - a12 * b20 + a13 * b12) * b22, tNMatrix[4] = (-a01 * b12 + a02 * b20 - a03 * b12) * b22, tNMatrix[8] = (a32 * b01 - a33 * b00 + b0 * b3) * b22, tNMatrix[12] = (-a21 * b01 + a22 * b00 - a23 * b3) * b22, tNMatrix[1] = (-a10 * b12 + a12 * b11 - a13 * b10) * b22, tNMatrix[5] = (a00 * b12 - a02 * b11 + a03 * b10) * b22, tNMatrix[9] = (-a31 * b01 + a33 * b2 - b0 * b1) * b22, tNMatrix[13] = (a20 * b01 - a22 * b2 + a23 * b1) * b22, tNMatrix[2] = (a10 * b20 - a11 * b11 + a13 * b02) * b22, tNMatrix[6] = (-a00 * b20 + a01 * b11 - a03 * b02) * b22, tNMatrix[10] = (a31 * b00 - a32 * b2 + b0 * a30) * b22, tNMatrix[14] = (-a20 * b00 + a21 * b2 - a23 * a30) * b22, tNMatrix[3] = (-a10 * b12 + a11 * b10 - a12 * b02) * b22, tNMatrix[7] = (a00 * b12 - a01 * b10 + a02 * b02) * b22, tNMatrix[11] = (-a31 * b3 + a32 * b1 - a33 * a30) * b22, tNMatrix[15] = (a20 * b3 - a21 * b1 + a22 * a30) * b22;
        // tMesh.calcTransform(parent);
        // tMesh.updateUniformBuffer();

        updateTargetMatrixBufferList.includes(tMesh.uniformBuffer_meshMatrix) ? 0 : updateTargetMatrixBufferList.push(tMesh.uniformBuffer_meshMatrix);
        tMesh.uniformBuffer_meshMatrix.meshFloat32Array.set(tMesh.matrix, tMesh.offsetMatrix / Float32Array.BYTES_PER_ELEMENT);
        tMesh.uniformBuffer_meshMatrix.meshFloat32Array.set(tMesh.normalMatrix, tMesh.offsetNormalMatrix / Float32Array.BYTES_PER_ELEMENT);
      }
      if (tSkinInfo) {
        let joints = tSkinInfo['joints'];
        let joint_i = 0;
        let len = joints.length;
        let tJointMTX;
        let globalTransformOfJointNode = new Float32Array(len * 16);
        let globalTransformOfNodeThatTheMeshIsAttachedTo = new Float32Array([tMVMatrix[0], tMVMatrix[1], tMVMatrix[2], tMVMatrix[3], tMVMatrix[4], tMVMatrix[5], tMVMatrix[6], tMVMatrix[7], tMVMatrix[8], tMVMatrix[9], tMVMatrix[10], tMVMatrix[11], tMVMatrix[12], tMVMatrix[13], tMVMatrix[14], tMVMatrix[15]]);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Inverse
        let te = globalTransformOfNodeThatTheMeshIsAttachedTo,
          me = globalTransformOfNodeThatTheMeshIsAttachedTo,
          n11 = me[0],
          n21 = me[1],
          n31 = me[2],
          n41 = me[3],
          n12 = me[4],
          n22 = me[5],
          n32 = me[6],
          n42 = me[7],
          n13 = me[8],
          n23 = me[9],
          n33 = me[10],
          n43 = me[11],
          n14 = me[12],
          n24 = me[13],
          n34 = me[14],
          n44 = me[15],
          t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
          t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
          t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
          t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
        let det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
        if (det === 0) {
          console.warn("can't invert matrix, determinant is 0");
          return mat4.identity(globalTransformOfNodeThatTheMeshIsAttachedTo);
        } else {
          const detInv = 1 / det;
          te[0] = t11 * detInv;
          te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
          te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
          te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
          te[4] = t12 * detInv;
          te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
          te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
          te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
          te[8] = t13 * detInv;
          te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
          te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
          te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
          te[12] = t14 * detInv;
          te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
          te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
          te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 글로벌 조인트 노드병합함
        for (joint_i; joint_i < len; joint_i++) {
          // 조인트 공간내에서의 전역
          tJointMTX = joints[joint_i]['matrix'];
          globalTransformOfJointNode[joint_i * 16 + 0] = tJointMTX[0];
          globalTransformOfJointNode[joint_i * 16 + 1] = tJointMTX[1];
          globalTransformOfJointNode[joint_i * 16 + 2] = tJointMTX[2];
          globalTransformOfJointNode[joint_i * 16 + 3] = tJointMTX[3];
          globalTransformOfJointNode[joint_i * 16 + 4] = tJointMTX[4];
          globalTransformOfJointNode[joint_i * 16 + 5] = tJointMTX[5];
          globalTransformOfJointNode[joint_i * 16 + 6] = tJointMTX[6];
          globalTransformOfJointNode[joint_i * 16 + 7] = tJointMTX[7];
          globalTransformOfJointNode[joint_i * 16 + 8] = tJointMTX[8];
          globalTransformOfJointNode[joint_i * 16 + 9] = tJointMTX[9];
          globalTransformOfJointNode[joint_i * 16 + 10] = tJointMTX[10];
          globalTransformOfJointNode[joint_i * 16 + 11] = tJointMTX[11];
          globalTransformOfJointNode[joint_i * 16 + 12] = tJointMTX[12];
          globalTransformOfJointNode[joint_i * 16 + 13] = tJointMTX[13];
          globalTransformOfJointNode[joint_i * 16 + 14] = tJointMTX[14];
          globalTransformOfJointNode[joint_i * 16 + 15] = tJointMTX[15];
        }

        // tMaterial.uniformBuffer_vertex.GPUBuffer.setSubData(tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['globalTransformOfNodeThatTheMeshIsAttachedTo'], globalTransformOfNodeThatTheMeshIsAttachedTo);
        // tMaterial.uniformBuffer_vertex.GPUBuffer.setSubData(tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['jointMatrix'], globalTransformOfJointNode);

        tMaterial.uniformBuffer_vertex.float32Array.set(globalTransformOfNodeThatTheMeshIsAttachedTo, tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['globalTransformOfNodeThatTheMeshIsAttachedTo'] / Float32Array.BYTES_PER_ELEMENT);
        tMaterial.uniformBuffer_vertex.float32Array.set(globalTransformOfJointNode, tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['jointMatrix'] / Float32Array.BYTES_PER_ELEMENT);
        if (!tSkinInfo['inverseBindMatrices']['_UUID']) tSkinInfo['inverseBindMatrices']['_UUID'] = JSON.stringify(tSkinInfo['inverseBindMatrices']);
        let tUUID = tMaterial.uniformBuffer_vertex['_UUID'];
        if (tCacheUniformInfo[tUUID] != tSkinInfo['inverseBindMatrices']['_UUID']) {
          // tMaterial.uniformBuffer_vertex.GPUBuffer.setSubData(tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['inverseBindMatrixForJoint'], tSkinInfo['inverseBindMatrices']);
          tMaterial.uniformBuffer_vertex.float32Array.set(tSkinInfo['inverseBindMatrices'], tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['inverseBindMatrixForJoint'] / Float32Array.BYTES_PER_ELEMENT);
          tCacheUniformInfo[tUUID] = tSkinInfo['inverseBindMatrices']['_UUID'];
        }
        // tMaterial.uniformBuffer_vertex.GPUBuffer.setSubData(0, tMaterial.uniformBuffer_vertex.float32Array)
        redGPUContext.device.queue.writeBuffer(tMaterial.uniformBuffer_vertex.GPUBuffer, 0, tMaterial.uniformBuffer_vertex.float32Array);
      }
      if (!tFlatRenderYn) renderScene(redGPUContext, redView, passEncoder, tMesh.children);
      tMesh.dirtyPipeline = false;
      tMesh.dirtyTransform = false;
    }
  };
})();
let renderOptions = (_ => {
  let tOptionRenderList = [];
  let tScene;
  return (redGPUContext, redView, passEncoder) => {
    tScene = redView.scene;
    if (tScene.skyBox) {
      if (redView.camera['farClipping'] * 0.6 != tScene.skyBox._prevScale) tScene.skyBox['scaleX'] = tScene.skyBox['scaleY'] = tScene.skyBox['scaleZ'] = tScene.skyBox._prevScale = redView.camera['farClipping'] * 0.6;
      tOptionRenderList.push(tScene.skyBox);
    }
    if (tScene.grid) tOptionRenderList.push(tScene.grid);
    if (tScene.axis) tOptionRenderList.push(tScene.axis);
    if (tOptionRenderList.length) renderScene(redGPUContext, redView, passEncoder, tOptionRenderList);
    tOptionRenderList.length = 0;
  };
})();
let renderPostEffect = (redGPUContext, redView) => {
  let last_effect_baseAttachmentView = redView.baseAttachment_ResolveTargetView;
  let last_effect_baseAttachment = redView.baseAttachment_ResolveTarget;
  // 포스트 이펙트 렌더
  let effectIDX = 0;
  let len3 = redView.postEffect.effectList.length;
  for (effectIDX; effectIDX < len3; effectIDX++) {
    let tEffect = redView.postEffect.effectList[effectIDX];
    tEffect.render(redGPUContext, redView, renderScene, last_effect_baseAttachmentView);
    last_effect_baseAttachmentView = tEffect.baseAttachmentView;
    last_effect_baseAttachment = tEffect.baseAttachment;
  }
  return last_effect_baseAttachment;
};
let renderTransparentLayerList = (redGPUContext, redView, passEncoder) => {
  if (renderDrawLayerIndexList.length) renderScene(redGPUContext, redView, passEncoder, renderDrawLayerIndexList, Render.DRAW_LAYER_INDEX1);
  renderDrawLayerIndexList.length = 0;
};
let renderTextLayerList = (redGPUContext, redView, passEncoder) => {
  if (textToTransparentLayerList.length) {
    let tList = [];
    let i = textToTransparentLayerList.length;
    textToTransparentLayerList.sort((a, b) => {
      if (a.z > b.z) return -1;
      if (a.z < b.z) return 1;
      return 0;
    });
    while (i--) tList[i] = textToTransparentLayerList[i].targetText;
    renderScene(redGPUContext, redView, passEncoder, tList, Render.DRAW_LAYER_INDEX2_Z_POINT_SORT);
  }
  textToTransparentLayerList.length = 0;
};
let renderLightDebugger = (redGPUContext, redView, passEncoder) => {
  if (redView.debugLightList.length) {
    let cache_useFrustumCulling = redView.useFrustumCulling;
    redView.useFrustumCulling = false;
    renderScene(redGPUContext, redView, passEncoder, redView.debugLightList);
    redView.useFrustumCulling = cache_useFrustumCulling;
  }
};
// let copyToFinalTexture = (redGPUContext, redView, commandEncoder, lastTexture, swapChainTexture, swapChainTextureView) => {
//     let test = new FinalRender(redGPUContext)
//     test.baseAttachment = swapChainTexture
//     test.baseAttachmentView = swapChainTextureView
//     test.render(redGPUContext, redView, renderScene, lastTexture.createView())
//     // let tViewRect = redView.viewRect;
//
//     // let [tX, tY, tW, tH] = tViewRect;
//     // let sourceX, sourceY;
//     // let [cvsW, cvsH] = [redGPUContext.canvas.width, redGPUContext.canvas.height];
//     // // console.log('pre', tX, tY, tW, tH)
//     // sourceX = 0;
//     // sourceY = 0;
//     // if (tX < 0) {
//     // 	sourceX = -tX;
//     // 	tW = tW + tX;
//     // 	tX = 0;
//     // 	if (tW < 0) {
//     // 		sourceX = 0;
//     // 		tW = 0
//     // 	}
//     // } else {
//     // 	tW = tW + tX > cvsW ? tW - tX : tW;
//     // 	if (tW > cvsW) tW = cvsW - tX;
//     // 	if (tW < 0) tW = 0;
//     // 	if (tW + tX > cvsW) tW = 0;
//     // 	if (tX > cvsW) tX = cvsW;
//     // }
//     // if (tY < 0) {
//     // 	sourceY = -tY;
//     // 	tH = tH + tY;
//     // 	tY = 0;
//     // 	if (tH < 0) {
//     // 		sourceY = 0;
//     // 		tH = 0
//     // 	}
//     // } else {
//     // 	tH = tH + tY > cvsH ? tH - tY : tH;
//     // 	if (tH > cvsH) tH = cvsH - tY;
//     // 	if (tH < 0) tH = 0;
//     // 	if (tH + tY > cvsH) tH = 0;
//     // 	if (tY > cvsH) tY = cvsH;
//     // }
//
//
//     // // console.log('after', tX, tY, tW, tH)
//     // commandEncoder.copyTextureToTexture(
//     // 	{
//     // 		texture: lastTexture,
//     // 		origin: {x: sourceX, y: sourceY, z: 0}
//     // 	},
//     // 	{
//     // 		texture: dstTexture,
//     // 		origin: {x: tX, y: tY, z: 0}
//     // 	},
//     // 	{width: tW, height: tH, depthOrArrayLayers: 1}
//     // );
// };
let renderView = (redGPUContext, redView, swapChainTexture, swapChainTextureView) => {
  let tScene, tSceneBackgroundColor_rgba;
  let now = performance.now();
  tScene = redView.scene;
  tSceneBackgroundColor_rgba = tScene.backgroundColorRGBA;
  if (redView.camera.update) redView.camera.update();
  // console.log(swapChain.getCurrentTexture())
  _frustumPlanes = redView.computeViewFrustumPlanes(redView);
  let renderPassDescriptor = {
    colorAttachments: [{
      view: redView.baseAttachmentView,
      resolveTarget: redView.baseAttachment_ResolveTargetView,
      clearValue: {
        r: tSceneBackgroundColor_rgba[0],
        g: tSceneBackgroundColor_rgba[1],
        b: tSceneBackgroundColor_rgba[2],
        a: tSceneBackgroundColor_rgba[3]
      },
      storeOp: 'store',
      loadOp: 'clear'
    }, {
      view: redView.baseAttachment_mouseColorID_depthView,
      resolveTarget: redView.baseAttachment_mouseColorID_depth_ResolveTargetView,
      clearValue: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
      },
      storeOp: 'store',
      loadOp: 'clear'
    }],
    depthStencilAttachment: {
      view: redView.baseDepthStencilAttachmentView,
      depthClearValue: 1.0,
      depthLoadOp: "clear",
      depthStoreOp: "store",
      stencilClearValue: 0,
      stencilLoadOp: "load",
      stencilStoreOp: "store"
    }
  };
  let mainRenderCommandEncoder = redGPUContext.device.createCommandEncoder();
  let mainRenderPassEncoder = mainRenderCommandEncoder.beginRenderPass(renderPassDescriptor);
  // 시스템 유니폼 업데이트
  redView.updateSystemUniform(mainRenderPassEncoder, redGPUContext);
  let tViewRect = redView.viewRect;
  mainRenderPassEncoder.setViewport(0, 0, tViewRect[2], tViewRect[3], 0, 1);
  mainRenderPassEncoder.setScissorRect(0, 0, tViewRect[2], tViewRect[3]);
  // render skyBox, grid, axis
  renderOptions(redGPUContext, redView, mainRenderPassEncoder);
  // 실제 Scene렌더

  renderScene(redGPUContext, redView, mainRenderPassEncoder, tScene._flatChildList);
  // 투명레이어 렌더
  renderTransparentLayerList(redGPUContext, redView, mainRenderPassEncoder);
  // 텍스트 렌더
  renderTextLayerList(redGPUContext, redView, mainRenderPassEncoder);
  // 라이트 디버거 렌더
  renderLightDebugger(redGPUContext, redView, mainRenderPassEncoder);
  mainRenderPassEncoder.end();
  currentDebuggerData['baseRenderTime'] = performance.now() - now;
  //////////////////////////////////////////////////////////////////////////////////////////
  now = performance.now();
  // 최종 텍스쳐 결정
  let lastTexture = redView.postEffect.effectList.length ? renderPostEffect(redGPUContext, redView) : redView.baseAttachment_ResolveTarget;
  redView._lastTextureView = lastTexture.createView();
  currentDebuggerData['postEffectRenderTime'] = performance.now() - now;
  //////////////////////////////////////////////////////////////////////////////////////////
  now = performance.now();

  // 렌더 종료
  // redGPUContext.device.queue.submit([mainRenderCommandEncoder.finish()]);
  return mainRenderCommandEncoder.finish();
};
class Render {
  constructor() {}
  render(time, redGPUContext) {
    currentTime = time;
    let debuggerData = Debugger.resetData(redGPUContext.viewList);
    let i = 0,
      len = redGPUContext.viewList.length;
    let redView;
    changedMaterial_UUID = {};
    let mouseStates = [];
    let swapChainTexture = redGPUContext.context.getCurrentTexture();
    let swapChainTextureView = swapChainTexture.createView();
    let submitList = [];
    const finale_commandEncoder = redGPUContext.device.createCommandEncoder();
    const final_passEncoder = finale_commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: swapChainTextureView,
        clearValue: {
          r: 0,
          g: 0,
          b: 0,
          a: 0
        },
        storeOp: 'store',
        loadOp: 'clear'
      }]
    });
    for (i; i < len; i++) {
      redView = redGPUContext.viewList[i];
      currentDebuggerData = debuggerData[i];
      Render.clearStateCache();
      if (DisplayContainer.needFlatListUpdate) {
        redView.scene._flatChildList = UTIL.getFlatChildList(redView.scene._children);
        console.log(redView.scene._flatChildList);
      }
      submitList.push(renderView(redGPUContext, redView));
      // 마우스 이벤트 체크
      mouseStates.push(redView.mouseEventChecker.check(redGPUContext));
      if (!redView._finalRender) redView._finalRender = new FinalRender(redGPUContext);
      redView._finalRender.baseAttachment = swapChainTexture;
      redView._finalRender.baseAttachmentView = swapChainTextureView;
      redView._finalRender.render(redGPUContext, redView, renderScene, redView._lastTextureView, final_passEncoder);
    }
    final_passEncoder.end();
    submitList.push(finale_commandEncoder.finish());
    redGPUContext.device.queue.submit(submitList);
    //
    if (mouseStates.includes('pointer')) redGPUContext.canvas.style.cursor = 'pointer';else redGPUContext.canvas.style.cursor = 'default';
    // 업데이트 대상 유니폼 버퍼 갱신
    i = updateTargetMatrixBufferList.length;
    while (i--) {
      // updateTargetMatrixBufferList[i].GPUBuffer.setSubData(0, updateTargetMatrixBufferList[i].meshFloat32Array);
      redGPUContext.device.queue.writeBuffer(updateTargetMatrixBufferList[i].GPUBuffer, 0, updateTargetMatrixBufferList[i].meshFloat32Array);
    }
    DisplayContainer.needFlatListUpdate = false;
    updateTargetMatrixBufferList.length = 0;
    GLTFLoader$1.animationLooper(time);
    Debugger.update();
  }
}
_defineProperty(Render, "DRAW_LAYER_INDEX0", 0);
_defineProperty(Render, "DRAW_LAYER_INDEX1", 1);
_defineProperty(Render, "DRAW_LAYER_INDEX2_Z_POINT_SORT", 2);
_defineProperty(Render, "clearStateCache", _ => {
  prevVertexBuffer_UUID = null;
  prevIndexBuffer_UUID = null;
  prevMaterial_UUID = null;
});

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 18:59:49
 *
 */
class ColorMaterial extends Mix.mix(BaseMaterial, Mix.color, Mix.alpha) {
  constructor(redGPUContext, color = '#ff0000', colorAlpha = 1) {
    super(redGPUContext);
    this.color = color;
    this.colorAlpha = colorAlpha;
    this.needResetBindingInfo = true;
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(ColorMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 0 ) out float vMouseColorID;	
	layout( location = 1 ) out float vSumOpacity;
	void main() {
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
	
	}
	`);
_defineProperty(ColorMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        vec4 color;
        float alpha;
    } fragmentUniforms;
	layout( location = 0 ) in float vMouseColorID;
	layout( location = 1 ) in float vSumOpacity;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;

	void main() {
		outColor = fragmentUniforms.color;
		outColor.a *= vSumOpacity;
		outColor.a *= fragmentUniforms.alpha;	
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
	`);
_defineProperty(ColorMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(ColorMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }]
});
_defineProperty(ColorMaterial, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(ColorMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32x4,
  valueName: 'colorRGBA'
}, {
  size: TypeSize.float32,
  valueName: 'alpha'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.18 17:23:53
 *
 */
var _color = /*#__PURE__*/new WeakMap();
class BaseLight extends UUID {
  constructor(redGPUContext) {
    super();
    _classPrivateFieldInitSpec(this, _color, {
      writable: true,
      value: '#ff0000'
    });
    _defineProperty(this, "_debugMesh", void 0);
    _defineProperty(this, "_debugMaterial", void 0);
    _defineProperty(this, "useDebugMesh", false);
    _defineProperty(this, "_intensity", 1);
    _defineProperty(this, "_x", 0);
    _defineProperty(this, "_y", 0);
    _defineProperty(this, "_z", 0);
    _defineProperty(this, "_colorRGBA", new Float32Array([1, 0, 0, 1]));
    this._debugMesh = new Mesh(redGPUContext);
    this._debugMaterial = new ColorMaterial(redGPUContext);
    this._debugMaterial.colorAlpha = 0.5;
  }
  get intensity() {
    return this._intensity;
  }
  set intensity(value) {
    this._intensity = value;
  }
  get x() {
    return this._x;
  }
  set x(v) {
    this._x = this._debugMesh.x = v;
    this._debugMesh.targetTo(0, 0, 0);
  }
  get y() {
    return this._y;
  }
  set y(v) {
    this._y = this._debugMesh.y = v;
    this._debugMesh.targetTo(0, 0, 0);
  }
  get z() {
    return this._z;
  }
  set z(v) {
    this._z = this._debugMesh.z = v;
    this._debugMesh.targetTo(0, 0, 0);
  }
  get colorRGBA() {
    return this._colorRGBA;
  }
  get color() {
    return _classPrivateFieldGet(this, _color);
  }
  set color(hex) {
    _classPrivateFieldSet(this, _color, hex);
    let rgb = UTIL.hexToRGB_ZeroToOne(hex);
    this._colorRGBA[0] = rgb[0];
    this._colorRGBA[1] = rgb[1];
    this._colorRGBA[2] = rgb[2];
    this._colorRGBA[3] = 1;
    this._debugMaterial.color = hex;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
var _centerX = /*#__PURE__*/new WeakMap();
var _centerY = /*#__PURE__*/new WeakMap();
var _centerZ = /*#__PURE__*/new WeakMap();
var _distance = /*#__PURE__*/new WeakMap();
var _speedDistance = /*#__PURE__*/new WeakMap();
var _delayDistance = /*#__PURE__*/new WeakMap();
var _speedRotation = /*#__PURE__*/new WeakMap();
var _delayRotation = /*#__PURE__*/new WeakMap();
var _tilt = /*#__PURE__*/new WeakMap();
var _minTilt = /*#__PURE__*/new WeakMap();
var _maxTilt = /*#__PURE__*/new WeakMap();
var _pan = /*#__PURE__*/new WeakMap();
var _currentPan = /*#__PURE__*/new WeakMap();
var _currentTilt = /*#__PURE__*/new WeakMap();
var _needUpdate = /*#__PURE__*/new WeakMap();
class ObitController extends Camera3D {
  //

  //

  //

  //

  //

  constructor(redGPUContext) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _centerX, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(this, _centerY, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(this, _centerZ, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(this, _distance, {
      writable: true,
      value: 10
    });
    _classPrivateFieldInitSpec(this, _speedDistance, {
      writable: true,
      value: 1
    });
    _classPrivateFieldInitSpec(this, _delayDistance, {
      writable: true,
      value: 0.1
    });
    _classPrivateFieldInitSpec(this, _speedRotation, {
      writable: true,
      value: 3
    });
    _classPrivateFieldInitSpec(this, _delayRotation, {
      writable: true,
      value: 0.1
    });
    _classPrivateFieldInitSpec(this, _tilt, {
      writable: true,
      value: -45
    });
    _classPrivateFieldInitSpec(this, _minTilt, {
      writable: true,
      value: -90
    });
    _classPrivateFieldInitSpec(this, _maxTilt, {
      writable: true,
      value: 90
    });
    _classPrivateFieldInitSpec(this, _pan, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(this, _currentPan, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(this, _currentTilt, {
      writable: true,
      value: 0
    });
    _defineProperty(this, "currentDistance", 0);
    _classPrivateFieldInitSpec(this, _needUpdate, {
      writable: true,
      value: true
    });
    _defineProperty(this, "targetView", void 0);
    (_ => {
      let HD_down, HD_Move, HD_up, HD_wheel;
      let sX, sY;
      let mX, mY;
      let tX_key, tY_key;
      let tMove, tUp, tDown;
      let checkArea;
      checkArea = e => {
        let targetView = this.targetView;
        if (targetView) {
          let tX, tY;
          let tViewRect = targetView['viewRect'];
          tX = e[tX_key];
          tY = e[tY_key];
          // console.log(tViewRect);
          // console.log(tX,tY);
          if (!(tViewRect[0] < tX && tX < tViewRect[0] + tViewRect[2])) return;
          if (!(tViewRect[1] < tY && tY < tViewRect[1] + tViewRect[3])) return;
        }
        return true;
      };
      tMove = redGPUContext.detector.move;
      tUp = redGPUContext.detector.up;
      tDown = redGPUContext.detector.down;
      sX = 0;
      sY = 0;
      mX = 0;
      mY = 0;
      tX_key = 'layerX';
      tY_key = 'layerY';
      HD_down = e => {
        if (!checkArea(e)) return;
        if (_classPrivateFieldGet(this, _needUpdate)) {
          sX = e[tX_key];
          sY = e[tY_key];
          redGPUContext['canvas'].addEventListener(tMove, HD_Move);
          window.addEventListener(tUp, HD_up);
        }
      };
      HD_Move = e => {
        if (!checkArea(e)) return;
        if (_classPrivateFieldGet(this, _needUpdate)) {
          mX = e[tX_key] - sX;
          mY = e[tY_key] - sY;
          sX = e[tX_key];
          sY = e[tY_key];
          _classPrivateFieldSet(this, _pan, _classPrivateFieldGet(this, _pan) - mX * _classPrivateFieldGet(this, _speedRotation) * 0.1);
          _classPrivateFieldSet(this, _tilt, _classPrivateFieldGet(this, _tilt) - mY * _classPrivateFieldGet(this, _speedRotation) * 0.1);
        }
      };
      HD_up = e => {
        redGPUContext['canvas'].removeEventListener(tMove, HD_Move);
        window.removeEventListener(tUp, HD_up);
      };
      HD_wheel = e => {
        if (_classPrivateFieldGet(this, _needUpdate)) {
          if (!checkArea(e)) return;
          _classPrivateFieldSet(this, _distance, _classPrivateFieldGet(this, _distance) + e['deltaY'] / 100 * _classPrivateFieldGet(this, _speedDistance));
        }
      };
      redGPUContext['canvas'].addEventListener(tDown, HD_down);
      redGPUContext['canvas'].addEventListener('wheel', HD_wheel);
    })();
  }
  get needUpdate() {
    return _classPrivateFieldGet(this, _needUpdate);
  }
  set needUpdate(value) {
    _classPrivateFieldSet(this, _needUpdate, value);
  }
  get centerX() {
    return _classPrivateFieldGet(this, _centerX);
  }
  set centerX(value) {
    _classPrivateFieldSet(this, _centerX, value);
  }
  get centerY() {
    return _classPrivateFieldGet(this, _centerY);
  }
  set centerY(value) {
    _classPrivateFieldSet(this, _centerY, value);
  }
  get centerZ() {
    return _classPrivateFieldGet(this, _centerZ);
  }
  set centerZ(value) {
    _classPrivateFieldSet(this, _centerZ, value);
  }
  get distance() {
    return _classPrivateFieldGet(this, _distance);
  }
  set distance(value) {
    _classPrivateFieldSet(this, _distance, value);
  }
  get speedDistance() {
    return _classPrivateFieldGet(this, _speedDistance);
  }
  set speedDistance(value) {
    _classPrivateFieldSet(this, _speedDistance, value);
  }
  get delayDistance() {
    return _classPrivateFieldGet(this, _delayDistance);
  }
  set delayDistance(value) {
    _classPrivateFieldSet(this, _delayDistance, value);
  }
  get speedRotation() {
    return _classPrivateFieldGet(this, _speedRotation);
  }
  set speedRotation(value) {
    _classPrivateFieldSet(this, _speedRotation, value);
  }
  get delayRotation() {
    return _classPrivateFieldGet(this, _delayRotation);
  }
  set delayRotation(value) {
    _classPrivateFieldSet(this, _delayRotation, value);
  }
  get minTilt() {
    return _classPrivateFieldGet(this, _minTilt);
  }
  set minTilt(value) {
    _classPrivateFieldSet(this, _minTilt, value);
  }
  get maxTilt() {
    return _classPrivateFieldGet(this, _maxTilt);
  }
  set maxTilt(value) {
    _classPrivateFieldSet(this, _maxTilt, value);
  }
  get pan() {
    return _classPrivateFieldGet(this, _pan);
  }
  set pan(value) {
    _classPrivateFieldSet(this, _pan, value);
  }
  get tilt() {
    return _classPrivateFieldGet(this, _tilt);
  }
  set tilt(value) {
    _classPrivateFieldSet(this, _tilt, value);
  }
  update(redView) {
    let tDelayRotation;
    let tMTX0;
    let PER_PI;
    PER_PI = Math.PI / 180;
    if (!_classPrivateFieldGet(this, _needUpdate)) return;
    if (_classPrivateFieldGet(this, _tilt) < _classPrivateFieldGet(this, _minTilt)) _classPrivateFieldSet(this, _tilt, _classPrivateFieldGet(this, _minTilt));
    if (_classPrivateFieldGet(this, _tilt) > _classPrivateFieldGet(this, _maxTilt)) _classPrivateFieldSet(this, _tilt, _classPrivateFieldGet(this, _maxTilt));
    tDelayRotation = _classPrivateFieldGet(this, _delayRotation);
    tMTX0 = this.matrix;
    _classPrivateFieldSet(this, _currentPan, _classPrivateFieldGet(this, _currentPan) + (_classPrivateFieldGet(this, _pan) - _classPrivateFieldGet(this, _currentPan)) * tDelayRotation);
    _classPrivateFieldSet(this, _currentTilt, _classPrivateFieldGet(this, _currentTilt) + (_classPrivateFieldGet(this, _tilt) - _classPrivateFieldGet(this, _currentTilt)) * tDelayRotation);
    if (_classPrivateFieldGet(this, _distance) < this.nearClipping) _classPrivateFieldSet(this, _distance, this.nearClipping);
    this.currentDistance += (_classPrivateFieldGet(this, _distance) - this.currentDistance) * _classPrivateFieldGet(this, _delayDistance);
    if (this.currentDistance < this.nearClipping) this.currentDistance = this.nearClipping;
    t.mat4.identity(tMTX0);
    t.mat4.translate(tMTX0, tMTX0, [_classPrivateFieldGet(this, _centerX), _classPrivateFieldGet(this, _centerY), _classPrivateFieldGet(this, _centerZ)]);
    t.mat4.rotateY(tMTX0, tMTX0, _classPrivateFieldGet(this, _currentPan) * PER_PI);
    t.mat4.rotateX(tMTX0, tMTX0, _classPrivateFieldGet(this, _currentTilt) * PER_PI);
    t.mat4.translate(tMTX0, tMTX0, [0, 0, this.currentDistance]);
    this.x = tMTX0[12];
    this.y = tMTX0[13];
    this.z = tMTX0[14];
    this.lookAt(_classPrivateFieldGet(this, _centerX), _classPrivateFieldGet(this, _centerY), _classPrivateFieldGet(this, _centerZ));
    // console.log('tilt', this.#tilt, 'pan', this.#pan)
    // console.log('ObitController update')
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.18 16:39:19
 *
 */
class AmbientLight extends BaseLight {
  constructor(redGPUContext, color = '#111', intensity = 0.1) {
    super(redGPUContext);
    this.color = color;
    this.intensity = intensity;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */
var _makeData$1 = /*#__PURE__*/new WeakMap();
class Sphere extends baseGeometry {
  constructor(_redGPUContext, _radius = 1, _widthSegments = 8, _heightSegments = 8, _phiStart = 0, _phiLength = Math.PI * 2, _thetaStart = 0, _thetaLength = Math.PI, _uvSize = 1) {
    super();
    _classPrivateFieldInitSpec(this, _makeData$1, {
      writable: true,
      value: function () {
        let thetaEnd;
        let ix, iy;
        let index;
        let grid = [];
        let a, b, c, d;
        let vertex = new Float32Array([0, 0, 0]);
        let normal = new Float32Array([0, 0, 0]);
        return function (redGPUContext, typeKey, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, uvSize) {
          thetaEnd = thetaStart + thetaLength;
          index = 0;
          grid.length = 0;
          vertex[0] = 0, vertex[1] = 0, vertex[2] = 0;
          normal[0] = 0, normal[1] = 0, normal[2] = 0;
          ////////////////////////////////////////////////////////////////////////////
          // 데이터 생성!
          // buffers Data
          let interleaveData = [];
          let indexData = [];
          // generate vertices, normals and uvs
          for (iy = 0; iy <= heightSegments; iy++) {
            let verticesRow = [];
            let v = iy / heightSegments;
            for (ix = 0; ix <= widthSegments; ix++) {
              let u = ix / widthSegments;
              // vertex
              vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
              vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
              vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
              interleaveData.push(vertex.x, vertex.y, vertex.z);
              // normal
              normal[0] = vertex.x;
              normal[1] = vertex.y;
              normal[2] = vertex.z;
              t.vec3.normalize(normal, normal);
              interleaveData.push(normal[0], normal[1], normal[2]);
              // uv
              interleaveData.push(u * uvSize, v * uvSize);
              verticesRow.push(index++);
            }
            grid.push(verticesRow);
          }
          // indices
          for (iy = 0; iy < heightSegments; iy++) {
            for (ix = 0; ix < widthSegments; ix++) {
              a = grid[iy][ix + 1];
              b = grid[iy][ix];
              c = grid[iy + 1][ix];
              d = grid[iy + 1][ix + 1];
              if (iy !== 0 || thetaStart > 0) indexData.push(a, b, d);
              if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indexData.push(b, c, d);
            }
          }
          return new Geometry(redGPUContext, new Buffer(redGPUContext, `${typeKey}_interleaveBuffer`, Buffer.TYPE_VERTEX, new Float32Array(interleaveData), [new InterleaveInfo('vertexPosition', "float32x3"), new InterleaveInfo('vertexNormal', "float32x3"), new InterleaveInfo('texcoord', 'float32x2')]), new Buffer(redGPUContext, `${typeKey}_indexBuffer`, Buffer.TYPE_INDEX, new Uint32Array(indexData)));
        };
      }()
    });
    let _typeKey;
    _widthSegments = Math.max(3, Math.floor(_widthSegments));
    _heightSegments = Math.max(2, Math.floor(_heightSegments));
    // 유일키 생성
    _typeKey = [this.constructor.name, _radius, _widthSegments, _heightSegments, _phiStart, _phiLength, _thetaStart, _thetaLength, _uvSize].join('_');
    if (_redGPUContext.state.Geometry.has(_typeKey)) return _redGPUContext.state.Geometry.get(_typeKey);
    let tData = _classPrivateFieldGet(this, _makeData$1).call(this, _redGPUContext, _typeKey, _radius, _widthSegments, _heightSegments, _phiStart, _phiLength, _thetaStart, _thetaLength, _uvSize);
    this.interleaveBuffer = tData['interleaveBuffer'];
    this.indexBuffer = tData['indexBuffer'];
    this.vertexState = tData['vertexState'];
    _redGPUContext.state.Geometry.set(_typeKey, this);
    if (RedGPUContext.useDebugConsole) console.log(this);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */
var _makeData$2 = /*#__PURE__*/new WeakMap();
class Cylinder extends baseGeometry {
  constructor(_redGPUContext, _radiusTop = 1, _radiusBottom = 1, _height = 1, _radialSegments = 8, _heightSegments = 1, _openEnded = false, _thetaStart = 0.0, _thetaLength = Math.PI * 2, _uvSize = 1) {
    super();
    _classPrivateFieldInitSpec(this, _makeData$2, {
      writable: true,
      value: function () {
        let generateTorso;
        let generateCap;
        //TODO 정리
        return function (redGPUContext, typeKey, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength, uvSize) {
          ////////////////////////////////////////////////////////////////////////////
          // 데이터 생성!
          // buffers Data
          let interleaveData = [];
          let indexData = [];
          //
          let index = 0;
          let indexArray = [];
          let halfHeight = height / 2;
          generateTorso = function () {
            let x, y;
            let normal = [];
            let vertex = [];
            // this will be used to calculate the normal
            let slope = (radiusBottom - radiusTop) / height;
            // generate vertices, normals and uvs
            for (y = 0; y <= heightSegments; y++) {
              let indexRow = [];
              let v = y / heightSegments;
              // calculate the radius of the current row
              let radius = v * (radiusBottom - radiusTop) + radiusTop;
              for (x = 0; x <= radialSegments; x++) {
                let u = x / radialSegments;
                let theta = u * thetaLength + thetaStart;
                let sinTheta = Math.sin(theta);
                let cosTheta = Math.cos(theta);
                // vertex
                vertex[0] = radius * sinTheta;
                vertex[1] = -v * height + halfHeight;
                vertex[2] = radius * cosTheta;
                interleaveData.push(vertex[0], vertex[1], vertex[2]);
                // normal
                normal[0] = sinTheta;
                normal[1] = slope;
                normal[2] = cosTheta;
                t.vec3.normalize(normal, normal);
                interleaveData.push(normal[0], normal[1], normal[2]);
                // uv
                interleaveData.push(u * uvSize, v * uvSize);
                // save index of vertex in respective row
                indexRow.push(index++);
              }
              // now save vertices of the row in our index array
              indexArray.push(indexRow);
            }
            // generate indices
            for (x = 0; x < radialSegments; x++) {
              for (y = 0; y < heightSegments; y++) {
                // we use the index array to access the correct indices
                let a = indexArray[y][x];
                let b = indexArray[y + 1][x];
                let c = indexArray[y + 1][x + 1];
                let d = indexArray[y][x + 1];
                // faces
                indexData.push(a, b, d);
                indexData.push(b, c, d);
              }
            }
          };
          generateCap = function (top) {
            let x, centerIndexStart, centerIndexEnd;
            let uv = [];
            let vertex = [];
            let radius = top === true ? radiusTop : radiusBottom;
            let sign = top === true ? 1 : -1;
            // save the index of the first center vertex
            centerIndexStart = index;
            // first we generate the center vertex data of the cap.
            // because the geometry needs one set of uvs per face,
            // we must generate a center vertex per face/segment
            for (x = 1; x <= radialSegments; x++) {
              // vertex
              interleaveData.push(0, halfHeight * sign, 0);
              // normal
              interleaveData.push(0, sign, 0);
              // uv
              interleaveData.push(uvSize * 0.5, uvSize * 0.5);
              // increase index
              index++;
            }
            // save the index of the last center vertex
            centerIndexEnd = index;
            // now we generate the surrounding vertices, normals and uvs
            for (x = 0; x <= radialSegments; x++) {
              let u = x / radialSegments;
              let theta = u * thetaLength + thetaStart;
              let cosTheta = Math.cos(theta);
              let sinTheta = Math.sin(theta);
              // vertex
              vertex[0] = radius * sinTheta;
              vertex[1] = halfHeight * sign;
              vertex[2] = radius * cosTheta;
              interleaveData.push(vertex[0], vertex[1], vertex[2]);
              // normal
              interleaveData.push(0, sign, 0);
              // uv
              uv[0] = cosTheta * 0.5 + 0.5;
              uv[1] = sinTheta * 0.5 * sign + 0.5;
              interleaveData.push(uv[0] * uvSize, uvSize - uv[1] * uvSize);
              // increase index
              index++;
            }
            // generate indices
            for (x = 0; x < radialSegments; x++) {
              let c = centerIndexStart + x;
              let i = centerIndexEnd + x;
              if (top === true) {
                // face top
                indexData.push(i, i + 1, c);
              } else {
                // face bottom
                indexData.push(i + 1, i, c);
              }
            }
          };
          generateTorso();
          if (openEnded === false) {
            if (radiusTop > 0) generateCap(true);
            if (radiusBottom > 0) generateCap(false);
          }
          return new Geometry(redGPUContext, new Buffer(redGPUContext, `${typeKey}_interleaveBuffer`, Buffer.TYPE_VERTEX, new Float32Array(interleaveData), [new InterleaveInfo('vertexPosition', "float32x3"), new InterleaveInfo('vertexNormal', "float32x3"), new InterleaveInfo('texcoord', 'float32x2')]), new Buffer(redGPUContext, `${typeKey}_indexBuffer`, Buffer.TYPE_INDEX, new Uint32Array(indexData)));
        };
      }()
    });
    let _typeKey;
    // 유일키 생성

    _typeKey = [this.constructor.name, _redGPUContext, _radiusTop, _radiusBottom, _height, _radialSegments, _heightSegments, _openEnded, _thetaStart, _thetaLength, _uvSize].join('_');
    if (_redGPUContext.state.Geometry.has(_typeKey)) return _redGPUContext.state.Geometry.get(_typeKey);
    let tData = _classPrivateFieldGet(this, _makeData$2).call(this, _redGPUContext, _typeKey, _radiusTop, _radiusBottom, _height, _radialSegments, _heightSegments, _openEnded, _thetaStart, _thetaLength, _uvSize);
    this.interleaveBuffer = tData['interleaveBuffer'];
    this.indexBuffer = tData['indexBuffer'];
    this.vertexState = tData['vertexState'];
    _redGPUContext.state.Geometry.set(_typeKey, this);
    if (RedGPUContext.useDebugConsole) console.log(this);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.18 16:39:19
 *
 */
var _setDebugMesh = /*#__PURE__*/new WeakMap();
class DirectionalLight extends BaseLight {
  constructor(_redGPUContext, color = '#ffffff', intensity = 1) {
    super(_redGPUContext);
    _classPrivateFieldInitSpec(this, _setDebugMesh, {
      writable: true,
      value: redGPUContext => {
        let positionMesh = new Mesh(redGPUContext, new Sphere(redGPUContext, 1, 16, 16, 16), this._debugMaterial);
        // positionMesh.primitiveTopology = 'line-strip';
        positionMesh.primitiveTopology = 'line-list';
        this._debugMesh.addChild(positionMesh);
        [-0.7, 0, 0.7].forEach((v, index) => {
          let directionMesh, directionMesh2;
          directionMesh = new Mesh(redGPUContext, new Cylinder(redGPUContext, 0.01, 0.01, index == 1 ? 100000 : 2), this._debugMaterial);
          directionMesh.rotationX = 90;
          directionMesh.x = v;
          directionMesh.z = -1;
          directionMesh2 = new Mesh(redGPUContext, new Cylinder(redGPUContext, 0, 0.25, 0.5), this._debugMaterial);
          directionMesh2.y = 1;
          directionMesh.addChild(directionMesh2);
          this._debugMesh.addChild(directionMesh);
        });
      }
    });
    _classPrivateFieldGet(this, _setDebugMesh).call(this, _redGPUContext);
    this.color = color;
    this.intensity = intensity;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.18 17:23:53
 *
 */
var _setDebugMesh$1 = /*#__PURE__*/new WeakMap();
class PointLight extends BaseLight {
  constructor(_redGPUContext, color = '#ffffff', intensity = 1, radius = 1) {
    super(_redGPUContext);
    _defineProperty(this, "_radius", 1);
    _classPrivateFieldInitSpec(this, _setDebugMesh$1, {
      writable: true,
      value: redGPUContext => {
        let positionMesh = new Mesh(redGPUContext, new Sphere(redGPUContext, 1, 32, 32, 32), this._debugMaterial);
        // positionMesh.primitiveTopology = 'line-strip';
        positionMesh.primitiveTopology = 'line-list';
        this._debugMesh.addChild(positionMesh);
      }
    });
    this.color = color;
    this.intensity = intensity;
    this.radius = radius;
    _classPrivateFieldGet(this, _setDebugMesh$1).call(this, _redGPUContext);
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    this._radius = value;
    this._debugMesh.setScale(value, value, value);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.18 16:39:19
 *
 */
var _setDebugMesh$2 = /*#__PURE__*/new WeakMap();
class SpotLight extends BaseLight {
  constructor(_redGPUContext, color = '#ffffff', intensity = 1, cutoff = 0.1, exponent = 80.0) {
    super(_redGPUContext);
    _classPrivateFieldInitSpec(this, _setDebugMesh$2, {
      writable: true,
      value: redGPUContext => {
        let positionMesh = new Mesh(redGPUContext, new Cylinder(redGPUContext, 0.0, 1, 2), this._debugMaterial);
        positionMesh.rotationX = -90;
        // positionMesh.primitiveTopology = 'line-strip';
        positionMesh.primitiveTopology = 'line-list';
        this._debugMesh.addChild(positionMesh);
      }
    });
    this.color = color;
    this.intensity = intensity;
    this.cutoff = cutoff;
    this.exponent = exponent;
    _classPrivateFieldGet(this, _setDebugMesh$2).call(this, _redGPUContext);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 13:54:48
 *
 */
class GridMaterial extends BaseMaterial {
  constructor(redGPUContext) {
    super(redGPUContext);
    this.needResetBindingInfo = true;
  }
  resetBindingInfo() {
    this.entries = [];
    this._afterResetBindingInfo();
  }
}
_defineProperty(GridMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec4 color;
	layout( location = 0 ) out vec4 vColor;

	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		vColor = color;
	}
	`);
_defineProperty(GridMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( location = 0 ) in vec4 vColor;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		outColor = vColor;
			out_MouseColorID_Depth = vec4(0.0);
		
	}
	`);
_defineProperty(GridMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(GridMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: []
});
_defineProperty(GridMaterial, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(GridMaterial, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 13:54:48
 *
 */
class SkyBoxMaterial extends Mix.mix(BaseMaterial) {
  constructor(redGPUContext, skyBoxTexture) {
    super(redGPUContext);
    _defineProperty(this, "_skyBoxTexture", void 0);
    this.skyBoxTexture = skyBoxTexture;
    this.needResetBindingInfo = true;
  }
  get skyBoxTexture() {
    return this._skyBoxTexture;
  }
  set skyBoxTexture(texture) {
    /* this._skyBoxTexture = null;*/
    this.checkTexture(texture, 'skyBoxTexture');
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        switch (textureName) {
          case 'skyBoxTexture':
            this._skyBoxTexture = texture;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: this._skyBoxTexture ? this._skyBoxTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 1,
      resource: this._skyBoxTexture ? this._skyBoxTexture._GPUTextureView : this.redGPUContext.state.emptyCubeTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(SkyBoxMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 0 ) out vec3 vReflectionCubeCoord;
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		vReflectionCubeCoord = (meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] *vec4(position, 0.0)).xyz;
	}
	`);
_defineProperty(SkyBoxMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	layout( location = 0 ) in vec3 vReflectionCubeCoord;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1) uniform textureCube uSkyBoxTexture;
	layout( location = 0 ) out vec4 outColor;
  layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#skyBoxTexture# diffuseColor = texture(samplerCube(uSkyBoxTexture,uSampler), vReflectionCubeCoord) ;
		outColor = diffuseColor;
    out_MouseColorID_Depth = vec4(0.0);
	}
`);
_defineProperty(SkyBoxMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: ['skyBoxTexture']
});
_defineProperty(SkyBoxMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      viewDimension: 'cube'
    }
  }]
});
_defineProperty(SkyBoxMaterial, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(SkyBoxMaterial, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.24 19:45:8
 *
 */
class ColorPhongMaterial extends Mix.mix(BaseMaterial, Mix.color, Mix.alpha, Mix.basicLightPropertys) {
  // static PROGRAM_OPTION_LIST = {vertex: [], fragment: ['useFlatMode']};

  constructor(redGPUContext, color = '#ff0000', colorAlpha = 1) {
    super(redGPUContext);
    this.color = color;
    this.colorAlpha = colorAlpha;
    this.needResetBindingInfo = true;
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(ColorPhongMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec4 vVertexPosition;
	layout( location = 2 ) out float vMouseColorID;
	layout( location = 3 ) out float vSumOpacity;
	void main() {
		vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] * vec4(normal,1.0)).xyz;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;
	}
	`);
_defineProperty(ColorPhongMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        vec4 color;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
        float alpha;
        float useFlatMode;
        //
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec4 vVertexPosition;
	layout( location = 2 ) in float vMouseColorID;	
	layout( location = 3 ) in float vSumOpacity;
	layout( location = 0 ) out vec4 outColor;	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		float testAlpha = fragmentUniforms.color.a * vSumOpacity;

		vec3 N = normalize(vNormal);
		if(fragmentUniforms.useFlatMode == TRUTHY) N = getFlatNormal(vVertexPosition.xyz);
		
		float specularTextureValue = 1.0;
		
		vec4 finalColor = 
		calcDirectionalLight(
			fragmentUniforms.color,
			N,		
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue
		)
		+
	    calcPointLight(
			fragmentUniforms.color,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue,
			vVertexPosition.xyz
		)
		+ la;
			
		finalColor.a = testAlpha;
		outColor = finalColor;
		outColor.a *= fragmentUniforms.alpha;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(ColorPhongMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(ColorPhongMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }]
});
_defineProperty(ColorPhongMaterial, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(ColorPhongMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32x4,
  valueName: 'colorRGBA'
}, {
  size: TypeSize.float32,
  valueName: 'shininess'
}, {
  size: TypeSize.float32,
  valueName: 'specularPower'
}, {
  size: TypeSize.float32x4,
  valueName: 'specularColorRGBA'
}, {
  size: TypeSize.float32,
  valueName: 'alpha'
}, {
  size: TypeSize.float32,
  valueName: 'useFlatMode'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
let float1_Float32Array$6 = new Float32Array(1);
var _raf$1 = /*#__PURE__*/new WeakMap();
class ColorPhongTextureMaterial extends Mix.mix(BaseMaterial, Mix.color, Mix.alpha, Mix.normalTexture, Mix.specularTexture, Mix.emissiveTexture, Mix.displacementTexture, Mix.basicLightPropertys) {
  constructor(redGPUContext, color = '#ff0000', colorAlpha = 1, normalTexture, specularTexture, emissiveTexture, displacementTexture) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _raf$1, {
      writable: true,
      value: void 0
    });
    this.color = color;
    this.colorAlpha = colorAlpha;
    this.normalTexture = normalTexture;
    this.specularTexture = specularTexture;
    this.emissiveTexture = emissiveTexture;
    this.displacementTexture = displacementTexture;
    this.needResetBindingInfo = true;
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        let tKey;
        switch (textureName) {
          case 'normalTexture':
            this._normalTexture = texture;
            tKey = textureName;
            break;
          case 'specularTexture':
            this._specularTexture = texture;
            tKey = textureName;
            break;
          case 'emissiveTexture':
            this._emissiveTexture = texture;
            tKey = textureName;
            break;
          case 'displacementTexture':
            this._displacementTexture = texture;
            tKey = textureName;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        if (tKey) {
          float1_Float32Array$6[0] = this[`__${textureName}RenderYn`] = 1;
          if (tKey == 'displacementTexture') {
            // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$6);
          } else {
            // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$6);
          }
        }
        // cancelAnimationFrame(this.#raf);
        // this.#raf = requestAnimationFrame(_ => {this.needResetBindingInfo = true})
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        float1_Float32Array$6[0] = this[`__${textureName}RenderYn`] = 0;
        if (textureName == 'displacementTexture') {
          // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$6);
        } else {
          // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$6);
        }
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }, {
      binding: 1,
      resource: this._displacementTexture ? this._displacementTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 2,
      resource: this._displacementTexture ? this._displacementTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 3,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 4,
      resource: this._normalTexture ? this._normalTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 5,
      resource: this._normalTexture ? this._normalTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 6,
      resource: this._specularTexture ? this._specularTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 7,
      resource: this._specularTexture ? this._specularTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 8,
      resource: this._emissiveTexture ? this._emissiveTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 9,
      resource: this._emissiveTexture ? this._emissiveTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(ColorPhongTextureMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out vec4 vVertexPosition;
	layout( location = 3 ) out float vMouseColorID;	
	layout( location = 4 ) out float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
        float __displacementTextureRenderYn;
    } vertexUniforms;
    
    layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2) uniform texture2D uDisplacementTexture;
	void main() {
		vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] * vec4(normal,1.0)).xyz;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		if(vertexUniforms.__displacementTextureRenderYn == TRUTHY) vVertexPosition.xyz += ${ShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement('vNormal', 'vertexUniforms.displacementFlowSpeedX', 'vertexUniforms.displacementFlowSpeedY', 'vertexUniforms.displacementPower', 'uv', 'uDisplacementTexture', 'uSampler')}
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;
	}
	`);
_defineProperty(ColorPhongTextureMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${ShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
        vec4 color;
        float normalPower;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
	    float emissivePower;
	    float alpha;
	    float useFlatMode;
	    //
		float __normalTextureRenderYn;
		float __specularTextureRenderYn;
		float __emissiveTextureRenderYn;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in vec4 vVertexPosition;
	layout( location = 3 ) in float vMouseColorID;	
	layout( location = 4 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uNormalSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uNormalTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform sampler uSpecularSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uSpecularTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform sampler uEmissiveSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uEmissiveTexture;
	layout( location = 0 ) out vec4 outColor;
	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	
	void main() {
		float testAlpha = fragmentUniforms.color.a * vSumOpacity;
		
		vec3 N = normalize(vNormal);
		vec4 normalColor = vec4(0.0);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), vUV) ;
		if(fragmentUniforms.useFlatMode == TRUTHY) N = getFlatNormal(vVertexPosition.xyz);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) N = perturb_normal(N, vVertexPosition.xyz, vUV, normalColor.rgb, fragmentUniforms.normalPower) ;
		
		float specularTextureValue = 1.0;
		if(fragmentUniforms.__specularTextureRenderYn == TRUTHY) specularTextureValue = texture(sampler2D(uSpecularTexture, uSpecularSampler), vUV).r ;
		
		vec4 finalColor = 
		calcDirectionalLight(
			fragmentUniforms.color,
			N,		
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue
		)
	    +
	    calcPointLight(
			fragmentUniforms.color,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue,
			vVertexPosition.xyz
		)
		+ la;

		if(fragmentUniforms.__emissiveTextureRenderYn == TRUTHY) {
			vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uEmissiveSampler), vUV);
			finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		}
		
		finalColor.a = testAlpha;
		outColor = finalColor;
		outColor.a *= fragmentUniforms.alpha;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(ColorPhongTextureMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
  // vertex: ['displacementTexture'],
  // fragment: ['emissiveTexture', 'normalTexture', 'specularTexture', 'useFlatMode']
});
_defineProperty(ColorPhongTextureMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.VERTEX,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.VERTEX,
    texture: {
      type: "float"
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 4,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 5,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 6,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 7,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 8,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 9,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(ColorPhongTextureMaterial, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedX'
}, {
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedY'
}, {
  size: TypeSize.float32,
  valueName: 'displacementPower'
}, {
  size: TypeSize.float32,
  valueName: '__displacementTextureRenderYn'
}]);
_defineProperty(ColorPhongTextureMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32x4,
  valueName: 'colorRGBA'
}, {
  size: TypeSize.float32,
  valueName: 'normalPower'
}, {
  size: TypeSize.float32,
  valueName: 'shininess'
}, {
  size: TypeSize.float32,
  valueName: 'specularPower'
}, {
  size: TypeSize.float32x4,
  valueName: 'specularColorRGBA'
}, {
  size: TypeSize.float32,
  valueName: 'emissivePower'
}, {
  size: TypeSize.float32,
  valueName: 'alpha'
}, {
  size: TypeSize.float32,
  valueName: 'useFlatMode'
},
//
{
  size: TypeSize.float32,
  valueName: '__normalTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__specularTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__emissiveTextureRenderYn'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
let float1_Float32Array$7 = new Float32Array(1);
var _raf$2 = /*#__PURE__*/new WeakMap();
class EnvironmentMaterial extends Mix.mix(BaseMaterial, Mix.diffuseTexture, Mix.normalTexture, Mix.specularTexture, Mix.emissiveTexture, Mix.environmentTexture, Mix.displacementTexture, Mix.basicLightPropertys, Mix.alpha) {
  constructor(redGPUContext, diffuseTexture, environmentTexture, normalTexture, specularTexture, emissiveTexture, displacementTexture) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _raf$2, {
      writable: true,
      value: void 0
    });
    this.diffuseTexture = diffuseTexture;
    this.environmentTexture = environmentTexture;
    this.normalTexture = normalTexture;
    this.emissiveTexture = emissiveTexture;
    this.specularTexture = specularTexture;
    this.displacementTexture = displacementTexture;
    this.needResetBindingInfo = true;
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        let tKey;
        switch (textureName) {
          case 'diffuseTexture':
            this._diffuseTexture = texture;
            tKey = textureName;
            break;
          case 'normalTexture':
            this._normalTexture = texture;
            tKey = textureName;
            break;
          case 'specularTexture':
            this._specularTexture = texture;
            tKey = textureName;
            break;
          case 'emissiveTexture':
            this._emissiveTexture = texture;
            tKey = textureName;
            break;
          case 'environmentTexture':
            this._environmentTexture = texture;
            tKey = textureName;
            break;
          case 'displacementTexture':
            this._displacementTexture = texture;
            tKey = textureName;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        if (tKey) {
          float1_Float32Array$7[0] = this[`__${textureName}RenderYn`] = 1;
          if (tKey == 'displacementTexture') {
            // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$7);
          } else {
            // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$7);
          }
        }
        // cancelAnimationFrame(this.#raf);
        // this.#raf = requestAnimationFrame(_ => {this.needResetBindingInfo = true})
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        float1_Float32Array$7[0] = this[`__${textureName}RenderYn`] = 0;
        if (textureName == 'displacementTexture') {
          // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$7);
        } else {
          // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$7);
        }
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }, {
      binding: 1,
      resource: this._displacementTexture ? this._displacementTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 2,
      resource: this._displacementTexture ? this._displacementTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 3,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 4,
      resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 5,
      resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 6,
      resource: this._normalTexture ? this._normalTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 7,
      resource: this._normalTexture ? this._normalTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 8,
      resource: this._specularTexture ? this._specularTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 9,
      resource: this._specularTexture ? this._specularTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 10,
      resource: this._emissiveTexture ? this._emissiveTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 11,
      resource: this._emissiveTexture ? this._emissiveTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 12,
      resource: this._environmentTexture ? this._environmentTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 13,
      resource: this._environmentTexture ? this._environmentTexture._GPUTextureView : this.redGPUContext.state.emptyCubeTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(EnvironmentMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
         
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out vec4 vVertexPosition;	
	layout( location = 3 ) out float vMouseColorID;	
	layout( location = 4 ) out float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;        
		float __displacementTextureRenderYn;
    } vertexUniforms;
	
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uDisplacementSampler;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDisplacementTexture;
	void main() {		
		vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position, 1.0);
		vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] * vec4(normal,1.0)).xyz;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		if(vertexUniforms.__displacementTextureRenderYn == TRUTHY) vVertexPosition.xyz += ${ShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement('vNormal', 'vertexUniforms.displacementFlowSpeedX', 'vertexUniforms.displacementFlowSpeedY', 'vertexUniforms.displacementPower', 'uv', 'uDisplacementTexture', 'uDisplacementSampler')}
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;
	
	
	}
	`);
_defineProperty(EnvironmentMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${ShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
        float normalPower;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
	    float emissivePower;
	    float environmentPower;
	    float alpha;
	    float useFlatMode;
	    //
	    float __diffuseTextureRenderYn;
		float __environmentTextureRenderYn;
		float __normalTextureRenderYn;
		float __specularTextureRenderYn;
		float __emissiveTextureRenderYn;
    } fragmentUniforms;

	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in vec4 vVertexPosition;
	layout( location = 3 ) in float vMouseColorID;
	layout( location = 4 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uDiffuseSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uDiffuseTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform sampler uNormalSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uNormalTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform sampler uSpecularSampler;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uSpecularTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 10 ) uniform sampler uEmissiveSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 11 ) uniform texture2D uEmissiveTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 12 ) uniform sampler uEnvironmentSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 13 ) uniform textureCube uEnvironmentTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		float testAlpha = 0.0;
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uDiffuseSampler), vUV) ;
		
		
	    vec3 N = normalize(vNormal);
		vec4 normalColor = vec4(0.0);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), vUV) ;
		if(fragmentUniforms.useFlatMode == TRUTHY) N = getFlatNormal(vVertexPosition.xyz);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) N = perturb_normal(N, vVertexPosition.xyz, vUV, normalColor.rgb, fragmentUniforms.normalPower) ;
	
		if(fragmentUniforms.__environmentTextureRenderYn == TRUTHY) {
			vec3 R = reflect( vVertexPosition.xyz - systemUniforms.cameraPosition, N);
			vec4 reflectionColor = texture(samplerCube(uEnvironmentTexture,uEnvironmentSampler), R);
			diffuseColor = mix(diffuseColor, reflectionColor, fragmentUniforms.environmentPower);
		}
		
		testAlpha = diffuseColor.a ;
		
		float specularTextureValue = 1.0;
		if(fragmentUniforms.__specularTextureRenderYn == TRUTHY) specularTextureValue = texture(sampler2D(uSpecularTexture, uSpecularSampler), vUV).r ;
		
		vec4 finalColor = 
		calcDirectionalLight(
			diffuseColor,
			N,		
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue
		)
		+
		calcPointLight(
			diffuseColor,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue,
			vVertexPosition.xyz
		)
		+ la;
		
		if(fragmentUniforms.__emissiveTextureRenderYn == TRUTHY) {
			vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uEmissiveSampler), vUV);
			finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		}
		
		
		finalColor.a = testAlpha;
		outColor = finalColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;

		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(EnvironmentMaterial, "PROGRAM_OPTION_LIST", {
  // vertex: ['displacementTexture'],
  // fragment: ['diffuseTexture', 'emissiveTexture', 'environmentTexture', 'normalTexture', 'specularTexture', 'useFlatMode']
  vertex: [],
  fragment: []
});
_defineProperty(EnvironmentMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.VERTEX,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.VERTEX,
    texture: {
      type: "float"
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 4,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 5,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 6,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 7,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 8,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 9,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 10,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 11,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 12,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 13,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      viewDimension: 'cube'
    }
  }]
});
_defineProperty(EnvironmentMaterial, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedX'
}, {
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedY'
}, {
  size: TypeSize.float32,
  valueName: 'displacementPower'
}, {
  size: TypeSize.float32,
  valueName: '__displacementTextureRenderYn'
}]);
_defineProperty(EnvironmentMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'normalPower'
}, {
  size: TypeSize.float32,
  valueName: 'shininess'
}, {
  size: TypeSize.float32,
  valueName: 'specularPower'
}, {
  size: TypeSize.float32x4,
  valueName: 'specularColorRGBA'
}, {
  size: TypeSize.float32,
  valueName: 'emissivePower'
}, {
  size: TypeSize.float32,
  valueName: 'environmentPower'
}, {
  size: TypeSize.float32,
  valueName: 'alpha'
}, {
  size: TypeSize.float32,
  valueName: 'useFlatMode'
},
//
{
  size: TypeSize.float32,
  valueName: '__diffuseTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__environmentTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__normalTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__specularTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__emissiveTextureRenderYn'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
let float1_Float32Array$8 = new Float32Array(1);
var _raf$3 = /*#__PURE__*/new WeakMap();
class RefractionMaterial extends Mix.mix(BaseMaterial, Mix.diffuseTexture, Mix.normalTexture, Mix.specularTexture, Mix.emissiveTexture, Mix.refractionTexture, Mix.displacementTexture, Mix.basicLightPropertys, Mix.alpha) {
  constructor(redGPUContext, diffuseTexture, refractionTexture, normalTexture, specularTexture, emissiveTexture, displacementTexture) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _raf$3, {
      writable: true,
      value: void 0
    });
    this.diffuseTexture = diffuseTexture;
    this.refractionTexture = refractionTexture;
    this.normalTexture = normalTexture;
    this.emissiveTexture = emissiveTexture;
    this.specularTexture = specularTexture;
    this.displacementTexture = displacementTexture;
    this.needResetBindingInfo = true;
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        let tKey;
        switch (textureName) {
          case 'diffuseTexture':
            this._diffuseTexture = texture;
            tKey = textureName;
            break;
          case 'normalTexture':
            this._normalTexture = texture;
            tKey = textureName;
            break;
          case 'specularTexture':
            this._specularTexture = texture;
            tKey = textureName;
            break;
          case 'emissiveTexture':
            this._emissiveTexture = texture;
            tKey = textureName;
            break;
          case 'refractionTexture':
            this._refractionTexture = texture;
            tKey = textureName;
            break;
          case 'displacementTexture':
            this._displacementTexture = texture;
            tKey = textureName;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        if (tKey) {
          float1_Float32Array$8[0] = this[`__${textureName}RenderYn`] = 1;
          if (tKey == 'displacementTexture') {
            // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$8);
          } else {
            // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$8);
          }
        }
        this.needResetBindingInfo = true;
        // cancelAnimationFrame(this.#raf);
        // this.#raf = requestAnimationFrame(_ => {this.needResetBindingInfo = true})
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        float1_Float32Array$8[0] = this[`__${textureName}RenderYn`] = 0;
        if (textureName == 'displacementTexture') {
          // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$8);
        } else {
          // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$8);
        }
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }, {
      binding: 1,
      resource: this._displacementTexture ? this._displacementTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 2,
      resource: this._displacementTexture ? this._displacementTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 3,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 4,
      resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 5,
      resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 6,
      resource: this._normalTexture ? this._normalTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 7,
      resource: this._normalTexture ? this._normalTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 8,
      resource: this._specularTexture ? this._specularTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 9,
      resource: this._specularTexture ? this._specularTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 10,
      resource: this._emissiveTexture ? this._emissiveTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 11,
      resource: this._emissiveTexture ? this._emissiveTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 12,
      resource: this._refractionTexture ? this._refractionTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 13,
      resource: this._refractionTexture ? this._refractionTexture._GPUTextureView : this.redGPUContext.state.emptyCubeTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(RefractionMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
         
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out vec4 vVertexPosition;	
	layout( location = 3 ) out float vMouseColorID;	
	layout( location = 4 ) out float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
        float __displacementTextureRenderYn;
    } vertexUniforms;
	
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uDisplacementSampler;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDisplacementTexture;
	void main() {		
		vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position, 1.0);
		vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] * vec4(normal,1.0)).xyz;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		if(vertexUniforms.__displacementTextureRenderYn == TRUTHY) vVertexPosition.xyz += ${ShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement('vNormal', 'vertexUniforms.displacementFlowSpeedX', 'vertexUniforms.displacementFlowSpeedY', 'vertexUniforms.displacementPower', 'uv', 'uDisplacementTexture', 'uDisplacementSampler')}
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;		
	}
	`);
_defineProperty(RefractionMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${ShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
        float normalPower;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
	    float emissivePower;
	    float refractionPower;
	    float refractionRatio;
	    float alpha;
	    float useFlatMode;
	    //
	    float __diffuseTextureRenderYn;
		float __refractionTextureRenderYn;
		float __normalTextureRenderYn;
		float __specularTextureRenderYn;
		float __emissiveTextureRenderYn;
    } fragmentUniforms;

	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in vec4 vVertexPosition;
	layout( location = 3 ) in float vMouseColorID;
	layout( location = 4 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uDiffuseSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uDiffuseTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform sampler uNormalSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uNormalTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform sampler uSpecularSampler;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uSpecularTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 10 ) uniform sampler uEmissiveSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 11 ) uniform texture2D uEmissiveTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 12 ) uniform sampler uRefractionSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 13 ) uniform textureCube uRefractionTexture;
	layout( location = 0 ) out vec4 outColor;
	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		float testAlpha = 0.0;
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uDiffuseSampler), vUV) ;
			
	    vec3 N = normalize(vNormal);
		vec4 normalColor = vec4(0.0);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), vUV) ;
		if(fragmentUniforms.useFlatMode == TRUTHY) N = getFlatNormal(vVertexPosition.xyz);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) N = perturb_normal(N, vVertexPosition.xyz, vUV, normalColor.rgb, fragmentUniforms.normalPower) ;
	
		if(fragmentUniforms.__refractionTextureRenderYn == TRUTHY) {
			vec3 I = normalize(vVertexPosition.xyz - systemUniforms.cameraPosition);
			vec3 R = refract(I, N, fragmentUniforms.refractionRatio);
			vec4 refractionColor = texture(samplerCube(uRefractionTexture,uRefractionSampler), R);
			diffuseColor = mix(diffuseColor, refractionColor, fragmentUniforms.refractionPower);
		}
		
		testAlpha = diffuseColor.a;
		
		float specularTextureValue = 1.0;
		if(fragmentUniforms.__specularTextureRenderYn == TRUTHY) specularTextureValue = texture(sampler2D(uSpecularTexture, uSpecularSampler), vUV).r ;
		
		vec4 finalColor = 
		calcDirectionalLight(
			diffuseColor,
			N,		
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue
		)
		+
		calcPointLight(
			diffuseColor,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue,
			vVertexPosition.xyz
		)
		+ la;
		
		if(fragmentUniforms.__emissiveTextureRenderYn == TRUTHY) {
			vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uEmissiveSampler), vUV);
			finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		}
		
		finalColor.a = testAlpha;
		outColor = finalColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(RefractionMaterial, "PROGRAM_OPTION_LIST", {
  // vertex: ['displacementTexture'],
  // fragment: ['diffuseTexture', 'emissiveTexture', 'refractionTexture', 'normalTexture', 'specularTexture', 'useFlatMode']
  vertex: [],
  fragment: []
});
_defineProperty(RefractionMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.VERTEX,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.VERTEX,
    texture: {
      type: "float"
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 4,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 5,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 6,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 7,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 8,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 9,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 10,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 11,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 12,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 13,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      viewDimension: 'cube'
    }
  }]
});
_defineProperty(RefractionMaterial, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedX'
}, {
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedY'
}, {
  size: TypeSize.float32,
  valueName: 'displacementPower'
}, {
  size: TypeSize.float32,
  valueName: '__displacementTextureRenderYn'
}]);
_defineProperty(RefractionMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'normalPower'
}, {
  size: TypeSize.float32,
  valueName: 'shininess'
}, {
  size: TypeSize.float32,
  valueName: 'specularPower'
}, {
  size: TypeSize.float32x4,
  valueName: 'specularColorRGBA'
}, {
  size: TypeSize.float32,
  valueName: 'emissivePower'
}, {
  size: TypeSize.float32,
  valueName: 'refractionPower'
}, {
  size: TypeSize.float32,
  valueName: 'refractionRatio'
}, {
  size: TypeSize.float32,
  valueName: 'alpha'
}, {
  size: TypeSize.float32,
  valueName: 'useFlatMode'
},
//
{
  size: TypeSize.float32,
  valueName: '__diffuseTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__refractionTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__normalTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__specularTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__emissiveTextureRenderYn'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 11:43:33
 *
 */
class SpriteSheetAction extends UUID {
  constructor(texture, frameRate = 60, segmentW = 1, segmentH = 1, totalFrame = 1) {
    super();
    this.texture = texture;
    this.frameRate = frameRate;
    this.segmentW = segmentW;
    this.segmentH = segmentH;
    this.totalFrame = totalFrame;
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
let float1_Float32Array$9 = new Float32Array(1);
var _useFixedScale = /*#__PURE__*/new WeakMap();
class Sprite3DMaterial extends Mix.mix(BaseMaterial, Mix.diffuseTexture, Mix.alpha) {
  constructor(redGPUContext, diffuseTexture) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _useFixedScale, {
      writable: true,
      value: false
    });
    this.diffuseTexture = diffuseTexture;
    this.needResetBindingInfo = true;
  }
  get useFixedScale() {
    return _classPrivateFieldGet(this, _useFixedScale);
  }
  set useFixedScale(value) {
    _classPrivateFieldSet(this, _useFixedScale, value);
    float1_Float32Array$9[0] = value ? 1 : 0;
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`useFixedScale`], float1_Float32Array);
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`useFixedScale`], float1_Float32Array$9);
    this.needResetBindingInfo = true;
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        let tKey;
        switch (textureName) {
          case 'diffuseTexture':
            this._diffuseTexture = texture;
            tKey = textureName;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        if (tKey) {
          float1_Float32Array$9[0] = this[`__${textureName}RenderYn`] = 1;
          if (tKey == 'displacementTexture') {
            // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$9);
          } else {
            // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$9);
          }
        }
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        float1_Float32Array$9[0] = this[`__${textureName}RenderYn`] = 0;
        if (textureName == 'displacementTexture') {
          // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$9);
        } else {
          // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$9);
        }
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }, {
      binding: 1,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 2,
      resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 3,
      resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(Sprite3DMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vMouseColorID;
	layout( location = 3 ) out float vSumOpacity;	
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float useFixedScale;
    } vertexUniforms;
    ${ShareGLSL.GLSL_SystemUniforms_vertex.getSprite3DMatrix}
	void main() {
		gl_Position = systemUniforms.perspectiveMTX * getSprite3DMatrix( systemUniforms.cameraMTX, meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] ) * vec4(position,1.0);
		if(vertexUniforms.useFixedScale == TRUTHY)  {
			gl_Position /= gl_Position.w;
			gl_Position.xy += position.xy * vec2((systemUniforms.perspectiveMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ])[0][0],(systemUniforms.perspectiveMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ])[1][1]);
		}
		vNormal = normal;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
	}
	`);
_defineProperty(Sprite3DMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	const float TRUTHY = 1.0;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vMouseColorID;	
	layout( location = 3 ) in float vSumOpacity;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform FragmentUniforms {
        float alpha;
        //
        float __diffuseTextureRenderYn;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(Sprite3DMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
  // vertex: ['useFixedScale'], fragment: ['diffuseTexture']
});
_defineProperty(Sprite3DMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(Sprite3DMaterial, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.float32,
  valueName: 'useFixedScale'
}]);
_defineProperty(Sprite3DMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'alpha'
},
//
{
  size: TypeSize.float32,
  valueName: '__diffuseTextureRenderYn'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
let float1_Float32Array$a = new Float32Array(1);
var _raf$4 = /*#__PURE__*/new WeakMap();
class StandardMaterial extends Mix.mix(BaseMaterial, Mix.diffuseTexture, Mix.normalTexture, Mix.specularTexture, Mix.emissiveTexture, Mix.displacementTexture, Mix.basicLightPropertys, Mix.alpha) {
  constructor(redGPUContext, diffuseTexture, normalTexture, specularTexture, emissiveTexture, displacementTexture) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _raf$4, {
      writable: true,
      value: void 0
    });
    this.diffuseTexture = diffuseTexture;
    this.normalTexture = normalTexture;
    this.emissiveTexture = emissiveTexture;
    this.specularTexture = specularTexture;
    this.displacementTexture = displacementTexture;
    this.needResetBindingInfo = true;
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        let tKey;
        switch (textureName) {
          case 'diffuseTexture':
            this._diffuseTexture = texture;
            tKey = textureName;
            break;
          case 'normalTexture':
            this._normalTexture = texture;
            tKey = textureName;
            break;
          case 'specularTexture':
            this._specularTexture = texture;
            tKey = textureName;
            break;
          case 'emissiveTexture':
            this._emissiveTexture = texture;
            tKey = textureName;
            break;
          case 'displacementTexture':
            this._displacementTexture = texture;
            tKey = textureName;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        if (tKey) {
          float1_Float32Array$a[0] = this[`__${textureName}RenderYn`] = 1;
          if (tKey == 'displacementTexture') {
            // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$a);
          } else {
            // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$a);
          }
        }
        // cancelAnimationFrame(this.#raf);
        // this.#raf = requestAnimationFrame(_ => {this.needResetBindingInfo = true})
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        float1_Float32Array$a[0] = this[`__${textureName}RenderYn`] = 0;
        if (textureName == 'displacementTexture') {
          // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$a);
        } else {
          // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array$a);
        }
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }, {
      binding: 1,
      resource: this._displacementTexture ? this._displacementTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 2,
      resource: this._displacementTexture ? this._displacementTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 3,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 4,
      resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 5,
      resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 6,
      resource: this._normalTexture ? this._normalTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 7,
      resource: this._normalTexture ? this._normalTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 8,
      resource: this._specularTexture ? this._specularTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 9,
      resource: this._specularTexture ? this._specularTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }, {
      binding: 10,
      resource: this._emissiveTexture ? this._emissiveTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 11,
      resource: this._emissiveTexture ? this._emissiveTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(StandardMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
         
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out vec4 vVertexPosition;	
	layout( location = 3 ) out float vMouseColorID;	
	layout( location = 4 ) out float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
        float __displacementTextureRenderYn;
    } vertexUniforms;
	
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDisplacementTexture;
	void main() {		
		vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position, 1.0);
		vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] * vec4(normal,1.0)).xyz;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		if(vertexUniforms.__displacementTextureRenderYn == TRUTHY) vVertexPosition.xyz += ${ShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement('vNormal', 'vertexUniforms.displacementFlowSpeedX', 'vertexUniforms.displacementFlowSpeedY', 'vertexUniforms.displacementPower', 'uv', 'uDisplacementTexture', 'uSampler')}
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;
	
	
	}
	`);
_defineProperty(StandardMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${ShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
        float normalPower;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
	    float emissivePower;
	    float alpha;
	    float useFlatMode;
	    //
	    float __diffuseTextureRenderYn;
		float __normalTextureRenderYn;
		float __specularTextureRenderYn;
		float __emissiveTextureRenderYn;
    } fragmentUniforms;

	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in vec4 vVertexPosition;
	layout( location = 3 ) in float vMouseColorID;	
	layout( location = 4 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uDiffuseSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uDiffuseTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform sampler uNormalSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uNormalTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform sampler uSpecularSampler;	
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uSpecularTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 10 ) uniform sampler uEmissiveSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 11 ) uniform texture2D uEmissiveTexture;
	layout( location = 0 ) out vec4 outColor;
	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;

	void main() {
		float testAlpha = 0.0;
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uDiffuseSampler), vUV) ;
		
		
	    vec3 N = normalize(vNormal);
		vec4 normalColor = vec4(0.0);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), vUV) ;
		if(fragmentUniforms.useFlatMode == TRUTHY) N = getFlatNormal(vVertexPosition.xyz);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) N = perturb_normal(N, vVertexPosition.xyz, vUV, normalColor.rgb, fragmentUniforms.normalPower) ;
	
		testAlpha = diffuseColor.a;
	
		float specularTextureValue = 1.0;
		if(fragmentUniforms.__specularTextureRenderYn == TRUTHY) specularTextureValue = texture(sampler2D(uSpecularTexture, uSpecularSampler), vUV).r ;
		
		vec4 finalColor = 
		calcDirectionalLight(
			diffuseColor,
			N,		
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue
		)
		+
		calcPointLight(
			diffuseColor,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue,
			vVertexPosition.xyz
		)
		+ la;
		
		if(fragmentUniforms.__emissiveTextureRenderYn == TRUTHY) {
			vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uEmissiveSampler), vUV);
			finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		}
		
		finalColor.a = testAlpha;
		outColor = finalColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(StandardMaterial, "PROGRAM_OPTION_LIST", {
  // vertex: ['displacementTexture'],
  // fragment: ['diffuseTexture', 'emissiveTexture', 'normalTexture', 'specularTexture', 'useFlatMode']
  vertex: [],
  fragment: []
});
_defineProperty(StandardMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.VERTEX,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.VERTEX,
    texture: {
      type: "float"
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 4,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 5,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 6,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 7,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 8,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 9,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 10,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 11,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(StandardMaterial, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedX'
}, {
  size: TypeSize.float32,
  valueName: 'displacementFlowSpeedY'
}, {
  size: TypeSize.float32,
  valueName: 'displacementPower'
}, {
  size: TypeSize.float32,
  valueName: '__displacementTextureRenderYn'
}]);
_defineProperty(StandardMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'normalPower'
}, {
  size: TypeSize.float32,
  valueName: 'shininess'
}, {
  size: TypeSize.float32,
  valueName: 'specularPower'
}, {
  size: TypeSize.float32x4,
  valueName: 'specularColorRGBA'
}, {
  size: TypeSize.float32,
  valueName: 'emissivePower'
}, {
  size: TypeSize.float32,
  valueName: 'alpha'
}, {
  size: TypeSize.float32,
  valueName: 'useFlatMode'
},
//
{
  size: TypeSize.float32,
  valueName: '__diffuseTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__normalTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__specularTextureRenderYn'
}, {
  size: TypeSize.float32,
  valueName: '__emissiveTextureRenderYn'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */
var _makeData$3 = /*#__PURE__*/new WeakMap();
class Box extends baseGeometry {
  constructor(_redGPUContext, _width = 1, _height = 1, _depth = 1, _wSegments = 1, _hSegments = 1, _dSegments = 1, _uvSize = 1) {
    super();
    _classPrivateFieldInitSpec(this, _makeData$3, {
      writable: true,
      value: function () {
        let numberOfVertices;
        let buildPlane;
        buildPlane = function (interleaveData, indexData, u, v, w, udir, vdir, width, height, depth, gridX, gridY, uvSize) {
          let segmentWidth = width / gridX;
          let segmentHeight = height / gridY;
          let widthHalf = width / 2,
            heightHalf = height / 2;
          let depthHalf = depth / 2;
          let gridX1 = gridX + 1,
            gridY1 = gridY + 1;
          let vertexCounter = 0;
          let ix, iy;
          let vector = [];
          for (iy = 0; iy < gridY1; iy++) {
            let y = iy * segmentHeight - heightHalf;
            for (ix = 0; ix < gridX1; ix++) {
              let x = ix * segmentWidth - widthHalf;
              // set values to correct vector component
              vector[u] = x * udir, vector[v] = y * vdir, vector[w] = depthHalf, interleaveData.push(vector.x, vector.y, vector.z),
              // position
              vector[u] = 0, vector[v] = 0, vector[w] = depth > 0 ? 1 : -1, interleaveData.push(vector.x, vector.y, vector.z),
              // normal
              interleaveData.push(ix / gridX * uvSize, iy / gridY * uvSize),
              // texcoord
              vertexCounter += 1; // counters
            }
          }
          // indices
          for (iy = 0; iy < gridY; iy++) {
            for (ix = 0; ix < gridX; ix++) {
              let a = numberOfVertices + ix + gridX1 * iy;
              let b = numberOfVertices + ix + gridX1 * (iy + 1);
              let c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
              let d = numberOfVertices + (ix + 1) + gridX1 * iy;
              indexData.push(a, b, d, b, c, d);
            }
          }
          numberOfVertices += vertexCounter;
        };
        return function (redGPUContext, typeKey, width, height, depth, wSegments, hSegments, dSegments, uvSize) {
          ////////////////////////////////////////////////////////////////////////////
          // 데이터 생성!
          // buffers Data
          let interleaveData = [];
          let indexData = [];
          numberOfVertices = 0;
          buildPlane(interleaveData, indexData, 'z', 'y', 'x', -1, -1, depth, height, width, dSegments, hSegments, uvSize); // px
          buildPlane(interleaveData, indexData, 'z', 'y', 'x', 1, -1, depth, height, -width, dSegments, hSegments, uvSize); // nx
          buildPlane(interleaveData, indexData, 'x', 'z', 'y', 1, 1, width, depth, height, wSegments, dSegments, uvSize); // py
          buildPlane(interleaveData, indexData, 'x', 'z', 'y', 1, -1, width, depth, -height, wSegments, dSegments, uvSize); // ny
          buildPlane(interleaveData, indexData, 'x', 'y', 'z', 1, -1, width, height, depth, wSegments, hSegments, uvSize); // pz
          buildPlane(interleaveData, indexData, 'x', 'y', 'z', -1, -1, width, height, -depth, wSegments, hSegments, uvSize); // nz
          return new Geometry(redGPUContext, new Buffer(redGPUContext, `${typeKey}_interleaveBuffer`, Buffer.TYPE_VERTEX, new Float32Array(interleaveData), [new InterleaveInfo('vertexPosition', "float32x3"), new InterleaveInfo('vertexNormal', "float32x3"), new InterleaveInfo('texcoord', 'float32x2')]), new Buffer(redGPUContext, `${typeKey}_indexBuffer`, Buffer.TYPE_INDEX, new Uint32Array(indexData)));
        };
      }()
    });
    let _typeKey;
    // 유일키 생성
    _typeKey = [this.constructor.name, _width, _height, _depth, _wSegments, _hSegments, _dSegments, _uvSize].join('_');
    if (_redGPUContext.state.Geometry.has(_typeKey)) return _redGPUContext.state.Geometry.get(_typeKey);
    let tData = _classPrivateFieldGet(this, _makeData$3).call(this, _redGPUContext, _typeKey, _width, _height, _depth, _wSegments, _hSegments, _dSegments, _uvSize);
    this.interleaveBuffer = tData['interleaveBuffer'];
    this.indexBuffer = tData['indexBuffer'];
    this.vertexState = tData['vertexState'];
    _redGPUContext.state.Geometry.set(_typeKey, this);
    if (RedGPUContext.useDebugConsole) console.log(this);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */
class Axis extends BaseObject3D {
  constructor(redGPUContext) {
    super(redGPUContext);
    let tArrowMesh;
    let tAxis;
    let tBox, tArrow;
    let tMatX, tMatY, tMatZ;
    tBox = new Box(redGPUContext);
    tArrow = new Cylinder(redGPUContext, 0, 0.5);
    tMatX = new ColorMaterial(redGPUContext, '#ff0000');
    tMatY = new ColorMaterial(redGPUContext, '#00ff00');
    tMatZ = new ColorMaterial(redGPUContext, '#0000ff');
    ////////////////////////////////////////////
    // xAxis
    tArrowMesh = new Mesh(redGPUContext, tArrow, tMatX);
    tAxis = new Mesh(redGPUContext, tBox, tMatX);
    tAxis.setScale(5, 0.1, 0.1);
    tArrowMesh.x = 5;
    tArrowMesh.rotationZ = 90;
    tAxis.x = 2.5;
    this.addChild(tAxis, tArrowMesh);
    ////////////////////////////////////////////
    // yAxis
    tArrowMesh = new Mesh(redGPUContext, tArrow, tMatY);
    tAxis = new Mesh(redGPUContext, tBox, tMatY);
    tAxis.setScale(0.1, 5, 0.1);
    tArrowMesh.y = 5;
    tAxis.y = 2.5;
    this.addChild(tAxis, tArrowMesh);
    ////////////////////////////////////////////
    // zAxis
    tArrowMesh = new Mesh(redGPUContext, tArrow, tMatZ);
    tAxis = new Mesh(redGPUContext, tBox, tMatZ);
    tAxis.setScale(0.1, 0.1, 5);
    tArrowMesh.z = 5;
    tArrowMesh.rotationX = -90;
    tAxis.z = 2.5;
    this.addChild(tAxis, tArrowMesh);
    ////////////////////////////////////////////
    this.addChild(new Mesh(redGPUContext, new Sphere(redGPUContext, 0.25, 16, 16, 16), new ColorMaterial(redGPUContext, '#ff00ff')));
    if (RedGPUContext.useDebugConsole) console.log(this);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */
var _size = /*#__PURE__*/new WeakMap();
var _divisions = /*#__PURE__*/new WeakMap();
var _centerColor = /*#__PURE__*/new WeakMap();
var _color$1 = /*#__PURE__*/new WeakMap();
class Grid extends BaseObject3D {
  constructor(redGPUContext, size = 100, divisions = 100, centerColor = '#cccccc', color = '#666666') {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _size, {
      writable: true,
      value: 100
    });
    _classPrivateFieldInitSpec(this, _divisions, {
      writable: true,
      value: 100
    });
    _classPrivateFieldInitSpec(this, _centerColor, {
      writable: true,
      value: '#cccccc'
    });
    _classPrivateFieldInitSpec(this, _color$1, {
      writable: true,
      value: '#666666'
    });
    _defineProperty(this, "redGPUContext", void 0);
    this.redGPUContext = redGPUContext;
    this.size = size;
    this.divisions = divisions;
    this.centerColor = centerColor;
    this.color = color;
    this.makeGridGeometry();
    this.material = new GridMaterial(redGPUContext);
    this.primitiveTopology = 'line-list';
  }
  get color() {
    return _classPrivateFieldGet(this, _color$1);
  }
  set color(value) {
    _classPrivateFieldSet(this, _color$1, value);
    this.makeGridGeometry();
  }
  get centerColor() {
    return _classPrivateFieldGet(this, _centerColor);
  }
  set centerColor(value) {
    _classPrivateFieldSet(this, _centerColor, value);
    this.makeGridGeometry();
  }
  get divisions() {
    return _classPrivateFieldGet(this, _divisions);
  }
  set divisions(value) {
    _classPrivateFieldSet(this, _divisions, value);
    this.makeGridGeometry();
  }
  get size() {
    return _classPrivateFieldGet(this, _size);
  }
  set size(value) {
    _classPrivateFieldSet(this, _size, value);
    this.makeGridGeometry();
  }
  makeGridGeometry() {
    let redGPUContext = this.redGPUContext;
    let center, step, halfSize;
    let i, k, tColor;
    let interleaveData = [];
    center = this.divisions / 2;
    step = this.size / this.divisions;
    halfSize = this.size / 2;
    for (i = 0, k = -halfSize; i <= this.divisions; i++, k += step) {
      tColor = i === center ? UTIL.hexToRGB_ZeroToOne(this.centerColor) : UTIL.hexToRGB_ZeroToOne(this.color);
      interleaveData.push(-halfSize, 0, k, tColor[0], tColor[1], tColor[2], 1, halfSize, 0, k, tColor[0], tColor[1], tColor[2], 1, k, 0, -halfSize, tColor[0], tColor[1], tColor[2], 1, k, 0, halfSize, tColor[0], tColor[1], tColor[2], 1);
    }
    this.geometry = new Geometry(redGPUContext, new Buffer(redGPUContext, 'gridInterleaveBuffer_' + this.size + '_' + this.divisions + '_' + this.centerColor + '_' + this.color, Buffer.TYPE_VERTEX, new Float32Array(interleaveData), [new InterleaveInfo('vertexPosition', "float32x3"), new InterleaveInfo('vertexColor', 'float32x4')]));
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 18:50:31
 *
 */
class SkyBox extends BaseObject3D {
  constructor(redGPUContext, skyBoxTexture) {
    super(redGPUContext);
    this.geometry = new Box(redGPUContext);
    this.material = new SkyBoxMaterial(redGPUContext, skyBoxTexture);
    this.cullMode = 'front';
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.8 18:27:58
 *
 */
class Sprite3D extends BaseObject3D {
  constructor(redGPUContext, geometry, material) {
    super(redGPUContext);
    this.geometry = geometry;
    this.material = material;
    this.cullMode = 'none';
    this.renderDrawLayerIndex = Render.DRAW_LAYER_INDEX2_Z_POINT_SORT;
  }
  get material() {
    return this._material;
  }
  set material(v) {
    if (v instanceof Sprite3DMaterial) {
      this._material = v;
      this.dirtyPipeline = true;
    } else {
      UTIL.throwFunc(`addChild - only allow Sprite3DMaterial Instance. - inputValue : ${v} { type : ${typeof v} }`);
    }
  }
  get rotationX() {
    return this._rotationX;
  }
  set rotationX(v) {}
  get rotationY() {
    return this._rotationY;
  }
  set rotationY(v) {}
  get rotationZ() {
    return this._rotationZ;
  }
  set rotationZ(v) {}
  get useFixedScale() {
    return this.material.useFixedScale;
  }
  set useFixedScale(value) {
    this.material.useFixedScale = value;
  }
  addChild(child) {/* Sprite3D에는 추가불가*/}
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 18:59:49
 *
 */
let float1_Float32Array$b = new Float32Array(1);
var _useFixedScale$1 = /*#__PURE__*/new WeakMap();
var _useSprite3DMode = /*#__PURE__*/new WeakMap();
class TextMaterial extends Mix.mix(BaseMaterial, Mix.diffuseTexture, Mix.alpha) {
  constructor(redGPUContext, diffuseTexture) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _useFixedScale$1, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(this, _useSprite3DMode, {
      writable: true,
      value: false
    });
    _defineProperty(this, "_width", 256);
    _defineProperty(this, "_height", 256);
    this.diffuseTexture = diffuseTexture;
    this.needResetBindingInfo = true;
  }
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
    float1_Float32Array$b[0] = this._width;
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['width'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['width'], float1_Float32Array$b);
  }
  get height() {
    return this._height;
  }
  set height(value) {
    this._height = value;
    float1_Float32Array$b[0] = this._height;
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['height'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['height'], float1_Float32Array$b);
  }
  get useFixedScale() {
    return _classPrivateFieldGet(this, _useFixedScale$1);
  }
  set useFixedScale(value) {
    _classPrivateFieldSet(this, _useFixedScale$1, value);
    this.needResetBindingInfo = true;
  }
  get useSprite3DMode() {
    return _classPrivateFieldGet(this, _useSprite3DMode);
  }
  set useSprite3DMode(value) {
    _classPrivateFieldSet(this, _useSprite3DMode, value);
    this.needResetBindingInfo = true;
  }
  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        switch (textureName) {
          case 'diffuseTexture':
            this._diffuseTexture = texture;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        this.needResetBindingInfo = true;
      }
    }
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_vertex.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_vertex.size
      }
    }, {
      binding: 1,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 2,
      resource: this.redGPUContext.state.emptySampler.GPUSampler
    }, {
      binding: 3,
      resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(TextMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float width;
        float height;
    } vertexUniforms;
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vMouseColorID;	
	layout( location = 3 ) out float vSumOpacity;
    ${ShareGLSL.GLSL_SystemUniforms_vertex.getSprite3DMatrix}	
	void main() {
		float w = vertexUniforms.width ;
		float h = vertexUniforms.height ;
		mat4 modelMatrix = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ];
		mat4 targetMatrix;
		
		// 기본
		targetMatrix = modelMatrix * mat4( w / max( w, h ), 0.0, 0.0, 0.0,   0.0, h / max( w, h ), 0.0, 0.0,    0.0, 0.0, 1.0, 0.0,    0.0, 0.0, 0.0, 1.0 );
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * targetMatrix * vec4(position,1.0);				
		
		// sprite3D
		//#RedGPU#useSprite3DMode#  targetMatrix = modelMatrix * mat4( w / systemUniforms.resolution.y, 0.0, 0.0, 0.0,    0.0, h / systemUniforms.resolution.y, 0.0, 0.0,    0.0, 0.0, 1.0, 0.0,    0.0, 0.0, 0.0, 1.0);
		//#RedGPU#useSprite3DMode#  gl_Position = systemUniforms.perspectiveMTX * getSprite3DMatrix( systemUniforms.cameraMTX, targetMatrix ) * vec4(position,1.0);	
			
		
		//#RedGPU#useSprite3DMode#  //#RedGPU#useFixedScale#  gl_Position /= gl_Position.w;
		//#RedGPU#useSprite3DMode#  //#RedGPU#useFixedScale#  gl_Position.xy += position.xy * vec2((systemUniforms.perspectiveMTX * targetMatrix)[0][0],(systemUniforms.perspectiveMTX * targetMatrix)[1][1]);
	
		
		vNormal = normal;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
	}
	`);
_defineProperty(TextMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vMouseColorID;	
	layout( location = 3 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform FragmentUniforms {
        float alpha;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#diffuseTexture# diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		// if(diffuseColor.a < 0.05) discard;
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`);
_defineProperty(TextMaterial, "PROGRAM_OPTION_LIST", {
  vertex: ['useFixedScale', 'useSprite3DMode'],
  fragment: ['diffuseTexture']
});
_defineProperty(TextMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.VERTEX,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(TextMaterial, "uniformBufferDescriptor_vertex", [{
  size: TypeSize.float32,
  valueName: 'width'
}, {
  size: TypeSize.float32,
  valueName: 'height'
}]);
_defineProperty(TextMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'alpha'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 20:10:29
 *
 */
let setTexture = function (target) {
  target['_height'] = +target['_height'];
  target['_svg'].setAttribute('width', target['_width']);
  target['_svg'].setAttribute('height', target['_height']);
  target['_svg'].querySelector('foreignObject').setAttribute('height', target['_height']);
  target['_svg'].querySelector('table').style.height = target['_height'] + 'px';
  target['_img'].src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(target['_svg'].outerHTML);
};
//TODO - 여기 SVG질도 백그라운드로 보내야함
let setStylePrototype;
setStylePrototype = function () {
  return function (target, k, baseValue) {
    let tStyle;
    tStyle = target['_svg'].querySelector('td').style;
    target['_' + k] = baseValue;
    Object.defineProperty(target, k, {
      get: function () {
        return target['_' + k];
      },
      set: function (v) {
        target['_' + k] = v;
        tStyle[k] = typeof v == 'number' ? v += 'px' : v;
        setTexture(target);
      }
    });
    target[k] = baseValue;
  };
}();
let tSVG, tHTMLContainer;
class Text extends BaseObject3D {
  constructor(redGPUContext, width = 256, height = 128) {
    super(redGPUContext);
    _defineProperty(this, "_cvs", void 0);
    _defineProperty(this, "_ctx", void 0);
    _defineProperty(this, "_svg", void 0);
    _defineProperty(this, "_img", void 0);
    _defineProperty(this, "_width", 256);
    _defineProperty(this, "_height", 128);
    this.renderDrawLayerIndex = Render.DRAW_LAYER_INDEX2_Z_POINT_SORT;
    if (width > 1920) width = 1920;
    if (height > 1920) height = 1920;
    this['_cvs'] = new OffscreenCanvas(width, height);
    this['_ctx'] = this['_cvs'].getContext('2d');
    // SVG 생성
    this['_svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this['_svg'].setAttribute('xmlns', "http://www.w3.org/2000/svg");
    this['_svg'].style = 'position:absolute;top:0px;left:0px;text-align:center;z-index:10';
    this['_svg'].innerHTML = '<foreignObject  width="100%" style="position:absolute;top:0;left:0">' + '   <table xmlns="http://www.w3.org/1999/xhtml" style="border-collapse: collapse;position:table;top:0;left:0;width:100%;table-layout:fixed">' + '       <tr xmlns="http://www.w3.org/1999/xhtml">' + '       <td xmlns="http://www.w3.org/1999/xhtml"  > </td>' + '       </tr>' + '   </table>' + '</foreignObject>';
    // document.body.appendChild(this['_svg'])

    this.geometry = new Plane(redGPUContext);
    this.material = new TextMaterial(redGPUContext);
    this.cullMode = 'none';
    this.depthWriteEnabled = false;
    this['_img'] = new Image();
    this.width = width;
    this.height = height;
    setStylePrototype(this, 'padding', 0);
    setStylePrototype(this, 'background', '');
    setStylePrototype(this, 'color', '#000');
    setStylePrototype(this, 'fontFamily', 'Arial');
    setStylePrototype(this, 'fontSize', 22);
    setStylePrototype(this, 'fontWeight', 'normal');
    setStylePrototype(this, 'fontStyle', 'normal');
    setStylePrototype(this, 'lineHeight', 22 * 1.5);
    setStylePrototype(this, 'letterSpacing', 0);
    setStylePrototype(this, 'wordBreak', 'break-all');
    setStylePrototype(this, 'verticalAlign', 'middle');
    setStylePrototype(this, 'textAlign', 'center');
    this['_img'].onload = _ => {
      let tW, tH;
      tW = this['_width'];
      tH = this['_height'];
      // if (tW % 2 == 0) tW += 1;
      // if (tH % 2 == 0) tH += 1;
      this['_cvs']['width'] = tW;
      this['_cvs']['height'] = tH;
      this['_ctx'].clearRect(0, 0, tW, tH);
      this['_ctx'].drawImage(this['_img'], 0, 0, tW, tH);
      this['material'].width = tW;
      this['material'].height = tH;
      this['_cvs'].convertToBlob().then(v => {
        new BitmapTexture(redGPUContext, URL.createObjectURL(v), {
          magFilter: "linear",
          minFilter: "linear",
          mipmapFilter: "linear",
          addressModeU: "clamp-to-edge",
          addressModeV: "clamp-to-edge",
          addressModeW: "repeat"
        }, true, v => {
          if (this['material'].diffuseTexture) this['material'].diffuseTexture.GPUTexture.destroy();
          this['material'].diffuseTexture = v;
        });
      });
    };
  }
  get width() {
    return this._width;
  }
  set width(v) {
    this['material']['width'] = this['_width'] = v < 2 ? 2 : v;
    setTexture(this);
  }
  get height() {
    return this._height;
  }
  set height(v) {
    this['material']['height'] = this['_height'] = v < 2 ? 2 : v;
    setTexture(this);
  }
  get useFixedScale() {
    return this.material.useFixedScale;
  }
  set useFixedScale(value) {
    this.material.useFixedScale = value;
  }
  get useSprite3DMode() {
    return this.material.useSprite3DMode;
  }
  set useSprite3DMode(value) {
    this.material.useSprite3DMode = value;
  }
  get material() {
    return this._material;
  }
  set material(v) {
    if (v instanceof TextMaterial) {
      this._material = v;
      this.dirtyPipeline = true;
    } else {
      UTIL.throwFunc(`addChild - only allow TextMaterial Instance. - inputValue : ${v} { type : ${typeof v} }`);
    }
  }
  get text() {
    return this['_text'];
  }
  set text(v) {
    tSVG = this['_svg'];
    tHTMLContainer = tSVG.querySelector('foreignObject td');
    v = v.toString();
    this['_text'] = v.replace(/\<br\>/gi, '<div/>');
    // console.log(this['_svg'].querySelector('foreignObject div'))
    // console.log(this['_svg'].width)
    // this['_svg'].setAttribute('width', 100000);
    // this['_svg'].setAttribute('height', 100000);
    let self = this;
    let t0 = this['_text'].match(/<img .*?>/g);
    let t1 = [];
    let result = this['_text'];
    t0 = t0 || [];
    // console.log(t0);
    let max = t0.length;
    let loaded = 0;
    t0.forEach(function (v) {
      console.log(v, v.match(/src\s*=\s*(\'|\").*?(\'|\")/g));
      let tSrc = v.match(/src\s*=\s*(\'|\").*?(\'|\")/g)[0];
      tSrc = tSrc.replace(/src\s*=\s*(\'|\")/g, '').replace(/(\'|\")/g, '');
      console.log(tSrc);
      let test = document.createElement('div');
      test.innerHTML = v;
      let img = test.querySelector('img');
      img.onload = function () {
        let canvas = document.createElement('canvas');
        canvas.width = img.style.width ? +img.style.width : img.width;
        canvas.height = img.style.height ? +img.style.height : img.height;
        let ctx = canvas.getContext('2d');
        ctx.scale(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
        ctx.drawImage(img, 0, 0);
        tInfo.result = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" width="' + img.width + '" height="' + img.height + '" display="inline" style="vertical-align: middle;display: inline-block">' + '<image xlink:href="' + canvas.toDataURL('image/png') + '" height="' + img.height + 'px" width="' + img.width + 'px" />' + '</svg>';
        loaded++;
        if (loaded == max) {
          t1.forEach(function (v) {
            result = result.replace(v.source, v.result);
          });
          tHTMLContainer.innerHTML = result;
          setTexture(self);
        }
        img.onload = null;
      };
      let tInfo = {
        source: v,
        sourceSrc: tSrc,
        result: ''
      };
      t1.push(tInfo);
    });
    if (t0.length == 0) {
      tHTMLContainer.innerHTML = result;
      setTexture(this);
    }
  }
  addChild(child) {/*Text 에는 추가불가*/}
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 18:59:49
 *
 */
class LineMaterial extends Mix.mix(BaseMaterial, Mix.alpha) {
  constructor(redGPUContext) {
    super(redGPUContext);
    this.needResetBindingInfo = true;
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(LineMaterial, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec4 color;
	layout( location = 0 ) out float vMouseColorID;
	layout( location = 1 ) out vec4 vColor;		
	layout( location = 2 ) out float vSumOpacity;
	void main() {
		vMouseColorID = meshUniforms.mouseColorID;
		vColor = color;
		vSumOpacity = meshUniforms.sumOpacity;
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
	
	}
	`);
_defineProperty(LineMaterial, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
         float alpha;
    } fragmentUniforms;
	layout( location = 0 ) in float vMouseColorID;
	layout( location = 1 ) in vec4 vColor;			
	layout( location = 2 ) in float vSumOpacity;
	layout( location = 0 ) out vec4 outColor;	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		outColor = vColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
	`);
_defineProperty(LineMaterial, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(LineMaterial, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }]
});
_defineProperty(LineMaterial, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(LineMaterial, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'alpha'
}]);

let solveCatmullRomPoint;
let getPointsOnBezierCurves;
let serializePoints;
let parsePointsByType;
let setDebugMeshs;
let simplifyPoints;
let vec2_distanceToSegmentSq;
vec2_distanceToSegmentSq = function (p, v, w) {
  let l2 = t.vec2.sqrDist(v, w);
  if (l2 === 0) return t.vec2.sqrDist(p, v);
  let t$1 = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t$1 = Math.max(0, Math.min(1, t$1));
  return t.vec2.sqrDist(p, t.vec2.lerp([0, 0], v, w, t$1));
};
simplifyPoints = function (points, start, end, epsilon, newPoints) {
  let outPoints = newPoints || [];
  // find the most distant point from the line formed by the endpoints
  let s = points[start];
  let e = points[end - 1];
  let maxDistSq = 0;
  let maxNdx = 1;
  let i = start + 1;
  for (i; i < end - 1; ++i) {
    let distSq = vec2_distanceToSegmentSq(points[i], s, e);
    if (distSq > maxDistSq) {
      maxDistSq = distSq;
      maxNdx = i;
    }
  }
  // if that point is too far
  if (Math.sqrt(maxDistSq) > epsilon) {
    // split
    simplifyPoints(points, start, maxNdx + 1, epsilon, outPoints);
    simplifyPoints(points, maxNdx, end, epsilon, outPoints);
  } else outPoints.push(s, e); // add the 2 end points
  return outPoints;
};
solveCatmullRomPoint = function (points, tension) {
  if (tension == null) tension = 1;
  let size = points.length;
  let last = size - 2;
  let i = 0;
  let p0, p1, p2, p3;
  for (i; i < size - 1; i++) {
    // 이전 포인트를 구함
    p0 = i ? points[i - 1]['point'] : points[i]['point'];
    // 현재 포인트를 구함
    p1 = points[i]['point'];
    // 다음 포인트를 구함
    p2 = points[i + 1]['point'];
    // 다다음 포인트를 구함
    p3 = i === last ? p2 : points[i + 2]['point'];
    points[i]['outPoint'][0] = p1[0] + (p2[0] - p0[0]) / 6 * tension;
    points[i]['outPoint'][1] = p1[1] + (p2[1] - p0[1]) / 6 * tension;
    points[i]['outPoint'][2] = p1[2] + (p2[2] - p0[2]) / 6 * tension;
    points[i + 1]['inPoint'][0] = p2[0] - (p3[0] - p1[0]) / 6 * tension;
    points[i + 1]['inPoint'][1] = p2[1] - (p3[1] - p1[1]) / 6 * tension;
    points[i + 1]['inPoint'][2] = p2[2] - (p3[2] - p1[2]) / 6 * tension;
  }
  return points;
};
serializePoints = function (points) {
  let newPointList = [];
  let i, len;
  let index = 0;
  let targetPoint;
  i = 0;
  len = points.length;
  for (i; i < len; i++) {
    targetPoint = points[i];
    if (index === 0) {
      newPointList[index++] = targetPoint['point'];
      newPointList[index++] = targetPoint['outPoint'];
      //
    } else {
      newPointList[index++] = targetPoint['inPoint'];
      newPointList[index++] = targetPoint['point'];
      if (points[i + 1]) newPointList[index++] = targetPoint['outPoint'];
    }
  }
  return newPointList;
};
getPointsOnBezierCurves = function () {
  let flatness;
  let getPointsOnBezierCurveWithSplitting;
  flatness = function (points, offset) {
    let p1 = points[offset + 0];
    let c1 = points[offset + 1];
    let c2 = points[offset + 2];
    let p4 = points[offset + 3];
    let ux = 3 * c1[0] - 2 * p1[0] - p4[0];
    let uy = 3 * c1[1] - 2 * p1[1] - p4[1];
    let vx = 3 * c2[0] - 2 * p4[0] - p1[0];
    let vy = 3 * c2[1] - 2 * p4[1] - p1[1];
    ux *= ux, uy *= uy, vx *= vx, vy *= vy;
    if (ux < vx) ux = vx;
    if (uy < vy) uy = vy;
    return ux + uy;
  };
  getPointsOnBezierCurveWithSplitting = function (points, offset, tolerance, newPoints) {
    let outPoints = newPoints || [];
    if (flatness(points, offset) < tolerance) outPoints.push(points[offset + 0], points[offset + 3]);else {
      // subdivide
      let t$1 = .5;
      let p1 = points[offset + 0];
      let c1 = points[offset + 1];
      let c2 = points[offset + 2];
      let p2 = points[offset + 3]; /**/
      let q1 = t.vec3.lerp([0, 0], p1, c1, t$1);
      let q2 = t.vec3.lerp([0, 0], c1, c2, t$1);
      let q3 = t.vec3.lerp([0, 0], c2, p2, t$1); /**/
      let r1 = t.vec3.lerp([0, 0], q1, q2, t$1);
      let r2 = t.vec3.lerp([0, 0], q2, q3, t$1); /**/
      let red = t.vec3.lerp([0, 0], r1, r2, t$1);
      red.colorRGBA = p1.colorRGBA;
      // do 1st half
      getPointsOnBezierCurveWithSplitting([p1, q1, r1, red], 0, tolerance, outPoints);
      // do 2nd half
      getPointsOnBezierCurveWithSplitting([red, r2, q3, p2], 0, tolerance, outPoints);
    }
    return outPoints;
  };
  return function (points, tolerance) {
    let newPoints = [];
    let numSegments = (points.length - 1) / 3;
    numSegments = Math.floor(numSegments);
    let i = 0;
    let offset;
    for (i; i < numSegments; ++i) {
      offset = i * 3;
      getPointsOnBezierCurveWithSplitting(points, offset, tolerance, newPoints);
    }
    return newPoints;
  };
}();
setDebugMeshs = function (target) {
  //TODO
};
parsePointsByType = function (target, originalPoints, tension, tolerance, distance) {
  // 타입별로 파서 분기
  target['_interleaveData'].length = 0;
  let newPointList;
  let i, len;
  let tData;
  switch (target.type) {
    case Line['CATMULL_ROM']:
    case Line['BEZIER']:
      if (originalPoints.length > 1) {
        target['_serializedPoints'] = serializePoints(Line['CATMULL_ROM'] === target.type ? solveCatmullRomPoint(originalPoints, tension) : originalPoints);
        newPointList = getPointsOnBezierCurves(target['_serializedPoints'], tolerance);
        newPointList = simplifyPoints(newPointList, 0, newPointList.length, distance);
        i = 0;
        len = newPointList.length;
        for (i; i < len; i++) {
          tData = newPointList[i];
          target['_interleaveData'].push(tData[0], tData[1], tData[2], ...tData.colorRGBA);
        }
      } else target['_interleaveData'].push(0, 0, 0, ...UTIL.hexToRGB_ZeroToOne(target.color));
      break;
    default:
      i = 0;
      len = originalPoints.length;
      for (i; i < len; i++) {
        tData = originalPoints[i].point;
        target['_interleaveData'].push(tData[0], tData[1], tData[2], ...tData.colorRGBA);
      }
  }
  if (target['debug']) setDebugMeshs(target);
  // target['_indexData'].push(tIndex);
  target['_upload']();
};
class LinePoint {
  constructor(x = 0, y = 0, z = 0, inX = 0, inY = 0, inZ = 0, outX = 0, outY = 0, outZ = 0, color, colorAlpha) {
    let t0 = [...UTIL.hexToRGB_ZeroToOne(color), colorAlpha];
    this.inPoint = [inX, inY, inZ];
    this.inPoint.colorRGBA = t0;
    this.point = [x, y, z];
    this.point.colorRGBA = t0;
    this.outPoint = [outX, outY, outZ];
    this.outPoint.colorRGBA = t0;
  }
}
var _type = /*#__PURE__*/new WeakMap();
var _tension = /*#__PURE__*/new WeakMap();
var _distance$1 = /*#__PURE__*/new WeakMap();
var _tolerance = /*#__PURE__*/new WeakMap();
var _originalPoints = /*#__PURE__*/new WeakMap();
class Line extends BaseObject3D {
  constructor(redGPUContext, baseColor = '#ff0000', type = Line.LINEAR) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _type, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _tension, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _distance$1, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _tolerance, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _originalPoints, {
      writable: true,
      value: []
    });
    this.redGPUContext = redGPUContext;
    this._interleaveData = [0, 0, 0];
    this.primitiveTopology = 'line-strip';
    // this.primitiveTopology = 'line-list';
    this['_serializedPoints'] = []; //직렬화된 포인트
    _classPrivateFieldSet(this, _tension, 1);
    _classPrivateFieldSet(this, _tolerance, 0.01);
    _classPrivateFieldSet(this, _distance$1, 0.1);
    this.color = baseColor;
    _classPrivateFieldSet(this, _type, type);
    this['_debug'] = false;
    this.material = new LineMaterial(this.redGPUContext);
    this.dirtyPipeline = false;
  }
  get type() {
    return _classPrivateFieldGet(this, _type);
  }
  set type(v) {
    if (!(v === Line.LINEAR || v === Line.CATMULL_ROM || v === Line.BEZIER)) UTIL.throwFunc('Line : 허용하지 않는 타입', '입력값 : ' + v);
    _classPrivateFieldSet(this, _type, v);
    parsePointsByType(this, _classPrivateFieldGet(this, _originalPoints), _classPrivateFieldGet(this, _tension), _classPrivateFieldGet(this, _tolerance), _classPrivateFieldGet(this, _distance$1));
  }
  get tension() {
    return _classPrivateFieldGet(this, _tension);
  }
  set tension(v) {
    _classPrivateFieldSet(this, _tension, v);
    parsePointsByType(this, _classPrivateFieldGet(this, _originalPoints), _classPrivateFieldGet(this, _tension), _classPrivateFieldGet(this, _tolerance), _classPrivateFieldGet(this, _distance$1));
  }
  get distance() {
    return _classPrivateFieldGet(this, _distance$1);
  }
  set distance(v) {
    _classPrivateFieldSet(this, _distance$1, v);
    parsePointsByType(this, _classPrivateFieldGet(this, _originalPoints), _classPrivateFieldGet(this, _tension), _classPrivateFieldGet(this, _tolerance), _classPrivateFieldGet(this, _distance$1));
  }
  get tolerance() {
    return _classPrivateFieldGet(this, _tolerance);
  }
  set tolerance(v) {
    _classPrivateFieldSet(this, _tolerance, v);
    parsePointsByType(this, _classPrivateFieldGet(this, _originalPoints), _classPrivateFieldGet(this, _tension), _classPrivateFieldGet(this, _tolerance), _classPrivateFieldGet(this, _distance$1));
  }
  addPoint(x = 0, y = 0, z = 0, color, colorAlpha = 1, inX = 0, inY = 0, inZ = 0, outX = 0, outY = 0, outZ = 0) {
    typeof x == 'number' || UTIL.throwFunc('Line : addPoint - x값은 숫자만 허용', '입력값 : ' + x);
    typeof y == 'number' || UTIL.throwFunc('Line : addPoint - y값은 숫자만 허용', '입력값 : ' + y);
    typeof z == 'number' || UTIL.throwFunc('Line : addPoint - z값은 숫자만 허용', '입력값 : ' + z);
    typeof inX == 'number' || UTIL.throwFunc('Line : addPoint - inX값은 숫자만 허용', '입력값 : ' + inX);
    typeof inY == 'number' || UTIL.throwFunc('Line : addPoint - inY값은 숫자만 허용', '입력값 : ' + inY);
    typeof inZ == 'number' || UTIL.throwFunc('Line : addPoint - inZ값은 숫자만 허용', '입력값 : ' + inZ);
    typeof outX == 'number' || UTIL.throwFunc('Line : addPoint - outX값은 숫자만 허용', '입력값 : ' + outX);
    typeof outY == 'number' || UTIL.throwFunc('Line : addPoint - outY값은 숫자만 허용', '입력값 : ' + outY);
    typeof outZ == 'number' || UTIL.throwFunc('Line : addPoint - outZ값은 숫자만 허용', '입력값 : ' + outZ);
    _classPrivateFieldGet(this, _originalPoints).push(new LinePoint(x, y, z, inX, inY, inZ, outX, outY, outZ, color || this.color, colorAlpha));
    parsePointsByType(this, _classPrivateFieldGet(this, _originalPoints), _classPrivateFieldGet(this, _tension), _classPrivateFieldGet(this, _tolerance), _classPrivateFieldGet(this, _distance$1));
  }
  addPointAt(index, x = 0, y = 0, z = 0, color, colorAlpha = 1, inX = 0, inY = 0, inZ = 0, outX = 0, outY = 0, outZ = 0) {
    typeof x == 'number' || UTIL.throwFunc('Line : addPoint - x값은 숫자만 허용', '입력값 : ' + x);
    typeof y == 'number' || UTIL.throwFunc('Line : addPoint - y값은 숫자만 허용', '입력값 : ' + y);
    typeof z == 'number' || UTIL.throwFunc('Line : addPoint - z값은 숫자만 허용', '입력값 : ' + z);
    typeof inX == 'number' || UTIL.throwFunc('Line : addPoint - inX값은 숫자만 허용', '입력값 : ' + inX);
    typeof inY == 'number' || UTIL.throwFunc('Line : addPoint - inY값은 숫자만 허용', '입력값 : ' + inY);
    typeof inZ == 'number' || UTIL.throwFunc('Line : addPoint - inZ값은 숫자만 허용', '입력값 : ' + inZ);
    typeof outX == 'number' || UTIL.throwFunc('Line : addPoint - outX값은 숫자만 허용', '입력값 : ' + outX);
    typeof outY == 'number' || UTIL.throwFunc('Line : addPoint - outY값은 숫자만 허용', '입력값 : ' + outY);
    typeof outZ == 'number' || UTIL.throwFunc('Line : addPoint - outZ값은 숫자만 허용', '입력값 : ' + outZ);
    typeof index == 'number' || UTIL.throwFunc('addPointAt', 'index는 숫자만 입력가능', '입력값 : ' + index);
    if (_classPrivateFieldGet(this, _originalPoints).length < index) index = _classPrivateFieldGet(this, _originalPoints).length;
    if (index != undefined) _classPrivateFieldGet(this, _originalPoints).splice(index, 0, new LinePoint(x, y, z, inX, inY, inZ, outX, outY, outZ, color || this.color, colorAlpha));else _classPrivateFieldGet(this, _originalPoints).push(new LinePoint(x, y, z, inX, inY, inZ, outX, outY, outZ, color || this.color, colorAlpha));
    parsePointsByType(this, _classPrivateFieldGet(this, _originalPoints), _classPrivateFieldGet(this, _tension), _classPrivateFieldGet(this, _tolerance), _classPrivateFieldGet(this, _distance$1));
  }
  removePointAt(index) {
    if (typeof index != 'number') UTIL.throwFunc('removeChildAt', 'index가 Number형이 아님 ', '입력값 : ' + index);
    if (_classPrivateFieldGet(this, _originalPoints)[index]) _classPrivateFieldGet(this, _originalPoints).splice(index, 1);else UTIL.throwFunc('removeChildAt', 'index 해당인덱스에 위치한 포인트가 없음.', '입력값 : ' + index);
    parsePointsByType(this, _classPrivateFieldGet(this, _originalPoints), _classPrivateFieldGet(this, _tension), _classPrivateFieldGet(this, _tolerance), _classPrivateFieldGet(this, _distance$1));
  }
  removeAllPoint() {
    _classPrivateFieldGet(this, _originalPoints).length = 0;
    parsePointsByType(this, _classPrivateFieldGet(this, _originalPoints), _classPrivateFieldGet(this, _tension), _classPrivateFieldGet(this, _tolerance), _classPrivateFieldGet(this, _distance$1));
    this['_upload']();
  }
  _upload() {
    this._UUID = UUID.getNextUUID();
    if (_classPrivateFieldGet(this, _originalPoints).length) {
      this._interleaveBuffer = new Buffer(this.redGPUContext, 'Line_InterleaveBuffer_' + this._UUID, Buffer.TYPE_VERTEX, new Float32Array(this._interleaveData), [new InterleaveInfo('vertexPosition', "float32x3"), new InterleaveInfo('vertexColor', 'float32x4')]);
      this.geometry = new Geometry(this.redGPUContext, this._interleaveBuffer);
    } else {
      this._interleaveBuffer = null;
      this.geometry = null;
    }
  }
}
_defineProperty(Line, "LINEAR", 'linear');
_defineProperty(Line, "CATMULL_ROM", 'catmullRom');
_defineProperty(Line, "BEZIER", 'bezier');

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$c = new Float32Array(1);
class PostEffect_BrightnessContrast extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_brightness", 0);
    _defineProperty(this, "_contrast", 0);
  }
  get brightness() {
    return this._brightness;
  }
  set brightness(value) {
    /*FIXME min: -150, max: 150*/
    this._brightness = value;
    float1_Float32Array$c[0] = this._brightness / 255;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['brightness'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['brightness'], float1_Float32Array$c);
  }
  get contrast() {
    return this._contrast;
  }
  set contrast(value) {
    /*FIXME min: -50, max: 100*/
    this._contrast = value;
    float1_Float32Array$c[0] = this._contrast / 255;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['contrast'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['contrast'], float1_Float32Array$c);
  }
}
_defineProperty(PostEffect_BrightnessContrast, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_BrightnessContrast, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float brightness;
        float contrast;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 finalColor = vec4(0.0);
		finalColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		if ( fragmentUniforms.contrast > 0.0 ) finalColor.rgb = ( finalColor.rgb - 0.5 ) / ( 1.0 - fragmentUniforms.contrast ) + 0.5;
		else finalColor.rgb = ( finalColor.rgb - 0.5 ) * ( 1.0 + fragmentUniforms.contrast ) + 0.5;
		finalColor.rgb += fragmentUniforms.brightness;
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_BrightnessContrast, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_BrightnessContrast, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_BrightnessContrast, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_BrightnessContrast, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'brightness'
}, {
  size: TypeSize.float32,
  valueName: 'contrast'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
class PostEffect_Gray extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
  }
}
_defineProperty(PostEffect_Gray, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_Gray, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV ) ;
	    float gray = (diffuseColor.r  + diffuseColor.g + diffuseColor.b)/3.0;
		outColor = vec4( gray, gray, gray, 1.0);;
	}
`);
_defineProperty(PostEffect_Gray, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Gray, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_Gray, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Gray, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$d = new Float32Array(1);
class PostEffect_HueSaturation extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_hue", 0);
    _defineProperty(this, "_saturation", 0);
  }
  get hue() {
    return this._hue;
  }
  set hue(value) {
    /*FIXME min: -180, max: 180*/
    this._hue = value;
    float1_Float32Array$d[0] = this._hue / 180;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['hue'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['hue'], float1_Float32Array$d);
  }
  get saturation() {
    return this._saturation;
  }
  set saturation(value) {
    /*FIXME min: -100, max: 100*/
    this._saturation = value;
    float1_Float32Array$d[0] = this._saturation / 100;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['saturation'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['saturation'], float1_Float32Array$d);
  }
}
_defineProperty(PostEffect_HueSaturation, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_HueSaturation, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float hue;
        float saturation;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 finalColor = vec4(0.0);
		finalColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		
		float hue_value = fragmentUniforms.hue;
		float angle = hue_value * 3.1415926535897932384626433832795;
		float s = sin(angle), c = cos(angle);
		vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
		float len = length(finalColor.rgb);
		
		finalColor.rgb = vec3(
			dot(finalColor.rgb, weights.xyz),
			dot(finalColor.rgb, weights.zxy),
			dot(finalColor.rgb, weights.yzx)
		);
		
		float average = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
		float saturation_value = fragmentUniforms.saturation;
		if (saturation_value > 0.0) finalColor.rgb += (average - finalColor.rgb) * (1.0 - 1.0 / (1.001 - saturation_value));
		else finalColor.rgb += (average - finalColor.rgb) * (-saturation_value);
		
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_HueSaturation, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_HueSaturation, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_HueSaturation, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_HueSaturation, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'hue'
}, {
  size: TypeSize.float32,
  valueName: 'saturation'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
class PostEffect_Invert extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
  }
}
_defineProperty(PostEffect_Invert, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_Invert, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV ) ;
		diffuseColor.rgb = 1.0 - diffuseColor.rgb;
		outColor = diffuseColor;
	}
`);
_defineProperty(PostEffect_Invert, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Invert, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_Invert, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Invert, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$e = new Float32Array(1);
class PostEffect_Threshold extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_threshold", 128);
  }
  get threshold() {
    return this._threshold;
  }
  set threshold(value) {
    /*FIXME min: 1, max: 255*/
    this._threshold = value;
    float1_Float32Array$e[0] = this._threshold;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['threshold'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['threshold'], float1_Float32Array$e);
  }
}
_defineProperty(PostEffect_Threshold, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_Threshold, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float threshold;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 finalColor = vec4(0.0);
		finalColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		float v = 0.0;
		if( 0.2126 * finalColor.r + 0.7152 * finalColor.g + 0.0722 * finalColor.b >= fragmentUniforms.threshold/255.0 ) v = 1.0;
		finalColor.r = finalColor.g = finalColor.b = v;
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_Threshold, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Threshold, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_Threshold, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Threshold, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'threshold'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$f = new Float32Array(1);
class PostEffect_BlurX extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_size", 50);
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = value;
    float1_Float32Array$f[0] = this._size;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['size'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['size'], float1_Float32Array$f);
  }
}
_defineProperty(PostEffect_BlurX, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_BlurX, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float size;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	
	float random(vec3 scale, float seed) {
		return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
	}

	void main() {
		vec4 finalColor = vec4(0.0);
		vec2 delta;
		float total = 0.0;
		float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
		delta = vec2( fragmentUniforms.size/systemUniforms.resolution.x, 0.0 );
		for (float t = -10.0; t <= 10.0; t++) {
			float percent = (t + offset - 0.5) / 10.0;
			float weight = 1.0 - abs(percent);
			vec4 color = texture( sampler2D( uSourceTexture, uSampler ), vUV  + delta * percent );
			color.rgb *= color.a;
			finalColor += color * weight;
			total += weight;
		}
		finalColor = finalColor / total;
		finalColor.rgb /= finalColor.a + 0.00001;
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_BlurX, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_BlurX, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_BlurX, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_BlurX, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'size'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$g = new Float32Array(1);
class PostEffect_BlurY extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_size", 50);
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = value;
    float1_Float32Array$g[0] = this._size;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['size'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['size'], float1_Float32Array$g);
  }
}
_defineProperty(PostEffect_BlurY, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_BlurY, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float size;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	
	float random(vec3 scale, float seed) {
		return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
	}

	void main() {
		vec4 finalColor = vec4(0.0);
		vec2 delta;
		float total = 0.0;
		float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
		delta = vec2( 0.0, fragmentUniforms.size/systemUniforms.resolution.y );
		for (float t = -10.0; t <= 10.0; t++) {
			float percent = (t + offset - 0.5) / 10.0;
			float weight = 1.0 - abs(percent);
			vec4 color = texture( sampler2D( uSourceTexture, uSampler ), vUV  + delta * percent );
			color.rgb *= color.a;
			finalColor += color * weight;
			total += weight;
		}
		finalColor = finalColor / total;
		finalColor.rgb /= finalColor.a + 0.00001;
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_BlurY, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_BlurY, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_BlurY, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_BlurY, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'size'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */
var _blurX = /*#__PURE__*/new WeakMap();
var _blurY = /*#__PURE__*/new WeakMap();
class PostEffect_GaussianBlur extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _blurX, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _blurY, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "_radius", void 0);
    _classPrivateFieldSet(this, _blurX, new PostEffect_BlurX(redGPUContext));
    _classPrivateFieldSet(this, _blurY, new PostEffect_BlurY(redGPUContext));
    this.radius = 5;
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    this._radius = value;
    _classPrivateFieldGet(this, _blurX).size = value;
    _classPrivateFieldGet(this, _blurY).size = value;
  }
  render(redGPUContext, redView, renderScene, sourceTextureView) {
    this.checkSize(redGPUContext, redView);
    _classPrivateFieldGet(this, _blurX).render(redGPUContext, redView, renderScene, sourceTextureView);
    _classPrivateFieldGet(this, _blurY).render(redGPUContext, redView, renderScene, _classPrivateFieldGet(this, _blurX).baseAttachmentView);
    this.baseAttachment = _classPrivateFieldGet(this, _blurY).baseAttachment;
    this.baseAttachmentView = _classPrivateFieldGet(this, _blurY).baseAttachmentView;
  }
}
_defineProperty(PostEffect_GaussianBlur, "vertexShaderGLSL", BasePostEffect.vertexShaderGLSL);
_defineProperty(PostEffect_GaussianBlur, "fragmentShaderGLSL", BasePostEffect.fragmentShaderGLSL);
_defineProperty(PostEffect_GaussianBlur, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_GaussianBlur, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_GaussianBlur, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_GaussianBlur, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$h = new Float32Array(1);
class PostEffect_Bloom_blend extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "blurTexture", void 0);
    _defineProperty(this, "_bloomStrength", 15);
    _defineProperty(this, "_exposure", 15);
  }
  get bloomStrength() {
    return this._bloomStrength;
  }
  set bloomStrength(value) {
    this._bloomStrength = value;
    float1_Float32Array$h[0] = this._bloomStrength;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['bloomStrength'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['bloomStrength'], float1_Float32Array$h);
  }
  get exposure() {
    return this._exposure;
  }
  set exposure(value) {
    this._exposure = value;
    float1_Float32Array$h[0] = this._exposure;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['exposure'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['exposure'], float1_Float32Array$h);
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 1,
      resource: this.sampler.GPUSampler
    }, {
      binding: 2,
      resource: this.sourceTexture
    }, {
      binding: 3,
      resource: this.blurTexture
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(PostEffect_Bloom_blend, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_Bloom_blend, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float bloomStrength;
        float exposure;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uBlurTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor;
		vec4 blurColor;
		vec4 finalColor;
		diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		blurColor = texture( sampler2D( uBlurTexture, uSampler ), vUV );	
		finalColor = diffuseColor;
		finalColor.rgb = (finalColor.rgb  + blurColor.rgb * fragmentUniforms.bloomStrength ) * fragmentUniforms.exposure ;
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_Bloom_blend, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Bloom_blend, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(PostEffect_Bloom_blend, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Bloom_blend, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'bloomStrength'
}, {
  size: TypeSize.float32,
  valueName: 'exposure'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */
var _blurEffect = /*#__PURE__*/new WeakMap();
var _blenderEffect = /*#__PURE__*/new WeakMap();
var _thresholdEffect = /*#__PURE__*/new WeakMap();
var _blur = /*#__PURE__*/new WeakMap();
var _threshold = /*#__PURE__*/new WeakMap();
var _exposure = /*#__PURE__*/new WeakMap();
var _bloomStrength = /*#__PURE__*/new WeakMap();
class PostEffect_Bloom extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _blurEffect, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _blenderEffect, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _thresholdEffect, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _blur, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _threshold, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _exposure, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _bloomStrength, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(this, _thresholdEffect, new PostEffect_Threshold(redGPUContext));
    _classPrivateFieldSet(this, _blurEffect, new PostEffect_GaussianBlur(redGPUContext));
    _classPrivateFieldSet(this, _blenderEffect, new PostEffect_Bloom_blend(redGPUContext));
    this.blur = 20;
    this.threshold = 75;
    this.exposure = 1;
    this.bloomStrength = 1.2;
  }
  get blur() {
    return _classPrivateFieldGet(this, _blur);
  }
  set blur(value) {
    _classPrivateFieldSet(this, _blur, value);
    _classPrivateFieldGet(this, _blurEffect).radius = value;
  }
  get threshold() {
    return _classPrivateFieldGet(this, _threshold);
  }
  set threshold(value) {
    _classPrivateFieldSet(this, _threshold, value);
    _classPrivateFieldGet(this, _thresholdEffect).threshold = value;
  }
  get exposure() {
    return _classPrivateFieldGet(this, _exposure);
  }
  set exposure(value) {
    _classPrivateFieldSet(this, _exposure, value);
    _classPrivateFieldGet(this, _blenderEffect).exposure = value;
  }
  get bloomStrength() {
    return _classPrivateFieldGet(this, _bloomStrength);
  }
  set bloomStrength(value) {
    _classPrivateFieldSet(this, _bloomStrength, value);
    _classPrivateFieldGet(this, _blenderEffect).bloomStrength = value;
  }
  render(redGPUContext, redView, renderScene, sourceTextureView) {
    this.checkSize(redGPUContext, redView);
    _classPrivateFieldGet(this, _thresholdEffect).render(redGPUContext, redView, renderScene, sourceTextureView);
    _classPrivateFieldGet(this, _blurEffect).render(redGPUContext, redView, renderScene, _classPrivateFieldGet(this, _thresholdEffect).baseAttachmentView);
    _classPrivateFieldGet(this, _blenderEffect).blurTexture = _classPrivateFieldGet(this, _blurEffect).baseAttachmentView;
    _classPrivateFieldGet(this, _blenderEffect).render(redGPUContext, redView, renderScene, sourceTextureView);
    this.baseAttachment = _classPrivateFieldGet(this, _blenderEffect).baseAttachment;
    this.baseAttachmentView = _classPrivateFieldGet(this, _blenderEffect).baseAttachmentView;
  }
}
_defineProperty(PostEffect_Bloom, "vertexShaderGLSL", BasePostEffect.vertexShaderGLSL);
_defineProperty(PostEffect_Bloom, "fragmentShaderGLSL", BasePostEffect.fragmentShaderGLSL);
_defineProperty(PostEffect_Bloom, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Bloom, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_Bloom, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Bloom, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

/*
  *    RedGPU - MIT License
  *    Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
  *    issue : https://github.com/redcamel/RedGPU/issues
  *    Last modification time of this file - 2020.3.26 16:12:51
  *
  */
class PostEffect_Blur extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
  }
}
_defineProperty(PostEffect_Blur, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position * 2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_Blur, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	vec4 finalColor;
	vec2 px;
	float t = 1.0;
	void main() {
		px = vec2(t/systemUniforms.resolution.x, t/systemUniforms.resolution.y);
		finalColor = vec4(0.0);
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2(-7.0 * px.x, -7.0 * px.y) ) * 0.0044299121055113265;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2(-6.0 * px.x, -6.0 * px.y) ) * 0.00895781211794;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2(-5.0 * px.x, -5.0 * px.y) ) * 0.0215963866053;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2(-4.0 * px.x, -4.0 * px.y) ) * 0.0443683338718;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2(-3.0 * px.x, -3.0 * px.y) ) * 0.0776744219933;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2(-2.0 * px.x, -2.0 * px.y) ) * 0.115876621105;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2(-1.0 * px.x, -1.0 * px.y) ) * 0.147308056121;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV                             ) * 0.159576912161;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2( 1.0 * px.x,  1.0 * px.y) ) * 0.147308056121;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2( 2.0 * px.x,  2.0 * px.y) ) * 0.115876621105;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2( 3.0 * px.x,  3.0 * px.y) ) * 0.0776744219933;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2( 4.0 * px.x,  4.0 * px.y) ) * 0.0443683338718;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2( 5.0 * px.x,  5.0 * px.y) ) * 0.0215963866053;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2( 6.0 * px.x,  6.0 * px.y) ) * 0.00895781211794;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + vec2( 7.0 * px.x,  7.0 * px.y) ) * 0.0044299121055113265;
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_Blur, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Blur, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_Blur, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Blur, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$i = new Float32Array(1);
class PostEffect_ZoomBlur extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_centerX", 0);
    _defineProperty(this, "_centerY", 0);
    _defineProperty(this, "_amount", 38);
  }
  get centerX() {
    return this._centerX;
  }
  set centerX(value) {
    this._centerX = value;
    float1_Float32Array$i[0] = this._centerX;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerX'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerX'], float1_Float32Array$i);
  }
  get centerY() {
    return this._centerY;
  }
  set centerY(value) {
    this._centerY = value;
    float1_Float32Array$i[0] = this._centerY;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerY'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerY'], float1_Float32Array$i);
  }
  get amount() {
    return this._amount;
  }
  set amount(value) {
    /*FIXME - min: 1, max: 100*/
    this._amount = value;
    float1_Float32Array$i[0] = this._amount;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['amount'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['amount'], float1_Float32Array$i);
  }
  get radius() {
    return this._radius;
  }
}
_defineProperty(PostEffect_ZoomBlur, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		vNormal = normal;
		vUV = uv;
		gl_Position = vec4(position*2.0,1.0);
	}
	`);
_defineProperty(PostEffect_ZoomBlur, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float centerX;
        float centerY;
        float amount;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	
	float random(vec3 scale, float seed) {
		return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
	}

	void main() {
		vec4 finalColor = vec4(0.0);
		vec2 center = vec2( fragmentUniforms.centerX + 0.5, -fragmentUniforms.centerY + 0.5 );
		vec2 toCenter = center - vUV ;
		float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
		float total = 0.0;
		
		for (float t = 0.0; t <= 30.0; t++) {
			float percent = (t + offset) / 30.0;
			float weight = 3.0 * (percent - percent * percent);
			vec4 color = texture( sampler2D( uSourceTexture, uSampler ), vUV + toCenter * percent * fragmentUniforms.amount / 100.0 );
			color.rgb *= color.a;
			finalColor += color * weight;
			total += weight;
		}
		finalColor = finalColor / total;
		finalColor.rgb /= finalColor.a + 0.00001;
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_ZoomBlur, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_ZoomBlur, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_ZoomBlur, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_ZoomBlur, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'centerX'
}, {
  size: TypeSize.float32,
  valueName: 'centerY'
}, {
  size: TypeSize.float32,
  valueName: 'amount'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$j = new Float32Array(1);
class PostEffect_DoF_blend extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "blurTexture", void 0);
    _defineProperty(this, "depthTexture", void 0);
    _defineProperty(this, "_focusLength", 15);
  }
  get focusLength() {
    return this._focusLength;
  }
  set focusLength(value) {
    this._focusLength = value;
    float1_Float32Array$j[0] = this._focusLength;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['focusLength'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['focusLength'], float1_Float32Array$j);
  }
  resetBindingInfo() {
    this.entries = [{
      binding: 0,
      resource: {
        buffer: this.uniformBuffer_fragment.GPUBuffer,
        offset: 0,
        size: this.uniformBufferDescriptor_fragment.size
      }
    }, {
      binding: 1,
      resource: this.sampler.GPUSampler
    }, {
      binding: 2,
      resource: this.sourceTexture
    }, {
      binding: 3,
      resource: this.blurTexture
    }, {
      binding: 4,
      resource: this.depthTexture
    }];
    this._afterResetBindingInfo();
  }
}
_defineProperty(PostEffect_DoF_blend, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		gl_Position = vec4(position*2.0,1.0);
		vNormal = normal;
		vUV = uv;
	}
	`);
_defineProperty(PostEffect_DoF_blend, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float focusLength;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uBlurTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform texture2D uDepthTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor;
		vec4 blurColor;
		vec4 depthColor;
		diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		blurColor = texture( sampler2D( uBlurTexture, uSampler ), vUV );
		depthColor = texture( sampler2D( uDepthTexture, uSampler ), vUV );
		depthColor = depthColor * fragmentUniforms.focusLength;
		
		diffuseColor.rgb *= min(depthColor.g,1.0);
		blurColor.rgb *= max(1.0 - depthColor.g,0.0);
		outColor = diffuseColor + blurColor;
	}
`);
_defineProperty(PostEffect_DoF_blend, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_DoF_blend, "uniformsBindGroupLayoutDescriptor_material", {
  entries: [{
    binding: 0,
    visibility: GPUShaderStage.FRAGMENT,
    buffer: {
      type: 'uniform'
    }
  }, {
    binding: 1,
    visibility: GPUShaderStage.FRAGMENT,
    sampler: {
      type: 'filtering'
    }
  }, {
    binding: 2,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 3,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }, {
    binding: 4,
    visibility: GPUShaderStage.FRAGMENT,
    texture: {
      type: "float"
    }
  }]
});
_defineProperty(PostEffect_DoF_blend, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_DoF_blend, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'focusLength'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */
var _blurEffect$1 = /*#__PURE__*/new WeakMap();
var _blenderEffect$1 = /*#__PURE__*/new WeakMap();
var _blur$1 = /*#__PURE__*/new WeakMap();
var _focusLength = /*#__PURE__*/new WeakMap();
class PostEffect_DoF extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _classPrivateFieldInitSpec(this, _blurEffect$1, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _blenderEffect$1, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _blur$1, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _focusLength, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(this, _blurEffect$1, new PostEffect_GaussianBlur(redGPUContext));
    _classPrivateFieldSet(this, _blenderEffect$1, new PostEffect_DoF_blend(redGPUContext));
    this.blur = 5;
    this.focusLength = 15;
  }
  get blur() {
    return _classPrivateFieldGet(this, _blur$1);
  }
  set blur(value) {
    _classPrivateFieldSet(this, _blur$1, value);
    _classPrivateFieldGet(this, _blurEffect$1).radius = value;
  }
  get focusLength() {
    return _classPrivateFieldGet(this, _focusLength);
  }
  set focusLength(value) {
    _classPrivateFieldSet(this, _focusLength, value);
    _classPrivateFieldGet(this, _blenderEffect$1).focusLength = value;
  }
  render(redGPUContext, redView, renderScene, sourceTextureView) {
    this.checkSize(redGPUContext, redView);
    _classPrivateFieldGet(this, _blurEffect$1).render(redGPUContext, redView, renderScene, sourceTextureView);
    _classPrivateFieldGet(this, _blenderEffect$1).blurTexture = _classPrivateFieldGet(this, _blurEffect$1).baseAttachmentView;
    _classPrivateFieldGet(this, _blenderEffect$1).depthTexture = redView.baseAttachment_mouseColorID_depth_ResolveTargetView;
    _classPrivateFieldGet(this, _blenderEffect$1).render(redGPUContext, redView, renderScene, sourceTextureView);
    this.baseAttachment = _classPrivateFieldGet(this, _blenderEffect$1).baseAttachment;
    this.baseAttachmentView = _classPrivateFieldGet(this, _blenderEffect$1).baseAttachmentView;
  }
}
_defineProperty(PostEffect_DoF, "vertexShaderGLSL", `
		${ShareGLSL.GLSL_VERSION}
		void main() {}
	`);
_defineProperty(PostEffect_DoF, "fragmentShaderGLSL", `
		${ShareGLSL.GLSL_VERSION}
		void main() {}
	`);
_defineProperty(PostEffect_DoF, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_DoF, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_DoF, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_DoF, "uniformBufferDescriptor_fragment", BaseMaterial.uniformBufferDescriptor_empty);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$k = new Float32Array(1);
class PostEffect_HalfTone extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_centerX", 0);
    _defineProperty(this, "_centerY", 0);
    _defineProperty(this, "_angle", 0);
    _defineProperty(this, "_radius", 2);
    _defineProperty(this, "_grayMode", false);
  }
  get centerX() {
    return this._centerX;
  }
  set centerX(value) {
    this._centerX = value;
    float1_Float32Array$k[0] = this._centerX;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerX'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerX'], float1_Float32Array$k);
  }
  get centerY() {
    return this._centerY;
  }
  set centerY(value) {
    this._centerY = value;
    float1_Float32Array$k[0] = this._centerY;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerY'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['centerY'], float1_Float32Array$k);
  }
  get angle() {
    return this._angle;
  }
  set angle(value) {
    this._angle = value;
    float1_Float32Array$k[0] = this._angle;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['angle'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['angle'], float1_Float32Array$k);
  }
  get radius() {
    return this._radius;
  }
  set radius(value) {
    this._radius = value;
    float1_Float32Array$k[0] = this._radius;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['radius'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['radius'], float1_Float32Array$k);
  }
  get grayMode() {
    return this._grayMode;
  }
  set grayMode(value) {
    this._grayMode = value;
    float1_Float32Array$k[0] = this._grayMode ? 1 : 0;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['grayMode'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['grayMode'], float1_Float32Array$k);
  }
}
_defineProperty(PostEffect_HalfTone, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		vNormal = normal;
		vUV = uv;
		gl_Position = vec4(position*2.0,1.0);
	}
	`);
_defineProperty(PostEffect_HalfTone, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float centerX;
        float centerY;
        float angle;
        float radius;
        float grayMode;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	
	float pattern(float angle) {
		angle = angle * 3.141592653589793/180.0;
		float s = sin(angle), c = cos(angle);
		vec2 tex = vUV;
		tex.x -= fragmentUniforms.centerX + 0.5;
		tex.y -= fragmentUniforms.centerY + 0.5;
		vec2 point = vec2(
			c * tex.x - s * tex.y,
			s * tex.x + c * tex.y
		) * systemUniforms.resolution /fragmentUniforms.radius;
		return (sin(point.x) * sin(point.y)) * 4.0;
	}

	void main() {
		vec4 finalColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		if(fragmentUniforms.grayMode == 1.0) {
			float average = (finalColor.r + finalColor.g + finalColor.b) / 3.0;
			finalColor = vec4(vec3(average * 10.0 - 5.0 + pattern(fragmentUniforms.angle)), finalColor.a);
		}else{
			vec3 cmy = 1.0 - finalColor.rgb;
			float k = min(cmy.x, min(cmy.y, cmy.z));
			cmy = (cmy - k) / (1.0 - k);
			cmy = clamp(cmy * 10.0 - 3.0 + vec3(pattern(fragmentUniforms.angle + 0.26179), pattern(fragmentUniforms.angle + 1.30899), pattern(fragmentUniforms.angle)), 0.0, 1.0);
			k = clamp(k * 10.0 - 5.0 + pattern(fragmentUniforms.angle + 0.78539), 0.0, 1.0);
			finalColor = vec4(1.0 - cmy - k, finalColor.a);
		}
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_HalfTone, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_HalfTone, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_HalfTone, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_HalfTone, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'centerX'
}, {
  size: TypeSize.float32,
  valueName: 'centerY'
}, {
  size: TypeSize.float32,
  valueName: 'angle'
}, {
  size: TypeSize.float32,
  valueName: 'radius'
}, {
  size: TypeSize.float32,
  valueName: 'grayMode'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$l = new Float32Array(1);
class PostEffect_Pixelize extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_width", 5);
    _defineProperty(this, "_height", 5);
  }
  get width() {
    return this._width;
  }
  set width(value) {
    /*FIXME min: 0*/
    this._width = value;
    float1_Float32Array$l[0] = this._width;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['width'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['width'], float1_Float32Array$l);
  }
  get height() {
    return this._height;
  }
  set height(value) {
    /*FIXME min: 0*/
    this._height = value;
    float1_Float32Array$l[0] = this._height;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['height'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['height'], float1_Float32Array$l);
  }
}
_defineProperty(PostEffect_Pixelize, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		vNormal = normal;
		vUV = uv;
		gl_Position = vec4(position*2.0,1.0);
	}
	`);
_defineProperty(PostEffect_Pixelize, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float width;
        float height;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 finalColor;
		float dx = 1.0/systemUniforms.resolution.x * fragmentUniforms.width;
		float dy = 1.0/systemUniforms.resolution.y * fragmentUniforms.height;
		vec2 coord = vec2(
			dx * (floor(vUV.x / dx) + 0.5),
			dy * (floor(vUV.y / dy) + 0.5)
		);
		finalColor = texture( sampler2D( uSourceTexture, uSampler ), coord );
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_Pixelize, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Pixelize, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_Pixelize, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Pixelize, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'width'
}, {
  size: TypeSize.float32,
  valueName: 'height'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$m = new Float32Array(1);
class PostEffect_Convolution extends BasePostEffect {
  constructor(redGPUContext, kernel = PostEffect_Convolution.NORMAL) {
    super(redGPUContext);
    _defineProperty(this, "_kernel", void 0);
    _defineProperty(this, "_kernelWeight", void 0);
    this.kernel = kernel;
    console.log(this.uniformBufferDescriptor_fragment);
  }
  get kernel() {
    return this._kernel;
  }
  set kernel(value) {
    this._kernel = value;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernel'], this._kernel);
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernel'], this._kernel);
    this.kernelWeight = 1;
  }
  get kernelWeight() {
    return this._kernelWeight;
  }
  set kernelWeight(value) {
    let sum = 0;
    let i = this._kernel.length;
    while (i--) sum += this._kernel[i];
    this._kernelWeight = sum;
    float1_Float32Array$m[0] = sum;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernelWeight'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['kernelWeight'], float1_Float32Array$m);
  }
}
_defineProperty(PostEffect_Convolution, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vTime;
	void main() {
		vNormal = normal;
		vUV = uv;
		vTime = systemUniforms.time;
		gl_Position = vec4(position*2.0,1.0);
	}
	`);
_defineProperty(PostEffect_Convolution, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float kernelWeight;
        mat3 kernel;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vTime;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	
	void main() {

		vec2 perPX = vec2(1.0/systemUniforms.resolution.x, 1.0/systemUniforms.resolution.y);
		vec4 finalColor = vec4(0.0);
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2(-1.0, -1.0)) * fragmentUniforms.kernel[0][0] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 0.0, -1.0)) * fragmentUniforms.kernel[0][1] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 1.0, -1.0)) * fragmentUniforms.kernel[0][2] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2(-1.0,  0.0)) * fragmentUniforms.kernel[1][0] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 0.0,  0.0)) * fragmentUniforms.kernel[1][1] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 1.0,  0.0)) * fragmentUniforms.kernel[1][2] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2(-1.0,  1.0)) * fragmentUniforms.kernel[2][0] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 0.0,  1.0)) * fragmentUniforms.kernel[2][1] ;
		finalColor += texture( sampler2D( uSourceTexture, uSampler ), vUV + perPX * vec2( 1.0,  1.0)) * fragmentUniforms.kernel[2][2] ;
	
		outColor = vec4((finalColor / fragmentUniforms.kernelWeight).rgb, 1.0);
	}
`);
_defineProperty(PostEffect_Convolution, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Convolution, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_Convolution, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Convolution, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'kernelWeight'
}, {
  size: TypeSize.mat3,
  valueName: 'kernel'
}]);
_defineProperty(PostEffect_Convolution, "NORMAL", new Float32Array([0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]));
_defineProperty(PostEffect_Convolution, "SHARPEN", new Float32Array([0, -1, 0, 0, -1, 5, -1, 0, 0, -1, 0, 0]));
_defineProperty(PostEffect_Convolution, "BLUR", new Float32Array([1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0]));
_defineProperty(PostEffect_Convolution, "EDGE", new Float32Array([0, 1, 0, 0, 1, -4, 1, 0, 0, 1, 0, 0]));
_defineProperty(PostEffect_Convolution, "EMBOSS", new Float32Array([-2, -1, 0, 0, -1, 1, 1, 0, 0, 1, 2, 0]));

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$n = new Float32Array(1);
class PostEffect_Film extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_scanlineIntensity", 0.5);
    _defineProperty(this, "_noiseIntensity", 0.5);
    _defineProperty(this, "_scanlineCount", 2048);
    _defineProperty(this, "_grayMode", false);
  }
  get scanlineIntensity() {
    return this._scanlineIntensity;
  }
  set scanlineIntensity(value) {
    this._scanlineIntensity = value;
    float1_Float32Array$n[0] = this._scanlineIntensity;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['scanlineIntensity'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['scanlineIntensity'], float1_Float32Array$n);
  }
  get noiseIntensity() {
    return this._noiseIntensity;
  }
  set noiseIntensity(value) {
    this._noiseIntensity = value;
    float1_Float32Array$n[0] = this._noiseIntensity;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['noiseIntensity'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['noiseIntensity'], float1_Float32Array$n);
  }
  get scanlineCount() {
    return this._scanlineCount;
  }
  set scanlineCount(value) {
    /*FIXME - min: 1, max: 100*/
    this._scanlineCount = value;
    float1_Float32Array$n[0] = this._scanlineCount;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['scanlineCount'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['scanlineCount'], float1_Float32Array$n);
  }
  get grayMode() {
    return this._grayMode;
  }
  set grayMode(value) {
    this._grayMode = value;
    float1_Float32Array$n[0] = this._grayMode ? 1 : 0;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['grayMode'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['grayMode'], float1_Float32Array$n);
  }
}
_defineProperty(PostEffect_Film, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vTime;
	void main() {
		vNormal = normal;
		vUV = uv;
		vTime = systemUniforms.time;
		gl_Position = vec4(position*2.0,1.0);
	}
	`);
_defineProperty(PostEffect_Film, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float scanlineIntensity;
        float noiseIntensity;
        float scanlineCount;
        float grayMode;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vTime;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	
	float random(vec3 scale, float seed) {
		return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
	}

	void main() {

		vec4 diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );

		// make some noise
		float x = vUV.x * vUV.y * vTime;
		x = mod( x, 13.0 ) * mod( x, 123.0 );
		float dx = mod( x, 0.01 );
		
		// add noise
		vec3 finalColor = diffuseColor.rgb + diffuseColor.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );
		
		// get us a sine and cosine
		vec2 sc = vec2( sin( vUV.y * fragmentUniforms.scanlineCount ), cos( vUV.y * fragmentUniforms.scanlineCount ) );
		
		// add scanlines
		finalColor += diffuseColor.rgb * vec3( sc.x, sc.y, sc.x ) * fragmentUniforms.scanlineIntensity;
		
		// interpolate between source and result by intensity
		finalColor = diffuseColor.rgb + clamp( fragmentUniforms.noiseIntensity, 0.0, 1.0 ) * ( finalColor - diffuseColor.rgb );
		
		// convert to grayscale if desired
		if(fragmentUniforms.grayMode == 1.0) finalColor = vec3( finalColor.r * 0.3 + finalColor.g * 0.59 + finalColor.b * 0.11 );
		outColor = vec4( finalColor, diffuseColor.a );
	}
`);
_defineProperty(PostEffect_Film, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Film, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_Film, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Film, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'scanlineIntensity'
}, {
  size: TypeSize.float32,
  valueName: 'noiseIntensity'
}, {
  size: TypeSize.float32,
  valueName: 'scanlineCount'
}, {
  size: TypeSize.float32,
  valueName: 'grayMode'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 16:12:51
 *
 */
const float1_Float32Array$o = new Float32Array(1);
class PostEffect_Vignetting extends BasePostEffect {
  constructor(redGPUContext) {
    super(redGPUContext);
    _defineProperty(this, "_intensity", 0.85);
    _defineProperty(this, "_size", 0.1);
  }
  get intensity() {
    return this._intensity;
  }
  set intensity(value) {
    this._intensity = value;
    float1_Float32Array$o[0] = this._intensity;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['intensity'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['intensity'], float1_Float32Array$o);
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = value;
    float1_Float32Array$o[0] = this._size;
    // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap['size'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap['size'], float1_Float32Array$o);
  }
}
_defineProperty(PostEffect_Vignetting, "vertexShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	void main() {
		vNormal = normal;
		vUV = uv;
		gl_Position = vec4(position*2.0,1.0);
	}
	`);
_defineProperty(PostEffect_Vignetting, "fragmentShaderGLSL", `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float intensity;
        float size;
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;

	void main() {
		vec4 finalColor = texture( sampler2D( uSourceTexture, uSampler ), vUV );
		float dist = distance(vUV, vec2(0.5, 0.5));
		finalColor.rgb *= smoothstep(0.8, fragmentUniforms.size * 0.799, dist * ( fragmentUniforms.intensity + fragmentUniforms.size ));
		outColor = finalColor;
	}
`);
_defineProperty(PostEffect_Vignetting, "PROGRAM_OPTION_LIST", {
  vertex: [],
  fragment: []
});
_defineProperty(PostEffect_Vignetting, "uniformsBindGroupLayoutDescriptor_material", BasePostEffect.uniformsBindGroupLayoutDescriptor_material);
_defineProperty(PostEffect_Vignetting, "uniformBufferDescriptor_vertex", BaseMaterial.uniformBufferDescriptor_empty);
_defineProperty(PostEffect_Vignetting, "uniformBufferDescriptor_fragment", [{
  size: TypeSize.float32,
  valueName: 'intensity'
}, {
  size: TypeSize.float32,
  valueName: 'size'
}]);

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
var _backgroundColor = /*#__PURE__*/new WeakMap();
var _backgroundColorAlpha = /*#__PURE__*/new WeakMap();
var _backgroundColorRGBA = /*#__PURE__*/new WeakMap();
var _directionalLightList = /*#__PURE__*/new WeakMap();
var _pointLightList = /*#__PURE__*/new WeakMap();
var _spotLightList = /*#__PURE__*/new WeakMap();
var _ambientLight = /*#__PURE__*/new WeakMap();
var _grid = /*#__PURE__*/new WeakMap();
var _axis = /*#__PURE__*/new WeakMap();
var _skyBox = /*#__PURE__*/new WeakMap();
class Scene extends DisplayContainer {
  constructor() {
    super();
    _classPrivateFieldInitSpec(this, _backgroundColor, {
      writable: true,
      value: '#000'
    });
    _classPrivateFieldInitSpec(this, _backgroundColorAlpha, {
      writable: true,
      value: 1
    });
    _classPrivateFieldInitSpec(this, _backgroundColorRGBA, {
      writable: true,
      value: [0, 0, 0, _classPrivateFieldGet(this, _backgroundColorAlpha)]
    });
    _classPrivateFieldInitSpec(this, _directionalLightList, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _pointLightList, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _spotLightList, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _ambientLight, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _grid, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _axis, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _skyBox, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "_flatChildList", []);
  }
  get grid() {
    return _classPrivateFieldGet(this, _grid);
  }
  set grid(value) {
    _classPrivateFieldSet(this, _grid, value);
  }
  get axis() {
    return _classPrivateFieldGet(this, _axis);
  }
  set axis(value) {
    _classPrivateFieldSet(this, _axis, value);
  }
  get skyBox() {
    return _classPrivateFieldGet(this, _skyBox);
  }
  set skyBox(value) {
    _classPrivateFieldSet(this, _skyBox, value);
  }
  get backgroundColor() {
    return _classPrivateFieldGet(this, _backgroundColor);
  }
  set backgroundColor(value) {
    _classPrivateFieldSet(this, _backgroundColor, value);
    let rgb = UTIL.hexToRGB_ZeroToOne(value);
    _classPrivateFieldSet(this, _backgroundColorRGBA, [rgb[0] * _classPrivateFieldGet(this, _backgroundColorAlpha), rgb[1] * _classPrivateFieldGet(this, _backgroundColorAlpha), rgb[2] * _classPrivateFieldGet(this, _backgroundColorAlpha), _classPrivateFieldGet(this, _backgroundColorAlpha)]);
  }
  get backgroundColorAlpha() {
    return _classPrivateFieldGet(this, _backgroundColorAlpha);
  }
  set backgroundColorAlpha(value) {
    _classPrivateFieldSet(this, _backgroundColorAlpha, value);
    let rgb = UTIL.hexToRGB_ZeroToOne(_classPrivateFieldGet(this, _backgroundColor));
    _classPrivateFieldSet(this, _backgroundColorRGBA, [rgb[0] * _classPrivateFieldGet(this, _backgroundColorAlpha), rgb[1] * _classPrivateFieldGet(this, _backgroundColorAlpha), rgb[2] * _classPrivateFieldGet(this, _backgroundColorAlpha), _classPrivateFieldGet(this, _backgroundColorAlpha)]);
  }
  get backgroundColorRGBA() {
    return _classPrivateFieldGet(this, _backgroundColorRGBA);
  }
  get directionalLightList() {
    return _classPrivateFieldGet(this, _directionalLightList);
  }
  get pointLightList() {
    return _classPrivateFieldGet(this, _pointLightList);
  }
  get ambientLight() {
    return _classPrivateFieldGet(this, _ambientLight);
  }
  get spotLightList() {
    return _classPrivateFieldGet(this, _spotLightList);
  }
  addLight(light) {
    switch (light.constructor) {
      case DirectionalLight:
        if (_classPrivateFieldGet(this, _directionalLightList).length === ShareGLSL.MAX_DIRECTIONAL_LIGHT) UTIL.throwFunc(`addLight : DirectionalLight - Up to ${ShareGLSL.MAX_DIRECTIONAL_LIGHT} are allowed.`);
        _classPrivateFieldGet(this, _directionalLightList).push(light);
        break;
      case PointLight:
        if (_classPrivateFieldGet(this, _pointLightList).length === ShareGLSL.MAX_POINT_LIGHT) UTIL.throwFunc(`addLight : PointLight - Up to ${ShareGLSL.MAX_POINT_LIGHT} are allowed.`);
        _classPrivateFieldGet(this, _pointLightList).push(light);
        break;
      case SpotLight:
        UTIL.throwFunc(`addLight : spotLightList -아직사용할 수없는 유형의 라이트`);
        // if (this.#spotLightList.length === ShareGLSL.MAX_SPOT_LIGHT) UTIL.throwFunc(`addLight : spotLightList - Up to ${ShareGLSL.MAX_SPOT_LIGHT} are allowed.`);
        // this.#spotLightList.push(light);
        break;
      case AmbientLight:
        _classPrivateFieldSet(this, _ambientLight, light);
        break;
      default:
        UTIL.throwFunc(`addLight : only allow BaseLight Instance - inputValue : ${light} { type : ${typeof light} }`);
    }
  }
  removeLight(light) {
    let tIndex;
    switch (light.constructor) {
      case DirectionalLight:
        tIndex = _classPrivateFieldGet(this, _directionalLightList).indexOf(light);
        if (tIndex > -1) _classPrivateFieldGet(this, _directionalLightList).splice(tIndex, 1);
        break;
      case PointLight:
        tIndex = _classPrivateFieldGet(this, _pointLightList).indexOf(light);
        if (tIndex > -1) _classPrivateFieldGet(this, _pointLightList).splice(tIndex, 1);
        break;
      case SpotLight:
        // tIndex = this.#spotLightList.indexOf(light);
        // if (tIndex > -1) this.#spotLightList.splice(tIndex, 1);
        break;
      case AmbientLight:
        _classPrivateFieldSet(this, _ambientLight, null);
        break;
      default:
        UTIL.throwFunc(`removeLight : only allow BaseLight Instance - inputValue : ${light} { type : ${typeof light} }`);
    }
  }
  removeLightAll() {
    _classPrivateFieldGet(this, _directionalLightList).length = 0;
    _classPrivateFieldGet(this, _pointLightList).length = 0;
    _classPrivateFieldGet(this, _spotLightList).length = 0;
    _classPrivateFieldSet(this, _ambientLight, null);
  }
}

/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
const RedGPU = {
  glMatrix: t,
  // base
  DetectorGPU,
  UUID,
  Mix,
  baseGeometry,
  BaseLight,
  BaseMaterial,
  DisplayContainer,
  BaseObject3D,
  ShareGLSL,
  BasePostEffect,
  BaseTexture,
  PipelineBasic,
  // buffer ///////////////////////////////////////////////////////////////////////
  BindGroup,
  Buffer,
  UniformBuffer,
  UniformBufferDescriptor,
  // controller ///////////////////////////////////////////////////////////////////////
  Camera2D,
  Camera3D,
  ObitController,
  // geometry ///////////////////////////////////////////////////////////////////////
  Geometry,
  InterleaveInfo,
  // light ///////////////////////////////////////////////////////////////////////
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  // loader ///////////////////////////////////////////////////////////////////////
  GLTFLoader: GLTFLoader$1,
  TextureLoader,
  // material ///////////////////////////////////////////////////////////////////////
  GridMaterial,
  PBRMaterial_System,
  SkyBoxMaterial,
  BitmapMaterial,
  ColorMaterial,
  ColorPhongMaterial,
  ColorPhongTextureMaterial,
  SpriteSheetAction,
  SpriteSheetMaterial,
  Sprite3DMaterial,
  EnvironmentMaterial,
  RefractionMaterial,
  StandardMaterial,
  // object3D ///////////////////////////////////////////////////////////////////////
  Axis,
  Grid,
  Mesh,
  SkyBox,
  Sprite3D,
  Text,
  Line,
  // particle /////////////////////////////////////////////////////////////////////////
  Particle,
  // postEffect ///////////////////////////////////////////////////////////////////////
  PostEffect_BrightnessContrast,
  PostEffect_Gray,
  PostEffect_HueSaturation,
  PostEffect_Invert,
  PostEffect_Threshold,
  PostEffect_Bloom,
  PostEffect_Bloom_blend,
  PostEffect_Blur,
  PostEffect_BlurX,
  PostEffect_BlurY,
  PostEffect_GaussianBlur,
  PostEffect_ZoomBlur,
  PostEffect_DoF,
  PostEffect_DoF_blend,
  PostEffect_HalfTone,
  PostEffect_Pixelize,
  PostEffect,
  PostEffect_Convolution,
  PostEffect_Film,
  PostEffect_Vignetting,
  // primitives ///////////////////////////////////////////////////////////////////////
  Box,
  Cylinder,
  Plane,
  Sphere,
  // renderder ///////////////////////////////////////////////////////////////////////
  Render,
  Debugger,
  // resources ///////////////////////////////////////////////////////////////////////
  CopyBufferToTexture,
  ImageLoader,
  BitmapCubeTexture,
  BitmapTexture,
  Sampler,
  ShaderModule_GLSL,
  TypeSize,
  // util ///////////////////////////////////////////////////////////////////////
  UTILColor,
  UTILMath,
  UTIL,
  //
  RedGPUContext,
  Scene,
  View
};

export default RedGPU;
