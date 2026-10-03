/* Shared behaviour for every page. Plain JavaScript, no build step, no libraries.
   Scrolling is native. Nothing here intercepts the wheel or touch. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.remove("no-js");

  /* ---- Header: solid once the page has scrolled, current page marked ---- */
  const nav = $(".nav");
  let solid = null;
  function onScrollNav() { const s = window.scrollY > 24; if (s !== solid) { solid = s; nav.classList.toggle("is-solid", s); } }
  window.addEventListener("scroll", onScrollNav, { passive: true }); onScrollNav();
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".nav-inline a, .menu-links a").forEach((a) => {
    if (a.getAttribute("href").split("/").pop() === here) { a.classList.add("is-current"); a.setAttribute("aria-current", "page"); }
  });

  /* ---- Menu (small screens): Escape closes, focus moves in and back out ---- */
  const menuBtn = $(".menu-btn"), menu = $(".menu");
  if (menuBtn && menu) {
    let lastFocus = null;
    const focusables = () => $$("a[href], button:not([disabled])", menu);
    const toggle = (force) => {
      const open = document.body.classList.toggle("menu-open", force);
      menuBtn.setAttribute("aria-expanded", String(open));
      $(".menu-btn .txt").textContent = open ? "Close" : "Menu";
      if (open) { lastFocus = document.activeElement; const f = focusables()[0]; f && f.focus(); }
      else if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    menuBtn.addEventListener("click", () => toggle());
    $$(".menu-links a").forEach((a) => a.addEventListener("click", () => toggle(false)));
    document.addEventListener("keydown", (e) => {
      if (!document.body.classList.contains("menu-open")) return;
      if (e.key === "Escape") { toggle(false); return; }
      if (e.key === "Tab") { // keep focus inside the open menu
        const f = focusables(); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); menuBtn.focus(); }
        else if (!e.shiftKey && document.activeElement === menuBtn) { e.preventDefault(); first.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); menuBtn.focus(); }
      }
    });
    window.matchMedia("(min-width: 1041px)").addEventListener("change", (m) => { if (m.matches && document.body.classList.contains("menu-open")) toggle(false); });
  }

  /* ---- Reveal: a short fade-up the first time something enters the viewport. Anything already
     on screen is shown at once, so content never waits for an animation. ---- */
  function observeNew(container) {
    const els = $$(".reveal:not(.in), .reveal-img:not(.in)", container);
    if (reduce || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const vh = window.innerHeight;
    els.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) el.classList.add("in"); });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });
    els.forEach((el) => { if (!el.classList.contains("in")) io.observe(el); });
  }
  window.observeNew = observeNew;
  observeNew(document);
  // belt and braces: if any reveal is still hidden after a while, show it
  setTimeout(() => { $$(".reveal:not(.in), .reveal-img:not(.in)").forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 1.1) el.classList.add("in"); }); }, 1500);

  /* ---- Quote deck ---- */
  const deck = $("[data-deck]");
  if (deck && window.QUOTES) {
    const list = window.QUOTES;
    let i = 0;
    const cards = list.map((q, k) => {
      const el = document.createElement("article");
      el.className = "qcard panel";
      el.innerHTML = `<blockquote>${q.text}</blockquote><cite>${q.context || ""}${q.id ? ` <a href="quotes.html#${q.id}" class="small" style="margin-left:8px;text-decoration:underline;text-underline-offset:3px">Link</a>` : ""}</cite>`;
      deck.appendChild(el);
      return el;
    });
    const count = $("[data-deck-count]");
    const layout = () => {
      cards.forEach((c, k) => { c.classList.toggle("is-on", k === i); c.setAttribute("aria-hidden", String(k !== i)); });
      if (count) count.textContent = `${i + 1} / ${list.length}`;
    };
    layout();
    $("[data-deck-next]")?.addEventListener("click", () => { i = (i + 1) % list.length; layout(); });
    $("[data-deck-prev]")?.addEventListener("click", () => { i = (i - 1 + list.length) % list.length; layout(); });
  }

  /* ---- Tribute carousel (home) ---- */
  const solo = $("[data-tributes]");
  if (solo && window.TRIBUTES) {
    let i = 0;
    const q = $("blockquote", solo), who = $(".who", solo), count = $("[data-trib-count]");
    const show = () => {
      const t = window.TRIBUTES[i];
      q.textContent = t.quote; who.innerHTML = `<b>${t.name}</b><span>${t.role}</span>`;
      if (count) count.textContent = `${i + 1} / ${window.TRIBUTES.length}`;
    };
    show();
    $("[data-trib-next]")?.addEventListener("click", () => { i = (i + 1) % window.TRIBUTES.length; show(); });
    $("[data-trib-prev]")?.addEventListener("click", () => { i = (i - 1 + window.TRIBUTES.length) % window.TRIBUTES.length; show(); });
  }

  /* ---- News renderers ---- */
  const fmt = (d) => { const x = new Date(d + "T00:00:00"); return isNaN(x) ? d : x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };
  window.fmtDate = fmt;
  window.renderNewsCard = (n) => `<article class="ncard panel reveal" id="${n.id || ""}">
      <div class="meta"><span class="tag">${n.type}</span><time datetime="${n.date}">${fmt(n.date)}</time></div>
      <h3>${n.title}</h3><p>${n.summary}</p>
      <div class="src"><span>${n.source}</span>${n.url ? `<a href="${n.url}" target="_blank" rel="noopener">Original article</a>` : ""}</div>
    </article>`;
  window.renderNewsRow = (n) => `<a class="nrow reveal" href="newsroom.html${n.id ? "#" + n.id : ""}">
      <time class="d" datetime="${n.date}">${fmt(n.date)}</time><h3>${n.title}</h3><span class="s">${n.source}</span>
      <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>`;
  const preview = $("[data-news-preview]");
  if (preview && window.NEWS) {
    const items = [...window.NEWS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
    preview.innerHTML = items.map(window.renderNewsRow).join("");
    observeNew(preview);
  }

  /* ---- Lightbox: keyboard friendly, restores focus and scroll position on close ---- */
  const lb = $(".lightbox");
  if (lb) {
    const frame = $(".lb-media", lb), cap = $(".lb-cap span", lb), pos = $(".lb-cap b", lb), closeBtn = $(".lb-close", lb);
    let items = [], cur = 0, lastFocus = null, savedY = 0;
    const show = () => {
      const it = items[cur];
      frame.innerHTML = it.video
        ? `<video src="${it.src}" controls autoplay playsinline preload="metadata"></video>`
        : `<img src="${it.src}" alt="${it.caption || ""}">`;
      const media = frame.firstElementChild;
      media.addEventListener("error", () => { frame.innerHTML = `<p class="lb-error">This ${it.video ? "film" : "photograph"} could not be loaded right now.</p>`; }, { once: true });
      cap.textContent = it.caption || "";
      pos.textContent = items.length > 1 ? `${cur + 1} / ${items.length}` : "";
      $(".lb-nav.prev", lb).hidden = $(".lb-nav.next", lb).hidden = items.length < 2;
    };
    const close = () => {
      lb.classList.remove("is-open"); frame.innerHTML = "";
      document.body.style.overflow = "";
      window.scrollTo(0, savedY);
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    window.openLightbox = (arr, i) => {
      items = arr; cur = i; lastFocus = document.activeElement; savedY = window.scrollY;
      show(); lb.classList.add("is-open"); document.body.style.overflow = "hidden"; closeBtn.focus();
    };
    closeBtn.addEventListener("click", close);
    $(".lb-nav.prev", lb).addEventListener("click", () => { cur = (cur - 1 + items.length) % items.length; show(); });
    $(".lb-nav.next", lb).addEventListener("click", () => { cur = (cur + 1) % items.length; show(); });
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && items.length > 1) $(".lb-nav.next", lb).click();
      if (e.key === "ArrowLeft" && items.length > 1) $(".lb-nav.prev", lb).click();
      if (e.key === "Tab") { // keep focus inside the viewer
        const f = $$("button:not([hidden]), video", lb); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- Copy buttons (quotes): confirmation is announced as well as shown ---- */
  let live = $("#live");
  if (!live) { live = document.createElement("div"); live.id = "live"; live.className = "sr-only"; live.setAttribute("aria-live", "polite"); document.body.appendChild(live); }
  window.copyText = (text, btn, label) => {
    const done = () => { const was = btn.textContent; btn.textContent = "Copied"; live.textContent = label || "Copied to clipboard"; setTimeout(() => { btn.textContent = was; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => { live.textContent = "Copy failed"; });
    else { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e) {} ta.remove(); }
  };

  /* ---- Any photo that fails to load hides itself and marks its card ---- */
  document.addEventListener("error", (e) => {
    const img = e.target; if (!(img instanceof HTMLImageElement)) return;
    img.classList.add("is-missing");
    const card = img.closest(".tl-card, figure, .fact, .ph, .tribute-solo .img"); if (card) card.classList.add("no-img");
  }, true);

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
