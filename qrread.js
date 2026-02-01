// qrread.js
// Decode an image File/Blob into a canonical 16-byte Uint8Array payload.
// Returns: { text: string, payload: Uint8Array | null }
// Requires: jsQR loaded; reader.js (window.getPayload) should be available if present.

async function decodeQRFromFile(file) {
  if (!file) throw new Error('decodeQRFromFile: missing file');

  // Create an ImageBitmap for robust drawing (works with File/Blob)
  let img;
  try {
    img = await createImageBitmap(file);
  } catch (e) {
    // Fallback for older browsers: use Image + dataURL
    return await decodeQRFromFileFallback(file);
  }

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (!code) {
    return { text: "", payload: null };
  }

  // jsQR returns .data (string) and .binaryData (Uint8ClampedArray) in some builds
  const text = code.data || "";

  // Prefer centralized reader normalizer if available
  try {
    if (typeof window.getPayload === 'function') {
      const p = window.getPayload({ qr: code, result: code });
      if (p instanceof Uint8Array) {
        // Ensure canonical 16-byte length: reader.getPayload should already slice
        return { text, payload: p };
      }
      // If getPayload returned ArrayBuffer-like, normalize
      if (p && p.buffer instanceof ArrayBuffer) {
        return { text, payload: new Uint8Array(p) };
      }
    }
  } catch (e) {
    console.error('decodeQRFromFile: window.getPayload threw', e);
    // fall through to local normalization
  }

  // Local normalization fallback
  let bytes = null;
  if (code.binaryData && code.binaryData.length) {
    // jsQR may return Uint8ClampedArray
    bytes = new Uint8Array(code.binaryData);
  } else if (typeof text === 'string' && text.length) {
    // If jsQR returned text only, try to interpret as hex or UTF-8
    const clean = text.replace(/\s+/g, '');
    if (/^[0-9a-fA-F]+$/.test(clean) && clean.length % 2 === 0) {
      const out = new Uint8Array(clean.length / 2);
      for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
      bytes = out;
    } else {
      bytes = new TextEncoder().encode(text);
    }
  }

  if (!bytes) return { text, payload: null };

  // Ensure we return the canonical 16-byte payload (SeedQR compact format)
  // If bytes length >= 19, assume first 3 bytes are header and next 16 are payload
  if (bytes.length >= 19) {
    return { text, payload: bytes.slice(3, 3 + 16) };
  }
  // If exactly 16, return as-is
  if (bytes.length === 16) {
    return { text, payload: bytes };
  }
  // If longer but <19, try to take first 16 bytes
  if (bytes.length > 16) {
    return { text, payload: bytes.slice(0, 16) };
  }

  // Not enough data
  return { text, payload: null };
}

// Fallback path using FileReader + Image for environments without createImageBitmap
function decodeQRFromFileFallback(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('decodeQRFromFileFallback: FileReader error'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);
          if (!code) return resolve({ text: "", payload: null });

          const text = code.data || "";
          let bytes = null;
          if (code.binaryData && code.binaryData.length) bytes = new Uint8Array(code.binaryData);
          else if (text) {
            const clean = text.replace(/\s+/g, '');
            if (/^[0-9a-fA-F]+$/.test(clean) && clean.length % 2 === 0) {
              const out = new Uint8Array(clean.length / 2);
              for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
              bytes = out;
            } else {
              bytes = new TextEncoder().encode(text);
            }
          }

          if (!bytes) return resolve({ text, payload: null });
          if (bytes.length >= 19) return resolve({ text, payload: bytes.slice(3, 3 + 16) });
          if (bytes.length === 16) return resolve({ text, payload: bytes });
          if (bytes.length > 16) return resolve({ text, payload: bytes.slice(0, 16) });
          return resolve({ text, payload: null });
        } catch (e) {
          return reject(e);
        }
      };
      img.onerror = () => reject(new Error('decodeQRFromFileFallback: image load error'));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Export for other scripts
window.decodeQRFromFile = window.decodeQRFromFile || decodeQRFromFile;
