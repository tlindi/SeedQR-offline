// upload.js (refactored to use centralized handleDecodedResult)
document.getElementById('uploadBtn').addEventListener('click', () => {
  document.getElementById('qrUpload').click();
});

document.getElementById('qrUpload').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Clear previous error
  const errorBox = document.getElementById('qrError');
  if (errorBox) errorBox.textContent = "";

  try {
    const seedWords = await decodeSeedWordsFromFile(file);

    // Prefer the generalized decoder API if available
    let decoded = null;
    if (typeof window.decodeSeedWordsFromData === 'function') {
      decoded = await window.decodeSeedWordsFromData(input);
    } else if (typeof window.decodeSeedWordsFromFile === 'function') {
      // backward-compatible convenience wrapper
      decoded = await window.decodeSeedWordsFromFile(file);
    } else if (typeof window.handleDecodedBytes === 'function') {
      // fallback: let the existing handler attempt to decode and update UI/state
      await window.handleDecodedBytes(input);
      decoded = window.lastUpload || null;
    } else {
      throw new Error('No decoder available (decodeSeedWordsFromData / handleDecodedBytes missing)');
    }

    // If decode returned a structured result, delegate to centralized UI handler
    if (decoded && decoded.words && Array.isArray(decoded.words)) {
      const result = {
        type: decoded.type || (decoded.version ? 'electrum' : 'seedqr'),
        words: decoded.words,
        bytes: decoded.bytes || input,
        version: decoded.version || (decoded.type === 'seedqr' ? 'Compact' : undefined),
        transform: decoded.transform || null,
        source: 'upload'
      };

      if (typeof window.handleDecodedResult === 'function') {
        try {
          window.handleDecodedResult(result);

          hideCard('camera');
          hideCard('upload');

          return;
        } catch (e) {
          console.error('handleDecodedResult error', e);
          // fall through to fallback below
        }
      }

      // fallback: local UI update (keeps previous behavior if centralized handler missing)
      const words = result.words;
      const els = Array.from(document.querySelectorAll('#words input'));
      words.forEach((w, i) => { if (els[i]) els[i].value = w; });

      const clearBtn = document.getElementById('clearBtn');
      if (clearBtn) clearBtn.disabled = false;

      window.lastUpload = (result.type === "electrum")
        ? { type: "electrum", words, bytes: result.bytes, version: result.version }
        : { type: "seedqr",   words, bytes: result.bytes, version: result.version };

      if (typeof updateResults === 'function') updateResults();

      hideCard('upload');
      
      return;
    }

    // If decoding did not produce words, delegate fallback to centralized handler if available
    if (typeof window.handleDecodedResult === 'function') {
      try {
        window.handleDecodedResult({ type: 'camera', bytes: input, source: 'upload' });
        hideCard('upload');
        return;
      } catch (e) {
        console.error('handleDecodedResult fallback error', e);
      }
    }

    // final fallback: show error
    throw new Error('Decoder did not return seed words');

  } catch (err) {
    if (errorBox) {
      errorBox.textContent = (errorBox.textContent ? errorBox.textContent + "\n" : "") + "Error: " + (err && err.message ? err.message : String(err));
    } else {
      console.error('upload error', err);
    }
  }
});

// Reset upload state on Clear (unchanged except ensure lastUpload cleared)
document.getElementById('clearBtn').addEventListener('click', () => {
  const fileInput   = document.getElementById('qrUpload');
  const fileLabel   = document.querySelector('label[for="qrUpload"]');
  const fileNameEl  = document.getElementById('fileName');
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
