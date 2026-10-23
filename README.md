# LLSSS partial cutter

A browser tool for continuing a spaceship *partial* (a ship with a valid front and an unfinished back) with
amling's **rlife** LLSSS search (`rlife llsss` / `rlife llsss-recentering`). You paste the partial; the cutter
finds where it stops being valid, cuts it there, and gives you a start file plus the exact rlife command to
run. The search itself runs in rlife on your computer.

Works for orthogonal, diagonal and knightwise partials in any isotropic non-totalistic (INT) rule.
Designed by LuveelVoom; code written by Claude. It is likely to have bugs: please report them with the RLE you
used, the options you picked and what the cutter produced.

## Use

Open `tool/llsss-partial-builder-offline.html` in a browser. It is one self-contained file and works offline.

1. **Paste a partial**: an RLE with every generation side by side (best), a single generation (the cutter
   simulates the rest), or a grid copied from an LLSSS log. A rule in the RLE header is picked up.
2. **Pick what the search should do.** Usually *Recentering from the first error*. Other modes search at a
   fixed width, only the back of the ship, one branch of a split back, a marked region, or along a drawn cut.
3. **Check the cut.** The stats show the speed, direction and symmetry found; the picture shows the errors
   (red dots) and the cut. Click the picture to cut higher up.
4. **Save the start file** (and any constraint files) into the folder you run rlife from, and run the command
   from the Command tab. Results appear in rlife's log as they are found.

The Guide tab in the page explains the modes, where to cut, the options and how to read the log.

## Getting rlife

rlife is amling's program and isn't included here. Build it from its own source with `cargo build --release`
(Rust 2024 edition), using a version from after commit 5c48bb53850d (it fixes a hang).

## Files

| Path | What it is |
|---|---|
| `tool/llsss-partial-builder-offline.html` | The tool |
| `tool/llsss-partial-builder.html` | The same tool with web fonts, for hosting online |
| `tool/core.js` | The cutter logic as a Node module, for scripting: `const C = require('./core.js')` |
| `test-packs/` | Example partials and test searches, each with a README |
| `docs/llsss-notes.md` | Background: amling's notes on the search, terminology, test history |

Editing the tool: change the offline page, then run `python3 tool/sync.py` to regenerate the online copy and
`core.js` (`--check` reports whether they are up to date). Development notes are in `00-READ-ME-FIRST.md`.
