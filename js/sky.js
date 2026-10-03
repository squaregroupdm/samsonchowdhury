/* Star field. Drawn once onto a canvas behind every page, redrawn only on resize.
   Nothing animates continuously: the only motion is a faint shooting star now and then,
   which runs its own short animation and then stops. Honors reduced motion (no shooting stars).
   No library. */
(function () {
  "use strict";
  const host = document.querySelector("[data-sky]");
  if (!host) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const base = document.createElement("canvas"), fx = document.createElement("canvas");
  host.append(base, fx);
  const bctx = base.getContext("2d"), fctx = fx.getContext("2d");
  let w = 0, h = 0, dpr = 1;

  function draw() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    [base, fx].forEach((c) => { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); });
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0); fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx.clearRect(0, 0, w, h);
    // seeded so the sky is the same on every page
    let s = 1234567;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const n = Math.round((w * h) / 2600);
    for (let i = 0; i < n; i++) {
      const x = rnd() * w, y = rnd() * h, r = rnd();
      const size = r < 0.9 ? 0.5 + rnd() * 0.7 : 1.1 + rnd() * 0.9;
      const a = 0.25 + rnd() * 0.6;
      const warm = rnd() < 0.12;
      bctx.fillStyle = warm ? `rgba(230, 214, 184, ${a})` : `rgba(235, 238, 245, ${a})`;
      bctx.beginPath(); bctx.arc(x, y, size, 0, 6.2832); bctx.fill();
      if (r > 0.985) { // a few brighter stars get a soft halo
        const g = bctx.createRadialGradient(x, y, 0, x, y, 6);
        g.addColorStop(0, "rgba(235,238,245,0.35)"); g.addColorStop(1, "rgba(235,238,245,0)");
        bctx.fillStyle = g; bctx.beginPath(); bctx.arc(x, y, 6, 0, 6.2832); bctx.fill();
      }
    }
  }
  draw();
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(draw, 120); });

  if (reduce) return;
  // One shooting star every 9 to 16 seconds, 900 ms long. The animation loop only runs while a star is in flight.
  function shoot() {
    const fromLeft = Math.random() < 0.5;
    const x0 = fromLeft ? -40 : w + 40, y0 = h * (0.08 + Math.random() * 0.35);
    const dx = (fromLeft ? 1 : -1) * (w * 0.35 + Math.random() * w * 0.2), dy = h * (0.12 + Math.random() * 0.14);
    const t0 = performance.now(), dur = 900;
    function frame(now) {
      if (document.hidden) { fctx.clearRect(0, 0, w, h); schedule(); return; }
      const k = Math.min((now - t0) / dur, 1), a = Math.sin(k * Math.PI);
      fctx.clearRect(0, 0, w, h);
      const x = x0 + dx * k, y = y0 + dy * k, len = 120;
      const ux = dx / Math.hypot(dx, dy), uy = dy / Math.hypot(dx, dy);
      const g = fctx.createLinearGradient(x - ux * len, y - uy * len, x, y);
      g.addColorStop(0, "rgba(235,238,245,0)"); g.addColorStop(1, `rgba(235,238,245,${0.7 * a})`);
      fctx.strokeStyle = g; fctx.lineWidth = 1.2; fctx.lineCap = "round";
      fctx.beginPath(); fctx.moveTo(x - ux * len, y - uy * len); fctx.lineTo(x, y); fctx.stroke();
      if (k < 1) requestAnimationFrame(frame); else { fctx.clearRect(0, 0, w, h); schedule(); }
    }
    requestAnimationFrame(frame);
  }
  function schedule() { setTimeout(() => { if (!document.hidden) shoot(); else schedule(); }, 9000 + Math.random() * 7000); }
  schedule();
})();
