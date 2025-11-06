// seedqr.js

// Build Compact SeedQR payload from 12 BIP39 words
function buildCompactSeedQRPayload(words) {
  if (!Array.isArray(words) || words.length !== 12) {
    throw new Error("Expected 12 words for BIP39 Compact SeedQR");
  }

  // Map words to indices
  const indices = words.map(w => WORDLIST.indexOf(w));
  if (indices.some(i => i < 0)) {
    throw new Error("One or more words not found in WORDLIST");
  }

  // Build 132-bit string (12 * 11 bits)
  const bitstr132 = indices.map(i => i.toString(2).padStart(11, "0")).join("");

  // Take the first 128 bits (entropy)
  const entropyBits = bitstr132.slice(0, 128);

  // Pack into 16 bytes
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(entropyBits.slice(i * 8, (i + 1) * 8), 2);
  }

  // Return 16-byte payload and full 132-bit string for debugging
  return { bytes, bitstr: bitstr132 };
}

// Convert 16-byte payload to 128-bit string
function toBitstr128(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length !== 16) {
    throw new Error(`Expected 16-byte Compact SeedQR payload, got ${bytes.length}`);
  }
  let bitstr = "";
  for (let i = 0; i < 16; i++) {
    bitstr += bytes[i].toString(2).padStart(8, "0");
  }
  return bitstr;
}

// Decode 132 bits → 12 word indices
function bitstrToBip39Words(bitstr132) {
  const words = [];
  let pos = 0;
  for (let w = 0; w < 12; w++) {
    let idx = 0;
    for (let b = 0; b < 11; b++) {
      idx = (idx << 1) | (bitstr132[pos + b] === "1" ? 1 : 0);
    }
    pos += 11;
    words.push(WORDLIST[idx] || "???");
  }
  return words;
}

// Decode SeedQR payload (16 bytes → 12 words with recomputed checksum)
async function decodeSeedQRPayload(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length !== 16) {
    throw new Error(`Expected 16-byte Compact SeedQR payload, got ${bytes.length}`);
  }

  // Step 1: Convert to 128-bit string
  let bitstr128 = "";
  for (let i = 0; i < 16; i++) {
    bitstr128 += bytes[i].toString(2).padStart(8, "0");
  }

  // Step 2: Recompute checksum nibble (first 4 bits of SHA-256(entropy))
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  const hash = new Uint8Array(buf);
  const checksumBits = ((hash[0] & 0xF0) >> 4).toString(2).padStart(4, "0");

  // Step 3: Append checksum bits → full 132-bit stream
  const bitstr132 = bitstr128 + checksumBits;

  // Step 4: Split into 12×11-bit indices → words
  const words = bitstrToBip39Words(bitstr132);

  return { words, bitstr: bitstr132 };
}
