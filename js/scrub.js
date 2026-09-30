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
  const COUNT = 120, frames = new Array(COUNT), src = (i) => `img/seq/f${String(i + 1).padStart(3, "0")}.webp`;
  const canBitmap = "createImageBitmap" in window;
  let current = -1, dpr = Math.min(window.devicePixelRatio || 1, 2), loaded = 0, travel = 1;

  function size() {
    const r = stage.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
    travel = pin ? Math.max(pin.offsetHeight - window.innerHeight, 1) : 1;
    current = -1; update(true);
  }

  function draw(f) {
    // f is a fractional frame index; draw the lower frame and blend the next one on top
    let i = Math.floor(f); const t = f - i;
    while (i > 0 && !frames[i]) i--;
    const a = frames[i], b = frames[i + 1];
    if (!a) return;
    const key = t < 0.02 || !b ? i : f.toFixed(2);
    if (key === current) return;
    current = key;
    const cw = canvas.width, ch = canvas.height, iw = a.width, ih = a.height;
    const s = Math.min(cw / iw, ch / ih) * 0.78;
    const w = iw * s, h = ih * s, x = (cw - w) / 2 + cw * 0.1, y = (ch - h) * 0.5;
    ctx.clearRect(0, 0, cw, ch);
    ctx.globalAlpha = 1; ctx.drawImage(a, x, y, w, h);
    if (b && t > 0.02) { ctx.globalAlpha = t; ctx.drawImage(b, x, y, w, h); ctx.globalAlpha = 1; }
    // dissolve the lower quarter so the shoulders fade into the sky
    const g = ctx.createLinearGradient(0, y + h * 0.72, 0, y + h);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,1)");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = g; ctx.fillRect(x, y + h * 0.72, w, h * 0.28);
    ctx.globalCompositeOperation = "source-over";
  }

  // scroll position: the wheel target when smooth scrolling is on, else the real position
  function scrollPos() {
    const l = window.__lenis;
    return l && typeof l.targetScroll === "number" ? l.targetScroll : (window.scrollY || 0);
  }
  let armed = false;   // becomes true once every frame is decoded; until then the portrait holds on frame 1
  function update(force) {
    const p = Math.min(Math.max(scrollPos() / travel, 0), 1);
    if (force) current = -1;
    if (!armed) { draw(0); return; }
    draw(p * (COUNT - 1));
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

  function arm() { if (armed) return; armed = true; stage.classList.add("is-armed"); update(true); }
  (async () => {
    await load(0);
    stage.classList.add("is-ready"); size();
    if (reduce) return;
    // six parallel lanes so the sequence fills in quickly. Arm once the set is essentially complete,
    // and in any case after 8 seconds, so a single slow or missing file can never freeze the portrait.
    const lanes = 6, timer = setTimeout(arm, 8000);
    await Promise.all(Array.from({ length: lanes }, (_, k) => (async () => {
      for (let i = 1 + k; i < COUNT; i += lanes) { await load(i); if (loaded >= COUNT * 0.9) arm(); }
    })()));
    clearTimeout(timer); arm();
  })();

  if (!reduce) {
    let raf = 0;
    const tick = () => { update(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(tick); });
  }
  window.addEventListener("resize", size);
})();
