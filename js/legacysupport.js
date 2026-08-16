// js/legacysupport.js
// Legacy shims (ES5-safe). Load this BEFORE other scripts in index.html.

// 0) Object.setPrototypeOf shim for old browsers (Chrome 49, Firefox 44–47)
if (typeof Object.setPrototypeOf !== 'function') {
  Object.setPrototypeOf = function(obj, proto) {
    // vanhoissa selaimissa __proto__ on vielä tuettu
    obj.__proto__ = proto;
    return obj;
  };
}

// 1) globalThis shim - complex orifinal
// if (typeof globalThis === 'undefined') {
//// In browsers, globalThis can be window
//  try {
//    if (typeof window !== 'undefined') {
//      window.globalThis = window;
//    } else if (typeof self !== 'undefined') {
//      self.globalThis = self;
//    } else {
//      // best-effort fallback
//      this.globalThis = this;
//    }
//  } catch (e) {
//    try { this.globalThis = this; } catch (e2) { /* ignore */ }
//  }
//}
// 1) globalThis shim - more simple new 
if (typeof globalThis === 'undefined') {
  window.globalThis = window;
}


// 2) NodeList.forEach
if (typeof NodeList !== 'undefined' && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    if (this == null) { throw new TypeError('NodeList.prototype.forEach called on null or undefined'); }
    var T = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(T, this[i], i, this);
    }
  };
}

// 2b) HTMLCollection.forEach
if (typeof HTMLCollection !== 'undefined' && !HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = function (callback, thisArg) {
    if (this == null) { throw new TypeError('HTMLCollection.prototype.forEach called on null or undefined'); }
    var T = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(T, this[i], i, this);
    }
  };
}

// 3) Array.from (minimal for array-like objects)
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) { return typeof fn === 'function' || toStr.call(fn) === '[object Function]'; };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    return function from(arrayLike /*, mapFn, thisArg */) {
      var C = this;
      if (arrayLike == null) { throw new TypeError('Array.from requires an array-like object - not null or undefined'); }
      var items = Object(arrayLike);
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        if (!isCallable(mapFn)) { throw new TypeError('Array.from: when provided, the second argument must be a function'); }
        if (arguments.length > 2) { T = arguments[2]; }
      }
      var len = toLength(items.length);
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
      var k = 0;
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      A.length = len;
      return A;
    };
  }());
}

// 4) CustomEvent polyfill
(function () {
  if (typeof window === 'undefined') return;
  if (typeof window.CustomEvent === 'function') return;
  function CustomEventPoly(typeArg, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt;
    try {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(typeArg, params.bubbles, params.cancelable, params.detail);
    } catch (e) {
      evt = document.createEventObject();
      evt.type = typeArg;
      evt.bubbles = !!params.bubbles;
      evt.cancelable = !!params.cancelable;
      evt.detail = params.detail;
    }
    return evt;
  }
  CustomEventPoly.prototype = (window.Event || Object).prototype;
  window.CustomEvent = CustomEventPoly;
}());

// 5) Event constructor shim (IE)
if (typeof window !== 'undefined' && typeof window.Event !== 'function') {
  (function () {
    function EventPoly(type, params) {
      params = params || { bubbles: false, cancelable: false };
      var e;
      try {
        e = document.createEvent('Event');
        e.initEvent(type, params.bubbles, params.cancelable);
      } catch (err) {
        e = document.createEventObject();
        e.type = type;
      }
      return e;
    }
    EventPoly.prototype = (window.Event || Object).prototype;
    window.Event = EventPoly;
  }());
}

// 6) Minimal TextEncoder / TextDecoder polyfill (basic UTF-8)
(function () {
  if (typeof window === 'undefined') return;
  if (typeof window.TextEncoder === 'undefined') {
    function TextEncoderPoly() {}
    TextEncoderPoly.prototype.encode = function (str) {
      if (str === undefined || str === null) str = '';
      var encodedStr = encodeURIComponent(String(str)).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
      });
      var u8 = new Uint8Array(encodedStr.length);
      for (var i = 0; i < encodedStr.length; i++) u8[i] = encodedStr.charCodeAt(i);
      return u8;
    };
    window.TextEncoder = TextEncoderPoly;
  }
  if (typeof window.TextDecoder === 'undefined') {
    function TextDecoderPoly() {}
    TextDecoderPoly.prototype.decode = function (u8) {
      if (!u8) return '';
      var s = '';
      for (var i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
      try { return decodeURIComponent(escape(s)); } catch (e) { return s; }
    };
    window.TextDecoder = TextDecoderPoly;
  }
}());

// 7) getUserMedia fallback for legacy browsers
(function() {
  const nav = navigator;
  if (!nav.mediaDevices) {
    nav.mediaDevices = {};
  }
  if (!nav.mediaDevices.getUserMedia) {
    nav.mediaDevices.getUserMedia = function(constraints) {
      const legacy = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia;
      if (!legacy) {
        return Promise.reject(new Error("getUserMedia not supported in this browser"));
      }
      return new Promise((resolve, reject) => {
        legacy.call(nav, constraints, resolve, reject);
      });
    };
  }
})();
