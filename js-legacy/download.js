"use strict";

// download.js
// Responsible for setting a descriptive filename for the QR canvas download.
// Exposes window.SeedQRDownloader.setFilename(name) which will:
//  - sanitize the name
//  - build a PNG blob from the <canvas> inside #qrcode
//  - set #qrcodeLink.href and #qrcodeLink.download to point to that blob and filename
//  - revoke any previously-created blob URL to avoid leaking memory

(function () {
  // sanitize filename: remove path separators and illegal characters, collapse whitespace, cap length
  function sanitizeFilename(name) {
    if (!name) name = 'SeedQR';
    // Remove chars that are unsafe in filenames
    var safe = String(name).replace(/[\/\\?%*:|"<>]/g, ' ').trim();
    // collapse whitespace and trim to reasonable length
    var collapsed = safe.replace(/\s+/g, ' ').substring(0, 120);
    // If empty after sanitization, fallback
    return collapsed || 'SeedQR';
  }

  // create/update blob URL from canvas and set link href + download
  function updateLinkWithCanvasFilename(filename) {
    var link = document.getElementById('qrcodeLink');
    var canvas = document.querySelector('#qrcode canvas');
    if (!link || !canvas) return;

    // revoke previous blob URL if present
    if (link.dataset && link.dataset.blobUrl) {
      try {
        URL.revokeObjectURL(link.dataset.blobUrl);
      } catch (e) {}
      delete link.dataset.blobUrl;
    }
    var clean = sanitizeFilename(filename);
    var finalName = clean.toLowerCase().endsWith('.png') ? clean : clean + '.png';
    if (canvas.toBlob) {
      canvas.toBlob(function (blob) {
        if (!blob) return;
        var url = URL.createObjectURL(blob);
        link.href = url;
        link.download = finalName;
        link.dataset.blobUrl = url;
      }, 'image/png');
    } else {
      // fallback to data URL
      try {
        var dataUrl = canvas.toDataURL('image/png');
        link.href = dataUrl;
        link.download = finalName;
      } catch (e) {
        console.warn('SeedQRDownloader: failed to create data URL', e);
      }
    }
  }

  // expose API
  window.SeedQRDownloader = {
    // setFilename expects a base filename (with or without .png)
    setFilename: function setFilename(name) {
      try {
        updateLinkWithCanvasFilename(name);
      } catch (e) {
        console.warn('SeedQRDownloader.setFilename error', e);
      }
    },
    // optional helper to disable / clear the link (not strictly necessary)
    clear: function clear() {
      var link = document.getElementById('qrcodeLink');
      if (!link) return;
      if (link.dataset && link.dataset.blobUrl) {
        try {
          URL.revokeObjectURL(link.dataset.blobUrl);
        } catch (e) {}
        delete link.dataset.blobUrl;
      }
      link.href = '#';
      link.download = 'download.png';
    }
  };
})();