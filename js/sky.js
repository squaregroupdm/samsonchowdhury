/* Interactive star field behind every page.
   Three depth layers are drawn once into off-screen canvases. They move with the pointer and
   with scroll at different rates (restrained parallax), and the picture is only recomposed when
   the pointer or the page actually moves. A few bright stars twinkle on a separate small canvas
   at a low frame rate, and a faint shooting star crosses every nine to sixteen seconds.
   Under reduced motion: still stars, no parallax, no twinkle, no shooting stars. No library. */
(function () {
  "use strict";
  const host = document.querySelector("[data-sky]");
  if (!host) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const main = document.createElement("canvas"), fx = document.createElement("canvas");
  host.append(main, fx);
  const mctx = main.getContext("2d"), fctx = fx.getContext("2d");
  const LAYERS = [ // density (px² per star), size, pointer amplitude px, scroll speed
    { per: 5200, size: 0.9, amp: 8, speed: 0.02, stars: null },
    { per: 7000, size: 1.25, amp: 18, speed: 0.045, stars: null },
    { per: 16000, size: 1.8, amp: 34, speed: 0.08, stars: null },
  ];
  let w = 0, h = 0, dpr = 1, px = 0, py = 0, sparkles = [], queued = 0;
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    [main, fx].forEach((c) => { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); });
    seed = 7; sparkles = [];
    LAYERS.forEach((L, li) => {
      const pad = L.amp * 2 + 4, lw = w + pad * 2, lh = h + pad * 2; // a little larger than the screen so it can move
      const c = document.createElement("canvas"); c.width = Math.round(lw * dpr); c.height = Math.round(lh * dpr);
      const g = c.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((lw * lh) / L.per);
      for (let i = 0; i < n; i++) {
        const x = rnd() * lw, y = rnd() * lh, r = rnd();
        const size = L.size * (0.5 + rnd() * 0.8), a = 0.2 + rnd() * 0.55;
        g.fillStyle = rnd() < 0.12 ? `rgba(230, 214, 184, ${a})` : `rgba(235, 238, 245, ${a})`;
        g.beginPath(); g.arc(x, y, size, 0, 6.2832); g.fill();
        if (li === 2 && r > 0.93) sparkles.push({ x, y, phase: rnd() * 6.28, rate: 0.6 + rnd() * 1.2, size: size + 0.6 });
        if (r > 0.985) { const gr = g.createRadialGradient(x, y, 0, x, y, 6); gr.addColorStop(0, "rgba(235,238,245,0.3)"); gr.addColorStop(1, "rgba(235,238,245,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 6, 0, 6.2832); g.fill(); }
      }
      L.stars = c; L.pad = pad; L.lh = lh;
    });
    compose();
  }

  // draw the three layers at their current offsets (pointer + scroll)
  function compose() {
    queued = 0;
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.clearRect(0, 0, w, h);
    const sy = reduce ? 0 : window.scrollY || 0;
    LAYERS.forEach((L) => {
      const ox = -L.pad - (reduce ? 0 : px * L.amp), oy0 = -L.pad - (reduce ? 0 : py * L.amp * 0.6);
      const shift = (sy * L.speed) % L.lh; // scroll drifts the layer upward and wraps it
      mctx.drawImage(L.stars, 0, 0, L.stars.width, L.stars.height, ox, oy0 - shift, L.stars.width / dpr, L.lh);
      if (shift > 0) mctx.drawImage(L.stars, 0, 0, L.stars.width, L.stars.height, ox, oy0 - shift + L.lh, L.stars.width / dpr, L.lh);
    });
  }
  const request = () => { if (!queued) queued = requestAnimationFrame(compose); };

  build();
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 120); });
  if (reduce) return;

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("pointermove", (e) => { if (e.pointerType === "touch") return; px = (e.clientX / w) * 2 - 1; py = (e.clientY / h) * 2 - 1; request(); }, { passive: true });

  /* Twinkle at 8 frames a second, plus the occasional shooting star, on the small fx canvas. */
  let shot = null, nextShot = performance.now() + 6000 + Math.random() * 6000;
  function sparkleFrame(now) {
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.clearRect(0, 0, w, h);
    const L = LAYERS[2], ox = -L.pad - px * L.amp, oy = -L.pad - py * L.amp * 0.6 - ((window.scrollY || 0) * L.speed) % L.lh;
    const t = now / 1000;
    for (const s of sparkles) {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.rate + s.phase));
      let y = s.y + oy; if (y < -10) y += L.lh;
      fctx.fillStyle = `rgba(242, 237, 227, ${(a * 0.9).toFixed(3)})`;
      fctx.beginPath(); fctx.arc(s.x + ox, y, s.size * (0.8 + 0.4 * a), 0, 6.2832); fctx.fill();
    }
    if (!shot && now > nextShot) {
      const fromLeft = Math.random() < 0.5;
      shot = { x0: fromLeft ? -40 : w + 40, y0: h * (0.08 + Math.random() * 0.35), dx: (fromLeft ? 1 : -1) * (w * 0.35 + Math.random() * w * 0.2), dy: h * (0.12 + Math.random() * 0.14), t0: now, dur: 900 };
    }
    if (shot) {
      const k = Math.min((now - shot.t0) / shot.dur, 1), a = Math.sin(k * Math.PI), len = 120;
      const x = shot.x0 + shot.dx * k, y = shot.y0 + shot.dy * k, m = Math.hypot(shot.dx, shot.dy), ux = shot.dx / m, uy = shot.dy / m;
      const g = fctx.createLinearGradient(x - ux * len, y - uy * len, x, y);
      g.addColorStop(0, "rgba(235,238,245,0)"); g.addColorStop(1, `rgba(235,238,245,${0.7 * a})`);
      fctx.strokeStyle = g; fctx.lineWidth = 1.2; fctx.lineCap = "round";
      fctx.beginPath(); fctx.moveTo(x - ux * len, y - uy * len); fctx.lineTo(x, y); fctx.stroke();
      if (k >= 1) { shot = null; nextShot = now + 9000 + Math.random() * 7000; }
    }
  }
  function loop() {
    if (!document.hidden) sparkleFrame(performance.now());
    // full frame rate only while a shooting star is in flight, otherwise 8 fps
    setTimeout(() => requestAnimationFrame(loop), shot ? 0 : 125);
  }
  requestAnimationFrame(loop);
})();
