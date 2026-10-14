// Ilustraciones SVG propias: figuras de las opciones, stickers de error, medallas.
const L = 'stroke="#1f2933" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
const ojo = (x, y, r = 10) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${L}/><circle cx="${x + 2}" cy="${y + 2}" r="${r * .4}" fill="#1f2933"/>`;
const gota = (x, y) => `<path d="M${x} ${y}q-9 14 0 20q9-6 0-20z" fill="#9fd3ff" stroke="#1f2933" stroke-width="3"/>`;

export const FORMAS = {
  tri: '<svg viewBox="0 0 24 24"><polygon points="12,2 23,21 1,21" fill="#fff"/></svg>',
  rombo: '<svg viewBox="0 0 24 24"><polygon points="12,1 23,12 12,23 1,12" fill="#fff"/></svg>',
  circ: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#fff"/></svg>',
  cuad: '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="2" fill="#fff"/></svg>',
};

export const CHECK = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff"/><path d="M28 52l15 15 30-32" fill="none" stroke="#0f7b5f" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export const LLAMA = '<svg viewBox="0 0 24 24"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 0 2 1 3 2 3 0-3-1-5 1-8z" fill="#EAAA00"/><path d="M12 12c1 2 3 3 3 5a3 3 0 0 1-6 0c0-1 1-2 1-3 1 1 2 0 2-2z" fill="#fff4cc"/></svg>';
export const FLECHA = '<svg viewBox="0 0 24 24"><polygon points="12,3 22,19 2,19" fill="currentColor"/></svg>';

export const medalla = (n) => {
  const [c, b] = [['#EAAA00', '#b88400'], ['#c9d1da', '#8d99a6'], ['#d08a4e', '#9a5f2d']][n - 1];
  return `<svg viewBox="0 0 120 150"><path d="M30 0h24l14 50H44zM90 0H66L52 50h24z" fill="#002C71"/><path d="M42 0h8l12 44h-8zM78 0h-8L58 44h8z" fill="#910048"/>
  <circle cx="60" cy="95" r="46" fill="${b}"/><circle cx="60" cy="95" r="37" fill="${c}"/>
  <text x="60" y="113" text-anchor="middle" font-size="50" font-weight="800" fill="#fff" font-family="Segoe UI,Arial">${n}</text></svg>`;
};

// Stickers de error: [svg, leyenda]. El último se reserva para quien no respondió.
export const STICKERS = [
  [`<svg viewBox="0 0 200 200"><path d="M42 45v105a58 18 0 0 0 116 0V45" fill="#1B4F9C" ${L}/>
    <path d="M42 128a58 18 0 0 0 116 0" fill="none" stroke="#0d2f66" stroke-width="5"/>
    <ellipse cx="100" cy="45" rx="58" ry="18" fill="#4F83D1" ${L}/>
    <path d="M62 84q10-9 20 0M118 84q10-9 20 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
    ${gota(66, 92)}${gota(136, 92)}<path d="M82 116q18-14 36 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>`, 'Rollback'],
  [`<svg viewBox="0 0 200 200"><circle cx="78" cy="42" r="16" fill="#c3cad2" ${L}/><circle cx="102" cy="32" r="20" fill="#c3cad2" ${L}/><circle cx="128" cy="44" r="15" fill="#c3cad2" ${L}/>
    <rect x="52" y="58" width="96" height="124" rx="12" fill="#3a4654" ${L}/>
    <path d="M70 76l16 16M86 76l-16 16M114 76l16 16M130 76l-16 16" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
    <path d="M78 112q8-7 16 0t16 0t16 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <rect x="66" y="130" width="68" height="16" rx="3" fill="#1f2933"/><rect x="66" y="154" width="68" height="16" rx="3" fill="#1f2933"/>
    <circle cx="124" cy="138" r="4" fill="#e5484d"/><circle cx="124" cy="162" r="4" fill="#e5484d"/>
    <path d="M162 70l-10 16h10l-8 16" fill="none" stroke="#EAAA00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`, 'Servidor caído'],
  [`<svg viewBox="0 0 200 200"><circle cx="62" cy="100" r="40" fill="#EAAA00" ${L}/>
    <circle cx="48" cy="92" r="7" fill="#1f2933"/><circle cx="74" cy="92" r="7" fill="#1f2933"/><path d="M50 118q12-10 24 0" fill="none" stroke="#1f2933" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 91h20l-5 9 5 9h-20z" fill="#EAAA00" ${L}/>
    <g transform="rotate(14 132 100) translate(6 8)"><path d="M128 91l5 9-5 9h52v-18z" fill="#EAAA00" ${L}/><path d="M150 109v16h10v-16M168 109v11h8v-11" fill="#EAAA00" ${L}/>
    <text x="156" y="105" font-size="13" font-weight="800" fill="#002C71" font-family="Segoe UI,Arial">PK</text></g>
    <path d="M118 70l6 8M132 66l-2 10M140 76l-8 5" stroke="#1f2933" stroke-width="4" stroke-linecap="round"/></svg>`, 'Llave rota'],
  [`<svg viewBox="0 0 200 200"><rect x="28" y="45" width="144" height="112" rx="8" fill="#fff" ${L}/>
    <path d="M28 71h144V53a8 8 0 0 0-8-8H36a8 8 0 0 0-8 8z" fill="#002C71" ${L}/>
    <path d="M76 71v86M124 71v86M28 99h144M28 128h144" stroke="#1f2933" stroke-width="3"/>
    <path d="M108 45l-12 30 16 20-18 24 14 20-10 18" fill="none" stroke="#1f2933" stroke-width="6" stroke-linejoin="round"/>
    ${ojo(62, 112, 9)}${ojo(142, 112, 9)}<path d="M58 142q10-8 20 0M124 142q10 8 20 0" fill="none" stroke="#1f2933" stroke-width="5" stroke-linecap="round"/>
    ${gota(168, 28)}</svg>`, 'Integridad violada'],
  [`<svg viewBox="0 0 200 200"><path d="M100 64V40" ${L}/><circle cx="100" cy="34" r="9" fill="#EAAA00" ${L}/>
    <rect x="34" y="92" width="14" height="36" rx="5" fill="#0a4f55" ${L}/><rect x="152" y="92" width="14" height="36" rx="5" fill="#0a4f55" ${L}/>
    <rect x="46" y="64" width="108" height="92" rx="18" fill="#0F6E74" ${L}/>
    ${ojo(76, 104, 15)}${ojo(128, 100, 9)}
    <path d="M72 134l10-7 10 7 10-7 10 7 10-7 10 7" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="150" y="50" font-size="44" font-weight="900" fill="#EAAA00" stroke="#1f2933" stroke-width="3" font-family="Segoe UI,Arial">?</text>
    <text x="22" y="62" font-size="32" font-weight="900" fill="#EAAA00" stroke="#1f2933" stroke-width="3" font-family="Segoe UI,Arial">?</text></svg>`, 'Consulta sin resultados'],
  [`<svg viewBox="0 0 200 200"><rect x="24" y="44" width="152" height="118" rx="10" fill="#fff" ${L}/>
    <path d="M24 70h152V54a10 10 0 0 0-10-10H34a10 10 0 0 0-10 10z" fill="#910048" ${L}/>
    <circle cx="42" cy="57" r="4" fill="#fff"/><circle cx="56" cy="57" r="4" fill="#fff"/><circle cx="70" cy="57" r="4" fill="#fff"/>
    <text x="100" y="122" text-anchor="middle" font-size="46" font-weight="900" fill="#002C71" font-family="Segoe UI,Arial">404</text>
    <circle cx="88" cy="138" r="4" fill="#1f2933"/><circle cx="112" cy="138" r="4" fill="#1f2933"/><path d="M90 152q10-7 20 0" fill="none" stroke="#1f2933" stroke-width="4" stroke-linecap="round"/>
    ${gota(160, 76)}</svg>`, 'Respuesta no encontrada'],
  [`<svg viewBox="0 0 200 200"><path d="M34 106c-22 0-20 44 6 52" fill="none" stroke="#1f2933" stroke-width="7" stroke-linecap="round"/>
    <rect x="30" y="80" width="62" height="52" rx="12" fill="#EAAA00" ${L}/>
    <rect x="92" y="89" width="22" height="9" rx="2" fill="#c3cad2" ${L}/><rect x="92" y="114" width="22" height="9" rx="2" fill="#c3cad2" ${L}/>
    <circle cx="50" cy="100" r="5" fill="#1f2933"/><circle cx="72" cy="100" r="5" fill="#1f2933"/><path d="M52 118q9-7 18 0" fill="none" stroke="#1f2933" stroke-width="4" stroke-linecap="round"/>
    <rect x="140" y="66" width="44" height="78" rx="10" fill="#d9dee4" ${L}/><rect x="152" y="92" width="16" height="7" rx="2" fill="#1f2933"/><rect x="152" y="114" width="16" height="7" rx="2" fill="#1f2933"/>
    <path d="M124 78l-6 12h8l-6 12M130 116l-6 10h8" fill="none" stroke="#e5484d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`, 'Conexión perdida'],
  [`<svg viewBox="0 0 200 200"><circle cx="56" cy="54" r="18" fill="#910048" ${L}/><circle cx="144" cy="54" r="18" fill="#910048" ${L}/>
    <path d="M62 160l-12 18M138 160l12 18" ${L}/>
    <circle cx="100" cy="110" r="60" fill="#fff" ${L}/>
    <path d="M100 58v10M152 110h-10M100 162v-10M48 110h10" stroke="#1f2933" stroke-width="4" stroke-linecap="round"/>
    ${ojo(80, 98, 11)}${ojo(120, 98, 11)}<ellipse cx="100" cy="134" rx="10" ry="13" fill="#1f2933"/>
    <path d="M22 96q-6 14 0 28M178 96q6 14 0 28" fill="none" stroke="#1f2933" stroke-width="4" stroke-linecap="round"/></svg>`, 'Tiempo agotado'],
];
