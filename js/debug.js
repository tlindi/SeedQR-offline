//debug.js

// Read ?debug=... from URL, e.g. ?debug=bip39 | electrum | electrum_2fa
const params = new URLSearchParams(window.location.search);
const dbgParam = params.get("debug");

// keep the original string value for mode
window.debug = dbgParam && dbgParam.toLowerCase() !== "false" ? dbgParam : false;

// boolean flag: true if any debug mode is active
window.DEBUG = !!window.debug;

if (window.debug) {
  if (window.debug === "bip39") {
    window.DEBUG_WORDS = [
      "stereo","tiny","typical","donkey","supreme","label",
      "neck","mosquito","bird","pave","anger","master"
    ];
  } else if (window.debug === "electrum") {
    window.DEBUG_WORDS = [
      "slow","pink","devote","divorce","huge","judge",
	  "echo","either","age","learn","viable","leaf"
    ];
  } else if (window.debug === "electrum_2fa") {
    window.DEBUG_WORDS = [
      "lava","laundry","mad","muffin","wORLd","margin",
      "lyrics","iDlE","stairs","thumb","crazy","outer"
    ];
  }
}
