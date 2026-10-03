import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_common import *
A = ARROW

# ---------------- PHOTOS ----------------
body = f'''
<section class="page-hero">
  <div class="wrap grid">
    <span class="mono kicker reveal">Photos</span>
    <h1 class="h1 reveal">Eight albums, one life</h1>
    <p class="lead reveal" data-delay="1">From infancy in Gopalganj to the launch of this archive. Captions are those recorded in the original archive.</p>
    <div class="tools pills reveal" role="tablist" data-album-pills data-delay="2"></div>
  </div>
</section>
<section class="section-tight" style="padding-top:0;border-top:0">
  <div class="wrap">
    <div class="stat-row"><span class="stat" data-count aria-live="polite"></span></div>
    <div class="gallery" data-gallery></div>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="section-head"><h2 class="h2">Continue exploring</h2></div>
    {continue_links([("videos.html","Films","Nine films, including his own account of his life."),("biography.html","Biography","The story behind the photographs."),("recollections.html","Recollections","How his peers remember him.")])}
  </div>
</section>
'''
scripts = '''<script src="data/media-data.js"></script>
<script>
(function(){
  var B = window.PHOTO_BASE, albums = window.ALBUMS || [];
  var pills = document.querySelector('[data-album-pills]'), grid = document.querySelector('[data-gallery]'), count = document.querySelector('[data-count]');
  var all = [];
  albums.forEach(function(a){ a.files.forEach(function(f){ all.push({ album: a.id, albumTitle: a.title, src: B + 'photo-gallery/' + a.id + '/' + f + '.jpg', thumb: B + 'photo-gallery/' + a.id + '/' + f + '-th.jpg', caption: (a.captions && a.captions[f]) || a.title }); }); });
  pills.innerHTML = '<button class="pill is-active" data-album="all" aria-selected="true">All albums</button>' + albums.map(function(a){ return '<button class="pill" data-album="' + a.id + '">' + a.title + ' <span class="muted">' + a.files.length + '</span></button>'; }).join('');
  var current = all;
  function render(list){
    current = list;
    grid.innerHTML = list.map(function(p, i){
      return '<button class="ph" data-i="' + i + '" aria-label="Open: ' + p.caption.replace(/"/g,'') + '"><div class="frame"><img src="' + p.src + '" alt="' + p.caption.replace(/"/g,'') + '" loading="lazy" width="800" height="600"></div><div class="cap">' + p.caption + '</div></button>';
    }).join('');
    count.innerHTML = '<b>' + list.length + '</b> photographs';
  }
  render(all);
  // If the archive host is unreachable, show one quiet notice instead of a wall of empty tiles.
  var probe = new Image(); probe.onerror = function(){ grid.innerHTML = '<div class="archive-note panel"><span class="mono">Photographs</span><p>The photograph archive is being moved onto this site and will appear here as soon as the files are in place.</p></div>'; count.innerHTML = ''; }; probe.src = all.length ? all[0].src : '';
  pills.addEventListener('click', function(e){
    var b = e.target.closest('[data-album]'); if(!b) return;
    pills.querySelectorAll('.pill').forEach(function(p){ p.classList.remove('is-active'); p.setAttribute('aria-selected','false'); });
    b.classList.add('is-active'); b.setAttribute('aria-selected','true');
    var id = b.dataset.album; render(id === 'all' ? all : all.filter(function(p){ return p.album === id; }));
  });
  grid.addEventListener('click', function(e){ var b = e.target.closest('.ph'); if(b) window.openLightbox(current, +b.dataset.i); });
})();
</script>'''
page("photos.html", "Photos", "Photo archive of Samson H Chowdhury: early life, family, work, dignitaries, foreign tours, philanthropy and memorials.", body, scripts)

# ---------------- VIDEOS ----------------
body = f'''
<section class="page-hero">
  <div class="wrap grid">
    <span class="mono kicker reveal">Videos</span>
    <h1 class="h1 reveal">Nine films</h1>
    <p class="lead reveal" data-delay="1">His own account of his life, in his voice. And the days the country said goodbye.</p>
  </div>
</section>
<section class="section-tight" style="border-top:0">
  <div class="wrap"><div class="videos" data-videos></div></div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="section-head"><h2 class="h2">Continue exploring</h2></div>
    {continue_links([("photos.html","Photographs","Eight albums, from infancy to the launch of this archive."),("quotes.html","In his own words","Plain sayings he repeated for decades."),("biography.html#demise","Demise","January 2012, as the country said goodbye.")])}
  </div>
</section>
'''
scripts = '''<script src="data/media-data.js"></script>
<script>
(function(){
  var B = window.VIDEO_BASE, vids = window.VIDEOS || [];
  var wrap = document.querySelector('[data-videos]');
  var play = '<span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg></span>';
  wrap.innerHTML = vids.map(function(v, i){
    return '<button class="vcard' + (i === 0 ? ' featured' : '') + '" data-i="' + i + '" id="' + v.file.replace('.mp4','') + '"><div class="vthumb"><video src="' + B + v.file + '#t=2" preload="metadata" muted playsinline aria-hidden="true"></video><span class="dur" hidden></span>' + play + '</div><div><h3>' + v.title + '</h3><p>' + v.blurb + '</p><p class="note" hidden>This film could not be loaded right now.</p></div></button>';
  }).join('');
  /* duration badge once the browser has read the file header; per-card error note if it cannot */
  wrap.querySelectorAll('video').forEach(function(el){
    el.addEventListener('loadedmetadata', function(){ var d = Math.round(el.duration); if (d > 0) { var b = el.parentNode.querySelector('.dur'); b.textContent = Math.floor(d/60) + ':' + String(d%60).padStart(2,'0'); b.hidden = false; } });
    el.addEventListener('error', function(){ var c = el.closest('.vcard'); c.querySelector('.note').hidden = false; c.querySelector('.play').style.display = 'none'; });
  });
  wrap.addEventListener('error', function(e){ if (e.target && e.target.tagName === 'VIDEO' && !wrap.dataset.off) { wrap.dataset.off = '1'; wrap.innerHTML = '<div class="archive-note panel"><span class="mono">Videos</span><p>The video archive is being moved onto this site and will appear here as soon as the files are in place.</p></div>'; } }, true);
  var items = vids.map(function(v){ return { video: true, src: B + v.file, caption: v.title }; });
  wrap.addEventListener('click', function(e){ var b = e.target.closest('.vcard'); if(b) window.openLightbox(items, +b.dataset.i); });
})();
</script>'''
page("videos.html", "Videos", "Video archive of Samson H Chowdhury: A Glimpse of Life, Establishment of Square, Liberation War Memories, Message for the New Generation and more.", body, scripts)

# ---------------- NEWS ROOM ----------------
body = f'''
<section class="page-hero">
  <div class="wrap grid">
    <span class="mono kicker reveal">News Room</span>
    <h1 class="h1 reveal">News Room</h1>
    <p class="lead reveal" data-delay="1">Every report, tribute, honour and event connected to him, in one place, kept for the record.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="news-featured" data-featured></div>
    <div class="news-tools">
      <label class="field"><span class="sr-only">Search the archive</span>{SEARCH}<input type="search" placeholder="Search headlines, sources, people" data-q></label>
      <label class="field"><span class="sr-only">Filter by type</span><select data-type><option value="all">All types</option><option>Announcement</option><option>Award</option><option>Coverage</option><option>Event</option><option>Tribute</option></select>{CHEV_D}</label>
      <label class="field"><span class="sr-only">Filter by year</span><select data-year-f><option value="all">All years</option></select>{CHEV_D}</label>
      <button class="btn btn-sm" data-reset type="button">Clear filters</button>
    </div>
    <div class="stat-row"><span class="stat" data-total aria-live="polite"></span><span class="stat" data-range></span></div>
    <div class="news-list" data-list></div>
    <p class="small" style="margin-top:28px;max-width:66ch">Records without a link are held as scans or clippings in the archive and have no online original. Links are added only when an original article can be found.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="section-head"><h2 class="h2">Continue exploring</h2></div>
    {continue_links([("accolades.html","Accolades","Every honour, with the year and the awarding body."),("recollections.html","Recollections","The tributes in full."),("biography.html#timeline","Timeline","The chronology the news fits into.")])}
  </div>
</section>
'''
scripts = '''<script src="data/news-data.js"></script>
<script>
(function(){
  var all = (window.NEWS || []).slice().sort(function(a,b){ return b.date.localeCompare(a.date); });
  var list = document.querySelector('[data-list]'), q = document.querySelector('[data-q]'), type = document.querySelector('[data-type]'), yr = document.querySelector('[data-year-f]');
  var total = document.querySelector('[data-total]'), range = document.querySelector('[data-range]'), feat = document.querySelector('[data-featured]');
  var years = []; all.forEach(function(n){ var y = n.date.slice(0,4); if(years.indexOf(y) < 0) years.push(y); });
  years.forEach(function(y){ var o = document.createElement('option'); o.textContent = y; yr.appendChild(o); });
  if (all.length) {
    var f = all[0], rest = all.slice(1, 4);
    feat.innerHTML = '<div class="nf-main panel"><div class="label mono">From the archive</div><h2>' + f.title + '</h2><p class="lead">' + f.summary + '</p><p class="small">' + f.source + ', ' + window.fmtDate(f.date) + (f.url ? ' <a href="' + f.url + '" target="_blank" rel="noopener" style="text-decoration:underline;text-underline-offset:3px;color:var(--fg)">Original article</a>' : '') + ' <a href="#' + f.id + '" style="text-decoration:underline;text-underline-offset:3px;color:var(--fg)">Record</a></p></div>' +
      '<div class="nf-side">' + rest.map(function(n){ return '<a class="item panel" href="#' + n.id + '"><b>' + n.title + '</b><small>' + n.source + ', ' + window.fmtDate(n.date) + '</small></a>'; }).join('') + '</div>';
  }
  function apply(){
    var s = q.value.trim().toLowerCase(), t = type.value, y = yr.value;
    var out = all.filter(function(n){
      return (t === 'all' || n.type === t) && (y === 'all' || n.date.slice(0,4) === y) && (!s || (n.title + ' ' + n.summary + ' ' + n.source).toLowerCase().indexOf(s) >= 0);
    });
    list.innerHTML = out.length ? out.map(window.renderNewsCard).join('') : '<div class="empty"><span>Nothing in the archive matches that search.</span><button class="btn btn-sm" data-reset type="button">Clear filters</button></div>';
    total.innerHTML = '<b>' + out.length + '</b> of ' + all.length + ' records';
    range.innerHTML = years.length ? '<b>' + years[years.length-1] + '</b> to <b>' + years[0] + '</b>' : '';
    window.observeNew && window.observeNew(list);
  }
  [q, type, yr].forEach(function(el){ el.addEventListener('input', apply); });
  document.addEventListener('click', function(e){ var r = e.target.closest('[data-reset]'); if (!r) return; q.value = ''; type.value = 'all'; yr.value = 'all'; apply(); q.focus(); });
  apply();
  if (location.hash) { var t = document.querySelector(location.hash); if (t) { t.classList.add('in'); t.scrollIntoView(); t.style.borderColor = 'var(--accent-soft)'; } }
})();
</script>'''
page("newsroom.html", "News Room", "The Samson H Chowdhury News Room: a searchable archive of news coverage, tributes, honours and events, kept for future generations.", body, scripts)
