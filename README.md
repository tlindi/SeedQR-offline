# SeedQR-offline Electrum (and BIP39)

Offline generate and decode SeedQR style 12-word phrases of Electrum and BIP39 onto 21x21 compact QR 

Complies with: https://github.com/SeedSigner/seedsigner/blob/dev/docs/seed_qr/README.md

Don't trust, but verify 
- test URL: https://tlindi.github.io/SeedQR-offline/SeedQR.html
- bundled single html file: https://tlindi.github.io/SeedQR-offline/dists/SeedQR.bundle.html

## What is this?
A small, client-side web app that encodes/decodes compact 21×21 "SeedQR" payloads for 12-word BIP39 and Electrum seeds entirely offline in the browser. It provides a UI for typing/pasting 12 words, uploading or scanning a QR image (camera support), normalizes QR payloads, and decodes into words (or builds the compact payload and QR). Intended for users who want an offline tool to inspect or generate compact SeedQRs.

## Features
- Camera Support
- Encode 12 word seed to Compact SeedQR size 21x21 from words (paste supported)
- Decode 12 word seed from Compact SeedQR size 21x21 from uploaded .png
- some debug attributes for geeks to see more detail

## Done
- [x] Feature: Mobile phone camera support v0.2
- [x] Paste whole seed splitted to boxes
- [x] Validate QR (all BIP39 and Electrums)
- [x] Upload detects seed type
- [x] Electrum 2FA detected
- [x] Fix: JPG decoding - jpg smeared too small QRs so increased QR size to make decoding possible
- [x] Fix and verify electrum seed functions

## ToDo
- any ideas?

### How to create a kit? Check 3D SeedQR

See https://www.thingiverse.com/thing:6984577

## Notes:
- Camera access requires HTTPS or localhost; serving with the commands above satisfies that for local testing.
- On mobile devices camera torch is supported
- No build step is required — the site is static. If you need to regenerate QR images programmatically you can use the included qrcodegen library already bundled under libs/.
- No secrets or environment variables are needed.

# How to run it locally
Shortest path: serve the repository as static files and open SeedQR.html in a modern browser that supports Web Crypto and camera access.

Example:
```
git clone https://github.com/tlindi/SeedQR-offline
cd SeedQR-offline

# quick HTTP server (so camera & modules work reliably)
python3 -m http.server 8000
# or using Node (if you prefer)
npx serve . -l 8000

# then open in your browser:
http://localhost:8000/SeedQR.html
```

### Stack
- **Language(s):** JavaScript (primary), HTML, CSS  
- **Framework / runtime:** Plain browser-based static site (vanilla JS, ES5/ES6 + Web Crypto API)  
- **Notable libraries:** crypto-js (HMAC/SHA helpers), jsQR (QR decoding), ZXing (alternative QR decoding), qrcodegen (QR generation / Nayuki)

## How it's organized
Top-level important entries (annotated):
```
SeedQR.html            — main single-page UI (loads CSS, libs, and app JS)
README.md              — usage, sources, compatibility notes
CHANGELOG.md           — changes from earlier versions (starting from v0.2.1)
LICENSE                — project license
js/                    — smaller modules (decoder, reader, scanner helpers, debug)
js/bip39.js               — BIP39-specific packing/checksum + decode helpers
js/electrum.js            — Electrum seed decoding, checksum/version detection, packing
js/seedqr.js              — build/decode compact SeedQR payload (16-byte ↔ 12 words)
js/qrread.js              — high-level QR read helpers (adapter for libs)
js/render.js              — QR rendering and display helpers (uses qrcodegen)
js/common.js              — shared utilities used across UI modules
js/input.js               — input widgets/seed input construction + validation
js/status.js              — status UI / messages
js/reader.js              — canonical payload normalizer from jsQR/ZXing results
js/decoder.js             — central decoding orchestrator (tries Electrum then BIP39 + transforms)
js/WORDLIST.js            — bundled English BIP39 wordlist (used at runtime)
libs/                  — third-party libs (crypto-js, jsQR, qrcodegen, zxing)
css/                   — styles (styles.css)
dists/                 — distribution artifacts (build outputs / packaged files)
samples/               — sample QR images or example inputs
sources/WORDLIST-javascript.txt   — alternate/plain wordlist (data)
sources/WordList_english.const    — another wordlist/source reference
```

# How it fits together:
- The HTML pages (SeedQR.html / scanner.html) load third‑party libs then the app modules. QR decoding is attempted via jsQR or ZXing; js/reader.js normalizes the raw payload bytes from QR libraries into a canonical 16‑byte candidate. js/decoder.js coordinates decoding: it first tries Electrum (electrum.js) synchronously, then BIP39-style compact SeedQR decoding using seedqr.js + bip39.js (which uses the Web Crypto API to recompute SHA‑256 checksum nibbles). helpers.js provides deterministic transforms for common QR byte-shift issues; render.js + qrcodegen are used when generating SeedQR images from words.

## Sources

### WordList_english.h

https://github.com/bluescan/bip39tools/blob/main/Src/Bip39/Dictionary/WordList_english.h

### crypto.min.js

- https://cdnjs.com/libraries/crypto-js

- https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js

### jsQR.js - ReadQR

- https://github.com/cozmo/jsQR

### qrcodegen-1.8.0.jar CreateQR

- https://github.com/nayuki/QR-Code-generator

### Source of idea

Seedsaver v2.1 by HODLMAYR GmbH https://www.copiaro.com
