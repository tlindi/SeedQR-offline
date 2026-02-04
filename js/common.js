//common.js 

// --- Constants ---
// Wallet type labels
const WALLET_TYPES = {
  electrum_standard: "Electrum",
  electrum_segwit: "Electrum (segwit)",
  electrum_2fa: "Electrum (2FA)",
  electrum_2fa_segwit: "Electrum (2FA Segwit)",
  seedqr: "BIP39 SeedQR"
};

// Helper: assign payload + bitstring and show indices in debug mode
function setPayloadAndIndices(bytes, bitstr, words, bytesPre, hexPre, bitsPre) {
  payloadBytes   = bytes;
  bitstrToRender = bitstr;

  // Always render payload view
  renderPayload(payloadBytes, bitstrToRender, bytesPre, hexPre, bitsPre);

  // Show decimal word indices
  const indexBox = document.getElementById('wordIndices');
  if (indexBox) {
    const indices = words.map(w => {
	  const idx = WORDLIST.indexOf(w);
      return idx.toString().padStart(4, "0");
    });
	indexBox.textContent = "# Standard SeedQR digit stream:\n" + indices.join(" ");
  }
}

async function computeChecksum(seedType, words, bitstr) {
  if (seedType === "bip39") {
    return await checkBIP39Checksum(words); // {ok, expected, actual}
  } else {
    return checkElectrumChecksum(words, bitstr); // {ok, expected, actual}
  }
}

function detectSeedType(words, bitstr) {
  // Try BIP39
  const bip39 = isValidBIP39Seed(words, bitstr);
  if (bip39.ok) {
    return { type: "bip39", walletType: "N/A" };
  }

  // Try Electrum
  const electrum = isValidElectrumSeed(words);
  if (electrum.ok) {
    return { type: "electrum", walletType: electrum.version || "unknown" };
  }

  // Neither matched
  return { type: "Unknown", walletType: "N/A" };
}

function renderStatus(seedType, result, statusEl, debug) {
  if (!result.ok && !debug) {
    statusEl.textContent = `${seedType} checksum mismatch. Got=${result.actual}, Expected=${result.expected}.`;
    statusEl.className = 'err';
    return false;
  }

  if (result.ok) {
    statusEl.textContent = `OK: ${seedType} checksum valid (${result.actual}).`;
    statusEl.className = 'ok';
  } else {
    statusEl.textContent = `Debug mode: ${seedType} checksum mismatch. Got=${result.actual}, Expected=${result.expected}.`;
    statusEl.className = 'err';
  }
  return true;
}

function renderWalletType(seedType, result, versionEl) {
  if (!versionEl) return;

  if (seedType === "bip39") {
    versionEl.textContent = "BIP39 SeedQR";
  } else if (seedType === "electrum") {
    const map = {
      electrum_standard: "Electrum (Standard)",
      electrum_segwit:   "Electrum (Segwit)",
      electrum_2fa:      "Electrum (2FA)",
      electrum_2fa_segwit: "Electrum (2FA Segwit)"
    };
    versionEl.textContent = map[result.version] || "Electrum";
  } else {
    versionEl.textContent = "Unknown";
  }
}

async function updateResults() {
  console.log('updateResults start', { lastUpload: window.lastUpload });

  const status    = document.getElementById('status');
  const bytesPre  = document.getElementById('bytes');
  const pbytesPre = document.getElementById('pbytes');
  const hexPre    = document.getElementById('hex');
  const bitsPre   = document.getElementById('bits');
  const versionEl = document.getElementById('version');
  const resultsEl = document.getElementById('results');

  // Require all 12 words
  const els = Array.from(document.querySelectorAll('#words input'));
  if (!els.every(e => e.value.trim())) {
    resultsEl.style.display = 'none';
    status.textContent = "";
    return;
  }

  try {
    const { words, indices } = getWordsAndIndices();

    let seedType        = "Unknown";
    let bip39Res        = null;
    let electrumRes     = null;

    // --- Debug overrides ---
    if (debug === "bip39") {
      const { bytes, bitstr } = buildCompactSeedQRPayload(words);
      const bitstr128 = bitstr.slice(0, 128);
      bip39Res = await checkBIP39Checksum(words, bitstr128);
      seedType = "bip39";

      setPayloadAndIndices(bytes, bitstr, words, bytesPre, hexPre, bitsPre);

    } else if (debug === "electrum" || debug === "electrum_2fa") {
      const { bitstr, bytes } = packElectrumIndices(indices);
      electrumRes = checkElectrumChecksum(words);
      seedType    = "electrum";
      electrumRes.version = electrumRes.version || "electrum_standard";

      setPayloadAndIndices(bytes, bitstr, words, bytesPre, hexPre, bitsPre);
    }

    // --- Normal detection (upload or paste) ---
    if (!debug) {
      if (window.lastUpload && window.lastUpload.words.join(" ") === words.join(" ")) {
        const { type, bytes, version } = window.lastUpload;

        if (type === "electrum") {
          electrumRes = checkElectrumChecksum(words);
          seedType = "electrum";
          payloadBytes = bytes;

          let bitstr = "";
          for (let i = 0; i < bytes.length; i++) {
            bitstr += bytes[i].toString(2).padStart(8, "0");
          }
          bitstrToRender = bitstr;
          if (!electrumRes.version) electrumRes.version = "electrum_standard";

        } else if (type === "seedqr") {
          const bitstr128 = indices.map(i => i.toString(2).padStart(11,"0")).join("").slice(0,128);
          bip39Res = await checkBIP39Checksum(words, bitstr128);
          seedType = "bip39";
          payloadBytes = bytes;
          // recompute checksum and append for rendering
          const { bitstr } = await decodeSeedQRPayload(bytes);
          bitstrToRender = bitstr;
        } else {
          seedType = "Unknown";
        }

} else {
  // --- Fallback detection ---
    const { bytes, bitstr } = buildCompactSeedQRPayload(words);
    const bitstr128 = bitstr.slice(0, 128);
    bip39Res = await checkBIP39Checksum(words, bitstr128);

    if (bip39Res.ok) {
      seedType = "bip39";
      payloadBytes   = bytes;
      bitstrToRender = bitstr;
      renderPayload(payloadBytes, bitstrToRender, bytesPre, hexPre, bitsPre, pbytesPre);
    } else {
      electrumRes = checkElectrumChecksum(words);

      if (electrumRes.ok) {
        seedType = "electrum";
        const packed = packElectrumIndices(indices);
        payloadBytes   = packed.bytes;
        bitstrToRender = packed.bitstr;
        renderPayload(payloadBytes, bitstrToRender, bytesPre, hexPre, bitsPre, pbytesPre);
      } else {
        console.log("Electrum failed, marking Unknown");
        seedType = "Unknown";
        payloadBytes   = null;
        bitstrToRender = "";
      }
    }
}
    }

    const result =
      seedType === "bip39"    ? bip39Res :
      seedType === "electrum" ? electrumRes :
      { ok: false, expected: null, actual: null };

    renderPayload(payloadBytes, bitstrToRender, bytesPre, hexPre, bitsPre, pbytesPre);
    renderStatus(seedType, result, status, debug);
    renderWalletType(seedType, result, versionEl);

    resultsEl.style.display = 'block';
  } catch (err) {
    status.textContent = 'Error: ' + err.message;
    status.className = 'err';
    resultsEl.style.display = 'none';
  }

  const inputs = document.querySelectorAll('#words input');
  const words = Array.from(inputs).map(inp => inp.value.trim()).filter(Boolean);
  document.getElementById('wordString').textContent = seedWordsToString(words);
}
