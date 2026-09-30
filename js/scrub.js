/* Scroll-scrubbed portrait. The hero stays fixed on screen while you scroll; the scroll position
   picks which frame of the 89-frame sequence to draw. Scroll down: forward. Scroll up: backward.
   Frames live in img/seq/f001.webp to f089.webp. No library needed. */
(function () {
  "use strict";
  const stage = document.querySelector("[data-scrub]");
  if (!stage) return;
  const canvas = stage.querySelector("canvas"), ctx = canvas.getContext("2d");
  const pin = document.querySelector(".hero-pin");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COUNT = 89, frames = new Array(COUNT), src = (i) => `img/seq/f${String(i + 1).padStart(3, "0")}.webp`;
  let ready = 0, current = -1, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function size() {
    const r = stage.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    canvas.style.width = r.width + "px"; canvas.style.height = r.height + "px";
    current = -1; draw(lastIndex);
  }

  function draw(i) {
    const img = frames[i];
    if (!img || !img.complete || i === current) return;
    current = i;
    const cw = canvas.width, ch = canvas.height, iw = img.naturalWidth, ih = img.naturalHeight;
    // "contain" with the subject anchored to the bottom, so shoulders sit at the bottom edge
    const s = Math.min(cw / iw, ch / ih);
    const w = iw * s * 0.94, h = ih * s * 0.94, x = (cw - w) / 2, y = (ch - h) * 0.72;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  }

  let lastIndex = 0;
  function progress() {
    if (!pin) return 0;
    const r = pin.getBoundingClientRect();
    const travel = pin.offsetHeight - window.innerHeight;
    if (travel <= 0) return 0;
    return Math.min(Math.max(-r.top / travel, 0), 1);
  }
  function update() {
    const p = progress();
    const i = Math.min(COUNT - 1, Math.round(p * (COUNT - 1)));
    lastIndex = i;
    // if that frame is not loaded yet, draw the nearest loaded one behind it
    let j = i; while (j > 0 && !(frames[j] && frames[j].complete)) j--;
    draw(j);
    stage.style.setProperty("--p", p.toFixed(3));
  }

  // load frame 0 first, then the rest in order
  function load(i) {
    return new Promise((res) => {
      const img = new Image(); img.decoding = "async";
      img.onload = img.onerror = () => { ready++; res(); };
      img.src = src(i); frames[i] = img;
    });
  }
  load(0).then(() => {
    stage.classList.add("is-ready"); size(); update();
    if (reduce) { draw(0); return; }
    (async () => { for (let i = 1; i < COUNT; i++) { await load(i); if (i % 8 === 0) update(); } update(); })();
  });

  if (!reduce) {
    let ticking = false;
    const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (window.__lenis) window.__lenis.on("scroll", onScroll);
  }
  window.addEventListener("resize", size);
})();
