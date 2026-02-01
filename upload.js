// upload.js

document.getElementById('qrUpload').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function () {
    const img = new Image();
    img.onload = async function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
//      canvas.width = img.width;
//      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qr = jsQR(imageData.data, imageData.width, imageData.height);

      if (!qr || !qr.binaryData) {
        document.getElementById('qrError').textContent = "QR decode failed.";
        return;
      }

      const bytes = new Uint8Array(qr.binaryData);


      try {
        if (bytes.length !== 16) {
          throw new Error(`Unsupported payload length ${bytes.length} (expected 16)`);
        }

        let words, version, path;
        // Try Electrum first
        let electrumError = null;
        try {
          const { words: ew, version: ver } = decodeElectrumSeed(bytes);
          words   = ew;
          version = ver || "electrum_standard";
          path    = "electrum";
        } catch (e) {
          electrumError = e;
        }
        if (path !== "electrum") {
          const decoded = await decodeSeedQRPayload(bytes);
          words   = decoded.words;
          version = "Compact";
          path    = "bip39";
        }

        // Fill inputs
        const els = Array.from(document.querySelectorAll('#words input'));
        words.forEach((w, i) => { if (els[i]) els[i].value = w; });

        // ENABLE CLEAR BUTTON AFTER SUCCESSFUL UPLOAD
        document.getElementById('clearBtn').disabled = false;
        
        // Store detection globally
        window.lastUpload =
          (path === "electrum")
            ? { type: "electrum", words, bytes, version }
            : { type: "seedqr",   words, bytes, version };

        // Update results
        updateResults();

        // Debug note
      } catch (err) {
        document.getElementById('qrError').textContent += "\nError: " + err.message;
      }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Reset upload state on Clear
document.getElementById('clearBtn').addEventListener('click', () => {
  const fileInput   = document.getElementById('qrUpload');
  const fileLabel   = document.querySelector('label[for="qrUpload"]');
  const fileNameEl  = document.getElementById('fileName');
  const getBtn      = document.getElementById('make');
  const msgBox      = document.getElementById('qrUploadMsg');
  const errorBox    = document.getElementById('qrError');
  const hint        = document.getElementById('qrHint');

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
  if (window.debug && getBtn) getBtn.style.display = 'inline-block';
  
  // Clear word inputs and notify listeners so validators run
  document.querySelectorAll('#words input').forEach(i => { 
    i.value = '';
    i.classList.remove('invalid');
    i.dispatchEvent(new Event('input', { bubbles: true }));
  }); 
  
  // Recompute UI state and force final clear state
  if (typeof validateInputs === 'function') validateInputs();
  if (typeof updateResults === 'function') updateResults();
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.disabled = true;
  window.lastUpload = null;
});


async function decodeSeedWordsFromFile(file) {
  const { text, bytes } = await decodeQRFromFile(file);

  if (!bytes || !(bytes instanceof Uint8Array)) {
    throw new Error("QR decode failed or returned no binary payload");
  }
  if (bytes.length === 16) {
    // Try Electrum first
    try {
      const wordsElectrum = decodeElectrumSeed(bytes, "segwit");
      const res = checkElectrumChecksum(wordsElectrum);
      if (res.ok) {
        return { type: "electrum", words: wordsElectrum, version: res.version, bytes };
      }
    } catch (e) {
      // If not Electrum, treat as BIP39 SeedQR
      const { words } = await decodeSeedQRPayload(bytes);
      return { type: "seedqr", words, bytes };
    }
  }

  throw new Error(`Unsupported SeedQR format: ${bytes.length} bytes`);
}