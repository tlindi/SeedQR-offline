"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// upload.js (refactored to use centralized handleDecodedResult)
document.getElementById('uploadBtn').addEventListener('click', () => {
  document.getElementById('qrUpload').click();
});
document.getElementById('qrUpload').addEventListener('change', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event) {
    var file, errorBox, qrResult, input, decoded, result, words, els, clearBtn, _t, _t2, _t3;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          file = event.target.files[0];
          if (file) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          // Clear previous error
          errorBox = document.getElementById('qrError');
          if (errorBox) errorBox.textContent = "";
          _context.p = 2;
          _context.n = 3;
          return decodeQRFromFile(file);
        case 3:
          qrResult = _context.v;
          // Accept either `payload` (canonical) or `bytes` (legacy)
          input = qrResult && (qrResult.payload || qrResult.bytes);
          if (!(!input || !(input instanceof Uint8Array))) {
            _context.n = 4;
            break;
          }
          throw new Error("QR decode failed or returned no binary payload");
        case 4:
          // Prefer the generalized decoder API if available
          decoded = null;
          if (!(typeof window.decodeSeedWordsFromData === 'function')) {
            _context.n = 6;
            break;
          }
          _context.n = 5;
          return window.decodeSeedWordsFromData(input);
        case 5:
          decoded = _context.v;
          _context.n = 11;
          break;
        case 6:
          if (!(typeof window.decodeSeedWordsFromFile === 'function')) {
            _context.n = 8;
            break;
          }
          _context.n = 7;
          return window.decodeSeedWordsFromFile(file);
        case 7:
          decoded = _context.v;
          _context.n = 11;
          break;
        case 8:
          if (!(typeof window.handleDecodedBytes === 'function')) {
            _context.n = 10;
            break;
          }
          _context.n = 9;
          return window.handleDecodedBytes(input);
        case 9:
          decoded = window.lastUpload || null;
          _context.n = 11;
          break;
        case 10:
          throw new Error('No decoder available (decodeSeedWordsFromData / handleDecodedBytes missing)');
        case 11:
          if (!(decoded && decoded.words && Array.isArray(decoded.words))) {
            _context.n = 15;
            break;
          }
          result = {
            type: decoded.type || (decoded.version ? 'electrum' : 'seedqr'),
            words: decoded.words,
            bytes: decoded.bytes || input,
            version: decoded.version || (decoded.type === 'seedqr' ? 'Compact' : undefined),
            transform: decoded.transform || null,
            source: 'upload'
          };
          if (!(typeof window.handleDecodedResult === 'function')) {
            _context.n = 14;
            break;
          }
          _context.p = 12;
          window.handleDecodedResult(result);
          hideCard('camera');
          hideCard('upload');
          return _context.a(2);
        case 13:
          _context.p = 13;
          _t = _context.v;
          console.error('handleDecodedResult error', _t);
          // fall through to fallback below
        case 14:
          // fallback: local UI update (keeps previous behavior if centralized handler missing)
          words = result.words;
          els = Array.from(document.querySelectorAll('#words input'));
          words.forEach((w, i) => {
            if (els[i]) els[i].value = w;
          });
          clearBtn = document.getElementById('clearBtn');
          if (clearBtn) clearBtn.disabled = false;
          window.lastUpload = result.type === "electrum" ? {
            type: "electrum",
            words,
            bytes: result.bytes,
            version: result.version
          } : {
            type: "seedqr",
            words,
            bytes: result.bytes,
            version: result.version
          };
          if (typeof updateResults === 'function') updateResults();
          hideCard('upload');
          return _context.a(2);
        case 15:
          if (!(typeof window.handleDecodedResult === 'function')) {
            _context.n = 18;
            break;
          }
          _context.p = 16;
          window.handleDecodedResult({
            type: 'camera',
            bytes: input,
            source: 'upload'
          });
          hideCard('upload');
          return _context.a(2);
        case 17:
          _context.p = 17;
          _t2 = _context.v;
          console.error('handleDecodedResult fallback error', _t2);
        case 18:
          throw new Error('Decoder did not return seed words');
        case 19:
          _context.p = 19;
          _t3 = _context.v;
          if (errorBox) {
            errorBox.textContent = (errorBox.textContent ? errorBox.textContent + "\n" : "") + "Error: " + (_t3 && _t3.message ? _t3.message : String(_t3));
          } else {
            console.error('upload error', _t3);
          }
        case 20:
          return _context.a(2);
      }
    }, _callee, null, [[16, 17], [12, 13], [2, 19]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

// Reset upload state on Clear (unchanged except ensure lastUpload cleared)
document.getElementById('clearBtn').addEventListener('click', () => {
  var fileInput = document.getElementById('qrUpload');
  var fileLabel = document.querySelector('label[for="qrUpload"]');
  var fileNameEl = document.getElementById('fileName');
  var msgBox = document.getElementById('qrUploadMsg');
  var errorBox = document.getElementById('qrError');
  var hint = document.getElementById('qrHint');
  if (fileInput) {
    fileInput.value = "";
    fileInput.disabled = false;
  }
  if (fileLabel) {
    fileLabel.style.opacity = "1";
    fileLabel.style.pointerEvents = "auto";
  }
  if (fileNameEl) fileNameEl.textContent = "";
  if (hint) hint.style.display = "block";
  if (msgBox) msgBox.textContent = "";
  if (errorBox) errorBox.textContent = "";

  // Clear word inputs and notify listeners so validators run
  document.querySelectorAll('#words input').forEach(i => {
    i.value = '';
    i.classList.remove('invalid');
    i.dispatchEvent(new Event('input', {
      bubbles: true
    }));
  });

  // Recompute UI state and force final clear state
  if (typeof validateInputs === 'function') validateInputs();
  if (typeof updateResults === 'function') updateResults();
  var clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.disabled = true;
  window.lastUpload = null;
});