// electrum.js

// Known electrum v2 prefixes
const KNOWN_PREFIXES = {
  0x01:  "electrum_standard",
  0x100: "electrum_segwit",
  0x101: "electrum_2fa",
  0x102: "electrum_2fa_segwit"
};

/**
 * Decode a QR file into Electrum seed words.
 * Electrum encodes 128 bits of entropy, no BIP39 checksum.
 */
async function decodeElectrumSeedWordsFromFile(file) {
  const { text, bytes } = await decodeQRFromFile(file);

  const rawBox = document.getElementById("qrError");
  const hexBox = document.getElementById("hex");
  const bitsBox = document.getElementById("bits");

  // Case 1: QR encodes words as text
  if (text && /^[\x20-\x7E]+$/.test(text)) {
    const maybeWords = text.trim().split(/\s+/).map(w => w.toLowerCase());
    const allValid = maybeWords.length === 12 && maybeWords.every(w => WORDLIST.includes(w));
    if (allValid) {
      if (rawBox) rawBox.textContent = "Raw QR content:\n" + maybeWords.join(" ");
      if (hexBox) hexBox.textContent = "";
      if (bitsBox) bitsBox.textContent = "";
      return maybeWords;
    }
  }

  // Case 2: Binary SeedQR (16 bytes → 128 bits)
  if (bytes.length < 16) {
    throw new Error(`Binary Electrum SeedQR requires 16 bytes, got ${bytes.length}`);
  }

  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join(" ");
  let bitString = "";
  for (let i = 0; i < 128; i++) {
    const byteIndex = i >> 3;
    const bitIndexInByte = 7 - (i & 7);
    const bit = (bytes[byteIndex] >> bitIndexInByte) & 1;
    bitString += bit ? "1" : "0";
  }

  if (rawBox) {
    let utf8 = "";
    try {
      utf8 = new TextDecoder("iso-8859-1").decode(new Uint8Array(bytes));
    } catch {
      utf8 = "[un-decodable binary]";
    }
    rawBox.textContent = "Raw QR content (latin-1):\n" + utf8 + "\n\nHex:\n" + hex;
  }

  if (hexBox) hexBox.textContent = hex;
  if (bitsBox) bitsBox.textContent = bitString;

  // Split into 11 bit indices
  const words = [];
  let bitPos = 0;
  for (let w = 0; w < 12; w++) {
    let idx = 0;
    for (let b = 0; b < 11; b++) {
      const absoluteBit = bitPos + b;
      const byteIndex = absoluteBit >> 3;
      const bitIndexInByte = 7 - (absoluteBit & 7);
      const bit = (bytes[byteIndex] >> bitIndexInByte) & 1;
      idx = (idx << 1) | bit;
    }
    bitPos += 11;
    words.push(WORDLIST[idx] || "???");
  }

  return words;
}

function checkElectrumChecksum(words) {
  const seedStr = words.join(" ");

  const hmacHex = CryptoJS.HmacSHA512(
    CryptoJS.enc.Utf8.parse(seedStr),
    CryptoJS.enc.Utf8.parse("Seed version")
  ).toString(CryptoJS.enc.Hex);

  // First 3 hex chars = 12 bits
  const first12bits = parseInt(hmacHex.substr(0, 3), 16);

  // Match against known hex prefixes
  let matched = null;
  for (const [hexCode, label] of Object.entries(KNOWN_PREFIXES)) {
    if (first12bits === parseInt(hexCode)) {
      matched = { code: hexCode, label };
      break;
    }
  }

  return {
    ok: !!matched,
    version: matched ? matched.label : null,
    expected: matched ? matched.code : null,
    actual: first12bits,
    hmacFirst3Hex: hmacHex.substr(0, 3)
  };
}

// Pack 12 indices into 128 bit entropy slice (for QR or display)
function packElectrumIndices(indices) {
  if (!Array.isArray(indices) || indices.length !== 12) {
    throw new Error("Expected 12 indices for Electrum seed");
  }
  const fullBitstr = indices.map(i => i.toString(2).padStart(11, "0")).join("");
  const bitstr = fullBitstr.slice(0, 128);
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(bitstr.slice(i * 8, i * 8 + 8), 2);
  }
  return { bitstr, bytes };
}

/**
 * Simple validator wrapper for Electrum seeds.
 * Delegates to checkElectrumChecksum and returns a minimal result.
 */
function isValidElectrumSeed(words) {
  const res = checkElectrumChecksum(words);
  return { ok: res.ok, version: res.version };
}

function isElectrumPayload(bytes) {
  // Electrum seeds are 16 bytes, but not valid BIP39 entropy.
  // Simple heuristic: try decoding and checksum validation.
  try {
    const words = decodeElectrumSeed(bytes);
    const res = checkElectrumChecksum(words);
    return res.ok;
  } catch (e) {
    return false;
  }
}

function decodeElectrumSeed(bytes, versionTag = "segwit") {
  if (!(bytes instanceof Uint8Array) || bytes.length !== 16) {
    throw new Error(`Electrum payload must be 16 bytes, got ${bytes.length}`);
  }

  // Build 128-bit stream
  let bitstr = "";
  for (let i = 0; i < bytes.length; i++) {
    bitstr += bytes[i].toString(2).padStart(8, "0");
  }

  // First 11 indices (121 bits)
  const indices = [];
  for (let w = 0; w < 11; w++) {
    const slice = bitstr.slice(w * 11, (w + 1) * 11);
    indices.push(parseInt(slice, 2));
  }

  // Last word: 7 known bits + brute-force 4 bits
  const lastPrefixBits = bitstr.slice(11 * 11, 11 * 11 + 7);
  for (let suffix = 0; suffix < 16; suffix++) {
    const lastBits = lastPrefixBits + suffix.toString(2).padStart(4, "0");
    const lastIdx = parseInt(lastBits, 2);
    const words = indices.map(i => WORDLIST[i]).concat(WORDLIST[lastIdx]);
    const res = checkElectrumChecksum(words);
    if (res && res.ok) {
      // Return canonical words array (callers expect an Array).
      // Callers that need version can call checkElectrumChecksum(words).
      return words;
    }
  }

  throw new Error("No valid Electrum checksum found");
}
