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

OCC = [None,
 {"en": "Interview, recorded by MediaCom", "bn": "সাক্ষাৎকার (মিডিয়াকম ধারণকৃত)"},
 {"en": "Memorial meeting of the MCCI and Bonik Barta, 27 September 2025", "bn": "এম সি সি আই ও বণিক বার্তা আয়োজিত স্মরণ সভা, ২৭শে সেপ্টেম্বর ২০২৫"},
 {"en": "Centenary celebration at Ramna Cathedral, 25 September 2025", "bn": "রমনা ক্যাথেড্রাল-এ শতবার্ষিকী উদযাপন, ২৫শে সেপ্টেম্বর ২০২৫"},
]
TITLES = ("His Eminence Cardinal ", "Barrister ", "Dr ", "Mrs ", "Mr ")
def plain(name):
    for t in TITLES:
        if name.startswith(t): name = name[len(t):]
    return name
def slug(name): return re.sub(r"[^a-z0-9]+", "-", plain(name).lower()).strip("-")

# One entry per person, A to Z by name (titles such as Dr ignored for the order); a person who
# spoke more than once has each piece under its own occasion.
people = {}
for r in STORIES:
    k = slug(r["name"]["en"])
    people.setdefault(k, {"name": r["name"], "role": r["role"], "pieces": []})
    people[k]["pieces"].append(r)
    if len(r["role"]["en"]) > len(people[k]["role"]["en"]): people[k]["role"] = r["role"]
order = sorted(people, key=lambda k: plain(people[k]["name"]["en"]).lower())

def piece(r):
    en = "".join(f"<p>{esc(p)}</p>" for p in r["en"])
    bn = "".join(f"<p>{esc(p)}</p>" for p in r["bn"])
    o = OCC[r["section"]]
    return f'''<section class="st-piece" id="{r["id"]}">
    <p class="mono st-occ"><span class="st-en">{esc(o["en"])}</span><span class="st-bn" lang="bn">{esc(o["bn"])}</span></p>
    <div class="st-body st-en">{en}</div>
    <div class="st-body st-bn" lang="bn">{bn}</div>
  </section>'''

def entry(k):
    pr = people[k]
    return f'''<article class="st" id="{k}">
  <header class="st-head">
    <div>
      <h2 class="st-en">{esc(pr["name"]["en"])}</h2><h2 class="st-bn" lang="bn">{esc(pr["name"]["bn"])}</h2>
      <p class="st-role st-en">{esc(pr["role"]["en"])}</p><p class="st-role st-bn" lang="bn">{esc(pr["role"]["bn"])}</p>
    </div>
    <a class="st-link" href="#{k}" aria-label="Link to this speaker">#</a>
  </header>
  {"".join(piece(r) for r in pr["pieces"])}
</article>'''

toc = [f'<a class="toc-sub" href="#{k}"><span class="st-en">{esc(plain(people[k]["name"]["en"]))}</span><span class="st-bn" lang="bn">{esc(people[k]["name"]["bn"])}</span></a>' for k in order]
sections = [entry(k) for k in order]

body = f'''
<section class="page-hero">
  <div class="wrap">
    <div class="grid">
      <span class="mono kicker reveal">Stories</span>
      <h1 class="h1 reveal">Stories of Samson H Chowdhury</h1>
      <p class="lead reveal" data-delay="1">A legacy interview series. {len(STORIES)} interviews and speeches by {len(people)} people who knew him, recorded for his birth centenary in 2025, listed A to Z. Read them in English, or switch to the original Bangla.</p>
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
      <nav class="toc toc-stories reveal" aria-label="Speakers, A to Z">{"".join(toc)}</nav>
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
