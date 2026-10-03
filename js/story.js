/* Home page: count-up for quantities only (never years). Runs once, 700 ms, and the final value
   is already in the markup, so nothing depends on the animation. Off under reduced motion. */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length || reduce || !("IntersectionObserver" in window)) return;
  const fmt = (v, el) => {
    let s = Math.round(v).toString();
    if (el.dataset.comma !== undefined) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (el.dataset.prefix || "") + s + (el.dataset.suffix || "");
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.count, dur = 700, t0 = performance.now();
      const ease = (x) => 1 - Math.pow(1 - x, 3);
      (function tick(now) {
        const k = Math.min((now - t0) / dur, 1);
        el.textContent = fmt(to * ease(k), el);
        if (k < 1) requestAnimationFrame(tick); else el.textContent = fmt(to, el);
      })(t0);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach((el) => io.observe(el));
})();
