import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_common import *
A = ARROW

TL = [
 ("1925","25 September 1925","Eldest son of Eakub Hussain Chowdhury and Latika Chowdhury, Samson H Chowdhury is born at Aruakandi in Gopalganj.",True),
 ("1930","1930","Begins schooling at a mission school in Chandpur, where his father is posted as medical officer at the Chandpur Mission Hospital.",False),
 ("1930","1932","His father is transferred to Ataikula in Pabna. Samson moves with him and joins the village school.",False),
 ("1930","1933","Sent to Mymensingh for better education. Admitted to Victoria Mission School in class IV.",False),
 ("1930","1935","Goes to West Bengal and joins Siksha Sangha High School in Bishnupur.",False),
 ("1940","1942","Returns to Pabna as World War II breaks out.",False),
 ("1940","1943","Passes matriculation from Ataikula School, Pabna. Joins the Royal Indian Navy without telling his parents.",True),
 ("1940","1946","Joins a naval mutiny against British colonial rule and is arrested. After five days in jail and a month in a camp he is released with a clean discharge and a recommendation for government service.",True),
 ("1940","1947","Joins the postal department as a government employee.",False),
 ("1940","6 August 1947","Marries Anita Biswas. He is 21, seven weeks short of his 22nd birthday.",True),
 ("1950","1952","Leaves the post office and returns home. On his father's advice he starts running the family medicine shop, Hossain Pharmacy.",True),
 ("1950","1956","Borrows Tk 5,000 from his father and opens a small pharmaceutical company, Esons, in Ataikula. The name means Eakub and sons.",False),
 ("1950","1958","With Dr Kazi Harunur Rashid, Dr PK Shaha and Radha Binod Roy, launches Square with an initial investment of Rs 17,000.",True),
 ("1960","1962","Opens a branch office at Hatkhola Road, Dhaka.",False),
 ("1960","1964","Square becomes a private limited company with authorised capital of Rs 500,000 and paid-up capital of Rs 400,000.",False),
 ("1970","1974","Square becomes a licensee of Janssen Pharmaceutica, Belgium, a Johnson and Johnson subsidiary. The turning point.",True),
 ("1980","1985","Square becomes market leader among all national and multinational pharmaceutical companies in Bangladesh.",True),
 ("1980","1987","Square becomes the first Bangladeshi pharmaceutical company to export.",True),
 ("1980","1988","Square Toiletries starts as a separate division.",False),
 ("1990","1991","Square Pharmaceuticals becomes a public limited company. The offer is vastly oversubscribed.",True),
 ("1990","1995","The Chemical Division starts producing Active Pharmaceutical Ingredients.",False),
 ("1990","1996","Becomes President of the Metropolitan Chamber of Commerce and Industry for two years.",False),
 ("1990","1997","Square wins the National Export Trophy. Mediacom Ltd is established.",False),
 ("1990","1998","Square gains ISO 9001. Receives Business Executive of the Year from AmCham. Agro-chemicals and Veterinary Division begins.",False),
 ("2000","2001","US FDA and UK MCA standard factory opens, built under Bovis Lend Lease, UK. Square Consumer Products begins. Receives The Daily Star-DHL Business Person of the Year award, for the year 2000.",True),
 ("2000","2002","Square InformatiX starts operation.",False),
 ("2000","2003","Mercantile Bank Award. Elected chairman of the Central Depository Bangladesh Limited. ISO 9001:2000.",False),
 ("2000","2004","Square Pharmaceuticals enlisted as a UNICEF global supplier. Becomes Chairman of Transparency International Bangladesh until 2007.",False),
 ("2000","2005","Square Cephalosporins opens, built under TELSTAR of Spain to US FDA and UK MHRA requirements. Square Herbal and Nutraceuticals licensed. Sabazpur Tea Company established.",False),
 ("2000","2006","Square Hospitals starts operation. Bankers' Forum Award for ethical and socially responsible business.",False),
 ("2000","2007","Dhaka Unit receives UK MHRA approval. ICAB National Award for Best Published Accounts.",False),
 ("2000","2008","NBR honours him as the country's highest taxpayer on the first National Income Tax Day.",True),
 ("2000","2009","Square begins manufacturing insulin, hormone and steroid products. Declared Commercially Important Person (Export).",False),
 ("2010","2010","Best Enterprise award from The Daily Star and DHL. Lifetime Achievement Award from the British Bangladesh Chamber of Commerce.",False),
 ("2010","2011","Maasranga, the first HD television channel in Bangladesh, goes on air.",False),
 ("2010","2012","Dhaka Unit and Square Cephalosporins receive TGA Australia approval.",False),
 ("2010","5 January 2012","Samson H Chowdhury dies at the age of 86 at Raffles Hospital, Singapore.",True),
]

decades = []
for d,_,_,_ in TL:
    if d not in decades: decades.append(d)
label = lambda d: "1920s" if d == "1925" else d + "s"
pills = "".join(f'<a class="pill" href="#d{d}">{label(d)}</a>' for d in decades)

groups = {}
for d, yr, txt, major in TL:
    groups.setdefault(d, []).append((yr, txt, major))
tl_html = ""
for d in decades:
    items = "".join(f'<div class="tl-item panel{" is-major" if major else ""}"><div class="yr">{yr}</div><div class="txt">{txt}</div></div>' for yr, txt, major in groups[d])
    tl_html += f'<div class="tl-block" id="d{d}"><div class="tl-decade">{label(d)}</div><div class="tl-items">{items}</div></div>'

body = f'''
<section class="page-hero with-portrait">
  <div class="wrap">
    <div class="grid">
      <div class="copy">
        <span class="mono kicker reveal">Biography</span>
        <h1 class="h1 reveal">Eighty-six years, told two ways</h1>
        <p class="lead reveal" data-delay="1">The year-by-year record, and the story behind it. Jump to a decade or read it straight through.</p>
        <div class="tools pills reveal" data-delay="2">
          <a class="pill is-active" href="#timeline">Timeline</a>
          <a class="pill" href="#story">The full story</a>
        </div>
      </div>
      <figure class="page-portrait reveal-img"><img src="img/portrait-bio.jpg" alt="Samson H Chowdhury" width="1000" height="1250" fetchpriority="high"><figcaption class="small">Samson H Chowdhury, 1925 to 2012.</figcaption></figure>
    </div>
  </div>
</section>

<section class="section-tight" id="timeline">
  <div class="wrap">
    <div class="section-head reveal">
      <h2 class="h2">Timeline</h2>
    </div>
    <div class="decades reveal">{pills}</div>
    <div class="timeline">{tl_html}</div>
  </div>
</section>

<section class="section" id="story">
  <div class="wrap">
    <div class="section-head reveal">
      <h2 class="h2">The full story</h2>
    </div>
    <div class="bio-layout">
      <nav class="toc reveal" aria-label="Sections">
        <a href="#early-life">Early Life</a>
        <a href="#navy">Life in the Navy</a>
        <a href="#post-office">The Post Office</a>
        <a href="#pabna">New Venture in Pabna</a>
        <a href="#square">Establishment of Square</a>
        <a href="#growth">Consistent Growth</a>
        <a href="#accolades">Associations and Accolades</a>
        <a href="#church">Involvement with the Church</a>
        <a href="#demise">Demise</a>
      </nav>
      <div class="prose">
        <section id="early-life" >
          <h2>Early Life</h2>
          <p>Samson H Chowdhury was born on 25 September 1925 at Aruakandi in Gopalganj. His father, Eakub Hossain Chowdhury, was a medical officer. Samson started his schooling in a mission school in Chandpur, since his father was posted at the Chandpur Mission Hospital. In 1932 Mr EH Chowdhury was transferred to Ataikula in Pabna. Samson moved with him and was admitted to a village school there. In 1933 his father sent him to Mymensingh for a better education, where he joined the Victoria Mission School in class IV.</p>
          <p>After two years in Mymensingh, Samson moved to West Bengal in 1935 and joined Siksha Sangha High School in Bishnupur, around 15 miles from Kolkata. He had to leave before completing his schooling when World War II broke out. His family felt it unsafe to be away from home during the war, and Samson returned to his village in 1942. He began again at Ataikula High School in Pabna, took the Matriculation Examination in 1943 and passed.</p>
          <p>At 17, Samson left home for Kolkata with a few friends, without informing his family. He first sheltered at his uncle's house, then left for Mumbai in search of a fortune. He looked for work across the port city, faced an interview at the naval recruiting section, and was selected.</p>
        </section>
        <section id="navy" >
          <h2>Life in the Navy</h2>
          <p>Samson always had a knack for new technology. Recruited by the Navy, he was appointed to the signalling section. He refused. Instead he applied to be a radar operator, keen to learn how radar traced enemy ships and planes. Radar was a new invention then, used secretly during the war. For disobedience in a force, Samson was sent to prison.</p>
          <div class="pull">Every morning the officer came and asked if he had changed his mind. On the fifth day, the officer gave in and appointed him to the radar unit.</div>
          <p>Samson served in the Royal Indian Navy for around three years. When the war ended he returned with his colleagues to Visakhapatnam. There, in February 1946, he joined a naval mutiny against the British ruler and was caught. After five days in prison the mutineers were taken to Talwar, then the naval headquarters, and held in a castle barrack. The rebels received clemency and a choice: stay in the force or quit. Samson quit. Surprisingly, he was given a clean certificate of discharge and a recommendation for a government job in any administrative position or in the law and order agency.</p>
        </section>
        <section id="post-office" >
          <h2>Job at the Post Office</h2>
          <p>Back home, Samson joined the postal department in Pabna in 1947. On 6 August that year he married Anita Biswas. He was 21. His duty was correspondence, but a young man just back from war did not confine himself to clerical work; he got involved in the trade union movement of postal workers. One day a police officer walked into the post office and refused to queue with everyone else. Samson protested. The two scuffled, and the strong, sturdy Samson gave the unruly lawman a beating. The matter went to higher authorities, and as punishment both men were transferred. In 1952 Samson quit and returned home.</p>
        </section>
        <section id="pabna" >
          <h2>New Venture in Pabna</h2>
          <figure><div class="frame"><img src="{P}with-familly-members/06.jpg" style="--focus: 70% 12%" alt="Samson and Anita Chowdhury at their golden wedding anniversary" loading="lazy" width="900" height="600"></div><figcaption>Golden wedding anniversary with Anita Chowdhury, 6 August 1997. From the album With Family Members.</figcaption></figure>
          <p>On his father's advice, Samson began running Hossain Pharmacy, the medicine shop his father had opened in his own name after the mission's charitable dispensary closed. Eakub Hossain Chowdhury was a popular medical officer, and patients came from remote areas to consult him. The pharmacy was already doing well when Samson took it over. The family owned land and was comfortable. But Samson was not satisfied. He decided to set up a medicine factory.</p>
          <p>In 1956 he borrowed 5,000 taka from his father and named the company Esons, meaning Eakub Hossain and sons. He began with syrups, manufactured at home. He was the owner, the worker, the distributor and the marketing officer. The only assistant in his factory was his wife, Anita.</p>
        </section>
        <section id="square" >
          <h2>Establishment of Square</h2>
          <p>In Pabna at the time, a Hindu pharmacist manufactured an anti-malaria mixture. In 1947 he migrated to India, and the person who bought his pharmacy later established a pharmaceutical company named Edruk. This boosted Samson's confidence: if they could build a pharmaceutical company from a small medicine factory, why couldn't he?</p>
          <p>Samson had a good friend, Dr Kazi Harunar Rashid, who came from Pabna town twice a week to sit at his shop on market days. Samson shared his idea and asked him to be a partner. Dr Rashid happily agreed. Samson also brought in Dr PK Saha and Radha Binod Roy, and the four made a plan for a pharmaceutical company. Samson named it Square.</p>
          <div class="pull">"We named it Square because we, four friends, built the company. The four sides have to be equal to make it a square. That symbolises accuracy and perfection."</div>
          <p>In 1958 Square started with just Rs 17,000. Samson put in the Tk 5,000 from Esons plus two thousand more, and the three friends gave two to three thousand each. He rented a small tin-shed house in Pabna town and turned it into a factory with 12 workers. The first medicine was the blood purifier Easton Syrup. For three years Square made no profit, and the partners had to invest more, reaching Tk 80,000. In the fourth year Square made a profit, and it has never looked back.</p>
          <p>In 1962 the company opened a branch office at Hatkhola in Dhaka. In 1964 it became a private limited company. The turning point came in 1974, when Square became a licensee of Janssen Pharmaceutica of Belgium, a Johnson and Johnson subsidiary. The agreement pushed Square to modernise its plant and adopt international manufacturing standards, producing the anti-worm medicine Virmox and the diarrhoea medicine Imodium. The 1982 drug policy, which restricted multinationals from manufacturing 1,700 medicines so that local companies could grow, was a blessing. Within three years, in 1985, Square became market leader among all national and multinational companies, a position it has held since. In 1987 Square became the first Bangladeshi pharmaceutical company to export.</p>
        </section>
        <section id="growth" >
          <h2>Consistent Growth of Square</h2>
          <figure><div class="frame"><img src="{P}while-at-work-or-at-leisure/02.jpg" style="--focus: 28% 25%" alt="Samson H Chowdhury at work" loading="lazy" width="900" height="600"></div><figcaption>At work. From the album At Work and at Leisure.</figcaption></figure>
          <p>In 1991, when Square became a public limited company, people showed their confidence by vastly oversubscribing the offer and paying Tk 900 for shares with a face value of Tk 100. In 1995 Square began producing Active Pharmaceutical Ingredients. In 1997 it received the National Export Trophy, in 1998 ISO 9001 certification, and in 2010 the Best Enterprise award from The Daily Star and DHL Worldwide Express.</p>
          <p>Square Toiletries began as a separate division in 1988. Square Textiles started in 1994, with a second unit a year later, and was listed in 2002. The Agro-chemicals and Veterinary Products Division began in 1998. Square Spinning started in 2000 and Square Knit Fabrics in 2001. That same year Square Fashions and Square Consumer Products commenced operations, and Square InformatiX and Square Hospitals were incorporated.</p>
        </section>
        <section id="accolades" >
          <h2>Associations and Accolades</h2>
          <p>Samson H Chowdhury was a deeply respected figure in the business community, holding many positions in trade bodies and receiving many awards. In 1998 AmCham named him Business Executive of the Year for his pursuit of professional excellence, high ethical standards and contribution to society. In 2000 The Daily Star and DHL named him Business Person of the Year. He received the Mercantile Bank Award in 2003 for special contributions to the country's industrial and commercial sectors, and Square received the Bankers' Forum Award in 2005 for ethical and socially responsible business practices.</p>
          <p>He was President of the Metropolitan Chamber of Commerce and Industry in 1996-97, Chairman of MIDAS, Vice President of ICC Bangladesh, Chairman of the Central Depository Bangladesh Ltd, President of the Bangladesh Association of Pharmaceutical Industries, Director of FBCCI, Founding President of the Bangladesh Association of Publicly Listed Companies, President of the Bangladesh Herbal Products Manufacturing Association, Executive Member of the French-Bangladesh Chamber and Director of the Credit Rating Agency of Bangladesh.</p>
          <p>The government consulted him on industrial policy at different periods, and he sat on the committee that published "Bangladesh Development Strategies for the 1990s" in 1991. The National Board of Revenue honoured him as the country's highest taxpayer on the first National Income Tax Day, 15 September 2008, and the government named him a Commercially Important Person for 2009-2010.</p>
          <p><a class="btn" href="accolades.html">See every honour {A}</a></p>
        </section>
        <section id="church" >
          <h2>Involvement with the Church</h2>
          <figure><div class="frame"><img src="{P}philanthropic-endeavors/03.jpg" style="--focus: 45% 72%" alt="Laying the foundation stone of the NCC building" loading="lazy" width="900" height="600"></div><figcaption>Laying the foundation stone of the NCC building, 1978.</figcaption></figure>
          <p>Samson H Chowdhury was a born-again Christian who never had breakfast without reading the Bible. He introduced a family rule: No Bible, No Breakfast. He believed it was his duty as a human being to serve his fellow creatures, and he served the churches in many capacities, showing prudence when they faced pressure from governments and from religious fanatics. Catholics and Protestants alike held him in high esteem.</p>
          <p>As a young married man in the early 1950s he became involved at national level in the East Bengal Baptist Union, now the Bangladesh Baptist Church Fellowship. In 1956 he became its honorary general secretary and served for 11 years, despite colleagues telling him to spend less time on church work. He represented the BBCF at the Baptist World Alliance for many years and served as its vice president from 1985 to 1990. He was elected President of the BBCF in 1976, 1978, 1980, 1983-85 and 1990-93.</p>
          <p>He was also honorary secretary of the East Pakistan Christian Council, later the National Council of Churches Bangladesh, in 1961-64 and 1968-72, and its President in 1975 and 1978. Through the council and the World Council of Churches he was able to tell the world the true story of what was happening in Bangladesh during the 1971 Liberation War. In 1973, at a donor consortium in Stuttgart, his initiative led to the founding of the Christian Commission for Development of Bangladesh to carry out relief and development work in the new state.</p>
          <p>He encouraged agricultural work with David Stockley of the Baptist Missionary Society, sourced funds for cholera and smallpox vaccinations in the marshy areas of Barisal and Faridpur, and in 1983 helped establish Koinonia, chairing it until 2009. He saw himself as a steward of God and quietly supported individuals, churches and Christian organisations across the country.</p>
          <div class="pull">"I have given many hours and days and months to God, but my business has never suffered. God indeed does not owe me anything. Rather I continue to owe to God for the blessings he has given me."</div>
        </section>
        <section id="demise" >
          <h2>Demise</h2>
          <p>Samson H Chowdhury passed away at 86 on Thursday, 5 January 2012, while undergoing treatment at Raffles Hospital in Singapore. He left behind his wife, three sons, a daughter and a host of relatives and well-wishers. Funeral prayers were held at the Kakrail Catholic Church in Dhaka around 11pm on 6 January. Ministers, lawmakers of both the ruling and opposition parties, bureaucrats, business leaders, bankers, industrialists and media professionals joined the family. On 7 January, around 2pm, he was laid to rest at his Astra Farmhouse in Pabna.</p>
          <p>The news brought a pall of gloom at every level of society. The Prime Minister, the Leader of the Opposition, the Finance Minister, the Industries Minister and the Governor of Bangladesh Bank joined the mourners. On 16 January the cabinet unanimously adopted a condolence motion. On 14 January 2012, FBCCI, MCCI, ICC Bangladesh, DCCI and CCCI held a joint memorial meeting at the Bangabandhu International Conference Centre in Dhaka. It began with a minute of silence.</p>
          <p><a class="btn btn-primary" href="recollections.html">Read the recollections {A}</a></p>
        </section>
      </div>
    </div>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="section-head"><h2 class="h2">Continue exploring</h2></div>
    {continue_links([("accolades.html","Honours and positions of trust","Seven national honours and thirty-one roles."),("recollections.html","How his peers remember him","Ten recollections, first published in 2012 and 2013."),("quotes.html","In his own words","Nine sayings, with the moments that produced them.")])}
  </div>
</section>
'''

scripts = '''<script>
(function(){
  var links = document.querySelectorAll('.toc a');
  var secs = [].map.call(links, function(a){ return document.querySelector(a.getAttribute('href')); });
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ links.forEach(function(l){ l.classList.toggle('is-current', l.getAttribute('href') === '#' + e.target.id); }); } });
  }, { rootMargin: '-20% 0px -70% 0px' });
  secs.forEach(function(s){ if(s) io.observe(s); });
  var pills = document.querySelectorAll('.page-hero .pill');
  pills.forEach(function(p){ p.addEventListener('click', function(){ pills.forEach(function(x){ x.classList.remove('is-active'); }); p.classList.add('is-active'); }); });
})();
</script>'''
page("biography.html", "Biography", "The life of Samson H Chowdhury, from Gopalganj in 1925 to the founding of Square in 1958 and beyond: timeline and full biography.", body, scripts)
