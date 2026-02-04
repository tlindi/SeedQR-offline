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
const cameraBtn = document.getElementById("cameraBtn");

// 🔥 Hide torch button by default BEFORE capability test 
if (torchBtn) torchBtn.style.display = "none";

// ZXing reader instance (requires libs/zxing-v0.19.1/index.min.js to be loaded first)
let zxingReader = null;
try { zxingReader = new ZXing.BrowserQRCodeReader(); } catch (e) { zxingReader = null; }

// -------------------------------
//  CAMERA START / STOP
// -------------------------------

async function startCamera() {
  // Prevent double-start
  if (cameraStream) { console.log('startCamera: camera already running'); return; }

  // ensure one-shot latch is cleared at start of a fresh session
  if (typeof window._scanLocked === 'undefined') window._scanLocked = false;
  window._scanLocked = false;
  
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

    // enable camera control and reflect active state
    if (cameraBtn) {
      cameraBtn.disabled = false;
      cameraBtn.setAttribute('aria-pressed', 'true');
      cameraBtn.classList.add('active');
      cameraBtn.textContent = 'End Scan';
    }

    // Torch capability detection
    try {
      const caps = cameraTrack && cameraTrack.getCapabilities ? cameraTrack.getCapabilities() : {};
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
      try { zxingReader.reset(); } catch (e) {}
      zxingReader.decodeFromVideoDevice(null, videoEl, (result, err) => {
        // Ignore ZXing NotFound/trace errors (they happen every frame)
        if (err) return;
        if (!result) return;

        // Obtain canonical payload from centralized reader
        // inside ZXing callback
        let payload = null;
        try {
          if (typeof window.getPayload === 'function') {
            const p = window.getPayload ? window.getPayload({ result, qr: result }) : null;
            if (p && typeof p.then === 'function') { console.error('scanner: getPayload returned a Promise; reader must be synchronous'); return; }
            payload = p;
          } else {
            payload = (result.rawBytes instanceof Uint8Array) ? new Uint8Array(result.rawBytes) : null;
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

        console.log('ZXing detected QR', { payloadLength: payload.length });

      // inside ZXing callback after payload extraction and locking
    if (typeof window.handleDecodedBytes === 'function') {
      try {
        const p = window.handleDecodedBytes(payload);
        if (p && typeof p.catch === 'function') p.catch(e => console.error('handleDecodedBytes rejected', e));
      } catch (e) {
        console.error('handleDecodedBytes sync error', e);
    }
    } else {
      // legacy fallback (temporary): store raw bytes and update UI
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
    try { videoEl.srcObject = null; } catch (e) {}
  }
  // clear the one-shot lock so future camera starts can scan
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
  torchBtn.addEventListener("click", async () => {
    if (!cameraTrack) return;
    torchOn = !torchOn;
    try {
      await cameraTrack.applyConstraints({ advanced: [{ torch: torchOn }] });
      // reflect state for accessibility and visuals
      torchBtn.setAttribute('aria-pressed', String(torchOn));      

      if (torchOn) {
        torchBtn.classList.add('active');
        torchBtn.textContent = '* Torch *';   // ← INSERT HERE (torch ON)
      } else {
        torchBtn.classList.remove('active');
        torchBtn.textContent = 'Torch';       // ← INSERT HERE (torch OFF)
      }

    } catch (e) {
      // revert state on failure
      torchOn = !torchOn;
      torchBtn.setAttribute('aria-pressed', String(torchOn));

      if (torchOn) {
        torchBtn.classList.add('active');
        torchBtn.textContent = '* Torch *';   // ← SAME INSERT HERE
      } else {
        torchBtn.classList.remove('active');
        torchBtn.textContent = 'Torch';       // ← SAME INSERT HERE
      }

      console.warn("Torch toggle failed:", e);
    }
  });
}


// Camera On/Off control
if (cameraBtn) {
  cameraBtn.addEventListener("click", async () => {
    const isOn = cameraBtn.getAttribute('aria-pressed') === 'true';
    if (isOn) {
      // turn camera off
      cameraBtn.setAttribute('aria-pressed', 'false');
      cameraBtn.classList.remove('active');
      cameraBtn.textContent = 'Scan';
      await stopCamera();
      showQRCode();
    } else {
      // turn camera on
      cameraBtn.disabled = true; // prevent double-click while starting
      
      document.getElementById('results').style.display = 'block';

      await initCameraOnLoad();
      // initCameraOnLoad will set cameraBtn state when startCamera completes,
      // but ensure button is enabled afterwards
      if (cameraBtn) cameraBtn.disabled = false;
    }
  });
}


// -------------------------------
//  INITIALIZATION HELPERS
// -------------------------------

async function initCameraOnLoad() {
  // ensure latch cleared for a fresh session
  if (typeof window._scanLocked === 'undefined') window._scanLocked = false;
  window._scanLocked = false;
  showCamera();
  await startCamera();
  // ZXing handles continuous scanning; no scanFrame call required
}

async function resetCameraOnClear() {
  stopCamera();
  // ensure latch cleared before restarting
  window._scanLocked = false;
  showCamera();
  await startCamera();
}

// Expose public API on window for non-module pages
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.showCamera = showCamera;
window.showQRCode = showQRCode;
window.initCameraOnLoad = initCameraOnLoad;
window.resetCameraOnClear = resetCameraOnClear;
