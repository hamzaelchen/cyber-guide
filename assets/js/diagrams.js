/* CYBER//GUIDE — moteur de schémas.
   Un schéma = un objet JSON dans le contenu :  { type:'flow'|'sequence'|'stack'|'matrix'|'tiles'|'bars'|'steps'|'hub'|'svg', ... }
   Voir README.md pour tous les champs. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const COL = { g: '#00ff9c', c: '#22d3ee', m: '#ff2bd6', a: '#ffb000', r: '#ff4d4d', v: '#a78bfa', b: '#4d8dff', w: '#9fb3bb', o: '#ff7a29' };
  const PAL = ['g', 'c', 'm', 'a', 'v', 'b', 'o', 'r'];
  const col = k => COL[k] || k || COL.g;

  function s(tag, attrs, ...kids) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    kids.flat().forEach(c => { if (c == null) return; e.append(c.nodeType ? c : document.createTextNode(c)); });
    return e;
  }
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v;
      else if (k === 'style') e.style.cssText = v; else if (v != null && v !== false) e.setAttribute(k, v);
    }
    kids.flat().forEach(c => { if (c == null || c === false) return; e.append(c.nodeType ? c : document.createTextNode(c)); });
    return e;
  }
  const lines = t => String(t == null ? '' : t).split('\n');

  /* ---------- icônes (viewBox 20x20) ---------- */
  const ICONS = {
    monitor: [['rect', { x: 2, y: 3, width: 16, height: 11, rx: 1.5 }], ['path', { d: 'M7 17h6M10 14v3' }]],
    server: [['rect', { x: 3, y: 3, width: 14, height: 5, rx: 1 }], ['rect', { x: 3, y: 11, width: 14, height: 5, rx: 1 }], ['path', { d: 'M6 5.5h.01M6 13.5h.01' }]],
    db: [['ellipse', { cx: 10, cy: 5, rx: 6, ry: 2.5 }], ['path', { d: 'M4 5v10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5M4 10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5' }]],
    cloud: [['path', { d: 'M6 15a3.5 3.5 0 0 1-.4-7A5 5 0 0 1 15.3 8 3.5 3.5 0 0 1 15 15z' }]],
    lock: [['rect', { x: 4, y: 9, width: 12, height: 8, rx: 1.5 }], ['path', { d: 'M7 9V6.5a3 3 0 0 1 6 0V9' }]],
    unlock: [['rect', { x: 4, y: 9, width: 12, height: 8, rx: 1.5 }], ['path', { d: 'M7 9V6.5a3 3 0 0 1 5.6-1.5' }]],
    user: [['circle', { cx: 10, cy: 6.5, r: 3 }], ['path', { d: 'M3.5 17c.6-3.4 3.2-5 6.5-5s5.9 1.6 6.5 5' }]],
    shield: [['path', { d: 'M10 2.5l6 2.3v4.7c0 4-2.6 6.6-6 8-3.4-1.4-6-4-6-8V4.8z' }]],
    key: [['circle', { cx: 6.5, cy: 10, r: 3 }], ['path', { d: 'M9.5 10H17M14.5 10v3M17 10v2' }]],
    box: [['path', { d: 'M3 6.5L10 3l7 3.5v7L10 17l-7-3.5zM3 6.5L10 10l7-3.5M10 10v7' }]],
    skull: [['path', { d: 'M4 9a6 6 0 1 1 12 0c0 2-.8 3-2 3.8V16H6v-3.2C4.8 12 4 11 4 9z' }], ['path', { d: 'M8 10h.01M12 10h.01' }]],
    gear: [['circle', { cx: 10, cy: 10, r: 2.6 }], ['path', { d: 'M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4' }]],
    file: [['path', { d: 'M5 2.5h6.5L15 6v11.5H5z M11 2.5V6h4' }]],
    globe: [['circle', { cx: 10, cy: 10, r: 7 }], ['path', { d: 'M3 10h14M10 3c2.2 2 3.2 4.4 3.2 7s-1 5-3.2 7c-2.2-2-3.2-4.4-3.2-7S7.800 5 10 3z' }]],
    switch: [['rect', { x: 2.5, y: 6.5, width: 15, height: 7, rx: 1.5 }], ['path', { d: 'M5.5 10h.01M8.5 10h.01M11.5 10h.01M14.5 10h.01' }]]
  };
  function icon(name, x, y, color, size = 20) {
    const g = s('g', { transform: `translate(${x},${y}) scale(${size / 20})`, fill: 'none', stroke: color, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    (ICONS[name] || ICONS.box).forEach(([t, a]) => g.append(s(t, a)));
    return g;
  }

  function markerDefs(svg, colors) {
    const defs = s('defs');
    [...colors].forEach(c => {
      const id = 'ah' + c.replace('#', '');
      defs.append(s('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, s('path', { d: 'M0 0L10 5L0 10z', fill: c })));
    });
    svg.append(defs);
  }
  const mid = c => 'url(#ah' + c.replace('#', '') + ')';

  function wrapSvg(svg, W, H, minW) {
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'dsvg');
    svg.style.minWidth = Math.min(W, minW || 620) + 'px';
    return h('div', { class: 'd-scroll' }, svg);
  }

  /* ---------- FLOW : nœuds placés sur une grille (x,y) + flèches + zones ---------- */
  function flow(sp) {
    const colW = sp.colW || 210, rowH = sp.rowH || 104, padX = 26, padY = 38;
    const N = {}; let mx = 0, my = 0;
    sp.nodes.forEach(n => {
      const L = lines(n.label), S = n.sub ? lines(n.sub) : [];
      const maxLen = Math.max(...L.map(l => l.length), ...S.map(l => l.length * 0.9));
      const ic = n.icon ? 26 : 0;
      n.w = n.w || Math.max(112, Math.round(maxLen * 7.4 + 32 + ic));
      n.h = n.h || Math.max(48, 20 + L.length * 16 + S.length * 13 + 6);
      n.cx = padX + (n.x + 0.5) * colW; n.cy = padY + (n.y + 0.5) * rowH;
      N[n.id] = n; mx = Math.max(mx, n.x); my = Math.max(my, n.y);
    });
    const W = padX * 2 + (mx + 1) * colW, H = padY * 2 + (my + 1) * rowH + (sp.extraH || 0);
    const svg = s('svg', { role: 'img', 'aria-label': sp.title || 'schéma' });
    const colors = new Set();
    (sp.edges || []).forEach(e => colors.add(col(e.c || 'g')));
    markerDefs(svg, colors);

    (sp.zones || []).forEach(z => {
      const ns = z.nodes.map(i => N[i]).filter(Boolean); if (!ns.length) return;
      const pad = z.pad || 20, c = col(z.c || 'w');
      const x1 = Math.min(...ns.map(n => n.cx - n.w / 2)) - pad, x2 = Math.max(...ns.map(n => n.cx + n.w / 2)) + pad;
      const y1 = Math.min(...ns.map(n => n.cy - n.h / 2)) - pad - 14, y2 = Math.max(...ns.map(n => n.cy + n.h / 2)) + pad;
      svg.append(s('rect', { x: x1, y: y1, width: x2 - x1, height: y2 - y1, rx: 12, fill: c, 'fill-opacity': 0.04, stroke: c, 'stroke-opacity': 0.55, 'stroke-dasharray': '6 5' }));
      if (z.label) svg.append(s('text', { x: x1 + 12, y: y1 + 16, fill: c, 'font-size': 11, 'font-weight': 700, 'letter-spacing': '.08em' }, z.label.toUpperCase()));
    });

    (sp.edges || []).forEach(e => {
      const a = N[e.from], b = N[e.to]; if (!a || !b) return;
      const c = col(e.c || 'g'), off = e.offset || 0;
      const dx = b.cx - a.cx, dy = b.cy - a.cy;
      const horiz = Math.abs(dx) * a.h >= Math.abs(dy) * a.w;
      let p1, p2;
      if (horiz) { const sx = Math.sign(dx) || 1; p1 = [a.cx + sx * a.w / 2, a.cy + off]; p2 = [b.cx - sx * b.w / 2, b.cy + off]; }
      else { const sy = Math.sign(dy) || 1; p1 = [a.cx + off, a.cy + sy * a.h / 2]; p2 = [b.cx + off, b.cy - sy * b.h / 2]; }
      const line = s('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: c, 'stroke-width': 2, 'marker-end': mid(c), 'marker-start': e.bi ? mid(c) : null, class: 'edge' + (e.anim ? ' anim' : '') + (e.dashed ? ' dashed' : '') });
      svg.append(line);
      if (e.label) {
        const L = lines(e.label), tx = (p1[0] + p2[0]) / 2, ty = (p1[1] + p2[1]) / 2;
        const w = Math.max(...L.map(l => l.length)) * 6.7 + 14, hh = L.length * 14 + 6;
        svg.append(s('rect', { x: tx - w / 2, y: ty - hh / 2, width: w, height: hh, rx: 4, fill: '#05090c', stroke: c, 'stroke-opacity': 0.5 }));
        L.forEach((l, i) => svg.append(s('text', { x: tx, y: ty - hh / 2 + 15 + i * 14 - 3, 'text-anchor': 'middle', fill: c, 'font-size': 11 }, l)));
      }
    });

    sp.nodes.forEach(n => {
      const c = col(n.c || 'g'), x = n.cx - n.w / 2, y = n.cy - n.h / 2;
      const g = s('g', { class: 'node' });
      g.append(s('rect', { x, y, width: n.w, height: n.h, rx: 9, fill: c, 'fill-opacity': 0.09, stroke: c, 'stroke-width': 1.6 }));
      const L = lines(n.label), S = n.sub ? lines(n.sub) : [];
      const tx = n.icon ? n.cx + 12 : n.cx;
      const totalH = L.length * 16 + S.length * 13;
      let ty = n.cy - totalH / 2 + 12;
      L.forEach(l => { g.append(s('text', { x: tx, y: ty, 'text-anchor': 'middle', fill: '#e9fff6', 'font-size': 13, 'font-weight': 700 }, l)); ty += 16; });
      S.forEach(l => { g.append(s('text', { x: tx, y: ty - 1, 'text-anchor': 'middle', fill: '#8fa9b2', 'font-size': 11 }, l)); ty += 13; });
      if (n.icon) g.append(icon(n.icon, x + 10, n.cy - 10, c));
      if (n.badge != null) { g.append(s('circle', { cx: x + n.w - 2, cy: y + 2, r: 10, fill: c })); g.append(s('text', { x: x + n.w - 2, y: y + 6, 'text-anchor': 'middle', fill: '#021008', 'font-size': 11, 'font-weight': 800 }, n.badge)); }
      svg.append(g);
    });
    return wrapSvg(svg, W, H, sp.minW);
  }

  /* ---------- SEQUENCE ---------- */
  function sequence(sp) {
    const actors = sp.actors.map((a, i) => typeof a === 'string' ? { id: a, label: a } : a);
    actors.forEach((a, i) => { a.c = a.c || PAL[i % PAL.length]; });
    const idx = k => { const i = actors.findIndex(a => a.id === k || a.label === k); return i < 0 ? +k : i; };
    const gap = sp.gap || 280, minW0 = sp.width || 760;
    const W = Math.max(minW0, 160 + (actors.length - 1) * gap), padX = (W - (actors.length - 1) * gap) / 2;
    const xs = actors.map((a, i) => padX + i * gap);
    const svg = s('svg', { role: 'img', 'aria-label': sp.title || 'séquence' });
    markerDefs(svg, new Set([...Object.values(COL), ...(sp.steps || []).map(m => col(m.c))]));
    const body = s('g'); let y = 78, n = 0;
    (sp.steps || []).forEach(m => {
      if (m.note) {
        const L = lines(m.note), w = Math.max(...L.map(l => l.length)) * 6.9 + 30, hh = L.length * 15 + 16, c = col(m.c || 'a');
        let cx = xs[idx(m.at)];
        if (m.span) cx = (xs[idx(m.span[0])] + xs[idx(m.span[1])]) / 2;
        cx = Math.min(Math.max(cx, w / 2 + 8), W - w / 2 - 8);
        body.append(s('rect', { x: cx - w / 2, y: y - 8, width: w, height: hh, rx: 7, fill: c, 'fill-opacity': 0.1, stroke: c, 'stroke-dasharray': '4 3' }));
        L.forEach((l, i) => body.append(s('text', { x: cx, y: y + 8 + i * 15, 'text-anchor': 'middle', fill: '#e6fff5', 'font-size': 12 }, l)));
        y += hh + 22; return;
      }
      const a = idx(m.from), b = idx(m.to), dir = Math.sign(xs[b] - xs[a]) || 1, c = col(m.c || (dir > 0 ? 'c' : 'g'));
      n++;
      body.append(s('line', { x1: xs[a] + dir * 4, y1: y, x2: xs[b] - dir * 4, y2: y, stroke: c, 'stroke-width': 2, 'marker-end': mid(c), 'stroke-dasharray': m.dashed ? '6 5' : null, class: m.anim ? 'edge anim' : '' }));
      const cxm = (xs[a] + xs[b]) / 2;
      body.append(s('text', { x: cxm, y: y - 9, 'text-anchor': 'middle', fill: '#e9fff6', 'font-size': 12.5, 'font-weight': 700 }, m.text));
      if (m.sub) body.append(s('text', { x: cxm, y: y + 17, 'text-anchor': 'middle', fill: '#8fa9b2', 'font-size': 11 }, m.sub));
      if (sp.numbered !== false) {
        body.append(s('circle', { cx: xs[a] + dir * 20, cy: y, r: 9, fill: c }));
        body.append(s('text', { x: xs[a] + dir * 20, y: y + 4, 'text-anchor': 'middle', fill: '#021008', 'font-size': 11, 'font-weight': 800 }, n));
      }
      y += m.sub ? 56 : 48;
    });
    const H = y + 14;
    actors.forEach((a, i) => {
      const c = col(a.c), w = Math.max(120, (a.label.length) * 8 + 30);
      svg.append(s('line', { x1: xs[i], y1: 48, x2: xs[i], y2: H - 6, stroke: c, 'stroke-opacity': 0.4, 'stroke-dasharray': '5 5' }));
      svg.append(s('rect', { x: xs[i] - w / 2, y: 8, width: w, height: 38, rx: 9, fill: c, 'fill-opacity': 0.14, stroke: c, 'stroke-width': 1.6 }));
      svg.append(s('text', { x: xs[i], y: 32, 'text-anchor': 'middle', fill: '#fff', 'font-size': 13, 'font-weight': 700 }, a.label));
      if (a.icon) svg.append(icon(a.icon, xs[i] - w / 2 + 8, 17, c, 18));
    });
    svg.append(body);
    return wrapSvg(svg, W, H, sp.minW);
  }

  /* ---------- HUB : un centre + des branches ---------- */
  function hub(sp) {
    const W = 780, H = sp.h || 440, cx = W / 2, cy = H / 2, rx = 285, ry = (H / 2) - 48;
    const svg = s('svg', { role: 'img', 'aria-label': sp.title || 'hub' });
    const sp_ = sp.spokes, n = sp_.length;
    const cc = col(sp.c || 'g');
    sp_.forEach((o, i) => {
      const a = (-90 + (360 / n) * i + (sp.rot || 0)) * Math.PI / 180;
      o._x = cx + Math.cos(a) * rx; o._y = cy + Math.sin(a) * ry; o._c = col(o.c || PAL[i % PAL.length]);
      svg.append(s('line', { x1: cx, y1: cy, x2: o._x, y2: o._y, stroke: o._c, 'stroke-width': 1.6, 'stroke-opacity': 0.7, class: 'edge anim' }));
    });
    sp_.forEach(o => {
      const w = Math.max(150, Math.max(...lines(o.label).map(l => l.length), ...(o.sub ? lines(o.sub) : ['']).map(l => l.length * 0.9)) * 7.4 + 30), hh = o.sub ? 52 : 40;
      svg.append(s('rect', { x: o._x - w / 2, y: o._y - hh / 2, width: w, height: hh, rx: 9, fill: '#05090c', stroke: o._c, 'stroke-width': 1.6 }));
      svg.append(s('rect', { x: o._x - w / 2, y: o._y - hh / 2, width: w, height: hh, rx: 9, fill: o._c, 'fill-opacity': 0.1 }));
      svg.append(s('text', { x: o._x, y: o._y - (o.sub ? 4 : -4), 'text-anchor': 'middle', fill: '#e9fff6', 'font-size': 13, 'font-weight': 700 }, o.label));
      if (o.sub) svg.append(s('text', { x: o._x, y: o._y + 14, 'text-anchor': 'middle', fill: '#8fa9b2', 'font-size': 11 }, o.sub));
    });
    svg.append(s('circle', { cx, cy, r: 70, fill: cc, 'fill-opacity': 0.12, stroke: cc, 'stroke-width': 2.2 }));
    svg.append(s('circle', { cx, cy, r: 80, fill: 'none', stroke: cc, 'stroke-opacity': 0.35, 'stroke-dasharray': '3 5' }));
    const L = lines(sp.center); L.forEach((l, i) => svg.append(s('text', { x: cx, y: cy + 5 + (i - (L.length - 1) / 2) * 17, 'text-anchor': 'middle', fill: '#fff', 'font-size': 15, 'font-weight': 800 }, l)));
    return wrapSvg(svg, W, H, sp.minW || 640);
  }

  /* ---------- HTML : tiles / stack / matrix / bars / steps ---------- */
  function tiles(sp) {
    const g = h('div', { class: 'tiles', style: sp.cols ? `grid-template-columns:repeat(${sp.cols},minmax(0,1fr))` : '' });
    sp.items.forEach((it, i) => {
      const c = col(it.c || PAL[i % PAL.length]);
      g.append(h('div', { class: 'tile', style: `--c:${c}` },
        it.tag ? h('span', { class: 'tile-tag' }, it.tag) : null,
        it.big ? h('div', { class: 'tile-big' }, it.big) : null,
        it.title ? h('div', { class: 'tile-title' }, it.title) : null,
        it.text ? h('div', { class: 'tile-text', html: it.text }) : null,
        it.extra ? h('div', { class: 'tile-extra', html: it.extra }) : null));
    });
    return g;
  }
  function stack(sp) {
    const wrap = h('div', { class: 'stacks' });
    sp.columns.forEach((c0, ci) => {
      const cc = col(c0.c || PAL[ci % PAL.length]);
      const colEl = h('div', { class: 'stack', style: `--c:${cc}` }, h('div', { class: 'stack-head' }, c0.title), c0.sub ? h('div', { class: 'stack-sub' }, c0.sub) : null);
      c0.layers.forEach(l => {
        if (l.row) colEl.append(h('div', { class: 'layer-row' }, l.row.map(r => h('div', { class: 'layer', style: `--c:${col(r.c || c0.c)}` }, r.label, r.sub ? h('small', null, r.sub) : null))));
        else colEl.append(h('div', { class: 'layer', style: `--c:${col(l.c || c0.c)}` }, l.label, l.sub ? h('small', null, l.sub) : null));
      });
      if (c0.note) colEl.append(h('div', { class: 'stack-note', html: c0.note }));
      wrap.append(colEl);
    });
    return wrap;
  }
  function matrix(sp) {
    const T = h('table', { class: 'matrix' });
    const hx = x => typeof x === 'string' ? { name: x } : x;
    T.append(h('thead', null, h('tr', null, h('th', null, sp.corner || ''),
      sp.head.map(x => { x = hx(x); return h('th', null, x.name, x.sub ? h('small', null, x.sub) : null); }))));
    const tb = h('tbody'); const leg = sp.legend || { c: 'Client', p: 'Fournisseur' };
    sp.rows.forEach(r => {
      tb.append(h('tr', null, h('th', null, r.label), r.cells.map((c, i) => {
        const cls = c === 'c' ? 'mc' : c === 'p' ? 'mp' : 'mo';
        return h('td', { class: cls }, leg[c] || c, r.notes && r.notes[i] ? h('small', null, r.notes[i]) : null);
      })));
    });
    T.append(tb);
    const out = h('div', { class: 'matrix-wrap' }, T);
    out.append(h('div', { class: 'legend' }, Object.keys(leg).map(k => h('span', null, h('i', { class: k === 'c' ? 'mc' : k === 'p' ? 'mp' : 'mo' }), leg[k]))));
    return out;
  }
  function bars(sp) {
    const w = h('div', { class: 'bars' });
    sp.items.forEach((it, i) => {
      const c = col(it.c || PAL[i % PAL.length]), max = it.max || sp.max || 100;
      w.append(h('div', { class: 'bar-row' },
        h('div', { class: 'bar-label' }, it.label),
        h('div', { class: 'bar-track' }, h('div', { class: 'bar-fill', style: `--w:${Math.min(100, it.value / max * 100)}%;--c:${c}` })),
        h('div', { class: 'bar-val', style: `color:${c}` }, it.text || (it.value + (sp.unit || '')))));
    });
    return w;
  }
  function steps(sp) {
    const w = h('ol', { class: 'steps' });
    sp.items.forEach((it, i) => {
      const c = col(it.c || sp.c || PAL[i % PAL.length]);
      w.append(h('li', { style: `--c:${c}` }, h('span', { class: 'step-n' }, i + 1), h('b', null, it.title), it.text ? h('span', { html: it.text }) : null));
    });
    return w;
  }
  function raw(sp) { const d = h('div', { class: 'd-scroll', html: sp.svg }); return d; }

  const R = { flow, sequence, hub, tiles, stack, matrix, bars, steps, svg: raw };

  window.GuideDiagrams = {
    render(sp) {
      const fn = R[sp.type];
      const body = fn ? fn(sp) : h('div', { class: 'warn' }, 'Type de schéma inconnu : ' + sp.type);
      return h('figure', { class: 'diagram d-' + sp.type },
        h('div', { class: 'd-head' }, h('span', null, '▌SCHÉMA'), sp.title ? h('b', null, sp.title) : null),
        body,
        sp.caption ? h('figcaption', { html: sp.caption }) : null);
    },
    COL
  };
})();
