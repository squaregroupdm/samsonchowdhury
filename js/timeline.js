/* Timeline: a pinned section. Vertical scrolling moves the track sideways; a progress line fills
   as you go; the card nearest the centre lights up; the year rail lets you jump.
   On narrow screens it becomes a native horizontal scroller (no pinning).
   Libraries: js/vendor/gsap.min.js, js/vendor/ScrollTrigger.min.js (local). */
(function () {
  "use strict";
  const wrap = document.querySelector("[data-timeline]");
  if (!wrap) return;
  const track = wrap.querySelector(".tl-track"), cards = Array.from(wrap.querySelectorAll(".tl-card"));
  const rail = wrap.querySelector(".tl-rail"), fill = wrap.querySelector(".tl-fill"), counter = wrap.querySelector("[data-tl-count]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // year rail
  cards.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = c.dataset.yr; b.dataset.i = i; b.setAttribute("aria-label", "Go to " + c.dataset.yr);
    rail.appendChild(b);
  });
  const dots = Array.from(rail.children);

  function setActive(i) {
    cards.forEach((c, k) => c.classList.toggle("is-active", k === i));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
    if (counter) counter.textContent = `${String(i + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
  }

  const wide = window.matchMedia("(min-width: 900px)").matches;
  if (!wide || reduce || !window.gsap || !window.ScrollTrigger) {
    // simple mode: native horizontal scroll with snap
    wrap.classList.add("is-simple");
    const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setActive(cards.indexOf(e.target)); }); }, { root: track, threshold: 0.6 });
    cards.forEach((c) => io.observe(c));
    dots.forEach((d) => d.addEventListener("click", () => cards[+d.dataset.i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })));
    setActive(0);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.__lenis) { window.__lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add((t) => window.__lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }

  const distance = () => track.scrollWidth - wrap.clientWidth + parseFloat(getComputedStyle(wrap).paddingLeft) * 2;
  const tween = gsap.to(track, {
    x: () => -distance(), ease: "none",
    scrollTrigger: {
      trigger: wrap, start: "top top", end: () => "+=" + distance() * 1.15, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (st) => {
        fill.style.transform = `scaleX(${st.progress})`;
        const centre = wrap.clientWidth / 2;
        let best = 0, bd = Infinity;
        cards.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - centre); if (d < bd) { bd = d; best = i; } });
        setActive(best);
      }
    }
  });
  dots.forEach((d) => d.addEventListener("click", () => {
    const i = +d.dataset.i, st = tween.scrollTrigger;
    const target = st.start + (st.end - st.start) * (i / Math.max(cards.length - 1, 1));
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.2 }); else window.scrollTo({ top: target, behavior: "smooth" });
  }));
  setActive(0);
})();
