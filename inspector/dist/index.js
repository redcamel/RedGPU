var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _instanceId, _name, _aperture, _shutterSpeed, _iso, _ev100, _useAutoExposure, _exposureDirty, _up, _viewMatrix, _x, _z, _y, _rotationX, _rotationY, _rotationZ, _fieldOfView, _nearClipping, _farClipping, _globalKeyboardActiveView, _globalKeyboardActiveController, _instanceId2, _name2, _redGPUContext, _camera, _initInfo, _lastUpdateTime, _currentDeltaTime, _currentFrameViews, _keyboardProcessedThisFrame, _hoveredView, _isDragging, _eventTypeKeys, _dragStartX, _dragStartY, _pinchStartDistance, _isMultiTouch, _getTouchDistance, _AController_instances, initListener_fn, _HD_hover, _HD_down, _HD_Move, _HD_touchPinch, _HD_up, _HD_wheel;
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React$2 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
const __vite_import_meta_env__$1 = {};
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => {
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners.clear();
  };
  const api = { setState, getState, getInitialState, subscribe, destroy };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
var withSelector = { exports: {} };
var withSelector_production = {};
var shim$2 = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React$1 = reactExports;
function is$1(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs$1 = "function" === typeof Object.is ? Object.is : is$1, useState = React$1.useState, useEffect$1 = React$1.useEffect, useLayoutEffect = React$1.useLayoutEffect, useDebugValue$2 = React$1.useDebugValue;
function useSyncExternalStore$2(subscribe, getSnapshot) {
  var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
  useLayoutEffect(
    function() {
      inst.value = value;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
    },
    [subscribe, value, getSnapshot]
  );
  useEffect$1(
    function() {
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      });
    },
    [subscribe]
  );
  useDebugValue$2(value);
  return value;
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs$1(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot) {
  return getSnapshot();
}
var shim$1 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React$1.useSyncExternalStore ? React$1.useSyncExternalStore : shim$1;
{
  shim$2.exports = useSyncExternalStoreShim_production;
}
var shimExports = shim$2.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = reactExports, shim = shimExports;
function is(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue$1 = React.useDebugValue;
withSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function() {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (void 0 !== isEqual && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot))
              return memoizedSelection = currentSelection;
          }
          return memoizedSelection = nextSnapshot;
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector(nextSnapshot);
        if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
          return memoizedSnapshot = nextSnapshot, currentSelection;
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection = nextSelection;
      }
      var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
      return [
        function() {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot ? void 0 : function() {
          return memoizedSelector(maybeGetServerSnapshot());
        }
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function() {
      inst.hasValue = true;
      inst.value = value;
    },
    [value]
  );
  useDebugValue$1(value);
  return value;
};
{
  withSelector.exports = withSelector_production;
}
var withSelectorExports = withSelector.exports;
const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(withSelectorExports);
const __vite_import_meta_env__ = {};
const { useDebugValue } = React$2;
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
let didWarnAboutEqualityFn = false;
const identity$1 = (arg) => arg;
function useStore(api, selector = identity$1, equalityFn) {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && equalityFn && !didWarnAboutEqualityFn) {
    console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
    );
    didWarnAboutEqualityFn = true;
  }
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && typeof createState !== "function") {
    console.warn(
      "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
    );
  }
  const api = typeof createState === "function" ? createStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create$1 = (createState) => createState ? createImpl(createState) : createImpl;
const useInspectorStore = create$1((set) => ({
  useDebugPanel: false,
  redGPUContext: null,
  lastUpdateTime: 0,
  fps: 0,
  avgFps: 0,
  low1Fps: 0,
  low01Fps: 0,
  frameTime: "0ms",
  totalNum3DGroups: 0,
  totalNum3DObjects: 0,
  totalNumInstances: 0,
  totalNumDrawCalls: 0,
  totalNumTriangles: 0,
  totalNumPoints: 0,
  totalUsedVideoMemory: 0,
  pixelRectArray: [0, 0, 0, 0],
  commandBatchStats: null,
  hierarchy: {},
  resourceStats: {
    bitmapTexture: { count: 0, videoMemory: 0 },
    cubeTexture: { count: 0, videoMemory: 0 },
    hdrTexture: { count: 0, videoMemory: 0 },
    uniformBuffer: { count: 0, videoMemory: 0 },
    vertexBuffer: { count: 0, videoMemory: 0 },
    indexBuffer: { count: 0, videoMemory: 0 },
    storageBuffer: { count: 0, videoMemory: 0 },
    gpuBuffer: { count: 0, videoMemory: 0 }
  },
  currentTab: "STATE",
  fpsHistory: [],
  memoryHistory: [],
  drawCallHistory: [],
  setStats: (stats) => set((state) => {
    const nextState = { ...state, ...stats };
    if (stats.fps !== void 0) {
      state.fpsHistory.push(stats.fps);
      if (state.fpsHistory.length > 100) state.fpsHistory.shift();
      nextState.fpsHistory = [...state.fpsHistory];
    }
    if (stats.totalUsedVideoMemory !== void 0) {
      state.memoryHistory.push(stats.totalUsedVideoMemory);
      if (state.memoryHistory.length > 100) state.memoryHistory.shift();
      nextState.memoryHistory = [...state.memoryHistory];
    }
    if (stats.totalNumDrawCalls !== void 0) {
      state.drawCallHistory.push(stats.totalNumDrawCalls);
      if (state.drawCallHistory.length > 100) state.drawCallHistory.shift();
      nextState.drawCallHistory = [...state.drawCallHistory];
    }
    return nextState;
  }),
  setUseDebugPanel: (value) => set({ useDebugPanel: value }),
  setRedGPUContext: (value) => set({ redGPUContext: value }),
  setCurrentTab: (tab) => set({ currentTab: tab })
}));
const THEME = {
  fontFamily: "",
  fontSize: {
    title: "12px",
    content: "11px",
    small: "11px"
  },
  colors: {
    primary: "#fdb48d",
    label: "#888",
    value: "#ccc",
    background: "#111",
    border: "rgba(255,255,255,0.1)",
    activeBg: "rgba(253, 180, 141, 0.1)"
  }
};
const COMMON_STYLES = {
  label: {
    color: THEME.colors.label
  },
  value: {
    color: THEME.colors.value,
    textAlign: "right",
    wordBreak: "break-all",
    marginLeft: "10px"
  },
  toggleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "14px",
    height: "14px",
    border: `1px solid ${THEME.colors.primary}`,
    borderRadius: "3px",
    fontSize: "12px",
    fontWeight: "bold",
    color: THEME.colors.primary,
    lineHeight: "14px",
    background: "rgba(0,0,0,0.3)",
    flexShrink: 0
  }
};
const MiniGraph = reactExports.memo(({
  data,
  width = "100%",
  height = 40,
  color = THEME.colors.primary,
  label,
  valueDisplay
}) => {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w2 = rect.width;
    const h = rect.height;
    if (canvas.width !== w2 * dpr || canvas.height !== h * dpr) {
      canvas.width = w2 * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w2, h);
    if (data.length < 2) return;
    const dataLen = data.length;
    let max = -Infinity;
    let min = Infinity;
    for (let i = 0; i < dataLen; i++) {
      if (data[i] > max) max = data[i];
      if (data[i] < min) min = data[i];
    }
    max = max * 1.1 || 1;
    min = min * 0.9 || 0;
    const range = max - min;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    const step = w2 / (dataLen - 1);
    for (let i = 0; i < dataLen; i++) {
      const x2 = i * step;
      const y2 = h - (data[i] - min) / range * h;
      if (i === 0) ctx.moveTo(x2, y2);
      else ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    ctx.lineTo(w2, h);
    ctx.lineTo(0, h);
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    const rgbaColor = color.startsWith("#") ? hexToRgba(color, 0.2) : color;
    gradient.addColorStop(0, rgbaColor);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [data, color]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "12px" }, children: [
    (label || valueDisplay) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: headerStyle$5, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: labelStyle$2, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...valueStyle, color }, children: valueDisplay })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "canvas",
      {
        ref: canvasRef,
        style: {
          width,
          height,
          display: "block",
          borderRadius: "2px",
          border: "1px solid rgba(255,255,255,0.1)"
        }
      }
    )
  ] });
});
const hexCache = {};
const hexToRgba = (hex, alpha) => {
  const key = hex + alpha;
  if (hexCache[key]) return hexCache[key];
  let r2 = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r2 = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r2 = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  const result = `rgba(${r2}, ${g}, ${b}, ${alpha})`;
  hexCache[key] = result;
  return result;
};
const headerStyle$5 = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "10px",
  marginBottom: "4px",
  fontFamily: 'monospace, "Courier New", courier',
  fontVariantNumeric: "tabular-nums"
};
const labelStyle$2 = {
  color: "#888"
};
const valueStyle = {
  fontWeight: "bold"
};
const consoleAndThrowError = (...arg) => {
  const msg = Array.prototype.slice.call(arg).join(" ");
  console.log("//////////////////////////////////////////////////////////");
  console.log(msg);
  throw new Error(msg);
};
const formatBytes = (bytes, decimals = 2) => {
  if (typeof bytes !== "number" || bytes < 0 || Number.isNaN(bytes) || !Number.isInteger(bytes)) {
    consoleAndThrowError("Invalid input: 'bytes' must be a uint");
  }
  if (bytes === 0)
    return "0 Bytes";
  const k2 = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k2));
  return parseFloat((bytes / Math.pow(k2, i)).toFixed(dm)) + " " + sizes[i];
};
const ToggleButton = ({
  isExpanded,
  onClick,
  visible = true,
  style
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onClick,
      style: {
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        visibility: visible ? "visible" : "hidden",
        flexShrink: 0,
        ...style
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: COMMON_STYLES.toggleButton, children: isExpanded ? "-" : "+" })
    }
  );
};
class FPSMeter {
  constructor() {
    __publicField(this, "previousTimeStamp", 0);
    __publicField(this, "frameCount", 0);
    __publicField(this, "frameTimesRaw", []);
    __publicField(this, "recentFrameTimes", []);
    __publicField(this, "maxFrameTimeBuffer", 1200);
    __publicField(this, "recentFrameTimeWindow", 10);
    __publicField(this, "initializationFrames", 60);
  }
  /**
   * [KO] 새로운 타임스탬프를 기반으로 통계를 업데이트합니다.
   * [EN] Updates statistics based on a new timestamp.
   */
  update(currentTime) {
    if (currentTime === 0) return null;
    if (this.frameCount === 0) {
      this.previousTimeStamp = currentTime;
      this.frameCount++;
      return null;
    }
    const deltaTime = currentTime - this.previousTimeStamp;
    this.previousTimeStamp = currentTime;
    this.frameCount++;
    const safeFrameTime = Math.min(Math.max(deltaTime, 0.1), 1e3);
    if (this.frameCount > this.initializationFrames) {
      this.frameTimesRaw.push(safeFrameTime);
      if (this.frameTimesRaw.length > this.maxFrameTimeBuffer) this.frameTimesRaw.shift();
    }
    this.recentFrameTimes.push(safeFrameTime);
    if (this.recentFrameTimes.length > this.recentFrameTimeWindow) this.recentFrameTimes.shift();
    const avgRecent = this.recentFrameTimes.reduce((a, b) => a + b, 0) / this.recentFrameTimes.length;
    const fps = Math.round(1e3 / avgRecent);
    let stats = {
      fps,
      avgFps: 0,
      low1Fps: 0,
      low01Fps: 0,
      frameTime: `${safeFrameTime.toFixed(2)}ms`
    };
    if (this.frameTimesRaw.length >= 100) {
      const sorted = [...this.frameTimesRaw].sort((a, b) => b - a);
      const total = sorted.length;
      const avgTotal = this.frameTimesRaw.reduce((a, b) => a + b, 0) / total;
      stats.avgFps = Math.round(1e3 / avgTotal);
      const low1Count = Math.max(1, Math.ceil(total * 0.01));
      const low1Avg = sorted.slice(0, low1Count).reduce((a, b) => a + b, 0) / low1Count;
      stats.low1Fps = Math.round(1e3 / low1Avg);
      const low01Count = Math.max(1, Math.ceil(total * 1e-3));
      const low01Avg = sorted.slice(0, low01Count).reduce((a, b) => a + b, 0) / low01Count;
      stats.low01Fps = Math.round(1e3 / low01Avg);
    }
    return stats;
  }
}
const FPS = reactExports.memo(() => {
  const fps = useInspectorStore((state) => state.fps);
  const avgFps = useInspectorStore((state) => state.avgFps);
  const low1Fps = useInspectorStore((state) => state.low1Fps);
  const low01Fps = useInspectorStore((state) => state.low01Fps);
  const frameTime = useInspectorStore((state) => state.frameTime);
  const fpsHistory = useInspectorStore((state) => state.fpsHistory);
  const drawCallHistory = useInspectorStore((state) => state.drawCallHistory);
  const memoryHistory = useInspectorStore((state) => state.memoryHistory);
  const totalNumDrawCalls = useInspectorStore((state) => state.totalNumDrawCalls);
  const totalUsedVideoMemory = useInspectorStore((state) => state.totalUsedVideoMemory);
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: containerStyle$4, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: statsContainerStyle, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleButton,
        {
          isExpanded,
          onClick: () => setIsExpanded(!isExpanded),
          style: { paddingRight: "4px" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: fpsValueStyle, children: [
        fps,
        " FPS"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: frameTimeValueStyle, children: [
        "(",
        frameTime,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: avgFpsStyle, children: [
        "Avg: ",
        avgFps
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: miniDividerStyle }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: low1FpsStyle, children: [
        "1%: ",
        low1Fps
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: miniDividerStyle }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: low01FpsStyle, children: [
        "0.1%: ",
        low01Fps
      ] })
    ] }),
    isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: graphColumnStyle, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniGraph, { data: fpsHistory, height: 20, color: "#0f0", label: "FPS", valueDisplay: `${fps} FPS` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MiniGraph,
        {
          data: drawCallHistory,
          height: 20,
          color: "#4af",
          label: "Draws",
          valueDisplay: totalNumDrawCalls.toString()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MiniGraph,
        {
          data: memoryHistory,
          height: 20,
          color: "#fdb48d",
          label: "VRAM",
          valueDisplay: formatBytes(totalUsedVideoMemory)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "TODO - bundleCall" })
    ] })
  ] });
});
const containerStyle$4 = {
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  background: "#000"
};
const statsContainerStyle = {
  padding: "8px 12px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "11px",
  justifyContent: "flex-start",
  flexWrap: "wrap",
  fontFamily: 'monospace, "Courier New", courier',
  fontVariantNumeric: "tabular-nums"
};
const graphColumnStyle = {
  display: "flex",
  flexDirection: "column",
  padding: "0 12px 8px 12px",
  gap: "4px"
};
const miniDividerStyle = {
  width: "1px",
  height: "10px",
  background: "rgba(255,255,255,0.2)",
  margin: "0 2px"
};
const fpsValueStyle = {
  color: "#0f0",
  fontWeight: "bold",
  fontSize: "12px",
  textAlign: "left"
};
const frameTimeValueStyle = {
  color: "#888",
  fontSize: "10px",
  minWidth: "65px",
  textAlign: "left"
};
const avgFpsStyle = {
  color: "#4af",
  minWidth: "50px"
};
const low1FpsStyle = {
  color: "#fa0",
  minWidth: "45px"
};
const low01FpsStyle = {
  color: "#f50"
};
const Section = reactExports.memo(({ title, subTitle, children, isExpanded, onToggle }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle$1, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: { ...sectionTitleContainerStyle, cursor: onToggle ? "pointer" : "default" },
      onClick: onToggle,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }, children: [
          onToggle && /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleButton, { isExpanded: !!isExpanded }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: sectionTitleStyle$1, children: title })
        ] }),
        subTitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: sectionSubTitleStyle, children: subTitle })
      ]
    }
  ),
  (!onToggle || isExpanded) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: contentAreaStyle$2, children })
] }));
const sectionStyle$1 = {
  marginBottom: "16px"
};
const sectionTitleContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${THEME.colors.primary}33`,
  marginBottom: "8px",
  paddingBottom: "4px",
  userSelect: "none"
};
const sectionTitleStyle$1 = {
  fontSize: THEME.fontSize.title,
  color: THEME.colors.primary,
  fontWeight: "bold",
  fontFamily: THEME.fontFamily,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};
const sectionSubTitleStyle = {
  fontSize: "11px",
  color: "#888",
  fontStyle: "italic",
  fontWeight: "normal",
  marginLeft: "8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flexShrink: 0
};
const contentAreaStyle$2 = {
  padding: "0 2px"
};
const StatItem = reactExports.memo(({ label, value, color = THEME.colors.value, isBold = false }) => {
  const isZero = value === 0 || value === "0";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...statItemStyle$2, opacity: isZero ? 0.3 : 1 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: COMMON_STYLES.label, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      ...COMMON_STYLES.value,
      color,
      fontWeight: isBold ? "bold" : "normal"
    }, children: value !== void 0 && value !== null ? value : "N/A" })
  ] });
});
const statItemStyle$2 = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "4px",
  fontSize: THEME.fontSize.content,
  fontFamily: THEME.fontFamily
};
const TotalState = reactExports.memo(() => {
  const totalNum3DGroups = useInspectorStore((state) => state.totalNum3DGroups);
  const totalNum3DObjects = useInspectorStore((state) => state.totalNum3DObjects);
  const totalNumInstances = useInspectorStore((state) => state.totalNumInstances);
  const totalNumDrawCalls = useInspectorStore((state) => state.totalNumDrawCalls);
  const totalNumTriangles = useInspectorStore((state) => state.totalNumTriangles);
  const totalNumPoints = useInspectorStore((state) => state.totalNumPoints);
  const totalUsedVideoMemory = useInspectorStore((state) => state.totalUsedVideoMemory);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Total State", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Groups", value: totalNum3DGroups }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Objects", value: totalNum3DObjects }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Instances", value: totalNumInstances }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Draw Calls", value: totalNumDrawCalls, color: "#fdb48d", isBold: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Triangles", value: totalNumTriangles.toLocaleString() }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Points", value: totalNumPoints.toLocaleString() }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Video Memory", value: formatBytes(totalUsedVideoMemory), color: "#fdb48d", isBold: true })
  ] });
});
const StatRGBAItem = reactExports.memo(({ label, value }) => {
  const [r2, g, b] = value;
  const compColor = `rgb(${255 - r2}, ${255 - g}, ${255 - b})`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: statItemStyle$1, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: COMMON_STYLES.label, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      ...COMMON_STYLES.value,
      backgroundColor: `rgba(${value.join(", ")})`,
      color: compColor,
      padding: "2px 4px"
    }, children: value.join(", ") })
  ] });
});
const statItemStyle$1 = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "4px",
  fontSize: THEME.fontSize.content,
  fontFamily: THEME.fontFamily
};
const StatBoolItem = reactExports.memo(({
  label,
  value,
  trueLabel = "TRUE",
  falseLabel = "FALSE"
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: statItemStyle, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: COMMON_STYLES.label, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      ...COMMON_STYLES.value,
      backgroundColor: value ? "#008000" : "#cc0000",
      color: "white",
      padding: "2px 4px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "bold",
      lineHeight: 1
    }, children: value ? trueLabel : falseLabel })
  ] });
});
const statItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "4px",
  fontSize: THEME.fontSize.content,
  fontFamily: THEME.fontFamily,
  alignItems: "center"
};
const RedGPUContextView = () => {
  const redGPUContext = useInspectorStore((state) => state.redGPUContext);
  const pixelRectArray = useInspectorStore((state) => state.pixelRectArray);
  if (!redGPUContext) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: placeholderStyle$3, children: "RedGPUContext not initialized" });
  }
  const { detector, htmlCanvas, width, height, backgroundColor, antialiasingManager } = redGPUContext;
  const adapterInfo = detector.adapterInfo;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: containerStyle$3, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "RedGPUContext Info", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Width", value: width }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Height", value: height }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "pixelRectArray", value: `[${pixelRectArray.join(", ")}]`, color: "#fdb48d" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Canvas size", value: `${htmlCanvas.clientWidth} x ${htmlCanvas.clientHeight}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Device Pixel Ratio", value: window.devicePixelRatio }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "renderScale", value: redGPUContext.renderScale }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Alpha Mode", value: redGPUContext.alphaMode }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatRGBAItem, { label: "backgroundColor", value: backgroundColor.rgba })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Antialiasing", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useMSAA", value: antialiasingManager.useMSAA }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useFXAA", value: antialiasingManager.useFXAA }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useTAA", value: antialiasingManager.useTAA })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Environment", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "devicePixelRatio", value: devicePixelRatio }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "Mobile", value: detector.isMobile, trueLabel: "Yes", falseLabel: "No" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: userAgentStyle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: labelStyle$1, children: "User Agent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: userAgentValueStyle, children: detector.userAgent })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Adapter Info", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Vendor", value: adapterInfo.vendor }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Architecture", value: adapterInfo.architecture }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Device", value: adapterInfo.device }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Description", value: adapterInfo.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "Fallback", value: detector.isFallbackAdapter, trueLabel: "Yes", falseLabel: "No" })
    ] })
  ] });
};
const containerStyle$3 = {};
const labelStyle$1 = {
  color: "#888"
};
const userAgentStyle = {
  marginTop: "8px",
  fontSize: "11px"
};
const userAgentValueStyle = {
  color: "#666",
  marginTop: "4px",
  lineHeight: "1.4",
  wordBreak: "break-all"
};
const placeholderStyle$3 = {
  padding: "20px",
  textAlign: "center",
  color: "#666",
  fontSize: "12px",
  fontStyle: "italic"
};
const CommandBatchStatsView = ({ statsProp }) => {
  const storeStats = useInspectorStore((state) => state.commandBatchStats);
  const commandBatchStats = statsProp !== void 0 ? statsProp : storeStats;
  const [expanded, setExpanded] = reactExports.useState({});
  const toggleExpanded = (phase) => {
    setExpanded((prev) => ({ ...prev, [phase]: prev[phase] === false }));
  };
  if (!commandBatchStats || Object.keys(commandBatchStats).length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: noItemStyle$2, children: "No command batch stats available." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: Object.entries(commandBatchStats).map(([phase, stats]) => {
    const totalPasses = stats["Render Passes"].count + stats["Compute Passes"].count;
    const isExpanded = expanded[phase] !== false;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Section,
      {
        title: `Batch: ${phase}`,
        subTitle: `${stats["Command Buffers"]} Buffers, ${totalPasses} Passes`,
        isExpanded,
        onToggle: () => toggleExpanded(phase),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Command Buffers", value: stats["Command Buffers"] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Render Passes", value: stats["Render Passes"].count }),
          stats["Render Passes"].list.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: listStyle, children: stats["Render Passes"].list.map((name, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: listItemStyle, children: [
            "- ",
            name
          ] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Compute Passes", value: stats["Compute Passes"].count }),
          stats["Compute Passes"].list.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: listStyle, children: stats["Compute Passes"].list.map((name, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: listItemStyle, children: [
            "- ",
            name
          ] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Raw Usages", value: stats["Raw Usages"] })
        ]
      },
      phase
    );
  }) });
};
const listStyle = {
  paddingLeft: "12px",
  marginBottom: "8px",
  fontSize: "11px",
  lineHeight: "1.4",
  color: "#666"
};
const listItemStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};
const noItemStyle$2 = {
  padding: "8px 16px",
  fontSize: "10px",
  color: "#666",
  fontStyle: "italic"
};
const formatNumber = (val, decimals = 2) => {
  if (val === void 0 || val === null) return "";
  const str = String(val);
  if (str.includes("%")) {
    const num2 = parseFloat(str);
    return isNaN(num2) ? str : `${num2.toLocaleString(void 0, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}%`;
  }
  if (str.includes("px")) {
    const num2 = parseFloat(str);
    return isNaN(num2) ? str : `${num2.toLocaleString(void 0, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}px`;
  }
  const num = parseFloat(str);
  if (isNaN(num)) return str;
  if (Number.isInteger(num)) {
    return num.toLocaleString();
  }
  return num.toLocaleString(void 0, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};
const formatTextureUsage = (usage) => {
  const labels = [];
  if (usage & 1) labels.push("COPY_SRC");
  if (usage & 2) labels.push("COPY_DST");
  if (usage & 4) labels.push("TEXTURE");
  if (usage & 8) labels.push("STORAGE");
  if (usage & 16) labels.push("ATTACHMENT");
  return labels.join(", ");
};
const formatBufferUsage = (usage) => {
  const labels = [];
  if (usage & 1) labels.push("MAP_READ");
  if (usage & 2) labels.push("MAP_WRITE");
  if (usage & 4) labels.push("COPY_SRC");
  if (usage & 8) labels.push("COPY_DST");
  if (usage & 16) labels.push("INDEX");
  if (usage & 32) labels.push("VERTEX");
  if (usage & 64) labels.push("UNIFORM");
  if (usage & 128) labels.push("STORAGE");
  if (usage & 256) labels.push("INDIRECT");
  if (usage & 512) labels.push("QUERY_RESOLVE");
  return labels.join(", ");
};
async function readGPUTextureToCanvas(device, gpuTexture, canvas, layer = 0, mipLevel = 0) {
  const width = Math.max(1, gpuTexture.width >> mipLevel);
  const height = Math.max(1, gpuTexture.height >> mipLevel);
  const format = gpuTexture.format;
  const isDepth = format.startsWith("depth");
  const bytesPerPixel = getBytesPerPixel(format);
  const unpaddedBytesPerRow = width * bytesPerPixel;
  const paddedBytesPerRow = Math.ceil(unpaddedBytesPerRow / 256) * 256;
  const bufferSize = paddedBytesPerRow * height;
  const stagingBuffer = device.createBuffer({
    size: bufferSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
  });
  const commandEncoder = device.createCommandEncoder();
  commandEncoder.copyTextureToBuffer(
    {
      texture: gpuTexture,
      origin: [0, 0, layer],
      mipLevel,
      aspect: isDepth ? "depth-only" : "all"
    },
    {
      buffer: stagingBuffer,
      bytesPerRow: paddedBytesPerRow
    },
    [width, height]
  );
  device.queue.submit([commandEncoder.finish()]);
  try {
    await stagingBuffer.mapAsync(GPUMapMode.READ);
    const arrayBuffer = stagingBuffer.getMappedRange();
    const data = new Uint8Array(arrayBuffer);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.createImageData(width, height);
    if (format === "rgba8unorm" || format === "rgba8unorm-srgb") {
      for (let y2 = 0; y2 < height; y2++) {
        const srcOffset = y2 * paddedBytesPerRow;
        const dstOffset = y2 * width * 4;
        imageData.data.set(data.subarray(srcOffset, srcOffset + width * 4), dstOffset);
      }
    } else if (format === "bgra8unorm" || format === "bgra8unorm-srgb") {
      for (let y2 = 0; y2 < height; y2++) {
        for (let x2 = 0; x2 < width; x2++) {
          const srcIdx = y2 * paddedBytesPerRow + x2 * 4;
          const dstIdx = (y2 * width + x2) * 4;
          imageData.data[dstIdx] = data[srcIdx + 2];
          imageData.data[dstIdx + 1] = data[srcIdx + 1];
          imageData.data[dstIdx + 2] = data[srcIdx];
          imageData.data[dstIdx + 3] = data[srcIdx + 3];
        }
      }
    } else if (format === "rgba16float") {
      const float16Data = new Uint16Array(arrayBuffer);
      const gamma = 1 / 2.2;
      for (let y2 = 0; y2 < height; y2++) {
        for (let x2 = 0; x2 < width; x2++) {
          const srcIdx = y2 * (paddedBytesPerRow / 2) + x2 * 4;
          const dstIdx = (y2 * width + x2) * 4;
          const r2 = decodeFloat16(float16Data[srcIdx]);
          const g = decodeFloat16(float16Data[srcIdx + 1]);
          const b = decodeFloat16(float16Data[srcIdx + 2]);
          const a = decodeFloat16(float16Data[srcIdx + 3]);
          imageData.data[dstIdx] = Math.max(0, Math.min(255, Math.pow(r2, gamma) * 255));
          imageData.data[dstIdx + 1] = Math.max(0, Math.min(255, Math.pow(g, gamma) * 255));
          imageData.data[dstIdx + 2] = Math.max(0, Math.min(255, Math.pow(b, gamma) * 255));
          imageData.data[dstIdx + 3] = Math.max(0, Math.min(255, a * 255));
        }
      }
    } else if (format === "depth32float") {
      const float32Data = new Float32Array(arrayBuffer);
      for (let y2 = 0; y2 < height; y2++) {
        for (let x2 = 0; x2 < width; x2++) {
          const srcIdx = y2 * (paddedBytesPerRow / 4) + x2;
          const dstIdx = (y2 * width + x2) * 4;
          const depth = float32Data[srcIdx];
          const val = Math.max(0, Math.min(255, depth * 255));
          imageData.data[dstIdx] = val;
          imageData.data[dstIdx + 1] = val;
          imageData.data[dstIdx + 2] = val;
          imageData.data[dstIdx + 3] = 255;
        }
      }
    } else {
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      ctx.fillText(`Unsupported format: ${format}`, 10, 20);
    }
    ctx.putImageData(imageData, 0, 0);
  } finally {
    stagingBuffer.unmap();
    stagingBuffer.destroy();
  }
}
function getBytesPerPixel(format) {
  switch (format) {
    case "rgba8unorm":
    case "rgba8unorm-srgb":
    case "bgra8unorm":
    case "bgra8unorm-srgb":
      return 4;
    case "rgba16float":
      return 8;
    case "depth32float":
      return 4;
    default:
      return 4;
  }
}
function decodeFloat16(binary) {
  const exponent = (binary & 31744) >> 10;
  const fraction = binary & 1023;
  const sign = binary & 32768 ? -1 : 1;
  if (exponent === 0) return sign * Math.pow(2, -14) * (fraction / 1024);
  if (exponent === 31) return fraction ? NaN : sign * Infinity;
  return sign * Math.pow(2, exponent - 15) * (1 + fraction / 1024);
}
const TexturePreviewModal = ({ item, onClose }) => {
  var _a, _b, _c;
  const { redGPUContext } = useInspectorStore();
  const [copyFeedback, setCopyFeedback] = reactExports.useState(null);
  const [activeMipLevel, setActiveMipLevel] = reactExports.useState(0);
  const canvasRefs = reactExports.useRef([]);
  const isTexture = !!item.texture;
  if (!isTexture) return null;
  const tex = item.texture;
  const gpuTex = tex == null ? void 0 : tex.gpuTexture;
  const isBlob = item.src && item.src.startsWith("blob:") || item.srcList && ((_a = item.srcList[0]) == null ? void 0 : _a.startsWith("blob:"));
  const fileName = isBlob ? "BLOB" : item.src ? item.src.split("/").pop() : item.srcList ? item.srcList[0].split("/").pop() : null;
  const originalPath = item.src || (item.srcList ? item.srcList[0] + "..." : item.cacheKey);
  const isCube = (gpuTex == null ? void 0 : gpuTex.dimension) === "2d" && (gpuTex == null ? void 0 : gpuTex.depthOrArrayLayers) === 6;
  const isHDR = ((_b = item.src) == null ? void 0 : _b.toLowerCase().endsWith(".hdr")) || item.srcList && ((_c = item.srcList[0]) == null ? void 0 : _c.toLowerCase().endsWith(".hdr")) || (gpuTex == null ? void 0 : gpuTex.format) === "rgba16float";
  const hasSrcList = item.srcList && Array.isArray(item.srcList);
  const showMipTabs = (gpuTex == null ? void 0 : gpuTex.mipLevelCount) > 1;
  const useCanvasForCube = isCube && (!hasSrcList || isHDR || activeMipLevel > 0);
  const useCanvasForSingle = !isCube && (!item.src || isHDR || activeMipLevel > 0);
  reactExports.useEffect(() => {
    if (!redGPUContext || !gpuTex) return;
    let isMounted = true;
    const updatePreviews = async () => {
      try {
        if (useCanvasForCube) {
          for (let i = 0; i < 6; i++) {
            if (!isMounted) return;
            const canvas = canvasRefs.current[i];
            if (canvas) {
              await readGPUTextureToCanvas(redGPUContext.gpuDevice, gpuTex, canvas, i, activeMipLevel);
            }
          }
        } else if (useCanvasForSingle) {
          if (!isMounted) return;
          const canvas = canvasRefs.current[0];
          if (canvas) {
            await readGPUTextureToCanvas(redGPUContext.gpuDevice, gpuTex, canvas, 0, activeMipLevel);
          }
        }
      } catch (e) {
        if (isMounted) console.error("Failed to read GPU texture:", e);
      }
    };
    updatePreviews();
    return () => {
      isMounted = false;
    };
  }, [gpuTex, redGPUContext, item.src, item.srcList, hasSrcList, isCube, isHDR, useCanvasForCube, useCanvasForSingle, activeMipLevel]);
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`Copied ${label} path!`);
    setTimeout(() => setCopyFeedback(null), 2e3);
  };
  const cubeFaceLabels = ["Right (+X)", "Left (-X)", "Top (+Y)", "Bottom (-Y)", "Front (+Z)", "Back (-Z)"];
  const cubeFaceIndices = [2, 1, 4, 0, 3, 5];
  const gridPositions = [
    { col: 2, row: 1 },
    // Top (idx 2)
    { col: 1, row: 2 },
    // Left (idx 1)
    { col: 2, row: 2 },
    // Front (idx 4)
    { col: 3, row: 2 },
    // Right (idx 0)
    { col: 2, row: 3 },
    // Bottom (idx 3)
    { col: 2, row: 4 }
    // Back (idx 5)
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: overlayStyle$1, onClick: onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: modalStyle$1, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: headerStyle$4, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: titleStyle$1, children: fileName || "Texture Preview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: pathStyle$1, children: originalPath })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: closeButtonStyle$1, onClick: onClose, children: "×" })
      ] }),
      showMipTabs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: mipTabContainerStyle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "9px", color: "#666", fontWeight: "bold", marginRight: "8px" }, children: "MIP LEVEL:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "4px", overflowX: "auto", flex: 1, paddingBottom: "4px" }, children: Array.from({ length: gpuTex.mipLevelCount }).map((_, i) => {
          const mipW = Math.max(1, gpuTex.width >> i);
          const mipH = Math.max(1, gpuTex.height >> i);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveMipLevel(i),
              style: {
                ...mipTabButtonStyle,
                background: activeMipLevel === i ? "#fdb48d" : "rgba(255,255,255,0.05)",
                color: activeMipLevel === i ? "#000" : "#888",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "60px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "9px" }, children: [
                  "Level ",
                  i
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                  fontSize: "8px",
                  opacity: 0.8
                }, children: [
                  formatNumber(mipW, 0),
                  "x",
                  formatNumber(mipH, 0)
                ] })
              ]
            },
            i
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: contentStyle$3, children: [
        item.src && !isHDR && !isCube && activeMipLevel === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.src, style: previewImageStyle, alt: "preview" }),
        isCube && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...cubePreviewGridStyle, position: "relative" }, children: gridPositions.map((pos, i) => {
          const faceIdx = cubeFaceIndices[i];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            gridColumn: pos.col,
            gridRow: pos.row,
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: faceLabelStyle, children: cubeFaceLabels[faceIdx] }),
            hasSrcList && !isHDR && activeMipLevel === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: item.srcList[faceIdx],
                style: cubePreviewImageStyle,
                title: cubeFaceLabels[faceIdx]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "canvas",
              {
                ref: (el2) => canvasRefs.current[faceIdx] = el2,
                style: cubePreviewImageStyle
              }
            ),
            hasSrcList && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                style: faceCopyButtonStyle,
                onClick: () => handleCopy(item.srcList[faceIdx], cubeFaceLabels[faceIdx]),
                title: "Copy path",
                children: "📋"
              }
            )
          ] }, i);
        }) }),
        useCanvasForSingle && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...previewImageStyle, position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: (el2) => canvasRefs.current[0] = el2,
              style: { maxWidth: "100%", maxHeight: "500px", display: "block" }
            }
          ),
          !redGPUContext && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: noPreviewStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "40px", marginBottom: "10px" }, children: "🖼️" }),
            "No direct image preview available.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              opacity: 0.5,
              fontSize: "10px"
            }, children: "(Generated or Direct Texture)" })
          ] }) })
        ] })
      ] }),
      copyFeedback && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: toastStyle, children: copyFeedback }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: footerStyle$1, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: infoRowStyle$1, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Format: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#fdb48d" }, children: gpuTex == null ? void 0 : gpuTex.format })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Size: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "b",
              {
                style: { color: "#eee" },
                children: [
                  formatNumber(gpuTex == null ? void 0 : gpuTex.width, 0),
                  "x",
                  formatNumber(gpuTex == null ? void 0 : gpuTex.height, 0)
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: infoRowStyle$1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Dim: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: gpuTex == null ? void 0 : gpuTex.dimension })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Layers: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "b",
              {
                style: { color: "#eee" },
                children: formatNumber(gpuTex == null ? void 0 : gpuTex.depthOrArrayLayers, 0)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Mipmaps: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "b",
              {
                style: { color: "#eee" },
                children: formatNumber(gpuTex == null ? void 0 : gpuTex.mipLevelCount, 0)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Samples: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: formatNumber(gpuTex == null ? void 0 : gpuTex.sampleCount, 0) })
          ] })
        ] }) }),
        (gpuTex == null ? void 0 : gpuTex.usage) !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...infoRowStyle$1, fontSize: "10px", opacity: 0.8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Usage: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: formatTextureUsage(gpuTex.usage) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: infoRowStyle$1, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Memory: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#fdb48d" }, children: formatBytes((tex == null ? void 0 : tex.videoMemorySize) || 0) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "UUID: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { style: { opacity: 0.5 }, children: item.uuid })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const overlayStyle$1 = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1e4,
  backdropFilter: "blur(8px)",
  animation: "fadeIn 0.2s ease-out"
};
const modalStyle$1 = {
  background: "rgba(26, 26, 26, 0.95)",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.15)",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "90%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
  overflow: "hidden",
  animation: "scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
};
const headerStyle$4 = {
  padding: "16px",
  background: "rgba(255,255,255,0.03)",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px"
};
const titleStyle$1 = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#eee",
  marginBottom: "4px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};
const pathStyle$1 = {
  fontSize: "10px",
  color: "#777",
  wordBreak: "break-all",
  display: "block",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};
const closeButtonStyle$1 = {
  background: "none",
  border: "none",
  color: "#888",
  fontSize: "28px",
  cursor: "pointer",
  padding: "0 4px",
  lineHeight: "1",
  marginTop: "-4px",
  flexShrink: 0
};
const contentStyle$3 = {
  padding: "20px",
  overflow: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0a0a0a",
  minHeight: "350px"
};
const previewImageStyle = {
  maxWidth: "100%",
  maxHeight: "500px",
  objectFit: "contain",
  boxShadow: "0 0 30px rgba(0,0,0,0.8)",
  border: "1px solid rgba(255,255,255,0.1)"
};
const cubePreviewGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(4, 1fr)",
  gap: "4px",
  width: "400px",
  background: "rgba(255,255,255,0.02)",
  padding: "4px",
  borderRadius: "4px"
};
const cubePreviewImageStyle = {
  width: "100%",
  aspectRatio: "1",
  objectFit: "cover",
  display: "block"
};
const faceLabelStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  fontSize: "8px",
  padding: "2px 4px",
  zIndex: 1,
  pointerEvents: "none",
  textTransform: "uppercase"
};
const faceCopyButtonStyle = {
  position: "absolute",
  bottom: "2px",
  right: "2px",
  background: "rgba(0,0,0,0.5)",
  border: "none",
  color: "#fff",
  fontSize: "10px",
  cursor: "pointer",
  padding: "4px",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.2s"
};
const footerStyle$1 = {
  padding: "16px",
  background: "rgba(255,255,255,0.03)",
  borderTop: "1px solid rgba(255,255,255,0.1)",
  fontSize: "12px",
  color: "#999",
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};
const infoRowStyle$1 = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};
const noPreviewStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#555",
  fontSize: "13px",
  height: "100%"
};
const toastStyle = {
  position: "absolute",
  bottom: "80px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#fdb48d",
  color: "#000",
  padding: "8px 16px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  zIndex: 100,
  animation: "slideUp 0.3s ease-out"
};
const mipTabContainerStyle = {
  display: "flex",
  padding: "8px 16px",
  background: "rgba(0,0,0,0.2)",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  alignItems: "center",
  gap: "4px"
};
const mipTabButtonStyle = {
  border: "none",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s",
  flexShrink: 0
};
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
        div[style*="position: relative"]:hover button[title="Copy path"] {
            opacity: 1 !important;
        }
        button[title="Copy path"]:hover {
            background: #fdb48d !important;
            color: #000 !important;
        }
    `;
  document.head.appendChild(style);
}
async function readGPUBufferToCPU(device, gpuBuffer) {
  try {
    const size = gpuBuffer.size;
    const stagingBuffer = device.createBuffer({
      size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });
    const commandEncoder = device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(gpuBuffer, 0, stagingBuffer, 0, size);
    device.queue.submit([commandEncoder.finish()]);
    await stagingBuffer.mapAsync(GPUMapMode.READ);
    const copy = stagingBuffer.getMappedRange().slice(0);
    stagingBuffer.unmap();
    stagingBuffer.destroy();
    return copy;
  } catch (e) {
    console.error("Failed to read GPU buffer:", e);
    return null;
  }
}
const BufferDetailModal = ({ item, type, onClose }) => {
  var _a;
  const { redGPUContext } = useInspectorStore();
  const [liveData, setLiveData] = reactExports.useState(null);
  const [isLive, setIsLive] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const buf = item.buffer || item;
  const isRaw = item.isRaw;
  const gpuBuffer = buf == null ? void 0 : buf.gpuBuffer;
  const availableTabs = [];
  if (type === "indexBuffer") {
    availableTabs.push("dataViewU32");
  } else if (type === "vertexBuffer") {
    availableTabs.push("dataViewF32");
  } else if (type === "uniformBuffer" || type === "storageBuffer" || type === "gpuBuffer") {
    availableTabs.push("data");
  } else {
    availableTabs.push("data", "dataViewF32", "dataViewU32");
  }
  const [activeTab, setActiveTab] = reactExports.useState(availableTabs[0]);
  reactExports.useEffect(() => {
    const fetchBufferData = async () => {
      var _a2;
      if (redGPUContext && gpuBuffer) {
        const canRead = !!(gpuBuffer.usage & GPUBufferUsage.COPY_SRC);
        if (canRead) {
          const data = await readGPUBufferToCPU(redGPUContext.gpuDevice, gpuBuffer);
          if (data) {
            setLiveData(data);
            setIsLive(true);
            setIsLoading(false);
            return;
          }
        }
      }
      const localData = (buf == null ? void 0 : buf.data) instanceof ArrayBuffer ? buf.data : ((_a2 = buf == null ? void 0 : buf.data) == null ? void 0 : _a2.buffer) instanceof ArrayBuffer ? buf.data.buffer : null;
      if (localData) {
        setLiveData(localData.slice(0));
      }
      setIsLive(false);
      setIsLoading(false);
    };
    fetchBufferData();
  }, [redGPUContext, gpuBuffer, buf == null ? void 0 : buf.data]);
  const label = isRaw ? item.label : item.label || (buf == null ? void 0 : buf.label) || (buf == null ? void 0 : buf.name) || "Unnamed Buffer";
  const uuid = item.uuid;
  const size = isRaw ? item.size : (buf == null ? void 0 : buf.size) || 0;
  const usage = isRaw ? item.usage : buf == null ? void 0 : buf.usage;
  const vertexCount = buf == null ? void 0 : buf.vertexCount;
  const stride = buf == null ? void 0 : buf.stride;
  const triangleCount = buf == null ? void 0 : buf.triangleCount;
  const interleavedStruct = buf == null ? void 0 : buf.interleavedStruct;
  const dataObjectType = isRaw ? "GPUBuffer" : ((_a = buf == null ? void 0 : buf.data) == null ? void 0 : _a.constructor.name) || "Unknown";
  const dataViewF32 = liveData ? new Float32Array(liveData) : null;
  const dataViewU32 = liveData ? new Uint32Array(liveData) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: overlayStyle, onClick: onClose, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                * { box-sizing: border-box; }
            ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: modalStyle, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: headerStyle$3, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: titleStyle, children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              ...statusBadgeStyle,
              background: isLive ? "#10b981" : "#666"
            }, children: isLive ? "LIVE GPU" : "LOCAL CACHE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: typeStyle$1, children: type.toUpperCase() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: closeButtonStyle, onClick: onClose, children: "×" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: contentStyle$2, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: sectionTitleStyle, children: "Properties" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: propertyGridStyle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyItem, { label: "UUID", value: uuid }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyItem, { label: "Size", value: formatBytes(size), highlight: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyItem, { label: "Data Object", value: dataObjectType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyItem, { label: "Usage", value: formatBufferUsage(usage) }),
            vertexCount !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyItem, { label: "Vertex Count", value: formatNumber(vertexCount, 0) }),
            stride !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyItem, { label: "Stride", value: `${formatNumber(stride, 0)} elements` }),
            triangleCount !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyItem, { label: "Triangle Count", value: formatNumber(triangleCount, 0) })
          ] })
        ] }),
        type === "vertexBuffer" && interleavedStruct && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: sectionTitleStyle, children: "Interleaved Structure" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
            interleavedStruct.attributes.map((attr, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: structRowStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: structNameStyle, children: attr.attributeName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", fontSize: "9px", color: "#888" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Loc: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "b",
                    {
                      style: { color: "#eee" },
                      children: formatNumber(attr.shaderLocation, 0)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Offset: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: formatNumber(attr.offset, 0) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Format: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#fdb48d" }, children: attr.format })
                ] })
              ] })
            ] }, i)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "4px", fontSize: "9px", color: "#666", textAlign: "right" }, children: [
              "Total Array Stride: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
                formatNumber(interleavedStruct.arrayStride, 0),
                " bytes"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sectionStyle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            ...sectionTitleStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Buffer Data View" }),
            availableTabs.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: tabContainerStyle, children: availableTabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabButton,
              {
                label: tab === "data" ? "data (Raw)" : tab,
                active: activeTab === tab,
                onClick: () => setActiveTab(tab)
              },
              tab
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: dataViewerStyle, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: noDataStyle, children: "Loading data from GPU..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            DataContent,
            {
              type,
              tab: activeTab,
              f32: dataViewF32,
              u32: dataViewU32,
              raw: liveData,
              stride,
              interleavedStruct
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: footerStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: infoRowStyle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Video Memory: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#fdb48d" }, children: formatBytes(size) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.5 }, children: [
          "Top ",
          formatNumber(210, 0),
          " elements shown"
        ] })
      ] }) })
    ] })
  ] });
};
const TabButton = ({ label, active, onClick }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "button",
  {
    style: {
      ...tabButtonStyle,
      background: active ? "#fdb48d" : "transparent",
      color: active ? "#000" : "#888",
      fontSize: "9px"
    },
    onClick,
    children: label
  }
);
const DataContent = ({ type, tab, f32, u32, raw, stride, interleavedStruct }) => {
  const limit = 300;
  if (tab === "dataViewF32") {
    if (!f32) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: noDataStyle, children: "dataViewF32 not available" });
    const items = Array.from(f32.subarray(0, limit));
    if (type === "vertexBuffer" && stride) {
      const attrInfo = interleavedStruct ? interleavedStruct.attributes.map((attr, idx, arr) => {
        const nextOffset = arr[idx + 1] ? arr[idx + 1].offset : interleavedStruct.arrayStride;
        return {
          name: attr.attributeName.replace("vertex", ""),
          count: (nextOffset - attr.offset) / 4,
          offset: attr.offset / 4
        };
      }) : null;
      const groups = [];
      for (let i = 0; i < items.length; i += stride) {
        groups.push(items.slice(i, i + stride));
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px", width: "100%", overflowX: "hidden" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: "2px", width: "100%" }, children: groups.map((group, groupIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          ...triangleGroupStyle,
          background: groupIdx % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.07)",
          marginBottom: 0,
          padding: "6px 8px",
          alignItems: "flex-start"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            ...triangleLabelStyle,
            color: "#10b981",
            minWidth: "35px",
            marginTop: "14px"
          }, children: [
            "V",
            formatNumber(groupIdx, 0)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "12px", flex: 1, flexWrap: "wrap" }, children: attrInfo ? attrInfo.map((info) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: attrBlockStyle, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: attrBlockLabelStyle, children: info.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "6px" }, children: group.slice(info.offset, info.offset + info.count).map((v2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { minWidth: "55px", textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              ...valueLabelStyle,
              fontSize: "10px"
            }, children: formatNumber(v2) }) }, i)) })
          ] }, info.name)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" }, children: group.map((v2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { minWidth: "60px", textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            ...valueLabelStyle,
            fontSize: "10px"
          }, children: formatNumber(v2) }) }, i)) }) })
        ] }, groupIdx)) }),
        f32.length > limit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: moreStyle, children: [
          "... and ",
          formatNumber(f32.length - limit, 0),
          " more"
        ] })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: dataGridStyle, children: [
      items.map((v2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: dataItemStyle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: indexLabelStyle, children: formatNumber(i, 0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: valueLabelStyle, children: formatNumber(v2) })
      ] }, i)),
      f32.length > limit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: moreStyle, children: [
        "... and ",
        formatNumber(f32.length - limit, 0),
        " more"
      ] })
    ] });
  }
  if (tab === "dataViewU32") {
    if (!u32) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: noDataStyle, children: "dataViewU32 not available" });
    const items = Array.from(u32.subarray(0, limit));
    if (type === "indexBuffer") {
      const groups = [];
      for (let i = 0; i < items.length; i += 3) {
        groups.push(items.slice(i, i + 3));
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: { display: "flex", flexDirection: "column", gap: "10px", width: "100%", overflowX: "hidden" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: "4px",
              width: "100%"
            }, children: groups.map((group, groupIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              ...triangleGroupStyle,
              background: groupIdx % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.07)",
              marginBottom: 0
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: triangleLabelStyle, children: [
                "T",
                formatNumber(groupIdx, 0)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "4px", flex: 1, justifyContent: "space-around" }, children: group.map((v2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: triangleItemStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: valueLabelStyle, children: formatNumber(v2, 0) }) }, i)) })
            ] }, groupIdx)) }),
            u32.length > limit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: moreStyle, children: [
              "... and ",
              formatNumber(u32.length - limit, 0),
              " more"
            ] })
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: dataGridStyle, children: [
      items.map((v2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: dataItemStyle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: indexLabelStyle, children: formatNumber(i, 0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: valueLabelStyle, children: formatNumber(v2, 0) })
      ] }, i)),
      u32.length > limit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: moreStyle, children: [
        "... and ",
        formatNumber(u32.length - limit, 0),
        " more"
      ] })
    ] });
  }
  if (tab === "data") {
    if (!raw) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: noDataStyle, children: "ArrayBuffer not available" });
    const f32View = new Float32Array(raw);
    const u32View = new Uint32Array(raw);
    const wordLimit = 100;
    const count = Math.min(f32View.length, wordLimit);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "2px", width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: wordHeaderStyle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: "50px" }, children: "Offset" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: "Float32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: "Uint32" })
      ] }),
      Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        ...wordRowStyle,
        background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: wordOffsetStyle, children: [
          "+",
          formatNumber(i * 4, 0)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: wordValueStyle, children: formatNumber(f32View[i]) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...wordValueStyle, color: "#aaa" }, children: formatNumber(u32View[i], 0) })
      ] }, i)),
      f32View.length > wordLimit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: moreStyle, children: [
        "... and ",
        formatNumber(f32View.length - wordLimit, 0),
        " words more"
      ] })
    ] });
  }
  return null;
};
const PropertyItem = ({ label, value, highlight }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: propertyItemStyle, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: propertyLabelStyle, children: label }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...propertyValueStyle, color: highlight ? "#fdb48d" : "#eee" }, children: value })
] });
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1e4,
  backdropFilter: "blur(8px)",
  animation: "fadeIn 0.2s ease-out"
};
const modalStyle = {
  background: "rgba(26, 26, 26, 0.95)",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.15)",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "90%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
  overflow: "hidden",
  animation: "scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
};
const headerStyle$3 = {
  padding: "16px",
  background: "rgba(255,255,255,0.03)",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px"
};
const titleStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#eee",
  marginBottom: "4px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "block"
};
const typeStyle$1 = {
  fontSize: "10px",
  color: "#777",
  fontWeight: "bold",
  letterSpacing: "0.1em"
};
const statusBadgeStyle = {
  fontSize: "8px",
  color: "#000",
  padding: "2px 6px",
  borderRadius: "10px",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};
const closeButtonStyle = {
  background: "none",
  border: "none",
  color: "#888",
  fontSize: "28px",
  cursor: "pointer",
  padding: "0 4px",
  lineHeight: "1",
  marginTop: "-4px",
  flexShrink: 0
};
const contentStyle$2 = {
  padding: "20px",
  overflowY: "auto",
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
  gap: "24px"
};
const sectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%"
};
const sectionTitleStyle = {
  fontSize: "12px",
  color: "#fdb48d",
  fontWeight: "bold",
  textTransform: "uppercase",
  borderBottom: "1px solid rgba(253, 180, 141, 0.2)",
  paddingBottom: "4px"
};
const propertyGridStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};
const propertyItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "11px",
  gap: "20px"
};
const propertyLabelStyle = {
  color: "#888",
  flexShrink: 0
};
const propertyValueStyle = {
  color: "#eee",
  textAlign: "right",
  wordBreak: "break-all"
};
const dataViewerStyle = {
  background: "#000",
  borderRadius: "4px",
  padding: "12px",
  minHeight: "200px",
  maxHeight: "400px",
  overflowY: "auto",
  overflowX: "hidden",
  border: "1px solid rgba(255,255,255,0.05)",
  width: "100%"
};
const tabContainerStyle = {
  display: "flex",
  gap: "4px",
  background: "rgba(255,255,255,0.05)",
  padding: "2px",
  borderRadius: "4px"
};
const tabButtonStyle = {
  border: "none",
  padding: "2px 8px",
  borderRadius: "3px",
  fontSize: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s"
};
const dataGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "4px 8px",
  fontFamily: "monospace",
  width: "100%"
};
const dataItemStyle = {
  display: "flex",
  flexDirection: "column",
  minWidth: "70px",
  background: "rgba(255,255,255,0.02)",
  padding: "4px",
  borderRadius: "2px",
  border: "1px solid rgba(255,255,255,0.05)"
};
const indexLabelStyle = {
  fontSize: "8px",
  color: "#555",
  marginBottom: "2px"
};
const valueLabelStyle = {
  fontSize: "11px",
  color: "#10b981"
};
const noDataStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "150px",
  color: "#444",
  fontSize: "12px"
};
const moreStyle = {
  width: "100%",
  textAlign: "center",
  padding: "10px",
  color: "#444",
  fontSize: "10px",
  fontStyle: "italic"
};
const footerStyle = {
  padding: "16px",
  background: "rgba(255,255,255,0.03)",
  borderTop: "1px solid rgba(255,255,255,0.1)",
  fontSize: "11px",
  color: "#666"
};
const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};
const triangleGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  background: "rgba(255,255,255,0.03)",
  padding: "4px 8px",
  borderRadius: "4px",
  border: "1px solid rgba(255,255,255,0.05)",
  marginBottom: "2px"
};
const triangleLabelStyle = {
  fontSize: "9px",
  color: "#fdb48d",
  fontWeight: "bold",
  minWidth: "24px",
  opacity: 0.7
};
const triangleItemStyle = {
  minWidth: "30px",
  textAlign: "center"
};
const structRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255,255,255,0.02)",
  padding: "6px 10px",
  borderRadius: "4px",
  border: "1px solid rgba(255,255,255,0.05)"
};
const structNameStyle = {
  fontSize: "11px",
  fontWeight: "bold",
  color: "#ddd"
};
const attrBlockStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  background: "rgba(255,255,255,0.03)",
  padding: "4px 6px",
  borderRadius: "4px",
  border: "1px solid rgba(255,255,255,0.05)"
};
const attrBlockLabelStyle = {
  fontSize: "8px",
  color: "#888",
  letterSpacing: "0.05em",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  paddingBottom: "2px",
  marginBottom: "2px"
};
const wordHeaderStyle = {
  display: "flex",
  padding: "4px 10px",
  fontSize: "9px",
  color: "#555",
  fontWeight: "bold",
  textTransform: "uppercase",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  marginBottom: "4px"
};
const wordRowStyle = {
  display: "flex",
  padding: "4px 10px",
  borderRadius: "2px",
  gap: "10px",
  fontFamily: "monospace",
  alignItems: "center"
};
const wordOffsetStyle = {
  width: "50px",
  fontSize: "9px",
  color: "#666"
};
const wordValueStyle = {
  flex: 1,
  fontSize: "11px",
  color: "#10b981"
};
const TabBar = ({ tabs, activeTab, onTabChange, isSticky = true, style }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    ...tabBarStyle,
    position: isSticky ? "sticky" : "relative",
    top: isSticky ? 0 : "auto",
    ...style
  }, children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onClick: () => onTabChange(tab.id),
      style: {
        ...tabItemStyle,
        borderBottom: activeTab === tab.id ? `2px solid ${THEME.colors.primary}` : "2px solid transparent",
        color: activeTab === tab.id ? THEME.colors.primary : THEME.colors.label,
        backgroundColor: activeTab === tab.id ? THEME.colors.activeBg : "transparent"
      },
      children: tab.label
    },
    tab.id
  )) });
};
const Tabs = ({ tabs, activeTab, onTabChange, children, scrollable = true }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    ...tabsContainerStyle,
    overflow: scrollable ? "hidden" : "visible"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabBar, { tabs, activeTab, onTabChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      ...contentAreaStyle$1,
      overflowY: scrollable ? "auto" : "visible"
    }, children })
  ] });
};
const tabsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  flex: 1
};
const tabBarStyle = {
  display: "flex",
  background: THEME.colors.background,
  borderTop: `1px solid ${THEME.colors.border}`,
  borderBottom: `1px solid ${THEME.colors.border}`,
  position: "sticky",
  top: 0,
  zIndex: 10
};
const tabItemStyle = {
  padding: "8px 4px",
  fontSize: THEME.fontSize.small,
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s",
  flex: 1,
  textAlign: "center",
  whiteSpace: "nowrap",
  fontFamily: THEME.fontFamily
};
const contentAreaStyle$1 = {
  flex: 1,
  overflowY: "auto",
  background: "rgba(0,0,0,0.2)"
};
const ResourceSummary = ({
  label,
  stats,
  isExpanded,
  onToggle
}) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "4px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "div",
  {
    style: headerStyle$2,
    onClick: onToggle,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleButton,
        {
          isExpanded,
          style: { paddingRight: "8px" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: labelWrapperStyle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: labelStyle, children: [
          label,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "small",
            {
              style: countStyle,
              children: [
                "(",
                formatNumber(stats.count, 0),
                ")"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: memoryStyle, children: formatBytes(stats.videoMemory) })
      ] })
    ]
  }
) });
const headerStyle$2 = {
  padding: "8px 12px",
  background: "#222",
  cursor: "pointer",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  borderLeft: `2px solid ${THEME.colors.primary}`,
  transition: "background 0.2s"
};
const labelWrapperStyle = {
  display: "flex",
  justifyContent: "space-between",
  flex: 1,
  alignItems: "center"
};
const labelStyle = {
  fontWeight: "bold",
  color: "#eee"
};
const countStyle = {
  color: "#888",
  fontWeight: "normal",
  marginLeft: "4px"
};
const memoryStyle = {
  fontSize: "11px",
  color: THEME.colors.primary,
  fontWeight: "bold"
};
const TextureResourcesView = ({ onPreview }) => {
  var _a, _b, _c;
  const { resourceStats, redGPUContext } = useInspectorStore();
  const [expanded, setExpanded] = reactExports.useState({});
  const toggleExpanded = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  if (!redGPUContext) return null;
  const totalMemory = (((_a = resourceStats.bitmapTexture) == null ? void 0 : _a.videoMemory) || 0) + (((_b = resourceStats.cubeTexture) == null ? void 0 : _b.videoMemory) || 0) + (((_c = resourceStats.hdrTexture) == null ? void 0 : _c.videoMemory) || 0);
  const renderTextureSection = (type, label, stats) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React$2.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceSummary,
      {
        label,
        stats,
        isExpanded: !!expanded[type],
        onToggle: () => toggleExpanded(type)
      }
    ),
    expanded[type] && /* @__PURE__ */ jsxRuntimeExports.jsx(TextureDetailList, { type, redGPUContext, onPreview })
  ] }, type);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Texture Resources" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "11px", color: "#fdb48d" }, children: formatBytes(totalMemory) })
  ] }), children: [
    renderTextureSection("bitmapTexture", "Bitmap Textures", resourceStats.bitmapTexture),
    renderTextureSection("cubeTexture", "Cube Textures", resourceStats.cubeTexture),
    renderTextureSection("hdrTexture", "HDR Textures", resourceStats.hdrTexture)
  ] });
};
const TextureDetailList = ({ type, redGPUContext, onPreview }) => {
  const rm = redGPUContext.resourceManager;
  let items = [];
  switch (type) {
    case "bitmapTexture":
      items = Array.from(rm.managedBitmapTextureState.table.values());
      break;
    case "cubeTexture":
      items = Array.from(rm.managedCubeTextureState.table.values());
      break;
    case "hdrTexture":
      items = Array.from(rm.managedHDRTextureState.table.values());
      break;
  }
  if (items.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: noItemStyle$1, children: "No textures found." });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailListStyle$2, children: items.map((item, idx) => {
    var _a, _b, _c, _d;
    const tex = item.texture;
    const gpuTex = tex == null ? void 0 : tex.gpuTexture;
    const isBlob = item.src && item.src.startsWith("blob:") || item.srcList && ((_a = item.srcList[0]) == null ? void 0 : _a.startsWith("blob:"));
    const fileName = isBlob ? "BLOB" : item.src ? item.src.split("/").pop() : ((_c = (_b = item.srcList) == null ? void 0 : _b[0]) == null ? void 0 : _c.split("/").pop()) || null;
    const originalPath = item.src || (((_d = item.srcList) == null ? void 0 : _d[0]) ? item.srcList[0] + "..." : item.cacheKey);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: textureItemStyle$1,
        onClick: () => onPreview(item, type),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: detailHeaderStyle$2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: detailLeftContainerStyle$2, children: [
            fileName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: detailNameStyle$2, children: fileName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: pathStyle, title: originalPath, children: originalPath }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailInfoStyle$2, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "UUID: ",
              item.uuid
            ] }) }),
            gpuTex && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...detailInfoStyle$2, gap: "8px", marginTop: "2px", opacity: 0.9 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Dim: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: gpuTex.dimension })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Layers: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "b",
                    {
                      style: { color: "#eee" },
                      children: formatNumber(gpuTex.depthOrArrayLayers, 0)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Samples: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: gpuTex.sampleCount })
                ] })
              ] }),
              gpuTex.usage !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...detailInfoStyle$2, marginTop: "2px", opacity: 0.7 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Usage: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "b",
                  {
                    style: { color: "#eee" },
                    children: formatTextureUsage(gpuTex.usage)
                  }
                )
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: detailRightContainerStyle$2, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "4px", alignItems: "center", marginBottom: "2px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: useNumStyle$1, children: [
                "Use: ",
                formatNumber(item.useNum, 0)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: detailMemoryStyle$2, children: formatBytes((tex == null ? void 0 : tex.videoMemorySize) || 0) })
            ] }),
            gpuTex && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              ...detailInfoStyle$2,
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0",
              opacity: 0.9
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#fdb48d" }, children: gpuTex.format }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                color: "#eee",
                fontWeight: "bold"
              }, children: [
                formatNumber(gpuTex.width, 0),
                "x",
                formatNumber(gpuTex.height, 0)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  style: { fontWeight: "bold" },
                  children: [
                    "Mip: ",
                    formatNumber(gpuTex.mipLevelCount, 0)
                  ]
                }
              )
            ] })
          ] })
        ] })
      },
      item.uuid || idx
    );
  }) });
};
const detailListStyle$2 = {
  padding: "4px 0 4px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  borderLeft: "1px solid #333",
  marginLeft: "6px",
  marginBottom: "8px"
};
const textureItemStyle$1 = {
  fontSize: "11px",
  color: "#888",
  background: "#1a1a1a",
  padding: "8px 12px",
  borderRadius: "2px",
  lineHeight: "1.4",
  borderBottom: "1px solid #222",
  cursor: "pointer",
  transition: "background 0.2s"
};
const detailHeaderStyle$2 = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "8px"
};
const detailLeftContainerStyle$2 = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  flex: 1,
  minWidth: 0
};
const detailNameStyle$2 = {
  color: "#ddd",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontWeight: "600",
  fontSize: "12px",
  marginBottom: "2px"
};
const pathStyle = {
  fontSize: "9px",
  color: "#888",
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginBottom: "4px"
};
const detailInfoStyle$2 = {
  display: "flex",
  gap: "12px",
  opacity: 0.6,
  fontSize: "9px"
};
const detailRightContainerStyle$2 = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "4px",
  minWidth: "90px",
  flexShrink: 0
};
const useNumStyle$1 = {
  fontSize: "10px",
  opacity: 0.8,
  color: "#fdb48d",
  background: "rgba(255,255,255,0.1)",
  padding: "2px 6px",
  borderRadius: "3px",
  whiteSpace: "nowrap",
  fontWeight: "bold"
};
const detailMemoryStyle$2 = {
  color: "#fdb48d",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  fontSize: "12px"
};
const noItemStyle$1 = {
  padding: "8px 16px",
  fontSize: "10px",
  color: "#666",
  fontStyle: "italic"
};
const BufferResourcesView = ({ onPreview }) => {
  var _a, _b, _c, _d, _e;
  const { resourceStats, redGPUContext } = useInspectorStore();
  const [expanded, setExpanded] = reactExports.useState({});
  const toggleExpanded = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  if (!redGPUContext) return null;
  const totalMemory = (((_a = resourceStats.uniformBuffer) == null ? void 0 : _a.videoMemory) || 0) + (((_b = resourceStats.vertexBuffer) == null ? void 0 : _b.videoMemory) || 0) + (((_c = resourceStats.indexBuffer) == null ? void 0 : _c.videoMemory) || 0) + (((_d = resourceStats.storageBuffer) == null ? void 0 : _d.videoMemory) || 0) + (((_e = resourceStats.gpuBuffer) == null ? void 0 : _e.videoMemory) || 0);
  const renderBufferSection = (type, label, stats) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React$2.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResourceSummary,
      {
        label,
        stats,
        isExpanded: !!expanded[type],
        onToggle: () => toggleExpanded(type)
      }
    ),
    expanded[type] && /* @__PURE__ */ jsxRuntimeExports.jsx(BufferDetailList, { type, redGPUContext, onPreview })
  ] }, type);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Buffer Resources" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "11px", color: THEME.colors.primary }, children: formatBytes(totalMemory) })
  ] }), children: [
    renderBufferSection("uniformBuffer", "Uniform Buffers", resourceStats.uniformBuffer),
    renderBufferSection("vertexBuffer", "Vertex Buffers", resourceStats.vertexBuffer),
    renderBufferSection("indexBuffer", "Index Buffers", resourceStats.indexBuffer),
    renderBufferSection("storageBuffer", "Storage Buffers", resourceStats.storageBuffer),
    renderBufferSection("gpuBuffer", "Raw GPU Buffers", resourceStats.gpuBuffer)
  ] });
};
const BufferDetailList = ({ type, redGPUContext, onPreview }) => {
  const rm = redGPUContext.resourceManager;
  let items = [];
  switch (type) {
    case "uniformBuffer":
      items = Array.from(rm.managedUniformBufferState.table.values());
      break;
    case "vertexBuffer":
      items = Array.from(rm.managedVertexBufferState.table.values());
      break;
    case "indexBuffer":
      items = Array.from(rm.managedIndexBufferState.table.values());
      break;
    case "storageBuffer":
      items = Array.from(rm.managedStorageBufferState.table.values());
      break;
    case "gpuBuffer": {
      const gpuBufferMap = rm.resources.get("GPUBuffer");
      if (gpuBufferMap) {
        items = Array.from(gpuBufferMap.entries()).map(([key, buffer]) => ({
          uuid: key,
          label: buffer.label || key,
          size: buffer.size,
          usage: buffer.usage,
          isRaw: true,
          gpuBuffer: buffer
          // Pass the instance for readback
        }));
      }
      break;
    }
  }
  if (items.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: noItemStyle, children: "No buffers found." });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailListStyle$1, children: items.map((item, idx) => {
    if (item.isRaw) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: detailItemStyle,
          onClick: () => onPreview(item, type),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: detailHeaderStyle$1, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: detailLeftContainerStyle$1, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: detailNameStyle$1, children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailInfoStyle$1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "UUID: ",
                item.uuid
              ] }) }),
              item.usage !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...detailInfoStyle$1, marginTop: "2px", opacity: 0.7 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Usage: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: formatBufferUsage(item.usage) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailRightContainerStyle$1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: detailMemoryStyle$1, children: formatBytes(item.size) }) })
          ] })
        },
        item.uuid || idx
      );
    } else {
      const buf = item.buffer;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            ...detailItemStyle,
            borderLeft: type === "uniformBuffer" ? `2px solid ${THEME.colors.primary}` : "none",
            cursor: "pointer"
          },
          onClick: () => onPreview(item, type),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: detailHeaderStyle$1, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: detailLeftContainerStyle$1, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: detailNameStyle$1,
                  children: item.label || (buf == null ? void 0 : buf.label) || (buf == null ? void 0 : buf.name) || "Unnamed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailInfoStyle$1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "UUID: ",
                item.uuid
              ] }) }),
              (buf == null ? void 0 : buf.usage) !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...detailInfoStyle$1, marginTop: "2px", opacity: 0.7 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Usage: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "b",
                  {
                    style: { color: "#eee" },
                    children: formatBufferUsage(buf.usage)
                  }
                )
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailRightContainerStyle$1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              gap: "4px",
              alignItems: "center",
              marginBottom: "2px"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: useNumStyle, children: [
                "Use: ",
                formatNumber(item.useNum, 0)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: detailMemoryStyle$1, children: formatBytes((buf == null ? void 0 : buf.size) || 0) })
            ] }) })
          ] })
        },
        item.uuid || idx
      );
    }
  }) });
};
const detailListStyle$1 = {
  padding: "4px 0 4px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  borderLeft: "1px solid #333",
  marginLeft: "6px",
  marginBottom: "8px"
};
const detailItemStyle = {
  fontSize: "11px",
  color: "#888",
  background: "#1a1a1a",
  padding: "8px 12px",
  borderRadius: "2px",
  lineHeight: "1.4",
  borderBottom: "1px solid #222"
};
const detailHeaderStyle$1 = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "8px"
};
const detailLeftContainerStyle$1 = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  flex: 1,
  minWidth: 0
};
const detailNameStyle$1 = {
  color: "#ddd",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontWeight: "600",
  fontSize: "12px",
  marginBottom: "2px"
};
const detailInfoStyle$1 = {
  display: "flex",
  gap: "12px",
  opacity: 0.6,
  fontSize: "9px"
};
const detailRightContainerStyle$1 = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "4px",
  minWidth: "90px",
  flexShrink: 0
};
const detailMemoryStyle$1 = {
  color: THEME.colors.primary,
  fontWeight: "bold",
  whiteSpace: "nowrap",
  fontSize: "12px"
};
const useNumStyle = {
  fontSize: "10px",
  opacity: 0.8,
  color: THEME.colors.primary,
  background: "rgba(255,255,255,0.1)",
  padding: "2px 6px",
  borderRadius: "3px",
  whiteSpace: "nowrap",
  fontWeight: "bold"
};
const noItemStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  color: "#666",
  fontStyle: "italic"
};
function calculateTextureByteSize(texture) {
  const descriptor = {
    size: [texture.width, texture.height, texture.depthOrArrayLayers],
    format: texture.format,
    sampleCount: texture.sampleCount,
    usage: texture.usage
  };
  const bytesPerTexel = getTextureFormatByteSize(descriptor.format);
  const texelCount = descriptor.size[0] * descriptor.size[1] * (descriptor.size[2] || 1);
  const sampleCount = descriptor.sampleCount ? descriptor.sampleCount : 1;
  return bytesPerTexel * texelCount * sampleCount;
}
function getTextureFormatByteSize(format) {
  switch (format) {
    case "r8unorm":
    case "r8snorm":
    case "r8uint":
    case "r8sint":
      return 1;
    case "r16uint":
    case "r16sint":
    case "r16float":
    case "rg8unorm":
    case "rg8snorm":
    case "rg8uint":
    case "rg8sint":
      return 2;
    case "r32uint":
    case "r32sint":
    case "r32float":
    case "rg16uint":
    case "rg16sint":
    case "rg16float":
    case "rgba8unorm":
    case "rgba8unorm-srgb":
    case "rgba8snorm":
    case "rgba8uint":
    case "rgba8sint":
    case "bgra8unorm":
    case "bgra8unorm-srgb":
      return 4;
    case "rg32uint":
    case "rg32sint":
    case "rg32float":
    case "rgba16uint":
    case "rgba16sint":
    case "rgba16float":
      return 8;
    case "rgba32uint":
    case "rgba32sint":
    case "rgba32float":
      return 16;
    case "depth16unorm":
      return 2;
    case "depth24plus":
      return 4;
    case "depth32float":
      return 4;
    default:
      throw new Error(`Unrecognized texture format: ${format}`);
  }
}
const GBufferResourcesView = ({ onPreview }) => {
  const { redGPUContext } = useInspectorStore();
  const [expanded, setExpanded] = reactExports.useState({});
  if (!redGPUContext) return null;
  const toggleExpanded = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const views = redGPUContext.viewList;
  const totalMemory = views.reduce((acc, view) => {
    var _a;
    return acc + (((_a = view.viewRenderTextureManager) == null ? void 0 : _a.videoMemorySize) || 0);
  }, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "G-Buffer Resources" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "11px", color: THEME.colors.primary }, children: formatBytes(totalMemory) })
  ] }), children: views.map((view, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ViewGBufferList,
    {
      view,
      isExpanded: !!expanded[idx.toString()],
      onToggle: () => toggleExpanded(idx.toString()),
      onPreview
    },
    idx
  )) });
};
const ViewGBufferList = ({ view, isExpanded, onToggle, onPreview }) => {
  const vrm = view.viewRenderTextureManager;
  const gBuffers = vrm.gBuffers;
  const items = Array.from(gBuffers.entries());
  const viewMemory = vrm.videoMemorySize;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: viewHeaderStyle,
        onClick: onToggle,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToggleButton,
            {
              isExpanded,
              style: { paddingRight: "8px" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", flex: 1, alignItems: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "View: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: view.name || "Unnamed View" }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "small",
                {
                  style: { color: "#888" },
                  children: [
                    "(",
                    items.length,
                    ")"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              fontSize: "11px",
              opacity: 0.8,
              color: THEME.colors.primary
            }, children: formatBytes(viewMemory) })
          ] })
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailListStyle, children: items.map(([key, info]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      GBufferItem,
      {
        name: key,
        info,
        onPreview
      },
      key
    )) })
  ] });
};
const GBufferItem = ({ name, info, onPreview }) => {
  const gpuTex = info.texture;
  if (!gpuTex) return null;
  const isMSAA = gpuTex.sampleCount > 1;
  const previewTex = isMSAA && info.resolveTexture ? info.resolveTexture : gpuTex;
  let itemMemory = calculateTextureByteSize(gpuTex);
  if (info.resolveTexture) {
    itemMemory += calculateTextureByteSize(info.resolveTexture);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: textureItemStyle,
      onClick: () => onPreview({ texture: { gpuTexture: previewTex }, label: name }, "bitmapTexture"),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: detailHeaderStyle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: detailLeftContainerStyle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: detailNameStyle, children: [
            name,
            " ",
            isMSAA ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: msaaBadgeStyle, children: "MSAA" }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailInfoStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Format: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: gpuTex.format })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...detailInfoStyle, gap: "8px", marginTop: "2px", opacity: 0.9 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Dim: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { style: { color: "#eee" }, children: [
                gpuTex.width,
                "x",
                gpuTex.height
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Samples: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "b",
                {
                  style: { color: isMSAA ? THEME.colors.primary : "#eee" },
                  children: gpuTex.sampleCount
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Mips: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: gpuTex.mipLevelCount })
            ] })
          ] }),
          gpuTex.usage !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...detailInfoStyle, marginTop: "2px", opacity: 0.7 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Usage: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { color: "#eee" }, children: formatTextureUsage(gpuTex.usage) })
          ] }) }),
          isMSAA && !info.resolveTexture && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...detailInfoStyle, marginTop: "4px", color: "#f44336", fontSize: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠️ Multisampled texture without resolve target cannot be previewed." }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: detailRightContainerStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: detailMemoryStyle, children: formatBytes(itemMemory) }) })
      ] })
    }
  );
};
const msaaBadgeStyle = {
  background: THEME.colors.primary,
  color: "#000",
  fontSize: "9px",
  padding: "1px 4px",
  borderRadius: "3px",
  marginLeft: "6px",
  verticalAlign: "middle"
};
const viewHeaderStyle = {
  padding: "8px 12px",
  background: "#222",
  cursor: "pointer",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  borderLeft: `2px solid ${THEME.colors.primary}`
};
const detailListStyle = {
  padding: "4px 0 4px 12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  borderLeft: "1px solid #333",
  marginLeft: "6px"
};
const textureItemStyle = {
  padding: "8px 12px",
  background: "#1a1a1a",
  cursor: "pointer",
  fontSize: "12px",
  transition: "background 0.2s",
  borderBottom: "1px solid #222"
};
const detailHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start"
};
const detailLeftContainerStyle = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0
};
const detailNameStyle = {
  color: THEME.colors.primary,
  fontWeight: "bold",
  marginBottom: "2px",
  fontSize: "13px"
};
const detailInfoStyle = {
  display: "flex",
  fontSize: "11px",
  color: "#aaa",
  gap: "12px"
};
const detailRightContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  paddingLeft: "12px"
};
const detailMemoryStyle = {
  color: THEME.colors.primary,
  fontWeight: "bold",
  fontSize: "11px"
};
const ResourcesView = () => {
  const [activeSubTab, setActiveSubTab] = reactExports.useState("GBUFFER");
  const [previewData, setPreviewData] = reactExports.useState(null);
  const handlePreview = (item, type) => {
    setPreviewData({ item, type });
  };
  const subTabs = [
    { id: "GBUFFER", label: "G-Buffer" },
    { id: "TEXTURES", label: "Textures" },
    { id: "BUFFERS", label: "Buffers" }
  ];
  const isTextureType = previewData && ["bitmapTexture", "cubeTexture", "hdrTexture"].includes(previewData.type);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: stickyHeaderStyle$1, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabBar,
      {
        tabs: subTabs,
        activeTab: activeSubTab,
        onTabChange: setActiveSubTab,
        isSticky: false
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 0" }, children: [
      activeSubTab === "GBUFFER" && /* @__PURE__ */ jsxRuntimeExports.jsx(GBufferResourcesView, { onPreview: handlePreview }),
      activeSubTab === "TEXTURES" && /* @__PURE__ */ jsxRuntimeExports.jsx(TextureResourcesView, { onPreview: handlePreview }),
      activeSubTab === "BUFFERS" && /* @__PURE__ */ jsxRuntimeExports.jsx(BufferResourcesView, { onPreview: handlePreview })
    ] }),
    previewData && isTextureType && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TexturePreviewModal,
      {
        item: previewData.item,
        onClose: () => setPreviewData(null)
      }
    ),
    previewData && !isTextureType && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BufferDetailModal,
      {
        item: previewData.item,
        type: previewData.type,
        onClose: () => setPreviewData(null)
      }
    )
  ] });
};
const stickyHeaderStyle$1 = {
  position: "sticky",
  top: 0,
  // Offset container padding
  zIndex: 10,
  background: "#111"
};
const Divider = ({ vertical, style }) => {
  const combinedStyle = vertical ? { ...defaultVerticalStyle, ...style } : { ...defaultHorizontalStyle, ...style };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: combinedStyle });
};
const defaultHorizontalStyle = {
  height: "1px",
  background: THEME.colors.border,
  margin: "8px 0"
};
const defaultVerticalStyle = {
  width: "1px",
  height: "36px",
  background: THEME.colors.border,
  margin: "0"
};
class InstanceIdGenerator {
  /**
   * [KO] 다음 고유 인스턴스 ID를 반환합니다.
   * [EN] Returns the next unique instance ID.
   *
   * @param type -
   * [KO] ID를 생성할 타입
   * [EN] Type to generate ID for
   * @returns
   * [KO] 고유 인스턴스 ID
   * [EN] Unique instance ID
   */
  static getNextId(type) {
    let currentId = this.idMaps.get(type) || 0;
    this.idMaps.set(type, currentId + 1);
    return currentId;
  }
}
/**
 * [KO] 타입별 현재 ID 맵
 * [EN] Current ID map per type
 */
__publicField(InstanceIdGenerator, "idMaps", /* @__PURE__ */ new Map());
Object.freeze(InstanceIdGenerator);
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
function create() {
  var out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];
  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }
  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }
  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }
  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
const validateNumber = (value) => {
  if (typeof value !== "number") {
    consoleAndThrowError("Only numbers allowed.");
    return false;
  }
  return true;
};
class ACamera {
  constructor() {
    /**
     * [KO] 인스턴스 고유 ID
     * [EN] Instance unique ID
     */
    __privateAdd(this, _instanceId);
    /**
     * [KO] 카메라 이름
     * [EN] Camera name
     */
    __privateAdd(this, _name);
    /**
     * [KO] 조리개 (f-stop)
     * [EN] Aperture (f-stop)
     */
    __privateAdd(this, _aperture, 16);
    /**
     * [KO] 셔터 속도 (초)
     * [EN] Shutter speed (seconds)
     */
    __privateAdd(this, _shutterSpeed, 1 / 3200);
    /**
     * [KO] 센서 감도 (ISO)
     * [EN] Sensor sensitivity (ISO)
     */
    __privateAdd(this, _iso, 100);
    /**
     * [KO] 캐시된 EV100
     * [EN] Cached EV100
     */
    __privateAdd(this, _ev100, 0);
    /**
     * [KO] 자동 노출 사용 여부
     * [EN] Whether to use auto exposure
     */
    __privateAdd(this, _useAutoExposure, true);
    /**
     * [KO] 노출 값이 다시 계산되어야 하는지 여부
     * [EN] Whether the exposure needs to be recalculated
     */
    __privateAdd(this, _exposureDirty, true);
  }
  /**
   * [KO] 자동 노출 사용 여부를 반환합니다.
   * [EN] Returns whether to use auto exposure.
   */
  get useAutoExposure() {
    return __privateGet(this, _useAutoExposure);
  }
  /**
   * [KO] 자동 노출 사용 여부를 설정합니다.
   * [EN] Sets whether to use auto exposure.
   */
  set useAutoExposure(value) {
    if (__privateGet(this, _useAutoExposure) === value)
      return;
    if (__privateGet(this, _useAutoExposure) && !value) {
      __privateSet(this, _iso, 100);
      let rawShutterSpeed = __privateGet(this, _aperture) * __privateGet(this, _aperture) / Math.pow(2, __privateGet(this, _ev100));
      const standardSpeeds = [
        1,
        1 / 1.3,
        1 / 1.6,
        1 / 2,
        1 / 2.5,
        1 / 3.2,
        1 / 4,
        1 / 5,
        1 / 6,
        1 / 8,
        1 / 10,
        1 / 13,
        1 / 15,
        1 / 20,
        1 / 25,
        1 / 30,
        1 / 40,
        1 / 50,
        1 / 60,
        1 / 80,
        1 / 100,
        1 / 125,
        1 / 160,
        1 / 200,
        1 / 250,
        1 / 320,
        1 / 400,
        1 / 500,
        1 / 640,
        1 / 800,
        1 / 1e3,
        1 / 1250,
        1 / 1600,
        1 / 2e3,
        1 / 2500,
        1 / 3200,
        1 / 4e3,
        1 / 5e3,
        1 / 6400,
        1 / 8e3
      ];
      __privateSet(this, _shutterSpeed, standardSpeeds.reduce((prev, curr) => Math.abs(curr - rawShutterSpeed) < Math.abs(prev - rawShutterSpeed) ? curr : prev));
      __privateSet(this, _exposureDirty, true);
    }
    __privateSet(this, _useAutoExposure, value);
  }
  /**
   * [KO] 물리적 노출 지수(EV100)를 반환합니다.
   * [EN] Returns the physical exposure value (EV100).
   */
  get ev100() {
    if (__privateGet(this, _exposureDirty))
      this.updateExposure();
    return __privateGet(this, _ev100);
  }
  /**
   * [KO] 조리개(f-stop) 값을 반환합니다.
   * [EN] Returns the aperture (f-stop) value.
   */
  get aperture() {
    return __privateGet(this, _aperture);
  }
  /**
   * [KO] 조리개(f-stop) 값을 설정합니다.
   * [EN] Sets the aperture (f-stop) value.
   */
  set aperture(value) {
    validateNumber(value);
    if (__privateGet(this, _aperture) === value)
      return;
    __privateSet(this, _aperture, value);
    __privateSet(this, _exposureDirty, true);
  }
  /**
   * [KO] 셔터 속도(초 단위)를 반환합니다.
   * [EN] Returns the shutter speed (in seconds).
   */
  get shutterSpeed() {
    return __privateGet(this, _shutterSpeed);
  }
  /**
   * [KO] 셔터 속도(초 단위)를 설정합니다.
   * [EN] Sets the shutter speed (in seconds).
   */
  set shutterSpeed(value) {
    validateNumber(value);
    if (__privateGet(this, _shutterSpeed) === value)
      return;
    __privateSet(this, _shutterSpeed, value);
    __privateSet(this, _exposureDirty, true);
  }
  /**
   * [KO] 센서 감도(ISO)를 반환합니다.
   * [EN] Returns the sensor sensitivity (ISO).
   */
  get iso() {
    return __privateGet(this, _iso);
  }
  /**
   * [KO] 센서 감도(ISO)를 설정합니다.
   * [EN] Sets the sensor sensitivity (ISO).
   */
  set iso(value) {
    validateNumber(value);
    if (__privateGet(this, _iso) === value)
      return;
    __privateSet(this, _iso, value);
    __privateSet(this, _exposureDirty, true);
  }
  /**
   * [KO] 카메라 이름을 반환합니다.
   * [EN] Returns the camera name.
   */
  get name() {
    if (!__privateGet(this, _instanceId))
      __privateSet(this, _instanceId, InstanceIdGenerator.getNextId(this.constructor));
    return __privateGet(this, _name) || `${this.constructor.name} Instance ${__privateGet(this, _instanceId)}`;
  }
  /**
   * [KO] 카메라 이름을 설정합니다.
   * [EN] Sets the camera name.
   */
  set name(value) {
    __privateSet(this, _name, value);
  }
  /**
   * [KO] 노출 값을 업데이트합니다.
   * [EN] Updates the exposure value.
   * @param view [KO] View3D 인스턴스 (선택 사항) [EN] View3D instance (optional)
   */
  updateExposure(view) {
    if (view && __privateGet(this, _useAutoExposure)) {
      __privateSet(this, _ev100, view.postEffectManager.autoExposure.currentAdaptedEV100);
    } else {
      __privateSet(this, _ev100, Math.log2(__privateGet(this, _aperture) * __privateGet(this, _aperture) / __privateGet(this, _shutterSpeed) * (100 / __privateGet(this, _iso))));
    }
    __privateSet(this, _exposureDirty, false);
  }
}
_instanceId = new WeakMap();
_name = new WeakMap();
_aperture = new WeakMap();
_shutterSpeed = new WeakMap();
_iso = new WeakMap();
_ev100 = new WeakMap();
_useAutoExposure = new WeakMap();
_exposureDirty = new WeakMap();
/**
 * [KO] 교정 상수 (Calibration Constant, K)
 * [EN] Calibration constant (K)
 * @description
 * [KO] 언리얼 엔진 5 및 사진학적 표준 (ISO 2720 표준 기준 K = 12.5)
 * [EN] Unreal Engine 5 and photographic standard (K = 12.5 based on ISO 2720)
 */
__publicField(ACamera, "CALIBRATION_CONSTANT", 12.5);
class PerspectiveCamera extends ACamera {
  /**
   * [KO] PerspectiveCamera 인스턴스를 생성합니다.
   * [EN] Creates an instance of PerspectiveCamera.
   *
   * ### Example
   * ```typescript
   * const camera = new RedGPU.PerspectiveCamera();
   * ```
   */
  constructor() {
    super();
    /**
     * [KO] up 벡터 (기본값 [0, 1, 0])
     * [EN] Up vector (default [0, 1, 0])
     */
    __privateAdd(this, _up, new Float32Array([0, 1, 0]));
    /**
     * [KO] 모델 행렬(mat4)
     * [EN] Model matrix (mat4)
     */
    __privateAdd(this, _viewMatrix, create());
    /**
     * [KO] X 좌표
     * [EN] X coordinate
     */
    __privateAdd(this, _x, 0);
    /**
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    __privateAdd(this, _z, 0);
    /**
     * [KO] Y 좌표
     * [EN] Y coordinate
     */
    __privateAdd(this, _y, 0);
    /**
     * [KO] X축 회전(라디안)
     * [EN] Rotation X (radians)
     */
    __privateAdd(this, _rotationX, 0);
    /**
     * [KO] Y축 회전(라디안)
     * [EN] Rotation Y (radians)
     */
    __privateAdd(this, _rotationY, 0);
    /**
     * [KO] Z축 회전(라디안)
     * [EN] Rotation Z (radians)
     */
    __privateAdd(this, _rotationZ, 0);
    /**
     * [KO] 시야각(FOV, 도)
     * [EN] Field of view (degrees)
     */
    __privateAdd(this, _fieldOfView, 60);
    /**
     * [KO] 근평면(near)
     * [EN] Near clipping plane
     */
    __privateAdd(this, _nearClipping, 0.01);
    /**
     * [KO] 원평면(far)
     * [EN] Far clipping plane
     */
    __privateAdd(this, _farClipping, 1e5);
  }
  /**
   * [KO] X축 회전값을 반환합니다. (라디안)
   * [EN] Returns the X rotation value. (radians)
   *
   * @returns
   * [KO] X축 회전값
   * [EN] X rotation value
   */
  get rotationX() {
    return __privateGet(this, _rotationX);
  }
  /**
   * [KO] X축 회전값을 설정합니다. (라디안)
   * [EN] Sets the X rotation value. (radians)
   *
   * @param value -
   * [KO] 설정할 회전값
   * [EN] Rotation value to set
   */
  set rotationX(value) {
    __privateSet(this, _rotationX, value);
  }
  /**
   * [KO] Y축 회전값을 반환합니다. (라디안)
   * [EN] Returns the Y rotation value. (radians)
   *
   * @returns
   * [KO] Y축 회전값
   * [EN] Y rotation value
   */
  get rotationY() {
    return __privateGet(this, _rotationY);
  }
  /**
   * [KO] Y축 회전값을 설정합니다. (라디안)
   * [EN] Sets the X rotation value. (radians)
   *
   * @param value -
   * [KO] 설정할 회전값
   * [EN] Rotation value to set
   */
  set rotationY(value) {
    __privateSet(this, _rotationY, value);
  }
  /**
   * [KO] Z축 회전값을 반환합니다. (라디안)
   * [EN] Returns the Z rotation value. (radians)
   *
   * @returns
   * [KO] Z축 회전값
   * [EN] Z rotation value
   */
  get rotationZ() {
    return __privateGet(this, _rotationZ);
  }
  /**
   * [KO] Z축 회전값을 설정합니다. (라디안)
   * [EN] Sets the X rotation value. (radians)
   *
   * @param value -
   * [KO] 설정할 회전값
   * [EN] Rotation value to set
   */
  set rotationZ(value) {
    __privateSet(this, _rotationZ, value);
  }
  /**
   * [KO] 시야각(FOV)을 반환합니다. (도)
   * [EN] Returns the field of view. (degrees)
   *
   * @returns
   * [KO] 시야각
   * [EN] Field of view
   */
  get fieldOfView() {
    return __privateGet(this, _fieldOfView);
  }
  /**
   * [KO] 시야각(FOV)을 설정합니다. (도)
   * [EN] Sets the field of view. (degrees)
   *
   * @param value -
   * [KO] 설정할 시야각
   * [EN] Field of view to set
   */
  set fieldOfView(value) {
    validateNumber(value);
    __privateSet(this, _fieldOfView, value);
  }
  /**
   * [KO] 근평면(near) 거리를 반환합니다.
   * [EN] Returns the near clipping distance.
   *
   * @returns
   * [KO] 근평면 거리
   * [EN] Near clipping distance
   */
  get nearClipping() {
    return __privateGet(this, _nearClipping);
  }
  /**
   * [KO] 근평면(near) 거리를 설정합니다.
   * [EN] Sets the near clipping distance.
   *
   * @param value -
   * [KO] 설정할 근평면 거리
   * [EN] Near clipping distance to set
   */
  set nearClipping(value) {
    validateNumber(value);
    __privateSet(this, _nearClipping, value);
  }
  /**
   * [KO] 원평면(far) 거리를 반환합니다.
   * [EN] Returns the far clipping distance.
   *
   * @returns
   * [KO] 원평면 거리
   * [EN] Far clipping distance
   */
  get farClipping() {
    return __privateGet(this, _farClipping);
  }
  /**
   * [KO] 원평면(far) 거리를 설정합니다.
   * [EN] Sets the far clipping distance.
   *
   * @param value -
   * [KO] 설정할 원평면 거리
   * [EN] Far clipping distance to set
   */
  set farClipping(value) {
    validateNumber(value);
    __privateSet(this, _farClipping, value);
  }
  /**
   * [KO] 모델 행렬을 반환합니다.
   * [EN] Returns the model matrix.
   *
   * @returns
   * [KO] 모델 행렬
   * [EN] Model matrix
   */
  get viewMatrix() {
    return __privateGet(this, _viewMatrix);
  }
  /**
   * [KO] X 좌표를 반환합니다.
   * [EN] Returns the X coordinate.
   *
   * @returns
   * [KO] X 좌표
   * [EN] X coordinate
   */
  get x() {
    return __privateGet(this, _x);
  }
  /**
   * [KO] X 좌표를 설정합니다.
   * [EN] Sets the X coordinate.
   *
   * @param value -
   * [KO] 설정할 X 좌표
   * [EN] X coordinate to set
   */
  set x(value) {
    __privateSet(this, _x, value);
    __privateGet(this, _viewMatrix)[12] = value;
  }
  /**
   * [KO] Y 좌표를 반환합니다.
   * [EN] Returns the Y coordinate.
   *
   * @returns
   * [KO] Y 좌표
   * [EN] Y coordinate
   */
  get y() {
    return __privateGet(this, _y);
  }
  /**
   * [KO] Y 좌표를 설정합니다.
   * [EN] Sets the Y coordinate.
   *
   * @param value -
   * [KO] 설정할 Y 좌표
   * [EN] Y coordinate to set
   */
  set y(value) {
    __privateSet(this, _y, value);
    __privateGet(this, _viewMatrix)[13] = value;
  }
  /**
   * [KO] Z 좌표를 반환합니다.
   * [EN] Returns the Z coordinate.
   *
   * @returns
   * [KO] Z 좌표
   * [EN] Z coordinate
   */
  get z() {
    return __privateGet(this, _z);
  }
  /**
   * [KO] Z 좌표를 설정합니다.
   * [EN] Sets the Z coordinate.
   *
   * @param value -
   * [KO] 설정할 Z 좌표
   * [EN] Z coordinate to set
   */
  set z(value) {
    __privateSet(this, _z, value);
    __privateGet(this, _viewMatrix)[14] = value;
  }
  /**
   * [KO] 카메라 위치 (x, y, z)를 반환합니다.
   * [EN] Returns the camera position (x, y, z).
   *
   * @returns
   * [KO] [x, y, z] 좌표 배열
   * [EN] [x, y, z] coordinate array
   */
  get position() {
    return [__privateGet(this, _x), __privateGet(this, _y), __privateGet(this, _z)];
  }
  /**
   * [KO] 카메라 위치를 설정합니다.
   * [EN] Sets the camera position.
   *
   * ### Example
   * ```typescript
   * camera.setPosition(10, 5, 20);
   * camera.setPosition([10, 5, 20]);
   * ```
   *
   * @param x -
   * [KO] X 좌표 또는 [x, y, z] 배열
   * [EN] X coordinate or [x, y, z] array
   * @param y -
   * [KO] Y 좌표 (x가 배열인 경우 무시됨)
   * [EN] Y coordinate (ignored if x is an array)
   * @param z -
   * [KO] Z 좌표 (x가 배열인 경우 무시됨)
   * [EN] Z coordinate (ignored if x is an array)
   */
  setPosition(x2, y2, z2) {
    if (Array.isArray(x2)) {
      [__privateWrapper(this, _x)._, __privateWrapper(this, _y)._, __privateWrapper(this, _z)._] = x2;
    } else {
      __privateSet(this, _x, x2);
      __privateSet(this, _y, y2);
      __privateSet(this, _z, z2);
    }
    [__privateGet(this, _viewMatrix)[12], __privateGet(this, _viewMatrix)[13], __privateGet(this, _viewMatrix)[14]] = [__privateGet(this, _x), __privateGet(this, _y), __privateGet(this, _z)];
  }
  /**
   * [KO] 카메라가 특정 좌표를 바라보도록 회전시킵니다.
   * [EN] Rotates the camera to look at a specific coordinate.
   *
   * ### Example
   * ```typescript
   * camera.lookAt(0, 0, 0);
   * ```
   *
   * @param x -
   * [KO] 바라볼 대상의 X 좌표
   * [EN] Target X coordinate to look at
   * @param y -
   * [KO] 바라볼 대상의 Y 좌표
   * [EN] Target Y coordinate to look at
   * @param z -
   * [KO] 바라볼 대상의 Z 좌표
   * [EN] Target Z coordinate to look at
   */
  lookAt(x2, y2, z2) {
    const eye = [__privateGet(this, _x), __privateGet(this, _y), __privateGet(this, _z)];
    const target = [x2, y2, z2];
    const up = [__privateGet(this, _up)[0], __privateGet(this, _up)[1], __privateGet(this, _up)[2]];
    const dir = [target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]];
    const len = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1] + dir[2] * dir[2]);
    dir[0] /= len;
    dir[1] /= len;
    dir[2] /= len;
    const cross = [
      dir[1] * up[2] - dir[2] * up[1],
      dir[2] * up[0] - dir[0] * up[2],
      dir[0] * up[1] - dir[1] * up[0]
    ];
    const crossLen = Math.sqrt(cross[0] * cross[0] + cross[1] * cross[1] + cross[2] * cross[2]);
    if (crossLen < 1e-4) {
      up[2] = dir[1] > 0 ? 1 : -1;
      up[0] = 0;
      up[1] = 0;
    }
    lookAt(__privateGet(this, _viewMatrix), eye, target, up);
  }
}
_up = new WeakMap();
_viewMatrix = new WeakMap();
_x = new WeakMap();
_z = new WeakMap();
_y = new WeakMap();
_rotationX = new WeakMap();
_rotationY = new WeakMap();
_rotationZ = new WeakMap();
_fieldOfView = new WeakMap();
_nearClipping = new WeakMap();
_farClipping = new WeakMap();
const _AController = class _AController {
  /**
   * [KO] AController 인스턴스를 생성합니다.
   * [EN] Creates an instance of AController.
   *
   * @param redGPUContext -
   * [KO] RedGPU 컨텍스트
   * [EN] RedGPU Context
   * @param initInfo -
   * [KO] 컨트롤러 초기화 정보
   * [EN] Controller initialization info
   */
  constructor(redGPUContext, initInfo) {
    __privateAdd(this, _AController_instances);
    // ==================== 인스턴스 정보 ====================
    __privateAdd(this, _instanceId2);
    __privateAdd(this, _name2);
    __privateAdd(this, _redGPUContext);
    __privateAdd(this, _camera);
    __privateAdd(this, _initInfo);
    // ==================== 프레임 관리 ====================
    __privateAdd(this, _lastUpdateTime, -1);
    __privateAdd(this, _currentDeltaTime, 0);
    __privateAdd(this, _currentFrameViews, /* @__PURE__ */ new Set());
    __privateAdd(this, _keyboardProcessedThisFrame, false);
    // ==================== View 상태 ====================
    __privateAdd(this, _hoveredView, null);
    __privateAdd(this, _isDragging, false);
    // ==================== 입력 이벤트 관련 ====================
    __privateAdd(this, _eventTypeKeys);
    __privateAdd(this, _dragStartX, 0);
    __privateAdd(this, _dragStartY, 0);
    __privateAdd(this, _pinchStartDistance, 0);
    __privateAdd(this, _isMultiTouch, false);
    /**
     * [KO] 캔버스 상의 이벤트 좌표를 가져옵니다.
     * [EN] Gets the event coordinates on the canvas.
     *
     * @param e -
     * [KO] 마우스, 터치 또는 휠 이벤트
     * [EN] Mouse, touch, or wheel event
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     * @returns
     * [KO] {x, y} 좌표 객체
     * [EN] {x, y} coordinate object
     * @internal
     */
    __publicField(this, "getCanvasEventPoint", (e, redGPUContext) => {
      redGPUContext.htmlCanvas;
      const isMobile = redGPUContext.detector.isMobile;
      const rect = redGPUContext.boundingClientRect;
      const tX_key = "clientX";
      const tY_key = "clientY";
      let clientX;
      let clientY;
      if (isMobile) {
        const touch = e instanceof WheelEvent ? e : e.changedTouches[0];
        clientX = touch[tX_key];
        clientY = touch[tY_key];
      } else {
        const mouseEvent = e;
        clientX = mouseEvent[tX_key];
        clientY = mouseEvent[tY_key];
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    });
    /**
     * [KO] 입력 이벤트가 발생한 View를 찾습니다.
     * [EN] Finds the View where the input event occurred.
     *
     * @param e -
     * [KO] 마우스 또는 터치 이벤트
     * [EN] Mouse or touch event
     * @returns
     * [KO] 해당 View 또는 null
     * [EN] Corresponding View or null
     * @internal
     */
    __publicField(this, "findTargetViewByInputEvent", (e) => {
      const redGPUContext = __privateGet(this, _redGPUContext);
      redGPUContext.detector.isMobile;
      const { x: x2, y: y2 } = this.getCanvasEventPoint(e, redGPUContext);
      const scale = window.devicePixelRatio * redGPUContext.renderScale;
      const tX = x2 * scale;
      const tY = y2 * scale;
      let targetView = null;
      for (const view of this.redGPUContext.viewList) {
        const tViewRect = view.pixelRectObject;
        if (tViewRect.x < tX && tX < tViewRect.x + tViewRect.width && tViewRect.y < tY && tY < tViewRect.y + tViewRect.height) {
          targetView = view;
        }
      }
      return targetView;
    });
    // ==================== Private Helpers ====================
    /**
     * [KO] 두 터치 점 사이의 거리를 계산합니다.
     * [EN] Calculates the distance between two touch points.
     *
     * @param touches -
     * [KO] 터치 리스트
     * [EN] Touch list
     * @returns
     * [KO] 거리 값
     * [EN] Distance value
     * @internal
     */
    __privateAdd(this, _getTouchDistance, (touches) => {
      if (touches.length < 2)
        return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    });
    __privateAdd(this, _HD_hover, (e) => {
      if (__privateGet(_AController, _globalKeyboardActiveView) || __privateGet(this, _isDragging))
        return;
      __privateSet(this, _hoveredView, this.findTargetViewByInputEvent(e));
    });
    __privateAdd(this, _HD_down, (e) => {
      const targetView = this.findTargetViewByInputEvent(e);
      if (!targetView)
        return;
      if (!__privateGet(_AController, _globalKeyboardActiveView) && !__privateGet(this, _isDragging)) {
        __privateSet(this, _hoveredView, targetView);
      }
      const { redGPUContext } = this;
      const { moveKey, upKey } = __privateGet(this, _eventTypeKeys);
      const { x: x2, y: y2 } = this.getCanvasEventPoint(e, redGPUContext);
      __privateSet(this, _dragStartX, x2);
      __privateSet(this, _dragStartY, y2);
      if (e instanceof TouchEvent) {
        if (e.touches.length >= 2) {
          __privateSet(this, _isMultiTouch, true);
          __privateSet(this, _pinchStartDistance, __privateGet(this, _getTouchDistance).call(this, e.touches));
        } else {
          __privateSet(this, _isMultiTouch, false);
          __privateSet(this, _pinchStartDistance, 0);
        }
      }
      if (__privateGet(this, _currentFrameViews).has(targetView)) {
        __privateSet(this, _isDragging, true);
        __privateSet(_AController, _globalKeyboardActiveView, targetView);
        redGPUContext.htmlCanvas.addEventListener(moveKey, __privateGet(this, _HD_Move));
        window.addEventListener(upKey, __privateGet(this, _HD_up));
      }
    });
    __privateAdd(this, _HD_Move, (e) => {
      var _a, _b;
      if (e instanceof TouchEvent && e.touches.length >= 2) {
        __privateSet(this, _isMultiTouch, true);
        return;
      }
      __privateSet(this, _isMultiTouch, false);
      const { x: x2, y: y2 } = this.getCanvasEventPoint(e, __privateGet(this, _redGPUContext));
      const deltaX = x2 - __privateGet(this, _dragStartX);
      const deltaY = y2 - __privateGet(this, _dragStartY);
      __privateSet(this, _dragStartX, x2);
      __privateSet(this, _dragStartY, y2);
      (_b = (_a = __privateGet(this, _initInfo)).HD_Move) == null ? void 0 : _b.call(_a, deltaX, deltaY);
    });
    __privateAdd(this, _HD_touchPinch, (e) => {
      var _a, _b;
      if (e.touches.length < 2 || !__privateGet(this, _initInfo).HD_TouchPinch)
        return;
      if (!__privateGet(this, _isMultiTouch))
        return;
      e.preventDefault();
      const currentDistance = __privateGet(this, _getTouchDistance).call(this, e.touches);
      if (__privateGet(this, _pinchStartDistance) === 0) {
        __privateSet(this, _pinchStartDistance, currentDistance);
        return;
      }
      const targetView = this.findTargetViewByInputEvent(e);
      if (targetView.rawCamera !== __privateGet(this, _camera))
        return;
      const deltaScale = currentDistance / __privateGet(this, _pinchStartDistance);
      (_b = (_a = __privateGet(this, _initInfo)).HD_TouchPinch) == null ? void 0 : _b.call(_a, deltaScale);
      __privateSet(this, _pinchStartDistance, currentDistance);
    });
    __privateAdd(this, _HD_up, () => {
      const { htmlCanvas } = __privateGet(this, _redGPUContext);
      const { moveKey, upKey } = __privateGet(this, _eventTypeKeys);
      __privateSet(this, _isMultiTouch, false);
      __privateSet(this, _pinchStartDistance, 0);
      __privateSet(this, _isDragging, false);
      htmlCanvas.removeEventListener(moveKey, __privateGet(this, _HD_Move));
      window.removeEventListener(upKey, __privateGet(this, _HD_up));
    });
    __privateAdd(this, _HD_wheel, (e) => {
      var _a, _b;
      const targetView = this.findTargetViewByInputEvent(e);
      if (!targetView)
        return;
      if (targetView.rawCamera !== __privateGet(this, _camera))
        return;
      e.stopPropagation();
      e.preventDefault();
      (_b = (_a = __privateGet(this, _initInfo)).HD_Wheel) == null ? void 0 : _b.call(_a, e);
    });
    __privateSet(this, _redGPUContext, redGPUContext);
    __privateSet(this, _initInfo, initInfo || {});
    __privateSet(this, _camera, initInfo.camera || new PerspectiveCamera());
    const isMobile = __privateGet(this, _redGPUContext).detector.isMobile;
    __privateSet(this, _eventTypeKeys, {
      moveKey: isMobile ? "touchmove" : "mousemove",
      upKey: isMobile ? "touchend" : "mouseup",
      downKey: isMobile ? "touchstart" : "mousedown"
    });
    __privateMethod(this, _AController_instances, initListener_fn).call(this);
  }
  // ==================== Public Getters/Setters ====================
  /**
   * [KO] 컨트롤러의 이름을 반환합니다.
   * [EN] Returns the name of the controller.
   *
   * @returns
   * [KO] 컨트롤러 이름
   * [EN] Controller name
   */
  get name() {
    if (!__privateGet(this, _instanceId2))
      __privateSet(this, _instanceId2, InstanceIdGenerator.getNextId(this.constructor));
    return __privateGet(this, _name2) || `${this.constructor.name} Instance ${__privateGet(this, _instanceId2)}`;
  }
  /**
   * [KO] 컨트롤러의 이름을 설정합니다.
   * [EN] Sets the name of the controller.
   *
   * @param value -
   * [KO] 설정할 이름
   * [EN] Name to set
   */
  set name(value) {
    __privateSet(this, _name2, value);
  }
  /**
   * [KO] RedGPU 컨텍스트를 반환합니다.
   * [EN] Returns the RedGPU context.
   *
   * @returns
   * [KO] RedGPU 컨텍스트
   * [EN] RedGPU context
   */
  get redGPUContext() {
    return __privateGet(this, _redGPUContext);
  }
  /**
   * [KO] 이 컨트롤러가 제어하는 카메라를 반환합니다.
   * [EN] Returns the camera controlled by this controller.
   *
   * @returns
   * [KO] 제어 중인 카메라 (PerspectiveCamera 또는 OrthographicCamera)
   * [EN] Controlled camera (PerspectiveCamera or OrthographicCamera)
   */
  get camera() {
    return __privateGet(this, _camera);
  }
  /**
   * [KO] 카메라의 현재 월드 X 좌표를 가져옵니다.
   * [EN] Gets the camera's current world X coordinate.
   *
   * @returns
   * [KO] X 좌표
   * [EN] X coordinate
   */
  get x() {
    return this.camera.x;
  }
  /**
   * [KO] 카메라의 현재 월드 Y 좌표를 가져옵니다.
   * [EN] Gets the camera's current world Y coordinate.
   *
   * @returns
   * [KO] Y 좌표
   * [EN] Y coordinate
   */
  get y() {
    return this.camera.y;
  }
  /**
   * [KO] 카메라의 현재 월드 Z 좌표를 가져옵니다.
   * [EN] Gets the camera's current world Z coordinate.
   *
   * @returns
   * [KO] Z 좌표
   * [EN] Z coordinate
   */
  get z() {
    return this.camera.z;
  }
  // ==================== Protected - 파생 클래스 전용 ====================
  /**
   * [KO] 현재 마우스가 호버링 중인 View를 반환합니다.
   * [EN] Returns the View currently being hovered by the mouse.
   *
   * @returns
   * [KO] 호버링 중인 View 또는 null
   * [EN] Hovered View or null
   * @internal
   */
  get hoveredView() {
    return __privateGet(this, _hoveredView);
  }
  /**
   * [KO] 키보드 입력이 활성화된 View를 반환합니다.
   * [EN] Returns the View with active keyboard input.
   *
   * @returns
   * [KO] 키보드 활성 View 또는 null
   * [EN] Keyboard active View or null
   * @internal
   */
  get keyboardActiveView() {
    return __privateGet(_AController, _globalKeyboardActiveView);
  }
  /**
   * [KO] 키보드 입력이 활성화된 View를 설정합니다.
   * [EN] Sets the View with active keyboard input.
   *
   * @param value -
   * [KO] 설정할 View 또는 null
   * [EN] View to set or null
   * @internal
   */
  set keyboardActiveView(value) {
    __privateSet(_AController, _globalKeyboardActiveView, value);
    if (value === null) {
      __privateSet(_AController, _globalKeyboardActiveController, null);
    } else {
      __privateSet(_AController, _globalKeyboardActiveController, this);
    }
  }
  /**
   * [KO] 현재 컨트롤러가 키보드 입력을 처리 중인지 여부를 반환합니다.
   * [EN] Returns whether the current controller is processing keyboard input.
   *
   * @returns
   * [KO] 키보드 활성 컨트롤러 여부
   * [EN] Whether it is the keyboard active controller
   * @internal
   */
  get isKeyboardActiveController() {
    return __privateGet(_AController, _globalKeyboardActiveController) === this;
  }
  /**
   * [KO] 이번 프레임에서 키보드 입력이 이미 처리되었는지 여부를 반환합니다.
   * [EN] Returns whether keyboard input has already been processed in this frame.
   *
   * @returns
   * [KO] 처리 여부
   * [EN] Processing status
   * @internal
   */
  get keyboardProcessedThisFrame() {
    return __privateGet(this, _keyboardProcessedThisFrame);
  }
  /**
   * [KO] 이번 프레임에서 키보드 입력이 처리되었는지 여부를 설정합니다.
   * [EN] Sets whether keyboard input has been processed in this frame.
   *
   * @param value -
   * [KO] 설정할 처리 여부
   * [EN] Processing status to set
   * @internal
   */
  set keyboardProcessedThisFrame(value) {
    __privateSet(this, _keyboardProcessedThisFrame, value);
  }
  /**
   * [KO] 컨트롤러를 제거하고 이벤트 리스너를 해제합니다.
   * [EN] Destroys the controller and removes event listeners.
   */
  destroy() {
    const { moveKey, upKey, downKey } = __privateGet(this, _eventTypeKeys);
    const { htmlCanvas } = this.redGPUContext;
    htmlCanvas.removeEventListener(downKey, __privateGet(this, _HD_down));
    htmlCanvas.removeEventListener(moveKey, __privateGet(this, _HD_hover));
    htmlCanvas.removeEventListener(moveKey, __privateGet(this, _HD_Move));
    window.removeEventListener(upKey, __privateGet(this, _HD_up));
    if (__privateGet(this, _initInfo).HD_Wheel) {
      htmlCanvas.removeEventListener("wheel", __privateGet(this, _HD_wheel));
    }
  }
  // ==================== Update ====================
  /**
   * [KO] 컨트롤러 상태를 업데이트합니다. 파생 클래스에서 구현해야 합니다.
   * [EN] Updates the controller state. Must be implemented in derived classes.
   *
   * @param view -
   * [KO] 현재 View
   * [EN] Current View
   * @param time -
   * [KO] 현재 시간 (ms)
   * [EN] Current time (ms)
   * @param updateAnimation -
   * [KO] 애니메이션 업데이트 콜백 (deltaTime 전달)
   * [EN] Animation update callback (receives deltaTime)
   */
  update(view, time, updateAnimation) {
    if (__privateGet(this, _lastUpdateTime) !== time) {
      __privateSet(this, _currentDeltaTime, __privateGet(this, _lastUpdateTime) === -1 ? 0 : (time - __privateGet(this, _lastUpdateTime)) / 1e3);
      __privateSet(this, _lastUpdateTime, time);
      __privateGet(this, _currentFrameViews).clear();
      __privateSet(this, _keyboardProcessedThisFrame, false);
    }
    if (__privateGet(this, _currentFrameViews).has(view))
      return;
    __privateGet(this, _currentFrameViews).add(view);
    if (__privateGet(this, _initInfo).useKeyboard && this.keyboardActiveView && this.keyboardActiveView !== view)
      return;
    updateAnimation == null ? void 0 : updateAnimation(__privateGet(this, _currentDeltaTime));
  }
  /**
   * [KO] 키보드 입력이 있는지 체크하고 활성 View를 설정합니다.
   * [EN] Checks for keyboard input and sets the active View.
   *
   * @param view -
   * [KO] 현재 View
   * [EN] Current View
   * @param keyNameMapper -
   * [KO] 키 매핑 객체
   * [EN] Key mapping object
   * @returns
   * [KO] 키보드 입력 처리가 가능하면 true, 아니면 false
   * [EN] True if keyboard input processing is possible, otherwise false
   */
  checkKeyboardInput(view, keyNameMapper) {
    if (this.keyboardProcessedThisFrame)
      return false;
    const { keyboardKeyBuffer } = view.redGPUContext;
    let hasAnyKeyInput = false;
    for (const key in keyNameMapper) {
      if (keyboardKeyBuffer[keyNameMapper[key]]) {
        hasAnyKeyInput = true;
        break;
      }
    }
    if (!hasAnyKeyInput) {
      this.keyboardActiveView = null;
      return false;
    }
    if (!this.keyboardActiveView) {
      if (this.hoveredView === view) {
        this.keyboardActiveView = view;
      } else {
        return false;
      }
    }
    if (this.keyboardActiveView !== view)
      return false;
    this.keyboardProcessedThisFrame = true;
    return true;
  }
};
_globalKeyboardActiveView = new WeakMap();
_globalKeyboardActiveController = new WeakMap();
_instanceId2 = new WeakMap();
_name2 = new WeakMap();
_redGPUContext = new WeakMap();
_camera = new WeakMap();
_initInfo = new WeakMap();
_lastUpdateTime = new WeakMap();
_currentDeltaTime = new WeakMap();
_currentFrameViews = new WeakMap();
_keyboardProcessedThisFrame = new WeakMap();
_hoveredView = new WeakMap();
_isDragging = new WeakMap();
_eventTypeKeys = new WeakMap();
_dragStartX = new WeakMap();
_dragStartY = new WeakMap();
_pinchStartDistance = new WeakMap();
_isMultiTouch = new WeakMap();
_getTouchDistance = new WeakMap();
_AController_instances = new WeakSet();
// ==================== 마우스/터치 이벤트 핸들러 ====================
initListener_fn = function() {
  const { redGPUContext } = this;
  const { htmlCanvas } = redGPUContext;
  const { downKey, moveKey } = __privateGet(this, _eventTypeKeys);
  htmlCanvas.addEventListener(downKey, __privateGet(this, _HD_down));
  htmlCanvas.addEventListener(moveKey, __privateGet(this, _HD_hover));
  if (__privateGet(this, _initInfo).HD_Wheel) {
    htmlCanvas.addEventListener("wheel", __privateGet(this, _HD_wheel), { passive: false });
  }
  if (__privateGet(this, _initInfo).HD_TouchPinch) {
    htmlCanvas.addEventListener("touchmove", __privateGet(this, _HD_touchPinch), { passive: false });
  }
};
_HD_hover = new WeakMap();
_HD_down = new WeakMap();
_HD_Move = new WeakMap();
_HD_touchPinch = new WeakMap();
_HD_up = new WeakMap();
_HD_wheel = new WeakMap();
// ==================== Static - 전역 상태 ====================
/**
 * [KO] 전역 키보드 활성 View - 모든 컨트롤러 인스턴스에서 공유
 * [EN] Global keyboard active View - Shared across all controller instances
 */
__privateAdd(_AController, _globalKeyboardActiveView, null);
/**
 * [KO] 전역 키보드 활성 컨트롤러 - 어떤 컨트롤러가 키보드를 사용 중인지 추적
 * [EN] Global keyboard active controller - Tracks which controller is using the keyboard
 */
__privateAdd(_AController, _globalKeyboardActiveController, null);
let AController = _AController;
const SceneInfoView = ({ scene }) => {
  const { name, useBackgroundColor, backgroundColor } = scene;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Scene", subTitle: name, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useBackgroundColor", value: useBackgroundColor }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatRGBAItem, { label: "backgroundColor", value: backgroundColor.rgba })
  ] });
};
const ToneMappingView = ({ view, showLabel = true }) => {
  const { toneMappingManager } = view;
  if (!toneMappingManager) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontSize: "10px",
      color: "#666",
      fontWeight: "bold",
      marginBottom: "4px",
      marginTop: "4px"
    }, children: "TONE MAPPING" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Mode", value: toneMappingManager.mode }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Contrast", value: toneMappingManager.contrast.toFixed(2) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "Brightness", value: toneMappingManager.brightness.toFixed(2) })
  ] });
};
const ViewStateTab = ({ view, lastUpdateTime }) => {
  const {
    renderViewStateData,
    rawCamera,
    scene,
    useFrustumCulling,
    useDistanceCulling,
    camera
  } = view;
  const {
    usedVideoMemory,
    viewRenderCPURecordingTime,
    num3DGroups,
    num3DObjects,
    numInstances,
    numDrawCalls,
    numTriangles,
    numPoints,
    viewportSize
  } = renderViewStateData;
  const { x: x2, y: y2, width, height, pixelRectArray } = viewportSize;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Rendering Statistics", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "usedVideoMemory", value: formatBytes(usedVideoMemory), color: "#fdb48d", isBold: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "viewRenderCPURecordingTime", value: `${viewRenderCPURecordingTime.toFixed(2)}ms` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "num3DGroups", value: num3DGroups }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "num3DObjects", value: num3DObjects }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "numInstances", value: numInstances }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "numDrawCalls", value: numDrawCalls }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "numTriangles", value: numTriangles }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "numPoints", value: numPoints })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Culling Settings", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useFrustumCulling", value: useFrustumCulling }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useDistanceCulling", value: useDistanceCulling })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Viewport", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "x, y", value: `${formatNumber(x2)}, ${formatNumber(y2)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "width, height", value: `${width}, ${height}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "pixelRectArray", value: `[${pixelRectArray.join(", ")}]` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SceneInfoView, { scene }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "ToneMapping", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToneMappingView, { view, showLabel: false }) }),
    camera && (camera instanceof AController || camera.constructor.name.includes("Controller") || "camera" in camera && camera.camera !== camera) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Controller", subTitle: camera.name, children: [
      camera["distance"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "distance", value: formatNumber(camera["distance"]) }),
      camera["pan"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "pan", value: formatNumber(camera["pan"]) }),
      camera["tilt"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "tilt", value: formatNumber(camera["tilt"]) }),
      camera["zoom"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "zoom", value: formatNumber(camera["zoom"]) }),
      camera["centerX"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatItem,
        {
          label: "center",
          value: `${formatNumber(camera["centerX"])}, ${formatNumber(camera["centerY"])}, ${formatNumber(camera["centerZ"])}`
        }
      ),
      camera["targetX"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatItem,
        {
          label: "target",
          value: `${formatNumber(camera["targetX"])}, ${formatNumber(camera["targetY"] || 0)}, ${formatNumber(camera["targetZ"])}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Raw Camera", subTitle: rawCamera.name, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatItem,
        {
          label: "position",
          value: `${formatNumber(rawCamera.x)}, ${formatNumber(rawCamera.y)}, ${formatNumber(rawCamera.z || 0)}`
        }
      ),
      rawCamera["rotationX"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatItem,
        {
          label: "rotation",
          value: `${formatNumber(rawCamera["rotationX"])}, ${formatNumber(rawCamera["rotationY"])}, ${formatNumber(rawCamera["rotationZ"])}`
        }
      ),
      rawCamera["fieldOfView"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "fieldOfView", value: formatNumber(rawCamera["fieldOfView"]) }),
      rawCamera["zoom"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "zoom", value: formatNumber(rawCamera["zoom"]) }),
      rawCamera["nearClipping"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "nearClipping", value: formatNumber(rawCamera["nearClipping"]) }),
      rawCamera["farClipping"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "farClipping", value: formatNumber(rawCamera["farClipping"]) }),
      rawCamera["top"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatItem,
        {
          label: "top/bottom",
          value: `${formatNumber(rawCamera["top"])}, ${formatNumber(rawCamera["bottom"])}`
        }
      ),
      rawCamera["left"] !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatItem,
        {
          label: "left/right",
          value: `${formatNumber(rawCamera["left"])}, ${formatNumber(rawCamera["right"])}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useAutoExposure", value: rawCamera.useAutoExposure }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "ev100", value: formatNumber(rawCamera.ev100) }),
      !rawCamera.useAutoExposure && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "aperture", value: `f/${formatNumber(rawCamera.aperture)}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatItem,
          {
            label: "shutterSpeed",
            value: rawCamera.shutterSpeed >= 1 ? `${formatNumber(rawCamera.shutterSpeed)}s` : `1/${Math.round(1 / rawCamera.shutterSpeed)}s`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "iso", value: rawCamera.iso })
      ] })
    ] })
  ] });
};
const ViewCommandsTab = ({ view }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CommandBatchStatsView, { statsProp: view.renderViewStateData.commandBatchStats });
};
const PropertyInspector = reactExports.memo(({ target, depth = 0 }) => {
  useInspectorStore((state) => state.lastUpdateTime);
  if (depth > 3 || !target) return null;
  const filteredKeys = reactExports.useMemo(() => {
    const allKeys = /* @__PURE__ */ new Set();
    Object.getOwnPropertyNames(target).forEach((k2) => allKeys.add(k2));
    let proto = Object.getPrototypeOf(target);
    while (proto && proto !== Object.prototype) {
      Object.getOwnPropertyNames(proto).forEach((k2) => {
        const descriptor = Object.getOwnPropertyDescriptor(proto, k2);
        if (descriptor && (descriptor.get || typeof descriptor.value !== "function")) {
          allKeys.add(k2);
        }
      });
      proto = Object.getPrototypeOf(proto);
    }
    const blackList = [
      "constructor",
      "prototype",
      "length",
      "name",
      "view",
      "redGPUContext",
      "passList",
      "passListLength",
      "passIndex",
      "videoMemorySize",
      "outputTextureView",
      "shaderInfo",
      "storageInfo",
      "uniformsInfo",
      "systemUniformsInfo",
      "uniformBuffer"
    ];
    return Array.from(allKeys).filter((key) => {
      if (key.startsWith("#") || key.startsWith("_")) return false;
      if (blackList.includes(key)) return false;
      try {
        if (typeof target[key] === "function") return false;
      } catch (e) {
        return false;
      }
      return true;
    }).sort();
  }, [target]);
  if (filteredKeys.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "10px", color: "#666", paddingLeft: "8px" }, children: "No inspectable properties." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { paddingLeft: depth > 0 ? "12px" : "0" }, children: filteredKeys.map((key) => {
    let value;
    try {
      value = target[key];
    } catch (e) {
      return null;
    }
    const type = typeof value;
    if (value === null || value === void 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: key, value: "null" }, key);
    }
    if (type === "number") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: key, value: formatNumber(value) }, key);
    }
    if (type === "boolean") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: key, value }, key);
    }
    if (type === "string") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: key, value }, key);
    }
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] !== "object") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatItem,
          {
            label: key,
            value: `[${value.map((v2) => typeof v2 === "number" ? formatNumber(v2) : v2).join(", ")}]`
          },
          key
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleObject, { label: key, value, depth, typeLabel: "Array" }, key);
    }
    if (type === "object") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleObject, { label: key, value, depth, typeLabel: "Object" }, key);
    }
    return null;
  }) });
});
const CollapsibleObject = ({ label, value, depth, typeLabel }) => {
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "4px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => setIsExpanded(!isExpanded),
        style: headerStyle$1,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleButton, { isExpanded, style: { marginRight: "6px" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: COMMON_STYLES.label, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: typeHintStyle, children: [
            "(",
            typeLabel === "Array" ? `Array(${value.length})` : "object",
            ")"
          ] })
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: contentWrapperStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyInspector, { target: value, depth: depth + 1 }) })
  ] });
};
const headerStyle$1 = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
  fontSize: "11px",
  padding: "2px 0",
  userSelect: "none"
};
const typeHintStyle = {
  color: "#555",
  fontSize: "10px",
  fontStyle: "italic"
};
const contentWrapperStyle = {
  borderLeft: "1px solid rgba(255,255,255,0.1)",
  marginLeft: "5px",
  marginTop: "2px"
};
const ViewPostEffectsTab = ({ view, lastUpdateTime }) => {
  const { redGPUContext } = useInspectorStore();
  const { postEffectManager, rawCamera } = view;
  if (!postEffectManager) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: placeholderStyle$2, children: "PostEffectManager not available" });
  }
  const { antialiasingManager } = redGPUContext;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "General", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatItem, { label: "videoMemorySize", value: formatBytes(postEffectManager.videoMemorySize) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Built-in Effects", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useFXAA", value: antialiasingManager.useFXAA }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useTAA", value: antialiasingManager.useTAA }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useSSAO", value: postEffectManager.useSSAO }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "useSSR", value: postEffectManager.useSSR }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "Auto Exposure", value: rawCamera.useAutoExposure }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBoolItem, { label: "Sky Atmosphere", value: !!view.skyAtmosphere }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ToneMappingView, { view })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: `Custom Effects (${postEffectManager.effectList.length})`, children: [
      postEffectManager.effectList.map((effect, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleEffect, { effect }, i)),
      postEffectManager.effectList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: placeholderStyle$2, children: "No custom effects added." })
    ] })
  ] });
};
const CollapsibleEffect = ({ effect }) => {
  const [isExpanded, setIsExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: effectContainerStyle, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => setIsExpanded(!isExpanded),
        style: effectHeaderStyle,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleButton, { isExpanded, style: { marginRight: "8px" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: effectNameStyle, children: effect.constructor.name || "Unknown Effect" })
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: effectContentStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyInspector, { target: effect }) })
  ] });
};
const placeholderStyle$2 = {
  fontSize: "11px",
  color: "#666",
  fontStyle: "italic"
};
const effectContainerStyle = {
  marginBottom: "8px",
  background: "rgba(255,255,255,0.02)",
  borderRadius: "4px"
};
const effectHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 8px",
  cursor: "pointer",
  userSelect: "none",
  fontSize: "12px"
};
const effectNameStyle = {
  fontWeight: "bold",
  color: "#ddd"
};
const effectContentStyle = {
  padding: "8px",
  borderTop: "1px solid rgba(255,255,255,0.05)"
};
const ViewListView = () => {
  const { redGPUContext, lastUpdateTime } = useInspectorStore();
  const [activeViewIndex, setActiveViewIndex] = reactExports.useState("0");
  const [activeDetailTab, setActiveDetailTab] = reactExports.useState("STATE");
  if (!redGPUContext) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: placeholderStyle$1, children: "RedGPUContext not initialized" });
  }
  const { viewList } = redGPUContext;
  const activeView = viewList[parseInt(activeViewIndex)] || viewList[0];
  const viewTabs = viewList.map((view, index) => ({
    id: index.toString(),
    label: view.name || `View ${index}`
  }));
  const detailTabs = [
    { id: "STATE", label: "State" },
    { id: "COMMANDS", label: "Commands" },
    { id: "POSTEFFECTS", label: "PostEffects" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: containerStyle$2, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: stickyHeaderStyle, children: [
      viewList.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabBar,
        {
          tabs: viewTabs,
          activeTab: activeViewIndex,
          onTabChange: setActiveViewIndex,
          isSticky: false
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabBar,
        {
          tabs: detailTabs,
          activeTab: activeDetailTab,
          onTabChange: setActiveDetailTab,
          isSticky: false,
          style: { borderTop: "none" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: contentAreaStyle, children: [
      activeDetailTab === "STATE" && /* @__PURE__ */ jsxRuntimeExports.jsx(ViewStateTab, { view: activeView, lastUpdateTime }),
      activeDetailTab === "COMMANDS" && /* @__PURE__ */ jsxRuntimeExports.jsx(ViewCommandsTab, { view: activeView }),
      activeDetailTab === "POSTEFFECTS" && /* @__PURE__ */ jsxRuntimeExports.jsx(ViewPostEffectsTab, { view: activeView, lastUpdateTime })
    ] })
  ] });
};
const containerStyle$2 = {
  display: "flex",
  flexDirection: "column"
};
const stickyHeaderStyle = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "#111"
};
const contentAreaStyle = {
  padding: "12px"
};
const placeholderStyle$1 = {
  padding: "20px",
  textAlign: "center",
  color: "#666",
  fontSize: "12px",
  fontStyle: "italic"
};
const HierarchyItem = ({ node, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = reactExports.useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: depth > 0 ? "12px" : "0" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: itemHeaderStyle, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleButton,
        {
          isExpanded,
          onClick: () => hasChildren && setIsExpanded(!isExpanded),
          visible: hasChildren,
          style: { marginRight: "6px" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: contentStyle$1, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: nameStyle, children: node.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: typeStyle, children: node.type })
      ] })
    ] }),
    isExpanded && hasChildren && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: childrenContainerStyle, children: node.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx(HierarchyItem, { node: child, depth: depth + 1 }, child.id)) })
  ] });
};
const itemHeaderStyle = {
  display: "flex",
  alignItems: "center",
  padding: "4px 0",
  cursor: "default",
  fontSize: "12px",
  fontFamily: THEME.fontFamily
};
const contentStyle$1 = {
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
  flex: 1,
  minWidth: 0
};
const nameStyle = {
  color: "#eee",
  fontWeight: "bold",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};
const typeStyle = {
  color: "#666",
  fontSize: "10px",
  fontStyle: "italic"
};
const childrenContainerStyle = {
  borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
  marginLeft: "6px"
};
const SceneView = () => {
  const { hierarchy, redGPUContext, lastUpdateTime } = useInspectorStore();
  const viewNames = Object.keys(hierarchy);
  const [activeViewName, setActiveViewName] = reactExports.useState(viewNames[0] || "");
  if (viewNames.length === 0 || !redGPUContext) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: placeholderStyle, children: "No scene data available." });
  }
  const tabs = viewNames.map((name) => ({ id: name, label: name }));
  const activeViewInstance = redGPUContext.viewList.find((v2, idx) => {
    const name = v2.name || `View ${idx}`;
    return name === (activeViewName || viewNames[0]);
  });
  const activeHierarchy = hierarchy[activeViewName || viewNames[0]];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: containerStyle$1, children: [
    viewNames.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: tabWrapperStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabBar,
      {
        tabs,
        activeTab: activeViewName || viewNames[0],
        onTabChange: setActiveViewName,
        isSticky: false
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: contentStyle, children: [
      (activeViewInstance == null ? void 0 : activeViewInstance.scene) && /* @__PURE__ */ jsxRuntimeExports.jsx(SceneInfoView, { scene: activeViewInstance.scene }),
      activeHierarchy && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Scene Tree", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HierarchyItem, { node: activeHierarchy }) })
    ] })
  ] });
};
const containerStyle$1 = {
  display: "flex",
  flexDirection: "column"
};
const tabWrapperStyle = {
  background: "rgba(255,255,255,0.03)"
};
const contentStyle = {
  padding: "12px"
};
const placeholderStyle = {
  padding: "20px",
  textAlign: "center",
  color: "#666",
  fontSize: "12px",
  fontStyle: "italic"
};
const TabContent = reactExports.memo(() => {
  const currentTab = useInspectorStore((state) => state.currentTab);
  switch (currentTab) {
    case "STATE":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Container, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TotalState, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommandBatchStatsView, {})
      ] });
    case "HIERARCHY":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SceneView, {});
    case "CONTEXT":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Container, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RedGPUContextView, {}) });
    case "VIEWS":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ViewListView, {});
    case "RESOURCES":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Container, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourcesView, {}) });
    default:
      return null;
  }
});
const Container = ({ children, style }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...containerStyle, ...style }, children });
const containerStyle = {
  padding: "12px"
};
const App = () => {
  const useDebugPanel = useInspectorStore((state) => state.useDebugPanel);
  const setUseDebugPanel = useInspectorStore((state) => state.setUseDebugPanel);
  const { currentTab, setCurrentTab } = useInspectorStore();
  if (!useDebugPanel) return null;
  const tabs = [
    { id: "STATE", label: "State" },
    { id: "CONTEXT", label: "RedGPUContext" },
    { id: "VIEWS", label: "View" },
    { id: "HIERARCHY", label: "Scene" },
    { id: "RESOURCES", label: "Resources" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: panelStyle, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: headerStyle, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: titleLabelStyle, children: "Performance Monitor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setUseDebugPanel(false), style: closeBtnStyle, children: "CLOSE" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FPS, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { tabs, activeTab: currentTab, onTabChange: setCurrentTab, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabContent, {}) })
  ] });
};
const panelStyle = {
  position: "fixed",
  left: 0,
  top: 0,
  width: "400px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "white",
  fontFamily: "monospace",
  zIndex: 1e5,
  boxShadow: "0 0 20px rgba(0,0,0,0.5)",
  borderTopRightRadius: "8px",
  overflow: "hidden"
};
const headerStyle = {
  padding: "10px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.05)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
};
const titleLabelStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#fdb48d"
};
const closeBtnStyle = {
  backgroundColor: "#c00",
  color: "white",
  border: "none",
  padding: "4px 8px",
  cursor: "pointer",
  fontSize: "10px",
  fontWeight: "bold",
  borderRadius: "4px"
};
const getHierarchy = (container) => {
  const children = container.children || [];
  return {
    id: container.uuid || container.instanceId || Math.random().toString(),
    name: container.name || container.constructor.name,
    type: container.constructor.name,
    children: children.map((child) => getHierarchy(child))
  };
};
const collectStats = (redGPUContext, time) => {
  let totalNum3DGroups = 0;
  let totalNum3DObjects = 0;
  let totalNumInstances = 0;
  let totalNumDrawCalls = 0;
  let totalNumTriangles = 0;
  let totalNumPoints = 0;
  let totalUsedVideoMemory = 0;
  const aggregatedBatchStats = {};
  const hierarchy = {};
  const viewList = redGPUContext.viewList;
  const viewListLen = viewList.length;
  for (let i = 0; i < viewListLen; i++) {
    const view = viewList[i];
    const state = view.renderViewStateData;
    totalNum3DGroups += state.num3DGroups;
    totalNum3DObjects += state.num3DObjects;
    totalNumInstances += state.numInstances;
    totalNumDrawCalls += state.numDrawCalls;
    totalNumTriangles += state.numTriangles;
    totalNumPoints += state.numPoints;
    totalUsedVideoMemory += state.usedVideoMemory;
    if (view.scene) {
      hierarchy[view.name || `View ${i}`] = getHierarchy(view.scene);
    }
    if (state.commandBatchStats) {
      for (const phase in state.commandBatchStats) {
        const phaseStats = state.commandBatchStats[phase];
        if (!aggregatedBatchStats[phase]) {
          aggregatedBatchStats[phase] = {
            "Command Buffers": 0,
            "Render Passes": { count: 0, list: [] },
            "Compute Passes": { count: 0, list: [] },
            "Raw Usages": 0
          };
        }
        const agg = aggregatedBatchStats[phase];
        agg["Command Buffers"] += phaseStats["Command Buffers"];
        agg["Render Passes"].count += phaseStats["Render Passes"].count;
        const renderList = phaseStats["Render Passes"].list;
        const aggRenderList = agg["Render Passes"].list;
        for (let j = 0; j < renderList.length; j++) {
          if (aggRenderList.indexOf(renderList[j]) === -1) aggRenderList.push(renderList[j]);
        }
        agg["Compute Passes"].count += phaseStats["Compute Passes"].count;
        const computeList = phaseStats["Compute Passes"].list;
        const aggComputeList = agg["Compute Passes"].list;
        for (let j = 0; j < computeList.length; j++) {
          if (aggComputeList.indexOf(computeList[j]) === -1) aggComputeList.push(computeList[j]);
        }
        agg["Raw Usages"] += phaseStats["Raw Usages"];
      }
    }
  }
  const rm = redGPUContext.resourceManager;
  const resourceStats = {
    bitmapTexture: {
      count: rm.managedBitmapTextureState.table.size,
      videoMemory: rm.managedBitmapTextureState.videoMemory
    },
    cubeTexture: {
      count: rm.managedCubeTextureState.table.size,
      videoMemory: rm.managedCubeTextureState.videoMemory
    },
    hdrTexture: { count: rm.managedHDRTextureState.table.size, videoMemory: rm.managedHDRTextureState.videoMemory },
    uniformBuffer: {
      count: rm.managedUniformBufferState.table.size,
      videoMemory: rm.managedUniformBufferState.videoMemory
    },
    vertexBuffer: {
      count: rm.managedVertexBufferState.table.size,
      videoMemory: rm.managedVertexBufferState.videoMemory
    },
    indexBuffer: {
      count: rm.managedIndexBufferState.table.size,
      videoMemory: rm.managedIndexBufferState.videoMemory
    },
    storageBuffer: {
      count: rm.managedStorageBufferState.table.size,
      videoMemory: rm.managedStorageBufferState.videoMemory
    },
    gpuBuffer: { count: 0, videoMemory: 0 }
  };
  totalUsedVideoMemory += resourceStats.bitmapTexture.videoMemory;
  totalUsedVideoMemory += resourceStats.cubeTexture.videoMemory;
  totalUsedVideoMemory += resourceStats.hdrTexture.videoMemory;
  totalUsedVideoMemory += resourceStats.uniformBuffer.videoMemory;
  totalUsedVideoMemory += resourceStats.vertexBuffer.videoMemory;
  totalUsedVideoMemory += resourceStats.indexBuffer.videoMemory;
  totalUsedVideoMemory += resourceStats.storageBuffer.videoMemory;
  const gpuBufferMap = rm.resources.get("GPUBuffer");
  if (gpuBufferMap) {
    resourceStats.gpuBuffer.count = gpuBufferMap.size;
    resourceStats.gpuBuffer.videoMemory = gpuBufferMap.videoMemory || 0;
    totalUsedVideoMemory += resourceStats.gpuBuffer.videoMemory;
  }
  return {
    lastUpdateTime: time,
    totalNum3DGroups,
    totalNum3DObjects,
    totalNumInstances,
    totalNumDrawCalls,
    totalNumTriangles,
    totalNumPoints,
    totalUsedVideoMemory,
    pixelRectArray: redGPUContext.sizeManager.pixelRectArray,
    // Use reference if possible
    commandBatchStats: aggregatedBatchStats,
    hierarchy,
    resourceStats
  };
};
class RedGPUInspector {
  constructor(redGPUContext) {
    __publicField(this, "root", null);
    __publicField(this, "domRoot", null);
    __publicField(this, "rafId", null);
    __publicField(this, "redGPUContext", null);
    __publicField(this, "fpsMeter", new FPSMeter());
    this.redGPUContext = redGPUContext;
    useInspectorStore.getState().setRedGPUContext(redGPUContext);
    useInspectorStore.subscribe((state) => {
      if (state.useDebugPanel) {
        this.ensureMounted();
        this.startLoop();
      } else {
        this.stopLoop();
        this.unmount();
      }
    });
  }
  get useDebugPanel() {
    return useInspectorStore.getState().useDebugPanel;
  }
  set useDebugPanel(value) {
    useInspectorStore.getState().setUseDebugPanel(value);
  }
  /**
   * 엔진의 렌더 루프에서 호출됩니다.
   */
  render() {
    if (this.useDebugPanel) {
      this.ensureMounted();
      this.startLoop();
    }
  }
  startLoop() {
    if (this.rafId) return;
    const loop = (time) => {
      if (!this.useDebugPanel) {
        this.stopLoop();
        return;
      }
      this.updateStats(time);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
  stopLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  updateStats(time) {
    if (!this.redGPUContext) return;
    const stats = collectStats(this.redGPUContext, time);
    const fpsStats = this.fpsMeter.update(time);
    useInspectorStore.getState().setStats({
      ...stats,
      ...fpsStats || {}
    });
  }
  ensureMounted() {
    if (!this.domRoot) {
      this.domRoot = document.createElement("div");
      this.domRoot.className = "RedGPUDebugPanel-React";
      document.body.appendChild(this.domRoot);
      this.root = client.createRoot(this.domRoot);
      this.root.render(
        /* @__PURE__ */ jsxRuntimeExports.jsx(React$2.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
      );
    }
  }
  unmount() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.domRoot) {
      this.domRoot.remove();
      this.domRoot = null;
    }
  }
}
export {
  RedGPUInspector as default
};
