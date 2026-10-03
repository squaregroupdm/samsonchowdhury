/* Milestones on the home page: a native horizontal scroller with previous/next buttons and a year
   rail. Vertical scrolling is never captured; the track only moves sideways when asked.
   On narrow screens the cards stack vertically and the controls hide (CSS). No library. */
(function () {
  "use strict";
  const wrap = document.querySelector("[data-timeline]");
  if (!wrap) return;
  const track = wrap.querySelector(".tl-track"), cards = Array.from(wrap.querySelectorAll(".tl-card"));
  const rail = wrap.querySelector(".tl-rail"), fill = wrap.querySelector(".tl-fill"), counter = wrap.querySelector("[data-tl-count]");
  const prev = wrap.querySelector("[data-tl-prev]"), next = wrap.querySelector("[data-tl-next]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = 0, pending = null, settle = 0;

  cards.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = c.dataset.yr; b.dataset.i = i; b.setAttribute("aria-label", "Go to " + c.dataset.yr);
    rail.appendChild(b);
  });
  const dots = Array.from(rail.children);

  function setActive(i) {
    active = i;
    cards.forEach((c, k) => c.classList.toggle("is-active", k === i));
    dots.forEach((d, k) => { d.classList.toggle("is-active", k === i); d.setAttribute("aria-current", k === i ? "true" : "false"); });
    if (counter) counter.textContent = `${String(i + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === cards.length - 1;
  }
  function goTo(i) {
    i = Math.max(0, Math.min(cards.length - 1, i));
    pending = i; // a requested card stays active until the track has stopped moving
    track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    setActive(i);
    clearTimeout(settle); settle = setTimeout(() => { pending = null; }, 2000);
  }
  // which card is nearest the left edge, and how far along the track we are
  let raf = 0;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const max = track.scrollWidth - track.clientWidth;
      if (fill) fill.style.transform = `scaleX(${max > 0 ? track.scrollLeft / max : 0})`;
      if (pending !== null) { // hold the requested card until the track has arrived (or hit its end)
        const target = Math.min(cards[pending].offsetLeft - track.offsetLeft, max);
        if (Math.abs(track.scrollLeft - target) < 2) { pending = null; clearTimeout(settle); }
        return;
      }
      let best = 0, bd = Infinity;
      cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft - track.offsetLeft - track.scrollLeft); if (d < bd) { bd = d; best = i; } });
      if (best !== active) setActive(best);
    });
  }
  track.addEventListener("scroll", onScroll, { passive: true });
  dots.forEach((d) => d.addEventListener("click", () => goTo(+d.dataset.i)));
  prev && prev.addEventListener("click", () => goTo(active - 1));
  next && next.addEventListener("click", () => goTo(active + 1));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(active - 1); }
  });
  setActive(0);
})();
