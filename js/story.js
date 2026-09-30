/* Home-page storytelling: count-up numbers, the sticky statement that reveals with scroll,
   and gentle parallax on marked elements. Needs gsap + ScrollTrigger (local, js/vendor). */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = window.gsap && window.ScrollTrigger;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---- Count-up ---- */
  const nums = document.querySelectorAll("[data-count]");
  const fmt = (v, el) => {
    const dec = +(el.dataset.decimals || 0);
    let s = dec ? v.toFixed(dec) : Math.round(v).toString();
    if (el.dataset.comma !== undefined) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (el.dataset.prefix || "") + s + (el.dataset.suffix || "");
  };
  if (reduce || !("IntersectionObserver" in window)) nums.forEach((el) => (el.textContent = fmt(+el.dataset.count, el)));
  else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target, to = +el.dataset.count, from = +(el.dataset.from || 0), dur = 1600, t0 = performance.now();
        const ease = (x) => 1 - Math.pow(1 - x, 4);
        (function tick(now) {
          const k = Math.min((now - t0) / dur, 1);
          el.textContent = fmt(from + (to - from) * ease(k), el);
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach((el) => { el.textContent = fmt(+(el.dataset.from || 0), el); io.observe(el); });
  }

  /* ---- Sticky statement: words sharpen as the section scrolls ---- */
  const pin = document.querySelector(".statement-pin");
  if (pin && hasGsap && !reduce) {
    const words = Array.from(pin.querySelectorAll(".w"));
    ScrollTrigger.create({
      trigger: pin, start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: (st) => {
        const n = Math.floor(st.progress * 1.25 * words.length);
        words.forEach((w, i) => w.classList.toggle("lit", i < n));
      }
    });
  } else if (pin) {
    pin.querySelectorAll(".w").forEach((w) => w.classList.add("lit"));
  }

  /* ---- Parallax: data-parallax="0.15" moves the element 15% of its scroll travel ---- */
  if (hasGsap && !reduce && window.matchMedia("(min-width: 900px)").matches) {
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      const amt = parseFloat(el.dataset.parallax) || 0.12;
      gsap.fromTo(el, { yPercent: -amt * 50 }, { yPercent: amt * 50, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }
})();
