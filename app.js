/* ============================
   AURA TRACKER — JavaScript
   Gen Z / TikTok vibes 💜
   ============================ */

// ─── State ───────────────────────────────────────────────
let state = loadState();

function defaultState() {
  return {
    habits: [],
    aura: 0,
    log: [],
    streak: 0,
    lastDate: null,
    completedDates: {},   // { 'YYYY-MM-DD': [habitId, ...] }
  };
}
function loadState() {
  try {
    const s = localStorage.getItem('auraTracker');
    return s ? JSON.parse(s) : defaultState();
  } catch { return defaultState(); }
}
function saveState() {
  localStorage.setItem('auraTracker', JSON.stringify(state));
}

// ─── Aura Levels ─────────────────────────────────────────
const LEVELS = [
  { min: -Infinity, max: 0,    label: '💀 Ты в минусе брат', color: '#f87171' },
  { min: 0,    max: 200,  label: '🐣 Новичок',             color: '#a1a1aa' },
  { min: 200,  max: 500,  label: '🌱 Растёшь',             color: '#86efac' },
  { min: 500,  max: 1000, label: '🔥 На подъёме',          color: '#fb923c' },
  { min: 1000, max: 2000, label: '⚡ Электрик',            color: '#60a5fa' },
  { min: 2000, max: 3500, label: '💎 Алмаз',              color: '#818cf8' },
  { min: 3500, max: 5000, label: '👑 Король ауры',         color: '#f472b6' },
  { min: 5000, max: 8000, label: '🌟 Легенда',             color: '#fbbf24' },
  { min: 8000, max: Infinity, label: '✨ БОГОПОДОБНЫЙ', color: '#e879f9' },
];

const AURA_QUOTES = [
  "аура 💜 завоз",
  "чистая аура + 67",
  "фиксируем ✅",
  "они тебе не звонят потому что ты занят развитием",
  "тихий режим... аура капает",
  "зашёл в зал — +150 к ауре вот и всё",
  "не пил сегодня? аура сказала спасибо 🙏",
  "продуктивность = аура * дисциплина",
  "шёл шёл и зашёл на тренировку. вот так вот.",
  "аура нарастает молча 🌙",
  "лежишь? аура плачет. встал? аура аплодирует.",
  "discipline > motivation every time",
  "ты не пропустишь — ты не такой",
  "один день за раз. одна привычка за раз.",
  "главное не скипать 🎯",
];

function getLevel(score) {
  return LEVELS.find(l => score >= l.min && score < l.max) || LEVELS[1];
}

// ─── Date helpers ─────────────────────────────────────────
function today() {
  return new Date().toISOString().slice(0, 10);
}
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
function shortDay(date) {
  return date.toLocaleDateString('ru-RU', { weekday: 'short' }).replace('.', '');
}

// ─── Streak logic ─────────────────────────────────────────
function updateStreak() {
  const t = today();
  if (state.lastDate === t) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);

  if (state.lastDate === yStr) {
    state.streak = (state.streak || 0) + 1;
  } else if (state.lastDate && state.lastDate !== t) {
    state.streak = 1;
  } else if (!state.lastDate) {
    state.streak = 1;
  }
  state.lastDate = t;
  saveState();
}

// ─── Particles ───────────────────────────────────────────
function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['#a855f7','#ec4899','#6366f1','#3b82f6','#22c55e'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 15 + 8}s;
      animation-delay:${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

// ─── Confetti ─────────────────────────────────────────────
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#a855f7','#ec4899','#fbbf24','#22c55e','#60a5fa','#f472b6'];
  for (let i = 0; i < 80; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -10,
      w: Math.random() * 10 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / 120);
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
      p.x += p.vx; p.y += p.vy;
      p.rot += p.rotV; p.vy += 0.1;
    });
    frame++;
    if (frame < 150) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ─── Toast ───────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── Render Aura ─────────────────────────────────────────
function renderAura() {
  const score = state.aura;
  const lvl = getLevel(score);

  const scoreEl = document.getElementById('auraScore');
  scoreEl.textContent = score.toLocaleString('ru');
  scoreEl.classList.add('bump');
  setTimeout(() => scoreEl.classList.remove('bump'), 400);

  document.getElementById('auraLevel').textContent = lvl.label;
  document.getElementById('auraLevel').style.color = lvl.color;

  // bar: 0-100% within current level range
  const range = lvl.max === Infinity ? 5000 : lvl.max - lvl.min;
  const pct = Math.min(100, Math.max(0, ((score - lvl.min) / range) * 100));
  document.getElementById('auraBar').style.width = pct + '%';

  // random quote
  const q = AURA_QUOTES[Math.floor(Math.random() * AURA_QUOTES.length)];
  document.getElementById('auraQuote').textContent = q;

  // card glow color
  document.querySelector('.aura-glow').style.background =
    `radial-gradient(ellipse at center, ${lvl.color}33 0%, transparent 70%)`;
}

// ─── Render stats ─────────────────────────────────────────
function renderStats() {
  const t = today();
  const done = (state.completedDates[t] || []);
  document.getElementById('streakCount').textContent = state.streak || 0;
  document.getElementById('completedToday').textContent = done.length;
  document.getElementById('totalHabits').textContent = state.habits.length;
}

// ─── Render habits ────────────────────────────────────────
function renderHabits() {
  const list = document.getElementById('habitsList');
  const empty = document.getElementById('emptyState');
  list.innerHTML = '';

  if (!state.habits.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const t = today();
  const done = state.completedDates[t] || [];

  state.habits.forEach(h => {
    const isDone = done.includes(h.id);
    const card = document.createElement('div');
    card.className = `habit-card${isDone ? ' done' : ''}`;
    card.dataset.id = h.id;

    const pts = h.points;
    const ptsClass = pts >= 0 ? '' : 'neg';

    card.innerHTML = `
      <div class="habit-check">${isDone ? '✓' : h.emoji}</div>
      <div class="habit-info">
        <div class="habit-name">${h.name}</div>
        <div class="habit-meta">
          <span>${isDone ? 'Выполнено ✅' : 'Нажми чтобы отметить'}</span>
        </div>
      </div>
      <span class="habit-points ${ptsClass}">${pts >= 0 ? '+' : ''}${pts} аура</span>
      <button class="habit-delete" title="Удалить" data-del="${h.id}">🗑</button>
    `;

    // toggle complete
    card.addEventListener('click', (e) => {
      if (e.target.dataset.del) return;
      toggleHabit(h.id);
    });
    // delete
    card.querySelector('.habit-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteHabit(h.id);
    });

    list.appendChild(card);
  });
}

function toggleHabit(id) {
  const t = today();
  if (!state.completedDates[t]) state.completedDates[t] = [];
  const done = state.completedDates[t];
  const habit = state.habits.find(h => h.id === id);
  if (!habit) return;

  const idx = done.indexOf(id);
  if (idx === -1) {
    // Mark done
    done.push(id);
    state.aura += habit.points;
    addLog(habit.emoji, `${habit.name}`, habit.points, true);
    updateStreak();

    // Shine animation
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) { card.classList.add('shine'); setTimeout(() => card.classList.remove('shine'), 500); }

    if (habit.points > 0) {
      showToast(`${habit.emoji} +${habit.points} аура! ${randomCelebration()}`);
      if (habit.points >= 200) launchConfetti();
    } else {
      showToast(`${habit.emoji} ${habit.points} аура 😬 не лучший день...`);
    }
  } else {
    // Unmark
    done.splice(idx, 1);
    state.aura -= habit.points;
    addLog(habit.emoji, `${habit.name} (отмена)`, -habit.points, false);
    showToast(`↩️ ${habit.name} отменено`);
  }

  saveState();
  renderAll();
}

function randomCelebration() {
  const msgs = ['ЗАВОЗ ауры!','lets gooo 🔥','аура пополнена','сделал дело — гуляй смело','W move 💜','sheesh...','real one 💎'];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function deleteHabit(id) {
  state.habits = state.habits.filter(h => h.id !== id);
  saveState();
  renderAll();
  showToast('🗑 Привычка удалена');
}

// ─── Log ─────────────────────────────────────────────────
function addLog(emoji, name, pts, positive) {
  state.log.unshift({
    emoji, name, pts,
    positive,
    time: new Date().toISOString(),
  });
  if (state.log.length > 40) state.log = state.log.slice(0, 40);
}

function renderLog() {
  const el = document.getElementById('logList');
  if (!state.log.length) {
    el.innerHTML = `<div style="color:var(--text2);font-size:13px;padding:12px 0;text-align:center">Пока тихо... начни что-нибудь 🌙</div>`;
    return;
  }
  el.innerHTML = state.log.slice(0, 15).map(l => `
    <div class="log-item">
      <span class="log-icon">${l.emoji}</span>
      <span class="log-text">${l.name}</span>
      <span class="log-pts ${l.pts >= 0 ? 'pos' : 'neg'}">${l.pts >= 0 ? '+' : ''}${l.pts}</span>
      <span class="log-time">${formatTime(l.time)}</span>
    </div>
  `).join('');
}

// ─── Date strip ───────────────────────────────────────────
function renderDateStrip() {
  const strip = document.getElementById('dateStrip');
  strip.innerHTML = '';
  const days = ['вс','пн','вт','ср','чт','пт','сб'];
  const t = today();

  for (let i = -6; i <= 0; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const str = d.toISOString().slice(0, 10);
    const isToday = str === t;
    const hasData = state.completedDates[str] && state.completedDates[str].length > 0;

    const chip = document.createElement('div');
    chip.className = `date-chip${isToday ? ' today' : ''}${hasData && !isToday ? ' has-data' : ''}`;
    chip.innerHTML = `<span>${days[d.getDay()]}</span><span class="d-day">${d.getDate()}</span>`;
    strip.appendChild(chip);
  }
  // scroll to end
  strip.parentElement.scrollLeft = 9999;
}

// ─── Modal ───────────────────────────────────────────────
const EMOJIS = ['💪','🏃','💧','🥗','📚','🧘','😴','🚫','🎯','☀️','🎸','💊','🧴','🫁','🛁','💻','🏋️','🥊','🚴','🍎'];
let selectedEmoji = '💪';
let selectedPoints = 150;
let selectedPenalty = -50;

function openModal() {
  selectedEmoji = '💪';
  selectedPoints = 150;
  selectedPenalty = -50;

  document.getElementById('habitName').value = '';
  document.getElementById('customEmoji').value = '';

  // emoji grid
  const grid = document.getElementById('emojiGrid');
  grid.innerHTML = EMOJIS.map(e =>
    `<span class="emoji-opt${e === selectedEmoji ? ' sel' : ''}" data-em="${e}">${e}</span>`
  ).join('');
  grid.querySelectorAll('.emoji-opt').forEach(el => {
    el.addEventListener('click', () => {
      grid.querySelectorAll('.emoji-opt').forEach(x => x.classList.remove('sel'));
      el.classList.add('sel');
      selectedEmoji = el.dataset.em;
      document.getElementById('customEmoji').value = '';
    });
  });

  // points
  document.querySelectorAll('.point-btn').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.val) === selectedPoints);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.point-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPoints = Number(btn.dataset.val);
    });
  });

  // penalty
  document.querySelectorAll('.penalty-btn').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.val) === selectedPenalty);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.penalty-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPenalty = Number(btn.dataset.val);
    });
  });

  document.getElementById('addModal').classList.add('open');
  setTimeout(() => document.getElementById('habitName').focus(), 300);
}

function closeModal() {
  document.getElementById('addModal').classList.remove('open');
}

function saveHabit() {
  const name = document.getElementById('habitName').value.trim();
  const custom = document.getElementById('customEmoji').value.trim();
  if (!name) { showToast('⚠️ Введи название привычки!'); return; }

  const emoji = custom || selectedEmoji;
  state.habits.push({
    id: Date.now().toString(),
    name,
    emoji,
    points: selectedPoints,
    penalty: selectedPenalty,
    createdAt: new Date().toISOString(),
  });

  saveState();
  closeModal();
  renderAll();
  showToast(`${emoji} Привычка добавлена! Аура ждёт ✨`);
}

// ─── Render all ───────────────────────────────────────────
function renderAll() {
  renderAura();
  renderStats();
  renderHabits();
  renderLog();
  renderDateStrip();
}

// ─── Init ─────────────────────────────────────────────────
function init() {
  initParticles();
  renderAll();

  document.getElementById('addHabitBtn').addEventListener('click', openModal);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('saveHabit').addEventListener('click', saveHabit);

  document.getElementById('addModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('addModal')) closeModal();
  });

  document.getElementById('clearLogBtn').addEventListener('click', () => {
    state.log = [];
    saveState();
    renderLog();
    showToast('🗑 Лог очищен');
  });

  // customEmoji input clears emoji selection
  document.getElementById('customEmoji').addEventListener('input', () => {
    document.querySelectorAll('.emoji-opt').forEach(x => x.classList.remove('sel'));
  });

  // Enter to save
  document.getElementById('habitName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveHabit();
  });

  // Auto-refresh quote every 30s
  setInterval(() => {
    const q = AURA_QUOTES[Math.floor(Math.random() * AURA_QUOTES.length)];
    document.getElementById('auraQuote').textContent = q;
  }, 30000);

  // Check for new day and apply penalties
  checkDayChange();
}

function checkDayChange() {
  const t = today();
  const stored = localStorage.getItem('auraLastCheck');
  if (stored && stored !== t) {
    // New day! Apply penalties for yesterday's missed habits
    const missed = state.habits.filter(h => {
      const yd = state.completedDates[stored] || [];
      return !yd.includes(h.id) && h.penalty !== 0;
    });
    if (missed.length) {
      let totalPenalty = 0;
      missed.forEach(h => {
        state.aura += h.penalty;
        totalPenalty += h.penalty;
        addLog(h.emoji, `${h.name} пропущено`, h.penalty, false);
      });
      saveState();
      showToast(`😬 Вчера пропустил ${missed.length} привычек. Аура: ${totalPenalty}`);
    }
  }
  localStorage.setItem('auraLastCheck', t);
}

document.addEventListener('DOMContentLoaded', init);

// ─── Service Worker (PWA / APK support) ──────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch(() => {}); // fail silently if file:// protocol
  });
}

