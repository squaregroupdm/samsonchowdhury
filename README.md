# Samson H Chowdhury website (v6: dignified, editorial, immediate)

Plain HTML, CSS and JavaScript. No installation, no build step, no database, no libraries.
Upload the whole folder to any web host and it works. The live copy is deployed from this
repository to Cloudflare Workers (see wrangler.jsonc).

## Files, sorted A to Z

- about.html : About this archive: purpose, sources, accuracy notes, language
- accolades.html : Honours (award name first, year second) and positions held, with filter pills
- build/ : The Python templates that generate every HTML page. Edit a template, then run `python3 build/build_all.py`. Editing the HTML directly also works, but the next build would overwrite it.
- biography.html : Portrait header, decade timeline, the full life story with a sticky table of contents and three archival photographs
- css/styles.css : The entire design system (colours, type scale, layout, motion)
- data/media-data.js : Photo albums, captions and video list
- data/news-data.js : The 13 archive records without online originals (honours, events). Each has a stable id used for its permanent link.
- data/press-data.js : Every press article about him found online (105 at last count), with source, date, summary, link and, where one exists, a screen capture in img/press/. Add new articles at the top of this list.
- data/quotes-data.js : Every quote. Each has a stable id used for its permanent link.
- data/tributes-data.js : The short recollections rotating on the home page
- img/favicon.svg : Browser tab icon
- img/never-stop-thinking.png : The handwritten motto above the name, transparent background
- img/og.jpg : The picture shown when a link to the site is shared on WhatsApp or Facebook
- img/portrait-bio.jpg : The full portrait, used on the Biography page
- img/press/ : Screen captures of newspaper pages, one per article that allowed capture, named by the article id
- img/portrait-sm.jpg : The small portrait used in the menu
- img/portrait-tribute.jpg : The portrait beside the recollection on the home page
- img/seq/ : The 163 frames of the scroll-turned portrait (f001 to f163.webp), background made transparent
- img/signature.png : His signature, transparent background, above the footer; signature-sm.png is the header copy
- index.html : Home page
- js/globe.js : The News Room globe of newspaper pages (drag, click to open, full screen) and the filterable archive list
- js/main.js : Shared behaviour (header, menu, reveals, quote deck, recollection carousel, lightbox, copy buttons)
- js/scrub.js : The scroll-turned portrait in the hero (draws the frame that matches the scroll position)
- js/sky.js : The star field behind every page, drawn once
- js/story.js : Count-up for the one quantity on the home page (36,000)
- js/timeline.js : The milestones scroller on the home page (previous/next, year rail, keyboard)
- newsroom.html : A glass globe tiled with every newspaper page in the archive, then the searchable, filterable list with permanent links per record
- photos.html : Album filter plus lightbox gallery
- quotes.html : Quote wall with copy and permanent-link buttons
- recollections.html : One featured recollection, nine more that expand in place
- videos.html : Film grid with in-page player, duration badges and error states
- wrangler.jsonc : Cloudflare Workers deployment settings (static assets from this folder)

## How to preview on your computer

1. Download the folder.
2. Double-click index.html. It opens in your browser.
3. Everything works offline except photos and videos, which still load from the old samsonchowdhury.com server (see below).

## How to add a news item (no coding needed)

For an article that exists online, use data/press-data.js (fields: id, date, title, summary, source, url, type, lang). For an event or honour with no online original, use data/news-data.js. Both work the same way:

1. Open the file in Notepad (Windows) or TextEdit (Mac).
2. Copy one block that starts with { and ends with }, (including the comma).
3. Paste it directly under the line `window.NEWS = [`.
4. Change the id (short, unique, never change it later), date (YYYY-MM-DD), title, summary, source, url and type.
   type must be one of: Tribute, Award, Event, Coverage, Announcement
   url: paste the link to the original article, or leave "" if there is none. Never invent one.
5. Save. Refresh the page. The newest date becomes the featured record ("From the archive").

Adding a quote works the same way in data/quotes-data.js (give it an id too).

## Photos and videos

The pages still load images from https://samsonchowdhury.com/en/photo-gallery/ and videos from https://samsonchowdhury.com/en/videos/.
If that server cannot be reached, every photo hides itself cleanly, the milestone cards fall back to a typographic design, and the Photos and Videos pages show one quiet notice instead of empty tiles.

To make the site self-contained:

1. Copy the old site's `photo-gallery` and `videos` folders into the same folder as index.html.
2. In data/media-data.js change
   `window.PHOTO_BASE = "https://samsonchowdhury.com/en/";` to `window.PHOTO_BASE = "";`
   and `window.VIDEO_BASE = "https://samsonchowdhury.com/en/videos/";` to `window.VIDEO_BASE = "videos/";`
3. In build/build_common.py change `P = "https://samsonchowdhury.com/en/photo-gallery/"` to `P = "photo-gallery/"` and run `python3 build/build_all.py` (or search index.html and biography.html for the old address and replace it with `photo-gallery/`).

To add a photo to an album: upload NN.jpg into that album's folder, then add "NN" to the album's files list in data/media-data.js.

## Things still needed

- A contact address for "Send a recollection". The old placeholder link was removed; the invitation will go back on recollections.html once a real address is supplied.
- The original photo-gallery and videos folders, so the archive no longer depends on the old server.
- A reviewed Bangla translation before any language switch is added.

## Design notes

- Register: dignified, editorial, cinematic, historically credible. Deep ink background, warm ivory text, one champagne accent. Geist for navigation and body, Cormorant Garamond for quotations only.
- Scrolling is native everywhere. Nothing intercepts the wheel or touch. There is no smooth-scroll library, no scroll-jacking and no mandatory snapping.
- The hero holds for one extra screen of scrolling while the portrait turns; the frame follows the scroll position directly, in both directions. A poster frame shows until the first frame is decoded; under "reduce motion" the portrait is a still and the page does not hold.
- The home page shows eight milestones in a horizontal scroller with previous/next buttons, a year rail and keyboard arrows. It never captures vertical scrolling. On phones the cards stack.
- Motion shares one easing family: quick state changes (150 to 320 ms) and slower entrances (560 ms, long settle), all opacity and transform only. Scroll-driven pieces (hero portrait, story chapters, milestones, star field) follow the scroll position through short time-based glides, so they feel the same at 60 Hz and 144 Hz.
- Every photograph of him is cropped around his face. The crop point is the `--focus` value in css/styles.css (default upper centre, 50% 30%); individual archive photographs can be adjusted in the FOCUS list in build/build_home.py. Nothing animates permanently; the one exception is a faint shooting star every nine to sixteen seconds, which runs for under a second and is off under "reduce motion".
- Type scale: hero name 44 to 100 px, inner-page titles 38 to 64 px, section headings 30 to 40 px, body 17 px at line height 1.6, labels 13 px.
- Every quotation, recollection, news record and film has a permanent link.
