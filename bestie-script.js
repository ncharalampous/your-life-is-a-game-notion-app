// Simplified avatar script for the bestie edition.
// No Notion sync, no gear/level-gated drawings - just XP buttons and a
// level number that goes up for fun.

// Renamed to match the actual button labels in mybestieindex.html, so the
// number on each button always matches the XP it actually gives.
const XP_VALUES = {
  reading: 100,
  summerCamp: 300,
  texting: 1000,
};

const XP_PER_LEVEL = 500; // smaller than the main avatar so leveling up feels quick

let currentXP = 0;

function calculateLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1; // starts at level 1, no cap
}

function updateDisplay() {
  document.getElementById("level").textContent = calculateLevel(currentXP);
  document.getElementById("xp").textContent = currentXP;
}

function addXP(amount) {
  currentXP += amount;
  updateDisplay();
}

updateDisplay();
