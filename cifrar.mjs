// Valida preguntas.json y lo cifra en banco.js (AES-GCM, clave derivada con PBKDF2).
// Uso: node cifrar.mjs [clave-anfitrion]   (sin argumento, la lee de CLAVE-DOCENTE.txt)
// Campos: id único; s = bloque (1, 2, 3...); g = grupo opcional (no salen dos del mismo grupo);
// tipo 'om' (4 opciones) o 'vf' (["Verdadero", "Falso"]); t = enunciado; o = opciones;
// c = índice de la correcta; por[i] = por qué la opción i está mal ("" en la correcta);
// exp = explicación.
import { readFileSync, writeFileSync } from 'node:fs';

const aqui = (f) => new URL(f, import.meta.url);
const clave = process.argv[2] || readFileSync(aqui('CLAVE-DOCENTE.txt'), 'utf8').trim();
const texto = readFileSync(aqui('preguntas.json'), 'utf8');
const banco = JSON.parse(texto);

const errores = [], ids = new Set();
const lleno = (s) => typeof s === 'string' && s.trim() !== '';
banco.forEach((q, n) => {
  const mal = (m) => errores.push(`Pregunta ${q.id ?? '#' + (n + 1)}: ${m}`);
  if (!Number.isInteger(q.id) || ids.has(q.id)) mal('id falta o está repetido');
  ids.add(q.id);
  if (!Number.isInteger(q.s) || q.s < 1) mal('s debe ser el número de bloque');
  if (q.g !== undefined && !lleno(q.g)) mal('g debe ser texto');
  if (!lleno(q.t)) mal('falta el enunciado (t)');
  const n_o = { om: 4, vf: 2 }[q.tipo];
  if (!n_o) return mal('tipo debe ser "om" o "vf"');
  if (!Array.isArray(q.o) || q.o.length !== n_o || !q.o.every(lleno) || new Set(q.o).size !== n_o) mal(`o debe tener ${n_o} opciones distintas`);
  else if (q.tipo === 'vf' && (q.o[0] !== 'Verdadero' || q.o[1] !== 'Falso')) mal('en vf, o debe ser ["Verdadero", "Falso"]');
  if (!Number.isInteger(q.c) || q.c < 0 || q.c >= n_o) mal('c debe ser el índice de la opción correcta');
  if (!Array.isArray(q.por) || q.por.length !== n_o || q.por.some((p, i) => i !== q.c && !lleno(p))) mal('por necesita un porqué para cada opción incorrecta');
  if (!lleno(q.exp)) mal('falta la explicación (exp)');
});
if (!banco.length) errores.push('preguntas.json está vacío');
if (errores.length) { console.error(errores.join('\n')); process.exit(1); }

const { subtle } = globalThis.crypto;
const b64 = (u) => Buffer.from(u).toString('base64');
const sal = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await subtle.importKey('raw', new TextEncoder().encode(clave), 'PBKDF2', false, ['deriveKey']);
const llave = await subtle.deriveKey({ name: 'PBKDF2', salt: sal, iterations: 200000, hash: 'SHA-256' },
  base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
const datos = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv }, llave, new TextEncoder().encode(JSON.stringify(banco))));

// Comprobación: lo cifrado se abre con la misma clave y da el mismo banco.
const vuelta = new TextDecoder().decode(await subtle.decrypt({ name: 'AES-GCM', iv }, llave, datos));
if (vuelta !== JSON.stringify(banco)) { console.error('El banco cifrado no se pudo verificar'); process.exit(1); }

writeFileSync(aqui('banco.js'), '// Banco de preguntas cifrado. Solo se abre con la clave del anfitrión.\n'
  + `export const BANCO = ${JSON.stringify({ sal: b64(sal), iv: b64(iv), d: b64(datos) })};\n`);
console.log(`banco.js generado con ${banco.length} preguntas`);
