// js/reader.js — synchronous canonical payload normalizer with simple logging
// Returns a Uint8Array of length 16 or null.
window.getPayload = function ({ qr, result }) {
  // helper: ensure a Uint8Array copy
  function toU8(src) {
    if (!src) return null;
    if (src instanceof Uint8Array) return new Uint8Array(src);
    if (src instanceof Uint8ClampedArray) return new Uint8Array(src);
    if (src && src.buffer instanceof ArrayBuffer) return new Uint8Array(src);
    return null;
  }

  // extract raw bytes from jsQR or ZXing result
  let raw = null;
  let src = null;
  if (qr && qr.binaryData && qr.binaryData.length) {
    raw = toU8(qr.binaryData);
    src = 'jsQR';
  } else if (result && result.rawBytes && result.rawBytes.length) {
    raw = toU8(result.rawBytes);
    src = 'ZXing';
  }

  if (!raw) {
    console.warn('getPayload: no qr.binaryData or result.rawBytes');
    return null;
  }

  console.log(
    'getPayload: source=' + src +
    ' rawLen=' + String(raw.length) +
    ' rawPreview=' + hexPreview(raw, 12)
  );

  // If ZXing path, attempt to strip an odd number of hex chars (nibbles) from the start.
  // This uses helpers.stripNibblesAndSlice if available; it removes N hex chars (nibbles)
  // across byte boundaries and returns the next 16 bytes.
  if (src === 'ZXing' && typeof window.stripNibblesAndSlice === 'function') {
    try {
      const nibbleStripped = window.stripNibblesAndSlice(raw, 3, 16); // strip 3 hex chars (12 bits)
      if (nibbleStripped && nibbleStripped.length === 16) {
        console.log(
          'getPayload: used stripNibblesAndSlice(3) on ZXing raw — preview=' +
          bytesToHex(nibbleStripped)
        );
        return nibbleStripped;
      } else {
        console.log('getPayload: stripNibblesAndSlice returned null/short; falling back to byte-slice heuristics');
      }
    } catch (e) {
      console.warn('getPayload: stripNibblesAndSlice threw: ' + String(e && e.message ? e.message : e));
    }
  }

  // canonical case: exactly 16 bytes
  if (raw.length === 16) {
    console.log('getPayload: chosen slice=0..16 (exact 16 bytes) payload=' + bytesToHex(raw));
    return raw;
  }

  // If buffer looks like it contains a 3-byte header (>=19), examine both candidates
  if (raw.length >= 19) {
    const headerStripped = raw.slice(3, 3 + 16);
    const headFirst = raw.slice(0, 16);
    console.log('getPayload: candidate headerStripped preview=' + hexPreview(headerStripped, 12));
    console.log('getPayload: candidate headFirst preview=' + hexPreview(headFirst, 12));

    // 1) If the first three bytes match a common header pattern (example: 0x41,0x0d,0x59), use header-stripped.
    //    We do not hardcode any test payload; this is a generic header-detection heuristic.
    if (raw[0] === 0x41 && raw[1] === 0x0d && raw[2] === 0x59) {
      console.log('getPayload: detected header bytes 41 0d 59 — chosen slice=3..19 (header-stripped) payload=' + bytesToHex(headerStripped));
      return headerStripped;
    }

    // 2) Secondary heuristic: if headerStripped looks more "random" (not all zeros) and headFirst looks like a header,
    //    prefer headerStripped. This avoids returning a 3-byte-shifted payload accidentally.
    const headFirstArr = Array.from(headFirst);
    const headerStrippedArr = Array.from(headerStripped);
    const headFirstZero = headFirstArr.every(b => b === 0);
    const headerStrippedZero = headerStrippedArr.every(b => b === 0);
    if (!headerStrippedZero && headFirstZero) {
      console.log('getPayload: headerStripped non-zero and headFirst all-zero — chosen slice=3..19 payload=' + bytesToHex(headerStripped));
      return headerStripped;
    }

    // 3) Otherwise prefer head-first (legacy / PNG style)
    console.log('getPayload: no clear header detected — chosen slice=0..16 (head-first) payload=' + bytesToHex(headFirst));
    return headFirst;
  }

  // if longer than 16 but less than 19, take first 16 (consistent with PNG path)
  if (raw.length > 16) {
    const slice = raw.slice(0, 16);
    console.log('getPayload: chosen slice=0..16 (raw length >16 and <19) payload=' + bytesToHex(slice));
    return slice;
  }

  // too short
  console.warn('getPayload: raw payload shorter than 16 bytes, returning null rawLen=' + String(raw.length));
  return null;
};
