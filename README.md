# Samson H Chowdhury website (v5: starry sky, portrait, scroll timeline)

Plain HTML, CSS and JavaScript. No installation, no build step, no database.
Upload the whole folder to any web host (Hostinger, cPanel, Cloudflare Pages, Netlify) and it works.

## Files, sorted A to Z

- accolades.html : Honours and positions held, with filter pills
- biography.html : Decade timeline plus the full life story with a sticky table of contents
- css/styles.css : The entire design system (colours, type, layout, motion)
- data/media-data.js : Photo albums, captions and video list
- data/news-data.js : Every News Room item. Edit this file to add news.
- data/quotes-data.js : Every quote. Edit this file to add quotes.
- data/tributes-data.js : The short recollections rotating on the home page
- img/never-stop-thinking.png : The handwritten motto above the name, transparent background
- img/og.jpg : The picture shown when a link to the site is shared on WhatsApp or Facebook
- img/portrait-sm.jpg : The portrait used in the menu overlay
- img/seq/ : The 120 frames of the scroll-driven portrait (f001 to f120.webp), cut from SCH.mp4 with the black background made transparent
- img/signature.png : His signature (from the clean master), transparent background, used above the footer; signature-sm.png is the header copy
- index.html : Home page
- js/main.js : Shared behaviour (menu, smooth scroll, reveals, cursor light, tilt cards, 3D ring, quote deck, lightbox)
- js/sky.js : The starry sky behind every page (three depth layers, twinkle, shooting stars)
- js/scrub.js : The scroll-driven portrait in the hero (draws the frame that matches the scroll position)
- js/story.js : Home-page storytelling: count-up numbers, the sticky statement, parallax
- js/timeline.js : The scroll-driven timeline on the home page
- js/vendor/ : Three.js, GSAP, ScrollTrigger and Lenis, stored locally so nothing depends on the internet
- newsroom.html : Searchable, filterable news archive
- photos.html : Album filter plus lightbox gallery
- quotes.html : Quote wall with copy buttons
- recollections.html : Ten tributes, expandable
- videos.html : Video grid with in-page player

## How to preview on your computer

1. Unzip the folder.
2. Double-click index.html. It opens in your browser.
3. Click through the menu. Everything works offline except photos and videos, which load from the current samsonchowdhury.com server until you move them (see below).

## How to add a news item (no coding needed)

1. Open data/news-data.js in Notepad (Windows) or TextEdit (Mac).
2. Copy one block that starts with { and ends with }, (including the comma).
3. Paste it directly under the line `window.NEWS = [`.
4. Change the date (YYYY-MM-DD), title, summary, source, url and type.
   type must be one of: Tribute, Award, Event, Coverage, Announcement
5. Save. Refresh the page. The newest date automatically becomes the featured story.

Adding a quote works the same way in data/quotes-data.js.

## Photos and videos

Right now the pages load images from https://samsonchowdhury.com/en/photo-gallery/ and videos from https://samsonchowdhury.com/en/videos/.
When you host the new site on samsonchowdhury.com itself:

1. Copy the existing `photo-gallery` and `videos` folders into the same folder as index.html.
2. In data/media-data.js change
   `window.PHOTO_BASE = "https://samsonchowdhury.com/en/";` to `window.PHOTO_BASE = "";`
   and `window.VIDEO_BASE = "https://samsonchowdhury.com/en/videos/";` to `window.VIDEO_BASE = "videos/";`

To add a photo to an album: upload NN.jpg and NN-th.jpg (thumbnail) into that album's folder, then add "NN" to the album's files list in data/media-data.js.

## Things to change before going live

- recollections.html has a "Send a recollection" button. Replace REPLACE-WITH-YOUR-EMAIL with the real address.
- The hero portrait on the home page currently uses photo-gallery/while-at-work-or-at-leisure/01.jpg. Swap the file name in index.html for the portrait you prefer.
- The fonts (Geist, Geist Mono and Cormorant Garamond) load from Google Fonts. Everything else is local. If the font fails to load the site uses a system font.

## Design notes

- Register: futuristic and classy. Near-black midnight base with a starry sky behind every page; colour arrives only as light in four spectral hues (cyan, violet, magenta, amber). Geist for headlines and text, Geist Mono for years and labels, Cormorant Garamond for quotations only.
- The sky is a live WebGL field: three layers of stars at different depths, twinkling, drifting gently with the cursor and with scroll, and shooting stars every few seconds. It runs behind the whole site.
- The hero is pinned for about one and a half screens of scrolling. On the right, a 163-frame sequence cut from a 3D orbit of his portrait plays forward as you scroll down and backward as you scroll up; the page only moves on once the orbit is complete. The black background was cut out of every frame, so he sits on the sky with no veil. Frames are decoded once into GPU bitmaps; the portrait holds still until every frame has arrived, then the frame index follows the wheel directly with a cross-fade between neighbouring frames, so there is no lag and no self-motion. "Never Stop Thinking" writes itself in above the name on load. His signature is the site mark in the header and draws itself once per visit.
- "The man" is a sticky editorial statement: the section holds for part of the scroll while the words sharpen from blur, justified, at reading size.
- Fact cards are compact: label, number, description. Numbers count up when they enter view; the border lights where the cursor is; the image card colours on hover.
- "Eighty-six years, one line" is a scroll-driven timeline: the section pins, vertical scrolling moves sixteen moments sideways, a spectral progress line fills, the card at the centre lights up and opens, and the year rail jumps to any point. On phones it is a swipeable strip.
- Fact cards tilt toward the cursor; the lead award and the quote deck carry a rotating spectral border; the photo strip is a coverflow; a soft cursor light follows the pointer.
- Shape rule: panels 20px radius, images 14px, buttons and chips fully round.
- All motion, including the sky, becomes still for visitors who set "reduce motion" in their system.

## Replacing the hero video
Film or render the subject on pure black. Ask for the frames to be extracted and keyed (the script is in the project notes); name them f001.webp onward in img/seq/, and set COUNT in js/scrub.js to the number of frames.
