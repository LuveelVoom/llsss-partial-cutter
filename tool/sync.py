#!/usr/bin/env python3
"""Make the online copy and core.js from the offline page, which is the only file to edit.

    python3 tool/sync.py          # rewrite both
    python3 tool/sync.py --check  # exit 1 if either is out of date

The online copy differs only in its web fonts and in saving through the host's downloads capability
(which adds .txt to file names). core.js is the page's Core module, so Node can run it.
"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OFFLINE = os.path.join(HERE, "llsss-partial-builder-offline.html")
ONLINE = os.path.join(HERE, "llsss-partial-builder.html")
CORE = os.path.join(HERE, "core.js")

FONTS = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
"""
OFFLINE_SAVE = """/* local saving: a normal browser download (no server needed) */
const downloads = { save: async ({ filename, data }) => {
  const url = URL.createObjectURL(new Blob([data], { type: "text/plain" }));
  const a = document.createElement("a"); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
} };
"""
ONLINE_SAVE = """// downloads capability (optional)
let downloads = null;
(async () => { try { if (window.claude && window.claude.use) downloads = await window.claude.use("downloads"); } catch (e) {} if (last){ $("save").hidden = !downloads; syncSave(); } })();"""
OFFLINE_NAME = """  const fn = name.replace(/[^\\w.\\-]/g, "_") + "";
  try { await downloads.save({ filename: fn, data }); toast("Saved " + fn); }"""
ONLINE_NAME = """  const fn = name.replace(/[^\\w.\\-]/g, "_") + ".txt";
  try { await downloads.save({ filename: fn, data }); toast("Saved " + fn + ": remove the .txt ending"); }"""


def swap(s, old, new):
    if s.count(old) != 1:
        sys.exit("sync.py: expected exactly one copy of:\n" + old)
    return s.replace(old, new)


def make():
    page = open(OFFLINE, encoding="utf-8").read()
    online = swap(page, "<style>", FONTS + "<style>")
    online = swap(online, OFFLINE_SAVE, ONLINE_SAVE)
    online = swap(online, OFFLINE_NAME, ONLINE_NAME)
    start = page.index("<script>\n") + len("<script>\n")
    end = page.index("})();\n", start) + len("})();\n")
    core = page[start:end] + '\nif (typeof module !== "undefined") module.exports = Core;\n'
    return {ONLINE: online, CORE: core}


def main():
    stale = []
    for path, text in make().items():
        old = open(path, encoding="utf-8").read() if os.path.exists(path) else None
        if old == text:
            continue
        stale.append(os.path.basename(path))
        if "--check" not in sys.argv:
            open(path, "w", encoding="utf-8").write(text)
    if "--check" in sys.argv:
        print("out of date: " + ", ".join(stale) if stale else "in sync")
        sys.exit(1 if stale else 0)
    print("rewrote " + ", ".join(stale) if stale else "already in sync")


if __name__ == "__main__":
    main()
