/**
 * UMAT.Genome v1.0.0
 * Heritable trait dynamics for spatially-embedded compositional systems.
 *
 * Provides: TraitSchema, MutationKernels, Inheritance, LineageRegistry,
 *           circularMean, signedCircularDiff, gauss, makeXorshift32
 *
 * Single file, no dependencies, deterministic given a seeded PRNG.
 * Matches EnergyField library shape: factory functions, typed arrays,
 * self-contained visualization utilities.
 */
(function (global) {
  'use strict';

  const UMAT = global.UMAT || (global.UMAT = {});

  UMAT.Genome = (() => {

    // =========================================================================
    // PRNG
    // =========================================================================

    /**
     * xorshift32 PRNG. Returns a function () => [0, 1).
     * Deterministic given the same seed. Suitable for injection into TraitSchema.
     */
    function makeXorshift32(seed) {
      let s = (seed >>> 0) || 1;
      return function xorshift32() {
        s ^= s << 13;
        s ^= s >>> 17;
        s ^= s << 5;
        return (s >>> 0) / 4294967296;
      };
    }

    // =========================================================================
    // SAMPLING
    // =========================================================================

    /**
     * Box-Muller standard normal sample. Returns one N(0,1) variate per call.
     * Consumes two rng calls; does not cache the second variate — keeps the
     * rng stream predictable for deterministic replay.
     */
    function gauss(rng) {
      const u1 = Math.max(rng(), 1e-10); // avoid log(0)
      const u2 = rng();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    // =========================================================================
    // CIRCULAR MATH
    // =========================================================================

    /**
     * Wrap a value into [range[0], range[1]).
     */
    function wrapCircular(value, range) {
      const span = range[1] - range[0];
      return ((value - range[0]) % span + span) % span + range[0];
    }

    /**
     * Circular mean of an array of values in the given range.
     * Uses atan2 of summed unit vectors — correct across wrap boundaries.
     * e.g. circularMean([350, 10], [0, 360]) ≈ 0, not 180.
     */
    function circularMean(values, range) {
      if (!values || values.length === 0) return range[0];
      const span = range[1] - range[0];
      let sinSum = 0;
      let cosSum = 0;
      for (let i = 0; i < values.length; i++) {
        const angle = ((values[i] - range[0]) / span) * 2 * Math.PI;
        sinSum += Math.sin(angle);
        cosSum += Math.cos(angle);
      }
      let angle = Math.atan2(sinSum, cosSum);
      if (angle < 0) angle += 2 * Math.PI;
      return (angle / (2 * Math.PI)) * span + range[0];
    }

    /**
     * Signed shortest-arc difference: a - b, mapped into (-span/2, span/2].
     * e.g. signedCircularDiff(10, 350, [0, 360]) = +20 (not -340).
     */
    function signedCircularDiff(a, b, range) {
      const span = range[1] - range[0];
      let diff = wrapCircular(a, range) - wrapCircular(b, range);
      if (diff > span / 2) diff -= span;
      if (diff <= -span / 2) diff += span;
      return diff;
    }

    /**
     * Incrementally track a circular mean without storing all samples.
     * Returns a tracker object: { add(value), remove(value), mean() }
     * Useful inside LineageRegistry for per-lineage running means.
     */
    function makeCircularMeanTracker(range) {
      const span = range[1] - range[0];
      let sinSum = 0;
      let cosSum = 0;
      let n = 0;
      return {
        add(value) {
          const angle = ((value - range[0]) / span) * 2 * Math.PI;
          sinSum += Math.sin(angle);
          cosSum += Math.cos(angle);
          n++;
        },
        remove(value) {
          const angle = ((value - range[0]) / span) * 2 * Math.PI;
          sinSum -= Math.sin(angle);
          cosSum -= Math.cos(angle);
          n = Math.max(0, n - 1);
        },
        reset() { sinSum = 0; cosSum = 0; n = 0; },
        count() { return n; },
        mean() {
          if (n === 0) return range[0];
          let angle = Math.atan2(sinSum, cosSum);
          if (angle < 0) angle += 2 * Math.PI;
          return (angle / (2 * Math.PI)) * span + range[0];
        },
      };
    }

    // =========================================================================
    // MUTATION KERNELS
    // =========================================================================

    /**
     * Pure mutation functions of (value, params, rng).
     * Each returns a new value with stochastic perturbation applied.
     */
    const MutationKernels = {
      /**
       * Additive Gaussian noise with optional clip range.
       * def: { sigma, clip?: [min, max] }
       */
      gaussian(value, sigma, rng, clip) {
        let result = value + gauss(rng) * sigma;
        if (clip) result = Math.max(clip[0], Math.min(clip[1], result));
        return result;
      },

      /**
       * Additive Gaussian noise with circular wrap.
       * def: { sigma, range: [lo, hi] }
       */
      circular_gaussian(value, sigma, rng, range) {
        const perturbed = value + gauss(rng) * sigma;
        return wrapCircular(perturbed, range);
      },

      /**
       * Log-normal scaling (multiplicative noise). Preserves sign for scale traits.
       * def: { sigma, clip?: [min, max] }
       */
      log_normal(value, sigma, rng, clip) {
        let result = value * Math.exp(gauss(rng) * sigma);
        if (clip) result = Math.max(clip[0], Math.min(clip[1], result));
        return result;
      },

      /**
       * Uniformly samples a new value from the options array.
       * def: { options: [...] }
       */
      categorical(value, options, rng) {
        return options[Math.floor(rng() * options.length)];
      },

      /** Dispatch on kernel name string. */
      apply(kernelName, value, def, rng) {
        switch (kernelName) {
          case 'gaussian':
            return MutationKernels.gaussian(value, def.sigma, rng, def.clip);
          case 'circular_gaussian':
            return MutationKernels.circular_gaussian(value, def.sigma, rng, def.range);
          case 'log_normal':
            return MutationKernels.log_normal(value, def.sigma, rng, def.clip);
          case 'categorical':
            return MutationKernels.categorical(value, def.options, rng);
          default:
            return value;
        }
      },
    };

    // =========================================================================
    // TRAIT SCHEMA
    // =========================================================================

    /**
     * TraitSchema(traitDefs, options?) → schema
     *
     * traitDefs: { traitName: { kernel, sigma, range?, clip?, options? }, ... }
     * options: { rng?, seed? }
     *
     * The schema object is the primary entry point for genome operations.
     * All trait names declared in traitDefs are enforced on every genome.
     */
    function TraitSchema(traitDefs, options) {
      options = options || {};
      const rng = options.rng || makeXorshift32(options.seed != null ? options.seed : 12345);
      const names = Object.keys(traitDefs);
      const defs = traitDefs;

      function mutateValue(name, value) {
        const def = defs[name];
        return MutationKernels.apply(def.kernel, value, def, rng);
      }

      const schema = {
        /** Trait names in declaration order. */
        traitNames() { return names.slice(); },

        /** Raw trait definition for inspection. */
        traitDef(name) { return defs[name]; },

        /**
         * Construct a genome from explicit trait values.
         * Missing traits default to 0. Extra keys are ignored.
         */
        makeGenome(values) {
          const genome = Object.create(null);
          for (let i = 0; i < names.length; i++) {
            const n = names[i];
            genome[n] = values != null && values[n] !== undefined ? values[n] : 0;
          }
          return genome;
        },

        /**
         * Mutate each trait independently using the schema's kernels.
         * Returns a new genome object; parent is not modified.
         */
        mutate(genome) {
          const child = Object.create(null);
          for (let i = 0; i < names.length; i++) {
            const n = names[i];
            child[n] = mutateValue(n, genome[n]);
          }
          return child;
        },

        /**
         * Per-trait 50/50 recombination of two genomes (no mutation).
         * Use for blend-style inheritance; for standard inheritance use inherit().
         */
        blend(parentA, parentB) {
          const child = Object.create(null);
          for (let i = 0; i < names.length; i++) {
            const n = names[i];
            child[n] = rng() < 0.5 ? parentA[n] : parentB[n];
          }
          return child;
        },

        /**
         * Random-parent inheritance: select one of the two parents with 50/50
         * probability, then apply mutation. This is the CORRECT default.
         *
         * Parent-A-only inheritance causes clockwise lineage drift (indexing
         * artifact, not biology). Always use this for split events.
         */
        inherit(parentA, parentB) {
          const parent = rng() < 0.5 ? parentA : parentB;
          return schema.mutate(parent);
        },

        /** Clone a genome with mutation (single-parent inheritance). */
        clone(genome) {
          return schema.mutate(genome);
        },

        /** The schema's internal rng — expose for Inheritance operators. */
        _rng: rng,
      };

      return schema;
    }

    // =========================================================================
    // INHERITANCE OPERATORS
    // =========================================================================

    /**
     * Standalone inheritance operators for use when you need explicit control
     * over the rng separate from the schema's. In most cases prefer
     * schema.inherit(parentA, parentB) which uses the schema's rng automatically.
     */
    const Inheritance = {
      /** Mutate a single parent. */
      clone_with_mutation(genome, schema) {
        return schema.mutate(genome);
      },

      /**
       * Pick one parent uniformly at random, then mutate.
       * rng defaults to schema._rng if not provided.
       */
      random_parent(parentA, parentB, schema, rng) {
        const r = rng || schema._rng;
        const parent = r() < 0.5 ? parentA : parentB;
        return schema.mutate(parent);
      },

      /** Per-trait coin-flip recombination without mutation. */
      blend(parentA, parentB, schema) {
        return schema.blend(parentA, parentB);
      },
    };

    // =========================================================================
    // LINEAGE REGISTRY
    // =========================================================================

    /**
     * LineageRegistry(nFounders, options?) → registry
     *
     * Tracks per-lineage counts, peaks, lifespans, and optional trait means.
     * Uses typed arrays throughout to avoid GC churn at high node counts.
     *
     * options: {
     *   trackTraits?: string[]       — trait names to track means for
     *   schema?: TraitSchema         — if provided, uses schema to detect circular traits
     *   fadingThreshold?: number     — fraction of peak below which status → "fading" (default 0.25)
     * }
     *
     * Lifecycle events must be reported by the consumer (the artifact):
     *   recordBirth(lineageId, tick)                       — node born into this lineage
     *   recordDeath(lineageId, tick)                       — node died in this lineage
     *   updateMeanTrait(lineageId, traitName, meanValue)   — store pre-computed mean
     *
     * The registry does not compute means itself; use circularMean() or the
     * makeCircularMeanTracker() utility if you need in-place incremental tracking.
     *
     * snapshot(currentTick) → [{ id, count, peak, age, bornTick, extinctTick, meanTrait }]
     */
    function LineageRegistry(nFounders, options) {
      options = options || {};
      const N = nFounders;
      const trackTraits = options.trackTraits || [];
      const M = trackTraits.length;
      const fadingThreshold = options.fadingThreshold != null ? options.fadingThreshold : 0.25;

      // Build trait index for O(1) lookup
      const traitIndex = Object.create(null);
      for (let i = 0; i < M; i++) traitIndex[trackTraits[i]] = i;

      // --- Typed arrays ---
      const counts      = new Int32Array(N);      // current live node count
      const peaks       = new Int32Array(N);      // peak count ever seen
      const bornTick    = new Int32Array(N);      // tick of first birth; -1 if never born
      const extinctTick = new Int32Array(N);      // tick of extinction; -1 if still alive
      const meanTraits  = new Float32Array(N * M);// [lineageId * M + traitIdx]

      // Initialise sentinels
      bornTick.fill(-1);
      extinctTick.fill(-1);

      const registry = {
        /**
         * Report a new node born into lineageId at the given tick.
         * Sets bornTick on first call, updates count and peak.
         */
        recordBirth(lineageId, tick) {
          if (bornTick[lineageId] === -1) bornTick[lineageId] = tick;
          if (extinctTick[lineageId] !== -1) extinctTick[lineageId] = -1; // revived
          counts[lineageId]++;
          if (counts[lineageId] > peaks[lineageId]) peaks[lineageId] = counts[lineageId];
        },

        /**
         * Report a node death in lineageId at the given tick.
         * Records extinctTick when count reaches zero — the only reliable
         * way to know when extinction happened for downstream Phylogeny work.
         */
        recordDeath(lineageId, tick) {
          counts[lineageId]--;
          if (counts[lineageId] < 0) counts[lineageId] = 0;
          if (counts[lineageId] === 0) extinctTick[lineageId] = tick;
        },

        /**
         * Store a pre-computed trait mean for this lineage.
         * For circular traits use circularMean() to compute the value first.
         * Called once per tick per lineage (not once per node).
         */
        updateMeanTrait(lineageId, traitName, value) {
          const idx = traitIndex[traitName];
          if (idx === undefined) return;
          meanTraits[lineageId * M + idx] = value;
        },

        // --- Query API ---

        count(lineageId) { return counts[lineageId]; },
        peak(lineageId)  { return peaks[lineageId]; },

        isExtinct(lineageId) { return extinctTick[lineageId] !== -1; },
        isBorn(lineageId)    { return bornTick[lineageId] !== -1; },

        /**
         * Status string for a lineage.
         * "extinct"  — count has hit zero
         * "fading"   — count < fadingThreshold * peak
         * "thriving" — otherwise
         */
        status(lineageId) {
          if (extinctTick[lineageId] !== -1) return 'extinct';
          if (counts[lineageId] < peaks[lineageId] * fadingThreshold) return 'fading';
          return 'thriving';
        },

        /** Number of lineages that have been born and are not yet extinct. */
        aliveCount() {
          let n = 0;
          for (let i = 0; i < N; i++) {
            if (bornTick[i] !== -1 && extinctTick[i] === -1) n++;
          }
          return n;
        },

        /** Number of lineages that have gone extinct. */
        extinctCount() {
          let n = 0;
          for (let i = 0; i < N; i++) {
            if (extinctTick[i] !== -1) n++;
          }
          return n;
        },

        /** Number of lineages registered (all IDs 0…nFounders-1). */
        size() { return N; },

        /**
         * Snapshot of all born lineages at currentTick.
         * Returns array of plain objects safe to serialise.
         * age = currentTick - bornTick (or extinctTick - bornTick if extinct).
         */
        snapshot(currentTick) {
          currentTick = currentTick || 0;
          const result = [];
          for (let i = 0; i < N; i++) {
            if (bornTick[i] === -1) continue;
            const extinct = extinctTick[i];
            const born    = bornTick[i];
            const age     = extinct !== -1 ? extinct - born : currentTick - born;
            const meanTrait = Object.create(null);
            for (let j = 0; j < M; j++) {
              meanTrait[trackTraits[j]] = meanTraits[i * M + j];
            }
            result.push({
              id: i,
              count: counts[i],
              peak: peaks[i],
              age,
              bornTick: born,
              extinctTick: extinct,
              status: registry.status(i),
              meanTrait,
            });
          }
          return result;
        },
      };

      return registry;
    }

    // =========================================================================
    // PUBLIC SURFACE
    // =========================================================================

    return {
      VERSION: '1.0.0',

      // PRNG + sampling
      makeXorshift32,
      gauss,

      // Circular math utilities
      circularMean,
      signedCircularDiff,
      wrapCircular,
      makeCircularMeanTracker,

      // Mutation
      MutationKernels,

      // Schema
      TraitSchema,

      // Inheritance operators
      Inheritance,

      // Lineage tracking
      LineageRegistry,
    };

  })(); // end UMAT.Genome IIFE

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
