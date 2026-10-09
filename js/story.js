/* Home page storytelling.
   1. The story: four chapters inside one sticky stage. The section is tall; as the page scrolls
      through it, the stage stays put and the chapters cross-fade, each with a short hold so it can
      be read. Photographs drift a little (restrained parallax). Everything is driven by the real
      scroll position: no inertia, no catch-up, and nothing runs when the section is off screen.
      On narrow screens and under reduced motion the chapters simply stack (CSS).
   2. Count-up for the one quantity on the page (36,000), once, 700 ms. */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = () => window.matchMedia("(min-width: 900px)").matches;

  /* ---- Story ---- */
  const story = document.querySelector("[data-story]");
  if (story) {
    const chapters = Array.from(story.querySelectorAll(".ch"));
    const nav = Array.from(story.querySelectorAll("[data-go]"));
    const bar = story.querySelector(".story-bar i");
    const N = chapters.length;
    let travel = 1, top = 0, active = -1, queued = 0, on = false;
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const ease = (x) => x * x * (3 - 2 * x); // smoothstep

    function measure() {
      const r = story.getBoundingClientRect();
      top = r.top + window.scrollY;
      travel = Math.max(story.offsetHeight - window.innerHeight, 1);
    }
    function setActive(i) {
      if (i === active) return;
      active = i;
      chapters.forEach((c, k) => c.classList.toggle("is-active", k === i));
      nav.forEach((b, k) => { b.classList.toggle("is-active", k === i); b.setAttribute("aria-current", k === i ? "step" : "false"); });
    }
    function render() {
      queued = 0;
      if (!wide() || reduce) { if (on) { on = false; story.classList.remove("is-live"); chapters.forEach((c) => { c.style.cssText = ""; c.querySelectorAll("img, .ch-copy, .ch-art, figcaption").forEach((el) => { el.style.transform = ""; el.style.opacity = ""; }); }); } return; }
      if (!on) { on = true; story.classList.add("is-live"); measure(); }
      const y = window.scrollY;
      if (y + window.innerHeight < top || y > top + story.offsetHeight) return; // off screen: do nothing
      const p = clamp((y - top) / travel, 0, 1) * (N - 1); // 0 .. N-1, chapter i is centred at p = i
      chapters.forEach((c, i) => {
        const d = p - i, ad = Math.abs(d);
        // photographs cross-dissolve; the text of one chapter is fully gone before the next arrives.
        // Both fades are eased (slow in, slow out) so nothing starts or stops with a jolt.
        const oArt = ease(clamp((0.62 - ad) / 0.26, 0, 1)), oCopy = ease(clamp((0.52 - ad) / 0.2, 0, 1));
        c.style.visibility = oArt > 0 ? "visible" : "hidden";
        c.style.pointerEvents = oCopy > 0.5 ? "auto" : "none";
        const copy = c.querySelector(".ch-copy"), art = c.querySelector(".ch-art"), front = c.querySelector(".ch-front img"), back = c.querySelector(".ch-back");
        copy.style.opacity = oCopy.toFixed(3); art.style.opacity = oArt.toFixed(3);
        const cap = art.querySelector("figcaption"); if (cap) cap.style.opacity = oCopy.toFixed(3);
        copy.style.transform = `translate3d(0, ${(-d * 36).toFixed(1)}px, 0)`;
        front.style.transform = `translate3d(0, ${(-d * 5).toFixed(2)}%, 0) scale(${(1.04 - 0.04 * (1 - clamp(ad, 0, 1))).toFixed(3)})`;
        back.style.transform = `translate3d(${(d * 2).toFixed(2)}%, ${(-d * 9).toFixed(2)}%, 0) scale(1.08)`;
      });
      setActive(Math.round(clamp(p, 0, N - 1)));
      if (bar) bar.style.transform = `scaleX(${(p / Math.max(N - 1, 1)).toFixed(4)})`;
    }
    const onScroll = () => { if (!queued) queued = requestAnimationFrame(render); };
    nav.forEach((b) => b.addEventListener("click", () => {
      const i = +b.dataset.go;
      if (!wide() || reduce) { chapters[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); return; }
      window.scrollTo({ top: Math.round(top + (travel * i) / Math.max(N - 1, 1)), behavior: reduce ? "auto" : "smooth" });
    }));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { measure(); render(); });
    window.addEventListener("load", () => { measure(); render(); });
    measure(); render(); setActive(0);
  }

  /* ---- Count-up ---- */
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
