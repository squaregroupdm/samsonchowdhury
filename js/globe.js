/* News Room: a glass globe tiled with every article in the archive. Drag turns it, a still click
   opens the page as a large glass card, the globe can fill the screen. Below it, the archive as a
   filterable list. Articles come from data/press-data.js (window.PRESS) and data/news-data.js
   (window.NEWS). Page captures are drawn into the panes; articles without one get a typeset
   clipping from the real headline, newspaper and date. No library. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var gwrap = $("gwrap"); if (!gwrap) return;
  var ARTICLES = (window.PRESS || []).concat(window.NEWS || []).map(function (n) {
    return { t: n.title, s: n.source, d: n.date || "", u: n.url || "", x: n.summary || "", l: n.lang || "en", k: n.type || "Coverage", m: n.img || "", f: n.focus || "top", id: n.id };
  });
  if (!ARTICLES.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var IVORY = "242,237,227", GOLD = "212,191,152";
  function fmt(d) {
    if (!d) return "Undated";
    if (d.length === 4) return d;
    return parseInt(d.slice(8), 10) + " " + MONTHS[parseInt(d.slice(5, 7), 10) - 1] + " " + d.slice(0, 4);
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  /* A typeset clipping, for articles with no screen capture */
  function wrapText(c, text, maxW, maxLines) {
    var words = text.split(/\s+/), lines = [], cur = "";
    for (var i = 0; i < words.length; i++) {
      var t = cur ? cur + " " + words[i] : words[i];
      if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = words[i]; if (lines.length === maxLines) break; } else cur = t;
    }
    if (lines.length < maxLines && cur) lines.push(cur);
    else if (lines.length === maxLines) lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,2}$/, "…");
    return lines;
  }
  function typeset(c, x, y, w, h, a) {
    var p = w * 0.07, serif = 'Georgia, "Noto Serif Bengali", "Nirmala UI", serif';
    c.save(); c.translate(x, y);
    var g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#f1ecdf"); g.addColorStop(1, "#e4dccb");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "#191713"; c.textBaseline = "top";
    c.font = "700 " + (h * 0.085) + "px " + serif;
    c.fillText(wrapText(c, a.s, w - 2 * p, 1)[0] || "", p, p);
    var ry = p + h * 0.12;
    c.fillRect(p, ry, w - 2 * p, Math.max(1, h * 0.008)); c.fillRect(p, ry + h * 0.018, w - 2 * p, Math.max(1, h * 0.004));
    var fs = h * (a.l === "bn" ? 0.078 : 0.088);
    c.font = "700 " + fs + "px " + serif;
    var lines = wrapText(c, a.t, w - 2 * p, 4), ly = ry + h * 0.06;
    lines.forEach(function (ln, i) { c.fillText(ln, p, ly + i * fs * (a.l === "bn" ? 1.38 : 1.16)); });
    var ty = ly + lines.length * fs * (a.l === "bn" ? 1.38 : 1.16) + h * 0.03, by = h - p - h * 0.07;
    c.fillStyle = "rgba(25,23,19,0.16)";
    for (var yy = ty; yy < by; yy += h * 0.03) { c.fillRect(p, yy, w * 0.4, Math.max(1, h * 0.007)); c.fillRect(w - p - w * 0.4, yy, w * 0.4, Math.max(1, h * 0.007)); }
    c.fillStyle = "rgba(25,23,19,0.62)"; c.font = (h * 0.045) + "px ui-monospace, Menlo, monospace";
    c.fillText((a.k + "  " + fmt(a.d)).toUpperCase(), p, h - p - h * 0.04);
    c.restore();
  }
  /* A capture fills the pane like a photograph in a frame: scaled to cover it, cropped to the top
     (or the bottom, for a front page whose tribute sits low), never stretched. */
  function paintPage(c, x, y, w, h, t, whole) {
    var im = t.img;
    if (!(im && im.complete && im.naturalWidth)) { typeset(c, x, y, w, h, t.a); return; }
    if (whole) { c.drawImage(im, x, y, w, h); return; }
    var iw = im.naturalWidth, ih = im.naturalHeight, sc = Math.max(w / iw, h / ih), sw = w / sc, sh = h / sc;
    var sx = (iw - sw) / 2, sy = t.a.f === "bottom" ? ih - sh : t.a.f === "middle" ? (ih - sh) / 2 : 0;
    c.drawImage(im, sx, sy, sw, sh, x, y, w, h);
  }

  /* ================= Globe ================= */
  var globe = $("globe"), cv = $("gc"), ctx = cv.getContext("2d"), tip = $("tip");
  var N = ARTICLES.length, DK = 4, ASPECT = 0.75, GAP = 0.16, MARGIN = 0.1;

  function bands(aw) {
    var ah = aw * ASPECT, g = aw * GAP, rows = Math.max(1, Math.floor((Math.PI - ah * 0.9) / (ah + g))), out = [], total = 0;
    for (var i = 0; i < rows; i++) {
      var lat = (i - (rows - 1) / 2) * (ah + g), edge = Math.abs(lat) + ah / 2;
      var n = edge >= Math.PI / 2 ? 0 : Math.floor(2 * Math.PI * Math.cos(edge) / (aw + g));
      if (n > 0) { out.push({ lat: lat, n: n }); total += n; }
    }
    return { rows: out, total: total };
  }
  var lo = 0.04, hi = 1.3;
  for (var it = 0; it < 40; it++) { var mid = (lo + hi) / 2; if (bands(mid).total >= N) lo = mid; else hi = mid; }
  var AW = lo, B = bands(AW), spare = B.total - N, turn = 0;
  while (spare > 0) {
    var bi = 0, bn = -1;
    B.rows.forEach(function (r, i) { var score = r.n + ((i + turn) % 2) * 0.5; if (score > bn) { bn = score; bi = i; } });
    B.rows[bi].n--; spare--; turn++;
  }
  var slots = [];
  B.rows.forEach(function (r, i) { for (var j = 0; j < r.n; j++) slots.push({ lat: r.lat, lon: (j + (i % 2) * 0.5) * 2 * Math.PI / r.n }); });

  var seed = 20120105, order = ARTICLES.map(function (_, i) { return i; });
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  for (var s = order.length - 1; s > 0; s--) { var r2 = Math.floor(rnd() * (s + 1)), tmp = order[s]; order[s] = order[r2]; order[r2] = tmp; }

  var SW = N <= 150 ? 240 : N <= 320 ? 168 : 128, SH = Math.round(SW * ASPECT), SM = Math.round(SW * MARGIN);
  var tiles = slots.map(function (sl, i) {
    var a = ARTICLES[order[i]], cl = Math.cos(sl.lat), sn = Math.sin(sl.lat), co = Math.cos(sl.lon), so = Math.sin(sl.lon);
    var t = { a: a, lat: sl.lat, lon: sl.lon, n: [cl * so, -sn, cl * co], u: [co, 0, -so], d: [sn * so, cl, sn * co], img: null, sp: document.createElement("canvas") };
    t.sp.width = SW + 2 * SM; t.sp.height = SH + 2 * SM;
    a._tile = t;
    return t;
  });

  function bake(t) {
    var c = t.sp.getContext("2d"), w = SW, h = SH, r = SW * 0.045, pad = SW * 0.035;
    c.clearRect(0, 0, t.sp.width, t.sp.height);
    c.save(); c.translate(SM, SM);
    c.save(); c.shadowColor = "rgba(" + GOLD + ",0.75)"; c.shadowBlur = SM * 1.1;
    rrect(c, 0, 0, w, h, r); c.fillStyle = "rgba(" + IVORY + ",0.16)"; c.fill(); c.restore();
    c.save(); rrect(c, pad, pad, w - 2 * pad, h - 2 * pad, r * 0.6); c.clip();
    paintPage(c, pad, pad, w - 2 * pad, h - 2 * pad, t);
    var sh = c.createLinearGradient(0, 0, w * 0.7, h); sh.addColorStop(0, "rgba(255,255,255,0.20)"); sh.addColorStop(0.42, "rgba(255,255,255,0.03)"); sh.addColorStop(1, "rgba(8,12,23,0.10)");
    c.fillStyle = sh; c.fillRect(0, 0, w, h); c.restore();
    var st = c.createLinearGradient(0, 0, w, h); st.addColorStop(0, "rgba(" + IVORY + ",0.85)"); st.addColorStop(0.5, "rgba(" + GOLD + ",0.45)"); st.addColorStop(1, "rgba(" + IVORY + ",0.25)");
    rrect(c, 0.75, 0.75, w - 1.5, h - 1.5, r); c.lineWidth = 1.5; c.strokeStyle = st; c.stroke();
    c.restore();
  }
  tiles.forEach(function (t) {
    bake(t);
    if (t.a.m) { t.img = new Image(); t.img.decoding = "async"; t.img.onload = function () { bake(t); dirty = true; }; t.img.src = t.a.m; }
  });

  var W = 0, H = 0, R = 100, dpr = 1, ry = 0.3, rx = -0.14, vel = 0, target = null, dirty = true;
  var hover = -1, dragging = false, moved = false, inView = true, last = 0, holdUntil = 0, full = false, open = null;
  var AUTO = 0.05, TILT = -0.14, MAXT = 1.05;
  var cosA, sinA, cosB, sinB;
  function rot(v) { var x1 = v[0] * cosA + v[2] * sinA, z1 = -v[0] * sinA + v[2] * cosA; return [x1, v[1] * cosB - z1 * sinB, v[1] * sinB + z1 * cosB]; }

  function size() {
    var w = globe.clientWidth, h = globe.clientHeight;
    if (!w || !h) return;
    W = w; H = h; dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    R = Math.min(W, H) * 0.43; dirty = true;
  }

  var front = [];
  function draw() {
    var D = DK * R, cx0 = W / 2, cy0 = H / 2, tw = 2 * R * Math.tan(AW / 2), th = tw * ASPECT, lim = 1 / DK;
    cosA = Math.cos(ry); sinA = Math.sin(ry); cosB = Math.cos(rx); sinB = Math.sin(rx);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var RS = R * 1.033, g = ctx.createRadialGradient(cx0 - RS * 0.3, cy0 - RS * 0.38, RS * 0.05, cx0, cy0, RS);
    g.addColorStop(0, "rgba(34,48,80,0.92)"); g.addColorStop(0.55, "rgba(13,19,34,0.9)"); g.addColorStop(1, "rgba(5,8,15,0.94)");
    ctx.beginPath(); ctx.arc(cx0, cy0, RS, 0, 6.2832); ctx.fillStyle = g; ctx.fill();
    var core = ctx.createRadialGradient(cx0, cy0, 0, cx0, cy0, RS * 0.9);
    core.addColorStop(0, "rgba(" + GOLD + ",0.16)"); core.addColorStop(1, "rgba(" + GOLD + ",0)");
    ctx.fillStyle = core; ctx.fill();
    front.length = 0;
    ctx.lineWidth = 1;
    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i], n = rot(t.n), u = rot(t.u), d = rot(t.d);
      var sc = D / (D - n[2] * R);
      t.z = n[2]; t.sc = sc; t.cx = cx0 + n[0] * R * sc; t.cy = cy0 + n[1] * R * sc;
      t.ux = u[0] * sc; t.uy = u[1] * sc; t.dx = d[0] * sc; t.dy = d[1] * sc;
      t.f = (n[2] - lim) / (1 - lim);
      if (t.f > 0) { front.push(t); continue; }
      var hx = tw / 2, hy = th / 2, al = 0.05 + 0.1 * Math.min(1, -t.f);
      ctx.beginPath();
      ctx.moveTo(t.cx - t.ux * hx - t.dx * hy, t.cy - t.uy * hx - t.dy * hy);
      ctx.lineTo(t.cx + t.ux * hx - t.dx * hy, t.cy + t.uy * hx - t.dy * hy);
      ctx.lineTo(t.cx + t.ux * hx + t.dx * hy, t.cy + t.uy * hx + t.dy * hy);
      ctx.lineTo(t.cx - t.ux * hx + t.dx * hy, t.cy - t.uy * hx + t.dy * hy);
      ctx.closePath();
      ctx.fillStyle = "rgba(" + GOLD + "," + (al * 0.5).toFixed(3) + ")"; ctx.fill();
      ctx.strokeStyle = "rgba(" + IVORY + "," + al.toFixed(3) + ")"; ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(cx0, cy0, RS, 0, 6.2832); ctx.strokeStyle = "rgba(" + GOLD + ",0.22)"; ctx.stroke();
    front.sort(function (p, q) { return p.z - q.z; });
    var gw = tw * (1 + 2 * MARGIN), gh = th + 2 * tw * MARGIN;
    for (var k = 0; k < front.length; k++) {
      var f = front[k];
      ctx.setTransform(dpr * f.ux, dpr * f.uy, dpr * f.dx, dpr * f.dy, dpr * f.cx, dpr * f.cy);
      ctx.globalAlpha = Math.min(1, 0.3 + f.f * 1.6);
      ctx.drawImage(f.sp, -gw / 2, -gh / 2, gw, gh);
    }
    ctx.globalAlpha = 1;
    var hl = open ? open.t : tiles[hover];
    if (hl && hl.f > 0) {
      ctx.setTransform(dpr * hl.ux, dpr * hl.uy, dpr * hl.dx, dpr * hl.dy, dpr * hl.cx, dpr * hl.cy);
      ctx.shadowColor = "rgba(" + GOLD + ",0.95)"; ctx.shadowBlur = 22 * dpr;
      rrect(ctx, -tw / 2, -th / 2, tw, th, tw * 0.045); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(" + GOLD + ",1)"; ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    dirty = false;
  }

  function pick(mx, my) {
    var tw = 2 * R * Math.tan(AW / 2), th = tw * ASPECT;
    for (var k = front.length - 1; k >= 0; k--) {
      var f = front[k], det = f.ux * f.dy - f.dx * f.uy;
      if (Math.abs(det) < 1e-6) continue;
      var px = mx - f.cx, py = my - f.cy, lx = (px * f.dy - py * f.dx) / det, ly = (py * f.ux - px * f.uy) / det;
      if (Math.abs(lx) <= tw / 2 && Math.abs(ly) <= th / 2) return tiles.indexOf(f);
    }
    return -1;
  }
  function tileRect(t) {
    var tw = 2 * R * Math.tan(AW / 2) * t.sc, b = cv.getBoundingClientRect();
    return { left: b.left + t.cx - tw / 2, top: b.top + t.cy - tw * ASPECT / 2, width: tw };
  }
  function wrapPi(a) { return Math.atan2(Math.sin(a), Math.cos(a)); }
  function aim(t) { target = { ry: ry + wrapPi(-t.lon - ry), rx: Math.max(-MAXT, Math.min(MAXT, -t.lat)) }; vel = 0; if (reduce) { ry = target.ry; rx = target.rx; target = null; dirty = true; } }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
    if (inView && !document.hidden) {
      if (target) {
        var k = Math.min(1, dt * 5.5);
        ry += (target.ry - ry) * k; rx += (target.rx - rx) * k; dirty = true;
        if (Math.abs(target.ry - ry) < 0.001 && Math.abs(target.rx - rx) < 0.001) { ry = target.ry; rx = target.rx; target = null; }
      } else if (!dragging && !open) {
        if (Math.abs(vel) > 0.02) { ry += vel * dt; vel *= Math.exp(-dt * 2.6); dirty = true; }
        else if (hover < 0 && now > holdUntil && !reduce) { ry += AUTO * dt; rx += (TILT - rx) * Math.min(1, dt * 0.5); dirty = true; }
      }
      if (dirty) draw();
    }
    requestAnimationFrame(frame);
  }

  var px = 0, py = 0, pid = null, lastT = 0;
  function local(e) { var b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
  cv.addEventListener("pointerdown", function (e) {
    if (e.button || open) return;
    dragging = true; moved = false; pid = e.pointerId; px = e.clientX; py = e.clientY; lastT = performance.now(); target = null; vel = 0;
    globe.classList.add("dragging"); tip.hidden = true;
  });
  window.addEventListener("pointermove", function (e) {
    if (dragging && e.pointerId === pid) {
      var dx = e.clientX - px, dy = e.clientY - py;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 6) return;
      moved = true; px = e.clientX; py = e.clientY;
      var k = 1 / (1.33 * R), now = performance.now(), dtm = Math.max(8, now - lastT) / 1000; lastT = now;
      ry += dx * k; vel = vel * 0.5 + (dx * k / dtm) * 0.5;
      if (full || e.pointerType !== "touch") rx = Math.max(-MAXT, Math.min(MAXT, rx - dy * k));
      dirty = true;
    }
  });
  cv.addEventListener("pointermove", function (e) {
    if (dragging || open || e.pointerType !== "mouse") return;
    var m = local(e), h = pick(m[0], m[1]);
    if (h !== hover) { hover = h; dirty = true; globe.classList.toggle("over", h >= 0); }
    if (h >= 0) {
      var a = tiles[h].a; tip.textContent = a.s + "  ·  " + fmt(a.d); tip.hidden = false;
      tip.style.transform = "translate(" + Math.min(W - tip.offsetWidth - 4, m[0] + 14) + "px," + Math.max(4, m[1] - 34) + "px)";
    } else tip.hidden = true;
  });
  cv.addEventListener("pointerleave", function () { if (hover >= 0) { hover = -1; dirty = true; } tip.hidden = true; globe.classList.remove("over"); });
  function endDrag(e) {
    if (!dragging || (e && e.pointerId !== pid)) return;
    dragging = false; globe.classList.remove("dragging");
    if (moved) { holdUntil = performance.now() + 1500; if (Math.abs(vel) > 6) vel = 6 * Math.sign(vel); }
    else if (e && e.type === "pointerup") { var m = local(e), h = pick(m[0], m[1]); if (h >= 0) openPage(tiles[h]); }
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  cv.addEventListener("keydown", function (e) {
    var step = 0.2;
    if (e.key === "ArrowLeft") { ry -= step; } else if (e.key === "ArrowRight") { ry += step; }
    else if (e.key === "ArrowUp") { rx = Math.max(-MAXT, rx - step); } else if (e.key === "ArrowDown") { rx = Math.min(MAXT, rx + step); }
    else if (e.key === "Enter" && front.length) { openPage(front[front.length - 1]); return; }
    else return;
    e.preventDefault(); target = null; holdUntil = performance.now() + 4000; dirty = true;
  });

  /* ---------- Enlarged page ---------- */
  var focus = $("focus"), fcard = $("fcard"), fimg = $("fimg"), opener = null;
  function flyFrom(t) {
    var ir = fimg.getBoundingClientRect(), cr = fcard.getBoundingClientRect(), tr = tileRect(t), s = tr.width / ir.width;
    fcard.style.transformOrigin = (ir.left - cr.left) + "px " + (ir.top - cr.top) + "px";
    return "translate(" + (tr.left - ir.left) + "px," + (tr.top - ir.top) + "px) scale(" + s + ")";
  }
  function openPage(t) {
    if (open) return;
    var a = t.a; opener = document.activeElement;
    open = { t: t }; hover = -1; tip.hidden = true; globe.classList.remove("over");
    $("fType").textContent = a.k; $("fDate").textContent = fmt(a.d);
    var h = $("fHead"); h.textContent = a.t; h.lang = a.l;
    $("fSum").textContent = a.x; $("fSrc").textContent = a.s;
    var link = $("fLink"); link.hidden = !a.u; link.href = a.u || "#";
    var rec = $("fRecord"); rec.href = "#" + a.id;
    // the card shows the whole page at its own proportions; tall pages scroll inside the card
    var im = t.img, ok = im && im.complete && im.naturalWidth;
    fimg.width = 960; fimg.height = ok ? Math.round(960 * im.naturalHeight / im.naturalWidth) : 720;
    fimg.style.aspectRatio = fimg.width + " / " + fimg.height;
    fimg.style.objectPosition = a.f === "bottom" ? "bottom" : a.f === "middle" ? "center" : "top";
    fimg.classList.remove("is-whole");
    var c = fimg.getContext("2d"); c.clearRect(0, 0, fimg.width, fimg.height); paintPage(c, 0, 0, fimg.width, fimg.height, t, true);
    focus.hidden = false; fcard.scrollTop = 0;
    if (!reduce && fcard.animate) {
      fcard.animate([{ transform: flyFrom(t), opacity: 0.5 }, { transform: "none", opacity: 1 }], { duration: 460, easing: "cubic-bezier(0.2,0.7,0.2,1)" });
      $("veil").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    }
    aim(t); dirty = true;
    $("fclose").focus({ preventScroll: true });
  }
  function closePage() {
    if (!open || open.closing) return;
    var t = open.t, done = function () { focus.hidden = true; open = null; holdUntil = performance.now() + 1200; dirty = true; if (opener && opener.focus) opener.focus({ preventScroll: true }); };
    if (reduce || !fcard.animate) { done(); return; }
    open.closing = true;
    $("veil").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: "forwards" }).onfinish = function () { this.cancel(); };
    fcard.animate([{ transform: "none", opacity: 1 }, { transform: flyFrom(t), opacity: 0.2 }], { duration: 300, easing: "cubic-bezier(0.4,0,0.8,0.4)" }).onfinish = done;
  }
  fimg.addEventListener("click", function () { fimg.classList.toggle("is-whole"); }); // tap a tall page to see all of it
  $("fclose").addEventListener("click", closePage);
  $("veil").addEventListener("click", closePage);
  $("fRecord").addEventListener("click", function () { closePage(); });
  focus.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var f = [$("fclose"), $("fLink"), $("fRecord")].filter(function (b) { return !b.hidden; }), i = f.indexOf(document.activeElement);
    e.preventDefault(); f[(i + (e.shiftKey ? f.length - 1 : 1) + f.length) % f.length].focus();
  });

  /* ---------- Full screen ---------- */
  var native = false, fsBtn = $("fs");
  function setFull(on) {
    full = on; gwrap.classList.toggle("is-full", on); document.documentElement.classList.toggle("no-scroll", on);
    $("fsText").textContent = on ? "Exit full screen" : "Full screen";
    $("fsIcon").setAttribute("d", on ? "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" : "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5");
    $("hint").textContent = on ? "Drag any way to turn. Select a page to open it." : "Drag to turn. Select a page to open it.";
    size();
  }
  fsBtn.addEventListener("click", function () {
    if (!full) {
      setFull(true);
      var req = gwrap.requestFullscreen || gwrap.webkitRequestFullscreen;
      if (req) { try { var p = req.call(gwrap); if (p && p.catch) p.catch(function () {}); } catch (err) {} }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
      native = false; setFull(false);
    }
  });
  document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement === gwrap) native = true;
    else if (native) { native = false; setFull(false); }
    size();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (open) closePage(); else if (full && !document.fullscreenElement) setFull(false);
  });

  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { inView = en[0].isIntersecting; dirty = true; }).observe(globe);
  if ("ResizeObserver" in window) new ResizeObserver(size).observe(globe); else window.addEventListener("resize", size);
  size(); draw(); requestAnimationFrame(frame);

  /* ================= Archive list ================= */
  var all = ARTICLES.slice().sort(function (a, b) {
    if (!a.d !== !b.d) return a.d ? -1 : 1;
    var ya = a.d.slice(0, 4), yb = b.d.slice(0, 4);
    if (ya !== yb) return yb.localeCompare(ya);
    if (a.d.length !== b.d.length) return b.d.length - a.d.length;
    return b.d.localeCompare(a.d);
  });
  var list = $("list"), q = $("q"), selType = $("selType"), selYear = $("selYear"), more = $("more");
  var PAGE = 18, limit = PAGE, TYPE_ORDER = ["Print", "Tribute", "Event", "Profile", "Obituary", "Coverage", "Award", "Announcement"];
  var counts = {}, years = {}, sources = {}, shots = 0;
  all.forEach(function (a) { counts[a.k] = (counts[a.k] || 0) + 1; years[a.d.slice(0, 4) || "Undated"] = 1; sources[a.s] = 1; if (a.m) shots++; });
  Object.keys(counts).sort(function (a, b) { var ia = TYPE_ORDER.indexOf(a), ib = TYPE_ORDER.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); })
    .forEach(function (k) { var o = el("option", "", k + " (" + counts[k] + ")"); o.value = k; selType.appendChild(o); });
  var yrs = Object.keys(years).filter(function (y) { return y !== "Undated"; }).sort().reverse();
  yrs.concat(years.Undated ? ["Undated"] : []).forEach(function (y) { var o = el("option", "", y); o.value = y; selYear.appendChild(o); });
  $("stats").innerHTML = "<span><b>" + all.length + "</b> records</span><span><b>" + Object.keys(sources).length + "</b> publications</span><span><b>" + yrs[yrs.length - 1] + "</b> to <b>" + yrs[0] + "</b></span>";

  function card(a) {
    var c = el("article", "ncard panel"); c.id = a.id;
    var m = el("div", "meta"); m.appendChild(el("span", "tag", a.k)); m.appendChild(el("span", "", fmt(a.d)));
    var h = el("h3", "", a.t); h.lang = a.l;
    var s = el("div", "src"); s.appendChild(el("span", "", a.s));
    if (a.u) { var l = el("a", "", "Original article"); l.href = a.u; l.target = "_blank"; l.rel = "noopener"; s.appendChild(l); }
    if (a._tile) { var g = el("button", "glink", "On the globe"); g.type = "button"; g.addEventListener("click", function () { gwrap.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); aim(a._tile); setTimeout(function () { openPage(a._tile); }, reduce ? 0 : 450); }); s.appendChild(g); }
    c.appendChild(m); c.appendChild(h); c.appendChild(el("p", "", a.x)); c.appendChild(s);
    return c;
  }
  function apply() {
    var s = q.value.trim().toLowerCase(), t = selType.value, y = selYear.value;
    var out = all.filter(function (a) {
      return (t === "all" || a.k === t) && (y === "all" || (a.d.slice(0, 4) || "Undated") === y) &&
        (!s || (a.t + " " + a.x + " " + a.s).toLowerCase().indexOf(s) >= 0);
    });
    list.textContent = "";
    out.slice(0, limit).forEach(function (a) { list.appendChild(card(a)); });
    if (!out.length) { var em = el("div", "empty"); em.appendChild(el("span", "", "Nothing in the archive matches that search.")); var rb = el("button", "btn btn-sm", "Clear filters"); rb.type = "button"; rb.addEventListener("click", resetAll); em.appendChild(rb); list.appendChild(em); }
    var left = out.length - Math.min(limit, out.length);
    more.hidden = left <= 0; more.textContent = "Show " + Math.min(PAGE, left) + " more";
    $("total").innerHTML = "<b>" + out.length + "</b> of " + all.length + " records";
    $("range").innerHTML = "<b>" + yrs[yrs.length - 1] + "</b> to <b>" + yrs[0] + "</b>";
    $("reset").hidden = !s && t === "all" && y === "all";
  }
  function resetAll() { q.value = ""; selType.value = "all"; selYear.value = "all"; limit = PAGE; apply(); q.focus(); }
  [q, selType, selYear].forEach(function (c) { c.addEventListener("input", function () { limit = PAGE; apply(); }); });
  more.addEventListener("click", function () { limit += PAGE; apply(); });
  $("reset").addEventListener("click", resetAll);
  $("note").textContent = "The globe carries all " + all.length + " records in the archive. " + shots + " panes are screen captures of the publisher's page or photographs of the printed page. The others are typeset for this archive from the real headline, newspaper and date, because those sites did not allow a capture. Every pane opens the record, and the original article where one exists online.";
  apply();
  // a permanent link to one record: show it, even if it is past the first page
  if (location.hash) {
    var want = location.hash.slice(1), idx = all.findIndex(function (a) { return a.id === want; });
    if (idx >= 0) { limit = Math.max(PAGE, Math.ceil((idx + 1) / PAGE) * PAGE); apply(); var tgt = document.getElementById(want); if (tgt) { tgt.scrollIntoView(); tgt.style.borderColor = "var(--accent-soft)"; } }
  }
})();
