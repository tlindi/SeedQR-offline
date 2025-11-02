// helpers.js 

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join(" ");
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

function bytesToWordArray(byteArray) {
  const words = [];
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
    return hex.split('')
              .map(c => parseInt(c, 16).toString(2).padStart(4, '0'))
              .join('')
              .slice(0, 128); // 128 bits
}

// 3. Split bitstream into 11-bit word indices
function bitstreamToIndices(bitstr) {
    const indices = [];
    for (let i = 0; i < 132; i += 11) {
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
