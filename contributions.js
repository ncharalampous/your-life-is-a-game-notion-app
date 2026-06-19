// Fetches real GitHub contribution data (via the same Cloudflare Worker used
// for XP syncing) and renders it as a green-dot heatmap grid, the same way
// GitHub renders the calendar on your profile page.

const CONTRIB_URL = "https://your-life-is-a-game-xp.n-pcharalampous.workers.dev/contributions";

async function loadContributions() {
  const summary = document.getElementById("contrib-summary");
  try {
    const res = await fetch(CONTRIB_URL);
    if (!res.ok) throw new Error(`Worker responded ${res.status}`);
    const data = await res.json();
    const days = data.contributions || [];

    renderGrid(days);

    const total = Object.values(data.total || {}).reduce((a, b) => a + b, 0);
    summary.textContent = `${total} contributions in the last year`;
  } catch (err) {
    summary.textContent = "Couldn't load GitHub activity.";
    console.warn("Contributions load skipped:", err.message);
  }
}

function renderGrid(days) {
  const grid = document.getElementById("contrib-grid");
  grid.innerHTML = "";
  if (days.length === 0) return;

  // Pad the front so the first column lines up on Sunday, like GitHub's own
  // calendar (each week is one column, Sunday at the top).
  const firstDay = new Date(`${days[0].date}T00:00:00`).getDay(); // 0 = Sunday
  const padded = Array(firstDay).fill(null).concat(days);

  let col = null;
  padded.forEach((day, i) => {
    if (i % 7 === 0) {
      col = document.createElement("div");
      col.className = "week-column";
      grid.appendChild(col);
    }

    const dot = document.createElement("div");
    if (day) {
      dot.className = `contrib-dot level-${day.level}`;
      dot.title = `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`;
    } else {
      dot.className = "contrib-dot level-empty";
    }
    col.appendChild(dot);
  });
}

loadContributions();
