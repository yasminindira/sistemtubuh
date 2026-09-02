const learnedKey = "explorer-sistem-tubuh-learned";
const themeKey = "explorer-sistem-tubuh-theme";

const $ = (sel) => document.querySelector(sel);

function getLearned() {
  try {
    return JSON.parse(localStorage.getItem(learnedKey) || "[]");
  } catch {
    return [];
  }
}

function setLearned(ids) {
  localStorage.setItem(learnedKey, JSON.stringify(ids));
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(themeKey, theme);
  const btn = $("#themeBtn");
  if (btn) btn.textContent = theme === "dark" ? "☀" : "☾";
}

function renderProgress() {
  const learned = getLearned();
  const total = SYSTEMS.length;
  const n = learned.length;
  $("#progressText").textContent = `${n} / ${total} sistem dipelajari`;
  $("#progressBar").style.width = `${(n / total) * 100}%`;
}

function cardTemplate(sys) {
  const done = getLearned().includes(sys.id);
  return `
    <button class="card" data-open="${sys.id}" style="border-top: 4px solid ${sys.color}">
      <div class="emoji">${sys.emoji}</div>
      <h3>${sys.name}</h3>
      <p>${sys.ringkasan}</p>
      <div class="meta">${done ? "Sudah dipelajari" : "Buka explainer"}</div>
    </button>
  `;
}

function renderGrid(filter = "all", query = "") {
  const q = query.trim().toLowerCase();
  const list = SYSTEMS.filter((s) => {
    const matchQ =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.shortName.toLowerCase().includes(q) ||
      s.ringkasan.toLowerCase().includes(q);
    const matchF = filter === "all" || s.id === filter;
    return matchQ && matchF;
  });
  $("#grid").innerHTML = list.map(cardTemplate).join("") || "<p>Tidak ada hasil.</p>";
}

function openSystem(id) {
  const sys = SYSTEMS.find((s) => s.id === id);
  if (!sys) return;
  const learned = getLearned();
  if (!learned.includes(id)) {
    learned.push(id);
    setLearned(learned);
    renderProgress();
    renderGrid($(".chip.active")?.dataset.filter || "all", $("#search").value);
  }

  $("#sheet").innerHTML = `
    <div class="sheet-head">
      <div>
        <div class="kicker">${sys.emoji} ${sys.shortName}</div>
        <h2>${sys.name}</h2>
        <p class="lead" style="color:var(--muted);margin:8px 0 0">${sys.analogi}</p>
      </div>
      <button class="icon-btn" id="closeSheet" aria-label="Tutup">✕</button>
    </div>
    <p style="line-height:1.65">${sys.ringkasan}</p>
    <div class="columns">
      <div class="block">
        <h3>Apa fungsinya?</h3>
        <ul>${sys.fungsi.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>
      <div class="block">
        <h3>Bagian utama</h3>
        <ul class="organ">${sys.organ.map((x) => `<li><strong>${x.nama}</strong> — ${x.peran}</li>`).join("")}</ul>
      </div>
      <div class="block">
        <h3>Fakta cepat</h3>
        <ul>${sys.fakta.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>
      <div class="block">
        <h3>Cara menjaga</h3>
        <ul>${sys.jaga.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>
    </div>
  `;
  $("#overlay").classList.add("open");
  $("#closeSheet").onclick = closeSheet;
}

function closeSheet() {
  $("#overlay").classList.remove("open");
}

let quizIndex = 0;
let quizScore = 0;
let quizLocked = false;
const quizOrder = [...QUIZ.keys()].sort(() => Math.random() - 0.5).slice(0, 8);

function renderQuiz() {
  const item = QUIZ[quizOrder[quizIndex]];
  $("#qMeta").textContent = `Soal ${quizIndex + 1} dari ${quizOrder.length} · skor ${quizScore}`;
  $("#qText").textContent = item.q;
  $("#qExplain").textContent = "";
  quizLocked = false;
  $("#options").innerHTML = item.options
    .map((opt, i) => `<button data-i="${i}">${opt}</button>`)
    .join("");
}

function finishQuiz() {
  $("#qMeta").textContent = "Selesai";
  $("#qText").textContent = `Skor kamu ${quizScore} dari ${quizOrder.length}.`;
  $("#options").innerHTML = "";
  $("#qExplain").textContent =
    quizScore >= 6
      ? "Pemahamanmu sudah bagus. Ulangi nanti biar makin nempel."
      : "Boleh buka lagi kartu sistem, lalu coba kuis sekali lagi.";
}

function init() {
  const savedTheme = localStorage.getItem(themeKey) || "light";
  applyTheme(savedTheme);

  renderGrid();
  renderProgress();
  renderQuiz();

  $("#search").addEventListener("input", (e) => {
    renderGrid($(".chip.active")?.dataset.filter || "all", e.target.value);
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderGrid(chip.dataset.filter, $("#search").value);
    });
  });

  $("#grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (btn) openSystem(btn.dataset.open);
  });

  document.querySelectorAll("[data-body]").forEach((el) => {
    el.addEventListener("click", () => openSystem(el.dataset.body));
  });

  $("#themeBtn").addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  $("#overlay").addEventListener("click", (e) => {
    if (e.target.id === "overlay") closeSheet();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheet();
  });

  $("#options").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn || quizLocked) return;
    const item = QUIZ[quizOrder[quizIndex]];
    const i = Number(btn.dataset.i);
    quizLocked = true;
    [...$("#options").children].forEach((b, idx) => {
      if (idx === item.a) b.classList.add("correct");
      if (idx === i && i !== item.a) b.classList.add("wrong");
    });
    if (i === item.a) quizScore += 1;
    $("#qExplain").textContent = item.explain;
    $("#qMeta").textContent = `Soal ${quizIndex + 1} dari ${quizOrder.length} · skor ${quizScore}`;
  });

  $("#nextQ").addEventListener("click", () => {
    if (quizIndex >= quizOrder.length - 1) {
      finishQuiz();
      return;
    }
    quizIndex += 1;
    renderQuiz();
  });

  $("#resetQ").addEventListener("click", () => {
    quizIndex = 0;
    quizScore = 0;
    quizOrder.sort(() => Math.random() - 0.5);
    renderQuiz();
  });
}

document.addEventListener("DOMContentLoaded", init);
