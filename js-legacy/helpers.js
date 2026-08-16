"use strict";

// helpers.js

// Original helpers and comments retained and hardened where needed.

// Convert bytes to hex string (compact by default; pass " " as sep for spaced output)
function bytesToHex(bytes) {
  var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  if (!bytes) return "";
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join(sep);
}

// existing: converts even-length hex -> Uint8Array
function hexToBytes(hex) {
  var clean = String(hex).replace(/\s+/g, "");
  if (clean.length % 2) throw new Error("hexToBytes: odd-length hex");
  var out = new Uint8Array(clean.length / 2);
  for (var i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return out;
}

// remove `nibbles` (hex chars) from start of raw Uint8Array and return next `outLen` bytes
function stripNibblesAndSlice(raw, nibbles) {
  var outLen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
  if (!(raw instanceof Uint8Array)) raw = new Uint8Array(raw || []);
  if (nibbles < 0) throw new Error('nibbles must be >= 0');
  var bitShift = nibbles * 4; // nibbles -> bits
  var totalBits = raw.length * 8;
  if (bitShift + outLen * 8 > totalBits) return null;
  var out = new Uint8Array(outLen);
  for (var i = 0; i < outLen; i++) {
    var bitIndex = bitShift + i * 8;
    var byteIndex = Math.floor(bitIndex / 8);
    var bitOffset = bitIndex % 8;
    var a = byteIndex < raw.length ? raw[byteIndex] : 0;
    var b = byteIndex + 1 < raw.length ? raw[byteIndex + 1] : 0;
    var left = a << bitOffset & 0xFF;
    var right = bitOffset === 0 ? 0 : b >>> 8 - bitOffset;
    out[i] = (left | right) & 0xFF;
  }
  return out;
}
function bytesToWordArray(byteArray) {
  // fixed initialization to avoid NaN from uninitialized slots
  var words = new Array(Math.ceil(byteArray.length / 4)).fill(0);
  for (var i = 0; i < byteArray.length; i++) {
    words[i / 4 | 0] |= byteArray[i] << 24 - 8 * (i % 4);
  }
  return CryptoJS.lib.WordArray.create(words, byteArray.length);
}

// helper: small hex preview for logs
function hexPreview(u8) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  if (!u8) return '';
  return Array.from(u8.slice(0, n)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function seedWordsToString(words) {
  return Array.isArray(words) ? words.join(" ") : "";
}

// 2. Convert hex payload back to bitstream
function hexToBitstream(hex) {
  var clean = String(hex).replace(/\s+/g, "");
  // produce full bitstream (no slicing here; caller decides how many bits to use)
  return clean.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
}

// 3. Split bitstream into 11-bit word indices
function bitstreamToIndices(bitstr) {
  var indices = [];
  for (var i = 0; i + 11 <= bitstr.length; i += 11) {
    var chunk = bitstr.slice(i, i + 11);
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
  var r = new Uint8Array(u8);
  for (var i = 0; i + 1 < r.length; i += 2) {
    var t = r[i];
    r[i] = r[i + 1];
    r[i + 1] = t;
  }
  return r;
}
function swapNibbles(u8) {
  return Uint8Array.from(u8, v => ((v & 0x0f) << 4 | (v & 0xf0) >> 4) & 0xff);
}
function rotLeft(u8, n) {
  var r = new Uint8Array(u8.length);
  for (var i = 0; i < u8.length; i++) {
    r[i] = (u8[i] << n | u8[i] >> 8 - n) & 0xff;
  }
  return r;
}
function transformCandidates() {
  var candidates = [reverseBytes, swapPairs, swapNibbles];
  var _loop = function _loop(n) {
    candidates.push(u => rotLeft(u, n));
  };
  for (var n = 1; n < 8; n++) {
    _loop(n);
  }
  return candidates;
}
function generateTransformedCandidates(u8) {
  var out = [];
  out.push({
    name: "reverse",
    bytes: reverseBytes(u8)
  });
  out.push({
    name: "swapPairs",
    bytes: swapPairs(u8)
  });
  out.push({
    name: "swapNibbles",
    bytes: swapNibbles(u8)
  });
  for (var n = 1; n < 8; n++) out.push({
    name: `rot${n}`,
    bytes: rotLeft(u8, n)
  });
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