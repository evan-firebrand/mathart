/**
 * Headless test harness for UMAT.Genome
 * Run with: node test_headless_genome.js
 */
'use strict';

// Provide a minimal global so the library's IIFE finds it
const global_obj = {};
global_obj.UMAT = {};

// Load the library
const src = require('fs').readFileSync(__dirname + '/umat-genome.js', 'utf8');
const fn = new Function('window', 'global', src);
fn(global_obj, global_obj);

const G = global_obj.UMAT.Genome;

// =========================================================================
// Test runner
// =========================================================================
let passed = 0;
let failed = 0;
const errors = [];

function assert(label, condition) {
  if (condition) {
    passed++;
    process.stdout.write('  ✓ ' + label + '\n');
  } else {
    failed++;
    errors.push(label);
    process.stdout.write('  ✗ FAIL: ' + label + '\n');
  }
}

function assertNear(label, actual, expected, tol) {
  tol = tol || 0.01;
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) {
    process.stdout.write('    → got ' + actual.toFixed(5) + ', expected ' + expected.toFixed(5) + ' ±' + tol + '\n');
  }
  assert(label, ok);
}

function section(name) {
  console.log('\n[' + name + ']');
}

section('makeXorshift32');
{
  const rng = G.makeXorshift32(42);
  const samples = Array.from({ length: 1000 }, rng);
  assert('all values in [0,1)', samples.every(v => v >= 0 && v < 1));
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  assertNear('mean ≈ 0.5', mean, 0.5, 0.06);
  const rng2 = G.makeXorshift32(42);
  const s1 = Array.from({ length: 10 }, rng2);
  const rng3 = G.makeXorshift32(42);
  const s2 = Array.from({ length: 10 }, rng3);
  assert('same seed → same sequence', s1.every((v, i) => v === s2[i]));
  const rng4 = G.makeXorshift32(99);
  const s3 = Array.from({ length: 10 }, rng4);
  assert('different seed → different sequence', s1.some((v, i) => v !== s3[i]));
}

section('gauss');
{
  const rng = G.makeXorshift32(7);
  const N = 5000;
  const samples = Array.from({ length: N }, () => G.gauss(rng));
  const mean = samples.reduce((a, b) => a + b, 0) / N;
  const variance = samples.reduce((a, b) => a + b * b, 0) / N;
  assertNear('mean ≈ 0', mean, 0, 0.05);
  assertNear('variance ≈ 1', variance, 1, 0.08);
  assert('values span negatives', samples.some(v => v < -1));
  assert('values span positives', samples.some(v => v > 1));
}

section('circularMean');
{
  assertNear('mean([10,20,30]) ≈ 20', G.circularMean([10, 20, 30], [0, 360]), 20, 1);
  const m2 = G.circularMean([350, 10], [0, 360]);
  assert('mean([350,10]) near 0° (not 180°)', Math.min(Math.abs(m2), Math.abs(m2 - 360)) < 5);
  assertNear('mean([90]) = 90', G.circularMean([90], [0, 360]), 90, 1);
  assert('mean([]) = range[0]', G.circularMean([], [0, 360]) === 0);
  const m3 = G.circularMean([0.95, 0.05], [0, 1]);
  assert('mean([0.95,0.05]) near 0 in [0,1) range', m3 < 0.1 || m3 > 0.9);
}

section('signedCircularDiff');
{
  assertNear('diff(30, 10) = +20', G.signedCircularDiff(30, 10, [0, 360]), 20, 0.01);
  assertNear('diff(10, 30) = -20', G.signedCircularDiff(10, 30, [0, 360]), -20, 0.01);
  assertNear('diff(10, 350) = +20', G.signedCircularDiff(10, 350, [0, 360]), 20, 0.01);
  assertNear('diff(350, 10) = -20', G.signedCircularDiff(350, 10, [0, 360]), -20, 0.01);
  const d180 = G.signedCircularDiff(180, 0, [0, 360]);
  assert('diff(180, 0) = ±180', Math.abs(Math.abs(d180) - 180) < 0.01);
}

section('wrapCircular');
{
  assertNear('wrap(370) = 10', G.wrapCircular(370, [0, 360]), 10, 0.01);
  assertNear('wrap(-10) = 350', G.wrapCircular(-10, [0, 360]), 350, 0.01);
  assertNear('wrap(360) = 0', G.wrapCircular(360, [0, 360]), 0, 0.01);
  assertNear('wrap(180) = 180', G.wrapCircular(180, [0, 360]), 180, 0.01);
}

section('makeCircularMeanTracker');
{
  const tracker = G.makeCircularMeanTracker([0, 360]);
  tracker.add(350); tracker.add(10);
  assert('tracker: mean([350,10]) near 0°', Math.min(Math.abs(tracker.mean()), Math.abs(tracker.mean() - 360)) < 5);
  assert('tracker: count = 2', tracker.count() === 2);
  tracker.remove(10);
  assert('tracker: count = 1 after remove', tracker.count() === 1);
  assertNear('tracker: mean = 350 after removing 10', tracker.mean(), 350, 1);
  tracker.reset();
  assert('tracker: count = 0 after reset', tracker.count() === 0);
}

section('MutationKernels.gaussian');
{
  const rng = G.makeXorshift32(13);
  const results = Array.from({ length: 2000 }, () => G.MutationKernels.gaussian(0.5, 0.1, rng, null));
  assertNear('gaussian mean ≈ 0.5', results.reduce((a, b) => a + b, 0) / results.length, 0.5, 0.02);
  const rng2 = G.makeXorshift32(14);
  const clipped = Array.from({ length: 500 }, () => G.MutationKernels.gaussian(0.5, 10, rng2, [0, 1]));
  assert('all clipped within [0,1]', clipped.every(v => v >= 0 && v <= 1));
}

section('MutationKernels.circular_gaussian');
{
  const rng = G.makeXorshift32(17);
  const results = Array.from({ length: 2000 }, () => G.MutationKernels.circular_gaussian(0, 30, rng, [0, 360]));
  assert('all in [0, 360)', results.every(v => v >= 0 && v < 360));
  const rng2 = G.makeXorshift32(18);
  const tight = Array.from({ length: 2000 }, () => G.MutationKernels.circular_gaussian(180, 5, rng2, [0, 360]));
  assertNear('circular_gaussian mean ≈ 180 with small sigma', G.circularMean(tight, [0, 360]), 180, 5);
  const rng3 = G.makeXorshift32(19);
  const boundary = Array.from({ length: 500 }, () => G.MutationKernels.circular_gaussian(358, 50, rng3, [0, 360]));
  assert('no values outside [0,360) at boundary', boundary.every(v => v >= 0 && v < 360));
}

section('MutationKernels.log_normal');
{
  const rng = G.makeXorshift32(21);
  const results = Array.from({ length: 1000 }, () => G.MutationKernels.log_normal(1.0, 0.1, rng, null));
  assert('log_normal: all positive', results.every(v => v > 0));
  assertNear('log_normal: log-mean ≈ 0', results.map(Math.log).reduce((a, b) => a + b, 0) / results.length, 0, 0.05);
}

section('MutationKernels.categorical');
{
  const rng = G.makeXorshift32(23);
  const opts = ['A', 'B', 'C'];
  const results = Array.from({ length: 900 }, () => G.MutationKernels.categorical('A', opts, rng));
  assert('categorical: only valid options', results.every(v => opts.includes(v)));
  assertNear('categorical: freq A ≈ 1/3', results.filter(v => v === 'A').length / 900, 0.333, 0.06);
  assertNear('categorical: freq B ≈ 1/3', results.filter(v => v === 'B').length / 900, 0.333, 0.06);
  assertNear('categorical: freq C ≈ 1/3', results.filter(v => v === 'C').length / 900, 0.333, 0.06);
}

section('TraitSchema.makeGenome');
{
  const schema = G.TraitSchema({
    hue:       { kernel: 'circular_gaussian', sigma: 10,   range: [0, 360] },
    threshold: { kernel: 'gaussian',          sigma: 0.04, clip: [0.05, 0.98] },
    growth:    { kernel: 'gaussian',          sigma: 0.04, clip: [0.05, 1.0] },
    jitter:    { kernel: 'log_normal',        sigma: 0.1,  clip: [0.001, 0.1] },
  }, { seed: 1 });
  const g = schema.makeGenome({ hue: 120, threshold: 0.6, growth: 0.02, jitter: 0.01 });
  assert('makeGenome: correct hue', g.hue === 120);
  assert('makeGenome: correct threshold', g.threshold === 0.6);
  assert('makeGenome: correct growth', g.growth === 0.02);
  assert('makeGenome: correct jitter', g.jitter === 0.01);
  assert('makeGenome: missing → 0', schema.makeGenome({ hue: 45 }).threshold === 0);
  const names = schema.traitNames();
  assert('traitNames: all 4 traits', names.length === 4);
  assert('traitNames: includes hue', names.includes('hue'));
}

section('TraitSchema.mutate');
{
  const schema = G.TraitSchema({
    hue:       { kernel: 'circular_gaussian', sigma: 10,   range: [0, 360] },
    threshold: { kernel: 'gaussian',          sigma: 0.04, clip: [0.05, 0.98] },
    growth:    { kernel: 'gaussian',          sigma: 0.04, clip: [0.05, 1.0] },
  }, { seed: 2 });
  const parent = schema.makeGenome({ hue: 60, threshold: 0.5, growth: 0.3 });
  const child = schema.mutate(parent);
  assert('mutate: returns new object', child !== parent);
  assert('mutate: child has all traits', 'hue' in child && 'threshold' in child && 'growth' in child);
  assert('mutate: threshold within clip', child.threshold >= 0.05 && child.threshold <= 0.98);
  assert('mutate: growth within clip', child.growth >= 0.05 && child.growth <= 1.0);
  assert('mutate: hue in [0,360)', child.hue >= 0 && child.hue < 360);
  assert('mutate: parent unchanged', parent.hue === 60 && parent.threshold === 0.5);
}

section('TraitSchema.inherit (random-parent)');
{
  const schema = G.TraitSchema({ flag: { kernel: 'gaussian', sigma: 0.0001, clip: [0, 1] } }, { seed: 3 });
  const parentA = schema.makeGenome({ flag: 0.0 });
  const parentB = schema.makeGenome({ flag: 1.0 });
  let fromA = 0, fromB = 0;
  for (let i = 0; i < 400; i++) {
    const child = schema.inherit(parentA, parentB);
    if (child.flag < 0.5) fromA++; else fromB++;
  }
  assertNear('inherit: ~50% from parent A', fromA / 400, 0.5, 0.08);
  assertNear('inherit: ~50% from parent B', fromB / 400, 0.5, 0.08);
}

section('TraitSchema.blend');
{
  const schema = G.TraitSchema({
    x: { kernel: 'gaussian', sigma: 0, clip: [0, 1] },
    y: { kernel: 'gaussian', sigma: 0, clip: [0, 1] },
  }, { seed: 4 });
  const pA = schema.makeGenome({ x: 0, y: 0 });
  const pB = schema.makeGenome({ x: 1, y: 1 });
  let xFromA = 0, yFromA = 0;
  for (let i = 0; i < 200; i++) {
    const b = schema.blend(pA, pB);
    if (b.x < 0.5) xFromA++;
    if (b.y < 0.5) yFromA++;
  }
  assertNear('blend: x ≈ 50% from A', xFromA / 200, 0.5, 0.1);
  assertNear('blend: y ≈ 50% from A', yFromA / 200, 0.5, 0.1);
}

section('Inheritance.random_parent');
{
  const schema = G.TraitSchema({ flag: { kernel: 'gaussian', sigma: 0.0001, clip: [0, 1] } }, { seed: 5 });
  const rng = G.makeXorshift32(5);
  const pA = schema.makeGenome({ flag: 0.0 });
  const pB = schema.makeGenome({ flag: 1.0 });
  let fromA = 0;
  for (let i = 0; i < 400; i++) {
    if (G.Inheritance.random_parent(pA, pB, schema, rng).flag < 0.5) fromA++;
  }
  assertNear('Inheritance.random_parent: ~50/50', fromA / 400, 0.5, 0.08);
}

section('LineageRegistry basic lifecycle');
{
  const reg = G.LineageRegistry(5, {});
  assert('isBorn: false before any birth', !reg.isBorn(0));
  reg.recordBirth(0, 10);
  assert('isBorn: true after birth', reg.isBorn(0));
  assert('count = 1', reg.count(0) === 1);
  assert('not extinct', !reg.isExtinct(0));
  reg.recordBirth(0, 11); reg.recordBirth(0, 12);
  assert('count = 3', reg.count(0) === 3);
  assert('peak = 3', reg.peak(0) === 3);
  reg.recordDeath(0, 20);
  assert('count = 2 after death', reg.count(0) === 2);
  assert('still alive', !reg.isExtinct(0));
  reg.recordDeath(0, 21); reg.recordDeath(0, 22);
  assert('count = 0 after all deaths', reg.count(0) === 0);
  assert('extinct at tick 22', reg.isExtinct(0) && reg.peak(0) === 3);
  const snap = reg.snapshot(30);
  assert('snapshot extinctTick = 22', snap[0].extinctTick === 22);
  assert('snapshot age = 22 - 10 = 12', snap[0].age === 12);
  assert('snapshot peak = 3', snap[0].peak === 3);
  assert('snapshot status = extinct', snap[0].status === 'extinct');
}

section('LineageRegistry aliveCount / extinctCount');
{
  const reg = G.LineageRegistry(4, {});
  reg.recordBirth(0, 0); reg.recordBirth(1, 0); reg.recordBirth(2, 0); reg.recordBirth(3, 0);
  assert('4 alive', reg.aliveCount() === 4);
  assert('0 extinct', reg.extinctCount() === 0);
  reg.recordDeath(0, 10);
  assert('3 alive after extinction', reg.aliveCount() === 3);
  assert('1 extinct', reg.extinctCount() === 1);
}

section('LineageRegistry status');
{
  const reg = G.LineageRegistry(3, { fadingThreshold: 0.3 });
  for (let i = 0; i < 10; i++) reg.recordBirth(0, i);
  assert('thriving at peak', reg.status(0) === 'thriving');
  for (let i = 0; i < 8; i++) reg.recordDeath(0, 100 + i);
  assert('fading when count < 30% of peak', reg.status(0) === 'fading');
  reg.recordDeath(0, 200); reg.recordDeath(0, 201);
  assert('extinct when count = 0', reg.status(0) === 'extinct');
}

section('LineageRegistry updateMeanTrait');
{
  const reg = G.LineageRegistry(3, { trackTraits: ['hue', 'threshold'] });
  reg.recordBirth(0, 0);
  reg.updateMeanTrait(0, 'hue', 120.5);
  reg.updateMeanTrait(0, 'threshold', 0.65);
  reg.updateMeanTrait(0, 'unknown_trait', 99);
  const snap = reg.snapshot(10);
  assertNear('meanTrait.hue stored', snap[0].meanTrait.hue, 120.5, 0.01);
  assertNear('meanTrait.threshold stored', snap[0].meanTrait.threshold, 0.65, 0.01);
  assert('unknown trait not in meanTrait', !('unknown_trait' in snap[0].meanTrait));
}

section('LineageRegistry snapshot only includes born lineages');
{
  const reg = G.LineageRegistry(10, {});
  reg.recordBirth(3, 0); reg.recordBirth(7, 5);
  const snap = reg.snapshot(100);
  assert('snapshot length = 2', snap.length === 2);
  assert('ids are 3 and 7', snap.some(s => s.id === 3) && snap.some(s => s.id === 7));
}

section('LineageRegistry size()');
{
  assert('size = 12', G.LineageRegistry(12, {}).size() === 12);
}

section('Integration: schema + registry together');
{
  const schema = G.TraitSchema({
    hue:       { kernel: 'circular_gaussian', sigma: 10,   range: [0, 360] },
    threshold: { kernel: 'gaussian',          sigma: 0.04, clip: [0.05, 0.98] },
    growth:    { kernel: 'gaussian',          sigma: 0.04, clip: [0.05, 1.0] },
    jitter:    { kernel: 'log_normal',        sigma: 0.1,  clip: [0.001, 0.1] },
  }, { seed: 99 });
  const reg = G.LineageRegistry(3, { trackTraits: ['hue'] });
  const founders = [
    schema.makeGenome({ hue: 0,   threshold: 0.6, growth: 0.4, jitter: 0.01 }),
    schema.makeGenome({ hue: 120, threshold: 0.5, growth: 0.5, jitter: 0.01 }),
    schema.makeGenome({ hue: 240, threshold: 0.7, growth: 0.3, jitter: 0.02 }),
  ];
  const living = [[Object.assign({}, founders[0])],[Object.assign({}, founders[1])],[Object.assign({}, founders[2])]];
  for (let i = 0; i < 3; i++) reg.recordBirth(i, 0);
  for (let tick = 1; tick <= 20; tick++) {
    for (let i = 0; i < 3; i++) {
      if (living[i].length < 8 && schema._rng() < 0.3) {
        const pi = Math.floor(schema._rng() * living[i].length);
        living[i].push(schema.inherit(living[i][pi], living[i][(pi + 1) % living[i].length]));
        reg.recordBirth(i, tick);
      }
      if (living[i].length > 1 && schema._rng() < 0.15) { living[i].pop(); reg.recordDeath(i, tick); }
      if (living[i].length > 0) reg.updateMeanTrait(i, 'hue', G.circularMean(living[i].map(g => g.hue), [0, 360]));
    }
  }
  const snap = reg.snapshot(20);
  assert('snapshot has 3 entries', snap.length === 3);
  assert('all lineages alive', snap.every(s => s.status !== 'extinct'));
  assert('lineage 0 mean hue near 0°', G.signedCircularDiff(snap.find(s=>s.id===0).meanTrait.hue, 0, [0,360]) < 40);
  assert('lineage 1 mean hue near 120°', Math.abs(G.signedCircularDiff(snap.find(s=>s.id===1).meanTrait.hue, 120, [0,360])) < 40);
  assert('lineage 2 mean hue near 240°', Math.abs(G.signedCircularDiff(snap.find(s=>s.id===2).meanTrait.hue, 240, [0,360])) < 40);
}

console.log('\n' + '='.repeat(50));
console.log('UMAT.Genome headless tests');
console.log('PASSED: ' + passed + '   FAILED: ' + failed);
if (failed > 0) {
  errors.forEach(e => console.log('  ✗ ' + e));
  process.exit(1);
} else {
  console.log('All tests passed.');
  process.exit(0);
}
