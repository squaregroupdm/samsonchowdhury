# Rebuilds every HTML page from the templates in this folder.
# Run from anywhere:  python3 build/build_all.py
import os, runpy, sys
here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here)
for name in ["build_home", "build_bio", "build_mid", "build_media", "build_about"]:
    runpy.run_path(os.path.join(here, name + ".py"), run_name="__main__")
