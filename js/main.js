/* Shared behaviour for every page. Plain JavaScript, no build step. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Smooth scroll (Lenis, optional). If the library fails to load, native scroll is used. ---- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.14, smoothWheel: true });
    window.__lenis = lenis;
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.documentElement.classList.add("lenis", "lenis-smooth");
    // in-page anchor links go through Lenis so the easing matches
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute("href") === "#") return;
      const target = $(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -100 });
    });
  }

  /* ---- Signature draws itself once per visit ---- */
  try {
    if (!sessionStorage.getItem("shc-sig")) { $(".brand")?.classList.add("is-first"); sessionStorage.setItem("shc-sig", "1"); }
  } catch {}

  /* ---- Nav: solid after the top of the page, current link, full-screen menu ---- */
  const nav = $(".nav");
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:0;left:0;height:80px;width:1px;pointer-events:none";
  document.body.prepend(sentinel);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => nav.classList.toggle("is-solid", !en.isIntersecting)).observe(sentinel);
  }
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".nav-inline a, .menu-links a").forEach((a) => {
    if (a.getAttribute("href").split("/").pop() === here) a.classList.add("is-current");
  });
  $$(".menu-links li").forEach((li, i) => li.style.setProperty("--i", i));
  const menuBtn = $(".menu-btn");
  if (menuBtn) {
    const toggle = (force) => {
      const open = document.body.classList.toggle("menu-open", force);
      menuBtn.setAttribute("aria-expanded", String(open));
      $(".menu-btn .txt").textContent = open ? "Close" : "Menu";
      if (lenis) open ? lenis.stop() : lenis.start();
      document.body.style.overflow = open ? "hidden" : "";
    };
    menuBtn.addEventListener("click", () => toggle());
    $$(".menu-links a").forEach((a) => a.addEventListener("click", () => toggle(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) toggle(false); });
  }

  /* ---- Scroll reveal ---- */
  function observeNew(container) {
    const els = $$(".reveal, .reveal-img", container);
    if (reduce || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }
  window.observeNew = observeNew;
  observeNew(document);

  /* ---- Statement: words light up as they cross the middle of the viewport ---- */
  $$(".statement p").forEach((p) => {
    const keys = (p.dataset.keys || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
    const words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map((w) => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, "");
      return `<span class="w${keys.includes(clean) ? " key" : ""}">${w}</span>`;
    }).join(" ");
    const spans = $$(".w", p);
    if (reduce || p.closest(".statement-pin")) { if (reduce) spans.forEach((s) => s.classList.add("lit")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = spans.indexOf(en.target);
        setTimeout(() => en.target.classList.add("lit"), Math.min(i * 30, 1000));
        io.unobserve(en.target);
      });
    }, { threshold: 1, rootMargin: "0px 0px -38% 0px" });
    spans.forEach((s) => io.observe(s));
  });

  /* ---- Sticky chapter sequence ---- */
  const seq = $("[data-seq]");
  if (seq) {
    const imgs = $$(".seq-frame img", seq), idx = $$(".seq-index span", seq), chapters = $$(".chapter", seq);
    const activate = (i) => {
      imgs.forEach((im, k) => im.classList.toggle("is-active", k === i));
      idx.forEach((s, k) => s.classList.toggle("is-active", k === i));
    };
    activate(0);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) activate(chapters.indexOf(en.target)); });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      chapters.forEach((c) => io.observe(c));
    }
  }

  /* ---- Quote deck ---- */
  const deck = $("[data-deck]");
  if (deck && window.QUOTES) {
    const list = window.QUOTES;
    let i = 0;
    const cards = list.map((q) => {
      const el = document.createElement("article");
      el.className = "qcard";
      el.innerHTML = `<blockquote>${q.text}</blockquote><cite>${q.context || ""}</cite>`;
      deck.appendChild(el);
      return el;
    });
    const count = $("[data-deck-count]");
    const layout = () => {
      cards.forEach((c, k) => { c.dataset.pos = k === i ? "0" : "hide"; c.setAttribute("aria-hidden", String(k !== i)); });
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
    const q = $("blockquote", solo), who = $(".who", solo), img = $("img", solo);
    const show = () => {
      const t = window.TRIBUTES[i];
      q.style.opacity = 0; who.style.opacity = 0;
      setTimeout(() => {
        q.textContent = t.quote; who.innerHTML = `<b>${t.name}</b><span>${t.role}</span>`;
        if (img && t.img) img.src = t.img;
        q.style.opacity = 1; who.style.opacity = 1;
      }, reduce ? 0 : 260);
    };
    q.style.transition = who.style.transition = "opacity .35s ease";
    show();
    $("[data-trib-next]")?.addEventListener("click", () => { i = (i + 1) % window.TRIBUTES.length; show(); });
    $("[data-trib-prev]")?.addEventListener("click", () => { i = (i - 1 + window.TRIBUTES.length) % window.TRIBUTES.length; show(); });
  }

  /* ---- News renderers ---- */
  const fmt = (d) => { const x = new Date(d + "T00:00:00"); return isNaN(x) ? d : x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };
  window.renderNewsCard = (n) => `<article class="ncard spot reveal">
      <div class="meta"><span class="tag">${n.type}</span><span>${fmt(n.date)}</span></div>
      <h3>${n.title}</h3><p>${n.summary}</p>
      <div class="src">${n.url ? `<a href="${n.url}" target="_blank" rel="noopener">${n.source}</a>` : n.source}</div>
    </article>`;
  window.renderNewsRow = (n) => `<a class="nrow reveal" href="newsroom.html">
      <span class="d">${fmt(n.date)}</span><h3>${n.title}</h3><span class="s">${n.source}</span>
      <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>`;
  const preview = $("[data-news-preview]");
  if (preview && window.NEWS) {
    const items = [...window.NEWS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
    preview.innerHTML = items.map(window.renderNewsRow).join("");
    observeNew(preview);
  }

  /* ---- Photo strip: drag to scroll ---- */
  $$(".strip, .cover").forEach((strip) => {
    let down = false, sx = 0, sl = 0;
    strip.addEventListener("pointerdown", (e) => { down = true; sx = e.clientX; sl = strip.scrollLeft; strip.classList.add("is-dragging"); });
    window.addEventListener("pointerup", () => { down = false; strip.classList.remove("is-dragging"); });
    strip.addEventListener("pointermove", (e) => { if (!down) return; strip.scrollLeft = sl - (e.clientX - sx); });
  });


  /* ---- Cursor light (soft glow that follows the pointer) ---- */
  const light = $(".cursor-light");
  if (light && !reduce && window.matchMedia("(pointer: fine)").matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, on = false;
    window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; if (!on) { on = true; cx = tx; cy = ty; document.body.classList.add("has-cursor"); } }, { passive: true });
    (function loop() { cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12; light.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; requestAnimationFrame(loop); })();
  }

  /* ---- Tilt + spotlight cards ---- */
  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateZ(6px)`;
        el.style.setProperty("--mx", `${px * 100}%`); el.style.setProperty("--my", `${py * 100}%`);
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
    $$(".spot:not(.tilt)").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  }

  /* ---- 3D ring ---- */
  const stage = $("[data-ring]");
  if (stage) {
    const ring = $(".ring", stage), cards = $$(".ring-card", stage), n = cards.length;
    const step = 360 / n;
    const counter = $("[data-ring-count]");
    function geometry() {
      const w = stage.clientWidth;
      const cw = Math.min(340, Math.max(230, w * 0.26)), ch = Math.min(440, Math.max(320, stage.clientHeight * 0.78));
      const radius = Math.round((cw + 40) / 2 / Math.tan(Math.PI / n));
      stage.style.setProperty("--cw", cw + "px"); stage.style.setProperty("--ch", ch + "px");
      stage.style.setProperty("--step", step + "deg"); stage.style.setProperty("--radius", radius + "px");
    }
    geometry(); window.addEventListener("resize", geometry);
    cards.forEach((c, i) => c.style.setProperty("--i", i));
    let rot = 0, active = 0;
    function apply(snap) {
      if (snap) { active = ((Math.round(-rot / step) % n) + n) % n; rot = -active * step + Math.round((rot + active * step) / 360) * 360; }
      ring.style.setProperty("--rot", rot + "deg");
      const near = ((Math.round(-rot / step) % n) + n) % n;
      cards.forEach((c, i) => c.classList.toggle("is-active", i === near));
      if (counter) counter.textContent = `${String(near + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
    }
    apply(true);
    let down = false, sx = 0, start = 0;
    stage.addEventListener("pointerdown", (e) => { down = true; sx = e.clientX; start = rot; stage.classList.add("is-dragging"); stage.setPointerCapture(e.pointerId); });
    stage.addEventListener("pointermove", (e) => { if (!down) return; rot = start + (e.clientX - sx) * 0.25; apply(false); });
    const up = () => { if (!down) return; down = false; stage.classList.remove("is-dragging"); apply(true); };
    stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    $("[data-ring-next]")?.addEventListener("click", () => { rot -= step; apply(true); });
    $("[data-ring-prev]")?.addEventListener("click", () => { rot += step; apply(true); });
    cards.forEach((c, i) => c.addEventListener("click", () => { if (Math.abs(rot - start) > 4 && down) return; const near = ((Math.round(-rot / step) % n) + n) % n; if (i !== near) { let d = i - near; if (d > n / 2) d -= n; if (d < -n / 2) d += n; rot -= d * step; apply(true); } }));
    if (!reduce) {
      let idle;
      const auto = () => { idle = setInterval(() => { if (!down && document.visibilityState === "visible") { rot -= step; apply(true); } }, 5200); };
      auto();
      stage.addEventListener("pointerdown", () => { clearInterval(idle); });
    }
  }

  /* ---- Lightbox ---- */
  const lb = $(".lightbox");
  if (lb) {
    const frame = $(".lb-media", lb), cap = $(".lb-cap span", lb), pos = $(".lb-cap b", lb);
    let items = [], cur = 0;
    const show = () => {
      const it = items[cur];
      frame.innerHTML = it.video ? `<video src="${it.src}" controls autoplay playsinline></video>` : `<img src="${it.src}" alt="${it.caption || ""}">`;
      cap.textContent = it.caption || "";
      pos.textContent = items.length > 1 ? `${cur + 1} / ${items.length}` : "";
    };
    const close = () => { lb.classList.remove("is-open"); frame.innerHTML = ""; document.body.style.overflow = ""; lenis && lenis.start(); };
    window.openLightbox = (arr, i) => { items = arr; cur = i; show(); lb.classList.add("is-open"); document.body.style.overflow = "hidden"; lenis && lenis.stop(); };
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-nav.prev", lb).addEventListener("click", () => { cur = (cur - 1 + items.length) % items.length; show(); });
    $(".lb-nav.next", lb).addEventListener("click", () => { cur = (cur + 1) % items.length; show(); });
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") $(".lb-nav.next", lb).click();
      if (e.key === "ArrowLeft") $(".lb-nav.prev", lb).click();
    });
  }

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
