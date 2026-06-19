// Pixel-art folder widget. Click the folder, the flap lifts open (retro
// stepped animation), and a photo rises up from inside.

// 7x6 pixel-heart bitmap. 1 = filled pixel, 0 = empty.
const HEART_BITMAP = [
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];

function buildHeartSticker() {
  const sticker = document.getElementById("heart-sticker");
  HEART_BITMAP.forEach((row) => {
    row.forEach((filled) => {
      const px = document.createElement("div");
      px.className = "px" + (filled ? " on" : "");
      sticker.appendChild(px);
    });
  });
}

function playBlip() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // autoplay restrictions or no Web Audio support - just skip the sound
  }
}

function toggleFolder() {
  const folder = document.getElementById("folder");
  const photoFrame = document.getElementById("photo-frame");
  const isOpen = folder.classList.toggle("open");
  photoFrame.classList.toggle("visible", isOpen);
  playBlip();
}

buildHeartSticker();
