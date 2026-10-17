Searching the broken branch of your (2,1)c/5 ship (B3/S234w)
=============================================================
Both use the box around the errors: lines 26 to 34, columns 19 to 29.

1. The branch alone (ignores the rest of the ship; small and fast):
     alone.in
     export LLSSS_HALT_ON_ENDS=true
     ./rlife llsss-recentering --rule 'B3/S234w' c5k-1 alone.in 08 > out-alone.txt 2>&1

2. The branch re-searched with the rest of the ship kept fixed (the body and a two-cell border are fixed by
   fixed-pre.cstr: 4925 cells; the other 6055 cells are free):
     fixed.in, fixed-pre.cstr
     ./rlife llsss-recentering --rule 'B3/S234w' --constraint 'grid("fixed-pre.cstr", none)' c5k-1 fixed.in 08 > out-fixed.txt 2>&1

Run each for about a minute, or until it prints a result. What to look for:
  - for 2, an error about the constraint: rlife doesn't accept the fixed cells;
  - "bcol 0 B, col 0 B" right at the start: no valid start state;
  - otherwise "Completed w_pos" lines: the search is running. In 2 the printed partials should show the body
    unchanged and the branch being rebuilt.

Send back out-alone.txt and out-fixed.txt.
