"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// decoder.js — centralized decoding helpers

// Normalizer helper (include this near the decoder or import from a shared util)
function toUint8Array(data) {
  if (!data) return null;
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (typeof data === 'string') {
    var clean = data.replace(/\s+/g, '');
    if (/^[0-9a-fA-F]+$/.test(clean) && clean.length % 2 === 0) {
      var out = new Uint8Array(clean.length / 2);
      for (var i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
      return out;
    }
    return new TextEncoder().encode(data);
  }
  try {
    return new Uint8Array(data);
  } catch (e) {
    return null;
  }
}

// Primary generalized decoder
function decodeSeedWordsFromData(_x) {
  return _decodeSeedWordsFromData.apply(this, arguments);
} // File wrapper that uses decodeQRFromFile and the generalized decoder
function _decodeSeedWordsFromData() {
  _decodeSeedWordsFromData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(input) {
    var bytes, wordsElectrum, res, valid, d, _iterator, _step, _step$value, name, candidate, _d, _iterator2, _step2, fn, _candidate, _d2, _t5, _t6, _t7, _t8, _t9, _t0;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          bytes = toUint8Array(input);
          if (!(!bytes || !(bytes instanceof Uint8Array))) {
            _context2.n = 1;
            break;
          }
          throw new Error('decodeSeedWordsFromData: input could not be normalized to Uint8Array');
        case 1:
          if (!(bytes.length !== 16)) {
            _context2.n = 2;
            break;
          }
          throw new Error(`Unsupported SeedQR format: ${bytes.length} bytes`);
        case 2:
          if (!(typeof decodeElectrumSeed === 'function')) {
            _context2.n = 6;
            break;
          }
          _context2.p = 3;
          wordsElectrum = decodeElectrumSeed(bytes, 'segwit');
          res = typeof checkElectrumChecksum === 'function' ? checkElectrumChecksum(wordsElectrum) : {
            ok: true
          };
          if (!(res && res.ok)) {
            _context2.n = 4;
            break;
          }
          return _context2.a(2, {
            type: 'electrum',
            words: wordsElectrum,
            version: res.version,
            bytes
          });
        case 4:
          _context2.n = 6;
          break;
        case 5:
          _context2.p = 5;
          _t5 = _context2.v;
        case 6:
          if (!(typeof decodeSeedQRPayload !== 'function')) {
            _context2.n = 7;
            break;
          }
          throw new Error('BIP39 decoder not available (decodeSeedQRPayload missing)');
        case 7:
          // helper to validate decoded result
          valid = d => d && Array.isArray(d.words) && d.words.length === 12; // try raw payload
          _context2.p = 8;
          _context2.n = 9;
          return decodeSeedQRPayload(bytes);
        case 9:
          d = _context2.v;
          if (!valid(d)) {
            _context2.n = 10;
            break;
          }
          return _context2.a(2, {
            type: 'seedqr',
            words: d.words,
            bytes
          });
        case 10:
          _context2.n = 12;
          break;
        case 11:
          _context2.p = 11;
          _t6 = _context2.v;
        case 12:
          if (!(window.helpers && typeof window.helpers.generateTransformedCandidates === 'function')) {
            _context2.n = 24;
            break;
          }
          _iterator = _createForOfIteratorHelper(window.helpers.generateTransformedCandidates(bytes));
          _context2.p = 13;
          _iterator.s();
        case 14:
          if ((_step = _iterator.n()).done) {
            _context2.n = 20;
            break;
          }
          _step$value = _step.value, name = _step$value.name, candidate = _step$value.bytes;
          _context2.p = 15;
          _context2.n = 16;
          return decodeSeedQRPayload(candidate);
        case 16:
          _d = _context2.v;
          if (!valid(_d)) {
            _context2.n = 17;
            break;
          }
          return _context2.a(2, {
            type: 'seedqr',
            words: _d.words,
            bytes: candidate,
            transform: name
          });
        case 17:
          _context2.n = 19;
          break;
        case 18:
          _context2.p = 18;
          _t7 = _context2.v;
        case 19:
          _context2.n = 14;
          break;
        case 20:
          _context2.n = 22;
          break;
        case 21:
          _context2.p = 21;
          _t8 = _context2.v;
          _iterator.e(_t8);
        case 22:
          _context2.p = 22;
          _iterator.f();
          return _context2.f(22);
        case 23:
          _context2.n = 35;
          break;
        case 24:
          if (!(window.helpers && typeof window.helpers.transformCandidates === 'function')) {
            _context2.n = 35;
            break;
          }
          _iterator2 = _createForOfIteratorHelper(window.helpers.transformCandidates());
          _context2.p = 25;
          _iterator2.s();
        case 26:
          if ((_step2 = _iterator2.n()).done) {
            _context2.n = 32;
            break;
          }
          fn = _step2.value;
          _context2.p = 27;
          _candidate = fn(bytes);
          _context2.n = 28;
          return decodeSeedQRPayload(_candidate);
        case 28:
          _d2 = _context2.v;
          if (!valid(_d2)) {
            _context2.n = 29;
            break;
          }
          return _context2.a(2, {
            type: 'seedqr',
            words: _d2.words,
            bytes: _candidate
          });
        case 29:
          _context2.n = 31;
          break;
        case 30:
          _context2.p = 30;
          _t9 = _context2.v;
        case 31:
          _context2.n = 26;
          break;
        case 32:
          _context2.n = 34;
          break;
        case 33:
          _context2.p = 33;
          _t0 = _context2.v;
          _iterator2.e(_t0);
        case 34:
          _context2.p = 34;
          _iterator2.f();
          return _context2.f(34);
        case 35:
          throw new Error('No supported decoder succeeded for provided bytes (BIP39 raw + transforms failed)');
        case 36:
          return _context2.a(2);
      }
    }, _callee2, null, [[27, 30], [25, 33, 34, 35], [15, 18], [13, 21, 22, 23], [8, 11], [3, 5]]);
  }));
  return _decodeSeedWordsFromData.apply(this, arguments);
}
function decodeSeedWordsFromFile(_x2) {
  return _decodeSeedWordsFromFile.apply(this, arguments);
} // Optional: accept low-level qr result (jsQR/ZXing) and decode
function _decodeSeedWordsFromFile() {
  _decodeSeedWordsFromFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(file) {
    var _yield$decodeQRFromFi, text, payload, bytes, input;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return decodeQRFromFile(file).catch(e => {
            throw e;
          });
        case 1:
          _yield$decodeQRFromFi = _context3.v;
          text = _yield$decodeQRFromFi.text;
          payload = _yield$decodeQRFromFi.payload;
          bytes = _yield$decodeQRFromFi.bytes;
          // decodeQRFromFile may return { text, payload } per earlier suggestion.
          // Accept either `payload` (canonical) or `bytes` (raw) for backward compatibility.
          input = payload || bytes;
          if (input) {
            _context3.n = 2;
            break;
          }
          throw new Error('QR decode failed or returned no binary payload');
        case 2:
          _context3.n = 3;
          return decodeSeedWordsFromData(input);
        case 3:
          return _context3.a(2, _context3.v);
      }
    }, _callee3);
  }));
  return _decodeSeedWordsFromFile.apply(this, arguments);
}
function decodeSeedWordsFromQRResult(_x3) {
  return _decodeSeedWordsFromQRResult.apply(this, arguments);
} // centralized result handler used by scanner, upload, decoder
function _decodeSeedWordsFromQRResult() {
  _decodeSeedWordsFromQRResult = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(qrResult) {
    var payload;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          // prefer centralized reader if available
          payload = typeof window.getPayload === 'function' ? window.getPayload({
            qr: qrResult,
            result: qrResult
          }) : null;
          if (payload) {
            _context4.n = 1;
            break;
          }
          throw new Error('getPayload produced no payload');
        case 1:
          _context4.n = 2;
          return decodeSeedWordsFromData(payload);
        case 2:
          return _context4.a(2, _context4.v);
      }
    }, _callee4);
  }));
  return _decodeSeedWordsFromQRResult.apply(this, arguments);
}
function handleDecodedResult(result) {
  if (!result || !Array.isArray(result.words)) {
    console.warn('handleDecodedResult called with invalid result', result);
    return;
  }
  var type = result.type || 'seedqr';
  var words = result.words;
  var bytes = result.bytes || new Uint8Array();
  var transform = result.transform || null;
  var version = result.version || null;
  var source = result.source || null;

  // canonical global state
  window.lastUpload = {
    type,
    words,
    bytes,
    transform,
    version,
    source
  };

  // populate word inputs
  var els = Array.from(document.querySelectorAll('#words input'));
  words.forEach((w, i) => {
    if (els[i]) els[i].value = w;
  });

  // enable clear button
  var clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.disabled = false;

  // structured debug log
  console.log('Decoded seed accepted', {
    type,
    wordsCount: words.length,
    transform,
    version,
    source,
    hex: window.helpers && window.helpers.bytesToHex ? window.helpers.bytesToHex(bytes, ' ') : undefined
  });

  // update UI
  if (typeof updateResults === 'function') updateResults();
}

// decoder.js — centralized adapter: accept Uint8Array payload and orchestrate decode + UI
window.handleDecodedBytes = window.handleDecodedBytes || (/*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(u8) {
    var ew, version, result, decoded, _result, fallback, _t, _t2, _t3, _t4;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          console.log('handleDecodedBytes start', {
            bytesLength: u8 && u8.length,
            time: Date.now()
          });
          _context.p = 1;
          if (!(typeof decodeElectrumSeed === 'function')) {
            _context.n = 6;
            break;
          }
          _context.p = 2;
          ew = decodeElectrumSeed(u8);
          if (!Array.isArray(ew)) {
            _context.n = 4;
            break;
          }
          version = typeof checkElectrumChecksum === 'function' ? (checkElectrumChecksum(ew) || {}).version : undefined;
          result = {
            type: 'electrum',
            words: ew,
            bytes: u8,
            version,
            source: 'camera'
          };
          if (!(typeof window.handleDecodedResult === 'function')) {
            _context.n = 3;
            break;
          }
          window.handleDecodedResult(result);
          return _context.a(2);
        case 3:
          window.lastUpload = result;
          if (typeof updateResults === 'function') updateResults();
          return _context.a(2);
        case 4:
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
        case 6:
          if (!(typeof window.decodeSeedWordsFromData === 'function')) {
            _context.n = 12;
            break;
          }
          _context.p = 7;
          _context.n = 8;
          return window.decodeSeedWordsFromData(u8);
        case 8:
          decoded = _context.v;
          if (!(decoded && Array.isArray(decoded.words))) {
            _context.n = 10;
            break;
          }
          _result = Object.assign({
            source: 'camera'
          }, decoded);
          if (!(typeof window.handleDecodedResult === 'function')) {
            _context.n = 9;
            break;
          }
          window.handleDecodedResult(_result);
          return _context.a(2);
        case 9:
          window.lastUpload = {
            type: _result.type || 'seedqr',
            words: _result.words,
            bytes: _result.bytes || u8,
            version: _result.version
          };
          if (typeof updateResults === 'function') updateResults();
          return _context.a(2);
        case 10:
          _context.n = 12;
          break;
        case 11:
          _context.p = 11;
          _t2 = _context.v;
          console.warn('handleDecodedBytes: decodeSeedWordsFromData failed', _t2);
        case 12:
          // 3) Final fallback: delegate to centralized UI handler if present, otherwise store raw bytes
          fallback = {
            type: 'camera',
            bytes: u8,
            source: 'camera'
          };
          if (!(typeof window.handleDecodedResult === 'function')) {
            _context.n = 15;
            break;
          }
          _context.p = 13;
          window.handleDecodedResult(fallback);
          return _context.a(2);
        case 14:
          _context.p = 14;
          _t3 = _context.v;
          console.error('handleDecodedResult fallback error', _t3);
        case 15:
          window.lastUpload = fallback;
          if (typeof updateResults === 'function') updateResults();
          _context.n = 17;
          break;
        case 16:
          _context.p = 16;
          _t4 = _context.v;
          console.error('handleDecodedBytes top-level error', _t4);
        case 17:
          _context.p = 17;
          return _context.f(17);
        case 18:
          return _context.a(2);
      }
    }, _callee, null, [[13, 14], [7, 11], [2, 5], [1, 16, 17, 18]]);
  }));
  return function (_x4) {
    return _ref.apply(this, arguments);
  };
}());

// Expose for other modules if desired
window.decodeSeedWordsFromData = window.decodeSeedWordsFromData || decodeSeedWordsFromData;
window.decodeSeedWordsFromFile = decodeSeedWordsFromFile;
window.decodeSeedWordsFromQRResult = decodeSeedWordsFromQRResult;
window.handleDecodedResult = window.handleDecodedResult || handleDecodedResult;