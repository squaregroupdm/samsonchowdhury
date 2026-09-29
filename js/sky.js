/* Starry sky. A fixed, full-page WebGL field behind every page: three depth layers of stars
   that twinkle and drift, a slow parallax to the cursor and to scroll, and shooting stars
   every few seconds. The colour of the sky comes from CSS; this only draws the stars.
   Library: js/vendor/three.min.js (r147), local. */
(function () {
  "use strict";
  const host = document.querySelector("[data-sky]");
  if (!host || !window.THREE) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = window.THREE;

  const renderer = new T.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 10;

  function sprite(inner, mid) {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, `rgba(255,255,255,${inner})`); grd.addColorStop(0.3, `rgba(255,255,255,${mid})`); grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    return new T.CanvasTexture(c);
  }
  const dot = sprite(1, 0.45);

  const palette = [new T.Color(0xffffff), new T.Color(0xdff5ff), new T.Color(0x74e6ff), new T.Color(0x8f74ff), new T.Color(0xffb45f), new T.Color(0xff62ad)];
  const layers = [];
  function layer(count, depth, size, speed) {
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), sz = new Float32Array(count), ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60; pos[i * 3 + 1] = (Math.random() - 0.5) * 40; pos[i * 3 + 2] = -depth + (Math.random() - 0.5) * 2;
      const r = Math.random();
      const c = r < 0.72 ? palette[0] : r < 0.86 ? palette[1] : palette[2 + Math.floor(Math.random() * 4)];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      sz[i] = size * (0.6 + Math.random() * (Math.random() < 0.05 ? 3 : 1));
      ph[i] = Math.random() * 6.283;
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.BufferAttribute(pos, 3));
    geo.setAttribute("color", new T.BufferAttribute(col, 3));
    geo.setAttribute("size", new T.BufferAttribute(sz, 1));
    geo.setAttribute("phase", new T.BufferAttribute(ph, 1));
    const mat = new T.ShaderMaterial({
      uniforms: { map: { value: dot }, time: { value: 0 } },
      vertexShader: `attribute float size; attribute float phase; varying vec3 vC; varying float vA; uniform float time;
        void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position,1.0);
          float tw = 0.55 + 0.45 * sin(time * (0.8 + fract(phase) * 1.6) + phase * 7.0);
          vA = tw; gl_PointSize = size * (0.7 + 0.3 * tw) * 320.0 / -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform sampler2D map; varying vec3 vC; varying float vA;
        void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vC, t.a * vA); }`,
      vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending
    });
    const pts = new T.Points(geo, mat);
    scene.add(pts);
    layers.push({ pts, mat, speed });
  }
  layer(1400, 26, 0.05, 0.12);
  layer(700, 16, 0.07, 0.25);
  layer(260, 8, 0.1, 0.45);

  /* shooting stars */
  const shooters = [];
  function spawn() {
    const len = 2 + Math.random() * 2;
    const geo = new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0, 0), new T.Vector3(len, 0, 0)]);
    const line = new T.Line(geo, new T.LineBasicMaterial({ color: 0xe9f7ff, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }));
    const head = new T.Sprite(new T.SpriteMaterial({ map: dot, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending }));
    head.scale.set(0.5, 0.5, 1);
    const g = new T.Group(); g.add(line, head);
    const fromLeft = Math.random() < 0.5;
    g.position.set(fromLeft ? -16 - Math.random() * 6 : 16 + Math.random() * 6, 6 + Math.random() * 8, -6);
    const dir = new T.Vector3(fromLeft ? 1 : -1, -(0.35 + Math.random() * 0.35), 0).normalize();
    g.rotation.z = Math.atan2(dir.y, dir.x) + Math.PI;
    scene.add(g);
    shooters.push({ g, line, head, dir, speed: 14 + Math.random() * 10, life: 0, ttl: 1.2 + Math.random() * 0.8 });
  }
  let nextShot = 1.5;

  function size() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); window.addEventListener("resize", size);

  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => { target.x = (e.clientX / window.innerWidth) * 2 - 1; target.y = -((e.clientY / window.innerHeight) * 2 - 1); }, { passive: true });

  const clock = new T.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    cur.x += (target.x - cur.x) * 0.03; cur.y += (target.y - cur.y) * 0.03;
    const sy = (window.scrollY || 0) / Math.max(window.innerHeight, 1);
    layers.forEach((l) => {
      l.mat.uniforms.time.value = t;
      l.pts.position.x = -cur.x * l.speed * 2.2;
      l.pts.position.y = -cur.y * l.speed * 1.4 + sy * l.speed * 2.6;
      l.pts.rotation.z = t * 0.004 * l.speed;
    });
    nextShot -= dt;
    if (nextShot <= 0 && shooters.length < 2) { spawn(); nextShot = 3 + Math.random() * 5; }
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i]; s.life += dt;
      s.g.position.addScaledVector(s.dir, s.speed * dt);
      const k = s.life / s.ttl, a = Math.sin(Math.min(k, 1) * Math.PI);
      s.line.material.opacity = a * 0.85; s.head.material.opacity = a;
      if (k >= 1) { scene.remove(s.g); shooters.splice(i, 1); }
    }
    renderer.render(scene, camera);
  }
  if (reduce) renderer.render(scene, camera); else frame();
  host.classList.add("is-ready");
})();
