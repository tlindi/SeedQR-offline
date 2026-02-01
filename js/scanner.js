// scanner.js
// Camera controller for integrated SeedQR.html scanning
// Provides a clean public API via window: startCamera, stopCamera, showCamera, showQRCode

let cameraStream = null;
let cameraTrack = null;
let torchOn = false;

// Elements (SeedQR.html must contain these IDs)
const videoEl = document.getElementById("video");
const cameraWrapper = document.getElementById("cameraWrapper");
const qrcodeWrapper = document.getElementById("qrcode");
const torchBtn = document.getElementById("torchBtn");

// -------------------------------
//  CAMERA START / STOP
// -------------------------------

async function startCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    videoEl.srcObject = cameraStream;

    try { await videoEl.play(); } catch (e) {}

    cameraTrack = cameraStream.getVideoTracks()[0];

    const caps = cameraTrack.getCapabilities();
    if (caps && caps.torch) {
      torchBtn.disabled = false;
      torchBtn.style.display = "block";
    } else {
      torchBtn.disabled = true;
      torchBtn.style.display = "none";
    }

  } catch (err) {
    console.error("Camera start failed:", err);
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
    cameraTrack = null;
  }
  torchOn = false;
  torchBtn.disabled = true;
  torchBtn.style.display = "none";
}

// -------------------------------
//  VISIBILITY TOGGLES
// -------------------------------

function showCamera() {
  cameraWrapper.style.display = "block";
  videoEl.style.display = "block";
  qrcodeWrapper.style.display = "none";
}

function showQRCode() {
  cameraWrapper.style.display = "none";
  videoEl.style.display = "none";
  qrcodeWrapper.style.display = "flex";
}

// -------------------------------
//  TORCH CONTROL
// -------------------------------

torchBtn.addEventListener("click", async () => {
  if (!cameraTrack) return;
  torchOn = !torchOn;
  try {
    await cameraTrack.applyConstraints({ advanced: [{ torch: torchOn }] });
  } catch (e) {
    console.warn("Torch toggle failed:", e);
  }
});

// -------------------------------
//  INITIALIZATION HELPERS
// -------------------------------

async function initCameraOnLoad() {
  showCamera();
  await startCamera();
  scanFrame();
}

async function resetCameraOnClear() {
  stopCamera();
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
