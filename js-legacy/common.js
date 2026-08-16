"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
//common.js 

// --- Constants ---
// Wallet type labels
var WALLET_TYPES = {
  electrum_standard: "Electrum",
  electrum_segwit: "Electrum (segwit)",
  electrum_2fa: "Electrum (2FA)",
  electrum_2fa_segwit: "Electrum (2FA Segwit)",
  seedqr: "BIP39 SeedQR"
};

// Helper: assign payload + bitstring and show indices in debug mode
function setPayloadAndIndices(bytes, bitstr, words, bytesPre, hexPre, bitsPre) {
  payloadBytes = bytes;
  bitstrToRender = bitstr;

  // Always render payload view
  renderPayload(payloadBytes, bitstrToRender, bytesPre, hexPre, bitsPre);

  // Show decimal word indices
  var indexBox = document.getElementById('wordIndices');
  if (indexBox) {
    var indices = words.map(w => {
      var idx = WORDLIST.indexOf(w);
      return idx.toString().padStart(4, "0");
    });
    indexBox.textContent = "# Standard SeedQR digit stream:\n" + indices.join(" ");
  }
}
function computeChecksum(_x, _x2, _x3) {
  return _computeChecksum.apply(this, arguments);
}
function _computeChecksum() {
  _computeChecksum = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(seedType, words, bitstr) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(seedType === "bip39")) {
            _context.n = 2;
            break;
          }
          _context.n = 1;
          return checkBIP39Checksum(words);
        case 1:
          return _context.a(2, _context.v);
        case 2:
          return _context.a(2, checkElectrumChecksum(words, bitstr));
        case 3:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _computeChecksum.apply(this, arguments);
}
function detectSeedType(words, bitstr) {
  // Try BIP39
  var bip39 = isValidBIP39Seed(words, bitstr);
  if (bip39.ok) {
    return {
      type: "bip39",
      walletType: "N/A"
    };
  }

  // Try Electrum
  var electrum = isValidElectrumSeed(words);
  if (electrum.ok) {
    return {
      type: "electrum",
      walletType: electrum.version || "unknown"
    };
  }

  // Neither matched
  return {
    type: "Unknown",
    walletType: "N/A"
  };
}
function renderStatus(seedType, result, statusEl, debug) {
  if (!result.ok && !debug) {
    statusEl.textContent = `${seedType} checksum mismatch. Got=${result.actual}, Expected=${result.expected}.`;
    statusEl.className = 'err';
    return false;
  }
  if (result.ok) {
    statusEl.textContent = `OK: ${seedType} checksum valid (${result.actual}).`;
    statusEl.className = 'ok';
  } else {
    statusEl.textContent = `Debug mode: ${seedType} checksum mismatch. Got=${result.actual}, Expected=${result.expected}.`;
    statusEl.className = 'err';
  }
  return true;
}
function renderWalletType(seedType, result, versionEl) {
  if (!versionEl) return;
  if (seedType === "bip39") {
    versionEl.textContent = "BIP39 SeedQR";
  } else if (seedType === "electrum") {
    var map = {
      electrum_standard: "Electrum (Standard)",
      electrum_segwit: "Electrum (Segwit)",
      electrum_2fa: "Electrum (2FA)",
      electrum_2fa_segwit: "Electrum (2FA Segwit)"
    };
    versionEl.textContent = map[result.version] || "Electrum";
  } else {
    versionEl.textContent = "Unknown";
  }
}
function updateResults() {
  return _updateResults.apply(this, arguments);
}
function _updateResults() {
  _updateResults = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var status, bytesPre, pbytesPre, hexPre, bitsPre, versionEl, resultsEl, els, _getWordsAndIndices, _words, indices, seedType, bip39Res, electrumRes, _buildCompactSeedQRPa, bytes, bitstr, bitstr128, _packElectrumIndices, _bitstr, _bytes, _window$lastUpload, type, _bytes2, version, _bitstr2, i, _bitstr3, _yield$decodeSeedQRPa, _bitstr4, _buildCompactSeedQRPa2, _bytes3, _bitstr5, _bitstr6, packed, result, filename, vkey, map, inputs, words, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          console.log('updateResults start', {
            lastUpload: window.lastUpload
          });
          status = document.getElementById('status');
          bytesPre = document.getElementById('bytes');
          pbytesPre = document.getElementById('pbytes');
          hexPre = document.getElementById('hex');
          bitsPre = document.getElementById('bits');
          versionEl = document.getElementById('version');
          resultsEl = document.getElementById('resultsCard'); // Require all 12 words
          els = Array.from(document.querySelectorAll('#words input'));
          if (els.every(e => e.value.trim())) {
            _context2.n = 1;
            break;
          }
          resultsEl.style.display = 'none';
          status.textContent = "";
          return _context2.a(2);
        case 1:
          _context2.p = 1;
          _getWordsAndIndices = getWordsAndIndices(), _words = _getWordsAndIndices.words, indices = _getWordsAndIndices.indices;
          seedType = "Unknown";
          bip39Res = null;
          electrumRes = null; // --- Debug overrides ---
          if (!(debug === "bip39")) {
            _context2.n = 3;
            break;
          }
          console.log('updateResults Debug overrides - bip39', {
            lastUpload: window.lastUpload
          });
          _buildCompactSeedQRPa = buildCompactSeedQRPayload(_words), bytes = _buildCompactSeedQRPa.bytes, bitstr = _buildCompactSeedQRPa.bitstr;
          bitstr128 = bitstr.slice(0, 128);
          _context2.n = 2;
          return checkBIP39Checksum(_words, bitstr128);
        case 2:
          bip39Res = _context2.v;
          seedType = "bip39";
          setPayloadAndIndices(bytes, bitstr, _words, bytesPre, hexPre, bitsPre);
          _context2.n = 4;
          break;
        case 3:
          if (debug === "electrum" || debug === "electrum_2fa") {
            console.log('updateResults Debug overrides - electrum/electrum_2fa', {
              lastUpload: window.lastUpload
            });
            _packElectrumIndices = packElectrumIndices(indices), _bitstr = _packElectrumIndices.bitstr, _bytes = _packElectrumIndices.bytes;
            electrumRes = checkElectrumChecksum(_words);
            seedType = "electrum";
            electrumRes.version = electrumRes.version || "electrum_standard";
            setPayloadAndIndices(_bytes, _bitstr, _words, bytesPre, hexPre, bitsPre);
          }
        case 4:
          if (debug) {
            _context2.n = 12;
            break;
          }
          console.log('Normal detection upload - non debug mode', {
            lastUpload: window.lastUpload
          });
          if (!(window.lastUpload && window.lastUpload.words.join(" ") === _words.join(" "))) {
            _context2.n = 10;
            break;
          }
          _window$lastUpload = window.lastUpload, type = _window$lastUpload.type, _bytes2 = _window$lastUpload.bytes, version = _window$lastUpload.version;
          if (!(type === "electrum")) {
            _context2.n = 5;
            break;
          }
          console.log('Normal detection upload - non debug mode - electrum', {
            lastUpload: window.lastUpload
          });
          electrumRes = checkElectrumChecksum(_words);
          seedType = "electrum";
          payloadBytes = _bytes2;
          _bitstr2 = "";
          for (i = 0; i < _bytes2.length; i++) {
            _bitstr2 += _bytes2[i].toString(2).padStart(8, "0");
          }
          bitstrToRender = _bitstr2;
          if (!electrumRes.version) electrumRes.version = "electrum_standard";
          _context2.n = 9;
          break;
        case 5:
          if (!(type === "seedqr")) {
            _context2.n = 8;
            break;
          }
          console.log('Normal detection upload - non debug mode - seedqr', {
            lastUpload: window.lastUpload
          });
          _bitstr3 = indices.map(i => i.toString(2).padStart(11, "0")).join("").slice(0, 128);
          _context2.n = 6;
          return checkBIP39Checksum(_words, _bitstr3);
        case 6:
          bip39Res = _context2.v;
          seedType = "bip39";
          payloadBytes = _bytes2;
          // recompute checksum and append for rendering
          _context2.n = 7;
          return decodeSeedQRPayload(_bytes2);
        case 7:
          _yield$decodeSeedQRPa = _context2.v;
          _bitstr4 = _yield$decodeSeedQRPa.bitstr;
          bitstrToRender = _bitstr4;
          _context2.n = 9;
          break;
        case 8:
          seedType = "Unknown";
        case 9:
          _context2.n = 12;
          break;
        case 10:
          // --- Fallback detection ---
          console.log('Fallback detection', {
            lastUpload: window.lastUpload
          });
          _buildCompactSeedQRPa2 = buildCompactSeedQRPayload(_words), _bytes3 = _buildCompactSeedQRPa2.bytes, _bitstr5 = _buildCompactSeedQRPa2.bitstr;
          _bitstr6 = _bitstr5.slice(0, 128);
          _context2.n = 11;
          return checkBIP39Checksum(_words, _bitstr6);
        case 11:
          bip39Res = _context2.v;
          if (bip39Res.ok) {
            console.log('Fallback detection - bip39Res.ok', {
              lastUpload: window.lastUpload
            });
            seedType = "bip39";
            payloadBytes = _bytes3;
            bitstrToRender = _bitstr5;
            renderPayload(payloadBytes, bitstrToRender, bytesPre, hexPre, bitsPre, pbytesPre);
            hideCard('upload');
            hideCard('camera');
            showCard('results');
          } else {
            electrumRes = checkElectrumChecksum(_words);
            if (electrumRes.ok) {
              console.log('Fallback detection - electrumRes.ok', {
                lastUpload: window.lastUpload
              });
              seedType = "electrum";
              packed = packElectrumIndices(indices);
              payloadBytes = packed.bytes;
              bitstrToRender = packed.bitstr;
              renderPayload(payloadBytes, bitstrToRender, bytesPre, hexPre, bitsPre, pbytesPre);
              hideCard('upload');
              hideCard('camera');
              showCard('results');
            } else {
              console.log('Fallback detection - else', {
                lastUpload: window.lastUpload
              });
              seedType = "Unknown";
              payloadBytes = null;
              bitstrToRender = "";
            }
          }
        case 12:
          result = seedType === "bip39" ? bip39Res : seedType === "electrum" ? electrumRes : {
            ok: false,
            expected: null,
            actual: null
          };
          renderPayload(payloadBytes, bitstrToRender, bytesPre, hexPre, bitsPre, pbytesPre);
          renderStatus(seedType, result, status, debug);
          renderWalletType(seedType, result, versionEl);

          // --- update download filename using download.js API (keeps sanitization and blob handling centralized) ---
          try {
            filename = 'SeedQR';
            if (seedType === 'bip39') {
              filename = 'SeedQR BIP39';
            } else if (seedType === 'electrum') {
              vkey = result && result.version ? result.version : electrumRes && electrumRes.version ? electrumRes.version : 'electrum_standard';
              map = {
                electrum_standard: 'Electrum',
                electrum_segwit: 'Electrum (Segwit)',
                electrum_2fa: 'Electrum (2FA)',
                electrum_2fa_segwit: 'Electrum (2FA Segwit)'
              };
              filename = 'SeedQR ' + (map[vkey] || 'Electrum');
            } else {
              filename = 'SeedQR Unknown';
            }
            if (window.SeedQRDownloader && typeof window.SeedQRDownloader.setFilename === 'function') {
              window.SeedQRDownloader.setFilename(filename + '.png');
            }
          } catch (e) {
            console.warn('Could not set QR download filename', e);
          }
          showCard('results');
          _context2.n = 14;
          break;
        case 13:
          _context2.p = 13;
          _t = _context2.v;
          status.textContent = 'Error: ' + _t.message;
          status.className = 'err';
          hideCard('results');
        case 14:
          inputs = document.querySelectorAll('#words input');
          words = Array.from(inputs).map(inp => inp.value.trim()).filter(Boolean);
          document.getElementById('wordString').textContent = seedWordsToString(words);
        case 15:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 13]]);
  }));
  return _updateResults.apply(this, arguments);
}