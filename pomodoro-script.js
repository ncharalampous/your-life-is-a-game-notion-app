// Pomodoro timer logic. No Notion sync, no dependency on the avatar scripts -
// this widget is fully standalone.

const WORK_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;
const LONG_BREAK_MINUTES = 15;
const CYCLES_BEFORE_LONG_BREAK = 4;

const MODE_LABELS = {
  work: "WORK",
  short_break: "BREAK",
  long_break: "LONG BREAK",
};

const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const modeLabelEl = document.getElementById("mode-label");
const dotsEl = document.getElementById("session-dots");
const playBtn = document.getElementById("play-btn");
const resetBtn = document.getElementById("reset-btn");
const skipBtn = document.getElementById("skip-btn");

let mode = "work";
let remainingSeconds = WORK_MINUTES * 60;
let timerId = null;
let isRunning = false;
let completedPomodoros = 0; // resets to 0 after every long break

function minutesForMode(m) {
  if (m === "work") return WORK_MINUTES;
  if (m === "short_break") return SHORT_BREAK_MINUTES;
  return LONG_BREAK_MINUTES;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  minutesEl.textContent = pad(mins);
  secondsEl.textContent = pad(secs);
  modeLabelEl.textContent = MODE_LABELS[mode];
  document.title = `${pad(mins)}:${pad(secs)} - ${MODE_LABELS[mode]}`;
  renderDots();
}

function renderDots() {
  dotsEl.innerHTML = "";
  for (let i = 0; i < CYCLES_BEFORE_LONG_BREAK; i++) {
    const dot = document.createElement("span");
    dot.className = "dot" + (i < completedPomodoros ? " completed" : "");
    dotsEl.appendChild(dot);
  }
}

function playBeep() {
  // Simple Web Audio beep so this doesn't depend on an external sound file.
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playTone = (delayMs) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.value = 0.15;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setTimeout(() => osc.stop(), 220);
      }, delayMs);
    };
    playTone(0);
    playTone(280);
  } catch (e) {
    // Audio not available (e.g. autoplay restrictions) - fail silently.
  }
}

function switchToNextMode() {
  if (mode === "work") {
    completedPomodoros++;
    if (completedPomodoros >= CYCLES_BEFORE_LONG_BREAK) {
      mode = "long_break";
    } else {
      mode = "short_break";
    }
  } else {
    if (mode === "long_break") {
      completedPomodoros = 0;
    }
    mode = "work";
  }
  remainingSeconds = minutesForMode(mode) * 60;
  updateDisplay();
}

function tick() {
  remainingSeconds--;
  if (remainingSeconds < 0) {
    playBeep();
    switchToNextMode();
    return;
  }
  updateDisplay();
}

function start() {
  if (isRunning) return;
  isRunning = true;
  playBtn.innerHTML = "&#10074;&#10074;"; // pause icon
  timerId = setInterval(tick, 1000);
}

function pause() {
  isRunning = false;
  playBtn.innerHTML = "&#9658;"; // play icon
  clearInterval(timerId);
}

function togglePlayPause() {
  if (isRunning) {
    pause();
  } else {
    start();
  }
}

function reset() {
  pause();
  remainingSeconds = minutesForMode(mode) * 60;
  updateDisplay();
}

function skip() {
  pause();
  switchToNextMode();
}

playBtn.addEventListener("click", togglePlayPause);
resetBtn.addEventListener("click", reset);
skipBtn.addEventListener("click", skip);

updateDisplay();
