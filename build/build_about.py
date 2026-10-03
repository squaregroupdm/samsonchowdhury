import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_common import *
A = ARROW

body = f'''
<section class="page-hero">
  <div class="wrap grid">
    <span class="mono kicker reveal">About</span>
    <h1 class="h1 reveal">About this archive</h1>
    <p class="lead reveal" data-delay="1">What this site is, where its material comes from, and how it is kept.</p>
  </div>
</section>
<section class="section-tight" style="border-top:0">
  <div class="wrap about-grid">
    <h2>Purpose</h2>
    <section class="prose">
      <p>This is the archive of Samson H Chowdhury (1925 to 2012), founder of Square Group. It keeps his biography, the honours he received, the recollections of the people who knew him, his photographs and films, his sayings, and the news record of his life and death, in one place and in a form that will last.</p>
      <p>It is maintained by Square Group. It is a record, not a marketing site: nothing here is written to persuade, and every date, quotation and caption is taken from the sources listed below.</p>
    </section>
    <h2>Sources</h2>
    <section class="prose">
      <ul>
        <li>The biography, timeline, honours and positions are taken from the original samsonchowdhury.com, the official site built after his death (site by Digita Interactive).</li>
        <li>The recollections were first published in The Daily Star (January 2012 and January 2013), The Financial Express (6 January 2012), the ICC Bangladesh News Bulletin (January to March 2012) and the FBCCI Business Magazine special issue of June 2012. Each is credited where it appears.</li>
        <li>The photographs are the eight albums of the original archive, with their original captions. The films are the nine films of the original archive.</li>
        <li>The quotations are drawn from the biography and from the recollections, and each gives the moment or the person that recorded it.</li>
      </ul>
    </section>
    <h2>Accuracy</h2>
    <section class="prose">
      <p>Where the sources disagree with each other, the archive says so rather than choosing silently. Two such places: his age at marriage, which the original text gave as 22 while the dates it records (25 September 1925 and 6 August 1947) make 21; and The Daily Star-DHL award, which the original site lists under both 2000 and 2001. Both are noted where they appear.</p>
      <p>Nothing has been added that cannot be traced to a source. Where a photograph or film cannot currently be shown, the page says so instead of showing a blank.</p>
    </section>
    <h2>Language</h2>
    <section class="prose">
      <p>The archive is published in English. Its structure is prepared for a Bangla edition, which will be added when a reviewed translation is ready rather than as an unreviewed one.</p>
    </section>
    <h2>Share</h2>
    <section class="prose">
      <p>Every record has a permanent link: each quotation, each recollection, each news record and each film can be linked to directly. The pages carry preview images and descriptions so that a shared link shows properly.</p>
      <p><a class="btn" href="index.html">Return to the archive {A}</a></p>
    </section>
  </div>
</section>
'''
page("about.html", "About this archive", "What the Samson H Chowdhury archive is, where its material comes from, and how it is maintained by Square Group.", body)
