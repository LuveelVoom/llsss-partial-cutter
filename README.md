# LLSSS partial cutter

A browser tool that takes a Game of Life–family spaceship *partial* (valid front, unfinished back) and
writes a start file plus the exact command for amling's **rlife** `llsss` / `llsss-recentering` search,
so the search can be continued. It doesn't run searches itself. Designed by LuveelVoom; code written by Claude.

Open `tool/llsss-partial-builder-offline.html` in a browser. It is one self-contained file.

| Path | What it is |
|---|---|
| `tool/llsss-partial-builder-offline.html` | The tool (source of truth) |
| `tool/llsss-partial-builder.html` | Online build: different fonts, adds `.txt` to saved files |
| `tool/core.js` | The cutter logic for Node: `const C = require('./core.js')` |
| `docs/llsss-notes.md` | Development record: amling's statements, terminology, test rounds, bugs, plan |
| `docs/partial-cutter-text.md` | All user-facing text, by location |
| `test-packs/` | Test packs with READMEs |
| `latest-work/` | Most recent task: a 3c/8 B3678/S34678 partial cut at its neck |
| `user-uploads/` | rlife logs (`rlife-logs-*`, `attachment-*.txt`), partials and constraint files |
| `archive/` | Paused grid workbench |
| `00-READ-ME-FIRST.md` | Full project handoff |

rlife itself is amling's program and isn't included here. Build it from its own source with
`cargo build --release` (Rust 2024 edition).
