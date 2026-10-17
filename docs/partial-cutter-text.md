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
- Off: the cutter builds every start file.
- On: rlife builds the start file where it has a command for it. *(before anything has been built)*
- On: rlife builds this start file from one generation of your partial (@yolo_1gp).
- On, but the cutter builds this start file: {reason}.

*{reason} is one of:*
- yolo_1gp needs RLE input
- rlife's own start files for diagonal ships gave searches that died at once in tests
- rlife commands don't support symmetric partials yet (amling has sketched a --sym option for mgp-tool)
- no rlife command for this search
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
- Button: Example multiple generation partial
- Button: Example single generation partial

#### Card: 2. What should the search do?

**2. What should the search do?**
- Choice **Recentering from the first error**: Continues the partial from where it stops being valid; the search can widen. Click on the partial (right) to cut higher up.
- Choice **Fixed width**: Continues the partial on a board of fixed width (a la qfind). Click on the partial to cut higher up.
- Choice **Extend one branch beside its sibling (fuzzy left edge)**: For a symmetric partial whose back has split into two branches: keeps the inner branch as it is and searches the outer one.
- Choice **Back only**: Searches just the back of the partial, so a long ship with a narrow back gives a much smaller search.
- Choice **Cut along a drawn line**: Draw where the cut goes, for weirdly oriented segments. Not tested in rlife.
- Choice **Re-search a marked region**: Re-searches only a box you mark and keeps the rest of the partial fixed, for a small broken patch.
- Choice **Search a marked part alone**: Searches a box you mark on its own and ignores the rest, for a part with empty space around it.
- Choice **Split: keep the axis column empty**: Symmetric partials: cuts at the first error and keeps only the axis column empty from there on.
- Choice **Split: keep the columns beside the axis empty**: Symmetric partials: cuts where the columns beside the axis are already empty and keeps them empty.
- Field label **Search**
  - menu options: Symmetric edge / Single-branch edge
  - *(grey hint, filled in by the script: see "Mode hint" below)*
- Field label **Search order**
  - menu options: autodetect / Front to back (f2b) / Side to side (s2s) / Back to front (b2f)
- Field label **Symmetry**
  - menu options: autodetect / Ignore symmetry and do a full width search because I hate my cpu !!! :3
- Field label **Extra columns**
- Field label **Backtrack (rows) (W rows for orthogonal and diagonal ships, whole lines for knightwise ones)**
- Field label **Lines to keep**
- Field label **Padding left**
  - *placeholder:* auto
- Field label **Padding right**
  - *placeholder:* auto
- Checkbox: Unrollable edges (LLL and RRR roots) (on: the search can grow wider than the question marks; off: it stays inside them, which is cheaper, but a drifting back can leave)
- Field label **Constraint files**
- Checkbox: Asymmetric *(hidden; set by the Search menu)*
- Checkbox: Keep the columns beside the axis empty, if you're a weirdo
- Field label **File name**
  - *hint:* Extra columns widen the fixed board and the branch search (unless in recentering mode). Backtrack keeps less of the known partial so the search can redo it.
- Button: Build start file

*(not shown)* The old one-list mode picker is still in the page as hidden internal state (`<div class="goals" aria-label="Search goal (internal)" hidden>`). Its texts are not visible anywhere, but here they are for reference:

- **Recentering: extend and let it widen**: Recentering search from the last valid row. The back can grow sideways; width is limited only by mid_steps.
- **Fixed board: extend at a fixed width**: Fixed-board search. Question marks replace the back, where the errors are; the board is the pattern plus the extra columns below. Always full width, so symmetry isn't enforced.
- **Solve a branch beside its sibling (fuzzy left edge)**: Symmetric partials whose back has split into two branches. Keeps everything up to the first error, solves only the branch further from the axis, and carries the sibling branch along unchanged (amling's --fuzzy-left-edge recipe).
- **Split into branches, axis constraint**: Symmetric partials only. Keeps everything up to the first error and tells rlife (--constraint) that only the axis column must stay empty from there on, so branches may come within one column of the axis. Writes the start file plus two small constraint files.
- **Split into branches, empty columns at the axis**: Symmetric partials only. Finds the last stretch where the two columns next to the axis are empty, cuts there, and holds that gap open for the whole search (symmetry edge plus two small constraint files), so each half continues as its own branch (like 232P7H3V0). Searches both halves with a symmetry edge, or the branch alone if you tick that option.
- **Back only (narrow question marks)**: Front to back; orthogonal or knightwise. Keeps the last few lines and puts question marks just wide enough for the back, so the search window is that wide instead of as wide as the whole partial. For a long or drifting partial with a thin end.
- **Search a marked part alone**: (internal)
- **Re-search a marked region**: (internal)
- **Cut along a drawn line**: Partials at full width, front to back. Draw the cut as a straight, angled or free path; everything behind it becomes ?. rlife takes only one solid rectangle of question marks, so the cells between the top of the question marks and your line are put back with a constraint file.

#### Mode hint under the menus
*Where:* the grey line under "Hold the branch apart by"/"Where to cut" in card 2. *Source:* `TASK_HINT` near the end of the script; one entry per internal mode.

- `rc` (Extend, recentering, at the first error): Recentering search from last valid detected row
- `fixed` (Extend, fixed width): Fixed-board search (a la qfind).
- `tail` (Extend, back only): Something BUGGY that is supposed to make the search narrower by only keeping the last few lines.
- `line` (Extend, along a line you draw): (BUGGY) Cuts along a drawn line in case you have weirdly oriented segments
- `branch` (Split, empty columns at the axis): Attempts to autodetect a branch by detecting an empty central axis and splitting the search there
- `axis` (Split, the axis column only): Splits at first error and keeps branches away from each other
- `region` (): Keeps every row of the partial and re-searches the part you mark (by default, the box around the errors). Everything outside the box stays fixed through a constraint file (tick \u201cLet it grow outside the box\u201d to free the empty space too, at the cost of a much bigger search). Keep the box tight: in tests, a box much bigger than the errors made the search explode. For a broken side branch or bump that the normal cut would throw the rest of the partial away for. Not yet tested in rlife.
- `alone` (): Searches the part you mark on its own, like Back only: the search starts from the rows just above it and ignores everything else, so it is small and fast. The result may not fit back onto the ship if the part grows close to it. Not yet tested in rlife.
- `outer` (Split, its sibling branch (fuzzy left edge)): If your partial splits and one end completes (or you only want to extend one end at a time) you can set it to only extend one of the branches

### 4.3 Right column
*Where:* right side of the Build page. *Source:* the second `<section>` inside `<main>`. The drawing panel (`#linePanel`) shows only for "Along a line you draw"; the output card (`#outCard`) appears after a build.


**✎ Draw the cut**
  - menu options: 
  - menu options: Free path (click to add points) / Straight line (two clicks)
- Checkbox: Let it grow outside the box (frees the empty space too; a much bigger search) *(hidden; set by the Search menu)*
- Button: Undo
- Button: Reset to automatic cut
  - *hint:* According to claude: "Click to add points, drag a point to move it, right-click a point to remove it. Everything behind the line, on the orange side, becomes ?. The same line applies to every generation; the generation box only chooses which one you draw on. Red marks rows where the partial is already broken, so the line can't go there." You know how a line drawer works. It's a line drawer. Click or drag on the partial to move the cut. Everything above the line is kept and the search starts below it (shaded). The line can't go below the first error (red dots); Backtrack in the options is set to match. Drag a rectangle over the part to re-search; it applies to every generation. Red dots are the errors, and the rectangle must cover all of them. Everything outside it stays exactly as in your partial. Before you draw, the rectangle is the box around the errors.
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
- **First error**: {…}none{…}search row {…}
- **Rows kept**: {…} search rows
- **First error**: {…}none{…}row {…} (~line {…})
- **Lines kept**: ~{…} of the partial
- **Branch**: searching the branch further from the axis; the one next to it is kept as it is (--left-pad {…})
- **Branches**: axis column kept empty
- **Empty columns at the axis**: open from ~row {…}, held from ~row {…}
- **Region**: {…}drawn: {…}no errors found, so the back (mark a region to change it): {…}around the errors: {…}lines {…} to {…}, columns {…} to {…}; {…} cells kept fixed, {…} free
- **Cut**: known to ~line {…} at its shallowest and ~line {…} at its deepest{…}
- **Constraint file**: {…} cells replaced via a constraint file{…}not needed
- **Marked part**: {…}drawn: {…}around the errors: {…}lines {…} to {…}, columns {…} to {…}; searched alone, from the {…} lines above it
- **Back only**: last {…} lines kept; question marks {…} columns wide (back {…} + padding {…} left, {…} right){…}; back drifts {…}right{…}left{…}; partial is {…} wide
- **Edges**: {…}can grow wider than the question marks{…}stay inside the question marks
- **Start file**: 1gp as RLE ({…} × {…}, {…} cells{…}as given{…}, {…}); rlife @yolo_1gp builds the {…}fixed{…}fixed board{…}recentering input{…}
- **File size**: {…} cols × {…}n{…} rows

### 5.2 Warnings and errors above the stats
*Where:* coloured banners at the top of the right column (amber = warning, red = error). *Source:* `banner("warn"|"err", text)` calls in the page script.

- *(error)* {…}rule{…} RLE header says rule = {…}, Rule box says {…}rule{…}. Rule box used.{…}
- *(warning)* Rule taken from RLE header: {…}. Change the Rule box if incorrect
- *(warning)* RLE header says rule = {…}, Rule box says {…}. Rule box used.
- *(warning)* Both sides have errors; s2s must have one side without any. f2b used.
- *(warning)* The errors suggest another search order, which is only built for orthogonal ships; f2b used.
- *(warning)* Axis column hold isn't available for this partial: {…}
- *(warning)* One branch extension isn't available for this partial: {…}
- *(warning)* Split into branches, held apart by empty columns at the axis, isn't available for this partial: {…}
- *(warning)* Cutting at the back isn't available for this partial: {…}
- *(warning)* Searching a marked part alone isn't available for this partial: {…}
- *(warning)* Re-searching a marked region isn't available for this partial: {…}
- *(warning)* Cutting along drawn line isn't available for this partial: {…}
- *(warning)* Two fixed columns beside the question marks are needed. This file is full width and the search won't enforce symmetry. For a symmetric search, use recentering.
- *(warning)* Some generations don't match the next one. Double-check your RLE.
- *(warning)* You are using branching mode while the middle column is still alive, so the search is going to kill your middle column. If this starts causing your runs to fail, use empty axis columns mode instead.
- *(warning)* Part of the line was above the first rows, so it was held just below the front, otherwise you would have no partial, and it wouldn't be a partial cutter if you had no partial.
- *(warning)* Part of the line is below the last row where the partial is valid, so it was held at that row.
- *(warning)* The rest of the ship comes within 3 cells of the marked part (around line {…}). Searching alone ignores it, so the results probably won't attach to the ship. For a part that touches the rest of the ship, use "Re-search a marked region", which keeps the rest fixed.
- *(warning)* This file holds just the back of the partial. The search output covers only the search window. It will have to be joined with the frontend when completed.
- *(warning)* This file holds just the marked part. The search ignores the rest of the partial, so check that the result still fits the ship before joining it on.
- *(warning)* This is not a partial. It is a full ship.

### 5.3 Error messages from the analysis
*Where:* shown as red banners when a partial or option can't be used. *Source:* `throw new Error(...)` in the core part of the script (`/* LLSSS partial cutter core */`).

- Rule must be in Hensel notation.
- Unexpected '{…}' in rule.
- Letter '{…}' is not valid after {…}.
- Paste an RLE or a grid first.
- Couldn't find RLE header (x = …) or grid rows (| … |).
- This partial has no displacement. This program is designed to cut spaceship partials, not oscillator partials.
- The marked region starts too close to the front of the partial; rlife needs a few known rows above it.
- {…} of the partial's {…} errors lie outside the marked region (around line {…}). Mark them too, or the fixed cells will contradict each other.
- The partial breaks almost immediately, around row {…}. Check your RLE again.
- This partial has no errors; mark the part to search alone.
- The marked part starts too close to the front of the partial; rlife needs a few known rows above it.
- There is an error above the marked part, in its columns (around line {…}). The search starts from the rows just above the part, so they must be valid: mark from higher up.
- There are no live cells in the last {…} lines.
- Branch mode needs a mirror-symmetric partial, and ships that move sideways can't be mirror-symmetric.
- Unknown geometry {…}
- This search order does not support grid logs; provide an RLE instead.
- This ship's motion ({…},{…}) doesn't fit {…}.
- The partial breaks almost immediately in this search order. Try a different one (and check your RLE).
- Branch mode is only available in f2b mode.
- Couldn't line the chart up with the tiles of {…}.
- Searching a marked part alone is built for f2b orthogonal and knightwise ships, not diagonal ones yet.
- Back-only mode is only built for f2b orthogonal and knightwise ships; sorry, dronebetter, but you don't get 2c/7d that easily.
- s2s and b2f files are only built for orthogonal ships here.
- {…}Diagonal{…}Knightwise{…} partials can only be extended (recentering, fixed width{…} or back only{…}); this mode is only built for orthogonal ships.
- Re-searching a marked region is built for orthogonal and knightwise ships, not diagonal ones yet.
- Re-searching a marked region is only available f2b.
- Re-searching a marked region needs the partial at full width, not a half cut at the axis.
- The partial breaks almost immediately (first error at W={…}). Check the RLE.
- Searching a marked part alone needs the partial at full width, not a half cut at the axis.
- Back-only mode needs the partial at full width, not a half cut at the axis.
- This grid is already a half cut at the axis, and the cutter can't make a symmetric fixed-board file yet (amling's way uses !! markers and a symmetry edge). Use recentering for half grids.
- Fuzzy-left-edge mode only works on symmetric partials: it keeps the branch next to the axis as it is and searches the one further out.
- You're using multi-branch mode on a single branch: near the cut there is only one branch, not two separated by at least 2 empty columns.
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
- Couldn't check any cells of this diagonal grid; it may be too small.
- This diagonal grid doesn't follow {…} at any diagonal speed: the best fit ({…}c/{…}d{…}, folded at its axis{…}) still fails {…} of {…} checks. Try setting the rulebox to the rule you are using.
- Couldn't find the ship's motion in this grid.
- This grid doesn't follow {…} at any speed: the best fit ({…}none{…}, folded {…}) still fails {…} of {…} checks ({…}%). Try setting the rulebox to the rule you are using.{…} The grid itself is consistent with {…} at {…}c/{…}none{…} (an {…} half){…}; transitions that never occur in it are left out, so your rule may switch more on.{…}
- Couldn't find period up to {…} from a 1gp. Paste all generations side by side instead. And check your RLE.

### 5.4 Other small texts
*Where:* toasts, button labels and greyed-out reasons set by the script.

- *(text)* generation 
- *(text)* the scripts thread (link to follow)
- *(toast)* Copied
- *(toast)* Saved {…}

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

The partial cutter turns a spaceship partial into a start file and a command for amling's LLSSS search (`rlife llsss` / `rlife llsss-recentering`). It finds where the partial stops being valid, cuts there, and writes the file in the layout rlife expects. The search itself runs in rlife, on your computer. Click any **▸** line for details.

##### Quick start

1. **Paste a partial.** An RLE with every generation side by side (best), one generation (the cutter simulates the rest), or a grid copied from an LLSSS log. If the RLE header names a rule, the Rule box takes it.
2. **Pick what the search should do.** Usually **Recentering from the first error**.
3. **Check the result.** The stats show the speed, geometry and symmetry the cutter found; the picture shows the errors (red dots) and the cut. Click on the picture to cut higher up.
4. **Save and run.** Save the start file (and any constraint files) into the folder you run rlife from, and run the command from the Command tab.
5. **Watch the log.** Results are printed as they are found.

What the cutter works out when you paste

- **Speed and direction** from how the generations line up over one period: orthogonal, diagonal or knightwise, and which way the ship moves (the file is turned so that the search runs front to back).
- **Errors:** every cell whose next generation doesn't follow the rule over a full period. The first one marks where the partial's unfinished back starts; the cut goes one W overlap above it.
- **Symmetry:** mirror symmetry across the line of travel. A symmetric partial is searched as a half (see Symmetric partials).
- **Grids from a log** don't say which rule they are in. If the grid doesn't follow the Rule box's rule, the cutter says which rule it does follow. Diagonal grids are read cell by cell, using the root markers rlife prints to tell halves from full-width searches.
- **One generation** is simulated for one period, so the cutter can find the period and the errors itself; giving all generations is more reliable.

##### Choosing a mode

- **Recentering from the first error**: The usual choice. The search continues from the cut and can widen as it goes.

- **Fixed width**: The search continues on a board of fixed width: the partial plus the Extra columns on each side. Bounded and predictable, but a ship that needs to be wider can't be found.

- **Extend one branch beside its sibling (fuzzy left edge)**: For a symmetric partial whose back has split into two branches near the cut: keeps the branch next to the axis as it is and searches the outer one (amling's `--fuzzy-left-edge` method).

- **Back only**: Keeps only the last few lines and searches a window just wide enough for the back. For a long ship with a narrow back it makes the search far smaller: a sprayer search that blew up past 30 GB at full width finished in seconds at about 100 MB.

More options (in the collapsed list under the four main choices)

- **Cut along a drawn line**: Draw where the cut goes, for oddly oriented parts. Not yet run in rlife.

- **Re-search a marked region**: Re-searches only a box you mark and keeps every other cell of the partial fixed, for a small broken patch (for example a broken side branch, where the normal cut would throw the valid rest away). Tested in rlife: a copperhead with two damaged cells was repaired. Keep the box tight and use the mid\_steps the command suggests (about two thirds of the board width). "Let it grow outside the box" frees the empty space too, which makes the search much bigger.

- **Search a marked part alone**: Searches a box you mark on its own, ignoring the rest of the partial. Only for a part with empty space around it; if the rest of the ship comes within 3 cells, the cutter warns that the results won't attach.

- **Split: keep the axis column empty**: Symmetric partials: cuts at the first error and keeps only the axis column empty from there on.

- **Split: keep the columns beside the axis empty**: Symmetric partials: cuts where the columns beside the axis are already empty and keeps them empty. With **Single-branch edge** this is amling's "plan A" for searching one branch alone.

What each mode writes

- **Recentering:** the kept rows, with a row of root markers on top: `LLL` and `RRR` at the edges (unrollable edges, so the search can widen) and `u` in between; for a half, `u` runs up to the axis and the command has `--left-edge odd` or `even`.
- **Fixed width:** the kept rows, then question marks across the board, with two dead columns either side; run with `rlife llsss`.
- **Back only, marked part alone:** picture-mode files: a few known rows above one solid rectangle of question marks; everything outside the window is left out.
- **Marked region, drawn line, axis splits:** a start file plus a constraint file (`NAME-pre.cstr`, and `NAME-axis.cstr` for the splits) passed with `--constraint`. A constraint file has the start file's exact width and root markers; `.` and `*` fix a cell, `W` leaves it free.
- **Use rlife commands** (switch at the top, off by default): for recentering and fixed width on orthogonal and knightwise partials, the cutter writes one generation as an RLE and rlife builds the start file itself with `@yolo_1gp`. In tests rlife's own start files for cut partials gave searches that died at once, so the switch is off by default.

##### Where to cut

For Recentering, Fixed width and Back only, the panel on the right shows the partial with its errors (red dots) and the cut (the line; the shaded part is searched). **Click or drag on the partial to move the cut higher**; Backtrack in the options is set to match. Undo steps back, and **Back to the first error** resets it. Diagonal ships search along diagonal rows, so their cut is drawn as a staircase. Cutting higher lets the search redo rows that are valid but lead nowhere.

##### Options

- **Search order, Symmetry**: Leave on autodetect unless the cutter guessed wrong. Ignoring symmetry searches the full width (much bigger).

- **Extra columns**: Room beside the pattern for Fixed width (both sides) and the branch modes.

- **Backtrack**: How far above the first error to cut. Easier to set by clicking the picture; its unit is W rows for orthogonal and diagonal ships, whole lines for knightwise ones. Resets to 0 when you paste a new partial.

- **Lines to keep, Padding, Unrollable edges**: Back only and marked part alone: how many lines to keep, how much room either side of the back, and whether the window may grow past the question marks.

- **File name**: The start file's name; constraint files are named after it.

##### Running the search

Run the command from the Command tab in the folder holding rlife and your files. The last number is **mid\_steps**, how far the search window may reach each row:

- **Too small:** the search dies in its first rows (`Completed w_pos …: 0 B`, "Final results: 0 normal"), because partials grown in from both edges can't meet across the board.
- **Too large:** memory multiplies every row.

The command suggests a value (6 to 8 for recentering; about two thirds of the board width for a marked region); adjust from there. Put `export LLSSS_HALT_ON_ENDS=true` first to stop at the first result.

More about running

- **Quoting:** keep the `--constraint '…'` argument exactly as given, quotes included.
- **Memory:** `--pre-reify-autochoke 4GB` (about a third of your RAM) caps memory by throwing away part of the search when it would exceed the limit; results found are still valid, but some may be missed.
- **RLE output:** `export LLSSS_RLE_ENDS=true` prints finished ships as RLE.
- **Watching:** `… | tee out.txt` shows the log and saves it.
- **Version:** use an rlife build from after commit 5c48bb53850d (it fixes a hang).

##### Reading the log

- **Completed w\_pos N: SIZE [+P%]:** one more row searched; SIZE is the search's memory, P how fast it is growing.
- **Results: n normal:** finished ships found at this row. **Final results** at the end is the total.
- **Unique, Thinnest, Random[ish] partial:** pictures of the current state of the search.
- **Memory falling to 0 B** with "Final results: 0 normal": the search ran out of partials (nothing exists within these settings), not a crash.

Reading the percentages, and long pauses

amling's percentages are `200 × (next − prev) / (prev + next)`, bounded by ±200%. Convert back with `next / prev = (200 + p) / (200 − p)`: +67% is doubling, +100% is tripling, +150% is about 7×. A search that keeps adding +100% or more per row will run out of memory; cut higher, lower mid\_steps, or use Back only.

A long pause with no output is usually a slow row, not a hang. If an older rlife stops for a very long time at the same step, update it past commit 5c48bb53850d.

##### Symmetric partials

A partial that is mirror-symmetric across its line of travel is searched as one half, with `--left-edge odd` (the axis runs through a column) or `even` (the axis lies between columns; the first two columns of the file are copies). rlife supplies the other half as the exact mirror image, so anything near the axis interacts with its own reflection correctly, and every result is symmetric. To keep the two halves apart instead, use one of the Split options. Diagonal ships only use `odd`; rlife refuses `even` for them.

##### After a result

- **Halves:** results of a symmetric search are halves; unfold them at the axis (Golly's mirror tools work).
- **Back only, marked part alone:** results cover only the search window; join them onto the rest of the ship by hand.
- Check every result in Golly before posting it.

Unfolding a half

Odd: the first column of the half is the axis; mirror the other columns around it. Even: the first two columns are copies of each other; the axis lies between them, so drop one copy and mirror. Diagonal halves mirror across the line of travel.

##### Problems

- **The search dies in its first rows, or blows up**: Usually mid\_steps: too small dies at once, too large multiplies memory (see Running the search). For a marked region, keep the box tight and "grow outside" off.

- **rlife panics about root columns (`Duplicate values for MCollectMatched`, or an assertion in `wildcards.rs`)**: The file was made by an older cutter whose root-marker columns didn't match. Build it again with the current page.

- **"Already a valid ship!"**: The partial has no errors: it is a complete ship.

- **The grid doesn't follow the rule**: Set the Rule box to the rule the search used; the message suggests the rule the grid fits.

- **`ParseError: UnrecognizedToken` on `--constraint`**: Missing quotes; use the command as given.

- **A choice is greyed out**: It doesn't fit this partial; hover over it for the reason.

- **Saved files end in `.txt`**: The online copy adds `.txt` (`p1.in.txt`); remove it, or use the offline copy, which saves real names.

##### Terms

Glossary (amling's terms)

These follow amling's usage in his State of the Union post (page 24, 30 September 2026). The development notes (at the end) have the full list.

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

Development notes and sources (how the cutter's choices were worked out; not needed to use it)

##### Development notes and sources

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

###### First-page rewrite and terminology (2 Oct, evening)

- **Your rewrite of the first page** (header, About box, switch, both cards, menus, hints, stats, banners, messages, command comments, Q&A) is applied. "Empty axis columns" is at the bottom of its menu, and Backtrack and Unrollable edges have their explanations in small text.
- **"CA discontinuity" dropped.** amling used it once, in passing (22 Sep, page 22); rlife's code never uses it (it calls them `bad_ca` cells). His usual wording is "CA checks that fail" (24 posts, most recently 29 Aug) and "the first error" (6 posts). The "most recent mention" rule had over-weighted that one-off phrase. *Applied:* the page and the guide now say "error" ("First error", "At first detected error").
- **mid\_steps lowered** on request: the suggestion is now the board width plus 2, kept between 6 and 8 (was 8 to 12).
- **Diagonal log grids:** the reader now tries every speed up to one cell per generation; the c/4 limit was only true for Life. The "needs at least 4 generations" message is gone.
- **Backtrack's unit** differs by geometry, and the label now says so: W rows for orthogonal and diagonal ships, whole lines for knightwise ones.

###### Re-search a marked region, or search it alone (2 Oct)

- **Why:** a (2,1)c/5 ship in B3/S234w was valid except for a small broken side branch near the front. The normal cut stops at the first error and throws away the valid body after it. The split modes need mirror symmetry, which a knightwise ship can't have. `--fuzzy-left-edge` (`src/llsss/cli/recentering.rs`) only lets the window's left boundary float, dropping what lies beyond it rather than keeping it fixed.
- *Applied:* two new choices under Where to cut, sharing a rectangle-drawing panel (default: the box around the errors).
- **Search a marked part alone:** Back only pointed at the rectangle. The search starts from the rows just above it, within its columns plus padding, and ignores the rest. Refused if an error lies in those starting rows.
- **Re-search a marked region (rest kept fixed):** every row is kept; question marks run from the top of the rectangle to the bottom across the full width. A constraint file (`grid("NAME-pre.cstr", none)`; rlife requires the constraint grid to have the start file's width and root markers and crops it the same way, `src/llsss/cli/common.rs`) fixes the rest of the partial plus a two-cell border of empty cells. Everything else is free, so the part can grow away from the ship while nothing can come close enough to change it. The first version fixed every cell outside the rectangle; that confined the part to the rectangle, so it was changed on request. The rectangle must cover every error.
- Orthogonal front-to-back ships use W-row writers (one root row); knightwise ships use the row-based writer. On the test ship, "kept fixed" fixes 4,793 cells (the body's 1,242 live cells and their border) and leaves 4,807 free; layouts pass, the constraint files match the start files exactly, and every fully fixed check follows the rule. "Alone" gives a 23-column file. All other modes give byte-identical files.
- **Bug (3 Oct):** rlife panicked (`Duplicate values for MCollectMatched for key LatGridRootFancy { c: 'L' … }`, `ars/core/src/mcollect.rs`) on a knightwise "alone" file. Columns that share a root letter must hold identical cells, and the knightwise writer copied the rest of the partial into the `L` and `R` columns outside the window. *Applied:* in Back only and "alone", cells outside the window are left empty. The validator now checks that root-letter columns agree on known cells (question marks over a root column are fine; such files ran). All 333 earlier test files pass it.
- **"Alone" on a bump beside the body (3 Oct):** the five partials it found were valid continuations of a fragment of the ship's side, cut out of context, and none could attach to the ship. "Alone" only suits a part that is really separate, with empty space between it and the rest. *Applied:* "alone" now warns when the rest of the partial comes within 3 cells of the marked part (from the starting rows down), and points to "Re-search a marked region", which keeps the rest fixed.
- **Bug (3 Oct):** rlife panicked in `src/llsss/wildcards.rs:248` (`assert_eq!` in `compile1`) on a region-mode constraint file. Columns sharing a root letter must be identical in a constraint grid too, `W` included. The last `L` and first `R` columns lie inside the question marks and were fixed where the body's border reached them, while their partner columns stayed `W`. *Applied:* each group of root columns now takes one value (fixed dead together where the inner one borders the body, otherwise free); the drawn-line mode, which had the same latent bug at its `R` columns, now leaves them free. The validator checks constraint files for this too; the file that panicked fails it, and every new constraint file passes.
- **First successful parse (3 Oct):** rlife accepted a region-mode start file and constraint file and searched, but found nothing even in the first row (`Completed w_pos 2[0]: 0 B`) at any mid\_steps. *Applied (bug fix):* error positions for ships that move sideways were one column off for errors found across the period wrap (`errors()` shifted y but not x by KX); all 11 errors on the test ship moved. The default box margin is now two cells, since errors mark failed checks rather than every cell a repair needs. *Open:* a known-answer test (a copperhead with two damaged cells, where the original is a guaranteed solution) separates "the files are wrong" from "the box is too small".
- **Tested with rlife here (3 Oct).** A built rlife was available in the sandbox, so the region mode was debugged directly.
- Known answer: a copperhead (c/10, B3/S23) with two damaged cells. With a tight box (the errors, or the errors plus one cell), strict fixing and mid\_steps 11–12, rlife repaired it ("End", "Results: 1 normal"). **The region files and constraint mechanism are correct.**
- Dying in the first row was mid\_steps: 8 can't span a 16-column board (rlife's own `mgp-tool` file for the same damaged ship died the same way and searched normally at 16). A two-cell margin made the search explode; freeing the empty space ("grow outside") also exploded without finding the answer.
- *Applied:* strict fixing is the default again (everything outside the box fixed), with "Let it grow outside the box" as an option; the default margin is one cell; this mode's command suggests mid\_steps of about two thirds of the board width.
- The (2,1)c/5 B3/S234w ship: every box tried (tight to tall and wide, strict and growing, mid\_steps 8 to 44) dies about 11–13 lines into the search. The body near the branch seems to have been built around the broken branch, so no branch fits it while the body stays fixed. Fixing it needs more of the body re-searched, which grows the search.

###### Picker and cut panel (3 Oct)

- **Guide rewritten (6 Oct):** a short overview at the main level (quick start, choosing a mode, where to cut, options, running the search, reading the log, symmetric partials, after a result, problems), with details, the glossary and these notes in collapsed dropdowns. About 1,200 words at the main level, down from about 5,600.
- *Applied:* the mode picker now has four main choices (Recentering from the first error, Fixed width, Extend one branch beside its sibling, Back only) and a collapsed **More options** list (drawn line, the two marked-region modes, and the two axis splits with their edge menu). Back only is a main choice because it is the one other mode with a clear result in rlife: the sprayer search went from blowing up past 30 GB at full width to finishing in seconds at about 100 MB.
- *Applied:* a **Where to cut** panel for Recentering, Fixed width and Back only (front-to-back orthogonal and knightwise). It draws the partial, its errors and the cut; clicking or dragging moves the cut higher and sets Backtrack to match, with Undo and "Back to the first error". The cut comes from the writer's own `keep` (orthogonal: W = N·y + K·t; knightwise: row·N), so no rebuild is needed while dragging. Checked: the cells drawn above the line match the live cells kept in the start file, per generation, for orthogonal and knightwise partials at several backtracks. *Applied (diagonal):* the diagonal writer now reports its lattice, cells and `keep`; the panel lines its picture up with them (every live cell must match, or no panel) and draws the cut as the staircase it is. Clicking a cell makes its tile row the first one searched; checked on asymmetric and symmetric diagonal partials and a diagonal log grid, and the kept cells match the file for every full-width diagonal file tested. Backtrack now resets to 0 when a new partial is pasted.

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
