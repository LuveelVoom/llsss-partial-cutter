Known-answer test for "Re-search a marked region"
==================================================
copperhead-damaged.rle is a real c/10 spaceship (the copperhead, B3/S23) with two cells of one generation damaged.
copper.in + copper-pre.cstr are the cutter's region files for it, with the default (tight) box around the errors.
Already run here with rlife: it repairs the ship and stops with "Results: 1 normal".

  export LLSSS_HALT_ON_ENDS=true
  ./rlife llsss-recentering --rule 'B3/S23' --constraint 'grid("copper-pre.cstr", none)' c10-f2b copper.in 11 > out-copper.txt 2>&1

Optional: run it on your machine to confirm the same result.
