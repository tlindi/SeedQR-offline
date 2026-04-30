# SeedQR-offline Electrum (and BIP39)

Offline generate and decode SeedQR style 12-word phrases of Electrum and BIP39 onto 21x21 compact QR 

Complies with: https://github.com/SeedSigner/seedsigner/blob/dev/docs/seed_qr/README.md

## ToDo
- [ ] Fix verify electrum seed functions

## Done
- [x] Feature: Mobile phone camera support v0.2
- [x] Paste whole seed splitted to boxes
- [x] Validate QR (all BIP39 and Electrums)
- [x] Upload detects seed type
- [x] Electrum 2FA detected
- [X] Fix: JPG decoding - jpg smeared too small QRs so increased QR size to make decoding possible

### 3D SeedQR

See https://www.thingiverse.com/thing:6984577

Sources

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
