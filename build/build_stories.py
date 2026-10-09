import sys, os, json, re, html; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_common import *
A = ARROW

# The text lives in data/stories-data.js (one place to edit). This template reads it and writes both
# languages into the page, so the page works without JavaScript; the script only switches between them
# and folds the long speeches.
src = open(os.path.join(OUT, "data", "stories-data.js"), encoding="utf-8").read()
def grab(name):
    m = re.search(r"window\." + name + r" = (.*?);\n(?=window\.|$)", src, re.S)
    return json.loads(m.group(1))
STORIES = grab("STORIES")

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
def initials(name):
    w = [x for x in re.split(r"[\s()]+", plain(name)) if x and x[0].isalpha()]
    return (w[0][0] + w[-1][0]).upper() if len(w) > 1 else w[0][:2].upper()

# One line from each person, in both languages, that opens their entry. Keyed by the person's slug.
QUOTES = {
 "a-s-m-kasem": ("When you went to him, he did not feel like some great man, but like someone very close to you.", "ওনার কাছে গেলে মনে হতো, বড় কোনো মানুষ না, নিজের খুব কাছের কেউ।"),
 "abdul-muktadir": ("We were like little saplings in the shade of a great tree, but that tree never pressed down on us with its height; it gave us shelter.", "যেন এক বিশাল বৃক্ষের ছায়ায় দাঁড়িয়ে থাকা ছোট ছোট চারাগাছ, কিন্তু সেই বৃক্ষ কখনো তার উচ্চতা দিয়ে আমাদের চাপা দিত না, বরং আশ্রয় দিত।"),
 "amir-khasru-mahmud-chowdhury": ("For the Bangladesh we dream of, we need more people like Samson Bhai.", "যে বাংলাদেশের স্বপ্ন আমরা দেখছি আমাদের আরও বেশি স্যামসন ভাইয়ের মতো মানুষের দরকার।"),
 "anis-a-khan": ("No need for so much work, go home. Your wife is waiting.", "এত কাজের দরকার নেই, বাড়ি যাও। তোমার স্ত্রী অপেক্ষা করছে।"),
 "c-k-hyder": ("Samson Chowdhury was not an ordinary man; he was a great soul.", "স্যামসন চৌধুরী মানুষ ছিলেন না, মহামানব ছিলেন।"),
 "dennis-dilip-datta": ("He believed that giving should be done so that the left hand does not know what the right hand gives.", "তিনি বিশ্বাস করতেন, দান এমনভাবে করতে হয় যেন ডান হাত যা দেয়, বাঁ হাতও তা না জানে।"),
 "dewan-hanif-mahmud": ("He created wealth for people, and he is leaving it for people.", "উনি বিত্ত তৈরি করেছেন আসলে মানুষের জন্য। কিন্তু উনি রেখে যাচ্ছেনও এটা মানুষের জন্য।"),
 "habibullah-n-karim": ("There is no short staircase on the path to success. Perseverance, honesty and quality are what build a lasting legacy.", "সাফল্যের পথে কোন ছোট সিঁড়ি নেই। অধ্যবসায়, সততা ও গুণমানই দীর্ঘস্থায়ী উত্তরাধিকার গড়ে তোলে।"),
 "iftekharuzzaman": ("There is no looking back, no giving up.", "পিছনে তাকানো যাবে না, হাল ছেড়ে দেয়া যাবে না।"),
 "kamran-t-rahman": ("Great institutions are built by those who dream beyond their time and leave an example for future generations.", "মহান প্রতিষ্ঠান গড়ে ওঠে তাদের হাতে যারা সময়সীমা অতিক্রম করে স্বপ্ন দেখে এবং ভবিষ্যৎ প্রজন্মের জন্য দৃষ্টান্ত রেখে যান।"),
 "mahbubur-rahman": ("He was a modern man enriched with age-old human values.", "প্রাচীন মানবিক মূল্যবোধে সমৃদ্ধ একজন আধুনিক মানুষ ছিলেন তিনি।"),
 "mahfuz-anam": ("The symbol of the honest businessman. The symbol of the honest entrepreneur.", "সিম্বল অফ অনেস্ট বিজনেসম্যান। সিম্বল অফ অনেস্ট ইন্ট্রাপ্রেইনার।"),
 "mohammed-farashuddin": ("Not only in the world of industry, trade and the economy, but in the whole world of Bangladesh, he is a pole star.", "বাংলাদেশের শুধু শিল্প, বাণিজ্য, অর্থনীতির জগতে নয়, বাংলাদেশের ভুবনে স্যামসন এইচ চৌধুরী একজন ধ্রুবতারা।"),
 "muhammad-a-rumee-ali": ("I don't think they will find anything against me. What would they dig up? I am ready for everything.", "আমি মনে করি না তারা আমার বিরুদ্ধে কিছু পাবে। কী-ই বা বের করবে? আমি সবকিছুর জন্য প্রস্তুত।"),
 "muhammad-abdul-mazid": ("He is someone who should be honoured not only by an organisation but by the whole nation.", "তিনি এমন একজন ব্যক্তি, যাকে সম্মান জানানো উচিত শুধু কোনো প্রতিষ্ঠানের পক্ষ থেকে নয়, সমগ্র জাতির পক্ষ থেকেই।"),
 "nihad-kabir": ("No, I am not going to sell my granddaughter's name.", "না, নাতনীর নাম তো বিক্রি করব না।"),
 "patrick-d-rozario-csc": ("He expressed his faith through his conduct and through his relationships with people.", "তিনি তার বিশ্বাসকে প্রকাশ করেছেন তার আচরণে, মানুষের সঙ্গে তার সম্পর্কের মধ্য দিয়ে।"),
 "rasheda-k-choudhury": ("You will all chat and I will lie down?", "তোমরা আড্ডা দেবে আর আমি শুয়ে থাকব?"),
 "sanchia-chowdhury": ("Who says so? I say give it your best shot, it will happen.", "কে বলেছে? আমি বলছি, give it your best shot, হবে।"),
 "syed-nasim-manzur": ("The first word that comes to mind is integrity.", "প্রথম যে শব্দটা মনে আসে, তা হলো ইন্টেগ্রিটি।"),
 "syed-s-kaiser-kabir": ("He showed me his iPod and said, \"I love jazz.\" It was as if that music kept him alive.", "তিনি তার আইপড দেখিয়ে বলেছিলেন, “আমি জ্যাজ ভালোবাসি।” সেই সুরই যেন তাকে প্রাণবন্ত রাখত।"),
 "tapan-chowdhury": ("Look, I will say what is true, I will say it regardless.", "দেখ আমার যে সত্য কথা বলা আমি এটা বলবই।"),
 "wazed-molla": ("He was like a vast ocean, deep, wide and limitless.", "তিনি ছিলেন এক বিশাল সমুদ্রের মতো মানুষ গভীর, বিস্তৃত এবং অসীম।"),
}

# One entry per person, A to Z by name (titles such as Dr ignored for the order); a person who
# spoke more than once has each piece under its own occasion.
people = {}
for r in STORIES:
    k = slug(r["name"]["en"])
    people.setdefault(k, {"name": r["name"], "role": r["role"], "pieces": []})
    people[k]["pieces"].append(r)
    if len(r["role"]["en"]) > len(people[k]["role"]["en"]): people[k]["role"] = r["role"]
order = sorted(people, key=lambda k: plain(people[k]["name"]["en"]).lower())
for k in order: assert k in QUOTES, k

FOLD = 2  # paragraphs shown before "Read the full story"; a long single paragraph folds by height instead

def both(en, bn, tag="span", cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<{tag}{c}><span class="st-en">{esc(en)}</span><span class="st-bn" lang="bn">{esc(bn)}</span></{tag}>'

def piece(r, only):
    o = OCC[r["section"]]
    def body(paras, lang):
        attr = ' lang="bn"' if lang == "bn" else ""
        long_one = len(paras) == 1 and len(paras[0]) > 900
        if len(paras) > FOLD or long_one:
            head = "".join(f"<p>{esc(p)}</p>" for p in paras[:FOLD])
            rest = "".join(f"<p>{esc(p)}</p>" for p in paras[FOLD:])
            fold = ' data-fold="height"' if long_one else ""
            return f'<div class="st-body st-{lang}"{attr}{fold}><div class="st-first">{head}</div><div class="st-rest" hidden>{rest}</div></div>'
        return f'<div class="st-body st-{lang}"{attr}>{"".join(f"<p>{esc(p)}</p>" for p in paras)}</div>'
    folds = len(r["en"]) > FOLD or (len(r["en"]) == 1 and len(r["en"][0]) > 900)
    btn = f'<button type="button" class="btn btn-sm st-more" aria-expanded="false"><span class="st-en">Read the full story</span><span class="st-bn" lang="bn">পুরোটা পড়ুন</span> {A}</button>' if folds else ""
    occ = "" if only else f'<p class="st-occ">{both(o["en"], o["bn"])}</p>'
    return f'''<section class="st-piece" id="{r["id"]}">
      {occ}{body(r["en"], "en")}{body(r["bn"], "bn")}{btn}
    </section>'''

def entry(k, i):
    pr = people[k]; q = QUOTES[k]; n = len(pr["pieces"])
    only = n == 1
    occ_single = f'<p class="st-occ">{both(OCC[pr["pieces"][0]["section"]]["en"], OCC[pr["pieces"][0]["section"]]["bn"])}</p>' if only else ""
    return f'''<article class="st" id="{k}">
  <aside class="st-side">
    <span class="mono-gram" aria-hidden="true">{initials(pr["name"]["en"])}</span>
    <h2>{both(pr["name"]["en"], pr["name"]["bn"])}</h2>
    <p class="st-role">{both(pr["role"]["en"], pr["role"]["bn"])}</p>
    {occ_single}
    <a class="st-up" href="#voices"><span class="st-en">All voices</span><span class="st-bn" lang="bn">সব কণ্ঠ</span></a>
  </aside>
  <div class="st-main">
    <blockquote class="st-pull">{both(q[0], q[1])}</blockquote>
    {"".join(piece(r, only) for r in pr["pieces"])}
  </div>
</article>'''

tiles = "".join(f'''<a class="voice reveal" data-delay="{i % 3}" href="#{k}">
      <span class="mono-gram" aria-hidden="true">{initials(people[k]["name"]["en"])}</span>
      <b>{both(plain(people[k]["name"]["en"]), people[k]["name"]["bn"])}</b>
      <span class="voice-role">{both(people[k]["role"]["en"], people[k]["role"]["bn"])}</span>
    </a>''' for i, k in enumerate(order))
entries = "".join(entry(k, i) for i, k in enumerate(order))

body = f'''
<section class="page-hero with-portrait">
  <div class="wrap">
    <div class="grid">
      <div class="copy">
        <span class="mono kicker reveal">Stories</span>
        <h1 class="h1 reveal">The people who knew him, in their own words</h1>
        <p class="lead reveal" data-delay="1">{len(STORIES)} interviews and speeches by {len(people)} people, recorded for his birth centenary in 2025. In English, or in the original Bangla.</p>
        <div class="tools reveal" data-delay="2">
          <div class="lang-switch" role="group" aria-label="Language">
            <button type="button" class="pill is-active" data-lang="en" aria-pressed="true">English</button>
            <button type="button" class="pill" data-lang="bn" aria-pressed="false" lang="bn">বাংলা</button>
          </div>
        </div>
      </div>
      <figure class="page-portrait reveal-img"><img src="img/portrait-tribute.jpg" alt="Samson H Chowdhury" width="900" height="1125" fetchpriority="high"><figcaption class="small">Samson H Chowdhury, 1925 to 2012.</figcaption></figure>
    </div>
  </div>
</section>

<div class="stories" data-stories data-lang="en">
<section class="section-tight" id="voices" aria-label="Speakers, A to Z">
  <div class="wrap">
    <div class="voices">{tiles}</div>
  </div>
</section>

<section class="section-tight">
  <div class="wrap">
    <div class="st-list">
      {entries}
      <p class="note small">From the collection "Stories of Samson H. Chowdhury: A Legacy Interview Series". The interviews were recorded by MediaCom; the speeches were given at the memorial meeting of the MCCI and Bonik Barta on 27 September 2025 and at the centenary celebration at Ramna Cathedral on 25 September 2025. The English texts are translations of the Bangla originals.</p>
    </div>
  </div>
</section>
</div>

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

  // Long pieces open on request; a piece linked to directly opens by itself.
  function open(piece, on){
    piece.classList.toggle('is-open', on);
    piece.querySelectorAll('.st-rest').forEach(function(r){ r.hidden = !on; });
    var b = piece.querySelector('.st-more'); if (b) { b.setAttribute('aria-expanded', on ? 'true' : 'false'); b.querySelector('.st-en').textContent = on ? 'Show less' : 'Read the full story'; b.querySelector('.st-bn').textContent = on ? 'সংক্ষেপে দেখুন' : 'পুরোটা পড়ুন'; }
  }
  document.querySelectorAll('.st-more').forEach(function(b){
    b.addEventListener('click', function(){
      var p = b.closest('.st-piece'), on = b.getAttribute('aria-expanded') !== 'true';
      open(p, on);
      if (!on) p.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  });
  function openHash(){
    var id = location.hash.slice(1); if (!id) return;
    var el = document.getElementById(id); if (!el) return;
    var pieces = el.classList.contains('st-piece') ? [el] : el.querySelectorAll('.st-piece');
    pieces.forEach(function(p){ open(p, true); });
  }
  window.addEventListener('hashchange', openHash); openHash();
})();
</script>'''

page("stories.html", "Stories", "Stories of Samson H Chowdhury: interviews and centenary speeches by the people who knew him, in English and in the original Bangla.", body, scripts)
