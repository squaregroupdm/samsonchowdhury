/* Scroll-scrubbed portrait. The hero stays fixed on screen while you scroll; the scroll position
   picks which frame of the sequence to draw. Scroll down: forward. Scroll up: backward.
   Frames are transparent WebP in img/seq/. They are decoded once into GPU-ready bitmaps, and the
   frame index follows the wheel target directly (not the eased page position), so it answers the
   instant you move. No library needed. */
(function () {
  "use strict";
  const stage = document.querySelector("[data-scrub]");
  if (!stage) return;
  const canvas = stage.querySelector("canvas"), ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const pin = document.querySelector(".hero-pin");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COUNT = 163, frames = new Array(COUNT), src = (i) => `img/seq/f${String(i + 1).padStart(3, "0")}.webp`;
  const canBitmap = "createImageBitmap" in window;
  let current = -1, dpr = Math.min(window.devicePixelRatio || 1, 2), loaded = 0, travel = 1;

  function size() {
    const r = stage.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
    travel = pin ? Math.max(pin.offsetHeight - window.innerHeight, 1) : 1;
    current = -1; update(true);
  }

  function draw(i) {
    const img = frames[i];
    if (!img || i === current) return;
    current = i;
    const cw = canvas.width, ch = canvas.height, iw = img.width, ih = img.height;
    const s = Math.min(cw / iw, ch / ih) * 0.88;
    const w = iw * s, h = ih * s, x = (cw - w) / 2 + cw * 0.04, y = (ch - h) * 0.52;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  }

  // scroll position: the wheel target when smooth scrolling is on, else the real position
  function scrollPos() {
    const l = window.__lenis;
    return l && typeof l.targetScroll === "number" ? l.targetScroll : (window.scrollY || 0);
  }
  function update(force) {
    const p = Math.min(Math.max(scrollPos() / travel, 0), 1);
    let i = Math.min(COUNT - 1, Math.round(p * (COUNT - 1)));
    while (i > 0 && !frames[i]) i--;              // nearest frame that has arrived
    if (force) current = -1;
    draw(i);
    stage.style.setProperty("--p", p.toFixed(3));
  }

  async function load(i) {
    try {
      const img = new Image(); img.decoding = "async"; img.src = src(i);
      await img.decode();
      frames[i] = canBitmap ? await createImageBitmap(img) : img;
    } catch (e) { /* skip a missing frame; neighbours cover it */ }
    loaded++;
  }

  (async () => {
    await load(0);
    stage.classList.add("is-ready"); size();
    if (reduce) return;
    // four parallel lanes so the sequence fills in quickly
    const lanes = 4;
    await Promise.all(Array.from({ length: lanes }, (_, k) => (async () => { for (let i = 1 + k; i < COUNT; i += lanes) { await load(i); if (loaded % 6 === 0) update(); } })()));
    update(true);
  })();

  if (!reduce) {
    let raf = 0;
    const tick = () => { update(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(tick); });
  }
  window.addEventListener("resize", size);
})();
