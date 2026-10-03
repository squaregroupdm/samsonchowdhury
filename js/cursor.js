/* Star cursor. A small four-point star follows the real pointer with no delay: its position is
   written straight from each pointer event, nothing is eased or animated continuously.
   Only for devices with a fine pointer and hover (mouse, trackpad); touch devices keep their
   normal behaviour. Over selectable text and form fields the native I-beam shows instead.
   If anything here fails the page keeps the normal cursor, because the "has-star" class that hides
   it is only added once the star is in place. */
(function () {
  "use strict";
  try {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    if (!fine.matches) return;
    const star = document.createElement("div");
    star.className = "star-cursor"; star.setAttribute("aria-hidden", "true");
    star.innerHTML = '<i class="glow"></i><svg viewBox="0 0 24 24"><path d="M12 0c.7 7.2 4.8 11.3 12 12-7.2.7-11.3 4.8-12 12-.7-7.2-4.8-11.3-12-12 7.2-.7 11.3-4.8 12-12z"/></svg>';
    document.body.appendChild(star);
    const root = document.documentElement;
    const INTERACTIVE = "a, button, [role=button], summary, select, .ph, .vcard, .pill";
    let shown = false;
    function classify(target) {
      if (!(target instanceof Element)) return;
      if (target.closest(INTERACTIVE)) { star.classList.add("is-link"); star.classList.remove("is-text"); return; }
      star.classList.remove("is-link");
      // only form fields keep the native text cursor; everywhere else the star stays
      star.classList.toggle("is-text", target.closest("input, textarea, select, [contenteditable]") !== null);
    }
    function move(e) {
      star.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!shown) { shown = true; star.classList.add("is-on"); root.classList.add("has-star"); }
    }
    window.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || e.pointerType === "pen") move(e); }, { passive: true });
    window.addEventListener("pointerover", (e) => classify(e.target), { passive: true });
    window.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") { star.classList.remove("is-on"); root.classList.remove("has-star"); shown = false; } star.classList.add("is-down"); }, { passive: true });
    window.addEventListener("pointerup", () => star.classList.remove("is-down"), { passive: true });
    document.addEventListener("mouseleave", () => star.classList.remove("is-on"));
    document.addEventListener("mouseenter", () => { if (shown) star.classList.add("is-on"); });
    window.addEventListener("blur", () => star.classList.remove("is-on"));
    fine.addEventListener("change", (m) => { if (!m.matches) { star.classList.remove("is-on"); root.classList.remove("has-star"); shown = false; } });
  } catch (e) { document.documentElement.classList.remove("has-star"); }
})();
