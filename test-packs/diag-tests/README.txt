Diagonal tests for the partial cutter (B3/S23), round 4
=======================================================
Round 3 results:
  - amling's own ship1-rc.in and ship2-rc.in (mgp-tool only) also start with no states and stop at once, like
    @yolo_1gp did. So that is not caused by the cutter. report-for-amling-draft.txt is a draft report, if you want it.
  - the cutter's ship 2 file with mid_steps 8 died in its first row: the search grows partials in from both edges
    and keeps only those that join up, and 8 steps don't span ship 2's 18 columns. With 16 it had blown up.

Two short runs (about 30 seconds each), with the cutter's new default mid_steps of 12:

  export LLSSS_HALT_ON_ENDS=true
  ./rlife llsss-recentering --rule 'B3/S23' c6d-f2b ship2.in 12 > out-2f.txt 2>&1
  ./rlife llsss-recentering --rule 'B3/S23' c5d-f2b ship1.in 12 > out-1f.txt 2>&1

Send back both out-*.txt files.
