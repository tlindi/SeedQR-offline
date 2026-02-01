//input.js 

function attachPasteHandler() {
  const container = document.getElementById('words');
  if (!container || container.dataset.pasteAttached === "true") return;

  container.addEventListener('paste', (e) => {
    const text = (e.clipboardData || window.clipboardData).getData('text');
    if (!text) return;

    const words = text.trim().split(/\s+/);
    if (words.length < 2) return;

    e.preventDefault();

    const inputs = container.querySelectorAll('input');
    inputs.forEach((inp, i) => {
      const normalized = (words[i] || '').replace(/[^a-z]/gi, '').toLowerCase();
      inp.value = normalized;
    });

    // Trigger validation + QR immediately
    if (typeof validateInputs === 'function') validateInputs();
    if (typeof updateResults === 'function') updateResults();
  });

  container.dataset.pasteAttached = "true";
}

function makeInputs() {
  const wrap = document.getElementById('words');
  wrap.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const box = document.createElement('div');
    box.className = 'wordbox';
    const num = document.createElement('span');
    num.textContent = (i+1) + '.';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = `Word ${i+1}`;
    box.appendChild(num);
    box.appendChild(inp);

    if (window.debug && typeof DEBUG_WORDS !== 'undefined') {
      inp.value = DEBUG_WORDS[i] || "";
    }

    wrap.appendChild(box);
  }
}

function attachValidation() {
  const inputs = document.querySelectorAll('#words input');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => {
      tryAutocomplete(inp);
      validateInputs();
      updateResults();
    });
  });
}

function validateInputs() {
  const inputs = document.querySelectorAll('#words input');
  let invalidFound = false;
  let allFilled = true;
  let anyFilled = false;

  inputs.forEach((inp, idx) => {
    const val = inp.value.trim().toLowerCase();
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

  // disable Make QR if any invalid OR not all filled
  document.getElementById('make').disabled = invalidFound || !allFilled;

  // disable clearBtn if nothing entered
  document.getElementById('clearBtn').disabled = !anyFilled;
}

function tryAutocomplete(inputEl) {
  const val = inputEl.value.trim().toLowerCase();
  if (val.length < 3) return; // too short

  // Find all matches
  const matches = WORDLIST.filter(w => w.startsWith(val));

  if (val.length === 3 && matches.length === 1) {
    // Unique at 3rd char
    inputEl.value = matches[0];
  } else if (val.length === 4 && matches.length === 1) {
    // Unique at 4th char
    inputEl.value = matches[0];
  }
}

function getWordsAndIndices() {
	
  const els = Array.from(document.querySelectorAll('#words input'));
  const words = els.map(e => e.value.trim().toLowerCase());
  if (words.some(w => !w)) throw new Error('All 12 words are required.');

  const indices = words.map(w => {
    const i = WORDLIST.indexOf(w);
    if (i === -1) throw new Error(`Unknown word: ${w}`);
    return i;
  });

  return { words, indices };
}