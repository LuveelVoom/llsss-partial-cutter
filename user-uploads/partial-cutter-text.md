# LLSSS partial cutter: all user-facing text, by location

Exported from `partial-builder.html` (the online, offline and zip copies have the same text). Each part says **where it appears** on screen and **where it is in the source**, so it can be found and edited. Text that is built while the page runs shows the parts that change as `{…}`. Text marked *(conditional)* only appears in some situations.

Contents: Out-of-date text · 1. Page header · 2. About box · 3. Page tabs · 4. Build page · 5. Messages shown while building · 6. Generated command comments · 7. Q&A tab · 8. Guide tab

## Out-of-date text (as of 2 October 2026)
These are still in the program but no longer match how it behaves. Section numbers point to where each appears below.

- **Mode hints (4.2, "Mode hint under the menus"):** `rc` and `fixed` say rlife builds the start file itself (`@yolo_1gp`). It now does so only when the "Use rlife's own commands" switch is on, and that is off by default. `tail` says "Not yet tested in rlife"; Back only was tested on 2 October and works.
- **File name hint (4.2):** "--top-pad does the same at run time". `--top-pad` only applies to files with question marks (picture mode), so this isn't true for recentering files.
- **Guide (8):**
  - It says "builder" in nine places; the tool is the partial cutter.
  - Section 2 says to set the rule first. The rule is now taken from the RLE header when there is one.
  - Section 6 says mid_steps comes from the partial's width, with 8 for the branch mode. It is now the width plus 2, kept between 8 and 12.
  - Section 3, "Diagonal ships": it says diagonal files haven't been run in rlife and should be treated as unverified. They were run on 2 October: the symmetric half and the full-width files all searched, and the even edge was refused as predicted.
  - Section 3, "Back only": "Not tested against rlife" (twice). Tested on 2 October; it works.
  - Section 1: the online copy adding `.txt` to saved files. The Save toast still says so (5.4), but it hasn't been rechecked since the artifact changes.
  - Section 10 is the development notes (generated from `llsss-notes.md`), not user help.

## 1. Page header
*Where:* top of every tab. *Source:* `<header>`: the `<h1>` and the `<p>` after it.

**Title:** LLSSS partial cutter

**Intro:** Paste a spaceship partial (orthogonal, diagonal or knightwise), select the cut mode, adjust the settings until you have the cut you want (requires a bit of intuition or skill, see the guide), and export and run the command.
[[ Claude: reduce the mid-steps the generator gives by default. They are way too high. ]]

## 2. About box
*Where:* top of every tab, below the intro (amber box). *Source:* `<div class="about">` in `<header>`; the thread link text is set by the script (`SUPPORT_URL` near the end of the script; while it is empty the link reads "the partial cutter thread on the ConwayLife forums (link to follow)").

About this tool

This tool was designed by LuveelVoom and the code was written by Claude. The partial cutter is likely to have bugs.

**What if I have a problem?** Go to [the scripts thread](#). Provide as much detail as possible, most importantly: the RLE you used, the options you picked, and the outputs the partial cutter produced. The Q&A tab will eventually contain solutions to common issues that are raised; at the moment, no issues have been raised.
## 3. Page tabs
*Where:* below the About box. *Source:* `<div class="pagetabs">` buttons (`data-page="build"`, `"guide"`, `"qa"`).

- Build
- Guide (WIP)
- Q&A

## 4. Build page

### 4.1 Switch bar
*Where:* top of the Build page. *Source:* `<div id="officialWrap" class="switchbar">`. The status line (`#officialStatus`) is rewritten by the script after each build (in `run()`) and when the switch is flipped.

**Switch label:** Use rlife commands

**Status line (one of):**
- Command mode is off, cutter builds all start files
- Command mode is on: rlife commands are used when possible *(before anything has been built)*
- Command mode is on: using yolo_1gp
- Command mode is on: however, the cutter is building the start file, because {reason}
*{reason} is one of:*
- yolo_1gp needs RLE input
- no valid diagonal start state (I'm not sure what this means)
- rlife commands do not support symmetric partials at the moment I think, amling might have changed this but I can't recall
- No rlife command for this search
- rlife command cannot be used here

### 4.2 Left column (cards)
*Where:* left side of the Build page. *Source:* the first `<section>` inside `<main>`.

#### Card: 1. Partial

**1. Partial**
- Field label **Rule**
  - *hint:* Supports all INT rules.
- Field label **Pattern**
  - *placeholder:* Supports one generation partials, multiple generation partials, and LLSSS output grids
  - *placeholder:* auto
- Button: Example mutliple generation partial
- Button: Example single generation partial

#### Card: 2. What should the search do?

**2. What should the search do?**
- Choice **Extend the partial**: Continues searching from the back of a partial
- Choice **Split into branches**: Search one branch of a partial that has split into multiple parts
- Field label **Board**
  - menu options: Recentering (widening) / Fixed width
- Field label **Where to cut**
  - menu options: At first detected error / Back only (Search initially starts narrow. This mode is a bit tricky to use and I'm not really sure when it's best to use it) / Along drawn line (BUGGY)
- Field label **Hold the branch apart by**
  - menu options: Empty axis columns (In case you want to annoy LLSSS for some reason. This mode is weird and I don't know why it's still included. [[ Claude: move this to the bottom of the dropdown menu ]]) / The axis column only (prevents search from going into middle and interfering with itself) / Fuzzy-left-edge mode (avoids a branch that already exists on the side)
- Field label **Search**
  - menu options: Symmetric edge / Single-branch edge
  - *(grey hint, filled in by the script: see "Mode hint" below)*
- Field label **Search order**
  - menu options: autodetect / Front to back (f2b) / Side to side (s2s) / Back to front (b2f)
- Field label **Symmetry**
  - menu options: autodetect / Ignore symmetry and do a full width search because I hate my cpu !!! :3
- Field label **Extra columns**
- Field label **Backtrack (rows) (sometimes this is w-rows and sometimes this is real rows depending on the mode you pick yeah idk) [[ claude make the second parenthetical in smaller text ]]**
- Field label **Lines to keep**
- Field label **Padding left**
  - *placeholder:* auto
- Field label **Padding right**
  - *placeholder:* auto
- Checkbox: Unrollable edges (LLL and RRR roots) (not sure what this does) [[ claude: what is this useful for?? ]]
- Field label **Constraint files**
- Checkbox: Asymmetric *(hidden; set by the Search menu)*
- Checkbox: Keep the columns beside the axis empty, if you're a weirdo
- Field label **File name**
  - *hint:* Extra columns widen the fixed board and the branch search (unless in recentering mode). Backtrack keeps less of the known partial so the search can redo it.
- Button: Build start file

#### Mode hint under the menus
*Where:* the grey line under "Hold the branch apart by"/"Where to cut" in card 2. *Source:* `TASK_HINT` near the end of the script; one entry per internal mode.

- `rc` (Extend at first discontinuity): Recentering search from last valid detected row
- `fixed` (Extend w. fixed width): Fixed-board search (a la qfind).
- `tail` (Extend, back only): Something BUGGY that is supposed to make the search narrower by only keeping the last few lines. [[ claude: do we need this? ]]
- `line` (Extend with line cut) (BUGGY) Cuts along a drawn line in case you have weirdly oriented segments
- `branch` (Split empty axis): Attempts to autodetect a branch by detecting an empty central axis and splitting the search there [[ claude: do we need this? ]]
- `axis` (Split with empty center): Splits at first discontinuity and keeps branches away from each other [[ claude: do we need this? ]]
- `outer` (Split with leftover branches): If your partial splits and one end completes (or you only want to extend one end at a time) you can set it to only extend one of the branches

### 4.3 Right column
*Where:* right side of the Build page. *Source:* the second `<section>` inside `<main>`. The drawing panel (`#linePanel`) shows only for "Along a line you draw"; the output card (`#outCard`) appears after a build.


**✎ Draw the cut**
  - menu options: 
  - menu options: Free path (click to add points) / Straight line (two clicks)
- Button: Undo
- Button: Reset to automatic cut
  - *hint:* According to claude: "Click to add points, drag a point to move it, right-click a point to remove it. Everything behind the line, on the orange side, becomes ?. The same line applies to every generation; the generation box only chooses which one you draw on. Red marks rows where the partial is already broken, so the line can't go there." You know how a line drawer works. It's a line drawer.
- Button: Command
- Button: Start file
- Button: UWI chart
- Button: Constraint files *(conditional)*
- Button: Copy
- Button: Save start file *(conditional)*
- Button: Save pre constraint *(conditional)*
- Button: Save axis constraint file *(conditional)*

## 5. Messages shown while building

### 5.1 Stats panel labels
*Where:* the boxes at the top of the right column after a build. *Source:* `stat("Label", value)` calls in `run()`. Values are built from the analysis, shown here as `{…}`.

- **Geometry**: {…}
- **Search order**: {…}front to back{…}side to side{…}back to front{…}f2b{…} ({…}){…}
- **Speed**: {…}({…},{…})c/{…} diagonal{…} knightwise{…} raw{…}c{…}c{…}/{…} orthogonal
- **Orientation**: {…} so {…}
- **Read as**: {…}
- **Symmetry**: {…}
- **First CA discontinuity**: {…}none{…}search row {…}
- **Rows kept**: {…} search rows
- **First CA discontinuity**: {…}none{…}row {…} (~line {…})
- **Lines kept**: ~{…} of the partial
- **Branch**: solved from half-column {…}; the sibling branch is carried unchanged (left pad {…}) [[ claude: What's going on here? Can you make this simpler? ]]
- **Branches**: axis column kept empty
- **Empty columns at the axis**: open from ~row {…}, held from ~row {…}
- **Cut**: known to ~line {…} at its shallowest and ~line {…} at its deepest{…}
- **Constraint file**: {…} cells replaced via a constraint file{…}not needed
- **Back only**: last {…} lines kept; question marks {…} columns wide (back {…} + padding {…} left, {…} right){…}; back drifts {…}right{…}left{…}; partial is {…} wide
- **Edges**: {…}unrollable (LLL and RRR roots): partials can widen past the file{…}fixed-like (u roots): the window is exactly the question marks plus two columns each side [[ claude: what's going on? can you simplify this somehow? ]]
- **Start file**: 1gp as RLE ({…} × {…}, {…} cells{…}as given{…}, {…}); rlife @yolo_1gp {…}fixed{…}fixed board{…}recentering input{…}
- **File size**: {…} cols × {…}n{…} rows

### 5.2 Warnings and errors above the stats
*Where:* coloured banners at the top of the right column (amber = warning, red = error). *Source:* `banner("warn"|"err", text)` calls in the page script.

- *(error)* {…}rule{…} RLE header says rule = {…}, Rule box says {…}rule{…}. Rule box used.{…}
- *(warning)* Rule taken from RLE header: {…}. Change the Rule box if incorrect
- *(warning)* RLE header says rule = {…} Rule box says {…}. Rule box used.
- *(warning)* Both sides have discontinuities; s2s must have one side without any. f2b used. [[ claude: What is this discontinuity stuff? ]]
- *(warning)* Discontinuities suggest orthogonal search order which is impossible in this case; f2b used.
- *(warning)* Axis column hold isn't available for this partial: {…}
- *(warning)* One branch extension isn't available for this partial: {…}
- *(warning)* Split into branches, held apart by empty columns at the axis, isn't available for this partial: {…}
- *(warning)* Cutting at the back isn't available for this partial: {…}
- *(warning)* Cutting along drawn line isn't available for this partial: {…}
- *(warning)* Two fixed columns beside the question marks are needed. This file is full width and the search won't enforce symmetry. For a symmetric search, use recentering.
- *(warning)* Some generations don't match the next one. Double-check your RLE.
- *(warning)* You are using branching mode while the middle column is still alive, so the search is going to kill your middle column. If this starts causing your runs to fail, use empty axis columns mode instead.
- *(warning)* Part of the line was above the first rows, so it was held just below the front, otherwise you would have no partial, and it wouldn't be a partial cutter if you had no partial.
- *(warning)* Part of the line is below the last row where the partial is valid, so it was held at that row. 
- *(warning)* This file holds just the back of the partial. The search output covers only the search window. It will have to be joined with the frontend when completed.
- *(warning)* This is not a partial. It is a full ship.

### 5.3 Error messages from the analysis
*Where:* shown as red banners when a partial or option can't be used. *Source:* `throw new Error(...)` in the core part of the script (`/* LLSSS partial cutter core */`).

- Rule must be in Hensel notation.
- Unexpected '{…}' in rule.
- Letter '{…}' is not valid after {…}.
- Paste an RLE or a grid first.
- Couldn't find RLE header (x = …) or grid rows (| … |).
- This partial has no displacement. This program is designed to cut spaceship partials, not oscillator partials.
- The partial breaks almost immediately, around row {…}). Check your RLE again.
- There are no live cells in the last {…} lines.
- Branch mode needs a mirror-symmetric partial, and ships that move sideways can't be mirror-symmetric.
- Unknown geometry {…}
- This search order does not support grid logs; provide an RLE instead.
- This ship's motion ({…},{…}) doesn't fit {…}.
- The partial breaks almost immediately in this search order. Try a different one (and check your RLE).
- Branch mode is only available in f2b mode.
- Couldn't line the chart up with the tiles of {…}.
- Back-only mode is only built for f2b orthogonal and knightwise ships; sorry, dronebetter, but you don't get 2c/7d that easily.
- s2s and b2f files are only built for orthogonal ships here.
- {…}Diagonal{…}Knightwise{…} partials can only be extended (recentering, fixed width{…} or back only{…}); this mode is only built for orthogonal ships.
- The partial breaks almost immediately (first discontinuity at W={…}). Check the RLE.
- Back-only mode needs the partial at full width, not a half cut at the axis.
- This grid is already a half cut at the axis. rlife needs two fixed columns beside the question marks, so a fixed-board file can't start at the axis; use recentering for half grids. [[ claude: check this too ]]
- This mode needs a mirror-symmetric partial (it solves the branch further from the axis in one half). [[ claude: what does this mean? ]]
- You're using multi-branch mode on a single branch. [[ claude check this ]]
- The sibling branch isn't complete, go fix it using recentering or fixed-width.
- Branch mode needs a symmetric partial.
- No stretch where the {…}column{…}two columns{…} next to the axis stay empty. Why are you trying to hold it open? Use recentering.
- This mode is only available f2b.
- This mode needs a mirror-symmetric partial, and ships that move sideways can't be mirror-symmetric.
- This mode needs a mirror-symmetric partial.
- Cut-line mode is only available f2b.
- Cut-line mode is only built for orthogonal ships.
- Cut-line mode needs the full-width partial, not a half cut at the axis.
- The drawn line's generation is out of range.
- A diagonal grid needs at least 4 generations (the fastest diagonal speed is c/4). [[ claude: THIS IS WRONG!!! FIX IT !!!!!! only true for life, not all CA ]]
- Couldn't check any cells of this diagonal grid; it may be too small.
- This diagonal grid doesn't follow {…} at any diagonal speed: the best fit ({…}c/{…}d{…} still fails. Try setting the rulebox to the rule you are using.
- Couldn't find the ship's motion in this grid.
- This grid doesn't follow {…} at any speed: the best fit ({…}none{…} still fails. Try setting the rulebox to the rule you are using.
- Couldn't find period up to {…} from a 1gp. Paste all generations side by side instead. And check your RLE.

### 5.4 Other small texts
*Where:* toasts, button labels and greyed-out reasons set by the script.

- *(hover reason)* Needs a symmetric partial whose back has split into branches.
- *(text)* generation 
- *(text)* the partial cutter thread on the ConwayLife forums (link to follow)
- *(toast)* Copied
- *(toast)* Saved {…}: remove the .txt ending{…}

## 6. Generated command comments
*Where:* the first lines of the Command tab. *Source:* `command()` and `officialCommand()` in the core, plus the "# save …" line added in `run()`.

- `# Made with the LLSSS partial cutter (designed by LuveelVoom, coded with AI, NOT PART OF LLSSS).`
- `# Here the cutter only writes one generation of your partial; @yolo_1gp builds the start file.`
- `# If something goes wrong, say you used the partial cutter and include your partial, its options, this command, rlife's log, and as much additional info as possible.`
- `# simple_vv geometries need an rlife build from after September 9 2026. Update your build.`
- `# save the one generation RLE as…`
- `# save…`
- `# save the start file as…`

## 7. Q&A tab
*Where:* the Q&A tab. *Source:* `<article id="qa">`; answers go in `<div id="qaList">`.

**Questions and answers**

Answers to questions asked in [the scripts thread](#).

**I have a problem and the answer isn't in here.** Go to [the scripts thread](#). Provide as much detail as possible, most importantly: the RLE you used, the options you picked, and the outputs the partial cutter produced. The Q&A tab will eventually contain solutions to common issues that are raised; at the moment, no issues have been raised.

No questions yet.

## 8. Guide tab
*Where:* the Guide (WIP) tab. *Source:* `<article id="guide">`. It opens with the yellow Luveel note (`<div class="luveel-note">`), then a contents list, then the guide. **Section 10 is generated from `llsss-notes.md`** and is replaced whenever the notes are updated; edit the notes file, not section 10.

### 8.0 Luveel note (top of the Guide tab)
**Luveel note:**

The guide tab is currently AI-generated and likely contains a ton of mistakes. The public release (if one happens) will have a much more accurate, possibly hand-written guide. That guide will include a basic outline of the inner workings of LLSSS (which I am going to "borrow" from Amling's "state of the union" post), an explanation of how to properly use the mode, an explanation of how to interpret common issues that arise, and tips on which modes are best to use in which circumstances and what to look out for when searching. **It will be hand-written.**

THIS IS A TEMPORARY SUBSTITUTE. DO NOT ANNOY AMLING WITH STUFF YOU READ FROM THIS. USE AND INTERPRET WITH EXTREME CAUTION.

#### Using the partial cutter

The builder turns a spaceship partial into a start file for rlife's LLSSS searches, and writes the command to run it. It does not run the search. You run the command yourself, then join the search output back onto the partial (section 8).

##### Terms used here

These follow amling's usage in his State of the Union post (page 24, 30 September 2026). Section 10 has the full list.

- **Generation**: One of the ship's period's generations; one `|` section of a file.

- **Row (W row)**: All cells with the same whole-number W (W is the direction the search runs). For c/N front to back, one line of cells in each generation; for kc/N with k > 1, k lines.

- **Line**: One horizontal line of cells in one generation (amling: "each row has two horizontal lines of cells" in 2c/4). Used where rows and lines differ.

- **Column**: All cells with the same whole-number U (across the ship).

- **W overlap**: `nh_w_size` − 1 rows: what two halves must agree on to join. For orthogonal ships, two lines in each generation.

- **XYT chart, UWI chart**: Generations separated by pipes: an XYT chart has one generation per section, lines in ascending Y and columns in ascending X. A UWI chart looks similar but its sections, lines and columns are UWI coordinates. Start files are XYT charts with extra rules about their shape (amling, 30 September 2026).

- **UVW prism**: What a start file must be: a complete prism in UVW coordinates. In practice, the shape rules each geometry's examples follow.

- **Strip, jcol, bcol**: A strip is 3 columns wide and as tall as the search. A jcol is a set of strips; a bcol is a 2-wide strip between neighbours. The log's `Cols sizes: A / B` is bcols / jcols.

- **Fixed-board search, recentering search**: `llsss` and `llsss-recentering`. A fixed board has one jcol per position. Recentering has one jcol plus left and right edges, and partials can change width.

- **Edge**: The left or right boundary condition: `bg` (background agar), a symmetry edge (`--left-edge odd` or `even`), or in picture mode `pic(bg)` (the picture, then bg).

- **Root markers**: The first W row of a recentering file (amling, State of the Union; the code calls them `root_label`). `u` marks a column unique; `LLL` and `RRR` make an unrollable edge; `u` up to an edge makes it fixed-like.

- **Question marks, picture mode**: A solid rectangle of `?` reaching the bottom of the file (the code calls it the hole). A file with them is searched in picture mode: only the W overlap above them starts the search, and the edges continue from the two columns beside them.

- **Search window**: In picture mode, the question marks plus two columns each side (plus any pads). The rest of the file is ignored.

- **Ends**: What counts as a finished ship. The default `bg` needs the last W overlap to match the background agar.

##### 1. Setup

You need a built copy of rlife. The commands assume you run them from `rlife/target/release`, with the start file (and any constraint files) saved in that same folder. If you keep the files elsewhere, put the full path in the command wherever a file name appears, including inside the quotes of a `--constraint` argument.

The online builder adds `.txt` to saved files. Remove it before running rlife. The offline copy saves files with their real names.

##### 2. Pasting a partial

Set the rule first. B/S notation works, with Hensel letters if needed (`B3/S23-q4i`).

The pattern box accepts:

- **An RLE with every generation side by side.** This is the most reliable input. The generations are split on the empty columns between them.
- **An RLE of one generation.** The builder simulates the other generations. Only use this if the partial is valid for a full period.
- **A grid copied from an LLSSS log**, such as a "Thinnest partial" block, or a LifeHistory RLE of one. Generations can be side by side or stacked.

If a generation has a wide gap inside it, the automatic split can cut it in two. Set **Generations in the RLE** to the period to stop that.

The builder works out the speed, the direction of travel, the symmetry, and which side its CA discontinuities are on. The stats panel shows what it found. Check it before using the output: a wrong period or symmetry makes the start file useless.

##### 3. Choosing a mode

**How the choices are laid out.** The page asks two things. **Extend the partial** has a **Board** (recentering or fixed width) and **Where to cut** (at the first CA discontinuity, the back only, or along a line you draw). **Split into branches** has **Hold the branch apart by** (empty columns at the axis, the axis column only, or its sibling branch with the fuzzy left edge) and **Search** (both halves or the branch alone). Each combination is one of the modes described below:

- Extend, recentering, at the first CA discontinuity: **Recentering**.
- Extend, fixed width: **Fixed board**.
- Extend, recentering, back only: **Back only**.
- Extend, recentering, along a drawn line: **Cut along a drawn line**.
- Split, empty columns at the axis: **Split into branches, empty columns at the axis**.
- Split, the axis column only: **Split into branches, axis constraint**.
- Split, its sibling branch: **Solve a branch beside its sibling (fuzzy left edge)**.

Choices that don't fit the partial are greyed out; hover over them for the reason.

Each mode keeps the valid part of the partial and sets up a different search for the rest. Some modes need a mirror-symmetric partial and are greyed out otherwise. Hover over a greyed-out mode to see why.

###### Diagonal ships

Diagonal partials go through rlife's diagonal geometries (`c4d-f2b`, `2c8d-f2b` and so on). These modes work for them: **Recentering** and **Fixed board**.

- **Tiles.** A diagonal tile holds two cells, one with x − y even and one odd (more at speeds like 2c/8, along the line of travel). Until October 2026 the cutter could write a chart whose origin split those tiles, so about half of its diagonal files were not complete UVW prisms. That is fixed: the chart's origin is now always a whole number of tiles from where the tiles were chosen.
- **Symmetric diagonal ships.** Many are symmetric across their own line of travel. The cutter detects this and, for recentering, writes half the ship with `--left-edge odd`, which in a diagonal geometry mirrors across the line of travel (`src/llsss/edge.rs`). rlife's odd edge puts the axis one x − y step in from the outer edge, on the second cell of the first tile column; the first cell is the mirror copy of the cell on the far side. The cutter moves the pattern by one cell if needed so the axis lands there. `even` would put the axis halfway between cells, which a diagonal mirror never does, so only `odd` applies.
- **Not yet:** symmetric fixed-board files, the branch modes, Back only, cut-line, and side-to-side or back-to-front diagonal searches.
- **Not tested against rlife.** The files pass my port of rlife's UVW prism checks, and the axis position follows rlife's reflect-edge code for every diagonal speed I tried. Until a real diagonal search has run from one, treat them as unverified.

###### Let rlife build the start file (`@yolo_1gp`)

For two cases rlife has its own way to make a start file, and the cutter can use it (turn on **Use rlife's own commands** at the top of the Build page; it is off by default). In tests on two diagonal partials and one knightwise partial, rlife's own start file gave a search that died at once, while the cutter's file for the same partial searched normally: rlife cuts right at the first CA discontinuity, and the last rows it keeps seem to have no continuation. For diagonal ships the option is not offered at all (the checkbox **Let rlife build the start file**):

- **Recentering, for a partial that is not symmetric** (or with Symmetry set to Ignore).
- **Fixed board**, symmetric or not; it is searched at full width either way.

The cutter then writes only one generation of your partial as an RLE, turned to the geometry's orientation (the ship moving by V each period), and the command passes it to the search as `'@yolo_1gp("p1.rle")'` (fixed board: `'@yolo_1gp("p1.rle", L, R)'`, with the Extra columns value as both pads). rlife reads it with the code behind `mgp-tool ingest-1gp` (`src/utils/mgp_tool.rs`): it simulates one period, finds the CA discontinuities at the back, keeps the rows in front of them, and wraps the result for the search. For recentering it adds `LLL…RRR` root markers. For a fixed board it puts question marks only over the columns where the back differs from the background, plus the pads. This works in every geometry rlife names, diagonal and knightwise included, and with any background agar. The cutter's own analysis (the preview and the rows-kept figures) is shown for reference; rlife makes its own cut.

It needs the partial as an RLE (a grid copied from a log has no generations to write), and it does not do symmetry: symmetric recentering, the branch modes, Back only and the cut-line mode still write the cutter's own start file. If the partial has no CA discontinuities at all, rlife stops with "Already a valid ship!". Untick the box to get the cutter's own start file instead.

###### Recentering: extend and let it widen

A recentering search (`llsss-recentering`) from the last valid row. The back is free to grow sideways. Use this for an ordinary partial you want to continue. Symmetric partials get `--left-edge odd` or `even` so the search stays symmetric.

###### Fixed board: extend at a fixed width

A fixed-board search (`llsss`). The back, where the CA discontinuities are, is replaced by question marks, and the board is the pattern plus **Extra columns**. The width never changes, which keeps memory predictable, but anything that needs to be wider than the board is never found. Symmetry is not enforced in this mode.

###### Solve a branch beside its sibling (fuzzy left edge)

For a symmetric partial whose back has split into two branches, one near the axis and one further out. Everything up to the first CA discontinuity is kept, the branch near the axis is carried along unchanged as the sibling branch, and only the other branch is searched. This follows amling's `--fuzzy-left-edge` recipe. The mode refuses if the sibling branch itself breaks the rule, since it can't be carried unchanged.

###### Split into branches, axis constraint

For a symmetric partial where the two halves should separate into branches. The file keeps everything up to the first CA discontinuity. Two constraint files tell rlife to keep the axis column empty in every row it adds, so the branches can come within one column of the axis but never touch it.

This mode writes three files: the start file and `NAME-pre.cstr` and `NAME-axis.cstr`. The `pre` file covers the rows already in the start file, since rlife applies constraints to those as well. The `axis` file is one row that rlife repeats for every new row.

If the axis column is still alive in the last rows kept, the builder warns you. The search then has to kill those cells first, and it may find nothing. Try an earlier partial or plain recentering.

###### Split into branches, empty columns at the axis

Like the axis-constraint mode, but stricter: the columns next to the axis stay empty, enough of them that the two halves never touch. The builder looks for the deepest stretch where those columns are already empty for at least a full period, cuts the partial there, and fills the rows after the cut with `?`. It also writes the same pair of constraint files, which hold the gap open for the whole search, and uses a symmetry edge (`--left-edge odd` or `even`).

Because it has to cut where the gap already exists, this mode usually keeps fewer rows than the axis-constraint mode. On the 3c/7 test partial it keeps 13 rows against 19.

Start files made with this mode before 28 September 2026 had no constraint files and no symmetry edge, so the gap only held inside the `?` rows. Rebuild those files.

How wide is the gap? Two file columns, for either symmetry. With odd symmetry, file column 0 is the axis, and a cell in column *k* is 2*k* from the cell it folds onto. With even symmetry the axis falls between file columns 0 and 1, which are copies of each other, so the distance is 2*k* − 1. Either way the two sides stop sharing a neighbour once the branch starts at column 2.

That is the narrowest gap that keeps the halves independent, so the branch can't be given more room toward the axis without letting the two sides touch. If you want them to interact, that is a different search: axis-constraint mode allows the branch within one column of the axis, and plain recentering puts no limit on it at all. With **One branch only** there is no other half, so the gap is a preference rather than a requirement.

###### Cut along a drawn line

The other modes cut straight across the partial. This one lets you draw the cut as an angled or free path, and everything behind the line becomes `?`. It works on partials at full width, front to back, orthogonal ships only. A symmetric partial is searched at full width, without the symmetry edge.

rlife only accepts one rectangular `?` block that reaches the bottom of the file (`split_picture` in `src/lat/geom.rs` asserts this), so an angled block can't be written directly. The builder writes the rectangle starting at the shallowest point of your line. Cells inside the question marks but above your line are put back by a constraint file, `NAME-pre.cstr`, which has the partial's own cells there (`*` and `.`) and `W` everywhere else. The command is `--constraint 'grid("NAME-pre.cstr", none)'`. If the line is level there is nothing to put back, and no constraint file is written.

How the line is read: a cell is kept when its row is above the line's, and the same line applies to every generation, so the generation box only chooses which one you draw on. The line is a function of the column, so it can't double back on itself, and beyond its two ends it continues level. It can't go below the last row where the partial is valid; a deeper line is held at that row and a warning says so. The drawing also shows the cut as applied (the thin orange step line), which is your line rounded to whole rows.

**Not tested against rlife**, because I couldn't run it. I checked these in its source: the rectangle rule; that a `grid` constraint is cropped to the `?` block's frame, so the file and the constraint must have the same width and root markers (they do); that `none` is a valid final constraint; and that `*` and `.` in a constraint grid mean known on and known off. I did not confirm that a live cell set this way behaves like the dead cells amling's axis file uses, and I don't know how the search performs when the constraint file sets many cells. The files were checked against those UVW prism checks and cell by cell on 32 random lines across 8 speeds: every cell above the line is kept, or set by the constraint file, with the partial's value, and every cell behind the line is free.

###### Back only (narrow question marks)

For a long partial whose back is thin, or one that drifts sideways so the file is far wider than its back. The file is in picture mode: the search window is the question marks plus two columns each side (plus any pads), the search starts from only the W overlap above the block, and the rest of the file is ignored (amling's State of the Union; `split_picture` in `src/lat/geom.rs`). In the other recentering modes the search starts from the whole file, so its starting width is the whole pattern's. This mode makes the window as wide as the back. amling (page 22) says the width of the question marks matters less for recentering than for fixed board, as long as they reach at least one unrollable edge: then partials can unroll as wide as they like. So with unrollable edges this mode mainly changes the starting width; only fixed-like edges limit the width for the whole search.

- **Lines to keep.** How many lines of the partial are written above the block (at least 4). The search uses only the W overlap; the rest only help you line up the result with the full partial.
- **Padding left / right.** Extra question-mark columns beside the back's own extent, written into the file. Blank means automatic: 4 each side, or 10 on the side the back is drifting toward and 3 on the other.
- **Unrollable edges (LLL and RRR roots).** On: the block reaches the last `L` and first `R` root columns, so both edges are unrollable and partials can widen past the file. Off: `u` roots all the way, so both edges are fixed-like and the window is exactly the block, as in amling's plan A example. Off is bounded and cheap, but the back can leave the window if it drifts.

The command has no pad flags. To widen the block further, add `--left-pad N` or `--right-pad N`; each can be at most the number of file columns beside the block minus 2.

The search output covers only the search window. To rebuild the whole ship, join it to the full partial by hand (section 8).

**Not tested against rlife.** The files pass my port of rlife's checks that a start file is a complete UVW prism, and match the layout of amling's examples. An earlier version of this idea wrote a plain file with just the last lines and no `?` block. rlife found no valid start state for it (the search ended in 30 µs with no jcols), so I removed it. I don't know why it failed, and this mode may fail too. Whether a narrower window helps a given search is a hypothesis: on a sprayer log the search was blowing up (+80% to +100% per row) from a 49-column start with a back 11 to 15 columns wide.

###### The branch alone, or both halves

Both branch modes have two checkboxes.

- **One branch only (asymmetric).** Off (the default): both halves. The symmetry edge (`--left-edge odd` or `even`) makes rlife extend both halves, folded at the axis. On: the branch alone. The symmetry edge is dropped and rlife uses its picture-mode default, `pic(bg)`, which continues the two columns beside the question marks and then the background. The other half is ignored, so the halves need not match. This is amling's "plan A" (page 23).
- **Keep the columns beside the axis empty (constraint files).** For both halves only, and on by default: it keeps the two mirrored branches from touching. For the branch alone there are never constraint files and the box is hidden. amling (page 24) pointed out that there the `pic(bg)` edge already forces the two columns left of the block to stay empty, and the constraints do strictly less. The command is then his plain one, for example `rlife llsss-recentering 2c5-f2b 2c5.in 11`.

**Correction.** An earlier version of this guide said that leaving out the constraint files in one-branch mode lets the branch come back toward the axis. It doesn't: the edge still holds those two columns empty.

**This is not amling's method for 232P7H3V0-style branches.** His command for the 3c/7 partial in that thread was `rlife llsss-recentering 3c7-f2b p1.in --left-pad 09 --fuzzy-left-edge --right-pad 1 07`, on a file cut narrowly around one branch. The fuzzy edge lets the search decide, at each depth, whether to include the sibling branch in the window. He also said a symmetry edge makes you pay for the sibling. The symmetry edge plus constraint files in this mode and in axis-constraint mode were added by an AI model, not taken from him. Only **Solve a branch beside its sibling (fuzzy left edge)** writes `--fuzzy-left-edge`, and it needs a sibling branch beside the branch being solved.

##### 4. Options

- **Search order**: Front to back, side to side, or back to front. The default detects it from which side of the partial its CA discontinuities are on. Set it by hand only if the detection is wrong.

- **Symmetry**: Detect, or ignore. Ignoring treats the partial as full width and asymmetric.

- **Extra columns**: Room beyond the pattern. A fixed board gets it on both sides (for a cutter-made file; with `@yolo_1gp` it becomes the left and right pads); until 1 October 2026 the cutter put it on the right only, which left the board too narrow for a ship whose back widens to the left. Fixed-board and fuzzy-left-edge files start at 4. The empty-columns-at-the-axis file starts at 0: amling said an earlier file (12 root columns) was wider than he would have cut it (8), and 8 is the width of that pattern with no extra. He described the two as approximately the same search, with more spines deduplicating in the narrower one and features that key on unique roots showing less. Once you type a value it is kept when you change modes. Recentering widens by itself and doesn't use this.

- **Backtrack (rows)**: Keeps fewer rows of the partial, so the search redoes the last part. Use it when the rows just before the first CA discontinuity are valid but lead nowhere.

- **File name**: The name of the start file. Constraint files are named after it (`p1.in` gives `p1-pre.cstr` and `p1-axis.cstr`).

##### 5. Reading the result

The stats panel lists what was detected and how much of the partial was kept. Warnings appear above it in colour. Read them: most of them mean the search will fail or find something you don't want.

The preview shows the start file. Live and dead cells are what the search starts from, `?` cells are left for the search to fill, and root markers are the letters on the first W row that rlife uses to line up columns.

The output tabs:

- **Command.** The command to run, with the file names filled in.
- **Start file.** The start file, an XYT chart: generations separated by `|`.
- **UWI chart.** The same cells as a UWI chart (UWI coordinates, rlife's internal row order). Useful only for checking the geometry.
- **Constraint files.** Only in the two branch modes.

Each file has its own Save button. Browsers block several downloads from one click, so the builder no longer tries to save them together. Copy puts the current tab's text on the clipboard.

##### 6. Running rlife

A typical command from the empty-columns-at-the-axis mode:

```
export LLSSS_HALT_ON_ENDS=true
./rlife llsss-recentering --rule 'B3/S23' --left-edge odd \
  --constraint 'grid("p1-pre.cstr", grid_loop("p1-axis.cstr"))' \
  3c7-f2b p1.in 08 > out.txt
```

- `LLSSS_HALT_ON_ENDS=true` stops the search at the first step that finds a complete ship. Without it, the search keeps going after a result.
- The single quotes around the `--constraint` argument matter. They pass the double-quoted file names through the shell unchanged. The older `grid:FILE:NEXT` form no longer parses.
- `3c7-f2b` is the geometry: speed and search order.
- The last number is `mid_steps`. The builder sets it from the width of the partial, and uses 8 for the empty-columns-at-the-axis mode.
- `LLSSS_RLE_ENDS=true` (or `both`) prints each result as an RLE as well, which you can paste straight into Golly. Settings like these can go in `~/.llsssrc` instead of being exported in every terminal (amling, page 24).
- `> out.txt` sends the log to a file. rlife flushes every line, so `tail -f out.txt` shows it live.

###### Memory

Memory use grows as the search goes deeper. In the logs tested so far, each step briefly needed about two and a half times the memory shown between steps. If that peak doesn't fit in RAM, the machine swaps and a step that took seconds takes many minutes.

Add `--pre-reify-autochoke` with a size, written as `8GB` (not `8G`). Setting it to about a third of your RAM keeps the peak in memory. When the search would go over the limit, autochoke drops the partials furthest between the two edges, which in practice means the widest ones. Too low a limit throws away the partials you want. At 1GB on the 3c/7 partial, autochoke cut the width to 15 to 18 columns, about the width of the ship itself.

##### 7. Reading the log

Each step ends with two lines:

```
Results: 0 normal
Completed w_pos 245: 3.52 GB [+4.63%], 14.60752225s [-7.41%]
```

`Results` counts complete ships found so far. The completed line gives the memory and time for the step, and the change from the previous one.

After that come three pictures:

- **Unique.** Cells that are the same in every surviving partial. `?` means the partials disagree.
- **Thinnest partial.** The narrowest surviving partial. It is not the one closest to finishing.
- **Random[ish] partial.** One surviving partial picked at random.

The search is breadth first. Every partial is extended by one row per step, and none is favoured. A branch that looks easy to finish counts only when it passes the ends. The default ends, `bg`, needs the last W overlap (for orthogonal ships, the last two lines in each generation) to match the background agar across the whole width. A back that has almost died out in one generation usually still has cells in another generation's lines.

`Cols sizes: A / B` is the number of bcols and then jcols (2-wide and 3-wide strips) in the state. It grows with the search and is what memory tracks.

Lines starting `Autochoke SEMSV1` mean the memory limit was reached. The numbers after "rejecting" and "keeping" are the width cut-off it chose for that step.

###### Reading the percentages

The bracketed numbers on each `Completed` line compare the number before them with the same number on the last `Completed` line at the same subtile position (the number in brackets after `w_pos`). In amling's example, `8[0]` compares with `7[0]` and `8[1]` with `7[1]`. They are not plain percentage changes. The formula is `200 × (next − prev) / (prev + next)`, which runs from −100% (the new number is zero) towards +100% (the new number is far larger). Near 0% it is close to an ordinary percentage change (amling, 30 September 2026).

To get the ratio back from a value *p*: next / prev = (200 + *p*) / (200 − *p*). So +67% is doubling, +42% is about 1.5×, +81% about 2.4×, and +98% about 2.9×. One 3c/7 log showed +4.6% memory, about 1.05×. Growth can be much faster than doubling: with AF2 = 3 a jcol can grow by up to 8× per bit, and a W row can contain many bits (amling).

A sprayer log showed +98% then +42% on memory and +81% then +84% on time (13 GB then 9.7 GB retained, 40 to 51 seconds a step, peaks over 30 GB). That is roughly 1.5× to 3× per step, and it will run out of memory within a few more steps. The `Unique` picture shows why: below the known part the `?` cells spread to the full width of the board within a few rows, so a board much wider than the back lets the search invent material anywhere across it. Remedies to try: a narrower search window (Back-only mode, which mainly helps with fixed-like edges, see section 3), and `--pre-reify-autochoke`, which throws away the widest partials when memory runs over. The runs amling and others posted for side pieces used 256 MB to 2 GB of it. For a hard search in another rule, amling's first suggestion (page 24) was an unlimited-width search with autochoke set as high as you can afford, plus `--partials srv2`, then reading the SRV2 output as it goes.

###### Long pauses with no output

rlife writes every log line as soon as it happens, so a pause means it is working on something that doesn't log. Look at the last line before the pause:

- **A memory line right after the expansion, before `Results`.** This is the ends, and it means a complete ship was found. Up to 29 September 2026 this hung forever: a bug amling introduced in early September (15957ed5125c) and fixed in 5c48bb53850d, which amling believes can only hang on a result, not hide one. If a search stalls here, update rlife and rerun. On a fixed copy the check prints `End [thinnest] ...` and the ship, then `Results: 1 normal`, then `Halting (LLSSS_HALT_ON_ENDS)`. To check what a stalled run is doing, get its process id with `ps -axo pid,%cpu,comm | grep rlife`, then run `sample PID 5`: the bug shows as `run_ssm_filter_ends` and `col_join`, though a slow but working ends step would look the same.
- **`Autochoke SEMSV1 running`.** Autochoke is scanning every column to decide what to drop. This grows with memory use.
- **Anywhere, with the machine slow.** Probably swapping. Check swap use in Activity Monitor or with `top -o mem`, and lower the autochoke limit.

##### 8. After a result

With `LLSSS_RLE_ENDS=true` (or `both`), rlife prints each finished ship as an RLE as well as a chart. A finished ship comes with `End [...]` lines and `Results: 1 normal`. The `Thinnest partial` and `Random[ish] partial` printouts are unfinished search states, whose backs break down when run.

- **Searches with a symmetry edge print half the ship.** Fold it at the axis. With `odd`, column 0 is the axis: mirror columns 1 and up to the left of column 0. With `even`, the axis falls between columns 0 and 1, which are copies of each other (amling, page 22): the file already holds both columns beside the axis, so mirror columns 2 and up to the left of column 0. Check which side the axis is on: it is the edge the front's first cell sits on, and a half copied from a log can be facing either way.
- **Picture-mode searches print only the search window** (the question marks plus two columns each side), not the rest of the partial. That covers the Back-only, cut-line and branch modes. Join the result to the full partial by hand, in a text editor on the charts or in Golly. amling does this with vim's block mode.
- **Check it.** Run the joined pattern in Golly for at least one full period and confirm it comes back shifted by the ship's speed with nothing left over.

##### 9. Problems

- **The search dies in its first rows, or blows up**: Both usually come down to mid\_steps (the last number of a recentering command). The search grows partials in from both edges and keeps only those that join up within mid\_steps window steps. Too small: a wide board can't be spanned, every partial is dropped, and the log shows `Completed w_pos …: 0 B` within the first rows. Too large: the window lets in far more partials than needed, and memory multiplies every row. On test diagonal partials, 8 was too small for an 18-column board, and 16 to 18 blew up on boards of that width. The cutter suggests the board width plus 2, kept between 8 and 12 (amling's own commands use 7 to 12). Adjust from there.

- **`ParseError: UnrecognizedToken` on `--constraint`**: Old constraint syntax, or missing quotes. Use the command from the Command tab as it is.

- **A mode is greyed out**: Hover over it for the reason. Most often the partial isn't mirror-symmetric, or has no stretch where the columns next to the axis are empty.

- **Only one file downloads**: Each file has its own Save button. Click each one.

- **The search finds nothing for a long time**: Check whether autochoke is cutting the width below what the ship needs, and whether a constraint rules out the shape you expect. A branch search, for example, cannot find a ship whose back crosses the axis after the cut.

- **The partials keep getting wider**: Recentering has no width limit of its own. Branches that drift sideways leave a trail that never ends and take most of the memory. A memory limit with autochoke, or a fixed-width search, stops this at the cost of excluding wider ships.

##### 10. Sources and open questions

What amling has said in the thread, with where, and what the partial cutter does with it. The same notes are in `llsss-notes.md` in the zip.

> **About this tool.** The partial cutter and these notes are a separate program by LuveelVoom, not part of rlife or LLSSS, written largely with an AI model (Claude) and probably buggy. Questions and problems go to the partial cutter thread on the ConwayLife forums; say you used the partial cutter and include its inputs and outputs.

Sources are posts in the ConwayLife thread "amling search program principles discussion / brain dump" (pages 1–24), amling's reply of 30 September 2026 to the terminology list, rlife's source and the LifeWiki LLSSS tutorial. **Where sources disagree on a term, the most recent mention wins.** Earlier I picked terms by how often they appeared; that is corrected below. Thread posts are, by page. Dates are 2026. Statements are paraphrased except where quoted. **Status** says what the partial cutter does with each one: *applied*, *consistent* (the builder already did this), *not applied*, or *open*.

Last updated: 30 September 2026 (page 24; terminology checked against rlife's source, pages 1–24, and the LifeWiki LLSSS tutorial).

###### Terms (from the State of the Union, page 24, 30 Sep)

- **U, V, W.** Three vectors in XYT space. V is the ship's translation; W is the direction the search progresses; U completes the basis. "Up/down" means along W, "left/right" along U.
- **Row.** All cells with the same whole-number W. For c/N front to back, a row is one line of cells in one generation. For kc/N with k > 1 it spans k lines (the 2c/4 example has two lines per row).
- **Column.** All cells with the same whole-number U.
- **Tile.** A row and column intersection. Mostly internal.
- **CA check size** (`nh_w_size`, `nh_u_size`). The most rows or columns one neighbourhood can span. The U size is 3 for every named geometry.
- **W overlap.** `nh_w_size` − 1 rows. It is what two halves must agree on to be patched together. For orthogonal geometries it is two lines of cells in each generation; for diagonal ones, four half-diagonals in each generation.
- **Strip.** A 3-wide set of columns (AF2 = 3 by default), as tall as the search so far.
- **jcol** ("join column"). A collection of 3-wide strips. It used to be called a "column", which amling says is confusing.
- **bcol.** A 2-wide strip, the boundary between neighbouring jcols. In the code bcols come first.
- **Fixed board.** The state is a row of jcols, one per position. Every strip must have valid neighbours all the way to both edges.
- **Recentering.** The state is one jcol plus the sets of 2-wide strips that count as the left and right edges. Every strip needs a path of any length to both edges.
- **Edges.** Left and right boundary conditions, acting on the outermost 2-wide strips. They are usually the background agar (bg, which makes the search 2 columns narrower than the board) or a symmetry edge (`--left-edge odd` / `even`).
- **Ends.** What counts as success. The default is `bg`: the last W overlap matches the background agar.
- **Root markers.** The first W row of a recentering file holds root markers, one letter per column. This is the most recent term (State of the Union, 30 Sep). Earlier posts, last on 22 Sep, and the code (`root_label`) say root labels. Columns with the same letter can recombine. A `u` is unique to its column. `LLL`/`RRR` with zero agar give an unrollable edge; `u` all the way to an edge gives a fixed-like edge (use this for clearance, or beside a symmetry edge).
- **Question marks, picture mode.** A file with question marks (a solid rectangle of `?` reaching the bottom; the code calls it the hole). The search starts from only the W overlap above the question marks. The edges extend first with the 2 columns left and right of them, then with the background agar. `--top-pad`, `--left-pad` and `--right-pad` widen the block without editing the file.
- **"How does recentering fit the whole pattern into one jcol?"** A jcol is a set of strips, not one strip. The pattern is cut into overlapping 3-wide strips, which all go into the set. A partial is any left-to-right path of strips from the set whose neighbours agree on their overlapping 2 columns, running from the left edge to the right edge. The root markers limit which paths are allowed, so the file's own path is the only one at the start. *(My reading of the State of the Union; not stated there in these words.)*

###### Statements and status

###### Page 22

- **Even edges.** With `even`, the axis falls between file columns 0 and 1, which are copies of each other. With `odd`, column 0 is the axis. *Consistent:* the builder writes a duplicated first column for even symmetry.
- **What mid\_steps is.** Recentering's mid\_steps is "only slightly like a width at all". His commands use 7, 11 and 12. *Open:* the builder uses the file width plus 2, or 8 for the empty-columns-at-the-axis mode, with no source for either.
- **Narrow question marks.** A 17-wide file with 3-wide question marks searches like a 7-wide board. *Applied* in Back-only mode.
- **Question-mark width in recentering** (22 Sep). The width of the question marks matters less for recentering than for fixed board, but they should reach at least one unrollable edge. With every root unique, mid\_steps beyond about 4 doesn't matter, because the pattern cannot get wider. *Applied* to the guide: with unrollable edges, Back-only mode mainly changes the starting width.
- **Where the question marks go** (22 Sep). They are placed "to censor any CA discontinuities", then rounded up to a full UVW prism, and extended to the bottom. *Applied:* the cutter now says "CA discontinuities" in place of my "torn" and "tear". It also replaced "first error", which was last used in 2025.
- **Side padding** (22 Sep). A symmetry edge must be padded right up to it; a fixed-style edge can be padded anywhere; an open edge must reach the end of a cycle of repeating columns (for example `RRR`). *Consistent.*
- **The start file format** (22 Sep, then named 30 Sep). Periods and asterisks, generations separated by pipes. *Applied:* now called an XYT chart; see the reply below.

###### Page 23

- **The hang in the ends.** A bug from about 15957ed5125c, fixed in 5c48bb53850d. He believes it could only hang on a result, never hide one. *Applied* to the guide.
- **Plan A and plan B.** Plan A solves the branch alone, away from the axis. Plan B searches the partial as symmetric; for recentering he would drop the question marks entirely. His plan A example has `uuuuuuuuRRR` roots and a 3-wide `?` block. *Applied* as the "One branch only" checkbox. *Not applied:* the builder's question marks are wider than his, and its "both halves" option keeps question marks, so it is not his plan B.
- **The branch alone.** Without `--left-edge`, the default edge `pic(bg)` continues the picture and then bg. His command for this case is `rlife llsss-recentering 2c5-f2b 2c5.in 11`. *Applied.*
- **File width.** He would have cut the 2c/5 file with 8 root columns, not 12. *Applied:* the empty-columns-at-the-axis mode now starts with 0 extra columns.
- **The 3c/7 command.** For the 3c/7 partial he used `--left-pad 09 --fuzzy-left-edge --right-pad 1 07`, and said a symmetry edge makes you pay for the sibling branch. *Not applied* (only the fuzzy-left-edge mode writes `--fuzzy-left-edge`). *Open:* how he chose the pad and mid\_steps values.
- **mgp-tool.** `mgp-tool ingest-1gp --sym odd` is his official ingest tool, and a sketch. *Noted* in the guide as the tool to use first.
- **Constraint files.** He confirmed the syntax `grid("pre", grid_loop("axis"))`, and that `pre` is all W. *Consistent.*

###### Page 24

- **Constraints in a one-branch search do nothing.** The `pic(bg)` left edge already forces the two leftmost columns to stay empty, and the constraints do strictly less than that (29 Sep, 10:50). *Applied:* one-branch mode now never writes constraint files. This corrects my earlier claim that leaving them out lets the branch come back toward the axis. It doesn't: the edge still holds those two columns empty.
- **LLSSS\_RLE\_ENDS.** Can be `false`, `true` or `both` (commit 02738751b00a). It prints results as RLE. *Applied* to the guide.
- **.llsssrc.** If `HOME` is set, rlife reads `~/.llsssrc`, so settings such as `LLSSS_HALT_ON_ENDS=true` can be set once. *Applied* to the guide.
- **Single-generation partials.** He hates them. LuveelVoom's guess at the reason: one generation doesn't say how the back evolves. *Not applied:* the builder still accepts one generation and simulates the rest. The guide already says to paste every generation when possible. *Open:* his reasons, which he said he would give.
- **The LLM project.** He will not look at the builder and does not want it to become a support burden. *Applied:* notices on every tool, and a rule not to take builder files to the thread.
- **Searches that blow up.** For a hard search in another rule, his best first guess was an unlimited-width search with `--pre-reify-autochoke` as high as you can afford, plus `--partials srv2`, then reading the SRV2 output. *Applied* to the guide as an option when a search blows up.
- **`--left-edge bg`** is more or less the default in non-picture searches. *Consistent.*
- **State of the Union, picture mode.** Only the W overlap above the question marks starts the search. The edges come from the 2 columns beside them, then bg. *Consistent* with Back-only mode. Lines above the overlap are ignored by the search; they only help you line things up.
- **State of the Union, roots.** `u` all the way to a fixed or symmetric edge; `LLL`/`RRR` for an unrollable zero-agar edge; each root marker is repeated |det(UVW)| times in other geometries. *Consistent:* symmetric files use `u` up to the axis, asymmetric recentering files use `LLL…RRR`, and Back-only mode has both.
- **State of the Union, ends.** The default `bg` ends checks one W overlap. *Applied:* the guide's description of what counts as finished was wrong, and is rewritten.
- **The log's `Cols sizes: A / B`.** This is the bcol count and then the jcol count (`wrap_hax.rs`). *Applied:* the guide said "columns".

###### amling's reply to the terminology list (30 Sep)

- **XYT chart, UWI chart.** Multiple generations separated by pipes form an XYT chart. Each generation has its own ascending T; lines have ascending Y; columns within a generation have ascending X. A UWI chart looks the same but uses UWI coordinates. Start files are XYT charts with extra rules about their shape. ("Chart" follows Sokwe's "LLSSS phase charts".) *Applied:* the guide, the "UWI chart" tab and the partial stitcher's messages.
- **UVW prisms.** Start files must be complete UVW prisms, which he has said many times. He isn't sold on naming the per-geometry "shape rules" that this turns into. *Applied:* the guide now says "complete UVW prism" in place of my "layout checks".
- **The bracketed percentages.** They estimate the change from the last `Completed` line with the same subtile position. The formula is `200 × (next − prev) / (prev + next)`, which runs from −100% to (asymptotically) +100% and is close to a plain percentage near 0%. *Applied:* my guide had read +80–100% as "roughly doubles"; doubling is +67% and +98% is about 2.9×. The guide now gives the formula and how to convert.
- **Growth.** A search can grow much faster than doubling per row: with AF2 = 3 a jcol can grow by up to 8× per bit, and a W row can hold many bits. *Applied* to the guide.
- **Mode names.** LLSSS has no names for most ways of combining boundary conditions. His planned names for the mgp-tool `to-fixed-input` and `@yolo_1gp` cases are, for example, "odd" and "odd/split", local to mgp-tool and not yet in the code. *Not applied:* nothing exists to name yet. *Open:* revisit when mgp-tool has them.
- **Tools.** He calls the LLM tool the partial cutter, as you do. He didn't write a stitching tool; he stitches with vim's block mode. *Applied:* the tool is now called the partial cutter (its file name is unchanged so links keep working). The partial stitcher has been discontinued (1 Oct): it didn't have enough use to be worth developing. The guide's section 8 now describes joining results by hand.
- **Not his concern.** He calls the rest of the no-source list either specific to the cutter or word salad. Those terms stay plain descriptions.

###### rlife's source, checked 1 Oct

- **`@yolo_1gp`** (`src/llsss/cli/fixed.rs`, `recentering.rs`; `src/utils/mgp_tool.rs`). Either search takes `'@yolo_1gp("file")'` as its start file; `llsss` also takes `'@yolo_1gp("file", left_pad, right_pad)'`. rlife reads one generation of a partial (`load_1gp`), simulates one period, finds the CA discontinuities at the back, keeps the rows in front of them, and wraps the result: `to_rc_input` (`LLL…RRR` root markers) or `to_fixed_input` (question marks only where the back differs from the background, plus pads). It works in every named geometry and with any agar, but has no symmetry in your copy of rlife. *Applied:* the cutter now uses it by default for asymmetric recentering and for fixed board. It writes one generation as an RLE in the geometry's orientation, plus the command; the cutter's own start files remain for everything rlife can't do.

###### Diagonal geometries (from rlife's source, 1 Oct; not yet run in rlife)

- **Tiles.** rlife's diagonal geometries (`cNd-f2b`, `-b2f`, `-s2s`, `-up`, `-down`) use U = (1, −1, 0) (`src/lat/geom.rs`). A tile column holds the cells with x − y = 2·lu and 2·lu + 1, and at speeds like 2c/8 also several cells along the line of travel (adet = 2·gcd). rlife works out tiles from the chart's own coordinates. *Applied (bug fix):* the cutter used to shift the chart by a fraction of a tile, so about half its diagonal files were not complete UVW prisms (37 of 72 in tests). The chart origin is now always a whole number of tiles away. Side-to-side and back-to-front files were unaffected.
- **Symmetry.** The reflect edge mirrors across the plane of V and W (`src/llsss/edge.rs`), which for a diagonal geometry is the ship's own line of travel. Ported to Python for nine diagonal speeds, the `odd` edge always puts the axis one x − y step in from the board's outer edge: on x − y = 2·lu0 + 1, the second cell of the first tile column. `even` would put it halfway between cells, so rlife should refuse it ("not compatible with geometry"). *Applied:* the cutter detects a mirror across the line of travel and, for recentering, writes half the ship with `--left-edge odd`, moving the pattern one cell if needed so the axis lands there. 72 synthetic symmetric files pass the UVW prism checks and unfold back to the original.
- **Tested on real diagonal ships (1 Oct).** Your file holds three B3/S23 ships: a c/5 symmetric across its line of travel, a c/5 asymmetric one, and a c/6 asymmetric one. Each was cut at 50% and 70% of its length, as one generation and as all generations. All 12 partials read with the right speed and geometry (`c5d-f2b`, `c6d-f2b`), and the symmetric ship was detected and written as an odd half. All 24 recentering and fixed-board files pass the UVW prism checks. Every cell they state (173,194 cells, the half unfolded) matches the real ship, and every `@yolo_1gp` RLE moves by exactly V with differences only at the back. *Applied (bug fix found by these tests):* the cutter's own fixed-board files put Extra columns on the right only, so a ship whose back widens to the left hit the board's edge (18 wrong cells on the c/5 asymmetric ship). They now pad both sides, in all three writers. *Open:* the test pack `diag-tests/` (start files, RLEs and exact commands) is waiting for runs in rlife.
- **First rlife runs (2 Oct).** rlife accepted the cutter's symmetric diagonal half (ship 0, `--left-edge odd`) and searched it normally. Memory growth fell from about +120% to +17% a step within 15 rows (800 MB after 15 s). That is the first confirmation that the odd axis position matches rlife. The cutter's own files for the two asymmetric ships also ran, but blew up (+110% to +160% a step, 5 GB within 14 rows) with mid\_steps 18 and 16; a run with mid\_steps 8 is in round 2. `--left-edge even` stopped without a message in the log (the error went to the terminal), consistent with the expected refusal. *Applied (bug fix):* every `@yolo_1gp` and `mgp-tool ingest-1gp` run panicked in `src/gol/ff.rs:326`. rlife's RLE reader parses one line at a time and asserts that no run count is left at the end of a line. The cutter (and the test pack) wrapped RLE lines every 70 characters regardless of runs. They now wrap only between whole runs, and every RLE is checked for lines ending in a digit.
- **Round 2 (2 Oct).** The even edge on a diagonal: rlife says "LlsssEdgeReflect(Even) is not compatible with geometry c5d-f2b", as predicted from `edge.rs`; with round 1's odd run, the diagonal symmetry handling is confirmed. mid\_steps 8 on ship 1's cutter file searched 60 rows at 500 MB, where 18 had blown up. *Applied:* the cutter's suggested mid\_steps is now the width plus 2, kept between 8 and 12 (amling's own commands use 7 to 12). `mgp-tool ingest-1gp` and `to-rc-input` worked on the fixed RLEs. Their files match the cutter's cell for cell, except that rlife keeps 8 more rows at the back (it cuts right at the first CA discontinuity; the cutter backs off one W overlap) and puts the root markers directly above the front. Both follow B3/S23 everywhere. But `@yolo_1gp` on ships 1 and 2 built that grid and stopped at once with no valid start states, the same symptom as the old tail crop. *Applied:* `@yolo_1gp` is off for diagonal geometries until this is understood; diagonal partials get the cutter's own files, which ran. *Open:* round 3 runs amling's own `ship1-rc.in` and `ship2-rc.in` directly, which decides whether this is in rlife's own pipeline.
- **Round 3 (2 Oct).** amling's own `ship1-rc.in` and `ship2-rc.in` (from `mgp-tool ingest-1gp` and `to-rc-input`, no cutter involved) also start with no states and stop at once, so the `@yolo_1gp` failure is not the cutter's. A draft report for amling is in `diag-tests/report-for-amling-draft.txt`, for you to post or not. The cutter's ship 2 file with mid\_steps 8 died in its first row: the window ran out before the partials grown in from both edges joined up across its 18 columns. With 16 it had blown up. So mid\_steps depends on the partial: too small drops everything early, too large multiplies memory. *Applied:* the default stays the width plus 2, kept between 8 and 12; the guide's Problems section explains both symptoms. - **Round 4 (2 Oct).** Ships 1 and 2 with mid\_steps 12 both ran (18 and 29 rows) until stopped by hand, no errors. Diagonal testing is done: the cutter's diagonal files run for all three ships, symmetric (odd edge) and not. mid\_steps is left to the user; no more tuning.
  Tests asked for: a real diagonal partial (symmetric and not); a short run of the cutter's files (and of a symmetric one with `--left-edge even`, expecting the error); `mgp-tool ingest-1gp` and `to-rc-input` on the same partial for comparison; `--sym odd` if a newer rlife has it.

###### Log grids (1 Oct)

- *Applied (bug fix):* the cutter worked out a pasted log grid's speed by taking the fewest CA errors. Large K pushes the period wrap off the grid and skips checks, so it could pick impossible speeds (a c/5 grid came out as K = 14, KX = 4). It now compares error rates among candidates that keep most checks, tries the axis folds (log grids from symmetric searches are halves), and never goes faster than light (K ≤ N). If no speed fits under the Rule box's rule, it says so instead of reporting a false CA discontinuity. This also fixed `c6o2life.in`, which used to be rejected.
- *Applied (bug fix):* the even fold for halves was off by one column. rlife's even edge puts the axis between columns 0 and 1, which are copies of each other (amling, page 22), so column −1 mirrors column 2; the cutter folded as if the axis were left of column 0. Every even half pasted from a log was misread. Fixed; `p10.in` (your 2c/5 file, run with `--left-edge even`) now reads as an even 2c/5 half with no failed checks.
- *Applied:* when a log grid doesn't follow the Rule box's rule, the cutter now works out the smallest isotropic rule the grid is consistent with and names it. The c/5 even half of 1 Oct is consistent with `B2i3cainyj4jz5cey6c/S2ceka3ainjr4an5aq` (0 contradictions in 1144 checks); transitions that never occur in it are unknown, so the search's real rule may switch more on.

###### amling on the warnings, and the support plan (1 Oct)

- **amling:** the warnings were overkill and too focused on his thread and "desk". What is most valuable to say: the cutter is a distinct tool from LLSSS by a distinct author, and it is possibly buggy and somewhat vibe-coded. Sensible users can work out what that means for support; worrying about the rest is hopeless. Better to decide a positive support path. Users posting on his thread is a burden, but it is eased if they know it is a separate program, if their reports say they used the cutter and include its inputs and outputs, and if you help triage, especially when LLSSS turns out to be doing the right thing for its own inputs. He now thinks telling users to post there is reasonable, as long as they give all the details.
- **Your plan:** one warning box at the top, plus the note on the guide until it is rewritten; a separate thread for your scripts, linked clearly inside the program; simple questions answered there and added to a Q&A list in the program; complex issues turned into detailed reports and brought here. The thread will also serve future "wrapper" programs for other CA search tools.
- *Applied:* the red warning and the Build-page note are replaced by one "About this tool" box (distinct program by LuveelVoom; written largely with AI; probably buggy; where to ask and what to include). The guide's duplicate warning is gone; your guide note stays. A new Q&A tab holds answers. The command's comment lines, the workbench, the README and these notes say the same. *Open:* the thread's address; set `SUPPORT_URL` near the end of the page's script.

###### Grid workbench (paused 1 Oct)

- **What it is:** a hand editor for LLSSS start files, separate from the partial cutter. You paste a grid, a log excerpt or an RLE. It shows the chart in XYT or UWI view and lets you edit it:
- paint, toggle or select `*`, `.`, `?`, blank or any other character, applied to all sections (needed for UWI edits) or one generation at a time;
- "? to bottom" and other selection fills;
- add or remove rows, columns and sections, and make sure there are enough blank columns;
- set root markers (L / u / R) from the pattern, in UWI view, for recentering inputs;
- find the axis of an orthogonal symmetric pattern;
- undo and redo, and zoom.
- **Where it is:** `archive/llsss-grid-workbench.html` (one self-contained page, about 60 KB). It is no longer in the zip or linked from the cutter.
- **Status:** development paused; work is focused on the partial cutter. It carries the same "About this tool" box. Not tested against rlife since the terminology changes, so check its files with the cutter's layout rules before use if it is picked up again.

###### Tests of 2 Oct (afternoon)

- **Back only works in rlife.** Both sprayer back-only files (fixed-like and unrollable edges) were accepted and searched about 11 rows at up to about 100 MB, then ran out of partials (no continuation within that window). The same partial at full width had blown up past 30 GB. *Applied:* Back only stays.
- **`@yolo_1gp` is now 0 for 3.** On your (2,1)c/5 partial (B3/S23-a5) it started, then lost every partial in its first row. The cutter's own file for the same partial searched rows 23 to 29 before running out. With the two diagonal cases, rlife's own route gave a dead search every time it was tried, while the cutter's files searched. The likely cause: rlife cuts right at the first CA discontinuity (here 2 rows later than the cutter), and the last rows it keeps have no continuation. *Applied:* "Let rlife build the start file" is now off by default (still offered for orthogonal and knightwise partials; not offered for diagonal ones). This reverses the earlier "on by default" plan, on this evidence. The draft report for amling includes the knightwise case.

###### Plan (1 Oct)

###### 1. Clear up the modes

- **Decide** (Luveel): remove or hide the three modes with no evidence for them: *Split into branches, axis constraint*; the *both halves* form of *empty columns at the axis*; *Cut along a drawn line*.
- **Test** (Luveel): one short run of a Back-only file (the sprayer files are ready), to decide whether it stays.
- **Provide** (Luveel): a partial whose back has split into two branches, for the fuzzy-left-edge rework.
- **Rework** (Claude): *Solve a branch beside its sibling* to follow amling's 3c/7 recipe (a narrow file around one branch with `--left-pad`, `--fuzzy-left-edge`, `--right-pad`), instead of needing a separate inner piece.
- **Done (1 Oct):** the seven modes are now two choices with options underneath. *Extend the partial* has Board (recentering or fixed width) and Where to cut (first CA discontinuity, back only, or a drawn line). *Split into branches* has Hold the branch apart by (empty columns at the axis, the axis column only, or its sibling with the fuzzy left edge) and Search (both halves or the branch alone). Nothing was removed, and choices that don't fit the partial are greyed out with the reason. Also fixed: the diagonal and knightwise writers used to accept branch modes and quietly write a plain recentering file; they now refuse.
- **Rewrite** (Claude): every mode's description to say what rlife does and when to use it; your Build-page note says the current ones are misleading.

###### 2. amling's commands

- **Done:** `@yolo_1gp` for asymmetric recentering and for fixed board; off by default since 2 Oct (see the tests of 2 Oct).
- **Diagonal log grids (2 Oct).** *Applied:* the cutter now reads diagonal charts copied from logs. Their lines are only partly filled (blank outside the ship's diagonal outline), and the parser used to discard every such line, so it read them as speed 0 without complaint. It now reads them cell by cell. It tries each diagonal speed, and uses the printed root markers to tell a half from a symmetric search (no L markers) from a full-width one; for a half it tries the fold across the line of travel. It keeps the reading under which the known cells follow the rule, and passes the result to the diagonal writer. Tested on three partials from your round 1–4 logs (a c/5 symmetric half, a c/5 and a c/6 at full width): each read with 0 failed checks, wrote valid recentering and fixed-board files, and agreed with its source grid on every shared cell. All earlier inputs read and build exactly as before.
- **"Use rlife's own commands" switch (2 Oct).** *Applied:* replaces the checkbox. It sits at the top of the Build page, is off by default and is remembered between visits. A line beside it says who builds the current start file, and why the cutter does when the switch is on but rlife has no usable command (symmetric partials, branch, back-only and cut-line searches, grids copied from logs, diagonal ships).
- **Done (2 Oct), see above.** Was planned as: a global **toggle switch**: "Use rlife's own commands". It would sit at the top of the Build page, be remembered between visits, and mark each mode as *rlife builds the start file* or *the cutter builds it* (when rlife has no command for that case).
- **Planned** (Claude): for grids pasted from a log, which `@yolo_1gp` can't take, write the valid rows as a plain XYT chart and use `mgp-tool to-rc-input` or `to-fixed-input` on it.
- **Planned** (Claude): route symmetric partials through `mgp-tool ingest-1gp --sym odd/even` once you confirm a newer rlife has `--sym`; add `--shift-idx` as a fallback if `@yolo_1gp` rejects a geometry.
- **Test** (Luveel): run one `@yolo_1gp` recentering command and one fixed-board command; after updating rlife, check `rlife mgp-tool ingest-1gp --help` for `--sym`.

###### 3. Diagonal symmetries

- **Done:** chart origin fix; mirror detection across the line of travel; odd half files for recentering; axis position derived from `edge.rs`.
- **Provide and test** (Luveel): a symmetric and an asymmetric diagonal partial (RLE, all generations, rule); a 30-second run of each cutter file; the symmetric one once with `--left-edge even`, expecting the "not compatible with geometry" error; `mgp-tool ingest-1gp` and `to-rc-input` on the same partials for comparison.
- **Then** (Claude): fix anything those runs show. Next, in order: ~~diagonal grids pasted from logs~~ (done 2 Oct); symmetric diagonal branch modes and Back only; glide-symmetric diagonal ships (rlife has `gsodd`/`gseven` edges, and many diagonal ships, the glider included, have glide rather than mirror symmetry).

###### Open questions

1. Why did the plain crop of the back (a file with just the last lines and no question marks) give zero states? Nothing in the State of the Union explains it.
2. Does Back-only mode run in rlife, and does a narrower window stop the sprayer search blowing up? Untested. amling's page 22 statement suggests it will only help with fixed-like edges.
3. How should mid\_steps be chosen?
4. How did amling choose `--left-pad 09 … 07` for the 3c/7 fuzzy-edge search?
5. Why does amling dislike single-generation partials, and should the builder stop accepting them?
6. ~~Do the diagonal files run in rlife?~~ Yes (2 Oct): all three test ships, symmetric and not; the even edge is refused as predicted.
7. Do the `@yolo_1gp` commands run as written (including `@yolo_1gp("file", L, R)` for fixed board)?
8. Is the c/5 grid of 1 Oct from a search in a rule that contains `B2i3cainyj4jz5cey6c/S2ceka3ainjr4an5aq`?

###### Terms with no source

Everything else in the cutter, the grid workbench, the guide and these notes uses the most recent term found in the sources. These remain without one. amling's reply (30 Sep) agreed none of them needs an LLSSS name.

- **The cutter's mode names.** "Recentering: extend and let it widen", "Fixed board: extend at a fixed width", "Split into branches, axis constraint", "Split into branches, empty columns at the axis", "Solve a branch beside its sibling (fuzzy left edge)", "Back only (narrow question marks)", "Cut along a drawn line". amling's planned mgp-tool names ("odd", "odd/split") don't exist yet.
- **Both halves versus the branch alone.** His plan A and plan B are close but not the same.
- **The branch further from the axis** in the fuzzy-left-edge mode. The other branch is the sibling branch.
- **Cells a constraint file sets to the partial's values** in cut-line mode.
- **The part of the partial above the drawn line.**
- **Lines to keep, Backtrack, Extra columns, Padding left/right.** Option names. "Backtrack" is your word from the thread.
