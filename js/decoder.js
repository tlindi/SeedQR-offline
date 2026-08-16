// decoder.js — centralized decoding helpers

// Normalizer helper (include this near the decoder or import from a shared util)
function toUint8Array(data) {
  if (!data) return null;
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (typeof data === 'string') {
    const clean = data.replace(/\s+/g, '');
    if (/^[0-9a-fA-F]+$/.test(clean) && clean.length % 2 === 0) {
      const out = new Uint8Array(clean.length / 2);
      for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
      return out;
    }
    return new TextEncoder().encode(data);
  }
  try { return new Uint8Array(data); } catch (e) { return null; }
}

// Primary generalized decoder
async function decodeSeedWordsFromData(input) {
  const bytes = toUint8Array(input);
  if (!bytes || !(bytes instanceof Uint8Array)) {
    throw new Error('decodeSeedWordsFromData: input could not be normalized to Uint8Array');
  }

  // Only 16-byte compact SeedQR payloads are supported here
  if (bytes.length !== 16) {
    throw new Error(`Unsupported SeedQR format: ${bytes.length} bytes`);
  }

  // 1) Try Electrum synchronously if available
  if (typeof decodeElectrumSeed === 'function') {
    try {
      const wordsElectrum = decodeElectrumSeed(bytes, 'segwit');
      const res = (typeof checkElectrumChecksum === 'function') ? checkElectrumChecksum(wordsElectrum) : { ok: true };
      if (res && res.ok) {
        return { type: 'electrum', words: wordsElectrum, version: res.version, bytes };
      }
    } catch (e) {
      // not Electrum — continue to BIP39
    }
  }

  // 2) Try BIP39 raw payload first, then deterministic transforms via helpers
  if (typeof decodeSeedQRPayload !== 'function') {
    throw new Error('BIP39 decoder not available (decodeSeedQRPayload missing)');
  }

  // helper to validate decoded result
  const valid = d => d && Array.isArray(d.words) && d.words.length === 12;

  // try raw payload
  try {
    const d = await decodeSeedQRPayload(bytes);
    if (valid(d)) return { type: 'seedqr', words: d.words, bytes };
  } catch (e) {
    // initial decode failed — fall through to transforms
  }

  // try deterministic transforms from helpers.js if present
  if (window.helpers && typeof window.helpers.generateTransformedCandidates === 'function') {
    for (const { name, bytes: candidate } of window.helpers.generateTransformedCandidates(bytes)) {
      try {
        const d = await decodeSeedQRPayload(candidate);
        if (valid(d)) {
          return { type: 'seedqr', words: d.words, bytes: candidate, transform: name };
        }
      } catch (e) {
        // ignore and continue
      }
    }
  } else if (window.helpers && typeof window.helpers.transformCandidates === 'function') {
    for (const fn of window.helpers.transformCandidates()) {
      try {
        const candidate = fn(bytes);
        const d = await decodeSeedQRPayload(candidate);
        if (valid(d)) {
          return { type: 'seedqr', words: d.words, bytes: candidate };
        }
      } catch (e) {
        // ignore and continue
      }
    }
  }

  // nothing succeeded
  throw new Error('No supported decoder succeeded for provided bytes (BIP39 raw + transforms failed)');
}

// File wrapper that uses decodeQRFromFile and the generalized decoder
async function decodeSeedWordsFromFile(file) {
  const { text, payload, bytes } = await decodeQRFromFile(file).catch(e => { throw e; });
  console.log("!!!INPUT!!!");

  let input = payload || bytes || text;
  if (!input) throw new Error('QR decode failed or returned no payload (payload, bytes, or text)');

  if (payload) {
    console.log("Decoding case: payload");
  } else if (bytes) {
    console.log("Decoding case: bytes");
  } else if (text) {
    console.log("Decoding case: text (legacy)");
  }

  const data = input instanceof Uint8Array ? input : new TextEncoder().encode(input);

  return await decodeSeedWordsFromData(data);
}
// Optional: accept low-level qr result (jsQR/ZXing) and decode
async function decodeSeedWordsFromQRResult(qrResult) {
  // prefer centralized reader if available
  const payload = (typeof window.getPayload === 'function') ? window.getPayload({ qr: qrResult, result: qrResult }) : null;
  if (!payload) throw new Error('getPayload produced no payload');
  return await decodeSeedWordsFromData(payload);
}

// centralized result handler used by scanner, upload, decoder
function handleDecodedResult(result) {
  if (!result || !Array.isArray(result.words)) {
    console.warn('handleDecodedResult called with invalid result', result);
    return;
  }

  const type = result.type || 'seedqr';
  const words = result.words;
  const bytes = result.bytes || new Uint8Array();
  const transform = result.transform || null;
  const version = result.version || null;
  const source = result.source || null;

  // canonical global state
  window.lastUpload = { type, words, bytes, transform, version, source };

  // populate word inputs
  const els = Array.from(document.querySelectorAll('#words input'));
  words.forEach((w, i) => { if (els[i]) els[i].value = w; });

  // enable clear button
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.disabled = false;

  console.log(`decodeSeedWordsFromData: accepted seed type=${type}`, {
    wordsCount: words.length,
    transform,
    version,
    source,
    hex: (window.helpers && window.helpers.bytesToHex) ? window.helpers.bytesToHex(bytes, ' ') : undefined
  });

  // update UI
  if (typeof updateResults === 'function') updateResults();
}

// decoder.js — centralized adapter: accept Uint8Array payload and orchestrate decode + UI
window.handleDecodedBytes = window.handleDecodedBytes || (async function(u8) {
  console.log('handleDecodedBytes start', { bytesLength: u8 && u8.length, time: Date.now() });

  try {
    // 1) Electrum (sync) if available
    if (typeof decodeElectrumSeed === 'function') {
      try {
        const ew = decodeElectrumSeed(u8);
        if (Array.isArray(ew)) {
          const version = (typeof checkElectrumChecksum === 'function') ? (checkElectrumChecksum(ew) || {}).version : undefined;
          const result = { type: 'electrum', words: ew, bytes: u8, version, source: 'camera' };
          if (typeof window.handleDecodedResult === 'function') { window.handleDecodedResult(result); return; }
          window.lastUpload = result;
          if (typeof updateResults === 'function') updateResults();
          return;
        }
      } catch (e) { /* not electrum — continue */ }
    }

    // 2) BIP39 via decodeSeedWordsFromData (includes transforms)
    if (typeof window.decodeSeedWordsFromData === 'function') {
      try {
        const decoded = await window.decodeSeedWordsFromData(u8);
        if (decoded && Array.isArray(decoded.words)) {
          const result = Object.assign({ source: 'camera' }, decoded);
          if (typeof window.handleDecodedResult === 'function') { window.handleDecodedResult(result); return; }
          window.lastUpload = { type: result.type || 'seedqr', words: result.words, bytes: result.bytes || u8, version: result.version };
          if (typeof updateResults === 'function') updateResults();
          return;
        }
      } catch (e) {
        console.warn('handleDecodedBytes: decodeSeedWordsFromData failed', e);
      }
    }

    // 3) Final fallback: delegate to centralized UI handler if present, otherwise store raw bytes
    const fallback = { type: 'camera', bytes: u8, source: 'camera' };
    if (typeof window.handleDecodedResult === 'function') {
      try { window.handleDecodedResult(fallback); return; } catch (e) { console.error('handleDecodedResult fallback error', e); }
    }
    window.lastUpload = fallback;
    if (typeof updateResults === 'function') updateResults();

  } catch (err) {
    console.error('handleDecodedBytes top-level error', err);
  } finally {
    // IMPORTANT: do not clear window._scanLocked here; scanner.js owns the one-shot lock
  }
});

// Expose for other modules if desired
window.decodeSeedWordsFromData = window.decodeSeedWordsFromData || decodeSeedWordsFromData;
window.decodeSeedWordsFromFile = decodeSeedWordsFromFile;
window.decodeSeedWordsFromQRResult = decodeSeedWordsFromQRResult;
window.handleDecodedResult = window.handleDecodedResult || handleDecodedResult;
