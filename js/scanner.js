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
  try {
    // request camera stream so we can access track for torch capability
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    videoEl.srcObject = cameraStream;

    try { await videoEl.play(); } catch (e) {}

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
        if (!result) return;

        // ONLY use rawBytes. Do not attempt to interpret or encode text.
        const raw = (result.rawBytes instanceof Uint8Array) ? result.rawBytes : new Uint8Array();

        // USER-SPECIFIED BEHAVIOR:
        // The valid Compact SeedQR payload is the 16-byte slice starting at offset 3
        // when ZXing returns a 19-byte buffer. For other lengths:
        //  - if exactly 16 bytes: use as-is
        //  - if >16 and <19: take the first 16 bytes (fallback)
        //  - if >=19: take bytes [3..18] (16 bytes)
        let payload = raw;
        if (raw && raw.length > 16) {
          if (raw.length >= 19) {
            payload = raw.slice(3, 3 + 16);
          } else {
            payload = raw.slice(0, 16);
          }
        }

        // Deliver bytes-only payload to the app pipeline (async handler)
        if (typeof window.handleDecodedBytes === 'function') {
          try { window.handleDecodedBytes(payload); } catch (e) { console.error('handleDecodedBytes error', e); }
        } else {
          // fallback: store globally and call updateResults if present
          window.lastUpload = { type: 'camera', bytes: payload };
          if (typeof updateResults === 'function') {
            try { updateResults(); } catch (e) { console.error('updateResults error', e); }
          } else {
            console.log('Decoded QR (camera bytes):', payload);
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
  try {
    // attempt electrum first if function exists (synchronous)
    if (typeof decodeElectrumSeed === 'function') {
      try {
        const ew = decodeElectrumSeed(u8);
        if (Array.isArray(ew)) {
          window.lastUpload = { type: "electrum", words: ew, bytes: u8 };
          if (typeof updateResults === 'function') return updateResults();
        }
      } catch (e) {
        // not electrum, continue
      }
    }

    // decodeSeedQRPayload is expected to be async; await its result
    if (typeof decodeSeedQRPayload === 'function') {
      try {
        const decoded = await decodeSeedQRPayload(u8);
        if (decoded && Array.isArray(decoded.words)) {
          window.lastUpload = { type: "seedqr", words: decoded.words, bytes: u8 };
          if (typeof updateResults === 'function') return updateResults();
        } else {
          // decoder returned no words; fall through to fallback storage
        }
      } catch (e) {
        console.error('decodeSeedQRPayload rejected or threw', e);
        // fall through to fallback storage
      }
    }

    // fallback: store bytes and call updateResults if present
    window.lastUpload = { type: "camera", bytes: u8 };
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
