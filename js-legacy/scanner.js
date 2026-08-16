"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// scanner.js
// Camera controller for integrated SeedQR.html scanning
// Provides a clean public API via window: startCamera, stopCamera, showCamera, showQRCode
// Bytes-only camera path; async-only decoder handling (await decodeSeedQRPayload).

var cameraStream = null;
var cameraTrack = null;
var torchOn = false;

// Elements (SeedQR.html must contain these IDs)
var videoEl = document.getElementById("video");
var cameraWrapper = document.getElementById("cameraWrapper");
var qrcodeWrapper = document.getElementById("qrcode");
var torchBtn = document.getElementById("torchBtn");
var cameraBtn = document.getElementById("cameraBtn");

// Hide torch button by default BEFORE capability test 
if (torchBtn) torchBtn.style.display = "none";

// ZXing reader instance (requires libs/zxing-v0.19.1/index.min.js to be loaded first)
var zxingReader = null;
try {
  zxingReader = new ZXing.BrowserQRCodeReader();
} catch (e) {
  zxingReader = null;
}

// -------------------------------
//  CAMERA START / STOP
// -------------------------------
function startCamera() {
  return _startCamera.apply(this, arguments);
}
function _startCamera() {
  _startCamera = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var caps, _t2, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          if (!cameraStream) {
            _context3.n = 1;
            break;
          }
          console.log('startCamera: camera already running');
          return _context3.a(2);
        case 1:
          // ensure one-shot latch is cleared at start of a fresh session
          if (typeof window._scanLocked === 'undefined') window._scanLocked = false;
          window._scanLocked = false;
          _context3.p = 2;
          _context3.n = 3;
          return navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment"
            }
          });
        case 3:
          cameraStream = _context3.v;
          videoEl.srcObject = cameraStream;
          _context3.p = 4;
          if (!videoEl.paused) {
            _context3.n = 5;
            break;
          }
          _context3.n = 5;
          return videoEl.play();
        case 5:
          _context3.n = 7;
          break;
        case 6:
          _context3.p = 6;
          _t2 = _context3.v;
          console.warn('video play failed', _t2);
        case 7:
          cameraTrack = cameraStream.getVideoTracks()[0];

          // enable camera control and reflect active state
          if (cameraBtn) {
            cameraBtn.disabled = false;
            cameraBtn.setAttribute('aria-pressed', 'true');
            cameraBtn.classList.add('active');
            cameraBtn.textContent = 'End Scan';
          }

          // Torch capability detection
          try {
            caps = cameraTrack && cameraTrack.getCapabilities ? cameraTrack.getCapabilities() : {};
            if (caps && caps.torch) {
              if (torchBtn) {
                torchBtn.disabled = false;
                torchBtn.style.display = "block";
                torchBtn.setAttribute('aria-pressed', 'false');
                torchBtn.classList.remove('active');
              }
            } else if (torchBtn) {
              torchBtn.disabled = true;
              torchBtn.setAttribute('aria-pressed', 'false');
              torchBtn.classList.remove('active');
            }
          } catch (e) {
            if (torchBtn) {
              torchBtn.disabled = true;
              torchBtn.style.display = "none";
            }
          }

          // Start ZXing continuous decode into callback
          if (zxingReader) {
            try {
              zxingReader.reset();
            } catch (e) {}
            zxingReader.decodeFromVideoDevice(null, videoEl, (result, err) => {
              // Ignore ZXing NotFound/trace errors (they happen every frame)
              if (err) return;
              if (!result) return;

              // Obtain canonical payload from centralized reader
              // inside ZXing callback
              var payload = null;
              try {
                if (typeof window.getPayload === 'function') {
                  var p = window.getPayload ? window.getPayload({
                    result,
                    qr: result
                  }) : null;
                  if (p && typeof p.then === 'function') {
                    console.error('scanner: getPayload returned a Promise; reader must be synchronous');
                    return;
                  }
                  payload = p;
                } else {
                  payload = result.rawBytes instanceof Uint8Array ? new Uint8Array(result.rawBytes) : null;
                }
              } catch (e) {
                console.error('scanner: getPayload threw', e);
                payload = null;
              }
              if (!payload) {
                console.error('No payload produced from result');
                return;
              }

              // one-shot: accept first payload and ignore further scans until cleared
              if (window._scanLocked) return;
              window._scanLocked = true;
              console.log('ZXing detected QR', {
                payloadLength: payload.length
              });

              // inside ZXing callback after payload extraction and locking
              if (typeof window.handleDecodedBytes === 'function') {
                try {
                  var _p = window.handleDecodedBytes(payload);
                  if (_p && typeof _p.catch === 'function') _p.catch(e => console.error('handleDecodedBytes rejected', e));
                } catch (e) {
                  console.error('handleDecodedBytes sync error', e);
                }
              }

              // Hide camera card after successful QR decode (always run)
              setCardVisible('cameraCard', false);

              // fallback only if handler missing
              if (typeof window.handleDecodedBytes !== 'function') {
                // legacy fallback (temporary): store raw bytes and update UI
                window.lastUpload = {
                  type: 'camera',
                  bytes: payload
                };
                if (typeof updateResults === 'function') {
                  try {
                    updateResults();
                  } catch (e) {
                    console.error('updateResults error', e);
                  }
                } else {
                  console.log('Decoded QR (camera bytes) fallback stored', {
                    payloadLength: payload.length
                  });
                }
              }
            });
          } else {
            console.warn('ZXing reader not available; camera will start but no continuous decode will run.');
          }
          _context3.n = 9;
          break;
        case 8:
          _context3.p = 8;
          _t3 = _context3.v;
          console.error("Camera start failed:", _t3);
        case 9:
          return _context3.a(2);
      }
    }, _callee3, null, [[4, 6], [2, 8]]);
  }));
  return _startCamera.apply(this, arguments);
}
function stopCamera() {
  try {
    if (zxingReader) zxingReader.reset();
  } catch (e) {}
  if (cameraStream) {
    try {
      cameraStream.getTracks().forEach(t => t.stop());
    } catch (e) {}
    cameraStream = null;
  }
  cameraTrack = null;
  torchOn = false;
  if (torchBtn) {
    torchBtn.disabled = true;
    torchBtn.style.display = "none";
    torchBtn.setAttribute('aria-pressed', 'false');
    torchBtn.classList.remove('active');
  }
  if (cameraBtn) {
    cameraBtn.setAttribute('aria-pressed', 'false');
    cameraBtn.classList.remove('active');
    cameraBtn.textContent = 'Scan';
    cameraBtn.disabled = false;
  }
  if (videoEl && videoEl.srcObject) {
    try {
      videoEl.srcObject = null;
    } catch (e) {}
  }

  // clear the one-shot lock
  window._scanLocked = false;
}

// -------------------------------
//  VISIBILITY TOGGLES
// -------------------------------

function showCamera() {
  if (cameraWrapper) cameraWrapper.style.display = "block";
  if (videoEl) videoEl.style.display = "block";
  if (qrcodeWrapper) qrcodeWrapper.style.display = "none";
}
function showQRCode() {
  if (cameraWrapper) cameraWrapper.style.display = "none";
  if (videoEl) videoEl.style.display = "none";
  if (qrcodeWrapper) qrcodeWrapper.style.display = "flex";
}

//  TORCH CONTROL

if (torchBtn) {
  torchBtn.addEventListener("click", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          if (cameraTrack) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          torchOn = !torchOn;
          _context.p = 2;
          _context.n = 3;
          return cameraTrack.applyConstraints({
            advanced: [{
              torch: torchOn
            }]
          });
        case 3:
          // reflect state for accessibility and visuals
          torchBtn.setAttribute('aria-pressed', String(torchOn));
          if (torchOn) {
            torchBtn.classList.add('active');
            torchBtn.textContent = '* Torch *'; // ← INSERT HERE (torch ON)
          } else {
            torchBtn.classList.remove('active');
            torchBtn.textContent = 'Torch'; // ← INSERT HERE (torch OFF)
          }
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          // revert state on failure
          torchOn = !torchOn;
          torchBtn.setAttribute('aria-pressed', String(torchOn));
          if (torchOn) {
            torchBtn.classList.add('active');
            torchBtn.textContent = '* Torch *'; // ← SAME INSERT HERE
          } else {
            torchBtn.classList.remove('active');
            torchBtn.textContent = 'Torch'; // ← SAME INSERT HERE
          }
          console.warn("Torch toggle failed:", _t);
        case 5:
          return _context.a(2);
      }
    }, _callee, null, [[2, 4]]);
  })));
}

// Camera On/Off control
if (cameraBtn) {
  cameraBtn.addEventListener("click", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var isOn, anyWordFilled;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          isOn = cameraBtn.getAttribute('aria-pressed') === 'true';
          if (!isOn) {
            _context2.n = 2;
            break;
          }
          cameraBtn.setAttribute('aria-pressed', 'false');
          cameraBtn.classList.remove('active');
          cameraBtn.textContent = 'Scan';
          _context2.n = 1;
          return stopCamera();
        case 1:
          showQRCode(); // resets UI

          // Check if any seed words were decoded
          anyWordFilled = Array.from(document.querySelectorAll('#words input')).some(i => i.value.trim() !== '');
          hideCard('upload');
          if (!anyWordFilled) {
            // No QR detected → hide results, show upload
            hideCard('results');
            showCard('upload');
          } else {
            // QR detected → keep results visible, keep upload hidden
            hideCard('upload');
            showCard('results');
          }
          _context2.n = 4;
          break;
        case 2:
          // turn camera on
          cameraBtn.disabled = true; // prevent double-click while starting

          // HIDE UPLOAD CARD During scanning
          hideCard('upload');
          showCard('results');
          _context2.n = 3;
          return initCameraOnLoad();
        case 3:
          // initCameraOnLoad will set cameraBtn state when startCamera completes,
          // but ensure button is enabled afterwards
          if (cameraBtn) cameraBtn.disabled = false;
        case 4:
          return _context2.a(2);
      }
    }, _callee2);
  })));
}

// -------------------------------
//  INITIALIZATION HELPERS
// -------------------------------
function initCameraOnLoad() {
  return _initCameraOnLoad.apply(this, arguments);
}
function _initCameraOnLoad() {
  _initCameraOnLoad = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          // ensure latch cleared for a fresh session
          if (typeof window._scanLocked === 'undefined') window._scanLocked = false;
          window._scanLocked = false;
          showCamera();
          _context4.n = 1;
          return startCamera();
        case 1:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return _initCameraOnLoad.apply(this, arguments);
}
function resetCameraOnClear() {
  return _resetCameraOnClear.apply(this, arguments);
} // Expose public API on window for non-module pages
function _resetCameraOnClear() {
  _resetCameraOnClear = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          stopCamera();
          // ensure latch cleared before restarting
          window._scanLocked = false;
          showCamera();
        case 1:
          return _context5.a(2);
      }
    }, _callee5);
  }));
  return _resetCameraOnClear.apply(this, arguments);
}
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.showCamera = showCamera;
window.showQRCode = showQRCode;
window.initCameraOnLoad = initCameraOnLoad;
window.resetCameraOnClear = resetCameraOnClear;