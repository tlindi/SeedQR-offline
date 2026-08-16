"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// seedqr.js

// Build Compact SeedQR payload from 12 BIP39 words
function buildCompactSeedQRPayload(words) {
  if (!Array.isArray(words) || words.length !== 12) {
    throw new Error("Expected 12 words for BIP39 Compact SeedQR");
  }

  // Map words to indices
  var indices = words.map(w => WORDLIST.indexOf(w));
  if (indices.some(i => i < 0)) {
    throw new Error("One or more words not found in WORDLIST");
  }

  // Build 132-bit string (12 * 11 bits)
  var bitstr132 = indices.map(i => i.toString(2).padStart(11, "0")).join("");

  // Take the first 128 bits (entropy)
  var entropyBits = bitstr132.slice(0, 128);

  // Pack into 16 bytes
  var bytes = new Uint8Array(16);
  for (var i = 0; i < 16; i++) {
    bytes[i] = parseInt(entropyBits.slice(i * 8, (i + 1) * 8), 2);
  }

  // Return 16-byte payload and full 132-bit string for debugging
  return {
    bytes,
    bitstr: bitstr132
  };
}

// Convert 16-byte payload to 128-bit string
function toBitstr128(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length !== 16) {
    throw new Error(`Expected 16-byte Compact SeedQR payload, got ${bytes.length}`);
  }
  var bitstr = "";
  for (var i = 0; i < 16; i++) {
    bitstr += bytes[i].toString(2).padStart(8, "0");
  }
  return bitstr;
}

// Decode 132 bits → 12 word indices
function bitstrToBip39Words(bitstr132) {
  var words = [];
  var pos = 0;
  for (var w = 0; w < 12; w++) {
    var idx = 0;
    for (var b = 0; b < 11; b++) {
      idx = idx << 1 | (bitstr132[pos + b] === "1" ? 1 : 0);
    }
    pos += 11;
    words.push(WORDLIST[idx] || "???");
  }
  return words;
}

// Decode SeedQR payload (16 bytes → 12 words with recomputed checksum)
function decodeSeedQRPayload(_x) {
  return _decodeSeedQRPayload.apply(this, arguments);
}
function _decodeSeedQRPayload() {
  _decodeSeedQRPayload = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(bytes) {
    var bitstr128, i, buf, hash, checksumBits, bitstr132, words;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(!(bytes instanceof Uint8Array) || bytes.length !== 16)) {
            _context.n = 1;
            break;
          }
          throw new Error(`Expected 16-byte Compact SeedQR payload, got ${bytes.length}`);
        case 1:
          // Step 1: Convert to 128-bit string
          bitstr128 = "";
          for (i = 0; i < 16; i++) {
            bitstr128 += bytes[i].toString(2).padStart(8, "0");
          }

          // Step 2: Recompute checksum nibble (first 4 bits of SHA-256(entropy))
          _context.n = 2;
          return crypto.subtle.digest("SHA-256", bytes);
        case 2:
          buf = _context.v;
          hash = new Uint8Array(buf);
          checksumBits = ((hash[0] & 0xF0) >> 4).toString(2).padStart(4, "0"); // Step 3: Append checksum bits → full 132-bit stream
          bitstr132 = bitstr128 + checksumBits; // Step 4: Split into 12×11-bit indices → words
          words = bitstrToBip39Words(bitstr132);
          return _context.a(2, {
            words,
            bitstr: bitstr132
          });
      }
    }, _callee);
  }));
  return _decodeSeedQRPayload.apply(this, arguments);
}