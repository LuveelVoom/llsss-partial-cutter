Known-answer test for "Extend one branch beside its sibling (fuzzy edge)"
=========================================================================
232p7h3v0.rle is the complete 3c/7 ship (B3/S23). Each file is the cutter's own output for a cut at W=189, row 27,
where the half splits into an inner tail and an outer arm. Commands are the ones the cutter wrote. Measured 31 Oct
2026, rlife 2193dcf0, RAYON_NUM_THREADS=8, LLSSS_HALT_ON_ENDS=true. Each stops with "Final results: 1 normal".

file   searches                  command flags                                                     mid  time  peak
t_r    outer arm, half           --left-pad 07 --right-pad 01 --fuzzy-left-edge                    09   180s  11.2GB
t_l    inner tail, half          --left-edge odd --right-pad 09 --fuzzy-right-edge                 10     8s   3.1GB
t_ar   right arm, full width     --left-pad 09 --right-pad 01 --fuzzy-left-edge                    09   180s  11.2GB
t_al   left arm, full width      --left-pad 01 --right-pad 09 --fuzzy-right-edge                   09   174s  11.0GB

  ./rlife llsss-recentering --rule B3/S23 <flags> 3c7-f2b <file> <mid>

Every row of each result below the cut matches the true ship (182 rows for the arms, 46 for the tail). t_r's window
starts at file column 7, so the printed chart leaves columns 0-6 out.
mid_steps 08 on the t_r setup exhausts with no result: too small loses the ship.
