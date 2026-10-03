/* Scroll-turned portrait. The hero stays on screen for one extra viewport of scrolling and the
   scroll position chooses the frame: down turns forward, up turns back. Frames are transparent
   WebP files in img/seq/, decoded once into bitmaps. Drawing happens only when the page scrolls,
   never on a timer, and stops entirely once the hero has left the viewport.
   A poster image sits behind the canvas until the first frame is ready. No library. */
(function () {
  "use strict";
  const stage = document.querySelector("[data-scrub]");
  if (!stage) return;
  const canvas = stage.querySelector("canvas"), ctx = canvas.getContext("2d", { alpha: true });
  const pin = document.querySelector(".hero-pin");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TOTAL = 163;
  // On small screens or metered connections, use every second frame: half the bytes, same motion.
  const conn = navigator.connection || {};
  const slow = conn.saveData || /2g|3g/.test(conn.effectiveType || "");
  const light = window.innerWidth < 900 || slow;
  const step = slow ? 4 : light ? 2 : 1;
  const idx = []; for (let i = 0; i < TOTAL; i += step) idx.push(i);
  if (idx[idx.length - 1] !== TOTAL - 1) idx.push(TOTAL - 1);
  const COUNT = idx.length, frames = new Array(COUNT);
  const src = (k) => `img/seq/f${String(idx[k] + 1).padStart(3, "0")}.webp`;
  const canBitmap = "createImageBitmap" in window;
  let current = -1, dpr = Math.min(window.devicePixelRatio || 1, 2), travel = 1, queued = 0;

  function size() {
    const r = stage.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    travel = pin ? Math.max(pin.offsetHeight - window.innerHeight, 1) : 1;
    current = -1; update();
  }

  function draw(f) {
    let i = Math.floor(f); const t = f - i;
    while (i > 0 && !frames[i]) i--;
    const a = frames[i], b = frames[i + 1];
    if (!a) return;
    const key = t < 0.02 || !b ? i : f.toFixed(2);
    if (key === current) return;
    current = key;
    const cw = canvas.width, ch = canvas.height, iw = a.width, ih = a.height;
    const s = Math.min(cw / iw, ch / ih) * 0.88;
    const w = iw * s, h = ih * s, x = (cw - w) / 2 + (light ? -cw * 0.03 : cw * 0.04), y = (ch - h) * 0.52;
    ctx.clearRect(0, 0, cw, ch);
    ctx.globalAlpha = 1; ctx.drawImage(a, x, y, w, h);
    if (b && t > 0.02) { ctx.globalAlpha = t; ctx.drawImage(b, x, y, w, h); ctx.globalAlpha = 1; }
    const g = ctx.createLinearGradient(0, y + h * 0.72, 0, y + h);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,1)");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = g; ctx.fillRect(x, y + h * 0.72, w, h * 0.28);
    ctx.globalCompositeOperation = "source-over";
  }

  // The frame follows the scroll position through a short glide (about a tenth of a second), so
  // the turn reads as one continuous motion rather than a series of steps. The glide loop runs
  // only until it has caught up, then stops.
  let target = 0, shown = 0, gliding = 0;
  function progress() {
    const y = window.scrollY || 0;
    return Math.min(Math.max(y / travel, 0), 1);
  }
  function paint(p) {
    draw(p * (COUNT - 1));
    stage.style.setProperty("--p", p.toFixed(3));
  }
  let last = 0;
  function glide(now) {
    const d = target - shown;
    if (Math.abs(d) < 0.0004) { shown = target; paint(shown); gliding = 0; last = 0; return; }
    const dt = last ? Math.min(now - last, 100) : 16; last = now;
    shown += d * (1 - Math.exp(-dt / 50)); // time-based, so the glide feels the same at any frame rate
    paint(shown);
    gliding = requestAnimationFrame(glide);
  }
  function update() {
    queued = 0;
    const y = window.scrollY || 0;
    if (y > travel + window.innerHeight) { if (gliding) { cancelAnimationFrame(gliding); gliding = 0; } return; } // hero is off screen
    target = progress();
    if (reduce) { shown = target; paint(shown); return; }
    if (!gliding) gliding = requestAnimationFrame(glide);
  }
  function onScroll() { if (!queued) queued = requestAnimationFrame(update); }

  async function load(k) {
    try {
      const img = new Image(); img.decoding = "async"; img.src = src(k);
      await img.decode();
      frames[k] = canBitmap ? await createImageBitmap(img) : img;
    } catch (e) { /* a missing frame is covered by its neighbour */ }
  }

  (async () => {
    await load(0);
    stage.classList.add("is-ready"); size();
    if (reduce) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", size);
    // frames arrive in order, six at a time, so whatever has been scrolled to is always available
    let next = 1;
    await Promise.all(Array.from({ length: 6 }, () => (async () => {
      while (next < COUNT) { const k = next++; await load(k); if (k % 4 === 0) { current = -1; update(); } }
    })()));
    current = -1; update();
  })();
})();
