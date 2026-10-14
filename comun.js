import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, signInAnonymously, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getDatabase, ref, onValue, connectDatabaseEmulator } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js';
import { FORMAS } from './arte.js';
export { set, get, update, onValue, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js';

// Configuración del proyecto de Firebase (consola > Configuración del proyecto > Tus apps > Web).
const CONFIG = {
  apiKey: 'AIzaSyBZsP2gppSDrhc0-QlrXAaHcbLg-GDP_7E',
  authDomain: 'duelo-de-datos.firebaseapp.com',
  databaseURL: 'https://duelo-de-datos-default-rtdb.firebaseio.com',
  projectId: 'duelo-de-datos',
  appId: '1:1066799020994:web:90ab8a5029e9bb001c345b',
};

// En localhost se usa el emulador de Firebase (pruebas); publicado, el proyecto real.
const LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);
if (!LOCAL && !CONFIG.databaseURL) {
  document.body.innerHTML = '<p class="aviso">Falta la configuración de Firebase en comun.js.</p>';
  throw new Error('Sin configuración de Firebase');
}
const app = initializeApp(LOCAL ? { apiKey: 'demo', projectId: 'demo-duelo', databaseURL: 'https://demo-duelo-default-rtdb.firebaseio.com' } : CONFIG);
const auth = getAuth(app), db = getDatabase(app);
if (LOCAL) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectDatabaseEmulator(db, '127.0.0.1', 9000);
}

// Sesión anónima: el uid sobrevive a recargas, así nadie pierde su puntaje si se le cierra la pestaña.
export async function entrar() {
  await auth.authStateReady();
  return (auth.currentUser || (await signInAnonymously(auth)).user).uid;
}

export const r = (...partes) => ref(db, ['salas', ...partes].join('/'));

let desfase = 0;
onValue(ref(db, '.info/serverTimeOffset'), (s) => (desfase = s.val() || 0));
export const ahora = () => Date.now() + desfase;

export const $ = (s) => document.querySelector(s);
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const mostrar = (id) => document.querySelectorAll('main > section').forEach((s) => (s.hidden = s.id !== id));
export const barajar = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const duracion = (q) => {
  if (q.tipo === 'vf') return 15000;
  const n = q.o.join('').length;
  return 20000 + (n > 250 ? 5000 : 0) + (n > 400 ? 5000 : 0);
};

// Opción mostrada k -> [color, figura]. En verdadero o falso: Verdadero azul-rombo, Falso vino-triángulo.
// q es la pregunta tal como la publica el anfitrión: q.o ya viene en el orden barajado.
const ESTILO = { om: [['vino', 'tri'], ['azul', 'rombo'], ['oro', 'circ'], ['teal', 'cuad']], vf: [['azul', 'rombo'], ['vino', 'tri']] };
export const claseOp = (q, k) => 'op op-' + ESTILO[q.tipo][k][0];
export const forma = (q, k) => `<span class="forma">${FORMAS[ESTILO[q.tipo][k][1]]}</span>`;

// Orden final: más puntos; si empatan, menos tiempo acumulado.
export const ranking = (pts = {}, jug = {}) =>
  Object.entries(jug)
    .map(([id, j]) => ({ id, ...j, pts: 0, ms: 0, aciertos: 0, racha: 0, ...(pts[id] || {}) }))
    .sort((a, b) => b.pts - a.pts || a.ms - b.ms || a.apellido.localeCompare(b.apellido, 'es'));

// ---------- Sonido (Web Audio, sin archivos) ----------
let ac, mudo = localStorage.getItem('duelo-mudo') === '1';
const tono = (f, t0, dur, tipo = 'square', vol = 0.06) => {
  ac ??= new AudioContext();
  const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + t0;
  o.type = tipo;
  o.frequency.value = f;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination);
  o.start(t);
  o.stop(t + dur);
};
const ruido = (seg, vol = 0.25) => {
  ac ??= new AudioContext();
  const b = ac.createBuffer(1, ac.sampleRate * seg, ac.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin(i / 180)) * (i / d.length);
  const s = ac.createBufferSource(), g = ac.createGain();
  g.gain.value = vol;
  s.buffer = b;
  s.connect(g).connect(ac.destination);
  s.start();
};
const seguro = (fn) => (...a) => { if (!mudo) try { fn(...a); } catch {} };
export const sonar = {
  tic: seguro((fuerte) => tono(fuerte ? 1320 : 880, 0, 0.06, 'square', fuerte ? 0.07 : 0.03)),
  acierto: seguro(() => [523, 659, 784, 1047].forEach((f, i) => tono(f, i * 0.09, 0.3, 'triangle', 0.14))),
  error: seguro(() => [233, 175].forEach((f, i) => tono(f, i * 0.2, 0.35, 'sawtooth', 0.06))),
  revelar: seguro(() => [392, 523, 659].forEach((f, i) => tono(f, i * 0.07, 0.4, 'triangle', 0.12))),
  doble: seguro(() => [523, 523, 784, 1047].forEach((f, i) => tono(f, i * 0.14, 0.25, 'square', 0.07))),
  redoble: seguro((seg) => ruido(seg)),
  fanfarria: seguro(() => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tono(f, i * 0.12, i === 5 ? 0.9 : 0.2, 'square', 0.07))),
};
let bucle;
export function musica(on) {
  clearInterval(bucle);
  if (!on) return;
  const notas = [262, 330, 392, 330, 220, 262, 330, 262, 175, 220, 262, 220, 196, 247, 294, 247];
  let i = 0;
  bucle = setInterval(() => {
    if (mudo) return;
    tono(notas[i % 16] * 2, 0, 0.18, 'triangle', 0.045);
    if (i % 4 === 0) tono(notas[i % 16] / 2, 0, 0.3, 'square', 0.025);
    i++;
  }, 210);
}
export function botonMudo(el) {
  const pinta = () => (el.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 9h4l5-4v14l-5-4H3z" fill="#fff"/>${mudo ? '<path d="M16 9l5 6M21 9l-5 6" stroke="#fff" stroke-width="2"/>' : '<path d="M16 8q3 4 0 8M19 5q6 7 0 14" fill="none" stroke="#fff" stroke-width="2"/>'}</svg>`);
  el.onclick = () => { mudo = !mudo; localStorage.setItem('duelo-mudo', mudo ? '1' : '0'); pinta(); };
  pinta();
}

// ---------- Confeti ----------
export function confeti(ms = 5000) {
  const c = document.createElement('canvas'), x = c.getContext('2d');
  c.className = 'confeti';
  document.body.append(c);
  c.width = innerWidth;
  c.height = innerHeight;
  const col = ['#EAAA00', '#910048', '#4F83D1', '#fff', '#0F6E74'];
  const p = Array.from({ length: 180 }, () => ({ x: Math.random() * c.width, y: -Math.random() * c.height, v: 2 + Math.random() * 4, a: Math.random() * 6, g: (Math.random() - 0.5) * 0.2, c: col[Math.floor(Math.random() * 5)] }));
  const fin = performance.now() + ms;
  (function paso(t) {
    x.clearRect(0, 0, c.width, c.height);
    for (const q of p) {
      q.y += q.v;
      q.x += Math.sin(q.a) * 1.5;
      q.a += q.g;
      x.save();
      x.translate(q.x, q.y);
      x.rotate(q.a);
      x.fillStyle = q.c;
      x.fillRect(-5, -3, 10, 6);
      x.restore();
    }
    t < fin ? requestAnimationFrame(paso) : c.remove();
  })(performance.now());
}
