# Tournament Bracket Creator — Design

Date: 2026-09-30

## Goal
A reusable, printable bracket generator. First uses: a 21-team and an 18-team
double-elimination bracket. Future brackets: type the team count and pick
single/double elimination.

## Decisions (from interview)
| Topic | Decision |
|---|---|
| Format | Single self-contained `bracket.html`, opened in a browser, printed from there |
| Team lines | Blank for handwriting; seed numbers printed where a seeded team enters |
| Byes | Standard seeding, top seeds get byes; compact layout (only real games drawn) |
| Grand final | Final + "If Necessary" game |
| Paper | US Letter, landscape; multi-page, taped together |
| Layout | Winners bracket on top, losers bracket below, both flowing right into the championship |
| Game details | Game numbers, loser routing ("Loser of G7"), score boxes, time/court line, round headers |
| Header | Title, subtitle/division, date |
| Team range | 2–32 |
| Delivery | Local file (prints) + private claude.ai link (preview only — that viewer cannot print) |

## Bracket engine
- `P` = next power of two ≥ N, `k = log2(P)`. Standard seed order (1 v P, …).
- Winners: rounds 1..k. Losers (double, k ≥ 2): rounds 1..2k−2. L1 pairs W1 losers;
  even round L2m pairs L(2m−1) winners against W(m+1) losers; odd round L(2m+1)
  pairs L2m winners. Drop order alternates (reversed / halves swapped) to avoid
  quick rematches.
- k = 1 (2 teams): grand final is winner of G1 vs loser of G1.
- Byes are resolved by propagation: a game with one missing input is a pass-through
  (its team advances directly; it is not drawn), a game with none is removed.
- Games numbered in play order: W1, then for r = 2..k: Wr, L(2r−3), L(2r−2); then
  Grand Final, If Necessary. Top to bottom within a round.

## Layout
- Each bracket is a tree; laid out recursively so every game sits centered between
  its two inputs, with fixed-size game boxes and elbow connectors. Column = round.
- Grand Final sits in the first free column right of both brackets, vertically
  between the winners final and losers final; If Necessary and Champion follow.

## Printing
- Drawing is at fixed physical size (100%, with optional 85%/70% print size).
- Split into letter-landscape tiles with 0.4" overlap; crosshair registration marks
  in the overlap strips; each page labeled "Page n of m · Row r, Column c".
- Tiles with no content are skipped.

## Verification
- Built-in check: seeds 1..N each appear once; every winner/loser feeds exactly one
  slot; game count = N−1 (single) or 2N−1 (double incl. If Necessary).
- Node test runs the engine for N = 2..32, single and double.
- Headless print-to-PDF of the 21- and 18-team brackets for visual review.
