import sys, os, json, re, html; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_common import *
A = ARROW

# The text lives in data/stories-data.js (one place to edit). This template reads it and writes both
# languages into the page, so the page works without JavaScript; the script only switches between them.
src = open(os.path.join(OUT, "data", "stories-data.js"), encoding="utf-8").read()
def grab(name):
    m = re.search(r"window\." + name + r" = (.*?);\n(?=window\.|$)", src, re.S)
    return json.loads(m.group(1))
SECTIONS = grab("STORY_SECTIONS"); STORIES = grab("STORIES")
NUMS = ["", "I", "II", "III"]
BN_DIGITS = str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯")

def esc(s): return html.escape(s, quote=False)

def entry(r, n):
    en = "".join(f"<p>{esc(p)}</p>" for p in r["en"])
    bn = "".join(f"<p>{esc(p)}</p>" for p in r["bn"])
    return f'''<article class="st" id="{r["id"]}">
  <header class="st-head">
    <span class="mono st-n">{n:02d}</span>
    <div>
      <h3 class="st-en">{esc(r["name"]["en"])}</h3><h3 class="st-bn" lang="bn">{esc(r["name"]["bn"])}</h3>
      <p class="st-role st-en">{esc(r["role"]["en"])}</p><p class="st-role st-bn" lang="bn">{esc(r["role"]["bn"])}</p>
    </div>
    <a class="st-link" href="#{r["id"]}" aria-label="Link to this story">#</a>
  </header>
  <div class="st-body st-en">{en}</div>
  <div class="st-body st-bn" lang="bn">{bn}</div>
</article>'''

toc, sections = [], []
n = 0
for i, sec in enumerate(SECTIONS, 1):
    rows = [r for r in STORIES if r["section"] == i]
    toc.append(f'<a class="toc-sec" href="#part-{i}"><span class="st-en">{esc(sec["en"])}</span><span class="st-bn" lang="bn">{esc(sec["bn"])}</span></a>')
    items = []
    for r in rows:
        n += 1
        items.append(entry(r, n))
        toc.append(f'<a class="toc-sub" href="#{r["id"]}"><span class="st-en">{esc(r["name"]["en"])}</span><span class="st-bn" lang="bn">{esc(r["name"]["bn"])}</span></a>')
    sections.append(f'''<section class="st-part" id="part-{i}">
  <div class="st-part-head">
    <span class="mono">Part {NUMS[i]}</span>
    <h2 class="h2"><span class="st-en">{esc(sec["en"])}</span><span class="st-bn" lang="bn">{esc(sec["bn"])}</span></h2>
    <p class="small">{len(rows)} {"voice" if len(rows) == 1 else "voices"}</p>
  </div>
  {"".join(items)}
</section>''')

body = f'''
<section class="page-hero">
  <div class="wrap">
    <div class="grid">
      <span class="mono kicker reveal">Stories</span>
      <h1 class="h1 reveal">Stories of Samson H Chowdhury</h1>
      <p class="lead reveal" data-delay="1">A legacy interview series. {len(STORIES)} interviews and speeches by the people who knew him, recorded for his birth centenary in 2025. Read them in English, or switch to the original Bangla.</p>
      <div class="tools reveal" data-delay="2">
        <div class="lang-switch" role="group" aria-label="Language">
          <button type="button" class="pill is-active" data-lang="en" aria-pressed="true">English</button>
          <button type="button" class="pill" data-lang="bn" aria-pressed="false" lang="bn">বাংলা</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section-tight stories" data-stories data-lang="en">
  <div class="wrap">
    <div class="bio-layout">
      <nav class="toc toc-stories reveal" aria-label="Speakers">{"".join(toc)}</nav>
      <div class="st-list">
        {"".join(sections)}
        <p class="note small">From the collection "Stories of Samson H. Chowdhury: A Legacy Interview Series". The interviews were recorded by MediaCom; the speeches were given at the memorial meeting of the MCCI and Bonik Barta on 27 September 2025 and at the centenary celebration at Ramna Cathedral on 25 September 2025. The English texts are translations of the Bangla originals, which can be read with the language switch above.</p>
      </div>
    </div>
  </div>
</section>

<section class="section-tight">
  <div class="wrap">
    <div class="section-head"><h2 class="h2">Continue exploring</h2></div>
    {continue_links([("recollections.html","Recollections","Ten tributes first published in 2012 and 2013."),("quotes.html","In his own words","Nine sayings, with the moments that produced them."),("newsroom.html","News Room","The centenary and the tributes as they were reported.")])}
  </div>
</section>
'''

scripts = '''<script>
(function(){
  var root = document.querySelector('[data-stories]'), btns = document.querySelectorAll('[data-lang]');
  function setLang(l){
    root.setAttribute('data-lang', l);
    btns.forEach(function(b){ var on = b.getAttribute('data-lang') === l; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    try { localStorage.setItem('shc-stories-lang', l); } catch (e) {}
    try { var u = new URL(location.href); if (l === 'bn') u.searchParams.set('lang', 'bn'); else u.searchParams.delete('lang'); history.replaceState(null, '', u); } catch (e) {}
  }
  btns.forEach(function(b){ b.addEventListener('click', function(){ setLang(b.getAttribute('data-lang')); }); });
  var q = null, saved = null;
  try { q = new URL(location.href).searchParams.get('lang'); saved = localStorage.getItem('shc-stories-lang'); } catch (e) {}
  if (q === 'bn' || (!q && saved === 'bn')) setLang('bn');
  // the speaker list follows the reader down the page
  var links = document.querySelectorAll('.toc-stories a');
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) { links.forEach(function(l){ l.classList.toggle('is-current', l.getAttribute('href') === '#' + e.target.id); }); } });
  }, { rootMargin: '-15% 0px -75% 0px' });
  document.querySelectorAll('.st').forEach(function(s){ io.observe(s); });
})();
</script>'''

page("stories.html", "Stories", "Stories of Samson H Chowdhury: interviews and centenary speeches by the people who knew him, in English and in the original Bangla.", body, scripts)
