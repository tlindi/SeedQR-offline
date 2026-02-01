// scanner.js
// Camera controller for integrated SeedQR.html scanning
// Provides a clean public API via window: startCamera, stopCamera, showCamera, showQRCode
// Bytes-only camera path; async-only decoder handling (await decodeSeedQRPayload).

let cameraStream = null;
let cameraTrack = null;
let torchOn = false;

// Elements (SeedQR.html must contain these IDs)
const videoEl = document.getElementById("video");
const cameraWrapper = document.getElementById("cameraWrapper");
const qrcodeWrapper = document.getElementById("qrcode");
const torchBtn = document.getElementById("torchBtn");

// ZXing reader instance (requires libs/zxing-v0.19.1/index.min.js to be loaded first)
let zxingReader = null;
try { zxingReader = new ZXing.BrowserQRCodeReader(); } catch (e) { zxingReader = null; }

// -------------------------------
//  CAMERA START / STOP (ZXing)
// -------------------------------

async function startCamera() {
  // Prevent double-start
  if (cameraStream) { console.log('startCamera: camera already running'); return; }
  
  try {
    // request camera stream so we can access track for torch capability
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    videoEl.srcObject = cameraStream;

    try {
      if (videoEl.paused) await videoEl.play(); 
      } catch (e) {
      console.warn('video play failed', e);
    }

    cameraTrack = cameraStream.getVideoTracks()[0];

    // Torch capability detection
    try {
      const caps = cameraTrack && cameraTrack.getCapabilities ? cameraTrack.getCapabilities() : {};
      if (caps && caps.torch) {
        if (torchBtn) {
          torchBtn.disabled = false;
          torchBtn.style.display = "block";
        }
      } else if (torchBtn) {
        torchBtn.disabled = true;
        torchBtn.style.display = "none";
      }
    } catch (e) {
      if (torchBtn) {
        torchBtn.disabled = true;
        torchBtn.style.display = "none";
      }
    }

    // Start ZXing continuous decode into callback
    if (zxingReader) {
      try { zxingReader.reset(); } catch (e) {}
      zxingReader.decodeFromVideoDevice(null, videoEl, (result, err) => {
        // Ignore ZXing NotFound/trace errors (they happen every frame)
        if (err) return;
        if (!result) return;

        // ONLY use rawBytes. Do not attempt to interpret or encode text.
        const raw = (result.rawBytes instanceof Uint8Array) ? result.rawBytes : new Uint8Array();

        // Extract 16-byte Compact SeedQR payload
        let payload = raw;
        if (raw && raw.length > 16) {
          if (raw.length >= 19) {
            payload = raw.slice(3, 3 + 16);
          } else {
            payload = raw.slice(0, 16);
          }
        }

        // Short hex preview helper
        const toHex = (u8) => Array.from(u8 || []).map(b => b.toString(16).padStart(2,'0')).join('');
        const payloadHex = toHex(payload).slice(0, 64);

        // Debounce identical detections (avoid repeated calls for same payload)
        if (!window._lastDetectedHex) window._lastDetectedHex = null;
        if (!window._lastDetectedTime) window._lastDetectedTime = 0;
        const now = Date.now();
        if (window._lastDetectedHex === payloadHex && (now - window._lastDetectedTime) < 800) return;
        window._lastDetectedHex = payloadHex;
        window._lastDetectedTime = now;

        console.log('ZXing detected QR', { rawLength: raw.length, payloadLength: payload.length, payloadHexPreview: payloadHex });

        // Deliver bytes-only payload to the app pipeline (async handler)
        if (typeof window.handleDecodedBytes === 'function') {
          try {
            const p = window.handleDecodedBytes(payload);
            if (p && typeof p.catch === 'function') p.catch(e => console.error('handleDecodedBytes rejected', e));
          } catch (e) {
            console.error('handleDecodedBytes sync error', e);
          }
        } else {
          // fallback: store globally and call updateResults if present
          window.lastUpload = { type: 'camera', bytes: payload };
          if (typeof updateResults === 'function') {
            try { updateResults(); } catch (e) { console.error('updateResults error', e); }
          } else {
            console.log('Decoded QR (camera bytes) fallback stored', { payloadLength: payload.length });
          }
        }
      });
    } else {
      console.warn('ZXing reader not available; camera will start but no continuous decode will run.');
    }

  } catch (err) {
    console.error("Camera start failed:", err);
  }
}

function stopCamera() {
  try { if (zxingReader) zxingReader.reset(); } catch (e) {}
  if (cameraStream) {
    try { cameraStream.getTracks().forEach(t => t.stop()); } catch (e) {}
    cameraStream = null;
  }
  cameraTrack = null;
  torchOn = false;
  if (torchBtn) {
    torchBtn.disabled = true;
    torchBtn.style.display = "none";
  }
  if (videoEl && videoEl.srcObject) {
    try { videoEl.srcObject = null; } catch (e) {}
  }
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

// -------------------------------
//  TORCH CONTROL
// -------------------------------

if (torchBtn) {
  torchBtn.addEventListener("click", async () => {
    if (!cameraTrack) return;
    torchOn = !torchOn;
    try {
      await cameraTrack.applyConstraints({ advanced: [{ torch: torchOn }] });
    } catch (e) {
      console.warn("Torch toggle failed:", e);
    }
  });
}

// -------------------------------
//  INITIALIZATION HELPERS
// -------------------------------

async function initCameraOnLoad() {
  showCamera();
  await startCamera();
  // ZXing handles continuous scanning; no scanFrame call required
}

async function resetCameraOnClear() {
  stopCamera();
  showCamera();
  await startCamera();
}

// -------------------------------
//  Adapter: async-only handleDecodedBytes
// -------------------------------

/*
  Async-only adapter: this version assumes decodeSeedQRPayload is async (returns a Promise).
  It awaits decodeSeedQRPayload(payload) and then updates window.lastUpload and calls updateResults().
  Electrum decoding (decodeElectrumSeed) is attempted synchronously first if present.
*/
window.handleDecodedBytes = window.handleDecodedBytes || (async function(u8) {
  console.log('handleDecodedBytes start', { bytesLength: u8 && u8.length, time: Date.now() });
  try {
    // attempt electrum first if function exists (synchronous)
    if (typeof decodeElectrumSeed === 'function') {
      try {
        const ew = decodeElectrumSeed(u8);
        if (Array.isArray(ew)) {
          window.lastUpload = { type: "electrum", words: ew, bytes: u8 };
          const words = (window.lastUpload && window.lastUpload.words) || [];
          Array.from(document.querySelectorAll('#words input')).forEach((el,i)=> el.value = words[i] || '');
          if (typeof updateResults === 'function') return updateResults();
        }
      } catch (e) {
        // not electrum, continue
      }
    }

    // decodeSeedQRPayload is expected to be async; try raw payload first,
    // then a short list of deterministic transforms if needed.
    let decoded = null;
    let payload = u8;

    if (typeof decodeSeedQRPayload === 'function') {
      try {
        // try the raw payload first
        decoded = await decodeSeedQRPayload(payload);
        } catch (e) {
          console.error('decodeSeedQRPayload initial error', e);
          }
          // helper transforms
          const rev = u => Uint8Array.from(u).reverse();
          const swapPairs = u => { const r = new Uint8Array(u); for (let i = 0; i + 1 < r.length; i += 2) { const t = r[i]; r[i] = r[i+1]; r[i+1] = t; } return r; };
          const swapNibbles = u => Uint8Array.from(u, v => (((v & 0x0f) << 4) | ((v & 0xf0) >> 4)) & 0xff);
          const rot = (u, n) => { const r = new Uint8Array(u.length); for (let i = 0; i < u.length; i++) r[i] = (((u[i] << n) | (u[i] >> (8 - n))) & 0xff); return r; };

          const valid = d => d && Array.isArray(d.words) && d.words.length === 12;

          if (!valid(decoded)) {
            const candidates = [rev, swapPairs, swapNibbles];
            for (let n = 1; n < 8; n++) candidates.push(u => rot(u, n));
            
            for (const fn of candidates) {
              try {
                const test = fn(payload);
                const d = await decodeSeedQRPayload(test);
                if (valid(d)) { decoded = d; payload = test; break; }
              } catch (e) {
                // ignore and continue trying other transforms
              }
            }
          }
        }

        // If decoded now contains valid words, set lastUpload and update UI below.
        if (decoded && Array.isArray(decoded.words)) {
          window.lastUpload = { type: "seedqr", words: decoded.words, bytes: payload };
          console.log('decoded payload hex', Array.from(payload || []).map(b => b.toString(16).padStart(2,'0')).join(''));
          console.log('decodeSeedQRPayload succeeded', { wordsCount: decoded.words.length });
          console.log('decoded payload', { hex: Array.from(payload || []).map(b => b.toString(16).padStart(2,'0')).join(''), dec: Array.from(payload || []).join(',') });
          console.log('decoded words', Array.isArray(decoded.words) ? decoded.words.join(' ') : String(decoded.words));
         
          if (typeof updateResults === 'function') return updateResults();
        }

    // fallback: store bytes and call updateResults if present
    console.log('handleDecodedBytes falling back to raw bytes storage');
    window.lastUpload = { type: "camera", bytes: u8 };
    const words = (window.lastUpload && window.lastUpload.words) || [];
    Array.from(document.querySelectorAll('#words input')).forEach((el,i)=> el.value = words[i] || '');
    if (typeof updateResults === 'function') updateResults();

  } catch (e) {
    console.error('handleDecodedBytes top-level error', e);
  }
});

// Expose public API on window for non-module pages
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.showCamera = showCamera;
window.showQRCode = showQRCode;
window.initCameraOnLoad = initCameraOnLoad;
window.resetCameraOnClear = resetCameraOnClear;
