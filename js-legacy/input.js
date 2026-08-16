"use strict";

//input.js 

function attachPasteHandler() {
  var container = document.getElementById('words');
  if (!container || container.dataset.pasteAttached === "true") return;
  container.addEventListener('paste', e => {
    var text = (e.clipboardData || window.clipboardData).getData('text');
    if (!text) return;
    var words = text.trim().split(/\s+/);
    if (words.length < 2) return;
    e.preventDefault();
    var inputs = container.querySelectorAll('input');
    inputs.forEach((inp, i) => {
      var normalized = (words[i] || '').replace(/[^a-z]/gi, '').toLowerCase();
      inp.value = normalized;
    });

    // Trigger validation + QR immediately
    if (typeof validateInputs === 'function') validateInputs();
    if (typeof updateResults === 'function') updateResults();
  });
  container.dataset.pasteAttached = "true";
}
function makeInputs() {
  var wrap = document.getElementById('words');
  wrap.innerHTML = "";
  for (var i = 0; i < 12; i++) {
    var box = document.createElement('div');
    box.className = 'wordbox';
    var num = document.createElement('span');
    num.textContent = i + 1 + '.';
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = `Word ${i + 1}`;
    box.appendChild(num);
    box.appendChild(inp);
    if (window.debug && typeof DEBUG_WORDS !== 'undefined') {
      inp.value = DEBUG_WORDS[i] || "";
    }
    wrap.appendChild(box);
  }
}
function attachValidation() {
  var inputs = document.querySelectorAll('#words input');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => {
      tryAutocomplete(inp);
      validateInputs();
      updateResults();
    });
  });
}
function validateInputs() {
  var inputs = document.querySelectorAll('#words input');
  var invalidFound = false;
  var allFilled = true;
  var anyFilled = false;
  inputs.forEach((inp, idx) => {
    var val = inp.value.trim().toLowerCase();
    if (val) {
      anyFilled = true;
    } else {
      allFilled = false;
    }
    if (val && WORDLIST.indexOf(val) === -1) {
      inp.classList.add('invalid');
      invalidFound = true;
    } else {
      inp.classList.remove('invalid');
    }
  });

  // disable clearBtn if nothing entered
  var clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.disabled = !anyFilled;
}
function tryAutocomplete(inputEl) {
  var val = inputEl.value.trim().toLowerCase();
  if (val.length < 3) return; // too short

  // Find all matches
  var matches = WORDLIST.filter(w => w.startsWith(val));
  if (val.length === 3 && matches.length === 1) {
    // Unique at 3rd char
    inputEl.value = matches[0];
  } else if (val.length === 4 && matches.length === 1) {
    // Unique at 4th char
    inputEl.value = matches[0];
  }
}
function getWordsAndIndices() {
  var els = Array.from(document.querySelectorAll('#words input'));
  var words = els.map(e => e.value.trim().toLowerCase());
  if (words.some(w => !w)) throw new Error('All 12 words are required.');
  var indices = words.map(w => {
    var i = WORDLIST.indexOf(w);
    if (i === -1) throw new Error(`Unknown word: ${w}`);
    return i;
  });
  return {
    words,
    indices
  };
}