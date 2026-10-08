# Build script: assembles the shared header/footer around each page body.
import os, html

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = "https://samsonchowdhury.com/en/photo-gallery/"
SITE = "https://samsonchowdhury.squareplc.workers.dev"   # change when the custom domain goes live

PAGES = [
    ("index.html", "Home"),
    ("biography.html", "Biography"),
    ("accolades.html", "Accolades"),
    ("recollections.html", "Recollections"),
    ("photos.html", "Photos"),
    ("videos.html", "Videos"),
    ("newsroom.html", "News Room"),
    ("quotes.html", "Quotes"),
]
EXTRA = [("about.html", "About this archive")]

ARROW = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
CHEV_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>'
CHEV_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
SEARCH = '<svg class="fi" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
CHEV_D = '<svg class="fi chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'

def head(title, desc, fname, extra=""):
    full = "Samson H Chowdhury" if fname == "index.html" else f"{title} | Samson H Chowdhury"
    return f'''<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#080c17">
<title>{html.escape(full)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{SITE}/{fname}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Samson H Chowdhury">
<meta property="og:title" content="{html.escape(full)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{SITE}/{fname}">
<meta property="og:image" content="{SITE}/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Geist:wght@400;500&family=Geist+Mono:wght@400&family=Noto+Sans+Bengali:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
{extra}<script>document.documentElement.classList.remove("no-js")</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="sky" data-sky aria-hidden="true"></div>
'''

def nav():
    inline = "".join(f'<li><a href="{f}">{t}</a></li>' for f, t in PAGES[1:])
    menu = "".join(f'<li><a href="{f}">{t}</a></li>' for f, t in PAGES + EXTRA)
    return f'''<header class="nav">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Samson H Chowdhury, home"><img src="img/signature-sm.png" alt="Samson H Chowdhury" width="600" height="212"><small>1925 - 2012</small></a>
    <nav class="nav-right" aria-label="Primary">
      <ul class="nav-inline">{inline}</ul>
      <button class="menu-btn" aria-expanded="false" aria-controls="menu"><span class="txt">Menu</span><i></i></button>
    </nav>
  </div>
</header>
<div class="menu" id="menu" aria-label="Site menu">
  <ul class="menu-links">{menu}</ul>
  <div class="menu-side">
    <img src="img/portrait-sm.jpg" alt="" width="96" height="120">
    <p>Founder of Square Group. Born Aruakandi, Gopalganj, 25 September 1925. Died Singapore, 5 January 2012.</p>
  </div>
</div>
'''

def footer(scripts):
    main_tag = '<script src="js/main.js"></script>'
    sky = '<script src="js/sky.js"></script><script src="js/cursor.js"></script>'
    if "<script>" in scripts:
        i = scripts.index("<script>")
        scripts = scripts[:i] + main_tag + "\n" + scripts[i:]
    else:
        scripts = scripts + "\n" + main_tag
    links = "".join(f'<li><a href="{f}">{t}</a></li>' for f, t in PAGES[:4])
    links2 = "".join(f'<li><a href="{f}">{t}</a></li>' for f, t in PAGES[4:] + EXTRA)
    return f'''<footer class="footer">
  <div class="wrap">
    <div class="footer-mark"><img src="img/signature.png" alt="Signature of Samson H Chowdhury" width="1649" height="582" loading="lazy"></div>
    <div class="footer-grid">
      <p class="lead">An archive of the life, work and words of the founder of Square Group, kept for the generations who will build on what he started.</p>
      <div><h4>Explore</h4><ul>{links}</ul></div>
      <div><h4>Archive</h4><ul>{links2}</ul></div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span data-year></span> Square Group. All rights reserved.</span>
      <span>Aruakandi, Gopalganj, 1925. Astra Farmhouse, Pabna, 2012.</span>
    </div>
  </div>
</footer>
<div class="lightbox" role="dialog" aria-modal="true" aria-label="Media viewer">
  <button class="icon-btn lb-close" aria-label="Close viewer">{CLOSE}</button>
  <div class="lb-frame">
    <button class="icon-btn lb-nav prev" aria-label="Previous">{CHEV_L}</button>
    <div class="lb-media"></div>
    <button class="icon-btn lb-nav next" aria-label="Next">{CHEV_R}</button>
    <div class="lb-cap"><span></span><b></b></div>
  </div>
</div>
{sky}
{scripts}
</body>
</html>
'''

def continue_links(items):
    return '<div class="continue">' + "".join(f'<a class="panel" href="{href}"><b>{t}</b><span>{d}</span></a>' for href, t, d in items) + '</div>'

def page(fname, title, desc, body, scripts="", extra_head=""):
    with open(os.path.join(OUT, fname), "w", encoding="utf-8") as f:
        f.write(head(title, desc, fname, extra_head) + nav() + '<main id="main">' + body + "</main>" + footer(scripts))
    print("wrote", fname)
