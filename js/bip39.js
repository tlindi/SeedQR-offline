// bip39.js

// Check BIP39 checksum against recomputed nibble
async function checkBIP39Checksum(words, entropyBits128) {
  if (entropyBits128.length !== 128) {
    throw new Error(`Expected 128 bits of entropy, got ${entropyBits128.length}`);
  }

  // Convert entropy bits to bytes
  const entropyBytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    entropyBytes[i] = parseInt(entropyBits128.slice(i * 8, (i + 1) * 8), 2);
  }

  // Compute SHA256(entropy) and take first 4 bits as checksum
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", entropyBytes));
  const expectedChecksumBits = ((hash[0] & 0xF0) >> 4).toString(2).padStart(4, "0");

  // Append checksum to entropy bits → 132‑bit stream
  const fullBitstr = entropyBits128 + expectedChecksumBits;

  // Inspect last word
  const lastWord   = words[words.length - 1];
  const lastIndex  = WORDLIST.indexOf(lastWord);
  const lastBits   = lastIndex.toString(2).padStart(11, "0");
  const lastEntropyBits  = lastBits.slice(0, 7);
  const lastChecksumBits = lastBits.slice(7);

  return {
    ok: lastChecksumBits === expectedChecksumBits,
    expected: expectedChecksumBits,
    actual: lastChecksumBits,
    lastWord,
    lastIndex,
    lastBits,
    lastEntropyBits,
    lastChecksumBits,
    fullBitstr
  };
}

// Simple validator wrapper
async function isValidBIP39Seed(words, entropyBits128) {
  try {
    const res = await checkBIP39Checksum(words, entropyBits128);
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

// Decode raw 16-byte entropy → 12 words
async function decodeRaw16ByteBIP39(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length !== 16) {
    throw new Error(`Expected 16-byte raw entropy SeedQR, got ${bytes.length}`);
  }

  // Compute checksum nibble (first 4 bits of SHA-256(entropy))
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const checksumBits = ((hash[0] & 0xF0) >> 4).toString(2).padStart(4, "0");

  // Build 128-bit entropy string
  let entropyBits = "";
  for (let i = 0; i < 16; i++) {
    entropyBits += bytes[i].toString(2).padStart(8, "0");
  }

  // Append checksum bits → 132-bit stream
  const bitString = entropyBits + checksumBits;

  // Split into 11-bit indices → 12 words
  const words = [];
  let bitPos = 0;
  for (let w = 0; w < 12; w++) {
    let idx = 0;
    for (let b = 0; b < 11; b++) {
      idx = (idx << 1) | (bitString[bitPos + b] === "1" ? 1 : 0);
    }
    bitPos += 11;
    words.push(WORDLIST[idx] || "???");
  }

  return words;
}
