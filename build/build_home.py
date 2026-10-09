import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_common import *
A = ARROW

# Eight defining milestones. The complete chronology lives on biography.html.
MILESTONES = [
 ("1925", "25 September", "Born at Aruakandi, Gopalganj", "Eldest son of Eakub Hussain Chowdhury, a mission-hospital medical officer, and Latika Chowdhury.", "early-life/01.jpg"),
 ("1943", "Age 17", "Joins the Royal Indian Navy", "Leaves home without telling his family. Refuses a signals posting, spends five days in custody, and gets the radar unit he wanted.", "early-life/05.jpg"),
 ("1952", "Ataikula, Pabna", "Takes over Hossain Pharmacy", "Quits the post office and returns home to run his father's medicine shop. Four years later he is making syrups at home under the name Esons.", "with-familly-members/02.jpg"),
 ("1958", "Rs 17,000", "Square is founded", "Four friends, equal partners, a rented tin shed in Pabna and twelve workers. No profit for three years.", "while-at-work-or-at-leisure/02.jpg"),
 ("1974", "Janssen Pharmaceutica", "The turning point", "A licence from the Belgian subsidiary of Johnson and Johnson. The plant is rebuilt to international standards.", "while-at-work-or-at-leisure/03.jpg"),
 ("1985", "Bangladesh", "Market leader", "Ahead of every national and multinational pharmaceutical company in the country. Two years later, the first to export.", "while-at-work-or-at-leisure/10.jpg"),
 ("2008", "National Board of Revenue", "Highest taxpayer in the country", "Honoured on the first National Income Tax Day, 15 September 2008.", "with-dignitaries/01.jpg"),
 ("2012", "5 January", "Passes away in Singapore", "Laid to rest at Astra Farmhouse, Pabna. The Ekushey Padak follows in 2013.", "in-memoriam/01.jpg"),
]
# Where each archive photograph is cropped around, as "x% y%" of the picture (0% 0% is the top-left
# corner). Photographs not listed here use 50% 30%: upper centre, where a face usually sits.
# To move a crop, change the numbers; nothing else needs editing.
FOCUS = {
  "img/portrait-tribute.jpg": "62% 33%",
}
def focus(src): return f' style="--focus: {FOCUS[src]}"' if src in FOCUS else ""
cards = "".join(
    f'<article class="tl-card" data-yr="{yr}"><div class="img"><img src="{P}{img}" alt="" loading="lazy" width="600" height="450"{focus(P + img)}></div><span class="ghost" aria-hidden="true">{yr}</span>'
    f'<div class="yr">{yr}<span>{sub}</span></div><h3>{h}</h3><p>{p}</p></article>'
    for yr, sub, h, p, img in MILESTONES)

CH = [
 ("Beginnings", "1925 to 1952", "A doctor's son who would not take no",
  "Born at Aruakandi, Gopalganj, the eldest son of a mission-hospital medical officer. Schooled in Chandpur, Pabna, Mymensingh and Bishnupur. At 17 he left home for the Royal Indian Navy and refused a signals posting until, after five days in custody, he was given radar.",
  "biography.html#early-life", "Early life and the Navy", P + "early-life/05.jpg", "Young Samson. From the album Early Life."),
 ("The founding", "1952 to 1958", "Four friends, Rs 17,000, a tin shed",
  "In 1952 he took over his father's medicine shop in Ataikula. By 1956 he was making syrups at home, his wife Anita his only assistant. In 1958, with three friends, he opened Square in a rented tin shed in Pabna with twelve workers. No profit for three years.",
  "biography.html#square", "The establishment of Square", P + "while-at-work-or-at-leisure/02.jpg", "At work. From the album At Work and at Leisure."),
 ("The standard", "1974 to 2012", "Quality, quality and quality everywhere",
  "A licence from Janssen Pharmaceutica in 1974 rebuilt the plant to international standards. Market leader by 1985, the first Bangladeshi pharmaceutical exporter in 1987, UK MHRA approval in 2007 and TGA Australia in 2012. His motto never changed.",
  "biography.html#growth", "The growth of Square", P + "while-at-work-or-at-leisure/10.jpg", "From the album At Work and at Leisure."),
 ("The man", "1925 to 2012", "To his followers, a hero",
  "To his contemporaries, an icon. To young entrepreneurs, a mentor. To regulators, a symbol of fairness. He put people's welfare at the centre of enterprise, and in five decades there was never a single day of labour unrest in any company he built.",
  "recollections.html", "How his peers remember him", "img/portrait-tribute.jpg", "Samson H Chowdhury."),
]
chapters = "".join(f'''<article class="ch" data-ch="{i}" id="chapter-{i+1}">
        <div class="ch-copy">
          <span class="mono">Chapter {i+1}. {label}, {yrs}</span>
          <h2 class="h2">{title}</h2>
          <p>{text}</p>
          <a class="btn btn-sm" href="{href}">{link} {A}</a>
        </div>
        <figure class="ch-art">
          <img class="ch-back" src="{img}" alt="" loading="{"eager" if i == 0 else "lazy"}" width="900" height="600" data-fallback="img/portrait-tribute.jpg" data-fallback-focus="62% 33%" aria-hidden="true"{focus(img)}>
          <div class="ch-front"><img src="{img}" alt="{cap}" loading="{"eager" if i == 0 else "lazy"}" width="900" height="1125" data-fallback="img/portrait-tribute.jpg" data-fallback-focus="62% 33%"{focus(img)}></div>
          <figcaption class="small">{cap}</figcaption>
        </figure>
      </article>''' for i,(label,yrs,title,text,href,link,img,cap) in enumerate(CH))
chapter_nav = "".join(f'<li><button type="button" data-go="{i}"><span class="n">0{i+1}</span><span class="t">{label}</span></button></li>' for i,(label,*_) in enumerate(CH))

body = f'''
<div class="hero-pin">
<section class="hero" aria-label="Introduction">
  <div class="scrub" data-scrub aria-hidden="true"><img class="scrub-poster" src="img/seq/f001.webp" alt="" width="760" height="651" fetchpriority="high"><canvas></canvas></div>
  <div class="scrub-hint" aria-hidden="true"><span>Scroll to turn</span><i></i></div>
  <div class="wrap">
    <div class="hero-copy">
      <div class="motto"><img src="img/never-stop-thinking.png" alt="Never Stop Thinking, in his handwriting" width="900" height="197"></div>
      <div class="hero-chips">
        <span class="chip"><i></i>Founder, Square Group</span>
        <span class="chip">1925 - 2012</span>
      </div>
      <h1 class="hero-title">Samson H Chowdhury</h1>
      <p class="lead">A dreamer who saw possibilities beyond his time. A visionary who turned belief into enterprise, and a lifetime of work into inspiration for generations.</p>
      <div class="cta"><a class="btn btn-primary" href="biography.html">Read his story {A}</a><a class="btn" href="newsroom.html">Explore the archive</a></div>
    </div>
  </div>
</section>
</div>

<section class="story" data-story aria-label="His story in four chapters">
  <div class="story-stage">
    <div class="wrap story-grid">
      {chapters}
      <nav class="story-nav" aria-label="Chapters">
        <ol>{chapter_nav}</ol>
        <div class="story-bar" aria-hidden="true"><i></i></div>
      </nav>
    </div>
  </div>
</section>

<section class="section-tight" data-timeline aria-labelledby="ms-h">
  <div class="wrap">
    <div class="tl-head">
      <div><span class="mono" style="display:block;margin-bottom:12px">Milestones</span><h2 class="h2" id="ms-h">Eighty-six years,<br>eight moments</h2></div>
      <div class="tl-nav">
        <button class="icon-btn" data-tl-prev aria-label="Previous milestone">{CHEV_L}</button>
        <button class="icon-btn" data-tl-next aria-label="Next milestone">{CHEV_R}</button>
        <span class="mono" data-tl-count aria-live="polite"></span>
      </div>
    </div>
    <div class="tl-rail" aria-label="Jump to a year"></div>
    <div class="tl-line" aria-hidden="true"><div class="tl-fill"></div></div>
    <div class="tl-track" tabindex="0" aria-label="Milestones, use the arrow keys to move">{cards}</div>
    <div class="tl-foot">
      <p class="small">The complete year-by-year chronology, from 1925 to 2013, is on the Biography page.</p>
      <a class="btn" href="biography.html#timeline">Full timeline {A}</a>
    </div>
  </div>
</section>

<section class="section-tight" aria-labelledby="impact-h">
  <div class="wrap">
    <div class="section-head reveal"><h2 class="h2" id="impact-h">What five decades built</h2></div>
    <div class="facts">
      <article class="fact panel reveal"><span class="mono">People employed, 2011</span><b data-count="36000" data-comma>36,000</b><span>Across pharmaceuticals, hospitals, textiles, toiletries, consumer goods, agro-vet, IT and television.</span></article>
      <article class="fact panel reveal" data-delay="1"><span class="mono">Labour unrest, 1958 to 2012</span><b>0 <small>days</small></b><span>Not a single strike or stoppage in any company he built.</span></article>
      <article class="fact panel reveal" data-delay="2"><span class="mono">Starting capital, 1958</span><b>Rs 17,000</b><span>Four friends, equal partners. Market leader in Bangladesh since 1985.</span></article>
      <article class="fact panel reveal"><span class="mono">First to export</span><b>1987</b><span>The first Bangladeshi pharmaceutical company to sell its medicines abroad.</span></article>
      <article class="fact panel reveal" data-delay="1"><span class="mono">Market leader since</span><b>1985</b><span>Ahead of every national and multinational company in the country, and still there.</span></article>
      <article class="fact panel wide reveal" data-delay="2"><span class="mono">Regulatory record</span><b>UK MHRA, 2007 <small>and</small> TGA Australia, 2012</b><span>The Dhaka unit was approved by the UK Medicines and Healthcare products Regulatory Agency in 2007 and, with Square Cephalosporins, by Australia's Therapeutic Goods Administration in 2012. From 2001 the plants were built to US FDA and UK standards, at his insistence.</span></article>
    </div>
  </div>
</section>

<section class="section-tight" data-feature-film hidden aria-labelledby="film-h">
  <div class="wrap">
    <div class="feature-film">
      <button class="vthumb" data-play aria-label="Play A Glimpse of Life"><video preload="metadata" muted playsinline aria-hidden="true"></video><span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg></span></button>
      <div class="reveal">
        <span class="mono">From the film archive</span>
        <h3 id="film-h">A Glimpse of Life</h3>
        <p>His own account of a life that began in Gopalganj in 1925 and shaped an industry. One of nine films in the archive.</p>
        <a class="btn" href="videos.html">All films {A}</a>
      </div>
    </div>
  </div>
</section>

<section class="section-tight" aria-labelledby="quotes-h">
  <div class="wrap quotes">
    <div class="qhead reveal">
      <span class="mono" style="display:block;margin-bottom:12px">In his own words</span>
      <h2 class="h2" id="quotes-h">Plain sayings he repeated for decades</h2>
      <div class="deck-controls">
        <button class="icon-btn" data-deck-prev aria-label="Previous quote">{CHEV_L}</button>
        <button class="icon-btn" data-deck-next aria-label="Next quote">{CHEV_R}</button>
        <span class="deck-count" data-deck-count aria-live="polite"></span>
      </div>
      <p style="margin-top:22px"><a class="btn btn-sm" href="quotes.html">All quotes {A}</a></p>
    </div>
    <div class="deck reveal" data-deck data-delay="1"></div>
  </div>
</section>

<section class="section-tight" aria-labelledby="trib-h">
  <div class="wrap">
    <div class="tribute-solo" data-tributes>
      <div class="img reveal-img"><img src="img/portrait-tribute.jpg" alt="Samson H Chowdhury" loading="lazy" width="900" height="1125"></div>
      <div class="txt panel reveal">
        <span class="mono" style="display:block;margin-bottom:14px" id="trib-h">How his peers remember him</span>
        <blockquote></blockquote>
        <div class="who"></div>
        <div class="deck-controls" style="margin-top:28px">
          <button class="icon-btn" data-trib-prev aria-label="Previous recollection">{CHEV_L}</button>
          <button class="icon-btn" data-trib-next aria-label="Next recollection">{CHEV_R}</button>
          <span class="deck-count" data-trib-count aria-live="polite"></span>
          <a class="btn btn-sm" href="recollections.html" style="margin-left:8px">All recollections {A}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section-tight" aria-labelledby="news-h">
  <div class="wrap">
    <div class="section-head reveal">
      <h2 class="h2" id="news-h">From the News Room</h2>
      <div class="side"><a class="btn btn-sm" href="newsroom.html">Full archive {A}</a></div>
    </div>
    <div class="news-rows" data-news-preview></div>
  </div>
</section>
'''

scripts = '''<script src="data/quotes-data.js"></script><script src="data/press-data.js"></script><script src="data/news-data.js"></script><script src="data/tributes-data.js"></script><script src="data/media-data.js"></script>
<script>
(function(){
  /* Featured film: only shown once the browser confirms the file can be read. */
  var sec = document.querySelector('[data-feature-film]'); if (!sec || !window.VIDEOS || !window.VIDEOS.length) return;
  var v = window.VIDEOS[0], el = sec.querySelector('video'), src = window.VIDEO_BASE + v.file;
  el.addEventListener('loadedmetadata', function(){ sec.hidden = false; try { el.currentTime = 2; } catch(e) {} window.observeNew && window.observeNew(sec); }, { once: true });
  el.addEventListener('error', function(){ sec.hidden = true; }, { once: true });
  el.src = src + '#t=2';
  sec.querySelector('[data-play]').addEventListener('click', function(){ window.openLightbox([{ video: true, src: src, caption: v.title }], 0); });
})();
</script>
<script src="js/timeline.js"></script><script src="js/story.js"></script><script src="js/scrub.js"></script>'''
extra = '<link rel="preload" as="image" href="img/seq/f001.webp" fetchpriority="high">\n'
page("index.html", "Home", "The official archive of Samson H Chowdhury (1925-2012), founder of Square Group: biography, accolades, recollections, photos, videos, quotes and a news room.", body, scripts, extra)
