// render.js

function renderQR(payloadBytes) {
  var seg = qrcodegen.QrSegment.makeBytes(Array.from(payloadBytes));
  var qr = qrcodegen.QrCode.encodeSegments([seg], qrcodegen.QrCode.Ecc.LOW);

  var size = qr.size;   // use property, not getSize()
  var scale = 8;

  var canvas = document.createElement('canvas');
  canvas.width = size * scale;
  canvas.height = size * scale;
  var ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // modules
  ctx.fillStyle = '#000';
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size; x++) {
      if (qr.getModule(x, y)) {   // or qr.modules[y][x]
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  var qrcodeElement = document.getElementById('qrcode');
  if (qrcodeElement) {
    qrcodeElement.innerHTML = '';
    qrcodeElement.appendChild(canvas);
  } else {
    console.warn("#qrcode element not found");
  }

  return canvas;
}

// --- Separate modifier: overlay grid or other debug visuals
function modifyCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const modules = 21; // Version 1 QR
  const step = size / modules;

  ctx.save();

  for (let i = 0; i <= modules; i++) {
    const pos = Math.round(i * step) + 0.5;

    // Decide line width
    let lineWidth = 1;
    if (i === 0 || i === modules) {
      lineWidth = 3; // outer border
    } else if (i % 7 === 0) {
      lineWidth = 2; // 3×3 block edges
    }

    // Darker red lines
    ctx.strokeStyle = "rgba(200,0,0,0.9)";
    ctx.lineWidth = lineWidth;

    // vertical
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, size);
    ctx.stroke();

    // horizontal
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(size, pos);
    ctx.stroke();
  }

  ctx.restore();
}

// Small helper to render payload consistently
function renderPayload(bytes, bitstr, bytesPre, hexPre, bitsPre,pbytesPre) {
  const canvas = renderQR(bytes);
  modifyCanvas(canvas);

	if (bytesPre) {
	  const formatLabel = (bytes.length === 16)
      ? "SeedQR (BIP39/Electrum)"
      : "Unknown format";

	  bytesPre.textContent = "# Bytes\n"
	   + Array.from(bytes).join(" ");
	}

  hexPre.textContent  = "# hex \n"
   + bytesToHex(bytes);
  bitsPre.textContent = "# CompactSeedQR bitstream:\n" 
   + bitstr;
  
  // Build Python-style bytes literal
  if (pbytesPre) {
    let pyStr = "b\"";
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];

      switch (b) {
        case 0x0a: // LF
          pyStr += "\\n";
          break;

        case 0x0d: // CR
          if (i + 1 < bytes.length && bytes[i + 1] === 0x0a) {
            pyStr += "\\r\\n";
            i++; // skip LF
          } else {
            pyStr += "\\r";
          }
          break;

        case 0x09: // Tab
          pyStr += "\\t";
          break;

        case 0x5c: // Backslash
          pyStr += "\\\\";
          break;

        default:
          if (b >= 0x20 && b <= 0x7E) {
            // printable ASCII
            pyStr += String.fromCharCode(b);
          } else {
            // generic hex escape
            pyStr += "\\x" + b.toString(16).padStart(2, "0");
          }
      }
    }
    pyStr += "\"";
    pbytesPre.textContent = pyStr;
  }
}
