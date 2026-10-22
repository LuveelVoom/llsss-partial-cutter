/* LLSSS partial cutter core. Pure functions, no DOM. */
const Core = (() => {
"use strict";
// Hensel letter table (bit layout NW=0x80 N=0x40 NE=0x20 W=0x10 E=0x08 SW=0x04 S=0x02 SE=0x01),
// taken from AlephAlpha/ca-rules (ntlife.rs).
const HENSEL = {
  0:{c:[0x00]},
  1:{c:[0x01,0x04,0x20,0x80],e:[0x02,0x08,0x10,0x40]},
  2:{c:[0x05,0x21,0x84,0xa0],e:[0x0a,0x12,0x48,0x50],k:[0x0c,0x11,0x22,0x30,0x41,0x44,0x82,0x88],a:[0x03,0x06,0x09,0x14,0x28,0x60,0x90,0xc0],i:[0x18,0x42],n:[0x24,0x81]},
  3:{c:[0x25,0x85,0xa1,0xa4],e:[0x1a,0x4a,0x52,0x58],k:[0x32,0x4c,0x51,0x8a],a:[0x0b,0x16,0x68,0xd0],i:[0x07,0x29,0x94,0xe0],n:[0x0d,0x15,0x23,0x61,0x86,0xa8,0xb0,0xc4],y:[0x31,0x45,0x8c,0xa2],q:[0x26,0x2c,0x34,0x64,0x83,0x89,0x91,0xc1],j:[0x0e,0x13,0x2a,0x49,0x54,0x70,0x92,0xc8],r:[0x19,0x1c,0x38,0x43,0x46,0x62,0x98,0xc2]},
  4:{c:[0xa5],e:[0x5a],k:[0x33,0x4d,0x55,0x71,0x8e,0xaa,0xb2,0xcc],a:[0x0f,0x17,0x2b,0x69,0x96,0xd4,0xe8,0xf0],i:[0x1d,0x63,0xb8,0xc6],n:[0x27,0x2d,0x87,0x95,0xa9,0xb4,0xe1,0xe4],y:[0x35,0x65,0x8d,0xa3,0xa6,0xac,0xb1,0xc5],q:[0x36,0x6c,0x8b,0xd1],j:[0x3a,0x4e,0x53,0x59,0x5c,0x72,0x9a,0xca],r:[0x1b,0x1e,0x4b,0x56,0x6a,0x78,0xd2,0xd8],t:[0x39,0x47,0x9c,0xe2],w:[0x2e,0x74,0x93,0xc9],z:[0x3c,0x66,0x99,0xc3]},
  5:{c:[0x5b,0x5e,0x7a,0xda],e:[0xa7,0xad,0xb5,0xe5],k:[0x75,0xae,0xb3,0xcd],a:[0x2f,0x97,0xe9,0xf4],i:[0x1f,0x6b,0xd6,0xf8],n:[0x3b,0x4f,0x57,0x79,0x9e,0xdc,0xea,0xf2],y:[0x5d,0x73,0xba,0xce],q:[0x3e,0x6e,0x76,0x7c,0x9b,0xcb,0xd3,0xd9],j:[0x37,0x6d,0x8f,0xab,0xb6,0xd5,0xec,0xf1],r:[0x3d,0x67,0x9d,0xb9,0xbc,0xc7,0xe3,0xe6]},
  6:{c:[0x5f,0x7b,0xde,0xfa],e:[0xaf,0xb7,0xed,0xf5],k:[0x77,0x7d,0xbb,0xbe,0xcf,0xdd,0xee,0xf3],a:[0x3f,0x6f,0x9f,0xd7,0xeb,0xf6,0xf9,0xfc],i:[0xbd,0xe7],n:[0x7e,0xdb]},
  7:{c:[0x7f,0xdf,0xfb,0xfe],e:[0xbf,0xef,0xf7,0xfd]},
  8:{c:[0xff]}
};
const pop = m => { let c = 0; while (m){ c += m & 1; m >>= 1; } return c; };

function parseRule(str){
  let s = String(str).trim().replace(/History$|Super$/i, "");
  const m = /^B([0-8a-z\-]*)\/S([0-8a-z\-]*)$/i.exec(s);
  if (!m) throw new Error("Rule must be in Hensel notation.");
  const part = txt => {
    const t = new Uint8Array(256); txt = txt.toLowerCase();
    let i = 0;
    while (i < txt.length){
      const d = txt[i]; if (!/[0-8]/.test(d)) throw new Error("Unexpected '" + d + "' in rule.");
      i++; let neg = false; if (txt[i] === "-"){ neg = true; i++; }
      let letters = ""; while (i < txt.length && /[a-z]/.test(txt[i])) letters += txt[i++];
      const tab = HENSEL[d];
      for (const L of letters) if (!tab[L]) throw new Error("Letter '" + L + "' is not valid after " + d + ".");
      const all = Object.keys(tab);
      const use = letters ? (neg ? all.filter(L => !letters.includes(L)) : [...letters]) : all;
      for (const L of use) for (const v of tab[L]) t[v] = 1;
    }
    return t;
  };
  return { B: part(m[1]), S: part(m[2]), text: "B" + m[1] + "/S" + m[2] };
}

/* ---- grids: {w,h,a:Uint8Array} ---- */
const G = (w, h) => ({ w, h, a: new Uint8Array(w * h) });
const gget = (g, x, y) => (x < 0 || y < 0 || x >= g.w || y >= g.h) ? 0 : g.a[y * g.w + x];
function step(g, rule, pad){
  const n = G(g.w + 2 * pad, g.h + 2 * pad);
  for (let y = 0; y < n.h; y++) for (let x = 0; x < n.w; x++){
    const X = x - pad, Y = y - pad;
    const m = (gget(g,X-1,Y-1)<<7)|(gget(g,X,Y-1)<<6)|(gget(g,X+1,Y-1)<<5)|(gget(g,X-1,Y)<<4)|(gget(g,X+1,Y)<<3)|(gget(g,X-1,Y+1)<<2)|(gget(g,X,Y+1)<<1)|gget(g,X+1,Y+1);
    n.a[y * n.w + x] = gget(g, X, Y) ? rule.S[m] : rule.B[m];
  }
  return n;
}
function bbox(g){ let x0 = g.w, y0 = g.h, x1 = -1, y1 = -1; for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) if (g.a[y*g.w+x]){ if (x<x0)x0=x; if (x>x1)x1=x; if (y<y0)y0=y; if (y>y1)y1=y; } return x1 < 0 ? null : { x0, y0, x1, y1 }; }
function crop(g, b){ const n = G(b.x1-b.x0+1, b.y1-b.y0+1); for (let y = 0; y < n.h; y++) for (let x = 0; x < n.w; x++) n.a[y*n.w+x] = gget(g, x+b.x0, y+b.y0); return n; }

/* ---- input parsing ---- */
function decodeRLE(text){
  const lines = text.split(/\r?\n/).filter(l => !l.startsWith("#"));
  const i = lines.findIndex(l => /^\s*x\s*=\s*\d+/.test(l));
  if (i < 0) return null;
  const hdr = lines[i];
  const W = +(/x\s*=\s*(\d+)/.exec(hdr) || [0,0])[1], H = +(/y\s*=\s*(\d+)/.exec(hdr) || [0,0])[1];
  const rule = ((/rule\s*=\s*([^\s,]+)/i.exec(hdr) || [])[1] || "");
  const body = lines.slice(i + 1).join("").split("!")[0].replace(/\s+/g, "");
  const rows = [[]]; const re = /(\d*)([p-y]?[A-X]|[a-z.$])/g; let m;
  const multi = /history/i.test(rule) || /[A-X]/.test(body);
  while ((m = re.exec(body))){
    const n = m[1] ? +m[1] : 1, tag = m[2];
    if (tag === "$"){ for (let k = 0; k < n; k++) rows.push([]); continue; }
    let st = tag === "." || tag === "b" ? 0 : (multi && /[A-X]/.test(tag) ? tag.charCodeAt(tag.length-1) - 64 : 1);
    for (let k = 0; k < n; k++) rows[rows.length-1].push(st);
  }
  const h = Math.max(H, rows.length), w = Math.max(W, ...rows.map(r => r.length));
  const st = []; for (let y = 0; y < h; y++){ const r = rows[y] || []; const o = []; for (let x = 0; x < w; x++) o.push(r[x] || 0); st.push(o); }
  return { w, h, st, rule, multi };
}
function parsePipe(text){
  const out = [];
  for (const ln of text.replace(/\u00A0/g, " ").split(/\r?\n/)){
    const a = ln.indexOf("|"), b = ln.lastIndexOf("|");
    if (a < 0 || b <= a){ if (out.length) break; else continue; }
    out.push(ln.slice(a + 1, b).split("|").map(s => { if (s.startsWith(" ")) s = s.slice(1); if (s.endsWith(" ")) s = s.slice(0, -1); return s; }));
  }
  return out.length ? out : null;
}
/* Returns {kind, ...}. kind: "phases" (array of grids, unaligned), "single" (one grid), "xyt" (lab-frame sections with unknowns) */
function parseInput(text, phaseHint){
  const t = text.trim();
  if (!t) throw new Error("Paste an RLE or a grid first.");
  const r = decodeRLE(t);
  if (r){
    if (r.multi && r.st.some(row => row.length && row.every(v => v === 6))){
      // generations stacked vertically, separated by full rows of state 6
      const blocks = []; let cur = [];
      r.st.forEach(row => { if (row.length && row.every(v => v === 6)){ if (cur.length) blocks.push(cur); cur = []; } else cur.push(row); });
      if (cur.length && cur.some(row => row.some(v => v === 1 || v === 3 || v === 5))) blocks.push(cur);
      const map = { 0: " ", 1: "*", 2: ".", 3: "*", 4: ".", 5: "*" };
      return { kind: "frame", blocks: blocks.map(b => b.map(row => row.map(v => map[v] ?? ".").join(""))), rule: r.rule };
    }
    if (r.multi && r.st.some(row => row.includes(6))){
      // LifeHistory with state-6 separators: convert to pipe text
      const map = { 0: " ", 1: "*", 2: ".", 3: "*", 4: ".", 5: "*", 6: "|" };
      return fromPipe(parsePipe(r.st.map(row => row.map(v => map[v] ?? ".").join("")).join("\n")), r.rule);
    }
    const g = G(r.w, r.h); for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) g.a[y*r.w+x] = (r.st[y][x] === 1 || r.st[y][x] === 3 || r.st[y][x] === 5) ? 1 : 0;
    const blocks = splitPhases(g, phaseHint);
    if (blocks.length === 1) return { kind: "single", grid: blocks[0], rule: r.rule };
    return { kind: "phases", phases: blocks, rule: r.rule };
  }
  const p = parsePipe(t);
  if (p) return fromPipe(p, "");
  throw new Error("Couldn't find RLE header (x = …) or grid rows (| … |).");
}
function fromPipe(rows, rule){
  const N = Math.max(...rows.map(r => r.length));
  const w = Math.max(...rows.flat().map(s => s.length));
  // sections: array of rows; each entry string or null (unknown)
  const secs = [];
  for (let t = 0; t < N; t++) secs.push(rows.map(r => { const s = r[t] || ""; return (s.trim() && /^[.*]+$/.test(s)) ? s.padEnd(w, ".") : null; }));
  // Diagonal charts have blanks around every line (the cells outside the ship's diagonal outline); keep the raw
  // strings and count such lines, so analyze() can read them cell by cell.
  const rawSecs = []; let partial = 0, full = 0;
  for (let t = 0; t < N; t++) rawSecs.push(rows.map(r => r[t] || ""));
  rawSecs.forEach(sec => sec.forEach(s => { if (!/[.*]/.test(s)) return; if (/^[.*]+$/.test(s.trim()) && !/^ /.test(s)) full++; else partial++; }));
  return { kind: "xyt", secs, w, h: rows.length, rule, rawSecs, partial, full };
}
function splitPhases(g, hint){
  const empty = []; for (let x = 0; x < g.w; x++){ let e = true; for (let y = 0; y < g.h; y++) if (g.a[y*g.w+x]){ e = false; break; } empty.push(e); }
  const gaps = []; let x = 0;
  while (x < g.w){ if (empty[x]){ const s = x; while (x < g.w && empty[x]) x++; if (s > 0 && x < g.w) gaps.push({ s, e: x - 1, len: x - s }); } else x++; }
  let use;
  if (hint && hint > 1){ use = gaps.slice().sort((a, b) => b.len - a.len).slice(0, hint - 1); }
  else use = gaps.filter(gp => gp.len >= 4);
  use.sort((a, b) => a.s - b.s);
  const cuts = [0]; use.forEach(gp => { cuts.push(gp.s); cuts.push(gp.e + 1); }); cuts.push(g.w);
  const out = [];
  for (let i = 0; i < cuts.length; i += 2){
    const b = bbox(crop(g, { x0: cuts[i], y0: 0, x1: cuts[i+1] - 1, y1: g.h - 1 }));
    if (b) out.push(crop(g, { x0: cuts[i] + b.x0, y0: b.y0, x1: cuts[i] + b.x1, y1: b.y1 }));
  }
  return out;
}

/* ---- alignment ---- */
function mismatch(A, B, dx, dy){ // compare B(x,y) with A(x+dx,y+dy) over union of both boxes
  let n = 0;
  const x0 = Math.min(0, -dx), y0 = Math.min(0, -dy), x1 = Math.max(B.w, A.w - dx), y1 = Math.max(B.h, A.h - dy);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (gget(B, x, y) !== gget(A, x + dx, y + dy)) n++;
  return n;
}
function bestShift(A, B){
  const cand = [];
  const bx = [0, A.w - B.w], by = [0, A.h - B.h];
  let best = null;
  for (const cx of bx) for (const cy of by) for (let ddx = -4; ddx <= 4; ddx++) for (let ddy = -4; ddy <= 4; ddy++){
    const dx = cx + ddx, dy = cy + ddy, s = mismatch(A, B, dx, dy);
    if (!best || s < best.s) best = { dx, dy, s };
  }
  return best;
}
/* Place side-by-side phases in one lab frame. Returns {gens:[{g,ox,oy}], DX, DY, errs} */
function orderPhases(phases, rule){
  const N = phases.length; if (N < 3) return { phases, reordered: false };
  const next = phases.map((P, i) => { const A = step(P, rule, 2); let best = null; phases.forEach((Q, j) => { if (j === i) return; const s = bestShift(A, Q).s / Math.max(1, Q.w * Q.h); if (!best || s < best.s) best = { j, s }; }); return best.j; });
  const seen = new Set(); let i = 0; const order = [];
  while (!seen.has(i)){ seen.add(i); order.push(i); i = next[i]; }
  if (order.length !== N || i !== 0) return { phases, reordered: false };
  const same = order.every((v, k) => v === k);
  return { phases: order.map(k => phases[k]), reordered: !same, order };
}
function alignPhases(phases, rule){
  const pad = 2, pos = [{ x: 0, y: 0 }], quality = [];
  const N = phases.length;
  for (let i = 0; i < N; i++){
    const A = step(phases[i], rule, pad), B = phases[(i + 1) % N];
    const s = bestShift(A, B); quality.push(s.s / Math.max(1, B.w * B.h));
    pos.push({ x: pos[i].x + s.dx - pad, y: pos[i].y + s.dy - pad });
  }
  return { gens: phases.map((g, i) => ({ g, ox: pos[i].x, oy: pos[i].y })), DX: pos[N].x, DY: pos[N].y, quality };
}
/* Single generation: find period and displacement by simulation. */
function detectFromSingle(g0, rule, maxP){
  maxP = maxP || 30;
  const pad = maxP + 2;
  let cur = g0, gens = [{ g: g0, ox: 0, oy: 0 }], best = null;
  for (let p = 1; p <= maxP; p++){
    cur = step(cur, rule, 1);                      // origin shifts by 1 each step
    const ox = -p, oy = -p;
    gens.push({ g: cur, ox, oy });
    for (let dx = -p; dx <= p; dx++) for (let dy = -p; dy <= p; dy++){
      if (!dx && !dy) continue;
      // front rows matched: compare gen p shifted back by (dx,dy) against gen 0, scanning from the front side
      const score = frontMatch(g0, cur, ox - dx, oy - dy, dx, dy);
      if ((score.frac === 1 || (score.frac > 0.2 && score.rows >= 4)) && (!best || score.rows > best.rows + 1)) best = { p, dx, dy, rows: score.rows, frac: score.frac };
    }
    if (best && p >= best.p * 2 + 2) break;
  }
  if (!best) return null;
  return { gens: gens.slice(0, best.p), DX: best.dx, DY: best.dy, P: best.p, rows: best.rows };
}
function frontMatch(g0, gp, ox, oy, dx, dy){
  // gp cell (x,y) sits at lab (x+ox, y+oy); compare to g0 at lab coords. Scan lines perpendicular to motion from the front.
  const vertical = Math.abs(dy) >= Math.abs(dx);
  const at0 = (x, y) => gget(g0, x, y), atp = (x, y) => gget(gp, x - ox, y - oy);
  const L = vertical ? g0.h : g0.w, M = vertical ? g0.w : g0.h;
  let rows = 0;
  for (let k = 0; k < L; k++){
    const line = (vertical ? (dy < 0 ? k : g0.h - 1 - k) : (dx < 0 ? k : g0.w - 1 - k));
    let ok = true;
    for (let j = -2; j < M + 2 && ok; j++){
      const x = vertical ? j : line, y = vertical ? line : j;
      if (at0(x, y) !== atp(x, y)) ok = false;
    }
    if (!ok) break; rows++;
  }
  return { rows, frac: rows / L };
}

/* ---- lab frame ---- */
/* Build normalized lab frame: gens[t] = {rows: Map y-> Uint8Array(w) or null for unknown}, K, N, moving up. */
function buildLab(gens, DX, DY){
  if (DX === 0 && DY === 0) throw new Error("This partial has no displacement. This program is designed to cut spaceship partials, not oscillator partials.");
  // pick a symmetry of the square that makes the ship move up (VY<0), not right (VX<=0), mostly vertically (|VY|>=|VX|)
  const Ts = [
    [(x, y) => [x, y], "as given"], [(x, y) => [-x, y], "mirrored left-right"], [(x, y) => [x, -y], "flipped top-bottom"], [(x, y) => [-x, -y], "turned 180°"],
    [(x, y) => [y, x], "reflected across the diagonal"], [(x, y) => [-y, x], "turned 90°"], [(x, y) => [y, -x], "turned 90° the other way"], [(x, y) => [-y, -x], "reflected across the other diagonal"]];
  let T = null, tname = "";
  for (const [f, n] of Ts){ const [vx, vy] = f(DX, DY); if (vy < 0 && vx <= 0 && -vy >= -vx){ T = f; tname = n; break; } }
  const [VX, VY] = T(DX, DY);
  const K = -VY, KX = (-VX) || 0;
  const cells = gens.map(({ g, ox, oy }) => { const c = []; for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) if (g.a[y*g.w+x]) c.push(T(x + ox, y + oy)); return c; });
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  cells.flat().forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
  const w = x1 - x0 + 1, h = y1 - y0 + 1 + 2 * K + 4, top = 2 + K;
  const lab = cells.map(c => { const g = G(w, h); c.forEach(([x, y]) => { g.a[(y - y0 + top) * w + (x - x0)] = 1; }); return g; });
  return { lab, K, KX, N: gens.length, w, h, known: null, orient: tname, raw: { gens, DX, DY, T } };
}
function labFromXYT(p, rule){
  const N = p.secs.length, w = p.w, h = p.h;
  const lab = [], known = [];
  for (let t = 0; t < N; t++){ const g = G(w, h); const k = new Uint8Array(h); p.secs[t].forEach((s, y) => { if (s === null) return; k[y] = 1; for (let x = 0; x < w; x++) g.a[y*w+x] = s[x] === "*" ? 1 : 0; }); lab.push(g); known.push(k); }
  /* Detect the speed by the period wrap. Score each candidate by its error RATE, not its error count: a large K pushes
     the wrap off the grid so most checks are skipped, and the fewest errors then went to a guess that checked almost
     nothing (a c/5 grid once came out as K = 14, KX = 4, faster than light). Only candidates that keep most of the checks are compared,
     a log grid from a symmetric search is a half, so the folds at the axis are tried too, and ties go to the slower
     speed. */
  const cands = [];
  for (let K = 0; K <= N && K <= h; K++) for (let KX = 0; KX <= K; KX++) for (const mir of KX ? ["none"] : ["none", "odd", "even"]){   // nothing outruns light: K <= N
    const r = errors({ lab, known, N, K, KX, w, h }, rule, mir); cands.push({ K, KX, mir, e: r.list.length, n: r.checks });
  }
  const nMax = Math.max(...cands.map(c => c.n));
  const ok = cands.filter(c => c.n >= 0.7 * nMax);
  ok.sort((a, b) => (a.e / Math.max(1, a.n)) - (b.e / Math.max(1, b.n)) || (a.K + a.KX) - (b.K + b.KX));
  const best = ok[0];
  return { lab, known, N, K: best.K, KX: best.KX, w, h, orient: "as given", fit: { rate: best.e / Math.max(1, best.n), errors: best.e, checks: best.n, mirror: best.mir } };
}
/* A log grid doesn't record its rule. Given a speed and fold, read off the isotropic rule the grid itself follows: every
   (cell state, Hensel neighbourhood class) seen must always lead to the same child. Returns the rule string (classes
   never seen are left out, so it is the smallest rule consistent with the grid) or null if the grid contradicts every
   isotropic rule. */
function inferRule(L){
  const name = {}; for (const n in HENSEL) for (const l in HENSEL[n]) for (const m of HENSEL[n][l]) name[m] = [n, l];
  const v = valFn(L, L.fit ? L.fit.mirror : "none"), seen = new Map();
  const xs = L.fit && L.fit.mirror !== "none" ? 0 : -1;
  for (let t = 0; t < L.N; t++) for (let y = 0; y < L.h; y++) for (let x = xs; x <= L.w; x++){
    const ch = v(t + 1, y, x), me = v(t, y, x); if (ch === null || me === null) continue;
    const nb = [v(t,y-1,x-1),v(t,y-1,x),v(t,y-1,x+1),v(t,y,x-1),v(t,y,x+1),v(t,y+1,x-1),v(t,y+1,x),v(t,y+1,x+1)];
    if (nb.includes(null)) continue;
    const m = (nb[0]<<7)|(nb[1]<<6)|(nb[2]<<5)|(nb[3]<<4)|(nb[4]<<3)|(nb[5]<<2)|(nb[6]<<1)|nb[7];
    const k = me + ":" + name[m].join("");
    if (seen.has(k) && seen.get(k) !== ch) return null;
    seen.set(k, ch);
  }
  const part = me => { let out = ""; for (const n of Object.keys(HENSEL).sort()){ const all = Object.keys(HENSEL[n]); const on = all.filter(l => seen.get(me + ":" + n + l) === 1);
      if (!on.length) continue; out += n + (on.length === all.length || all.length === 1 && all[0] === "c" ? "" : on.sort((a, b) => "cekainyqjrtwz".indexOf(a) - "cekainyqjrtwz".indexOf(b)).join("")); } return out; };
  return "B" + part(0) + "/S" + part(1);
}
/* value with period wrap and optional mirror at x<0 */
function valFn(L, mirror){
  return (t, y, x) => {
    while (t >= L.N){ t -= L.N; y += L.K; x += (L.KX || 0); }
    // even: rlife puts the axis between columns 0 and 1, which are copies of each other (amling, page 22), so column -1
    // mirrors column 2. (This used to fold at the left of column 0, which misread every even half from a log.)
    if (mirror === "odd" && x < 0) x = -x; else if (mirror === "even" && x < 0) x = 1 - x;
    if (y < 0 || y >= L.h) return L.known ? null : 0;
    if (L.known && !L.known[t][y]) return null;
    if (x < 0 || x >= L.w) return 0;
    return L.lab[t].a[y * L.w + x];
  };
}
function errors(L, rule, mirror){
  const v = valFn(L, mirror), list = []; let checks = 0;
  const xs = mirror === "none" ? -1 : 0;
  for (let t = 0; t < L.N; t++) for (let y = 0; y < L.h; y++) for (let x = xs; x <= L.w; x++){
    const ch = v(t + 1, y, x), me = v(t, y, x); if (ch === null || me === null) continue;
    const nb = [v(t,y-1,x-1),v(t,y-1,x),v(t,y-1,x+1),v(t,y,x-1),v(t,y,x+1),v(t,y+1,x-1),v(t,y+1,x),v(t,y+1,x+1)];
    if (nb.includes(null)) continue;
    const m = (nb[0]<<7)|(nb[1]<<6)|(nb[2]<<5)|(nb[3]<<4)|(nb[4]<<3)|(nb[5]<<2)|(nb[6]<<1)|nb[7];
    const exp = me ? rule.S[m] : rule.B[m]; checks++;
    // the child's position, wrapped like valFn does (for ships that move sideways the wrap also shifts x by KX)
    if (exp !== ch){ let tt = t + 1, yy = y, xx = x; while (tt >= L.N){ tt -= L.N; yy += L.K; xx += (L.KX || 0); } list.push({ t: tt, y: yy, x: xx, W: L.N * yy + L.K * tt }); }
  }
  list.sort((a, b) => a.W - b.W);
  return { list, checks };
}
function symmetry(L, Wmax){
  // over cells with W <= Wmax
  const live = []; for (let t = 0; t < L.N; t++) for (let y = 0; y < L.h; y++){ if (L.N*y + L.K*t > Wmax) continue; if (L.known && !L.known[t][y]) continue; for (let x = 0; x < L.w; x++) if (L.lab[t].a[y*L.w+x]) live.push([t, y, x]); }
  if (!live.length) return { type: "none" };
  let lo = Infinity, hi = -Infinity; live.forEach(([, , x]) => { lo = Math.min(lo, x); hi = Math.max(hi, x); });
  const has = new Set(live.map(([t, y, x]) => t + ":" + y + ":" + x));
  const s2 = lo + hi;               // mirror x -> s2 - x
  const ok = live.every(([t, y, x]) => has.has(t + ":" + y + ":" + (s2 - x)));
  if (!ok) return { type: "none", lo, hi };
  return s2 % 2 === 0 ? { type: "odd", axis: s2 / 2, lo, hi } : { type: "even", axis: (s2 - 1) / 2, lo, hi };
}

/* ---- output ---- */
function gcd(a, b){ return b ? gcd(b, a % b) : a; }
/* Oblique ships (simple_vv / cNk-1): one LLSSS W row is  W = y + floor(K*t/N)  (a whole row in every generation),
   and columns are  U = x + floor(KX*t/N). Checked against rlife's own @yolo_1gp grid for c6k-1. */
function buildOblique(L, rule, opt){
  const N = L.N, K = L.K, KX = L.KX;
  const errs = opt._skipCheck ? [] : errors(L, rule, "none").list;
  const rowOf = (y, t) => y + Math.floor(K * t / N), sh = t => Math.floor(KX * t / N);
  const get = (t, y, x) => (y < 0 || y >= L.h || x < 0 || x >= L.w) ? 0 : L.lab[t].a[y * L.w + x];
  let top = Infinity, lastRow = -Infinity;
  for (let t = 0; t < N; t++) for (let y = 0; y < L.h; y++){ lastRow = Math.max(lastRow, rowOf(y, t)); for (let x = 0; x < L.w; x++) if (get(t, y, x)){ top = Math.min(top, rowOf(y, t)); break; } }
  const Werr = errs.length ? errs[0].W : Infinity;                 // fine W = N*y + K*t
  const safe = Werr === Infinity ? Infinity : Werr - (N + K) - 1;   // last fine W not involved in a failing check
  let keepR = safe === Infinity ? lastRow : Math.floor((safe + 1) / N) - 1;
  keepR -= (opt.backtrack | 0);
  /* Re-search a marked region: keep every row of the partial; question marks from the top of the region to the
     bottom, across the full width; a constraint file fixes every known cell inside them except those in the region.
     The region is a box in one generation's frame (t0, x0..x1, y0..y1), carried to the others as rows rowOf(y, t)
     and columns x + sh(t), so it covers the same part of the ship in every generation. Default: the box around
     every error. */
  const regionMode = opt.mode === "region";
  let reg = null;
  if (regionMode){
    keepR = lastRow;
    reg = markedBox(opt, errs, N, rowOf, (x, t) => x + sh(t));
    if (!reg) reg = { r0: Math.max(top + 2, lastRow - 2), r1: lastRow, u0: -Infinity, u1: Infinity, drawn: false, back: true };
    if (reg.r0 < top + 2) throw new Error("The marked region starts too close to the front of the partial; rlife needs a few known rows above it.");
    const outside = errs.filter(e => { const rr = rowOf(e.y, e.t), uu = e.x + sh(e.t); return rr < reg.r0 || rr > reg.r1 || uu < reg.u0 - KX || uu > reg.u1 + KX; });
    reg.outside = outside.length;
    if (outside.length) throw new Error(outside.length + " of the partial's " + errs.length + " errors lie outside the marked region (around line " + rowOf(outside[0].y, outside[0].t) + "). Mark them too, or the fixed cells will contradict each other.");
  }
  if (keepR < top + 1) throw new Error("The partial breaks almost immediately, around row " + Math.floor((Werr - top * N) / N) + ". Check your RLE again.");
  const aloneMode = opt.mode === "alone", tailMode = opt.mode === "tail" || aloneMode;
  let alone = null;
  if (aloneMode){
    alone = markedBox(opt, errs, N, rowOf, (x, t) => x + sh(t));
    if (!alone) throw new Error("This partial has no errors; mark the part to search alone.");
    if (alone.r0 < top + 2) throw new Error("The marked part starts too close to the front of the partial; rlife needs a few known rows above it.");
    keepR = alone.r0 - 1;
    const bad = errs.filter(e => { const rr = rowOf(e.y, e.t), uu = e.x + sh(e.t); return rr <= keepR && uu >= alone.u0 - 2 && uu <= alone.u1 + 2; });
    if (bad.length) throw new Error("There is an error above the marked part, in its columns (around line " + rowOf(bad[0].y, bad[0].t) + "). The search starts from the rows just above the part, so they must be valid: mark from higher up.");
  }
  if (tailMode && !aloneMode){ let lastLiveR = -Infinity; for (let t = 0; t < N; t++) for (let y = 0; y < L.h; y++){ const rw = rowOf(y, t); if (rw > keepR || rw <= lastLiveR) continue; for (let x = 0; x < L.w; x++) if (get(t, y, x)){ lastLiveR = rw; break; } } if (lastLiveR < keepR) keepR = lastLiveR; }
  const tRows = tailMode ? Math.max(4, (opt.tailRows | 0) || 8) : 0, r0 = tailMode ? Math.max(top, keepR - tRows + 1) : top;
  let Ulo = Infinity, Uhi = -Infinity, UloFull = Infinity, UhiFull = -Infinity;
  const ext = (ra, rb) => { let lo = Infinity, hi = -Infinity; for (let t = 0; t < N; t++) for (let y = 0; y < L.h; y++){ const rw = rowOf(y, t); if (rw < ra || rw > rb) continue; for (let x = 0; x < L.w; x++) if (get(t, y, x)){ lo = Math.min(lo, x + sh(t)); hi = Math.max(hi, x + sh(t)); } } return { lo, hi }; };
  { const a = ext(top, keepR); UloFull = a.lo; UhiFull = a.hi; const b = ext(r0, keepR); Ulo = b.lo; Uhi = b.hi; }
  if (aloneMode){
    Ulo = alone.u0; Uhi = alone.u1;
    // "alone" ignores the rest of the partial: warn if any of it lies within 3 cells of the marked part's columns,
    // from the rows the search starts from down to the bottom (then results can't be expected to fit the ship)
    let close = null;
    for (let t = 0; t < N && close === null; t++) for (let y = 0; y < L.h && close === null; y++){
      const rw = rowOf(y, t); if (rw < keepR - 3) continue;
      for (let x = 0; x < L.w; x++){ if (!get(t, y, x)) continue; const uu = x + sh(t);
        const inBox = rw >= alone.r0 && rw <= alone.r1 && uu >= alone.u0 && uu <= alone.u1;
        if (inBox) continue;
        if (uu >= alone.u0 - 3 && uu <= alone.u1 + 3 && !(rw <= keepR && uu >= alone.u0 && uu <= alone.u1)){ close = rw; break; } } }
    alone.close = close;
  }
  if (tailMode && !isFinite(Ulo)) throw new Error("There are no live cells in the last " + tRows + " lines.");
  let plan = null, tailDrift = 0;
  if (tailMode){
    const midR = r0 + Math.floor((keepR - r0) / 2), eL = ext(r0, midR), eR = ext(midR + 1, keepR);
    const dr = isFinite(eL.lo) && isFinite(eR.lo) ? ((eR.lo + eR.hi) - (eL.lo + eL.hi)) / 2 : 0; tailDrift = aloneMode ? 0 : Math.abs(dr) >= 1 ? Math.sign(dr) : 0;
    plan = tailPlan({ lo: Ulo, hi: Uhi }, tailDrift, opt); Ulo -= plan.roomL; Uhi += plan.roomR;
  }
  const pw = Uhi - Ulo + 1, extra = Math.max(0, opt.extra | 0);
  if (opt.mode === "branch") throw new Error("Branch mode needs a mirror-symmetric partial, and ships that move sideways can't be mirror-symmetric.");
  let width, left, roots = null, qFrom = null, qCols = null;
  if (tailMode){ width = plan.width; left = plan.left; roots = plan.roots || "u".repeat(width); qFrom = keepR + 1; qCols = [2, width - 3]; }
  else if (regionMode){ width = 3 + pw + 3; left = 3; roots = "LLL" + "u".repeat(pw) + "RRR"; qFrom = reg.r0; qCols = [2, width - 3]; }
  else if (opt.mode === "fixed"){ width = 2 + extra + pw + extra + 2; left = 2 + extra; qFrom = keepR + 1; qCols = [2, width - 3]; }   // extra columns on both sides
  else { width = 3 + pw + 3; left = 3; roots = "LLL" + "u".repeat(pw) + "RRR"; }
  const R0 = tailMode ? r0 : top - 2, lastR = regionMode ? keepR : qFrom !== null ? qFrom + 1 : keepR;
  const maxsh = sh(N - 1), totW = width + maxsh, U0 = Ulo - left;
  const map = new Map(), pmap = new Map(); let pinned = 0, freed = 0;
  const nearB = regionMode ? nearBody(L, (t, y, x) => { const rr = rowOf(y, t), uu = x + sh(t); return rr >= reg.r0 && rr <= reg.r1 && uu >= reg.u0 && uu <= reg.u1; }, opt.growOutside) : null;
  for (let r = R0 - (roots ? 1 : 0); r <= lastR; r++) for (let t = 0; t < N; t++){
    const y = r - Math.floor(K * t / N);
    let s = "", p = "";
    for (let c = 0; c < totW; c++){
      // text column c is x = c - maxsh + U0 for rlife; this generation's slice of the prism is U in [U0, U0+width)
      const i = c - maxsh + sh(t);
      if (i < 0 || i >= width){ s += " "; continue; }
      if (roots && r === R0 - 1){ s += roots[i]; if (regionMode) p += roots[i]; continue; }
      if (qFrom !== null && r >= qFrom){
        const inQ = i >= qCols[0] && i <= qCols[1];
        s += inQ ? "?" : ".";
        if (regionMode){
          const U = U0 + i;                                   // U = x + sh(t)
          // columns sharing a root letter (L at 0-2, R at the last 3) must be identical in the constraint file too
          // (rlife asserts this, src/llsss/wildcards.rs): fixed dead together where the inner one borders the
          // rest of the partial, otherwise all free. They are always empty in the partial.
          if (roots && (i < 3 || i >= width - 3)){
            const inner = i < 3 ? 2 : width - 3, Ui = U0 + inner;
            const inBoxI = r >= reg.r0 && r <= reg.r1 && Ui >= reg.u0 && Ui <= reg.u1;
            if (!inBoxI && nearB(t, y, Ui - sh(t))){ p += "."; pinned++; } else { p += "W"; freed++; }
            continue;
          }
          if (!inQ) p += "W";
          else if ((r >= reg.r0 && r <= reg.r1 && U >= reg.u0 && U <= reg.u1) || !nearB(t, y, U0 + i - sh(t))){ p += "W"; freed++; }
          else { p += get(t, y, U0 + i - sh(t)) ? "*" : "."; pinned++; }
        }
        continue;
      }
      // Back only / alone: cells outside the window (including the L and R root columns) are left empty. Columns that
      // share a root letter must be identical (rlife panics otherwise), and the rest of the partial is ignored anyway.
      if (tailMode && (i < left || i >= left + pw)){ s += "."; if (regionMode) p += "W"; continue; }
      s += get(t, y, U0 + i - sh(t)) ? "*" : ".";
      if (regionMode) p += "W";
    }
    map.set(y + ":" + t, s); if (regionMode) pmap.set(y + ":" + t, p);
  }
  const ys = [...map.keys()].map(k => +k.split(":")[0]), ymin = Math.min(...ys), ymax = Math.max(...ys);
  const xyt = [];
  for (let y = ymin; y <= ymax; y++){ const secs = []; for (let t = 0; t < N; t++) secs.push(map.get(y + ":" + t) || " ".repeat(totW)); xyt.push("| " + secs.join(" | ") + " |"); }
  let pre;
  if (regionMode){ const pl = []; for (let y = ymin; y <= ymax; y++){ const secs = []; for (let t = 0; t < N; t++) secs.push(pmap.get(y + ":" + t) || " ".repeat(totW)); pl.push("| " + secs.join(" | ") + " |"); } pre = pl.join("\n") + "\n"; }
  return {
    xyt: xyt.join("\n") + "\n", uwi: null, pre,
    info: { N, K, KX, g: N, geom: geomName(K, KX, N), orient: L.orient || "as given", Werr, keep: keepR * N, Wtop: top * N, sym: { type: "none" }, pw, width, errs: errs.length, qFrom, qCols, gap: null, rowsKept: keepR - r0 + 1,
            tail: tailMode ? Object.assign({ rows: tRows, driftDir: tailDrift, pwFull: UhiFull - UloFull + 1, alone: aloneMode }, plan) : null,
            alone: aloneMode ? { r0: alone.r0, r1: alone.r1, u0: alone.u0, u1: alone.u1, drawn: alone.drawn, close: alone.close, sh: Array.from({ length: N }, (_, t) => sh(t)), rowShift: Array.from({ length: N }, (_, t) => Math.floor(K * t / N)) } : null,
            region: regionMode ? { r0: reg.r0, r1: reg.r1, u0: Math.max(reg.u0, U0 + 2), u1: Math.min(reg.u1, U0 + width - 3), drawn: reg.drawn, back: !!reg.back, pinned, freed, errs: errs.length, top, lastRow, sh: Array.from({ length: N }, (_, t) => sh(t)), rowShift: Array.from({ length: N }, (_, t) => Math.floor(K * t / N)) } : null }
  };
}

/* ---------- general lattice engine: a port of rlife's parse_name2 + LatGeom0 (src/lat/geom.rs) ---------- */
function egcdR(a, b, ra, rb){
  ra = ra.slice(); rb = rb.slice();
  if (a < 0){ a = -a; ra = ra.map(v => -v); }
  if (b < 0){ b = -b; rb = rb.map(v => -v); }
  while (a > 0){ const q = Math.floor(b / a); b -= q * a; rb = rb.map((v, i) => v - q * ra[i]); [a, b] = [b, a]; [ra, rb] = [rb, ra]; }
  return [b, ra, rb];
}
function geomVecs(name){
  let m;
  const V = (a, b) => [a ? +a : 1, +b];
  const pickVertW = (vn, vt) => { const [, , [wt, wn]] = egcdR(vn, vt, [1, 0], [0, 1]); return [wn, wt]; };
  if ((m = /^(\d*)c(\d+)-f2b$/.exec(name))){ const [vn, vt] = V(m[1], m[2]); const [wy, wt] = pickVertW(vn, vt); return [[1,0,0],[0,-vn,vt],[0,wy,wt]]; }
  if ((m = /^(\d*)c(\d+)-b2f$/.exec(name))){ const [vn, vt] = V(m[1], m[2]); const [wy, wt] = pickVertW(vn, vt); return [[1,0,0],[0,vn,vt],[0,wy,-wt]]; }
  if ((m = /^(\d*)c(\d+)-s2s$/.exec(name))){ const [vn, vt] = V(m[1], m[2]); return [[1,0,0],[-vn,0,vt],[0,1,0]]; }
  if ((m = /^(\d*)c(\d+)d-f2b$/.exec(name))){ const [vn, vt] = V(m[1], m[2]); const [wn, wt] = pickVertW(vn, vt); return [[1,-1,0],[-vn,-vn,vt],[wn,wn,wt]]; }
  if ((m = /^(\d*)c(\d+)k-1$/.exec(name))){ const [vn, vt] = V(m[1], m[2]); return [[1,0,0],[-vn,-2*vn,vt],[0,1,0]]; }
  if ((m = /^simple_vv:(-?\d+):(-?\d+):(-?\d+)$/.exec(name))) return [[1,0,0],[+m[1],+m[2],+m[3]],[0,1,0]];
  throw new Error("Unknown geometry " + name);
}
function lattice(name){
  const [[ux,uy,ut],[vx,vy,vt],[wx,wy,wt]] = geomVecs(name);
  const det = ux*(vy*wt - wy*vt) - uy*(vx*wt - wx*vt) + ut*(vx*wy - wx*vy);
  const sd = det > 0 ? 1 : -1, a = det * sd;
  const rx = [vy*wt - wy*vt, wy*ut - uy*wt, uy*vt - vy*ut].map(v => v * sd);
  const ry = [wx*vt - vx*wt, ux*wt - wx*ut, vx*ut - ux*vt].map(v => v * sd);
  const rt = [vx*wy - wx*vy, wx*uy - ux*wy, ux*vy - vx*uy].map(v => v * sd);
  const uvw = (x, y, t) => [0, 1, 2].map(i => rx[i]*x + ry[i]*y + rt[i]*t);
  const fdiv = (p, q) => Math.floor(p / q), mod = (p, q) => ((p % q) + q) % q;
  const tile = (x, y, t) => { const [u, v, w] = uvw(x, y, t); return [fdiv(u, a), fdiv(w, a), mod(u, a) + "," + mod(v, a) + "," + mod(w, a)]; };
  // rlife's nh_w_size: W span of the 3x3 neighbourhood plus its child, in tiles
  const ws = [[-1,-1,0],[0,-1,0],[1,-1,0],[-1,0,0],[0,0,0],[1,0,0],[-1,1,0],[0,1,0],[1,1,0],[0,0,1]].map(([x, y, t]) => uvw(x, y, t)[2]);
  const nhW = Math.floor((Math.max(...ws) - Math.min(...ws) + 2 * a - 1) / a);
  return { name, V: [vx, vy, vt], adet: a, tile, nhW, uvw };
}
const D4 = [
  [(x, y) => [x, y], "as given"], [(x, y) => [-x, y], "mirrored left-right"], [(x, y) => [x, -y], "flipped top-bottom"], [(x, y) => [-x, -y], "turned 180°"],
  [(x, y) => [y, x], "reflected across the diagonal"], [(x, y) => [-y, x], "turned 90°"], [(x, y) => [y, -x], "turned 90° the other way"], [(x, y) => [-y, -x], "reflected across the other diagonal"]];

/* Which side of the partial breaks the rule? Returns "back", "front", "left", "right" (in the moving-up frame) or null. */
function tornSide(L, rule){
  const errs = errors(L, rule, "none").list; if (!errs.length) return { side: null, errs: 0 };
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let t = 0; t < L.N; t++) for (let y = 0; y < L.h; y++) for (let x = 0; x < L.w; x++) if (L.lab[t].a[y*L.w+x]){ x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const W = Math.max(1, x1 - x0), H = Math.max(1, y1 - y0);
  const votes = { front: 0, back: 0, left: 0, right: 0 };
  for (const e of errs){ const d = { front: (e.y - y0) / H, back: (y1 - e.y) / H, left: (e.x - x0) / W, right: (x1 - e.x) / W }; const k = Object.keys(d).reduce((p, q) => d[q] < d[p] ? q : p); votes[k]++; }
  const side = Object.keys(votes).reduce((p, q) => votes[q] > votes[p] ? q : p);
  const both = votes.left > 0.3 * errs.length && votes.right > 0.3 * errs.length;
  return { side, votes, both, errs: errs.length };
}
function orderFor(side){ return side === "front" ? "b2f" : (side === "left" || side === "right") ? "s2s" : "f2b"; }

/* Build a start file for any geometry the lattice engine knows, from the raw aligned generations. */
function orientGeneric(L, geomName0, side){
  if (!L.raw) throw new Error("This search order does not support grid logs; provide an RLE instead.");
  const lat = lattice(geomName0), [VX, VY, N] = lat.V;
  const { gens, DX, DY, T: T0 } = L.raw;
  // direction (in raw coords) of the torn side, found in the moving-up frame
  const stdDir = { back: [0, 1], front: [0, -1], left: [-1, 0], right: [1, 0] }[side || "back"];
  const rawDir = [[0,1],[0,-1],[1,0],[-1,0]].find(([a, b]) => { const [p, q] = T0(a, b); return p === stdDir[0] && q === stdDir[1]; });
  let T = null, tname = "";
  for (const [f, n] of D4){ const [a, b] = f(DX, DY); const [p, q] = f(rawDir[0], rawDir[1]); if (a === VX && b === VY && (lat.name.includes("s2s") ? (p === 0 && q === 1) : true)){ T = f; tname = n; break; } }
  if (!T) throw new Error("This ship's motion (" + DX + "," + DY + ") doesn't fit " + geomName0 + ".");
  // live cells per generation in the new frame
  const live = gens.map(({ g, ox, oy }) => { const s = new Set(); for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) if (g.a[y*g.w+x]){ const [p, q] = T(x + ox, y + oy); s.add(p + "," + q); } return s; });
  let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
  live.forEach(s => s.forEach(k => { const [x, y] = k.split(",").map(Number); bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); }));
  const val = (t, x, y) => { while (t >= N){ t -= N; x -= VX; y -= VY; } return live[t].has(x + "," + y) ? 1 : 0; };
  return { lat, VX, VY, N, live, bx0, bx1, by0, by1, val, T, tname };
}
function firstBreakLw(o, rule){
  const { lat, VX, VY, N, bx0, bx1, by0, by1, val } = o;
  let errLw = Infinity, nErr = 0;
  const M = Math.abs(VX) + Math.abs(VY) + 3;
  for (let t = 0; t < N; t++) for (let y = by0 - M; y <= by1 + M; y++) for (let x = bx0 - M; x <= bx1 + M; x++){
    const m = (val(t,x-1,y-1)<<7)|(val(t,x,y-1)<<6)|(val(t,x+1,y-1)<<5)|(val(t,x-1,y)<<4)|(val(t,x+1,y)<<3)|(val(t,x-1,y+1)<<2)|(val(t,x,y+1)<<1)|val(t,x+1,y+1);
    const exp = val(t, x, y) ? rule.S[m] : rule.B[m];
    if (exp !== val(t + 1, x, y)){ let tt = t + 1, xx = x, yy = y; if (tt >= N){ tt -= N; xx -= VX; yy -= VY; } errLw = Math.min(errLw, lat.tile(xx, yy, tt)[1]); nErr++; }
  }
  return { errLw, nErr };
}
/* Diagonal ships are often symmetric across their own line of travel. In the frame orientGeneric uses, that is the
   mirror (x, y) -> (y + c, x - c) for some integer c; it maps every generation to itself and keeps each cell's W row.
   rlife's reflect edge (src/llsss/edge.rs) mirrors a diagonal geometry across exactly this plane. Measured in steps of
   x - y, its left window is the first two tile columns of the board (each holds two cells, x - y even and odd), and the
   odd edge puts the axis one step in from the outer edge: on the cells with x - y = 2*lu0 + 1, the second cell of the
   first tile column, whose first cell is the mirror copy of the cell on the far side. The even edge would put the axis
   half way between cells, which no diagonal mirror does, so only odd applies. Returns c, or null. */
function diagonalMirror(live, lat, maxLw){
  let lo = Infinity, hi = -Infinity, n = 0;
  live.forEach((s, t) => s.forEach(k => { const [x, y] = k.split(",").map(Number); if (lat.tile(x, y, t)[1] > maxLw) return; lo = Math.min(lo, x - y); hi = Math.max(hi, x - y); n++; }));
  if (!n) return null;
  for (let c2 = 2 * lo; c2 <= 2 * hi; c2++){            // axis x - y = c (only whole c maps cells to cells)
    if (c2 % 2) continue; const c = c2 / 2; let ok = true;
    for (let t = 0; t < live.length && ok; t++) for (const k of live[t]){
      const [x, y] = k.split(",").map(Number); if (lat.tile(x, y, t)[1] > maxLw) continue;
      if (!live[t].has((y + c) + "," + (x - c))){ ok = false; break; }
    }
    if (ok) return c;
  }
  return null;
}
function buildGeneric(L, rule, opt, geomName0, side, shiftX){
  let o = orientGeneric(L, geomName0, side);
  let { lat, VX, VY, N, live, bx0, bx1, by0, by1, val, tname } = o;
  if (shiftX){   // move the whole pattern right (used to put a diagonal mirror axis on odd x - y), before anything is measured
    live = live.map(s => new Set([...s].map(k => { const [x, y] = k.split(",").map(Number); return (x + shiftX) + "," + y; })));
    bx0 += shiftX; bx1 += shiftX;
    val = (t, x, y) => { while (t >= N){ t -= N; x -= VX; y -= VY; } return live[t].has(x + "," + y) ? 1 : 0; };
  }
  // rule check with period wrap; record the W tile of every failing child cell
  let errLw = Infinity, nErr = 0;
  const M = Math.abs(VX) + Math.abs(VY) + 3;
  if (!opt._skipCheck) for (let t = 0; t < N; t++) for (let y = by0 - M; y <= by1 + M; y++) for (let x = bx0 - M; x <= bx1 + M; x++){
    const m = (val(t,x-1,y-1)<<7)|(val(t,x,y-1)<<6)|(val(t,x+1,y-1)<<5)|(val(t,x-1,y)<<4)|(val(t,x+1,y)<<3)|(val(t,x-1,y+1)<<2)|(val(t,x,y+1)<<1)|val(t,x+1,y+1);
    const exp = val(t, x, y) ? rule.S[m] : rule.B[m];
    if (exp !== val(t + 1, x, y)){ let tt = t + 1, xx = x, yy = y; if (tt >= N){ tt -= N; xx -= VX; yy -= VY; } errLw = Math.min(errLw, lat.tile(xx, yy, tt)[1]); nErr++; }
  }
  let top = Infinity, bottom = -Infinity;
  live.forEach((s, t) => s.forEach(k => { const [x, y] = k.split(",").map(Number); const lw = lat.tile(x, y, t)[1]; top = Math.min(top, lw); bottom = Math.max(bottom, lw); }));
  let keep = errLw === Infinity ? bottom : errLw - lat.nhW;
  keep -= (opt.backtrack | 0);
  if (keep < top + 1) throw new Error("The partial breaks almost immediately in this search order. Try a different one (and check your RLE).");
  let U0 = Infinity, U1 = -Infinity;
  live.forEach((s, t) => s.forEach(k => { const [x, y] = k.split(",").map(Number); const [lu, lw] = lat.tile(x, y, t); if (lw <= keep){ U0 = Math.min(U0, lu); U1 = Math.max(U1, lu); } }));
  void bx0;
  // symmetric diagonal ship: search one half with --left-edge odd (recentering only)
  let symC = null;
  if (opt.mode === "rc" && VX === VY && VX !== 0 && opt.symmetry !== "none" && (opt.inputHalf || "none") === "none"){
    symC = diagonalMirror(live, lat, keep);
    // the axis must be on the odd cells of a tile column: start again with the whole pattern one cell right (x - y goes up by 1)
    if (symC !== null && ((symC % 2) + 2) % 2 === 0) return buildGeneric(L, rule, opt, geomName0, side, (shiftX || 0) + 1);
  }
  const lu0 = symC !== null ? (symC - 1) / 2 : null;     // tile column holding the axis: its cells are x - y = c - 1 (mirror copy) and c (axis)
  const pw = (symC !== null ? U1 - lu0 : U1 - U0) + 1, extra = Math.max(0, opt.extra | 0);
  let uLo, uHi, roots = false, qFrom = null, qLo, qHi;
  if (opt.mode === "fixed"){ uLo = U0 - extra - 2; uHi = U1 + extra + 2; qFrom = keep + 1; qLo = uLo + 2; qHi = uHi - 2; }   // extra columns on both sides
  else if (opt.mode === "rc" && symC !== null){ uLo = lu0; uHi = U1 + 3; roots = true; }   // u roots up to the axis (amling: fixed-like beside a symmetry edge)
  else if (opt.mode === "rc"){ uLo = U0 - 3; uHi = U1 + 3; roots = true; }
  else throw new Error("Branch mode is only available in f2b mode.");
  const wLo = top - lat.nhW - (roots ? 1 : 0), wHi = qFrom !== null ? keep + Math.max(2, lat.nhW - 1) : keep;
  // collect every cell (t in [0,N)) whose tile falls in the rectangle; rlife places text column = x, row = y
  const cells = []; const P = lat.nhW + extra + N + 8;
  for (let t = 0; t < N; t++) for (let y = by0 - P - 4 * N; y <= by1 + P + 4 * N; y++) for (let x = bx0 - P - 4 * N; x <= bx1 + P + 4 * N; x++){
    const [lu, lw] = lat.tile(x, y, t);
    if (lu < uLo || lu > uHi || lw < wLo || lw > wHi) continue;
    let ch;
    if (roots && lw === wLo) ch = symC !== null ? (lu > U1 ? "R" : "u") : (lu < U0 ? "L" : lu > U1 ? "R" : "u");
    else if (qFrom !== null && lw >= qFrom) ch = (lu >= qLo && lu <= qHi) ? "?" : ".";
    else ch = live[t].has(x + "," + y) ? "*" : ".";
    cells.push([t, x, y, ch]);
  }
  const xs = cells.map(c => c[1]), ys = cells.map(c => c[2]);
  let cx0 = Math.min(...xs), cy0 = Math.min(...ys); const cx1 = Math.max(...xs), cy1 = Math.max(...ys);
  /* rlife works out tiles from the chart's own coordinates (line = y, column = x, generation = t, each from 0), so the
     chart's origin must be a whole number of tiles from the coordinates the tiles were chosen in. Otherwise a geometry
     whose tiles hold several cells (diagonals hold 2) sees them split, and the file is not a complete UVW prism. Move
     the origin up and left, as little as possible, to the nearest point whose U and W coordinates are multiples of the tile
     size (a shift in V only relabels the cells inside each tile); any extra lines and columns are blank. */
  { const a = lat.adet, m = c => ((c % a) + a) % a, ok = (x, y) => { const [u, , w] = lat.uvw(x, y, 0); return m(u) === 0 && m(w) === 0; }; let best = null;   // V only relabels cells within a tile
    for (let dy = 0; dy < 2 * a + 2 && !best; dy++) for (let dx = 0; dx < 2 * a + 2; dx++) if (ok(cx0 - dx, cy0 - dy)){ best = [cx0 - dx, cy0 - dy]; break; }
    if (!best) throw new Error("Couldn't line the chart up with the tiles of " + lat.name + ".");
    [cx0, cy0] = best; }
  const cw = cx1 - cx0 + 1;
  const grid = []; for (let y = cy0; y <= cy1; y++){ const row = []; for (let t = 0; t < N; t++) row.push(Array(cw).fill(" ")); grid.push(row); }
  cells.forEach(([t, x, y, ch]) => { grid[y - cy0][t][x - cx0] = ch; });
  const xyt = grid.map(r => "| " + r.map(a => a.join("")).join(" | ") + " |").join("\n") + "\n";
  return { xyt, uwi: null, info: { keep, cutLat: { lat, live }, N, K: Math.abs(VY) || Math.abs(VX), KX: (VX && VY) ? Math.abs(VX) : 0, g: 1, errRow: errLw === Infinity ? null : errLw - top, geom: geomName0, orient: tname, Werr: errLw === Infinity ? Infinity : errLw * lat.adet, keep, Wtop: top, sym: symC !== null ? { type: "odd", diag: true, c: symC } : { type: "none" }, pw, width: cw, errs: nErr, qFrom, gap: null, rowsKept: keep - top + 1, generic: true, nhW: lat.nhW, order: geomName0.includes("s2s") ? "s2s" : geomName0.includes("b2f") ? "b2f" : "f2b" } };
}
function build(L, rule, opt){
  if (opt.mode === "line") return buildLine(L, rule, opt);
  if (opt.mode === "axis") return buildAxisConstraint(L, rule, opt);
  if (opt.mode === "branch" && !opt._raw){
    const o = build(L, rule, Object.assign({}, opt, { _raw: true }));
    if (wantConstraint(opt)) addGapConstraint(o, gapWidth(o.info.sym));
    return o;
  }
  const order = opt.order || "f2b";
  if (opt.mode === "alone" && (order !== "f2b" || (L.KX && L.KX === L.K))) throw new Error("Searching a marked part alone is built for f2b orthogonal and knightwise ships, not diagonal ones yet.");
  if (opt.mode === "tail" && (order !== "f2b" || (L.KX && L.KX === L.K))) throw new Error("Back-only mode is only built for f2b orthogonal and knightwise ships; sorry, dronebetter, but you don't get 2c/7d that easily.");
  if (order === "s2s" || order === "b2f"){
    if (L.KX) throw new Error("s2s and b2f files are only built for orthogonal ships here.");
    const side = opt.side || (order === "s2s" ? "left" : "front");
    return buildGeneric(L, rule, opt, (L.K === 1 ? "" : L.K) + "c" + L.N + "-" + order, side);
  }
  // the diagonal and knightwise writers only build these; refuse the rest instead of quietly writing a recentering file
  if (L.KX && !(opt.mode === "rc" || opt.mode === "fixed" || opt.mode === "region" || ((opt.mode === "tail" || opt.mode === "alone") && L.KX !== L.K)))
    throw new Error((L.KX === L.K ? "Diagonal" : "Knightwise") + " partials can only be extended (recentering, fixed width" + (L.KX !== L.K ? " or back only" : "") + "); this mode is only built for orthogonal ships.");
  if (opt.mode === "region"){
    if (L.KX && L.KX === L.K) throw new Error("Re-searching a marked region is built for orthogonal and knightwise ships, not diagonal ones yet.");
    if (order !== "f2b") throw new Error("Re-searching a marked region is only available f2b.");
    if ((opt.inputHalf || L.half || "none") !== "none") throw new Error("Re-searching a marked region needs the partial at full width, not a half cut at the axis. Set Symmetry to \"Ignore symmetry\" to unfold it.");
    return L.KX ? buildOblique(L, rule, opt) : buildRegionOrtho(L, rule, opt);
  }
  if (L.KX && L.KX === L.K) return buildGeneric(L, rule, opt, (L.K === 1 ? "" : L.K) + "c" + L.N + "d-f2b", "back");
  if (L.KX) return buildOblique(L, rule, opt);
  const N = L.N, K = L.K;
  const half = opt.inputHalf || L.half || "none";
  const errs = opt._skipCheck ? [] : errors(L, rule, half).list;
  const Wf = []; // front W per gen
  for (let t = 0; t < N; t++){ for (let y = 0; y < L.h; y++){ if (L.known && !L.known[t][y]) continue; let any = false; for (let x = 0; x < L.w; x++) if (L.lab[t].a[y*L.w+x]){ any = true; break; } if (any){ Wf.push(N*y + K*t); break; } } }
  const Wtop = Math.min(...Wf);
  const Werr = errs.length ? errs[0].W : Infinity;
  const g = gcd(N, K) || N;                               // W values N*y+K*t are all multiples of g; one LLSSS W row = g here
  const span = N + K;                                     // parents of a W-row child lie within [W-span, W+N-K]
  let keep = Werr === Infinity ? maxKnownW(L) : Werr - span - 1;
  if (opt.backtrack) keep -= opt.backtrack * g;
  keep -= ((keep % g) + g) % g;
  if (keep < Wtop + N && opt.mode !== "alone") throw new Error("The partial breaks almost immediately (first error at W=" + Werr + "). Check the RLE.");
  const aloneMode = opt.mode === "alone", tailMode = opt.mode === "tail" || aloneMode;
  let Wfirst = null, tailInfo = null, alone = null;
  if (aloneMode){
    if (half !== "none") throw new Error("Searching a marked part alone needs the partial at full width, not a half cut at the axis. Set Symmetry to \"Ignore symmetry\" to unfold it.");
    const rowOfO = (y, t) => y + Math.floor(K * t / N);
    alone = markedBox(opt, errs, N, rowOfO, x => x);
    if (!alone) throw new Error("This partial has no errors; mark the part to search alone.");
    if (alone.r0 < Math.floor(Wtop / N) + 2) throw new Error("The marked part starts too close to the front of the partial; rlife needs a few known rows above it.");
    keep = N * alone.r0 - g; keep -= ((keep % g) + g) % g;
    const bad = errs.filter(e => e.W <= keep && e.x >= alone.u0 - 2 && e.x <= alone.u1 + 2);   // errors located in the rows the search starts from
    if (bad.length) throw new Error("There is an error above the marked part, in its columns (around line " + rowOfO(bad[0].y, bad[0].t) + "). The search starts from the rows just above the part, so they must be valid: mark from higher up.");
    const rows = Math.max(4, (opt.tailRows | 0) || 8);
    Wfirst = Math.max(Wtop, keep - rows * N + g);
    tailInfo = { rows, ext: { lo: alone.u0, hi: alone.u1 }, driftDir: 0 };
    let close = null;
    for (let t = 0; t < N && close === null; t++) for (let y = 0; y < L.h && close === null; y++){
      const Wv = N * y + K * t, rw = rowOfO(y, t); if (Wv < keep - 3 * N) continue;
      for (let x = 0; x < L.w; x++){ if (!L.lab[t].a[y * L.w + x]) continue;
        const inBox = rw >= alone.r0 && rw <= alone.r1 && x >= alone.u0 && x <= alone.u1;
        if (inBox) continue;
        if (x >= alone.u0 - 3 && x <= alone.u1 + 3 && !(Wv <= keep && x >= alone.u0 && x <= alone.u1)){ close = rw; break; } } }
    alone.close = close;
  }
  if (tailMode && !aloneMode){
    // a partial that ends in empty rows: step back to the last row that has a live cell
    let lastLive = -Infinity; for (let t = 0; t < N; t++) for (let y = 0; y < L.h; y++){ const Wv = N*y + K*t; if (Wv > keep || Wv <= lastLive) continue; if (L.known && !L.known[t][y]) continue; for (let x = 0; x < L.w; x++) if (L.lab[t].a[y*L.w+x]){ lastLive = Wv; break; } }
    if (lastLive < keep) keep = lastLive - (((lastLive % g) + g) % g);
    const rows = Math.max(4, (opt.tailRows | 0) || 8);
    Wfirst = Math.max(Wtop, keep - rows * N + g);
    const e1 = extentsX(L, keep, Wfirst);
    if (!isFinite(e1.lo)) throw new Error("There are no live cells in the last " + rows + " lines.");
    const mid = Wfirst + Math.floor((keep - Wfirst) / 2), eL = extentsX(L, mid, Wfirst), eR = extentsX(L, keep, mid + g);
    const dr = isFinite(eL.lo) && isFinite(eR.lo) ? ((eR.lo + eR.hi) - (eL.lo + eL.hi)) / 2 : 0;
    tailInfo = { rows, ext: e1, driftDir: Math.abs(dr) >= 1 ? Math.sign(dr) : 0 };
  }
  // symmetry
  let sym = half !== "none" ? { type: half, axis: 0, lo: 0 } : symmetry(L, keep);
  // Back only keeps a mirror edge: the window then starts at the axis (as in recentering) and rlife reflects there.
  // Without one, a symmetric tail is searched as an asymmetric pattern and a half from a log can't be used at all.
  if (aloneMode || (tailMode && sym.type !== "odd" && sym.type !== "even")) sym = { type: "none", lo: sym.lo };
  const KX = L.KX || 0;
  if (opt.mode === "fixed" && half !== "none") throw new Error("This grid is already a half cut at the axis, and the cutter can't make a symmetric fixed-board file yet (amling's way uses !! markers and a symmetry edge). Use recentering for half grids.");
  let fullWidthNote = false;
  if (opt.mode === "fixed" && (sym.type === "odd" || sym.type === "even") && half === "none"){ sym = { type: "none", lo: sym.lo }; fullWidthNote = true; }
  if (opt.symmetry === "none" || KX) sym = { type: "none", lo: sym.lo };
  // column mapping: half starts at axis (odd) / axis (even: duplicate column first); asym keeps full width
  const cols = [];
  const ex = extentsX(L, keep);
  const tailSym = tailMode && !aloneMode && sym.type !== "none" && opt.symmetry !== "none" && !KX;
  if (tailSym){ tailInfo.ext = { lo: sym.axis, hi: Math.max(tailInfo.ext.hi, sym.axis + 1) }; tailInfo.driftDir = 0; }
  const plan = tailMode ? tailPlan(tailInfo.ext, tailInfo.driftDir, opt, tailSym) : null;
  if (tailSym) for (let x = sym.axis; x <= tailInfo.ext.hi + plan.roomR; x++) cols.push(x);
  else if (tailMode) for (let x = tailInfo.ext.lo - plan.roomL; x <= tailInfo.ext.hi + plan.roomR; x++) cols.push(x);
  else if (sym.type === "odd") for (let x = sym.axis; x <= ex.hi; x++) cols.push(x);
  else if (sym.type === "even") for (let x = sym.axis; x <= ex.hi; x++) cols.push(x);
  else for (let x = ex.lo; x <= ex.hi; x++) cols.push(x);
  const pw = cols.length, symEdge = sym.type !== "none";
  const mode = opt.mode, extra = Math.max(0, opt.extra | 0);
  const qrows = 2 * N;
  const Wlo = tailMode ? Wfirst : Wtop - 2 * N;          // two physical rows of padding above the front (none for a tail: the ? box makes it a picture)
  // enumerate (y,t) for W rows
  const rowsFor = Wv => { const out = []; for (let t = 0; t < N; t++){ const r = Wv - K * t; if (r % N === 0) out.push({ t, y: r / N }); } return out; };
  const get = (t, y, x) => (y < 0 || y >= L.h || x < 0 || x >= L.w) ? 0 : L.lab[t].a[y*L.w+x];
  let width, left = 0, qFrom = null, qCols = null, roots = null, cutW = keep, notes = [], gapInfo = null, outerInfo = null;
  if (mode === "tail" || mode === "alone"){
    width = plan.width; left = plan.left; roots = plan.roots || "u".repeat(width);
    qFrom = keep + g; qCols = [2, width - 3]; cutW = keep;
  } else if (mode === "fixed"){
    // extra columns go on both sides unless the left edge is the axis (a full-width ship can widen either way)
    width = (symEdge ? 0 : 2 + extra) + pw + extra + 2; left = symEdge ? 0 : 2 + extra;
    qFrom = keep + g; qCols = [symEdge ? 0 : 2, width - 3];
  } else if (mode === "rc"){
    width = (symEdge ? 0 : 3) + pw + 3; left = symEdge ? 0 : 3;   // recentering grows sideways by itself; extra columns aren't needed
    roots = (symEdge ? "" : "LLL") + "u".repeat(pw) + "RRR";
  } else if (mode === "outer"){
    if (sym.type !== "odd" && sym.type !== "even") throw new Error("Fuzzy-left-edge mode only works on symmetric partials: it keeps the branch next to the axis as it is and searches the one further out.");
    // occupancy of half columns over the last two physical rows before the cut
    const occ = new Array(pw).fill(0);
    for (let Wv = keep - 2 * N + 1; Wv <= keep; Wv++) for (const { t, y } of rowsFor(Wv)) for (let i = 0; i < pw; i++) if (get(t, y, cols[i])) occ[i] = 1;
    let gapEnd = -1;
    for (let i = pw - 1, run = 0; i >= 0; i--){ if (!occ[i]) run++; else { if (run >= 2 && occ.slice(0, i + 1).some(v => v) && occ.slice(i + run + 1).some(v => v)){ gapEnd = i + run; break; } run = 0; } }
    if (gapEnd < 0) throw new Error("You're using multi-branch mode on a single branch: near the cut there is only one branch, not two separated by at least 2 empty columns.");
    const c1 = gapEnd + 1;                       // first column of the outer piece
    // the inner piece is carried as-is, so it must not break the rule anywhere we keep it
    const qs = Math.max(2, c1 - 1);
    // only the sibling columns (left of the ? block) in the rows we write are carried unchanged
    const innerBreaks = errs.filter(e => { const hx = cols.indexOf(e.x); return hx >= 0 && hx < qs && e.W <= keep + qrows; }).length;
    if (innerBreaks) throw new Error("The sibling branch isn't complete, go fix it using recentering or fixed-width.");
    width = pw + extra + 3; left = 0;
    roots = "u".repeat(pw + extra) + "RRR";
    qFrom = cutW + g; qCols = [qs, pw + extra];
    outerInfo = { c1, qs, leftPad: qs - 2, sibling: true };
  } else if (mode === "branch"){
    if (KX) throw new Error("Branch mode needs a mirror-symmetric partial, and ships that move sideways can't be mirror-symmetric.");
    if (sym.type !== "odd" && sym.type !== "even") throw new Error("Branch mode needs a symmetric partial.");
    gapInfo = findGap(L, cols, Wtop, keep, sym);
    if (!gapInfo) throw new Error("No stretch where the " + (gapWidth(sym) === 1 ? "column" : "two columns") + " next to the axis stay empty. Why are you trying to hold it open? Use recentering.");
    cutW = gapInfo.cut - g;
    width = pw + extra + 3; left = 0;
    roots = "u".repeat(pw + extra) + "RRR";
    qFrom = cutW + g; qCols = [gapWidth(sym), pw + extra];
  }
  const lastW = qFrom !== null ? qFrom + qrows - g : cutW;
  const uwi = [];
  const lines = []; // UWI rows by W
  for (let Wv = Wlo - (roots ? g : 0); Wv <= lastW; Wv += g){
    let s = "";
    if (roots && Wv === Wlo - g) s = roots;
    else for (let i = 0; i < width; i++){
      const ci = i - left;
      if (qFrom !== null && Wv >= qFrom && i >= qCols[0] && i <= qCols[1]) { s += "?"; continue; }
      if (qFrom !== null && Wv >= qFrom && !(outerInfo && i < qCols[0])){ s += "."; continue; }
      const rs = rowsFor(Wv); const r0 = rs[0];
      s += (ci >= 0 && ci < pw && r0 && get(r0.t, r0.y, cols[ci])) ? "*" : ".";
    }
    lines.push({ W: Wv, s });
  }
  // XYT
  const Ws = lines.map(l => l.W), map = new Map();
  lines.forEach(l => { rowsFor(l.W).forEach(({ t, y }) => {
    let s = l.s;
    if (!(roots && l.W === Wlo - g) && !(qFrom !== null && l.W >= qFrom)){
      s = ""; for (let i = 0; i < width; i++){ const ci = i - left; s += (ci >= 0 && ci < pw && get(t, y, cols[ci])) ? "*" : "."; }
    } else if (outerInfo && qFrom !== null && l.W >= qFrom){
      s = ""; for (let i = 0; i < width; i++){ if (i >= qCols[0] && i <= qCols[1]) s += "?"; else if (i < qCols[0]) s += (i < pw && get(t, y, cols[i])) ? "*" : "."; else s += "."; }
    }
    map.set(y + ":" + t, s);
  }); });
  const ys = [...map.keys()].map(k => +k.split(":")[0]);
  const ymin = Math.min(...ys), ymax = Math.max(...ys);
  const xyt = [];
  for (let y = ymin; y <= ymax; y++){ const secs = []; for (let t = 0; t < N; t++) secs.push(map.get(y + ":" + t) || " ".repeat(width)); xyt.push("| " + secs.join(" | ") + " |"); }
  const single = gcd(K, N) === 1 && !KX;
  return {
    xyt: xyt.join("\n") + "\n",
    uwi: single ? lines.map(l => "| " + l.s + " |").join("\n") + "\n" : null,
    info: { N, K, KX, g, fullWidthNote, outer: outerInfo, geom: geomName(K, KX, N), orient: L.orient || "as given", Werr, keep: cutW, Wtop, sym, pw, width, errs: errs.length, qFrom, qCols, gap: gapInfo, rowsKept: Math.floor((cutW - (tailMode ? Wfirst : Wtop)) / N),
            tail: tailMode ? Object.assign({ rows: tailInfo.rows, driftDir: tailInfo.driftDir, pwFull: ex.hi - ex.lo + 1, alone: aloneMode }, plan) : null,
            alone: aloneMode ? { r0: alone.r0, r1: alone.r1, u0: alone.u0, u1: alone.u1, drawn: alone.drawn, close: alone.close, sh: Array(N).fill(0), rowShift: Array.from({ length: N }, (_, t) => Math.floor(K * t / N)) } : null }
  };
}


/* Axis-constraint branch mode: the ordinary symmetric recentering start file plus rlife constraints that keep
   the axis column empty in every row the search adds:
     --constraint 'grid("P-pre.cstr", grid_loop("P-axis.cstr"))'
   (current rlife syntax: wrappers take the next constraint as their last argument, per rlife's own help text
   "grid(grid_file, <next>)"). PRE covers the start rows with wildcards, because rlife also applies constraints
   to the start rows; AXIS is one row looped forever: '.' on the axis column, 'W' (anything) elsewhere.
   All three files share the root row, since rlife matches constraints to columns by root marker. */
function buildAxisConstraint(L, rule, opt){
  if ((opt.order || "f2b") !== "f2b") throw new Error("This mode is only available f2b.");
  if (L.KX) throw new Error("This mode needs a mirror-symmetric partial, and ships that move sideways can't be mirror-symmetric.");
  const o = build(L, rule, Object.assign({}, opt, { mode: "rc" }));
  const I = o.info;
  if (I.sym.type !== "odd" && I.sym.type !== "even") throw new Error("This mode needs a mirror-symmetric partial.");
  if (wantConstraint(opt)) addGapConstraint(o, 1);
  const N = I.N, K = I.K, g = gcd(N, K) || N;
  const rows = o.xyt.trim().split("\n").map(l => l.slice(l.indexOf("|") + 1, l.lastIndexOf("|")).split("|").map(sec => sec.slice(1, -1)));
  const isLabel = c => c !== "." && c !== "*" && c !== "?" && c !== " ";
  let Wroot = Infinity;
  rows.forEach((r, y) => r.forEach((sec, t) => { if ([...sec].some(isLabel)) Wroot = Math.min(Wroot, N * y + K * t); }));
  const lw = (y, t) => (N * y + K * t - Wroot) / g;
  // keep blank rows between filled ones: a line's position is its row, which sets its W
  const render = f => { const ls = rows.map((r, y) => "| " + r.map((sec, t) => [...sec].map((c, x) => f(c, x, y, t)).join("")).join(" | ") + " |");
    const filled = ls.map(l => /[^|\s]/.test(l)); const a0 = filled.indexOf(true), a1 = filled.lastIndexOf(true);
    return ls.slice(a0, a1 + 1).join("\n") + "\n"; };
  // is the axis column still alive in the last period kept? then the search has to kill it first
  let lastW = -Infinity; rows.forEach((r, y) => r.forEach((sec, t) => { if (sec.trim()) lastW = Math.max(lastW, lw(y, t)); }));
  let axisLive = false; rows.forEach((r, y) => r.forEach((sec, t) => { if (lw(y, t) > lastW - 2 * N / g && sec[0] === "*") axisLive = true; }));
  I.axisMode = { axisLive };
  return o;
}
/* Constraint files that keep the first gapCols columns (the axis side of the half) empty in every row the search
   adds: rlife applies constraints to the start rows too, so PRE covers those with wildcards ('?' included), and
   AXIS is one looped row. Used with a mirror left edge, so the columns next to the axis really are next to the
   mirror half. rlife syntax: --constraint 'grid("P-pre.cstr", grid_loop("P-axis.cstr"))'. */
function addGapConstraint(o, gapCols){
  const I = o.info, N = I.N, K = I.K, g = gcd(N, K) || N;
  const rows = o.xyt.trim().split("\n").map(l => l.slice(l.indexOf("|") + 1, l.lastIndexOf("|")).split("|").map(sec => sec.slice(1, -1)));
  const isLabel = c => c !== "." && c !== "*" && c !== "?" && c !== " ";
  let Wroot = Infinity;
  rows.forEach((r, y) => r.forEach((sec, t) => { if ([...sec].some(isLabel)) Wroot = Math.min(Wroot, N * y + K * t); }));
  const lw = (y, t) => (N * y + K * t - Wroot) / g;
  const render = f => { const ls = rows.map((r, y) => "| " + r.map((sec, t) => [...sec].map((c, x) => f(c, x, y, t)).join("")).join(" | ") + " |");
    const filled = ls.map(l => /[^|\s]/.test(l)); const a0 = filled.indexOf(true), a1 = filled.lastIndexOf(true);
    return ls.slice(a0, a1 + 1).join("\n") + "\n"; };
  o.pre = render(c => (c === "." || c === "*" || c === "?") ? "W" : c);
  o.axis = render((c, x, y, t) => { const w = lw(y, t); if (w === 0) return c; if (w === 1 && c !== " ") return x < gapCols ? "." : "W"; return " "; });
  I.gapCols = gapCols;
}
/* Cut along a drawn line. rlife needs the ? block to be one solid rectangle reaching the bottom row (split_picture in
   src/lat/geom.rs asserts it), so a stepped or angled unknown region can't be written into the start file. Instead:
     - the file gets a rectangle of ? from the shallowest point of the line down (every pattern column is inside it);
     - a constraint file (pre) puts the partial's own cells back, as '*' and '.', on every cell that lies inside the
       rectangle but on the known side of the line; everything else is 'W' (anything).
   The search then knows exactly the cells on the known side of the line and is free on the other side. The line is a
   function of the column: opt.cut = { t0, pts: [[x, y], ...] } in the input grid's columns and in rows of phase t0
   (y is a row edge: a horizontal line at y = 7 keeps rows 0..6). A cell (x, y', t) is kept when its W = N*y' + K*t is
   below N*y(x) + K*t0, so the same line applies to every phase. Full-width, front to back, orthogonal only. */
function buildLine(L, rule, opt){
  if ((opt.order || "f2b") !== "f2b") throw new Error("Cut-line mode is only available f2b.");
  if (L.KX) throw new Error("Cut-line mode is only built for orthogonal ships.");
  if ((opt.inputHalf || L.half || "none") !== "none") throw new Error("Cut-line mode needs the full-width partial, not a half cut at the axis. Set Symmetry to \"Ignore symmetry\" to unfold it.");
  const N = L.N, K = L.K, g = gcd(N, K) || N, span = N + K;
  const errs = opt._skipCheck ? [] : errors(L, rule, "none").list;
  const Wf = [];
  for (let t = 0; t < N; t++){ for (let y = 0; y < L.h; y++){ if (L.known && !L.known[t][y]) continue; let any = false; for (let x = 0; x < L.w; x++) if (L.lab[t].a[y*L.w+x]){ any = true; break; } if (any){ Wf.push(N*y + K*t); break; } } }
  const Wtop = Math.min(...Wf), Werr = errs.length ? errs[0].W : Infinity;
  let keep = Werr === Infinity ? maxKnownW(L) : Werr - span - 1;
  if (opt.backtrack) keep -= opt.backtrack * g;
  keep -= ((keep % g) + g) % g;
  if (keep < Wtop + N) throw new Error("The partial breaks almost immediately (first error at W=" + Werr + "). Check the RLE.");
  const ex = extentsX(L, keep), cols = []; for (let x = ex.lo; x <= ex.hi; x++) cols.push(x);
  const pw = cols.length, extra = Math.max(0, opt.extra | 0), left = 2, width = left + pw + extra + 3;
  const roots = "u".repeat(width - 3) + "RRR", qCols = [2, width - 3], qrows = 2 * N;
  // the line as a function of the input column
  const cut = opt.cut && opt.cut.pts && opt.cut.pts.length ? opt.cut : null;
  const pts = cut ? cut.pts.map(p => [+p[0], +p[1]]).sort((a, b) => a[0] - b[0]) : null, t0 = cut ? (cut.t0 | 0) : 0;
  if (cut && (t0 < 0 || t0 >= N)) throw new Error("The drawn line's generation is out of range.");
  const yAt = x => { if (x <= pts[0][0]) return pts[0][1]; const n = pts.length; if (x >= pts[n-1][0]) return pts[n-1][1];
    for (let i = 1; i < n; i++) if (x <= pts[i][0]){ const [x0, y0] = pts[i-1], [x1, y1] = pts[i]; return x1 === x0 ? y1 : y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return pts[n-1][1]; };
  let clamped = false, clampedTop = false;
  const kTop = Wtop + N - (((Wtop + N) % g) + g) % g;           // keep at least one physical row of the partial above the line
  const kmaxOf = i => {                                    // last known W in file column i (a multiple of g)
    const x = cols[Math.min(Math.max(i - left, 0), pw - 1)];
    let k = cut ? Math.ceil((N * yAt(x + 0.5) + K * t0) / g - 1e-9) * g - g : keep;   // the line passes through the middle of the column
    if (k > keep){ k = keep; clamped = true; }
    if (k < kTop){ k = kTop; clampedTop = true; }
    return k;
  };
  const kmax = []; for (let i = 0; i < width; i++) kmax.push(kmaxOf(i));
  let cutMin = Infinity, cutMax = -Infinity; for (let i = qCols[0]; i <= qCols[1]; i++){ cutMin = Math.min(cutMin, kmax[i]); cutMax = Math.max(cutMax, kmax[i]); }
  const qFrom = cutMin + g, lastW = cutMax + qrows, Wlo = Wtop - 2 * N;
  const rowsFor = Wv => { const out = []; for (let t = 0; t < N; t++){ const r = Wv - K * t; if (r % N === 0) out.push({ t, y: r / N }); } return out; };
  const get = (t, y, x) => (y < 0 || y >= L.h || x < 0 || x >= L.w) ? 0 : L.lab[t].a[y*L.w+x];
  const inHole = i => i >= qCols[0] && i <= qCols[1];
  const cellAt = (t, y, i) => { const ci = i - left; return (ci >= 0 && ci < pw && get(t, y, cols[ci])) ? "*" : "."; };
  let pinned = 0, freed = 0;
  const gridOf = fn => { const map = new Map(), lines = [];
    for (let Wv = Wlo - g; Wv <= lastW; Wv += g){ const rs = rowsFor(Wv); let first = null;
      rs.forEach(({ t, y }) => { let s = "";
        if (Wv === Wlo - g) s = fn.root; else for (let i = 0; i < width; i++) s += fn.cell(t, y, i, Wv);
        map.set(y + ":" + t, s); if (first === null) first = s; });
      lines.push({ W: Wv, s: first }); }
    const ys = [...map.keys()].map(k => +k.split(":")[0]), ymin = Math.min(...ys), ymax = Math.max(...ys), out = [];
    for (let y = ymin; y <= ymax; y++){ const secs = []; for (let t = 0; t < N; t++) secs.push(map.get(y + ":" + t) || " ".repeat(width)); out.push("| " + secs.join(" | ") + " |"); }
    return { text: out.join("\n") + "\n", lines }; };
  const file = gridOf({ root: roots, cell: (t, y, i, Wv) => Wv >= qFrom ? (inHole(i) ? "?" : ".") : cellAt(t, y, i) });
  const pre = gridOf({ root: roots, cell: (t, y, i, Wv) => {
    if (Wv >= qFrom && inHole(i) && i < width - 3){ if (Wv <= kmax[i]){ pinned++; return cellAt(t, y, i); } freed++; }   // R columns stay free: root-letter columns must be identical
    return "W"; } });
  const single = gcd(K, N) === 1;
  return { xyt: file.text, uwi: single ? file.lines.map(l => "| " + l.s + " |").join("\n") + "\n" : null,
    pre: pinned ? pre.text : undefined,
    info: { N, K, KX: 0, g, fullWidthNote: false, outer: null, geom: geomName(K, 0, N), orient: L.orient || "as given", Werr, keep: cutMin, Wtop,
            sym: { type: "none", lo: ex.lo }, pw, width, errs: errs.length, qFrom, qCols, gap: null, rowsKept: Math.floor((cutMin - Wtop) / N),
            line: { cutMin, cutMax, pinned, freed, clamped, clampedTop, limitW: keep, kmax: kmax.slice(qCols[0], qCols[1] + 1), cols } } };
}
/* The marked box in a writer's own rows and columns. rowOf maps (y, t) to the writer's rows, colOf (x, t) to its columns.
   Without a drawn box: the box around the errors (one cell of margin), or null if there are none. */
function markedBox(opt, errs, N, rowOf, colOf){
  if (opt.region && opt.region.x1 >= opt.region.x0 && opt.region.y1 >= opt.region.y0){
    const t0 = Math.min(N - 1, Math.max(0, opt.region.t0 | 0));
    return { r0: rowOf(Math.floor(opt.region.y0), t0), r1: rowOf(Math.floor(opt.region.y1), t0), u0: colOf(Math.floor(opt.region.x0), t0), u1: colOf(Math.floor(opt.region.x1), t0), drawn: true };
  }
  if (!errs.length) return null;
  let r0 = Infinity, r1 = -Infinity, u0 = Infinity, u1 = -Infinity;
  errs.forEach(e => { const rr = rowOf(e.y, e.t), uu = colOf(e.x, e.t); r0 = Math.min(r0, rr); r1 = Math.max(r1, rr); u0 = Math.min(u0, uu); u1 = Math.max(u1, uu); });
  return { r0: r0 - 1, r1: r1 + 1, u0: u0 - 1, u1: u1 + 1, drawn: false };   // one cell of room: in rlife tests a bigger box made the search explode
}
/* For "kept fixed": the cells within two cells (in the same generation) of a live cell of the partial outside the
   marked box. Only these are fixed; every other cell in the question marks is free, so the re-searched part can grow
   into empty space anywhere without being able to change the rest of the ship (a cell two away from the body is held
   dead, so nothing new can ever touch it). */
function nearBody(L, inBox, growOutside){
  // Strict by default: everything outside the box stays fixed. In rlife (3 Oct) a copperhead with two damaged cells was
  // repaired this way; freeing the empty space as well made the same search run out of memory first.
  if (growOutside !== true) return (t, y, x) => !inBox(t, y, x);
  const near = [];
  for (let t = 0; t < L.N; t++){
    const s = new Set(), a = L.lab[t].a, w = L.w, h = L.h;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){
      if (!a[y * w + x] || inBox(t, y, x)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) s.add((x + dx) + "," + (y + dy));
    }
    near.push(s);
  }
  return (t, y, x) => near[t].has(x + "," + y);
}
/* Re-search a marked region, orthogonal front-to-back ships. Same idea as the knightwise version in buildOblique, in
   W rows like buildLine: every row of the partial is kept; question marks from the first W row of the region's top line
   to the bottom, across the full width; a constraint file fixes every known cell inside them except the region's. */
function buildRegionOrtho(L, rule, opt){
  const N = L.N, K = L.K, g = gcd(N, K) || N;
  const errs = opt._skipCheck ? [] : errors(L, rule, "none").list;
  const rowOf = (y, t) => y + Math.floor(K * t / N);
  const Wf = [];
  for (let t = 0; t < N; t++) for (let y = 0; y < L.h; y++){ if (L.known && !L.known[t][y]) continue; for (let x = 0; x < L.w; x++) if (L.lab[t].a[y*L.w+x]){ Wf.push(N*y + K*t); break; } }
  const Wtop = Math.min(...Wf), keep0 = maxKnownW(L), keep = keep0 - (((keep0 % g) + g) % g);
  let reg = markedBox(opt, errs, N, rowOf, x => x);
  if (reg){ reg.x0 = reg.u0; reg.x1 = reg.u1; }
  else { const lastRow = Math.floor(keep / N); reg = { r0: Math.max(Math.floor(Wtop / N) + 2, lastRow - 2), r1: lastRow, x0: -Infinity, x1: Infinity, drawn: false, back: true }; }
  const topRow = Math.floor(Wtop / N);
  if (reg.r0 < topRow + 2) throw new Error("The marked region starts too close to the front of the partial; rlife needs a few known rows above it.");
  const outside = errs.filter(e => { const rr = rowOf(e.y, e.t); return rr < reg.r0 || rr > reg.r1 || e.x < reg.x0 || e.x > reg.x1; });
  if (outside.length) throw new Error(outside.length + " of the partial's " + errs.length + " errors lie outside the marked region (around line " + rowOf(outside[0].y, outside[0].t) + "). Mark them too, or the fixed cells will contradict each other.");
  const ex = extentsX(L, keep), cols = []; for (let x = ex.lo; x <= ex.hi; x++) cols.push(x);
  const pw = cols.length, left = 3, width = left + pw + 3;
  const roots = "LLL" + "u".repeat(pw) + "RRR", qCols = [2, width - 3];
  const qFrom = N * reg.r0 - (((N * reg.r0) % g) + g) % g, lastW = keep, Wlo = Wtop - 2 * N;
  const rowsFor = Wv => { const out = []; for (let t = 0; t < N; t++){ const r = Wv - K * t; if (r % N === 0) out.push({ t, y: r / N }); } return out; };
  const get = (t, y, x) => (y < 0 || y >= L.h || x < 0 || x >= L.w) ? 0 : L.lab[t].a[y*L.w+x];
  const inHole = i => i >= qCols[0] && i <= qCols[1];
  const xOf = i => { const ci = i - left; return (ci >= 0 && ci < pw) ? cols[ci] : null; };
  const cellAt = (t, y, i) => { const x = xOf(i); return (x !== null && get(t, y, x)) ? "*" : "."; };
  const inRegion = (t, y, i) => { const x = i - left + ex.lo, rr = rowOf(y, t); return rr >= reg.r0 && rr <= reg.r1 && x >= reg.x0 && x <= reg.x1; };
  const nearB = nearBody(L, (t, y, x) => { const rr = rowOf(y, t); return rr >= reg.r0 && rr <= reg.r1 && x >= reg.x0 && x <= reg.x1; }, opt.growOutside);
  let pinned = 0, freed = 0;
  const gridOf = fn => { const map = new Map(), lines = [];
    for (let Wv = Wlo - g; Wv <= lastW; Wv += g){ const rs = rowsFor(Wv); let first = null;
      rs.forEach(({ t, y }) => { let s = "";
        if (Wv === Wlo - g) s = roots; else for (let i = 0; i < width; i++) s += fn(t, y, i, Wv);
        map.set(y + ":" + t, s); if (first === null) first = s; });
      lines.push({ W: Wv, s: first }); }
    const ys = [...map.keys()].map(k => +k.split(":")[0]), ymin = Math.min(...ys), ymax = Math.max(...ys), out = [];
    for (let y = ymin; y <= ymax; y++){ const secs = []; for (let t = 0; t < N; t++) secs.push(map.get(y + ":" + t) || " ".repeat(width)); out.push("| " + secs.join(" | ") + " |"); }
    return { text: out.join("\n") + "\n", lines }; };
  const file = gridOf((t, y, i, Wv) => Wv >= qFrom ? (inHole(i) ? "?" : ".") : cellAt(t, y, i));
  const pre = gridOf((t, y, i, Wv) => {
    if (Wv >= qFrom && (i < 3 || i >= width - 3)){   // root-letter columns: one value per group (see the knightwise writer)
      const inner = i < 3 ? 2 : width - 3, xi = inner - left + ex.lo;
      if (!inRegion(t, y, inner) && nearB(t, y, xi)){ pinned++; return "."; } freed++; return "W";
    }
    if (Wv >= qFrom && inHole(i)){ const x = i - left + ex.lo; if (inRegion(t, y, i) || !nearB(t, y, x)){ freed++; return "W"; } pinned++; return cellAt(t, y, i); }
    return "W"; });
  const single = gcd(K, N) === 1, Werr = errs.length ? errs[0].W : Infinity;
  return { xyt: file.text, uwi: single ? file.lines.map(l => "| " + l.s + " |").join("\n") + "\n" : null, pre: pre.text,
    info: { N, K, KX: 0, g, fullWidthNote: false, outer: null, geom: geomName(K, 0, N), orient: L.orient || "as given", Werr, keep, Wtop,
            sym: { type: "none", lo: ex.lo }, pw, width, errs: errs.length, qFrom, qCols, gap: null, rowsKept: Math.floor((keep - Wtop) / N),
            region: { r0: reg.r0, r1: reg.r1, u0: Math.max(reg.x0, ex.lo - 1), u1: Math.min(reg.x1, ex.hi + 1), drawn: reg.drawn, back: !!reg.back, pinned, freed, errs: errs.length, top: topRow, lastRow: Math.floor(keep / N), sh: Array(N).fill(0), rowShift: Array.from({ length: N }, (_, t) => Math.floor(K * t / N)) } } };
}
/* Tail-only picture: only the last few rows are given as known cells and the ? block hugs the tail, as in amling's own
   examples (page 22: a 3-wide ??? in a 17-wide file searches like a 7-wide board; his plan A is 3 wide too). rlife's
   split_picture crops the file to the ? box plus two fixed columns each side plus any --left-pad/--right-pad, and to
   nh_w_size - 1 rows above the box; everything else in the file is ignored (src/lat/geom.rs, and the pic edge in
   src/llsss/cli/common.rs). room* = extra ? columns beside the tail's own extent; edges = whether the ? box reaches
   the L and R root columns (amling: it must reach one for the board to be able to widen; without them it is a fixed
   board of exactly the box). */
function tailPlan(ext, driftDir, opt, mirror){
  const tailW = ext.hi - ext.lo + 1;
  const auto = (side) => driftDir === 0 ? 4 : (driftDir === side ? 10 : 3);
  const roomL = opt.roomL === undefined || opt.roomL === "" || opt.roomL === null ? auto(-1) : Math.max(0, opt.roomL | 0);
  const roomR = opt.roomR === undefined || opt.roomR === "" || opt.roomR === null ? auto(1) : Math.max(0, opt.roomR | 0);
  const edges = opt.edges !== false;
  // mirror edge (half searched from the axis): the window's left edge is the axis, so no room or L columns there; the
  // ? box still starts at column 2, since split_picture needs two columns left of it, and the window starts there
  if (mirror){ const S = tailW + roomR;
    return { tailW, roomL: 0, roomR, edges, S, left: 0, width: S + (edges ? 3 : 2), roots: "u".repeat(S) + (edges ? "RRR" : "uu"), qCols: null, mirror: true }; }
  const S = tailW + roomL + roomR;
  return { tailW, roomL, roomR, edges, S, left: edges ? 3 : 2, width: (edges ? 3 : 2) + S + (edges ? 3 : 2),
           roots: edges ? "LLL" + "u".repeat(S) + "RRR" : null, qCols: null };
}
function geomName(K, KX, N){
  if (!KX) return (K === 1 ? "" : K) + "c" + N + "-f2b";
  if (KX === 1 && K === 2) return "c" + N + "k-1";            // identical to simple_vv:-1:-2:N (amling, 9 Sep 2026)
  return "simple_vv:" + (-KX) + ":" + (-K) + ":" + N;
}
function maxKnownW(L){ let m = -Infinity; for (let t = 0; t < L.N; t++) for (let y = 0; y < L.h; y++){ if (L.known && !L.known[t][y]) continue; m = Math.max(m, L.N*y + L.K*t); } return m; }
function extentsX(L, Wmax, Wmin){ if (Wmin === undefined) Wmin = -Infinity; let lo = Infinity, hi = -Infinity; for (let t = 0; t < L.N; t++) for (let y = 0; y < L.h; y++){ if (L.N*y + L.K*t > Wmax || L.N*y + L.K*t < Wmin) continue; if (L.known && !L.known[t][y]) continue; for (let x = 0; x < L.w; x++) if (L.lab[t].a[y*L.w+x]){ lo = Math.min(lo, x); hi = Math.max(hi, x); } } return { lo, hi }; }
/* How many file columns beside the axis must stay empty for the two halves to evolve independently. Odd: file
   column 0 is the axis, a cell in column k and its mirror are 2k apart, and they share no neighbour from k = 2.
   Even: the axis falls between file columns 0 and 1, which are duplicates of each other (amling, page 22), so a
   cell in column k and its mirror are 2k - 1 apart and again independent from k = 2. Two columns either way. */
function gapWidth(sym){ return 2; }
/* Constraint files: on by default for the symmetric whole (they keep the two mirrored branches from touching). Never for
   one branch alone: with no symmetry edge rlife uses pic(bg), which already forces the two columns left of the ? block
   to stay empty, and the constraints do strictly less than that (amling, page 24, 29 Sep 2026). */
function wantConstraint(opt){ if (opt.solo) return false; return opt.keepOff !== undefined ? !!opt.keepOff : true; }

function findGap(L, cols, Wtop, keep, sym){
  // rows in W order; band = first two half columns
  const N = L.N, K = L.K;
  const gw = gapWidth(sym);
  const band = Wv => { for (let t = 0; t < N; t++){ const r = Wv - K*t; if (r % N) continue; const y = r / N; if (y < 0 || y >= L.h) continue; for (const c of cols.slice(0, gw)) if (L.lab[t].a[y*L.w+c]) return true; } return false; };
  // every stretch where the band stays empty for at least one period; use the deepest one,
  // so the cut keeps as much of the partial as possible (a stretch reaching the safe cut is cut there)
  let runStart = null;
  const g = gcd(N, K) || N, runs = [];
  for (let Wv = Wtop; Wv <= keep + g; Wv += g){
    const alive = Wv <= keep ? band(Wv) : true;
    if (!alive){ if (runStart === null) runStart = Wv; }
    else { if (runStart !== null && Wv - runStart >= 2 * N) runs.push({ open: runStart, cut: Wv }); runStart = null; }
  }
  if (!runs.length) return null;
  const best = runs[runs.length - 1];
  best.others = runs.length - 1;
  return best;
}

/* rlife's own route to a start file (src/utils/mgp_tool.rs, src/llsss/cli/*.rs): give the search one generation of the
   partial as a file, as '@yolo_1gp("file")'. rlife (load_1gp) simulates one period, finds the failed CA checks at the
   back, keeps the rows in front of them and wraps that for the search: to_rc_input for llsss-recentering (LLL...RRR
   root markers), to_fixed_input for llsss, with question marks only over the columns where the back differs from the
   background, plus optional left and right pads. It handles every named geometry and any background agar, but not
   symmetry, and the file must be in the geometry's own orientation (the ship moving by V each period). So it covers
   asymmetric recentering and fixed-board searches. Returns { rle, kind } or null. */
function official(L, rule, opt, o){
  const I = o.info;
  if (!L.raw) return null;                                            // needs the generations as an RLE, not a log grid
  // Diagonal: in rlife (2 Oct) its grids for two c/5 and c/6 diagonal partials started with no valid states and the
  // search ended at once, while the cutter's own files for the same partials searched normally. Off until resolved.
  if (/d-/.test(I.geom)) return null;
  const kind = opt.mode === "fixed" ? "fixed" : (opt.mode === "rc" && I.sym.type === "none") ? "rc" : null;
  if (!kind) return null;
  const side = I.order === "b2f" ? "front" : I.order === "s2s" ? (opt.side || "left") : "back";
  let oo; try { oo = orientGeneric(L, I.geom, side); } catch (e){ return null; }
  const cells = [...oo.live[0]].map(k => k.split(",").map(Number));
  if (!cells.length) return null;
  const x0 = Math.min(...cells.map(c => c[0])), y0 = Math.min(...cells.map(c => c[1]));
  const w = Math.max(...cells.map(c => c[0])) - x0 + 1, h = Math.max(...cells.map(c => c[1])) - y0 + 1;
  const rows = Array.from({ length: h }, () => Array(w).fill(0)); cells.forEach(([x, y]) => { rows[y - y0][x - x0] = 1; });
  const runs = rows.map(r => { let s = "", i = 0; const n = r.lastIndexOf(1) + 1; while (i < n){ let j = i; while (j < n && r[j] === r[i]) j++; s += (j - i > 1 ? j - i : "") + (r[i] ? "o" : "b"); i = j; } return s; });
  let body = "", blank = 0;
  runs.forEach((ln, i) => { if (i === 0){ body += ln; return; } if (ln === ""){ blank++; return; } body += (blank + 1 > 1 ? blank + 1 : "") + "$" + ln; blank = 0; });
  body += "!";
  // wrap between whole runs only: rlife's RLE reader parses one line at a time and panics on a run count split
  // across a line break (src/gol/ff.rs: a line ending in "b2" with the "o" on the next line)
  const lines = []; let cur = "";
  for (const tok of body.match(/\d*[a-z$!]/gi)){ if (cur.length + tok.length > 70){ lines.push(cur); cur = ""; } cur += tok; }
  if (cur) lines.push(cur);
  return { kind, rle: "x = " + w + ", y = " + h + ", rule = " + rule.text + "\n" + lines.join("\n") + "\n", orient: oo.tname, w, h, live: cells.length };
}
/* mid_steps: amling's own commands use 7 to 12. On a c/5 diagonal partial, 18 blew up (5 GB in 14 rows) and 8 ran
   normally (60 rows, 500 MB), so the cutter's suggestion is the board width plus 2, kept between 8 and 12. */
function midSteps(w){ return String(Math.min(8, Math.max(6, w))).padStart(2, "0"); }   // lowered on request (2 Oct): was 8 to 12
function officialCommand(info, opt, kind, file){
  const rule = "--rule '" + opt.rule + "'", pad = Math.max(0, opt.extra | 0);
  const lines = ["# Made with the LLSSS partial cutter (designed by LuveelVoom, coded with AI, NOT PART OF LLSSS).",
    "# Here the cutter only writes one generation of your partial; @yolo_1gp builds the start file.",
    "# If something goes wrong, say you used the partial cutter and include your partial, its options, this command, rlife's log, and as much additional info as possible.",
    "export LLSSS_HALT_ON_ENDS=true"];
  const mid = midSteps(info.pw + 2);
  lines.push(kind === "fixed" ? `./rlife llsss ${rule} ${info.geom} '@yolo_1gp("${file}", ${pad}, ${pad})' > out.txt`
                              : `./rlife llsss-recentering ${rule} ${info.geom} '@yolo_1gp("${file}")' ${mid} > out.txt`);
  return lines.join("\n");
}
function command(info, opt){
  // one command per start file; mid_steps is roughly the pattern width + 1 (amling)
  const rule = "--rule '" + opt.rule + "'", lines = ["# Made with the LLSSS partial cutter (designed by LuveelVoom, coded with AI, NOT PART OF LLSSS).", "# If something goes wrong, say you used the partial cutter and include your partial, its options, this command, rlife's log, and as much additional info as possible.", "export LLSSS_HALT_ON_ENDS=true"];
  if (info.generic){
    const ends = info.order === "s2s" ? " --ends '[bg, even, odd]'" : "", mid = midSteps(info.pw + 2);
    lines.push(opt.mode === "fixed" ? `./rlife llsss ${rule}${ends} ${info.geom} ${opt.file} > out.txt`
                                    : `./rlife llsss-recentering ${rule}${ends}${info.sym && info.sym.type === "odd" ? " --left-edge odd" : ""} ${info.geom} ${opt.file} ${mid} > out.txt`);
    return lines.join("\n");
  }
  if (info.geom.startsWith("simple_vv")) lines.unshift("# simple_vv geometries need an rlife build from after September 9 2026. Update your build.");
  const g = info.geom;
  // A branch search can run two ways (amling, "plan A"/"plan B"): as the symmetric whole, with a mirror edge, or as
  // one branch alone, where the default pic(bg) edge continues the picture and then the background agar. opt.solo
  // picks the latter, so the mirror edge is dropped; the constraint files still keep the branch off the axis.
  const solo = opt.solo && (opt.mode === "branch" || opt.mode === "axis");
  const le = (info.sym.type !== "none" && !solo) ? " --left-edge " + info.sym.type : "";
  const mid = opt.mode === "branch" ? "08" : midSteps(info.pw + 2);
  if (opt.mode === "fixed") lines.push(`./rlife llsss ${rule}${le} ${g} ${opt.file} > out.txt`);
  else if (opt.mode === "rc") lines.push(`./rlife llsss-recentering ${rule}${le} ${g} ${opt.file} ${mid} > out.txt`);
  else if (opt.mode === "axis"){ const base = opt.file.replace(/\.in$/, ""), cs = wantConstraint(opt) ? ` --constraint 'grid("${base}-pre.cstr", grid_loop("${base}-axis.cstr"))'` : "";
    lines.push(`./rlife llsss-recentering ${rule}${le}${cs} ${g} ${opt.file} ${mid} > out.txt`); }
  else if (opt.mode === "tail" || opt.mode === "alone"){
    const tw = info.tail ? info.tail.tailW : info.pw;
    lines.push(`./rlife llsss-recentering ${rule}${opt.mode === "tail" ? le : ""} ${g} ${opt.file} ${midSteps(tw + 2)} > out.txt`);
  }
  else if (opt.mode === "region"){
    const base = opt.file.replace(/\.in$/, "");
    // mid_steps about two thirds of the board width: the search grows partials in from both edges and they must meet
    // across the whole board (8 died and 12 worked on a 16-column board; 24 got furthest on a 36-column one)
    const midR = String(Math.max(8, Math.round(info.width * 2 / 3))).padStart(2, "0");
    lines.push(`./rlife llsss-recentering ${rule} --constraint 'grid("${base}-pre.cstr", none)' ${g} ${opt.file} ${midR} > out.txt`);
  }
  else if (opt.mode === "line"){
    const base = opt.file.replace(/\.in$/, ""), cs = info.line && info.line.pinned ? ` --constraint 'grid("${base}-pre.cstr", none)'` : "";
    lines.push(`./rlife llsss-recentering ${rule}${cs} ${g} ${opt.file} ${midSteps(info.pw + 2)} > out.txt`);
  }
  else if (opt.mode === "outer"){
    const o = info.outer, lp = String(o.leftPad).padStart(2, "0"), mo = midSteps(info.pw - o.c1 + 5);
    lines.push(`./rlife llsss-recentering ${rule} --left-pad ${lp} --fuzzy-left-edge ${g} ${opt.file} ${mo} > out.txt`);
  }
  else { const base = opt.file.replace(/\.in$/, ""), cs = wantConstraint(opt) ? ` --constraint 'grid("${base}-pre.cstr", grid_loop("${base}-axis.cstr"))'` : "";
    // ? gap: mirror edge unless one branch alone; the gap is held by constraint files unless they are switched off
    lines.push(`./rlife llsss-recentering ${rule}${le}${cs} ${g} ${opt.file} ${mid} > out.txt`); }
  return lines.join("\n");
}

/* Grids already in one frame (log grids, stacked LifeHistory): find the displacement per period by testing the rule
   across the period wrap for every candidate move; blank (off-board) cells are never used in a check. */
function detectMotion(blocks, rule){
  const N = blocks.length, H = Math.max(...blocks.map(b => b.length)), Wd = Math.max(...blocks.flat().map(r => r.length));
  const cell = (t, x, y) => { const r = blocks[t][y]; if (y < 0 || y >= blocks[t].length || x < 0 || x >= Wd) return 0; const c = (r || "")[x] || " "; return c === "*" ? 1 : c === "." ? 0 : null; };
  let best = null;
  for (let d = 1; d <= N; d++) for (let dx = -d; dx <= d; dx++) for (let dy = -d; dy <= d; dy++){
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue;       // each candidate once, slowest first
    const v = (t, x, y) => { if (t >= N){ t -= N; x -= dx; y -= dy; } return cell(t, x, y); };
    let bad = 0, n = 0;
    for (let t = 0; t < N && (!best || bad < best.bad); t++) for (let y = -1; y <= H; y++) for (let x = -1; x <= Wd; x++){
      const me = v(t, x, y), ch = v(t + 1, x, y); if (me === null || ch === null) continue;
      const nb = [v(t,x-1,y-1),v(t,x,y-1),v(t,x+1,y-1),v(t,x-1,y),v(t,x+1,y),v(t,x-1,y+1),v(t,x,y+1),v(t,x+1,y+1)];
      if (nb.includes(null)) continue;
      const m = (nb[0]<<7)|(nb[1]<<6)|(nb[2]<<5)|(nb[3]<<4)|(nb[4]<<3)|(nb[5]<<2)|(nb[6]<<1)|nb[7];
      n++; if ((me ? rule.S[m] : rule.B[m]) !== ch) bad++;
    }
    if (!best || bad < best.bad) best = { dx, dy, bad, n };
  }
  return best;
}
function gensFromBlocks(blocks){
  const Wd = Math.max(...blocks.flat().map(r => r.length));
  return blocks.map(b => { const g = G(Wd, b.length); b.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === "*") g.a[y * Wd + x] = 1; }); return { g, ox: 0, oy: 0 }; });
}


/* A diagonal chart copied from a log (a recentering partial printed by rlife, in a cNd geometry). Lines are only partly
   filled: the cells outside the ship's diagonal outline are blank and unknown, so cells are read one by one. The ship
   moves by (-K, -K) each period in the chart's own frame (rlife's diagonal V). A chart from a symmetric search is a
   half; rlife's odd edge mirrors it across a line x - y = c through cells, (x, y) -> (y + c, x - c). Every speed and
   fold is scored by how many of the checkable cells break the rule; a chart printed by rlife passed rlife's checks, so
   under the right speed, fold and rule it breaks none except at its unfinished back. */
function diagonalChart(inp, rule){
  const N = inp.rawSecs.length, known = [];
  let dmin = Infinity;
  for (let t = 0; t < N; t++){ const m = new Map(); inp.rawSecs[t].forEach((s, y) => { for (let x = 0; x < s.length; x++){ const ch = s[x]; if (ch === "." || ch === "*"){ m.set(x + "," + y, ch === "*" ? 1 : 0); dmin = Math.min(dmin, x - y); } } }); known.push(m); }
  const score = (K, c) => {
    const v = (t, x, y) => { while (t >= N){ t -= N; x += K; y += K; } if (c !== null && x - y < c){ const nx = y + c, ny = x - c; x = nx; y = ny; } const r = known[t].get(x + "," + y); return r === undefined ? null : r; };
    let n = 0, e = 0;
    for (let t = 0; t < N; t++) for (const k of known[t].keys()){
      const [x, y] = k.split(",").map(Number); const me = v(t, x, y), ch = v(t + 1, x, y); if (me === null || ch === null) continue;
      const nb = [v(t,x-1,y-1),v(t,x,y-1),v(t,x+1,y-1),v(t,x-1,y),v(t,x+1,y),v(t,x-1,y+1),v(t,x,y+1),v(t,x+1,y+1)];
      if (nb.includes(null)) continue;
      const m = (nb[0]<<7)|(nb[1]<<6)|(nb[2]<<5)|(nb[3]<<4)|(nb[4]<<3)|(nb[5]<<2)|(nb[6]<<1)|nb[7];
      n++; if ((me ? rule.S[m] : rule.B[m]) !== ch) e++;
    }
    return { n, e };
  };
  // rlife prints the root markers with every partial. A full-width search has L markers at its left edge; a half from
  // a symmetric search has none (u runs right up to the axis). Use them when present; otherwise let the scores decide.
  const letters = new Set(inp.rawSecs.flat().join("").replace(/[^A-Za-z]/g, ""));
  const folds = letters.has("L") ? [null] : (letters.has("u") || letters.has("R")) ? [dmin, dmin + 1, dmin + 2] : [null, dmin, dmin + 1, dmin + 2];
  const cands = [];
  // any speed up to one cell per generation (c/4 is only Life's limit)
  for (let K = 1; K <= N; K++) for (const c of folds){ const r = score(K, c); cands.push({ K, c, n: r.n, e: r.e, rate: r.n ? r.e / r.n : 1 }); }
  const nMax = Math.max(...cands.map(c => c.n));
  // equal failure rates: prefer the reading that makes more cells checkable. A half read without its fold also fails
  // nothing (the cells next to the axis just can't be checked), but the right fold checks them too.
  const ok = cands.filter(c => c.n >= 0.5 * nMax && c.n > 0).sort((a, b) => a.rate - b.rate || b.n - a.n || a.K - b.K);
  if (!ok.length) throw new Error("Couldn't check any cells of this diagonal grid; it may be too small.");
  const best = ok[0];
  if (best.rate > 0.03) throw new Error("This diagonal grid doesn't follow " + rule.text + " at any diagonal speed: the best fit (" + (best.K === 1 ? "" : best.K) + "c/" + N + "d" + (best.c !== null ? ", folded at its axis" : "") + ") still fails " + best.e + " of " + best.n + " checks. Try setting the rulebox to the rule you are using.");
  // generations: the known live cells, plus their mirror images for a half; everything unknown is taken as dead
  const gens = known.map(m => {
    const live = []; for (const [k, val] of m) if (val){ const [x, y] = k.split(",").map(Number); live.push([x, y]); if (best.c !== null) live.push([y + best.c, x - best.c]); }
    if (!live.length) return { g: G(1, 1), ox: 0, oy: 0 };
    const x0 = Math.min(...live.map(p => p[0])), y0 = Math.min(...live.map(p => p[1]));
    const g = G(Math.max(...live.map(p => p[0])) - x0 + 1, Math.max(...live.map(p => p[1])) - y0 + 1);
    live.forEach(([x, y]) => { g.a[(y - y0) * g.w + (x - x0)] = 1; });
    return { g, ox: x0, oy: y0 };
  });
  return { gens, K: best.K, c: best.c, rate: best.rate, e: best.e, n: best.n };
}

/* one-call pipeline */
function analyze(text, ruleText, opt){
  const rule = parseRule(ruleText);
  const inp = parseInput(text, opt.phases);
  let L, how;
  if (inp.kind === "frame"){
    const mv = detectMotion(inp.blocks, rule);
    if (!mv) throw new Error("Couldn't find the ship's motion in this grid.");
    L = buildLab(gensFromBlocks(inp.blocks), mv.dx, mv.dy); how = inp.blocks.length + " generations stacked (LifeHistory)";
  }
  else if (inp.kind === "xyt" && inp.partial > inp.full){
    const d = diagonalChart(inp, rule);
    L = buildLab(d.gens, -d.K, -d.K);
    how = "diagonal grid (" + (d.K === 1 ? "" : d.K) + "c/" + inp.secs.length + "d)" + (d.c !== null ? ", a half unfolded at its axis" : "");
    L.fit = { rate: d.rate, errors: d.e, checks: d.n, mirror: d.c !== null ? "odd" : "none" };
  }
  else if (inp.kind === "xyt"){
    // a grid in LLSSS layout: if the ship moves any way other than up (f2b layouts), treat it as generations in one frame
    const blocks = inp.secs.map(sec => sec.map(r => r === null ? " ".repeat(inp.w) : r));
    const mv = detectMotion(inp.secs.map((sec, t) => sec.map(r => r === null ? " ".repeat(inp.w) : r)), rule);
    if (mv && !(mv.dy < 0 && -mv.dy >= Math.abs(mv.dx) && mv.dx <= 0)){
      L = buildLab(gensFromBlocks(blocks), mv.dx, mv.dy); how = "grid in one frame (ship moves " + (mv.dx < 0 ? "left" : mv.dx > 0 ? "right" : "") + (mv.dy < 0 ? " up" : mv.dy > 0 ? " down" : "") + ")";
      return { L, rule, how, inputRule: inp.rule };
    }
    L = labFromXYT(inp, rule); how = "grid (already in LLSSS layout)";
    // A partial printed by rlife passed rlife's CA checks, so under the search's rule it fails only at its back. If the
    // best speed still fails a large share of checks spread over the grid, the rule in the Rule box is not the one the
    // search used (a log grid doesn't record its rule).
    if (L.fit && L.fit.rate > 0.03){
      const spd = (L.KX ? "(" + L.K + "," + L.KX + ")" : (L.K === 1 ? "" : L.K)) + "c/" + L.N;
      // look for a speed and fold under which the grid follows SOME isotropic rule, and name it
      let guess = null;
      for (let K = 1; K <= L.N && !guess; K++) for (const mir of ["none", "odd", "even"]){
        const T = Object.assign({}, L, { K, KX: 0, fit: { mirror: mir } }); const r = inferRule(T);
        if (r){ guess = { r, K, mir }; break; }
      }
      throw new Error("This grid doesn't follow " + rule.text + " at any speed: the best fit (" + spd + (L.fit.mirror !== "none" ? ", folded " + L.fit.mirror : "") + ") still fails " + L.fit.errors + " of " + L.fit.checks + " checks (" + Math.round(100 * L.fit.rate) + "%). Try setting the rulebox to the rule you are using." +
        (guess ? " The grid itself is consistent with " + guess.r + " at " + (guess.K === 1 ? "" : guess.K) + "c/" + L.N + (guess.mir !== "none" ? " (an " + guess.mir + " half)" : "") + "; transitions that never occur in it are left out, so your rule may switch more on." : ""));
    }
    const e = m => errors(L, rule, m).list.length;
    const cands = [["none", e("none")], ["odd", e("odd")], ["even", e("even")]].sort((a, b) => a[1] - b[1]);
    L.half = cands[0][1] < cands.find(c => c[0] === "none")[1] ? cands[0][0] : "none";
    if (L.half !== "none") how += ", half cut at the axis (" + L.half + ")";
  }
  else if (inp.kind === "phases"){
    const o = orderPhases(inp.phases, rule);
    const a = alignPhases(o.phases, rule);
    L = buildLab(a.gens, a.DX, a.DY); how = inp.phases.length + " generations side by side" + (o.reordered ? " (reordered to " + o.order.map(k => k + 1).join(",") + ")" : "");
    L.quality = a.quality;
  } else {
    const d = detectFromSingle(inp.grid, rule, opt.maxPeriod || 30);
    if (!d) throw new Error("Couldn't find period up to " + (opt.maxPeriod || 30) + " from a 1gp. Paste all generations side by side instead. And check your RLE.");
    L = buildLab(d.gens, d.DX, d.DY); how = "one generation, simulated";
  }
  return { L, rule, how, inputRule: inp.rule };
}
/* A half cut at the axis (a log grid from a symmetric search), unfolded to the whole ship. Even: columns 0 and 1 are
   copies and column -1 mirrors column 2; odd: column 0 is the axis (as in valFn). */
function unfoldHalf(L){
  const half = L.half || "none"; if (half !== "odd" && half !== "even") return L;
  const p = L.w - (half === "odd" ? 1 : 2), w = p + L.w;
  const lab = L.lab.map(g => { const n = G(w, L.h); for (let y = 0; y < L.h; y++) for (let j = 0; j < w; j++) n.a[y*w+j] = g.a[y*L.w + (j < p ? L.w - 1 - j : j - p)]; return n; });
  return Object.assign({}, L, { lab, w, half: "none", unfolded: half });
}
return { parseRule, parseInput, analyze, build, unfoldHalf, command, official, officialCommand, errors, symmetry, HENSEL, _G: G, tornSide, orderFor, lattice, decodeRLE, detectMotion };
})();

if (typeof module !== "undefined") module.exports = Core;
