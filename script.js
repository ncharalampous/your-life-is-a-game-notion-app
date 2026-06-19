// ---- XP values for every activity (your numbers from before) ----
// An "object" here is just a list of name: value pairs.
const XP_VALUES = {
  dailyLogin: 100,
  workout: 300,
  reading: 75,
  pomodoro: 80,
  learning: 200,
  gitStreak: 30,
  newRepoProgram: 70,
  math: 60,
  structures: 50,
};

// ---- Leveling rule ----
// Level N requires N * 1000 cumulative XP (Level 1 = 1000, Level 2 = 2000, ... Level 10 = 10000)
const XP_PER_LEVEL = 1000;
const MAX_LEVEL = 10; // we can raise this later without changing the formula

// ---- State ----
// This is the ONE source of truth: total XP earned so far.
let currentXP = 0;

// Given a total XP amount, work out what level that is.
function calculateLevel(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL);
  return Math.min(level, MAX_LEVEL);
}

// How much total XP is needed to reach the NEXT level (handy for a progress bar later).
function xpForNextLevel(level) {
  return Math.min(level + 1, MAX_LEVEL) * XP_PER_LEVEL;
}

// ---- Gear unlocks ----
// Each entry is one <g id="..."> in the SVG, and the level it should appear at.
const GEAR_ITEMS = [
  { id: "gear-desk-base", minLevel: 1 },
  { id: "gear-keyboard", minLevel: 2 },
  { id: "gear-monitor-a", minLevel: 3 },
  { id: "gear-mouse", minLevel: 4 },
  { id: "gear-deskpad", minLevel: 5 },
  { id: "gear-ipad", minLevel: 6 },
  { id: "gear-lamp", minLevel: 7 },
  { id: "gear-tower", minLevel: 9 },
  { id: "gear-monitor-b", minLevel: 10 },
];

// Show/hide every piece of gear based on the current level.
function updateAvatar(level) {
  GEAR_ITEMS.forEach(({ id, minLevel }) => {
    const el = document.getElementById(id);
    if (el) el.style.display = level >= minLevel ? "inline" : "none";
  });

  // The laptop she's holding changes in stages:
  // level 0-7: old laptop | level 8-9: macbook | level 10+: no laptop (she's on the tower now)
  document.getElementById("laptop-old").style.display = level < 8 ? "inline" : "none";
  document.getElementById("laptop-macbook").style.display =
    level >= 8 && level < 10 ? "inline" : "none";
}

// Push the current state onto the actual page.
function updateDisplay() {
  const level = calculateLevel(currentXP);
  document.getElementById("level").textContent = level;
  document.getElementById("xp").textContent = currentXP;
  updateAvatar(level);
}

// The one function everything else will call to gain XP.
function addXP(amount) {
  currentXP += amount;
  updateDisplay();
  console.log(`+${amount} XP -> total ${currentXP}, level ${calculateLevel(currentXP)}`);
}

// Sync the display as soon as the page loads.
updateDisplay();
