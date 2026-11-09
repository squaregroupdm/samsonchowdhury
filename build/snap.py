"""Take a screen capture of every online article in data/press-data.js that has no picture yet, and
write the file name back into the data. Run from the repository root:

    pip install playwright pillow && python -m playwright install chromium
    python3 build/snap.py            # all records without a picture
    python3 build/snap.py --only ID  # one record
    python3 build/snap.py --redo     # also replace live-snapshot and Drive-hosted pictures

Each capture is the top of the page at 1200 px wide, saved as img/press/<id>.jpg. Pages that refuse
to load, or that show a "verify you are human" or "403" screen, are skipped and listed at the end.
"""
import json, re, sys, os, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "press-data.js"
OUT = ROOT / "img" / "press"
OUT.mkdir(parents=True, exist_ok=True)

src = DATA.read_text(encoding="utf-8")
m = re.search(r"window\.PRESS = (\[.*?\]);\s*$", src, re.S)
records = json.loads(m.group(1))

only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
redo = "--redo" in sys.argv

def wants(r):
    if only: return r["id"] == only
    if not r.get("url", "").startswith("http"): return False
    img = r.get("img", "")
    if not img: return True
    return redo and (img.startswith("http"))  # pictures served from elsewhere

todo = [r for r in records if wants(r)]
print(f"{len(todo)} pages to capture")

BLOCK_WORDS = ["verify you are human", "performing security verification", "you have been blocked", "access denied",
               "403 forbidden", "attention required", "just a moment", "checking your browser", "enable javascript and cookies"]

from playwright.sync_api import sync_playwright
from PIL import Image

skipped, done = [], []
with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 1200, "height": 900}, device_scale_factor=1, locale="en-US",
                              user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36")
    for r in todo:
        page = ctx.new_page()
        try:
            page.goto(r["url"], wait_until="domcontentloaded", timeout=45000)
            try: page.wait_for_load_state("networkidle", timeout=15000)
            except Exception: pass
            time.sleep(1.5)
            # best effort: close cookie and notification prompts
            for sel in ["button:has-text('Accept')", "button:has-text('Agree')", "button:has-text('OK')", "button:has-text('Got it')", "button:has-text('Allow')", "button:has-text('No thanks')", "button:has-text('Later')", "[aria-label='Close']", ".close", "#onesignal-slidedown-cancel-button"]:
                try:
                    b = page.locator(sel).first
                    if b.is_visible(timeout=300): b.click(timeout=1000); time.sleep(0.4)
                except Exception: pass
            text = page.inner_text("body")[:4000].lower() if page.locator("body").count() else ""
            if any(w in text for w in BLOCK_WORDS) and len(text) < 1500:
                skipped.append((r["id"], "blocked page")); page.close(); continue
            tmp = OUT / (r["id"] + ".png")
            page.screenshot(path=str(tmp), full_page=False)
            im = Image.open(tmp).convert("RGB")
            dest = OUT / (r["id"] + ".jpg")
            im.save(dest, "JPEG", quality=82, optimize=True)
            tmp.unlink()
            r["img"] = f"img/press/{r['id']}.jpg"; r["focus"] = "top"
            done.append(r["id"]); print("ok ", r["id"])
        except Exception as e:
            skipped.append((r["id"], str(e).splitlines()[0][:80])); print("skip", r["id"], e.__class__.__name__)
        finally:
            try: page.close()
            except Exception: pass
    browser.close()

out = src[:m.start(1)] + json.dumps(records, ensure_ascii=False, indent=2) + src[m.end(1):]
DATA.write_text(out, encoding="utf-8")
print(f"\ncaptured {len(done)}, skipped {len(skipped)}")
for s in skipped: print("  ", *s)
