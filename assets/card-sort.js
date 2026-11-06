/* TomiUX card sort, Extra Credit drawer.
   Ported from the standalone prototype. Scoped CSS lives in card-sort.css. */
(function () {
if (!document.getElementById('screen-sort')) return;

/* ============================================================
   STUDY DATA: Stacy Tomasi, UX 60501 Assignment 7 & 8
   Everything the game scores against lives here.
   `confirmed: false` = count not yet pulled from Lyssna; the UI
   deliberately shows no number for those.
   ============================================================ */
const STUDY = {
  participants: 9,
  // The real study used 20 cards (Flavor 8, Mood 7, Barware 5). This plays a
  // 4-card subset of each to keep it short. Keep `fullDeck` honest: the copy
  // uses it whenever it describes the study rather than the player's round.
  fullDeck: 20,
  categories: [
    { id: 'flavor',  label: 'Flavor',  cards: ['Sweet','Sour','Smoky','Herbal'] },
    { id: 'mood',    label: 'Mood',    cards: ['Relaxing','Energizing','Celebratory','Adventurous'] },
    { id: 'barware', label: 'Barware', cards: ['Shaker','Strainer','Jigger','Muddler'] }
  ],
  // Closed sort: every card not listed here was placed identically by all 9 participants.
  // Herbal moved once. Lyssna reported 89% / 11%, which at n=9 is 8 participants and 1.
  // That single placement is read as a slip, not a disagreement (see Assignment 8).
  split: { 'Herbal': { flavor: 8, barware: 1 } },
  // Open sort names, grouped by the pile they described.
  // `variants` are spellings counted together, exactly as the Assignment 8 report counts them.
  openNames: {
    flavor:  [ {name:'Taste',   variants:['Taste','Tastes'],   count:4, confirmed:true},
               {name:'Flavors', variants:['Flavors','Flavor'], count:3, confirmed:true} ],
    barware: [ {name:'Tools',   variants:['Tools','Tool'],     count:5, confirmed:true},
               {name:'Drink Tools',        variants:['Drink Tools'],        confirmed:false},
               {name:'Bar Equipment',      variants:['Bar Equipment'],      confirmed:false},
               {name:'Drink Making Items', variants:['Drink Making Items'], confirmed:false} ],
    mood:    [ {name:'Mood',     variants:['Mood'],     confirmed:false},
               {name:'Vibes',    variants:['Vibes'],    confirmed:false},
               {name:'Theme',    variants:['Theme'],    confirmed:false},
               {name:'Emotions', variants:['Emotions'], confirmed:false} ]
  }
};

const PILES = 3;

/* ============================ state ============================ */
const el = id => document.getElementById(id);
const byCat = Object.fromEntries(STUDY.categories.map(c => [c.id, c]));
const ANSWER = {};
STUDY.categories.forEach(c => c.cards.forEach(card => ANSWER[card] = c.id));

let deck = [], queue = [], piles = [], order = [];
let startedAt = 0, tick = null, elapsed = 0;
let mapping = null, matched = 0;

const shuffle = a => a.map(v => [Math.random(), v]).sort((x,y) => x[0]-y[0]).map(p => p[1]);
const fmt = s => Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
const norm = s => s.toLowerCase().trim().replace(/[^a-z\s]/g,'').replace(/s\b/g,'').replace(/\s+/g,' ');

function track(name, params) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
}

/* ============================================================
   SCORING AN OPEN SORT
   The piles have no labels, so "correct" can't mean "in the right
   box". It means the same cards ended up together. We try every
   way of lining the player's 3 piles up against the 3 real
   categories and keep the best fit. That is how open sort
   agreement is actually measured.
   ============================================================ */
function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const out = [];
  arr.forEach((v, i) => {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    permutations(rest).forEach(p => out.push([v].concat(p)));
  });
  return out;
}

function bestFit() {
  const ids = STUDY.categories.map(c => c.id);
  let best = { hits: -1, map: ids };
  permutations(ids).forEach(perm => {
    let hits = 0;
    piles.forEach((pile, i) => pile.forEach(card => { if (ANSWER[card] === perm[i]) hits++; }));
    if (hits > best.hits) best = { hits: hits, map: perm };
  });
  return best;
}

/* ============================ step 1: sort ============================ */
function startGame(isFirstLoad) {
  deck = shuffle(Object.keys(ANSWER));
  queue = deck.slice();
  piles = []; for (let i = 0; i < PILES; i++) piles.push([]);
  order = []; elapsed = 0; startedAt = 0;
  mapping = null; matched = 0; sortReported = false;
  clearInterval(tick); tick = null;
  show('screen-sort');
  renderBins(); updatePhase(!isFirstLoad); recount(); updateHud();
}

/* No visible timer and no speed bonus. This only records how long a sort takes
   so the analytics can answer "is this too long?", and it never affects the result. */
function startClock() {
  startedAt = Date.now();
  clearInterval(tick);
  tick = setInterval(() => { elapsed = Math.round((Date.now() - startedAt) / 1000); }, 1000);
  track('card_sort_start');
}

function renderBins() {
  let html = '';
  for (let i = 0; i < PILES; i++) {
    html += `<section class="bin" data-pile="${i}">
      <button class="bin-head" type="button" aria-label="Put this card in pile ${i+1}, shortcut key ${i+1}">
        <kbd aria-hidden="true">${i+1}</kbd>
        <span class="bin-label">Pile ${i+1}</span>
        <span class="bin-count" data-count="${i}">0</span>
      </button>
      <p class="pile-label" data-plabel="${i}" hidden>In this pile · tap to take back</p>
      <ul class="bin-list" data-list="${i}"></ul>
    </section>`;
  }
  el('bins').innerHTML = html;

  el('bins').querySelectorAll('.bin').forEach(bin => {
    bin.addEventListener('click', e => {
      const chip = e.target.closest('.chip-btn');
      if (chip) { pullBack(chip.dataset.card, +bin.dataset.pile); return; }
      if (e.target.closest('.bin-head')) place(+bin.dataset.pile);
    });
  });
  paintBins();
}

function paintBins() {
  piles.forEach((pile, i) => {
    el('bins').querySelector(`[data-count="${i}"]`).textContent = pile.length;
    el('bins').querySelector(`[data-plabel="${i}"]`).hidden = pile.length === 0;
    el('bins').querySelector(`[data-list="${i}"]`).innerHTML = pile.map(card =>
      `<li><button class="chip-btn" type="button" data-card="${card}"
          aria-label="Take ${card} back out of pile ${i+1}">${card}</button></li>`).join('');
  });
}

function recount() { el('btn-undo').disabled = order.length === 0; }

function renderCard(takeFocus) {
  if (takeFocus === undefined) takeFocus = true;
  const card = el('current-card');
  if (!queue.length) return;
  card.textContent = queue[0];
  card.style.transform = '';
  card.classList.remove('dragging');
  if (takeFocus) card.focus();
}

/* Sorting and naming happen on the same page. When the last card lands, the
   card disappears, a rename field opens under each pile header, and the
   results button appears. Pull a card back out and it all reverses, with
   whatever was typed left intact. */
function updatePhase(takeFocus) {
  const done = !queue.length;
  el('current-card').hidden = done;
  el('how-inline').hidden = done;
  el('btn-lock').hidden = !done;
  el('deck-hint').textContent = done
    ? 'All placed. Check your piles, then see how you did.'
    : 'Which pile does this belong in?';
  el('bins').querySelectorAll('kbd').forEach(k => { k.hidden = done; });

  if (done) { if (takeFocus !== false) el('btn-lock').focus(); }
  else renderCard(takeFocus);
}

function updateHud() {
  el('hud-progress').textContent = (deck.length - queue.length) + ' / ' + deck.length;
}

function place(pileIndex) {
  if (!queue.length) return;
  if (!startedAt) startClock();
  const card = queue.shift();
  piles[pileIndex].push(card);
  order.push({ card: card, pile: pileIndex });
  el('live-sort').textContent = queue.length
    ? `${card} placed in pile ${pileIndex + 1}. ${queue.length} left.`
    : `${card} placed in pile ${pileIndex + 1}. All placed. Name each pile, then see how you did.`;
  paintBins(); recount(); updateHud();
  if (!queue.length) sortComplete();
  updatePhase();
}

function undoLast() {
  if (!order.length) return;
  const last = order[order.length - 1];
  pullBack(last.card, last.pile);
}

function pullBack(card, pileIndex) {
  const pile = piles[pileIndex];
  const at = pile.indexOf(card);
  if (at === -1) return;
  pile.splice(at, 1);
  const o = order.map(x => x.card).lastIndexOf(card);
  if (o !== -1) order.splice(o, 1);
  queue.unshift(card);
  el('live-sort').textContent = `${card} taken back out of pile ${pileIndex + 1}. ${queue.length} left to place.`;
  paintBins(); recount(); updateHud(); updatePhase();
}

/* ============================ naming ============================ */
let sortReported = false;

function sortComplete() {
  clearInterval(tick);
  if (sortReported) return;
  sortReported = true;
  track('card_sort_sorted', { cards_matched: bestFit().hits, seconds: elapsed });
}


/* ============================ results ============================ */
function finish() {
  if (queue.length) return;               // still cards to place
  const fit = bestFit();
  mapping = fit.map;                      // mapping[i] = the real category pile i lines up with
  matched = fit.hits;

  const n = deck.length;
  el('grouping-verdict').innerHTML = matched === n
    ? `<div class="callout mint">
         <p><strong>You grouped all ${n} exactly the way my participants did.</strong></p>
         <p>So did everyone. Across the full ${STUDY.fullDeck} card study, 19 were placed identically by all 9 participants. The 20th, Herbal, moved exactly once, and I read that as a slip rather than a disagreement. Call it a clean sweep.</p>
       </div>`
    : `<div class="callout mint">
         <p><strong>You grouped ${matched} of ${n} the way my participants did.</strong></p>
         <p>For comparison: across the full ${STUDY.fullDeck} card study, 19 were placed identically by all 9 of them. The 20th, Herbal, moved exactly once, and I read that as a slip rather than a disagreement. Agreement on the grouping was close to total.</p>
       </div>`;

  const herbalPile = piles.findIndex(p => p.indexOf('Herbal') > -1);
  const herbalLandedIn = herbalPile > -1 ? mapping[herbalPile] : null;
  el('herbal-beat').innerHTML = herbalLandedIn === 'barware'
    ? `<div class="callout pink">
         <p><strong>You put Herbal with the barware.</strong> So did 1 of my 9 participants, the only card in the study anyone placed differently.</p>
         <p>I think they slipped. There's no obvious reason to file a flavor under equipment, and nothing else in their sort was out of place. But in an unmoderated study you can't tell a misclick from a real disagreement, and that's worth saying out loud instead of counting it as a finding.</p>
       </div>`
    : herbalLandedIn === 'flavor'
      ? `<div class="callout pink">
           <p><strong>You put Herbal with the flavors</strong>, along with 8 of my 9 participants. The ninth filed it with the barware.</p>
           <p>I read that as a slip rather than a disagreement, though an unmoderated sort can't prove it either way.</p>
         </div>`
      : `<div class="callout pink"><p><strong>You put Herbal with the moods.</strong> None of my 9 participants did that. Bold.</p></div>`;

  show('screen-final');
  track('card_sort_complete', { cards_matched: matched, seconds: elapsed });
}

/* ============================ plumbing ============================ */
function show(id) {
  ['screen-sort','screen-final'].forEach(s => el(s).hidden = s !== id);
  const root = document.querySelector('.cs-game');
  if (root) root.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

el('keys-map').innerHTML = Array.from({ length: PILES })
  .map((_, i) => `<span><kbd>${i + 1}</kbd>Pile ${i + 1}</span>`).join(' ');

el('deck-size').textContent = Object.keys(ANSWER).length;

el('btn-undo').addEventListener('click', undoLast);
el('btn-lock').addEventListener('click', finish);
el('btn-again').addEventListener('click', () => startGame(false));

/* ── drag: pointer events, so one code path covers mouse, trackpad and touch ── */
const cur = el('current-card');
let drag = null;

/* Hit test without the dragged card getting in its own way. Done by toggling
   pointer-events for the duration of the test rather than for the whole drag,
   so a card never ends up permanently unclickable if a drag is interrupted. */
const binAt = (x, y) => {
  const prev = cur.style.pointerEvents;
  cur.style.pointerEvents = 'none';
  const node = document.elementFromPoint(x, y);
  cur.style.pointerEvents = prev;
  return node ? node.closest('.bin') : null;
};
const highlight = bin => {
  el('bins').querySelectorAll('.bin').forEach(b => b.classList.toggle('over', b === bin));
};

/* The piles can sit below the fold, especially on a phone inside the drawer.
   Without this, you pick a card up, drag to the bottom of the screen and there
   is nowhere to drop it. Dragging near an edge scrolls the container, and the
   card's offset is corrected by however far it scrolled so it stays under
   your finger. */
const EDGE = 100, MAX_SPEED = 11;

function scrollerFor(node) {
  let n = node.parentElement;
  while (n && n !== document.body) {
    const oy = getComputedStyle(n).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight > n.clientHeight + 4) return n;
    n = n.parentElement;
  }
  return null;              // null means scroll the window
}
const scrollTopOf = sc => sc ? sc.scrollTop : (window.scrollY || window.pageYOffset || 0);

function autoScroll() {
  const sc = drag.scroller;
  const view = sc ? sc.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
  const bins = el('bins').getBoundingClientRect();

  // The only reason to scroll is to bring the piles into reach. Once every pile
  // is on screen, stop. That avoids running away past the drop targets, and
  // avoids the opposite trap of freezing as soon as one pile is under the finger.
  const allPilesVisible = bins.top >= view.top && bins.bottom <= view.bottom;
  const pilesTallerThanView = bins.height > (view.bottom - view.top);
  if (allPilesVisible || (pilesTallerThanView && binAt(drag.x, drag.y))) return;

  // ramp with how far into the edge zone you are, so it creeps rather than lurches
  let delta = 0;
  if (drag.y > view.bottom - EDGE)   delta =  Math.min(1, (drag.y - (view.bottom - EDGE)) / EDGE) * MAX_SPEED;
  else if (drag.y < view.top + EDGE) delta = -Math.min(1, ((view.top + EDGE) - drag.y) / EDGE) * MAX_SPEED;
  if (Math.abs(delta) < 0.5) return;

  if (sc) sc.scrollTop += delta; else window.scrollBy(0, delta);
}

function paintDrag() {
  const dx = drag.x - drag.x0;
  const dy = drag.y - drag.y0 + (scrollTopOf(drag.scroller) - drag.scroll0);
  cur.style.transform = `translate(${dx}px, ${dy}px)`;
  highlight(binAt(drag.x, drag.y));
}

function frame() {
  if (!drag || !drag.moved) return;
  autoScroll();
  paintDrag();
  drag.raf = requestAnimationFrame(frame);
}

cur.addEventListener('pointerdown', e => {
  if (!queue.length) return;
  const scroller = scrollerFor(cur);
  drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY,
           moved: false, scroller: scroller, scroll0: scrollTopOf(scroller), raf: null };
  cur.style.transform = '';
  try { cur.setPointerCapture(e.pointerId); } catch (err) {}
});

cur.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.id) return;
  drag.x = e.clientX; drag.y = e.clientY;
  if (!drag.moved) {
    if (Math.abs(e.clientX - drag.x0) < 6 && Math.abs(e.clientY - drag.y0) < 6) return;
    drag.moved = true;
    cur.classList.add('dragging');
    drag.raf = requestAnimationFrame(frame);
  }
  paintDrag();
});

function endDrag(e, cancelled) {
  if (!drag || (e && e.pointerId !== undefined && e.pointerId !== drag.id)) return;
  if (drag.raf) cancelAnimationFrame(drag.raf);
  const target = (!cancelled && drag.moved) ? binAt(drag.x, drag.y) : null;
  cur.classList.remove('dragging');
  cur.style.transform = '';
  cur.style.pointerEvents = '';
  highlight(null);
  drag = null;
  if (target) place(+target.dataset.pile);
}

cur.addEventListener('pointerup', e => endDrag(e, false));
cur.addEventListener('pointercancel', e => endDrag(e, true));
/* belt and braces: if capture is lost or the pointer dies outside the page,
   end the drag anyway rather than leaving a card stranded mid-air */
cur.addEventListener('lostpointercapture', () => { if (drag) endDrag(null, true); });
window.addEventListener('pointerup', e => { if (drag) endDrag(e, false); });
window.addEventListener('blur', () => { if (drag) endDrag(null, true); });

/* ── keyboard: 1 / 2 / 3 to place, Backspace or Cmd+Z to undo ── */
document.addEventListener('keydown', e => {
  if (el('screen-sort').hidden) return;
  // the drawer can be closed while this listener is still attached to the page
  if (!el('screen-sort').offsetParent) return;
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'Backspace' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z')) {
    e.preventDefault(); undoLast(); return;
  }
  const i = ['1','2','3','4','5','6','7','8','9'].indexOf(e.key);
  if (i > -1 && i < PILES) { e.preventDefault(); place(i); }
});

/* go */
startGame(true);

/* The funnel starts when the board is actually on screen, not at the first card.
   Anyone who sees it and never touches it still counts, so the completion rate
   stays honest: view -> start -> sorted -> complete.

   Tied to visibility rather than page load on purpose. Once this lives in a
   homepage drawer the script loads with the page, and counting a view for
   someone who never opened the drawer would quietly inflate the denominator. */
let viewTracked = false;
function trackView() {
  if (viewTracked) return;
  viewTracked = true;
  track('card_sort_view');
}

/* Two ways this gets shown, so two ways of noticing.
   Standalone page: IntersectionObserver when the board scrolls into view.
   Inside a drawer: watch the panel's `hidden` and the dialog's `open`.
   IntersectionObserver alone is not enough, because a <dialog> opened with
   showModal() renders in the top layer and the observer never re-fires. */
(function watchForView() {
  const bins = el('bins');
  const panel = bins.closest('[data-ec-panel], [data-ho-panel]');
  const dlg = bins.closest('dialog');

  const onScreen = () => !(panel && panel.hidden) && !(dlg && !dlg.open);

  if (panel || dlg) {
    if (onScreen()) { trackView(); return; }
    const mo = new MutationObserver(() => {
      if (onScreen()) { trackView(); mo.disconnect(); }
    });
    if (panel) mo.observe(panel, { attributes: true, attributeFilter: ['hidden'] });
    if (dlg) mo.observe(dlg, { attributes: true, attributeFilter: ['open'] });
    return;
  }

  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { trackView(); io.disconnect(); }
    });
    io.observe(bins);
  } else {
    trackView();
  }
})();

})();
