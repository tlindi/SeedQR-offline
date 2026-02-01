// helpers.js

// Original helpers and comments retained and hardened where needed.

// Convert bytes to hex string (compact by default; pass " " as sep for spaced output)
function bytesToHex(bytes, sep = "") {
  if (!bytes) return "";
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join(sep);
}

function hexToBytes(hex) {
  const clean = String(hex).replace(/\s+/g, "");
  if (clean.length % 2) throw new Error("hexToBytes: odd-length hex");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return out;
}

// helpers.js

// existing: converts even-length hex -> Uint8Array
function hexToBytes(hex) {
  const clean = String(hex).replace(/\s+/g, "");
  if (clean.length % 2) throw new Error("hexToBytes: odd-length hex");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}

// remove `nibbles` (hex chars) from start of raw Uint8Array and return next `outLen` bytes
function stripNibblesAndSlice(raw, nibbles, outLen = 16) {
  if (!(raw instanceof Uint8Array)) raw = new Uint8Array(raw || []);
  if (nibbles < 0) throw new Error('nibbles must be >= 0');
  const bitShift = nibbles * 4; // nibbles -> bits
  const totalBits = raw.length * 8;
  if (bitShift + outLen * 8 > totalBits) return null;
  const out = new Uint8Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const bitIndex = bitShift + i * 8;
    const byteIndex = Math.floor(bitIndex / 8);
    const bitOffset = bitIndex % 8;
    const a = (byteIndex < raw.length) ? raw[byteIndex] : 0;
    const b = (byteIndex + 1 < raw.length) ? raw[byteIndex + 1] : 0;
    const left = (a << bitOffset) & 0xFF;
    const right = (bitOffset === 0) ? 0 : (b >>> (8 - bitOffset));
    out[i] = (left | right) & 0xFF;
  }
  return out;
}

// Utility: bytes -> hex
function bytesToHex(u8) {
  return Array.from(u8).map(b => b.toString(16).padStart(2,'0')).join('');
}
function bytesToWordArray(byteArray) {
  // fixed initialization to avoid NaN from uninitialized slots
  const words = new Array(Math.ceil(byteArray.length / 4)).fill(0);
  for (let i = 0; i < byteArray.length; i++) {
    words[(i / 4) | 0] |= byteArray[i] << (24 - 8 * (i % 4));
  }
  return CryptoJS.lib.WordArray.create(words, byteArray.length);
}

function seedWordsToString(words) {
  return Array.isArray(words) ? words.join(" ") : "";
}

// 2. Convert hex payload back to bitstream
function hexToBitstream(hex) {
  const clean = String(hex).replace(/\s+/g, "");
  // produce full bitstream (no slicing here; caller decides how many bits to use)
  return clean.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
}

// 3. Split bitstream into 11-bit word indices
function bitstreamToIndices(bitstr) {
  const indices = [];
  for (let i = 0; i + 11 <= bitstr.length; i += 11) {
    const chunk = bitstr.slice(i, i + 11);
    if (chunk.length === 11) {
      indices.push(parseInt(chunk, 2));
    }
  }
  return indices;
}

// 4. Map indices to words using WORDLIST
function indicesToWords(indices) {
  return indices.map(i => WORDLIST[i] || "???");
}

// ----------------- Byte-level transformers (recommended to centralize here) -----------------

function reverseBytes(u8) {
  return Uint8Array.from(u8).reverse();
}

function swapPairs(u8) {
  const r = new Uint8Array(u8);
  for (let i = 0; i + 1 < r.length; i += 2) {
    const t = r[i]; r[i] = r[i + 1]; r[i + 1] = t;
  }
  return r;
}

function swapNibbles(u8) {
  return Uint8Array.from(u8, v => (((v & 0x0f) << 4) | ((v & 0xf0) >> 4)) & 0xff);
}

function rotLeft(u8, n) {
  const r = new Uint8Array(u8.length);
  for (let i = 0; i < u8.length; i++) {
    r[i] = (((u8[i] << n) | (u8[i] >> (8 - n))) & 0xff);
  }
  return r;
}

function transformCandidates() {
  const candidates = [reverseBytes, swapPairs, swapNibbles];
  for (let n = 1; n < 8; n++) candidates.push(u => rotLeft(u, n));
  return candidates;
}

function generateTransformedCandidates(u8) {
  const out = [];
  out.push({ name: "reverse", bytes: reverseBytes(u8) });
  out.push({ name: "swapPairs", bytes: swapPairs(u8) });
  out.push({ name: "swapNibbles", bytes: swapNibbles(u8) });
  for (let n = 1; n < 8; n++) out.push({ name: `rot${n}`, bytes: rotLeft(u8, n) });
  return out;
}

// Export helpers under a namespace for convenient access while retaining original comments
window.helpers = window.helpers || {};
Object.assign(window.helpers, {
  bytesToHex,
  hexToBytes,
  bytesToWordArray,
  seedWordsToString,
  hexToBitstream,
  bitstreamToIndices,
  indicesToWords,
  reverseBytes,
  swapPairs,
  swapNibbles,
  rotLeft,
  transformCandidates,
  generateTransformedCandidates
});
