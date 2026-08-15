// status.js

function renderStatus(seedType, result) {
  const status = document.getElementById('status');

  if (result.ok) {
    if (seedType === "bip39") {
      let msg =
        `OK: bip39 checksum valid (${result.actual}). ` +
        `Last word "${result.lastWord}" (index ${result.lastIndex}) = ${result.lastBits}. ` +
        `Entropy=${result.lastEntropyBits}, checksum=${result.lastChecksumBits}.`;
      status.innerHTML = msg.replace(/\. /g, '.<br>');
    } else if (seedType === "electrum") {
      let msg =
        `OK: electrum seed version recognized as "${result.version}". ` +
        `Matched prefix=${result.expected}. ` +
        `HMAC first 12 bits=${result.hmacFirstBitsBin} (hex ${result.hmacFirst3Hex}).`;
      status.innerHTML = msg.replace(/\. /g, '.<br>');
    } else {
      status.textContent = `OK: ${seedType} checksum valid (${result.actual}).`;
    }

    status.className = 'ok';
  } else {
    if (seedType === "bip39") {
      let msg =
        `Debug mode: bip39 checksum mismatch. Got=${result.actual}, Expected=${result.expected}. ` +
        `Last word "${result.lastWord}" (index ${result.lastIndex}) = ${result.lastBits}. ` +
        `Entropy=${result.lastEntropyBits}, checksum=${result.lastChecksumBits}.`;
      status.innerHTML = msg.replace(/\. /g, '.<br>');
    } else if (seedType === "electrum") {
      let msg =
        `Debug mode: electrum seed version not recognized. ` +
        `HMAC first 12 bits=${result.hmacFirstBitsBin} (hex ${result.hmacFirst3Hex}). ` +
        `Leading bits observed=${result.actualPrefix}.`;
      status.innerHTML = msg.replace(/\. /g, '.<br>');
    } else {
      status.textContent =
        `Debug mode: ${seedType} checksum mismatch. Got=${result.actual}, Expected=${result.expected}.`;
    }

    status.className = 'err';
  }

  // Wallet type always goes into <pre id="version">
  let walletType;
  if (seedType === "electrum" && result.version) {
    // use the subtype string like "segwit", "2fa", "2fa_segwit"
    walletType = WALLET_TYPES[result.version] || "Electrum (unknown)";
  } else if (seedType === "bip39") {
    walletType = WALLET_TYPES["bip39"];
  } else {
    walletType = "unknown";
    // Also show the seed words as a single string under the QR
    const inputs = document.querySelectorAll('#words input');
    const words = Array.from(inputs).map(inp => inp.value.trim()).filter(Boolean);
  }
  document.getElementById('version').textContent = walletType;

  // auto-show resultsCard when we have a wallet type
//  if (walletType && walletType !== "unknown") {
//    hideCard('upload');
//    hideCard('camera');
//    showCard('results');
//  }
}
