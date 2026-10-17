Next tests for the partial cutter
=================================
1. @yolo_1gp on your (2,1)c/5 partial (B3/S23-a5). This is the cutter's default route for asymmetric orthogonal and
   knightwise partials, and it has never been seen to work. About 30 seconds each:

     export LLSSS_HALT_ON_ENDS=true
     ./rlife llsss-recentering --rule 'B3/S23-a5' c5k-1 '@yolo_1gp("yolo-2-1c5.rle")' 12 > out-yolo.txt 2>&1
     ./rlife llsss-recentering --rule 'B3/S23-a5' c5k-1 cutter-2-1c5.in 12 > out-cutter.txt 2>&1

   (the second is the cutter's own start file, for comparison)

2. Back only, on the sprayer (B3/S23), about 30 seconds each:

     ./rlife llsss-recentering --rule 'B3/S23' c6k-1 sprayer-tail-fixed.in 12 > out-tail-fixed.txt 2>&1
     ./rlife llsss-recentering --rule 'B3/S23' c6k-1 sprayer-tail-widen.in 12 > out-tail-widen.txt 2>&1

   sprayer-tail-widen12.in is the same with 12 lines kept instead of 8, if you want a third run.

Files:
  partial-2-1c5.rle            your (2,1)c/5 partial, one generation
  yolo-2-1c5.rle               the one generation the cutter hands to @yolo_1gp
  cutter-2-1c5.in              the cutter's own start file for it
  sprayer-tail-*.in            the back-only sprayer files (unchanged since they were made)
  out-*-grid.txt               diagonal partials taken from your earlier logs (for the cutter's diagonal log-grid
                               support; nothing to run)

Send back the out-*.txt files.
