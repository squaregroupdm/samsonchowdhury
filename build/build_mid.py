import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_common import *
A = ARROW

# ---------------- ACCOLADES ----------------
AWARDS = [
 ("2013","Ekushey Padak","Posthumous, Social Welfare category. One of the highest civilian honours of Bangladesh.","Government of Bangladesh", True),
 ("2010","Lifetime Achievement Award (Bangladesh)","For five decades of enterprise and ethical leadership.","British Bangladesh Chamber of Commerce", False),
 ("2009","Commercially Important Person (Export)","CIP status for 2009-2010 in recognition of Square's export contribution.","Government of Bangladesh", False),
 ("2008","NBR Award","Long-term category, Rajshahi Division. Named the country's highest taxpayer on the first National Income Tax Day.","National Board of Revenue", False),
 ("2003","Mercantile Bank Award","For special contributions to the industrial and commercial sectors.","Mercantile Bank", False),
 ("2000","Business Person of the Year","The Daily Star-DHL Bangladesh Business Awards for the year 2000. The original site's timeline records the presentation under 2001.","The Daily Star and DHL Worldwide Express", False),
 ("1998","Business Executive of the Year","For pursuit of professional excellence, high ethical standards and contribution to society and country.","American Chamber of Commerce in Bangladesh", False),
]
ROLES = {
 "business": [
  ("1995","Chairman","Micro Industries Development Assistance and Services (MIDAS)"),
  ("1996-1997","President","Metropolitan Chamber of Commerce and Industry (MCCI), Dhaka"),
  ("1999-2004","Vice Chairman","Mutual Trust Bank Limited"),
  ("1999-2005","Director","Social Marketing Company (SMC)"),
  ("2000-2001","President","Bangladesh Association of Pharmaceutical Industries"),
  ("2000-2009","Founding President","Bangladesh Association of Publicly Listed Companies"),
  ("2001-2010","Member, Advisory Committee","Bangladesh Association of Pharmaceutical Industries"),
  ("2003-2011","Director","Credit Rating Agency of Bangladesh"),
  ("2003-2011","Chairman","Central Depository Bangladesh Ltd"),
  ("2004-2012","Vice President","International Chamber of Commerce, Bangladesh"),
  ("2006-2011","President","Bangladesh Herbal Products Manufacturing Association"),
  ("2006-2011","Member, Executive Committee","French-Bangladesh Chamber of Commerce and Industry"),
  ("2007-2011","Chairman","Mutual Trust Bank Ltd"),
  ("2009-2012","Director","Bangladesh-Thai Chamber of Commerce and Industry"),
 ],
 "faith": [
  ("1956-1967","General Secretary (Honorary)","East Bengal Baptist Union, today the Bangladesh Baptist Church Fellowship (BBCF)"),
  ("1961-1964, 1968-1972","Secretary (Honorary)","East Pakistan Christian Council, today the National Council of Churches Bangladesh"),
  ("1973-1978","Founding Chairman","Christian Commission for Development in Bangladesh (CCDB)"),
  ("1975, 1979","President","National Council of Churches, Bangladesh"),
  ("1976, 1978, 1980, 1983-85, 1990-93","President","Bangladesh Baptist Church Fellowship"),
  ("1980-1995","Treasurer","National Christian Fellowship of Bangladesh (NCFB)"),
  ("1983-2009","Founding Chairman","Koinonia"),
  ("1985-1990","Vice President","Baptist World Alliance"),
  ("1989-2008","President","The United Baptist Church Trust Association of BBCF"),
  ("1996-2000","President","National Christian Fellowship of Bangladesh"),
  ("2009","Adviser","National Christian Fellowship of Bangladesh"),
 ],
 "social": [
  ("1970-2012","Life Member","Dhaka Club Limited"),
  ("1994-1995","President","Rotary Club of Dhaka Buriganga"),
  ("1996-1997","Member, Board of Trustees","Independent University Bangladesh"),
  ("1999-2012","Honorary Member","Kurmitola Golf Club"),
  ("2004-2007","Chairman","Transparency International Bangladesh (TIB)"),
  ("2009-2012","Member","Gulshan Club, Dhaka"),
 ],
}
aw = ""
for yr, name, desc, by, hero in AWARDS:
    cls = "award hero-award panel reveal" if hero else "award panel reveal"
    if hero:
        aw += f'<article class="{cls}"><div><div class="yr">{yr}</div><h3>{name}</h3></div><div><p>{desc}</p><div class="by">{by}</div></div></article>'
    else:
        aw += f'<article class="{cls}"><div class="yr">{yr}</div><h3>{name}</h3><p>{desc}</p><div class="by">{by}</div></article>'
roles = ""
for group, items in ROLES.items():
    for yr, title, org in items:
        roles += f'<div class="role" data-group="{group}"><div class="yr">{yr}</div><div><b>{title}</b><span>{org}</span></div></div>'

body = f'''
<section class="page-hero">
  <div class="wrap grid">
    <span class="mono kicker reveal">Accolades</span>
    <h1 class="h1 reveal">Honours and positions of trust</h1>
    <p class="lead reveal" data-delay="1">Seven national honours, and thirty-one roles held across business, faith and civic life.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="section-head reveal"><h2 class="h2">Honours</h2></div>
    <div class="awards">{aw}</div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head reveal">
      <h2 class="h2">Positions held</h2>
    </div>
    <div class="pills reveal" role="tablist" style="margin-bottom:36px">
      <button class="pill is-active" data-filter="all" aria-selected="true">All <span class="muted">31</span></button>
      <button class="pill" data-filter="business">Business bodies <span class="muted">14</span></button>
      <button class="pill" data-filter="faith">Church and faith <span class="muted">11</span></button>
      <button class="pill" data-filter="social">Social and civic <span class="muted">6</span></button>
    </div>
    <div class="roles">{roles}</div>
    <p class="small" style="margin-top:24px" data-role-count aria-live="polite"></p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="section-head"><h2 class="h2">Continue exploring</h2></div>
    {continue_links([("biography.html#timeline","The complete timeline","Every year from 1925 to 2013."),("newsroom.html","News Room","Honours and tributes as they were reported."),("recollections.html","Recollections","How his peers remember him.")])}
  </div>
</section>
'''
scripts = '''<script>
(function(){
  var pills = document.querySelectorAll('[data-filter]'); var roles = document.querySelectorAll('.role');
  pills.forEach(function(p){ p.addEventListener('click', function(){
    pills.forEach(function(x){ x.classList.remove('is-active'); x.setAttribute('aria-selected','false'); });
    p.classList.add('is-active'); p.setAttribute('aria-selected','true');
    var f = p.dataset.filter;
    var n = 0; roles.forEach(function(r){ var show = (f === 'all' || r.dataset.group === f); r.hidden = !show; if (show) n++; });
    document.querySelector('[data-role-count]').textContent = n + ' of ' + roles.length + ' positions shown.';
  }); });
})();
</script>'''
page("accolades.html", "Accolades", "Awards, honours and positions held by Samson H Chowdhury, including the Ekushey Padak, Business Executive of the Year and chairmanships across Bangladesh.", body, scripts)

# ---------------- RECOLLECTIONS ----------------
TRIB = [
 ("A K Azad","Chairman and MD, Ha-Meem Group of Companies","FBCCI Business Magazine, Special Issue, June 2012",
  "A personality of such magnitude is very rare to find in the corporate world.",
  ["It may not be possible to describe Samson Chowdhury in short. He was a visionary entrepreneur. The esteemed business leader started his career from his ancestral residence in Pabna in 1952. He reached the pinnacle of success through hard labour and honesty. With his innovative ideas, tireless efforts and dedication, he led Square from the front to become the leading manufacturer of quality medicine, toiletries, health products, textiles, agro vet products and information technology.",
   "He contributed a lot to the development of the country's pharmaceuticals and health sector. He remained above controversy of any kind throughout his business career. Chowdhury's life and achievement, with great ideology and ethics, will be the landmark for the new generation and businessmen of the country."]),
 ("MA Momen","President, Bangladesh Thai Chamber of Commerce and Industry","FBCCI Business Magazine, Special Issue, June 2012",
  "For someone who was larger than life, the church seemed to be so small a place that night.",
  ["It was full of commanding heights from all professions and all religions. It was a gathering of not only the highest elites of our business industry and society but people from all walks of life. It was something I had never seen or witnessed in my life before.",
   "One by one, business leaders, the Christian community leaders, his closest relatives and friends, people from the print and electronic media, his company personnel, diplomats, politicians and commoners all paid profound respect to the great business tycoon who lay still in a coffin as the church bells rang on.",
   "Many winters had brought death with it but this year's winter was unbearable. We lost a great leader of our business community who was a visionary, a guide and a warm companion. I wonder where we shall find another person with such humility and humbleness, grace and gentlemanliness. To me, Samson H Chowdhury was one of the most well-dressed persons I had ever met, a most elegant and well-versed human being."]),
 ("Mahbubur Rahman","President, ICC Bangladesh","ICC-B News Bulletin, January-March 2012",
  "In his approach to business he always put people's welfare at the centre of entrepreneurship.",
  ["Samson bhai is considered to be different from other businessmen in the country. Throughout his career, he remained above controversy of any kind. He did a lot of philanthropic work, both in his ancestral home in Pabna and in Dhaka. But he is someone who did all these outside the glare of the spotlight.",
   "ICC Bangladesh was fortunate to have his continuous guidance and support in carrying out its activities. He attended and actively participated in various ICC conferences and congresses held in different capitals of the world. In his passing, we the businesses consider that the nation has lost the Business Legend of our time."]),
 ("Mamun Rashid","Banker and Economic Analyst","The Financial Express, 6 January 2012",
  "'Quality, quality and quality everywhere' was his motto.",
  ["By all criteria, Mr Chowdhury was more than his life to almost all of us. An ever-organised and forward-looking person, he was a constant source of inspiration and encouragement to all Bangladesh entrepreneurs, small and large. Even at the age of 84, he was in command of most of the affairs at Square Group.",
   "We got to see this while he was putting up Square Biotech to produce insulin in Bangladesh. He truly believed there was no shortcut to success. Every bit of your penny must be an earned one. His motto made him one of the largest taxpayers in this country. His business practices and ethical standards made him a role model for many.",
   "We saw him extremely passionate while speaking on ethics in entrepreneurship at North South University's School of Business in April 2010. The students listened with rapt attention, yet did not spare him from answering many questions about entrepreneurial ethics in an emerging country. The 84-year-old but still 'youngest entrepreneur' of our country was loud and clear, quoting Tagore: even if no one comes forward in response to your call, move alone. He never lost hope, too."]),
 ("Muhammad Abdul Mazid","Former Secretary and Chairman, NBR","The Daily Star, 15 January 2013",
  "Like a father, friend and philosopher he used to advise me to be pro-business, pro-investor, pro-taxpayer.",
  ["Samson H Chowdhury was one of those very rare individuals who touched the hearts and souls of those he came across for his fatherly and friendly loving care. I had the honour of meeting him many times in my official capacity. He used to share his ideas with me on how the tariff regime could prop up a self-supporting economy, and help shift from a trading to an industrial base.",
   "Mr Chowdhury was an embodiment of creativity and simplicity, an icon for good practices of ethics and best quality in all business affairs; a pioneer in vertical integration and horizontal diversification; a keen learner; a good employer; a straightforward, friendly, honest philanthropist.",
   "Good practices and ethics were very much embedded in him. No one forced him to be honest. These were internal traits that comprised his character. Every bank felt honoured to give loans to such a transparent and committed customer."]),
 ("Muhammadul Haque","Executive Director (Marketing), Square Pharmaceuticals Ltd","FBCCI Business Magazine, Special Issue, June 2012",
  "He used to say, 'if you love people, God will love you.'",
  ["During his lifetime, Samson H Chowdhury saw the expansion of his diverse business interests but pharmaceuticals remained at the core of his attention till his last day. Square's heavy investments to bring its manufacturing facilities up to the GMP requirements of US FDA, UK MHRA and TGA Australia were because of his insistence. His aim was to provide the country with the best possible quality pharmaceuticals and to make Square present in highly regulated markets.",
   "From the people management side he was exemplary again. Despite his stature he was never intimidating and he had a unique ability to make people at ease in his presence. He was unpretentious, supportive and straightforward. He always insisted on understanding the front line executives of the company and kept his connections with them.",
   "During his lifetime he built a giant ship from scratch and navigated it through the murky waters of Bangladesh business with unparalleled dexterity and determination. This was exemplified through the overwhelming love he received on his demise from thousands of people from all walks of life, irrespective of caste, creed and social status."]),
 ("Murshed Murad Ibrahim","Managing Director, Crystal Fisheries Limited","FBCCI Business Magazine, Special Issue, June 2012",
  "The man showed the way to success with dynamic leadership which made him 'the leader of the leaders'.",
  ["Samson H Chowdhury, the legend in the history of entrepreneurship in Bangladesh, is a man of unique and amiable personality. He believed in transparency and accountability and was committed to the ideals and principles of good governance. He was not only a pioneer industrialist but also a pioneer in setting an example of corporate social responsibility.",
   "He was a great patriot and contributed directly to the Liberation War of Bangladesh in 1971. He helped the freedom fighters his best, sought help from the outer world and also sent his three sons to the liberation war. He believed in the development of the private sector as the path to economic development, and contributed to rebuilding the fragile economy after liberation.",
   "As a trade body leader he is a model in the sense that he always advocated for the betterment of the business community as a whole. His greatness lies in contributing to the education of the common mass, especially the poor, and this sets him apart from his contemporaries."]),
 ("Saadat Husain","Former Chairman, Public Service Commission","The Daily Star, 25 January 2012",
  "He was a man you could not help noticing, wherever he was.",
  ["Samson Chowdhury was more of an entrepreneur than a capitalist, who shared the cake with everyone around. His innovative ideas would lead to new products or processes. He would then mobilise finance, men and material to produce the product and bring it to market, more often than not for mass consumption. He was not shy to enjoy the return. He did not profess himself to be an altruistic loser; at the same time he did not like to submit himself to pernicious greed. He aspired to be a good man, a lovable friend to his fellow beings, a prince among them. He succeeded, much too well.",
   "We came closer when I was Secretary, Internal Resources Division and Chairman, National Board of Revenue. He paid his tax regularly, but was not shy to take full advantage of tax rules to reduce the amount due from him. In discussions or debates I found him logical, sober and decent even when I differed with him.",
   "In a country infested with bank default, stock market scams, tax dodging and influence peddling, any big industrialist is a suspect. Samson Chowdhury is a rare exception. I have not met any person, not even an orthodox ideologue, who had a bad word for this hard working, soft spoken and well disposed great man."]),
 ("Syed Kaiser Kabir","CEO and Managing Director, Renata Limited","The Daily Star, 10 January 2012",
  "'The truth must out' was his modus operandi.",
  ["The late Chairman of Square Group was known in the pharmaceutical industry as 'Chacha', a befitting sobriquet for an unmistakably avuncular figure. With his height, large frame and sartorial elegance he could easily stand out in any crowd. However, it was the gravitas of his demeanour coupled with a remarkable sense of candidness that placed him several leagues ahead of ordinary men.",
   "To Chacha, the opaque language of diplomacy always took a backseat to an assertive and straight-from-the-hip presentation of one's point of view. This straightforwardness stemmed largely from the fact that, unlike some businessmen in this country, Chacha had no skeletons in his cupboard and thus was under no compunction to compromise his principles, nor resort to hidden agendas.",
   "To its credit, Square Group has eschewed the all-too-well-known shenanigans as growth strategies. Chacha lamented the rise of 'thugs' in the business world. He made a conscious decision to remain clean and transparent, convinced that thuggery only brings short-term benefits at the expense of long-run prospects."]),
 ("Syed Manzur Elahi","Chairman, Apex Adelchi Footwear Ltd","FBCCI Business Magazine, Special Issue, June 2012",
  "Samson H Chowdhury is the name of an institution.",
  ["He is a hero to his followers, a business icon to his contemporaries and a role model to young entrepreneurs. It was 1989 when I first met him. A good friendship developed between us though he was 16 years older than me. A down-to-earth Samson never gave his peers and colleagues a feeling of his giant image.",
   "He proved how honesty, dedication and commitment could put a person at the highest peak of success. He set the standard of ethics and values. The man behind Square always believed there is no shortcut to success. He started in Pabna, brought his venture to Dhaka, and took his company to the international stage, which was not done overnight.",
   "For me, it is Mr Chowdhury's integrity, honesty, dedication, hard work and good behaviour which make him different from others in the business world, and I am sure these will be a source of inspiration for the country's businessmen and for the next generation to follow."]),
]
FEATURED = "Saadat Husain"
tr = ""; feat = ""
for i,(name, role, pub, lead, paras) in enumerate(TRIB):
    ini = "".join(w[0] for w in name.split()[:2] if w[0].isalpha()).upper()
    ps = "".join(f"<p>{p}</p>" for p in paras)
    slug = name.lower().replace(" ", "-")
    if name == FEATURED:
        feat = f'''<article class="tribute tribute-featured panel reveal is-open" id="{slug}">
      <span class="mono">Featured recollection</span>
      <p class="lead-q">{lead}</p>
      <div class="body">{ps}</div>
      <div class="who"><span class="ava">{ini}</span><div><b>{name}</b><small>{role}</small><small>{pub}</small></div></div>
    </article>'''
        continue
    tr += f'''<article class="tribute panel reveal" id="{slug}">
      <p class="lead-q">{lead}</p>
      <div class="body" id="{slug}-body">{ps}</div>
      <div class="who"><span class="ava">{ini}</span><div><b>{name}</b><small>{role}</small><small>{pub}</small></div></div>
      <button class="btn btn-sm more" data-more aria-expanded="false" aria-controls="{slug}-body">Read in full</button>
    </article>'''

body = f'''
<section class="page-hero">
  <div class="wrap grid">
    <span class="mono kicker reveal">Recollections</span>
    <h1 class="h1 reveal">How his peers remember him</h1>
    <p class="lead reveal" data-delay="1">Ten people who worked with him, competed with him, taxed him and mourned him, in their own words.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">{feat}<div class="tributes">{tr}</div></div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="section-head"><h2 class="h2">Continue exploring</h2></div>
    {continue_links([("stories.html","Stories","Thirty-four centenary interviews and speeches, in English and Bangla."),("newsroom.html","News Room","The tributes as they were first published."),("quotes.html","In his own words","Nine sayings, with the moments that produced them.")])}
  </div>
</section>
'''
scripts = '''<script>
document.querySelectorAll('[data-more]').forEach(function(b){ b.addEventListener('click', function(){
  var t = b.closest('.tribute'); var open = t.classList.toggle('is-open'); b.textContent = open ? 'Show less' : 'Read in full'; b.setAttribute('aria-expanded', String(open));
}); });
if (location.hash) { var t = document.querySelector(location.hash); if (t && t.classList.contains('tribute')) { t.classList.add('is-open'); var b = t.querySelector('[data-more]'); if (b) { b.textContent = 'Show less'; b.setAttribute('aria-expanded','true'); } } }
</script>'''
page("recollections.html", "Recollections", "Tributes to Samson H Chowdhury from business leaders, bankers and public servants, first published in The Daily Star, The Financial Express and FBCCI Business Magazine.", body, scripts)

# ---------------- QUOTES ----------------
body = f'''
<section class="page-hero">
  <div class="wrap grid">
    <span class="mono kicker reveal">Quotes</span>
    <h1 class="h1 reveal">In his own words</h1>
    <p class="lead reveal" data-delay="1">Plain sayings he repeated for decades, and the moments that produced them.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="qw-hero reveal">
      <blockquote id="q-hero"></blockquote>
      <cite id="q-hero-cite"></cite>
    </div>
    <div class="quote-wall" data-quote-wall></div>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="section-head"><h2 class="h2">Continue exploring</h2></div>
    {continue_links([("recollections.html","Recollections","The people who heard him say these things."),("biography.html#square","The establishment of Square","Where the name, and the standard, came from."),("videos.html","Films","His own account, in his voice.")])}
  </div>
</section>
'''
scripts = '''<script src="data/quotes-data.js"></script>
<script>
(function(){
  var q = window.QUOTES || []; if(!q.length) return;
  var hi = 0; q.forEach(function(x, k){ if (x.id === 'quality') hi = k; });
  document.getElementById('q-hero').textContent = q[hi].text;
  document.getElementById('q-hero-cite').textContent = q[hi].context || '';
  var wall = document.querySelector('[data-quote-wall]');
  wall.innerHTML = q.map(function(x){
    return '<article class="qw" id="' + x.id + '"><blockquote>' + x.text + '</blockquote><cite>' + (x.context||'') + '</cite><div class="acts"><button class="btn btn-sm" data-copy>Copy quote</button><button class="btn btn-sm" data-link="' + x.id + '">Copy link</button></div></article>';
  }).join('');
  wall.addEventListener('click', function(e){
    var b = e.target.closest('[data-copy]'), l = e.target.closest('[data-link]');
    if (b) { var t = b.closest('.qw').querySelector('blockquote').textContent + ' - Samson H Chowdhury'; window.copyText(t, b, 'Quote copied to clipboard'); }
    if (l) { var u = location.origin + location.pathname + '#' + l.dataset.link; window.copyText(u, l, 'Link copied to clipboard'); }
  });
  if (location.hash) { var tgt = document.querySelector(location.hash); if (tgt) tgt.scrollIntoView(); }
})();
</script>'''
page("quotes.html", "Quotes", "Sayings of Samson H Chowdhury, founder of Square Group: on quality, faith, honesty and enterprise.", body, scripts)
