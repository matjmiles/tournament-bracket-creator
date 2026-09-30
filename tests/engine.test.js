// Runs the bracket engine from bracket.html for every supported size and format.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'bracket.html'), 'utf8');
const src = html.split('/* ENGINE-START */')[1].split('/* ENGINE-END */')[0];
const BracketEngine = new Function(src + '; return BracketEngine;')();
const { U } = BracketEngine;

let failures = 0;
for (const dbl of [false, true]) {
  for (let n = 2; n <= 32; n++) {
    const b = BracketEngine.build(n, dbl);
    const errs = BracketEngine.validate(b);
    const L = BracketEngine.layout(b);
    // No two game blocks may overlap.
    const boxes = [...L.pos.entries()].map(([id, p]) => ({ id, x0: p.x, x1: p.x + U.BW, y0: p.cy - U.RH - U.LABEL, y1: p.cy + U.RH + U.META }));
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], c = boxes[j];
      if (a.x0 < c.x1 && c.x0 < a.x1 && a.y0 < c.y1 && c.y0 < a.y1) errs.push(`overlap ${a.id}/${c.id}`);
    }
    if (errs.length) { failures++; console.log(`${dbl ? 'double' : 'single'} ${n}: ${errs.join('; ')}`); }
  }
}
for (const n of [21, 18]) {
  const b = BracketEngine.build(n, true);
  const count = br => b.games.filter(g => g.bracket === br).length;
  console.log(`${n} teams double: ${b.games.length} games (W ${count('W')}, L ${count('L')}, finals ${count('F')})`);
}
console.log(failures ? `${failures} FAILED` : 'All 62 configurations passed');
process.exit(failures ? 1 : 0);
