/* CYBER//GUIDE — application (routeur, interface, recherche, progression) */
(function () {
  const G = window.GUIDE, CFG = G.config, D = window.GuideDiagrams;
  const COLORS = D.COLORS || D.COL;
  const $ = (q, r = document) => r.querySelector(q);
  const esc = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const strip = html => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (v != null && v !== false) e.setAttribute(k, v);
    }
    kids.flat().forEach(c => { if (c == null || c === false) return; e.append(c.nodeType ? c : document.createTextNode(c)); });
    return e;
  }

  /* ---------------- chargement du contenu ---------------- */
  function loadScript(src) {
    return new Promise(res => {
      const s = document.createElement('script');
      s.src = src; s.onload = res;
      s.onerror = () => { console.warn('[guide] fichier introuvable :', src); res(); };
      document.head.append(s);
    });
  }
  async function loadAll() {
    const M = window.GUIDE_MANIFEST || { modules: [], glossary: [] };
    for (const f of [...M.modules, ...(M.glossary || [])]) await loadScript(f);
    G.modules.sort((a, b) => String(a.num).localeCompare(String(b.num)));
  }

  /* ---------------- données dérivées ---------------- */
  let FLAT = [];            // tous les concepts dans l'ordre
  const BY = {};            // id -> {c, m, i}
  function index() {
    FLAT = []; Object.keys(BY).forEach(k => delete BY[k]);
    G.modules.forEach(m => {
      m.color = COLORS[m.color] || m.color || COLORS.g;
      m.concepts.forEach((c, i) => {
        c.num = `${m.num}.${i + 1}`;
        const entry = { c, m, i }; BY[c.id] = entry; FLAT.push(entry);
      });
    });
  }

  /* ---------------- progression (localStorage) ---------------- */
  const KEY = 'cyberguide.done';
  const store = { get() { try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { return new Set(); } },
    set(s) { try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch (e) { } } };
  let DONE = store.get();
  const toggleDone = id => { DONE.has(id) ? DONE.delete(id) : DONE.add(id); store.set(DONE); render(); };
  const modProgress = m => { const n = m.concepts.length, d = m.concepts.filter(c => DONE.has(c.id)).length; return { n, d, pct: n ? Math.round(d / n * 100) : 0 }; };

  /* ---------------- coloration des exemples ---------------- */
  function hl(line, lang) {
    let t = esc(line);
    if (/^\$ /.test(line)) {
      const rest = esc(line.slice(2))
        .replace(/(&quot;|"[^"]*"|'[^']*')/g, m => `<span class="t-str">${m}</span>`)
        .replace(/(^|\s)(--?[A-Za-z][\w-]*)/g, '$1<span class="t-flag">$2</span>')
        .replace(/^([\w./-]+)/, '<span class="t-cmd">$1</span>');
      return `<span class="t-prompt">$</span> ${rest}`;
    }
    if (/^# /.test(line)) return `<span class="t-comment">${t}</span>`;
    if (/^< /.test(line)) return `<span class="t-out">${esc(line.slice(2))}</span>`;
    if (lang === 'http') {
      let m;
      if ((m = line.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|CONNECT|TRACE)\s+(\S+)\s+(HTTP\/[\d.]+)$/)))
        return `<span class="t-method">${m[1]}</span> <span class="t-path">${esc(m[2])}</span> <span class="t-out">${m[3]}</span>`;
      if ((m = line.match(/^(HTTP\/[\d.]+)\s+(\d{3})(.*)$/))) {
        const cls = m[2][0] === '2' ? 't-ok' : m[2][0] === '4' || m[2][0] === '5' ? 't-bad' : 't-warn';
        return `<span class="t-out">${m[1]}</span> <span class="${cls}">${m[2]}${esc(m[3])}</span>`;
      }
      if ((m = line.match(/^([A-Za-z][\w-]*):(\s?.*)$/))) return `<span class="t-hdr">${m[1]}:</span>${esc(m[2])}`;
    }
    if (lang === 'json') {
      return t.replace(/(&quot;|")([^"]+)(&quot;|")\s*:/g, '<span class="t-hdr">"$2"</span>:')
        .replace(/:\s*"([^"]*)"/g, ': <span class="t-str">"$1"</span>')
        .replace(/\b(true|false|null|\d+)\b/g, '<span class="t-ok">$1</span>');
    }
    return t;
  }
  function example(ex) {
    const lang = ex.lang || 'bash';
    const code = ex.code.replace(/^\n+|\n+$/g, '');
    const pre = h('pre', null, h('code', { html: code.split('\n').map(l => hl(l, lang)).join('\n') }));
    const copyTxt = code.split('\n').filter(l => !/^(# |< )/.test(l)).map(l => l.replace(/^\$ /, '')).join('\n');
    const btn = h('button', { class: 'copy', title: 'Copier', onclick: e => { navigator.clipboard && navigator.clipboard.writeText(copyTxt); e.target.textContent = 'copié ✓'; setTimeout(() => e.target.textContent = 'copier', 1200); } }, 'copier');
    const out = h('div', { class: 'term' },
      h('div', { class: 'term-bar' }, h('i'), h('i'), h('i'), h('span', null, ex.title || lang), btn), pre);
    const wrap = h('div', { class: 'example' }, out);
    if (ex.legend) wrap.append(h('ul', { class: 'legend-list' }, ex.legend.map(l => h('li', null, h('code', null, l[0]), ' ', h('span', { html: l[1] })))));
    if (ex.note) wrap.append(h('p', { class: 'ex-note', html: ex.note }));
    return wrap;
  }

  /* ---------------- sections ---------------- */
  const sec = (n, title, ...kids) => h('section', { class: 'sec' }, h('h2', null, h('b', null, String(n).padStart(2, '0')), ' ' + title), ...kids);

  function conceptView(en) {
    const { c, m } = en, idx = FLAT.indexOf(en);
    const prev = FLAT[idx - 1], next = FLAT[idx + 1];
    const words = [c.summary, ...(c.explain || []), ...(c.keypoints || [])].map(strip).join(' ').split(/\s+/).length;
    const art = h('article', { class: 'concept', style: `--accent:${m.color}` });
    art.append(
      h('div', { class: 'crumb' }, h('a', { href: '#/m/' + m.id }, `MODULE ${m.num} // ${m.title.toUpperCase()}`), ` / §${c.num}`),
      h('h1', null, c.title, h('span', { class: 'cursor' })),
      h('p', { class: 'lead', html: c.summary }),
      h('div', { class: 'meta' }, (c.tags || []).map(t => h('span', { class: 'tag' }, '#' + t)), h('span', { class: 'muted' }, `~${Math.max(1, Math.round(words / 170))} min`), c.added ? h('span', { class: 'muted' }, 'ajouté ' + c.added) : null));
    let n = 1;
    if (c.type === 'glossary') { art.append(glossaryBlock()); }
    const diagrams = c.diagrams || (c.diagram ? [c.diagram] : []);
    if (diagrams.length) art.append(sec(n++, 'SCHÉMA', diagrams.map(d => D.render(d))));
    if (c.explain && c.explain.length) art.append(sec(n++, 'EXPLICATION', c.explain.map(p => h('p', { html: p }))));
    const exs = c.examples || (c.example ? [c.example] : []);
    if (exs.length) art.append(sec(n++, 'EXEMPLE', exs.map(example)));
    if (c.table) art.append(sec(n++, c.table.title || 'TABLEAU', tableEl(c.table)));
    (c.sections || []).forEach(s => art.append(sec(n++, s.title.toUpperCase(), h('div', { class: 'prose', html: s.html }))));
    if (c.keypoints && c.keypoints.length) art.append(sec(n++, 'À RETENIR', h('ul', { class: 'keys' }, c.keypoints.map(k => h('li', { html: k })))));
    if (c.warn) art.append(h('div', { class: 'warn-box' }, h('b', null, '[!] ATTENTION'), h('span', { html: c.warn })));
    if (c.related && c.related.length) art.append(h('div', { class: 'related' }, h('span', null, 'VOIR AUSSI →'), c.related.filter(r => BY[r]).map(r => h('a', { href: '#/c/' + r }, BY[r].c.title))));
    const done = DONE.has(c.id);
    art.append(h('div', { class: 'actions' },
      h('button', { class: 'btn' + (done ? ' on' : ''), onclick: () => toggleDone(c.id) }, done ? '[✓] appris — annuler' : '[ ] marquer comme appris'),
    ));
    art.append(h('nav', { class: 'pn' },
      prev ? h('a', { href: '#/c/' + prev.c.id, class: 'pn-a' }, h('small', null, '← PRÉCÉDENT'), prev.c.title) : h('span'),
      next ? h('a', { href: '#/c/' + next.c.id, class: 'pn-a r' }, h('small', null, 'SUIVANT →'), next.c.title) : h('span')));
    return art;
  }
  function tableEl(t) {
    return h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, t.head.map(x => h('th', null, x)))),
      h('tbody', null, t.rows.map(r => h('tr', null, r.map((c, i) => h('td', { html: c, class: i === 0 ? 'first' : '' })))))));
  }
  function glossaryBlock() {
    const list = [...G.glossary].sort((a, b) => a.term.localeCompare(b.term));
    const box = h('div', { class: 'gloss' });
    const input = h('input', { class: 'gfilter', placeholder: 'filtrer les termes…', 'aria-label': 'filtrer' });
    const ul = h('div', { class: 'gl' });
    const draw = q => {
      ul.innerHTML = '';
      list.filter(g => !q || (g.term + ' ' + g.def).toLowerCase().includes(q)).forEach(g => {
        const link = g.link && BY[g.link];
        ul.append(h('div', { class: 'gi' }, h('dt', null, g.term), h('dd', { html: g.def }), link ? h('a', { href: '#/c/' + g.link }, '→ ' + link.c.title) : null));
      });
      if (!ul.children.length) ul.append(h('p', { class: 'muted' }, 'Aucun terme.'));
    };
    input.addEventListener('input', () => draw(input.value.trim().toLowerCase())); draw('');
    box.append(input, ul); return box;
  }

  /* ---------------- pages ---------------- */
  function homeView() {
    const total = FLAT.length, done = FLAT.filter(e => DONE.has(e.c.id)).length;
    const recent = [...FLAT].filter(e => e.c.added).sort((a, b) => b.c.added.localeCompare(a.c.added)).slice(0, 4);
    const v = h('div', { class: 'home' });
    v.append(
      h('section', { class: 'hero' },
        h('div', { class: 'crumb' }, 'root@guide:~$ ./welcome'),
        h('h1', { class: 'glitch', 'data-t': CFG.siteName }, CFG.siteName),
        h('p', { class: 'typed', id: 'typed' }),
        h('div', { class: 'hero-cta' },
          h('a', { class: 'btn big', href: '#/c/' + (FLAT[0] ? FLAT[0].c.id : '') }, '> commencer le guide'),
          h('button', { class: 'btn big ghost', onclick: openPalette }, '/ rechercher', h('kbd', null, 'Ctrl K')))),
      h('section', { class: 'stats' },
        stat(G.modules.length, 'modules'), stat(total, 'concepts'), stat(done + '/' + total, 'appris'), stat(total ? Math.round(done / total * 100) + '%' : '0%', 'progression')),
      h('h2', { class: 'h2' }, h('b', null, '//'), ' MODULES'),
      h('div', { class: 'mods' }, G.modules.map(m => {
        const p = modProgress(m);
        return h('a', { class: 'mod', href: '#/m/' + m.id, style: `--c:${m.color}` },
          h('div', { class: 'mod-n' }, m.num), h('div', { class: 'mod-t' }, m.title), h('div', { class: 'mod-d' }, m.tagline || ''),
          h('div', { class: 'prog' }, h('i', { style: `width:${p.pct}%` })),
          h('div', { class: 'mod-f' }, `${p.d}/${p.n} concepts`, h('span', null, m.icon || '>_')));
      })),
      recent.length ? h('h2', { class: 'h2' }, h('b', null, '//'), ' AJOUTÉS RÉCEMMENT') : null,
      recent.length ? h('div', { class: 'recent' }, recent.map(e => h('a', { href: '#/c/' + e.c.id, style: `--c:${e.m.color}` }, h('small', null, '§' + e.c.num), e.c.title))) : null);
    setTimeout(() => typeLines($('#typed'), ['$ whoami → un guide vivant de cybersécurité & infra', '$ cat concepts.txt | wc -l → ' + total + ' concepts, chacun avec schéma + exemple', '$ ./add_knowledge.sh → ajoute un fichier dans /content, c\'est tout']), 30);
    return v;
  }
  const stat = (n, l) => h('div', { class: 'stat' }, h('b', null, String(n)), h('span', null, l));
  let typeTimer;
  function typeLines(el, arr) {
    clearTimeout(typeTimer);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = arr.join('\n'); return; }
    let li = 0, ci = 0, out = '';
    (function tick() {
      if (!el.isConnected) return;
      if (li >= arr.length) return;
      out += arr[li][ci] || ''; ci++;
      el.textContent = out + '▌';
      if (ci >= arr[li].length) { out += '\n'; li++; ci = 0; typeTimer = setTimeout(tick, 380); } else typeTimer = setTimeout(tick, 14);
    })();
  }
  function moduleView(m) {
    const p = modProgress(m);
    return h('div', { class: 'modview', style: `--accent:${m.color}` },
      h('div', { class: 'crumb' }, `MODULE ${m.num}`),
      h('h1', null, m.title, h('span', { class: 'cursor' })),
      h('p', { class: 'lead' }, m.tagline || ''),
      h('div', { class: 'prog wide' }, h('i', { style: `width:${p.pct}%` })), h('p', { class: 'muted' }, `${p.d}/${p.n} concepts appris`),
      h('div', { class: 'clist' }, m.concepts.map(c => h('a', { href: '#/c/' + c.id, class: 'ccard' + (DONE.has(c.id) ? ' done' : '') },
        h('span', { class: 'cn' }, '§' + c.num), h('b', null, c.title), h('span', { class: 'cs', html: c.summary }), DONE.has(c.id) ? h('em', null, '✓') : null))));
  }

  /* ---------------- navigation latérale ---------------- */
  function navView(activeId, activeMod) {
    const nav = $('#nav'); nav.innerHTML = '';
    nav.append(h('a', { href: '#/', class: 'nav-home' + (!activeId && !activeMod ? ' on' : '') }, '~/ accueil'));
    G.modules.forEach(m => {
      const open = activeMod === m.id || (activeId && BY[activeId] && BY[activeId].m.id === m.id);
      const p = modProgress(m);
      nav.append(h('details', { class: 'grp', open: open ? '' : null, style: `--c:${m.color}` },
        h('summary', null, h('span', { class: 'gn' }, m.num), h('span', { class: 'gt' }, m.title), h('span', { class: 'gp' }, p.pct + '%')),
        h('div', { class: 'gl2' }, m.concepts.map(c => h('a', { href: '#/c/' + c.id, class: (c.id === activeId ? 'on ' : '') + (DONE.has(c.id) ? 'dn' : '') }, h('i', null, c.num), c.title)))));
    });
    if (CFG.repoUrl) nav.append(h('a', { class: 'nav-home', href: CFG.repoUrl, target: '_blank', rel: 'noopener' }, '↗ source (GitHub)'));
  }

  /* ---------------- rendu / routeur ---------------- */
  function render() {
    const hash = location.hash.replace(/^#\/?/, ''), [kind, id] = hash.split('/');
    const view = $('#view'); view.innerHTML = '';
    let title = CFG.siteName, activeId = null, activeMod = null;
    if (kind === 'c' && BY[id]) { const e = BY[id]; view.append(conceptView(e)); activeId = id; title = e.c.title + ' — ' + CFG.siteName; }
    else if (kind === 'm' && G.modules.find(m => m.id === id)) { const m = G.modules.find(m => m.id === id); view.append(moduleView(m)); activeMod = id; title = m.title + ' — ' + CFG.siteName; }
    else view.append(homeView());
    document.title = title;
    navView(activeId, activeMod);
    const bar = $('#progress-bar'); if (bar) bar.style.width = (FLAT.length ? DONE.size / FLAT.length * 100 : 0) + '%';
    document.body.classList.remove('nav-open');
    if (!render.first) window.scrollTo(0, 0); render.first = false;
    document.documentElement.style.setProperty('--accent', activeId ? BY[activeId].m.color : COLORS.g);
  }

  /* ---------------- palette de recherche ---------------- */
  let pal, palIn, palList, palSel = 0, palRes = [];
  function buildIndex() {
    return FLAT.map(e => ({ e, hay: [e.c.title, e.c.summary, (e.c.tags || []).join(' '), ...(e.c.explain || []), ...(e.c.keypoints || [])].map(strip).join(' ').toLowerCase() }));
  }
  let IDX = [];
  function openPalette() { pal.classList.add('open'); palIn.value = ''; palSearch(''); setTimeout(() => palIn.focus(), 10); }
  function closePalette() { pal.classList.remove('open'); }
  function palSearch(q) {
    q = q.trim().toLowerCase();
    palRes = (q ? IDX.map(x => { const t = x.e.c.title.toLowerCase(); let sc = 0; q.split(/\s+/).forEach(w => { if (t.includes(w)) sc += 5; if (x.hay.includes(w)) sc += 1; else sc -= 100; }); return { x, sc }; }).filter(r => r.sc > 0).sort((a, b) => b.sc - a.sc).map(r => r.x) : IDX).slice(0, 14);
    palSel = 0; palDraw();
  }
  function palDraw() {
    palList.innerHTML = '';
    palRes.forEach((x, i) => palList.append(h('a', { href: '#/c/' + x.e.c.id, class: i === palSel ? 'sel' : '', style: `--c:${x.e.m.color}`, onclick: closePalette }, h('i', null, '§' + x.e.c.num), h('b', null, x.e.c.title), h('span', null, strip(x.e.c.summary).slice(0, 80)))));
    if (!palRes.length) palList.append(h('p', { class: 'muted pad' }, 'Aucun résultat. Ajoute ce savoir dans /content 😉'));
  }
  function initPalette() {
    pal = h('div', { id: 'palette', onclick: e => { if (e.target === pal) closePalette(); } },
      h('div', { class: 'pal-box' }, h('div', { class: 'pal-in' }, h('span', null, '>'), palIn = h('input', { placeholder: 'rechercher un concept (ex: dns, cookie, iaas)…', autocomplete: 'off', spellcheck: 'false' })), palList = h('div', { class: 'pal-list' }), h('div', { class: 'pal-foot' }, '↑↓ naviguer · ↵ ouvrir · esc fermer')));
    document.body.append(pal);
    palIn.addEventListener('input', () => palSearch(palIn.value));
    palIn.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { palSel = Math.min(palRes.length - 1, palSel + 1); palDraw(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { palSel = Math.max(0, palSel - 1); palDraw(); e.preventDefault(); }
      else if (e.key === 'Enter' && palRes[palSel]) { location.hash = '#/c/' + palRes[palSel].e.c.id; closePalette(); }
      else if (e.key === 'Escape') closePalette();
    });
  }

  /* ---------------- fond "matrix" ---------------- */
  function rain() {
    const cv = $('#rain'); if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d'); let cols, drops, fs = 15;
    const chars = '01アイウエオカキクケコサシスセソ{}[]<>/\\$#%&=+*:;'.split('');
    const size = () => { cv.width = innerWidth; cv.height = innerHeight; cols = Math.ceil(cv.width / fs); drops = Array.from({ length: cols }, () => Math.random() * -50); };
    size(); addEventListener('resize', size);
    let last = 0;
    (function frame(t) {
      requestAnimationFrame(frame);
      if (document.hidden || t - last < 60) return; last = t;
      ctx.fillStyle = 'rgba(3,6,8,.12)'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#00ff9c'; ctx.font = fs + 'px monospace';
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, y * fs);
        drops[i] = y * fs > cv.height && Math.random() > .975 ? 0 : y + 1;
      });
    })(0);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    const el = $('#boot'); if (!el) return Promise.resolve();
    if (!CFG.bootAnimation || sessionStorage.getItem('cyberguide.booted') || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.remove(); return Promise.resolve(); }
    sessionStorage.setItem('cyberguide.booted', '1');
    const lines = ['[  OK  ] mounting /knowledge', `[  OK  ] loading ${G.modules.length} modules · ${FLAT.length} concepts`, '[  OK  ] compiling diagrams engine', '[  OK  ] starting guide daemon', 'root@guide:~$ ./start'];
    el.classList.add('on'); const pre = h('pre'); el.append(pre);
    return new Promise(res => {
      let i = 0; const end = () => { el.classList.add('off'); setTimeout(() => { el.remove(); res(); }, 350); };
      el.addEventListener('click', end, { once: true }); addEventListener('keydown', end, { once: true });
      (function step() { if (!el.isConnected) return; if (i >= lines.length) return setTimeout(end, 250); pre.textContent += lines[i++] + '\n'; setTimeout(step, 170); })();
    });
  }

  /* ---------------- init ---------------- */
  async function init() {
    document.title = CFG.siteName;
    $('#brand-name').textContent = CFG.siteName;
    $('#foot').innerHTML = `${esc(CFG.siteName)} · ${esc(CFG.author || '')} · <span class="muted">ctrl+k recherche · ←/→ navigation</span>`;
    await loadAll(); index(); IDX = buildIndex(); initPalette(); rain();
    render.first = true;
    window.addEventListener('hashchange', render);
    $('#menu').addEventListener('click', () => document.body.classList.toggle('nav-open'));
    $('#search-btn').addEventListener('click', openPalette);
    addEventListener('keydown', e => {
      const typing = /INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '');
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.classList.contains('open') ? closePalette() : openPalette(); }
      else if (e.key === '/' && !typing) { e.preventDefault(); openPalette(); }
      else if (e.key === 'Escape') closePalette();
      else if (!typing && !pal.classList.contains('open') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const m = location.hash.match(/#\/c\/(.+)/); if (!m || !BY[m[1]]) return;
        const t = FLAT[FLAT.indexOf(BY[m[1]]) + (e.key === 'ArrowRight' ? 1 : -1)]; if (t) location.hash = '#/c/' + t.c.id;
      }
    });
    await boot(); render();
  }
  init();
})();
