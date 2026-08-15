Changelog
All notable changes in this repository are recorded in this file.

[v0.2.1] - 2026-08-15
Fixed
Electrum decoder: decodeElectrumSeed now returns the canonical array of words instead of an object ({ words, version }). This restores expected return shape for existing callers and fixes Electrum detection/decoding failures.
Changed
SeedQR.html: author/date updated to "tlindi & Copilot (C)20260815" and small layout and UI improvements for upload/camera/results flow.
Added / Improved
UI: clearer camera controls (scan/torch), improved show/hide of upload/camera/results cards, and stronger debug banner handling.
JS: reorganized some scripts under js/ (common.js → js/common.js, input.js → js/input.js, status.js → js/status.js), improved camera/scan handling in js/scanner.js, centralized decoded-result handling (handleDecodedResult), and added debug logging to help diagnose decoding issues.
CSS: refreshed styles in css/styles.css (buttons, camera controls, QR layout and general polish).
Removed
A couple of example images from samples/ that were unused.
Notes
The Electrum variant (standard / segwit / 2fa / 2fa_segwit) is still determined by checkElectrumChecksum(words) — callers that need the variant can call that helper after decoding.