#!/usr/bin/env python3
"""Attach an LLSSS partial (log grid or LifeHistory RLE) to the front it grew from.

usage: python3 splice.py FRONT PARTIAL [--mirror odd|even|none] [--rule RULE] [--out PREFIX]

FRONT   the start file you searched from (pipe grid, XYT view), e.g. p5-branch.in
PARTIAL a grid copied from the search log (timestamps are fine) or the
        "partial RLE" LifeHistory block the log prints.
Writes PREFIX-half.in (spliced grid), PREFIX-full.in (mirrored, all generations)
and PREFIX-gen0.rle (one generation at full width, to paste into Golly).
"""
import re, sys, argparse

def parse_grid(text):
    rows = []
    for ln in text.splitlines():
        a, b = ln.find("|"), ln.rfind("|")
        if a < 0 or b <= a:
            continue
        secs = []
        for s in ln[a + 1:b].split("|"):
            if s.startswith(" "): s = s[1:]
            if s.endswith(" "): s = s[:-1]
            secs.append(s)
        rows.append(secs)
    return rows

def parse_rle(text):
    lines = [l for l in text.splitlines() if not l.startswith("#")]
    i = next(k for k, l in enumerate(lines) if re.match(r"\s*x\s*=", l))
    body = "".join(lines[i + 1:]).split("!")[0].replace(" ", "")
    out, cur = [], []
    for n, tag in re.findall(r"(\d*)([A-X.$bo])", body):
        n = int(n or 1)
        if tag == "$":
            out.append(cur); cur = []
            out.extend([[]] * (n - 1))
            continue
        ch = {"A": "*", "C": "*", "E": "*", "o": "*", "B": ".", "D": ".", "b": ".", ".": " ", "F": "|"}.get(tag, ".")
        cur.extend([ch] * n)
    out.append(cur)
    return parse_grid("\n".join("".join(r) for r in out))

def load(path):
    t = open(path).read().replace("\u00a0", " ")
    return parse_rle(t) if re.search(r"^\s*x\s*=\s*\d+", t, re.M) else parse_grid(t)

def cells(rows):
    """(y, t) -> row string for rows made only of . and *"""
    d = {}
    for y, secs in enumerate(rows):
        for t, s in enumerate(secs):
            if s.strip() and set(s) <= set(".*"):
                d[(y, t)] = s
    return d

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("front"); ap.add_argument("partial")
    ap.add_argument("--mirror", default="odd", choices=["odd", "even", "none"])
    ap.add_argument("--rule", default="B3/S23")
    ap.add_argument("--out", default="spliced")
    a = ap.parse_args()
    F, P = cells(load(a.front)), cells(load(a.partial))
    N = max(t for _, t in F) + 1
    best = None
    for d in range(-200, 201):
        agree = clash = 0
        for (y, t), s in P.items():
            f = F.get((y + d, t))
            if f is None:
                continue
            w = max(len(f), len(s))
            if f.ljust(w, ".") == s.ljust(w, "."):
                agree += 1
            else:
                clash += 1
        if agree and (best is None or (clash, -agree) < (best[1], -best[2])):
            best = (d, clash, agree)
    if best is None:
        sys.exit("No overlap found: is this partial from a search that started from FRONT?")
    d, clash, agree = best
    print(f"partial row r = front row r+{d}; {agree} overlapping rows agree, {clash} differ "
          f"(differences are rows the search was allowed to rewrite)")
    merged = dict(F)
    for (y, t), s in P.items():
        merged[(y + d, t)] = s          # partial wins wherever it has cells
    W = max(len(s) for s in merged.values())
    ys = [y for y, _ in merged]
    y0, y1 = min(ys), max(ys)
    def full(s):
        s = s.ljust(W, ".")
        if a.mirror == "odd": return s[:0:-1] + s
        if a.mirror == "even": return s[::-1] + s
        return s
    half = ["| " + " | ".join(merged.get((y, t), " " * W).ljust(W, ".") if (y, t) in merged else " " * W
                               for t in range(N)) + " |" for y in range(y0, y1 + 1)]
    FW = len(full("."))
    fullg = ["| " + " | ".join(full(merged[(y, t)]) if (y, t) in merged else " " * FW
                               for t in range(N)) + " |" for y in range(y0, y1 + 1)]
    open(a.out + "-half.in", "w").write("\n".join(half) + "\n")
    open(a.out + "-full.in", "w").write("\n".join(fullg) + "\n")
    g0 = [full(merged[(y, 0)]) if (y, 0) in merged else "." * FW for y in range(y0, y1 + 1)]
    while g0 and "*" not in g0[0]: g0.pop(0)
    while g0 and "*" not in g0[-1]: g0.pop()
    body = []
    for r in g0:
        r = r.rstrip(".")
        for m in re.finditer(r"(\*+|\.+)", r):
            n = len(m.group(0)); body.append((str(n) if n > 1 else "") + ("o" if m.group(0)[0] == "*" else "b"))
        body.append("$")
    txt, line = "", ""
    for tok in (body[:-1] if body else []) + ["!"]:
        if len(line) + len(tok) > 70: txt += line + "\n"; line = ""
        line += tok
    open(a.out + "-gen0.rle", "w").write(f"x = {FW}, y = {len(g0)}, rule = {a.rule}\n{txt}{line}\n")
    print(f"wrote {a.out}-half.in, {a.out}-full.in, {a.out}-gen0.rle ({FW} wide, {len(g0)} tall)")

if __name__ == "__main__":
    main()
