// qrread.js

// High-level helper: decode file and also show raw QR content
async function handleQRFileUpload(file) {
    const msgBox = document.getElementById('qrUploadMsg');
    const rawBox = document.getElementById('qrRaw');
    let raw = "";
    try {
        // Step 1: decode raw string from QR
        raw = await decodeQRFromFile(file);

        // Show raw content under upload box (even if empty)
        if (rawBox) {
            rawBox.textContent = "Raw QR content:\n" + (raw || "[empty]");
        }

        if (!raw) throw new Error("QR decode returned empty");

        // Step 2: normalize into words (works for text or hex payloads)
        const words = await decodeSeedWordsFromFile(file);

        // Fill into inputs
        const inputs = document.querySelectorAll('#words input');
        inputs.forEach((inp, i) => { inp.value = words[i] || ''; });

        // Update joined string under QR
        document.getElementById('wordString').textContent = seedWordsToString(words);

        // Trigger validation + results
        validateInputs();
        updateResults();

        // ENABLE CLEAR BUTTON
        document.getElementById('clearBtn').disabled = false;
        
        msgBox.textContent = "QR decoded successfully — seed words loaded.";
        msgBox.style.color = "#176b1a"; // green
    } catch (err) {
        msgBox.textContent = "QR decode failed: " + err.message;
        msgBox.style.color = "#b00020"; // red
        // Do not clear rawBox here — leave whatever was shown for debugging
    }
}

// Low‑level helper: file → raw QR bytes + text
async function decodeQRFromFile(file) {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (!code) return { text: "", bytes: new Uint8Array() };

  // jsQR returns both .data (string) and .binaryData (Uint8ClampedArray)
  const text = code.data || "";
  const bytes = code.binaryData ? new Uint8Array(code.binaryData) : new TextEncoder().encode(text);

  return { text, bytes };
}

