"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// electrum.js

// Known electrum v2 prefixes
var KNOWN_PREFIXES = {
  0x01: "electrum_standard",
  0x100: "electrum_segwit",
  0x101: "electrum_2fa",
  0x102: "electrum_2fa_segwit"
};

/**
 * Decode a QR file into Electrum seed words.
 * Electrum encodes 128 bits of entropy, no BIP39 checksum.
 */
function decodeElectrumSeedWordsFromFile(_x) {
  return _decodeElectrumSeedWordsFromFile.apply(this, arguments);
}
function _decodeElectrumSeedWordsFromFile() {
  _decodeElectrumSeedWordsFromFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(file) {
    var _yield$decodeQRFromFi, text, bytes, rawBox, hexBox, bitsBox, maybeWords, allValid, hex, bitString, i, byteIndex, bitIndexInByte, bit, utf8, words, bitPos, w, idx, b, absoluteBit, _byteIndex, _bitIndexInByte, _bit;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return decodeQRFromFile(file);
        case 1:
          _yield$decodeQRFromFi = _context.v;
          text = _yield$decodeQRFromFi.text;
          bytes = _yield$decodeQRFromFi.bytes;
          rawBox = document.getElementById("qrError");
          hexBox = document.getElementById("hex");
          bitsBox = document.getElementById("bits"); // Case 1: QR encodes words as text
          if (!(text && /^[\x20-\x7E]+$/.test(text))) {
            _context.n = 2;
            break;
          }
          maybeWords = text.trim().split(/\s+/).map(w => w.toLowerCase());
          allValid = maybeWords.length === 12 && maybeWords.every(w => WORDLIST.includes(w));
          if (!allValid) {
            _context.n = 2;
            break;
          }
          if (rawBox) rawBox.textContent = "Raw QR content:\n" + maybeWords.join(" ");
          if (hexBox) hexBox.textContent = "";
          if (bitsBox) bitsBox.textContent = "";
          return _context.a(2, maybeWords);
        case 2:
          if (!(bytes.length < 16)) {
            _context.n = 3;
            break;
          }
          throw new Error(`Binary Electrum SeedQR requires 16 bytes, got ${bytes.length}`);
        case 3:
          hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join(" ");
          bitString = "";
          for (i = 0; i < 128; i++) {
            byteIndex = i >> 3;
            bitIndexInByte = 7 - (i & 7);
            bit = bytes[byteIndex] >> bitIndexInByte & 1;
            bitString += bit ? "1" : "0";
          }
          if (rawBox) {
            utf8 = "";
            try {
              utf8 = new TextDecoder("iso-8859-1").decode(new Uint8Array(bytes));
            } catch (_unused) {
              utf8 = "[un-decodable binary]";
            }
            rawBox.textContent = "Raw QR content (latin-1):\n" + utf8 + "\n\nHex:\n" + hex;
          }
          if (hexBox) hexBox.textContent = hex;
          if (bitsBox) bitsBox.textContent = bitString;

          // Split into 11 bit indices
          words = [];
          bitPos = 0;
          for (w = 0; w < 12; w++) {
            idx = 0;
            for (b = 0; b < 11; b++) {
              absoluteBit = bitPos + b;
              _byteIndex = absoluteBit >> 3;
              _bitIndexInByte = 7 - (absoluteBit & 7);
              _bit = bytes[_byteIndex] >> _bitIndexInByte & 1;
              idx = idx << 1 | _bit;
            }
            bitPos += 11;
            words.push(WORDLIST[idx] || "???");
          }
          return _context.a(2, words);
      }
    }, _callee);
  }));
  return _decodeElectrumSeedWordsFromFile.apply(this, arguments);
}
function checkElectrumChecksum(words) {
  var seedStr = words.join(" ");
  var hmacHex = CryptoJS.HmacSHA512(CryptoJS.enc.Utf8.parse(seedStr), CryptoJS.enc.Utf8.parse("Seed version")).toString(CryptoJS.enc.Hex);

  // First 3 hex chars = 12 bits
  var first12bits = parseInt(hmacHex.substr(0, 3), 16);

  // Match against known hex prefixes
  var matched = null;
  for (var _i = 0, _Object$entries = Object.entries(KNOWN_PREFIXES); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      hexCode = _Object$entries$_i[0],
      label = _Object$entries$_i[1];
    if (first12bits === parseInt(hexCode)) {
      matched = {
        code: hexCode,
        label
      };
      break;
    }
  }
  return {
    ok: !!matched,
    version: matched ? matched.label : null,
    expected: matched ? matched.code : null,
    actual: first12bits,
    hmacFirst3Hex: hmacHex.substr(0, 3)
  };
}

// Pack 12 indices into 128 bit entropy slice (for QR or display)
function packElectrumIndices(indices) {
  if (!Array.isArray(indices) || indices.length !== 12) {
    throw new Error("Expected 12 indices for Electrum seed");
  }
  var fullBitstr = indices.map(i => i.toString(2).padStart(11, "0")).join("");
  var bitstr = fullBitstr.slice(0, 128);
  var bytes = new Uint8Array(16);
  for (var i = 0; i < 16; i++) {
    bytes[i] = parseInt(bitstr.slice(i * 8, i * 8 + 8), 2);
  }
  return {
    bitstr,
    bytes
  };
}

/**
 * Simple validator wrapper for Electrum seeds.
 * Delegates to checkElectrumChecksum and returns a minimal result.
 */
function isValidElectrumSeed(words) {
  var res = checkElectrumChecksum(words);
  return {
    ok: res.ok,
    version: res.version
  };
}
function isElectrumPayload(bytes) {
  // Electrum seeds are 16 bytes, but not valid BIP39 entropy.
  // Simple heuristic: try decoding and checksum validation.
  try {
    var words = decodeElectrumSeed(bytes);
    var res = checkElectrumChecksum(words);
    return res.ok;
  } catch (e) {
    return false;
  }
}
function decodeElectrumSeed(bytes) {
  var versionTag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "segwit";
  if (!(bytes instanceof Uint8Array) || bytes.length !== 16) {
    throw new Error(`Electrum payload must be 16 bytes, got ${bytes.length}`);
  }

  // Build 128-bit stream
  var bitstr = "";
  for (var i = 0; i < bytes.length; i++) {
    bitstr += bytes[i].toString(2).padStart(8, "0");
  }

  // First 11 indices (121 bits)
  var indices = [];
  for (var w = 0; w < 11; w++) {
    var slice = bitstr.slice(w * 11, (w + 1) * 11);
    indices.push(parseInt(slice, 2));
  }

  // Last word: 7 known bits + brute-force 4 bits
  var lastPrefixBits = bitstr.slice(11 * 11, 11 * 11 + 7);
  for (var suffix = 0; suffix < 16; suffix++) {
    var lastBits = lastPrefixBits + suffix.toString(2).padStart(4, "0");
    var lastIdx = parseInt(lastBits, 2);
    var words = indices.map(i => WORDLIST[i]).concat(WORDLIST[lastIdx]);
    var res = checkElectrumChecksum(words);
    if (res && res.ok) {
      // Return canonical words array (callers expect an Array).
      // Callers that need version can call checkElectrumChecksum(words).
      return words;
    }
  }
  throw new Error("No valid Electrum checksum found");
}