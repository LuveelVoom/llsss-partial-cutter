Diagonal tests for the partial cutter (B3/S23)
================================================
Three diagonal ships from your file, each cut at 70% of its length (the back 30% removed). The cutter's files were
checked against the real ships cell by cell, but nothing here has been run in rlife yet. Run each A and B command for
about a minute (or until it prints a result), and C once.

Run `export LLSSS_HALT_ON_ENDS=true` first so a search stops at its first result.

Please send back, for each run: any error, or the first ~40 lines of the log plus the first few "Completed w_pos"
lines; for C, the two .in files it writes. If a run prints "End" and "Results: 1 normal", that's the search
rediscovering the ship's real back, which is the best possible outcome.

== ship 0: c/5 diagonal, symmetric across its line of travel (c5d-f2b)
   files: ship0-partial.rle (all generations), ship0-partial-1gen.rle, ship0.in (the cutter's own start file)
   A. the cutter's symmetric half:
      ./rlife llsss-recentering --rule 'B3/S23' --left-edge odd c5d-f2b ship0.in 11 > out-0a.txt
   B. same file with the even edge (I expect rlife to refuse it as "not compatible with geometry"):
      ./rlife llsss-recentering --rule 'B3/S23' --left-edge even c5d-f2b ship0.in 11 > out-0b.txt
   C. amling's tools at full width, for comparison:
      ./rlife mgp-tool ingest-1gp c5d-f2b --rule 'B3/S23' ship0-partial-1gen.rle ship0-ingested.in
      ./rlife mgp-tool to-rc-input c5d-f2b ship0-ingested.in ship0-rc.in
      (if ingest-1gp complains, try adding --shift-idx 1)
FAILED C WITH
thread 'main' (4279938) panicked at src/gol/ff.rs:326:25:
assertion `left == right` failed
  left: 0
 right: 1
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


== ship 1: c/5 diagonal, not symmetric (c5d-f2b)
   files: ship1-partial.rle (all generations), ship1-partial-1gen.rle, ship1.in (the cutter's own start file)
   A. rlife builds the start file itself (what the cutter does by default):
      ./rlife llsss-recentering --rule 'B3/S23' c5d-f2b '@yolo_1gp("ship1.rle")' 18 > out-1a.txt
FAILED A WITH
thread 'main' (4280643) panicked at src/gol/ff.rs:326:25:
assertion `left == right` failed
  left: 0
 right: 1
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

   B. the cutter's own start file:
      ./rlife llsss-recentering --rule 'B3/S23' c5d-f2b ship1.in 18 > out-1b.txt
   C. amling's tools step by step, for comparison:
FAILED C WITH
thread 'main' (4282251) panicked at src/gol/ff.rs:326:25:
assertion `left == right` failed
  left: 0
 right: 1
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

      ./rlife mgp-tool ingest-1gp c5d-f2b --rule 'B3/S23' ship1-partial-1gen.rle ship1-ingested.in
      ./rlife mgp-tool to-rc-input c5d-f2b ship1-ingested.in ship1-rc.in
      (if ingest-1gp complains, try adding --shift-idx 1)

== ship 2: c/6 diagonal, not symmetric (c6d-f2b)
   files: ship2-partial.rle (all generations), ship2-partial-1gen.rle, ship2.in (the cutter's own start file)
   A. rlife builds the start file itself (what the cutter does by default):
      ./rlife llsss-recentering --rule 'B3/S23' c6d-f2b '@yolo_1gp("ship2.rle")' 16 > out-2a.txt
FAILED A WITH
thread 'main' (4282798) panicked at src/gol/ff.rs:326:25:
assertion `left == right` failed
  left: 0
 right: 2
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

   B. the cutter's own start file:
      ./rlife llsss-recentering --rule 'B3/S23' c6d-f2b ship2.in 16 > out-2b.txt
   C. amling's tools step by step, for comparison:
FAILED C WITH
thread 'main' (4283404) panicked at src/gol/ff.rs:326:25:
assertion `left == right` failed
  left: 0
 right: 2
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
      ./rlife mgp-tool ingest-1gp c6d-f2b --rule 'B3/S23' ship2-partial-1gen.rle ship2-ingested.in
      ./rlife mgp-tool to-rc-input c6d-f2b ship2-ingested.in ship2-rc.in
      (if ingest-1gp complains, try adding --shift-idx 1)
